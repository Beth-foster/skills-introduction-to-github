"use server"

import { generateText, Output } from "ai"
import { coreAnalysisSchema, premiumEnrichmentSchema, type Demographics, type CoreAnalysis, type PremiumEnrichment, type FacialAnalysis } from "@/lib/analysis-types"

const CORE_PROMPT = `You are a clinical facial proportional analysis system. Produce a measured, neutral structural report.

LANGUAGE: British English (analyse, personalise, optimise, colour, centre, recognise).

TONE: Clinical. If a sentence could be said by a beauty influencer, remove it. Present ALL findings as structural observations with deviation-based language. Never use "standout", "stunning", "beautiful", "gorgeous", "striking", "impressive".

SCORING (CRITICAL — DO NOT INFLATE):
- 90-100: Top 5% — exceptional. Extremely rare.
- 85-89: Top 15% — strong consistency.
- 78-84: Above average — good alignment, few deviations.
- 70-77: Balanced — consistent but measurable deviation in multiple areas.
- 60-69: Moderate imbalance.
- Below 60: Significant deviation.
MOST USERS SCORE 65-78. Above 82 must be justified mathematically.
Category scores MUST show natural variance (not clustered within 5 points).

SCORING WEIGHTS: Structure 30% | Symmetry 20% | Relationships 20% | Skin 15% | Expression 10% | Contrast 5%

MEASUREMENTS: Use tolerance-band language only: "within-tolerance", "slight-deviation", "moderate-deviation", "notable-deviation".

STRENGTHS: State as "[Feature] deviation: [X%] (within optimal band of [range]). No structural correction required."
DEVIATIONS: State as "[Feature] deviation: [X%] (above/below optimal band). This contributes to [consequence]."
QUICK WINS: Diagnostic format with current measurement, ideal range, structural consequence, improvement options, projected gain, and honest limitation.

DISCLAIMER: "Harmony score reflects proportional alignment, not attractiveness or value. All faces exhibit deviation from idealised proportional ranges."`

const ENRICHMENT_PROMPT = `You are a clinical aesthetics and lifestyle adviser. Given the structural analysis data below, produce comprehensive recommendations.

LANGUAGE: British English.

SKIN DEEP-DIVE — for EACH of the 8 skin metrics:
- AM Routine: 2-4 morning steps specific to that metric
- PM Routine: 2-4 evening steps
- Key Ingredients: Named actives with concentrations (e.g. "Niacinamide 5-10%")
- Ingredient Rationale: Why these target this concern
- Lifestyle Factors: 2-4 changes affecting this metric
- Avoid List: 1-3 things that worsen it
- Time to Result: Realistic timeline

RECOMMENDATIONS: Provide grooming (3+), skincare (3+), hair (3+), lifestyle (3+), and optional aesthetic procedures.

COSMETIC & LIFESTYLE (must be IN-DEPTH and SPECIFIC — not generic advice):
1. HAIR (3+ recs): Named styles (e.g. "textured French crop", "layered curtain fringe") with WHY each works for this face shape. Styles to AVOID with reasons. Product types (e.g. "sea salt spray", "volumising mousse", "matte clay"). Reference specific proportional data.
2. FACIAL HAIR/MAKEUP (2+): Step-by-step techniques. Include product types (e.g. "beard oil", "trimmer guard sizes", "contour palette"). Reference which structural measurements each technique addresses.
3. EYEBROWS: Detailed current assessment, target shape with reasons tied to eye area and forehead proportions, numbered grooming steps with specific tool types (e.g. "angled tweezers", "brow razor", "clear brow gel").
4. COLOUR ANALYSIS: Undertone with explanation, 5+ best colours with context (e.g. "Forest green — complements warm undertone and enhances eye colour"), 3+ avoid colours with reasons, contrast level with styling implications.
5. LIFESTYLE (4+): Each habit with SPECIFIC explanation of which facial area it affects and how. Include frequency AND expected timeline. E.g. "Facial massage (gua sha) — 5 mins daily — improves lymphatic drainage reducing under-eye puffiness, visible results in 2-3 weeks."
6. SLEEP: 3+ recs with SPECIFIC facial impact. E.g. "Sleep elevated 15-20 degrees — reduces morning facial puffiness by 30-40% by improving lymphatic drainage."
7. NUTRITION (3+): Named foods with specific nutrients and target areas. E.g. "Wild salmon (omega-3 fatty acids) — supports skin barrier function and reduces inflammation, improving overall radiance metric."

If the user has a gender expression preference, tailor ALL grooming/styling recommendations accordingly. Respect their stated direction.

HARMONY BLUEPRINT: Organised by effort (low/moderate/long-term). Each action with estimated gain, timeline, difficulty. Be conservative.

TIMELINE: Clinical milestones at 2 weeks, 1 month, 3 months, 6 months, 12 months.`

