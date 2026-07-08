"use client"

import { useState, useMemo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import "@/app/globals.css"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import { RepairsHeader } from "@/components/admin/repairs/repairs-header"
import { RepairsFilterSidebar, RepairFilters, DateRangePreset } from "@/components/admin/repairs/repairs-filters-sidebar"
import { RepairsTable, RepairRow, RepairStatus } from "@/components/admin/repairs/repairs-table"
import { StatusUpdateModal } from "@/components/admin/repairs/status-update-modal"
import { DeleteTaskModal } from "@/components/admin/repairs/delete-task-modal"
import { DateRangePicker, DateRange, makeRange } from "@/components/admin/shared/date-range-picker"

import { useGetRepairsQuery, useUpdateRepairStatusMutation, useDeleteRepairMutation } from "@/services/api/repairsApiSlice"
import { useGetStaffListQuery } from "@/services/api/staffApiSlice"
import { toast } from "sonner"

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

const colors = ["bg-[#4F46E5]", "bg-[#F59E0B]", "bg-[#10B981]", "bg-[#6366F1]", "bg-[#EF4444]"];

import { ChevronRight } from "lucide-react"

export default function RepairsPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: response, isLoading } = useGetRepairsQuery({});
  const { data: staffResponse } = useGetStaffListQuery({});
  const [updateRepairStatus] = useUpdateRepairStatusMutation();
  const [deleteRepair] = useDeleteRepairMutation();

  const apiRepairs = response?.data || [];
  const technicians = staffResponse?.staff || [];

  const mappedRepairs = useMemo(() => {
    return apiRepairs.map((r: any, index: number) => {
      let displayStatus: RepairStatus = "Pending";
      if (r.status === "IN_PROGRESS") displayStatus = "In Progress";
      if (r.status === "COMPLETED") displayStatus = "Completed";
      if (r.status === "PENDING") displayStatus = "Pending";
      if (r.status === "READY_TO_TAKE") displayStatus = "Ready";
      if (r.status === "DELIVERED") displayStatus = "Completed";
      if (r.status === "PAID") displayStatus = "Paid";

      let tech = null;
      if (r.technician) {
        const name = r.technician.fullName || r.technician.email?.split('@')[0] || r.technician.phone || "Technician";
        tech = {
          id: r.technician.id,
          name,
          initials: name.substring(0, 2).toUpperCase(),
          bg: colors[index % colors.length]
        };
      }

      return {
        id: r.id,
        reference: r.reference || `#REP-${r.id.substring(0, 6).toUpperCase()}`,
        customer: {
          name: r.customer?.name || "Unknown",
          phone: r.customer?.phone || "No Phone"
        },
        device: {
          type: r.device?.type || "phone",
          name: r.device ? `${r.device.brand} ${r.device.model}`.trim() : "Unknown Device",
          specs: r.device?.serialNo || r.device?.imei || r.device?.specs || ""
        },
        issue: r.issueDescription || r.issue || "No issue provided",
        status: displayStatus,
        priority: r.priority
          ? (r.priority.toLowerCase() === 'urgent' ? 'Urgent' : r.priority.toLowerCase() === 'high' ? 'High' : r.priority.toLowerCase() === 'low' ? 'Low' : 'Medium')
          : "Medium",
        technician: tech,
        amount: (() => {
          const cost = displayStatus === 'Completed' ? (r.finalCost || r.estimatedCost || 0) : (r.estimatedCost || 0);
          const adv = r.advancePayment || 0;
          return adv > 0 ? `Rs. ${cost.toLocaleString()} (Adv: Rs. ${adv.toLocaleString()})` : `Rs. ${cost.toLocaleString()}`;
        })(),
        dueDate: {
          text: r.estimatedCompletionDate
            ? new Date(r.estimatedCompletionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : new Date(new Date(r.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          isOverdue: r.estimatedCompletionDate ? new Date(r.estimatedCompletionDate) < new Date() : false
        },
        createdAt: new Date(r.createdAt).toISOString().slice(0, 10)
      }
    });
  }, [apiRepairs]);

  const [repairs, setRepairs] = useState<RepairRow[]>([])

  useEffect(() => {
    if (mappedRepairs.length > 0) {
      setRepairs(mappedRepairs)
    }
  }, [mappedRepairs])

  const techOptions = useMemo(() => {
    return technicians.map((t: any, index: number) => {
      const name = t.fullName || t.name || t.email?.split('@')[0] || t.phone || "Technician";
      const initials = (t.fullName || t.name || t.email || t.phone || "Tech").substring(0, 2).toUpperCase();
      return {
        id: t.id,
        name,
        initials,
        bg: colors[index % colors.length]
      };
    });
  }, [technicians]);

  function getWeekStart(): Date {
    const d = new Date(); d.setDate(d.getDate() - d.getDay()); d.setHours(0, 0, 0, 0); return d
  }
  function getMonthStart(): Date {
    const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d
  }

  function matchesDateRange(createdAt: string | undefined, dateRange: DateRangePreset, from: string, to: string): boolean {
    if (!dateRange || !createdAt) return true
    const repairDate = new Date(createdAt); repairDate.setHours(0, 0, 0, 0)
    const now = new Date(); now.setHours(0, 0, 0, 0)
    if (dateRange === "today") return repairDate.getTime() === now.getTime()
    if (dateRange === "this-week") return repairDate >= getWeekStart() && repairDate <= now
    if (dateRange === "this-month") return repairDate >= getMonthStart() && repairDate <= now
    if (dateRange === "last-30") { const c = new Date(now); c.setDate(c.getDate() - 30); return repairDate >= c && repairDate <= now }
    if (dateRange === "custom") {
      const f = from ? new Date(from) : null; if (f) f.setHours(0, 0, 0, 0)
      const t = to ? new Date(to) : null; if (t) t.setHours(23, 59, 59, 999)
      if (f && repairDate < f) return false
      if (t && repairDate > t) return false
      return true
    }
    return true
  }

  // UI state
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [activeTab, setActiveTab] = useState("all")
  const [globalDateRange, setGlobalDateRange] = useState<DateRange>(makeRange(30))


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
  const handleConfirmStatusChange = async (autoUpdateCustomer: boolean, newStatus: RepairStatus) => {
    if (pendingStatusUpdate) {
      const backendStatusMap: Record<string, string> = {
        "Pending": "NOT_STARTED",
        "In Progress": "IN_PROGRESS",
        "Completed": "DELIVERED",
        "Ready": "READY_TO_TAKE",
        "Paid": "PAID",
        "Delivered": "DELIVERED",
        "On Hold": "NOT_STARTED"
      };

      try {
        await updateRepairStatus({
          id: pendingStatusUpdate.repairId,
          status: backendStatusMap[newStatus] || "NOT_STARTED",
          autoUpdateCustomer // true or false from the modal checkbox
        }).unwrap();

        // Local state update for immediate feedback
        setRepairs(cur => cur.map(r => r.id === pendingStatusUpdate.repairId ? { ...r, status: newStatus } : r))
        toast.success(`Status updated to ${newStatus}`);
      } catch (err: any) {
        console.error("Failed to update status:", err);
        toast.error(err.data?.message || err.message || "Failed to update status. Please try again.");
      }
    }
    setIsStatusModalOpen(false); setPendingStatusUpdate(null)
  }
  const handleTechnicianChange = async (repairId: string, tech: any) => {
    try {
      await updateRepairStatus({
        id: repairId,
        technicianId: tech?.id || null
      }).unwrap();

      setRepairs(cur => cur.map(r => r.id === repairId ? { ...r, technician: tech } : r))
    } catch (err) {
      console.error("Failed to update technician:", err);
    }
  }
  const handleDeleteRequest = (id: string, ref: string) => {
    setTaskToDelete({ id, ref }); setIsDeleteModalOpen(true)
  }
  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteRepair(taskToDelete.id).unwrap();
        setRepairs(cur => cur.filter(r => r.id !== taskToDelete.id))
      } catch (err) {
        console.error("Failed to delete repair:", err);
      }
    }
    setIsDeleteModalOpen(false); setTaskToDelete(null)
  }

  // Full filter pipeline (without pagination slice)
  const { allFiltered, isActive } = useMemo(() => {
    let result = repairs

    // Apply global date range first
    if (globalDateRange) {
      result = result.filter(r => {
        if (!r.createdAt) return true;
        const repairDate = new Date(r.createdAt);
        return repairDate >= globalDateRange.from && repairDate <= globalDateRange.to;
      });
    }

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
    if (activeFilters.statuses.length) result = result.filter(r => activeFilters.statuses.includes(r.status))
    if (activeFilters.priorities.length) result = result.filter(r => activeFilters.priorities.includes(r.priority))
    if (activeFilters.deviceTypes.length) result = result.filter(r => activeFilters.deviceTypes.includes(r.device.type))
    if (activeFilters.technicians.length) result = result.filter(r => r.technician && activeFilters.technicians.includes(r.technician.name))
    if (activeFilters.dateRange) result = result.filter(r => matchesDateRange(r.createdAt, activeFilters.dateRange, activeFilters.customDateFrom, activeFilters.customDateTo))

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
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold">
                <Link href="/admin/dashboard" className="hover:text-foreground transition-colors cursor-pointer text-[#4F46E5]">{mounted ? t('dashboard.title', 'Dashboard') : 'Dashboard'}</Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                <span className="text-foreground">{mounted ? t('repairsPage.title', 'Repairs Management') : 'Repairs Management'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <h1 className="text-[28px] font-black text-foreground tracking-tight leading-none">{mounted ? t('repairsPage.title', 'Repairs Management') : 'Repairs Management'}</h1>
                <DateRangePicker defaultDays={30} onChange={setGlobalDateRange} />
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 lg:px-8 pb-6 pt-0 m-0 flex flex-col">
            <div className="flex flex-col bg-card rounded-xl border border-border shadow-sm mb-6 min-h-[600px] overflow-hidden overflow-x-auto">
              <RepairsHeader
                filteredRepairs={allFiltered}
                hasActiveFilters={isActive}
                onClearFilters={clearAllFilters}
                totalRepairs={repairs.length}
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
                    allRepairs={repairs}
                    rawRepairs={apiRepairs}
                    technicians={techOptions}
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

          <div className="mt-auto"><DashboardFooter /></div>
        </main>

        <StatusUpdateModal isOpen={isStatusModalOpen} onClose={() => { setIsStatusModalOpen(false); setPendingStatusUpdate(null) }} onConfirm={handleConfirmStatusChange} pendingStatus={pendingStatusUpdate?.newStatus || null} />
        <DeleteTaskModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setTaskToDelete(null) }} onConfirm={handleConfirmDelete} taskRef={taskToDelete?.ref || ""} />
      </div>
    </div>
  )
}
