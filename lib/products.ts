export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

export const PRODUCTS: Product[] = [
  {
    id: "facial-analysis-report",
    name: "Axiva Full Analysis Report",
    description: "Complete facial harmony analysis with detailed insights, feature breakdowns, and personalized recommendations for grooming, skincare, hair, and presentation.",
    priceInCents: 699, // £6.99
  },
]
