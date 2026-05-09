import { Star } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/ui-admin-dashboard/avatar"
import { useGetDashboardAnalyticsQuery } from "@/services/api/dashboardApiSlice"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"

const fallbackTechnicians = [
  { name: "No Data", rating: 0, jobsCompleted: 0, avatar: "" }
]

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= fullStars
              ? "fill-[#F59E0B] text-[#F59E0B]"
              : "fill-[#E5E7EB] text-[#E5E7EB]"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-foreground">{rating}</span>
    </div>
  )
}

export function TopTechnicians() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const { data: response, isLoading } = useGetDashboardAnalyticsQuery({});
  
  const technicians = response?.data?.topTechnicians?.length > 0 
    ? response.data.topTechnicians 
    : fallbackTechnicians;

  return (
    <div className="flex h-full min-h-[550px] flex-col rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-base font-semibold text-foreground">{mounted ? t('dashboard.topTechnicians') : 'Top Technicians This Week'}</h3>
      </div>

      {/* Table Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-2">
        <span className="text-xs font-medium text-muted-foreground w-1/2">{mounted ? t('common.name') || 'Name' : 'Name'}</span>
        <span className="text-xs font-medium text-muted-foreground text-center w-1/4">{mounted ? t('common.jobs') || 'Jobs' : 'Jobs'}</span>
        <span className="text-xs font-medium text-muted-foreground text-right w-1/4">{mounted ? t('common.rating') || 'Rating' : 'Rating'}</span>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {technicians.map((tech: any, index: number) => (
          <div
            key={tech.name + index}
            className={`flex items-center justify-between px-5 py-3 ${
              index !== technicians.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex items-center gap-3 w-1/2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(tech.name)}&background=random`} alt={tech.name} className="object-cover" />
                <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                  {tech.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground truncate">{tech.name}</span>
            </div>
            <div className="w-1/4 text-center">
              <span className="text-sm font-semibold text-foreground">{tech.jobsCompleted}</span>
            </div>
            <div className="w-1/4 flex justify-end">
              <StarRating rating={Number(tech.rating)} />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3 text-center flex items-center justify-center">
        <Link href="/admin/staff" className="text-sm font-medium text-primary hover:underline">{mounted ? t('common.viewAll') : 'View all staff'}</Link>
      </div>
    </div>
  )
}
