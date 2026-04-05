"use client"

import { useState, useMemo, useEffect } from "react"
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

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

const initialRepairs: RepairRow[] = [
  { id: "1",  reference: "#REP-2026-001234", customer: { name: "Ahmed Hassan",       phone: "+94 77 123 4567" }, device: { type: "phone",   name: "iPhone 13 Pro",       specs: "Space Gray, 256GB"    }, issue: "Screen cracked, touch unresponsive in top right",           status: "In Progress", priority: "Urgent",  technician: { name: "John Smith",    initials: "JS", bg: "bg-[#4F46E5]" }, amount: "Rs. 8,500",  dueDate: { text: "Today",               isOverdue: false }, createdAt: daysAgo(0)  },
  { id: "2",  reference: "#REP-2026-001233", customer: { name: "Sarah Perera",       phone: "+94 71 987 6543" }, device: { type: "tablet",  name: "iPad Air 5th Gen",    specs: "Silver, 64GB"         }, issue: "Battery draining quickly, won't charge properly",            status: "Pending",     priority: "High",    technician: null,                                                   amount: "Rs. 6,200",  dueDate: { text: "Tomorrow",             isOverdue: false }, createdAt: daysAgo(0)  },
  { id: "3",  reference: "#REP-2026-001232", customer: { name: "David Fernando",     phone: "+94 76 234 5678" }, device: { type: "laptop",  name: `MacBook Pro 14"`,     specs: "M1 Pro, 512GB"        }, issue: "Keyboard keys sticking, trackpad not clicking properly",      status: "In Progress", priority: "Medium",  technician: { name: "Mike Chen",     initials: "MC", bg: "bg-[#F59E0B]" }, amount: "Rs. 12,500", dueDate: { text: "Jan 20, 2026",         isOverdue: false }, createdAt: daysAgo(1)  },
  { id: "4",  reference: "#REP-2026-001231", customer: { name: "Nisha Silva",        phone: "+94 75 345 6789" }, device: { type: "phone",   name: "Samsung Galaxy S23",  specs: "Phantom Black, 128GB" }, issue: "Water damage, phone won't turn on",                          status: "On Hold",     priority: "Low",     technician: { name: "Tom Wilson",    initials: "TW", bg: "bg-[#10B981]" }, amount: "Rs. 15,000", dueDate: { text: "Overdue by 2 days",    isOverdue: true  }, createdAt: daysAgo(2)  },
  { id: "5",  reference: "#REP-2026-001230", customer: { name: "Raj Jayawardena",    phone: "+94 72 456 7890" }, device: { type: "console", name: "PlayStation 5",        specs: "Standard Edition"     }, issue: "Disc drive not reading games, making loud noise",            status: "In Progress", priority: "Medium",  technician: { name: "Alex Kumar",    initials: "AK", bg: "bg-[#6366F1]" }, amount: "Rs. 9,800",  dueDate: { text: "Jan 18, 2026",         isOverdue: false }, createdAt: daysAgo(2)  },
  { id: "6",  reference: "#REP-2026-001229", customer: { name: "Kamala Wijesinghe",  phone: "+94 77 567 8901" }, device: { type: "phone",   name: "Google Pixel 8 Pro",  specs: "Obsidian, 256GB"      }, issue: "Speaker crackling at high volume, microphone cutting out",   status: "Ready",       priority: "Low",     technician: { name: "Sarah Connor",  initials: "SC", bg: "bg-[#EF4444]" }, amount: "Rs. 4,200",  dueDate: { text: "Ready for pickup",     isOverdue: false }, createdAt: daysAgo(3)  },
  { id: "7",  reference: "#REP-2026-001228", customer: { name: "Priya Bandara",      phone: "+94 71 678 9012" }, device: { type: "tablet",  name: "Samsung Galaxy Tab S8",specs: "Graphite, 128GB"      }, issue: "Touch screen not registering swipes consistently",           status: "Completed",   priority: "Medium",  technician: { name: "John Smith",    initials: "JS", bg: "bg-[#4F46E5]" }, amount: "Rs. 5,500",  dueDate: { text: "Completed",            isOverdue: false }, createdAt: daysAgo(4)  },
  { id: "8",  reference: "#REP-2026-001227", customer: { name: "Malik Rashid",       phone: "+94 76 789 0123" }, device: { type: "laptop",  name: "Dell XPS 15",         specs: "Intel i9, 16GB RAM"   }, issue: "Fan running loudly, overheating during heavy workloads",     status: "Pending",     priority: "High",    technician: null,                                                   amount: "Rs. 7,800",  dueDate: { text: "Mar 30, 2026",         isOverdue: false }, createdAt: daysAgo(5)  },
  { id: "9",  reference: "#REP-2026-001226", customer: { name: "Chanthika De Silva", phone: "+94 75 890 1234" }, device: { type: "phone",   name: "iPhone 15",           specs: "Pink, 128GB"          }, issue: "Face ID not working after drop, front camera smudged",       status: "In Progress", priority: "Urgent",  technician: { name: "Mike Chen",     initials: "MC", bg: "bg-[#F59E0B]" }, amount: "Rs. 11,200", dueDate: { text: "Today",               isOverdue: false }, createdAt: daysAgo(6)  },
  { id: "10", reference: "#REP-2026-001225", customer: { name: "Roshan Navarathne",  phone: "+94 72 901 2345" }, device: { type: "console", name: "Xbox Series X",        specs: "1TB SSD"              }, issue: "Controller disconnecting randomly during gameplay",           status: "Ready",       priority: "Low",     technician: { name: "Tom Wilson",    initials: "TW", bg: "bg-[#10B981]" }, amount: "Rs. 3,500",  dueDate: { text: "Ready for pickup",     isOverdue: false }, createdAt: daysAgo(8)  },
  { id: "11", reference: "#REP-2026-001224", customer: { name: "Fathima Rifka",      phone: "+94 77 012 3456" }, device: { type: "phone",   name: "Samsung Galaxy A54",  specs: "Awesome Violet, 256GB"}, issue: "Back camera blurry, autofocus not working",                  status: "Completed",   priority: "Medium",  technician: { name: "Alex Kumar",    initials: "AK", bg: "bg-[#6366F1]" }, amount: "Rs. 6,800",  dueDate: { text: "Completed",            isOverdue: false }, createdAt: daysAgo(10) },
  { id: "12", reference: "#REP-2026-001223", customer: { name: "Nilusha Perera",     phone: "+94 71 234 5678" }, device: { type: "laptop",  name: "HP Spectre x360",     specs: "Core i7, 512GB SSD"   }, issue: "WiFi adapter not connecting, dropping signal frequently",    status: "Pending",     priority: "High",    technician: null,                                                   amount: "Rs. 5,200",  dueDate: { text: "Mar 31, 2026",         isOverdue: false }, createdAt: daysAgo(12) },
  { id: "13", reference: "#REP-2026-001222", customer: { name: "Isuru Pathirana",    phone: "+94 76 345 6789" }, device: { type: "phone",   name: "iPhone 14",           specs: "Midnight, 256GB"      }, issue: "No cellular signal, SIM card not detected",                 status: "In Progress", priority: "Urgent",  technician: { name: "Sarah Connor",  initials: "SC", bg: "bg-[#EF4444]" }, amount: "Rs. 9,500",  dueDate: { text: "Today",               isOverdue: false }, createdAt: daysAgo(0)  },
  { id: "14", reference: "#REP-2026-001221", customer: { name: "Tharushi Senanayake",phone: "+94 75 456 7890" }, device: { type: "tablet",  name: "iPad Pro 12.9",       specs: "Space Gray, 512GB"    }, issue: "Display flickering and showing horizontal lines",            status: "Pending",     priority: "High",    technician: { name: "John Smith",    initials: "JS", bg: "bg-[#4F46E5]" }, amount: "Rs. 13,000", dueDate: { text: "Apr 2, 2026",          isOverdue: false }, createdAt: daysAgo(1)  },
  { id: "15", reference: "#REP-2026-001220", customer: { name: "Dinesh Gunawardena", phone: "+94 72 567 8901" }, device: { type: "laptop",  name: "Lenovo ThinkPad X1",  specs: "Core i5, 8GB RAM"     }, issue: "Hinge broken, screen falling backwards when opened",         status: "On Hold",     priority: "Medium",  technician: { name: "Mike Chen",     initials: "MC", bg: "bg-[#F59E0B]" }, amount: "Rs. 8,200",  dueDate: { text: "Waiting for parts",    isOverdue: false }, createdAt: daysAgo(2)  },
  { id: "16", reference: "#REP-2026-001219", customer: { name: "Sanduni Rathnayake", phone: "+94 77 678 9012" }, device: { type: "phone",   name: "OnePlus 11",          specs: "Titan Black, 256GB"   }, issue: "Charging port damaged, wireless charging intermittent",      status: "Ready",       priority: "Low",     technician: { name: "Tom Wilson",    initials: "TW", bg: "bg-[#10B981]" }, amount: "Rs. 4,500",  dueDate: { text: "Ready for pickup",     isOverdue: false }, createdAt: daysAgo(3)  },
  { id: "17", reference: "#REP-2026-001218", customer: { name: "Chamara Dissanayake",phone: "+94 71 789 0123" }, device: { type: "console", name: "Nintendo Switch",      specs: "OLED Model"           }, issue: "Joy-Con drift issue, left stick moving without input",        status: "Completed",   priority: "Low",     technician: { name: "Alex Kumar",    initials: "AK", bg: "bg-[#6366F1]" }, amount: "Rs. 3,800",  dueDate: { text: "Completed",            isOverdue: false }, createdAt: daysAgo(4)  },
  { id: "18", reference: "#REP-2026-001217", customer: { name: "Lakmini Fernando",   phone: "+94 76 890 1234" }, device: { type: "phone",   name: "Xiaomi 13 Pro",       specs: "Ceramic Black, 512GB" }, issue: "Screen has burn-in and ghost images after OLED issue",       status: "In Progress", priority: "High",    technician: { name: "Sarah Connor",  initials: "SC", bg: "bg-[#EF4444]" }, amount: "Rs. 14,000", dueDate: { text: "Apr 1, 2026",          isOverdue: false }, createdAt: daysAgo(5)  },
  { id: "19", reference: "#REP-2026-001216", customer: { name: "Kasun Perera",       phone: "+94 75 901 2345" }, device: { type: "laptop",  name: "ASUS ROG Zephyrus",   specs: "RTX 4080, 32GB"       }, issue: "GPU artifacts on display, crashing during gaming sessions",  status: "Pending",     priority: "Urgent",  technician: null,                                                   amount: "Rs. 22,000", dueDate: { text: "Mar 29, 2026",         isOverdue: true  }, createdAt: daysAgo(1)  },
  { id: "20", reference: "#REP-2026-001215", customer: { name: "Malsha Wickrama",    phone: "+94 72 012 3456" }, device: { type: "tablet",  name: "Samsung Galaxy Tab A8",specs: "Silver, 32GB"         }, issue: "Won't boot past Samsung logo screen, bootloop issue",        status: "On Hold",     priority: "Medium",  technician: { name: "John Smith",    initials: "JS", bg: "bg-[#4F46E5]" }, amount: "Rs. 4,800",  dueDate: { text: "Waiting for parts",    isOverdue: false }, createdAt: daysAgo(6)  },
  { id: "21", reference: "#REP-2026-001214", customer: { name: "Nalin Rodrigo",      phone: "+94 77 123 9876" }, device: { type: "phone",   name: "iPhone 12 Mini",      specs: "Blue, 64GB"           }, issue: "Home screen unresponsive, apps crashing on launch",          status: "Completed",   priority: "Low",     technician: { name: "Mike Chen",     initials: "MC", bg: "bg-[#F59E0B]" }, amount: "Rs. 5,000",  dueDate: { text: "Completed",            isOverdue: false }, createdAt: daysAgo(7)  },
  { id: "22", reference: "#REP-2026-001213", customer: { name: "Piumi Siriwardena",  phone: "+94 71 234 9876" }, device: { type: "laptop",  name: "Microsoft Surface Pro 9",specs: "Platinum"          }, issue: "Battery not holding charge, drains in under 2 hours",        status: "In Progress", priority: "High",    technician: { name: "Tom Wilson",    initials: "TW", bg: "bg-[#10B981]" }, amount: "Rs. 9,200",  dueDate: { text: "Apr 3, 2026",          isOverdue: false }, createdAt: daysAgo(8)  },
  { id: "23", reference: "#REP-2026-001212", customer: { name: "Tharindu Jayasena",  phone: "+94 76 345 9876" }, device: { type: "phone",   name: "Google Pixel 7",      specs: "Lemongrass, 128GB"    }, issue: "Bluetooth not working, can't pair with any devices",         status: "Ready",       priority: "Low",     technician: { name: "Alex Kumar",    initials: "AK", bg: "bg-[#6366F1]" }, amount: "Rs. 3,200",  dueDate: { text: "Ready for pickup",     isOverdue: false }, createdAt: daysAgo(9)  },
  { id: "24", reference: "#REP-2026-001211", customer: { name: "Dilini Amaratunga",  phone: "+94 75 456 9876" }, device: { type: "console", name: "PlayStation 4 Pro",    specs: "1TB"                  }, issue: "Overheating and shutting down after 30 minutes of use",      status: "Pending",     priority: "Medium",  technician: null,                                                   amount: "Rs. 6,500",  dueDate: { text: "Apr 4, 2026",          isOverdue: false }, createdAt: daysAgo(10) },
  { id: "25", reference: "#REP-2026-001210", customer: { name: "Ashan Weerasinghe",  phone: "+94 72 567 9876" }, device: { type: "phone",   name: "Samsung Galaxy S22",  specs: "Bora Purple, 256GB"   }, issue: "Display cracked and touch not responding on right side",     status: "In Progress", priority: "Urgent",  technician: { name: "Sarah Connor",  initials: "SC", bg: "bg-[#EF4444]" }, amount: "Rs. 10,800", dueDate: { text: "Today",               isOverdue: false }, createdAt: daysAgo(0)  },
  { id: "26", reference: "#REP-2026-001209", customer: { name: "Nadeeka Jayasinghe", phone: "+94 77 678 1234" }, device: { type: "laptop",  name: "Apple MacBook Air M2",specs: "Midnight, 256GB"      }, issue: "MagSafe port not charging, pinhole reset not working",      status: "On Hold",     priority: "High",    technician: { name: "John Smith",    initials: "JS", bg: "bg-[#4F46E5]" }, amount: "Rs. 11,500", dueDate: { text: "Waiting for parts",    isOverdue: false }, createdAt: daysAgo(2)  },
  { id: "27", reference: "#REP-2026-001208", customer: { name: "Sachini Ekanayake",  phone: "+94 71 789 1234" }, device: { type: "tablet",  name: "Amazon Fire HD 10",   specs: "Denim, 32GB"          }, issue: "Screen badly cracked after drop, touchscreen unresponsive",  status: "Completed",   priority: "Low",     technician: { name: "Mike Chen",     initials: "MC", bg: "bg-[#F59E0B]" }, amount: "Rs. 2,800",  dueDate: { text: "Completed",            isOverdue: false }, createdAt: daysAgo(11) },
  { id: "28", reference: "#REP-2026-001207", customer: { name: "Buddhika Kumara",    phone: "+94 76 890 1235" }, device: { type: "phone",   name: "Nokia G60",           specs: "Pure Black, 128GB"    }, issue: "Rear camera lens cracked, photos blurry and distorted",     status: "Ready",       priority: "Low",     technician: { name: "Tom Wilson",    initials: "TW", bg: "bg-[#10B981]" }, amount: "Rs. 3,900",  dueDate: { text: "Ready for pickup",     isOverdue: false }, createdAt: daysAgo(12) },
  { id: "29", reference: "#REP-2026-001206", customer: { name: "Ruwanthi Madushani", phone: "+94 75 901 1235" }, device: { type: "laptop",  name: "HP Pavilion 15",      specs: "Core i5, 512GB"       }, issue: "Laptop not starting, black screen on power button press",    status: "Pending",     priority: "Urgent",  technician: null,                                                   amount: "Rs. 7,500",  dueDate: { text: "Apr 5, 2026",          isOverdue: false }, createdAt: daysAgo(1)  },
  { id: "30", reference: "#REP-2026-001205", customer: { name: "Ishan Balasuriya",   phone: "+94 72 012 1236" }, device: { type: "phone",   name: "Motorola Edge 40",    specs: "Nebula Black, 256GB"  }, issue: "Power button stuck, volume rocker not working",             status: "In Progress", priority: "Medium",  technician: { name: "Alex Kumar",    initials: "AK", bg: "bg-[#6366F1]" }, amount: "Rs. 4,100",  dueDate: { text: "Apr 6, 2026",          isOverdue: false }, createdAt: daysAgo(3)  },
  { id: "31", reference: "#REP-2026-001204", customer: { name: "Nethmi Abeywickrama",phone: "+94 77 123 1237" }, device: { type: "console", name: "Xbox Series S",        specs: "512GB"                }, issue: "HDMI port damaged, no display output on TV",                 status: "Completed",   priority: "Low",     technician: { name: "Sarah Connor",  initials: "SC", bg: "bg-[#EF4444]" }, amount: "Rs. 4,600",  dueDate: { text: "Completed",            isOverdue: false }, createdAt: daysAgo(4)  },
  { id: "32", reference: "#REP-2026-001203", customer: { name: "Saman Herath",       phone: "+94 71 234 1238" }, device: { type: "phone",   name: "Realme GT Neo 5",     specs: "150W, 256GB"          }, issue: "Charging speed dropped significantly after system update",   status: "In Progress", priority: "High",    technician: { name: "John Smith",    initials: "JS", bg: "bg-[#4F46E5]" }, amount: "Rs. 5,700",  dueDate: { text: "Today",               isOverdue: false }, createdAt: daysAgo(0)  },
  { id: "33", reference: "#REP-2026-001202", customer: { name: "Thilini Ranasinghe", phone: "+94 76 345 1239" }, device: { type: "laptop",  name: "Lenovo IdeaPad 5",    specs: "Ryzen 5, 256GB"       }, issue: "USB ports not recognized after Windows update",             status: "Pending",     priority: "Medium",  technician: null,                                                   amount: "Rs. 4,300",  dueDate: { text: "Apr 7, 2026",          isOverdue: false }, createdAt: daysAgo(2)  },
  { id: "34", reference: "#REP-2026-001201", customer: { name: "Damith Samarawickrama",phone: "+94 75 456 1240"},device: { type: "tablet",  name: "Lenovo Tab P12 Pro",  specs: "Storm Grey, 128GB"    }, issue: "Stylus pen not pairing, drawing app crashing",              status: "On Hold",     priority: "Low",     technician: { name: "Mike Chen",     initials: "MC", bg: "bg-[#F59E0B]" }, amount: "Rs. 6,100",  dueDate: { text: "Waiting for parts",    isOverdue: false }, createdAt: daysAgo(5)  },
  { id: "35", reference: "#REP-2026-001200", customer: { name: "Sanjeewa Gunasekara", phone: "+94 72 567 1241" }, device: { type: "phone",  name: "iPhone 11 Pro Max",   specs: "Midnight Green, 64GB" }, issue: "Battery health at 62%, draining in 4 hours",                status: "Ready",       priority: "Medium",  technician: { name: "Tom Wilson",    initials: "TW", bg: "bg-[#10B981]" }, amount: "Rs. 7,200",  dueDate: { text: "Ready for pickup",     isOverdue: false }, createdAt: daysAgo(7)  },
  { id: "36", reference: "#REP-2026-001199", customer: { name: "Hashini Jayathilaka", phone: "+94 77 678 1242" }, device: { type: "laptop", name: "Acer Predator Helios", specs: "RTX 3070, 16GB"      }, issue: "Keyboard backlight not working, some keys unresponsive",    status: "Completed",   priority: "Low",     technician: { name: "Alex Kumar",    initials: "AK", bg: "bg-[#6366F1]" }, amount: "Rs. 5,900",  dueDate: { text: "Completed",            isOverdue: false }, createdAt: daysAgo(9)  },
  { id: "37", reference: "#REP-2026-001198", customer: { name: "Lahiru Tissera",      phone: "+94 71 789 1243" }, device: { type: "phone",  name: "Vivo V27 Pro",        specs: "Fantastic Purple, 256GB"}, issue: "Front camera showing green lines on photos",               status: "In Progress", priority: "High",    technician: { name: "Sarah Connor",  initials: "SC", bg: "bg-[#EF4444]" }, amount: "Rs. 8,900",  dueDate: { text: "Apr 8, 2026",          isOverdue: false }, createdAt: daysAgo(3)  },
  { id: "38", reference: "#REP-2026-001197", customer: { name: "Menaka Seneviratne",  phone: "+94 76 890 1244" }, device: { type: "console",name: "PlayStation 5 Digital",specs: "White"                }, issue: "Game crashing mid session, corrupted save files",           status: "Pending",     priority: "Medium",  technician: null,                                                   amount: "Rs. 5,400",  dueDate: { text: "Apr 9, 2026",          isOverdue: false }, createdAt: daysAgo(6)  },
  { id: "39", reference: "#REP-2026-001196", customer: { name: "Amasha Nanayakkara",  phone: "+94 75 901 1245" }, device: { type: "phone",  name: "Samsung Galaxy Z Fold 4",specs: "Phantom Black"      }, issue: "Inner fold display crease becoming very visible and dark",  status: "On Hold",     priority: "Urgent",  technician: { name: "John Smith",    initials: "JS", bg: "bg-[#4F46E5]" }, amount: "Rs. 24,000", dueDate: { text: "Waiting for parts",    isOverdue: false }, createdAt: daysAgo(0)  },
  { id: "40", reference: "#REP-2026-001195", customer: { name: "Dinuka Weerakoon",    phone: "+94 72 012 1246" }, device: { type: "laptop", name: "Dell Inspiron 15",    specs: "Core i3, 256GB SSD"   }, issue: "Slow performance, high CPU usage on idle even after reinstall",status: "Completed",  priority: "Low",     technician: { name: "Mike Chen",     initials: "MC", bg: "bg-[#F59E0B]" }, amount: "Rs. 3,100",  dueDate: { text: "Completed",            isOverdue: false }, createdAt: daysAgo(8)  },
]

