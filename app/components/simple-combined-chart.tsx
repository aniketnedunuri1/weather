"use client"

import { useState } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeatherDay } from "../types/weatherApi"
import { format } from "date-fns"

interface SimpleCombinedChartProps {
  thisFridayDay: WeatherDay
  nextFridayDay: WeatherDay
  thisFridayDate: Date
  nextFridayDate: Date
}

export default function SimpleCombinedChart({ 
  thisFridayDay, 
  nextFridayDay,
  thisFridayDate,
  nextFridayDate
}: SimpleCombinedChartProps) {
  const [activeTab, setActiveTab] = useState("temperature")
  
  // Format the dates for display
  const thisFridayFormatted = format(thisFridayDate, "MMM d")
  const nextFridayFormatted = format(nextFridayDate, "MMM d")
  
  // Format hours data for charts
  const formatHourlyData = () => {
    return thisFridayDay.hours.map((hour, index) => {
      // Extract hour from "HH:MM:SS" format
      const hourNum = parseInt(hour.datetime.split(':')[0])
      const formattedHour = hourNum > 12 ? `${hourNum - 12}PM` : `${hourNum}AM`
      
      // Get corresponding hour from next Friday (if available)
      const nextFridayHour = nextFridayDay.hours[index] || {}
      
      return {
        hour: formattedHour,
        [`this_temp`]: hour.temp,
        [`next_temp`]: nextFridayHour.temp,
        [`this_precip`]: hour.precipprob,
        [`next_precip`]: nextFridayHour.precipprob,
        [`this_wind`]: hour.windspeed,
        [`next_wind`]: nextFridayHour.windspeed,
        [`this_humidity`]: hour.humidity,
        [`next_humidity`]: nextFridayHour.humidity
      }
    })
  }

  const hourlyData = formatHourlyData()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weather Comparison</CardTitle>
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
                    name={`${thisFridayFormatted} Temp (°F)`}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="next_temp" 
                    stroke="#0088fe" 
                    strokeWidth={2}
                    name={`${nextFridayFormatted} Temp (°F)`}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-muted-foreground mt-2 grid grid-cols-2 gap-4">
              <p>{thisFridayFormatted}: High {thisFridayDay.tempmax}°F | Low {thisFridayDay.tempmin}°F</p>
              <p>{nextFridayFormatted}: High {nextFridayDay.tempmax}°F | Low {nextFridayDay.tempmin}°F</p>
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
                    name={`${thisFridayFormatted} Precipitation (%)`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="next_precip" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.3}
                    name={`${nextFridayFormatted} Precipitation (%)`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-muted-foreground mt-2 grid grid-cols-2 gap-4">
              <p>{thisFridayFormatted}: Avg Precipitation {Math.round(thisFridayDay.precipprob)}%</p>
              <p>{nextFridayFormatted}: Avg Precipitation {Math.round(nextFridayDay.precipprob)}%</p>
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
                    name={`${thisFridayFormatted} Wind Speed (mph)`}
                  />
                  <Bar 
                    dataKey="next_wind" 
                    fill="#ff8042" 
                    name={`${nextFridayFormatted} Wind Speed (mph)`}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-muted-foreground mt-2 grid grid-cols-2 gap-4">
              <p>{thisFridayFormatted}: Avg Wind {thisFridayDay.windspeed} mph</p>
              <p>{nextFridayFormatted}: Avg Wind {nextFridayDay.windspeed} mph</p>
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
                    name={`${thisFridayFormatted} Humidity (%)`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="next_humidity" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.3}
                    name={`${nextFridayFormatted} Humidity (%)`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-muted-foreground mt-2 grid grid-cols-2 gap-4">
              <p>{thisFridayFormatted}: Avg Humidity {Math.round(thisFridayDay.humidity)}%</p>
              <p>{nextFridayFormatted}: Avg Humidity {Math.round(nextFridayDay.humidity)}%</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
