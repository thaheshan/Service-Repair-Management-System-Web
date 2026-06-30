"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useTheme } from "next-themes"
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
  Trash2,
  CloudUpload,
  CheckCircle2,
  User,
} from "lucide-react"
import { useGetSettingsQuery, useUpdateSettingsMutation, useRenewSubscriptionMutation } from "@/services/api/settingsApiSlice"
import { useGetStaffListQuery, useCreateStaffMutation, useUpdateStaffMutation, useDeleteStaffMutation, useGetStaffContextQuery } from "@/services/api/staffApiSlice"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

import { useSearchParams } from "next/navigation"

type SettingsTab = "profile" | "general" | "business" | "notifications" | "security" | "team" | "billing"

export default function SettingsView() {
  const { data: apiSettings, isLoading: settingsLoading } = useGetSettingsQuery({});
  const [updateSettings] = useUpdateSettingsMutation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: staffResponse } = useGetStaffListQuery({}, { skip: user?.role === 'TECHNICIAN' });
  const { data: myProfile } = useGetStaffContextQuery({});

  const [renewSubscription] = useRenewSubscriptionMutation();
  const [isRenewing, setIsRenewing] = useState(false);

  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") as SettingsTab || (user?.role === 'TECHNICIAN' ? 'profile' : "general");
  
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab)
  const [isSaving, setIsSaving] = useState(false)

  // API Mutations
  const [createStaff] = useCreateStaffMutation();
  const [updateStaffMutation] = useUpdateStaffMutation();
  const [deleteStaffMutation] = useDeleteStaffMutation();

  // --- STATE MANAGEMENT ---
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const { setTheme: setNextTheme } = useTheme()
  const [theme, setTheme] = useState("light")
  const [accentColor, setAccentColor] = useState("#4F46E5")
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  })
  const [businessSettings, setBusinessSettings] = useState({
    name: "",
    tin: "",
    address: "",
    email: "",
    phone: "",
    website: "",
    language: "en",
    timezone: "(GMT +05:30) Colombo, Sri Lanka",
    currency: "LKR",
  })

  const [appearance, setAppearance] = useState({
    theme: "light",
    accentColor: "#4F46E5",
    logoUrl: ""
  })

  const [securityRules, setSecurityRules] = useState({
    twoFactorEnabled: false,
    passwordRotationDays: 90,
    minPasswordLength: 12,
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Populate from API when loaded
  useEffect(() => {
    if (apiSettings) {
      const mapLanguage = (lang: string | undefined) => {
        if (!lang) return "en";
        if (lang === "English (United States)") return "en";
        if (lang === "Sinhala (Sri Lanka)") return "si";
        if (lang === "Tamil (Sri Lanka)") return "ta";
        return lang;
      };

      setBusinessSettings(prev => ({
        ...prev,
        name: apiSettings.shop?.name ?? prev.name,
        email: apiSettings.shop?.email ?? prev.email,
        phone: apiSettings.shop?.phone ?? prev.phone,
        address: apiSettings.shop?.address ?? prev.address,
        website: apiSettings.shop?.website ?? prev.website,
        tin: apiSettings.shop?.taxNumber ?? prev.tin,
        timezone: apiSettings.settings?.timezone ?? prev.timezone,
        currency: apiSettings.settings?.currency ?? prev.currency,
        language: mapLanguage(apiSettings.settings?.language),
      }));
      
      if (apiSettings.settings?.language) {
        i18n.changeLanguage(mapLanguage(apiSettings.settings.language));
      }

      if (apiSettings.settings?.appearance) {
        const loadedLogo = apiSettings.logoUrl || apiSettings.settings.appearance.logoUrl;
        setAppearance(prev => ({
          ...prev,
          ...apiSettings.settings.appearance,
          logoUrl: loadedLogo ?? prev.logoUrl
        }));
        if (loadedLogo) setLogoPreview(loadedLogo);
        setTheme(apiSettings.settings.appearance.theme ?? "light");
        setAccentColor(apiSettings.settings.appearance.accentColor ?? "#4F46E5");
      }

      if (apiSettings.settings?.securityRules) {
        setSecurityRules(prev => ({
          ...prev,
          ...apiSettings.settings.securityRules
        }));
      }

      if (apiSettings.settings?.notificationPreferences) {
        setNotifications(prev => ({
          ...prev,
          ...apiSettings.settings.notificationPreferences
        }));
      }
    }
  }, [apiSettings]);

  useEffect(() => {
    if (myProfile) {
      setPersonalInfo({
        fullName: myProfile.fullName || "",
        email: myProfile.email || "",
        phone: myProfile.phone || "",
      });
    }
  }, [myProfile]);

  // Notifications State
  const [notifications, setNotifications] = useState({
    booking: { email: true, sms: true },
    status: { email: true, sms: false },
    completion: { email: true, sms: true },
    invoice: { email: true, sms: true },
    stock: { app: true, email: true },
    shifts: { app: true, email: false },
    errors: { app: true, email: true }
  })

  // Branding State
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFileName, setLogoFileName] = useState("Vertical Logo.png")

  // Sync Theme and Colors to Document
  useEffect(() => {
    const root = document.documentElement
    
    // Apply Class-based Dark Mode via next-themes
    setNextTheme(theme)

    // Apply dynamic branding color
    if (accentColor) {
      root.style.setProperty('--primary', accentColor)
      root.style.setProperty('--ring', accentColor)
    }
  }, [theme, accentColor, setNextTheme])
  
  // Team Management State
  const teamMembers = useMemo(() => {
    const apiStaff = staffResponse?.staff || [];
    if (apiStaff.length > 0) {
      return apiStaff.map((s: any) => ({
        id: s.id,
        name: s.fullName,
        role: s.role,
        email: s.email ?? '',
        status: s.isActive ? 'Active' : 'Inactive',
      }));
    }
    return [];
  }, [staffResponse]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [activeEditMember, setActiveEditMember] = useState<any>(null)
  
  // New Invite Draft
  const [newInvite, setNewInvite] = useState({ name: "", email: "", role: "Junior Technician" })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSettings({
        // Business Profile
        shopName: businessSettings.name,
        address: businessSettings.address,
        phone: businessSettings.phone,
        email: businessSettings.email,
        website: businessSettings.website,
        taxNumber: businessSettings.tin,
        
        // System Settings
        timezone: businessSettings.timezone,
        currency: businessSettings.currency,
        language: businessSettings.language,
        notificationPreferences: notifications,
        appearance: {
          ...appearance,
          theme,
          accentColor
        },
        securityRules,
      }).unwrap();

      if (typeof window !== "undefined") {
        localStorage.setItem("srm_theme", theme)
      }
      
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Failed to save settings details:', err);
      if (err && typeof err === 'object') {
        console.error('Error keys:', Object.keys(err), 'data:', err.data);
      }
      let errorMsg = err.data?.message || err.data?.error || "Failed to save settings. Please try again.";
      if (err.data?.errors && Array.isArray(err.data.errors)) {
        const details = err.data.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('\n');
        errorMsg = `Validation Error:\n${details}`;
      }
      alert(errorMsg);
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!myProfile?.id) return;
    setIsSaving(true);
    try {
      await updateStaffMutation({
        id: myProfile.id,
        fullName: personalInfo.fullName,
        email: personalInfo.email,
        phone: personalInfo.phone,
      }).unwrap();
      setShowSuccessModal(true);
    } catch (err: any) {
      alert(err.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInviteSubmit = async () => {
    if (!newInvite.name || !newInvite.email) return alert("Please fill in required fields.")
    try {
      await createStaff({
        fullName: newInvite.name,
        email: newInvite.email,
        role: newInvite.role.toUpperCase().replace(/\s+/g, '_')
      }).unwrap();
      
      alert(`Invitation sent to ${newInvite.email}.`);
      setNewInvite({ name: "", email: "", role: "Senior Technician" })
      setIsInviteModalOpen(false)
    } catch (err: any) {
      alert(err.data?.message || "Failed to invite member.");
    }
  }

  const handleEditMemberSubmit = async () => {
    if (!activeEditMember) return
    try {
      await updateStaffMutation({
        id: activeEditMember.id,
        role: activeEditMember.role.toUpperCase().replace(/\s+/g, '_'),
        isActive: activeEditMember.status === 'Active'
      }).unwrap();
      
      alert("Staff member updated successfully.");
      setActiveEditMember(null)
    } catch (err: any) {
      alert(err.data?.message || "Failed to update member.");
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    try {
      await deleteStaffMutation(id).unwrap();
      alert("Staff member removed successfully.");
    } catch (err: any) {
      alert(err.data?.message || "Failed to remove member.");
    }
  }

  const handleRenewSubscription = async (plan: string) => {
    setIsRenewing(true);
    try {
      await renewSubscription({ plan }).unwrap();
      alert(`Subscription successfully upgraded to ${plan} Plan!`);
    } catch (err: any) {
      alert(err.data?.message || "Failed to process payment/renewal.");
    } finally {
      setIsRenewing(false);
    }
  }

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 flex flex-col pt-0 overflow-y-auto">
          <div className="w-full max-w-[1280px] px-4 lg:px-8 py-6 lg:py-8 mx-auto flex flex-col">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight">
                  {user?.role === 'TECHNICIAN' 
                    ? (mounted ? t('settings.accountTitle') || 'Account Settings' : 'Account Settings')
                    : (mounted ? t('settings.title') : 'System Settings')
                  }
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  {user?.role === 'TECHNICIAN'
                    ? (mounted ? t('settings.accountSubtitle') || 'Manage your personal profile and appearance preferences' : 'Manage your personal profile and appearance preferences')
                    : (mounted ? t('settings.subtitle') : 'Configure your platform preferences and business rules')
                  }
                </p>
              </div>
              
              {/* Only show global save button if not in profile tab OR if admin */}
              {(user?.role !== 'TECHNICIAN' || activeTab !== 'profile') && (
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg transition-all active:scale-95 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-primary/20'}`}
                >
                  {isSaving ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save className="h-4 w-4" />}
                  {isSaving ? (mounted ? t('settings.savingChanges') : 'Saving Changes...') : (mounted ? t('settings.saveSettings') : 'Save Settings')}
                </button>
              )}
            </div>

            {/* Settings Layout */}
            <div className="flex flex-col lg:flex-row gap-8 flex-1">
              
              {/* Tabs Navigation */}
              <aside className="w-full lg:w-64 shrink-0">
                <nav className="flex flex-col gap-1.5">
                  {user?.role === 'TECHNICIAN' && (
                    <button 
                      onClick={() => setActiveTab("profile")}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    >
                      <User className="h-4 w-4" /> {mounted ? t('settings.profile') : 'Personal Profile'}
                    </button>
                  )}
                  <button 
                    onClick={() => setActiveTab("general")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'general' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                  >
                    <Settings className="h-4 w-4" /> {mounted ? t('settings.general') : 'Appearance & Language'}
                  </button>
                  {user?.role !== 'TECHNICIAN' && (
                    <>
                      <button 
                        onClick={() => setActiveTab("business")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'business' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                      >
                        <Store className="h-4 w-4" /> {mounted ? t('settings.business') : 'Business Profile'}
                      </button>
                      <button 
                        onClick={() => setActiveTab("notifications")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'notifications' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                      >
                        <Bell className="h-4 w-4" /> {mounted ? t('settings.notifications') : 'Notification Rules'}
                      </button>
                      <button 
                        onClick={() => setActiveTab("security")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                      >
                        <Lock className="h-4 w-4" /> {mounted ? t('settings.security') : 'Security & Privacy'}
                      </button>
                      <button 
                        onClick={() => setActiveTab("team")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'team' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                      >
                        <Users className="h-4 w-4" /> {mounted ? t('settings.team') : 'Team Management'}
                      </button>
                      <button 
                        onClick={() => setActiveTab("billing")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'billing' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                      >
                        <CreditCard className="h-4 w-4" /> Billing & Subscriptions
                      </button>
                    </>
                  )}
                </nav>

                <div className="mt-8 p-6 rounded-2xl bg-primary/10 border border-primary/20 hidden lg:block">
                  <h4 className="text-[13px] font-black text-foreground mb-2">{mounted ? t('settings.needAssistance') : 'Need Assistance?'}</h4>
                  <p className="text-[12px] text-muted-foreground leading-relaxed mb-4 font-medium">{mounted ? t('settings.assistanceDesc') : 'Check our technical documentation for advanced configuration options.'}</p>
                  <button className="text-[12px] font-bold text-primary hover:underline">{mounted ? t('settings.viewDocs') : 'View Documentation'}</button>
                </div>
              </aside>

              {/* Settings Content Area */}
              <div className="flex-1 min-w-0 pb-12">
                <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden min-h-[600px]">
                  
                  {/* Profile Settings */}
                  {activeTab === "profile" && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="mb-8 border-b border-border pb-6 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-black text-foreground mb-1">{mounted ? t('settings.profile') : 'Personal Profile'}</h3>
                          <p className="text-sm text-muted-foreground font-medium">{mounted ? t('settings.profileDesc') : 'Manage your personal identification and contact info'}</p>
                        </div>
                        <button onClick={handleSaveProfile} disabled={isSaving} className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2 shadow-md hover:shadow-primary/20 transition-all">
                          {isSaving ? <span className="animate-spin h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full" /> : <Save className="h-4 w-4" />}
                          {mounted ? t('settings.updateProfile') : 'Update Profile'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="block text-[12px] font-bold text-foreground">Full Name</label>
                            <input 
                              type="text" 
                              value={personalInfo.fullName}
                              onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                              className="w-full h-11 px-4 rounded-xl border border-border bg-muted/30 focus:bg-card transition-all outline-none font-bold" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[12px] font-bold text-foreground">Email Address</label>
                            <input 
                              type="email" 
                              value={personalInfo.email}
                              onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                              className="w-full h-11 px-4 rounded-xl border border-border bg-muted/30 focus:bg-card transition-all outline-none font-bold" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[12px] font-bold text-foreground">Phone Number</label>
                            <input 
                              type="text" 
                              value={personalInfo.phone}
                              onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                              className="w-full h-11 px-4 rounded-xl border border-border bg-muted/30 focus:bg-card transition-all outline-none font-bold" 
                            />
                          </div>
                          
                          <div className="pt-4">
                            <button 
                              onClick={handleSaveProfile} 
                              disabled={isSaving}
                              className={`w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg transition-all active:scale-95 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-primary/20'}`}
                            >
                              {isSaving ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save className="h-4 w-4" />}
                              {mounted ? t('settings.updateProfile') : 'Update Profile'}
                            </button>
                          </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-muted/30 border border-border space-y-6">
                           <div>
                             <h4 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest mb-4">Account Information</h4>
                             <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                   <span className="text-[13px] font-medium text-muted-foreground">Access Role</span>
                                   <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-black uppercase tracking-wider">{user?.role}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                   <span className="text-[13px] font-medium text-muted-foreground">Shop Identity</span>
                                   <span className="text-[13px] font-bold text-foreground">{businessSettings.name || "Main Branch"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                   <span className="text-[13px] font-medium text-muted-foreground">Account Status</span>
                                   <span className="flex items-center gap-1.5 text-[13px] font-bold text-emerald-600">
                                      <div className="h-2 w-2 rounded-full bg-emerald-600" /> Verified Active
                                   </span>
                                </div>
                             </div>
                           </div>
                           
                           <div className="pt-6 border-t border-border">
                              <h4 className="text-[12px] font-black text-muted-foreground uppercase tracking-widest mb-4">Security</h4>
                              <button className="w-full h-10 rounded-lg border border-border bg-card text-[12px] font-bold hover:bg-muted transition-all">Change Password</button>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* General Settings */}
                  {activeTab === "general" && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="mb-8 border-b border-border pb-6">
                        <h3 className="text-xl font-black text-foreground mb-1">{mounted ? t('settings.general') : 'General Configuration'}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{mounted ? t('settings.generalDesc') : 'Global system behavior and personalization'}</p>
                      </div>

                      <div className="space-y-8">
                        {/* Appearance Area */}
                        <div>
                          <label className="block text-[12px] font-black text-foreground uppercase tracking-widest mb-4">Platform Appearance</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button 
                              onClick={() => setTheme('light')}
                              className={`flex flex-col gap-3 p-4 rounded-xl border-2 transition-all text-left ${theme === 'light' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-transparent bg-muted/30 hover:border-border'}`}
                            >
                              <div className="h-12 w-full bg-card rounded-lg border border-border flex items-center px-3 gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <div className="h-1.5 w-16 bg-muted rounded-full" />
                              </div>
                              <span className={`text-[13px] font-bold flex items-center justify-between w-full ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`}>{mounted ? t('settings.lightMode') : 'Light Mode'} {theme === 'light' && <Check className="h-3.5 w-3.5" />}</span>
                            </button>
                            <button 
                              onClick={() => setTheme('dark')}
                              className={`flex flex-col gap-3 p-4 rounded-xl border-2 transition-all text-left ${theme === 'dark' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-transparent bg-muted/30 hover:border-border'}`}
                            >
                              <div className="h-12 w-full bg-[#0F172A] rounded-lg border border-border flex items-center px-3 gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <div className="h-1.5 w-16 bg-card/20 rounded-full" />
                              </div>
                              <span className={`text-[13px] font-bold flex items-center justify-between w-full ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`}>{mounted ? t('settings.darkMode') : 'Dark Mode'} {theme === 'dark' && <Check className="h-3.5 w-3.5" />}</span>
                            </button>
                            <button 
                              onClick={() => setTheme('system')}
                              className={`flex flex-col gap-3 p-4 rounded-xl border-2 transition-all text-left ${theme === 'system' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-transparent bg-muted/30 hover:border-border'}`}
                            >
                              <div className="h-12 w-full bg-gradient-to-r from-white to-[#0F172A] rounded-lg border border-border flex items-center px-3 gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                              </div>
                              <span className={`text-[13px] font-bold flex items-center justify-between w-full ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`}>{mounted ? t('settings.systemDefault') : 'System Default'} {theme === 'system' && <Check className="h-3.5 w-3.5" />}</span>
                            </button>
                          </div>
                        </div>

                        {/* Brand Management */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <label className="block text-[12px] font-black text-foreground uppercase tracking-widest">Accent Color</label>
                            <div className="flex flex-wrap gap-2">
                              {["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F472B6"].map((color) => (
                                <button 
                                  key={color}
                                  onClick={() => setAccentColor(color)}
                                  className={`h-10 w-10 rounded-full border-4 border-white shadow-md transition-all active:scale-90 ${accentColor === color ? 'ring-2 ring-primary scale-110' : 'hover:scale-110'}`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                              <button className="h-10 w-10 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-all">
                                <Palette className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[12px] font-black text-foreground uppercase tracking-widest mb-4 text-left">{mounted ? t('settings.branding') : 'Platform Branding'}</label>
                            <div className="flex items-center gap-4">
                               <input 
                                 type="file" 
                                 ref={fileInputRef} 
                                 className="hidden" 
                                 accept="image/*"
                                 onChange={(e) => {
                                   if(e.target.files && e.target.files[0]) {
                                     const file = e.target.files[0];
                                     const reader = new FileReader();
                                     reader.onloadend = () => {
                                       const base64String = reader.result as string;
                                       setLogoPreview(base64String);
                                       setAppearance(prev => ({ ...prev, logoUrl: base64String }));
                                     };
                                     reader.readAsDataURL(file);
                                     setLogoFileName(file.name)
                                    }
                                  }}
                               />
                               <div 
                                 onClick={() => fileInputRef.current?.click()}
                                 className="h-16 w-16 rounded-2xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all overflow-hidden relative"
                               >
                                  {logoPreview ? (
                                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                  ) : (
                                    <>
                                      <Upload className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Logo</span>
                                    </>
                                  )}
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[13px] font-bold text-foreground">{logoFileName}</span>
                                  <span className="text-[11px] text-muted-foreground font-medium">{mounted ? t('settings.logoRecommended') : 'Recommended: 512x512px SVG or PNG'}</span>
                                  <button onClick={() => fileInputRef.current?.click()} className="text-[11px] font-bold text-primary hover:underline mt-1 text-left">{mounted ? t('settings.replaceGraphic') : 'Replace Graphic'}</button>
                               </div>
                            </div>
                          </div>
                        </div>

                         {/* Localization */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                           <div className="space-y-2">
                             <label className="block text-[12px] font-bold text-foreground">{t('settings.language')}</label>
                             <div className="relative">
                               <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                               <select 
                                 value={businessSettings.language}
                                 onChange={(e) => {
                                   const newLang = e.target.value;
                                   setBusinessSettings({...businessSettings, language: newLang});
                                   i18n.changeLanguage(newLang);
                                 }}
                                 className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-muted/50 text-[13px] font-bold shadow-inner focus:bg-card transition-all outline-none"
                               >
                                  <option value="en">English (United States)</option>
                                  <option value="si">Sinhala (Sri Lanka)</option>
                                  <option value="ta">Tamil (Sri Lanka)</option>
                                </select>
                             </div>
                           </div>
                           <div className="space-y-2">
                             <label className="block text-[12px] font-bold text-foreground">{mounted ? t('settings.timezone') : 'System Timezone'}</label>
                             <select 
                               value={businessSettings.timezone}
                               onChange={(e) => setBusinessSettings({...businessSettings, timezone: e.target.value})}
                               className="w-full h-11 px-4 rounded-xl border border-border bg-muted/50 text-[13px] font-bold shadow-inner focus:bg-card transition-all outline-none"
                             >
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
                        <h3 className="text-xl font-black text-foreground mb-1">{mounted ? t('settings.business') : 'Business Profile'}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{mounted ? t('settings.businessDesc') : 'Manage your shop identity and contact details'}</p>
                      </div>

                      <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="block text-[12px] font-bold text-foreground">{mounted ? t('settings.businessName') : 'Official Business Name'}</label>
                              <input 
                                type="text" 
                                value={businessSettings.name} 
                                onChange={(e) => setBusinessSettings({...businessSettings, name: e.target.value})}
                                className="w-full h-11 px-4 rounded-xl border border-border bg-muted/50 text-[14px] font-black focus:bg-card transition-all outline-none" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-[12px] font-bold text-foreground">{mounted ? t('settings.tin') : 'Tax Identification Number (TIN)'}</label>
                              <input 
                                type="text" 
                                value={businessSettings.tin} 
                                onChange={(e) => setBusinessSettings({...businessSettings, tin: e.target.value})}
                                className="w-full h-11 px-4 rounded-xl border border-border bg-muted/50 text-[14px] font-black focus:bg-card transition-all outline-none" 
                              />
                            </div>
                         </div>

                         <div className="space-y-2">
                           <label className="block text-[12px] font-bold text-foreground">{mounted ? t('settings.hqAddress') : 'Headquarters Address'}</label>
                           <textarea 
                             rows={3} 
                             value={businessSettings.address}
                             onChange={(e) => setBusinessSettings({...businessSettings, address: e.target.value})}
                             className="w-full p-4 rounded-xl border border-border bg-muted/50 text-[13px] font-medium focus:bg-card transition-all outline-none resize-none" 
                           />
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                            <div className="space-y-2">
                              <label className="block text-[12px] font-bold text-foreground">{mounted ? t('settings.supportEmail') : 'Customer Support Email'}</label>
                              <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input 
                                  type="email" 
                                  value={businessSettings.email} 
                                  onChange={(e) => setBusinessSettings({...businessSettings, email: e.target.value})}
                                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-muted/50 text-[13px] font-bold outline-none" 
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-[12px] font-bold text-foreground">{mounted ? t('settings.primaryContact') : 'Primary Contact'}</label>
                              <div className="relative">
                                <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input 
                                  type="text" 
                                  value={businessSettings.phone} 
                                  onChange={(e) => setBusinessSettings({...businessSettings, phone: e.target.value})}
                                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-muted/50 text-[13px] font-bold outline-none" 
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-[12px] font-bold text-foreground">{mounted ? t('settings.website') : 'Official Website'}</label>
                              <div className="relative">
                                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input 
                                  type="text" 
                                  value={businessSettings.website} 
                                  onChange={(e) => setBusinessSettings({...businessSettings, website: e.target.value})}
                                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-muted/50 text-[13px] font-bold outline-none" 
                                />
                              </div>
                            </div>
                         </div>

                         <div className="pt-8 space-y-4">
                           <label className="block text-[12px] font-black text-foreground uppercase tracking-widest">{mounted ? t('settings.billing') : 'Billing & Currency'}</label>
                           <div className="p-6 rounded-2xl border border-border bg-muted/50 flex items-center justify-between shadow-inner">
                              <div className="flex items-center gap-4">
                                 <div className="h-12 w-12 rounded-xl bg-card shadow-sm border border-border flex items-center justify-center">
                                    <CreditCard className="h-6 w-6 text-primary" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[14px] font-black text-foreground">{mounted ? t('settings.systemCurrency') : 'System Currency: LKR (Rs.)'}</span>
                                    <span className="text-[12px] text-muted-foreground font-medium">{mounted ? t('settings.currencyDesc') : 'All financial reports and invoices use this currency.'}</span>
                                 </div>
                              </div>
                              <select 
                                value={businessSettings.currency}
                                onChange={(e) => setBusinessSettings({...businessSettings, currency: e.target.value})}
                                className="h-10 px-4 rounded-lg border border-border bg-card text-[12px] font-bold text-foreground outline-none"
                              >
                                 <option value="LKR">LKR (Rs.)</option>
                                 <option value="USD">USD ($)</option>
                                 <option value="EUR">EUR (€)</option>
                              </select>
                           </div>
                         </div>
                      </div>
                    </div>
                  )}

                  {/* Notification Rules */}
                  {activeTab === "notifications" && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="mb-8 border-b border-border pb-6">
                        <h3 className="text-xl font-black text-foreground mb-1">{mounted ? t('settings.notifications') : 'Notification Rules'}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{mounted ? t('settings.notificationsDesc') : 'Control how and when your team and customers get notified'}</p>
                      </div>

                      <div className="space-y-10">
                         {/* Customer Alerts */}
                         <section>
                            <h4 className="text-[12px] font-black text-primary uppercase tracking-widest mb-6">Customer Communication Matrix</h4>
                            <div className="space-y-4">
                               {[
                                 { key: 'booking', title: "Booking Confirmation", desc: "Sent instantly when a new repair is registered." },
                                 { key: 'status', title: "Status Updates", desc: "Sent when repair moves to a new stage in the workflow." },
                                 { key: 'completion', title: "Completion Alert", desc: "Sent when a device is ready for collection." },
                                 { key: 'invoice', title: "Invoice Issued", desc: "Sent when a final invoice is generated for the customer." }
                               ].map((rule) => {
                                 const config = (notifications as any)[rule.key];
                                 return (
                                 <div key={rule.title} className="flex items-center justify-between p-5 rounded-2xl border border-border hover:bg-muted/50 transition-all">
                                    <div className="max-w-[70%]">
                                       <h5 className="text-[14px] font-black text-foreground">{rule.title}</h5>
                                       <p className="text-[12px] text-muted-foreground font-medium">{rule.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                       <div className="flex flex-col items-center gap-2">
                                          <div 
                                            onClick={() => setNotifications({ ...notifications, [rule.key]: { ...config, email: !config.email }})}
                                            className={`h-6 w-11 rounded-full relative transition-all cursor-pointer ${config.email ? 'bg-primary' : 'bg-muted'}`}
                                          >
                                             <div className={`h-4 w-4 rounded-full bg-card absolute top-1 shadow-sm transition-all ${config.email ? 'left-6' : 'left-1'}`} />
                                          </div>
                                          <span className="text-[10px] font-black text-muted-foreground uppercase">Email</span>
                                       </div>
                                       <div className="flex flex-col items-center gap-2">
                                          <div 
                                            onClick={() => setNotifications({ ...notifications, [rule.key]: { ...config, sms: !config.sms }})}
                                            className={`h-6 w-11 rounded-full relative transition-all cursor-pointer ${config.sms ? 'bg-primary' : 'bg-muted'}`}
                                          >
                                             <div className={`h-4 w-4 rounded-full bg-card absolute top-1 shadow-sm transition-all ${config.sms ? 'left-6' : 'left-1'}`} />
                                          </div>
                                          <span className="text-[10px] font-black text-muted-foreground uppercase">SMS</span>
                                       </div>
                                    </div>
                                 </div>
                               )})}
                            </div>
                         </section>

                         {/* Admin Alerts */}
                         <section>
                            <h4 className="text-[12px] font-black text-primary uppercase tracking-widest mb-6">Internal System Alerts</h4>
                            <div className="space-y-4">
                               {[
                                 { key: 'stock', title: "Low Stock Warning", desc: "Alerted when inventory drops below safety threshold." },
                                 { key: 'shifts', title: "Staff Shift Reminders", desc: "Sent to team members before their shift starts." },
                                 { key: 'errors', title: "Critical Error Logs", desc: "Urgent alerts for system or database anomalies." }
                               ].map((rule) => {
                                 const config = (notifications as any)[rule.key];
                                 return (
                                 <div key={rule.title} className="flex items-center justify-between p-5 rounded-2xl border border-border hover:bg-muted/50 transition-all">
                                    <div className="max-w-[70%]">
                                       <h5 className="text-[14px] font-black text-foreground">{rule.title}</h5>
                                       <p className="text-[12px] text-muted-foreground font-medium">{rule.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                       <div className="flex flex-col items-center gap-2">
                                          <div 
                                            onClick={() => setNotifications({ ...notifications, [rule.key]: { ...config, app: !config.app }})}
                                            className={`h-6 w-11 rounded-full relative transition-all cursor-pointer ${config.app ? 'bg-primary' : 'bg-muted'}`}
                                          >
                                             <div className={`h-4 w-4 rounded-full bg-card absolute top-1 shadow-sm transition-all ${config.app ? 'left-6' : 'left-1'}`} />
                                          </div>
                                          <span className="text-[10px] font-black text-muted-foreground uppercase">App</span>
                                       </div>
                                       <div className="flex flex-col items-center gap-2">
                                          <div 
                                            onClick={() => setNotifications({ ...notifications, [rule.key]: { ...config, email: !config.email }})}
                                            className={`h-6 w-11 rounded-full relative transition-all cursor-pointer ${config.email ? 'bg-primary' : 'bg-muted'}`}
                                          >
                                             <div className={`h-4 w-4 rounded-full bg-card absolute top-1 shadow-sm transition-all ${config.email ? 'left-6' : 'left-1'}`} />
                                          </div>
                                          <span className="text-[10px] font-black text-muted-foreground uppercase">Email</span>
                                       </div>
                                    </div>
                                 </div>
                               )})}
                            </div>
                         </section>
                      </div>
                    </div>
                  )}

                  {/* Security & Privacy */}
                  {activeTab === "security" && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="mb-8 border-b border-border pb-6">
                        <h3 className="text-xl font-black text-foreground mb-1">{mounted ? t('settings.security') : 'Security & Privacy'}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{mounted ? t('settings.securityDesc') : 'Protect your data and manage account security'}</p>
                      </div>

                      <div className="space-y-10">
                         {/* Audit Log Panel */}
                         <section>
                            <label className="block text-[12px] font-black text-primary uppercase tracking-widest mb-6">{mounted ? t('settings.securityFeatures') : 'Advanced Security Features'}</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="p-6 rounded-2xl border border-border bg-muted/50 flex flex-col gap-4">
                                  <div className="flex items-center gap-3">
                                     <div className="h-10 w-10 rounded-xl bg-card shadow-sm border border-border flex items-center justify-center">
                                        <Lock className="h-5 w-5 text-primary" />
                                     </div>
                                     <span className="text-[15px] font-black text-foreground">{mounted ? t('settings.twoFactor') : 'Two-Factor (2FA)'}</span>
                                  </div>
                                  <p className="text-[12px] text-muted-foreground font-medium leading-relaxed">{mounted ? t('settings.twoFactorDesc') : 'Adds an extra layer of security to your admin account by requiring a code from your phone.'}</p>
                                  <button 
                                    onClick={() => setSecurityRules({...securityRules, twoFactorEnabled: !securityRules.twoFactorEnabled})}
                                    className={`w-full h-10 rounded-lg text-white text-[12px] font-black uppercase tracking-tight transition-all ${securityRules.twoFactorEnabled ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#0F172A] hover:bg-black'}`}
                                  >
                                    {securityRules.twoFactorEnabled ? (mounted ? t('settings.twoFactorEnabled') : '2FA Enabled') : (mounted ? t('settings.enable2fa') : 'Enable Secure 2FA')}
                                  </button>
                               </div>
                               <div className="p-6 rounded-2xl border border-border bg-muted/50 flex flex-col gap-4">
                                  <div className="flex items-center gap-3">
                                     <div className="h-10 w-10 rounded-xl bg-card shadow-sm border border-border flex items-center justify-center">
                                        <Shield className="h-5 w-5 text-emerald-600" />
                                     </div>
                                     <span className="text-[15px] font-black text-foreground">{mounted ? t('settings.loginSessions') : 'Login Sessions'}</span>
                                  </div>
                                  <p className="text-[12px] text-muted-foreground font-medium leading-relaxed">You are currently logged in on <strong className="text-foreground">2 active devices</strong>. Clear all other sessions to secure account.</p>
                                  <button className="w-full h-10 rounded-lg border border-border bg-card text-[12px] font-black uppercase tracking-tight hover:bg-muted transition-all">{mounted ? t('settings.revokeAll') : 'Revoke All Sessions'}</button>
                               </div>
                            </div>
                         </section>

                         <section>
                            <h4 className="text-[12px] font-black text-foreground uppercase tracking-widest mb-4">{mounted ? t('settings.passwordReqs') : 'Password Requirements'}</h4>
                            <div className="space-y-3">
                               {[
                                 "Minimum 12 characters required",
                                 "Must include at least one uppercase letter",
                                 "Must include at least one special character",
                                 "Enforce password rotation every 90 days"
                               ].map((req, idx) => (
                                 <div key={idx} className="flex items-center gap-3">
                                    <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                       <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400 stroke-[3px]" />
                                    </div>
                                    <span className="text-[13px] font-medium text-muted-foreground">{req}</span>
                                 </div>
                               ))}
                            </div>
                         </section>

                         <section className="bg-destructive/10 p-8 rounded-[24px] border border-destructive/20">
                            <h4 className="text-[14px] font-black text-destructive uppercase tracking-widest mb-2 flex items-center gap-2">
                               <Building className="h-5 w-5" /> {mounted ? t('settings.deactivation') : 'Account Deactivation'}
                            </h4>
                            <p className="text-[13px] text-destructive/80 mb-6 font-medium leading-relaxed">Permanently delete your business profile and all associated data. This action cannot be undone and will erase all repair history and customer records.</p>
                            <button className="h-11 px-8 rounded-xl bg-destructive text-destructive-foreground text-[13px] font-black uppercase tracking-tight hover:bg-destructive/90 shadow-lg transition-all">{mounted ? t('settings.requestDeletion') : 'Request Deletion'}</button>
                         </section>
                      </div>
                    </div>
                  )}

                  {/* Team Management */}
                  {activeTab === "team" && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="mb-8 border-b border-border pb-6 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-black text-foreground mb-1">{mounted ? t('settings.team') : 'Team Management'}</h3>
                          <p className="text-sm text-muted-foreground font-medium">{mounted ? t('settings.teamDesc') : 'Manage permissions and team access levels'}</p>
                        </div>
                        <button onClick={() => setIsInviteModalOpen(true)} className="h-10 px-4 rounded-lg bg-primary text-white text-[12px] font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md">
                           <Users className="h-4 w-4" /> {mounted ? t('settings.inviteMember') : 'Invite Member'}
                        </button>
                      </div>

                      <div className="space-y-4">
                         {teamMembers.map((member) => (
                           <div key={member.email} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-border hover:shadow-md transition-all group bg-card gap-4 sm:gap-0">
                              <div className="flex items-center gap-4">
                                 <img src={`https://i.pravatar.cc/150?u=${member.name}`} className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover shadow-sm bg-muted shrink-0" alt="" />
                                 <div className="flex flex-col min-w-0 pr-2">
                                    <span className="text-[14px] sm:text-[15px] font-black text-foreground truncate">{member.name}</span>
                                    <span className="text-[11px] sm:text-[12px] text-muted-foreground font-medium truncate">{member.email}</span>
                                 </div>
                              </div>
                              
                              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3 sm:gap-8 bg-muted/30 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
                                 <div className="flex flex-col items-start sm:items-end">
                                    <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase mb-0.5 sm:mb-1">{mounted ? t('settings.systemRole') : 'System Role'}</span>
                                    <span className="text-[12px] sm:text-[13px] font-bold text-primary">{member.role}</span>
                                 </div>
                                 <div className="flex flex-col items-start sm:items-end min-w-[70px] sm:min-w-[80px]">
                                    <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase mb-0.5 sm:mb-1">{mounted ? t('common.status') : 'Status'}</span>
                                    <span className={`text-[11px] sm:text-[12px] font-bold ${member.status === 'Active' ? 'text-emerald-600' : 'text-amber-500'}`}>{member.status}</span>
                                 </div>
                                 <button 
                                   onClick={() => setActiveEditMember(member)}
                                   className="h-9 w-9 rounded-lg border border-border bg-card sm:bg-transparent flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors focus:outline-none shadow-sm sm:shadow-none"
                                 >
                                    <Settings className="h-4 w-4" />
                                 </button>
                                 {member.role !== 'OWNER' && (
                                   <button onClick={() => handleDeleteMember(member.id)} className="h-9 w-9 rounded-lg border border-red-100 bg-red-50 sm:bg-transparent flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors focus:outline-none shadow-sm sm:shadow-none">
                                      <Trash2 className="h-4 w-4" />
                                   </button>
                                 )}
                              </div>
                           </div>
                         ))}
                      </div>
                    </div>
                  )}

                  {/* Billing & Subscriptions */}
                  {activeTab === "billing" && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="mb-8 border-b border-border pb-6">
                        <h3 className="text-xl font-black text-foreground mb-1">Billing & Subscriptions</h3>
                        <p className="text-sm text-muted-foreground font-medium">Manage your plan, payments, and invoices</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Current Plan Overview */}
                        <div className="md:col-span-2 space-y-8">
                          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col md:flex-row gap-6 justify-between">
                            <div className="space-y-4">
                              <h4 className="text-[12px] font-black text-primary uppercase tracking-widest">Current Plan</h4>
                              <div>
                                <h2 className="text-3xl font-black text-foreground">
                                  {apiSettings?.subscription?.plan === 'ENTERPRISE' ? 'Enterprise' : 
                                   apiSettings?.subscription?.plan === 'PRO' ? 'Professional' : 'Standard'} Plan
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {apiSettings?.subscription?.plan === 'ENTERPRISE' ? 'Unlimited everything, priority support.' : 
                                   apiSettings?.subscription?.plan === 'PRO' ? 'Advanced features for growing businesses.' : 'Perfect for small repair shops.'}
                                </p>
                              </div>
                              <div className="flex items-center gap-4 text-[13px] font-bold">
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${apiSettings?.subscription?.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                  <div className={`h-2 w-2 rounded-full ${apiSettings?.subscription?.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                                  {apiSettings?.subscription?.status || 'UNKNOWN'}
                                </span>
                                <span className="text-muted-foreground">
                                  Renews on {apiSettings?.subscription?.endDate ? new Date(apiSettings.subscription.endDate).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end justify-center gap-3">
                              <span className="text-4xl font-black text-foreground">
                                {apiSettings?.subscription?.plan === 'ENTERPRISE' ? '$99' : 
                                 apiSettings?.subscription?.plan === 'PRO' ? '$49' : '$29'}
                                <span className="text-lg text-muted-foreground font-medium">/mo</span>
                              </span>
                              <button 
                                onClick={() => handleRenewSubscription('PRO')}
                                disabled={isRenewing}
                                className={`h-10 px-6 rounded-xl bg-primary text-primary-foreground font-bold shadow-md hover:shadow-primary/20 transition-all ${isRenewing ? 'opacity-70' : ''}`}
                              >
                                {isRenewing ? 'Processing...' : 'Upgrade/Renew Plan'}
                              </button>
                            </div>
                          </div>

                          {/* Payment Methods */}
                          <div>
                            <h4 className="text-[12px] font-black text-foreground uppercase tracking-widest mb-4">Payment Methods</h4>
                            <div className="p-5 rounded-2xl border border-border bg-muted/30 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-16 bg-card rounded shadow-sm border border-border flex items-center justify-center">
                                  <span className="font-black text-[14px] text-blue-600 italic">VISA</span>
                                </div>
                                <div>
                                  <p className="text-[14px] font-bold text-foreground">Visa ending in 4242</p>
                                  <p className="text-[12px] text-muted-foreground">Expires 12/26</p>
                                </div>
                              </div>
                              <button className="text-[12px] font-bold text-primary hover:underline">Edit</button>
                            </div>
                          </div>
                        </div>

                        {/* Invoices List */}
                        <div className="space-y-4">
                          <h4 className="text-[12px] font-black text-foreground uppercase tracking-widest">Recent Invoices</h4>
                          <div className="flex flex-col gap-3">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="p-4 rounded-xl border border-border bg-card flex justify-between items-center group hover:border-primary/30 transition-all cursor-pointer">
                                <div>
                                  <p className="text-[13px] font-bold text-foreground">INV-{2024000 + i}</p>
                                  <p className="text-[11px] text-muted-foreground">May {i}, 2024</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[13px] font-bold text-foreground">$49.00</span>
                                  <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
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

      {/* MODAL: INVITE TEAM MEMBER */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-3xl w-full max-w-[450px] shadow-2xl overflow-hidden border border-border animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-border bg-muted/50">
               <h3 className="text-xl font-black text-foreground">{mounted ? t('settings.inviteTeamMember') : 'Invite Team Member'}</h3>
               <p className="text-sm text-muted-foreground font-medium mt-1">Send a registration link to join the system.</p>
            </div>
            <div className="p-6 space-y-5">
               <div className="space-y-2">
                 <label className="text-[12px] font-bold text-foreground uppercase tracking-wide">{mounted ? t('settings.fullName') : 'Full Name'}</label>
                 <input 
                   type="text" 
                   value={newInvite.name} 
                   onChange={e => setNewInvite({...newInvite, name: e.target.value})}
                   placeholder="e.g. Liam Smith" 
                   className="w-full h-11 px-4 rounded-xl border border-border bg-muted/50 text-[14px] font-black focus:bg-card outline-none focus:ring-2 focus:ring-[#4F46E5]/20" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[12px] font-bold text-foreground uppercase tracking-wide">{mounted ? t('settings.corporateEmail') : 'Corporate Email'}</label>
                 <input 
                   type="email" 
                   value={newInvite.email} 
                   onChange={e => setNewInvite({...newInvite, email: e.target.value})}
                   placeholder="liam@srm.com" 
                   className="w-full h-11 px-4 rounded-xl border border-border bg-muted/50 text-[14px] font-black focus:bg-card outline-none focus:ring-2 focus:ring-[#4F46E5]/20" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[12px] font-bold text-foreground uppercase tracking-wide">{mounted ? t('settings.systemRole') : 'System Role'}</label>
                 <select 
                   value={newInvite.role} 
                   onChange={e => setNewInvite({...newInvite, role: e.target.value})}
                   className="w-full h-11 px-4 rounded-xl border border-border bg-muted/50 text-[14px] font-black focus:bg-card outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                 >
                   <option>Super Admin</option>
                   <option>Logistics Manager</option>
                   <option>Senior Technician</option>
                   <option>Junior Technician</option>
                   <option>Front Desk Agent</option>
                 </select>
               </div>
               <div className="flex gap-3 pt-4 border-t border-border">
                  <button onClick={() => setIsInviteModalOpen(false)} className="flex-1 h-11 rounded-xl border border-border bg-card text-[13px] font-bold hover:bg-muted transition-all">Cancel</button>
                  <button onClick={handleInviteSubmit} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white text-[13px] font-black shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all">Send Invitation</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TEAM MEMBER */}
      {activeEditMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-3xl w-full max-w-[450px] shadow-2xl overflow-hidden border border-border animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-border bg-muted/50">
               <h3 className="text-xl font-black text-foreground">Edit Platform Access</h3>
               <p className="text-sm text-muted-foreground font-medium mt-1">Modify permissions for {activeEditMember.name}.</p>
            </div>
            <div className="p-6 space-y-5">
               <div className="space-y-2">
                 <label className="text-[12px] font-bold text-foreground uppercase tracking-wide">System Role</label>
                 <select 
                   value={activeEditMember.role} 
                   onChange={e => setActiveEditMember({...activeEditMember, role: e.target.value})}
                   className="w-full h-11 px-4 rounded-xl border border-border bg-muted/50 text-[14px] font-black focus:bg-card outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                 >
                   <option>Super Admin</option>
                   <option>Logistics Manager</option>
                   <option>Senior Technician</option>
                   <option>Junior Technician</option>
                   <option>Front Desk Agent</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[12px] font-bold text-foreground uppercase tracking-wide">Account Status</label>
                 <select 
                   value={activeEditMember.status} 
                   onChange={e => setActiveEditMember({...activeEditMember, status: e.target.value})}
                   className="w-full h-11 px-4 rounded-xl border border-border bg-muted/50 text-[14px] font-black focus:bg-card outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                 >
                   <option value="Active">Active</option>
                   <option value="Pending">Pending (Awaiting Email confirmation)</option>
                   <option value="Suspended">Suspended (System Locked)</option>
                 </select>
               </div>
               
               {activeEditMember.status === 'Suspended' && (
                  <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 mt-2">
                    <p className="text-[12px] text-destructive font-bold leading-tight">This user is currently suspended. They cannot log in, assign repairs, or view the CRM layer.</p>
                  </div>
               )}

               <div className="flex gap-3 pt-4 border-t border-border">
                  <button onClick={() => setActiveEditMember(null)} className="flex-1 h-11 rounded-xl border border-border bg-card text-[13px] font-bold hover:bg-muted transition-all">Discard Changes</button>
                  <button onClick={handleEditMemberSubmit} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white text-[13px] font-black shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all">Update Access</button>
               </div>
            </div>
          </div>
        </div>
      )}
      
      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card rounded-[32px] w-full max-w-[400px] shadow-2xl overflow-hidden border border-border animate-in zoom-in-95 duration-300">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">Changes Saved!</h3>
              <p className="text-sm text-muted-foreground font-medium mb-8">
                Your system settings and branding have been updated successfully.
              </p>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
