"use client"

import { Search, Bell, ChevronDown, LogOut, User, Settings, CreditCard } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/ui-admin-dashboard/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/ui-admin-dashboard/dropdown-menu"

const notifications = [
  {
    id: 1,
    title: "New repair request",
    description: "iPhone 14 Pro - Screen crack reported by Amit Shah",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Parts arrived",
    description: "Samsung S21 battery replacement part delivered",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "Repair completed",
    description: "MacBook Air keyboard fix completed by David Chen",
    time: "3 hours ago",
    unread: false,
  },
]

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center justify-between border-b border-border bg-card px-6">
      {/* Search Bar */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search repairs, customers..."
          className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus:outline-none">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white ring-2 ring-card">
                2
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <span className="text-xs font-normal text-primary cursor-pointer hover:underline">Mark all as read</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex w-full items-start gap-2">
                  {notification.unread && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">{notification.description}</span>
                    <span className="text-xs text-muted-foreground/70">{notification.time}</span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm font-medium text-primary cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-lg px-1 py-1 hover:bg-muted focus:outline-none">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80" alt="Admin User" className="object-cover" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">AU</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-foreground">Admin User</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard className="h-4 w-4" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-[#EF4444] focus:text-[#EF4444]">
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
