"use client"

import { useState } from "react"
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

const dataByRange: Record<string, { day: string; revenue: number }[]> = {
  "Last 7 days": [
    { day: "Mon", revenue: 25000 },
    { day: "Tue", revenue: 32000 },
    { day: "Wed", revenue: 28000 },
    { day: "Thu", revenue: 40000 },
    { day: "Fri", revenue: 35000 },
  ],
  "Last 14 days": [
    { day: "Mon", revenue: 18000 },
    { day: "Tue", revenue: 22000 },
    { day: "Wed", revenue: 30000 },
    { day: "Thu", revenue: 26000 },
    { day: "Fri", revenue: 35000 },
  ],
  "Last 30 days": [
    { day: "Mon", revenue: 20000 },
    { day: "Tue", revenue: 28000 },
    { day: "Wed", revenue: 32000 },
    { day: "Thu", revenue: 38000 },
    { day: "Fri", revenue: 42000 },
  ],
}

const rangeOptions = ["Last 7 days", "Last 14 days", "Last 30 days"]

export function RevenueTrend() {
  const [selectedRange, setSelectedRange] = useState("Last 7 days")
  const data = dataByRange[selectedRange]

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h3 className="text-base font-semibold text-foreground">Revenue Trend</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary">
              {selectedRange}
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
                {range}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Chart */}
      <div className="flex-1 px-5 pb-3 min-h-[220px]">
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
                dataKey="day"
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
                formatter={(value: any) => [`Rs. ${Number(value).toLocaleString()}`, "Revenue"]}
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
      <div className="border-t border-border px-5 py-3 text-center">
        <button className="text-sm font-medium text-primary hover:underline">View all trend</button>
      </div>
    </div>
  )
}
