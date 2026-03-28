"use client"

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
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
  Smartphone
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

// --- MOCK DATA ---
const revenueData = [
  { month: 'Jan', revenue: 45000, repairs: 120 },
  { month: 'Feb', revenue: 52000, repairs: 145 },
  { month: 'Mar', revenue: 48000, repairs: 132 },
  { month: 'Apr', revenue: 61000, repairs: 168 },
  { month: 'May', revenue: 55000, repairs: 154 },
  { month: 'Jun', revenue: 67000, repairs: 189 },
  { month: 'Jul', revenue: 72000, repairs: 210 },
  { month: 'Aug', revenue: 68000, repairs: 198 },
  { month: 'Sep', revenue: 75000, repairs: 225 },
  { month: 'Oct', revenue: 82000, repairs: 245 },
  { month: 'Nov', revenue: 79000, repairs: 232 },
  { month: 'Dec', revenue: 91000, repairs: 268 },
]

const statusDistribution = [
  { name: 'Completed', value: 65, color: '#10B981' },
  { name: 'In Progress', value: 20, color: '#4F46E5' },
  { name: 'Pending', value: 10, color: '#F59E0B' },
  { name: 'Cancelled', value: 5, color: '#EF4444' },
]

const technicianPerformance = [
  { name: 'David Chen', completed: 85, satisfaction: 4.8 },
  { name: 'James Miller', completed: 72, satisfaction: 4.9 },
  { name: 'Alex Kumar', completed: 68, satisfaction: 4.7 },
  { name: 'Ryan Thomas', completed: 62, satisfaction: 4.6 },
  { name: 'Kevin Lee', completed: 58, satisfaction: 4.8 },
]

const brandDistribution = [
  { name: 'Apple', value: 45, color: '#4F46E5' },
  { name: 'Samsung', value: 30, color: '#10B981' },
  { name: 'Google', value: 15, color: '#F59E0B' },
  { name: 'Others', value: 10, color: '#94A3B8' },
]

const topServices = [
  { name: 'Screen Replacement', count: 124, revenue: 'Rs. 558,000' },
  { name: 'Battery Swap', count: 86, revenue: 'Rs. 172,000' },
  { name: 'Charging Port Fix', count: 54, revenue: 'Rs. 64,800' },
  { name: 'Water Damage', count: 32, revenue: 'Rs. 128,000' },
  { name: 'Back Glass Repair', count: 28, revenue: 'Rs. 112,000' },
]

const recentReports = [
  { id: 1, title: 'Monthly Revenue Audit', date: 'Mar 28, 2026', type: 'Financial', author: 'Admin User', status: 'Ready' },
  { id: 2, title: 'Technician Efficiency metrics', date: 'Mar 25, 2026', type: 'Performance', author: 'System Gen', status: 'Ready' },
  { id: 3, title: 'Inventory Turnover Analysis', date: 'Mar 20, 2026', type: 'Inventory', author: 'Admin User', status: 'Archived' },
  { id: 4, title: 'Customer Satisfaction Survey', date: 'Mar 15, 2026', type: 'Feedback', author: 'System Gen', status: 'Ready' },
  { id: 5, title: 'Hardware Failure Patterns', date: 'Mar 10, 2026', type: 'Technical', author: 'Alex Kumar', status: 'Ready' },
]

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [branch, setBranch] = useState('all')

  // Calculated Stats
  const stats = [
    { label: 'Total Revenue', value: 'Rs. 928,450', change: '+12.5%', isUp: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Repairs', value: '1,284', change: '+8.2%', isUp: true, icon: Wrench, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Avg Satisfaction', value: '4.85/5', change: '-2.1%', isUp: false, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completion Rate', value: '94.2%', change: '+0.5%', isUp: true, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
  ]

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />
      
      <div className="flex flex-1 flex-col ml-[200px] min-w-0">
        <DashboardHeader />

        <main className="flex-1 flex flex-col pt-0 overflow-y-auto">
          <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col">
            
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
                      className={`px-4 py-2 rounded-lg text-[12px] font-bold uppercase transition-all ${
                        timeRange === range ? 'bg-[#4F46E5] text-white shadow-md' : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => alert("Generating unified business report for current period...")}
                  className="h-11 px-5 rounded-xl bg-white border border-border text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-all flex items-center gap-2 shadow-sm"
                >
                  <Download className="h-4 w-4" /> Export All
                </button>
              </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, idx) => (
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
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#4F46E5]" />
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">Revenue</span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-4">
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">Goal</span>
                    </div>
                  </div>
                </div>
                <div className="h-[350px] w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis 
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
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#4F46E5" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorRev)" 
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
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[32px] font-black text-[#0F172A]">85%</span>
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Healthy</span>
                    </div>
                  </div>

                  <div className="w-full mt-8 space-y-3">
                    {statusDistribution.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-[13px] font-bold text-[#475569]">{item.name}</span>
                        </div>
                        <span className="text-[13px] font-black text-[#0F172A]">{item.value}%</span>
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
                            data={brandDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {brandDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-4">
                       {brandDistribution.map((brand, idx) => (
                         <div key={idx} className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-[12px] font-bold">
                               <span className="text-muted-foreground">{brand.name}</span>
                               <span className="text-[#0F172A]">{brand.value}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full rounded-full transition-all duration-500" style={{ width: `${brand.value}%`, backgroundColor: brand.color }} />
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
                    {topServices.map((service, idx) => (
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
                    <BarChart data={technicianPerformance} layout="vertical" margin={{ left: 40, right: 30, top: 0, bottom: 0 }}>
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
                        <button 
                          onClick={() => alert(`Downloading ${report.title}...`)}
                          className="h-8 w-8 rounded-lg bg-white border border-border flex items-center justify-center text-muted-foreground hover:bg-[#4F46E5] hover:text-white hover:border-[#4F46E5] transition-all shadow-sm focus:outline-none"
                        >
                          <Download className="h-4 w-4" />
                        </button>
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
        </main>
      </div>
    </div>
  )
}
