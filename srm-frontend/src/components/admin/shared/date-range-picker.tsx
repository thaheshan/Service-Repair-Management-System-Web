"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { CalendarDays, ChevronDown, X, Check } from "lucide-react"
import { format, subDays, startOfDay, endOfDay } from "date-fns"

export interface DateRange {
  from: Date
  to: Date
  days: number
  label: string
}

interface DateRangePickerProps {
  onChange: (range: DateRange) => void
  defaultDays?: number
  className?: string
}

export const PRESETS = [
  { label: "Last 7 Days",  days: 7 },
  { label: "Last 28 Days", days: 28 },
  { label: "Last 30 Days", days: 30 },
  { label: "Last 90 Days", days: 90 },
  { label: "All Time",     days: 9999 },
]

export function makeRange(days: number): DateRange {
  const to   = endOfDay(new Date())
  const from = days >= 9999 ? new Date("2000-01-01") : startOfDay(subDays(new Date(), days - 1))
  const preset = PRESETS.find(p => p.days === days)
  return { from, to, days, label: preset?.label ?? `Last ${days} Days` }
}

export function DateRangePicker({ onChange, defaultDays = 30, className = "" }: DateRangePickerProps) {
  const [active, setActive] = useState<DateRange>(makeRange(defaultDays))
  const [open, setOpen]     = useState(false)
  const [customFrom, setCustomFrom] = useState<Date | undefined>()
  const [customTo,   setCustomTo]   = useState<Date | undefined>()
  const [step, setStep]     = useState<"from" | "to">("from")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setCustomFrom(undefined)
        setCustomTo(undefined)
        setStep("from")
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function selectPreset(days: number) {
    const range = makeRange(days)
    setActive(range)
    onChange(range)
    setOpen(false)
    setCustomFrom(undefined)
    setCustomTo(undefined)
    setStep("from")
  }

  function handleDayClick(day: Date) {
    if (step === "from") {
      setCustomFrom(day)
      setCustomTo(undefined)
      setStep("to")
    } else {
      if (day < customFrom!) {
        setCustomFrom(day)
        setStep("to")
        return
      }
      const from = startOfDay(customFrom!)
      const to   = endOfDay(day)
      const diffDays = Math.ceil((to.getTime() - from.getTime()) / 86400000)
      const range: DateRange = {
        from,
        to,
        days: diffDays,
        label: `${format(from, "MMM d")} – ${format(to, "MMM d, yyyy")}`,
      }
      setActive(range)
      onChange(range)
      setOpen(false)
      setCustomFrom(undefined)
      setCustomTo(undefined)
      setStep("from")
    }
  }

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      {/* ── Trigger Pill ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`
          flex items-center gap-2.5 h-10 px-4 rounded-xl border transition-all
          bg-white shadow-sm hover:shadow-md
          ${open
            ? "border-[#4F46E5] ring-2 ring-[#4F46E5]/10"
            : "border-border hover:border-[#4F46E5]/50"
          }
        `}
      >
        <CalendarDays className="h-4 w-4 text-[#4F46E5] shrink-0" />
        <span className="text-[13px] font-semibold text-[#0F172A] whitespace-nowrap leading-none">
          {active.label}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* ── Dropdown Panel ── */}
      {open && (
        <div
          className="
            absolute right-0 top-[calc(100%+8px)] z-[300]
            bg-white rounded-2xl border border-border shadow-2xl
            overflow-hidden w-[340px]
            animate-in fade-in-0 zoom-in-95 duration-150
          "
        >
          <div className="flex flex-col">

            {/* Top: Calendar */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[12px] font-black text-[#0F172A] uppercase tracking-widest leading-none">
                    {step === "from" ? "Select Start Date" : "Select End Date"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {step === "from"
                      ? "Click to set the beginning of your range"
                      : "Click to set the end of your range"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setOpen(false)
                    setCustomFrom(undefined)
                    setCustomTo(undefined)
                    setStep("from")
                  }}
                  className="h-7 w-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <Calendar
                mode="range"
                numberOfMonths={1}
                selected={
                  customFrom
                    ? { from: customFrom, to: customTo }
                    : { from: active.from, to: active.to }
                }
                onDayClick={handleDayClick}
                disabled={{ after: new Date() }}
                className="p-0"
              />
            </div>
            
            {/* Bottom: Presets */}
            <div className="border-t border-border bg-[#F8FAFC] p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between px-1 mb-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Quick Select
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map(p => {
                  const isActive = active.days === p.days && active.label === p.label
                  return (
                    <button
                      key={p.days}
                      onClick={() => selectPreset(p.days)}
                      className={`
                        px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all border
                        ${isActive
                          ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm"
                          : "bg-white text-[#0F172A] border-border hover:border-[#4F46E5]/50"
                        }
                      `}
                    >
                      {p.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer: active range summary */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#4F46E5] shrink-0" />
              <span className="text-[12px] font-bold text-[#0F172A]">{active.label}</span>
              <span className="text-[11px] text-muted-foreground">
                · {format(active.from, "MMM d, yyyy")} – {format(active.to, "MMM d, yyyy")}
              </span>
            </div>
            <button
              onClick={() => { setOpen(false); setCustomFrom(undefined); setCustomTo(undefined); setStep("from") }}
              className="text-[12px] font-semibold text-muted-foreground hover:text-[#0F172A] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
