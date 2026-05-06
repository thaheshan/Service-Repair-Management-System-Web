"use client"

import React, { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Wrench, 
  ChevronRight, 
  Download, 
  Calendar, 
  Filter, 
  Printer, 
  PieChart as PieChartIcon, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  FileText,
  Search,
  ChevronLeft,
  Smartphone,
  ChevronDown,
  RefreshCw,
  X,
  Check
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts'
import { DashboardSidebar } from '@/components/admin/dashboard/sidebar'
import { DashboardHeader } from '@/components/admin/dashboard/header'
import { DashboardFooter } from '@/components/admin/dashboard/footer'
import { useGetDashboardAnalyticsQuery } from '@/services/api/dashboardApiSlice'

// --- DYNAMIC MOCK DATA ORCHESTRATION ---
const metricMaps: Record<string, any> = {
  '7d': {
    revenueData: [
      { label: 'Mon', revenue: 4500, repairs: 12 }, { label: 'Tue', revenue: 5200, repairs: 14 },
      { label: 'Wed', revenue: 4800, repairs: 13 }, { label: 'Thu', revenue: 6100, repairs: 16 },
      { label: 'Fri', revenue: 5500, repairs: 15 }, { label: 'Sat', revenue: 8700, repairs: 25 },
      { label: 'Sun', revenue: 4200, repairs: 9 }
    ],
    statusDistribution: [
      { name: 'Completed', value: 75, color: '#10B981' }, { name: 'In Progress', value: 15, color: '#4F46E5' },
      { name: 'Pending', value: 8, color: '#F59E0B' }, { name: 'Cancelled', value: 2, color: '#EF4444' }
    ],
    brandDistribution: [
      { name: 'Apple', value: 50, color: '#4F46E5' }, { name: 'Samsung', value: 25, color: '#10B981' },
      { name: 'Google', value: 15, color: '#F59E0B' }, { name: 'Others', value: 10, color: '#94A3B8' }
    ],
    topServices: [
      { name: 'Screen Replacement', count: 32, revenue: 'Rs. 144,000' }, { name: 'Battery Swap', count: 24, revenue: 'Rs. 48,000' },
      { name: 'Charging Port Fix', count: 14, revenue: 'Rs. 16,800' }, { name: 'Water Damage', count: 5, revenue: 'Rs. 20,000' },
      { name: 'Back Glass Repair', count: 8, revenue: 'Rs. 32,000' }
    ],
    technicianPerformance: [
      { name: 'David Chen', completed: 25, satisfaction: 4.8 }, { name: 'James Miller', completed: 22, satisfaction: 4.9 },
      { name: 'Alex Kumar', completed: 18, satisfaction: 4.7 }, { name: 'Ryan Thomas', completed: 15, satisfaction: 4.6 },
      { name: 'Kevin Lee', completed: 14, satisfaction: 4.8 }
    ],
    stats: [
      { label: 'Total Revenue', value: 'Rs. 39,000', change: '+5.2%', isUp: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Active Repairs', value: '104', change: '+2.1%', isUp: true, icon: Wrench, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Avg Satisfaction', value: '4.78/5', change: '-0.1%', isUp: false, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Completion Rate', value: '96.2%', change: '+1.5%', isUp: true, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    ]
  },
  '30d': {
    revenueData: [
      { label: 'W1', revenue: 35000, repairs: 90 }, { label: 'W2', revenue: 42000, repairs: 110 },
      { label: 'W3', revenue: 38000, repairs: 95 }, { label: 'W4', revenue: 51000, repairs: 130 }
    ],
    statusDistribution: [
      { name: 'Completed', value: 65, color: '#10B981' }, { name: 'In Progress', value: 20, color: '#4F46E5' },
      { name: 'Pending', value: 10, color: '#F59E0B' }, { name: 'Cancelled', value: 5, color: '#EF4444' }
    ],
    brandDistribution: [
      { name: 'Apple', value: 45, color: '#4F46E5' }, { name: 'Samsung', value: 30, color: '#10B981' },
      { name: 'Google', value: 15, color: '#F59E0B' }, { name: 'Others', value: 10, color: '#94A3B8' }
    ],
    topServices: [
      { name: 'Screen Replacement', count: 124, revenue: 'Rs. 558,000' }, { name: 'Battery Swap', count: 86, revenue: 'Rs. 172,000' },
      { name: 'Charging Port Fix', count: 54, revenue: 'Rs. 64,800' }, { name: 'Water Damage', count: 32, revenue: 'Rs. 128,000' },
      { name: 'Back Glass Repair', count: 28, revenue: 'Rs. 112,000' }
    ],
    technicianPerformance: [
      { name: 'David Chen', completed: 85, satisfaction: 4.8 }, { name: 'James Miller', completed: 72, satisfaction: 4.9 },
      { name: 'Alex Kumar', completed: 68, satisfaction: 4.7 }, { name: 'Ryan Thomas', completed: 62, satisfaction: 4.6 },
      { name: 'Kevin Lee', completed: 58, satisfaction: 4.8 }
    ],
    stats: [
      { label: 'Total Revenue', value: 'Rs. 166,000', change: '+12.5%', isUp: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Active Repairs', value: '425', change: '+8.2%', isUp: true, icon: Wrench, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Avg Satisfaction', value: '4.85/5', change: '+0.1%', isUp: true, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Completion Rate', value: '94.2%', change: '+0.5%', isUp: true, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    ]
  },
  'ytd': {
    revenueData: [
      { label: 'Jan', revenue: 145000, repairs: 320 }, { label: 'Feb', revenue: 162000, repairs: 345 },
      { label: 'Mar', revenue: 218000, repairs: 432 }, { label: 'Apr', revenue: 191000, repairs: 410 },
      { label: 'May', revenue: 185000, repairs: 390 }, { label: 'Jun', revenue: 227000, repairs: 489 },
      { label: 'Jul', revenue: 252000, repairs: 510 }, { label: 'Aug', revenue: 238000, repairs: 498 },
      { label: 'Sep', revenue: 275000, repairs: 525 }
    ],
    statusDistribution: [
      { name: 'Completed', value: 85, color: '#10B981' }, { name: 'In Progress', value: 5, color: '#4F46E5' },
      { name: 'Pending', value: 4, color: '#F59E0B' }, { name: 'Cancelled', value: 6, color: '#EF4444' }
    ],
    brandDistribution: [
      { name: 'Apple', value: 40, color: '#4F46E5' }, { name: 'Samsung', value: 35, color: '#10B981' },
      { name: 'Xiaomi', value: 12, color: '#38BDF8' }, { name: 'Google', value: 8, color: '#F59E0B' },
      { name: 'Others', value: 5, color: '#94A3B8' }
    ],
    topServices: [
      { name: 'Screen Replacement', count: 1240, revenue: 'Rs. 5,580,000' }, { name: 'Battery Swap', count: 860, revenue: 'Rs. 1,720,000' },
      { name: 'Charging Port Fix', count: 540, revenue: 'Rs. 648,000' }, { name: 'Water Damage', count: 320, revenue: 'Rs. 1,280,000' },
      { name: 'Data Recovery', count: 180, revenue: 'Rs. 1,620,000' }
    ],
    technicianPerformance: [
      { name: 'David Chen', completed: 850, satisfaction: 4.8 }, { name: 'James Miller', completed: 720, satisfaction: 4.85 },
      { name: 'Alex Kumar', completed: 680, satisfaction: 4.7 }, { name: 'Ryan Thomas', completed: 620, satisfaction: 4.75 },
      { name: 'Kevin Lee', completed: 580, satisfaction: 4.9 }
    ],
    stats: [
      { label: 'Total Revenue', value: 'Rs. 1,893,000', change: '+22.5%', isUp: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Active Repairs', value: '3,919', change: '+14.2%', isUp: true, icon: Wrench, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Avg Satisfaction', value: '4.88/5', change: '+1.1%', isUp: true, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Completion Rate', value: '98.2%', change: '+3.5%', isUp: true, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    ]
  },
  'all': {
    revenueData: [
      { label: '2023', revenue: 1450000, repairs: 3200 }, { label: '2024', revenue: 1820000, repairs: 4145 },
      { label: '2025', revenue: 2180000, repairs: 5432 }, { label: '2026', revenue: 1893000, repairs: 3919 }
    ],
    statusDistribution: [
      { name: 'Completed', value: 92, color: '#10B981' }, { name: 'In Progress', value: 2, color: '#4F46E5' },
      { name: 'Pending', value: 2, color: '#F59E0B' }, { name: 'Cancelled', value: 4, color: '#EF4444' }
    ],
    brandDistribution: [
      { name: 'Apple', value: 38, color: '#4F46E5' }, { name: 'Samsung', value: 36, color: '#10B981' },
      { name: 'Xiaomi', value: 14, color: '#38BDF8' }, { name: 'Google', value: 7, color: '#F59E0B' },
      { name: 'Others', value: 5, color: '#94A3B8' }
    ],
    topServices: [
      { name: 'Screen Replacement', count: 4240, revenue: 'Rs. 19,080,000' }, { name: 'Battery Swap', count: 3260, revenue: 'Rs. 6,520,000' },
      { name: 'Charging Port Fix', count: 2140, revenue: 'Rs. 2,568,000' }, { name: 'Water Damage', count: 1320, revenue: 'Rs. 5,280,000' },
      { name: 'Motherboard Repair', count: 880, revenue: 'Rs. 13,200,000' }
    ],
    technicianPerformance: [
      { name: 'David Chen', completed: 3450, satisfaction: 4.85 }, { name: 'James Miller', completed: 2720, satisfaction: 4.88 },
      { name: 'Alex Kumar', completed: 2680, satisfaction: 4.75 }, { name: 'Ryan Thomas', completed: 2120, satisfaction: 4.78 },
      { name: 'Sarah Jenkins', completed: 1980, satisfaction: 4.95 }
    ],
    stats: [
      { label: 'Total Revenue', value: 'Rs. 7,343,000', change: '+118.5%', isUp: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Active Repairs', value: '16,696', change: '+84.2%', isUp: true, icon: Wrench, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Avg Satisfaction', value: '4.87/5', change: '+2.1%', isUp: true, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Completion Rate', value: '98.9%', change: '+5.5%', isUp: true, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    ]
  }
}

const recentReports = [
  { id: 1, title: 'Monthly Revenue Audit', date: 'Mar 28, 2026', type: 'Financial', author: 'Admin User', status: 'Ready' },
  { id: 2, title: 'Technician Efficiency metrics', date: 'Mar 25, 2026', type: 'Performance', author: 'System Gen', status: 'Ready' },
  { id: 3, title: 'Inventory Turnover Analysis', date: 'Mar 20, 2026', type: 'Inventory', author: 'Admin User', status: 'Archived' },
  { id: 4, title: 'Customer Satisfaction Survey', date: 'Mar 15, 2026', type: 'Feedback', author: 'System Gen', status: 'Ready' },
  { id: 5, title: 'Hardware Failure Patterns', date: 'Mar 10, 2026', type: 'Technical', author: 'Alex Kumar', status: 'Ready' },
]

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const hiddenReportRef = useRef<HTMLDivElement>(null)

  const { data: dashResponse } = useGetDashboardAnalyticsQuery({});
  const apiStats = dashResponse?.data?.stats;

  // Grab chart data based on selected filter (period-bucketed mock shapes)
  const currentData = metricMaps[timeRange] || metricMaps['30d']

  // Override stats with live values when available
  const liveStats = useMemo(() => [
    {
      label: 'Total Revenue',
      value: apiStats ? `Rs. ${(apiStats.totalRevenue ?? 0).toLocaleString()}` : currentData.stats[0].value,
      change: apiStats?.revenueChange ?? currentData.stats[0].change,
      isUp: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50'
    },
    {
      label: 'Total Repairs',
      value: apiStats ? String(apiStats.totalRepairs ?? 0) : currentData.stats[1].value,
      change: apiStats?.repairChange ?? currentData.stats[1].change,
      isUp: true, icon: Wrench, color: 'text-indigo-600', bg: 'bg-indigo-50'
    },
    {
      label: 'Pending Repairs',
      value: apiStats ? String(apiStats.pendingRepairs ?? 0) : currentData.stats[2].value,
      change: 'Action required',
      isUp: false, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50'
    },
    {
      label: 'Active Technicians',
      value: apiStats ? String(apiStats.activeTechnicians ?? 0) : currentData.stats[3].value,
      change: 'Currently assigned',
      isUp: true, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50'
    },
  ], [apiStats, currentData]);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    setIsExportOpen(false)
    try {
      const element = hiddenReportRef.current
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
      pdf.save(`SRM_Analytics_Report_${timeRange.toUpperCase()}__${new Date().toISOString().slice(0,10)}.pdf`)
    } catch (err) {
      console.error("PDF generation failed:", err)
      alert("Error: Could not generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleExportCSV = () => {
    alert("Simulating CSV Download for current period metrics.")
    setIsExportOpen(false)
  }

  const handleSpecificDownload = async (title: string, format: 'pdf' | 'csv') => {
    setOpenDropdownId(null)
    if (format === 'csv') {
      alert(`Success! Simulated CSV download for: ${title}`)
      return
    }
    
    // PDF Logic for specific report (re-uses existing hidden target for simplicity but changes filename)
    setIsGeneratingPDF(true)
    try {
      const element = hiddenReportRef.current
      if (!element) return

      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
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
      pdf.save(`SRM_${title.replace(/\s+/g, '_')}__${new Date().toISOString().slice(0,10)}.pdf`)
    } catch (err) {
      console.error("PDF generation failed:", err)
      alert("Error: Could not generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />
      
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        <DashboardHeader />

        <main className="flex-1 flex flex-col pt-0 overflow-y-auto">
          <div className="w-full max-w-[1280px] px-4 lg:px-8 py-6 lg:py-8 mx-auto flex flex-col">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-2">
                  <Link href="/admin/dashboard" className="hover:text-foreground transition-colors cursor-pointer text-[#4F46E5]">Dashboard</Link>
                  <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                  <span className="text-[#0F172A]">Reports & Analytics</span>
                </div>
                <h1 className="text-[32px] font-black text-[#0F172A] tracking-tight leading-none mb-2">Analytics Center</h1>
                <p className="text-[14px] text-muted-foreground font-medium">Real-time performance metrics and business intelligence.</p>
              </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white border border-border rounded-xl p-1 shadow-sm">
                    {['7d', '30d', 'ytd', 'all'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-4 py-2 rounded-lg text-[12px] font-bold uppercase transition-all focus:outline-none ${
                          timeRange === range ? 'bg-[#4F46E5] text-white shadow-md' : 'text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setIsExportOpen(!isExportOpen)}
                      className="h-11 px-5 rounded-xl bg-white border border-border text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-all flex items-center gap-2 shadow-sm focus:outline-none"
                    >
                      {isGeneratingPDF ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Export All <ChevronDown className="h-4 w-4" />
                    </button>
                    {isExportOpen && (
                      <div className="absolute top-13 right-0 w-48 bg-white rounded-xl shadow-xl border border-border py-1 z-[100] animate-in fade-in slide-in-from-top-2">
                        <button onClick={handleDownloadPDF} className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-colors border-b border-border/50"><Download className="h-4 w-4 text-[#4F46E5]" /> Download as PDF</button>
                        <button onClick={handleExportCSV} className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-colors"><Download className="h-4 w-4 text-[#10B981]" /> Download as CSV</button>
                      </div>
                    )}
                  </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {liveStats.map((stat: any, idx: number) => (
                <div key={idx} className="bg-white p-6 rounded-[24px] border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-[12px] font-black px-2 py-1 rounded-lg ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {stat.isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-muted-foreground text-[14px] font-bold mb-1">{stat.label}</h3>
                  <div className="text-[26px] font-black text-[#0F172A] tracking-tighter leading-none">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Main Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Revenue Trends */}
              <div className="lg:col-span-2 bg-white rounded-[24px] border border-border shadow-sm p-8 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-[18px] font-black text-[#0F172A] tracking-tight">Revenue Stream Analysis</h2>
                    <p className="text-[13px] text-muted-foreground font-medium">Monthly income vs repair volume trajectory</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#4F46E5]" />
                        <span className="text-[11px] font-bold text-muted-foreground uppercase">Revenue</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        <span className="text-[11px] font-bold text-muted-foreground uppercase">Repair Volume</span>
                      </div>
                    </div>
                    <select 
                      value={timeRange} 
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="h-9 px-3 rounded-lg bg-[#F8FAFC] border border-border text-[12px] font-bold text-[#0F172A] outline-none focus:ring-2 focus:ring-[#4F46E5]/20 cursor-pointer"
                    >
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="ytd">Year to Date / Monthly</option>
                      <option value="all">Overall Trend / Yearly</option>
                    </select>
                  </div>
                </div>
                <div className="h-[350px] w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashResponse?.data?.revenueData || currentData.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis 
                        dataKey={dashResponse?.data?.revenueData ? "date" : "label"} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis 
                        yAxisId="left"
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                        tickFormatter={(value) => `Rs.${value/1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                        itemStyle={{ color: '#0F172A', fontSize: '12px', fontWeight: 'bold' }}
                        labelStyle={{ color: '#64748B', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}
                      />
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#4F46E5" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorRev)" 
                        name="Revenue"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="bg-white rounded-[24px] border border-border shadow-sm p-8 flex flex-col">
                <h2 className="text-[18px] font-black text-[#0F172A] tracking-tight mb-1">Repair Outcomes</h2>
                <p className="text-[13px] text-muted-foreground font-medium mb-8">Status distribution for current period</p>
                
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="h-[250px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashResponse?.data?.statusData || currentData.statusDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {(dashResponse?.data?.statusData || currentData.statusDistribution).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#94A3B8'} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[24px] font-black text-[#0F172A]">
                        {dashResponse?.data?.statusData?.[0]?.value || currentData.statusDistribution[0].value}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Completed</span>
                    </div>
                  </div>

                  <div className="w-full mt-8 space-y-3">
                    {(dashResponse?.data?.statusData || currentData.statusDistribution).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || '#94A3B8' }} />
                          <span className="text-[13px] font-bold text-[#475569]">{item.name}</span>
                        </div>
                        <span className="text-[13px] font-black text-[#0F172A]">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* NEW SECTION: Market & Service Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Brand Distribution */}
              <div className="bg-white rounded-[24px] border border-border shadow-sm p-8 flex flex-col">
                 <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-[18px] font-black text-[#0F172A] tracking-tight">Market Share</h2>
                      <p className="text-[13px] text-muted-foreground font-medium">Device brands serviced in this period</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-inner">
                      <Smartphone className="h-5 w-5" />
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-8">
                    <div className="h-[200px] w-[200px] shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashResponse?.data?.brandData || currentData.brandDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {(dashResponse?.data?.brandData || currentData.brandDistribution).map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color || '#94A3B8'} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-4">
                       {(dashResponse?.data?.brandData || currentData.brandDistribution).map((brand: any, idx: number) => (
                         <div key={idx} className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-[12px] font-bold">
                               <span className="text-muted-foreground">{brand.name}</span>
                               <span className="text-[#0F172A]">{brand.value}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full rounded-full transition-all duration-500" style={{ width: `${brand.value}%`, backgroundColor: brand.color || '#94A3B8' }} />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Top Services Table */}
              <div className="bg-white rounded-[24px] border border-border shadow-sm p-8 flex flex-col">
                 <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-[18px] font-black text-[#0F172A] tracking-tight">Service Popularity</h2>
                      <p className="text-[13px] text-muted-foreground font-medium">High-volume repair categories</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center shadow-inner">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                 </div>

                 <div className="space-y-4">
                    {(dashResponse?.data?.topServices || currentData.topServices).map((service: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-border/50 group hover:border-[#4F46E5]/20 transition-all">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[12px] font-black text-[#0F172A] shadow-sm">
                              {idx + 1}
                           </div>
                           <div>
                             <div className="text-[13.5px] font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors">{service.name}</div>
                             <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{service.count} Repairs</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-[13px] font-black text-[#0F172A]">{service.revenue}</div>
                           <div className="text-[10px] font-bold text-emerald-600">Top Rated</div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Technician Productivity */}
              <div className="bg-white rounded-[24px] border border-border shadow-sm p-8 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-[18px] font-black text-[#0F172A] tracking-tight">Staff Proficiency</h2>
                    <p className="text-[13px] text-muted-foreground font-medium">Repairs completed vs satisfaction index</p>
                  </div>
                  <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#F8FAFC] text-muted-foreground hover:text-[#4F46E5] transition-colors"><MoreHorizontal className="h-5 w-5" /></button>
                </div>
                
                <div className="h-[300px] w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData.technicianPerformance} layout="vertical" margin={{ left: 40, right: 30, top: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#334155', fontSize: 13, fontWeight: 700 }}
                        width={100}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '8px' }}
                        cursor={{ fill: '#F1F5F9', radius: 8 }}
                      />
                      <Bar 
                        dataKey="completed" 
                        fill="#4F46E5" 
                        radius={[0, 8, 8, 0]} 
                        barSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Data Export Ledger */}
              <div className="bg-white rounded-[24px] border border-border shadow-sm p-8 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-[18px] font-black text-[#0F172A] tracking-tight">Document Ledger</h2>
                    <p className="text-[13px] text-muted-foreground font-medium">Recent generated business reports</p>
                  </div>
                  <Link href="#" className="text-[12px] font-bold text-[#4F46E5] hover:underline uppercase tracking-widest">View Archives</Link>
                </div>

                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] hover:border-[#4F46E5]/20 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white border border-border flex items-center justify-center text-muted-foreground group-hover:text-[#4F46E5] group-hover:bg-[#4F46E5]/5 transition-colors">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-[#0F172A] leading-none mb-1 group-hover:text-[#4F46E5] transition-colors">{report.title}</div>
                          <div className="flex items-center gap-2">
                             <span className="text-[11px] font-bold text-muted-foreground uppercase">{report.type}</span>
                             <span className="h-1 w-1 rounded-full bg-border" />
                             <span className="text-[11px] font-medium text-muted-foreground">{report.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          report.status === 'Ready' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {report.status}
                        </span>
                        <div className="relative">
                          <button 
                            onClick={() => setOpenDropdownId(openDropdownId === report.id ? null : report.id)}
                            className="h-8 w-8 rounded-lg bg-white border border-border flex items-center justify-center text-muted-foreground hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5] transition-all shadow-sm focus:outline-none"
                          >
                            {isGeneratingPDF && openDropdownId === report.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                          </button>
                          {openDropdownId === report.id && (
                             <div className="absolute right-0 top-10 w-48 bg-white border border-border rounded-xl shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2">
                                <button onClick={() => handleSpecificDownload(report.title, 'pdf')} className="flex items-center gap-2 px-4 py-2 hover:bg-muted w-full text-left text-[13px] font-bold text-[#0F172A] border-b border-border/50">
                                  <Download className="h-4 w-4 text-[#4F46E5]" /> Export as PDF
                                </button>
                                <button onClick={() => handleSpecificDownload(report.title, 'csv')} className="flex items-center gap-2 px-4 py-2 hover:bg-muted w-full text-left text-[13px] font-bold text-[#0F172A]">
                                  <Download className="h-4 w-4 text-[#10B981]" /> Export as CSV
                                </button>
                             </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>{/* End Content Constraint */}

          {/* ENOUGH SPACE SPACER */}
          <div className="h-12" />
          
          <DashboardFooter />
          
          {/* 🛠️ INVISIBLE PDF RENDER TARGET FOR BUSINESS REPORT */}
          <div className="fixed -left-[4000px] pointer-events-none opacity-0 select-none overflow-hidden h-0 w-0">
             <div 
               ref={hiddenReportRef}
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
                          <p className="flex items-center gap-2 text-[#4F46E5]"><PieChartIcon className="h-4 w-4" /> Comprehensive Performance Audit</p>
                          <p>Time Horizon: {timeRange.toUpperCase()} Analytics</p>
                          <p>Reference Code: BI-{new Date().getTime().toString().slice(-6)}</p>
                       </div>
                    </div>
                    <div className="text-right text-[12px] text-slate-400 font-black uppercase tracking-widest leading-relaxed pt-2">
                          <p>Executive Summary</p>
                          <p>Generated by Admin Systems</p>
                          <p className="text-[#4F46E5] mt-1 italic underline underline-offset-4 decoration-slate-200">{new Date().toLocaleString()}</p>
                    </div>
                </div>

                {/* KPI HIGHLIGHTS */}
                <div className="grid grid-cols-4 gap-6 mb-12">
                   {currentData.stats.map((s: any, i: number) => (
                      <div key={i} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col">
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">{s.label}</p>
                         <p className="text-[24px] font-black text-[#0F172A] leading-none mb-2">{s.value}</p>
                         <p className={`text-[12px] font-bold ${s.isUp ? 'text-emerald-600' : 'text-red-500'}`}>{s.isUp ? '↗' : '↘'} {s.change}</p>
                      </div>
                   ))}
                </div>

                {/* SERVICES BREAKDOWN TABLE */}
                <div className="mb-12">
                   <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-widest mb-4 border-b-2 border-[#0F172A] pb-2">Top Performing Service Categories ({timeRange})</h3>
                   <table className="w-full text-left border-collapse">
                       <thead>
                           <tr className="bg-slate-50 border-b border-slate-200">
                               <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Rank</th>
                               <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Name</th>
                               <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Volume</th>
                               <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Revenue Generated</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                           {currentData.topServices.map((srv: any, i: number) => (
                             <tr key={i}>
                                <td className="px-5 py-3 font-black text-[#0F172A]">#{i+1}</td>
                                <td className="px-5 py-3 font-bold text-[#475569]">{srv.name}</td>
                                <td className="px-5 py-3 font-bold text-[#475569] text-right">{srv.count} Units</td>
                                <td className="px-5 py-3 font-black text-[#10B981] text-right">{srv.revenue}</td>
                             </tr>
                           ))}
                       </tbody>
                   </table>
                </div>

                {/* DEMOGRAPHICS & STAFF INFO */}
                <div className="grid grid-cols-2 gap-8 mb-12">
                   <div>
                       <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-widest mb-4 border-b-2 border-[#0F172A] pb-2">Market Share (Device Brands)</h3>
                       <div className="space-y-2">
                           {currentData.brandDistribution.map((b: any, i: number) => (
                              <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                 <span className="text-[12px] font-bold text-[#475569] flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: b.color }} /> {b.name}
                                 </span>
                                 <span className="text-[12px] font-black text-[#0F172A]">{b.value}%</span>
                              </div>
                           ))}
                       </div>
                   </div>
                   <div>
                       <h3 className="text-[14px] font-black text-[#0F172A] uppercase tracking-widest mb-4 border-b-2 border-[#0F172A] pb-2">Technician Proficiency Index</h3>
                       <div className="space-y-2">
                           {currentData.technicianPerformance.map((t: any, i: number) => (
                              <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                 <span className="text-[12px] font-bold text-[#475569]">{t.name}</span>
                                 <div className="text-right">
                                    <span className="text-[12px] font-black text-[#0F172A] block leading-none">{t.completed} Completed</span>
                                    <span className="text-[10px] font-bold text-emerald-600 block leading-none mt-1">★ {t.satisfaction}/5.0</span>
                                 </div>
                              </div>
                           ))}
                       </div>
                   </div>
                </div>

                {/* FOOTER */}
                <div className="mt-auto pt-12 border-t border-slate-100 border-dashed">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                       This document is highly confidential and intended for authorized personnel only. 
                       <br/>Generated securely via SRM Application Engine.
                    </p>
                </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  )
}
