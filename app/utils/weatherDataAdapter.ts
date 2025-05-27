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
    return "sunny"; // Default or clear/sunny conditions
  }
}

/**
 * Extracts relevant hours for the meetup (3PM-6PM)
 */
function extractMeetupHours(day: WeatherDay) {
  // Filter hours between 3PM and 6PM (15:00 - 18:00)
  return day.hours
    .filter(hour => {
      const hourNum = parseInt(hour.datetime.split(':')[0]);
      return hourNum >= 13 && hourNum <= 18;
    })
    .map(hour => {
      // Convert 24-hour format to AM/PM
      const hourNum = parseInt(hour.datetime.split(':')[0]);
      const hourFormatted = hourNum > 12 ? `${hourNum - 12} PM` : `${hourNum} AM`;
      
      return {
        time: hourFormatted,
        temp: Math.round(hour.temp),
        precipitation: hour.precipprob
      };
    });
}

/**
 * Converts a Weather API response to the app's WeatherData format
 */
export function convertApiResponseToAppFormat(
  apiResponse: WeatherApiResponse, 
  date: Date
): WeatherData & { tags: WeatherTagInfo[] } {
  // Find the day that matches our target date
  const targetDateStr = date.toISOString().split('T')[0];
  const day = apiResponse.days.find(d => d.datetime === targetDateStr) || apiResponse.days[0];
  
  // Get weather tags
  const tags = getWeatherTagInfo(day);
  
  // Create a summary based on tags and description
  let summary = apiResponse.description;
  if (tags.length > 0) {
    summary = tags[0].label;
  }
  
  return {
    date,
    tempHigh: Math.round(day.tempmax),
    tempLow: Math.round(day.tempmin),
    precipitation: day.precipprob,
    windSpeed: day.windspeed,
    summary,
    condition: mapConditionToAppFormat(day.conditions),
    hourlyData: extractMeetupHours(day),
    tags
  };
}
