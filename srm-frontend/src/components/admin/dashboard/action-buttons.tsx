import { Plus, UserPlus, Calendar } from "lucide-react"

export function ActionButtons() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#4338CA]">
        <Plus className="h-4 w-4" />
        <span>New Repair</span>
      </button>
      <button className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
        <UserPlus className="h-4 w-4" />
        <span>Add Customer</span>
      </button>
      <button className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
        <Calendar className="h-4 w-4" />
        <span>View Schedule</span>
      </button>
    </div>
  )
}
