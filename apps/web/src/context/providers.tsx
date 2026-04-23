"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@my-better-t-app/ui/components/sonner"

import { queryClient } from "@/utils/trpc"
import { ThemeProvider } from "./theme-provider"

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
