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
  User as UserIcon
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { format } from 'date-fns';

// Login Credentials (as requested)
const ADMIN_ACCOUNTS = [
  { email: 'admin@futuracareers.tech', password: 'Futura@2024!', name: 'Futura Admin' },
  { email: 'admin@amtrcies.com', password: 'Amtrcies@2024!', name: 'Amtrcies Admin' }
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
  
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [view, setView] = useState<'dashboard' | 'shops'>('dashboard');

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
      const [requestsRes, statsRes, shopsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/requests?status=${filter}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/shops`)
      ]);

      if (requestsRes.data.success) setRequests(requestsRes.data.data);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (shopsRes.data.success) setShops(shopsRes.data.data);
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
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all">
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
          <h1 className="text-2xl font-bold text-slate-900">{view === 'dashboard' ? 'Request Management' : 'Shop Management'}</h1>
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
          ) : (
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
                             <button className="text-indigo-600 font-bold hover:underline">Manage</button>
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
    </div>
  );
}
