import { Smartphone, Laptop, Tablet, AlertCircle, Calendar, Eye, Edit2, MoreVertical, ChevronDown, Check, Trash2 } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/ui-admin-dashboard/dropdown-menu"

export type RepairStatus = "All" | "Pending" | "In Progress" | "Ready" | "Completed" | "On Hold"
export type PriorityLevel = "Urgent" | "High" | "Medium" | "Low"

// Define possible statuses to loop through in dropdown
export const STATUS_OPTIONS: RepairStatus[] = ["Pending", "In Progress", "Ready", "Completed", "On Hold"]

// Pre-define some dummy technicians to select from
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
}

interface RepairsTableProps {
  repairs: RepairRow[]
  allRepairs: RepairRow[] // Added raw master array to calculate total tab counts
  activeTab: string
  onTabChange: (tab: string) => void
  onStatusChangeRequest: (repairId: string, newStatus: RepairStatus) => void
  onTechnicianChange: (repairId: string, newTechnician: any | null) => void
  onDeleteRequest?: (repairId: string, taskRef: string) => void
}

const DeviceIcon = ({ type }: { type: string }) => {
  if (type === "tablet") return <Tablet className="h-5 w-5 text-muted-foreground stroke-[1.5]" />
  if (type === "laptop") return <Laptop className="h-5 w-5 text-muted-foreground stroke-[1.5]" />
  if (type === "console") return <div className="h-5 w-5 rounded bg-muted-foreground/20 flex items-center justify-center"><span className="text-[10px] font-bold text-muted-foreground">+-</span></div>
  return <Smartphone className="h-5 w-5 text-muted-foreground stroke-[1.5]" />
}

export function RepairsTable({ repairs, allRepairs, activeTab, onTabChange, onStatusChangeRequest, onTechnicianChange, onDeleteRequest }: RepairsTableProps) {
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
      {/* Dynamic Tabs */}
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

      {/* Main Table Area */}
      <div className="flex-1 overflow-auto custom-scrollbar max-h-[calc(100vh-320px)] min-h-[300px]">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="sticky top-0 z-10 bg-card border-b border-border text-[12px] font-bold text-muted-foreground shadow-sm">
            <tr>
              <th className="px-5 py-3 w-10 font-semibold"><div className="h-4 w-4 rounded-[4px] border border-border bg-transparent" /></th>
              <th className="px-3 py-3 font-bold whitespace-nowrap">Reference <span className="text-[10px]">↕</span></th>
              <th className="px-3 py-3 font-bold whitespace-nowrap">Customer <span className="text-[10px]">↕</span></th>
              <th className="px-3 py-3 font-bold whitespace-nowrap">Device <span className="text-[10px]">↕</span></th>
              <th className="px-3 py-3 font-bold whitespace-nowrap text-left">Issue <span className="text-[10px]">↕</span></th>
              <th className="px-3 py-3 font-bold whitespace-nowrap text-left">Status <span className="text-[10px]">↕</span></th>
              <th className="px-3 py-3 font-bold whitespace-nowrap text-left">Priority <span className="text-[10px]">↕</span></th>
              <th className="px-3 py-3 font-bold whitespace-nowrap text-left">Technician <span className="text-[10px]">↕</span></th>
              <th className="px-3 py-3 font-bold whitespace-nowrap text-left">Amount <span className="text-[10px]">↕</span></th>
              <th className="px-3 py-3 font-bold whitespace-nowrap text-left">Due Date <span className="text-[10px]">↕</span></th>
              <th className="px-5 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground">
            {repairs.map((r) => (
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
                </td>
                <td className="px-3 py-3 align-middle">
                  <div className={`flex items-center gap-1.5 font-bold text-[12px]
                    ${r.priority === 'Urgent' ? 'text-[#EF4444]' : 
                      r.priority === 'High' ? 'text-[#F59E0B]' : 
                      r.priority === 'Medium' ? 'text-[#4F46E5]' : 'text-muted-foreground'}`
                  }>
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
                      <DropdownMenuItem 
                        onClick={() => onTechnicianChange(r.id, null)}
                        className="cursor-pointer flex items-center gap-2 mb-1 opacity-80 italic"
                      >
                         <div className="h-5 w-5 rounded-full border border-dashed border-muted-foreground shrink-0" />
                         <span className="text-[12px] font-medium text-muted-foreground">Unassigned</span>
                         {!r.technician && <Check className="h-3.5 w-3.5 text-[#4F46E5] ml-auto" />}
                      </DropdownMenuItem>
                      <div className="h-px bg-border my-1" />
                      {TECHNICIAN_LIST.map((tech) => (
                        <DropdownMenuItem 
                          key={tech.id} 
                          onClick={() => onTechnicianChange(r.id, tech)}
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${tech.bg}`}>
                            {tech.initials}
                          </div>
                          <span className="text-[12px] font-semibold flex-1">{tech.name}</span>
                          {r.technician?.name === tech.name && <Check className="h-3.5 w-3.5 text-[#4F46E5]" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                <td className="px-3 py-3 align-middle">
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center gap-4 border-t border-border px-6 py-4 bg-card/50 text-[12px] font-medium text-muted-foreground">
        <span>Showing 1-20 of 147 repairs</span>
        
        <div className="flex items-center gap-2">
          <select className="border border-border rounded-md bg-white cursor-pointer px-2 py-1 outline-none text-foreground font-semibold">
            <option>20 per page</option>
            <option>50 per page</option>
            <option>100 per page</option>
          </select>
        </div>
        
        <div className="ml-auto flex items-center gap-1.5">
          <button className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white text-muted-foreground hover:bg-muted">&lt;</button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md bg-[#4F46E5] text-white font-bold">1</button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white hover:bg-muted text-foreground font-semibold">2</button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white hover:bg-muted text-foreground font-semibold">3</button>
          <span className="px-1 text-muted-foreground font-bold">...</span>
          <button className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white hover:bg-muted text-foreground font-semibold">8</button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white text-foreground hover:bg-muted">&gt;</button>
        </div>
      </div>
    </div>
  )
}
