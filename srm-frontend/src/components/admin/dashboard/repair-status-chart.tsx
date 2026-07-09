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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-[12px] font-bold text-foreground">{item.name}</p>
        <p className="text-[13px] font-black" style={{ color: item.color }}>{item.value} repairs</p>
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
              <Tooltip content={<CustomTooltip />} />
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
