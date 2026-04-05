"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { DashboardFooter } from "@/components/admin/dashboard/footer"
import { 
  Plus, 
  X, 
  Camera, 
  Search, 
  ChevronDown, 
  Check, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Monitor, 
  ShieldCheck,
  UserPlus,
  ArrowRight,
  History,
  Info,
  ChevronRight,
} from "lucide-react"

export default function RegisterDevicePage() {
  const router = useRouter()
  
  // Form States
  const [deviceType, setDeviceType] = useState("Mobile Phone")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [imei, setImei] = useState("")
  const [serial, setSerial] = useState("")
  const [color, setColor] = useState("")
  const [storage, setStorage] = useState("")
  const [condition, setCondition] = useState("New")
  const [ownerId, setOwnerId] = useState("")
  const [ownerSearch, setOwnerSearch] = useState("")
  const [warrantyProvider, setWarrantyProvider] = useState("None")
  const [warrantyExpiry, setWarrantyExpiry] = useState("")
  const [notes, setNotes] = useState("")

  // UI States
  const [currentStep, setCurrentStep] = useState(1)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isCustomerSearching, setIsCustomerSearching] = useState(false)

  // Scroll Refs
  const section1Ref = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)
  const section4Ref = useRef<HTMLDivElement>(null)

  const steps = [
    { id: 1, name: "Basic Information", icon: Smartphone, ref: section1Ref as React.RefObject<HTMLDivElement> },
    { id: 2, name: "Device Specifications", icon: Info, ref: section2Ref as React.RefObject<HTMLDivElement> },
    { id: 3, name: "Owner Assignment", icon: UserPlus, ref: section3Ref as React.RefObject<HTMLDivElement> },
    { id: 4, name: "Warranty & Notes", icon: ShieldCheck, ref: section4Ref as React.RefObject<HTMLDivElement> },
  ]

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    for (let i = steps.length - 1; i >= 0; i--) {
      const el = steps[i].ref.current
      if (el && el.offsetTop <= container.scrollTop + 150) {
        if (currentStep !== steps[i].id) setCurrentStep(steps[i].id)
        break
      }
    }
  }

  const navigateToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccessModalOpen(true)
  }

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />
      
      <div className="flex-1 lg:ml-[200px] ml-0 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="flex-1 flex flex-col pt-0 overflow-y-auto bg-[#F8FAFC]" onScroll={handleScroll}>
          {/* Action Header - Secondary below global Header */}
          <header className="h-[72px] bg-white border-b border-border flex items-center justify-between px-8 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/devices" 
              className="h-10 w-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-[#F8FAFC] transition-all"
            >
              <X className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-[20px] font-black text-[#0F172A] tracking-tight">Register New Device</h1>
              <p className="text-[12px] text-muted-foreground font-medium">Add a unique device profile to the system</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => router.back()} className="h-10 px-6 rounded-xl border border-border bg-white text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-all">Cancel</button>
             <button 
               onClick={handleSubmit}
               className="h-10 px-8 rounded-xl bg-primary text-[13px] font-black text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
             >
               Confirm Registration <ChevronRight className="h-4 w-4" />
             </button>
          </div>
        </header>

        <div className="flex-1 flex min-h-0">
          {/* Scroll Spy Sidebar */}
          <aside className="w-[300px] border-r border-border bg-white p-6 hidden xl:block overflow-y-auto">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Registration Progress</p>
               {steps.map((step) => (
                 <button
                   key={step.id}
                   onClick={() => navigateToSection(step.ref)}
                   className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
                     currentStep === step.id 
                       ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                       : "text-muted-foreground hover:bg-muted"
                   }`}
                 >
                   <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${currentStep === step.id ? "bg-white/20" : "bg-muted"}`}>
                      <step.icon className="h-5 w-5" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[13px] font-black tracking-tight">{step.name}</span>
                      <span className={`text-[11px] font-medium opacity-70 ${currentStep === step.id ? "text-white" : "text-muted-foreground"}`}>
                        {currentStep > step.id ? "Completed" : currentStep === step.id ? "In Progress" : "Upcoming"}
                      </span>
                   </div>
                 </button>
               ))}
            </div>
            
            <div className="mt-10 p-5 rounded-2xl bg-amber-50 border border-amber-200">
               <div className="flex items-center gap-2 text-amber-700 mb-2">
                 <Info className="h-4 w-4" />
                 <span className="text-[12px] font-bold uppercase tracking-tight">Pro Tip</span>
               </div>
               <p className="text-[12px] text-amber-800 font-medium leading-relaxed">
                 Linking a device to a customer account allows for automated warranty tracking and repair history grouping.
               </p>
            </div>
          </aside>

          {/* Form Content */}
          <div 
            className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth"
          >
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-16">
              
              {/* Section 1: Basic Info */}
              <section ref={section1Ref} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-primary">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <h2 className="text-[22px] font-black text-[#0F172A] tracking-tight">Basic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">Device Category</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Mobile Phone", icon: Smartphone },
                        { label: "Tablet", icon: Tablet },
                        { label: "Laptop", icon: Laptop },
                        { label: "Console", icon: Monitor },
                      ].map((type) => (
                        <button
                          key={type.label}
                          type="button"
                          onClick={() => setDeviceType(type.label)}
                          className={`h-14 rounded-xl border flex items-center gap-3 px-4 transition-all ${
                            deviceType === type.label 
                              ? "border-primary bg-indigo-50 text-primary ring-2 ring-primary/10" 
                              : "border-border bg-white text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <type.icon className="h-4.5 w-4.5" />
                          <span className="text-[13px] font-bold">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">Brand Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Apple, Samsung, Sony"
                        className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">Model Name / Number</label>
                      <input 
                        type="text" 
                        placeholder="e.g. iPhone 14 Pro Max"
                        className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-border/60" />

              {/* Section 2: Specifications */}
              <section ref={section2Ref} className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Info className="h-5 w-5" />
                  </div>
                  <h2 className="text-[22px] font-black text-[#0F172A] tracking-tight">Technical Specifications</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">IMEI Number (Primary)</label>
                    <input 
                      type="text" 
                      placeholder="15-digit unique ID"
                      className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:border-[#F59E0B] transition-all shadow-sm"
                      value={imei}
                      onChange={(e) => setImei(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">Serial Number</label>
                    <input 
                      type="text" 
                      placeholder="Manufacturer serial"
                      className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:border-[#F59E0B] transition-all shadow-sm"
                      value={serial}
                      onChange={(e) => setSerial(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">Physical Color</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Pacific Blue"
                      className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:border-[#F59E0B] transition-all shadow-sm"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">Storage Capacity</label>
                    <select 
                      className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:border-[#F59E0B] transition-all shadow-sm appearance-none outline-none"
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                    >
                      <option value="">Select Capacity</option>
                      <option value="64GB">64 GB</option>
                      <option value="128GB">128 GB</option>
                      <option value="256GB">256 GB</option>
                      <option value="512GB">512 GB</option>
                      <option value="1TB">1 TB</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:bg-muted transition-all">
                   <div className="h-14 w-14 rounded-full bg-white shadow-md flex items-center justify-center text-muted-foreground">
                      <Camera className="h-6 w-6" />
                   </div>
                   <div>
                      <p className="text-[14px] font-black text-[#0F172A]">Drop device photos here</p>
                      <p className="text-[12px] text-muted-foreground font-medium">Capture initial condition (front, back, sides)</p>
                   </div>
                   <button type="button" className="px-5 h-9 rounded-lg bg-white border border-border text-[12px] font-bold shadow-sm hover:bg-muted transition-colors">Select Files</button>
                </div>
              </section>

              <hr className="border-border/60" />

              {/* Section 3: Owner Assignment */}
              <section ref={section3Ref} className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <h2 className="text-[22px] font-black text-[#0F172A] tracking-tight">Owner Assignment</h2>
                </div>

                <div className="space-y-6">
                   <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search for an existing customer by name or phone..."
                        className="w-full h-14 pl-12 pr-6 rounded-2xl border-2 border-border bg-white text-[14px] font-bold focus:border-emerald-500 ring-emerald-500/10 transition-all outline-none"
                        value={ownerId}
                        onChange={(e) => setOwnerId(e.target.value)}
                      />
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="h-px bg-border flex-1"></div>
                      <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">or</span>
                      <div className="h-px bg-border flex-1"></div>
                   </div>
                   <button type="button" className="w-full h-14 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 text-emerald-700 text-[14px] font-black hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                      <Plus className="h-4.5 w-4.5" /> Register a New Customer First
                   </button>
                </div>
              </section>

              <hr className="border-border/60" />

              {/* Section 4: Warranty & Notes */}
              <section ref={section4Ref} className="space-y-8 pb-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-[22px] font-black text-[#0F172A] tracking-tight">Warranty & Extra Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">Warranty Provider</label>
                      <select 
                        className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:border-sky-500 appearance-none outline-none"
                        value={warrantyProvider}
                        onChange={(e) => setWarrantyProvider(e.target.value)}
                      >
                         <option value="None">No Warranty / Out of Scope</option>
                         <option value="Manufacturer">Manufacturer (Apple/Samsung)</option>
                         <option value="Retailer">Retailer (Amazon/BestBuy)</option>
                         <option value="In-House">In-House Service Plan</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">Warranty Expiry Date</label>
                      <input 
                        type="date" 
                        className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:border-sky-500 outline-none"
                        value={warrantyExpiry}
                        onChange={(e) => setWarrantyExpiry(e.target.value)}
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">Internal Condition Notes</label>
                   <textarea 
                     rows={5}
                     placeholder="Mention any existing scratches, damages, or specific instructions for technicians..."
                     className="w-full p-5 rounded-2xl border border-border bg-white text-[14px] font-medium focus:border-sky-500 outline-none resize-none transition-all"
                     value={notes}
                     onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
              </section>
            </form>
          </div>
        </div>
          
          <div className="h-12" /> {/* Layout Spacer */}
          <DashboardFooter />
        </main>

        {/* Success Modal */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"></div>
             <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative p-8 text-center flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[#D1FAE5] flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                   <Check className="h-10 w-10 text-emerald-600 stroke-[3px]" />
                </div>
                <h3 className="text-[22px] font-black text-[#0F172A] tracking-tight mb-2">Device Registered!</h3>
                <p className="text-[14px] text-muted-foreground font-medium mb-8">
                  Profile for <strong>{brand} {model}</strong> has been created and synced successfully.
                </p>
                <div className="flex flex-col w-full gap-3">
                   <button 
                     onClick={() => router.push("/admin/devices")}
                     className="w-full h-14 rounded-2xl bg-primary text-white text-[15px] font-black shadow-lg shadow-indigo-500/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                   >
                     Go to Inventory <ArrowRight className="h-4.5 w-4.5" />
                   </button>
                   <button 
                     onClick={() => setIsSuccessModalOpen(false)}
                     className="w-full h-12 rounded-xl text-[13px] font-black text-muted-foreground hover:bg-muted transition-all"
                   >
                     Add Another Device
                   </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}
