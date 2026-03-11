"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
            <span className="text-background font-serif text-sm font-semibold">X</span>
          </div>
          <span className="font-serif text-xl tracking-tight">Axiva</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#methodology" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Methodology
          </Link>
          <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Link href="#ethics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Ethics
          </Link>
        </nav>

        <Button asChild>
          <Link href="/analyze">Begin Analysis</Link>
        </Button>
      </div>
    </header>
  )
}
