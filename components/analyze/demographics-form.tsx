"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowRight, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Demographics } from "@/lib/analysis-types"

interface DemographicsFormProps {
  onComplete: (demographics: Demographics) => void
  onSkip: () => void
}

const ageRanges = [
  { value: "18-24", label: "18-24" },
  { value: "25-34", label: "25-34" },
  { value: "35-44", label: "35-44" },
  { value: "45-54", label: "45-54" },
  { value: "55+", label: "55+" },
] as const

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const

const ethnicityOptions = [
  { value: "east-asian", label: "East Asian" },
  { value: "south-asian", label: "South Asian" },
  { value: "southeast-asian", label: "Southeast Asian" },
  { value: "middle-eastern", label: "Middle Eastern" },
  { value: "african", label: "African" },
  { value: "european", label: "European" },
  { value: "latin-american", label: "Latin American" },
  { value: "mixed", label: "Mixed / Multi-ethnic" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const

const expressionPreferences = [
  { value: "enhance-masculine", label: "Enhance masculine features" },
  { value: "enhance-feminine", label: "Enhance feminine features" },
  { value: "balanced-androgynous", label: "Balanced / androgynous" },
  { value: "no-preference", label: "No preference — just show me the data" },
] as const

const concernOptions = [
  "Skin clarity",
  "Facial symmetry",
  "Proportions",
  "Jawline definition",
  "Eye area",
  "Nose shape",
  "Lip balance",
  "Aging concerns",
]

export function DemographicsForm({ onComplete, onSkip }: DemographicsFormProps) {
  const [ageRange, setAgeRange] = useState<Demographics["ageRange"]>(null)
  const [gender, setGender] = useState<Demographics["gender"]>(null)
  const [ethnicity, setEthnicity] = useState<Demographics["ethnicity"]>(null)
  const [concerns, setConcerns] = useState<string[]>([])
  const [expressionPref, setExpressionPref] = useState<string | null>(null)

  const handleConcernToggle = (concern: string) => {
    setConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    )
  }

  const handleSubmit = () => {
    onComplete({
      ageRange,
      gender,
      ethnicity,
      primaryConcerns: concerns.length > 0 ? [...concerns, ...(expressionPref ? [`Expression preference: ${expressionPref}`] : [])] : (expressionPref ? [`Expression preference: ${expressionPref}`] : null)
    })
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-8">
      <div className="flex items-start gap-3 mb-6 p-4 rounded-lg bg-secondary/50">
        <Info className="w-5 h-5 text-chart-2 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-sm mb-1">Personalized Analysis</h3>
          <p className="text-sm text-muted-foreground">
            This optional information helps our AI provide more relevant, culturally-aware recommendations 
            based on research specific to your demographic. All fields are optional.
          </p>
        </div>
      </div>

      {/* Age Range */}
      <div className="mb-8">
        <Label className="text-sm font-medium mb-3 block">Age Range</Label>
        <div className="flex flex-wrap gap-2">
          {ageRanges.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setAgeRange(ageRange === option.value ? null : option.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm border transition-colors",
                ageRange === option.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background border-border hover:border-foreground/30"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="mb-8">
        <Label className="text-sm font-medium mb-3 block">Gender</Label>
        <div className="flex flex-wrap gap-2">
          {genderOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setGender(gender === option.value ? null : option.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm border transition-colors",
                gender === option.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background border-border hover:border-foreground/30"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ethnicity */}
      <div className="mb-8">
        <Label className="text-sm font-medium mb-3 block">Ethnic Background</Label>
        <p className="text-xs text-muted-foreground mb-3">
          Helps calibrate analysis to relevant research and beauty standards for your background.
        </p>
        <div className="flex flex-wrap gap-2">
          {ethnicityOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setEthnicity(ethnicity === option.value ? null : option.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm border transition-colors",
                ethnicity === option.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background border-border hover:border-foreground/30"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gender Expression Preference */}
      <div className="mb-8">
        <Label className="text-sm font-medium mb-3 block">Aesthetic Direction Preference</Label>
        <p className="text-xs text-muted-foreground mb-3">
          This helps us tailor grooming, styling, and cosmetic recommendations to your personal goals. 
          It does not affect structural measurements — those are objective regardless of preference.
        </p>
        <div className="flex flex-wrap gap-2">
          {expressionPreferences.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setExpressionPref(expressionPref === option.value ? null : option.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm border transition-colors",
                expressionPref === option.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background border-border hover:border-foreground/30"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Concerns */}
      <div className="mb-8">
        <Label className="text-sm font-medium mb-3 block">Primary Areas of Interest</Label>
        <p className="text-xs text-muted-foreground mb-3">
          Select areas you would like us to focus on. Choose as many as you like.
        </p>
        <div className="flex flex-wrap gap-2">
          {concernOptions.map(concern => (
            <button
              key={concern}
              type="button"
              onClick={() => handleConcernToggle(concern)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm border transition-colors",
                concerns.includes(concern)
                  ? "bg-chart-2/10 text-foreground border-chart-2"
                  : "bg-background border-border hover:border-foreground/30"
              )}
            >
              {concern}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <Button
          onClick={handleSubmit}
          className="flex-1"
          size="lg"
        >
          Continue with Personalization
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={onSkip}
          className="bg-transparent"
          size="lg"
        >
          Skip for Now
        </Button>
      </div>
    </div>
  )
}
