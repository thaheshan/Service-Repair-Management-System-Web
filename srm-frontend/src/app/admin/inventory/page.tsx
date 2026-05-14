"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { toast } from "sonner"
import Link from "next/link"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"

import {
  Search,
  Filter,
  Plus,
  Package,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  Download,
  Upload,
  Printer,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Search as SearchIcon,
  LayoutGrid,
  List as ListIcon,
  ChevronDown,
  MapPin,
  X,
  Check,
  RefreshCw,
  Eye,
  Trash2,
  AlertCircle,
  Smartphone,
  Tag,
  FileDown,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"

const stockTrendDataMap: Record<string, { label: string, value: number }[]> = {
  "Last 7 days": [
    { label: "Mon", value: 2.75 }, { label: "Tue", value: 2.78 }, { label: "Wed", value: 2.80 }, 
    { label: "Thu", value: 2.82 }, { label: "Fri", value: 2.85 }, { label: "Sat", value: 2.84 }, { label: "Sun", value: 2.88 }
  ],
  "Last 28 days": [
    { label: "W1", value: 2.5 }, { label: "W2", value: 2.65 }, { label: "W3", value: 2.72 }, { label: "W4", value: 2.88 }
  ],
  "Last 30 days": [
    { label: "Day 1", value: 2.45 }, { label: "Day 10", value: 2.58 }, { label: "Day 20", value: 2.70 }, { label: "Day 30", value: 2.88 }
  ],
  "Last 90 days": [
    { label: "Month 1", value: 2.2 }, { label: "Month 2", value: 2.5 }, { label: "Month 3", value: 2.88 }
  ],
  "Last 6 months": [
    { label: "Jan", value: 2.1 }, { label: "Feb", value: 2.3 }, { label: "Mar", value: 2.2 }, 
    { label: "Apr", value: 2.5 }, { label: "May", value: 2.6 }, { label: "Jun", value: 2.8 }
  ]
}

import { 
  useGetInventoryItemsQuery, 
  useCreateInventoryItemMutation, 
  useUpdateInventoryItemMutation, 
  useDeleteInventoryItemMutation,
  useGetInventoryUsageQuery,
  useGetInventorySummaryQuery,
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useGetPurchaseOrdersQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderStatusMutation,
  useUpdatePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
} from "@/services/api/inventoryApiSlice"

export default function InventoryManagementPage() {
  const { t } = useTranslation();
  const { data: response, isLoading } = useGetInventoryItemsQuery({});
  const { data: usageResponse, isLoading: usageLoading } = useGetInventoryUsageQuery({});
  const { data: summaryResponse } = useGetInventorySummaryQuery({});
  const { data: suppliersResponse } = useGetSuppliersQuery({});
  const { data: posResponse } = useGetPurchaseOrdersQuery({});
  
  const { user } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const [createInventoryItem] = useCreateInventoryItemMutation();
  const [updateInventoryItem] = useUpdateInventoryItemMutation();
  const [deleteInventoryItem] = useDeleteInventoryItemMutation();

  const [createSupplier] = useCreateSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();
  const [createPurchaseOrder] = useCreatePurchaseOrderMutation();
  const [updatePOStatus] = useUpdatePurchaseOrderStatusMutation();
  const [updatePurchaseOrder] = useUpdatePurchaseOrderMutation();
  const [deletePurchaseOrder] = useDeletePurchaseOrderMutation();

  const invSummary = summaryResponse?.summary;
  const suppliers = suppliersResponse?.suppliers || [];
  const purchaseOrders = posResponse?.purchaseOrders || [];

  const [activeTab, setActiveTab] = useState<"inventory" | "suppliers" | "pos">("inventory")
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false)
  const [isRequestStockOpen, setIsRequestStockOpen] = useState(false)

  const [supplierForm, setSupplierForm] = useState({
    name: "", contactName: "", email: "", phone: "", address: "", category: "Parts"
  });

  const [poDraftForm, setPoDraftForm] = useState({
    supplierId: "",
    orderNumber: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
    notes: "",
    items: [{ partId: "", partName: "", quantity: 1, unitCost: 0, sku: "" }]
  });

  const fastMovingItemsData = useMemo(() => {
    if (!usageResponse?.usageReport) return [];
    const report = usageResponse.usageReport;
    return report.map((r: any) => ({
      name: r.partName,
      count: r.totalQuantityUsed
    })).sort((a: any, b: any) => b.count - a.count).slice(0, 10);
  }, [usageResponse]);

  const inventoryState = useMemo(() => {
    const apiItems = response?.items || [];
    return apiItems.map((item: any) => ({
      id: item.id,
      code: item.partNumber || item.sku || `ITM-${item.id?.substring(0, 4).toUpperCase() || 'NEW'}`,
      name: item.partName || item.name || "Unnamed Item",
      brand: (item.compatibleBrands && item.compatibleBrands[0]) || item.brand || "Generic",
      category: item.category || "Parts",
      stock: item.quantityInStock ?? item.stockQuantity ?? 0,
      maxStock: (item.minimumStockLevel || 5) * 5,
      price: item.sellingPrice || item.price || 0,
      costPrice: item.unitCost || 0,
      supplier: item.supplierName || item.supplier || "Main Supplier",
      location: item.location || "Store",
      status: (item.quantityInStock ?? item.stockQuantity ?? 0) === 0 ? "Out of Stock" : (item.quantityInStock ?? item.stockQuantity ?? 0) <= (item.minimumStockLevel || 5) ? "Low Stock" : "In Stock"
    }));
  }, [response]);

  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState(mounted ? t('inventoryPage.categories.all') : "All Categories")
  const [filterStatus, setFilterStatus] = useState(mounted ? t('inventoryPage.statuses.all') : "All Status")
  const [filterSupplier, setFilterSupplier] = useState("All Suppliers")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    if (mounted) {
      setFilterCategory(t('inventoryPage.categories.all'))
      setFilterStatus(t('inventoryPage.statuses.all'))
    }
  }, [mounted, t])

  // Chart Time Range State
  const [chartTimeRange, setChartTimeRange] = useState("Last 6 months")

  // Master Modals State
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [viewPOTarget, setViewPOTarget] = useState<any | null>(null)
  const [editItemTarget, setEditItemTarget] = useState<any | null>(null)
  const [viewDetailsTarget, setViewDetailsTarget] = useState<any | null>(null)
  const [deleteFormTarget, setDeleteFormTarget] = useState<any | null>(null)
  const [viewInvoiceTarget, setViewInvoiceTarget] = useState<any | null>(null)
  const [isGeneratingInvoicePdf, setIsGeneratingInvoicePdf] = useState(false)
  const invoicePdfRef = useRef<HTMLDivElement>(null)

  // Interaction States
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isPOOpen, setIsPOOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [activeSupplierMenuId, setActiveSupplierMenuId] = useState<string | null>(null)
  const [activePOMenuId, setActivePOMenuId] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  
  const [editSupplierTarget, setEditSupplierTarget] = useState<any | null>(null);
  const [deleteSupplierTarget, setDeleteSupplierTarget] = useState<any | null>(null);
  const [editPOTarget, setEditPOTarget] = useState<any | null>(null);
  const [deletePOTarget, setDeletePOTarget] = useState<any | null>(null);

  // Forms
  const [addItemForm, setAddItemForm] = useState({
    name: "", sku: "", brand: "Apple", category: "Screens", price: 0, costPrice: 0, stockQuantity: 0, supplier: "Tech Supplies Inc"
  });

  const [adjustStockForm, setAdjustStockForm] = useState({
    itemCode: "",
    action: "set",
    adjustmentValue: 0
  });

  useEffect(() => {
    if (isAdjustStockOpen && inventoryState.length > 0 && !adjustStockForm.itemCode) {
      setAdjustStockForm(p => ({ ...p, itemCode: inventoryState[0].code }));
    }
  }, [isAdjustStockOpen, inventoryState, adjustStockForm.itemCode]);

  const handleAddItem = async () => {
    if (!addItemForm.name) {
      toast.error("Item name is required.");
      return;
    }
    
    if (!user || !user.shopId) {
      toast.error("Session invalid. Please log in again.");
      console.error("Inventory Session Check Failed:", { user });
      return;
    }

    try {
      console.log("Adding inventory item with correct field mapping...");
      await createInventoryItem({
        partName: addItemForm.name,
        partNumber: addItemForm.sku,
        category: addItemForm.category,
        compatibleBrands: [addItemForm.brand],
        compatibleModels: [],
        supplierName: addItemForm.supplier,
        quantityInStock: Number(addItemForm.stockQuantity),
        minimumStockLevel: 5,
        unitCost: Number(addItemForm.costPrice),
        sellingPrice: Number(addItemForm.price),
      }).unwrap();
      
      toast.success("Item added successfully!");
      setIsAddItemOpen(false);
      setAddItemForm({ name: "", sku: "", brand: "Apple", category: "Screens", price: 0, costPrice: 0, stockQuantity: 0, supplier: "Tech Supplies Inc" });
    } catch(err: any) {
      console.error("Failed to add inventory item:", err);
      const msg = err.data?.message || err.data?.error || err.message || "Failed to add item";
      toast.error(`Error: ${msg}`);
    }
  };

  const handleUpdateItem = async () => {
    if (!editItemTarget) return;
    try {
      await updateInventoryItem({
        id: editItemTarget.id,
        partName: editItemTarget.name,
        category: editItemTarget.category,
        supplierName: editItemTarget.supplier,
        sellingPrice: Number(editItemTarget.price),
        unitCost: Number(editItemTarget.costPrice),
        // location: editItemTarget.location // Not currently supported in backend schema
      }).unwrap();
      setEditItemTarget(null);
      toast.success("Item updated successfully!");
    } catch(err) {
      console.error("Failed to update inventory item", err);
      toast.error("Failed to update item record.");
    }
  };
  
  const handleAdjustStock = async () => {
    const item = inventoryState.find(i => i.code === adjustStockForm.itemCode);
    if (!item) {
      toast.error("Please select a valid item.");
      return;
    }

    let newQuantity = Number(adjustStockForm.adjustmentValue);
    if (adjustStockForm.action === "add") {
      newQuantity = item.stock + Number(adjustStockForm.adjustmentValue);
    } else if (adjustStockForm.action === "subtract") {
      newQuantity = item.stock - Number(adjustStockForm.adjustmentValue);
    }

    if (newQuantity < 0) {
      toast.error("Stock quantity cannot be negative.");
      return;
    }

    try {
      await updateInventoryItem({
        id: item.id,
        quantityInStock: newQuantity
      }).unwrap();
      
      toast.success(`Stock adjusted successfully! New balance: ${newQuantity}`);
      setIsAdjustStockOpen(false);
      setAdjustStockForm({ itemCode: "", action: "set", adjustmentValue: 0 });
    } catch (err: any) {
      console.error("Failed to adjust stock:", err);
      toast.error("Failed to update stock ledger.");
    }
  };

  const handleAddSupplier = async () => {
    if (!supplierForm.name) {
      toast.error("Supplier name is required.");
      return;
    }
    try {
      await createSupplier(supplierForm).unwrap();
      toast.success("Supplier registered successfully!");
      setIsAddSupplierOpen(false);
      setSupplierForm({ name: "", contactName: "", email: "", phone: "", address: "", category: "Parts" });
    } catch (err: any) {
      console.error("Failed to add supplier:", err);
      toast.error("Failed to register supplier.");
    }
  };

  const handleEditSupplier = async () => {
    if (!editSupplierTarget || !editSupplierTarget.name) {
      toast.error("Supplier name is required.");
      return;
    }
    try {
      await updateSupplier({
        id: editSupplierTarget.id,
        name: editSupplierTarget.name,
        contactName: editSupplierTarget.contactName,
        email: editSupplierTarget.email,
        phone: editSupplierTarget.phone,
        address: editSupplierTarget.address,
        category: editSupplierTarget.category
      }).unwrap();
      toast.success("Supplier details updated successfully!");
      setEditSupplierTarget(null);
    } catch (err: any) {
      console.error("Failed to update supplier:", err);
      toast.error("Failed to update supplier records.");
    }
  };

  const handleDeleteSupplier = async () => {
    if (!deleteSupplierTarget) return;
    try {
      await deleteSupplier(deleteSupplierTarget.id).unwrap();
      toast.success("Supplier removed from directory.");
      setDeleteSupplierTarget(null);
    } catch (err: any) {
      console.error("Failed to delete supplier:", err);
      toast.error("Failed to delete supplier. Ensure no active orders exist.");
    }
  };

  const handleCreatePO = async () => {
    if (!poDraftForm.supplierId) {
      toast.error("Please select a supplier.");
      return;
    }
    try {
      await createPurchaseOrder(poDraftForm).unwrap();
      toast.success("Purchase order submitted!");
      setIsRequestStockOpen(false);
      setPoDraftForm({
        supplierId: "",
        orderNumber: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: "",
        items: [{ partId: "", partName: "", quantity: 1, unitCost: 0, sku: "" }]
      });
    } catch (err: any) {
      console.error("Failed to create PO:", err);
      toast.error("Failed to submit purchase order.");
    }
  };

  const handleReceivePO = async (id: string) => {
    try {
      await updatePOStatus({ id, status: "RECEIVED" }).unwrap();
      toast.success("Order marked as RECEIVED. Inventory stock updated!");
    } catch (err: any) {
      console.error("Failed to receive PO:", err);
      toast.error("Failed to update order status.");
    }
  };

  const handleDeletePO = async () => {
    if (!deletePOTarget) return;
    try {
      await deletePurchaseOrder(deletePOTarget.id).unwrap();
      toast.success("Purchase order removed successfully.");
      setDeletePOTarget(null);
    } catch (err: any) {
      console.error("Failed to delete PO:", {
        id: deletePOTarget.id,
        error: err,
        data: err.data,
        status: err.status
      });
      const errorMsg = err.data?.message || err.data?.error || "Ensure it's not already processed.";
      toast.error(`Failed to delete order: ${errorMsg}`);
    }
  };

  // PO Drafting State
  // PO Drafting State
  const [poItems, setPoItems] = useState([{ id: 1, name: "SCR-001 (iPhone 13 Pro...)", qty: 10 }])
  const [poSupplier, setPoSupplier] = useState("Tech Supplies Inc")

  const hiddenInventoryReportRef = useRef<HTMLDivElement>(null)
  const poPdfRef = useRef<HTMLDivElement>(null)
  const [poPdfTarget, setPoPdfTarget] = useState<any | null>(null)
  const [isGeneratingPOPdf, setIsGeneratingPOPdf] = useState(false)

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    setIsExportOpen(false)
    try {
      const element = hiddenInventoryReportRef.current
      if (!element) return

      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Robust Fix for \"lab()\" / \"oklch()\" color parsing errors
          const elements = clonedDoc.getElementsByTagName("*");
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            const style = window.getComputedStyle(el);
            
            const colorProps = ['color', 'backgroundColor', 'borderColor', 'outlineColor', 'textDecorationColor', 'stopColor', 'fill', 'stroke'];
            colorProps.forEach(prop => {
              const val = (style as any)[prop];
              if (val && (val.includes('oklch') || val.includes('lab') || val.includes('color-mix'))) {
                if (prop === 'backgroundColor') el.style.backgroundColor = '#ffffff';
                else if (prop === 'color') el.style.color = '#000000';
                else el.style[prop as any] = 'transparent';
              }
            });

            const shadow = style.boxShadow;
            if (shadow && (shadow.includes('oklch') || shadow.includes('lab') || shadow.includes('color-mix'))) {
              el.style.boxShadow = 'none';
            }
          }
        }
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Inventory_Status_Report_${new Date().toISOString().slice(0,10)}.pdf`)
    } catch (err) {
      console.error("PDF generation failed:", err)
      alert("Error: Could not generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleExportCSV = () => {
    const rows = [["Item Code", "Item Name", "Brand", "Category", "Stock", "Price", "Supplier", "Status"],
      ...filteredData.map(i => [i.code, i.name, i.brand, i.category, i.stock, i.price, i.supplier, i.status])]
    const csv = rows.map(r => r.join(",")).join("\n")
    const a = document.createElement("a"); 
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    a.download = `inventory_export_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    setIsExportOpen(false)
  }

  const handleDownloadPOPdf = async (po: any) => {
    setPoPdfTarget(po);
    setIsGeneratingPOPdf(true);
    await new Promise(r => setTimeout(r, 350));
    try {
      const element = poPdfRef.current;
      if (!element) return;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            const style = window.getComputedStyle(el);
            ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
              const val = (style as any)[prop];
              if (val && (val.includes('oklch') || val.includes('lab') || val.includes('color-mix'))) {
                if (prop === 'backgroundColor') el.style.backgroundColor = '#ffffff';
                else if (prop === 'color') el.style.color = '#000000';
                else el.style[prop as any] = 'transparent';
              }
            });
          }
        }
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Purchase_Order_${po.orderNumber}_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (err) {
      console.error('PO PDF generation failed:', err);
      toast.error('Could not generate PDF.');
    } finally {
      setIsGeneratingPOPdf(false);
      setPoPdfTarget(null);
    }
  };

  const handleDownloadInvoicePdf = async () => {
    if (!invoicePdfRef.current || !viewInvoiceTarget) return;
    setIsGeneratingInvoicePdf(true);
    toast.loading("Generating professional invoice...", { id: "pdf-gen" });
    
    await new Promise(r => setTimeout(r, 300));

    try {
      const elements = Array.from(invoicePdfRef.current.getElementsByTagName("*"));
      const computedStyles = elements.map(el => {
        const style = window.getComputedStyle(el);
        return {
          cssText: style.cssText,
          color: style.color,
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          borderWidth: style.borderWidth,
          borderStyle: style.borderStyle,
          padding: style.padding,
          margin: style.margin,
          display: style.display,
          flexDirection: style.flexDirection,
          alignItems: style.alignItems,
          justifyContent: style.justifyContent,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          fontFamily: style.fontFamily,
          gap: style.gap,
          width: style.width,
          height: style.height,
          boxShadow: style.boxShadow.includes('lab') || style.boxShadow.includes('oklch') ? 'none' : style.boxShadow
        };
      });

      const canvas = await html2canvas(invoicePdfRef.current, { 
        scale: 3, 
        logging: false, 
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const clonedElements = Array.from(clonedDoc.getElementsByTagName("*"));
          clonedElements.forEach((el, i) => {
             const cel = el as HTMLElement;
             const s = computedStyles[i];
             if (!s) return;
             
             cel.style.color = s.color.includes('lab') || s.color.includes('oklch') ? '#000000' : s.color;
             cel.style.backgroundColor = s.backgroundColor.includes('lab') || s.backgroundColor.includes('oklch') ? '#ffffff' : s.backgroundColor;
             cel.style.borderColor = s.borderColor;
             cel.style.borderWidth = s.borderWidth;
             cel.style.borderStyle = s.borderStyle;
             cel.style.padding = s.padding;
             cel.style.display = s.display;
             cel.style.fontSize = s.fontSize;
             cel.style.fontWeight = s.fontWeight;
             cel.style.fontFamily = "Arial, sans-serif";
             cel.style.width = s.width;
             cel.style.height = s.height;
             cel.style.boxShadow = s.boxShadow;
             
             if (s.display === 'flex') {
                cel.style.flexDirection = s.flexDirection;
                cel.style.alignItems = s.alignItems;
                cel.style.justifyContent = s.justifyContent;
                cel.style.gap = s.gap;
             }
          });

          const heads = clonedDoc.getElementsByTagName("head");
          if (heads[0]) {
             while(heads[0].firstChild) heads[0].removeChild(heads[0].firstChild);
          }
          const bodyStyles = clonedDoc.querySelectorAll('style');
          bodyStyles.forEach(s => s.remove());
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SRM_Invoice_${viewInvoiceTarget.orderNumber}.pdf`);
      toast.success("Invoice generated successfully!", { id: "pdf-gen" });
    } catch (err) {
      console.error("PDF GEN ERR:", err);
      toast.error("Failed to generate PDF.", { id: "pdf-gen" });
    } finally {
      setIsGeneratingInvoicePdf(false);
    }
  };

  const filteredData = useMemo(() => {
    return inventoryState.filter((item) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        item.name.toLowerCase().includes(searchLower) ||
        item.code.toLowerCase().includes(searchLower) ||
        item.brand.toLowerCase().includes(searchLower)
      
      const matchesCategory = filterCategory === (mounted ? t('inventoryPage.categories.all') : "All Categories") || item.category === filterCategory
      const matchesStatus = filterStatus === (mounted ? t('inventoryPage.statuses.all') : "All Status") || item.status === filterStatus
      const matchesSupplier = filterSupplier === "All Suppliers" || item.supplier === filterSupplier
      
      return matchesSearch && matchesStatus && matchesSupplier && matchesCategory
    })
  }, [inventoryState, searchTerm, filterStatus, filterSupplier, filterCategory, mounted, t])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredData.slice(start, start + itemsPerPage)
  }, [filteredData, currentPage])

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(paginatedData.map(i => i.code))
    } else {
      setSelectedItems([])
    }
  }

  const toggleSelectItem = (code: string) => {
    setSelectedItems(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    )
  }

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteInventoryItem(id).unwrap();
      setActiveMenuId(null);
      setDeleteFormTarget(null);
      toast.success("Asset record deleted successfully.");
    } catch (err: any) {
      console.error("Failed to delete item. Full error:", err);
      const msg = err.data?.message || err.data?.error || err.status || "Deletion failed";
      toast.error(`Error: ${msg}`);
    }
  }

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        <DashboardHeader />
        
        <main className="flex-1 flex flex-col pt-0 overflow-y-auto">
          <div className="w-full max-w-[1280px] px-8 py-8 mx-auto flex flex-col">
            {/* Header Section */}
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-semibold mb-4">
               <Link href="/admin/dashboard" className="hover:text-foreground transition-colors cursor-pointer text-[#4F46E5]">{mounted ? t('dashboard.title') : 'Dashboard'}</Link>
               <ChevronRight className="h-3.5 w-3.5 opacity-50" />
               <span className="text-[#0F172A]">{mounted ? t('inventoryPage.title') : 'Inventory Management'}</span>
            </div>

            <div className="flex flex-col gap-6 mb-8">
              <div>
                <h1 className="text-[28px] font-black text-[#0F172A] tracking-tight">{mounted ? t('inventoryPage.title') : 'Inventory Management'}</h1>
                <p className="text-sm text-muted-foreground font-medium">{mounted ? t('inventoryPage.subtitle') : 'Manage your spare parts and supplies'}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => setIsRequestStockOpen(true)}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg border border-[#4F46E5] bg-[#EEF2FF] text-sm font-black text-[#4F46E5] hover:bg-[#E0E7FF] transition-all shadow-sm focus:outline-none"
                >
                  <Upload className="h-4 w-4" /> Request Stock
                </button>
                <button 
                  onClick={() => setIsAddSupplierOpen(true)}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg border border-emerald-600 bg-emerald-50 text-sm font-black text-emerald-700 hover:bg-emerald-100 transition-all shadow-sm focus:outline-none"
                >
                  <Plus className="h-4 w-4" /> Add Supplier
                </button>
                <div className="w-px h-6 bg-border mx-2" />
                <button 
                  onClick={() => setIsAdjustStockOpen(true)}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-sm font-semibold text-[#0F172A] hover:bg-muted transition-colors shadow-sm focus:outline-none"
                >
                  <Package className="h-4 w-4" /> Adjust Stock
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setIsExportOpen(!isExportOpen)}
                    className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-white text-sm font-semibold text-[#0F172A] hover:bg-muted transition-colors shadow-sm focus:outline-none"
                  >
                    {isGeneratingPDF ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {mounted ? t('inventoryPage.export') : 'Export'} <ChevronDown className="h-4 w-4" />
                  </button>
                  {isExportOpen && (
                    <div className="absolute top-12 left-0 w-44 bg-white rounded-xl shadow-xl border border-border py-1 z-[100] animate-in fade-in slide-in-from-top-2">
                      <button onClick={handleDownloadPDF} className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-colors border-b border-border/50"><Download className="h-4 w-4 text-[#4F46E5]" /> {mounted ? t('reportsPage.downloadPdf') : 'Export as PDF'}</button>
                      <button onClick={handleExportCSV} className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-[13px] font-bold text-[#0F172A] hover:bg-muted transition-colors"><Download className="h-4 w-4 text-[#10B981]" /> {mounted ? t('reportsPage.downloadCsv') : 'Export as CSV'}</button>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setIsAddItemOpen(true)}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg bg-[#4F46E5] text-sm font-semibold text-white hover:bg-[#4338CA] transition-all shadow-md active:scale-95 focus:outline-none ml-auto"
                >
                  <Plus className="h-4 w-4" /> {mounted ? t('inventoryPage.addItem') : 'Add Item'}
                </button>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 mb-8 bg-slate-100/50 p-1 rounded-2xl w-fit border border-border/40">
              <button 
                onClick={() => setActiveTab("inventory")}
                className={`px-6 py-2.5 rounded-xl text-[13px] font-black transition-all ${activeTab === 'inventory' ? 'bg-white text-[#4F46E5] shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Stock Inventory
              </button>
              <button 
                onClick={() => setActiveTab("suppliers")}
                className={`px-6 py-2.5 rounded-xl text-[13px] font-black transition-all ${activeTab === 'suppliers' ? 'bg-white text-[#4F46E5] shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Suppliers Hub
              </button>
              <button 
                onClick={() => setActiveTab("pos")}
                className={`px-6 py-2.5 rounded-xl text-[13px] font-black transition-all ${activeTab === 'pos' ? 'bg-white text-[#4F46E5] shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Purchase Orders
              </button>
            </div>

            {activeTab === "inventory" && (
              <div className="w-full flex flex-col">
                <div className="mb-8">
              <h2 className="text-lg font-bold text-[#0F172A] mb-4">{mounted ? t('inventoryPage.quickOverview') : 'Quick Overview'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-border/60 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                    <Package className="h-6 w-6 text-[#4F46E5]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{mounted ? t('inventoryPage.totalStockValue') : 'Total Stock Value'}</span>
                    <span className="text-xl font-bold text-[#0F172A]">Rs. {(invSummary?.totalValue || 0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border/60 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] flex items-center justify-center">
                    <ArrowUpRight className="h-6 w-6 text-[#10B981]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{mounted ? t('inventoryPage.activeInventory') : 'Active Inventory'}</span>
                    <span className="text-xl font-bold text-[#0F172A]">{invSummary?.totalItems || 0} {mounted ? t('inventoryPage.skus') : 'SKUs'}</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border/60 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                    <Clock className="h-6 w-6 text-[#D97706]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{mounted ? t('inventoryPage.lowStockItems') : 'Low Stock Items'}</span>
                    <span className="text-xl font-bold text-[#D97706]">{invSummary?.lowStockCount || 0} {mounted ? t('inventoryPage.items') : 'items'}</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-border/60 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-[#EF4444]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{mounted ? t('inventoryPage.outOfStock') : 'Out of Stock'}</span>
                    <span className="text-xl font-bold text-[#EF4444]">{invSummary?.outOfStockCount || 0} {mounted ? t('inventoryPage.items') : 'items'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-border/60 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-1">
                   <h3 className="text-md font-bold text-[#0F172A]">{mounted ? t('inventoryPage.fastMovingItems') : 'Top 10 Fast-Moving Items'}</h3>
                   <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">Live Ledger</span>
                </div>
                <p className="text-xs text-muted-foreground mb-6">{mounted ? t('inventoryPage.mostUsedMonth') : 'Most used parts this month'}</p>
                
                <div className="h-[250px] w-full relative">
                  {usageLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[1px] z-10">
                       <RefreshCw className="h-8 w-8 text-[#4F46E5] animate-spin mb-2" />
                       <span className="text-[11px] font-black text-[#4F46E5] uppercase tracking-widest">Syncing Ledger...</span>
                    </div>
                  ) : fastMovingItemsData.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                       <Package className="h-10 w-10 mb-2 opacity-20" />
                       <span className="text-[12px] font-bold">No movement data yet</span>
                    </div>
                  ) : null}
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fastMovingItemsData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100} 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 11, fontWeight: 500, fill: "#64748B" }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                        itemStyle={{ fontSize: '12px', fontWeight: '800', color: '#4F46E5' }}
                        labelStyle={{ fontSize: '10px', fontWeight: '700', color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}
                      />
                      <Bar dataKey="count" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 border-t border-border/50 pt-4">
                   <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Usage Ledger (Last 5)</span>
                   </div>
                   <div className="space-y-2">
                      {usageResponse?.usageReport?.slice(0, 5).map((r: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[11px] font-black text-[#4F46E5]">
                                 #{idx + 1}
                              </div>
                              <span className="text-[12px] font-bold text-[#0F172A] truncate max-w-[120px]">{r.partName}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-[12px] font-black text-[#4F46E5]">{r.totalQuantityUsed}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">units</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-border/60 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-6">
                   <div>
                      <h3 className="text-md font-black text-[#0F172A] mb-1">{mounted ? t('inventoryPage.stockTrend') : 'Stock Value Trend'}</h3>
                      <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">{chartTimeRange}</p>
                   </div>
                   <select 
                     value={chartTimeRange}
                     onChange={(e) => setChartTimeRange(e.target.value)}
                     className="h-8 rounded-lg border border-border bg-white px-2 text-[11px] font-black text-[#0F172A] focus:outline-none shadow-sm cursor-pointer"
                   >
                      <option>Last 7 days</option>
                      <option>Last 28 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>Last 6 months</option>
                   </select>
                </div>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stockTrendDataMap[chartTimeRange] || stockTrendDataMap["Last 6 months"]}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 700, fill: "#64748B" }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 700, fill: "#64748B" }}
                        tickFormatter={(v) => `${v}M`}
                        dx={-5}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                        itemStyle={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}
                        labelStyle={{ fontSize: '10px', fontWeight: '700', color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#4F46E5" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* All Inventory Items Table Section */}
            <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden mb-8">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-black text-[#0F172A]">{mounted ? t('inventoryPage.allInventoryItems') : 'All Inventory Items'}</h3>
                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-1">
                      {mounted ? t('inventoryPage.totalItemsListed', { count: filteredData.length }) : `${filteredData.length} total items listed`}
                    </p>
                  </div>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                  <div className="relative flex-1 group">
                    <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-[#4F46E5]" />
                    <input 
                      type="text" 
                      placeholder="Search by name, SKU, brand..."
                      value={searchTerm}
                      onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1)}}
                      className="w-full h-11 pl-11 pr-4 rounded-xl border border-border bg-[#F8FAFC] text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:bg-white transition-all shadow-sm placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <select 
                      className="h-11 px-4 rounded-xl border border-border bg-white text-[13px] font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 min-w-[150px] cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                      value={filterCategory}
                      onChange={(e) => {setFilterCategory(e.target.value); setCurrentPage(1)}}
                    >
                      <option>{mounted ? t('inventoryPage.categories.all') : "All Categories"}</option>
                      <option>{mounted ? t('inventoryPage.categories.screens') : "Screens"}</option>
                      <option>{mounted ? t('inventoryPage.categories.batteries') : "Batteries"}</option>
                      <option>{mounted ? t('inventoryPage.categories.cameras') : "Cameras"}</option>
                      <option>{mounted ? t('inventoryPage.categories.chargingPorts') : "Charging Ports"}</option>
                      <option>{mounted ? t('inventoryPage.categories.tools') : "Tools"}</option>
                    </select>
                    <select 
                      className="h-11 px-4 rounded-xl border border-border bg-white text-[13px] font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 min-w-[130px] cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                      value={filterStatus}
                      onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1)}}
                    >
                      <option>{mounted ? t('inventoryPage.statuses.all') : "All Status"}</option>
                      <option>{mounted ? t('inventoryPage.statuses.inStock') : "In Stock"}</option>
                      <option>{mounted ? t('inventoryPage.statuses.lowStock') : "Low Stock"}</option>
                      <option>{mounted ? t('inventoryPage.statuses.outOfStock') : "Out of Stock"}</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto rounded-xl border border-border/50">
                  <table className="w-full text-left border-collapse min-w-[1100px]">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-border/80 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        <th className="px-5 py-4 w-12">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-border accent-[#4F46E5]" 
                            onChange={toggleSelectAll}
                            checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                          />
                        </th>
                        <th className="px-5 py-4">{mounted ? t('inventoryPage.table.itemDetails') : 'Item Details'}</th>
                        <th className="px-5 py-4">{mounted ? t('inventoryPage.table.stockAvailability') : 'Stock Availability'}</th>
                        <th className="px-5 py-4">{mounted ? t('inventoryPage.table.unitPrice') : 'Unit Price'}</th>
                        <th className="px-5 py-4">{mounted ? t('inventoryPage.table.sourceLocation') : 'Source & Location'}</th>
                        <th className="px-5 py-4">{mounted ? t('inventoryPage.table.status') : 'Status'}</th>
                        <th className="px-5 py-4 text-center">{mounted ? t('inventoryPage.table.actions') : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {paginatedData.map((item) => (
                        <tr key={item.code} className={`group hover:bg-[#F8FAFC] transition-colors ${selectedItems.includes(item.code) ? 'bg-[#EEF2FF]/40' : ''}`}>
                          <td className="px-5 py-5 w-12">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 rounded border-border accent-[#4F46E5]"
                              checked={selectedItems.includes(item.code)}
                              onChange={() => toggleSelectItem(item.code)}
                            />
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[13px] font-black text-[#0F172A] leading-tight">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.code}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-[10px] font-bold text-[#4F46E5] uppercase">{item.brand}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-[10px] font-bold text-slate-400">{item.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex flex-col gap-1.5 min-w-[140px]">
                              <div className="flex items-center justify-between">
                                <span className="text-[12px] font-black text-[#0F172A] tracking-tight">{item.stock} units <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">Current</span></span>
                              </div>
                              <div className="w-full h-1.5 bg-[#EEF2FF] rounded-full overflow-hidden shadow-inner">
                                <div 
                                  className={`h-full rounded-full transition-all duration-700 shadow-sm ${
                                    item.status === 'In Stock' ? 'bg-[#10B981]' : 
                                    item.status === 'Low Stock' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
                                  }`} 
                                  style={{ width: `${Math.min(100, (item.stock / item.maxStock) * 100)}%` }} 
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex flex-col">
                               <span className="text-[13px] font-black text-[#0F172A]">Rs. {(item.price || 0).toLocaleString()}</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">MSRP Value</span>
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex flex-col gap-1">
                               <div className="flex items-center gap-2">
                                  <Package className="h-3 w-3 text-slate-400" />
                                  <span className="text-[12px] font-bold text-[#0F172A] leading-none">{item.supplier}</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3 text-[#4F46E5]" />
                                  <span className="text-[11px] font-black text-slate-400 leading-none">Bay {item.location}</span>
                               </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 text-right">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                              item.status === 'In Stock' ? 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]' : 
                              item.status === 'Low Stock' ? 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]' : 
                              'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]'
                            }`}>
                               {item.status}
                            </div>
                          </td>
                          <td className="px-5 py-5 text-center relative">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === item.code ? null : item.code); }}
                              className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-all focus:outline-none"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {activeMenuId === item.code && (
                               <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-border p-1.5 z-[100] animate-in fade-in zoom-in-95 origin-top-right">
                                 <button 
                                    onClick={() => { setViewDetailsTarget(item); setActiveMenuId(null); }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] font-bold text-[#0F172A] hover:bg-slate-50 rounded-xl transition-colors"
                                 >
                                    <Eye className="h-4 w-4 text-slate-400" /> View Details
                                 </button>
                                 <button 
                                    onClick={() => { setEditItemTarget(item); setActiveMenuId(null); }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] font-bold text-[#0F172A] hover:bg-slate-50 rounded-xl transition-colors"
                                 >
                                    <RefreshCw className="h-4 w-4 text-[#4F46E5]" /> Edit Item
                                 </button>
                                 <div className="h-px bg-slate-100 my-1 mx-2" />
                                 <button 
                                    onClick={() => { setDeleteFormTarget(item); setActiveMenuId(null); }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                 >
                                    <X className="h-4 w-4" /> Delete Item
                                 </button>
                               </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between py-6 mt-4 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-muted-foreground">{mounted ? t('inventoryPage.pagination.show') : 'Show'}</span>
                    <select className="h-8 px-2 rounded border border-border bg-white text-[13px] font-bold focus:outline-none">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                    </select>
                    <span className="text-[13px] text-muted-foreground">{mounted ? t('inventoryPage.pagination.perPage') : 'per page'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="h-8 w-8 rounded flex items-center justify-center border border-border text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {[...Array(Math.ceil(filteredData.length / itemsPerPage))].map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`h-8 w-8 rounded flex items-center justify-center font-bold text-[13px] shadow-sm transition-all ${currentPage === i + 1 ? 'bg-primary text-white scale-110' : 'border border-border text-muted-foreground hover:bg-muted'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredData.length / itemsPerPage), p + 1))}
                      className="h-8 w-8 rounded flex items-center justify-center border border-border text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-[13px] text-muted-foreground font-medium">
                    {mounted ? t('inventoryPage.pagination.showing', { 
                      start: (currentPage - 1) * itemsPerPage + 1, 
                      end: Math.min(currentPage * itemsPerPage, filteredData.length), 
                      total: filteredData.length 
                    }) : `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredData.length)} of ${filteredData.length}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-12" />
              </div>
            )}

        {activeTab === "suppliers" && (
          <div className="w-full flex flex-col">
            <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden mb-8">
              <div className="p-6">
                <h3 className="text-lg font-black text-[#0F172A] mb-6">Suppliers Directory</h3>
                <div className="w-full overflow-x-auto rounded-xl border border-border/50">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-border/80 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        <th className="px-5 py-4">Supplier Name</th>
                        <th className="px-5 py-4">Contact Person</th>
                        <th className="px-5 py-4">Email</th>
                        <th className="px-5 py-4">Phone</th>
                        <th className="px-5 py-4">Category</th>
                        <th className="px-5 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {suppliers.map((s: any) => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4 text-[13px] font-black text-[#0F172A]">{s.name}</td>
                          <td className="px-5 py-4 text-[13px] font-bold text-slate-600">{s.contactName || '-'}</td>
                          <td className="px-5 py-4 text-[13px] text-slate-500">{s.email || '-'}</td>
                          <td className="px-5 py-4 text-[13px] text-slate-500">{s.phone || '-'}</td>
                          <td className="px-5 py-4"><span className="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black uppercase">{s.category}</span></td>
                           <td className="px-5 py-4 text-center relative">
                              <div className="relative inline-block">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setActiveSupplierMenuId(activeSupplierMenuId === s.id ? null : s.id); }}
                                  className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-all focus:outline-none"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                                {activeSupplierMenuId === s.id && (
                                   <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-border p-1.5 z-[100] animate-in fade-in zoom-in-95 origin-top-right">
                                     <button 
                                        onClick={() => { setEditSupplierTarget(s); setActiveSupplierMenuId(null); }}
                                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] font-bold text-[#0F172A] hover:bg-slate-50 rounded-xl transition-colors"
                                     >
                                        <RefreshCw className="h-4 w-4 text-[#4F46E5]" /> Edit Supplier
                                     </button>
                                     <div className="h-px bg-slate-100 my-1 mx-2" />
                                     <button 
                                        onClick={() => { setDeleteSupplierTarget(s); setActiveSupplierMenuId(null); }}
                                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                     >
                                        <Trash2 className="h-4 w-4" /> Delete Supplier
                                     </button>
                                   </div>
                                )}
                              </div>
                           </td>
                        </tr>
                      ))}
                      {suppliers.length === 0 && (
                        <tr><td colSpan={6} className="px-5 py-20 text-center text-slate-400 font-bold">No suppliers registered yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pos" && (
          <div className="w-full flex flex-col">
            <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden mb-8">
              <div className="p-6">
                <h3 className="text-lg font-black text-[#0F172A] mb-6">Purchase Orders History</h3>
                <div className="w-full overflow-x-auto rounded-xl border border-border/50">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-border/80 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        <th className="px-5 py-4">Order #</th>
                        <th className="px-5 py-4">Supplier</th>
                        <th className="px-5 py-4">Total Amount</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Order Date</th>
                        <th className="px-5 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {purchaseOrders.map((po: any) => (
                        <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4 text-[13px] font-black text-[#0F172A]">{po.orderNumber}</td>
                          <td className="px-5 py-4 text-[13px] font-bold text-slate-600">{po.supplier?.name || '-'}</td>
                          <td className="px-5 py-4 text-[13px] font-black">Rs. {Number(po.totalAmount).toLocaleString()}</td>
                          <td className="px-5 py-4">
                             <select
                               value={po.status}
                               onChange={e => updatePOStatus({ id: po.id, status: e.target.value }).unwrap()
                                 .then(() => toast.success(`Status updated to ${e.target.value}`))
                                 .catch(() => toast.error('Failed to update status'))}
                               className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border-0 outline-none cursor-pointer ${
                                 po.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-700' :
                                 po.status === 'SENT' ? 'bg-blue-100 text-blue-700' :
                                 po.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                               }`}
                             >
                               <option value="DRAFT">DRAFT</option>
                               <option value="SENT">SENT</option>
                               <option value="RECEIVED">RECEIVED</option>
                               <option value="CANCELLED">CANCELLED</option>
                              </select>
                           </td>
                           <td className="px-5 py-4 text-[13px] text-slate-500">{new Date(po.createdAt).toLocaleDateString()}</td>
                          <td className="px-5 py-4 text-center relative">
                             <div className="flex items-center justify-center gap-2">
                               <button
                                 onClick={() => setViewInvoiceTarget(po)}
                                 className="h-8 w-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white transition-all shadow-sm"
                                 title="View Invoice"
                               >
                                 <Eye className="h-4 w-4" />
                               </button>
                               <button
                                 onClick={() => setViewPOTarget(po)}
                                 className="px-4 py-1.5 rounded-lg bg-[#4F46E5] text-white text-[11px] font-black uppercase hover:bg-[#4338CA] transition-colors"
                               >
                                 View
                               </button>
                                <div className="relative">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setActivePOMenuId(activePOMenuId === po.id ? null : po.id); }}
                                    className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-all focus:outline-none"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                  
                                  {activePOMenuId === po.id && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-border p-1.5 z-[100] animate-in fade-in zoom-in-95 origin-top-right">
                                      <button 
                                         onClick={() => { handleDownloadPOPdf(po); setActivePOMenuId(null); }}
                                         disabled={isGeneratingPOPdf}
                                         className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] font-bold text-[#0F172A] hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                                      >
                                         {isGeneratingPOPdf && poPdfTarget?.id === po.id 
                                           ? <RefreshCw className="h-4 w-4 animate-spin text-[#4F46E5]" /> 
                                           : <Download className="h-4 w-4 text-[#4F46E5]" />}
                                         Download Invoice
                                      </button>
                                      <div className="h-px bg-slate-100 my-1 mx-2" />
                                      <button 
                                         onClick={() => { setEditPOTarget(po); setActivePOMenuId(null); }}
                                         className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] font-bold text-[#0F172A] hover:bg-slate-50 rounded-xl transition-colors"
                                      >
                                         <RefreshCw className="h-4 w-4 text-slate-400" /> Edit Order
                                      </button>
                                      <button 
                                         onClick={() => { setDeletePOTarget(po); setActivePOMenuId(null); }}
                                         className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                      >
                                         <Trash2 className="h-4 w-4" /> Delete Order
                                      </button>
                                    </div>
                                  )}
                                </div>
                             </div>
                          </td>
                        </tr>
                      ))}
                      {purchaseOrders.length === 0 && (
                        <tr><td colSpan={6} className="px-5 py-20 text-center text-slate-400 font-bold">No purchase orders found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>

        {/* 🔵 PREMIUM INVOICE MODAL (Professional Device-Style) */}
        {viewInvoiceTarget && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
             <div className="bg-[#f8fafc] w-full max-w-[900px] h-[90vh] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 flex flex-col">
                {/* STICKY ACTION HEADER */}
                <div className="w-full bg-white border-b border-slate-100 p-6 flex justify-end gap-3 shrink-0 z-20">
                  <button 
                    onClick={handleDownloadInvoicePdf} 
                    disabled={isGeneratingInvoicePdf}
                    className={`h-11 px-6 rounded-full bg-[#4F46E5] text-white text-[14px] font-black flex items-center gap-2.5 shadow-xl transition-all active:scale-95 ${isGeneratingInvoicePdf ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4338CA] hover:shadow-indigo-200'}`}
                  >
                    <FileDown className={`h-4 w-4 ${isGeneratingInvoicePdf ? 'animate-bounce' : ''}`} /> 
                    {isGeneratingInvoicePdf ? 'Generating...' : 'Download Device Invoice'}
                  </button>
                  <button 
                    onClick={() => setViewInvoiceTarget(null)} 
                    className="h-11 w-11 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-[#0F172A] transition-all focus:outline-none active:scale-95 border border-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* SCROLLABLE PAPER AREA */}
                <div className="flex-1 overflow-y-auto p-12 flex justify-center bg-slate-100/30 custom-scrollbar">
                  {/* PAPER CONTENT */}
                  <div className="w-full max-w-[800px] bg-white shadow-sm border border-slate-200 p-16 flex flex-col min-h-[1050px] relative overflow-hidden">
                      {/* BRANDING HEADER */}
                      <div className="flex justify-between items-start mb-20">
                          <div>
                             <div className="flex items-center gap-2.5 mb-2">
                               <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
                               <h2 className="text-[26px] font-black text-[#0F172A] tracking-tighter uppercase">SRM Solutions</h2>
                             </div>
                             <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                <p className="flex items-center gap-1.5 underline decoration-[#4F46E5] underline-offset-4">Digital Repair Hub</p>
                                <p>contact@srm-solutions.com</p>
                                <p>+94 11 234 5678</p>
                             </div>
                          </div>
                          <div className="text-right text-[11px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
                                <p>Premium Service Center</p>
                                <p>Colombo 07, Sri Lanka</p>
                                <p className="text-[#4F46E5] mt-1">VAT REG: 009876543-X</p>
                          </div>
                      </div>

                      {/* LOGISTICS & META GRID */}
                      <div className="grid grid-cols-4 gap-8 mb-16">
                          <div className="col-span-1 border-l-2 border-[#4F46E5] pl-5">
                             <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black">Registered to,</p>
                             <p className="text-[14px] font-black text-[#0F172A] mb-1">{viewInvoiceTarget.supplier?.name}</p>
                             <p className="text-[12px] text-slate-500 font-bold leading-relaxed">{viewInvoiceTarget.supplier?.phone || "+94 00 000 0000"}<br/>Client Address Stored<br/>Verification Required</p>
                          </div>
                          <div className="col-span-2 px-8 border-x border-slate-50">
                             <div className="grid grid-cols-2 gap-y-8">
                                <div>
                                   <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Device Reference</p>
                                   <p className="text-[13px] font-black text-[#0F172A] font-mono bg-slate-50 px-2 py-1 rounded inline-block border border-slate-100">#{viewInvoiceTarget.orderNumber}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Registration Date</p>
                                   <p className="text-[13px] font-black text-[#0F172A]">{new Date(viewInvoiceTarget.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Asset Category</p>
                                   <p className="text-[13px] font-black text-[#0F172A] capitalize">Inventory Stock</p>
                                </div>
                                <div>
                                   <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Operational Status</p>
                                   <span 
                                     className="text-[10px] font-black px-2 py-0.5 rounded-md border uppercase inline-block bg-emerald-50 text-emerald-700 border-emerald-200"
                                    >
                                     {viewInvoiceTarget.status}
                                   </span>
                                </div>
                             </div>
                          </div>
                          <div className="col-span-1 text-right bg-slate-50/50 p-6 rounded-2xl border border-slate-100 h-fit">
                             <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Estimated Value</p>
                             <p className="text-[32px] font-black text-[#0F172A] tracking-tighter leading-none mb-1">
                               <span className="text-[14px] text-slate-400 mr-1.5">Rs.</span>
                               {(Number(viewInvoiceTarget.totalAmount) || 0).toLocaleString()}
                             </p>
                             <div className="mt-8 border-t border-slate-200 pt-4">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-black underline decoration-[#4F46E5] underline-offset-4">Valuation Logic</p>
                                <p className="text-[12px] font-black text-[#4F46E5]">Market Baseline</p>
                             </div>
                          </div>
                      </div>

                      {/* ITEMS TABLE */}
                      <div className="flex-1">
                         <div className="grid grid-cols-12 pb-4 mb-8 border-b-2 border-[#0F172A]">
                             <div className="col-span-6 text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Asset Specification</div>
                             <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Brand</div>
                             <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Identifier</div>
                             <div className="col-span-2 text-right text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Value</div>
                         </div>
                         
                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                           {viewInvoiceTarget.items?.map((item: any, idx: number) => (
                             <div key={idx} className="grid grid-cols-12 items-center">
                                 <div className="col-span-6">
                                    <p className="text-[14px] font-black text-[#0F172A] mb-1">{item.partName}</p>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Primary Technical Asset Profile</p>
                                 </div>
                                 <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center uppercase">{viewInvoiceTarget.supplier?.name?.split(' ')[0] || "Apple"}</div>
                                 <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center font-mono">{item.sku || "qqqqqqqqqqqqqq"}</div>
                                 <div className="col-span-2 text-right text-[13px] font-black text-[#0F172A]">Rs. {(item.unitCost * item.quantity).toLocaleString()}</div>
                             </div>
                           ))}

                           <div className="grid grid-cols-12 items-center pt-8 border-t border-slate-50">
                               <div className="col-span-6">
                                  <p className="text-[14px] font-black text-[#0F172A] mb-1">Maintenance History Record</p>
                                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Verified Service Job Analytics</p>
                               </div>
                               <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center">0 Jobs</div>
                               <div className="col-span-2 text-[13px] font-black text-[#4F46E5] text-center font-bold italic">Integrity Verified</div>
                               <div className="col-span-2 text-right text-[11px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Certified Asset</div>
                           </div>
                         </div>

                         {/* FINANCIAL TOTALS */}
                         <div className="flex justify-end pt-12 mt-12 border-t-4 border-slate-50">
                             <div className="w-[340px] space-y-4">
                                 <div className="flex justify-between items-center text-[13px] font-bold text-slate-500">
                                    <span>Market Baseline Net</span>
                                    <span className="text-[#0F172A]">Rs. {(Number(viewInvoiceTarget.totalAmount) * 0.9).toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 pb-5 border-b border-slate-100">
                                    <span>Valuation Fee (10.0%)</span>
                                    <span className="text-[#0F172A]">Rs. {(Number(viewInvoiceTarget.totalAmount) * 0.1).toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between items-center pt-2">
                                    <span className="text-[16px] font-black text-[#0F172A] uppercase tracking-tighter">Total Asset Valuation</span>
                                    <div className="text-right">
                                       <p className="text-[24px] font-black text-[#4F46E5] tracking-tighter leading-none">Rs. {(Number(viewInvoiceTarget.totalAmount)).toLocaleString()}</p>
                                       <p className="text-[9px] text-slate-400 font-black uppercase mt-1">Authorized for Inventory</p>
                                    </div>
                                 </div>
                             </div>
                         </div>
                      </div>

                      {/* PROFESSIONAL FOOTER */}
                      <div className="mt-20 pt-16 border-t border-slate-100 border-dashed">
                         <p className="text-[12px] font-black text-[#0F172A] mb-8 flex items-center gap-2">
                           <ArrowUpRight className="h-4 w-4 text-[#4F46E5]" /> 
                           Thank you for choosing SRM Solutions for your professional technical needs.
                         </p>
                         
                         <div className="grid grid-cols-2 gap-12">
                           <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black underline decoration-slate-200 underline-offset-4">General Terms</p>
                              <p className="text-[11px] text-slate-500 font-bold leading-relaxed italic">
                                This document is a certified inventory record generated by the SRM Solutions database. 
                                It reflects the technical specifications and valuation of the asset at the time of report generation.
                              </p>
                           </div>
                           <div className="flex flex-col items-end">
                              <div className="w-32 h-16 bg-slate-50 rounded-lg border border-slate-100 mb-2 flex items-center justify-center">
                                 <p className="text-[9px] text-slate-300 font-black uppercase rotate-[-5deg]">Stamp Required</p>
                              </div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Authorized Signature</p>
                           </div>
                         </div>
                      </div>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* 🛠️ INVISIBLE PDF RENDER TARGET FOR INVOICE */}
        <div className="fixed -left-[4000px] pointer-events-none opacity-0 select-none overflow-hidden h-0 w-0">
          {viewInvoiceTarget && (
              <div 
                ref={invoicePdfRef}
                className="w-[800px] bg-white p-16 flex flex-col min-h-[1100px]"
              >
                {/* Same content as above but for PDF capture */}
                {/* BRANDING HEADER */}
                <div className="flex justify-between items-start mb-20">
                    <div>
                       <div className="flex items-center gap-2.5 mb-2">
                         <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
                         <h2 className="text-[26px] font-black text-[#0F172A] tracking-tighter uppercase">SRM Solutions</h2>
                       </div>
                       <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                          <p className="flex items-center gap-1.5 underline decoration-[#4F46E5] underline-offset-4">Digital Repair Hub</p>
                          <p>contact@srm-solutions.com</p>
                          <p>+94 11 234 5678</p>
                       </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
                          <p>Premium Service Center</p>
                          <p>Colombo 07, Sri Lanka</p>
                          <p className="text-[#4F46E5] mt-1">VAT REG: 009876543-X</p>
                    </div>
                </div>

                {/* LOGISTICS & META GRID */}
                <div className="grid grid-cols-4 gap-8 mb-16">
                    <div className="col-span-1 border-l-2 border-[#4F46E5] pl-5">
                       <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black">Registered to,</p>
                       <p className="text-[14px] font-black text-[#0F172A] mb-1">{viewInvoiceTarget.supplier?.name}</p>
                       <p className="text-[12px] text-slate-500 font-bold leading-relaxed">{viewInvoiceTarget.supplier?.phone || "+94 00 000 0000"}<br/>Client Address Stored<br/>Verification Required</p>
                    </div>
                    <div className="col-span-2 px-8 border-x border-slate-50">
                       <div className="grid grid-cols-2 gap-y-8">
                          <div>
                             <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Device Reference</p>
                             <p className="text-[13px] font-black text-[#0F172A] font-mono bg-slate-50 px-2 py-1 rounded inline-block border border-slate-100">#{viewInvoiceTarget.orderNumber}</p>
                          </div>
                          <div>
                             <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Registration Date</p>
                             <p className="text-[13px] font-black text-[#0F172A]">{new Date(viewInvoiceTarget.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                          </div>
                          <div>
                             <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Asset Category</p>
                             <p className="text-[13px] font-black text-[#0F172A] capitalize">Inventory Stock</p>
                          </div>
                          <div>
                             <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Operational Status</p>
                             <span 
                               className="text-[10px] font-black px-2 py-0.5 rounded-md border uppercase inline-block bg-emerald-50 text-emerald-700 border-emerald-200"
                              >
                               {viewInvoiceTarget.status}
                             </span>
                          </div>
                       </div>
                    </div>
                    <div className="col-span-1 text-right bg-slate-50/50 p-6 rounded-2xl border border-slate-100 h-fit">
                       <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black">Estimated Value</p>
                       <p className="text-[32px] font-black text-[#0F172A] tracking-tighter leading-none mb-1">
                         <span className="text-[14px] text-slate-400 mr-1.5">Rs.</span>
                         {(Number(viewInvoiceTarget.totalAmount) || 0).toLocaleString()}
                       </p>
                       <div className="mt-8 border-t border-slate-200 pt-4">
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-black underline decoration-[#4F46E5] underline-offset-4">Valuation Logic</p>
                          <p className="text-[12px] font-black text-[#4F46E5]">Market Baseline</p>
                       </div>
                    </div>
                </div>

                {/* ITEMS TABLE */}
                <div className="flex-1">
                   <div className="grid grid-cols-12 pb-4 mb-8 border-b-2 border-[#0F172A]">
                       <div className="col-span-6 text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Asset Specification</div>
                       <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Brand</div>
                       <div className="col-span-2 text-[11px] text-[#0F172A] uppercase tracking-widest font-black text-center">Identifier</div>
                       <div className="col-span-2 text-right text-[11px] text-[#0F172A] uppercase tracking-widest font-black">Value</div>
                   </div>
                   
                   <div className="space-y-8">
                     {viewInvoiceTarget.items?.map((item: any, idx: number) => (
                       <div key={idx} className="grid grid-cols-12 items-center">
                           <div className="col-span-6">
                              <p className="text-[14px] font-black text-[#0F172A] mb-1">{item.partName}</p>
                              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Primary Technical Asset Profile</p>
                           </div>
                           <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center uppercase">{viewInvoiceTarget.supplier?.name?.split(' ')[0] || "Apple"}</div>
                           <div className="col-span-2 text-[13px] font-black text-[#0F172A] text-center font-mono">{item.sku || "qqqqqqqqqqqqqq"}</div>
                           <div className="col-span-2 text-right text-[13px] font-black text-[#0F172A]">Rs. {(item.unitCost * item.quantity).toLocaleString()}</div>
                       </div>
                     ))}
                   </div>

                   {/* FINANCIAL TOTALS */}
                   <div className="flex justify-end pt-12 mt-12 border-t-4 border-slate-50">
                       <div className="w-[340px] space-y-4">
                           <div className="flex justify-between items-center text-[13px] font-bold text-slate-500">
                              <span>Market Baseline Net</span>
                              <span className="text-[#0F172A]">Rs. {(Number(viewInvoiceTarget.totalAmount) * 0.9).toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 pb-5 border-b border-slate-100">
                              <span>Valuation Fee (10.0%)</span>
                              <span className="text-[#0F172A]">Rs. {(Number(viewInvoiceTarget.totalAmount) * 0.1).toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-center pt-2">
                              <span className="text-[16px] font-black text-[#0F172A] uppercase tracking-tighter">Total Asset Valuation</span>
                              <div className="text-right">
                                 <p className="text-[24px] font-black text-[#4F46E5] tracking-tighter leading-none">Rs. {(Number(viewInvoiceTarget.totalAmount)).toLocaleString()}</p>
                                 <p className="text-[9px] text-slate-400 font-black uppercase mt-1">Authorized for Inventory</p>
                              </div>
                           </div>
                       </div>
                   </div>
                </div>

                {/* PROFESSIONAL FOOTER */}
                <div className="mt-20 pt-16 border-t border-slate-100 border-dashed">
                   <p className="text-[12px] font-black text-[#0F172A] mb-8 flex items-center gap-2">
                     <ArrowUpRight className="h-4 w-4 text-[#4F46E5]" /> 
                     Thank you for choosing SRM Solutions for your professional technical needs.
                   </p>
                </div>
              </div>
            )}
        </div>

        {/* 🔵 OVERLAY MODALS */}
        {isAddSupplierOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-t-8 border-emerald-600 max-h-[90vh] flex flex-col">
                <div className="bg-[#F8FAFC] p-6 border-b border-border flex justify-between items-center">
                   <div>
                      <h2 className="text-[22px] font-black text-[#0F172A] mb-1 leading-none tracking-tight">Add New Supplier</h2>
                      <p className="text-[11px] text-emerald-600 font-black uppercase tracking-widest">Register a new vendor to the system</p>
                   </div>
                   <button onClick={() => setIsAddSupplierOpen(false)} className="h-9 w-9 rounded-full bg-white border border-border flex items-center justify-center transition-all focus:outline-none"><X className="h-4 w-4" /></button>
                </div>
                <div className="p-6 space-y-3 overflow-y-auto flex-1">
                   <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Company Name</label>
                         <input value={supplierForm.name} onChange={e=>setSupplierForm(p=>({...p,name:e.target.value}))} type="text" placeholder="e.g. Tech Supplies Inc" className="w-full h-10 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Person</label>
                         <input value={supplierForm.contactName} onChange={e=>setSupplierForm(p=>({...p,contactName:e.target.value}))} type="text" placeholder="e.g. John Doe" className="w-full h-10 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                         <input value={supplierForm.phone} onChange={e=>setSupplierForm(p=>({...p,phone:e.target.value}))} type="text" placeholder="+94 77 123 4567" className="w-full h-10 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 outline-none transition-all" />
                      </div>
                      <div className="col-span-2">
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                         <input value={supplierForm.email} onChange={e=>setSupplierForm(p=>({...p,email:e.target.value}))} type="email" placeholder="contact@supplier.com" className="w-full h-10 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 outline-none transition-all" />
                      </div>
                      <div className="col-span-2">
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                         <select 
                           value={["Parts", "Tools", "Electronics", "Accessories"].includes(supplierForm.category) ? supplierForm.category : "Other"}
                           onChange={e => {
                             if (e.target.value === "Other") {
                               setSupplierForm(p => ({ ...p, category: "" }));
                             } else {
                               setSupplierForm(p => ({ ...p, category: e.target.value }));
                             }
                           }}
                           className="w-full h-10 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 outline-none transition-all bg-[#F8FAFC]"
                         >
                           <option value="Parts">Parts</option>
                           <option value="Tools">Tools</option>
                           <option value="Electronics">Electronics</option>
                           <option value="Accessories">Accessories</option>
                           <option value="Other">Other (Enter Manually)</option>
                         </select>
                      </div>
                      {!["Parts", "Tools", "Electronics", "Accessories"].includes(supplierForm.category) && (
                        <div className="col-span-2 animate-in slide-in-from-top-2 duration-200">
                           <label className="block text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-2">Specify Other Category</label>
                           <input 
                             value={supplierForm.category} 
                             onChange={e => setSupplierForm(p => ({ ...p, category: e.target.value }))} 
                             type="text" 
                             placeholder="e.g. Batteries, Packing Materials..." 
                             className="w-full h-10 rounded-xl border-2 border-emerald-100 px-4 text-[13px] font-bold focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 outline-none transition-all bg-emerald-50/30" 
                           />
                        </div>
                      )}
                      <div className="col-span-2">
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Business Address</label>
                         <textarea value={supplierForm.address} onChange={e=>setSupplierForm(p=>({...p,address:e.target.value}))} placeholder="Company physical address..." className="w-full h-16 rounded-xl border border-border p-3 text-[13px] font-bold focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 outline-none transition-all resize-none" />
                      </div>
                   </div>
                   <div className="pt-6">
                      <button onClick={handleAddSupplier} className="w-full h-10 rounded-2xl bg-emerald-600 text-white text-[15px] font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all uppercase tracking-tight">Register Supplier</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* 🔵 EDIT SUPPLIER MODAL */}
        {editSupplierTarget && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-t-8 border-[#4F46E5] max-h-[90vh] flex flex-col">
                <div className="bg-[#F8FAFC] p-8 border-b border-border flex justify-between items-center">
                   <div>
                      <h2 className="text-[22px] font-black text-[#0F172A] mb-1 leading-none tracking-tight">Edit Supplier</h2>
                      <p className="text-[11px] text-[#4F46E5] font-black uppercase tracking-widest">Update vendor contact and logistics data</p>
                   </div>
                   <button onClick={() => setEditSupplierTarget(null)} className="h-9 w-9 rounded-full bg-white border border-border flex items-center justify-center transition-all focus:outline-none"><X className="h-4 w-4" /></button>
                </div>
                <div className="p-6 space-y-3 overflow-y-auto flex-1">
                   <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Company Name</label>
                         <input value={editSupplierTarget.name} onChange={e=>setEditSupplierTarget(p=>({...p,name:e.target.value}))} type="text" className="w-full h-10 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Person</label>
                         <input value={editSupplierTarget.contactName} onChange={e=>setEditSupplierTarget(p=>({...p,contactName:e.target.value}))} type="text" className="w-full h-10 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                         <input value={editSupplierTarget.phone} onChange={e=>setEditSupplierTarget(p=>({...p,phone:e.target.value}))} type="text" className="w-full h-10 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all" />
                      </div>
                      <div className="col-span-2">
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                         <input value={editSupplierTarget.email} onChange={e=>setEditSupplierTarget(p=>({...p,email:e.target.value}))} type="email" className="w-full h-10 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all" />
                      </div>
                      <div className="col-span-2">
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                         <select 
                           value={["Parts", "Tools", "Electronics", "Accessories"].includes(editSupplierTarget.category) ? editSupplierTarget.category : "Other"}
                           onChange={e => {
                             if (e.target.value === "Other") {
                               setEditSupplierTarget(p => ({ ...p, category: "" }));
                             } else {
                               setEditSupplierTarget(p => ({ ...p, category: e.target.value }));
                             }
                           }}
                           className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all bg-[#F8FAFC]"
                         >
                           <option value="Parts">Parts</option>
                           <option value="Tools">Tools</option>
                           <option value="Electronics">Electronics</option>
                           <option value="Accessories">Accessories</option>
                           <option value="Other">Other (Enter Manually)</option>
                         </select>
                      </div>
                      {!["Parts", "Tools", "Electronics", "Accessories"].includes(editSupplierTarget.category) && (
                        <div className="col-span-2 animate-in slide-in-from-top-2 duration-200">
                           <label className="block text-[11px] font-black text-[#4F46E5] uppercase tracking-widest mb-2">Specify Other Category</label>
                           <input 
                             value={editSupplierTarget.category} 
                             onChange={e => setEditSupplierTarget(p => ({ ...p, category: e.target.value }))} 
                             type="text" 
                             className="w-full h-10 rounded-xl border-2 border-indigo-100 px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all bg-indigo-50/30" 
                           />
                        </div>
                      )}
                      <div className="col-span-2">
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Business Address</label>
                         <textarea value={editSupplierTarget.address} onChange={e=>setEditSupplierTarget(p=>({...p,address:e.target.value}))} className="w-full h-16 rounded-xl border border-border p-3 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all resize-none" />
                      </div>
                   </div>
                   <div className="pt-6">
                      <button onClick={handleEditSupplier} className="w-full h-10 rounded-2xl bg-[#4F46E5] text-white text-[15px] font-black shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all uppercase tracking-tight">Update Supplier Records</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* 🔴 DELETE SUPPLIER CONFIRMATION */}
        {deleteSupplierTarget && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden p-8 text-center animate-in zoom-in-95 duration-200">
                <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-[20px] font-black text-[#0F172A] mb-2 leading-none tracking-tight">Remove Supplier?</h2>
                <p className="text-[13px] text-slate-500 font-bold mb-8">Are you sure you want to delete <span className="text-[#0F172A] font-black">{deleteSupplierTarget.name}</span>? This action is irreversible.</p>
                <div className="flex flex-col gap-3">
                   <button onClick={handleDeleteSupplier} className="h-12 rounded-xl bg-red-600 text-white text-[14px] font-black shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all uppercase">Confirm Deletion</button>
                   <button onClick={() => setDeleteSupplierTarget(null)} className="h-12 rounded-xl border border-border text-[14px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase">Cancel</button>
                </div>
             </div>
          </div>
        )}

        {/* 🔴 DELETE PURCHASE ORDER CONFIRMATION */}
        {deletePOTarget && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden p-8 text-center animate-in zoom-in-95 duration-200">
                <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-[20px] font-black text-[#0F172A] mb-2 leading-none tracking-tight">Delete Order #{deletePOTarget.orderNumber}?</h2>
                <p className="text-[13px] text-slate-500 font-bold mb-8">This will permanently remove this purchase record. Ensure this action is authorized.</p>
                <div className="flex flex-col gap-3">
                   <button onClick={handleDeletePO} className="h-12 rounded-xl bg-red-600 text-white text-[14px] font-black shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all uppercase">Confirm Delete</button>
                   <button onClick={() => setDeletePOTarget(null)} className="h-12 rounded-xl border border-border text-[14px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase">Cancel</button>
                </div>
             </div>
          </div>
        )}

        {/* 🔵 EDIT PURCHASE ORDER MODAL */}
        {editPOTarget && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-t-8 border-[#4F46E5]">
                <div className="bg-[#F8FAFC] p-8 border-b border-border flex justify-between items-center">
                   <div>
                      <h2 className="text-[24px] font-black text-[#0F172A] mb-1 leading-none tracking-tight">Edit Order #{editPOTarget.orderNumber}</h2>
                      <p className="text-[12px] text-[#4F46E5] font-black uppercase tracking-widest">Update order status and administrative notes</p>
                   </div>
                   <button onClick={() => setEditPOTarget(null)} className="h-9 w-9 rounded-full bg-white border border-border flex items-center justify-center transition-all focus:outline-none"><X className="h-4 w-4" /></button>
                </div>
                <div className="p-10 space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Order Status</label>
                         <select 
                           value={editPOTarget.status}
                           onChange={e=>setEditPOTarget(p=>({...p,status:e.target.value}))}
                           className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all bg-[#F8FAFC]"
                         >
                            <option value="DRAFT">DRAFT</option>
                            <option value="SENT">SENT</option>
                            <option value="RECEIVED">RECEIVED</option>
                            <option value="CANCELLED">CANCELLED</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Supplier (Read-Only)</label>
                         <input value={editPOTarget.supplier?.name} disabled className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold bg-slate-50 text-slate-400" />
                      </div>
                      <div className="col-span-2">
                         <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Administrative Notes</label>
                         <textarea 
                           value={editPOTarget.notes || ""} 
                           onChange={e=>setEditPOTarget(p=>({...p,notes:e.target.value}))}
                           placeholder="Internal comments regarding this procurement..."
                           className="w-full h-32 rounded-xl border border-border p-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all resize-none" 
                         />
                      </div>
                   </div>
                   <div className="pt-6">
                      <button 
                        onClick={async () => {
                          try {
                            await updatePurchaseOrder({ id: editPOTarget.id, status: editPOTarget.status, notes: editPOTarget.notes }).unwrap();
                            toast.success("Purchase order updated!");
                            setEditPOTarget(null);
                          } catch (err) {
                            toast.error("Update failed.");
                          }
                        }} 
                        className="w-full h-14 rounded-2xl bg-[#4F46E5] text-white text-[15px] font-black shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all uppercase tracking-tight"
                      >
                        Save Changes
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {isRequestStockOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-t-8 border-[#4F46E5]">
                <div className="bg-[#F8FAFC] p-8 border-b border-border flex justify-between items-center">
                   <div>
                      <h2 className="text-[24px] font-black text-[#0F172A] mb-1 leading-none tracking-tight">Request Stock (Purchase Order)</h2>
                      <p className="text-[12px] text-[#4F46E5] font-black uppercase tracking-widest">Draft a new order for inventory replenishment</p>
                   </div>
                   <button onClick={() => setIsRequestStockOpen(false)} className="h-9 w-9 rounded-full bg-white border border-border flex items-center justify-center transition-all focus:outline-none"><X className="h-4 w-4" /></button>
                </div>
                <div className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
                   <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Supplier</label>
                      <select 
                        value={poDraftForm.supplierId}
                        onChange={e=>setPoDraftForm(p=>({...p,supplierId:e.target.value}))}
                        className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all bg-[#F8FAFC]"
                      >
                         <option value="">Select a vendor...</option>
                         {suppliers.map((s: any) => (
                           <option key={s.id} value={s.id}>{s.name}</option>
                         ))}
                      </select>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <h4 className="text-[14px] font-black text-[#0F172A]">Order Items</h4>
                         <button 
                           onClick={() => setPoDraftForm(p=>({...p, items: [...p.items, { partId: "", partName: "", quantity: 1, unitCost: 0, sku: "" }]}))}
                           className="text-[11px] font-black text-[#4F46E5] uppercase hover:underline"
                         >
                           + Add Item
                         </button>
                      </div>
                      
                      {poDraftForm.items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-3 p-4 bg-slate-50 rounded-2xl border border-border/50">
                           <div className="col-span-6">
                              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Link to Inventory Part</label>
                              <select 
                                value={item.partId}
                                onChange={e => {
                                  const selectedPart = inventoryState.find(p => p.id === e.target.value);
                                  const newItems = [...poDraftForm.items];
                                  newItems[idx].partId = e.target.value;
                                  newItems[idx].partName = selectedPart?.name || "";
                                  newItems[idx].sku = selectedPart?.code || "";
                                  setPoDraftForm(p=>({...p, items: newItems}));
                                }}
                                className="w-full h-9 rounded-lg border border-border px-3 text-[12px] font-bold bg-white"
                              >
                                <option value="">Select an existing part...</option>
                                {inventoryState.map(p => (
                                  <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                                ))}
                              </select>
                           </div>
                           <div className="col-span-3">
                              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Qty</label>
                              <input 
                                type="number"
                                value={item.quantity}
                                onChange={e => {
                                  const newItems = [...poDraftForm.items];
                                  newItems[idx].quantity = Number(e.target.value);
                                  setPoDraftForm(p=>({...p, items: newItems}));
                                }}
                                className="w-full h-9 rounded-lg border border-border px-3 text-[12px] font-bold"
                              />
                           </div>
                           <div className="col-span-3">
                              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Cost</label>
                              <input 
                                type="number"
                                value={item.unitCost}
                                onChange={e => {
                                  const newItems = [...poDraftForm.items];
                                  newItems[idx].unitCost = Number(e.target.value);
                                  setPoDraftForm(p=>({...p, items: newItems}));
                                }}
                                className="w-full h-9 rounded-lg border border-border px-3 text-[12px] font-bold"
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                   
                   <div className="pt-6 border-t border-border mt-6">
                      <div className="flex justify-between items-center mb-6">
                         <span className="text-[14px] font-bold text-slate-500 uppercase">Estimated Total</span>
                         <span className="text-[20px] font-black text-[#0F172A]">Rs. {poDraftForm.items.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0).toLocaleString()}</span>
                      </div>
                      <button onClick={handleCreatePO} className="w-full h-14 rounded-2xl bg-[#4F46E5] text-white text-[15px] font-black shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all uppercase tracking-tight">Submit Purchase Order</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {isAddItemOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-t-8 border-[#4F46E5] max-h-[90vh] flex flex-col">
                <div className="bg-[#F8FAFC] p-6 border-b border-border flex justify-between items-center">
                   <div>
                      <h2 className="text-[22px] font-black text-[#0F172A] mb-1 leading-none tracking-tight">{mounted ? t('inventoryPage.registerItem') : 'Register Inventory Item'}</h2>
                      <p className="text-[11px] text-[#4F46E5] font-black uppercase tracking-widest">{mounted ? t('inventoryPage.createSkuRecord') : 'Create a new SKU record in the system'}</p>
                   </div>
                   <button onClick={() => setIsAddItemOpen(false)} className="h-9 w-9 rounded-full bg-white border border-border flex items-center justify-center hover:bg-slate-50 transition-all focus:outline-none"><X className="h-4 w-4" /></button>
                </div>
                <div className="p-8 grid grid-cols-2 gap-x-8 gap-y-4 overflow-y-auto flex-1">
                   <div className="col-span-2 md:col-span-1">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{mounted ? t('inventoryPage.itemName') : 'Item Name'}</label>
                      <input value={addItemForm.name} onChange={e=>setAddItemForm(p=>({...p,name:e.target.value}))} type="text" placeholder="e.g. iPhone 13 Pro Screen" className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all placeholder:text-slate-300" />
                   </div>
                   <div className="col-span-2 md:col-span-1">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{mounted ? t('inventoryPage.skuCode') : 'SKU / Item Code'}</label>
                      <input value={addItemForm.sku} onChange={e=>setAddItemForm(p=>({...p,sku:e.target.value}))} type="text" placeholder="SCR-001" className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all placeholder:text-slate-300" />
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{mounted ? t('inventoryPage.brand') : 'Brand'}</label>
                      <select value={addItemForm.brand} onChange={e=>setAddItemForm(p=>({...p,brand:e.target.value}))} className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all bg-[#F8FAFC]">
                         <option>Apple</option>
                         <option>Samsung</option>
                         <option>Xiaomi</option>
                         <option>Other</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{mounted ? t('inventoryPage.category') : 'Category'}</label>
                      <select value={addItemForm.category} onChange={e=>setAddItemForm(p=>({...p,category:e.target.value}))} className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all bg-[#F8FAFC]">
                         <option>Screens</option>
                         <option>Batteries</option>
                         <option>Charging Ports</option>
                         <option>Tools</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Stock Value (Cost) / Item</label>
                      <input value={addItemForm.costPrice || ""} onChange={e=>setAddItemForm(p=>({...p,costPrice:Number(e.target.value)}))} type="number" placeholder="8500" className="w-full h-12 rounded-xl border border-border px-4 text-[14px] font-black focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all" />
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{mounted ? t('inventoryPage.sellingPrice') : 'Selling Price (LKR)'}</label>
                      <input value={addItemForm.price || ""} onChange={e=>setAddItemForm(p=>({...p,price:Number(e.target.value)}))} type="number" placeholder="12500" className="w-full h-12 rounded-xl border border-border px-4 text-[14px] font-black focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all" />
                   </div>
                   <div className="col-span-2">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{mounted ? t('inventoryPage.currentStock') : 'Current Stock'}</label>
                      <input value={addItemForm.stockQuantity || ""} onChange={e=>setAddItemForm(p=>({...p,stockQuantity:Number(e.target.value)}))} type="number" placeholder="45" className="w-full h-12 rounded-xl border border-border px-4 text-[14px] font-black focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all" />
                   </div>
                   <div className="col-span-2 pt-6">
                      <div className="flex gap-4">
                         <button onClick={() => setIsAddItemOpen(false)} className="flex-1 h-14 rounded-2xl border border-border bg-white text-[14px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-tight">{mounted ? t('inventoryPage.discard') : 'Discard'}</button>
                         <button onClick={handleAddItem} className="flex-[2] h-14 rounded-2xl bg-[#4F46E5] text-white text-[14px] font-black shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all uppercase tracking-tight">{mounted ? t('inventoryPage.createProductRecord') : 'Create Product Record'}</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {editItemTarget && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-t-8 border-[#4F46E5] max-h-[90vh] flex flex-col">
                <div className="bg-[#F8FAFC] p-6 border-b border-border flex justify-between items-center">
                   <div>
                      <h2 className="text-[22px] font-black text-[#0F172A] mb-1 leading-none tracking-tight">{mounted ? t('inventoryPage.editSkuRecord') : 'Edit SKU Record'}</h2>
                      <p className="text-[11px] text-[#4F46E5] font-black uppercase tracking-widest">Editing: {editItemTarget.code}</p>
                   </div>
                   <button onClick={() => setEditItemTarget(null)} className="h-9 w-9 rounded-full bg-white border border-border flex items-center justify-center transition-all focus:outline-none"><X className="h-4 w-4" /></button>
                </div>
                <div className="p-8 grid grid-cols-2 gap-x-8 gap-y-4 overflow-y-auto flex-1">
                   <div className="col-span-2">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{mounted ? t('inventoryPage.itemDisplayName') : 'Item Display Name'}</label>
                      <input value={editItemTarget.name} onChange={e=>setEditItemTarget(p=>p?{...p,name:e.target.value}:p)} type="text" className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 focus:border-[#4F46E5] outline-none transition-all" />
                   </div>
                   <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{mounted ? t('inventoryPage.category') : 'Category'}</label>
                      <select value={editItemTarget.category} onChange={e=>setEditItemTarget(p=>p?{...p,category:e.target.value}:p)} className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold outline-none bg-[#F8FAFC]">
                         <option>Screens</option>
                         <option>Batteries</option>
                         <option>Charging Ports</option>
                         <option>Tools</option>
                      </select>
                   </div>
                   <div>
                       <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{mounted ? t('inventoryPage.supplier') : 'Supplier'}</label>
                      <select value={editItemTarget.supplier} onChange={e=>setEditItemTarget(p=>p?{...p,supplier:e.target.value}:p)} className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold outline-none bg-[#F8FAFC]">
                         <option>Tech Supplies Inc</option>
                         <option>Mobile Parts Co</option>
                         <option>Tool Masters</option>
                      </select>
                   </div>
                   <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Update Cost Price (LKR)</label>
                       <input value={editItemTarget.costPrice || ""} onChange={e=>setEditItemTarget(p=>p?{...p,costPrice:Number(e.target.value)}:p)} type="number" className="w-full h-12 rounded-xl border border-border px-4 text-[14px] font-black" />
                   </div>
                   <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{mounted ? t('inventoryPage.updatePrice') : 'Update Price (LKR)'}</label>
                       <input value={editItemTarget.price || ""} onChange={e=>setEditItemTarget(p=>p?{...p,price:Number(e.target.value)}:p)} type="number" className="w-full h-12 rounded-xl border border-border px-4 text-[14px] font-black" />
                   </div>
                   <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{mounted ? t('inventoryPage.storageLocation') : 'Storage Location'}</label>
                       <input value={editItemTarget.location || ""} onChange={e=>setEditItemTarget(p=>p?{...p,location:e.target.value}:p)} type="text" className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold" />
                   </div>
                   <div className="col-span-2 pt-6">
                        <button onClick={handleUpdateItem} className="w-full h-14 rounded-2xl bg-[#4F46E5] text-white text-[15px] font-black shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all uppercase tracking-tight">{mounted ? t('inventoryPage.updateItemRecord') : 'Update Item Record'}</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {viewDetailsTarget && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-[#F8FAFC] p-8 border-b border-border flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-[#4F46E5] flex items-center justify-center text-white shadow-lg">
                         <Package className="h-7 w-7" />
                      </div>
                      <div>
                         <h2 className="text-[20px] font-black text-[#0F172A] leading-tight">{viewDetailsTarget.name}</h2>
                         <p className="text-[11px] text-[#4F46E5] font-black uppercase tracking-widest">{viewDetailsTarget.code}</p>
                      </div>
                   </div>
                   <button onClick={() => setViewDetailsTarget(null)} className="h-10 w-10 rounded-full bg-white border border-border flex items-center justify-center hover:bg-slate-50 transition-all focus:outline-none"><X className="h-5 w-5" /></button>
                </div>
                <div className="p-8">
                   <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-border/50">
                         <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Current Stock</p>
                         <p className="text-[20px] font-black text-[#0F172A]">{viewDetailsTarget.stock} Units</p>
                      </div>
                      <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-border/50">
                         <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Selling Price</p>
                         <p className="text-[20px] font-black text-[#10B981]">Rs. {viewDetailsTarget.price.toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-border/50">
                         <span className="text-[12px] font-bold text-slate-500 uppercase">Brand Compatibility</span>
                         <span className="text-[13px] font-black text-[#0F172A]">{viewDetailsTarget.brand}</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border/50">
                         <span className="text-[12px] font-bold text-slate-500 uppercase">Primary Category</span>
                         <span className="text-[13px] font-black text-[#0F172A]">{viewDetailsTarget.category}</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border/50">
                         <span className="text-[12px] font-bold text-slate-500 uppercase">Main Supplier</span>
                         <span className="text-[13px] font-black text-[#0F172A]">{viewDetailsTarget.supplier}</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                         <span className="text-[12px] font-bold text-slate-500 uppercase">Shelf Location</span>
                         <span className="text-[13px] font-black text-[#0F172A]">Bay {viewDetailsTarget.location}</span>
                      </div>
                   </div>
                   <div className="mt-8">
                      <button onClick={() => setViewDetailsTarget(null)} className="w-full h-12 rounded-xl border border-border text-[13px] font-black text-slate-600 hover:bg-slate-50 transition-all">Close View</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {isAdjustStockOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-t-8 border-[#4F46E5]">
              <div className="bg-[#F8FAFC] p-8 border-b border-border">
                <h2 className="text-[24px] font-black text-[#0F172A] mb-1 leading-none tracking-tight">Quick Stock Adjust</h2>
                <p className="text-[12px] text-[#4F46E5] font-black uppercase tracking-widest">Update inventory ledger without full edit</p>
              </div>
              <div className="p-10 space-y-6">
                <div>
                  <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Select Item</label>
                  <select
                    value={adjustStockForm.itemCode}
                    onChange={e => setAdjustStockForm(p => ({ ...p, itemCode: e.target.value }))}
                    className="w-full h-12 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-4 focus:ring-[#4F46E5]/5 outline-none bg-[#F8FAFC] appearance-none"
                  >
                    {inventoryState.map(i => (
                      <option key={i.code} value={i.code}>{i.name} ({i.code})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Current Stock</label>
                    <input
                      value={`${inventoryState.find(i => i.code === adjustStockForm.itemCode)?.stock || 0} units`}
                      disabled
                      className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold bg-[#F1F5F9] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">Action</label>
                    <select
                      value={adjustStockForm.action}
                      onChange={e => setAdjustStockForm(p => ({ ...p, action: e.target.value }))}
                      className="w-full h-11 rounded-xl border border-border px-4 text-[13px] font-bold focus:ring-2 focus:ring-[#4F46E5]/20 outline-none bg-[#F8FAFC]"
                    >
                      <option value="set">Set New Count</option>
                      <option value="add">Add Quantity (+)</option>
                      <option value="subtract">Subtract Quantity (-)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0F172A] mb-2 uppercase tracking-wide">New Quantity / Adjustment</label>
                  <input
                    value={adjustStockForm.adjustmentValue || ""}
                    onChange={e => setAdjustStockForm(p => ({ ...p, adjustmentValue: Number(e.target.value) }))}
                    type="number"
                    placeholder="Enter number..."
                    className="w-full h-14 rounded-2xl border-2 border-border px-6 text-[18px] font-black focus:border-[#4F46E5] outline-none transition-all"
                  />
                </div>
                <div className="pt-4 flex gap-4">
                  <button onClick={() => setIsAdjustStockOpen(false)} className="flex-1 h-12 rounded-xl border border-border text-[13px] font-black text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                  <button onClick={handleAdjustStock} className="flex-1 h-12 rounded-xl bg-[#0F172A] text-white text-[13px] font-black shadow-lg hover:bg-slate-800 transition-all">Update Stock Ledger</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteFormTarget && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden p-8 text-center animate-in zoom-in-95 duration-200">
                <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-[20px] font-black text-[#0F172A] mb-2">Delete Asset?</h3>
                <p className="text-[13px] text-slate-500 mb-8">Are you sure you want to remove <span className="font-black text-[#0F172A]">{deleteFormTarget.name}</span>? This action cannot be undone.</p>
                <div className="flex flex-col gap-3">
                   <button onClick={() => handleDeleteItem(deleteFormTarget.id)} className="h-12 rounded-xl bg-red-600 text-white text-[14px] font-black hover:bg-red-700 transition-all shadow-lg shadow-red-200">Confirm Deletion</button>
                   <button onClick={() => setDeleteFormTarget(null)} className="h-12 rounded-xl border border-border text-[14px] font-black text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                </div>
             </div>
          </div>
        )}

        {/* 🔵 PO DETAIL MODAL */}
        {viewPOTarget && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-t-8 border-[#4F46E5]">
              {/* Header */}
              <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] p-8 flex justify-between items-start">
                <div>
                  <p className="text-[11px] text-indigo-200 font-black uppercase tracking-widest mb-1">Purchase Order</p>
                  <h2 className="text-[28px] font-black text-white leading-tight tracking-tight">{viewPOTarget.orderNumber}</h2>
                  <p className="text-[12px] text-indigo-200 mt-1">{new Date(viewPOTarget.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest ${
                    viewPOTarget.status === 'RECEIVED' ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30' :
                    viewPOTarget.status === 'SENT' ? 'bg-blue-400/20 text-blue-200 border border-blue-400/30' :
                    viewPOTarget.status === 'CANCELLED' ? 'bg-red-400/20 text-red-200 border border-red-400/30' :
                    'bg-white/10 text-white/80 border border-white/20'
                  }`}>{viewPOTarget.status}</span>
                  <button onClick={() => setViewPOTarget(null)} className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Supplier + Meta */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-border/50">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Supplier</p>
                    <p className="text-[15px] font-black text-[#0F172A]">{viewPOTarget.supplier?.name || '—'}</p>
                    {viewPOTarget.supplier?.email && <p className="text-[11px] text-slate-400 mt-0.5">{viewPOTarget.supplier.email}</p>}
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-border/50">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Order Total</p>
                    <p className="text-[22px] font-black text-[#4F46E5]">Rs. {Number(viewPOTarget.totalAmount).toLocaleString()}</p>
                  </div>
                </div>

                {/* Notes */}
                {viewPOTarget.notes && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                    <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mb-1">Notes</p>
                    <p className="text-[13px] text-slate-700 font-medium">{viewPOTarget.notes}</p>
                  </div>
                )}

                {/* Line Items */}
                {viewPOTarget.items && viewPOTarget.items.length > 0 && (
                  <div>
                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-3">Order Items</p>
                    <div className="rounded-xl border border-border/50 overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-border/60">
                            <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Part Name</th>
                            <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Qty</th>
                            <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Unit Cost</th>
                            <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {viewPOTarget.items.map((item: any, i: number) => (
                            <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 text-[13px] font-bold text-[#0F172A]">{item.partName || '—'}</td>
                              <td className="px-4 py-3 text-[13px] font-black text-center text-[#4F46E5]">{item.quantity}</td>
                              <td className="px-4 py-3 text-[13px] text-right text-slate-600">Rs. {Number(item.unitCost).toLocaleString()}</td>
                              <td className="px-4 py-3 text-[13px] font-black text-right text-[#0F172A]">Rs. {(item.quantity * item.unitCost).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Update Status */}
                <div className="pt-2 border-t border-border/50">
                  <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-3">Update Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {['DRAFT','SENT','RECEIVED','CANCELLED'].map(s => (
                      <button
                        key={s}
                        onClick={() => updatePOStatus({ id: viewPOTarget.id, status: s }).unwrap()
                          .then(() => { toast.success(`PO status → ${s}`); setViewPOTarget({...viewPOTarget, status: s}); })
                          .catch(() => toast.error('Failed to update status'))}
                        className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                          viewPOTarget.status === s
                            ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-md scale-105'
                            : 'bg-white text-slate-500 border-border hover:border-[#4F46E5] hover:text-[#4F46E5]'
                        }`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-8 py-5 bg-slate-50 border-t border-border flex justify-between items-center">
                <p className="text-[11px] text-slate-400 font-bold">ID: {viewPOTarget.id?.substring(0, 16)}...</p>
                <button onClick={() => setViewPOTarget(null)} className="h-10 px-6 rounded-xl border border-border text-[13px] font-black text-slate-600 hover:bg-white transition-all">Close</button>
              </div>
            </div>
          </div>
        )}

              {/* 🛠️ INVISIBLE PDF RENDER TARGET FOR INVENTORY REPORT */}
        <div className="fixed -left-[4000px] pointer-events-none opacity-0 select-none overflow-hidden h-0 w-0">
           <div 
             ref={hiddenInventoryReportRef}
             className="w-[1000px] bg-white p-16 flex flex-col min-h-[1400px]"
           >
              {/* BRANDING HEADER */}
              <div className="flex justify-between items-start mb-16">
                  <div>
                     <div className="flex items-center gap-3 mb-3">
                       <div className="h-12 w-12 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg">S</div>
                       <h2 className="text-[32px] font-black text-[#0F172A] tracking-tighter uppercase">SRM Solutions</h2>
                     </div>
                     <div className="text-[12px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        <p className="flex items-center gap-2 text-[#4F46E5]"><Package className="h-4 w-4" /> Global Inventory Status</p>
                        <p>Automated Asset Report</p>
                        <p>Internal Record #INV-{new Date().getFullYear()}</p>
                     </div>
                  </div>
                  <div className="text-right text-[12px] text-slate-400 font-black uppercase tracking-widest leading-relaxed pt-2">
                        <p>Head Office Warehouse</p>
                        <p>Colombo 07, Sri Lanka</p>
                         <p className="text-[#4F46E5] mt-1 italic underline underline-offset-4 decoration-slate-200">Generated: {mounted ? new Date().toLocaleString() : ""}</p>
                  </div>
              </div>

              {/* SUMMARY STATS GRID */}
              <div className="grid grid-cols-4 gap-6 mb-12">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total SKUs</p>
                      <p className="text-[28px] font-black text-[#0F172A] leading-none">{inventoryState.length}</p>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
                      <p className="text-[10px] text-emerald-600/70 font-black uppercase tracking-widest mb-1">Healthy Stock</p>
                      <p className="text-[28px] font-black text-emerald-700 leading-none">{inventoryState.filter(i=>i.status==='In Stock').length}</p>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 shadow-sm">
                      <p className="text-[10px] text-orange-600/70 font-black uppercase tracking-widest mb-1">Critical Low</p>
                      <p className="text-[28px] font-black text-orange-700 leading-none">{inventoryState.filter(i=>['Low Stock','Out of Stock'].includes(i.status)).length}</p>
                  </div>
                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
                      <p className="text-[10px] text-indigo-600/70 font-black uppercase tracking-widest mb-1">Stock Value</p>
                      <p className="text-[28px] font-black text-indigo-700 leading-none">2.8M</p>
                  </div>
              </div>

              {/* DATA TABLE */}
              <div className="flex-1">
                  <table className="w-full text-left border-collapse border-y-2 border-[#0F172A]">
                      <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="px-5 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Item / SKU</th>
                              <th className="px-5 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Meta</th>
                              <th className="px-5 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Stock</th>
                              <th className="px-5 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Unit Price</th>
                              <th className="px-5 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Total (LKR)</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {inventoryState.map((i) => (
                            <tr key={i.code} className="bg-white">
                               <td className="px-5 py-4">
                                  <p className="text-[14px] font-black text-[#0F172A] mb-0.5">{i.name}</p>
                                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{i.code}</p>
                               </td>
                               <td className="px-5 py-4">
                                  <p className="text-[12px] font-bold text-[#0F172A]">{i.brand}</p>
                                  <p className="text-[11px] text-slate-400">{i.category}</p>
                               </td>
                               <td className="px-5 py-4">
                                  <div className="flex items-center gap-2">
                                     <span 
                                       className="text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-widest"
                                       style={{
                                         backgroundColor: i.status === 'In Stock' ? '#ecfdf5' : i.status === 'Low Stock' ? '#fffbeb' : '#fef2f2',
                                         color: i.status === 'In Stock' ? '#047857' : i.status === 'Low Stock' ? '#b45309' : '#b91c1c',
                                         borderColor: i.status === 'In Stock' ? '#a7f3d0' : i.status === 'Low Stock' ? '#fde68a' : '#fecaca',
                                       }}
                                     >
                                       {i.stock} units
                                     </span>
                                  </div>
                               </td>
                               <td className="px-5 py-4 text-right text-[13px] font-bold text-[#0F172A]">
                                 Rs. {(i.price || 0).toLocaleString()}
                               </td>
                               <td className="px-5 py-4 text-right font-black text-[#0F172A]">
                                 Rs. {(i.price * i.stock).toLocaleString()}
                               </td>
                            </tr>
                          ))}
                      </tbody>
                  </table>
              </div>

              {/* FOOTER */}
              <div className="mt-20 pt-12 border-t border-slate-100 border-dashed">
                  <div className="flex justify-between items-center">
                      <p className="text-[12px] font-black text-[#0F172A] flex items-center gap-2">
                         <ArrowUpRight className="h-4 w-4 text-[#4F46E5]" /> 
                         Automated Record Sync: SRM Warehouse v4.2
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         Classification: Internal Only
                      </p>
                  </div>
              </div>
            </div>
        </div>

        {/* 🧾 INVISIBLE PO PDF RENDER TARGET */}
        <div className="fixed -left-[4000px] pointer-events-none opacity-0 select-none overflow-hidden h-0 w-0">
          <div ref={poPdfRef} className="bg-white p-14 flex flex-col" style={{ width: '794px', minHeight: '1123px' }}>
            {poPdfTarget && (
              <>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:48, paddingBottom:24, borderBottom:'2px solid #0f172a' }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                      <div style={{ width:44, height:44, backgroundColor:'#4F46E5', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:20 }}>S</div>
                      <span style={{ fontSize:24, fontWeight:900, color:'#0F172A', letterSpacing:'-0.5px' }}>SRM Solutions</span>
                    </div>
                    <p style={{ fontSize:10, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'2px' }}>Purchase Order</p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontSize:26, fontWeight:900, color:'#4F46E5', letterSpacing:'-1px' }}>{poPdfTarget.orderNumber}</p>
                    <p style={{ fontSize:11, color:'#64748b', marginTop:4 }}>{new Date(poPdfTarget.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
                    <span style={{ display:'inline-block', marginTop:6, padding:'3px 10px', borderRadius:20, fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'1px', backgroundColor: poPdfTarget.status==='RECEIVED'?'#ecfdf5': poPdfTarget.status==='SENT'?'#eff6ff': poPdfTarget.status==='CANCELLED'?'#fef2f2':'#f8fafc', color: poPdfTarget.status==='RECEIVED'?'#047857': poPdfTarget.status==='SENT'?'#1d4ed8': poPdfTarget.status==='CANCELLED'?'#b91c1c':'#475569' }}>{poPdfTarget.status}</span>
                  </div>
                </div>
                <div style={{ marginBottom:32 }}>
                  <p style={{ fontSize:9, color:'#94a3b8', fontWeight:900, textTransform:'uppercase', letterSpacing:'2px', marginBottom:6 }}>Supplier</p>
                  <p style={{ fontSize:15, fontWeight:900, color:'#0f172a' }}>{poPdfTarget.supplier?.name||'—'}</p>
                  {poPdfTarget.supplier?.email && <p style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{poPdfTarget.supplier.email}</p>}
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:24 }}>
                  <thead>
                    <tr style={{ backgroundColor:'#0f172a' }}>
                      {['#','Part Name','Qty','Unit Cost','Total'].map(h=>(
                        <th key={h} style={{ padding:'9px 14px', fontSize:9, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:'1px', textAlign: h==='Qty'?'center': h==='Unit Cost'||h==='Total'?'right':'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(poPdfTarget.items||[]).map((item:any, idx:number)=>(
                      <tr key={idx} style={{ backgroundColor:idx%2===0?'#f8fafc':'#fff', borderBottom:'1px solid #e2e8f0' }}>
                        <td style={{ padding:'9px 14px', fontSize:11, color:'#94a3b8' }}>{idx+1}</td>
                        <td style={{ padding:'9px 14px', fontSize:13, fontWeight:700, color:'#0f172a' }}>{item.partName||'—'}</td>
                        <td style={{ padding:'9px 14px', fontSize:13, fontWeight:900, color:'#4F46E5', textAlign:'center' }}>{item.quantity}</td>
                        <td style={{ padding:'9px 14px', fontSize:12, color:'#374151', textAlign:'right' }}>Rs. {Number(item.unitCost).toLocaleString()}</td>
                        <td style={{ padding:'9px 14px', fontSize:13, fontWeight:900, color:'#0f172a', textAlign:'right' }}>Rs. {(item.quantity*item.unitCost).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:32 }}>
                  <div style={{ width:260, borderTop:'2px solid #0f172a', paddingTop:10 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', paddingTop:8, borderTop:'1px solid #e2e8f0', marginTop:6 }}>
                      <span style={{ fontSize:13, fontWeight:900, color:'#0f172a', textTransform:'uppercase' }}>Grand Total</span>
                      <span style={{ fontSize:16, fontWeight:900, color:'#4F46E5' }}>Rs. {Number(poPdfTarget.totalAmount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                {poPdfTarget.notes && (
                  <div style={{ backgroundColor:'#fefce8', border:'1px solid #fde68a', borderRadius:10, padding:14, marginBottom:24 }}>
                    <p style={{ fontSize:9, color:'#92400e', fontWeight:900, textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:4 }}>Notes</p>
                    <p style={{ fontSize:12, color:'#374151' }}>{poPdfTarget.notes}</p>
                  </div>
                )}
                <div style={{ marginTop:'auto', paddingTop:20, borderTop:'1px dashed #cbd5e1', display:'flex', justifyContent:'space-between' }}>
                  <p style={{ fontSize:10, fontWeight:900, color:'#0f172a' }}>SRM Solutions · Colombo, Sri Lanka</p>
                  <p style={{ fontSize:9, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px' }}>Generated: {mounted ? new Date().toLocaleString() : ''}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
