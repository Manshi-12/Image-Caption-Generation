import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Caption Generator - Instagram-Ready Captions',
  description: 'Generate cool, Instagram-worthy captions for your photos using advanced AI. Transform your images into engaging social media posts with the perfect vibe.',
  keywords: ['AI caption generator', 'Instagram captions', 'photo captions', 'social media'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Name',
  openGraph: {
    title: 'AI Caption Generator',
    description: 'Generate Instagram-worthy captions with AI magic ✨',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Caption Generator',
    description: 'Generate Instagram-worthy captions with AI magic ✨',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#8B5CF6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}