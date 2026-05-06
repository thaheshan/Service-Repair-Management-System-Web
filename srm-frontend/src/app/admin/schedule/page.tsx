"use client"

import { useState, useEffect, useMemo } from "react"
import "@/app/globals.css"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { ScheduleHeader } from "@/components/admin/schedule/schedule-header"
import { ScheduleCalendar } from "@/components/admin/schedule/schedule-calendar"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import { ScheduleFilters } from "@/components/admin/schedule/schedule-filter-popover"

import { 
  useGetAppointmentsQuery, 
  useCreateAppointmentMutation, 
  useUpdateAppointmentMutation, 
  useDeleteAppointmentMutation 
} from "@/services/api/scheduleApiSlice"
import { useGetStaffListQuery } from "@/services/api/staffApiSlice"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

export type Appointment = {
  id: string | number
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
  const { data: apiResponse, isLoading } = useGetAppointmentsQuery({});
  const [createAppointment] = useCreateAppointmentMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();
  const { data: staffResponse } = useGetStaffListQuery({});
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [filters, setFilters] = useState<ScheduleFilters>({
    statuses: ["bg-[#4F46E5]", "bg-[#10B981]", "bg-[#F59E0B]"],
    technicianId: "all",
    serviceTypeId: "all"
  })
  
  // Date State
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    return new Date(d.setDate(diff));
  });

  const appointments = useMemo(() => {
    if (!apiResponse?.data) return [];
    
    return apiResponse.data.map((a: any) => {
      const date = new Date(a.scheduledAt);
      const weekStart = new Date(currentWeekStart);
      weekStart.setHours(0,0,0,0);
      
      const diffTime = date.getTime() - weekStart.getTime();
      const dayIdx = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const startHr = date.getHours();
      
      return {
        id: a.id,
        dayIdx,
        startHr,
        duration: (a.duration || 60) / 60,
        initials: a.technicianName.split(" ").map((n: string) => n[0]).join("").toUpperCase(),
        name: a.technicianName,
        device: a.customerName + (a.repairReference ? ` - ${a.repairReference}` : ""),
        color: a.status === 'COMPLETED' ? "bg-[#10B981]" : a.status === 'IN_PROGRESS' ? "bg-[#F59E0B]" : "bg-[#4F46E5]",
        technicianId: a.technicianId || "unassigned",
        serviceTypeId: "1"
      };
    }).filter((a: any) => a.dayIdx >= 0 && a.dayIdx < 7);
  }, [apiResponse, currentWeekStart]);

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

  const handleUpdateAppointment = async (id: any, newDayIdx: number, newStartHr: number) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + newDayIdx);
    date.setHours(newStartHr, 0, 0, 0);
    
    try {
      await updateAppointment({ id, scheduledAt: date.toISOString() }).unwrap();
    } catch (err) {
      console.error('Failed to update appointment', err);
    }
  }

  const handleUpdateDuration = async (id: any, newDuration: number) => {
    try {
      await updateAppointment({ id, duration: newDuration * 60 }).unwrap();
    } catch (err) {
      console.error('Failed to update duration', err);
    }
  }

  const handleApplyFilters = (newFilters: ScheduleFilters) => {
    setFilters(newFilters)
  }

  const handleAddAppointment = async (params: any) => {
    const scheduledAt = new Date(params.date);
    const [hours] = params.time.split(':');
    scheduledAt.setHours(parseInt(hours) || 9, 0, 0, 0);

    try {
      await createAppointment({
        tenantId: user?.tenantId,
        shopId: user?.shopId,
        repairId: params.task, // This comes from the unassigned repairs select
        technicianId: params.technician === "all" ? undefined : params.technician,
        scheduledAt: scheduledAt.toISOString(),
        duration: (parseInt(params.duration) || 1) * 60,
      }).unwrap();
    } catch (err) {
      console.error('Failed to create appointment', err);
    }
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
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 bg-background">
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
          <div className="min-w-[900px] p-4 lg:p-6 mb-12">
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
