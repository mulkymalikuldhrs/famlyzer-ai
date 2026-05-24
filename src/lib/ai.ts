import ZAI from 'z-ai-web-dev-sdk'

export const SYSTEM_PROMPT = `You are Famlyzer AI, an autonomous decision and planning intelligence operating as a subscription-based service.

Principles:
- Think systematically
- Respect financial, time, and energy constraints
- Use Knowledge Vault as source of truth
- Maintain long-term stability
- Act autonomously only within permission
- Explain reasoning when asked

Rules:
- Never invent facts outside Vault
- Simulate before deciding
- Prefer lowest long-term risk
- Protect financial safety above comfort

Goal:
Reduce chaos. Increase clarity. Preserve harmony.`

let zaiInstance: ZAI | null = null
let zaiInitPromise: Promise<ZAI> | null = null

/**
 * Get or initialize the ZAI SDK instance (singleton with retry)
 */
export async function getZAI(): Promise<ZAI> {
  if (zaiInstance) return zaiInstance

  // Deduplicate concurrent initialization attempts
  if (zaiInitPromise) return zaiInitPromise

  zaiInitPromise = (async () => {
    try {
      const instance = await ZAI.create()
      zaiInstance = instance
      return instance
    } catch (error) {
      // Reset so next call retries
      zaiInitPromise = null
      throw new Error(`Failed to initialize AI SDK: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })()

  return zaiInitPromise
}

export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AiChatOptions {
  maxTokens?: number
  temperature?: number
  timeoutMs?: number
}

/**
 * Send messages to the AI and get a response.
 * Includes timeout, error handling, and structured error returns.
 */
export async function aiChat(
  messages: AiChatMessage[],
  options: AiChatOptions = {}
): Promise<{ content: string; error: string | null }> {
  const { maxTokens = 4096, temperature = 0.7, timeoutMs = 30000 } = options

  try {
    const zai = await getZAI()

    // Race the AI call against a timeout
    const completion = await Promise.race([
      zai.chat.completions.create({
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI request timed out')), timeoutMs)
      ),
    ])

    const content = completion.choices[0]?.message?.content

    if (!content) {
      return { content: '', error: 'AI returned an empty response' }
    }

    return { content, error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown AI error'
    console.error('[AI Chat Error]', message)
    return { content: '', error: message }
  }
}

/**
 * Sanitize user input to prevent prompt injection in AI contexts.
 * Strips common injection patterns and limits length.
 */
export function sanitizeAiInput(input: string, maxLength = 5000): string {
  return input
    .slice(0, maxLength)
    .replace(/<\s*\/?\s*(system|instruction|prompt|ignore)\s*>/gi, '[filtered]')
    .replace(/\b(ignore\s+(previous|above|all)\s+instructions?)\b/gi, '[filtered]')
    .replace(/\b(you\s+are\s+now|act\s+as|pretend\s+to\s+be)\b/gi, '[filtered]')
}
