"use client"
import { useState, useMemo } from "react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight, Plus, X, Shield, Star, Trash2, Edit2, Check, FileDown, Loader2, UserPlus, Calendar as CalendarIcon, Grid, List as ListIcon } from "lucide-react"
import { INITIAL_STAFF, StaffMember, StaffRole, StaffStatus, Specialty, ROLES, SPECIALTIES, STATUSES, BRANCHES, ROLE_COLOR, STATUS_DOT, STATUS_BADGE, getInitials, getAvatarBg, UNASSIGNED_REPAIRS } from "./staff-data"

type SortKey = "name-az"|"name-za"|"rating-desc"|"rating-asc"|"jobs-desc"|"jobs-asc"|"newest"|"oldest"
const SORT_OPTIONS: {value:SortKey;label:string}[] = [
  {value:"name-az",    label:"Name (A–Z)"},
  {value:"name-za",    label:"Name (Z–A)"},
  {value:"rating-desc",label:"Highest Rating"},
  {value:"rating-asc", label:"Lowest Rating"},
  {value:"jobs-desc",  label:"Most Active Jobs"},
  {value:"jobs-asc",   label:"Fewest Active Jobs"},
  {value:"newest",     label:"Newest Joined"},
  {value:"oldest",     label:"Longest Serving"},
]

