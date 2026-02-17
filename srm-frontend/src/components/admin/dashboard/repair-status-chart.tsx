"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "Completed", value: 30, color: "#10B981" },
  { name: "In Progress", value: 12, color: "#4F46E5" },
  { name: "Pending", value: 5, color: "#F59E0B" },
]

const totalRepairs = data.reduce((sum, item) => sum + item.value, 0)

export function RepairStatusChart() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="px-5 pt-5 pb-2">
        <h3 className="text-base font-semibold text-foreground">Repair Status Breakdown</h3>
      </div>

      {/* Chart */}
      <div className="relative flex items-center justify-center px-5 py-2">
        <div className="h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{totalRepairs}</span>
            <span className="text-xs text-muted-foreground">Total Repairs</span>
          </div>
        </div>

        {/* Side Labels */}
        <div className="absolute left-5 top-1/2 -translate-y-6 flex flex-col items-start">
          <span className="text-xs font-medium text-[#4F46E5]">In Progress</span>
          <span className="text-xs text-muted-foreground">{data[1].value}</span>
        </div>
        <div className="absolute left-5 bottom-6 flex flex-col items-start">
          <span className="text-xs font-medium text-[#F59E0B]">Pending</span>
          <span className="text-xs text-muted-foreground">{data[2].value}</span>
        </div>
        <div className="absolute right-5 top-1/2 -translate-y-2 flex flex-col items-end">
          <span className="text-xs font-medium text-[#10B981]">Completed</span>
          <span className="text-xs text-muted-foreground">{data[0].value}</span>
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
    </div>
  )
}
