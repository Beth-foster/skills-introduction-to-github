"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Lock, ArrowRight } from "lucide-react"

interface PaywallPromptProps {
  analysisId: string
  onUnlock: () => void
}

const features = [
  "78+ exact measurement ratios with explanations",
  "Feature relationship matrix showing interdependencies",
  "Facial archetype & expression analysis",
  "Personalised Harmony Upgrade Blueprint",
  "Complete skincare, grooming & lifestyle guidance",
  "Transformation timeline with projected gains",
  "Scoring methodology breakdown"
]

export function PaywallPrompt({ analysisId }: PaywallPromptProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    setIsLoading(true)
    window.location.href = `/checkout?analysisId=${analysisId}`
  }

  return (
    <Card className="border-2 border-foreground">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-foreground" />
        </div>
        <CardTitle className="font-serif text-2xl">Unlock Your Full Harmony Blueprint</CardTitle>
        <p className="text-muted-foreground mt-2">
          Your complete structural breakdown is ready.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-serif font-medium">{'£6.99'}</div>
          <p className="text-sm text-muted-foreground">One-time payment</p>
        </div>

        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm">
              <Check className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <Button 
          className="w-full py-6 text-base" 
          onClick={handlePurchase}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              See Your Complete Structural Breakdown
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Instant access</span>
          <span className="flex items-center gap-1"><Check className="w-3 h-3" /> No subscription</span>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Secure payment powered by Stripe. Report available immediately after purchase.
        </p>
      </CardContent>
    </Card>
  )
}
