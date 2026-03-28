import { Search, Check } from "lucide-react"
import { useState } from "react"

export interface RepairFilters {
  statuses: string[]
  priorities: string[]
  deviceTypes: string[]
  technicians: string[]
}

interface RepairsFilterProps {
  onApply: (filters: RepairFilters) => void
  onReset: () => void
}

export function RepairsFilterSidebar({ onApply, onReset }: RepairsFilterProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([])
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([])

  const toggleStatus = (s: string) => {
    if (s === "All") {
      setSelectedStatuses([])
      return
    }
    setSelectedStatuses(prev => 
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  const toggleArrayItem = (item: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item])
  }

  const handleApply = () => {
    onApply({
      statuses: selectedStatuses,
      priorities: selectedPriorities,
      deviceTypes: selectedDeviceTypes,
      technicians: selectedTechnicians
    })
  }

  const handleReset = () => {
    setSelectedStatuses([])
    setSelectedPriorities([])
    setSelectedDeviceTypes([])
    setSelectedTechnicians([])
    onReset()
  }

  return (
    <div className="w-[280px] shrink-0 pr-6 pt-2 flex flex-col gap-8 h-full overflow-y-auto pb-8 custom-scrollbar">
      
      {/* Filters Title */}
      <h2 className="text-base font-bold text-foreground">Filters</h2>

      {/* Status section */}
      <div>
        <h3 className="text-[13px] font-bold text-foreground mb-3">Status</h3>
        <div className="flex flex-col gap-3">
          {["All", "Pending", "In Progress", "Ready", "Completed", "On Hold"].map((s, i) => {
            const isChecked = s === "All" ? selectedStatuses.length === 0 : selectedStatuses.includes(s)
            return (
              <label key={s} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleStatus(s); }}>
                <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${isChecked ? 'bg-[#4F46E5] border-[#4F46E5]' : 'border-muted-foreground/30 bg-card group-hover:border-[#4F46E5]'}`}>
                  {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </div>
                <span className="text-[13px] font-medium text-foreground flex-1 select-none">{s}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Priority section */}
      <div>
        <h3 className="text-[13px] font-bold text-foreground mb-3">Priority</h3>
        <div className="flex flex-col gap-3">
          {[
            {label: "Urgent", color: "text-[#EF4444]"}, 
            {label: "High", color: "text-[#F59E0B]"}, 
            {label: "Medium", color: "text-[#4F46E5]"}, 
            {label: "Low", color: "text-muted-foreground"}
          ].map((p, i) => {
            const isChecked = selectedPriorities.includes(p.label)
            return (
              <label key={p.label} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleArrayItem(p.label, selectedPriorities, setSelectedPriorities); }}>
                 <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${isChecked ? 'bg-[#4F46E5] border-[#4F46E5]' : 'border-muted-foreground/30 bg-card group-hover:border-[#4F46E5]'}`}>
                  {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </div>
                <div className={`flex items-center gap-1.5 ${p.color} select-none`}>
                  {p.label === 'Urgent' && <span className="text-[10px] bg-[#EF4444] text-white rounded-full h-3 w-3 inline-flex items-center justify-center pb-[1px]">!</span>}
                  <span className="text-[13px] font-medium">{p.label}</span>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Date Range section - View Only */}
      <div className="opacity-60 pointer-events-none">
        <h3 className="text-[13px] font-bold text-foreground mb-3 flex items-center justify-between">Date Range <span className="text-[10px] font-normal italic text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Coming Soon</span></h3>
        <div className="flex flex-col gap-3">
          {["Today", "This Week", "This Month", "Last 30 Days", "Custom Range"].map((range, i) => (
            <label key={range} className="flex items-center gap-3 cursor-not-allowed group">
              <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${i === 2 ? 'border-[#4F46E5]' : 'border-muted-foreground/40 group-hover:border-[#4F46E5]'}`}>
                {i === 2 && <div className="h-2 w-2 rounded-full bg-[#4F46E5]" />}
              </div>
              <span className={`text-[13px] font-medium ${i === 2 ? 'text-foreground' : 'text-muted-foreground'}`}>{range}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Assigned To */}
      <div>
        <h3 className="text-[13px] font-bold text-foreground mb-2">Assigned To</h3>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search technicians..."
            className="h-8 w-full rounded-md border border-border bg-card pl-8 pr-3 text-[12px] outline-none focus:border-[#4F46E5]"
          />
        </div>
        <div className="flex flex-col gap-3">
          {[
            {name: "John Smith", initials: "JS", bg: "bg-[#4F46E5]"},
            {name: "Mike Chen", initials: "MC", bg: "bg-[#F59E0B]"},
            {name: "Tom Wilson", initials: "TW", bg: "bg-[#10B981]"},
            {name: "Alex Kumar", initials: "AK", bg: "bg-[#6366F1]"}
          ].map((tech) => {
            const isChecked = selectedTechnicians.includes(tech.name)
            return (
              <label key={tech.name} className="flex items-center gap-2 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleArrayItem(tech.name, selectedTechnicians, setSelectedTechnicians); }}>
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
        </div>
      </div>

      {/* Device Type */}
      <div>
        <h3 className="text-[13px] font-bold text-foreground mb-3">Device Type</h3>
        <div className="flex flex-col gap-3">
          {[
            {label: "Mobile Phone", value: "phone"},
            {label: "Tablet", value: "tablet"},
            {label: "Laptop", value: "laptop"},
            {label: "Gaming Console", value: "console"}
          ].map((dev) => {
            const isChecked = selectedDeviceTypes.includes(dev.value)
            return (
              <label key={dev.value} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleArrayItem(dev.value, selectedDeviceTypes, setSelectedDeviceTypes); }}>
                 <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${isChecked ? 'bg-[#4F46E5] border-[#4F46E5]' : 'border-muted-foreground/30 bg-card group-hover:border-[#4F46E5]'}`}>
                    {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                 </div>
                 <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground select-none">{dev.label}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Submit */}
      <div className="pt-2 flex flex-col gap-2 mt-4 pb-2">
        <button onClick={handleApply} className="h-9 w-full bg-[#4F46E5] text-white rounded-lg text-[13px] font-semibold hover:bg-[#4338CA] transition-colors focus:outline-none shadow-sm">
          Apply Filters
        </button>
        <button onClick={handleReset} className="h-9 w-full text-[13px] font-semibold text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors focus:outline-none">
          Reset All
        </button>
      </div>

    </div>
  )
}
