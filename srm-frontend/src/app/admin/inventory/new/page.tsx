"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  X,
  Plus,
  Info,
  DollarSign,
  Package,
  Truck,
  FileText,
  Upload,
  Calendar,
  Maximize2,
  ChevronRight,
  RefreshCw,
} from "lucide-react"

export default function AddNewItemPage() {
  const router = useRouter()
  const [markup, setMarkup] = useState(0)

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Header / Breadcrumbs */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-[1000px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
              <Link href="/admin/inventory" className="hover:text-primary transition-colors">Inventory</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#0F172A]">All Items</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#0F172A]">Add Item</span>
            </div>
            <h1 className="text-[20px] font-black text-[#0F172A] tracking-tight">Add New Item</h1>
          </div>
          <button 
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-muted-foreground hover:bg-[#E2E8F0] transition-colors focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-10 space-y-8">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-6 border-b border-border bg-[#F8FAFC] flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] shadow-sm">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-black text-[#0F172A]">Basic Information</h2>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">Short Item Details</p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Item Name <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. iPhone 12 LCD Screen" className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50 shadow-inner bg-[#F8FAFC]" />
              <p className="text-[11px] text-muted-foreground mt-1.5 font-medium italic">Enter the primary designation for this item.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Item Code / SKU <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="text" placeholder="Auto-generated or custom" className="w-full h-11 rounded-xl border border-border px-4 pr-10 text-[13px] font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC]" />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"><RefreshCw className="h-4 w-4" /></button>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Category <span className="text-red-500">*</span></label>
                <select className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC] appearance-none">
                  <option>Select category</option>
                  <option>Screens</option>
                  <option>Batteries</option>
                  <option>Charging Ports</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Sub-category</label>
                <select className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC] appearance-none">
                  <option>Select sub-category (optional)</option>
                  <option>OLED</option>
                  <option>LCD</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Brand / Manufacturer</label>
                <input type="text" placeholder="Type or select brand" className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC]" />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Compatible Models</label>
              <div className="relative">
                <input type="text" placeholder="Select compatible devices" className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC]" />
                <Maximize2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing Information */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
          <div className="p-6 border-b border-border bg-[#F8FAFC] flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#10B981] shadow-sm">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-black text-[#0F172A]">Pricing Information</h2>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">Cost and Sales Data</p>
            </div>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Purchase Price (Cost) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-[14px]">Rs.</span>
                  <input type="text" placeholder="0.00" className="w-full h-11 rounded-xl border border-border pl-12 pr-4 text-[14px] font-black focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC] shadow-inner" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Selling Price <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-[14px]">Rs.</span>
                  <input type="text" placeholder="0.00" className="w-full h-11 rounded-xl border border-border pl-12 pr-4 text-[14px] font-black focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC] shadow-inner" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Markup %</label>
                <div className="relative">
                  <input type="number" value={markup} onChange={(e) => setMarkup(Number(e.target.value))} className="w-full h-11 rounded-xl border border-border px-4 pr-8 text-[14px] font-black focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F1F5F9]/50 cursor-not-allowed" disabled />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-[14px]">%</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 font-bold uppercase tracking-tighter">Auto-calculated markup</p>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="h-[18px] w-[18px] rounded border-border accent-primary" />
              <span className="text-[13px] font-bold text-[#0F172A] group-hover:text-primary transition-colors">Tax / VAT Applicable</span>
            </label>
          </div>
        </div>

        {/* Section 3: Stock Information */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
          <div className="p-6 border-b border-border bg-[#F8FAFC] flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6] shadow-sm">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-black text-[#0F172A]">Stock Information</h2>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">Tracking and Allocation</p>
            </div>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Current Stock Qty <span className="text-red-500">*</span></label>
                <input type="number" defaultValue="0" className="w-full h-11 rounded-xl border border-border px-4 text-[14px] font-black focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC] shadow-inner" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Unit of Measurement <span className="text-red-500">*</span></label>
                <select className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC] appearance-none">
                  <option>Piece(s)</option>
                  <option>Pack(s)</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Reorder Level <span className="text-red-500">*</span></label>
                <input type="number" defaultValue="0" className="w-full h-11 rounded-xl border border-border px-4 text-[14px] font-black focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Reorder Quantity</label>
                <input type="number" defaultValue="0" className="w-full h-11 rounded-xl border border-border px-4 text-[14px] font-black focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Minimum Order Qty</label>
                <input type="number" defaultValue="0" className="w-full h-11 rounded-xl border border-border px-4 text-[14px] font-black focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Storage Location</label>
                <div className="relative">
                  <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" placeholder="e.g., Shelf A1, Drawer B2" className="w-full h-11 rounded-xl border border-border pl-10 pr-4 text-[13px] font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Supplier Information */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200">
          <div className="p-6 border-b border-border bg-[#F8FAFC] flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-[#7C3AED] shadow-sm">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-black text-[#0F172A]">Supplier Information</h2>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">Procurement Data</p>
            </div>
          </div>
          <div className="p-8 space-y-8">
            <div>
              <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Primary Supplier <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Search or add new supplier" className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC] shadow-inner" />
              <button className="flex items-center gap-2 mt-3 text-[12px] font-black text-primary hover:text-primary/80 transition-all uppercase tracking-tight">
                <Plus className="h-3.5 w-3.5 stroke-[3px]" /> Add New Supplier
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Supplier Part Number</label>
                <input type="text" placeholder="Optional" className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Lead Time (Days)</label>
                <div className="relative">
                  <input type="number" defaultValue="0" className="w-full h-11 rounded-xl border border-border px-4 pr-12 text-[14px] font-black focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC]" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-[11px] uppercase">days</span>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Last Purchase Date</label>
                <div className="relative">
                  <input type="date" className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC]" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Last Purchase Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-[13px]">Rs.</span>
                  <input type="text" placeholder="0.00" className="w-full h-11 rounded-xl border border-border pl-12 pr-4 text-[13px] font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC] opacity-70" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Additional Details */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 delay-250">
          <div className="p-6 border-b border-border bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-[#64748B] shadow-sm">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-[15px] font-black text-[#0F172A]">Additional Details</h2>
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">Optional Information</p>
              </div>
            </div>
            <button className="text-muted-foreground hover:text-[#0F172A] transition-colors"><ChevronRight className="h-5 w-5 rotate-90" /></button>
          </div>
          <div className="p-8 space-y-8">
            <div>
              <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Item Photo</label>
              <div className="w-full border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#F8FAFC] hover:border-primary/50 transition-all text-center">
                <div className="h-12 w-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-1">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <span className="text-[13px] font-black text-[#0F172A]">Click to upload or drag and drop</span>
                <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-tighter">PNG, JPG up to 5MB</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Warranty Period</label>
                <input type="text" placeholder="e.g., 3 months, 1 year" className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Expiry Date</label>
                <div className="relative">
                  <input type="text" placeholder="For items like batteries, adhesives" className="w-full h-11 rounded-xl border border-border px-4 pr-10 text-[13px] font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC]" />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Barcode / QR Code</label>
              <div className="relative flex items-center">
                <input type="text" placeholder="Scan or enter manually" className="flex-1 h-11 rounded-xl border border-border px-4 text-[13px] font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC]" />
                <button className="ml-3 h-11 w-11 rounded-xl border border-border bg-white flex items-center justify-center text-muted-foreground hover:text-[#0F172A] transition-all hover:shadow-md"><Plus className="h-5 w-5" /></button>
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Notes / Description</label>
              <textarea rows={4} placeholder="Additional notes about this item..." className="w-full p-4 rounded-xl border border-border text-[13px] font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-[#F8FAFC] resize-none shadow-inner"></textarea>
              <div className="flex justify-end mt-1.5"><span className="text-[10px] text-muted-foreground font-black tracking-widest">0 / 500</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-border z-30">
        <div className="max-w-[1000px] mx-auto px-6 h-[88px] flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-border text-[14px] font-black text-[#64748B] hover:bg-[#F1F5F9] transition-all tracking-tight"
          >
            Cancel
          </button>
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-xl border border-border bg-white text-[14px] font-black text-[#0F172A] hover:bg-[#F1F5F9] transition-all shadow-sm tracking-tight flex items-center gap-2">
              <Plus className="h-4 w-4" /> Save as Draft
            </button>
            <button 
              onClick={() => router.push('/admin/inventory')}
              className="px-8 py-3 rounded-xl bg-primary text-white text-[14px] font-black hover:bg-primary/90 transition-all shadow-md tracking-tight flex items-center gap-2"
            >
              <Package className="h-4 w-4" /> Save Item
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
