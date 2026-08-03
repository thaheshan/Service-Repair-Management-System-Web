"use client"


import "@/app/globals.css" 
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { StatCards } from "@/components/admin/dashboard/stat-cards"
import { ActionButtons } from "@/components/admin/dashboard/action-buttons"
import { RecentRepairs } from "@/components/admin/dashboard/recent-repairs"
import { RevenueTrend } from "@/components/admin/dashboard/revenue-trend"
import { RepairStatusChart } from "@/components/admin/dashboard/repair-status-chart"
import { TopTechnicians } from "@/components/admin/dashboard/top-technicians"
import { LowStockAlertsPanel } from "@/components/admin/dashboard/low-stock-alerts-panel"
import { RecentActivity } from "@/components/admin/dashboard/recent-activity"
import { DateRangePicker, DateRange, makeRange } from "@/components/admin/shared/date-range-picker"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import {
  useGetInventorySummaryQuery,
  useGetLowStockItemsQuery,
  useGetInventoryItemsQuery,
} from "@/services/api/inventoryApiSlice"
import {
  Package, AlertTriangle, ArrowRight, TrendingUp,
  ShoppingCart, Layers, ArrowUpRight, BarChart3, Box, RefreshCw, UserPlus
} from "lucide-react"
import Link from "next/link"

// ─── Inventory Department Dashboard ──────────────────────────────────────────

