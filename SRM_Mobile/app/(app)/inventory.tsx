import React, { useState } from 'react';
import {
  View, Text, ScrollView, RefreshControl, TextInput,
  TouchableOpacity, Modal, Alert, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useGetInventoryItemsQuery, useCreateInventoryItemMutation,
  useAdjustStockMutation
} from '../../src/services/api/inventoryApiSlice';
import { Search, Plus, Package, AlertTriangle } from '../../src/components/Icons';
import { C, R, F } from '../../src/constants/theme';

export default function InventoryScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustType, setAdjustType] = useState<'ADD' | 'REMOVE'>('ADD');

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [partName, setPartName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [category, setCategory] = useState('Display & Touch');
  const [unitCost, setUnitCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [minStockAlert, setMinStockAlert] = useState('5');
  const [compatibility, setCompatibility] = useState('');

  const { data: inventoryData, isLoading, refetch } = useGetInventoryItemsQuery({});
  const [createItem, { isLoading: isCreating }] = useCreateInventoryItemMutation();
  const [adjustStock, { isLoading: isAdjusting }] = useAdjustStockMutation();

  const items: any[] = inventoryData?.data ?? inventoryData ?? [];

  const categories = ['ALL', ...Array.from(new Set(items.map((i: any) => i.category || 'Uncategorized')))];

  const filtered = items.filter((item: any) => {
    const q = search.toLowerCase();
    const match =
      (item.partName ?? item.name ?? '').toLowerCase().includes(q) ||
      (item.partNumber ?? item.sku ?? '').toLowerCase().includes(q) ||
      (item.compatibility ?? '').toLowerCase().includes(q);
    const catMatch = selectedCategory === 'ALL' || (item.category || 'Uncategorized') === selectedCategory;
    return match && catMatch;
  });

  const handleAdjustStock = async () => {
    if (!selectedItem || !adjustQty.trim()) return;
    const qty = parseInt(adjustQty.trim(), 10);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid positive number.');
      return;
    }
    const finalQty = adjustType === 'ADD' ? qty : -qty;
    try {
      await adjustStock({ id: selectedItem.id, quantity: finalQty }).unwrap();
      Alert.alert('Success', `Stock ${adjustType === 'ADD' ? 'added' : 'removed'} successfully.`);
      setSelectedItem(null);
      setAdjustQty('');
      refetch();
    } catch (err: any) {
      Alert.alert('Error', err?.data?.message || 'Failed to adjust stock.');
    }
  };

  const handleCreate = async () => {
    if (!partName.trim() || !unitCost.trim() || !sellingPrice.trim() || !stockQuantity.trim()) {
      Alert.alert('Required Fields', 'Please fill in part name, unit cost, selling price, and stock quantity.');
      return;
    }
    try {
      await createItem({
        partName: partName.trim(),
        partNumber: partNumber.trim() || `SKU-${Date.now().toString().slice(-6)}`,
        category,
        unitCost: parseFloat(unitCost),
        sellingPrice: parseFloat(sellingPrice),
        stockQuantity: parseInt(stockQuantity, 10),
        minStockAlert: parseInt(minStockAlert || '5', 10),
        compatibility: compatibility.trim(),
      }).unwrap();

      Alert.alert('Success', 'Inventory item added successfully.');
      setIsCreateOpen(false);
      setPartName(''); setPartNumber(''); setUnitCost(''); setSellingPrice(''); setStockQuantity(''); setCompatibility('');
      refetch();
    } catch (err: any) {
      Alert.alert('Error', err?.data?.message || 'Failed to create inventory item.');
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Inventory</Text>
        <TouchableOpacity style={s.addBtn} onPress={() => setIsCreateOpen(true)}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchBar}>
        <Search size={16} color={C.fgLight} />
        <TextInput
          style={s.searchInput}
          placeholder="Search part name, SKU, compatibility…"
          placeholderTextColor={C.fgLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll} contentContainerStyle={s.catContent}>
        {categories.map((cat: any) => {
          const active = selectedCategory === cat;
          return (
            <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)} style={[s.catPill, active && s.catPillActive]}>
              <Text style={[s.catText, active && s.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Item List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={C.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Package size={48} color={C.border} />
            <Text style={s.emptyText}>No inventory items found</Text>
          </View>
        ) : (
          filtered.map((item: any, i: number) => {
            const isLow = (item.stockQuantity ?? 0) <= (item.minStockAlert ?? 5);
            return (
              <TouchableOpacity key={item.id ?? i} style={s.card} onPress={() => setSelectedItem(item)} activeOpacity={0.8}>
                <View style={s.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.itemName} numberOfLines={1}>{item.partName ?? item.name}</Text>
                    <Text style={s.itemSku}>SKU: {item.partNumber ?? item.sku ?? 'N/A'}</Text>
                  </View>
                  <View style={[s.stockBadge, isLow ? s.stockLow : s.stockNormal]}>
                    {isLow && <AlertTriangle size={12} color={C.danger} style={{ marginRight: 4 }} />}
                    <Text style={[s.stockText, isLow ? s.stockTextLow : s.stockTextNormal]}>
                      {item.stockQuantity ?? 0} in stock
                    </Text>
                  </View>
                </View>
                <View style={s.cardDetails}>
                  <Text style={s.catTag}>{item.category || 'General'}</Text>
                  <Text style={s.itemPrice}>LKR {Number(item.sellingPrice ?? 0).toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Stock Adjustment Sheet */}
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <View style={s.modalBg}>
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Adjust Stock</Text>
              <TouchableOpacity onPress={() => setSelectedItem(null)}>
                <Text style={s.sheetClose}>Close</Text>
              </TouchableOpacity>
            </View>

            <Text style={s.selectedName}>{selectedItem?.partName ?? selectedItem?.name}</Text>
            <Text style={s.currentStock}>Current Stock: <Text style={{ fontWeight: '800', color: C.fg }}>{selectedItem?.stockQuantity ?? 0}</Text></Text>

            <View style={s.typeToggle}>
              <TouchableOpacity
                style={[s.typeBtn, adjustType === 'ADD' && s.typeBtnActiveAdd]}
                onPress={() => setAdjustType('ADD')}
              >
                <Text style={[s.typeText, adjustType === 'ADD' && s.typeTextActive]}>+ Add Stock</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.typeBtn, adjustType === 'REMOVE' && s.typeBtnActiveRemove]}
                onPress={() => setAdjustType('REMOVE')}
              >
                <Text style={[s.typeText, adjustType === 'REMOVE' && s.typeTextActive]}>- Remove Stock</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={s.field}
              placeholder="Enter quantity"
              placeholderTextColor={C.fgLight}
              keyboardType="numeric"
              value={adjustQty}
              onChangeText={setAdjustQty}
            />

            <TouchableOpacity style={[s.submitBtn, isAdjusting && { opacity: 0.6 }]} onPress={handleAdjustStock} disabled={isAdjusting}>
              <Text style={s.submitBtnText}>Confirm Adjustment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Item Modal */}
      <Modal visible={isCreateOpen} transparent animationType="slide">
        <View style={s.modalBg}>
          <View style={s.sheet}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={s.sheetHeader}>
                <Text style={s.sheetTitle}>Add New Item</Text>
                <TouchableOpacity onPress={() => setIsCreateOpen(false)}>
                  <Text style={s.sheetClose}>Cancel</Text>
                </TouchableOpacity>
              </View>

              <Text style={s.fieldGroup}>ITEM DETAILS</Text>
              <TextInput style={s.field} placeholder="Part Name *" placeholderTextColor={C.fgLight} value={partName} onChangeText={setPartName} />
              <TextInput style={s.field} placeholder="SKU / Part Number" placeholderTextColor={C.fgLight} value={partNumber} onChangeText={setPartNumber} />
              <TextInput style={s.field} placeholder="Category" placeholderTextColor={C.fgLight} value={category} onChangeText={setCategory} />

              <Text style={s.fieldGroup}>PRICING & STOCK</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TextInput style={[s.field, { flex: 1 }]} placeholder="Cost (LKR) *" placeholderTextColor={C.fgLight} keyboardType="numeric" value={unitCost} onChangeText={setUnitCost} />
                <TextInput style={[s.field, { flex: 1 }]} placeholder="Price (LKR) *" placeholderTextColor={C.fgLight} keyboardType="numeric" value={sellingPrice} onChangeText={setSellingPrice} />
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TextInput style={[s.field, { flex: 1 }]} placeholder="Qty in Stock *" placeholderTextColor={C.fgLight} keyboardType="numeric" value={stockQuantity} onChangeText={setStockQuantity} />
                <TextInput style={[s.field, { flex: 1 }]} placeholder="Min Stock Alert" placeholderTextColor={C.fgLight} keyboardType="numeric" value={minStockAlert} onChangeText={setMinStockAlert} />
              </View>

              <Text style={s.fieldGroup}>COMPATIBILITY</Text>
              <TextInput style={s.field} placeholder="Compatible models (e.g. iPhone 13, 14)" placeholderTextColor={C.fgLight} value={compatibility} onChangeText={setCompatibility} />

              <TouchableOpacity style={[s.submitBtn, isCreating && { opacity: 0.6 }]} onPress={handleCreate} disabled={isCreating}>
                <Text style={s.submitBtnText}>Save Item</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  title: { fontSize: F['4xl'], fontWeight: '900', color: C.fg },
  addBtn: {
    width: 36, height: 36, borderRadius: R.lg,
    backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', height: 44,
    marginHorizontal: 20, marginBottom: 12,
    backgroundColor: C.card, borderRadius: R.lg,
    borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, gap: 8,
  },
  searchInput: { flex: 1, fontSize: F.base, color: C.fg },
  catScroll: { maxHeight: 36, marginBottom: 12 },
  catContent: { paddingHorizontal: 20, gap: 8 },
  catPill: {
    paddingHorizontal: 14, height: 32, borderRadius: 16,
    backgroundColor: C.card, justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  catPillActive: { backgroundColor: C.primary, borderColor: C.primary },
  catText: { fontSize: F.md, fontWeight: '700', color: C.fgMuted },
  catTextActive: { color: '#fff' },
  empty: { alignItems: 'center', paddingVertical: 80 },
  emptyText: { color: C.fgLight, fontWeight: '600', marginTop: 12, fontSize: F.base },
  card: {
    backgroundColor: C.card, borderRadius: R.xl, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: C.border,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  itemName: { fontWeight: '800', fontSize: F.lg, color: C.fg },
  itemSku: { fontSize: F.xs, color: C.fgLight, marginTop: 2 },
  stockBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  stockNormal: { backgroundColor: C.successBg },
  stockLow: { backgroundColor: C.dangerBg },
  stockText: { fontSize: F.xs, fontWeight: '700' },
  stockTextNormal: { color: C.successText },
  stockTextLow: { color: C.dangerText },
  cardDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catTag: { fontSize: F.xs, fontWeight: '700', color: C.primary, backgroundColor: C.primaryLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  itemPrice: { fontSize: F.base, fontWeight: '900', color: C.fg },
  modalBg: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '85%',
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: F['2xl'], fontWeight: '900', color: C.fg },
  sheetClose: { fontSize: F.base, color: C.fgLight, fontWeight: '700' },
  selectedName: { fontSize: F.lg, fontWeight: '800', color: C.fg, marginBottom: 4 },
  currentStock: { fontSize: F.sm, color: C.fgMuted, marginBottom: 20 },
  typeToggle: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  typeBtn: {
    flex: 1, height: 42, borderRadius: R.lg, borderWidth: 1.5, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center', backgroundColor: C.muted,
  },
  typeBtnActiveAdd: { backgroundColor: C.successBg, borderColor: C.success },
  typeBtnActiveRemove: { backgroundColor: C.dangerBg, borderColor: C.danger },
  typeText: { fontSize: F.sm, fontWeight: '800', color: C.fgMuted },
  typeTextActive: { color: C.fg },
  fieldGroup: { fontSize: F.xs, fontWeight: '800', color: C.fgMuted, letterSpacing: 0.6, marginBottom: 8, marginTop: 4 },
  field: {
    height: 46, borderWidth: 1.5, borderColor: C.border, borderRadius: R.lg,
    paddingHorizontal: 14, fontSize: F.base, color: C.fg, marginBottom: 10, backgroundColor: C.card,
  },
  submitBtn: {
    height: 50, borderRadius: R.lg, backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 12,
  },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: F.base },
});
