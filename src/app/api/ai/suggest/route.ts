import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiSuggestSchema } from '@/lib/validations'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { isZodError } from '@/lib/validations'
import { aiChat as callAi, sanitizeAiInput, SYSTEM_PROMPT } from '@/lib/ai'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rateLimit = checkRateLimit(session.user.id, RATE_LIMITS.AI_SUGGEST)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await request.json()
    const validated = aiSuggestSchema.parse(body)

    // Gather workspace context
    const [tasks, transactions, suggestions] = await Promise.all([
      db.task.findMany({ where: { workspaceId: validated.workspaceId }, take: 30 }),
      db.transaction.findMany({ where: { workspaceId: validated.workspaceId }, orderBy: { date: 'desc' }, take: 50 }),
      db.suggestion.findMany({ where: { workspaceId: validated.workspaceId, status: 'pending' }, take: 10 }),
    ])

    const suggestPrompt = `Generate ${validated.type} suggestions for this workspace.
Current tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, status: t.status, priority: t.priority })))}
Recent transactions: ${JSON.stringify(transactions.map(t => ({ amount: Number(t.amount), category: t.category, type: t.type })))}
Pending suggestions: ${suggestions.length}
Create 1-5 actionable ${validated.type} suggestions. Each should have: title, reason, consequence (if ignored), and actionData (JSON with specific steps).
Respond ONLY with a JSON array: [{"title":"...","reason":"...","consequence":"...","actionData":{}}]`

    const { content, error } = await callAi([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: sanitizeAiInput(suggestPrompt) },
    ], { maxTokens: 2048 })

    if (error) {
      return NextResponse.json({ error: 'AI suggestion failed: ' + error }, { status: 500 })
    }

    // Parse AI response and create suggestions in DB
    let suggestionsData: Array<{ title: string; reason: string; consequence?: string; actionData?: unknown }> = []
    try {
      const match = content?.match(/\[[\s\S]*\]/)
      if (match) suggestionsData = JSON.parse(match[0])
    } catch {
      // Fallback: create a single suggestion from raw response
      suggestionsData = [{ title: `AI ${validated.type} suggestion`, reason: content || 'No reason provided' }]
    }

    const created = await db.$transaction(
      suggestionsData.slice(0, 5).map(s =>
        db.suggestion.create({
          data: {
            workspaceId: validated.workspaceId,
            type: validated.type,
            agentSource: 'executive',
            title: s.title,
            reason: s.reason,
            consequence: s.consequence,
            actionData: s.actionData ? s.actionData : undefined,
          },
        })
      )
    )

    // Log the action
    await db.agentLog.create({
      data: {
        workspaceId: validated.workspaceId,
        agentType: 'executive',
        action: `suggest_${validated.type}`,
        result: `Created ${created.length} suggestions`,
      },
    })

    return NextResponse.json({ suggestions: created })
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('AI suggest error:', error)
    return NextResponse.json({ error: 'AI suggestion failed' }, { status: 500 })
  }
}
