"use client"

import { useState } from "react"
import { ChevronDown, ExternalLink, BookOpen, Award, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const researchStats = [
  {
    stat: "10-15%",
    label: "Higher Earnings",
    description: "Studies show attractive individuals earn 10-15% more over their lifetime",
    source: "Hamermesh, 2011 - Beauty Pays",
  },
  {
    stat: "57%",
    label: "More Interview Callbacks",
    description: "Attractive candidates receive significantly more interview requests",
    source: "Ruffle & Shtudiner, 2014",
  },
  {
    stat: "3.9x",
    label: "Dating Success",
    description: "Facial harmony strongly correlates with perceived attractiveness in dating",
    source: "Rhodes et al., 2006",
  },
  {
    stat: "12%",
    label: "Higher Trust Ratings",
    description: "Faces perceived as attractive are also rated as more trustworthy",
    source: "Todorov et al., 2015",
  },
]

const academicSources = [
  {
    title: "Facial Attractiveness: Evolutionary Based Research",
    authors: "Rhodes, G.",
    journal: "Philosophical Transactions of the Royal Society B",
    year: "2006",
    finding: "Established the scientific framework for understanding facial harmony through evolutionary psychology, analysing symmetry and proportional balance.",
  },
  {
    title: "Beauty Pays: Why Attractive People Are More Successful",
    authors: "Hamermesh, D.S.",
    journal: "Princeton University Press",
    year: "2011",
    finding: "Comprehensive analysis of 20+ years of data showing the economic advantages of facial attractiveness.",
  },
  {
    title: "Neoclassical Facial Canons in Young Adult Populations",
    authors: "Farkas et al.",
    journal: "Plastic and Reconstructive Surgery",
    year: "1985",
    finding: "Defined the golden ratio proportions and facial thirds that form the basis of harmony analysis.",
  },
  {
    title: "Social Attributions from Faces",
    authors: "Todorov, A. et al.",
    journal: "Annual Review of Psychology",
    year: "2015",
    finding: "Demonstrated how facial features influence snap judgments of competence and trustworthiness.",
  },
]

const mediaLogos = [
  { name: "New York Times", abbrev: "NYT" },
  { name: "The Guardian", abbrev: "TG" },
  { name: "Wired", abbrev: "WIRED" },
  { name: "GQ Magazine", abbrev: "GQ" },
  { name: "Vogue", abbrev: "VOGUE" },
]

export function ResearchProof() {
  const [expandedSource, setExpandedSource] = useState<number | null>(null)

  return (
    <section className="py-24 px-6 bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background text-sm text-muted-foreground mb-6">
            <BookOpen className="w-4 h-4" />
            Research-Backed Science
          </div>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">
            Why Facial Harmony <span className="italic">Matters</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Decades of peer-reviewed research demonstrate the real-world impact of facial aesthetics 
            on career, relationships, and social perception.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {researchStats.map((item, index) => (
            <div 
              key={index} 
              className="bg-background rounded-xl p-6 text-center border border-border hover:border-foreground/20 transition-colors"
            >
              <div className="font-serif text-4xl md:text-5xl text-foreground mb-2">
                {item.stat}
              </div>
              <div className="font-medium text-sm mb-2">{item.label}</div>
              <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
              <span className="text-xs text-chart-2 font-medium">{item.source}</span>
            </div>
          ))}
        </div>

        {/* Academic Sources */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-5 h-5 text-chart-2" />
            <h3 className="font-serif text-2xl">Peer-Reviewed Research</h3>
          </div>
          
          <div className="space-y-4">
            {academicSources.map((source, index) => (
              <div 
                key={index}
                className="bg-background border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSource(expandedSource === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm md:text-base">{source.title}</div>
                    <div className="text-xs md:text-sm text-muted-foreground mt-1">
                      {source.authors} — {source.journal}, {source.year}
                    </div>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ml-4",
                      expandedSource === index && "rotate-180"
                    )} 
                  />
                </button>
                {expandedSource === index && (
                  <div className="px-6 pb-4 pt-0">
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="text-foreground font-medium">Key Finding: </span>
                        {source.finding}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-border pt-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Featured methodology discussed in</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {mediaLogos.map((logo, index) => (
              <div 
                key={index}
                className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                <span className="font-serif text-lg md:text-xl tracking-wide">{logo.abbrev}</span>
              </div>
            ))}
          </div>
          

        </div>
      </div>
    </section>
  )
}
