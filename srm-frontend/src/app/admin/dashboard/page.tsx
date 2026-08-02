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
import { RecentActivity } from "@/components/admin/dashboard/recent-activity"
import { DateRangePicker, DateRange, makeRange } from "@/components/admin/shared/date-range-picker"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useGetInventorySummaryQuery, useGetLowStockItemsQuery } from "@/services/api/inventoryApiSlice"
import { Package, AlertTriangle, ArrowRight } from "lucide-react"
import Link from "next/link"

function InventoryOverviewWidget() {
  const { data: summaryRes, isLoading: summaryLoading } = useGetInventorySummaryQuery(undefined)
  const { data: lowStockRes, isLoading: lowStockLoading } = useGetLowStockItemsQuery(undefined)

  const summary = summaryRes?.data || summaryRes || {}
  const lowStockItems = lowStockRes?.data || lowStockRes || []

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Inventory Overview</h2>
        </div>
        <Link href="/admin/inventory" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
          View All Inventory <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <span className="text-xs font-medium text-muted-foreground">Total Stock Items</span>
          <p className="text-2xl font-black text-foreground mt-1">{summaryLoading ? "..." : (summary.totalItems || summary.totalProducts || 0)}</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" /> Low Stock Alerts
          </span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{lowStockLoading ? "..." : (lowStockItems.length || 0)}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <span className="text-xs font-medium text-muted-foreground">Total Valuation</span>
          <p className="text-2xl font-black text-foreground mt-1">
            LKR {summaryLoading ? "..." : (summary.totalValuation || summary.totalValue || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="mt-2">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Attention Required (Low Stock)</h3>
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
            {lowStockItems.slice(0, 4).map((item: any) => (
              <div key={item.id || item.name} className="flex items-center justify-between p-3 bg-card hover:bg-muted/50 text-xs">
                <div>
                  <p className="font-bold text-foreground">{item.name || item.title}</p>
                  <p className="text-muted-foreground">SKU: {item.sku || "N/A"}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                  {item.quantity ?? item.stock ?? 0} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


export default function DashboardPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user)
  const [dateRange, setDateRange] = useState<DateRange>(makeRange(30))
  useEffect(() => { setMounted(true) }, [])

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
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">{mounted ? t('common.dashboard') : 'Dashboard'}</h1>
                  <p className="text-sm text-muted-foreground">
                    {mounted ? t('dashboard.welcome') : 'Welcome back!'} {mounted ? t('dashboard.welcomeSubtitle') : "Here's what's happening today."}
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

            {/* Stat Cards — driven by selected date range */}
            <StatCards days={dateRange.days} />

            {/* Row 2: Recent Repairs & Revenue Trend (or Inventory Overview for Inventory Dept) */}
            {user?.department?.toLowerCase() === 'inventory' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                  <InventoryOverviewWidget />
                </div>
                <div className="lg:col-span-3">
                  <RevenueTrend days={dateRange.days} />
                </div>
              </div>
            ) : (
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
            )}

            {/* Row 3: Top Techs & Status Chart (hidden for Inventory Dept) */}
            {user?.department?.toLowerCase() !== 'inventory' && (
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
            )}

            {/* Bottom Row: Recent Activity */}
            <div>
              <RecentActivity />
            </div>

          </div>
          {/* Footer removed */}
        </main>
      </div>
    </div>
  )
}