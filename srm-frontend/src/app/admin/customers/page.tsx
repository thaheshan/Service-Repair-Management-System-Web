"use client"
import { useState, useMemo } from "react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import { Search, Filter, ChevronDown, UserPlus, FileDown, Grid, List as ListIcon, MapPin, Mail, Phone, MessageSquare, X, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Check, Loader2 } from "lucide-react"
import { INITIAL_CUSTOMERS, Customer, CustomerType, getInitials, getAvatarColor, formatSpent } from "./customer-data"

type SortKey = "name-az"|"name-za"|"repairs-desc"|"repairs-asc"|"spent-desc"|"spent-asc"|"latest-visit"|"oldest-visit"
type LastVisitFilter = "today"|"this-week"|"this-month"|"last-6-months"|"inactive"|null

interface Role { id: number; name: string; color: string; desc: string }

const SORT_OPTIONS: {value: SortKey; label: string}[] = [
  {value:"name-az",      label:"Name (A–Z)"},
  {value:"name-za",      label:"Name (Z–A)"},
  {value:"repairs-desc", label:"Most Repairs"},
  {value:"repairs-asc",  label:"Fewest Repairs"},
  {value:"spent-desc",   label:"Highest Spent"},
  {value:"spent-asc",    label:"Lowest Spent"},
  {value:"latest-visit", label:"Most Recent Visit"},
  {value:"oldest-visit", label:"Oldest Visit"},
]

