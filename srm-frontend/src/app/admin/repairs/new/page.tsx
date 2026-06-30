"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Search, ChevronDown, Check, Camera, Image as ImageIcon, Plus, X, Download, History, Info, ChevronRight } from "lucide-react"
import "@/app/globals.css"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { useCreateRepairMutation } from "@/services/api/repairsApiSlice"
import { useGetCustomersQuery, useCreateCustomerMutation } from "@/services/api/customersApiSlice"
import { useGetDevicesQuery, useCreateDeviceMutation } from "@/services/api/devicesApiSlice"
import { useGetStaffListQuery, useGetStaffContextQuery } from "@/services/api/staffApiSlice"
import { useGetInventoryItemsQuery } from "@/services/api/inventoryApiSlice"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { setCredentials } from "@/store/slices/authSlice"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

// Mock device icons
const PhoneIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const TabletIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const LaptopIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="12" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
const WatchIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/></svg>
const ConsoleIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><circle cx="16" cy="11" r="1"/><circle cx="18" cy="13" r="1"/><circle cx="16" cy="15" r="1"/><circle cx="14" cy="13" r="1"/><path d="M6 11v4"/><path d="M4 13h4"/></svg>
const OtherIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>

export default function CreateRepairPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const router = useRouter()

  // Form States
  const [deviceCategory, setDeviceCategory] = useState("Mobile Phone")
  const [customDeviceCategory, setCustomDeviceCategory] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
  const [customer, setCustomer] = useState("")
  const [deviceType, setDeviceType] = useState("Mobile Phone")
  const [brand, setBrand] = useState("Apple")
  const [customBrand, setCustomBrand] = useState("")
  const [model, setModel] = useState("iPhone 13 Pro")
  const [customModel, setCustomModel] = useState("")
  const [color, setColor] = useState("Space Gray")
  const [customColor, setCustomColor] = useState("")
  const [storage, setStorage] = useState("256GB")
  const [customStorage, setCustomStorage] = useState("")
  const [condition, setCondition] = useState("Excellent")
  const [customCondition, setCustomCondition] = useState("")
  const [issueCategory, setIssueCategory] = useState("Screen Damage")
  const [issueDescription, setIssueDescription] = useState("")
  const [serialNo, setSerialNo] = useState("")
  const [imei, setImei] = useState("")
  const [passcode, setPasscode] = useState("")
  const [internalNotes, setInternalNotes] = useState("")
  const [estimatedDate, setEstimatedDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]) // Default to 7 days from now
  const [accessories, setAccessories] = useState<string[]>([])
  
  // Custom Parts State
  const [partsRequired, setPartsRequired] = useState<string[]>(["Premium Screen Assembly - iPhone 13 Pro"])
  const [partInput, setPartInput] = useState("")
  
  // Pricing States
  const [laborCost, setLaborCost] = useState("0")
  const [partsCost, setPartsCost] = useState("0")
  const [discount, setDiscount] = useState("0")
  const [tax, setTax] = useState("0")
  const [advancePayment, setAdvancePayment] = useState("")
  const [applyDiscount, setApplyDiscount] = useState(true)

  // Assignment States
  const [technician, setTechnician] = useState("")
  const [status, setStatus] = useState("Pending")
  const [priority, setPriority] = useState("Medium")

  // Redux & API Hooks
  const { user, token } = useSelector((state: RootState) => state.auth)
  const [createRepair, { isLoading: isCreatingRepair }] = useCreateRepairMutation()
  const { data: customersData } = useGetCustomersQuery({})
  const [createCustomer] = useCreateCustomerMutation()
  const { data: staffData } = useGetStaffListQuery({}, { skip: !user?.shopId })
  const { data: userContext, error: userContextError } = useGetStaffContextQuery({}, { skip: !!user || !token })
  const [createDevice] = useCreateDeviceMutation()
  const { data: inventoryData } = useGetInventoryItemsQuery({}, { skip: !user?.shopId })

  const dispatch = useDispatch()

  // Re-hydrate user if missing but token exists
  useEffect(() => {
    const userData = userContext?.data || userContext;
    if (userData?.id && !user) {
      dispatch(setCredentials({
        user: userData,
        accessToken: token!
      }))
    }
  }, [userContext, user, token, dispatch])

  // UI States
  const [currentStep, setCurrentStep] = useState(1)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  
  // New Customer Modal States
  const [newCustomerName, setNewCustomerName] = useState("")
  const [newCustomerPhone, setNewCustomerPhone] = useState("")
  const [newCustomerEmail, setNewCustomerEmail] = useState("")
  
  const [currentRef, setCurrentRef] = useState("")

  useEffect(() => {
    setCurrentRef(`#REP-2026-0${Math.floor(10000 + Math.random() * 90000)}`)
  }, [])
  
  // Scroll Refs
  const section1Ref = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)
  const section4Ref = useRef<HTMLDivElement>(null)
  const printRef = useRef<HTMLDivElement>(null)

  // PDF Generation Logic
  const handleDownloadPDF = async () => {
    if (!printRef.current) return
    setIsGeneratingPDF(true)

    // Fix: html2canvas cannot parse modern `oklab()`/`oklch()` CSS color functions.
    const tempStyle = document.createElement('style')
    tempStyle.id = '__pdf_color_fix'
    tempStyle.textContent = `
      :root, * {
        --background: #ffffff !important;
        --foreground: #111111 !important;
        --muted: #f3f4f6 !important;
        --muted-foreground: #6b7280 !important;
        --border: #e5e7eb !important;
        --card: #ffffff !important;
        --card-foreground: #111111 !important;
        --primary: #4F46E5 !important;
        --primary-foreground: #ffffff !important;
        --secondary: #f3f4f6 !important;
        --secondary-foreground: #111111 !important;
        --accent: #f3f4f6 !important;
        --accent-foreground: #111111 !important;
        --ring: #4F46E5 !important;
        --input: #e5e7eb !important;
        color: inherit !important;
        background-color: transparent;
      }
      body, html { background-color: #ffffff !important; }
    `
    document.head.appendChild(tempStyle)

    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
      const canvas = await html2canvas(printRef.current, {
        scale: 2, 
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          const styles = clonedDoc.getElementsByTagName("style");
          for (let i = styles.length - 1; i >= 0; i--) {
            if (styles[i].id !== '__pdf_color_fix') {
              styles[i].remove();
            }
          }
          const links = clonedDoc.getElementsByTagName("link");
          for (let i = links.length - 1; i >= 0; i--) {
            if (links[i].rel === "stylesheet") {
              links[i].remove();
            }
          }

          const elements = clonedDoc.getElementsByTagName("*");
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            el.style.color = "#000000";
            if (el.classList.contains("bg-[#4F46E5]")) {
              el.style.backgroundColor = "#4F46E5";
              el.style.color = "#ffffff";
            }
          }
        }
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Invoice_${currentRef || 'Draft'}.pdf`)
    } catch (err) {
      console.error("Failed to generate PDF", err)
      toast.error("Failed to generate PDF. Make sure html2canvas and jspdf are installed.");
    } finally {
      document.getElementById('__pdf_color_fix')?.remove()
      setIsGeneratingPDF(false)
    }
  }
  
  // Scroll Spy Handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollPositions = [
      { step: 1, element: section1Ref.current },
      { step: 2, element: section2Ref.current },
      { step: 3, element: section3Ref.current },
      { step: 4, element: section4Ref.current },
    ]
    
    for (let i = scrollPositions.length - 1; i >= 0; i--) {
      const el = scrollPositions[i].element
      if (el && el.offsetTop <= container.scrollTop + 150) {
        if (currentStep !== scrollPositions[i].step) {
          setCurrentStep(scrollPositions[i].step)
        }
        break
      }
    }
  }

  const handleAddPart = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && partInput.trim() !== "") {
      e.preventDefault()
      setPartsRequired([...partsRequired, partInput.trim()])
      setPartInput("")
    }
  }

  const toggleAccessory = (acc: string) => {
    setAccessories(prev => prev.includes(acc) ? prev.filter(a => a !== acc) : [...prev, acc])
  }

  const pricingTotal = useMemo(() => {
    const l = parseFloat(laborCost || "0")
    const p = parseFloat(partsCost || "0")
    const subtotal = l + p
    const d = applyDiscount ? parseFloat(discount || "0") : 0
    const afterDiscount = Math.max(0, subtotal - d)
    const t = parseFloat(tax || "0")
    const computedTax = afterDiscount * (t / 100)
    return afterDiscount + computedTax
  }, [laborCost, partsCost, discount, applyDiscount, tax])

  const handleCreateRepair = async () => {
    if (!user?.shopId) {
      alert("Error: Shop ID not found. Please log in again.");
      return;
    }

    try {
      let finalCustomerId = selectedCustomerId;
      
      if (!finalCustomerId) {
        if (!customer.trim()) {
          alert("Please select or create a customer first.");
          return;
        }
        
        const newCust = await createCustomer({
          name: customer,
          phone: "+94 00 000 0000",
          shopId: user.shopId,
          tenantId: user.tenantId
        }).unwrap();
        finalCustomerId = newCust.customerId;
      }

      const newDev = await createDevice({
        type: deviceType === "Other" ? customDeviceCategory : deviceType,
        brand: brand === "Other" ? customBrand : brand,
        model: model === "Other" ? customModel : model,
        customerId: finalCustomerId,
        shopId: user.shopId,
        tenantId: user.tenantId,
        ...(serialNo && { serialNo }),
        ...(imei && { imei })
      }).unwrap();

      const repairData = {
        shopId: user.shopId,
        customerId: finalCustomerId,
        deviceId: newDev.data.id,
        issue: issueDescription || issueCategory,
        estimatedCost: Math.round(pricingTotal),
        technicianId: technician || null,
        status: status === "Pending" ? "NOT_STARTED" : 
                status === "In Progress" ? "IN_PROGRESS" : 
                status === "Ready" ? "READY_TO_TAKE" : "NOT_STARTED",
        priority: priority.toUpperCase()
      };

      await createRepair(repairData).unwrap();

      setIsConfirmModalOpen(false);
      setIsReceiptModalOpen(true);
    } catch (err: any) {
      console.error("Failed to create repair", err);
      toast.error(err.data?.message || err.message || "Failed to create repair task. Please check if your backend is synchronized.");
    }
  }

  const handleSaveDraft = async () => {
    if (!user?.shopId) return;
    
    try {
      if (!selectedCustomerId || !brand || !model) {
        alert("Basic customer and device info required to save a record.");
        return;
      }
      
      await handleCreateRepair();
      router.push("/admin/repairs");
    } catch (err) {
      console.error("Draft failed", err);
    }
  }

  const handleSaveCustomer = async () => {
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
      alert("Please enter at least a name and phone number.");
      return;
    }
    
    try {
      const result = await createCustomer({
        name: newCustomerName,
        phone: newCustomerPhone,
        email: newCustomerEmail || undefined,
        shopId: user?.shopId,
        tenantId: user?.tenantId
      }).unwrap();

      setCustomer(newCustomerName);
      setSelectedCustomerId(result.customerId);
      
      setIsCustomerModalOpen(false);
      setNewCustomerName("");
      setNewCustomerPhone("");
      setNewCustomerEmail("");
      
      toast.success("Customer created successfully!");
    } catch (err: any) {
      console.error("Failed to create customer", err);
      alert(err.data?.message || "Failed to create customer. Please check the details.");
    }
  }

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />
      
      <div className="flex-1 lg:ml-[200px] ml-0 flex flex-col min-w-0">
        <DashboardHeader />

        <main className="flex-1 flex flex-col pt-0 overflow-y-auto bg-muted/50" onScroll={handleScroll}>
          {/* Dashboard Context Header */}
          <div className="bg-card px-8 pt-6 pb-2 border-b border-border shadow-sm z-10 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium">
                <Link href="/admin/dashboard" className="hover:text-foreground transition-colors">{mounted ? t('common.dashboard') : 'Dashboard'}</Link>
                <span>&gt;</span>
                <Link href="/admin/repairs" className="hover:text-foreground transition-colors">{mounted ? t('common.repairs') : 'Repairs'}</Link>
                <span>&gt;</span>
                <span className="text-primary font-semibold">{mounted ? t('repairs.createNew') : 'Create New Repair'}</span>
              </div>
            </div>

            <div className="pb-4">
               <h1 className="text-[24px] sm:text-[28px] font-bold text-foreground tracking-tight leading-none">{mounted ? t('repairs.createNew') : 'Create New Repair'}</h1>
            </div>
            
            {/* Stepper */}
            <div className="flex items-center justify-between max-w-3xl mx-auto py-6 relative">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-muted -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
              
              {[
                { num: 1, label: mounted ? t('repairs.steps.basicInfo') : "Basic Info" },
                { num: 2, label: mounted ? t('repairs.steps.customerDevice') : "Customer & Device" },
                { num: 3, label: mounted ? t('repairs.steps.issuePricing') : "Issue & Pricing" },
                { num: 4, label: mounted ? t('repairs.steps.review') : "Review" }
              ].map((step) => {
                const isActive = currentStep >= step.num
                return (
                <div key={step.num} className="relative z-10 flex flex-col items-center gap-2 transition-all duration-300">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300 ${isActive ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 'bg-card border-2 border-border text-muted-foreground'}`}>
                    {step.num}
                  </div>
                  <span className={`hidden sm:block text-[11px] font-bold transition-colors duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground'} uppercase tracking-wider`}>{step.label}</span>
                </div>
              )})}
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div onScroll={handleScroll} className="flex-1 overflow-y-auto w-full pb-32 scroll-smooth">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-8 flex flex-col gap-8">
              
              {/* 1. Basic Information */}
              <section ref={section1Ref} className="bg-card rounded-xl shadow-sm border border-border p-6 scroll-mt-6">
                <h2 className="text-lg font-bold text-foreground mb-6">{mounted ? t('repairs.form.basicTitle') : 'Basic Information'}</h2>
                
                <div className="mb-6">
                  <label className="block text-[13px] font-bold text-foreground mb-3">{mounted ? t('repairs.form.category') : 'Repair Category'} <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-6 gap-3">
                    {[
                      {name: "Mobile Phone", icon: PhoneIcon, key: 'mobile'},
                      {name: "Tablet", icon: TabletIcon, key: 'tablet'},
                      {name: "Laptop", icon: LaptopIcon, key: 'laptop'},
                      {name: "Smartwatch", icon: WatchIcon, key: 'watch'},
                      {name: "Gaming Console", icon: ConsoleIcon, key: 'console'},
                      {name: "Other", icon: OtherIcon, key: 'other'}
                    ].map((cat) => (
                      <button 
                        key={cat.name}
                        onClick={() => {
                          setDeviceCategory(cat.name)
                          if (cat.name !== "Other") {
                            setDeviceType(cat.name)
                          }
                        }}
                        className={`flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 transition-all ${deviceCategory === cat.name ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:border-border hover:bg-muted/50'}`}
                      >
                        <cat.icon />
                        <span className="text-[12px] font-semibold text-center leading-tight px-2">{mounted ? t(`repairs.categories.${cat.key}`) : cat.name}</span>
                      </button>
                    ))}
                  </div>
                  {deviceCategory === "Other" && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                      <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.categories.specifyCustom') : 'Specify Custom Category'} <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={customDeviceCategory}
                        onChange={(e) => {
                          setCustomDeviceCategory(e.target.value)
                          setDeviceType(e.target.value)
                        }}
                        placeholder={mounted ? t("repairs.categories.customPlaceholder") : "e.g. Drone, VR Headset..."}
                        className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5 flex items-center gap-1">{mounted ? t('repairs.form.priority') : 'Priority'} <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className={`w-full h-10 rounded-lg border border-border bg-background pl-9 pr-10 text-sm font-bold appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5] ${
                          priority === "Urgent" ? "text-red-500" :
                          priority === "High" ? "text-orange-500" :
                          priority === "Medium" ? "text-blue-500" : "text-green-500"
                        }`}
                      >
                        <option value="Urgent" className="text-foreground bg-background font-medium">{mounted ? t('repairs.priorities.urgent') : 'Urgent'}</option>
                        <option value="High" className="text-foreground bg-background font-medium">{mounted ? t('repairs.priorities.high') : 'High'}</option>
                        <option value="Medium" className="text-foreground bg-background font-medium">{mounted ? t('repairs.priorities.medium') : 'Medium'}</option>
                        <option value="Low" className="text-foreground bg-background font-medium">{mounted ? t('repairs.priorities.low') : 'Low'}</option>
                      </select>
                      <div className={`absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full text-white flex items-center justify-center text-[8px] font-bold ${
                        priority === "Urgent" ? "bg-red-500" :
                        priority === "High" ? "bg-orange-500" :
                        priority === "Medium" ? "bg-blue-500" : "bg-green-500"
                      }`}>!</div>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5 flex items-center gap-1">{mounted ? t('repairs.form.estCompletion') : 'Estimated Completion Date'} <span className="text-red-500">*</span></label>
                    <div className="relative">
                       <input 
                         type="date" 
                         value={estimatedDate}
                         onChange={(e) => setEstimatedDate(e.target.value)}
                         className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                       />
                       <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.notes') : 'Internal Notes'} ({mounted ? t('common.optional') : 'Optional'})</label>
                  <textarea 
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder={mounted ? t("repairs.placeholders.notes") : "Add any internal notes about this repair..."}
                    className="w-full h-24 rounded-lg border border-border bg-background p-3 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder:text-muted-foreground/60"
                  />
                </div>
              </section>

              {/* 2. Customer Information */}
              <section ref={section2Ref} className="bg-card rounded-xl shadow-sm border border-border p-6 scroll-mt-6">
                 <h2 className="text-lg font-bold text-foreground mb-6">{mounted ? t('repairs.form.customerTitle') : 'Customer Information'}</h2>
                 <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.customer') : 'Customer'} <span className="text-red-500">*</span></label>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={customer}
                      onChange={(e) => {
                        setCustomer(e.target.value);
                        setSelectedCustomerId("");
                      }}
                      placeholder={mounted ? t('common.search') : "Search registered customers by name, phone..."}
                      className="w-full h-11 rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                    />
                    {/* Customer Dropdown */}
                    {customer && !selectedCustomerId && customersData?.customers && (
                      <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto mt-1">
                        {customersData.customers.filter((c: any) => 
                          c.name.toLowerCase().includes(customer.toLowerCase()) || 
                          (c.phone && c.phone.includes(customer))
                        ).map((c: any) => (
                          <div 
                            key={c.id} 
                            onClick={() => {
                              setCustomer(c.name);
                              setSelectedCustomerId(c.id);
                            }}
                            className="p-3 hover:bg-muted cursor-pointer text-sm border-b border-border last:border-0 text-foreground"
                          >
                            <p className="font-bold">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.phone}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={(e) => { e.preventDefault(); setIsCustomerModalOpen(true); }} className="text-[13px] font-bold text-primary flex items-center gap-1 hover:underline outline-none">
                    <Plus className="h-3.5 w-3.5" /> {mounted ? t('repairs.actions.newCustomer') : 'Create New Customer'}
                  </button>
               </section>

              {/* 3. Device Information */}
              <section className="bg-card rounded-xl shadow-sm border border-border p-6">
                 <h2 className="text-lg font-bold text-foreground mb-6">{mounted ? t('repairs.form.deviceTitle') : 'Device Information'}</h2>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.deviceType') : 'Device Type'} <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none appearance-none font-medium">
                          <option value="Mobile Phone" className="bg-background">{mounted ? t("repairs.categories.mobile") : "Mobile Phone"}</option>
                          <option value="Tablet" className="bg-background">{mounted ? t("repairs.categories.tablet") : "Tablet"}</option>
                          <option value="Laptop" className="bg-background">{mounted ? t("repairs.categories.laptop") : "Laptop"}</option>
                          <option value="Other" className="bg-background">{mounted ? t("repairs.categories.other") : "Other"}</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                      {deviceType === "Other" && (
                        <input type="text" value={customDeviceCategory} onChange={(e) => setCustomDeviceCategory(e.target.value)} placeholder={mounted ? t("repairs.placeholders.customDeviceType") : "Enter custom device type"} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm mt-2 text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5] animate-in fade-in slide-in-from-top-1" />
                      )}
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-foreground mb-1.5 flex items-center gap-1">{mounted ? t('repairs.form.brand') : 'Brand'} <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none appearance-none font-medium">
                          <option value="Apple" className="bg-background">Apple</option>
                          <option value="Samsung" className="bg-background">Samsung</option>
                          <option value="Google" className="bg-background">Google</option>
                          <option value="Other" className="bg-background">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                      {brand === "Other" && (
                        <input type="text" value={customBrand} onChange={(e) => setCustomBrand(e.target.value)} placeholder={mounted ? t("repairs.placeholders.customBrand") : "Enter custom brand"} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm mt-2 text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5] animate-in fade-in slide-in-from-top-1" />
                      )}
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.model') : 'Model'} <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none appearance-none font-medium">
                          <option value="iPhone 13 Pro" className="bg-background">iPhone 13 Pro</option>
                          <option value="iPhone 14 Pro" className="bg-background">iPhone 14 Pro</option>
                          <option value="iPhone 15 Pro" className="bg-background">iPhone 15 Pro</option>
                          <option value="Other" className="bg-background">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                      {model === "Other" && (
                        <input type="text" value={customModel} onChange={(e) => setCustomModel(e.target.value)} placeholder={mounted ? t("repairs.placeholders.customModel") : "Enter custom model"} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm mt-2 text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5] animate-in fade-in slide-in-from-top-1" />
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 sm:col-span-2">
                       <div className="flex-1">
                         <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.color') : 'Color'} ({mounted ? t('common.optional') : 'Optional'})</label>
                         <div className="relative">
                           <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none appearance-none font-medium">
                             <option value="Space Gray" className="bg-background">Space Gray</option>
                             <option value="Silver" className="bg-background">Silver</option>
                             <option value="Gold" className="bg-background">Gold</option>
                             <option value="Other" className="bg-background">Other</option>
                           </select>
                           <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                         </div>
                         {color === "Other" && (
                           <input type="text" value={customColor} onChange={(e) => setCustomColor(e.target.value)} placeholder={mounted ? t("repairs.placeholders.customColor") : "Enter custom color"} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm mt-2 text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5] animate-in fade-in slide-in-from-top-1" />
                         )}
                       </div>
                       <div className="flex-1">
                         <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.storage') : 'Storage Capacity'} ({mounted ? t('common.optional') : 'Optional'})</label>
                         <div className="relative">
                           <select value={storage} onChange={(e) => setStorage(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none appearance-none font-medium">
                             <option value="256GB" className="bg-background">256GB</option>
                             <option value="512GB" className="bg-background">512GB</option>
                             <option value="1TB" className="bg-background">1TB</option>
                             <option value="Other" className="bg-background">Other</option>
                           </select>
                           <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                         </div>
                         {storage === "Other" && (
                           <input type="text" value={customStorage} onChange={(e) => setCustomStorage(e.target.value)} placeholder={mounted ? t("repairs.placeholders.customStorage") : "Enter custom storage"} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm mt-2 text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5] animate-in fade-in slide-in-from-top-1" />
                         )}
                       </div>
                    </div>
                 </div>

                 <div className="mb-6">
                   <label className="block text-[13px] font-bold text-foreground mb-3">{mounted ? t('repairs.form.condition') : 'Device Condition'} ({mounted ? t('common.optional') : 'Optional'})</label>
                   <div className="flex items-center gap-4 flex-wrap">
                     {["Excellent", "Good", "Fair", "Poor", "Other"].map((cond) => (
                       <label key={cond} className="flex items-center gap-2 cursor-pointer text-foreground">
                         <input type="radio" name="condition" checked={condition === cond} onChange={() => setCondition(cond)} className="h-4 w-4 accent-[#4F46E5] dark:accent-indigo-500" />
                         <span className="text-[13px] font-medium">{mounted ? t(`repairs.options.${cond.toLowerCase()}`) : cond}</span>
                       </label>
                     ))}
                   </div>
                   {condition === "Other" && (
                     <input type="text" value={customCondition} onChange={(e) => setCustomCondition(e.target.value)} placeholder={mounted ? t("repairs.placeholders.customCondition") : "Specify custom condition"} className="w-full sm:w-[50%] h-10 rounded-lg border border-border bg-background px-3 text-sm mt-3 text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5] animate-in fade-in slide-in-from-top-1" />
                   )}
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.serialNo') : 'Serial Number'} ({mounted ? t('common.optional') : 'Optional'})</label>
                      <input 
                        type="text" 
                        value={serialNo}
                        onChange={(e) => setSerialNo(e.target.value)}
                        placeholder={mounted ? t("repairs.placeholders.serialNo") : "Enter Serial"} 
                        className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder:text-muted-foreground/60" 
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.imei') : 'IMEI Number'} ({mounted ? t('common.optional') : 'Optional'})</label>
                      <input 
                        type="text" 
                        value={imei}
                        onChange={(e) => setImei(e.target.value)}
                        placeholder={mounted ? t("repairs.placeholders.imei") : "Enter IMEI (for mobile devices)"} 
                        className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder:text-muted-foreground/60" 
                      />
                    </div>
                 </div>
                 
                 <div className="mb-6">
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.passcode') : 'Passcode / PIN'} ({mounted ? t('common.optional') : 'Optional'})</label>
                    <input 
                      type="text" 
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder={mounted ? t("repairs.placeholders.passcode") : "Used to verify device works after repair is complete"} 
                      className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder:text-muted-foreground/60" 
                    />
                 </div>

                 <div className="mb-6">
                   <label className="block text-[13px] font-bold text-foreground mb-3">{mounted ? t('repairs.form.accessories') : 'Device Accessories Included'} ({mounted ? t('common.optional') : 'Optional'})</label>
                   <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                     {["Charger", "Battery", "Case", "Original Box", "Mouse / Keyboard", "SD Card / SIM Tray", "Other"].map((acc) => {
                       const accKey = acc === "Original Box" ? "box" : acc === "Mouse / Keyboard" ? "mouseKeyboard" : acc === "SD Card / SIM Tray" ? "sdSim" : acc.toLowerCase();
                       const isChecked = accessories.includes(acc)
                       return (
                         <label key={acc} className="flex items-center gap-2 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleAccessory(acc); }}>
                           <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${isChecked ? 'bg-primary border-primary' : 'border-muted-foreground/30 bg-background group-hover:border-primary'}`}>
                              {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                           </div>
                           <span className="text-[13px] font-medium text-foreground select-none">{mounted ? t(`repairs.options.${accKey}`) : acc}</span>
                         </label>
                       )}
                     )}
                   </div>
                 </div>

                 <div>
                   <label className="block text-[13px] font-bold text-foreground mb-3">{mounted ? t('repairs.form.photos') : 'Device Photos'} ({mounted ? t('common.optional') : 'Optional'})</label>
                   <label className="w-full h-32 border-2 border-dashed border-border rounded-xl bg-muted/50/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/80 transition-colors block">
                     <input type="file" multiple accept="image/png, image/jpeg, image/jpg" className="hidden" />
                     <div className="flex items-center justify-center h-10 w-10 bg-card rounded-full shadow-sm text-muted-foreground">
                       <Camera className="h-5 w-5" />
                     </div>
                     <div className="text-center">
                       <span className="text-[13px] font-bold text-primary">{mounted ? t('repairs.actions.uploadPhotos') : 'Click to upload'}</span> <span className="text-[13px] font-medium text-muted-foreground">{mounted ? t('repairs.actions.dragDrop') : 'or drag and drop'}</span>
                       <p className="text-[11px] text-muted-foreground mt-0.5">{mounted ? t('repairs.actions.photoSpecs') : 'JPG, PNG, JPG up to 10MB (max 5 files)'}</p>
                     </div>
                   </label>
                 </div>
              </section>

              {/* 4. Issue & Repair Details / Pricing */}
              <section ref={section3Ref} className="bg-card rounded-xl shadow-sm border border-border p-6 scroll-mt-6">
                 <h2 className="text-lg font-bold text-foreground mb-6">{mounted ? t('repairs.form.issueTitle') : 'Issue & Repair Details'}</h2>
                 
                 <div className="mb-6">
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.issueCategory') : 'Issue Category'} <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select value={issueCategory} onChange={(e) => setIssueCategory(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none appearance-none font-medium">
                        <option value="Screen Damage" className="bg-background">{mounted ? t("repairs.options.screenDamage") : "Screen Damage"}</option>
                        <option value="Battery Issue" className="bg-background">{mounted ? t("repairs.options.batteryIssue") : "Battery Issue"}</option>
                        <option value="Water Damage" className="bg-background">{mounted ? t("repairs.options.waterDamage") : "Water Damage"}</option>
                        <option value="Software Issue" className="bg-background">{mounted ? t("repairs.options.softwareIssue") : "Software Issue"}</option>
                        <option value="Other" className="bg-background">{mounted ? t("repairs.options.other") : "Other"}</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                 </div>

                  <div className="mb-6">
                     <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.issueDesc') : 'Describe the Issue'} <span className="text-red-500">*</span></label>
                    <textarea 
                      value={issueDescription}
                      onChange={(e) => setIssueDescription(e.target.value)}
                      placeholder={mounted ? t("repairs.placeholders.issueDesc") : "Provide a detailed description of the problem reported by the customer..."}
                      className="w-full h-24 rounded-lg border border-border bg-background p-3 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder:text-muted-foreground/60"
                    />
                    <div className="text-right text-[10px] text-muted-foreground mt-1">0/500</div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.partsRequired') : 'Parts Required'} ({mounted ? t('common.optional') : 'Optional'})</label>
                   <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        value={partInput}
                        onChange={(e) => setPartInput(e.target.value)}
                        onKeyDown={handleAddPart}
                        placeholder={mounted ? t("repairs.placeholders.partSearch") : "Type part (e.g., Premium Screen Component) and press Enter to specify..."} 
                        className="w-full h-11 rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder:text-muted-foreground/60" 
                      />
                   </div>
                   <div className="flex flex-wrap items-center gap-2 mb-3">
                     {partsRequired.map((part, idx) => (
                       <div key={idx} className="px-3 py-1.5 border border-border rounded-lg bg-muted/50 flex items-center gap-2 inline-flex">
                         <span className="text-[12px] font-medium text-foreground">{part}</span>
                         <button onClick={(e) => { e.preventDefault(); setPartsRequired(partsRequired.filter((_, i) => i !== idx)) }} className="h-4 w-4 rounded-full bg-card border border-border flex items-center justify-center text-[10px] text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-200">
                           <X className="h-2.5 w-2.5" />
                         </button>
                       </div>
                     ))}
                     <button onClick={(e) => e.preventDefault()} className="text-[13px] font-bold text-primary flex items-center gap-1 hover:underline ml-2 outline-none">
                       <Plus className="h-3.5 w-3.5" /> {mounted ? t('repairs.actions.browseInventory') : 'Browse Inventory'}
                     </button>
                   </div>
                   {/* Live inventory dropdown */}
                   {partInput.trim().length > 0 && (() => {
                     const apiItems = inventoryData?.items || [];
                     const filtered = apiItems.filter((item: any) =>
                       (item.partName || item.name || "").toLowerCase().includes(partInput.toLowerCase())
                     );
                     return filtered.length > 0 ? (
                       <div className="border border-border rounded-xl shadow-md overflow-hidden mb-3">
                         <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-3 pt-2 pb-1 bg-muted/50">Inventory matches</p>
                         {filtered.map((item: any) => (
                           <div
                             key={item.id}
                             onClick={() => {
                               const partName = item.partName || item.name || "Unnamed Part";
                               const price = item.sellingPrice || item.price || 0;
                               if (!partsRequired.includes(partName)) {
                                 setPartsRequired(prev => [...prev, partName]);
                                 setPartsCost(prev => (parseFloat(prev || "0") + parseFloat(price.toString())).toString());
                               }
                               setPartInput("");
                             }}
                             className="px-3 py-2.5 hover:bg-muted cursor-pointer border-t border-border flex justify-between items-center gap-4 transition-colors"
                           >
                             <div>
                               <p className="text-sm font-bold text-foreground">{item.partName || item.name || "Unnamed Part"}</p>
                               {(item.partNumber || item.sku) && <p className="text-xs text-muted-foreground">SKU: {item.partNumber || item.sku}</p>}
                             </div>
                             <div className="text-right shrink-0">
                               <p className={`text-xs font-semibold ${(item.quantityInStock ?? item.stockQuantity ?? 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                 {(item.quantityInStock ?? item.stockQuantity ?? 0) > 0 ? (mounted ? t('repairs.pricing.inStock', { count: item.quantityInStock ?? item.stockQuantity }) : `${item.quantityInStock ?? item.stockQuantity ?? 0} in stock`) : (mounted ? t('repairs.pricing.outOfStock') : 'Out of stock')}
                               </p>
                               {(item.sellingPrice || item.price) && <p className="text-xs text-muted-foreground font-semibold">Rs. {(item.sellingPrice || item.price || 0).toLocaleString()}</p>}
                             </div>
                           </div>
                         ))}
                       </div>
                     ) : null;
                   })()}
                  </div>
              </section>

              {/* 5. Pricing & Quote */}
              <section ref={section4Ref} className="bg-card rounded-xl shadow-sm border border-border p-6 scroll-mt-6">
                 <h2 className="text-lg font-bold text-foreground mb-6">{mounted ? t('repairs.form.pricingTitle') : 'Pricing & Quote'}</h2>
                 
                 <div className="p-6 bg-muted/50/50 border border-border rounded-xl">
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-border mb-6">
                     <div>
                       <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.laborCost') : 'Labor Cost'}</label>
                       <div className="relative">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">{mounted ? t('repairs.pricing.currency') : 'Rs.'}</span>
                         <input 
                           type="number" 
                           value={laborCost} 
                           onChange={(e) => setLaborCost(e.target.value)}
                           className="w-full h-10 rounded-lg border border-border bg-background pl-9 pr-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                         />
                       </div>
                       <div className="text-[11px] text-muted-foreground mt-1.5">{mounted ? t('repairs.pricing.laborDuration', { hours: 2.5 }) : <>Based on <strong className="text-foreground">2.5 hours</strong> est. duration</>}</div>
                     </div>
                     <div>
                       <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.partsCost') : 'Parts Cost'}</label>
                       <div className="relative">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">{mounted ? t('repairs.pricing.currency') : 'Rs.'}</span>
                         <input 
                           type="number" 
                           value={partsCost} 
                           onChange={(e) => setPartsCost(e.target.value)}
                           className="w-full h-10 rounded-lg border border-border bg-background pl-9 pr-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                         />
                       </div>
                     </div>
                   </div>

                   <div className="flex justify-between items-center mb-6">
                       <label className="text-[13px] font-bold text-foreground flex items-center gap-2 cursor-pointer">
                         <input type="checkbox" checked={applyDiscount} onChange={(e) => setApplyDiscount(e.target.checked)} className="h-4 w-4 accent-[#4F46E5] dark:accent-indigo-500" />
                         {mounted ? t('repairs.pricing.addDiscount') : 'Add Discount (Optional)'}
                       </label>
                       {applyDiscount && (
                         <div className="flex gap-2">
                           <select className="h-10 w-24 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none appearance-none font-medium">
                             <option value="Flat Amount" className="bg-background">{mounted ? t('repairs.options.flatAmount') : 'Flat Amount'}</option>
                             <option value="Percentage" className="bg-background">{mounted ? t('repairs.options.percentage') : 'Percentage'}</option>
                           </select>
                           <div className="relative w-32">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">{mounted ? t('repairs.pricing.currency') : 'Rs.'}</span>
                             <input 
                               type="number" 
                               value={discount} 
                               onChange={(e) => setDiscount(e.target.value)}
                               className="w-full h-10 rounded-lg border border-[#EF4444] bg-background pl-9 pr-3 text-sm font-semibold text-foreground focus:outline-none" 
                             />
                           </div>
                         </div>
                       )}
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                     <div>
                       <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.tax') : 'Tax %'}</label>
                       <div className="relative">
                         <input 
                           type="number" 
                           value={tax}
                           onChange={(e) => setTax(e.target.value)}
                           className="w-full h-10 rounded-lg border border-border bg-background px-3 pr-8 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                         />
                         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">%</span>
                       </div>
                     </div>
                   </div>

                   <div className="pb-6 border-b border-border mb-6">
                     <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.advance') : 'Advance Payment / Deposit'} ({mounted ? t('common.optional') : 'Optional'})</label>
                     <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">{mounted ? t('repairs.pricing.currency') : 'Rs.'}</span>
                       <input 
                         type="number" 
                         value={advancePayment}
                         onChange={(e) => setAdvancePayment(e.target.value)}
                         placeholder="0.00" 
                         className="w-full h-10 rounded-lg border border-border bg-background pl-9 pr-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder:text-muted-foreground/60" 
                       />
                     </div>
                   </div>

                   {/* Price Summary Row */}
                   <div className="grid grid-cols-2 lg:flex lg:items-center lg:justify-between bg-primary/10 rounded-xl border border-primary/20 p-4 gap-y-4 gap-x-2">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wide">{mounted ? t('repairs.form.laborCost').split(' ')[0] : 'Labor'}</span>
                        <span className="text-[13px] font-bold text-foreground">Rs. {parseFloat(laborCost || "0").toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wide">{mounted ? t('repairs.form.partsCost').split(' ')[0] : 'Parts'}</span>
                        <span className="text-[13px] font-bold text-foreground">Rs. {parseFloat(partsCost || "0").toLocaleString()}</span>
                      </div>
                      {applyDiscount && (
                         <div className="flex flex-col">
                           <span className="text-[11px] font-bold text-red-500 uppercase tracking-wide">{mounted ? t('repairs.form.discount').split(' ')[0] : 'Discount'}</span>
                           <span className="text-[13px] font-bold text-red-500">-Rs. {parseFloat(discount || "0").toLocaleString()}</span>
                         </div>
                      )}
                      {(parseFloat(tax) > 0) && (
                         <div className="flex flex-col">
                           <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">{mounted ? t('repairs.form.tax').split(' ')[0] : 'Tax'}</span>
                           <span className="text-[13px] font-bold text-foreground">+{tax}%</span>
                         </div>
                      )}
                      <div className="hidden lg:block h-10 w-px bg-border mx-2" />
                      <div className="flex flex-col items-start lg:items-end col-span-2 lg:col-span-1 pt-2 lg:pt-0 border-t lg:border-0 border-border">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wide">{mounted ? t('repairs.form.total') : 'Total Quote'}</span>
                        <span className="text-[20px] font-black text-primary">Rs. {pricingTotal.toLocaleString()}</span>
                      </div>
                   </div>
                   
                 </div>
              </section>

              {/* 6. Assignment & Workflow */}
              <section className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
                 <h2 className="text-lg font-bold text-foreground mb-6">{mounted ? t('repairs.form.assignmentTitle') : 'Assignment & Workflow'}</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.assignTech') : 'Assign Technician'} ({mounted ? t('common.optional') : 'Optional'})</label>
                       <div className="relative">
                        <select value={technician} onChange={(e) => setTechnician(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none appearance-none font-medium">
                          <option value="" className="bg-background">{mounted ? t('repairs.options.unassigned') : 'Unassigned'}</option>
                          {staffData?.staff?.map((staff: any) => (
                            <option key={staff.id} value={staff.id} className="bg-background">{staff.name || staff.fullName || staff.email}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-foreground mb-1.5">{mounted ? t('repairs.form.initialStatus') : 'Initial Repair Status'} <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-background pl-10 pr-3 text-sm focus:outline-none appearance-none font-bold text-foreground">
                          <option value="Pending" className="bg-background font-semibold">{mounted ? t('dashboard.status.notstarted') : 'Pending'}</option>
                          <option value="In Progress" className="bg-background font-semibold">{mounted ? t('dashboard.status.inprogress') : 'In Progress'}</option>
                          <option value="Ready" className="bg-background font-semibold">{mounted ? t('dashboard.status.readyto_take') : 'Ready'}</option>
                          <option value="On Hold" className="bg-background font-semibold">{mounted ? t('repairs.options.onHold') : 'On Hold'}</option>
                        </select>
                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 border border-border rounded-full ${
                          status === "Pending" ? "bg-muted" :
                          status === "In Progress" ? "bg-blue-500" :
                          status === "Ready" ? "bg-green-500" : "bg-orange-500"
                        }`} />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                 </div>
              </section>

            </div>
          </div>

          {/* Sticky App Footer */}
          <div className="sticky bottom-0 left-0 right-0 bg-card border-t border-border p-4 px-4 sm:px-8 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-20 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
             <div className="flex items-center gap-2 order-2 md:order-none">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#4F46E5] dark:accent-indigo-500 cursor-pointer" id="send-email" />
                <label htmlFor="send-email" className="text-[12px] font-medium text-muted-foreground cursor-pointer">{mounted ? t('repairs.actions.sendEmail') : 'Send Email Confirmation to Customer'}</label>
             </div>
             
             <div className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full md:w-auto order-1 md:order-none">
                <button onClick={() => router.push('/admin/repairs')} className="h-11 w-full sm:w-auto px-8 rounded-xl border border-border text-[14px] font-semibold text-foreground hover:bg-muted transition-colors focus:outline-none bg-card">
                  {mounted ? t('common.cancel') : 'Cancel'}
                </button>
                 <div className="flex gap-3 w-full sm:w-auto">
                  <button onClick={handleSaveDraft} disabled={isCreatingRepair} className="flex-1 sm:flex-none h-11 sm:px-8 rounded-xl bg-muted/50 text-[14px] font-semibold text-foreground hover:bg-muted transition-colors focus:outline-none disabled:opacity-50">
                    {mounted ? t('common.saveDraft') || 'Save as Draft' : 'Save as Draft'}
                  </button>
                  <button onClick={() => setIsConfirmModalOpen(true)} disabled={isCreatingRepair} className="flex-1 sm:flex-none h-11 sm:px-8 rounded-xl bg-primary text-[14px] font-semibold text-white hover:bg-primary/90 shadow-md transition-colors focus:outline-none disabled:opacity-50">
                    {isCreatingRepair ? (mounted ? t('common.loading') : "Processing...") : (mounted ? t('dashboard.actions.addRepair') : "Create Repair")}
                  </button>
                </div>
             </div>
          </div>
        </main>

        {/* Create Customer Global Modal */}
        {isCustomerModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md rounded-xl shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="text-base font-bold text-foreground">{mounted ? t('repairs.actions.newCustomer') : 'Create New Customer'}</h3>
                <button onClick={() => setIsCustomerModalOpen(false)} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors outline-none focus:ring-2 focus:ring-[#4F46E5]">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="e.g. Liam Smith" 
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="+94 77 ..." 
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-1.5">Email (Optional)</label>
                  <input 
                    type="email" 
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="liam@example.com" 
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/50/50 border-t border-border">
                <button onClick={() => setIsCustomerModalOpen(false)} className="h-9 px-4 rounded-lg bg-card border border-border text-[13px] font-semibold text-foreground hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-border">{mounted ? t('common.cancel') : 'Cancel'}</button>
                <button onClick={handleSaveCustomer} className="h-9 px-4 rounded-lg bg-primary text-white text-[13px] font-semibold hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2">{mounted ? t('common.save') || 'Save Customer' : 'Save Customer'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200">
             <div className="bg-card w-[400px] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
                <div className="flex justify-end p-3">
                   <button onClick={() => setIsConfirmModalOpen(false)} className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors focus:outline-none">
                      <X className="h-3.5 w-3.5" />
                   </button>
                </div>
                <div className="px-8 pb-8 pt-2 flex flex-col items-center text-center">
                   <h2 className="text-[22px] font-bold text-foreground mb-2 leading-tight">{mounted ? t('repairs.createNew') : 'Create New Repair'}?</h2>
                   <p className="text-[13px] text-muted-foreground mb-4">{mounted ? t('repairs.form.review') : 'You are about to create a new repair task.'}</p>
                   <p className="text-[15px] font-bold text-foreground mb-6">{mounted ? t('repairs.form.total') : 'Total Quote'}: Rs. {pricingTotal.toLocaleString()}</p>
                   
                   <label className="flex items-center gap-2.5 mb-8 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          defaultChecked 
                          className="peer h-4 w-4 appearance-none rounded border border-primary bg-background checked:bg-primary transition-all cursor-pointer" 
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={4} />
                      </div>
                      <span className="text-[13px] font-semibold text-muted-foreground group-hover:text-foreground dark:group-hover:text-white transition-colors">{mounted ? t('repairs.form.autoInvoice') : 'Automatically Create and store the Invoice'}</span>
                   </label>
 
                   <div className="flex w-full gap-4">
                      <button 
                        onClick={() => setIsConfirmModalOpen(false)} 
                        className="flex-1 h-11 rounded-xl border border-border text-foreground font-bold text-[14px] hover:bg-muted transition-colors focus:outline-none"
                      >
                        {mounted ? t('common.cancel') : 'Reject'}
                      </button>
                       <button 
                         onClick={handleCreateRepair} 
                         disabled={(!user?.shopId && !userContextError) || isCreatingRepair}
                         className="flex-1 h-11 rounded-xl bg-primary text-white font-bold text-[14px] hover:bg-primary/90 transition-colors shadow-md shadow-indigo-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         {user?.shopId ? (isCreatingRepair ? (mounted ? t('common.loading') : "Creating...") : (mounted ? t('common.confirm') || 'Accept' : "Accept")) : 
                          userContextError ? (mounted ? t('common.sessionExpired') : "Session Expired") : (mounted ? t('common.checking') : "Checking Session...")}
                       </button>
                       {userContextError && (
                         <p className="mt-2 text-xs text-red-500 font-medium text-center">{userContextError}</p>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Receipt / Invoice Modal */}
        {isReceiptModalOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto py-12 px-4">
             {/* Header Actions */}
             <div className="w-full max-w-[800px] flex justify-end gap-3 mb-4 shrink-0">
                <button 
                  onClick={handleDownloadPDF} 
                  disabled={isGeneratingPDF}
                  className={`h-9 px-4 rounded-full text-white text-[13px] font-semibold flex items-center gap-2 shadow-sm focus:outline-none transition-colors ${
                    isGeneratingPDF ? 'bg-[#4F46E5]/70 cursor-not-allowed' : 'bg-[#4F46E5] hover:bg-[#4338CA]'
                  }`}
                >
                  <Download className={`h-4 w-4 ${isGeneratingPDF ? 'animate-bounce' : ''}`} /> 
                  {isGeneratingPDF ? (mounted ? t('common.loading') : 'Generating...') : (mounted ? t('common.download') || 'Download' : 'Download')}
                </button>
                <button onClick={() => router.push('/admin/repairs')} className="h-9 w-9 rounded-full bg-card text-muted-foreground flex items-center justify-center shadow-sm focus:outline-none hover:bg-muted transition-colors"><X className="h-4 w-4" /></button>
             </div>
             
             {/* Invoice Paper Canvas (Stays Light Explicitly for PDF parsing clarity) */}
             <div ref={printRef} className="w-full max-w-[800px] bg-white rounded-lg shadow-xl p-16 shrink-0 z-10" style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Inter, sans-serif' }}>
                 <div className="flex justify-between items-start mb-16">
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
                            <h2 className="text-[24px] font-black text-[#0F172A] tracking-tighter uppercase">{user?.shopName || "SRM Solutions"}</h2>
                        </div>
                        <div className="text-[11px] text-gray-500 font-medium leading-[1.6]">
                            <p>Shop ID: {user?.shopCode || "N/A"}</p>
                            <p>{user?.email || "hello@servicepro.com"}</p>
                            <p>+94 11 234 5678</p>
                        </div>
                     </div>
                     <div className="text-right text-[11px] text-gray-500 font-medium leading-[1.6]">
                           <p className="font-bold text-[#0F172A] uppercase tracking-widest mb-1">Premium Service Center</p>
                           <p>Authorized {brand} Service</p>
                           <p>TAX ID: SRM-TAX-2026</p>
                     </div>
                 </div>

                 <div className="grid grid-cols-4 gap-8 mb-12">
                     <div className="col-span-1 border-l-2 border-[#4F46E5] pl-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">{mounted ? t('repairs.form.customer') : 'Billed to'},</p>
                        <p className="text-[14px] font-black text-[#0F172A] mb-1">{customer || "Walk-in Customer"}</p>
                        <p className="text-[11px] text-gray-500 font-medium leading-[1.6]">
                          ID: {selectedCustomerId?.substring(0, 8) || "NEW"}<br/>
                          {deviceType}: {brand} {model}
                        </p>
                     </div>
                     <div className="col-span-2 px-4">
                        <div className="grid grid-cols-2 gap-y-6">
                           <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">{mounted ? t('common.invoiceNumber') || 'Invoice number' : 'Invoice number'}</p>
                              <p className="text-[12px] font-black text-[#0F172A] font-mono">#{currentRef.split('-').pop()}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">{mounted ? t('common.invoiceDate') || 'Invoice date' : 'Invoice date'}</p>
                              <p className="text-[12px] font-black text-[#0F172A]">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Reference</p>
                              <p className="text-[12px] font-black text-[#0F172A]">{currentRef}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Subject</p>
                              <p className="text-[12px] font-black text-[#0F172A] truncate pr-2">{issueCategory}</p>
                           </div>
                        </div>
                     </div>
                     <div className="col-span-1 text-right bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 font-bold">Total Payable</p>
                        <p className="text-[24px] font-black text-[#4F46E5] tracking-tighter">Rs.{pricingTotal.toLocaleString()}</p>
                        <div className="mt-4 pt-4 border-t border-slate-200">
                           <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">{mounted ? t('common.status') : 'Status'}</p>
                           <p className="text-[11px] font-black text-[#0F172A] uppercase">{status}</p>
                        </div>
                     </div>
                 </div>

                 {/* Table */}
                 <div className="mt-12">
                    <div className="grid grid-cols-12 pb-3 mb-6 border-b-2 border-[#0F172A]">
                        <div className="col-span-6 text-[10px] text-[#0F172A] uppercase tracking-widest font-black">Transactional Detail</div>
                        <div className="col-span-2 text-[10px] text-[#0F172A] uppercase tracking-widest font-black text-center">Qty</div>
                        <div className="col-span-2 text-[10px] text-[#0F172A] uppercase tracking-widest font-black text-center">Rate</div>
                        <div className="col-span-2 text-right text-[10px] text-[#0F172A] uppercase tracking-widest font-black">Amount</div>
                    </div>
                    
                    <div className="grid grid-cols-12 mb-6 items-center">
                        <div className="col-span-6">
                           <p className="text-[13px] font-black text-[#0F172A] mb-0.5">Labor Detail</p>
                           <p className="text-[11px] text-gray-500 font-medium">{issueDescription || "Expert Technical Diagnostics & Service"}</p>
                        </div>
                        <div className="col-span-2 text-[12px] font-bold text-[#0F172A] text-center">1</div>
                        <div className="col-span-2 text-[12px] font-bold text-[#0F172A] text-center">Rs.{parseFloat(laborCost || "0").toLocaleString()}</div>
                        <div className="col-span-2 text-right text-[12px] font-black text-[#0F172A]">Rs.{parseFloat(laborCost || "0").toLocaleString()}</div>
                    </div>
                    
                    <div className="grid grid-cols-12 mb-12 items-center">
                        <div className="col-span-6">
                           <p className="text-[13px] font-black text-[#0F172A] mb-0.5">Parts & Materials</p>
                           <p className="text-[11px] text-gray-500 font-medium">{partsRequired[0] || "OEM Grade Replacement Components"}</p>
                        </div>
                        <div className="col-span-2 text-[12px] font-bold text-[#0F172A] text-center">1</div>
                        <div className="col-span-2 text-[12px] font-bold text-[#0F172A] text-center">Rs.{parseFloat(partsCost || "0").toLocaleString()}</div>
                        <div className="col-span-2 text-right text-[12px] font-black text-[#0F172A]">Rs.{parseFloat(partsCost || "0").toLocaleString()}</div>
                    </div>

                    <div className="flex justify-end pt-8 border-t border-slate-100">
                        <div className="w-[280px] space-y-3">
                            <div className="flex justify-between text-[13px] font-bold text-gray-400">
                               <span>Subtotal</span>
                               <span className="text-[#0F172A]">Rs.{(parseFloat(laborCost || "0") + parseFloat(partsCost || "0")).toLocaleString()}</span>
                            </div>
                            {applyDiscount && (
                               <div className="flex justify-between text-[13px] font-bold text-red-500">
                                  <span>Discount</span>
                                  <span>-Rs.{parseFloat(discount || "0").toLocaleString()}</span>
                               </div>
                            )}
                            <div className="flex justify-between text-[13px] font-bold text-gray-400 pb-3 border-b border-slate-100">
                               <span>Tax ({tax}%)</span>
                               <span className="text-[#0F172A]">Rs.{((Math.max(0, (parseFloat(laborCost || "0") + parseFloat(partsCost || "0")) - (applyDiscount ? parseFloat(discount || "0") : 0))) * (parseFloat(tax || "0") / 100)).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                               <span className="text-[14px] font-black text-[#0F172A]">{mounted ? t('repairs.form.total') : 'Total Amount'}</span>
                               <span className="text-[20px] font-black text-[#4F46E5]">Rs.{pricingTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Footer */}
                 <div className="mt-32 pt-12 border-t border-slate-50">
                    <p className="text-[13px] font-black text-[#0F172A] mb-8">Thanks for the business.</p>
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 font-black">Terms & Conditions</p>
                          <p className="text-[11px] text-[#0F172A] font-bold">Please pay within 15 days of receiving this invoice.</p>
                       </div>
                       <div className="text-[10px] text-gray-400 font-bold italic">
                          Generated by SRM Solutions Digital Hub
                       </div>
                    </div>
                 </div>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}