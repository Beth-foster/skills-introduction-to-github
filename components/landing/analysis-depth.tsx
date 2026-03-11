import { Eye, Smile, Wind, Sparkles, Ruler, CircleDot } from "lucide-react"

const analysisCategories = [
  {
    icon: Eye,
    name: "Eyes",
    tests: 18,
    examples: [
      "Canthal tilt angle",
      "Palpebral fissure width", 
      "Upper eyelid exposure",
      "Scleral show assessment",
      "Eye spacing ratio",
      "Limbal ring visibility",
    ],
  },
  {
    icon: Wind,
    name: "Nose",
    tests: 14,
    examples: [
      "Nasofrontal angle",
      "Nasal bridge width",
      "Tip projection ratio",
      "Nostril show analysis",
      "Dorsal hump assessment",
      "Alar base width",
    ],
  },
  {
    icon: Smile,
    name: "Lips & Mouth",
    tests: 12,
    examples: [
      "Vermilion ratio",
      "Lip projection balance",
      "Philtrum proportions",
      "Oral commissure angles",
      "Dental show percentage",
      "Lip symmetry analysis",
    ],
  },
  {
    icon: CircleDot,
    name: "Facial Structure",
    tests: 16,
    examples: [
      "Cheekbone prominence",
      "Bigonial width ratio",
      "Mandibular angle",
      "Chin projection",
      "Facial convexity",
      "Midface ratio",
    ],
  },
  {
    icon: Ruler,
    name: "Proportions",
    tests: 10,
    examples: [
      "Facial thirds balance",
      "Facial fifths ratio",
      "Golden ratio analysis",
      "Vertical symmetry",
      "Horizontal balance",
      "Profile harmony",
    ],
  },
  {
    icon: Sparkles,
    name: "Skin & Texture",
    tests: 8,
    examples: [
      "Skin clarity score",
      "Texture uniformity",
      "Tone evenness",
      "Under-eye assessment",
      "Pore visibility",
      "Overall radiance",
    ],
  },
]

export function AnalysisDepth() {
  const totalTests = analysisCategories.reduce((sum, cat) => sum + cat.tests, 0)

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground mb-6">
            <Ruler className="w-4 h-4" />
            Comprehensive Analysis
          </div>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">
            <span className="text-chart-2">{totalTests}+</span> Distinct Measurements
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our AI examines your facial features across six major categories, providing 
            the most thorough analysis available outside a clinical setting.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analysisCategories.map((category, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-2xl p-6 hover:border-foreground/20 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-chart-2/10 transition-colors">
                  <category.icon className="w-5 h-5 text-foreground group-hover:text-chart-2 transition-colors" />
                </div>
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <span className="text-xs text-chart-2">{category.tests} tests</span>
                </div>
              </div>
              
              <ul className="space-y-2">
                {category.examples.map((example, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-border mt-2 flex-shrink-0" />
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-6 rounded-2xl bg-secondary/50 border border-border">
            <div className="text-left">
              <div className="font-medium mb-1">Medical-Grade Precision</div>
              <p className="text-sm text-muted-foreground">
                Our measurements use the same landmark detection used in clinical research
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
