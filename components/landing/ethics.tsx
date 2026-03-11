import { ShieldCheck, Heart, Brain, Lock } from "lucide-react"

const principles = [
  {
    icon: Heart,
    title: "No Judgment, Only Insight",
    description: "We never imply worth, success, or value based on appearance. Every face has unique harmony."
  },
  {
    icon: Brain,
    title: "Scientific, Not Absolute",
    description: "We present ranges and tendencies, not \"perfect\" standards. Beauty is complex and individual."
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description: "Images are processed and immediately deleted. No storage, no identity matching, no facial database."
  },
  {
    icon: Lock,
    title: "Educational Purpose",
    description: "This tool provides educational insight only. It is not medical advice and not a diagnostic tool."
  }
]

export function Ethics() {
  return (
    <section id="ethics" className="py-24 px-6 bg-foreground text-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
            Our Ethical Commitment
          </h2>
          <p className="text-background/70 text-lg max-w-2xl mx-auto leading-relaxed">
            We believe in responsible AI. Our analysis is designed to educate and empower, never to diminish or rank.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {principles.map((principle) => (
            <div key={principle.title} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-background/10 flex items-center justify-center">
                <principle.icon className="w-6 h-6 text-background" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2 text-background">{principle.title}</h3>
                <p className="text-background/70 text-sm leading-relaxed">
                  {principle.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
