"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import "@/app/globals.css"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import { RepairsHeader } from "@/components/admin/repairs/repairs-header"
import { RepairsFilterSidebar, RepairFilters } from "@/components/admin/repairs/repairs-filters-sidebar"
import { RepairsTable, RepairRow, RepairStatus } from "@/components/admin/repairs/repairs-table"
import { StatusUpdateModal } from "@/components/admin/repairs/status-update-modal"
import { DeleteTaskModal } from "@/components/admin/repairs/delete-task-modal"

const initialRepairs: RepairRow[] = [
  {
    id: "1",
    reference: "#REP-2026-001234",
    customer: { name: "Ahmed Hassan", phone: "+94 77 123 4567" },
    device: { type: "phone", name: "iPhone 13 Pro", specs: "Space Gray, 256GB" },
    issue: "Screen cracked, touch unresponsive in top right",
    status: "In Progress",
    priority: "Urgent",
    technician: { name: "John Smith", initials: "JS", bg: "bg-[#4F46E5]" },
    amount: "Rs. 8,500",
    dueDate: { text: "Today", isOverdue: false }
  },
  {
    id: "2",
    reference: "#REP-2026-001233",
    customer: { name: "Sarah Perera", phone: "+94 71 987 6543" },
    device: { type: "tablet", name: "iPad Air 5th Gen", specs: "Silver, 64GB" },
    issue: "Draining quickly, won't charge properly",
    status: "In Progress",
    priority: "High",
    technician: null,
    amount: "Rs. 6,200",
    dueDate: { text: "Tomorrow", isOverdue: false }
  },
  {
    id: "3",
    reference: "#REP-2026-001232",
    customer: { name: "David Fernando", phone: "+94 76 234 5678" },
    device: { type: "laptop", name: "MacBook Pro 14\"", specs: "M1 Pro, 512GB" },
    issue: "Keyboard keys sticking, trackpad not clicking properly",
    status: "In Progress",
    priority: "Medium",
    technician: { name: "Mike Chen", initials: "MC", bg: "bg-[#F59E0B]" },
    amount: "Rs. 12,500",
    dueDate: { text: "Jan 20, 2026", isOverdue: false }
  },
  {
    id: "4",
    reference: "#REP-2026-001231",
    customer: { name: "Nisha Silva", phone: "+94 75 345 6789" },
    device: { type: "phone", name: "Samsung Galaxy S23", specs: "Phantom Black, 128GB" },
    issue: "Water damage, phone won't turn on",
    status: "In Progress",
    priority: "Low",
    technician: { name: "Tom Wilson", initials: "TW", bg: "bg-[#10B981]" },
    amount: "Rs. 15,000",
    dueDate: { text: "Overdue by 2 days", isOverdue: true }
  },
  {
    id: "5",
    reference: "#REP-2026-001230",
    customer: { name: "Raj Jayawardena", phone: "+94 72 456 7890" },
    device: { type: "console", name: "PlayStation 5", specs: "Standard Edition" },
    issue: "Disc drive not reading games, making noise",
    status: "In Progress",
    priority: "Medium",
    technician: { name: "Alex Kumar", initials: "AK", bg: "bg-[#6366F1]" },
    amount: "Rs. 9,800",
    dueDate: { text: "Jan 18, 2026", isOverdue: false }
  }
]

