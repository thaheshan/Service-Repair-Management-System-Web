"use client"

import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Shared component with role-based logic */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        {/* Header - Shared component */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto w-full scrollbar-hide">
          <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
