import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kitoko Packer',
  description: 'Ultra-fast scan-to-pack for 1000+ orders/day',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
