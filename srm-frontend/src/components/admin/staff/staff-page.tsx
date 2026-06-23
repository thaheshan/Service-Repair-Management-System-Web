"use client"

import { useState, useMemo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight, Plus, X, Shield, Star, Trash2, Edit2, Check, FileDown, Loader2, UserPlus, Calendar as CalendarIcon, Grid, List as ListIcon, Eye, EyeOff } from "lucide-react"
import { INITIAL_STAFF, StaffMember, StaffRole, StaffStatus, Specialty, ROLES, SPECIALTIES, STATUSES, BRANCHES, ROLE_COLOR, STATUS_DOT, STATUS_BADGE, getInitials, getAvatarBg, UNASSIGNED_REPAIRS } from "@/app/admin/staff/staff-data"

type SortKey = "name-az" | "name-za" | "rating-desc" | "rating-asc" | "jobs-desc" | "jobs-asc" | "newest" | "oldest"
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name-az", label: "Name (A–Z)" },
  { value: "name-za", label: "Name (Z–A)" },
  { value: "rating-desc", label: "Highest Rating" },
  { value: "rating-asc", label: "Lowest Rating" },
  { value: "jobs-desc", label: "Most Active Jobs" },
  { value: "jobs-asc", label: "Fewest Active Jobs" },
  { value: "newest", label: "Newest Joined" },
  { value: "oldest", label: "Longest Serving" },
]

interface Role { id: number; name: string; color: string; desc: string }
const INIT_ROLES: Role[] = [
  { id: 1, name: "Super Admin", color: "#E11D48", desc: "Full system access including billing and branches." },
  { id: 2, name: "Senior Technician", color: "#4F46E5", desc: "Can manage and reassign all repair tasks." },
  { id: 3, name: "Junior Technician", color: "#059669", desc: "Can view assigned tasks and log time." },
]

const colors = ["bg-[#4F46E5]", "bg-[#F59E0B]", "bg-[#10B981]", "bg-[#6366F1]", "bg-[#EF4444]"];

import { 
  useGetStaffListQuery, 
  useCreateStaffMutation, 
  useUpdateStaffMutation, 
  useDeleteStaffMutation,
  useGetStaffRolesQuery,
  useAddStaffRoleMutation,
  useUpdateStaffRoleMutation,
  useDeleteStaffRoleMutation
} from "@/services/api/staffApiSlice"
import { useGetRepairsQuery, useUpdateRepairStatusMutation } from "@/services/api/repairsApiSlice"
import { toast } from "sonner"

