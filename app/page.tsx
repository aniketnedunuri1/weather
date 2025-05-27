"use client"

import { useState } from "react"
import { addDays, setHours, setMinutes, nextFriday } from "date-fns"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import WeatherCard from "./components/weather-card"
import WeatherChart from "./components/weather-chart"
import type { WeatherData } from "./types/weather"

// Mock weather data
const mockWeatherData: { thisFriday: WeatherData; nextFriday: WeatherData } = {
  thisFriday: {
    date: nextFriday(new Date()),
    tempHigh: 72,
    tempLow: 58,
    precipitation: 15,
    windSpeed: 8,
    summary: "Perfect Day",
    condition: "sunny",
    hourlyData: [
      { time: "3 PM", temp: 68, precipitation: 10 },
      { time: "4 PM", temp: 70, precipitation: 15 },
      { time: "5 PM", temp: 72, precipitation: 20 },
      { time: "6 PM", temp: 69, precipitation: 15 },
    ],
  },
  nextFriday: {
    date: addDays(nextFriday(new Date()), 7),
    tempHigh: 65,
    tempLow: 52,
    precipitation: 45,
    windSpeed: 12,
    summary: "Chance of Rain",
    condition: "cloudy",
    hourlyData: [
      { time: "3 PM", temp: 62, precipitation: 40 },
      { time: "4 PM", temp: 65, precipitation: 45 },
      { time: "5 PM", temp: 63, precipitation: 50 },
      { time: "6 PM", temp: 60, precipitation: 45 },
    ],
  },
}

export default function WeatherMeetupApp() {
  const [location, setLocation] = useState("")
  const [meetupTime, setMeetupTime] = useState(
    setMinutes(setHours(nextFriday(new Date()), 15), 0), // Default to 3 PM Friday
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [weatherData, setWeatherData] = useState(mockWeatherData)

  const handleLocationSubmit = async () => {
    if (!location.trim()) return

    setLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      // In a real app, you'd fetch actual weather data here
    }, 1500)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8">Friday Park Meetup Weather</h1>

      {/* Location and Time Input Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Meetup Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location (City or Zip Code)
              </label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLocationSubmit()}
                placeholder="Enter city name or zip code"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="meetup-time" className="text-sm font-medium">
                Meetup Time
              </label>
              <Input id="meetup-time" value="Friday 3:00 PM - 6:00 PM" disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Default meetup time</p>
            </div>
          </div>
          <div className="mt-4">
            <Badge variant="outline">Repeats Weekly</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center my-8">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Fetching weather data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Weather Cards Section */}
      {!loading && (
        <>
          <h2 className="text-2xl font-semibold mb-6">Weather Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <WeatherCard title="This Friday" weather={weatherData.thisFriday} isPrimary={true} />
            <WeatherCard title="Next Friday" weather={weatherData.nextFriday} isPrimary={false} />
          </div>

          {/* Weather Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Weather Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <WeatherChart thisFriday={weatherData.thisFriday} nextFriday={weatherData.nextFriday} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
