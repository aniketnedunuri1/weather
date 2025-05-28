"use client"

import { useState } from "react"
import { addDays, setHours, setMinutes, nextFriday, nextMonday, format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [selectedDay, setSelectedDay] = useState("friday")
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState("afternoon")
  const [meetupTime, setMeetupTime] = useState(
    setMinutes(setHours(nextFriday(new Date()), 15), 0), // Default to 3 PM Friday
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [weatherData, setWeatherData] = useState(mockWeatherData)

  // Helper function to get the next occurrence of a specific day
  const getNextDayOccurrence = (dayName: string) => {
    const days = {
      monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0
    };
    const dayNumber = days[dayName as keyof typeof days];
    const today = new Date();
    const currentDayNumber = today.getDay();
    
    // Calculate days to add
    let daysToAdd = dayNumber - currentDayNumber;
    if (daysToAdd <= 0) daysToAdd += 7; // If it's in the past, get next week's occurrence
    
    return addDays(today, daysToAdd);
  };

  // Helper function to adjust time based on time of day selection
  const adjustTimeOfDay = (date: Date, timeOfDay: string) => {
    const times = {
      morning: 10, // 10 AM
      afternoon: 14, // 2 PM
      evening: 18 // 6 PM
    };
    
    return setMinutes(setHours(date, times[timeOfDay as keyof typeof times]), 0);
  };

  const handleLocationSubmit = async () => {
    if (!location.trim()) return

    setLoading(true)
    setError("")
    
    // Get the selected day's date
    const selectedDate = getNextDayOccurrence(selectedDay);
    // Get the next occurrence (a week later)
    const nextOccurrenceDate = addDays(selectedDate, 7);
    
    // Adjust times based on selected time of day
    const adjustedSelectedDate = adjustTimeOfDay(selectedDate, selectedTimeOfDay);
    const adjustedNextOccurrenceDate = adjustTimeOfDay(nextOccurrenceDate, selectedTimeOfDay);
    
    // Update the meetup time
    setMeetupTime(adjustedSelectedDate);

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      
      // In a real app, you'd fetch actual weather data here
      // For now, we're using our mock data with the location and selected day/time
      const updatedThisFriday = {
        ...thisFridayWeatherResponse,
        resolvedAddress: `${location}, United States`,
        address: location,
        description: `Weather for ${format(adjustedSelectedDate, 'EEEE, MMMM d')} (${selectedTimeOfDay})`
      };
      
      const updatedNextFriday = {
        ...nextFridayWeatherResponse,
        resolvedAddress: `${location}, United States`,
        address: location,
        description: `Weather for ${format(adjustedNextOccurrenceDate, 'EEEE, MMMM d')} (${selectedTimeOfDay})`
      };
      
      setWeatherData({
        thisFriday: convertApiResponseToAppFormat(updatedThisFriday, adjustedSelectedDate),
        nextFriday: convertApiResponseToAppFormat(updatedNextFriday, adjustedNextOccurrenceDate)
      });
    }, 1500)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-6">Park Meetup Weather</h1>

      {/* Location and Time Input Section - Minimal Version */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <label htmlFor="location" className="text-sm font-medium block mb-1">
            Location
          </label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLocationSubmit()}
            placeholder="City or zip code"
            className="h-9"
          />
        </div>

        <div className="w-full md:w-40">
          <label htmlFor="day-select" className="text-sm font-medium block mb-1">
            Day
          </label>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger id="day-select" className="h-9">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monday">Monday</SelectItem>
              <SelectItem value="tuesday">Tuesday</SelectItem>
              <SelectItem value="wednesday">Wednesday</SelectItem>
              <SelectItem value="thursday">Thursday</SelectItem>
              <SelectItem value="friday">Friday</SelectItem>
              <SelectItem value="saturday">Saturday</SelectItem>
              <SelectItem value="sunday">Sunday</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-40">
          <label htmlFor="time-select" className="text-sm font-medium block mb-1">
            Time
          </label>
          <Select value={selectedTimeOfDay} onValueChange={setSelectedTimeOfDay}>
            <SelectTrigger id="time-select" className="h-9">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (8-12)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12-5)</SelectItem>
              <SelectItem value="evening">Evening (5-9)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-9 px-3 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Repeats Weekly
          </Badge>
        </div>

        <button 
          onClick={handleLocationSubmit}
          className="h-9 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Weather"}
        </button>
      </div>

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
            <WeatherCard 
              title={`This ${format(meetupTime, 'EEEE')}`} 
              weather={weatherData.thisFriday} 
              isPrimary={true} 
            />
            <WeatherCard 
              title={`Next ${format(meetupTime, 'EEEE')}`} 
              weather={weatherData.nextFriday} 
              isPrimary={false} 
            />
          </div>

          {/* Weather Visualization */}
          <div className="mb-8">
            <SimpleCombinedChart 
              thisFridayDay={thisFridayWeatherResponse.days[0]}
              nextFridayDay={nextFridayWeatherResponse.days[0]}
              thisFridayDate={meetupTime}
              nextFridayDate={addDays(meetupTime, 7)}
              timeOfDay={selectedTimeOfDay}
              dayName={selectedDay}
            />
          </div>
        </>
      )}
    </div>
  )
}
