"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import {
  Search, Filter, ChevronDown, UserPlus, Shield, 
  Grid, List as ListIcon, Calendar as CalendarIcon,
  Star, MoreVertical, ChevronLeft, ChevronRight, Plus, X, Trash2
} from "lucide-react"

// Complete Mock dataset representing the user's high-fidelity image exactly
const staffMock = [
  { id: 1, name: "Rohan Silva", title: "Senior Technician", titleColor: "text-[#4F46E5]", specialties: "Mobile Phones, Tablets", active: 5, week: 12, rating: 4.9, status: "Available", statusColor: "text-green-600" },
  { id: 2, name: "Nisha Fernando", title: "Lead Technician", titleColor: "text-[#8B5CF6]", specialties: "Laptops, Computers", active: 3, week: 18, rating: 5.0, status: "Available", statusColor: "text-green-600" },
  { id: 3, name: "Amaya Wickrama", title: "Junior Technician", titleColor: "text-[#E11D48]", specialties: "Mobile Phones, Tablets", active: 4, week: 9, rating: 4.8, status: "Available", statusColor: "text-green-600" },
  { id: 4, name: "Dilshan Kumar", title: "Technician", titleColor: "text-[#00A19D]", specialties: "Gaming Consoles, Electronics", active: 2, week: 11, rating: 4.6, status: "Available", statusColor: "text-green-600" },
  { id: 5, name: "Tharindu Jayasinghe", title: "Technician", titleColor: "text-[#00A19D]", specialties: "Mobile Phones, Tablets", active: 6, week: 10, rating: 4.5, status: "Busy", statusColor: "text-red-500" },
  { id: 6, name: "Chathura Bandara", title: "Junior Technician", titleColor: "text-[#E11D48]", specialties: "Laptops, Computers", active: 3, week: 7, rating: 4.4, status: "Available", statusColor: "text-green-600" },
  { id: 7, name: "Nuwan Rajapaksa", title: "Senior Technician", titleColor: "text-[#059669]", specialties: "All Electronics", active: 8, week: 20, rating: 5.0, status: "Busy", statusColor: "text-red-500" },
  { id: 8, name: "Priyanka Samaraweera", title: "Junior Technician", titleColor: "text-[#4F46E5]", specialties: "Mobile Phones", active: 5, week: 8, rating: 4.6, status: "Available", statusColor: "text-green-600" },
]

