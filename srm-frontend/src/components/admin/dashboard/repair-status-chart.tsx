"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useGetDashboardAnalyticsQuery } from "@/services/api/dashboardApiSlice"
import { useTranslation } from "react-i18next"

const fallbackData = [
  { name: "NOT STARTED", value: 0, color: "#F59E0B" },
  { name: "IN PROGRESS", value: 0, color: "#6366F1" },
  { name: "READY TO TAKE", value: 0, color: "#3B82F6" },
  { name: "DELIVERED",   value: 0, color: "#8B5CF6" },
  { name: "PAID",        value: 0, color: "#10B981" },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  t?: (key: string) => string
  totalRepairs?: number
}

const CustomTooltip = ({ active, payload, t, totalRepairs = 0 }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload
    const rawName = item.name || ""
    const formattedName = t 
      ? t(`dashboard.status.${rawName.toLowerCase().replace(/[\s_]+/g, '')}`) || rawName 
      : rawName

    const count = Number(item.value || 0)
    const percentage = totalRepairs > 0 ? ((count / totalRepairs) * 100).toFixed(1) : "0.0"

    return (
      <div className="min-w-[160px] max-w-[240px] bg-popover/95 text-popover-foreground border border-border/80 rounded-xl px-3.5 py-2.5 shadow-xl backdrop-blur-md flex flex-col gap-1.5 z-50 pointer-events-none">
        {/* Status Header with Color Indicator */}
        <div className="flex items-center gap-2">
          <span 
            className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm" 
            style={{ backgroundColor: item.color }} 
          />
          <span className="text-[12px] font-bold text-popover-foreground tracking-tight whitespace-nowrap truncate">
            {formattedName}
          </span>
        </div>

        {/* Separator line for clear vertical separation */}
        <div className="h-px bg-border/60 w-full" />

        {/* Count and Percentage Row */}
        <div className="flex items-center justify-between gap-3 text-[12px]">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            {t ? t('common.repairs') : 'Repairs'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-[13px]" style={{ color: item.color }}>
              {count}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function RepairStatusChart({ days = 30 }: { days?: number }) {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false);
  const { data: response } = useGetDashboardAnalyticsQuery({ days });

  const data = response?.data?.statusData?.length > 0
    ? response.data.statusData
    : fallbackData;

  const totalRepairs = data.reduce((sum: number, item: any) => sum + item.value, 0)

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[420px] w-full bg-slate-50 animate-pulse rounded-xl" />;
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="px-5 pt-5 pb-2">
        <h3 className="text-base font-semibold text-foreground">{mounted ? t('dashboard.statusChart') : 'Repair Status Breakdown'}</h3>
      </div>

      {/* Chart — fixed height, no overflow labels */}
      <div className="flex items-center justify-center px-4 py-4" style={{ height: 220 }}>
        <div className="relative w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={88}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip t={t} totalRepairs={totalRepairs} />} 
                allowEscapeViewBox={{ x: false, y: false }}
                wrapperStyle={{ outline: "none", zIndex: 100 }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-foreground">{totalRepairs}</span>
            <span className="text-xs font-medium text-muted-foreground mt-0.5">
              {mounted ? t('dashboard.stats.totalRepairs') : 'Total Repairs'}
            </span>
          </div>
        </div>
      </div>

      {/* Legend — responsive grid, no overflow */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border px-5 py-4">
        {data.map((item: any) => (
          <div key={item.name} className="flex items-center gap-2 min-w-0">
            <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-[11px] font-medium text-muted-foreground truncate flex-1">
              {mounted ? t(`dashboard.status.${item.name.toLowerCase().replace(/[\s_]+/g, '')}`) : item.name}
            </span>
            <span className="text-[12px] font-black text-foreground shrink-0">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <div className="mt-auto border-t border-border px-5 py-3 text-center">
        <Link href="/admin/repairs" className="text-sm font-medium text-primary hover:underline">
          {mounted ? t('common.viewAll') : 'View All'}
        </Link>
      </div>
    </div>
  )
}
