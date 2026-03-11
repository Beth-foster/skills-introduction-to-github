import { z } from "zod"

// Demographic context for personalised analysis
export const demographicSchema = z.object({
  ageRange: z.enum(["18-24", "25-34", "35-44", "45-54", "55+"]).nullable(),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"]).nullable(),
  ethnicity: z.enum([
    "east-asian", "south-asian", "southeast-asian", "middle-eastern",
    "african", "european", "latin-american", "mixed", "prefer-not-to-say"
  ]).nullable(),
  primaryConcerns: z.array(z.string()).nullable()
})

export type Demographics = z.infer<typeof demographicSchema>

// Individual measurement schema
const measurementSchema = z.object({
  value: z.string().describe("Measured value, ratio, or percentage with ideal range reference"),
  assessment: z.enum(["within-tolerance", "slight-deviation", "moderate-deviation", "notable-deviation"]),
  explanation: z.string().describe("Clinical explanation: what was measured, deviation from ideal range, structural consequence, and interaction with adjacent features")
})

// ─── CORE ANALYSIS SCHEMA (Call 1 — vision model, fast) ───
// This is what runs on photo upload. It does the actual visual analysis.

export const coreAnalysisSchema = z.object({
  overallHarmony: z.object({
    score: z.number().min(0).max(100).describe("Overall harmony score 0-100. Most faces score 65-78. Above 82 is rare."),
    summary: z.string().describe("2-3 sentence clinical summary: proportional consistency, primary deviations, structural balance. No compliments."),
    structuralBalanceIndex: z.number().min(0).max(100),
    expressiveWarmthIndex: z.number().min(0).max(100),
    definitionVsSoftnessIndex: z.number().min(0).max(100),
    deviationSummary: z.array(z.object({
      metric: z.string(),
      deviation: z.string()
    })).min(4).max(6)
  }),

  proportionalSnapshot: z.object({
    facialThirds: z.object({
      upper: z.number(),
      middle: z.number(),
      lower: z.number(),
      assessment: z.string()
    }),
    facialFifths: z.object({
      balanced: z.boolean(),
      assessment: z.string()
    }),
    symmetryIndex: z.object({
      percentage: z.number().min(0).max(100),
      assessment: z.string()
    })
  }),

  // 6 measurement categories — these require vision
  eyes: z.object({
    overallScore: z.number().min(0).max(100),
    measurements: z.object({
      canthalTilt: measurementSchema,
      palpebralFissureWidth: measurementSchema,
      palpebralFissureHeight: measurementSchema,
      upperEyelidExposure: measurementSchema,
      lowerEyelidPosition: measurementSchema,
      scleralShow: measurementSchema,
      eyeSpacingRatio: measurementSchema,
      limbalRingVisibility: measurementSchema,
      irisSize: measurementSchema,
      eyebrowDistance: measurementSchema,
      eyebrowShape: measurementSchema,
      eyebrowThickness: measurementSchema,
      eyeSymmetry: measurementSchema,
      medialCanthus: measurementSchema,
      lateralCanthus: measurementSchema,
      orbitalRim: measurementSchema,
      periorbitalArea: measurementSchema,
      eyeProtrusion: measurementSchema
    }),
    summary: z.string()
  }),

  nose: z.object({
    overallScore: z.number().min(0).max(100),
    measurements: z.object({
      nasofrontalAngle: measurementSchema,
      nasalBridgeWidth: measurementSchema,
      nasalBridgeHeight: measurementSchema,
      dorsalProfile: measurementSchema,
      nasalTipProjection: measurementSchema,
      nasalTipRotation: measurementSchema,
      nasalTipDefinition: measurementSchema,
      alarBaseWidth: measurementSchema,
      alarFlare: measurementSchema,
      nostrilShape: measurementSchema,
      nostrilShow: measurementSchema,
      columellaShow: measurementSchema,
      nasolabialAngle: measurementSchema,
      nasalSymmetry: measurementSchema
    }),
    summary: z.string()
  }),

  mouth: z.object({
    overallScore: z.number().min(0).max(100),
    measurements: z.object({
      upperLipVolume: measurementSchema,
      lowerLipVolume: measurementSchema,
      vermilionRatio: measurementSchema,
      lipWidth: measurementSchema,
      cupidsBow: measurementSchema,
      philtrumLength: measurementSchema,
      philtrumWidth: measurementSchema,
      philtrumDefinition: measurementSchema,
      oralCommissures: measurementSchema,
      dentalShow: measurementSchema,
      lipSymmetry: measurementSchema,
      lipProjection: measurementSchema
    }),
    summary: z.string()
  }),

  facialStructure: z.object({
    overallScore: z.number().min(0).max(100),
    measurements: z.object({
      facialWidth: measurementSchema,
      facialLength: measurementSchema,
      faceShape: measurementSchema,
      cheekboneProminence: measurementSchema,
      cheekboneWidth: measurementSchema,
      cheekboneHeight: measurementSchema,
      midfaceProjection: measurementSchema,
      midfaceRatio: measurementSchema,
      bigonialWidth: measurementSchema,
      mandibularAngle: measurementSchema,
      jawlineDefinition: measurementSchema,
      jawlineContour: measurementSchema,
      chinProjection: measurementSchema,
      chinHeight: measurementSchema,
      chinWidth: measurementSchema,
      facialConvexity: measurementSchema
    }),
    summary: z.string()
  }),

  proportions: z.object({
    overallScore: z.number().min(0).max(100),
    measurements: z.object({
      facialThirdsUpper: measurementSchema,
      facialThirdsMiddle: measurementSchema,
      facialThirdsLower: measurementSchema,
      facialFifths: measurementSchema,
      goldenRatioAdherence: measurementSchema,
      verticalSymmetry: measurementSchema,
      horizontalSymmetry: measurementSchema,
      profileBalance: measurementSchema,
      facialIndex: measurementSchema,
      interocularDistance: measurementSchema
    }),
    summary: z.string()
  }),

  skin: z.object({
    overallScore: z.number().min(0).max(100),
    measurements: z.object({
      textureUniformity: measurementSchema,
      poreVisibility: measurementSchema,
      toneEvenness: measurementSchema,
      clarityScore: measurementSchema,
      underEyeArea: measurementSchema,
      hydrationAppearance: measurementSchema,
      lineAndWrinkles: measurementSchema,
      overallRadiance: measurementSchema
    }),
    summary: z.string()
  }),

  // Feature relationships — requires vision
  featureRelationships: z.array(z.object({
    featureA: z.string(),
    featureB: z.string(),
    relationship: z.string(),
    impact: z.enum(["positive", "neutral", "slight-tension"]),
    suggestion: z.string()
  })).min(4).max(6),

  // Expression indices — requires vision
  featureExpression: z.object({
    masculineFeminineScale: z.number().min(0).max(100).describe("0=structurally masculine, 100=structurally feminine. Based ONLY on bone structure, brow ridge, jaw angle, cheekbone height — not clothing/hair/makeup"),
    softnessIndex: z.number().min(0).max(100).describe("How rounded and soft the facial contours read — based on jawline curvature, cheek fullness, brow arch"),
    definitionIndex: z.number().min(0).max(100).describe("How angular and defined the structure reads — based on jawline sharpness, cheekbone prominence, brow ridge"),
    warmthIndex: z.number().min(0).max(100).describe("How approachable the face reads structurally — based on eye size, lip fullness, facial width, smile lines"),
    intensityIndex: z.number().min(0).max(100).describe("How striking or commanding the face reads — based on contrast ratio, eye depth, brow prominence, cheekbone projection"),
    analysis: z.string().describe("2-3 sentence clinical explanation of the overall expression profile. Reference specific structural features that drive each index. e.g. 'The prominent brow ridge and angular jawline drive the definition index higher, while full lips and wide-set eyes contribute warmth.'"),
    dominantTraits: z.array(z.string()).describe("Top 3-4 structural trait labels e.g. 'Defined jawline', 'Full mid-face', 'High brow arch', 'Deep-set eyes'"),
    facialArchetype: z.string().describe("e.g. 'Balanced Expressive', 'Soft Classic', 'Defined Modern', 'Warm Natural'"),
    perIndexExplanations: z.object({
      masculineFeminine: z.string().describe("Explain which SPECIFIC structural features drive this reading. e.g. 'Strong brow ridge (+15), wide jaw (+12), but full lips (-8) create a mixed reading at 38/100.'"),
      softness: z.string().describe("What creates the softness reading in THIS face"),
      definition: z.string().describe("What creates the definition reading in THIS face"),
      warmth: z.string().describe("What creates the warmth reading in THIS face"),
      intensity: z.string().describe("What creates the intensity reading in THIS face")
    }),
    genderExpressionNote: z.string().describe("A respectful note: 'This scale measures structural morphology only, not gender identity. Features can be enhanced toward any aesthetic preference regardless of biological markers.'")
  }),

  // Quick wins — 3 diagnostic items (vision-dependent)
  quickWins: z.array(z.object({
    feature: z.string(),
    currentMeasurement: z.string(),
    idealRange: z.string(),
    impactOnHarmony: z.string(),
    improvementOptions: z.array(z.string()).min(2).max(3),
    projectedGain: z.string(),
    honestLimitation: z.string()
  })).min(3).max(3),

  // Strengths
  strengths: z.array(z.object({
    feature: z.string(),
    deviation: z.string(),
    explanation: z.string()
  })).min(4).max(6),

  // Measurable deviation areas
  optimizationOpportunities: z.array(z.object({
    area: z.string(),
    currentDeviation: z.string(),
    structuralConsequence: z.string(),
    explanation: z.string(),
    category: z.enum(["grooming", "skincare", "hair", "lifestyle", "presentation", "optional_aesthetic"]),
    priority: z.enum(["high", "medium", "low"]),
    difficulty: z.enum(["easy", "moderate", "advanced"]),
    estimatedTimeline: z.string(),
    projectedHarmonyGain: z.string(),
    limitation: z.string()
  })).min(5).max(8),

  disclaimer: z.string()
})

