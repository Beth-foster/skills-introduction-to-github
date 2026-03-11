"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Sparkles, Droplets, Scissors, AlertTriangle, Heart, Clock, ChevronDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FacialAnalysis } from "@/lib/analysis-types"

interface RecommendationsSectionProps {
  recommendations: FacialAnalysis["recommendations"]
  optimizations: FacialAnalysis["optimizationOpportunities"]
  isPaid: boolean
}

const priorityColors = {
  high: "bg-chart-5/10 text-chart-5 border-chart-5/30",
  medium: "bg-chart-1/10 text-chart-1 border-chart-1/30",
  low: "bg-secondary text-muted-foreground border-border"
}

const categoryIcons = {
  grooming: Scissors,
  skincare: Droplets,
  hair: Sparkles,
  lifestyle: Heart,
  presentation: Sparkles,
  optional_aesthetic: AlertTriangle
}

export function RecommendationsSection({ 
  recommendations, 
  optimizations, 
  isPaid 
}: RecommendationsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("grooming")
  const [expandedOpt, setExpandedOpt] = useState<number | null>(null)

  const tabs = [
    { id: "grooming", label: "Grooming", icon: Scissors },
    { id: "skincare", label: "Skincare", icon: Droplets },
    { id: "hair", label: "Hair", icon: Sparkles },
    { id: "lifestyle", label: "Lifestyle", icon: Heart },
    { id: "optional_aesthetic", label: "Optional", icon: AlertTriangle },
  ]

  return (
    <div className="space-y-6">
      {/* Measurable Deviation Areas */}
      <Card className={cn("border-border relative", !isPaid && "overflow-hidden")}>
        {!isPaid && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center p-4">
              <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground font-medium">
                Unlock for deviation analysis
              </p>
            </div>
          </div>
        )}
        
        <CardHeader>
          <CardTitle className="text-lg">Measurable Deviation Areas</CardTitle>
          <p className="text-xs text-muted-foreground">
            Ranked by projected impact on proportional harmony score.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {optimizations?.slice(0, 6).map((opt, index) => {
            const Icon = categoryIcons[opt.category] || Sparkles
            const isExpanded = expandedOpt === index
            
            return (
              <div 
                key={index} 
                className="border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedOpt(isExpanded ? null : index)}
                  className="w-full p-4 flex items-start gap-3 text-left hover:bg-secondary/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{opt.area}</span>
                      {opt.priority && (
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full border flex-shrink-0 font-mono",
                          priorityColors[opt.priority]
                        )}>
                          {opt.priority}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground font-mono line-clamp-1 flex-1">
                        {opt.currentDeviation}
                      </p>
                      {opt.projectedHarmonyGain && (
                        <span className="text-xs text-foreground font-mono flex-shrink-0 flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" />
                          {opt.projectedHarmonyGain}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform flex-shrink-0",
                    isExpanded && "rotate-180"
                  )} />
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border">
                    <div className="pt-3 space-y-3">
                      {opt.structuralConsequence && (
                        <div>
                          <p className="text-xs font-mono text-muted-foreground mb-1">Structural Consequence</p>
                          <p className="text-sm">{opt.structuralConsequence}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-mono text-muted-foreground mb-1">Analysis</p>
                        <p className="text-sm">{opt.explanation}</p>
                      </div>
                      {opt.limitation && (
                        <div className="p-2 rounded bg-chart-1/5 border border-chart-1/20">
                          <p className="text-xs text-muted-foreground flex items-start gap-1">
                            <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            {opt.limitation}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-4 pt-2">
                        {opt.difficulty && (
                          <span className="text-xs text-muted-foreground font-mono capitalize">{opt.difficulty}</span>
                        )}
                        {opt.estimatedTimeline && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {opt.estimatedTimeline}
                          </span>
                        )}
                        {opt.projectedHarmonyGain && (
                          <span className="flex items-center gap-1 text-xs font-mono">
                            <TrendingUp className="w-3 h-3" />
                            {opt.projectedHarmonyGain}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Detailed Recommendations */}
      <Card className={cn("border-border relative", !isPaid && "overflow-hidden")}>
        {!isPaid && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center p-4">
              <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground font-medium">
                Unlock for detailed recommendations
              </p>
            </div>
          </div>
        )}
        
        <CardHeader>
          <CardTitle className="text-lg">Intervention Recommendations</CardTitle>
          <p className="text-xs text-muted-foreground">
            Specific actions tied to proportional analysis findings.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "optional_aesthetic" && (
            <div className="p-3 bg-chart-1/10 border border-chart-1/30 rounded-lg mb-4">
              <p className="text-xs text-chart-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Informational only. Professional consultation required before any procedure.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {activeTab === "grooming" && recommendations?.grooming?.map((rec, i) => (
              <RecommendationItem key={i} rec={rec} />
            ))}
            {activeTab === "skincare" && recommendations?.skincare?.map((rec, i) => (
              <RecommendationItem key={i} rec={rec} />
            ))}
            {activeTab === "hair" && recommendations?.hair?.map((rec, i) => (
              <RecommendationItem key={i} rec={rec} />
            ))}
            {activeTab === "lifestyle" && recommendations?.lifestyle?.map((rec, i) => (
              <RecommendationItem key={i} rec={rec} />
            ))}
            {activeTab === "optional_aesthetic" && recommendations?.optionalAesthetic?.map((rec, i) => (
              <AestheticItem key={i} rec={rec} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RecommendationItem({ rec }: { rec: { recommendation: string; rationale: string; timeline: string; products?: string[]; ingredients?: string[]; stylingTips?: string[]; frequency?: string } }) {
  return (
    <div className="p-3 bg-secondary/30 rounded-lg border border-border">
      <p className="text-sm font-medium mb-1">{rec.recommendation}</p>
      <p className="text-xs text-muted-foreground mb-2">{rec.rationale}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3" />
          {rec.timeline}
        </span>
        {rec.frequency && <span className="font-mono">{rec.frequency}</span>}
      </div>
      {(rec.products?.length || rec.ingredients?.length || rec.stylingTips?.length) && (
        <div className="mt-2 pt-2 border-t border-border">
          <div className="flex flex-wrap gap-1">
            {rec.products?.map((p, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-secondary rounded font-mono">{p}</span>
            ))}
            {rec.ingredients?.map((ing, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-secondary rounded font-mono">{ing}</span>
            ))}
            {rec.stylingTips?.map((tip, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-secondary rounded">{tip}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AestheticItem({ rec }: { rec: { procedure: string; whatItAddresses: string; considerations: string; recoveryTime: string; permanence: string } }) {
  return (
    <div className="p-3 bg-secondary/30 rounded-lg border border-border">
      <p className="text-sm font-medium mb-1">{rec.procedure}</p>
      <p className="text-xs text-muted-foreground mb-2">{rec.whatItAddresses}</p>
      <p className="text-xs mb-2"><span className="font-medium">Considerations:</span> {rec.considerations}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
        {rec.recoveryTime && (
          <span>Recovery: {rec.recoveryTime}</span>
        )}
        <span className={cn(
          "px-2 py-0.5 rounded capitalize",
          rec.permanence === "permanent" ? "bg-chart-5/10 text-chart-5" : "bg-secondary"
        )}>
          {rec.permanence}
        </span>
      </div>
    </div>
  )
}
