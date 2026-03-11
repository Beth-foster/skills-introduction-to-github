import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="font-serif text-4xl tracking-tight mb-2">{'Terms & Conditions'}</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: 06/02/2026</p>
        
        <div className="prose prose-neutral max-w-none space-y-8 text-muted-foreground">
          <p className="leading-relaxed">
            {'Axiva ("Axiva", "we", "us", "our") is a UK-based AI facial analysis platform available at '}
            <a href="https://www.axiva.co.uk" className="text-foreground underline underline-offset-4 hover:text-foreground/80">www.axiva.co.uk</a>.
            {' Axiva provides AI-generated aesthetic and facial analysis intended for informational and educational purposes only. Axiva does not provide medical, cosmetic, psychological, or clinical advice.'}
          </p>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing or using Axiva (including browsing, uploading images, creating an account, or purchasing reports), you agree to these Terms {'&'} Conditions. If you do not agree, you must not use the Services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">Eligibility</h2>
            <p className="leading-relaxed mb-2">You must:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">Be 18 years or older</li>
              <li className="leading-relaxed">Have legal capacity to enter into this agreement</li>
            </ul>
            <p className="leading-relaxed mt-2">Axiva is not intended for children.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">{'Nature & Scope of the Service'}</h2>
            <p className="leading-relaxed mb-3">
              Axiva uses artificial intelligence to analyse user-submitted images and inputs to generate facial insights and reports. You acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">AI outputs are not guaranteed to be accurate</li>
              <li className="leading-relaxed">Outputs may vary between analyses</li>
              <li className="leading-relaxed">Results are interpretive and probabilistic, not factual assessments</li>
              <li className="leading-relaxed">Axiva does not promise specific outcomes, improvements, or results</li>
              <li className="leading-relaxed">All use is at your own discretion and risk</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">{'Accounts & User Profiles'}</h2>
            <p className="leading-relaxed mb-2">You may:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">Browse the site without an account</li>
              <li className="leading-relaxed">Subscribe to the newsletter without an account</li>
              <li className="leading-relaxed">Create a user account to store analyses and reports</li>
            </ul>
            <p className="leading-relaxed mt-3 mb-2">When you create an account:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">Your personal data is stored securely</li>
              <li className="leading-relaxed">Your analysis history is linked to your profile</li>
              <li className="leading-relaxed">Your data remains stored until you delete it or request deletion</li>
            </ul>
            <p className="leading-relaxed mt-2">You are responsible for safeguarding your login credentials.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">{'Uploaded Images & User Control'}</h2>
            <h3 className="text-base font-medium text-foreground mb-2">Image Upload Rules</h3>
            <p className="leading-relaxed mb-2">By uploading images, you confirm:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">The images are of yourself</li>
              <li className="leading-relaxed">You have the legal right to upload them</li>
              <li className="leading-relaxed">You provide explicit consent for Axiva to process them</li>
            </ul>
            <h3 className="text-base font-medium text-foreground mt-4 mb-2">Image Deletion</h3>
            <p className="leading-relaxed mb-2">You may:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">Delete individual images at any time</li>
              <li className="leading-relaxed">Delete all images by deleting your account</li>
            </ul>
            <p className="leading-relaxed mt-3 mb-2">You acknowledge that:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">Removing images may impact analysis quality</li>
              <li className="leading-relaxed">Reduced input data may affect accuracy, completeness, or consistency of results</li>
              <li className="leading-relaxed">Axiva is not responsible for degraded outputs caused by user-initiated deletions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">{'AI Outputs, Regeneration & Caching'}</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">Analysis results are generated dynamically at the time of request</li>
              <li className="leading-relaxed">Results may differ between sessions, even with similar inputs</li>
            </ul>
            <p className="leading-relaxed mt-3 mb-2">As Axiva evolves:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">Certain outputs or intermediate data may be cached to improve performance and user experience</li>
              <li className="leading-relaxed">Cached data will only be used to deliver Axiva services</li>
              <li className="leading-relaxed">Cached data will remain subject to deletion upon user request or account removal</li>
            </ul>
            <p className="leading-relaxed mt-2">Axiva will not permanently retain facial data without a lawful basis and user consent.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">{'Paid Features & Upgrades'}</h2>
            <p className="leading-relaxed mb-3">Axiva offers paid upgrades, including enhanced or full analysis reports.</p>
            <h3 className="text-base font-medium text-foreground mb-2">Payments</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">Fees are clearly displayed before purchase</li>
              <li className="leading-relaxed">Payments are processed via a secure third-party provider</li>
              <li className="leading-relaxed">Prices may change over time</li>
            </ul>
            <h3 className="text-base font-medium text-foreground mt-4 mb-2">Digital Services</h3>
            <p className="leading-relaxed mb-2">You acknowledge that:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">Paid reports are digital services</li>
              <li className="leading-relaxed">Once analysis is delivered, refunds may not be available unless required by law</li>
              <li className="leading-relaxed">Nothing in these terms limits statutory consumer rights under UK law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">Acceptable Use</h2>
            <p className="leading-relaxed mb-2">You must not:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">Upload images of others without consent</li>
              <li className="leading-relaxed">Attempt to identify or profile third parties</li>
              <li className="leading-relaxed">Reverse-engineer the AI system</li>
              <li className="leading-relaxed">Use Axiva for unlawful, abusive, or deceptive purposes</li>
            </ul>
            <p className="leading-relaxed mt-2">We reserve the right to suspend or terminate access for misuse.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">Axiva retains all rights to its platform, software, models, branding, and outputs</li>
              <li className="leading-relaxed">You retain ownership of your personal data and uploaded content</li>
              <li className="leading-relaxed">You grant Axiva a limited, revocable licence to process your content solely to provide the Services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">Communications</h2>
            <p className="leading-relaxed">
              By subscribing to the Axiva newsletter, you agree to receive platform-related communications. You can unsubscribe at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">Limitation of Liability</h2>
            <p className="leading-relaxed mb-2">To the fullest extent permitted by law:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">{'Axiva is provided "as is"'}</li>
              <li className="leading-relaxed">We are not liable for decisions made based on AI outputs</li>
              <li className="leading-relaxed">We are not responsible for dissatisfaction resulting from subjective interpretation</li>
              <li className="leading-relaxed">Nothing excludes liability where prohibited by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">{'Termination & Deletion'}</h2>
            <p className="leading-relaxed mb-2">If you sign up with an account, you may:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">Delete your uploads and account at any time</li>
              <li className="leading-relaxed">Request deletion of your data</li>
            </ul>
            <p className="leading-relaxed mt-3 mb-2">Upon deletion:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li className="leading-relaxed">Personal data and images are removed within a reasonable timeframe</li>
              <li className="leading-relaxed">Some records may be retained where legally required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">Governing Law</h2>
            <p className="leading-relaxed">
              These Terms are governed by English law. UK courts have exclusive jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">Contact</h2>
            <p className="leading-relaxed">
              <a href="mailto:Support@axiva.co.uk" className="text-foreground underline underline-offset-4 hover:text-foreground/80">
                Support@axiva.co.uk
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
