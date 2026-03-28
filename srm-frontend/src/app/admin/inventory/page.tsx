"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
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
    stock: 45,
    maxStock: 50,
    price: 12000,
    supplier: "Tech Supplies Inc",
    location: "A-12",
    status: "In Stock",
  },
  {
    code: "BAT-045",
    name: "Samsung Galaxy S21 Battery",
    stock: 12,
    maxStock: 50,
    price: 2500,
    supplier: "Mobile Parts Co",
    location: "B-05",
    status: "Low Stock",
  },
  {
    code: "CHG-023",
    name: "iPhone 12 Charging Port Flex",
    stock: 0,
    maxStock: 50,
    price: 1200,
    supplier: "Quick Parts Ltd",
    location: "C-18",
    status: "Out of Stock",
  },
  {
    code: "CAM-112",
    name: "Xiaomi Redmi Note 10 Rear Camera",
    stock: 45,
    maxStock: 50,
    price: 4500,
    supplier: "Tech Supplies Inc",
    location: "A-08",
    status: "In Stock",
  },
  {
    code: "TOL-089",
    name: "Professional Screwdriver Set",
    stock: 45,
    maxStock: 50,
    price: 850,
    supplier: "Tool Masters",
    location: "D-22",
    status: "In Stock",
  },
]

