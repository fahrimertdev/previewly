import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { AddPreviewForm } from '@/components/dashboard/AddPreviewForm'
import { PreviewCard } from '@/components/dashboard/PreviewCard'
import { Link as LinkIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await getServerSession(authOptions)

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      previews: {
        include: {
          comments: { orderBy: { createdAt: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!project || project.userId !== session!.user.id) notFound()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-2 transition-colors"
          >
            <ArrowLeft size={12} />
            All projects
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {project.previews.length} preview{project.previews.length !== 1 ? 's' : ''}
          </p>
        </div>
        <AddPreviewForm projectId={project.id} />
      </div>

      {project.previews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
            <LinkIcon size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">No previews yet</p>
          <p className="text-xs text-gray-400 mb-4">
            Add a URL to share with your client for visual feedback.
          </p>
          <AddPreviewForm projectId={project.id} />
        </div>
      ) : (
        <div className="space-y-3">
          {project.previews.map((preview) => (
            <PreviewCard key={preview.id} preview={preview} />
          ))}
        </div>
      )}
    </div>
  )
}