export default function RepairsPage() {
  // Data State
  const [repairs, setRepairs] = useState<RepairRow[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("srm_repairs_mock")
    if (saved) {
      setRepairs(JSON.parse(saved))
    } else {
      setRepairs(initialRepairs)
      localStorage.setItem("srm_repairs_mock", JSON.stringify(initialRepairs))
    }
    setIsLoaded(true)
  }, [])

  // Sync back to localStorage whenever repairs change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("srm_repairs_mock", JSON.stringify(repairs))
    }
  }, [repairs, isLoaded])
  
  // UI States
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [activeTab, setActiveTab] = useState("all")
  
  // Complex Sidebar Filters
  const [activeFilters, setActiveFilters] = useState<RepairFilters>({
    statuses: [],
    priorities: [],
    deviceTypes: [],
    technicians: []
  })

  // Modal State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{ repairId: string, newStatus: RepairStatus } | null>(null)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<{ id: string, ref: string } | null>(null)

  // Callbacks
  const handleStatusChangeRequest = (repairId: string, newStatus: RepairStatus) => {
    setPendingStatusUpdate({ repairId, newStatus })
    setIsStatusModalOpen(true)
  }

  const handleConfirmStatusChange = (autoUpdateCustomer: boolean, newStatus: RepairStatus) => {
    if (pendingStatusUpdate) {
      setRepairs(current => current.map(r => 
        r.id === pendingStatusUpdate.repairId 
          ? { ...r, status: newStatus } 
          : r
      ))
    }
    setIsStatusModalOpen(false)
    setPendingStatusUpdate(null)
  }

  const handleTechnicianChange = (repairId: string, newTechnician: any | null) => {
    setRepairs(current => current.map(r => 
      r.id === repairId 
        ? { ...r, technician: newTechnician } 
        : r
    ))
  }

  const handleDeleteRequest = (id: string, ref: string) => {
    setTaskToDelete({ id, ref })
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setRepairs(current => current.filter(r => r.id !== taskToDelete.id))
    }
    setIsDeleteModalOpen(false)
    setTaskToDelete(null)
  }

  // Derived Filter Pipeline
  const filteredRepairs = useMemo(() => {
    let result = repairs

    // 1. Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase()
      result = result.filter(r => 
        r.reference.toLowerCase().includes(q) ||
        r.customer.name.toLowerCase().includes(q) ||
        r.customer.phone.includes(q) ||
        r.device.name.toLowerCase().includes(q) ||
        r.issue.toLowerCase().includes(q)
      )
    }

    // 2. Tab Filter (Primary Status filter)
    if (activeTab !== "all") {
      const tabMap: Record<string, string> = {
        "pending": "Pending",
        "in-progress": "In Progress",
        "ready": "Ready",
        "completed": "Completed",
        "on-hold": "On Hold"
      }
      result = result.filter(r => r.status === tabMap[activeTab])
    }

    // 3. Deep Sidebar Filters
    if (activeFilters.statuses.length > 0) {
      result = result.filter(r => activeFilters.statuses.includes(r.status))
    }
    if (activeFilters.priorities.length > 0) {
      result = result.filter(r => activeFilters.priorities.includes(r.priority))
    }
    if (activeFilters.deviceTypes.length > 0) {
      result = result.filter(r => activeFilters.deviceTypes.includes(r.device.type))
    }
    if (activeFilters.technicians.length > 0) {
      result = result.filter(r => r.technician && activeFilters.technicians.includes(r.technician.name))
    }

    return result
  }, [repairs, searchQuery, activeTab, activeFilters])


  return (
    <div className="flex bg-muted text-foreground">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col ml-[200px] min-h-screen bg-background relative">
        
        {/* Top Header Background matching the mockup */}
        <div className="bg-background px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5 font-medium">
            <Link href="/admin/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <span>&gt;</span>
            <span className="text-foreground">Repairs</span>
          </div>
          <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-none">Repairs Management</h1>
        </div>

        {/* Main Card Wrapper */}
        <main className="flex-1 flex flex-col px-6 pb-6 pt-0 m-0 w-full min-h-[calc(100vh-180px)]">
          <div className="flex-1 flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[600px]">
             
            {/* Action Bar / Searching */}
            <RepairsHeader 
              totalRepairs={repairs.length} // Pass raw full array length for header summary
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
            />

            {/* Layout Split: Sidebar filters vs Table */}
            <div className="flex flex-1 overflow-hidden relative border-t border-border mt-1 transition-all duration-300">
              {/* Sliding Filters Panel */}
              {showFilters && (
                <div className="h-full pl-6 border-r border-border shrink-0 animate-in slide-in-from-left-4 duration-300 ease-out">
                  <RepairsFilterSidebar 
                    onApply={(filters) => setActiveFilters(filters)}
                    onReset={() => {
                       setSearchQuery("")
                       setActiveTab("all")
                       setActiveFilters({ statuses: [], priorities: [], deviceTypes: [], technicians: [] })
                    }}
                  />
                </div>
              )}

              {/* Table / Grid */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-muted/10 relative">
                <RepairsTable 
                  repairs={filteredRepairs}
                  allRepairs={repairs} // Passed raw dataset to table to accurately count generic sub-tabs!
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onStatusChangeRequest={handleStatusChangeRequest}
                  onTechnicianChange={handleTechnicianChange}
                  onDeleteRequest={handleDeleteRequest}
                />
              </div>
            </div>

          </div>
        </main>
        
        <DashboardFooter />

        {/* Global Modal Layer */}
        <StatusUpdateModal 
          isOpen={isStatusModalOpen}
          onClose={() => {
            setIsStatusModalOpen(false)
            setPendingStatusUpdate(null)
          }}
          onConfirm={handleConfirmStatusChange}
          pendingStatus={pendingStatusUpdate?.newStatus || null}
        />

        <DeleteTaskModal 
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setTaskToDelete(null)
          }}
          onConfirm={handleConfirmDelete}
          taskRef={taskToDelete?.ref || ""}
        />

      </div>
    </div>
  )
}
