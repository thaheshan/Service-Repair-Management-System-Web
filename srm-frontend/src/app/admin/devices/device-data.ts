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
  "Apple", "Samsung", "Google", "Asus", "Acer", "Dell", "HP", "Lenovo", "Microsoft", "Sony", 
  "LG", "Huawei", "Xiaomi", "OnePlus", "Oppo", "Vivo", "Motorola", "Nokia", "Nintendo", 
  "PlayStation", "Xbox", "Bose", "JBL", "GoPro", "DJI", "Other"
];

export const DEVICE_MODELS_BY_BRAND: Record<string, string[]> = {
  Apple: [
    "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
    "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
    "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 mini",
    "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 12 mini",
    "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11",
    "iPhone XS Max", "iPhone XS", "iPhone XR", "iPhone X",
    "iPhone 8 Plus", "iPhone 8", "iPhone 7 Plus", "iPhone 7", "iPhone SE (3rd Gen)", "iPhone SE (2nd Gen)",
    "iPad Pro 12.9-inch (M2)", "iPad Pro 11-inch (M2)", "iPad Air (5th Gen)", "iPad (10th Gen)", "iPad mini (6th Gen)",
    "MacBook Pro 16-inch", "MacBook Pro 14-inch", "MacBook Air 15-inch", "MacBook Air 13-inch", "iMac 24-inch", "Mac mini", "Mac Studio", "Mac Pro",
    "Apple Watch Ultra 2", "Apple Watch Ultra", "Apple Watch Series 9", "Apple Watch Series 8", "Apple Watch SE",
    "AirPods Pro (2nd Gen)", "AirPods (3rd Gen)", "AirPods Max",
    "Other"
  ],
  Samsung: [
    "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24",
    "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23", "Galaxy S23 FE",
    "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22",
    "Galaxy S21 Ultra", "Galaxy S21+", "Galaxy S21", "Galaxy S21 FE",
    "Galaxy S20 Ultra", "Galaxy S20+", "Galaxy S20", "Galaxy S20 FE",
    "Galaxy Z Fold 5", "Galaxy Z Flip 5", "Galaxy Z Fold 4", "Galaxy Z Flip 4", "Galaxy Z Fold 3", "Galaxy Z Flip 3",
    "Galaxy Note 20 Ultra", "Galaxy Note 20", "Galaxy Note 10+", "Galaxy Note 10",
    "Galaxy A54", "Galaxy A34", "Galaxy A14", "Galaxy A73", "Galaxy A53", "Galaxy A33", "Galaxy A13", "Galaxy A52",
    "Galaxy Tab S9 Ultra", "Galaxy Tab S9+", "Galaxy Tab S9", "Galaxy Tab S8 Ultra", "Galaxy Tab S8+", "Galaxy Tab S8", "Galaxy Tab A8",
    "Galaxy Watch 6 Classic", "Galaxy Watch 6", "Galaxy Watch 5 Pro", "Galaxy Watch 5",
    "Other"
  ],
  Google: [
    "Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro", "Pixel 7", "Pixel 7a", "Pixel 6 Pro", "Pixel 6", "Pixel 6a", 
    "Pixel 5", "Pixel 5a", "Pixel 4 XL", "Pixel 4", "Pixel 4a",
    "Pixel Fold", "Pixel Tablet", "Pixel Watch 2", "Pixel Watch", "Pixel Buds Pro",
    "Other"
  ],
  Xiaomi: [
    "Xiaomi 14 Pro", "Xiaomi 14", "Xiaomi 13 Ultra", "Xiaomi 13 Pro", "Xiaomi 13", "Xiaomi 13T Pro", "Xiaomi 13T",
    "Xiaomi 12S Ultra", "Xiaomi 12 Pro", "Xiaomi 12",
    "Redmi Note 13 Pro+", "Redmi Note 13 Pro", "Redmi Note 13", "Redmi Note 12 Pro+", "Redmi Note 12 Pro", "Redmi Note 12",
    "POCO F5 Pro", "POCO F5", "POCO X5 Pro", "POCO X5",
    "Xiaomi Pad 6", "Xiaomi Pad 5",
    "Other"
  ],
  Sony: [
    "Xperia 1 V", "Xperia 5 V", "Xperia 10 V", "Xperia 1 IV", "Xperia 5 IV", "Xperia 10 IV",
    "PlayStation 5", "PlayStation 5 Digital Edition", "PlayStation 4 Pro", "PlayStation 4", "PlayStation VR2",
    "WH-1000XM5", "WF-1000XM5", "WH-1000XM4",
    "Other"
  ],
  OnePlus: [
    "OnePlus 12", "OnePlus 11", "OnePlus 11R", "OnePlus 10 Pro", "OnePlus 10T", "OnePlus 9 Pro", "OnePlus 9",
    "OnePlus Nord 3", "OnePlus Nord CE 3", "OnePlus Nord 2T", "OnePlus Pad",
    "Other"
  ],
  Huawei: [
    "Mate 60 Pro+", "Mate 60 Pro", "Mate 60", "P60 Pro", "P60", "Mate 50 Pro", "Mate 50", "P50 Pro", "P50",
    "Nova 11 Pro", "Nova 11", "MatePad Pro 13.2", "MatePad Pro 11",
    "Other"
  ],
  Motorola: [
    "Edge 40 Pro", "Edge 40", "Edge 30 Ultra", "Edge 30 Pro",
    "Razr 40 Ultra", "Razr 40", "Razr 2022",
    "Moto G84", "Moto G54", "Moto G Stylus",
    "Other"
  ],
  Oppo: [
    "Find N3", "Find N3 Flip", "Find X6 Pro", "Find X6", "Find X5 Pro", "Find X5",
    "Reno 10 Pro+", "Reno 10 Pro", "Reno 10", "Reno 8 Pro", "Reno 8",
    "Other"
  ],
  Vivo: [
    "X100 Pro", "X100", "X90 Pro+", "X90 Pro", "X90", "X80 Pro", "X80",
    "V29 Pro", "V29", "V27 Pro", "V27", "X Fold 2", "X Flip",
    "Other"
  ],
  Nintendo: [
    "Nintendo Switch OLED", "Nintendo Switch", "Nintendo Switch Lite", "Wii U", "Nintendo 3DS",
    "Other"
  ],
  Microsoft: [
    "Xbox Series X", "Xbox Series S", "Xbox One X", "Xbox One S", "Xbox One",
    "Surface Pro 9", "Surface Pro 8", "Surface Laptop 5", "Surface Laptop Studio 2", "Surface Go 3", "Surface Duo 2",
    "Other"
  ],
  Dell: [
    "XPS 17", "XPS 15", "XPS 13 Plus", "XPS 13", "Alienware m18", "Alienware m16", "Alienware x16", "Alienware x14",
    "Inspiron 16", "Inspiron 15", "Inspiron 14", "Latitude 9000 Series", "Latitude 7000 Series",
    "Other"
  ],
  HP: [
    "Spectre x360 16", "Spectre x360 14", "Envy x360", "Envy 16", "OMEN 17", "OMEN 16", "Victus 16", "Victus 15",
    "Pavilion Plus 14", "EliteBook 800 Series", "ProBook 400 Series",
    "Other"
  ],
  Lenovo: [
    "ThinkPad X1 Carbon Gen 11", "ThinkPad X1 Yoga Gen 8", "ThinkPad T14 Gen 4", "ThinkPad E14 Gen 5",
    "Legion Pro 7i", "Legion Pro 5i", "Legion Slim 7i", "LOQ 15",
    "Yoga 9i", "Yoga 7i", "IdeaPad Pro 5i", "IdeaPad Slim 5",
    "Other"
  ],
  Asus: [
    "ROG Zephyrus G14", "ROG Zephyrus M16", "ROG Strix SCAR 16", "ROG Strix SCAR 18", "TUF Gaming A15", "TUF Gaming F15",
    "Zenbook Pro 16X OLED", "Zenbook 14 OLED", "Vivobook Pro 15 OLED", "ExpertBook B9",
    "ROG Phone 7 Ultimate", "ROG Phone 7", "Zenfone 10",
    "Other"
  ],
  Acer: [
    "Predator Helios 18", "Predator Helios 16", "Nitro 17", "Nitro 16",
    "Swift Go 14", "Swift X 14", "Aspire 5", "Aspire 3",
    "Other"
  ],
  LG: [
    "Gram 17", "Gram 16", "Gram 15", "Gram 14", "Gram Style",
    "OLED C3 TV", "OLED G3 TV", "OLED B3 TV",
    "Other"
  ]
};
