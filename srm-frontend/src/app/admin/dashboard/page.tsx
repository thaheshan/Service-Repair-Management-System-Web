"use client"


import "@/app/globals.css" 
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { StatCards } from "@/components/admin/dashboard/stat-cards"
import { ActionButtons } from "@/components/admin/dashboard/action-buttons"
import { RecentRepairs } from "@/components/admin/dashboard/recent-repairs"
import { RevenueTrend } from "@/components/admin/dashboard/revenue-trend"
import { RepairStatusChart } from "@/components/admin/dashboard/repair-status-chart"
import { RecentActivity } from "@/components/admin/dashboard/recent-activity"
import { TopTechnicians } from "@/components/admin/dashboard/top-technicians"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import { useEffect } from "react"
import { useRoleAccess } from "@/hooks/useRoleAccess"
import { useRepairStore } from "@/store/repairStore"
import { useStaffStore } from "@/store/staffStore"
import { useShopStore } from "@/store/shopStore"

export default function DashboardPage() {
  const { fetchItems: fetchRepairs } = useRepairStore()
  const { fetchItems: fetchStaff } = useStaffStore()
  const { fetchShop } = useShopStore()
  const { can } = useRoleAccess()

  useEffect(() => {
    fetchRepairs()
    fetchStaff()
    fetchShop()
  }, [fetchRepairs, fetchStaff, fetchShop])

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

            {/* Page Title & Actions Header (Stacked) */}
            <div className="flex flex-col gap-6 mb-2">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back! Here's what's happening today.
                </p>
              </div>
              <div className="w-full">
                <ActionButtons />
              </div>
            </div>

            {/* Stat Cards */}
            <StatCards />

            {/* Row 2: Recent Repairs & Revenue Trend (Admin Only) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={can("view:revenue-trend") ? "lg:col-span-1 h-full" : "lg:col-span-3 h-full"}>
                <RecentRepairs />
              </div>
              {can("view:revenue-trend") && (
                <div className="lg:col-span-2 h-full">
                  <RevenueTrend />
                </div>
              )}
            </div>

            {/* Row 3: Top Techs (Admin Only) & Status Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {can("view:top-technicians") && (
                <div className="lg:col-span-1 h-full">
                  <TopTechnicians />
                </div>
              )}
              <div className={can("view:top-technicians") ? "lg:col-span-2 h-full" : "lg:col-span-3 h-full"}>
                <RepairStatusChart />
              </div>
            </div>

            {/* Bottom Row: Recent Activity */}
            <div>
              <RecentActivity />
            </div>

          </div>
          <DashboardFooter />
        </main>
      </div>
    </div>
  )
}