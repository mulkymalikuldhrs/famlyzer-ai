import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { addMemberSchema } from '@/lib/validations'
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
    const members = await db.workspaceMember.findMany({
      where: { workspaceId: id },
      include: { user: { select: { id: true, email: true, name: true, avatar: true } } },
      orderBy: { authorityLevel: 'desc' },
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Fetch members error:', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
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
    const validated = addMemberSchema.parse(body)

    // Check if user adding is admin/owner
    const adderMembership = await db.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: id, userId: session.user.id } },
    })
    if (!adderMembership || (adderMembership.role !== 'owner' && adderMembership.role !== 'admin')) {
      return NextResponse.json({ error: 'Only owners and admins can add members' }, { status: 403 })
    }

    // Prevent adding with owner role
    if (validated.role === 'owner') {
      return NextResponse.json({ error: 'Cannot assign owner role' }, { status: 400 })
    }

    const member = await db.workspaceMember.create({
      data: {
        workspaceId: id,
        userId: validated.userId,
        alias: validated.alias,
        authorityLevel: validated.authorityLevel,
        role: validated.role,
      },
      include: { user: { select: { id: true, email: true, name: true, avatar: true } } },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('Add member error:', error)
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 })
  }
}
