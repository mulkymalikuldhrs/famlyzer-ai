import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateTaskSchema } from '@/lib/validations'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
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

    const { id, taskId } = await params
    const body = await request.json()
    const validated = updateTaskSchema.parse(body)

    // Build update data - only allow safe fields (NOT aiRejected/aiRejectionReason from client)
    const updateData: Record<string, unknown> = {}
    if (validated.title !== undefined) updateData.title = validated.title
    if (validated.description !== undefined) updateData.description = validated.description
    if (validated.timeCost !== undefined) updateData.timeCost = validated.timeCost
    if (validated.energyCost !== undefined) updateData.energyCost = validated.energyCost
    if (validated.moneyCost !== undefined) updateData.moneyCost = validated.moneyCost
    if (validated.priority !== undefined) updateData.priority = validated.priority
    if (validated.status !== undefined) {
      updateData.status = validated.status
      if (validated.status === 'done') updateData.completedAt = new Date()
    }
    if (validated.assignedTo !== undefined) updateData.assignedToId = validated.assignedTo
    if (validated.dependencies !== undefined) updateData.dependencies = validated.dependencies
    if (validated.dueDate !== undefined) updateData.dueDate = validated.dueDate ? new Date(validated.dueDate) : null

    const task = await db.task.update({
      where: { id: taskId },
      data: updateData,
    })

    return NextResponse.json(task)
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('Update task error:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { taskId } = await params
    await db.task.delete({ where: { id: taskId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete task error:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
