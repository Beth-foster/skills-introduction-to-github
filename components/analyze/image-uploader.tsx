"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Upload, X, ChevronRight, Check } from "lucide-react"
import Image from "next/image"

interface ImageUploaderProps {
  onImagesReady: (images: string[]) => void
  isLoading?: boolean
}

const PHOTO_SLOTS = [
  { id: "front-neutral", label: "Front (neutral)", description: "Facing camera, relaxed expression", required: true },
  { id: "front-smile", label: "Front (smile)", description: "Natural, relaxed smile", required: true },
  { id: "left-profile", label: "Left profile", description: "Full side view, left side", required: true },
  { id: "right-profile", label: "Right profile", description: "Full side view, right side", required: true },
  { id: "three-quarter-left", label: "3/4 left", description: "Angled between front and side", required: false },
  { id: "three-quarter-right", label: "3/4 right", description: "Angled between front and side", required: false },
  { id: "slight-up", label: "Slight upward", description: "Chin tilted slightly up", required: false },
  { id: "slight-down", label: "Slight downward", description: "Chin tilted slightly down", required: false },
]

const LOADING_MESSAGES = [
  "Uploading your photos securely...",
  "Mapping facial landmarks across angles...",
  "Cross-referencing proportional ratios...",
  "Analysing bilateral symmetry...",
  "Evaluating feature relationships...",
  "Assessing three-dimensional harmony...",
  "Building your personalised report...",
  "Finalising comprehensive analysis...",
]

