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

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col ml-[200px]">
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">

            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back! Here's what's happening today.
              </p>
            </div>

            {/* Stat Cards */}
            <StatCards />

            {/* Action Buttons */}
            <ActionButtons />

            {/* Charts Row */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <RevenueTrend />
              </div>
              <div className="col-span-1">
                <RepairStatusChart />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <RecentRepairs />
              </div>
              <div className="col-span-1 flex flex-col gap-6">
                <TopTechnicians />
                <RecentActivity />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}