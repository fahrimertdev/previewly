'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Comment } from '@prisma/client'

interface Props {
  comment: Comment
  index: number
  onClick: (e: React.MouseEvent) => void
}

export function CommentPin({ comment, index, onClick }: Props) {
  const [showTooltip, setShowTooltip] = useState(false)

  // Determine tooltip direction based on position
  const tooltipLeft = comment.xPercent > 70

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${comment.xPercent}%`,
        top: `${comment.yPercent}%`,
        zIndex: 20,
      }}
      onClick={onClick}
    >
      <button
        className={cn(
          'w-6 h-6 rounded-full ring-2 ring-white shadow-lg flex items-center justify-center text-white text-xs font-bold select-none',
          comment.resolved ? 'bg-green-500' : 'bg-blue-600'
        )}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={`Comment by ${comment.authorName ?? 'Anonymous'}`}
      >
        {index + 1}
      </button>

      {showTooltip && (
        <div
          className={cn(
            'absolute top-0 z-30 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 pointer-events-none',
            tooltipLeft ? 'right-8' : 'left-8'
          )}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-900">
              {comment.authorName ?? 'Anonymous'}
            </span>
            {comment.resolved && (
              <span className="text-xs text-green-600 font-medium">✓ Resolved</span>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
        </div>
      )}
    </div>
  )
}
