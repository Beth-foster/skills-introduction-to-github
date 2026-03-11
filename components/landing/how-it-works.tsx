"use client"

import { useState } from "react"
import { Camera, Brain, Sparkles, Lock, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Upload 4-8 Photos",
    subtitle: "Different angles for 3D accuracy",
    description: "Upload photos from multiple angles — front, three-quarter, and side views with varied expressions. Our system cross-references all images for the most accurate three-dimensional structural assessment.",
    details: [
      "Front-facing neutral expression",
      "45-degree angle (both sides)",
      "Side profile view",
      "Smiling expression",
      "Natural lighting preferred"
    ],
    timing: "2 minutes",
    visual: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {["Front", "3/4 Left", "3/4 Right", "Side"].map((angle) => (
            <div 
              key={angle} 
              className="aspect-square rounded-lg border border-foreground/30 bg-foreground/5 flex items-center justify-center"
            >
              <div className="text-center">
                <Check className="w-4 h-4 text-foreground/60 mx-auto mb-1" />
                <span className="text-[10px] text-muted-foreground">{angle}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground text-center">4 minimum required, 8 for best accuracy</p>
      </div>
    )
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Structural Analysis",
    subtitle: "78+ measurements in ~60 seconds",
    description: "Our AI analyses facial thirds, fifths, symmetry, feature relationships, and skin metrics using anthropometric frameworks. Zero temperature variance ensures identical photos produce identical results.",
    details: [
      "Vertical thirds distribution",
      "Horizontal fifths balance",
      "Bilateral symmetry mapping",
      "Feature relationship scoring",
      "Skin texture & clarity assessment"
    ],
    timing: "2-3 mins",
    visual: (
      <div className="space-y-2">
        {["Structure", "Symmetry", "Features", "Skin"].map((cat, i) => (
          <div key={cat} className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground w-16">{cat}</span>
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-foreground/70 rounded-full transition-all duration-1000"
                style={{ width: `${65 + i * 8}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground w-8">{65 + i * 8}%</span>
          </div>
        ))}
      </div>
    )
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Instant Quick Wins Preview",
    subtitle: "Free structural snapshot",
    description: "Immediately see your harmony score, key deviations, and 3 highest-impact quick wins. This preview shows you what to focus on — no payment required to understand your starting point.",
    details: [
      "Overall harmony score",
      "Top 3 deviation areas",
      "3 actionable quick wins",
      "Structural balance indices",
      "Expression archetype"
    ],
    timing: "Instant",
    visual: (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Harmony Score</span>
          <span className="text-sm font-mono font-medium">74/100</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full w-[74%] bg-gradient-to-r from-foreground/50 to-foreground rounded-full" />
        </div>
        <div className="flex gap-1 mt-2">
          {["Quick Win 1", "Quick Win 2", "Quick Win 3"].map((_, i) => (
            <div key={i} className="flex-1 h-6 rounded bg-foreground/10 flex items-center justify-center">
              <span className="text-[9px] text-muted-foreground">+{2 + i} pts</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    number: "04",
    icon: Lock,
    title: "Unlock Full Report",
    subtitle: "Complete interactive dashboard",
    description: "Unlock the full interactive report with all 78+ measurements, searchable metrics library, harmony simulator, cosmetic recommendations, skincare deep-dive, and personalised blueprint builder.",
    details: [
      "Complete measurements library",
      "Interactive harmony simulator",
      "Hair, grooming & colour analysis",
      "AM/PM skincare routines",
      "Transformation blueprint"
    ],
    timing: "One-time purchase",
    visual: (
      <div className="grid grid-cols-3 gap-1">
        {["Overview", "Structure", "Skin", "Expression", "Cosmetic", "Blueprint"].map((section) => (
          <div key={section} className="px-2 py-1.5 rounded bg-foreground/10 text-center">
            <span className="text-[9px] text-muted-foreground">{section}</span>
          </div>
        ))}
      </div>
    )
  }
]

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="how-it-works" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            From photo upload to personalised recommendations in under 2 minutes.
          </p>
        </div>

        {/* Desktop: Interactive timeline */}
        <div className="hidden lg:block">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />
            <div 
              className="absolute top-1/2 left-0 h-px bg-foreground -translate-y-1/2 transition-all duration-500"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((step, index) => (
              <button
                key={step.number}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  index <= activeStep 
                    ? "bg-foreground border-foreground text-background" 
                    : "bg-background border-border text-muted-foreground hover:border-foreground/50"
                )}
              >
                <step.icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          {/* Active step content */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-mono text-muted-foreground">{steps[activeStep].number}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10 text-muted-foreground">
                  {steps[activeStep].timing}
                </span>
              </div>
              <h3 className="font-serif text-3xl mb-2">{steps[activeStep].title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{steps[activeStep].subtitle}</p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {steps[activeStep].description}
              </p>
              <ul className="space-y-2 mb-8">
                {steps[activeStep].details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-foreground/60" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              {activeStep < steps.length - 1 ? (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
                >
                  Next: {steps[activeStep + 1].title}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Start Your Analysis
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Visual preview */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="aspect-video flex items-center justify-center">
                <div className="w-full max-w-xs">
                  {steps[activeStep].visual}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Stacked cards */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className={cn(
                "p-6 rounded-2xl border transition-all",
                index === activeStep ? "bg-card border-foreground/20" : "bg-background border-border"
              )}
              onClick={() => setActiveStep(index)}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  index <= activeStep ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                )}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{step.number}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10 text-muted-foreground">
                      {step.timing}
                    </span>
                  </div>
                  <h3 className="font-medium text-lg mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                  
                  {index === activeStep && (
                    <div className="mt-4 pt-4 border-t border-border">
                      {step.visual}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <Link
            href="/analyze"
            className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start Your Analysis
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
