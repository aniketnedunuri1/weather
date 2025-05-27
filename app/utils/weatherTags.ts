/**
 * Weather tag utility functions based on specified conditions
 * 
 * Tag Conditions:
 * ✅ "Nice Day" - tempmax 60–75°F, precipprob < 30%, windspeed < 10 mph
 * 🌧 "Chance of Rain" - precipprob ≥ 30% or precip ≥ 0.2 inches
 * 💨 "Too Windy" - windspeed ≥ 15 mph or windgust ≥ 20 mph
 * 🥵 "Hot Day" - tempmax ≥ 85°F
 * 🥶 "Cold Day" - tempmax < 50°F
 * 💦 "Humid" - humidity ≥ 75%
 */

export interface WeatherTagInfo {
  emoji: string;
  label: string;
  description: string;
}

export type WeatherTagType = 'niceDay' | 'chanceOfRain' | 'tooWindy' | 'hotDay' | 'coldDay' | 'humid';

export const WEATHER_TAGS: Record<WeatherTagType, WeatherTagInfo> = {
  niceDay: {
    emoji: '✅',
    label: 'Nice Day',
    description: 'Perfect weather for outdoor activities'
  },
  chanceOfRain: {
    emoji: '🌧',
    label: 'Chance of Rain',
    description: 'Bring an umbrella'
  },
  tooWindy: {
    emoji: '💨',
    label: 'Too Windy',
    description: 'Wind may affect outdoor activities'
  },
  hotDay: {
    emoji: '🥵',
    label: 'Hot Day',
    description: 'Stay hydrated and seek shade'
  },
  coldDay: {
    emoji: '🥶',
    label: 'Cold Day',
    description: 'Dress warmly'
  },
  humid: {
    emoji: '💦',
    label: 'Humid',
    description: 'High humidity may make it feel warmer'
  }
};

/**
 * Determines weather tags based on weather data
 * @param weatherData Weather data for a specific day
 * @returns Array of applicable weather tags
 */
export function getWeatherTags(weatherData: {
  tempmax?: number;
  precipprob?: number;
  precip?: number;
  windspeed?: number;
  windgust?: number;
  humidity?: number;
}): WeatherTagType[] {
  const tags: WeatherTagType[] = [];
  
  // Extract weather data with fallbacks to prevent undefined errors
  const {
    tempmax = 0,
    precipprob = 0,
    precip = 0,
    windspeed = 0,
    windgust = 0,
    humidity = 0
  } = weatherData;
  
  // Check conditions for each tag
  
  // Nice Day: tempmax 60–75°F, precipprob < 30%, windspeed < 10 mph
  if (tempmax >= 60 && tempmax <= 75 && precipprob < 30 && windspeed < 10) {
    tags.push('niceDay');
  }
  
  // Chance of Rain: precipprob ≥ 30% or precip ≥ 0.2 inches
  if (precipprob >= 30 || precip >= 0.2) {
    tags.push('chanceOfRain');
  }
  
  // Too Windy: windspeed ≥ 15 mph or windgust ≥ 20 mph
  if (windspeed >= 15 || windgust >= 20) {
    tags.push('tooWindy');
  }
  
  // Hot Day: tempmax ≥ 85°F
  if (tempmax >= 85) {
    tags.push('hotDay');
  }
  
  // Cold Day: tempmax < 50°F
  if (tempmax < 50) {
    tags.push('coldDay');
  }
  
  // Humid: humidity ≥ 75%
  if (humidity >= 75) {
    tags.push('humid');
  }
  
  return tags;
}

/**
 * Gets the weather tag info objects for the given weather data
 * @param weatherData Weather data for a specific day
 * @returns Array of weather tag info objects
 */
export function getWeatherTagInfo(weatherData: {
  tempmax?: number;
  precipprob?: number;
  precip?: number;
  windspeed?: number;
  windgust?: number;
  humidity?: number;
}): WeatherTagInfo[] {
  const tagTypes = getWeatherTags(weatherData);
  return tagTypes.map(tagType => WEATHER_TAGS[tagType]);
}
