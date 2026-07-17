import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const SuccessIcon = ({ className }: { className?: string }) => {
  return (
    <div className={cn("mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#10B981]/10 border border-[#10B981]/20 shadow-sm", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981] shadow-sm animate-in zoom-in-50 duration-300">
        <Check className="h-5 w-5 text-white" strokeWidth={3} />
      </div>
    </div>
  );
};
