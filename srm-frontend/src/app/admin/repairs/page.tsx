"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import "@/app/globals.css"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import { RepairsHeader } from "@/components/admin/repairs/repairs-header"
import { RepairsFilterSidebar, RepairFilters, DateRangePreset } from "@/components/admin/repairs/repairs-filters-sidebar"
import { RepairsTable, RepairRow, RepairStatus, PriorityLevel } from "@/components/admin/repairs/repairs-table"
import { StatusUpdateModal } from "@/components/admin/repairs/status-update-modal"
import { DeleteTaskModal } from "@/components/admin/repairs/delete-task-modal"
import { useRepairStore } from "@/store/repairStore"
import { useAuthStore } from "@/store/authStore"
import { Spinner } from "@/components/ui/Spinner"
import { ErrorBanner } from "@/components/ui/ErrorBanner"

// Mapper to convert API Repair model to UI RepairRow format
const mapRepairToRow = (r: any): RepairRow => ({
  id: r.id,
  reference: r.reference || `#REP-${r.id.slice(0, 8).toUpperCase()}`,
  customer: r.customer || { name: "Unknown Customer", phone: "N/A" },
  device: r.device || { type: r.deviceType || "phone", name: r.deviceName || "Generic Device", specs: r.deviceSpecs || "" },
  issue: r.issueDescription || r.issue || "No issue description",
  status: (r.status.charAt(0).toUpperCase() + r.status.slice(1).replace("_", " ")) as RepairStatus,
  priority: (r.priority || "Medium") as PriorityLevel,
  technician: r.technician || null,
  amount: r.actualCost ? `Rs. ${r.actualCost}` : r.estimatedCost ? `Rs. ${r.estimatedCost}` : "N/A",
  dueDate: { 
    text: r.dueDate ? new Date(r.dueDate).toLocaleDateString() : "No deadline", 
    isOverdue: r.dueDate ? new Date(r.dueDate) < new Date() : false 
  },
  createdAt: r.createdAt
});

function getWeekStart(): Date {
  const d = new Date(); d.setDate(d.getDate() - d.getDay()); d.setHours(0,0,0,0); return d
}
function getMonthStart(): Date {
  const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d
}

function matchesDateRange(createdAt: string | undefined, dateRange: DateRangePreset, from: string, to: string): boolean {
  if (!dateRange || !createdAt) return true
  const repairDate = new Date(createdAt); repairDate.setHours(0,0,0,0)
  const now = new Date(); now.setHours(0,0,0,0)
  if (dateRange === "today")      return repairDate.getTime() === now.getTime()
  if (dateRange === "this-week")  return repairDate >= getWeekStart() && repairDate <= now
  if (dateRange === "this-month") return repairDate >= getMonthStart() && repairDate <= now
  if (dateRange === "last-30")    { const c = new Date(now); c.setDate(c.getDate()-30); return repairDate >= c && repairDate <= now }
  if (dateRange === "custom") {
    const f = from ? new Date(from) : null; if (f) f.setHours(0,0,0,0)
    const t = to   ? new Date(to)   : null; if (t) t.setHours(23,59,59,999)
    if (f && repairDate < f) return false
    if (t && repairDate > t) return false
    return true
  }
  return true
}

