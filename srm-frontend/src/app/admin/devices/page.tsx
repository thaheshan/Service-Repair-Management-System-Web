"use client"
import { useState, useMemo, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { Search, Filter, Plus, FileDown, ChevronDown, ChevronLeft, ChevronRight, Smartphone, Tablet, Laptop, Cpu, MoreVertical, Edit2, Trash2, Eye, Check, X, Loader2, CheckCircle2, Clock, Archive, Wrench, ShieldCheck, ShieldAlert, ShieldOff, Shield, Tag, PackageCheck, AlertCircle, ShoppingCart, ArrowUpRight } from "lucide-react"
import { INITIAL_DEVICES, Device, DeviceType, DeviceStatus, WarrantyStatus, DEVICE_ICON_COLOR, WARRANTY_STYLE, STATUS_STYLE, BRANDS } from "./device-data"
import { DeviceStatusUpdateModal } from "@/components/admin/devices/status-update-modal"
import { useGetDevicesQuery, useCreateDeviceMutation, useUpdateDeviceMutation, useDeleteDeviceMutation } from "@/services/api/devicesApiSlice"
import { useCreateCustomerMutation } from "@/services/api/customersApiSlice"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { toast } from "sonner"

type SortKey = "price_desc"|"price_asc"|"repairs_desc"|"newest"|"oldest"

function DeviceIcon({type,className="h-6 w-6"}:{type:DeviceType;className?:string}) {
  if (type==="Tablet")  return <Tablet className={className}/>
  if (type==="Laptop")  return <Laptop className={className}/>
  if (type==="Console") return <Cpu className={className}/>
  return <Smartphone className={className}/>
}

function StatusIcon({s}:{s:DeviceStatus}) {
  if (s==="Active") return <CheckCircle2 className="h-3 w-3"/>
  if (s==="Under Repair") return <Wrench className="h-3 w-3"/>
  if (s==="Repaired") return <Check className="h-3 w-3"/>
  return <PackageCheck className="h-3 w-3"/>
}

function WarrantyIcon({w}:{w:WarrantyStatus}) {
  if (w==="Manufacturer")        return <ShieldCheck className="h-3 w-3"/>
  if (w==="Shop Warranty") return <ShieldAlert className="h-3 w-3"/>
  if (w==="Warranty Void")       return <ShieldOff className="h-3 w-3"/>
  return <Shield className="h-3 w-3"/>
}

export default function DevicesPage() {
  const { t } = useTranslation()
  const { data: response, isLoading } = useGetDevicesQuery({});
  const [createDevice] = useCreateDeviceMutation();
  const [updateDevice] = useUpdateDeviceMutation();
  const [deleteDeviceMutation] = useDeleteDeviceMutation();
  const [createCustomer] = useCreateCustomerMutation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const SORT_OPTIONS = [
    { label: mounted ? t('devicesPage.sortOptions.newest') : "Newest First", value: "newest" },
    { label: mounted ? t('devicesPage.sortOptions.oldest') : "Oldest First", value: "oldest" },
    { label: mounted ? t('devicesPage.sortOptions.priceDesc') : "High Value", value: "price_desc" },
    { label: mounted ? t('devicesPage.sortOptions.priceAsc') : "Low Value", value: "price_asc" },
    { label: mounted ? t('devicesPage.sortOptions.repairsDesc') : "Most Repairs", value: "repairs_desc" },
  ]

  const TYPES = [
    { label: mounted ? t('devicesPage.types.mobile') : "Mobile Phone", value: "Mobile Phone" },
    { label: mounted ? t('devicesPage.types.tablet') : "Tablet", value: "Tablet" },
    { label: mounted ? t('devicesPage.types.laptop') : "Laptop", value: "Laptop" },
    { label: mounted ? t('devicesPage.types.console') : "Console", value: "Console" },
    { label: mounted ? t('devicesPage.types.smartwatch') : "Smartwatch", value: "Smartwatch" },
    { label: mounted ? t('devicesPage.types.other') : "Other", value: "Other" },
  ]
  const STATUSES = [
    { label: mounted ? t('devicesPage.statuses.available') : "Available", value: "Available" },
    { label: mounted ? t('devicesPage.statuses.onSale') : "On Sale", value: "On Sale" },
    { label: mounted ? t('devicesPage.statuses.sold') : "Sold", value: "Sold" },
    { label: mounted ? t('devicesPage.statuses.underService') : "Under Service", value: "Under Service" },
    { label: mounted ? t('devicesPage.statuses.collected') : "Collected", value: "Collected" },
  ]
  const WARRANTIES = [
    { label: mounted ? t('devicesPage.warranties.none') : "None", value: "None" },
    { label: mounted ? t('devicesPage.warranties.shop') : "Shop Warranty", value: "Shop Warranty" },
    { label: mounted ? t('devicesPage.warranties.manufacturer') : "Manufacturer", value: "Manufacturer" },
    { label: mounted ? t('devicesPage.warranties.extended') : "Extended", value: "Extended" },
  ]

  const devices = useMemo(() => {
    const apiDevices = (response as any)?.data || response?.devices || [];
    return apiDevices.map((d: any) => ({
      id: d.id,
      name: d.model || d.name || "Unknown Device",
      brand: d.brand || "Apple",
      type: d.type || "Mobile Phone",
      imei: d.serialNumber || d.imei || "N/A",
      color: "bg-[#4F46E5]",
      owner: {
        name: d.customer?.firstName ? `${d.customer.firstName} ${d.customer.lastName || ""}` : (d.customer?.name || "Shop Stock"),
        phone: d.customer?.phone || "—"
      },
      warranty: {
        status: d.warrantyStatus || "None",
        expiryDate: d.warrantyExpiry ? new Date(d.warrantyExpiry).toLocaleDateString() : "—"
      },
      totalRepairs: d.repairs ? d.repairs.length : 0,
      lastService: {
        date: d.lastServiceDate ? new Date(d.lastServiceDate).toLocaleDateString() : "",
        type: d.lastServiceType || ""
      },
      registered: d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      status: d.status || "Active",
      price: d.price || 0
    }));
  }, [response]);

  const [viewMode, setViewMode] = useState<"list"|"grid">("list")
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("newest")
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [isExporting, setIsExporting] = useState(false)

  // Filters
  const [filterType, setFilterType] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterWarranties, setFilterWarranties] = useState<WarrantyStatus[]>([])
  const [filterBrand, setFilterBrand] = useState("")
  const [filterRepairsMax, setFilterRepairsMax] = useState(10)

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [editDevice, setEditDevice] = useState<Device|null>(null)
  const [deleteDevice, setDeleteDevice] = useState<Device|null>(null)
  const [viewDevice, setViewDevice] = useState<Device|null>(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{id:string, status:DeviceStatus}|null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string|null>(null)
  const [hasWarranty, setHasWarranty] = useState(false)
  const [customBrand, setCustomBrand] = useState("")
  const [form, setForm] = useState({
    name: "",
    brand: "Apple",
    type: "Mobile Phone" as DeviceType,
    imei: "",
    ownerName: "",
    ownerPhone: "",
    warrantyStatus: "None" as WarrantyStatus,
    warrantyExpiry: "",
    status: "Active" as DeviceStatus,
    price: 0
  })

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

  const clearFilters = () => {
    setFilterType(""); setFilterStatus(""); setFilterWarranties([]);
    setFilterBrand(""); setFilterRepairsMax(10); setCurrentPage(1)
  }

  const filtered = useMemo(() => {
    let r = devices
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter(d => d.name.toLowerCase().includes(q)||d.brand.toLowerCase().includes(q)||d.imei.toLowerCase().includes(q)||d.owner.name.toLowerCase().includes(q))
    }
    if (filterType) r = r.filter(d => d.type === filterType)
    if (filterStatus) r = r.filter(d => d.status === filterStatus)
    r = r.filter(d => d.totalRepairs <= filterRepairsMax)
    return [...r].sort((a,b) => {
      if (sortKey==="price_desc") return b.price - a.price
      if (sortKey==="price_asc") return a.price - b.price
      if (sortKey==="repairs_desc") return b.totalRepairs - a.totalRepairs
      return 0
    })
  }, [devices, search, filterType, filterStatus, filterRepairsMax, sortKey])

  const totalPages = Math.max(1, Math.ceil(filtered.length/perPage))
  const paginated = filtered.slice((currentPage-1)*perPage, currentPage*perPage)

  const handleAdd = async () => {
    if (!form.name) {
      toast.error("Device Name is required.");
      return;
    }
    
    if (!user || !user.shopId) {
      toast.error("Session invalid. Please log in again.");
      return;
    }
    
    try {
      const customerIdResult = await createCustomer({
        name: form.ownerName || "Walk-in Customer",
        phone: form.ownerPhone || "0000000000",
      }).unwrap();

      const customerId = customerIdResult.customerId || customerIdResult.id || (customerIdResult as any).data?.id;
      
      await createDevice({
        shopId: user.shopId,
        customerId: customerId,
        brand: form.brand === "Other" ? customBrand : form.brand,
        model: form.name,
        serialNumber: form.imei || "N/A", // Use serialNumber if imei is expected as such
        type: form.type,
        price: form.price,
        status: "Available",
        warrantyStatus: form.warrantyStatus,
        warrantyExpiry: form.warrantyExpiry || null
      }).unwrap();

      toast.success("Device Registered Successfully!");
      setShowAddModal(false);
      setForm({name:"",brand:"Apple",type:"Mobile Phone",imei:"",ownerName:"",ownerPhone:"",warrantyStatus:"None",warrantyExpiry:"",status:"Active",price:0});
    } catch (e: any) {
      toast.error(e.data?.message || "Registration failed");
    }
  }

  const handleStatusUpdate = async (autoNotify: boolean, newStatus: DeviceStatus) => {
    if (!pendingStatusUpdate) return
    try {
      await updateDevice({
        id: pendingStatusUpdate.id,
        status: newStatus
      }).unwrap();
      setPendingStatusUpdate(null)
      setIsStatusModalOpen(false)
      setActiveDropdown(null)
    } catch(err) {
      console.error("Failed to update status", err)
    }
  }

  const handleSaveEdit = async () => {
    if (!editDevice) return
    try {
      await updateDevice({
        id: editDevice.id,
        model: editDevice.name,
        status: editDevice.status,
        warrantyStatus: editDevice.warranty.status
      }).unwrap();
      toast.success("Device updated successfully!");
      setEditDevice(null)
    } catch(err: any) {
      toast.error(err.data?.message || "Failed to update device.");
    }
  }

  const handleDelete = async () => {
    if (!deleteDevice) return
    try {
      await deleteDeviceMutation(deleteDevice.id).unwrap();
      setDeleteDevice(null)
    } catch(err) {
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

  const handleExportPDF = handleDownloadPDF;
  const hasFilters = filterType||filterStatus||filterBrand||filterRepairsMax<10

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar/>
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        <DashboardHeader/>
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col flex-1">

            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-4">
              <Link href="/admin/dashboard" className="text-[#4F46E5] hover:underline">{mounted ? t('dashboard.title') : 'Dashboard'}</Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50"/>
              <span className="text-[#0F172A]">{mounted ? t('devicesPage.title') : 'Devices Management'}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-[26px] font-black text-[#0F172A] tracking-tight">{mounted ? t('devicesPage.title') : 'Devices Management'}</h1>
                <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[13px] font-bold">{filtered.length} {mounted ? t('devicesPage.total') : 'Devices'}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button onClick={()=>{setShowExportMenu(p=>!p);setShowSortMenu(false)}} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-semibold text-[#0F172A] hover:bg-muted shadow-sm focus:outline-none">
                    {isExporting?<Loader2 className="h-4 w-4 animate-spin"/>:<FileDown className="h-4 w-4 text-muted-foreground"/>} {mounted ? t('devicesPage.export') : 'Export'} <ChevronDown className="h-3.5 w-3.5 text-muted-foreground"/>
                  </button>
                  {showExportMenu&&(
                    <div className="absolute top-12 right-0 w-44 bg-white border border-border rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                      <button onClick={()=>{handleExportPDF();setShowExportMenu(p=>!p)}} className="w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center gap-2"><FileDown className="h-4 w-4 text-[#4F46E5]"/>Export as PDF</button>
                      <button onClick={()=>{handleExportCSV();setShowExportMenu(p=>!p)}} className="w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center gap-2"><FileDown className="h-4 w-4 text-[#10B981]"/>Export as CSV</button>
                    </div>
                  )}
                </div>
                <button onClick={()=>setShowAddModal(true)} className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#4F46E5] text-[13px] font-bold text-white hover:bg-[#4338CA] shadow-sm transition-colors focus:outline-none">
                  <Plus className="h-4 w-4"/> {mounted ? t('devicesPage.register') : 'Register Device'}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <input value={search} onChange={e=>{setSearch(e.target.value);setCurrentPage(1)}} type="text" placeholder={mounted ? t('devicesPage.searchPlaceholder') : "Search device, IMEI, owner..."} className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] shadow-sm placeholder:text-muted-foreground/70"/>
              </div>

              <div className="relative">
                <button onClick={()=>{setShowSortMenu(p=>!p);setShowExportMenu(false)}} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[12px] font-medium text-muted-foreground hover:bg-muted shadow-sm focus:outline-none">
                  {mounted ? t('devicesPage.sort') : 'Sort'}: {SORT_OPTIONS.find(s=>s.value===sortKey)?.label} <ChevronDown className="h-3.5 w-3.5"/>
                </button>
                {showSortMenu&&(
                  <div className="absolute top-12 left-0 w-52 bg-white border border-border rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    {SORT_OPTIONS.map(o=>(
                      <button key={o.value} onClick={()=>{setSortKey(o.value as SortKey);setShowSortMenu(false);setCurrentPage(1)}} className={`w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center justify-between ${sortKey===o.value?"text-[#4F46E5]":"text-[#0F172A]"}`}>
                        {o.label}{sortKey===o.value&&<Check className="h-3.5 w-3.5"/>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={()=>setIsFiltersOpen(p=>!p)} className={`flex items-center gap-2 h-10 px-5 rounded-lg border font-bold text-[13px] focus:outline-none shadow-sm transition-colors ${isFiltersOpen?"bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5]/30":"bg-white text-[#0F172A] border-border hover:bg-muted"}`}>
                <Filter className={`h-4 w-4 ${isFiltersOpen?"text-[#4F46E5]":"text-muted-foreground"}`}/> {mounted ? t('devicesPage.filters') : 'Filters'}
                {hasFilters?<span className="h-5 w-5 rounded-full bg-[#4F46E5] text-white text-[10px] font-bold flex items-center justify-center">!</span>:null}
              </button>

              <div className="flex items-center bg-white border border-border rounded-lg p-1 shadow-sm ml-auto">
                <button onClick={()=>setViewMode("list")} className={`h-8 w-9 rounded-md flex items-center justify-center transition-colors focus:outline-none ${viewMode==="list"?"bg-muted text-[#0F172A]":"text-muted-foreground hover:text-[#0F172A]"}`}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                </button>
                <button onClick={()=>setViewMode("grid")} className={`h-8 w-9 rounded-md flex items-center justify-center transition-colors focus:outline-none ${viewMode==="grid"?"bg-muted text-[#0F172A]":"text-muted-foreground hover:text-[#0F172A]"}`}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                </button>
              </div>
            </div>

            {isFiltersOpen&&(
              <div className="mb-5 bg-white border border-border rounded-xl shadow-md p-6 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[15px] font-bold text-[#0F172A]">{mounted ? t('devicesPage.filters') : 'Filters'}</h3>
                  <button onClick={clearFilters} className="text-[12px] font-bold text-[#4F46E5] hover:underline focus:outline-none">{mounted ? t('devicesPage.clearAll') : 'Clear All'}</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">{mounted ? t('devicesPage.deviceType') : 'Device Type'}</p>
                    <div className="flex flex-wrap gap-2">
                          {TYPES.map(type => (
                            <button
                              key={type.value}
                              onClick={() => setFilterType(type.value)}
                              className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all ${
                                filterType === type.value 
                                  ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                                  : "bg-white border-border text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {type.label}
                            </button>
                          ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#0F172A] mb-3">{mounted ? t('devicesPage.status') : 'Status'}</p>
                    <div className="flex flex-wrap gap-2">
                          {STATUSES.map(status => (
                            <button
                              key={status.value}
                              onClick={() => setFilterStatus(status.value)}
                              className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all ${
                                filterStatus === status.value 
                                  ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                                  : "bg-white border-border text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {status.label}
                            </button>
                          ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paginated.length===0?(
              <div className="flex-1 flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-border shadow-sm mb-6">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4"><Smartphone className="h-8 w-8 text-muted-foreground"/></div>
                <h3 className="text-[16px] font-black text-[#0F172A] mb-1">{mounted ? t('devicesPage.noDevices') : 'No Devices Found'}</h3>
                <p className="text-[13px] text-muted-foreground">{mounted ? t('devicesPage.adjustFilters') : 'Adjust filters or register a new device.'}</p>
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
                              <button key={st.value} onClick={()=>{setPendingStatusUpdate({id:d.id, status:st.value as DeviceStatus}); setIsStatusModalOpen(true); setActiveDropdown(null)}} className={`w-full px-4 py-2.5 text-left text-[11px] font-bold hover:bg-[#F8FAFC] transition-colors ${d.status===st.value?"text-[#4F46E5] bg-[#EEF2FF]":"text-[#0F172A]"}`}>{st.label}</button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${WARRANTY_STYLE[d.warranty.status]}`}><WarrantyIcon w={d.warranty.status}/>{d.warranty.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ):(
              <div className="bg-white rounded-xl border border-border shadow-sm mb-6 overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead><tr className="bg-[#F8FAFC] border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-5 py-4">{mounted ? t('devicesPage.device') : 'Device'}</th>
                    <th className="px-5 py-4">{mounted ? t('devicesPage.owner') : 'Owner'}</th>
                    <th className="px-5 py-4">{mounted ? t('devicesPage.warranty') : 'Warranty'}</th>
                    <th className="px-5 py-4">{mounted ? t('devicesPage.status') : 'Status'}</th>
                    <th className="px-5 py-4 text-center">{mounted ? t('devicesPage.actions') : 'Actions'}</th>
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
                        </td>
                        <td className="px-5 py-4">
                          <div className="relative">
                            <button onClick={(e)=>{e.stopPropagation(); setActiveDropdown(activeDropdown===d.id ? null : d.id)}} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border transition-colors ${STATUS_STYLE[d.status]} hover:shadow-sm`}>
                              <StatusIcon s={d.status}/>{d.status} <ChevronDown className="h-3 w-3 opacity-60"/>
                            </button>
                            {activeDropdown===d.id && (
                              <div className="absolute top-full left-0 mt-2 w-36 bg-white border border-border rounded-xl shadow-2xl z-[60] py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                                {STATUSES.map(st => (
                                  <button key={st.value} onClick={()=>{setPendingStatusUpdate({id:d.id, status:st.value as DeviceStatus}); setIsStatusModalOpen(true); setActiveDropdown(null)}} className={`w-full px-4 py-2.5 text-left text-[11px] font-bold hover:bg-[#F8FAFC] transition-colors ${d.status===st.value?"text-[#4F46E5] bg-[#EEF2FF]":"text-[#0F172A]"}`}>{st.label}</button>
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

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-border">
              <span className="text-[13px] text-muted-foreground font-medium">{mounted ? t('customers.showing') : 'Showing'} <span className="font-bold text-[#0F172A]">{filtered.length===0?0:(currentPage-1)*perPage+1}–{Math.min(currentPage*perPage,filtered.length)}</span> {mounted ? t('customers.of') : 'of'} <span className="font-bold text-[#0F172A]">{filtered.length}</span> {mounted ? t('devicesPage.total') : 'devices'}</span>
              <div className="flex items-center gap-1">
                <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="flex items-center h-8 px-3 text-[13px] font-semibold text-muted-foreground hover:bg-muted rounded disabled:opacity-40 focus:outline-none"><ChevronLeft className="h-4 w-4 mr-1"/>Prev</button>
                <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className="flex items-center h-8 px-3 text-[13px] font-semibold text-[#0F172A] hover:bg-muted rounded border border-border bg-white disabled:opacity-40 focus:outline-none">Next<ChevronRight className="h-4 w-4 ml-1"/></button>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                Show: <select value={perPage} onChange={e=>{setPerPage(+e.target.value);setCurrentPage(1)}} className="h-8 px-2 rounded border border-border bg-white text-[#0F172A] font-bold focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option></select> per page
              </div>
            </div>
          </div>
        </main>
      </div>

      {showAddModal&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
              <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2"><Plus className="h-5 w-5 text-[#4F46E5]"/>{mounted ? t('devicesPage.registerNew') : 'Register New Device'}</h2>
              <button onClick={()=>setShowAddModal(false)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4"/></button>
            </div>
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">{mounted ? t('devicesPage.deviceName') : 'Device Name *'}</label>
                  <input 
                    value={form.name} 
                    onChange={e=>setForm(p=>({...p,name:e.target.value}))} 
                    placeholder="e.g. iPhone 14 Pro" 
                    className="w-full h-11 rounded-xl border border-border px-4 text-[13px] focus:outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/5 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Brand</label>
                  <select 
                    value={form.brand} 
                    onChange={e=>setForm(p=>({...p,brand:e.target.value}))} 
                    className="w-full h-11 rounded-xl border border-border px-4 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white appearance-none outline-none"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Huawei">Huawei</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Oppo">Oppo</option>
                    <option value="Vivo">Vivo</option>
                    <option value="Sony">Sony</option>
                    <option value="Nokia">Nokia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {form.brand === "Other" && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Custom Brand Name</label>
                  <input 
                    value={customBrand} 
                    onChange={e=>setCustomBrand(e.target.value)} 
                    placeholder="Type brand name..." 
                    className="w-full h-11 rounded-xl border border-primary bg-indigo-50/20 px-4 text-[13px] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Type</label>
                  <select 
                    value={form.type} 
                    onChange={e=>setForm(p=>({...p,type:e.target.value as DeviceType}))} 
                    className="w-full h-11 rounded-xl border border-border px-4 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white appearance-none outline-none"
                  >
                    {TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">{mounted ? t('devicesPage.imeiSerial') : 'IMEI / Serial'}</label>
                  <input 
                    value={form.imei} 
                    onChange={e=>setForm(p=>({...p,imei:e.target.value}))} 
                    placeholder="15-digit IMEI (Optional)" 
                    className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-mono focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <label className="block text-[12px] font-bold text-[#0F172A]">Warranty Status</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setHasWarranty(true)}
                    className={`flex-1 h-11 rounded-xl border font-bold text-[12px] transition-all ${hasWarranty ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-border bg-white text-muted-foreground hover:bg-muted'}`}
                  >
                    Under Warranty
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasWarranty(false)
                      setForm(p => ({...p, warrantyStatus: "None", warrantyExpiry: ""}))
                    }}
                    className={`flex-1 h-11 rounded-xl border font-bold text-[12px] transition-all ${!hasWarranty ? 'border-[#0F172A] bg-slate-50 text-[#0F172A]' : 'border-border bg-white text-muted-foreground hover:bg-muted'}`}
                  >
                    No Warranty
                  </button>
                </div>
              </div>

              {hasWarranty && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div>
                    <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Provider</label>
                    <select 
                      value={form.warrantyStatus} 
                      onChange={e=>setForm(p=>({...p,warrantyStatus:e.target.value as WarrantyStatus}))} 
                      className="w-full h-11 rounded-xl border border-border px-4 text-[13px] focus:outline-none focus:border-[#4F46E5] bg-white appearance-none"
                    >
                      <option value="Manufacturer">Manufacturer</option>
                      <option value="Shop Warranty">Shop Warranty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Expiry Date</label>
                    <input 
                      type="date" 
                      value={form.warrantyExpiry} 
                      onChange={e=>setForm(p=>({...p,warrantyExpiry:e.target.value}))} 
                      className="w-full h-11 rounded-xl border border-border px-4 text-[13px] focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">{mounted ? t('devicesPage.sellingPrice') : 'Selling Price (Rs.) *'}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-[13px]">Rs.</span>
                  <input 
                    type="number" 
                    value={form.price} 
                    onChange={e=>setForm(p=>({...p,price: +e.target.value}))} 
                    placeholder="0.00" 
                    className="w-full h-11 rounded-xl border border-border pl-12 pr-4 text-[14px] font-black text-[#4F46E5] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border">
                <button onClick={()=>setShowAddModal(false)} className="flex-1 h-12 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleAdd} disabled={!form.name} className="flex-1 h-12 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-lg shadow-[#4F46E5]/20 transition-all disabled:opacity-50">{mounted ? t('devicesPage.register') : 'Register Device'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editDevice&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
              <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2"><Edit2 className="h-5 w-5 text-[#4F46E5]"/>{mounted ? t('devicesPage.editDevice') : 'Edit Device'}</h2>
              <button onClick={()=>setEditDevice(null)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Device Name</label><input value={editDevice.name} onChange={e=>setEditDevice(p=>p?{...p,name:e.target.value}:p)} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:border-[#4F46E5]"/></div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 border-t border-border">
                <button onClick={()=>setEditDevice(null)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted focus:outline-none">Cancel</button>
                <button onClick={handleSaveEdit} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md focus:outline-none">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewDevice&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
              <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2"><Eye className="h-5 w-5 text-[#4F46E5]"/>{mounted ? t('devicesPage.deviceDetails') : 'Device Details'}</h2>
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
              <button onClick={()=>setViewDevice(null)} className="w-full h-10 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] focus:outline-none mt-2">Close</button>
            </div>
          </div>
        </div>
      )}

      {deleteDevice&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center shrink-0"><Trash2 className="h-6 w-6 text-red-500"/></div>
              <div><h2 className="text-[17px] font-black text-[#0F172A]">{mounted ? t('devicesPage.deleteConfirm') : 'Delete Device?'}</h2><p className="text-[13px] text-muted-foreground">This will permanently remove <strong>{deleteDevice.name}</strong>.</p></div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button onClick={()=>setDeleteDevice(null)} className="flex-1 h-10 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted focus:outline-none">Cancel</button>
              <button onClick={handleDelete} className="flex-1 h-10 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 focus:outline-none">Delete</button>
            </div>
          </div>
        </div>
      )}

      <DeviceStatusUpdateModal 
        isOpen={isStatusModalOpen} 
        onClose={() => { setIsStatusModalOpen(false); setPendingStatusUpdate(null) }} 
        onConfirm={handleStatusUpdate} 
        pendingStatus={pendingStatusUpdate?.status || null} 
      />

      <div className="fixed -left-[4000px] pointer-events-none opacity-0 select-none overflow-hidden h-0 w-0">
         <div 
           ref={hiddenDevicesReportRef}
           className="w-[1000px] bg-white p-16 flex flex-col min-h-[1400px]"
         >
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
                      <p className="text-[#4F46E5] mt-1 italic underline underline-offset-4 decoration-slate-200">Generated: {mounted ? new Date().toLocaleString() : ""}</p>
                </div>
            </div>

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
                                   backgroundColor: d.status === 'Active' ? '#ecfdf5' : '#f8fafc',
                                   color: d.status === 'Active' ? '#047857' : '#0f172a',
                                   borderColor: d.status === 'Active' ? '#a7f3d0' : '#e2e8f0',
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
