/**
 * Custom hook for managing weather data and user interactions
 */
import { useState, useCallback, useRef } from "react";
import { format } from "date-fns";
import { WeatherData } from "@/app/types/weather";
import { WeatherApiResponse, WeatherDay } from "@/app/types/weatherApi";
import { convertApiResponseToAppFormat } from "@/app/utils/weatherDataAdapter";
import { getNextDayOccurrence, adjustTimeToHour, getNextOccurrence, formatHourForDisplay } from "@/lib/dateUtils";
import { findDayInForecast, findNextOccurrenceInForecast } from "@/lib/weatherUtils";
// No mock data imports needed

interface WeatherState {
  thisMeetup: WeatherData;
  nextMeetup: WeatherData;
}

interface ApiState {
  data: WeatherApiResponse | null;
  loading: boolean;
  error: string | null;
}

// Interface for the weather data cache
interface WeatherCache {
  [location: string]: WeatherApiResponse;
}

// Interface for day processing parameters
interface DayProcessingParams {
  data: WeatherApiResponse;
  dayName: string;
  startHour: number;
  endHour: number;
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

// Empty placeholder for initial weather data
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
  const [location, setLocation] = useState("");
  const [selectedDay, setSelectedDay] = useState("friday");
  const [selectedStartHour, setSelectedStartHour] = useState(12); // Default to 12 PM
  const [selectedEndHour, setSelectedEndHour] = useState(17);    // Default to 5 PM
  const [meetupTime, setMeetupTime] = useState(
    adjustTimeToHour(getNextDayOccurrence("friday"), 14) // Default to 2 PM Friday
  );
  
  // API state management
  const [apiState, setApiState] = useState<ApiState>({
    data: null,
    loading: false,
    error: null
  });
  
  // Weather data state - initialize with empty data
  const [weatherData, setWeatherData] = useState<WeatherState>({
    thisMeetup: emptyWeatherData,
    nextMeetup: emptyWeatherData
  });
  
  // Weather data cache - store API responses by location
  const weatherCache = useRef<WeatherCache>({});
  
  // Current location reference - used to determine if we need to fetch new data
  const currentLocationRef = useRef<string>("");

