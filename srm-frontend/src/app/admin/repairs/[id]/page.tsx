"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import {
  Calendar, Clock, User, Bell, MapPin, 
  Wrench, ShieldCheck, CheckCircle2, Box, PenTool,
  Paperclip, Trash2, Plus, Image as ImageIcon, CheckCircle, ChevronRight, X, ChevronDown
} from "lucide-react"

export default function TaskDetailsPageWrapper({ params }: { params: { id: string } }) {
  // We wrap the component in a Suspense-friendly way by just providing a shell if needed, but since it's a page component we just directly use it.
  return <TaskDetailsPage params={params} />
}

function TaskDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams?.get('from')

  const [taskNote, setTaskNote] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isChangeTechModalOpen, setIsChangeTechModalOpen] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState("Marcus Chen")
  
  const [notes, setNotes] = useState([
    { id: 1, author: "Marcus Chen", time: "2:35 PM", text: "Started disassembly. Screen is heavily cracked but digitizer still responsive. Will proceed with standard replacement procedure." },
    { id: 2, author: "Marcus Chen", time: "2:48 PM", text: "Found minor water damage indicator triggered near charging port. Customer not aware. Documenting with photos." },
    { id: 3, author: "Marcus Chen", time: "3:12 PM", text: "New screen installed. Running diagnostics and calibration now." }
  ])

  const [parts, setParts] = useState([
    { id: 1, name: "iPhone 14 Pro OLED Display Assembly", sku: "IP14P-LCD-01", qty: 1, cost: 45000 },
    { id: 2, name: "Adhesive Strip Set", sku: "ADH-IP14-02", qty: 1, cost: 500 },
    { id: 3, name: "Screen Protector (Tempered Glass)", sku: "SP-TG-IP14P", qty: 1, cost: 1200 }
  ])

  const partsTotal = parts.reduce((acc, p) => acc + (p.cost * p.qty), 0)

  const handleAddNote = () => {
    if (!taskNote.trim()) return
    const newH = new Date().getHours()
    const newM = new Date().getMinutes()
    const ampm = newH >= 12 ? 'PM' : 'AM'
    const formattedH = newH % 12 || 12
    const formattedM = newM < 10 ? '0' + newM : newM
    setNotes([...notes, {
      id: Date.now(),
      author: "Admin User",
      time: `${formattedH}:${formattedM} ${ampm}`,
      text: taskNote
    }])
    setTaskNote("")
  }

  const handleAddPart = () => {
    setParts([...parts, {
      id: Date.now(),
      name: "Replacement Battery (Demo)",
      sku: "IP14P-BAT-01",
      qty: 1,
      cost: 15000
    }])
  }

  const handleDeletePart = (id: number) => {
    setParts(parts.filter(p => p.id !== id))
  }

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />
      
      <div className="flex-1 ml-[200px] flex flex-col min-w-0">
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
              <span className="text-[#0F172A] font-semibold">Task #{params.id}</span>
            </div>

            {/* Main Top Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#EEF2FF] text-[#4F46E5] text-[11px] font-bold tracking-wide">
                    Task #SRM-2847
                  </span>
                </div>
                <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight leading-tight mb-3">
                  Apple iPhone 14 Pro — Screen Replacement
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-[13px] text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Scheduled: Mar 28, 2026 2:30 PM
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    Est. Duration: 90 min
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    Assigned to: Marcus Chen
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => router.push("/admin/schedule")} className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[#4F46E5] text-[#4F46E5] bg-white text-[13px] font-bold hover:bg-[#EEF2FF] transition-colors focus:outline-none shadow-sm">
                  <Calendar className="h-4 w-4" /> Reschedule
                </button>
                <button onClick={() => router.push("/admin/repairs")} className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[#10B981] text-[#10B981] bg-white text-[13px] font-bold hover:bg-[#D1FAE5] transition-colors focus:outline-none shadow-sm">
                  <User className="h-4 w-4" /> Reassign
                </button>
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
                    <h3 className="text-[14px] font-bold text-[#92400E]">Repair is currently in progress</h3>
                    <p className="text-[13px] text-[#B45309] font-medium">Elapsed time: <span className="font-bold">00:47:32</span></p>
                  </div>
                </div>
                <button onClick={() => setIsCompleted(true)} className="h-9 px-5 rounded-lg bg-[#4F46E5] text-white text-[13px] font-bold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none">
                  Mark Complete
                </button>
              </div>
            ) : (
              <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4 flex items-center justify-between mb-8 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-[#059669]" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#065F46]">Repair Completed successfully</h3>
                    <p className="text-[13px] text-[#065F46] font-medium">Finished in <span className="font-bold">47 minutes</span></p>
                  </div>
                </div>
                <button onClick={() => setIsCompleted(false)} className="h-9 px-5 rounded-lg border border-[#10B981] text-[#10B981] bg-white text-[13px] font-bold hover:bg-[#D1FAE5] shadow-sm transition-colors focus:outline-none">
                  Reopen Task
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
                    <div className="relative flex items-start gap-5">
                      <div className="absolute left-[1px] h-full w-0.5 bg-[#10B981] top-8" />
                      <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#10B981] bg-[#D1FAE5]">
                        <Plus className="h-4 w-4 text-[#10B981]" strokeWidth={3} />
                      </div>
                      <div className="flex flex-col pt-0.5">
                        <span className="text-[14px] font-bold text-[#0F172A]">Task Created</span>
                        <span className="text-[13px] text-muted-foreground mt-0.5">Mar 26, 2026 10:15 AM by Sarah Johnson</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Notes */}
                <section className="bg-white rounded-xl shadow-sm border border-border p-7">
                  <h2 className="text-[15px] font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                    <PenTool className="h-[18px] w-[18px] text-[#4F46E5]" /> Technician Notes
                  </h2>
                  <div className="space-y-6 mb-8">
                    {notes.map((note) => (
                      <div key={note.id} className="flex gap-4">
                        <img src={`https://i.pravatar.cc/150?u=${note.author}`} alt={note.author} className="h-10 w-10 shrink-0 rounded-full border border-border object-cover" />
                        <div>
                          <p className="text-[14px] font-bold text-[#0F172A]">{note.author}</p>
                          <p className="text-[13.5px] text-[#334155] leading-relaxed">{note.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <textarea 
                    rows={3}
                    placeholder="Add a note..."
                    value={taskNote}
                    onChange={(e) => setTaskNote(e.target.value)}
                    className="w-full p-4 text-[13px] border border-border rounded-xl focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] outline-none"
                  />
                  <div className="flex justify-end mt-3">
                    <button onClick={handleAddNote} className="h-8 px-5 rounded-lg bg-[#4F46E5] text-[12px] font-bold text-white hover:bg-[#4338CA]">Add Note</button>
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                  <h3 className="text-[14px] font-bold text-[#0F172A] mb-5">Technician</h3>
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=marcus" alt="Marcus" className="h-12 w-12 rounded-full border border-border" />
                    <div>
                      <h4 className="font-bold text-[#0F172A]">{selectedTechnician}</h4>
                      <p className="text-[11px] text-muted-foreground uppercase font-bold">Senior Technician</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                  <h3 className="text-[14px] font-bold text-[#0F172A] mb-5">Customer</h3>
                  <p className="font-bold text-[#4F46E5]">Sarah Williams</p>
                  <p className="text-[13px] text-muted-foreground">+94 71 987 6543</p>
                </div>
              </div>

            </div>
          </div>
          
          <div className="h-12" /> {/* Layout Spacer */}
        </main>
      </div>

      {/* Modals outside the flow */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Cancel Task?</h2>
            <div className="flex gap-4">
              <button onClick={() => setIsCancelModalOpen(false)} className="flex-1 h-11 rounded-xl border border-border">Back</button>
              <button onClick={() => router.push("/admin/repairs")} className="flex-1 h-11 rounded-xl bg-red-600 text-white">Yes, Cancel</button>
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
