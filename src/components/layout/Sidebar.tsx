import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { FolderOpen, Settings } from 'lucide-react'
import { CreateProjectButton } from '@/components/dashboard/CreateProjectButton'
import Image from 'next/image'

export async function Sidebar() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true, slug: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <aside className="w-60 h-full bg-white border-r border-gray-200 flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-gray-100">
        <Link href="/projects" className="font-bold text-blue-600 text-lg">
          Previewly
        </Link>
      </div>

      {/* New Project */}
      <div className="p-3 border-b border-gray-100">
        <CreateProjectButton />
      </div>

      {/* Project list */}
      <nav className="flex-1 overflow-y-auto p-3">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider px-2 mb-2">
          Projects
        </p>
        {projects.length === 0 ? (
          <p className="text-xs text-gray-400 px-2">No projects yet</p>
        ) : (
          projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.slug}`}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 truncate"
            >
              <FolderOpen size={14} className="text-gray-400 shrink-0" />
              <span className="truncate">{p.name}</span>
            </Link>
          ))
        )}
      </nav>

      {/* User + links */}
      <div className="p-3 border-t border-gray-100">
        <Link
          href="/settings"
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 mb-2"
        >
          <Settings size={14} />
          Settings
        </Link>
        <div className="flex items-center gap-2 px-2">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt=""
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <span className="text-sm text-gray-700 truncate flex-1">
            {session.user.name ?? session.user.email}
          </span>
        </div>
        <div className="px-2">
          <LogoutButton />
        </div>
      </div>
    </aside>
  )
}