  /**
   * Fetch weather data from the API
   */
  const fetchWeatherData = useCallback(async (locationQuery: string) => {
    try {
      const normalizedLocation = locationQuery.trim().toLowerCase();
      
      // Check if we already have cached data for this location
      if (weatherCache.current[normalizedLocation]) {
        console.log('Using cached weather data for:', normalizedLocation);
        
        // Update API state with the cached data
        setApiState({
          data: weatherCache.current[normalizedLocation],
          loading: false,
          error: null
        });
        
        return weatherCache.current[normalizedLocation];
      }
      
      // Update API state to loading
      setApiState({
        data: apiState.data,
        loading: true,
        error: null
      });
      
      // Make the API call to our server-side API route
      const apiUrl = `/api/weather?location=${encodeURIComponent(normalizedLocation)}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || 'Failed to fetch weather data');
      }
      
      const data = await response.json() as WeatherApiResponse;
      
      // Cache the API response for this location
      weatherCache.current[normalizedLocation] = data;
      currentLocationRef.current = normalizedLocation;
      
      // Update API state with the fetched data
      setApiState({
        data,
        loading: false,
        error: null
      });
      
      return data;
    } catch (err) {
      console.error('Error in fetchWeatherData:', err);
      
      // Update API state with the error
      setApiState({
        data: apiState.data,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch weather data'
      });
      
      return null;
    }
  }, []);  // Removed apiState.data dependency since we're using the cache

  /**
   * Create a formatted time range string
   */
  const getTimeRangeDisplay = useCallback((start: number, end: number) => {
    return `${formatHourForDisplay(start)} - ${formatHourForDisplay(end)}`;
  }, []);

  /**
   * Find and prepare weather data for a specific day
   */
  const prepareDayData = useCallback((params: {
    data: WeatherApiResponse;
    dayName: string;
    date: Date;
    timeRangeDisplay: string;
  }) => {
    const { data, dayName, date, timeRangeDisplay } = params;
    const day = findDayInForecast(data, dayName);
    
    if (!day) return null;
    
    return {
      ...data,
      days: [day],
      description: `Weather for ${format(date, 'EEEE, MMMM d')} (${timeRangeDisplay})`
    };
  }, []);

  /**
   * Create an empty day data structure when no data is available
   */
  const createEmptyDayData = useCallback((params: {
    data: WeatherApiResponse;
    date: Date;
    timeRangeDisplay: string;
  }) => {
    const { data, date, timeRangeDisplay } = params;
    
    // Clone the first day from the original data to ensure we have all required fields
    const emptyDay = { ...data.days[0] };
    // Update with empty values
    emptyDay.datetime = format(date, 'yyyy-MM-dd');
    emptyDay.tempmax = 0;
    emptyDay.tempmin = 0;
    emptyDay.temp = 0;
    emptyDay.precipprob = 0;
    emptyDay.windspeed = 0;
    emptyDay.conditions = 'Unknown';
    emptyDay.hours = [];
    
    return {
      ...data,
      description: `Weather for ${format(date, 'EEEE, MMMM d')} (${timeRangeDisplay})`,
      days: [emptyDay]
    };
  }, []);

  /**
   * Process weather data for the selected day and time range
   */
  const processWeatherData = useCallback((data: WeatherApiResponse | null, dayOverride?: string) => {
    if (!data) return;
    
    // Use the provided day override or fall back to the selected day state
    const dayToProcess = dayOverride || selectedDay;
    
    // Get the selected day's date
    const selectedDate = getNextDayOccurrence(dayToProcess);
    // Get the next occurrence (a week later)
    const nextOccurrenceDate = getNextOccurrence(selectedDate);
    
    // Calculate the middle hour of the selected range for the meetup time
    const middleHour = Math.floor((selectedStartHour + selectedEndHour) / 2);
    
    // Adjust times based on selected hour
    const adjustedSelectedDate = adjustTimeToHour(selectedDate, middleHour);
    const adjustedNextOccurrenceDate = adjustTimeToHour(nextOccurrenceDate, middleHour);
    
    // Update the meetup time
    setMeetupTime(adjustedSelectedDate);

    // Format time range for display
    const timeRangeDisplay = getTimeRangeDisplay(selectedStartHour, selectedEndHour);
    
    // Prepare this meetup day data
    const thisMeetupData = prepareDayData({
      data, 
      dayName: dayToProcess, 
      date: adjustedSelectedDate,
      timeRangeDisplay
    });
    
    if (!thisMeetupData) return;
    
    // Try to find the next meetup day
    const nextMeetupDay = findNextOccurrenceInForecast(data, dayToProcess, selectedDate);
    
    // Prepare next meetup data (or create empty data if not found)
    const nextMeetupData = nextMeetupDay 
      ? prepareDayData({
          data, 
          dayName: dayToProcess, 
          date: adjustedNextOccurrenceDate,
          timeRangeDisplay
        })
      : createEmptyDayData({
          data,
          date: adjustedNextOccurrenceDate,
          timeRangeDisplay
        });
    
    if (!nextMeetupData) return;
    
    // Convert API data to app format
    const thisMeetupProcessed = convertApiResponseToAppFormat(
      thisMeetupData, 
      adjustedSelectedDate, 
      selectedStartHour, 
      selectedEndHour
    );
    
    const nextMeetupProcessed = convertApiResponseToAppFormat(
      nextMeetupData, 
      adjustedNextOccurrenceDate, 
      selectedStartHour, 
      selectedEndHour
    );
    
    // Update the weather data state
    setWeatherData({
      thisMeetup: thisMeetupProcessed,
      nextMeetup: nextMeetupProcessed
    });
  }, [selectedDay, selectedStartHour, selectedEndHour, prepareDayData, createEmptyDayData, getTimeRangeDisplay]);

  /**
   * Handle location submission and fetch weather data
   */
  const handleLocationSubmit = async () => {
    if (!location.trim()) {
      return;
    }
    
    const normalizedLocation = location.trim().toLowerCase();
    
    try {
      // Check if we need to fetch new data or can use cached data
      const needsFetch = currentLocationRef.current !== normalizedLocation;
      
      if (needsFetch) {
        console.log('Location changed, fetching new weather data');
        // Fetch the weather data
        const data = await fetchWeatherData(location);
        
        // Process the data if we got it
        if (data) {
          processWeatherData(data);
        }
      } else {
        console.log('Using cached data for current location');
        updateWeatherDataForSelection();
      }
    } catch (error) {
      console.error('Error in handleLocationSubmit:', error);
    }
  };

  /**
   * Get weather data from cache or API state
   */
  const getWeatherData = useCallback(() => {
    const normalizedLocation = location.trim().toLowerCase();
    const cachedData = weatherCache.current[normalizedLocation];
    
    if (cachedData) {
      return cachedData;
    }
    
    return apiState.data;
  }, [location, apiState.data]);

  /**
   * Update weather data when selection changes
   */
  const updateWeatherDataForSelection = useCallback((dayOverride?: string) => {
    const data = getWeatherData();
    if (!data) return;
    
    const dayToUse = dayOverride || selectedDay;
    console.log(`Processing weather data for ${dayToUse}`);
    processWeatherData(data, dayToUse);
  }, [getWeatherData, processWeatherData, selectedDay]);


  return {
    location,
    setLocation,
    selectedDay,
    setSelectedDay: (day: string) => {
      // First update the selected day state
      setSelectedDay(day);
      
      // Process weather data with the new day value
      if (getWeatherData()) {
        console.log(`Day changed to ${day}, updating weather data`);
        updateWeatherDataForSelection(day);
      }
    },
    selectedStartHour,
    setSelectedStartHour: (hour: number) => {
      setSelectedStartHour(hour);
      
      // Update weather data if available
      if (getWeatherData()) {
        console.log(`Start hour changed to ${hour}, updating weather data`);
        updateWeatherDataForSelection();
      }
    },
    selectedEndHour,
    setSelectedEndHour: (hour: number) => {
      setSelectedEndHour(hour);
      
      // Update weather data if available
      if (getWeatherData()) {
        console.log(`End hour changed to ${hour}, updating weather data`);
        updateWeatherDataForSelection();
      }
    },
    meetupTime,
    weatherData,
    loading: apiState.loading,
    error: apiState.error || "",
    handleLocationSubmit
  };
}
