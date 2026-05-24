import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiAgentRunSchema } from '@/lib/validations'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { aiChat as callAi, sanitizeAiInput, SYSTEM_PROMPT } from '@/lib/ai'
import { db } from '@/lib/db'

const AGENT_PROMPTS: Record<string, string> = {
  planner: 'You are the Planner Agent. Focus on task scheduling, time optimization, and resource allocation.',
  finance: 'You are the Finance Agent. Focus on budgets, savings, investments, and financial risk management.',
  mediator: 'You are the Mediator Agent. Focus on family/team harmony, conflict resolution, and communication.',
  health: 'You are the Health Agent. Focus on wellness, stress management, and work-life balance.',
  education: 'You are the Education Agent. Focus on learning goals, skill development, and knowledge management.',
  memory: 'You are the Memory Agent. Focus on organizing memories, insights, and knowledge retrieval.',
  executive: 'You are the Executive Agent. You have authority across all domains and make high-level strategic decisions.',
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rateLimit = checkRateLimit(session.user.id, RATE_LIMITS.AI_AGENT_RUN)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await request.json()
    const validated = aiAgentRunSchema.parse(body)

    // Get workspace context
    const [members, tasks, accounts, memories] = await Promise.all([
      db.workspaceMember.findMany({ where: { workspaceId: validated.workspaceId }, take: 10 }),
      db.task.findMany({ where: { workspaceId: validated.workspaceId, status: { in: ['pending', 'approved'] } }, take: 20 }),
      db.financeAccount.findMany({ where: { workspaceId: validated.workspaceId } }),
      db.memory.findMany({ where: { workspaceId: validated.workspaceId, importance: { gte: 7 } }, orderBy: { createdAt: 'desc' }, take: 10 }),
    ])

    const workspace = await db.workspace.findUnique({ where: { id: validated.workspaceId } })
    const agentPrompt = AGENT_PROMPTS[validated.agentType] || AGENT_PROMPTS.executive

    const userMessage = validated.input
      ? sanitizeAiInput(validated.input)
      : `Analyze the current state and provide ${validated.agentType} insights and actions.`

    const contextMessage = `Workspace: ${workspace?.name} (Level: ${workspace?.autonomousLevel})
Members: ${JSON.stringify(members.map(m => ({ alias: m.alias, energy: m.energyLevel, stress: m.stressLevel })))}
Active tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, priority: t.priority })))}
Accounts: ${JSON.stringify(accounts.map(a => ({ name: a.name, balance: Number(a.balance) })))}
Key memories: ${JSON.stringify(memories.map(m => ({ content: m.content.slice(0, 100), layer: m.layer })))}`

    const { content, error } = await callAi([
      { role: 'system', content: SYSTEM_PROMPT + '\n\n' + agentPrompt },
      { role: 'user', content: contextMessage + '\n\n' + userMessage },
    ], { maxTokens: 2048 })

    if (error) {
      return NextResponse.json({ error: 'Agent run failed: ' + error }, { status: 500 })
    }

    // Log the agent run
    const agentLog = await db.agentLog.create({
      data: {
        workspaceId: validated.workspaceId,
        agentType: validated.agentType,
        action: validated.input ? 'agent_run_with_input' : 'agent_autonomous_run',
        result: content?.slice(0, 500),
        reasoning: validated.input?.slice(0, 200),
        autonomousLevel: workspace?.autonomousLevel,
      },
    })

    // Store in memory
    await db.memory.create({
      data: {
        workspaceId: validated.workspaceId,
        layer: 'short_term',
        category: `agent_${validated.agentType}`,
        content: `[${validated.agentType}] ${content?.slice(0, 500)}`,
        importance: 6,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    return NextResponse.json({ result: content, logId: agentLog.id })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('AI agent run error:', error)
    return NextResponse.json({ error: 'Agent run failed' }, { status: 500 })
  }
}
