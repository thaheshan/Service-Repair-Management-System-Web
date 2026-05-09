"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useGetDashboardAnalyticsQuery } from "@/services/api/dashboardApiSlice"
import { useTranslation } from "react-i18next"

const fallbackData = [
  { name: "Completed", value: 0, color: "#10B981" },
  { name: "In Progress", value: 0, color: "#4F46E5" },
  { name: "Pending", value: 0, color: "#F59E0B" },
]

export function RepairStatusChart() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false);
  const { data: response } = useGetDashboardAnalyticsQuery({});
  
  const data = response?.data?.statusData?.length > 0 
    ? response.data.statusData 
    : fallbackData;
    
  const totalRepairs = data.reduce((sum: number, item: any) => sum + item.value, 0)

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[550px] w-full bg-slate-50 animate-pulse rounded-xl" />;
  }
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="px-5 pt-5 pb-2">
        <h3 className="text-base font-semibold text-foreground">{mounted ? t('dashboard.statusChart') : 'Repair Status Breakdown'}</h3>
      </div>

      {/* Chart */}
      <div className="flex flex-1 items-center justify-center px-4 py-8" style={{ height: '550px', width: '100%' }}>
        <div className="relative h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                label={({ cx, cy, midAngle = 0, outerRadius, percent, index }) => {
                  const RADIAN = Math.PI / 180;
                  // Push the label 25px out from the edge of the pie
                  const radius = outerRadius + 25;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  
                  // Left-aligned if it's on the left side, Right-aligned if on right
                  const isLeft = Math.cos(-midAngle * RADIAN) < 0;
                  const textAnchor = isLeft ? 'end' : 'start';
                  const entry = data[index];
                  
                  // Push the text slightly further out to replace line space naturally
                  const textX = cx + (outerRadius + 30) * Math.cos(-midAngle * RADIAN);
                  const textY = cy + (outerRadius + 30) * Math.sin(-midAngle * RADIAN);

                  return (
                    <text 
                      x={textX} 
                      y={textY} 
                      fill={entry.color} 
                      textAnchor={textAnchor} 
                      dominantBaseline="central"
                    >
                      <tspan x={textX} dy="-0.4em" fontSize="13px" fontWeight="bold">
                        {mounted ? t(`dashboard.status.${entry.name.toLowerCase().replace(/[\s_]+/g, '')}`) : entry.name}
                      </tspan>
                      <tspan x={textX} dy="1.4em" fontSize="12px" fill="#6B6B6B" fontWeight="600">
                        {entry.value}
                      </tspan>
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-foreground">{totalRepairs}</span>
            <span className="text-xs font-medium text-muted-foreground mt-0.5">{mounted ? t('dashboard.stats.totalRepairs') : 'Total Repairs'}</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 border-t border-border px-5 py-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-medium text-muted-foreground">
              {mounted ? t(`dashboard.status.${item.name.toLowerCase().replace(/[\s_]+/g, '')}`) : item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <div className="mt-auto border-t border-border px-5 py-3 text-center">
        <Link href="/admin/repairs" className="text-sm font-medium text-primary hover:underline">{mounted ? t('common.viewAll') : 'View all'}</Link>
      </div>
    </div>
  )
}
