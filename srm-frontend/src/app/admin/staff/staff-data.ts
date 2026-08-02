export type StaffStatus = "Available" | "Busy" | "On Leave" | "Off Duty"
export type StaffRole = string
export type Specialty = "Mobile Phones" | "Tablets" | "Laptops" | "Gaming Consoles" | "All Electronics" | "Computers"

export interface StaffMember {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  role: StaffRole
  specialties: Specialty[]
  status: StaffStatus
  rating: number
  activeJobs: number
  weekJobs: number
  branch: string
  joinedAt: string
  avatar?: string
}

export const ROLES: StaffRole[] = ["Super Admin", "Admin", "Lead Technician", "Senior Technician", "Technician", "Junior Technician", "Manager", "Receptionist"]
export const SPECIALTIES: Specialty[] = ["Mobile Phones", "Tablets", "Laptops", "Gaming Consoles", "All Electronics", "Computers"]
export const STATUSES: StaffStatus[] = ["Available", "Busy", "On Leave", "Off Duty"]
export const BRANCHES = ["Main Branch", "City Center", "Kandy Branch", "Galle Branch"]

export const ROLE_COLOR: Record<StaffRole, string> = {
  "Lead Technician": "text-[#8B5CF6]",
  "Senior Technician": "text-[#4F46E5]",
  "Technician": "text-[#00A19D]",
  "Junior Technician": "text-[#E11D48]",
  "Manager": "text-[#059669]",
  "Receptionist": "text-[#F59E0B]",
}

export const STATUS_DOT: Record<StaffStatus, string> = {
  "Available": "bg-green-500",
  "Busy": "bg-red-500",
  "On Leave": "bg-amber-400",
  "Off Duty": "bg-gray-400",
}

export const STATUS_BADGE: Record<StaffStatus, string> = {
  "Available": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Busy": "bg-red-50 text-red-600 border-red-200",
  "On Leave": "bg-amber-50 text-amber-700 border-amber-200",
  "Off Duty": "bg-gray-100 text-gray-500 border-gray-200",
}

export function getInitials(f: string, l: string) { return (f[0] || "") + (l[0] || "") }
export function getAvatarBg(id: number) {
  const c = ["bg-[#4F46E5]", "bg-[#7C3AED]", "bg-[#DB2777]", "bg-[#DC2626]", "bg-[#D97706]", "bg-[#059669]", "bg-[#0891B2]", "bg-[#4338CA]", "bg-[#6D28D9]", "bg-[#BE185D]"]
  return c[id % c.length]
}

