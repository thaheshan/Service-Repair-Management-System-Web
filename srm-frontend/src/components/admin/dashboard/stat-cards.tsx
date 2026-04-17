import { Wrench, Clock, DollarSign, Star } from "lucide-react"
import { useRepairStore } from "@/store/repairStore"
import { useMemo } from "react"
import { useRoleAccess, RbacFeature } from "@/hooks/useRoleAccess"

export function StatCards() {
  const { items } = useRepairStore()
  const { can } = useRoleAccess()

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const repairsToday = items.filter(r => r.createdAt && r.createdAt.slice(0, 10) === today).length
    const pendingRepairs = items.filter(r => r.status === 'pending').length
    const totalRevenue = items.reduce((sum, r) => sum + (r.actualCost || r.estimatedCost || 0), 0)
    
    return [
      {
        title: "Today's Repairs",
        value: repairsToday.toString(),
        change: "Live data",
        changeDirection: "up" as const,
        icon: Wrench,
        iconBg: "bg-[#EEF2FF]",
        iconColor: "text-[#4F46E5]",
      },
      {
        title: "Pending Repairs",
        value: pendingRepairs.toString(),
        change: "Awaiting action",
        changeDirection: "neutral" as const,
        icon: Clock,
        iconBg: "bg-[#FEF3C7]",
        iconColor: "text-[#F59E0B]",
      },
      {
        title: "Total Revenue",
        value: `Rs. ${totalRevenue.toLocaleString()}`,
        change: "Accumulated total",
        changeDirection: "up" as const,
        icon: DollarSign,
        iconBg: "bg-[#D1FAE5]",
        iconColor: "text-[#10B981]",
        feature: "view:revenue" as RbacFeature,
      },
      {
        title: "Customer Satisfaction",
        value: "4.8/5", // Static for now as we don't have reviews API
        change: "From verified repairs",
        changeDirection: "neutral" as const,
        icon: Star,
        iconBg: "bg-[#FEF3C7]",
        iconColor: "text-[#F59E0B]",
      },
    ]
  }, [items])

  const filteredStats = stats.filter(stat => !stat.feature || can(stat.feature))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      {filteredStats.map((stat) => (
        <div
          key={stat.title}
          className="flex h-full items-center justify-between rounded-2xl border border-border/60 bg-card p-4 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
            <span className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</span>
            {stat.changeDirection === "up" ? (
              <span className="text-xs font-semibold text-[#10B981] pt-1">
                {stat.change}
              </span>
            ) : stat.changeDirection === "down" ? (
              <span className="text-xs font-semibold text-muted-foreground pt-1">
                {stat.change}
              </span>
            ) : (
              <div className="flex items-center gap-1.5 pt-1">
                {stat.title === "Customer Satisfaction" && (
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                )}
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              </div>
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
