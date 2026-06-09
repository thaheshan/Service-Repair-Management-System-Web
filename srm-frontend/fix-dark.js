const fs = require('fs');
const path = 'c:/Users/ashan/Desktop/srmnew/Service-Repair-Management-System-Web/srm-frontend/src/app/admin/customers/[id]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Colors
content = content.replace(/bg-\[#F8FAFC\]/g, 'bg-[#F8FAFC] dark:bg-background');
content = content.replace(/bg-white/g, 'bg-white dark:bg-card/90');
content = content.replace(/text-\[#0F172A\]/g, 'text-[#0F172A] dark:text-foreground');
content = content.replace(/text-\[#334155\]/g, 'text-[#334155] dark:text-slate-300');
content = content.replace(/hover:text-\[#0F172A\]/g, 'hover:text-[#0F172A] dark:hover:text-foreground');

// Tabs and other light gray items
content = content.replace(/bg-\[#EEF2FF\]/g, 'bg-[#EEF2FF] dark:bg-[#4F46E5]/10');
content = content.replace(/bg-\[#ECFDF5\]/g, 'bg-[#ECFDF5] dark:bg-[#10B981]/10');
content = content.replace(/bg-\[#FEF3C7\]/g, 'bg-[#FEF3C7] dark:bg-[#F59E0B]/10');
content = content.replace(/border-border/g, 'border-border dark:border-white/10');

fs.writeFileSync(path, content);
console.log("Done replacing classes.");
