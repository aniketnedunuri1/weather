"use client"

import { useWeather } from "@/hooks/useWeather"
import { addDays } from "date-fns"
import WeatherSearch from "./components/WeatherSearch"
import LoadingState from "./components/LoadingState"
import ErrorState from "./components/ErrorState"
import WeatherForecast from "./components/WeatherForecast"
import WeatherChartTabs from "./components/charts/WeatherChartTabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Logo from "./components/Logo"

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
    <>
      <div className="fixed top-0 left-0 right-0 bg-background border-b z-10">
        <div className="px-4 py-3">
          <Logo />
        </div>
      </div>
      <div className="container mx-auto py-24 px-4 max-w-6xl">
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
    </>
  )
}
