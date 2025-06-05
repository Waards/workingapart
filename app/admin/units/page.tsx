"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin-layout"
import { Plus, Search, Edit, Trash2, Home, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock unit data
const initialUnits = [
  {
    id: 1,
    name: "Unit 4B",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 850,
    rent: 25000,
    status: "occupied",
    tenant: "John Smith",
    address: "123 Main St, Floor 4",
  },
  {
    id: 2,
    name: "Unit 2A",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    rent: 20000,
    status: "occupied",
    tenant: "Sarah Johnson",
    address: "123 Main St, Floor 2",
  },
  {
    id: 3,
    name: "Unit 1C",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 900,
    rent: 23000,
    status: "occupied",
    tenant: "Mike Davis",
    address: "123 Main St, Floor 1",
  },
  {
    id: 4,
    name: "Unit 3A",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 600,
    rent: 19000,
    status: "vacant",
    tenant: null,
    address: "123 Main St, Floor 3",
  },
]

export default function UnitsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [units, setUnits] = useState(initialUnits)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newUnit, setNewUnit] = useState({
    name: "",
    type: "Apartment",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    rent: "",
    address: "",
  })

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

  const filteredUnits = units.filter(
    (unit) =>
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUnit = () => {
    if (!newUnit.name || !newUnit.rent || !newUnit.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const unit = {
      id: Date.now(),
      ...newUnit,
      bedrooms: Number.parseInt(newUnit.bedrooms) || 1,
      bathrooms: Number.parseInt(newUnit.bathrooms) || 1,
      sqft: Number.parseInt(newUnit.sqft) || 0,
      rent: Number.parseInt(newUnit.rent),
      status: "vacant" as const,
      tenant: null,
    }

    setUnits([...units, unit])
    setNewUnit({
      name: "",
      type: "Apartment",
      bedrooms: "",
      bathrooms: "",
      sqft: "",
      rent: "",
      address: "",
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: "Unit added successfully",
    })
  }

  const handleDeleteUnit = (id: number) => {
    setUnits(units.filter((u) => u.id !== id))
    toast({
      title: "Success",
      description: "Unit removed successfully",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "occupied":
        return <Badge className="bg-green-100 text-green-800">Occupied</Badge>
      case "vacant":
        return <Badge className="bg-yellow-100 text-yellow-800">Vacant</Badge>
      case "maintenance":
        return <Badge className="bg-red-100 text-red-800">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Unit Management</h1>
            <p className="text-gray-600">Manage your property units and their details</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Unit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Unit</DialogTitle>
                <DialogDescription>Enter the unit information below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unitName" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="unitName"
                    value={newUnit.name}
                    onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Unit 1A"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select value={newUnit.type} onValueChange={(value) => setNewUnit({ ...newUnit, type: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bedrooms" className="text-right">
                    Bedrooms
                  </Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={newUnit.bedrooms}
                    onChange={(e) => setNewUnit({ ...newUnit, bedrooms: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bathrooms" className="text-right">
                    Bathrooms
                  </Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={newUnit.bathrooms}
                    onChange={(e) => setNewUnit({ ...newUnit, bathrooms: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sqft" className="text-right">
                    Sq Ft
                  </Label>
                  <Input
                    id="sqft"
                    type="number"
                    value={newUnit.sqft}
                    onChange={(e) => setNewUnit({ ...newUnit, sqft: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unitRent" className="text-right">
                    Rent
                  </Label>
                  <Input
                    id="unitRent"
                    type="number"
                    value={newUnit.rent}
                    onChange={(e) => setNewUnit({ ...newUnit, rent: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={newUnit.address}
                    onChange={(e) => setNewUnit({ ...newUnit, address: e.target.value })}
                    className="col-span-3"
                    placeholder="123 Main St, Floor 1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddUnit}>Add Unit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{units.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {units.filter((u) => u.status === "occupied").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vacant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {units.filter((u) => u.status === "vacant").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {units
                  .filter((u) => u.status === "occupied")
                  .reduce((sum, u) => sum + u.rent, 0)
                  .toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Units</CardTitle>
            <CardDescription>Manage all your property units</CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search units..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center">
                          <Home className="h-4 w-4 mr-2" />
                          {unit.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {unit.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{unit.type}</div>
                        <div className="text-gray-600">
                          {unit.bedrooms} bed, {unit.bathrooms} bath
                        </div>
                        {unit.sqft > 0 && <div className="text-gray-600">{unit.sqft} sq ft</div>}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">₱{unit.rent.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(unit.status)}</TableCell>
                    <TableCell>
                      {unit.tenant ? (
                        <span className="text-sm">{unit.tenant}</span>
                      ) : (
                        <span className="text-sm text-gray-400">No tenant</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteUnit(unit.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
