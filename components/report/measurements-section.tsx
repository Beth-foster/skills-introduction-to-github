"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronDown, Plus } from "lucide-react"
import type { ReportData, ReportMetric } from "@/lib/report-types"
import { cn } from "@/lib/utils"
import { InfoHover, AssessmentLegend } from "./info-hover"

export function ReportMeasurements({ report, onAddToBlueprint }: { report: ReportData; onAddToBlueprint?: (id: string) => void }) {
  const [search, setSearch] = useState("")
  const [impactFilter, setImpactFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("deviation")
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    let items = [...report.metrics]

    if (search) {
      const q = search.toLowerCase()
      items = items.filter((m) => m.name.toLowerCase().includes(q) || m.explanation.toLowerCase().includes(q))
    }

    if (impactFilter !== "all") {
      items = items.filter((m) => m.impactWeight === impactFilter)
    }

    if (sortBy === "deviation") {
      items.sort((a, b) => Math.abs(b.deviationPct) - Math.abs(a.deviationPct))
    } else if (sortBy === "name") {
      items.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "impact") {
      const order = { High: 3, Medium: 2, Low: 1 }
      items.sort((a, b) => order[b.impactWeight] - order[a.impactWeight])
    }

    return items
  }, [report.metrics, search, impactFilter, sortBy])

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const isWithin = (m: ReportMetric) => m.yourValue >= m.idealMin && m.yourValue <= m.idealMax

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="font-serif text-2xl">Measurements Library</h2>
        <InfoHover term="Measurements Library">
          <p className="font-medium mb-1">How to use this section</p>
          <p className="text-muted-foreground text-xs leading-relaxed mb-2">
            This is the complete database of every individual measurement taken during your analysis. 
            Each measurement shows your value, the ideal range, and the deviation percentage. 
            Click any measurement to expand it and see a full explanation of what it means and how it 
            relates to your face.
          </p>
          <p className="font-medium mb-1 text-xs">Key columns</p>
          <p className="text-[11px] text-muted-foreground"><strong>Impact Weight</strong> — How much this measurement affects your overall score (High, Medium, Low)</p>
          <p className="text-[11px] text-muted-foreground"><strong>Changeability</strong> — Whether this can be changed through grooming, lifestyle, or procedures</p>
          <p className="text-[11px] text-muted-foreground"><strong>Levers</strong> — Specific actions that could influence this measurement</p>
          <div className="mt-3 pt-3 border-t border-border">
            <AssessmentLegend />
          </div>
        </InfoHover>
      </div>
      <p className="text-sm text-muted-foreground">{report.metrics.length} individual measurements. Search, filter, and expand for detail.</p>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search measurements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={impactFilter} onValueChange={setImpactFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue placeholder="Impact" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Impact</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deviation">By Deviation</SelectItem>
            <SelectItem value="name">By Name</SelectItem>
            <SelectItem value="impact">By Impact</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metrics List */}
      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {filtered.map((m) => {
            const open = expanded.has(m.id)
            const within = isWithin(m)
            return (
              <div key={m.id}>
                <button
                  onClick={() => toggle(m.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                >
                  <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0", open && "rotate-180")} />
                  <span className="flex-1 text-sm font-medium">{m.name}</span>
                  <span className="font-mono text-sm">{m.yourValue}{m.unit === "%" || m.unit === "degrees" || m.unit === "score" ? "" : m.unit === "ratio" ? "" : m.unit === "mm" ? "mm" : ""}</span>
                  {!within && (
                    <Badge variant="destructive" className="text-[10px] font-mono">
                      {m.deviationPct > 0 ? "+" : ""}{m.deviationPct}%
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">
                    {m.impactWeight}
                  </Badge>
                </button>
                {open && (
                  <div className="px-4 pb-4 pt-1 ml-7 space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block">Your Value</span>
                        <span className="font-mono font-medium">{m.yourValue} {m.unit}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Ideal Range</span>
                        <span className="font-mono font-medium">{m.idealMin} - {m.idealMax} {m.unit}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Deviation</span>
                        <span className={cn("font-mono font-medium", within ? "text-chart-2" : "text-chart-5")}>
                          {m.deviationPct === 0 ? "None" : `${m.deviationPct > 0 ? "+" : ""}${m.deviationPct}%`}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Impact Weight:</span>{" "}
                        <span className="font-medium">{m.impactWeight}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Changeability:</span>{" "}
                        <span className="font-medium">{m.changeability}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{m.explanation}</p>
                    {m.levers.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono text-muted-foreground/60 uppercase">Levers</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {m.levers.map((l, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">{l}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {onAddToBlueprint && !within && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={(e) => { e.stopPropagation(); onAddToBlueprint(m.id) }}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Save to Blueprint
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No measurements match your filters.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
