import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        workspaces: {
          include: { workspace: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, createdAt: user.createdAt, updatedAt: user.updatedAt },
      workspaces: user.workspaces.map((wm) => ({
        ...wm.workspace,
        userRole: wm.role,
        userAlias: wm.alias,
      })),
    })
  } catch (error) {
    console.error('Fetch user error:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
