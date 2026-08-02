"use client"

import { useState, useMemo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar"
import { DashboardHeader } from "@/components/admin/dashboard/header"
import { useGetInventoryItemsQuery } from "@/services/api/inventoryApiSlice"
import { useCreateInvoiceMutation } from "@/services/api/invoicesApiSlice"
import { useGetCustomersQuery, useCreateCustomerMutation, useSendCustomerSMSMutation } from "@/services/api/customersApiSlice"
import { generateClientInvoicePDF } from "@/lib/pdf-generator"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import {
  Search,
  Grid2X2,
  Plus,
  UserPlus,
  Minus,
  X,
  ShoppingCart,
  User,
  CreditCard,
  Banknote,
  Printer,
  CheckCircle,
  ArrowLeft,
  Download,
  Package,
  ChevronRight,
  FileText,
  MessageSquare,
  ListOrdered,
  RefreshCw,
} from "lucide-react"

interface CartItem {
  id: string
  partName: string
  category: string
  sku: string
  unitCost: number
  price: number
  availableStock: number
  quantity: number
  location?: string
}

// Two right-panel tabs
type SidebarTab = "CART" | "ORDER"

export default function POSPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user)

  // API Data - always fetch fresh so images are never stale
  const { data: inventoryData, isLoading: isInventoryLoading, refetch: refetchInventory } = useGetInventoryItemsQuery({}, { refetchOnMountOrArgChange: true })
  const { data: customersData } = useGetCustomersQuery({})

  const rawInventory = useMemo(() => {
    if (!inventoryData) return []
    if (Array.isArray(inventoryData)) return inventoryData
    if (Array.isArray((inventoryData as any).items)) return (inventoryData as any).items
    if (Array.isArray((inventoryData as any).data)) return (inventoryData as any).data
    return []
  }, [inventoryData])

  const customersList = useMemo(() => {
    if (!customersData) return []
    if (Array.isArray(customersData)) return customersData
    if (Array.isArray((customersData as any).customers)) return (customersData as any).customers
    if (Array.isArray((customersData as any).data)) return (customersData as any).data
    return []
  }, [customersData])

  // Screen State: 'POS' | 'CONFIRM'
  const [step, setStep] = useState<"POS" | "CONFIRM">("POS")

  // Catalog Filter State
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")

  // Cart & Order State
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string; phone?: string } | null>({
    id: "walk-in",
    name: "Walk-in Customer",
    phone: "N/A"
  })
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card">("Cash")

  // Right Sidebar Tab State — "CART" shows cart items, "ORDER" shows customer + payment details
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("CART")

  // Modal State for Product Quantity Picker
  const [selectedProductForModal, setSelectedProductForModal] = useState<any | null>(null)
  const [modalQty, setModalQty] = useState(1)

  // Customer Selector Modal State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [customerSearchQuery, setCustomerSearchQuery] = useState("")

  // Add New Customer Modal State (POS)
  const [isAddPosCustomerOpen, setIsAddPosCustomerOpen] = useState(false)
  const [newPosCustomer, setNewPosCustomer] = useState({ name: "", phone: "", email: "", address: "" })

  // API Mutations
  const [createInvoice, { isLoading: isSavingSale }] = useCreateInvoiceMutation()
  const [createCustomer, { isLoading: isCreatingCustomer }] = useCreateCustomerMutation()
  const [sendCustomerSMS] = useSendCustomerSMSMutation()

  const handleCreatePosCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosCustomer.name || !newPosCustomer.phone) {
      toast.error("Customer name and phone number are required");
      return;
    }
    try {
      const created = await createCustomer({
        name: newPosCustomer.name,
        phone: newPosCustomer.phone,
        email: newPosCustomer.email,
        address: newPosCustomer.address,
        shopId: user?.shopId,
        tenantId: user?.tenantId
      }).unwrap();
      const newCustObj = created?.data || created;
      const custId = newCustObj?.id || newCustObj?.customerId || created?.customerId;
      
      setSelectedCustomer({
        id: custId,
        name: newPosCustomer.name,
        phone: newPosCustomer.phone
      });
      setIsAddPosCustomerOpen(false);
      setIsCustomerModalOpen(false);
      setNewPosCustomer({ name: "", phone: "", email: "", address: "" });
      toast.success(`Customer "${newPosCustomer.name}" created and selected!`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create customer");
    }
  };

  // Custom categories added by user (stored locally; products added separately)
  const [customCategories, setCustomCategories] = useState<string[]>([])

  // Add Category Modal State
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDesc, setNewCategoryDesc] = useState("")

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const catUpper = newCategoryName.trim().toUpperCase();
    if (!catUpper) {
      toast.error("Category name is required.");
      return;
    }
    // Check for duplicates (existing inventory categories + custom)
    if (customCategories.includes(catUpper)) {
      toast.error(`Category "${catUpper}" already exists.`);
      return;
    }
    setCustomCategories((prev) => [...prev, catUpper]);
    setSelectedCategory(catUpper);
    setIsAddCategoryOpen(false);
    setNewCategoryName("");
    setNewCategoryDesc("");
    toast.success(`Category "${catUpper}" created! You can now add products to it.`);
  };

  // Confirm / Order Summary State
  const [currentInvoiceRef, setCurrentInvoiceRef] = useState("")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dynamic Categories extracted from inventory items
  const categories = useMemo(() => {
    const set = new Set<string>()
    set.add("ALL")
    rawInventory.forEach((item: any) => {
      if (item.category) set.add(item.category.toUpperCase())
      else if (item.partName) {
        const nameUpper = item.partName.toUpperCase()
        if (nameUpper.includes("STEEL") || nameUpper.includes("METAL")) set.add("STEEL")
        else if (nameUpper.includes("CEMENT")) set.add("CEMENT")
        else if (nameUpper.includes("PAINT")) set.add("PAINT")
        else if (nameUpper.includes("CABLE") || nameUpper.includes("WIRE") || nameUpper.includes("ELEC")) set.add("ELECTRICAL")
        else if (nameUpper.includes("PIPE") || nameUpper.includes("PLUMB")) set.add("PLUMBING")
        else set.add("GENERAL")
      }
    })
    // Merge user-created custom categories (show even if no products yet)
    customCategories.forEach((c) => set.add(c))
    return Array.from(set)
  }, [rawInventory, customCategories])

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return rawInventory.filter((item: any) => {
      const matchesSearch =
        searchQuery === "" ||
        item.partName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.partNumber?.toLowerCase().includes(searchQuery.toLowerCase())

      const itemCat = (item.category || "GENERAL").toUpperCase()
      const matchesCategory = selectedCategory === "ALL" || itemCat === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [rawInventory, searchQuery, selectedCategory])

  // Cart Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  const totalItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  const [discountAmount, setDiscountAmount] = useState<number | "">(0)

  const discount = useMemo(() => Number(discountAmount) || 0, [discountAmount])
  const totalPayable = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount])

  // Handlers for Add-to-Cart Modal
  const openProductModal = (product: any) => {
    const existingInCart = cart.find((c) => c.id === product.id)
    const initialQty = existingInCart ? existingInCart.quantity : 1
    setSelectedProductForModal(product)
    setModalQty(initialQty)
  }

  const handleAddToCart = () => {
    if (!selectedProductForModal) return
    const stock = selectedProductForModal.quantityInStock ?? selectedProductForModal.quantity ?? 99

    if (modalQty > stock) {
      toast.error(`Only ${stock} units available in stock`)
      return
    }

    setCart((prev) => {
      const idx = prev.findIndex((item) => item.id === selectedProductForModal.id)
      const itemPrice = Number(selectedProductForModal.sellingPrice ?? selectedProductForModal.price ?? selectedProductForModal.unitCost ?? 0)
      const newItem: CartItem = {
        id: selectedProductForModal.id,
        partName: selectedProductForModal.partName || selectedProductForModal.name || "Item",
        category: (selectedProductForModal.category || "GENERAL").toUpperCase(),
        sku: selectedProductForModal.sku || selectedProductForModal.partNumber || `SKU-${selectedProductForModal.id.slice(0, 4)}`,
        unitCost: itemPrice,
        price: itemPrice,
        availableStock: stock,
        quantity: modalQty,
        location: selectedProductForModal.location || "Main Store"
      }

      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = newItem
        return updated
      } else {
        return [...prev, newItem]
      }
    })

    toast.success(`${selectedProductForModal.partName || "Item"} added to cart (${modalQty} qty)`)
    setSelectedProductForModal(null)
    // Switch to CART tab to show the item was added
    setSidebarTab("CART")
  }

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  // Handle Checkout — only navigates to confirm screen
  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty! Add products first.")
      return
    }
    const now = new Date()
    const yr = String(now.getFullYear()).slice(-2)
    const mo = String(now.getMonth() + 1).padStart(2, "0")
    const dy = String(now.getDate()).padStart(2, "0")
    const rand = String(Math.floor(1000 + Math.random() * 9000))
    const refCode = `INV-${yr}${mo}${dy}-${rand}`
    setCurrentInvoiceRef(refCode)
    setStep("CONFIRM")
  }

  // Handle Download Invoice PDF
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const mappedTarget = {
        id: currentInvoiceRef,
        invoiceId: `#${currentInvoiceRef}`,
        type: "inventory_item",
        name: selectedCustomer?.name || "Walk-in Customer",
        phone: selectedCustomer?.phone || "N/A",
        amount: totalPayable,
        laborCost: 0,
        partsCost: totalPayable,
        advancePayment: 0,
        status: "Paid",
        date: new Date().toISOString(),
        items: cart.map((item) => ({
          description: item.partName,
          subText: `SKU: ${item.sku} | ${item.location || "Main Store"}`,
          qty: item.quantity,
          price: item.price,
          amount: item.price * item.quantity
        }))
      }

      await generateClientInvoicePDF(mappedTarget, {
        shopName: "Strangers Digital Repair Hub",
        shopAddress: "LORM, Colombo",
        shopPhone: "0752570435",
        shopLogoUrl: "/all-fix-logo-black.png"
      })
      toast.success("Invoice PDF generated successfully")
    } catch (err) {
      console.error(err)
      toast.error("Failed to generate Invoice PDF")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Finalize Sale — saves a Payment record to the backend so revenue trend updates
  const handleProcessPayment = async () => {
    let savedInvoiceRef = currentInvoiceRef
    try {
      // Build a human-readable note listing the items sold & discount
      const itemsNote = cart.map(i => `${i.partName} x${i.quantity} @ Rs.${i.price.toLocaleString()}`).join("; ")
      const discountText = discount > 0 ? ` [Discount: Rs. ${discount.toLocaleString()}]` : ""
      const noteText = `POS Sale: ${itemsNote}${discountText}`

      const result = await createInvoice({
        amount: totalPayable,
        type: "inventory_item",
        paymentMethod: paymentMethod.toUpperCase(),
        paymentType: "FULL",
        status: "COMPLETED",
        notes: noteText,
        customerId: selectedCustomer?.id !== "walk-in" ? selectedCustomer?.id : undefined,
        transactionReference: currentInvoiceRef,
        items: cart.map(i => ({
          name: i.partName,
          sku: i.sku,
          qty: i.quantity,
          price: i.price,
        })),
      }).unwrap()

      // Prefer the server-returned ref if available
      savedInvoiceRef =
        result?.data?.transactionReference ||
        result?.transactionReference ||
        result?.data?.reference ||
        result?.reference ||
        currentInvoiceRef

      toast.success(`✅ Payment of Rs. ${totalPayable.toLocaleString()} saved successfully!`)
    } catch (err: any) {
      console.error("POS sale save failed:", err)
      toast.warning("Sale completed locally but could not sync to server. Check your connection.")
    }

    // ── Send SMS e-bill to customer via Text.lk (Backend API) ─────────────────
    try {
      const isRegisteredCust = selectedCustomer?.id && selectedCustomer.id !== "walk-in"
      
      if (isRegisteredCust) {
        // Build the e-bill URL (public invoice page)
        const origin = typeof window !== "undefined" ? window.location.origin : ""
        const eBillUrl = `${origin}/invoice/${savedInvoiceRef}`

        // Build item lines for the SMS
        const itemLines = cart
          .map(i => `${i.partName} x${i.quantity} (Rs.${(i.price * i.quantity).toLocaleString()})`)
          .join(", ")

        const shopName = user?.shopName || "Our Store"
        const discountSmsText = discount > 0 ? `\nDiscount: Rs. ${discount.toLocaleString()}` : ""

        const message =
          `Hello ${selectedCustomer?.name || "Customer"},\n` +
          `Thank you for shopping at ${shopName}!\n` +
          `Invoice: ${savedInvoiceRef}\n` +
          `Items: ${itemLines}\n` +
          `Subtotal: Rs. ${subtotal.toLocaleString()}${discountSmsText}\n` +
          `Total Paid: Rs. ${totalPayable.toLocaleString()} (${paymentMethod})\n` +
          `View your e-bill: ${eBillUrl}\n` +
          `We appreciate your business!`

        await sendCustomerSMS({
          customerId: selectedCustomer.id,
          message: message,
        }).unwrap()

        toast.success("📱 E-bill SMS sent to customer via Text.lk!")
      }
    } catch (smsErr: any) {
      console.warn("[POS] SMS send failed:", smsErr)
      toast.warning(`SMS notification could not be sent: ${smsErr?.data?.message || smsErr?.message || "Check SMS settings"}`)
    }

    // Always reset state to POS screen regardless of API outcome
    setCart([])
    setSelectedCustomer({ id: "walk-in", name: "Walk-in Customer", phone: "N/A" })
    setPaymentMethod("Cash")
    setDiscountAmount(0)
    setStep("POS")
    setSidebarTab("CART")
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto w-full">
          {step === "POS" ? (
            /* ========================================================================= */
            /* SCREEN 1: POS CATALOG + RIGHT PANEL WITH TWO TABS                        */
            /* ========================================================================= */
            <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-64px)]">

              {/* ---- Left Column: Catalog & Search ---- */}
              <div className="flex-1 p-4 sm:p-6 flex flex-col gap-5 overflow-y-auto">
                {/* Search Bar & Switch Method */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search product name, SKU..."
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm"
                    />
                  </div>
                  <button
                    onClick={() => refetchInventory()}
                    title="Sync products"
                    className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-purple-50 hover:border-purple-400 text-slate-500 hover:text-purple-700 flex items-center gap-2 shadow-sm transition-all"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2 shadow-sm transition-all">
                    <Grid2X2 className="h-4 w-4 text-purple-600" />
                    <span>Switch Method</span>
                  </button>
                </div>

                {/* Categories Horizontal Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none w-full shrink-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`h-10 px-5 rounded-xl font-black text-xs tracking-wider uppercase shrink-0 whitespace-nowrap transition-all flex items-center justify-center ${
                        selectedCategory === cat
                          ? "bg-[#7C3AED] text-white shadow-md shadow-purple-200"
                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsAddCategoryOpen(true)}
                    className="h-10 px-4 rounded-xl border-2 border-dashed border-purple-400 text-purple-700 hover:bg-purple-50 font-black text-xs flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>CATEGORY</span>
                  </button>
                </div>

                {/* Product Grid */}
                {isInventoryLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12">
                    <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3" />
                    <p className="text-sm font-semibold text-slate-500">Loading catalog items...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Package className="h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-base font-bold text-slate-800 mb-1">No products found</h3>
                    <p className="text-xs text-slate-500">Try adjusting your search query or category filter.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-12">
                    {filteredProducts.map((product: any) => {
                      const stock = product.quantityInStock ?? product.stockQuantity ?? product.quantity ?? 0
                      const price = Number(product.sellingPrice ?? product.price ?? product.unitCost ?? 0)
                      const itemCat = (product.category || "STEEL").toUpperCase()
                      const inCartItem = cart.find((c) => c.id === product.id)

                      return (
                        <div
                          key={product.id}
                          onClick={() => openProductModal(product)}
                          className={`group relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg cursor-pointer overflow-hidden flex flex-col justify-between ${
                            inCartItem ? "border-2 border-purple-600 shadow-sm" : "border-slate-200 hover:border-purple-400"
                          }`}
                        >
                          {/* Image Box */}
                          <div className="relative h-40 bg-slate-100 flex items-center justify-center p-4">
                            <span className="absolute top-3 right-3 bg-[#7C3AED] text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                              IN STOCK
                            </span>

                            {inCartItem && (
                              <span className="absolute top-3 left-3 bg-purple-700 text-white text-[11px] font-black px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                                <ShoppingCart className="h-3 w-3" />
                                {inCartItem.quantity} pc
                              </span>
                            )}

                            {(() => {
                              const imgSrc = product.imageUrl || product.photoUrl || product.image || product.imgUrl || product.picture || product.photo || (Array.isArray(product.images) ? product.images[0] : null) || (Array.isArray(product.photos) ? product.photos[0] : null) || product.avatar;
                              if (imgSrc) {
                                return (
                                  <img
                                    src={imgSrc}
                                    alt={product.partName || product.name || "Product"}
                                    className="w-full h-full object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      // Fallback on broken image load error
                                      (e.target as HTMLElement).style.display = 'none';
                                      if ((e.target as HTMLElement).nextElementSibling) {
                                        ((e.target as HTMLElement).nextElementSibling as HTMLElement).style.display = 'flex';
                                      }
                                    }}
                                  />
                                );
                              }
                              return (
                                <div className="flex flex-col items-center justify-center text-slate-300 group-hover:scale-105 transition-transform">
                                  <Package className="h-14 w-14 stroke-[1.5]" />
                                  <span className="text-[10px] font-extrabold uppercase tracking-widest mt-1">NO IMAGE</span>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Product Details */}
                          <div className="p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-1 flex-wrap text-[10px] font-extrabold uppercase">
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-black tracking-wider border border-purple-200">{itemCat}</span>
                                <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded font-bold">{product.location || "Main Store"}</span>
                              </div>
                              <span className="text-slate-400 font-mono font-bold text-[10px] ml-auto">{product.sku || `SKU-${product.id.slice(0, 4)}`}</span>
                            </div>

                            <h4 className="text-sm font-black text-slate-900 capitalize tracking-tight line-clamp-1">
                              {product.partName || product.name || "Item"}
                            </h4>

                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-baseline justify-between">
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PRICE</p>
                                <p className="text-base font-black text-slate-900">Rs. {price.toLocaleString()}</p>
                              </div>
                              <span className="text-[11px] font-bold text-slate-500">{stock} left</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* ---- Right Column: Tabbed Sidebar Panel ---- */}
              <div className="w-full lg:w-[380px] bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-lg z-10">

                {/* ---- Tab Header Row ---- */}
                <div className="flex border-b border-slate-200 shrink-0">
                  {/* CART Tab */}
                  <button
                    onClick={() => setSidebarTab("CART")}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 ${
                      sidebarTab === "CART"
                        ? "border-[#7C3AED] text-[#7C3AED] bg-purple-50/50"
                        : "border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>CART</span>
                    {cart.length > 0 && (
                      <span className={`h-5 min-w-5 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center ${
                        sidebarTab === "CART" ? "bg-[#7C3AED] text-white" : "bg-slate-200 text-slate-600"
                      }`}>
                        {totalItemsCount}
                      </span>
                    )}
                  </button>

                  {/* ORDER DETAILS Tab */}
                  <button
                    onClick={() => setSidebarTab("ORDER")}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 ${
                      sidebarTab === "ORDER"
                        ? "border-[#7C3AED] text-[#7C3AED] bg-purple-50/50"
                        : "border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <ListOrdered className="h-4 w-4" />
                    <span>ORDER DETAILS</span>
                  </button>
                </div>

                {/* ---- Tab Content ---- */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">

                  {/* ======== CART TAB ======== */}
                  {sidebarTab === "CART" && (
                    <>
                      {/* Cart Items List */}
                      {cart.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-16 gap-3">
                          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-slate-300" />
                          </div>
                          <p className="text-sm font-black text-slate-500">Cart is empty</p>
                          <p className="text-xs text-slate-400">Click a product on the left to add it here</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                            {cart.length} ITEM TYPE{cart.length !== 1 ? "S" : ""} • {totalItemsCount} UNITS
                          </p>
                          {cart.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group">
                              <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-black text-sm shrink-0">
                                {item.partName.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-slate-800 truncate">{item.partName}</p>
                                <p className="text-[10px] text-slate-400 font-bold">
                                  {item.quantity} × Rs. {item.price.toLocaleString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-sm font-black text-slate-900">
                                  Rs. {(item.price * item.quantity).toLocaleString()}
                                </span>
                                <button
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  className="text-slate-300 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Totals */}
                      {cart.length > 0 && (
                        <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 mt-auto">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                            <span>Subtotal</span>
                            <span className="font-black text-slate-800">Rs. {subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-bold text-red-400">
                            <span>Discount</span>
                            <span>—</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-xs font-black uppercase text-purple-900 tracking-wider">TOTAL PAYABLE</span>
                            <span className="text-xl font-black text-[#7C3AED]">Rs. {totalPayable.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      {/* Hint to switch tab */}
                      {cart.length > 0 && (
                        <button
                          onClick={() => setSidebarTab("ORDER")}
                          className="flex items-center justify-center gap-1.5 text-xs font-bold text-purple-600 hover:underline"
                        >
                          Set customer & payment method
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </>
                  )}

                  {/* ======== ORDER DETAILS TAB ======== */}
                  {sidebarTab === "ORDER" && (
                    <>
                      {/* Customer Section */}
                      <div className="flex flex-col gap-2.5">
                        <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" /> CUSTOMER
                        </p>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            onClick={() => setIsCustomerModalOpen(true)}
                            readOnly
                            value={selectedCustomer ? `${selectedCustomer.name} (${selectedCustomer.phone || "Walk-in"})` : ""}
                            placeholder="Search customer name or phone..."
                            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none hover:bg-slate-100 transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setSelectedCustomer({ id: "walk-in", name: "Walk-in Customer", phone: "N/A" })}
                            className={`h-10 rounded-xl font-extrabold text-[11px] uppercase tracking-wider transition-all border ${
                              selectedCustomer?.id === "walk-in"
                                ? "bg-purple-50 border-purple-400 text-purple-700 shadow-sm"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            WALK-IN
                          </button>
                          <button
                            onClick={() => setIsCustomerModalOpen(true)}
                            className="h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1"
                          >
                            <Search className="h-3 w-3" /> SELECT
                          </button>
                          <button
                            onClick={() => setIsAddPosCustomerOpen(true)}
                            className="h-10 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition-colors"
                          >
                            <UserPlus className="h-3 w-3" /> + NEW
                          </button>
                        </div>
                      </div>

                      {/* Selected Customer Info Card */}
                      {selectedCustomer && (
                        <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center text-purple-700 font-black text-sm">
                            {selectedCustomer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-purple-900 truncate">{selectedCustomer.name}</p>
                            <p className="text-[10px] text-purple-500 font-semibold">{selectedCustomer.phone || "No phone"}</p>
                          </div>
                        </div>
                      )}

                      {/* Payment Method Selector */}
                      <div className="flex flex-col gap-2.5">
                        <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5" /> PAYMENT METHOD
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setPaymentMethod("Cash")}
                            className={`h-16 rounded-2xl font-black text-xs uppercase flex flex-col items-center justify-center gap-1.5 border transition-all ${
                              paymentMethod === "Cash"
                                ? "bg-[#7C3AED] text-white border-purple-600 shadow-md shadow-purple-200"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <Banknote className="h-5 w-5" />
                            CASH
                          </button>
                          <button
                            onClick={() => setPaymentMethod("Card")}
                            className={`h-16 rounded-2xl font-black text-xs uppercase flex flex-col items-center justify-center gap-1.5 border transition-all ${
                              paymentMethod === "Card"
                                ? "bg-[#7C3AED] text-white border-purple-600 shadow-md shadow-purple-200"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <CreditCard className="h-5 w-5" />
                            CARD
                          </button>
                        </div>
                      </div>

                      {/* Order Summary Mini */}
                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex flex-col gap-2.5">
                        <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" /> ORDER SUMMARY
                        </p>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                          <span>Items Subtotal</span>
                          <span className="text-slate-800 font-black">Rs. {subtotal.toLocaleString()}</span>
                        </div>

                        {/* Discount Input Field */}
                        <div className="flex items-center justify-between gap-2 py-1">
                          <span className="text-xs font-extrabold text-slate-600">Discount (Rs.)</span>
                          <div className="relative w-28">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">Rs.</span>
                            <input
                              type="number"
                              min="0"
                              max={subtotal}
                              value={discountAmount}
                              onChange={(e) => {
                                const val = e.target.value === "" ? "" : Math.max(0, Number(e.target.value))
                                setDiscountAmount(val)
                              }}
                              placeholder="0"
                              className="w-full h-8 pl-7 pr-2 rounded-lg border border-slate-200 bg-white text-xs font-black text-purple-700 text-right focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                          <span>Payment</span>
                          <span className="text-slate-800 font-black">{paymentMethod}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                          <span className="text-xs font-black uppercase text-purple-900 tracking-wider">TOTAL</span>
                          <span className="text-lg font-black text-[#7C3AED]">Rs. {totalPayable.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Hint to switch back to cart */}
                      <button
                        onClick={() => setSidebarTab("CART")}
                        className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 hover:text-purple-600 hover:underline"
                      >
                        ← Back to cart items
                      </button>
                    </>
                  )}
                </div>

                {/* ---- Bottom Action Footer ---- */}
                <div className="border-t border-slate-100 p-4 flex flex-col gap-2 shrink-0">
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={cart.length === 0}
                    className="w-full h-12 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="h-4 w-4" />
                    CHECKOUT & COMPLETE SALE
                    {cart.length > 0 && (
                      <span className="bg-white/20 text-white text-xs font-black px-2 py-0.5 rounded-md">
                        Rs. {totalPayable.toLocaleString()}
                      </span>
                    )}
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { if (cart.length > 0) toast.info("Order held successfully") }}
                      className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider"
                    >
                      HOLD
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={cart.length === 0}
                      className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider disabled:opacity-40"
                    >
                      PRINT
                    </button>
                  </div>
                </div>
              </div>
            </div>

          ) : (
            /* ========================================================================= */
            /* SCREEN 2: CONFIRM PAYMENT & RECEIPT                                       */
            /* ========================================================================= */
            <div className="p-4 sm:p-8 max-w-6xl mx-auto flex flex-col gap-6">
              {/* Top Navigation Bar */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep("POS")}
                  className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 leading-tight">Confirm Payment</h2>
                    <p className="text-xs text-slate-400 font-semibold">Review and confirm payment details • Estimated time: 2-3 min</p>
                  </div>
                </div>
              </div>

              {/* Main 2-Column Checkout Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Information Cards */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  {/* Customer Information Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-purple-600" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Customer Information</h3>
                      </div>
                      <button
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPDF}
                        className="h-9 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>Print Receipt</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NAME / ID</p>
                        <p className="text-sm font-black text-slate-900 mt-1">{selectedCustomer?.name || "Walk-in Customer"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PHONE</p>
                        <p className="text-sm font-bold text-slate-700 mt-1">{selectedCustomer?.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TYPE</p>
                        <span className="bg-purple-50 text-purple-700 font-extrabold text-[10px] px-2.5 py-1 rounded-md border border-purple-200">
                          {selectedCustomer?.id === "walk-in" ? "Walk-In" : "Registered"}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PAYMENT</p>
                        <span className="bg-slate-100 text-slate-700 font-extrabold text-[10px] px-2.5 py-1 rounded-md">
                          {paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items Summary Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Package className="h-4 w-4 text-purple-600" />
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Items Summary</h3>
                    </div>

                    <div className="flex flex-col gap-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                              {item.partName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 capitalize">{item.partName}</p>
                              <p className="text-xs text-slate-400 font-semibold">
                                UNIT PRICE: RS. {item.price.toLocaleString()} •{" "}
                                <span className="text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                  {item.location || "Main Store"}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-500">Qty: {item.quantity}</p>
                            <p className="text-sm font-black text-slate-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-xs font-extrabold text-slate-600">
                      Total Items: <span className="text-slate-900 font-black">{totalItemsCount}</span>
                    </div>
                  </div>
                </div>

                {/* Right 1 Column: Transaction Summary */}
                <div className="flex flex-col gap-4">
                  <div className="bg-[#7C3AED] text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-6">
                    <h3 className="text-sm font-black uppercase tracking-wider border-b border-purple-400/50 pb-3">
                      Transaction Summary
                    </h3>

                    <div className="space-y-3.5 text-xs font-bold">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Invoice Ref.</span>
                        <span className="font-mono bg-purple-700/50 px-2 py-1 rounded text-[11px]">{currentInvoiceRef}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Cashier</span>
                        <span className="text-white capitalize">{user?.fullName || "Staff Cashier"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Payment Method</span>
                        <span className="text-white">{paymentMethod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Total Items</span>
                        <span className="text-white">{totalItemsCount}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-purple-400/30">
                        <span className="text-purple-200">Subtotal</span>
                        <span className="text-white">Rs. {subtotal.toLocaleString()}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between items-center text-amber-300">
                          <span>Discount Applied</span>
                          <span>- Rs. {discount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-purple-400/50 flex items-baseline justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-200">Amount Due</span>
                      <span className="text-2xl font-black text-white">Rs. {totalPayable.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="w-full h-12 rounded-xl bg-white border-2 border-purple-500 text-purple-700 hover:bg-purple-50 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    <span>{isGeneratingPDF ? "Generating PDF..." : "Download Invoice PDF"}</span>
                  </button>

                  {/* SMS e-bill hint — only shown when a registered customer with a phone number is selected */}
                  {selectedCustomer && selectedCustomer.id !== "walk-in" && selectedCustomer.phone && selectedCustomer.phone !== "N/A" && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                      <MessageSquare className="h-3.5 w-3.5 text-green-600 shrink-0" />
                      <p className="text-[10px] font-bold text-green-700">
                        E-bill SMS will be sent to <span className="font-black">{selectedCustomer.phone}</span> via text.lk
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setStep("POS")}
                      className="h-12 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleProcessPayment}
                      disabled={isSavingSale}
                      className="h-12 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-purple-200 disabled:opacity-60"
                    >
                      {isSavingSale ? (
                        <><div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /><span>Processing...</span></>
                      ) : (
                        <><CheckCircle className="h-4 w-4" /><span>Process Payment</span></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD TO CART QUANTITY PICKER MODAL                                 */}
      {/* ========================================================================= */}
      {selectedProductForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                  <Package className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                    {(selectedProductForModal.category || "STEEL").toUpperCase()}
                  </span>
                  <h3 className="text-base font-black text-slate-900 capitalize mt-0.5">
                    {selectedProductForModal.partName || selectedProductForModal.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    Rs. {Number(selectedProductForModal.sellingPrice ?? selectedProductForModal.price ?? selectedProductForModal.unitCost ?? 0).toLocaleString()} / unit
                  </p>
                  <p className="text-[11px] font-extrabold text-purple-600 mt-0.5">
                    Available: {selectedProductForModal.quantityInStock ?? selectedProductForModal.quantity ?? 0}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProductForModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quantity Stepper */}
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">ENTER QUANTITY</p>
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                  className="h-14 w-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xl transition-colors"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={selectedProductForModal.quantityInStock ?? 99}
                  value={modalQty}
                  onChange={(e) => setModalQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-14 flex-1 rounded-2xl border-2 border-purple-500 text-center font-black text-2xl text-slate-900 focus:outline-none shadow-sm"
                />
                <button
                  onClick={() => setModalQty((q) => Math.min(selectedProductForModal.quantityInStock ?? 99, q + 1))}
                  className="h-14 w-14 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center font-black text-xl transition-colors shadow-md shadow-purple-200"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Line Total Box */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500">
                  {modalQty} x Rs. {Number(selectedProductForModal.sellingPrice ?? selectedProductForModal.price ?? selectedProductForModal.unitCost ?? 0).toLocaleString()}
                </p>
                <p className="text-xs font-black uppercase text-purple-900 tracking-wider">LINE TOTAL</p>
              </div>
              <span className="text-xl font-black text-[#7C3AED]">
                Rs. {(modalQty * Number(selectedProductForModal.sellingPrice ?? selectedProductForModal.price ?? selectedProductForModal.unitCost ?? 0)).toLocaleString()}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setSelectedProductForModal(null)}
                className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                className="h-12 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-200"
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CUSTOMER SELECTOR MODAL                                           */}
      {/* ========================================================================= */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">Select Customer</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPosCustomerOpen(true)}
                  className="px-3 py-1 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-extrabold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <UserPlus className="h-3.5 w-3.5" /> + New Customer
                </button>
                <button onClick={() => setIsCustomerModalOpen(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                placeholder="Search registered customer..."
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
              <div
                onClick={() => {
                  setSelectedCustomer({ id: "walk-in", name: "Walk-in Customer", phone: "N/A" })
                  setIsCustomerModalOpen(false)
                }}
                className="p-3 rounded-xl border border-slate-200 hover:bg-purple-50 hover:border-purple-300 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-black text-slate-900">Walk-in Customer</p>
                  <p className="text-[10px] text-slate-400">Default Quick Customer</p>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Walk-In</span>
              </div>

              {customersList
                .filter((c: any) => c.name?.toLowerCase().includes(customerSearchQuery.toLowerCase()) || c.phone?.includes(customerSearchQuery))
                .map((cust: any) => (
                  <div
                    key={cust.id}
                    onClick={() => {
                      setSelectedCustomer({ id: cust.id, name: cust.name, phone: cust.phone })
                      setIsCustomerModalOpen(false)
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:bg-purple-50 hover:border-purple-300 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-black text-slate-900">{cust.name}</p>
                      <p className="text-[10px] text-slate-500">{cust.phone || "No phone"}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">Registered</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD NEW CUSTOMER (POS)                                           */}
      {/* ========================================================================= */}
      {isAddPosCustomerOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <UserPlus className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Add New Customer</h3>
                  <p className="text-[10px] text-purple-200 font-semibold">Customer will be saved & selected</p>
                </div>
              </div>
              <button
                onClick={() => { setIsAddPosCustomerOpen(false); setNewPosCustomer({ name: "", phone: "", email: "", address: "" }); }}
                className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePosCustomer} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Name */}
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPosCustomer.name}
                    onChange={(e) => setNewPosCustomer(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Thaheshan"
                    required
                    className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 bg-slate-50 transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPosCustomer.phone}
                    onChange={(e) => setNewPosCustomer(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+94 77 123 4567"
                    required
                    className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 bg-slate-50 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="col-span-1 flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Email</label>
                  <input
                    type="email"
                    value={newPosCustomer.email}
                    onChange={(e) => setNewPosCustomer(p => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.com"
                    className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 bg-slate-50 transition-all"
                  />
                </div>

                {/* Address */}
                <div className="col-span-1 flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Address</label>
                  <input
                    type="text"
                    value={newPosCustomer.address}
                    onChange={(e) => setNewPosCustomer(p => ({ ...p, address: e.target.value }))}
                    placeholder="City, Street..."
                    className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 bg-slate-50 transition-all"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setIsAddPosCustomerOpen(false); setNewPosCustomer({ name: "", phone: "", email: "", address: "" }); }}
                  className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCustomer}
                  className="h-11 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-200 flex items-center justify-center gap-2 transition-colors"
                >
                  {isCreatingCustomer ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3.5 w-3.5" /> Create & Select
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="bg-purple-50 p-6 border-b border-purple-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-900">Add Inventory Category</h3>
                <p className="text-xs text-purple-700 font-bold mt-0.5">Create a new product classification</p>
              </div>
              <button onClick={() => setIsAddCategoryOpen(false)} className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-all">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. SCREENS, BATTERIES, COVERS"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-300 uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Enter category details or notes..."
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="flex-1 h-11 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCategoryName.trim()}
                  className="flex-1 h-11 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-md shadow-purple-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>Create Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
