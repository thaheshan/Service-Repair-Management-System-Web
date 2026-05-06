"use client"

import { useState } from "react"
import { Filter, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"

export interface ScheduleFilters {
  statuses: string[]
  technicianId: string
  serviceTypeId: string
}

interface ScheduleFilterPopoverProps {
  onApplyFilters?: (filters: ScheduleFilters) => void
  onSetWeekStart?: (date: Date) => void
}

export function ScheduleFilterPopover({ onApplyFilters, onSetWeekStart }: ScheduleFilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("Week")
  
  const [showScheduled, setShowScheduled] = useState(true)
  const [showInProgress, setShowInProgress] = useState(true)
  const [showCompleted, setShowCompleted] = useState(true)
  
  const [selectedTech, setSelectedTech] = useState("all")
  const [selectedService, setSelectedService] = useState("all")

  const [viewMonth, setViewMonth] = useState<Date>(new Date("2026-01-01T00:00:00"))

  const handlePrevMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
  const handleNextMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))

  // Generate 42 days for the calendar grid
  const monthStart = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
  const monthEnd = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0)
  
  const startOffset = monthStart.getDay() // 0 = Sunday
  
  const calendarDays = []
  
  const prevMonthEnd = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 0)
  for (let i = startOffset - 1; i >= 0; i--) {
    calendarDays.push({ 
      date: new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), prevMonthEnd.getDate() - i), 
      isCurrentMonth: false 
    })
  }
  
  for (let i = 1; i <= monthEnd.getDate(); i++) {
    calendarDays.push({ 
      date: new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i), 
      isCurrentMonth: true 
    })
  }
  
  const remaining = 42 - calendarDays.length
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({ 
      date: new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, i), 
      isCurrentMonth: false 
    })
  }

  const handleDateClick = (clickedDate: Date) => {
    const jsDay = clickedDate.getDay() // 0 is Sun, 1 is Mon...
    const diffToMonday = jsDay === 0 ? -6 : 1 - jsDay
    const monday = new Date(clickedDate)
    monday.setDate(monday.getDate() + diffToMonday)
    if (onSetWeekStart) {
      onSetWeekStart(monday)
    }
  }

  const handleApply = () => {
    if (onApplyFilters) {
      const activeColors: string[] = []
      // Assuming mapping: Scheduled -> Blue, In Progress (Pending) -> Orange, Completed -> Green
      if (showScheduled) activeColors.push("bg-[#4F46E5]")
      if (showInProgress) activeColors.push("bg-[#F59E0B]")
      if (showCompleted) activeColors.push("bg-[#10B981]")
        
      onApplyFilters({
        statuses: activeColors,
        technicianId: selectedTech,
        serviceTypeId: selectedService
      })
    }
    setIsOpen(false)
  }

  const handleReset = () => {
    setShowScheduled(true)
    setShowInProgress(true)
    setShowCompleted(true)
    setSelectedTech("all")
    setSelectedService("all")
    if (onApplyFilters) {
      onApplyFilters({
        statuses: ["bg-[#4F46E5]", "bg-[#F59E0B]", "bg-[#10B981]"],
        technicianId: "all",
        serviceTypeId: "all"
      })
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted shadow-sm"
      >
        <Filter className="h-4 w-4 shrink-0" />
        Filters
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-[320px] rounded-xl border border-border bg-card p-4 shadow-lg">
          {/* Mini Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-1 text-muted-foreground hover:bg-muted rounded focus:outline-none">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold text-foreground">
              {viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <button onClick={handleNextMonth} className="p-1 text-muted-foreground hover:bg-muted rounded focus:outline-none">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center mb-6">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={`${d}-${i}`} className="text-[10px] font-medium text-muted-foreground py-1">{d}</div>
            ))}
            {calendarDays.map((d, i) => (
              <div 
                key={i} 
                onClick={() => handleDateClick(d.date)}
                className={`text-xs py-1 cursor-pointer rounded transition-colors hover:bg-muted ${
                  !d.isCurrentMonth ? 'text-muted-foreground/60' : 'font-medium text-foreground hover:text-foreground'
                }`}
              >
                {d.date.getDate()}
              </div>
            ))}
          </div>

          {/* View Toggles */}
          <div className="flex items-center rounded-lg bg-muted p-1 mb-6">
            {['Day', 'Week', 'Month', 'Agenda'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-md py-1 text-xs font-medium ${
                  activeTab === tab ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-muted-foreground hover:bg-background/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Technician Dropdown */}
          <div className="mb-4 relative">
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Technician</label>
            <select 
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="flex h-9 w-full appearance-none items-center justify-between rounded-lg border border-border px-3 text-xs text-foreground bg-background hover:bg-muted focus:outline-none focus:border-[#4F46E5] cursor-pointer"
            >
              <option value="all">All Technicians</option>
              <option value="1">John Doe</option>
              <option value="2">Jane Smith</option>
              <option value="3">Mike Johnson</option>
            </select>
            <ChevronDown className="absolute right-3 top-[26px] h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Service Type Dropdown */}
          <div className="mb-6 relative">
            <label className="text-xs font-semibold text-foreground mb-1.5 block">Service Type</label>
            <select 
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="flex h-9 w-full appearance-none items-center justify-between rounded-lg border border-border px-3 text-xs text-foreground bg-background hover:bg-muted focus:outline-none focus:border-[#4F46E5] cursor-pointer"
            >
              <option value="all">All Services</option>
              <option value="1">Screen Replacement</option>
              <option value="2">Battery Replacement</option>
              <option value="3">Diagnostic</option>
            </select>
            <ChevronDown className="absolute right-3 top-[26px] h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Status Checkboxes */}
          <div className="mb-8">
            <label className="text-xs font-semibold text-foreground mb-2 block">Status</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showScheduled}
                  onChange={(e) => setShowScheduled(e.target.checked)}
                  className="h-3.5 w-3.5 rounded-sm accent-[#4F46E5] text-white focus:ring-[#4F46E5] cursor-pointer" 
                />
                <span className="text-xs text-foreground font-medium">Scheduled</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showInProgress}
                  onChange={(e) => setShowInProgress(e.target.checked)}
                  className="h-3.5 w-3.5 rounded-sm accent-[#4F46E5] text-white focus:ring-[#4F46E5] cursor-pointer" 
                />
                <span className="text-xs text-foreground font-medium">In Progress / Pending</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="h-3.5 w-3.5 rounded-sm accent-[#4F46E5] text-white focus:ring-[#4F46E5] cursor-pointer" 
                />
                <span className="text-xs text-foreground font-medium">Completed</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleApply}
              className="w-full h-9 rounded-lg bg-[#4F46E5] text-xs font-semibold text-white hover:bg-[#4338CA]"
            >
              Apply Filters
            </button>
            <button 
              onClick={handleReset}
              className="w-full h-8 text-xs font-semibold text-[#EF4444] hover:underline"
            >
              Reset All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
