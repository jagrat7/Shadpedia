"use client"

import { Show, SignInButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"

import { ModeToggle } from "./mode-toggle"

export default function Header() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse" },
  ] as const

  return (
    <header className="border-b-2 border-foreground bg-background">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-foreground no-underline hover:no-underline">
            Shadpedia
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-semibold uppercase tracking-widest text-foreground transition-colors hover:text-accent hover:no-underline"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4 sm:hidden">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:text-accent hover:no-underline"
              >
                {label}
              </Link>
            ))}
          </nav>
          <ModeToggle />
          <Show when="signed-out">
            <SignInButton />
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  )
}
