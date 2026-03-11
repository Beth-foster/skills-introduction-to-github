"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import type { ReportData } from "@/lib/report-types"
import { InfoHover } from "./info-hover"
import { cn } from "@/lib/utils"
import { ChevronDown, Info } from "lucide-react"

function getPositionLabel(value: number): string {
  if (value <= 20) return "Low range"
  if (value <= 40) return "Lower-mid"
  if (value <= 60) return "Mid-range"
  if (value <= 80) return "Upper-mid"
  return "High range"
}

function getPositionColor(value: number): string {
  if (value <= 30 || value >= 70) return "text-chart-2"
  return "text-muted-foreground"
}

export function ReportExpression({ report }: { report: ReportData }) {
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null)
  const profile = report.expressionProfile

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="font-serif text-2xl">Expression Indices</h2>
        <InfoHover term="Expression">
          <p className="font-medium mb-1">What are expression indices?</p>
          <p className="text-muted-foreground text-xs leading-relaxed mb-2">
            Expression indices measure how your facial <strong>structure</strong> reads visually — 
            not your personality, emotions, or identity. These are driven by measurable features like 
            brow ridge prominence, jaw angle, cheekbone height, and lip fullness.
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed mb-2">
            Each index shows a spectrum. There is no &quot;good&quot; or &quot;bad&quot; end — the scale describes 
            structural characteristics, not value. Your position on each scale simply reflects the 
            geometry of your bone structure and soft tissue distribution.
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            These indices help you understand how others may perceive your face at rest, and can guide 
            grooming, styling, and cosmetic choices to shift perception in your preferred direction.
          </p>
        </InfoHover>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Structural expression profiles based on measurable morphological features. 
        Each slider shows where your bone structure and soft tissue sit on a spectrum. 
        Click any index to understand exactly which features drive that reading.
      </p>

      {/* Gender Expression Note */}
      {profile?.genderExpressionNote && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
          <Info className="w-4 h-4 text-chart-2 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium mb-1">About the masculine-feminine spectrum</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {profile.genderExpressionNote} Optimisation recommendations are designed to support 
              your personal aesthetic goals — whether that means enhancing, softening, or balancing 
              any of these structural readings.
            </p>
          </div>
        </div>
      )}

      {/* Archetype Badge */}
      {profile?.archetype && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono">Facial Archetype:</span>
          <Badge variant="secondary" className="text-xs">{profile.archetype}</Badge>
          {profile.dominantTraits.length > 0 && (
            <div className="flex gap-1.5">
              {profile.dominantTraits.map((trait, i) => (
                <Badge key={i} variant="outline" className="text-[10px] font-mono">{trait}</Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Overall Analysis */}
      {profile?.analysis && (
        <Card>
          <CardContent className="py-4">
            <p className="text-xs font-mono text-muted-foreground mb-1.5">Structural Expression Summary</p>
            <p className="text-sm text-foreground leading-relaxed">{profile.analysis}</p>
          </CardContent>
        </Card>
      )}

      {/* Expression Sliders */}
      <div className="space-y-3">
        {report.expressionIndices.map((idx) => {
          const isExpanded = expandedIndex === idx.name
          return (
            <Card key={idx.name} className="overflow-hidden">
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : idx.name)}
                className="w-full text-left"
              >
                <CardContent className="py-5 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{idx.name}</span>
                      <span className={cn("text-xs font-mono", getPositionColor(idx.value))}>
                        {idx.value}/100 — {getPositionLabel(idx.value)}
                      </span>
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      isExpanded && "rotate-180"
                    )} />
                  </div>

                  {/* Slider */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground w-24 text-right shrink-0 leading-tight">{idx.leftLabel}</span>
                    <Slider value={[idx.value]} max={100} step={1} disabled className="flex-1 [&_[role=slider]]:cursor-pointer" />
                    <span className="text-[10px] text-muted-foreground w-24 shrink-0 leading-tight">{idx.rightLabel}</span>
                  </div>

                  {/* What it means (always visible) */}
                  <p className="text-xs text-muted-foreground leading-relaxed">{idx.whatItMeans}</p>
                </CardContent>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-6 pb-5 space-y-4 border-t border-border pt-4">
                  {/* Detailed per-index explanation */}
                  {idx.detailedExplanation && (
                    <div>
                      <p className="text-xs font-mono text-muted-foreground mb-1.5">Why your face reads this way</p>
                      <p className="text-sm leading-relaxed">{idx.detailedExplanation}</p>
                    </div>
                  )}

                  {/* Visual range reference */}
                  <div className="grid grid-cols-5 gap-1 text-[9px] font-mono text-center">
                    <div className={cn("p-1.5 rounded", idx.value <= 20 ? "bg-chart-2/10 text-chart-2" : "bg-muted text-muted-foreground")}>
                      0-20<br /><span className="text-[8px]">Strong {idx.leftLabel.split("/")[0]?.trim()}</span>
                    </div>
                    <div className={cn("p-1.5 rounded", idx.value > 20 && idx.value <= 40 ? "bg-chart-2/10 text-chart-2" : "bg-muted text-muted-foreground")}>
                      21-40<br /><span className="text-[8px]">Leaning left</span>
                    </div>
                    <div className={cn("p-1.5 rounded", idx.value > 40 && idx.value <= 60 ? "bg-chart-2/10 text-chart-2" : "bg-muted text-muted-foreground")}>
                      41-60<br /><span className="text-[8px]">Balanced</span>
                    </div>
                    <div className={cn("p-1.5 rounded", idx.value > 60 && idx.value <= 80 ? "bg-chart-2/10 text-chart-2" : "bg-muted text-muted-foreground")}>
                      61-80<br /><span className="text-[8px]">Leaning right</span>
                    </div>
                    <div className={cn("p-1.5 rounded", idx.value > 80 ? "bg-chart-2/10 text-chart-2" : "bg-muted text-muted-foreground")}>
                      81-100<br /><span className="text-[8px]">Strong {idx.rightLabel.split("/")[0]?.trim()}</span>
                    </div>
                  </div>

                  {/* Explanation from AI */}
                  {idx.explanation && idx.explanation !== idx.detailedExplanation && (
                    <p className="text-xs text-muted-foreground leading-relaxed italic">{idx.explanation}</p>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
