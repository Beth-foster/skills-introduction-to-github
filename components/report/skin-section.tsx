"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sun, Moon, Droplets, Leaf, AlertTriangle, Clock } from "lucide-react"
import type { ReportData } from "@/lib/report-types"
import { cn } from "@/lib/utils"

export function ReportSkin({ report }: { report: ReportData }) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl">Skin Assessment</h2>
      <div className="px-3 py-2 rounded-md bg-chart-4/10 border border-chart-4/20 text-xs text-muted-foreground">
        Observational analysis only. Not diagnostic. Consult a dermatologist for clinical skin concerns.
      </div>

      <div className="space-y-4">
        {report.skinIndex.map((skin) => (
          <SkinMetricCard key={skin.category} skin={skin} />
        ))}
      </div>
    </div>
  )
}

function SkinMetricCard({ skin }: { skin: ReportData["skinIndex"][number] }) {
  const [expanded, setExpanded] = useState(false)
  const hasDeepRecs = skin.amRoutine?.length || skin.pmRoutine?.length || skin.keyIngredients?.length

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{skin.category}</CardTitle>
          <span className={cn(
            "text-lg font-mono font-medium",
            skin.score >= 80 ? "text-chart-2" : skin.score >= 70 ? "text-chart-4" : "text-chart-5"
          )}>
            {skin.score}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">{skin.explanation}</p>

        {hasDeepRecs ? (
          <Accordion type="single" collapsible value={expanded ? "deep" : ""} onValueChange={(v) => setExpanded(!!v)}>
            <AccordionItem value="deep" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="text-xs px-3 py-2 text-muted-foreground hover:text-foreground hover:no-underline bg-secondary/30">
                In-Depth Recommendations
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3 pt-0">
                <div className="space-y-4 pt-3">
                  {/* AM Routine */}
                  {skin.amRoutine && skin.amRoutine.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sun className="w-3.5 h-3.5 text-chart-4" />
                        <span className="text-xs font-medium">Morning Routine</span>
                      </div>
                      <ol className="space-y-1.5 ml-5">
                        {skin.amRoutine.map((step, i) => (
                          <li key={i} className="text-xs text-muted-foreground list-decimal">{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* PM Routine */}
                  {skin.pmRoutine && skin.pmRoutine.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Moon className="w-3.5 h-3.5 text-chart-3" />
                        <span className="text-xs font-medium">Evening Routine</span>
                      </div>
                      <ol className="space-y-1.5 ml-5">
                        {skin.pmRoutine.map((step, i) => (
                          <li key={i} className="text-xs text-muted-foreground list-decimal">{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Key Ingredients */}
                  {skin.keyIngredients && skin.keyIngredients.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Droplets className="w-3.5 h-3.5 text-chart-2" />
                        <span className="text-xs font-medium">Key Ingredients</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skin.keyIngredients.map((ing, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] font-mono">{ing}</Badge>
                        ))}
                      </div>
                      {skin.ingredientRationale && (
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{skin.ingredientRationale}</p>
                      )}
                    </div>
                  )}

                  {/* Lifestyle Factors */}
                  {skin.lifestyleFactors && skin.lifestyleFactors.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Leaf className="w-3.5 h-3.5 text-chart-2" />
                        <span className="text-xs font-medium">Lifestyle Factors</span>
                      </div>
                      <ul className="space-y-1">
                        {skin.lifestyleFactors.map((factor, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <span className="text-muted-foreground/40 shrink-0">--</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Avoid List */}
                  {skin.avoidList && skin.avoidList.length > 0 && (
                    <div className="p-2.5 rounded-md bg-chart-5/5 border border-chart-5/20">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-chart-5" />
                        <span className="text-xs font-medium text-chart-5">Avoid</span>
                      </div>
                      <ul className="space-y-1">
                        {skin.avoidList.map((item, i) => (
                          <li key={i} className="text-xs text-muted-foreground">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-border">
                    <Clock className="w-3 h-3 text-muted-foreground/50" />
                    <span className="text-[10px] text-muted-foreground/60 font-mono">{skin.timeToResult}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <div className="text-[10px] text-muted-foreground/50 font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Expected results: {skin.timeToResult}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
