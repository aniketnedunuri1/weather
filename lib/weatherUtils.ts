/**
 * Weather utility functions for processing API data
 */
import { WeatherApiResponse, WeatherDay } from "@/app/types/weatherApi";
import { format } from "date-fns";

/**
 * Find a specific day in the forecast by date string or day of week
 * @param forecast - The weather forecast data
 * @param targetDay - Target day name (e.g., "friday")
 * @returns The matching day or undefined if not found
 */
export function findDayInForecast(
  forecast: WeatherApiResponse, 
  targetDay: string
): WeatherDay | undefined {
  if (!forecast || !forecast.days || forecast.days.length === 0) {
    return undefined;
  }

  // Get the day index (0 = Sunday, 1 = Monday, etc.)
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const targetDayIndex = dayNames.indexOf(targetDay.toLowerCase());
  
  if (targetDayIndex === -1) {
    return undefined;
  }
  
  // Use the current date
  const today = new Date();
  
  // Calculate how many days until the target day
  let daysUntilTarget = targetDayIndex - today.getDay();
  console.log('daysUntilTarget', daysUntilTarget);
  if (daysUntilTarget < 0) {
    // If target day is earlier in the week, find next week's occurrence
    daysUntilTarget += 7;
  }
  // If it's the same day (daysUntilTarget === 0), we want to use today
  
  // Calculate the target date
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntilTarget);
  
  // Format the target date as YYYY-MM-DD for comparison
  const targetDateStr = format(targetDate, 'yyyy-MM-dd');
  
  console.log(`Looking for ${targetDay} (${targetDateStr}) in forecast`);
  
  // First try to find the exact date match
  for (const day of forecast.days) {
    if (day.datetime === targetDateStr) {
      console.log(`Found exact date match for ${targetDay}: ${day.datetime}`);
      return day;
    }
  }
  
  // If we can't find the exact date, try to find by day of week
  console.log(`Exact date not found, looking for day of week match for ${targetDay}`);
  for (const day of forecast.days) {
    const dayDate = new Date(day.datetime);
    if (dayDate.getDay() === targetDayIndex) {
      console.log(`Found day of week match for ${targetDay}: ${day.datetime}`);
      return day;
    }
  }
  
  // If we can't find the exact date, find the closest day with matching day of week
  // console.log(`Exact date not found, looking for closest ${targetDay}`);
  // for (const day of forecast.days) {
  //   const dayDate = new Date(day.datetime);
  //   if (dayDate.getDay() === targetDayIndex) {
  //     console.log(`Found day with matching day of week: ${day.datetime}`);
  //     return day;
  //   }
  // }
  
  //console.log(`No matching day found for ${targetDay}`);
  return undefined;
}

/**
 * Find the next occurrence of a specific day in the forecast
 * @param forecast - The weather forecast data
 * @param targetDay - Target day name (e.g., "friday")
 * @param afterDate - Find the occurrence after this date
 * @returns The matching day or undefined if not found
 */
export function findNextOccurrenceInForecast(
  forecast: WeatherApiResponse,
  targetDay: string,
  afterDate: Date
): WeatherDay | undefined {
  if (!forecast || !forecast.days || forecast.days.length === 0) {
    return undefined;
  }

  // Get the day index (0 = Sunday, 1 = Monday, etc.)
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const targetDayIndex = dayNames.indexOf(targetDay.toLowerCase());
  console.log("targetDayIndex", targetDayIndex);
  
  if (targetDayIndex === -1) {
    return undefined;
  }
  
  // Calculate how many days until the next occurrence of the target day
  // Make sure we're using the correct date for calculations

  
  const afterDateDayIndex = afterDate.getDay();
  console.log("afterDateDayIndex", afterDateDayIndex);
  let daysUntilTarget = targetDayIndex - afterDateDayIndex;
  if (daysUntilTarget <= 0) {
    // If target day is earlier in the week, find next week's occurrence
    daysUntilTarget += 7;
  }
  // If it's the same day (daysUntilTarget === 0), we want to use that day
  

  
  // Calculate the target date (next occurrence after afterDate)
  const targetDate = new Date(afterDate);
  targetDate.setDate(afterDate.getDate() + daysUntilTarget);
  
  // Format the target date as YYYY-MM-DD for comparison
  const targetDateStr = format(targetDate, 'yyyy-MM-dd');  

  console.log("targetDateStr", targetDateStr);
  
  // Find the day in the forecast that matches our target date
  console.log("forecast.days", forecast);
  for (const day of forecast.days) {
    if (day.datetime === targetDateStr) {

      return day;
    }
  }
  
  // If we can't find the exact date, find the closest day with matching day of week that's after afterDate

  // for (const day of forecast.days) {
  //   const dayDate = new Date(day.datetime);
  //   if (dayDate.getDay() === targetDayIndex && dayDate > afterDate) {

  //     return day;
  //   }
  // }
  

  return undefined;
}

/**
 * Filter hours in a day to a specific time range
 * @param day - The weather day data
 * @param startHour - Start hour (0-23)
 * @param endHour - End hour (0-23)
 * @returns Array of filtered hours
 */
export function filterHoursByTimeRange(
  day: WeatherDay | undefined, 
  startHour: number, 
  endHour: number
): WeatherDay['hours'] {
  if (!day || !day.hours) {
    return [];
  }
  
  return day.hours.filter(hour => {
    const hourNum = parseInt(hour.datetime.split(':')[0]);
    return hourNum >= startHour && hourNum <= endHour;
  });
}

/**
 * Generate a weather summary based on conditions
 * @param day - The weather day data
 * @param timeRange - Optional string describing the time range
 * @returns A summary string
 */
export function therSummgenerateWeaary(day: WeatherDay | undefined, timeRange?: string): string {
  if (!day) {
    return "Weather data unavailable";
  }

  const conditions = day.conditions.toLowerCase();
  const temp = day.tempmax;
  
  const precipProb = day.precipprob;
  
  let summary = "";
  
  if (conditions.includes("rain") || conditions.includes("shower") || precipProb > 50) {
    summary = "Chance of Rain";
  } else if (conditions.includes("cloud") || conditions.includes("overcast")) {
    summary = "Cloudy";
  } else if (temp > 85) {
    summary = "Hot Day";
  } else if (temp < 50) {
    summary = "Cold Day";
  } else {
    summary = "Nice Day";
  }
  
  if (timeRange) {
    return `${summary} (${timeRange})`;
  }
  
  return summary;
}

/**
 * Format date for display
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDateForDisplay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'EEEE, MMMM d');
}
