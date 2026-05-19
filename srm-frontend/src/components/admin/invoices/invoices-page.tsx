"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import { InvoicesFilterModal, InvoiceFilters } from "@/components/admin/invoices/invoices-filter-modal"
import {
   Search, Filter, ChevronDown, Plus, Eye,
   Grid, List as ListIcon, Calendar as CalendarIcon,
   ChevronRight, MoreVertical, Edit2, Download, Trash2, X, ChevronLeft, ArrowUpDown, Receipt, Box, Wrench, Smartphone, AlertCircle, ShoppingCart, Calendar, SlidersHorizontal, ArrowUpRight
} from "lucide-react"

import {
   useGetInvoicesQuery,
   useCreateInvoiceMutation,
   useUpdateInvoiceStatusMutation,
   useDeleteInvoiceMutation,
} from "@/services/api/invoicesApiSlice"
import { useSearchCustomersQuery } from "@/services/api/customersApiSlice"

const STAFF_LIST = ["John Smith", "Mike Chen", "Sarah Connor", "Alex Kumar", "Admin"]
const DEVICE_TYPES = ["Mobile Phone", "Tablet", "Laptop", "Desktop PC", "Smart Watch", "Console", "Headset/Audio", "Display/Monitor", "Printer", "Router/Network", "Internal", "Other"]

type SortKey = "date-new" | "date-old" | "amount-high" | "amount-low" | "name-az" | "name-za" | "id-az"
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
   { value: "date-new", label: "Date (Newest)" },
   { value: "date-old", label: "Date (Oldest)" },
   { value: "amount-high", label: "Amount (Highest)" },
   { value: "amount-low", label: "Amount (Lowest)" },
   { value: "name-az", label: "Name (A-Z)" },
   { value: "name-za", label: "Name (Z-A)" },
   { value: "id-az", label: "Invoice ID" },
]

const INVOICE_STATUSES = ["Paid", "Pending", "Overdue"]

const STATUS_STYLE: Record<string, string> = {
   Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
   Pending: "bg-amber-50 text-amber-700 border-amber-200",
   Overdue: "bg-red-50 text-red-600 border-red-200",
}

