"use client"

import { useWeather } from "@/hooks/useWeather"
import { addDays } from "date-fns"
import WeatherSearch from "./components/WeatherSearch"
import LoadingState from "./components/LoadingState"
import ErrorState from "./components/ErrorState"
import WeatherForecast from "./components/WeatherForecast"
import WeatherChartTabs from "./components/charts/WeatherChartTabs"
import { thisFridayWeatherResponse, nextFridayWeatherResponse } from "./mock/weatherApiResponse"

/**
 * Main Weather Meetup App component
 * Uses custom hooks for business logic and componentized UI elements
 */
export default function WeatherMeetupApp() {
  // Use the custom hook for all weather-related state and logic
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
    handleLocationSubmit
  } = useWeather()

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-6">Park Meetup Weather</h1>

      {/* Weather Search Form */}
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

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Error State */}
      <ErrorState error={error} />

      {/* Weather Content */}
      {!loading && (
        <>
          {/* Weather Cards */}
          <WeatherForecast 
            meetupTime={meetupTime} 
            weatherData={{
              thisMeetup: weatherData.thisMeetup,
              nextMeetup: weatherData.nextMeetup
            }} 
          />

          {/* Weather Visualization */}
          <div className="mb-8">
            <WeatherChartTabs 
              thisMeetupDay={thisFridayWeatherResponse.days[0]}
              nextMeetupDay={nextFridayWeatherResponse.days[0]}
              thisMeetupDate={meetupTime}
              nextMeetupDate={addDays(meetupTime, 7)}
              startHour={selectedStartHour}
              endHour={selectedEndHour}
              dayName={selectedDay}
            />
          </div>
        </>
      )}
    </div>
  )
}