export function ImageUploader({ onImagesReady, isLoading }: ImageUploaderProps) {
  const [images, setImages] = useState<Record<string, string>>({})
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])
  const [loadingProgress, setLoadingProgress] = useState(0)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    if (!isLoading) {
      setLoadingMessage(LOADING_MESSAGES[0])
      setLoadingProgress(0)
      return
    }
    let index = 0
    setLoadingMessage(LOADING_MESSAGES[0])
    setLoadingProgress(5)
    const interval = setInterval(() => {
      index = Math.min(index + 1, LOADING_MESSAGES.length - 1)
      setLoadingMessage(LOADING_MESSAGES[index])
      setLoadingProgress(Math.min(((index + 1) / LOADING_MESSAGES.length) * 100, 95))
    }, 5000)
    return () => clearInterval(interval)
  }, [isLoading])

  const compressImage = useCallback((file: File, maxWidth = 640, quality = 0.5): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement("img")
        img.crossOrigin = "anonymous"
        img.onload = () => {
          const canvas = document.createElement("canvas")
          let { width, height } = img
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          if (!ctx) { reject(new Error("Could not get canvas context")); return }
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL("image/jpeg", quality))
        }
        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }, [])

  const handleFileSelect = useCallback(async (slotId: string, file: File) => {
    const compressed = await compressImage(file)
    setImages(prev => ({ ...prev, [slotId]: compressed }))
  }, [compressImage])

  const removeImage = useCallback((slotId: string) => {
    setImages(prev => {
      const next = { ...prev }
      delete next[slotId]
      return next
    })
  }, [])

  // Bulk upload dropzone for adding multiple at once
  const bulkDropzone = useDropzone({
    onDrop: async (files) => {
      const emptySlots = PHOTO_SLOTS.filter(s => !images[s.id])
      const filesToProcess = files.slice(0, emptySlots.length)
      const newImages: Record<string, string> = {}
      for (let i = 0; i < filesToProcess.length; i++) {
        const compressed = await compressImage(filesToProcess[i])
        newImages[emptySlots[i].id] = compressed
      }
      setImages(prev => ({ ...prev, ...newImages }))
    },
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 8,
    disabled: isLoading,
    noClick: true,
  })

  const requiredSlots = PHOTO_SLOTS.filter(s => s.required)
  const optionalSlots = PHOTO_SLOTS.filter(s => !s.required)
  const requiredFilled = requiredSlots.filter(s => images[s.id]).length
  const totalFilled = Object.keys(images).length
  const canAnalyse = requiredFilled >= 4

  const handleAnalyse = () => {
    const orderedImages = PHOTO_SLOTS
      .filter(s => images[s.id])
      .map(s => images[s.id])
    onImagesReady(orderedImages)
  }

  return (
    <div {...bulkDropzone.getRootProps()} className="space-y-6">
      <input {...bulkDropzone.getInputProps()} />

      {/* Progress indicator */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
            canAnalyse ? "bg-chart-2/10 text-chart-2" : "bg-secondary text-muted-foreground"
          }`}>
            {totalFilled}/8
          </div>
          <div>
            <p className="text-sm font-medium">
              {totalFilled === 0
                ? "Upload at least 4 photos to begin"
                : canAnalyse
                  ? `${totalFilled} photo${totalFilled !== 1 ? "s" : ""} uploaded — ready to analyse`
                  : `${requiredFilled}/4 required photos uploaded`}
            </p>
            <p className="text-xs text-muted-foreground">
              {canAnalyse
                ? "More photos improve accuracy. Optional angles add depth."
                : "All 4 required angles needed for a comprehensive analysis"}
            </p>
          </div>
        </div>
        {canAnalyse && !isLoading && (
          <div className="flex items-center gap-1 text-chart-2">
            <Check className="w-4 h-4" />
            <span className="text-xs font-medium">Ready</span>
          </div>
        )}
      </div>

      {/* Required photos */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Required Photos
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {requiredSlots.map(slot => (
            <PhotoSlot
              key={slot.id}
              slot={slot}
              image={images[slot.id]}
              isLoading={isLoading}
              onFileSelect={(file) => handleFileSelect(slot.id, file)}
              onRemove={() => removeImage(slot.id)}
              inputRef={(el) => { fileInputRefs.current[slot.id] = el }}
            />
          ))}
        </div>
      </div>

      {/* Optional photos */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Optional Photos <span className="font-normal">(improve accuracy)</span>
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {optionalSlots.map(slot => (
            <PhotoSlot
              key={slot.id}
              slot={slot}
              image={images[slot.id]}
              isLoading={isLoading}
              onFileSelect={(file) => handleFileSelect(slot.id, file)}
              onRemove={() => removeImage(slot.id)}
              inputRef={(el) => { fileInputRefs.current[slot.id] = el }}
            />
          ))}
        </div>
      </div>

      {/* Loading / Analyse button */}
      {isLoading ? (
        <div className="flex flex-col items-center gap-5 py-4">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{loadingMessage}</span>
              <span className="text-xs text-muted-foreground">{Math.round(loadingProgress)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-sm">
            Our AI is cross-referencing {totalFilled} photo{totalFilled !== 1 ? "s" : ""} across 78+ facial measurements. This typically takes 45-90 seconds.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            className="text-base px-8 py-6"
            onClick={handleAnalyse}
            disabled={!canAnalyse}
          >
            {canAnalyse ? "Begin Analysis" : `Upload ${4 - requiredFilled} more required photo${4 - requiredFilled !== 1 ? "s" : ""}`}
            {canAnalyse && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>

          <p className="text-xs text-muted-foreground text-center max-w-md">
            Your images are processed securely and deleted immediately after analysis.
            We do not store or share your photos.
          </p>
        </div>
      )}
    </div>
  )
}

// Individual photo slot component
function PhotoSlot({
  slot,
  image,
  isLoading,
  onFileSelect,
  onRemove,
  inputRef,
}: {
  slot: typeof PHOTO_SLOTS[number]
  image?: string
  isLoading?: boolean
  onFileSelect: (file: File) => void
  onRemove: () => void
  inputRef: (el: HTMLInputElement | null) => void
}) {
  const handleClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/jpeg,image/jpg,image/png,image/webp"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) onFileSelect(file)
    }
    input.click()
  }

  return (
    <div className="flex flex-col gap-1.5">
      {image ? (
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary group">
          <Image
            src={image}
            alt={slot.label}
            fill
            className="object-cover"
          />
          {!isLoading && (
            <button
              onClick={onRemove}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <p className="text-[10px] text-white font-medium truncate">{slot.label}</p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className="aspect-[3/4] rounded-lg border-2 border-dashed border-border hover:border-muted-foreground hover:bg-secondary/50 flex flex-col items-center justify-center cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-5 h-5 text-muted-foreground mb-1.5" />
          <p className="text-[11px] text-muted-foreground font-medium px-2 text-center">{slot.label}</p>
        </button>
      )}
      <div className="flex items-center gap-1">
        {slot.required && <span className="w-1 h-1 rounded-full bg-foreground flex-shrink-0" />}
        <p className="text-[10px] text-muted-foreground truncate">{slot.description}</p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" />
    </div>
  )
}
