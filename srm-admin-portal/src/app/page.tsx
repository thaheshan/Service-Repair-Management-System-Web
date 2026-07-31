'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  Search,
  Filter,
  LogOut,
  LayoutDashboard,
  Bell,
  Mail,
  User as UserIcon,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { format } from 'date-fns';

// Login Credentials (as requested)
const ADMIN_ACCOUNTS = [
  { email: 'admin@futuracareers.tech', password: 'Futura@2024!', name: 'Futura Admin' },
  { email: 'admin@amtrcies.com', password: 'Amtrcies@2024!', name: 'Amtrcies Admin' }
];

const FEATURES_LIST = [
  { key: 'dashboard', label: 'Dashboard', description: 'Main business metrics and overview charts' },
  { key: 'pos', label: 'POS (Point of Sale)', description: 'Direct sales checkout and billing interface' },
  { key: 'repairs', label: 'Repairs', description: 'Repair task lifecycle and scheduling' },
  { key: 'customers', label: 'Customers', description: 'Customer profiles, history, and communication' },
  { key: 'devices', label: 'Devices', description: 'Physical hardware inventory and registrations' },
  { key: 'invoices', label: 'Invoices', description: 'Invoices, transaction history, and balances' },
  { key: 'inventory', label: 'Inventory', description: 'Stock levels, suppliers hub, and PO tracking' },
  { key: 'reports', label: 'Reports', description: 'Real-time performance reports and CSV/PDF data' },
  { key: 'staff', label: 'Staff', description: 'Employee accounts, roles, and assignments' },
  { key: 'logs', label: 'Activity Logs', description: 'Security ledger tracking all system changes' },
  { key: 'settings', label: 'Settings', description: 'Configure preferences, branding, and rules' }
];

