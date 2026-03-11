import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FacialAnalysis } from "@/lib/analysis-types"

interface FeatureRelationshipsProps {
  relationships: FacialAnalysis["featureRelationships"]
}

const impactStyles = {
  positive: "border-chart-2/30 bg-chart-2/5",
  neutral: "border-border bg-secondary/30",
  "slight-tension": "border-chart-1/30 bg-chart-1/5"
}

const impactLabels = {
  positive: { text: "Enhances harmony", color: "text-chart-2" },
  neutral: { text: "Neutral pairing", color: "text-muted-foreground" },
  "slight-tension": { text: "Slight tension", color: "text-chart-1" }
}

export function FeatureRelationships({ relationships }: FeatureRelationshipsProps) {
  if (!relationships?.length) return null

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-serif text-xl flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5" />
          Feature Relationship Matrix
        </CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">
          No feature exists in isolation. Visual balance emerges from relationships between vertical thirds, horizontal fifths, and projection depth.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {relationships.map((rel, index) => (
          <div 
            key={index} 
            className={cn("p-4 rounded-lg border", impactStyles[rel.impact])}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">{rel.featureA}</span>
              <ArrowLeftRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium">{rel.featureB}</span>
              <span className={cn("text-xs ml-auto", impactLabels[rel.impact].color)}>
                {impactLabels[rel.impact].text}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">{rel.relationship}</p>
            {rel.suggestion && (
              <p className="text-xs text-foreground/80 bg-background/50 p-2 rounded">
                {rel.suggestion}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
