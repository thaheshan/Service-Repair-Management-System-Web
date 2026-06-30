"use client"
import { Search, Check, X, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

export type DateRangePreset = "today" | "this-week" | "this-month" | "last-30" | "custom" | null

export interface RepairFilters {
  statuses: string[]
  priorities: string[]
  deviceTypes: string[]
  technicians: string[]
  dateRange: DateRangePreset
  customDateFrom: string
  customDateTo: string
}

interface RepairsFilterProps {
  onApply: (filters: RepairFilters) => void
  onReset: () => void
  onClose: () => void
}

const DATE_RANGE_OPTIONS: { id: DateRangePreset; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "this-week", label: "This Week" },
  { id: "this-month", label: "This Month" },
  { id: "last-30", label: "Last 30 Days" },
  { id: "custom", label: "Custom Range" },
]

export function RepairsFilterSidebar({ onApply, onReset, onClose }: RepairsFilterProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([])
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangePreset>(null)
  const [customDateFrom, setCustomDateFrom] = useState("")
  const [customDateTo, setCustomDateTo] = useState("")
  const [techSearch, setTechSearch] = useState("")

  const toggleStatus = (s: string) => {
    if (s === "All") { setSelectedStatuses([]); return }
    setSelectedStatuses(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const toggleArrayItem = (item: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item])
  }

  const handleApply = () => {
    onApply({
      statuses: selectedStatuses,
      priorities: selectedPriorities,
      deviceTypes: selectedDeviceTypes,
      technicians: selectedTechnicians,
      dateRange: selectedDateRange,
      customDateFrom,
      customDateTo,
    })
  }

  const handleReset = () => {
    setSelectedStatuses([])
    setSelectedPriorities([])
    setSelectedDeviceTypes([])
    setSelectedTechnicians([])
    setSelectedDateRange(null)
    setCustomDateFrom("")
    setCustomDateTo("")
    setTechSearch("")
    onReset()
  }

  const technicians = [
    { name: "John Smith", initials: "JS", bg: "bg-[#4F46E5]" },
    { name: "Mike Chen", initials: "MC", bg: "bg-[#F59E0B]" },
    { name: "Tom Wilson", initials: "TW", bg: "bg-[#10B981]" },
    { name: "Alex Kumar", initials: "AK", bg: "bg-[#6366F1]" },
    { name: "Sarah Connor", initials: "SC", bg: "bg-[#EF4444]" },
  ]

  const filteredTechnicians = technicians.filter(t =>
    t.name.toLowerCase().includes(techSearch.toLowerCase())
  )

  // Count active filters
  const activeCount =
    selectedStatuses.length + selectedPriorities.length + selectedDeviceTypes.length +
    selectedTechnicians.length + (selectedDateRange ? 1 : 0)

  return (
    <div className="w-full sm:w-[280px] shrink-0 pr-6 pt-2 flex flex-col gap-6 h-full overflow-y-auto pb-8 custom-scrollbar">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-foreground">{mounted ? t('common.filter', 'Filters') : 'Filters'}</h2>
          {activeCount > 0 && (
            <span className="h-5 min-w-5 px-1.5 bg-[#4F46E5] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Status */}
      <div>
        <h3 className="text-[13px] font-bold text-foreground mb-3">{mounted ? t('common.status', 'Status') : 'Status'}</h3>
        <div className="flex flex-col gap-2.5">
          {["All", "Pending", "In Progress", "Ready", "Completed", "On Hold"].map((s) => {
            const isChecked = s === "All" ? selectedStatuses.length === 0 : selectedStatuses.includes(s)
            return (
              <label key={s} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleStatus(s) }}>
                <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${isChecked ? 'bg-[#4F46E5] border-[#4F46E5]' : 'border-muted-foreground/30 bg-card group-hover:border-[#4F46E5]'}`}>
                  {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </div>
                <span className="text-[13px] font-medium text-foreground flex-1 select-none">{s}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Priority */}
      <div>
        <h3 className="text-[13px] font-bold text-foreground mb-3">{mounted ? t('repairs.form.priority', 'Priority') : 'Priority'}</h3>
        <div className="flex flex-col gap-2.5">
          {[
            { label: "Urgent", color: "text-[#EF4444]", dot: "bg-[#EF4444]" },
            { label: "High", color: "text-[#F59E0B]", dot: "bg-[#F59E0B]" },
            { label: "Medium", color: "text-[#4F46E5]", dot: "bg-[#4F46E5]" },
            { label: "Low", color: "text-muted-foreground", dot: "bg-muted-foreground/40" }
          ].map((p) => {
            const isChecked = selectedPriorities.includes(p.label)
            return (
              <label key={p.label} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleArrayItem(p.label, selectedPriorities, setSelectedPriorities) }}>
                <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${isChecked ? 'bg-[#4F46E5] border-[#4F46E5]' : 'border-muted-foreground/30 bg-card group-hover:border-[#4F46E5]'}`}>
                  {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </div>
                <div className="flex items-center gap-2 select-none">
                  <div className={`h-2 w-2 rounded-full ${p.dot}`} />
                  <span className={`text-[13px] font-medium ${p.color}`}>{p.label}</span>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Date Range — now FUNCTIONAL */}
      <div>
        <h3 className="text-[13px] font-bold text-foreground mb-3 flex items-center justify-between">
          {mounted ? t('invoicesPage.date', 'Date Range') : 'Date Range'}
          {selectedDateRange && (
            <button
              onClick={() => { setSelectedDateRange(null); setCustomDateFrom(""); setCustomDateTo("") }}
              className="text-[10px] text-[#4F46E5] hover:underline font-medium"
            >
              {mounted ? t('common.clear', 'Clear') : 'Clear'}
            </button>
          )}
        </h3>
        <div className="flex flex-col gap-2.5">
          {DATE_RANGE_OPTIONS.map((range) => {
            const isSelected = selectedDateRange === range.id
            return (
              <label
                key={range.id}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={(e) => { e.preventDefault(); setSelectedDateRange(isSelected ? null : range.id) }}
              >
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-[#4F46E5]' : 'border-muted-foreground/30 group-hover:border-[#4F46E5]'}`}>
                  {isSelected && <div className="h-2 w-2 rounded-full bg-[#4F46E5]" />}
                </div>
                <span className={`text-[13px] font-medium select-none ${isSelected ? 'text-foreground font-semibold' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {range.label}
                </span>
              </label>
            )
          })}
        </div>

        {/* Custom Date Inputs */}
        {selectedDateRange === "custom" && (
          <div className="mt-4 flex flex-col gap-3 p-3 bg-muted/40 rounded-lg border border-border">
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wide">From</label>
              <input
                type="date"
                value={customDateFrom}
                onChange={(e) => setCustomDateFrom(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-card px-3 text-[12px] font-medium focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wide">To</label>
              <input
                type="date"
                value={customDateTo}
                onChange={(e) => setCustomDateTo(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-card px-3 text-[12px] font-medium focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Assigned To */}
      <div>
        <h3 className="text-[13px] font-bold text-foreground mb-2">{mounted ? t('schedule.assignTech', 'Assigned To') : 'Assigned To'}</h3>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={techSearch}
            onChange={(e) => setTechSearch(e.target.value)}
            placeholder="Search technicians..."
            className="h-8 w-full rounded-md border border-border bg-card pl-8 pr-3 text-[12px] outline-none focus:border-[#4F46E5]"
          />
        </div>
        <div className="flex flex-col gap-2.5">
          {filteredTechnicians.map((tech) => {
            const isChecked = selectedTechnicians.includes(tech.name)
            return (
              <label key={tech.name} className="flex items-center gap-2 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleArrayItem(tech.name, selectedTechnicians, setSelectedTechnicians) }}>
                <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${isChecked ? 'bg-[#4F46E5] border-[#4F46E5]' : 'border-muted-foreground/30 bg-card group-hover:border-[#4F46E5]'}`}>
                  {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </div>
                <div className={`h-5 w-5 rounded-full ${tech.bg} flex items-center justify-center text-[8px] font-bold text-white shrink-0 shadow-sm ml-1`}>
                  {tech.initials}
                </div>
                <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground line-clamp-1 select-none">{tech.name}</span>
              </label>
            )
          })}
          {filteredTechnicians.length === 0 && (
            <p className="text-[12px] text-muted-foreground italic px-1">No technicians found</p>
          )}
        </div>
      </div>

      {/* Device Type */}
      <div>
        <h3 className="text-[13px] font-bold text-foreground mb-3">{mounted ? t('repairs.form.deviceType', 'Device Type') : 'Device Type'}</h3>
        <div className="flex flex-col gap-2.5">
          {[
            { label: "Mobile Phone", value: "phone" },
            { label: "Tablet", value: "tablet" },
            { label: "Laptop", value: "laptop" },
            { label: "Gaming Console", value: "console" }
          ].map((dev) => {
            const isChecked = selectedDeviceTypes.includes(dev.value)
            return (
              <label key={dev.value} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleArrayItem(dev.value, selectedDeviceTypes, setSelectedDeviceTypes) }}>
                <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${isChecked ? 'bg-[#4F46E5] border-[#4F46E5]' : 'border-muted-foreground/30 bg-card group-hover:border-[#4F46E5]'}`}>
                  {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </div>
                <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground select-none">{dev.label}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2 pb-2">
        <button
          onClick={handleApply}
          className="h-9 w-full bg-[#4F46E5] text-white rounded-lg text-[13px] font-semibold hover:bg-[#4338CA] transition-colors focus:outline-none shadow-sm"
        >
          {mounted ? t('schedule.applyFilters', 'Apply Filters') : 'Apply Filters'} {activeCount > 0 ? `(${activeCount})` : ""}
        </button>
        <button
          onClick={handleReset}
          className="h-9 w-full text-[13px] font-semibold text-[#EF4444] hover:bg-destructive/10 rounded-lg transition-colors focus:outline-none"
        >
          {mounted ? t('schedule.resetAll', 'Reset All') : 'Reset All'}
        </button>
      </div>

    </div>
  )
}
