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
  submitted: string;
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

export function useWeather(): UseWeatherReturn {
  const [location, setLocation] = useState("");
  const [selectedDay, setSelectedDay] = useState("friday");
  const [selectedStartHour, setSelectedStartHour] = useState(12);
  const [selectedEndHour, setSelectedEndHour] = useState(17);
  const [meetupTime, setMeetupTime] = useState(
    adjustTimeToHour(getNextDayOccurrence("friday"), 14)
  );
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherState>({
    thisMeetup: emptyWeatherData,
    nextMeetup: emptyWeatherData
  });
  
  const weatherCache = useRef<Record<string, WeatherApiResponse>>({});
  const fetchWeatherData = useCallback(async (locationQuery: string): Promise<WeatherApiResponse | null> => {
    const normalizedLocation = locationQuery.trim().toLowerCase();
    
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

  const processWeatherData = useCallback((data: WeatherApiResponse | null) => {
    if (!data) return;

    const selectedDate = getNextDayOccurrence(selectedDay);
    const nextWeekDate = getNextOccurrence(selectedDate);
    const middleHour = Math.floor((selectedStartHour + selectedEndHour) / 2);
    
    const thisDate = adjustTimeToHour(selectedDate, middleHour);
    const nextDate = adjustTimeToHour(nextWeekDate, middleHour);
    
    setMeetupTime(thisDate);

    const thisMeetupDay = findDayInForecast(data, selectedDay);
    const nextMeetupDay = findNextOccurrenceInForecast(data, selectedDay, selectedDate);
    
    const timeRangeDisplay = `${formatHourForDisplay(selectedStartHour)} - ${formatHourForDisplay(selectedEndHour)}`;
    
    if (!thisMeetupDay) return;

    const thisMeetupData = {
      ...data,
      days: [thisMeetupDay],
      description: `Weather for ${format(thisDate, 'EEEE, MMMM d')} (${timeRangeDisplay})`
    };
    
    const nextMeetupData = nextMeetupDay 
      ? {
          ...data,
          days: [nextMeetupDay],
          description: `Weather for ${format(nextDate, 'EEEE, MMMM d')} (${timeRangeDisplay})`
        }
      : createEmptyDay(data, nextDate);

    const thisMeetupProcessed = convertApiResponseToAppFormat(
      thisMeetupData, 
      thisDate, 
      selectedStartHour, 
      selectedEndHour
    );
    
    const nextMeetupProcessed = convertApiResponseToAppFormat(
      nextMeetupData, 
      nextDate,
      selectedStartHour, 
      selectedEndHour
    );

    setWeatherData({
      thisMeetup: thisMeetupProcessed,
      nextMeetup: nextMeetupProcessed
    });
  }, [selectedDay, selectedStartHour, selectedEndHour]);

  const updateForCurrentSelection = useCallback(() => {
    if (!location.trim()) return;
    
    const normalizedLocation = location.trim().toLowerCase();
    const cachedData = weatherCache.current[normalizedLocation];
    
    if (cachedData) {
      processWeatherData(cachedData);
    }
  }, [location, processWeatherData]);

  const handleLocationSubmit = async () => {
    if (!location.trim()) return;
    
    try {
      const data = await fetchWeatherData(location);
      if (data) {
        processWeatherData(data);
        setSubmitted(location);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

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
    submitted,
    handleLocationSubmit
  };
}