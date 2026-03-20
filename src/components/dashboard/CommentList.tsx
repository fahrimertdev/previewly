'use client'

import { useState } from 'react'
import { Check, Trash2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import type { Comment } from '@prisma/client'

export function CommentList({
  comments,
  previewId,
}: {
  comments: Comment[]
  previewId: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  if (comments.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-4">No comments yet</p>
  }

  const toggleResolved = async (comment: Comment) => {
    setLoading(comment.id)
    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved: !comment.resolved }),
      })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      toast.error('Failed to update comment')
    } finally {
      setLoading(null)
    }
  }

  const deleteComment = async (id: string) => {
    setLoading(id)
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Comment deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete comment')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-2">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className={`flex items-start gap-3 p-3 rounded-lg border ${
            comment.resolved
              ? 'bg-green-50/50 border-green-100 opacity-70'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-xs text-blue-600 font-bold">
              {(comment.authorName ?? 'A')[0].toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-medium text-gray-700">
                {comment.authorName ?? 'Anonymous'}
              </span>
              <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
              {comment.resolved && (
                <span className="text-xs text-green-600 font-medium">✓ Resolved</span>
              )}
            </div>
            <p className="text-sm text-gray-700 break-words">{comment.text}</p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => toggleResolved(comment)}
              disabled={loading === comment.id}
              title={comment.resolved ? 'Mark as open' : 'Mark as resolved'}
              className="text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
            >
              {comment.resolved ? <RotateCcw size={14} /> : <Check size={14} />}
            </button>
            <button
              onClick={() => deleteComment(comment.id)}
              disabled={loading === comment.id}
              title="Delete comment"
              className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
