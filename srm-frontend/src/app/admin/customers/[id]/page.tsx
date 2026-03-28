"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import {
  ChevronRight, ArrowLeft, Copy, Phone, PhoneCall, Mail, MessageSquare, Calendar,
  Wrench, DollarSign, Star, X, Check, MoreVertical, MapPin, 
  Trash2, CopyPlus, Plus, Search
} from "lucide-react"

export default function CustomerDetailedPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [internalNote, setInternalNote] = useState("")
  
  // Modal states
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [communicationModalType, setCommunicationModalType] = useState<'Phone' | 'Mail' | 'SMS' | null>(null)
  
  const customerEmail = "kamal@example.com"
  const customerPhone = "+94 77 123 4567"

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard: " + text)
  }
  
  const [notes, setNotes] = useState([
    { id: 1, author: "Admin User", avatar: "1", time: "Jan 10, 2026 at 2:30 PM", text: "Customer prefers email communication. Very satisfied with previous repairs." },
    { id: 2, author: "Technician John", avatar: "2", time: "Jan 5, 2026 at 10:15 AM", text: "Customer requested expedited service for business phone." }
  ])

  const handleAddNote = () => {
    if (!internalNote.trim()) return
    setNotes([{
      id: Date.now(),
      author: "Admin User",
      avatar: "1", // Mock current user avatar
      time: "Just now",
      text: internalNote
    }, ...notes])
    setInternalNote("")
  }

  return (
    <div className="flex bg-[#F8FAFC] text-foreground min-h-screen">
      <DashboardSidebar />

      <main className="flex-1 ml-[200px] flex flex-col items-center">
        {/* Maximum constraints for a beautiful responsive layout */}
        <div className="w-full max-w-[1200px] px-8 py-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-6">
            <Link href="/admin/dashboard" className="hover:text-foreground transition-colors cursor-pointer text-[#4F46E5]">Dashboard</Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <Link href="/admin/customers" className="hover:text-foreground transition-colors cursor-pointer text-[#4F46E5]">Customers</Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <span className="text-[#0F172A]">Kamal Perera</span>
          </div>

          <button onClick={() => router.push("/admin/customers")} className="flex items-center gap-2 text-[13px] font-bold text-muted-foreground hover:text-[#0F172A] transition-colors mb-6 focus:outline-none">
             <ArrowLeft className="h-4 w-4" /> All Customers
          </button>

          {/* Customer Header & Tabs */}
          <div className="flex flex-col border-b border-border mb-8">
             <div className="flex items-center gap-8 text-[14px] font-bold text-muted-foreground">
               <button 
                 onClick={() => setActiveTab("overview")} 
                 className={`pb-3 focus:outline-none transition-colors border-b-2 ${activeTab === 'overview' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent hover:text-[#0F172A]'}`}
               >
                 Overview
               </button>
               <button 
                 onClick={() => setActiveTab("repairs")} 
                 className={`pb-3 focus:outline-none transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'repairs' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent hover:text-[#0F172A]'}`}
               >
                 Repairs <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-black text-foreground">8</span>
               </button>
               <button 
                 onClick={() => setActiveTab("devices")} 
                 className={`pb-3 focus:outline-none transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'devices' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent hover:text-[#0F172A]'}`}
               >
                 Devices <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-black text-foreground">4</span>
               </button>
               <button 
                 onClick={() => setActiveTab("communications")} 
                 className={`pb-3 focus:outline-none transition-colors border-b-2 ${activeTab === 'communications' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent hover:text-[#0F172A]'}`}
               >
                 Communications
               </button>
             </div>
          </div>

          {/* Tab Content -> Overview layout */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
               
               {/* ===================== LEFT COLUMN ===================== */}
               <div className="flex flex-col gap-6">
                 
                 {/* 1. Contact Information */}
                 <section className="bg-white rounded-xl shadow-sm border border-border p-6 relative">
                    <h2 className="text-[14px] font-bold text-[#0F172A] mb-5">Contact Information</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between group">
                         <div className="flex items-center gap-3">
                           <Mail className="h-[18px] w-[18px] text-muted-foreground" />
                           <span className="text-[14px] font-medium text-[#0F172A]">{customerEmail}</span>
                         </div>
                         <button onClick={() => handleCopy(customerEmail)} className="flex items-center gap-1.5 text-[12px] font-bold text-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none">
                           <Copy className="h-3.5 w-3.5" /> Copy
                         </button>
                      </div>
                      
                      <div className="flex items-center justify-between group">
                         <div className="flex items-center gap-3">
                           <Phone className="h-[18px] w-[18px] text-muted-foreground" />
                           <span className="text-[14px] font-medium text-[#0F172A]">{customerPhone}</span>
                         </div>
                         <button onClick={() => handleCopy(customerPhone)} className="flex items-center gap-1.5 text-[12px] font-bold text-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none">
                           <Copy className="h-3.5 w-3.5" /> Copy
                         </button>
                      </div>

                      <div className="flex items-start justify-between group">
                         <div className="flex items-start gap-3">
                           <MapPin className="h-[18px] w-[18px] text-muted-foreground mt-0.5" />
                           <div className="flex flex-col">
                             <span className="text-[14px] font-medium text-[#0F172A]">123 Main Street, Colombo 07</span>
                             <button className="flex items-center gap-1 text-[12px] font-bold text-[#4F46E5] mt-1 self-start hover:underline focus:outline-none">
                               <MapPin className="h-3 w-3" /> View on map
                             </button>
                           </div>
                         </div>
                      </div>
                    </div>
                 </section>

                 {/* 2. Top Stats */}
                 <div className="grid grid-cols-3 gap-4">
                    {/* Stat 1 */}
                    <div className="bg-white rounded-xl shadow-sm border border-border p-5 flex flex-col">
                      <div className="h-10 w-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center mb-3">
                        <Wrench className="h-5 w-5 text-[#4F46E5]" />
                      </div>
                      <span className="text-[24px] font-black text-[#0F172A] leading-none mb-1">8</span>
                      <span className="text-[11px] font-bold text-muted-foreground mb-3">Total Repairs</span>
                      <span className="inline-flex text-[10px] font-bold text-[#10B981] mt-auto">↑ +2 this month</span>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-white rounded-xl shadow-sm border border-border p-5 flex flex-col">
                      <div className="h-10 w-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center mb-3">
                        <DollarSign className="h-5 w-5 text-[#10B981]" />
                      </div>
                      <span className="text-[24px] font-black text-[#0F172A] leading-none mb-1">Rs. 45,200</span>
                      <span className="text-[11px] font-bold text-muted-foreground mb-3">Total Spent</span>
                      <span className="inline-flex text-[10px] font-bold text-[#10B981] mt-auto">↑ +Rs. 8,500 this month</span>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-white rounded-xl shadow-sm border border-border p-5 flex flex-col">
                      <div className="h-10 w-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center mb-3">
                        <Star className="h-5 w-5 text-[#F59E0B] fill-[#F59E0B]" />
                      </div>
                      <span className="text-[24px] font-black text-[#0F172A] leading-none mb-1">4.8 / 5</span>
                      <span className="text-[11px] font-bold text-muted-foreground mb-3">Average Rating</span>
                      <div className="flex items-center gap-0.5 text-[#F59E0B] mt-auto">
                        <Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current opacity-40" />
                      </div>
                    </div>
                 </div>

                 {/* 3. Recent Activity */}
                 <section className="bg-white rounded-xl shadow-sm border border-border p-6">
                    <h2 className="text-[14px] font-bold text-[#0F172A] mb-6">Recent Activity</h2>
                    
                    <div className="relative pl-3 space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-border before:via-border before:to-transparent">
                      
                      {/* Activity Item */}
                      <div className="relative flex items-start gap-4">
                        <div className="relative z-10 flex h-4 w-4 shrink-0 mt-0.5 items-center justify-center rounded-full bg-[#10B981] ring-4 ring-white" />
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-[#0F172A]">Repair completed</span>
                            <span className="text-[11px] text-muted-foreground font-medium">Jan 15, 2026</span>
                          </div>
                          <p className="text-[12px] text-muted-foreground mt-0.5">iPhone 14 Pro screen replacement completed successfully</p>
                        </div>
                      </div>

                      {/* Activity Item */}
                      <div className="relative flex items-start gap-4">
                        <div className="relative z-10 flex h-4 w-4 shrink-0 mt-0.5 items-center justify-center rounded-full bg-[#3B82F6] ring-4 ring-white" />
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-[#0F172A]">Payment received</span>
                            <span className="text-[11px] text-muted-foreground font-medium">Jan 15, 2026</span>
                          </div>
                          <p className="text-[12px] text-muted-foreground mt-0.5">Payment of Rs. 8,500 received for repair #REP-2026-001234</p>
                        </div>
                      </div>

                      {/* Activity Item */}
                      <div className="relative flex items-start gap-4">
                        <div className="relative z-10 flex h-3.5 w-3.5 shrink-0 mt-[3px] ml-[1px] items-center justify-center rounded-full bg-[#8B5CF6] ring-4 ring-white" />
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-[#0F172A]">Repair started</span>
                            <span className="text-[11px] text-muted-foreground font-medium">Jan 14, 2026</span>
                          </div>
                          <p className="text-[12px] text-muted-foreground mt-0.5">Technician assigned and repair work initiated</p>
                        </div>
                      </div>

                      {/* Activity Item */}
                      <div className="relative flex items-start gap-4">
                        <div className="relative z-10 flex h-3.5 w-3.5 shrink-0 mt-[3px] ml-[1px] items-center justify-center rounded-full bg-muted-foreground ring-4 ring-white" />
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-[#0F172A]">Device received</span>
                            <span className="text-[11px] text-muted-foreground font-medium">Jan 13, 2026</span>
                          </div>
                          <p className="text-[12px] text-muted-foreground mt-0.5">iPhone 14 Pro received for screen replacement</p>
                        </div>
                      </div>

                      {/* Activity Item */}
                      <div className="relative flex items-start gap-4 pb-2">
                        <div className="relative z-10 flex h-3.5 w-3.5 shrink-0 mt-[3px] ml-[1px] items-center justify-center rounded-full border-[2px] border-muted-foreground bg-white" />
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-muted-foreground">Repair created</span>
                            <span className="text-[11px] text-muted-foreground font-medium">Jan 13, 2026</span>
                          </div>
                          <p className="text-[12px] text-muted-foreground mt-0.5">New repair ticket #REP-2026-001234 created</p>
                        </div>
                      </div>

                    </div>
                 </section>

                 {/* 4. Internal Notes */}
                 <section className="bg-white rounded-xl shadow-sm border border-border p-6 mb-6">
                    <h2 className="text-[14px] font-bold text-[#0F172A] mb-4">Internal Notes</h2>
                    
                    <div className="border border-border rounded-xl bg-white overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-[#4F46E5] transition-all mb-6">
                      <textarea 
                        rows={3}
                        placeholder="Add a note about this customer..."
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        className="w-full p-4 text-[13px] border-none focus:ring-0 resize-none outline-none placeholder:text-muted-foreground"
                      />
                      <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border-t border-border">
                        <div />
                        <button onClick={handleAddNote} className="h-8 px-5 rounded-lg bg-[#4F46E5] text-[12px] font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors focus:outline-none flex items-center gap-1.5">
                          <Plus className="h-3.5 w-3.5" /> Add Note
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {notes.map((note) => (
                        <div key={note.id} className="flex gap-4">
                          <img src={`https://i.pravatar.cc/150?img=${note.avatar}`} alt={note.author} className="h-8 w-8 shrink-0 rounded-full border border-border object-cover" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[12px] font-bold text-[#0F172A]">{note.author}</span>
                              <span className="text-[11px] text-muted-foreground">{note.time}</span>
                            </div>
                            <p className="text-[13px] text-[#334155] leading-relaxed">{note.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                 </section>

               </div>

               {/* ===================== RIGHT COLUMN ===================== */}
               <div className="flex flex-col gap-6">

                 {/* 1. Quick Actions */}
                 <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                    <h3 className="text-[14px] font-bold text-[#0F172A] mb-5">Quick Actions</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setCommunicationModalType('Phone')} className="flex flex-col items-center justify-center gap-2 h-[72px] rounded-lg border border-border bg-white text-muted-foreground hover:bg-muted hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all focus:outline-none shadow-sm group">
                        <PhoneCall className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-[#0F172A]">Call</span>
                      </button>
                      <button onClick={() => setCommunicationModalType('Mail')} className="flex flex-col items-center justify-center gap-2 h-[72px] rounded-lg border border-border bg-white text-muted-foreground hover:bg-muted hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all focus:outline-none shadow-sm group">
                        <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-[#0F172A]">Email</span>
                      </button>
                      <button onClick={() => setCommunicationModalType('SMS')} className="flex flex-col items-center justify-center gap-2 h-[72px] rounded-lg border border-border bg-white text-muted-foreground hover:bg-muted hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all focus:outline-none shadow-sm group">
                        <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-[#0F172A]">SMS</span>
                      </button>
                      <button onClick={() => alert("Scheduled!")} className="flex flex-col items-center justify-center gap-2 h-[72px] rounded-lg border border-border bg-white text-muted-foreground hover:bg-muted hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all focus:outline-none shadow-sm group">
                        <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-[#0F172A]">Schedule</span>
                      </button>
                    </div>
                 </div>

                 {/* 2. Tags */}
                 <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                    <h3 className="text-[14px] font-bold text-[#0F172A] mb-4">Tags</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF7ED] text-[#EA580C] text-[11px] font-bold border border-[#FFEDD5]">
                         <Star className="h-3.5 w-3.5 fill-current" /> VIP <X className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500 cursor-pointer ml-1" />
                       </span>
                       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] text-[#475569] text-[11px] font-bold border border-border">
                         Regular <X className="h-3.5 w-3.5 text-muted-foreground hover:text-[#0F172A] cursor-pointer ml-1" />
                       </span>
                       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF5FF] text-[#9333EA] text-[11px] font-bold border border-[#F3E8FF]">
                         Corporate <X className="h-3.5 w-3.5 text-muted-foreground hover:text-[#0F172A] cursor-pointer ml-1" />
                       </span>
                    </div>

                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Add tag..."
                        className="w-full h-9 pl-3 pr-3 text-[12px] rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-[#4F46E5] shadow-sm"
                      />
                    </div>
                 </div>

                 {/* 3. Loyalty Program */}
                 <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                    <h3 className="text-[14px] font-bold text-[#0F172A] mb-5">Loyalty Program</h3>
                    
                    <div className="flex justify-between items-end mb-4">
                       <span className="text-[32px] font-black text-[#4F46E5] leading-none mb-[-4px]">450</span>
                       <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">points</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-[12px] font-bold text-[#0F172A] mb-3">
                       <span className="text-muted-foreground font-medium">Tier</span>
                       <span className="inline-flex items-center gap-1 text-[#D97706]"><Star className="h-3.5 w-3.5 fill-[#D97706]" /> Gold</span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] font-bold text-[#0F172A] mb-1.5">
                       <span className="text-muted-foreground">Next reward</span>
                       <span className="text-[#0F172A]">50 points away</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-[#4F46E5] rounded-full" style={{ width: '90%' }} />
                    </div>
                 </div>

                 {/* 4. Preferences */}
                 <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                    <h3 className="text-[14px] font-bold text-[#0F172A] mb-5">Preferences</h3>
                    
                    <div className="space-y-4 text-[12px] font-medium text-[#0F172A]">
                      <div className="flex justify-between items-center border-b border-border/50 pb-3">
                         <span className="text-muted-foreground">Preferred Contact</span>
                         <span className="font-bold">Email</span>
                      </div>
                      
                      <div className="pb-1">
                         <span className="block text-muted-foreground mb-3">Notifications</span>
                         <div className="space-y-3">
                           <label className="flex items-center justify-between cursor-pointer group">
                             <span>Email</span>
                             <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border text-[#4F46E5] focus:ring-[#4F46E5]" />
                           </label>
                           <label className="flex items-center justify-between cursor-pointer group">
                             <span>SMS</span>
                             <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border text-[#4F46E5] focus:ring-[#4F46E5]" />
                           </label>
                           <label className="flex items-center justify-between cursor-pointer group">
                             <span>Push</span>
                             <input type="checkbox" className="h-4 w-4 rounded border-border text-[#4F46E5] focus:ring-[#4F46E5]" />
                           </label>
                         </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-border/50 pt-3">
                         <span className="text-muted-foreground">Language</span>
                         <span className="font-bold">English</span>
                      </div>
                    </div>
                 </div>

                 {/* 5. Danger Zone */}
                 <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 flex flex-col gap-3">
                    <h3 className="text-[14px] font-bold text-red-600 mb-2">Danger Zone</h3>
                    
                    <button onClick={() => setIsMergeModalOpen(true)} className="flex justify-center items-center gap-2 h-9 rounded-lg border border-border bg-white text-[12px] font-bold text-[#0F172A] hover:bg-muted transition-colors focus:outline-none shadow-sm">
                       <CopyPlus className="h-3.5 w-3.5" /> Merge with Another Customer
                    </button>
                    <button onClick={() => setIsDeleteModalOpen(true)} className="flex justify-center items-center gap-2 h-9 rounded-lg border border-red-200 bg-red-50 text-[12px] font-bold text-red-600 hover:bg-red-100 transition-colors focus:outline-none shadow-sm">
                       <Trash2 className="h-3.5 w-3.5" /> Delete Customer
                    </button>
                 </div>

               </div>
            </div>
          )}
          
          {/* Tab Placeholders */}
          {activeTab !== "overview" && (
            <div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-border">
              <p className="text-muted-foreground font-medium italic"><span className="capitalize">{activeTab}</span> tab content comes here...</p>
            </div>
          )}

        </div>
      </main>

      {/* ===================== MODALS ===================== */}

      {/* 1. Delete Customer Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
           <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-red-100">
              <div className="flex flex-col items-center justify-center p-8 pb-6 text-center">
                 <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-5">
                    <Trash2 className="h-8 w-8" />
                 </div>
                 <h2 className="text-[20px] font-black text-[#0F172A] mb-2 tracking-tight">Delete Customer Account?</h2>
                 <p className="text-[14px] text-muted-foreground leading-relaxed">
                   Are you sure you want to completely erase the record for <span className="font-bold text-[#0F172A]">Kamal Perera</span>? This action is permanent and will orphan 8 historical repair records.
                 </p>
              </div>
              <div className="px-8 pb-8 flex flex-col gap-4">
                 <div>
                   <label className="block text-[12px] font-bold text-red-600 mb-2">Type "DELETE" below to confirm</label>
                   <input type="text" placeholder="DELETE" className="w-full h-11 rounded-lg border border-red-200 bg-red-50/50 px-4 text-[14px] font-black tracking-widest text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-center uppercase" />
                 </div>
                 <div className="flex w-full gap-3 mt-2">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted transition-colors focus:outline-none">
                      Go Back
                    </button>
                    <button 
                      onClick={() => {
                        setIsDeleteModalOpen(false)
                        alert("Customer Deleted Successfully!")
                        router.push("/admin/customers")
                      }} 
                      className="flex-1 h-11 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-md transition-colors focus:outline-none"
                    >
                      Delete Forever
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 2. Merge Customer Modal */}
      {isMergeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
           <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
                <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2">
                  <CopyPlus className="h-5 w-5 text-[#4F46E5]" /> Merge Customer Profiles
                </h2>
                <button onClick={() => setIsMergeModalOpen(false)} className="h-8 w-8 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#0F172A] transition-colors focus:outline-none shadow-sm">
                   <ChevronRight className="h-4 w-4 rotate-45" /> {/* Use rotate-45 hack + chevron for X equivalent */}
                   <span className="sr-only">Close</span>
                </button>
              </div>
              
              <div className="p-6">
                 <p className="text-[13px] text-muted-foreground mb-6">
                   Select the destination profile. All repair histories, devices, and communications from <span className="font-bold text-[#0F172A]">Kamal Perera</span> will be migrated over.
                 </p>
              
                 <div className="mb-8">
                   <label className="block text-[12px] font-bold text-[#0F172A] mb-2">Search target customer</label>
                   <div className="relative">
                     <input type="text" placeholder="Search by name, email, or phone..." className="w-full h-11 pl-4 pr-10 rounded-xl border border-border bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                     <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   </div>
                   
                   <div className="mt-3 p-4 border border-border rounded-xl bg-[#F8FAFC]">
                      <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Target Overview</span>
                      <p className="text-[13px] text-muted-foreground">Select a customer above to preview destination profile.</p>
                   </div>
                 </div>

                 <div className="flex w-full gap-3">
                    <button onClick={() => setIsMergeModalOpen(false)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted transition-colors focus:outline-none">
                      Cancel
                    </button>
                    <button onClick={() => alert("Merge Request Initialized")} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none">
                      Initiate Merge
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 3. Communication Modal */}
      {communicationModalType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
           <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-6 border-b border-border bg-[#F8FAFC]">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#EEF2FF] text-[#4F46E5]">
                       {communicationModalType === 'Phone' ? <PhoneCall className="h-5 w-5" /> : communicationModalType === 'Mail' ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                    </div>
                    <div>
                      <h2 className="text-[16px] font-black text-[#0F172A] leading-tight">
                        {communicationModalType === 'Phone' ? "Initiate Call" : communicationModalType === 'Mail' ? "Send Email" : "Send SMS"}
                      </h2>
                      <p className="text-[12px] font-bold text-[#4F46E5]">To: Kamal Perera</p>
                    </div>
                 </div>
                 <button onClick={() => setCommunicationModalType(null)} className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#0F172A] transition-colors focus:outline-none">
                   <ChevronRight className="h-5 w-5 rotate-45" />
                 </button>
              </div>

              <div className="p-6">
                <div className="bg-[#F8FAFC] border border-border rounded-xl p-4 mb-5">
                   {communicationModalType === 'Phone' || communicationModalType === 'SMS' ? (
                     <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-muted-foreground">Main Line</span>
                        <span className="text-[14px] font-black text-[#0F172A] font-mono">{customerPhone}</span>
                     </div>
                   ) : (
                     <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-muted-foreground">Primary Address</span>
                        <span className="text-[14px] font-black text-[#0F172A]">{customerEmail}</span>
                     </div>
                   )}
                </div>

                {communicationModalType !== 'Phone' && (
                  <div className="mb-6">
                    <label className="block text-[12px] font-bold text-[#0F172A] mb-2">Message Payload</label>
                    <textarea 
                      rows={5} 
                      placeholder={`Draft your ${communicationModalType} message here...`}
                      className="w-full p-4 rounded-xl border border-border text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] resize-none"
                    />
                  </div>
                )}

                <div className="flex w-full gap-3">
                   <button onClick={() => setCommunicationModalType(null)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted transition-colors focus:outline-none">
                     Abort
                   </button>
                   <button 
                     onClick={() => {
                       setCommunicationModalType(null)
                       alert(`${communicationModalType} Dispatch logged dynamically!`)
                     }} 
                     className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none"
                   >
                     {communicationModalType === 'Phone' ? "Connect Dial" : "Transmit Data"}
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}

    </div>
  )
}
