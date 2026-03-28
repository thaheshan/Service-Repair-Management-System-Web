"use client"

import { useState } from "react"
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

type RepairStatus = "In Progress" | "Completed" | "Pending"

interface Repair {
  name: string
  device: string
  status: RepairStatus
  amount: string
  avatar: string
}

const statusStyles: Record<RepairStatus, string> = {
  "In Progress": "bg-[#DBEAFE] text-[#1E40AF]",
  Completed: "bg-[#D1FAE5] text-[#065F46]",
  Pending: "bg-[#FEF3C7] text-[#92400E]",
}

const statusDot: Record<RepairStatus, string> = {
  "In Progress": "bg-[#1E40AF]",
  Completed: "bg-[#065F46]",
  Pending: "bg-[#92400E]",
}

const statusOptions: RepairStatus[] = ["In Progress", "Completed", "Pending"]

const initialRepairs: Repair[] = [
  {
    name: "John Smith",
    device: "iPhone 13 - Screen Replacement",
    status: "In Progress",
    amount: "Rs. 2,500",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80",
  },
  {
    name: "Sarah Johnson",
    device: "Samsung S21 - Battery Issue",
    status: "Completed",
    amount: "Rs. 1,800",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
  },
  {
    name: "Mike Davis",
    device: "iPad Pro - Water Damage",
    status: "Pending",
    amount: "Rs. 4,200",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&q=80",
  },
  {
    name: "Emily Wilson",
    device: "MacBook Air - Keyboard Fix",
    status: "In Progress",
    amount: "Rs. 3,500",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
  },
  {
    name: "Robert Brown",
    device: "OnePlus 9 - Charging Port",
    status: "Completed",
    amount: "Rs. 1,200",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
  },
]

export function RecentRepairs() {
  const [repairs, setRepairs] = useState<Repair[]>(initialRepairs)
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

  const handleConfirm = (autoUpdateCustomer: boolean, newStatus: string) => {
    if (confirmDialog.repairIndex !== null && confirmDialog.targetStatus) {
      applyStatusChange(confirmDialog.repairIndex, confirmDialog.targetStatus)
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
          <h3 className="text-base font-semibold text-foreground">Recent Repairs</h3>
          <Link href="/admin/repairs" className="text-sm font-medium text-primary hover:underline">View All</Link>
        </div>

        {/* Repair List */}
        <div className="flex flex-col">
          {repairs.map((repair, index) => (
            <div
              key={repair.name}
              className={`flex items-center justify-between px-5 py-3 ${
                index !== repairs.length - 1 ? "border-b border-border" : ""
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
                      {repair.status}
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
                        {status}
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
