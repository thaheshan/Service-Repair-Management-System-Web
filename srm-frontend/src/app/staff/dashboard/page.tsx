"use client"

import { useEffect, useMemo } from "react"
import { useRepairStore } from "@/store/repairStore"
import { useInventoryStore } from "@/store/inventoryStore"
import { useAuthStore } from "@/store/authStore"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { RecentRepairs } from "@/components/admin/dashboard/recent-repairs"
import { Wrench, Package, Clock, CheckCircle2 } from "lucide-react"

export default function StaffDashboard() {
  const { items: repairs, fetchItems: fetchRepairs } = useRepairStore()
  const { items: inventory, fetchItems: fetchInventory } = useInventoryStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchRepairs()
    fetchInventory()
  }, [fetchRepairs, fetchInventory])

  // Filter tasks assigned to this specific staff member
  const myTasks = useMemo(() => {
    return repairs.filter(r => r.technicianId === user?.id)
  }, [repairs, user])

  const pendingTasks = myTasks.filter(t => t.status === 'pending').length
  const inProgressTasks = myTasks.filter(t => t.status === 'in_progress').length
  const completedTasks = myTasks.filter(t => ['completed', 'delivered'].includes(t.status)).length

  const lowStockItems = inventory.filter(item => item.quantity <= item.reorderLevel).length

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 mb-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Staff Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Hello, {user?.name}. Here is your work summary for today.
              </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <StatCard title="My Pending Tasks" value={pendingTasks.toString()} icon={Clock} color="text-amber-500" bg="bg-amber-50" />
              <StatCard title="In Progress" value={inProgressTasks.toString()} icon={Wrench} color="text-blue-500" bg="bg-blue-50" />
              <StatCard title="Total Completed" value={completedTasks.toString()} icon={CheckCircle2} color="text-emerald-500" bg="bg-emerald-50" />
              <StatCard title="Low Stock Alerts" value={lowStockItems.toString()} icon={Package} color="text-rose-500" bg="bg-rose-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentRepairs title="My Recent Tasks" filterTechnicianId={user?.id} />
              </div>
              <div className="lg:col-span-1">
                <div className="rounded-xl border border-border bg-card p-5 h-full">
                  <h3 className="text-base font-semibold mb-4">Inventory Summary</h3>
                  <div className="space-y-4">
                    {inventory.slice(0, 5).map(item => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground">{item.category}</span>
                        </div>
                        <span className={`text-sm font-bold ${item.quantity <= item.reorderLevel ? 'text-rose-500' : ''}`}>
                          {item.quantity} left
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
      </div>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${bg}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
  )
}
