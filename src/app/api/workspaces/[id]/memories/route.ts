import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createMemorySchema } from '@/lib/validations'
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
    const layer = searchParams.get('layer')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)

    const where: Record<string, unknown> = { workspaceId: id }
    if (layer) where.layer = layer

    const [memories, total] = await Promise.all([
      db.memory.findMany({
        where,
        orderBy: { importance: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.memory.count({ where }),
    ])

    return NextResponse.json({
      data: memories,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Fetch memories error:', error)
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 })
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
    const validated = createMemorySchema.parse(body)

    const memory = await db.memory.create({
      data: {
        workspaceId: id,
        layer: validated.layer,
        category: validated.category,
        content: validated.content,
        importance: validated.importance,
        expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : null,
      },
    })

    return NextResponse.json(memory, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('Create memory error:', error)
    return NextResponse.json({ error: 'Failed to create memory' }, { status: 500 })
  }
}
