import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

const API_KEY = process.env.WEATHER_API_KEY;

if (!API_KEY) {
  console.error('WEATHER_API_KEY environment variable is not set');
}


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get('location');
  
  if (!location) {
    return NextResponse.json(
      { error: 'Location parameter is required' },
      { status: 400 }
    );
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Weather API key is not configured. Please check server configuration.' },
      { status: 500 }
    );
  }
  try {
    const encodedLocation = encodeURIComponent(location.trim());
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedLocation}?key=${API_KEY}&include=hours`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 400) {
        return NextResponse.json(
          { error: 'Invalid location. Please check and try again.' },
          { status: 400 }
        );
      } else if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { error: 'API key error. Please check your credentials.' },
          { status: 401 }
        );
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      } else {
        return NextResponse.json(
          { error: `Weather API error: ${response.statusText}` },
          { status: response.status }
        );
      }
    }
    
    const data = await response.json();

    try {
      const filePath = path.join(process.cwd(), 'weather-api-response.json');
      await writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (writeError) {
      console.error('Error writing to weather-api-response.json:', writeError);
      
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data. Please check your connection and try again.' },
      { status: 500 }
    );
  }
}
