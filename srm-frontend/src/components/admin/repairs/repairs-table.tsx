"use client"
import { Smartphone, Laptop, Tablet, AlertCircle, Calendar, Eye, Edit2, MoreVertical, ChevronDown, Check, Trash2, Clock, User, Wrench } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/ui-admin-dashboard/dropdown-menu"

export type RepairStatus = "All" | "Pending" | "In Progress" | "Ready" | "Completed" | "On Hold"
export type PriorityLevel = "Urgent" | "High" | "Medium" | "Low"

export const STATUS_OPTIONS: RepairStatus[] = ["Pending", "In Progress", "Ready", "Completed", "On Hold"]

export const TECHNICIAN_LIST = [
  { id: "1", name: "John Smith", initials: "JS", bg: "bg-[#4F46E5]" },
  { id: "2", name: "Mike Chen", initials: "MC", bg: "bg-[#F59E0B]" },
  { id: "3", name: "Tom Wilson", initials: "TW", bg: "bg-[#10B981]" },
  { id: "4", name: "Alex Kumar", initials: "AK", bg: "bg-[#6366F1]" },
  { id: "5", name: "Sarah Connor", initials: "SC", bg: "bg-[#EF4444]" }
]

export interface RepairRow {
  id: string
  reference: string
  customer: { name: string; phone: string }
  device: { type: "phone" | "tablet" | "laptop" | "console"; name: string; specs: string }
  issue: string
  status: RepairStatus
  priority: PriorityLevel
  technician: { name: string; initials: string; bg: string } | null
  amount: string
  dueDate: { text: string; isOverdue: boolean }
  createdAt?: string // ISO date string e.g. "2026-03-29"
}

