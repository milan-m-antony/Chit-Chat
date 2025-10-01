"use client"

import { useCallback, useState, useEffect } from "react"
import { CircleCheckIcon, CircleXIcon, InfoIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useProgressTimer } from "@/hooks/use-toast"

export interface ToastData {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "error" | "info"
  duration?: number
}

let toastCounter = 0
const listeners = new Set<(toast: ToastData) => void>()

export function showToast(toast: Omit<ToastData, "id">) {
  const id = `toast-${++toastCounter}`
  const toastData: ToastData = { id, ...toast }
  listeners.forEach((listener) => listener(toastData))
}

export function toast(message: string, options?: Partial<ToastData>) {
  showToast({
    title: message,
    variant: "default",
    duration: 5000,
    ...options,
  })
}

toast.success = (message: string, options?: Partial<ToastData>) => {
  showToast({
    title: message,
    variant: "success",
    duration: 5000,
    ...options,
  })
}

toast.error = (message: string, options?: Partial<ToastData>) => {
  showToast({
    title: message,
    variant: "error",
    duration: 5000,
    ...options,
  })
}

toast.info = (message: string, options?: Partial<ToastData>) => {
  showToast({
    title: message,
    variant: "info",
    duration: 5000,
    ...options,
  })
}

function ToastItem({ toast: toastData }: { toast: ToastData }) {
  const [open, setOpen] = useState(true)
  const toastDuration = toastData.duration || 5000
  const { progress, start, pause, resume, reset } = useProgressTimer({
    duration: toastDuration,
    onComplete: () => setOpen(false),
  })

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen)
      if (isOpen) {
        reset()
        start()
      }
    },
    [reset, start]
  )

  // Start timer on mount
  useEffect(() => {
    start()
  }, [start])

  const getIcon = () => {
    switch (toastData.variant) {
      case "success":
        return <CircleCheckIcon className="mt-0.5 shrink-0 text-emerald-500" size={16} />
      case "error":
        return <CircleXIcon className="mt-0.5 shrink-0 text-destructive" size={16} />
      case "info":
        return <InfoIcon className="mt-0.5 shrink-0 text-primary" size={16} />
      default:
        return <InfoIcon className="mt-0.5 shrink-0 text-foreground" size={16} />
    }
  }

  const getProgressColor = () => {
    switch (toastData.variant) {
      case "success":
        return "bg-emerald-500"
      case "error":
        return "bg-destructive"
      case "info":
        return "bg-primary"
      default:
        return "bg-primary"
    }
  }

  return (
    <Toast
      open={open}
      onOpenChange={handleOpenChange}
      onPause={pause}
      onResume={resume}
    >
      <div className="flex w-full justify-between gap-3">
        {getIcon()}
        <div className="flex grow flex-col gap-1">
          <ToastTitle>{toastData.title}</ToastTitle>
          {toastData.description && (
            <ToastDescription>{toastData.description}</ToastDescription>
          )}
        </div>
        <ToastClose asChild>
          <Button
            variant="ghost"
            className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
            aria-label="Close notification"
          >
            <XIcon
              size={16}
              className="opacity-60 transition-opacity group-hover:opacity-100"
            />
          </Button>
        </ToastClose>
      </div>
      <div className="contents" aria-hidden="true">
        <div
          className={`pointer-events-none absolute bottom-0 left-0 h-1 w-full ${getProgressColor()}`}
          style={{
            width: `${(progress / toastDuration) * 100}%`,
            transition: "width 100ms linear",
          }}
        />
      </div>
    </Toast>
  )
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  useEffect(() => {
    const listener = (toast: ToastData) => {
      setToasts((prev) => {
        // Prevent duplicate toasts with same id
        if (prev.some((t) => t.id === toast.id)) {
          return prev
        }
        return [...prev, toast]
      })
      // Remove toast after it's closed
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, (toast.duration || 5000) + 500)
    }
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map((toastData) => (
        <ToastItem key={toastData.id} toast={toastData} />
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
