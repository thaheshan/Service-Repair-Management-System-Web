"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingCart,
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
  ScrollText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/ui-admin-dashboard/dropdown-menu"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useGetSettingsQuery } from "@/services/api/settingsApiSlice"

interface NavItem {
  icon: any
  label: string
  href: string
  aliases?: string[]
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "dashboard", href: "/admin/dashboard" },
  { icon: ShoppingCart, label: "pos", href: "/admin/pos" },
  { icon: Wrench, label: "repairs", href: "/admin/repairs", aliases: ["/admin/schedule"] },
  { icon: Users, label: "customers", href: "/admin/customers", aliases: ["/admin/customers/"] },
  { icon: Smartphone, label: "devices", href: "/admin/devices", aliases: ["/admin/devices/"] },
  { icon: FileText, label: "invoices", href: "/admin/invoices", aliases: ["/admin/invoices/"] },
  { icon: Package, label: "inventory", href: "/admin/inventory", aliases: ["/admin/inventory/"] },
  { icon: BarChart3, label: "reports", href: "/admin/reports" },
  { icon: UserCircle, label: "staff", href: "/admin/staff", aliases: ["/admin/staff/"] },
  { icon: ScrollText, label: "logs", href: "/admin/logs", adminOnly: true },
  { icon: Settings, label: "settings", href: "/admin/settings" },
]

const branches = (t: any) => [
  { id: "main", name: t('common.mainBranch') || "Main Branch" },
  { id: "branch2", name: "City Center" },
  { id: "branch3", name: "Mall Outlet" },
]

import { useGetStaffContextQuery } from "@/services/api/staffApiSlice"
import { useGetMeQuery } from "@/services/api/authApiSlice"

export function DashboardSidebar() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const reduxUser = useSelector((state: RootState) => state.auth.user)
  const { data: staffContext } = useGetStaffContextQuery(undefined, { skip: !mounted })
  const { data: meContext } = useGetMeQuery(undefined, { skip: !mounted })
  const { data: settingsData } = useGetSettingsQuery(undefined, { skip: !mounted })
  const featureFlags = settingsData?.settings?.featureFlags || {}

  const user = staffContext?.staff || staffContext?.user || meContext?.user || meContext?.data || meContext || reduxUser

  useEffect(() => {
    setMounted(true)
  }, [])

  const [selectedBranch, setSelectedBranch] = useState("main")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Use static branches during SSR to prevent hydration mismatch; swap to translated after mount
  const currentBranchName = mounted
    ? (branches(t).find((b) => b.id === selectedBranch)?.name ?? "Main Branch")
    : "Main Branch"
  const pathname = usePathname()

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
          <Link href="/admin/dashboard" className="relative flex items-center h-10 w-36">
            <img
              src="/all-fix-logo-black.png"
              alt="All Fix Logo"
              className="absolute top-1/2 -translate-y-1/2 h-12 w-auto object-contain"
              style={{ transform: 'scale(2.2)', transformOrigin: 'left center', left: '-22px' }}
            />
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-1 text-muted-foreground hover:bg-muted rounded-md focus:outline-none">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Shop Selector Dropdown */}
        <div className="px-4 pt-5 pb-2">
          <p className="mb-2 text-xs font-medium text-muted-foreground">{mounted ? t('common.currentShop') : 'Current Shop'}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-left truncate">{currentBranchName}</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[168px]">
              {branches(t).map((branch) => (
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
            {navItems.filter(item => {
              const userRole = user?.role || 'TECHNICIAN';
              
              const defaultRoleFlags: Record<string, Record<string, boolean>> = {
                ADMIN: {
                  dashboard: true, pos: true, repairs: true, customers: true, devices: true,
                  invoices: true, inventory: true, reports: true, staff: true, logs: true, settings: true
                },
                MANAGER: {
                  dashboard: true, pos: true, repairs: true, customers: true, devices: true,
                  invoices: true, inventory: true, reports: true, staff: true, logs: false, settings: true
                },
                TECHNICIAN: {
                  // Inventory is false by default for technicians; only shown if dept='inventory'
                  dashboard: true, pos: true, repairs: true, customers: true, devices: true,
                  invoices: true, inventory: false, reports: false, staff: false, logs: false, settings: true
                }
              };

              const isEnabled = (() => {
                if (featureFlags && typeof featureFlags === 'object') {
                  const roleConfig = (featureFlags as any)[userRole];
                  if (roleConfig && typeof roleConfig === 'object') {
                    return roleConfig[item.label] !== false;
                  }
                  if (typeof (featureFlags as any)[item.label] === 'boolean') {
                    return (featureFlags as any)[item.label];
                  }
                }
                const roleDefault = defaultRoleFlags[userRole] || defaultRoleFlags.TECHNICIAN;
                // Allow inventory for inventory-dept technicians even if the role default is false
                if (item.label === 'inventory' && userRole === 'TECHNICIAN') {
                  const staffDeptCheck = mounted ? localStorage.getItem('staff_dept') : null;
                  const deptCheck = (user?.department || user?.dept || user?.departmentName || staffDeptCheck || '').toLowerCase().trim();
                  if (deptCheck.includes('inventory')) return true;
                }
                return roleDefault[item.label] !== false;
              })();

              if (!isEnabled) return false;

              if (item.adminOnly && user?.role !== 'ADMIN') return false;

              // Department filtering (Applies to everyone, even ADMINs if they are assigned a specific department)
              const staffDeptOverride = mounted ? localStorage.getItem('staff_dept') : null;
              const rawDept = user?.department || user?.dept || user?.departmentName || (userRole !== 'ADMIN' ? staffDeptOverride : "") || "";
              const userDepartment = typeof rawDept === 'string' ? rawDept.toLowerCase().trim() : "";
              const isGlobalAdmin = userRole === 'ADMIN' && (!userDepartment || userDepartment === 'all' || userDepartment === 'super' || userDepartment === 'admin');

              if (!isGlobalAdmin) {
                if (userDepartment.includes('inventory') || userDepartment === 'inventory') {
                  // Inventory dept: show only inventory-related items
                  const allowedInventoryItems = ['dashboard', 'pos', 'inventory', 'customers', 'invoices', 'reports', 'settings'];
                  if (userRole === 'ADMIN' || userRole === 'MANAGER') allowedInventoryItems.push('staff', 'logs');
                  if (!allowedInventoryItems.includes(item.label)) return false;
                } else if (userDepartment.includes('repair') || userDepartment === 'repair') {
                  // Explicit repair dept
                  const allowedRepairItems = ['dashboard', 'repairs', 'customers', 'devices', 'invoices', 'reports', 'settings'];
                  if (userRole === 'ADMIN' || userRole === 'MANAGER') allowedRepairItems.push('staff', 'logs');
                  if (!allowedRepairItems.includes(item.label)) return false;
                } else if (userRole === 'TECHNICIAN') {
                  // No department set for a TECHNICIAN → default to repair-side
                  const allowedRepairItems = ['dashboard', 'repairs', 'customers', 'devices', 'invoices', 'reports', 'settings'];
                  if (!allowedRepairItems.includes(item.label)) return false;
                }
              }

              return true;
            }).map((item) => {
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
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    <span className="truncate">{mounted ? t(`common.${item.label}`) : item.label}</span>
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
