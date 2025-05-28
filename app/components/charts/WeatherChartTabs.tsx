"use client"

import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeatherDay } from "@/app/types/weatherApi"
import { formatHourForDisplay, getTimeRangeDisplay } from "@/lib/dateUtils"

interface WeatherChartTabsProps {
  thisMeetupDay: WeatherDay
  nextMeetupDay: WeatherDay
  thisMeetupDate: Date
  nextMeetupDate: Date
  startHour: number
  endHour: number
  dayName: string
}

export default function WeatherChartTabs({ 
  thisMeetupDay, 
  nextMeetupDay,
  thisMeetupDate,
  nextMeetupDate,
  startHour = 12,
  endHour = 17,
  dayName = "friday"
}: WeatherChartTabsProps) {
  const [activeTab, setActiveTab] = useState("temperature")
  
  // Format the dates for display
  const thisMeetupFormatted = format(thisMeetupDate, "MMM d")
  const nextMeetupFormatted = format(nextMeetupDate, "MMM d")
  
  // Get day name for display
  const dayDisplayName = format(thisMeetupDate, "EEEE")
  
  // Get time range for display
  const timeRangeDisplay = getTimeRangeDisplay(startHour, endHour)
  
  // Format hours data for charts, filtering to only include the selected time range
  const formatHourlyData = () => {
    return thisMeetupDay.hours
      .filter((hour) => {
        // Extract hour from "HH:MM:SS" format
        const hourNum = parseInt(hour.datetime.split(':')[0])
        // Only include hours within the selected range
        return hourNum >= startHour && hourNum <= endHour
      })
      .map((hour, index, filteredHours) => {
        // Extract hour from "HH:MM:SS" format
        const hourNum = parseInt(hour.datetime.split(':')[0])
        const formattedHour = formatHourForDisplay(hourNum)
        
        // Find the corresponding hour in the next meetup day
        const nextMeetupHour = nextMeetupDay.hours.find(h => 
          parseInt(h.datetime.split(':')[0]) === hourNum
        ) || {
          temp: 0,
          precipprob: 0,
          windspeed: 0,
          humidity: 0
        } as Partial<WeatherDay['hours'][0]>
        
        return {
          hour: formattedHour,
          hourNum: hourNum, // Store the numeric hour for sorting
          [`this_temp`]: hour.temp,
          [`next_temp`]: nextMeetupHour.temp,
          [`this_precip`]: hour.precipprob,
          [`next_precip`]: nextMeetupHour.precipprob,
          [`this_wind`]: hour.windspeed,
          [`next_wind`]: nextMeetupHour.windspeed,
          [`this_humidity`]: hour.humidity,
          [`next_humidity`]: nextMeetupHour.humidity
        }
      })
      // Sort by hour to ensure chronological order
      .sort((a, b) => a.hourNum - b.hourNum)
  }

  const hourlyData = formatHourlyData()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weather Comparison for {dayDisplayName} {timeRangeDisplay}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
            <TabsTrigger value="wind">Wind</TabsTrigger>
            <TabsTrigger value="humidity">Humidity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="temperature" className="w-full">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="this_temp" 
                    stroke="#ff7300" 
                    strokeWidth={2}
                    name={`${thisMeetupFormatted} Temp (°F)`}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="next_temp" 
                    stroke="#0088fe" 
                    strokeWidth={2}
                    name={`${nextMeetupFormatted} Temp (°F)`}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-muted-foreground mt-2 grid grid-cols-2 gap-4">
              <p>{thisMeetupFormatted}: High {thisMeetupDay.tempmax}°F | Low {thisMeetupDay.tempmin}°F</p>
              <p>{nextMeetupFormatted}: High {nextMeetupDay.tempmax}°F | Low {nextMeetupDay.tempmin}°F</p>
            </div>
          </TabsContent>
          
          <TabsContent value="precipitation" className="w-full">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="this_precip" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                    name={`${thisMeetupFormatted} Precipitation (%)`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="next_precip" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.3}
                    name={`${nextMeetupFormatted} Precipitation (%)`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-muted-foreground mt-2 grid grid-cols-2 gap-4">
              <p>{thisMeetupFormatted}: Avg Precipitation {Math.round(thisMeetupDay.precipprob)}%</p>
              <p>{nextMeetupFormatted}: Avg Precipitation {Math.round(nextMeetupDay.precipprob)}%</p>
            </div>
          </TabsContent>
          
          <TabsContent value="wind" className="w-full">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis domain={[0, 'dataMax + 5']} />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="this_wind" 
                    fill="#ffc658" 
                    name={`${thisMeetupFormatted} Wind Speed (mph)`}
                  />
                  <Bar 
                    dataKey="next_wind" 
                    fill="#ff8042" 
                    name={`${nextMeetupFormatted} Wind Speed (mph)`}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-muted-foreground mt-2 grid grid-cols-2 gap-4">
              <p>{thisMeetupFormatted}: Avg Wind {thisMeetupDay.windspeed} mph</p>
              <p>{nextMeetupFormatted}: Avg Wind {nextMeetupDay.windspeed} mph</p>
            </div>
          </TabsContent>
          
          <TabsContent value="humidity" className="w-full">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="this_humidity" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                    name={`${thisMeetupFormatted} Humidity (%)`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="next_humidity" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.3}
                    name={`${nextMeetupFormatted} Humidity (%)`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-muted-foreground mt-2 grid grid-cols-2 gap-4">
              <p>{thisMeetupFormatted}: Avg Humidity {thisMeetupDay.humidity}%</p>
              <p>{nextMeetupFormatted}: Avg Humidity {nextMeetupDay.humidity}%</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
