import { Wrench, Clock, DollarSign, Star } from "lucide-react"

const stats = [
  {
    title: "Today's Repairs",
    value: "12",
    change: "2 from yesterday",
    changeDirection: "up" as const,
    icon: Wrench,
    iconBg: "bg-[#EEF2FF]",
    iconColor: "text-[#4F46E5]",
    borderColor: "border-l-[#4F46E5]",
  },
  {
    title: "Pending Repairs",
    value: "8",
    change: "1 from yesterday",
    changeDirection: "down" as const,
    icon: Clock,
    iconBg: "bg-[#FEF3C7]",
    iconColor: "text-[#F59E0B]",
    borderColor: "border-l-[#F59E0B]",
  },
  {
    title: "Revenue Today",
    value: "Rs. 45,200",
    change: "Rs. 8,500 from yesterday",
    changeDirection: "up" as const,
    icon: DollarSign,
    iconBg: "bg-[#D1FAE5]",
    iconColor: "text-[#10B981]",
    borderColor: "border-l-[#10B981]",
  },
  {
    title: "Customer Satisfaction",
    value: "4.8/5",
    change: "From 120 reviews",
    changeDirection: "neutral" as const,
    icon: Star,
    iconBg: "bg-[#FEF3C7]",
    iconColor: "text-[#F59E0B]",
    borderColor: "border-l-[#F59E0B]",
  },
]

export function StatCards() {
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
              <div className="flex items-center gap-1.5 pt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
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
