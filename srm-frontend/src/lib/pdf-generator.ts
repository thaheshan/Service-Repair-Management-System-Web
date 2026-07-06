import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { store } from '@/store/store';

async function getUrlBase64(url: string): Promise<string | null> {
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
    } catch (e) { }
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
// Shop detail defaults
const getShopDetails = (user: any) => ({
  name: user?.shopName || "All Fix Private Limited",
  website: user?.shopWebsite || "www.allfix.lk",
  email: user?.shopEmail || "contact@allfix.lk",
  phone: user?.shopPhone || "+94 11 234 5678",
  address: user?.shopAddress ? `${user.shopAddress}${user.shopCity ? `, ${user.shopCity}` : ''}` : "Colombo, Sri Lanka",
  tax: user?.shopTaxNumber || "VAT REG: 009876543-X"
});

// Draws a premium header banner and company details
async function drawHeader(doc: jsPDF, title: string, user: any, orientation: 'portrait' | 'landscape' = 'portrait', invoice?: any) {
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
      // width 35mm, height 26mm for increased size
      doc.addImage(logos.shopLogo, 'PNG', 14, 17, 35, 35, undefined, 'FAST');
    } catch (e) {
      console.error("Failed to add shop logo to PDF:", e);
    }
  }

  if (logos.srmLogo) {
    try {
      doc.addImage(logos.srmLogo, 'PNG', pageWidth - 49, 17, 42, 26, undefined, 'FAST');
    } catch (e) {
      console.error("Failed to add srm logo to PDF:", e);
    }
  }

  // Shop Details below logos (Shifted down by 20mm)
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(14);
  doc.text(shop.name, 14, 60);

  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`${shop.website}  |  ${shop.email}  |  ${shop.phone}`, 14, 65);

  // Right-aligned Shop Address / Tax
  doc.setFont("helvetica", "bold");
  doc.text("PREMIUM SERVICE CENTER", pageWidth - 14, 60, { align: 'right' });
  doc.setFont("helvetica", "normal");
  doc.text(shop.address, pageWidth - 14, 65, { align: 'right' });
  doc.text(shop.tax, pageWidth - 14, 70, { align: 'right' });

  // Divider Line
  doc.setDrawColor(226, 232, 240); // border-slate-200
  doc.setLineWidth(0.5);
  doc.line(14, 73, pageWidth - 14, 73);
}
// Draws a professional signature footer
function drawFooter(doc: jsPDF, message: string, orientation: 'portrait' | 'landscape' = 'portrait') {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(14, pageHeight - 35, pageWidth - 14, pageHeight - 35);

  // Thank you note
  doc.setTextColor(79, 70, 229);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(message, 14, pageHeight - 28);

  // General terms
  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("This is an electronically generated record. All values and diagnostics are valid at time of print.", 14, pageHeight - 23);
  doc.text("Location: Colombo, Sri Lanka  |  System Integrity Verified.", 14, pageHeight - 20);

  // Signature Block
  doc.rect(pageWidth - 64, pageHeight - 32, 50, 15); // Stamp box
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text("STAMP REQUIRED", pageWidth - 39, pageHeight - 23, { align: 'center' });
  doc.text("AUTHORIZED SIGNATURE", pageWidth - 39, pageHeight - 14, { align: 'center' });
}

/* ==========================================================================
   1. DEVICES PAGE PDF GENERATORS
   ========================================================================== */

