'use client'

import { useState } from 'react'
import { Copy, ExternalLink, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CommentList } from './CommentList'
import { formatDate } from '@/lib/utils'
import type { Comment, Preview } from '@/types/prisma'

type PreviewWithComments = Preview & { comments: Comment[] }

export function PreviewCard({ preview }: { preview: PreviewWithComments }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${preview.shareId}`
  const openCount = preview.comments.filter((c: Comment) => !c.resolved).length
  const resolvedCount = preview.comments.filter((c: Comment) => c.resolved).length

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const deletePreview = async () => {
    if (!confirm('Delete this preview and all its comments?')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/previews/${preview.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Preview deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete preview')
      setDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <a
              href={preview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
            >
              {preview.url}
            </a>
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(preview.createdAt)}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {openCount > 0 && (
              <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full">
                {openCount} open
              </span>
            )}
            {resolvedCount > 0 && (
              <span className="text-xs bg-green-50 text-green-600 font-medium px-2 py-0.5 rounded-full">
                {resolvedCount} resolved
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
          >
            {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>

          <a
            href={`/p/${preview.shareId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-blue-600 border border-blue-200 rounded-lg px-2.5 py-1.5 hover:bg-blue-50 transition-colors"
          >
            <ExternalLink size={12} />
            Open Preview
          </a>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 ml-auto"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {preview.comments.length} comments
          </button>

          <button
            onClick={deletePreview}
            disabled={deleting}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          <CommentList comments={preview.comments} previewId={preview.id} />
        </div>
      )}
    </div>
  )
}
