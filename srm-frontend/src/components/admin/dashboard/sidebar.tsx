"use client"

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
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/ui-admin-dashboard/dropdown-menu"
import { useState } from "react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Wrench, label: "Repairs", active: false },
  { icon: Users, label: "Customers", active: false },
  { icon: Smartphone, label: "Devices", active: false },
  { icon: FileText, label: "Invoices", active: false },
  { icon: Package, label: "Inventory", active: false },
  { icon: BarChart3, label: "Reports", active: false },
  { icon: UserCircle, label: "Staff", active: false },
  { icon: Settings, label: "Settings", active: false },
]

const branches = [
  { id: "main", name: "Main Branch" },
  { id: "branch2", name: "City Center" },
  { id: "branch3", name: "Mall Outlet" },
]

export function DashboardSidebar() {
  const [selectedBranch, setSelectedBranch] = useState("main")
  const currentBranch = branches.find((b) => b.id === selectedBranch)

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[200px] flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-[60px] items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Wrench className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground">SRM</span>
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
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
