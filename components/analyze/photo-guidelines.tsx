"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Camera, ChevronDown, ChevronUp } from "lucide-react"

const doItems = [
  "Have someone else take your photo from 1-2 metres away (reduces lens distortion)",
  "Use natural, even lighting — near a window is ideal",
  "Include a mix of angles: front, both sides, and three-quarter view",
  "Keep a neutral expression for at least 2 photos, plus a natural smile",
  "Remove glasses and keep hair away from your face for front-facing shots",
  "Use your phone's rear camera for sharper detail (selfie cameras distort proportions)",
]

const dontItems = [
  "Selfies at arm's length (wide-angle lenses distort facial proportions significantly)",
  "Heavy shadows or harsh overhead lighting",
  "Filters, beauty modes, or heavy editing of any kind",
  "All photos from the same angle — variety is essential",
  "Blurry, cropped, or low-resolution images",
  "Obstructions covering facial features (scarves, hands, etc.)",
]

export function PhotoGuidelines() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors mb-4"
      >
        <div className="flex items-center gap-3">
          <Camera className="w-5 h-5 text-muted-foreground" />
          <div className="text-left">
            <p className="text-sm font-medium">Photo Guidelines</p>
            <p className="text-xs text-muted-foreground">How to get the most accurate analysis</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Why multiple photos matter */}
          <Card className="border-border bg-secondary/30">
            <CardContent className="pt-5 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Why multiple photos?</span>{" "}
                A single photo only captures one perspective. Different angles reveal how your 
                features interact in three dimensions — jawline definition, nose projection, 
                cheekbone prominence, and facial symmetry are all better assessed with multiple views. 
                Photos taken by someone else from a reasonable distance also eliminate the lens 
                distortion that selfies introduce, which can make noses appear 30% larger and 
                flatten facial depth.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-chart-2/30 bg-chart-2/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-chart-2">
                  <CheckCircle2 className="w-5 h-5" />
                  For Best Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {doItems.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  Please Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {dontItems.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
