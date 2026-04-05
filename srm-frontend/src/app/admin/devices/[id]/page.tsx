"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import {
  ChevronLeft,
  Smartphone,
  Plus,
  Edit2,
  MoreVertical,
  User,
  ShieldCheck,
  TrendingUp,
  Camera,
  MessageSquare,
  Clock,
  CheckCircle2,
  FileText,
  DollarSign,
  Calendar,
  Layers,
  Hash,
  Palette,
  HardDrive,
  ExternalLink,
  History,
  Info,
} from "lucide-react"

export default function DeviceDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const [noteText, setNoteText] = useState("")

  // Mock data for the specific device
  const deviceData = {
    id: id,
    name: "Apple iPhone 12 Pro",
    imei: "356789012345678",
    type: "Mobile Phone",
    status: "Active",
    warrantyStatus: "Active Warranty",
    owner: {
      name: "John Anderson",
      phone: "+1 (555) 123-4567",
      avatar: "https://i.pravatar.cc/150?u=john",
    },
    overview: {
      brand: "Apple",
      model: "iPhone 12 Pro",
      imeiSerial: "356789012345678",
      color: "Pacific Blue",
      storage: "256 GB",
      purchaseDate: "Mar 15, 2023",
      registeredOn: "Mar 18, 2023",
    },
    warranty: {
      status: "Active",
      provider: "Apple Inc.",
      expiryDate: "Mar 15, 2024",
      daysRemaining: "127 days",
      terms: "1-year limited warranty covering manufacturing defects. Does not cover accidental damage or liquid damage.",
    },
    statistics: {
      totalRepairs: 3,
      totalSpent: "Rs. 15,450",
      averageCost: "Rs. 5,150",
      lastService: "2 weeks ago",
    },
    photos: [
      "https://images.unsplash.com/photo-1611791484670-ce19b801d192?q=80&w=200&h=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=200&h=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=200&h=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605236453091-60540ae44479?q=80&w=200&h=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548092372-0d1bd40894a3?q=80&w=200&h=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=200&h=200&auto=format&fit=crop",
    ],
    repairHistory: [
      {
        id: "rep-1",
        title: "Screen Replacement",
        date: "Nov 28, 2023",
        technician: "Mike Johnson",
        cost: "Rs. 8,500",
        description: "Customer reported cracked screen after drop. Replaced with original OLED display. Tested all functions.",
        status: "Completed",
      },
      {
        id: "rep-2",
        title: "Battery Replacement",
        date: "Aug 15, 2023",
        technician: "Sarah Williams",
        cost: "Rs. 4,200",
        description: "Battery health at 78%. Replaced with genuine Apple battery. Battery health now at 100%.",
        status: "Completed",
      },
      {
        id: "rep-3",
        title: "Charging Port Cleaning",
        date: "May 10, 2023",
        technician: "Mike Johnson",
        cost: "Rs. 2,750",
        description: "Customer reported intermittent charging. Cleaned charging port and removed debris. Charging working normally.",
        status: "Completed",
      },
    ],
    notes: [
      {
        id: "n-1",
        user: "David Chan",
        avatar: "https://i.pravatar.cc/150?u=david",
        date: "2 days ago",
        text: "Customer mentioned they want to upgrade to iPhone 14 Pro soon. Follow up in 2 months for trade-in offer.",
      },
      {
        id: "n-2",
        user: "Mike Johnson",
        avatar: "https://i.pravatar.cc/150?u=mike",
        date: "1 week ago",
        text: "Screen replacement went smoothly. Customer very satisfied with the service. Used premium quality OLED display.",
      },
      {
        id: "n-3",
        user: "Sarah Williams",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        date: "3 months ago",
        text: "Battery replacement completed. Customer advised to avoid overnight charging and use original Apple charger for best battery life.",
      },
    ],
  }

  return (
    <div className="flex bg-background h-screen overflow-hidden text-[#0F172A]">
      <DashboardSidebar />
      
      <div className="flex-1 lg:ml-[200px] ml-0 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="flex-1 flex flex-col pt-0 overflow-y-auto bg-[#F8FAFC]">
          {/* Detail Header - Now secondary below main Header */}
          <header className="h-[96px] bg-white border-b border-border flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => router.back()}
              className="h-11 w-11 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-[#F8FAFC] transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-4">
               <div className="h-14 w-14 rounded-[18px] bg-[#F1F5F9] border border-border p-1 flex items-center justify-center overflow-hidden">
                  <img src={deviceData.photos[0]} alt="" className="w-full h-full object-cover rounded-xl" />
               </div>
               <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <h1 className="text-[20px] font-black text-[#0F172A] tracking-tight">{deviceData.name}</h1>
                    <span className="h-5 px-2.5 rounded-full bg-[#D1FAE5] text-[#10B981] text-[10px] font-black uppercase tracking-widest flex items-center">{deviceData.warrantyStatus}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-0.5">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-tighter">
                      <Hash className="h-3.5 w-3.5" /> IMEI: {deviceData.imei}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-tighter">
                      <Smartphone className="h-3.5 w-3.5" /> {deviceData.type}
                    </span>
                  </div>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-11 px-5 rounded-xl bg-[#4F46E5] text-[13px] font-bold text-white hover:bg-[#4338CA] shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create Repair
            </button>
            <button className="h-11 px-5 rounded-xl border border-border bg-white text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-all flex items-center gap-2 shadow-sm">
              <Edit2 className="h-4 w-4" /> Edit Device
            </button>
            <button className="h-11 w-11 rounded-xl border border-border bg-white text-muted-foreground hover:text-[#0F172A] flex items-center justify-center transition-all shadow-sm">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </header>

          {/* Scrollable Content Container */}
          <div className="w-full max-w-[1280px] p-8 mx-auto flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column (Cards) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Device Overview Card */}
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-[#F8FAFC] flex items-center justify-between">
                  <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-tighter">Device Overview</h3>
                  <div className="h-6 w-6 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5]">
                    <Smartphone className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-[#F8FAFC]">
                    <img src={deviceData.owner.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#0F172A]">{deviceData.owner.name}</span>
                      <span className="text-[12px] font-medium text-muted-foreground tracking-tighter">{deviceData.owner.phone}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 pt-2">
                    {[
                      { icon: Layers, label: "Brand", value: deviceData.overview.brand },
                      { icon: Smartphone, label: "Model", value: deviceData.overview.model },
                      { icon: Hash, label: "IMEI / Serial", value: deviceData.overview.imeiSerial },
                      { icon: Palette, label: "Color", value: deviceData.overview.color },
                      { icon: HardDrive, label: "Storage", value: deviceData.overview.storage },
                      { icon: Calendar, label: "Purchase Date", value: deviceData.overview.purchaseDate },
                      { icon: Clock, label: "Registered On", value: deviceData.overview.registeredOn },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0 h-10">
                        <span className="text-[12px] font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-tighter">
                          <item.icon className="h-3.5 w-3.5 opacity-50 font-bold" /> {item.label}
                        </span>
                        <span className="text-[12px] font-bold text-[#0F172A] tracking-tight">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Warranty Card */}
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-[#F8FAFC] flex items-center justify-between">
                  <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-tighter">Warranty Information</h3>
                  <div className="h-6 w-6 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#10B981]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[13px] font-black text-[#10B981] uppercase tracking-widest">{deviceData.warranty.status}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Provider</span>
                        <span className="text-[13px] font-bold text-[#0F172A]">{deviceData.warranty.provider}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Expiry Date</span>
                        <span className="text-[13px] font-bold text-[#0f172A]">{deviceData.warranty.expiryDate}</span>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#10B981]/20">
                      <span className="text-[12px] font-bold text-[#10B981] flex items-center gap-2">
                        <Clock className="h-4 w-4" /> {deviceData.warranty.daysRemaining} remaining
                      </span>
                    </div>
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Terms</span>
                      <p className="text-[12px] font-medium text-muted-foreground leading-relaxed leading-[1.6]">{deviceData.warranty.terms}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Device Statistics Card */}
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-[#F8FAFC] flex items-center justify-between">
                   <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-tighter">Device Statistics</h3>
                   <div className="h-6 w-6 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#F59E0B]">
                      <TrendingUp className="h-3.5 w-3.5" />
                   </div>
                </div>
                <div className="p-6">
                   <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Total Repairs", value: deviceData.statistics.totalRepairs, bg: "bg-indigo-50", color: "text-[#4F46E5]", icon: Layers },
                        { label: "Total Spent", value: deviceData.statistics.totalSpent, bg: "bg-emerald-50", color: "text-emerald-600", icon: DollarSign },
                        { label: "Avg Repair Cost", value: deviceData.statistics.averageCost, bg: "bg-amber-50", color: "text-amber-600", icon: TrendingUp },
                        { label: "Last Service", value: deviceData.statistics.lastService, bg: "bg-slate-50", color: "text-slate-600", icon: Clock },
                      ].map((stat, idx) => (
                        <div key={idx} className={`${stat.bg} p-4 rounded-xl flex flex-col gap-1`}>
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">{stat.label}</span>
                              <stat.icon className={`h-3 w-3 ${stat.color} opacity-70`} />
                           </div>
                           <span className={`text-[15px] font-black ${stat.color}`}>{stat.value}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Device Photos Card */}
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden pb-4">
                 <div className="px-6 py-5 border-b border-border bg-[#F8FAFC] flex items-center justify-between">
                    <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-tighter">Device Photos</h3>
                    <div className="h-6 w-6 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#64748B]">
                       <Camera className="h-3.5 w-3.5" />
                    </div>
                 </div>
                 <div className="p-4 grid grid-cols-3 gap-2">
                    {deviceData.photos.map((photo, i) => (
                       <div key={i} className="aspect-square rounded-lg border border-border overflow-hidden group relative cursor-zoom-in">
                          <img src={photo} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                       </div>
                    ))}
                 </div>
                 <button className="mx-4 mt-2 h-10 w-[calc(100%-32px)] rounded-xl border-2 border-dashed border-border flex items-center justify-center gap-2 text-[12px] font-black text-muted-foreground hover:bg-[#F8FAFC] hover:border-[#4F46E5]/40 transition-all">
                    <Plus className="h-4 w-4" /> Add Photos
                 </button>
              </div>

            </div>

            {/* Right/Main Column */}
            <div className="lg:col-span-8 space-y-8">
               
               {/* Repair History Section */}
               <section>
                  <div className="flex items-center justify-between mb-5">
                     <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-primary">
                           <History className="h-4.5 w-4.5" />
                        </div>
                        <h2 className="text-[18px] font-black text-[#0F172A] tracking-tight">Repair History</h2>
                     </div>
                     <button className="h-9 px-4 rounded-xl bg-primary text-white text-[12px] font-bold hover:bg-primary/90 flex items-center gap-2 shadow-sm">
                        <Plus className="h-3.5 w-3.5" /> New Repair
                     </button>
                  </div>
                  
                  <div className="space-y-4">
                     {deviceData.repairHistory.map((repair) => (
                        <div key={repair.id} className="bg-white rounded-2xl border-l-[6px] border border-border border-l-[#10B981] shadow-sm p-6 hover:shadow-md transition-all">
                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                              <h4 className="text-[16px] font-black text-[#0F172A] tracking-tight">{repair.title}</h4>
                              <span className="px-3 py-1 rounded-full bg-[#D1FAE5] text-[#10B981] text-[10px] font-black uppercase tracking-widest">{repair.status}</span>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
                              <div className="flex items-center gap-3">
                                 <Calendar className="h-4 w-4 text-muted-foreground" />
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date</span>
                                    <span className="text-[13px] font-bold text-[#475569]">{repair.date}</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <User className="h-4 w-4 text-muted-foreground" />
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Technician</span>
                                    <span className="text-[13px] font-bold text-[#475569]">{repair.technician}</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <DollarSign className="h-4 w-4 text-muted-foreground" />
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cost</span>
                                    <span className="text-[13px] font-bold text-[#475569]">{repair.cost}</span>
                                 </div>
                              </div>
                           </div>
                           <p className="text-[13px] text-muted-foreground font-medium leading-relaxed mb-6 bg-[#F8FAFC] p-4 rounded-xl border border-border/50">
                              {repair.description}
                           </p>
                           <div className="flex items-center gap-4">
                              <button className="px-4 h-9 rounded-lg border border-border bg-white text-[12px] font-bold text-[#0F172A] hover:bg-muted transition-colors flex items-center gap-2">
                                <Info className="h-3.5 w-3.5" /> View Details
                              </button>
                              <button className="px-4 h-9 rounded-lg border border-border bg-white text-[12px] font-bold text-[#0F172A] hover:bg-muted transition-colors flex items-center gap-2">
                                <FileText className="h-3.5 w-3.5" /> View Invoice
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               {/* Device Notes Section */}
               <section className="bg-white rounded-3xl border border-border shadow-sm p-8">
                  <div className="flex items-center gap-2.5 mb-8">
                     <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-primary">
                        <MessageSquare className="h-4.5 w-4.5" />
                     </div>
                     <h2 className="text-[18px] font-black text-[#0F172A] tracking-tight">Device Notes</h2>
                  </div>
                  
                  {/* Add Note Input */}
                  <div className="relative mb-10 group">
                     <textarea 
                        rows={3}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add a note about this device..."
                        className="w-full p-5 rounded-2xl bg-[#F8FAFC] border border-border text-[14px] font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all resize-none shadow-inner"
                     />
                     <div className="absolute bottom-4 right-4 flex items-center gap-4">
                        <span className="text-[10px] font-black text-muted-foreground tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity uppercase">{noteText.length} characters</span>
                        <button className="h-10 px-6 rounded-xl bg-primary text-white text-[12px] font-black shadow-lg hover:shadow-primary/20 shadow-indigo-500/30 transition-all uppercase tracking-tight">
                           Add Note
                        </button>
                     </div>
                  </div>

                  {/* Notes Timeline */}
                  <div className="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-border before:opacity-50">
                     {deviceData.notes.map((note) => (
                        <div key={note.id} className="relative pl-14 group">
                           <div className="absolute left-0 top-0 h-12 w-12 rounded-full border-4 border-white shadow-md bg-white overflow-hidden ring-2 ring-[#4F46E5]/10 z-10 transition-transform group-hover:scale-110">
                              <img src={note.avatar} alt="" className="w-full h-full object-cover" />
                           </div>
                           <div className="bg-[#F8FAFC] rounded-2xl border border-border group-hover:border-primary/20 p-5 transition-all group-hover:bg-white group-hover:shadow-lg group-hover:shadow-black/5">
                              <div className="flex items-center justify-between mb-2">
                                 <span className="text-[14px] font-black text-[#0F172A] tracking-tight hover:text-primary transition-colors cursor-pointer">{note.user}</span>
                                 <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">{note.date}</span>
                                 </div>
                              </div>
                              <p className="text-[13.5px] text-[#475569] font-medium leading-[1.6]">
                                 {note.text}
                              </p>
                              <div className="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button className="text-[11px] font-black text-muted-foreground hover:text-primary uppercase tracking-widest">Pin</button>
                                 <button className="text-[11px] font-black text-muted-foreground hover:text-red-500 uppercase tracking-widest">Delete</button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

            </div>
          </div>
        </div>
          
          {/* Vertical Spacer for "Enough Space" */}
          <div className="h-12" />
          
          <DashboardFooter />
        </main>
      </div>
    </div>
  )
}
