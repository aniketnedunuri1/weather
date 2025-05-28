"use client"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WeatherSearchProps {
  location: string
  setLocation: (location: string) => void
  selectedDay: string
  setSelectedDay: (day: string) => void
  selectedTimeOfDay: string
  setSelectedTimeOfDay: (timeOfDay: string) => void
  loading: boolean
  handleLocationSubmit: () => Promise<void>
}

export default function WeatherSearch({
  location,
  setLocation,
  selectedDay,
  setSelectedDay,
  selectedTimeOfDay,
  setSelectedTimeOfDay,
  loading,
  handleLocationSubmit
}: WeatherSearchProps) {
  return (
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
  )
}
