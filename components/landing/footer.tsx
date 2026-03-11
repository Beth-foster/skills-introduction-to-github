"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Check } from "lucide-react"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasConsented, setHasConsented] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !hasConsented) return
    setIsLoading(true)
    // Simulate subscription - in production this would call a real API
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSubscribed(true)
    setIsLoading(false)
  }

  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        {/* Newsletter Sign-up */}
        <div className="max-w-md mx-auto text-center mb-14">
          <h3 className="font-serif text-xl mb-2">Stay in the loop</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Get tips on facial harmony, grooming, and skincare straight to your inbox. No spam, ever.
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2 py-3 text-sm text-foreground">
              <Check className="w-4 h-4" />
              <span>You&apos;re subscribed. Welcome aboard.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={isLoading || !hasConsented || !email}>
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <label className="flex items-start gap-2 cursor-pointer text-left">
                <input
                  type="checkbox"
                  checked={hasConsented}
                  onChange={(e) => setHasConsented(e.target.checked)}
                  className="mt-0.5 rounded border-border"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I agree to receive emails from Axiva and accept the{" "}
                  <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                  . Unsubscribe at any time.
                </span>
              </label>
            </form>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
              <span className="text-background font-serif text-sm font-semibold">X</span>
            </div>
            <span className="font-serif text-xl tracking-tight">Axiva</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="#methodology" className="hover:text-foreground transition-colors">
              Methodology
            </Link>
            <Link href="#ethics" className="hover:text-foreground transition-colors">
              Ethics
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <a href="mailto:support@axiva.co.uk" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-3xl mx-auto">
            <strong>Disclaimer:</strong> Axiva provides educational facial analysis for informational purposes only. 
            This is not medical advice, not a diagnostic tool, and should not be used to make medical decisions. 
            We do not store your images, perform identity recognition, or rank individuals against others. 
            Results should be interpreted as general educational content about facial proportions and harmony.
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Copyright {new Date().getFullYear()} Axiva. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
