import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Droplets, Wind, Sun, Cloud, CloudRain } from "lucide-react"
import { format } from "date-fns"
import type { WeatherData } from "../types/weather"

interface WeatherCardProps {
  title: string
  weather: WeatherData
  isPrimary: boolean
}

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case "sunny":
      return <Sun className="h-10 w-10 text-yellow-500" />
    case "cloudy":
      return <Cloud className="h-10 w-10 text-gray-500" />
    case "rainy":
      return <CloudRain className="h-10 w-10 text-blue-500" />
    default:
      return <Sun className="h-10 w-10 text-yellow-500" />
  }
}

const getSummaryVariant = (summary: string) => {
  if (summary.includes("Perfect") || summary.includes("Nice")) return "default"
  if (summary.includes("Rain") || summary.includes("Windy")) return "secondary"
  return "outline"
}

export default function WeatherCard({ title, weather, isPrimary }: WeatherCardProps) {
  return (
    <Card className={`h-full relative ${isPrimary ? "ring-2 ring-primary" : ""}`}>
      {isPrimary && <Badge className="absolute top-2 right-2 z-10">Recommended</Badge>}

      <CardHeader>
        <CardTitle className="text-primary">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{format(weather.date, "EEEE, MMMM d")}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-center">{getWeatherIcon(weather.condition)}</div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {weather.tempHigh}°F / {weather.tempLow}°F
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{weather.precipitation}% chance of rain</span>
          </div>

          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{weather.windSpeed} mph wind</span>
          </div>
        </div>

        <Badge variant={getSummaryVariant(weather.summary)} className="w-full justify-center font-semibold">
          {weather.summary}
        </Badge>
      </CardContent>
    </Card>
  )
}
