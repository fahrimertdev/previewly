import Link from 'next/link'
import { ArrowRight, MousePointer2, Share2, CheckCircle, MessageSquare, Eye, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-blue-600 text-xl">Previewly</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Sign in
            </Link>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          ✨ Free to use — no client account needed
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-6 max-w-3xl mx-auto">
          Stop explaining designs{' '}
          <span className="text-blue-600">over email.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Share deploy previews with clients. They click anywhere to leave a comment, you fix it.
          No accounts, no email threads, no confusion.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/login"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Get Started Free
            <ArrowRight size={16} />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            See how it works
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500">Three steps. That&apos;s it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Share2,
                step: '01',
                title: 'Paste your URL',
                desc: 'Add any live preview link — Vercel, Netlify, custom domain — to a Previewly project.',
              },
              {
                icon: MousePointer2,
                step: '02',
                title: 'Share with your client',
                desc: 'Send them a single link. They open it and click anywhere on the page to leave feedback.',
              },
              {
                icon: CheckCircle,
                step: '03',
                title: 'Get pinned feedback',
                desc: 'All comments show as numbered pins on the exact spot. Review, fix, resolve. Done.',
              },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Icon size={20} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 tracking-wider">{step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need</h2>
            <p className="text-gray-500">Built for freelancers who ship.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MousePointer2,
                title: 'Visual feedback',
                desc: 'Clients click exactly where they mean. No more "move that thing on the left a bit".',
              },
              {
                icon: Shield,
                title: 'No client login',
                desc: 'Clients leave feedback without creating an account. Frictionless.',
              },
              {
                icon: Eye,
                title: 'Browse + comment modes',
                desc: 'Toggle between commenting and actually browsing the preview — in the same view.',
              },
              {
                icon: CheckCircle,
                title: 'Resolve & track',
                desc: 'Mark comments as resolved as you fix them. Keep track of what\'s done.',
              },
              {
                icon: MessageSquare,
                title: 'Unlimited comments',
                desc: 'Free plan includes unlimited previews and comments. No artificial limits.',
              },
              {
                icon: Share2,
                title: 'Shareable link',
                desc: 'One link per preview. Copy and paste into any message. Works on any device.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                  <Icon size={18} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple pricing</h2>
            <p className="text-gray-500">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-white rounded-2xl border-2 border-blue-600 p-6 relative">
              <div className="absolute -top-3 left-6">
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Current plan
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Free</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">$0</div>
              <ul className="space-y-2 mb-6">
                {['2 projects', 'Unlimited previews', 'Unlimited comments', 'Shareable links'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={14} className="text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block w-full text-center bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 relative">
              <div className="absolute -top-3 left-6">
                <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Coming soon
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Pro</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                $12<span className="text-base font-normal text-gray-400">/mo</span>
              </div>
              <ul className="space-y-2 mb-6">
                {['Unlimited projects', 'Custom branding', 'Export comments', 'Priority support'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle size={14} className="text-gray-300 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button disabled className="w-full text-center bg-gray-100 text-gray-400 text-sm font-medium py-2.5 rounded-lg cursor-not-allowed">
                Coming soon
              </button>
            </div>

            {/* Team */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 relative">
              <div className="absolute -top-3 left-6">
                <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Coming soon
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Team</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                $25<span className="text-base font-normal text-gray-400">/mo</span>
              </div>
              <ul className="space-y-2 mb-6">
                {['Multi-user access', 'Role management', 'Analytics', 'All Pro features'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle size={14} className="text-gray-300 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button disabled className="w-full text-center bg-gray-100 text-gray-400 text-sm font-medium py-2.5 rounded-lg cursor-not-allowed">
                Coming soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to stop explaining over email?
          </h2>
          <p className="text-gray-500 mb-8">
            Free to start. No credit card. Your first client will thank you.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Get Started Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-bold text-blue-600">Previewly</span>
          <p className="text-sm text-gray-400">
            Built by{' '}
            <a
              href="https://fahrimert.dev"
              className="text-gray-600 hover:text-gray-900"
            >
              Fahri Mert
            </a>{' '}
            🇹🇷
          </p>
        </div>
      </footer>
    </div>
  )
}
