import { Link } from "@tanstack/react-router"

import { ModeToggle } from "./mode-toggle"

export default function Header() {
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/browse", label: "Browse" },
  ] as const

  return (
    <header className="border-b-2 border-foreground bg-background">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Shadpedia
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm font-semibold uppercase tracking-widest text-foreground transition-colors hover:text-accent"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4 sm:hidden">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:text-accent"
              >
                {label}
              </Link>
            ))}
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
