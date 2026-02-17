import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/ui-admin-dashboard/avatar"

const technicians = [
  { name: "David Chen", rating: 4.9, avatar: "david" },
  { name: "James Miller", rating: 4.8, avatar: "james" },
  { name: "Alex Kumar", rating: 4.7, avatar: "alex" },
  { name: "Ryan Thomas", rating: 4.6, avatar: "ryan" },
  { name: "Kevin Lee", rating: 4.8, avatar: "kevin" },
]

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= fullStars
              ? "fill-[#F59E0B] text-[#F59E0B]"
              : "fill-[#E5E7EB] text-[#E5E7EB]"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-foreground">{rating}</span>
    </div>
  )
}

export function TopTechnicians() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-base font-semibold text-foreground">Top Technicians This Week</h3>
      </div>

      {/* Table Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-2">
        <span className="text-xs font-medium text-muted-foreground">Name</span>
        <span className="text-xs font-medium text-muted-foreground">Avg Rating</span>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {technicians.map((tech, index) => (
          <div
            key={tech.name}
            className={`flex items-center justify-between px-5 py-3 ${
              index !== technicians.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.avatar}`} alt={tech.name} />
                <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                  {tech.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{tech.name}</span>
            </div>
            <StarRating rating={tech.rating} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3 text-center">
        <button className="text-sm font-medium text-primary hover:underline">View all staff</button>
      </div>
    </div>
  )
}
