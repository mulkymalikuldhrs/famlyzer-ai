import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { isZodError } from '@/lib/validations'
import { createTaskSchema } from '@/lib/validations'
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
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '50') || 50), 100)
    if (status) where.status = status
    if (priority) where.priority = priority
    const [tasks, total] = await Promise.all([
      db.task.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.task.count({ where }),
    ])
    return NextResponse.json({
      data: tasks,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Fetch tasks error:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}
export async function POST(
    const rateLimit = checkRateLimit(session.user.id, RATE_LIMITS.API_WRITE)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    const body = await request.json()
    const validated = createTaskSchema.parse(body)
    const task = await db.task.create({
      data: {
        workspaceId: id,
        title: validated.title,
        description: validated.description,
        timeCost: validated.timeCost,
        energyCost: validated.energyCost,
        moneyCost: validated.moneyCost,
        priority: validated.priority,
        assignedToId: validated.assignedTo || null,
        dependencies: validated.dependencies ?? undefined,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      },
    return NextResponse.json(task, { status: 201 })
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    console.error('Create task error:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
