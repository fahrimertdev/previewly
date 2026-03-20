import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { NextResponse } from 'next/server'
import { LRUCache } from 'lru-cache'

const rateLimit = new LRUCache<string, number>({ max: 500, ttl: 1000 * 60 })

function getIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous'
}

const createSchema = z.object({
  previewId: z.string(),
  text: z.string().min(1).max(2000),
  authorName: z.string().max(100).optional(),
  xPercent: z.number().min(0).max(100),
  yPercent: z.number().min(0).max(100),
})

export async function POST(req: Request) {
  const ip = getIP(req)
  const count = rateLimit.get(ip) ?? 0
  if (count >= 10) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again in a minute.' }, { status: 429 })
  }
  rateLimit.set(ip, count + 1)

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const preview = await prisma.preview.findUnique({ where: { id: parsed.data.previewId } })
  if (!preview) {
    return NextResponse.json({ error: 'Preview not found' }, { status: 404 })
  }

  const comment = await prisma.comment.create({
    data: {
      text: parsed.data.text,
      authorName: parsed.data.authorName || 'Anonymous',
      xPercent: parsed.data.xPercent,
      yPercent: parsed.data.yPercent,
      previewId: parsed.data.previewId,
    },
  })

  return NextResponse.json(comment, { status: 201 })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const previewId = searchParams.get('previewId')

  if (!previewId) {
    return NextResponse.json({ error: 'previewId is required' }, { status: 400 })
  }

  const comments = await prisma.comment.findMany({
    where: { previewId },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(comments)
}