interface Role { id:number; name:string; color:string; desc:string }
const INIT_ROLES: Role[] = [
  {id:1, name:"Super Admin",       color:"#E11D48", desc:"Full system access including billing and branches."},
  {id:2, name:"Senior Technician", color:"#4F46E5", desc:"Can manage and reassign all repair tasks."},
  {id:3, name:"Junior Technician", color:"#059669", desc:"Can view assigned tasks and log time."},
]

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF)
  const [viewMode, setViewMode] = useState<"grid"|"list">("grid")
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name-az")
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(12)
  const [isExporting, setIsExporting] = useState(false)

  // Filters
  const [filterRoles, setFilterRoles] = useState<StaffRole[]>([])
  const [filterStatuses, setFilterStatuses] = useState<StaffStatus[]>([])
  const [filterSpecialties, setFilterSpecialties] = useState<Specialty[]>([])
  const [filterBranch, setFilterBranch] = useState("")
  const [filterMinRating, setFilterMinRating] = useState(0)

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [editStaff, setEditStaff] = useState<StaffMember|null>(null)
  const [deleteStaff, setDeleteStaff] = useState<StaffMember|null>(null)
  const [assignStaff, setAssignStaff] = useState<StaffMember|null>(null)
  const [assignRepair, setAssignRepair] = useState(UNASSIGNED_REPAIRS[0])
  const [showRolesModal, setShowRolesModal] = useState(false)
  const [roles, setRoles] = useState<Role[]>(INIT_ROLES)
  const [editingRole, setEditingRole] = useState<Role|null>(null)
  const [newRoleModal, setNewRoleModal] = useState(false)
  const [newRole, setNewRole] = useState({name:"",color:"#4F46E5",desc:""})

  // Add form
  const [form, setForm] = useState({firstName:"",lastName:"",email:"",phone:"",role:"Technician" as StaffRole, branch:"Main Branch",specialties:[] as Specialty[],status:"Available" as StaffStatus})

  const toggle = <T extends string>(val:T, arr:T[], set:(f:(p:T[])=>T[])=>void) =>
    set(p => p.includes(val) ? p.filter(x=>x!==val) : [...p,val])

  const clearFilters = () => { setFilterRoles([]); setFilterStatuses([]); setFilterSpecialties([]); setFilterBranch(""); setFilterMinRating(0); setCurrentPage(1) }

  const filtered = useMemo(() => {
    let r = staff
    if (search.trim()) { const q=search.toLowerCase(); r=r.filter(s=>(`${s.firstName} ${s.lastName}`).toLowerCase().includes(q)||s.role.toLowerCase().includes(q)||s.email.toLowerCase().includes(q)||s.specialties.join(" ").toLowerCase().includes(q)) }
    if (filterRoles.length)     r=r.filter(s=>filterRoles.includes(s.role))
    if (filterStatuses.length)  r=r.filter(s=>filterStatuses.includes(s.status))
    if (filterSpecialties.length) r=r.filter(s=>filterSpecialties.some(sp=>s.specialties.includes(sp)))
    if (filterBranch)           r=r.filter(s=>s.branch===filterBranch)
    if (filterMinRating>0)      r=r.filter(s=>s.rating>=filterMinRating)
    return [...r].sort((a,b)=>{
      const na=`${a.firstName} ${a.lastName}`, nb=`${b.firstName} ${b.lastName}`
      if (sortKey==="name-az")     return na.localeCompare(nb)
      if (sortKey==="name-za")     return nb.localeCompare(na)
      if (sortKey==="rating-desc") return b.rating-a.rating
      if (sortKey==="rating-asc")  return a.rating-b.rating
      if (sortKey==="jobs-desc")   return b.activeJobs-a.activeJobs
      if (sortKey==="jobs-asc")    return a.activeJobs-b.activeJobs
      if (sortKey==="newest")      return b.joinedAt.localeCompare(a.joinedAt)
      if (sortKey==="oldest")      return a.joinedAt.localeCompare(b.joinedAt)
      return 0
    })
  }, [staff, search, filterRoles, filterStatuses, filterSpecialties, filterBranch, filterMinRating, sortKey])

  const totalPages = Math.max(1, Math.ceil(filtered.length/perPage))
  const paginated = filtered.slice((currentPage-1)*perPage, currentPage*perPage)

  const handleAdd = () => {
    if (!form.firstName||!form.lastName) return
    const s: StaffMember = { id:Date.now(), ...form, rating:0, activeJobs:0, weekJobs:0, joinedAt:new Date().toISOString().slice(0,10) }
    setStaff(p=>[s,...p]); setShowAddModal(false)
    setForm({firstName:"",lastName:"",email:"",phone:"",role:"Technician",branch:"Main Branch",specialties:[],status:"Available"})
  }

  const handleExportCSV = () => {
    const rows=[["Name","Email","Phone","Role","Branch","Status","Rating","Active Jobs","Week Jobs","Joined"],
      ...filtered.map(s=>[`${s.firstName} ${s.lastName}`,s.email,s.phone,s.role,s.branch,s.status,s.rating,s.activeJobs,s.weekJobs,s.joinedAt])]
    const csv=rows.map(r=>r.join(",")).join("\n")
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="staff.csv"; a.click()
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const {default:jsPDF}=await import("jspdf"); const {default:autoTable}=await import("jspdf-autotable")
      const doc=new jsPDF({orientation:"landscape"})
      doc.setFillColor(79,70,229); doc.rect(0,0,297,16,"F")
      doc.setTextColor(255,255,255); doc.setFontSize(12); doc.setFont("helvetica","bold"); doc.text("Staff Report",14,11)
      doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.text(`Generated: ${new Date().toLocaleString()}`,210,11); doc.setTextColor(30,30,30)
      autoTable(doc,{startY:20,head:[["Name","Email","Phone","Role","Branch","Status","Rating","Active Jobs"]],body:filtered.map(s=>[`${s.firstName} ${s.lastName}`,s.email,s.phone,s.role,s.branch,s.status,s.rating,s.activeJobs]),headStyles:{fillColor:[79,70,229],textColor:255,fontStyle:"bold",fontSize:8},bodyStyles:{fontSize:8,cellPadding:3},alternateRowStyles:{fillColor:[245,247,255]}})
      doc.save(`staff_${new Date().toISOString().slice(0,10)}.pdf`)
    } catch(e){alert("Export failed")} finally{setIsExporting(false)}
  }

  const hasFilters = filterRoles.length||filterStatuses.length||filterSpecialties.length||filterBranch||filterMinRating>0

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar/>
      <div className="flex flex-1 flex-col ml-[200px] min-w-0">
        <DashboardHeader/>
        <main className="flex-1 flex flex-col overflow-y-auto" onClick={()=>{ setShowSortMenu(false); setShowExportMenu(false) }}>
          <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col flex-1">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-4">
              <Link href="/admin/dashboard" className="text-[#4F46E5] hover:underline">Dashboard</Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50"/>
              <span className="text-[#0F172A]">Staff Management</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-[26px] font-black text-[#0F172A] tracking-tight">Staff Management</h1>
                <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[13px] font-bold">{filtered.length} Members</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={e=>{e.stopPropagation();setShowRolesModal(true)}} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-bold text-[#0F172A] hover:bg-muted shadow-sm focus:outline-none">
                  <Shield className="h-4 w-4 text-muted-foreground"/> Manage Roles
                </button>
                {/* Export */}
                <div className="relative">
                  <button onClick={e=>{e.stopPropagation();setShowExportMenu(p=>!p);setShowSortMenu(false)}} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-semibold text-[#0F172A] hover:bg-muted shadow-sm focus:outline-none">
                    {isExporting?<Loader2 className="h-4 w-4 animate-spin"/>:<FileDown className="h-4 w-4 text-muted-foreground"/>} Export <ChevronDown className="h-3.5 w-3.5 text-muted-foreground"/>
                  </button>
                  {showExportMenu&&(
                    <div className="absolute top-12 right-0 w-44 bg-white border border-border rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                      <button onClick={e=>{e.stopPropagation();handleExportPDF();setShowExportMenu(false)}} className="w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center gap-2"><FileDown className="h-4 w-4 text-[#4F46E5]"/>Export as PDF</button>
                      <button onClick={e=>{e.stopPropagation();handleExportCSV();setShowExportMenu(false)}} className="w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center gap-2"><FileDown className="h-4 w-4 text-[#10B981]"/>Export as CSV</button>
                    </div>
                  )}
                </div>
                <button onClick={()=>setShowAddModal(true)} className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#4F46E5] text-[13px] font-bold text-white hover:bg-[#4338CA] shadow-sm focus:outline-none">
                  <Plus className="h-4 w-4"/> Add Staff
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <input value={search} onChange={e=>{setSearch(e.target.value);setCurrentPage(1)}} type="text" placeholder="Search name, role, specialty..." className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] shadow-sm placeholder:text-muted-foreground/70"/>
              </div>

              {/* Sort */}
              <div className="relative">
                <button onClick={e=>{e.stopPropagation();setShowSortMenu(p=>!p);setShowExportMenu(false)}} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[12px] font-medium text-muted-foreground hover:bg-muted shadow-sm focus:outline-none">
                  Sort: {SORT_OPTIONS.find(s=>s.value===sortKey)?.label} <ChevronDown className="h-3.5 w-3.5"/>
                </button>
                {showSortMenu&&(
                  <div className="absolute top-12 left-0 w-52 bg-white border border-border rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    {SORT_OPTIONS.map(o=>(
                      <button key={o.value} onClick={e=>{e.stopPropagation();setSortKey(o.value);setShowSortMenu(false);setCurrentPage(1)}} className={`w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center justify-between ${sortKey===o.value?"text-[#4F46E5]":"text-[#0F172A]"}`}>
                        {o.label}{sortKey===o.value&&<Check className="h-3.5 w-3.5"/>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filters */}
              <button onClick={()=>setIsFiltersOpen(p=>!p)} className={`flex items-center gap-2 h-10 px-5 rounded-lg border font-bold text-[13px] focus:outline-none shadow-sm transition-colors ${isFiltersOpen?"bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5]/30":"bg-white text-[#0F172A] border-border hover:bg-muted"}`}>
                <Filter className={`h-4 w-4 ${isFiltersOpen?"text-[#4F46E5]":"text-muted-foreground"}`}/> Filters
                {hasFilters?<span className="h-5 w-5 rounded-full bg-[#4F46E5] text-white text-[10px] font-bold flex items-center justify-center">!</span>:null}
              </button>

              {/* View toggle */}
              <div className="flex items-center bg-white border border-border rounded-lg p-1 shadow-sm ml-auto">
                <button onClick={()=>setViewMode("grid")} className={`h-8 w-9 rounded-md flex items-center justify-center transition-colors focus:outline-none ${viewMode==="grid"?"bg-muted text-[#0F172A]":"text-muted-foreground hover:text-[#0F172A]"}`}><Grid className="h-4 w-4"/></button>
                <button onClick={()=>setViewMode("list")} className={`h-8 w-9 rounded-md flex items-center justify-center transition-colors focus:outline-none ${viewMode==="list"?"bg-muted text-[#0F172A]":"text-muted-foreground hover:text-[#0F172A]"}`}><ListIcon className="h-4 w-4"/></button>
              </div>
            </div>

            {/* Filter Panel */}
            {isFiltersOpen&&(
              <div className="mb-5 bg-white border border-border rounded-xl shadow-md p-6 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[15px] font-bold text-[#0F172A]">Filters</h3>
                  <button onClick={clearFilters} className="text-[12px] font-bold text-[#4F46E5] hover:underline focus:outline-none">Clear All</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">Role</p>
                    {ROLES.map(r=>(
                      <label key={r} onClick={e=>{e.preventDefault();toggle(r,filterRoles,setFilterRoles as any);setCurrentPage(1)}} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <div className={`h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors ${filterRoles.includes(r)?"bg-[#4F46E5] border-[#4F46E5]":"border-border hover:border-[#4F46E5]"}`}>{filterRoles.includes(r)&&<Check className="h-3 w-3 text-white" strokeWidth={3}/>}</div>
                        <span className="text-[12px] font-medium text-muted-foreground">{r}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">Status</p>
                    {STATUSES.map(s=>(
                      <label key={s} onClick={e=>{e.preventDefault();toggle(s,filterStatuses,setFilterStatuses as any);setCurrentPage(1)}} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <div className={`h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors ${filterStatuses.includes(s)?"bg-[#4F46E5] border-[#4F46E5]":"border-border hover:border-[#4F46E5]"}`}>{filterStatuses.includes(s)&&<Check className="h-3 w-3 text-white" strokeWidth={3}/>}</div>
                        <span className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground"><span className={`h-2 w-2 rounded-full ${STATUS_DOT[s]}`}/>{s}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">Specialty</p>
                    {SPECIALTIES.map(sp=>(
                      <label key={sp} onClick={e=>{e.preventDefault();toggle(sp,filterSpecialties,setFilterSpecialties as any);setCurrentPage(1)}} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <div className={`h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors ${filterSpecialties.includes(sp)?"bg-[#4F46E5] border-[#4F46E5]":"border-border hover:border-[#4F46E5]"}`}>{filterSpecialties.includes(sp)&&<Check className="h-3 w-3 text-white" strokeWidth={3}/>}</div>
                        <span className="text-[12px] font-medium text-muted-foreground">{sp}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">Branch</p>
                    <select value={filterBranch} onChange={e=>{setFilterBranch(e.target.value);setCurrentPage(1)}} className="w-full h-9 rounded-lg border border-border px-2 text-[12px] focus:outline-none focus:border-[#4F46E5] bg-white">
                      <option value="">All Branches</option>
                      {BRANCHES.map(b=><option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3"><p className="text-[12px] font-bold text-[#0F172A]">Min Rating</p><span className="text-[12px] text-[#4F46E5] font-bold">≥ {filterMinRating===0?"Any":filterMinRating.toFixed(1)}</span></div>
                    <input type="range" min={0} max={5} step={0.1} value={filterMinRating} onChange={e=>{setFilterMinRating(+e.target.value);setCurrentPage(1)}} className="w-full h-1.5 bg-[#E2E8F0] rounded-full accent-[#4F46E5] cursor-pointer"/>
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground mt-1"><span>Any</span><span>5.0</span></div>
                    <button onClick={()=>setIsFiltersOpen(false)} className="mt-4 w-full h-9 bg-[#4F46E5] text-white rounded-lg text-[13px] font-bold hover:bg-[#4338CA] focus:outline-none">Apply Filters</button>
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            {paginated.length===0?(
              <div className="flex-1 flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-border shadow-sm mb-6">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4"><Shield className="h-8 w-8 text-muted-foreground"/></div>
                <h3 className="text-[16px] font-black text-[#0F172A] mb-1">No Staff Found</h3>
                <p className="text-[13px] text-muted-foreground">Adjust filters or add a new staff member.</p>
              </div>
            ):viewMode==="grid"?(
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
                {paginated.map(s=>(
                  <div key={s.id} className="group flex flex-col bg-white rounded-2xl shadow-sm border border-border hover:shadow-md hover:border-[#4F46E5]/30 transition-all p-6 relative">
                    {/* Status badge */}
                    <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${STATUS_BADGE[s.status]}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s.status]}`}/>{s.status}
                    </div>
                    {/* Avatar */}
                    <div className="flex flex-col items-center mt-2 mb-4">
                      <div className="relative mb-3">
                        {s.avatar ? (
                          <img 
                            src={s.avatar} 
                            alt={`${s.firstName} ${s.lastName}`}
                            className="h-16 w-16 rounded-full object-cover shadow-md border-2 border-white"
                          />
                        ) : (
                          <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-[20px] font-black shadow-md ${getAvatarBg(s.id)}`}>
                            {getInitials(s.firstName,s.lastName)}
                          </div>
                        )}
                        <span className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white ${STATUS_DOT[s.status]}`}/>
                      </div>
                      <h2 className="text-[15px] font-black text-[#0F172A] mb-0.5">{s.firstName} {s.lastName}</h2>
                      <p className={`text-[12px] font-bold ${ROLE_COLOR[s.role]}`}>{s.role}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{s.branch}</p>
                    </div>
                    {/* Stats */}
                    <div className="flex items-center justify-center gap-4 mb-4 text-[11px] font-bold text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5"/>{s.activeJobs} Active</span>
                      <span className="h-3 w-px bg-border"/>
                      <span className="flex items-center gap-1 text-[#0F172A]"><Star className="h-3.5 w-3.5 text-[#F59E0B] fill-[#F59E0B]"/>{s.rating.toFixed(1)}</span>
                      <span className="h-3 w-px bg-border"/>
                      <span>{s.weekJobs}/wk</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground text-center mb-4 truncate">{s.specialties.join(", ")}</div>
                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <button onClick={()=>setEditStaff({...s})} className="flex-1 h-9 rounded-lg border border-border bg-white text-[12px] font-bold text-[#0F172A] hover:bg-muted focus:outline-none transition-colors">Edit</button>
                      <button onClick={()=>setAssignStaff(s)} className="flex-[1.5] h-9 rounded-lg bg-[#4F46E5] text-[12px] font-bold text-white hover:bg-[#4338CA] focus:outline-none">Assign Repair</button>
                      <button onClick={()=>setDeleteStaff(s)} className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 focus:outline-none transition-colors"><Trash2 className="h-3.5 w-3.5"/></button>
                    </div>
                  </div>
                ))}
              </div>
            ):(
              <div className="bg-white rounded-xl border border-border shadow-sm mb-6 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-[#F8FAFC] border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-4">Team Member</th>
                    <th className="px-6 py-4">Role & Specialties</th>
                    <th className="px-6 py-4">Branch</th>
                    <th className="px-6 py-4 text-center">Rating</th>
                    <th className="px-6 py-4 text-center">Active</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {paginated.map(s=>(
                      <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4"><div className="flex items-center gap-3">
                          {s.avatar ? (
                            <img 
                              src={s.avatar} 
                              alt="" 
                              className="h-9 w-9 rounded-full object-cover shrink-0 shadow-sm border border-border" 
                            />
                          ) : (
                            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-[12px] font-black shrink-0 ${getAvatarBg(s.id)}`}>
                              {getInitials(s.firstName,s.lastName)}
                            </div>
                          )}
                          <div><p className="text-[13px] font-bold text-[#0F172A]">{s.firstName} {s.lastName}</p><p className="text-[11px] text-muted-foreground">{s.email}</p></div>
                        </div></td>
                        <td className="px-6 py-4"><p className={`text-[12px] font-bold ${ROLE_COLOR[s.role]}`}>{s.role}</p><p className="text-[11px] text-muted-foreground truncate max-w-[180px]">{s.specialties.join(", ")}</p></td>
                        <td className="px-6 py-4 text-[12px] text-muted-foreground font-medium">{s.branch}</td>
                        <td className="px-6 py-4 text-center"><span className="flex items-center justify-center gap-1 font-bold text-[13px]"><Star className="h-3.5 w-3.5 text-[#F59E0B] fill-[#F59E0B]"/>{s.rating.toFixed(1)}</span></td>
                        <td className="px-6 py-4 text-center"><span className="text-[15px] font-black text-[#4F46E5]">{s.activeJobs}</span></td>
                        <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${STATUS_BADGE[s.status]}`}><span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s.status]}`}/>{s.status}</span></td>
                        <td className="px-6 py-4 text-center"><div className="flex items-center justify-center gap-1.5">
                          <button onClick={()=>setAssignStaff(s)} className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-[11px] font-bold text-white hover:bg-[#4338CA] focus:outline-none">Assign</button>
                          <button onClick={()=>setEditStaff({...s})} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted focus:outline-none"><Edit2 className="h-3.5 w-3.5"/></button>
                          <button onClick={()=>setDeleteStaff(s)} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 focus:outline-none"><Trash2 className="h-3.5 w-3.5"/></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-border">
              <span className="text-[13px] text-muted-foreground font-medium">Showing <span className="font-bold text-[#0F172A]">{filtered.length===0?0:(currentPage-1)*perPage+1}–{Math.min(currentPage*perPage,filtered.length)}</span> of <span className="font-bold text-[#0F172A]">{filtered.length}</span> members</span>
              <div className="flex items-center gap-1">
                <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="flex items-center h-8 px-3 text-[13px] font-semibold text-muted-foreground hover:bg-muted rounded disabled:opacity-40 focus:outline-none"><ChevronLeft className="h-4 w-4 mr-1"/>Prev</button>
                {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-currentPage)<=1).reduce((acc,p,i,arr)=>{if(i>0&&arr[i-1]!==p-1)acc.push(-1);acc.push(p);return acc},[] as number[]).map((p,i)=>p===-1?<span key={`e${i}`} className="px-1 text-muted-foreground">…</span>:(
                  <button key={p} onClick={()=>setCurrentPage(p)} className={`h-8 w-8 rounded text-[13px] font-semibold flex items-center justify-center focus:outline-none transition-colors ${currentPage===p?"bg-[#4F46E5] text-white shadow-sm":"text-[#0F172A] hover:bg-muted border border-border bg-white"}`}>{p}</button>
                ))}
                <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className="flex items-center h-8 px-3 text-[13px] font-semibold text-[#0F172A] hover:bg-muted rounded border border-border bg-white disabled:opacity-40 focus:outline-none">Next<ChevronRight className="h-4 w-4 ml-1"/></button>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                Show: <select value={perPage} onChange={e=>{setPerPage(+e.target.value);setCurrentPage(1)}} className="h-8 px-2 rounded border border-border bg-white text-[#0F172A] font-bold focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"><option value={8}>8</option><option value={12}>12</option><option value={16}>16</option><option value={24}>24</option></select> per page
              </div>
            </div>
          </div>
          <DashboardFooter/>
        </main>
      </div>

      {/* ADD STAFF MODAL */}
      {showAddModal&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
              <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2"><UserPlus className="h-5 w-5 text-[#4F46E5]"/>Add Staff Member</h2>
              <button onClick={()=>setShowAddModal(false)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4"/></button>
            </div>
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">First Name *</label><input value={form.firstName} onChange={e=>setForm(p=>({...p,firstName:e.target.value}))} placeholder="John" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Last Name *</label><input value={form.lastName} onChange={e=>setForm(p=>({...p,lastName:e.target.value}))} placeholder="Doe" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Email</label><input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} type="email" placeholder="john@srm.lk" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Phone</label><input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+94 77 ..." className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Role</label>
                  <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value as StaffRole}))} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                    {ROLES.map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Branch</label>
                  <select value={form.branch} onChange={e=>setForm(p=>({...p,branch:e.target.value}))} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                    {BRANCHES.map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-2">Specialties</label>
                <div className="grid grid-cols-2 gap-2">
                  {SPECIALTIES.map(sp=>(
                    <label key={sp} onClick={e=>{e.preventDefault();setForm(p=>({...p,specialties:p.specialties.includes(sp)?p.specialties.filter(x=>x!==sp):[...p.specialties,sp]}))}} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-[12px] font-medium transition-colors ${form.specialties.includes(sp)?"bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]":"border-border text-muted-foreground hover:bg-muted"}`}>
                      {form.specialties.includes(sp)&&<Check className="h-3 w-3 shrink-0"/>}{sp}
                    </label>
                  ))}
                </div>
              </div>
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-2">Initial Status</label>
                <div className="flex gap-2 flex-wrap">{STATUSES.map(s=>(
                  <label key={s} onClick={e=>{e.preventDefault();setForm(p=>({...p,status:s}))}} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-[12px] font-semibold transition-colors ${form.status===s?"bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]":"border-border text-muted-foreground hover:bg-muted"}`}>
                    <span className={`h-2 w-2 rounded-full ${STATUS_DOT[s]}`}/>{s}
                  </label>
                ))}</div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-border">
                <button onClick={()=>setShowAddModal(false)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted focus:outline-none">Cancel</button>
                <button onClick={handleAdd} disabled={!form.firstName||!form.lastName} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md focus:outline-none disabled:opacity-50">Save Staff Member</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {editStaff&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
              <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2"><Edit2 className="h-5 w-5 text-[#4F46E5]"/>Edit Staff Member</h2>
              <button onClick={()=>setEditStaff(null)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">First Name</label><input value={editStaff.firstName} onChange={e=>setEditStaff(p=>p?{...p,firstName:e.target.value}:p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Last Name</label><input value={editStaff.lastName} onChange={e=>setEditStaff(p=>p?{...p,lastName:e.target.value}:p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
              </div>
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Email</label><input value={editStaff.email} onChange={e=>setEditStaff(p=>p?{...p,email:e.target.value}:p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Role</label>
                  <select value={editStaff.role} onChange={e=>setEditStaff(p=>p?{...p,role:e.target.value as StaffRole}:p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                    {ROLES.map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Status</label>
                  <select value={editStaff.status} onChange={e=>setEditStaff(p=>p?{...p,status:e.target.value as StaffStatus}:p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                    {STATUSES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Branch</label>
                <select value={editStaff.branch} onChange={e=>setEditStaff(p=>p?{...p,branch:e.target.value}:p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                  {BRANCHES.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2 border-t border-border">
                <button onClick={()=>setEditStaff(null)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted focus:outline-none">Cancel</button>
                <button onClick={()=>{setStaff(p=>p.map(x=>x.id===editStaff!.id?editStaff!:x));setEditStaff(null)}} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md focus:outline-none">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN REPAIR MODAL */}
      {assignStaff&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[420px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center bg-[#F8FAFC] p-6 border-b border-border">
              {assignStaff.avatar ? (
                <img 
                  src={assignStaff.avatar} 
                  alt="" 
                  className="h-16 w-16 rounded-full object-cover mb-3 shadow-md border-2 border-white" 
                />
              ) : (
                <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-[22px] font-black mb-3 shadow-md ${getAvatarBg(assignStaff.id)}`}>
                  {getInitials(assignStaff.firstName,assignStaff.lastName)}
                </div>
              )}
              <h2 className="text-[16px] font-black text-[#0F172A]">{assignStaff.firstName} {assignStaff.lastName}</h2>
              <p className={`text-[12px] font-bold ${ROLE_COLOR[assignStaff.role]} mt-0.5`}>{assignStaff.role}</p>
            </div>
            <div className="p-6">
              <label className="block text-[13px] font-bold text-[#0F172A] mb-2">Select Repair Task</label>
              <div className="relative mb-6">
                <select value={assignRepair} onChange={e=>setAssignRepair(e.target.value)} className="w-full h-11 rounded-xl border border-border bg-white px-4 text-[13px] font-semibold focus:outline-none focus:border-[#4F46E5] appearance-none">
                  {UNASSIGNED_REPAIRS.map(r=><option key={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"/>
              </div>
              <div className="flex gap-3">
                <button onClick={()=>setAssignStaff(null)} className="flex-1 h-10 rounded-lg border border-border text-[#0F172A] font-bold text-[13px] hover:bg-muted focus:outline-none">Cancel</button>
                <button onClick={()=>{setAssignStaff(null);alert(`Task assigned to ${assignStaff.firstName}!`)}} className="flex-1 h-10 rounded-lg bg-[#4F46E5] text-white font-bold text-[13px] hover:bg-[#4338CA] shadow-sm focus:outline-none">Assign Task</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteStaff&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center shrink-0"><Trash2 className="h-6 w-6 text-red-500"/></div>
              <div><h2 className="text-[17px] font-black text-[#0F172A]">Remove Staff Member?</h2><p className="text-[13px] text-muted-foreground">This will remove <strong>{deleteStaff.firstName} {deleteStaff.lastName}</strong> from the system.</p></div>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setDeleteStaff(null)} className="flex-1 h-10 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted focus:outline-none">Cancel</button>
              <button onClick={()=>{setStaff(p=>p.filter(x=>x.id!==deleteStaff!.id));setDeleteStaff(null)}} className="flex-1 h-10 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 focus:outline-none">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE ROLES MODAL */}
      {showRolesModal&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
              <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2"><Shield className="h-5 w-5 text-[#4F46E5]"/>Manage Staff Roles</h2>
              <button onClick={()=>{setShowRolesModal(false);setEditingRole(null);setNewRoleModal(false)}} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4"/></button>
            </div>
            <div className="divide-y divide-border">
              {roles.map(role=>editingRole?.id===role.id?(
                <div key={role.id} className="p-5 bg-[#F8FAFC] space-y-3">
                  <input value={editingRole.name} onChange={e=>setEditingRole(p=>p?{...p,name:e.target.value}:p)} className="w-full h-9 rounded-lg border border-[#4F46E5] px-3 text-[13px] font-bold focus:outline-none"/>
                  <input value={editingRole.desc} onChange={e=>setEditingRole(p=>p?{...p,desc:e.target.value}:p)} className="w-full h-9 rounded-lg border border-border px-3 text-[13px] focus:outline-none"/>
                  <div className="flex items-center gap-2"><span className="text-[12px] font-bold text-muted-foreground">Color:</span><input type="color" value={editingRole.color} onChange={e=>setEditingRole(p=>p?{...p,color:e.target.value}:p)} className="h-8 w-12 rounded cursor-pointer border border-border"/></div>
                  <div className="flex gap-2">
                    <button onClick={()=>{setRoles(p=>p.map(r=>r.id===editingRole!.id?editingRole!:r));setEditingRole(null)}} className="flex-1 h-9 bg-[#4F46E5] text-white rounded-lg text-[13px] font-bold hover:bg-[#4338CA] focus:outline-none">Save</button>
                    <button onClick={()=>setEditingRole(null)} className="flex-1 h-9 border border-border rounded-lg text-[13px] font-bold hover:bg-muted focus:outline-none">Cancel</button>
                  </div>
                </div>
              ):(
                <div key={role.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div>
                    <h3 className="text-[14px] font-bold flex items-center gap-2 mb-0.5" style={{color:role.color}}><span className="h-2 w-2 rounded-full inline-block" style={{background:role.color}}/>{role.name}</h3>
                    <p className="text-[12px] text-muted-foreground">{role.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>setEditingRole(role)} className="h-8 w-8 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted focus:outline-none"><Edit2 className="h-3.5 w-3.5"/></button>
                    <button onClick={()=>setRoles(p=>p.filter(r=>r.id!==role.id))} className="h-8 w-8 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 focus:outline-none"><Trash2 className="h-3.5 w-3.5"/></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-border bg-[#F8FAFC]">
              {newRoleModal?(
                <div className="space-y-3">
                  <input value={newRole.name} onChange={e=>setNewRole(p=>({...p,name:e.target.value}))} placeholder="Role name" className="w-full h-9 rounded-lg border border-[#4F46E5] px-3 text-[13px] font-bold focus:outline-none"/>
                  <input value={newRole.desc} onChange={e=>setNewRole(p=>({...p,desc:e.target.value}))} placeholder="Description" className="w-full h-9 rounded-lg border border-border px-3 text-[13px] focus:outline-none"/>
                  <div className="flex items-center gap-2"><span className="text-[12px] font-bold text-muted-foreground">Color:</span><input type="color" value={newRole.color} onChange={e=>setNewRole(p=>({...p,color:e.target.value}))} className="h-8 w-12 rounded cursor-pointer border border-border"/></div>
                  <div className="flex gap-2">
                    <button onClick={()=>{if(newRole.name){setRoles(p=>[...p,{id:Date.now(),...newRole}]);setNewRoleModal(false);setNewRole({name:"",color:"#4F46E5",desc:""})}}} className="flex-1 h-9 bg-[#4F46E5] text-white rounded-lg text-[13px] font-bold hover:bg-[#4338CA] focus:outline-none">Add Role</button>
                    <button onClick={()=>setNewRoleModal(false)} className="flex-1 h-9 border border-border rounded-lg text-[13px] font-bold hover:bg-muted focus:outline-none">Cancel</button>
                  </div>
                </div>
              ):(
                <button onClick={()=>setNewRoleModal(true)} className="flex items-center gap-1.5 text-[13px] font-bold text-[#4F46E5] hover:underline focus:outline-none"><Plus className="h-4 w-4"/>Create New Role</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
