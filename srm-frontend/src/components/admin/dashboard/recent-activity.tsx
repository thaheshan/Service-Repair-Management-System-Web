import { CheckCircle2, Wrench, Package, ClipboardCheck } from "lucide-react"

const activities = [
  {
    icon: CheckCircle2,
    iconBg: "bg-[#D1FAE5]",
    iconColor: "text-[#10B981]",
    title: "Completed repair for",
    highlight: "Priya Sharma",
    description: "iPhone 13 Pro - Screen Replacement • Rs. 8,500",
    time: "2 hours ago",
  },
  {
    icon: Wrench,
    iconBg: "bg-[#DBEAFE]",
    iconColor: "text-[#3B82F6]",
    title: "Started repair for",
    highlight: "Vikram Singh",
    description: "MacBook Pro - Keyboard Replacement",
    time: "3 hours ago",
  },
  {
    icon: Package,
    iconBg: "bg-[#FEF3C7]",
    iconColor: "text-[#F59E0B]",
    title: "Parts received for",
    highlight: "Arjun Patel",
    description: "Samsung Galaxy S23 - Battery replacement part",
    time: "5 hours ago",
  },
  {
    icon: ClipboardCheck,
    iconBg: "bg-[#F3E8FF]",
    iconColor: "text-[#A855F7]",
    title: "Diagnostic completed for",
    highlight: "Meera Joshi",
    description: "OnePlus 11 - Water damage assessment",
    time: "Yesterday at 4:30 PM",
  },
]

export function RecentActivity() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
      </div>

      {/* Activity List */}
      <div className="flex flex-col px-5 pb-5">
        {activities.map((activity, index) => (
          <div
            key={activity.highlight}
            className={`flex gap-3.5 py-3.5 ${
              index !== activities.length - 1 ? "border-b border-border" : ""
            }`}
          >
            {/* Icon */}
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity.iconBg}`}>
              <activity.icon className={`h-4.5 w-4.5 ${activity.iconColor}`} />
            </div>
            {/* Content */}
            <div className="flex flex-col gap-0.5">
              <p className="text-sm text-foreground">
                {activity.title}{" "}
                <span className="font-semibold">{activity.highlight}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <div className="mt-auto border-t border-border px-5 py-3 text-center">
        <button className="text-sm font-medium text-primary hover:underline">View all</button>
      </div>
    </div>
  )
}
