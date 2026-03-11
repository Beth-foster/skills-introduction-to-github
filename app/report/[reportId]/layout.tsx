import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Structural Analysis Report | Axiva",
  description: "Complete facial harmony structural analysis with 78+ proportional measurements.",
}

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