function getWeekStart(): Date {
  const d = new Date(); d.setDate(d.getDate() - d.getDay()); d.setHours(0,0,0,0); return d
}
function getMonthStart(): Date {
  const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d
}

function matchesDateRange(createdAt: string | undefined, dateRange: DateRangePreset, from: string, to: string): boolean {
  if (!dateRange || !createdAt) return true
  const repairDate = new Date(createdAt); repairDate.setHours(0,0,0,0)
  const now = new Date(); now.setHours(0,0,0,0)
  if (dateRange === "today")      return repairDate.getTime() === now.getTime()
  if (dateRange === "this-week")  return repairDate >= getWeekStart() && repairDate <= now
  if (dateRange === "this-month") return repairDate >= getMonthStart() && repairDate <= now
  if (dateRange === "last-30")    { const c = new Date(now); c.setDate(c.getDate()-30); return repairDate >= c && repairDate <= now }
  if (dateRange === "custom") {
    const f = from ? new Date(from) : null; if (f) f.setHours(0,0,0,0)
    const t = to   ? new Date(to)   : null; if (t) t.setHours(23,59,59,999)
    if (f && repairDate < f) return false
    if (t && repairDate > t) return false
    return true
  }
  return true
}

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<RepairRow[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Always reset to fresh initial data (clears stale localStorage)
    setRepairs(initialRepairs)
    localStorage.setItem("srm_repairs_mock", JSON.stringify(initialRepairs))
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) localStorage.setItem("srm_repairs_mock", JSON.stringify(repairs))
  }, [repairs, isLoaded])

  // UI state
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [activeTab, setActiveTab] = useState("all")

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
  const handleConfirmStatusChange = (_: boolean, newStatus: RepairStatus) => {
    if (pendingStatusUpdate) {
      setRepairs(cur => cur.map(r => r.id === pendingStatusUpdate.repairId ? { ...r, status: newStatus } : r))
    }
    setIsStatusModalOpen(false); setPendingStatusUpdate(null)
  }
  const handleTechnicianChange = (repairId: string, tech: any) => {
    setRepairs(cur => cur.map(r => r.id === repairId ? { ...r, technician: tech } : r))
  }
  const handleDeleteRequest = (id: string, ref: string) => {
    setTaskToDelete({ id, ref }); setIsDeleteModalOpen(true)
  }
  const handleConfirmDelete = () => {
    if (taskToDelete) setRepairs(cur => cur.filter(r => r.id !== taskToDelete.id))
    setIsDeleteModalOpen(false); setTaskToDelete(null)
  }

  // Full filter pipeline (without pagination slice)
  const { allFiltered, isActive } = useMemo(() => {
    let result = repairs

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
    if (activeFilters.statuses.length)     result = result.filter(r => activeFilters.statuses.includes(r.status))
    if (activeFilters.priorities.length)   result = result.filter(r => activeFilters.priorities.includes(r.priority))
    if (activeFilters.deviceTypes.length)  result = result.filter(r => activeFilters.deviceTypes.includes(r.device.type))
    if (activeFilters.technicians.length)  result = result.filter(r => r.technician && activeFilters.technicians.includes(r.technician.name))
    if (activeFilters.dateRange)           result = result.filter(r => matchesDateRange(r.createdAt, activeFilters.dateRange, activeFilters.customDateFrom, activeFilters.customDateTo))

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
            <div className="flex items-center gap-2 text-[13px] text-muted-foreground mb-1.5 font-medium">
              <Link href="/admin/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <span>&gt;</span>
              <span className="text-foreground font-semibold">Repairs</span>
            </div>
            <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight leading-none">Repairs Management</h1>
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
