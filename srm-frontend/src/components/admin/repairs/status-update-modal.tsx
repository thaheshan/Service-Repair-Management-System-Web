import { X } from "lucide-react"
import { useState } from "react"
import { RepairStatus } from "./repairs-table"

interface StatusUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (autoUpdateCustomer: boolean, newStatus: RepairStatus) => void
  pendingStatus: RepairStatus | null
}

export function StatusUpdateModal({ isOpen, onClose, onConfirm, pendingStatus }: StatusUpdateModalProps) {
  const [autoUpdate, setAutoUpdate] = useState(true)

  if (!isOpen || !pendingStatus) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-card p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground/20 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center mt-2">
          <h2 className="text-xl font-bold text-foreground mb-3">
            Are You Sure to Update this <br/> Repair Task?
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            "Updating this task will automatically notify the customer via SMS" (When updating the task status)
          </p>

          <label className="flex items-center gap-3 self-start mb-8 cursor-pointer group">
            <input 
              type="checkbox" 
              className="hidden" 
              checked={autoUpdate} 
              onChange={(e) => setAutoUpdate(e.target.checked)} 
            />
            <div className={`flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors ${autoUpdate ? 'bg-[#4F46E5] border-[#4F46E5]' : 'border-muted-foreground/30 bg-card group-hover:border-[#4F46E5]'}`}>
              {autoUpdate && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span className="text-sm text-muted-foreground select-none">
              Automatically Update to Customer
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex w-full gap-4">
            <button 
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-[#4F46E5] text-[#4F46E5] font-semibold hover:bg-primary/10 transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm(autoUpdate, pendingStatus)
                setAutoUpdate(true) // Reset for next time
              }}
              className="flex-1 h-11 rounded-xl bg-[#4F46E5] text-white font-semibold hover:bg-[#4338CA] shadow-md transition-colors focus:outline-none"
            >
              Update
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
