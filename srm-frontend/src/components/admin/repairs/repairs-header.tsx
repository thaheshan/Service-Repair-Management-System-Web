import { Filter, Download, Plus, Calendar, Search, List, LayoutGrid, FileText, Table } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/ui-admin-dashboard/dropdown-menu"

interface RepairsHeaderProps {
  totalRepairs: number
  showFilters: boolean
  onToggleFilters: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode: "list" | "grid"
  onChangeViewMode: (mode: "list" | "grid") => void
}

export function RepairsHeader({
  totalRepairs,
  showFilters,
  onToggleFilters,
  searchQuery,
  onSearchChange,
  viewMode,
  onChangeViewMode
}: RepairsHeaderProps) {
  return (
    <div className="flex flex-col gap-6 px-6 py-6 border-transparent bg-card">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-[#4F46E5]">{totalRepairs} Repairs</span>
          <button 
            onClick={onToggleFilters}
            className={`flex h-9 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors ${showFilters ? 'bg-muted border-transparent' : 'bg-card border-border hover:bg-muted'}`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-muted focus:outline-none">
                <Download className="h-4 w-4" />
                <span className="flex items-center gap-1">
                  Export <span className="text-[10px] ml-1">▼</span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] z-50">
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Export as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                <Table className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Export as CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/admin/schedule" className="flex h-9 items-center gap-2 rounded-lg border border-[#4F46E5] bg-[#EEF2FF] px-4 text-sm font-semibold text-[#4F46E5] hover:bg-[#E0E7FF] transition-colors focus:outline-none shadow-sm">
            <Calendar className="h-4 w-4" />
            View Schedule
          </Link>

          <Link href="/admin/repairs/new" className="flex h-9 items-center gap-2 rounded-lg bg-[#4F46E5] px-4 text-sm font-semibold text-white hover:bg-[#4338CA] focus:outline-none shadow-md transition-colors">
            <Plus className="h-4 w-4" />
            New Repair
          </Link>
        </div>
      </div>

      {/* Search and View Toggles Bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-[320px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by customer, device, IMEI..."
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] shadow-sm transition-all"
          />
        </div>

        <div className="flex items-center rounded-lg border border-border p-1 bg-card shadow-sm">
          <button 
            onClick={() => onChangeViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-[#4F46E5] text-white" : "text-muted-foreground hover:bg-muted"} focus:outline-none`}
          >
            <List className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onChangeViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-[#4F46E5] text-white" : "text-muted-foreground hover:bg-muted"} focus:outline-none`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
