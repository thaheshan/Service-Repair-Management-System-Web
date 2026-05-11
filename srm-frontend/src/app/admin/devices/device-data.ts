export type DeviceStatus = "ACTIVE" | "AVAILABLE" | "ON_SALE" | "SOLD" | "IN_SERVICE" | "COLLECTED"
export type WarrantyStatus = "Active" | "Expiring Soon" | "Expired" | "No Warranty"
export type DeviceType = "Mobile Phone" | "Tablet" | "Laptop" | "Console"

export interface Device {
  id: string
  name: string
  brand: string
  type: DeviceType
  imei: string
  owner: { name: string; phone: string }
  warranty: { status: WarrantyStatus; expiryDate: string }
  totalRepairs: number
  lastService: { date: string; type: string }
  registered: string
  status: DeviceStatus
  color: string
  price: number
}

export const DEVICE_ICON_COLOR: Record<DeviceType, string> = {
  "Mobile Phone": "bg-indigo-100 text-indigo-600",
  "Tablet":       "bg-sky-100 text-sky-600",
  "Laptop":       "bg-violet-100 text-violet-600",
  "Console":      "bg-orange-100 text-orange-600",
}

export const WARRANTY_STYLE: Record<WarrantyStatus, string> = {
  "Active":        "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Expiring Soon": "bg-amber-50 text-amber-700 border-amber-200",
  "Expired":       "bg-red-50 text-red-600 border-red-200",
  "No Warranty":   "bg-gray-100 text-gray-500 border-gray-200",
}

export const STATUS_STYLE: Record<DeviceStatus, string> = {
  "ACTIVE":     "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AVAILABLE":  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "ON_SALE":    "bg-amber-50 text-amber-700 border-amber-200",
  "SOLD":       "bg-indigo-50 text-indigo-700 border-indigo-200",
  "IN_SERVICE": "bg-orange-50 text-orange-700 border-orange-200",
  "COLLECTED":  "bg-sky-50 text-sky-700 border-sky-200",
}

