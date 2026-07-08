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


export const BRANDS = [
  // Apple
  "Apple",
  // Samsung
  "Samsung",
  // Google
  "Google",
  // Chinese brands
  "Xiaomi", "Redmi", "POCO", "Realme", "Oppo", "OnePlus", "Vivo", "iQOO",
  "Huawei", "Honor", "ZTE", "Nubia", "Red Magic", "Meizu",
  // Taiwanese
  "Asus", "HTC",
  // Japanese/Korean
  "Sony", "LG", "Sharp", "Fujitsu",
  // European
  "Nokia",
  // American
  "Motorola", "Blackberry", "HP", "Dell", "Lenovo",
  // African/Emerging
  "Infinix", "Tecno", "Itel", "Oukitel",
  // New entrants
  "Nothing", "Fairphone",
  // Laptop brands
  "Acer", "Microsoft", "Razer", "MSI", "Toshiba", "Panasonic",
  // Consoles
  "Nintendo",
  // Other peripherals
  "Bose", "JBL", "GoPro", "DJI",
  "Other"
];

export const DEVICE_MODELS_BY_BRAND: Record<string, string[]> = {
  Apple: [
    // iPhone 16 series (2024-2026)
    "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16",
    "iPhone 16e",
    // iPhone 15 series
    "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
    // iPhone 14 series
    "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
    // iPhone 13 series
    "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 mini",
    // iPhone 12 series
    "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 12 mini",
    // iPhone 11 series
    "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11",
    // iPhone X series
    "iPhone XS Max", "iPhone XS", "iPhone XR", "iPhone X",
    // iPhone 8, 7, 6 series
    "iPhone 8 Plus", "iPhone 8", "iPhone 7 Plus", "iPhone 7",
    "iPhone 6s Plus", "iPhone 6s", "iPhone 6 Plus", "iPhone 6",
    // iPhone SE
    "iPhone SE (3rd Gen)", "iPhone SE (2nd Gen)", "iPhone SE (1st Gen)",
    // iPad
    "iPad Pro 13-inch (M4)", "iPad Pro 11-inch (M4)",
    "iPad Pro 12.9-inch (M2)", "iPad Pro 11-inch (M2)",
    "iPad Air 13-inch (M2)", "iPad Air 11-inch (M2)",
    "iPad Air (5th Gen)", "iPad (10th Gen)", "iPad (9th Gen)", "iPad (8th Gen)",
    "iPad mini (7th Gen)", "iPad mini (6th Gen)",
    // Mac
    "MacBook Pro 16-inch (M4 Pro/Max)", "MacBook Pro 14-inch (M4 Pro/Max)",
    "MacBook Pro 16-inch (M3)", "MacBook Pro 14-inch (M3)",
    "MacBook Air 15-inch (M3)", "MacBook Air 13-inch (M3)",
    "MacBook Air 15-inch (M2)", "MacBook Air 13-inch (M2)",
    "iMac 24-inch (M4)", "iMac 24-inch (M3)",
    "Mac mini (M4)", "Mac mini (M2)", "Mac Studio (M4 Max)", "Mac Pro (M2 Ultra)",
    // Apple Watch
    "Apple Watch Ultra 2", "Apple Watch Ultra",
    "Apple Watch Series 10", "Apple Watch Series 9", "Apple Watch Series 8",
    "Apple Watch SE (2nd Gen)",
    // AirPods
    "AirPods 4 (ANC)", "AirPods 4", "AirPods Pro (2nd Gen)", "AirPods (3rd Gen)", "AirPods Max",
    // Vision Pro
    "Apple Vision Pro",
    "Other"
  ],
  Samsung: [
    // Galaxy S25 series (2025)
    "Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25", "Galaxy S25 Edge",
    // Galaxy S24 series
    "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy S24 FE",
    // Galaxy S23 series
    "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23", "Galaxy S23 FE",
    // Galaxy S22 series
    "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22",
    // Galaxy S21 series
    "Galaxy S21 Ultra", "Galaxy S21+", "Galaxy S21", "Galaxy S21 FE",
    // Galaxy S20 series
    "Galaxy S20 Ultra", "Galaxy S20+", "Galaxy S20", "Galaxy S20 FE",
    // Galaxy S10 series
    "Galaxy S10+", "Galaxy S10", "Galaxy S10e",
    // Foldables
    "Galaxy Z Fold 7", "Galaxy Z Flip 7",
    "Galaxy Z Fold 6", "Galaxy Z Flip 6",
    "Galaxy Z Fold 5", "Galaxy Z Flip 5",
    "Galaxy Z Fold 4", "Galaxy Z Flip 4",
    "Galaxy Z Fold 3", "Galaxy Z Flip 3",
    // Note series
    "Galaxy Note 20 Ultra", "Galaxy Note 20", "Galaxy Note 10+", "Galaxy Note 10",
    // A series
    "Galaxy A56", "Galaxy A36", "Galaxy A16",
    "Galaxy A55", "Galaxy A35", "Galaxy A15",
    "Galaxy A54", "Galaxy A34", "Galaxy A14",
    "Galaxy A73", "Galaxy A53", "Galaxy A33", "Galaxy A13",
    "Galaxy A52s", "Galaxy A32", "Galaxy A22", "Galaxy A12",
    // M series
    "Galaxy M55", "Galaxy M35", "Galaxy M15",
    // Tab S series
    "Galaxy Tab S10 Ultra", "Galaxy Tab S10+", "Galaxy Tab S10",
    "Galaxy Tab S9 Ultra", "Galaxy Tab S9+", "Galaxy Tab S9",
    "Galaxy Tab S8 Ultra", "Galaxy Tab S8+", "Galaxy Tab S8",
    "Galaxy Tab A9+", "Galaxy Tab A9", "Galaxy Tab A8",
    // Watch
    "Galaxy Watch 7", "Galaxy Watch Ultra",
    "Galaxy Watch 6 Classic", "Galaxy Watch 6",
    "Galaxy Watch 5 Pro", "Galaxy Watch 5",
    "Galaxy Watch 4 Classic", "Galaxy Watch 4",
    // Earbuds
    "Galaxy Buds3 Pro", "Galaxy Buds3", "Galaxy Buds2 Pro", "Galaxy Buds2",
    "Other"
  ],
  Google: [
    "Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9 Pro Fold", "Pixel 9a", "Pixel 9",
    "Pixel 8 Pro", "Pixel 8", "Pixel 8a",
    "Pixel 7 Pro", "Pixel 7", "Pixel 7a",
    "Pixel 6 Pro", "Pixel 6", "Pixel 6a",
    "Pixel 5", "Pixel 5a", "Pixel 4a", "Pixel 4 XL", "Pixel 4",
    "Pixel Fold", "Pixel 9 Pro Fold",
    "Pixel Tablet",
    "Pixel Watch 3 XL", "Pixel Watch 3", "Pixel Watch 2", "Pixel Watch",
    "Pixel Buds Pro 2", "Pixel Buds Pro", "Pixel Buds A-Series",
    "Other"
  ],
  Xiaomi: [
    "Xiaomi 15 Ultra", "Xiaomi 15 Pro", "Xiaomi 15",
    "Xiaomi 14 Ultra", "Xiaomi 14 Pro", "Xiaomi 14",
    "Xiaomi 13 Ultra", "Xiaomi 13 Pro", "Xiaomi 13",
    "Xiaomi 12S Ultra", "Xiaomi 12 Pro", "Xiaomi 12",
    "Xiaomi Mix Fold 4", "Xiaomi Mix Flip",
    "Xiaomi Pad 7 Pro", "Xiaomi Pad 7", "Xiaomi Pad 6 Pro", "Xiaomi Pad 6",
    "Other"
  ],
  Redmi: [
    "Redmi Note 14 Pro+", "Redmi Note 14 Pro", "Redmi Note 14",
    "Redmi Note 13 Pro+", "Redmi Note 13 Pro", "Redmi Note 13",
    "Redmi Note 12 Pro+", "Redmi Note 12 Pro", "Redmi Note 12",
    "Redmi Note 11 Pro+", "Redmi Note 11 Pro", "Redmi Note 11",
    "Redmi 14C", "Redmi 13C", "Redmi 13", "Redmi 12", "Redmi 10",
    "Redmi A4", "Redmi A3", "Redmi A2", "Redmi A1",
    "Redmi K80 Pro", "Redmi K70 Pro", "Redmi K60 Pro",
    "Other"
  ],
  POCO: [
    "POCO F7 Ultra", "POCO F7 Pro", "POCO F7",
    "POCO F6 Pro", "POCO F6", "POCO F5 Pro", "POCO F5",
    "POCO X7 Pro", "POCO X7", "POCO X6 Pro", "POCO X6", "POCO X5 Pro", "POCO X5",
    "POCO M7 Pro", "POCO M6 Pro", "POCO M5s", "POCO M5",
    "POCO C75", "POCO C65", "POCO C55",
    "Other"
  ],
  Realme: [
    "Realme GT 7 Pro", "Realme GT 6T", "Realme GT 6",
    "Realme GT 5 Pro", "Realme GT 5", "Realme GT 3",
    "Realme 14 Pro+", "Realme 14 Pro", "Realme 14x",
    "Realme 13 Pro+", "Realme 13 Pro", "Realme 13x",
    "Realme 12 Pro+", "Realme 12 Pro", "Realme 12x",
    "Realme Narzo 70 Pro", "Realme Narzo 70x", "Realme Narzo 60 Pro",
    "Realme C75", "Realme C65", "Realme C55",
    "Other"
  ],
  Oppo: [
    "Oppo Find N5", "Oppo Find N3", "Oppo Find N3 Flip",
    "Oppo Find X8 Pro", "Oppo Find X8",
    "Oppo Find X7 Ultra", "Oppo Find X7",
    "Oppo Find X6 Pro", "Oppo Find X6",
    "Oppo Find X5 Pro", "Oppo Find X5",
    "Oppo Reno 13 Pro", "Oppo Reno 13",
    "Oppo Reno 12 Pro", "Oppo Reno 12",
    "Oppo Reno 11 Pro", "Oppo Reno 11",
    "Oppo Reno 10 Pro+", "Oppo Reno 10 Pro", "Oppo Reno 10",
    "Oppo A3 Pro", "Oppo A60", "Oppo A58", "Oppo A57",
    "Oppo Pad 3", "Oppo Pad 2",
    "Other"
  ],
  OnePlus: [
    "OnePlus 13", "OnePlus 13R",
    "OnePlus 12", "OnePlus 12R",
    "OnePlus 11", "OnePlus 11R",
    "OnePlus 10 Pro", "OnePlus 10T",
    "OnePlus 9 Pro", "OnePlus 9", "OnePlus 9R",
    "OnePlus 8T", "OnePlus 8 Pro", "OnePlus 8",
    "OnePlus Nord 4", "OnePlus Nord CE4", "OnePlus Nord CE4 Lite",
    "OnePlus Nord 3", "OnePlus Nord CE3",
    "OnePlus Open",
    "OnePlus Pad 2", "OnePlus Pad",
    "Other"
  ],
  Vivo: [
    "Vivo X200 Ultra", "Vivo X200 Pro", "Vivo X200",
    "Vivo X100 Ultra", "Vivo X100 Pro", "Vivo X100",
    "Vivo X90 Pro+", "Vivo X90 Pro", "Vivo X90",
    "Vivo V50 Pro", "Vivo V50", "Vivo V40 Pro", "Vivo V40",
    "Vivo V29 Pro", "Vivo V29", "Vivo V27 Pro", "Vivo V27",
    "Vivo Y300 Pro", "Vivo Y200 Pro", "Vivo Y100",
    "Vivo X Fold 3 Pro", "Vivo X Fold 3", "Vivo X Flip",
    "Other"
  ],
  iQOO: [
    "iQOO 13", "iQOO 12 Pro", "iQOO 12",
    "iQOO 11S", "iQOO 11",
    "iQOO Neo 10 Pro", "iQOO Neo 10", "iQOO Neo 9 Pro",
    "iQOO Z9 Turbo", "iQOO Z9", "iQOO Z8",
    "Other"
  ],
  Huawei: [
    "Pura 70 Ultra", "Pura 70 Pro+", "Pura 70 Pro", "Pura 70",
    "Mate 60 Pro+", "Mate 60 Pro", "Mate 60",
    "Mate 50 Pro", "Mate 50",
    "Mate X5", "Mate X3",
    "P60 Pro", "P60 Art",
    "Nova 12 Ultra", "Nova 12 Pro", "Nova 12",
    "Nova 11 Ultra", "Nova 11 Pro", "Nova 11",
    "MatePad Pro 13.2", "MatePad Pro 11", "MatePad 11.5",
    "GT 5 Pro",
    "Other"
  ],
  Honor: [
    "Honor Magic 7 Pro", "Honor Magic 7",
    "Honor Magic 6 Pro", "Honor Magic 6",
    "Honor Magic V3", "Honor Magic V2",
    "Honor 200 Pro", "Honor 200",
    "Honor 100 Pro", "Honor 100",
    "Honor X9b", "Honor X8b", "Honor X7b",
    "Honor Pad 9", "Honor Pad 8",
    "Other"
  ],
  Sony: [
    "Xperia 1 VII", "Xperia 5 VII",
    "Xperia 1 VI", "Xperia 5 VI", "Xperia 10 VI",
    "Xperia 1 V", "Xperia 5 V", "Xperia 10 V",
    "Xperia 1 IV", "Xperia 5 IV", "Xperia 10 IV",
    "PlayStation 5 Pro", "PlayStation 5", "PlayStation 5 Digital Edition",
    "PlayStation 4 Pro", "PlayStation 4", "PlayStation 4 Slim",
    "PlayStation VR2",
    "WH-1000XM6", "WH-1000XM5", "WF-1000XM5", "LinkBuds S",
    "Other"
  ],
  Nokia: [
    "Nokia X30", "Nokia X20", "Nokia X10",
    "Nokia G42", "Nokia G22", "Nokia G21", "Nokia G20", "Nokia G11",
    "Nokia C32", "Nokia C22", "Nokia C12", "Nokia C21",
    "Nokia 3310 (2017)",
    "Other"
  ],
  Motorola: [
    "Motorola Edge 50 Ultra", "Motorola Edge 50 Pro", "Motorola Edge 50 Fusion",
    "Motorola Edge 50", "Motorola Edge 40 Pro", "Motorola Edge 40",
    "Motorola Razr 50 Ultra", "Motorola Razr 50",
    "Motorola Razr 40 Ultra", "Motorola Razr 40",
    "Motorola Razr 2022",
    "Moto G85", "Moto G75", "Moto G65", "Moto G55",
    "Moto G84", "Moto G54", "Moto G34",
    "Moto G Stylus 2024", "Moto G Power 2024",
    "Other"
  ],
  Infinix: [
    "Infinix Note 50 Pro+", "Infinix Note 50 Pro", "Infinix Note 50",
    "Infinix Note 40 Pro+", "Infinix Note 40 Pro", "Infinix Note 40",
    "Infinix Zero 40 5G", "Infinix Zero 30 5G",
    "Infinix Hot 50 Pro+", "Infinix Hot 50 Pro", "Infinix Hot 50",
    "Infinix Smart 9 HD", "Infinix Smart 8 Plus",
    "Infinix GT 20 Pro", "Infinix GT 10 Pro",
    "Other"
  ],
  Tecno: [
    "Tecno Phantom V Fold 2", "Tecno Phantom V Flip 2",
    "Tecno Phantom X2 Pro", "Tecno Phantom X2",
    "Tecno Camon 30 Premier", "Tecno Camon 30 Pro", "Tecno Camon 30",
    "Tecno Camon 20 Premier", "Tecno Camon 20 Pro", "Tecno Camon 20",
    "Tecno Spark 30 Pro", "Tecno Spark 30", "Tecno Spark 20 Pro",
    "Tecno Pop 9", "Tecno Pop 8",
    "Other"
  ],
  Itel: [
    "Itel RS4", "Itel S24", "Itel S23",
    "Itel P55+", "Itel P55", "Itel P40",
    "Itel A60s", "Itel A70",
    "Other"
  ],
  Nothing: [
    "Nothing Phone (3a) Pro", "Nothing Phone (3a)",
    "Nothing Phone (2a) Plus", "Nothing Phone (2a)",
    "Nothing Phone (2)", "Nothing Phone (1)",
    "Nothing Ear (open)", "Nothing Ear (2)", "Nothing Ear (1)",
    "Nothing CMF Phone 1",
    "Other"
  ],
  Fairphone: [
    "Fairphone 5", "Fairphone 4", "Fairphone 3+", "Fairphone 3",
    "Other"
  ],
  Asus: [
    "ROG Phone 9 Pro", "ROG Phone 9",
    "ROG Phone 8 Pro", "ROG Phone 8",
    "ROG Phone 7 Ultimate", "ROG Phone 7",
    "Zenfone 11 Ultra", "Zenfone 10", "Zenfone 9",
    "ROG Zephyrus G16", "ROG Zephyrus G14",
    "ROG Strix SCAR 18", "ROG Strix SCAR 16",
    "ROG Zephyrus Duo 16",
    "TUF Gaming A15", "TUF Gaming F15",
    "Zenbook Pro 16X OLED", "Zenbook 14 OLED",
    "Vivobook Pro 15 OLED", "ExpertBook B9",
    "Other"
  ],
  HTC: [
    "HTC U24 Pro", "HTC U23 Pro", "HTC U20 5G",
    "HTC Desire 22 Pro",
    "Other"
  ],
  ZTE: [
    "ZTE nubia Z60 Ultra", "ZTE nubia Z50 Ultra",
    "ZTE Axon 60 Ultra", "ZTE Axon 50 Ultra",
    "ZTE Blade A75",
    "Other"
  ],
  Nubia: [
    "Nubia Z60 Ultra", "Nubia Z50S Pro", "Nubia Z50 Ultra",
    "Nubia Red Magic 10 Pro+", "Nubia Red Magic 10 Pro",
    "Other"
  ],
  "Red Magic": [
    "Red Magic 10 Pro+", "Red Magic 10 Pro", "Red Magic 10",
    "Red Magic 9 Pro+", "Red Magic 9 Pro", "Red Magic 9S Pro",
    "Red Magic 8 Pro+", "Red Magic 8 Pro",
    "Other"
  ],
  Meizu: [
    "Meizu 21 Pro", "Meizu 21 Note", "Meizu 21",
    "Meizu 20 Pro", "Meizu 20",
    "Other"
  ],
  LG: [
    // Phones (discontinued 2021)
    "LG Velvet", "LG Wing", "LG V60 ThinQ", "LG G8 ThinQ",
    // Laptops still active
    "LG Gram Style 16", "LG Gram 17", "LG Gram 16", "LG Gram 15", "LG Gram 14",
    "LG Gram Pro 16",
    "Other"
  ],
  HP: [
    "HP Spectre x360 16", "HP Spectre x360 14",
    "HP Envy x360 15", "HP Envy 16",
    "HP OMEN 17", "HP OMEN 16", "HP OMEN Transcend 14",
    "HP Victus 16", "HP Victus 15",
    "HP Pavilion Plus 14", "HP Pavilion 15",
    "HP EliteBook 800 Series", "HP ProBook 400 Series",
    "HP Elite Dragonfly G4",
    "HP ElitePad",
    "Other"
  ],
  Dell: [
    "Dell XPS 17", "Dell XPS 15", "Dell XPS 13 Plus", "Dell XPS 13",
    "Dell XPS 14",
    "Alienware m18 R2", "Alienware m16 R2", "Alienware x16 R2", "Alienware x14 R2",
    "Dell Inspiron 16 Plus", "Dell Inspiron 16", "Dell Inspiron 15", "Dell Inspiron 14",
    "Dell Latitude 9000 Series", "Dell Latitude 7000 Series", "Dell Latitude 5000 Series",
    "Dell Precision 5590",
    "Other"
  ],
  Lenovo: [
    "ThinkPad X1 Carbon Gen 12", "ThinkPad X1 Yoga Gen 9",
    "ThinkPad T14s Gen 5", "ThinkPad E14 Gen 6",
    "ThinkPad X1 Extreme Gen 5",
    "Legion Pro 9i", "Legion Pro 7i", "Legion Pro 5i",
    "Legion Slim 7i", "LOQ 16", "LOQ 15",
    "Yoga 9i", "Yoga 7i", "Yoga Book 9i",
    "IdeaPad Pro 5i", "IdeaPad Slim 5i",
    "Tab Extreme", "Tab P12 Pro",
    "Other"
  ],
  Microsoft: [
    // Surface
    "Surface Pro 11", "Surface Pro 10", "Surface Pro 9",
    "Surface Laptop 7", "Surface Laptop 6", "Surface Laptop 5",
    "Surface Laptop Studio 2",
    "Surface Go 4", "Surface Go 3",
    "Surface Duo 2",
    // Xbox
    "Xbox Series X", "Xbox Series S",
    "Xbox One X", "Xbox One S", "Xbox One",
    "Other"
  ],
  Acer: [
    "Predator Helios 18", "Predator Helios 16",
    "Predator Triton 16", "Predator Orion 5000",
    "Nitro V 16", "Nitro V 15", "Nitro 17", "Nitro 16",
    "Swift X 14", "Swift Go 14", "Swift 5",
    "Aspire 5", "Aspire 3",
    "ConceptD 7",
    "Other"
  ],
  Razer: [
    "Razer Blade 18", "Razer Blade 16", "Razer Blade 15", "Razer Blade 14",
    "Razer Blade Stealth 13",
    "Other"
  ],
  MSI: [
    "MSI Titan GT77 HX", "MSI Raider GE78 HX",
    "MSI Stealth 17", "MSI Stealth 16 Studio",
    "MSI Stealth 14", "MSI Stealth 15",
    "MSI Katana 17", "MSI Katana 15",
    "MSI Prestige 16", "MSI Prestige 14",
    "MSI Summit E16",
    "Other"
  ],
  Toshiba: [
    "Dynabook Portege X40", "Dynabook Tecra A50",
    "Toshiba Satellite",
    "Other"
  ],
  Panasonic: [
    "Panasonic TOUGHBOOK 40", "Panasonic TOUGHBOOK 55",
    "Panasonic Eluga Ray 800",
    "Other"
  ],
  Nintendo: [
    "Nintendo Switch 2",
    "Nintendo Switch OLED", "Nintendo Switch", "Nintendo Switch Lite",
    "Wii U", "Wii",
    "Nintendo 3DS XL", "Nintendo 3DS", "Nintendo 2DS",
    "Nintendo DS Lite", "Nintendo DS",
    "Game Boy Advance SP", "Game Boy Advance",
    "Other"
  ],
  Sharp: ["Sharp AQUOS R9 Pro", "Sharp AQUOS R8s", "Sharp AQUOS sense9", "Other"],
  Fujitsu: ["Fujitsu Arrows N", "Fujitsu Arrows We2", "Other"],
  Oukitel: ["Oukitel WP33 Pro", "Oukitel WP30 Pro", "Oukitel C37", "Other"],
  Bose: ["Bose QuietComfort Ultra", "Bose QuietComfort 45", "Bose Sport Earbuds", "Other"],
  JBL: ["JBL Quantum 910", "JBL Live Pro 2", "JBL Tune 770NC", "JBL Flip 7", "Other"],
  GoPro: ["GoPro Hero 13 Black", "GoPro Hero 12 Black", "GoPro Hero 11 Black", "GoPro Hero 10 Black", "Other"],
  DJI: ["DJI Air 3S", "DJI Mini 4 Pro", "DJI Osmo Mobile 7", "DJI Pocket 3", "Other"],
  Blackberry: ["BlackBerry KEY2", "BlackBerry KEYone", "BlackBerry Priv", "Other"],
  Other: ["Other"]
};
