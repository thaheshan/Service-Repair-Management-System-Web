"use client"

import { useEffect, useMemo } from "react"
import { useRepairStore } from "@/store/repairStore"
import { useAuthStore } from "@/store/authStore"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/ui-admin-dashboard/card"
import { Badge } from "@/components/ui/ui-admin-dashboard/badge"
import { Wrench, Clock, CheckCircle2, Package, Smartphone } from "lucide-react"

export default function CustomerDashboard() {
  const { items: repairs, fetchItems: fetchRepairs } = useRepairStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchRepairs()
  }, [fetchRepairs])

  // Filter repairs for this customer
  const myRepairs = useMemo(() => {
    // In a real system, the API would filter this, but we filter here for safety
    return repairs.filter(r => r.customerId === user?.id)
  }, [repairs, user])

  const statusMap = {
    pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
    in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700", icon: Wrench },
    ready_to_take: { label: "Ready to Pick Up", color: "bg-emerald-100 text-emerald-700", icon: Smartphone },
    completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
    delivered: { label: "Delivered", color: "bg-gray-100 text-gray-700", icon: Package },
    cancelled: { label: "Cancelled", color: "bg-rose-100 text-rose-700", icon: Clock },
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Track Your Repairs</h1>
            <p className="text-slate-500">Welcome back, {user?.name}. Here is the status of your devices.</p>
          </header>

          {myRepairs.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-slate-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-slate-900">No active repairs</h3>
                  <p className="text-slate-500">You don't have any devices currently in for repair.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRepairs.map((repair) => {
                const status = statusMap[repair.status] || statusMap.pending
                return (
                  <Card key={repair.id} className="overflow-hidden hover:shadow-md transition-shadow transition-all">
                    <CardHeader className="pb-3 border-b bg-white">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-slate-400" />
                            {repair.deviceId}
                          </CardTitle>
                          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                            Ref: {repair.id.slice(0, 8)}
                          </span>
                        </div>
                        <Badge className={`${status.color} border-none font-semibold px-3 py-1`}>
                          {status.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5 flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Issue Reported</span>
                        <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">
                          {repair.issueDescription}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 pt-2">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${status.color.split(' ')[0]}`}>
                            <status.icon className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">Status Updates</span>
                            <span className="text-xs text-slate-500">Last updated: {new Date(repair.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Est. Cost</span>
                          <span className="text-base font-bold text-slate-900">Rs. {repair.actualCost || repair.estimatedCost || '---'}</span>
                        </div>
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <section className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                <Wrench className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Need a regular checkup?</h3>
                <p className="text-sm text-slate-500">Keep your devices in top shape with scheduled maintenance.</p>
              </div>
            </div>
            <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-200">
              Schedule Repair
            </button>
          </section>
        </div>
      </main>
    </div>
  )
}
