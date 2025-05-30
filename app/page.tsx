"use client"

import { useWeather } from "@/hooks/useWeather"
import { addDays } from "date-fns"
import WeatherSearch from "./components/WeatherSearch"
import LoadingState from "./components/LoadingState"
import ErrorState from "./components/ErrorState"
import WeatherForecast from "./components/WeatherForecast"
import WeatherChartTabs from "./components/charts/WeatherChartTabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WeatherMeetupApp() {
  const {
    location,
    setLocation,
    selectedDay,
    setSelectedDay,
    selectedStartHour,
    setSelectedStartHour,
    selectedEndHour,
    setSelectedEndHour,
    meetupTime,
    weatherData,
    loading,
    error,
    submitted,
    handleLocationSubmit
  } = useWeather()

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-6">Park Meetup Weather</h1>
      <WeatherSearch
        location={location}
        setLocation={setLocation}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        selectedStartHour={selectedStartHour}
        setSelectedStartHour={setSelectedStartHour}
        selectedEndHour={selectedEndHour}
        setSelectedEndHour={setSelectedEndHour}
        loading={loading}
        handleLocationSubmit={handleLocationSubmit}
      />
      {!submitted && !loading && !error && (
        <div className="my-6">
        <Card>
          <CardHeader>
            <CardTitle>Please enter a location</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Enter a city or ZIP code above and click "Get Weather" to see the forecast comparison for this and next week. </p>
          </CardContent>
        </Card>
      </div>
      )}
      {loading && <LoadingState />}
      <ErrorState error={error} />
      {submitted && !loading && (
        <>
          <WeatherForecast 
            meetupTime={meetupTime} 
            weatherData={{
              thisMeetup: weatherData.thisMeetup,
              nextMeetup: weatherData.nextMeetup
            }} 
          />
          <div className="mb-8">
            <WeatherChartTabs 
              thisMeetupDate={meetupTime}
              nextMeetupDate={addDays(meetupTime, 7)}
              startHour={selectedStartHour}
              endHour={selectedEndHour}
              dayName={selectedDay}
              weatherData={{
                thisMeetup: weatherData.thisMeetup,
                nextMeetup: weatherData.nextMeetup
              }} 
            />
          </div>
        </>
      )}
    </div>
  )
}
