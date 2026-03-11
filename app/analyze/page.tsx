"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PhotoGuidelines } from "@/components/analyze/photo-guidelines"
import { ImageUploader } from "@/components/analyze/image-uploader"
import { DemographicsForm } from "@/components/analyze/demographics-form"
import { analyzeImages } from "@/app/actions/analyze"
import type { Demographics } from "@/lib/analysis-types"

type Step = "demographics" | "upload"

export default function AnalyzePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("demographics")
  const [demographics, setDemographics] = useState<Demographics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDemographicsComplete = (demo: Demographics) => {
    setDemographics(demo)
    setStep("upload")
  }

  const handleDemographicsSkip = () => {
    setDemographics(null)
    setStep("upload")
  }

  const handleImagesReady = async (images: string[]) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await analyzeImages(images, demographics)
      
      if (result.success && result.analysis) {
        // Generate a unique ID and store in localStorage
        const analysisId = crypto.randomUUID()
        const storageData = {
          id: analysisId,
          analysis: result.analysis,
          createdAt: new Date().toISOString(),
          isPaid: false
        }
        localStorage.setItem(`axiva_analysis_${analysisId}`, JSON.stringify(storageData))
        router.push(`/quick-wins/${analysisId}`)
      } else {
        setError(result.error || "Analysis failed. Please try again.")
      }
    } catch (err) {
      console.error("Error in analysis:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
            step === "demographics" 
              ? "bg-foreground text-background" 
              : "bg-secondary text-muted-foreground"
          }`}>
            <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs">1</span>
            Personalize
          </div>
          <div className="w-8 h-px bg-border" />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
            step === "upload" 
              ? "bg-foreground text-background" 
              : "bg-secondary text-muted-foreground"
          }`}>
            <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs">2</span>
            Upload
          </div>
        </div>

        {step === "demographics" && (
          <>
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
                Personalise Your Analysis
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Help our AI provide more relevant, culturally-aware insights tailored to you.
              </p>
            </div>
            <DemographicsForm 
              onComplete={handleDemographicsComplete}
              onSkip={handleDemographicsSkip}
            />
          </>
        )}

        {step === "upload" && (
          <>
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
                Upload Your Photo
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Follow our guidelines below for the most accurate analysis of your facial proportions and harmony.
              </p>
              {demographics && (
                <button 
                  onClick={() => setStep("demographics")}
                  className="mt-4 text-sm text-chart-2 hover:underline"
                >
                  Edit personalisation settings
                </button>
              )}
            </div>

            <PhotoGuidelines />

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <ImageUploader onImagesReady={handleImagesReady} isLoading={isLoading} />

            <div className="mt-12 p-6 rounded-lg bg-secondary/50 border border-border">
              <h3 className="font-medium mb-2">Privacy Notice</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your privacy is our priority. Images are transmitted securely, processed by our AI system, 
                and immediately deleted after analysis. We do not store facial data, perform identity matching, 
                or share your images with third parties. This analysis is for educational purposes only.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
