"use client"
import { useState, useMemo, useRef } from "react"
import Link from "next/link"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import { Search, Filter, Plus, FileDown, ChevronDown, ChevronLeft, ChevronRight, Smartphone, Tablet, Laptop, Cpu, MoreVertical, Edit2, Trash2, Eye, Check, X, Loader2, CheckCircle2, Clock, Archive, Wrench, ShieldCheck, ShieldAlert, ShieldOff, Shield, Tag, PackageCheck, AlertCircle, ShoppingCart, ArrowUpRight } from "lucide-react"
import { Device, DeviceType, DeviceStatus, WarrantyStatus, DEVICE_ICON_COLOR, WARRANTY_STYLE, STATUS_STYLE, BRANDS } from "./device-data"
import { DeviceStatusUpdateModal } from "@/components/admin/devices/status-update-modal"
import { useDeviceStore } from "@/store/deviceStore"
import { useAuthStore } from "@/store/authStore"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { useEffect } from "react"

// Mapper API -> UI Device
const mapApiToDevice = (d: any): Device => ({
  id: d.id,
  name: d.name,
  brand: d.brand || "Unknown",
  type: (d.type || "Mobile Phone") as DeviceType,
  imei: d.imei || "N/A",
  color: d.color || "bg-[#4F46E5]",
  owner: d.owner || { name: "Guest", phone: "N/A" },
  warranty: d.warranty || { status: "No Warranty", expiryDate: "N/A" },
  totalRepairs: d.repairsCount || 0,
  lastService: d.lastService || { date: "", type: "" },
  registered: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "N/A",
  status: (d.status ? (d.status.charAt(0).toUpperCase() + d.status.slice(1).replace("_", " ")) : "Available") as DeviceStatus,
  price: d.price || 0
});

type SortKey = "name-az"|"name-za"|"repairs-desc"|"repairs-asc"|"brand-az"|"newest"|"oldest"
const SORT_OPTIONS: {value:SortKey;label:string}[] = [
  {value:"name-az",      label:"Name (A–Z)"},
  {value:"name-za",      label:"Name (Z–A)"},
  {value:"brand-az",     label:"Brand (A–Z)"},
  {value:"repairs-desc", label:"Most Repairs"},
  {value:"repairs-asc",  label:"Fewest Repairs"},
  {value:"newest",       label:"Newest Registered"},
  {value:"oldest",       label:"Oldest Registered"},
]

const TYPES: DeviceType[] = ["Mobile Phone","Tablet","Laptop","Console"]
const STATUSES: DeviceStatus[] = ["Available","In Review","Sold","Collected"]
const WARRANTIES: WarrantyStatus[] = ["Active","Expiring Soon","Expired","No Warranty"]

function DeviceIcon({type,className="h-6 w-6"}:{type:DeviceType;className?:string}) {
  if (type==="Tablet")  return <Tablet className={className}/>
  if (type==="Laptop")  return <Laptop className={className}/>
  if (type==="Console") return <Cpu className={className}/>
  return <Smartphone className={className}/>
}

function StatusIcon({s}:{s:DeviceStatus}) {
  if (s==="Available") return <CheckCircle2 className="h-3 w-3"/>
  if (s==="In Review") return <Eye className="h-3 w-3"/>
  if (s==="Sold")      return <Tag className="h-3 w-3"/>
  return <PackageCheck className="h-3 w-3"/>
}

function WarrantyIcon({w}:{w:WarrantyStatus}) {
  if (w==="Active")        return <ShieldCheck className="h-3 w-3"/>
  if (w==="Expiring Soon") return <ShieldAlert className="h-3 w-3"/>
  if (w==="Expired")       return <ShieldOff className="h-3 w-3"/>
  return <Shield className="h-3 w-3"/>
}

