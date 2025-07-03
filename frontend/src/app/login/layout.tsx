'use client'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {children}
    </div>
  )
}

