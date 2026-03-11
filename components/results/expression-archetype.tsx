import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FacialAnalysis } from "@/lib/analysis-types"

interface ExpressionArchetypeProps {
  expression: FacialAnalysis["featureExpression"]
}

function IndexBar({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-mono">{value} {unit}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-foreground/60 rounded-full transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function ScaleBar({ label, value, leftLabel, rightLabel }: { label: string; value: number; leftLabel: string; rightLabel: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-mono">{value}/100</span>
      </div>
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        <div className="absolute inset-y-0 left-1/2 w-px bg-border z-10" />
        <div 
          className="h-full bg-foreground/60 rounded-full transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">{leftLabel}</span>
        <span className="text-xs text-muted-foreground">{rightLabel}</span>
      </div>
    </div>
  )
}

export function ExpressionArchetype({ expression }: ExpressionArchetypeProps) {
  if (!expression) return null

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Expression Indices</CardTitle>
        <p className="text-xs text-muted-foreground">
          Structural configuration metrics derived from proportional analysis.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Archetype */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border text-center">
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Structural Archetype</p>
          <p className="font-serif text-xl font-medium">{expression.facialArchetype}</p>
        </div>

        {/* Indices */}
        <div className="space-y-5">
          <IndexBar label="Softness Index" value={expression.softnessIndex} unit="/ 100" />
          <IndexBar label="Definition Index" value={expression.definitionIndex} unit="/ 100" />
          <IndexBar label="Warmth Index" value={expression.warmthIndex} unit="/ 100" />
          <IndexBar label="Intensity Index" value={expression.intensityIndex} unit="/ 100" />
          <ScaleBar 
            label="Masculine-Feminine Scale" 
            value={expression.masculineFeminineScale} 
            leftLabel="Masculine" 
            rightLabel="Feminine" 
          />
        </div>

        {/* Analysis */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {expression.analysis}
        </p>

        {/* Structural Traits */}
        <div className="flex flex-wrap gap-2">
          {expression.dominantTraits.map((trait) => (
            <span 
              key={trait} 
              className="px-3 py-1.5 bg-secondary rounded-full text-xs font-mono"
            >
              {trait}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
