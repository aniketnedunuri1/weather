"use client"

import { format } from "date-fns"
import { WeatherData } from "../types/weather"
import WeatherCard from "./cards/WeatherCard"

interface WeatherForecastProps {
  meetupTime: Date
  weatherData: {
    thisMeetup: WeatherData & { tags?: any[] }
    nextMeetup: WeatherData & { tags?: any[] }
  }
}

export default function WeatherForecast({ meetupTime, weatherData }: WeatherForecastProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Weather Forecast</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <WeatherCard 
          title={`This ${format(meetupTime, 'EEEE')}`} 
          weather={weatherData.thisMeetup} 
          isPrimary={true} 
        />
        <WeatherCard 
          title={`Next ${format(meetupTime, 'EEEE')}`} 
          weather={weatherData.nextMeetup} 
          isPrimary={false} 
        />
      </div>
    </>
  )
}
