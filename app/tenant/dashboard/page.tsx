"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TenantLayout } from "@/components/tenant-layout"
import { DollarSign, Wrench, MessageSquare, Calendar, AlertCircle, CheckCircle } from "lucide-react"

// Mock tenant data
const tenantData = {
  name: "John Smith",
  unit: "Unit 4B",
  rentAmount: 25000,
  rentDueDate: "2024-02-01",
  rentStatus: "paid",
  leaseEnd: "2024-12-31",
  maintenanceRequests: [
    { id: 1, title: "Leaky Faucet", status: "pending", date: "2024-01-15" },
    { id: 2, title: "Light Bulb Replacement", status: "completed", date: "2024-01-10" },
  ],
  complaints: [{ id: 1, title: "Noise Complaint", status: "resolved", date: "2024-01-12" }],
}

export default function TenantDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "tenant") {
      router.push("/admin/dashboard")
      return
    }

    setUser(parsedUser)
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  const getRentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        )
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Calendar className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <TenantLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {tenantData.name}</h1>
          <p className="text-gray-600">Here's an overview of your rental information</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Unit</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenantData.unit}</div>
              <p className="text-xs text-muted-foreground">Monthly rent: ₱{tenantData.rentAmount.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rent Status</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getRentStatusBadge(tenantData.rentStatus)}</div>
              <p className="text-xs text-muted-foreground">Due: {tenantData.rentDueDate}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenantData.maintenanceRequests.length}</div>
              <p className="text-xs text-muted-foreground">Active requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lease</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">11 months</div>
              <p className="text-xs text-muted-foreground">Until {tenantData.leaseEnd}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="h-5 w-5 mr-2" />
                Recent Maintenance Requests
              </CardTitle>
              <CardDescription>Your latest maintenance requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenantData.maintenanceRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{request.title}</p>
                      <p className="text-xs text-gray-600">{request.date}</p>
                    </div>
                    <Badge variant={request.status === "completed" ? "default" : "secondary"}>{request.status}</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  Submit New Request
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Recent Communications
              </CardTitle>
              <CardDescription>Messages and complaints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenantData.complaints.map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{complaint.title}</p>
                      <p className="text-xs text-gray-600">{complaint.date}</p>
                    </div>
                    <Badge variant={complaint.status === "resolved" ? "default" : "secondary"}>
                      {complaint.status}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  File New Complaint
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rent Payment */}
        <Card>
          <CardHeader>
            <CardTitle>Rent Payment</CardTitle>
            <CardDescription>Your current rent status and payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold">February 2024 Rent</h3>
                <p className="text-sm text-gray-600">Due: {tenantData.rentDueDate}</p>
                <p className="text-lg font-bold">₱{tenantData.rentAmount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                {getRentStatusBadge(tenantData.rentStatus)}
                {tenantData.rentStatus !== "paid" && <Button className="mt-2">Pay Now</Button>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TenantLayout>
  )
}
