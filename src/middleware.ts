import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { db } from '@/lib/db'

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/api/auth/setup',
  '/api/auth',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow root API health check (GET only)
  if (pathname === '/api' && request.method === 'GET') {
    return NextResponse.next()
  }

  // Require auth for all other API routes
  if (pathname.startsWith('/api/')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Workspace authorization check
    const workspaceMatch = pathname.match(/\/api\/workspaces\/([^/]+)/)
    if (workspaceMatch) {
      const workspaceId = workspaceMatch[1]
      const userId = token.id as string

      const membership = await db.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId } },
      })

      if (!membership) {
        return NextResponse.json({ error: 'Access denied: not a workspace member' }, { status: 403 })
      }
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
