// Simple in-memory rate limiter (for production, use Redis-based like @upstash/ratelimit)
// This provides basic protection without external dependencies

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  windowMs: number  // Time window in milliseconds
  maxRequests: number // Max requests per window
}

// Preset configurations
export const RATE_LIMITS = {
  // AI endpoints - expensive, strict limits
  AI_CHAT: { windowMs: 60 * 1000, maxRequests: 20 },       // 20/min
  AI_ANALYZE: { windowMs: 60 * 1000, maxRequests: 10 },     // 10/min
  AI_AGENT_RUN: { windowMs: 60 * 1000, maxRequests: 5 },    // 5/min
  AI_SUGGEST: { windowMs: 60 * 1000, maxRequests: 10 },     // 10/min
  AI_OPTIMIZE: { windowMs: 60 * 1000, maxRequests: 10 },    // 10/min
  AI_AUDIT: { windowMs: 60 * 1000, maxRequests: 10 },       // 10/min

  // Standard API endpoints
  API_STANDARD: { windowMs: 60 * 1000, maxRequests: 60 },   // 60/min
  API_WRITE: { windowMs: 60 * 1000, maxRequests: 30 },      // 30/min
  API_AUTH: { windowMs: 15 * 60 * 1000, maxRequests: 10 },  // 10/15min (brute force protection)
} as const

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || now > entry.resetTime) {
    // New window
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    }
    rateLimitStore.set(identifier, newEntry)
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    }
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  entry.count++
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}
