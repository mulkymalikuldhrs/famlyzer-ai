import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiChatSchema } from '@/lib/validations'
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
    const rateLimit = checkRateLimit(session.user.id, RATE_LIMITS.AI_CHAT)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    const body = await request.json()
    const validated = aiChatSchema.parse(body)
    // Build context from workspace data if workspaceId provided
    let contextStr = ''
    if (validated.workspaceId) {
      const [members, tasks, accounts] = await Promise.all([
        db.workspaceMember.findMany({ where: { workspaceId: validated.workspaceId }, take: 10 }),
        db.task.findMany({ where: { workspaceId: validated.workspaceId, status: { in: ['pending', 'approved'] } }, take: 20 }),
        db.financeAccount.findMany({ where: { workspaceId: validated.workspaceId } }),
      ])
      contextStr = `Workspace context:\n- Members: ${members.length}\n- Active tasks: ${tasks.length}\n- Accounts: ${accounts.map(a => `${a.name}: ${a.balance}`).join(', ')}`
    if (validated.context) {
      contextStr += `\n\nUser context: ${sanitizeAiInput(validated.context)}`
    // Build messages - NEVER allow client to inject system role
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT + (contextStr ? '\n\n' + contextStr : '') },
      ...validated.messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: sanitizeAiInput(m.content),
      })),
    ]
    const { content, error } = await callAi(messages)
    if (error) {
      return NextResponse.json({ error: 'AI processing failed: ' + error }, { status: 500 })
    // Store chat in memory if workspace context
    if (validated.workspaceId && content) {
      await db.memory.create({
        data: {
          workspaceId: validated.workspaceId,
          layer: 'short_term',
          category: 'chat',
          content: `User: ${validated.messages[validated.messages.length - 1]?.content?.slice(0, 200)} | AI: ${content.slice(0, 200)}`,
          importance: 3,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      })
    return NextResponse.json({ content })
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    console.error('AI chat error:', error)
    return NextResponse.json({ error: 'AI chat failed' }, { status: 500 })
  }
}
