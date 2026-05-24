import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    name: 'Famlyzer AI',
    version: '3.1.0',
    description: 'Autonomous AI Decision & Planning Intelligence',
    status: 'operational',
    endpoints: {
      auth: '/api/auth/setup',
      workspaces: '/api/workspaces',
      ai: '/api/ai/chat',
      subscriptions: '/api/subscriptions',
    },
  })
}
