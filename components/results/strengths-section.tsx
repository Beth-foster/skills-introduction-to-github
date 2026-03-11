import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import type { FacialAnalysis } from "@/lib/analysis-types"

interface StrengthsSectionProps {
  strengths: FacialAnalysis["strengths"]
}

export function StrengthsSection({ strengths }: StrengthsSectionProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          Areas Within Optimal Range
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Features where proportional measurements fall within accepted tolerance bands.
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {strengths?.map((strength, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 mt-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-medium text-sm">{strength.feature}</p>
                </div>
                <p className="text-xs font-mono text-muted-foreground mb-1">
                  {strength.deviation}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {strength.explanation}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
