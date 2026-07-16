"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  // Determine the display label ensuring exact match from options
  const displayLabel = React.useMemo(() => {
    if (!value) return placeholder
    const opt = options.find((o) => o.value === value)
    return opt ? opt.label : value
  }, [value, options, placeholder])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-bold text-[13px] bg-background text-foreground", className)}
          disabled={disabled}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {/* Set the popover width to match the trigger button using CSS variable injected by Radix */}
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 shadow-lg border-border" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="text-[13px] font-medium h-10" />
          <CommandList className="max-h-[250px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm">{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label} // Value used for internal fuzzy searching
                  onSelect={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className="text-[13px] font-bold cursor-pointer flex items-center py-2"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-[#4F46E5]",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