export default function RepairsPage() {
  const { items, isLoading, error, fetchItems, updateStatus, deleteItem } = useRepairStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  // Map API items to UI rows
  const mappedRepairs = useMemo(() => items.map(mapRepairToRow), [items])

  // UI state
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [activeTab, setActiveTab] = useState("all")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(20)

  // Filter state
  const [activeFilters, setActiveFilters] = useState<RepairFilters>({
    statuses: [], priorities: [], deviceTypes: [], technicians: [],
    dateRange: null, customDateFrom: "", customDateTo: "",
  })

  // Modal state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{ repairId: string, newStatus: RepairStatus } | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<{ id: string, ref: string } | null>(null)

  const handleStatusChangeRequest = (repairId: string, newStatus: RepairStatus) => {
    setPendingStatusUpdate({ repairId, newStatus }); setIsStatusModalOpen(true)
  }
  const handleConfirmStatusChange = async (_: boolean, newStatus: RepairStatus) => {
    if (pendingStatusUpdate) {
      try {
        await updateStatus(pendingStatusUpdate.repairId, newStatus.toLowerCase().replace(" ", "_"))
      } catch (err) {
        console.error("Failed to update status", err)
      }
    }
    setIsStatusModalOpen(false); setPendingStatusUpdate(null)
  }
  const handleTechnicianChange = (_: string, __: any) => {
    // Implement technician change store action if needed
  }
  const handleDeleteRequest = (id: string, ref: string) => {
    setTaskToDelete({ id, ref }); setIsDeleteModalOpen(true)
  }
  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteItem(taskToDelete.id)
      } catch (err) {
        console.error("Failed to delete repair", err)
      }
    }
    setIsDeleteModalOpen(false); setTaskToDelete(null)
  }

  // Full filter pipeline (without pagination slice)
  const { allFiltered, isActive } = useMemo(() => {
    let result = mappedRepairs

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r =>
        r.reference.toLowerCase().includes(q) ||
        r.customer.name.toLowerCase().includes(q) ||
        r.customer.phone.includes(q) ||
        r.device.name.toLowerCase().includes(q) ||
        r.issue.toLowerCase().includes(q)
      )
    }
    if (activeTab !== "all") {
      const tabMap: Record<string, string> = { pending: "Pending", "in-progress": "In Progress", ready: "Ready", completed: "Completed", "on-hold": "On Hold" }
      result = result.filter(r => r.status === tabMap[activeTab])
    }
    if (activeFilters.statuses.length)     result = result.filter(r => activeFilters.statuses.includes(r.status))
    if (activeFilters.priorities.length)   result = result.filter(r => activeFilters.priorities.includes(r.priority))
    if (activeFilters.deviceTypes.length)  result = result.filter(r => activeFilters.deviceTypes.includes(r.device.type))
    if (activeFilters.technicians.length)  result = result.filter(r => r.technician && activeFilters.technicians.includes(r.technician.name))
    if (activeFilters.dateRange)           result = result.filter(r => matchesDateRange(r.createdAt, activeFilters.dateRange, activeFilters.customDateFrom, activeFilters.customDateTo))

    const isActive = activeTab !== "all" || !!searchQuery.trim() ||
      activeFilters.statuses.length > 0 || activeFilters.priorities.length > 0 ||
      activeFilters.deviceTypes.length > 0 || activeFilters.technicians.length > 0 ||
      !!activeFilters.dateRange

    return { allFiltered: result, isActive }
  }, [repairs, searchQuery, activeTab, activeFilters])

  // Paginated slice
  const paginatedRepairs = useMemo(() => {
    const start = (currentPage - 1) * perPage
    return allFiltered.slice(start, start + perPage)
  }, [allFiltered, currentPage, perPage])

  const handlePageChange = (page: number) => setCurrentPage(page)
  const handlePerPageChange = (newPerPage: number) => { setPerPage(newPerPage); setCurrentPage(1) }

  const clearAllFilters = () => {
    setSearchQuery(""); setActiveTab("all"); setCurrentPage(1)
    setActiveFilters({ statuses: [], priorities: [], deviceTypes: [], technicians: [], dateRange: null, customDateFrom: "", customDateTo: "" })
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 lg:ml-[200px] ml-0 min-w-0 bg-background relative overflow-hidden h-screen">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto w-full flex flex-col custom-scrollbar">
          <div className="bg-background px-4 lg:px-8 pt-6 pb-4">
            <div className="flex items-center gap-2 text-[13px] text-muted-foreground mb-1.5 font-medium">
              <Link href="/admin/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <span>&gt;</span>
              <span className="text-foreground font-semibold">Repairs</span>
            </div>
            <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight leading-none">Repairs Management</h1>
          </div>

          <div className="flex-1 px-4 lg:px-8 pb-6 pt-0 m-0 flex flex-col">
            <div className="flex flex-col bg-card rounded-xl border border-border shadow-sm mb-6 min-h-[600px] overflow-hidden overflow-x-auto">
              <RepairsHeader
                filteredRepairs={allFiltered}
                hasActiveFilters={isActive}
                onClearFilters={clearAllFilters}
                totalRepairs={items.length}
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
                searchQuery={searchQuery}
                onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1) }}
                viewMode={viewMode}
                onChangeViewMode={setViewMode}
              />

              <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative border-t border-border mt-1 transition-all duration-300">
                {showFilters && (
                  <div className="w-full lg:w-auto lg:h-full p-4 lg:p-0 lg:pl-6 border-b lg:border-b-0 lg:border-r border-border shrink-0 animate-in slide-in-from-left-4 lg:animate-none duration-300 ease-out bg-card z-10">
                    <RepairsFilterSidebar
                      onApply={(filters) => { setActiveFilters(filters); setShowFilters(false); setCurrentPage(1) }}
                      onReset={() => { clearAllFilters(); setShowFilters(false) }}
                      onClose={() => setShowFilters(false)}
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col min-w-0 bg-muted/10 relative overflow-x-auto">
                  <RepairsTable
                    repairs={paginatedRepairs}
                    allRepairs={mappedRepairs}
                    activeTab={activeTab}
                    onTabChange={(t) => { setActiveTab(t); setCurrentPage(1) }}
                    onStatusChangeRequest={handleStatusChangeRequest}
                    onTechnicianChange={handleTechnicianChange}
                    onDeleteRequest={handleDeleteRequest}
                    viewMode={viewMode}
                    currentPage={currentPage}
                    perPage={perPage}
                    totalFiltered={allFiltered.length}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-[100]">
              <Spinner size="lg" />
            </div>
          )}

          {error && (
            <div className="px-4 lg:px-8 mb-4">
              <ErrorBanner message={error} onClose={() => useRepairStore.setState({ error: null })} />
            </div>
          )}

          <div className="mt-auto"><DashboardFooter /></div>
        </main>

        <StatusUpdateModal isOpen={isStatusModalOpen} onClose={() => { setIsStatusModalOpen(false); setPendingStatusUpdate(null) }} onConfirm={handleConfirmStatusChange} pendingStatus={pendingStatusUpdate?.newStatus || null} />
        <DeleteTaskModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setTaskToDelete(null) }} onConfirm={handleConfirmDelete} taskRef={taskToDelete?.ref || ""} />
      </div>
    </div>
  )
}
