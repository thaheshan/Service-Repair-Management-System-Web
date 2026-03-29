"use client"

import { useState, useEffect } from "react"
import "@/app/globals.css"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { ScheduleHeader } from "@/components/admin/schedule/schedule-header"
import { ScheduleCalendar } from "@/components/admin/schedule/schedule-calendar"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import { ScheduleFilters } from "@/components/admin/schedule/schedule-filter-popover"

export type Appointment = {
  id: number
  dayIdx: number
  startHr: number
  duration: number
  initials: string
  name: string
  device: string
  color: string
  technicianId: string
  serviceTypeId: string
}

// Generators for dummy data
const TECHNICIANS = [
  { id: "1", initials: "JD", name: "John Doe" },
  { id: "2", initials: "JS", name: "Jane Smith" },
  { id: "3", initials: "MJ", name: "Mike Johnson" },
]

const SERVICES = [
  { id: "1", name: "Screen Replacement" },
  { id: "2", name: "Battery Replacement" },
  { id: "3", name: "Diagnostic" },
]

const STATUSES = [
  { color: "bg-[#4F46E5]" }, // Scheduled
  { color: "bg-[#F59E0B]" }, // In Progress
  { color: "bg-[#10B981]" }  // Completed
]

const DEVICES = ["iPhone 12", "iPhone 13", "iPad Pro", "Samsung S21", "Pixel 6", "MacBook Air", "Surface Pro", "Galaxy Note", "OnePlus 9"]

const generateDemoAppointments = (weekStartDate: Date): Appointment[] => {
  // Use the time value as a seed so it's somewhat deterministic but changes per week
  const seed = weekStartDate.getTime()
  
  const tempAppointments: Appointment[] = []
  
  // Let's generate 10-20 random appointments for the week
  const numAppointments = 10 + (seed % 11)
  
  for (let i = 0; i < numAppointments; i++) {
    const dayIdx = (seed + i * 13) % 6 // Monday to Saturday (0 to 5)
    let startHr = 9 + ((seed + i * 17) % 8) // 9 AM to 4 PM
    let duration = 1 + ((seed + i * 19) % 2) // 1 or 2 hours
    if (startHr + duration > 18) { duration = 1; startHr = 17 }

    const tech = TECHNICIANS[(seed + i * 23) % TECHNICIANS.length]
    const service = SERVICES[(seed + i * 29) % SERVICES.length]
    const status = STATUSES[(seed + i * 31) % STATUSES.length]
    const device = DEVICES[(seed + i * 37) % DEVICES.length]
    
    tempAppointments.push({
      id: i + 1,
      dayIdx,
      startHr,
      duration,
      initials: tech.initials,
      name: tech.name,
      device: `${device} - ${service.name.split(" ")[0]}`,
      color: status.color,
      technicianId: tech.id,
      serviceTypeId: service.id
    })
  }

  return tempAppointments
}

export default function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  
  const [filters, setFilters] = useState<ScheduleFilters>({
    statuses: ["bg-[#4F46E5]", "bg-[#10B981]", "bg-[#F59E0B]"],
    technicianId: "all",
    serviceTypeId: "all"
  })
  
  // Date State (Starts on Monday Jan 12, 2026 for the Jan 13 mockup week)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date("2026-01-12T00:00:00"))

  // Whenever the week changes, generate logic for new appointments
  useEffect(() => {
    setAppointments(generateDemoAppointments(currentWeekStart))
  }, [currentWeekStart])

  // Generate dynamic 7-day array
  const currentDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentWeekStart)
    d.setDate(d.getDate() + i)
    return {
      name: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      date: d.getDate().toString()
    }
  })

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => {
      const next = new Date(prev)
      next.setDate(next.getDate() + 7)
      return next
    })
  }

  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => {
      const next = new Date(prev)
      next.setDate(next.getDate() - 7)
      return next
    })
  }

  const handleUpdateAppointment = (id: number, newDayIdx: number, newStartHr: number) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, dayIdx: newDayIdx, startHr: newStartHr } : app
    ))
  }

  const handleUpdateDuration = (id: number, newDuration: number) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, duration: newDuration } : app
    ))
  }

  const handleApplyFilters = (newFilters: ScheduleFilters) => {
    setFilters(newFilters)
  }

  const handleAddAppointment = (params: any) => {
    const appDate = new Date(params.date)
    appDate.setHours(0,0,0,0)
    const weekStart = new Date(currentWeekStart)
    weekStart.setHours(0,0,0,0)
    const diffDays = Math.round((appDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24))
    
    const tech = TECHNICIANS.find(t => t.id === params.technician) || TECHNICIANS[0]
    
    // Fallback device name
    let deviceName = "Walk-in Repair"
    if (params.task === "task1") deviceName = "iPad Pro - Battery"
    else if (params.task === "task2") deviceName = "Samsung S22 - Screen"
    else if (params.task === "task3") deviceName = "iPhone 14 Pro - Back Glass"

    const newApp: Appointment = {
      id: Math.max(0, ...appointments.map(a => a.id)) + 1,
      dayIdx: (diffDays >= 0 && diffDays < 7) ? diffDays : 0, 
      startHr: parseInt(params.time.split(":")[0]) || 9,
      duration: parseInt(params.duration) || 1,
      initials: tech.initials,
      name: tech.name,
      device: deviceName,
      color: "bg-[#10B981]", 
      technicianId: tech.id,
      serviceTypeId: "1"
    }
    setAppointments(prev => [...prev, newApp])
  }

  // Filter appointments based on active filter state
  const filteredAppointments = appointments.filter(app => {
    const statusMatch = filters.statuses.includes(app.color)
    const techMatch = filters.technicianId === "all" || filters.technicianId === app.technicianId
    const serviceMatch = filters.serviceTypeId === "all" || filters.serviceTypeId === app.serviceTypeId
    
    return statusMatch && techMatch && serviceMatch
  })

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col ml-[200px] bg-background">
        <DashboardHeader />
        
        {/* Top Header & Navigation */}
        <ScheduleHeader 
          onApplyFilters={handleApplyFilters} 
          currentWeekStart={currentWeekStart}
          onNextWeek={handleNextWeek}
          onPrevWeek={handlePrevWeek}
          onSetWeekStart={setCurrentWeekStart}
          onAddAppointment={handleAddAppointment}
        />

        {/* Calendar Grid Area */}
        <main className="flex-1 overflow-x-auto overflow-y-auto w-full">
          <div className="min-w-[900px] p-6 mb-12">
            <ScheduleCalendar 
              days={currentDays}
              appointments={filteredAppointments} 
              onUpdateAppointment={handleUpdateAppointment} 
              onUpdateDuration={handleUpdateDuration}
            />
          </div>
          <DashboardFooter />
        </main>
      </div>
    </div>
  )
}