export default function StaffManagementPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: response, isLoading } = useGetStaffListQuery({});
  const [createStaff] = useCreateStaffMutation();
  const [updateStaff] = useUpdateStaffMutation();
  const [deleteStaffMutation] = useDeleteStaffMutation();

  const { data: rolesResponse } = useGetStaffRolesQuery({})
  const roles = useMemo(() => rolesResponse?.data || INIT_ROLES, [rolesResponse])
  
  const [addRole] = useAddStaffRoleMutation()
  const [updateRole] = useUpdateStaffRoleMutation()
  const [deleteRole] = useDeleteStaffRoleMutation()

  const staff = useMemo(() => {
    const apiStaff = response?.staff || [];
    return apiStaff.map((s: any, index: number) => {
      const roleObj = roles.find(r => r.name === s.role);
      return {
        id: s.id || s.staffId || `staff-${index}`,
        firstName: s.name ? s.name.split(' ')[0] : (s.email?.split('@')[0] || "Unknown"),
        lastName: s.name && s.name.includes(' ') ? s.name.split(' ').slice(1).join(' ') : "",
        email: s.email || "",
        phone: s.phone || "N/A",
        role: s.role,
        roleColor: roleObj?.color,
        branch: "Main Branch",
        specialties: s.specialties || ["Mobile Phones"],
        rating: 4.8,
        activeJobs: s.assignedRepairs ? s.assignedRepairs.length : 0,
        weekJobs: 0,
        status: s.isActive ? "Available" : "Off Duty",
        joinedAt: s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        avatar: undefined
      };
    });
  }, [response, roles]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
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
  const [editStaff, setEditStaff] = useState<StaffMember | null>(null)
  const [deleteStaff, setDeleteStaff] = useState<StaffMember | null>(null)
  const [assignStaff, setAssignStaff] = useState<StaffMember | null>(null)

  const [showRolesModal, setShowRolesModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [newRoleModal, setNewRoleModal] = useState(false)
  const [newRole, setNewRole] = useState({ name: "", color: "#4F46E5", description: "" })

  const { data: repairsData } = useGetRepairsQuery({});
  const unassignedRepairs = useMemo(() => {
    const allRepairs = repairsData?.data || [];
    return allRepairs.filter((r: any) => !r.technicianId || r.technicianId === "");
  }, [repairsData]);

  const [updateRepairStatus] = useUpdateRepairStatusMutation();
  const [assignRepairId, setAssignRepairId] = useState("");

  // Add form
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "Technician" as StaffRole, branch: "Main Branch", specialties: [] as Specialty[], status: "Available" as StaffStatus })
  const [showPassword, setShowPassword] = useState(false)

  const toggle = <T extends string>(val: T, arr: T[], set: (f: (p: T[]) => T[]) => void) =>
    set(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val])

  const clearFilters = () => { setFilterRoles([]); setFilterStatuses([]); setFilterSpecialties([]); setFilterBranch(""); setFilterMinRating(0); setCurrentPage(1) }

  const filtered = useMemo(() => {
    let r = staff
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter(s => (`${s.firstName} ${s.lastName}`).toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.specialties.join(" ").toLowerCase().includes(q)) }
    if (filterRoles.length) r = r.filter(s => filterRoles.includes(s.role))
    if (filterStatuses.length) r = r.filter(s => filterStatuses.includes(s.status))
    if (filterSpecialties.length) r = r.filter(s => filterSpecialties.some(sp => s.specialties.includes(sp)))
    if (filterBranch) r = r.filter(s => s.branch === filterBranch)
    if (filterMinRating > 0) r = r.filter(s => s.rating >= filterMinRating)
    return [...r].sort((a, b) => {
      const na = `${a.firstName} ${a.lastName}`, nb = `${b.firstName} ${b.lastName}`
      if (sortKey === "name-az") return na.localeCompare(nb)
      if (sortKey === "name-za") return nb.localeCompare(na)
      if (sortKey === "rating-desc") return b.rating - a.rating
      if (sortKey === "rating-asc") return a.rating - b.rating
      if (sortKey === "jobs-desc") return b.activeJobs - a.activeJobs
      if (sortKey === "jobs-asc") return a.activeJobs - b.activeJobs
      if (sortKey === "newest") return b.joinedAt.localeCompare(a.joinedAt)
      if (sortKey === "oldest") return a.joinedAt.localeCompare(b.joinedAt)
      return 0
    })
  }, [staff, search, filterRoles, filterStatuses, filterSpecialties, filterBranch, filterMinRating, sortKey])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.password) return
    const roleMap: Record<string, string> = {
      "Lead Technician": "ADMIN",
      "Senior Technician": "MANAGER",
      "Technician": "TECHNICIAN",
      "Junior Technician": "TECHNICIAN",
      "Manager": "MANAGER",
      "Receptionist": "RECEPTIONIST"
    };

    try {
      await createStaff({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: roleMap[form.role] || "TECHNICIAN",
        specialties: form.specialties
      }).unwrap()
      setShowAddModal(false)
      setShowPassword(false)
      setForm({ name: "", email: "", phone: "", password: "", role: "Technician", branch: "Main Branch", specialties: [], status: "Available" })
      toast.success("Staff member added successfully!");
    } catch (err) {
      console.error("Failed to add staff:", err);
      toast.error("Failed to add staff member.");
    }
  }

  const handleExportCSV = () => {
    const rows = [["Name", "Email", "Phone", "Role", "Branch", "Status", "Rating", "Active Jobs", "Week Jobs", "Joined"],
    ...filtered.map(s => [`${s.firstName} ${s.lastName}`, s.email, s.phone, s.role, s.branch, s.status, s.rating, s.activeJobs, s.weekJobs, s.joinedAt])]
    const csv = rows.map(r => r.join(",")).join("\n")
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "staff.csv"; a.click()
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const { jsPDF } = await import("jspdf"); const { default: autoTable } = await import("jspdf-autotable")
      const doc = new jsPDF({ orientation: "landscape" })
      doc.setFillColor(79, 70, 229); doc.rect(0, 0, 297, 16, "F")
      doc.setTextColor(255, 255, 255); doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("Staff Report", 14, 11)
      doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.text(`Generated: ${new Date().toLocaleString()}`, 210, 11); doc.setTextColor(30, 30, 30)
      autoTable(doc, { startY: 20, head: [["Name", "Email", "Phone", "Role", "Branch", "Status", "Rating", "Active Jobs"]], body: filtered.map(s => [`${s.firstName} ${s.lastName}`, s.email, s.phone, s.role, s.branch, s.status, s.rating, s.activeJobs]), headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold", fontSize: 8 }, bodyStyles: { fontSize: 8, cellPadding: 3 }, alternateRowStyles: { fillColor: [245, 247, 255] } })
      doc.save(`staff_${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (e) { alert("Export failed") } finally { setIsExporting(false) }
  }

  const hasFilters = filterRoles.length || filterStatuses.length || filterSpecialties.length || filterBranch || filterMinRating > 0

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        <DashboardHeader />
        <main className="flex-1 flex flex-col overflow-y-auto" onClick={() => { setShowSortMenu(false); setShowExportMenu(false) }}>
          <div className="w-full max-w-[1280px] px-4 lg:px-8 py-6 lg:py-8 mx-auto flex flex-col flex-1">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-4">
              <Link href="/admin/dashboard" className="text-[#4F46E5] hover:underline">Dashboard</Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              <span className="text-foreground">{mounted ? t('staffPage.title') : 'Staff Management'}</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-[26px] font-black text-foreground tracking-tight">{mounted ? t('staffPage.title') : 'Staff Management'}</h1>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[13px] font-bold">{filtered.length} Members</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button onClick={e => { e.stopPropagation(); setShowRolesModal(true) }} className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-border bg-card text-[13px] font-bold text-foreground hover:bg-muted shadow-sm focus:outline-none">
                  <Shield className="h-4 w-4 text-muted-foreground" /> Manage Roles
                </button>
                {/* Export */}
                <div className="relative flex-1 sm:flex-none">
                  <button onClick={e => { e.stopPropagation(); setShowExportMenu(p => !p); setShowSortMenu(false) }} className="w-full flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-border bg-card text-[13px] font-semibold text-foreground hover:bg-muted shadow-sm focus:outline-none">
                    {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4 text-muted-foreground" />} Export <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  {showExportMenu && (
                    <div className="absolute top-12 right-0 w-44 bg-card border border-border rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                      <button onClick={e => { e.stopPropagation(); handleExportPDF(); setShowExportMenu(false) }} className="w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center gap-2"><FileDown className="h-4 w-4 text-primary" />Export as PDF</button>
                      <button onClick={e => { e.stopPropagation(); handleExportCSV(); setShowExportMenu(false) }} className="w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center gap-2"><FileDown className="h-4 w-4 text-emerald-500" />Export as CSV</button>
                    </div>
                  )}
                </div>
                <button onClick={() => setShowAddModal(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-[#4F46E5] text-[13px] font-bold text-white hover:bg-[#4338CA] shadow-sm focus:outline-none">
                  <Plus className="h-4 w-4" /> {mounted ? t('staffPage.addStaff') : 'Add Staff'}
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }} type="text" placeholder="Search name, role, specialty..." className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-card text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm placeholder:text-muted-foreground/70" />
              </div>

              {/* Sort */}
              <div className="relative">
                <button onClick={e => { e.stopPropagation(); setShowSortMenu(p => !p); setShowExportMenu(false) }} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[12px] font-medium text-muted-foreground hover:bg-muted shadow-sm focus:outline-none">
                  Sort: {SORT_OPTIONS.find(s => s.value === sortKey)?.label} <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {showSortMenu && (
                  <div className="absolute top-12 left-0 w-52 bg-card border border-border rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    {SORT_OPTIONS.map(o => (
                      <button key={o.value} onClick={e => { e.stopPropagation(); setSortKey(o.value); setShowSortMenu(false); setCurrentPage(1) }} className={`w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center justify-between ${sortKey === o.value ? "text-primary" : "text-foreground"}`}>
                        {o.label}{sortKey === o.value && <Check className="h-3.5 w-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filters */}
              <button onClick={() => setIsFiltersOpen(p => !p)} className={`flex items-center gap-2 h-10 px-5 rounded-lg border font-bold text-[13px] focus:outline-none shadow-sm transition-colors ${isFiltersOpen ? "bg-primary/10 text-primary border-primary/30" : "bg-card text-foreground border-border hover:bg-muted"}`}>
                <Filter className={`h-4 w-4 ${isFiltersOpen ? "text-primary" : "text-muted-foreground"}`} /> Filters
                {hasFilters ? <span className="h-5 w-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">!</span> : null}
              </button>

            {/* View toggle */}
            <div className="flex items-center bg-card border border-border rounded-lg p-1 shadow-sm ml-auto">
              <button onClick={() => setViewMode("grid")} className={`h-8 w-9 rounded-md flex items-center justify-center transition-colors focus:outline-none ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}><Grid className="h-4 w-4" /></button>
              <button onClick={() => setViewMode("list")} className={`h-8 w-9 rounded-md flex items-center justify-center transition-colors focus:outline-none ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}><ListIcon className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Filter Panel */}
          {isFiltersOpen && (
            <div className="mb-5 bg-card border border-border rounded-xl shadow-md p-6 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-bold text-foreground">Filters</h3>
                <button onClick={clearFilters} className="text-[12px] font-bold text-primary hover:underline focus:outline-none">Clear All</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                <div>
                  <p className="text-[12px] font-bold text-foreground mb-3">Role</p>
                    {ROLES.map(r => (
                      <label key={r} onClick={e => { e.preventDefault(); toggle(r, filterRoles, setFilterRoles as any); setCurrentPage(1) }} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <div className={`h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors ${filterRoles.includes(r) ? "bg-[#4F46E5] border-[#4F46E5]" : "border-border hover:border-[#4F46E5]"}`}>{filterRoles.includes(r) && <Check className="h-3 w-3 text-white" strokeWidth={3} />}</div>
                        <span className="text-[12px] font-medium text-muted-foreground">{r}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">Status</p>
                    {STATUSES.map(s => (
                      <label key={s} onClick={e => { e.preventDefault(); toggle(s, filterStatuses, setFilterStatuses as any); setCurrentPage(1) }} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <div className={`h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors ${filterStatuses.includes(s) ? "bg-[#4F46E5] border-[#4F46E5]" : "border-border hover:border-[#4F46E5]"}`}>{filterStatuses.includes(s) && <Check className="h-3 w-3 text-white" strokeWidth={3} />}</div>
                        <span className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground"><span className={`h-2 w-2 rounded-full ${STATUS_DOT[s]}`} />{s}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">Specialty</p>
                    {SPECIALTIES.map(sp => (
                      <label key={sp} onClick={e => { e.preventDefault(); toggle(sp, filterSpecialties, setFilterSpecialties as any); setCurrentPage(1) }} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <div className={`h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors ${filterSpecialties.includes(sp) ? "bg-[#4F46E5] border-[#4F46E5]" : "border-border hover:border-[#4F46E5]"}`}>{filterSpecialties.includes(sp) && <Check className="h-3 w-3 text-white" strokeWidth={3} />}</div>
                        <span className="text-[12px] font-medium text-muted-foreground">{sp}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">Branch</p>
                    <select value={filterBranch} onChange={e => { setFilterBranch(e.target.value); setCurrentPage(1) }} className="w-full h-9 rounded-lg border border-border px-2 text-[12px] focus:outline-none focus:border-[#4F46E5] bg-white">
                      <option value="">All Branches</option>
                      {BRANCHES.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3"><p className="text-[12px] font-bold text-[#0F172A]">Min Rating</p><span className="text-[12px] text-[#4F46E5] font-bold">≥ {filterMinRating === 0 ? "Any" : filterMinRating.toFixed(1)}</span></div>
                    <input type="range" min={0} max={5} step={0.1} value={filterMinRating} onChange={e => { setFilterMinRating(+e.target.value); setCurrentPage(1) }} className="w-full h-1.5 bg-[#E2E8F0] rounded-full accent-[#4F46E5] cursor-pointer" />
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground mt-1"><span>Any</span><span>5.0</span></div>
                    <button onClick={() => setIsFiltersOpen(false)} className="mt-4 w-full h-9 bg-[#4F46E5] text-white rounded-lg text-[13px] font-bold hover:bg-[#4338CA] focus:outline-none">Apply Filters</button>
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            {paginated.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-24 bg-card rounded-xl border border-border shadow-sm mb-6">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4"><Shield className="h-8 w-8 text-muted-foreground" /></div>
                <h3 className="text-[16px] font-black text-foreground mb-1">No Staff Found</h3>
                <p className="text-[13px] text-muted-foreground">Adjust filters or add a new staff member.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
                {paginated.map(s => (
                  <div key={s.id} className="group flex flex-col bg-card rounded-2xl shadow-sm border border-border hover:shadow-md hover:border-primary/30 transition-all p-6 relative">
                    {/* Status badge */}
                    <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${STATUS_BADGE[s.status]}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s.status]}`} />{s.status}
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
                            {getInitials(s.firstName, s.lastName)}
                          </div>
                        )}
                        <span className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white ${STATUS_DOT[s.status]}`} />
                      </div>
                      <h2 className="text-[15px] font-black text-foreground mb-0.5">{s.firstName} {s.lastName}</h2>
                      <p className={`text-[12px] font-bold ${!s.roleColor ? ROLE_COLOR[s.role] : ""}`} style={s.roleColor ? { color: s.roleColor } : {}}>{s.role}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{s.branch}</p>
                    </div>
                    {/* Stats */}
                    <div className="flex items-center justify-center gap-4 mb-4 text-[11px] font-bold text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" />{s.activeJobs} Active</span>
                      <span className="h-3 w-px bg-border" />
                      <span className="flex items-center gap-1 text-foreground"><Star className="h-3.5 w-3.5 text-[#F59E0B] fill-[#F59E0B]" />{s.rating.toFixed(1)}</span>
                      <span className="h-3 w-px bg-border" />
                      <span>{s.weekJobs}/wk</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground text-center mb-4 truncate">{s.specialties.join(", ")}</div>
                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => setEditStaff({ ...s })} className="flex-1 h-9 rounded-lg border border-border bg-card text-[12px] font-bold text-foreground hover:bg-muted focus:outline-none transition-colors">Edit</button>
                      <button onClick={() => setAssignStaff(s)} className="flex-[1.5] h-9 rounded-lg bg-primary text-[12px] font-bold text-white hover:bg-primary/90 focus:outline-none">Assign Repair</button>
                      <button onClick={() => setDeleteStaff(s)} className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 focus:outline-none transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border shadow-sm mb-6 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-muted/30 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-4">Team Member</th>
                    <th className="px-6 py-4">Role & Specialties</th>
                    <th className="px-6 py-4">Branch</th>
                    <th className="px-6 py-4 text-center">Rating</th>
                    <th className="px-6 py-4 text-center">Active</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {paginated.map(s => (
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
                              {getInitials(s.firstName, s.lastName)}
                            </div>
                          )}
                          <div><p className="text-[13px] font-bold text-foreground">{s.firstName} {s.lastName}</p><p className="text-[11px] text-muted-foreground">{s.email}</p></div>
                        </div></td>
                        <td className="px-6 py-4"><p className={`text-[12px] font-bold ${!s.roleColor ? (ROLE_COLOR[s.role] || "text-[#4F46E5]") : ""}`} style={s.roleColor ? { color: s.roleColor } : {}}>{s.role}</p><p className="text-[11px] text-muted-foreground truncate max-w-[180px]">{s.specialties.join(", ")}</p></td>
                        <td className="px-6 py-4 text-[12px] text-muted-foreground font-medium">{s.branch}</td>
                        <td className="px-6 py-4 text-center"><span className="flex items-center justify-center gap-1 font-bold text-[13px]"><Star className="h-3.5 w-3.5 text-[#F59E0B] fill-[#F59E0B]" />{s.rating.toFixed(1)}</span></td>
                        <td className="px-6 py-4 text-center"><span className="text-[15px] font-black text-primary">{s.activeJobs}</span></td>
                        <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold ${STATUS_BADGE[s.status]}`}><span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s.status]}`} strokeWidth={3} />{s.status}</span></td>
                        <td className="px-6 py-4 text-center"><div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => setAssignStaff(s)} className="px-3 py-1.5 rounded-lg bg-primary text-[11px] font-bold text-white hover:bg-primary/90 focus:outline-none">Assign</button>
                          <button onClick={() => setEditStaff({ ...s })} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted focus:outline-none"><Edit2 className="h-3.5 w-3.5" /></button>
                          <button onClick={() => setDeleteStaff(s)} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 focus:outline-none"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-border">
              <span className="text-[13px] text-muted-foreground font-medium">Showing <span className="font-bold text-foreground">{filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)}</span> of <span className="font-bold text-foreground">{filtered.length}</span> members</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center h-8 px-3 text-[13px] font-semibold text-muted-foreground hover:bg-muted rounded disabled:opacity-40 focus:outline-none"><ChevronLeft className="h-4 w-4 mr-1" />Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).reduce((acc, p, i, arr) => { if (i > 0 && arr[i - 1] !== p - 1) acc.push(-1); acc.push(p); return acc }, [] as number[]).map((p, i) => p === -1 ? <span key={`e${i}`} className="px-1 text-muted-foreground">…</span> : (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`h-8 w-8 rounded text-[13px] font-semibold flex items-center justify-center focus:outline-none transition-colors ${currentPage === p ? "bg-primary text-white shadow-sm" : "text-foreground hover:bg-muted border border-border bg-card"}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex items-center h-8 px-3 text-[13px] font-semibold text-foreground hover:bg-muted rounded border border-border bg-card disabled:opacity-40 focus:outline-none">Next<ChevronRight className="h-4 w-4 ml-1" /></button>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                Show: <select value={perPage} onChange={e => { setPerPage(+e.target.value); setCurrentPage(1) }} className="h-8 px-2 rounded border border-border bg-card text-foreground font-bold focus:outline-none focus:ring-1 focus:ring-primary"><option value={8}>8</option><option value={12}>12</option><option value={16}>16</option><option value={24}>24</option></select> per page
              </div>
            </div>
          </div>
          <DashboardFooter />
        </main>
      </div>

      {/* ADD STAFF MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
              <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2"><UserPlus className="h-5 w-5 text-[#4F46E5]" />{mounted ? t('staffPage.addStaffMember') : 'Add Staff Member'}</h2>
              <button onClick={() => setShowAddModal(false)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">{mounted ? t('staffPage.fullName') : 'Full Name *'}</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">{mounted ? t('staffPage.email') : 'Email *'}</label><input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} type="email" placeholder="john@srm.lk" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]" /></div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">{mounted ? t('staffPage.phone') : 'Phone'}</label><input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+94 77 ..." className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]" /></div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">{mounted ? t('staffPage.password') : 'Password *'}</label>
                <div className="relative">
                  <input 
                    value={form.password} 
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))} 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Min 8 characters" 
                    className="w-full h-10 rounded-lg border border-border pl-3 pr-10 text-[13px] focus:outline-none focus:border-[#4F46E5]" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">{mounted ? t('staffPage.role') : 'Role'}</label>
                  <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as StaffRole }))} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                    {roles.map(r => <option key={r.id || r.name} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">{mounted ? t('staffPage.branch') : 'Branch'}</label>
                  <select value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                    {BRANCHES.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-2">{mounted ? t('staffPage.specialties') : 'Specialties'}</label>
                <div className="grid grid-cols-2 gap-2">
                  {SPECIALTIES.map(sp => (
                    <label key={sp} onClick={e => { e.preventDefault(); setForm(p => ({ ...p, specialties: p.specialties.includes(sp) ? p.specialties.filter(x => x !== sp) : [...p.specialties, sp] })) }} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-[12px] font-medium transition-colors ${form.specialties.includes(sp) ? "bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]" : "border-border text-muted-foreground hover:bg-muted"}`}>
                      {form.specialties.includes(sp) && <Check className="h-3 w-3 shrink-0" />}{sp}
                    </label>
                  ))}
                </div>
              </div>
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-2">{mounted ? t('staffPage.initialStatus') : 'Initial Status'}</label>
                <div className="flex gap-2 flex-wrap">{STATUSES.map(s => (
                  <label key={s} onClick={e => { e.preventDefault(); setForm(p => ({ ...p, status: s })) }} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-[12px] font-semibold transition-colors ${form.status === s ? "bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]" : "border-border text-muted-foreground hover:bg-muted"}`}>
                    <span className={`h-2 w-2 rounded-full ${STATUS_DOT[s]}`} />{s}
                  </label>
                ))}</div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-border">
                <button onClick={() => setShowAddModal(false)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted focus:outline-none">{mounted ? t('staffPage.cancel') : 'Cancel'}</button>
                <button onClick={handleAdd} disabled={!form.name || !form.email || !form.password} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md focus:outline-none disabled:opacity-50">{mounted ? t('staffPage.saveStaffMember') : 'Save Staff Member'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {editStaff && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
              <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2"><Edit2 className="h-5 w-5 text-[#4F46E5]" />Edit Staff Member</h2>
              <button onClick={() => setEditStaff(null)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Full Name</label>
                <input value={editStaff.firstName + (editStaff.lastName ? " " + editStaff.lastName : "")} onChange={e => {
                  const val = e.target.value;
                  const parts = val.split(' ');
                  setEditStaff(p => p ? { ...p, firstName: parts[0], lastName: parts.slice(1).join(' ') } : p);
                }} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]" />
              </div>
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Email</label><input value={editStaff.email} onChange={e => setEditStaff(p => p ? { ...p, email: e.target.value } : p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Role</label>
                  <select value={editStaff.role} onChange={e => setEditStaff(p => p ? { ...p, role: e.target.value as StaffRole } : p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                    {roles.map(r => <option key={r.id || r.name} value={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Status</label>
                  <select value={editStaff.status} onChange={e => setEditStaff(p => p ? { ...p, status: e.target.value as StaffStatus } : p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Branch</label>
                <select value={editStaff.branch} onChange={e => setEditStaff(p => p ? { ...p, branch: e.target.value } : p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2 border-t border-border">
                <button onClick={() => setEditStaff(null)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted focus:outline-none">Cancel</button>
                <button onClick={async () => {
                  const roleMap: Record<string, string> = {
                    "Lead Technician": "ADMIN",
                    "Senior Technician": "MANAGER",
                    "Technician": "TECHNICIAN",
                    "Junior Technician": "TECHNICIAN",
                    "Manager": "MANAGER",
                    "Receptionist": "RECEPTIONIST"
                  };
                  try {
                    await updateStaff({
                      id: editStaff!.id,
                      name: editStaff!.firstName + (editStaff!.lastName ? " " + editStaff!.lastName : ""),
                      email: editStaff!.email,
                      phone: editStaff!.phone,
                      role: roleMap[editStaff!.role] || editStaff!.role,
                      isActive: editStaff!.status === "Available",
                      specialties: editStaff!.specialties
                    }).unwrap();
                    setEditStaff(null);
                    toast.success("Staff details updated!");
                  } catch (e) {
                    console.error(e);
                    toast.error("Failed to update staff.");
                  }
                }} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md focus:outline-none">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN REPAIR MODAL */}
      {assignStaff && (
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
                  {getInitials(assignStaff.firstName, assignStaff.lastName)}
                </div>
              )}
              <h2 className="text-[16px] font-black text-[#0F172A]">{assignStaff.firstName} {assignStaff.lastName}</h2>
              <p className={`text-[12px] font-bold ${ROLE_COLOR[assignStaff.role]} mt-0.5`}>{assignStaff.role}</p>
            </div>
            <div className="p-6">
              <label className="block text-[13px] font-bold text-[#0F172A] mb-2">Select Repair Task</label>
              <div className="relative mb-6">
                <select value={assignRepairId} onChange={e => setAssignRepairId(e.target.value)} className="w-full h-11 rounded-xl border border-border bg-white px-4 text-[13px] font-semibold focus:outline-none focus:border-[#4F46E5] appearance-none">
                  <option value="">Select a repair...</option>
                  {unassignedRepairs.map((r: any) => (
                    <option key={r.id} value={r.id}>
                      {r.reference} | {r.device?.brand} {r.device?.model} — {r.issue || "General Repair"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setAssignStaff(null)} className="flex-1 h-10 rounded-lg border border-border text-[#0F172A] font-bold text-[13px] hover:bg-muted focus:outline-none">Cancel</button>
                <button 
                  onClick={async () => {
                    if (!assignRepairId) {
                      toast.error("Please select a task");
                      return;
                    }
                    try {
                      await updateRepairStatus({ 
                        id: assignRepairId, 
                        technicianId: assignStaff!.id,
                        status: "IN_PROGRESS"
                      }).unwrap();
                      setAssignStaff(null);
                      setAssignRepairId("");
                      toast.success(`Task assigned to ${assignStaff!.firstName}!`);
                    } catch (e) {
                      toast.error("Failed to assign task");
                    }
                  }} 
                  className="flex-1 h-10 rounded-lg bg-[#4F46E5] text-white font-bold text-[13px] hover:bg-[#4338CA] shadow-sm focus:outline-none"
                >
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteStaff && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center shrink-0"><Trash2 className="h-6 w-6 text-red-500" /></div>
              <div><h2 className="text-[17px] font-black text-[#0F172A]">Remove Staff Member?</h2><p className="text-[13px] text-muted-foreground">This will remove <strong>{deleteStaff.firstName} {deleteStaff.lastName}</strong> from the system.</p></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteStaff(null)} className="flex-1 h-10 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted focus:outline-none">Cancel</button>
              <button onClick={async () => {
                try {
                  await deleteStaffMutation(deleteStaff!.id).unwrap();
                  setDeleteStaff(null);
                } catch (e) { console.error(e) }
              }} className="flex-1 h-10 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 focus:outline-none">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE ROLES MODAL */}
      {showRolesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
              <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2"><Shield className="h-5 w-5 text-[#4F46E5]" />{mounted ? t('staffPage.manageRoles') : 'Manage Staff Roles'}</h2>
              <button onClick={() => { setShowRolesModal(false); setEditingRole(null); setNewRoleModal(false) }} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4" /></button>
            </div>
            <div className="divide-y divide-border">
              {roles.map(role => editingRole?.id === role.id ? (
                <div key={role.id} className="p-5 bg-[#F8FAFC] space-y-3">
                  <input value={editingRole.name} onChange={e => setEditingRole(p => p ? { ...p, name: e.target.value } : p)} className="w-full h-9 rounded-lg border border-[#4F46E5] px-3 text-[13px] font-bold focus:outline-none" />
                  <input value={editingRole.desc} onChange={e => setEditingRole(p => p ? { ...p, desc: e.target.value } : p)} className="w-full h-9 rounded-lg border border-border px-3 text-[13px] focus:outline-none" />
                  <div className="flex items-center gap-2"><span className="text-[12px] font-bold text-muted-foreground">Color:</span><input type="color" value={editingRole.color} onChange={e => setEditingRole(p => p ? { ...p, color: e.target.value } : p)} className="h-8 w-12 rounded cursor-pointer border border-border" /></div>
                  <div className="flex gap-2">
                    <button onClick={async () => {
                      try {
                        await updateRole({ id: editingRole.id, name: editingRole.name, color: editingRole.color, description: editingRole.desc }).unwrap();
                        setEditingRole(null);
                        toast.success("Role updated!");
                      } catch (e) { toast.error("Failed to update role") }
                    }} className="flex-1 h-9 bg-[#4F46E5] text-white rounded-lg text-[13px] font-bold hover:bg-[#4338CA] focus:outline-none">Save</button>
                    <button onClick={() => setEditingRole(null)} className="flex-1 h-9 border border-border rounded-lg text-[13px] font-bold hover:bg-muted focus:outline-none">Cancel</button>
                  </div>
                </div>
              ) : (
                <div key={role.id} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div>
                    <h3 className="text-[14px] font-bold flex items-center gap-2 mb-0.5" style={{ color: role.color }}><span className="h-2 w-2 rounded-full inline-block" style={{ background: role.color }} />{role.name}</h3>
                    <p className="text-[12px] text-muted-foreground">{role.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingRole(role)} className="h-8 w-8 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted focus:outline-none"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button onClick={async () => {
                      try {
                        await deleteRole(role.id).unwrap();
                        toast.success("Role deleted!");
                      } catch (e) { toast.error("Failed to delete role") }
                    }} className="h-8 w-8 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 focus:outline-none"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-border bg-[#F8FAFC]">
              {newRoleModal ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F172A] mb-1.5">Role Name *</label>
                    <input type="text" value={newRole.name} onChange={e=>setNewRole({...newRole,name:e.target.value})} className="w-full h-11 rounded-xl border border-border px-4 text-[13px] focus:outline-none focus:border-[#4F46E5]" placeholder="e.g. Senior Technician"/>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F172A] mb-1.5">Role Description</label>
                    <textarea value={newRole.description} onChange={e=>setNewRole({...newRole,description:e.target.value})} className="w-full h-24 rounded-xl border border-border p-4 text-[13px] focus:outline-none focus:border-[#4F46E5] resize-none" placeholder="What can this role do?"/>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#0F172A] mb-1.5">Theme Color</label>
                    <div className="flex gap-3">
                      <input type="color" value={newRole.color} onChange={e=>setNewRole({...newRole,color:e.target.value})} className="h-11 w-11 rounded-lg border border-border p-1 bg-white cursor-pointer"/>
                      <input type="text" value={newRole.color} onChange={e=>setNewRole({...newRole,color:e.target.value})} className="flex-1 h-11 rounded-xl border border-border px-4 text-[13px] font-mono"/>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button onClick={()=>setNewRoleModal(false)} className="flex-1 h-11 rounded-xl border border-border text-[#0F172A] font-bold hover:bg-muted focus:outline-none">Cancel</button>
                    <button 
                      onClick={async ()=>{
                        if (!newRole.name) return;
                        try {
                          await addRole({ name: newRole.name, color: newRole.color, description: newRole.description }).unwrap();
                          setNewRoleModal(false);
                          setNewRole({ name: "", color: "#4F46E5", description: "" });
                          toast.success("New role created!");
                        } catch(e) { toast.error("Failed to create role") }
                      }} 
                      className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md focus:outline-none"
                    >
                      Create Role
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setNewRoleModal(true)} className="flex items-center gap-1.5 text-[13px] font-bold text-[#4F46E5] hover:underline focus:outline-none"><Plus className="h-4 w-4" />{mounted ? t('staffPage.createNewRole') : 'Create New Role'}</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
