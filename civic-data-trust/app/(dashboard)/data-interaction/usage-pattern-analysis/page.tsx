"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart"
import { PieChart, BarChart3, TrendingUp, Eye, Database, Calendar, RefreshCw, Download } from "lucide-react"
import {
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Cell,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const accessDistributionData = [
  { name: "Data Viewing", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Downloads", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Uploads", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Visualizations", value: 10, color: "hsl(var(--chart-4))" },
]

const usageTrendsData = [
  { month: "Oct", views: 8 },
  { month: "Nov", views: 15 },
  { month: "Dec", views: 12 },
  { month: "Jan", views: 18 },
]

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },
}

const UsagePatternAnalysis = () => {
  return (
        <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold ">Usage Pattern Analysis</h1>
          <p className="text-gray-400 mt-2">Analyze data access patterns and user behavior</p>
        </div>
        <div className="flex items-center gap-2">
          <PieChart className="h-8 w-8 text-indigo-600" />
        </div>
      </div>

      {/* Time Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Analysis Period
          </CardTitle>
          <CardDescription>Select time range for usage analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select defaultValue="last-30-days">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 ">Datasets Viewed</p>
                <p className="text-3xl font-bold ">12</p>
                <p className="text-sm text-green-600 mt-1">+3 from last month</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Most Viewed Dataset</p>
                <p className="text-lg font-bold ">Example.csv</p>
                <p className="text-sm text-gray-500  mt-1">45 views</p>
              </div>
              <Database className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Downloads</p>
                <p className="text-3xl font-bold ">28</p>
                <p className="text-sm text-blue-600 mt-1">+5 this week</p>
              </div>
              <Download className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active Users</p>
                <p className="text-3xl font-bold ">8</p>
                <p className="text-sm text-orange-600 mt-1">2 new users</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Access Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-indigo-600" />
              Access Distribution
            </CardTitle>
            <CardDescription>Breakdown of different types of data interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">Pie Chart</Badge>
              <Badge variant="outline">Last 30 Days</Badge>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={accessDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {accessDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {accessDistributionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm ">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Usage Trends
            </CardTitle>
            <CardDescription>Monthly dataset view trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">Bar Chart</Badge>
              <Badge variant="outline">Monthly Data</Badge>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="50%" height="50%">
                <BarChart data={usageTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: "Views", angle: -90, position: "insideLeft" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="views" fill="var(--color-views)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Datasets */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Datasets</CardTitle>
          <CardDescription>Ranking of datasets by view count and user engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 ">
            {[
              { name: "Example.csv", views: 45, downloads: 12, size: "1.2 MB" },
              { name: "ClimateData.csv", views: 32, downloads: 8, size: "3.4 MB" },
              { name: "SalesReport.xlsx", views: 28, downloads: 15, size: "856 KB" },
              { name: "UserBehavior.json", views: 21, downloads: 6, size: "2.1 MB" },
            ].map((dataset, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium ">{dataset.name}</p>
                    <p className="text-sm ">Size: {dataset.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold ">{dataset.views}</p>
                    <p className="text-xs ">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold ">{dataset.downloads}</p>
                    <p className="text-xs ">Downloads</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Insights</CardTitle>
          <CardDescription>Key findings and recommendations based on usage patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Peak Usage Time</h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Most data interactions occur between 2-4 PM, suggesting optimal time for system maintenance is early
                morning.
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Popular File Types</h4>
              <p className="text-green-800 dark:text-green-200 text-sm">
                CSV files account for 60% of all views, indicating strong preference for tabular data formats.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UsagePatternAnalysis