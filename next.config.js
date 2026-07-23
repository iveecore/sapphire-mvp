/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: '*.supabase.co' },
      { hostname: 'images.unsplash.com' }
    ]
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "img-src 'self' data: blob: *.supabase.co images.unsplash.com *.lottiefiles.com",
              "connect-src 'self' *.supabase.co",
              "font-src 'self' fonts.gstatic.com fonts.googleapis.com",
              "frame-ancestors 'none'"
            ].join('; ')
          }
        ]
      },
      {
        source: '/(.*)\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      }
    ]
  }
}

module.exports = nextConfig
