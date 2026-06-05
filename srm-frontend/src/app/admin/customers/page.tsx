"use client"
import { useState, useMemo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import Link from "next/link"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import { Search, Filter, ChevronDown, UserPlus, FileDown, Grid, List as ListIcon, MapPin, Mail, Phone, MessageSquare, X, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Check, Loader2, Shield } from "lucide-react"
import { INITIAL_CUSTOMERS, Customer, CustomerType, getInitials, getAvatarColor, formatSpent } from "./customer-data"

type SortKey = "name-az" | "name-za" | "repairs-desc" | "repairs-asc" | "spent-desc" | "spent-asc" | "latest-visit" | "oldest-visit"
type LastVisitFilter = "today" | "this-week" | "this-month" | "last-6-months" | "inactive" | null

interface Role { id: number; name: string; color: string; desc: string }

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name-az", label: "Name (A–Z)" },
  { value: "name-za", label: "Name (Z–A)" },
  { value: "repairs-desc", label: "Most Repairs" },
  { value: "repairs-asc", label: "Fewest Repairs" },
  { value: "latest-visit", label: "Most Recent Visit" },
  { value: "oldest-visit", label: "Oldest Visit" },
]

const INITIAL_ROLES: Role[] = [
  { id: 1, name: "VIP Customer", color: "#F59E0B", desc: "Priority repairs and discounted parts." },
  { id: 2, name: "Corporate Partner", color: "#9333EA", desc: "Bulk billing and dedicated account management." },
  { id: 3, name: "Regular Customer", color: "#475569", desc: "Standard repair flow and retail pricing." },
]

import { useGetCustomersQuery, useCreateCustomerMutation } from "@/services/api/customersApiSlice"
import { useGetSettingsQuery } from "@/services/api/settingsApiSlice"


