import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { isZodError } from '@/lib/validations'
import { createTransactionSchema } from '@/lib/validations'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const where: Record<string, unknown> = { workspaceId: id }
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '50') || 50), 100)

    if (category) where.category = category
    if (type) where.type = type
    if (startDate || endDate) {
      where.date = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      }
    }

    const [transactions, total] = await Promise.all([
      db.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.transaction.count({ where }),
    ])

    return NextResponse.json({
      data: transactions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Fetch transactions error:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rateLimit = checkRateLimit(session.user.id, RATE_LIMITS.API_WRITE)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const { id } = await params
    const body = await request.json()
    const validated = createTransactionSchema.parse(body)

    // Use Prisma transaction for atomicity: create transaction + update account balance
    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          workspaceId: id,
          accountId: validated.accountId || null,
          amount: validated.amount,
          category: validated.category,
          type: validated.type,
          description: validated.description,
          date: validated.date ? new Date(validated.date) : new Date(),
          isRecurring: validated.isRecurring,
        },
      })

      // Update account balance if accountId provided
      if (validated.accountId) {
        const account = await tx.financeAccount.findUnique({
          where: { id: validated.accountId },
        })

        if (account) {
          const balanceChange = validated.type === 'income'
            ? validated.amount
            : validated.type === 'expense'
            ? -validated.amount
            : 0 // transfer handled separately

          await tx.financeAccount.update({
            where: { id: validated.accountId },
            data: { balance: { increment: balanceChange } },
          })
        }
      }

      return newTransaction
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('Create transaction error:', error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}