export const INITIAL_STAFF: StaffMember[] = [
  { id: 1, firstName: "Rohan", lastName: "Silva", email: "rohan.s@srm.lk", phone: "+94 77 111 2222", role: "Senior Technician", specialties: ["Mobile Phones", "Tablets"], status: "Available", rating: 4.9, activeJobs: 5, weekJobs: 12, branch: "Main Branch", joinedAt: "2021-03-15", avatar: "https://i.pravatar.cc/150?u=rohan" },
  { id: 2, firstName: "Nisha", lastName: "Fernando", email: "nisha.f@srm.lk", phone: "+94 71 222 3333", role: "Lead Technician", specialties: ["Laptops", "Computers"], status: "Available", rating: 5.0, activeJobs: 3, weekJobs: 18, branch: "Main Branch", joinedAt: "2020-07-01", avatar: "https://i.pravatar.cc/150?u=nisha" },
  { id: 3, firstName: "Amaya", lastName: "Wickrama", email: "amaya.w@srm.lk", phone: "+94 76 333 4444", role: "Junior Technician", specialties: ["Mobile Phones", "Tablets"], status: "Available", rating: 4.8, activeJobs: 4, weekJobs: 9, branch: "City Center", joinedAt: "2023-01-10", avatar: "https://i.pravatar.cc/150?u=amaya" },
  { id: 4, firstName: "Dilshan", lastName: "Kumar", email: "dilshan.k@srm.lk", phone: "+94 75 444 5555", role: "Technician", specialties: ["Gaming Consoles", "All Electronics"], status: "Available", rating: 4.6, activeJobs: 2, weekJobs: 11, branch: "Main Branch", joinedAt: "2022-06-20", avatar: "https://i.pravatar.cc/150?u=dilshan" },
  { id: 5, firstName: "Tharindu", lastName: "Jayasinghe", email: "tharindu.j@srm.lk", phone: "+94 72 555 6666", role: "Technician", specialties: ["Mobile Phones", "Tablets"], status: "Busy", rating: 4.5, activeJobs: 6, weekJobs: 10, branch: "Kandy Branch", joinedAt: "2022-09-05", avatar: "https://i.pravatar.cc/150?u=tharindu" },
  { id: 6, firstName: "Chathura", lastName: "Bandara", email: "chathura.b@srm.lk", phone: "+94 70 666 7777", role: "Junior Technician", specialties: ["Laptops", "Computers"], status: "Available", rating: 4.4, activeJobs: 3, weekJobs: 7, branch: "City Center", joinedAt: "2023-05-18", avatar: "https://i.pravatar.cc/150?u=chathura" },
  { id: 7, firstName: "Nuwan", lastName: "Rajapaksa", email: "nuwan.r@srm.lk", phone: "+94 77 777 8888", role: "Senior Technician", specialties: ["All Electronics"], status: "Busy", rating: 5.0, activeJobs: 8, weekJobs: 20, branch: "Main Branch", joinedAt: "2019-11-30", avatar: "https://i.pravatar.cc/150?u=nuwan" },
  { id: 8, firstName: "Priyanka", lastName: "Samaraweera", email: "priyanka.s@srm.lk", phone: "+94 71 888 9999", role: "Junior Technician", specialties: ["Mobile Phones"], status: "Available", rating: 4.6, activeJobs: 5, weekJobs: 8, branch: "Galle Branch", joinedAt: "2023-08-22", avatar: "https://i.pravatar.cc/150?u=priyanka" },
  { id: 9, firstName: "Kasun", lastName: "Perera", email: "kasun.p@srm.lk", phone: "+94 76 999 0000", role: "Technician", specialties: ["Laptops", "Gaming Consoles"], status: "On Leave", rating: 4.7, activeJobs: 0, weekJobs: 5, branch: "Main Branch", joinedAt: "2021-12-01", avatar: "https://i.pravatar.cc/150?u=kasun" },
  { id: 10, firstName: "Madhavi", lastName: "Gunawardena", email: "madhavi.g@srm.lk", phone: "+94 75 000 1111", role: "Lead Technician", specialties: ["All Electronics", "Computers"], status: "Available", rating: 4.9, activeJobs: 4, weekJobs: 15, branch: "City Center", joinedAt: "2020-03-14", avatar: "https://i.pravatar.cc/150?u=madhavi" },
  { id: 11, firstName: "Samantha", lastName: "De Silva", email: "samantha.d@srm.lk", phone: "+94 72 111 3333", role: "Manager", specialties: ["All Electronics"], status: "Available", rating: 4.8, activeJobs: 1, weekJobs: 6, branch: "Main Branch", joinedAt: "2018-06-10", avatar: "https://i.pravatar.cc/150?u=samantha" },
  { id: 12, firstName: "Buddhika", lastName: "Ranasinghe", email: "buddhika.r@srm.lk", phone: "+94 70 222 4444", role: "Junior Technician", specialties: ["Mobile Phones", "Tablets"], status: "Off Duty", rating: 4.3, activeJobs: 0, weekJobs: 4, branch: "Kandy Branch", joinedAt: "2024-01-08", avatar: "https://i.pravatar.cc/150?u=buddhika" },
  { id: 13, firstName: "Hiruni", lastName: "Pathirana", email: "hiruni.p@srm.lk", phone: "+94 77 333 5555", role: "Receptionist", specialties: ["Mobile Phones"], status: "Available", rating: 4.7, activeJobs: 0, weekJobs: 0, branch: "Main Branch", joinedAt: "2022-04-25", avatar: "https://i.pravatar.cc/150?u=hiruni" },
  { id: 14, firstName: "Lasith", lastName: "Malinga", email: "lasith.m@srm.lk", phone: "+94 71 444 6666", role: "Senior Technician", specialties: ["Laptops", "Computers", "Tablets"], status: "Busy", rating: 4.8, activeJobs: 7, weekJobs: 14, branch: "Galle Branch", joinedAt: "2021-07-19", avatar: "https://i.pravatar.cc/150?u=lasith" },
  { id: 15, firstName: "Sachini", lastName: "Ekanayake", email: "sachini.e@srm.lk", phone: "+94 76 555 7777", role: "Technician", specialties: ["Gaming Consoles"], status: "Available", rating: 4.5, activeJobs: 3, weekJobs: 9, branch: "City Center", joinedAt: "2022-11-11", avatar: "https://i.pravatar.cc/150?u=sachini" },
  { id: 16, firstName: "Dumindu", lastName: "Dissanayake", email: "dumindu.d@srm.lk", phone: "+94 75 666 8888", role: "Junior Technician", specialties: ["Mobile Phones", "Tablets"], status: "Available", rating: 4.4, activeJobs: 4, weekJobs: 8, branch: "Kandy Branch", joinedAt: "2023-09-01", avatar: "https://i.pravatar.cc/150?u=dumindu" },
]

export const UNASSIGNED_REPAIRS = [
  "Screen Replacement — iPhone 14 Pro (High Priority)",
  "Battery Swelling — iPad Air (Normal)",
  "Motherboard Diagnosis — Samsung S23 (Urgent)",
  "Keyboard Repair — MacBook Pro (Normal)",
  "Charging Port — Redmi Note 12 (Low)",
  "Water Damage — iPhone 13 (Urgent)",
  "Display Flickering — Dell XPS 15 (High Priority)",
]
