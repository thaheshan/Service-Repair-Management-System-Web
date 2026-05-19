"use client"

import { Suspense } from "react"
import InventoryManagementPage from "@/components/admin/inventory/inventory-page"

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading inventory...</div>}>
      <InventoryManagementPage />
    </Suspense>
  )
}
