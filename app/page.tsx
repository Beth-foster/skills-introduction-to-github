import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { ResearchProof } from "@/components/landing/research-proof"
import { AnalysisDepth } from "@/components/landing/analysis-depth"
import { Methodology } from "@/components/landing/methodology"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Ethics } from "@/components/landing/ethics"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main>
      <Header />
      <Hero />
      <ResearchProof />
      <AnalysisDepth />
      <Methodology />
      <HowItWorks />
      <Ethics />
      <Footer />
    </main>
  )
}
