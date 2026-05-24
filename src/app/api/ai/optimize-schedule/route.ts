import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiOptimizeScheduleSchema } from '@/lib/validations'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { aiChat as callAi, sanitizeAiInput, SYSTEM_PROMPT } from '@/lib/ai'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rateLimit = checkRateLimit(session.user.id, RATE_LIMITS.AI_OPTIMIZE)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await request.json()
    const validated = aiOptimizeScheduleSchema.parse(body)

    const [tasks, members] = await Promise.all([
      db.task.findMany({ where: { workspaceId: validated.workspaceId, status: { in: ['pending', 'approved'] } }, take: 50 }),
      db.workspaceMember.findMany({ where: { workspaceId: validated.workspaceId }, take: 10 }),
    ])

    const schedulePrompt = `Optimize the task schedule for this workspace.

Tasks: ${JSON.stringify(tasks.map(t => ({
  title: t.title,
  priority: t.priority,
  timeCost: t.timeCost,
  energyCost: t.energyCost,
  dueDate: t.dueDate,
  dependencies: t.dependencies,
})))}

Members: ${JSON.stringify(members.map(m => ({
  alias: m.alias,
  energy: m.energyLevel,
  stress: m.stressLevel,
  constraints: m.constraints,
})))}

Create an optimized schedule that:
1. Respects task dependencies
2. Balances member workload
3. Prioritizes high-priority tasks
4. Considers energy levels and constraints

Respond with a JSON object: {"schedule":[{"taskId":"...","assignedTo":"member_alias","suggestedTime":"morning/afternoon/evening","reason":"..."}],"summary":"..."}`

    const { content, error } = await callAi([
      { role: 'system', content: SYSTEM_PROMPT + '\n\nYou are the Planner Agent specializing in schedule optimization.' },
      { role: 'user', content: sanitizeAiInput(schedulePrompt) },
    ], { maxTokens: 2048 })

    if (error) {
      return NextResponse.json({ error: 'AI optimization failed: ' + error }, { status: 500 })
    }

    await db.agentLog.create({
      data: {
        workspaceId: validated.workspaceId,
        agentType: 'planner',
        action: 'optimize_schedule',
        result: content?.slice(0, 500),
      },
    })

    return NextResponse.json({ optimization: content })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('AI optimize schedule error:', error)
    return NextResponse.json({ error: 'AI schedule optimization failed' }, { status: 500 })
  }
}
