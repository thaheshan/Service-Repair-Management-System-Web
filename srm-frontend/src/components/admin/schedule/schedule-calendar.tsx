import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const hours = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
]

export type Appointment = {
  id: string | number
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
  onUpdateAppointment: (id: string | number, newDayIdx: number, newStartHr: number) => void
  onUpdateDuration: (id: string | number, newDuration: number) => void
}

export function ScheduleCalendar({ days, appointments, onUpdateAppointment, onUpdateDuration }: ScheduleCalendarProps) {
  const router = useRouter()
  
  const handleDragStart = (e: React.DragEvent, id: string | number) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ id }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // Necessary to allow dropping
  }

  const handleDrop = (e: React.DragEvent, dayIdx: number) => {
    e.preventDefault()
    const dataStr = e.dataTransfer.getData("application/json")
    if (!dataStr) return
    const { id } = JSON.parse(dataStr)

    const rect = e.currentTarget.getBoundingClientRect()
    const yOffset = e.clientY - rect.top
    
    // Snap to 15-minute intervals (20px per 15 mins)
    let snappedStartHr = Math.floor(yOffset / 20) * 0.25 + 9

    const appInfo = appointments.find(a => a.id === id)
    const dur = appInfo ? appInfo.duration : 1
    const maxStart = 18 - dur
    
    if (snappedStartHr > maxStart) snappedStartHr = maxStart
    if (snappedStartHr < 9) snappedStartHr = 9

    onUpdateAppointment(id, dayIdx, snappedStartHr)
    setDraggingInfo(null)
  }

  // --- Resize Duration Logic ---
  const [resizingState, setResizingState] = useState<{ id: string | number, startY: number, startDuration: number, startHr: number } | null>(null)
  const [tempDurations, setTempDurations] = useState<{ [id: string]: number }>({})
  const [draggingInfo, setDraggingInfo] = useState<{ id: string | number, currentY: number, dayIdx: number } | null>(null)

  const handleDrag = (e: React.DragEvent, id: string | number, dayIdx: number) => {
    if (e.clientY === 0) return // avoid final (0,0) event
    setDraggingInfo({ id, currentY: e.clientY, dayIdx })
  }

  const handleResizeStart = (e: React.MouseEvent, id: string | number, startDuration: number, startHr: number) => {
    e.stopPropagation()
    setResizingState({ id, startY: e.clientY, startDuration, startHr })
    setTempDurations(prev => ({ ...prev, [id]: startDuration }))
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingState) return
      const deltaY = e.clientY - resizingState.startY
      // Snap resize to 15-minute intervals
      const deltaHours = Math.round((deltaY / 80) * 4) / 4
      let newDuration = resizingState.startDuration + deltaHours
      
      if (newDuration < 0.25) newDuration = 0.25
      
      const maxDuration = 18 - resizingState.startHr
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
                   const isResizing = resizingState?.id === app.id
                   const activeDuration = isResizing ? tempDurations[app.id] : app.duration
                   const heightPx = activeDuration * 80
                   
                   const formatTime = (hr: number) => {
                     const h = Math.floor(hr);
                     const m = Math.round((hr - h) * 60);
                     const ampm = h >= 12 ? 'PM' : 'AM';
                     const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
                     return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
                   }

                   return (
                     <div 
                       key={app.id}
                       draggable={resizingState === null}
                       onDragStart={(e) => handleDragStart(e, app.id)} onDrag={(e) => handleDrag(e, app.id, colIdx)} onDragEnd={() => setDraggingInfo(null)}
                       className={`absolute left-[4px] right-[4px] p-2 rounded-md ${app.color} text-white shadow-md pointer-events-auto hover:brightness-110 cursor-move transition-all border border-white/20 flex flex-col group/card ${draggingInfo?.id === app.id ? 'opacity-40 grayscale-[0.5]' : ''}`}
                       style={{ top: `${topPx + 4}px`, height: `${heightPx - 8}px`, zIndex: isResizing || draggingInfo?.id === app.id ? 50 : 10 }}
                       onClick={() => router.push(`/admin/repairs/${app.id}?from=schedule`)}
                     >
                       <div className="flex items-start gap-2 h-full overflow-hidden pointer-events-none mb-1 relative">
                         <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
                           {app.initials}
                         </div>
                         <div className="flex flex-col gap-0.5 pt-0.5 min-w-0">
                           <span className="text-[11px] font-bold leading-none truncate">{app.name}</span>
                           <span className="text-[10px] text-white/90 leading-none truncate">{app.device}</span>
                         </div>
                         
                         {isResizing && (
                           <div className="absolute top-0 right-0 bg-black/40 backdrop-blur-sm px-1 py-0.5 rounded text-[8px] font-black tracking-tighter">
                             {Math.floor(activeDuration)}h {Math.round((activeDuration % 1) * 60)}m
                           </div>
                         )}
                       </div>

                       <div className="mt-auto text-[9px] font-black text-white/60 tracking-tight flex justify-between items-center pointer-events-none">
                          <span>{formatTime(app.startHr)}</span>
                          <span>{formatTime(app.startHr + activeDuration)}</span>
                       </div>
                       
                       <div 
                         onMouseDown={(e) => handleResizeStart(e, app.id, app.duration, app.startHr)}
                         className="absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize flex items-end justify-center pb-[1px] opacity-0 group-hover/card:opacity-100 transition-opacity bg-gradient-to-t from-black/20 to-transparent z-20"
                       >
                         <div className="w-8 h-[3px] rounded-full bg-white/50" />
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
