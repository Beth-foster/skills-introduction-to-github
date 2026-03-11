"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface InfoHoverProps {
  term: string
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  className?: string
  inline?: boolean
}

/** Reusable info icon + tooltip for explaining metrics, sections, and scoring. */
export function InfoHover({ term, children, side = "top", className, inline }: InfoHoverProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {inline ? (
            <span className={cn("inline-flex items-center gap-1 cursor-help border-b border-dotted border-muted-foreground/40", className)}>
              {term}
              <HelpCircle className="w-3 h-3 text-muted-foreground/50" />
            </span>
          ) : (
            <button type="button" className={cn("inline-flex items-center gap-1 cursor-help", className)}>
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-[320px] p-4 text-sm leading-relaxed">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/** Score tier legend component for explaining what score ranges mean. */
export function ScoreTierLegend({ className }: { className?: string }) {
  const tiers = [
    { range: "85-100", label: "Exceptional", desc: "Top 5%. Rare proportional consistency across all categories.", color: "bg-chart-2" },
    { range: "78-84", label: "Strong", desc: "Top 15%. Most areas within tolerance with minor deviations.", color: "bg-chart-2/60" },
    { range: "65-77", label: "Average", desc: "Where most faces score. Proportionally consistent with measurable deviations in several areas.", color: "bg-chart-4" },
    { range: "50-64", label: "Below Average", desc: "Multiple areas outside optimal bands. Significant room for improvement.", color: "bg-chart-5/60" },
    { range: "< 50", label: "Significant Deviation", desc: "Rare. Major structural imbalances across most categories.", color: "bg-chart-5" },
  ]

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium text-muted-foreground mb-2">Score Tiers</p>
      {tiers.map((t) => (
        <div key={t.range} className="flex items-start gap-2.5">
          <div className={cn("w-2.5 h-2.5 rounded-full mt-1 shrink-0", t.color)} />
          <div>
            <span className="text-xs font-mono font-medium">{t.range}</span>
            <span className="text-xs text-muted-foreground ml-1.5">{t.label}</span>
            <p className="text-[11px] text-muted-foreground/70 leading-snug">{t.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Assessment badge legend for tolerance-band explanations. */
export function AssessmentLegend({ className }: { className?: string }) {
  const bands = [
    { label: "Within Tolerance", desc: "Value falls within the ideal proportional range (0-3% deviation). No correction needed.", color: "text-chart-2" },
    { label: "Slight Deviation", desc: "3-5% outside ideal range. Noticeable only under measurement. Minimal visual impact.", color: "text-chart-4" },
    { label: "Moderate Deviation", desc: "5-8% outside ideal. May affect perceived harmony. Targeted intervention can help.", color: "text-chart-5/70" },
    { label: "Notable Deviation", desc: "8%+ outside ideal. Visually perceptible. Primary area for improvement if desired.", color: "text-chart-5" },
  ]

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium text-muted-foreground mb-2">Tolerance Bands</p>
      {bands.map((b) => (
        <div key={b.label} className="flex items-start gap-2.5">
          <span className={cn("text-xs font-medium whitespace-nowrap w-28 shrink-0", b.color)}>{b.label}</span>
          <p className="text-[11px] text-muted-foreground/70 leading-snug">{b.desc}</p>
        </div>
      ))}
    </div>
  )
}
