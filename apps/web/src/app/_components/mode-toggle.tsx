"use client"

import { Button } from "@my-better-t-app/ui/components/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

type ThemeMode = "light" | "dark"
type ThemeTransitionOrigin = "top-left" | "top-right"
type ViewTransitionLike = {
  finished?: Promise<unknown>
}
type DocumentWithViewTransition = Document & {
  startViewTransition?: (update: () => void) => ViewTransitionLike | void
}

type ModeToggleProps = {
  transitionOrigin?: ThemeTransitionOrigin
}

export function ModeToggle({
  transitionOrigin = "top-right",
}: ModeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()

  const handleThemeChange = (theme: ThemeMode) => {
    const documentWithViewTransition = document as DocumentWithViewTransition
    const startViewTransition = documentWithViewTransition.startViewTransition?.bind(document)
    const rootElement = document.documentElement
    const updateTheme = () => {
      rootElement.classList.toggle("theme-transition-top-right", transitionOrigin === "top-right")
      setTheme(theme)
    }
    const clearRightOriginClass = () => {
      rootElement.classList.remove("theme-transition-top-right")
    }

    if (!startViewTransition) {
      updateTheme()
      clearRightOriginClass()
      return
    }

    const transition = startViewTransition(updateTheme)
    transition?.finished?.finally(clearRightOriginClass)
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
