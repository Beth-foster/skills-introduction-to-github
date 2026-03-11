"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ReportData } from "@/lib/report-types"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { InfoHover, ScoreTierLegend } from "./info-hover"

export function ReportOverview({ report }: { report: ReportData }) {
  const radarData = report.categories.map((c) => ({
    subject: c.name,
    score: c.score,
    fullMark: 100,
  }))

  const getScoreBand = (score: number) => {
    if (score >= 85) return { label: "Exceptional Proportional Consistency", tier: "Top 5%" }
    if (score >= 78) return { label: "Above-Average Structural Alignment", tier: "Top 15%" }
    if (score >= 65) return { label: "Moderate Proportional Alignment", tier: "Average range" }
    return { label: "Below-Average Structural Consistency", tier: "Below average" }
  }

  const band = getScoreBand(report.overallScore)

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center gap-2">
        <h2 className="font-serif text-2xl">Overview</h2>
        <InfoHover term="Overview">
          <p className="font-medium mb-1">What is this section?</p>
          <p className="text-muted-foreground text-xs leading-relaxed mb-2">
            The Overview provides your overall harmony score and a breakdown across 6 structural categories. 
            Think of it as a summary health check for your facial proportions.
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Your score is calculated from 78+ individual measurements weighted by importance. 
            No single feature dominates — it is the relationship between features that determines overall harmony.
          </p>
        </InfoHover>
      </div>

      <div className="grid md:grid-cols-[1fr_1.2fr] gap-6">
        {/* Score Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Overall Harmony Score
                </p>
                <InfoHover term="Harmony Score" side="bottom">
                  <p className="font-medium mb-1">How is this calculated?</p>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                    Your score reflects how closely your facial proportions align with established mathematical 
                    harmony ratios (e.g. golden ratio, facial thirds, fifths). It is NOT a measure of attractiveness — 
                    many highly attractive faces score 65-75 because they have distinctive features that deviate from 
                    mathematical averages.
                  </p>
                  <p className="font-medium mb-1 text-xs">Scoring Weights</p>
                  <div className="text-[11px] text-muted-foreground font-mono space-y-0.5">
                    <p>Structure ........... 30%</p>
                    <p>Symmetry ........... 20%</p>
                    <p>Relationships ...... 20%</p>
                    <p>Skin ............... 15%</p>
                    <p>Expression ......... 10%</p>
                    <p>Contrast ............ 5%</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <ScoreTierLegend />
                  </div>
                </InfoHover>
              </div>
              <div className="relative inline-flex items-center justify-center w-36 h-36 rounded-full border-4 border-foreground/10 mb-3">
                <span className="font-serif text-5xl font-medium">{report.overallScore}</span>
                <span className="absolute bottom-2 text-xs text-muted-foreground font-mono">/100</span>
              </div>
              <p className="text-sm font-medium mb-0.5">{band.label}</p>
              <p className="text-xs text-muted-foreground">{band.tier} — most faces score 65-78</p>
            </div>

            {/* Category Breakdown */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-1.5 mb-1">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Category Breakdown</p>
                <InfoHover term="Categories" side="right">
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Each category groups related measurements. The bar shows your score relative to 100. 
                    The weight (w) shows how much this category contributes to your overall score. 
                    A lower category score does not mean something is &quot;wrong&quot; — it indicates proportional 
                    deviation from mathematical ideals that you may or may not wish to address.
                  </p>
                </InfoHover>
              </div>
              {report.categories.map((cat) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24 shrink-0">{cat.name}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-foreground/70 transition-all"
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono w-8 text-right">{cat.score}</span>
                  <span className="text-xs text-muted-foreground/50 font-mono w-10 text-right">{cat.weight}%w</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
                Category Distribution
              </CardTitle>
              <InfoHover term="Radar Chart" side="left">
                <p className="font-medium mb-1">Reading this chart</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Each axis represents a category. The further the shape extends toward the outer edge, 
                  the higher your score in that area. A perfectly circular shape would mean all categories 
                  are equally balanced. Most faces show an irregular shape — this is normal and expected.
                </p>
              </InfoHover>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                  tickCount={5}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(var(--foreground))"
                  fill="hsl(var(--foreground))"
                  fillOpacity={0.12}
                  strokeWidth={1.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Deviation Summary Chips */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-1.5">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Key Deviations
            </CardTitle>
            <InfoHover term="Deviations" side="bottom">
              <p className="font-medium mb-1">What are deviations?</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                A deviation is the percentage your measurement falls outside the ideal proportional range. 
                Positive (+) means above ideal, negative (-) means below. &quot;High&quot; impact deviations have the 
                most influence on your overall score. Not all deviations need addressing — some contribute 
                to facial distinctiveness and character.
              </p>
            </InfoHover>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {report.deviationSummary.map((d) => (
              <Badge
                key={d.metric}
                variant={d.impact === "High" ? "destructive" : "secondary"}
                className="font-mono text-xs"
              >
                {d.metric}: {d.deviationPct > 0 ? "+" : ""}{d.deviationPct}%
                <span className="ml-1.5 opacity-60">{d.impact}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
