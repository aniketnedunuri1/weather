/**
 * Custom hook for managing weather data and user interactions
 */
import { useState } from "react";
import { format } from "date-fns";
import { WeatherData } from "@/app/types/weather";
import { WeatherApiResponse } from "@/app/types/weatherApi";
import { convertApiResponseToAppFormat } from "@/app/utils/weatherDataAdapter";
import { getNextDayOccurrence, adjustTimeToHour, getNextOccurrence, formatHourForDisplay } from "@/lib/dateUtils";
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
  selectedStartHour: number;
  setSelectedStartHour: (hour: number) => void;
  selectedEndHour: number;
  setSelectedEndHour: (hour: number) => void;
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
  const [selectedStartHour, setSelectedStartHour] = useState(12); // Default to 12 PM
  const [selectedEndHour, setSelectedEndHour] = useState(17);    // Default to 5 PM
  const [meetupTime, setMeetupTime] = useState(
    adjustTimeToHour(getNextDayOccurrence("friday"), 14) // Default to 2 PM Friday
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
      
      // Calculate the middle hour of the selected range for the meetup time
      const middleHour = Math.floor((selectedStartHour + selectedEndHour) / 2);
      
      // Adjust times based on selected hour
      const adjustedSelectedDate = adjustTimeToHour(selectedDate, middleHour);
      const adjustedNextOccurrenceDate = adjustTimeToHour(nextOccurrenceDate, middleHour);
      
      // Update the meetup time
      setMeetupTime(adjustedSelectedDate);

      // Simulate API call
      // In a real app, you would fetch data from an actual API here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock API response with updated location and description
      const timeRangeDisplay = `${formatHourForDisplay(selectedStartHour)} - ${formatHourForDisplay(selectedEndHour)}`;
      
      const updatedThisMeetup = {
        ...thisFridayWeatherResponse,
        resolvedAddress: `${location}, United States`,
        address: location,
        description: `Weather for ${format(adjustedSelectedDate, 'EEEE, MMMM d')} (${timeRangeDisplay})`
      };
      
      const updatedNextMeetup = {
        ...nextFridayWeatherResponse,
        resolvedAddress: `${location}, United States`,
        address: location,
        description: `Weather for ${format(adjustedNextOccurrenceDate, 'EEEE, MMMM d')} (${timeRangeDisplay})`
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
    selectedStartHour,
    setSelectedStartHour,
    selectedEndHour,
    setSelectedEndHour,
    meetupTime,
    weatherData,
    loading,
    error,
    handleLocationSubmit
  };
}
