import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const hours = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
]

export type Appointment = {
  id: number
  dayIdx: number
  startHr: number
  duration: number
  initials: string
  name: string
  device: string
  color: string
  technicianId?: string
  serviceTypeId?: string
}

type ScheduleCalendarProps = {
  days: { name: string; date: string }[]
  appointments: Appointment[]
  onUpdateAppointment: (id: number, newDayIdx: number, newStartHr: number) => void
  onUpdateDuration: (id: number, newDuration: number) => void
}

export function ScheduleCalendar({ days, appointments, onUpdateAppointment, onUpdateDuration }: ScheduleCalendarProps) {
  const router = useRouter()
  
  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ id }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // Necessary to allow dropping
  }

  const handleDrop = (e: React.DragEvent, dayIdx: number) => {
    e.preventDefault()
    
    // Attempt to read data
    const dataStr = e.dataTransfer.getData("application/json")
    if (!dataStr) return
    const { id } = JSON.parse(dataStr)

    // Calculate vertical snap position
    // The relative container has 100px left padding, but the drop zones are flex-1 columns
    // Use currentTarget which is the day column
    const rect = e.currentTarget.getBoundingClientRect()
    // calculate Y offset relative to the day column
    const yOffset = e.clientY - rect.top
    
    // Each hour is 80px block
    // Snap to the nearest hour (e.g., 0-80 is 9AM, 80-160 is 10AM)
    let snappedStartHr = Math.floor(yOffset / 80) + 9

    // Constrain bounds between 9AM and 6PM based on duration
    const appInfo = appointments.find(a => a.id === id)
    const dur = appInfo ? appInfo.duration : 1
    const maxStart = 18 - dur
    
    if (snappedStartHr > maxStart) snappedStartHr = maxStart
    if (snappedStartHr < 9) snappedStartHr = 9

    onUpdateAppointment(id, dayIdx, snappedStartHr)
  }

  // --- Resize Duration Logic ---
  const [resizingState, setResizingState] = useState<{ id: number, startY: number, startDuration: number, startHr: number } | null>(null)
  const [tempDurations, setTempDurations] = useState<{ [id: number]: number }>({})

  const handleResizeStart = (e: React.MouseEvent, id: number, startDuration: number, startHr: number) => {
    e.stopPropagation() // prevent drag drop from firing
    setResizingState({ id, startY: e.clientY, startDuration, startHr })
    setTempDurations(prev => ({ ...prev, [id]: startDuration }))
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingState) return
      const deltaY = e.clientY - resizingState.startY
      // Continuous extension: 80px per hour
      const deltaHours = deltaY / 80
      let newDuration = resizingState.startDuration + deltaHours
      if (newDuration < 0.25) newDuration = 0.25 // minimum 15 mins block
      
      const maxDuration = 18 - resizingState.startHr // Cap at 6:00 PM
      if (newDuration > maxDuration) newDuration = maxDuration
      
      setTempDurations(prev => ({ ...prev, [resizingState.id]: newDuration }))
    }

    const handleMouseUp = () => {
      if (resizingState && tempDurations[resizingState.id]) {
        onUpdateDuration(resizingState.id, tempDurations[resizingState.id])
      }
      setResizingState(null)
      setTempDurations({})
    }

    if (resizingState) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [resizingState, tempDurations, onUpdateDuration])

  return (
    <div className="flex flex-col min-w-[900px] border border-border bg-card rounded-xl overflow-hidden shadow-sm">
      
      {/* Header Row */}
      <div className="flex border-b border-border bg-card">
        {/* Time Column Header */}
        <div className="w-[100px] shrink-0 border-r border-border" />
        {/* Days Header */}
        <div className="flex flex-1">
          {days.map((day, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col flex-1 items-center justify-center py-4 text-center ${idx !== days.length - 1 ? 'border-r border-border' : ''}`}
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase mb-0.5">{day.name}</span>
              <span className="text-lg font-bold text-foreground">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Body */}
      <div className="relative flex flex-col bg-card">
        {hours.map((time, rowIdx) => (
          <div key={time} className="flex h-[80px]">
            {/* Time Label */}
            <div className="flex w-[100px] shrink-0 items-start justify-end pr-4 pt-2 border-r border-b border-border">
              <span className="text-xs font-semibold text-muted-foreground">{time}</span>
            </div>
            {/* Grid Cells for this hour */}
            <div className="flex flex-1">
              {days.map((_, colIdx) => (
                <div 
                  key={colIdx} 
                  className={`flex-1 border-b ${colIdx !== days.length - 1 ? 'border-r' : ''} border-border`} 
                />
              ))}
            </div>
          </div>
        ))}

        {/* Absolutely Positioned Appointments */}
        <div className="absolute top-0 bottom-0 right-0 left-[100px] flex pointer-events-none">
           {days.map((_, colIdx) => {
             // Filter appointments for this column (day)
             const colAppointments = appointments.filter(a => a.dayIdx === colIdx)
             
             return (
               <div 
                 key={colIdx} 
                 className="flex-1 relative pointer-events-auto"
                 onDragOver={handleDragOver}
                 onDrop={(e) => handleDrop(e, colIdx)}
               >
                 {colAppointments.map(app => {
                   const topPx = (app.startHr - 9) * 80
                   const activeDuration = resizingState?.id === app.id ? tempDurations[app.id] : app.duration
                   const heightPx = activeDuration * 80
                   
                   return (
                     <div 
                       key={app.id}
                       draggable={resizingState === null} // disable drag when resizing
                       onDragStart={(e) => handleDragStart(e, app.id)}
                       className={`absolute left-[4px] right-[4px] p-2 rounded-md ${app.color} text-white shadow-sm pointer-events-auto hover:brightness-110 cursor-move transition-colors border border-white/20 flex flex-col`}
                       style={{ top: `${topPx + 4}px`, height: `${heightPx - 8}px` }}
                       onClick={() => router.push(`/admin/repairs/${app.id}?from=schedule`)}
                     >
                       <div className="flex items-start gap-2 h-full overflow-hidden pointer-events-none mb-2">
                         <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
                           {app.initials}
                         </div>
                         <div className="flex flex-col gap-0.5 pt-0.5 min-w-0">
                           <span className="text-[11px] font-bold leading-none truncate">{app.name}</span>
                           <span className="text-[10px] text-white/90 leading-none truncate">{app.device}</span>
                         </div>
                       </div>
                       
                       {/* Resize Handle */}
                       <div 
                         onMouseDown={(e) => handleResizeStart(e, app.id, app.duration, app.startHr)}
                         className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize flex items-end justify-center pb-[2px] opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-t from-black/20 to-transparent z-10"
                       >
                         <div className="w-6 h-[3px] rounded-full bg-white/50" />
                       </div>
                     </div>
                   )
                 })}
               </div>
             )
           })}
        </div>
      </div>
    </div>
  )
}
