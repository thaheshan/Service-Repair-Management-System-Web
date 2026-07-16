"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import { 
  UserPlus, Mail, Shield, CheckCircle2, Clock, 
  MoreVertical, Edit2, Trash2, ShieldCheck, 
  Search, Filter, ChevronRight, User, Key, Lock, 
  Settings, Award, Briefcase, Activity, Plus
} from "lucide-react"

// Mock Team Members
interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending" | "Suspended";
  joined: string;
  avatarBg: string;
  permissions: string[];
}

const INITIAL_MEMBERS: TeamMember[] = [
  { 
    id: 1, 
    name: "John Smith", 
    email: "john@srm.com", 
    role: "Super Admin", 
    status: "Active", 
    joined: "2023-11-12", 
    avatarBg: "bg-rose-500",
    permissions: ["Full Access", "Billing", "Staff Management"]
  },
  { 
    id: 2, 
    name: "Sarah Wayne", 
    email: "sarah@srm.com", 
    role: "Junior Technician", 
    status: "Active", 
    joined: "2024-01-05", 
    avatarBg: "bg-indigo-500",
    permissions: ["Repair Access", "Clock In/Out"]
  },
  { 
    id: 3, 
    name: "Robert Fox", 
    email: "robert@srm.com", 
    role: "Logistics Manager", 
    status: "Pending", 
    joined: "2024-02-10", 
    avatarBg: "bg-emerald-500",
    permissions: ["Inventory", "Ordering"]
  },
]

const ROLE_STYLES: Record<string, string> = {
  "Super Admin": "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700",
  "Junior Technician": "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700",
  "Logistics Manager": "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
}

