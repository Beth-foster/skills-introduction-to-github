"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scissors, Palette, Eye, Bed, Apple, Dumbbell, Sparkles, ChevronDown, AlertTriangle, ShoppingBag, Clock } from "lucide-react"
import type { ReportData, CosmeticRecommendations } from "@/lib/report-types"
import { InfoHover } from "./info-hover"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "hair", label: "Hair Styling", icon: Scissors, summary: "Styles that complement your facial proportions and create visual harmony with your bone structure." },
  { id: "grooming", label: "Grooming", icon: Sparkles, summary: "Facial hair, contouring, and grooming techniques to enhance or soften structural features." },
  { id: "brows", label: "Eyebrows", icon: Eye, summary: "Brow shaping interacts directly with your forehead-to-eye ratio and upper third proportions." },
  { id: "colour", label: "Colour Analysis", icon: Palette, summary: "Colours that work with your skin undertone and feature contrast to enhance your natural colouring." },
  { id: "lifestyle", label: "Lifestyle", icon: Dumbbell, summary: "Daily habits that directly affect facial appearance — from hydration to posture to exercise." },
  { id: "sleep", label: "Sleep & Recovery", icon: Bed, summary: "Sleep quality has a measurable effect on under-eye puffiness, skin clarity, and facial volume distribution." },
  { id: "nutrition", label: "Nutrition", icon: Apple, summary: "Specific nutrients that support skin health, collagen production, and overall facial vitality." },
] as const

type TabId = typeof tabs[number]["id"]

export function ReportCosmetic({ report }: { report: ReportData }) {
  const [activeTab, setActiveTab] = useState<TabId>("hair")
  const cos = report.cosmeticRecommendations

  if (!cos) return null

  const currentTab = tabs.find(t => t.id === activeTab)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="font-serif text-2xl">Cosmetic & Lifestyle</h2>
        <InfoHover term="Cosmetic">
          <p className="font-medium mb-1">How to use this section</p>
          <p className="text-muted-foreground text-xs leading-relaxed mb-2">
            These recommendations sit alongside your structural analysis. While proportional metrics 
            measure objective geometry, cosmetic choices affect how those proportions are <strong>perceived</strong>.
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            The right hairstyle can visually widen a narrow forehead. The right beard shape can define 
            a rounded jaw. Colour choices affect perceived skin clarity and feature contrast. Think of 
            this section as the &quot;presentation layer&quot; on top of your structural data.
          </p>
        </InfoHover>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Appearance-based recommendations tailored to your structural profile. Each suggestion is 
        tied back to specific measurements from your analysis — this is not generic advice.
      </p>

      {/* Tab Nav */}
      <div className="flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              activeTab === t.id
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon className="w-3 h-3" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Summary */}
      {currentTab && (
        <div className="p-3 rounded-lg bg-secondary/50 border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">{currentTab.summary}</p>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "hair" && <HairSection data={cos.hairStyling} />}
        {activeTab === "grooming" && <GroomingSection data={cos.facialHairOrMakeup} />}
        {activeTab === "brows" && <BrowSection data={cos.eyebrowOptimisation} />}
        {activeTab === "colour" && <ColourSection data={cos.colourAnalysis} />}
        {activeTab === "lifestyle" && <LifestyleSection data={cos.lifestyleHabits} />}
        {activeTab === "sleep" && <SleepSection data={cos.sleepAndRecovery} />}
        {activeTab === "nutrition" && <NutritionSection data={cos.nutrition} />}
      </div>
    </div>
  )
}

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="py-5 space-y-4">{children}</CardContent>
    </Card>
  )
}

