"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { 
  Plus, Shield, Star, Users, Trash2, Edit3, Save, X, 
  ChevronRight, ArrowLeft, Gem, Crown, UserCheck, Info
} from "lucide-react"
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/services/api/settingsApiSlice"
import { toast } from "sonner"
import Link from "next/link"
import { Loader2 } from "lucide-react"

interface Tier {
  id: string
  name: string
  description: string
  benefit: string
  color: string
}

const COLORS = [
  { name: 'Indigo', value: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE' },
  { name: 'Emerald', value: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
  { name: 'Amber', value: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
  { name: 'Rose', value: '#F43F5E', bg: '#FFF1F2', border: '#FECDD3' },
  { name: 'Violet', value: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
]

export default function ManageRolesPage() {
  const { data: settingsData, isLoading } = useGetSettingsQuery({})
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation()
  
  const [tiers, setTiers] = useState<Tier[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTier, setEditingTier] = useState<Tier | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    benefit: '',
    color: COLORS[0].value
  })

  useEffect(() => {
    if (settingsData?.settings?.customerTiers) {
      setTiers(settingsData.settings.customerTiers)
    } else if (!isLoading) {
      // Default tiers if none exist
      setTiers([
        { id: '1', name: 'VIP Customer', description: 'Priority repairs and discounted parts.', benefit: '15% Off All Services', color: '#8B5CF6' },
        { id: '2', name: 'Corporate Partner', description: 'Bulk billing and dedicated account management.', benefit: 'Net-30 Payment Terms', color: '#4F46E5' },
        { id: '3', name: 'Regular Customer', description: 'Standard repair flow and retail pricing.', benefit: 'Standard Support', color: '#10B981' },
      ])
    }
  }, [settingsData, isLoading])

  const handleSave = async (updatedTiers: Tier[]) => {
    try {
      await updateSettings({ customerTiers: updatedTiers }).unwrap()
      toast.success("Customer roles updated successfully")
    } catch (err) {
      toast.error("Failed to save roles")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let newTiers = [...tiers]
    
    if (editingTier) {
      newTiers = tiers.map(t => t.id === editingTier.id ? { ...t, ...formData } : t)
    } else {
      newTiers.push({ id: Math.random().toString(36).substr(2, 9), ...formData })
    }
    
    setTiers(newTiers)
    handleSave(newTiers)
    setIsModalOpen(false)
    setEditingTier(null)
    setFormData({ name: '', description: '', benefit: '', color: COLORS[0].value })
  }

  const handleDelete = (id: string) => {
    const newTiers = tiers.filter(t => t.id !== id)
    setTiers(newTiers)
    handleSave(newTiers)
  }

  const openEdit = (tier: Tier) => {
    setEditingTier(tier)
    setFormData({
      name: tier.name,
      description: tier.description,
      benefit: tier.benefit,
      color: tier.color
    })
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-8 w-8 animate-spin text-[#4F46E5]" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DashboardSidebar />
      
      <main className="flex-1 lg:ml-[200px]">
        <DashboardHeader />
        
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground mb-6 uppercase tracking-wider">
             <Link href="/admin/customers" className="hover:text-[#4F46E5] transition-colors">Customers</Link>
             <ChevronRight className="h-3 w-3" />
             <span className="text-[#0F172A]">Manage Roles</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[28px] font-black text-[#0F172A] tracking-tight mb-1">Customer Roles</h1>
              <p className="text-muted-foreground text-[14px]">Define tiers, benefits, and special handling for your customer segments.</p>
            </div>
            <button 
              onClick={() => { setEditingTier(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-[#4F46E5] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all active:scale-95 focus:outline-none"
            >
              <Plus className="h-5 w-5" /> Create New Role
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier) => {
              const colorInfo = COLORS.find(c => c.value === tier.color) || COLORS[0]
              return (
                <div 
                  key={tier.id} 
                  className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button onClick={() => openEdit(tier)} className="h-8 w-8 rounded-lg bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:border-[#4F46E5]/30 shadow-sm transition-all">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(tier.id)} className="h-8 w-8 rounded-lg bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-red-600 hover:border-red-200 shadow-sm transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div 
                      className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: colorInfo.bg, color: colorInfo.value }}
                    >
                      <Crown className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-black text-[#0F172A] leading-tight mb-1">{tier.name}</h3>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Permanent Data
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] text-[#334155] leading-relaxed mb-6 h-10 overflow-hidden line-clamp-2 italic">
                    "{tier.description}"
                  </p>

                  <div className="bg-[#F8FAFC] border border-border/50 rounded-xl p-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-white border border-border flex items-center justify-center text-[#4F46E5] shadow-sm">
                      <Gem className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Key Benefit</p>
                      <p className="text-[13px] font-black text-[#0F172A] truncate">{tier.benefit}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {tiers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-border text-center px-6">
               <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
                 <Shield className="h-10 w-10 text-muted-foreground/40" />
               </div>
               <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">No Customer Roles Defined</h3>
               <p className="text-muted-foreground text-[14px] max-w-sm mb-8">Segment your customers to provide better service and track business value across different tiers.</p>
               <button 
                 onClick={() => { setEditingTier(null); setIsModalOpen(true); }}
                 className="flex items-center gap-2 bg-[#4F46E5] text-white px-6 py-3 rounded-xl font-bold shadow-lg"
               >
                 <Plus className="h-5 w-5" /> Define First Role
               </button>
            </div>
          )}
        </div>
      </main>

      {/* Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300 p-4">
          <div className="bg-white w-full max-w-[500px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-border">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between p-8 pb-4">
                <div>
                  <h2 className="text-[20px] font-black text-[#0F172A] tracking-tight">
                    {editingTier ? "Edit Customer Role" : "Create New Role"}
                  </h2>
                  <p className="text-[12px] text-muted-foreground font-medium">Define segment properties and benefits.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 w-10 rounded-xl bg-[#F1F5F9] text-muted-foreground hover:text-[#0F172A] transition-colors flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-widest">Role Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. VIP Member"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-[#F8FAFC] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-widest">Description</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Describe who belongs in this segment..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 rounded-xl border border-border bg-[#F8FAFC] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-widest">Primary Benefit</label>
                  <div className="relative">
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. 10% discount on all repairs"
                      value={formData.benefit}
                      onChange={e => setFormData({ ...formData, benefit: e.target.value })}
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-[#F8FAFC] text-[14px] font-bold text-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
                    />
                    <Gem className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4F46E5]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#0F172A] mb-3 uppercase tracking-widest">Theme Color</label>
                  <div className="flex items-center gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-border">
                    {/* Native Picker Trigger */}
                    <div className="relative group">
                      <input 
                        type="color"
                        value={formData.color}
                        onChange={e => setFormData({ ...formData, color: e.target.value })}
                        className="h-14 w-14 rounded-xl border-none p-0 bg-transparent cursor-pointer overflow-hidden shadow-sm"
                      />
                      <div className="absolute inset-0 rounded-xl pointer-events-none ring-2 ring-inset ring-black/5" />
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <p className="text-[11px] font-black text-muted-foreground uppercase tracking-tighter">Hex Code / RGB</p>
                      <div className="relative">
                        <input 
                          type="text"
                          value={formData.color.toUpperCase()}
                          onChange={e => {
                            const val = e.target.value;
                            if (val.startsWith('#') && val.length <= 7) {
                              setFormData({ ...formData, color: val });
                            }
                          }}
                          className="w-full h-10 px-3 rounded-lg border border-border text-[13px] font-mono font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: formData.color }} />
                      </div>
                    </div>

                    <div className="hidden sm:flex gap-2">
                      {COLORS.slice(0, 3).map(c => (
                        <button 
                          key={c.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: c.value })}
                          className={`h-8 w-8 rounded-lg border-2 transition-all ${formData.color.toLowerCase() === c.value.toLowerCase() ? 'border-[#0F172A] scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
                          style={{ backgroundColor: c.value }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 font-medium italic">Click the color square to open the full RGB spectrum.</p>
                </div>

              </div>

              <div className="p-8 pt-0 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 rounded-xl border border-border font-bold text-[#0F172A] hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 h-12 rounded-xl bg-[#4F46E5] text-white font-bold shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  {editingTier ? "Update Role" : "Save Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
