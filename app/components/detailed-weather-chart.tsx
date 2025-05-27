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
  Area,
  ComposedChart,
  Scatter
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { WeatherDay } from "../types/weatherApi"
import { WeatherTagInfo } from "../utils/weatherTags"

interface DetailedWeatherChartProps {
  day: WeatherDay
  tags?: WeatherTagInfo[]
  title: string
  description?: string
}

export default function DetailedWeatherChart({ 
  day, 
  tags, 
  title,
  description 
}: DetailedWeatherChartProps) {
  const [activeTab, setActiveTab] = useState("temperature")
  
  // Format hours data for charts
  const hourlyData = day.hours.map(hour => {
    // Extract hour from "HH:MM:SS" format
    const hourNum = parseInt(hour.datetime.split(':')[0])
    const formattedHour = hourNum > 12 ? `${hourNum - 12}PM` : `${hourNum}AM`
    
    return {
      hour: formattedHour,
      temp: hour.temp,
      feelslike: hour.feelslike,
      precipprob: hour.precipprob,
      windspeed: hour.windspeed,
      windgust: hour.windgust,
      humidity: hour.humidity
    }
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag, index) => (
              <div key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-foreground">
                <span className="mr-1">{tag.emoji}</span> {tag.label}
              </div>
            ))}
          </div>
        )}
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
            <ChartContainer
              config={{
                temp: {
                  label: "Temperature (°F)",
                  color: "hsl(var(--chart-1))",
                },
                feelslike: {
                  label: "Feels Like (°F)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="temp" 
                    stroke="var(--color-temp)" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Temperature"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="feelslike" 
                    stroke="var(--color-feelslike)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3 }}
                    name="Feels Like"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="text-xs text-muted-foreground mt-2">
              <p>High: {day.tempmax}°F | Low: {day.tempmin}°F</p>
            </div>
          </TabsContent>
          
          <TabsContent value="precipitation" className="w-full">
            <ChartContainer
              config={{
                precipprob: {
                  label: "Precipitation Probability (%)",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="precipprob" 
                    stroke="var(--color-precipprob)" 
                    fill="var(--color-precipprob)" 
                    fillOpacity={0.3}
                    name="Precipitation Probability"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="text-xs text-muted-foreground mt-2">
              <p>Average Precipitation Probability: {Math.round(day.precipprob)}%</p>
            </div>
          </TabsContent>
          
          <TabsContent value="wind" className="w-full">
            <ChartContainer
              config={{
                windspeed: {
                  label: "Wind Speed (mph)",
                  color: "hsl(var(--chart-4))",
                },
                windgust: {
                  label: "Wind Gust (mph)",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis domain={[0, 'dataMax + 5']} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    dataKey="windspeed" 
                    fill="var(--color-windspeed)" 
                    name="Wind Speed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="windgust" 
                    stroke="var(--color-windgust)" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Wind Gust"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="text-xs text-muted-foreground mt-2">
              <p>Average Wind Speed: {day.windspeed} mph | Max Gust: {day.windgust} mph</p>
            </div>
          </TabsContent>
          
          <TabsContent value="humidity" className="w-full">
            <ChartContainer
              config={{
                humidity: {
                  label: "Humidity (%)",
                  color: "hsl(var(--chart-6))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="var(--color-humidity)" 
                    fill="var(--color-humidity)" 
                    fillOpacity={0.3}
                    name="Humidity"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="text-xs text-muted-foreground mt-2">
              <p>Average Humidity: {Math.round(day.humidity)}%</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