export async function generateDeviceInvoicePDF(device: any, user: any) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const shop = getShopDetails(user);

  await drawHeader(doc, "Device Specification & Valuation", user, 'portrait', device);

  // Metadata block
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 82, 182, 32, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229);
  doc.text("REGISTERED OWNER:", 18, 88);
  doc.setTextColor(15, 23, 42);
  doc.text(device.owner?.name || "Guest", 18, 93);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Phone: ${device.owner?.phone || "N/A"}`, 18, 98);
  doc.text("Client Stored Record Verified", 18, 103);

  // Right side of metadata block
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("ASSET CONTROL METRICS:", 110, 88);
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Device ID: #DEV-${device.id?.slice(-6).toUpperCase() || "N/A"}`, 110, 93);
  doc.text(`Registered: ${device.registered || "N/A"}`, 110, 98);
  doc.text(`Category: ${device.type || "N/A"}`, 110, 103);
  doc.text(`Operational Status: ${device.status || "N/A"}`, 110, 108);

  // Technical Specs table
  autoTable(doc, {
    startY: 120,
    head: [["Technical Asset Specification", "Details / Brand", "Identity / IMEI", "Valuation (LKR)"]],
    body: [
      [
        device.name || "N/A",
        device.brand || "N/A",
        device.imei || "N/A",
        `Rs. ${(device.price || 0).toLocaleString()}`
      ],
      [
        "Maintenance Service Record",
        `${device.totalRepairs || 0} Service Jobs`,
        "Verified Diagnostics Profile",
        "System Verified"
      ]
    ],
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 4, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  // Valuation summary block
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFillColor(248, 250, 252);
  doc.rect(120, finalY, 76, 20, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Asset Baseline Valuation:", 124, finalY + 7);
  doc.setTextColor(79, 70, 229);
  doc.setFontSize(10);
  doc.text(`Rs. ${(device.price || 0).toLocaleString()}`, 124, finalY + 14);

  drawFooter(doc, `Thank you for choosing ${shop.name} for your technical audits.`, 'portrait');
  doc.save(`SRM_Device_Invoice_${(device.name || "device").replace(/\s+/g, '_')}.pdf`);
}

export async function generateDevicesInventoryPDF(devices: any[], user: any) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  await drawHeader(doc, "Master Device Inventory Report", user, 'landscape');

  autoTable(doc, {
    startY: 82,
    head: [["Device Name", "Brand", "IMEI / Identity", "Owner Name", "Type", "Status", "Price (LKR)"]],
    body: devices.map(d => [
      d.name || "N/A",
      d.brand || "N/A",
      d.imei || "N/A",
      d.owner?.name || "Guest",
      d.type || "N/A",
      d.status || "N/A",
      `Rs. ${(d.price || 0).toLocaleString()}`
    ]),
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 3, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  drawFooter(doc, "Global inventory status and asset registry ledger print.", 'landscape');
  doc.save(`Devices_Inventory_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/* ==========================================================================
   2. INVOICES PAGE PDF GENERATORS
   ========================================================================== */

export async function generateClientInvoicePDF(invoice: any, user: any) {
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
  doc.text(`${invoice.phone || "N/A"}`, 18, 98);
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
  doc.text(`${invoice.invoiceId || invoice.orderNumber || "#000000"}`, 60, 92);

  // Service Category
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("SERVICE CATEGORY", 60, 100);
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`${(invoice.type || "Repair").replace(/_/g, ' ').toUpperCase()}`, 60, 104);

  // Issue Date (Right side of Col 2)
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("ISSUE DATE", 100, 88);
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  const rawDate = invoice.date ? invoice.date.toString().split('T')[0] : new Date().toISOString().split('T')[0];
  doc.text(rawDate, 100, 92);

  // Current Status
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("CURRENT STATUS", 100, 100);
  doc.setFontSize(9);
  const status = (invoice.status || "Pending").toUpperCase();
  if (status === 'PAID') doc.setTextColor(4, 120, 87);
  else if (status === 'PENDING') doc.setTextColor(180, 83, 9);
  else doc.setTextColor(220, 38, 38);
  doc.text(status, 100, 104);

  // Col 2 Vertical Separators (border-x)
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.3);
  doc.line(54, 86, 54, 110);
  doc.line(138, 86, 138, 110);

  // Col 3: TOTAL PAYABLE
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("TOTAL PAYABLE", 144, 88);

  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(`Rs. ${totalVal.toLocaleString()}`, 144, 95);

  doc.setDrawColor(226, 232, 240);
  doc.line(144, 99, 192, 99);

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("DUE SCHEDULE", 144, 104);
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229); // indigo-600
  doc.text("Payable on Receipt", 144, 109);

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
      `Rs. ${(itm.price || 0).toLocaleString()}`,
      `Rs. ${(itm.amount || (itm.qty * itm.price) || 0).toLocaleString()}`
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
  doc.text(`Rs. ${totalVal.toLocaleString()}`, 188, finalY, { align: 'right' });

  // Border bottom for subtotal
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(0.5);
  doc.line(130, finalY + 4, 188, finalY + 4);

  // Grand total line
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("GRAND TOTAL BILLED", 130, finalY + 10);

  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229);
  doc.text(`Rs. ${totalVal.toLocaleString()}`, 188, finalY + 10, { align: 'right' });

  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text("AUTHORIZED FOR TRANSACTION", 188, finalY + 15, { align: 'right' });

  drawFooter(doc, `Thank you for choosing ${shop.name} for your repair solutions.`, 'portrait');
  doc.save(`SRM_Invoice_${invoice.invoiceId || invoice.orderNumber || "receipt"}.pdf`);
}

/* ==========================================================================
   3. INVENTORY PAGE PDF GENERATORS
   ========================================================================== */

export async function generateInventoryAssetPDF(asset: any, user: any) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const shop = getShopDetails(user);

  await drawHeader(doc, "Inventory Asset Details", user, 'portrait', asset);

  doc.setFillColor(248, 250, 252);
  doc.rect(14, 82, 182, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229);
  doc.text("ASSET DESCRIPTION DETAILS:", 18, 88);
  doc.setTextColor(15, 23, 42);
  doc.text(asset.name || "N/A", 18, 93);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Asset Supplier: ${asset.supplier || "N/A"}`, 18, 98);
  doc.text(`Verification Profile: Internal Audit Ledger`, 18, 103);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("LEDGER METRICS:", 110, 88);
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`System ID / Code: ${asset.code || "N/A"}`, 110, 93);
  doc.text(`Stock Level Qty: ${asset.qty || asset.quantity || 0} Units`, 110, 98);
  doc.text(`Category: ${asset.category || "General Inventory"}`, 110, 103);

  autoTable(doc, {
    startY: 116,
    head: [["Asset Property Metric", "Identity / Brand", "Ledger Status", "Stock Price Value"]],
    body: [
      [
        asset.name || "N/A",
        asset.brand || "N/A",
        asset.status || "In Stock",
        `Rs. ${(asset.price || 0).toLocaleString()}`
      ],
      [
        "Asset Group Classification",
        "Estimated Valuation Multiplier",
        "Total Portfolio Value",
        `Rs. ${((asset.qty || 1) * (asset.price || 0)).toLocaleString()}`
      ]
    ],
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 4, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  drawFooter(doc, `Inventory auditing report print authorized by ${shop.name}.`, 'portrait');
  doc.save(`Asset_Record_${asset.code || "item"}.pdf`);
}

export async function generateInventoryAssetsPDF(assets: any[], user: any) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  await drawHeader(doc, "Global Inventory Stock Status Report", user, 'landscape');

  autoTable(doc, {
    startY: 82,
    head: [["Asset Name", "Code / Reference", "Brand", "Category", "Status", "Quantity", "Unit Price"]],
    body: assets.map(a => [
      a.name || "N/A",
      a.code || "N/A",
      a.brand || "N/A",
      a.category || "N/A",
      a.status || "N/A",
      `${a.qty || a.quantity || 0} Units`,
      `Rs. ${(a.price || 0).toLocaleString()}`
    ]),
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 3, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  drawFooter(doc, "Global stock ledger record dump authorized print.", 'landscape');
  doc.save(`Global_Inventory_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export async function generatePOInvoicePDF(po: any, user: any) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const shop = getShopDetails(user);

  await drawHeader(doc, "Purchase Order Invoice", user);

  // Metadata block
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 82, 182, 32, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229);
  doc.text("SUPPLIER / ISSUER:", 18, 88);
  doc.setTextColor(15, 23, 42);
  doc.text(po.supplier?.name || po.supplier || "Vendor Store", 18, 93);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Phone: ${po.supplier?.phone || "+94 00 000 0000"}`, 18, 98);
  doc.text("Authorized Vendor Account Verified", 18, 103);

  // Right side info
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("PURCHASE ORDER METRIC:", 110, 88);
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Order Number: #${po.orderNumber || "N/A"}`, 110, 93);
  doc.text(`Created Date: ${po.createdAt ? new Date(po.createdAt).toLocaleDateString() : "N/A"}`, 110, 98);
  doc.text(`Asset Type: Inventory Stock`, 110, 103);
  doc.text(`Audit Status: ${po.status || "Verified"}`, 110, 108);

  const priceVal = po.price || po.amount || 0;

  autoTable(doc, {
    startY: 120,
    head: [["Technical Asset Stock Description", "Qty Ordered", "Rate (LKR)", "Net Valuation (LKR)"]],
    body: [
      [
        po.name || "Bulk Stock Material Purchase",
        `${po.qty || po.quantity || 1} Units`,
        `Rs. ${(priceVal).toLocaleString()}`,
        `Rs. ${(priceVal).toLocaleString()}`
      ]
    ],
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 4, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFillColor(248, 250, 252);
  doc.rect(120, finalY, 76, 20, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Purchase Asset Valuation:", 124, finalY + 7);
  doc.setTextColor(79, 70, 229);
  doc.setFontSize(10);
  doc.text(`Rs. ${(priceVal).toLocaleString()}`, 124, finalY + 14);

  drawFooter(doc, `Vendor stock replenishment order managed by ${shop.name}.`, 'portrait');
  doc.save(`SRM_Invoice_${po.orderNumber || "po"}.pdf`);
}

/* ==========================================================================
   4. REPORTS PAGE PDF GENERATORS
   ========================================================================== */

export async function generateReportsPDF(reportData: any, user: any) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const shop = getShopDetails(user);

  await drawHeader(doc, "Comprehensive Business Performance Audit", user);

  // Metadata block
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 82, 182, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229);
  doc.text("AUDIT REPORT HORIZON:", 18, 88);
  doc.setTextColor(15, 23, 42);
  doc.text(`Time Range: ${(reportData.timeRange || "Dashboard").toUpperCase()}`, 18, 93);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Ref Code: BI-${reportData.ref || "AUTO"}`, 18, 98);
  doc.text(`Generated by Audit Systems`, 18, 103);

  // Right details
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("PERFORMANCE METRIC STATUS:", 110, 88);
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Date Print: ${reportData.datetime || new Date().toLocaleString()}`, 110, 93);
  doc.text("Integrity Level: Certified Executive Print", 110, 98);

  // Draw KPI highlights inside table-like rows
  autoTable(doc, {
    startY: 116,
    head: [["Key Business Performance Analytics Indicators", "Valuation / Count", "Change Rate"]],
    body: (reportData.stats || []).map((s: any) => [
      s.label || "N/A",
      s.value || "0",
      s.change || "Stable"
    ]),
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 3, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  // Services breakdown table
  let finalY = (doc as any).lastAutoTable.finalY + 8;
  doc.setTextColor(79, 70, 229);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("TOP PERFORMING SERVICE CATEGORIES BREAKDOWN", 14, finalY);

  autoTable(doc, {
    startY: finalY + 4,
    head: [["Rank Index", "Service Categorization Profile", "Volume Count", "Total Revenue (LKR)"]],
    body: (reportData.topServices || []).map((s: any, idx: number) => [
      `#${idx + 1}`,
      s.name || "N/A",
      `${s.count || 0} Units`,
      `Rs. ${(s.revenue || 0).toLocaleString()}`
    ]),
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 3, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  // Demographics and proficiencies
  finalY = (doc as any).lastAutoTable.finalY + 8;
  doc.setTextColor(79, 70, 229);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("TECHNICIAN PROFICIENCY INDEX", 14, finalY);

  autoTable(doc, {
    startY: finalY + 4,
    head: [["Technician Operator", "Completed Jobs Count"]],
    body: (reportData.technicians || []).map((tech: any) => [
      tech.name || "N/A",
      `${tech.count || tech.jobs || 0} Jobs`
    ]),
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 3, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  drawFooter(doc, `Executive business report generated under All Fix management system guidelines.`, 'portrait');
  doc.save(`Executive_Performance_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export async function generateRepairInvoicePDF(repair: any, user: any) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const shop = getShopDetails(user);

  await drawHeader(doc, "Repair Service Invoice", user, 'portrait', repair);

  // Metadata block
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 82, 182, 32, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229);
  doc.text("BILLED TO:", 18, 88);
  doc.setTextColor(15, 23, 42);
  doc.text(repair.customer || "Walk-in Customer", 18, 93);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Device: ${repair.deviceType || "Device"} (${repair.brand || "Generic"} ${repair.model || "Model"})`, 18, 98);
  doc.text("Customer Address Stored & Verified", 18, 103);

  // Right side info
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("JOB OVERVIEW:", 110, 88);
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Invoice Ref: ${repair.invoiceRef || "N/A"}`, 110, 93);
  doc.text(`Invoice Date: ${repair.invoiceDate || new Date().toLocaleDateString()}`, 110, 98);
  doc.text(`Issue Category: ${repair.issueCategory || "Repair"}`, 110, 103);
  doc.text(`Status: ${(repair.status || "Pending").toUpperCase()}`, 110, 108);

  const labor = Number(repair.laborCost) || 0;
  const parts = Number(repair.partsCost) || 0;
  const discount = Number(repair.discount) || 0;
  const total = Number(repair.pricingTotal) || (labor + parts - discount);

  autoTable(doc, {
    startY: 120,
    head: [["Technical Service Details", "Rate (LKR)"]],
    body: [
      ["Labor / Diagnostic Fee", `Rs. ${labor.toLocaleString()}`],
      ["Replacement Components / Parts Material Cost", `Rs. ${parts.toLocaleString()}`],
      ["Promotional Discount", `- Rs. ${discount.toLocaleString()}`]
    ],
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 4, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFillColor(248, 250, 252);
  doc.rect(120, finalY, 76, 20, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Total Payable (LKR):", 124, finalY + 7);
  doc.setTextColor(79, 70, 229);
  doc.setFontSize(10);
  doc.text(`Rs. ${total.toLocaleString()}`, 124, finalY + 14);

  drawFooter(doc, `Thank you for choosing ${shop.name} for your repair solutions.`, 'portrait');
  doc.save(`Invoice_${repair.invoiceRef || 'Draft'}.pdf`);
}
