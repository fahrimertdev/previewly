import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { PreviewFrame } from '@/components/preview/PreviewFrame'

export default async function PublicPreviewPage({
  params,
}: {
  params: Promise<{ shareId: string }>
}) {
  const { shareId } = await params

  const preview = await prisma.preview.findUnique({
    where: { shareId },
    include: {
      comments: { orderBy: { createdAt: 'asc' } },
      project: { select: { name: true } },
    },
  })

  if (!preview) notFound()

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <PreviewFrame
        preview={{
          id: preview.id,
          url: preview.url,
          projectName: preview.project.name,
        }}
        initialComments={preview.comments}
      />
    </div>
  )
}
