import { Upload, Cpu, FileText } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Photo",
    description: "Provide a clear, front-facing photo. Optional: add a side profile for comprehensive analysis. We guide you on ideal lighting and positioning."
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Analysis",
    description: "Our system analyses facial proportions, symmetry, and feature relationships using established anatomical frameworks. No identity matching or storage."
  },
  {
    number: "03",
    icon: FileText,
    title: "Receive Your Report",
    description: "Get a detailed breakdown of your facial harmony with strengths, opportunities, and practical recommendations tailored to your unique features."
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            A simple three-step process to understand your facial features better.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-px bg-border -translate-x-1/2" />
              )}
              <div className="text-center">
                <div className="relative mx-auto w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
                  <step.icon className="w-10 h-10 text-foreground" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-foreground text-background text-xs font-medium flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-medium text-xl mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
