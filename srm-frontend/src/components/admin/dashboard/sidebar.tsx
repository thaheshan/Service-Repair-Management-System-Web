"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Wrench,
  Users,
  Smartphone,
  FileText,
  Package,
  BarChart3,
  UserCircle,
  Settings,
  ChevronDown,
  Store,
  Check,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/ui-admin-dashboard/dropdown-menu"
import { useState } from "react"
import { useRoleAccess, RbacFeature } from "@/hooks/useRoleAccess"

interface NavItem {
  icon: any
  label: string
  href: string
  aliases?: string[]
  feature?: RbacFeature
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Wrench, label: "Repairs", href: "/admin/repairs", aliases: ["/admin/schedule"] },
  { icon: Users, label: "Customers", href: "/admin/customers", aliases: ["/admin/customers/"] },
  { icon: Smartphone, label: "Devices", href: "/admin/devices", aliases: ["/admin/devices/"] },
  { icon: FileText, label: "Invoices", href: "/admin/invoices", aliases: ["/admin/invoices/"], feature: "view:invoices" },
  { icon: Package, label: "Inventory", href: "/admin/inventory", aliases: ["/admin/inventory/"], feature: "view:inventory" },
  { icon: BarChart3, label: "Reports", href: "/admin/reports", feature: "view:reports" },
  { icon: UserCircle, label: "Staff", href: "/admin/staff", aliases: ["/admin/staff/"], feature: "view:staff" },
  { icon: Settings, label: "Settings", href: "/admin/settings", feature: "view:settings" },
]

const branches = [
  { id: "main", name: "Main Branch" },
  { id: "branch2", name: "City Center" },
  { id: "branch3", name: "Mall Outlet" },
]

export function DashboardSidebar() {
  const [selectedBranch, setSelectedBranch] = useState("main")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const currentBranch = branches.find((b) => b.id === selectedBranch)
  const pathname = usePathname()
  const { can } = useRoleAccess()

  const filteredNavItems = navItems.filter(item => !item.feature || can(item.feature))

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-3 left-4 z-40 p-2 bg-card border border-border rounded-lg shadow-sm text-foreground focus:outline-none"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 flex h-screen w-[240px] lg:w-[200px] flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex h-[64px] items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Wrench className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">SRM</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-1 text-muted-foreground hover:bg-muted rounded-md focus:outline-none">
             <X className="h-5 w-5" />
          </button>
        </div>

      {/* Shop Selector Dropdown */}
      <div className="px-4 pt-5 pb-2">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Current Shop</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary">
              <Store className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-left truncate">{currentBranch?.name}</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[168px]">
            {branches.map((branch) => (
              <DropdownMenuItem
                key={branch.id}
                className="cursor-pointer"
                onSelect={() => setSelectedBranch(branch.id)}
              >
                <span className="flex-1">{branch.name}</span>
                {selectedBranch === branch.id && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex-1 px-3">
        <ul className="flex flex-col gap-0.5">
          {filteredNavItems.map((item) => {
            // Determine if the current path matches the item's href or aliases
            const isActive = 
              pathname === item.href || 
              (item.href !== "#" && pathname?.startsWith(item.href)) ||
              (item.aliases && item.aliases.some((alias: string) => pathname?.startsWith(alias)))
            
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
    </>
  )
}
