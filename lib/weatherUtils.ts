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
  console.log('daysUntilTargetthis', daysUntilTarget);
  if (daysUntilTarget < 0) {
    // If target day is earlier in the week, find next week's occurrence
    daysUntilTarget += 7;
  }
  // If it's the same day (daysUntilTarget === 0), we want to use today
  
  // Calculate the target date
  const targetDate = new Date(today);
  console.log("targetDateTd", targetDate);
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
  
  // For next week's occurrence, always add 7 days to the afterDate
  const nextWeekDate = new Date(afterDate);
  nextWeekDate.setDate(afterDate.getDate() + 7);
  
  // Now find the specific day of the week in that next week
  const nextWeekDayIndex = nextWeekDate.getDay();
  let daysToAdjust = targetDayIndex - nextWeekDayIndex;
  
  if (daysToAdjust < 0) {
    daysToAdjust += 7;
  }
  
  // Calculate the target date for next week's occurrence
  const targetDate = new Date(nextWeekDate);
  targetDate.setDate(nextWeekDate.getDate() + daysToAdjust);
  
  // Format the target date as YYYY-MM-DD for comparison
  const targetDateStr = format(targetDate, 'yyyy-MM-dd');
  console.log("Next week target date:", targetDateStr);
  
  // Find the day in the forecast that matches our target date
  for (const day of forecast.days) {
    if (day.datetime === targetDateStr) {
      console.log("Found next week match:", day.datetime);
      return day;
    }
  }
  
  

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


/**
 * Format date for display
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDateForDisplay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'EEEE, MMMM d');
}
