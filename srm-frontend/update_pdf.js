const fs = require('fs');
const path = require('path');
const file = path.join('c:', 'Users', 'ashan', 'Desktop', 'srmnew', 'Service-Repair-Management-System-Web', 'srm-frontend', 'src', 'lib', 'pdf-generator.ts');

let content = fs.readFileSync(file, 'utf8');

const startIdx = content.indexOf('export async function generateClientInvoicePDF');
const endIdx = content.indexOf('export async function generateInventoryAssetPDF');

if (startIdx !== -1 && endIdx !== -1) {
    const prefix = content.substring(0, startIdx);
    const suffix = content.substring(endIdx); // suffix includes the start of generateInventoryAssetPDF

    const replacement = `export async function generateClientInvoicePDF(invoice: any, user: any) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const shop = getShopDetails(user);

  await drawHeader(doc, "Client Tax Invoice", user, 'portrait', invoice);

  const totalVal = invoice.amount || invoice.total || 0;

  // Metadata block - matching "Logistics & Meta Grid"
  doc.setFillColor(248, 250, 252);
  // Add 20mm offset to the Y coordinate since drawHeader was expanded
  doc.rect(14, 82, 182, 32, "F");

  // Col 1: BILLED TO
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("BILLED TO,", 18, 88);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(invoice.name || "Guest", 18, 93);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(\`\${invoice.phone || "N/A"}\`, 18, 98);
  doc.text("Client Address Stored", 18, 102);
  doc.text("Verification Required", 18, 106);

  // Vertical Separator 1
  doc.setDrawColor(79, 70, 229); // indigo-600 (border-l-2)
  doc.setLineWidth(0.7);
  doc.line(15, 86, 15, 110);

  // Col 2: INVOICE DETAILS
  // Invoice Reference
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("INVOICE REFERENCE", 60, 88);
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(\`\${invoice.invoiceId || invoice.orderNumber || "#000000"}\`, 60, 92);

  // Service Category
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("SERVICE CATEGORY", 60, 100);
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(\`\${(invoice.type || "Repair").replace(/_/g, ' ').toUpperCase()}\`, 60, 104);

  // Issue Date (Right side of Col 2)
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("ISSUE DATE", 104, 88);
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(\`\${invoice.date || new Date().toLocaleDateString()}\`, 104, 92);

  // Current Status
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("CURRENT STATUS", 104, 100);
  doc.setFontSize(9);
  const status = (invoice.status || "Pending").toUpperCase();
  if (status === 'PAID') doc.setTextColor(4, 120, 87);
  else if (status === 'PENDING') doc.setTextColor(180, 83, 9);
  else doc.setTextColor(220, 38, 38);
  doc.text(status, 104, 104);

  // Col 2 Vertical Separators (border-x)
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.3);
  doc.line(54, 86, 54, 110);
  doc.line(140, 86, 140, 110);

  // Col 3: TOTAL PAYABLE
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("TOTAL PAYABLE", 146, 88);
  
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(\`Rs. \${totalVal.toLocaleString()}\`, 146, 95);

  doc.setDrawColor(226, 232, 240);
  doc.line(146, 99, 192, 99);

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("DUE SCHEDULE", 146, 104);
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229); // indigo-600
  doc.text("Payable on Receipt", 146, 109);

  // Determine items list
  const items = invoice.items || [
    { description: "Advanced Technical Service Labor", qty: 1, price: totalVal * 0.4, amount: totalVal * 0.4 },
    { description: "OEM Grade Replacement Component Parts", qty: 1, price: totalVal * 0.6, amount: totalVal * 0.6 }
  ];

  autoTable(doc, {
    startY: 120,
    head: [["Transactional Detail", "Unit Qty", "Rate (LKR)", "Subtotal"]],
    body: items.map((itm: any) => [
      itm.description || itm.name || "Technical Service",
      itm.qty || itm.quantity || 1,
      \`Rs. \${(itm.price || 0).toLocaleString()}\`,
      \`Rs. \${(itm.amount || (itm.qty * itm.price) || 0).toLocaleString()}\`
    ]),
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 4, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 12;

  // Financial Totals block (mimicking the frontend)
  // Subtotal line
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("Subtotal", 130, finalY);
  doc.setTextColor(15, 23, 42);
  doc.text(\`Rs. \${totalVal.toLocaleString()}\`, 188, finalY, { align: 'right' });

  // Border bottom for subtotal
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(0.5);
  doc.line(130, finalY + 4, 188, finalY + 4);

  // Grand total line
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("GRAND TOTAL BILLED", 130, finalY + 11);
  
  doc.setFontSize(14);
  doc.setTextColor(79, 70, 229);
  doc.text(\`Rs. \${totalVal.toLocaleString()}\`, 188, finalY + 11, { align: 'right' });

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("AUTHORIZED FOR TRANSACTION", 188, finalY + 15, { align: 'right' });

  drawFooter(doc, \`Thank you for choosing \${shop.name} for your repair solutions.\`, 'portrait');
  doc.save(\`SRM_Invoice_\${invoice.invoiceId || invoice.orderNumber || "receipt"}.pdf\`);
}

/* ==========================================================================
   3. INVENTORY PAGE PDF GENERATORS
   ========================================================================== */

`;

    content = prefix + replacement + suffix;
    fs.writeFileSync(file, content);
    console.log("Successfully replaced generateClientInvoicePDF.");
} else {
    console.log("Failed to find startIdx or endIdx.");
}
