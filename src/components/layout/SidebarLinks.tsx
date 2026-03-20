'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  name: string
  slug: string
}

export function SidebarLinks({ projects }: { projects: Project[] }) {
  const pathname = usePathname()

  if (projects.length === 0) {
    return (
      <p className="text-xs text-gray-400 px-2 py-1">No projects yet</p>
    )
  }

  return (
    <>
      {projects.map((p) => {
        const active = pathname === `/projects/${p.slug}`
        return (
          <Link
            key={p.id}
            href={`/projects/${p.slug}`}
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm truncate transition-colors',
              active
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <FolderOpen
              size={14}
              className={cn('shrink-0', active ? 'text-blue-600' : 'text-gray-400')}
            />
            <span className="truncate">{p.name}</span>
          </Link>
        )
      })}
    </>
  )
}
