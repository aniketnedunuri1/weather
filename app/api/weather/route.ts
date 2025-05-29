import { NextRequest, NextResponse } from 'next/server';

// Get API key from environment variables
const API_KEY = process.env.WEATHER_API_KEY;

if (!API_KEY) {
  console.error('WEATHER_API_KEY environment variable is not set');
}
console.log('here')

/**
 * GET handler for /api/weather route
 * Proxies requests to Visual Crossing Weather API
 */
export async function GET(request: NextRequest) {
  // Get location from query params
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get('location');
  
  if (!location) {
    return NextResponse.json(
      { error: 'Location parameter is required' },
      { status: 400 }
    );
  }

  // Check if API key is available
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Weather API key is not configured. Please check server configuration.' },
      { status: 500 }
    );
  }
  console.log('here')
  try {
    const encodedLocation = encodeURIComponent(location.trim());
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedLocation}?key=${API_KEY}&include=hours`;
    
    const response = await fetch(url);

    console.log("Response: ", response);
    
    if (!response.ok) {
      // Handle HTTP errors
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
    
    // Log the API response for debugging
    console.log('Visual Crossing API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data. Please check your connection and try again.' },
      { status: 500 }
    );
  }
}
