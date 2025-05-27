/**
 * Types for the Weather API response
 */

// Hour of weather data
export interface WeatherHour {
  datetime: string;
  temp: number;
  feelslike: number;
  humidity: number;
  precipprob: number;
  precip: number;
  windspeed: number;
  windgust: number;
  conditions: string;
  [key: string]: any; // For any additional properties
}

// Day of weather data
export interface WeatherDay {
  datetime: string;
  datetimeEpoch: number;
  temp: number;
  feelslike: number;
  tempmax: number;
  tempmin: number;
  humidity: number;
  precipprob: number;
  precip: number;
  windspeed: number;
  windgust: number;
  conditions: string;
  source: string;
  hours: WeatherHour[];
  [key: string]: any; // For any additional properties
}

// Weather alert
export interface WeatherAlert {
  event: string;
  description: string;
  headline?: string;
  [key: string]: any; // For any additional properties
}

// Current conditions
export interface CurrentConditions {
  datetime: string;
  datetimeEpoch: number;
  temp: number;
  feelslike: number;
  humidity: number;
  precipprob: number;
  precip: number;
  windspeed: number;
  windgust: number;
  conditions: string;
  [key: string]: any; // For any additional properties
}

// Complete weather API response
export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  resolvedAddress: string;
  address: string;
  timezone: string;
  tzoffset: number;
  description: string;
  days: WeatherDay[];
  alerts: WeatherAlert[];
  currentConditions: CurrentConditions;
  [key: string]: any; // For any additional properties
}
