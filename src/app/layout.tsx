import type { Metadata } from "next"

import "../styles/globals.css"
import Header from "@/components/header"
import ClientProviders from "@/context/providers"
import ServerProviders from "@/context/server-providers"

export const metadata: Metadata = {
  title: "Shadpedia — The Free Component Encyclopedia",
  description:
    "Shadpedia indexes shadcn/ui components — a Wikipedia-like encyclopedia of UI components.",
}

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Libre+Bodoni:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ServerProviders>
          <ClientProviders>
            <div className="grid grid-rows-[auto_1fr] h-svh">
              <Header />
              {children}
            </div>
          </ClientProviders>
        </ServerProviders>
      </body>
    </html>
  )
}
