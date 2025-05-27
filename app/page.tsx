"use client"

import { useState } from "react"
import { addDays, setHours, setMinutes, nextFriday } from "date-fns"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import WeatherCard from "./components/weather-card"
import SimpleCombinedChart from "./components/simple-combined-chart"
import type { WeatherData } from "./types/weather"
import { thisFridayWeatherResponse, nextFridayWeatherResponse } from "./mock/weatherApiResponse"
import { convertApiResponseToAppFormat } from "./utils/weatherDataAdapter"
import { getWeatherTagInfo } from "./utils/weatherTags"

// Convert mock API responses to app format
const thisFridayDate = nextFriday(new Date());
const nextFridayDate = addDays(thisFridayDate, 7);

// Mock weather data using our API response format
const mockWeatherData = {
  thisFriday: convertApiResponseToAppFormat(thisFridayWeatherResponse, thisFridayDate),
  nextFriday: convertApiResponseToAppFormat(nextFridayWeatherResponse, nextFridayDate)
};

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
      // For now, we're using our mock data with the location
      const updatedThisFriday = {
        ...thisFridayWeatherResponse,
        resolvedAddress: `${location}, United States`,
        address: location
      };
      
      const updatedNextFriday = {
        ...nextFridayWeatherResponse,
        resolvedAddress: `${location}, United States`,
        address: location
      };
      
      setWeatherData({
        thisFriday: convertApiResponseToAppFormat(updatedThisFriday, thisFridayDate),
        nextFriday: convertApiResponseToAppFormat(updatedNextFriday, nextFridayDate)
      });
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

          {/* Weather Visualization */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Weather Visualization</h2>
            <SimpleCombinedChart 
              thisFridayDay={thisFridayWeatherResponse.days[0]}
              nextFridayDay={nextFridayWeatherResponse.days[0]}
              thisFridayDate={thisFridayDate}
              nextFridayDate={nextFridayDate}
            />
          </div>
        </>
      )}
    </div>
  )
}
