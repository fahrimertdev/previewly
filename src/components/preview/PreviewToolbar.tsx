'use client'

import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Mode = 'comment' | 'browse'

interface Props {
  mode: Mode
  onModeChange: (m: Mode) => void
  commentCount: number
  projectName: string
}

export function PreviewToolbar({ mode, onModeChange, commentCount, projectName }: Props) {
  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shrink-0 z-20">
      <span className="font-bold text-blue-600 text-sm shrink-0">Previewly</span>

      <div className="h-4 w-px bg-gray-200" />

      <span className="text-sm text-gray-600 truncate">{projectName}</span>

      <div className="flex-1" />

      {commentCount > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MessageCircle size={13} />
          <span>{commentCount} comment{commentCount !== 1 ? 's' : ''}</span>
        </div>
      )}

      <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
        <button
          onClick={() => onModeChange('comment')}
          className={cn(
            'px-3 py-1.5 transition-colors',
            mode === 'comment'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          )}
        >
          💬 Comment
        </button>
        <button
          onClick={() => onModeChange('browse')}
          className={cn(
            'px-3 py-1.5 transition-colors',
            mode === 'browse'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          )}
        >
          👆 Browse
        </button>
      </div>
    </div>
  )
}
