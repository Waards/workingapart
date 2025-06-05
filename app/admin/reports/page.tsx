"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin-layout"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { FileText, Download, TrendingUp, Calendar, DollarSign } from "lucide-react"

// Mock data for reports
const monthlyRevenueData = [
  { month: "Jan", revenue: 950000, expenses: 250000, profit: 700000 },
  { month: "Feb", revenue: 1100000, expenses: 320000, profit: 780000 },
  { month: "Mar", revenue: 1020000, expenses: 230000, profit: 790000 },
  { month: "Apr", revenue: 1290000, expenses: 340000, profit: 950000 },
  { month: "May", revenue: 1160000, expenses: 280000, profit: 880000 },
  { month: "Jun", revenue: 1420000, expenses: 380000, profit: 1040000 },
]

const occupancyTrendData = [
  { month: "Jan", occupancy: 82 },
  { month: "Feb", occupancy: 85 },
  { month: "Mar", occupancy: 88 },
  { month: "Apr", occupancy: 90 },
  { month: "May", occupancy: 87 },
  { month: "Jun", occupancy: 92 },
]

const unitTypeData = [
  { name: "1 Bedroom", value: 40, color: "#3b82f6" },
  { name: "2 Bedroom", value: 35, color: "#10b981" },
  { name: "3 Bedroom", value: 20, color: "#f59e0b" },
  { name: "Studio", value: 5, color: "#ef4444" },
]

const maintenanceData = [
  { category: "Plumbing", count: 15, cost: 45000 },
  { category: "Electrical", count: 8, cost: 32000 },
  { category: "HVAC", count: 12, cost: 68000 },
  { category: "General", count: 20, cost: 25000 },
]

export default function AdminReportsPage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [selectedReport, setSelectedReport] = useState("revenue")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/tenant/dashboard")
      return
    }
  }, [router])

  const handleExportReport = () => {
    // In a real app, this would generate and download a PDF/Excel report
    alert("Report export functionality would be implemented here")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive insights into your property management business</p>
          </div>
          <div className="flex space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱6,940,000</div>
              <p className="text-xs text-muted-foreground">+12.5% from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱5,140,000</div>
              <p className="text-xs text-muted-foreground">+15.2% from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.3%</div>
              <p className="text-xs text-muted-foreground">+3.1% from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance Cost</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱170,000</div>
              <p className="text-xs text-muted-foreground">-8.3% from last period</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Profit Analysis</CardTitle>
            <CardDescription>Monthly revenue, expenses, and profit trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "#3b82f6" },
                expenses: { label: "Expenses", color: "#ef4444" },
                profit: { label: "Profit", color: "#10b981" },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                  <Bar dataKey="expenses" fill="#ef4444" />
                  <Bar dataKey="profit" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Occupancy and Unit Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Trend</CardTitle>
              <CardDescription>Monthly occupancy rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  occupancy: { label: "Occupancy %", color: "#3b82f6" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={occupancyTrendData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="occupancy" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unit Type Distribution</CardTitle>
              <CardDescription>Breakdown of units by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  "1bedroom": { label: "1 Bedroom", color: "#3b82f6" },
                  "2bedroom": { label: "2 Bedroom", color: "#10b981" },
                  "3bedroom": { label: "3 Bedroom", color: "#f59e0b" },
                  studio: { label: "Studio", color: "#ef4444" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={unitTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                      {unitTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Analysis</CardTitle>
            <CardDescription>Breakdown of maintenance requests and costs by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-4">Maintenance Requests by Category</h4>
                <div className="space-y-4">
                  {maintenanceData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{item.count} requests</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(item.count / 20) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-4">Maintenance Costs by Category</h4>
                <div className="space-y-4">
                  {maintenanceData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">₱{item.cost.toLocaleString()}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(item.cost / 68000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
