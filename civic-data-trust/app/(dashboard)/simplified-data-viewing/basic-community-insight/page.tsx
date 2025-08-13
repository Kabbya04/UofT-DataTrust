"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../components/ui/chart"
import { Users, Database, Trophy } from "lucide-react"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const monthlyData = [
  { month: "Jan", datasets: 4 },
  { month: "Feb", datasets: 7 },
  { month: "Mar", datasets: 3 },
  { month: "Apr", datasets: 8 },
  { month: "May", datasets: 5 },
  { month: "Jun", datasets: 6 },
]

const categoryData = [
  { name: "Research", value: 35, color: "#3b82f6" },
  { name: "Analytics", value: 25, color: "#10b981" },
  { name: "Training", value: 20, color: "#f59e0b" },
  { name: "Survey", value: 20, color: "#ef4444" },
]

const chartConfig = {
  datasets: {
    label: "Datasets",
    color: "#3b82f6",
  },
}
const BasicCommunityInsight = () => {
  return (
        <div className="min-h-screen dark:bg-neutral-900">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold  mb-2">Basic Community Insight</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Community: <span className="font-semibold text-blue-600 dark:text-blue-400">AI Ethics Research Group</span>
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg shadow-gray-800  dark:shadow-gray-700 dark:bg-neutral-950 transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-medium ">Total Members</CardTitle>
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold ">245</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active community members</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg shadow-gray-800 dark:shadow-gray-700 dark:bg-neutral-950 transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Number of Datasets</CardTitle>
              <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold ">18</div>
              <p className="text-xs text-gray-400 mt-1">Available datasets</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg shadow-gray-800 dark:shadow-gray-700 dark:bg-neutral-950 transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Top Contributor</CardTitle>
              <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ">Jane Doe</div>
              <p className="text-xs text-gray-400 mt-1">Most active contributor</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-neutral-950 duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold ">
                Datasets Added Per Month
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Monthly dataset upload trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} >
                    <XAxis  dataKey="month" tick={{ fill: "currentColor" }} axisLine={{ stroke: "currentColor" }} />
                    <YAxis tick={{ fill: "currentColor" }} axisLine={{ stroke: "currentColor" }} />
                    <ChartTooltip content={<ChartTooltipContent className="dark:bg-neutral-950"  />}  />
                    <Bar dataKey="datasets" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-neutral-950 duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold ">Dataset Categories</CardTitle>
              <CardDescription className="text-gray-500">
                Distribution of dataset types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="dark:bg-gray-800 p-3 border border-gray-900 dark:border-gray-700 rounded-lg shadow-lg">
                              <p className="font-medium ">{data.name}</p>
                              <p className="text-sm text-gray-800">{data.value}% of datasets</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {categoryData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BasicCommunityInsight