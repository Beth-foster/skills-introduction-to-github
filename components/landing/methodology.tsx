"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChevronRight, Info } from "lucide-react"

interface MethodologyCategory {
  id: string
  title: string
  shortTitle: string
  testCount: number
  description: string
  parameters: {
    name: string
    weight: number
    description: string
  }[]
  insight: string
}

const categories: MethodologyCategory[] = [
  {
    id: "structure",
    title: "Facial Structure",
    shortTitle: "Structure",
    testCount: 18,
    description: "Analysis of bone structure, facial width-to-height ratio, and foundational geometry that determines overall face shape.",
    parameters: [
      { name: "Facial Width-to-Height Ratio", weight: 85, description: "The horizontal-to-vertical proportion of your face" },
      { name: "Bigonial Width", weight: 72, description: "The distance between the angles of your jaw" },
      { name: "Bizygomatic Width", weight: 78, description: "Cheekbone-to-cheekbone measurement" },
      { name: "Lower Face Ratio", weight: 68, description: "Proportion of the lower third relative to midface" },
      { name: "Facial Convexity", weight: 65, description: "The forward projection of your facial profile" },
    ],
    insight: "Structure accounts for 30% of your overall harmony score. It forms the architectural foundation that all other features sit within."
  },
  {
    id: "proportions",
    title: "Facial Proportions",
    shortTitle: "Proportions",
    testCount: 14,
    description: "Measurement of vertical thirds and horizontal fifths — the classical divisions used in aesthetic analysis.",
    parameters: [
      { name: "Upper Third Ratio", weight: 74, description: "Hairline to brow — ideally 33% of face height" },
      { name: "Middle Third Ratio", weight: 81, description: "Brow to nose base — the most expressive zone" },
      { name: "Lower Third Ratio", weight: 77, description: "Nose base to chin — affects perceived maturity" },
      { name: "Facial Fifths Alignment", weight: 69, description: "Five equal vertical divisions across face width" },
      { name: "Interpupillary Ratio", weight: 73, description: "Eye spacing relative to face width" },
    ],
    insight: "Proportional harmony is what makes features 'work together' even when individual features differ from classical ideals."
  },
  {
    id: "symmetry",
    title: "Symmetry Analysis",
    shortTitle: "Symmetry",
    testCount: 12,
    description: "Bilateral comparison of left and right facial halves. Natural asymmetry is normal — perfect symmetry doesn't exist.",
    parameters: [
      { name: "Orbital Symmetry", weight: 82, description: "Eye position, size, and tilt comparison" },
      { name: "Nasal Deviation", weight: 71, description: "Nose alignment relative to facial midline" },
      { name: "Lip Symmetry", weight: 75, description: "Balance of left and right lip fullness" },
      { name: "Jawline Symmetry", weight: 68, description: "Mandibular angle comparison" },
      { name: "Brow Symmetry", weight: 79, description: "Height and arch consistency between brows" },
    ],
    insight: "Research shows asymmetry under 5% is virtually imperceptible. We measure deviation, not perfection."
  },
  {
    id: "features",
    title: "Feature Relationships",
    shortTitle: "Features",
    testCount: 22,
    description: "How individual features interact with each other — eye-to-nose ratios, lip-to-chin proportion, and feature harmony.",
    parameters: [
      { name: "Eye Spacing Index", weight: 76, description: "Distance between eyes relative to eye width" },
      { name: "Nose-to-Lip Ratio", weight: 72, description: "Vertical nose length vs upper lip height" },
      { name: "Philtrum-to-Chin", weight: 69, description: "Upper lip to chin proportion" },
      { name: "Canthal Tilt", weight: 83, description: "The angle of your eye axis" },
      { name: "Lip-to-Face Ratio", weight: 71, description: "Lip width relative to face width" },
    ],
    insight: "Feature relationships explain why some faces with 'imperfect' individual features still achieve high harmony scores."
  },
  {
    id: "skin",
    title: "Skin Assessment",
    shortTitle: "Skin",
    testCount: 8,
    description: "Observational analysis of texture, tone, clarity, and radiance. This is aesthetic assessment, not medical diagnosis.",
    parameters: [
      { name: "Texture Uniformity", weight: 78, description: "Smoothness and consistency of skin surface" },
      { name: "Tone Evenness", weight: 74, description: "Consistency of skin colour across zones" },
      { name: "Clarity Score", weight: 71, description: "Absence of visible congestion or blemishes" },
      { name: "Under-Eye Assessment", weight: 69, description: "Darkness, puffiness, and hollowing evaluation" },
      { name: "Overall Radiance", weight: 72, description: "Light reflection and 'glow' appearance" },
    ],
    insight: "Skin contributes 15% to your harmony score. It's the one category most responsive to lifestyle and skincare changes."
  },
  {
    id: "expression",
    title: "Expression Indices",
    shortTitle: "Expression",
    testCount: 6,
    description: "How your features express along spectrums — masculine/feminine, soft/defined, warm/intense. Neutral analysis, no judgment.",
    parameters: [
      { name: "Masculine-Feminine Spectrum", weight: 50, description: "Structural morphology reading (not gender identity)" },
      { name: "Softness Index", weight: 65, description: "Roundedness of facial contours" },
      { name: "Definition Index", weight: 58, description: "Angular prominence of bone structure" },
      { name: "Warmth Index", weight: 72, description: "How approachable the face reads at rest" },
      { name: "Intensity Index", weight: 61, description: "How striking or commanding features appear" },
    ],
    insight: "Expression indices help tailor recommendations to your aesthetic goals, not prescribe what you 'should' look like."
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

function ParameterBar({ name, weight, description, isActive }: { name: string; weight: number; description: string; isActive: boolean }) {
  return (
    <div className={cn("py-3 border-b border-border/50 last:border-0 transition-all duration-300", isActive ? "opacity-100" : "opacity-60")}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs font-mono text-muted-foreground">
          {isActive ? <AnimatedNumber value={weight} duration={800} /> : weight}%
        </span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            weight >= 80 ? "bg-chart-2" : weight >= 70 ? "bg-chart-4" : "bg-chart-3"
          )}
          style={{ width: isActive ? `${weight}%` : "0%" }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
    </div>
  )
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
            <span className="w-1.5 h-1.5 rounded-full bg-chart-2 animate-pulse" />
            80+ Parameters Analysed
          </div>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
            Our Methodology
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Based on established principles of facial analysis used in medical and aesthetic fields, 
            adapted for educational insight rather than clinical diagnosis.
          </p>
        </div>

        {/* Interactive Panel */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
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
                      <p className="text-xs text-muted-foreground">
                        {category.testCount} Tests
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
              <div className="p-6 border-b border-border/50 bg-secondary/30">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-serif text-2xl">{active.title}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-chart-2/10 text-chart-2 text-xs font-mono">
                        {active.testCount} tests
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                      {active.description}
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Weight in Score</p>
                    <p className="text-3xl font-mono font-medium">
                      {active.id === "structure" ? "30" : 
                       active.id === "symmetry" ? "20" :
                       active.id === "features" ? "20" :
                       active.id === "skin" ? "15" :
                       active.id === "expression" ? "10" : "5"}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Parameters */}
              <div className="p-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Key Parameters Measured</p>
                <div className="space-y-0">
                  {active.parameters.map((param) => (
                    <ParameterBar 
                      key={param.name} 
                      {...param} 
                      isActive={isVisible && activeCategory === active.id}
                    />
                  ))}
                </div>
              </div>

              {/* Insight Footer */}
              <div className="p-6 bg-secondary/50 border-t border-border/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-chart-4/20 flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4 text-chart-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Insight</p>
                    <p className="text-sm leading-relaxed">{active.insight}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { value: 78, suffix: "+", label: "Individual Measurements" },
            { value: 6, suffix: "", label: "Analysis Categories" },
            { value: 2000, suffix: "+", label: "Academic Studies Referenced" },
            { value: 45, suffix: "s", label: "Avg. Analysis Time" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
              <p className="text-2xl md:text-3xl font-mono font-medium">
                {isVisible ? <AnimatedNumber value={stat.value} duration={1200} /> : "0"}
                {stat.suffix}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
