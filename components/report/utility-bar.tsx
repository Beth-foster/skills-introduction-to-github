"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Printer, Download, Share2, Check, LinkIcon } from "lucide-react"

interface UtilityBarProps {
  reportId: string
}

export function UtilityBar({ reportId }: UtilityBarProps) {
  const [copied, setCopied] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handlePrint = () => {
    window.open(`/report/${reportId}/print`, "_blank")
  }

  const handleExportPdf = async () => {
    // Open print page which user can save as PDF via browser print dialog
    const printWindow = window.open(`/report/${reportId}/print`, "_blank")
    if (printWindow) {
      printWindow.onafterprint = () => printWindow.close()
      setTimeout(() => printWindow.print(), 1000)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <>
      {/* Floating utility bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 print:hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-lg backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
            className="gap-2 text-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </Button>

          <div className="w-px h-5 bg-border" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportPdf}
            className="gap-2 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>

          <div className="w-px h-5 bg-border" />

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="gap-2 text-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>

            {showShareMenu && (
              <div className="absolute bottom-full mb-2 right-0 w-48 rounded-lg bg-card border border-border shadow-xl p-2">
                <button
                  onClick={() => {
                    handleCopyLink()
                    setShowShareMenu(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs rounded-md hover:bg-secondary transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <LinkIcon className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
