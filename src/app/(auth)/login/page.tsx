import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LoginButtons } from '@/components/auth/LoginButtons'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  if (session) redirect('/projects')

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <div className="text-blue-600 font-bold text-2xl mb-1">Previewly</div>
          <h1 className="text-xl font-semibold text-gray-900">Sign in to your account</h1>
          <p className="text-gray-500 text-sm mt-1">
            Get visual feedback from your clients.
          </p>
        </div>

        <LoginButtons />

        <p className="mt-6 text-xs text-gray-400 text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
