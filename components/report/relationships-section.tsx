"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import type { ReportData, RelationshipItem } from "@/lib/report-types"
import { cn } from "@/lib/utils"

export function ReportRelationships({ report }: { report: ReportData }) {
  const [selected, setSelected] = useState<RelationshipItem | null>(null)

  const isWithin = (r: RelationshipItem) => r.yourRatio >= r.idealMin && r.yourRatio <= r.idealMax

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl">Feature Relationships</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        How feature pairs interact to create perceived harmony. Click any relationship to view the full analysis, tolerance band, and available intervention levers.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {report.relationships.map((rel) => {
          const within = isWithin(rel)
          return (
            <Card
              key={rel.pair}
              className={cn("cursor-pointer transition-colors hover:border-foreground/30", !within && "border-chart-5/30")}
              onClick={() => setSelected(rel)}
            >
              <CardContent className="pt-4 pb-3 px-4">
                <p className="text-xs font-medium mb-2">{rel.pair}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-lg">{rel.yourRatio.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">
                    ideal: {rel.idealMin.toFixed(2)}-{rel.idealMax.toFixed(2)}
                  </span>
                </div>
                <Badge variant={within ? "secondary" : "destructive"} className="text-[10px]">
                  {within ? "Within Tolerance" : "Measurable Deviation"}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg">{selected.pair}</SheetTitle>
                <SheetDescription>Feature relationship analysis</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                {/* Ratio display */}
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-3xl">{selected.yourRatio.toFixed(2)}</span>
                  <div className="text-xs text-muted-foreground">
                    <p>Ideal: {selected.idealMin.toFixed(2)} - {selected.idealMax.toFixed(2)}</p>
                    <Badge variant={isWithin(selected) ? "secondary" : "destructive"} className="mt-1 text-[10px]">
                      {isWithin(selected) ? "Within Tolerance Band" : "Outside Tolerance Band"}
                    </Badge>
                  </div>
                </div>

                {/* Impact */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Impact</h4>
                  <p className="text-sm leading-relaxed">{selected.impact}</p>
                </div>

                {/* Explanation */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Analysis</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{selected.explanation}</p>
                </div>

                {/* Levers */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Improvement Levers</h4>
                  <ul className="space-y-1.5">
                    {selected.levers.map((lever, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-mono">{i + 1}</span>
                        </span>
                        {lever}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
