"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { WeatherData } from "../types/weather"

interface WeatherChartProps {
  thisFriday: WeatherData
  nextFriday: WeatherData
}

export default function WeatherChart({ thisFriday, nextFriday }: WeatherChartProps) {
  // Prepare data for temperature comparison
  const tempData = [
    {
      day: "This Friday",
      high: thisFriday.tempHigh,
      low: thisFriday.tempLow,
    },
    {
      day: "Next Friday",
      high: nextFriday.tempHigh,
      low: nextFriday.tempLow,
    },
  ]

  // Prepare data for precipitation comparison
  const precipData = [
    {
      day: "This Friday",
      precipitation: thisFriday.precipitation,
    },
    {
      day: "Next Friday",
      precipitation: nextFriday.precipitation,
    },
  ]

  // Prepare hourly data for detailed view
  const hourlyData = thisFriday.hourlyData.map((thisData, index) => ({
    time: thisData.time,
    thisFridayTemp: thisData.temp,
    thisFridayPrecip: thisData.precipitation,
    nextFridayTemp: nextFriday.hourlyData[index]?.temp || 0,
    nextFridayPrecip: nextFriday.hourlyData[index]?.precipitation || 0,
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Temperature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Temperature Range (°F)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              high: {
                label: "High",
                color: "hsl(var(--chart-1))",
              },
              low: {
                label: "Low",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tempData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="high" fill="var(--color-high)" name="High" />
                <Bar dataKey="low" fill="var(--color-low)" name="Low" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Precipitation Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Precipitation Chance (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              precipitation: {
                label: "Precipitation",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={precipData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="precipitation" fill="var(--color-precipitation)" name="Precipitation %" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Hourly Comparison */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hourly Meetup Time Comparison (3-6 PM)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                thisFridayTemp: {
                  label: "This Friday Temp",
                  color: "hsl(var(--chart-1))",
                },
                nextFridayTemp: {
                  label: "Next Friday Temp",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="thisFridayTemp"
                    stroke="var(--color-thisFridayTemp)"
                    name="This Friday Temp (°F)"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="nextFridayTemp"
                    stroke="var(--color-nextFridayTemp)"
                    name="Next Friday Temp (°F)"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
