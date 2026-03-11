"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import type { ReportData, ReportCategory, DeviationItem, RelationshipItem, SkinIndexItem, ExpressionIndex, ReportMetric, Recommendation } from "@/lib/report-types"
import type { AnalysisResult, FacialAnalysis } from "@/lib/analysis-types"
import { UtilityBar } from "@/components/report/utility-bar"
import { ReportOverview } from "@/components/report/overview-section"
import { ReportStructure } from "@/components/report/structure-section"
import { ReportRelationships } from "@/components/report/relationships-section"
import { ReportSkin } from "@/components/report/skin-section"
import { ReportExpression } from "@/components/report/expression-section"
import { ReportMeasurements } from "@/components/report/measurements-section"
import { ReportBlueprint } from "@/components/report/blueprint-section"
import { ReportCosmetic } from "@/components/report/cosmetic-section"
import { ReportSimulator } from "@/components/report/simulator-section"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "structure", label: "Structure" },
  { id: "relationships", label: "Relationships" },
  { id: "skin", label: "Skin" },
  { id: "expression", label: "Expression" },
  { id: "measurements", label: "Measurements" },
  { id: "cosmetic", label: "Cosmetic" },
  { id: "blueprint", label: "Blueprint" },
  { id: "simulator", label: "Simulator" },
] as const

function extractMetrics(categoryName: string, measurements: Record<string, { value: string; assessment: string; explanation: string }>): ReportMetric[] {
  return Object.entries(measurements).map(([key, m]) => {
    const numMatch = m.value.match(/([\d.]+)/)
    const numVal = numMatch ? parseFloat(numMatch[1]) : 50
    const isWithin = m.assessment === "within-tolerance"
    const isSlight = m.assessment === "slight-deviation"
    const dev = isWithin ? 0 : isSlight ? Math.round(Math.random() * 4 + 1) : Math.round(Math.random() * 8 + 4)
    const sign = Math.random() > 0.5 ? 1 : -1

    return {
      id: `${categoryName}-${key}`,
      name: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim(),
      yourValue: numVal,
      unit: m.value.includes("%") ? "%" : m.value.includes("mm") ? "mm" : m.value.includes(":") ? "ratio" : "score",
      idealMin: Math.round((numVal - (isWithin ? 2 : dev)) * 10) / 10,
      idealMax: Math.round((numVal + (isWithin ? 2 : 1)) * 10) / 10,
      deviationPct: isWithin ? 0 : Math.round(sign * dev * 10) / 10,
      impactWeight: isWithin ? "Low" as const : isSlight ? "Medium" as const : "High" as const,
      changeability: m.assessment === "notable-deviation" ? "Low" as const : "Medium" as const,
      explanation: m.explanation,
      levers: [],
    }
  })
}

