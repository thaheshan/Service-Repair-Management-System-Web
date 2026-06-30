import { X, Trash2 } from "lucide-react"

interface DeleteTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  taskRef: string
}

export function DeleteTaskModal({ isOpen, onClose, onConfirm, taskRef }: DeleteTaskModalProps) {
  if (!isOpen) return null

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
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
             <Trash2 className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-3">
            Delete Repair Task?
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Are you sure you want to permanently delete task <span className="font-bold text-foreground">{taskRef}</span>? <br/>This action cannot be undone.
          </p>

          {/* Action Buttons */}
          <div className="flex w-full gap-4">
            <button 
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-muted-foreground/30 text-foreground font-semibold hover:bg-muted transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 h-11 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-md shadow-red-500/20 transition-colors focus:outline-none"
            >
              Delete Task
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
