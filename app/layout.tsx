import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

import { CookieConsent } from '@/components/cookie-consent'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Axiva | AI Facial Analysis & Glow-Up Insights',
  description: 'Discover your facial harmony with AI-powered analysis. Get personalised insights on proportions, balance, and practical recommendations for your unique features.',
}

export const viewport: Viewport = {
  themeColor: '#FAF9F7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