export interface AnalysisResponse {
  success: boolean
  analysis?: FacialAnalysis
  error?: string
}

export interface EnrichmentResponse {
  success: boolean
  enrichment?: PremiumEnrichment
  error?: string
}

// ─── CALL 1: Core structural analysis (with images, ~30-60s) ───
export async function analyzeImages(
  images: string[],
  demographics?: Demographics | null
): Promise<AnalysisResponse> {
  try {
    // Only send max 4 images to keep token count manageable
    const imagesToSend = images.slice(0, 4)
    const imageContent: Array<{ type: "image"; image: string }> = imagesToSend.map(img => ({
      type: "image" as const,
      image: img,
    }))

    let demographicContext = ""
    if (demographics) {
      const parts: string[] = []
      if (demographics.ageRange) parts.push(`Age range: ${demographics.ageRange}`)
      if (demographics.gender && demographics.gender !== "prefer-not-to-say") parts.push(`Gender: ${demographics.gender}`)
      if (demographics.ethnicity && demographics.ethnicity !== "prefer-not-to-say") parts.push(`Ethnic background: ${demographics.ethnicity}`)
      if (demographics.primaryConcerns?.length) parts.push(`Primary concerns: ${demographics.primaryConcerns.join(", ")}`)
      if (parts.length > 0) {
        demographicContext = `\n\nDEMOGRAPHIC CONTEXT:\n${parts.join("\n")}\nAdjust proportional norms accordingly. Do NOT soften language or inflate scores.`
      }
    }
    
    const { output } = await generateText({
      model: "openai/gpt-4o",
      temperature: 0,
      seed: 42,
      output: Output.object({
        schema: coreAnalysisSchema
      }),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: CORE_PROMPT + demographicContext },
            ...imageContent,
            { 
              type: "text", 
              text: `Analyse these ${imagesToSend.length} photos. Cross-reference for 3D accuracy. Clinical structural report. Score conservatively. Show real category variance.`
            }
          ]
        }
      ]
    })

    if (!output) {
      return { success: false, error: "Failed to generate analysis" }
    }

    // Return core analysis as FacialAnalysis (premium fields will be undefined)
    return { success: true, analysis: output as FacialAnalysis }
  } catch (error) {
    console.error("Analysis error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return { 
      success: false, 
      error: `Failed to analyse images: ${errorMessage}. Please ensure your photos meet the guidelines and try again.` 
    }
  }
}

// ─── CALL 2: Premium enrichment (text-only, after payment, ~15-25s) ───
export async function generatePremiumEnrichment(
  coreAnalysis: CoreAnalysis
): Promise<EnrichmentResponse> {
  try {
    // Strip the analysis down to a compact JSON summary to minimise tokens
    const analysisSummary = {
      score: coreAnalysis.overallHarmony.score,
      summary: coreAnalysis.overallHarmony.summary,
      deviations: coreAnalysis.overallHarmony.deviationSummary,
      snapshot: coreAnalysis.proportionalSnapshot,
      categoryScores: {
        eyes: coreAnalysis.eyes.overallScore,
        nose: coreAnalysis.nose.overallScore,
        mouth: coreAnalysis.mouth.overallScore,
        structure: coreAnalysis.facialStructure.overallScore,
        proportions: coreAnalysis.proportions.overallScore,
        skin: coreAnalysis.skin.overallScore,
      },
      skinSummary: coreAnalysis.skin.summary,
      skinMetrics: Object.fromEntries(
        Object.entries(coreAnalysis.skin.measurements).map(([k, v]) => [k, { value: v.value, assessment: v.assessment }])
      ),
      expression: coreAnalysis.featureExpression,
      strengths: coreAnalysis.strengths,
      deviationAreas: coreAnalysis.optimizationOpportunities.map(o => ({
        area: o.area, deviation: o.currentDeviation, consequence: o.structuralConsequence, category: o.category
      })),
      quickWins: coreAnalysis.quickWins,
      faceShape: coreAnalysis.facialStructure.measurements.faceShape?.value ?? "oval",
    }

    const { output } = await generateText({
      model: "openai/gpt-4o-mini",
      temperature: 0.1,
      seed: 42,
      output: Output.object({
        schema: premiumEnrichmentSchema
      }),
      messages: [
        {
          role: "system",
          content: ENRICHMENT_PROMPT
        },
        {
          role: "user",
          content: `Here is the core structural analysis data. Generate comprehensive premium recommendations based on these findings:\n\n${JSON.stringify(analysisSummary, null, 1)}`
        }
      ]
    })

    if (!output) {
      return { success: false, error: "Failed to generate premium content" }
    }

    return { success: true, enrichment: output as PremiumEnrichment }
  } catch (error) {
    console.error("Enrichment error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return { success: false, error: `Failed to generate recommendations: ${errorMessage}` }
  }
}
