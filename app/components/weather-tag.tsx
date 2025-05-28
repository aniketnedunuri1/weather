import React from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { WeatherTagInfo } from "../utils/weatherTags"

interface WeatherTagProps {
  tag: WeatherTagInfo
  size?: "sm" | "md" | "lg"
}

export default function WeatherTag({ tag, size = "sm" }: WeatherTagProps) {
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0",
    md: "text-sm px-2 py-0.5",
    lg: "text-base px-3 py-1"
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${sizeClasses[size]} font-medium mr-1 mb-1`}>
            <span className="mr-0.5">{tag.emoji}</span> {tag.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tag.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
