"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChevronRight, Sparkles } from "lucide-react"

interface MethodologyCategory {
  id: string
  title: string
  tagline: string
  testCount: number
  description: string
  highlights: string[]
  marketingHook: string
}

const categories: MethodologyCategory[] = [
  {
    id: "structure",
    title: "Bone Structure",
    tagline: "The Foundation",
    testCount: 18,
    description: "Your facial architecture — the underlying geometry that determines how light falls across your face and how features relate to each other.",
    highlights: [
      "Jawline definition and facial width analysis",
      "Cheekbone prominence mapping",
      "Profile convexity assessment",
      "Foundational balance scoring",
    ],
    marketingHook: "The unchangeable canvas that makes your face uniquely yours. We measure it so you understand what you're working with."
  },
  {
    id: "proportions",
    title: "Golden Ratios",
    tagline: "Classical Harmony",
    testCount: 14,
    description: "The mathematical relationships that artists and surgeons have studied for centuries — adapted into actionable insight.",
    highlights: [
      "Vertical third distribution",
      "Horizontal fifth alignment", 
      "Feature spacing indices",
      "Proportional consistency scoring",
    ],
    marketingHook: "Not about perfection — about understanding which proportions create your face's unique character."
  },
  {
    id: "symmetry",
    title: "Bilateral Balance",
    tagline: "Left Meets Right",
    testCount: 12,
    description: "No face is perfectly symmetrical. We measure the subtle differences that make faces interesting — not to 'fix' them, but to understand them.",
    highlights: [
      "Feature alignment comparison",
      "Micro-asymmetry detection",
      "Perceptibility thresholds",
      "Natural variation mapping",
    ],
    marketingHook: "Spoiler: some of the world's most attractive faces have notable asymmetry. It's about harmony, not mirrors."
  },
  {
    id: "features",
    title: "Feature Relationships",
    tagline: "How It All Connects",
    testCount: 22,
    description: "Individual features don't exist in isolation. The magic is in how they interact — eye spacing affects nose perception, lip proportion affects chin reading.",
    highlights: [
      "Inter-feature ratio analysis",
      "Visual weight distribution",
      "Focal point mapping",
      "Harmony vs. contrast scoring",
    ],
    marketingHook: "This is why some 'imperfect' features work beautifully together while 'ideal' features can look off. Context is everything."
  },
  {
    id: "skin",
    title: "Surface Quality",
    tagline: "The Living Layer",
    testCount: 8,
    description: "The one category almost entirely within your control. Texture, tone, clarity, radiance — these respond to care, lifestyle, and time.",
    highlights: [
      "Texture uniformity assessment",
      "Tone consistency mapping",
      "Clarity and radiance scoring",
      "Improvement potential analysis",
    ],
    marketingHook: "Your highest-leverage category for visible change. Small adjustments here show fast results."
  },
  {
    id: "expression",
    title: "Expression Profile",
    tagline: "How You Read",
    testCount: 6,
    description: "Beyond measurements — how your structural features combine to create an impression. Warm or intense? Soft or defined? This is your visual signature.",
    highlights: [
      "Approachability index",
      "Definition vs. softness spectrum",
      "Visual intensity scoring",
      "Aesthetic direction mapping",
    ],
    marketingHook: "Not about changing who you are — about understanding the visual story your face tells at rest."
  },
]

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = Date.now()
          const animate = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayValue(Math.round(value * eased))
            if (progress < 1) requestAnimationFrame(animate)
          }
          animate()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration])

  return <span ref={ref}>{displayValue}</span>
}

export function Methodology() {
  const [activeCategory, setActiveCategory] = useState<string>("structure")
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const active = categories.find(c => c.id === activeCategory) || categories[0]

  return (
    <section id="methodology" className="py-24 px-6 bg-secondary/30" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
            <Sparkles className="w-3 h-3" />
            Science Meets Aesthetics
          </div>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
            What We Measure
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            78+ data points across six dimensions of facial analysis. 
            Built on decades of research in anthropometry, aesthetic medicine, and perceptual psychology.
          </p>
        </div>

        {/* Interactive Panel */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Category Selector */}
          <div className="space-y-2">
            {categories.map((category, idx) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all duration-300 group",
                  activeCategory === category.id
                    ? "bg-card border-foreground/20 shadow-sm"
                    : "bg-transparent border-border/50 hover:border-border hover:bg-card/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono transition-colors",
                      activeCategory === category.id ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                    )}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className={cn(
                        "font-medium text-sm transition-colors",
                        activeCategory === category.id ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {category.title}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {category.tagline}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-all",
                    activeCategory === category.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                  )} />
                </div>
              </button>
            ))}
          </div>

          {/* Detail Panel */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              {/* Panel Header */}
              <div className="p-6 border-b border-border/50 bg-gradient-to-br from-secondary/50 to-transparent">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-chart-2 font-medium uppercase tracking-wider mb-1">{active.tagline}</p>
                    <h3 className="font-serif text-2xl mb-3">{active.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                      {active.description}
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="w-16 h-16 rounded-2xl bg-foreground/5 border border-border/50 flex items-center justify-center">
                      <span className="text-2xl font-mono font-medium">{active.testCount}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Tests</p>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="p-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">What We Look At</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {active.highlights.map((highlight, idx) => (
                    <div 
                      key={idx}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/30 transition-all duration-500",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      )}
                      style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-chart-2 flex-shrink-0" />
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marketing Hook Footer */}
              <div className="p-6 bg-gradient-to-r from-chart-2/5 to-transparent border-t border-border/50">
                <p className="text-sm leading-relaxed italic text-foreground/80">
                  "{active.marketingHook}"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { value: 78, suffix: "+", label: "Data Points" },
            { value: 6, suffix: "", label: "Dimensions" },
            { value: 2, suffix: "-3 min", label: "Analysis Time", isTime: true },
            { value: 100, suffix: "%", label: "Privacy Focused" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
              <p className="text-2xl md:text-3xl font-mono font-medium">
                {stat.isTime ? "2-3 min" : (
                  <>
                    {isVisible ? <AnimatedNumber value={stat.value} duration={1200} /> : "0"}
                    {stat.suffix}
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
