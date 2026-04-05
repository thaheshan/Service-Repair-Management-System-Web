"use client"

import { useState, useMemo, useRef } from "react"
import Link from "next/link"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import {
  Search,
  Filter,
  Plus,
  Package,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  Download,
  Upload,
  Printer,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Search as SearchIcon,
  LayoutGrid,
  List as ListIcon,
  ChevronDown,
  MapPin,
  X,
  Check,
  RefreshCw,
  Eye,
  Trash2,
  AlertCircle,
  Smartphone,
  Tag,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"

const fastMovingItemsData = [
  { name: "iPhone 13 Screen", count: 48 },
  { name: "Samsung S21 Battery", count: 42 },
  { name: "iPad Pro Glass", count: 35 },
  { name: "OnePlus 9 Camera", count: 30 },
  { name: "Xiaomi Note 10 LCD", count: 28 },
  { name: "Oppo A74 Display", count: 22 },
  { name: "Vivo Y20 Battery", count: 20 },
  { name: "Realme 8 Chg Port", count: 18 },
  { name: "Nokia 7.2 Screen", count: 15 },
  { name: "Moto G60 Camera", count: 12 },
].sort((a, b) => b.count - a.count)

const stockTrendDataMap: Record<string, { label: string, value: number }[]> = {
  "Last 7 days": [
    { label: "Mon", value: 2.75 }, { label: "Tue", value: 2.78 }, { label: "Wed", value: 2.80 }, 
    { label: "Thu", value: 2.82 }, { label: "Fri", value: 2.85 }, { label: "Sat", value: 2.84 }, { label: "Sun", value: 2.88 }
  ],
  "Last 28 days": [
    { label: "W1", value: 2.5 }, { label: "W2", value: 2.65 }, { label: "W3", value: 2.72 }, { label: "W4", value: 2.88 }
  ],
  "Last 30 days": [
    { label: "Day 1", value: 2.45 }, { label: "Day 10", value: 2.58 }, { label: "Day 20", value: 2.70 }, { label: "Day 30", value: 2.88 }
  ],
  "Last 90 days": [
    { label: "Month 1", value: 2.2 }, { label: "Month 2", value: 2.5 }, { label: "Month 3", value: 2.88 }
  ],
  "Last 6 months": [
    { label: "Jan", value: 2.1 }, { label: "Feb", value: 2.3 }, { label: "Mar", value: 2.2 }, 
    { label: "Apr", value: 2.5 }, { label: "May", value: 2.6 }, { label: "Jun", value: 2.8 }
  ]
}
const stockTrendData = [
  { month: "Jan", value: 2.1 },
  { month: "Feb", value: 2.3 },
  { month: "Mar", value: 2.2 },
  { month: "Apr", value: 2.5 },
  { month: "May", value: 2.6 },
  { month: "Jun", value: 2.8 },
]

const initialInventoryData = [
  {
    code: "SCR-001",
    name: "iPhone 13 Pro LCD Screen",
    brand: "Apple",
    category: "Screens",
    stock: 45,
    maxStock: 50,
    price: 12000,
    supplier: "Tech Supplies Inc",
    location: "A-12",
    status: "In Stock" as const,
  },
  {
    code: "BAT-045",
    name: "Samsung Galaxy S21 Battery",
    brand: "Samsung",
    category: "Batteries",
    stock: 12,
    maxStock: 50,
    price: 2500,
    supplier: "Mobile Parts Co",
    location: "B-05",
    status: "Low Stock" as const,
  },
  {
    code: "CHG-023",
    name: "iPhone 12 Charging Port Flex",
    brand: "Apple",
    category: "Charging Ports",
    stock: 0,
    maxStock: 50,
    price: 1200,
    supplier: "Quick Parts Ltd",
    location: "C-18",
    status: "Out of Stock" as const,
  },
  {
    code: "CAM-112",
    name: "Xiaomi Redmi Note 10 Rear Camera",
    brand: "Xiaomi",
    category: "Cameras",
    stock: 45,
    maxStock: 50,
    price: 4500,
    supplier: "Tech Supplies Inc",
    location: "A-08",
    status: "In Stock" as const,
  },
  {
    code: "TOL-089",
    name: "Professional Screwdriver Set",
    brand: "Tool Masters",
    category: "Tools",
    stock: 45,
    maxStock: 50,
    price: 850,
    supplier: "Tool Masters",
    location: "D-22",
    status: "In Stock" as const,
  },
]

export default function InventoryManagementPage() {
  const [inventoryState, setInventoryState] = useState(initialInventoryData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All Categories")
  const [filterStatus, setFilterStatus] = useState("All Status")
  const [filterSupplier, setFilterSupplier] = useState("All Suppliers")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Chart Time Range State
  const [chartTimeRange, setChartTimeRange] = useState("Last 6 months")

  // Master Modals State
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [editItemTarget, setEditItemTarget] = useState<any | null>(null)
  const [viewDetailsTarget, setViewDetailsTarget] = useState<any | null>(null)
  const [deleteFormTarget, setDeleteFormTarget] = useState<any | null>(null)

  // Interaction States
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false)
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false)
  const [isConfirmPOOpen, setIsConfirmPOOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // PO Drafting State
  const [poItems, setPoItems] = useState([{ id: 1, name: "SCR-001 (iPhone 13 Pro...)", qty: 10 }])
  const [poSupplier, setPoSupplier] = useState("Tech Supplies Inc")

  const hiddenInventoryReportRef = useRef<HTMLDivElement>(null)

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    setIsExportOpen(false)
    try {
      const element = hiddenInventoryReportRef.current
      if (!element) return

      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Robust Fix for "lab()" / "oklch()" color parsing errors
          const elements = clonedDoc.getElementsByTagName("*");
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            const style = window.getComputedStyle(el);
            
            const colorProps = ['color', 'backgroundColor', 'borderColor', 'outlineColor', 'textDecorationColor', 'stopColor', 'fill', 'stroke'];
            colorProps.forEach(prop => {
              const val = (style as any)[prop];
              if (val && (val.includes('oklch') || val.includes('lab') || val.includes('color-mix'))) {
                if (prop === 'backgroundColor') el.style.backgroundColor = '#ffffff';
                else if (prop === 'color') el.style.color = '#000000';
                else el.style[prop as any] = 'transparent';
              }
            });

            const shadow = style.boxShadow;
            if (shadow && (shadow.includes('oklch') || shadow.includes('lab') || shadow.includes('color-mix'))) {
              el.style.boxShadow = 'none';
            }
          }
        }
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Inventory_Status_Report_${new Date().toISOString().slice(0,10)}.pdf`)
    } catch (err) {
      console.error("PDF generation failed:", err)
      alert("Error: Could not generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleExportCSV = () => {
    const rows = [["Item Code", "Item Name", "Brand", "Category", "Stock", "Price", "Supplier", "Status"],
      ...filteredData.map(i => [i.code, i.name, i.brand, i.category, i.stock, i.price, i.supplier, i.status])]
    const csv = rows.map(r => r.join(",")).join("\n")
    const a = document.createElement("a"); 
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    a.download = `inventory_export_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    setIsExportOpen(false)
  }

  const filteredData = useMemo(() => {
    return inventoryState.filter((item) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        item.name.toLowerCase().includes(searchLower) ||
        item.code.toLowerCase().includes(searchLower) ||
        item.brand.toLowerCase().includes(searchLower)
      
      const matchesCategory = filterCategory === "All Categories" || item.category === filterCategory
      const matchesStatus = filterStatus === "All Status" || item.status === filterStatus
      const matchesSupplier = filterSupplier === "All Suppliers" || item.supplier === filterSupplier
      
      return matchesSearch && matchesStatus && matchesSupplier && matchesCategory
    })
  }, [inventoryState, searchTerm, filterStatus, filterSupplier, filterCategory])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredData.slice(start, start + itemsPerPage)
  }, [filteredData, currentPage])

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(paginatedData.map(i => i.code))
    } else {
      setSelectedItems([])
    }
  }

  const toggleSelectItem = (code: string) => {
    setSelectedItems(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    )
  }

  const handleDeleteItem = (code: string) => {
    setInventoryState(prev => prev.filter(item => item.code !== code))
    setActiveMenuId(null)
  }

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 flex flex-col pt-0 overflow-y-auto">
          <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-[#0F172A]">Inventory Management</h1>
                <p className="text-sm text-muted-foreground font-medium">Manage your spare parts and supplies</p>
              </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsAdjustStockOpen(true)}
                    className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-sm font-semibold text-[#0F172A] hover:bg-muted transition-colors shadow-sm focus:outline-none"
                  >
                    <Package className="h-4 w-4" /> Adjust Stock
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setIsExportOpen(!isExportOpen)}
                      className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-sm font-semibold text-[#0F172A] hover:bg-muted transition-colors shadow-sm focus:outline-none"
                    >
                      {isGeneratingPDF ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Export <ChevronDown className="h-4 w-4" />
                    </button>
                    {isExportOpen && (
                      <div className="absolute top-12 right-0 w-44 bg-white rounded-xl shadow-xl border border-border py-1 z-[100] animate-in fade-in slide-in-from-top-2">
                        <button onClick={handleDownloadPDF} className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-colors border-b border-border/50"><Download className="h-4 w-4 text-[#4F46E5]" /> Export as PDF</button>
                        <button onClick={handleExportCSV} className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-colors"><Download className="h-4 w-4 text-[#10B981]" /> Export as CSV</button>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsAddItemOpen(true)}
                    className="flex items-center gap-2 h-10 px-4 rounded-lg bg-[#4F46E5] text-sm font-semibold text-white hover:bg-[#4338CA] transition-all shadow-md active:scale-95 focus:outline-none"
                  >
                    <Plus className="h-4 w-4" /> Add Item
                  </button>
                </div>
            </div>

            {/* Quick Overview Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[#0F172A] mb-4">Quick Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-border/60 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] flex items-center justify-center">
                    <ArrowUpRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Stock Movements (This Week)</span>
                    <span className="text-xl font-bold text-[#0F172A]">156 transactions</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border/60 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                    <Clock className="h-6 w-6 text-[#D97706]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Purchase Orders</span>
                    <span className="text-xl font-bold text-[#0F172A]">5 orders</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border/60 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-[#EF4444]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Items Expiring Soon</span>
                    <span className="text-xl font-bold text-[#0F172A]">12 items</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-border/60 shadow-sm">
                <h3 className="text-md font-bold text-[#0F172A] mb-1">Top 10 Fast-Moving Items</h3>
                <p className="text-xs text-muted-foreground mb-6">Most used parts this month</p>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fastMovingItemsData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100} 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 11, fontWeight: 500, fill: "#64748B" }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="count" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-border/60 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-6">
                   <div>
                      <h3 className="text-md font-black text-[#0F172A] mb-1">Stock Value Trend</h3>
                      <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">{chartTimeRange}</p>
                   </div>
                   <select 
                     value={chartTimeRange}
                     onChange={(e) => setChartTimeRange(e.target.value)}
                     className="h-8 rounded-lg border border-border bg-white px-2 text-[11px] font-black text-[#0F172A] focus:outline-none shadow-sm cursor-pointer"
                   >
                      <option>Last 7 days</option>
                      <option>Last 28 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>Last 6 months</option>
                   </select>
                </div>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stockTrendDataMap[chartTimeRange] || stockTrendDataMap["Last 6 months"]}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 700, fill: "#64748B" }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 700, fill: "#64748B" }}
                        tickFormatter={(v) => `${v}M`}
                        dx={-5}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                        itemStyle={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}
                        labelStyle={{ fontSize: '10px', fontWeight: '700', color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#4F46E5" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* All Inventory Items Table Section */}
            <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden mb-8">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-black text-[#0F172A]">All Inventory Items</h3>
                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-1">{filteredData.length} total items listed</p>
                  </div>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                  <div className="relative flex-1 group">
                    <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-[#4F46E5]" />
                    <input 
                      type="text" 
                      placeholder="Search by name, SKU, brand..."
                      value={searchTerm}
                      onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1)}}
                      className="w-full h-11 pl-11 pr-4 rounded-xl border border-border bg-[#F8FAFC] text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:bg-white transition-all shadow-sm placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <select 
                      className="h-11 px-4 rounded-xl border border-border bg-white text-[13px] font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 min-w-[150px] cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                      value={filterCategory}
                      onChange={(e) => {setFilterCategory(e.target.value); setCurrentPage(1)}}
                    >
                      <option>All Categories</option>
                      <option>Screens</option>
                      <option>Batteries</option>
                      <option>Cameras</option>
                      <option>Charging Ports</option>
                      <option>Tools</option>
                    </select>
                    <select 
                      className="h-11 px-4 rounded-xl border border-border bg-white text-[13px] font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 min-w-[130px] cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                      value={filterStatus}
                      onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1)}}
                    >
                      <option>All Status</option>
                      <option>In Stock</option>
                      <option>Low Stock</option>
                      <option>Out of Stock</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto rounded-xl border border-border/50">
                  <table className="w-full text-left border-collapse min-w-[1100px]">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-border/80 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        <th className="px-5 py-4 w-12">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-border accent-[#4F46E5]" 
                            onChange={toggleSelectAll}
                            checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                          />
                        </th>
                        <th className="px-5 py-4">Item Details</th>
                        <th className="px-5 py-4">Stock Availability</th>
                        <th className="px-5 py-4">Unit Price</th>
                        <th className="px-5 py-4">Source & Location</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {paginatedData.map((item) => (
                        <tr key={item.code} className={`group hover:bg-[#F8FAFC] transition-colors ${selectedItems.includes(item.code) ? 'bg-[#EEF2FF]/40' : ''}`}>
                          <td className="px-5 py-5 w-12">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 rounded border-border accent-[#4F46E5]"
                              checked={selectedItems.includes(item.code)}
                              onChange={() => toggleSelectItem(item.code)}
                            />
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[13px] font-black text-[#0F172A] leading-tight">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.code}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-[10px] font-bold text-[#4F46E5] uppercase">{item.brand}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-[10px] font-bold text-slate-400">{item.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex flex-col gap-1.5 min-w-[140px]">
                              <div className="flex items-center justify-between">
                                <span className="text-[12px] font-black text-[#0F172A] tracking-tight">{item.stock} units <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">Current</span></span>
                              </div>
                              <div className="w-full h-1.5 bg-[#EEF2FF] rounded-full overflow-hidden shadow-inner">
                                <div 
                                  className={`h-full rounded-full transition-all duration-700 shadow-sm ${
                                    item.status === 'In Stock' ? 'bg-[#10B981]' : 
                                    item.status === 'Low Stock' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
                                  }`} 
                                  style={{ width: `${Math.min(100, (item.stock / item.maxStock) * 100)}%` }} 
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex flex-col">
                               <span className="text-[13px] font-black text-[#0F172A]">Rs. {(item.price || 0).toLocaleString()}</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">MSRP Value</span>
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex flex-col gap-1">
                               <div className="flex items-center gap-2">
                                  <Package className="h-3 w-3 text-slate-400" />
                                  <span className="text-[12px] font-bold text-[#0F172A] leading-none">{item.supplier}</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3 text-[#4F46E5]" />
                                  <span className="text-[11px] font-black text-slate-400 leading-none">Bay {item.location}</span>
                               </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 text-right">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                              item.status === 'In Stock' ? 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]' : 
                              item.status === 'Low Stock' ? 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]' : 
                              'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]'
                            }`}>
                               {item.status}
                            </div>
                          </td>
                          <td className="px-5 py-5 text-center relative">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === item.code ? null : item.code); }}
                              className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-all focus:outline-none"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {activeMenuId === item.code && (
                               <div className="absolute right-14 top-4 w-44 bg-white rounded-2xl shadow-2xl border border-border p-1.5 z-[100] animate-in fade-in zoom-in-95 origin-right">
                                 <button 
                                    onClick={() => { setViewDetailsTarget(item); setActiveMenuId(null); }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] font-bold text-[#0F172A] hover:bg-slate-50 rounded-xl transition-colors"
                                 >
                                    <Eye className="h-4 w-4 text-slate-400" /> View Details
                                 </button>
                                 <button 
                                    onClick={() => { setEditItemTarget(item); setActiveMenuId(null); }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] font-bold text-[#0F172A] hover:bg-slate-50 rounded-xl transition-colors"
                                 >
                                    <RefreshCw className="h-4 w-4 text-[#4F46E5]" /> Edit Item
                                 </button>
                                 <div className="h-px bg-slate-100 my-1 mx-2" />
                                 <button 
                                    onClick={() => { setDeleteFormTarget(item); setActiveMenuId(null); }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                 >
                                    <X className="h-4 w-4" /> Delete Item
                                 </button>
                               </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between py-6 mt-4 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-muted-foreground">Show</span>
                    <select className="h-8 px-2 rounded border border-border bg-white text-[13px] font-bold focus:outline-none">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                    </select>
                    <span className="text-[13px] text-muted-foreground">per page</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="h-8 w-8 rounded flex items-center justify-center border border-border text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {[...Array(Math.ceil(filteredData.length / itemsPerPage))].map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`h-8 w-8 rounded flex items-center justify-center font-bold text-[13px] shadow-sm transition-all ${currentPage === i + 1 ? 'bg-primary text-white scale-110' : 'border border-border text-muted-foreground hover:bg-muted'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredData.length / itemsPerPage), p + 1))}
                      className="h-8 w-8 rounded flex items-center justify-center border border-border text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-[13px] text-muted-foreground font-medium">Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}</span>
                </div>
              </div>
            </div>

          </div>
          <div className="h-12" /> {/* Layout Spacer */}
          <DashboardFooter />
        </main>

        {/* 🔵 OVERLAY MODALS */}
              {/* 🛠️ INVISIBLE PDF RENDER TARGET FOR INVENTORY REPORT */}
        <div className="fixed -left-[4000px] pointer-events-none opacity-0 select-none overflow-hidden h-0 w-0">
           <div 
             ref={hiddenInventoryReportRef}
             className="w-[1000px] bg-white p-16 flex flex-col min-h-[1400px]"
           >
              {/* BRANDING HEADER */}
              <div className="flex justify-between items-start mb-16">
                  <div>
                     <div className="flex items-center gap-3 mb-3">
                       <div className="h-12 w-12 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg">S</div>
                       <h2 className="text-[32px] font-black text-[#0F172A] tracking-tighter uppercase">SRM Solutions</h2>
                     </div>
                     <div className="text-[12px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        <p className="flex items-center gap-2 text-[#4F46E5]"><Package className="h-4 w-4" /> Global Inventory Status</p>
                        <p>Automated Asset Report</p>
                        <p>Internal Record #INV-{new Date().getFullYear()}</p>
                     </div>
                  </div>
                  <div className="text-right text-[12px] text-slate-400 font-black uppercase tracking-widest leading-relaxed pt-2">
                        <p>Head Office Warehouse</p>
                        <p>Colombo 07, Sri Lanka</p>
                        <p className="text-[#4F46E5] mt-1 italic underline underline-offset-4 decoration-slate-200">Generated: {new Date().toLocaleString()}</p>
                  </div>
              </div>

              {/* SUMMARY STATS GRID */}
              <div className="grid grid-cols-4 gap-6 mb-12">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total SKUs</p>
                      <p className="text-[28px] font-black text-[#0F172A] leading-none">{inventoryState.length}</p>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
                      <p className="text-[10px] text-emerald-600/70 font-black uppercase tracking-widest mb-1">Healthy Stock</p>
                      <p className="text-[28px] font-black text-emerald-700 leading-none">{inventoryState.filter(i=>i.status==='In Stock').length}</p>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 shadow-sm">
                      <p className="text-[10px] text-orange-600/70 font-black uppercase tracking-widest mb-1">Critical Low</p>
                      <p className="text-[28px] font-black text-orange-700 leading-none">{inventoryState.filter(i=>['Low Stock','Out of Stock'].includes(i.status)).length}</p>
                  </div>
                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
                      <p className="text-[10px] text-indigo-600/70 font-black uppercase tracking-widest mb-1">Stock Value</p>
                      <p className="text-[28px] font-black text-indigo-700 leading-none">2.8M</p>
                  </div>
              </div>

              {/* DATA TABLE */}
              <div className="flex-1">
                  <table className="w-full text-left border-collapse border-y-2 border-[#0F172A]">
                      <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="px-5 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Item / SKU</th>
                              <th className="px-5 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Meta</th>
                              <th className="px-5 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Stock</th>
                              <th className="px-5 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Unit Price</th>
                              <th className="px-5 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Total (LKR)</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {inventoryState.map((i) => (
                            <tr key={i.code} className="bg-white">
                               <td className="px-5 py-4">
                                  <p className="text-[14px] font-black text-[#0F172A] mb-0.5">{i.name}</p>
                                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{i.code}</p>
                               </td>
                               <td className="px-5 py-4">
                                  <p className="text-[12px] font-bold text-[#0F172A]">{i.brand}</p>
                                  <p className="text-[11px] text-slate-400">{i.category}</p>
                               </td>
                               <td className="px-5 py-4">
                                  <div className="flex items-center gap-2">
                                     <span 
                                       className="text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-widest"
                                       style={{
                                         backgroundColor: i.status === 'In Stock' ? '#ecfdf5' : i.status === 'Low Stock' ? '#fffbeb' : '#fef2f2',
                                         color: i.status === 'In Stock' ? '#047857' : i.status === 'Low Stock' ? '#b45309' : '#b91c1c',
                                         borderColor: i.status === 'In Stock' ? '#a7f3d0' : i.status === 'Low Stock' ? '#fde68a' : '#fecaca',
                                       }}
                                     >
                                       {i.stock} units
                                     </span>
                                  </div>
                               </td>
                               <td className="px-5 py-4 text-right text-[13px] font-bold text-[#0F172A]">
                                 Rs. {(i.price || 0).toLocaleString()}
                               </td>
                               <td className="px-5 py-4 text-right font-black text-[#0F172A]">
                                 Rs. {(i.price * i.stock).toLocaleString()}
                               </td>
                            </tr>
                          ))}
                      </tbody>
                  </table>
              </div>

              {/* FOOTER */}
              <div className="mt-20 pt-12 border-t border-slate-100 border-dashed">
                  <div className="flex justify-between items-center">
                      <p className="text-[12px] font-black text-[#0F172A] flex items-center gap-2">
                         <ArrowUpRight className="h-4 w-4 text-[#4F46E5]" /> 
                         Automated Record Sync: SRM Warehouse v4.2
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         Classification: Internal Only
                      </p>
                  </div>
              </div>
           </div>
        </div>

        {/* 🟢 ADD ITEM MODAL */}
        {isAddItemOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-[#F8FAFC] p-8 border-b border-border flex justify-between items-center relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F46E5]/5 rounded-full -mr-16 -mt-16" />
                   <div className="relative z-10">
                      <h2 className="text-[24px] font-black text-[#0F172A] tracking-tight leading-none mb-2">Register Inventory Item</h2>
                      <p className="text-[13px] text-muted-foreground font-bold uppercase tracking-widest">Create a new SKU record in the system</p>
                   </div>
                   <button onClick={() => setIsAddItemOpen(false)} className="h-10 w-10 rounded-full bg-white border border-border flex items-center justify-center hover:bg-slate-50 transition-all focus:outline-none"><X className="h-5 w-5" /></button>
                </div>
                <div className="p-10 grid grid-cols-2 gap-x-8 gap-y-6">
                   <div className="col-span-2 md:col-span-1">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Item Name</label>
                      <input type="text" placeholder="e.g. iPhone 13 Pro Screen" className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all placeholder:text-slate-300" />
                   </div>
                   <div className="col-span-2 md:col-span-1">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">SKU / Item Code</label>
                      <input type="text" placeholder="SCR-001" className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all placeholder:text-slate-300" />
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Brand</label>
                      <select className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all bg-[#F8FAFC]">
                         <option>Apple</option>
                         <option>Samsung</option>
                         <option>Xiaomi</option>
                         <option>Other</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                      <select className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all bg-[#F8FAFC]">
                         <option>Screens</option>
                         <option>Batteries</option>
                         <option>Charging Ports</option>
                         <option>Tools</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Selling Price (LKR)</label>
                      <input type="number" placeholder="12500" className="w-full h-12 rounded-xl border border-border px-4 text-[14px] font-black focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all" />
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Stock</label>
                      <input type="number" placeholder="45" className="w-full h-12 rounded-xl border border-border px-4 text-[14px] font-black focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all" />
                   </div>
                   <div className="col-span-2 pt-6">
                      <div className="flex gap-4">
                         <button onClick={() => setIsAddItemOpen(false)} className="flex-1 h-14 rounded-2xl border border-border bg-white text-[14px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-tight">Discard</button>
                         <button onClick={() => { setIsAddItemOpen(false); alert("Product Created Successfully!"); }} className="flex-[2] h-14 rounded-2xl bg-[#4F46E5] text-white text-[14px] font-black shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all uppercase tracking-tight">Create Product Record</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* 🟡 EDIT ITEM MODAL */}
        {editItemTarget && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-t-8 border-[#4F46E5]">
                <div className="bg-[#F8FAFC] p-8 border-b border-border flex justify-between items-center">
                   <div>
                      <h2 className="text-[24px] font-black text-[#0F172A] mb-1 leading-none tracking-tight">Edit SKU Record</h2>
                      <p className="text-[12px] text-[#4F46E5] font-black uppercase tracking-widest">Editing: {editItemTarget.code}</p>
                   </div>
                   <button onClick={() => setEditItemTarget(null)} className="h-10 w-10 rounded-full bg-white border border-border flex items-center justify-center transition-all focus:outline-none"><X className="h-5 w-5" /></button>
                </div>
                <div className="p-10 grid grid-cols-2 gap-x-8 gap-y-6">
                   <div className="col-span-2">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Item Display Name</label>
                      <input type="text" defaultValue={editItemTarget.name} className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all" />
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                      <select defaultValue={editItemTarget.category} className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold outline-none bg-[#F8FAFC]">
                         <option>Screens</option>
                         <option>Batteries</option>
                         <option>Charging Ports</option>
                         <option>Tools</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Supplier</label>
                      <select defaultValue={editItemTarget.supplier} className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold outline-none bg-[#F8FAFC]">
                         <option>Tech Supplies Inc</option>
                         <option>Mobile Parts Co</option>
                         <option>Tool Masters</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Update Price (LKR)</label>
                      <input type="number" defaultValue={editItemTarget.price} className="w-full h-12 rounded-xl border border-border px-4 text-[14px] font-black" />
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Storage Location</label>
                      <input type="text" defaultValue={editItemTarget.location} className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold" />
                   </div>
                   <div className="col-span-2 pt-6">
                      <button onClick={() => { setEditItemTarget(null); alert("Data Updated Successfully"); }} className="w-full h-14 rounded-2xl bg-[#4F46E5] text-white text-[15px] font-black shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all uppercase tracking-tight">Update Item Record</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* 🔵 VIEW DETAILS MODAL */}
        {viewDetailsTarget && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-slate-50 p-12 text-center border-b border-border/60">
                   <div className="h-20 w-20 rounded-3xl bg-white border border-border shadow-md flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                      <Package className="h-10 w-10 text-[#4F46E5]" />
                   </div>
                   <h2 className="text-[26px] font-black text-[#0F172A] tracking-tight mb-2">{viewDetailsTarget.name}</h2>
                   <p className="text-[13px] font-black text-[#4F46E5] uppercase tracking-[4px]">{viewDetailsTarget.code}</p>
                </div>
                <div className="p-10 space-y-8">
                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Tag className="h-3 w-3" /> Category</p>
                         <p className="text-[14px] font-bold text-[#0F172A]">{viewDetailsTarget.category}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Smartphone className="h-3 w-3" /> Brand</p>
                         <p className="text-[14px] font-bold text-[#0F172A]">{viewDetailsTarget.brand}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Stock Level</p>
                         <p className={`text-[14px] font-black ${viewDetailsTarget.stock < 10 ? 'text-orange-500' : 'text-emerald-500'}`}>{viewDetailsTarget.stock} units</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Asset Value</p>
                         <p className="text-[14px] font-black text-[#0F172A]">Rs. {(viewDetailsTarget.price || 0).toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="pt-6 border-t border-border flex flex-col gap-4">
                      <button onClick={() => setViewDetailsTarget(null)} className="w-full h-14 rounded-2xl bg-[#0F172A] text-white text-[14px] font-black shadow-lg shadow-slate-900/20 uppercase tracking-widest">Close Information</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* 🔴 DELETE ITEM MODAL */}
        {deleteFormTarget && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-105 duration-200 p-8 text-center ring-1 ring-border">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-red-50/50">
                   <X className="h-10 w-10 text-red-500 stroke-[3px]" />
                </div>
                <h2 className="text-[20px] font-black text-[#0F172A] mb-3 leading-tight tracking-tight">Delete Asset Record?</h2>
                <p className="text-[13px] text-slate-500 font-medium mb-8 leading-relaxed px-4">
                   You are about to permanently purge <strong className="text-[#0F172A]">"{deleteFormTarget.name}"</strong>. This will remove all stock history from the ledger.
                </p>
                <div className="flex flex-col gap-3">
                   <button 
                      onClick={() => { handleDeleteItem(deleteFormTarget.code); setDeleteFormTarget(null); }}
                      className="w-full h-14 rounded-2xl bg-red-500 text-white text-[14px] font-black shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all uppercase tracking-widest"
                   >
                      Confirm Delete
                   </button>
                   <button 
                      onClick={() => setDeleteFormTarget(null)}
                      className="w-full h-12 rounded-xl text-[13px] font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest"
                   >
                      Keep Record
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* Adjust Stock Modal (Existing) */}
        {isAdjustStockOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 border-t-4 border-[#4F46E5]">
               <div className="p-6 border-b border-border flex justify-between items-center">
                  <h3 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
                    <Package className="h-5 w-5 text-[#4F46E5]" /> Quick Stock Adjust
                  </h3>
                  <button onClick={() => setIsAdjustStockOpen(false)} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors focus:outline-none"><X className="h-4 w-4" /></button>
               </div>
               <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Select Item</label>
                    <select className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-2 focus:ring-[#4F46E5]/20 outline-none appearance-none bg-[#F8FAFC]">
                      {inventoryState.map(i => <option key={i.code}>{i.name} ({i.code})</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Current</label>
                      <input type="text" value="45 units" disabled className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold bg-[#F1F5F9] cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Action</label>
                      <select className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-2 focus:ring-[#4F46E5]/20 outline-none bg-[#F8FAFC]">
                         <option>Set New Count</option>
                         <option>Add Quantity (+) </option>
                         <option>Subtract Quantity (-) </option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">New Quantity / Adjustment</label>
                    <input type="number" placeholder="Enter number..." className="w-full h-11 rounded-xl border border-border px-4 text-[14px] font-black focus:ring-2 focus:ring-[#4F46E5]/20 outline-none bg-[#F8FAFC]" />
                  </div>
                  <div className="flex gap-3 pt-4">
                     <button onClick={() => setIsAdjustStockOpen(false)} className="flex-1 h-12 rounded-xl border border-border bg-white text-[13px] font-bold hover:bg-muted transition-all">Cancel</button>
                     <button onClick={() => setIsAdjustStockOpen(false)} className="flex-[1.5] h-12 rounded-xl bg-[#4F46E5] text-white text-[13px] font-black shadow-lg shadow-[#4F46E5]/20 transition-all">Update Stock Ledger</button>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
