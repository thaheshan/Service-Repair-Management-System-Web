"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import {
  Search, Filter, ChevronDown, Plus, Eye,
  Grid, List as ListIcon, Calendar as CalendarIcon,
  ChevronRight, MoreVertical, Edit2, Download, Trash2, X, ChevronLeft, ArrowUpDown, Receipt, Box, Wrench, Smartphone
} from "lucide-react"

// Exact Mock Dataset parsing Image 1 + Modified with Types
const mockInvoices = [
  { id: 1, invoiceId: "#REP-2026-001234", type: "client_repair", name: "Ahmed Hassan", phone: "+94 77 123 4567", amount: "Rs. 8,500", amountClass: "text-[#059669]", date: "25th January 2025", parsedAmount: 8500 },
  { id: 2, invoiceId: "#REP-2026-001233", type: "client_repair", name: "Sarah Perera", phone: "+94 71 987 6543", amount: "Rs. 6,200", amountClass: "text-[#0F172A]", date: "25th January 2025", parsedAmount: 6200 },
  { id: 3, invoiceId: "#INV-2026-001232", type: "inventory_item", name: "TechSupplier Inc", phone: "+94 76 234 5678", amount: "Rs. 12,500", amountClass: "text-[#059669]", date: "25th January 2025", parsedAmount: 12500 },
  { id: 4, invoiceId: "#INV-2026-001231", type: "inventory_item", name: "Retail Walk-In", phone: "+94 75 345 6789", amount: "Rs. 15,000", amountClass: "text-[#D97706]", date: "25th January 2025", parsedAmount: 15000 },
  { id: 5, invoiceId: "#REP-2026-001230", type: "client_repair", name: "Raj Jayawardena", phone: "+94 72 456 7890", amount: "Rs. 9,800", amountClass: "text-[#059669]", date: "25th January 2025", parsedAmount: 9800 },
  { id: 6, invoiceId: "#REP-2024-001100", type: "client_repair", name: "Kamal Perera", phone: "+94 70 123 4567", amount: "Rs. 5,000", amountClass: "text-[#059669]", date: "15th March 2024", parsedAmount: 5000 },
  { id: 7, invoiceId: "#INV-2026-001235", type: "inventory_item", name: "Ruwan Silva", phone: "+94 71 222 3333", amount: "Rs. 22,000", amountClass: "text-red-600", date: "10th February 2026", parsedAmount: 22000 },
]

