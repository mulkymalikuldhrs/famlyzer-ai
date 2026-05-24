import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createFinancialGoalSchema } from '@/lib/validations'
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
    const goals = await db.financialGoal.findMany({
      where: { workspaceId: id },
      orderBy: { priority: 'desc' },
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Fetch financial goals error:', error)
    return NextResponse.json({ error: 'Failed to fetch financial goals' }, { status: 500 })
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
    const validated = createFinancialGoalSchema.parse(body)

    const goal = await db.financialGoal.create({
      data: {
        workspaceId: id,
        name: validated.name,
        targetAmount: validated.targetAmount,
        currentAmount: validated.currentAmount,
        deadline: validated.deadline ? new Date(validated.deadline) : null,
        priority: validated.priority,
      },
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('Create financial goal error:', error)
    return NextResponse.json({ error: 'Failed to create financial goal' }, { status: 500 })
  }
}
