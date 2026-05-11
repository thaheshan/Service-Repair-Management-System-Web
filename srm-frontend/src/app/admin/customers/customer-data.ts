export type CustomerType = "VIP" | "Regular" | "New" | "Corporate"


export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  location: string
  repairs: number
  spentRaw: number // in thousands (e.g. 58 = Rs.58k)
  type: CustomerType
  lastVisitDays: number // 0 = today
  registeredAt: string // YYYY-MM-DD
  tags: string[]
}

function d(n: number) {
  const dt = new Date(); dt.setDate(dt.getDate() - n); return dt.toISOString().slice(0, 10)
}

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 1,  name: "Sarah Anderson",      email: "sarah.anderson@email.com",   phone: "+94 77 123 4567", location: "Colombo, Sri Lanka",     repairs: 12, spentRaw: 58,  type: "VIP",     lastVisitDays: 2,   registeredAt: d(180), tags: ["VIP"] },
  { id: 2,  name: "Michael Johnson",     email: "m.johnson@email.com",        phone: "+94 71 234 5678", location: "Kandy, Sri Lanka",       repairs: 8,  spentRaw: 45,  type: "Regular", lastVisitDays: 5,   registeredAt: d(210), tags: [] },
  { id: 3,  name: "Emily Chen",          email: "emily.chen@email.com",       phone: "+94 76 345 6789", location: "Galle, Sri Lanka",       repairs: 15, spentRaw: 72,  type: "VIP",     lastVisitDays: 1,   registeredAt: d(300), tags: ["VIP","Corporate"] },
  { id: 4,  name: "David Williams",      email: "d.williams@email.com",       phone: "+94 75 456 7890", location: "Colombo, Sri Lanka",     repairs: 20, spentRaw: 95,  type: "VIP",     lastVisitDays: 3,   registeredAt: d(400), tags: ["VIP"] },
  { id: 5,  name: "Lisa Patel",          email: "lisa.patel@email.com",       phone: "+94 72 567 8901", location: "Negombo, Sri Lanka",    repairs: 6,  spentRaw: 32,  type: "Regular", lastVisitDays: 7,   registeredAt: d(90),  tags: [] },
  { id: 6,  name: "Robert Martinez",     email: "r.martinez@email.com",       phone: "+94 70 678 9012", location: "Jaffna, Sri Lanka",     repairs: 4,  spentRaw: 18,  type: "Regular", lastVisitDays: 12,  registeredAt: d(150), tags: [] },
  { id: 7,  name: "Jennifer Brown",      email: "j.brown@email.com",          phone: "+94 71 789 0123", location: "Matara, Sri Lanka",     repairs: 9,  spentRaw: 48,  type: "Regular", lastVisitDays: 4,   registeredAt: d(220), tags: [] },
  { id: 8,  name: "Thomas Lee",          email: "thomas.lee@email.com",       phone: "+94 75 890 1234", location: "Kurunegala, Sri Lanka", repairs: 11, spentRaw: 54,  type: "Regular", lastVisitDays: 6,   registeredAt: d(185), tags: [] },
  { id: 9,  name: "Amanda Taylor",       email: "a.taylor@email.com",         phone: "+94 73 901 2345", location: "Anuradhapura, Sri Lanka",repairs:18, spentRaw: 82,  type: "VIP",     lastVisitDays: 0,   registeredAt: d(350), tags: ["VIP"] },
  { id: 10, name: "James Wilson",        email: "j.wilson@email.com",         phone: "+94 77 012 3456", location: "Colombo, Sri Lanka",     repairs: 3,  spentRaw: 14,  type: "New",     lastVisitDays: 1,   registeredAt: d(20),  tags: [] },
  { id: 11, name: "Priya Nair",          email: "priya.nair@email.com",       phone: "+94 71 123 5678", location: "Kandy, Sri Lanka",       repairs: 7,  spentRaw: 38,  type: "Regular", lastVisitDays: 14,  registeredAt: d(130), tags: [] },
  { id: 12, name: "Ahmed Hassan",        email: "ahmed.hassan@email.com",     phone: "+94 76 234 6789", location: "Colombo, Sri Lanka",     repairs: 22, spentRaw: 105, type: "VIP",     lastVisitDays: 0,   registeredAt: d(500), tags: ["VIP","Corporate"] },
  { id: 13, name: "Nina Rodrigo",        email: "nina.r@email.com",           phone: "+94 75 345 7890", location: "Galle, Sri Lanka",       repairs: 2,  spentRaw: 8,   type: "New",     lastVisitDays: 3,   registeredAt: d(15),  tags: [] },
  { id: 14, name: "Kevin Zhang",         email: "k.zhang@email.com",          phone: "+94 72 456 8901", location: "Negombo, Sri Lanka",    repairs: 5,  spentRaw: 27,  type: "Regular", lastVisitDays: 20,  registeredAt: d(160), tags: [] },
  { id: 15, name: "Sophie Davis",        email: "sophie.d@email.com",         phone: "+94 70 567 9012", location: "Matara, Sri Lanka",     repairs: 10, spentRaw: 52,  type: "Regular", lastVisitDays: 8,   registeredAt: d(240), tags: [] },
  { id: 16, name: "Raj Jayawardena",     email: "raj.jaya@email.com",         phone: "+94 71 678 0123", location: "Colombo, Sri Lanka",     repairs: 16, spentRaw: 78,  type: "VIP",     lastVisitDays: 2,   registeredAt: d(280), tags: ["VIP"] },
  { id: 17, name: "Malsha Fernando",     email: "malsha.f@email.com",         phone: "+94 75 789 1234", location: "Jaffna, Sri Lanka",     repairs: 1,  spentRaw: 5,   type: "New",     lastVisitDays: 5,   registeredAt: d(10),  tags: [] },
  { id: 18, name: "Chris Perera",        email: "chris.p@email.com",          phone: "+94 73 890 2345", location: "Kandy, Sri Lanka",       repairs: 13, spentRaw: 63,  type: "Regular", lastVisitDays: 30,  registeredAt: d(365), tags: [] },
  { id: 19, name: "Anita Sharma",        email: "anita.s@email.com",          phone: "+94 77 901 3456", location: "Colombo, Sri Lanka",     repairs: 25, spentRaw: 115, type: "VIP",     lastVisitDays: 1,   registeredAt: d(450), tags: ["VIP","Corporate"] },
  { id: 20, name: "Brandon Silva",       email: "brandon.s@email.com",        phone: "+94 71 012 4567", location: "Kurunegala, Sri Lanka", repairs: 4,  spentRaw: 20,  type: "Regular", lastVisitDays: 45,  registeredAt: d(100), tags: [] },
  { id: 21, name: "Dilini Abeyguna",     email: "dilini.a@email.com",         phone: "+94 76 123 5678", location: "Galle, Sri Lanka",       repairs: 8,  spentRaw: 41,  type: "Regular", lastVisitDays: 10,  registeredAt: d(200), tags: [] },
  { id: 22, name: "Omar Farouq",         email: "omar.f@email.com",           phone: "+94 75 234 6789", location: "Negombo, Sri Lanka",    repairs: 6,  spentRaw: 30,  type: "Regular", lastVisitDays: 90,  registeredAt: d(270), tags: [] },
  { id: 23, name: "Sachini Rathnayake", email: "sachini.r@email.com",        phone: "+94 72 345 7890", location: "Matara, Sri Lanka",     repairs: 2,  spentRaw: 9,   type: "New",     lastVisitDays: 2,   registeredAt: d(25),  tags: [] },
  { id: 24, name: "Luke Anderson",       email: "luke.a@email.com",           phone: "+94 70 456 8901", location: "Colombo, Sri Lanka",     repairs: 19, spentRaw: 88,  type: "VIP",     lastVisitDays: 4,   registeredAt: d(320), tags: ["VIP"] },
  { id: 25, name: "Kavindi Perera",      email: "kavindi.p@email.com",        phone: "+94 71 567 9012", location: "Kandy, Sri Lanka",       repairs: 7,  spentRaw: 36,  type: "Regular", lastVisitDays: 15,  registeredAt: d(140), tags: [] },
  { id: 26, name: "Marcus Brown",        email: "marcus.b@email.com",         phone: "+94 75 678 0123", location: "Anuradhapura, Sri Lanka",repairs: 11, spentRaw: 55,  type: "Regular", lastVisitDays: 60,  registeredAt: d(380), tags: [] },
  { id: 27, name: "Thilini De Silva",    email: "thilini.d@email.com",        phone: "+94 73 789 1234", location: "Jaffna, Sri Lanka",     repairs: 3,  spentRaw: 16,  type: "New",     lastVisitDays: 0,   registeredAt: d(28),  tags: [] },
  { id: 28, name: "Jason Mendis",        email: "jason.m@email.com",          phone: "+94 77 890 2345", location: "Colombo, Sri Lanka",     repairs: 14, spentRaw: 68,  type: "Regular", lastVisitDays: 7,   registeredAt: d(250), tags: [] },
  { id: 29, name: "Preethi Kumari",      email: "preethi.k@email.com",        phone: "+94 71 901 3456", location: "Kandy, Sri Lanka",       repairs: 28, spentRaw: 130, type: "VIP",     lastVisitDays: 0,   registeredAt: d(600), tags: ["VIP","Corporate"] },
  { id: 30, name: "Nuwan Senanayake",    email: "nuwan.s@email.com",          phone: "+94 76 012 4567", location: "Galle, Sri Lanka",       repairs: 5,  spentRaw: 25,  type: "Regular", lastVisitDays: 200, registeredAt: d(420), tags: [] },
]

export function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

export function getAvatarColor(id: number): string {
  const colors = [
    "bg-[#4F46E5]","bg-[#7C3AED]","bg-[#DB2777]","bg-[#DC2626]",
    "bg-[#D97706]","bg-[#059669]","bg-[#0891B2]","bg-[#4338CA]",
    "bg-[#6D28D9]","bg-[#BE185D]",
  ]
  return colors[id % colors.length]
}

export function formatSpent(raw: number): string {
  return raw >= 100 ? `Rs. ${raw}k` : `Rs. ${raw}k`
}
