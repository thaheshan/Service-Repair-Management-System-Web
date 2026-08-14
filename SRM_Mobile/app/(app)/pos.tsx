import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, Modal, Alert, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetInventoryItemsQuery } from '../../src/services/api/inventoryApiSlice';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Search } from '../../src/components/Icons';
import { R, F } from '../../src/constants/theme';

const POS_PURPLE = '#7C3AED';
const POS_PURPLE_LIGHT = '#F3E8FF';
const POS_BG = '#F8FAFC';

export default function POSScreen() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [cart, setCart] = useState<any[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'ONLINE'>('CASH');

  const { data: inventoryData, isLoading } = useGetInventoryItemsQuery({});
  const items: any[] = inventoryData?.data ?? inventoryData ?? [];

  const categories = ['ALL', ...Array.from(new Set(items.map((i: any) => i.category || 'General')))];

  const filtered = items.filter((item: any) => {
    const q = search.toLowerCase();
    const match = (item.partName ?? item.name ?? '').toLowerCase().includes(q) || (item.partNumber ?? '').toLowerCase().includes(q);
    const catMatch = selectedCat === 'ALL' || (item.category || 'General') === selectedCat;
    return match && catMatch;
  });

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.id === id) {
            const newQty = c.qty + delta;
            return newQty > 0 ? { ...c, qty: newQty } : null;
          }
          return c;
        })
        .filter(Boolean)
    );
  };

  const totalAmount = cart.reduce((sum, item) => sum + Number(item.sellingPrice ?? 0) * item.qty, 0);
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    Alert.alert('Payment Processed', `LKR ${totalAmount.toLocaleString()} paid via ${paymentMethod}.`, [
      {
        text: 'OK',
        onPress: () => {
          setCart([]);
          setIsCheckoutOpen(false);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>Point of Sale</Text>
          <Text style={s.subtitle}>Quick Checkout Terminal</Text>
        </View>

        <TouchableOpacity style={s.cartPill} onPress={() => setIsCheckoutOpen(true)}>
          <ShoppingCart size={18} color="#fff" />
          <Text style={s.cartPillText}>{totalCount} Items</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={s.searchBar}>
        <Search size={16} color="#94A3B8" />
        <TextInput
          style={s.searchInput}
          placeholder="Search catalog by name or SKU…"
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll} contentContainerStyle={s.catContent}>
        {categories.map((cat: any) => {
          const active = selectedCat === cat;
          return (
            <TouchableOpacity key={cat} onPress={() => setSelectedCat(cat)} style={[s.catPill, active && s.catPillActive]}>
              <Text style={[s.catText, active && s.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Catalog Grid */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
        <View style={s.grid}>
          {filtered.map((item: any) => {
            const inCart = cart.find((c) => c.id === item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[s.itemCard, inCart && s.itemCardSelected]}
                onPress={() => addToCart(item)}
                activeOpacity={0.8}
              >
                <Text style={s.itemCatTag}>{item.category || 'General'}</Text>
                <Text style={s.itemName} numberOfLines={2}>{item.partName ?? item.name}</Text>
                <Text style={s.itemStock}>{item.stockQuantity ?? 0} in stock</Text>
                <View style={s.itemFooter}>
                  <Text style={s.itemPrice}>LKR {Number(item.sellingPrice ?? 0).toLocaleString()}</Text>
                  <View style={s.addCircle}>
                    <Plus size={14} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Cart Action Bar */}
      {cart.length > 0 && (
        <View style={s.bottomBar}>
          <View>
            <Text style={s.bottomCount}>{totalCount} Item{totalCount !== 1 ? 's' : ''} in cart</Text>
            <Text style={s.bottomTotal}>LKR {totalAmount.toLocaleString()}</Text>
          </View>
          <TouchableOpacity style={s.payBtn} onPress={() => setIsCheckoutOpen(true)}>
            <CreditCard size={18} color="#fff" />
            <Text style={s.payBtnText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Checkout Modal */}
      <Modal visible={isCheckoutOpen} transparent animationType="slide">
        <View style={s.modalBg}>
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Cart Summary</Text>
              <TouchableOpacity onPress={() => setIsCheckoutOpen(false)}>
                <Text style={s.sheetClose}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Cart Items List */}
            <ScrollView style={{ maxHeight: 220, marginBottom: 16 }} showsVerticalScrollIndicator={false}>
              {cart.map((c) => (
                <View key={c.id} style={s.cartRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cartRowName} numberOfLines={1}>{c.partName ?? c.name}</Text>
                    <Text style={s.cartRowPrice}>LKR {Number(c.sellingPrice ?? 0).toLocaleString()} x {c.qty}</Text>
                  </View>
                  <View style={s.qtyControls}>
                    <TouchableOpacity style={s.qtyBtn} onPress={() => updateQty(c.id, -1)}>
                      {c.qty === 1 ? <Trash2 size={12} color="#EF4444" /> : <Minus size={12} color="#0F172A" />}
                    </TouchableOpacity>
                    <Text style={s.qtyText}>{c.qty}</Text>
                    <TouchableOpacity style={s.qtyBtn} onPress={() => updateQty(c.id, 1)}>
                      <Plus size={12} color="#0F172A" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Total */}
            <View style={s.totalBox}>
              <Text style={s.totalBoxLbl}>TOTAL DUE</Text>
              <Text style={s.totalBoxVal}>LKR {totalAmount.toLocaleString()}</Text>
            </View>

            {/* Payment Method Selector */}
            <Text style={s.methodLbl}>PAYMENT METHOD</Text>
            <View style={s.methodRow}>
              {(['CASH', 'CARD', 'ONLINE'] as const).map((method) => {
                const active = paymentMethod === method;
                return (
                  <TouchableOpacity
                    key={method}
                    style={[s.methodBtn, active && s.methodBtnActive]}
                    onPress={() => setPaymentMethod(method)}
                  >
                    <Text style={[s.methodText, active && s.methodTextActive]}>{method}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Submit */}
            <TouchableOpacity style={s.submitPayBtn} onPress={handleCheckout}>
              <Text style={s.submitPayText}>Process Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: POS_BG },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  title: { fontSize: F['4xl'], fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: F.xs, color: '#64748B', marginTop: 1 },
  cartPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: POS_PURPLE, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, shadowColor: POS_PURPLE, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  cartPillText: { color: '#fff', fontWeight: '800', fontSize: F.sm },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', height: 44,
    marginHorizontal: 20, marginBottom: 12,
    backgroundColor: '#FFFFFF', borderRadius: R.lg,
    borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12, gap: 8,
  },
  searchInput: { flex: 1, fontSize: F.base, color: '#0F172A' },
  catScroll: { maxHeight: 36, marginBottom: 12 },
  catContent: { paddingHorizontal: 20, gap: 8 },
  catPill: {
    paddingHorizontal: 14, height: 32, borderRadius: 16,
    backgroundColor: '#FFFFFF', justifyContent: 'center',
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  catPillActive: { backgroundColor: POS_PURPLE, borderColor: POS_PURPLE },
  catText: { fontSize: F.md, fontWeight: '700', color: '#64748B' },
  catTextActive: { color: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  itemCard: {
    width: '48%', backgroundColor: '#FFFFFF', borderRadius: R.xl, padding: 14,
    borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'space-between',
  },
  itemCardSelected: { borderColor: POS_PURPLE, borderWidth: 2, backgroundColor: POS_PURPLE_LIGHT },
  itemCatTag: { fontSize: 10, fontWeight: '800', color: POS_PURPLE, textTransform: 'uppercase', marginBottom: 4 },
  itemName: { fontSize: F.md, fontWeight: '800', color: '#0F172A', lineHeight: 18, marginBottom: 6 },
  itemStock: { fontSize: F.xs, color: '#94A3B8', marginBottom: 10 },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { fontSize: F.base, fontWeight: '900', color: '#0F172A' },
  addCircle: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: POS_PURPLE,
    alignItems: 'center', justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0',
    paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between', elevation: 8,
  },
  bottomCount: { fontSize: F.xs, color: '#64748B', fontWeight: '700' },
  bottomTotal: { fontSize: F['2xl'], fontWeight: '900', color: POS_PURPLE },
  payBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: POS_PURPLE, paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: R.lg,
  },
  payBtnText: { color: '#fff', fontWeight: '800', fontSize: F.base },
  modalBg: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '80%',
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: F['2xl'], fontWeight: '900', color: '#0F172A' },
  sheetClose: { fontSize: F.base, color: '#94A3B8', fontWeight: '700' },
  cartRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  cartRowName: { fontSize: F.base, fontWeight: '800', color: '#0F172A' },
  cartRowPrice: { fontSize: F.xs, color: '#64748B', marginTop: 2 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F1F5F9', borderRadius: R.md, padding: 4 },
  qtyBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: F.sm, fontWeight: '800', color: '#0F172A' },
  totalBox: { backgroundColor: '#F8FAFC', borderRadius: R.lg, padding: 14, alignItems: 'center', marginBottom: 16 },
  totalBoxLbl: { fontSize: F.xs, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8 },
  totalBoxVal: { fontSize: F['3xl'], fontWeight: '900', color: POS_PURPLE, marginTop: 2 },
  methodLbl: { fontSize: F.xs, fontWeight: '800', color: '#64748B', letterSpacing: 0.6, marginBottom: 8 },
  methodRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  methodBtn: {
    flex: 1, height: 40, borderRadius: R.lg, borderWidth: 1.5, borderColor: '#E2E8F0',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9',
  },
  methodBtnActive: { backgroundColor: POS_PURPLE_LIGHT, borderColor: POS_PURPLE },
  methodText: { fontSize: F.xs, fontWeight: '800', color: '#64748B' },
  methodTextActive: { color: POS_PURPLE },
  submitPayBtn: {
    height: 50, borderRadius: R.lg, backgroundColor: POS_PURPLE,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  submitPayText: { color: '#fff', fontWeight: '800', fontSize: F.base },
});
