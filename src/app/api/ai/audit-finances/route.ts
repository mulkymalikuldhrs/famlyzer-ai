import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiAuditFinancesSchema } from '@/lib/validations'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { aiChat as callAi, sanitizeAiInput, SYSTEM_PROMPT } from '@/lib/ai'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rateLimit = checkRateLimit(session.user.id, RATE_LIMITS.AI_AUDIT)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await request.json()
    const validated = aiAuditFinancesSchema.parse(body)

    const [accounts, transactions, budgetRules, goals] = await Promise.all([
      db.financeAccount.findMany({ where: { workspaceId: validated.workspaceId } }),
      db.transaction.findMany({ where: { workspaceId: validated.workspaceId }, orderBy: { date: 'desc' }, take: 100 }),
      db.budgetRule.findMany({ where: { workspaceId: validated.workspaceId, isActive: true } }),
      db.financialGoal.findMany({ where: { workspaceId: validated.workspaceId } }),
    ])

    const auditPrompt = `Perform a comprehensive financial audit.

Accounts: ${JSON.stringify(accounts.map(a => ({ name: a.name, balance: Number(a.balance), type: a.type, isEmergency: a.isEmergency })))}

Recent transactions: ${JSON.stringify(transactions.map(t => ({ amount: Number(t.amount), category: t.category, type: t.type, date: t.date })))}

Budget rules: ${JSON.stringify(budgetRules.map(r => ({ category: r.category, limit: Number(r.limitAmount), period: r.period, priority: r.priority })))}

Financial goals: ${JSON.stringify(goals.map(g => ({ name: g.name, target: Number(g.targetAmount), current: Number(g.currentAmount), deadline: g.deadline })))}

Analyze: spending patterns, budget adherence, savings rate, emergency fund adequacy, goal progress, and provide specific financial recommendations.

Respond in JSON format: {"summary":"...","spendingPatterns":{},"budgetAnalysis":{},"savingsRate":0,"emergencyFundStatus":"...","goalProgress":{},"recommendations":[],"riskAlerts":[]}`

    const { content, error } = await callAi([
      { role: 'system', content: SYSTEM_PROMPT + '\n\nYou are the Finance Agent specializing in financial auditing and analysis.' },
      { role: 'user', content: sanitizeAiInput(auditPrompt) },
    ], { maxTokens: 2048 })

    if (error) {
      return NextResponse.json({ error: 'AI audit failed: ' + error }, { status: 500 })
    }

    await db.agentLog.create({
      data: {
        workspaceId: validated.workspaceId,
        agentType: 'finance',
        action: 'financial_audit',
        result: content?.slice(0, 500),
      },
    })

    // Store audit result in long-term memory
    await db.memory.create({
      data: {
        workspaceId: validated.workspaceId,
        layer: 'decision',
        category: 'financial_audit',
        content: content?.slice(0, 2000) || '',
        importance: 8,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
    })

    return NextResponse.json({ audit: content })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('AI audit finances error:', error)
    return NextResponse.json({ error: 'AI financial audit failed' }, { status: 500 })
  }
}