interface RepairsTableProps {
  repairs: RepairRow[]
  allRepairs: RepairRow[]
  activeTab: string
  onTabChange: (tab: string) => void
  onStatusChangeRequest: (repairId: string, newStatus: RepairStatus) => void
  onTechnicianChange: (repairId: string, newTechnician: any | null) => void
  onDeleteRequest?: (repairId: string, taskRef: string) => void
  viewMode?: "list" | "grid"
  // Pagination
  currentPage: number
  perPage: number
  totalFiltered: number
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

const DeviceIcon = ({ type }: { type: string }) => {
  if (type === "tablet") return <Tablet className="h-5 w-5 text-muted-foreground stroke-[1.5]" />
  if (type === "laptop") return <Laptop className="h-5 w-5 text-muted-foreground stroke-[1.5]" />
  if (type === "console") return <div className="h-5 w-5 rounded bg-muted-foreground/20 flex items-center justify-center"><span className="text-[10px] font-bold text-muted-foreground">+-</span></div>
  return <Smartphone className="h-5 w-5 text-muted-foreground stroke-[1.5]" />
}

const DeviceIconLg = ({ type }: { type: string }) => {
  if (type === "tablet") return <Tablet className="h-6 w-6" />
  if (type === "laptop") return <Laptop className="h-6 w-6" />
  if (type === "console") return <Wrench className="h-6 w-6" />
  return <Smartphone className="h-6 w-6" />
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Pending":     { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200" },
  "In Progress": { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200" },
  "Ready":       { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200" },
  "Completed":   { bg: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-200" },
  "On Hold":     { bg: "bg-gray-100",  text: "text-gray-600",   border: "border-gray-200" },
}

const PRIORITY_COLORS: Record<string, string> = {
  "Urgent": "text-[#EF4444]",
  "High": "text-[#F59E0B]",
  "Medium": "text-[#4F46E5]",
  "Low": "text-muted-foreground",
}

const DEVICE_ACCENT: Record<string, string> = {
  phone: "bg-indigo-100 text-indigo-600",
  tablet: "bg-sky-100 text-sky-600",
  laptop: "bg-violet-100 text-violet-600",
  console: "bg-orange-100 text-orange-600",
}

// --- CARD VIEW ---
function RepairCard({
  r,
  onStatusChangeRequest,
  onTechnicianChange,
  onDeleteRequest
}: {
  r: RepairRow
  onStatusChangeRequest: (id: string, status: RepairStatus) => void
  onTechnicianChange: (id: string, tech: any) => void
  onDeleteRequest?: (id: string, ref: string) => void
}) {
  const statusStyle = STATUS_COLORS[r.status] || { bg: "bg-muted", text: "text-foreground", border: "border-border" }
  const priorityColor = PRIORITY_COLORS[r.priority] || "text-foreground"
  const deviceAccent = DEVICE_ACCENT[r.device.type] || "bg-muted text-foreground"

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Card Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${deviceAccent}`}>
            <DeviceIconLg type={r.device.type} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#4F46E5]">{r.reference}</p>
            <p className="text-[12px] font-bold text-foreground leading-tight">{r.device.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`text-[10px] font-bold px-2 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} focus:outline-none`}>
                {r.status}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[140px] z-50">
              {STATUS_OPTIONS.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => onStatusChangeRequest(r.id, status)}
                  className="cursor-pointer flex items-center justify-between"
                >
                  <span className="text-[12px] font-semibold">{status}</span>
                  {r.status === status && <Check className="h-3.5 w-3.5 text-[#4F46E5]" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors focus:outline-none">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] z-50">
              <DropdownMenuItem asChild className="cursor-pointer flex items-center gap-2">
                <Link href={`/admin/repairs/${r.id}?from=repairs`}>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">View Details</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteRequest?.(r.id, r.reference)}
                className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-sm font-semibold">Delete Task</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-4 py-3 flex flex-col gap-2.5 flex-1">
        {/* Customer */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-[9px] font-bold text-white shrink-0">
            {r.customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="text-[12px] font-bold text-foreground leading-tight">{r.customer.name}</p>
            <p className="text-[10px] text-muted-foreground">{r.customer.phone}</p>
          </div>
        </div>

        {/* Issue */}
        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">{r.issue}</p>

        {/* Priority + Amount row */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1 text-[11px] font-bold ${priorityColor}`}>
            {r.priority === "Urgent" && <AlertCircle className="h-3 w-3" />}
            <span>{r.priority}</span>
          </div>
          <span className="text-[12px] font-bold text-[#10B981]">{r.amount}</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 border-t border-border/60 bg-muted/20 flex items-center justify-between">
        {/* Technician */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground group/tech focus:outline-none">
              {r.technician ? (
                <>
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${r.technician.bg}`}>{r.technician.initials}</div>
                  <span className="group-hover/tech:text-foreground transition-colors">{r.technician.name}</span>
                </>
              ) : (
                <>
                  <div className="h-5 w-5 rounded-full border border-dashed border-muted-foreground/50 bg-muted" />
                  <span className="italic">Unassigned</span>
                </>
              )}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[180px] z-50">
            <DropdownMenuItem onClick={() => onTechnicianChange(r.id, null)} className="cursor-pointer flex items-center gap-2 italic opacity-80">
              <div className="h-5 w-5 rounded-full border border-dashed border-muted-foreground shrink-0" />
              <span className="text-[12px] font-medium text-muted-foreground">Unassigned</span>
              {!r.technician && <Check className="h-3.5 w-3.5 text-[#4F46E5] ml-auto" />}
            </DropdownMenuItem>
            <div className="h-px bg-border my-1" />
            {TECHNICIAN_LIST.map((tech) => (
              <DropdownMenuItem key={tech.id} onClick={() => onTechnicianChange(r.id, tech)} className="cursor-pointer flex items-center gap-2">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${tech.bg}`}>{tech.initials}</div>
                <span className="text-[12px] font-semibold flex-1">{tech.name}</span>
                {r.technician?.name === tech.name && <Check className="h-3.5 w-3.5 text-[#4F46E5]" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Due Date */}
        <div className={`flex items-center gap-1 text-[11px] font-semibold ${r.dueDate.isOverdue ? "text-[#EF4444]" : "text-muted-foreground"}`}>
          <Calendar className="h-3 w-3" />
          {r.dueDate.text}
        </div>
      </div>
    </div>
  )
}

export function RepairsTable({ repairs, allRepairs, activeTab, onTabChange, onStatusChangeRequest, onTechnicianChange, onDeleteRequest, viewMode = "list", currentPage, perPage, totalFiltered, onPageChange, onPerPageChange }: RepairsTableProps) {
  const tabs = [
    { id: "all", label: "All", count: allRepairs.length },
    { id: "pending", label: "Pending", count: allRepairs.filter(r => r.status === "Pending").length },
    { id: "in-progress", label: "In Progress", count: allRepairs.filter(r => r.status === "In Progress").length },
    { id: "ready", label: "Ready", count: allRepairs.filter(r => r.status === "Ready").length },
    { id: "completed", label: "Completed", count: allRepairs.filter(r => r.status === "Completed").length },
    { id: "on-hold", label: "On Hold", count: allRepairs.filter(r => r.status === "On Hold").length },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-card mt-2 border-t border-border shadow-sm">
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border px-6 overflow-x-auto hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 pb-3 pt-4 text-[13px] font-semibold transition-colors border-b-[3px] whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#4F46E5] text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {tab.label}
            {tab.id !== "all" && <span className="text-[11px] font-medium opacity-70">({tab.count})</span>}
            {tab.id === "all" && <span className="flex h-[22px] items-center rounded-full bg-[#4F46E5] px-2.5 text-[11px] font-bold text-white shadow-sm ml-0.5">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Content: List or Grid */}
      {viewMode === "grid" ? (
        <div className="flex-1 overflow-auto custom-scrollbar p-4 max-h-[calc(100vh-320px)] min-h-[300px]">
          {repairs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-12 text-muted-foreground">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Wrench className="h-7 w-7 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-semibold">No repairs found</p>
              <p className="text-xs">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {repairs.map(r => (
                <RepairCard
                  key={r.id}
                  r={r}
                  onStatusChangeRequest={onStatusChangeRequest}
                  onTechnicianChange={onTechnicianChange}
                  onDeleteRequest={onDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-auto custom-scrollbar max-h-[calc(100vh-320px)] min-h-[300px]">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-card border-b border-border text-[12px] font-bold text-muted-foreground shadow-sm">
              <tr>
                <th className="px-5 py-3 w-10"><div className="h-4 w-4 rounded-[4px] border border-border bg-transparent" /></th>
                <th className="px-3 py-3 font-bold whitespace-nowrap text-left">Reference <span className="text-[10px]">↕</span></th>
                <th className="px-3 py-3 font-bold whitespace-nowrap text-left">Customer <span className="text-[10px]">↕</span></th>
                <th className="px-3 py-3 font-bold whitespace-nowrap text-left">Device <span className="text-[10px]">↕</span></th>
                <th className="px-3 py-3 font-bold whitespace-nowrap text-left">Issue <span className="text-[10px]">↕</span></th>
                <th className="px-3 py-3 font-bold whitespace-nowrap text-center">Status <span className="text-[10px]">↕</span></th>
                <th className="px-3 py-3 font-bold whitespace-nowrap text-left">Priority <span className="text-[10px]">↕</span></th>
                <th className="px-3 py-3 font-bold whitespace-nowrap text-left">Technician <span className="text-[10px]">↕</span></th>
                <th className="px-3 py-3 font-bold whitespace-nowrap text-right">Amount <span className="text-[10px]">↕</span></th>
                <th className="px-3 py-3 font-bold whitespace-nowrap text-left">Due Date <span className="text-[10px]">↕</span></th>
                <th className="px-5 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {repairs.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                        <Wrench className="h-6 w-6 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm font-semibold">No repairs found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                repairs.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/50 transition-colors group">
                    <td className="px-5 py-3 align-middle"><div className="h-4 w-4 rounded-[4px] border border-border bg-white cursor-pointer group-hover:border-[#4F46E5]" /></td>
                    <td className="px-3 py-3 align-middle select-all">
                      <span className="text-[13px] font-bold text-[#4F46E5] cursor-pointer hover:underline">{r.reference}</span>
                    </td>
                    <td className="px-3 py-3 align-middle min-w-[140px]">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-foreground">{r.customer.name}</span>
                        <span className="text-[11px] font-medium text-muted-foreground mt-0.5">{r.customer.phone}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 align-middle min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <div className="flex shrink-0 w-8 h-8 items-center justify-center bg-muted rounded-full">
                          <DeviceIcon type={r.device.type} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-foreground line-clamp-1">{r.device.name}</span>
                          <span className="text-[10px] font-medium text-muted-foreground w-[90px] line-clamp-1 leading-tight mt-0.5">{r.device.specs}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 align-middle max-w-[180px]">
                      <span className="text-[12px] text-muted-foreground/90 font-medium leading-tight line-clamp-3">{r.issue}</span>
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-[11px] font-bold text-[#4F46E5] hover:bg-muted shadow-sm shadow-black/5 min-w-[100px] justify-between focus:outline-none">
                            {r.status}
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[140px] z-50">
                          {STATUS_OPTIONS.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => onStatusChangeRequest(r.id, status)}
                              className="cursor-pointer flex items-center justify-between"
                            >
                              <span className="text-[12px] font-semibold">{status}</span>
                              {r.status === status && <Check className="h-3.5 w-3.5 text-[#4F46E5]" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      </div>
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <div className={`flex items-center gap-1.5 font-bold text-[12px] ${PRIORITY_COLORS[r.priority] || ""}`}>
                        {r.priority === 'Urgent' && <AlertCircle className="h-3.5 w-3.5 fill-[#FEF2F2] stroke-[#EF4444]" />}
                        {r.priority}
                      </div>
                    </td>
                    <td className="px-3 py-3 align-middle min-w-[130px]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center gap-1.5 cursor-pointer hover:bg-white border border-transparent hover:border-border p-1 rounded-full w-max transition-colors focus:outline-none">
                            {r.technician ? (
                              <>
                                <div className={`h-6 w-6 rounded-full flex shrink-0 items-center justify-center text-[9px] font-bold text-white ${r.technician.bg} shadow-sm`}>
                                  {r.technician.initials}
                                </div>
                                <span className="text-[12px] font-semibold text-foreground">{r.technician.name}</span>
                              </>
                            ) : (
                              <>
                                <div className="h-6 w-6 rounded-full border border-dashed border-muted-foreground shrink-0 flex items-center justify-center bg-muted/50" />
                                <span className="text-[12px] font-semibold italic text-muted-foreground opacity-80">Unassigned</span>
                              </>
                            )}
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] z-50">
                          <DropdownMenuItem onClick={() => onTechnicianChange(r.id, null)} className="cursor-pointer flex items-center gap-2 mb-1 opacity-80 italic">
                            <div className="h-5 w-5 rounded-full border border-dashed border-muted-foreground shrink-0" />
                            <span className="text-[12px] font-medium text-muted-foreground">Unassigned</span>
                            {!r.technician && <Check className="h-3.5 w-3.5 text-[#4F46E5] ml-auto" />}
                          </DropdownMenuItem>
                          <div className="h-px bg-border my-1" />
                          {TECHNICIAN_LIST.map((tech) => (
                            <DropdownMenuItem key={tech.id} onClick={() => onTechnicianChange(r.id, tech)} className="cursor-pointer flex items-center gap-2">
                              <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${tech.bg}`}>{tech.initials}</div>
                              <span className="text-[12px] font-semibold flex-1">{tech.name}</span>
                              {r.technician?.name === tech.name && <Check className="h-3.5 w-3.5 text-[#4F46E5]" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="px-3 py-3 align-middle text-right">
                      <span className="text-[12px] font-bold text-[#10B981]">{r.amount}</span>
                    </td>
                    <td className="px-3 py-3 align-middle min-w-[140px]">
                      <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${r.dueDate.isOverdue ? 'text-[#EF4444]' : 'text-foreground'}`}>
                        <Calendar className={`h-3.5 w-3.5 ${r.dueDate.isOverdue ? 'text-[#EF4444]' : 'text-muted-foreground'}`} />
                        {r.dueDate.text}
                      </div>
                    </td>
                    <td className="px-5 py-3 align-middle">
                      <div className="flex items-center justify-end gap-2 text-muted-foreground">
                        <Link href={`/admin/repairs/${r.id}?from=repairs`} className="rounded p-1.5 hover:bg-muted hover:text-[#4F46E5] transition-colors focus:outline-none"><Eye className="h-4 w-4" /></Link>
                        <Link href={`/admin/repairs/${r.id}/edit`} className="rounded p-1.5 hover:bg-muted hover:text-foreground transition-colors focus:outline-none"><Edit2 className="h-4 w-4" /></Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="rounded p-1.5 hover:bg-muted hover:text-foreground transition-colors focus:outline-none"><MoreVertical className="h-4 w-4" /></button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px] z-50">
                            <DropdownMenuItem
                              onClick={() => onDeleteRequest?.(r.id, r.reference)}
                              className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="text-sm font-semibold">Delete Task</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex items-center gap-4 border-t border-border px-6 py-3.5 bg-card/50 text-[12px] font-medium text-muted-foreground shrink-0">
        {/* Showing count */}
        <span className="whitespace-nowrap">
          Showing{" "}
          <span className="font-bold text-foreground">
            {totalFiltered === 0 ? 0 : (currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, totalFiltered)}
          </span>{" "}
          of <span className="font-bold text-foreground">{totalFiltered}</span> repairs
        </span>

        {/* Per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px]">Per page:</span>
          <select
            value={perPage}
            onChange={(e) => { onPerPageChange(Number(e.target.value)); onPageChange(1); }}
            className="border border-border rounded-md bg-white cursor-pointer px-2 py-1 outline-none text-foreground font-semibold text-[12px] focus:border-[#4F46E5]"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Page buttons */}
        <div className="ml-auto flex items-center gap-1">
          {/* Prev */}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            &lt;
          </button>

          {/* Page numbers */}
          {(() => {
            const totalPages = Math.max(1, Math.ceil(totalFiltered / perPage))
            const pages: (number | "...")[] = []

            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) pages.push(i)
            } else {
              pages.push(1)
              if (currentPage > 3) pages.push("...")
              for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i)
              }
              if (currentPage < totalPages - 2) pages.push("...")
              pages.push(totalPages)
            }

            return pages.map((p, idx) =>
              p === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground font-bold text-[12px]">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p as number)}
                  className={`flex h-7 w-7 items-center justify-center rounded-md text-[12px] font-semibold transition-colors ${
                    currentPage === p
                      ? "bg-[#4F46E5] text-white shadow-sm"
                      : "border border-border bg-white hover:bg-muted text-foreground"
                  }`}
                >
                  {p}
                </button>
              )
            )
          })()}

          {/* Next */}
          <button
            onClick={() => onPageChange(Math.min(Math.ceil(totalFiltered / perPage), currentPage + 1))}
            disabled={currentPage >= Math.ceil(totalFiltered / perPage)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}
