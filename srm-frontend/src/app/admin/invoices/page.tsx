"use client"

import { useState, useMemo, useRef } from "react"
import Link from "next/link"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import {
  Search, Filter, ChevronDown, Plus, Eye,
  Grid, List as ListIcon, Calendar as CalendarIcon,
  ChevronRight, MoreVertical, Edit2, Download, Trash2, X, ChevronLeft, ArrowUpDown, Receipt, Box, Wrench, Smartphone, AlertCircle, ShoppingCart, Calendar, SlidersHorizontal, ArrowUpRight
} from "lucide-react"

// Exact Mock Dataset parsing Image 1 + Modified with Types
const mockInvoices = [
  { id: 1, invoiceId: "#REP-2026-001234", type: "client_repair", name: "Ahmed Hassan", phone: "+94 77 123 4567", amount: 8500, status: "Paid", date: "2026-01-25", staff: "John Smith", device: "iPhone 13 Pro" },
  { id: 2, invoiceId: "#REP-2026-001233", type: "client_repair", name: "Sarah Perera", phone: "+94 71 987 6543", amount: 6200, status: "Pending", date: "2026-01-25", staff: "Mike Chen", device: "iPad Air 5th Gen" },
  { id: 3, invoiceId: "#INV-2026-001232", type: "inventory_item", name: "TechSupplier Inc", phone: "+94 76 234 5678", amount: 12500, status: "Paid", date: "2025-01-25", staff: "Admin", device: "Internal" },
  { id: 4, invoiceId: "#INV-2026-001231", type: "inventory_item", name: "Retail Walk-In", phone: "+94 75 345 6789", amount: 15000, status: "Pending", date: "2025-11-20", staff: "Admin", device: "Internal" },
  { id: 5, invoiceId: "#REP-2026-001230", type: "client_repair", name: "Raj Jayawardena", phone: "+94 72 456 7890", amount: 9800, status: "Paid", date: "2026-02-14", staff: "Sarah Connor", device: "PlayStation 5" },
  { id: 6, invoiceId: "#REP-2024-001100", type: "client_repair", name: "Kamal Perera", phone: "+94 70 123 4567", amount: 5000, status: "Paid", date: "2024-03-15", staff: "Alex Kumar", device: "Samsung Galaxy S23" },
  { id: 7, invoiceId: "#INV-2026-001235", type: "inventory_item", name: "Ruwan Silva", phone: "#94 71 222 3333", amount: 22000, status: "Overdue", date: "2026-02-10", staff: "Admin", device: "Internal" },
]

const STAFF_LIST = ["John Smith", "Mike Chen", "Sarah Connor", "Alex Kumar", "Admin"]
const DEVICE_TYPES = ["phone", "tablet", "laptop", "console", "Internal"]

type SortKey = "date-new" | "date-old" | "amount-high" | "amount-low" | "name-az" | "name-za" | "id-az"
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "date-new",    label: "Date (Newest)" },
  { value: "date-old",    label: "Date (Oldest)" },
  { value: "amount-high", label: "Amount (Highest)" },
  { value: "amount-low",  label: "Amount (Lowest)" },
  { value: "name-az",     label: "Name (A-Z)" },
  { value: "name-za",     label: "Name (Z-A)" },
  { value: "id-az",       label: "Invoice ID" },
]

const INVOICE_TYPES = ["client_repair", "inventory_item"]
const INVOICE_STATUSES = ["Paid", "Pending", "Overdue"]

const STATUS_STYLE: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Overdue: "bg-red-50 text-red-600 border-red-200",
}

// Hex-only styles for PDF generation to avoid "lab()" color parsing errors in html2canvas
const PDF_STATUS_STYLE: Record<string, string> = {
  Paid: "background-color: #ecfdf5; color: #047857; border-color: #a7f3d0;",
  Pending: "background-color: #fffbeb; color: #b45309; border-color: #fde68a;",
  Overdue: "background-color: #fef2f2; color: #dc2626; border-color: #fecaca;",
}

