import { z } from 'zod'

// ── Auth ──
export const authSetupSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
})

export const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// ── User ──
export const userQuerySchema = z.object({
  email: z.string().email(),
})

// ── Workspaces ──
export const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim(),
  type: z.enum(['personal', 'family', 'company']).default('personal'),
  userId: z.string().cuid(),
})

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  type: z.enum(['personal', 'family', 'company']).optional(),
  autonomousLevel: z.number().int().min(0).max(3).optional(),
})

// ── Members ──
export const addMemberSchema = z.object({
  userId: z.string().cuid(),
  alias: z.string().max(50).optional(),
  authorityLevel: z.number().int().min(1).max(5).default(1),
  role: z.enum(['owner', 'admin', 'member']).default('member'),
})

/** JSON object schema for member constraints/preferences/visibility */
const jsonRecordSchema = z.record(z.string(), z.unknown()).optional()

export const updateMemberSchema = z.object({
  alias: z.string().max(50).optional(),
  authorityLevel: z.number().int().min(1).max(5).optional(),
  energyLevel: z.number().int().min(0).max(100).optional(),
  stressLevel: z.number().int().min(0).max(100).optional(),
  constraints: jsonRecordSchema,
  preferences: jsonRecordSchema,
  visibilityScope: jsonRecordSchema,
  role: z.enum(['owner', 'admin', 'member']).optional(),
})

// ── Tasks ──
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).trim(),
  description: z.string().max(2000).optional(),
  timeCost: z.number().int().min(0).max(10080).default(0), // max 7 days in minutes
  energyCost: z.number().int().min(0).max(100).default(0),
  moneyCost: z.number().min(0).max(1000000).default(0),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  assignedTo: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  dueDate: z.string().datetime().optional(),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  description: z.string().max(2000).optional(),
  timeCost: z.number().int().min(0).max(10080).optional(),
  energyCost: z.number().int().min(0).max(100).optional(),
  moneyCost: z.number().min(0).max(1000000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'done']).optional(),
  assignedTo: z.string().nullable().optional(),
  dependencies: z.array(z.string()).optional(),
  dueDate: z.string().datetime().nullable().optional(),
})

// ── Finance Accounts ──
export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100).trim(),
  type: z.enum(['checking', 'savings', 'investment', 'cash', 'credit']).default('checking'),
  balance: z.number().min(-10000000).max(100000000).default(0),
  currency: z.string().length(3, 'Must be a valid ISO 4217 currency code').default('USD'),
  isEmergency: z.boolean().default(false),
})

// ── Transactions ──
export const createTransactionSchema = z.object({
  accountId: z.string().optional(),
  amount: z.number().finite().min(-10000000).max(100000000),
  category: z.enum(['food', 'transport', 'housing', 'health', 'education', 'entertainment', 'salary', 'investment_return', 'transfer', 'other']).default('other'),
  type: z.enum(['income', 'expense', 'transfer']).default('expense'),
  description: z.string().max(500).optional(),
  date: z.string().datetime().optional(),
  isRecurring: z.boolean().default(false),
})

// ── Budget Rules ──
export const createBudgetRuleSchema = z.object({
  category: z.string().min(1).max(50),
  limitAmount: z.number().finite().positive().max(10000000),
  period: z.enum(['weekly', 'monthly', 'yearly']).default('monthly'),
  priority: z.enum(['low', 'medium', 'high', 'sacred']).default('medium'),
  isActive: z.boolean().default(true),
})

// ── Financial Goals ──
export const createFinancialGoalSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  targetAmount: z.number().finite().positive().max(100000000),
  currentAmount: z.number().finite().min(0).max(100000000).default(0),
  deadline: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
})

// ── Vault ──
export const createVaultDocumentSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  type: z.enum(['note', 'pdf', 'image', 'audio', 'contract', 'rule']).default('note'),
  content: z.string().max(100000).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  scope: z.enum(['workspace', 'family', 'personal']).default('workspace'),
  visibility: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  metadata: jsonRecordSchema,
})

export const updateVaultDocumentSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  type: z.enum(['note', 'pdf', 'image', 'audio', 'contract', 'rule']).optional(),
  content: z.string().max(100000).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  scope: z.enum(['workspace', 'family', 'personal']).optional(),
  visibility: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  metadata: jsonRecordSchema,
})

// ── Memories ──
export const createMemorySchema = z.object({
  layer: z.enum(['short_term', 'long_term', 'decision', 'emotional']).default('short_term'),
  category: z.string().max(50).optional(),
  content: z.string().min(1).max(10000),
  importance: z.number().int().min(1).max(10).default(5),
  expiresAt: z.string().datetime().optional(),
})

// ── Suggestions ──
export const updateSuggestionSchema = z.object({
  status: z.enum(['pending', 'accepted', 'simulated', 'ignored']),
})

// ── Subscriptions ──
export const createSubscriptionSchema = z.object({
  userId: z.string().cuid(),
  tier: z.enum(['free', 'professional', 'business']),
  period: z.enum(['monthly', 'yearly']),
  stripeSessionId: z.string().optional(), // Stripe checkout session
})

// ── AI ──
export const aiChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']), // NEVER allow 'system' from client
    content: z.string().max(5000),
  })).min(1).max(50),
  workspaceId: z.string().optional(),
  context: z.string().max(10000).optional(),
})

export const aiAnalyzeSchema = z.object({
  workspaceId: z.string().cuid(),
})

export const aiSuggestSchema = z.object({
  workspaceId: z.string().cuid(),
  type: z.enum(['preventive', 'corrective', 'strategic', 'behavioral']).default('preventive'),
})

export const aiOptimizeScheduleSchema = z.object({
  workspaceId: z.string().cuid(),
})

export const aiAuditFinancesSchema = z.object({
  workspaceId: z.string().cuid(),
})

export const aiAgentRunSchema = z.object({
  workspaceId: z.string().cuid(),
  agentType: z.enum(['planner', 'finance', 'mediator', 'health', 'education', 'memory', 'executive']),
  input: z.string().max(5000).optional(),
})

// ── Pagination ──
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  cursor: z.string().optional(),
})

/** Helper to check if an error is a ZodError (works across bundlers) */
export function isZodError(error: unknown): error is z.ZodError {
  return error instanceof z.ZodError
}
