"use client"
import { useState, useMemo, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { Search, Filter, Plus, FileDown, ChevronDown, ChevronLeft, ChevronRight, Smartphone, Tablet, Laptop, Cpu, MoreVertical, Edit2, Trash2, Eye, Check, X, Loader2, CheckCircle2, Clock, Archive, Wrench, ShieldCheck, ShieldAlert, ShieldOff, Shield, Tag, PackageCheck, AlertCircle, ShoppingCart, ArrowUpRight, UserPlus } from "lucide-react"

import { Device, DeviceType, DeviceStatus, WarrantyStatus, DEVICE_ICON_COLOR, WARRANTY_STYLE, STATUS_STYLE, DEVICE_MODELS_BY_BRAND, BRANDS } from "@/app/admin/devices/device-data"
import { DeviceStatusUpdateModal } from "@/components/admin/devices/status-update-modal"
import { useGetDevicesQuery, useCreateDeviceMutation, useUpdateDeviceMutation, useDeleteDeviceMutation } from "@/services/api/devicesApiSlice"
import { Autocomplete } from "@/components/ui/autocomplete"
import { useGetCustomersQuery } from "@/services/api/customersApiSlice"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { toast } from "sonner"

type SortKey = "price_desc" | "price_asc" | "repairs_desc" | "newest" | "oldest"

function DeviceIcon({ type, className = "h-6 w-6" }: { type: DeviceType; className?: string }) {
  if (type === "Tablet") return <Tablet className={className} />
  if (type === "Laptop") return <Laptop className={className} />
  if (type === "Console") return <Cpu className={className} />
  return <Smartphone className={className} />
}

function StatusIcon({ s }: { s: DeviceStatus }) {
  if (s === "ACTIVE") return <CheckCircle2 className="h-3 w-3" />
  if (s === "AVAILABLE") return <CheckCircle2 className="h-3 w-3" />
  if (s === "ON_SALE") return <Tag className="h-3 w-3" />
  if (s === "SOLD") return <ShoppingCart className="h-3 w-3" />
  if (s === "IN_SERVICE") return <Wrench className="h-3 w-3" />
  return <PackageCheck className="h-3 w-3" />
}

function WarrantyIcon({ w }: { w: WarrantyStatus }) {
  if (w === "Manufacturer") return <ShieldCheck className="h-3 w-3" />
  if (w === "Shop Warranty") return <ShieldAlert className="h-3 w-3" />
  if (w === "Warranty Void") return <ShieldOff className="h-3 w-3" />
  return <Shield className="h-3 w-3" />
}

export default function DevicesManagementPage() {
  const { t } = useTranslation()
  const { data: response, isLoading } = useGetDevicesQuery({});
  const [createDevice, { isLoading: isCreating }] = useCreateDeviceMutation()
  const [updateDevice] = useUpdateDeviceMutation();
  const [deleteDeviceMutation] = useDeleteDeviceMutation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: customersResponse } = useGetCustomersQuery({});
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const SORT_OPTIONS = [
    { label: mounted ? t('devicesPage.sortOptions.newest') : "Newest First", value: "newest" },
    { label: mounted ? t('devicesPage.sortOptions.oldest') : "Oldest First", value: "oldest" },
    { label: mounted ? t('devicesPage.sortOptions.repairsDesc') : "Most Repairs", value: "repairs_desc" },
  ]

  const TYPES = [
    { label: mounted ? t('devicesPage.types.mobile') : "Mobile Phone", value: "Mobile Phone" },
    { label: mounted ? t('devicesPage.types.tablet') : "Tablet", value: "Tablet" },
    { label: mounted ? t('devicesPage.types.laptop') : "Laptop", value: "Laptop" },
    { label: "Desktop Computer", value: "Desktop Computer" },
    { label: mounted ? t('devicesPage.types.smartwatch') : "Smartwatch", value: "Smartwatch" },
    { label: mounted ? t('devicesPage.types.console') : "Gaming Console", value: "Gaming Console" },
    { label: "Audio / Headphones", value: "Audio/Headphones" },
    { label: "Camera", value: "Camera" },
    { label: "Drone", value: "Drone" },
    { label: "E-Reader", value: "E-Reader" },
    { label: "Monitor / Display", value: "Monitor/Display" },
    { label: "Printer / Scanner", value: "Printer/Scanner" },
    { label: "Smart Home Device", value: "Smart Home Device" },
    { label: mounted ? t('devicesPage.types.other') : "Other", value: "Other" },
  ]
  const STATUSES = [
    { label: "Active", value: "ACTIVE" },
    { label: "Available", value: "AVAILABLE" },
    { label: "On Sale", value: "ON_SALE" },
    { label: "Sold", value: "SOLD" },
    { label: "In Service", value: "IN_SERVICE" },
    { label: "Collected", value: "COLLECTED" },
  ]

  const devices = useMemo(() => {
    const apiDevices = (response as any)?.data || response?.devices || [];
    return apiDevices.map((d: any) => {
      const created = d.createdAt ? new Date(d.createdAt) : new Date();
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      
      let warrantyStatus: WarrantyStatus = "No Warranty";
      let expiryDate = "—";

      if (d.status === "COLLECTED" || d.status === "SOLD") {
        if (diffDays <= 30) {
          warrantyStatus = "Active";
          expiryDate = new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" });
        } else {
          warrantyStatus = "Expired";
        }
      } else if (d.status === "IN_SERVICE" || d.status === "ACTIVE") {
        warrantyStatus = "Active";
        expiryDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" });
      } else {
        if (diffDays < 60) {
          warrantyStatus = "Active";
          expiryDate = new Date(created.getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" });
        } else if (diffDays < 90) {
          warrantyStatus = "Expiring Soon";
          expiryDate = new Date(created.getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" });
        } else {
          warrantyStatus = "Expired";
        }
      }

      return {
        id: d.id,
        name: d.model || "Unknown Device",
        brand: d.brand || "—",
        type: d.type || "Mobile Phone",
        imei: d.imei || d.serialNo || "—",
        color: "bg-[#4F46E5]",
        owner: {
          name: d.customer?.name || "Unassigned",
          phone: d.customer?.phone || "—"
        },
        warranty: { status: warrantyStatus, expiryDate },
        totalRepairs: d.repairs ? d.repairs.length : 0,
        lastService: { date: "", type: "" },
        registered: d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—",
        status: d.status || "AVAILABLE",
        price: d.price || 0,
        rawImei: d.imei || "",
        rawSerialNo: d.serialNo || "",
        rawCustomerId: d.customerId || "",
        rawCustomer: d.customer || null,
      };
    });
  }, [response]);

  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
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
  const [filterRepairsMax, setFilterRepairsMax] = useState(10)

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [editDevice, setEditDevice] = useState<Device | null>(null)
  const [deleteDevice, setDeleteDevice] = useState<Device | null>(null)
  const [viewDevice, setViewDevice] = useState<Device | null>(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{ id: string, status: DeviceStatus } | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [customBrand, setCustomBrand] = useState("")
  const [form, setForm] = useState({ model: "", brand: "Apple", type: "Mobile Phone" as DeviceType, imei: "", serialNo: "", price: "" as string | number })
  const [editForm, setEditForm] = useState({ model: "", brand: "Apple", type: "Mobile Phone" as DeviceType, imei: "", serialNo: "", price: "" as string | number })
  const [addCustomerSearch, setAddCustomerSearch] = useState("")
  const [addSelectedCustomer, setAddSelectedCustomer] = useState<{ id: string, name: string, phone: string } | null>(null)
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)

  const allCustomers = useMemo(() => {
    return (customersResponse as any)?.customers || (customersResponse as any)?.data || [];
  }, [customersResponse])

  const filteredCustomers = useMemo(() => {
    if (!addCustomerSearch.trim()) return allCustomers.slice(0, 8);
    const q = addCustomerSearch.toLowerCase();
    return allCustomers.filter((c: any) => c.name?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q)).slice(0, 8);
  }, [allCustomers, addCustomerSearch])

  const [isExportingDevice, setIsExportingDevice] = useState(false);
  const hiddenDevicesReportRef = useRef<HTMLDivElement>(null);
  const deviceDetailRef = useRef<HTMLDivElement>(null);

  const handleDownloadDevicePdf = async () => {
    if (!deviceDetailRef.current || !viewDevice) return;
    setIsExportingDevice(true);
    toast.loading("Generating professional invoice...", { id: "pdf-gen" });
    
    await new Promise(r => setTimeout(r, 300));

    try {
      const elements = Array.from(deviceDetailRef.current.getElementsByTagName("*"));
      const computedStyles = elements.map(el => {
        const style = window.getComputedStyle(el);
        return {
          cssText: style.cssText,
          color: style.color,
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          borderWidth: style.borderWidth,
          borderStyle: style.borderStyle,
          padding: style.padding,
          margin: style.margin,
          display: style.display,
          flexDirection: style.flexDirection,
          alignItems: style.alignItems,
          justifyContent: style.justifyContent,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          fontFamily: style.fontFamily,
          gap: style.gap,
          width: style.width,
          height: style.height,
          boxShadow: style.boxShadow.includes('lab') || style.boxShadow.includes('oklch') ? 'none' : style.boxShadow
        };
      });

      const canvas = await html2canvas(deviceDetailRef.current, { 
        scale: 3, 
        logging: false, 
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const clonedElements = Array.from(clonedDoc.getElementsByTagName("*"));
          clonedElements.forEach((el, i) => {
             const cel = el as HTMLElement;
             const s = computedStyles[i];
             if (!s) return;
             
             cel.style.color = s.color.includes('lab') || s.color.includes('oklch') ? '#000000' : s.color;
             cel.style.backgroundColor = s.backgroundColor.includes('lab') || s.backgroundColor.includes('oklch') ? '#ffffff' : s.backgroundColor;
             cel.style.borderColor = s.borderColor;
             cel.style.borderWidth = s.borderWidth;
             cel.style.borderStyle = s.borderStyle;
             cel.style.padding = s.padding;
             cel.style.display = s.display;
             cel.style.fontSize = s.fontSize;
             cel.style.fontWeight = s.fontWeight;
             cel.style.fontFamily = "Arial, sans-serif";
             cel.style.width = s.width;
             cel.style.height = s.height;
             cel.style.boxShadow = s.boxShadow;
             
             if (s.display === 'flex') {
                cel.style.flexDirection = s.flexDirection;
                cel.style.alignItems = s.alignItems;
                cel.style.justifyContent = s.justifyContent;
                cel.style.gap = s.gap;
             }
          });

          const heads = clonedDoc.getElementsByTagName("head");
          if (heads[0]) {
             while(heads[0].firstChild) heads[0].removeChild(heads[0].firstChild);
          }
          const bodyStyles = clonedDoc.querySelectorAll('style');
          bodyStyles.forEach(s => s.remove());
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`SRM_Device_Invoice_${viewDevice.name.replace(/\s+/g, '_')}.pdf`);
      toast.success("Invoice generated successfully!", { id: "pdf-gen" });
    } catch (err) {
      console.error("PDF GEN ERR:", err);
      toast.error("Failed to generate PDF.", { id: "pdf-gen" });
    } finally {
      setIsExportingDevice(false);
    }
  };

  const handleDownloadInventoryPdf = async () => {
    setIsExporting(true)
    try {
      const element = hiddenDevicesReportRef.current
      if (!element) return

      const elements = Array.from(element.getElementsByTagName("*"));
      const computedStyles = elements.map(el => {
        const style = window.getComputedStyle(el);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          borderWidth: style.borderWidth,
          borderStyle: style.borderStyle,
          padding: style.padding,
          display: style.display,
          flexDirection: style.flexDirection,
          alignItems: style.alignItems,
          justifyContent: style.justifyContent,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          gap: style.gap,
          width: style.width,
          height: style.height,
          boxShadow: style.boxShadow.includes('lab') || style.boxShadow.includes('oklch') ? 'none' : style.boxShadow
        };
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const clonedElements = Array.from(clonedDoc.getElementsByTagName("*"));
          clonedElements.forEach((el, i) => {
             const cel = el as HTMLElement;
             const s = computedStyles[i];
             if (!s) return;
             
             cel.style.color = s.color.includes('lab') || s.color.includes('oklch') ? '#000000' : s.color;
             cel.style.backgroundColor = s.backgroundColor.includes('lab') || s.backgroundColor.includes('oklch') ? '#ffffff' : s.backgroundColor;
             cel.style.borderColor = s.borderColor;
             cel.style.borderWidth = s.borderWidth;
             cel.style.borderStyle = s.borderStyle;
             cel.style.padding = s.padding;
             cel.style.display = s.display;
             cel.style.fontSize = s.fontSize;
             cel.style.fontWeight = s.fontWeight;
             cel.style.fontFamily = "Arial, sans-serif";
             cel.style.width = s.width;
             cel.style.height = s.height;
             cel.style.boxShadow = s.boxShadow;
             
             if (s.display === 'flex') {
                cel.style.flexDirection = s.flexDirection;
                cel.style.alignItems = s.alignItems;
                cel.style.justifyContent = s.justifyContent;
                cel.style.gap = s.gap;
             }
          });

          const heads = clonedDoc.getElementsByTagName("head");
          if (heads[0]) {
             while(heads[0].firstChild) heads[0].removeChild(heads[0].firstChild);
          }
        }
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.85)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST')
      pdf.save(`Devices_Inventory_Report_${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (err) {
      console.error("PDF generation failed:", err)
      alert("Error: Could not generate PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const clearFilters = () => {
    setFilterType(""); setFilterStatus(""); setFilterRepairsMax(10); setCurrentPage(1)
  }

  const filtered = useMemo(() => {
    let r = devices
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter(d => d.name.toLowerCase().includes(q) || d.brand.toLowerCase().includes(q) || d.imei.toLowerCase().includes(q) || d.owner.name.toLowerCase().includes(q))
    }
    if (filterType) r = r.filter(d => d.type === filterType)
    if (filterStatus) r = r.filter(d => d.status === filterStatus)
    r = r.filter(d => d.totalRepairs <= filterRepairsMax)
    return [...r].sort((a, b) => {
      if (sortKey === "price_desc") return b.price - a.price
      if (sortKey === "price_asc") return a.price - b.price
      if (sortKey === "repairs_desc") return b.totalRepairs - a.totalRepairs
      return 0
    })
  }, [devices, search, filterType, filterStatus, filterRepairsMax, sortKey])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const handleAdd = async () => {
    if (!form.model) { toast.error("Device Model/Name is required."); return; }
    if (!addSelectedCustomer) { toast.error("Please select a customer/owner."); return; }
    if (!user?.shopId) { toast.error("Session invalid. Please log in again."); return; }
    try {
      await createDevice({
        shopId: user.shopId,
        customerId: addSelectedCustomer.id,
        brand: form.brand === "Other" ? (customBrand || "Other") : form.brand,
        model: form.model,
        type: form.type,
        price: form.price ? Number(form.price) : 0,
        ...(form.imei ? { imei: form.imei } : {}),
        ...(form.serialNo ? { serialNo: form.serialNo } : {}),
      }).unwrap();
      toast.success("Device Registered Successfully!");
      setShowAddModal(false);
      setForm({ model: "", brand: "Apple", type: "Mobile Phone", imei: "", serialNo: "", price: "" });
      setAddSelectedCustomer(null);
      setAddCustomerSearch("");
      setCustomBrand("");
      setCustomModel("");
    } catch (e: any) {
      toast.error(e.data?.message || "Registration failed");
    }
  }

  const handleStatusUpdate = async (autoNotify: boolean, newStatus: DeviceStatus) => {
    if (!pendingStatusUpdate) return
    try {
      await updateDevice({
        id: pendingStatusUpdate.id,
        status: newStatus,
        autoUpdateCustomer: autoNotify
      }).unwrap();
      setPendingStatusUpdate(null)
      setIsStatusModalOpen(false)
      setActiveDropdown(null)
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  const [customModel, setCustomModel] = useState("")

  const handleSaveEdit = async () => {
    if (!editDevice) return;
    try {
      const payload: Record<string, any> = {};
      if (editForm.model) payload.model = editForm.model;
      if (editForm.brand) payload.brand = editForm.brand;
      if (editForm.type) payload.type = editForm.type;
      if (editForm.imei) payload.imei = editForm.imei;
      if (editForm.serialNo) payload.serialNo = editForm.serialNo;
      if (editForm.price !== "") payload.price = Number(editForm.price);
      await updateDevice({ id: editDevice.id, ...payload }).unwrap();
      toast.success("Device updated successfully!");
      setEditDevice(null);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update device.");
    }
  }

  const handleDelete = async () => {
    if (!deleteDevice) return
    try {
      await deleteDeviceMutation(deleteDevice.id).unwrap();
      setDeleteDevice(null)
    } catch (err) {
      console.error("Failed to delete device", err)
    }
  }

  const handleExportCSV = () => {
    const rows = [["Name", "Brand", "Type", "IMEI", "Owner", "Phone", "Warranty", "Status", "Repairs", "Registered"],
    ...filtered.map(d => [d.name, d.brand, d.type, d.imei, d.owner.name, d.owner.phone, d.warranty.status, d.status, d.totalRepairs, d.registered])]
    const csv = rows.map(r => r.join(",")).join("\n")
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    a.download = "devices.csv"; a.click()
  }

  const handleExportPDF = handleDownloadInventoryPdf;
  const hasFilters = filterType || filterStatus || filterRepairsMax < 10

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        <DashboardHeader />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col flex-1">

            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-4">
              <Link href="/admin/dashboard" className="text-[#4F46E5] hover:underline">{mounted ? t('dashboard.title') : 'Dashboard'}</Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              <span className="text-foreground">{mounted ? t('devicesPage.title') : 'Devices Management'}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-[26px] font-black text-foreground tracking-tight">{mounted ? t('devicesPage.title') : 'Devices Management'}</h1>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[13px] font-bold">{filtered.length} {mounted ? t('devicesPage.total') : 'Devices'}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button onClick={() => { setShowExportMenu(p => !p); setShowSortMenu(false) }} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-card text-[13px] font-semibold text-foreground hover:bg-muted shadow-sm focus:outline-none">
                    {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4 text-muted-foreground" />} {mounted ? t('devicesPage.export') : 'Export'} <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  {showExportMenu && (
                    <div className="absolute top-12 right-0 w-44 bg-card border border-border rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                      <button onClick={() => { handleExportPDF(); setShowExportMenu(p => !p) }} className="w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center gap-2"><FileDown className="h-4 w-4 text-[#4F46E5]" />Export as PDF</button>
                      <button onClick={() => { handleExportCSV(); setShowExportMenu(p => !p) }} className="w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center gap-2"><FileDown className="h-4 w-4 text-[#10B981]" />Export as CSV</button>
                    </div>
                  )}
                </div>
                {user?.role !== 'TECHNICIAN' && (
                  <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#4F46E5] text-[13px] font-bold text-white hover:bg-[#4338CA] shadow-sm transition-colors focus:outline-none">
                    <Plus className="h-4 w-4" /> {mounted ? t('devicesPage.register') : 'Register Device'}
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }} type="text" placeholder={mounted ? t('devicesPage.searchPlaceholder') : "Search device, IMEI, owner..."} className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-card text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] shadow-sm placeholder:text-muted-foreground/70" />
              </div>

              <div className="relative">
                <button onClick={() => { setShowSortMenu(p => !p); setShowExportMenu(false) }} className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-card text-[12px] font-medium text-muted-foreground hover:bg-muted shadow-sm focus:outline-none">
                  {mounted ? t('devicesPage.sort') : 'Sort'}: {SORT_OPTIONS.find(s => s.value === sortKey)?.label} <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {showSortMenu && (
                  <div className="absolute top-12 left-0 w-52 bg-card border border-border rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    {SORT_OPTIONS.map(o => (
                      <button key={o.value} onClick={() => { setSortKey(o.value as SortKey); setShowSortMenu(false); setCurrentPage(1) }} className={`w-full px-4 py-2.5 text-left text-[13px] font-semibold hover:bg-muted flex items-center justify-between ${sortKey === o.value ? "text-[#4F46E5]" : "text-foreground"}`}>
                        {o.label}{sortKey === o.value && <Check className="h-3.5 w-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => setIsFiltersOpen(p => !p)} className={`flex items-center gap-2 h-10 px-5 rounded-lg border font-bold text-[13px] focus:outline-none shadow-sm transition-colors ${isFiltersOpen ? "bg-primary/10 text-primary border-[#4F46E5]/30" : "bg-card text-foreground border-border hover:bg-muted"}`}>
                <Filter className={`h-4 w-4 ${isFiltersOpen ? "text-[#4F46E5]" : "text-muted-foreground"}`} /> {mounted ? t('devicesPage.filters') : 'Filters'}
                {hasFilters ? <span className="h-5 w-5 rounded-full bg-[#4F46E5] text-white text-[10px] font-bold flex items-center justify-center">!</span> : null}
              </button>

              <div className="flex items-center bg-card border border-border rounded-lg p-1 shadow-sm ml-auto">
                <button onClick={() => setViewMode("list")} className={`h-8 w-9 rounded-md flex items-center justify-center transition-colors focus:outline-none ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                </button>
                <button onClick={() => setViewMode("grid")} className={`h-8 w-9 rounded-md flex items-center justify-center transition-colors focus:outline-none ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
              </div>
            </div>

            {isFiltersOpen && (
              <div className="mb-5 bg-card border border-border rounded-xl shadow-md p-6 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[15px] font-bold text-foreground">{mounted ? t('devicesPage.filters') : 'Filters'}</h3>
                  <button onClick={clearFilters} className="text-[12px] font-bold text-[#4F46E5] hover:underline focus:outline-none">{mounted ? t('devicesPage.clearAll') : 'Clear All'}</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[12px] font-bold text-foreground mb-3">{mounted ? t('devicesPage.deviceType') : 'Device Type'}</p>
                    <div className="flex flex-wrap gap-2">
                      {TYPES.map(type => (
                        <button
                          key={type.value}
                          onClick={() => setFilterType(type.value)}
                          className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all ${filterType === type.value
                              ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                              : "bg-card border-border text-muted-foreground hover:bg-muted"
                            }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-foreground mb-3">{mounted ? t('devicesPage.status') : 'Status'}</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map(status => (
                        <button
                          key={status.value}
                          onClick={() => setFilterStatus(status.value)}
                          className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all ${filterStatus === status.value
                              ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                              : "bg-card border-border text-muted-foreground hover:bg-muted"
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

            {paginated.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-24 bg-card rounded-xl border border-border shadow-sm mb-6">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4"><Smartphone className="h-8 w-8 text-muted-foreground" /></div>
                <h3 className="text-[16px] font-black text-foreground mb-1">{mounted ? t('devicesPage.noDevices') : 'No Devices Found'}</h3>
                <p className="text-[13px] text-muted-foreground">{mounted ? t('devicesPage.adjustFilters') : 'Adjust filters or register a new device.'}</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                {paginated.map(d => (
                  <div key={d.id} className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md hover:border-[#4F46E5]/30 transition-all flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${DEVICE_ICON_COLOR[d.type]}`}><DeviceIcon type={d.type} className="h-6 w-6" /></div>
                        <div>
                          <p className="text-[14px] font-black text-foreground leading-tight">{d.name}</p>
                          {user?.role !== 'TECHNICIAN' && <p className="text-[11px] text-muted-foreground font-bold">Rs. {d.price.toLocaleString()}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewDevice(d)} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted transition-colors focus:outline-none"><Eye className="h-3.5 w-3.5" /></button>
                        <button onClick={() => { setEditDevice({ ...d }); setEditForm({ model: d.name, brand: d.brand, type: d.type as DeviceType, imei: (d as any).rawImei || '', serialNo: (d as any).rawSerialNo || '', price: d.price || "" }) }} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted transition-colors focus:outline-none"><Edit2 className="h-3.5 w-3.5" /></button>
                        {user?.role !== 'TECHNICIAN' && (
                          <button onClick={() => setDeleteDevice(d)} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-550 transition-colors focus:outline-none"><Trash2 className="h-3.5 w-3.5" /></button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 mb-4 pb-4 border-b border-border/60">
                      <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-medium">IMEI</span><span className="font-bold text-foreground font-mono text-[11px]">{d.imei}</span></div>
                      <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-medium">Owner</span><span className="font-bold text-foreground">{d.owner.name}</span></div>
                      <div className="flex justify-between text-[12px]"><span className="text-muted-foreground font-medium">Registered</span><span className="font-semibold text-foreground">{d.registered}</span></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === d.id ? null : d.id) }} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${STATUS_STYLE[d.status]} hover:bg-opacity-80`}>
                          <StatusIcon s={d.status} />{STATUSES.find(s => s.value === d.status)?.label || d.status} <ChevronDown className="h-3 w-3 opacity-50" />
                        </button>
                        {activeDropdown === d.id && (
                          <div className="absolute bottom-full left-0 mb-2 w-36 bg-card border border-border rounded-xl shadow-xl z-[60] py-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
                            {STATUSES.map(st => (
                              <button key={st.value} onClick={() => { setPendingStatusUpdate({ id: d.id, status: st.value as DeviceStatus }); setIsStatusModalOpen(true); setActiveDropdown(null) }} className={`w-full px-4 py-2.5 text-left text-[11px] font-bold hover:bg-muted/50 transition-colors ${d.status === st.value ? "text-[#4F46E5] bg-primary/10" : "text-foreground"}`}>{st.label}</button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${WARRANTY_STYLE[d.warranty.status]}`}><WarrantyIcon w={d.warranty.status} />{d.warranty.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border shadow-sm mb-6 overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead><tr className="bg-muted/30 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-5 py-4">{mounted ? t('devicesPage.device') : 'Device'}</th>
                    <th className="px-5 py-4">{mounted ? t('devicesPage.owner') : 'Owner'}</th>
                    <th className="px-5 py-4">{mounted ? t('devicesPage.warranty') : 'Warranty'}</th>
                    <th className="px-5 py-4">{mounted ? t('devicesPage.status') : 'Status'}</th>
                    <th className="px-5 py-4 text-center">{mounted ? t('devicesPage.actions') : 'Actions'}</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border/60">
                    {paginated.map(d => (
                      <tr key={d.id} className="hover:bg-muted/50 transition-colors group">
                        <td className="px-5 py-4"><div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${DEVICE_ICON_COLOR[d.type]}`}><DeviceIcon type={d.type} className="h-5 w-5" /></div>
                          <div>
                            <p className="text-[13px] font-black text-foreground leading-tight">{d.name}</p>
                            {user?.role !== 'TECHNICIAN' && <p className="text-[11px] font-bold text-[#4F46E5]">Rs. {d.price.toLocaleString()}</p>}
                          </div>
                        </div></td>
                        <td className="px-5 py-4"><div><p className="text-[13px] font-bold text-foreground">{d.owner.name}</p><p className="text-[11px] text-muted-foreground">{d.owner.phone}</p></div></td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${WARRANTY_STYLE[d.warranty.status]}`}><WarrantyIcon w={d.warranty.status} />{d.warranty.status}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="relative">
                            <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === d.id ? null : d.id) }} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border transition-colors ${STATUS_STYLE[d.status]} hover:shadow-sm`}>
                              <StatusIcon s={d.status} />{STATUSES.find(s => s.value === d.status)?.label || d.status} <ChevronDown className="h-3 w-3 opacity-60" />
                            </button>
                            {activeDropdown === d.id && (
                              <div className="absolute top-full left-0 mt-2 w-36 bg-card border border-border rounded-xl shadow-2xl z-[60] py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                                {STATUSES.map(st => (
                                  <button key={st.value} onClick={() => { setPendingStatusUpdate({ id: d.id, status: st.value as DeviceStatus }); setIsStatusModalOpen(true); setActiveDropdown(null) }} className={`w-full px-4 py-2.5 text-left text-[11px] font-bold hover:bg-muted/50 transition-colors ${d.status === st.value ? "text-[#4F46E5] bg-primary/10" : "text-foreground"}`}>{st.label}</button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center"><div className="flex items-center justify-center gap-1">
                          <button onClick={() => setViewDevice(d)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted transition-colors focus:outline-none"><Eye className="h-3.5 w-3.5" /></button>
                          <button onClick={() => { setEditDevice({ ...d }); setEditForm({ model: d.name, brand: d.brand, type: d.type as DeviceType, imei: (d as any).rawImei || '', serialNo: (d as any).rawSerialNo || '', price: d.price || "" }) }} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:bg-muted transition-colors focus:outline-none"><Edit2 className="h-3.5 w-3.5" /></button>
                          {user?.role !== 'TECHNICIAN' && (
                            <button onClick={() => setDeleteDevice(d)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"><Trash2 className="h-3.5 w-3.5" /></button>
                          )}
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-border">
              <span className="text-[13px] text-muted-foreground font-medium">{mounted ? t('customers.showing') : 'Showing'} <span className="font-bold text-foreground">{filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)}</span> {mounted ? t('customers.of') : 'of'} <span className="font-bold text-foreground">{filtered.length}</span> {mounted ? t('devicesPage.total') : 'devices'}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center h-8 px-3 text-[13px] font-semibold text-muted-foreground hover:bg-muted rounded disabled:opacity-40 focus:outline-none"><ChevronLeft className="h-4 w-4 mr-1" />Prev</button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex items-center h-8 px-3 text-[13px] font-semibold text-foreground hover:bg-muted rounded border border-border bg-card disabled:opacity-40 focus:outline-none">Next<ChevronRight className="h-4 w-4 ml-1" /></button>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                Show: <select value={perPage} onChange={e => { setPerPage(+e.target.value); setCurrentPage(1) }} className="h-8 px-2 rounded border border-border bg-card text-foreground font-bold focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option></select> per page
              </div>
            </div>
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-[600px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/30">
              <h2 className="text-[18px] font-black text-foreground flex items-center gap-2"><Plus className="h-5 w-5 text-[#4F46E5]" />Register New Device</h2>
              <button onClick={() => setShowAddModal(false)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[78vh] overflow-y-auto custom-scrollbar">
              {/* Row 1: Model + Brand */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Device Model / Name *</label>
                  <Autocomplete
                    options={(DEVICE_MODELS_BY_BRAND[form.brand] || []).map(m => ({ value: m, label: m }))}
                    value={form.model}
                    onChange={v => setForm(p => ({ ...p, model: v }))}
                    placeholder="Search or type model..."
                    className="h-11 rounded-xl border-border"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Brand *</label>
                  <Autocomplete 
                    options={BRANDS.map(b => ({ value: b, label: b }))}
                    value={form.brand}
                    onChange={v => {
                      setForm(p => ({ ...p, brand: v, model: "" })); 
                    }}
                    placeholder="Search or type brand..."
                    className="h-11 rounded-xl border-border"
                  />
                </div>
              </div>
              {/* Row 2: Type */}
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Device Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as DeviceType }))} className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:outline-none focus:border-[#4F46E5] bg-background text-foreground appearance-none outline-none">
                  {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              {/* Row 3: IMEI + Serial */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">IMEI Number</label>
                  <input value={form.imei} onChange={e => setForm(p => ({ ...p, imei: e.target.value }))} placeholder="15-digit IMEI (Optional)" className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-mono focus:outline-none focus:border-[#4F46E5] bg-background text-foreground" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Serial Number</label>
                  <input value={form.serialNo} onChange={e => setForm(p => ({ ...p, serialNo: e.target.value }))} placeholder="Manufacturer serial (Optional)" className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-mono focus:outline-none focus:border-[#4F46E5] bg-background text-foreground" />
                </div>
              </div>
              {/* Price Field */}
              {user?.role !== 'TECHNICIAN' && (
                <div>
                  <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Selling Price (Rs.)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-[13px]">Rs.</span>
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                      placeholder="0.00"
                      className="w-full h-11 rounded-xl border border-border pl-12 pr-4 text-[14px] font-black text-[#4F46E5] focus:outline-none focus:border-[#4F46E5] bg-background"
                    />
                  </div>
                </div>
              )}
              {/* Customer Search */}
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Customer / Owner *</label>
                {addSelectedCustomer ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-emerald-400 bg-emerald-950/20">
                    <div className="h-9 w-9 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400 text-[13px] font-black">{addSelectedCustomer.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-black text-foreground truncate">{addSelectedCustomer.name}</p>
                      <p className="text-[11px] text-muted-foreground font-medium">{addSelectedCustomer.phone}</p>
                    </div>
                    <button onClick={() => setAddSelectedCustomer(null)} className="text-muted-foreground hover:text-red-500 transition-colors"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      value={addCustomerSearch}
                      onChange={e => { setAddCustomerSearch(e.target.value); setShowCustomerDropdown(true) }}
                      onFocus={() => setShowCustomerDropdown(true)}
                      placeholder="Search customer by name or phone..."
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-border text-[13px] font-bold focus:outline-none focus:border-[#4F46E5] transition-all bg-background text-foreground"
                    />
                    {showCustomerDropdown && filteredCustomers.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-[110] max-h-[200px] overflow-y-auto">
                        {filteredCustomers.map((c: any) => (
                          <button key={c.id} onClick={() => { setAddSelectedCustomer({ id: c.id, name: c.name, phone: c.phone || '—' }); setShowCustomerDropdown(false); setAddCustomerSearch('') }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left border-b border-border/40 last:border-0">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[11px] font-black shrink-0">{c.name?.charAt(0) || '?'}</div>
                            <div><p className="text-[13px] font-bold text-foreground">{c.name}</p><p className="text-[11px] text-muted-foreground">{c.phone || 'No phone'}</p></div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border">
                <button onClick={() => setShowAddModal(false)} className="flex-1 h-12 rounded-xl border border-border bg-card text-foreground font-bold hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleAdd} disabled={isCreating || !form.model || !addSelectedCustomer} className="flex-1 h-12 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-lg shadow-[#4F46E5]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}Register Device
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editDevice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-[560px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/30">
              <div>
                <h2 className="text-[18px] font-black text-foreground flex items-center gap-2"><Edit2 className="h-5 w-5 text-[#4F46E5]" />Edit Device</h2>
                <p className="text-[12px] text-muted-foreground font-medium mt-0.5">Updating: <span className="font-bold text-foreground">{editDevice.name}</span></p>
              </div>
              <button onClick={() => setEditDevice(null)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted focus:outline-none"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Device Model / Name</label>
                  <Autocomplete
                    options={(DEVICE_MODELS_BY_BRAND[editForm.brand] || []).map(m => ({ value: m, label: m }))}
                    value={editForm.model}
                    onChange={v => setEditForm(p => ({ ...p, model: v }))}
                    placeholder="Search or type model..."
                    className="h-11 rounded-xl border-border"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Brand</label>
                  <Autocomplete 
                    options={BRANDS.map(b => ({ value: b, label: b }))}
                    value={editForm.brand}
                    onChange={v => {
                      setEditForm(p => ({ ...p, brand: v, model: "" }));
                    }}
                    placeholder="Search or type brand..."
                    className="h-11 rounded-xl border-border"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Device Type</label>
                <select value={editForm.type} onChange={e => setEditForm(p => ({ ...p, type: e.target.value as DeviceType }))} className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:outline-none focus:border-[#4F46E5] bg-background text-foreground appearance-none">
                  {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">IMEI Number</label>
                  <input value={editForm.imei} onChange={e => setEditForm(p => ({ ...p, imei: e.target.value }))} placeholder="15-digit IMEI" className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-mono focus:outline-none focus:border-[#4F46E5] bg-background text-foreground" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Serial Number</label>
                  <input value={editForm.serialNo} onChange={e => setEditForm(p => ({ ...p, serialNo: e.target.value }))} placeholder="Manufacturer serial" className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-mono focus:outline-none focus:border-[#4F46E5] bg-background text-foreground" />
                </div>
              </div>
              {/* Price Field */}
              <div>
                <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Selling Price (Rs.)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-[13px]">Rs.</span>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full h-11 rounded-xl border border-border pl-12 pr-4 text-[14px] font-black text-[#4F46E5] focus:outline-none focus:border-[#4F46E5] bg-background"
                  />
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border">
                <button onClick={() => setEditDevice(null)} className="flex-1 h-11 rounded-xl border border-border bg-card text-foreground font-bold hover:bg-muted focus:outline-none">Cancel</button>
                <button onClick={handleSaveEdit} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md focus:outline-none">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewDevice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="bg-background w-full max-w-[900px] h-[90vh] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-border flex flex-col">
              {/* STICKY ACTION HEADER */}
              <div className="w-full bg-card border-b border-border p-6 flex justify-end gap-3 shrink-0 z-20">
                <button 
                  onClick={handleDownloadDevicePdf} 
                  disabled={isExportingDevice}
                  className={`h-11 px-6 rounded-full bg-[#4F46E5] text-white text-[14px] font-black flex items-center gap-2.5 shadow-xl transition-all active:scale-95 ${isExportingDevice ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4338CA] hover:shadow-indigo-200'}`}
                >
                  <FileDown className={`h-4 w-4 ${isExportingDevice ? 'animate-bounce' : ''}`} /> 
                  {isExportingDevice ? 'Generating...' : 'Download Device Invoice'}
                </button>
                <button 
                  onClick={() => setViewDevice(null)} 
                  className="h-11 w-11 rounded-full bg-muted/30 text-muted-foreground flex items-center justify-center hover:bg-muted hover:text-foreground transition-all focus:outline-none active:scale-95 border border-border"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* SCROLLABLE PAPER AREA */}
              <div className="flex-1 overflow-y-auto p-12 flex justify-center bg-muted/10 custom-scrollbar">
                {/* PAPER CONTENT */}
                <div className="w-full max-w-[800px] bg-white shadow-sm border border-slate-200 p-16 flex flex-col min-h-[1050px] relative overflow-hidden text-[#0f172a]">
                    {/* BRANDING HEADER */}
                    <div className="flex justify-between items-start mb-20">
                        <div>
                           <div className="flex items-center gap-2.5 mb-2">
                             <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-xl">
                               {(user?.shopName || "All Fix Private Limited").charAt(0).toUpperCase()}
                             </div>
                             <h2 className="text-[26px] font-black text-[#0F172A] tracking-tighter uppercase">
                               {user?.shopName || "All Fix Private Limited"}
                             </h2>
                           </div>
                           <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                              <p className="flex items-center gap-1.5 underline decoration-[#4F46E5] underline-offset-4">
                                {user?.shopWebsite || "Digital Repair Hub"}
                              </p>
                              <p>{user?.shopEmail || "contact@allfix.lk"}</p>
                              <p>{user?.shopPhone || "+94 11 234 5678"}</p>
                           </div>
                        </div>
                        <div className="text-right text-[11px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
                              <p>Premium Service Center</p>
                              <p>{user?.shopAddress ? `${user.shopAddress}${user.shopCity ? `, ${user.shopCity}` : ''}` : "Colombo, Sri Lanka"}</p>
                              <p className="text-[#4F46E5] mt-1">
                                {user?.shopTaxNumber ? `VAT REG: ${user.shopTaxNumber}` : "VAT REG: 009876543-X"}
                              </p>
                        </div>
                    </div>

                    {/* LOGISTICS & META GRID */}
                    <div className="grid grid-cols-4 gap-8 mb-16">
                        <div className="col-span-1 border-l-2 border-[#4F46E5] pl-5">
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black">Registered to,</p>
                           <p className="text-[14px] font-black text-[#0F172A] mb-1">{viewDevice.owner.name}</p>
                           <p className="text-[12px] text-slate-500 font-bold leading-relaxed">{viewDevice.owner.phone}<br/>Client Address Stored<br/>Verification Required</p>
                        </div>
                        <div className="col-span-2 px-8 border-x border-slate-50">
                           <div className="grid grid-cols-2 gap-y-8">
                              <div>
                                 <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Device Reference</p>
                                 <p className="text-[13px] font-black text-[#0F172A] font-mono bg-slate-50 px-2 py-1 rounded inline-block border border-slate-100">#DEV-{viewDevice.id.slice(-6).toUpperCase()}</p>
                              </div>
                              <div>
                                 <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Registration Date</p>
                                 <p className="text-[13px] font-black text-[#0F172A]">{viewDevice.registered}</p>
                              </div>
                              <div>
                                 <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Asset Category</p>
                                 <p className="text-[13px] font-black text-[#0F172A] capitalize">{viewDevice.type}</p>
                              </div>
                              <div>
                                 <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Operational Status</p>
                                 <span 
                                   className="text-[10px] font-black px-2 py-0.5 rounded-md border uppercase inline-block"
                                   style={{ 
                                     backgroundColor: '#ecfdf5',
                                     color: '#047857',
                                     borderColor: '#a7f3d0',
                                   }}
                                  >
                                   {viewDevice.status}
                                 </span>
                              </div>
                           </div>
                        </div>
                        <div className="col-span-1 text-right bg-slate-50/50 p-6 rounded-2xl border border-slate-100 h-fit">
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Estimated Value</p>
                           <p className="text-[32px] font-black text-[#0F172A] tracking-tighter leading-none mb-1">
                             <span className="text-[14px] text-slate-400 mr-1.5">Rs.</span>
                             {(viewDevice.price || 0).toLocaleString()}
                           </p>
                           <div className="mt-8 border-t border-slate-200 pt-4">
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-black underline decoration-[#4F46E5] underline-offset-4">Valuation Logic</p>
                              <p className="text-[12px] font-black text-[#4F46E5]">Market Baseline</p>
                           </div>
                        </div>
                    </div>

                    {/* ITEMS TABLE */}
                    <div className="flex-1">
                        <div className="grid grid-cols-12 pb-4 mb-8 border-b-2 border-[#0F172A]">
                            <div className="col-span-6 text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Asset Specification</div>
                            <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Brand</div>
                            <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Identifier</div>
                            <div className="col-span-2 text-right text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Value</div>
                        </div>
                        
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className="grid grid-cols-12 items-center">
                              <div className="col-span-6">
                                 <p className="text-[14px] font-black text-[#0F172A] mb-1">{viewDevice.name}</p>
                                 <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Primary Technical Asset Profile</p>
                              </div>
                              <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center uppercase">{viewDevice.brand}</div>
                              <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center font-mono">{viewDevice.imei || "N/A"}</div>
                              <div className="col-span-2 text-right text-[13px] font-black text-[#0F172A]">Rs. {(viewDevice.price || 0).toLocaleString()}</div>
                          </div>

                          <div className="grid grid-cols-12 items-center pt-8 border-t border-slate-50">
                              <div className="col-span-6">
                                 <p className="text-[14px] font-black text-[#0F172A] mb-1">Maintenance History Record</p>
                                 <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Verified Service Job Analytics</p>
                              </div>
                              <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">{viewDevice.totalRepairs} Jobs</div>
                              <div className="col-span-2 text-[13px] font-black text-[#4F46E5] text-center font-bold italic">Integrity Verified</div>
                              <div className="col-span-2 text-right text-[11px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Certified Asset</div>
                          </div>
                        </div>

                        {/* FINANCIAL TOTALS */}
                        <div className="flex justify-end pt-12 mt-12 border-t-4 border-slate-50">
                            <div className="w-[340px] space-y-4">
                                <div className="flex justify-between items-center text-[13px] font-bold text-slate-500">
                                   <span>Market Baseline Net</span>
                                   <span className="text-[#0F172A]">Rs. {((viewDevice.price || 0) * 0.9).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 pb-5 border-b border-slate-100">
                                   <span>Valuation Fee (10.0%)</span>
                                   <span className="text-[#0F172A]">Rs. {((viewDevice.price || 0) * 0.1).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                   <span className="text-[16px] font-black text-[#0F172A] uppercase tracking-tighter">Total Asset Valuation</span>
                                   <div className="text-right">
                                      <p className="text-[24px] font-black text-[#4F46E5] tracking-tighter leading-none">Rs. {(viewDevice.price || 0).toLocaleString()}</p>
                                      <p className="text-[9px] text-slate-400 font-black uppercase mt-1">Authorized for Inventory</p>
                                   </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PROFESSIONAL FOOTER */}
                    <div className="mt-20 pt-16 border-t border-slate-100 border-dashed">
                       <p className="text-[12px] font-black text-[#0F172A] mb-8 flex items-center gap-2">
                         <ArrowUpRight className="h-4 w-4 text-[#4F46E5]" /> 
                         Thank you for choosing {user?.shopName || "All Fix Private Limited"} for your professional technical needs.
                       </p>
                       
                       <div className="grid grid-cols-2 gap-12">
                         <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black underline decoration-slate-200 underline-offset-4">General Terms</p>
                            <p className="text-[11px] text-slate-500 font-bold leading-relaxed italic">
                               This document is a certified inventory record generated by the {user?.shopName || "All Fix Private Limited"} database. 
                               It reflects the technical specifications and valuation of the asset at the time of report generation.
                            </p>
                         </div>
                         <div className="flex flex-col items-end">
                            <div className="w-32 h-16 bg-slate-50 rounded-lg border border-slate-100 mb-2 flex items-center justify-center">
                               <p className="text-[9px] text-slate-300 font-black uppercase rotate-[-5deg]">Stamp Required</p>
                            </div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Authorized Signature</p>
                         </div>
                       </div>

                       <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                          AllFix © 2026
                       </div>
                    </div>
                </div>
              </div>
           </div>
        </div>
      )}

      {deleteDevice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-[400px] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0"><Trash2 className="h-6 w-6 text-red-500" /></div>
              <div><h2 className="text-[17px] font-black text-foreground">{mounted ? t('devicesPage.deleteConfirm') : 'Delete Device?'}</h2><p className="text-[13px] text-muted-foreground">This will permanently remove <strong>{deleteDevice.name}</strong>.</p></div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button onClick={() => setDeleteDevice(null)} className="flex-1 h-10 rounded-xl border border-border bg-card text-foreground font-bold hover:bg-muted focus:outline-none">Cancel</button>
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
        {viewDevice && (
            <div 
              ref={deviceDetailRef}
              className="w-[800px] bg-white p-16 flex flex-col min-h-[1100px]"
            >
              {/* BRANDING HEADER */}
              <div className="flex justify-between items-start mb-20">
                  <div>
                     <div className="flex items-center gap-2.5 mb-2">
                       <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-xl">
                         {(user?.shopName || "All Fix Private Limited").charAt(0).toUpperCase()}
                       </div>
                       <h2 className="text-[26px] font-black text-[#0F172A] tracking-tighter uppercase">
                         {user?.shopName || "All Fix Private Limited"}
                       </h2>
                     </div>
                     <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        <p className="flex items-center gap-1.5 underline decoration-[#4F46E5] underline-offset-4">
                          {user?.shopWebsite || "Digital Repair Hub"}
                        </p>
                        <p>{user?.shopEmail || "contact@allfix.lk"}</p>
                        <p>{user?.shopPhone || "+94 11 234 5678"}</p>
                     </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
                        <p>Premium Service Center</p>
                        <p>{user?.shopAddress ? `${user.shopAddress}${user.shopCity ? `, ${user.shopCity}` : ''}` : "Colombo, Sri Lanka"}</p>
                        <p className="text-[#4F46E5] mt-1">
                          {user?.shopTaxNumber ? `VAT REG: ${user.shopTaxNumber}` : "VAT REG: 009876543-X"}
                        </p>
                  </div>
              </div>

              {/* LOGISTICS & META GRID */}
              <div className="grid grid-cols-4 gap-8 mb-16">
                  <div className="col-span-1 border-l-2 border-[#4F46E5] pl-5">
                     <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black">Registered to,</p>
                     <p className="text-[14px] font-black text-[#0F172A] mb-1">{viewDevice.owner.name}</p>
                     <p className="text-[12px] text-slate-500 font-bold leading-relaxed">{viewDevice.owner.phone}<br/>Client Address Stored<br/>Verification Required</p>
                  </div>
                  <div className="col-span-2 px-8 border-x border-slate-50">
                     <div className="grid grid-cols-2 gap-y-8">
                        <div>
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Device Reference</p>
                           <p className="text-[13px] font-black text-[#0F172A] font-mono bg-slate-50 px-2 py-1 rounded inline-block border border-slate-100">#DEV-{viewDevice.id.slice(-6).toUpperCase()}</p>
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Registration Date</p>
                           <p className="text-[13px] font-black text-[#0F172A]">{viewDevice.registered}</p>
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Asset Category</p>
                           <p className="text-[13px] font-black text-[#0F172A] capitalize">{viewDevice.type}</p>
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Operational Status</p>
                           <span 
                             className="text-[10px] font-black px-2 py-0.5 rounded-md border uppercase inline-block"
                             style={{ 
                               backgroundColor: '#ecfdf5',
                               color: '#047857',
                               borderColor: '#a7f3d0',
                             }}
                            >
                             {viewDevice.status}
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className="col-span-1 text-right bg-slate-50/50 p-6 rounded-2xl border border-slate-100 h-fit">
                     <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Estimated Value</p>
                     <p className="text-[32px] font-black text-[#0F172A] tracking-tighter leading-none mb-1">
                       <span className="text-[14px] text-slate-400 mr-1.5">Rs.</span>
                       {(viewDevice.price || 0).toLocaleString()}
                     </p>
                     <div className="mt-8 border-t border-slate-200 pt-4">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-black underline decoration-[#4F46E5] underline-offset-4">Valuation Logic</p>
                        <p className="text-[12px] font-black text-[#4F46E5]">Market Baseline</p>
                     </div>
                  </div>
              </div>

              {/* ITEMS TABLE */}
              <div className="flex-1">
                 <div className="grid grid-cols-12 pb-4 mb-8 border-b-2 border-[#0F172A]">
                     <div className="col-span-6 text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Asset Specification</div>
                     <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Brand</div>
                     <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Identifier</div>
                     <div className="col-span-2 text-right text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Value</div>
                 </div>
                 
                 <div className="space-y-8">
                   <div className="grid grid-cols-12 items-center">
                       <div className="col-span-6">
                          <p className="text-[14px] font-black text-[#0F172A] mb-1">{viewDevice.name}</p>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Primary Technical Asset Profile</p>
                       </div>
                       <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center uppercase">{viewDevice.brand}</div>
                       <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center font-mono">{viewDevice.imei || "N/A"}</div>
                       <div className="col-span-2 text-right text-[13px] font-black text-[#0F172A]">Rs. {(viewDevice.price || 0).toLocaleString()}</div>
                   </div>

                   <div className="grid grid-cols-12 items-center pt-8 border-t border-slate-50">
                       <div className="col-span-6">
                          <p className="text-[14px] font-black text-[#0F172A] mb-1">Maintenance History Record</p>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Verified Service Job Analytics</p>
                       </div>
                       <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">{viewDevice.totalRepairs} Jobs</div>
                       <div className="col-span-2 text-[13px] font-black text-[#4F46E5] text-center font-bold italic">Integrity Verified</div>
                       <div className="col-span-2 text-right text-[11px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Certified Asset</div>
                   </div>
                 </div>

                 {/* FINANCIAL TOTALS */}
                 <div className="flex justify-end pt-12 mt-12 border-t-4 border-slate-50">
                     <div className="w-[340px] space-y-4">
                         <div className="flex justify-between items-center text-[13px] font-bold text-slate-500">
                            <span>Market Baseline Net</span>
                            <span className="text-[#0F172A]">Rs. {((viewDevice.price || 0) * 0.9).toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 pb-5 border-b border-slate-100">
                            <span>Valuation Fee (10.0%)</span>
                            <span className="text-[#0F172A]">Rs. {((viewDevice.price || 0) * 0.1).toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between items-center pt-2">
                            <span className="text-[16px] font-black text-[#0F172A] uppercase tracking-tighter">Total Asset Valuation</span>
                            <div className="text-right">
                               <p className="text-[24px] font-black text-[#4F46E5] tracking-tighter leading-none">Rs. {(viewDevice.price || 0).toLocaleString()}</p>
                               <p className="text-[9px] text-slate-400 font-black uppercase mt-1">Authorized for Inventory</p>
                            </div>
                         </div>
                     </div>
                 </div>
              </div>

              {/* PROFESSIONAL FOOTER */}
              <div className="mt-20 pt-16 border-t border-slate-100 border-dashed">
                 <p className="text-[12px] font-black text-[#0F172A] mb-8 flex items-center gap-2">
                   <ArrowUpRight className="h-4 w-4 text-[#4F46E5]" /> 
                   Thank you for choosing {user?.shopName || "All Fix Private Limited"} for your professional technical needs.
                 </p>
                 
                 <div className="grid grid-cols-2 gap-12">
                   <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black underline decoration-slate-200 underline-offset-4">General Terms</p>
                      <p className="text-[11px] text-slate-500 font-bold leading-relaxed italic">
                        This document is a certified inventory record generated by the {user?.shopName || "All Fix Private Limited"} database. 
                        It reflects the technical specifications and valuation of the asset at the time of report generation.
                      </p>
                   </div>
                   <div className="flex flex-col items-end">
                      <div className="w-32 h-16 bg-slate-50 rounded-lg border border-slate-100 mb-2 flex items-center justify-center">
                         <p className="text-[9px] text-slate-300 font-black uppercase rotate-[-5deg]">Stamp Required</p>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Authorized Signature</p>
                   </div>
                 </div>
              </div>
            </div>
          )}

        <div
          ref={hiddenDevicesReportRef}
          className="w-[1000px] bg-white p-16 flex flex-col min-h-[1400px]"
        >
          <div className="flex justify-between items-start mb-16">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-2xl">
                  {(user?.shopName || "All Fix Private Limited").charAt(0).toUpperCase()}
                </div>
                <h2 className="text-[32px] font-black text-[#0F172A] tracking-tighter uppercase">
                  {user?.shopName || "All Fix Private Limited"}
                </h2>
              </div>
              <div className="text-[12px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                <p className="flex items-center gap-2 text-[#4F46E5]"><Smartphone className="h-4 w-4" /> Global Device Inventory</p>
                <p>Automated Stock Report</p>
                <p>Internal Record #DEV-{new Date().getFullYear()}</p>
              </div>
            </div>
            <div className="text-right text-[12px] text-slate-400 font-black uppercase tracking-widest leading-relaxed pt-2">
              <p>Premium Service Center</p>
              <p>{user?.shopAddress ? `${user.shopAddress}${user.shopCity ? `, ${user.shopCity}` : ''}` : "Colombo, Sri Lanka"}</p>
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
                {user?.shopName || "All Fix Private Limited"} Inventory Management System • {new Date().getFullYear()}
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