export type CoreAnalysis = z.infer<typeof coreAnalysisSchema>


// ─── PREMIUM ENRICHMENT SCHEMA (Call 2 — text model, after purchase) ───
// This runs AFTER payment. No images needed — it uses the core analysis JSON as input.

const skinRecommendationSchema = z.object({
  amRoutine: z.array(z.string()).min(2).max(4),
  pmRoutine: z.array(z.string()).min(2).max(4),
  keyIngredients: z.array(z.string()).min(2).max(5),
  ingredientRationale: z.string(),
  lifestyleFactors: z.array(z.string()).min(2).max(4),
  avoidList: z.array(z.string()).min(1).max(3),
  timeToResult: z.string()
})

export const premiumEnrichmentSchema = z.object({
  // Skin deep-dive recommendations
  skinDeepRecommendations: z.object({
    textureUniformity: skinRecommendationSchema,
    poreVisibility: skinRecommendationSchema,
    toneEvenness: skinRecommendationSchema,
    clarityScore: skinRecommendationSchema,
    underEyeArea: skinRecommendationSchema,
    hydrationAppearance: skinRecommendationSchema,
    lineAndWrinkles: skinRecommendationSchema,
    overallRadiance: skinRecommendationSchema
  }),

  // Comprehensive recommendations
  recommendations: z.object({
    grooming: z.array(z.object({
      recommendation: z.string(),
      rationale: z.string(),
      products: z.array(z.string()),
      timeline: z.string()
    })).min(3),
    skincare: z.array(z.object({
      recommendation: z.string(),
      rationale: z.string(),
      ingredients: z.array(z.string()),
      timeline: z.string()
    })).min(3),
    hair: z.array(z.object({
      recommendation: z.string(),
      rationale: z.string(),
      stylingTips: z.array(z.string()),
      timeline: z.string()
    })).min(3),
    lifestyle: z.array(z.object({
      recommendation: z.string(),
      rationale: z.string(),
      frequency: z.string(),
      timeline: z.string()
    })).min(3),
    optionalAesthetic: z.array(z.object({
      procedure: z.string(),
      whatItAddresses: z.string(),
      considerations: z.string(),
      recoveryTime: z.string(),
      permanence: z.enum(["temporary", "semi-permanent", "permanent"])
    }))
  }),

  // Cosmetic & lifestyle recommendations
  cosmeticRecommendations: z.object({
    hairStyling: z.array(z.object({
      recommendation: z.string(),
      rationale: z.string(),
      specificStyles: z.array(z.string()).min(2),
      avoidStyles: z.array(z.string()).min(1),
      productTypes: z.array(z.string())
    })).min(3),
    facialHairOrMakeup: z.array(z.object({
      recommendation: z.string(),
      rationale: z.string(),
      techniques: z.array(z.string()).min(2),
      productTypes: z.array(z.string())
    })).min(2),
    eyebrowOptimisation: z.object({
      currentAssessment: z.string(),
      idealShape: z.string(),
      groomingSteps: z.array(z.string()).min(2),
      rationale: z.string()
    }),
    colourAnalysis: z.object({
      undertone: z.string(),
      bestColours: z.array(z.string()).min(3),
      avoidColours: z.array(z.string()).min(2),
      contrastLevel: z.string(),
      rationale: z.string()
    }),
    lifestyleHabits: z.array(z.object({
      habit: z.string(),
      impactArea: z.string(),
      explanation: z.string(),
      frequency: z.string()
    })).min(4),
    sleepAndRecovery: z.object({
      recommendations: z.array(z.string()).min(3),
      impactOnFace: z.string()
    }),
    nutrition: z.array(z.object({
      recommendation: z.string(),
      targetArea: z.string(),
      foods: z.array(z.string()).min(2),
      rationale: z.string()
    })).min(3)
  }),

  // Harmony blueprint
  harmonyBlueprint: z.object({
    lowEffortHighReturn: z.array(z.object({
      action: z.string(),
      estimatedGain: z.string(),
      timeline: z.string(),
      difficulty: z.string()
    })).min(3),
    moderateAdjustment: z.array(z.object({
      action: z.string(),
      estimatedGain: z.string(),
      timeline: z.string(),
      difficulty: z.string()
    })).min(2),
    longTermStructural: z.array(z.object({
      action: z.string(),
      estimatedGain: z.string(),
      timeline: z.string(),
      difficulty: z.string()
    })).min(1)
  }),

  // Transformation timeline
  transformationTimeline: z.object({
    twoWeeks: z.array(z.string()),
    oneMonth: z.array(z.string()),
    threeMonths: z.array(z.string()),
    sixMonths: z.array(z.string()),
    twelveMonths: z.array(z.string())
  })
})

export type PremiumEnrichment = z.infer<typeof premiumEnrichmentSchema>

// Combined type for backwards compatibility
export type FacialAnalysis = CoreAnalysis & {
  skin: CoreAnalysis["skin"] & { deepRecommendations?: PremiumEnrichment["skinDeepRecommendations"] }
  recommendations?: PremiumEnrichment["recommendations"]
  cosmeticRecommendations?: PremiumEnrichment["cosmeticRecommendations"]
  harmonyBlueprint?: PremiumEnrichment["harmonyBlueprint"]
  transformationTimeline?: PremiumEnrichment["transformationTimeline"]
}

export interface AnalysisResult {
  id: string
  analysis: FacialAnalysis
  createdAt: string
  isPaid: boolean
}
