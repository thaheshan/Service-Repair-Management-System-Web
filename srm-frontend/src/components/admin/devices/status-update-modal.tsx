import { X } from "lucide-react"
import { useState } from "react"
import { DeviceStatus } from "@/app/admin/devices/device-data"

interface DeviceStatusUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (autoUpdateCustomer: boolean, newStatus: DeviceStatus, pricing?: { costPrice?: number, soldPrice?: number }) => void
  pendingStatus: DeviceStatus | null
}

export function DeviceStatusUpdateModal({ isOpen, onClose, onConfirm, pendingStatus }: DeviceStatusUpdateModalProps) {
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [costPrice, setCostPrice] = useState<string>("")
  const [soldPrice, setSoldPrice] = useState<string>("")

  if (!isOpen || !pendingStatus) return null

  const showPricing = pendingStatus === "COLLECTED" || pendingStatus === "SOLD"
  const netProfit = (Number(soldPrice) || 0) - (Number(costPrice) || 0)

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-card p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-border">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted/30 border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all focus:outline-none shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center mt-2">
          <div className="h-14 w-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mb-5 border border-[#4F46E5]/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V12" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h2 className="text-[22px] font-black text-foreground mb-3 leading-tight">
            Update Device Status?
          </h2>
          <p className="text-[14px] text-muted-foreground mb-8 font-medium leading-relaxed">
            Changing the status to <span className="text-[#4F46E5] font-bold">"{pendingStatus.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}"</span> will update the system records and inventory.
          </p>

          <label className="flex items-center gap-3 self-start mb-8 cursor-pointer group w-full p-3 rounded-xl border border-dashed border-border hover:border-[#4F46E5]/50 hover:bg-muted/50 transition-all">
            <input 
              type="checkbox" 
              className="hidden" 
              checked={autoUpdate} 
              onChange={(e) => setAutoUpdate(e.target.checked)} 
            />
            <div className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${autoUpdate ? 'bg-[#4F46E5] border-[#4F46E5] shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'border-slate-300 bg-background group-hover:border-[#4F46E5]'}`}>
              {autoUpdate && <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span className="text-[13px] font-bold text-foreground select-none">
              Automatically Notify Customer
            </span>
          </label>

          {showPricing && (
            <div className="w-full bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 text-left space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-500 mb-1">Customer Given Price (Cost)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[13px]">Rs.</span>
                  <input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} className="w-full pl-9 h-10 rounded-lg border border-slate-200 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-500 mb-1">Sold / Released Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[13px]">Rs.</span>
                  <input type="number" value={soldPrice} onChange={(e) => setSoldPrice(e.target.value)} className="w-full pl-9 h-10 rounded-lg border border-slate-200 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]" placeholder="0" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 border-dashed">
                <span className="text-[13px] font-bold text-slate-600">Net Profit Calculated:</span>
                <span className={`text-[15px] font-black ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {netProfit >= 0 ? '+' : '-'} Rs. {Math.abs(netProfit).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex w-full gap-4 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border border-border bg-card text-foreground font-bold hover:bg-muted transition-all focus:outline-none shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm(autoUpdate, pendingStatus, showPricing ? { 
                  costPrice: costPrice ? Number(costPrice) : undefined, 
                  soldPrice: soldPrice ? Number(soldPrice) : undefined 
                } : undefined)
                setAutoUpdate(true) // Reset to default (notify) for next time
                setCostPrice("")
                setSoldPrice("")
              }}
              className="flex-1 h-12 rounded-xl bg-[#4F46E5] text-white font-bold hover:bg-[#4338CA] shadow-[0_4px_12px_rgba(79,70,229,0.25)] transition-all focus:outline-none"
            >
              Update Status
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
