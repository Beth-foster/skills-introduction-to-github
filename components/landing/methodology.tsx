import { Card, CardContent } from "@/components/ui/card"
import { Ruler, Grid3X3, Sparkles, Scale, CircleDot, Palette } from "lucide-react"

const methodologyItems = [
  {
    icon: Grid3X3,
    title: "Facial Thirds",
    description: "Analysis of upper, middle, and lower face proportions to assess vertical balance and harmony."
  },
  {
    icon: Ruler,
    title: "Facial Fifths",
    description: "Horizontal proportion measurement dividing the face into five equal sections for width assessment."
  },
  {
    icon: Scale,
    title: "Symmetry Analysis",
    description: "Evaluation of bilateral symmetry with understanding that natural asymmetry is normal and expected."
  },
  {
    icon: CircleDot,
    title: "Feature Relationships",
    description: "Assessment of how individual features relate to each other — eye spacing, nose-lip ratios, and more."
  },
  {
    icon: Palette,
    title: "Skin Assessment",
    description: "Descriptive analysis of texture, tone, and clarity — observational, never diagnostic."
  },
  {
    icon: Sparkles,
    title: "Feature Expression",
    description: "Understanding how your features express masculinity, femininity, or androgyny — explained neutrally."
  }
]

export function Methodology() {
  return (
    <section id="methodology" className="py-24 px-6 bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
            Our Methodology
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Based on established principles of facial analysis used in medical and aesthetic fields, 
            adapted for educational insight rather than clinical diagnosis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methodologyItems.map((item) => (
            <Card key={item.title} className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
