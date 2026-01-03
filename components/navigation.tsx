'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-lg">DCU Kreds</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/dashboard')
                    ? 'bg-blue-700'
                    : 'hover:bg-blue-700'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/staevner"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname?.startsWith('/staevner')
                    ? 'bg-blue-700'
                    : 'hover:bg-blue-700'
                }`}
              >
                Stævner
              </Link>
              <Link
                href="/dokumenter"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/dokumenter')
                    ? 'bg-blue-700'
                    : 'hover:bg-blue-700'
                }`}
              >
                Dokumenter
              </Link>
              <Link
                href="/galleri"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/galleri')
                    ? 'bg-blue-700'
                    : 'hover:bg-blue-700'
                }`}
              >
                Galleri
              </Link>
              {(session?.user?.role === 'admin' || session?.user?.role === 'bestyrelse') && (
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/admin')
                      ? 'bg-blue-700'
                      : 'hover:bg-blue-700'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/profil"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              {session?.user?.name || session?.user?.email}
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="px-4 py-2 bg-blue-700 rounded-md text-sm font-medium hover:bg-blue-800"
            >
              Log ud
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
