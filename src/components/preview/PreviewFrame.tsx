'use client'

import { useState, useRef, useCallback } from 'react'
import type { Comment } from '@/types/prisma'
import { PreviewToolbar } from './PreviewToolbar'
import { CommentPin } from './CommentPin'
import { CommentForm } from './CommentForm'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Mode = 'comment' | 'browse'

interface PendingPin {
  xPercent: number
  yPercent: number
}

interface Props {
  preview: {
    id: string
    url: string
    projectName: string
  }
  initialComments: Comment[]
}

export function PreviewFrame({ preview, initialComments }: Props) {
  const [mode, setMode] = useState<Mode>('comment')
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [pendingPin, setPendingPin] = useState<PendingPin | null>(null)
  const [iframeError, setIframeError] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (mode !== 'comment') return
      if (!overlayRef.current) return
      // Ignore clicks on existing pins / forms
      if ((e.target as HTMLElement).closest('[data-pin]')) return

      const rect = overlayRef.current.getBoundingClientRect()
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100

      setPendingPin({ xPercent, yPercent })
    },
    [mode]
  )

  const handleSubmitComment = async (text: string, authorName: string) => {
    if (!pendingPin) return

    // Optimistic update
    const tempId = `temp-${Date.now()}`
    const tempComment: Comment = {
      id: tempId,
      text,
      authorName: authorName || 'Anonymous',
      xPercent: pendingPin.xPercent,
      yPercent: pendingPin.yPercent,
      resolved: false,
      previewId: preview.id,
      createdAt: new Date(),
    }
    setComments((prev) => [...prev, tempComment])
    setPendingPin(null)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previewId: preview.id,
          text,
          authorName: authorName || 'Anonymous',
          xPercent: pendingPin.xPercent,
          yPercent: pendingPin.yPercent,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to save comment')
      }

      const saved: Comment = await res.json()
      setComments((prev) => prev.map((c) => (c.id === tempId ? saved : c)))
      toast.success('Comment saved!')
    } catch (err) {
      setComments((prev) => prev.filter((c) => c.id !== tempId))
      toast.error(err instanceof Error ? err.message : 'Failed to save comment')
    }
  }

  return (
    <>
      <PreviewToolbar
        mode={mode}
        onModeChange={(m) => {
          setMode(m)
          setPendingPin(null)
        }}
        commentCount={comments.filter((c) => !c.resolved).length}
        projectName={preview.projectName}
      />

      {/* Instruction banner */}
      {mode === 'comment' && !pendingPin && (
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-center text-xs text-blue-700 shrink-0">
          Click anywhere on the page below to leave a comment
        </div>
      )}

      {/* iframe + overlay stack */}
      <div className="relative flex-1 overflow-hidden">
        {iframeError ? (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-center p-8">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Unable to load preview
            </p>
            <p className="text-sm text-gray-500 mb-4 max-w-sm">
              This site has restricted embedding. You can still open it directly.
            </p>
            <a
              href={preview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm underline"
            >
              Open {preview.url} ↗
            </a>
          </div>
        ) : (
          <iframe
            src={preview.url}
            className="absolute inset-0 w-full h-full border-0"
            title={`Preview: ${preview.url}`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            onError={() => setIframeError(true)}
          />
        )}

        {/* Overlay — captures clicks in comment mode, transparent in browse mode */}
        {!iframeError && (
          <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className={cn(
              'absolute inset-0',
              mode === 'comment' ? 'cursor-crosshair' : 'pointer-events-none'
            )}
            style={{ zIndex: 10 }}
          >
            {/* Existing comment pins */}
            {comments.map((comment, i) => (
              <div key={comment.id} data-pin>
                <CommentPin
                  comment={comment}
                  index={i}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ))}

            {/* Pending pin ghost */}
            {pendingPin && (
              <>
                <div
                  className="absolute w-6 h-6 bg-blue-600 rounded-full -translate-x-1/2 -translate-y-1/2 ring-2 ring-white shadow-lg"
                  style={{
                    left: `${pendingPin.xPercent}%`,
                    top: `${pendingPin.yPercent}%`,
                    zIndex: 25,
                  }}
                />
                <div data-pin>
                  <CommentForm
                    position={pendingPin}
                    onSubmit={handleSubmitComment}
                    onCancel={() => setPendingPin(null)}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}
