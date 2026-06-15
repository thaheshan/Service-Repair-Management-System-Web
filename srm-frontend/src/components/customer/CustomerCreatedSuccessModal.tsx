import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { SuccessIcon } from "@/components/ui/success-icon";
import { Mail } from "lucide-react";

export interface CustomerData {
  id: string;
  name: string;
  email: string;
}

interface CustomerCreatedSuccessModalProps {
  isOpen: boolean;
  customer: CustomerData | null;
  onClose: () => void;
  onViewDetails: (id: string) => void;
}

export const CustomerCreatedSuccessModal = ({
  isOpen,
  customer,
  onClose,
  onViewDetails,
}: CustomerCreatedSuccessModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card text-foreground border-border gap-6 p-6 shadow-2xl rounded-2xl" showCloseButton={false}>
        <DialogHeader className="flex flex-col items-center sm:items-center text-center space-y-3">
          <SuccessIcon className="mb-2" />
          <DialogTitle className="text-[22px] font-bold tracking-tight text-foreground">
            Customer Added
          </DialogTitle>
          <DialogDescription className="text-[14px] text-muted-foreground font-medium max-w-[280px]">
            The new customer profile has been successfully created and saved to your database.
          </DialogDescription>
        </DialogHeader>

        {customer && (
          <div className="w-full flex items-center gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4F46E5]/10 text-[#4F46E5] font-bold text-[16px]">
              {(customer.name || "?").charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-[15px] font-bold text-foreground">
                {customer.name || "Unknown Customer"}
              </span>
              <span className="flex items-center gap-1.5 truncate text-[13px] text-muted-foreground mt-0.5">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {customer.email || "No email address"}
              </span>
            </div>
          </div>
        )}

        <DialogFooter className="flex w-full flex-col-reverse sm:flex-row gap-3 sm:space-x-0 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-lg border border-border bg-card text-foreground text-[14px] font-semibold hover:bg-muted transition-all focus:outline-none focus:ring-2 focus:ring-border"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={() => customer && onViewDetails(customer.id)}
            className="flex-1 h-10 rounded-lg bg-[#4F46E5] text-white text-[14px] font-semibold hover:bg-[#4338CA] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:ring-offset-2 focus:ring-offset-background"
          >
            View Profile
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
