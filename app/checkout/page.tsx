import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, Shield, Lock, CreditCard } from "lucide-react"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { PRODUCTS } from "@/lib/products"

interface CheckoutPageProps {
  searchParams: Promise<{ analysisId?: string }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { analysisId } = await searchParams
  
  if (!analysisId) {
    redirect("/")
  }

  const product = PRODUCTS.find((p) => p.id === "facial-analysis-report")

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link 
          href={`/quick-wins/${analysisId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quick Wins
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div>
            <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-6">
              Complete Your Purchase
            </h1>
            
            <div className="p-6 rounded-lg bg-secondary/50 border border-border mb-6">
              <h2 className="font-medium text-lg mb-2">{product?.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {product?.description}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-medium">
                  {'£'}{((product?.priceInCents ?? 0) / 100).toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">one-time</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">
                    Your payment is processed securely by Stripe
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">Instant Access</p>
                  <p className="text-xs text-muted-foreground">
                    Your full report unlocks immediately after payment
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">One-Time Purchase</p>
                  <p className="text-xs text-muted-foreground">
                    No subscription, no recurring charges
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stripe Checkout */}
          <div className="bg-card rounded-lg border border-border p-6">
            <CheckoutForm analysisId={analysisId} />
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-12 max-w-2xl mx-auto">
          By completing this purchase, you agree that this analysis is for educational purposes only 
          and does not constitute medical advice. Results are based on AI analysis and should be 
          interpreted as general guidance.
        </p>
      </div>
    </main>
  )
}
