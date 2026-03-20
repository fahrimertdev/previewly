import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { Settings } from 'lucide-react'

import { CreateProjectButton } from '@/components/dashboard/CreateProjectButton'
import { SidebarLinks } from './SidebarLinks'
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
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider px-2 mb-2">
          Projects
        </p>
        <SidebarLinks projects={projects} />
      </nav>

      {/* User + links */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Settings size={14} className="shrink-0" />
          Settings
        </Link>
        <div className="flex items-center gap-2 px-2 py-1.5">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt=""
              width={24}
              height={24}
              className="rounded-full shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 text-xs font-semibold">
                {(session.user.name ?? session.user.email ?? '?')[0].toUpperCase()}
              </span>
            </div>
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
