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

export function getWeatherTags(weatherData: {
  tempmax?: number;
  precipprob?: number;
  precip?: number;
  windspeed?: number;
  windgust?: number;
  humidity?: number;
}): WeatherTagType[] {
  const tags: WeatherTagType[] = [];
    const {
    tempmax = 0,
    precipprob = 0,
    precip = 0,
    windspeed = 0,
    windgust = 0,
    humidity = 0
  } = weatherData;
  
  console.log("weatherDataabc", weatherData);
  
  if (tempmax >= 60 && tempmax <= 75 && precipprob < 30 && windspeed < 10) {
    tags.push('niceDay');
  }
  
  if (precipprob >= 30 || precip >= 0.2) {
    tags.push('chanceOfRain');
  }
  
  if (windspeed >= 15 || windgust >= 20) {
    tags.push('tooWindy');
  }
  
  if (tempmax >= 85) {
    tags.push('hotDay');
  }
  
  if (tempmax < 50) {
    tags.push('coldDay');
  }
  
  if (humidity >= 75) {
    console.log('Humid', humidity)
    tags.push('humid');
  }
  
  return tags;
}

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
