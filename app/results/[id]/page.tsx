"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HarmonyOverview } from "@/components/results/harmony-overview"
import { DetailedAnalysis } from "@/components/results/detailed-analysis"
import { FeatureRelationships } from "@/components/results/feature-relationships"
import { ExpressionArchetype } from "@/components/results/expression-archetype"
import { StrengthsSection } from "@/components/results/strengths-section"
import { RecommendationsSection } from "@/components/results/recommendations-section"
import { HarmonyBlueprint } from "@/components/results/harmony-blueprint"
import { PaywallPrompt } from "@/components/results/paywall-prompt"
import type { AnalysisResult } from "@/lib/analysis-types"

interface ResultsPageProps {
  params: Promise<{ id: string }>
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [analysisId, setAnalysisId] = useState<string>("")

  const successParam = searchParams.get("success")

  useEffect(() => {
    async function loadAnalysis() {
      const { id } = await params
      setAnalysisId(id)
      
      const stored = localStorage.getItem(`axiva_analysis_${id}`)
      if (stored) {
        try {
          const data = JSON.parse(stored) as AnalysisResult
          if (successParam === "true" && !data.isPaid) {
            data.isPaid = true
            localStorage.setItem(`axiva_analysis_${id}`, JSON.stringify(data))
          }
          setResult(data)
        } catch (e) {
          console.error("Failed to parse analysis data:", e)
        }
      }
      setIsLoading(false)
    }
    loadAnalysis()
  }, [params, successParam])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </main>
    )
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Analysis Not Found</h1>
          <p className="text-muted-foreground mb-6">This analysis may have expired or does not exist.</p>
          <Button asChild>
            <Link href="/analyze">Start New Analysis</Link>
          </Button>
        </div>
      </main>
    )
  }

  const isPaid = result.isPaid || successParam === "true"
  const { analysis } = result

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Full Report Banner for paid users */}
        {isPaid && (
          <Link
            href={`/report/${analysisId}`}
            className="flex items-center justify-between p-4 mb-8 rounded-xl bg-chart-2/5 border border-chart-2/20 hover:bg-chart-2/10 transition-colors group"
          >
            <div>
              <p className="text-sm font-medium">Your Interactive Report Dashboard is Ready</p>
              <p className="text-xs text-muted-foreground">Radar charts, harmony simulator, searchable measurements, and print export.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-chart-2 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
            {isPaid ? "Complete Structural Analysis" : "Structural Analysis Preview"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {isPaid 
              ? "78+ proportional measurements across 6 structural categories with deviation analysis, feature relationship mapping, and targeted intervention recommendations."
              : "Preview of your proportional analysis. Unlock the full report for complete measurements and deviation data."
            }
          </p>
          <p className="text-xs text-muted-foreground/60 mt-3">
            Harmony score reflects proportional alignment, not attractiveness or value. All faces exhibit deviation from idealised proportional ranges.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content - Left 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: Harmony Overview */}
            <HarmonyOverview analysis={analysis} />

            {/* Section 2: Core Structural Architecture (78+ measurements) */}
            <DetailedAnalysis analysis={analysis} isPaid={isPaid} />

            {/* Section 3: Feature Relationship Matrix (paid only) */}
            {isPaid && (
              <FeatureRelationships relationships={analysis.featureRelationships} />
            )}

            {/* Section 5: Feature Expression & Archetype (paid only) */}
            {isPaid && (
              <ExpressionArchetype expression={analysis.featureExpression} />
            )}
          </div>

          {/* Sidebar - Right column */}
          <div className="space-y-8">
            {/* Strengths */}
            <StrengthsSection strengths={analysis.strengths} />
            
            {/* Paywall or paid content */}
            {!isPaid && (
              <PaywallPrompt 
                analysisId={analysisId} 
                onUnlock={() => {}} 
              />
            )}

            {isPaid && (
              <>
                {/* Section 7: Harmony Upgrade Blueprint */}
                <HarmonyBlueprint blueprint={analysis.harmonyBlueprint} />

                {/* Recommendations */}
                <RecommendationsSection 
                  recommendations={analysis.recommendations}
                  optimizations={analysis.optimizationOpportunities}
                  isPaid={isPaid}
                />
              </>
            )}
          </div>
        </div>

        {/* Methodology Section (paid) */}
        {isPaid && (
          <div className="mt-12 p-6 rounded-xl bg-card border border-border">
            <h3 className="font-serif text-lg mb-3">Methodology</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground leading-relaxed">
              <div>
                <p className="font-medium text-foreground mb-1">Proportional Mathematics</p>
                <p>Anthropometric ratios with tightened tolerance bands (±3% from ideal). 78+ measurements evaluated against established proportional reference ranges.</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Score Distribution</p>
                <p>Most faces score 65-78. Above 85 indicates top 15% proportional consistency. Perfect scores do not exist in natural faces.</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Observational Skin Assessment</p>
                <p>Skin metrics are observational aesthetic assessments only. Not diagnostic or medical.</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Scoring Weights</p>
                <p className="font-mono text-xs">Structure 30% | Symmetry 20% | Relationships 20% | Skin 15% | Expression 10% | Contrast 5%</p>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-6 rounded-lg bg-secondary/50 border border-border">
          <h3 className="font-medium mb-2">Important Disclaimer</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {analysis.disclaimer}
          </p>
        </div>
      </div>
    </main>
  )
}
