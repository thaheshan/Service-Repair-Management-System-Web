"use client"

import { useState, useEffect } from "react"
import { Plus, UserPlus, Calendar, X, Search, ShoppingCart } from "lucide-react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { useGetCustomersQuery, useCreateCustomerMutation } from "@/services/api/customersApiSlice"
import { useCreateRepairMutation } from "@/services/api/repairsApiSlice"
import { useCreateDeviceMutation } from "@/services/api/devicesApiSlice"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { toast } from "sonner"

export function ActionButtons() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const [open, setOpen] = useState(false)
  const [quickRepairOpen, setQuickRepairOpen] = useState(false)
  
  const { data: customersData } = useGetCustomersQuery({})
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation()
  const [createRepair, { isLoading: isCreatingRepair }] = useCreateRepairMutation()
  const [createDevice] = useCreateDeviceMutation()
  const { user } = useSelector((state: RootState) => state.auth)

  const customersList = customersData?.data || []

  const [customerForm, setCustomerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: ""
  })

  // Quick Repair state
  const [quickRepair, setQuickRepair] = useState({
    customerId: "",
    repairType: "Screen Replacement",
    customType: "",
    model: "",
    price: "",
    file: null as File | null
  })

  // Customer search & popup state for Quick Repair
  const [customerSearchText, setCustomerSearchText] = useState("")
  const [selectedCustomerObj, setSelectedCustomerObj] = useState<any>(null)
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false)
  const [newQuickCustomer, setNewQuickCustomer] = useState({ name: "", phone: "", email: "" })

  const staffDeptOverride = typeof window !== 'undefined' ? localStorage.getItem('staff_dept') : null;
  const userRole = user?.role || 'TECHNICIAN';
  const rawDept = user?.department || user?.dept || user?.departmentName || (userRole !== 'ADMIN' ? staffDeptOverride : "") || ""
  const deptStr = typeof rawDept === 'string' ? rawDept.toLowerCase().trim() : ""
  
  const isGlobalAdmin = userRole === 'ADMIN' && (!deptStr || deptStr === 'all' || deptStr === 'super' || deptStr === 'admin')
  const isInventoryDept = !isGlobalAdmin && (deptStr.includes('inventory') || deptStr === 'inventory')

  const filteredCustomers = (customersData?.data || customersData?.customers || []).filter((c: any) => {
    if (!customerSearchText.trim()) return false;
    const q = customerSearchText.toLowerCase();
    return (c.name || "").toLowerCase().includes(q) || (c.phone || "").includes(q);
  })

  const handleQuickAddCustomer = async () => {
    if (!newQuickCustomer.name || !newQuickCustomer.phone) {
      toast.error("Customer name and phone number are required");
      return;
    }
    try {
      const created = await createCustomer({
        name: newQuickCustomer.name,
        phone: newQuickCustomer.phone,
        email: newQuickCustomer.email,
        shopId: user?.shopId,
        tenantId: user?.tenantId
      }).unwrap();
      const newCust = created?.data || created;
      const custId = newCust?.id || newCust?.customerId || created?.customerId;
      
      setSelectedCustomerObj(newCust);
      setCustomerSearchText(`${newQuickCustomer.name} (${newQuickCustomer.phone})`);
      setQuickRepair(p => ({ ...p, customerId: custId }));
      setAddCustomerModalOpen(false);
      setNewQuickCustomer({ name: "", phone: "", email: "" });
      toast.success("Customer added and selected!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create customer");
    }
  }

  const handleCreateCustomer = async () => {
    if (!customerForm.firstName || !customerForm.phone) {
      alert("First name and phone are required");
      return;
    }
    try {
      await createCustomer({
        tenantId: user?.tenantId,
        shopId: user?.shopId,
        name: `${customerForm.firstName} ${customerForm.lastName}`.trim(),
        phone: customerForm.phone,
        email: customerForm.email,
        address: customerForm.address
      }).unwrap();
      alert("Customer Added Successfully!");
      setOpen(false);
      setCustomerForm({ firstName: "", lastName: "", email: "", phone: "", address: "" });
    } catch (err: any) {
      alert("Failed to create customer");
    }
  }

  const handleCreateQuickRepair = async () => {
    if (!quickRepair.model) {
      toast.error("Model is required");
      return;
    }
    if (!user?.shopId) {
      toast.error("Shop ID not found. Please log in again.");
      return;
    }

    try {
      let finalCustomerId = quickRepair.customerId;

      // If no customer selected, auto-create a Walk-in Customer
      if (!finalCustomerId) {
        const newCust = await createCustomer({
          name: customerSearchText.trim() || "Walk-in Customer",
          phone: "+94 00 000 0000",
          shopId: user.shopId,
          tenantId: user.tenantId
        }).unwrap();
        finalCustomerId = newCust.customerId || newCust.id || newCust.data?.id;
      }

      // Create Device record
      const newDev = await createDevice({
        type: "Mobile Phone",
        brand: "Other",
        model: quickRepair.model,
        customerId: finalCustomerId,
        shopId: user.shopId,
        tenantId: user.tenantId,
        status: "IN_SERVICE"
      }).unwrap();

      const finalIssue = quickRepair.repairType === "Other" 
        ? (quickRepair.customType || "Other Issue") 
        : quickRepair.repairType;

      const numericPrice = parseFloat(quickRepair.price || "0");

      const repairData = {
        shopId: user.shopId,
        customerId: finalCustomerId,
        deviceId: newDev?.data?.id || newDev?.id,
        issue: `${finalIssue} - ${quickRepair.model}`,
        estimatedCost: Math.round(numericPrice),
        finalCost: Math.round(numericPrice),
        advancePayment: 0,
        status: "NOT_STARTED",
        priority: "MEDIUM",
        photoUrls: []
      };

      await createRepair(repairData).unwrap();

      toast.success(`Quick Repair created for ${quickRepair.model}!`);
      setQuickRepairOpen(false);
      setQuickRepair({ customerId: "", customerName: "", customerPhone: "", repairType: "Screen Replacement", customType: "", model: "", price: "", file: null });
    } catch (err: any) {
      console.error("Failed to create quick repair:", err);
      toast.error(err?.data?.message || err?.message || "Failed to create quick repair");
    }
  }

  return (
    <>
      <div className={`grid w-full grid-cols-1 ${isInventoryDept ? 'sm:grid-cols-3' : 'sm:grid-cols-4'} gap-3 sm:gap-4`}>
        {isInventoryDept ? (
          <>
            <button
              onClick={() => setOpen(true)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-5 font-bold text-white transition-colors hover:bg-[#4338CA] shadow-sm"
            >
              <UserPlus className="h-4 w-4 shrink-0" />
              <span>Add Customer</span>
            </button>
            <Link href="/admin/inventory" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#10B981] px-5 font-bold text-white transition-colors hover:bg-[#059669] shadow-sm">
              <Plus className="h-4 w-4 shrink-0" />
              <span>Manage Inventory</span>
            </Link>
            <Link href="/admin/pos" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 font-bold text-foreground transition-colors hover:bg-muted shadow-sm">
              <ShoppingCart className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>Open POS</span>
            </Link>
          </>
        ) : (
          <>
            <Link href="/admin/repairs/new" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 font-semibold text-white transition-colors hover:bg-primary/90 shadow-sm">
              <Plus className="h-4 w-4 shrink-0" />
              <span>{mounted ? t('dashboard.actions.addRepair') : 'New Repair'}</span>
            </Link>

            <button
              onClick={() => setQuickRepairOpen(true)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 font-semibold text-white transition-colors hover:bg-emerald-700 shadow-sm"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>Add Quick Repair</span>
            </button>

            <button
              onClick={() => setOpen(true)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 font-semibold text-foreground transition-colors hover:bg-muted shadow-sm"
            >
              <UserPlus className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{mounted ? t('dashboard.actions.newCustomer') : 'Add Customer'}</span>
            </button>

            <Link href="/admin/schedule" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 font-semibold text-foreground transition-colors hover:bg-muted shadow-sm focus:outline-none">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{mounted ? t('dashboard.actions.viewSchedule') : 'View Schedule'}</span>
            </Link>
          </>
        )}
      </div>

      {/* Quick Repair Modal */}
      {quickRepairOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
          <div className="bg-card w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/50">
              <h2 className="text-[18px] font-black text-foreground flex items-center gap-2">
                <Plus className="h-5 w-5 text-emerald-600" /> Add Quick Repair
              </h2>
              <button onClick={() => setQuickRepairOpen(false)} className="h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none shadow-sm">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Customer Search / Selection */}
              <div className="relative">
                <label className="block text-[12px] font-bold text-foreground mb-1.5 flex items-center justify-between">
                  <span>Customer <span className="text-red-500">*</span></span>
                  {selectedCustomerObj && (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">✓ Selected</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerSearchText}
                    onChange={e => {
                      setCustomerSearchText(e.target.value);
                      setSelectedCustomerObj(null);
                      setQuickRepair(p => ({ ...p, customerId: "" }));
                    }}
                    placeholder="Search customer by name or phone..."
                    className="w-full h-10 rounded-lg border border-border bg-card pl-9 pr-8 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  {customerSearchText && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerSearchText("");
                        setSelectedCustomerObj(null);
                        setQuickRepair(p => ({ ...p, customerId: "" }));
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {customerSearchText.trim() && !selectedCustomerObj && (
                  <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-xl shadow-xl z-[120] max-h-48 overflow-y-auto mt-1 divide-y divide-border">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((c: any) => (
                        <div
                          key={c.id || c.customerId}
                          onClick={() => {
                            setSelectedCustomerObj(c);
                            setCustomerSearchText(`${c.name} (${c.phone || "No phone"})`);
                            setQuickRepair(p => ({ ...p, customerId: c.id || c.customerId }));
                          }}
                          className="p-2.5 hover:bg-muted/80 cursor-pointer text-xs transition-colors"
                        >
                          <p className="font-bold text-foreground">{c.name}</p>
                          <p className="text-[11px] text-muted-foreground">{c.phone || "No phone"}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-xs text-muted-foreground">
                        No customer found matching "{customerSearchText}"
                      </div>
                    )}
                  </div>
                )}

                {/* Add Customer Modal Trigger */}
                <div className="mt-1.5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setAddCustomerModalOpen(true)}
                    className="text-[12px] font-bold text-primary flex items-center gap-1 hover:underline focus:outline-none"
                  >
                    <Plus className="h-3.5 w-3.5" /> + Add New Customer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-foreground mb-1.5">Repair Type *</label>
                <select 
                  value={quickRepair.repairType} 
                  onChange={e => setQuickRepair({...quickRepair, repairType: e.target.value})}
                  className="w-full h-10 rounded-lg border border-border bg-card px-3 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="Screen Replacement">Screen Replacement</option>
                  <option value="Battery Replacement">Battery Replacement</option>
                  <option value="Charging Port Repair">Charging Port Repair</option>
                  <option value="Speaker/Mic Repair">Speaker/Mic Repair</option>
                  <option value="Software / OS Issue">Software / OS Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {quickRepair.repairType === "Other" && (
                <div>
                  <label className="block text-[12px] font-bold text-foreground mb-1.5">Specify Repair Issue / Custom Type *</label>
                  <input 
                    type="text" 
                    value={quickRepair.customType} 
                    onChange={e => setQuickRepair({...quickRepair, customType: e.target.value})} 
                    placeholder="Describe the issue (e.g. Back glass broken, Water damage)" 
                    className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  />
                </div>
              )}

              <div>
                <label className="block text-[12px] font-bold text-foreground mb-1.5">Model *</label>
                <input 
                  type="text" 
                  value={quickRepair.model} 
                  onChange={e => setQuickRepair({...quickRepair, model: e.target.value})} 
                  placeholder="e.g. iPhone 15 Pro, Samsung S23" 
                  className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-foreground mb-1.5">Price (LKR)</label>
                <input 
                  type="number" 
                  value={quickRepair.price} 
                  onChange={e => setQuickRepair({...quickRepair, price: e.target.value})} 
                  placeholder="e.g. 15000" 
                  className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-foreground mb-1.5">Input Files / Photos</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setQuickRepair({...quickRepair, file: e.target.files?.[0] || null})} 
                  className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
                />
              </div>

              <div className="flex w-full gap-3 pt-4 border-t border-border">
                <button onClick={() => setQuickRepairOpen(false)} className="flex-1 h-11 rounded-xl border border-border bg-card text-foreground font-bold hover:bg-muted transition-colors focus:outline-none">
                  Cancel
                </button>
                <button 
                  onClick={handleCreateQuickRepair} 
                  disabled={!quickRepair.model || isCreatingRepair}
                  className="flex-1 h-11 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md transition-colors focus:outline-none disabled:opacity-50"
                >
                  {isCreatingRepair ? "Saving..." : "Save Quick Repair"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Customer Popup Modal for Quick Repair */}
      {addCustomerModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-[3px] animate-in fade-in duration-200 p-4">
          <div className="bg-card w-full max-w-[420px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
            <div className="flex justify-between items-center p-5 border-b border-border bg-muted/50">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-primary" /> Add New Customer
              </h3>
              <button
                type="button"
                onClick={() => setAddCustomerModalOpen(false)}
                className="h-7 w-7 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="p-5 space-y-3.5">
              <div>
                <label className="block text-[12px] font-bold text-foreground mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={newQuickCustomer.name}
                  onChange={e => setNewQuickCustomer({...newQuickCustomer, name: e.target.value})}
                  placeholder="e.g. Sarah Anderson"
                  className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-foreground mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={newQuickCustomer.phone}
                  onChange={e => setNewQuickCustomer({...newQuickCustomer, phone: e.target.value})}
                  placeholder="e.g. +94 77 123 4567"
                  className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-foreground mb-1">Email Address <span className="text-muted-foreground font-normal">(Optional)</span></label>
                <input
                  type="email"
                  value={newQuickCustomer.email}
                  onChange={e => setNewQuickCustomer({...newQuickCustomer, email: e.target.value})}
                  placeholder="e.g. sarah@example.com"
                  className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setAddCustomerModalOpen(false)}
                  className="flex-1 h-10 rounded-xl border border-border bg-card text-foreground font-bold hover:bg-muted text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleQuickAddCustomer}
                  disabled={!newQuickCustomer.name || !newQuickCustomer.phone || isCreating}
                  className="flex-1 h-10 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 text-xs shadow-md transition-colors disabled:opacity-50"
                >
                  {isCreating ? "Saving..." : "Save Customer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
           <div className="bg-card w-full max-w-[600px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-border bg-muted/50">
                <h2 className="text-[18px] font-black text-foreground flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" /> {mounted ? t('dashboard.actions.addNewCustomer') || 'Add New Customer' : 'Add New Customer'}
                </h2>
                <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none shadow-sm">
                   <X className="h-4 w-4" />
                   <span className="sr-only">Close</span>
                </button>
              </div>
              <div className="p-6">
                 <div className="grid grid-cols-2 gap-5 mb-5">
                   <div>
                     <label className="block text-[12px] font-bold text-foreground mb-1.5">{mounted ? t('common.firstName') || 'First Name' : 'First Name'}</label>
                     <input type="text" value={customerForm.firstName} onChange={e => setCustomerForm({...customerForm, firstName: e.target.value})} placeholder="Sarah" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                   </div>
                   <div>
                     <label className="block text-[12px] font-bold text-foreground mb-1.5">{mounted ? t('common.lastName') || 'Last Name' : 'Last Name'}</label>
                     <input type="text" value={customerForm.lastName} onChange={e => setCustomerForm({...customerForm, lastName: e.target.value})} placeholder="Anderson" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-5 mb-5">
                   <div>
                     <label className="block text-[12px] font-bold text-foreground mb-1.5">{mounted ? t('common.email') || 'Email Address' : 'Email Address'}</label>
                     <input type="email" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} placeholder="sarah@example.com" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                   </div>
                   <div>
                     <label className="block text-[12px] font-bold text-foreground mb-1.5">{mounted ? t('common.phone') || 'Phone Number' : 'Phone Number'}</label>
                     <input type="tel" value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} placeholder="+94 77 ..." className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                   </div>
                 </div>

                 <div className="mb-6">
                   <label className="block text-[12px] font-bold text-foreground mb-1.5">{mounted ? t('common.address') || 'Address' : 'Address'}</label>
                   <input type="text" value={customerForm.address} onChange={e => setCustomerForm({...customerForm, address: e.target.value})} placeholder="Street Address, City" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                 </div>

                 <div className="mb-8">
                   <label className="block text-[12px] font-bold text-foreground mb-3">{mounted ? t('common.tags') || 'Customer Tags' : 'Customer Tags'}</label>
                   <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground cursor-pointer group px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-[#4F46E5] accent-[#4F46E5]" />
                        <span className="group-hover:text-foreground transition-colors">VIP</span>
                      </label>
                      <label className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground cursor-pointer group px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-[#4F46E5] accent-[#4F46E5]" />
                        <span className="group-hover:text-foreground transition-colors">Corporate</span>
                      </label>
                   </div>
                 </div>

                 <div className="flex flex-col-reverse sm:flex-row w-full gap-3 pt-4 border-t border-border">
                    <button onClick={() => setOpen(false)} className="w-full sm:flex-1 h-11 rounded-xl border border-border bg-card text-foreground font-bold hover:bg-muted transition-colors focus:outline-none">
                      {mounted ? t('common.cancel') : 'Cancel'}
                    </button>
                    <button 
                      onClick={handleCreateCustomer} 
                      disabled={isCreating}
                      className="w-full sm:flex-1 h-11 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-md transition-colors focus:outline-none disabled:opacity-50"
                    >
                      {isCreating ? (mounted ? t('common.saving') || 'Saving...' : "Saving...") : (mounted ? t('common.saveProfile') || "Save Customer Profile" : "Save Customer Profile")}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  )
}
