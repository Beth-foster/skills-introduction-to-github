"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("axiva_cookie_consent")
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("axiva_cookie_consent", "accepted")
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem("axiva_cookie_consent", "declined")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-5 shadow-lg">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Your privacy matters</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We use essential cookies to keep the site running and optional analytics cookies to improve your experience. 
            Your facial images are never stored as cookies. Read our{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
              Privacy Policy
            </Link>{" "}
            for full details.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <Button size="sm" onClick={handleAccept}>
              Accept All
            </Button>
            <Button size="sm" variant="outline" className="bg-transparent" onClick={handleDecline}>
              Essential Only
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
