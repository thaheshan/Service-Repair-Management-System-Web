"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import {
  Search, Filter, ChevronDown, UserPlus, FileDown, 
  Grid, List as ListIcon, MapPin, Mail, Phone, MessageSquare,
  X, ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon
} from "lucide-react"

// Complete Mock dataset representing the user's high-fidelity image exactly
const customersMock = [
  { id: 1, name: "Sarah Anderson", email: "sarah.anderson@email.com", phone: "+94 77 123 4567", location: "Colombo, Sri Lanka", repairs: 12, spent: "Rs. 58k", visit: "2d", avatar: "1" },
  { id: 2, name: "Michael Johnson", email: "m.johnson@email.com", phone: "+94 71 234 5678", location: "Kandy, Sri Lanka", repairs: 8, spent: "Rs. 45k", visit: "5d", avatar: "2" },
  { id: 3, name: "Emily Chen", email: "emily.chen@email.com", phone: "+94 76 345 6789", location: "Galle, Sri Lanka", repairs: 15, spent: "Rs. 72k", visit: "1d", avatar: "3" },
  { id: 4, name: "David Williams", email: "d.williams@email.com", phone: "+94 75 456 7890", location: "Colombo, Sri Lanka", repairs: 20, spent: "Rs. 95k", visit: "3d", avatar: "4" },
  { id: 5, name: "Lisa Patel", email: "lisa.patel@email.com", phone: "+94 72 567 8901", location: "Negombo, Sri Lanka", repairs: 6, spent: "Rs. 32k", visit: "7d", avatar: "5" },
  { id: 6, name: "Robert Martinez", email: "r.martinez@email.com", phone: "+94 70 678 9012", location: "Jaffna, Sri Lanka", repairs: 4, spent: "Rs. 18k", visit: "12d", avatar: "6" },
  { id: 7, name: "Jennifer Brown", email: "j.brown@email.com", phone: "+94 71 789 0123", location: "Matara, Sri Lanka", repairs: 9, spent: "Rs. 48k", visit: "4d", avatar: "7" },
  { id: 8, name: "Thomas Lee", email: "thomas.lee@email.com", phone: "+94 75 890 1234", location: "Kurunegala, Sri Lanka", repairs: 11, spent: "Rs. 54k", visit: "6d", avatar: "8" },
  { id: 9, name: "Amanda Taylor", email: "a.taylor@email.com", phone: "+94 73 901 2345", location: "Anuradhapura, Sri Lanka", repairs: 18, spent: "Rs. 82k", visit: "1d", avatar: "9" }
]

