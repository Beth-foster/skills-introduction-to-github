export interface ReportMetric {
  id: string
  name: string
  yourValue: number
  unit: string
  idealMin: number
  idealMax: number
  deviationPct: number
  impactWeight: "Low" | "Medium" | "High"
  changeability: "Low" | "Medium" | "High"
  explanation: string
  levers: string[]
}

export interface ReportCategory {
  name: string
  score: number
  weight: number
}

export interface DeviationItem {
  metric: string
  deviationPct: number
  impact: "Low" | "Medium" | "High"
}

export interface ThirdsData {
  upper: number
  mid: number
  lower: number
  idealRange: [number, number]
}

export interface FifthsData {
  segments: number[]
  idealRange: [number, number]
}

export interface SymmetryItem {
  area: string
  deviationPct: number
}

export interface RelationshipItem {
  pair: string
  yourRatio: number
  idealMin: number
  idealMax: number
  impact: string
  explanation: string
  levers: string[]
}

export interface SkinIndexItem {
  category: string
  score: number
  explanation: string
  recommendations: string[]
  timeToResult: string
  amRoutine?: string[]
  pmRoutine?: string[]
  keyIngredients?: string[]
  ingredientRationale?: string
  lifestyleFactors?: string[]
  avoidList?: string[]
}

export interface CosmeticRecommendations {
  hairStyling: Array<{
    recommendation: string
    rationale: string
    specificStyles: string[]
    avoidStyles: string[]
    productTypes: string[]
  }>
  facialHairOrMakeup: Array<{
    recommendation: string
    rationale: string
    techniques: string[]
    productTypes: string[]
  }>
  eyebrowOptimisation: {
    currentAssessment: string
    idealShape: string
    groomingSteps: string[]
    rationale: string
  }
  colourAnalysis: {
    undertone: string
    bestColours: string[]
    avoidColours: string[]
    contrastLevel: string
    rationale: string
  }
  lifestyleHabits: Array<{
    habit: string
    impactArea: string
    explanation: string
    frequency: string
  }>
  sleepAndRecovery: {
    recommendations: string[]
    impactOnFace: string
  }
  nutrition: Array<{
    recommendation: string
    targetArea: string
    foods: string[]
    rationale: string
  }>
}

export interface ExpressionIndex {
  name: string
  value: number
  explanation: string
  detailedExplanation: string
  leftLabel: string
  rightLabel: string
  whatItMeans: string
}

export interface ExpressionProfile {
  indices: ExpressionIndex[]
  archetype: string
  analysis: string
  dominantTraits: string[]
  genderExpressionNote: string
}

export interface RecommendationStep {
  action: string
  detail: string
  productTypes?: string[]
}

export interface Recommendation {
  id: string
  title: string
  category: string
  difficulty: "Easy" | "Moderate" | "Advanced"
  timeline: string
  expectedImpact: number
  steps: RecommendationStep[]
  rationale: string
  relatedMetrics: Array<{ name: string; currentValue: string; idealRange: string }>
  currentDeviation: string
  projectedScoreAfter: number
  limitation: string
  source: "blueprint" | "optimisation" | "cosmetic"
}

export interface ReportData {
  reportId: string
  createdAt: string
  version: string
  confidenceScore: number
  overallScore: number
  categories: ReportCategory[]
  deviationSummary: DeviationItem[]
  thirds: ThirdsData
  fifths: FifthsData
  symmetry: SymmetryItem[]
  relationships: RelationshipItem[]
  skinIndex: SkinIndexItem[]
  expressionIndices: ExpressionIndex[]
  expressionProfile?: ExpressionProfile
  metrics: ReportMetric[]
  recommendations: Recommendation[]
  cosmeticRecommendations?: CosmeticRecommendations
}
