"use client"

import { useState } from "react"
import { Plus, X, Calendar, Clock } from "lucide-react"

// Mock Unassigned Tasks
const UNASSIGNED_TASKS = [
  { id: "task1", label: "#REP-2026-001235 - iPad Pro Battery (John Smith)" },
  { id: "task2", label: "#REP-2026-001236 - Samsung S22 Screen (Sarah Johnson)" },
  { id: "task3", label: "#REP-2026-001237 - iPhone 14 Pro Back Glass (Mike Davis)" }
]

const TECHNICIANS = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Mike Johnson" },
]

export function ScheduleAddModal({ onAddAppointment, currentWeekStart }: { onAddAppointment?: (data: any) => void, currentWeekStart?: Date }) {
  const [isOpen, setIsOpen] = useState(false)
  const [task, setTask] = useState("")
  const [technician, setTechnician] = useState("1")
  
  const defaultDateStr = currentWeekStart ? currentWeekStart.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
  const [date, setDate] = useState(defaultDateStr)
  const [time, setTime] = useState("10:00")
  const [duration, setDuration] = useState("1")

  const handleApply = () => {
    if (onAddAppointment) {
       onAddAppointment({ task, technician, date, time, duration })
    }
    setIsOpen(false)
    setTask("")
    setTechnician("1")
    setDate(defaultDateStr)
    setTime("10:00")
    setDuration("1")
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex h-9 items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#4338CA] shadow-sm focus:outline-none"
      >
        <Plus className="h-4 w-4 shrink-0" />
        Schedule Service
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] rounded-xl shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[#F8FAFC]">
              <h3 className="text-base font-bold text-foreground">Schedule New Service</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors outline-none focus:ring-2 focus:ring-[#4F46E5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-5">
              
              <div>
                <label className="block text-[13px] font-bold text-foreground mb-1.5">Unassigned Repair Task <span className="text-red-500">*</span></label>
                <select 
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5] font-medium"
                >
                  <option value="" disabled>Select a pending repair...</option>
                  {UNASSIGNED_TASKS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-foreground mb-1.5">Assign Technician <span className="text-red-500">*</span></label>
                <select 
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5] font-medium"
                >
                  <option value="" disabled>Select a technician...</option>
                  {TECHNICIANS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[13px] font-bold text-foreground mb-1.5">Date <span className="text-red-500">*</span></label>
                   <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                     <input 
                       type="date" 
                       value={date}
                       onChange={(e) => setDate(e.target.value)}
                       className="w-full h-10 rounded-lg border border-border bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5] font-medium appearance-none"
                     />
                   </div>
                </div>
                <div>
                   <label className="block text-[13px] font-bold text-foreground mb-1.5">Start Time <span className="text-red-500">*</span></label>
                   <div className="relative">
                     <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                     <input 
                       type="time" 
                       value={time}
                       onChange={(e) => setTime(e.target.value)}
                       className="w-full h-10 rounded-lg border border-border bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5] font-medium appearance-none"
                     />
                   </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-foreground mb-1.5">Duration <span className="text-red-500">*</span></label>
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5] font-medium"
                >
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours</option>
                  <option value="3">3 Hours</option>
                  <option value="4">4 Hours (Half Day)</option>
                  <option value="8">8 Hours (Full Day)</option>
                </select>
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/30 border-t border-border">
              <button 
                onClick={() => setIsOpen(false)} 
                className="h-9 px-4 rounded-lg bg-card border border-border text-[13px] font-semibold text-foreground hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-border"
              >
                Cancel
              </button>
              <button 
                onClick={handleApply} 
                className="h-9 px-6 rounded-lg bg-[#4F46E5] text-white text-[13px] font-semibold hover:bg-[#4338CA] transition-colors shadow-md outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
