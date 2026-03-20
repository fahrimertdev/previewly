'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 mt-1"
    >
      <LogOut size={12} />
      Sign out
    </button>
  )
}
