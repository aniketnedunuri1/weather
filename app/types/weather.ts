export interface WeatherData {
  date: Date
  tempHigh: number
  tempLow: number
  precipitation: number
  windSpeed: number
  summary: string
  condition: "sunny" | "cloudy" | "rainy"
  hourlyData: {
    time: string
    temp: number
    precipitation: number
  }[]
}
