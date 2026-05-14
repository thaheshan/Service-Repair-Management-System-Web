"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/ui-admin-dashboard/dropdown-menu"
import { useTranslation } from "react-i18next"

const dataByRange: Record<string, { day: string; revenue: number }[]> = {
  "Last 7 days": Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      day: d.toLocaleDateString("en-US", { weekday: 'short' }),
      revenue: Math.floor(Math.random() * 20000) + 20000
    }
  }),
  "Last 14 days": Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    return {
      day: d.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 25000) + 18000
    }
  }),
  "Last 30 days": Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return {
      day: d.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 30000) + 15000
    }
  }),
}

import { useGetDashboardAnalyticsQuery } from "@/services/api/dashboardApiSlice"

const rangeOptions = ["Last 7 days", "Last 14 days", "Last 30 days"]

export function RevenueTrend() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Last 7 days")

  const daysMap: Record<string, number> = {
    "Last 7 days": 7,
    "Last 14 days": 14,
    "Last 30 days": 30
  };

  const { data: response, isLoading } = useGetDashboardAnalyticsQuery(daysMap[selectedRange] || 7);
  const data = response?.data?.revenueData || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-[380px] w-full flex-col rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-8">
          <div className="h-4 w-32 bg-slate-100 animate-pulse rounded" />
          <div className="h-8 w-24 bg-slate-100 animate-pulse rounded" />
        </div>
        <div className="flex-1 w-full bg-slate-50 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h3 className="text-base font-semibold text-foreground">{mounted ? t('dashboard.revenueTrend') : 'Revenue Trend'}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary">
              {mounted ? t(`common.ranges.${selectedRange.replace(/\s+/g, '')}`) || selectedRange : selectedRange}
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {rangeOptions.map((range) => (
              <DropdownMenuItem
                key={range}
                className="cursor-pointer"
                onSelect={() => setSelectedRange(range)}
              >
                {mounted ? t(`common.ranges.${range.replace(/\s+/g, '')}`) || range : range}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Chart */}
      <div className="px-5 pb-3" style={{ height: '300px', width: '100%' }}>
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey={data[0]?.date ? "date" : "day"}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000}k`}
                dx={-5}
              />
              <Tooltip
                formatter={(value: any) => [`Rs. ${Number(value).toLocaleString()}`, mounted ? t('dashboard.stats.revenue') : "Revenue"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4F46E5"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Link */}
      <div className="border-t border-border px-5 py-3 text-center flex items-center justify-center">
        <Link href="/admin/reports" className="text-sm font-medium text-primary hover:underline">{mounted ? t('common.viewAll') : 'View all trend'}</Link>
      </div>
    </div>
  )
}
