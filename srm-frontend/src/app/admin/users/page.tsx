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
import { useStaffStore } from "@/store/staffStore"
import { useAuthStore } from "@/store/authStore"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { useEffect } from "react"
import { Staff } from "@/types"

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

// Mapper API -> UI TeamMember
const mapApiToMember = (s: Staff): TeamMember => ({
  id: s.id as any,
  name: s.name,
  email: s.email,
  role: s.role.charAt(0).toUpperCase() + s.role.slice(1).replace("_", " "),
  status: s.isActive ? "Active" : "Pending",
  joined: (s as any).createdAt ? (s as any).createdAt.slice(0, 10) : "2024-01-01",
  avatarBg: getAvatarBg(s.id),
  permissions: (s as any).permissions || ["Access Dashboard"]
});

function getAvatarBg(id: string) {
  const bgs = ["bg-rose-500", "bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-sky-500", "bg-violet-500"];
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return bgs[index % bgs.length];
}

export default function TeamManagementPage() {
  const { items, isLoading, error, fetchItems, addItem, updateItem, deleteItem } = useStaffStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const members = useMemo(() => items.map(mapApiToMember), [items])
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
    <div className="flex bg-[#F8FAFC] min-h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="w-full max-w-[1280px] px-4 lg:px-8 py-6 lg:py-8 mx-auto">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-4">
              <Link href="/admin/dashboard" className="text-[#4F46E5] hover:underline">Dashboard</Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              <span className="text-[#0F172A]">Team Management</span>
            </div>

            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-[28px] font-black text-[#0F172A] tracking-tighter mb-1.5">Team Management</h1>
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
                 <div key={i} className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                       <s.icon className={`h-5.5 w-5.5 ${s.color}`} />
                    </div>
                    <div>
                       <p className="text-[11px] font-black text-slate-400 tracking-widest uppercase">{s.label}</p>
                       <p className="text-[20px] font-black text-[#0F172A] leading-tight">{s.val}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-3">
               <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name, email, or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-100 outline-none text-[13px] font-bold transition-all"
                  />
               </div>
               <button className="h-11 px-5 rounded-xl border border-slate-100 hover:bg-slate-50 text-[13px] font-bold text-slate-600 flex items-center gap-2 transition-all w-full md:w-auto justify-center">
                  <Filter className="h-4 w-4" /> Filters
               </button>
            </div>

            {/* Member Grid - RESPONSIVE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
               {filteredMembers.map((m) => (
                 <div key={m.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 relative overflow-hidden flex flex-col">
                    <div className="p-6 pb-2">
                       <div className="flex justify-between items-start mb-6">
                          <div className={`h-14 w-14 rounded-2xl ${m.avatarBg} flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-white`}>
                             {m.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div className="flex items-center gap-1">
                             <button className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all"><Edit2 className="h-4 w-4" /></button>
                             <button className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"><Trash2 className="h-4 w-4" /></button>
                          </div>
                       </div>
                       
                       <div className="mb-6">
                          <h3 className="text-[17px] font-black text-[#0F172A] tracking-tight mb-1 flex items-center gap-2">
                            {m.name} 
                            {m.status === 'Active' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400">
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

                    <div className="mt-auto px-6 py-4 bg-slate-50/50 border-t border-slate-50">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Lock className="h-3 w-3" /> Core Permissions
                       </p>
                       <div className="flex flex-wrap gap-1.5">
                          {m.permissions.map((p, i) => (
                             <span key={i} className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">
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
                 className="group h-full min-h-[280px] rounded-3xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center p-8 gap-4"
               >
                  <div className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
                     <Plus className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                     <p className="text-[14px] font-black text-slate-400 group-hover:text-indigo-600 transition-all">Invite New Member</p>
                     <p className="text-[11px] font-bold text-slate-300">Grant system access & roles</p>
                  </div>
               </button>
            </div>
          </div>
          <DashboardFooter />

          {isLoading && (
            <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-[110]">
              <Spinner size="lg" />
            </div>
          )}

          {error && (
            <div className="fixed bottom-8 right-8 w-96 z-[110]">
               <ErrorBanner message={error} onClose={() => useStaffStore.setState({ error: null })} />
            </div>
          )}
        </main>
      </div>

      {/* INVITE MODAL PLACEHOLDER */}
      {showInviteModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
               <div className="p-8 border-b border-slate-50 relative flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
                     <UserPlus className="h-8 w-8" />
                  </div>
                  <h2 className="text-[22px] font-black text-[#0F172A] tracking-tighter">Invite Team Member</h2>
                  <p className="text-[13px] text-muted-foreground font-bold mt-1">Send an invitation link to grant access.</p>
               </div>

               <div className="p-8 space-y-6">
                  <div>
                     <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Member Full Name</label>
                     <input type="text" placeholder="e.g. David Clarke" className="w-full h-12 rounded-xl border border-slate-200 px-4 text-[14px] font-bold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all" />
                  </div>
                  <div>
                     <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Company Email Address</label>
                     <input type="email" placeholder="name@srm.com" className="w-full h-12 rounded-xl border border-slate-200 px-4 text-[14px] font-bold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all" />
                  </div>
                  <div>
                     <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Assign System Role</label>
                     <select className="w-full h-12 rounded-xl border border-slate-200 px-4 text-[14px] font-bold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none bg-white transition-all appearance-none">
                        <option>Junior Technician</option>
                        <option>Senior Technician</option>
                        <option>Logistics Manager</option>
                        <option>Super Admin</option>
                     </select>
                  </div>
               </div>

               <div className="p-8 bg-slate-50 flex gap-3">
                  <button onClick={() => setShowInviteModal(false)} className="flex-1 h-12 rounded-xl border border-slate-200 bg-white text-slate-500 text-[14px] font-bold hover:bg-slate-50 transition-all">Cancel</button>
                  <button onClick={() => setShowInviteModal(false)} className="flex-1 h-12 rounded-xl bg-indigo-600 text-white text-[14px] font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Send Invitation</button>
               </div>
            </div>
         </div>
      )}
    </div>
  )
}
