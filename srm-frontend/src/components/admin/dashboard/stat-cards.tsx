import { Wrench, Clock, DollarSign, Star, TrendingUp } from "lucide-react"
import { useGetDashboardAnalyticsQuery } from "@/services/api/dashboardApiSlice"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

export function StatCards({ days = 30 }: { days?: number }) {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const { data: response, isLoading } = useGetDashboardAnalyticsQuery({ days });
  const analyticsData = response?.data;
  const user = useSelector((state: RootState) => state.auth.user)

  const stats = [
    {
      title: "totalRepairs",
      value: isLoading ? "..." : analyticsData?.stats?.totalRepairs?.toString() || "0",
      change: isLoading ? "..." : analyticsData?.stats?.repairChange || "0%",
      changeDirection: "up" as const,
      icon: Wrench,
      iconBg: "bg-[#EEF2FF]",
      iconColor: "text-[#4F46E5]",
      borderColor: "border-l-[#4F46E5]",
    },
    {
      title: "pendingRepairs",
      value: isLoading ? "..." : analyticsData?.stats?.pendingRepairs?.toString() || "0",
      change: mounted ? t('dashboard.stats.actionRequired') : "Action required",
      changeDirection: "neutral" as const,
      icon: Clock,
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-[#F59E0B]",
      borderColor: "border-l-[#F59E0B]",
    },
    {
      title: "revenue",
      value: isLoading ? "..." : `LKR ${analyticsData?.stats?.totalRevenue?.toLocaleString() || "0"}`,
      change: isLoading ? "..." : analyticsData?.stats?.revenueChange || "0%",
      changeDirection: "up" as const,
      icon: DollarSign,
      iconBg: "bg-[#D1FAE5]",
      iconColor: "text-[#10B981]",
      borderColor: "border-l-[#10B981]",
    },
    {
      title: "netProfit",
      value: isLoading ? "..." : `LKR ${(analyticsData?.stats?.netProfit ?? 0).toLocaleString()}`,
      change: isLoading ? "..." : (() => {
        const profit = analyticsData?.stats?.netProfit ?? 0;
        const revenue = analyticsData?.stats?.totalRevenue ?? 0;
        if (revenue === 0) return "0%";
        const margin = Math.round((profit / revenue) * 100);
        return `${margin}% margin`;
      })(),
      changeDirection: (analyticsData?.stats?.netProfit ?? 0) >= 0 ? "up" as const : "down" as const,
      icon: TrendingUp,
      iconBg: "bg-[#F3E8FF]",
      iconColor: "text-[#9333EA]",
      borderColor: "border-l-[#9333EA]",
    },
    {
      title: "activeTechnicians",
      value: isLoading ? "..." : analyticsData?.stats?.activeTechnicians?.toString() || "0",
      change: mounted ? t('dashboard.stats.currentlyAssigned') : "Currently assigned",
      changeDirection: "neutral" as const,
      icon: Star,
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-[#F59E0B]",
      borderColor: "border-l-[#F59E0B]",
    },
  ]

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${
      user?.department?.toLowerCase() === 'inventory'
        ? 'xl:grid-cols-2 max-w-2xl'
        : user?.role === 'TECHNICIAN'
        ? 'xl:grid-cols-3'
        : 'xl:grid-cols-5'
    } gap-4 lg:gap-6`}>
      {stats
        .filter(stat => {
          if (user?.role === 'TECHNICIAN') {
            return stat.title !== 'revenue' && stat.title !== 'netProfit'
          }
          if (user?.department?.toLowerCase() === 'inventory') {
            return stat.title === 'revenue' || stat.title === 'netProfit'
          }
          return true
        })
        .map((stat) => (
        <div
          key={stat.title}
          className="flex h-full items-center justify-between rounded-2xl border border-border/60 bg-card p-4 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">
              {mounted ? t(`dashboard.stats.${stat.title}`) : stat.title}
            </span>
            <span className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</span>
            {stat.changeDirection === "up" ? (
              <span className="text-xs font-semibold text-[#10B981] pt-1">
                {"↑ "}{stat.change}
              </span>
            ) : stat.changeDirection === "down" ? (
              <span className="text-xs font-semibold text-muted-foreground pt-1">
                {"↓ "}{stat.change}
              </span>
            ) : (
              <span className="text-xs font-semibold text-muted-foreground pt-1">
                {stat.change}
              </span>
            )}
          </div>
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${stat.iconBg}`}>
            <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
          </div>
        </div>
      ))}
    </div>
  )
}
