"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReportData } from "@/lib/report-types"
import { cn } from "@/lib/utils"
import { InfoHover, AssessmentLegend } from "./info-hover"

function ToleranceBar({ value, idealMin, idealMax, label }: { value: number; idealMin: number; idealMax: number; label: string }) {
  const min = Math.min(value, idealMin) - 5
  const max = Math.max(value, idealMax) + 5
  const range = max - min
  const idealLeft = ((idealMin - min) / range) * 100
  const idealWidth = ((idealMax - idealMin) / range) * 100
  const markerPos = ((value - min) / range) * 100
  const isWithin = value >= idealMin && value <= idealMax

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">{label}</span>
        <span className={cn("text-xs font-mono", isWithin ? "text-chart-2" : "text-chart-5")}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-muted overflow-hidden">
        {/* Ideal range */}
        <div
          className="absolute top-0 h-full bg-chart-2/20 border-x border-chart-2/40"
          style={{ left: `${idealLeft}%`, width: `${idealWidth}%` }}
        />
        {/* Your value marker */}
        <div
          className={cn("absolute top-0 w-1.5 h-full rounded-full", isWithin ? "bg-chart-2" : "bg-chart-5")}
          style={{ left: `${Math.max(0, Math.min(markerPos - 1, 98))}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground/60 font-mono">
        <span>{idealMin}%</span>
        <span>Ideal Range</span>
        <span>{idealMax}%</span>
      </div>
    </div>
  )
}

export function ReportStructure({ report }: { report: ReportData }) {
  const [expandedFifth, setExpandedFifth] = useState<number | null>(null)

  const fifthLabels = ["Outer Left", "Inner Left", "Centre", "Inner Right", "Outer Right"]
  const isWithinRange = (v: number) => v >= report.fifths.idealRange[0] && v <= report.fifths.idealRange[1]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="font-serif text-2xl">Structure</h2>
        <InfoHover term="Structure">
          <p className="font-medium mb-1">Why does structure matter?</p>
          <p className="text-muted-foreground text-xs leading-relaxed mb-2">
            Structural analysis examines the foundational geometry of your face — how it divides vertically (thirds), 
            horizontally (fifths), and how symmetrical the left and right sides are. These proportions form the 
            &quot;architecture&quot; that all other features sit within.
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed mb-3">
            Small deviations here have the largest impact on your overall score because structure accounts for 30% 
            of the total weight.
          </p>
          <AssessmentLegend />
        </InfoHover>
      </div>

      {/* Facial Thirds */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-1.5">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Facial Thirds
            </CardTitle>
            <InfoHover term="Thirds">
              <p className="font-medium mb-1">What are facial thirds?</p>
              <p className="text-muted-foreground text-xs leading-relaxed mb-2">
                Your face is divided into three horizontal zones: <strong>Upper</strong> (hairline to brow), 
                <strong>Middle</strong> (brow to nose base), and <strong>Lower</strong> (nose base to chin). 
                Ideally each third is approximately 33.3% of total face height.
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                A shorter lower third can make the midface appear longer, while an elongated lower third 
                draws attention downward. Deviations of 3% or less are generally imperceptible.
              </p>
            </InfoHover>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            The face is divided into three horizontal zones. Equal distribution (33.3% each) indicates balanced vertical proportion. The tolerance bars below show where your measurements fall relative to the ideal range.
          </p>
          <ToleranceBar value={report.thirds.upper} idealMin={report.thirds.idealRange[0]} idealMax={report.thirds.idealRange[1]} label="Upper Third (Trichion to Glabella)" />
          <ToleranceBar value={report.thirds.mid} idealMin={report.thirds.idealRange[0]} idealMax={report.thirds.idealRange[1]} label="Middle Third (Glabella to Subnasale)" />
          <ToleranceBar value={report.thirds.lower} idealMin={report.thirds.idealRange[0]} idealMax={report.thirds.idealRange[1]} label="Lower Third (Subnasale to Menton)" />
        </CardContent>
      </Card>

      {/* Facial Fifths */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-1.5">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Facial Fifths
            </CardTitle>
            <InfoHover term="Fifths">
              <p className="font-medium mb-1">What are facial fifths?</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Your face width is divided into 5 equal vertical segments. From left to right: outer eye to ear, 
                inner eye to outer eye, between the eyes, and mirrored on the right. Each segment should be 
                approximately 20% of total width. This determines horizontal balance — whether your eyes appear 
                close-set, wide-set, or balanced relative to your nose and facial edges.
              </p>
            </InfoHover>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Five vertical segments measured across the face width. Ideally each is approximately 20% of total width. Click a segment to see how it relates to your facial balance.
          </p>
          <div className="flex gap-0.5">
            {report.fifths.segments.map((seg, i) => (
              <button
                key={i}
                onClick={() => setExpandedFifth(expandedFifth === i ? null : i)}
                className={cn(
                  "flex-1 py-3 rounded-sm text-center transition-colors cursor-pointer",
                  expandedFifth === i ? "ring-1 ring-foreground" : "",
                  isWithinRange(seg) ? "bg-chart-2/15 hover:bg-chart-2/25" : "bg-chart-5/15 hover:bg-chart-5/25"
                )}
              >
                <span className="block text-xs font-mono">{seg.toFixed(1)}%</span>
                <span className="block text-[10px] text-muted-foreground mt-0.5">{fifthLabels[i]}</span>
              </button>
            ))}
          </div>
          {expandedFifth !== null && (
            <div className="p-3 rounded-md bg-muted/50 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{fifthLabels[expandedFifth]}:</span>{" "}
              {isWithinRange(report.fifths.segments[expandedFifth])
                ? `At ${report.fifths.segments[expandedFifth].toFixed(1)}%, this segment falls within the ideal range of ${report.fifths.idealRange[0]}-${report.fifths.idealRange[1]}%. No deviation noted.`
                : `At ${report.fifths.segments[expandedFifth].toFixed(1)}%, this segment deviates from the ideal range of ${report.fifths.idealRange[0]}-${report.fifths.idealRange[1]}%. This affects horizontal balance perception.`
              }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Symmetry Panel */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-1.5">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Symmetry Analysis
            </CardTitle>
            <InfoHover term="Symmetry">
              <p className="font-medium mb-1">How symmetry is measured</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                We compare corresponding points on the left and right sides of your face. 
                No human face is perfectly symmetrical — even the most harmonious faces show 2-4% deviation. 
                Research shows that asymmetry under 5% is virtually imperceptible to the human eye. 
                The colour coding below shows green for imperceptible, amber for minor, and red for noticeable asymmetry.
              </p>
            </InfoHover>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {report.symmetry.map((s) => (
              <div key={s.area} className="flex items-center gap-3">
                <span className="text-xs w-24 shrink-0">{s.area}</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      s.deviationPct <= 2 ? "bg-chart-2" : s.deviationPct <= 4 ? "bg-chart-4" : "bg-chart-5"
                    )}
                    style={{ width: `${Math.min(s.deviationPct * 10, 100)}%` }}
                  />
                </div>
                <span className={cn(
                  "text-xs font-mono w-10 text-right",
                  s.deviationPct <= 2 ? "text-chart-2" : s.deviationPct <= 4 ? "text-chart-4" : "text-chart-5"
                )}>
                  {s.deviationPct}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
