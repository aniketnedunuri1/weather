/**
 * Custom hook for managing weather data and user interactions
 */
import { useState } from "react";
import { format } from "date-fns";
import { WeatherData } from "@/app/types/weather";
import { WeatherApiResponse } from "@/app/types/weatherApi";
import { convertApiResponseToAppFormat } from "@/app/utils/weatherDataAdapter";
import { getNextDayOccurrence, adjustTimeOfDay, getNextOccurrence } from "@/lib/dateUtils";
import { thisFridayWeatherResponse, nextFridayWeatherResponse } from "@/app/mock/weatherApiResponse";

interface WeatherState {
  thisMeetup: WeatherData;
  nextMeetup: WeatherData;
}

interface UseWeatherReturn {
  location: string;
  setLocation: (location: string) => void;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  selectedTimeOfDay: string;
  setSelectedTimeOfDay: (timeOfDay: string) => void;
  meetupTime: Date;
  weatherData: WeatherState;
  loading: boolean;
  error: string;
  handleLocationSubmit: () => Promise<void>;
}

/**
 * Initialize mock weather data
 */
function initializeMockWeatherData(): WeatherState {
  const thisFridayDate = getNextDayOccurrence("friday");
  const nextFridayDate = getNextOccurrence(thisFridayDate);

  return {
    thisMeetup: convertApiResponseToAppFormat(thisFridayWeatherResponse, thisFridayDate),
    nextMeetup: convertApiResponseToAppFormat(nextFridayWeatherResponse, nextFridayDate)
  };
}

/**
 * Custom hook for managing weather data and user interactions
 */
export function useWeather(): UseWeatherReturn {
  const [location, setLocation] = useState("");
  const [selectedDay, setSelectedDay] = useState("friday");
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState("afternoon");
  const [meetupTime, setMeetupTime] = useState(
    adjustTimeOfDay(getNextDayOccurrence("friday"), "afternoon")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherState>(initializeMockWeatherData());

  /**
   * Handle location submission and fetch weather data
   */
  const handleLocationSubmit = async () => {
    if (!location.trim()) return;

    setLoading(true);
    setError("");
    
    try {
      // Get the selected day's date
      const selectedDate = getNextDayOccurrence(selectedDay);
      // Get the next occurrence (a week later)
      const nextOccurrenceDate = getNextOccurrence(selectedDate);
      
      // Adjust times based on selected time of day
      const adjustedSelectedDate = adjustTimeOfDay(selectedDate, selectedTimeOfDay);
      const adjustedNextOccurrenceDate = adjustTimeOfDay(nextOccurrenceDate, selectedTimeOfDay);
      
      // Update the meetup time
      setMeetupTime(adjustedSelectedDate);

      // Simulate API call
      // In a real app, you would fetch data from an actual API here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock API response with updated location and description
      const updatedThisMeetup = {
        ...thisFridayWeatherResponse,
        resolvedAddress: `${location}, United States`,
        address: location,
        description: `Weather for ${format(adjustedSelectedDate, 'EEEE, MMMM d')} (${selectedTimeOfDay})`
      };
      
      const updatedNextMeetup = {
        ...nextFridayWeatherResponse,
        resolvedAddress: `${location}, United States`,
        address: location,
        description: `Weather for ${format(adjustedNextOccurrenceDate, 'EEEE, MMMM d')} (${selectedTimeOfDay})`
      };
      
      setWeatherData({
        thisMeetup: convertApiResponseToAppFormat(updatedThisMeetup, adjustedSelectedDate),
        nextMeetup: convertApiResponseToAppFormat(updatedNextMeetup, adjustedNextOccurrenceDate)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    setLocation,
    selectedDay,
    setSelectedDay,
    selectedTimeOfDay,
    setSelectedTimeOfDay,
    meetupTime,
    weatherData,
    loading,
    error,
    handleLocationSubmit
  };
}
