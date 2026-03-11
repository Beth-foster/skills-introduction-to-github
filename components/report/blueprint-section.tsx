"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, Copy, Mail, ChevronDown, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react"
import type { ReportData, Recommendation } from "@/lib/report-types"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { InfoHover, ScoreTierLegend } from "./info-hover"

const difficultyConfig = {
  Easy: { label: "Quick Win", color: "bg-chart-2/10 text-chart-2 border-chart-2/20" },
  Moderate: { label: "Moderate Effort", color: "bg-chart-4/10 text-chart-4 border-chart-4/20" },
  Advanced: { label: "Long-term", color: "bg-chart-5/10 text-chart-5 border-chart-5/20" },
}

const sourceLabels: Record<string, string> = {
  blueprint: "From Harmony Blueprint",
  optimisation: "From Deviation Analysis",
  cosmetic: "From Cosmetic Layer",
}

export function ReportBlueprint({ report }: { report: ReportData }) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(report.recommendations.map((r) => r.id)))
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const activeRecs = useMemo(
    () => report.recommendations.filter((r) => selected.has(r.id)),
    [report.recommendations, selected]
  )

  const totalImpact = activeRecs.reduce((sum, r) => sum + r.expectedImpact, 0)
  const projectedScore = Math.min(report.overallScore + totalImpact, 100)

  const byTimeline = useMemo(() => {
    const groups: Record<string, Recommendation[]> = {
      "2 Weeks": [],
      "1 Month": [],
      "3 Months": [],
      "6+ Months": [],
    }
    for (const r of activeRecs) {
      const tl = r.timeline.toLowerCase()
      if (tl.includes("immediate") || tl.includes("2 week") || tl.includes("2-4 week")) groups["2 Weeks"].push(r)
      else if (tl.includes("1 month") || tl.includes("4-6 week") || tl.includes("2-6 week")) groups["1 Month"].push(r)
      else if (tl.includes("3 month") || tl.includes("8-12 week") || tl.includes("3-6")) groups["3 Months"].push(r)
      else groups["6+ Months"].push(r)
    }
    return groups
  }, [activeRecs])

  const copySummary = () => {
    const text = activeRecs
      .map(
        (r) =>
          `${r.title} (${r.difficulty}, ${r.timeline}, +${r.expectedImpact} pts)\n${r.rationale}\nSteps:\n${r.steps.map((s, i) => `  ${i + 1}. ${s.action}${s.detail ? ` — ${s.detail}` : ""}`).join("\n")}${r.limitation ? `\nLimitation: ${r.limitation}` : ""}`
      )
      .join("\n\n")
    navigator.clipboard.writeText(text)
    toast({ title: "Copied to clipboard", description: "Blueprint summary with full context copied." })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="font-serif text-2xl">Blueprint Builder</h2>
        <InfoHover term="Blueprint Builder">
          <p className="font-medium mb-1">How to use this section</p>
          <p className="text-muted-foreground text-xs leading-relaxed mb-2">
            This is your personalised improvement plan. Each recommendation is directly tied to measurements 
            from your analysis — it shows exactly which proportional deviation it addresses, how many points 
            it could add to your score, and a realistic timeline.
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed mb-2">
            Check/uncheck items to build your own plan. The projected score updates in real-time as you 
            select which actions you want to take. Click any item to expand its full context.
          </p>
          <p className="font-medium mb-1 text-xs">Point values explained</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Each recommendation shows a conservative point gain estimate. These are not guaranteed — 
            they represent the mathematical impact of bringing the related measurement(s) into the ideal range.
            Actual results depend on individual response and consistency.
          </p>
        </InfoHover>
      </div>

      {/* Score Projection Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-center">
                <p className="text-[10px] font-mono text-muted-foreground uppercase">Current</p>
                <p className="text-2xl font-serif font-medium">{report.overallScore}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="text-center">
                <p className="text-[10px] font-mono text-chart-2 uppercase">Projected</p>
                <p className="text-2xl font-serif font-medium text-chart-2">{projectedScore}</p>
              </div>
              <div className="flex-1 mx-3 hidden sm:block">
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-foreground/30 rounded-full transition-all"
                    style={{ width: `${report.overallScore}%` }}
                  />
                  <div
                    className="absolute h-full bg-chart-2/50 rounded-full transition-all"
                    style={{ width: `${projectedScore}%` }}
                  />
                  <div
                    className="absolute h-full bg-chart-2 rounded-full transition-all"
                    style={{ width: `${report.overallScore}%` }}
                  />
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="text-[9px] text-muted-foreground font-mono">0</span>
                  <span className="text-[9px] text-muted-foreground font-mono">50</span>
                  <span className="text-[9px] text-muted-foreground font-mono">100</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="font-mono text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{totalImpact} pts ({activeRecs.length} selected)
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Each recommendation below is linked to specific measurements from your analysis. Expand any item to see 
        which metrics it targets, the current deviation, and exactly how it contributes to your projected score. 
        Use the checkboxes to build your personalised plan.
      </p>

      <Tabs defaultValue="checklist">
        <TabsList>
          <TabsTrigger value="checklist" className="text-xs">Checklist</TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="mt-4 space-y-3">
          {report.recommendations.map((rec) => {
            const isSelected = selected.has(rec.id)
            const isExpanded = expanded.has(rec.id)
            const diff = difficultyConfig[rec.difficulty]

            return (
              <Card key={rec.id} className={cn("transition-opacity", !isSelected && "opacity-50")}>
                <CardContent className="py-0 px-0">
                  {/* Main row */}
                  <div className="flex items-start gap-3 px-4 py-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggle(rec.id)}
                      className="mt-1"
                      id={rec.id}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <label htmlFor={rec.id} className="text-sm font-medium cursor-pointer block leading-snug">{rec.title}</label>
                        <Badge className={cn("text-[10px] font-mono border shrink-0", diff.color)}>
                          +{rec.expectedImpact} pts
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        <Badge variant="secondary" className="text-[10px]">{rec.category}</Badge>
                        <Badge variant="secondary" className={cn("text-[10px] border", diff.color)}>{diff.label}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{rec.timeline}</Badge>
                        {rec.source && (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground/60">
                            {sourceLabels[rec.source] ?? rec.source}
                          </Badge>
                        )}
                      </div>

                      {/* Rationale preview */}
                      {rec.rationale && (
                        <p className="text-xs text-muted-foreground leading-relaxed mt-2 line-clamp-2">{rec.rationale}</p>
                      )}

                      {/* Expand toggle */}
                      <button
                        onClick={() => toggleExpanded(rec.id)}
                        className="flex items-center gap-1 mt-2 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronDown className={cn("w-3 h-3 transition-transform", isExpanded && "rotate-180")} />
                        {isExpanded ? "Hide details" : "Show full context & scoring breakdown"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div className="px-4 pb-4 ml-7 border-t border-border mt-1 pt-3 space-y-4">
                      {/* Related Metrics */}
                      {rec.relatedMetrics.length > 0 && (
                        <div>
                          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                            Related Measurements
                          </p>
                          <div className="space-y-1.5">
                            {rec.relatedMetrics.map((m, i) => (
                              <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-secondary/30 text-xs">
                                <span className="font-medium flex-1">{m.name}</span>
                                <span className="font-mono text-chart-5">{m.currentValue}</span>
                                <ArrowRight className="w-3 h-3 text-muted-foreground/40" />
                                <span className="font-mono text-chart-2">{m.idealRange}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Current Deviation */}
                      {rec.currentDeviation && (
                        <div>
                          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                            Current Deviation
                          </p>
                          <p className="text-xs text-foreground">{rec.currentDeviation}</p>
                        </div>
                      )}

                      {/* Score Impact Breakdown */}
                      <div className="p-3 rounded-lg bg-chart-2/5 border border-chart-2/10">
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                          Score Impact
                        </p>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-mono">{report.overallScore}</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden relative">
                            <div
                              className="absolute h-full bg-foreground/30 rounded-full"
                              style={{ width: `${report.overallScore}%` }}
                            />
                            <div
                              className="absolute h-full bg-chart-2 rounded-full"
                              style={{ width: `${Math.min(report.overallScore + rec.expectedImpact, 100)}%` }}
                            />
                          </div>
                          <span className="font-mono text-chart-2">{Math.min(rec.projectedScoreAfter, 100)}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1.5">
                          Addressing this would move your score from {report.overallScore} to approximately {Math.min(rec.projectedScoreAfter, 100)} (+{rec.expectedImpact} points). 
                          This represents the mathematical impact of bringing the related measurement(s) within the ideal range.
                        </p>
                      </div>

                      {/* Action Steps */}
                      <div>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                          Action Steps
                        </p>
                        <ol className="space-y-2">
                          {rec.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-xs font-medium">{step.action}</p>
                                {step.detail && (
                                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{step.detail}</p>
                                )}
                                {step.productTypes && step.productTypes.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {step.productTypes.map((p, j) => (
                                      <Badge key={j} variant="secondary" className="text-[9px]">{p}</Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Honest Limitation */}
                      {rec.limitation && (
                        <div className="p-3 rounded-lg bg-chart-1/5 border border-chart-1/20">
                          <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                            <span><strong>Limitation:</strong> {rec.limitation}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="timeline" className="mt-4 space-y-6">
          {Object.entries(byTimeline).map(([period, recs]) => (
            <div key={period}>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground" />
                {period}
                {recs.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({recs.length} actions, +{recs.reduce((s, r) => s + r.expectedImpact, 0)} pts)
                  </span>
                )}
              </h3>
              {recs.length > 0 ? (
                <div className="ml-4 border-l border-border pl-4 space-y-3">
                  {recs.map((r) => (
                    <div key={r.id} className="text-xs">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium">{r.title}</span>
                        <Badge className={cn("text-[9px] font-mono border", difficultyConfig[r.difficulty].color)}>
                          +{r.expectedImpact} pts
                        </Badge>
                      </div>
                      {r.rationale && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{r.rationale}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="ml-4 border-l border-border pl-4 text-xs text-muted-foreground/50">No actions in this period.</p>
              )}
            </div>
          ))}

          {/* Cumulative projection */}
          <Card>
            <CardContent className="py-3">
              <p className="text-xs text-muted-foreground mb-2">Cumulative projected score over time:</p>
              <div className="flex items-center gap-3">
                {Object.entries(byTimeline).reduce((acc, [period, recs], i) => {
                  const prevScore = i === 0 ? report.overallScore : acc[i - 1].score
                  const periodGain = recs.reduce((s, r) => s + r.expectedImpact, 0)
                  const newScore = Math.min(prevScore + periodGain, 100)
                  acc.push({ period, score: newScore })
                  return acc
                }, [] as Array<{ period: string; score: number }>).map((entry, i) => (
                  <div key={entry.period} className="flex items-center gap-2">
                    {i > 0 && <ArrowRight className="w-3 h-3 text-muted-foreground/30" />}
                    <div className="text-center">
                      <p className="text-lg font-mono font-medium">{entry.score}</p>
                      <p className="text-[9px] text-muted-foreground">{entry.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Export Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => window.print()}>
              <Printer className="w-3.5 h-3.5 mr-1.5" /> Print
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={copySummary}>
              <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Full Summary
            </Button>
            <Button variant="outline" size="sm" className="text-xs" disabled>
              <Mail className="w-3.5 h-3.5 mr-1.5" /> Email Plan
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/50 mt-2 font-mono">
            {activeRecs.length} of {report.recommendations.length} recommendations selected. 
            Projected total: +{totalImpact} points (from {report.overallScore} to {projectedScore}).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
