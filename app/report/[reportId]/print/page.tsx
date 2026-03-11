"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { AnalysisResult } from "@/lib/analysis-types"

function getAssessmentLabel(a: string) {
  const map: Record<string, string> = {
    "within-tolerance": "Within Tolerance",
    "slight-deviation": "Slight Deviation",
    "moderate-deviation": "Moderate Deviation",
    "notable-deviation": "Notable Deviation",
  }
  return map[a] || a
}

export default function PrintReportPage() {
  const params = useParams()
  const router = useRouter()
  const reportId = params.reportId as string
  const [analysis, setAnalysis] = useState<AnalysisResult["analysis"] | null>(null)

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
      setAnalysis(parsed.analysis)
    } catch {
      router.push("/")
    }
  }, [reportId, router])

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading report...</p>
      </div>
    )
  }

  const categories = [
    { key: "facialStructure" as const, label: "Facial Structure" },
    { key: "eyes" as const, label: "Eye Area" },
    { key: "nose" as const, label: "Nose Analysis" },
    { key: "mouth" as const, label: "Mouth & Lips" },
    { key: "skin" as const, label: "Skin Assessment" },
    { key: "proportions" as const, label: "Proportions" },
  ]

  return (
    <div className="max-w-[800px] mx-auto p-8 bg-white text-black print:p-4">
      {/* Print header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-black">
        <h1 className="text-3xl font-serif font-bold tracking-tight">AXIVA</h1>
        <p className="text-sm text-gray-500 mt-1">Structural Harmony Analysis Report</p>
        <p className="text-xs text-gray-400 mt-1">
          Generated {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Score Overview */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-lg font-bold">Overall Harmony Score</h2>
          <span className="text-3xl font-mono font-bold">{analysis.overallHarmony.score}/100</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{analysis.overallHarmony.summary}</p>

        {/* Deviation summary table */}
        {analysis.overallHarmony.deviationSummary && (
          <table className="w-full mt-4 text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-1 font-semibold">Metric</th>
                <th className="text-right py-1 font-semibold">Deviation</th>
              </tr>
            </thead>
            <tbody>
              {analysis.overallHarmony.deviationSummary.map((d, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-1">{d.metric}</td>
                  <td className="py-1 text-right font-mono">{d.deviation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Sub-indices */}
        <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
          <div className="text-center p-2 border rounded">
            <div className="font-mono text-lg font-bold">{analysis.overallHarmony.structuralBalanceIndex}</div>
            <div className="text-gray-500">Structural Balance</div>
          </div>
          <div className="text-center p-2 border rounded">
            <div className="font-mono text-lg font-bold">{analysis.overallHarmony.expressiveWarmthIndex}</div>
            <div className="text-gray-500">Expressive Warmth</div>
          </div>
          <div className="text-center p-2 border rounded">
            <div className="font-mono text-lg font-bold">{analysis.overallHarmony.definitionVsSoftnessIndex}</div>
            <div className="text-gray-500">Definition Index</div>
          </div>
        </div>
      </div>

      {/* Structural Areas Within Tolerance */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-3 pb-1 border-b">Areas Within Optimal Range</h2>
        <div className="space-y-2">
          {analysis.strengths.map((s, i) => (
            <div key={i} className="text-sm">
              <span className="font-semibold">{s.feature}</span>
              <span className="text-gray-500 ml-2 font-mono text-xs">{s.deviation}</span>
              <p className="text-gray-600 text-xs mt-0.5">{s.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Measurements by Category */}
      {categories.map(({ key, label }) => {
        const cat = analysis[key] as { overallScore?: number; measurements?: Record<string, { value: string; assessment: string; explanation: string }>; summary?: string } | undefined
        if (!cat?.measurements) return null
        return (
          <div key={key} className="mb-6 break-inside-avoid">
            <h2 className="text-base font-bold mb-2 pb-1 border-b">
              {label}
              {cat.overallScore != null && <span className="font-mono text-sm text-gray-500 ml-2">({cat.overallScore}/100)</span>}
            </h2>
            {cat.summary && <p className="text-xs text-gray-500 mb-2">{cat.summary}</p>}
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-1 w-1/3">Measurement</th>
                  <th className="text-left py-1 w-1/6">Value</th>
                  <th className="text-left py-1 w-1/6">Status</th>
                  <th className="text-left py-1 w-1/3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(cat.measurements).map(([mKey, m]) => {
                  if (!m?.value) return null
                  return (
                    <tr key={mKey} className="border-b border-gray-100">
                      <td className="py-1">{mKey.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}</td>
                      <td className="py-1 font-mono">{m.value}</td>
                      <td className="py-1">{getAssessmentLabel(m.assessment)}</td>
                      <td className="py-1 text-gray-500 truncate max-w-[200px]">{m.explanation.substring(0, 100)}...</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })}

      {/* Quick Wins */}
      <div className="mb-6 break-inside-avoid">
        <h2 className="text-base font-bold mb-2 pb-1 border-b">Priority Interventions</h2>
        {analysis.quickWins.map((qw, i) => (
          <div key={i} className="mb-3 text-xs">
            <div className="font-semibold">{i + 1}. {qw.feature}</div>
            <div className="text-gray-500 font-mono">Current: {qw.currentMeasurement} | Ideal: {qw.idealRange} | Projected: {qw.projectedGain}</div>
            <p className="text-gray-600 mt-0.5">{qw.impactOnHarmony}</p>
            <p className="text-gray-400 italic mt-0.5">Limitation: {qw.honestLimitation}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-4 border-t-2 border-black text-center text-xs text-gray-400">
        <p>AXIVA Structural Harmony Analysis | axiva.co.uk</p>
        <p className="mt-1">
          This report analyses proportional alignment only. It does not define attractiveness, identity, or personal value.
          All faces exhibit natural deviation from idealised ranges.
        </p>
      </div>
    </div>
  )
}
