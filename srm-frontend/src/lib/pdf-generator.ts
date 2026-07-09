import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { store } from '@/store/store';

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
async function drawHeader(doc: jsPDF, title: string, user: any, orientation: 'portrait' | 'landscape' = 'portrait') {
  const shop = getShopDetails(user);
  const pageWidth = doc.internal.pageSize.getWidth();

  const logoBase64 = await getLogoBase64();

  // Indigo top bar
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageWidth, 15, "F");

  // Title on the bar
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(title.toUpperCase(), 14, 10);

  // Logo & Shop Details below bar
  let startX = 14;
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 14, 17, 15, 15);
      startX = 33;
    } catch(e) {
      console.error("Failed to add logo to PDF:", e);
    }
  }

  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(14);
  doc.text(shop.name, startX, 25);

  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`${shop.website}  |  ${shop.email}  |  ${shop.phone}`, startX, 30);

  // Right-aligned Shop Address / Tax
  doc.setFont("helvetica", "bold");
  doc.text("PREMIUM SERVICE CENTER", pageWidth - 14, 25, { align: 'right' });
  doc.setFont("helvetica", "normal");
  doc.text(shop.address, pageWidth - 14, 30, { align: 'right' });
  doc.text(shop.tax, pageWidth - 14, 35, { align: 'right' });

  // Divider Line
  doc.setDrawColor(226, 232, 240); // border-slate-200
  doc.setLineWidth(0.5);
  doc.line(14, 38, pageWidth - 14, 38);
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

  await drawHeader(doc, "Device Specification & Valuation", user);

  // Metadata block
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 42, 182, 32, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229);
  doc.text("REGISTERED OWNER:", 18, 48);
  doc.setTextColor(15, 23, 42);
  doc.text(device.owner?.name || "Guest", 18, 53);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Phone: ${device.owner?.phone || "N/A"}`, 18, 58);
  doc.text("Client Stored Record Verified", 18, 63);

  // Right side of metadata block
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("ASSET CONTROL METRICS:", 110, 48);
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Device ID: #DEV-${device.id?.slice(-6).toUpperCase() || "N/A"}`, 110, 53);
  doc.text(`Registered: ${device.registered || "N/A"}`, 110, 58);
  doc.text(`Category: ${device.type || "N/A"}`, 110, 63);
  doc.text(`Operational Status: ${device.status || "N/A"}`, 110, 68);

  // Technical Specs table
  autoTable(doc, {
    startY: 80,
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


  // Device Proof Photo Section
  if (device.photoUrl) {
    try {
      const photoYStart = finalY + 28;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(79, 70, 229);
      doc.text("DEVICE PROOF PHOTO:", 14, photoYStart);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(14, photoYStart + 2, 196, photoYStart + 2);

      const imgRes = await fetch(device.photoUrl);
      const imgBlob = await imgRes.blob();
      const imgBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imgBlob);
      });
      const ext = device.photoUrl.split('.').pop()?.toLowerCase() || 'jpeg';
      const imgFormat = ext === 'png' ? 'PNG' : 'JPEG';
      doc.addImage(imgBase64, imgFormat, 14, photoYStart + 6, 60, 45);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Device Photo — ${device.name || 'Asset'}`, 14, photoYStart + 55);
    } catch (e) {
      console.error("Could not embed device photo in PDF:", e);
    }
  }

  drawFooter(doc, `Thank you for choosing ${shop.name} for your technical audits.`, 'portrait');
  doc.save(`SRM_Device_Invoice_${(device.name || "device").replace(/\s+/g, '_')}.pdf`);
}

export async function generateDevicesInventoryPDF(devices: any[], user: any) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  await drawHeader(doc, "Master Device Inventory Report", user, 'landscape');

  autoTable(doc, {
    startY: 42,
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

  await drawHeader(doc, "Client Tax Invoice", user);

  // Metadata block
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 42, 182, 32, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229);
  doc.text("BILLED TO:", 18, 48);
  doc.setTextColor(15, 23, 42);
  doc.text(invoice.name || "Guest", 18, 53);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Phone: ${invoice.phone || "N/A"}`, 18, 58);
  doc.text("Customer Address Stored & Verified", 18, 63);

  // Right side info
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("INVOICE SUMMARY:", 110, 48);
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Reference: ${invoice.invoiceId || invoice.orderNumber || "N/A"}`, 110, 53);
  doc.text(`Issue Date: ${invoice.date || new Date().toLocaleDateString()}`, 110, 58);
  doc.text(`Service Category: ${(invoice.type || "Repair").replace(/_/g, ' ')}`, 110, 63);
  doc.text(`Status: ${(invoice.status || "Pending").toUpperCase()}`, 110, 68);

  // Determine items list
  const totalVal = invoice.amount || invoice.total || 0;
  const advance = Number(invoice.advancePayment) || 0;
  const remaining = Math.max(0, totalVal - advance);

  const laborVal = invoice.laborCost !== undefined ? invoice.laborCost : totalVal * 0.4;
  const partsVal = invoice.partsCost !== undefined ? invoice.partsCost : totalVal * 0.6;

  const items = invoice.items || [
    { description: "Advanced Technical Service Labor", qty: 1, price: laborVal, amount: laborVal },
    { description: "OEM Grade Replacement Component Parts", qty: 1, price: partsVal, amount: partsVal }
  ];

  autoTable(doc, {
    startY: 80,
    head: [["Transactional Item Details", "Qty", "Rate (LKR)", "Subtotal (LKR)"]],
    body: items.map((itm: any) => [
      itm.description || itm.name || "Technical Service",
      itm.qty || itm.quantity || 1,
      `Rs. ${(itm.price || 0).toLocaleString()}`,
      `Rs. ${(itm.amount || (itm.qty * itm.price) || 0).toLocaleString()}`
    ]),
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 4, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFillColor(248, 250, 252);
  doc.rect(120, finalY, 76, advance > 0 ? 32 : 26, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal Net:", 124, finalY + 7);
  doc.text("Tax Valuation (VAT 0.0%):", 124, finalY + 13);
  
  if (advance > 0) {
    doc.text("Advance Payment:", 124, finalY + 19);
    doc.setFont("helvetica", "bold");
    doc.text("Total Payable (LKR):", 124, finalY + 26);
  } else {
    doc.setFont("helvetica", "bold");
    doc.text("Total Payable (LKR):", 124, finalY + 20);
  }

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "normal");
  doc.text(`Rs. ${totalVal.toLocaleString()}`, 188, finalY + 7, { align: 'right' });
  doc.text("Rs. 0", 188, finalY + 13, { align: 'right' });
  
  if (advance > 0) {
    doc.text(`- Rs. ${advance.toLocaleString()}`, 188, finalY + 19, { align: 'right' });
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`Rs. ${remaining.toLocaleString()}`, 188, finalY + 26, { align: 'right' });
  } else {
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`Rs. ${totalVal.toLocaleString()}`, 188, finalY + 20, { align: 'right' });
  }

  drawFooter(doc, `Thank you for choosing ${shop.name} for your repair solutions.`, 'portrait');
  doc.save(`SRM_Invoice_${invoice.invoiceId || invoice.orderNumber || "receipt"}.pdf`);
}

/* ==========================================================================
   3. INVENTORY PAGE PDF GENERATORS
   ========================================================================== */

export async function generateInventoryAssetPDF(asset: any, user: any) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const shop = getShopDetails(user);

  await drawHeader(doc, "Inventory Asset Details", user);

  doc.setFillColor(248, 250, 252);
  doc.rect(14, 42, 182, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229);
  doc.text("ASSET DESCRIPTION DETAILS:", 18, 48);
  doc.setTextColor(15, 23, 42);
  doc.text(asset.name || "N/A", 18, 53);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Asset Supplier: ${asset.supplier || "N/A"}`, 18, 58);
  doc.text(`Verification Profile: Internal Audit Ledger`, 18, 63);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("LEDGER METRICS:", 110, 48);
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`System ID / Code: ${asset.code || "N/A"}`, 110, 53);
  doc.text(`Stock Level Qty: ${asset.qty || asset.quantity || 0} Units`, 110, 58);
  doc.text(`Category: ${asset.category || "General Inventory"}`, 110, 63);

  autoTable(doc, {
    startY: 76,
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
    startY: 42,
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
  doc.rect(14, 42, 182, 32, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229);
  doc.text("SUPPLIER / ISSUER:", 18, 48);
  doc.setTextColor(15, 23, 42);
  doc.text(po.supplier?.name || po.supplier || "Vendor Store", 18, 53);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Phone: ${po.supplier?.phone || "+94 00 000 0000"}`, 18, 58);
  doc.text("Authorized Vendor Account Verified", 18, 63);

  // Right side info
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("PURCHASE ORDER METRIC:", 110, 48);
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Order Number: #${po.orderNumber || "N/A"}`, 110, 53);
  doc.text(`Created Date: ${po.createdAt ? new Date(po.createdAt).toLocaleDateString() : "N/A"}`, 110, 58);
  doc.text(`Asset Type: Inventory Stock`, 110, 63);
  doc.text(`Audit Status: ${po.status || "Verified"}`, 110, 68);

  const priceVal = po.price || po.amount || 0;

  autoTable(doc, {
    startY: 80,
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
  doc.rect(14, 42, 182, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229);
  doc.text("AUDIT REPORT HORIZON:", 18, 48);
  doc.setTextColor(15, 23, 42);
  doc.text(`Time Range: ${(reportData.timeRange || "Dashboard").toUpperCase()}`, 18, 53);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Ref Code: BI-${reportData.ref || "AUTO"}`, 18, 58);
  doc.text(`Generated by Audit Systems`, 18, 63);

  // Right details
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("PERFORMANCE METRIC STATUS:", 110, 48);
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Date Print: ${reportData.datetime || new Date().toLocaleString()}`, 110, 53);
  doc.text("Integrity Level: Certified Executive Print", 110, 58);

  // Draw KPI highlights inside table-like rows
  autoTable(doc, {
    startY: 76,
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

  await drawHeader(doc, "Repair Service Invoice", user);

  // Metadata block
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 42, 182, 32, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(79, 70, 229);
  doc.text("BILLED TO:", 18, 48);
  doc.setTextColor(15, 23, 42);
  const customerName = typeof repair.customer === 'string'
    ? repair.customer
    : (repair.customer?.name || "Walk-in Customer");
  doc.text(customerName, 18, 53);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  // Retrieve device details dynamically if nested
  const deviceBrand = repair.brand || repair.device?.brand || "Generic";
  const deviceModel = repair.model || repair.device?.model || "Model";
  const deviceTypeName = repair.deviceType || repair.device?.type || "Device";
  doc.text(`Device: ${deviceTypeName} (${deviceBrand} ${deviceModel})`, 18, 58);
  doc.text("Customer Address Stored & Verified", 18, 63);

  // Right side info
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text("JOB OVERVIEW:", 110, 48);
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Invoice Ref: ${repair.reference || repair.invoiceRef || "N/A"}`, 110, 53);
  doc.text(`Invoice Date: ${repair.createdAt ? new Date(repair.createdAt).toLocaleDateString() : (repair.invoiceDate || new Date().toLocaleDateString())}`, 110, 58);
  doc.text(`Issue Category: ${repair.issue || repair.issueCategory || "Repair"}`, 110, 63);
  doc.text(`Status: ${(repair.status || "Pending").toUpperCase()}`, 110, 68);

  const total = Number(repair.finalCost || repair.estimatedCost || repair.pricingTotal) || 0;
  const parts = Number(repair.partsCost) || (repair.repairPartsUsed || []).reduce((sum: number, p: any) => sum + (Number(p.unitPrice || p.totalPrice) * Number(p.quantityUsed || 1)), 0);
  const discount = Number(repair.discount) || 0;
  const labor = Number(repair.laborCost) || Math.max(0, total - parts + discount);
  const advance = Number(repair.advancePayment) || 0;
  const remaining = Math.max(0, total - advance);

  const tableBody = [
    ["Labor / Diagnostic Fee", `Rs. ${labor.toLocaleString()}`],
    ["Replacement Components / Parts Material Cost", `Rs. ${parts.toLocaleString()}`],
    ["Promotional Discount", `- Rs. ${discount.toLocaleString()}`]
  ];

  if (advance > 0) {
    tableBody.push(["Advance Payment / Deposit Stored", `- Rs. ${advance.toLocaleString()}`]);
  }

  autoTable(doc, {
    startY: 80,
    head: [["Technical Service Details", "Rate (LKR)"]],
    body: tableBody,
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 4, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFillColor(248, 250, 252);
  doc.rect(120, finalY, 76, 25, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Total Cost:", 124, finalY + 6);
  doc.text(`Rs. ${total.toLocaleString()}`, 190, finalY + 6, { align: 'right' });

  if (advance > 0) {
    doc.text("Advance Payment:", 124, finalY + 12);
    doc.text(`- Rs. ${advance.toLocaleString()}`, 190, finalY + 12, { align: 'right' });
  }

  doc.setTextColor(79, 70, 229);
  doc.setFontSize(9);
  doc.text(advance > 0 ? "Remaining Balance Due:" : "Total Payable (LKR):", 124, finalY + 19);
  doc.text(`Rs. ${remaining.toLocaleString()}`, 190, finalY + 19, { align: 'right' });

  // Proof Photos Section - handle both raw URL strings and API photo objects {url: string}
  const rawPhotos = repair.photos || repair.uploadedPhotos || [];
  const proofPhotos: string[] = rawPhotos.map((p: any) => (typeof p === 'string' ? p : p.url)).filter(Boolean);
  if (proofPhotos.length > 0) {
    const photosY = finalY + 34;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(79, 70, 229);
    doc.text("DEVICE PROOF PHOTOS:", 14, photosY);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(14, photosY + 2, 196, photosY + 2);

    let photoX = 14;
    const photoWidth = 55;
    const photoHeight = 42;
    const photoGap = 6;
    let addedCount = 0;
    for (const url of proofPhotos.slice(0, 3)) {
      try {
        const imgRes = await fetch(url);
        const imgBlob = await imgRes.blob();
        const imgBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imgBlob);
        });
        const ext = url.split('.').pop()?.toLowerCase() || 'jpeg';
        const imgFormat = ext === 'png' ? 'PNG' : 'JPEG';
        doc.addImage(imgBase64, imgFormat, photoX, photosY + 6, photoWidth, photoHeight);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`Photo ${addedCount + 1}`, photoX, photosY + photoHeight + 10);
        photoX += photoWidth + photoGap;
        addedCount++;
      } catch(e) { console.error("Could not embed proof photo:", e); }
    }
  }

  drawFooter(doc, `Thank you for choosing ${shop.name} for your repair solutions.`, 'portrait');
  doc.save(`Invoice_${repair.invoiceRef || 'Draft'}.pdf`);
}