export default function DevicesPage() {
  const { items, isLoading, error, fetchItems, addItem, updateItem, deleteItem, updateStatus } = useDeviceStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const devices = useMemo(() => items.map(mapApiToDevice), [items])
  const [viewMode, setViewMode] = useState<"list"|"grid">("list")
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name-az")
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [isExporting, setIsExporting] = useState(false)

  // Filters
  const [filterTypes, setFilterTypes] = useState<DeviceType[]>([])
  const [filterStatuses, setFilterStatuses] = useState<DeviceStatus[]>([])
  const [filterWarranties, setFilterWarranties] = useState<WarrantyStatus[]>([])
  const [filterBrand, setFilterBrand] = useState("")
  const [filterRepairsMax, setFilterRepairsMax] = useState(10)
  const [filterRegFrom, setFilterRegFrom] = useState("")
  const [filterRegTo, setFilterRegTo] = useState("")

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [editDevice, setEditDevice] = useState<Device|null>(null)
  const [deleteDevice, setDeleteDevice] = useState<Device|null>(null)
  const [viewDevice, setViewDevice] = useState<Device|null>(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{id:string, status:DeviceStatus}|null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string|null>(null)
  const [form, setForm] = useState({name:"",brand:"Apple",type:"Mobile Phone" as DeviceType,imei:"",ownerName:"",ownerPhone:"",warrantyStatus:"Active" as WarrantyStatus,warrantyExpiry:"",status:"Available" as DeviceStatus,price:0})

  const hiddenDevicesReportRef = useRef<HTMLDivElement>(null)

  const handleDownloadPDF = async () => {
    setIsExporting(true)
    try {
      const element = hiddenDevicesReportRef.current
      if (!element) return

      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Robust Fix for "lab()" / "oklch()" color parsing errors
          const elements = clonedDoc.getElementsByTagName("*");
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            const style = window.getComputedStyle(el);
            
            const colorProps = ['color', 'backgroundColor', 'borderColor', 'outlineColor', 'textDecorationColor', 'stopColor', 'fill', 'stroke'];
            colorProps.forEach(prop => {
              const val = (style as any)[prop];
              if (val && (val.includes('oklch') || val.includes('lab') || val.includes('color-mix'))) {
                if (prop === 'backgroundColor') el.style.backgroundColor = '#ffffff';
                else if (prop === 'color') el.style.color = '#000000';
                else el.style[prop as any] = 'transparent';
              }
            });

            const shadow = style.boxShadow;
            if (shadow && (shadow.includes('oklch') || shadow.includes('lab') || shadow.includes('color-mix'))) {
              el.style.boxShadow = 'none';
            }
          }
        }
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Devices_Inventory_Report_${new Date().toISOString().slice(0,10)}.pdf`)
    } catch (err) {
      console.error("PDF generation failed:", err)
      alert("Error: Could not generate PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const toggleFilter = <T extends string>(val:T, arr:T[], setter:(f:(p:T[])=>T[])=>void) =>
    setter(p => p.includes(val) ? p.filter(x=>x!==val) : [...p,val])

  const clearFilters = () => {
    setFilterTypes([]); setFilterStatuses([]); setFilterWarranties([])
    setFilterBrand(""); setFilterRepairsMax(10); setFilterRegFrom(""); setFilterRegTo(""); setCurrentPage(1)
  }

  const filtered = useMemo(() => {
    let r = devices
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter(d => d.name.toLowerCase().includes(q)||d.brand.toLowerCase().includes(q)||d.imei.toLowerCase().includes(q)||d.owner.name.toLowerCase().includes(q))
    }
    if (filterTypes.length)     r = r.filter(d => filterTypes.includes(d.type))
    if (filterStatuses.length)  r = r.filter(d => filterStatuses.includes(d.status))
    if (filterWarranties.length)r = r.filter(d => filterWarranties.includes(d.warranty.status))
    if (filterBrand)            r = r.filter(d => d.brand === filterBrand)
    r = r.filter(d => d.totalRepairs <= filterRepairsMax)
    return [...r].sort((a,b) => {
      if (sortKey==="name-az")      return a.name.localeCompare(b.name)
      if (sortKey==="name-za")      return b.name.localeCompare(a.name)
      if (sortKey==="brand-az")     return a.brand.localeCompare(b.brand)
      if (sortKey==="repairs-desc") return b.totalRepairs - a.totalRepairs
      if (sortKey==="repairs-asc")  return a.totalRepairs - b.totalRepairs
      return 0
    })
  }, [devices, search, filterTypes, filterStatuses, filterWarranties, filterBrand, filterRepairsMax, sortKey])

  const totalPages = Math.max(1, Math.ceil(filtered.length/perPage))
  const paginated = filtered.slice((currentPage-1)*perPage, currentPage*perPage)

  const handleAdd = async () => {
    if (!form.name || !form.imei) return
    try {
      await addItem({
        name: form.name,
        brand: form.brand,
        type: form.type,
        imei: form.imei,
        ownerName: form.ownerName,
        ownerPhone: form.ownerPhone,
        warrantyStatus: form.warrantyStatus,
        warrantyExpiry: form.warrantyExpiry,
        status: form.status.toLowerCase().replace(" ", "_"),
        price: form.price,
        shopId: user?.shopId || ""
      } as any)
      setShowAddModal(false)
      setForm({name:"",brand:"Apple",type:"Mobile Phone",imei:"",ownerName:"",ownerPhone:"",warrantyStatus:"Active",warrantyExpiry:"",status:"Available",price:0})
    } catch (err) {
      console.error("Failed to add device", err)
    }
  }

  const handleStatusUpdate = async (autoNotify: boolean, newStatus: DeviceStatus) => {
    if (!pendingStatusUpdate) return
    try {
      await updateStatus(pendingStatusUpdate.id, newStatus.toLowerCase().replace(" ", "_"))
      setIsStatusModalOpen(false)
      setPendingStatusUpdate(null)
      setActiveDropdown(null)
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  const handleSaveEdit = async () => {
    if (!editDevice) return
    try {
      await updateItem(editDevice.id, {
        name: editDevice.name,
        status: editDevice.status.toLowerCase().replace(" ", "_"),
        // ... include other fields as needed
      } as any)
      setEditDevice(null)
    } catch (err) {
      console.error("Failed to edit device", err)
    }
  }

  const handleDelete = async () => {
    if (!deleteDevice) return
    try {
      await deleteItem(deleteDevice.id)
      setDeleteDevice(null)
    } catch (err) {
      console.error("Failed to delete device", err)
    }
  }

  const handleExportCSV = () => {
    const rows = [["Name","Brand","Type","IMEI","Owner","Phone","Warranty","Status","Repairs","Registered"],
      ...filtered.map(d=>[d.name,d.brand,d.type,d.imei,d.owner.name,d.owner.phone,d.warranty.status,d.status,d.totalRepairs,d.registered])]
    const csv = rows.map(r=>r.join(",")).join("\n")
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}))
    a.download="devices.csv"; a.click()
  }

  // (Note: handleDownloadPDF was implemented above with the high-fidelity render target)
  const handleExportPDF = handleDownloadPDF;

  const hasFilters = filterTypes.length||filterStatuses.length||filterWarranties.length||filterBrand||filterRepairsMax<10

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar/>
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        <DashboardHeader/>
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col flex-1">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-4">
              <Link href="/admin/dashboard" className="text-[#4F46E5] hover:underline">Dashboard</Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50"/>
              <span className="text-[#0F172A]">Devices Management</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-[26px] font-black text-[#0F172A] tracking-tight">Devices Management</h1>
                <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[13px] font-bold">{filtered.length} Devices</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Export */}
                <div className="relative">
                  <button onClick={()=>{setShowExportMenu(p=>!p);setShowSortMenu(false)}} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-semibold text-[#0F172A] hover:bg-muted shadow-sm focus:outline-none">
                    {isExporting?<Loader2 className="h-4 w-4 animate-spin"/>:<FileDown className="h-4 w-4 text-muted-foreground"/>} Export <ChevronDown className="h-3.5 w-3.5 text-muted-foreground"/>
                  </button>
                  {showExportMenu&&(
                    <div className="absolute top-12 right-0 w-44 bg-white border border-border rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                      <button onClick={()=>{handleExportPDF();setShowExportMenu(false)}} className="w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center gap-2"><FileDown className="h-4 w-4 text-[#4F46E5]"/>Export as PDF</button>
                      <button onClick={()=>{handleExportCSV();setShowExportMenu(false)}} className="w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center gap-2"><FileDown className="h-4 w-4 text-[#10B981]"/>Export as CSV</button>
                    </div>
                  )}
                </div>
                <button onClick={()=>setShowAddModal(true)} className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#4F46E5] text-[13px] font-bold text-white hover:bg-[#4338CA] shadow-sm transition-colors focus:outline-none">
                  <Plus className="h-4 w-4"/> Register Device
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <input value={search} onChange={e=>{setSearch(e.target.value);setCurrentPage(1)}} type="text" placeholder="Search device, IMEI, owner..." className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] shadow-sm placeholder:text-muted-foreground/70"/>
              </div>

              {/* Sort */}
              <div className="relative">
                <button onClick={()=>{setShowSortMenu(p=>!p);setShowExportMenu(false)}} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[12px] font-medium text-muted-foreground hover:bg-muted shadow-sm focus:outline-none">
                  Sort: {SORT_OPTIONS.find(s=>s.value===sortKey)?.label} <ChevronDown className="h-3.5 w-3.5"/>
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

              {/* Filter toggle */}
              <button onClick={()=>setIsFiltersOpen(p=>!p)} className={`flex items-center gap-2 h-10 px-5 rounded-lg border font-bold text-[13px] focus:outline-none shadow-sm transition-colors ${isFiltersOpen?"bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5]/30":"bg-white text-[#0F172A] border-border hover:bg-muted"}`}>
                <Filter className={`h-4 w-4 ${isFiltersOpen?"text-[#4F46E5]":"text-muted-foreground"}`}/> Filters
                {hasFilters?<span className="h-5 w-5 rounded-full bg-[#4F46E5] text-white text-[10px] font-bold flex items-center justify-center">!</span>:null}
              </button>

              {/* View toggle */}
              <div className="flex items-center bg-white border border-border rounded-lg p-1 shadow-sm ml-auto">
                <button onClick={()=>setViewMode("list")} className={`h-8 w-9 rounded-md flex items-center justify-center transition-colors focus:outline-none ${viewMode==="list"?"bg-muted text-[#0F172A]":"text-muted-foreground hover:text-[#0F172A]"}`}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                </button>
                <button onClick={()=>setViewMode("grid")} className={`h-8 w-9 rounded-md flex items-center justify-center transition-colors focus:outline-none ${viewMode==="grid"?"bg-muted text-[#0F172A]":"text-muted-foreground hover:text-[#0F172A]"}`}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                </button>
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
                  {/* Type */}
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">Device Type</p>
                    {TYPES.map(t=>(
                      <label key={t} onClick={e=>{e.preventDefault();toggleFilter(t,filterTypes,setFilterTypes as any);setCurrentPage(1)}} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <div className={`h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors ${filterTypes.includes(t)?"bg-[#4F46E5] border-[#4F46E5]":"border-border hover:border-[#4F46E5]"}`}>{filterTypes.includes(t)&&<Check className="h-3 w-3 text-white" strokeWidth={3}/>}</div>
                        <span className="text-[13px] font-medium text-muted-foreground flex-1">{t}</span>
                        <span className="text-[11px] font-bold text-muted-foreground">{devices.filter(d=>d.type===t).length}</span>
                      </label>
                    ))}
                  </div>
                  {/* Status */}
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">Status</p>
                    {STATUSES.map(s=>(
                      <label key={s} onClick={e=>{e.preventDefault();toggleFilter(s,filterStatuses,setFilterStatuses as any);setCurrentPage(1)}} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <div className={`h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors ${filterStatuses.includes(s)?"bg-[#4F46E5] border-[#4F46E5]":"border-border hover:border-[#4F46E5]"}`}>{filterStatuses.includes(s)&&<Check className="h-3 w-3 text-white" strokeWidth={3}/>}</div>
                        <span className="text-[13px] font-medium text-muted-foreground flex-1">{s}</span>
                        <span className="text-[11px] font-bold text-muted-foreground">{devices.filter(d=>d.status===s).length}</span>
                      </label>
                    ))}
                  </div>
                  {/* Warranty */}
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">Warranty</p>
                    {WARRANTIES.map(w=>(
                      <label key={w} onClick={e=>{e.preventDefault();toggleFilter(w,filterWarranties,setFilterWarranties as any);setCurrentPage(1)}} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <div className={`h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors ${filterWarranties.includes(w)?"bg-[#4F46E5] border-[#4F46E5]":"border-border hover:border-[#4F46E5]"}`}>{filterWarranties.includes(w)&&<Check className="h-3 w-3 text-white" strokeWidth={3}/>}</div>
                        <span className="text-[12px] font-medium text-muted-foreground">{w}</span>
                      </label>
                    ))}
                  </div>
                  {/* Brand */}
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">Brand</p>
                    <select value={filterBrand} onChange={e=>{setFilterBrand(e.target.value);setCurrentPage(1)}} className="w-full h-9 rounded-lg border border-border px-2 text-[12px] focus:outline-none focus:border-[#4F46E5] bg-white">
                      <option value="">All Brands</option>
                      {BRANDS.map(b=><option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  {/* Max Repairs */}
                  <div>
                    <div className="flex items-center justify-between mb-3"><p className="text-[12px] font-bold text-[#0F172A]">Max Repairs</p><span className="text-[12px] text-[#4F46E5] font-bold">≤ {filterRepairsMax===10?"10+":filterRepairsMax}</span></div>
                    <input type="range" min={0} max={10} value={filterRepairsMax} onChange={e=>{setFilterRepairsMax(+e.target.value);setCurrentPage(1)}} className="w-full h-1.5 bg-[#E2E8F0] rounded-full accent-[#4F46E5] cursor-pointer"/>
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground mt-1"><span>0</span><span>10+</span></div>
                    <button onClick={()=>setIsFiltersOpen(false)} className="mt-4 w-full h-9 bg-[#4F46E5] text-white rounded-lg text-[13px] font-bold hover:bg-[#4338CA] transition-colors focus:outline-none">Apply Filters</button>
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            {paginated.length===0?(
              <div className="flex-1 flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-border shadow-sm mb-6">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4"><Smartphone className="h-8 w-8 text-muted-foreground"/></div>
                <h3 className="text-[16px] font-black text-[#0F172A] mb-1">No Devices Found</h3>
                <p className="text-[13px] text-muted-foreground">Adjust filters or register a new device.</p>
              </div>
            ):viewMode==="grid"?(
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                {paginated.map(d=>(
                  <div key={d.id} className="bg-white rounded-2xl border border-border p-5 shadow-sm hover:shadow-md hover:border-[#4F46E5]/30 transition-all flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${DEVICE_ICON_COLOR[d.type]}`}><DeviceIcon type={d.type} className="h-6 w-6"/></div>
                        <div>
                          <p className="text-[14px] font-black text-[#0F172A] leading-tight">{d.name}</p>
                          <p className="text-[11px] text-muted-foreground font-bold">Rs. {d.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={()=>setViewDevice(d)} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted transition-colors focus:outline-none"><Eye className="h-3.5 w-3.5"/></button>
                        <button onClick={()=>setEditDevice({...d})} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted transition-colors focus:outline-none"><Edit2 className="h-3.5 w-3.5"/></button>
                        <button onClick={()=>setDeleteDevice(d)} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"><Trash2 className="h-3.5 w-3.5"/></button>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4 pb-4 border-b border-border/60">
                      <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-medium">IMEI</span><span className="font-bold text-[#0F172A] font-mono text-[11px]">{d.imei}</span></div>
                      <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-medium">Owner</span><span className="font-bold text-[#0F172A]">{d.owner.name}</span></div>
                      <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-medium">Registered</span><span className="font-semibold text-[#0F172A]">{d.registered}</span></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="relative">
                        <button onClick={(e)=>{e.stopPropagation(); setActiveDropdown(activeDropdown===d.id ? null : d.id)}} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${STATUS_STYLE[d.status]} hover:bg-opacity-80`}>
                          <StatusIcon s={d.status}/>{d.status} <ChevronDown className="h-3 w-3 opacity-50"/>
                        </button>
                        {activeDropdown===d.id && (
                          <div className="absolute bottom-full left-0 mb-2 w-36 bg-white border border-border rounded-xl shadow-xl z-[60] py-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
                            {STATUSES.map(st => (
                              <button key={st} onClick={()=>{setPendingStatusUpdate({id:d.id, status:st}); setIsStatusModalOpen(true); setActiveDropdown(null)}} className={`w-full px-4 py-2.5 text-left text-[11px] font-bold hover:bg-[#F8FAFC] transition-colors ${d.status===st?"text-[#4F46E5] bg-[#EEF2FF]":"text-[#0F172A]"}`}>{st}</button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${WARRANTY_STYLE[d.warranty.status]}`}><WarrantyIcon w={d.warranty.status}/>{d.warranty.status}</span>
                        <span className="text-[11px] font-bold text-[#4F46E5]">{d.totalRepairs} repairs</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ):(
              <div className="bg-white rounded-xl border border-border shadow-sm mb-6 overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead><tr className="bg-[#F8FAFC] border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-5 py-4">Device</th>
                    <th className="px-5 py-4">Owner</th>
                    <th className="px-5 py-4">Warranty</th>
                    <th className="px-5 py-4 text-center">Repairs</th>
                    <th className="px-5 py-4">Last Service</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border/60">
                    {paginated.map(d=>(
                      <tr key={d.id} className="hover:bg-[#F8FAFC]/70 transition-colors group">
                        <td className="px-5 py-4"><div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${DEVICE_ICON_COLOR[d.type]}`}><DeviceIcon type={d.type} className="h-5 w-5"/></div>
                          <div>
                            <p className="text-[13px] font-black text-[#0F172A] leading-tight">{d.name}</p>
                            <p className="text-[11px] font-bold text-[#4F46E5]">Rs. {d.price.toLocaleString()}</p>
                          </div>
                        </div></td>
                        <td className="px-5 py-4"><div><p className="text-[13px] font-bold text-[#0F172A]">{d.owner.name}</p><p className="text-[11px] text-muted-foreground">{d.owner.phone}</p></div></td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${WARRANTY_STYLE[d.warranty.status]}`}><WarrantyIcon w={d.warranty.status}/>{d.warranty.status}</span>
                          {d.warranty.expiryDate&&<p className="text-[10px] text-muted-foreground mt-0.5">{d.warranty.expiryDate}</p>}
                        </td>
                        <td className="px-5 py-4 text-center"><span className="text-[15px] font-black text-[#4F46E5]">{d.totalRepairs}</span></td>
                        <td className="px-5 py-4">{d.lastService.date?(<div><p className="text-[12px] font-bold text-[#0F172A]">{d.lastService.date}</p><p className="text-[11px] text-muted-foreground">{d.lastService.type}</p></div>):<span className="text-[11px] italic text-muted-foreground">Never serviced</span>}</td>
                        <td className="px-5 py-4">
                          <div className="relative">
                            <button onClick={(e)=>{e.stopPropagation(); setActiveDropdown(activeDropdown===d.id ? null : d.id)}} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border transition-colors ${STATUS_STYLE[d.status]} hover:shadow-sm`}>
                              <StatusIcon s={d.status}/>{d.status} <ChevronDown className="h-3 w-3 opacity-60"/>
                            </button>
                            {activeDropdown===d.id && (
                              <div className="absolute top-full left-0 mt-2 w-36 bg-white border border-border rounded-xl shadow-2xl z-[60] py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                                {STATUSES.map(st => (
                                  <button key={st} onClick={()=>{setPendingStatusUpdate({id:d.id, status:st}); setIsStatusModalOpen(true); setActiveDropdown(null)}} className={`w-full px-4 py-2.5 text-left text-[11px] font-bold hover:bg-[#F8FAFC] transition-colors ${d.status===st?"text-[#4F46E5] bg-[#EEF2FF]":"text-[#0F172A]"}`}>{st}</button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center"><div className="flex items-center justify-center gap-1">
                          <button onClick={()=>setViewDevice(d)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted transition-colors focus:outline-none"><Eye className="h-3.5 w-3.5"/></button>
                          <button onClick={()=>setEditDevice({...d})} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted transition-colors focus:outline-none"><Edit2 className="h-3.5 w-3.5"/></button>
                          <button onClick={()=>setDeleteDevice(d)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"><Trash2 className="h-3.5 w-3.5"/></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-border">
              <span className="text-[13px] text-muted-foreground font-medium">Showing <span className="font-bold text-[#0F172A]">{filtered.length===0?0:(currentPage-1)*perPage+1}–{Math.min(currentPage*perPage,filtered.length)}</span> of <span className="font-bold text-[#0F172A]">{filtered.length}</span> devices</span>
              <div className="flex items-center gap-1">
                <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="flex items-center h-8 px-3 text-[13px] font-semibold text-muted-foreground hover:bg-muted rounded disabled:opacity-40 focus:outline-none"><ChevronLeft className="h-4 w-4 mr-1"/>Prev</button>
                {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-currentPage)<=1).reduce((acc,p,i,arr)=>{if(i>0&&arr[i-1]!==p-1)acc.push(-1);acc.push(p);return acc},[] as number[]).map((p,i)=>p===-1?<span key={`e${i}`} className="px-1 text-muted-foreground">…</span>:(
                  <button key={p} onClick={()=>setCurrentPage(p)} className={`h-8 w-8 rounded text-[13px] font-semibold flex items-center justify-center focus:outline-none transition-colors ${currentPage===p?"bg-[#4F46E5] text-white shadow-sm":"text-[#0F172A] hover:bg-muted border border-border bg-white"}`}>{p}</button>
                ))}
                <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className="flex items-center h-8 px-3 text-[13px] font-semibold text-[#0F172A] hover:bg-muted rounded border border-border bg-white disabled:opacity-40 focus:outline-none">Next<ChevronRight className="h-4 w-4 ml-1"/></button>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                Show: <select value={perPage} onChange={e=>{setPerPage(+e.target.value);setCurrentPage(1)}} className="h-8 px-2 rounded border border-border bg-white text-[#0F172A] font-bold focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option></select> per page
              </div>
            </div>
          </div>
          <DashboardFooter/>

          {isLoading && (
            <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-[110]">
              <Spinner size="lg" />
            </div>
          )}

          {error && (
            <div className="fixed bottom-8 right-8 w-96 z-[110]">
              <ErrorBanner message={error} onClose={() => useDeviceStore.setState({ error: null })} />
            </div>
          )}
        </main>
      </div>

      {/* REGISTER DEVICE MODAL */}
      {showAddModal&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
              <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2"><Plus className="h-5 w-5 text-[#4F46E5]"/>Register New Device</h2>
              <button onClick={()=>setShowAddModal(false)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4"/></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Device Name *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. iPhone 14 Pro" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Brand</label>
                  <select value={form.brand} onChange={e=>setForm(p=>({...p,brand:e.target.value}))} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                    {BRANDS.map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Type</label>
                  <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value as DeviceType}))} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                    {TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">IMEI / Serial *</label><input value={form.imei} onChange={e=>setForm(p=>({...p,imei:e.target.value}))} placeholder="15-digit IMEI" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] font-mono focus:outline-none focus:border-[#4F46E5]"/></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Owner Name</label><input value={form.ownerName} onChange={e=>setForm(p=>({...p,ownerName:e.target.value}))} placeholder="Full name" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Owner Phone</label><input value={form.ownerPhone} onChange={e=>setForm(p=>({...p,ownerPhone:e.target.value}))} placeholder="+94 77 ..." className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Warranty</label>
                  <select value={form.warrantyStatus} onChange={e=>setForm(p=>({...p,warrantyStatus:e.target.value as WarrantyStatus}))} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                    {WARRANTIES.map(w=><option key={w}>{w}</option>)}
                  </select>
                </div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Warranty Expiry</label><input value={form.warrantyExpiry} onChange={e=>setForm(p=>({...p,warrantyExpiry:e.target.value}))} type="date" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
              </div>
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Selling Price (Rs.) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-[13px]">Rs.</span>
                  <input type="number" value={form.price} onChange={e=>setForm(p=>({...p,price: +e.target.value}))} placeholder="0.00" className="w-full h-10 rounded-lg border border-border pl-10 pr-3 text-[13px] font-bold text-[#4F46E5] focus:outline-none focus:border-[#4F46E5]"/>
                </div>
              </div>
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-2">Status</label>
                <div className="flex flex-wrap gap-2 sm:gap-3">{STATUSES.map(s=>(
                  <label key={s} onClick={e=>{e.preventDefault();setForm(p=>({...p,status:s}))}} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-[13px] font-semibold transition-colors ${form.status===s?"bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]":"border-border text-muted-foreground hover:bg-muted"}`}>{form.status===s&&<Check className="h-3.5 w-3.5"/>}{s}</label>
                ))}</div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 border-t border-border">
                <button onClick={()=>setShowAddModal(false)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted transition-colors focus:outline-none">Cancel</button>
                <button onClick={handleAdd} disabled={!form.name||!form.imei} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none disabled:opacity-50">Register Device</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DEVICE MODAL */}
      {editDevice&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
              <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2"><Edit2 className="h-5 w-5 text-[#4F46E5]"/>Edit Device</h2>
              <button onClick={()=>setEditDevice(null)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Device Name</label><input value={editDevice.name} onChange={e=>setEditDevice(p=>p?{...p,name:e.target.value}:p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Status</label>
                  <select value={editDevice.status} onChange={e=>setEditDevice(p=>p?{...p,status:e.target.value as DeviceStatus}:p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                    {STATUSES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Warranty</label>
                  <select value={editDevice.warranty.status} onChange={e=>setEditDevice(p=>p?{...p,warranty:{...p.warranty,status:e.target.value as WarrantyStatus}}:p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white">
                    {WARRANTIES.map(w=><option key={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Owner Name</label><input value={editDevice.owner.name} onChange={e=>setEditDevice(p=>p?{...p,owner:{...p.owner,name:e.target.value}}:p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Owner Phone</label><input value={editDevice.owner.phone} onChange={e=>setEditDevice(p=>p?{...p,owner:{...p.owner,phone:e.target.value}}:p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 border-t border-border">
                <button onClick={()=>setEditDevice(null)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted focus:outline-none">Cancel</button>
                <button onClick={handleSaveEdit} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md focus:outline-none">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DEVICE MODAL */}
      {viewDevice&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
              <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2"><Eye className="h-5 w-5 text-[#4F46E5]"/>Device Details</h2>
              <button onClick={()=>setViewDevice(null)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-xl border border-border">
                <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${DEVICE_ICON_COLOR[viewDevice.type]}`}><DeviceIcon type={viewDevice.type} className="h-7 w-7"/></div>
                <div>
                  <p className="text-[16px] font-black text-[#0F172A]">{viewDevice.name}</p>
                  <p className="text-[13px] font-bold text-[#4F46E5]">Rs. {viewDevice.price.toLocaleString()}</p>
                </div>
              </div>
              {[["IMEI / Serial",viewDevice.imei],["Brand",viewDevice.brand],["Type",viewDevice.type],["Owner",viewDevice.owner.name],["Phone",viewDevice.owner.phone],["Status",viewDevice.status],["Warranty",viewDevice.warranty.status],["Warranty Expiry",viewDevice.warranty.expiryDate||"N/A"],["Total Repairs",String(viewDevice.totalRepairs)],["Last Service",viewDevice.lastService.date||"Never"]].map(([label,value])=>(
                <div key={label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-[12px] font-bold text-muted-foreground">{label}</span>
                  <span className="text-[13px] font-bold text-[#0F172A]">{value}</span>
                </div>
              ))}
              <button onClick={()=>setViewDevice(null)} className="w-full h-10 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] focus:outline-none mt-2">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteDevice&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center shrink-0"><Trash2 className="h-6 w-6 text-red-500"/></div>
              <div><h2 className="text-[17px] font-black text-[#0F172A]">Delete Device?</h2><p className="text-[13px] text-muted-foreground">This will permanently remove <strong>{deleteDevice.name}</strong>.</p></div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button onClick={()=>setDeleteDevice(null)} className="flex-1 h-10 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted focus:outline-none">Cancel</button>
              <button onClick={handleDelete} className="flex-1 h-10 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 focus:outline-none">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* STATUS UPDATE MODAL */}
      <DeviceStatusUpdateModal 
        isOpen={isStatusModalOpen} 
        onClose={() => { setIsStatusModalOpen(false); setPendingStatusUpdate(null) }} 
        onConfirm={handleStatusUpdate} 
        pendingStatus={pendingStatusUpdate?.status || null} 
      />

      {/* 🛠️ INVISIBLE PDF RENDER TARGET FOR DEVICES REPORT */}
      <div className="fixed -left-[4000px] pointer-events-none opacity-0 select-none overflow-hidden h-0 w-0">
         <div 
           ref={hiddenDevicesReportRef}
           className="w-[1000px] bg-white p-16 flex flex-col min-h-[1400px]"
         >
            {/* BRANDING HEADER */}
            <div className="flex justify-between items-start mb-16">
                <div>
                   <div className="flex items-center gap-3 mb-3">
                     <div className="h-12 w-12 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-2xl">S</div>
                     <h2 className="text-[32px] font-black text-[#0F172A] tracking-tighter uppercase">SRM Solutions</h2>
                   </div>
                   <div className="text-[12px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                      <p className="flex items-center gap-2 text-[#4F46E5]"><Smartphone className="h-4 w-4" /> Global Device Inventory</p>
                      <p>Automated Stock Report</p>
                      <p>Internal Record #DEV-{new Date().getFullYear()}</p>
                   </div>
                </div>
                <div className="text-right text-[12px] text-slate-400 font-black uppercase tracking-widest leading-relaxed pt-2">
                      <p>Premium Service Center</p>
                      <p>Colombo 07, Sri Lanka</p>
                      <p className="text-[#4F46E5] mt-1 italic underline underline-offset-4 decoration-slate-200">Generated: {new Date().toLocaleString()}</p>
                </div>
            </div>

            {/* SUMMARY STATS GRID */}
            <div className="grid grid-cols-4 gap-6 mb-12">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Assets</p>
                    <p className="text-[28px] font-black text-[#0F172A]">{filtered.length}</p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] text-emerald-600/70 font-black uppercase tracking-widest mb-1">Available Stocks</p>
                    <p className="text-[28px] font-black text-emerald-700">{filtered.filter(d=>d.status==='Available').length}</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                    <p className="text-[10px] text-orange-600/70 font-black uppercase tracking-widest mb-1">In Review</p>
                    <p className="text-[28px] font-black text-orange-700">{filtered.filter(d=>d.status==='In Review').length}</p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                    <p className="text-[10px] text-indigo-600/70 font-black uppercase tracking-widest mb-1">Sold / Collected</p>
                    <p className="text-[28px] font-black text-indigo-700">{filtered.filter(d=>['Sold','Collected'].includes(d.status)).length}</p>
                </div>
            </div>

            {/* DATA TABLE */}
            <div className="flex-1">
                <table className="w-full text-left border-collapse border-t-2 border-[#0F172A]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-5 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Device Details</th>
                            <th className="px-5 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Identifier / IMEI</th>
                            <th className="px-5 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Ownership</th>
                            <th className="px-5 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="px-5 py-4 text-right text-[11px] font-black text-slate-500 uppercase tracking-widest">Value (LKR)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map((d) => (
                          <tr key={d.id} className="bg-white">
                             <td className="px-5 py-4">
                                <p className="text-[14px] font-black text-[#0F172A] mb-0.5">{d.name}</p>
                                <p className="text-[11px] text-slate-400 font-bold uppercase">{d.brand} • {d.type}</p>
                             </td>
                             <td className="px-5 py-4">
                                <p className="text-[13px] font-bold text-[#0F172A] font-mono">{d.imei}</p>
                             </td>
                             <td className="px-5 py-4">
                                <p className="text-[13px] font-bold text-[#0F172A]">{d.owner.name}</p>
                                <p className="text-[11px] text-slate-400">{d.owner.phone}</p>
                             </td>
                             <td className="px-5 py-4">
                               <span 
                                 className="text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest"
                                 style={{
                                   backgroundColor: d.status === 'Available' ? '#ecfdf5' : d.status === 'In Review' ? '#fffbeb' : '#f8fafc',
                                   color: d.status === 'Available' ? '#047857' : d.status === 'In Review' ? '#b45309' : '#0f172a',
                                   borderColor: d.status === 'Available' ? '#a7f3d0' : d.status === 'In Review' ? '#fde68a' : '#e2e8f0',
                                 }}
                               >
                                 {d.status}
                               </span>
                             </td>
                             <td className="px-5 py-4 text-right font-black text-[#0F172A]">
                                Rs. {(d.price || 0).toLocaleString()}
                             </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* FOOTER */}
            <div className="mt-20 pt-12 border-t border-slate-100 border-dashed">
                <div className="flex justify-between items-center">
                    <p className="text-[12px] font-black text-[#0F172A] flex items-center gap-2">
                       <ArrowUpRight className="h-4 w-4 text-[#4F46E5]" /> 
                       SRM Solutions Inventory Management System • {new Date().getFullYear()}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       Classification: Highly Confidential
                    </p>
                </div>
            </div>
         </div>
      </div>
    </div>
  )
}
