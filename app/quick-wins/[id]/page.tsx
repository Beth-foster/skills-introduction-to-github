"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronRight, Lock, Shield, ArrowDown, Check, AlertTriangle, HelpCircle, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { AnalysisResult } from "@/lib/analysis-types"

function getScoreBand(score: number): { label: string; description: string; insight: string } {
  if (score >= 90) return { label: "Exceptional Alignment", description: "Top 5% proportional consistency", insight: "Your facial proportions show remarkable mathematical consistency across nearly all measured areas. This level of alignment is genuinely rare — it indicates that the foundational geometry of your features works in concert in a way that very few faces achieve." }
  if (score >= 85) return { label: "Strong Consistency", description: "Top 15% structural alignment", insight: "Your proportions demonstrate strong alignment across most categories. The structural foundation is notably well-balanced, with only minor deviations that are largely imperceptible in everyday interaction. This is well above the average range." }
  if (score >= 78) return { label: "Above Average", description: "Good alignment with some deviations", insight: "Your proportional consistency sits above the average range. Several structural elements align well with ideal ratios, while a few measurable deviations create opportunities for targeted improvement. The deviations identified below are the most impactful areas where change would be noticeable." }
  if (score >= 70) return { label: "Balanced", description: "Proportionally consistent with measurable deviations", insight: "Your facial geometry falls within the most common range. This means your proportions are generally balanced but show measurable deviations in specific areas. The good news: this range tends to benefit most from targeted adjustments — small changes here can yield visible improvement in overall harmony." }
  if (score >= 60) return { label: "Moderate Imbalance", description: "Several areas outside optimal bands", insight: "Your analysis has identified several areas where proportional measurements fall outside optimal bands. This is not uncommon, and many of the deviations flagged below are addressable through grooming, styling, or lifestyle changes. The areas with highest impact are prioritised first." }
  return { label: "Significant Deviation", description: "Key structural areas outside optimal ranges", insight: "Your analysis shows notable deviations across several structural categories. While this indicates significant room for improvement, it also means that targeted interventions are likely to produce the most dramatic positive change. The quick wins below are ordered by potential impact." }
}

function getDeviationTrend(deviation: string) {
  if (deviation.startsWith("+") || deviation.toLowerCase().includes("above")) return "above"
  if (deviation.startsWith("-") || deviation.toLowerCase().includes("below") || deviation.toLowerCase().includes("low")) return "below"
  return "neutral"
}

interface QuickWinsPageProps {
  params: Promise<{ id: string }>
}

