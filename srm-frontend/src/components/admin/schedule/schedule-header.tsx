import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import { ScheduleFilterPopover, ScheduleFilters } from "@/components/admin/schedule/schedule-filter-popover"
import { ScheduleAddModal } from "@/components/admin/schedule/schedule-add-modal"

interface ScheduleHeaderProps {
  onApplyFilters?: (filters: ScheduleFilters) => void
  currentWeekStart?: Date
  onNextWeek?: () => void
  onPrevWeek?: () => void
  onSetWeekStart?: (date: Date) => void
  onAddAppointment?: (data: any) => void
}

export function ScheduleHeader({ onApplyFilters, currentWeekStart, onNextWeek, onPrevWeek, onSetWeekStart, onAddAppointment }: ScheduleHeaderProps) {
  
  const startDateText = currentWeekStart 
    ? currentWeekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Jan 13"
  const endDate = currentWeekStart ? new Date(currentWeekStart) : new Date("2026-01-13T00:00:00")
  if (currentWeekStart) endDate.setDate(endDate.getDate() + 7)
  const endDateText = endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const yearText = endDate.getFullYear()

  const weekText = `Week of ${startDateText} - ${endDateText}, ${yearText}`

  const handleTodayClick = () => {
    if (onSetWeekStart) {
      const today = new Date()
      const day = today.getDay()
      const diff = today.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(today.setDate(diff))
      monday.setHours(0, 0, 0, 0)
      onSetWeekStart(monday)
    }
  }

  return (
    <div className="flex flex-col gap-4 border-b border-border bg-card px-6 py-4">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/admin/dashboard" className="cursor-pointer hover:text-foreground">Dashboard</Link>
        <span>&gt;</span>
        <Link href="/admin/repairs" className="cursor-pointer hover:text-foreground">Repairs</Link>
        <span>&gt;</span>
        <span className="font-semibold text-foreground">View Schedule</span>
      </div>

      {/* Main Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        
        <h1 className="text-2xl font-bold tracking-tight text-foreground">View Schedule</h1>

        <div className="flex flex-col md:flex-row md:items-center gap-4 xl:gap-6">
          {/* Calendar Nav */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={onPrevWeek}
                className="text-muted-foreground hover:text-foreground focus:outline-none"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-lg font-bold text-foreground w-[260px] text-center">
                {weekText}
              </span>
              <button 
                onClick={onNextWeek}
                className="text-muted-foreground hover:text-foreground focus:outline-none"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <button 
              onClick={handleTodayClick}
              className="text-sm font-semibold text-[#4F46E5] hover:underline focus:outline-none"
            >
              Today
            </button>
          </div>

          <div className="h-6 w-px bg-border" />

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ScheduleFilterPopover onApplyFilters={onApplyFilters} onSetWeekStart={onSetWeekStart} />
            <ScheduleAddModal onAddAppointment={onAddAppointment} currentWeekStart={currentWeekStart} />
          </div>
        </div>

      </div>
    </div>
  )
}
