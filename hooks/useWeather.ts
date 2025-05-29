/**
 * Custom hook for managing weather data and user interactions
 */
import { useState, useCallback } from "react";
import { format } from "date-fns";
import { WeatherData } from "@/app/types/weather";
import { WeatherApiResponse } from "@/app/types/weatherApi";
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

  /**
   * Fetch weather data from the API
   */
  const fetchWeatherData = useCallback(async (locationQuery: string) => {
    try {
      
      // Update API state to loading
      setApiState({
        data: apiState.data,
        loading: true,
        error: null
      });
      
      // Make the API call to our server-side API route
      const apiUrl = `/api/weather?location=${encodeURIComponent(locationQuery.trim())}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || 'Failed to fetch weather data');
      }
      
      const data = await response.json() as WeatherApiResponse;
      
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
  }, [apiState.data]);

  /**
   * Process weather data for the selected day and time range
   */
  const processWeatherData = useCallback((data: WeatherApiResponse | null) => {
    if (!data) return;

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

    // Find the relevant days in the forecast
    const thisMeetupDay = findDayInForecast(data, selectedDay);
    const nextMeetupDay = findNextOccurrenceInForecast(
      data, 
      selectedDay, 
      selectedDate
    );
    
    // Format time range for display
    const timeRangeDisplay = `${formatHourForDisplay(selectedStartHour)} - ${formatHourForDisplay(selectedEndHour)}`;
    
    // If we found the days, convert them to our app format
    if (thisMeetupDay) {
      
      
      // Create a clean copy of the API response with just this meetup day
      const thisMeetupData = {
        ...data,
        days: [thisMeetupDay],
        description: `Weather for ${format(adjustedSelectedDate, 'EEEE, MMMM d')} (${timeRangeDisplay})`
      };
      
      // Process next meetup day
      let nextMeetupData;
      
      if (nextMeetupDay) {
        
        
        // Create a clean copy of the API response with just the next meetup day
        nextMeetupData = {
          ...data,
          days: [nextMeetupDay],
          description: `Weather for ${format(adjustedNextOccurrenceDate, 'EEEE, MMMM d')} (${timeRangeDisplay})`
        };
      } else {

        // Create a complete API response structure with empty data
        // Clone the first day from the original data to ensure we have all required fields
        const emptyDay = { ...data.days[0] };
        // Update with empty values
        emptyDay.datetime = adjustedNextOccurrenceDate.toISOString().split('T')[0];
        emptyDay.tempmax = 0;
        emptyDay.tempmin = 0;
        emptyDay.temp = 0;
        emptyDay.precipprob = 0;
        emptyDay.windspeed = 0;
        emptyDay.conditions = 'Unknown';
        emptyDay.hours = [];
        
        nextMeetupData = {
          ...data, // Clone all properties from original data
          description: `Weather for ${format(adjustedNextOccurrenceDate, 'EEEE, MMMM d')} (${timeRangeDisplay})`,
          days: [emptyDay]
        };
      }
      
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
    }
  }, [selectedDay, selectedStartHour, selectedEndHour]);

  /**
   * Handle location submission and fetch weather data
   */
  const handleLocationSubmit = async () => {

    if (!location.trim()) {

      return;
    }
    
    try {

      // Fetch the weather data
      const data = await fetchWeatherData(location);
      

      
      // Process the data if we got it
      if (data) {
        processWeatherData(data);
      }
    } catch (error) {
      console.error('Error in handleLocationSubmit:', error);
    }
  };

  // When selected day or time range changes, process the data if we have it
  const updateWeatherDataForSelection = useCallback(() => {
    if (apiState.data) {
      processWeatherData(apiState.data);
    }
  }, [apiState.data, processWeatherData]);

  return {
    location,
    setLocation,
    selectedDay,
    setSelectedDay: (day: string) => {

      setSelectedDay(day);
      
      // Only update if we have real API data
      if (apiState.data) {

        updateWeatherDataForSelection();
      } else {

        // Don't update with mock data
      }
    },
    selectedStartHour,
    setSelectedStartHour: (hour: number) => {

      setSelectedStartHour(hour);
      
      // Only update if we have real API data
      if (apiState.data) {

        updateWeatherDataForSelection();
      }
    },
    selectedEndHour,
    setSelectedEndHour: (hour: number) => {

      setSelectedEndHour(hour);
      
      // Only update if we have real API data
      if (apiState.data) {

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
