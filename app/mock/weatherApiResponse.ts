/**
 * Mock weather API response based on the format provided
 */

import { addDays, nextFriday } from "date-fns";

// Helper function to create date strings in the format "YYYY-MM-DD"
const formatDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get this Friday and next Friday
const thisFridayDate = nextFriday(new Date());
const nextFridayDate = addDays(thisFridayDate, 7);

// Mock API response for this Friday
export const thisFridayWeatherResponse = {
  latitude: 38.9697,
  longitude: -77.385,
  resolvedAddress: "Reston, VA, United States",
  address: "Reston, VA",
  timezone: "America/New_York",
  tzoffset: -5,
  description: "Mostly sunny with pleasant temperatures.",
  days: [
    {
      datetime: formatDateString(thisFridayDate),
      datetimeEpoch: Math.floor(thisFridayDate.getTime() / 1000),
      temp: 68.5,
      feelslike: 68.5,
      tempmax: 72,
      tempmin: 58,
      humidity: 65,
      precipprob: 15,
      precip: 0.1,
      windspeed: 8,
      windgust: 12,
      conditions: "Partly Cloudy",
      source: "fcst",
      hours: [
        {
          datetime: "13:00:00",
          temp: 67,
          feelslike: 67,
          humidity: 62,
          precipprob: 10,
          precip: 0,
          windspeed: 7,
          windgust: 10,
          conditions: "Partly Cloudy"
        },
        {
          datetime: "14:00:00",
          temp: 69,
          feelslike: 69,
          humidity: 60,
          precipprob: 12,
          precip: 0,
          windspeed: 7.5,
          windgust: 11,
          conditions: "Partly Cloudy"
        },
        {
          datetime: "15:00:00",
          temp: 71,
          feelslike: 71,
          humidity: 58,
          precipprob: 15,
          precip: 0,
          windspeed: 8,
          windgust: 12,
          conditions: "Partly Cloudy"
        },
        {
          datetime: "16:00:00",
          temp: 72,
          feelslike: 72,
          humidity: 57,
          precipprob: 15,
          precip: 0,
          windspeed: 8,
          windgust: 12,
          conditions: "Partly Cloudy"
        },
        {
          datetime: "17:00:00",
          temp: 70,
          feelslike: 70,
          humidity: 60,
          precipprob: 12,
          precip: 0,
          windspeed: 7,
          windgust: 11,
          conditions: "Partly Cloudy"
        },
        {
          datetime: "18:00:00",
          temp: 67,
          feelslike: 67,
          humidity: 65,
          precipprob: 10,
          precip: 0,
          windspeed: 6,
          windgust: 9,
          conditions: "Partly Cloudy"
        }
      ]
    }
  ],
  alerts: [],
  currentConditions: {
    datetime: new Date().toISOString(),
    datetimeEpoch: Math.floor(Date.now() / 1000),
    temp: 68,
    feelslike: 68,
    humidity: 65,
    precipprob: 15,
    precip: 0,
    windspeed: 8,
    windgust: 12,
    conditions: "Partly Cloudy"
  }
};

// Mock API response for next Friday
export const nextFridayWeatherResponse = {
  latitude: 38.9697,
  longitude: -77.385,
  resolvedAddress: "Reston, VA, United States",
  address: "Reston, VA",
  timezone: "America/New_York",
  tzoffset: -5,
  description: "Cooling down with a chance of rain.",
  days: [
    {
      datetime: formatDateString(nextFridayDate),
      datetimeEpoch: Math.floor(nextFridayDate.getTime() / 1000),
      temp: 63.5,
      feelslike: 63.5,
      tempmax: 65,
      tempmin: 52,
      humidity: 78,
      precipprob: 45,
      precip: 0.25,
      windspeed: 16,
      windgust: 22,
      conditions: "Rain, Overcast",
      source: "fcst",
      hours: [
        {
          datetime: "13:00:00",
          temp: 60,
          feelslike: 60,
          humidity: 75,
          precipprob: 40,
          precip: 0.15,
          windspeed: 14,
          windgust: 18,
          conditions: "Overcast"
        },
        {
          datetime: "14:00:00",
          temp: 62,
          feelslike: 62,
          humidity: 76,
          precipprob: 42,
          precip: 0.2,
          windspeed: 15,
          windgust: 20,
          conditions: "Light Rain"
        },
        {
          datetime: "15:00:00",
          temp: 65,
          feelslike: 65,
          humidity: 78,
          precipprob: 45,
          precip: 0.25,
          windspeed: 16,
          windgust: 22,
          conditions: "Light Rain"
        },
        {
          datetime: "16:00:00",
          temp: 64,
          feelslike: 64,
          humidity: 80,
          precipprob: 50,
          precip: 0.3,
          windspeed: 17,
          windgust: 23,
          conditions: "Rain"
        },
        {
          datetime: "17:00:00",
          temp: 62,
          feelslike: 62,
          humidity: 82,
          precipprob: 55,
          precip: 0.35,
          windspeed: 16,
          windgust: 21,
          conditions: "Rain"
        },
        {
          datetime: "18:00:00",
          temp: 58,
          feelslike: 58,
          humidity: 85,
          precipprob: 50,
          precip: 0.25,
          windspeed: 14,
          windgust: 19,
          conditions: "Light Rain"
        }
      ]
    }
  ],
  alerts: [
    {
      event: "Flash Flood Watch",
      description: "The National Weather Service has issued a Flash Flood Watch for this area from Friday afternoon through Friday evening. Heavy rainfall may result in flash flooding of low-lying and flood-prone areas.",
      headline: "Flash Flood Watch issued for Fairfax County"
    }
  ],
  currentConditions: {
    datetime: new Date().toISOString(),
    datetimeEpoch: Math.floor(Date.now() / 1000),
    temp: 63,
    feelslike: 63,
    humidity: 78,
    precipprob: 45,
    precip: 0,
    windspeed: 16,
    windgust: 22,
    conditions: "Overcast"
  }
};
