import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import Link from "next/link"
import { useRepairStore } from "@/store/repairStore"
import { useMemo } from "react"

export function RepairStatusChart() {
  const { items } = useRepairStore()

  const data = useMemo(() => {
    const completed = items.filter(r => ['completed', 'ready_to_take', 'delivered'].includes(r.status)).length
    const inProgress = items.filter(r => r.status === 'in_progress').length
    const pending = items.filter(r => r.status === 'pending').length

    return [
      { name: "Completed", value: completed, color: "#10B981" },
      { name: "In Progress", value: inProgress, color: "#4F46E5" },
      { name: "Pending", value: pending, color: "#F59E0B" },
    ]
  }, [items])

  const totalRepairs = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data])

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="px-5 pt-5 pb-2">
        <h3 className="text-base font-semibold text-foreground">Repair Status Breakdown</h3>
      </div>

      {/* Chart */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="relative h-[280px] w-full">
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
                label={({ cx, cy, midAngle = 0, outerRadius, index }) => {
                  const RADIAN = Math.PI / 180;
                  const entry = data[index];
                  if (entry.value === 0) return null;

                  const textAnchor = Math.cos(-midAngle * RADIAN) < 0 ? 'end' : 'start';
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
                        {entry.name}
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
            <span className="text-xs font-medium text-muted-foreground mt-0.5">Total Repairs</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 border-t border-border px-5 py-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-medium text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <div className="mt-auto border-t border-border px-5 py-3 text-center">
        <Link href="/admin/repairs" className="text-sm font-medium text-primary hover:underline">View all</Link>
      </div>
    </div>
  )
}
