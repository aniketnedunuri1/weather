/**
 * Date utility functions for the weather meetup app
 */
import { addDays, setHours, setMinutes } from "date-fns";

/**
 * Get the next occurrence of a specific day of the week
 * @param dayName - The name of the day (e.g., "monday", "tuesday")
 * @returns Date object for the next occurrence of that day
 */
export function getNextDayOccurrence(dayName: string): Date {
  const days = {
    monday: 1, 
    tuesday: 2, 
    wednesday: 3, 
    thursday: 4, 
    friday: 5, 
    saturday: 6, 
    sunday: 0
  };
  
  const dayNumber = days[dayName as keyof typeof days];
  const today = new Date();
  const currentDayNumber = today.getDay();
  
  // Calculate days to add
  let daysToAdd = dayNumber - currentDayNumber;
  
  // If it's the same day (today), use today's date
  // if (daysToAdd === 0) {
  //   return today;
  // }
  
  // // If the day is in the past, get next week's occurrence
  // if (daysToAdd < 0) daysToAdd += 7;

  if (daysToAdd < 0) daysToAdd += 7;
  
  return addDays(today, daysToAdd);
}

/**
 * Adjust a date to a specific hour
 * @param date - The date to adjust
 * @param hour - The hour to set (0-23)
 * @returns Date object adjusted to the specified hour
 */
export function adjustTimeToHour(date: Date, hour: number): Date {
  return setMinutes(setHours(date, hour), 0);
}

/**
 * Get the next occurrence of a date (one week later)
 * @param date - The base date
 * @returns Date object for one week after the input date
 */
export function getNextOccurrence(date: Date): Date {
  return addDays(date, 7);
}

/**
 * Format hour for display
 * @param hour - The hour (0-23)
 * @returns Formatted display text for the hour
 */
export function formatHourForDisplay(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

/**
 * Get time range display text
 * @param startHour - The start hour (0-23)
 * @param endHour - The end hour (0-23)
 * @returns Formatted display text for the time range
 */
export function getTimeRangeDisplay(startHour: number, endHour: number): string {
  return `${formatHourForDisplay(startHour)} - ${formatHourForDisplay(endHour)}`;
}
