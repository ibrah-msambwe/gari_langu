"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect } from "react"
import { create } from "zustand"

export const useGlobalLoading = create<{ loading: boolean; setLoading: (v: boolean) => void }>((set) => ({
  loading: false,
  setLoading: (v) => set({ loading: v }),
}))

export function GlobalLoadingBar() {
  const loading = useGlobalLoading((s) => s.loading)
  return loading ? (
    <div className="fixed top-0 left-0 w-full h-1 z-[9999]">
      <div className="h-full w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 animate-pulse" />
    </div>
  ) : null
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
