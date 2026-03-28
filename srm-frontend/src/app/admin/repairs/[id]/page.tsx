"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
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
    <div className="flex bg-[#F8FAFC] text-foreground min-h-screen">
      <DashboardSidebar />

      <main className="flex-1 ml-[200px] flex flex-col items-center">
        {/* Maximum constraints for a beautiful centered layout */}
        <div className="w-full max-w-[1200px] px-8 py-8">

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
                    <p className="text-[13px] text-[#047857] font-medium">Finished in <span className="font-bold">47 minutes</span></p>
                  </div>
               </div>
               <button onClick={() => setIsCompleted(false)} className="h-9 px-5 rounded-lg border border-[#10B981] text-[#10B981] bg-white text-[13px] font-bold hover:bg-[#D1FAE5] shadow-sm transition-colors focus:outline-none">
                 Reopen Task
               </button>
            </div>
          )}

          {/* Two Column Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

             {/* ===================== LEFT COLUMN ===================== */}
             <div className="flex flex-col gap-6">

                {/* 1. Task Timeline */}
                <section className="bg-white rounded-xl shadow-sm border border-border p-7">
                   <h2 className="text-[15px] font-bold text-[#0F172A] mb-8 flex items-center gap-2">
                     <Clock className="h-[18px] w-[18px] text-[#4F46E5]" /> Task Timeline
                   </h2>
                   
                   <div className="relative pl-4 space-y-8 before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                      
                      {/* Created */}
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

                      {/* Assigned */}
                      <div className="relative flex items-start gap-5">
                         <div className="absolute left-[1px] h-full w-0.5 bg-[#10B981] top-8" />
                         <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#10B981] bg-[#D1FAE5]">
                            <User className="h-3.5 w-3.5 text-[#10B981]" strokeWidth={3} />
                         </div>
                         <div className="flex flex-col pt-0.5">
                            <span className="text-[14px] font-bold text-[#0F172A]">Assigned to Technician</span>
                            <span className="text-[13px] text-muted-foreground mt-0.5">Mar 26, 2026 10:18 AM — Marcus Chen</span>
                         </div>
                      </div>

                      {/* Scheduled */}
                      <div className="relative flex items-start gap-5">
                         <div className="absolute left-[1px] h-full w-0.5 bg-[#10B981] top-8" />
                         <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#10B981] bg-[#D1FAE5]">
                            <Calendar className="h-3.5 w-3.5 text-[#10B981]" strokeWidth={3} />
                         </div>
                         <div className="flex flex-col pt-0.5">
                            <span className="text-[14px] font-bold text-[#0F172A]">Scheduled</span>
                            <span className="text-[13px] text-muted-foreground mt-0.5">Mar 28, 2026 at 2:30 PM</span>
                         </div>
                      </div>

                      {/* Work Started */}
                      <div className="relative flex items-start gap-5">
                         <div className="absolute left-[1px] h-full w-0.5 bg-border top-8" />
                         <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#F59E0B] bg-[#FEF3C7] ring-4 ring-yellow-50">
                            <Wrench className="h-3.5 w-3.5 text-[#F59E0B]" strokeWidth={2.5} />
                         </div>
                         <div className="flex flex-col pt-0.5">
                            <span className="text-[14px] font-bold text-[#0F172A]">Work Started</span>
                            <span className="text-[13px] text-muted-foreground mt-0.5">Mar 28, 2026 2:32 PM — actual start time</span>
                            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold tracking-wide text-[#B45309] bg-[#FEF3C7] rounded-md self-start border border-[#FDE68A]">
                               <Clock className="h-3 w-3" /> 47 minutes elapsed
                            </div>
                         </div>
                      </div>

                      {/* Parts Sourced */}
                      <div className="relative flex items-start gap-5">
                         <div className="absolute left-[1px] h-full w-0.5 bg-border top-8" />
                         <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#8B5CF6] bg-[#EDE9FE]">
                            <Box className="h-3.5 w-3.5 text-[#8B5CF6]" strokeWidth={2.5} />
                         </div>
                         <div className="flex flex-col pt-0.5">
                            <span className="text-[14px] font-bold text-[#0F172A]">Parts Sourced</span>
                            <span className="text-[13px] text-muted-foreground mt-0.5">3 part(s) used</span>
                         </div>
                      </div>

                      {/* Quality Check */}
                      <div className="relative flex items-start gap-5">
                         <div className={`absolute left-[1px] h-full w-0.5 ${isCompleted ? 'bg-[#10B981]' : 'bg-border'} top-8`} />
                         <div className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 ${isCompleted ? 'border-[#10B981] bg-[#D1FAE5]' : 'border-muted-foreground/30 bg-[#F1F5F9]'}`}>
                            <ShieldCheck className={`h-3.5 w-3.5 ${isCompleted ? 'text-[#10B981]' : 'text-muted-foreground'}`} strokeWidth={2.5} />
                         </div>
                         <div className="flex flex-col pt-0.5">
                            <span className={`text-[14px] font-bold ${isCompleted ? 'text-[#0F172A]' : 'text-muted-foreground'}`}>Quality Check</span>
                            <span className={`text-[13px] ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/70'} mt-0.5`}>{isCompleted ? 'Passed 15-point inspection' : 'Pending verification'}</span>
                         </div>
                      </div>

                      {/* Completed */}
                      <div className="relative flex items-start gap-5">
                         <div className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 ${isCompleted ? 'border-[#10B981] bg-[#D1FAE5]' : 'border-muted-foreground/30 bg-[#F1F5F9]'}`}>
                            <CheckCircle2 className={`h-3.5 w-3.5 ${isCompleted ? 'text-[#10B981]' : 'text-muted-foreground'}`} strokeWidth={2.5} />
                         </div>
                         <div className="flex flex-col pt-0.5">
                            <span className={`text-[14px] font-bold ${isCompleted ? 'text-[#0F172A]' : 'text-muted-foreground'}`}>Task Completed</span>
                            <span className={`text-[13px] ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/70'} mt-0.5`}>{isCompleted ? 'Task finished and logged' : 'Not yet completed'}</span>
                         </div>
                      </div>

                   </div>
                </section>

                {/* 2. Technician Notes */}
                <section className="bg-white rounded-xl shadow-sm border border-border p-7">
                   <h2 className="text-[15px] font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                     <PenTool className="h-[18px] w-[18px] text-[#4F46E5]" /> Technician Notes
                   </h2>

                   <div className="space-y-6 mb-8">
                     {notes.map((note) => (
                       <div key={note.id} className="flex gap-4">
                         <img src="https://i.pravatar.cc/150?u=marcus" alt="Marcus" className="h-10 w-10 shrink-0 rounded-full border border-border object-cover" />
                         <div>
                           <div className="flex items-center gap-2 mb-1.5">
                             <span className="text-[14px] font-bold text-[#0F172A]">{note.author}</span>
                             <span className="px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold uppercase tracking-wider">{note.author === "Admin User" ? "Admin" : "Technician"}</span>
                             <span className="text-[12px] text-muted-foreground ml-1">{note.time}</span>
                           </div>
                           <p className="text-[13.5px] text-[#334155] leading-relaxed">{note.text}</p>
                         </div>
                       </div>
                     ))}
                   </div>

                   {/* Add Note Input Area */}
                   <div className="border border-border rounded-xl bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[#4F46E5]/20 focus-within:border-[#4F46E5] transition-all">
                     <textarea 
                       rows={3}
                       placeholder="Add a note about this task..."
                       value={taskNote}
                       onChange={(e) => setTaskNote(e.target.value)}
                       className="w-full p-4 text-[13px] border-none focus:ring-0 resize-none outline-none placeholder:text-muted-foreground"
                     />
                     <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border-t border-border">
                       <button className="flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-[#0F172A] transition-colors focus:outline-none">
                         <Paperclip className="h-4 w-4" /> Attach
                       </button>
                       <button onClick={handleAddNote} className="h-8 px-5 rounded-lg bg-[#4F46E5] text-[12px] font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors focus:outline-none">
                         Add Note
                       </button>
                     </div>
                   </div>
                </section>

                {/* 3. Parts & Materials Used */}
                <section className="bg-white rounded-xl shadow-sm border border-border p-7">
                   <h2 className="text-[15px] font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                     <Box className="h-[18px] w-[18px] text-[#4F46E5]" /> Parts & Materials Used
                   </h2>

                   <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                       <thead>
                         <tr className="border-b border-border">
                           <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Part Name</th>
                           <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">SKU</th>
                           <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center">Qty</th>
                           <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-right">Unit Cost</th>
                           <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-right">Total</th>
                           <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center w-8"></th>
                         </tr>
                       </thead>
                       <tbody className="text-[13px] text-[#334155] font-medium">
                         {parts.map(part => (
                           <tr key={part.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                             <td className="py-4 font-semibold text-[#0F172A]">{part.name}</td>
                             <td className="py-4">{part.sku}</td>
                             <td className="py-4 text-center">{part.qty}</td>
                             <td className="py-4 text-right">LKR {part.cost.toLocaleString()}</td>
                             <td className="py-4 text-right font-bold text-[#0F172A]">LKR {(part.cost * part.qty).toLocaleString()}</td>
                             <td className="py-4 text-center">
                               <button onClick={() => handleDeletePart(part.id)} className="text-muted-foreground hover:text-red-500 rounded p-1 focus:outline-none">
                                 <Trash2 className="h-4 w-4" />
                               </button>
                             </td>
                           </tr>
                         ))}
                         <tr className="bg-[#F8FAFC]">
                           <td colSpan={4} className="py-4 text-right text-[13px] font-bold text-[#0F172A]">Parts Subtotal</td>
                           <td className="py-4 text-right text-[14px] font-black text-[#0F172A]">LKR {partsTotal.toLocaleString()}</td>
                           <td></td>
                         </tr>
                       </tbody>
                     </table>
                     
                     <div className="mt-4">
                       <button onClick={handleAddPart} className="flex items-center gap-1.5 text-[13px] font-bold text-[#4F46E5] hover:underline focus:outline-none">
                         <Plus className="h-4 w-4" /> Add Part
                       </button>
                     </div>
                   </div>
                </section>

             </div>

             {/* ===================== RIGHT COLUMN ===================== */}
             <div className="flex flex-col gap-6">

                {/* 1. Task Details Tile */}
                <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                   <h3 className="text-[14px] font-bold text-[#0F172A] mb-5 flex items-center gap-2">
                     <AlertCircleIcon className="h-4 w-4 text-muted-foreground" /> Task Details
                   </h3>

                   <div className="space-y-4">
                     <DetailRow label="Repair Type" value="Screen Replacement" icon={<Wrench className="h-3.5 w-3.5" />} />
                     <DetailRow 
                       label="Priority" 
                       value={<span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FFF7ED] text-[#EA580C]">High</span>} 
                       icon={<AlertTriangleIcon className="h-3.5 w-3.5" />} 
                     />
                     <DetailRow label="Scheduled Date" value="Mar 28, 2026" icon={<Calendar className="h-3.5 w-3.5" />} />
                     <DetailRow label="Scheduled Time" value="2:30 PM" icon={<Clock className="h-3.5 w-3.5" />} />
                     <DetailRow label="Estimated Duration" value="90 min" icon={<Clock className="h-3.5 w-3.5" />} />
                     <div className="h-px bg-border my-2" />
                     <DetailRow label="Actual Start" value="2:32 PM" icon={<PlayCircleIcon className="h-3.5 w-3.5" />} />
                     <DetailRow label="Actual End" value="---" icon={<StopCircleIcon className="h-3.5 w-3.5" />} />
                     <div className="h-px bg-border my-2" />
                     <DetailRow label="Bay / Workstation" value="Bay 3" icon={<MapPin className="h-3.5 w-3.5" />} />
                   </div>
                </div>

                {/* 2. Assigned Technician */}
                <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                   <h3 className="text-[14px] font-bold text-[#0F172A] mb-5 flex items-center gap-2">
                     <User className="h-4 w-4 text-muted-foreground" /> Assigned Technician
                   </h3>

                   <div className="flex items-center gap-3 mb-5">
                      <img src="https://i.pravatar.cc/150?u=marcus" alt="Marcus" className="h-[52px] w-[52px] rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-border" />
                      <div>
                       <h4 className="text-[15px] font-bold text-[#0F172A] leading-tight mb-1">{selectedTechnician}</h4>
                       <span className="inline-flex px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold">Senior Technician</span>
                      </div>
                   </div>

                   <div className="space-y-2 mb-5">
                     <div className="flex items-center gap-2 text-[13px] text-muted-foreground font-medium">
                       <PhoneIcon className="h-3.5 w-3.5 shrink-0" />
                       +94 77 123 4567
                     </div>
                     <div className="flex items-center gap-2 text-[13px] text-muted-foreground font-medium truncate">
                       <MailIcon className="h-3.5 w-3.5 shrink-0" />
                       marcus.chen@repair.lk
                     </div>
                   </div>

                   <div className="grid grid-cols-4 gap-2 mb-5">
                     <StatBox label="Avg Rating" value={<span className="text-[#F59E0B] flex items-center justify-center gap-0.5">4.9 <StarIcon className="h-2.5 w-2.5 fill-current" /></span>} />
                     <StatBox label="Jobs Done" value={<span className="text-[#3B82F6]">347</span>} />
                     <StatBox label="On-Time %" value={<span className="text-[#10B981]">96%</span>} />
                     <StatBox label="Active Jobs" value={<span className="text-[#EF4444]">4</span>} />
                   </div>

                   <button onClick={() => setIsChangeTechModalOpen(true)} className="flex items-center justify-start gap-1.5 text-[13px] font-bold text-[#4F46E5] hover:underline focus:outline-none w-full">
                     <RefreshCwIcon className="h-3.5 w-3.5" /> Change Technician
                   </button>
                </div>

                {/* 3. Customer */}
                <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                   <h3 className="text-[14px] font-bold text-[#0F172A] mb-5 flex items-center gap-2">
                     <UserIcon className="h-4 w-4 text-muted-foreground" /> Customer
                   </h3>

                   <div className="flex items-center gap-3 mb-5">
                      <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah Williams" className="h-10 w-10 rounded-full object-cover border border-border" />
                      <h4 className="text-[15px] font-bold text-[#0F172A]">Sarah Williams</h4>
                   </div>

                   <div className="space-y-2 mb-4">
                     <div className="flex items-center gap-2 text-[13px] text-muted-foreground font-medium">
                       <PhoneIcon className="h-3.5 w-3.5 shrink-0" /> +94 71 987 6543
                     </div>
                     <div className="flex items-center gap-2 text-[13px] text-muted-foreground font-medium truncate">
                       <MailIcon className="h-3.5 w-3.5 shrink-0" /> sarah.w@email.com
                     </div>
                   </div>
                   
                   <p className="text-[12px] text-muted-foreground font-medium mb-5">Repairs with us: <span className="font-bold text-[#0F172A]">7</span></p>

                   <button onClick={() => alert("Notification sent to Customer!")} className="flex items-center justify-center gap-2 w-full h-9 rounded-lg border border-[#4F46E5] text-[#4F46E5] text-[13px] font-bold hover:bg-[#EEF2FF] transition-colors focus:outline-none shadow-sm">
                     <Bell className="h-4 w-4" /> Notify Customer
                   </button>
                </div>

                {/* 4. Device */}
                <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                   <h3 className="text-[14px] font-bold text-[#0F172A] mb-5 flex items-center gap-2">
                     <SmartphoneIcon className="h-4 w-4 text-muted-foreground" /> Device
                   </h3>

                   <div className="space-y-3 mb-5 text-[13px]">
                     <div>
                       <span className="block text-[11px] text-muted-foreground mb-0.5">Brand</span>
                       <span className="font-bold text-[#0F172A]">Apple</span>
                     </div>
                     <div>
                       <span className="block text-[11px] text-muted-foreground mb-0.5">Model</span>
                       <span className="font-bold text-[#0F172A]">iPhone 14 Pro</span>
                     </div>
                     <div>
                       <span className="block text-[11px] text-muted-foreground mb-0.5">IMEI / Serial</span>
                       <span className="font-bold text-[#0F172A] font-mono">356728104532981</span>
                     </div>
                     <div>
                       <span className="block text-[11px] text-muted-foreground mb-0.5">Color</span>
                       <span className="font-bold text-[#0F172A]">Deep Purple</span>
                     </div>
                     <div>
                       <span className="block text-[11px] text-muted-foreground mb-1">Condition In</span>
                       <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-[#FFF7ED] text-[#EA580C]">Fair</span>
                     </div>
                     <div>
                       <span className="block text-[11px] text-muted-foreground mb-0.5">Passcode</span>
                       <span className="font-bold text-[#0F172A] flex items-center gap-1 font-mono tracking-widest text-lg leading-none mt-1">******</span>
                     </div>
                   </div>

                   {/* Image Thumbnails Mock */}
                   <div className="grid grid-cols-4 gap-2">
                     <div className="aspect-square bg-muted rounded-md relative overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1663365990262-6789e933fe4c?auto=format&fit=crop&q=80&w=200" className="object-cover w-full h-full" alt="front" />
                     </div>
                     <div className="aspect-square bg-muted rounded-md relative overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1662998336306-03f9012cdbf6?auto=format&fit=crop&q=80&w=200" className="object-cover w-full h-full" alt="back" />
                     </div>
                     <div className="aspect-square bg-muted rounded-md relative overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1681329241584-eed3a948ec78?auto=format&fit=crop&q=80&w=200" className="object-cover w-full h-full" alt="edge" />
                     </div>
                     <div className="aspect-square bg-muted rounded-md relative overflow-hidden group">
                        <img src="https://plus.unsplash.com/premium_photo-1678385002012-706f2e21de62?auto=format&fit=crop&q=80&w=200" className="object-cover w-full h-full" alt="damage" />
                     </div>
                   </div>
                </div>

                {/* 5. Time Tracking */}
                <div className="bg-white rounded-xl shadow-sm border border-border p-6 flex flex-col items-center">
                   <h3 className="text-[14px] font-bold text-[#0F172A] mb-4 flex items-center gap-2 self-start w-full">
                     <Clock className="h-4 w-4 text-muted-foreground" /> Time Tracking
                   </h3>

                   <div className="flex flex-col items-center mb-6">
                     <span className="text-[36px] font-black text-[#F59E0B] tracking-tight leading-none mb-1">00:47:32</span>
                     <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Elapsed Time</span>
                   </div>

                   <div className="w-full space-y-3 mb-6">
                     <div className="flex justify-between items-center text-[13px]">
                       <span className="text-muted-foreground font-medium">Scheduled</span>
                       <span className="font-bold text-[#0F172A]">90 min</span>
                     </div>
                     <div className="flex justify-between items-center text-[13px]">
                       <span className="text-muted-foreground font-medium">Actual (so far)</span>
                       <span className="font-bold text-[#0F172A]">47 min</span>
                     </div>
                     <div className="flex justify-between items-center text-[13px]">
                       <span className="text-muted-foreground font-medium">Variance</span>
                       <span className="font-bold text-[#10B981]">-43 min</span>
                     </div>
                   </div>

                   <button onClick={() => alert("Manual Time Logger Sheet")} className="flex items-center justify-center gap-1.5 text-[13px] font-bold text-[#0F172A] hover:bg-muted py-2 w-full rounded-lg transition-colors focus:outline-none">
                     <Plus className="h-[14px] w-[14px]" /> Log Manual Time
                   </button>
                </div>

             </div>

          </div>
        </div>
      </main>

      {/* Cancel Task Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsCancelModalOpen(false)}
              className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground/20 transition-colors focus:outline-none"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="flex flex-col items-center text-center mt-2">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                 <AlertTriangleIcon className="h-7 w-7 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-3">Cancel Repair Task?</h2>
              <p className="text-sm text-muted-foreground mb-8">
                Are you sure you want to cancel <span className="font-bold text-foreground">Task #{params.id}</span>? <br/>This will notify the assigned technician and remove it from the active schedule.
              </p>
              <div className="flex w-full gap-4">
                <button 
                  onClick={() => setIsCancelModalOpen(false)}
                  className="flex-1 h-11 rounded-xl border border-muted-foreground/30 text-foreground font-semibold hover:bg-muted transition-colors focus:outline-none"
                >
                  Go Back
                </button>
                <button 
                  onClick={() => {
                    alert("Task has been cancelled!");
                    router.push("/admin/repairs");
                  }}
                  className="flex-1 h-11 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-md shadow-red-500/20 transition-colors focus:outline-none"
                >
                  Yes, Cancel It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Technician Modal */}
      {isChangeTechModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200">
           <div className="bg-white w-[400px] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-5 border-b border-border">
                <h2 className="text-[16px] font-bold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-[#4F46E5]" /> Change Technician
                </h2>
                <button onClick={() => setIsChangeTechModalOpen(false)} className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors focus:outline-none">
                   <X className="h-4 w-4" />
                </button>
              </div>
              <div className="px-6 py-6 pb-8">
                 <label className="block text-[13px] font-bold text-foreground mb-2">Select new technician</label>
                 <div className="relative mb-6">
                   <select 
                      defaultValue={selectedTechnician}
                      onChange={(e) => setSelectedTechnician(e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-[#F8FAFC] px-4 text-[14px] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] appearance-none"
                   >
                     <option value="Marcus Chen">Marcus Chen - Senior Tech</option>
                     <option value="John Smith">John Smith - Repair Specialist</option>
                     <option value="Sarah Johnson">Sarah Johnson - Lead Technician</option>
                     <option value="Tom Wilson">Tom Wilson - Trainee Tech</option>
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                 </div>
                 <div className="flex w-full gap-3">
                    <button onClick={() => setIsChangeTechModalOpen(false)} className="flex-1 h-10 rounded-lg border border-border text-foreground font-semibold text-[13px] hover:bg-muted transition-colors focus:outline-none">Cancel</button>
                    <button onClick={() => setIsChangeTechModalOpen(false)} className="flex-1 h-10 rounded-lg bg-[#4F46E5] text-white font-semibold text-[13px] hover:bg-[#4338CA] transition-colors focus:outline-none">Apply Change</button>
                 </div>
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

function StatBox({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 border border-border rounded-lg bg-[#F8FAFC] py-2">
      <span className="text-[10px] text-muted-foreground font-semibold leading-none text-center px-1">{label}</span>
      <span className="text-[14px] font-black leading-none">{value}</span>
    </div>
  )
}

// Micro icons for Right column
const AlertCircleIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const AlertTriangleIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const PlayCircleIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
const StopCircleIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6"/></svg>
const PhoneIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const MailIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
const StarIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const RefreshCwIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
const UserIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const SmartphoneIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
