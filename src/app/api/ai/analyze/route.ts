import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiAnalyzeSchema } from '@/lib/validations'
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

    const rateLimit = checkRateLimit(session.user.id, RATE_LIMITS.AI_ANALYZE)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await request.json()
    const validated = aiAnalyzeSchema.parse(body)

    // Gather workspace data (limit data sent to AI)
    const [members, tasks, accounts, transactions, goals] = await Promise.all([
      db.workspaceMember.findMany({ where: { workspaceId: validated.workspaceId }, take: 10 }),
      db.task.findMany({ where: { workspaceId: validated.workspaceId }, take: 50 }),
      db.financeAccount.findMany({ where: { workspaceId: validated.workspaceId } }),
      db.transaction.findMany({ where: { workspaceId: validated.workspaceId }, orderBy: { date: 'desc' }, take: 100 }),
      db.financialGoal.findMany({ where: { workspaceId: validated.workspaceId } }),
    ])

    const analysisPrompt = `Analyze this workspace comprehensively:
Members: ${JSON.stringify(members.map(m => ({ alias: m.alias, energy: m.energyLevel, stress: m.stressLevel, role: m.role })))}
Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, status: t.status, priority: t.priority, energy: t.energyCost, time: t.timeCost })))}
Accounts: ${JSON.stringify(accounts.map(a => ({ name: a.name, balance: Number(a.balance), type: a.type })))}
Recent Transactions: ${JSON.stringify(transactions.map(t => ({ amount: Number(t.amount), category: t.category, type: t.type })))}
Goals: ${JSON.stringify(goals.map(g => ({ name: g.name, target: Number(g.targetAmount), current: Number(g.currentAmount) })))}
Provide a comprehensive analysis covering: financial health, task efficiency, member workload balance, risks, and 3-5 actionable recommendations. Respond in JSON format with keys: summary, financialHealth, taskEfficiency, memberBalance, risks, recommendations.`

    const { content, error } = await callAi([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: sanitizeAiInput(analysisPrompt) },
    ], { maxTokens: 2048 })

    if (error) {
      return NextResponse.json({ error: 'AI analysis failed: ' + error }, { status: 500 })
    }

    // Log the analysis
    await db.agentLog.create({
      data: {
        workspaceId: validated.workspaceId,
        agentType: 'executive',
        action: 'comprehensive_analysis',
        result: content?.slice(0, 500),
      },
    })

    return NextResponse.json({ analysis: content })
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('AI analyze error:', error)
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 })
  }
}
