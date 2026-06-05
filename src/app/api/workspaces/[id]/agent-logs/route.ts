import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

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
    const agentType = searchParams.get('agentType')
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '50') || 50), 100)

    const where: Record<string, unknown> = { workspaceId: id }
    if (agentType) where.agentType = agentType

    const logs = await db.agentLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Fetch agent logs error:', error)
    return NextResponse.json({ error: 'Failed to fetch agent logs' }, { status: 500 })
  }
}