export default function SuperAdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Load saved session on initial mount
  useEffect(() => {
    const savedSession = localStorage.getItem('srm_admin_session');
    if (savedSession) {
      try {
        const data = JSON.parse(savedSession);
        if (data.isLoggedIn && data.currentUser) {
          setIsLoggedIn(true);
          setCurrentUser(data.currentUser);
        }
      } catch (e) {
        console.error('Error parsing session data');
      }
    }
  }, []);
  
  const [requests, setRequests] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalShops: 0,
    totalUsers: 0,
    pendingRequests: 0,
    todayInquiries: 0
  });
  
  const [leads, setLeads] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [userSearch, setUserSearch] = useState('');
  const [view, setView] = useState<'dashboard' | 'shops' | 'leads' | 'bookings' | 'users'>('dashboard');

  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [tempFeatures, setTempFeatures] = useState<Record<string, Record<string, boolean>>>({});
  const [isSavingFeatures, setIsSavingFeatures] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<'ADMIN' | 'MANAGER' | 'TECHNICIAN'>('ADMIN');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const account = ADMIN_ACCOUNTS.find(
      a => a.email === loginEmail && a.password === loginPassword
    );

    if (account) {
      setIsLoggedIn(true);
      setCurrentUser(account);
      localStorage.setItem('srm_admin_session', JSON.stringify({ isLoggedIn: true, currentUser: account }));
      toast.success(`Welcome back, ${account.name}`);
    } else {
      toast.error('Invalid credentials');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [requestsRes, statsRes, shopsRes, leadsRes, bookingsRes, usersRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/requests?status=${filter}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/shops`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/contact`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookings`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`)
      ]);

      if (requestsRes.data.success) setRequests(requestsRes.data.data);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (shopsRes.data.success) setShops(shopsRes.data.data);
      if (leadsRes.data.success) setLeads(leadsRes.data.data);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);
      if (usersRes.data.success) setUsers(usersRes.data.data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load live data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, filter]);

  const handleApprove = async (requestId: string, token: string) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/approve/${token}`);
      if (response.data.success || response.data.message) {
        toast.success('Registration approved successfully!');
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Approval failed');
    }
  };

  const handleReject = async (requestId: string, token: string) => {
    if (!confirm('Are you sure you want to reject this registration request? This cannot be undone.')) return;
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/reject/${token}`);
      if (response.data.success || response.data.message) {
        toast.success('Registration rejected.');
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Rejection failed');
    }
  };

  const handleSaveFeatures = async () => {
    if (!selectedShop) return;
    setIsSavingFeatures(true);
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/shops/${selectedShop.id}/features`,
        { featureFlags: tempFeatures }
      );
      if (response.data.success) {
        toast.success(`Features updated for ${selectedShop.name}`);
        setIsFeaturesModalOpen(false);
        fetchData();
      } else {
        toast.error('Failed to save features');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save shop features');
    } finally {
      setIsSavingFeatures(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
        <div className="w-full max-w-md bg-[#1e293b] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 text-center border-b border-slate-700">
            <h1 className="text-2xl font-bold text-white mb-2">SRM Super Admin</h1>
            <p className="text-slate-400">Sign in to manage registration requests</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="admin@futuracareers.tech"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input 
                type="password" 
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              Sign In
            </button>
          </form>
          <div className="p-4 bg-indigo-600/10 border-t border-indigo-500/20 text-center">
            <p className="text-xs text-indigo-300">Authorized Personnel Only</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs">SRM</div>
            Portal
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${view === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={() => setView('shops')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${view === 'shops' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ShoppingBag className="w-5 h-5" />
            Manage Shops
          </button>
          <button 
            onClick={() => setView('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${view === 'leads' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Mail className="w-5 h-5" />
            Hot Leads
          </button>
          <button 
            onClick={() => setView('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${view === 'bookings' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Calendar className="w-5 h-5" />
            Demo Bookings
          </button>
          <button 
            onClick={() => setView('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${view === 'users' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Users className="w-5 h-5" />
            Active Users
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => {
              setIsLoggedIn(false);
              setCurrentUser(null);
              localStorage.removeItem('srm_admin_session');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition-all"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-900">
            {view === 'dashboard' ? 'Request Management' : view === 'shops' ? 'Shop Management' : view === 'leads' ? 'Hot Leads' : view === 'bookings' ? 'Demo Bookings' : 'Active Users'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-xs text-slate-500 capitalize">System {currentUser?.email.split('@')[0]}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <UserIcon className="w-5 h-5 text-slate-600" />
              </div>
            </div>
            <button className="relative w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{stats.pendingRequests}</span>
              </div>
              <p className="text-slate-500 font-medium">Pending Approvals</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{stats.totalShops}</span>
              </div>
              <p className="text-slate-500 font-medium">Total Registered Shops</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{stats.todayInquiries}</span>
              </div>
              <p className="text-slate-500 font-medium">Today's New Requests</p>
            </div>
          </div>

          {view === 'dashboard' ? (
            /* Requests List */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Onboarding Requests</h2>
                  <p className="text-sm text-slate-500">Review and approve new shop registration requests</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search requests..." 
                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all w-full sm:w-64"
                    />
                  </div>
                  <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <th className="px-6 py-4">Shop Details</th>
                      <th className="px-6 py-4">Owner</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date Submitted</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                          </div>
                        </td>
                      </tr>
                    ) : requests.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No requests found.</td>
                      </tr>
                    ) : (
                      requests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{req.shopName}</p>
                            <p className="text-xs text-slate-500">ID: {req.id}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-700">{req.ownerName}</p>
                            <p className="text-xs text-slate-400">{req.ownerEmail}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              req.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 
                              req.status === 'APPROVED' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-600">{format(new Date(req.createdAt), 'MMM dd, yyyy')}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {req.status === 'PENDING' && (
                                <button 
                                  onClick={() => handleApprove(req.id, req.approvalToken)}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                                >
                                  Approve
                                </button>
                              )}
                              {req.status === 'APPROVED' && (
                                <button 
                                  onClick={() => handleApprove(req.id, req.approvalToken)}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                                >
                                  Finalize Account
                                </button>
                              )}
                              {req.status === 'PENDING' && (
                                <button 
                                  onClick={() => handleReject(req.id, req.approvalToken)}
                                  className="p-2 text-slate-400 hover:text-rose-500 transition-all"
                                  title="Reject Request"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : view === 'shops' ? (
            /* Shops List */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Registered Shops</h2>
                <p className="text-sm text-slate-500">Monitor and manage all shops using the platform</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <th className="px-6 py-4">Shop Name</th>
                      <th className="px-6 py-4">Code</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Metrics</th>
                      <th className="px-6 py-4 text-right">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
                    ) : shops.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No shops found.</td></tr>
                    ) : (
                      shops.map((shop) => (
                        <tr key={shop.id} className="hover:bg-slate-50 transition-colors text-sm">
                          <td className="px-6 py-4 font-bold text-slate-900">{shop.name}</td>
                          <td className="px-6 py-4 font-mono text-xs">{shop.shopCode}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              shop.subscriptionStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {shop.subscriptionStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-4 text-xs text-slate-500">
                              <span>{shop._count.users} Users</span>
                              <span>{shop._count.repairs} Repairs</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button 
                               onClick={() => {
                                 setSelectedShop(shop);
                                 const flags = shop.settings?.featureFlags || {};
                                 const initialFeatures: Record<string, Record<string, boolean>> = {
                                   ADMIN: {},
                                   MANAGER: {},
                                   TECHNICIAN: {}
                                 };
                                 
                                 const defaults: Record<string, Record<string, boolean>> = {
                                   ADMIN: {
                                     dashboard: true, pos: true, repairs: true, customers: true, devices: true,
                                     invoices: true, inventory: true, reports: true, staff: true, logs: true, settings: true
                                   },
                                   MANAGER: {
                                     dashboard: true, pos: true, repairs: true, customers: true, devices: true,
                                     invoices: true, inventory: true, reports: true, staff: true, logs: false, settings: true
                                   },
                                   TECHNICIAN: {
                                     dashboard: true, pos: true, repairs: true, customers: true, devices: true,
                                     invoices: true, inventory: true, reports: false, staff: false, logs: false, settings: true
                                   }
                                 };

                                 ['ADMIN', 'MANAGER', 'TECHNICIAN'].forEach(role => {
                                   const roleFlags = flags[role] || {};
                                   FEATURES_LIST.forEach(f => {
                                     if (flags[role] && roleFlags[f.key] !== undefined) {
                                       initialFeatures[role][f.key] = roleFlags[f.key];
                                     } else if (typeof flags[f.key] === 'boolean') {
                                       initialFeatures[role][f.key] = flags[f.key];
                                     } else {
                                       initialFeatures[role][f.key] = defaults[role][f.key];
                                     }
                                   });
                                 });

                                 setTempFeatures(initialFeatures);
                                 setActiveRoleTab('ADMIN');
                                 setIsFeaturesModalOpen(true);
                               }}
                               className="text-indigo-600 font-bold hover:underline"
                             >
                               Manage
                             </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : view === 'leads' ? (
            /* Leads List */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Contact Submissions (Hot Leads)</h2>
                <p className="text-sm text-slate-500">Monitor and respond to inquiries from the marketing site</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Message</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
                    ) : leads.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No leads found.</td></tr>
                    ) : (
                      leads.map((lead) => (
                        <tr key={lead.id} className={`hover:bg-slate-50 transition-colors text-sm ${!lead.isRead ? 'bg-blue-50/30' : ''}`}>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{lead.name}</p>
                            <p className="text-xs text-slate-500">{lead.email}</p>
                          </td>
                          <td className="px-6 py-4 font-medium text-black">{lead.subject || '—'}</td>
                          <td className="px-6 py-4">
                            <p className="truncate max-w-[200px] text-xs text-slate-600" title={lead.message}>{lead.message}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              lead.isRead ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-700'
                            }`}>
                              {lead.isRead ? 'Read' : 'New'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                            {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-6 py-4 text-right">
                             {!lead.isRead && (
                               <button 
                                 onClick={async () => {
                                   try {
                                     await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/contact/${lead.id}/read`);
                                     toast.success('Marked as read');
                                     fetchData();
                                   } catch (e) { toast.error('Failed to update'); }
                                 }}
                                 className="text-indigo-600 font-bold hover:underline text-xs"
                               >
                                 Mark Read
                               </button>
                             )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : view === 'bookings' ? (
            /* Bookings List */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Demo Bookings</h2>
                <p className="text-sm text-slate-500">Manage scheduled product demos and discovery calls</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <th className="px-6 py-4">Prospect</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Notes</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
                    ) : bookings.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No bookings found.</td></tr>
                    ) : (
                      bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50 transition-colors text-sm">
                          <td className="px-6 py-4 font-bold text-slate-900">{booking.name}</td>
                          <td className="px-6 py-4">
                            <a href={`mailto:${booking.email}`} className="text-xs text-indigo-600 hover:underline block">{booking.email}</a>
                            {booking.phone && <a href={`tel:${booking.phone}`} className="text-xs text-slate-500 hover:underline">{booking.phone}</a>}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-900">{format(new Date(booking.date), 'MMM dd, yyyy')}</p>
                            <p className="text-xs text-slate-500">{booking.time}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="truncate max-w-[200px] text-xs text-slate-600" title={booking.notes || ''}>{booking.notes || '—'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              booking.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 
                              booking.status === 'SCHEDULED' ? 'bg-blue-50 text-blue-700' :
                              booking.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                             {booking.status === 'PENDING' && (
                               <>
                                 <button 
                                   onClick={async () => {
                                     try {
                                       await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${booking.id}/status`, { status: 'SCHEDULED' });
                                       toast.success('Booking scheduled');
                                       fetchData();
                                     } catch (e) { toast.error('Failed to update status'); }
                                   }}
                                   className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg"
                                 >
                                   Accept
                                 </button>
                                 <button 
                                   onClick={async () => {
                                     if (confirm('Are you sure you want to decline this booking?')) {
                                       try {
                                         await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${booking.id}/status`, { status: 'CANCELLED' });
                                         toast.success('Booking declined');
                                         fetchData();
                                       } catch (e) { toast.error('Failed to update status'); }
                                     }
                                   }}
                                   className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-lg"
                                 >
                                   Decline
                                 </button>
                               </>
                             )}
                             {booking.status === 'SCHEDULED' && (
                               <button 
                                 onClick={async () => {
                                   try {
                                     await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${booking.id}/status`, { status: 'COMPLETED' });
                                     toast.success('Marked as completed');
                                     fetchData();
                                   } catch (e) { toast.error('Failed to update status'); }
                                 }}
                                 className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-lg"
                               >
                                 Complete
                               </button>
                             )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Active Users List */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Active System Users</h2>
                  <p className="text-sm text-slate-500">Monitor all registered staff and shop accounts across the platform</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search name, email, shop..." 
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all w-full sm:w-64"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Assigned Shop</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading users...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No users found.</td></tr>
                    ) : (
                      users
                        .filter(u => {
                          if (!userSearch.trim()) return true;
                          const q = userSearch.toLowerCase();
                          return (
                            (u.fullName || u.name || '').toLowerCase().includes(q) ||
                            (u.email || '').toLowerCase().includes(q) ||
                            (u.shop?.name || '').toLowerCase().includes(q) ||
                            (u.role || '').toLowerCase().includes(q)
                          );
                        })
                        .map((usr) => (
                          <tr key={usr.id} className="hover:bg-slate-50 transition-colors text-sm">
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-900">{usr.fullName || usr.name || usr.email}</p>
                              <p className="text-xs text-slate-500">{usr.email || usr.phone || 'No email'}</p>
                            </td>
                            <td className="px-6 py-4">
                              {usr.shop ? (
                                <div>
                                  <p className="font-bold text-indigo-600 text-xs">{usr.shop.name}</p>
                                  <p className="text-[10px] font-mono text-slate-400">{usr.shop.shopCode}</p>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 italic">Super Admin / Unassigned</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                usr.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                usr.role === 'MANAGER' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                'bg-blue-100 text-blue-700 border border-blue-200'
                              }`}>
                                {usr.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                usr.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }`}>
                                {usr.isActive !== false ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                              {usr.createdAt ? format(new Date(usr.createdAt), 'MMM dd, yyyy') : '—'}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Customize Access / Feature Flags Modal */}
      {isFeaturesModalOpen && selectedShop && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-900">Customize Sidebar Access</h3>
                <p className="text-xs text-slate-500 mt-1">Configure active modules for <span className="font-bold text-indigo-600">{selectedShop.name}</span> ({selectedShop.shopCode})</p>
              </div>
              <button 
                onClick={() => setIsFeaturesModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Role Tab Selector */}
            <div className="flex border-b border-slate-200 bg-slate-50/50 shrink-0 px-6">
              {(['ADMIN', 'MANAGER', 'TECHNICIAN'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRoleTab(role)}
                  className={`py-3 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 -mb-[1px] ${
                    activeRoleTab === role
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {role} Access
                </button>
              ))}
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 text-sm font-bold flex items-center justify-center">i</div>
                <div className="text-xs text-indigo-800 leading-relaxed">
                  Toggle sidebar items on or off for the <span className="font-black underline">{activeRoleTab}</span> role. Disabled items will be hidden immediately in the client portal sidebar for any staff assigned this role.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {FEATURES_LIST.map((feature) => {
                  const isEnabled = tempFeatures[activeRoleTab]?.[feature.key] ?? true;
                  return (
                    <div 
                      key={feature.key} 
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        isEnabled 
                          ? 'border-indigo-100 bg-indigo-50/20 hover:border-indigo-200' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="pr-4">
                        <span className="text-xs font-black text-slate-800 block capitalize">{feature.label}</span>
                        <span className="text-[10px] text-slate-400 font-medium leading-tight block mt-0.5">{feature.description}</span>
                      </div>
                      
                      {/* Premium Toggle Switch UI */}
                      <button
                        onClick={() => {
                          setTempFeatures(prev => ({
                            ...prev,
                            [activeRoleTab]: {
                              ...(prev[activeRoleTab] || {}),
                              [feature.key]: !isEnabled
                            }
                          }));
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-slate-50">
              <button
                onClick={() => setIsFeaturesModalOpen(false)}
                className="h-11 px-5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFeatures}
                disabled={isSavingFeatures}
                className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
              >
                {isSavingFeatures ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Features</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
