"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Building2,
  LayoutDashboard,
  Users,
  Home,
  DollarSign,
  Wrench,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Tenants", href: "/admin/tenants", icon: Users },
  { name: "Units", href: "/admin/units", icon: Home },
  { name: "Rent Collection", href: "/admin/rent", icon: DollarSign },
  { name: "Maintenance", href: "/admin/maintenance", icon: Wrench },
  { name: "Complaints", href: "/admin/complaints", icon: MessageSquare },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("user")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">PropertyHub</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      <div className="lg:flex">
        {/* Sidebar */}
        <div
          className={`
          ${isMobileMenuOpen ? "block" : "hidden"} lg:block
          w-full lg:w-64 bg-white shadow-sm lg:min-h-screen
        `}
        >
          <div className="p-4 hidden lg:block">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PropertyHub</span>
            </div>
          </div>

          <nav className="mt-4 lg:mt-8">
            <div className="px-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md
                      ${isActive ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={`
                        mr-3 h-5 w-5
                        ${isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"}
                      `}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            <div className="mt-8 px-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
