import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/previews/[shareId] — public, uses the shareId field
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params

  const preview = await prisma.preview.findUnique({
    where: { shareId },
    include: {
      comments: { orderBy: { createdAt: 'asc' } },
      project: { select: { name: true, slug: true } },
    },
  })

  if (!preview) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(preview)
}

// DELETE /api/previews/[id] — authenticated, uses the DB id field
// Note: the route segment is named shareId but for DELETE we pass the DB id
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { shareId: id } = await params

  const preview = await prisma.preview.findUnique({
    where: { id },
    include: { project: true },
  })

  if (!preview) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (preview.project.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.preview.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