function HairSection({ data }: { data: CosmeticRecommendations["hairStyling"] }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <SectionCard key={i}>
          <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full text-left space-y-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium">{item.recommendation}</p>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", expanded === i && "rotate-180")} />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.rationale}</p>
          </button>

          {expanded === i && (
            <div className="space-y-4 pt-3 border-t border-border">
              {/* Recommended styles */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1.5">
                  <Scissors className="w-3 h-3" /> Recommended Styles
                </p>
                <div className="space-y-2">
                  {item.specificStyles.map((s, j) => (
                    <div key={j} className="p-2.5 rounded-lg bg-secondary/50">
                      <p className="text-xs leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Styles to avoid */}
              {item.avoidStyles.length > 0 && (
                <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/15">
                  <p className="text-[10px] font-medium text-destructive mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Styles to Avoid
                  </p>
                  <ul className="space-y-1.5">
                    {item.avoidStyles.map((s, j) => (
                      <li key={j} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                        <span className="text-destructive/50 shrink-0">--</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Products */}
              {item.productTypes.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3" /> Product Types
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.productTypes.map((p, j) => (
                      <Badge key={j} variant="outline" className="text-[10px] font-mono">{p}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SectionCard>
      ))}
    </div>
  )
}

function GroomingSection({ data }: { data: CosmeticRecommendations["facialHairOrMakeup"] }) {
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <SectionCard key={i}>
          <p className="text-sm font-medium">{item.recommendation}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{item.rationale}</p>

          <div>
            <p className="text-xs font-medium mb-2">Step-by-step techniques</p>
            <ol className="space-y-2">
              {item.techniques.map((t, j) => (
                <li key={j} className="flex items-start gap-2.5 text-xs">
                  <span className="font-mono text-muted-foreground/50 shrink-0 w-5 text-right">{j + 1}.</span>
                  <span className="text-muted-foreground leading-relaxed">{t}</span>
                </li>
              ))}
            </ol>
          </div>

          {item.productTypes.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                <ShoppingBag className="w-3 h-3" /> Products to look for
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.productTypes.map((p, j) => (
                  <Badge key={j} variant="outline" className="text-[10px] font-mono">{p}</Badge>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      ))}
    </div>
  )
}

function BrowSection({ data }: { data: CosmeticRecommendations["eyebrowOptimisation"] }) {
  return (
    <SectionCard>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-secondary/50">
          <p className="text-[10px] font-mono text-muted-foreground mb-1">Current Assessment</p>
          <p className="text-sm leading-relaxed">{data.currentAssessment}</p>
        </div>
        <div className="p-3 rounded-lg bg-chart-2/5 border border-chart-2/15">
          <p className="text-[10px] font-mono text-chart-2 mb-1">Target Shape</p>
          <p className="text-sm leading-relaxed">{data.idealShape}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium mb-2">Grooming Steps</p>
        <ol className="space-y-2.5">
          {data.groomingSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="font-mono text-xs text-foreground bg-secondary w-5 h-5 rounded-full flex items-center justify-center shrink-0">{i + 1}</span>
              <span className="text-xs text-muted-foreground leading-relaxed pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="p-3 rounded-lg bg-secondary/50 border-t border-border">
        <p className="text-[10px] font-mono text-muted-foreground mb-1">Why this matters for your face</p>
        <p className="text-xs text-foreground leading-relaxed">{data.rationale}</p>
      </div>
    </SectionCard>
  )
}

function ColourSection({ data }: { data: CosmeticRecommendations["colourAnalysis"] }) {
  return (
    <SectionCard>
      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-secondary/50">
          <p className="text-[10px] font-mono text-muted-foreground mb-1">Skin Undertone</p>
          <p className="text-sm font-medium">{data.undertone}</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/50">
          <p className="text-[10px] font-mono text-muted-foreground mb-1">Feature Contrast Level</p>
          <p className="text-sm font-medium">{data.contrastLevel}</p>
        </div>
      </div>

      {/* Best colours */}
      <div>
        <p className="text-xs font-medium mb-2">Colours that complement your features</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          These colours work with your natural undertone and contrast level to enhance perceived skin quality and feature definition.
        </p>
        <div className="flex flex-wrap gap-2">
          {data.bestColours.map((c, i) => (
            <Badge key={i} variant="secondary" className="text-xs px-3 py-1">{c}</Badge>
          ))}
        </div>
      </div>

      {/* Colours to avoid */}
      <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/15">
        <p className="text-[10px] font-medium text-destructive mb-2 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Colours to Minimise
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          These colours can wash out your skin tone, reduce perceived contrast, or create unflattering interactions with your undertone.
        </p>
        <div className="flex flex-wrap gap-2">
          {data.avoidColours.map((c, i) => (
            <Badge key={i} variant="outline" className="text-xs border-destructive/20">{c}</Badge>
          ))}
        </div>
      </div>

      {/* Rationale */}
      <p className="text-xs text-muted-foreground leading-relaxed">{data.rationale}</p>
    </SectionCard>
  )
}

function LifestyleSection({ data }: { data: CosmeticRecommendations["lifestyleHabits"] }) {
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <SectionCard key={i}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{item.habit}</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.explanation}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Badge variant="secondary" className="text-[10px] font-mono flex items-center gap-1">
              <Dumbbell className="w-2.5 h-2.5" /> {item.impactArea}
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> {item.frequency}
            </Badge>
          </div>
        </SectionCard>
      ))}
    </div>
  )
}

function SleepSection({ data }: { data: CosmeticRecommendations["sleepAndRecovery"] }) {
  return (
    <SectionCard>
      {/* Impact summary */}
      <div className="p-3 rounded-lg bg-secondary/50">
        <p className="text-[10px] font-mono text-muted-foreground mb-1">How Sleep Affects Your Face</p>
        <p className="text-xs text-foreground leading-relaxed">{data.impactOnFace}</p>
      </div>

      {/* Recommendations */}
      <div>
        <p className="text-xs font-medium mb-3">Actionable Recommendations</p>
        <ol className="space-y-3">
          {data.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="font-mono text-xs text-foreground bg-secondary w-5 h-5 rounded-full flex items-center justify-center shrink-0">{i + 1}</span>
              <span className="text-xs text-muted-foreground leading-relaxed pt-0.5">{rec}</span>
            </li>
          ))}
        </ol>
      </div>
    </SectionCard>
  )
}

function NutritionSection({ data }: { data: CosmeticRecommendations["nutrition"] }) {
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <SectionCard key={i}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium">{item.recommendation}</p>
            <Badge variant="secondary" className="text-[10px] font-mono shrink-0">{item.targetArea}</Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{item.rationale}</p>
          
          <div>
            <p className="text-[10px] font-medium text-muted-foreground mb-1.5">Include these foods</p>
            <div className="flex flex-wrap gap-1.5">
              {item.foods.map((f, j) => (
                <Badge key={j} variant="outline" className="text-[10px]">{f}</Badge>
              ))}
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  )
}
