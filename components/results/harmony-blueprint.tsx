"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, ArrowUpRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FacialAnalysis } from "@/lib/analysis-types"

interface HarmonyBlueprintProps {
  blueprint: FacialAnalysis["harmonyBlueprint"]
}

type Tab = "low" | "moderate" | "long"

export function HarmonyBlueprint({ blueprint }: HarmonyBlueprintProps) {
  const [activeTab, setActiveTab] = useState<Tab>("low")

  if (!blueprint) return null

  const tabs: { id: Tab; label: string; description: string }[] = [
    { id: "low", label: "Quick Returns", description: "Low effort, high impact" },
    { id: "moderate", label: "Moderate", description: "Medium effort adjustments" },
    { id: "long", label: "Long-Term", description: "Structural changes" },
  ]

  const items = activeTab === "low" 
    ? blueprint.lowEffortHighReturn 
    : activeTab === "moderate" 
    ? blueprint.moderateAdjustment 
    : blueprint.longTermStructural

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-serif text-xl flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Harmony Upgrade Blueprint
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your personalised roadmap to enhanced facial harmony, organised by effort level.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 p-3 rounded-lg text-left transition-colors",
                activeTab === tab.id
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <p className="text-xs font-medium">{tab.label}</p>
              <p className="text-xs opacity-70">{tab.description}</p>
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center mt-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">{item.action}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="text-chart-2 font-medium">{item.estimatedGain}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timeline}
                    </span>
                    <span className="capitalize">{item.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
