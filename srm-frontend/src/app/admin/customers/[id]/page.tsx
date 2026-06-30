"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"

import {
  ChevronRight, ArrowLeft, Copy, Phone, PhoneCall, Mail, MessageSquare, Calendar,
  Wrench, DollarSign, Star, X, Check, MoreVertical, MapPin,
  Trash2, CopyPlus, Plus, Search, Eye, Download
} from "lucide-react"


import { useGetCustomerByIdQuery, useDeleteCustomerMutation, useAddCustomerNoteMutation, useSearchCustomersQuery, useMergeCustomersMutation, useUpdateCustomerMutation, useSendCustomerSMSMutation } from "@/services/api/customersApiSlice"

import { useCreateAppointmentMutation } from "@/services/api/scheduleApiSlice"
import { useGetSettingsQuery } from "@/services/api/settingsApiSlice"
import { Loader2, AlertCircle, CalendarDays, Clock, UserCheck, FileText } from "lucide-react"


import { toast } from "sonner"
import { format } from "date-fns"

export default function CustomerDetailedPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()

  const { data: response, isLoading, error } = useGetCustomerByIdQuery(id)
  const [deleteCustomerMutation] = useDeleteCustomerMutation()
  const [addCustomerNoteMutation] = useAddCustomerNoteMutation()
  const [updateCustomer] = useUpdateCustomerMutation()
  const { data: settingsData } = useGetSettingsQuery({})
  const shopName = settingsData?.settings?.businessName || "Service Repair Management"
  const shopLogo = settingsData?.settings?.appearance?.logo || ""


  const customer = response?.data || response

  const [activeTab, setActiveTab] = useState("overview")
  const [internalNote, setInternalNote] = useState("")
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [mergeSearch, setMergeSearch] = useState("")
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null)


  // Modal states
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [mergeCustomersMutation] = useMergeCustomersMutation()
  const { data: searchResponse } = useSearchCustomersQuery(mergeSearch, { skip: mergeSearch.length < 2 || !isMergeModalOpen })
  const searchResults = searchResponse?.customers?.filter((c: any) => c.id !== id) || []
  const selectedTarget = searchResults.find((c: any) => c.id === selectedTargetId)

  const [communicationModalType, setCommunicationModalType] = useState<'Phone' | 'Mail' | 'SMS' | null>(null)
  const [communicationMessage, setCommunicationMessage] = useState("")
  const [sendCustomerSMS, { isLoading: isSendingSMS }] = useSendCustomerSMSMutation()


  // Schedule Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [createAppointmentMutation, { isLoading: isScheduling }] = useCreateAppointmentMutation()
  const [scheduleForm, setScheduleForm] = useState({
    type: 'Call' as 'Call' | 'Meeting',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00',
    notes: ''
  })


  const customerName = customer?.name || "Loading..."
  const customerEmail = customer?.email || "N/A"
  const customerPhone = customer?.phone || "N/A"
  const customerAddress = customer?.address || "N/A"

  const repairsCount = customer?.repairs?.length || 0
  const spentRaw = customer?.repairs?.reduce((acc: number, curr: any) => acc + (curr.finalCost || curr.estimatedCost || curr.totalPrice || 0), 0) || 0

  let lastVisitDays = 0
  let lastVisitLabel = "N/A"
  if (customer?.repairs && customer?.repairs.length > 0) {
    const sorted = [...customer.repairs].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const diffTime = Math.abs(new Date().getTime() - new Date(sorted[0].createdAt).getTime())
    lastVisitDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    lastVisitLabel = lastVisitDays === 0 ? "Today" : lastVisitDays === 1 ? "Yesterday" : `${lastVisitDays}d ago`
  }

  const customerTier = customer?.tier || "Regular"


  const customerNotes = customer?.notes || []
  const recentRepairs = [...(customer?.repairs || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  const handleAddNote = async () => {
    if (!internalNote.trim()) return
    try {
      await addCustomerNoteMutation({ customerId: id, text: internalNote }).unwrap()
      toast.success("Note added successfully")
      setInternalNote("")
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to add note")
    }
  }

  const handleCopy = (text: string) => {
    if (!text || text === "N/A") return
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard: " + text)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toUpperCase() !== "DELETE") {
      toast.error("Please type DELETE to confirm.")
      return
    }
    try {
      await deleteCustomerMutation(id).unwrap()
      toast.success("Customer Deleted Successfully!")
      router.push("/admin/customers")
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to delete customer.")
    }
  }

  const handleMergeAction = async () => {
    if (!selectedTargetId) {
      toast.error("Please select a target customer to merge into.")
      return
    }
    try {
      await mergeCustomersMutation({ sourceId: id, targetId: selectedTargetId }).unwrap()
      toast.success("Customers merged successfully!")
      router.push("/admin/customers")
    } catch (err: any) {
      toast.error(err.data?.message || "Merge failed.")
    }
  }

  const handleTogglePreference = async (key: string) => {
    const currentPrefs = customer?.preferences || {}
    const currentNotifications = currentPrefs.notifications || {}

    const newPrefs = {
      ...currentPrefs,
      notifications: {
        ...currentNotifications,
        [key]: !currentNotifications[key]
      }
    }

    try {
      await updateCustomer({ id, preferences: newPrefs }).unwrap()
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} preference updated`)
    } catch (err: any) {
      toast.error("Failed to update preferences")
    }
  }

  const handleSchedule = async () => {

    try {
      const scheduledAt = new Date(`${scheduleForm.date}T${scheduleForm.time}`)
      await createAppointmentMutation({
        shopId: customer?.shopId || "", // Assuming customer object has shopId
        customerId: id,
        scheduledAt: scheduledAt.toISOString(),
        notes: scheduleForm.notes,
        type: scheduleForm.type,
        duration: 30
      }).unwrap()

      toast.success(`Successfully scheduled ${scheduleForm.type.toLowerCase()} and sent SMS`)
      setIsScheduleModalOpen(false)
      setScheduleForm({
        type: 'Call',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '10:00',
        notes: ''
      })
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to schedule appointment")
    }
  }

  const handleDownloadRepairReport = async (repair: any) => {
    try {
      const { default: jsPDF } = await import("jspdf")
      const { default: autoTable } = await import("jspdf-autotable")
      const doc = new jsPDF()

      const businessTIN = settingsData?.settings?.tin || "N/A"
      const businessAddress = settingsData?.settings?.hqAddress || "Sri Lanka"
      const businessEmail = settingsData?.settings?.supportEmail || "support@futura.lk"
      const businessPhone = settingsData?.settings?.primaryContact || "+94 ..."

      // 1. Header Branding (Left: Business Info, Right: Invoice Title)
      doc.setFillColor(248, 250, 252)
      doc.rect(0, 0, 210, 50, "F")

      doc.setTextColor(30, 41, 59)
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.text(shopName, 14, 25)

      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(100, 116, 139)
      doc.text(`TIN: ${businessTIN}`, 14, 32)
      doc.text(businessAddress, 14, 37)
      doc.text(`Email: ${businessEmail} | Phone: ${businessPhone}`, 14, 42)

      doc.setTextColor(79, 70, 229)
      doc.setFontSize(28)
      doc.setFont("helvetica", "bold")
      doc.text("INVOICE", 145, 25)

      doc.setTextColor(100, 116, 139)
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text(`TICKET NO: #${repair.repairNumber || repair.id.slice(-6).toUpperCase()}`, 145, 33)
      doc.text(`DATE: ${format(new Date(), 'dd MMM yyyy')}`, 145, 38)

      // 2. Bill To Section
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text("BILL TO:", 14, 65)

      doc.setFontSize(12)
      doc.text(customerName, 14, 72)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(71, 85, 105)
      doc.text(customerAddress, 14, 78)
      doc.text(customerPhone, 14, 83)
      doc.text(customerEmail, 14, 88)

      // 3. Service Table
      autoTable(doc, {
        startY: 100,
        head: [["DESCRIPTION", "CATEGORY", "STATUS", "AMOUNT"]],
        body: [
          [
            `${repair.model} - ${repair.issue || 'General Repair/Service'}`,
            repair.category || 'Electronic Repair',
            repair.status,
            `Rs. ${(repair.totalPrice || 0).toLocaleString()}`
          ]
        ],
        theme: 'grid',
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 5,
          textColor: [30, 41, 59]
        },
        columnStyles: {
          3: { halign: 'right', fontStyle: 'bold' }
        }
      })

      // 4. Financial Summary (Right Aligned)
      const finalY = (doc as any).lastAutoTable.finalY || 130
      const summaryX = 140

      doc.setFontSize(10)
      doc.setTextColor(100, 116, 139)
      doc.setFont("helvetica", "normal")
      doc.text("Subtotal:", summaryX, finalY + 15)
      doc.text("Tax (0%):", summaryX, finalY + 22)
      doc.text("Discount:", summaryX, finalY + 29)

      doc.setTextColor(30, 41, 59)
      doc.setFont("helvetica", "bold")
      doc.text(`Rs. ${(repair.totalPrice || 0).toLocaleString()}`, 196, finalY + 15, { align: 'right' })
      doc.text("Rs. 0.00", 196, finalY + 22, { align: 'right' })
      doc.text("Rs. 0.00", 196, finalY + 29, { align: 'right' })

      // Total Payable Highlight
      doc.setFillColor(79, 70, 229)
      doc.rect(summaryX - 5, finalY + 35, 75, 12, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.text("TOTAL PAYABLE:", summaryX, finalY + 43)
      doc.text(`Rs. ${(repair.totalPrice || 0).toLocaleString()}`, 196, finalY + 43, { align: 'right' })

      // 5. Footer / Terms
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text("Notes & Terms:", 14, finalY + 65)
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(100, 116, 139)
      doc.text("1. All repairs include a standard 30-day warranty.", 14, finalY + 72)
      doc.text("2. Please present this invoice for any warranty claims.", 14, finalY + 77)

      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(79, 70, 229)
      doc.text(`Thank you for your business!`, 105, finalY + 95, { align: 'center' })

      doc.save(`Invoice_${repair.repairNumber || repair.id.slice(-6)}.pdf`)
      toast.success("Invoice PDF generated")
    } catch (e) {
      toast.error("Failed to generate Invoice")
    }
  }


  const handleDownloadDeviceSpecs = async (device: any) => {
    try {
      const { default: jsPDF } = await import("jspdf")
      const { default: autoTable } = await import("jspdf-autotable")
      const doc = new jsPDF()

      // Header Branding
      doc.setFillColor(30, 41, 59)
      doc.rect(0, 0, 210, 25, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.setFont("helvetica", "bold")
      doc.text(shopName, 14, 16)

      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.text("DEVICE SPECIFICATION SHEET", 150, 16)

      // Device Summary
      doc.setTextColor(30, 30, 30)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("Device Identification", 14, 40)

      autoTable(doc, {
        startY: 50,
        head: [["Attribute", "Specification"]],
        body: [
          ["Brand", device.brand],
          ["Model", device.model || device.name],
          ["IMEI / Serial", device.serialNumber || 'N/A'],
          ["Physical Color", device.color || 'Standard'],
          ["Storage Capacity", device.storage || 'N/A'],
          ["Status", device.status || 'Active'],
          ["Owner", customerName]
        ],
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59], textColor: 255 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
      })

      doc.save(`device_specs_${device.model || 'unit'}.pdf`)
      toast.success("Device specs downloaded")
    } catch (e) {
      toast.error("Failed to generate PDF")
    }
  }





  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#F8FAFC] dark:bg-background">
        <DashboardSidebar />
        <div className="flex-1 lg:ml-[200px] flex flex-col">
          <DashboardHeader />
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-[#4F46E5] animate-spin" />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-[#F8FAFC] dark:bg-background text-foreground min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        <DashboardHeader />
        <main className="flex-1 flex flex-col items-center overflow-y-auto">

          {/* Maximum constraints for a beautiful responsive layout */}
          <div className="w-full max-w-[1200px] px-8 py-8">

            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-6">
              <Link href="/admin/dashboard" className="hover:text-foreground transition-colors cursor-pointer text-[#4F46E5]">Dashboard</Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              <Link href="/admin/customers" className="hover:text-foreground transition-colors cursor-pointer text-[#4F46E5]">Customers</Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              <span className="text-[#0F172A] dark:text-foreground">{customerName}</span>
            </div>

            <button onClick={() => router.push("/admin/customers")} className="flex items-center gap-2 text-[13px] font-bold text-muted-foreground hover:text-[#0F172A] dark:hover:text-foreground dark:text-foreground transition-colors mb-6 focus:outline-none">
              <ArrowLeft className="h-4 w-4" /> All Customers
            </button>

            {/* Customer Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-[32px] font-black text-[#0F172A] dark:text-foreground tracking-tight">{customerName}</h1>
                  <span className={`px-3 py-1 rounded-full text-[12px] font-bold border shadow-sm ${customerTier === 'VIP' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      customerTier === 'Corporate' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        customerTier === 'New' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                    {customerTier}
                  </span>
                </div>
                <p className="text-[14px] text-muted-foreground font-medium flex items-center gap-2">
                  Customer ID: <span className="text-[#0F172A] dark:text-foreground font-bold">{id.slice(-8).toUpperCase()}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                  Joined {customer?.createdAt ? format(new Date(customer.createdAt), 'MMM yyyy') : 'Recently'}
                </p>
              </div>
            </div>

            {/* Customer Header & Tabs */}
            <div className="flex flex-col border-b border-border dark:border-white/10 mb-8">
              <div className="flex items-center gap-8 text-[14px] font-bold text-muted-foreground">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-3 focus:outline-none transition-colors border-b-2 ${activeTab === 'overview' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent hover:text-[#0F172A] dark:hover:text-foreground dark:text-foreground'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("repairs")}
                  className={`pb-3 focus:outline-none transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'repairs' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent hover:text-[#0F172A] dark:hover:text-foreground dark:text-foreground'}`}
                >
                  Repairs <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-black text-foreground">{customer?.repairs?.length || 0}</span>
                </button>
                <button
                  onClick={() => setActiveTab("devices")}
                  className={`pb-3 focus:outline-none transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'devices' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent hover:text-[#0F172A] dark:hover:text-foreground dark:text-foreground'}`}
                >
                  Devices <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-black text-foreground">{customer?.devices?.length || 0}</span>
                </button>
              </div>
            </div>

            {/* Tab Content -> Overview layout */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

                {/* ===================== LEFT COLUMN ===================== */}
                <div className="flex flex-col gap-6">

                  {/* 1. Contact Information */}
                  <section className="bg-card rounded-xl shadow-sm border border-border dark:border-white/10 p-6 relative">
                    <h2 className="text-[14px] font-bold text-[#0F172A] dark:text-foreground mb-5">Contact Information</h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <Mail className="h-[18px] w-[18px] text-muted-foreground" />
                          <span className="text-[14px] font-medium text-[#0F172A] dark:text-foreground">{customerEmail}</span>
                        </div>
                        <button onClick={() => handleCopy(customerEmail)} className="flex items-center gap-1.5 text-[12px] font-bold text-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none">
                          <Copy className="h-3.5 w-3.5" /> Copy
                        </button>
                      </div>

                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <Phone className="h-[18px] w-[18px] text-muted-foreground" />
                          <span className="text-[14px] font-medium text-[#0F172A] dark:text-foreground">{customerPhone}</span>
                        </div>
                        <button onClick={() => handleCopy(customerPhone)} className="flex items-center gap-1.5 text-[12px] font-bold text-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none">
                          <Copy className="h-3.5 w-3.5" /> Copy
                        </button>
                      </div>

                      <div className="flex items-start justify-between group">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-[18px] w-[18px] text-muted-foreground mt-0.5" />
                          <div className="flex flex-col">
                            <span className="text-[14px] font-medium text-[#0F172A] dark:text-foreground">{customerAddress}</span>
                            <button className="flex items-center gap-1 text-[12px] font-bold text-[#4F46E5] mt-1 self-start hover:underline focus:outline-none">
                              <MapPin className="h-3 w-3" /> View on map
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 2. Top Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Stat 1 */}
                    <div className="bg-card rounded-xl shadow-sm border border-border dark:border-white/10 p-5 flex flex-col">
                      <div className="h-10 w-10 rounded-lg bg-[#EEF2FF] dark:bg-[#4F46E5]/10 flex items-center justify-center mb-3">
                        <Wrench className="h-5 w-5 text-[#4F46E5]" />
                      </div>
                      <span className="text-[24px] font-black text-[#0F172A] dark:text-foreground leading-none mb-1">{customer?.repairs?.length || 0}</span>
                      <span className="text-[11px] font-bold text-muted-foreground mb-3">Total Repairs</span>
                      <span className="inline-flex text-[10px] font-bold text-[#10B981] mt-auto">Lifetime History</span>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-card rounded-xl shadow-sm border border-border dark:border-white/10 p-5 flex flex-col">
                      <div className="h-10 w-10 rounded-lg bg-[#ECFDF5] dark:bg-[#10B981]/10 flex items-center justify-center mb-3">
                        <DollarSign className="h-5 w-5 text-[#10B981]" />
                      </div>
                      <span className="text-[24px] font-black text-[#0F172A] dark:text-foreground leading-none mb-1">Rs. {spentRaw.toLocaleString()}</span>
                      <span className="text-[11px] font-bold text-muted-foreground mb-3">Total Spent</span>
                      <span className="inline-flex text-[10px] font-bold text-[#10B981] mt-auto">Net Revenue</span>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-card rounded-xl shadow-sm border border-border dark:border-white/10 p-5 flex flex-col">
                      <div className="h-10 w-10 rounded-lg bg-[#FEF3C7] dark:bg-[#F59E0B]/10 flex items-center justify-center mb-3">
                        <Calendar className="h-5 w-5 text-[#F59E0B]" />
                      </div>
                      <span className="text-[24px] font-black text-[#0F172A] dark:text-foreground leading-none mb-1">{lastVisitLabel}</span>
                      <span className="text-[11px] font-bold text-muted-foreground mb-3">Last Visit</span>
                      <div className="flex items-center gap-0.5 text-[#F59E0B] mt-auto">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Activity Tracking</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Recent Activity */}
                  <section className="bg-card rounded-xl shadow-sm border border-border dark:border-white/10 p-6">
                    <h2 className="text-[14px] font-bold text-[#0F172A] dark:text-foreground mb-6">Recent Activity</h2>

                    <div className="relative pl-3 space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-border before:via-border before:to-transparent">

                      {recentRepairs.length === 0 ? (
                        <p className="text-[12px] text-muted-foreground py-4 italic text-center">No recent activity recorded.</p>
                      ) : (
                        recentRepairs.map((repair: any) => (
                          <div key={repair.id} className="relative flex items-start gap-4">
                            <div className={`relative z-10 flex h-4 w-4 shrink-0 mt-0.5 items-center justify-center rounded-full ring-4 ring-white ${repair.status === 'Completed' ? 'bg-[#10B981]' : 'bg-[#3B82F6]'}`} />
                            <div className="flex flex-col flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[13px] font-bold text-[#0F172A] dark:text-foreground">Repair {repair.status}</span>
                                <span className="text-[11px] text-muted-foreground font-medium">{format(new Date(repair.createdAt), 'MMM dd, yyyy')}</span>
                              </div>
                              <p className="text-[12px] text-muted-foreground mt-0.5">{repair.model} - Ticket #{repair.repairNumber || repair.id.slice(-6).toUpperCase()}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>

                  {/* 4. Internal Notes */}
                  <section className="bg-card rounded-xl shadow-sm border border-border dark:border-white/10 p-6 mb-6">
                    <h2 className="text-[14px] font-bold text-[#0F172A] dark:text-foreground mb-4">Internal Notes</h2>

                    <div className="border border-border dark:border-white/10 rounded-xl bg-card overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-[#4F46E5] transition-all mb-6">
                      <textarea
                        rows={3}
                        placeholder="Add a note about this customer..."
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        className="w-full p-4 text-[13px] border-none focus:ring-0 resize-none outline-none placeholder:text-muted-foreground"
                      />
                      <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] dark:bg-background border-t border-border dark:border-white/10">
                        <div />
                        <button onClick={handleAddNote} className="h-8 px-5 rounded-lg bg-[#4F46E5] text-[12px] font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors focus:outline-none flex items-center gap-1.5">
                          <Plus className="h-3.5 w-3.5" /> Add Note
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {customerNotes.length === 0 ? (
                        <p className="text-[13px] text-muted-foreground italic">No internal notes for this customer.</p>
                      ) : (
                        customerNotes.map((note: any) => {
                          const authorName = note.user?.fullName || note.user?.name || 'Staff Member';
                          return (
                            <div key={note.id} className="flex gap-4">
                              <img src={`https://ui-avatars.com/api/?name=${authorName}&background=random`} alt={authorName} className="h-8 w-8 shrink-0 rounded-full border border-border dark:border-white/10 object-cover" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[12px] font-bold text-[#0F172A] dark:text-foreground">{authorName}</span>
                                  <span className="text-[11px] text-muted-foreground">{format(new Date(note.createdAt), 'MMM dd, yyyy p')}</span>
                                </div>
                                <p className="text-[13px] text-[#334155] dark:text-slate-300 leading-relaxed">{note.text}</p>
                              </div>
                            </div>
                          );
                        })

                      )}
                    </div>
                  </section>

                </div>

                {/* ===================== RIGHT COLUMN ===================== */}
                <div className="flex flex-col gap-6">

                  {/* 1. Quick Actions */}
                  <div className="bg-card rounded-xl shadow-sm border border-border dark:border-white/10 p-6">
                    <h3 className="text-[14px] font-bold text-[#0F172A] dark:text-foreground mb-5">Quick Actions</h3>

                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setCommunicationModalType('Phone')} className="flex flex-col items-center justify-center gap-2 h-[72px] rounded-lg border border-border dark:border-white/10 bg-card text-muted-foreground hover:bg-muted hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all focus:outline-none shadow-sm group">
                        <PhoneCall className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-[#0F172A] dark:text-foreground">Call</span>
                      </button>
                      <button onClick={() => setCommunicationModalType('Mail')} className="flex flex-col items-center justify-center gap-2 h-[72px] rounded-lg border border-border dark:border-white/10 bg-card text-muted-foreground hover:bg-muted hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all focus:outline-none shadow-sm group">
                        <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-[#0F172A] dark:text-foreground">Email</span>
                      </button>
                      <button onClick={() => setCommunicationModalType('SMS')} className="flex flex-col items-center justify-center gap-2 h-[72px] rounded-lg border border-border dark:border-white/10 bg-card text-muted-foreground hover:bg-muted hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all focus:outline-none shadow-sm group">
                        <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-[#0F172A] dark:text-foreground">SMS</span>
                      </button>
                      <button onClick={() => setIsScheduleModalOpen(true)} className="flex flex-col items-center justify-center gap-2 h-[72px] rounded-lg border border-border dark:border-white/10 bg-card text-muted-foreground hover:bg-muted hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all focus:outline-none shadow-sm group">
                        <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-[#0F172A] dark:text-foreground">Schedule</span>
                      </button>

                    </div>
                  </div>

                  {/* 2. Tags */}
                  <div className="bg-card rounded-xl shadow-sm border border-border dark:border-white/10 p-6">
                    <h3 className="text-[14px] font-bold text-[#0F172A] dark:text-foreground mb-4">Tags</h3>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {/* Primary Tier Tag */}
                      {customerTier === 'VIP' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF7ED] text-[#EA580C] text-[11px] font-bold border border-[#FFEDD5]">
                          <Star className="h-3.5 w-3.5 fill-current" /> VIP
                        </span>
                      )}
                      {customerTier === 'Corporate' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF5FF] text-[#9333EA] text-[11px] font-bold border border-[#F3E8FF]">
                          Corporate
                        </span>
                      )}
                      {customerTier === 'Regular' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] text-[#475569] text-[11px] font-bold border border-border dark:border-white/10">
                          Regular
                        </span>
                      )}

                      {/* Additional Tags from Array */}
                      {customer?.tags?.filter((t: string) => t !== customerTier).map((tag: string) => (
                        <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8FAFC] dark:bg-background text-[#0F172A] dark:text-foreground text-[11px] font-bold border border-border dark:border-white/10 group">
                          {tag} <X className="h-3 w-3 text-muted-foreground hover:text-red-500 cursor-pointer transition-colors" />
                        </span>
                      ))}
                    </div>



                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Add tag..."
                        className="w-full h-9 pl-3 pr-3 text-[12px] rounded-lg border border-border dark:border-white/10 bg-card focus:outline-none focus:ring-1 focus:ring-[#4F46E5] shadow-sm"
                      />
                    </div>
                  </div>

                  {/* 3. Loyalty Program */}
                  <div className="bg-card rounded-xl shadow-sm border border-border dark:border-white/10 p-6">
                    <h3 className="text-[14px] font-bold text-[#0F172A] dark:text-foreground mb-5">Loyalty Program</h3>

                    <div className="flex justify-between items-end mb-4">
                      <span className="text-[32px] font-black text-[#4F46E5] leading-none mb-[-4px]">{customer?.loyaltyPoints || 0}</span>
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">points</span>
                    </div>

                    <div className="flex justify-between items-center text-[12px] font-bold text-[#0F172A] dark:text-foreground mb-3">
                      <span className="text-muted-foreground font-medium">Tier</span>
                      <span className="inline-flex items-center gap-1 text-[#D97706]"><Star className="h-3.5 w-3.5 fill-[#D97706]" /> {customerTier}</span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] font-bold text-[#0F172A] dark:text-foreground mb-1.5">
                      <span className="text-muted-foreground">Next reward</span>
                      <span className="text-[#0F172A] dark:text-foreground">{(customer?.pointsToNextTier || 100)} points away</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-[#4F46E5] rounded-full" style={{ width: `${Math.min(100, ((customer?.loyaltyPoints || 0) % 100))}%` }} />
                    </div>
                  </div>

                  {/* 4. Preferences */}
                  <div className="bg-card rounded-xl shadow-sm border border-border dark:border-white/10 p-6">
                    <h3 className="text-[14px] font-bold text-[#0F172A] dark:text-foreground mb-5">Preferences</h3>

                    <div className="space-y-4 text-[12px] font-medium text-[#0F172A] dark:text-foreground">
                      <div className="flex justify-between items-center border-b border-border dark:border-white/10/50 pb-3">
                        <span className="text-muted-foreground">Preferred Contact</span>
                        <span className="font-bold">{customer?.preferences?.preferredContact || 'Phone'}</span>
                      </div>

                      <div className="pb-1">
                        <span className="block text-muted-foreground mb-3">Notifications</span>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between group">
                            <span className="text-[13px] text-[#334155] dark:text-slate-300">Email Notifications</span>
                            <button
                              onClick={() => handleTogglePreference('email')}
                              className="focus:outline-none transition-transform active:scale-95"
                            >
                              {customer?.preferences?.notifications?.email ? (
                                <div className="h-5 w-5 rounded-[2px] bg-[#7C3AED] flex items-center justify-center shadow-sm">
                                  <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />
                                </div>
                              ) : (
                                <div className="h-5 w-5 rounded-[2px] border border-border dark:border-white/10 bg-card" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center justify-between group">
                            <span className="text-[13px] text-[#334155] dark:text-slate-300">SMS Notifications</span>
                            <button
                              onClick={() => handleTogglePreference('sms')}
                              className="focus:outline-none transition-transform active:scale-95"
                            >
                              {customer?.preferences?.notifications?.sms ? (
                                <div className="h-5 w-5 rounded-[2px] bg-[#7C3AED] flex items-center justify-center shadow-sm">
                                  <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />
                                </div>
                              ) : (
                                <div className="h-5 w-5 rounded-[2px] border border-border dark:border-white/10 bg-card" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center justify-between group">
                            <span className="text-[13px] text-[#334155] dark:text-slate-300">Push Notifications</span>
                            <button
                              onClick={() => handleTogglePreference('push')}
                              className="focus:outline-none transition-transform active:scale-95"
                            >
                              {customer?.preferences?.notifications?.push ? (
                                <div className="h-5 w-5 rounded-[2px] bg-[#7C3AED] flex items-center justify-center shadow-sm">
                                  <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />
                                </div>
                              ) : (
                                <div className="h-5 w-5 rounded-[2px] border border-border dark:border-white/10 bg-card" />
                              )}
                            </button>
                          </div>
                        </div>




                      </div>

                      <div className="flex justify-between items-center border-t border-border dark:border-white/10/50 pt-3">
                        <span className="text-muted-foreground">Language</span>
                        <span className="font-bold">{customer?.preferences?.language || 'English'}</span>
                      </div>
                    </div>
                  </div>

                  {/* 5. Danger Zone */}
                  <div className="bg-card rounded-xl shadow-sm border border-red-200 p-6 flex flex-col gap-3">
                    <h3 className="text-[14px] font-bold text-red-600 mb-2">Danger Zone</h3>

                    <button onClick={() => setIsMergeModalOpen(true)} className="flex justify-center items-center gap-2 h-9 rounded-lg border border-border dark:border-white/10 bg-card text-[12px] font-bold text-[#0F172A] dark:text-foreground hover:bg-muted transition-colors focus:outline-none shadow-sm">
                      <CopyPlus className="h-3.5 w-3.5" /> Merge with Another Customer
                    </button>
                    <button onClick={() => setIsDeleteModalOpen(true)} className="flex justify-center items-center gap-2 h-9 rounded-lg border border-red-200 bg-red-50 text-[12px] font-bold text-red-600 hover:bg-red-100 transition-colors focus:outline-none shadow-sm">
                      <Trash2 className="h-3.5 w-3.5" /> Delete Customer
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* Repairs Tab Content */}
            {activeTab === "repairs" && (
              <div className="bg-card rounded-xl shadow-sm border border-border dark:border-white/10 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F8FAFC] dark:bg-background border-b border-border dark:border-white/10 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      <th className="px-6 py-4">Ticket</th>
                      <th className="px-6 py-4">Device</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Cost</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>

                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {customer?.repairs?.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">No repairs found for this customer.</td></tr>
                    ) : (
                      customer?.repairs?.map((repair: any) => (
                        <tr key={repair.id} className="hover:bg-[#F8FAFC] dark:bg-background/50 transition-colors">
                          <td className="px-6 py-4 text-[13px] font-black text-[#4F46E5]">#{repair.repairNumber || repair.id.slice(-6).toUpperCase()}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-[#0F172A] dark:text-foreground">{repair.model}</span>
                              <span className="text-[11px] text-muted-foreground">{repair.issue || 'General Service'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${repair.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                              {repair.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[12px] font-medium text-muted-foreground">{format(new Date(repair.createdAt), 'MMM dd, yyyy')}</td>
                          <td className="px-6 py-4 text-right text-[13px] font-black text-[#0F172A] dark:text-foreground">Rs. {(repair.totalPrice || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/repairs/${repair.id.trim()}`}
                                className="h-8 w-8 rounded-lg border border-border dark:border-white/10 bg-card flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all focus:outline-none"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleDownloadRepairReport(repair)}
                                className="h-8 w-8 rounded-lg border border-border dark:border-white/10 bg-card flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all focus:outline-none"
                              >
                                <Download className="h-4 w-4" />
                              </button>

                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Devices Tab Content */}
            {activeTab === "devices" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customer?.devices?.length === 0 ? (
                  <div className="col-span-full bg-card rounded-xl shadow-sm border border-border dark:border-white/10 p-12 text-center">
                    <p className="text-muted-foreground italic">No devices registered for this customer.</p>
                  </div>
                ) : (
                  customer?.devices?.map((device: any) => (
                    <div key={device.id} className="bg-card rounded-xl shadow-sm border border-border dark:border-white/10 p-5 hover:border-[#4F46E5]/30 transition-all group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-[#EEF2FF] dark:bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5] group-hover:scale-110 transition-transform">
                          <Wrench className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-black text-[#0F172A] dark:text-foreground">{device.model || device.name}</span>
                          <span className="text-[11px] font-bold text-[#4F46E5]">{device.brand}</span>
                        </div>
                      </div>
                      <div className="space-y-2 border-t border-border dark:border-white/10/50 pt-4">
                        <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">IMEI/Serial</span><span className="font-bold text-[#0F172A] dark:text-foreground">{device.serialNumber || 'N/A'}</span></div>
                        <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">Status</span><span className="font-bold text-emerald-600">{device.status || 'Active'}</span></div>

                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border dark:border-white/10/30">
                          <Link
                            href={`/admin/devices/${device.id.trim()}`}
                            className="flex-1 h-8 rounded-lg border border-border dark:border-white/10 bg-card flex items-center justify-center gap-2 text-[11px] font-bold text-muted-foreground hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all focus:outline-none"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </Link>

                          <button
                            onClick={() => handleDownloadDeviceSpecs(device)}
                            className="w-10 h-8 rounded-lg border border-border dark:border-white/10 bg-card flex items-center justify-center text-muted-foreground hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all focus:outline-none"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>

                        </div>
                      </div>
                    </div>

                  ))
                )}
              </div>
            )}



          </div>
        </main>

        {/* ===================== MODALS ===================== */}

        {/* 1. Delete Customer Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
            <div className="bg-card w-full max-w-[440px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-red-100">
              <div className="flex flex-col items-center justify-center p-8 pb-6 text-center">
                <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-5">
                  <Trash2 className="h-8 w-8" />
                </div>
                <h2 className="text-[20px] font-black text-[#0F172A] dark:text-foreground mb-2 tracking-tight">Delete Customer Account?</h2>
                <p className="text-[14px] text-muted-foreground leading-relaxed mt-4">
                  Are you sure you want to completely erase the record for <span className="font-bold text-[#0F172A] dark:text-foreground">{customerName}</span>? This action is permanent and will orphan {customer?.repairs?.length || 0} historical repair records.
                </p>
              </div>
              <div className="px-8 pb-8 flex flex-col gap-4">
                <div className="mb-4">
                  <label className="block text-[12px] font-bold text-red-600 mb-2 uppercase tracking-widest">Type "DELETE" below to confirm</label>
                  <input
                    type="text"
                    placeholder="DELETE"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full h-11 rounded-lg border border-red-200 bg-red-50/50 px-4 text-[14px] font-black tracking-widest text-[#0F172A] dark:text-foreground focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-center uppercase"
                  />
                </div>
                <div className="flex w-full gap-3 mt-2">
                  <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 h-11 rounded-xl border border-border dark:border-white/10 bg-card text-[#0F172A] dark:text-foreground font-bold hover:bg-muted transition-colors focus:outline-none">
                    Go Back
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 h-11 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-md transition-colors focus:outline-none"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Merge Customer Modal */}
        {isMergeModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
            <div className="bg-card w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-border dark:border-white/10 bg-[#F8FAFC] dark:bg-background">
                <h2 className="text-[18px] font-black text-[#0F172A] dark:text-foreground flex items-center gap-2">
                  <CopyPlus className="h-5 w-5 text-[#4F46E5]" /> Merge Customer Profiles
                </h2>
                <button onClick={() => setIsMergeModalOpen(false)} className="h-8 w-8 rounded-full bg-card border border-border dark:border-white/10 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#0F172A] dark:hover:text-foreground dark:text-foreground transition-colors focus:outline-none shadow-sm">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              <div className="p-6">
                <p className="text-[13px] text-muted-foreground mb-6">
                  Select the destination profile. All repair histories, devices, and communications from <span className="font-bold text-[#0F172A] dark:text-foreground">{customerName}</span> will be migrated over.
                </p>

                <div className="mb-8">
                  <label className="block text-[12px] font-bold text-[#0F172A] dark:text-foreground mb-2">Search target customer</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, email, or phone..."
                      value={mergeSearch}
                      onChange={(e) => setMergeSearch(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 rounded-xl border border-border dark:border-white/10 bg-card text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>

                  {searchResults.length > 0 && (
                    <div className="mt-2 max-h-48 overflow-y-auto border border-border dark:border-white/10 rounded-xl bg-card shadow-sm divide-y divide-border">
                      {searchResults.map((res: any) => (
                        <button
                          key={res.id}
                          onClick={() => {
                            setSelectedTargetId(res.id)
                            setMergeSearch("")
                          }}
                          className={`w-full p-3 text-left hover:bg-muted transition-colors flex flex-col ${selectedTargetId === res.id ? 'bg-[#EEF2FF] dark:bg-[#4F46E5]/10' : ''}`}
                        >
                          <span className="text-[13px] font-bold text-[#0F172A] dark:text-foreground">{res.name}</span>
                          <span className="text-[11px] text-muted-foreground">{res.email || res.phone}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 p-4 border border-border dark:border-white/10 rounded-xl bg-[#F8FAFC] dark:bg-background">
                    <span className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Target Overview</span>
                    {selectedTarget ? (
                      <div className="flex flex-col gap-1">
                        <p className="text-[14px] font-black text-[#0F172A] dark:text-foreground">{selectedTarget.name}</p>
                        <p className="text-[12px] text-muted-foreground">{selectedTarget.email} • {selectedTarget.phone}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-[#4F46E5]/10 text-[#4F46E5] text-[10px] font-bold border border-[#4F46E5]/20">Destination Profile</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[13px] text-muted-foreground">Select a customer above to preview destination profile.</p>
                    )}
                  </div>
                </div>

                <div className="flex w-full gap-3">
                  <button onClick={() => {
                    setIsMergeModalOpen(false)
                    setSelectedTargetId(null)
                    setMergeSearch("")
                  }} className="flex-1 h-11 rounded-xl border border-border dark:border-white/10 bg-card text-[#0F172A] dark:text-foreground font-bold hover:bg-muted transition-colors focus:outline-none">
                    Cancel
                  </button>
                  <button
                    disabled={!selectedTargetId}
                    onClick={handleMergeAction}
                    className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none disabled:opacity-50"
                  >
                    Initiate Merge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Communication Modal */}
        {communicationModalType && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
            <div className="bg-card w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-6 border-b border-border dark:border-white/10 bg-[#F8FAFC] dark:bg-background">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#EEF2FF] dark:bg-[#4F46E5]/10 text-[#4F46E5]">
                    {communicationModalType === 'Phone' ? <PhoneCall className="h-5 w-5" /> : communicationModalType === 'Mail' ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                  </div>
                  <div>
                    <h2 className="text-[16px] font-black text-[#0F172A] dark:text-foreground leading-tight">
                      {communicationModalType === 'Phone' ? "Initiate Call" : communicationModalType === 'Mail' ? "Send Email" : "Send SMS"}
                    </h2>
                    <p className="text-[12px] font-bold text-[#4F46E5]">To: {customerName}</p>
                  </div>
                </div>
                <button onClick={() => setCommunicationModalType(null)} className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#0F172A] dark:hover:text-foreground dark:text-foreground transition-colors focus:outline-none">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-[#F8FAFC] dark:bg-background border border-border dark:border-white/10 rounded-xl p-4 mb-5">
                  {communicationModalType === 'Phone' || communicationModalType === 'SMS' ? (
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-muted-foreground">Main Line</span>
                      <span className="text-[14px] font-black text-[#0F172A] dark:text-foreground font-mono">{customerPhone}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-muted-foreground">Primary Address</span>
                      <span className="text-[14px] font-black text-[#0F172A] dark:text-foreground">{customerEmail}</span>
                    </div>
                  )}
                </div>

                {communicationModalType !== 'Phone' && (
                  <div className="mb-6">
                    <label className="block text-[12px] font-bold text-[#0F172A] dark:text-foreground mb-2">Message Payload</label>
                    <textarea
                      rows={5}
                      placeholder={`Draft your ${communicationModalType} message here...`}
                      value={communicationMessage}
                      onChange={(e) => setCommunicationMessage(e.target.value)}
                      className="w-full p-4 rounded-xl border border-border dark:border-white/10 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] resize-none"
                    />
                  </div>
                )}

                <div className="flex w-full gap-3">
                  <button onClick={() => setCommunicationModalType(null)} className="flex-1 h-11 rounded-xl border border-border dark:border-white/10 bg-card text-[#0F172A] dark:text-foreground font-bold hover:bg-muted transition-colors focus:outline-none">
                    Abort
                  </button>
                  <button
                    onClick={async () => {
                      if (communicationModalType === 'SMS') {
                        try {
                          await sendCustomerSMS({ customerId: id, message: communicationMessage }).unwrap()
                          toast.success("SMS sent successfully via Text.lk")
                          setCommunicationModalType(null)
                          setCommunicationMessage("")
                        } catch (err: any) {
                          toast.error(err.data?.message || "Failed to send SMS")
                        }
                      } else {
                        setCommunicationModalType(null)
                        alert(`${communicationModalType} Dispatch logged dynamically!`)
                      }
                    }}
                    disabled={isSendingSMS}
                    className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none disabled:opacity-50"
                  >
                    {isSendingSMS ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (communicationModalType === 'Phone' ? "Connect Dial" : "Transmit Data")}
                  </button>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Schedule Modal */}
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200 p-4">
            <div className="bg-card w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-6 border-b border-border dark:border-white/10 bg-[#F8FAFC] dark:bg-background">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#EEF2FF] dark:bg-[#4F46E5]/10 text-[#4F46E5]">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-black text-[#0F172A] dark:text-foreground leading-tight">Schedule Appointment</h2>
                    <p className="text-[12px] font-bold text-[#4F46E5]">Planning with {customerName}</p>
                  </div>
                </div>
                <button onClick={() => setIsScheduleModalOpen(false)} className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#0F172A] dark:hover:text-foreground dark:text-foreground transition-colors focus:outline-none">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* 1. Type Selection */}
                <div>
                  <label className="block text-[12px] font-bold text-[#0F172A] dark:text-foreground mb-3 uppercase tracking-wider">Appointment Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setScheduleForm(p => ({ ...p, type: 'Call' }))}
                      className={`flex items-center justify-center gap-3 h-12 rounded-xl border font-bold text-[13px] transition-all ${scheduleForm.type === 'Call' ? 'bg-[#EEF2FF] dark:bg-[#4F46E5]/10 border-[#4F46E5] text-[#4F46E5] shadow-sm' : 'bg-card border-border dark:border-white/10 text-muted-foreground hover:bg-muted'}`}
                    >
                      <PhoneCall className="h-4 w-4" /> Call
                    </button>
                    <button
                      onClick={() => setScheduleForm(p => ({ ...p, type: 'Meeting' }))}
                      className={`flex items-center justify-center gap-3 h-12 rounded-xl border font-bold text-[13px] transition-all ${scheduleForm.type === 'Meeting' ? 'bg-[#EEF2FF] dark:bg-[#4F46E5]/10 border-[#4F46E5] text-[#4F46E5] shadow-sm' : 'bg-card border-border dark:border-white/10 text-muted-foreground hover:bg-muted'}`}
                    >
                      <UserCheck className="h-4 w-4" /> Meeting
                    </button>
                  </div>
                </div>

                {/* 2. Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-[#0F172A] dark:text-foreground mb-2 uppercase tracking-wider">Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={scheduleForm.date}
                        onChange={(e) => setScheduleForm(p => ({ ...p, date: e.target.value }))}
                        className="w-full h-11 px-4 rounded-xl border border-border dark:border-white/10 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#0F172A] dark:text-foreground mb-2 uppercase tracking-wider">Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={scheduleForm.time}
                        onChange={(e) => setScheduleForm(p => ({ ...p, time: e.target.value }))}
                        className="w-full h-11 px-4 rounded-xl border border-border dark:border-white/10 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Notes */}
                <div>
                  <label className="block text-[12px] font-bold text-[#0F172A] dark:text-foreground mb-2 uppercase tracking-wider">Internal Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Agenda, special requests, or preparation notes..."
                    value={scheduleForm.notes}
                    onChange={(e) => setScheduleForm(p => ({ ...p, notes: e.target.value }))}
                    className="w-full p-4 rounded-xl border border-border dark:border-white/10 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSchedule}
                    disabled={isScheduling}
                    className="w-full h-12 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isScheduling ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                    Confirm & Send Notification
                  </button>
                  <p className="text-center text-[10px] text-muted-foreground mt-4 uppercase tracking-tighter font-bold">
                    This will automatically dispatch an SMS via Text.lk
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

