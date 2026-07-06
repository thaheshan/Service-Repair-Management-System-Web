const fs = require('fs');
const path = require('path');
const file = path.join('c:', 'Users', 'ashan', 'Desktop', 'srmnew', 'Service-Repair-Management-System-Web', 'srm-frontend', 'src', 'lib', 'pdf-generator.ts');

let content = fs.readFileSync(file, 'utf8');

// 1. Shift the shop details in drawHeader by 15mm
content = content.replace(/doc\.text\(shop\.name,\s*14,\s*45\);/, 'doc.text(shop.name, 14, 60);');
content = content.replace(/doc\.text\(\`\\\$\\{shop\.website\\}\s*\|\s*\\\$\\{shop\.email\\}\s*\|\s*\\\$\\{shop\.phone\\}\`,\s*14,\s*50\);/, 'doc.text(`${shop.website}  |  ${shop.email}  |  ${shop.phone}`, 14, 65);');
content = content.replace(/doc\.text\("PREMIUM SERVICE CENTER",\s*pageWidth\s*-\s*14,\s*45/, 'doc.text("PREMIUM SERVICE CENTER", pageWidth - 14, 60');
content = content.replace(/doc\.text\(shop\.address,\s*pageWidth\s*-\s*14,\s*50/, 'doc.text(shop.address, pageWidth - 14, 65');
content = content.replace(/doc\.text\(shop\.tax,\s*pageWidth\s*-\s*14,\s*55/, 'doc.text(shop.tax, pageWidth - 14, 70');
content = content.replace(/doc\.line\(14,\s*58,\s*pageWidth\s*-\s*14,\s*58\);/, 'doc.line(14, 73, pageWidth - 14, 73);');

// 2. We need to shift everything else by 20mm so they don't overlap with the new 73mm divider.
// My generateClientInvoicePDF is already shifted to 82, so I will skip it.
// The other functions are at 62. I'll shift them by 20mm to be at 82.

const functionsToOffset = [
    'generateDeviceInvoicePDF',
    'generateDevicesInventoryPDF',
    'generateInventoryAssetPDF',
    'generateInventoryAssetsPDF',
    'generatePOInvoicePDF',
    'generateReportsPDF',
    'generateRepairInvoicePDF'
];

function offsetBlock(block) {
    block = block.replace(/doc\.rect\(([^,]+),\s*(\d+),\s*([^,]+),\s*([^,]+),\s*"F"\)/g, (match, x, y, w, h) => `doc.rect(${x}, ${parseInt(y) + 20}, ${w}, ${h}, "F")`);
    block = block.replace(/doc\.text\(([^,]+),\s*([^,]+),\s*(\d+)(,\s*\{[^}]+\})?\)/g, (match, text, x, y, opts) => `doc.text(${text}, ${x}, ${parseInt(y) + 20}${opts || ''})`);
    block = block.replace(/startY:\s*(\d+)/g, (match, y) => `startY: ${parseInt(y) + 20}`);
    return block;
}

for (const fnName of functionsToOffset) {
    const fnRegex = new RegExp(`(export async function ${fnName}\\([\\s\\S]*?\\) \\{[\\s\\S]*?await drawHeader\\(.*?\\);)([\\s\\S]*?)(drawFooter\\(.*?\\);)`, 'g');
    content = content.replace(fnRegex, (match, prefix, body, suffix) => {
        return prefix + offsetBlock(body) + suffix;
    });
}

fs.writeFileSync(file, content);
console.log('Done shifting!');
