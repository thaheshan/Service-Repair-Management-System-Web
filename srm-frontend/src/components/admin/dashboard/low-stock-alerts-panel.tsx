"use client"

import { useGetLowStockItemsQuery } from "@/services/api/inventoryApiSlice"
import { AlertTriangle, ArrowRight, Package, RefreshCw } from "lucide-react"
import Link from "next/link"

export function LowStockAlertsPanel() {
  const { data: rawLowStock, isLoading: lowStockLoading, refetch: refetchLow } = useGetLowStockItemsQuery(undefined)
  const lowStockItems: any[] = Array.isArray(rawLowStock) ? rawLowStock : (rawLowStock?.items || [])

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-bold text-foreground">Low Stock Alerts</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetchLow()}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <Link
            href="/admin/inventory"
            className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {lowStockLoading ? (
          <div className="p-6 text-center text-sm text-muted-foreground">Loading alerts...</div>
        ) : lowStockItems.length === 0 ? (
          <div className="p-8 flex flex-col items-center gap-2 text-center h-full justify-center">
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <Package className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-foreground">All stock healthy!</p>
            <p className="text-xs text-muted-foreground">No items below threshold</p>
          </div>
        ) : (
          lowStockItems.map((item: any) => (
            <div
              key={item.id || item.name}
              className="flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-foreground truncate">{item.name || item.title}</p>
                <p className="text-[11px] text-muted-foreground">SKU: {item.sku || "N/A"} · {item.category || "—"}</p>
              </div>
              <span className="ml-3 shrink-0 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[11px] font-bold">
                {item.quantity ?? item.stock ?? 0} left
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
