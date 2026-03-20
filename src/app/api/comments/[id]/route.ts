import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { NextResponse } from 'next/server'

async function getCommentWithOwnership(id: string, userId: string) {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { preview: { include: { project: true } } },
  })
  if (!comment) return null
  if (comment.preview.project.userId !== userId) return null
  return comment
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const schema = z.object({ resolved: z.boolean() })
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const comment = await getCommentWithOwnership(id, session.user.id)
  if (!comment) {
    return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 })
  }

  const updated = await prisma.comment.update({
    where: { id },
    data: { resolved: parsed.data.resolved },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const comment = await getCommentWithOwnership(id, session.user.id)
  if (!comment) {
    return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 })
  }

  await prisma.comment.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
