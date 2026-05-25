"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface AutocompleteProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Search or type...",
  emptyText = "No matches. Custom value will be used.",
  className,
  disabled = false,
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Sync internal input state with external value changes
  React.useEffect(() => {
    setInputValue(value)
  }, [value])

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            onChange(e.target.value) // Propagate custom value instantly
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/5 transition-all bg-background text-foreground",
            className
          )}
        />
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0 shadow-lg border-border" 
        align="start" 
        onOpenAutoFocus={(e) => e.preventDefault()} // Prevent focus from leaving the input
      >
        <Command shouldFilter={false}>
          <CommandList className="max-h-[250px] overflow-y-auto">
            {filteredOptions.length === 0 && inputValue.length > 0 && (
              <CommandEmpty className="py-4 text-center text-[12px] text-muted-foreground">{emptyText}</CommandEmpty>
            )}
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    setInputValue(option.value)
                    onChange(option.value)
                    setOpen(false)
                    inputRef.current?.blur()
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
