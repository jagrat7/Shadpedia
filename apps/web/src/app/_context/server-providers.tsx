import { ClerkProvider } from "@clerk/nextjs"

export default function ServerProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  )
}
