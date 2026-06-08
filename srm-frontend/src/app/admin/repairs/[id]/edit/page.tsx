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
  const { data: staffResponse } = useGetStaffListQuery(undefined, { skip: !user || user?.role === 'TECHNICIAN' })
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
      toast.error("Failed to generate PDF.");
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

      await updateRepair(repairData).unwrap();
      setIsConfirmModalOpen(false)
      setIsReceiptModalOpen(true)
      toast.success("Repair updated successfully");
    } catch (err: any) {
      console.error("Failed to update repair", err);
      toast.error(err.data?.message || err.message || "Failed to update repair.");
    }
  }

  const handleSaveDraft = () => {
    router.push("/admin/repairs")
  }

  const handleSaveCustomer = () => {
    if (!newCustomerName.trim()) return;
    setCustomer(newCustomerName);
    setIsCustomerModalOpen(false);
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewCustomerEmail("");
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="flex bg-muted text-foreground h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 bg-[#F8FAFC] relative h-full overflow-hidden">
        
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

        <main onScroll={handleScroll} className="flex-1 overflow-y-auto w-full pb-32 scroll-smooth">
          <div className="max-w-4xl mx-auto py-8 px-8 flex flex-col gap-8">
            
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
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
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
                  placeholder="Add any internal notes..."
                  className="w-full h-24 rounded-lg border border-border bg-white p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
              </div>
            </section>

            <section ref={section2Ref} className="bg-white rounded-xl shadow-sm border border-border p-6 scroll-mt-6">
               <h2 className="text-lg font-bold text-foreground mb-6">Customer & Device</h2>
               <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Customer Name</label>
                    <input type="text" value={customer} readOnly className="w-full h-10 rounded-lg border border-border bg-muted px-3 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Device Type</label>
                    <input type="text" value={deviceType} readOnly className="w-full h-10 rounded-lg border border-border bg-muted px-3 text-sm focus:outline-none" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Brand</label>
                    <input type="text" value={brand} readOnly className="w-full h-10 rounded-lg border border-border bg-muted px-3 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Model</label>
                    <input type="text" value={model} readOnly className="w-full h-10 rounded-lg border border-border bg-muted px-3 text-sm focus:outline-none" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Serial No</label>
                    <input type="text" value={serialNo} readOnly className="w-full h-10 rounded-lg border border-border bg-muted px-3 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">IMEI</label>
                    <input type="text" value={imei} readOnly className="w-full h-10 rounded-lg border border-border bg-muted px-3 text-sm focus:outline-none" />
                  </div>
               </div>
            </section>

            <section ref={section3Ref} className="bg-white rounded-xl shadow-sm border border-border p-6 scroll-mt-6">
               <h2 className="text-lg font-bold text-foreground mb-6">Issue & Pricing</h2>
               <div className="mb-6">
                  <label className="block text-[13px] font-bold text-foreground mb-1.5">Issue Category</label>
                  <select value={issueCategory} onChange={(e) => setIssueCategory(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none">
                    <option>Screen Damage</option>
                    <option>Battery Issue</option>
                    <option>Water Damage</option>
                    <option>Software Issue</option>
                    <option>Other</option>
                  </select>
               </div>
               <div className="mb-6">
                  <label className="block text-[13px] font-bold text-foreground mb-1.5">Description</label>
                  <textarea value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} className="w-full h-24 rounded-lg border border-border bg-white p-3 text-sm resize-none focus:outline-none" />
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Labor Cost</label>
                    <input type="number" value={laborCost} onChange={(e) => setLaborCost(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Parts Cost</label>
                    <input type="number" value={partsCost} onChange={(e) => setPartsCost(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none" />
                  </div>
               </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-border p-6 mb-8">
               <h2 className="text-lg font-bold text-foreground mb-6">Workflow</h2>
               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Technician</label>
                    <select value={technician} onChange={(e) => setTechnician(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none">
                      <option value="">Unassigned</option>
                      {technicians.map((t: any) => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none">
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Ready</option>
                      <option>Delivered</option>
                    </select>
                  </div>
               </div>
            </section>

          </div>
        </main>

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-border p-4 px-8 shadow-lg z-20 flex justify-between items-center">
           <button onClick={() => router.push('/admin/repairs')} className="h-11 px-8 rounded-xl border border-border text-[14px] font-semibold hover:bg-muted">Cancel</button>
           <div className="flex gap-4">
             <button onClick={() => setIsConfirmModalOpen(true)} className="h-11 px-8 rounded-xl bg-[#4F46E5] text-white font-semibold hover:bg-[#4338CA]">Update Task</button>
           </div>
        </div>

        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Confirm Update</h2>
              <p className="text-sm text-muted-foreground mb-6">Are you sure you want to update this repair task?</p>
              <div className="flex gap-4">
                <button onClick={() => setIsConfirmModalOpen(false)} className="flex-1 h-11 rounded-xl border border-border font-bold">Cancel</button>
                <button onClick={handleCreateRepair} disabled={isUpdating} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold disabled:opacity-50">
                  {isUpdating ? "Updating..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isReceiptModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Update Successful</h2>
              <p className="text-sm text-muted-foreground mb-6">The repair task has been updated successfully.</p>
              <div className="flex gap-4">
                <button onClick={() => router.push('/admin/repairs')} className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold">Go to Repairs</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
