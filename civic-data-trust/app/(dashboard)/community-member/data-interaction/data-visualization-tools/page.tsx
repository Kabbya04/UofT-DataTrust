"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/app/components/ui/chart"
import { BarChart3, PieChart, Settings, Download, RefreshCw } from "lucide-react"
import { Bar, BarChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LineChart } from "recharts"

const barChartData = [
  { category: "Category A", count: 45 },
  { category: "Category B", count: 32 },
]

const lineChartData = [
  { date: "Jan 1", value: 120 },
  { date: "Jan 2", value: 135 },
  { date: "Jan 3", value: 128 },
  { date: "Jan 4", value: 142 },
  { date: "Jan 5", value: 156 },
  { date: "Jan 6", value: 148 },
  { date: "Jan 7", value: 163 },
]

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
  value: {
    label: "Value",
    color: "hsl(var(--chart-2))",
  },
}


const DataVisualizationTools = () => {
  return (
        <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Visualization Tools</h1>
          <p className="text-gray-600 mt-2">Create and customize charts from your datasets</p>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-purple-600" />
        </div>
      </div>

      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Chart Configuration
          </CardTitle>
          <CardDescription>Select chart types and customize visualization settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center  gap-2">
              <label className="text-sm font-medium">Chart Type:</label>
              <Select defaultValue="bar">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Dataset:</label>
              <Select defaultValue="sample">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sample">SampleDataset.csv</SelectItem>
                  <SelectItem value="climate">ClimateData.csv</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Category Distribution
            </CardTitle>
            <CardDescription>Bar chart showing count by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">Bar Chart</Badge>
              <Badge variant="outline">Placeholder Data</Badge>
            </div>
            <ChartContainer config={chartConfig} className="h-[200px] text-white">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: "Count", angle: -90, position: "insideLeft" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600" />
              Value Trends
            </CardTitle>
            <CardDescription>Line chart showing value changes over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">Line Chart</Badge>
              <Badge variant="outline">Time Series</Badge>
            </div>
            <ChartContainer config={chartConfig} className="h-[220px] ">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} className="">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, color:"white" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: "Value", angle: -90, position: "insideLeft" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-value)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "var(--color-value)", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Chart Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium ">Available Charts</p>
                <p className="text-2xl font-bold ">8</p>
              </div>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium ">Data Points</p>
                <p className="text-2xl font-bold ">1,247</p>
              </div>
              <PieChart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium ">Visualizations</p>
                <p className="text-2xl font-bold ">2</p>
              </div>
              <PieChart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Information */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Information</CardTitle>
          <CardDescription>Details about the current visualization setup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Bar Chart Configuration</p>
                <p className="text-sm ">
                  X-axis: Category A, Category B | Y-axis: Count
                </p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Line Chart Configuration</p>
                <p className="text-sm ">X-axis: Dates | Y-axis: Value</p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DataVisualizationTools