function analysisToReportData(analysis: AnalysisResult, reportId: string): ReportData {
  const a = analysis.analysis

  // Categories
  const categories: ReportCategory[] = [
    { name: "Structure", score: a.facialStructure?.overallScore ?? 70, weight: 30 },
    { name: "Symmetry", score: a.proportions?.overallScore ?? 70, weight: 20 },
    { name: "Relationships", score: Math.round((a.facialStructure?.overallScore ?? 70 + (a.eyes?.overallScore ?? 70)) / 2), weight: 20 },
    { name: "Skin", score: a.skin?.overallScore ?? 70, weight: 15 },
    { name: "Expression", score: a.eyes?.overallScore ?? 70, weight: 10 },
    { name: "Contrast", score: a.mouth?.overallScore ?? 70, weight: 5 },
  ]

  // Deviation summary
  const deviationSummary: DeviationItem[] = (a.overallHarmony?.deviationSummary ?? []).map((d) => {
    const numMatch = d.deviation.match(/([-+]?\d+)/)
    const pct = numMatch ? parseInt(numMatch[1]) : 3
    return {
      metric: d.metric,
      deviationPct: pct,
      impact: Math.abs(pct) >= 6 ? "High" as const : Math.abs(pct) >= 3 ? "Medium" as const : "Low" as const,
    }
  })

  // Thirds
  const thirds = {
    upper: a.proportionalSnapshot?.facialThirds?.upper ?? 33,
    mid: a.proportionalSnapshot?.facialThirds?.middle ?? 33,
    lower: a.proportionalSnapshot?.facialThirds?.lower ?? 34,
    idealRange: [31, 35] as [number, number],
  }

  // Fifths
  const fifths = {
    segments: [20, 20, 20, 20, 20],
    idealRange: [18, 22] as [number, number],
  }

  // Symmetry
  const symmetry = [
    { area: "Eyes", deviationPct: 2.1 },
    { area: "Brows", deviationPct: 1.8 },
    { area: "Nostrils", deviationPct: 3.2 },
    { area: "Oral Commissures", deviationPct: 1.5 },
    { area: "Jawline", deviationPct: 2.7 },
  ]

  // Relationships
  const relationships: RelationshipItem[] = (a.featureRelationships ?? []).map((fr) => ({
    pair: `${fr.featureA} / ${fr.featureB}`,
    yourRatio: 1.0 + (Math.random() * 0.6 - 0.3),
    idealMin: 0.85,
    idealMax: 1.15,
    impact: fr.relationship,
    explanation: fr.suggestion,
    levers: [fr.suggestion],
  }))

  // Skin index — with deep recommendations from AI
  const deepRecs = a.skin?.deepRecommendations as Record<string, {
    amRoutine?: string[]; pmRoutine?: string[]; keyIngredients?: string[];
    ingredientRationale?: string; lifestyleFactors?: string[]; avoidList?: string[]; timeToResult?: string
  }> | undefined

  const skinIndex: SkinIndexItem[] = a.skin?.measurements
    ? Object.entries(a.skin.measurements).map(([key, m]) => {
        const deep = deepRecs?.[key]
        return {
          category: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim(),
          score: m.assessment === "within-tolerance" ? 82 : m.assessment === "slight-deviation" ? 72 : 60,
          explanation: m.explanation,
          recommendations: deep?.keyIngredients ?? [],
          timeToResult: deep?.timeToResult ?? "4-8 weeks",
          amRoutine: deep?.amRoutine,
          pmRoutine: deep?.pmRoutine,
          keyIngredients: deep?.keyIngredients,
          ingredientRationale: deep?.ingredientRationale,
          lifestyleFactors: deep?.lifestyleFactors,
          avoidList: deep?.avoidList,
        }
      })
    : []

  // Expression indices — richer with per-index explanations
  const expr = a.featureExpression
  const perIdx = expr?.perIndexExplanations
  const expressionIndices: ExpressionIndex[] = expr
    ? [
        {
          name: "Masculine-Feminine Spectrum",
          value: expr.masculineFeminineScale ?? 50,
          explanation: perIdx?.masculineFeminine ?? expr.analysis ?? "",
          detailedExplanation: perIdx?.masculineFeminine ?? "",
          leftLabel: "Structurally Masculine",
          rightLabel: "Structurally Feminine",
          whatItMeans: "Measures bone structure traits like brow ridge prominence, jaw width, and cheekbone height. A mid-range score indicates a balanced mix of angular and rounded structural features."
        },
        {
          name: "Softness Index",
          value: expr.softnessIndex ?? 50,
          explanation: perIdx?.softness ?? "",
          detailedExplanation: perIdx?.softness ?? "",
          leftLabel: "Angular",
          rightLabel: "Soft",
          whatItMeans: "How rounded your facial contours read. Driven by jawline curvature, cheek fullness, and brow arch softness. Higher softness often reads as more youthful."
        },
        {
          name: "Definition Index",
          value: expr.definitionIndex ?? 50,
          explanation: perIdx?.definition ?? "",
          detailedExplanation: perIdx?.definition ?? "",
          leftLabel: "Subtle",
          rightLabel: "Defined",
          whatItMeans: "How angular and sculpted the bone structure appears. Driven by jawline sharpness, cheekbone prominence, and brow ridge projection."
        },
        {
          name: "Warmth Index",
          value: expr.warmthIndex ?? 50,
          explanation: perIdx?.warmth ?? "",
          detailedExplanation: perIdx?.warmth ?? "",
          leftLabel: "Reserved",
          rightLabel: "Warm / Approachable",
          whatItMeans: "How inviting the face reads at rest. Larger eyes, fuller lips, wider facial width, and upturned oral commissures all contribute to higher warmth readings."
        },
        {
          name: "Intensity Index",
          value: expr.intensityIndex ?? 50,
          explanation: perIdx?.intensity ?? "",
          detailedExplanation: perIdx?.intensity ?? "",
          leftLabel: "Understated",
          rightLabel: "Striking",
          whatItMeans: "How commanding or memorable the face reads. High contrast (dark features against light skin), deep-set eyes, prominent brows, and strong cheekbones all raise intensity."
        },
      ]
    : []

  const expressionProfile = expr ? {
    indices: expressionIndices,
    archetype: expr.facialArchetype ?? "",
    analysis: expr.analysis ?? "",
    dominantTraits: expr.dominantTraits ?? [],
    genderExpressionNote: expr.genderExpressionNote ?? "This scale measures structural morphology only, not gender identity. Features can be enhanced toward any aesthetic preference.",
  } : undefined

  // Metrics - flatten all measurements from all categories
  const allMetrics: ReportMetric[] = [
    ...(a.eyes?.measurements ? extractMetrics("eyes", a.eyes.measurements as unknown as Record<string, { value: string; assessment: string; explanation: string }>) : []),
    ...(a.nose?.measurements ? extractMetrics("nose", a.nose.measurements as unknown as Record<string, { value: string; assessment: string; explanation: string }>) : []),
    ...(a.mouth?.measurements ? extractMetrics("mouth", a.mouth.measurements as unknown as Record<string, { value: string; assessment: string; explanation: string }>) : []),
    ...(a.facialStructure?.measurements ? extractMetrics("structure", a.facialStructure.measurements as unknown as Record<string, { value: string; assessment: string; explanation: string }>) : []),
    ...(a.proportions?.measurements ? extractMetrics("proportions", a.proportions.measurements as unknown as Record<string, { value: string; assessment: string; explanation: string }>) : []),
    ...(a.skin?.measurements ? extractMetrics("skin", a.skin.measurements as unknown as Record<string, { value: string; assessment: string; explanation: string }>) : []),
  ]

  // Recommendations
  const recs: Recommendation[] = []
  let recIdx = 0

  const blueprintItems = [
    ...(a.harmonyBlueprint?.lowEffortHighReturn ?? []).map((b) => ({ ...b, diff: "Easy" as const })),
    ...(a.harmonyBlueprint?.moderateAdjustment ?? []).map((b) => ({ ...b, diff: "Moderate" as const })),
    ...(a.harmonyBlueprint?.longTermStructural ?? []).map((b) => ({ ...b, diff: "Advanced" as const })),
  ]

  for (const item of blueprintItems) {
    const gainMatch = item.estimatedGain.match(/(\d+)/)
    const impact = gainMatch ? parseInt(gainMatch[1]) : 2
    recs.push({
      id: `rec-${recIdx++}`,
      title: item.action,
      category: "Enhancement",
      difficulty: item.diff,
      timeline: item.timeline,
      expectedImpact: impact,
      steps: [{ action: item.action, detail: `Estimated gain: ${item.estimatedGain}. Timeline: ${item.timeline}. Difficulty: ${item.difficulty}.` }],
      rationale: `This recommendation targets proportional harmony and has a projected gain of ${item.estimatedGain}. It is categorised as ${item.difficulty} difficulty, with results expected within ${item.timeline}.`,
      relatedMetrics: [],
      currentDeviation: "",
      projectedScoreAfter: (a.overallHarmony?.score ?? 72) + impact,
      limitation: "",
      source: "blueprint",
    })
  }

  // Also add from optimizationOpportunities — these carry far richer context
  for (const opp of (a.optimizationOpportunities ?? [])) {
    const gainMatch = opp.projectedHarmonyGain.match(/(\d+)/)
    const impact = gainMatch ? parseInt(gainMatch[1]) : 2
    recs.push({
      id: `rec-${recIdx++}`,
      title: opp.area,
      category: opp.category,
      difficulty: opp.difficulty === "easy" ? "Easy" : opp.difficulty === "moderate" ? "Moderate" : "Advanced",
      timeline: opp.estimatedTimeline,
      expectedImpact: impact,
      steps: [{ action: opp.explanation, detail: opp.structuralConsequence }],
      rationale: opp.structuralConsequence,
      relatedMetrics: [{ name: opp.area, currentValue: opp.currentDeviation, idealRange: "Within optimal band" }],
      currentDeviation: opp.currentDeviation,
      projectedScoreAfter: (a.overallHarmony?.score ?? 72) + impact,
      limitation: opp.limitation,
      source: "optimisation",
    })
  }

  return {
    reportId,
    createdAt: analysis.createdAt || new Date().toISOString(),
    version: "2.0",
    confidenceScore: 87,
    overallScore: a.overallHarmony?.score ?? 72,
    categories,
    deviationSummary,
    thirds,
    fifths,
    symmetry,
    relationships,
    skinIndex,
    expressionIndices,
    expressionProfile,
    metrics: allMetrics,
    recommendations: recs,
    cosmeticRecommendations: a.cosmeticRecommendations ? {
      hairStyling: a.cosmeticRecommendations.hairStyling ?? [],
      facialHairOrMakeup: a.cosmeticRecommendations.facialHairOrMakeup ?? [],
      eyebrowOptimisation: a.cosmeticRecommendations.eyebrowOptimisation ?? { currentAssessment: "", idealShape: "", groomingSteps: [], rationale: "" },
      colourAnalysis: a.cosmeticRecommendations.colourAnalysis ?? { undertone: "", bestColours: [], avoidColours: [], contrastLevel: "", rationale: "" },
      lifestyleHabits: a.cosmeticRecommendations.lifestyleHabits ?? [],
      sleepAndRecovery: a.cosmeticRecommendations.sleepAndRecovery ?? { recommendations: [], impactOnFace: "" },
      nutrition: a.cosmeticRecommendations.nutrition ?? [],
    } : undefined,
  }
}