export default function InvoicesManagementPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "calendar">("list")
  const [activeTab, setActiveTab] = useState("All")
  const [invoicesState, setInvoicesState] = useState(mockInvoices)
  
  // Interactive Engines
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>("date-new")

  // Advanced Filter State
  const [filterTypes, setFilterTypes] = useState<string[]>([])
  const [filterStatuses, setFilterStatuses] = useState<string[]>([])
  const [filterStaff, setFilterStaff] = useState<string[]>([])
  const [filterDevices, setFilterDevices] = useState<string[]>([])
  const [filterAmountRange, setFilterAmountRange] = useState({ min: 0, max: 100000 })
  const [filterDateFrom, setFilterDateFrom] = useState("")
  const [filterDateTo, setFilterDateTo] = useState("")

  // Master Modals
  const [viewDocumentTarget, setViewDocumentTarget] = useState<any | null>(null)
  const [editInvoiceTarget, setEditInvoiceTarget] = useState<any | null>(null)
  const [deleteFormTarget, setDeleteFormTarget] = useState<any | null>(null)
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false)
  
  // Create Modal State
  const [addInvoiceType, setAddInvoiceType] = useState<"client_repair" | "inventory_item">("client_repair")
  const [invoiceItems, setInvoiceItems] = useState([{ id: 1, name: "", sku: "", qty: 1, price: 0 }])
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  
  // Real PDF Refs
  const printRef = useRef<HTMLDivElement>(null)
  const hiddenPrintRef = useRef<HTMLDivElement>(null)
  const [hiddenInvoiceTarget, setHiddenInvoiceTarget] = useState<any | null>(null)

  const handleDownloadPDF = async (inv?: any) => {
    setIsGeneratingPDF(true)
    
    // Choose target element and filename
    const targetInv = inv || viewDocumentTarget || hiddenInvoiceTarget
    if (!targetInv) {
       setIsGeneratingPDF(false)
       return
    }

    try {
      // If we are downloading from row directly, we need to populate the hidden target first
      if (inv) {
         setHiddenInvoiceTarget(inv)
         // Wait for DOM to update with the new data
         await new Promise(r => setTimeout(r, 100))
      }

      const element = inv ? hiddenPrintRef.current : printRef.current
      if (!element) throw new Error("No element found trace #PDF-CAPTURE-ERR")

      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Fix: Translate modern color functions (oklch, lab, color-mix) to RGB for html2canvas compatibility
          const elements = clonedDoc.getElementsByTagName("*");
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            const style = window.getComputedStyle(el);
            
            // Check for problematic color functions in compute styles
            const colorProps = ['color', 'backgroundColor', 'borderColor', 'outlineColor', 'textDecorationColor', 'stopColor', 'fill', 'stroke'];
            colorProps.forEach(prop => {
              const val = (style as any)[prop];
              if (val && (val.includes('oklch') || val.includes('lab') || val.includes('color-mix'))) {
                // Force a fallback to a safe color if modern spaces are detected
                if (prop === 'backgroundColor') el.style.backgroundColor = '#ffffff';
                else if (prop === 'color') el.style.color = '#000000';
                else el.style[prop as any] = 'transparent';
              }
            });

            // Also check box-shadow which often contains color-mix in Tailwind 4
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
      pdf.save(`Invoice_${targetInv.invoiceId}.pdf`)
      
      if (inv) setHiddenInvoiceTarget(null)
    } catch (err) {
      console.error("PDF generation failed:", err)
      alert("Error: Could not generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const toggleFilter = <T extends string>(val: T, arr: T[], setter: (f: (p: T[]) => T[]) => void) =>
    setter(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val])

  const clearFilters = () => {
    setFilterTypes([]); setFilterStatuses([]); setFilterStaff([]); setFilterDevices([]);
    setFilterAmountRange({ min: 0, max: 100000 });
    setFilterDateFrom(""); setFilterDateTo(""); setSearchTerm("")
  }

  const handleStatusUpdate = (id: number, newStatus: string) => {
    setInvoicesState(p => p.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv))
  }
  
  const confirmDelete = () => {
    if (deleteFormTarget) {
       setInvoicesState(invoicesState.filter(inv => inv.id !== deleteFormTarget.id))
       setDeleteFormTarget(null)
    }
  }

  // MASTER FILTERING ENGINE
  const processedInvoices = useMemo(() => {
    let r = [...invoicesState];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      r = r.filter(inv => 
        inv.name.toLowerCase().includes(q) || 
        inv.invoiceId.toLowerCase().includes(q) ||
        inv.phone.includes(q)
      )
    }

    if (activeTab !== "All") {
      r = r.filter(inv => inv.date.includes(activeTab))
    }

    if (filterTypes.length) r = r.filter(inv => filterTypes.includes(inv.type))
    if (filterStatuses.length) r = r.filter(inv => filterStatuses.includes(inv.status))
    if (filterStaff.length) r = r.filter(inv => filterStaff.includes(inv.staff || ""))
    if (filterDevices.length) r = r.filter(inv => {
       const dev = (inv.device || "").toLowerCase();
       return filterDevices.some(f => dev.includes(f.toLowerCase()));
    })
    
    r = r.filter(inv => inv.amount >= filterAmountRange.min && inv.amount <= filterAmountRange.max)

    if (filterDateFrom) r = r.filter(inv => inv.date >= filterDateFrom)
    if (filterDateTo) r = r.filter(inv => inv.date <= filterDateTo)

    return r.sort((a, b) => {
      if (sortKey === "date-new") return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortKey === "date-old") return new Date(a.date).getTime() - new Date(b.date).getTime()
      if (sortKey === "amount-high") return b.amount - a.amount
      if (sortKey === "amount-low") return a.amount - b.amount
      if (sortKey === "name-az") return a.name.localeCompare(b.name)
      if (sortKey === "name-za") return b.name.localeCompare(a.name)
      if (sortKey === "id-az") return a.invoiceId.localeCompare(b.invoiceId)
      return 0
    })
  }, [invoicesState, searchTerm, activeTab, filterTypes, filterStatuses, filterAmountRange, filterDateFrom, filterDateTo, sortKey])


  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 flex flex-col pt-0 overflow-y-auto" onClick={() => { setActiveDropdownId(null); setIsSortOpen(false); }}>
          <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col">
            
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-4">
              <Link href="/admin/dashboard" className="hover:text-foreground transition-colors cursor-pointer text-[#4F46E5]">Dashboard</Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              <span className="text-[#0F172A]">Invoices</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <h1 className="text-[28px] font-black text-[#0F172A] tracking-tight">Invoice Management</h1>
              <button 
                onClick={() => setIsAddInvoiceOpen(true)}
                className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#4F46E5] text-[13px] font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors focus:outline-none"
              >
                <Plus className="h-4 w-4" /> Add Invoice
              </button>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div className="relative w-full lg:w-[420px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search by name, client, or invoice #"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-white text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto relative">
                <div className="flex flex-1 sm:flex-none gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsFiltersOpen(!isFiltersOpen); setIsSortOpen(false); }}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-4 rounded-lg border text-[13px] font-bold transition-all focus:outline-none whitespace-nowrap ${isFiltersOpen ? 'bg-[#4F46E5] border-[#4F46E5] text-white shadow-lg' : 'bg-white border-border text-[#0F172A] hover:bg-muted shadow-sm hover:shadow'}`}
                  >
                    <Filter className={`h-4 w-4 ${isFiltersOpen ? 'text-white' : 'text-muted-foreground'}`} /> 
                    Filters {(filterTypes.length + filterStatuses.length) > 0 && <span className="flex items-center justify-center h-4 w-4 bg-white text-[#4F46E5] rounded-full text-[10px] ml-1">{filterTypes.length + filterStatuses.length}</span>}
                  </button>
                  
                  <div className="relative flex-1 sm:flex-none">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsSortOpen(!isSortOpen); setIsFiltersOpen(false); }}
                      className="flex items-center justify-between gap-2 w-full sm:w-48 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-bold text-[#0F172A] hover:bg-muted shadow-sm transition-all focus:outline-none"
                    >
                      <span className="text-muted-foreground font-medium text-[12px] truncate">Sort: {SORT_OPTIONS.find(o => o.value === sortKey)?.label.split(' (')[0]}</span> <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                    {isSortOpen && (
                      <div className="absolute top-12 right-0 w-48 bg-white rounded-xl border border-border shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {SORT_OPTIONS.map(opt => (
                          <button 
                            key={opt.value}
                            onClick={() => setSortKey(opt.value)} 
                            className={`w-full text-left px-4 py-2.5 text-[12px] font-bold transition-colors focus:outline-none ${sortKey === opt.value ? 'bg-[#4F46E5]/10 text-[#4F46E5]' : 'text-[#0F172A] hover:bg-[#F8FAFC]'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center bg-white border border-border rounded-lg p-1 shadow-sm w-full sm:w-auto">
                  <button onClick={() => setViewMode("grid")} className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 h-8 px-3 text-[12px] font-bold rounded-md transition-colors ${viewMode === 'grid' ? 'bg-muted text-[#0F172A]' : 'text-muted-foreground hover:text-[#0F172A]'}`}><Grid className="h-3.5 w-3.5" /> Grid</button>
                  <button onClick={() => setViewMode("list")} className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 h-8 px-3 text-[12px] font-bold rounded-md transition-colors ${viewMode === 'list' ? 'bg-muted text-[#0F172A]' : 'text-muted-foreground hover:text-[#0F172A]'}`}><ListIcon className="h-3.5 w-3.5" /> List</button>
                  <button onClick={() => setViewMode("calendar")} className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 h-8 px-3 text-[12px] font-bold rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-muted text-[#0F172A]' : 'text-muted-foreground hover:text-[#0F172A]'}`}><CalendarIcon className="h-3.5 w-3.5" /> Calendar</button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6 w-full overflow-x-auto pb-2 md:pb-0">
               {["All", "2026", "2025", "2024", "2023"].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`h-9 px-6 rounded-full text-[13px] font-bold transition-all focus:outline-none whitespace-nowrap ${
                     activeTab === tab ? 'bg-[#4F46E5] text-white shadow-md' : 'text-muted-foreground hover:text-[#0F172A] hover:bg-black/5'
                   }`}
                 >
                   {tab === "All" ? `All (${invoicesState.length})` : tab}
                 </button>
               ))}
            </div>

            {/* GRID vs LIST LOOP */}
            {processedInvoices.length === 0 ? (
              <div className="w-full flex-1 flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-border shadow-sm mb-8">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Receipt className="h-6 w-6 text-muted-foreground/60" />
                  </div>
                  <h3 className="text-[16px] font-black text-[#0F172A] mb-1">No Invoices Matches Found</h3>
                  <p className="text-[13px] text-muted-foreground">Adjust filters, tabs, or terminology.</p>
              </div>
            ) : viewMode === "grid" ? (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 flex-1">
                 {processedInvoices.map((inv) => (
                   <div key={inv.id} className="bg-white rounded-[20px] border border-border flex flex-col shadow-sm hover:border-[#4F46E5]/30 hover:shadow-xl transition-all group overflow-hidden relative">
                      <div className="p-6 pb-5 relative">
                         <div className="flex justify-between items-start mb-4">
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black tracking-wider uppercase rounded-lg border ${inv.type === 'client_repair' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                             {inv.type === 'client_repair' ? <Wrench className="h-3 w-3" /> : <Box className="h-3 w-3" />}
                             {inv.type === 'client_repair' ? 'Repair' : 'Inventory'}
                           </span>
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black rounded-lg border ${STATUS_STYLE[inv.status]}`}>
                             {inv.status}
                           </span>
                         </div>
                         <h2 className="text-[17px] font-black text-[#0F172A] tracking-tight mb-1 truncate">{inv.name}</h2>
                         <p className="text-[12px] text-muted-foreground font-bold mb-5 flex items-center gap-2">
                           <span className="opacity-50 font-mono">{inv.invoiceId}</span>
                           <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                           <span>{inv.phone}</span>
                         </p>
                         
                         <div className="pt-4 border-t border-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Total Amount</p>
                            <div className="flex items-baseline gap-1">
                               <span className="text-[14px] font-bold text-slate-400">Rs.</span>
                               <span className="text-[26px] font-black text-[#0F172A] tracking-tighter">{(inv.amount ?? 0).toLocaleString()}</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="mt-auto grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/50">
                          <button onClick={() => setViewDocumentTarget(inv)} className="h-12 flex justify-center items-center text-slate-400 hover:bg-white hover:text-[#4F46E5] transition-all focus:outline-none group/btn">
                             <Eye className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                          </button>
                          <button onClick={() => setEditInvoiceTarget(inv)} className="h-12 flex justify-center items-center text-slate-400 hover:bg-white hover:text-[#4F46E5] transition-all focus:outline-none group/btn">
                             <Edit2 className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                          </button>
                          <button onClick={() => setDeleteFormTarget(inv)} className="h-12 flex justify-center items-center text-slate-400 hover:bg-white hover:text-red-600 transition-all focus:outline-none group/btn">
                             <Trash2 className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                          </button>
                      </div>
                   </div>
                 ))}
               </div>
            ) : viewMode === "list" ? (
               <div className="w-full bg-white rounded-xl border border-border shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex-1 overflow-hidden mb-8">
                  <div className="w-full overflow-x-auto">
                     <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                           <tr className="border-b border-border bg-[#F8FAFC]">
                             <th className="px-6 py-4 w-12"><input type="checkbox" className="h-[15px] w-[15px] rounded border-border accent-[#4F46E5]" /></th>
                             <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground tracking-widest">Type</th>
                             <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground tracking-widest cursor-pointer hover:bg-muted/50 transition-colors">Invoice <ArrowUpDown className="h-3 w-3 inline-block ml-1 opacity-50" /></th>
                             <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground tracking-widest cursor-pointer hover:bg-muted/50 transition-colors">Details <ArrowUpDown className="h-3 w-3 inline-block ml-1 opacity-50" /></th>
                             <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground tracking-widest cursor-pointer hover:bg-muted/50 transition-colors">Amount <ArrowUpDown className="h-3 w-3 inline-block ml-1 opacity-50" /></th>
                             <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground tracking-widest cursor-pointer hover:bg-muted/50 transition-colors">Date <ArrowUpDown className="h-3 w-3 inline-block ml-1 opacity-50" /></th>
                             <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground tracking-widest text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                           {processedInvoices.map((inv) => (
                             <tr key={inv.id} className="hover:bg-[#F8FAFC]/50 transition-colors group">
                                <td className="px-6 py-4"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-[#4F46E5] focus:ring-[#4F46E5]/20 cursor-pointer" /></td>
                                <td className="px-6 py-4">
                                  <div className={`flex items-center justify-center w-9 h-9 rounded-xl border ${inv.type === 'client_repair' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                     {inv.type === 'client_repair' ? <Wrench className="h-4 w-4" /> : <Box className="h-4 w-4" />}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <Link href="#" onClick={(e) => { e.preventDefault(); setViewDocumentTarget(inv); }} className="text-[13px] font-black text-[#4F46E5] hover:text-[#4338CA] transition-colors font-mono">
                                    {inv.invoiceId}
                                  </Link>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-0.5">
                                     <span className="text-[14px] font-black text-[#0F172A] tracking-tight truncate max-w-[180px]">{inv.name}</span>
                                     <span className="text-[11px] text-muted-foreground font-bold">{inv.phone}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                   <div className="flex flex-col">
                                     <span className="text-[14px] font-black text-[#0F172A]">Rs. {(inv.amount ?? 0).toLocaleString()}</span>
                                     <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border w-fit mt-1 uppercase tracking-wider ${STATUS_STYLE[inv.status]}`}>{inv.status}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col text-[12px]">
                                     <span className="font-bold text-[#0F172A]">{new Date(inv.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                     <span className="text-[10px] text-muted-foreground font-medium uppercase">{new Date(inv.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                   <div className="flex items-center justify-end gap-1.5 transition-opacity">
                                     <button onClick={() => setViewDocumentTarget(inv)} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-all"><Eye className="h-4 w-4" /></button>
                                     <button onClick={() => setEditInvoiceTarget(inv)} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-all"><Edit2 className="h-4 w-4" /></button>
                                     <div className="relative">
                                       <button onClick={(e) => { e.stopPropagation(); setActiveDropdownId(activeDropdownId === inv.id ? null : inv.id)}} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-[#0F172A] transition-all"><MoreVertical className="h-4 w-4" /></button>
                                       {activeDropdownId === inv.id && (
                                          <div className="absolute top-10 right-0 w-44 bg-white rounded-xl border border-border mt-1 shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                                             <button onClick={() => { handleDownloadPDF(inv); setActiveDropdownId(null); }} className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-bold text-[#0F172A] hover:bg-slate-50">
                                               <Download className="h-3.5 w-3.5 text-slate-400" /> Download PDF
                                             </button>
                                             <div className="w-full h-px bg-slate-100 my-1" />
                                             <button onClick={() => { setDeleteFormTarget(inv); setActiveDropdownId(null); }} className="w-full text-left flex items-center justify-between gap-2 px-4 py-2.5 text-[12px] font-bold text-red-600 hover:bg-red-50">
                                               Delete Record <Trash2 className="h-3.5 w-3.5" />
                                             </button>
                                          </div>
                                       )}
                                     </div>
                                   </div>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-border bg-white rounded-xl shadow-sm flex-1 mb-8">
                 <CalendarIcon className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                 <h3 className="text-[16px] font-black text-[#0F172A]">Calendar Mapping Empty Space</h3>
               </div>
            )}

          </div>
          <div className="h-12" /> {/* Layout Spacer */}
          <DashboardFooter />
        </main>

        {/* 🔵 OVERLAY MODALS */}
        {/* MASTER ADD INVOICE MODAL */}
        {isAddInvoiceOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[4px] animate-in fade-in duration-300 p-4">
              <div className={`bg-white w-full max-w-[900px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300 border border-white/20`}>
                 
                 <div className="flex justify-between items-center p-8 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                       <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ${addInvoiceType === 'client_repair' ? 'bg-[#4F46E5] text-white' : 'bg-[#EA580C] text-white'}`}>
                          {addInvoiceType === 'client_repair' ? <Wrench className="h-6 w-6" /> : <Box className="h-6 w-6" />}
                       </div>
                       <div>
                          <h2 className="text-[22px] font-black text-[#0F172A] tracking-tight">
                            {addInvoiceType === 'client_repair' ? 'Generate Repair Invoice' : 'Create Inventory / Sale Ledger'}
                          </h2>
                          <p className="text-[13px] text-muted-foreground font-bold">Comprehensive invoicing for professional workflows.</p>
                       </div>
                    </div>
                    <button onClick={() => setIsAddInvoiceOpen(false)} className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all focus:outline-none"><X className="h-5 w-5" /></button>
                 </div>

                 <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-8 pb-4">
                       <div className="flex bg-slate-100/80 p-1.5 rounded-[20px] mb-8 border border-slate-200/50">
                          <button 
                            onClick={() => setAddInvoiceType("client_repair")}
                            className={`flex-1 flex items-center justify-center gap-2.5 h-12 text-[14px] font-black rounded-[16px] transition-all ${addInvoiceType === 'client_repair' ? 'bg-white text-[#4F46E5] shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            <Wrench className="h-4 w-4" /> Repair Intake
                          </button>
                          <button 
                            onClick={() => setAddInvoiceType("inventory_item")}
                            className={`flex-1 flex items-center justify-center gap-2.5 h-12 text-[14px] font-black rounded-[16px] transition-all ${addInvoiceType === 'inventory_item' ? 'bg-white text-[#EA580C] shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            <ShoppingCart className="h-4 w-4" /> Bulk Sale / Inventory
                          </button>
                       </div>

                       <div className="grid grid-cols-2 gap-6 mb-10">
                          <div className="col-span-2 lg:col-span-1">
                             <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Customer / Client Name</label>
                             <div className="relative group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#4F46E5] transition-colors" />
                                <input id="inv_name" type="text" placeholder="Search or Enter Name..." className="w-full h-12 rounded-xl border border-slate-200 pl-10 pr-4 text-[14px] font-bold focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] outline-none transition-all placeholder:text-slate-300" />
                             </div>
                          </div>
                          <div className="col-span-2 lg:col-span-1">
                             <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Number</label>
                             <input id="inv_phone" type="text" placeholder="+94 7X XXX XXXX" className="w-full h-12 rounded-xl border border-slate-200 px-4 text-[14px] font-bold focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] outline-none transition-all placeholder:text-slate-300" />
                          </div>
                       </div>

                       {addInvoiceType === 'inventory_item' ? (
                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                           <div className="flex items-center justify-between mb-4">
                              <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                                <Box className="h-4 w-4 text-[#EA580C]" /> Line Items
                              </h3>
                              <button onClick={() => setInvoiceItems(p => [...p, { id: Date.now(), name: "", sku: "", qty: 1, price: 0 }])} className="text-[12px] font-black text-[#EA580C] flex items-center gap-1.5 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">
                                <Plus className="h-3.5 w-3.5" /> Add Row
                              </button>
                           </div>

                           <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/30">
                              <table className="w-full text-left border-collapse">
                                 <thead className="bg-slate-100/50">
                                    <tr>
                                       <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item / Description</th>
                                       <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU / IMEI</th>
                                       <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">Qty</th>
                                       <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-36">Unit Price</th>
                                       <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-36">Total</th>
                                       <th className="px-4 py-3 w-12"></th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                    {invoiceItems.map((item, idx) => (
                                       <tr key={item.id} className="bg-white">
                                          <td className="p-3"><input value={item.name} onChange={e => {const n=[...invoiceItems]; n[idx].name=e.target.value; setInvoiceItems(n)}} className="w-full h-10 px-3 text-[13px] font-bold border border-transparent focus:border-orange-200 bg-slate-50/50 rounded-lg outline-none" placeholder="Item name..." /></td>
                                          <td className="p-3"><input value={item.sku} onChange={e => {const n=[...invoiceItems]; n[idx].sku=e.target.value; setInvoiceItems(n)}} className="w-full h-10 px-3 text-[13px] font-bold border border-transparent focus:border-orange-200 bg-slate-50/50 rounded-lg outline-none" placeholder="SKU..." /></td>
                                          <td className="p-3"><input type="number" value={item.qty} onChange={e => {const n=[...invoiceItems]; n[idx].qty=+e.target.value; setInvoiceItems(n)}} className="w-full h-10 px-3 text-[13px] font-bold border border-transparent focus:border-orange-200 bg-slate-50/50 rounded-lg outline-none" /></td>
                                          <td className="p-3"><input type="number" value={item.price} onChange={e => {const n=[...invoiceItems]; n[idx].price=+e.target.value; setInvoiceItems(n)}} className="w-full h-10 px-3 text-[13px] font-bold border border-transparent focus:border-orange-200 bg-slate-50/50 rounded-lg outline-none" /></td>
                                          <td className="p-3 text-[13px] font-black text-[#0F172A] tracking-tight">Rs. {(item.qty * item.price).toLocaleString()}</td>
                                          <td className="p-3">
                                             <button onClick={() => setInvoiceItems(p => p.length > 1 ? p.filter((_, i) => i !== idx) : p)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>

                           <div className="flex justify-end pt-6">
                              <div className="w-[280px] p-6 rounded-2xl bg-slate-50 border border-slate-200/50">
                                 <div className="flex justify-between items-center mb-2">
                                    <span className="text-[12px] font-bold text-slate-400">Subtotal</span>
                                    <span className="text-[13px] font-black text-[#0F172A]">Rs. {invoiceItems.reduce((acc, curr) => acc + (curr.qty * curr.price), 0).toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-2">
                                    <span className="text-[14px] font-black text-[#0F172A]">Grand Total</span>
                                    <span className="text-[18px] font-black text-[#EA580C]">Rs. {invoiceItems.reduce((acc, curr) => acc + (curr.qty * curr.price), 0).toLocaleString()}</span>
                                 </div>
                              </div>
                           </div>
                         </div>
                       ) : (
                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                           <section className="bg-slate-50 p-7 rounded-[24px] border border-slate-200/50">
                              <h3 className="text-[13px] font-black text-[#0F172A] uppercase tracking-widest mb-6 flex items-center gap-2.5">
                                 <Smartphone className="h-5 w-5 text-[#4F46E5]" /> Device Specifications
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                    <select className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors">
                                       <option>Mobile Phone</option>
                                       <option>Tablet</option>
                                       <option>Laptop</option>
                                       <option>Console</option>
                                    </select>
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Brand</label>
                                    <input type="text" placeholder="e.g. Samsung" className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors" />
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Serial/IMEI</label>
                                    <input type="text" placeholder="IMEI number..." className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors" />
                                 </div>
                              </div>
                           </section>

                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                 <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Fault Description</label>
                                 <textarea rows={3} placeholder="Describe the issue in detail..." className="w-full rounded-xl border border-slate-200 bg-white p-4 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors resize-none"></textarea>
                              </div>
                              <div className="space-y-4">
                                 <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                                       Estimated Cost (LKR)
                                       <span className="text-[10px] text-[#4F46E5]">Rs. {(7500).toLocaleString()}</span>
                                    </label>
                                    <input id="rep_amount" type="number" placeholder="Enter amount..." className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-[15px] font-black text-[#4F46E5] outline-none focus:border-[#4F46E5] transition-all" />
                                 </div>
                              </div>
                           </div>
                         </div>
                       )}
                    </div>
                 </div>
                 
                 <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                    <button onClick={() => setIsAddInvoiceOpen(false)} className="px-6 h-14 rounded-2xl border border-slate-200 bg-white text-slate-500 text-[15px] font-black hover:bg-slate-50 hover:text-slate-700 transition-all focus:outline-none">Discard Changes</button>
                    <button 
                      onClick={() => {
                        const name = (document.getElementById('inv_name') as HTMLInputElement)?.value || "New Project";
                        const amount = addInvoiceType === 'inventory_item' ? invoiceItems.reduce((acc, curr) => acc + (curr.qty * curr.price), 0) : +(document.getElementById('rep_amount') as HTMLInputElement)?.value || 7500;
                        
                        const newInv = {
                           id: Date.now(),
                           invoiceId: addInvoiceType === 'client_repair' ? `#REP-${Math.floor(1000 + Math.random() * 9000)}` : `#INV-${Math.floor(1000 + Math.random() * 9000)}`,
                           type: addInvoiceType, 
                           name: name,
                           phone: (document.getElementById('inv_phone') as HTMLInputElement)?.value || "+94 77 XXX XXXX",
                           amount: amount,
                           status: "Pending", 
                           date: new Date().toISOString().split('T')[0]
                        };
                        setInvoicesState(p => [newInv as any, ...p]);
                        setIsAddInvoiceOpen(false);
                        setInvoiceItems([{ id: 1, name: "", sku: "", qty: 1, price: 0 }]);
                      }}
                      className={`flex-1 h-14 rounded-2xl text-white text-[15px] font-black shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none ${addInvoiceType === 'client_repair' ? 'bg-[#4F46E5] shadow-indigo-200' : 'bg-[#EA580C] shadow-orange-200'}`}
                    >
                      {addInvoiceType === 'client_repair' ? 'Finalize Repair Invoice' : 'Generate Bulk Sale Record'}
                    </button>
                 </div>
              </div>
           </div>
        )}

        {/* VIEW INVOICE MODAL (FULL PAGE OVERHAUL) */}
        {viewDocumentTarget && (
           <div className="fixed inset-0 z-[120] flex flex-col items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto py-12 px-4">
              
              {/* STICKY ACTION HEADER */}
              <div className="w-full max-w-[800px] flex justify-end gap-3 mb-6 shrink-0 sticky top-0 z-50">
                <button 
                  onClick={handleDownloadPDF} 
                  disabled={isGeneratingPDF}
                  className={`h-11 px-6 rounded-full text-white text-[14px] font-black flex items-center gap-2.5 shadow-xl transition-all active:scale-95 ${
                    isGeneratingPDF ? 'bg-[#4F46E5]/70 cursor-not-allowed' : 'bg-[#4F46E5] hover:bg-[#4338CA] hover:shadow-indigo-200'
                  }`}
                >
                  <Download className={`h-4 w-4 ${isGeneratingPDF ? 'animate-bounce' : ''}`} /> 
                  {isGeneratingPDF ? 'Generating Document...' : 'Download PDF Invoice'}
                </button>
                <button 
                  onClick={() => setViewDocumentTarget(null)} 
                  className="h-11 w-11 rounded-full bg-white text-slate-400 flex items-center justify-center shadow-xl hover:bg-slate-50 hover:text-[#0F172A] transition-all focus:outline-none active:scale-95 border border-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* INVOICE PAPER CONTAINER */}
              <div ref={printRef} className="w-full max-w-[800px] bg-white rounded-[24px] shadow-2xl p-16 shrink-0 z-10 animate-in zoom-in-95 duration-500 border border-slate-100 flex flex-col min-h-[1000px]">
                  
                  {/* BRANDING HEADER */}
                  <div className="flex justify-between items-start mb-20">
                      <div>
                         <div className="flex items-center gap-2.5 mb-2">
                           <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
                           <h2 className="text-[26px] font-black text-[#0F172A] tracking-tighter uppercase">SRM Solutions</h2>
                         </div>
                         <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                            <p className="flex items-center gap-1.5"><Smartphone className="h-3 w-3" /> Digital Repair Hub</p>
                            <p>contact@srm-solutions.com</p>
                            <p>+94 11 234 5678</p>
                         </div>
                      </div>
                      <div className="text-right text-[11px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
                            <p>Premium Service Center</p>
                            <p>Colombo 07, Sri Lanka</p>
                            <p className="text-[#4F46E5] mt-1">VAT REG: 009876543-X</p>
                      </div>
                  </div>

                      {/* LOGISTICS & META GRID */}
                  <div className="grid grid-cols-4 gap-8 mb-16">
                        <div className="col-span-1 border-l-2 border-[#4F46E5] pl-5">
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black">Billed to,</p>
                         <p className="text-[14px] font-black text-[#0F172A] mb-1">{viewDocumentTarget.name ?? 'Guest'}</p>
                         <p className="text-[12px] text-slate-500 font-bold leading-relaxed">{viewDocumentTarget.phone ?? 'N/A'}<br/>Client Address Stored<br/>Verification Required</p>
                      </div>
                      <div className="col-span-2 px-8 border-x border-slate-50">
                         <div className="grid grid-cols-2 gap-y-8">
                            <div>
                               <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Invoice Reference</p>
                               <p className="text-[13px] font-black text-[#0F172A] font-mono bg-slate-50 px-2 py-1 rounded inline-block border border-slate-100">{viewDocumentTarget.invoiceId ?? '#000000'}</p>
                            </div>
                            <div>
                               <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Issue Date</p>
                               <p className="text-[13px] font-black text-[#0F172A]">{viewDocumentTarget.date ?? 'N/A'}</p>
                            </div>
                            <div>
                               <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Service Category</p>
                               <p className="text-[13px] font-black text-[#0F172A] capitalize">{(viewDocumentTarget.type || "").replace(/_/g, ' ')}</p>
                            </div>
                            <div>
                               <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Current Status</p>
                               <span 
                                 className="text-[10px] font-black px-2 py-0.5 rounded-md border uppercase inline-block"
                                 style={{ 
                                   backgroundColor: viewDocumentTarget.status === 'Paid' ? '#ecfdf5' : viewDocumentTarget.status === 'Pending' ? '#fffbeb' : '#fef2f2',
                                   color: viewDocumentTarget.status === 'Paid' ? '#047857' : viewDocumentTarget.status === 'Pending' ? '#b45309' : '#dc2626',
                                   borderColor: viewDocumentTarget.status === 'Paid' ? '#a7f3d0' : viewDocumentTarget.status === 'Pending' ? '#fde68a' : '#fecaca',
                                 }}
                               >
                                 {viewDocumentTarget.status ?? 'Pending'}
                               </span>
                            </div>
                         </div>
                      </div>
                      <div className="col-span-1 text-right bg-slate-50/50 p-6 rounded-2xl border border-slate-100 h-fit">
                         <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Total Payable</p>
                         <p className="text-[32px] font-black text-[#0F172A] tracking-tighter leading-none mb-1">
                           <span className="text-[14px] text-slate-400 mr-1.5">Rs.</span>
                           {(viewDocumentTarget.amount ?? 0).toLocaleString()}
                         </p>
                         <div className="mt-8 border-t border-slate-200 pt-4">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-black underline decoration-[#4F46E5] underline-offset-4">Due Schedule</p>
                            <p className="text-[12px] font-black text-[#4F46E5]">Payable on Receipt</p>
                         </div>
                      </div>
                  </div>

                  {/* ITEMS TABLE REF */}
                  <div className="mt-12 flex-1">
                     <div className="grid grid-cols-12 pb-4 mb-8 border-b-2 border-[#0F172A]">
                         <div className="col-span-6 text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Transactional Detail</div>
                         <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Unit Qty</div>
                         <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Rate (LKR)</div>
                         <div className="col-span-2 text-right text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Subtotal</div>
                     </div>
                     
                     {viewDocumentTarget.type === 'client_repair' ? (
                       <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <div className="grid grid-cols-12 items-center">
                             <div className="col-span-6">
                                <p className="text-[14px] font-black text-[#0F172A] mb-1">Advanced Service Labor</p>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Expert Technical Diagnostics & Repair</p>
                             </div>
                             <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">1</div>
                             <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">Rs. {((viewDocumentTarget.amount ?? 0) * 0.4).toLocaleString()}</div>
                             <div className="col-span-2 text-right text-[13px] font-black text-[#0F172A]">Rs. {((viewDocumentTarget.amount ?? 0) * 0.4).toLocaleString()}</div>
                         </div>
                         
                         <div className="grid grid-cols-12 items-center">
                             <div className="col-span-6">
                                <p className="text-[14px] font-black text-[#0F172A] mb-1">Component / Parts Material</p>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">OEM Grade Replacement Parts</p>
                             </div>
                             <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">1</div>
                             <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">Rs. {((viewDocumentTarget.amount ?? 0) * 0.6).toLocaleString()}</div>
                             <div className="col-span-2 text-right text-[13px] font-black text-[#0F172A]">Rs. {((viewDocumentTarget.amount ?? 0) * 0.6).toLocaleString()}</div>
                         </div>
                       </div>
                     ) : (
                       <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <div className="grid grid-cols-12 items-center">
                             <div className="col-span-6">
                                <p className="text-[14px] font-black text-[#0F172A] mb-1">Stock Item Purchase</p>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Inventory Sales & Logistics</p>
                             </div>
                             <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">1</div>
                             <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">Rs. {(viewDocumentTarget.amount ?? 0).toLocaleString()}</div>
                             <div className="col-span-2 text-right text-[13px] font-black text-[#0F172A]">Rs. {(viewDocumentTarget.amount ?? 0).toLocaleString()}</div>
                         </div>
                       </div>
                     )}

                     {/* FINANCIAL TOTALS */}
                     <div className="flex justify-end pt-12 mt-12 border-t-4 border-slate-50">
                         <div className="w-[340px] space-y-4">
                             <div className="flex justify-between items-center text-[13px] font-bold text-slate-500">
                                <span>Net Subtotal</span>
                                <span className="text-[#0F172A]">Rs. {((viewDocumentTarget.amount ?? 0) * 0.85).toLocaleString()}</span>
                             </div>
                             <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 pb-5 border-b border-slate-100">
                                <span>Service VAT (15.0%)</span>
                                <span className="text-[#0F172A]">Rs. {((viewDocumentTarget.amount ?? 0) * 0.15).toLocaleString()}</span>
                             </div>
                             <div className="flex justify-between items-center pt-2">
                                <span className="text-[16px] font-black text-[#0F172A] uppercase tracking-tighter">Grand Total Billed</span>
                                <div className="text-right">
                                   <p className="text-[24px] font-black text-[#4F46E5] tracking-tighter leading-none">Rs. {(viewDocumentTarget.amount ?? 0).toLocaleString()}</p>
                                   <p className="text-[9px] text-slate-400 font-black uppercase mt-1">Authorized for Transaction</p>
                                </div>
                             </div>
                         </div>
                     </div>
                  </div>

                  {/* PROFESSIONAL FOOTER */}
                  <div className="mt-20 pt-16 border-t border-slate-100 border-dashed">
                     <p className="text-[12px] font-black text-[#0F172A] mb-8 flex items-center gap-2">
                       <ArrowUpRight className="h-4 w-4 text-[#4F46E5]" /> 
                       Thank you for choosing SRM Solutions for your professional technical needs.
                     </p>
                     
                     <div className="grid grid-cols-2 gap-12">
                       <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black underline decoration-slate-200 underline-offset-4">General Terms</p>
                          <p className="text-[11px] text-slate-500 font-bold leading-relaxed italic">
                            All repairs are covered under a 30-day functional warranty unless otherwise stated. 
                            Hardware sales include a 1-year manufacturer warranty from the date of purchase.
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

              {/* BOTTOM PADPER SPACER */}
              <div className="h-20 shrink-0" />
           </div>
        )}

        {/* 🛠️ INVISIBLE PDF RENDER TARGET (FOR DIRECT DOWNLOADS) */}
        <div className="fixed -left-[2000px] pointer-events-none opacity-0 select-none overflow-hidden h-0 w-0">
           {hiddenInvoiceTarget && (
           <div 
             ref={hiddenPrintRef}
             className="w-[800px] bg-white p-16 flex flex-col min-h-[1000px]"
             style={{ minHeight: '1100px' }}
           >
              {/* BRANDING HEADER */}
              <div className="flex justify-between items-start mb-20">
                  <div>
                     <div className="flex items-center gap-2.5 mb-2">
                       <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
                       <h2 className="text-[26px] font-black text-[#0F172A] tracking-tighter uppercase">SRM Solutions</h2>
                     </div>
                     <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        <p className="flex items-center gap-1.5 underline decoration-[#4F46E5] underline-offset-4">Digital Repair Hub</p>
                        <p>contact@srm-solutions.com</p>
                        <p>+94 11 234 5678</p>
                     </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
                        <p>Premium Service Center</p>
                        <p>Colombo 07, Sri Lanka</p>
                        <p className="text-[#4F46E5] mt-1">VAT REG: 009876543-X</p>
                  </div>
              </div>

              {/* LOGISTICS & META GRID */}
              <div className="grid grid-cols-4 gap-8 mb-16">
                  <div className="col-span-1 border-l-2 border-[#4F46E5] pl-5">
                     <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black">Billed to,</p>
                     <p className="text-[14px] font-black text-[#0F172A] mb-1">{hiddenInvoiceTarget.name ?? 'Guest'}</p>
                     <p className="text-[12px] text-slate-500 font-bold leading-relaxed">{hiddenInvoiceTarget.phone ?? 'N/A'}<br/>Client Address Stored<br/>Verification Required</p>
                  </div>
                  <div className="col-span-2 px-8 border-x border-slate-50">
                     <div className="grid grid-cols-2 gap-y-8">
                        <div>
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Invoice Reference</p>
                           <p className="text-[13px] font-black text-[#0F172A] font-mono bg-slate-50 px-2 py-1 rounded inline-block border border-slate-100">{hiddenInvoiceTarget.invoiceId ?? '#000000'}</p>
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Issue Date</p>
                           <p className="text-[13px] font-black text-[#0F172A]">{hiddenInvoiceTarget.date ?? 'N/A'}</p>
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Service Category</p>
                           <p className="text-[13px] font-black text-[#0F172A] capitalize">{(hiddenInvoiceTarget.type || "").replace(/_/g, ' ')}</p>
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Current Status</p>
                           <span 
                             className="text-[10px] font-black px-2 py-0.5 rounded-md border uppercase inline-block"
                             style={{ 
                               backgroundColor: hiddenInvoiceTarget.status === 'Paid' ? '#ecfdf5' : hiddenInvoiceTarget.status === 'Pending' ? '#fffbeb' : '#fef2f2',
                               color: hiddenInvoiceTarget.status === 'Paid' ? '#047857' : hiddenInvoiceTarget.status === 'Pending' ? '#b45309' : '#dc2626',
                               borderColor: hiddenInvoiceTarget.status === 'Paid' ? '#a7f3d0' : hiddenInvoiceTarget.status === 'Pending' ? '#fde68a' : '#fecaca',
                             }}
                            >
                             {hiddenInvoiceTarget.status ?? 'Pending'}
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className="col-span-1 text-right bg-slate-50/50 p-6 rounded-2xl border border-slate-100 h-fit">
                     <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Total Payable</p>
                     <p className="text-[32px] font-black text-[#0F172A] tracking-tighter leading-none mb-1">
                       <span className="text-[14px] text-slate-400 mr-1.5">Rs.</span>
                       {(hiddenInvoiceTarget.amount ?? 0).toLocaleString()}
                     </p>
                     <div className="mt-8 border-t border-slate-200 pt-4">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-black underline decoration-[#4F46E5] underline-offset-4">Due Schedule</p>
                        <p className="text-[12px] font-black text-[#4F46E5]">Payable on Receipt</p>
                     </div>
                  </div>
              </div>

              {/* ITEMS TABLE REF */}
              <div className="mt-12 flex-1">
                 <div className="grid grid-cols-12 pb-4 mb-8 border-b-2 border-[#0F172A]">
                     <div className="col-span-6 text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Transactional Detail</div>
                     <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Unit Qty</div>
                     <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Rate (LKR)</div>
                     <div className="col-span-2 text-right text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Subtotal</div>
                 </div>
                 
                 {hiddenInvoiceTarget.type === 'client_repair' ? (
                   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div className="grid grid-cols-12 items-center">
                         <div className="col-span-6">
                            <p className="text-[14px] font-black text-[#0F172A] mb-1">Advanced Service Labor</p>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Expert Technical Diagnostics & Repair</p>
                         </div>
                         <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">1</div>
                         <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">Rs. {((hiddenInvoiceTarget.amount ?? 0) * 0.4).toLocaleString()}</div>
                         <div className="col-span-2 text-right text-[13px] font-black text-[#0F172A]">Rs. {((hiddenInvoiceTarget.amount ?? 0) * 0.4).toLocaleString()}</div>
                     </div>
                     
                     <div className="grid grid-cols-12 items-center">
                         <div className="col-span-6">
                            <p className="text-[14px] font-black text-[#0F172A] mb-1">Component / Parts Material</p>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">OEM Grade Replacement Parts</p>
                         </div>
                         <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">1</div>
                         <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">Rs. {((hiddenInvoiceTarget.amount ?? 0) * 0.6).toLocaleString()}</div>
                         <div className="col-span-2 text-right text-[13px] font-black text-[#0F172A]">Rs. {((hiddenInvoiceTarget.amount ?? 0) * 0.6).toLocaleString()}</div>
                     </div>
                   </div>
                 ) : (
                   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div className="grid grid-cols-12 items-center">
                         <div className="col-span-6">
                            <p className="text-[14px] font-black text-[#0F172A] mb-1">Stock Item Purchase</p>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Inventory Sales & Logistics</p>
                         </div>
                         <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">1</div>
                         <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">Rs. {(hiddenInvoiceTarget.amount ?? 0).toLocaleString()}</div>
                         <div className="col-span-2 text-right text-[13px] font-black text-[#0F172A]">Rs. {(hiddenInvoiceTarget.amount ?? 0).toLocaleString()}</div>
                     </div>
                   </div>
                 )}

                 {/* FINANCIAL TOTALS */}
                 <div className="flex justify-end pt-12 mt-12 border-t-4 border-slate-50">
                     <div className="w-[340px] space-y-4">
                         <div className="flex justify-between items-center text-[13px] font-bold text-slate-500">
                            <span>Net Subtotal</span>
                            <span className="text-[#0F172A]">Rs. {((hiddenInvoiceTarget.amount ?? 0) * 0.85).toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 pb-5 border-b border-slate-100">
                            <span>Service VAT (15.0%)</span>
                            <span className="text-[#0F172A]">Rs. {((hiddenInvoiceTarget.amount ?? 0) * 0.15).toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between items-center pt-2">
                            <span className="text-[16px] font-black text-[#0F172A] uppercase tracking-tighter">Grand Total Billed</span>
                            <div className="text-right">
                               <p className="text-[24px] font-black text-[#4F46E5] tracking-tighter leading-none">Rs. {(hiddenInvoiceTarget.amount ?? 0).toLocaleString()}</p>
                               <p className="text-[9px] text-slate-400 font-black uppercase mt-1">Authorized for Transaction</p>
                            </div>
                         </div>
                     </div>
                 </div>
              </div>

              {/* PROFESSIONAL FOOTER */}
              <div className="mt-20 pt-16 border-t border-slate-100 border-dashed">
                 <p className="text-[12px] font-black text-[#0F172A] mb-8 flex items-center gap-2">
                   <ArrowUpRight className="h-4 w-4 text-[#4F46E5]" /> 
                   Thank you for choosing SRM Solutions for your professional technical needs.
                 </p>
                 
                 <div className="grid grid-cols-2 gap-12">
                   <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black underline decoration-slate-200 underline-offset-4">General Terms</p>
                      <p className="text-[11px] text-slate-500 font-bold leading-relaxed italic">
                        All repairs are covered under a 30-day functional warranty unless otherwise stated. 
                        Hardware sales include a 1-year manufacturer warranty from the date of purchase.
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
    </div>

        
        {/* EDIT INVOICE MODAL */}
        {editInvoiceTarget && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-[4px] animate-in fade-in duration-300 p-4">
            <div className="bg-white w-full max-w-[420px] rounded-[28px] shadow-2xl p-8 animate-in zoom-in-95 duration-300 border border-slate-200">
               <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                     <Edit2 className="h-8 w-8 text-[#4F46E5]" />
                  </div>
                  <h3 className="text-[20px] font-black text-[#0F172A] mb-1">Update Document</h3>
                  <p className="text-[13px] font-bold text-slate-400 mb-8">Refining details for <span className="text-[#4F46E5]">{editInvoiceTarget.invoiceId}</span></p>
                  
                  <div className="w-full space-y-5 text-left bg-slate-50/50 p-6 rounded-2xl border border-slate-200/50 mb-8">
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Adjust Amount (LKR)</label>
                        <input type="number" defaultValue={editInvoiceTarget.amount} id="edit_amount" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-[15px] font-black text-[#0F172A] outline-none focus:border-[#4F46E5]" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Change Status</label>
                        <select id="edit_status" defaultValue={editInvoiceTarget.status} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-[14px] font-bold text-[#0F172A] outline-none focus:border-[#4F46E5]">
                           {INVOICE_STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                     </div>
                  </div>
                  
                  <div className="flex w-full gap-3">
                     <button onClick={() => setEditInvoiceTarget(null)} className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all">Cancel</button>
                     <button 
                       onClick={() => {
                          const amt = +(document.getElementById('edit_amount') as HTMLInputElement).value;
                          const st = (document.getElementById('edit_status') as HTMLSelectElement).value;
                          setInvoicesState(p => p.map(inv => inv.id === editInvoiceTarget.id ? { ...inv, amount: amt, status: st } : inv));
                          setEditInvoiceTarget(null);
                       }} 
                       className="flex-1 h-12 rounded-xl bg-[#4F46E5] text-white font-black shadow-lg shadow-indigo-200 hover:bg-[#4338CA] transition-all"
                     >
                       Save Update
                     </button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION */}
        {deleteFormTarget && (
           <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-[4px] animate-in fade-in duration-300">
             <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-2xl animate-in zoom-in-95 text-center w-[440px]">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
                   <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="font-black text-[22px] text-[#0F172A] mb-2">Void Invoice?</h3>
                <p className="text-[14px] text-slate-400 mb-10 font-bold leading-relaxed px-4">This action will permanently invalidate and remove <span className="text-red-600">{deleteFormTarget.invoiceId}</span> from the system records.</p>
                <div className="grid grid-cols-2 gap-4 px-2">
                  <button onClick={() => setDeleteFormTarget(null)} className="h-14 rounded-2xl border border-slate-200 bg-white font-black text-slate-500 hover:bg-slate-50 transition-all focus:outline-none">Keep Record</button>
                  <button onClick={confirmDelete} className="h-14 rounded-2xl bg-red-600 text-white font-black shadow-lg shadow-red-200 hover:bg-red-700 transition-all transform hover:scale-[1.02] focus:outline-none">Void Permanently</button>
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  )
}
