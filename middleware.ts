export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/staevner/:path*',
    '/dokumenter/:path*',
    '/galleri/:path*',
    '/profil/:path*',
    '/admin/:path*',
  ],
}
