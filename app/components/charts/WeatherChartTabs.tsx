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
import { formatHourForDisplay, getTimeRangeDisplay } from "@/lib/dateUtils"

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
  precip: number
  wind: number
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
  
  // Format the dates for display
  const thisMeetupFormatted = format(thisMeetupDate, "MMM d")
  const nextMeetupFormatted = format(nextMeetupDate, "MMM d")
  
  // Get day name for display
  const dayDisplayName = format(thisMeetupDate, "EEEE")
  
  // Get time range display
  const timeRange = getTimeRangeDisplay(startHour, endHour)
  
  // Convert hourly data from the weather API to chart format
  const convertHourlyDataToChartFormat = (hourlyData: any[]): HourlyDataPoint[] => {
    // if (!hourlyData || hourlyData.length === 0) {
    //   return generatePlaceholderData(startHour, endHour)
    // }
    
    return hourlyData.map(hour => ({
      name: hour.time,
      temp: hour.temp,
      precip: hour.precipprob,
      wind: hour.windspeed,
      hour: parseInt(hour.time)
    }))
  }
  
  // Generate placeholder data as fallback
  // const generatePlaceholderData = (startHour: number, endHour: number): HourlyDataPoint[] => {
  //   const hours: HourlyDataPoint[] = []
  //   for (let hour = startHour; hour <= endHour; hour++) {
  //     hours.push({
  //       name: formatHourForDisplay(hour),
  //       temp: Math.round(65 + Math.random() * 10),
  //       precip: Math.round(Math.random() * 50),
  //       wind: Math.round(5 + Math.random() * 10),
  //       hour: hour
  //     })
  //   }
  //   return hours
  // }
  
  // Get hourly data from the weather data
  const thisMeetupHours = convertHourlyDataToChartFormat(weatherData.thisMeetup.hourlyData)
  const nextMeetupHours = convertHourlyDataToChartFormat(weatherData.nextMeetup.hourlyData)
  
  // Combine data for comparison chart
  // const combinedData: any[] = []

  // console.log( "this", thisMeetupHours)
  // console.log("next", nextMeetupHours)
  
  // if (thisMeetupHours && nextMeetupHours) {
  //   // Make sure we have the same number of hours for both days
  //   const maxLength = Math.max(thisMeetupHours.length, nextMeetupHours.length)
    
  //   for (let i = 0; i < maxLength; i++) {
  //     const thisHour = thisMeetupHours[i] || {}
  //     const nextHour = nextMeetupHours[i] || {}
      
  //     combinedData.push({
  //       name: thisHour.name || nextHour.name,
  //       [thisMeetupFormatted]: thisHour.temp,
  //       [nextMeetupFormatted]: nextHour.temp,
  //       hour: thisHour.hour || nextHour.hour
  //     })
  //   }
  // }
  
  // // Sort combined data by hour
  // combinedData.sort((a, b) => a.hour - b.hour)
  
  // // Sort by hour
  // combinedData.sort((a: any, b: any) => a.hour - b.hour)
  // console.log("combined", combinedData)
  const combinedData: any[] = thisMeetupHours.map((thisHour, index) => ({
    name: thisHour.name,
    [thisMeetupFormatted]: thisHour.temp,
    [nextMeetupFormatted]: nextMeetupHours[index]?.temp || null
  }))
  console.log("combineddats", combinedData)


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weather Comparison for {dayDisplayName} {timeRange}</CardTitle>
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
                      <YAxis unit="°" domain={['dataMin - 5', 'dataMax + 5']} />
                      <Tooltip formatter={(value) => [`${value}°`, 'Temperature']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey={thisMeetupFormatted}
                        name={`${dayDisplayName} ${thisMeetupFormatted}`}
                        stroke="#ff7300" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey={nextMeetupFormatted}
                        name={`${dayDisplayName} ${nextMeetupFormatted}`}
                        stroke="#387908" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                    
                  </ResponsiveContainer>
                  
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>{dayDisplayName} {thisMeetupFormatted}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={thisMeetupHours}
                        margin={{
                          top: 10,
                          right: 10,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis unit="°" domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip formatter={(value) => [`${value}°`, 'Temperature']} />
                        <Area type="monotone" dataKey="temp" name="Temperature" stroke="#ff7300" fill="#ff730080" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{dayDisplayName} {nextMeetupFormatted}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={nextMeetupHours}
                        margin={{
                          top: 10,
                          right: 10,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis unit="°" domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip formatter={(value) => [`${value}°`, 'Temperature']} />
                        <Area type="monotone" dataKey="temp" name="Temperature" stroke="#387908" fill="#38790880" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                      data={[
                        {
                          name: `${dayDisplayName} ${thisMeetupFormatted}`,
                          value: thisMeetupHours[0]?.precip || 0
                        },
                        {
                          name: `${dayDisplayName} ${nextMeetupFormatted}`,
                          value: nextMeetupHours[0]?.precip || 0
                        }
                      ]}
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
                      <Tooltip formatter={(value) => [`${value}%`, 'Chance of Precipitation']} />
                      <Legend />
                      <Bar dataKey="value" name="Precipitation Chance" fill="#8884d8" />
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
                    <BarChart
                      data={[
                        {
                          name: `${dayDisplayName} ${thisMeetupFormatted}`,
                          value: thisMeetupHours[0]?.wind || 0
                        },
                        {
                          name: `${dayDisplayName} ${nextMeetupFormatted}`,
                          value: nextMeetupHours[0]?.wind || 0
                        }
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit=" mph" />
                      <Tooltip formatter={(value) => [`${value} mph`, 'Wind Speed']} />
                      <Legend />
                      <Bar dataKey="value" name="Wind Speed" fill="#82ca9d" />
                    </BarChart>
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