export default function CustomerManagementPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  
  // Data State
  const [customerList, setCustomerList] = useState(customersMock)

  // Filter States
  const [repairsRange, setRepairsRange] = useState(20)
  const [spentRange, setSpentRange] = useState(15)

  // Modal States
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false)
  const [isManageRolesModalOpen, setIsManageRolesModalOpen] = useState(false)
  const [communicationModalData, setCommunicationModalData] = useState<{type: 'Phone'|'Mail'|'SMS', customer: any} | null>(null)

  const handleClearFilters = () => {
    setRepairsRange(0)
    setSpentRange(0)
    setIsFiltersOpen(false)
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col ml-[200px] min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 flex flex-col pt-0 overflow-y-auto">
          {/* Maximum constraints for a beautiful responsive layout matching the screenshot */}
          <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col">
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-4">
              <Link href="/admin/dashboard" className="hover:text-foreground transition-colors cursor-pointer text-[#4F46E5]">Dashboard</Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              <span className="text-[#0F172A]">Customer Management</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <h1 className="text-[28px] font-black text-[#0F172A] tracking-tight">Customer Management</h1>
                <span className="inline-flex px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[13px] font-bold tracking-wide">
                  126 Customers
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsManageRolesModalOpen(true)}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-bold text-[#0F172A] hover:bg-muted shadow-sm transition-colors focus:outline-none"
                >
                  <UserPlus className="h-4 w-4 text-muted-foreground" /> Manage Roles
                </button>
                <button 
                  onClick={() => setIsAddCustomerModalOpen(true)}
                  className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#4F46E5] text-[13px] font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors focus:outline-none"
                >
                  <Plus className="h-4 w-4" /> Add Customer
                </button>
              </div>
            </div>

            {/* Interactive Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 relative">
              
              {/* Search Input */}
              <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text"
                    placeholder="Search by name, email, phone..."
                    className="w-full h-10 pl-10 pr-10 rounded-lg border border-border bg-white text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] shadow-sm placeholder:text-muted-foreground/70"
                  />
                  <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#0F172A] focus:outline-none"><X className="h-3.5 w-3.5" /></button>
                </div>

                <button 
                  onClick={() => alert("Exporting 126 records as selected format...")} 
                  className="flex items-center justify-between gap-2 w-32 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-semibold text-[#0F172A] hover:bg-muted shadow-sm transition-colors focus:outline-none md:ml-auto"
                >
                  <span className="flex items-center gap-2 text-muted-foreground"><FileDown className="h-4 w-4" /> Export</span> <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                
                <button 
                  onClick={() => alert("Dropdown: Switching sorting rules...")} 
                  className="flex items-center justify-between gap-2 max-w-44 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-semibold text-[#0F172A] hover:bg-muted shadow-sm transition-colors focus:outline-none"
                >
                  <span className="text-muted-foreground font-medium text-[12px] truncate">Sort by: Name (A-Z)</span> <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              </div>

              {/* Right Tools & Filter Popover Relative Anchor */}
              <div className="flex items-center gap-3 w-full md:w-auto relative">
                
                <button 
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`flex items-center gap-2 h-10 px-5 rounded-lg border border-border font-bold text-[13px] transition-colors focus:outline-none shadow-sm ${isFiltersOpen ? 'bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5]/30' : 'bg-white text-[#0F172A] hover:bg-muted'}`}
                >
                  <Filter className={`h-4 w-4 ${isFiltersOpen ? 'text-[#4F46E5]' : 'text-muted-foreground'}`} /> Filters
                </button>

                <div className="flex items-center bg-white border border-border rounded-lg p-1 shadow-sm ml-1">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center justify-center gap-1.5 h-8 w-10 text-[12px] font-bold rounded-md transition-colors focus:outline-none ${viewMode === 'grid' ? 'bg-muted text-[#0F172A]' : 'text-muted-foreground hover:text-[#0F172A]'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`flex items-center justify-center gap-1.5 h-8 w-10 text-[12px] font-bold rounded-md transition-colors focus:outline-none ${viewMode === 'list' ? 'bg-muted text-[#0F172A]' : 'text-muted-foreground hover:text-[#0F172A]'}`}
                  >
                    <ListIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Massive Filter Popover Modal */}
                {isFiltersOpen && (
                  <div className="absolute right-0 top-14 w-[340px] bg-white rounded-xl shadow-2xl border border-border/80 p-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[15px] font-bold text-[#0F172A]">Filters</h3>
                      <button onClick={handleClearFilters} className="text-[12px] font-bold text-[#4F46E5] hover:underline focus:outline-none">Clear All</button>
                    </div>

                    {/* Customer Type */}
                    <div className="mb-6">
                      <label className="block text-[12px] font-bold text-[#0F172A] mb-3">Customer Type</label>
                      <div className="space-y-2.5">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="h-[15px] w-[15px] rounded border-border text-[#4F46E5] focus:ring-[#4F46E5] accent-[#4F46E5]" />
                          <div className="flex-1 flex justify-between items-center text-[13px] text-muted-foreground font-medium"><span>Regular Customers</span> <span>245</span></div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" defaultChecked className="h-[15px] w-[15px] rounded border-border text-[#4F46E5] focus:ring-[#4F46E5] accent-[#4F46E5]" />
                          <div className="flex-1 flex justify-between items-center text-[13px] text-muted-foreground font-medium"><span className="text-[#0F172A] font-bold">VIP Customers</span> <span>32</span></div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="h-[15px] w-[15px] rounded border-border text-[#4F46E5] focus:ring-[#4F46E5] accent-[#4F46E5]" />
                          <div className="flex-1 flex justify-between items-center text-[13px] text-muted-foreground font-medium"><span>New Customers {'(< 30 days)'}</span> <span>7</span></div>
                        </label>
                      </div>
                    </div>

                    {/* Range Sliders Active */}
                    <div className="mb-6 space-y-5">
                      <div>
                         <label className="flex items-center justify-between block text-[12px] font-bold text-[#0F172A] mb-3">
                            Total Repairs
                            <span className="text-[12px] text-[#4F46E5]">0 - {repairsRange === 50 ? '50+' : repairsRange}</span>
                         </label>
                         <input 
                           type="range" 
                           min="0" max="50"
                           value={repairsRange}
                           onChange={(e) => setRepairsRange(Number(e.target.value))}
                           className="w-full h-1.5 bg-[#E2E8F0] rounded-full appearance-none cursor-pointer accent-[#4F46E5] mb-2"
                         />
                         <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground tracking-widest">
                           <span>0</span><span>0 - 50+</span><span>50+</span>
                         </div>
                      </div>
                      <div>
                         <label className="flex items-center justify-between block text-[12px] font-bold text-[#0F172A] mb-3">
                            Total Spent
                            <span className="text-[12px] text-[#4F46E5]">Rs. 0 - {spentRange === 100 ? '100k+' : `${spentRange}K`}</span>
                         </label>
                         <input 
                           type="range" 
                           min="0" max="100"
                           value={spentRange}
                           onChange={(e) => setSpentRange(Number(e.target.value))}
                           className="w-full h-1.5 bg-[#E2E8F0] rounded-full appearance-none cursor-pointer accent-[#4F46E5] mb-2"
                         />
                         <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                           <span>Rs. 0</span><span>Rs. 0-100K+</span><span>Rs. 100K+</span>
                         </div>
                      </div>
                    </div>

                    {/* Last Visit */}
                    <div className="mb-6">
                      <label className="block text-[12px] font-bold text-[#0F172A] mb-3">Last Visit</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-muted-foreground font-medium">
                          <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center p-[2px]"></div> Today
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#0F172A] font-medium">
                          <div className="w-4 h-4 rounded-full border border-[#4F46E5] flex items-center justify-center p-[3px]">
                             <div className="w-full h-full bg-[#4F46E5] rounded-full"></div>
                          </div> This Week
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-muted-foreground font-medium">
                          <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center p-[2px]"></div> This Month
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-muted-foreground font-medium">
                          <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center p-[2px]"></div> Last 6 Months
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[13px] text-muted-foreground font-medium">
                          <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center p-[2px]"></div> Inactive {`(> 6 months)`}
                        </label>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="mb-6">
                      <label className="block text-[12px] font-bold text-[#0F172A] mb-3">Registration Date</label>
                      <div className="space-y-3">
                         <div className="relative">
                            <span className="absolute left-3 -top-2 bg-white px-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">From</span>
                            <div className="w-full h-10 border border-border rounded-lg flex items-center justify-between px-3 text-[13px] text-muted-foreground focus-within:ring-2 ring-[#4F46E5]/20 ring-offset-0">
                               mm/dd/yyyy <CalendarIcon className="h-4 w-4" />
                            </div>
                         </div>
                         <div className="relative">
                            <span className="absolute left-3 -top-2 bg-white px-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">To</span>
                            <div className="w-full h-10 border border-border rounded-lg flex items-center justify-between px-3 text-[13px] text-muted-foreground focus-within:ring-2 ring-[#4F46E5]/20 ring-offset-0">
                               mm/dd/yyyy <CalendarIcon className="h-4 w-4" />
                            </div>
                         </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button onClick={() => setIsFiltersOpen(false)} className="h-10 w-full bg-[#4F46E5] rounded-lg text-white text-[13px] font-bold shadow-md hover:bg-[#4338CA] transition-colors focus:outline-none">
                        Apply Filters
                      </button>
                      <button onClick={handleClearFilters} className="h-9 w-full rounded-lg text-red-500 text-[13px] font-bold hover:bg-red-50 transition-colors focus:outline-none">
                        Reset All
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CONDITIONAL MAP: Grid Layout vs List Layout */}
            {customerList.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-border shadow-sm mb-8 flex-1">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <UserPlus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-[16px] font-black text-[#0F172A] mb-1">No Customers Found</h3>
                  <p className="text-[13px] text-muted-foreground">Adjust filters or add a new customer.</p>
              </div>
            ) : viewMode === "grid" ? (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 flex-1">
                 {customerList.map((customer) => (
                   <div key={customer.id} className="bg-white rounded-[16px] border border-border p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:border-[#4F46E5]/30 hover:shadow-md transition-all group flex flex-col items-center text-center">
                      {/* Avatar */}
                      <div className="mb-4">
                         <img 
                           src={`https://i.pravatar.cc/150?u=${customer.avatar}`} 
                           alt={customer.name} 
                           className="h-[64px] w-[64px] rounded-full object-cover border-[3px] border-white shadow-sm ring-1 ring-border group-hover:ring-[#4F46E5]/40 transition-all" 
                         />
                      </div>

                      {/* Identity text */}
                      <h2 className="text-[16px] font-bold text-[#0F172A] tracking-tight mb-3">{customer.name}</h2>
                      
                      {/* Contact Details Grid */}
                      <div className="w-full space-y-2 mb-6 text-left border-b border-border/50 pb-5">
                         <div className="flex items-center gap-2.5 text-[12px] text-muted-foreground font-medium truncate">
                            <Mail className="h-3.5 w-3.5 shrink-0" /> {customer.email}
                         </div>
                         <div className="flex items-center gap-2.5 text-[12px] text-muted-foreground font-medium truncate">
                            <Phone className="h-3.5 w-3.5 shrink-0" /> {customer.phone}
                         </div>
                         <div className="flex items-center gap-2.5 text-[12px] text-muted-foreground font-medium truncate">
                            <MapPin className="h-3.5 w-3.5 shrink-0" /> {customer.location}
                         </div>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between w-full mb-6 relative">
                         <div className="flex flex-col items-center flex-1">
                            <span className="text-[18px] font-black leading-none text-[#0F172A] mb-1.5">{customer.repairs}</span>
                            <span className="text-[10px] text-muted-foreground font-bold tracking-wider">Repairs</span>
                         </div>
                         <div className="h-8 w-px bg-border/80" />
                         <div className="flex flex-col items-center flex-1">
                            <span className="text-[18px] font-black leading-none text-[#0F172A] mb-1.5">{customer.spent}</span>
                            <span className="text-[10px] text-muted-foreground font-bold tracking-wider">Spent</span>
                         </div>
                         <div className="h-8 w-px bg-border/80" />
                         <div className="flex flex-col items-center flex-1">
                            <span className="text-[18px] font-black leading-none text-[#0F172A] mb-1.5">{customer.visit}</span>
                            <span className="text-[10px] text-muted-foreground font-bold tracking-wider">Last Visit</span>
                         </div>
                      </div>

                      <button 
                        onClick={() => router.push(`/admin/customers/${customer.id}`)}
                        className="w-full h-9 rounded-lg border border-border bg-white text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-colors focus:outline-none shadow-sm mb-4"
                      >
                        View Profile
                      </button>

                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => setCommunicationModalData({ type: 'Phone', customer })} className="h-8 w-10 flex flex-col items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:text-[#4F46E5] hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF] transition-all focus:outline-none">
                          <Phone className="h-4 w-4" />
                        </button>
                        <button onClick={() => setCommunicationModalData({ type: 'Mail', customer })} className="h-8 w-10 flex flex-col items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:text-[#4F46E5] hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF] transition-all focus:outline-none">
                          <Mail className="h-4 w-4" />
                        </button>
                        <button onClick={() => setCommunicationModalData({ type: 'SMS', customer })} className="h-8 w-10 flex flex-col items-center justify-center rounded-lg border border-border bg-white text-muted-foreground hover:text-[#4F46E5] hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF] transition-all focus:outline-none">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                   </div>
                 ))}
               </div>
            ) : (
               <div className="w-full bg-white rounded-xl border border-border shadow-sm mb-8 overflow-hidden flex-1">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-border bg-[#F8FAFC]">
                          <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Customer Profile</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Contact Info</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Repair History</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-widest text-right">Communicate</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {customerList.map(customer => (
                          <tr key={customer.id} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push(`/admin/customers/${customer.id}`)}>
                             <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                  <img src={`https://i.pravatar.cc/150?u=${customer.avatar}`} className="h-10 w-10 rounded-full border border-border object-cover" alt="" />
                                  <div>
                                     <div className="text-[14px] font-bold text-[#0F172A]">{customer.name}</div>
                                     <div className="text-[12px] text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {customer.location}</div>
                                  </div>
                               </div>
                             </td>
                             <td className="px-6 py-4">
                               <div className="flex flex-col gap-1 text-[12px] text-muted-foreground font-medium">
                                 <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {customer.email}</span>
                                 <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {customer.phone}</span>
                               </div>
                             </td>
                             <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-[12px] font-bold bg-[#F8FAFC]`}>
                                  {customer.repairs} Repairs
                                </span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                  <button onClick={() => setCommunicationModalData({ type: 'Phone', customer })} className="h-8 w-8 rounded-lg flex items-center justify-center border border-border bg-white text-muted-foreground hover:text-[#4F46E5] hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF] transition-all focus:outline-none">
                                    <Phone className="h-3.5 w-3.5" />
                                  </button>
                                  <button onClick={() => setCommunicationModalData({ type: 'Mail', customer })} className="h-8 w-8 rounded-lg flex items-center justify-center border border-border bg-white text-muted-foreground hover:text-[#4F46E5] hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF] transition-all focus:outline-none">
                                    <Mail className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}

            {/* Bottom Pagination Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-border mt-auto w-full">
              <span className="text-[13px] text-muted-foreground font-medium">
                Showing <span className="font-bold text-[#0F172A]">1-24</span> of <span className="font-bold text-[#0F172A]">284</span> customers
              </span>

              <div className="flex items-center gap-2">
                <button disabled className="flex items-center justify-center h-8 px-3 text-[13px] font-semibold text-muted-foreground/50 hover:bg-muted/50 focus:outline-none">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </button>
                
                <div className="flex items-center gap-1">
                  <button className="h-8 w-8 rounded bg-[#4F46E5] text-white text-[13px] font-bold shadow-sm flex items-center justify-center focus:outline-none">1</button>
                  <button className="h-8 w-8 rounded text-[#0F172A] text-[13px] font-semibold hover:bg-muted flex items-center justify-center transition-colors focus:outline-none">2</button>
                  <button className="h-8 w-8 rounded text-[#0F172A] text-[13px] font-semibold hover:bg-muted flex items-center justify-center transition-colors focus:outline-none">3</button>
                  <span className="text-muted-foreground px-1 text-[13px] font-bold">...</span>
                  <button className="h-8 w-8 rounded text-[#0F172A] text-[13px] font-semibold hover:bg-muted flex items-center justify-center transition-colors focus:outline-none border border-border">12</button>
                </div>

                <button className="flex items-center justify-center h-8 px-3 rounded border border-border bg-white shadow-sm text-[13px] font-semibold text-[#0F172A] hover:bg-muted transition-colors focus:outline-none">
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground font-medium hidden md:flex">
                 Show: 
                 <div className="relative">
                   <select defaultValue="24" className="appearance-none h-8 pl-3 pr-8 rounded border border-border bg-white text-[#0F172A] font-bold focus:outline-none focus:ring-1 focus:ring-[#4F46E5] shadow-sm">
                     <option>12</option>
                     <option>24</option>
                     <option>48</option>
                   </select>
                   <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" />
                 </div>
                 per page
              </div>
            </div>

          </div>
          <div className="h-12" /> {/* Layout Spacer */}
          <DashboardFooter />
        </main>
      </div>

      {/* ===================== MODALS ===================== */}

      {/* 1. Add Customer Modal */}
      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
           <div className="bg-white w-full max-w-[600px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
                <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-[#4F46E5]" /> Add New Customer
                </h2>
                <button onClick={() => setIsAddCustomerModalOpen(false)} className="h-8 w-8 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#0F172A] transition-colors focus:outline-none shadow-sm">
                   <X className="h-4 w-4" />
                   <span className="sr-only">Close</span>
                </button>
              </div>
              <div className="p-6">
                 <div className="grid grid-cols-2 gap-5 mb-5">
                   <div>
                     <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">First Name</label>
                     <input type="text" placeholder="Sarah" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                   </div>
                   <div>
                     <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Last Name</label>
                     <input type="text" placeholder="Anderson" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-5 mb-5">
                   <div>
                     <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Email Address</label>
                     <input type="email" placeholder="sarah@example.com" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                   </div>
                   <div>
                     <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Phone Number</label>
                     <input type="tel" placeholder="+94 77 ..." className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                   </div>
                 </div>

                 <div className="mb-6">
                   <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Address</label>
                   <input type="text" placeholder="Street Address, City" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                 </div>

                 <div className="mb-8">
                   <label className="block text-[12px] font-bold text-[#0F172A] mb-3">Customer Tags</label>
                   <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground cursor-pointer group px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-border text-[#4F46E5] focus:ring-[#4F46E5]" />
                        <span className="group-hover:text-[#0F172A] transition-colors">VIP</span>
                      </label>
                      <label className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground cursor-pointer group px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-border text-[#4F46E5] focus:ring-[#4F46E5]" />
                        <span className="group-hover:text-[#0F172A] transition-colors">Corporate</span>
                      </label>
                   </div>
                 </div>

                 <div className="flex w-full gap-3 pt-4 border-t border-border">
                    <button onClick={() => setIsAddCustomerModalOpen(false)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted transition-colors focus:outline-none">
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setIsAddCustomerModalOpen(false)
                        alert("Customer Added Successfully!")
                      }} 
                      className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none"
                    >
                      Save Customer Profile
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 2. Manage Roles / Segments Modal */}
      {isManageRolesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
           <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
                <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-[#4F46E5]" /> Manage Customer Roles
                </h2>
                <button onClick={() => setIsManageRolesModalOpen(false)} className="text-[12px] font-bold text-muted-foreground hover:text-[#0F172A] transition-colors focus:outline-none">
                   <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-0">
                 <div className="divide-y divide-border">
                    {[
                      { role: "VIP Customer", color: "text-[#F59E0B]", desc: "Access to priority repairs and discounted parts." },
                      { role: "Corporate Partner", color: "text-[#9333EA]", desc: "Bulk billing and dedicated account management." },
                      { role: "Regular Customer", color: "text-[#475569]", desc: "Standard repair flow and retail pricing." }
                    ].map((role) => (
                      <div key={role.role} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                        <div>
                          <h3 className={`text-[14px] font-bold ${role.color} flex items-center gap-2 mb-1`}>
                            <span className={`h-2 w-2 rounded-full ${role.color.replace('text', 'bg')}`} /> {role.role}
                          </h3>
                          <p className="text-[12px] text-muted-foreground font-medium">{role.desc}</p>
                        </div>
                        <button className="h-8 px-4 rounded border border-border text-[12px] font-bold text-[#0F172A] hover:bg-muted transition-colors focus:outline-none">
                          Edit
                        </button>
                      </div>
                    ))}
                 </div>
                 <div className="p-5 border-t border-border bg-[#F8FAFC] flex justify-center">
                    <button className="flex items-center gap-1.5 text-[13px] font-bold text-[#4F46E5] hover:underline focus:outline-none">
                      <Plus className="h-4 w-4" /> Create New Role
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 3. Communication Modal (Phone, Mail, SMS) */}
      {communicationModalData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
           <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-6 border-b border-border bg-[#F8FAFC]">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#EEF2FF] text-[#4F46E5]">
                       {communicationModalData.type === 'Phone' ? <Phone className="h-5 w-5" /> : communicationModalData.type === 'Mail' ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                    </div>
                    <div>
                      <h2 className="text-[16px] font-black text-[#0F172A] leading-tight">
                        {communicationModalData.type === 'Phone' ? "Initiate Call" : communicationModalData.type === 'Mail' ? "Send Email" : "Send SMS"}
                      </h2>
                      <p className="text-[12px] font-bold text-[#4F46E5]">To: {communicationModalData.customer.name}</p>
                    </div>
                 </div>
                 <button onClick={() => setCommunicationModalData(null)} className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#0F172A] transition-colors focus:outline-none">
                   <X className="h-5 w-5" />
                 </button>
              </div>

              <div className="p-6">
                <div className="bg-[#F8FAFC] border border-border rounded-xl p-4 mb-5">
                   {communicationModalData.type === 'Phone' || communicationModalData.type === 'SMS' ? (
                     <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-muted-foreground">Contact Number</span>
                        <span className="text-[14px] font-black text-[#0F172A] font-mono">{communicationModalData.customer.phone}</span>
                     </div>
                   ) : (
                     <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-muted-foreground">Email Address</span>
                        <span className="text-[14px] font-black text-[#0F172A]">{communicationModalData.customer.email}</span>
                     </div>
                   )}
                </div>

                {communicationModalData.type !== 'Phone' && (
                  <div className="mb-6">
                    <label className="block text-[12px] font-bold text-[#0F172A] mb-2">Message</label>
                    <textarea 
                      rows={5} 
                      placeholder={`Draft your ${communicationModalData.type} message here...`}
                      className="w-full p-4 rounded-xl border border-border text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] resize-none"
                    />
                  </div>
                )}

                <div className="flex w-full gap-3">
                   <button onClick={() => setCommunicationModalData(null)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted transition-colors focus:outline-none">
                     Cancel
                   </button>
                   <button 
                     onClick={() => {
                       setCommunicationModalData(null)
                       alert(`${communicationModalData.type} Action Triggered successfully!`)
                     }} 
                     className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none"
                   >
                     {communicationModalData.type === 'Phone' ? "Dial Number" : "Send Message"}
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}

    </div>
  )
}
