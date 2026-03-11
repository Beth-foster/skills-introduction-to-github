"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import type { ReportData } from "@/lib/report-types"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface SimSlider {
  id: string
  label: string
  min: number
  max: number
  default: number
  impactMap: Record<string, number> // category name -> weight of impact per unit
}

const SIM_SLIDERS: SimSlider[] = [
  {
    id: "radiance",
    label: "Radiance / Contrast",
    min: -10,
    max: 10,
    default: 0,
    impactMap: { Skin: 0.4, Contrast: 0.6, Expression: 0.1 },
  },
  {
    id: "brow",
    label: "Brow Framing",
    min: -10,
    max: 10,
    default: 0,
    impactMap: { Structure: 0.2, Symmetry: 0.15, Expression: 0.3 },
  },
  {
    id: "undereye",
    label: "Under-eye Brightness",
    min: -10,
    max: 10,
    default: 0,
    impactMap: { Skin: 0.3, Expression: 0.2, Contrast: 0.1 },
  },
  {
    id: "texture",
    label: "Texture Consistency",
    min: -10,
    max: 10,
    default: 0,
    impactMap: { Skin: 0.5, Contrast: 0.15 },
  },
]

export function ReportSimulator({ report }: { report: ReportData }) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(SIM_SLIDERS.map((s) => [s.id, s.default]))
  )

  const projectedCategories = useMemo(() => {
    return report.categories.map((cat) => {
      let delta = 0
      for (const slider of SIM_SLIDERS) {
        const weight = slider.impactMap[cat.name] || 0
        delta += values[slider.id] * weight
      }
      return {
        ...cat,
        projectedScore: Math.max(0, Math.min(100, Math.round(cat.score + delta))),
      }
    })
  }, [report.categories, values])

  const projectedOverall = useMemo(() => {
    const totalWeight = projectedCategories.reduce((sum, c) => sum + c.weight, 0)
    const weighted = projectedCategories.reduce((sum, c) => sum + c.projectedScore * c.weight, 0)
    return Math.round(weighted / totalWeight)
  }, [projectedCategories])

  const scoreDelta = projectedOverall - report.overallScore

  const radarData = projectedCategories.map((c) => ({
    subject: c.name,
    current: c.score,
    projected: c.projectedScore,
    fullMark: 100,
  }))

  const isModified = Object.values(values).some((v) => v !== 0)

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl">Harmony Simulator</h2>
      <div className="px-3 py-2 rounded-md bg-chart-4/10 border border-chart-4/20 text-xs text-muted-foreground">
        Projected, not structural change. These sliders model perceptual adjustments achievable through grooming, skincare, and presentation -- not bone structure modification.
      </div>

      <div className="grid md:grid-cols-[1fr_1.2fr] gap-6">
        {/* Sliders */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              What-If Adjustments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {SIM_SLIDERS.map((s) => (
              <div key={s.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{s.label}</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {values[s.id] > 0 ? "+" : ""}{values[s.id]}
                  </span>
                </div>
                <Slider
                  value={[values[s.id]]}
                  min={s.min}
                  max={s.max}
                  step={1}
                  onValueChange={([v]) => setValues((prev) => ({ ...prev, [s.id]: v }))}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground/50 font-mono">
                  <span>{s.min}</span>
                  <span>0</span>
                  <span>+{s.max}</span>
                </div>
              </div>
            ))}

            {/* Projected Delta */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Projected Score</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg">{projectedOverall}</span>
                  {isModified && (
                    <Badge variant={scoreDelta >= 0 ? "secondary" : "destructive"} className="font-mono text-[10px]">
                      {scoreDelta > 0 ? "+" : ""}{scoreDelta}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projected Radar */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Projected Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} tickCount={5} />
                <Radar name="Current" dataKey="current" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.05} strokeWidth={1} strokeDasharray="4 4" />
                <Radar name="Projected" dataKey="projected" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.12} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-muted-foreground inline-block" style={{ borderTop: "1px dashed" }} />Current</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-chart-2 inline-block" />Projected</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
