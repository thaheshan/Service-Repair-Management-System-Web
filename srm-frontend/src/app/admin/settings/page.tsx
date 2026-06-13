"use client"

import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import SettingsView from "@/components/admin/settings/settings-page"

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SettingsView />
    </Suspense>
  )
}
