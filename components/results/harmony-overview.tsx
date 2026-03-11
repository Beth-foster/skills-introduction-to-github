"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { FacialAnalysis } from "@/lib/analysis-types"

interface HarmonyOverviewProps {
  analysis: FacialAnalysis
}

function getToleranceLabel(score: number): string {
  if (score >= 85) return "Within optimal tolerance"
  if (score >= 75) return "Slight deviation from optimal"
  if (score >= 65) return "Moderate deviation"
  if (score >= 55) return "Notable deviation"
  return "Significant deviation"
}

export function HarmonyOverview({ analysis }: HarmonyOverviewProps) {
  const categories = [
    { label: "Eyes", score: analysis.eyes?.overallScore || 0, count: 18 },
    { label: "Nose", score: analysis.nose?.overallScore || 0, count: 14 },
    { label: "Lips & Mouth", score: analysis.mouth?.overallScore || 0, count: 12 },
    { label: "Facial Structure", score: analysis.facialStructure?.overallScore || 0, count: 16 },
    { label: "Proportions", score: analysis.proportions?.overallScore || 0, count: 10 },
    { label: "Skin", score: analysis.skin?.overallScore || 0, count: 8 },
  ].filter(m => m.score > 0)

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Structural Overview</CardTitle>
        <p className="text-xs text-muted-foreground">
          Harmony score reflects proportional alignment, not attractiveness or value.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score + Indices */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Score */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center p-8 bg-secondary/50 rounded-xl min-w-[200px]">
            <div className="text-6xl font-mono font-medium mb-2">
              {analysis.overallHarmony.score}
            </div>
            <p className="text-xs text-muted-foreground mb-1">/ 100</p>
            <p className="text-xs text-muted-foreground text-center">
              Distribution: most faces score 65-78
            </p>
          </div>

          {/* Indices */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Structural Balance Index</span>
                <span className="text-xs font-mono">{analysis.overallHarmony.structuralBalanceIndex}/100</span>
              </div>
              <Progress value={analysis.overallHarmony.structuralBalanceIndex} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Expressive Warmth Index</span>
                <span className="text-xs font-mono">{analysis.overallHarmony.expressiveWarmthIndex}/100</span>
              </div>
              <Progress value={analysis.overallHarmony.expressiveWarmthIndex} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Definition vs Softness</span>
                <span className="text-xs font-mono">{analysis.overallHarmony.definitionVsSoftnessIndex}/100</span>
              </div>
              <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-1/2 w-px bg-border z-10" />
                <div 
                  className="h-full bg-foreground/60 rounded-full transition-all"
                  style={{ width: `${analysis.overallHarmony.definitionVsSoftnessIndex}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Soft</span>
                <span className="text-xs text-muted-foreground">Defined</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Summary */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {analysis.overallHarmony.summary}
        </p>

        {/* Deviation Summary Box */}
        {analysis.overallHarmony.deviationSummary?.length > 0 && (
          <div className="p-4 rounded-lg bg-secondary/30 border border-border">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Key Structural Deviations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {analysis.overallHarmony.deviationSummary.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-2 p-2 rounded bg-background/50">
                  <span className="text-xs">{item.metric}</span>
                  <span className="text-xs font-mono text-muted-foreground">{item.deviation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Scores */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Category Scores
          </h3>
          {categories.map((cat) => (
            <div key={cat.label}>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-medium">{cat.label}</span>
                <span className="text-sm">
                  <span className="text-foreground font-mono">{cat.score}</span>
                  <span className="text-muted-foreground"> / 100</span>
                  <span className="text-xs text-muted-foreground ml-2">({cat.count} tests)</span>
                </span>
              </div>
              <Progress value={cat.score} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{getToleranceLabel(cat.score)}</p>
            </div>
          ))}
        </div>

        {/* All faces note */}
        <p className="text-xs text-muted-foreground/60 pt-2 border-t border-border leading-relaxed">
          All faces exhibit deviation from idealised proportional ranges. Variation is biologically expected and often contributes to distinctiveness.
        </p>
      </CardContent>
    </Card>
  )
}
