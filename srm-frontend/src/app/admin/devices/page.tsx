"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import {
  Download,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Tablet,
  Laptop,
  CheckCircle2,
  AlertCircle,
  History,
  Info,
  User,
  MoreHorizontal,
} from "lucide-react"

interface DeviceRow {
  id: string
  name: string
  type: "Mobile Phone" | "Tablet" | "Laptop" | "Console"
  imei: string
  image: string
  owner: {
    name: string
    avatar: string
    phone: string
  }
  warranty: {
    status: "Active" | "Expiring Soon" | "Expired" | "No Warranty"
    expiryDate: string
  }
  totalRepairs: number
  lastService: {
    date: string
    type: string
  }
  registered: string
  status: "Active" | "In Repair" | "Retired"
}

const mockDevices: DeviceRow[] = [
  {
    id: "1",
    name: "Apple iPhone 14 Pro Max",
    type: "Mobile Phone",
    imei: "356789012345678",
    image: "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?q=80&w=100&h=100&auto=format&fit=crop",
    owner: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      phone: "+92 300 1234567"
    },
    warranty: {
      status: "Active",
      expiryDate: "Dec 15, 2024"
    },
    totalRepairs: 3,
    lastService: {
      date: "Jan 15, 2024",
      type: "Screen Replacement"
    },
    registered: "Mar 20, 2023",
    status: "Active"
  },
  {
    id: "2",
    name: "Samsung Galaxy S23 Ultra",
    type: "Mobile Phone",
    imei: "358912345678901",
    image: "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?q=80&w=100&h=100&auto=format&fit=crop",
    owner: {
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?u=michael",
      phone: "+92 321 9876543"
    },
    warranty: {
      status: "Expiring Soon",
      expiryDate: "Feb 28, 2024"
    },
    totalRepairs: 1,
    lastService: {
      date: "Dec 08, 2023",
      type: "Battery Replacement"
    },
    registered: "Feb 10, 2023",
    status: "In Repair"
  },
  {
    id: "3",
    name: "Apple iPad Pro 12.9\"",
    type: "Tablet",
    imei: "357123456789012",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=100&h=100&auto=format&fit=crop",
    owner: {
      name: "Emma Williams",
      avatar: "https://i.pravatar.cc/150?u=emma",
      phone: "+92 333 5551234"
    },
    warranty: {
      status: "Expired",
      expiryDate: "Aug 10, 2023"
    },
    totalRepairs: 5,
    lastService: {
      date: "Jan 22, 2024",
      type: "Charging Port Repair"
    },
    registered: "Aug 15, 2022",
    status: "Active"
  },
  {
    id: "4",
    name: "Xiaomi Redmi Note 12 Pro",
    type: "Mobile Phone",
    imei: "359876543210987",
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=100&h=100&auto=format&fit=crop",
    owner: {
      name: "Ahmed Khan",
      avatar: "https://i.pravatar.cc/150?u=ahmed",
      phone: "+92 345 7778888"
    },
    warranty: {
      status: "No Warranty",
      expiryDate: ""
    },
    totalRepairs: 0,
    lastService: {
      date: "Never serviced",
      type: ""
    },
    registered: "Jan 28, 2024",
    status: "Active"
  },
  {
    id: "5",
    name: "Apple MacBook Pro 16\"",
    type: "Laptop",
    imei: "C02YD2MGJG5H",
    image: "https://images.unsplash.com/photo-1517336714481-482a8ec90141?q=80&w=100&h=100&auto=format&fit=crop",
    owner: {
      name: "David Martinez",
      avatar: "https://i.pravatar.cc/150?u=david",
      phone: "+92 312 4445555"
    },
    warranty: {
      status: "Active",
      expiryDate: "Nov 30, 2024"
    },
    totalRepairs: 2,
    lastService: {
      date: "Nov 12, 2023",
      type: "Keyboard Replacement"
    },
    registered: "Nov 05, 2022",
    status: "Active"
  },
  {
    id: "6",
    name: "Oppo Find X5 Pro",
    type: "Mobile Phone",
    imei: "354321098765432",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=100&h=100&auto=format&fit=crop",
    owner: {
      name: "Fatima Ali",
      avatar: "https://i.pravatar.cc/150?u=fatima",
      phone: "+92 334 9998877"
    },
    warranty: {
      status: "Active",
      expiryDate: "Sep 18, 2024"
    },
    totalRepairs: 7,
    lastService: {
      date: "Jan 05, 2024",
      type: "Camera Repair"
    },
    registered: "Sep 20, 2022",
    status: "Retired"
  }
]

