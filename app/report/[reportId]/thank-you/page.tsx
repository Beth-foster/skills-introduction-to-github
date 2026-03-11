"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, FileText, BarChart3, Sliders, Sparkles, Loader2 } from "lucide-react"
import { generatePremiumEnrichment } from "@/app/actions/analyze"
import type { CoreAnalysis } from "@/lib/analysis-types"

const ENRICHMENT_STEPS = [
  { label: "Payment confirmed", threshold: 0 },
  { label: "Loading your structural analysis...", threshold: 5 },
  { label: "Generating skincare deep-dive...", threshold: 15 },
  { label: "Building hair & styling recommendations...", threshold: 30 },
  { label: "Preparing colour analysis...", threshold: 45 },
  { label: "Creating lifestyle & nutrition plan...", threshold: 60 },
  { label: "Assembling harmony blueprint...", threshold: 75 },
  { label: "Finalising your complete report...", threshold: 90 },
]

export default function ThankYouPage() {
  const params = useParams()
  const router = useRouter()
  const reportId = params.reportId as string
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(ENRICHMENT_STEPS[0].label)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const enrichmentStarted = useRef(false)

  useEffect(() => {
    if (enrichmentStarted.current) return
    enrichmentStarted.current = true

    async function runEnrichment() {
      try {
        // Load core analysis from localStorage
        const stored = localStorage.getItem(`axiva_analysis_${reportId}`)
        if (!stored) {
          setError("Analysis data not found. Please try again.")
          return
        }

        const data = JSON.parse(stored)
        const coreAnalysis = data.analysis as CoreAnalysis

        // Mark as paid immediately
        data.isPaid = true
        localStorage.setItem(`axiva_analysis_${reportId}`, JSON.stringify(data))

        // Start progress animation
        const progressTimer = setInterval(() => {
          setProgress(prev => {
            const next = Math.min(prev + 1.2, 85)
            // Update step label based on progress
            const step = [...ENRICHMENT_STEPS].reverse().find(s => next >= s.threshold)
            if (step) setCurrentStep(step.label)
            return next
          })
        }, 300)

        // Run the enrichment call (text-only, much faster)
        const result = await generatePremiumEnrichment(coreAnalysis)

        clearInterval(progressTimer)

        if (result.success && result.enrichment) {
          // Merge enrichment data with core analysis
          const enriched = {
            ...data,
            analysis: {
              ...data.analysis,
              skin: {
                ...data.analysis.skin,
                deepRecommendations: result.enrichment.skinDeepRecommendations,
              },
              recommendations: result.enrichment.recommendations,
              cosmeticRecommendations: result.enrichment.cosmeticRecommendations,
              harmonyBlueprint: result.enrichment.harmonyBlueprint,
              transformationTimeline: result.enrichment.transformationTimeline,
            },
          }
          localStorage.setItem(`axiva_analysis_${reportId}`, JSON.stringify(enriched))

          // Animate to 100%
          setProgress(95)
          setCurrentStep("Finalising your complete report...")
          setTimeout(() => {
            setProgress(100)
            setCurrentStep("Your report is ready")
            setIsComplete(true)
          }, 800)
        } else {
          // Enrichment failed — still allow access to core report
          console.error("Enrichment failed:", result.error)
          setProgress(100)
          setCurrentStep("Report ready (some recommendations still loading)")
          setIsComplete(true)
        }
      } catch (err) {
        console.error("Enrichment error:", err)
        setProgress(100)
        setCurrentStep("Report ready")
        setIsComplete(true)
      }
    }

    runEnrichment()
  }, [reportId])

  const features = [
    { icon: BarChart3, title: "78+ Measurements", description: "Every proportional metric mapped with deviation analysis" },
    { icon: Sparkles, title: "Skincare & Cosmetic Recommendations", description: "AM/PM routines, hair styling, colour analysis, and nutrition" },
    { icon: Sliders, title: "Harmony Simulator", description: "Interactive sliders to model potential structural changes" },
    { icon: FileText, title: "Exportable Report", description: "Print-optimised layout you can save or share with professionals" },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full bg-chart-2/10 border border-chart-2/20 flex items-center justify-center mx-auto mb-8">
          {isComplete ? (
            <CheckCircle2 className="w-10 h-10 text-chart-2" />
          ) : (
            <Loader2 className="w-10 h-10 text-chart-2 animate-spin" />
          )}
        </div>

        <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-3">
          {isComplete ? "Your Report is Ready" : "Building Your Report"}
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          {isComplete
            ? "Your complete structural analysis with personalised recommendations is ready to explore."
            : "We are generating your personalised recommendations. This takes 15-25 seconds."
          }
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Progress */}
        <div className="mb-10 px-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground truncate max-w-[70%]">{currentStep}</span>
            <span className="font-mono text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-chart-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* What's included */}
        <div className="space-y-3 mb-10 text-left">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 border border-border transition-opacity duration-500"
              style={{ opacity: progress > (i + 1) * 20 ? 1 : 0.3 }}
            >
              <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                <f.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          size="lg"
          className="w-full gap-2"
          disabled={!isComplete}
          onClick={() => router.push(`/report/${reportId}`)}
        >
          {isComplete ? (
            <>
              View Your Full Report
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating recommendations...
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground/50 mt-4">
          Your report is stored locally and can be accessed anytime from this device.
        </p>
      </div>
    </div>
  )
}