export default function InventoryManagementPage() {
  const [inventoryState, setInventoryState] = useState(initialInventoryData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All Categories")
  const [filterStatus, setFilterStatus] = useState("All Status")
  const [filterSupplier, setFilterSupplier] = useState("All Suppliers")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Interaction States
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false)
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false)
  const [isConfirmPOOpen, setIsConfirmPOOpen] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // PO Drafting State
  const [poItems, setPoItems] = useState([{ id: 1, name: "SCR-001 (iPhone 13 Pro...)", qty: 10 }])
  const [poSupplier, setPoSupplier] = useState("Tech Supplies Inc")

  const filteredData = useMemo(() => {
    return inventoryState.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = filterCategory === "All Categories" || true // Mock category logic
      const matchesStatus = filterStatus === "All Status" || item.status === filterStatus
      const matchesSupplier = filterSupplier === "All Suppliers" || item.supplier === filterSupplier
      
      return matchesSearch && matchesStatus && matchesSupplier
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

      <div className="flex flex-1 flex-col ml-[200px] min-w-0">
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
                  className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-sm font-semibold text-[#0F172A] hover:bg-muted transition-colors shadow-sm"
                >
                  <Package className="h-4 w-4" /> Adjust Stock
                </button>
                <button 
                  onClick={() => setIsCreatePOOpen(true)}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-sm font-semibold text-[#0F172A] hover:bg-muted transition-colors shadow-sm"
                >
                  <Download className="h-4 w-4" /> Create PO
                </button>
                <Link 
                  href="/admin/inventory/new"
                  className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-95"
                >
                  <Plus className="h-4 w-4" /> Add Item
                </Link>
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
              <div className="bg-white p-6 rounded-2xl border border-border/60 shadow-sm">
                <h3 className="text-md font-bold text-[#0F172A] mb-1">Stock Value Trend</h3>
                <p className="text-xs text-muted-foreground mb-6">Last 6 months</p>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stockTrendData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 11, fontWeight: 500, fill: "#64748B" }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 11, fontWeight: 500, fill: "#64748B" }}
                        tickFormatter={(value) => `${value}M`}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
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
                    <h3 className="text-lg font-bold text-[#0F172A]">All Inventory Items</h3>
                    <p className="text-xs text-muted-foreground font-medium">1,247 total items</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => alert("Simulating CSV Import... Select a file.")}
                      className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-white text-[13px] font-semibold text-[#0F172A] hover:bg-muted transition-colors"
                    >
                      <Upload className="h-3.5 w-3.5" /> Import CSV
                    </button>
                    <button 
                      onClick={() => alert("Inventory Data exported as inventory_list.csv")}
                      className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-white text-[13px] font-semibold text-[#0F172A] hover:bg-muted transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" /> Export
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-white text-[#0F172A] hover:bg-muted transition-colors"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                  <div className="relative flex-1 group">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <input 
                      type="text" 
                      placeholder="Search by name, SKU, brand..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-[#F8FAFC] text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <select 
                      className="h-10 px-3 rounded-lg border border-border bg-white text-[13px] font-bold text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer min-w-[140px]"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      <option>All Categories</option>
                      <option>Screens</option>
                      <option>Batteries</option>
                      <option>Cameras</option>
                    </select>
                    <select 
                      className="h-10 px-3 rounded-lg border border-border bg-white text-[13px] font-bold text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer min-w-[120px]"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option>All Status</option>
                      <option>In Stock</option>
                      <option>Low Stock</option>
                      <option>Out of Stock</option>
                    </select>
                    <select 
                      className="h-10 px-3 rounded-lg border border-border bg-white text-[13px] font-bold text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer min-w-[140px]"
                      value={filterSupplier}
                      onChange={(e) => setFilterSupplier(e.target.value)}
                    >
                      <option>All Suppliers</option>
                      <option>Tech Supplies Inc</option>
                      <option>Mobile Parts Co</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-border/80 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="px-4 py-3 pb-4 w-10">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-border accent-primary" 
                            onChange={toggleSelectAll}
                            checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                          />
                        </th>
                        <th className="px-4 py-3 pb-4">Item Code</th>
                        <th className="px-4 py-3 pb-4">Item Name</th>
                        <th className="px-4 py-3 pb-4">Stock</th>
                        <th className="px-4 py-3 pb-4">Selling Price</th>
                        <th className="px-4 py-3 pb-4">Supplier</th>
                        <th className="px-4 py-3 pb-4">Location</th>
                        <th className="px-4 py-3 pb-4">Status</th>
                        <th className="px-4 py-3 pb-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {paginatedData.map((item) => (
                        <tr key={item.code} className={`hover:bg-[#F8FAFC] transition-colors ${selectedItems.includes(item.code) ? 'bg-[#EEF2FF]/40' : ''}`}>
                          <td className="px-4 py-5 font-black">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 rounded border-border accent-primary"
                              checked={selectedItems.includes(item.code)}
                              onChange={() => toggleSelectItem(item.code)}
                            />
                          </td>
                          <td className="px-4 py-5">
                            <span className="text-[12px] font-bold text-muted-foreground tracking-tight">{item.code}</span>
                          </td>
                          <td className="px-4 py-5">
                            <span className="text-[13px] font-bold text-[#0F172A]">{item.name}</span>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex flex-col gap-1.5 min-w-[120px]">
                              <div className="flex items-center justify-between">
                                <span className="text-[12px] font-black text-[#0F172A]">{item.stock} units</span>
                              </div>
                              <div className="w-full h-1.5 bg-[#EEF2FF] rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    item.status === 'In Stock' ? 'bg-[#4F46E5]' : 
                                    item.status === 'Low Stock' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
                                  }`} 
                                  style={{ width: `${(item.stock / item.maxStock) * 100}%` }} 
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <span className="text-[13px] font-bold text-[#0F172A]">Rs. {item.price.toLocaleString()}</span>
                          </td>
                          <td className="px-4 py-5">
                            <span className="text-[12px] font-medium text-muted-foreground">{item.supplier}</span>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="text-[12px] font-bold">{item.location}</span>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                              item.status === 'In Stock' ? 'bg-[#D1FAE5] text-[#10B981] border-[#10B981]/20' : 
                              item.status === 'Low Stock' ? 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]/20' : 
                              'bg-[#FEE2E2] text-[#EF4444] border-[#EF4444]/20'
                            }`}>
                              <div className={`h-1.5 w-1.5 rounded-full ${
                                item.status === 'In Stock' ? 'bg-[#10B981]' : 
                                item.status === 'Low Stock' ? 'bg-[#D97706]' : 'bg-[#EF4444]'
                              }`} />
                              {item.status}
                            </div>
                          </td>
                          <td className="px-4 py-5 text-center relative">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === item.code ? null : item.code); }}
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#0F172A] transition-all"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {activeMenuId === item.code && (
                               <div className="absolute right-12 top-4 w-40 bg-white rounded-lg shadow-xl border border-border py-1 z-50 animate-in fade-in zoom-in-95 origin-right">
                                 <Link href="/admin/inventory/new" className="flex items-center w-full px-4 py-2 text-[12px] font-bold text-[#0F172A] hover:bg-muted transition-colors">
                                    Edit Item
                                 </Link>
                                 <button className="flex items-center w-full px-4 py-2 text-[12px] font-bold text-[#0F172A] hover:bg-muted transition-colors">
                                    View Details
                                 </button>
                                 <div className="h-px bg-border my-1" />
                                 <button 
                                    onClick={() => handleDeleteItem(item.code)}
                                    className="flex items-center w-full px-4 py-2 text-[12px] font-bold text-red-600 hover:bg-red-50 transition-colors"
                                 >
                                    Delete Item
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
        
        {/* Adjust Stock Modal */}
        {isAdjustStockOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 border-t-4 border-primary">
               <div className="p-6 border-b border-border flex justify-between items-center">
                  <h3 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" /> Quick Stock Adjust
                  </h3>
                  <button onClick={() => setIsAdjustStockOpen(false)} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"><X className="h-4 w-4" /></button>
               </div>
               <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Select Item</label>
                    <select className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none bg-[#F8FAFC]">
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
                      <select className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-2 focus:ring-primary/20 outline-none bg-[#F8FAFC]">
                         <option>Set New Count</option>
                         <option>Add Quantity (+) </option>
                         <option>Subtract Quantity (-) </option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">New Quantity / Adjustment</label>
                    <input type="number" placeholder="Enter number..." className="w-full h-11 rounded-xl border border-border px-4 text-[14px] font-black focus:ring-2 focus:ring-primary/20 outline-none bg-[#F8FAFC]" />
                  </div>
                  <div className="flex gap-3 pt-4">
                     <button onClick={() => setIsAdjustStockOpen(false)} className="flex-1 h-12 rounded-xl border border-border bg-white text-[13px] font-bold hover:bg-muted transition-all">Cancel</button>
                     <button onClick={() => setIsAdjustStockOpen(false)} className="flex-[1.5] h-12 rounded-xl bg-primary text-white text-[13px] font-black shadow-lg hover:shadow-primary/20 transition-all">Update Stock Ledger</button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Create PO Modal */}
        {isCreatePOOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 border-t-8 border-[#10B981]">
               <div className="p-6 border-b border-border flex justify-between items-center bg-[#F8FAFC]">
                  <h3 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-[#DCFCE7] flex items-center justify-center">
                       <Download className="h-5 w-5 text-[#10B981]" />
                    </div>
                    Create Purchase Order
                  </h3>
                  <button onClick={() => setIsCreatePOOpen(false)} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"><X className="h-4 w-4" /></button>
               </div>
               <div className="p-8 space-y-8">
                  <div>
                    <label className="block text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-2.5">Select Primary Supplier</label>
                    <select 
                      value={poSupplier}
                      onChange={(e) => setPoSupplier(e.target.value)}
                      className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-2 focus:ring-[#10B981]/20 outline-none appearance-none bg-[#F8FAFC] shadow-inner"
                    >
                      <option>Tech Supplies Inc</option>
                      <option>Mobile Parts Co</option>
                      <option>Tool Masters</option>
                    </select>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Order Items Matrix</p>
                        <span className="text-[10px] font-bold text-[#10B981] bg-[#DCFCE7] px-2 py-0.5 rounded-full uppercase italic">Draft Mode</span>
                     </div>
                     <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        {poItems.map((item, idx) => (
                           <div key={item.id} className="group relative flex items-center gap-3 p-4 rounded-xl border border-border bg-[#F8FAFC] hover:border-[#10B981]/30 transition-all shadow-sm">
                              <div className="flex-1">
                                 <select className="w-full h-9 bg-transparent text-[13px] font-bold outline-none border-none p-0 focus:ring-0 appearance-none">
                                    <option>{item.name}</option>
                                    {inventoryState.map(i => <option key={i.code}>{i.name}</option>)}
                                 </select>
                              </div>
                              <div className="w-24">
                                 <input 
                                    type="number" 
                                    value={item.qty} 
                                    onChange={(e) => {
                                       const newItems = [...poItems];
                                       newItems[idx].qty = Number(e.target.value);
                                       setPoItems(newItems);
                                    }}
                                    className="w-full h-9 rounded-lg border border-border text-center text-[13px] font-black bg-white focus:ring-1 focus:ring-[#10B981]" 
                                 />
                              </div>
                              <button 
                                 onClick={() => setPoItems(poItems.filter(i => i.id !== item.id))}
                                 className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all"
                              >
                                 <X className="h-4 w-4" />
                              </button>
                           </div>
                        ))}
                     </div>
                     <button 
                        onClick={() => setPoItems([...poItems, { id: Date.now(), name: "Search Item...", qty: 1 }])}
                        className="flex items-center gap-2 px-4 py-2 text-[12px] font-black text-primary hover:bg-[#EEF2FF] rounded-lg transition-all uppercase tracking-tight"
                     >
                        <Plus className="h-3.5 w-3.5 stroke-[3px]" /> Add Another SKU
                     </button>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-border">
                     <button onClick={() => setIsCreatePOOpen(false)} className="flex-1 h-14 rounded-xl border border-border bg-white text-[14px] font-black text-[#64748B] hover:bg-[#F8FAFC] transition-all tracking-tight uppercase">
                        Discard PO
                     </button>
                     <button 
                        onClick={() => { setIsConfirmPOOpen(true); }}
                        className="flex-[1.5] h-14 rounded-xl bg-[#10B981] text-white text-[14px] font-black shadow-lg shadow-[#10B981]/20 hover:bg-[#059669] transition-all tracking-tight uppercase flex items-center justify-center gap-2"
                     >
                        Send Request to {poSupplier.split(' ')[0]}
                     </button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* 🟠 FINAL CONFIRMATION POPUP (Secondary Stage) */}
        {isConfirmPOOpen && (
           <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
              <div className="bg-white w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-105 border border-border text-center p-8">
                 <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-[#DCFCE7]/20">
                    <Check className="h-8 w-8 text-[#10B981] stroke-[3px]" />
                 </div>
                 <h2 className="text-[20px] font-black text-[#0F172A] mb-3 leading-tight tracking-tight">Confirm PO Dispatch?</h2>
                 <p className="text-[13px] text-muted-foreground font-medium mb-8">
                    You are about to send a Purchase Order to <strong className="text-[#10B981]">{poSupplier}</strong> with <strong className="text-[#0F172A]">{poItems.length} items</strong>. This action will notify the vendor immediately.
                 </p>
                 <div className="flex flex-col gap-3">
                    <button 
                       onClick={() => { setIsConfirmPOOpen(false); setIsCreatePOOpen(false); alert("Success! PO Ref #PO-2026-X has been dispatched."); }}
                       className="w-full h-14 rounded-2xl bg-[#10B981] text-white text-[15px] font-black shadow-lg hover:shadow-[#10B981]/30 hover:bg-[#059669] transition-all tracking-wide uppercase"
                    >
                       Confirm & Send Now
                    </button>
                    <button 
                       onClick={() => setIsConfirmPOOpen(false)}
                       className="w-full h-12 rounded-xl text-[13px] font-black text-muted-foreground hover:bg-[#F1F5F9] transition-all tracking-wide uppercase"
                    >
                       No, I need to check
                    </button>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  )
}
