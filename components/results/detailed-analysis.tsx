"use client"

import React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, ChevronDown, Eye, Wind, Smile, CircleDot, Ruler, Sparkles, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FacialAnalysis } from "@/lib/analysis-types"

interface DetailedAnalysisProps {
  analysis: FacialAnalysis
  isPaid: boolean
}

const assessmentColors = {
  "within-tolerance": "bg-secondary text-foreground border-border",
  "slight-deviation": "bg-chart-1/5 text-chart-1 border-chart-1/20",
  "moderate-deviation": "bg-chart-1/10 text-chart-1 border-chart-1/30",
  "notable-deviation": "bg-chart-5/10 text-chart-5 border-chart-5/30"
}

const assessmentLabels = {
  "within-tolerance": "within tolerance",
  "slight-deviation": "slight deviation",
  "moderate-deviation": "moderate deviation",
  "notable-deviation": "notable deviation"
}

interface MeasurementItemProps {
  label: string
  measurement: {
    value: string
    assessment: keyof typeof assessmentColors
    explanation: string
  }
}

function MeasurementItem({ label, measurement }: MeasurementItemProps) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left p-3 bg-secondary/30 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <span className={cn("text-xs px-2 py-0.5 rounded-full border flex-shrink-0 font-mono", assessmentColors[measurement.assessment])}>
          {assessmentLabels[measurement.assessment] || measurement.assessment}
        </span>
      </div>
      <p className="text-xs text-muted-foreground/80 font-mono">{measurement.value}</p>
      {expanded && (
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed border-t border-border pt-2">
          {measurement.explanation}
        </p>
      )}
    </button>
  )
}

interface AnalysisSectionProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  score: number
  summary: string
  measurements: Record<string, { value: string; assessment: keyof typeof assessmentColors; explanation: string }>
  isPaid: boolean
  defaultOpen?: boolean
  disclaimer?: string
}

function AnalysisSection({ title, icon: Icon, score, summary, measurements, isPaid, defaultOpen = false, disclaimer }: AnalysisSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const measurementCount = Object.keys(measurements).length

  // Count by tolerance status
  const toleranceCounts = Object.values(measurements).reduce((acc, m) => {
    acc[m.assessment] = (acc[m.assessment] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <Card className={cn("border-border relative", !isPaid && "overflow-hidden")}>
      {!isPaid && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center p-4">
            <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Unlock full report to view</p>
          </div>
        </div>
      )}
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <p className="text-xs text-muted-foreground">{measurementCount} measurements</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-mono">{score}</p>
              <p className="text-xs text-muted-foreground">/ 100</p>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
          </div>
        </div>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="pt-0 space-y-4">
          {/* Summary */}
          <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
            {summary}
          </p>

          {/* Tolerance distribution */}
          <div className="flex flex-wrap gap-2">
            {toleranceCounts["within-tolerance"] > 0 && (
              <span className="text-xs px-2 py-1 rounded-full bg-secondary text-foreground font-mono">{toleranceCounts["within-tolerance"]} within tolerance</span>
            )}
            {toleranceCounts["slight-deviation"] > 0 && (
              <span className="text-xs px-2 py-1 rounded-full bg-chart-1/5 text-chart-1 font-mono">{toleranceCounts["slight-deviation"]} slight deviation</span>
            )}
            {toleranceCounts["moderate-deviation"] > 0 && (
              <span className="text-xs px-2 py-1 rounded-full bg-chart-1/10 text-chart-1 font-mono">{toleranceCounts["moderate-deviation"]} moderate deviation</span>
            )}
            {toleranceCounts["notable-deviation"] > 0 && (
              <span className="text-xs px-2 py-1 rounded-full bg-chart-5/10 text-chart-5 font-mono">{toleranceCounts["notable-deviation"]} notable deviation</span>
            )}
          </div>

          {/* Disclaimer if any */}
          {disclaimer && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-chart-1/5 border border-chart-1/20">
              <Info className="w-3 h-3 text-chart-1 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-chart-1">{disclaimer}</p>
            </div>
          )}

          {/* Measurements grid */}
          <div className="grid gap-2">
            {Object.entries(measurements).map(([key, measurement]) => (
              <MeasurementItem 
                key={key} 
                label={key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase()).trim()}
                measurement={measurement}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export function DetailedAnalysis({ analysis, isPaid }: DetailedAnalysisProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl">Structural Measurements</h2>
        <p className="text-sm text-muted-foreground">78+ measurements across 6 categories</p>
      </div>

      {analysis.eyes && (
        <AnalysisSection
          title="Eyes"
          icon={Eye}
          score={analysis.eyes.overallScore}
          summary={analysis.eyes.summary}
          measurements={analysis.eyes.measurements}
          isPaid={isPaid}
          defaultOpen={true}
        />
      )}

      {analysis.nose && (
        <AnalysisSection
          title="Nose"
          icon={Wind}
          score={analysis.nose.overallScore}
          summary={analysis.nose.summary}
          measurements={analysis.nose.measurements}
          isPaid={isPaid}
        />
      )}

      {analysis.mouth && (
        <AnalysisSection
          title="Lips & Mouth"
          icon={Smile}
          score={analysis.mouth.overallScore}
          summary={analysis.mouth.summary}
          measurements={analysis.mouth.measurements}
          isPaid={isPaid}
        />
      )}

      {analysis.facialStructure && (
        <AnalysisSection
          title="Facial Structure"
          icon={CircleDot}
          score={analysis.facialStructure.overallScore}
          summary={analysis.facialStructure.summary}
          measurements={analysis.facialStructure.measurements}
          isPaid={isPaid}
        />
      )}

      {analysis.proportions && (
        <AnalysisSection
          title="Proportions"
          icon={Ruler}
          score={analysis.proportions.overallScore}
          summary={analysis.proportions.summary}
          measurements={analysis.proportions.measurements}
          isPaid={isPaid}
        />
      )}

      {analysis.skin && (
        <AnalysisSection
          title="Skin"
          icon={Sparkles}
          score={analysis.skin.overallScore}
          summary={analysis.skin.summary}
          measurements={analysis.skin.measurements}
          isPaid={isPaid}
          disclaimer="Observational aesthetic assessment. Not diagnostic or medical."
        />
      )}

      {/* Transformation Timeline (paid only) */}
      {isPaid && analysis.transformationTimeline && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Projected Timeline</CardTitle>
            <p className="text-xs text-muted-foreground">
              Clinical milestones based on intervention implementation.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { key: "twoWeeks", label: "2 Weeks", items: analysis.transformationTimeline.twoWeeks, color: "border-foreground/40" },
                { key: "oneMonth", label: "1 Month", items: analysis.transformationTimeline.oneMonth, color: "border-foreground/30" },
                { key: "threeMonths", label: "3 Months", items: analysis.transformationTimeline.threeMonths, color: "border-foreground/25" },
                { key: "sixMonths", label: "6 Months", items: analysis.transformationTimeline.sixMonths, color: "border-foreground/20" },
                { key: "twelveMonths", label: "12 Months", items: analysis.transformationTimeline.twelveMonths, color: "border-foreground/15" },
              ].map(({ key, label, items, color }) => 
                items?.length > 0 && (
                  <div key={key} className={cn("border-l-2 pl-4", color)}>
                    <p className="text-xs font-mono font-medium mb-2">{label}</p>
                    <ul className="space-y-1">
                      {items.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
