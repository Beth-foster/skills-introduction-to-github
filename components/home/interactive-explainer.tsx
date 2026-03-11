"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScanFace, Sparkles, ShieldCheck, Wand2, Layers3, ChevronRight } from "lucide-react"
import Link from "next/link"

const ITEMS = [
  {
    id: "symmetry",
    label: "Symmetry & Balance",
    short: "How facial proportions visually relate.",
    icon: Layers3,
    stat: "Facial Harmony",
    detail:
      "We analyse how your facial thirds (forehead, midface, lower face) and fifths (horizontal segments) distribute across your face. Small variations from ideal ratios reveal your unique proportional signature.",
    bullets: [
      "Vertical thirds analysis (33.3% ideal)",
      "Horizontal fifths breakdown",
      "Asymmetry mapping with tolerance bands",
    ],
    position: "top-[16%] left-[50%] -translate-x-1/2",
  },
  {
    id: "structure",
    label: "Feature Structure",
    short: "Shape, definition and visual presence.",
    icon: ScanFace,
    stat: "78+ Measurements",
    detail:
      "Each feature is measured against established proportional frameworks. Eyes, nose, lips, jawline, cheekbones — we map how each interacts with the others to create your overall structural signature.",
    bullets: [
      "Feature-by-feature measurement tables",
      "Deviation from optimal ranges shown",
      "Impact weight for each measurement",
    ],
    position: "top-[37%] right-[10%]",
  },
  {
    id: "skin",
    label: "Skin Assessment",
    short: "Surface-level visible skin observations.",
    icon: Sparkles,
    stat: "8 Skin Metrics",
    detail:
      "We assess texture uniformity, pore visibility, tone evenness, clarity, under-eye area, hydration appearance, lines, and radiance. Each metric includes AM/PM routines, key ingredients, and lifestyle factors.",
    bullets: [
      "Deep-dive recommendations per metric",
      "Product type suggestions",
      "Realistic timelines for improvement",
    ],
    position: "bottom-[24%] right-[15%]",
  },
  {
    id: "personal",
    label: "Personalised Blueprint",
    short: "Insights translated into practical next steps.",
    icon: Wand2,
    stat: "Actionable Outputs",
    detail:
      "Your analysis becomes a personalised improvement roadmap. We prioritise recommendations by impact and difficulty, showing projected harmony gains and honest limitations for each intervention.",
    bullets: [
      "Projected score improvements",
      "Timeline-based priority planning",
      "Cosmetic and lifestyle options",
    ],
    position: "bottom-[22%] left-[13%]",
  },
  {
    id: "privacy",
    label: "Private by Design",
    short: "User control and trust built in.",
    icon: ShieldCheck,
    stat: "Your Data, Your Control",
    detail:
      "Photos are processed in-session and not stored on our servers. Your analysis lives in your browser. We do not train on your images or share any data with third parties.",
    bullets: [
      "No server-side image storage",
      "Analysis stored locally in browser",
      "No data sharing or model training",
    ],
    position: "top-[42%] left-[8%]",
  },
]

export function InteractiveExplainer() {
  const [activeId, setActiveId] = useState("symmetry")

  const activeItem = useMemo(
    () => ITEMS.find((item) => item.id === activeId) ?? ITEMS[0],
    [activeId]
  )

  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Column - Text & Buttons */}
        <div className="flex flex-col justify-center">
          <Badge variant="secondary" className="mb-4 w-fit rounded-full px-3 py-1 text-xs font-medium">
            How Axivia Works
          </Badge>
          <h2 className="max-w-xl font-serif text-3xl tracking-tight md:text-5xl">
            A comprehensive approach to facial analysis
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Understand what happens when you upload your photos — from proportional mathematics 
            to personalised recommendations. Every measurement is explained, every score is justified.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeId === item.id
              return (
                <button
                  key={item.id}
                  onMouseEnter={() => setActiveId(item.id)}
                  onFocus={() => setActiveId(item.id)}
                  onClick={() => setActiveId(item.id)}
                  className={`group rounded-2xl border p-4 text-left transition-all ${
                    isActive
                      ? "border-foreground bg-foreground text-background shadow-lg"
                      : "border-border bg-card text-foreground hover:border-foreground/30 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-semibold">{item.label}</span>
                      </div>
                      <p
                        className={`mt-2 text-sm leading-6 ${
                          isActive ? "text-background/70" : "text-muted-foreground"
                        }`}
                      >
                        {item.short}
                      </p>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${isActive ? "translate-x-1" : ""}`} />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column - Interactive Visual */}
        <div className="relative">
          <Card className="overflow-hidden rounded-[2rem] border-border shadow-xl">
            <CardContent className="p-0">
              <div className="relative min-h-[620px] bg-gradient-to-b from-secondary/50 to-background p-6 md:p-8">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-muted/50 to-transparent" />

                {/* Face Outline Visual */}
                <div className="relative flex h-full min-h-[560px] items-center justify-center">
                  <div className="relative h-[430px] w-[300px] rounded-[999px] border border-border bg-card/70 backdrop-blur">
                    <div className="absolute inset-[18px] rounded-[999px] border border-dashed border-border" />

                    {/* Face regions */}
                    <div className="absolute left-1/2 top-[18%] h-16 w-16 -translate-x-1/2 rounded-full bg-muted" />
                    <div className="absolute left-1/2 top-[34%] h-[120px] w-[170px] -translate-x-1/2 rounded-[999px] bg-muted" />
                    <div className="absolute left-1/2 bottom-[16%] h-[120px] w-[190px] -translate-x-1/2 rounded-b-[120px] rounded-t-[80px] bg-muted" />

                    {/* Focus ring */}
                    <motion.div
                      layoutId="focus-ring"
                      transition={{ type: "spring", stiffness: 260, damping: 24 }}
                      className="absolute left-1/2 top-1/2 h-[250px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border-2 border-foreground/80"
                    />
                  </div>

                  {/* Floating Labels */}
                  {ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = activeId === item.id
                    return (
                      <button
                        key={item.id}
                        onMouseEnter={() => setActiveId(item.id)}
                        onFocus={() => setActiveId(item.id)}
                        onClick={() => setActiveId(item.id)}
                        className={`absolute ${item.position}`}
                      >
                        <motion.div
                          animate={{ scale: isActive ? 1.06 : 1, y: isActive ? -2 : 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm shadow-sm backdrop-blur ${
                            isActive
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-card/90 text-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{item.label}</span>
                        </motion.div>
                      </button>
                    )
                  })}
                </div>

                {/* Detail Panel */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22 }}
                    className="mt-2 rounded-[1.5rem] border border-border bg-card p-6 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          {activeItem.stat}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold">
                          {activeItem.label}
                        </h3>
                      </div>
                      <Badge variant="outline" className="rounded-full px-3 py-1">
                        Interactive Explainer
                      </Badge>
                    </div>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                      {activeItem.detail}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {activeItem.bullets.map((bullet) => (
                        <div key={bullet} className="rounded-2xl bg-secondary p-3 text-sm leading-6">
                          {bullet}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button asChild className="rounded-full">
                        <Link href="/analyze">Start Your Analysis</Link>
                      </Button>
                      <Button variant="outline" asChild className="rounded-full">
                        <Link href="#sample-report">See Example Report</Link>
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