export default function InvoicesManagementPage() {
   const { t } = useTranslation();
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);

   const { data: apiResponse, isLoading } = useGetInvoicesQuery({});
   const [createInvoiceMutation, { isLoading: isCreating }] = useCreateInvoiceMutation();
   const [updateInvoiceStatus] = useUpdateInvoiceStatusMutation();
   const [deleteInvoiceMutation] = useDeleteInvoiceMutation();

   const { user } = useSelector((state: any) => state.auth);

   const invoicesState = useMemo(() => {
      return (apiResponse?.invoices || []).map((inv: any) => ({
         ...inv,
         id: inv.id,
      }));
   }, [apiResponse]);

   const [viewMode, setViewMode] = useState<"grid" | "list" | "calendar">("list")
   const [activeTab, setActiveTab] = useState("All")

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

   const [newInvoiceData, setNewInvoiceData] = useState({
      name: "",
      phone: "",
      amount: 0,
      labour: 0,
      parts: 0,
      discount: 0,
      category: "Mobile Phone",
      brand: "",
      model: "",
      serial: "",
      fault: "",
      customerId: "",
      priority: "MEDIUM",
      estimatedDate: "",
      technician: "Admin"
   });

   const resetAddForm = () => {
      setNewInvoiceData({
        name: "",
        phone: "",
        amount: 0,
        labour: 0,
        parts: 0,
        discount: 0,
        category: "Mobile Phone",
        brand: "",
        model: "",
        serial: "",
        fault: "",
        customerId: "",
        priority: "MEDIUM",
        estimatedDate: "",
        technician: "Admin"
      });
   };

   // Real PDF Refs
   const printRef = useRef<HTMLDivElement>(null)
   const hiddenPrintRef = useRef<HTMLDivElement>(null)
   const [hiddenInvoiceTarget, setHiddenInvoiceTarget] = useState<any | null>(null)

   // Customer Search State
   const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false)
   const customerSearchRef = useRef<HTMLDivElement>(null)
   const { data: searchResults } = useSearchCustomersQuery(newInvoiceData.name, { 
     skip: !isCustomerSearchOpen || newInvoiceData.name.length < 2 
   })

   useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
       if (customerSearchRef.current && !customerSearchRef.current.contains(event.target as Node)) {
         setIsCustomerSearchOpen(false)
       }
     }
     document.addEventListener("mousedown", handleClickOutside)
     return () => document.removeEventListener("mousedown", handleClickOutside)
   }, [])

   const handleDownloadPDF = async (inv?: any) => {
      setIsGeneratingPDF(true)

      const targetInv = inv || viewDocumentTarget || hiddenInvoiceTarget
      if (!targetInv) {
         setIsGeneratingPDF(false)
         return
      }

      try {
         if (inv) {
            setHiddenInvoiceTarget(inv)
            await new Promise(r => setTimeout(r, 100))
         }

         const element = inv ? hiddenPrintRef.current : printRef.current
         if (!element) throw new Error("No element found trace #PDF-CAPTURE-ERR")

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
            scale: 3,
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
                  while (heads[0].firstChild) heads[0].removeChild(heads[0].firstChild);
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

   const handleStatusUpdate = async (id: string, newStatus: string) => {
      const dbStatus = newStatus === 'Paid' ? 'COMPLETED' : newStatus === 'Pending' ? 'PENDING' : 'FAILED';
      try {
         await updateInvoiceStatus({ id, status: dbStatus }).unwrap();
      } catch (err) {
         console.error('Failed to update invoice status', err);
      }
   }

   const confirmDelete = async () => {
      if (deleteFormTarget) {
         try {
            await deleteInvoiceMutation(deleteFormTarget.id).unwrap();
            setDeleteFormTarget(null);
         } catch (err) {
            console.error('Failed to delete invoice', err);
         }
      }
   }

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

      if (activeTab === "Repair") {
         r = r.filter(inv => inv.type === "client_repair")
      }
      if (activeTab === "Inventory") {
         r = r.filter(inv => inv.type === "inventory_item")
      }

      if (filterTypes.length) {
         r = r.filter(inv => {
            const mappedType = inv.type === 'client_repair' ? 'Repair' : 'Inventory';
            return filterTypes.includes(mappedType);
         });
      }
      if (filterStatuses.length) {
         r = r.filter(inv => {
            const mappedStatus = inv.status === 'COMPLETED' ? 'Paid' : inv.status === 'PENDING' ? 'Pending' : 'Overdue';
            return filterStatuses.includes(mappedStatus);
         });
      }
      if (filterStaff.length) r = r.filter(inv => filterStaff.includes(inv.staff || ""))
      if (filterDevices.length) r = r.filter(inv => {
         const dev = (inv.device || "").toLowerCase();
         return filterDevices.some(f => dev.includes(f.toLowerCase()));
      })

      r = r.filter(inv => inv.amount >= filterAmountRange.min && inv.amount <= filterAmountRange.max)

      if (filterDateFrom) r = r.filter(inv => inv.date.slice(0, 10) >= filterDateFrom)
      if (filterDateTo) r = r.filter(inv => inv.date.slice(0, 10) <= filterDateTo)

      return r.sort((a, b) => {
         if (sortKey === "date-new") return new Date(b.date).getTime() - new Date(a.date).getTime()
         if (sortKey === "date-old") return new Date(a.date).getTime() - new Date(a.date).getTime()
         if (user?.role !== 'TECHNICIAN') {
            if (sortKey === "amount-high") return b.amount - a.amount
            if (sortKey === "amount-low") return a.amount - b.amount
         }
         if (sortKey === "name-az") return a.name.localeCompare(b.name)
         if (sortKey === "name-za") return b.name.localeCompare(a.name)
         if (sortKey === "id-az") return a.invoiceId.localeCompare(b.invoiceId)
         return 0
      })
   }, [invoicesState, searchTerm, activeTab, filterTypes, filterStatuses, filterAmountRange, filterDateFrom, filterDateTo, sortKey, user?.role])


   return (
      <div className="flex bg-background h-screen overflow-hidden">
         <DashboardSidebar />

         <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
            <DashboardHeader />

            <main className="flex-1 flex flex-col pt-0 overflow-y-auto" onClick={() => { setActiveDropdownId(null); setIsSortOpen(false); }}>
               <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col">

                  <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-4">
                     <Link href="/admin/dashboard" className="hover:text-foreground transition-colors cursor-pointer text-[#4F46E5]">{mounted ? t('dashboard.title') : 'Dashboard'}</Link>
                     <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                     <span className="text-foreground">{mounted ? t('invoicesPage.title') : 'Invoice Management'}</span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                     <h1 className="text-[28px] font-black text-foreground tracking-tight">{mounted ? t('invoicesPage.title') : 'Invoice Management'}</h1>
                     <button
                        onClick={() => setIsAddInvoiceOpen(true)}
                        className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#4F46E5] text-[13px] font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors focus:outline-none"
                     >
                        <Plus className="h-4 w-4" /> {mounted ? t('invoicesPage.add') : 'Add Invoice'}
                     </button>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                     <div className="relative w-full lg:w-[420px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                           type="text"
                           placeholder={mounted ? t('invoicesPage.search') : "Search by name, client, or invoice #"}
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-card text-foreground text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] placeholder:text-muted-foreground/75"
                        />
                     </div>

                     <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto relative">
                        <div className="flex flex-1 sm:flex-none gap-3">
                           <button
                              onClick={(e) => { e.stopPropagation(); setIsFiltersOpen(!isFiltersOpen); setIsSortOpen(false); }}
                              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-4 rounded-lg border text-[13px] font-bold transition-all focus:outline-none whitespace-nowrap ${isFiltersOpen ? 'bg-[#4F46E5] border-[#4F46E5] text-white shadow-lg' : 'bg-card border-border text-foreground hover:bg-muted shadow-sm hover:shadow'}`}
                           >
                              <Filter className={`h-4 w-4 ${isFiltersOpen ? 'text-white' : 'text-muted-foreground'}`} />
                              {mounted ? t('invoicesPage.filters') : 'Filters'} {(filterTypes.length + filterStatuses.length) > 0 && <span className="flex items-center justify-center h-4 w-4 bg-white text-[#4F46E5] rounded-full text-[10px] ml-1">{filterTypes.length + filterStatuses.length}</span>}
                           </button>

                           <div className="relative flex-1 sm:flex-none">
                              <button
                                 onClick={(e) => { e.stopPropagation(); setIsSortOpen(!isSortOpen); setIsFiltersOpen(false); }}
                                 className="flex items-center justify-between gap-2 w-full sm:w-48 h-10 px-4 rounded-lg border border-border bg-card text-[13px] font-bold text-foreground hover:bg-muted shadow-sm transition-all focus:outline-none"
                              >
                                 <span className="text-muted-foreground font-medium text-[12px] truncate">Sort: {SORT_OPTIONS.find(o => o.value === sortKey)?.label.split(' (')[0]}</span> <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                              </button>
                              {isSortOpen && (
                                 <div className="absolute top-12 right-0 w-48 bg-card rounded-xl border border-border shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {SORT_OPTIONS.map(opt => {
                                        if (user?.role === 'TECHNICIAN' && (opt.value === 'amount-high' || opt.value === 'amount-low')) return null;
                                        return (
                                           <button
                                              key={opt.value}
                                              onClick={() => setSortKey(opt.value)}
                                              className={`w-full text-left px-4 py-2.5 text-[12px] font-bold transition-colors focus:outline-none ${sortKey === opt.value ? 'bg-[#4F46E5]/10 text-[#4F46E5]' : 'text-foreground hover:bg-muted'}`}
                                           >
                                              {opt.label}
                                           </button>
                                        )
                                    })}
                                 </div>
                              )}
                           </div>
                        </div>

                        <div className="flex items-center bg-card border border-border rounded-lg p-1 shadow-sm w-full sm:w-auto">
                           <button onClick={() => setViewMode("grid")} className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 h-8 px-3 text-[12px] font-bold rounded-md transition-colors ${viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}><Grid className="h-3.5 w-3.5" /> Grid</button>
                           <button onClick={() => setViewMode("list")} className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 h-8 px-3 text-[12px] font-bold rounded-md transition-colors ${viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}><ListIcon className="h-3.5 w-3.5" /> List</button>
                           <button onClick={() => setViewMode("calendar")} className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 h-8 px-3 text-[12px] font-bold rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}><CalendarIcon className="h-3.5 w-3.5" /> Calendar</button>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6 w-full overflow-x-auto pb-2 md:pb-0">
                     {[
                        { id: "All", label: "All Invoices", count: invoicesState.length },
                        { id: "Repair", label: "Repair Invoices", count: invoicesState.filter(i => i.type === 'client_repair').length },
                        { id: "Inventory", label: "Device Invoices", count: invoicesState.filter(i => i.type === 'inventory_item').length }
                     ].map(tab => (
                        <button
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id)}
                           className={`h-9 px-6 rounded-full text-[13px] font-bold transition-all focus:outline-none whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'bg-[#4F46E5] text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }`}
                        >
                           {tab.label}
                           <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
                              {tab.count}
                           </span>
                        </button>
                     ))}
                  </div>

                  {/* GRID vs LIST LOOP */}
                  {processedInvoices.length === 0 ? (
                     <div className="w-full flex-1 flex flex-col items-center justify-center py-24 bg-card rounded-xl border border-border shadow-sm mb-8">
                        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                           <Receipt className="h-6 w-6 text-muted-foreground/60" />
                        </div>
                        <h3 className="text-[16px] font-black text-foreground mb-1">No Invoices Matches Found</h3>
                        <p className="text-[13px] text-muted-foreground">Adjust filters, tabs, or terminology.</p>
                     </div>
                  ) : viewMode === "grid" ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 flex-1">
                        {processedInvoices.map((inv) => (
                           <div key={inv.id} className="bg-card rounded-[20px] border border-border flex flex-col shadow-sm hover:border-[#4F46E5]/30 hover:shadow-xl transition-all group overflow-hidden relative">
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
                                 <h2 className="text-[17px] font-black text-foreground tracking-tight mb-1 truncate">{inv.name}</h2>
                                 <p className="text-[12px] text-muted-foreground font-bold mb-5 flex items-center gap-2">
                                    <span className="opacity-50 font-mono">{inv.invoiceId}</span>
                                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                    <span>{inv.phone}</span>
                                 </p>
                                 {inv.device && inv.device !== 'Internal' && (
                                    <p className="text-[11px] font-black text-[#4F46E5] flex items-center gap-1.5 mb-5 bg-indigo-50/50 w-fit px-2 py-1 rounded-md border border-indigo-100/50">
                                       <Smartphone className="h-3 w-3" />
                                       {inv.device}
                                    </p>
                                 )}

                                 {user?.role !== 'TECHNICIAN' && (
                                   <div className="pt-4 border-t border-border">
                                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Total Amount</p>
                                      <div className="flex items-baseline gap-1">
                                          <span className="text-[14px] font-bold text-muted-foreground">Rs.</span>
                                          <span className="text-[26px] font-black text-foreground tracking-tighter">{(inv.amount ?? 0).toLocaleString()}</span>
                                      </div>
                                   </div>
                                 )}
                              </div>

                              <div className="mt-auto grid grid-cols-3 divide-x divide-border border-t border-border bg-muted/30">
                                 <button onClick={() => setViewDocumentTarget(inv)} className="h-12 flex justify-center items-center text-muted-foreground hover:bg-muted hover:text-[#4F46E5] transition-all focus:outline-none group/btn">
                                    <Eye className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                                 </button>
                                 <button onClick={() => setEditInvoiceTarget(inv)} className="h-12 flex justify-center items-center text-muted-foreground hover:bg-muted hover:text-[#4F46E5] transition-all focus:outline-none group/btn">
                                    <Edit2 className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                                 </button>
                                 {user?.role !== 'TECHNICIAN' && (
                                   <button onClick={() => setDeleteFormTarget(inv)} className="h-12 flex justify-center items-center text-muted-foreground hover:bg-muted hover:text-red-600 transition-all focus:outline-none group/btn">
                                      <Trash2 className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                                   </button>
                                 )}
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : viewMode === "list" ? (
                     <div className="w-full bg-card rounded-xl border border-border shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex-1 overflow-hidden mb-8">
                        <div className="w-full overflow-x-auto">
                           <table className="w-full text-left border-collapse min-w-[800px]">
                              <thead>
                                 <tr className="border-b border-border bg-muted/40">
                                    <th className="px-6 py-4 w-12"><input type="checkbox" className="h-[15px] w-[15px] rounded border-border accent-[#4F46E5]" /></th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground tracking-widest cursor-pointer hover:bg-muted/50 transition-colors">Invoice <ArrowUpDown className="h-3 w-3 inline-block ml-1 opacity-50" /></th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground tracking-widest cursor-pointer hover:bg-muted/50 transition-colors">Details <ArrowUpDown className="h-3 w-3 inline-block ml-1 opacity-50" /></th>
                                    {user?.role !== 'TECHNICIAN' && <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground tracking-widest cursor-pointer hover:bg-muted/50 transition-colors">Amount <ArrowUpDown className="h-3 w-3 inline-block ml-1 opacity-50" /></th>}
                                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground tracking-widest cursor-pointer hover:bg-muted/50 transition-colors">Date <ArrowUpDown className="h-3 w-3 inline-block ml-1 opacity-50" /></th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground tracking-widest text-right">Actions</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                 {processedInvoices.map((inv) => (
                                     <tr key={inv.id} className="hover:bg-muted/30 transition-colors group">
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
                                              <span className="text-[14px] font-black text-foreground tracking-tight truncate max-w-[180px]">{inv.name}</span>
                                             <span className="text-[11px] text-muted-foreground font-bold">{inv.phone}</span>
                                             {inv.device && inv.device !== 'Internal' && (
                                                <span className="text-[10px] font-bold text-[#4F46E5] flex items-center gap-1 mt-0.5">
                                                   <Smartphone className="h-2.5 w-2.5" />
                                                   {inv.device}
                                                </span>
                                             )}
                                          </div>
                                       </td>
                                       {user?.role !== 'TECHNICIAN' && (
                                       <td className="px-6 py-4">
                                          <div className="flex flex-col">
                                              <span className="text-[14px] font-black text-foreground">Rs. {(inv.amount ?? 0).toLocaleString()}</span>
                                             <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border w-fit mt-1 uppercase tracking-wider ${STATUS_STYLE[inv.status]}`}>{inv.status}</span>
                                          </div>
                                       </td>
                                       )}
                                       <td className="px-6 py-4">
                                          <div className="flex flex-col text-[12px]">
                                              <span className="font-bold text-foreground">{new Date(inv.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                             <span className="text-[10px] text-muted-foreground font-medium uppercase">{new Date(inv.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                          </div>
                                       </td>
                                       <td className="px-6 py-4 text-right">
                                          <div className="flex items-center justify-end gap-1.5 transition-opacity">
                                             <button onClick={() => setViewDocumentTarget(inv)} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-all"><Eye className="h-4 w-4" /></button>
                                             <button onClick={() => setEditInvoiceTarget(inv)} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-all"><Edit2 className="h-4 w-4" /></button>
                                             <div className="relative">
                                                 <button onClick={(e) => { e.stopPropagation(); setActiveDropdownId(activeDropdownId === inv.id ? null : inv.id) }} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"><MoreVertical className="h-4 w-4" /></button>
                                                {activeDropdownId === inv.id && (
                                                    <div className="absolute top-10 right-0 w-44 bg-card rounded-xl border border-border mt-1 shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                                                       <button onClick={() => { handleDownloadPDF(inv); setActiveDropdownId(null); }} className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-bold text-foreground hover:bg-muted">
                                                          <Download className="h-3.5 w-3.5 text-muted-foreground" /> Download PDF
                                                       </button>
                                                       {user?.role !== 'TECHNICIAN' && (
                                                          <>
                                                             <div className="w-full h-px bg-border my-1" />
                                                             <button onClick={() => { setDeleteFormTarget(inv); setActiveDropdownId(null); }} className="w-full text-left flex items-center justify-between gap-2 px-4 py-2.5 text-[12px] font-bold text-red-500 hover:bg-red-500/10">
                                                               Void Record <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                         </>
                                                      )}
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
                     <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-border bg-card rounded-xl shadow-sm flex-1 mb-8">
                        <CalendarIcon className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-[16px] font-black text-foreground">Calendar Mapping Empty Space</h3>
                     </div>
                  )}

               </div>
               <div className="h-12" />
               <DashboardFooter />
            </main>

            {isAddInvoiceOpen && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[4px] animate-in fade-in duration-300 p-4">
                  <div className={`bg-card w-full max-w-[900px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300 border border-border`}>

                     <div className="flex justify-between items-center p-8 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-4">
                           <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ${addInvoiceType === 'client_repair' ? 'bg-[#4F46E5] text-white' : 'bg-[#EA580C] text-white'}`}>
                              {addInvoiceType === 'client_repair' ? <Wrench className="h-6 w-6" /> : <Box className="h-6 w-6" />}
                           </div>
                           <div>
                              <h2 className="text-[22px] font-black text-[#0F172A] tracking-tight">
                                 {mounted ? (addInvoiceType === 'client_repair' ? t('invoicesPage.generateRepair') : t('invoicesPage.createInventoryLedger')) : (addInvoiceType === 'client_repair' ? 'Generate Repair Invoice' : 'Create Inventory / Sale Ledger')}
                              </h2>
                              <p className="text-[13px] text-muted-foreground font-bold">{mounted ? t('invoicesPage.subtitle') : 'Comprehensive invoicing for professional workflows.'}</p>
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
                                 <Wrench className="h-4 w-4" /> {mounted ? t('invoicesPage.repairIntake') : 'Repair Intake'}
                              </button>
                              <button
                                 onClick={() => setAddInvoiceType("inventory_item")}
                                 className={`flex-1 flex items-center justify-center gap-2.5 h-12 text-[14px] font-black rounded-[16px] transition-all ${addInvoiceType === 'inventory_item' ? 'bg-white text-[#EA580C] shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                              >
                                 <ShoppingCart className="h-4 w-4" /> {mounted ? t('invoicesPage.bulkSale') : 'Bulk Sale / Inventory'}
                              </button>
                           </div>

                           <div className="grid grid-cols-2 gap-6 mb-10">
                              <div className="col-span-2 lg:col-span-1">
                                 <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{mounted ? t('invoicesPage.customerName') : 'Customer / Client Name'}</label>
                                 <div className="relative group" ref={customerSearchRef}>
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-[#4F46E5] transition-colors" />
                                    <input 
                                       value={newInvoiceData.name}
                                       onChange={(e) => {
                                         setNewInvoiceData(p => ({...p, name: e.target.value}))
                                         setIsCustomerSearchOpen(true)
                                       }}
                                       onFocus={() => setIsCustomerSearchOpen(true)}
                                       type="text" 
                                       placeholder={mounted ? t('invoicesPage.searchOrEnter') : "Search or Enter Name..."} 
                                       className="w-full h-12 rounded-xl border border-slate-200 pl-10 pr-4 text-[14px] font-bold focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] outline-none transition-all placeholder:text-slate-300" 
                                    />

                                    {isCustomerSearchOpen && searchResults?.customers?.length > 0 && (
                                       <div className="absolute top-full left-0 w-full bg-white rounded-xl border border-slate-200 shadow-xl mt-2 py-2 z-[110] animate-in fade-in slide-in-from-top-2 duration-200 max-h-[240px] overflow-y-auto custom-scrollbar">
                                         {searchResults.customers.map((c: any) => (
                                           <button
                                             key={c.id}
                                             onClick={() => {
                                               setNewInvoiceData(p => ({ ...p, name: c.name, phone: c.phone || "", customerId: c.id }))
                                               setIsCustomerSearchOpen(false)
                                             }}
                                             className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex flex-col transition-colors"
                                           >
                                             <span className="text-[14px] font-bold text-[#0F172A]">{c.name}</span>
                                             <span className="text-[11px] text-slate-400 font-medium">{c.phone || "No phone"}</span>
                                           </button>
                                         ))}
                                       </div>
                                    )}
                                 </div>
                              </div>
                              <div className="col-span-2 lg:col-span-1">
                                 <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{mounted ? t('invoicesPage.contactNumber') : 'Contact Number'}</label>
                                 <input 
                                    value={newInvoiceData.phone}
                                    onChange={(e) => setNewInvoiceData(p => ({...p, phone: e.target.value}))}
                                    type="text" 
                                    placeholder="+94 7X XXX XXXX" 
                                    className="w-full h-12 rounded-xl border border-slate-200 px-4 text-[14px] font-bold focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] outline-none transition-all placeholder:text-slate-300" 
                                 />
                              </div>
                           </div>

                           {addInvoiceType === 'inventory_item' ? (
                              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                 <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[14px] font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                                       <Box className="h-4 w-4 text-[#EA580C]" /> Line Items
                                    </h3>
                                    <button onClick={() => setInvoiceItems(p => [...p, { id: Date.now(), name: "", sku: "", qty: 1, price: 0 }])} className="text-[12px] font-black text-[#EA580C] flex items-center gap-1.5 hover:bg-orange-500/10 px-3 py-1.5 rounded-lg transition-colors">
                                       <Plus className="h-3.5 w-3.5" /> {mounted ? t('invoicesPage.addRow') : 'Add Row'}
                                    </button>
                                 </div>

                                 <div className="rounded-2xl border border-border overflow-hidden bg-muted/20">
                                    <table className="w-full text-left border-collapse">
                                       <thead className="bg-muted/40">
                                          <tr>
                                             <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{mounted ? t('invoicesPage.itemDescription') : 'Item / Description'}</th>
                                             <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{mounted ? t('invoicesPage.skuImei') : 'SKU / IMEI'}</th>
                                             <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-24">{mounted ? t('invoicesPage.qty') : 'Qty'}</th>
                                             <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-36">{mounted ? t('invoicesPage.unitPrice') : 'Unit Price'}</th>
                                             <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-36">{mounted ? t('invoicesPage.total') : 'Total'}</th>
                                             <th className="px-4 py-3 w-12"></th>
                                          </tr>
                                       </thead>
                                       <tbody className="divide-y divide-border">
                                          {invoiceItems.map((item, idx) => (
                                             <tr key={item.id} className="bg-card">
                                                <td className="p-3"><input value={item.name} onChange={e => { const n = [...invoiceItems]; n[idx].name = e.target.value; setInvoiceItems(n) }} className="w-full h-10 px-3 text-[13px] font-bold border border-transparent focus:border-orange-500/30 bg-background text-foreground rounded-lg outline-none" placeholder="Item name..." /></td>
                                                <td className="p-3"><input value={item.sku} onChange={e => { const n = [...invoiceItems]; n[idx].sku = e.target.value; setInvoiceItems(n) }} className="w-full h-10 px-3 text-[13px] font-bold border border-transparent focus:border-orange-500/30 bg-background text-foreground rounded-lg outline-none" placeholder="SKU..." /></td>
                                                <td className="p-3"><input type="number" value={item.qty} onChange={e => { const n = [...invoiceItems]; n[idx].qty = +e.target.value; setInvoiceItems(n) }} className="w-full h-10 px-3 text-[13px] font-bold border border-transparent focus:border-orange-500/30 bg-background text-foreground rounded-lg outline-none" /></td>
                                                <td className="p-3"><input type="number" value={item.price} onChange={e => { const n = [...invoiceItems]; n[idx].price = +e.target.value; setInvoiceItems(n) }} className="w-full h-10 px-3 text-[13px] font-bold border border-transparent focus:border-orange-500/30 bg-background text-foreground rounded-lg outline-none" /></td>
                                                <td className="p-3 text-[13px] font-black text-foreground tracking-tight">Rs. {(item.qty * item.price).toLocaleString()}</td>
                                                <td className="p-3">
                                                   <button onClick={() => setInvoiceItems(p => p.length > 1 ? p.filter((_, i) => i !== idx) : p)} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                                </td>
                                             </tr>
                                          ))}
                                       </tbody>
                                    </table>
                                 </div>

                                 <div className="flex justify-end pt-6">
                                    <div className="w-[280px] p-6 rounded-2xl bg-muted/30 border border-border">
                                       <div className="flex justify-between items-center mb-2">
                                          <span className="text-[12px] font-bold text-muted-foreground">Subtotal</span>
                                          <span className="text-[13px] font-black text-foreground">Rs. {invoiceItems.reduce((acc, curr) => acc + (curr.qty * curr.price), 0).toLocaleString()}</span>
                                       </div>
                                       <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
                                          <span className="text-[14px] font-black text-foreground">Grand Total</span>
                                          <span className="text-[18px] font-black text-[#EA580C]">Rs. {invoiceItems.reduce((acc, curr) => acc + (curr.qty * curr.price), 0).toLocaleString()}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ) : (
                              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                 <section className="bg-muted/30 p-7 rounded-[24px] border border-border">
                                    <h3 className="text-[13px] font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-2.5">
                                       <Smartphone className="h-5 w-5 text-[#4F46E5]" /> Device Specifications
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                       <div>
                                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                          <select 
                                             value={newInvoiceData.category}
                                             onChange={(e) => setNewInvoiceData(p => ({...p, category: e.target.value}))}
                                             className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors"
                                          >
                                             {DEVICE_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                             ))}
                                          </select>
                                       </div>
                                       <div>
                                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Brand</label>
                                          <input 
                                             value={newInvoiceData.brand}
                                             onChange={(e) => setNewInvoiceData(p => ({...p, brand: e.target.value}))}
                                             type="text" 
                                             placeholder="e.g. Samsung" 
                                             className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors" 
                                          />
                                       </div>
                                       <div>
                                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Model</label>
                                          <input 
                                             value={newInvoiceData.model}
                                             onChange={(e) => setNewInvoiceData(p => ({...p, model: e.target.value}))}
                                             type="text" 
                                             placeholder="e.g. Galaxy S21" 
                                             className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors" 
                                          />
                                       </div>
                                       <div>
                                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Serial/IMEI</label>
                                          <input 
                                             value={newInvoiceData.serial}
                                             onChange={(e) => setNewInvoiceData(p => ({...p, serial: e.target.value}))}
                                             type="text" 
                                             placeholder="IMEI number..." 
                                             className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors" 
                                          />
                                       </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                       <div>
                                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Priority</label>
                                          <select 
                                             value={newInvoiceData.priority}
                                             onChange={(e) => setNewInvoiceData(p => ({...p, priority: e.target.value}))}
                                             className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors"
                                          >
                                             <option value="LOW">Low</option>
                                             <option value="MEDIUM">Medium</option>
                                             <option value="HIGH">High</option>
                                             <option value="URGENT">Urgent</option>
                                          </select>
                                       </div>
                                       <div>
                                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estimated Date</label>
                                          <input 
                                             value={newInvoiceData.estimatedDate}
                                             onChange={(e) => setNewInvoiceData(p => ({...p, estimatedDate: e.target.value}))}
                                             type="date" 
                                             className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors" 
                                          />
                                       </div>
                                       <div>
                                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Assign Technician</label>
                                          <select 
                                             value={newInvoiceData.technician}
                                             onChange={(e) => setNewInvoiceData(p => ({...p, technician: e.target.value}))}
                                             className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors"
                                          >
                                             {STAFF_LIST.map(staff => (
                                                <option key={staff} value={staff}>{staff}</option>
                                             ))}
                                          </select>
                                       </div>
                                    </div>
                                 </section>

                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                       <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Fault Description</label>
                                       <textarea 
                                          value={newInvoiceData.fault}
                                          onChange={(e) => setNewInvoiceData(p => ({...p, fault: e.target.value}))}
                                          rows={3} 
                                          placeholder="Describe the issue in detail..." 
                                          className="w-full rounded-xl border border-slate-200 bg-white p-4 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors resize-none"
                                       ></textarea>
                                    </div>
                                    <div className="space-y-4">
                                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                          <Receipt className="h-4 w-4" /> Cost Breakdown
                                       </h4>
                                       <div className="grid grid-cols-3 gap-4">
                                          <div>
                                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Labour</label>
                                             <input 
                                                value={newInvoiceData.labour || ""} 
                                                onChange={(e) => {
                                                   const val = +e.target.value;
                                                   setNewInvoiceData(p => ({...p, labour: val, amount: (val + p.parts) - p.discount}))
                                                }}
                                                type="number" 
                                                placeholder="0" 
                                                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors" 
                                             />
                                          </div>
                                          <div>
                                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Parts</label>
                                             <input 
                                                value={newInvoiceData.parts || ""} 
                                                onChange={(e) => {
                                                   const val = +e.target.value;
                                                   setNewInvoiceData(p => ({...p, parts: val, amount: (p.labour + val) - p.discount}))
                                                }}
                                                type="number" 
                                                placeholder="0" 
                                                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors" 
                                             />
                                          </div>
                                          <div>
                                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Discount</label>
                                             <input 
                                                value={newInvoiceData.discount || ""} 
                                                onChange={(e) => {
                                                   const val = +e.target.value;
                                                   setNewInvoiceData(p => ({...p, discount: val, amount: (p.labour + p.parts) - val}))
                                                }}
                                                type="number" 
                                                placeholder="0" 
                                                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-[13px] font-bold outline-none focus:border-[#4F46E5] transition-colors" 
                                             />
                                          </div>
                                       </div>
                                       <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                          <span className="text-[13px] font-black text-[#0F172A]">Grand Total</span>
                                          <div className="flex flex-col items-end">
                                             <span className="text-[10px] font-bold text-slate-400 uppercase">Total Payable</span>
                                             <span className="text-[20px] font-black text-[#4F46E5] tracking-tight">Rs. {newInvoiceData.amount.toLocaleString()}</span>
                                          </div>
                                       </div>
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
                           onClick={async () => {
                              const { name, phone, amount } = newInvoiceData;
                              const finalAmount = addInvoiceType === 'inventory_item'
                                 ? invoiceItems.reduce((acc, curr) => acc + (curr.qty * curr.price), 0)
                                 : amount;

                              if (!name || (addInvoiceType === 'inventory_item' ? invoiceItems.length === 0 : !amount)) {
                                 alert("Please provide at least a name and amount");
                                 return;
                              }

                              try {
                                 await createInvoiceMutation({
                                    name,
                                    phone,
                                    amount: finalAmount,
                                    shopId: user?.shopId,
                                    customerId: newInvoiceData.customerId || undefined,
                                    status: 'Paid',
                                    paymentType: 'FULL',
                                    paymentMethod: 'CASH',
                                    notes: addInvoiceType === 'client_repair' 
                                      ? `Repair: ${newInvoiceData.category} ${newInvoiceData.brand} ${newInvoiceData.model} - ${newInvoiceData.fault} | Labour: Rs.${newInvoiceData.labour} | Parts: Rs.${newInvoiceData.parts} | Discount: Rs.${newInvoiceData.discount} | Total: Rs.${newInvoiceData.amount} | Priority: ${newInvoiceData.priority} | Date: ${newInvoiceData.estimatedDate} | Tech: ${newInvoiceData.technician} | Serial: ${newInvoiceData.serial}`
                                      : `Inventory Sale: ${invoiceItems.map(i => i.name).join(', ')}`,
                                 }).unwrap();

                                 setIsAddInvoiceOpen(false);
                                 resetAddForm();
                                 setInvoiceItems([{ id: 1, name: "", sku: "", qty: 1, price: 0 }]);
                              } catch (err) {
                                 console.error("Failed to create invoice", err);
                                 alert("Error creating invoice");
                              }
                           }}
                           className={`flex-1 h-14 rounded-2xl text-white text-[15px] font-black shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none ${addInvoiceType === 'client_repair' ? 'bg-[#4F46E5] shadow-indigo-200' : 'bg-[#EA580C] shadow-orange-200'}`}
                        >
                           {mounted ? (addInvoiceType === 'client_repair' ? t('invoicesPage.finalizeRepair') : t('invoicesPage.generateBulkSale')) : (addInvoiceType === 'client_repair' ? 'Finalize Repair Invoice' : 'Generate Bulk Sale Record')}
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {editInvoiceTarget && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[4px] animate-in fade-in duration-300 p-4">
                  <div className="bg-card w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-border">

                     <div className="flex justify-between items-center p-8 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-[#4F46E5] text-white shadow-sm">
                              <Edit2 className="h-6 w-6" />
                           </div>
                           <div>
                              <h2 className="text-[22px] font-black text-foreground tracking-tight">Edit Invoice</h2>
                              <p className="text-[13px] text-muted-foreground font-bold">{editInvoiceTarget.invoiceId}</p>
                           </div>
                        </div>
                        <button onClick={() => setEditInvoiceTarget(null)} className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-all focus:outline-none"><X className="h-5 w-5" /></button>
                     </div>

                     <div className="p-8 space-y-6">
                        <div>
                           <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2">Invoice Amount (LKR)</label>
                           <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-bold">Rs.</span>
                              <input
                                 id="edit_inv_amount"
                                 type="number"
                                 defaultValue={editInvoiceTarget.amount}
                                 className="w-full h-12 rounded-xl border border-border bg-background text-foreground pl-12 pr-4 text-[14px] font-bold focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] outline-none transition-all placeholder:text-muted-foreground/60"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2">Payment Status</label>
                           <select
                              id="edit_inv_status"
                              defaultValue={editInvoiceTarget.status}
                              className="w-full h-12 rounded-xl border border-border bg-background text-foreground px-4 text-[14px] font-bold focus:ring-4 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] outline-none transition-all"
                           >
                              <option value="Paid">Paid</option>
                              <option value="Pending">Pending</option>
                              <option value="Overdue">Overdue</option>
                           </select>
                        </div>
                     </div>

                     <div className="p-8 bg-muted/30 border-t border-border flex gap-4">
                        <button onClick={() => setEditInvoiceTarget(null)} className="flex-1 h-12 rounded-xl border border-border bg-card text-muted-foreground text-[14px] font-black hover:bg-muted transition-all">Cancel</button>
                        <button
                           onClick={async () => {
                              const amount = +(document.getElementById('edit_inv_amount') as HTMLInputElement).value;
                              const status = (document.getElementById('edit_inv_status') as HTMLSelectElement).value;

                              try {
                                 await handleStatusUpdate(editInvoiceTarget.id, status);
                                 await updateInvoiceStatus({ id: editInvoiceTarget.id, status: status === 'Paid' ? 'COMPLETED' : status === 'Pending' ? 'PENDING' : 'FAILED', amount }).unwrap();
                                 setEditInvoiceTarget(null);
                              } catch (err) {
                                 console.error("Update failed", err);
                              }
                           }}
                           className="flex-1 h-12 rounded-xl bg-[#4F46E5] text-white text-[14px] font-black shadow-lg shadow-indigo-100 hover:bg-[#4338CA] transition-all"
                        >
                           Save Changes
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {viewDocumentTarget && (
               <div className="fixed inset-0 z-[120] flex flex-col items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto py-12 px-4">

                  {/* STICKY ACTION HEADER */}
                  <div className="w-full max-w-[800px] flex justify-end gap-3 mb-6 shrink-0 sticky top-0 z-50">
                     <button
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPDF}
                        className={`h-11 px-6 rounded-full text-white text-[14px] font-black flex items-center gap-2.5 shadow-xl transition-all active:scale-95 ${isGeneratingPDF ? 'bg-[#4F46E5]/70 cursor-not-allowed' : 'bg-[#4F46E5] hover:bg-[#4338CA] hover:shadow-indigo-200'
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
                              <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-xl">
                                 {(user?.shopName || "All Fix Private Limited").charAt(0).toUpperCase()}
                              </div>
                              <h2 className="text-[26px] font-black text-[#0F172A] tracking-tighter uppercase">
                                 {user?.shopName || "All Fix Private Limited"}
                              </h2>
                           </div>
                           <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                              <p className="flex items-center gap-1.5"><Smartphone className="h-3 w-3" /> {user?.shopWebsite || "Digital Repair Hub"}</p>
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
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black">Billed to,</p>
                           <p className="text-[14px] font-black text-[#0F172A] mb-1">{viewDocumentTarget.name ?? 'Guest'}</p>
                           <p className="text-[12px] text-slate-500 font-bold leading-relaxed">{viewDocumentTarget.phone ?? 'N/A'}<br />Client Address Stored<br />Verification Required</p>
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
                                    <p className="text-[14px] font-black text-[#0F172A] mb-1">Component material & Bulk sales</p>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Professional Inventory Sale</p>
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
                              <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 pb-5 border-b border-slate-100">
                                 <span>Subtotal</span>
                                 <span className="text-[#0F172A]">Rs. {(viewDocumentTarget.amount ?? 0).toLocaleString()}</span>
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
                           Thank you for choosing {user?.shopName || "All Fix Private Limited"} for your professional technical needs.
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

                        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                           AllFix © 2026
                        </div>
                     </div>
                  </div>

                  {/* BOTTOM PAPER SPACER */}
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
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black">Billed to,</p>
                           <p className="text-[14px] font-black text-[#0F172A] mb-1">{hiddenInvoiceTarget.name ?? 'Guest'}</p>
                           <p className="text-[12px] text-slate-500 font-bold leading-relaxed">{hiddenInvoiceTarget.phone ?? 'N/A'}<br />Client Address Stored<br />Verification Required</p>
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
                                    <p className="text-[14px] font-black text-[#0F172A] mb-1">Component material & Bulk sales</p>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Professional Component Ledgers</p>
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
                              <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 pb-5 border-b border-slate-100">
                                 <span>Subtotal</span>
                                 <span className="text-[#0F172A]">Rs. {(hiddenInvoiceTarget.amount ?? 0).toLocaleString()}</span>
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
                           Thank you for choosing {user?.shopName || "All Fix Private Limited"} for your professional technical needs.
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

                        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                           AllFix © 2026
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* DELETE CONFIRMATION */}
            {deleteFormTarget && (
               <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-[4px] animate-in fade-in duration-300">
                  <div className="bg-card p-10 rounded-[32px] border border-border shadow-2xl animate-in zoom-in-95 text-center w-[440px]">
                     <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 border-4 border-border shadow-sm">
                        <AlertCircle className="h-10 w-10 text-red-600" />
                     </div>
                     <h3 className="font-black text-[22px] text-foreground mb-2">Void Invoice?</h3>
                     <p className="text-[14px] text-muted-foreground mb-10 font-bold leading-relaxed px-4">This action will permanently invalidate and remove <span className="text-red-600">{deleteFormTarget.invoiceId}</span> from the system records.</p>
                     <div className="grid grid-cols-2 gap-4 px-2">
                        <button onClick={() => setDeleteFormTarget(null)} className="h-14 rounded-2xl border border-border bg-card font-black text-muted-foreground hover:bg-muted transition-all focus:outline-none">Keep Record</button>
                        <button onClick={confirmDelete} className="h-14 rounded-2xl bg-red-600 text-white font-black shadow-lg shadow-red-900/30 hover:bg-red-700 transition-all transform hover:scale-[1.02] focus:outline-none">Void Permanently</button>
                     </div>
                  </div>
               </div>
            )}

            <InvoicesFilterModal
               isOpen={isFiltersOpen}
               onClose={() => setIsFiltersOpen(false)}
               onApply={(filters: InvoiceFilters) => {
                  setFilterTypes(filters.types)
                  setFilterStatuses(filters.statuses)
                  setFilterStaff(filters.staff)
                  setFilterDevices(filters.devices)
                  setFilterAmountRange(filters.amountRange)
                  setFilterDateFrom(filters.dateFrom)
                  setFilterDateTo(filters.dateTo)
                  setIsFiltersOpen(false)
               }}
               onReset={() => {
                  setFilterTypes([])
                  setFilterStatuses([])
                  setFilterStaff([])
                  setFilterDevices([])
                  setFilterAmountRange({ min: 0, max: 100000 })
                  setFilterDateFrom("")
                  setFilterDateTo("")
               }}
               currentFilters={{
                  types: filterTypes,
                  statuses: filterStatuses,
                  staff: filterStaff,
                  devices: filterDevices,
                  amountRange: filterAmountRange,
                  dateFrom: filterDateFrom,
                  dateTo: filterDateTo
               }}
            />
         </div>
      </div>
   )
}
