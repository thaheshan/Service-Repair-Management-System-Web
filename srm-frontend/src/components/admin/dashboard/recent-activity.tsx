"use client"

import { useState, useMemo } from "react"
import { CheckCircle2, Wrench, Package, ClipboardCheck, Download, Filter, ArrowUpDown, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/ui-admin-dashboard/dialog"

import { useGetDashboardAnalyticsQuery } from "@/services/api/dashboardApiSlice"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useRouter } from "next/navigation"

const formatTimeAgo = (date: any) => {
  if (!date) return "Just now";
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHrs = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHrs / 24);

  if (diffInMins < 1) return "Just now";
  if (diffInMins < 60) return `${diffInMins} min ago`;
  if (diffInHrs < 24) return `${diffInHrs} ${diffInHrs === 1 ? 'hour' : 'hours'} ago`;
  return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
}

const getActivityStyles = (type: string, title: string) => {
  if (type === "REPAIR") {
    if (title.includes("completed")) {
      return { icon: CheckCircle2, iconBg: "bg-[#D1FAE5]", iconColor: "text-[#10B981]" };
    }
    return { icon: Wrench, iconBg: "bg-[#DBEAFE]", iconColor: "text-[#3B82F6]" };
  }
  if (type === "INVENTORY") {
    return { icon: Package, iconBg: "bg-[#FEF3C7]", iconColor: "text-[#F59E0B]" };
  }
  return { icon: ClipboardCheck, iconBg: "bg-[#F3E8FF]", iconColor: "text-[#A855F7]" };
}

