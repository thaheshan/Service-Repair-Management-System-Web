"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import {
  Settings,
  Store,
  Bell,
  Lock,
  Users,
  Save,
  Moon,
  Sun,
  Palette,
  Globe,
  Mail,
  Smartphone,
  Check,
  Shield,
  CreditCard,
  Building,
  Upload,
} from "lucide-react"

type SettingsTab = "general" | "business" | "notifications" | "security" | "team"

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert("Settings saved successfully!")
    }, 1500)
  }

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col ml-[200px] min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 flex flex-col pt-0 overflow-y-auto">
          <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">System Settings</h1>
                <p className="text-sm text-muted-foreground font-medium">Configure your platform preferences and business rules</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg transition-all active:scale-95 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-primary/20'}`}
              >
                {isSaving ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save className="h-4 w-4" />}
                {isSaving ? "Saving Changes..." : "Save Settings"}
              </button>
            </div>

            {/* Settings Layout */}
            <div className="flex flex-col lg:flex-row gap-8 flex-1">
              
              {/* Tabs Navigation */}
              <aside className="w-full lg:w-64 shrink-0">
                <nav className="flex flex-col gap-1.5">
                  <button 
                    onClick={() => setActiveTab("general")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'general' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-[#0F172A]'}`}
                  >
                    <Settings className="h-4 w-4" /> General Configuration
                  </button>
                  <button 
                    onClick={() => setActiveTab("business")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'business' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-[#0F172A]'}`}
                  >
                    <Store className="h-4 w-4" /> Business Profile
                  </button>
                  <button 
                    onClick={() => setActiveTab("notifications")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'notifications' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-[#0F172A]'}`}
                  >
                    <Bell className="h-4 w-4" /> Notification Rules
                  </button>
                  <button 
                    onClick={() => setActiveTab("security")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-[#0F172A]'}`}
                  >
                    <Lock className="h-4 w-4" /> Security & Privacy
                  </button>
                  <button 
                    onClick={() => setActiveTab("team")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'team' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-[#0F172A]'}`}
                  >
                    <Users className="h-4 w-4" /> Team Management
                  </button>
                </nav>

                <div className="mt-8 p-6 rounded-2xl bg-indigo-50 border border-indigo-100 hidden lg:block">
                  <h4 className="text-[13px] font-black text-indigo-900 mb-2">Need Assistance?</h4>
                  <p className="text-[12px] text-indigo-700/80 leading-relaxed mb-4 font-medium">Check our technical documentation for advanced configuration options.</p>
                  <button className="text-[12px] font-bold text-indigo-600 hover:underline">View Documentation</button>
                </div>
              </aside>

              {/* Settings Content Area */}
              <div className="flex-1 min-w-0 pb-12">
                <div className="bg-white rounded-[24px] border border-border shadow-sm overflow-hidden min-h-[600px]">
                  
                  {/* General Settings */}
                  {activeTab === "general" && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="mb-8 border-b border-border pb-6">
                        <h3 className="text-xl font-black text-[#0F172A] mb-1">General Configuration</h3>
                        <p className="text-sm text-muted-foreground font-medium">Global system behavior and personalization</p>
                      </div>

                      <div className="space-y-8">
                        {/* Appearance Area */}
                        <div>
                          <label className="block text-[12px] font-black text-[#0F172A] uppercase tracking-widest mb-4">Platform Appearance</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button className="flex flex-col gap-3 p-4 rounded-xl border-2 border-primary bg-primary/5 transition-all text-left">
                              <div className="h-12 w-full bg-white rounded-lg border border-border flex items-center px-3 gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <div className="h-1.5 w-16 bg-muted rounded-full" />
                              </div>
                              <span className="text-[13px] font-bold text-primary flex items-center justify-between">Light Mode <Check className="h-3.5 w-3.5" /></span>
                            </button>
                            <button className="flex flex-col gap-3 p-4 rounded-xl border-2 border-transparent bg-muted/30 hover:border-border transition-all text-left">
                              <div className="h-12 w-full bg-[#0F172A] rounded-lg border border-border flex items-center px-3 gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <div className="h-1.5 w-16 bg-white/20 rounded-full" />
                              </div>
                              <span className="text-[13px] font-bold text-muted-foreground">Dark Mode</span>
                            </button>
                            <button className="flex flex-col gap-3 p-4 rounded-xl border-2 border-transparent bg-muted/30 hover:border-border transition-all text-left">
                              <div className="h-12 w-full bg-gradient-to-r from-white to-[#0F172A] rounded-lg border border-border flex items-center px-3 gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                              </div>
                              <span className="text-[13px] font-bold text-muted-foreground">System Default</span>
                            </button>
                          </div>
                        </div>

                        {/* Brand Management */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <label className="block text-[12px] font-black text-[#0F172A] uppercase tracking-widest">Accent Color</label>
                            <div className="flex flex-wrap gap-2">
                              {["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F472B6"].map((color) => (
                                <button 
                                  key={color}
                                  className={`h-10 w-10 rounded-full border-4 border-white shadow-md transition-all active:scale-90 ${color === '#4F46E5' ? 'ring-2 ring-primary' : 'hover:scale-110'}`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                              <button className="h-10 w-10 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-all">
                                <Palette className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[12px] font-black text-[#0F172A] uppercase tracking-widest mb-4 text-left">Platform Branding</label>
                            <div className="flex items-center gap-4">
                               <div className="h-16 w-16 rounded-2xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all">
                                  <Upload className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Logo</span>
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[13px] font-bold text-[#0F172A]">Vertical Logo.png</span>
                                  <span className="text-[11px] text-muted-foreground font-medium">Recommended: 512x512px SVG or PNG</span>
                                  <button className="text-[11px] font-bold text-primary hover:underline mt-1 text-left">Replace Graphic</button>
                               </div>
                            </div>
                          </div>
                        </div>

                        {/* Localization */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                           <div className="space-y-2">
                             <label className="block text-[12px] font-bold text-[#0F172A]">Default Language</label>
                             <div className="relative">
                               <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                               <select className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-[#F8FAFC] text-[13px] font-bold shadow-inner focus:bg-white transition-all outline-none">
                                  <option>English (United States)</option>
                                  <option>Sinhala (Sri Lanka)</option>
                                  <option>Tamil (Sri Lanka)</option>
                               </select>
                             </div>
                           </div>
                           <div className="space-y-2">
                             <label className="block text-[12px] font-bold text-[#0F172A]">System Timezone</label>
                             <select className="w-full h-11 px-4 rounded-xl border border-border bg-[#F8FAFC] text-[13px] font-bold shadow-inner focus:bg-white transition-all outline-none">
                                <option>(GMT +05:30) Colombo, Sri Lanka</option>
                                <option>(GMT +00:00) London, United Kingdom</option>
                             </select>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Business Profile */}
                  {activeTab === "business" && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="mb-8 border-b border-border pb-6">
                        <h3 className="text-xl font-black text-[#0F172A] mb-1">Business Profile</h3>
                        <p className="text-sm text-muted-foreground font-medium">Manage your shop identity and contact details</p>
                      </div>

                      <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="block text-[12px] font-bold text-[#0F172A]">Official Business Name</label>
                              <input type="text" defaultValue="SRM Premium Repairs" className="w-full h-11 px-4 rounded-xl border border-border bg-[#F8FAFC] text-[14px] font-black focus:bg-white transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-[12px] font-bold text-[#0F172A]">Tax Identification Number (TIN)</label>
                              <input type="text" defaultValue="TIN-994852-X" className="w-full h-11 px-4 rounded-xl border border-border bg-[#F8FAFC] text-[14px] font-black focus:bg-white transition-all outline-none" />
                            </div>
                         </div>

                         <div className="space-y-2">
                           <label className="block text-[12px] font-bold text-[#0F172A]">Headquarters Address</label>
                           <textarea rows={3} className="w-full p-4 rounded-xl border border-border bg-[#F8FAFC] text-[13px] font-medium focus:bg-white transition-all outline-none resize-none" defaultValue="123 Innovation Drive, Tech District, Colombo 03, Sri Lanka" />
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                            <div className="space-y-2">
                              <label className="block text-[12px] font-bold text-[#0F172A]">Customer Support Email</label>
                              <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input type="email" defaultValue="support@srmpremium.com" className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-[#F8FAFC] text-[13px] font-bold outline-none" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-[12px] font-bold text-[#0F172A]">Primary Contact</label>
                              <div className="relative">
                                <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input type="text" defaultValue="+94 77 123 4567" className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-[#F8FAFC] text-[13px] font-bold outline-none" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-[12px] font-bold text-[#0F172A]">Official Website</label>
                              <div className="relative">
                                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input type="text" defaultValue="https://srmpremium.com" className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-[#F8FAFC] text-[13px] font-bold outline-none" />
                              </div>
                            </div>
                         </div>

                         <div className="pt-8 space-y-4">
                           <label className="block text-[12px] font-black text-[#0F172A] uppercase tracking-widest">Billing & Currency</label>
                           <div className="p-6 rounded-2xl border border-border bg-[#F8FAFC] flex items-center justify-between shadow-inner">
                              <div className="flex items-center gap-4">
                                 <div className="h-12 w-12 rounded-xl bg-white shadow-sm border border-border flex items-center justify-center">
                                    <CreditCard className="h-6 w-6 text-primary" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[14px] font-black text-[#0F172A]">System Currency: LKR (Rs.)</span>
                                    <span className="text-[12px] text-muted-foreground font-medium">All financial reports and invoices use this currency.</span>
                                 </div>
                              </div>
                              <button className="h-10 px-4 rounded-lg border border-border bg-white text-[12px] font-bold text-[#0F172A] hover:bg-muted transition-all">Change Currency</button>
                           </div>
                         </div>
                      </div>
                    </div>
                  )}

                  {/* Notification Rules */}
                  {activeTab === "notifications" && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="mb-8 border-b border-border pb-6">
                        <h3 className="text-xl font-black text-[#0F172A] mb-1">Notification Rules</h3>
                        <p className="text-sm text-muted-foreground font-medium">Control how and when your team and customers get notified</p>
                      </div>

                      <div className="space-y-10">
                         {/* Customer Alerts */}
                         <section>
                            <h4 className="text-[12px] font-black text-primary uppercase tracking-widest mb-6">Customer Communication Matrix</h4>
                            <div className="space-y-4">
                               {[
                                 { title: "Booking Confirmation", desc: "Sent instantly when a new repair is registered.", email: true, sms: true },
                                 { title: "Status Updates", desc: "Sent when repair moves to a new stage in the workflow.", email: true, sms: false },
                                 { title: "Completion Alert", desc: "Sent when a device is ready for collection.", email: true, sms: true },
                                 { title: "Invoice Issued", desc: "Sent when a final invoice is generated for the customer.", email: true, sms: true }
                               ].map((rule) => (
                                 <div key={rule.title} className="flex items-center justify-between p-5 rounded-2xl border border-border hover:bg-[#F8FAFC] transition-all">
                                    <div className="max-w-[70%]">
                                       <h5 className="text-[14px] font-black text-[#0F172A]">{rule.title}</h5>
                                       <p className="text-[12px] text-muted-foreground font-medium">{rule.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                       <div className="flex flex-col items-center gap-2">
                                          <div className={`h-6 w-11 rounded-full relative transition-all cursor-pointer ${rule.email ? 'bg-primary' : 'bg-muted'}`}>
                                             <div className={`h-4 w-4 rounded-full bg-white absolute top-1 shadow-sm transition-all ${rule.email ? 'left-6' : 'left-1'}`} />
                                          </div>
                                          <span className="text-[10px] font-black text-muted-foreground uppercase">Email</span>
                                       </div>
                                       <div className="flex flex-col items-center gap-2">
                                          <div className={`h-6 w-11 rounded-full relative transition-all cursor-pointer ${rule.sms ? 'bg-primary' : 'bg-muted'}`}>
                                             <div className={`h-4 w-4 rounded-full bg-white absolute top-1 shadow-sm transition-all ${rule.sms ? 'left-6' : 'left-1'}`} />
                                          </div>
                                          <span className="text-[10px] font-black text-muted-foreground uppercase">SMS</span>
                                       </div>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </section>

                         {/* Admin Alerts */}
                         <section>
                            <h4 className="text-[12px] font-black text-primary uppercase tracking-widest mb-6">Internal System Alerts</h4>
                            <div className="space-y-4">
                               {[
                                 { title: "Low Stock Warning", desc: "Alerted when inventory drops below safety threshold.", app: true, email: true },
                                 { title: "Staff Shift Reminders", desc: "Sent to team members before their shift starts.", app: true, email: false },
                                 { title: "Critical Error Logs", desc: "Urgent alerts for system or database anomalies.", app: true, email: true }
                               ].map((rule) => (
                                 <div key={rule.title} className="flex items-center justify-between p-5 rounded-2xl border border-border hover:bg-[#F8FAFC] transition-all">
                                    <div className="max-w-[70%]">
                                       <h5 className="text-[14px] font-black text-[#0F172A]">{rule.title}</h5>
                                       <p className="text-[12px] text-muted-foreground font-medium">{rule.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                       <div className="flex flex-col items-center gap-2">
                                          <div className="h-6 w-11 rounded-full bg-primary relative transition-all cursor-pointer">
                                             <div className="h-4 w-4 rounded-full bg-white absolute top-1 left-6 shadow-sm transition-all" />
                                          </div>
                                          <span className="text-[10px] font-black text-muted-foreground uppercase">App</span>
                                       </div>
                                       <div className="flex flex-col items-center gap-2">
                                          <div className={`h-6 w-11 rounded-full relative transition-all cursor-pointer ${rule.email ? 'bg-primary' : 'bg-muted'}`}>
                                             <div className={`h-4 w-4 rounded-full bg-white absolute top-1 shadow-sm transition-all ${rule.email ? 'left-6' : 'left-1'}`} />
                                          </div>
                                          <span className="text-[10px] font-black text-muted-foreground uppercase">Email</span>
                                       </div>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </section>
                      </div>
                    </div>
                  )}

                  {/* Security & Privacy */}
                  {activeTab === "security" && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="mb-8 border-b border-border pb-6">
                        <h3 className="text-xl font-black text-[#0F172A] mb-1">Security & Privacy</h3>
                        <p className="text-sm text-muted-foreground font-medium">Protect your data and manage account security</p>
                      </div>

                      <div className="space-y-10">
                         {/* Audit Log Panel */}
                         <section>
                            <label className="block text-[12px] font-black text-primary uppercase tracking-widest mb-6">Advanced Security Features</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="p-6 rounded-2xl border border-border bg-[#F8FAFC] flex flex-col gap-4">
                                  <div className="flex items-center gap-3">
                                     <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-border flex items-center justify-center">
                                        <Lock className="h-5 w-5 text-primary" />
                                     </div>
                                     <span className="text-[15px] font-black text-[#0F172A]">Two-Factor (2FA)</span>
                                  </div>
                                  <p className="text-[12px] text-muted-foreground font-medium leading-relaxed">Adds an extra layer of security to your admin account by requiring a code from your phone.</p>
                                  <button className="w-full h-10 rounded-lg bg-[#0F172A] text-white text-[12px] font-black uppercase tracking-tight hover:bg-black transition-all">Enable Secure 2FA</button>
                               </div>
                               <div className="p-6 rounded-2xl border border-border bg-[#F8FAFC] flex flex-col gap-4">
                                  <div className="flex items-center gap-3">
                                     <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-border flex items-center justify-center">
                                        <Shield className="h-5 w-5 text-emerald-600" />
                                     </div>
                                     <span className="text-[15px] font-black text-[#0F172A]">Login Sessions</span>
                                  </div>
                                  <p className="text-[12px] text-muted-foreground font-medium leading-relaxed">You are currently logged in on <strong className="text-[#0F172A]">2 active devices</strong>. Clear all other sessions to secure account.</p>
                                  <button className="w-full h-10 rounded-lg border border-border bg-white text-[12px] font-black uppercase tracking-tight hover:bg-muted transition-all">Revoke All Sessions</button>
                               </div>
                            </div>
                         </section>

                         <section>
                            <h4 className="text-[12px] font-black text-[#0F172A] uppercase tracking-widest mb-4">Password Requirements</h4>
                            <div className="space-y-3">
                               {[
                                 "Minimum 12 characters required",
                                 "Must include at least one uppercase letter",
                                 "Must include at least one special character",
                                 "Enforce password rotation every 90 days"
                               ].map((req, idx) => (
                                 <div key={idx} className="flex items-center gap-3">
                                    <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                       <Check className="h-3 w-3 text-emerald-600 stroke-[3px]" />
                                    </div>
                                    <span className="text-[13px] font-medium text-muted-foreground">{req}</span>
                                 </div>
                               ))}
                            </div>
                         </section>

                         <section className="bg-red-50 p-8 rounded-[24px] border border-red-100">
                            <h4 className="text-[14px] font-black text-red-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                               <Building className="h-5 w-5" /> Account Deactivation
                            </h4>
                            <p className="text-[13px] text-red-700/80 mb-6 font-medium leading-relaxed">Permanently delete your business profile and all associated data. This action cannot be undone and will erase all repair history and customer records.</p>
                            <button className="h-11 px-8 rounded-xl bg-red-600 text-white text-[13px] font-black uppercase tracking-tight hover:bg-red-700 shadow-lg shadow-red-200 transition-all">Request Deletion</button>
                         </section>
                      </div>
                    </div>
                  )}

                  {/* Team Management */}
                  {activeTab === "team" && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="mb-8 border-b border-border pb-6 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-black text-[#0F172A] mb-1">Team Management</h3>
                          <p className="text-sm text-muted-foreground font-medium">Manage permissions and team access levels</p>
                        </div>
                        <button className="h-10 px-4 rounded-lg bg-primary text-white text-[12px] font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md">
                           <Users className="h-4 w-4" /> Invite Member
                        </button>
                      </div>

                      <div className="space-y-4">
                         {[
                           { name: "John Smith", role: "Super Admin", email: "john@srm.com", status: "Active" },
                           { name: "Sarah Wayne", role: "Junior Technician", email: "sarah@srm.com", status: "Active" },
                           { name: "Robert Fox", role: "Logistics Manager", email: "robert@srm.com", status: "Pending" }
                         ].map((member) => (
                           <div key={member.email} className="flex items-center justify-between p-5 rounded-2xl border border-border hover:shadow-md transition-all group bg-white">
                              <div className="flex items-center gap-4">
                                 <img src={`https://i.pravatar.cc/150?u=${member.name}`} className="h-12 w-12 rounded-xl object-cover shadow-sm bg-muted" alt="" />
                                 <div className="flex flex-col">
                                    <span className="text-[15px] font-black text-[#0F172A]">{member.name}</span>
                                    <span className="text-[12px] text-muted-foreground font-medium">{member.email}</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-8">
                                 <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase mb-1">System Role</span>
                                    <span className="text-[13px] font-bold text-primary">{member.role}</span>
                                 </div>
                                 <div className="flex flex-col items-end min-w-[80px]">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase mb-1">Status</span>
                                    <span className={`text-[12px] font-bold ${member.status === 'Active' ? 'text-emerald-600' : 'text-amber-500'}`}>{member.status}</span>
                                 </div>
                                 <button className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 focus:outline-none">
                                    <Settings className="h-4 w-4" />
                                 </button>
                              </div>
                           </div>
                         ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
          <div className="h-12" /> {/* Layout Spacer */}
          <DashboardFooter />
        </main>
      </div>
    </div>
  )
}
