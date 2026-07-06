const fs = require('fs');
const path = require('path');
const file = path.join('c:', 'Users', 'ashan', 'Desktop', 'srmnew', 'Service-Repair-Management-System-Web', 'srm-frontend', 'src', 'lib', 'pdf-generator.ts');
let content = fs.readFileSync(file, 'utf8');

// Replace getLogoBase64 with getLogosBase64
content = content.replace(/async function getLogoBase64\(\): Promise<string \| null> \{[\s\S]*?\}[\r\n]+(?=\/\/ Shop detail)/m, `async function getUrlBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("Failed to load image for PDF", err);
    return null;
  }
}

async function getLogosBase64(invoice?: any): Promise<{ shopLogo: string | null, srmLogo: string | null }> {
  let srmLogo = await getUrlBase64('/all-fix-logo-black.png');
  let shopLogoUrl = invoice?.shopLogoUrl;

  if (!shopLogoUrl) {
    try {
      const state = store.getState() as any;
      const queryCache = state.api?.queries;
      if (queryCache) {
        const settingsQuery = Object.keys(queryCache).find(key => key.startsWith('getSettings') || key.startsWith('getShopProfile'));
        if (settingsQuery && queryCache[settingsQuery]?.data) {
          const data = queryCache[settingsQuery].data;
          shopLogoUrl = data?.logoUrl || data?.settings?.appearance?.logoUrl || data?.shopLogoUrl || null;
        }
      }
    } catch(e) {}
  }

  if (!shopLogoUrl) {
      shopLogoUrl = '/placeholder-logo.png';
  }

  let shopLogo = await getUrlBase64(shopLogoUrl);
  if (!shopLogo) {
     shopLogo = await getUrlBase64('/placeholder-logo.png');
  }

  return { shopLogo, srmLogo };
}
`);

// Update drawHeader signature and implementation
content = content.replace(/async function drawHeader\(doc: jsPDF, title: string, user: any, orientation: 'portrait' \| 'landscape' = 'portrait'\) \{[\s\S]*?(?=\/\/ Draws a professional signature footer)/m, `async function drawHeader(doc: jsPDF, title: string, user: any, orientation: 'portrait' | 'landscape' = 'portrait', invoice?: any) {
  const shop = getShopDetails(user);
  const pageWidth = doc.internal.pageSize.getWidth();

  const logos = await getLogosBase64(invoice);

  // Indigo top bar
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageWidth, 15, "F");

  // Title on the bar
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(title.toUpperCase(), 14, 10);

  // Logos on the left and right
  if (logos.shopLogo) {
    try {
      // width 25mm, height 20mm maintains aspect approx for 100x80px
      doc.addImage(logos.shopLogo, 'PNG', 14, 17, 25, 20, undefined, 'FAST');
    } catch(e) {
      console.error("Failed to add shop logo to PDF:", e);
    }
  }

  if (logos.srmLogo) {
    try {
      doc.addImage(logos.srmLogo, 'PNG', pageWidth - 39, 17, 25, 20, undefined, 'FAST');
    } catch(e) {
      console.error("Failed to add srm logo to PDF:", e);
    }
  }

  // Shop Details below logos (Shifted down by 20mm)
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(14);
  doc.text(shop.name, 14, 45);

  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(\`\${shop.website}  |  \${shop.email}  |  \${shop.phone}\`, 14, 50);

  // Right-aligned Shop Address / Tax
  doc.setFont("helvetica", "bold");
  doc.text("PREMIUM SERVICE CENTER", pageWidth - 14, 45, { align: 'right' });
  doc.setFont("helvetica", "normal");
  doc.text(shop.address, pageWidth - 14, 50, { align: 'right' });
  doc.text(shop.tax, pageWidth - 14, 55, { align: 'right' });

  // Divider Line
  doc.setDrawColor(226, 232, 240); // border-slate-200
  doc.setLineWidth(0.5);
  doc.line(14, 58, pageWidth - 14, 58);
}
`);

// Add offset to all generate*PDF functions that call drawHeader
// We shifted the divider line from 38 to 58 (difference is +20)

function offsetBlock(block) {
    block = block.replace(/doc\.rect\(([^,]+),\s*(\d+),\s*([^,]+),\s*([^,]+),\s*"F"\)/g, (match, x, y, w, h) => `doc.rect(${x}, ${parseInt(y) + 20}, ${w}, ${h}, "F")`);
    block = block.replace(/doc\.text\(([^,]+),\s*([^,]+),\s*(\d+)(,\s*\{[^}]+\})?\)/g, (match, text, x, y, opts) => `doc.text(${text}, ${x}, ${parseInt(y) + 20}${opts || ''})`);
    block = block.replace(/startY:\s*(\d+)/g, (match, y) => `startY: ${parseInt(y) + 20}`);
    return block;
}

// Update generateClientInvoicePDF to pass invoice
content = content.replace(/await drawHeader\(doc, "Client Tax Invoice", user\);/, `await drawHeader(doc, "Client Tax Invoice", user, 'portrait', invoice);`);
// Update generateDeviceInvoicePDF to pass device
content = content.replace(/await drawHeader\(doc, "Device Specification & Valuation", user\);/, `await drawHeader(doc, "Device Specification & Valuation", user, 'portrait', device);`);
// Update generateInventoryAssetPDF to pass asset
content = content.replace(/await drawHeader\(doc, "Inventory Asset Details", user\);/, `await drawHeader(doc, "Inventory Asset Details", user, 'portrait', asset);`);
// Update generateRepairInvoicePDF to pass repair
content = content.replace(/await drawHeader\(doc, "Repair Service Invoice", user\);/, `await drawHeader(doc, "Repair Service Invoice", user, 'portrait', repair);`);

const functionsToOffset = [
    'generateDeviceInvoicePDF',
    'generateDevicesInventoryPDF',
    'generateClientInvoicePDF',
    'generateInventoryAssetPDF',
    'generateInventoryAssetsPDF',
    'generatePOInvoicePDF',
    'generateReportsPDF',
    'generateRepairInvoicePDF'
];

for (const fnName of functionsToOffset) {
    const fnRegex = new RegExp(`(export async function ${fnName}\\([\\s\\S]*?\\) \\{[\\s\\S]*?await drawHeader\\(.*?\\);)([\\s\\S]*?)(drawFooter\\(.*?\\);)`, 'g');
    content = content.replace(fnRegex, (match, prefix, body, suffix) => {
        return prefix + offsetBlock(body) + suffix;
    });
}

fs.writeFileSync(file, content);
console.log('Done!');
