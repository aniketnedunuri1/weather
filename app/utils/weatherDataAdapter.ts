/**
 * Utility functions to convert Weather API response to app-friendly format
 */

import { WeatherData } from "../types/weather";
import { WeatherApiResponse, WeatherDay } from "../types/weatherApi";
import { getWeatherTagInfo, WeatherTagInfo } from "./weatherTags";

/**
 * Maps API weather conditions to app condition types
 */
function mapConditionToAppFormat(condition: string): "sunny" | "cloudy" | "rainy" {
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes("rain") || lowerCondition.includes("shower") || lowerCondition.includes("drizzle")) {
    return "rainy";
  } else if (lowerCondition.includes("cloud") || lowerCondition.includes("overcast")) {
    return "cloudy";
  } else {
    return "sunny";
  }
}

/**
 * Extracts relevant hours for the meetup based on the specified time range
 */
function extractMeetupHours(day: WeatherDay, startHour: number = 12, endHour: number = 17) {
  if (!day.hours || day.hours.length === 0) {
    return [];
  }
  
  return day.hours
    .filter(hour => {
      const hourNum = hour.datetime.includes(':') 
        ? parseInt(hour.datetime.split(':')[0])
        : parseInt(hour.datetime);
      
      return hourNum >= startHour && hourNum <= endHour;
    })
    .map(hour => {
      const hourNum = hour.datetime.includes(':') 
        ? parseInt(hour.datetime.split(':')[0])
        : parseInt(hour.datetime);
      
      const hourFormatted = hourNum === 0 ? '12 AM' : 
                           hourNum === 12 ? '12 PM' : 
                           hourNum > 12 ? `${hourNum - 12} PM` : `${hourNum} AM`;
      
      return {
        time: hourFormatted,
        temp: Math.round(hour.temp),
        precipitation: hour.precipprob || 0,
        windSpeed: hour.windspeed || 0,
      };
    });
}

/**
 * Converts a Weather API response to the app's WeatherData format
 */
export function convertApiResponseToAppFormat(
  apiResponse: WeatherApiResponse, 
  date: Date,
  startHour: number = 12,
  endHour: number = 17
): WeatherData & { tags: WeatherTagInfo[] } {
  const day = apiResponse.days[0];
  
  console.log('Converting day to app format:', {
    datetime: day.datetime,
    tempHigh: day.tempmax,
    tempLow: day.tempmin,
    precip: day.precipprob,
    wind: day.windspeed
  });
  

  const tags = getWeatherTagInfo(day);
  console.log('abc',apiResponse)
  
  let summary = apiResponse.days[0].description || '';  // if (tags.length > 0) {
  //   summary = tags[0].label;
  // }
  
  return {
    date,
    tempHigh: Math.round(day.tempmax || day.temp || 0),
    tempLow: Math.round(day.tempmin || day.temp || 0),
    precipitation: day.precipprob || 0,
    windSpeed: day.windspeed || 0,
    summary,
    condition: mapConditionToAppFormat(day.conditions || ''),
    hourlyData: extractMeetupHours(day, startHour, endHour),
    tags
  };
}
