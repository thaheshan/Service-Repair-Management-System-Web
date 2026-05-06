import { Wrench, Clock, DollarSign, Star } from "lucide-react"
import { useGetDashboardAnalyticsQuery } from "@/services/api/dashboardApiSlice"

export function StatCards() {
  const { data: response, isLoading } = useGetDashboardAnalyticsQuery({});
  const analyticsData = response?.data;

  const stats = [
    {
      title: "Total Repairs",
      value: isLoading ? "..." : analyticsData?.stats?.totalRepairs?.toString() || "0",
      change: isLoading ? "..." : analyticsData?.stats?.repairChange || "0%",
      changeDirection: "up" as const,
      icon: Wrench,
      iconBg: "bg-[#EEF2FF]",
      iconColor: "text-[#4F46E5]",
      borderColor: "border-l-[#4F46E5]",
    },
    {
      title: "Pending Repairs",
      value: isLoading ? "..." : analyticsData?.stats?.pendingRepairs?.toString() || "0",
      change: "Action required",
      changeDirection: "neutral" as const,
      icon: Clock,
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-[#F59E0B]",
      borderColor: "border-l-[#F59E0B]",
    },
    {
      title: "Total Revenue",
      value: isLoading ? "..." : `LKR ${analyticsData?.stats?.totalRevenue?.toLocaleString() || "0"}`,
      change: isLoading ? "..." : analyticsData?.stats?.revenueChange || "0%",
      changeDirection: "up" as const,
      icon: DollarSign,
      iconBg: "bg-[#D1FAE5]",
      iconColor: "text-[#10B981]",
      borderColor: "border-l-[#10B981]",
    },
    {
      title: "Active Technicians",
      value: isLoading ? "..." : analyticsData?.stats?.activeTechnicians?.toString() || "0",
      change: "Currently assigned",
      changeDirection: "neutral" as const,
      icon: Star,
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-[#F59E0B]",
      borderColor: "border-l-[#F59E0B]",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="flex h-full items-center justify-between rounded-2xl border border-border/60 bg-card p-4 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
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
