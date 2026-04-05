"use client"

import { useState } from "react"
import { Search, Bell, ChevronDown, LogOut, User, Settings, CreditCard, Trash2, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/ui-admin-dashboard/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/ui-admin-dashboard/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/ui-admin-dashboard/dropdown-menu"

const initialNotifications = [
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
    title: "Payment received",
    description: "Invoice #INV-2023-001 paid by Sarah Jenkins",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 4,
    title: "Repair completed",
    description: "MacBook Air keyboard fix completed by David Chen",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 5,
    title: "Low stock alert",
    description: "iPhone 13 Pro Max OLED Screens dropping below minimum threshold",
    time: "5 hours ago",
    unread: false,
  }
]

export const mockSearchData = [
  { id: 1, type: "Customer", name: "Sarah Anderson", sub: "sarah@example.com", link: "/admin/customers/1" },
  { id: 2, type: "Customer", name: "Vikram Singh", sub: "+94 77 123 4567", link: "/admin/customers/2" },
  { id: 3, type: "Repair", name: "REP-2023-089", sub: "iPhone 13 Pro Screen Fix", link: "/admin/repairs/1" },
  { id: 4, type: "Repair", name: "REP-2023-090", sub: "MacBook Pro Keyboard", link: "/admin/repairs/2" },
  { id: 5, type: "Device", name: "Samsung S22 Ultra", sub: "In Inventory: 5 units", link: "/admin/devices" },
]

export function DashboardHeader() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const filteredSearch = mockSearchData.filter(item => 
    searchQuery && (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )


  const unreadCount = notifications.filter(n => n.unread).length

  const handleLogout = () => {
    // Clear the auth cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    // Redirect to login
    router.push("/login")
  }

  const markAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
  }

  const clearAll = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setNotifications([])
  }

  return (
    <>
    <header className="sticky top-0 z-20 flex h-[64px] items-center justify-between border-b border-border bg-card px-4 lg:px-8 pl-[60px] lg:pl-8">
      <div className="relative w-full max-w-[180px] sm:max-w-[240px] md:max-w-sm flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search repairs, customers..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsSearchOpen(true)
            }}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none shadow-sm transition-all"
          />
          {isSearchOpen && searchQuery && (
            <div className="absolute top-full left-0 mt-1 w-[400px] bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {filteredSearch.length > 0 ? (
                <div className="flex flex-col py-1 max-h-[300px] overflow-y-auto">
                  {filteredSearch.map((item) => (
                    <button
                      key={item.id}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        setIsSearchOpen(false)
                        setSearchQuery("")
                        router.push(item.link)
                      }}
                      className="flex flex-col items-start px-4 py-2.5 hover:bg-muted focus:bg-muted border-b border-border/40 last:border-0 text-left focus:outline-none transition-colors"
                    >
                      <div className="flex items-center gap-2.5 mb-1 w-full">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded shadow-sm border border-[#4F46E5]/20">
                          {item.type}
                        </span>
                        <span className="text-sm font-bold text-[#0F172A] truncate">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[12px] font-medium text-muted-foreground w-full truncate">
                        {item.sub}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-8 text-[13px] font-medium text-muted-foreground text-center flex flex-col items-center justify-center gap-2">
                  <Search className="h-6 w-6 text-muted-foreground/40 mb-1" />
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus:outline-none transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-[14px] min-w-[14px] px-1 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white ring-2 ring-card shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[380px] p-0 shadow-xl border-border/60">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/20">
              <span className="font-semibold text-foreground">Notifications</span>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 focus:outline-none"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    onClick={clearAll}
                    className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 focus:outline-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            {/* Notifications List */}
            <div className="max-h-[360px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No notifications</p>
                  <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id} 
                      className={`flex flex-col items-start gap-1 p-4 cursor-pointer border-b border-border/40 last:border-b-0 rounded-none focus:bg-muted/50 transition-colors ${notification.unread ? 'bg-primary/[0.03]' : ''}`}
                      onSelect={(e) => {
                        e.preventDefault()
                        setNotifications(notifications.map(n => 
                          n.id === notification.id ? { ...n, unread: false } : n
                        ))
                      }}
                    >
                      <div className="flex w-full items-start gap-3">
                        <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.unread ? 'bg-primary' : 'bg-transparent'}`} />
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-sm ${notification.unread ? 'font-semibold' : 'font-medium'} text-foreground leading-none`}>
                              {notification.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {notification.description}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-2 border-t border-border/60 bg-muted/10">
              <button 
                className="w-full py-2.5 flex items-center justify-center rounded-md text-sm font-semibold text-primary hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                onClick={() => setIsModalOpen(true)}
              >
                View all notifications
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-lg px-1 py-1 hover:bg-muted focus:outline-none transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80" alt="Admin User" className="object-cover" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">AU</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 hidden sm:flex">
                <span className="text-sm font-medium text-foreground">Admin User</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/admin/settings")}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/admin/settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-[#EF4444] focus:text-[#EF4444]"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">All Notifications</DialogTitle>
            <div className="flex items-center gap-4">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 focus:outline-none"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5 focus:outline-none"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto w-full">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 px-4 text-center">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground">No notifications</p>
              <p className="text-sm text-muted-foreground mt-2">You're all caught up!</p>
            </div>
          ) : (
            <div className="flex flex-col w-full divide-y divide-border/40">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex items-start gap-4 p-6 hover:bg-muted/30 transition-colors cursor-pointer ${notification.unread ? 'bg-primary/[0.04]' : ''}`}
                  onClick={() => {
                    setNotifications(notifications.map(n => 
                      n.id === notification.id ? { ...n, unread: false } : n
                    ))
                  }}
                >
                  <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${notification.unread ? 'bg-primary' : 'bg-transparent'}`} />
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-start justify-between gap-4">
                      <span className={`text-base ${notification.unread ? 'font-semibold' : 'font-medium'} text-foreground`}>
                        {notification.title}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap pt-1">
                        {notification.time}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {notification.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
