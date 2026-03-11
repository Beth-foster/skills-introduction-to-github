"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const sections = [
  { id: "overview", label: "Overview" },
  { id: "structure", label: "Structure" },
  { id: "relationships", label: "Relationships" },
  { id: "skin", label: "Skin" },
  { id: "expression", label: "Expression" },
  { id: "measurements", label: "Measurements" },
  { id: "cosmetic", label: "Cosmetic" },
  { id: "blueprint", label: "Blueprint" },
  { id: "simulator", label: "Simulator" },
]

export function SectionNav() {
  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border print:hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors",
                activeSection === id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