export const INITIAL_DEVICES: Device[] = [
  { id:"1",  name:"iPhone 14 Pro Max",         brand:"Apple",   type:"Mobile Phone", imei:"356789012345678", owner:{name:"Sarah Johnson",    phone:"+94 77 123 4567"}, warranty:{status:"Active",        expiryDate:"Dec 2025"}, totalRepairs:3, lastService:{date:"Jan 15, 2024", type:"Screen Replacement"},    registered:"Mar 2023", status:"Available", color:"bg-[#4F46E5]", price: 185000 },
  { id:"2",  name:"Galaxy S23 Ultra",           brand:"Samsung", type:"Mobile Phone", imei:"358912345678901", owner:{name:"Michael Chen",     phone:"+94 71 234 5678"}, warranty:{status:"Expiring Soon", expiryDate:"Feb 2024"}, totalRepairs:1, lastService:{date:"Dec 08, 2023", type:"Battery Replacement"}, registered:"Feb 2023", status:"In Review", color:"bg-[#0891B2]", price: 165000 },
  { id:"3",  name:`iPad Pro 12.9"`,             brand:"Apple",   type:"Tablet",       imei:"357123456789012", owner:{name:"Emma Williams",    phone:"+94 76 345 6789"}, warranty:{status:"Expired",       expiryDate:"Aug 2023"}, totalRepairs:5, lastService:{date:"Jan 22, 2024", type:"Charging Port"},         registered:"Aug 2022", status:"Available", color:"bg-[#7C3AED]", price: 210000 },
  { id:"4",  name:"Redmi Note 12 Pro",          brand:"Xiaomi",  type:"Mobile Phone", imei:"359876543210987", owner:{name:"Ahmed Khan",       phone:"+94 75 456 7890"}, warranty:{status:"No Warranty",   expiryDate:""},        totalRepairs:0, lastService:{date:"",             type:""},                      registered:"Jan 2024", status:"Sold",      color:"bg-[#DB2777]", price: 65000 },
  { id:"5",  name:`MacBook Pro 16"`,            brand:"Apple",   type:"Laptop",       imei:"C02YD2MGJG5H",   owner:{name:"David Martinez",   phone:"+94 72 567 8901"}, warranty:{status:"Active",        expiryDate:"Nov 2025"}, totalRepairs:2, lastService:{date:"Nov 12, 2023", type:"Keyboard Replacement"},  registered:"Nov 2022", status:"Collected", color:"bg-[#059669]", price: 450000 },
  { id:"6",  name:"Find X5 Pro",                brand:"Oppo",    type:"Mobile Phone", imei:"354321098765432", owner:{name:"Fatima Ali",       phone:"+94 70 678 9012"}, warranty:{status:"Active",        expiryDate:"Sep 2025"}, totalRepairs:7, lastService:{date:"Jan 05, 2024", type:"Camera Repair"},         registered:"Sep 2022", status:"Available", color:"bg-[#D97706]", price: 125000 },
  { id:"7",  name:"Surface Pro 9",              brand:"Microsoft",type:"Tablet",      imei:"SURF00987654321", owner:{name:"James Wilson",     phone:"+94 77 789 0123"}, warranty:{status:"Active",        expiryDate:"Jun 2026"}, totalRepairs:1, lastService:{date:"Feb 01, 2024", type:"Screen Calibration"},    registered:"Jun 2023", status:"Available", color:"bg-[#4338CA]", price: 185000 },
  { id:"8",  name:"Galaxy Tab S8",              brand:"Samsung", type:"Tablet",       imei:"358000111222333", owner:{name:"Priya Nair",       phone:"+94 71 890 1234"}, warranty:{status:"Expiring Soon", expiryDate:"Mar 2024"}, totalRepairs:2, lastService:{date:"Dec 15, 2023", type:"Speaker Repair"},        registered:"Mar 2022", status:"In Review", color:"bg-[#6D28D9]", price: 95000 },
  { id:"9",  name:"ThinkPad X1 Carbon",         brand:"Lenovo",  type:"Laptop",       imei:"LNV00123456789",  owner:{name:"Robert Brown",     phone:"+94 76 901 2345"}, warranty:{status:"Expired",       expiryDate:"Oct 2023"}, totalRepairs:4, lastService:{date:"Nov 28, 2023", type:"Hinge Repair"},          registered:"Oct 2020", status:"Sold",      color:"bg-[#0891B2]", price: 145000 },
  { id:"10", name:"Pixel 8 Pro",                brand:"Google",  type:"Mobile Phone", imei:"353111222333444", owner:{name:"Anita Sharma",     phone:"+94 75 012 3456"}, warranty:{status:"Active",        expiryDate:"Oct 2026"}, totalRepairs:0, lastService:{date:"",             type:""},                      registered:"Oct 2023", status:"Available", color:"bg-[#4F46E5]", price: 215000 },
  { id:"11", name:"PlayStation 5",              brand:"Sony",    type:"Console",      imei:"PS5-SN-9876543",  owner:{name:"Kevin Zhang",      phone:"+94 72 123 4567"}, warranty:{status:"Active",        expiryDate:"Dec 2024"}, totalRepairs:1, lastService:{date:"Jan 10, 2024", type:"Disc Drive Repair"},     registered:"Dec 2021", status:"Available", color:"bg-[#DC2626]", price: 155000 },
  { id:"12", name:"Xbox Series X",              brand:"Microsoft",type:"Console",     imei:"XBX-SN-1234567",  owner:{name:"Sophie Davis",     phone:"+94 70 234 5678"}, warranty:{status:"Expired",       expiryDate:"Nov 2023"}, totalRepairs:2, lastService:{date:"Jan 18, 2024", type:"HDMI Port Repair"},      registered:"Nov 2020", status:"In Review", color:"bg-[#059669]", price: 145000 },
  { id:"13", name:"iPhone 15",                  brand:"Apple",   type:"Mobile Phone", imei:"356000999888777", owner:{name:"Dilini Abeyguna",  phone:"+94 77 345 6789"}, warranty:{status:"Active",        expiryDate:"Sep 2026"}, totalRepairs:0, lastService:{date:"",             type:""},                      registered:"Sep 2023", status:"Available", color:"bg-[#7C3AED]", price: 235000 },
  { id:"14", name:`Dell XPS 15`,                brand:"Dell",    type:"Laptop",       imei:"DXP0012345678",   owner:{name:"Omar Farouq",      phone:"+94 75 456 7890"}, warranty:{status:"Active",        expiryDate:"Mar 2026"}, totalRepairs:1, lastService:{date:"Feb 05, 2024", type:"Fan Replacement"},       registered:"Mar 2023", status:"Available", color:"bg-[#D97706]", price: 325000 },
  { id:"15", name:"Nintendo Switch OLED",       brand:"Nintendo",type:"Console",      imei:"NSW-OLED-556677", owner:{name:"Raj Jayawardena",  phone:"+94 71 567 8901"}, warranty:{status:"No Warranty",   expiryDate:""},        totalRepairs:3, lastService:{date:"Dec 20, 2023", type:"Joy-Con Drift Fix"},     registered:"Dec 2021", status:"Available", color:"bg-[#BE185D]", price: 85000 },
  { id:"16", name:"Samsung Galaxy A54",         brand:"Samsung", type:"Mobile Phone", imei:"357765432109876", owner:{name:"Malsha Fernando",  phone:"+94 76 678 9012"}, warranty:{status:"Active",        expiryDate:"May 2026"}, totalRepairs:1, lastService:{date:"Jan 28, 2024", type:"Camera Module"},         registered:"May 2023", status:"Available", color:"bg-[#0891B2]", price: 95000 },
  { id:"17", name:"HP Spectre x360",            brand:"HP",      type:"Laptop",       imei:"HP0087654321",    owner:{name:"Chris Perera",     phone:"+94 73 789 0123"}, warranty:{status:"Expiring Soon", expiryDate:"Apr 2024"}, totalRepairs:2, lastService:{date:"Jan 30, 2024", type:"WiFi Card Repair"},      registered:"Apr 2022", status:"Available", color:"bg-[#4338CA]", price: 275000 },
  { id:"18", name:"OnePlus 11",                 brand:"OnePlus", type:"Mobile Phone", imei:"352998877665544", owner:{name:"Brandon Silva",    phone:"+94 77 890 1234"}, warranty:{status:"No Warranty",   expiryDate:""},        totalRepairs:0, lastService:{date:"",             type:""},                      registered:"Jan 2024", status:"Sold",      color:"bg-[#DC2626]", price: 115000 },
  { id:"19", name:"Vivo V27 Pro",               brand:"Vivo",    type:"Mobile Phone", imei:"359543219876540", owner:{name:"Lahiru Tissera",   phone:"+94 71 901 2345"}, warranty:{status:"Active",        expiryDate:"Aug 2025"}, totalRepairs:1, lastService:{date:"Feb 10, 2024", type:"Front Camera"},          registered:"Aug 2023", status:"In Review", color:"bg-[#6D28D9]", price: 85000 },
  { id:"20", name:"Galaxy Z Fold 4",            brand:"Samsung", type:"Mobile Phone", imei:"352112233445566", owner:{name:"Preethi Kumari",   phone:"+94 76 012 3456"}, warranty:{status:"Active",        expiryDate:"Jul 2025"}, totalRepairs:2, lastService:{date:"Feb 12, 2024", type:"Inner Screen Repair"},   registered:"Jul 2022", status:"Available", color:"bg-[#059669]", price: 385000 },
]

export const BRANDS = ["Apple","Samsung","Xiaomi","Google","Sony","Microsoft","Lenovo","Dell","HP","Oppo","OnePlus","Vivo","Nintendo"]
