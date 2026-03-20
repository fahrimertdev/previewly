'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface Props {
  position: { xPercent: number; yPercent: number }
  onSubmit: (text: string, authorName: string) => Promise<void>
  onCancel: () => void
}

export function CommentForm({ position, onSubmit, onCancel }: Props) {
  const [text, setText] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Smart positioning: flip sides near edges
  const flipLeft = position.xPercent > 60
  const flipUp = position.yPercent > 65

  const formStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 30,
    ...(flipLeft
      ? { right: `${100 - position.xPercent}%`, marginRight: '1.75rem' }
      : { left: `${position.xPercent}%`, marginLeft: '1.75rem' }),
    ...(flipUp
      ? { bottom: `${100 - position.yPercent}%` }
      : { top: `${position.yPercent}%` }),
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || submitting) return
    setSubmitting(true)
    await onSubmit(text.trim(), authorName.trim())
    setSubmitting(false)
  }

  return (
    <div style={formStyle} className="w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Leave a comment</span>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name (optional)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          ref={textareaRef}
          placeholder="Describe the change you'd like..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={3}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!text.trim() || submitting}
            className="flex-1 bg-blue-600 text-white text-sm font-medium rounded-lg py-2 disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {submitting ? 'Saving...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
