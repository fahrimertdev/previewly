import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'Previewly — Visual Feedback for Freelancers',
  description:
    'Share deploy previews with clients. They click, comment, approve. No more email threads.',
  openGraph: {
    title: 'Previewly',
    description: 'Stop explaining designs over email.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans bg-white text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
