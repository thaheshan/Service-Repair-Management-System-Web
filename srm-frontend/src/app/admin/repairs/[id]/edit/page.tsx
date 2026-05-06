"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Calendar, Search, ChevronDown, Check, Camera, Image as ImageIcon, Plus, X, Download } from "lucide-react"
import "@/app/globals.css"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { useGetRepairByIdQuery, useUpdateRepairStatusMutation } from "@/services/api/repairsApiSlice"
import { useGetStaffListQuery } from "@/services/api/staffApiSlice"
import { toast } from "sonner"

// Mock device icons
const PhoneIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const TabletIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const LaptopIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="12" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
const WatchIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/></svg>
const ConsoleIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><circle cx="16" cy="11" r="1"/><circle cx="18" cy="13" r="1"/><circle cx="16" cy="15" r="1"/><circle cx="14" cy="13" r="1"/><path d="M6 11v4"/><path d="M4 13h4"/></svg>

export default function EditRepairPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()

  // Form States
  const [deviceCategory, setDeviceCategory] = useState("Mobile Phone")
  const [customer, setCustomer] = useState("")
  const [deviceType, setDeviceType] = useState("Mobile Phone")
  const [brand, setBrand] = useState("Apple")
  const [model, setModel] = useState("iPhone 13 Pro")
  const [color, setColor] = useState("Space Gray")
  const [storage, setStorage] = useState("256GB")
  const [condition, setCondition] = useState("Excellent")
  const [issueCategory, setIssueCategory] = useState("Screen Damage")
  const [issueDescription, setIssueDescription] = useState("")
  const [accessories, setAccessories] = useState<string[]>([])
  
  // Custom Parts State
  const [partsRequired, setPartsRequired] = useState<string[]>(["Premium Screen Assembly - iPhone 13 Pro"])
  const [partInput, setPartInput] = useState("")
  const [imei, setImei] = useState("")
  const [serialNo, setSerialNo] = useState("")
  const [passcode, setPasscode] = useState("")
  const [internalNotes, setInternalNotes] = useState("")
  const [estimatedDate, setEstimatedDate] = useState("2026-01-20")
  
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
  const [priority, setPriority] = useState("Urgent")

  // API Hooks
  const { data: repairResponse, isLoading } = useGetRepairByIdQuery(id)
  const { data: staffResponse } = useGetStaffListQuery({})
  const [updateRepair, { isLoading: isUpdating }] = useUpdateRepairStatusMutation()

  const repair = repairResponse?.data
  const technicians = staffResponse?.staff || []

  useEffect(() => {
    if (repair) {
      setCustomer(repair.customer?.name || "")
      setDeviceType(repair.device?.type || "Mobile Phone")
      setDeviceCategory(repair.device?.type || "Mobile Phone")
      setBrand(repair.device?.brand || "")
      setModel(repair.device?.model || "")
      setImei(repair.device?.imei || "")
      setSerialNo(repair.device?.serialNo || "")
      
      setIssueDescription(repair.issue || "")
      setLaborCost((repair.estimatedCost || 0).toString())
      setPartsCost("0")
      setTechnician(repair.technicianId || "")
      setStatus(
        repair.status === "NOT_STARTED" ? "Pending" :
        repair.status === "IN_PROGRESS" ? "In Progress" :
        repair.status === "READY_TO_TAKE" ? "Ready" : "Delivered"
      )
      
      if (repair.priority) {
        setPriority(
          repair.priority === "URGENT" ? "Urgent" : 
          repair.priority === "HIGH" ? "High" : 
          repair.priority === "LOW" ? "Low" : "Medium"
        )
      }

      if (repair.estimatedCompletionDate) {
        try {
          setEstimatedDate(new Date(repair.estimatedCompletionDate).toISOString().split('T')[0])
        } catch (e) {
          console.error("Invalid date", repair.estimatedCompletionDate)
        }
      }
      
      setCurrentRef(repair.reference || "")
    }
  }, [repair])

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
  const printRef = useRef<HTMLDivElement>(null)

  // PDF Generation Logic
  const handleDownloadPDF = async () => {
    if (!printRef.current) return
    setIsGeneratingPDF(true)

    // Fix: html2canvas cannot parse modern `oklab()`/`oklch()` CSS color functions.
    // We inject a temporary style that overrides all CSS variables with plain hex values.
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
      // Dynamic imports to prevent SSR hydration errors and bundle bloat
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
      const canvas = await html2canvas(printRef.current, {
        scale: 2, 
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          // Nuclear fix for html2canvas oklab/oklch/lab issue
          // We remove ALL stylesheets from the clone to prevent parsing errors
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

          // Force HEX colors on all elements in the clone
          const elements = clonedDoc.getElementsByTagName("*");
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            el.style.color = "#000000";
            if (el.classList.contains("bg-[#4F46E5]")) {
              el.style.backgroundColor = "#4F46E5";
              el.style.color = "#ffffff";
            } else {
               // el.style.backgroundColor = "transparent"; // Keep layout intact
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
      // Always remove the temporary style
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
    ]
    
    // Find the section closest to the top
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

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const handleCreateRepair = async () => {
    try {
      const repairData = {
        id,
        issue: issueDescription || issueCategory,
        estimatedCost: Math.round(pricingTotal),
        technicianId: technician || null,
        status: status === "Pending" ? "NOT_STARTED" : 
                status === "In Progress" ? "IN_PROGRESS" : 
                status === "Ready" ? "READY_TO_TAKE" : 
                status === "Delivered" ? "DELIVERED" : 
                status === "Completed" ? "DELIVERED" : "NOT_STARTED",
        priority: priority ? priority.toUpperCase() : "MEDIUM",
        estimatedCompletionDate: estimatedDate ? new Date(estimatedDate).toISOString() : null,
      };

      console.log("Submitting repair update payload:", repairData);
      await updateRepair(repairData).unwrap();
      
      setIsConfirmModalOpen(false)
      setIsReceiptModalOpen(true)
      toast.success("Repair updated successfully");
    } catch (err: any) {
      console.error("Failed to update repair", err);
      toast.error(err.data?.message || err.message || "Failed to update repair. Please check if your backend is synchronized.");
    }
  }

  const handleSaveDraft = () => {
    const newRepair = {
      id: generateId(),
      reference: currentRef || `#REP-2026-000000`,
      customer: { name: customer || "Draft: " + (customer || "Walk-in Customer"), phone: "+94 77 000 0000" },
      device: { 
        type: deviceType.toLowerCase().includes("phone") ? "phone" : 
              deviceType.toLowerCase().includes("tablet") ? "tablet" : 
              deviceType.toLowerCase().includes("console") ? "console" : "laptop", 
        name: `${brand || 'Draft'} ${model}`, 
        specs: `${color}, ${storage}` 
      },
      issue: issueDescription || issueCategory || "Draft - Needs Review",
      status: "On Hold", // Defaults to On Hold for drafts
      priority: priority,
      technician: technician ? { name: technician, initials: technician.split(' ').map(n=>n[0]).join(''), bg: "bg-[#4F46E5]" } : null,
      amount: `Rs. ${pricingTotal.toLocaleString()}`,
      dueDate: { text: "TBD", isOverdue: false }
    }

    const saved = localStorage.getItem("srm_repairs_mock")
    const currentArray = saved ? JSON.parse(saved) : []
    const updatedArray = [newRepair, ...currentArray]
    localStorage.setItem("srm_repairs_mock", JSON.stringify(updatedArray))

    router.push("/admin/repairs")
  }

  const handleSaveCustomer = () => {
    if (!newCustomerName.trim()) return;
    // Set the selected customer to the newly created one
    setCustomer(newCustomerName);
    
    // Close modal and reset fields
    setIsCustomerModalOpen(false);
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewCustomerEmail("");
  }

  return (
    <div className="flex bg-muted text-foreground h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 bg-[#F8FAFC] relative h-full overflow-hidden">
        
        {/* Header Background */}
        <div className="bg-white px-8 pt-6 pb-2 border-b border-border shadow-sm z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Link href="/admin/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <span>&gt;</span>
              <Link href="/admin/repairs" className="hover:text-foreground transition-colors">Repairs</Link>
              <span>&gt;</span>
              <span className="text-[#4F46E5] font-semibold">Edit Repair #{id}</span>
            </div>
          </div>

          <div className="pb-4">
             <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-none">Edit Repair #{id}</h1>
          </div>
          
          {/* Stepper */}
          <div className="flex items-center justify-between max-w-3xl mx-auto py-6 relative">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-muted -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-[#4F46E5] -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
            
            {[
              { num: 1, label: "Basic Info" },
              { num: 2, label: "Customer & Device" },
              { num: 3, label: "Issue & Pricing" },
              { num: 4, label: "Review" }
            ].map((step) => {
              const isActive = currentStep >= step.num
              return (
              <div key={step.num} className="relative z-10 flex flex-col items-center gap-2 transition-all duration-300">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300 ${isActive ? 'bg-[#4F46E5] text-white ring-4 ring-indigo-50' : 'bg-white border-2 border-border text-muted-foreground'}`}>
                  {step.num}
                </div>
                <span className={`text-[11px] font-bold transition-colors duration-300 ${isActive ? 'text-[#4F46E5]' : 'text-muted-foreground'} uppercase tracking-wider`}>{step.label}</span>
              </div>
            )})}
          </div>
        </div>

        {/* Scrollable Form Content */}
        <main onScroll={handleScroll} className="flex-1 overflow-y-auto w-full pb-32 scroll-smooth">
          <div className="max-w-4xl mx-auto py-8 px-8 flex flex-col gap-8">
            
            {/* 1. Basic Information */}
            <section ref={section1Ref} className="bg-white rounded-xl shadow-sm border border-border p-6 scroll-mt-6">
              <h2 className="text-lg font-bold text-foreground mb-6">Basic Information</h2>
              
              <div className="mb-6">
                <label className="block text-[13px] font-bold text-foreground mb-3">Repair Category <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    {name: "Mobile Phone", icon: PhoneIcon},
                    {name: "Tablet", icon: TabletIcon},
                    {name: "Laptop", icon: LaptopIcon},
                    {name: "Smartwatch", icon: WatchIcon},
                    {name: "Gaming Console", icon: ConsoleIcon}
                  ].map((cat) => (
                    <button 
                      key={cat.name}
                      onClick={() => setDeviceCategory(cat.name)}
                      className={`flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 transition-all ${deviceCategory === cat.name ? 'border-[#4F46E5] bg-indigo-50/50 text-[#4F46E5]' : 'border-border bg-white text-muted-foreground hover:border-border/80 hover:bg-muted/20'}`}
                    >
                      <cat.icon />
                      <span className="text-[12px] font-semibold text-center leading-tight px-2">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-1.5 flex items-center gap-1">Priority <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className={`w-full h-10 rounded-lg border border-border bg-white pl-9 pr-10 text-sm font-bold appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5] ${
                        priority === "Urgent" ? "text-red-500" :
                        priority === "High" ? "text-orange-500" :
                        priority === "Medium" ? "text-blue-500" : "text-green-500"
                      }`}
                    >
                      <option value="Urgent" className="text-foreground font-medium">Urgent</option>
                      <option value="High" className="text-foreground font-medium">High</option>
                      <option value="Medium" className="text-foreground font-medium">Medium</option>
                      <option value="Low" className="text-foreground font-medium">Low</option>
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
                  <label className="block text-[13px] font-bold text-foreground mb-1.5 flex items-center gap-1">Estimated Completion Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                     <input 
                       type="date" 
                       value={estimatedDate}
                       onChange={(e) => setEstimatedDate(e.target.value)}
                       className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                     />
                     <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-foreground mb-1.5">Internal Notes (Optional)</label>
                <textarea 
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Add any internal notes about this repair..."
                  className="w-full h-24 rounded-lg border border-border bg-white p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder:text-muted-foreground/60"
                />
              </div>
            </section>

            {/* 2. Customer Information */}
            <section ref={section2Ref} className="bg-white rounded-xl shadow-sm border border-border p-6 scroll-mt-6">
               <h2 className="text-lg font-bold text-foreground mb-6">Customer Information</h2>
               <label className="block text-[13px] font-bold text-foreground mb-1.5">Customer <span className="text-red-500">*</span></label>
               <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="Search registered customers by name, phone..."
                    className="w-full h-11 rounded-lg border border-border bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                  />
               </div>
               <button onClick={(e) => { e.preventDefault(); setIsCustomerModalOpen(true); }} className="text-[13px] font-bold text-[#4F46E5] flex items-center gap-1 hover:underline outline-none">
                 <Plus className="h-3.5 w-3.5" /> Create New Customer
               </button>
            </section>

            {/* 3. Device Information */}
            <section className="bg-white rounded-xl shadow-sm border border-border p-6">
               <h2 className="text-lg font-bold text-foreground mb-6">Device Information</h2>

               <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Device Type <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none appearance-none font-medium">
                        <option>Mobile Phone</option>
                        <option>Tablet</option>
                        <option>Laptop</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5 flex items-center gap-1">Brand <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none appearance-none font-medium">
                        <option>Apple</option>
                        <option>Samsung</option>
                        <option>Google</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Model <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none appearance-none font-medium">
                        <option>iPhone 13 Pro</option>
                        <option>iPhone 14 Pro</option>
                        <option>iPhone 15 Pro</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex-1">
                       <label className="block text-[13px] font-bold text-foreground mb-1.5">Color (Optional)</label>
                       <div className="relative">
                         <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none appearance-none font-medium">
                           <option>Space Gray</option>
                           <option>Silver</option>
                           <option>Gold</option>
                         </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                       </div>
                     </div>
                     <div className="flex-1">
                       <label className="block text-[13px] font-bold text-foreground mb-1.5">Storage Capacity (Optional)</label>
                       <div className="relative">
                         <select value={storage} onChange={(e) => setStorage(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none appearance-none font-medium">
                           <option>256GB</option>
                           <option>512GB</option>
                           <option>1TB</option>
                         </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                       </div>
                     </div>
                  </div>
               </div>

               <div className="mb-6">
                 <label className="block text-[13px] font-bold text-foreground mb-3">Device Condition (Optional)</label>
                 <div className="flex items-center gap-4">
                   {["Excellent", "Good", "Fair", "Poor"].map((cond) => (
                     <label key={cond} className="flex items-center gap-2 cursor-pointer">
                       <input type="radio" name="condition" checked={condition === cond} onChange={() => setCondition(cond)} className="h-4 w-4 accent-[#4F46E5]" />
                       <span className="text-[13px] font-medium text-foreground">{cond}</span>
                     </label>
                   ))}
                 </div>
               </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Serial Number (Optional)</label>
                    <input 
                      type="text" 
                      value={serialNo}
                      onChange={(e) => setSerialNo(e.target.value)}
                      placeholder="Enter Serial" 
                      className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder:text-muted-foreground/60" 
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">IMEI Number (Optional)</label>
                    <input 
                      type="text" 
                      value={imei}
                      onChange={(e) => setImei(e.target.value)}
                      placeholder="Enter IMEI (for mobile devices)" 
                      className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder:text-muted-foreground/60" 
                    />
                  </div>
               </div>
               
               <div className="mb-6">
                  <label className="block text-[13px] font-bold text-foreground mb-1.5">Passcode / PIN (Optional)</label>
                  <input 
                    type="text" 
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Used to verify device works after repair is complete" 
                    className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder:text-muted-foreground/60" 
                  />
               </div>

               <div className="mb-6">
                 <label className="block text-[13px] font-bold text-foreground mb-3">Device Accessories Included (Optional)</label>
                 <div className="flex flex-wrap items-center gap-6">
                   {["Charger", "Battery", "Case", "Original Box", "Mouse / Keyboard", "SD Card / SIM Tray", "Other"].map((acc) => {
                     const isChecked = accessories.includes(acc)
                     return (
                       <label key={acc} className="flex items-center gap-2 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleAccessory(acc); }}>
                         <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${isChecked ? 'bg-[#4F46E5] border-[#4F46E5]' : 'border-muted-foreground/30 bg-card group-hover:border-[#4F46E5]'}`}>
                            {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                         </div>
                         <span className="text-[13px] font-medium text-foreground select-none">{acc}</span>
                       </label>
                     )}
                   )}
                 </div>
               </div>

               <div>
                 <label className="block text-[13px] font-bold text-foreground mb-3">Device Photos (Optional)</label>
                 <label className="w-full h-32 border-2 border-dashed border-border rounded-xl bg-[#F8FAFC] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors block">
                   <input type="file" multiple accept="image/png, image/jpeg, image/jpg" className="hidden" />
                   <div className="flex items-center justify-center h-10 w-10 bg-white rounded-full shadow-sm text-muted-foreground">
                     <Camera className="h-5 w-5" />
                   </div>
                   <div className="text-center">
                     <span className="text-[13px] font-bold text-[#4F46E5]">Click to upload</span> <span className="text-[13px] font-medium text-muted-foreground">or drag and drop</span>
                     <p className="text-[11px] text-muted-foreground mt-0.5">JPG, PNG, JPG up to 10MB (max 5 files)</p>
                   </div>
                 </label>
               </div>
            </section>

            {/* 4. Issue & Repair Details / Pricing mapped to Stepper Section 3 */}
            <section ref={section3Ref} className="bg-white rounded-xl shadow-sm border border-border p-6 scroll-mt-6">
               <h2 className="text-lg font-bold text-foreground mb-6">Issue & Repair Details</h2>
               
               <div className="mb-6">
                  <label className="block text-[13px] font-bold text-foreground mb-1.5">Issue Category <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select value={issueCategory} onChange={(e) => setIssueCategory(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none appearance-none font-medium">
                      <option>Screen Damage</option>
                      <option>Battery Issue</option>
                      <option>Water Damage</option>
                      <option>Software Issue</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
               </div>

               <div className="mb-6">
                  <label className="block text-[13px] font-bold text-foreground mb-1.5">Describe the Issue <span className="text-red-500">*</span></label>
                  <textarea 
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Provide a detailed description of the problem reported by the customer..."
                    className="w-full h-24 rounded-lg border border-border bg-white p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder:text-muted-foreground/60"
                  />
                  <div className="text-right text-[10px] text-muted-foreground mt-1">0/500</div>
               </div>

               <div>
                 <label className="block text-[13px] font-bold text-foreground mb-1.5">Parts Required (Optional)</label>
                 <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={partInput}
                      onChange={(e) => setPartInput(e.target.value)}
                      onKeyDown={handleAddPart}
                      placeholder="Type part (e.g., Premium Screen Component) and press Enter to specify..." 
                      className="w-full h-11 rounded-lg border border-border bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder:text-muted-foreground/60" 
                    />
                 </div>
                 <div className="flex flex-wrap items-center gap-2 mb-3">
                   {partsRequired.map((part, idx) => (
                     <div key={idx} className="px-3 py-1.5 border border-border rounded-lg bg-muted/30 flex items-center gap-2 inline-flex">
                       <span className="text-[12px] font-medium text-foreground">{part}</span>
                       <button onClick={(e) => { e.preventDefault(); setPartsRequired(partsRequired.filter((_, i) => i !== idx)) }} className="h-4 w-4 rounded-full bg-white border border-border flex items-center justify-center text-[10px] text-muted-foreground hover:bg-red-50 hover:text-red-500 hover:border-red-200">
                         <X className="h-2.5 w-2.5" />
                       </button>
                     </div>
                   ))}
                   <button className="text-[13px] font-bold text-[#4F46E5] flex items-center gap-1 hover:underline ml-2 outline-none">
                     <Plus className="h-3.5 w-3.5" /> Browse Inventory
                   </button>
                 </div>
               </div>
            </section>

            {/* 5. Pricing & Quote */}
            <section className="bg-white rounded-xl shadow-sm border border-border p-6">
               <h2 className="text-lg font-bold text-foreground mb-6">Pricing & Quote</h2>
               
               <div className="p-6 bg-[#F8FAFC] border border-border rounded-xl">
                 
                 <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border mb-6">
                   <div>
                     <label className="block text-[13px] font-bold text-foreground mb-1.5">Labor Cost</label>
                     <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">Rs.</span>
                       <input 
                         type="number" 
                         value={laborCost} 
                         onChange={(e) => setLaborCost(e.target.value)}
                         className="w-full h-10 rounded-lg border border-border bg-white pl-9 pr-3 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                       />
                     </div>
                     <div className="text-[11px] text-muted-foreground mt-1.5">Based on <strong className="text-foreground">2.5 hours</strong> est. duration</div>
                   </div>
                   <div>
                     <label className="block text-[13px] font-bold text-foreground mb-1.5">Parts Cost</label>
                     <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">Rs.</span>
                       <input 
                         type="number" 
                         value={partsCost} 
                         onChange={(e) => setPartsCost(e.target.value)}
                         className="w-full h-10 rounded-lg border border-border bg-white pl-9 pr-3 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                       />
                     </div>
                   </div>
                 </div>

                 <div className="flex justify-between items-center mb-6">
                   <label className="text-[13px] font-bold text-foreground flex items-center gap-2 cursor-pointer">
                     <input type="checkbox" checked={applyDiscount} onChange={(e) => setApplyDiscount(e.target.checked)} className="h-4 w-4 accent-[#4F46E5]" />
                     Add Discount (Optional)
                   </label>
                   {applyDiscount && (
                     <div className="flex gap-2">
                       <select className="h-10 w-24 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none appearance-none font-medium">
                         <option>Flat Amount</option>
                         <option>Percentage</option>
                       </select>
                       <div className="relative w-32">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">Rs.</span>
                         <input 
                           type="number" 
                           value={discount} 
                           onChange={(e) => setDiscount(e.target.value)}
                           className="w-full h-10 rounded-lg border border-[#EF4444] bg-white pl-9 pr-3 text-sm font-semibold focus:outline-none" 
                         />
                       </div>
                     </div>
                   )}
                 </div>

                 <div className="grid grid-cols-2 gap-6 mb-6">
                   <div>
                     <label className="block text-[13px] font-bold text-foreground mb-1.5">Tax %</label>
                     <div className="relative">
                       <input 
                         type="number" 
                         value={tax}
                         onChange={(e) => setTax(e.target.value)}
                         className="w-full h-10 rounded-lg border border-border bg-white px-3 pr-8 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                       />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">%</span>
                     </div>
                   </div>
                 </div>

                 <div className="pb-6 border-b border-border mb-6">
                   <label className="block text-[13px] font-bold text-foreground mb-1.5">Advance Payment / Deposit (Optional)</label>
                   <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">Rs.</span>
                     <input 
                       type="number" 
                       value={advancePayment}
                       onChange={(e) => setAdvancePayment(e.target.value)}
                       placeholder="0.00" 
                       className="w-full h-10 rounded-lg border border-border bg-white pl-9 pr-3 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[#4F46E5] placeholder:text-muted-foreground/60" 
                     />
                   </div>
                 </div>

                 {/* Price Summary Row */}
                 <div className="flex items-center justify-between bg-[#EEF2FF] rounded-xl border border-[#C7D2FE] p-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-[#6366F1] uppercase tracking-wide">Labor</span>
                      <span className="text-[13px] font-bold text-foreground">Rs. {parseFloat(laborCost || "0").toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-[#6366F1] uppercase tracking-wide">Parts</span>
                      <span className="text-[13px] font-bold text-foreground">Rs. {parseFloat(partsCost || "0").toLocaleString()}</span>
                    </div>
                    {applyDiscount && (
                       <div className="flex flex-col">
                         <span className="text-[11px] font-bold text-red-500 uppercase tracking-wide">Discount</span>
                         <span className="text-[13px] font-bold text-red-600">-Rs. {parseFloat(discount || "0").toLocaleString()}</span>
                       </div>
                    )}
                    {(parseFloat(tax) > 0) && (
                       <div className="flex flex-col">
                         <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Tax</span>
                         <span className="text-[13px] font-bold text-foreground">+{tax}%</span>
                       </div>
                    )}
                    <div className="h-10 w-px bg-[#C7D2FE] mx-2" />
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] font-bold text-[#4F46E5] uppercase tracking-wide">Total Quote</span>
                      <span className="text-[20px] font-black text-[#3730A3]">Rs. {pricingTotal.toLocaleString()}</span>
                    </div>
                 </div>
                 
               </div>
            </section>

            {/* 6. Assignment & Workflow */}
            <section className="bg-white rounded-xl shadow-sm border border-border p-6 mb-8">
               <h2 className="text-lg font-bold text-foreground mb-6">Assignment & Workflow</h2>
               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Assign Technician (Optional)</label>
                    <div className="relative">
                      <select value={technician} onChange={(e) => setTechnician(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none appearance-none font-medium">
                        <option value="">Unassigned</option>
                        {technicians.map((staff: any) => (
                          <option key={staff.id} value={staff.id}>{staff.name || staff.fullName || staff.email}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Initial Repair Status <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white pl-10 pr-3 text-sm focus:outline-none appearance-none font-bold text-foreground">
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Ready">Ready</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 bg-muted border border-border rounded-full" />
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
               </div>
            </section>

          </div>
        </main>
        
        {/* Sticky App Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-border p-4 px-8 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-20 flex justify-between items-center">
           <button onClick={() => router.push('/admin/repairs')} className="h-11 px-8 rounded-xl border border-border text-[14px] font-semibold text-foreground hover:bg-muted transition-colors focus:outline-none bg-white">
             Cancel
           </button>
           <div className="flex flex-col items-center">
             <div className="flex items-center gap-2">
               <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#4F46E5] cursor-pointer" id="send-email" />
               <label htmlFor="send-email" className="text-[12px] font-medium text-muted-foreground cursor-pointer">Send Email Confirmation to Customer</label>
             </div>
           </div>
           <div className="flex gap-4">
             <button onClick={handleSaveDraft} className="h-11 px-8 rounded-xl bg-muted/50 text-[14px] font-semibold text-foreground hover:bg-muted transition-colors focus:outline-none">
               Save as Draft
             </button>
             <button onClick={() => setIsConfirmModalOpen(true)} className="h-11 px-8 rounded-xl bg-[#4F46E5] text-[14px] font-semibold text-white hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none">
               Update Task
             </button>
           </div>
        </div>

        {/* Create Customer Global Modal */}
        {isCustomerModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md rounded-xl shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="text-base font-bold text-foreground">Create New Customer</h3>
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
                    className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="+94 77 ..." 
                    className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-foreground mb-1.5">Email (Optional)</label>
                  <input 
                    type="email" 
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="liam@example.com" 
                    className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/30 border-t border-border">
                <button onClick={() => setIsCustomerModalOpen(false)} className="h-9 px-4 rounded-lg bg-card border border-border text-[13px] font-semibold text-foreground hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-border">Cancel</button>
                <button onClick={handleSaveCustomer} className="h-9 px-4 rounded-lg bg-[#4F46E5] text-white text-[13px] font-semibold hover:bg-[#4338CA] transition-colors outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2">Save Customer</button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200">
             <div className="bg-white w-[400px] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-end p-3">
                   <button onClick={() => setIsConfirmModalOpen(false)} className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors focus:outline-none">
                      <X className="h-3.5 w-3.5" />
                   </button>
                </div>
                <div className="px-8 pb-8 pt-2 flex flex-col items-center text-center">
                   <h2 className="text-[22px] font-bold text-foreground mb-2 leading-tight">Are You Sure to Update this<br/>Repair Task?</h2>
                   <p className="text-[13px] text-muted-foreground mb-6">Modifications will overwrite previous details.</p>
                   
                   <label className="flex items-center gap-2.5 mb-8 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          defaultChecked 
                          className="peer h-4 w-4 appearance-none rounded border border-[#4F46E5] bg-white checked:bg-[#4F46E5] transition-all cursor-pointer" 
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={4} />
                      </div>
                      <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">Automatically Create and store the Invoice</span>
                   </label>

                   <div className="flex w-full gap-4">
                      <button onClick={() => setIsConfirmModalOpen(false)} className="flex-1 h-11 rounded-xl border border-muted-foreground/30 text-foreground font-bold text-[14px] hover:bg-muted transition-colors focus:outline-none">Reject</button>
                      <button onClick={handleCreateRepair} disabled={isUpdating} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold text-[14px] hover:bg-[#4338CA] transition-colors shadow-md shadow-indigo-500/20 focus:outline-none disabled:opacity-50">
                        {isUpdating ? "Processing..." : "Accept"}
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Receipt / Invoice Modal */}
        {isReceiptModalOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto py-12 px-4">
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
                  {isGeneratingPDF ? 'Generating...' : 'Download'}
                </button>
                <button onClick={() => router.push('/admin/repairs')} className="h-9 w-9 rounded-full bg-white text-muted-foreground flex items-center justify-center shadow-sm focus:outline-none hover:bg-muted transition-colors"><X className="h-4 w-4" /></button>
             </div>
             
             {/* Invoice Paper */}
             <div ref={printRef} className="w-full max-w-[800px] bg-white rounded-lg shadow-xl p-16 shrink-0 z-10" style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Inter, sans-serif' }}>
                 <div className="flex justify-between items-start mb-16">
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                           <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
                           <h2 className="text-[24px] font-black text-[#0F172A] tracking-tighter uppercase">SRM Solutions</h2>
                        </div>
                        <div className="text-[11px] text-muted-foreground/80 font-medium leading-[1.6]">
                           <p>Shop ID: {repair?.shopId || "N/A"}</p>
                           <p>hello@servicepro.com</p>
                           <p>+94 11 234 5678</p>
                        </div>
                     </div>
                     <div className="text-right text-[11px] text-muted-foreground/80 font-medium leading-[1.6]">
                           <p className="font-bold text-[#0F172A] uppercase tracking-widest mb-1">Premium Service Center</p>
                           <p>Authorized {brand} Service</p>
                           <p>TAX ID: SRM-TAX-2026</p>
                     </div>
                 </div>

                 <div className="grid grid-cols-4 gap-8 mb-12">
                     <div className="col-span-1 border-l-2 border-[#4F46E5] pl-4">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-bold">Billed to,</p>
                        <p className="text-[14px] font-black text-[#0F172A] mb-1">{customer || "Walk-in Customer"}</p>
                        <p className="text-[11px] text-muted-foreground font-medium leading-[1.6]">
                          ID: {repair?.customerId?.substring(0, 8) || "NEW"}<br/>
                          {deviceType}: {brand} {model}
                        </p>
                     </div>
                     <div className="col-span-2 px-4">
                        <div className="grid grid-cols-2 gap-y-6">
                           <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Invoice number</p>
                              <p className="text-[12px] font-black text-[#0F172A] font-mono">#{currentRef.split('-').pop()}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Invoice date</p>
                              <p className="text-[12px] font-black text-[#0F172A]">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Reference</p>
                              <p className="text-[12px] font-black text-[#0F172A]">{currentRef}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Subject</p>
                              <p className="text-[12px] font-black text-[#0F172A] truncate pr-2">{issueCategory}</p>
                           </div>
                        </div>
                     </div>
                     <div className="col-span-1 text-right bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5 font-bold">Total Payable</p>
                        <p className="text-[24px] font-black text-[#4F46E5] tracking-tighter">Rs.{pricingTotal.toLocaleString()}</p>
                        <div className="mt-4 pt-4 border-t border-slate-200">
                           <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Status</p>
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
                           <p className="text-[11px] text-muted-foreground font-medium">{issueDescription || "Expert Technical Diagnostics & Service"}</p>
                        </div>
                        <div className="col-span-2 text-[12px] font-bold text-[#0F172A] text-center">1</div>
                        <div className="col-span-2 text-[12px] font-bold text-[#0F172A] text-center">Rs.{parseFloat(laborCost || "0").toLocaleString()}</div>
                        <div className="col-span-2 text-right text-[12px] font-black text-[#0F172A]">Rs.{parseFloat(laborCost || "0").toLocaleString()}</div>
                    </div>
                    
                    <div className="grid grid-cols-12 mb-12 items-center">
                        <div className="col-span-6">
                           <p className="text-[13px] font-black text-[#0F172A] mb-0.5">Parts Material</p>
                           <p className="text-[11px] text-muted-foreground font-medium">{partsRequired[0] || "OEM Grade Replacement Components"}</p>
                        </div>
                        <div className="col-span-2 text-[12px] font-bold text-[#0F172A] text-center">1</div>
                        <div className="col-span-2 text-[12px] font-bold text-[#0F172A] text-center">Rs.{parseFloat(partsCost || "0").toLocaleString()}</div>
                        <div className="col-span-2 text-right text-[12px] font-black text-[#0F172A]">Rs.{parseFloat(partsCost || "0").toLocaleString()}</div>
                    </div>

                    <div className="flex justify-end pt-8 border-t border-slate-100">
                        <div className="w-[280px] space-y-3">
                            <div className="flex justify-between text-[13px] font-bold text-muted-foreground">
                               <span>Subtotal</span>
                               <span className="text-[#0F172A]">Rs.{(parseFloat(laborCost || "0") + parseFloat(partsCost || "0")).toLocaleString()}</span>
                            </div>
                            {applyDiscount && (
                               <div className="flex justify-between text-[13px] font-bold text-red-500">
                                  <span>Discount</span>
                                  <span>-Rs.{parseFloat(discount || "0").toLocaleString()}</span>
                               </div>
                            )}
                            <div className="flex justify-between text-[13px] font-bold text-muted-foreground pb-3 border-b border-slate-100">
                               <span>Tax ({tax}%)</span>
                               <span className="text-[#0F172A]">Rs.{((Math.max(0, (parseFloat(laborCost || "0") + parseFloat(partsCost || "0")) - (applyDiscount ? parseFloat(discount || "0") : 0))) * (parseFloat(tax || "0") / 100)).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                               <span className="text-[14px] font-black text-[#0F172A]">Total Amount</span>
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
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5 font-black">Terms & Conditions</p>
                          <p className="text-[11px] text-[#0F172A] font-bold">Please pay within 15 days of receiving this invoice.</p>
                       </div>
                       <div className="text-[10px] text-muted-foreground font-bold italic">
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
