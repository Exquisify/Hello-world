"\"use client"

import type React from "react"

export function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  )
}
