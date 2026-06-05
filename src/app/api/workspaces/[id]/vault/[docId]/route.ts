import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { isZodError } from '@/lib/validations'
import { updateVaultDocumentSchema } from '@/lib/validations'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const rateLimit = checkRateLimit(session.user.id, RATE_LIMITS.API_WRITE)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    const { docId } = await params
    const body = await request.json()
    const validated = updateVaultDocumentSchema.parse(body)
    const updateData: Record<string, unknown> = {}
    if (validated.title !== undefined) updateData.title = validated.title
    if (validated.type !== undefined) updateData.type = validated.type
    if (validated.content !== undefined) updateData.content = validated.content
    if (validated.priority !== undefined) updateData.priority = validated.priority
    if (validated.scope !== undefined) updateData.scope = validated.scope
    if (validated.visibility !== undefined) updateData.visibility = validated.visibility
    if (validated.tags !== undefined) updateData.tags = validated.tags
    if (validated.metadata !== undefined) updateData.metadata = validated.metadata
    const document = await db.vaultDocument.update({
      where: { id: docId },
      data: updateData,
    })
    return NextResponse.json(document)
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    console.error('Update vault document error:', error)
    return NextResponse.json({ error: 'Failed to update vault document' }, { status: 500 })
  }
}
export async function DELETE(
  _request: NextRequest,
    await db.vaultDocument.delete({ where: { id: docId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete vault document error:', error)
    return NextResponse.json({ error: 'Failed to delete vault document' }, { status: 500 })
