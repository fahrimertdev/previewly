import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const createSchema = z.object({
  projectId: z.string(),
  url: z.string().url('Must be a valid URL'),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const project = await prisma.project.findUnique({
    where: { id: parsed.data.projectId },
  })
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const preview = await prisma.preview.create({
    data: { url: parsed.data.url, projectId: parsed.data.projectId },
  })

  return NextResponse.json(preview, { status: 201 })
}
