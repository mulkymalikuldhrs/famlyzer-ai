import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { isZodError } from '@/lib/validations'
import { createBudgetRuleSchema } from '@/lib/validations'
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
    const rules = await db.budgetRule.findMany({
      where: { workspaceId: id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(rules)
  } catch (error) {
    console.error('Fetch budget rules error:', error)
    return NextResponse.json({ error: 'Failed to fetch budget rules' }, { status: 500 })
  }
}
export async function POST(
  request: NextRequest,
    const rateLimit = checkRateLimit(session.user.id, RATE_LIMITS.API_WRITE)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    const body = await request.json()
    const validated = createBudgetRuleSchema.parse(body)
    const rule = await db.budgetRule.create({
      data: {
        workspaceId: id,
        category: validated.category,
        limitAmount: validated.limitAmount,
        period: validated.period,
        priority: validated.priority,
        isActive: validated.isActive,
      },
    return NextResponse.json(rule, { status: 201 })
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    console.error('Create budget rule error:', error)
    return NextResponse.json({ error: 'Failed to create budget rule' }, { status: 500 })