export default function AllDevicesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDevices = useMemo(() => {
    return mockDevices.filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.imei.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col ml-[200px] min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 flex flex-col pt-0 overflow-y-auto">
          {/* Header */}
          <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-[28px] font-black text-[#0F172A] tracking-tight">Devices Management</h1>
                <p className="text-[13px] text-muted-foreground font-medium">3,582 registered devices in system</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="h-10 px-4 rounded-lg border border-border bg-white text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-all flex items-center gap-2">
                  <Download className="h-4 w-4" /> Export
                </button>
                <Link 
                  href="/admin/devices/new" 
                  className="h-10 px-5 rounded-lg bg-[#4F46E5] text-[13px] font-bold text-white hover:bg-[#4338CA] shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Register Device
                </Link>
              </div>
            </div>

            {/* Card Wrapper */}
            <div className="bg-white rounded-[20px] border border-border shadow-sm flex flex-col overflow-hidden mb-8">
              
              {/* Filter Bar */}
              <div className="p-6 border-b border-border">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-[#4F46E5] transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search by device, IMEI, serial, owner..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 rounded-xl border border-border bg-[#F8FAFC] text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                    <select className="h-11 px-4 rounded-xl border border-border bg-white text-[13px] font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 appearance-none min-w-[140px] shadow-sm">
                      <option>Brands</option>
                      <option>Apple</option>
                      <option>Samsung</option>
                      <option>Google</option>
                    </select>
                    <select className="h-11 px-4 rounded-xl border border-border bg-white text-[13px] font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 appearance-none min-w-[140px] shadow-sm">
                      <option>Types</option>
                      <option>Mobile Phone</option>
                      <option>Tablet</option>
                      <option>Laptop</option>
                    </select>
                    <select className="h-11 px-4 rounded-xl border border-border bg-white text-[13px] font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 appearance-none min-w-[140px] shadow-sm">
                      <option>Status</option>
                      <option>Active</option>
                      <option>In Repair</option>
                      <option>Retired</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table Area */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                      <th className="px-6 py-4 w-12"><input type="checkbox" className="h-4 w-4 rounded border-border accent-[#4F46E5]" /></th>
                      <th className="px-6 py-4">Device</th>
                      <th className="px-6 py-4">Owner</th>
                      <th className="px-6 py-4">Warranty</th>
                      <th className="px-6 py-4 text-center">Total Repairs</th>
                      <th className="px-6 py-4">Last Service</th>
                      <th className="px-6 py-4">Registered</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredDevices.map(device => (
                      <tr key={device.id} className="hover:bg-[#F8FAFC]/50 transition-colors group">
                        <td className="px-6 py-5"><input type="checkbox" className="h-4 w-4 rounded border-border accent-[#4F46E5]" /></td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] p-1 border border-border overflow-hidden shrink-0 flex items-center justify-center">
                              <img src={device.image} alt="" className="w-full h-full object-cover rounded-lg" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <Link href={`/admin/devices/${device.id}`} className="text-[13px] font-black text-[#0F172A] hover:text-[#4F46E5] transition-colors truncate">{device.name}</Link>
                              <span className="text-[11px] font-medium text-muted-foreground">{device.type}</span>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-0.5">IMEI: {device.imei}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <img src={device.owner.avatar} alt="" className="w-8 h-8 rounded-full border border-border shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-[12px] font-bold text-[#0F172A] leading-tight">{device.owner.name}</span>
                              <span className="text-[11px] font-medium text-muted-foreground">{device.owner.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <div className={`text-[10px] font-black uppercase tracking-widest ${
                              device.warranty.status === 'Active' ? 'text-[#10B981]' 
                              : device.warranty.status === 'Expiring Soon' ? 'text-[#F59E0B]'
                              : 'text-red-500'
                            }`}>
                              {device.warranty.status}
                            </div>
                            <span className="text-[11px] font-medium text-muted-foreground">{device.warranty.expiryDate || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-[16px] font-black text-[#4F46E5]">{device.totalRepairs}</span>
                        </td>
                        <td className="px-6 py-5">
                          {device.lastService.date === 'Never serviced' ? (
                            <span className="text-[11px] text-muted-foreground font-medium italic">Never serviced</span>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-[12px] font-bold text-[#0F172A] leading-tight">{device.lastService.date}</span>
                              <span className="text-[11px] font-medium text-muted-foreground">{device.lastService.type}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-[12px] font-medium text-[#64748B]">{device.registered}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                            device.status === 'Active' ? 'bg-[#D1FAE5] text-[#10B981] border-[#10B981]/20' 
                            : device.status === 'In Repair' ? 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]/20'
                            : 'bg-[#F1F5F9] text-[#64748B] border-[#64748B]/20'
                          }`}>
                            {device.status === 'In Repair' && <Wrench className="h-3 w-3" />}
                            {device.status === 'Retired' && <History className="h-3 w-3" />}
                            {device.status === 'Active' && <CheckCircle2 className="h-3 w-3" />}
                            {device.status}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-6 border-t border-border bg-[#F8FAFC]/50 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-3">
                    <span className="text-[13px] text-muted-foreground font-medium">Show</span>
                    <select className="h-9 px-2 rounded-lg border border-border bg-white text-[13px] font-bold focus:outline-none shadow-sm">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                    </select>
                    <span className="text-[13px] text-muted-foreground font-medium">per page</span>
                    <span className="ml-6 text-[13px] text-muted-foreground font-medium">Showing <strong className="text-[#0F172A]">1</strong> to <strong className="text-[#0F172A]">25</strong> of <strong className="text-[#0F172A]">3,582</strong> devices</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <button className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-white hover:text-primary transition-all shadow-sm"><ChevronLeft className="h-4 w-4" /></button>
                    {[1, 2, 3, "...", 144].map((page, idx) => (
                      <button 
                        key={idx}
                        className={`h-9 w-9 rounded-lg flex items-center justify-center text-[13px] font-bold transition-all ${
                          page === 1 ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/10' : 'text-[#64748B] hover:bg-white border border-transparent hover:border-border'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-white hover:text-primary transition-all shadow-sm"><ChevronRight className="h-4 w-4" /></button>
                 </div>
              </div>
            </div>

          </div>
          <div className="h-12" /> {/* Layout Spacer */}
          <DashboardFooter />
        </main>
      </div>
    </div>
  )
}

function Wrench(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}
