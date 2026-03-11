"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startCheckoutSession } from "@/app/actions/stripe"
import type { AnalysisResult } from "@/lib/analysis-types"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  analysisId: string
}

export function CheckoutForm({ analysisId }: CheckoutFormProps) {
  const router = useRouter()
  const [isComplete, setIsComplete] = useState(false)

  const fetchClientSecret = useCallback(
    () => startCheckoutSession(analysisId),
    [analysisId],
  )

  const handleComplete = useCallback(() => {
    setIsComplete(true)
    // Mark the analysis as paid in localStorage
    const stored = localStorage.getItem(`axiva_analysis_${analysisId}`)
    if (stored) {
      try {
        const data = JSON.parse(stored) as AnalysisResult
        data.isPaid = true
        localStorage.setItem(`axiva_analysis_${analysisId}`, JSON.stringify(data))
      } catch (e) {
        console.error("Failed to update analysis:", e)
      }
    }
    router.push(`/report/${analysisId}/thank-you`)
  }, [analysisId, router])

  return (
    <div id="checkout" className="w-full">
      {!isComplete ? (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{
            fetchClientSecret,
            onComplete: handleComplete,
          }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-chart-2/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-chart-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground">Redirecting to your full report...</p>
        </div>
      )}
    </div>
  )
}
