import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isZodError } from '@/lib/validations'
import { authSetupSchema } from '@/lib/validations'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Rate limit auth attempts
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(`auth:${clientIp}`, RATE_LIMITS.API_AUTH)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validated = authSetupSchema.parse(body)

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validated.email },
      include: {
        workspaces: {
          include: { workspace: true },
        },
      },
    })

    if (existingUser) {
      // Verify password for existing user
      if (!existingUser.passwordHash || !(await bcrypt.compare(validated.password, existingUser.passwordHash))) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
      }
      return NextResponse.json({
        user: { id: existingUser.id, email: existingUser.email, name: existingUser.name, avatar: existingUser.avatar, createdAt: existingUser.createdAt, updatedAt: existingUser.updatedAt },
        workspaces: existingUser.workspaces.map((wm) => ({
          ...wm.workspace,
          userRole: wm.role,
          userAlias: wm.alias,
        })),
      })
    }

    // Create new user with hashed password
    const passwordHash = await bcrypt.hash(validated.password, 12)
    const user = await db.user.create({
      data: {
        email: validated.email,
        name: validated.name || null,
        passwordHash,
      },
    })

    return NextResponse.json(
      {
        user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, createdAt: user.createdAt, updatedAt: user.updatedAt },
        workspaces: [],
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    }
    console.error('Auth setup error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