export default function InvoicesManagementPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "calendar">("list")
  const [activeTab, setActiveTab] = useState("All")
  const [invoicesState, setInvoicesState] = useState(mockInvoices)
  
  // Interactive Engines
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [sortMethod, setSortMethod] = useState("Name (A-Z)")

  const [filterStatuses, setFilterStatuses] = useState({ paid: true, pending: true, overdue: true })

  // System Modals
  const [viewDocumentTarget, setViewDocumentTarget] = useState<any | null>(null)
  const [editRepairTarget, setEditRepairTarget] = useState<any | null>(null)
  const [editInventoryTarget, setEditInventoryTarget] = useState<any | null>(null)
  const [deleteFormTarget, setDeleteFormTarget] = useState<any | null>(null)
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false)
  
  // Create Modal Toggle Engine
  const [addInvoiceType, setAddInvoiceType] = useState<"client_repair" | "inventory_item">("client_repair")

  // Edit Temp Form States
  const [editFormData, setEditFormData] = useState({ amount: "", status: "" })
  const [autoUpdateCheckbox, setAutoUpdateCheckbox] = useState(false)

  const handleEditRouterOpen = (inv: any) => {
    setEditFormData({ 
      amount: inv.amount, 
      status: inv.amountClass.includes('059669') ? 'Paid' : inv.amountClass.includes('D97706') ? 'Pending' : 'Overdue' 
    })
    if (inv.type === 'client_repair') {
      setEditRepairTarget(inv)
      setAutoUpdateCheckbox(false)
    } else {
      setEditInventoryTarget(inv)
    }
  }

  const handleUnifiedSave = (targetId: number, targetRefType: 'repair' | 'inventory') => {
    const amountClass = editFormData.status === 'Paid' ? "text-[#059669]" : editFormData.status === 'Pending' ? "text-[#D97706]" : "text-red-600";
    setInvoicesState(invoicesState.map(inv => 
      inv.id === targetId ? { ...inv, amount: editFormData.amount, amountClass } : inv
    ))
    if (targetRefType === 'repair') setEditRepairTarget(null);
    if (targetRefType === 'inventory') setEditInventoryTarget(null);
  }
  
  const confirmDelete = () => {
    if (deleteFormTarget) {
       setInvoicesState(invoicesState.filter(inv => inv.id !== deleteFormTarget.id))
       setDeleteFormTarget(null)
    }
  }

  // MASTER FILTERING ENGINE
  const processedInvoices = useMemo(() => {
    let result = [...invoicesState];

    if (searchTerm) {
       const lowerSearch = searchTerm.toLowerCase()
       result = result.filter(inv => 
         inv.name.toLowerCase().includes(lowerSearch) || 
         inv.invoiceId.toLowerCase().includes(lowerSearch) ||
         inv.phone.includes(searchTerm)
       )
    }

    if (activeTab !== "All") {
       result = result.filter(inv => inv.date.includes(activeTab))
    }

    result = result.filter(inv => {
       if (inv.amountClass.includes('059669') && !filterStatuses.paid) return false;
       if (inv.amountClass.includes('D97706') && !filterStatuses.pending) return false;
       if (inv.amountClass.includes('red-600') && !filterStatuses.overdue) return false;
       return true;
    })

    if (sortMethod === "Name (A-Z)") {
       result.sort((a,b) => a.name.localeCompare(b.name))
    } else if (sortMethod === "Amount (Highest)") {
       result.sort((a,b) => b.parsedAmount - a.parsedAmount)
    } else if (sortMethod === "Amount (Lowest)") {
       result.sort((a,b) => a.parsedAmount - b.parsedAmount)
    } else if (sortMethod === "Date (Newest)") {
       result.sort((a,b) => b.id - a.id)
    }

    return result;
  }, [invoicesState, searchTerm, activeTab, filterStatuses, sortMethod])


  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col ml-[200px] min-w-0">
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

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full md:w-[420px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search by name, client, or invoice #"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-white text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsFiltersOpen(!isFiltersOpen); setIsSortOpen(false); }}
                  className={`flex items-center gap-2 h-10 px-4 rounded-lg border text-[13px] font-semibold transition-colors focus:outline-none whitespace-nowrap ${isFiltersOpen ? 'bg-muted border-border text-[#0F172A]' : 'bg-white border-border text-[#0F172A] hover:bg-muted shadow-sm'}`}
                >
                  <Filter className="h-4 w-4 text-muted-foreground" /> Filters
                </button>
                
                {isFiltersOpen && (
                   <div className="absolute top-12 left-0 w-64 bg-white rounded-xl shadow-2xl border border-border/80 p-5 z-40 animate-in fade-in">
                      <h3 className="text-[14px] font-bold text-[#0F172A] mb-4">Invoice Status</h3>
                      <div className="space-y-3 mb-6">
                         <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" checked={filterStatuses.paid} onChange={() => setFilterStatuses({...filterStatuses, paid: !filterStatuses.paid})} className="h-[15px] w-[15px] rounded border-border accent-[#4F46E5]" />
                           <span className="text-[13px] text-muted-foreground font-medium">Paid (Green)</span>
                         </label>
                         <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" checked={filterStatuses.pending} onChange={() => setFilterStatuses({...filterStatuses, pending: !filterStatuses.pending})} className="h-[15px] w-[15px] rounded border-border accent-[#4F46E5]" />
                           <span className="text-[13px] text-muted-foreground font-medium">Pending (Orange)</span>
                         </label>
                         <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" checked={filterStatuses.overdue} onChange={() => setFilterStatuses({...filterStatuses, overdue: !filterStatuses.overdue})} className="h-[15px] w-[15px] rounded border-border accent-[#4F46E5]" />
                           <span className="text-[13px] text-muted-foreground font-medium">Overdue (Red)</span>
                         </label>
                      </div>
                   </div>
                )}

                <div className="relative">
                   <button 
                     onClick={(e) => { e.stopPropagation(); setIsSortOpen(!isSortOpen); setIsFiltersOpen(false); }}
                     className="flex items-center justify-between gap-2 w-48 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-semibold text-[#0F172A] hover:bg-muted shadow-sm transition-colors focus:outline-none"
                   >
                     <span className="text-muted-foreground font-medium text-[12px] truncate">Sort by: {sortMethod.replace(' (Highest)', '').replace(' (A-Z)', '')}</span> <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                   </button>
                   {isSortOpen && (
                      <div className="absolute top-12 left-0 w-48 bg-white rounded-lg border border-border shadow-xl py-1 z-40 animate-in fade-in slide-in-from-top-2">
                        {["Name (A-Z)", "Amount (Highest)", "Amount (Lowest)", "Date (Newest)"].map(opt => (
                           <button 
                             key={opt}
                             onClick={() => setSortMethod(opt)} 
                             className={`w-full text-left px-4 py-2.5 text-[12px] font-bold transition-colors focus:outline-none ${sortMethod === opt ? 'bg-[#4F46E5]/10 text-[#4F46E5]' : 'text-[#0F172A] hover:bg-muted'}`}
                           >
                             {opt}
                           </button>
                        ))}
                      </div>
                   )}
                </div>

                <div className="flex items-center bg-white border border-border rounded-lg p-1 shadow-sm md:ml-3">
                  <button onClick={() => setViewMode("grid")} className={`flex items-center gap-1.5 h-8 px-3 text-[12px] font-bold rounded-md transition-colors ${viewMode === 'grid' ? 'bg-muted text-[#0F172A]' : 'text-muted-foreground hover:text-[#0F172A]'}`}><Grid className="h-3.5 w-3.5" /> Grid</button>
                  <button onClick={() => setViewMode("list")} className={`flex items-center gap-1.5 h-8 px-3 text-[12px] font-bold rounded-md transition-colors ${viewMode === 'list' ? 'bg-muted text-[#0F172A]' : 'text-muted-foreground hover:text-[#0F172A]'}`}><ListIcon className="h-3.5 w-3.5" /> List</button>
                  <button onClick={() => setViewMode("calendar")} className={`flex items-center gap-1.5 h-8 px-3 text-[12px] font-bold rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-muted text-[#0F172A]' : 'text-muted-foreground hover:text-[#0F172A]'}`}><CalendarIcon className="h-3.5 w-3.5" /> Calendar</button>
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
                   <div key={inv.id} className="bg-white rounded-[16px] border border-border flex flex-col shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:border-[#4F46E5]/30 hover:shadow-md transition-all group overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4F46E5] to-[#818cf8]" />
                      <div className="p-6 pb-5 border-b border-border/60 relative mt-2">
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black tracking-widest uppercase rounded mb-4 ${inv.type === 'client_repair' ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-[#FFF7ED] text-[#EA580C]'}`}>
                           {inv.type === 'client_repair' ? <Wrench className="h-3 w-3" /> : <Box className="h-3 w-3" />}
                           {inv.type === 'client_repair' ? 'Repair Info' : 'Stock Info'}
                         </span>
                         <h2 className="text-[16px] font-black text-[#0F172A] tracking-tight mb-1 truncate">{inv.name}</h2>
                         <p className="text-[12px] text-muted-foreground font-medium mb-5">{inv.phone}</p>
                         
                         <div className="flex items-center justify-between">
                           <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Amount Billed</p>
                              <span className={`text-[24px] font-black leading-none ${inv.amountClass}`}>{inv.amount}</span>
                           </div>
                         </div>
                      </div>
                      
                      <div className="flex bg-[#F8FAFC] items-center text-[12px] font-bold text-muted-foreground p-4">
                         <span className="flex-1 truncate uppercase">ID: {inv.invoiceId.replace('#', '')}</span>
                         <span>{inv.date}</span>
                      </div>

                      <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-white">
                          <button onClick={() => setViewDocumentTarget(inv)} className="h-11 flex justify-center items-center text-muted-foreground hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-colors focus:outline-none">
                             <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleEditRouterOpen(inv)} className="h-11 flex justify-center items-center text-muted-foreground hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-colors focus:outline-none">
                             <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => setDeleteFormTarget(inv)} className="h-11 flex justify-center items-center text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none">
                             <Trash2 className="h-4 w-4" />
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
                             <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors">
                                <td className="px-6 py-4"><input type="checkbox" className="h-[15px] w-[15px] rounded border-border accent-[#4F46E5]" /></td>
                                <td className="px-6 py-4">
                                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${inv.type === 'client_repair' ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-[#FFF7ED] text-[#EA580C]'}`}>
                                     {inv.type === 'client_repair' ? <Wrench className="h-4 w-4" /> : <Box className="h-4 w-4" />}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <Link href="#" onClick={(e) => { e.preventDefault(); setViewDocumentTarget(inv); }} className="text-[13px] font-bold text-[#4F46E5] hover:underline cursor-pointer">
                                    {inv.invoiceId}
                                  </Link>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                     <span className="text-[13px] font-bold text-[#0F172A]">{inv.name}</span>
                                     <span className="text-[11px] text-muted-foreground font-medium mt-0.5">{inv.phone}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`text-[13px] font-bold tracking-wide ${inv.amountClass}`}>{inv.amount}</span>
                                </td>
                                <td className="px-6 py-4 text-[12px] text-muted-foreground font-medium">
                                  {inv.date}
                                </td>
                                <td className="px-6 py-4 text-right">
                                   <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                                     <button onClick={() => setViewDocumentTarget(inv)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#0F172A] transition-all"><Eye className="h-4 w-4" /></button>
                                     <button onClick={() => handleEditRouterOpen(inv)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#4F46E5] transition-all"><Edit2 className="h-4 w-4" /></button>
                                     <div className="relative">
                                       <button onClick={() => setActiveDropdownId(activeDropdownId === inv.id ? null : inv.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#0F172A] transition-all"><MoreVertical className="h-4 w-4" /></button>
                                       {activeDropdownId === inv.id && (
                                          <div className="absolute top-10 right-0 w-44 bg-white rounded-lg border border-border shadow-lg py-1 z-50 animate-in fade-in">
                                             <button onClick={() => setActiveDropdownId(null)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-[#0F172A] hover:bg-[#F8FAFC]">
                                               <Download className="h-3.5 w-3.5 text-muted-foreground" /> Download PDF
                                             </button>
                                             <div className="w-full h-px bg-border my-1" />
                                             <button onClick={() => { setDeleteFormTarget(inv); setActiveDropdownId(null); }} className="w-full text-left flex items-center justify-between gap-2 px-4 py-2 text-[13px] font-bold text-red-600 hover:bg-red-50">
                                               Delete Base <Trash2 className="h-3.5 w-3.5" />
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

        {/* MASTER CREATION MODAL */}
        {isAddInvoiceOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
              <div className={`bg-white w-full max-w-[850px] rounded-2xl shadow-2xl overflow-y-auto max-h-[95vh] animate-in zoom-in-95 duration-200 ${addInvoiceType === 'inventory_item' ? 'border-t-4 border-[#EA580C]' : 'border-t-4 border-[#4F46E5]'}`}>
                 
                 <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC] sticky top-0 z-30">
                   <div>
                      <h2 className="text-[20px] font-black text-[#0F172A] flex items-center gap-2 tracking-tight">
                        {addInvoiceType === 'client_repair' ? <Wrench className="h-6 w-6 text-[#4F46E5]" /> : <Box className="h-6 w-6 text-[#EA580C]" />}
                        {addInvoiceType === 'client_repair' ? 'Advanced Repair Intake & Billing' : 'Master Inventory & Logistics Ledger'}
                      </h2>
                      <p className="text-[12px] text-muted-foreground font-medium mt-0.5">Capture comprehensive detail for immediate processing.</p>
                   </div>
                   <button onClick={() => setIsAddInvoiceOpen(false)} className="h-10 w-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors focus:outline-none shadow-sm"><X className="h-5 w-5" /></button>
                 </div>
                 
                 <div className="px-10 pt-8 pb-4">
                    <div className="flex bg-[#F1F5F9] p-1.5 rounded-2xl shadow-inner">
                       <button 
                         onClick={() => setAddInvoiceType("client_repair")}
                         className={`flex-1 flex items-center justify-center gap-3 h-12 text-[14px] font-black rounded-xl transition-all ${addInvoiceType === 'client_repair' ? 'bg-white text-[#4F46E5] shadow-md border border-[#4F46E5]/10' : 'text-muted-foreground hover:text-[#0F172A]'}`}
                       >
                         <Wrench className="h-4 w-4" /> Comprehensive Repair
                       </button>
                       <button 
                         onClick={() => setAddInvoiceType("inventory_item")}
                         className={`flex-1 flex items-center justify-center gap-3 h-12 text-[14px] font-black rounded-xl transition-all ${addInvoiceType === 'inventory_item' ? 'bg-white text-[#EA580C] shadow-md border border-[#EA580C]/10' : 'text-muted-foreground hover:text-[#0F172A]'}`}
                       >
                         <Box className="h-4 w-4" /> Bulk Inventory / Sale
                       </button>
                    </div>
                 </div>

                 <div className="px-10 pb-10 pt-4">
                    {addInvoiceType === "client_repair" && (
                      <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-300">
                        <section>
                           <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-widest mb-4 border-b pb-2 border-border/60">1. Customer & Logistics</h3>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="col-span-2 md:col-span-1">
                                 <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Customer Lookup / Manual Entry</label>
                                 <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input id="rep_name_new" type="text" placeholder="Start typing name or phone..." className="w-full h-12 rounded-xl border border-border pl-10 pr-4 text-[13px] font-medium focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] outline-none transition-all bg-white" />
                                 </div>
                              </div>
                              <div className="col-span-2 md:col-span-1">
                                 <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Primary Contact Phone</label>
                                 <input id="rep_phone_new" type="text" placeholder="+94 7X XXX XXXX" className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-medium focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] outline-none transition-all bg-white" />
                              </div>
                           </div>
                        </section>

                        <section className="bg-muted/30 p-8 rounded-[24px] border border-border/60">
                           <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-widest mb-6 flex items-center gap-2">
                             <Smartphone className="h-5 w-5 text-[#4F46E5]" /> 2. Device Infrastructure
                           </h3>
                           <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                              <div>
                                 <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Category</label>
                                 <select className="w-full h-11 rounded-lg border border-border bg-white px-3 text-[13px] font-bold outline-none">
                                    <option>Mobile Phone</option>
                                    <option>Tablet</option>
                                    <option>Laptop</option>
                                    <option>Console</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Brand</label>
                                 <input type="text" placeholder="e.g. Apple" className="w-full h-11 rounded-lg border border-border bg-white px-3 text-[13px] font-bold outline-none" />
                              </div>
                           </div>
                        </section>
                      </div>
                    )}

                    <div className="flex w-full gap-5 pt-12 mt-10 border-t border-border">
                      <button onClick={() => setIsAddInvoiceOpen(false)} className="flex-[0.4] h-14 rounded-2xl border border-border bg-white text-[#475569] text-[15px] font-black hover:bg-[#F8FAFC] transition-all focus:outline-none shadow-sm capitalize tracking-wide">
                        Discard Document
                      </button>
                      <button 
                        onClick={() => {
                           let rawName, rawAmount;
                           if (addInvoiceType === 'client_repair') {
                             rawName = (document.getElementById('rep_name_new') as HTMLInputElement)?.value || "New Repair Client";
                             rawAmount = 7500;
                           } else {
                             rawName = "New Retail Client";
                             rawAmount = 75000;
                           }

                           const finalConstruct = {
                              id: Date.now(),
                              invoiceId: addInvoiceType === 'client_repair' ? `#REP-2026-${Math.floor(Math.random() * 90000)}` : `#INV-2026-${Math.floor(Math.random() * 90000)}`,
                              type: addInvoiceType, 
                              name: rawName,
                              phone: "+94 77 XXX XXXX",
                              amount: `Rs. ${Number(rawAmount).toLocaleString()}`,
                              amountClass: "text-[#D97706]", 
                              date: `28th March 2026`,
                              parsedAmount: Number(rawAmount)
                           };
                           setInvoicesState((prev) => [finalConstruct, ...prev]);
                           setIsAddInvoiceOpen(false);
                        }} 
                        className={`flex-1 h-14 rounded-2xl text-white text-[15px] font-black shadow-lg shadow-black/10 transition-all focus:outline-none ${addInvoiceType === 'client_repair' ? 'bg-[#4F46E5] hover:bg-[#4338CA]' : 'bg-[#EA580C] hover:bg-[#C2410C]'}`}
                      >
                        {addInvoiceType === 'client_repair' ? 'Lock & Generate Repair Invoice' : 'Lock & Finalize Inventory Ledger'}
                      </button>
                   </div>
                 </div>

              </div>
           </div>
        )}

        {/* REPAIR EDIT MODAL */}
        {editRepairTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <button onClick={() => setEditRepairTarget(null)} className="absolute right-4 top-4 h-6 w-6 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground/20 transition-colors"><X className="h-3.5 w-3.5" /></button>
              <div className="flex flex-col items-center text-center mt-2">
                <h2 className="text-[20px] font-bold text-[#0F172A] mb-3 tracking-tight">Update Repair Invoice?</h2>
                <p className="text-[13px] text-muted-foreground mb-6 font-medium leading-relaxed">Confirming edits to <span className="font-bold text-[#0F172A]">{editRepairTarget.invoiceId}</span>.</p>
                
                <div className="w-full space-y-3 mb-6 bg-[#F8FAFC] border border-border rounded-xl p-4 text-left">
                   <div>
                      <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Adjust Amount (LKR)</label>
                      <input type="text" value={editFormData.amount} onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })} className="w-full h-10 rounded-lg border border-border px-3 text-[13px] font-bold outline-none" />
                   </div>
                </div>

                <div className="flex w-full gap-4">
                  <button onClick={() => setEditRepairTarget(null)} className="flex-1 h-11 rounded-xl border border-[#4F46E5] text-[#4F46E5] font-semibold hover:bg-[#EEF2FF] transition-colors focus:outline-none">Cancel</button>
                  <button onClick={() => handleUnifiedSave(editRepairTarget.id, 'repair')} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold transition-colors shadow-md focus:outline-none">Update</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION */}
        {deleteFormTarget && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
             <div className="bg-white p-10 rounded-[24px] border border-border shadow-2xl animate-in zoom-in-95 text-center w-[400px]">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                   <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-black text-[22px] text-[#0F172A] mb-2">Delete Invoice?</h3>
                <p className="text-[13px] text-muted-foreground mb-10 font-medium leading-relaxed">Are you absolutely sure? This will permanently remove the record for {deleteFormTarget.invoiceId}.</p>
                <div className="flex gap-4">
                  <button onClick={() => setDeleteFormTarget(null)} className="flex-1 border border-border h-12 rounded-xl font-bold hover:bg-muted transition-all">Cancel</button>
                  <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white h-12 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all">Delete Record</button>
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  )
}
