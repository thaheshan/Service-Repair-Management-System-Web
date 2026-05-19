"use client"
import { Search, Check, X, ChevronDown, SlidersHorizontal, Calendar, DollarSign, User, Smartphone, Tag } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

export interface InvoiceFilters {
  types: string[]
  statuses: string[]
  staff: string[]
  devices: string[]
  amountRange: { min: number; max: number }
  dateFrom: string
  dateTo: string
}

interface InvoicesFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: InvoiceFilters) => void
  onReset: () => void
  currentFilters: InvoiceFilters
}

const DATE_PRESETS = [
  { id: "today", label: "Today" },
  { id: "this-week", label: "This Week" },
  { id: "this-month", label: "This Month" },
  { id: "last-30", label: "Last 30 Days" },
]

export function InvoicesFilterModal({ isOpen, onClose, onApply, onReset, currentFilters }: InvoicesFilterModalProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [tempFilters, setTempFilters] = useState<InvoiceFilters>(currentFilters)

  useEffect(() => {
    if (isOpen) {
      setTempFilters(currentFilters)
    }
  }, [isOpen, currentFilters])

  if (!isOpen) return null

  const toggleArrayItem = (item: string, current: string[], key: keyof InvoiceFilters) => {
    const updated = current.includes(item) ? current.filter(x => x !== item) : [...current, item]
    setTempFilters(prev => ({ ...prev, [key]: updated }))
  }

  const handleApply = () => {
    onApply(tempFilters)
    onClose()
  }

  const handleReset = () => {
    const reset = {
      types: [],
      statuses: [],
      staff: [],
      devices: [],
      amountRange: { min: 0, max: 100000 },
      dateFrom: "",
      dateTo: ""
    }
    setTempFilters(reset)
    onReset()
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[4px] animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-[500px] max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-border">
        
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-[#4F46E5] text-white shadow-lg">
              <SlidersHorizontal className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-[22px] font-black text-foreground tracking-tight">{mounted ? t('invoicesPage.filters') : 'Filters'}</h2>
              <p className="text-[13px] text-muted-foreground font-bold">Refine your invoice search</p>
            </div>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-slate-400 hover:bg-muted transition-all focus:outline-none">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Status */}
          <div>
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <Check className="h-3.5 w-3.5" /> Payment Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Paid", "Pending", "Overdue"].map(status => {
                const isSelected = tempFilters.statuses.includes(status)
                return (
                  <button
                    key={status}
                    onClick={() => toggleArrayItem(status, tempFilters.statuses, 'statuses')}
                    className={`h-10 px-5 rounded-xl text-[13px] font-bold transition-all border ${isSelected ? 'bg-[#4F46E5] border-[#4F46E5] text-white shadow-md' : 'bg-card border-border text-foreground hover:border-[#4F46E5] hover:text-[#4F46E5]'}`}
                  >
                    {status}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <DollarSign className="h-3.5 w-3.5" /> Amount Range (LKR)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-muted-foreground">Min</span>
                <input
                  type="number"
                  value={tempFilters.amountRange.min}
                  onChange={(e) => setTempFilters(p => ({ ...p, amountRange: { ...p.amountRange, min: +e.target.value } }))}
                  className="w-full h-11 pl-12 pr-4 rounded-xl border border-border bg-background text-foreground text-[13px] font-bold focus:border-[#4F46E5] outline-none"
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-muted-foreground">Max</span>
                <input
                  type="number"
                  value={tempFilters.amountRange.max}
                  onChange={(e) => setTempFilters(p => ({ ...p, amountRange: { ...p.amountRange, max: +e.target.value } }))}
                  className="w-full h-11 pl-12 pr-4 rounded-xl border border-border bg-background text-foreground text-[13px] font-bold focus:border-[#4F46E5] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" /> Date Range
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase">From</label>
                <input
                  type="date"
                  value={tempFilters.dateFrom}
                  onChange={(e) => setTempFilters(p => ({ ...p, dateFrom: e.target.value }))}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground text-[13px] font-bold focus:border-[#4F46E5] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase">To</label>
                <input
                  type="date"
                  value={tempFilters.dateTo}
                  onChange={(e) => setTempFilters(p => ({ ...p, dateTo: e.target.value }))}
                  className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground text-[13px] font-bold focus:border-[#4F46E5] outline-none"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {DATE_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => {
                    const now = new Date()
                    let from = new Date()
                    if (preset.id === "today") from = now
                    if (preset.id === "this-week") from.setDate(now.getDate() - 7)
                    if (preset.id === "this-month") from.setMonth(now.getMonth() - 1)
                    if (preset.id === "last-30") from.setDate(now.getDate() - 30)
                    
                    setTempFilters(p => ({
                      ...p,
                      dateFrom: from.toISOString().split('T')[0],
                      dateTo: now.toISOString().split('T')[0]
                    }))
                  }}
                  className="px-3 py-1.5 rounded-lg border border-border bg-card text-[11px] font-bold text-muted-foreground hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assigned To & Device Mapping */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <User className="h-3.5 w-3.5" /> Staff
              </h3>
              <div className="space-y-2">
                {["John Smith", "Mike Chen", "Sarah Connor", "Admin"].map(name => {
                  const isSelected = tempFilters.staff.includes(name)
                  return (
                    <label key={name} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleArrayItem(name, tempFilters.staff, 'staff')}
                        className="h-4 w-4 rounded border-border bg-background text-[#4F46E5] focus:ring-[#4F46E5]/20"
                      />
                      <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground">{name}</span>
                    </label>
                  )
                })}
              </div>
            </div>
            <div>
              <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <Smartphone className="h-3.5 w-3.5" /> Device Types
              </h3>
              <div className="space-y-2">
                {["Phone", "Tablet", "Laptop", "Console"].map(dev => {
                  const isSelected = tempFilters.devices.includes(dev)
                  return (
                    <label key={dev} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleArrayItem(dev, tempFilters.devices, 'devices')}
                        className="h-4 w-4 rounded border-border bg-background text-[#4F46E5] focus:ring-[#4F46E5]/20"
                      />
                      <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground">{dev}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-8 bg-muted/30 border-t border-border flex gap-4">
          <button
            onClick={handleReset}
            className="px-6 h-14 rounded-2xl border border-border bg-card text-muted-foreground text-[15px] font-black hover:bg-muted transition-all focus:outline-none"
          >
            Reset All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 h-14 rounded-2xl bg-[#4F46E5] text-white text-[15px] font-black shadow-lg shadow-indigo-100 transition-all transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  )
}