const STATUS_CHIPS: Record<string, string> = {
  Active: "bg-emerald-500 text-white shadow-emerald-200",
  Pending: "bg-amber-500 text-white shadow-amber-200",
  Suspended: "bg-slate-400 text-white shadow-slate-100",
}

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS)
  const [search, setSearch] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)

  const filteredMembers = useMemo(() => {
    if (!search.trim()) return members
    const q = search.toLowerCase()
    return members.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.email.toLowerCase().includes(q) || 
      m.role.toLowerCase().includes(q)
    )
  }, [members, search])

  return (
    <div className="flex bg-background min-h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="w-full max-w-[1280px] px-4 lg:px-8 py-6 lg:py-8 mx-auto">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-4">
              <Link href="/admin/dashboard" className="text-[#4F46E5] hover:underline">Dashboard</Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              <span className="text-foreground">Team Management</span>
            </div>

            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-[28px] font-black text-foreground tracking-tighter mb-1.5">Team Management</h1>
                <p className="text-[14px] text-muted-foreground font-semibold">Manage permissions and team access levels for your service center.</p>
              </div>
              <button 
                onClick={() => setShowInviteModal(true)}
                className="flex items-center justify-center gap-2.5 h-12 px-6 rounded-2xl bg-[#4F46E5] text-white text-[14px] font-bold shadow-lg shadow-indigo-200 hover:bg-[#4338CA] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserPlus className="h-4.5 w-4.5" /> Invite Member
              </button>
            </div>

            {/* Stats Summary Rows */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
               {[
                 { label: "Total Members", val: members.length, icon: User, color: "text-indigo-600", bg: "bg-indigo-50" },
                 { label: "Admin Roles", val: 1, icon: Shield, color: "text-rose-600", bg: "bg-rose-50" },
                 { label: "Active Now", val: 2, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
                 { label: "Pending Invitations", val: 1, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" }
               ].map((s, i) => (
                 <div key={i} className="bg-card p-4 lg:p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${s.bg} dark:bg-opacity-30`}>
                       <s.icon className={`h-5.5 w-5.5 ${s.color}`} />
                    </div>
                    <div>
                       <p className="text-[11px] font-black text-muted-foreground tracking-widest uppercase">{s.label}</p>
                       <p className="text-[20px] font-black text-foreground leading-tight">{s.val}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-card p-3 rounded-2xl border border-border shadow-sm mb-6 flex flex-col md:flex-row items-center gap-3">
               <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search by name, email, or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/40 border-transparent focus:bg-card focus:border-border outline-none text-[13px] font-bold transition-all"
                  />
               </div>
               <button className="h-11 px-5 rounded-xl border border-border hover:bg-muted text-[13px] font-bold text-foreground flex items-center gap-2 transition-all w-full md:w-auto justify-center">
                  <Filter className="h-4 w-4" /> Filters
               </button>
            </div>

            {/* Member Grid - RESPONSIVE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
               {filteredMembers.map((m) => (
                 <div key={m.id} className="group bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden flex flex-col">
                    <div className="p-6 pb-2">
                       <div className="flex justify-between items-start mb-6">
                          <div className={`h-14 w-14 rounded-2xl ${m.avatarBg} flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-white dark:ring-background`}>
                             {m.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div className="flex items-center gap-1">
                             <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary transition-all"><Edit2 className="h-4 w-4" /></button>
                             <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"><Trash2 className="h-4 w-4" /></button>
                          </div>
                       </div>
                       
                       <div className="mb-6">
                          <h3 className="text-[17px] font-black text-foreground tracking-tight mb-1 flex items-center gap-2">
                             {m.name} 
                             {m.status === 'Active' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground">
                             <Mail className="h-3.5 w-3.5" /> {m.email}
                          </div>
                       </div>

                       <div className="flex flex-wrap gap-2 mb-6">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${ROLE_STYLES[m.role]}`}>
                             {m.role}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg ${STATUS_CHIPS[m.status]}`}>
                             {m.status}
                          </span>
                       </div>
                    </div>

                    <div className="mt-auto px-6 py-4 bg-muted/30 border-t border-border">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Lock className="h-3 w-3" /> Core Permissions
                       </p>
                       <div className="flex flex-wrap gap-1.5">
                          {m.permissions.map((p, i) => (
                             <span key={i} className="text-[11px] font-bold text-muted-foreground bg-card px-2 py-0.5 rounded-md border border-border">
                                {p}
                             </span>
                          ))}
                       </div>
                    </div>
                 </div>
               ))}

               {/* Empty State / Add Card Placeholder */}
               <button 
                 onClick={() => setShowInviteModal(true)}
                 className="group h-full min-h-[280px] rounded-3xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center p-8 gap-4"
               >
                  <div className="h-14 w-14 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                     <Plus className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                     <p className="text-[14px] font-black text-muted-foreground group-hover:text-primary transition-all">Invite New Member</p>
                     <p className="text-[11px] font-bold text-muted-foreground/60">Grant system access & roles</p>
                  </div>
               </button>
            </div>
          </div>
          <DashboardFooter />
        </main>
      </div>

      {/* INVITE MODAL PLACEHOLDER */}
      {showInviteModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-card w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-border">
               <div className="p-8 border-b border-border relative flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 shadow-sm">
                     <UserPlus className="h-8 w-8" />
                  </div>
                  <h2 className="text-[22px] font-black text-foreground tracking-tighter">Invite Team Member</h2>
                  <p className="text-[13px] text-muted-foreground font-bold mt-1">Send an invitation link to grant access.</p>
               </div>

               <div className="p-8 space-y-6">
                  <div>
                     <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2">Member Full Name</label>
                     <input type="text" placeholder="e.g. David Clarke" className="w-full h-12 rounded-xl border border-border bg-card px-4 text-[14px] font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
                  </div>
                  <div>
                     <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2">Company Email Address</label>
                     <input type="email" placeholder="name@srm.com" className="w-full h-12 rounded-xl border border-border bg-card px-4 text-[14px] font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" />
                  </div>
                  <div>
                     <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2">Assign System Role</label>
                     <select className="w-full h-12 rounded-xl border border-border px-4 text-[14px] font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none bg-card transition-all appearance-none">
                        <option>Junior Technician</option>
                        <option>Senior Technician</option>
                        <option>Logistics Manager</option>
                        <option>Super Admin</option>
                     </select>
                  </div>
               </div>

               <div className="p-8 bg-muted/30 border-t border-border flex gap-3">
                  <button onClick={() => setShowInviteModal(false)} className="flex-1 h-12 rounded-xl border border-border bg-card text-foreground text-[14px] font-bold hover:bg-muted transition-all">Cancel</button>
                  <button onClick={() => setShowInviteModal(false)} className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold shadow-lg hover:bg-primary/90 transition-all">Send Invitation</button>
               </div>
            </div>
         </div>
      )}
    </div>
  )
}
