import { Plus, UserPlus, Calendar } from "lucide-react"
import Link from "next/link"

export function ActionButtons() {
  return (
    <div className="grid w-full grid-cols-3 gap-4">
      <Link href="/admin/repairs/new" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-5 font-semibold text-white transition-colors hover:bg-[#4338CA] shadow-sm">
        <Plus className="h-4 w-4 shrink-0" />
        <span>New Repair</span>
      </Link>
      <button className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-card px-5 font-semibold text-foreground transition-colors hover:bg-muted shadow-sm">
        <UserPlus className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span>Add Customer</span>
      </button>
      <Link href="/admin/schedule" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-card px-5 font-semibold text-foreground transition-colors hover:bg-muted shadow-sm focus:outline-none">
        <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span>View Schedule</span>
      </Link>
    </div>
  )
}
