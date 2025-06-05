"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TenantLayout } from "@/components/tenant-layout"
import { Calendar, DollarSign, CheckCircle, AlertCircle, Clock, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock payment history data
const paymentHistory = [
  {
    id: 1,
    month: "January 2024",
    amount: 25000,
    dueDate: "2024-01-01",
    paidDate: "2023-12-28",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: 2,
    month: "December 2023",
    amount: 25000,
    dueDate: "2023-12-01",
    paidDate: "2023-11-30",
    status: "paid",
    method: "GCash",
  },
  {
    id: 3,
    month: "November 2023",
    amount: 25000,
    dueDate: "2023-11-01",
    paidDate: "2023-11-05",
    status: "paid",
    method: "Cash",
  },
  {
    id: 4,
    month: "February 2024",
    amount: 25000,
    dueDate: "2024-02-01",
    paidDate: null,
    status: "pending",
    method: null,
  },
]

const currentRent = {
  month: "February 2024",
  amount: 25000,
  dueDate: "2024-02-01",
  status: "pending",
}

export default function TenantRentPage() {
  const router = useRouter()
  const { toast } = useToast()
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

  const handlePayment = () => {
    toast({
      title: "Payment Initiated",
      description: "Redirecting to payment gateway...",
    })
    // In a real app, this would redirect to payment processor
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
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <TenantLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rent Status</h1>
          <p className="text-gray-600">Manage your rent payments and view payment history</p>
        </div>

        {/* Current Rent Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Current Rent Status
            </CardTitle>
            <CardDescription>Your current month's rent information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{currentRent.month}</h3>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due: {currentRent.dueDate}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₱{currentRent.amount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                {getRentStatusBadge(currentRent.status)}
                {currentRent.status === "pending" && (
                  <Button className="mt-3 bg-blue-600 hover:bg-blue-700" onClick={handlePayment}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Available payment options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-medium">Bank Transfer</h4>
                <p className="text-sm text-gray-600">BPI Account: 1234-5678-90</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-medium">GCash</h4>
                <p className="text-sm text-gray-600">Mobile: +63 917 123 4567</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-medium">Cash Payment</h4>
                <p className="text-sm text-gray-600">Office: Mon-Fri 9AM-5PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your rent payment records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.month}</TableCell>
                    <TableCell>₱{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell>{payment.paidDate || "-"}</TableCell>
                    <TableCell>{payment.method || "-"}</TableCell>
                    <TableCell>{getRentStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TenantLayout>
  )
}
