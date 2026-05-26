"use client"

import { useState } from "react"
import { Plus, X, Calendar, Clock } from "lucide-react"
import { useGetStaffListQuery } from "@/services/api/staffApiSlice"
import { useGetRepairsQuery } from "@/services/api/repairsApiSlice"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"

// Data will be fetched via hooks

export function ScheduleAddModal({ onAddAppointment, currentWeekStart }: { onAddAppointment?: (data: any) => void, currentWeekStart?: Date }) {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const [isOpen, setIsOpen] = useState(false)
  const [task, setTask] = useState("")
  const [technician, setTechnician] = useState("")

  const { data: staffData } = useGetStaffListQuery()
  const { data: repairsData } = useGetRepairsQuery({})

  const unassignedRepairs = (repairsData?.data || []).filter((r: any) => r.status === 'NOT_STARTED')
  
  const defaultDateStr = currentWeekStart ? currentWeekStart.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
  const [date, setDate] = useState(defaultDateStr)
  const [time, setTime] = useState("10:00")
  const [duration, setDuration] = useState("1")

  const handleApply = () => {
    if (!task || !technician) {
      alert("Please select both a task and a technician.");
      return;
    }
    if (onAddAppointment) {
       onAddAppointment({ task, technician, date, time, duration })
    }
    setIsOpen(false)
    setTask("")
    setTechnician("")
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
        {mounted ? t('schedule.scheduleService') : 'Schedule Service'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] rounded-xl shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[#F8FAFC]">
              <h3 className="text-base font-bold text-foreground">{mounted ? t('schedule.scheduleNewService') : 'Schedule New Service'}</h3>
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
                <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('schedule.unassignedRepair') : 'Unassigned Repair Task'} <span className="text-red-500">*</span></label>
                <select 
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5] font-medium"
                >
                  <option value="" disabled>{mounted ? t('schedule.selectPendingRepair') : 'Select a pending repair...'}</option>
                  {unassignedRepairs.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.reference} - {t.device?.brand} {t.device?.model} ({t.customer?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('schedule.assignTech') : 'Assign Technician'} <span className="text-red-500">*</span></label>
                <select 
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5] font-medium"
                >
                  <option value="" disabled>{mounted ? t('schedule.selectTech') : 'Select a technician...'}</option>
                  {(staffData?.staff || []).map((t: any) => (
                    <option key={t.id} value={t.id}>{t.fullName || t.email}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('schedule.date') : 'Date'} <span className="text-red-500">*</span></label>
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
                   <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('schedule.startTime') : 'Start Time'} <span className="text-red-500">*</span></label>
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
                <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('schedule.duration') : 'Duration'} <span className="text-red-500">*</span></label>
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5] font-medium"
                >
                  <option value="1">{mounted ? t('schedule.hours.1') : '1 Hour'}</option>
                  <option value="2">{mounted ? t('schedule.hours.2') : '2 Hours'}</option>
                  <option value="3">{mounted ? t('schedule.hours.3') : '3 Hours'}</option>
                  <option value="4">{mounted ? t('schedule.hours.4') : '4 Hours (Half Day)'}</option>
                  <option value="8">{mounted ? t('schedule.hours.8') : '8 Hours (Full Day)'}</option>
                </select>
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/30 border-t border-border">
              <button 
                onClick={() => setIsOpen(false)} 
                className="h-9 px-4 rounded-lg bg-card border border-border text-[13px] font-semibold text-foreground hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-border"
              >
                {mounted ? t('common.cancel') : 'Cancel'}
              </button>
              <button 
                onClick={handleApply} 
                className="h-9 px-6 rounded-lg bg-[#4F46E5] text-white text-[13px] font-semibold hover:bg-[#4338CA] transition-colors shadow-md outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2"
              >
                {mounted ? t('schedule.apply') : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