export function RecentActivity() {
  const { t } = useTranslation()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const user = useSelector((state: RootState) => state.auth.user);
  const { data: response, isLoading, isError } = useGetDashboardAnalyticsQuery(7);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterType, setFilterType] = useState("All")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  const allActivities = useMemo(() => {
    const rawNotifications = response?.data?.notifications || [];
    if (rawNotifications.length === 0) return [];

    return rawNotifications
      .filter((n: any) => {
        if (user?.role === 'TECHNICIAN' && n.type === 'REPAIR') {
          return !n.technicianId || n.technicianId === user.id;
        }
        return true;
      })
      .map((n: any) => {
        const type = n.type || "SYSTEM";
        const title = n.title || "Shop Event";
        const styles = getActivityStyles(type, title.toLowerCase());

        // Parse highlight (heuristic)
        let highlight = "";
        const desc = n.description || n.message || "";
        if (desc.includes("by")) {
          const parts = desc.split("by");
          highlight = parts[parts.length - 1].trim();
        } else if (desc.includes("for")) {
          const parts = desc.split("for");
          highlight = parts[parts.length - 1].trim();
        }

        return {
          id: n.id,
          type: type === "REPAIR" ? "Repair" : type === "INVENTORY" ? "Inventory" : "System",
          ...styles,
          title: title,
          highlight: highlight,
          description: desc,
          time: formatTimeAgo(n.time || n.createdAt),
          timestamp: (n.time || n.createdAt) ? new Date(n.time || n.createdAt).getTime() : Date.now()
        }
      });
  }, [response, user])

  // For the dashboard widget, always show only the 4 newest
  const widgetActivities = allActivities.slice(0, 4)

  // For the modal, apply filters and sort
  const filteredActivities = useMemo(() => {
    let result = [...allActivities]

    // Filter
    if (filterType !== "All") {
      result = result.filter(a => a.type === filterType)
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === "newest") return b.timestamp - a.timestamp
      return a.timestamp - b.timestamp
    })

    return result
  }, [allActivities, filterType, sortOrder])

  const handleDownloadPdf = () => {
    alert("Downloading Activity Report PDF...")
  }

  return (
    <>
      <div className="flex flex-col rounded-xl border border-border bg-card h-full">
        {/* Header */}
        <div className="px-5 pt-5 pb-4">
          <h3 className="text-base font-semibold text-foreground">{mounted ? t('dashboard.recentActivity') : 'Recent Activity'}</h3>
        </div>

        {/* Activity List */}
        <div className="flex flex-col px-5 pb-5 flex-1 min-h-[200px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs text-muted-foreground">Loading activity...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-destructive">
              <p className="text-xs font-medium">Failed to load activity</p>
            </div>
          ) : widgetActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
              <p className="text-xs font-medium">{mounted ? t('common.noActivity') || 'No recent activity' : 'No recent activity'}</p>
            </div>
          ) : (
            widgetActivities.map((activity, index) => (
              <div
                key={activity.id}
                onClick={() => activity.link && router.push(activity.link)}
                className={`flex gap-3.5 py-3.5 group ${index !== widgetActivities.length - 1 ? "border-b border-border" : ""
                  } ${activity.link ? "cursor-pointer hover:bg-muted/50 transition-colors px-1 rounded-lg" : ""}`}
              >
                {/* Icon */}
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity.iconBg} group-hover:scale-110 transition-transform`}>
                  <activity.icon className={`h-4.5 w-4.5 ${activity.iconColor}`} />
                </div>
                {/* Content */}
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm text-foreground">
                    {activity.title}{" "}
                    <span className="font-semibold">{activity.highlight}</span>
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Link */}
        <div className="mt-auto border-t border-border px-5 py-3 text-center flex items-center justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm font-medium text-primary hover:underline focus:outline-none"
          >
            {mounted ? t('common.viewAll') : 'View all activity'}
          </button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">

          <DialogHeader className="p-6 pb-4 border-b border-border bg-muted/50">
            <div className="flex items-center justify-between mb-4 pr-8">
              <DialogTitle className="text-xl font-bold text-foreground">{mounted ? t('dashboard.activityLog') || 'Activity Log' : 'Activity Log'}</DialogTitle>
              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors focus:outline-none shadow-sm"
              >
                <Download className="h-4 w-4" /> {mounted ? t('common.download') : 'Download PDF'}
              </button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">{mounted ? t('common.filter') || 'Filter' : 'Filter'}:</span>
                </div>
                <select
                  className="h-9 px-3 rounded-md border border-border bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">{mounted ? t('common.allCategories') || 'All Categories' : 'All Categories'}</option>
                  <option value="Repair">{mounted ? t('dashboard.repairs') : 'Repairs'}</option>
                  <option value="Inventory">{mounted ? t('dashboard.inventory') : 'Inventory'}</option>
                  <option value="Diagnostic">Diagnostics</option>
                  <option value="System">System</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">{mounted ? t('common.sortBy') || 'Sort By' : 'Sort By'}:</span>
                </div>
                <select
                  className="h-9 px-3 rounded-md border border-border bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto w-full p-2 bg-muted/20 min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-20">
                <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium text-muted-foreground">Fetching activity log...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-destructive text-center px-6">
                <X className="h-10 w-10 mb-4 opacity-20" />
                <p className="text-sm font-medium">Unable to load activity log. Please try again later.</p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground">
                <Filter className="h-10 w-10 mb-4 opacity-20" />
                <p className="text-sm font-medium">No activity found for this category.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border/40 last:border-0 rounded-lg mx-2"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activity.iconBg} shadow-sm border border-border/5`}>
                      <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                    </div>

                    <div className="flex flex-col gap-1 w-full relative pt-0.5">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-[14px] text-foreground">
                          {activity.title}{" "}
                          <span className="font-bold text-foreground">{activity.highlight}</span>
                        </p>
                        <span className="text-[12px] font-semibold text-muted-foreground whitespace-nowrap bg-card px-2 py-0.5 rounded-full border border-border shadow-sm">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-[13px] text-muted-foreground max-w-[90%]">{activity.description}</p>

                      <span className="absolute left-0 -bottom-2 translate-y-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                        {activity.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
