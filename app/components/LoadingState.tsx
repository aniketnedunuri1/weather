"use client"

import { Loader2 } from "lucide-react"

export default function LoadingState() {
  return (
    <div className="flex justify-center items-center my-8">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <span>Fetching weather data...</span>
    </div>
  )
}