export default function StaffManagementPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "calendar">("grid")
  const [staffList, setStaffList] = useState(staffMock)
  
  // States
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null)
  
  // Modal States
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false)
  const [isManageRolesModalOpen, setIsManageRolesModalOpen] = useState(false)
  const [isAssignRepairModalOpen, setIsAssignRepairModalOpen] = useState(false)
  const [selectedStaffForAssign, setSelectedStaffForAssign] = useState<any>(null)

  const handleAssignRepairClick = (staff: any) => {
    setSelectedStaffForAssign(staff)
    setIsAssignRepairModalOpen(true)
  }

  const handleRemoveStaff = (id: number) => {
    setStaffList(staffList.filter(s => s.id !== id))
    setActiveDropdownId(null)
  }

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col ml-[200px] min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 flex flex-col pt-0 overflow-y-auto" onClick={() => setActiveDropdownId(null)}>
          <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col">
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-4">
              <Link href="/admin/dashboard" className="hover:text-foreground transition-colors cursor-pointer text-[#4F46E5]">Dashboard</Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              <span className="text-[#0F172A]">Staff Management</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <h1 className="text-[28px] font-black text-[#0F172A] tracking-tight">Staff Management</h1>
                <span className="inline-flex px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[13px] font-bold tracking-wide">
                  {staffList.length} Team Members
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsManageRolesModalOpen(true)}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-bold text-[#0F172A] hover:bg-muted shadow-sm transition-colors focus:outline-none"
                >
                  <Shield className="h-4 w-4 text-muted-foreground" /> Manage Roles
                </button>
                <button 
                  onClick={() => setIsAddStaffModalOpen(true)}
                  className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#4F46E5] text-[13px] font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors focus:outline-none"
                >
                  <Plus className="h-4 w-4" /> Add Staff Member
                </button>
              </div>
            </div>

            {/* Interactive Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              {/* Search Input */}
              <div className="relative w-full md:w-[420px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search by name, role, or specialty..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] shadow-sm placeholder:text-muted-foreground/70"
                />
              </div>

              {/* Right Tools */}
              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <button className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-semibold text-[#0F172A] hover:bg-muted shadow-sm transition-colors focus:outline-none whitespace-nowrap">
                  <Filter className="h-4 w-4 text-muted-foreground" /> Filters
                </button>
                
                <button className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-semibold text-[#0F172A] hover:bg-muted shadow-sm transition-colors focus:outline-none whitespace-nowrap">
                  <span className="text-muted-foreground font-medium mr-1 text-[12px]">Sort by:</span> Name (A-Z) <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                <div className="flex items-center bg-white border border-border rounded-lg p-1 shadow-sm md:ml-3">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center gap-1.5 h-8 px-3 text-[12px] font-bold rounded-md transition-colors focus:outline-none ${viewMode === 'grid' ? 'bg-muted text-[#0F172A]' : 'text-muted-foreground hover:text-[#0F172A]'}`}
                  >
                    <Grid className="h-3.5 w-3.5" /> Grid
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-1.5 h-8 px-3 text-[12px] font-bold rounded-md transition-colors focus:outline-none ${viewMode === 'list' ? 'bg-muted text-[#0F172A]' : 'text-muted-foreground hover:text-[#0F172A]'}`}
                  >
                    <ListIcon className="h-3.5 w-3.5" /> List
                  </button>
                  <button 
                    onClick={() => setViewMode("calendar")}
                    className={`flex items-center gap-1.5 h-8 px-3 text-[12px] font-bold rounded-md transition-colors focus:outline-none ${viewMode === 'calendar' ? 'bg-muted text-[#0F172A]' : 'text-muted-foreground hover:text-[#0F172A]'}`}
                  >
                    <CalendarIcon className="h-3.5 w-3.5" /> Calendar
                  </button>
                </div>
              </div>
            </div>

            {/* CONDITIONAL CONTENT RENDERING MAP */}
            {staffList.length === 0 ? (
              <div className="w-full flex md:col-span-2 lg:col-span-3 xl:col-span-4 flex-col items-center justify-center py-24 bg-white rounded-xl border border-border shadow-sm mb-8">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-[16px] font-black text-[#0F172A] mb-1">No Staff Members Found</h3>
                  <p className="text-[13px] text-muted-foreground">Add a new staff member to populate this dashboard.</p>
              </div>
            ) : viewMode === "grid" ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 w-full flex-1">
                 {staffList.map((staff) => (
                   <div key={staff.id} className="group flex flex-col bg-white rounded-[16px] shadow-sm border border-border hover:shadow-md transition-all relative p-6 h-[280px]">
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-border text-[11px] font-bold shadow-sm">
                        <div className={`h-2 w-2 rounded-full ${staff.statusColor.replace('text', 'bg')}`} />
                        {staff.status}
                      </div>

                      {/* Avatar & Info */}
                      <div className="flex flex-col items-center mt-2 mb-4">
                        <div className="relative mb-3">
                          <img 
                            src={`https://i.pravatar.cc/150?u=${staff.name.replace(/\s+/g, '')}`} 
                            className="h-[72px] w-[72px] rounded-full border-[3px] border-white shadow-md ring-1 ring-border group-hover:ring-[#4F46E5]/40 object-cover bg-muted transition-all"
                            alt={staff.name}
                          />
                          {/* Notification dot indicator */}
                          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-white rounded-full flex items-center justify-center">
                             <div className={`h-2.5 w-2.5 rounded-full ${staff.statusColor.replace('text', 'bg')}`} />
                          </div>
                        </div>
                        <h2 className="text-[15px] font-black text-[#0F172A] mb-0.5">{staff.name}</h2>
                        <p className={`text-[12px] font-bold ${staff.titleColor}`}>{staff.title}</p>
                      </div>

                      {/* Meta Stats Row */}
                      <div className="flex items-center justify-center gap-4 mb-auto text-[11px] font-bold text-muted-foreground">
                        <span className="flex items-center gap-1" title="Currently Active Jobs">
                          <CalendarIcon className="h-3.5 w-3.5" /> {staff.active} Active
                        </span>
                        <span className="h-3 w-px bg-border" />
                        <span className="flex items-center gap-1 text-[#0F172A]" title="Overall Rating">
                          <Star className="h-3.5 w-3.5 text-[#F59E0B] fill-[#F59E0B]" /> {staff.rating.toFixed(1)}
                        </span>
                        <span className="h-3 w-px bg-border" />
                        <span className="flex items-center gap-1" title="Completed This Week">
                          {staff.week} / wk
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex w-full gap-2 mt-auto relative">
                         <button onClick={() => alert("Viewing Profile: " + staff.name)} className="flex-1 h-9 rounded-lg border border-border bg-white text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-colors focus:outline-none shadow-sm">
                           View
                         </button>
                         <button onClick={() => handleAssignRepairClick(staff)} className="flex-[1.5] h-9 rounded-lg bg-[#4F46E5] text-[13px] font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors focus:outline-none">
                           Assign Repair
                         </button>
                         
                         <div className="relative">
                           <button 
                             onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdownId(activeDropdownId === staff.id ? null : staff.id);
                             }} 
                             className="flex shrink-0 items-center justify-center w-9 h-9 rounded-lg border border-border bg-white text-muted-foreground hover:bg-muted hover:text-[#0F172A] transition-colors focus:outline-none shadow-sm"
                           >
                             <MoreVertical className="h-4 w-4" />
                           </button>

                           {/* Context Dropdown Modal */}
                           {activeDropdownId === staff.id && (
                              <div className="absolute bottom-11 right-0 w-44 bg-white rounded-lg border border-border shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                 <button 
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     alert("Editing staff... (simulate feature)");
                                     setActiveDropdownId(null);
                                   }}
                                   className="w-full text-left px-4 py-2 text-[13px] font-bold text-[#0F172A] hover:bg-[#F8FAFC] focus:outline-none"
                                 >
                                   Edit Profile
                                 </button>
                                 <button 
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     handleRemoveStaff(staff.id);
                                   }}
                                   className="w-full flex justify-between items-center text-left px-4 py-2 text-[13px] font-bold text-red-600 hover:bg-red-50 focus:outline-none border-t border-border mt-1 pt-1"
                                 >
                                   Remove Staff <Trash2 className="h-3.5 w-3.5" />
                                 </button>
                              </div>
                           )}
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
            ) : viewMode === "list" ? (
               <div className="w-full bg-white rounded-xl border border-border shadow-sm mb-8 overflow-hidden flex-1">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-border bg-[#F8FAFC]">
                          <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Team Member</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Details</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Status / Rating</th>
                          <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-widest text-right">Options</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {staffList.map(staff => (
                          <tr key={staff.id} className="hover:bg-muted/50 transition-colors">
                             <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                  <img src={`https://i.pravatar.cc/150?u=${staff.name.replace(/\s+/g, '')}`} className="h-10 w-10 rounded-full border border-border object-cover" alt="" />
                                  <div>
                                     <div className="text-[14px] font-bold text-[#0F172A]">{staff.name}</div>
                                     <div className={`text-[12px] font-bold ${staff.titleColor}`}>{staff.title}</div>
                                  </div>
                               </div>
                             </td>
                             <td className="px-6 py-3">
                               <div className="flex flex-col">
                                 <span className="text-[12px] text-muted-foreground font-medium">{staff.specialties}</span>
                                 <span className="text-[11px] font-bold text-muted-foreground mt-0.5">{staff.week} jobs this week</span>
                               </div>
                             </td>
                             <td className="px-6 py-3">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-[11px] font-bold bg-white mb-1`}>
                                  <span className={`h-2 w-2 rounded-full ${staff.statusColor.replace('text', 'bg')}`} />
                                  {staff.status}
                                </span>
                                <div className="text-[12px] font-bold text-muted-foreground flex items-center gap-1">
                                  <Star className="h-3.5 w-3.5 text-[#F59E0B] fill-[#F59E0B]" /> {staff.rating.toFixed(1)}
                                </div>
                             </td>
                             <td className="px-6 py-3 text-right">
                                <button onClick={() => handleAssignRepairClick(staff)} className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-[12px] font-bold text-white shadow-sm hover:bg-[#4338CA] focus:outline-none inline-flex mr-2">
                                  Assign
                                </button>
                                <button onClick={() => handleRemoveStaff(staff.id)} className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-red-600 hover:border-red-200 hover:bg-red-50 focus:outline-none inline-flex">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-24 bg-white border border-border rounded-xl shadow-sm mb-8 flex-1">
                 <CalendarIcon className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                 <h3 className="text-[16px] font-black text-[#0F172A] mb-1">Shift Calendar Simulation</h3>
                 <p className="text-[13px] text-muted-foreground">Calendar grid mounts here parsing shift assignments.</p>
                 <button onClick={() => setViewMode("grid")} className="mt-4 px-4 py-2 bg-[#4F46E5] text-[13px] font-bold rounded-lg text-white shadow-sm focus:outline-none">Return to Grid</button>
              </div>
            )}

            {/* Bottom Pagination Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-border mt-auto w-full">
              <span className="text-[13px] text-muted-foreground font-medium">
                Showing <span className="font-bold text-[#0F172A]">1-{staffList.length}</span> of <span className="font-bold text-[#0F172A]">{staffList.length}</span> team members
              </span>

              <div className="flex items-center gap-2">
                <button disabled className="flex items-center justify-center h-8 px-3 rounded text-[13px] font-semibold text-muted-foreground/50 border border-transparent hover:bg-muted/50 focus:outline-none">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </button>
                
                <div className="flex items-center gap-1">
                  <button className="h-8 w-8 rounded bg-[#4F46E5] text-white text-[13px] font-bold shadow-sm flex items-center justify-center focus:outline-none">1</button>
                  <button className="h-8 w-8 rounded text-[#0F172A] text-[13px] font-semibold hover:bg-muted flex items-center justify-center transition-colors focus:outline-none">2</button>
                </div>

                <button className="flex items-center justify-center h-8 px-3 rounded text-[13px] font-semibold text-[#0F172A] hover:bg-muted transition-colors focus:outline-none">
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground font-medium hidden md:flex">
                 Show: 
                 <div className="relative">
                   <select className="appearance-none h-8 pl-3 pr-8 rounded border border-border bg-white text-[#0F172A] font-bold focus:outline-none focus:ring-1 focus:ring-[#4F46E5]">
                     <option>8</option>
                     <option>16</option>
                     <option>24</option>
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

      {/* 1. Add Staff Member Modal */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
           <div className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
                <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-[#4F46E5]" /> Add Staff Member
                </h2>
                <button onClick={() => setIsAddStaffModalOpen(false)} className="h-8 w-8 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#0F172A] transition-colors focus:outline-none shadow-sm">
                   <X className="h-4 w-4" />
                   <span className="sr-only">Close</span>
                </button>
              </div>
              <div className="p-6">
                 <div className="grid grid-cols-2 gap-5 mb-5">
                   <div>
                     <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">First Name</label>
                     <input type="text" placeholder="John" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                   </div>
                   <div>
                     <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Last Name</label>
                     <input type="text" placeholder="Doe" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                   </div>
                 </div>
                 
                 <div className="mb-5">
                   <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Email Address</label>
                   <input type="email" placeholder="john.doe@example.com" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                 </div>

                 <div className="grid grid-cols-2 gap-5 mb-6">
                   <div>
                     <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Role</label>
                     <select className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] appearance-none bg-white">
                       <option>Senior Technician</option>
                       <option>Junior Technician</option>
                       <option>Manager</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Branch</label>
                     <select className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] appearance-none bg-white">
                       <option>Main Branch</option>
                       <option>City Center</option>
                     </select>
                   </div>
                 </div>

                 <div className="mb-8">
                   <label className="block text-[12px] font-bold text-[#0F172A] mb-3">Specialties</label>
                   <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground cursor-pointer group">
                        <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border text-[#4F46E5] focus:ring-[#4F46E5]" />
                        <span className="group-hover:text-[#0F172A] transition-colors">Mobile Phones</span>
                      </label>
                      <label className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground cursor-pointer group">
                        <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border text-[#4F46E5] focus:ring-[#4F46E5]" />
                        <span className="group-hover:text-[#0F172A] transition-colors">Tablets & iPads</span>
                      </label>
                      <label className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground cursor-pointer group">
                        <input type="checkbox" className="h-4 w-4 rounded border-border text-[#4F46E5] focus:ring-[#4F46E5]" />
                        <span className="group-hover:text-[#0F172A] transition-colors">Laptops & PCs</span>
                      </label>
                      <label className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground cursor-pointer group">
                        <input type="checkbox" className="h-4 w-4 rounded border-border text-[#4F46E5] focus:ring-[#4F46E5]" />
                        <span className="group-hover:text-[#0F172A] transition-colors">Gaming Consoles</span>
                      </label>
                   </div>
                 </div>

                 <div className="flex w-full gap-3 pt-4 border-t border-border">
                    <button onClick={() => setIsAddStaffModalOpen(false)} className="flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted transition-colors focus:outline-none">
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setIsAddStaffModalOpen(false)
                        alert("Staff Member Added Successfully!")
                      }} 
                      className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none"
                    >
                      Save Staff Member
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 2. Manage Roles Modal */}
      {isManageRolesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
           <div className="bg-white w-full max-w-[600px] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
                <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#4F46E5]" /> Manage Staff Roles
                </h2>
                <button onClick={() => setIsManageRolesModalOpen(false)} className="text-[12px] font-bold text-muted-foreground hover:text-[#0F172A] transition-colors focus:outline-none">
                   <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-0">
                 {/* Roles list structure */}
                 <div className="divide-y divide-border">
                    {[
                      { role: "Super Admin", color: "text-[#E11D48]", bg: "bg-rose-50", desc: "Full system access including billing and branches." },
                      { role: "Senior Technician", color: "text-[#4F46E5]", bg: "bg-indigo-50", desc: "Can manage and reassign all repair tasks." },
                      { role: "Junior Technician", color: "text-[#059669]", bg: "bg-emerald-50", desc: "Can view assigned tasks and log time." }
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

      {/* 3. Assign Repair Modal */}
      {isAssignRepairModalOpen && selectedStaffForAssign && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
           <div className="bg-white w-[420px] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center bg-[#F8FAFC] p-6 border-b border-border">
                 <img 
                   src={`https://i.pravatar.cc/150?u=${selectedStaffForAssign.name.replace(/\s+/g, '')}`} 
                   className="h-16 w-16 rounded-full border-2 border-white shadow-sm mb-3 object-cover" 
                   alt={selectedStaffForAssign.name} 
                 />
                 <h2 className="text-[16px] font-black text-[#0F172A]">{selectedStaffForAssign.name}</h2>
                 <p className={`text-[12px] font-bold ${selectedStaffForAssign.titleColor} mt-0.5`}>{selectedStaffForAssign.title}</p>
              </div>
              
              <div className="p-6 pb-8">
                 <label className="block text-[13px] font-bold text-foreground mb-2">Select Unassigned Repair Task</label>
                 <div className="relative mb-8">
                   <select className="w-full h-11 rounded-xl border border-border bg-white px-4 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] appearance-none shadow-sm">
                     <option>Screen Replacement (iPhone 14 Pro) - High Priority</option>
                     <option>Battery Swelling (iPad Air) - Normal</option>
                     <option>Motherboard Diagnosis (Samsung S23) - Urgent</option>
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                 </div>
                 
                 <div className="flex w-full gap-3">
                    <button 
                      onClick={() => setIsAssignRepairModalOpen(false)} 
                      className="flex-1 h-10 rounded-lg border border-border text-foreground font-bold text-[13px] hover:bg-muted transition-colors focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setIsAssignRepairModalOpen(false)
                        alert(`Task actively assigned to ${selectedStaffForAssign.name}!`)
                      }} 
                      className="flex-1 h-10 rounded-lg bg-[#4F46E5] text-white font-bold text-[13px] hover:bg-[#4338CA] shadow-sm transition-colors focus:outline-none"
                    >
                      Assign Task
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  )
}