function InventoryStatCard({
  label,
  value,
  subtext,
  icon: Icon,
  iconBg,
  iconColor,
  borderColor,
  href,
}: {
  label: string
  value: string | number
  subtext?: string
  icon: any
  iconBg: string
  iconColor: string
  borderColor: string
  href?: string
}) {
  const card = (
    <div
      className={`flex h-full items-center justify-between rounded-2xl border border-border/60 border-l-4 ${borderColor} bg-card p-5 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
        {subtext && (
          <span className="text-xs font-semibold text-muted-foreground pt-0.5">{subtext}</span>
        )}
      </div>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${iconBg}`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
    </div>
  )
  return href ? <Link href={href}>{card}</Link> : card
}

function InventoryDashboard({ days }: { days: number }) {
  const { data: summaryRes, isLoading: summaryLoading, refetch: refetchSummary } =
    useGetInventorySummaryQuery(undefined)
  const { data: lowStockRes, isLoading: lowStockLoading, refetch: refetchLow } =
    useGetLowStockItemsQuery(undefined)
  const { data: itemsRes, isLoading: itemsLoading } =
    useGetInventoryItemsQuery(undefined)

  const summary = summaryRes?.data || summaryRes || {}
  const rawLowStock = lowStockRes?.data || lowStockRes || []
  const lowStockItems: any[] = Array.isArray(rawLowStock) ? rawLowStock : (rawLowStock.items || [])
  const allItems: any[] = itemsRes?.data || itemsRes?.items || itemsRes || []

  const totalItems   = summary.totalItems   ?? summary.totalProducts ?? allItems.length ?? 0
  const totalValue   = summary.totalValuation ?? summary.totalValue ?? 0
  const lowStockCnt  = lowStockItems.length
  const outOfStock   = allItems.filter((i: any) => (i.quantity ?? i.stock ?? 0) <= 0).length

  // derive top categories from all items
  const categoryCounts: Record<string, number> = {}
  allItems.forEach((i: any) => {
    const cat = i.category || i.type || "Uncategorised"
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // derive recent stock additions (items sorted by createdAt desc, take 6)
  const recentItems = [...allItems]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 6)
    .map((item: any) => ({
      id:       item.id,
      name:     item.partName || item.name || item.title || "—",
      category: item.category || item.type || "—",
      sku:      item.sku || item.skuCode || "N/A",
      quantity: item.availableStock ?? item.quantity ?? item.stock ?? 0,
      price:    item.price ?? item.unitCost ?? item.sellingPrice ?? item.unitPrice ?? 0,
    }))

  return (
    <div className="flex flex-col gap-6">
      {/* ── Stat Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        <InventoryStatCard
          label="Total Stock Items"
          value={summaryLoading || itemsLoading ? "..." : totalItems.toLocaleString()}
          subtext="Across all categories"
          icon={Package}
          iconBg="bg-[#EEF2FF]"
          iconColor="text-[#4F46E5]"
          borderColor="border-l-[#4F46E5]"
          href="/admin/inventory"
        />
        <InventoryStatCard
          label="Total Stock Value"
          value={summaryLoading ? "..." : `LKR ${totalValue.toLocaleString()}`}
          subtext="Current valuation"
          icon={TrendingUp}
          iconBg="bg-[#D1FAE5]"
          iconColor="text-[#10B981]"
          borderColor="border-l-[#10B981]"
        />
        <InventoryStatCard
          label="Low Stock Alerts"
          value={lowStockLoading ? "..." : lowStockCnt}
          subtext={lowStockCnt > 0 ? "Needs restocking soon" : "All stock healthy"}
          icon={AlertTriangle}
          iconBg="bg-[#FEF3C7]"
          iconColor="text-[#F59E0B]"
          borderColor="border-l-[#F59E0B]"
          href="/admin/inventory"
        />
        <InventoryStatCard
          label="Out of Stock"
          value={itemsLoading ? "..." : outOfStock}
          subtext={outOfStock > 0 ? "Immediate action needed" : "No out-of-stock items"}
          icon={Box}
          iconBg="bg-[#FEE2E2]"
          iconColor="text-[#EF4444]"
          borderColor="border-l-[#EF4444]"
          href="/admin/inventory"
        />
      </div>

      {/* ── Main two-column row ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Low Stock Alert Panel */}
        <div className="lg:col-span-1 flex flex-col rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-bold text-foreground">Low Stock Alerts</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { refetchLow() }}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <Link
                href="/admin/inventory"
                className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
              >
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {lowStockLoading ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Loading alerts...</div>
            ) : lowStockItems.length === 0 ? (
              <div className="p-8 flex flex-col items-center gap-2 text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Package className="h-5 w-5 text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-foreground">All stock healthy!</p>
                <p className="text-xs text-muted-foreground">No items below threshold</p>
              </div>
            ) : (
              lowStockItems.map((item: any) => (
                <div
                  key={item.id || item.name}
                  className="flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-foreground truncate">{item.name || item.title}</p>
                    <p className="text-[11px] text-muted-foreground">SKU: {item.sku || "N/A"} · {item.category || "—"}</p>
                  </div>
                  <span className="ml-3 shrink-0 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[11px] font-bold">
                    {item.quantity ?? item.stock ?? 0} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="lg:col-span-2">
          <RevenueTrend days={days} />
        </div>
      </div>

      {/* ── Bottom row: recent items + category breakdown ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Category Breakdown */}
        <div className="lg:col-span-1 rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#4F46E5]" />
              <h2 className="text-sm font-bold text-foreground">Stock by Category</h2>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {topCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No categories yet</p>
            ) : (
              topCategories.map(([cat, count]) => {
                const pct = totalItems > 0 ? Math.round((count / totalItems) * 100) : 0
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-[12px] font-semibold text-foreground mb-1">
                      <span className="truncate">{cat}</span>
                      <span className="text-muted-foreground ml-2">{count} items · {pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#4F46E5] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Recently Added Stock */}
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#10B981]" />
              <h2 className="text-sm font-bold text-foreground">Recently Added Stock</h2>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
            >
              Manage Inventory <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {itemsLoading ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Loading items...</div>
            ) : recentItems.length === 0 ? (
              <div className="p-8 flex flex-col items-center gap-2 text-center">
                <ShoppingCart className="h-8 w-8 text-muted-foreground opacity-40" />
                <p className="text-sm text-muted-foreground">No inventory items yet</p>
                <Link
                  href="/admin/inventory"
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <ArrowRight className="h-3 w-3" /> Add your first item
                </Link>
              </div>
            ) : (
              recentItems.map((item) => (
                <div
                  key={item.id || item.name}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 shrink-0 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                      <Package className="h-4 w-4 text-[#4F46E5]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-foreground truncate">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.category} · SKU: {item.sku}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p className="text-[13px] font-black text-foreground">
                      {item.quantity.toLocaleString()} units
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      LKR {item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


// ─── Default Dashboard Page ───────────────────────────────────────────────────

import { useGetStaffContextQuery } from "@/services/api/staffApiSlice"
import { useGetMeQuery } from "@/services/api/authApiSlice"

export default function DashboardPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const reduxUser = useSelector((state: RootState) => state.auth.user)
  const { data: staffContext } = useGetStaffContextQuery(undefined, { skip: !mounted })
  const { data: meContext } = useGetMeQuery(undefined, { skip: !mounted })
  const [dateRange, setDateRange] = useState<DateRange>(makeRange(30))
  useEffect(() => { setMounted(true) }, [])

  const staffDeptOverride = mounted ? localStorage.getItem('staff_dept') : null
  const user = staffContext?.staff || staffContext?.user || meContext?.user || meContext?.data || meContext || reduxUser

  const userRole = user?.role || reduxUser?.role || 'TECHNICIAN'
  const rawDept = user?.department || user?.dept || user?.departmentName || (userRole !== 'ADMIN' ? staffDeptOverride : "") || ""
  const deptStr = typeof rawDept === 'string' ? rawDept.toLowerCase().trim() : ""
  
  const isGlobalAdmin = userRole === 'ADMIN' && (!deptStr || deptStr === 'all' || deptStr === 'super' || deptStr === 'admin')
  const isInventoryDept = !isGlobalAdmin && (deptStr.includes('inventory') || deptStr === 'inventory')

  if (!mounted) {
    return <div className="flex h-screen bg-background items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0">
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="flex flex-col gap-6 p-4 sm:p-6 mb-12">

            {/* Page Title + Date Range Picker */}
            <div className="flex flex-col gap-4 mb-2">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {isInventoryDept
                      ? "Inventory Dashboard"
                      : (mounted ? t('common.dashboard') : 'Dashboard')}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {isInventoryDept
                      ? "Stock levels, low-stock alerts and POS revenue at a glance."
                      : (mounted
                          ? `${t('dashboard.welcome')} ${t('dashboard.welcomeSubtitle')}`
                          : "Welcome back! Here's what's happening today.")}
                  </p>
                </div>
                {/* Global Date Range Picker */}
                <DateRangePicker
                  defaultDays={30}
                  onChange={setDateRange}
                />
              </div>
              <div className="w-full">
                <ActionButtons />
              </div>
            </div>

            {/* Stat Cards — skip repair stat cards for inventory dept */}
            {!isInventoryDept && <StatCards days={dateRange.days} />}

            {isInventoryDept ? (
              /* ── Inventory Department Full Dashboard ── */
              <InventoryDashboard days={dateRange.days} />
            ) : (
              /* ── Default Repair/General Dashboard ─── */
              <>
                {/* Row 2: Recent Repairs & Revenue Trend */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className={user?.role === 'TECHNICIAN' ? "lg:col-span-3 h-full" : "lg:col-span-1 h-full"}>
                    <RecentRepairs />
                  </div>
                  {user?.role !== 'TECHNICIAN' && (
                    <div className="lg:col-span-2 h-full">
                      <RevenueTrend days={dateRange.days} />
                    </div>
                  )}
                </div>

                {/* Row 3: Top Techs & Status Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {user?.role !== 'TECHNICIAN' && (
                    <div className="lg:col-span-1 h-full">
                      <TopTechnicians />
                    </div>
                  )}
                  <div className={user?.role === 'TECHNICIAN' ? "lg:col-span-3 h-full" : "lg:col-span-2 h-full"}>
                    <RepairStatusChart days={dateRange.days} />
                  </div>
                </div>

                {/* Bottom Row: Low Stock Alerts & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {user?.role !== 'TECHNICIAN' && (
                    <div className="lg:col-span-1 max-h-[400px]">
                      <LowStockAlertsPanel />
                    </div>
                  )}
                  <div className={user?.role === 'TECHNICIAN' ? "lg:col-span-3" : "lg:col-span-2"}>
                    <RecentActivity />
                  </div>
                </div>
              </>
            )}

          </div>
          {/* Footer removed */}
        </main>
      </div>
    </div>
  )
}