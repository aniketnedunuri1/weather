import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Droplets, Wind, Sun, Cloud, CloudRain } from "lucide-react"
import { format } from "date-fns"
import type { WeatherData } from "@/app/types/weather"
import { WeatherTagInfo } from "@/app/utils/weatherTags"
import WeatherTag from "../weather-tag"

interface WeatherCardProps {
  title: string
  weather: WeatherData & { tags?: WeatherTagInfo[] }
}

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case "sunny":
      return <Sun className="h-8 w-8 text-yellow-500" />
    case "cloudy":
      return <Cloud className="h-8 w-8 text-gray-500" />
    case "rainy":
      return <CloudRain className="h-8 w-8 text-blue-500" />
    default:
      return <Sun className="h-8 w-8 text-yellow-500" />
  }
}

const getSummaryVariant = (summary: string) => {
  if (summary.includes("Perfect") || summary.includes("Nice")) return "default"
  if (summary.includes("Rain") || summary.includes("Windy")) return "secondary"
  return "outline"
}

export default function WeatherCard({ title, weather }: WeatherCardProps) {
  return (
    <Card className={`relative`}>

      <CardHeader className="py-2 px-4">
        <CardTitle className="text-primary text-base">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{format(weather.date, "EEEE, MMMM d")}</p>
      </CardHeader>

      <CardContent className="py-2 px-4 space-y-2">
        <div className="flex items-center gap-4">
          <div>{getWeatherIcon(weather.condition)}</div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm whitespace-nowrap">
                  {weather.tempHigh}°F / {weather.tempLow}°F
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm whitespace-nowrap">{weather.precipitation}%</span>
              </div>

              <div className="flex items-center space-x-1">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm whitespace-nowrap">{weather.windSpeed} mph</span>
              </div>
            </div>
          </div>
        </div>

        <Badge variant={getSummaryVariant(weather.summary)} className="w-full justify-center text-xs py-1">
          {weather.summary}
        </Badge>

        {weather.tags && weather.tags.length > 0 && (
          <div className="mt-1">
            <p className="text-xs font-medium mb-1">Weather Conditions:</p>
            <div className="flex flex-wrap gap-1">
              {weather.tags.map((tag, index) => (
                <WeatherTag key={index} tag={tag} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
