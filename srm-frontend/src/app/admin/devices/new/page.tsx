"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
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
  Layers,
  Loader2,
} from "lucide-react"
import { useCreateDeviceMutation } from "@/services/api/devicesApiSlice"
import { useCreateCustomerMutation } from "@/services/api/customersApiSlice"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { toast } from "sonner"

export default function RegisterDevicePage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [createDevice, { isLoading: isCreating }] = useCreateDeviceMutation()
  const [createCustomer] = useCreateCustomerMutation()
  const { user } = useSelector((state: RootState) => state.auth)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Form States
  const [deviceType, setDeviceType] = useState("Mobile Phone")
  const [customDeviceType, setCustomDeviceType] = useState("")
  const [brand, setBrand] = useState("")
  const [customBrand, setCustomBrand] = useState("")
  const [model, setModel] = useState("")
  const [imei, setImei] = useState("")
  const [serial, setSerial] = useState("")
  const [color, setColor] = useState("")
  const [price, setPrice] = useState<string>("")
  const [storage, setStorage] = useState("")
  const [condition, setCondition] = useState("New")
  const [ownerId, setOwnerId] = useState("")
  const [ownerSearch, setOwnerSearch] = useState("")
  const [hasWarranty, setHasWarranty] = useState(false)
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
    { id: 1, name: mounted ? t('devicesPage.new.basicInfo') : "Basic Information", icon: Smartphone, ref: section1Ref as React.RefObject<HTMLDivElement> },
    { id: 2, name: mounted ? t('devicesPage.new.specs') : "Device Specs & Warranty", icon: Info, ref: section2Ref as React.RefObject<HTMLDivElement> },
    { id: 3, name: mounted ? t('devicesPage.new.ownerAssignment') : "Owner Assignment", icon: UserPlus, ref: section3Ref as React.RefObject<HTMLDivElement> },
    { id: 4, name: "Condition & Notes", icon: ShieldCheck, ref: section4Ref as React.RefObject<HTMLDivElement> },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!model) {
      toast.error("Device Name is required.")
      return
    }

    if (!user || !user.shopId) {
      toast.error("Session invalid. Please log in again.")
      return
    }

    try {
      // Logic for owner assignment (if ownerId is just a search string, we might need a separate flow)
      // For now, mirroring the modal behavior: create/find customer
      const customerIdResult = await createCustomer({
        name: ownerSearch || "Walk-in Customer",
        phone: "0000000000",
      }).unwrap()

      const customerId = customerIdResult.customerId || customerIdResult.id || (customerIdResult as any).data?.id

      await createDevice({
        shopId: user.shopId,
        customerId: customerId,
        brand: brand === "Other" ? customBrand : brand,
        model: model,
        serialNumber: imei || "N/A",
        type: deviceType,
        price: price ? Number(price) : 0,
        status: "Available",
        warrantyStatus: hasWarranty ? warrantyProvider : "None",
        warrantyExpiry: hasWarranty ? warrantyExpiry : null
      }).unwrap()

      toast.success("Device Registered Successfully!")
      setIsSuccessModalOpen(true)
    } catch (err: any) {
      toast.error(err.data?.message || "Registration failed")
    }
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
              <h1 className="text-[20px] font-black text-[#0F172A] tracking-tight">{mounted ? t('devicesPage.registerNew') : 'Register New Device'}</h1>
              <p className="text-[12px] text-muted-foreground font-medium">{mounted ? t('devicesPage.new.subtitle') : 'Add a unique device profile to the system'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => router.back()} className="h-10 px-6 rounded-xl border border-border bg-white text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-all">Cancel</button>
             <button 
               onClick={handleSubmit}
               className="h-10 px-8 rounded-xl bg-primary text-[13px] font-black text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
             >
               {mounted ? t('devicesPage.new.confirm') : 'Confirm Registration'} <ChevronRight className="h-4 w-4" />
             </button>
          </div>
        </header>

        <div className="flex-1 flex min-h-0">
          {/* Scroll Spy Sidebar */}
          <aside className="w-[300px] border-r border-border bg-white p-6 hidden xl:block overflow-y-auto">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">{mounted ? t('devicesPage.new.progress') : 'Registration Progress'}</p>
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
                        {currentStep > step.id ? (mounted ? t('devicesPage.new.completed') : "Completed") : currentStep === step.id ? (mounted ? t('devicesPage.new.inProgress') : "In Progress") : (mounted ? t('devicesPage.new.upcoming') : "Upcoming")}
                      </span>
                   </div>
                 </button>
               ))}
            </div>
            
            <div className="mt-10 p-5 rounded-2xl bg-amber-50 border border-amber-200">
               <div className="flex items-center gap-2 text-amber-700 mb-2">
                 <Info className="h-4 w-4" />
                 <span className="text-[12px] font-bold uppercase tracking-tight">{mounted ? t('devicesPage.new.proTip') : 'Pro Tip'}</span>
               </div>
               <p className="text-[12px] text-amber-800 font-medium leading-relaxed">
                 {mounted ? t('devicesPage.new.proTipDesc') : 'Linking a device to a customer account allows for automated warranty tracking and repair history grouping.'}
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
                  <h2 className="text-[22px] font-black text-[#0F172A] tracking-tight">{mounted ? t('devicesPage.new.basicInfo') : 'Basic Information'}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">{mounted ? t('devicesPage.new.category') : 'Device Category'}</label>
                    <div className="grid grid-cols-2 gap-3">
                       {[
                        { label: "Mobile Phone", icon: Smartphone, key: 'mobile' },
                        { label: "Tablet", icon: Tablet, key: 'tablet' },
                        { label: "Laptop", icon: Laptop, key: 'laptop' },
                        { label: "Console", icon: Monitor, key: 'console' },
                        { label: "Other", icon: Layers, key: 'other' },
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
                          <span className="text-[13px] font-bold">{mounted ? t(`devicesPage.new.${type.key}`) : type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {deviceType === "Other" && (
                      <div className="space-y-2 animate-in zoom-in-95 duration-300">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">{mounted ? t('devicesPage.new.customDeviceType') : 'Custom Device Type'}</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Drone, VR Headset"
                          className="w-full h-12 rounded-xl border border-primary bg-indigo-50/30 px-4 text-[14px] font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
                          value={customDeviceType}
                          onChange={(e) => setCustomDeviceType(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">{mounted ? t('devicesPage.new.brandName') : 'Brand Name'}</label>
                      <select 
                        className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm appearance-none outline-none"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      >
                        <option value="">{mounted ? t('common.optional') : 'Optional'}</option>
                        <option value="Apple">Apple</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Huawei">Huawei</option>
                        <option value="Xiaomi">Xiaomi</option>
                        <option value="Oppo">Oppo</option>
                        <option value="Vivo">Vivo</option>
                        <option value="Sony">Sony</option>
                        <option value="Nokia">Nokia</option>
                        <option value="Google">Google</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {brand === "Other" && (
                      <div className="space-y-2 animate-in zoom-in-95 duration-300">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">Custom Brand Name</label>
                        <input 
                          type="text" 
                          placeholder="Type brand name here..."
                          className="w-full h-12 rounded-xl border border-primary bg-indigo-50/30 px-4 text-[14px] font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
                          value={customBrand}
                          onChange={(e) => setCustomBrand(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">{mounted ? t('devicesPage.new.modelName') : 'Model Name / Number'}</label>
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
                  <h2 className="text-[22px] font-black text-[#0F172A] tracking-tight">{mounted ? t('devicesPage.new.techSpecs') : 'Technical Specifications'}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">{mounted ? t('devicesPage.new.imeiPrimary') : 'IMEI Number (Primary)'}</label>
                    <input 
                      type="text" 
                      placeholder="15-digit unique ID (Optional)"
                      className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:border-[#F59E0B] transition-all shadow-sm"
                      value={imei}
                      onChange={(e) => setImei(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">{mounted ? t('devicesPage.new.serialNumber') : 'Serial Number'}</label>
                    <input 
                      type="text" 
                      placeholder="Manufacturer serial (Optional)"
                      className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:border-[#F59E0B] transition-all shadow-sm"
                      value={serial}
                      onChange={(e) => setSerial(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">{mounted ? t('devicesPage.new.color') : 'Physical Color'}</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Deep Purple"
                      className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:border-[#F59E0B] transition-all shadow-sm"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">{mounted ? t('devicesPage.sellingPrice') : 'Selling Price (Rs.) *'}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-[14px]">Rs.</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full h-12 rounded-xl border border-border bg-white pl-12 pr-4 text-[15px] font-black text-primary focus:border-primary transition-all shadow-sm"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">{mounted ? t('devicesPage.new.storage') : 'Storage Capacity'}</label>
                    <select 
                      className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:border-[#F59E0B] transition-all shadow-sm appearance-none outline-none"
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                    >
                      <option value="">{mounted ? t('devicesPage.new.selectCapacity') : 'Select Capacity'}</option>
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
                      <p className="text-[14px] font-black text-[#0F172A]">{mounted ? t('devicesPage.new.dropPhotos') : 'Drop device photos here'}</p>
                      <p className="text-[12px] text-muted-foreground font-medium">{mounted ? t('devicesPage.new.captureCondition') : 'Capture initial condition (front, back, sides)'}</p>
                   </div>
                   <button type="button" className="px-5 h-9 rounded-lg bg-white border border-border text-[12px] font-bold shadow-sm hover:bg-muted transition-colors">{mounted ? t('devicesPage.new.selectFiles') : 'Select Files'}</button>
                </div>

                {/* Warranty Integration into Specs Section */}
                <div className="pt-4 space-y-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-sky-600" />
                    <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{mounted ? t('devicesPage.new.warrantyExtra') : 'Warranty Details'}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[13px] font-bold text-[#0F172A]">Is this device currently under warranty?</label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setHasWarranty(true)}
                        className={`flex-1 h-12 rounded-xl border-2 font-bold transition-all ${hasWarranty ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-lg shadow-sky-500/10' : 'border-border bg-white text-muted-foreground hover:bg-muted'}`}
                      >
                        Yes, Under Warranty
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setHasWarranty(false)
                          setWarrantyProvider("None")
                          setWarrantyExpiry("")
                        }}
                        className={`flex-1 h-12 rounded-xl border-2 font-bold transition-all ${!hasWarranty ? 'border-slate-400 bg-slate-50 text-slate-700 shadow-sm' : 'border-border bg-white text-muted-foreground hover:bg-muted'}`}
                      >
                        No / Expired
                      </button>
                    </div>
                  </div>

                  {hasWarranty && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="space-y-2">
                          <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">{mounted ? t('devicesPage.new.provider') : 'Warranty Provider'}</label>
                          <select 
                            className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:border-sky-500 appearance-none outline-none"
                            value={warrantyProvider}
                            onChange={(e) => setWarrantyProvider(e.target.value)}
                          >
                            <option value="Manufacturer">{mounted ? t('devicesPage.new.manufacturer') : 'Manufacturer (Apple/Samsung)'}</option>
                            <option value="Retailer">{mounted ? t('devicesPage.new.retailer') : 'Retailer (Amazon/BestBuy)'}</option>
                            <option value="In-House">{mounted ? t('devicesPage.new.inHouse') : 'In-House Service Plan'}</option>
                          </select>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">{mounted ? t('devicesPage.new.expiryDate') : 'Warranty Expiry Date'}</label>
                          <input 
                            type="date" 
                            className="w-full h-12 rounded-xl border border-border bg-white px-4 text-[14px] font-bold focus:border-sky-500 outline-none"
                            value={warrantyExpiry}
                            onChange={(e) => setWarrantyExpiry(e.target.value)}
                          />
                      </div>
                    </div>
                  )}
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
                        placeholder={mounted ? t('devicesPage.new.searchCustomer') : "Search for an existing customer by name or phone..."}
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
                      <Plus className="h-4.5 w-4.5" /> {mounted ? t('devicesPage.new.registerCustomerFirst') : 'Register a New Customer First'}
                   </button>
                </div>
              </section>

              <hr className="border-border/60" />

              {/* Section 4: Condition & Notes */}
              <section ref={section4Ref} className="space-y-8 pb-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#F8FAFC] border border-border flex items-center justify-center text-muted-foreground">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-[22px] font-black text-[#0F172A] tracking-tight">Condition & Internal Notes</h2>
                </div>

                <div className="space-y-2">
                   <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest pl-1">{mounted ? t('devicesPage.new.conditionNotes') : 'Internal Condition Notes'}</label>
                   <textarea 
                     rows={5}
                     placeholder={mounted ? t('devicesPage.new.mentionScratches') : "Mention any existing scratches, damages, or specific instructions for technicians..."}
                     className="w-full p-5 rounded-2xl border border-border bg-white text-[14px] font-medium focus:border-sky-500 outline-none resize-none transition-all"
                     value={notes}
                     onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
              </section>

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
                <h3 className="text-[22px] font-black text-[#0F172A] tracking-tight mb-2">{mounted ? t('devicesPage.new.successTitle') : 'Device Registered!'}</h3>
                <p className="text-[14px] text-muted-foreground font-medium mb-8">
                  {mounted ? t('devicesPage.new.successDesc', { brand, model }) : `Profile for ${brand} ${model} has been created and synced successfully.`}
                </p>
                <div className="flex flex-col w-full gap-3">
                   <button 
                     onClick={() => router.push("/admin/devices")}
                     className="w-full h-14 rounded-2xl bg-primary text-white text-[15px] font-black shadow-lg shadow-indigo-500/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                   >
                     {mounted ? t('devicesPage.new.goInventory') : 'Go to Inventory'} <ArrowRight className="h-4.5 w-4.5" />
                   </button>
                   <button 
                     onClick={() => setIsSuccessModalOpen(false)}
                     className="w-full h-12 rounded-xl text-[13px] font-black text-muted-foreground hover:bg-muted transition-all"
                   >
                     {mounted ? t('devicesPage.new.addAnother') : 'Add Another Device'}
                   </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}
