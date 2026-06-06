import Link from 'next/link';
import { LayoutDashboard, UserPlus, Settings, Users, ShoppingBag, MessageSquare } from 'lucide-react';

export default function AdminLayout({ children }: any) {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Onboarding Requests', icon: UserPlus, href: '/admin/onboarding' },
    { name: 'Shops', icon: ShoppingBag, href: '/admin/shops' },
    { name: 'Users', icon: Users, href: '/admin/users' },
    { name: 'Contact Messages', icon: MessageSquare, href: '/admin/contact-messages' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#111827] text-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-800">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            SRM Admin
          </h2>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800 text-gray-400 text-xs">
          © 2024 SRM Systems v1.0.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b bg-white flex items-center px-8 lg:hidden">
           <h2 className="text-xl font-bold text-gray-900">SRM Admin</h2>
        </header>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
