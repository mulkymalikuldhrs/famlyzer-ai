import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { isZodError } from '@/lib/validations'
import { createWorkspaceSchema } from '@/lib/validations'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rateLimit = checkRateLimit(session.user.id, RATE_LIMITS.API_WRITE)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await request.json()
    const validated = createWorkspaceSchema.parse({
      ...body,
      userId: session.user.id, // Always use authenticated user's ID
    })

    // Check workspace limits based on subscription
    const existingWorkspaces = await db.workspaceMember.count({
      where: { userId: session.user.id },
    })

    // TODO: Check subscription tier limits from PRICING config
    void existingWorkspaces // Suppress unused warning until TODO is implemented

    const workspace = await db.workspace.create({
      data: {
        name: validated.name,
        type: validated.type,
        trialStart: new Date(),
        trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        members: {
          create: {
            userId: session.user.id,
            role: 'owner',
            authorityLevel: 5,
          },
        },
      },
      include: { members: true },
    })

    return NextResponse.json(workspace, { status: 201 })
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ error: 'Validation failed', details: error }, { status: 400 })
    }
    console.error('Create workspace error:', error)
    return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const memberships = await db.workspaceMember.findMany({
      where: { userId: session.user.id },
      include: { workspace: true },
      orderBy: { createdAt: 'desc' },
    })

    const workspaces = memberships.map((m) => ({
      ...m.workspace,
      userRole: m.role,
      userAlias: m.alias,
    }))

    return NextResponse.json(workspaces)
  } catch (error) {
    console.error('Fetch workspaces error:', error)
    return NextResponse.json({ error: 'Failed to fetch workspaces' }, { status: 500 })
  }
}
