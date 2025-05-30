/**
 * Custom hook for managing weather data and user interactions
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { format } from "date-fns";
import { WeatherData } from "@/app/types/weather";
import { WeatherApiResponse } from "@/app/types/weatherApi";
import { convertApiResponseToAppFormat } from "@/app/utils/weatherDataAdapter";
import { getNextDayOccurrence, adjustTimeToHour, getNextOccurrence, formatHourForDisplay } from "@/lib/dateUtils";
import { findDayInForecast, findNextOccurrenceInForecast } from "@/lib/weatherUtils";

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

const emptyWeatherData: WeatherData = {
  date: new Date(),
  tempHigh: 0,
  tempLow: 0,
  precipitation: 0,
  windSpeed: 0,
  summary: 'No data available',
  condition: 'sunny',
  hourlyData: []
};

/**
 * Custom hook for managing weather data and user interactions
 */
export function useWeather(): UseWeatherReturn {
  // Basic state
  const [location, setLocation] = useState("");
  const [selectedDay, setSelectedDay] = useState("friday");
  const [selectedStartHour, setSelectedStartHour] = useState(12);
  const [selectedEndHour, setSelectedEndHour] = useState(17);
  const [meetupTime, setMeetupTime] = useState(
    adjustTimeToHour(getNextDayOccurrence("friday"), 14)
  );
  
  // API state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherState>({
    thisMeetup: emptyWeatherData,
    nextMeetup: emptyWeatherData
  });
  
  // Cache for API responses
  const weatherCache = useRef<Record<string, WeatherApiResponse>>({});

  /**
   * Fetch weather data from API with caching
   */
  const fetchWeatherData = useCallback(async (locationQuery: string): Promise<WeatherApiResponse | null> => {
    const normalizedLocation = locationQuery.trim().toLowerCase();
    
    // Return cached data if available
    if (weatherCache.current[normalizedLocation]) {
      return weatherCache.current[normalizedLocation];
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(normalizedLocation)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch weather data');
      }
      
      const data = await response.json() as WeatherApiResponse;
      weatherCache.current[normalizedLocation] = data;
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create empty day data for missing forecast days
   */
  const createEmptyDay = (data: WeatherApiResponse, targetDate: Date) => {
    const emptyDay = { ...data.days[0] };
    emptyDay.datetime = format(targetDate, 'yyyy-MM-dd');
    emptyDay.tempmax = 0;
    emptyDay.tempmin = 0;
    emptyDay.temp = 0;
    emptyDay.precipprob = 0;
    emptyDay.windspeed = 0;
    emptyDay.conditions = 'Unknown';
    emptyDay.hours = [];
    
    return {
      ...data,
      days: [emptyDay],
      description: `Weather for ${format(targetDate, 'EEEE, MMMM d')}`
    };
  };

  /**
   * Process weather data for selected day and time range
   */
  const processWeatherData = useCallback((data: WeatherApiResponse | null) => {
    if (!data) return;

    // Calculate dates
    const selectedDate = getNextDayOccurrence(selectedDay);
    console.log("selectedDay", selectedDay);
    console.log("selectedDate", selectedDate);
    const nextWeekDate = getNextOccurrence(selectedDate); // This should be 7 days later
    console.log("selectedDate", selectedDate);
    console.log("nextWeekDate", nextWeekDate);
    const middleHour = Math.floor((selectedStartHour + selectedEndHour) / 2);
    
    const thisDate = adjustTimeToHour(selectedDate, middleHour);
    const nextDate = adjustTimeToHour(nextWeekDate, middleHour);
    
    setMeetupTime(thisDate);

    // Find forecast days
    const thisMeetupDay = findDayInForecast(data, selectedDay);
    const nextMeetupDay = findNextOccurrenceInForecast(data, selectedDay, selectedDate);
    console.log("thisMeetupDay", thisMeetupDay);
    console.log("nextMeetupDay", nextMeetupDay);
    
    const timeRangeDisplay = `${formatHourForDisplay(selectedStartHour)} - ${formatHourForDisplay(selectedEndHour)}`;
    
    if (!thisMeetupDay) return;

    // Prepare data for this week
    const thisMeetupData = {
      ...data,
      days: [thisMeetupDay],
      description: `Weather for ${format(thisDate, 'EEEE, MMMM d')} (${timeRangeDisplay})`
    };
    
    // Prepare data for next week - FIXED: Use nextWeekDate instead of selectedDate
    const nextMeetupData = nextMeetupDay 
      ? {
          ...data,
          days: [nextMeetupDay],
          description: `Weather for ${format(nextDate, 'EEEE, MMMM d')} (${timeRangeDisplay})`
        }
      : createEmptyDay(data, nextDate);


    // Convert to app format
    const thisMeetupProcessed = convertApiResponseToAppFormat(
      thisMeetupData, 
      thisDate, 
      selectedStartHour, 
      selectedEndHour
    );
    
    const nextMeetupProcessed = convertApiResponseToAppFormat(
      nextMeetupData, 
      nextDate, // FIXED: Use nextDate instead of thisDate
      selectedStartHour, 
      selectedEndHour
    );

    setWeatherData({
      thisMeetup: thisMeetupProcessed,
      nextMeetup: nextMeetupProcessed
    });
  }, [selectedDay, selectedStartHour, selectedEndHour]);

  /**
   * Update weather data when selections change
   */
  const updateForCurrentSelection = useCallback(() => {
    if (!location.trim()) return;
    
    const normalizedLocation = location.trim().toLowerCase();
    const cachedData = weatherCache.current[normalizedLocation];
    
    if (cachedData) {
      processWeatherData(cachedData);
    }
  }, [location, processWeatherData]);

  /**
   * Handle location submission
   */
  const handleLocationSubmit = async () => {
    if (!location.trim()) return;
    
    const data = await fetchWeatherData(location);
    if (data) {
      processWeatherData(data);
    }
  };

  // Update weather data when day or time selections change
  useEffect(() => {
    updateForCurrentSelection();
  }, [selectedDay, selectedStartHour, selectedEndHour, updateForCurrentSelection]);

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