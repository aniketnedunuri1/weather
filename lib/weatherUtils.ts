import { WeatherApiResponse, WeatherDay } from "@/app/types/weatherApi";
import { format } from "date-fns";

export function findDayInForecast(
  forecast: WeatherApiResponse, 
  targetDay: string
): WeatherDay | undefined {
  if (!forecast || !forecast.days || forecast.days.length === 0) {
    return undefined;
  }

  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const targetDayIndex = dayNames.indexOf(targetDay.toLowerCase());
  
  if (targetDayIndex === -1) {
    return undefined;
  }
  
  const today = new Date();
  
  let daysUntilTarget = targetDayIndex - today.getDay();
  if (daysUntilTarget < 0) {
    daysUntilTarget += 7;
  }
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntilTarget);
  
  const targetDateStr = format(targetDate, 'yyyy-MM-dd');
  
  for (const day of forecast.days) {
    if (day.datetime === targetDateStr) {
      return day;
    }
  }
  
  return undefined;
}

export function findNextOccurrenceInForecast(
  forecast: WeatherApiResponse,
  targetDay: string,
  afterDate: Date
): WeatherDay | undefined {
  if (!forecast || !forecast.days || forecast.days.length === 0) {
    return undefined;
  }

  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const targetDayIndex = dayNames.indexOf(targetDay.toLowerCase());
  
  if (targetDayIndex === -1) {
    return undefined;
  }
  
  const nextWeekDate = new Date(afterDate);
  nextWeekDate.setDate(afterDate.getDate() + 7);
  
  const nextWeekDayIndex = nextWeekDate.getDay();
  let daysToAdjust = targetDayIndex - nextWeekDayIndex;
  
  if (daysToAdjust < 0) {
    daysToAdjust += 7;
  }
  
  const targetDate = new Date(nextWeekDate);
  targetDate.setDate(nextWeekDate.getDate() + daysToAdjust);
  
  const targetDateStr = format(targetDate, 'yyyy-MM-dd');
  
  for (const day of forecast.days) {
    if (day.datetime === targetDateStr) {
      return day;
    }
  }
  
  

  return undefined;
}

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
export function formatDateForDisplay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'EEEE, MMMM d');
}