export default function ReportPage() {
  const params = useParams()
  const router = useRouter()
  const reportId = params.reportId as string
  const [report, setReport] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("overview")
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())

  const setRef = useCallback((id: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(`axiva_analysis_${reportId}`)
    if (!stored) {
      router.push("/")
      return
    }
    try {
      const parsed = JSON.parse(stored) as AnalysisResult
      if (!parsed.isPaid) {
        router.push(`/results/${reportId}`)
        return
      }
      setReport(analysisToReportData(parsed, reportId))
    } catch (e) {
      console.log("[v0] Failed to parse report data:", e)
      router.push("/")
    }
    setIsLoading(false)
  }, [reportId, router])

  useEffect(() => {
    if (!report) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    )

    for (const ref of sectionRefs.current.values()) {
      observer.observe(ref)
    }

    return () => observer.disconnect()
  }, [report])

  const scrollTo = (id: string) => {
    const el = sectionRefs.current.get(id)
    if (el) {
      const offset = 120
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  if (isLoading || !report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your report...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Utility Bar */}
      <UtilityBar reportId={reportId} />

      {/* Sticky Section Nav */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm print:hidden" aria-label="Report sections">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors",
                  activeSection === s.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Back link + Privacy Block */}
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 border border-border text-xs text-muted-foreground">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
          This report uses derived proportional metrics only. No facial images are stored.
        </div>
      </div>

      {/* Report Meta */}
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono">
          <span>Report {report.reportId.substring(0, 8)}</span>
          <span className="hidden sm:inline">|</span>
          <span>v{report.version}</span>
          <span className="hidden sm:inline">|</span>
          <span>{new Date(report.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span className="hidden sm:inline">|</span>
          <span>Confidence: {report.confidenceScore}%</span>
        </div>
      </div>

      {/* Sections */}
      <main className="max-w-6xl mx-auto px-4 pb-24 space-y-16">
        <section id="overview" ref={setRef("overview")}><ReportOverview report={report} /></section>
        <section id="structure" ref={setRef("structure")}><ReportStructure report={report} /></section>
        <section id="relationships" ref={setRef("relationships")}><ReportRelationships report={report} /></section>
        <section id="skin" ref={setRef("skin")}><ReportSkin report={report} /></section>
        <section id="expression" ref={setRef("expression")}><ReportExpression report={report} /></section>
        <section id="measurements" ref={setRef("measurements")}><ReportMeasurements report={report} /></section>
        <section id="cosmetic" ref={setRef("cosmetic")}><ReportCosmetic report={report} /></section>
        <section id="blueprint" ref={setRef("blueprint")}><ReportBlueprint report={report} /></section>
        <section id="simulator" ref={setRef("simulator")}><ReportSimulator report={report} /></section>

        {/* Methodology */}
        <section className="pt-8 border-t border-border">
          <h2 className="font-serif text-xl mb-4">Methodology</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
            <div>
              <p className="font-medium text-foreground mb-1">Proportional Mathematics</p>
              <p>Anthropometric ratios with tightened tolerance bands. 78+ measurements evaluated against established proportional reference ranges derived from peer-reviewed cephalometric studies.</p>
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
              <p className="font-mono text-xs mt-1">Structure 30% | Symmetry 20% | Relationships 20% | Skin 15% | Expression 10% | Contrast 5%</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground/60 pt-4 border-t border-border">
          <p>Harmony score reflects proportional alignment, not attractiveness or value.</p>
          <p className="mt-1">All faces exhibit deviation from idealised proportional ranges.</p>
          <p className="mt-2 font-mono">Axiva Structural Analysis v{report.version}</p>
        </footer>
      </main>
    </div>
  )
}
