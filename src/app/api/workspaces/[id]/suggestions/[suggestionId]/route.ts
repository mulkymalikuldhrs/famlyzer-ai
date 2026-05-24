import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateSuggestionSchema } from '@/lib/validations'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; suggestionId: string }> }
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

    const { suggestionId } = await params
    const body = await request.json()
    const validated = updateSuggestionSchema.parse(body)

    const suggestion = await db.suggestion.update({
      where: { id: suggestionId },
      data: { status: validated.status },
    })

    return NextResponse.json(suggestion)
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('Update suggestion error:', error)
    return NextResponse.json({ error: 'Failed to update suggestion' }, { status: 500 })
  }
}
