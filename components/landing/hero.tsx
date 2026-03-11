import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground mb-8">
          <span className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" />
          AI-Powered Facial Analysis
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl leading-tight tracking-tight text-balance mb-6">
          Understand Your
          <br />
          <span className="italic">Facial Harmony</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          Discover the science behind your unique features. Our AI analyses proportions, 
          balance, and harmony to provide personalised insights — not judgements.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="text-base px-8 py-6" asChild>
            <Link href="/analyze">
              Start Your Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-base px-8 py-6 bg-transparent" asChild>
            <Link href="#methodology">
              Learn Our Methodology
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Educational use only. Not medical advice.
        </p>
      </div>
    </section>
  )
}
