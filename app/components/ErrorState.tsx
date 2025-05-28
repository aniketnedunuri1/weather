"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"

interface ErrorStateProps {
  error: string
}

export default function ErrorState({ error }: ErrorStateProps) {
  if (!error) return null
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}
