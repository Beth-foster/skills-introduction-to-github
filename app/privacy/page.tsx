import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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

        <h1 className="font-serif text-4xl tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: 09/02/2026</p>
        
        <div className="prose prose-neutral max-w-none space-y-8 text-muted-foreground">
          <p className="leading-relaxed text-foreground/80">
            Axiva respects your privacy and complies with the UK GDPR and Data Protection Act 2018.
          </p>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">The Data We Collect</h2>
            
            <h3 className="text-base font-medium text-foreground mb-2">A. Data You Provide</h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Email address</li>
              <li>Account credentials</li>
              <li>Personal background information (ethnic background, etc.)</li>
              <li>Facial images (optional)</li>
              <li>Analysis preferences</li>
            </ul>

            <h3 className="text-base font-medium text-foreground mb-2">B. Automatically Collected Data</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Device and browser information</li>
              <li>IP address (anonymised where possible)</li>
              <li>Usage and performance analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">Facial Images and Sensitive Data</h2>
            <p className="leading-relaxed mb-3">
              Facial images are treated as high-sensitivity personal data. We process facial images:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Only with your explicit consent</li>
              <li>Only to deliver AI facial analysis</li>
              <li>Only for your personal use</li>
            </ul>
            <p className="leading-relaxed mb-2">We do not:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Sell facial data</li>
              <li>Use images for advertising</li>
              <li>Perform identity verification</li>
              <li>Train external third-party AI systems with identifiable data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">How We Use Your Data</h2>
            <p className="leading-relaxed mb-3">Your data is used to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Generate facial analysis and reports</li>
              <li>Save your results (if you opt in)</li>
              <li>Process payments</li>
              <li>Improve service quality</li>
              <li>Communicate platform updates</li>
              <li>Maintain system security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">Data Retention</h2>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li><strong>Newsletter data:</strong> retained until unsubscribed</li>
              <li><strong>Account data:</strong> retained until account deletion</li>
              <li><strong>Images:</strong> retained only while linked to your account or cached for service delivery</li>
            </ul>
            <p className="leading-relaxed">You may request deletion at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">AI Processing and Future Caching</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Analysis is currently performed in real time</li>
              <li>In future, limited caching may occur to enhance performance</li>
              <li>Cached data remains governed by this Privacy Policy</li>
              <li>Cached data will be deleted upon user request or account deletion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">Your Rights</h2>
            <p className="leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Access your data</li>
              <li>Correct inaccuracies</li>
              <li>Delete your data</li>
              <li>Withdraw consent</li>
              <li>Export your data</li>
              <li>Object to certain processing</li>
            </ul>
            <p className="leading-relaxed">
              Requests: <a href="mailto:support@axiva.co.uk" className="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors">support@axiva.co.uk</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">Data Sharing</h2>
            <p className="leading-relaxed mb-3">
              We do not sell personal data. We may share limited data with:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Secure hosting providers</li>
              <li>Payment processors</li>
              <li>Analytics tools (aggregated/anonymised)</li>
            </ul>
            <p className="leading-relaxed">All partners are GDPR-compliant.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">Security Measures</h2>
            <p className="leading-relaxed mb-3">We implement:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Encryption at rest and in transit</li>
              <li>Role-based access controls</li>
              <li>Regular monitoring and audits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">International Transfers</h2>
            <p className="leading-relaxed">
              Where data is processed outside the UK/EU, appropriate safeguards are applied where possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">Policy Updates</h2>
            <p className="leading-relaxed">
              We may update this policy. Material changes will be clearly communicated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-foreground mb-4">Contact</h2>
            <p className="leading-relaxed">
              <a href="mailto:support@axiva.co.uk" className="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors">support@axiva.co.uk</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