const INITIAL_ROLES: Role[] = [
  {id:1, name:"VIP Customer",      color:"#F59E0B", desc:"Priority repairs and discounted parts."},
  {id:2, name:"Corporate Partner", color:"#9333EA", desc:"Bulk billing and dedicated account management."},
  {id:3, name:"Regular Customer",  color:"#475569", desc:"Standard repair flow and retail pricing."},
]

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS)
  const [viewMode, setViewMode] = useState<"grid"|"list">("grid")
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name-az")
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(12)

  // Filter state
  const [filterTypes, setFilterTypes] = useState<CustomerType[]>([])
  const [filterRepairsMax, setFilterRepairsMax] = useState(50)
  const [filterSpentMax, setFilterSpentMax] = useState(100)
  const [filterLastVisit, setFilterLastVisit] = useState<LastVisitFilter>(null)
  const [filterRegFrom, setFilterRegFrom] = useState("")
  const [filterRegTo, setFilterRegTo] = useState("")

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRolesModal, setShowRolesModal] = useState(false)
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES)
  const [editingRole, setEditingRole] = useState<Role|null>(null)
  const [newRoleModal, setNewRoleModal] = useState(false)
  const [newRole, setNewRole] = useState({name:"",color:"#4F46E5",desc:""})
  const [commModal, setCommModal] = useState<{type:"Phone"|"Mail"|"SMS";customer:Customer}|null>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Add customer form
  const [form, setForm] = useState({firstName:"",lastName:"",email:"",phone:"",location:"",type:"Regular" as CustomerType})

  const toggleType = (t: CustomerType) => setFilterTypes(p => p.includes(t) ? p.filter(x=>x!==t) : [...p,t])

  const clearFilters = () => {
    setFilterTypes([]); setFilterRepairsMax(50); setFilterSpentMax(100)
    setFilterLastVisit(null); setFilterRegFrom(""); setFilterRegTo(""); setCurrentPage(1)
  }

  const filtered = useMemo(() => {
    let r = customers
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q))
    }
    if (filterTypes.length) r = r.filter(c => filterTypes.includes(c.type))
    r = r.filter(c => c.repairs <= filterRepairsMax && c.spentRaw <= filterSpentMax)
    if (filterLastVisit === "today")        r = r.filter(c => c.lastVisitDays === 0)
    if (filterLastVisit === "this-week")    r = r.filter(c => c.lastVisitDays <= 7)
    if (filterLastVisit === "this-month")   r = r.filter(c => c.lastVisitDays <= 30)
    if (filterLastVisit === "last-6-months")r = r.filter(c => c.lastVisitDays <= 180)
    if (filterLastVisit === "inactive")     r = r.filter(c => c.lastVisitDays > 180)
    if (filterRegFrom) r = r.filter(c => c.registeredAt >= filterRegFrom)
    if (filterRegTo)   r = r.filter(c => c.registeredAt <= filterRegTo)
    r = [...r].sort((a,b) => {
      if (sortKey==="name-az")       return a.name.localeCompare(b.name)
      if (sortKey==="name-za")       return b.name.localeCompare(a.name)
      if (sortKey==="repairs-desc")  return b.repairs - a.repairs
      if (sortKey==="repairs-asc")   return a.repairs - b.repairs
      if (sortKey==="spent-desc")    return b.spentRaw - a.spentRaw
      if (sortKey==="spent-asc")     return a.spentRaw - b.spentRaw
      if (sortKey==="latest-visit")  return a.lastVisitDays - b.lastVisitDays
      if (sortKey==="oldest-visit")  return b.lastVisitDays - a.lastVisitDays
      return 0
    })
    return r
  }, [customers, search, filterTypes, filterRepairsMax, filterSpentMax, filterLastVisit, filterRegFrom, filterRegTo, sortKey])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((currentPage-1)*perPage, currentPage*perPage)

  const handleAddCustomer = () => {
    if (!form.firstName || !form.lastName) return
    const newC: Customer = {
      id: Date.now(), name: `${form.firstName} ${form.lastName}`,
      email: form.email, phone: form.phone, location: form.location || "Colombo, Sri Lanka",
      repairs: 0, spentRaw: 0, type: form.type as CustomerType,
      lastVisitDays: 0, registeredAt: new Date().toISOString().slice(0,10), tags: []
    }
    setCustomers(p => [newC, ...p])
    setShowAddModal(false)
    setForm({firstName:"",lastName:"",email:"",phone:"",location:"",type:"Regular"})
  }

  const handleExportCSV = () => {
    const rows = [["Name","Email","Phone","Location","Type","Repairs","Spent","Last Visit Days"],
      ...filtered.map(c => [c.name,c.email,c.phone,c.location,c.type,c.repairs,formatSpent(c.spentRaw),c.lastVisitDays])]
    const csv = rows.map(r => r.join(",")).join("\n")
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}))
    a.download = "customers.csv"; a.click()
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const {default: jsPDF} = await import("jspdf")
      const {default: autoTable} = await import("jspdf-autotable")
      const doc = new jsPDF({orientation:"landscape"})
      doc.setFillColor(79,70,229); doc.rect(0,0,297,16,"F")
      doc.setTextColor(255,255,255); doc.setFontSize(12); doc.setFont("helvetica","bold")
      doc.text("Customer Report",14,11)
      doc.setFontSize(8); doc.setFont("helvetica","normal")
      doc.text(`Generated: ${new Date().toLocaleString()}`,200,11)
      doc.setTextColor(30,30,30)
      autoTable(doc,{
        startY:20,
        head:[["Name","Email","Phone","Location","Type","Repairs","Spent"]],
        body:filtered.map(c=>[c.name,c.email,c.phone,c.location,c.type,c.repairs,formatSpent(c.spentRaw)]),
        headStyles:{fillColor:[79,70,229],textColor:255,fontStyle:"bold",fontSize:8},
        bodyStyles:{fontSize:8,cellPadding:3},
        alternateRowStyles:{fillColor:[245,247,255]},
      })
      doc.save(`customers_${new Date().toISOString().slice(0,10)}.pdf`)
    } catch(e){ alert("Export failed") } finally { setIsExporting(false) }
  }

  const visitLabel = (d:number) => d===0?"Today":d===1?"Yesterday":d<=7?`${d}d ago`:d<=30?`${d}d ago`:`${d}d ago`

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        <DashboardHeader />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col flex-1">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-4">
              <Link href="/admin/dashboard" className="text-[#4F46E5] hover:underline">Dashboard</Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              <span className="text-[#0F172A]">Customer Management</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-[26px] font-black text-[#0F172A] tracking-tight">Customer Management</h1>
                <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[13px] font-bold">{filtered.length} Customers</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={()=>setShowRolesModal(true)} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-bold text-[#0F172A] hover:bg-muted shadow-sm transition-colors focus:outline-none">
                  <UserPlus className="h-4 w-4 text-muted-foreground" /> Manage Roles
                </button>
                <button onClick={()=>setShowAddModal(true)} className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#4F46E5] text-[13px] font-bold text-white hover:bg-[#4338CA] shadow-sm transition-colors focus:outline-none">
                  <Plus className="h-4 w-4" /> Add Customer
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6 relative">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={search} onChange={e=>{setSearch(e.target.value);setCurrentPage(1)}} type="text" placeholder="Search by name, email, phone..." className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] shadow-sm placeholder:text-muted-foreground/70" />
              </div>

              {/* Export */}
              <div className="relative">
                <button onClick={()=>{setShowExportMenu(p=>!p);setShowSortMenu(false)}} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-semibold text-[#0F172A] hover:bg-muted shadow-sm focus:outline-none">
                  {isExporting?<Loader2 className="h-4 w-4 animate-spin"/>:<FileDown className="h-4 w-4 text-muted-foreground"/>}
                  Export <ChevronDown className="h-3.5 w-3.5 text-muted-foreground"/>
                </button>
                {showExportMenu&&(
                  <div className="absolute top-12 left-0 w-44 bg-white border border-border rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button onClick={()=>{handleExportPDF();setShowExportMenu(false)}} className="w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center gap-2"><FileDown className="h-4 w-4 text-[#4F46E5]"/>Export as PDF</button>
                    <button onClick={()=>{handleExportCSV();setShowExportMenu(false)}} className="w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center gap-2"><FileDown className="h-4 w-4 text-[#10B981]"/>Export as CSV</button>
                  </div>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <button onClick={()=>{setShowSortMenu(p=>!p);setShowExportMenu(false)}} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-semibold text-[#0F172A] hover:bg-muted shadow-sm focus:outline-none">
                  <span className="text-muted-foreground font-medium text-[12px]">Sort: {SORT_OPTIONS.find(s=>s.value===sortKey)?.label}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground"/>
                </button>
                {showSortMenu&&(
                  <div className="absolute top-12 left-0 w-52 bg-white border border-border rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    {SORT_OPTIONS.map(o=>(
                      <button key={o.value} onClick={()=>{setSortKey(o.value);setShowSortMenu(false);setCurrentPage(1)}} className={`w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center justify-between ${sortKey===o.value?"text-[#4F46E5]":"text-[#0F172A]"}`}>
                        {o.label}{sortKey===o.value&&<Check className="h-3.5 w-3.5"/>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter button */}
              <button onClick={()=>setIsFiltersOpen(p=>!p)} className={`flex items-center gap-2 h-10 px-5 rounded-lg border font-bold text-[13px] focus:outline-none shadow-sm transition-colors ${isFiltersOpen?"bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5]/30":"bg-white text-[#0F172A] border-border hover:bg-muted"}`}>
                <Filter className={`h-4 w-4 ${isFiltersOpen?"text-[#4F46E5]":"text-muted-foreground"}`}/> Filters
                {(filterTypes.length||filterLastVisit||filterRegFrom||filterRegTo||filterRepairsMax<50||filterSpentMax<100)?<span className="h-5 w-5 rounded-full bg-[#4F46E5] text-white text-[10px] font-bold flex items-center justify-center">!</span>:null}
              </button>

              {/* View toggle */}
              <div className="flex items-center bg-white border border-border rounded-lg p-1 shadow-sm ml-auto">
                <button onClick={()=>setViewMode("grid")} className={`h-8 w-9 rounded-md flex items-center justify-center transition-colors focus:outline-none ${viewMode==="grid"?"bg-muted text-[#0F172A]":"text-muted-foreground hover:text-[#0F172A]"}`}><Grid className="h-4 w-4"/></button>
                <button onClick={()=>setViewMode("list")} className={`h-8 w-9 rounded-md flex items-center justify-center transition-colors focus:outline-none ${viewMode==="list"?"bg-muted text-[#0F172A]":"text-muted-foreground hover:text-[#0F172A]"}`}><ListIcon className="h-4 w-4"/></button>
              </div>
            </div>

            {/* Filter Panel */}
            {isFiltersOpen&&(
              <div className="mb-6 bg-white border border-border rounded-xl shadow-md p-6 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[15px] font-bold text-[#0F172A]">Filters</h3>
                  <button onClick={clearFilters} className="text-[12px] font-bold text-[#4F46E5] hover:underline focus:outline-none">Clear All</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                  {/* Customer Type */}
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">Customer Type</p>
                    {([["Regular","Regular Customers",customers.filter(c=>c.type==="Regular").length],["VIP","VIP Customers",customers.filter(c=>c.type==="VIP").length],["New","New (< 30 days)",customers.filter(c=>c.type==="New").length]] as [CustomerType,string,number][]).map(([val,label,count])=>(
                      <label key={val} onClick={e=>{e.preventDefault();toggleType(val);setCurrentPage(1)}} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <div className={`h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors ${filterTypes.includes(val)?"bg-[#4F46E5] border-[#4F46E5]":"border-border hover:border-[#4F46E5]"}`}>{filterTypes.includes(val)&&<Check className="h-3 w-3 text-white" strokeWidth={3}/>}</div>
                        <span className="text-[13px] font-medium text-muted-foreground flex-1">{label}</span>
                        <span className="text-[11px] font-bold text-muted-foreground">{count}</span>
                      </label>
                    ))}
                  </div>
                  {/* Repairs */}
                  <div>
                    <div className="flex items-center justify-between mb-3"><p className="text-[12px] font-bold text-[#0F172A]">Total Repairs</p><span className="text-[12px] text-[#4F46E5] font-bold">0–{filterRepairsMax===50?"50+":filterRepairsMax}</span></div>
                    <input type="range" min={0} max={50} value={filterRepairsMax} onChange={e=>{setFilterRepairsMax(+e.target.value);setCurrentPage(1)}} className="w-full h-1.5 bg-[#E2E8F0] rounded-full accent-[#4F46E5] cursor-pointer"/>
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground mt-1"><span>0</span><span>50+</span></div>
                  </div>
                  {/* Spent */}
                  <div>
                    <div className="flex items-center justify-between mb-3"><p className="text-[12px] font-bold text-[#0F172A]">Total Spent</p><span className="text-[12px] text-[#4F46E5] font-bold">Rs. 0–{filterSpentMax===100?"100k+":filterSpentMax+"k"}</span></div>
                    <input type="range" min={0} max={100} value={filterSpentMax} onChange={e=>{setFilterSpentMax(+e.target.value);setCurrentPage(1)}} className="w-full h-1.5 bg-[#E2E8F0] rounded-full accent-[#4F46E5] cursor-pointer"/>
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground mt-1"><span>Rs. 0</span><span>Rs. 100k+</span></div>
                  </div>
                  {/* Last Visit */}
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">Last Visit</p>
                    {([["today","Today"],["this-week","This Week"],["this-month","This Month"],["last-6-months","Last 6 Months"],["inactive","Inactive (>6 mo)"]] as [LastVisitFilter,string][]).map(([val,label])=>(
                      <label key={val} onClick={e=>{e.preventDefault();setFilterLastVisit(filterLastVisit===val?null:val);setCurrentPage(1)}} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${filterLastVisit===val?"border-[#4F46E5]":"border-border hover:border-[#4F46E5]"}`}>{filterLastVisit===val&&<div className="h-2 w-2 rounded-full bg-[#4F46E5]"/>}</div>
                        <span className="text-[13px] font-medium text-muted-foreground">{label}</span>
                      </label>
                    ))}
                  </div>
                  {/* Reg Date */}
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">Registration Date</p>
                    <div className="space-y-2">
                      <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">From</label><input type="date" value={filterRegFrom} onChange={e=>{setFilterRegFrom(e.target.value);setCurrentPage(1)}} className="w-full h-9 rounded-lg border border-border px-2 text-[12px] focus:outline-none focus:border-[#4F46E5]"/></div>
                      <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">To</label><input type="date" value={filterRegTo} onChange={e=>{setFilterRegTo(e.target.value);setCurrentPage(1)}} className="w-full h-9 rounded-lg border border-border px-2 text-[12px] focus:outline-none focus:border-[#4F46E5]"/></div>
                    </div>
                    <button onClick={()=>setIsFiltersOpen(false)} className="mt-3 w-full h-9 bg-[#4F46E5] text-white rounded-lg text-[13px] font-bold hover:bg-[#4338CA] transition-colors focus:outline-none">Apply Filters</button>
                  </div>
                </div>
              </div>
            )}

            {/* Cards / List */}
            {paginated.length===0?(
              <div className="flex-1 flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-border shadow-sm mb-6">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4"><UserPlus className="h-8 w-8 text-muted-foreground"/></div>
                <h3 className="text-[16px] font-black text-[#0F172A] mb-1">No Customers Found</h3>
                <p className="text-[13px] text-muted-foreground">Adjust filters or add a new customer.</p>
              </div>
            ):viewMode==="grid"?(
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                {paginated.map(c=>(
                  <div key={c.id} className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md hover:border-[#4F46E5]/30 transition-all group flex flex-col items-center text-center">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-[20px] font-black mb-4 shadow-sm ${getAvatarColor(c.id)}`}>{getInitials(c.name)}</div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-[15px] font-bold text-[#0F172A]">{c.name}</h2>
                      {c.type==="VIP"&&<span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">VIP</span>}
                      {c.type==="New"&&<span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-200">New</span>}
                    </div>
                    <div className="w-full space-y-1.5 mb-4 text-left border-b border-border/50 pb-4">
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground"><Mail className="h-3.5 w-3.5 shrink-0"/><span className="truncate">{c.email}</span></div>
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground"><Phone className="h-3.5 w-3.5 shrink-0"/>{c.phone}</div>
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground"><MapPin className="h-3.5 w-3.5 shrink-0"/>{c.location}</div>
                    </div>
                    <div className="flex items-center justify-between w-full mb-4">
                      <div className="flex flex-col items-center flex-1"><span className="text-[17px] font-black text-[#0F172A]">{c.repairs}</span><span className="text-[10px] text-muted-foreground font-bold tracking-wider">REPAIRS</span></div>
                      <div className="h-8 w-px bg-border"/>
                      <div className="flex flex-col items-center flex-1"><span className="text-[17px] font-black text-[#0F172A]">{formatSpent(c.spentRaw)}</span><span className="text-[10px] text-muted-foreground font-bold tracking-wider">SPENT</span></div>
                      <div className="h-8 w-px bg-border"/>
                      <div className="flex flex-col items-center flex-1"><span className="text-[17px] font-black text-[#0F172A]">{visitLabel(c.lastVisitDays)}</span><span className="text-[10px] text-muted-foreground font-bold tracking-wider">LAST VISIT</span></div>
                    </div>
                    <Link href={`/admin/customers/${c.id}`} className="w-full h-9 rounded-lg border border-border bg-white text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-colors focus:outline-none shadow-sm mb-3 flex items-center justify-center">View Profile</Link>
                    <div className="flex items-center justify-center gap-2">
                      {(["Phone","Mail","SMS"] as const).map(t=>(
                        <button key={t} onClick={()=>setCommModal({type:t,customer:c})} className="h-8 w-10 flex items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:text-[#4F46E5] hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF] transition-all focus:outline-none">
                          {t==="Phone"?<Phone className="h-4 w-4"/>:t==="Mail"?<Mail className="h-4 w-4"/>:<MessageSquare className="h-4 w-4"/>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ):(
              <div className="bg-white rounded-xl border border-border shadow-sm mb-6 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="border-b border-border bg-[#F8FAFC]">
                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider text-center">Type</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider text-center">Repairs</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider text-right">Spent</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {paginated.map(c=>(
                      <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4"><div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-[12px] font-black shrink-0 ${getAvatarColor(c.id)}`}>{getInitials(c.name)}</div>
                          <div><div className="text-[14px] font-bold text-[#0F172A]">{c.name}</div><div className="text-[12px] text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/>{c.location}</div></div>
                        </div></td>
                        <td className="px-6 py-4"><div className="text-[12px] text-muted-foreground font-medium space-y-0.5"><div className="flex items-center gap-1.5"><Mail className="h-3 w-3"/>{c.email}</div><div className="flex items-center gap-1.5"><Phone className="h-3 w-3"/>{c.phone}</div></div></td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${c.type==="VIP"?"bg-amber-50 text-amber-700 border-amber-200":c.type==="New"?"bg-green-50 text-green-700 border-green-200":"bg-gray-50 text-gray-600 border-gray-200"}`}>{c.type}</span>
                        </td>
                        <td className="px-6 py-4 text-center"><span className="font-bold text-[#0F172A]">{c.repairs}</span></td>
                        <td className="px-6 py-4 text-right"><span className="font-bold text-[#10B981]">{formatSpent(c.spentRaw)}</span></td>
                        <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-1.5">
                          <Link href={`/admin/customers/${c.id}`} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted transition-colors"><Mail className="h-3.5 w-3.5"/></Link>
                          {(["Phone","SMS"] as const).map(t=><button key={t} onClick={()=>setCommModal({type:t,customer:c})} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted transition-colors">{t==="Phone"?<Phone className="h-3.5 w-3.5"/>:<MessageSquare className="h-3.5 w-3.5"/>}</button>)}
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-border">
              <span className="text-[13px] text-muted-foreground font-medium">Showing <span className="font-bold text-[#0F172A]">{filtered.length===0?0:(currentPage-1)*perPage+1}–{Math.min(currentPage*perPage,filtered.length)}</span> of <span className="font-bold text-[#0F172A]">{filtered.length}</span> customers</span>
              <div className="flex items-center gap-1">
                <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="flex items-center h-8 px-3 text-[13px] font-semibold text-muted-foreground hover:bg-muted rounded disabled:opacity-40 focus:outline-none"><ChevronLeft className="h-4 w-4 mr-1"/>Previous</button>
                {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-currentPage)<=1).reduce((acc,p,i,arr)=>{
                  if(i>0&&arr[i-1]!==p-1)acc.push(-1);acc.push(p);return acc
                },[] as number[]).map((p,i)=>p===-1?<span key={`e${i}`} className="px-1 text-muted-foreground font-bold text-[13px]">…</span>:(
                  <button key={p} onClick={()=>setCurrentPage(p)} className={`h-8 w-8 rounded text-[13px] font-semibold flex items-center justify-center focus:outline-none transition-colors ${currentPage===p?"bg-[#4F46E5] text-white shadow-sm":"text-[#0F172A] hover:bg-muted border border-border bg-white"}`}>{p}</button>
                ))}
                <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className="flex items-center h-8 px-3 text-[13px] font-semibold text-[#0F172A] hover:bg-muted rounded border border-border bg-white disabled:opacity-40 focus:outline-none">Next<ChevronRight className="h-4 w-4 ml-1"/></button>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                Show: <select value={perPage} onChange={e=>{setPerPage(+e.target.value);setCurrentPage(1)}} className="h-8 px-2 rounded border border-border bg-white text-[#0F172A] font-bold focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"><option value={6}>6</option><option value={12}>12</option><option value={24}>24</option></select> per page
              </div>
            </div>

          </div>
          <DashboardFooter/>
        </main>
      </div>

      {/* ADD CUSTOMER MODAL */}
      {showAddModal&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
              <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2"><UserPlus className="h-5 w-5 text-[#4F46E5]"/>Add New Customer</h2>
              <button onClick={()=>setShowAddModal(false)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">First Name *</label><input value={form.firstName} onChange={e=>setForm(p=>({...p,firstName:e.target.value}))} placeholder="e.g. Sarah" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Last Name *</label><input value={form.lastName} onChange={e=>setForm(p=>({...p,lastName:e.target.value}))} placeholder="e.g. Anderson" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Email</label><input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} type="email" placeholder="email@example.com" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Phone</label><input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+94 77 ..." className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
              </div>
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Location</label><input value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} placeholder="City, Sri Lanka" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-2">Customer Type</label>
                <div className="flex gap-3">{(["Regular","VIP","New"] as CustomerType[]).map(t=>(
                  <label key={t} onClick={e=>{e.preventDefault();setForm(p=>({...p,type:t}))}} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-[13px] font-semibold transition-colors ${form.type===t?"bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]":"border-border text-muted-foreground hover:bg-muted"}`}>{form.type===t&&<Check className="h-3.5 w-3.5"/>}{t}</label>
                ))}</div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-border">
                <button onClick={()=>setShowAddModal(false)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted transition-colors focus:outline-none">Cancel</button>
                <button onClick={handleAddCustomer} disabled={!form.firstName||!form.lastName} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none disabled:opacity-50">Save Customer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE ROLES MODAL */}
      {showRolesModal&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
              <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2"><UserPlus className="h-5 w-5 text-[#4F46E5]"/>Manage Customer Roles</h2>
              <button onClick={()=>{setShowRolesModal(false);setEditingRole(null)}} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4"/></button>
            </div>
            <div className="divide-y divide-border">
              {roles.map(role=>editingRole?.id===role.id?(
                <div key={role.id} className="p-5 bg-[#F8FAFC] space-y-3">
                  <input value={editingRole.name} onChange={e=>setEditingRole(p=>p?{...p,name:e.target.value}:p)} className="w-full h-9 rounded-lg border border-[#4F46E5] px-3 text-[13px] font-bold focus:outline-none"/>
                  <input value={editingRole.desc} onChange={e=>setEditingRole(p=>p?{...p,desc:e.target.value}:p)} className="w-full h-9 rounded-lg border border-border px-3 text-[13px] focus:outline-none"/>
                  <div className="flex items-center gap-2"><span className="text-[12px] font-bold text-muted-foreground">Color:</span><input type="color" value={editingRole.color} onChange={e=>setEditingRole(p=>p?{...p,color:e.target.value}:p)} className="h-8 w-12 rounded cursor-pointer border border-border"/></div>
                  <div className="flex gap-2">
                    <button onClick={()=>{setRoles(p=>p.map(r=>r.id===editingRole.id?editingRole:r));setEditingRole(null)}} className="flex-1 h-9 bg-[#4F46E5] text-white rounded-lg text-[13px] font-bold hover:bg-[#4338CA] focus:outline-none">Save</button>
                    <button onClick={()=>setEditingRole(null)} className="flex-1 h-9 border border-border rounded-lg text-[13px] font-bold hover:bg-muted focus:outline-none">Cancel</button>
                  </div>
                </div>
              ):(
                <div key={role.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div>
                    <h3 className="text-[14px] font-bold mb-0.5 flex items-center gap-2" style={{color:role.color}}><span className="h-2 w-2 rounded-full inline-block" style={{background:role.color}}/>{role.name}</h3>
                    <p className="text-[12px] text-muted-foreground">{role.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>setEditingRole(role)} className="h-8 w-8 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted transition-colors focus:outline-none"><Edit2 className="h-3.5 w-3.5"/></button>
                    <button onClick={()=>setRoles(p=>p.filter(r=>r.id!==role.id))} className="h-8 w-8 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"><Trash2 className="h-3.5 w-3.5"/></button>
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

      {/* COMMUNICATION MODAL */}
      {commModal&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[460px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#EEF2FF] text-[#4F46E5]">{commModal.type==="Phone"?<Phone className="h-5 w-5"/>:commModal.type==="Mail"?<Mail className="h-5 w-5"/>:<MessageSquare className="h-5 w-5"/>}</div>
                <div><h2 className="text-[16px] font-black text-[#0F172A]">{commModal.type==="Phone"?"Initiate Call":commModal.type==="Mail"?"Send Email":"Send SMS"}</h2><p className="text-[12px] font-bold text-[#4F46E5]">To: {commModal.customer.name}</p></div>
              </div>
              <button onClick={()=>setCommModal(null)} className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-5 w-5"/></button>
            </div>
            <div className="p-6">
              <div className="bg-[#F8FAFC] border border-border rounded-xl p-4 mb-5 flex items-center justify-between">
                <span className="text-[12px] font-bold text-muted-foreground">{commModal.type==="Mail"?"Email":"Phone"}</span>
                <span className="text-[14px] font-black text-[#0F172A]">{commModal.type==="Mail"?commModal.customer.email:commModal.customer.phone}</span>
              </div>
              {commModal.type!=="Phone"&&<textarea rows={4} placeholder={`Write your ${commModal.type} message...`} className="w-full p-4 rounded-xl border border-border text-[13px] focus:outline-none focus:border-[#4F46E5] resize-none mb-5"/>}
              <div className="flex gap-3">
                <button onClick={()=>setCommModal(null)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted focus:outline-none">Cancel</button>
                <button onClick={()=>setCommModal(null)} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md focus:outline-none">{commModal.type==="Phone"?"Dial Number":"Send Message"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
