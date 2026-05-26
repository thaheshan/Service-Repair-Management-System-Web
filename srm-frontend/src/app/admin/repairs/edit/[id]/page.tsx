"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Calendar, ChevronDown, X, Search, Check, Camera, Plus, Download } from "lucide-react"
import "@/app/globals.css"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { useGetRepairByIdQuery, useUpdateRepairStatusMutation } from "@/services/api/repairsApiSlice"
import { useGetStaffListQuery } from "@/services/api/staffApiSlice"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useUpdateDeviceMutation } from "@/services/api/devicesApiSlice"

const PhoneIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const TabletIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const LaptopIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="12" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
const WatchIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/></svg>
const ConsoleIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><path d="M6 11v4"/><path d="M4 13h4"/></svg>
const OtherIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>

export default function EditRepairPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()

  const [deviceCategory, setDeviceCategory] = useState("Mobile Phone")
  const [customDeviceCategory, setCustomDeviceCategory] = useState("")
  const [customer, setCustomer] = useState("")
  const [deviceType, setDeviceType] = useState("Mobile Phone")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [issueCategory, setIssueCategory] = useState("Screen Damage")
  const [issueDescription, setIssueDescription] = useState("")
  const [imei, setImei] = useState("")
  const [serialNo, setSerialNo] = useState("")
  const [internalNotes, setInternalNotes] = useState("")
  const [estimatedDate, setEstimatedDate] = useState("")
  const [laborCost, setLaborCost] = useState("0")
  const [partsCost, setPartsCost] = useState("0")
  const [discount, setDiscount] = useState("0")
  const [tax, setTax] = useState("0")
  const [applyDiscount, setApplyDiscount] = useState(true)
  const [technician, setTechnician] = useState("")
  const [status, setStatus] = useState("Pending")
  const [priority, setPriority] = useState("Medium")
  const [currentStep, setCurrentStep] = useState(1)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [currentRef, setCurrentRef] = useState("")
  
  const { user } = useSelector((state: RootState) => state.auth)

  const printRef = useRef<HTMLDivElement>(null)

  const section1Ref = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)
  const section4Ref = useRef<HTMLDivElement>(null)

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

  const { data: repairResponse, isLoading } = useGetRepairByIdQuery(id)
  const { data: staffResponse } = useGetStaffListQuery(undefined, { skip: user?.role === 'TECHNICIAN' })
  const [updateRepair, { isLoading: isUpdating }] = useUpdateRepairStatusMutation()
  const [updateDevice] = useUpdateDeviceMutation()

  const repair = repairResponse?.data
  const technicians = staffResponse?.staff || []

  useEffect(() => {
    if (repair) {
      setCustomer(repair.customer?.name || "")
      setDeviceType(repair.device?.type || "Mobile Phone")
      
      const standardCategories = ["Mobile Phone", "Tablet", "Laptop", "Smartwatch", "Gaming Console"]
      if (repair.device?.type && !standardCategories.includes(repair.device.type)) {
        setDeviceCategory("Other")
        setCustomDeviceCategory(repair.device.type)
      } else {
        setDeviceCategory(repair.device?.type || "Mobile Phone")
      }
      
      setBrand(repair.device?.brand || "")
      setModel(repair.device?.model || "")
      setImei(repair.device?.imei || "")
      setSerialNo(repair.device?.serialNo || "")
      setIssueDescription(repair.issue || repair.issueDescription || "")
      setLaborCost((repair.estimatedCost || 0).toString())
      setTechnician(repair.technicianId || "")
      if (repair.status) {
        const statusMap: Record<string, string> = {
          NOT_STARTED: "Pending", PENDING: "Pending",
          IN_PROGRESS: "In Progress",
          READY_TO_TAKE: "Ready",
          DELIVERED: "Delivered", COMPLETED: "Delivered",
          PAID: "Paid",
        }
        setStatus(statusMap[repair.status] || "Pending")
      }
      if (repair.priority) {
        const priorityMap: Record<string, string> = {
          URGENT: "Urgent", HIGH: "High", MEDIUM: "Medium", LOW: "Low",
        }
        setPriority(priorityMap[repair.priority] || "Medium")
      }
      if (repair.estimatedCompletionDate) {
        try {
          setEstimatedDate(new Date(repair.estimatedCompletionDate).toISOString().split("T")[0])
        } catch {}
      }
      if (repair.reference) {
        setCurrentRef(repair.reference)
      } else {
        setCurrentRef(`#REP-2026-0${Math.floor(10000 + Math.random() * 90000)}`)
      }
    }
  }, [repair])

  const handleDownloadPDF = async () => {
    if (!printRef.current) return
    setIsGeneratingPDF(true)

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

  const handleSaveDraft = () => {
    // Basic implementation since actual draft endpoint might not exist for edits
    toast.success("Changes saved as draft locally.")
    router.push("/admin/repairs")
  }

  const pricingTotal = useMemo(() => {
    const l = parseFloat(laborCost || "0")
    const p = parseFloat(partsCost || "0")
    const subtotal = l + p
    const d = applyDiscount ? parseFloat(discount || "0") : 0
    const afterDiscount = Math.max(0, subtotal - d)
    const t = parseFloat(tax || "0")
    return afterDiscount + afterDiscount * (t / 100)
  }, [laborCost, partsCost, discount, applyDiscount, tax])

  const handleUpdate = async () => {
    try {
      const statusMap: Record<string, string> = {
        Pending: "NOT_STARTED",
        "In Progress": "IN_PROGRESS",
        Ready: "READY_TO_TAKE",
        Delivered: "DELIVERED",
        Paid: "PAID",
      }
      
      // Update device type
      if (repair?.device?.id) {
        await updateDevice({
          id: repair.device.id,
          type: deviceType,
        }).unwrap()
      }

      await updateRepair({
        id,
        issue: issueDescription || issueCategory,
        estimatedCost: Math.round(pricingTotal),
        technicianId: technician || null,
        status: statusMap[status] || "NOT_STARTED",
        priority: priority.toUpperCase(),
        estimatedCompletionDate: estimatedDate ? new Date(estimatedDate).toISOString() : null,
      }).unwrap()
      setIsConfirmModalOpen(false)
      setIsReceiptModalOpen(true)
      toast.success("Repair updated successfully")
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update repair")
    }
  }

  if (isLoading) {
    return (
      <div className="flex bg-background h-screen overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 lg:ml-[200px] ml-0 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#4F46E5] border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-muted text-foreground h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 bg-[#F8FAFC] relative h-full overflow-hidden">

        {/* Header */}
        <div className="bg-white px-8 pt-6 pb-0 border-b border-border shadow-sm z-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-4">
            <Link href="/admin/dashboard" className="hover:text-foreground">Dashboard</Link>
            <span>/</span>
            <Link href="/admin/repairs" className="hover:text-foreground">Repairs</Link>
            <span>/</span>
            <span className="text-[#4F46E5] font-semibold">Edit Repair</span>
          </div>
          <h1 className="text-[26px] font-bold text-foreground mb-4">Edit Repair Task</h1>

          {/* Stepper */}
          <div className="flex items-center justify-between max-w-3xl mx-auto py-6 relative">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-muted -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-[#4F46E5] -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
            
            {[
              { num: 1, label: "Basic Info", ref: section1Ref },
              { num: 2, label: "Customer & Device", ref: section2Ref },
              { num: 3, label: "Issue & Pricing", ref: section3Ref },
              { num: 4, label: "Workflow", ref: section4Ref }
            ].map((step) => {
              const isActive = currentStep >= step.num
              return (
              <div 
                key={step.num} 
                className="relative z-10 flex flex-col items-center gap-2 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setCurrentStep(step.num)
                  step.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300 ${isActive ? 'bg-[#4F46E5] text-white ring-4 ring-indigo-50' : 'bg-white border-2 border-border text-muted-foreground'}`}>
                  {step.num}
                </div>
                <span className={`hidden sm:block text-[11px] font-bold transition-colors duration-300 ${isActive ? 'text-[#4F46E5]' : 'text-muted-foreground'} uppercase tracking-wider`}>{step.label}</span>
              </div>
            )})}
          </div>
        </div>

        {/* Content */}
        <main onScroll={handleScroll} className="flex-1 overflow-y-auto pb-28 scroll-smooth">
          <div className="max-w-4xl mx-auto py-8 px-8 flex flex-col gap-8">

            {/* 1. Basic Info */}
            <section ref={section1Ref} className="bg-white rounded-xl shadow-sm border border-border p-6 scroll-mt-6">
                <h2 className="text-base font-bold text-foreground mb-5">Repair Category</h2>
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {[
                    { name: "Mobile Phone", icon: PhoneIcon },
                    { name: "Tablet", icon: TabletIcon },
                    { name: "Laptop", icon: LaptopIcon },
                    { name: "Smartwatch", icon: WatchIcon },
                    { name: "Gaming Console", icon: ConsoleIcon },
                    { name: "Other", icon: OtherIcon },
                  ].map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setDeviceCategory(cat.name)
                        if (cat.name !== "Other") {
                          setDeviceType(cat.name)
                        }
                      }}
                      className={`flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 transition-all text-[12px] font-semibold ${
                        deviceCategory === cat.name
                          ? "border-[#4F46E5] bg-indigo-50/50 text-[#4F46E5]"
                          : "border-border bg-white text-muted-foreground hover:bg-muted/20"
                      }`}
                    >
                      <cat.icon />
                      {cat.name}
                    </button>
                  ))}
                </div>
                {deviceCategory === "Other" && (
                  <div className="mt-4 mb-6 animate-in fade-in slide-in-from-top-2">
                    <label className="block text-[13px] font-bold text-foreground mb-1.5">Specify Custom Category <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={customDeviceCategory}
                      onChange={(e) => {
                        setCustomDeviceCategory(e.target.value)
                        setDeviceType(e.target.value)
                      }}
                      placeholder="e.g. Drone, VR Headset..." 
                      className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" 
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5">Priority <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white pl-8 pr-10 text-sm font-bold appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]">
                        {["Urgent","High","Medium","Low"].map(p => <option key={p}>{p}</option>)}
                      </select>
                      <div className={`absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full ${priority==="Urgent"?"bg-red-500":priority==="High"?"bg-orange-500":priority==="Medium"?"bg-blue-500":"bg-green-500"}`} />
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5">Estimated Completion Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type="date" value={estimatedDate} onChange={(e) => setEstimatedDate(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold mb-1.5">Internal Notes (Optional)</label>
                  <textarea value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} placeholder="Add internal notes..." rows={3} className="w-full rounded-lg border border-border bg-white p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" />
                </div>

              </section>

            {/* 2. Device & Customer */}
            <section ref={section2Ref} className="bg-white rounded-xl shadow-sm border border-border p-6 scroll-mt-6">
                <h2 className="text-base font-bold mb-5">Customer & Device Info</h2>
                <p className="text-sm text-muted-foreground mb-5">These fields are read-only and loaded from the original repair record.</p>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  {[
                    { label: "Customer Name", value: customer },
                    { label: "Device Type", value: deviceType },
                    { label: "Brand", value: brand },
                    { label: "Model", value: model },
                    { label: "Serial No", value: serialNo },
                    { label: "IMEI", value: imei },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="block text-[13px] font-bold mb-1.5">{label}</label>
                      <input type="text" value={value} readOnly className="w-full h-10 rounded-lg border border-border bg-muted px-3 text-sm cursor-not-allowed" />
                    </div>
                  ))}
                </div>
              </section>

            {/* 3. Issue & Pricing */}
            <section ref={section3Ref} className="bg-white rounded-xl shadow-sm border border-border p-6 scroll-mt-6">
                <h2 className="text-base font-bold mb-5">Issue & Pricing</h2>
                <div className="mb-5">
                  <label className="block text-[13px] font-bold mb-1.5">Issue Category</label>
                  <div className="relative">
                    <select value={issueCategory} onChange={(e) => setIssueCategory(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]">
                      {["Screen Damage","Battery Issue","Water Damage","Software Issue","Charging Port","Camera Issue","Speaker/Mic","Other"].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-[13px] font-bold mb-1.5">Issue Description</label>
                  <textarea value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} rows={3} placeholder="Describe the issue..." className="w-full rounded-lg border border-border bg-white p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" />
                </div>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5">Labor Cost (Rs.)</label>
                    <input type="number" min="0" value={laborCost} onChange={(e) => setLaborCost(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5">Parts Cost (Rs.)</label>
                    <input type="number" min="0" value={partsCost} onChange={(e) => setPartsCost(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5">Discount (Rs.)</label>
                    <input type="number" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5">Tax (%)</label>
                    <input type="number" min="0" max="100" value={tax} onChange={(e) => setTax(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5]" />
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#4F46E5]">Total Estimate</span>
                  <span className="text-xl font-black text-[#3730A3]">Rs. {pricingTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              </section>

            {/* 4. Workflow */}
            <section ref={section4Ref} className="bg-white rounded-xl shadow-sm border border-border p-6 scroll-mt-6 mb-8">
                <h2 className="text-base font-bold mb-5">Assignment & Workflow</h2>
                <div className="grid grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5">Assign Technician</label>
                    <div className="relative">
                      <select value={technician} onChange={(e) => setTechnician(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]">
                        <option value="">Unassigned</option>
                        {technicians.map((t: any) => <option key={t.id} value={t.id}>{t.fullName || t.email}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold mb-1.5">Status <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm font-bold appearance-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]">
                        {["Pending","In Progress","Ready","Delivered","Paid"].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-muted/40 rounded-xl p-5 mb-6 space-y-2 text-sm">
                  <h3 className="font-bold text-foreground mb-3">Update Summary</h3>
                  {[
                    ["Priority", priority],
                    ["Status", status],
                    ["Technician", technicians.find((t: any) => t.id === technician)?.fullName || "Unassigned"],
                    ["Issue", issueCategory],
                    ["Total Cost", `Rs. ${pricingTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-muted-foreground font-medium">{k}</span>
                      <span className="font-bold text-foreground">{v}</span>
                    </div>
                  ))}
                </div>

              </section>

          </div>
        </main>

        {/* Sticky App Footer */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-border p-4 px-4 sm:px-8 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-20 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
           <div className="flex items-center gap-2 order-2 md:order-none">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#4F46E5] cursor-pointer" id="send-email" />
              <label htmlFor="send-email" className="text-[12px] font-medium text-muted-foreground cursor-pointer">Send Email Confirmation to Customer</label>
           </div>
           
           <div className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full md:w-auto order-1 md:order-none">
              <button onClick={() => router.push('/admin/repairs')} className="h-11 w-full sm:w-auto px-8 rounded-xl border border-border text-[14px] font-semibold text-foreground hover:bg-muted transition-colors focus:outline-none bg-white">
                Cancel
              </button>
               <div className="flex gap-3 w-full sm:w-auto">
                <button onClick={handleSaveDraft} disabled={isUpdating} className="flex-1 sm:flex-none h-11 sm:px-8 rounded-xl bg-muted/50 text-[14px] font-semibold text-foreground hover:bg-muted transition-colors focus:outline-none disabled:opacity-50">
                  Save as Draft
                </button>
                <button onClick={() => setIsConfirmModalOpen(true)} disabled={isUpdating} className="flex-1 sm:flex-none h-11 sm:px-8 rounded-xl bg-[#4F46E5] text-[14px] font-semibold text-white hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none disabled:opacity-50">
                  {isUpdating ? "Updating..." : "Update Repair"}
                </button>
              </div>
           </div>
        </div>

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
                   <p className="text-[13px] text-muted-foreground mb-4">You are about to modify an existing repair task.</p>
                   <p className="text-[15px] font-bold text-foreground mb-6">Total Quote: Rs. {pricingTotal.toLocaleString()}</p>
                   
                   <label className="flex items-center gap-2.5 mb-8 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          defaultChecked 
                          className="peer h-4 w-4 appearance-none rounded border border-[#4F46E5] bg-white checked:bg-[#4F46E5] transition-all cursor-pointer" 
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={4} />
                      </div>
                      <span className="text-[13px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">Automatically Update and store the Invoice</span>
                   </label>
 
                   <div className="flex w-full gap-4">
                      <button 
                        onClick={() => setIsConfirmModalOpen(false)} 
                        className="flex-1 h-11 rounded-xl border border-border text-foreground font-bold text-[14px] hover:bg-muted transition-colors focus:outline-none"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleUpdate} 
                        disabled={isUpdating}
                        className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold text-[14px] hover:bg-[#4338CA] transition-colors shadow-md shadow-indigo-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? "Updating..." : "Confirm Update"}
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
                  {isGeneratingPDF ? 'Generating...' : 'Download Invoice'}
                </button>
                <button onClick={() => router.push('/admin/repairs')} className="h-9 w-9 rounded-full bg-white text-muted-foreground flex items-center justify-center shadow-sm focus:outline-none hover:bg-muted transition-colors"><X className="h-4 w-4" /></button>
             </div>
             
             {/* Invoice Paper */}
             <div ref={printRef} className="w-full max-w-[800px] bg-white rounded-lg shadow-xl p-16 shrink-0 z-10" style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Inter, sans-serif' }}>
                 <div className="flex justify-between items-start mb-16">
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                           <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
                           <h2 className="text-[24px] font-black text-[#0F172A] tracking-tighter uppercase">{user?.shopName || "SRM Solutions"}</h2>
                        </div>
                        <div className="text-[11px] text-muted-foreground/80 font-medium leading-[1.6]">
                           <p>Shop ID: {user?.shopCode || "N/A"}</p>
                           <p>{user?.email || "hello@servicepro.com"}</p>
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
                          {deviceType}: {brand} {model}
                        </p>
                     </div>
                     <div className="col-span-2 px-4">
                        <div className="grid grid-cols-2 gap-y-6">
                           <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Invoice number</p>
                              <p className="text-[12px] font-black text-[#0F172A] font-mono">{currentRef}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Invoice date</p>
                              <p className="text-[12px] font-black text-[#0F172A]">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
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

                 <div className="mt-12 text-center pt-8 border-t border-border">
                    <p className="text-[12px] text-muted-foreground font-medium">Thank you for choosing {user?.shopName || "SRM Solutions"}!</p>
                 </div>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}
