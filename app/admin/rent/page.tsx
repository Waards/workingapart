"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin-layout"
import { Search, DollarSign, Calendar, TrendingUp, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock rent collection data
const rentData = [
  {
    id: 1,
    tenant: "John Smith",
    unit: "Unit 4B",
    amount: 25000,
    dueDate: "2024-02-01",
    paidDate: "2024-01-30",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: 2,
    tenant: "Sarah Johnson",
    unit: "Unit 2A",
    amount: 20000,
    dueDate: "2024-02-01",
    paidDate: null,
    status: "overdue",
    method: null,
  },
  {
    id: 3,
    tenant: "Mike Davis",
    unit: "Unit 1C",
    amount: 23000,
    dueDate: "2024-02-01",
    paidDate: "2024-02-01",
    status: "paid",
    method: "GCash",
  },
  {
    id: 4,
    tenant: "Emma Wilson",
    unit: "Unit 3A",
    amount: 19000,
    dueDate: "2024-02-01",
    paidDate: null,
    status: "pending",
    method: null,
  },
]

export default function AdminRentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [rents, setRents] = useState(rentData)

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

  const filteredRents = rents.filter((rent) => {
    const matchesSearch =
      rent.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rent.unit.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || rent.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const markAsPaid = (id: number) => {
    setRents(
      rents.map((rent) =>
        rent.id === id
          ? { ...rent, status: "paid", paidDate: new Date().toISOString().split("T")[0], method: "Manual Entry" }
          : rent,
      ),
    )

    toast({
      title: "Payment Recorded",
      description: "Rent payment has been marked as paid",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const totalRent = rents.reduce((sum, rent) => sum + rent.amount, 0)
  const collectedRent = rents.filter((r) => r.status === "paid").reduce((sum, rent) => sum + rent.amount, 0)
  const pendingRent = rents.filter((r) => r.status === "pending").reduce((sum, rent) => sum + rent.amount, 0)
  const overdueRent = rents.filter((r) => r.status === "overdue").reduce((sum, rent) => sum + rent.amount, 0)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rent Collection</h1>
          <p className="text-gray-600">Track and manage rent payments from tenants</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Expected</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱{totalRent.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Collected</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₱{collectedRent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {((collectedRent / totalRent) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">₱{pendingRent.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₱{overdueRent.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rent Collection Status</CardTitle>
            <CardDescription>Track rent payments for the current month</CardDescription>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tenants or units..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRents.map((rent) => (
                  <TableRow key={rent.id}>
                    <TableCell className="font-medium">{rent.tenant}</TableCell>
                    <TableCell>{rent.unit}</TableCell>
                    <TableCell>₱{rent.amount.toLocaleString()}</TableCell>
                    <TableCell>{rent.dueDate}</TableCell>
                    <TableCell>{rent.paidDate || "-"}</TableCell>
                    <TableCell>{rent.method || "-"}</TableCell>
                    <TableCell>{getStatusBadge(rent.status)}</TableCell>
                    <TableCell>
                      {rent.status !== "paid" && (
                        <Button
                          size="sm"
                          onClick={() => markAsPaid(rent.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark as Paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
