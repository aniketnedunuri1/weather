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
import { getTimeRangeDisplay } from "@/lib/dateUtils"

interface WeatherChartTabsProps {
  thisMeetupDate: Date
  nextMeetupDate: Date
  startHour: number
  endHour: number
  dayName: string
  weatherData: {
    thisMeetup: any
    nextMeetup: any
  }
}

interface HourlyDataPoint {
  name: string
  temp: number
  precipprob: number
  windspeed: number
  hour: number
}

export default function WeatherChartTabs({ 
  thisMeetupDate,
  nextMeetupDate,
  startHour = 12,
  endHour = 17,
  weatherData
}: WeatherChartTabsProps) {
  const [activeTab, setActiveTab] = useState("temperature")
  
  const thisMeetupFormatted = format(thisMeetupDate, "MMM d")
  const nextMeetupFormatted = format(nextMeetupDate, "MMM d")
  
  const dayDisplayName = format(thisMeetupDate, "EEEE")
  
  const timeRange = getTimeRangeDisplay(startHour, endHour)
  
  const convertHourlyDataToChartFormat = (hourlyData: any[]): HourlyDataPoint[] => {
    return hourlyData.map(hour => ({
      name: hour.time,
      temp: hour.temp,
      precipprob: hour.precipitation,
      windspeed: hour.windSpeed,
      hour: parseInt(hour.time)
    }))
  }
  
  const thisMeetupHours = convertHourlyDataToChartFormat(weatherData.thisMeetup.hourlyData)
  const nextMeetupHours = convertHourlyDataToChartFormat(weatherData.nextMeetup.hourlyData)

  const combinedData: any[] = thisMeetupHours.map((thisHour, index) => ({
    name: thisHour.name,
    [thisMeetupFormatted]: thisHour.temp,
    [nextMeetupFormatted]: nextMeetupHours[index]?.temp || null,
    [`${thisMeetupFormatted}_precip`]: thisHour.precipprob,
    [`${nextMeetupFormatted}_precip`]: nextMeetupHours[index]?.precipprob || null,
    [`${thisMeetupFormatted}_wind`]: thisHour.windspeed,
    [`${nextMeetupFormatted}_wind`]: nextMeetupHours[index]?.windspeed || null
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          Weather Comparison for {dayDisplayName} {timeRange}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
            <TabsTrigger value="wind">Wind</TabsTrigger>
          </TabsList>
          
          <TabsContent value="temperature" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={combinedData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        unit="°" 
                        domain={['dataMin - 5', 'dataMax + 5']} 
                        ticks={Array.from(
                          { length: 10 }, 
                          (_, i) => Math.floor(Math.min(...combinedData.map(d => Math.min(d[thisMeetupFormatted], d[nextMeetupFormatted]))) - 5) + i * Math.ceil((Math.max(...combinedData.map(d => Math.max(d[thisMeetupFormatted], d[nextMeetupFormatted]))) + 5 - (Math.min(...combinedData.map(d => Math.min(d[thisMeetupFormatted], d[nextMeetupFormatted]))) - 5)) / 9)
                        )}
                      />
                      <Tooltip formatter={(value) => [`${value}°`, 'Temperature']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey={thisMeetupFormatted}
                        name={`${dayDisplayName} ${thisMeetupFormatted}`}
                        stroke="#ff7300" 
                        activeDot={{ r: 8 }} 
                        dot={{ fill: "#ff7300", r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={nextMeetupFormatted}
                        name={`${dayDisplayName} ${nextMeetupFormatted}`}
                        stroke="#3b82f6" 
                        activeDot={{ r: 8 }} 
                        dot={{ fill: "#3b82f6", r: 4 }}
                      />
                    </LineChart>
                    
                  </ResponsiveContainer>
                  
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          
          <TabsContent value="precipitation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Precipitation Chance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={combinedData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="%" domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Precipitation Chance']} />
                      <Legend />
                      <Bar 
                        type="monotone" 
                        dataKey={`${thisMeetupFormatted}_precip`}
                        name={`${dayDisplayName} ${thisMeetupFormatted}`}
                        stroke="#ff7300" 
                        fill="#ff7300" 
                       />
                      <Bar 
                        type="monotone" 
                        dataKey={`${nextMeetupFormatted}_precip`}
                        name={`${dayDisplayName} ${nextMeetupFormatted}`}
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                      />
                    </BarChart>
                    
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wind" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Wind Speed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={combinedData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="mph" />
                      <Tooltip formatter={(value) => [`${value} mph`, 'Wind Speed']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey={`${thisMeetupFormatted}_wind`}
                        name={`${dayDisplayName} ${thisMeetupFormatted}`}
                        stroke="#ff7300" 
                        activeDot={{ r: 8 }}
                        dot={{ fill: "#ff7300", r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={`${nextMeetupFormatted}_wind`}
                        name={`${dayDisplayName} ${nextMeetupFormatted}`}
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                        dot={{ fill: "#3b82f6", r: 4 }}
                      />
                    </LineChart>
                    
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
