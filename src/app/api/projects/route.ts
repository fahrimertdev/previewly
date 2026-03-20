import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const createSchema = z.object({
  name: z.string().min(1).max(100),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      previews: {
        include: { _count: { select: { comments: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(projects)
}

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

  const baseSlug = slugify(parsed.data.name) || 'project'
  let slug = baseSlug
  const existing = await prisma.project.findUnique({ where: { slug } })
  if (existing) {
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
  }

  const project = await prisma.project.create({
    data: { name: parsed.data.name, slug, userId: session.user.id },
  })

  return NextResponse.json(project, { status: 201 })
}