export default function QuickWinsPage({ params }: QuickWinsPageProps) {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [analysisId, setAnalysisId] = useState<string>("")

  useEffect(() => {
    async function loadAnalysis() {
      const { id } = await params
      setAnalysisId(id)
      const stored = localStorage.getItem(`axiva_analysis_${id}`)
      if (stored) {
        try {
          setResult(JSON.parse(stored) as AnalysisResult)
        } catch (e) {
          console.error("Failed to parse analysis data:", e)
        }
      }
      setIsLoading(false)
    }
    loadAnalysis()
  }, [params])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Processing structural data...</p>
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

  const { analysis } = result
  const scoreBand = getScoreBand(analysis.overallHarmony.score)
  const quickWins = analysis.quickWins

  // Calculate potential gain from all quick wins
  const potentialGain = quickWins.reduce((sum, w) => {
    const match = w.projectedGain.match(/\d+/g)
    if (match) return sum + parseInt(match[match.length - 1])
    return sum
  }, 0)

  return (
    <TooltipProvider delayDuration={200}>
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* SECTION 1: SCORE OVERVIEW */}
          <div className="mb-6">
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="flex flex-col items-center text-center mb-6">
                <span className="text-xs text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  Harmony Score
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3 h-3 text-muted-foreground/50 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px] p-4">
                      <p className="font-medium mb-1 text-sm">How your score is calculated</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                        78+ individual proportional measurements are taken across 6 structural categories, 
                        each weighted by importance. Your score reflects mathematical proportional alignment — 
                        not attractiveness. Many highly attractive faces score 65-75.
                      </p>
                      <div className="text-[11px] font-mono text-muted-foreground space-y-0.5">
                        <p>Structure (30%) | Symmetry (20%)</p>
                        <p>Relationships (20%) | Skin (15%)</p>
                        <p>Expression (10%) | Contrast (5%)</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </span>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-7xl font-serif font-medium text-foreground">{analysis.overallHarmony.score}</span>
                  <span className="text-xl text-muted-foreground">/100</span>
                </div>
                <span className="text-sm font-medium text-foreground mb-0.5">
                  {scoreBand.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {scoreBand.description}
                </span>

                <div className="w-full max-w-xs mt-4">
                  <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-foreground rounded-full transition-all duration-700"
                      style={{ width: `${analysis.overallHarmony.score}%` }}
                    />
                  </div>
                  {/* Percentile markers */}
                  <div className="relative h-4 mt-0.5">
                    <span className="absolute text-[9px] text-muted-foreground/40 font-mono" style={{ left: "50%" }}>50</span>
                    <span className="absolute text-[9px] text-muted-foreground/40 font-mono" style={{ left: "65%" }}>65</span>
                    <span className="absolute text-[9px] text-muted-foreground/40 font-mono" style={{ left: "78%" }}>78</span>
                    <span className="absolute text-[9px] text-muted-foreground/40 font-mono" style={{ left: "85%" }}>85</span>
                  </div>
                </div>

                {potentialGain > 0 && (
                  <p className="text-xs text-chart-2 font-medium mt-2">
                    Potential improvement: up to +{potentialGain} points with targeted adjustments
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: IN-DEPTH SUMMARY — flows directly under score */}
          <div className="mb-12 p-6 rounded-2xl bg-card border border-border">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
              Your Analysis Summary
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3 h-3 text-muted-foreground/50 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[280px] p-4">
                  <p className="text-xs text-muted-foreground">
                    This summary provides context for your score — what it means in practice, 
                    what your structural strengths are, and where the most impactful improvements lie. 
                    Read this before diving into the detailed sections below.
                  </p>
                </TooltipContent>
              </Tooltip>
            </h2>
            
            {/* Score context paragraph */}
            <p className="text-foreground leading-relaxed mb-4">
              {scoreBand.insight}
            </p>

            {/* AI summary */}
            <p className="text-muted-foreground leading-relaxed mb-6">
              {analysis.overallHarmony.summary}
            </p>

            {/* Key structural indices */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Structural Balance", value: analysis.overallHarmony.structuralBalanceIndex, desc: "How well bone structure provides a balanced foundation" },
                { label: "Expressive Warmth", value: analysis.overallHarmony.expressiveWarmthIndex, desc: "How warm and approachable features read structurally" },
                { label: "Definition vs Softness", value: analysis.overallHarmony.definitionVsSoftnessIndex, desc: "0 = very soft, 100 = very defined, 50 = balanced" },
              ].map((idx) => (
                <Tooltip key={idx.label}>
                  <TooltipTrigger asChild>
                    <div className="text-center p-3 rounded-xl bg-secondary/30 cursor-help">
                      <p className="text-2xl font-mono font-medium">{idx.value}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{idx.label}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[240px] p-3">
                    <p className="text-xs text-muted-foreground">{idx.desc}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Strengths callout */}
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Areas Within Optimal Range</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysis.strengths.slice(0, 4).map((s, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-chart-2/5 border border-chart-2/10">
                      <Check className="w-3.5 h-3.5 text-chart-2 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{s.feature}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{s.deviation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground/70 leading-relaxed">
              Harmony score reflects proportional alignment, not attractiveness or value. All faces exhibit deviation from idealised proportional ranges. Variation is biologically expected and often contributes to distinctiveness.
            </p>

            <button 
              onClick={() => document.getElementById("deviation-summary")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors mt-4"
            >
              View Deviation Details
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* SECTION 3: DEVIATION SUMMARY BOX */}
          {analysis.overallHarmony.deviationSummary && (
            <div id="deviation-summary" className="mb-12 p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                Structural Deviation Summary
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3 h-3 text-muted-foreground/50 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[280px] p-4">
                    <p className="text-xs text-muted-foreground">
                      These are the key areas where your proportions deviate from ideal mathematical ranges. 
                      Each shows the metric name and how far it deviates. Arrows indicate whether the measurement 
                      is above or below the ideal. These deviations are what primarily determine your overall score.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                The primary proportional deviations that influence your overall harmony score.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysis.overallHarmony.deviationSummary.map((item, index) => {
                  const trend = getDeviationTrend(item.deviation)
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                      {trend === "above" ? (
                        <TrendingUp className="w-4 h-4 text-chart-5/70 mt-0.5 shrink-0" />
                      ) : trend === "below" ? (
                        <TrendingDown className="w-4 h-4 text-chart-5/70 mt-0.5 shrink-0" />
                      ) : (
                        <Minus className="w-4 h-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{item.metric}</p>
                        <p className="text-xs text-muted-foreground font-mono">{item.deviation}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* SECTION 4: PROPORTION SNAPSHOT */}
          {analysis.proportionalSnapshot && (
            <div className="mb-12 p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                Proportional Snapshot
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3 h-3 text-muted-foreground/50 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] p-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This shows the three foundational proportional systems: <strong>Thirds</strong> (vertical balance), 
                      <strong>Fifths</strong> (horizontal balance), and <strong>Symmetry</strong> (left-right balance). 
                      Together, these form the structural framework your overall score is built upon.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                How your face divides across the foundational proportional systems used in classical facial analysis.
              </p>
              
              <div className="space-y-6">
                {/* Facial Thirds */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      Facial Thirds
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3 h-3 text-muted-foreground/40 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[260px] p-3">
                          <p className="text-xs text-muted-foreground">
                            Your face is split into three horizontal zones: hairline to brow (upper), 
                            brow to nose base (middle), nose base to chin (lower). Each should be roughly 33%.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">Ideal: 33% / 33% / 33% (&#177;3%)</span>
                  </div>
                  <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
                    <div 
                      className="bg-foreground/80 flex items-center justify-center"
                      style={{ width: `${analysis.proportionalSnapshot.facialThirds.upper}%` }}
                    >
                      <span className="text-xs text-background font-mono">
                        {Math.round(analysis.proportionalSnapshot.facialThirds.upper)}%
                      </span>
                    </div>
                    <div 
                      className="bg-foreground/60 flex items-center justify-center"
                      style={{ width: `${analysis.proportionalSnapshot.facialThirds.middle}%` }}
                    >
                      <span className="text-xs text-background font-mono">
                        {Math.round(analysis.proportionalSnapshot.facialThirds.middle)}%
                      </span>
                    </div>
                    <div 
                      className="bg-foreground/40 flex items-center justify-center"
                      style={{ width: `${analysis.proportionalSnapshot.facialThirds.lower}%` }}
                    >
                      <span className="text-xs text-background font-mono">
                        {Math.round(analysis.proportionalSnapshot.facialThirds.lower)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Upper</span>
                    <span className="text-xs text-muted-foreground">Middle</span>
                    <span className="text-xs text-muted-foreground">Lower</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {analysis.proportionalSnapshot.facialThirds.assessment}
                  </p>
                </div>

                {/* Facial Fifths */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      Facial Fifths
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3 h-3 text-muted-foreground/40 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[260px] p-3">
                          <p className="text-xs text-muted-foreground">
                            Five vertical segments across the face width. Determines whether eyes appear close-set, 
                            wide-set, or balanced relative to the nose and facial edges.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${analysis.proportionalSnapshot.facialFifths.balanced ? "bg-secondary text-foreground" : "bg-chart-1/10 text-chart-1"}`}>
                      {analysis.proportionalSnapshot.facialFifths.balanced ? "Within tolerance" : "Deviation detected"}
                    </span>
                  </div>
                  <div className="flex gap-1 h-4 rounded-lg overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex-1 bg-foreground/30 rounded" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {analysis.proportionalSnapshot.facialFifths.assessment}
                  </p>
                </div>

                {/* Symmetry Index */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      Symmetry Index
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3 h-3 text-muted-foreground/40 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[260px] p-3">
                          <p className="text-xs text-muted-foreground">
                            Compares corresponding points on left and right sides. No face is perfectly 
                            symmetrical — scores above 90% are considered excellent. Asymmetry below 5% 
                            is generally imperceptible.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                    <span className="text-sm font-mono font-medium">{analysis.proportionalSnapshot.symmetryIndex.percentage}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-foreground rounded-full"
                      style={{ width: `${analysis.proportionalSnapshot.symmetryIndex.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {analysis.proportionalSnapshot.symmetryIndex.assessment}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: DIAGNOSTIC QUICK WINS */}
          <div id="quick-wins" className="mb-12">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
              Primary Deviation Corrections
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3 h-3 text-muted-foreground/50 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] p-4">
                  <p className="font-medium mb-1 text-sm">How these are selected</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    These are the three individual measurements with the highest combined deviation and impact weight. 
                    Addressing these specific areas would produce the most noticeable improvement in your overall 
                    harmony score. Each card shows the exact measurement, how far it deviates from ideal, and 
                    realistic options for adjustment.
                  </p>
                </TooltipContent>
              </Tooltip>
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Three areas where targeted intervention may improve proportional harmony score.
            </p>
            <div className="space-y-4">
              {quickWins.map((win, index) => (
                <Card key={index} className="border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-1.5 bg-foreground/60 flex-shrink-0" />
                      <div className="p-5 flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-mono text-sm">
                              {index + 1}
                            </div>
                            <h3 className="font-medium text-lg">{win.feature}</h3>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs px-2 py-1 rounded-full bg-chart-2/10 text-chart-2 font-mono flex-shrink-0 cursor-help">
                                {win.projectedGain}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[220px] p-3">
                              <p className="text-xs text-muted-foreground">
                                This is a conservative estimate of how many points your overall harmony score 
                                could increase if this specific deviation were brought within the ideal range.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        {/* Measurement vs Ideal */}
                        <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-lg bg-secondary/30 border border-border">
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                              Current
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-2.5 h-2.5 text-muted-foreground/40 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px] p-2">
                                  <p className="text-xs text-muted-foreground">Your measured value from the analysis.</p>
                                </TooltipContent>
                              </Tooltip>
                            </p>
                            <p className="text-sm font-mono font-medium">{win.currentMeasurement}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                              Ideal Range
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-2.5 h-2.5 text-muted-foreground/40 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[220px] p-2">
                                  <p className="text-xs text-muted-foreground">
                                    The mathematically derived optimal range based on established proportional 
                                    harmony research.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </p>
                            <p className="text-sm font-mono font-medium">{win.idealRange}</p>
                          </div>
                        </div>

                        {/* Impact on Harmony */}
                        <div className="mb-4">
                          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Impact on Harmony</p>
                          <p className="text-sm text-foreground leading-relaxed">{win.impactOnHarmony}</p>
                        </div>

                        {/* Improvement Options */}
                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Improvement Options</p>
                          <ul className="space-y-1.5">
                            {win.improvementOptions.map((option, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="w-1 h-1 rounded-full bg-foreground/40 mt-2 flex-shrink-0" />
                                {option}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Honest Limitation */}
                        <div className="p-3 rounded-lg bg-chart-1/5 border border-chart-1/20">
                          <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            {win.honestLimitation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* SECTION 6: LOCKED PREMIUM PREVIEW */}
          <div className="mb-12 p-6 rounded-2xl border border-border bg-card">
            <h2 className="font-serif text-xl mb-2">
              Full Structural Breakdown Available
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              78 proportional and biomechanical measurements including:
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                "Golden Ratio Mapping",
                "Orbital Spacing Analysis",
                "Philtrum-to-Lip Ratio",
                "Midface Projection Balance",
                "Jaw Taper Index",
                "Feature Relationship Matrix",
                "Symmetry Deep Dive",
                "Expression Indices"
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
                  <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: CATEGORY SCORES */}
          <div className="mb-12">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              Category Breakdown
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3 h-3 text-muted-foreground/50 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[260px] p-3">
                  <p className="text-xs text-muted-foreground">
                    Each category groups related measurements. The number below the score shows 
                    how many individual measurements were taken. Hover over any category to preview details.
                  </p>
                </TooltipContent>
              </Tooltip>
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Scores per structural category. The full report includes detailed per-measurement breakdowns.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Eyes", score: analysis.eyes?.overallScore, count: 18, desc: "Canthal tilt, palpebral fissure, lid exposure, spacing, brow analysis" },
                { label: "Nose", score: analysis.nose?.overallScore, count: 14, desc: "Bridge width/height, tip projection/rotation, alar base, dorsal profile" },
                { label: "Mouth", score: analysis.mouth?.overallScore, count: 12, desc: "Lip volume ratio, philtrum, cupid's bow, dental show, commissures" },
                { label: "Structure", score: analysis.facialStructure?.overallScore, count: 16, desc: "Face shape, cheekbone prominence, jaw definition, chin projection" },
                { label: "Proportions", score: analysis.proportions?.overallScore, count: 10, desc: "Thirds, fifths, golden ratio, facial index, interocular distance" },
                { label: "Skin", score: analysis.skin?.overallScore, count: 8, desc: "Texture, pores, tone evenness, clarity, hydration, radiance" },
              ].map((cat) => (
                <Tooltip key={cat.label}>
                  <TooltipTrigger asChild>
                    <div className="relative p-4 rounded-xl bg-card border border-border text-center overflow-hidden group cursor-pointer">
                      <p className="text-xs text-muted-foreground mb-1">{cat.label}</p>
                      <p className="text-2xl font-mono font-medium">{cat.score ?? "?"}</p>
                      <p className="text-xs text-muted-foreground mt-1">{cat.count} measurements</p>
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-medium bg-foreground text-background px-3 py-1.5 rounded-full">
                          View full breakdown
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[240px] p-3">
                    <p className="font-medium text-xs mb-0.5">{cat.label} ({cat.count} measurements)</p>
                    <p className="text-[11px] text-muted-foreground">{cat.desc}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* SECTION 8: CONVERSION CTA */}
          <div className="text-center p-8 md:p-12 rounded-2xl bg-foreground text-background">
            <h2 className="font-serif text-2xl md:text-3xl mb-3 text-balance">
              Access Your Complete Structural Report
            </h2>
            <p className="text-background/70 mb-2 text-sm max-w-lg mx-auto">
              {analysis.optimizationOpportunities?.length || 5}+ measurable deviation areas identified, {analysis.strengths?.length || 3} areas within optimal tolerance, and {analysis.featureRelationships?.length || 4} feature relationships mapped.
            </p>
            <p className="text-background/40 text-xs mb-8">
              Reports are deleted after 24 hours for your privacy.
            </p>
            
            <Button 
              size="lg" 
              variant="secondary"
              className="text-base px-10 py-7 bg-background text-foreground hover:bg-background/90"
              onClick={() => router.push(`/checkout?analysisId=${analysisId}`)}
            >
              {'Unlock Full Report \u2014 \u00A36.99'}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-background/60">
              <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Instant access</span>
              <span className="flex items-center gap-1"><Check className="w-3 h-3" /> No subscription</span>
              <span className="flex items-center gap-1"><Check className="w-3 h-3" /> 78+ measurements</span>
            </div>
          </div>

          {/* SECTION 9: PRIVACY */}
          <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
            <Shield className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Facial imagery is never stored. Analysis is proportion-based, not identity-based. Images were securely processed and immediately deleted. Reports are automatically removed after 24 hours.
              </p>
            </div>
          </div>
        </div>
      </main>
    </TooltipProvider>
  )
}
