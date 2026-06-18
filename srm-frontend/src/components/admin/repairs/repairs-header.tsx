"use client"
import { Filter, Download, Plus, Calendar, Search, List, LayoutGrid, FileText, Table, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/ui-admin-dashboard/dropdown-menu"
import { RepairRow } from "./repairs-table"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

interface RepairsHeaderProps {
  filteredRepairs: RepairRow[]
  hasActiveFilters: boolean
  onClearFilters: () => void
  totalRepairs: number
  showFilters: boolean
  onToggleFilters: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode: "list" | "grid"
  onChangeViewMode: (mode: "list" | "grid") => void
}

export function RepairsHeader({
  filteredRepairs,
  hasActiveFilters,
  onClearFilters,
  totalRepairs,
  showFilters,
  onToggleFilters,
  searchQuery,
  onSearchChange,
  viewMode,
  onChangeViewMode
}: RepairsHeaderProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user)
  useEffect(() => setMounted(true), []);

  const [isExportingPDF, setIsExportingPDF] = useState(false)

  const handleExportPDF = async () => {
    setIsExportingPDF(true)
    try {
      const { jsPDF } = await import("jspdf")
      const { default: autoTable } = await import("jspdf-autotable")

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })

      // Indigo header bar
      doc.setFillColor(79, 70, 229)
      doc.rect(0, 0, 297, 18, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(13)
      doc.setFont("helvetica", "bold")
      doc.text("Repairs Report", 14, 12)
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.text(`Generated: ${new Date().toLocaleString()}`, 210, 12)
      doc.setTextColor(30, 30, 30)

      autoTable(doc, {
        startY: 22,
        head: [["Reference", "Customer", "Phone", "Device", "Issue", "Status", "Priority", "Technician", "Amount", "Due Date"]],
        body: filteredRepairs.map(r => [
          r.reference,
          r.customer.name,
          r.customer.phone,
          r.device.name,
          r.issue,
          r.status,
          r.priority,
          r.technician ? r.technician.name : "Unassigned",
          r.amount,
          r.dueDate.text,
        ]),
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 8,
        },
        bodyStyles: { fontSize: 8, cellPadding: 3 },
        alternateRowStyles: { fillColor: [245, 247, 255] },
        columnStyles: {
          0: { cellWidth: 32 },
          1: { cellWidth: 26 },
          2: { cellWidth: 26 },
          3: { cellWidth: 28 },
          4: { cellWidth: 42 },
          5: { cellWidth: 22 },
          6: { cellWidth: 18 },
          7: { cellWidth: 24 },
          8: { cellWidth: 20 },
          9: { cellWidth: 26 },
        },
      })

      doc.save(`repairs_report_${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (err) {
      console.error("PDF export failed:", err)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsExportingPDF(false)
    }
  }

  const handleExportCSV = () => {
    const headers = ['Ref', 'Customer', 'Phone', 'Device', 'Status', 'Technician', 'Amount']
    const rows = filteredRepairs.map(r => [
      r.reference,
      `"${r.customer.name}"`,
      `"${r.customer.phone}"`,
      `"${r.device.name}"`,
      r.status,
      `"${r.technician ? r.technician.name : "Unassigned"}"`,
      `"${r.amount}"`
    ])

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "repairs_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-6 px-4 md:px-6 py-6 border-transparent bg-card">
      {/* Top Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-semibold text-[#4F46E5]">{totalRepairs} {mounted ? t('common.repairs') : 'Repairs'}</span>

          {hasActiveFilters ? (
            <button
              onClick={onClearFilters}
              className="flex h-9 items-center gap-2 rounded-lg border px-4 text-sm font-bold transition-colors bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300 shadow-sm focus:outline-none"
            >
              <X className="h-4 w-4" />
              {mounted ? t('common.clear') : 'Clear Filter'}
            </button>
          ) : (
            <button
              onClick={onToggleFilters}
              className={`flex h-9 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors focus:outline-none ${showFilters ? 'bg-muted border-transparent shadow-inner' : 'bg-card border-border hover:bg-muted shadow-sm'}`}
            >
              <Filter className="h-4 w-4" />
              {mounted ? t('common.filter') : 'Filters'}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user?.role !== 'TECHNICIAN' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-muted focus:outline-none shadow-sm">
                  <Download className="h-4 w-4" />
                  <span className="flex items-center gap-1">
                    Export <span className="text-[10px] ml-1">▼</span>
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[170px] z-50">
                <DropdownMenuItem
                  onClick={handleExportPDF}
                  disabled={isExportingPDF}
                  className="cursor-pointer flex items-center gap-2"
                >
                  {isExportingPDF ? (
                    <Loader2 className="h-4 w-4 text-[#4F46E5] animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">{isExportingPDF ? (mounted ? t('common.loading') : "Generating...") : "Export as PDF"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer flex items-center gap-2">
                  <Table className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Export as CSV</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Link href="/admin/schedule" className="flex h-9 items-center gap-2 rounded-lg border border-[#4F46E5] bg-[#EEF2FF] px-4 text-sm font-semibold text-[#4F46E5] hover:bg-[#E0E7FF] transition-colors focus:outline-none shadow-sm">
            <Calendar className="h-4 w-4" />
            {mounted ? t('schedule.viewSchedule') : 'View Schedule'}
          </Link>

          <Link href="/admin/repairs/new" className="flex h-9 items-center gap-2 rounded-lg bg-[#4F46E5] px-4 text-sm font-semibold text-white hover:bg-[#4338CA] focus:outline-none shadow-md transition-colors">
            <Plus className="h-4 w-4" />
            {mounted ? t('repairs.createNew', 'New Repair') : 'New Repair'}
          </Link>
        </div>
      </div>

      {/* Search and View Toggles Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-full sm:max-w-[320px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={mounted ? t('common.search') : "Search by customer, device, IMEI..."}
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
