"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import {
  Calendar, Clock, User, Bell, MapPin, 
  Wrench, ShieldCheck, CheckCircle2, Box, PenTool,
  Paperclip, Trash2, Plus, Image as ImageIcon, CheckCircle, ChevronRight, X, ChevronDown
} from "lucide-react"
import { useGetRepairByIdQuery, useUpdateRepairStatusMutation, useAddRepairNoteMutation } from "@/services/api/repairsApiSlice"
import { format } from "date-fns"

import { useGetStaffListQuery } from "@/services/api/staffApiSlice"

export default function TaskDetailsPageWrapper() {
  return <TaskDetailsPage />
}

function TaskDetailsPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams?.get('from')

  const { data: repairResponse, isLoading, isError } = useGetRepairByIdQuery(id)
  const { data: staffResponse } = useGetStaffListQuery(undefined, { skip: user?.role === 'TECHNICIAN' })
  const [updateStatus, { isLoading: isUpdating }] = useUpdateRepairStatusMutation()
  const [addNote, { isLoading: isAddingNote }] = useAddRepairNoteMutation()

  const [taskNote, setTaskNote] = useState("")
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isReassignDropdownOpen, setIsReassignDropdownOpen] = useState(false)

  const repair = repairResponse?.data
  const technicians = staffResponse?.staff || []

  const handleAddNote = async () => {
    if (!taskNote.trim()) return
    try {
      await addNote({ id, text: taskNote }).unwrap()
      setTaskNote("")
    } catch (err) {
      console.error("Failed to add note", err)
    }
  }

  const handleToggleComplete = async () => {
    if (!repair) return
    const newStatus = repair.status === "DELIVERED" ? "IN_PROGRESS" : "DELIVERED"
    try {
      await updateStatus({ id, status: newStatus }).unwrap()
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  const handleReassign = async (techId: string | null) => {
    try {
      await updateStatus({ id, technicianId: techId }).unwrap()
      setIsReassignDropdownOpen(false)
    } catch (err) {
      console.error("Failed to reassign technician", err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex bg-background h-screen overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 lg:ml-[200px] ml-0 flex flex-col items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">Loading task details...</p>
        </div>
      </div>
    )
  }

  if (isError || !repair) {
    return (
      <div className="flex bg-background h-screen overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 lg:ml-[200px] ml-0 flex flex-col items-center justify-center p-8">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-[#0F172A]">Task not found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6">The repair task you are looking for doesn't exist or was removed.</p>
          <button onClick={() => router.push("/admin/repairs")} className="h-10 px-6 rounded-xl bg-primary text-white font-bold">Go back to Repairs</button>
        </div>
      </div>
    )
  }

  const isCompleted = repair.status === "DELIVERED" || repair.status === "READY_TO_TAKE"

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />
      
      <div className="flex-1 lg:ml-[200px] ml-0 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="flex-1 flex flex-col pt-0 overflow-y-auto bg-[#F8FAFC]">
          <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col">

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[13px] text-muted-foreground font-medium mb-6">
              <Link href="/admin/dashboard" className="hover:text-foreground transition-colors cursor-pointer">Dashboard</Link>
              <span>/</span>
              {from === 'schedule' ? (
                <>
                  <Link href="/admin/schedule" className="hover:text-foreground transition-colors cursor-pointer">Schedule</Link>
                  <span>/</span>
                </>
              ) : (
                <>
                  <Link href="/admin/repairs" className="hover:text-foreground transition-colors cursor-pointer">Repairs</Link>
                  <span>/</span>
                </>
              )}
              <span className="text-[#0F172A] font-semibold">Task #{repair.reference}</span>
            </div>

            {/* Main Top Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#EEF2FF] text-[#4F46E5] text-[11px] font-bold tracking-wide">
                    Task #{repair.reference}
                  </span>
                </div>
                <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight leading-tight mb-3">
                  {repair.device?.brand} {repair.device?.model} — {repair.issue || "General Repair"}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-[13px] text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Created: {format(new Date(repair.createdAt), 'MMM dd, yyyy h:mm a')}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    Last Updated: {format(new Date(repair.updatedAt), 'MMM dd, yyyy h:mm a')}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    Assigned to: {repair.technician?.fullName || "Unassigned"}
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-3 shrink-0 relative">
                <button onClick={() => router.push("/admin/schedule")} className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[#4F46E5] text-[#4F46E5] bg-white text-[13px] font-bold hover:bg-[#EEF2FF] transition-colors focus:outline-none shadow-sm">
                  <Calendar className="h-4 w-4" /> Reschedule
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setIsReassignDropdownOpen(!isReassignDropdownOpen)}
                    className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[#10B981] text-[#10B981] bg-white text-[13px] font-bold hover:bg-[#D1FAE5] transition-colors focus:outline-none shadow-sm"
                  >
                    <User className="h-4 w-4" /> Reassign
                  </button>
                  {isReassignDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-border z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
                      <p className="text-[11px] font-bold text-muted-foreground px-3 py-2 uppercase tracking-wider">Select Technician</p>
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        <button 
                          onClick={() => handleReassign(null)}
                          className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium hover:bg-muted flex items-center gap-2 transition-colors italic opacity-70"
                        >
                          <div className="h-6 w-6 rounded-full border border-dashed border-muted-foreground flex items-center justify-center bg-muted/50" />
                          Unassigned
                        </button>
                        {technicians.map((tech: any) => (
                          <button 
                            key={tech.id}
                            onClick={() => handleReassign(tech.id)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted flex items-center gap-3 transition-colors"
                          >
                            <div className="h-8 w-8 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] text-[11px] font-black shrink-0 border border-[#4F46E5]/10">
                              {tech.name?.charAt(0) || 'T'}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[13px] font-bold text-[#0F172A] truncate">{tech.name}</span>
                              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{tech.role}</span>
                            </div>
                          </button>
                        ))}

                      </div>
                    </div>
                  )}
                </div>
                <button onClick={() => setIsCancelModalOpen(true)} className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[#EF4444] text-[#EF4444] bg-white text-[13px] font-bold hover:bg-[#FEE2E2] transition-colors focus:outline-none shadow-sm">
                  <Trash2 className="h-4 w-4" /> Cancel Task
                </button>
              </div>
            </div>

            {/* Active Status Banner */}
            {!isCompleted ? (
              <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 flex items-center justify-between mb-8 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-[#D97706]" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#92400E]">Repair is currently {repair.status.replace(/_/g, ' ').toLowerCase()}</h3>
                    <p className="text-[13px] text-[#B45309] font-medium">Estimated cost: <span className="font-bold">Rs. {repair.estimatedCost?.toLocaleString() || '0'}</span></p>
                  </div>
                </div>
                <button 
                  disabled={isUpdating}
                  onClick={handleToggleComplete} 
                  className={`h-9 px-5 rounded-lg bg-[#4F46E5] text-white text-[13px] font-bold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUpdating ? "Updating..." : "Mark Complete"}
                </button>
              </div>
            ) : (
              <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4 flex items-center justify-between mb-8 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-[#059669]" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#065F46]">Repair {repair.status.replace(/_/g, ' ').toLowerCase()}</h3>
                    <p className="text-[13px] text-[#065F46] font-medium">Final cost: <span className="font-bold">Rs. {repair.finalCost?.toLocaleString() || repair.estimatedCost?.toLocaleString() || '0'}</span></p>
                  </div>
                </div>
                <button 
                  disabled={isUpdating}
                  onClick={handleToggleComplete} 
                  className={`h-9 px-5 rounded-lg border border-[#10B981] text-[#10B981] bg-white text-[13px] font-bold hover:bg-[#D1FAE5] shadow-sm transition-colors focus:outline-none ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUpdating ? "Updating..." : "Reopen Task"}
                </button>
              </div>
            )}

            {/* Two Column Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

              {/* Left Column */}
              <div className="flex flex-col gap-6">

                {/* Timeline */}
                <section className="bg-white rounded-xl shadow-sm border border-border p-7">
                  <h2 className="text-[15px] font-bold text-[#0F172A] mb-8 flex items-center gap-2">
                    <Clock className="h-[18px] w-[18px] text-[#4F46E5]" /> Task Timeline
                  </h2>
                  <div className="relative pl-4 space-y-8 before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {repair.timeline?.length > 0 ? (
                      repair.timeline.map((event: any, idx: number) => (
                        <div key={event.id} className="relative flex items-start gap-5">
                          {idx !== repair.timeline.length - 1 && (
                            <div className="absolute left-[1px] h-full w-0.5 bg-[#CBD5E1] top-8" />
                          )}
                          <div className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 ${event.type === 'CREATED' ? 'border-[#10B981] bg-[#D1FAE5]' : 'border-[#4F46E5] bg-[#EEF2FF]'}`}>
                            {event.type === 'CREATED' ? (
                              <Plus className="h-4 w-4 text-[#10B981]" strokeWidth={3} />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-[#4F46E5]" />
                            )}
                          </div>
                          <div className="flex flex-col pt-0.5">
                            <span className="text-[14px] font-bold text-[#0F172A]">{event.description}</span>
                            <span className="text-[13px] text-muted-foreground mt-0.5">
                              {format(new Date(event.createdAt), 'MMM dd, yyyy h:mm a')}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground italic">No timeline events recorded yet.</div>
                    )}
                  </div>
                </section>

                {/* Notes */}
                <section className="bg-white rounded-xl shadow-sm border border-border p-7">
                  <h2 className="text-[15px] font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                    <PenTool className="h-[18px] w-[18px] text-[#4F46E5]" /> Technician Notes
                  </h2>
                  <div className="space-y-6 mb-8">
                    {repair.notes?.length > 0 ? (
                      repair.notes.map((note: any) => (
                        <div key={note.id} className="flex gap-4">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {note.user?.fullName?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="text-[14px] font-bold text-[#0F172A]">{note.user?.fullName || "System User"}</p>
                              <p className="text-[12px] text-muted-foreground">{format(new Date(note.createdAt), 'h:mm a')}</p>
                            </div>
                            <p className="text-[13.5px] text-[#334155] leading-relaxed">{note.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center">
                        <p className="text-sm text-muted-foreground italic">No technician notes yet.</p>
                      </div>
                    )}
                  </div>
                  <textarea 
                    rows={3}
                    placeholder="Add a note..."
                    value={taskNote}
                    onChange={(e) => setTaskNote(e.target.value)}
                    className="w-full p-4 text-[13px] border border-border rounded-xl focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] outline-none"
                  />
                  <div className="flex justify-end mt-3">
                    <button 
                      disabled={isAddingNote || !taskNote.trim()}
                      onClick={handleAddNote} 
                      className={`h-8 px-5 rounded-lg bg-[#4F46E5] text-[12px] font-bold text-white hover:bg-[#4338CA] transition-all ${isAddingNote || !taskNote.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isAddingNote ? "Adding..." : "Add Note"}
                    </button>
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                  <h3 className="text-[14px] font-bold text-[#0F172A] mb-5">Technician</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {repair.technician?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A]">{repair.technician?.fullName || "Unassigned"}</h4>
                      <p className="text-[11px] text-muted-foreground uppercase font-bold">{repair.technician?.role || "Staff"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                  <h3 className="text-[14px] font-bold text-[#0F172A] mb-5">Customer</h3>
                  <p className="font-bold text-[#4F46E5]">{repair.customer?.name}</p>
                  <p className="text-[13px] text-muted-foreground">{repair.customer?.phone}</p>
                  <p className="text-[13px] text-muted-foreground mt-1">{repair.customer?.email}</p>
                </div>

                {repair.repairPartsUsed?.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                    <h3 className="text-[14px] font-bold text-[#0F172A] mb-5">Parts Used</h3>
                    <div className="space-y-3">
                      {repair.repairPartsUsed.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-[#0F172A] truncate">{item.part?.partName}</p>
                            <p className="text-[11px] text-muted-foreground">Qty: {item.quantityUsed}</p>
                          </div>
                          <p className="text-[12px] font-bold text-[#0F172A] shrink-0">Rs. {item.totalPrice.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
          
          <div className="h-12" /> {/* Layout Spacer */}
          <DashboardFooter />
        </main>
      </div>

      {/* Modals outside the flow */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-2">Cancel Task?</h2>
            <p className="text-sm text-muted-foreground mb-6">Are you sure you want to cancel this repair? This action will record a cancellation event in the timeline.</p>
            <div className="flex gap-4">
              <button onClick={() => setIsCancelModalOpen(false)} className="flex-1 h-11 rounded-xl border border-border font-bold hover:bg-muted transition-colors">Go Back</button>
              <button 
                onClick={async () => {
                  try {
                    await updateStatus({ id, status: "NOT_STARTED" }).unwrap() // Simplified: set back to NOT_STARTED or delete
                    setIsCancelModalOpen(false)
                    router.push("/admin/repairs")
                  } catch (err) {
                    console.error("Failed to cancel repair", err)
                  }
                }} 
                className="flex-1 h-11 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailRow({ label, value, icon }: { label: string, value: React.ReactNode, icon: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[13px] font-medium">{label}</span>
      </div>
      <div className="text-[13px] font-bold text-[#0F172A] text-right ml-4">
        {value}
      </div>
    </div>
  )
}
