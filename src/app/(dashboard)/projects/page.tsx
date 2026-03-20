import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FolderOpen, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { CreateProjectButton } from '@/components/dashboard/CreateProjectButton'

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  const projects = await prisma.project.findMany({
    where: { userId: session!.user.id },
    include: {
      _count: { select: { previews: true } },
      previews: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { comments: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] px-4">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
          <FolderOpen size={24} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">No projects yet</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Create your first project to start sharing previews with clients.
        </p>
        <CreateProjectButton />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <FolderOpen size={18} className="text-blue-600" />
              </div>
              <ExternalLink size={14} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
            <p className="text-xs text-gray-400">
              {project._count.previews} preview{project._count.previews !== 1 ? 's' : ''} ·{' '}
              {formatDate(project.createdAt)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
