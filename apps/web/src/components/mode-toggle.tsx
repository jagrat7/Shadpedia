"use client"

import { Button } from "@my-better-t-app/ui/components/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

type ThemeMode = "light" | "dark"
type ViewTransitionLike = {
  finished?: Promise<unknown>
}
type DocumentWithViewTransition = Document & {
  startViewTransition?: (update: () => void) => ViewTransitionLike | void
}

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const handleThemeChange = (theme: ThemeMode) => {
    const documentWithViewTransition = document as DocumentWithViewTransition
    const startViewTransition = documentWithViewTransition.startViewTransition?.bind(document)
    const updateTheme = () => {
      setTheme(theme)
    }

    if (!startViewTransition) {
      updateTheme()
      return
    }

    startViewTransition(updateTheme)
  }

  const handleToggle = () => {
    handleThemeChange(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <Button variant="outline" size="icon" onClick={handleToggle}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
