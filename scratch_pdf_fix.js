const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../srm-frontend/src/lib/pdf-generator.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Import store
if (!content.includes("import { store }")) {
  content = content.replace("import autoTable from 'jspdf-autotable';", "import autoTable from 'jspdf-autotable';\nimport { store } from '@/store/store';");
}

// 2. Add getLogoBase64 helper
const logoHelper = `
async function getLogoBase64(): Promise<string | null> {
  try {
    const state = store.getState() as any;
    const queryCache = state.api?.queries;
    if (!queryCache) return null;
    
    const settingsQuery = Object.keys(queryCache).find(key => key.startsWith('getSettings'));
    let logoUrl = null;
    if (settingsQuery && queryCache[settingsQuery]?.data) {
      const data = queryCache[settingsQuery].data;
      logoUrl = data?.logoUrl || data?.settings?.appearance?.logoUrl || null;
    }
    
    if (!logoUrl) return null;
    
    const res = await fetch(logoUrl);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("Failed to load logo for PDF", err);
    return null;
  }
}
`;
if (!content.includes("async function getLogoBase64()")) {
  content = content.replace("// Shop detail defaults", logoHelper + "\n// Shop detail defaults");
}

// 3. Make drawHeader async and add logo logic
content = content.replace(
  "function drawHeader(doc: jsPDF, title: string, user: any, orientation: 'portrait' | 'landscape' = 'portrait') {",
  "async function drawHeader(doc: jsPDF, title: string, user: any, orientation: 'portrait' | 'landscape' = 'portrait') {"
);

// Add await getLogoBase64
const drawHeaderBodyStart = `  const shop = getShopDetails(user);
  const pageWidth = doc.internal.pageSize.getWidth();

  const logoBase64 = await getLogoBase64();

  // Indigo top bar`;
content = content.replace(`  const shop = getShopDetails(user);
  const pageWidth = doc.internal.pageSize.getWidth();

  // Indigo top bar`, drawHeaderBodyStart);

// Update shop details positioning
const shopDetailsOld = `  // Shop Details below bar
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(14);
  doc.text(shop.name, 14, 25);

  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(\`\${shop.website}  |  \${shop.email}  |  \${shop.phone}\`, 14, 30);`;

const shopDetailsNew = `  // Shop Details below bar
  let startX = 14;
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 14, 18, 12, 12);
      startX = 30; // Shift text right
    } catch(e) {
      console.error(e);
    }
  }

  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(14);
  doc.text(shop.name, startX, 25);

  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(\`\${shop.website}  |  \${shop.email}  |  \${shop.phone}\`, startX, 30);`;

if (!content.includes("doc.addImage(logoBase64")) {
  content = content.replace(shopDetailsOld, shopDetailsNew);
}

// 4. Change all export function to export async function
content = content.replace(/export function generate/g, "export async function generate");

// 5. Change all drawHeader( to await drawHeader(
content = content.replace(/drawHeader\(/g, "await drawHeader(");
// Fix the function declaration we just replaced accidentally
content = content.replace("async function await drawHeader(", "async function drawHeader(");

fs.writeFileSync(filePath, content);
console.log("Replaced successfully!");
