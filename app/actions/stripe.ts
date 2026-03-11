"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS } from "@/lib/products"

export async function startCheckoutSession(analysisId: string) {
  const product = PRODUCTS.find((p) => p.id === "facial-analysis-report")
  if (!product) {
    throw new Error("Product not found")
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      analysisId,
    },
  })

  return session.client_secret
}

export async function verifyPaymentAndUnlock(sessionId: string): Promise<{ 
  success: boolean
  analysisId?: string 
}> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status === "paid" && session.metadata?.analysisId) {
      // Payment is marked in localStorage on the client side
      return { success: true, analysisId: session.metadata.analysisId }
    }
    
    return { success: false }
  } catch (error) {
    console.error("Payment verification error:", error)
    return { success: false }
  }
}
