import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { isZodError } from '@/lib/validations'
import { createVaultDocumentSchema } from '@/lib/validations'
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
    const type = searchParams.get('type')
    const scope = searchParams.get('scope')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '50') || 50), 100)

    const where: Record<string, unknown> = { workspaceId: id }
    if (type) where.type = type
    if (scope) where.scope = scope

    const [documents, total] = await Promise.all([
      db.vaultDocument.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.vaultDocument.count({ where }),
    ])

    return NextResponse.json({
      data: documents,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Fetch vault documents error:', error)
    return NextResponse.json({ error: 'Failed to fetch vault documents' }, { status: 500 })
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
    const validated = createVaultDocumentSchema.parse(body)

    const document = await db.vaultDocument.create({
      data: {
        workspaceId: id,
        title: validated.title,
        type: validated.type,
        content: validated.content,
        priority: validated.priority,
        scope: validated.scope,
        visibility: validated.visibility ?? undefined,
        tags: validated.tags ?? undefined,
        metadata: validated.metadata ?? undefined,
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('Create vault document error:', error)
    return NextResponse.json({ error: 'Failed to create vault document' }, { status: 500 })
  }
}
