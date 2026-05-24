import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; MemberId: string }> }
) {
  try {
    const { id: workspaceId, MemberId } = await params
    const body = await request.json()
    const { energyLevel, stressLevel, alias, authorityLevel, constraints, preferences, visibilityScope, role } = body

    const member = await db.workspaceMember.findFirst({
      where: { id: MemberId, workspaceId },
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    const updated = await db.workspaceMember.update({
      where: { id: MemberId },
      data: {
        ...(energyLevel !== undefined && { energyLevel }),
        ...(stressLevel !== undefined && { stressLevel }),
        ...(alias !== undefined && { alias }),
        ...(authorityLevel !== undefined && { authorityLevel }),
        ...(constraints !== undefined && { constraints: JSON.stringify(constraints) }),
        ...(preferences !== undefined && { preferences: JSON.stringify(preferences) }),
        ...(visibilityScope !== undefined && { visibilityScope: JSON.stringify(visibilityScope) }),
        ...(role !== undefined && { role }),
      },
    })

    return NextResponse.json({ member: updated })
  } catch (error) {
    console.error('Update member error:', error)
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
  }
}
