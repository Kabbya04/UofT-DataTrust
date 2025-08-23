"use client"

import { useState, useCallback, useMemo } from "react"
import { Eye, ChevronDown, Database, TrendingUp, TrendingDown, Maximize2, Minimize2, RotateCcw } from "lucide-react"
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Cell, Legend, Brush } from "recharts"
import { ChartContainer, ChartTooltip } from "./ui/chart"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

// Enhanced mock data structures for dynamic filtering
interface PerformanceDataItem {
  id: string
  title: string
  date: string
  dateValue: Date
  size: string
  views: number
  researchUsage: number
  downloads: number
  category: string
  growth: string
}

interface AudienceStatItem {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  trend: 'up' | 'down' | 'neutral'
  category?: string
  rawValue: number
}

interface TrendDataPoint {
  day: number
  date: string
  dateValue: Date
  value: number
  usage: number
  category: string
}

export function StatisticsWF() {
  const [dataFilter, setDataFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("30")
  const [expandedChart, setExpandedChart] = useState<'pie' | 'line' | null>(null)
  const [brushRange, setBrushRange] = useState<[number, number] | null>(null)

  // Set proper breadcrumbs for statistics page

  // Enhanced mock data with realistic variety across categories and dates
  const allPerformanceData: PerformanceDataItem[] = useMemo(() => [
    {
      id: "1",
      title: "Global Healthcare Analytics Dataset",
      date: "15 Aug 2025",
      dateValue: new Date("2025-08-15"),
      size: "3.2 GB",
      views: 15647,
      researchUsage: 8934,
      downloads: 2341,
      category: "Healthcare",
      growth: "+23%"
    },
    {
      id: "2", 
      title: "COVID-19 Vaccination Efficacy Data",
      date: "10 Aug 2025",
      dateValue: new Date("2025-08-10"),
      size: "1.1 GB",
      views: 22456,
      researchUsage: 12567,
      downloads: 4123,
      category: "Healthcare",
      growth: "+45%"
    },
    {
      id: "3",
      title: "Machine Learning Stock Predictions",
      date: "12 Aug 2025", 
      dateValue: new Date("2025-08-12"),
      size: "856 MB",
      views: 9823,
      researchUsage: 4567,
      downloads: 1234,
      category: "Finance",
      growth: "+31%"
    },
    {
      id: "4",
      title: "Cryptocurrency Market Analysis 2024-2025",
      date: "8 Aug 2025",
      dateValue: new Date("2025-08-08"),
      size: "2.4 GB", 
      views: 18934,
      researchUsage: 9876,
      downloads: 3456,
      category: "Finance",
      growth: "+67%"
    },
    {
      id: "5",
      title: "AI-Powered Code Generation Datasets",
      date: "14 Aug 2025",
      dateValue: new Date("2025-08-14"),
      size: "4.8 GB",
      views: 31245,
      researchUsage: 18765,
      downloads: 5432,
      category: "Technology",
      growth: "+89%"
    },
    {
      id: "6",
      title: "Neural Network Architecture Performance",
      date: "11 Aug 2025",
      dateValue: new Date("2025-08-11"),
      size: "1.9 GB",
      views: 12654,
      researchUsage: 7890,
      downloads: 2109,
      category: "Technology", 
      growth: "+34%"
    },
    {
      id: "7",
      title: "Climate Change Impact Models", 
      date: "5 Aug 2025",
      dateValue: new Date("2025-08-05"),
      size: "4.1 GB",
      views: 18934,
      researchUsage: 11245,
      downloads: 3456,
      category: "Environment",
      growth: "+8%"
    },
    {
      id: "8",
      title: "Carbon Footprint Analysis by Industry",
      date: "7 Aug 2025",
      dateValue: new Date("2025-08-07"),
      size: "2.7 GB",
      views: 14523,
      researchUsage: 8765,
      downloads: 2987,
      category: "Environment",
      growth: "+15%"
    },
    {
      id: "9",
      title: "Online Learning Effectiveness Study",
      date: "9 Aug 2025",
      dateValue: new Date("2025-08-09"), 
      size: "1.5 GB",
      views: 9876,
      researchUsage: 5432,
      downloads: 1654,
      category: "Education",
      growth: "+12%"
    },
    {
      id: "10",
      title: "Student Performance Analytics",
      date: "6 Aug 2025",
      dateValue: new Date("2025-08-06"),
      size: "987 MB",
      views: 7654,
      researchUsage: 4321,
      downloads: 1098,
      category: "Education",
      growth: "+28%"
    },
    {
      id: "11",
      title: "Gaming Behavior Analytics",
      date: "2 Aug 2025",
      dateValue: new Date("2025-08-02"),
      size: "2.7 GB", 
      views: 7654,
      researchUsage: 3421,
      downloads: 987,
      category: "Games",
      growth: "-2%"
    },
    {
      id: "12",
      title: "E-sports Performance Metrics",
      date: "4 Aug 2025",
      dateValue: new Date("2025-08-04"),
      size: "1.8 GB",
      views: 11234,
      researchUsage: 6543,
      downloads: 1876,
      category: "Games",
      growth: "+19%"
    }
  ], [])

  // Generate comprehensive trend data across categories and time periods
  const allTrendData: TrendDataPoint[] = useMemo(() => {
    const categories = ["Healthcare", "Finance", "Technology", "Environment", "Education", "Games"]
    const data: TrendDataPoint[] = []
    
    // Generate 90 days of data - one entry per day with aggregated values
    for (let i = 0; i < 90; i++) {
      const date = new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000)
      
      // Calculate aggregate usage for all categories for this day
      let totalUsage = 0
      categories.forEach(category => {
        let baseValue = 20
        let trend = 1
        
        switch (category) {
          case "Healthcare": baseValue = 35; trend = 1.2; break
          case "Finance": baseValue = 25; trend = 1.5; break  
          case "Technology": baseValue = 45; trend = 1.8; break
          case "Environment": baseValue = 15; trend = 0.8; break
          case "Education": baseValue = 18; trend = 1.1; break
          case "Games": baseValue = 12; trend = 0.9; break
        }
        
        const timeComponent = Math.sin(i * 0.1) * 2
        const categoryTrend = (i * trend) / 20
        const noise = Math.sin(i * 0.3 + category.length) * 2 // Deterministic noise based on category
        
        totalUsage += Math.max(2, Math.floor(baseValue + timeComponent + categoryTrend + noise))
      })
      
      data.push({
        day: i + 1,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dateValue: date,
        value: totalUsage,
        usage: totalUsage,
        category: "All" // Use a consistent category for aggregated data
      })
    }
    
    return data
  }, [])

  // Chart configuration for themes
  const chartConfig = {
    healthcare: { label: "Healthcare", color: "hsl(26 83% 58%)" },
    finance: { label: "Finance", color: "hsl(26 83% 58% / 0.8)" },
    technology: { label: "Technology", color: "hsl(26 83% 58% / 0.6)" },
    environment: { label: "Environment", color: "hsl(26 83% 58% / 0.4)" },
    education: { label: "Education", color: "hsl(26 83% 58% / 0.2)" },
    games: { label: "Games", color: "hsl(26 83% 58% / 0.3)" }
  }

  // Dynamic filtering logic
  const filteredData = useMemo(() => {
    const now = new Date()
    const daysAgo = parseInt(timeFilter)
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    
    // Filter performance data
    let filteredPerformance = allPerformanceData.filter(item => 
      item.dateValue >= cutoffDate
    )
    
    if (dataFilter !== "all") {
      filteredPerformance = filteredPerformance.filter(item => 
        item.category.toLowerCase() === dataFilter.toLowerCase()
      )
    }
    
    // Filter trend data
    let filteredTrend: TrendDataPoint[] = []
    
    if (dataFilter === "all") {
      // For "all", use the aggregated trend data
      filteredTrend = allTrendData.filter(item => item.dateValue >= cutoffDate)
    } else {
      // For specific categories, generate category-specific trend data
      const categoryData: TrendDataPoint[] = []
      const daysInRange = Math.ceil((now.getTime() - cutoffDate.getTime()) / (24 * 60 * 60 * 1000))
      
      for (let i = 0; i < daysInRange; i++) {
        const date = new Date(cutoffDate.getTime() + i * 24 * 60 * 60 * 1000)
        
        let baseValue = 20
        let trend = 1
        
        switch (dataFilter.toLowerCase()) {
          case "healthcare": baseValue = 35; trend = 1.2; break
          case "finance": baseValue = 25; trend = 1.5; break  
          case "technology": baseValue = 45; trend = 1.8; break
          case "environment": baseValue = 15; trend = 0.8; break
          case "education": baseValue = 18; trend = 1.1; break
          case "games": baseValue = 12; trend = 0.9; break
        }
        
        const timeComponent = Math.sin(i * 0.1) * 8
        const categoryTrend = (i * trend) / 10
        const noise = Math.sin(i * 0.3 + dataFilter.length) * 3 // Deterministic noise
        
        const usage = Math.max(5, Math.floor(baseValue + timeComponent + categoryTrend + noise))
        
        categoryData.push({
          day: i + 1,
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          dateValue: date,
          value: usage,
          usage: usage,
          category: dataFilter
        })
      }
      
      filteredTrend = categoryData
    }
    
    // Generate category data based on filtered performance data
    const categoryStats = new Map<string, number>()
    filteredPerformance.forEach(item => {
      const current = categoryStats.get(item.category) || 0
      categoryStats.set(item.category, current + item.views + item.downloads + item.researchUsage)
    })
    
    const totalUsage = Array.from(categoryStats.values()).reduce((sum, val) => sum + val, 0)
    const categoryData = Array.from(categoryStats.entries()).map(([category, usage], index) => ({
      name: category,
      value: totalUsage > 0 ? Math.round((usage / totalUsage) * 100) : 0,
      fill: `hsl(26 83% 58% / ${1 - (index * 0.15)})`
    }))
    
    // Calculate audience stats based on filtered data
    const totalViews = filteredPerformance.reduce((sum, item) => sum + item.views, 0)
    const totalRequests = filteredPerformance.reduce((sum, item) => sum + item.researchUsage, 0)
    const totalApproved = filteredPerformance.reduce((sum, item) => sum + item.downloads, 0)
    
    // Calculate growth percentages (deterministic for demo)
    const baseGrowth = dataFilter === "all" ? 18 : 
                       dataFilter === "technology" ? 35 :
                       dataFilter === "healthcare" ? 28 :
                       dataFilter === "finance" ? 22 :
                       dataFilter === "environment" ? 12 :
                       dataFilter === "education" ? 15 : 8
    const viewsGrowth = baseGrowth + 5
    const requestsGrowth = baseGrowth + 10  
    const approvedGrowth = baseGrowth - 8
    
    const audienceStats: AudienceStatItem[] = [
      {
        title: "Project views",
        value: totalViews.toLocaleString(),
        change: `+ ${viewsGrowth}% vs last month`,
        icon: <Eye className="h-4 w-4" />,
        trend: "up",
        rawValue: totalViews
      },
      {
        title: "Access Request",
        value: totalRequests.toLocaleString(),
        change: `+ ${requestsGrowth}% vs last month`,
        icon: <Database className="h-4 w-4" />,
        trend: "up",
        rawValue: totalRequests
      },
      {
        title: "Approved Access",
        value: totalApproved.toLocaleString(),
        change: `${approvedGrowth >= 0 ? '+ ' : ''}${approvedGrowth}% vs last month`,
        icon: <ChevronDown className="h-4 w-4" />,
        trend: approvedGrowth >= 0 ? "up" : "down",
        rawValue: totalApproved
      }
    ]
    
    // Debug logging
    if (dataFilter === "all" && filteredTrend.some(item => isNaN(item.day) || !item.date || isNaN(item.usage))) {
      console.warn("Invalid trend data detected:", filteredTrend.filter(item => isNaN(item.day) || !item.date || isNaN(item.usage)))
    }

    return {
      performanceData: filteredPerformance,
      trendData: filteredTrend.filter(item => !isNaN(item.day) && item.date && !isNaN(item.usage)), // Filter out invalid data
      categoryData,
      audienceStats
    }
  }, [dataFilter, timeFilter, allPerformanceData, allTrendData])
  
  // Reset zoom function
  const resetZoom = useCallback(() => {
    setBrushRange(null) // Reset to null to use default range
  }, [])

  // Throttled brush change handler for better performance
  const handleBrushChange = useCallback((range: { startIndex?: number; endIndex?: number }) => {
    if (range?.startIndex !== undefined && range?.endIndex !== undefined) {
      // Use setTimeout to debounce rapid changes
      const timeoutId = setTimeout(() => {
        setBrushRange([range.startIndex!, range.endIndex!])
      }, 10)
      
      return () => clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-6">Statistics</h1>
        
        {/* Your Audience Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Audience</h2>
          
          {/* Filter Controls */}
          <div className="flex gap-4 mb-6">
            <Select value={dataFilter} onValueChange={setDataFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="games">Games</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Last 30 Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="default">
              Export
            </Button>
          </div>

          {/* Audience Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {filteredData.audienceStats.map((stat, index) => (
              <Card key={index} className="border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                    <div className="p-1 bg-muted rounded">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className={`text-sm ${
                    stat.trend === 'up' ? 'text-foreground' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className={`transition-all duration-300 mb-8 ${
          expandedChart 
            ? 'fixed inset-0 z-50 bg-background p-6 overflow-auto' 
            : 'grid grid-cols-1 lg:grid-cols-2 gap-6'
        }`}>
          {/* Data Usage Category - Interactive Pie Chart */}
          {(!expandedChart || expandedChart === 'pie') && (
            <Card className={`border border-border ${expandedChart === 'pie' ? 'w-full h-full' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Data Usage Category</h3>
                  <div className="flex gap-2">
                    {expandedChart === 'pie' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedChart(null)}
                        className="flex items-center gap-1"
                      >
                        <Minimize2 className="h-4 w-4" />
                        Minimize
                      </Button>
                    )}
                    {!expandedChart && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedChart('pie')}
                        className="flex items-center gap-1"
                      >
                        <Maximize2 className="h-4 w-4" />
                        Expand
                      </Button>
                    )}
                  </div>
                </div>
                <ChartContainer config={chartConfig} className={expandedChart === 'pie' ? 'h-[80vh]' : 'h-80'}>
                <PieChart>
                  <Pie
                    data={filteredData.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  >
                    {filteredData.categoryData.map((entry: { name: string; value: number; fill: string }, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: data.fill }}
                              />
                              <span className="font-medium">{data.name}</span>
                            </div>
                            <div className="mt-1 text-lg font-bold">{data.value}%</div>
                            <div className="text-muted-foreground">of total usage</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value, entry) => (
                      <span className="text-xs text-muted-foreground">
                        {value} ({entry.payload?.value}%)
                      </span>
                    )}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
          )}

          {/* Data Usage Trends - Interactive Line Chart with Zoom */}
          {(!expandedChart || expandedChart === 'line') && (
            <Card className={`border border-border ${expandedChart === 'line' ? 'w-full h-full' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Data Usage Trends</h3>
                <div className="flex gap-2">
                  {expandedChart === 'line' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetZoom}
                        className="flex items-center gap-1"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset Zoom
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedChart(null)}
                        className="flex items-center gap-1"
                      >
                        <Minimize2 className="h-4 w-4" />
                        Minimize
                      </Button>
                    </>
                  )}
                  {!expandedChart && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedChart('line')}
                      className="flex items-center gap-1"
                    >
                      <Maximize2 className="h-4 w-4" />
                      Expand
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs font-medium text-foreground bg-muted px-2 py-1 rounded">
                  +24% growth
                </div>
                <div className="text-xs text-muted-foreground">
                  {expandedChart === 'line' ? 'Drag brush below to zoom • Click Reset Zoom to reset' : 'Click Expand for zoom controls'}
                </div>
              </div>
              <ChartContainer config={chartConfig} className={expandedChart === 'line' ? 'h-[70vh]' : 'h-80'}>
                <LineChart 
                  data={filteredData.trendData} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
                  syncId="trendChart"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
                            <div className="font-medium mb-1">{label}</div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-primary" />
                              <span className="text-muted-foreground">Usage:</span>
                              <span className="font-bold text-lg">{data.usage}</span>
                            </div>
                            <div className="text-muted-foreground mt-1">
                              Day {data.day} of 30
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="usage" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ 
                      r: 6, 
                      stroke: 'hsl(var(--primary))', 
                      strokeWidth: 2, 
                      fill: 'hsl(var(--background))',
                      style: { cursor: 'pointer' }
                    }}
                    animationDuration={300}
                    isAnimationActive={false}
                  />
                  {filteredData.trendData.length > 1 && (
                    <Brush
                      dataKey="date"
                      height={35}
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary) / 0.15)"
                      startIndex={brushRange?.[0] ?? Math.max(0, Math.min(filteredData.trendData.length - 14, filteredData.trendData.length - 2))}
                      endIndex={brushRange?.[1] ?? Math.max(0, filteredData.trendData.length - 1)}
                      onChange={handleBrushChange}
                      travellerWidth={8}
                      gap={2}
                    />
                  )}
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          )}
        </div>

        {/* Data Performance Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Data Performance</h2>
          
          <div className="space-y-4">
            {filteredData.performanceData.length === 0 ? (
              <Card className="border border-border">
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground">
                    No data available for the selected filters.
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredData.performanceData.map((item, index) => (
              <Card key={index} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                        <Database className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.date} • {item.size} • {item.category}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 text-center">
                      <div>
                        <div className="text-2xl font-bold">{item.views.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Views</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{item.researchUsage.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Research Usage</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{item.downloads.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Downloads</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.growth.startsWith('+') ? (
                          <TrendingUp className="h-4 w-4 text-foreground" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          item.growth.startsWith('+') ? 'text-foreground' : 'text-red-600'
                        }`}>
                          {item.growth}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}