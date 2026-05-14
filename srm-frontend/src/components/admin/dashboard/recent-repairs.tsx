"use client"

import { useState, useEffect } from "react"
import { ChevronDown, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/ui-admin-dashboard/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/ui-admin-dashboard/dropdown-menu"
import { StatusUpdateModal } from "@/components/admin/repairs/status-update-modal"
import { useGetDashboardAnalyticsQuery } from "@/services/api/dashboardApiSlice"
import { useUpdateRepairStatusMutation } from "@/services/api/repairsApiSlice"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

type RepairStatus = "In Progress" | "Completed" | "Pending" | "Ready" | "Paid"

interface Repair {
  id: string
  name: string
  device: string
  status: RepairStatus
  amount: string
  avatar: string
}

import { useTranslation } from "react-i18next"
const statusStyles: Record<RepairStatus, string> = {
  "In Progress": "bg-[#DBEAFE] text-[#1E40AF]",
  Completed: "bg-[#D1FAE5] text-[#065F46]",
  Pending: "bg-[#FEF3C7] text-[#92400E]",
  Ready: "bg-green-100 text-green-700",
  Paid: "bg-emerald-100 text-emerald-800",
}

const statusDot: Record<RepairStatus, string> = {
  "In Progress": "bg-[#1E40AF]",
  Completed: "bg-[#065F46]",
  Pending: "bg-[#92400E]",
  Ready: "bg-green-600",
  Paid: "bg-emerald-700",
}

const statusOptions: RepairStatus[] = ["Pending", "In Progress", "Ready", "Completed", "Paid"]

const initialRepairs: Repair[] = []

export function RecentRepairs() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const user = useSelector((state: RootState) => state.auth.user);
  const { data: response, isLoading } = useGetDashboardAnalyticsQuery({});
  const apiRepairs = response?.data?.recentRepairs || [];

  // Map backend data to frontend format
  const mappedRepairs = apiRepairs
    .filter((r: any) => {
      if (user?.role === 'TECHNICIAN') {
        // Show only unassigned repairs OR repairs assigned to the logged-in technician
        return !r.technicianId || r.technicianId === user.id;
      }
      return true; // Admin sees everything
    })
    .map((r: any) => {
      let displayStatus: RepairStatus = "Pending";
      if (r.status === "IN_PROGRESS") displayStatus = "In Progress";
      if (r.status === "COMPLETED" || r.status === "DELIVERED") displayStatus = "Completed";
      if (r.status === "READY_TO_TAKE") displayStatus = "Ready";
      if (r.status === "PAID") displayStatus = "Paid";

      return {
        id: r.id,
        name: r.customerName,
        device: r.device,
        status: displayStatus,
        amount: `LKR ${r.amount || 0}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customerName)}&background=random`,
      };
    });

  const [repairs, setRepairs] = useState<Repair[]>(initialRepairs)
  const [updateRepairStatus] = useUpdateRepairStatusMutation();

  useEffect(() => {
    if (mappedRepairs.length > 0) {
      setRepairs(mappedRepairs);
    }
  }, [apiRepairs.length]);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    repairIndex: number | null
    fromStatus: RepairStatus | null
    targetStatus: RepairStatus | null
    repairName: string
    repairDevice: string
  }>({
    open: false,
    repairIndex: null,
    fromStatus: null,
    targetStatus: null,
    repairName: "",
    repairDevice: "",
  })

  const handleStatusChange = (index: number, newStatus: RepairStatus) => {
    const repair = repairs[index]

    // Skip if selecting the same status
    if (repair.status === newStatus) return

    // Always show confirmation dialog for any status change
    setConfirmDialog({
      open: true,
      repairIndex: index,
      fromStatus: repair.status,
      targetStatus: newStatus,
      repairName: repair.name,
      repairDevice: repair.device,
    })
  }

  const applyStatusChange = (index: number, newStatus: RepairStatus) => {
    setRepairs((prev) =>
      prev.map((repair, i) =>
        i === index ? { ...repair, status: newStatus } : repair
      )
    )
  }

  const handleConfirm = async (autoUpdateCustomer: boolean, newStatus: string) => {
    if (confirmDialog.repairIndex !== null && confirmDialog.targetStatus) {
      const repairId = repairs[confirmDialog.repairIndex].id;

      const backendStatusMap: Record<string, string> = {
        "Pending": "NOT_STARTED",
        "In Progress": "IN_PROGRESS",
        "Completed": "DELIVERED",
        "Ready": "READY_TO_TAKE",
        "Paid": "PAID"
      };

      try {
        await updateRepairStatus({
          id: repairId,
          status: backendStatusMap[confirmDialog.targetStatus] || "NOT_STARTED"
        }).unwrap();

        applyStatusChange(confirmDialog.repairIndex, confirmDialog.targetStatus)
        toast.success(`Status updated to ${confirmDialog.targetStatus}`);
      } catch (err: any) {
        console.error("Failed to update status:", err);
        toast.error(err.data?.message || err.message || "Failed to update status");
      }
    }
    setConfirmDialog({
      open: false,
      repairIndex: null,
      fromStatus: null,
      targetStatus: null,
      repairName: "",
      repairDevice: "",
    })
  }

  const handleCancel = () => {
    setConfirmDialog({
      open: false,
      repairIndex: null,
      fromStatus: null,
      targetStatus: null,
      repairName: "",
      repairDevice: "",
    })
  }

  return (
    <>
      <div className="flex flex-col h-full rounded-xl border border-border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <h3 className="text-base font-semibold text-foreground">{mounted ? t('dashboard.recentRepairs') : 'Recent Repairs'}</h3>
          <Link href="/admin/repairs" className="text-sm font-medium text-primary hover:underline">{mounted ? t('common.viewAll') : 'View All'}</Link>
        </div>

        {/* Repair List */}
        <div className="flex flex-col">
          {repairs.map((repair, index) => (
            <div
              key={repair.id}
              className={`flex items-center justify-between px-5 py-3 ${index !== repairs.length - 1 ? "border-b border-border" : ""
                }`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={repair.avatar}
                    alt={repair.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                    {repair.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{repair.name}</span>
                  <span className="text-xs text-muted-foreground">{repair.device}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                {/* Status Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-primary ${statusStyles[repair.status]}`}
                    >
                      {mounted ? t(`dashboard.status.${repair.status.toLowerCase().replace(/\s+/g, '')}`) : repair.status}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    {statusOptions.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        className="cursor-pointer"
                        onSelect={() => handleStatusChange(index, status)}
                      >
                        <span
                          className={`mr-2 inline-block h-2 w-2 rounded-full ${statusDot[status]}`}
                        />
                        {mounted ? t(`dashboard.status.${status.toLowerCase().replace(/\s+/g, '')}`) : status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <span className="text-sm font-bold text-foreground">{repair.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <StatusUpdateModal
        isOpen={confirmDialog.open}
        onClose={handleCancel}
        onConfirm={handleConfirm as any}
        pendingStatus={confirmDialog.targetStatus as any}
      />
    </>
  )
}
