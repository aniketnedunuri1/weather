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
  if (daysToAdd <= 0) daysToAdd += 7; // If it's in the past, get next week's occurrence
  
  return addDays(today, daysToAdd);
}

/**
 * Adjust a date to a specific time of day
 * @param date - The date to adjust
 * @param timeOfDay - The time of day ("morning", "afternoon", "evening")
 * @returns Date object adjusted to the specified time of day
 */
export function adjustTimeOfDay(date: Date, timeOfDay: string): Date {
  const times = {
    morning: 10, // 10 AM
    afternoon: 14, // 2 PM
    evening: 18 // 6 PM
  };
  
  return setMinutes(setHours(date, times[timeOfDay as keyof typeof times]), 0);
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
 * Get time of day display text
 * @param timeOfDay - The time of day key
 * @returns Formatted display text for the time of day
 */
export function getTimeOfDayDisplay(timeOfDay: string): string {
  const timeOfDayMap = {
    morning: "Morning (8-12)",
    afternoon: "Afternoon (12-5)",
    evening: "Evening (5-9)"
  };
  
  return timeOfDayMap[timeOfDay as keyof typeof timeOfDayMap] || "Afternoon";
}
