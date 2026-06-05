import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { isZodError } from '@/lib/validations'
import { updateMemberSchema } from '@/lib/validations'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; MemberId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const rateLimit = checkRateLimit(session.user.id, RATE_LIMITS.API_WRITE)
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    const { id, MemberId } = await params
    const body = await request.json()
    const validated = updateMemberSchema.parse(body)
    // Only owners/admins can change roles and authority levels
    const requestorMembership = await db.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: id, userId: session.user.id } },
    })
    if (!requestorMembership) {
      return NextResponse.json({ error: 'Not a workspace member' }, { status: 403 })
    // Prevent non-admin from changing role
    if (validated.role && requestorMembership.role !== 'owner' && requestorMembership.role !== 'admin') {
      return NextResponse.json({ error: 'Only owners/admins can change roles' }, { status: 403 })
    // Prevent changing role to owner
    if (validated.role === 'owner') {
      return NextResponse.json({ error: 'Cannot assign owner role via update' }, { status: 400 })
    const updateData: Record<string, unknown> = {}
    if (validated.alias !== undefined) updateData.alias = validated.alias
    if (validated.authorityLevel !== undefined) updateData.authorityLevel = validated.authorityLevel
    if (validated.energyLevel !== undefined) updateData.energyLevel = validated.energyLevel
    if (validated.stressLevel !== undefined) updateData.stressLevel = validated.stressLevel
    if (validated.constraints !== undefined) updateData.constraints = validated.constraints
    if (validated.preferences !== undefined) updateData.preferences = validated.preferences
    if (validated.visibilityScope !== undefined) updateData.visibilityScope = validated.visibilityScope
    if (validated.role !== undefined) updateData.role = validated.role
    const member = await db.workspaceMember.update({
      where: { id: MemberId },
      data: updateData,
      include: { user: { select: { id: true, email: true, name: true, avatar: true } } },
    return NextResponse.json(member)
  } catch (error: unknown) {
    if (isZodError(error)) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
    console.error('Update member error:', error)
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
  }
}
export async function DELETE(
  _request: NextRequest,
    // Only owners/admins can remove members
    if (!requestorMembership || (requestorMembership.role !== 'owner' && requestorMembership.role !== 'admin')) {
      return NextResponse.json({ error: 'Only owners/admins can remove members' }, { status: 403 })
    // Cannot remove owner
    const targetMember = await db.workspaceMember.findUnique({ where: { id: MemberId } })
    if (targetMember?.role === 'owner') {
      return NextResponse.json({ error: 'Cannot remove workspace owner' }, { status: 400 })
    await db.workspaceMember.delete({ where: { id: MemberId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete member error:', error)
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
