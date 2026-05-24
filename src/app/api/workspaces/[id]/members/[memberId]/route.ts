import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id: workspaceId, memberId } = await params
    const body = await request.json()
    const { energyLevel, stressLevel, alias, authorityLevel, constraints, preferences, visibilityScope, role } = body

    const member = await db.workspaceMember.findFirst({
      where: { id: memberId, workspaceId },
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    const updated = await db.workspaceMember.update({
      where: { id: memberId },
      data: {
        ...(energyLevel !== undefined && { energyLevel }),
        ...(stressLevel !== undefined && { stressLevel }),
        ...(alias !== undefined && { alias }),
        ...(authorityLevel !== undefined && { authorityLevel }),
        ...(constraints !== undefined && { constraints: typeof constraints === 'object' ? JSON.stringify(constraints) : constraints }),
        ...(preferences !== undefined && { preferences: typeof preferences === 'object' ? JSON.stringify(preferences) : preferences }),
        ...(visibilityScope !== undefined && { visibilityScope: typeof visibilityScope === 'object' ? JSON.stringify(visibilityScope) : visibilityScope }),
        ...(role !== undefined && { role }),
      },
      include: {
        user: {
          select: { id: true, email: true, name: true, avatar: true },
        },
      },
    })

    return NextResponse.json({ member: updated })
  } catch (error) {
    console.error('Update member error:', error)
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
  }
}
