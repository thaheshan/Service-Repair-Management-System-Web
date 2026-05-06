"use client"

import { useState } from "react"
import { Plus, UserPlus, Calendar, X } from "lucide-react"
import Link from "next/link"
import { useCreateCustomerMutation } from "@/services/api/customersApiSlice"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

export function ActionButtons() {
  const [open, setOpen] = useState(false)
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation()
  const { user } = useSelector((state: RootState) => state.auth)

  const [customerForm, setCustomerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: ""
  })

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

  return (
    <>
      <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Link href="/admin/repairs/new" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-5 font-semibold text-white transition-colors hover:bg-[#4338CA] shadow-sm">
          <Plus className="h-4 w-4 shrink-0" />
          <span>New Repair</span>
        </Link>
        
        <button 
          onClick={() => setOpen(true)}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-card px-5 font-semibold text-foreground transition-colors hover:bg-muted shadow-sm"
        >
          <UserPlus className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span>Add Customer</span>
        </button>

        <Link href="/admin/schedule" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-card px-5 font-semibold text-foreground transition-colors hover:bg-muted shadow-sm focus:outline-none">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span>View Schedule</span>
        </Link>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
           <div className="bg-white w-full max-w-[600px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-border bg-[#F8FAFC]">
                <h2 className="text-[18px] font-black text-[#0F172A] flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-[#4F46E5]" /> Add New Customer
                </h2>
                <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#0F172A] transition-colors focus:outline-none shadow-sm">
                   <X className="h-4 w-4" />
                   <span className="sr-only">Close</span>
                </button>
              </div>
              <div className="p-6">
                 <div className="grid grid-cols-2 gap-5 mb-5">
                   <div>
                     <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">First Name</label>
                     <input type="text" value={customerForm.firstName} onChange={e => setCustomerForm({...customerForm, firstName: e.target.value})} placeholder="Sarah" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                   </div>
                   <div>
                     <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Last Name</label>
                     <input type="text" value={customerForm.lastName} onChange={e => setCustomerForm({...customerForm, lastName: e.target.value})} placeholder="Anderson" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-5 mb-5">
                   <div>
                     <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Email Address</label>
                     <input type="email" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} placeholder="sarah@example.com" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                   </div>
                   <div>
                     <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Phone Number</label>
                     <input type="tel" value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} placeholder="+94 77 ..." className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                   </div>
                 </div>

                 <div className="mb-6">
                   <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Address</label>
                   <input type="text" value={customerForm.address} onChange={e => setCustomerForm({...customerForm, address: e.target.value})} placeholder="Street Address, City" className="w-full h-10 rounded-lg border border-border px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]" />
                 </div>

                 <div className="mb-8">
                   <label className="block text-[12px] font-bold text-[#0F172A] mb-3">Customer Tags</label>
                   <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground cursor-pointer group px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-border text-[#4F46E5] focus:ring-[#4F46E5] accent-[#4F46E5]" />
                        <span className="group-hover:text-[#0F172A] transition-colors">VIP</span>
                      </label>
                      <label className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground cursor-pointer group px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded border-border text-[#4F46E5] focus:ring-[#4F46E5] accent-[#4F46E5]" />
                        <span className="group-hover:text-[#0F172A] transition-colors">Corporate</span>
                      </label>
                   </div>
                 </div>

                 <div className="flex flex-col-reverse sm:flex-row w-full gap-3 pt-4 border-t border-border">
                    <button onClick={() => setOpen(false)} className="w-full sm:flex-1 h-11 rounded-xl border border-border bg-white text-[#0F172A] font-bold hover:bg-muted transition-colors focus:outline-none">
                      Cancel
                    </button>
                    <button 
                      onClick={handleCreateCustomer} 
                      disabled={isCreating}
                      className="w-full sm:flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none disabled:opacity-50"
                    >
                      {isCreating ? "Saving..." : "Save Customer Profile"}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  )
}
