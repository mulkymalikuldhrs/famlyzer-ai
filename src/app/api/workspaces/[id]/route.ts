import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { isZodError } from '@/lib/validations'
import { updateWorkspaceSchema } from '@/lib/validations'
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
    const workspace = await db.workspace.findUnique({
      where: { id },
      include: { members: true },
    })

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    return NextResponse.json(workspace)
  } catch (error) {
    console.error('Fetch workspace error:', error)
    return NextResponse.json({ error: 'Failed to fetch workspace' }, { status: 500 })
  }
}

export async function PATCH(
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
    const validated = updateWorkspaceSchema.parse(body)

    // Verify the user is owner/admin of this workspace
    const membership = await db.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: id, userId: session.user.id } },
    })

    if (!membership || (membership.role !== 'owner' && membership.role !== 'admin')) {
      return NextResponse.json({ error: 'Only owners and admins can update workspace settings' }, { status: 403 })
    }

    // Warning for autonomous level changes
    if (validated.autonomousLevel !== undefined && validated.autonomousLevel >= 2) {
      // The client should show a confirmation dialog before this call
      // Log the level change for audit trail
      await db.agentLog.create({
        data: {
          workspaceId: id,
          agentType: 'executive',
          action: 'autonomous_level_change',
          result: `Level changed to ${validated.autonomousLevel}`,
          reasoning: `Changed by user ${session.user.id}`,
        },
      })
    }

    const workspace = await db.workspace.update({
      where: { id },
      data: validated,
    })

    return NextResponse.json(workspace)
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('Update workspace error:', error)
    return NextResponse.json({ error: 'Failed to update workspace' }, { status: 500 })
  }
}