export default function CustomerManagementPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user)
  useEffect(() => setMounted(true), []);

  const { data: response, isLoading } = useGetCustomersQuery({});
  const [createCustomer] = useCreateCustomerMutation();

  const customers = useMemo(() => {
    const apiCustomers = response?.customers || [];
    return apiCustomers.map((c: any) => {
      // Calculate derived fields
      const repairsCount = c.repairs?.length || 0;
      const spentRaw = c.repairs?.reduce((acc: number, curr: any) => acc + (curr.finalCost || curr.estimatedCost || 0), 0) || 0;

      let lastVisitDays = 0;
      if (c.repairs && c.repairs.length > 0) {
        const sortedRepairs = [...c.repairs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const diffTime = Math.abs(new Date().getTime() - new Date(sortedRepairs[0].createdAt).getTime());
        lastVisitDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
        const diffTime = Math.abs(new Date().getTime() - new Date(c.registeredAt || c.createdAt || Date.now()).getTime());
        lastVisitDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      let type: CustomerType = c.tier as CustomerType || "Regular";
      // Allow 'New' status for Regular customers joined recently
      if (type === "Regular" && lastVisitDays < 30 && repairsCount === 0) type = "New";


      return {
        id: c.id,
        name: c.name || "Unknown Customer",
        email: c.email || "N/A",
        phone: c.phone || "N/A",
        location: c.address || "N/A",
        repairs: repairsCount,
        spentRaw,
        type,
        lastVisitDays,
        registeredAt: new Date(c.registeredAt || c.createdAt || Date.now()).toISOString().slice(0, 10),
        tags: c.tags || []
      }
    });
  }, [response]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
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
  const { data: settingsData } = useGetSettingsQuery({})
  const liveRoles = useMemo(() => settingsData?.settings?.customerTiers || INITIAL_ROLES, [settingsData])

  const [commModal, setCommModal] = useState<{ type: "Phone" | "Mail" | "SMS"; customer: Customer } | null>(null)

  const [isExporting, setIsExporting] = useState(false)

  // Add customer form
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", tier: "Regular" as "Regular" | "VIP" | "Corporate" })


  const toggleType = (t: CustomerType) => setFilterTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])

  const clearFilters = () => {
    setFilterTypes([]); setFilterRepairsMax(50); setFilterSpentMax(100)
    setFilterLastVisit(null); setFilterRegFrom(""); setFilterRegTo(""); setCurrentPage(1)
  }

  const filtered = useMemo(() => {
    let r = customers
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter((c: any) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q))
    }
    if (filterTypes.length) r = r.filter((c: any) => filterTypes.includes(c.type))
    r = r.filter((c: any) => c.repairs <= (filterRepairsMax === 50 ? 999999 : filterRepairsMax) && c.spentRaw <= (filterSpentMax === 100 ? 99999999 : filterSpentMax * 1000))
    if (filterLastVisit === "today") r = r.filter((c: any) => c.lastVisitDays === 0)
    if (filterLastVisit === "this-week") r = r.filter((c: any) => c.lastVisitDays <= 7)
    if (filterLastVisit === "this-month") r = r.filter((c: any) => c.lastVisitDays <= 30)
    if (filterLastVisit === "last-6-months") r = r.filter((c: any) => c.lastVisitDays <= 180)
    if (filterLastVisit === "inactive") r = r.filter((c: any) => c.lastVisitDays > 180)
    if (filterRegFrom) r = r.filter((c: any) => c.registeredAt >= filterRegFrom)
    if (filterRegTo) r = r.filter((c: any) => c.registeredAt <= filterRegTo)
    r = [...r].sort((a, b) => {
      if (sortKey === "name-az") return a.name.localeCompare(b.name)
      if (sortKey === "name-za") return b.name.localeCompare(a.name)
      if (sortKey === "repairs-desc") return b.repairs - a.repairs
      if (sortKey === "repairs-asc") return a.repairs - b.repairs
      if (sortKey === "spent-desc") return b.spentRaw - a.spentRaw
      if (sortKey === "spent-asc") return a.spentRaw - b.spentRaw
      if (sortKey === "latest-visit") return a.lastVisitDays - b.lastVisitDays
      if (sortKey === "oldest-visit") return b.lastVisitDays - a.lastVisitDays
      return 0
    })
    return r
  }, [customers, search, filterTypes, filterRepairsMax, filterSpentMax, filterLastVisit, filterRegFrom, filterRegTo, sortKey])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const handleAddCustomer = async () => {
    if (!form.name || !form.phone) return
    try {
      await createCustomer({
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address || "Colombo, Sri Lanka",
        tier: form.tier
      }).unwrap()


      setShowAddModal(false)
      setForm({ name: "", email: "", phone: "", address: "", tier: "Regular" })

    } catch (err) {
      console.error("Failed to add customer:", err);
    }
  }

  const handleExportCSV = () => {
    const rows = [["Name", "Email", "Phone", "Location", "Type", "Repairs", "Spent", "Last Visit Days"],
    ...filtered.map((c: any) => [c.name, c.email, c.phone, c.location, c.type, c.repairs, formatSpent(c.spentRaw), c.lastVisitDays])]
    const csv = rows.map((r: any) => r.join(",")).join("\n")
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    a.download = "customers.csv"; a.click()
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const { default: jsPDF } = await import("jspdf")
      const { default: autoTable } = await import("jspdf-autotable")
      const doc = new jsPDF({ orientation: "landscape" })
      doc.setFillColor(79, 70, 229); doc.rect(0, 0, 297, 16, "F")
      doc.setTextColor(255, 255, 255); doc.setFontSize(12); doc.setFont("helvetica", "bold")
      doc.text("Customer Report", 14, 11)
      doc.setFontSize(8); doc.setFont("helvetica", "normal")
      doc.text(`Generated: ${new Date().toLocaleString()}`, 200, 11)
      doc.setTextColor(30, 30, 30)
      autoTable(doc, {
        startY: 20,
        head: [["Name", "Email", "Phone", "Location", "Type", "Repairs", "Spent"]],
        body: filtered.map((c: any) => [c.name, c.email, c.phone, c.location, c.type, c.repairs, formatSpent(c.spentRaw)]),
        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold", fontSize: 8 },
        bodyStyles: { fontSize: 8, cellPadding: 3 },
        alternateRowStyles: { fillColor: [245, 247, 255] },
      })
      doc.save(`customers_${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (e) { alert("Export failed") } finally { setIsExporting(false) }
  }

  const visitLabel = (d: number) => d === 0 ? "Today" : d === 1 ? "Yesterday" : d <= 7 ? `${d}d ago` : d <= 30 ? `${d}d ago` : `${d}d ago`

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
              <span className="text-foreground">Customer Management</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-[26px] font-black text-foreground tracking-tight">{mounted ? t('customers.title') : 'Customer Management'}</h1>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[13px] font-bold">{filtered.length} {mounted ? t('customers.total') : 'Customers'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/customers/tiers"
                  className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-card text-[13px] font-bold text-foreground hover:bg-muted shadow-sm transition-colors focus:outline-none"
                >
                  <Shield className="h-4 w-4 text-[#4F46E5]" /> {mounted ? t('customers.manageRoles') : 'Manage Roles'}
                </Link>
                <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#4F46E5] text-[13px] font-bold text-white hover:bg-[#4338CA] shadow-sm transition-colors focus:outline-none">
                  <Plus className="h-4 w-4" /> {mounted ? t('customers.add') : 'Add Customer'}
                </button>
              </div>

            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6 relative">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }} type="text" placeholder="Search by name, email, phone..." className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-card text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] shadow-sm placeholder:text-muted-foreground/70 text-foreground" />
              </div>

              {/* Export */}
              <div className="relative">
                <button onClick={() => { setShowExportMenu(p => !p); setShowSortMenu(false) }} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-card text-[13px] font-semibold text-foreground hover:bg-muted shadow-sm focus:outline-none">
                  {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4 text-muted-foreground" />}
                  {mounted ? t('customers.export') : 'Export'} <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                {showExportMenu && (
                  <div className="absolute top-12 left-0 w-44 bg-card border border-border rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button onClick={() => { handleExportPDF(); setShowExportMenu(false) }} className="w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center gap-2 text-foreground"><FileDown className="h-4 w-4 text-[#4F46E5]" />Export as PDF</button>
                    <button onClick={() => { handleExportCSV(); setShowExportMenu(false) }} className="w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center gap-2 text-foreground"><FileDown className="h-4 w-4 text-[#10B981]" />Export as CSV</button>
                  </div>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <button onClick={() => { setShowSortMenu(p => !p); setShowExportMenu(false) }} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-card text-[13px] font-semibold text-foreground hover:bg-muted shadow-sm focus:outline-none">
                  <span className="text-muted-foreground font-medium text-[12px]">Sort: {SORT_OPTIONS.find(s => s.value === sortKey)?.label}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                {showSortMenu && (
                  <div className="absolute top-12 left-0 w-52 bg-card border border-border rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    {SORT_OPTIONS.map(o => (
                      <button key={o.value} onClick={() => { setSortKey(o.value); setShowSortMenu(false); setCurrentPage(1) }} className={`w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center justify-between ${sortKey === o.value ? "text-[#4F46E5]" : "text-foreground"}`}>
                        {o.label}{sortKey === o.value && <Check className="h-3.5 w-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter button */}
              <button onClick={() => setIsFiltersOpen(p => !p)} className={`flex items-center gap-2 h-10 px-5 rounded-lg border font-bold text-[13px] focus:outline-none shadow-sm transition-colors ${isFiltersOpen ? "bg-primary/10 text-primary border-[#4F46E5]/30" : "bg-card text-foreground border-border hover:bg-muted"}`}>
                <Filter className={`h-4 w-4 ${isFiltersOpen ? "text-[#4F46E5]" : "text-muted-foreground"}`} /> {mounted ? t('customers.filters') : 'Filters'}
                {(filterTypes.length || filterLastVisit || filterRegFrom || filterRegTo || filterRepairsMax < 50 || filterSpentMax < 100) ? <span className="h-5 w-5 rounded-full bg-[#4F46E5] text-white text-[10px] font-bold flex items-center justify-center">!</span> : null}
              </button>

              {/* View toggle */}
              <div className="flex items-center bg-card border border-border rounded-lg p-1 shadow-sm ml-auto">
                <button onClick={() => setViewMode("grid")} className={`h-8 w-9 rounded-md flex items-center justify-center transition-colors focus:outline-none ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}><Grid className="h-4 w-4" /></button>
                <button onClick={() => setViewMode("list")} className={`h-8 w-9 rounded-md flex items-center justify-center transition-colors focus:outline-none ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}><ListIcon className="h-4 w-4" /></button>
              </div>
            </div>

            {/* Filter Panel */}
            {isFiltersOpen && (
              <div className="mb-6 bg-card border border-border rounded-xl shadow-md p-6 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[15px] font-bold text-foreground">Filters</h3>
                  <button onClick={clearFilters} className="text-[12px] font-bold text-[#4F46E5] hover:underline focus:outline-none">Clear All</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                  {/* Customer Type */}
                  <div>
                    <p className="text-[12px] font-bold text-foreground mb-3">Customer Type</p>
                    {([["Regular", "Regular Customers", customers.filter(c => c.type === "Regular").length], ["VIP", "VIP Customers", customers.filter(c => c.type === "VIP").length], ["New", "New (< 30 days)", customers.filter(c => c.type === "New").length]] as [CustomerType, string, number][]).map(([val, label, count]) => (
                      <label key={val} onClick={e => { e.preventDefault(); toggleType(val); setCurrentPage(1) }} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <div className={`h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors ${filterTypes.includes(val) ? "bg-[#4F46E5] border-[#4F46E5]" : "border-border hover:border-[#4F46E5]"}`}>{filterTypes.includes(val) && <Check className="h-3 w-3 text-white" strokeWidth={3} />}</div>
                        <span className="text-[13px] font-medium text-muted-foreground flex-1">{label}</span>
                        <span className="text-[11px] font-bold text-muted-foreground">{count}</span>
                      </label>
                    ))}
                  </div>
                  {/* Repairs */}
                  <div>
                    <div className="flex items-center justify-between mb-3"><p className="text-[12px] font-bold text-foreground">Total Repairs</p><span className="text-[12px] text-[#4F46E5] font-bold">0–{filterRepairsMax === 50 ? "50+" : filterRepairsMax}</span></div>
                    <input type="range" min={0} max={50} value={filterRepairsMax} onChange={e => { setFilterRepairsMax(+e.target.value); setCurrentPage(1) }} className="w-full h-1.5 bg-[#E2E8F0] dark:bg-muted rounded-full accent-[#4F46E5] cursor-pointer" />
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground mt-1"><span>0</span><span>50+</span></div>
                  </div>
                  {/* Spent */}
                  {user?.role !== 'TECHNICIAN' && (
                    <div>
                      <div className="flex items-center justify-between mb-3"><p className="text-[12px] font-bold text-foreground">Total Spent</p><span className="text-[12px] text-[#4F46E5] font-bold">Rs. 0–{filterSpentMax === 100 ? "100k+" : filterSpentMax + "k"}</span></div>
                      <input type="range" min={0} max={100} value={filterSpentMax} onChange={e => { setFilterSpentMax(+e.target.value); setCurrentPage(1) }} className="w-full h-1.5 bg-[#E2E8F0] dark:bg-muted rounded-full accent-[#4F46E5] cursor-pointer" />
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground mt-1"><span>Rs. 0</span><span>Rs. 100k+</span></div>
                    </div>
                  )}
                  {/* Last Visit */}
                  <div>
                    <p className="text-[12px] font-bold text-foreground mb-3">Last Visit</p>
                    {([["today", "Today"], ["this-week", "This Week"], ["this-month", "This Month"], ["last-6-months", "Last 6 Months"], ["inactive", "Inactive (>6 mo)"]] as [LastVisitFilter, string][]).map(([val, label]) => (
                      <label key={val} onClick={e => { e.preventDefault(); setFilterLastVisit(filterLastVisit === val ? null : val); setCurrentPage(1) }} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${filterLastVisit === val ? "border-[#4F46E5]" : "border-border hover:border-[#4F46E5]"}`}>{filterLastVisit === val && <div className="h-2 w-2 rounded-full bg-[#4F46E5]" />}</div>
                        <span className="text-[13px] font-medium text-muted-foreground">{label}</span>
                      </label>
                    ))}
                  </div>
                  {/* Reg Date */}
                  <div>
                    <p className="text-[12px] font-bold text-foreground mb-3">Registration Date</p>
                    <div className="space-y-2">
                      <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">From</label><input type="date" value={filterRegFrom} onChange={e => { setFilterRegFrom(e.target.value); setCurrentPage(1) }} className="w-full h-9 rounded-lg border border-border px-2 text-[12px] focus:outline-none focus:border-[#4F46E5] bg-background text-foreground" /></div>
                      <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">To</label><input type="date" value={filterRegTo} onChange={e => { setFilterRegTo(e.target.value); setCurrentPage(1) }} className="w-full h-9 rounded-lg border border-border px-2 text-[12px] focus:outline-none focus:border-[#4F46E5] bg-background text-foreground" /></div>
                    </div>
                    <button onClick={() => setIsFiltersOpen(false)} className="mt-3 w-full h-9 bg-[#4F46E5] text-white rounded-lg text-[13px] font-bold hover:bg-[#4338CA] transition-colors focus:outline-none">Apply Filters</button>
                  </div>
                </div>
              </div>
            )}

            {/* Cards / List */}
            {paginated.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-24 bg-card rounded-xl border border-border shadow-sm mb-6">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4"><UserPlus className="h-8 w-8 text-muted-foreground" /></div>
                <h3 className="text-[16px] font-black text-foreground mb-1">No Customers Found</h3>
                <p className="text-[13px] text-muted-foreground">Adjust filters or add a new customer.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                {paginated.map(c => (
                  <div key={c.id} className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md hover:border-[#4F46E5]/30 transition-all group flex flex-col items-center text-center">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center text-[#000] text-[20px] dark:text-slate-300 font-black mb-4 shadow-sm ${getAvatarColor(c.id)}`}>{getInitials(c.name)}</div>
                    <div className="flex flex-wrap items-center justify-center gap-1.5 mb-1">
                      <h2 className="text-[15px] font-bold text-foreground">{c.name}</h2>
                      {c.type === "VIP" && <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-full border border-amber-500/20">VIP</span>}
                      {c.type === "Corporate" && <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold rounded-full border border-indigo-500/20">Corporate</span>}
                      {c.type === "New" && <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full border border-green-500/20">New</span>}
                      {c.tags?.filter((t: string) => t !== c.type).slice(0, 2).map((t: string) => (
                        <span key={t} className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[9px] font-black rounded-md border border-border uppercase tracking-tighter">{t}</span>
                      ))}
                      {c.tags?.length > 3 && <span className="text-[9px] font-bold text-muted-foreground">+{c.tags.length - 2}</span>}
                    </div>

                    <div className="w-full space-y-1.5 mb-4 text-left border-b border-border pb-4">
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground"><Mail className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{c.email}</span></div>
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground"><Phone className="h-3.5 w-3.5 shrink-0" />{c.phone}</div>
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground"><MapPin className="h-3.5 w-3.5 shrink-0" />{c.location}</div>
                    </div>
                    <div className="flex items-center justify-between w-full mb-4">
                      <div className="flex flex-col items-center flex-1"><span className="text-[17px] font-black text-foreground">{c.repairs}</span><span className="text-[10px] text-muted-foreground font-bold tracking-wider">REPAIRS</span></div>
                      {user?.role !== 'TECHNICIAN' && (
                        <>
                          <div className="h-8 w-px bg-border" />
                          <div className="flex flex-col items-center flex-1"><span className="text-[17px] font-black text-foreground">{formatSpent(c.spentRaw)}</span><span className="text-[10px] text-muted-foreground font-bold tracking-wider">SPENT</span></div>
                        </>
                      )}
                      <div className="h-8 w-px bg-border" />
                      <div className="flex flex-col items-center flex-1"><span className="text-[17px] font-black text-foreground">{visitLabel(c.lastVisitDays)}</span><span className="text-[10px] text-muted-foreground font-bold tracking-wider">LAST VISIT</span></div>
                    </div>
                    <Link href={`/admin/customers/${c.id}`} className="w-full h-9 rounded-lg border border-border bg-card text-[13px] font-bold text-foreground hover:bg-muted transition-colors focus:outline-none shadow-sm mb-3 flex items-center justify-center">{mounted ? t('customers.viewProfile') : 'View Profile'}</Link>
                    <div className="flex items-center justify-center gap-2">
                      {(["Phone", "Mail", "SMS"] as const).map(t => (
                        <button key={t} onClick={() => setCommModal({ type: t, customer: c })} className="h-8 w-10 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-[#4F46E5] hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF] dark:hover:bg-[#4F46E5]/10 transition-all focus:outline-none">
                          {t === "Phone" ? <Phone className="h-4 w-4" /> : t === "Mail" ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border shadow-sm mb-6 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider text-center">Type</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider text-center">Repairs</th>
                    {user?.role !== 'TECHNICIAN' && <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider text-right">Spent</th>}
                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {paginated.map(c => (
                      <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4"><div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center text-[#000] text-[12px] font-black shrink-0 ${getAvatarColor(c.id)}`}>{getInitials(c.name)}</div>
                          <div><div className="text-[14px] font-bold text-foreground">{c.name}</div><div className="text-[12px] text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{c.location}</div></div>
                        </div></td>
                        <td className="px-6 py-4"><div className="text-[12px] text-muted-foreground font-medium space-y-0.5"><div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{c.email}</div><div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{c.phone}</div></div></td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${c.type === "VIP" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                              c.type === "Corporate" ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" :
                                c.type === "New" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                  "bg-muted text-muted-foreground border-border"
                            }`}>{c.type}</span>

                        </td>
                        <td className="px-6 py-4 text-center"><span className="font-bold text-foreground">{c.repairs}</span></td>
                        {user?.role !== 'TECHNICIAN' && <td className="px-6 py-4 text-right"><span className="font-bold text-[#10B981]">{formatSpent(c.spentRaw)}</span></td>}
                        <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-1.5">
                          <Link href={`/admin/customers/${c.id}`} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted transition-colors"><Mail className="h-3.5 w-3.5" /></Link>
                          {(["Phone", "SMS"] as const).map(t => <button key={t} onClick={() => setCommModal({ type: t, customer: c })} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted transition-colors">{t === "Phone" ? <Phone className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}</button>)}
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-border">
              <span className="text-[13px] text-muted-foreground font-medium">{mounted ? t('customers.showing') : 'Showing'} <span className="font-bold text-foreground">{filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)}</span> {mounted ? t('customers.of') : 'of'} <span className="font-bold text-foreground">{filtered.length}</span> {mounted ? t('customers.total') : 'customers'}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center h-8 px-3 text-[13px] font-semibold text-muted-foreground dark:text-white hover:bg-muted rounded disabled:opacity-40 focus:outline-none"><ChevronLeft className="h-4 w-4 mr-1" />Previous</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).reduce((acc, p, i, arr) => {
                  if (i > 0 && arr[i - 1] !== p - 1) acc.push(-1); acc.push(p); return acc
                }, [] as number[]).map((p, i) => p === -1 ? <span key={`e${i}`} className="px-1 text-muted-foreground font-bold text-[13px]">…</span> : (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`h-8 w-8 rounded text-[13px] font-semibold flex items-center justify-center focus:outline-none transition-colors ${currentPage === p ? "bg-[#4F46E5] text-white shadow-sm" : "text-foreground hover:bg-muted border border-border bg-card"}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex items-center h-8 px-3 text-[13px] font-semibold text-foreground hover:bg-muted rounded border border-border bg-card dark:text-white disabled:opacity-40 focus:outline-none">Next<ChevronRight className="h-4 w-4 ml-1" /></button>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                Show: <select value={perPage} onChange={e => { setPerPage(+e.target.value); setCurrentPage(1) }} className="h-8 px-2 rounded border border-border bg-card text-foreground font-bold focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"><option value={6}>6</option><option value={12}>12</option><option value={24}>24</option></select> per page
              </div>
            </div>

          </div>
          <DashboardFooter />
        </main>
      </div>

      {/* ADD CUSTOMER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-[560px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/30">
              <h2 className="text-[18px] font-black text-foreground flex items-center gap-2"><UserPlus className="h-5 w-5 text-[#4F46E5]" />{mounted ? t('customers.addCustomerTitle', 'Add New Customer') : 'Add New Customer'}</h2>
              <button onClick={() => setShowAddModal(false)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-foreground mb-1.5">{mounted ? t('customers.fullName', 'Full Name *') : 'Full Name *'}</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sarah Anderson" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-background text-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-foreground mb-1.5">{mounted ? t('customers.email', 'Email') : 'Email'}</label><input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} type="email" placeholder="email@example.com" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-background text-foreground" /></div>
                <div><label className="block text-[12px] font-bold text-foreground mb-1.5">{mounted ? t('customers.phone', 'Phone *') : 'Phone *'}</label><input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+94 77 ..." className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-background text-foreground" /></div>
              </div>
              <div><label className="block text-[12px] font-bold text-foreground mb-1.5">{mounted ? t('customers.address', 'Address') : 'Address'}</label><input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="City, Sri Lanka" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-background text-foreground" /></div>
              <div><label className="block text-[12px] font-bold text-foreground mb-2">Customer Role / Tier</label>
                <div className="flex flex-wrap gap-2">
                  {liveRoles.map((role: any) => (
                    <label
                      key={role.id}
                      onClick={e => { e.preventDefault(); setForm(p => ({ ...p, tier: role.name })) }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-[12px] font-bold transition-all ${form.tier === role.name ? "bg-primary/10 border-primary text-primary ring-1 ring-primary/10" : "border-border text-muted-foreground hover:bg-muted bg-card"}`}
                    >
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: role.color || '#4F46E5' }} />
                      {role.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-border">
                <button onClick={() => setShowAddModal(false)} className="flex-1 h-11 rounded-xl border border-border bg-card text-foreground font-bold hover:bg-muted transition-colors focus:outline-none">{mounted ? t('customers.cancel', 'Cancel') : 'Cancel'}</button>
                <button onClick={handleAddCustomer} disabled={!form.name || !form.phone} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none disabled:opacity-50">{mounted ? t('customers.saveCustomer', 'Save Customer') : 'Save Customer'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMMUNICATION MODAL */}
      {commModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-[460px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">{commModal.type === "Phone" ? <Phone className="h-5 w-5" /> : commModal.type === "Mail" ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}</div>
                <div><h2 className="text-[16px] font-black text-foreground">{commModal.type === "Phone" ? "Initiate Call" : commModal.type === "Mail" ? "Send Email" : "Send SMS"}</h2><p className="text-[12px] font-bold text-[#4F46E5]">To: {commModal.customer.name}</p></div>
              </div>
              <button onClick={() => setCommModal(null)} className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <div className="bg-muted/30 border border-border rounded-xl p-4 mb-5 flex items-center justify-between">
                <span className="text-[12px] font-bold text-muted-foreground">{commModal.type === "Mail" ? "Email" : "Phone"}</span>
                <span className="text-[14px] font-black text-foreground">{commModal.type === "Mail" ? commModal.customer.email : commModal.customer.phone}</span>
              </div>
              {commModal.type !== "Phone" && <textarea rows={4} placeholder={`Write your ${commModal.type} message...`} className="w-full p-4 rounded-xl border border-border text-[13px] bg-background text-foreground focus:outline-none focus:border-[#4F46E5] resize-none mb-5" />}
              <div className="flex gap-3">
                <button onClick={() => setCommModal(null)} className="flex-1 h-11 rounded-xl border border-border bg-card text-foreground font-bold hover:bg-muted focus:outline-none">Cancel</button>
                <button onClick={() => setCommModal(null)} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md focus:outline-none">{commModal.type === "Phone" ? "Dial Number" : "Send Message"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

