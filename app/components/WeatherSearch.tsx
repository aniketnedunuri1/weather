"use client"

import { Input } from "@/components/ui/input"
import { Loader } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatHourForDisplay } from "@/lib/dateUtils"

interface WeatherSearchProps {
  location: string
  setLocation: (location: string) => void
  selectedDay: string
  setSelectedDay: (day: string) => void
  selectedStartHour: number
  setSelectedStartHour: (hour: number) => void
  selectedEndHour: number
  setSelectedEndHour: (hour: number) => void
  loading: boolean
  handleLocationSubmit: () => Promise<void>
}

export default function WeatherSearch({
  location,
  setLocation,
  selectedDay,
  setSelectedDay,
  selectedStartHour,
  setSelectedStartHour,
  selectedEndHour,
  setSelectedEndHour,
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
        <label htmlFor="start-time-select" className="text-sm font-medium block mb-1">
          Start Time
        </label>
        <Select 
          value={selectedStartHour.toString()} 
          onValueChange={(value) => setSelectedStartHour(parseInt(value))}
        >
          <SelectTrigger id="start-time-select" className="h-9">
            <SelectValue placeholder="Select start time" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }, (_, i) => i).map(hour => (
              <SelectItem key={`start-${hour}`} value={hour.toString()}>
                {formatHourForDisplay(hour)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-40">
        <label htmlFor="end-time-select" className="text-sm font-medium block mb-1">
          End Time
        </label>
        <Select 
          value={selectedEndHour.toString()} 
          onValueChange={(value) => setSelectedEndHour(parseInt(value))}
        >
          <SelectTrigger id="end-time-select" className="h-9">
            <SelectValue placeholder="Select end time" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }, (_, i) => i).map(hour => (
              <SelectItem 
                key={`end-${hour}`} 
                value={hour.toString()}
                disabled={hour <= selectedStartHour}
              >
                {formatHourForDisplay(hour)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <button 
        onClick={handleLocationSubmit}
        className="h-9 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        disabled={loading}
      >
        {loading ? <Loader className="h-4 w-4 animate-spin" /> : "Get Weather"}
      </button>
    </div>
  )
}
