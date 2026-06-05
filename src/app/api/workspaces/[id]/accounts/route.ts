import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { isZodError } from '@/lib/validations'
import { createAccountSchema } from '@/lib/validations'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const accounts = await db.financeAccount.findMany({
      where: { workspaceId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error('Fetch accounts error:', error)
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 })
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
    const validated = createAccountSchema.parse(body)

    const account = await db.financeAccount.create({
      data: {
        workspaceId: id,
        name: validated.name,
        type: validated.type,
        balance: validated.balance,
        currency: validated.currency,
        isEmergency: validated.isEmergency,
      },
    })

    return NextResponse.json(account, { status: 201 })
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('Create account error:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
