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
import { RecentActivity } from "@/components/admin/dashboard/recent-activity"
import { TopTechnicians } from "@/components/admin/dashboard/top-technicians"


export default function DashboardPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
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

            {/* Page Title & Actions Header (Stacked) */}
            <div className="flex flex-col gap-6 mb-2">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{mounted ? t('common.dashboard') : 'Dashboard'}</h1>
                <p className="text-sm text-muted-foreground">
                  {mounted ? t('dashboard.welcome') : 'Welcome back!'} {mounted ? t('dashboard.welcomeSubtitle') : "Here's what's happening today."}
                </p>
              </div>
              <div className="w-full">
                <ActionButtons />
              </div>
            </div>

            {/* Stat Cards */}
            <StatCards />

            {/* Row 2: Recent Repairs & Revenue Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 h-full">
                <RecentRepairs />
              </div>
              <div className="lg:col-span-2 h-full">
                <RevenueTrend />
              </div>
            </div>

            {/* Row 3: Top Techs & Status Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 h-full">
                <TopTechnicians />
              </div>
              <div className="lg:col-span-2 h-full">
                <RepairStatusChart />
              </div>
            </div>

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