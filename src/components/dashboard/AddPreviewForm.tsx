'use client'

import { useState } from 'react'
import { Plus, X, Link as LinkIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function AddPreviewForm({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)

    try {
      const res = await fetch('/api/previews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        const errMsg = data.error?.fieldErrors?.url?.[0] ?? data.error ?? 'Failed'
        throw new Error(errMsg)
      }

      toast.success('Preview added!')
      setOpen(false)
      setUrl('')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add preview')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        <Plus size={16} />
        Add Preview
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Add Preview URL</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  autoFocus
                  type="url"
                  placeholder="https://your-preview-url.vercel.app"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Any live URL — Vercel preview, Netlify, custom domain, etc.
              </p>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!url.trim() || loading}
                  className="flex-1 bg-blue-600 text-white text-sm font-medium rounded-lg py-2 disabled:opacity-50 hover:bg-blue-700 transition-colors"
                >
                  {loading ? 'Adding...' : 'Add Preview'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
