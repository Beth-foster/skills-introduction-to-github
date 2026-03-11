import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Lock } from "lucide-react"

export function SampleReport() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
            What You Will Receive
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            A comprehensive report breaking down your facial harmony across multiple dimensions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Harmony Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Facial Thirds Balance</span>
                  <span className="text-sm text-muted-foreground">Well Balanced</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Horizontal Proportion</span>
                  <span className="text-sm text-muted-foreground">Slightly Narrow</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Symmetry Index</span>
                  <span className="text-sm text-muted-foreground">Within Normal Range</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Feature Cohesion</span>
                  <span className="text-sm text-muted-foreground">Harmonious</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Identified Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-1.5 flex-shrink-0" />
                    Strong brow structure providing facial framework
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-1.5 flex-shrink-0" />
                    Well-defined cheekbone positioning
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-1.5 flex-shrink-0" />
                    Balanced eye spacing relative to nose width
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border relative overflow-hidden">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Full report available after purchase</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Enhancement Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-1 mt-1.5 flex-shrink-0" />
                    Detailed grooming and styling recommendations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-1 mt-1.5 flex-shrink-0" />
                    Skincare and lifestyle suggestions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-1 mt-1.5 flex-shrink-0" />
                    Hair and presentation guidance
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="text-base px-8 py-6" asChild>
            <Link href="/analyze">
              Get Your Full Report
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
