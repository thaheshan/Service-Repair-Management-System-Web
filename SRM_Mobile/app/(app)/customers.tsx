import React, { useState } from 'react';
import {
  View, Text, ScrollView, RefreshControl, TextInput,
  TouchableOpacity, Modal, Alert, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetCustomersQuery, useCreateCustomerMutation } from '../../src/services/api/customersApiSlice';
import { Search, Plus, Users, Phone, Mail } from '../../src/components/Icons';
import { C, R, F } from '../../src/constants/theme';

export default function CustomersScreen() {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const { data: customersData, isLoading, refetch } = useGetCustomersQuery({});
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();

  const customers: any[] = customersData?.data ?? customersData ?? [];

  const filtered = customers.filter((c: any) => {
    const q = search.toLowerCase();
    return (
      (c.name ?? '').toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.phone ?? '').toLowerCase().includes(q)
    );
  });

  const getInitials = (n?: string) => {
    if (!n) return 'C';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  const handleCreate = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Required Fields', 'Please enter full name and phone number.');
      return;
    }
    try {
      await createCustomer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      }).unwrap();

      Alert.alert('Success', 'Customer added successfully.');
      setIsCreateOpen(false);
      setName(''); setEmail(''); setPhone(''); setAddress('');
      refetch();
    } catch (err: any) {
      Alert.alert('Error', err?.data?.message || 'Failed to create customer.');
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={s.title}>Customers</Text>
          <View style={s.countBadge}>
            <Text style={s.countBadgeText}>{filtered.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => setIsCreateOpen(true)}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchBar}>
        <Search size={16} color={C.fgLight} />
        <TextInput
          style={s.searchInput}
          placeholder="Search name, phone, email…"
          placeholderTextColor={C.fgLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Customers List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={C.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Users size={48} color={C.border} />
            <Text style={s.emptyText}>No customers found</Text>
          </View>
        ) : (
          filtered.map((c: any, i: number) => {
            const initials = getInitials(c.name);
            const repairsCount = c.repairCount ?? c._count?.repairs ?? 0;

            return (
              <TouchableOpacity key={c.id ?? i} style={s.card} onPress={() => setSelectedCustomer(c)} activeOpacity={0.8}>
                <View style={s.cardTop}>
                  <View style={s.avatar}>
                    <Text style={s.avatarText}>{initials}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={s.cName} numberOfLines={1}>{c.name}</Text>
                    <View style={s.infoLine}>
                      <Phone size={12} color={C.fgLight} />
                      <Text style={s.infoText}>{c.phone || 'No phone'}</Text>
                    </View>
                    {!!c.email && (
                      <View style={s.infoLine}>
                        <Mail size={12} color={C.fgLight} />
                        <Text style={s.infoText}>{c.email}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={s.cardBottom}>
                  <View style={s.metricBox}>
                    <Text style={s.metricVal}>{repairsCount}</Text>
                    <Text style={s.metricLbl}>REPAIRS</Text>
                  </View>
                  <View style={s.metricBox}>
                    <Text style={s.metricVal}>LKR {Number(c.totalSpent ?? 0).toLocaleString()}</Text>
                    <Text style={s.metricLbl}>TOTAL SPENT</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Customer Detail Sheet */}
      <Modal visible={!!selectedCustomer} transparent animationType="slide">
        <View style={s.modalBg}>
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Customer Profile</Text>
              <TouchableOpacity onPress={() => setSelectedCustomer(null)}>
                <Text style={s.sheetClose}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={s.profileHeader}>
              <View style={[s.avatar, { width: 56, height: 56, borderRadius: 28 }]}>
                <Text style={[s.avatarText, { fontSize: F['2xl'] }]}>{getInitials(selectedCustomer?.name)}</Text>
              </View>
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={s.profileName}>{selectedCustomer?.name}</Text>
                <Text style={s.profileSub}>{selectedCustomer?.phone || 'No phone'}</Text>
              </View>
            </View>

            <View style={s.fieldGroupWrap}>
              <Text style={s.fieldGroupTitle}>CONTACT INFO</Text>
              <View style={s.detailRow}>
                <Text style={s.detailLbl}>Email</Text>
                <Text style={s.detailVal}>{selectedCustomer?.email || 'N/A'}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.detailLbl}>Phone</Text>
                <Text style={s.detailVal}>{selectedCustomer?.phone || 'N/A'}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.detailLbl}>Address</Text>
                <Text style={s.detailVal}>{selectedCustomer?.address || 'N/A'}</Text>
              </View>
            </View>

            <View style={s.fieldGroupWrap}>
              <Text style={s.fieldGroupTitle}>ACTIVITY SUMMARY</Text>
              <View style={s.detailRow}>
                <Text style={s.detailLbl}>Total Repairs</Text>
                <Text style={s.detailVal}>{selectedCustomer?.repairCount ?? selectedCustomer?._count?.repairs ?? 0}</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.detailLbl}>Total Spent</Text>
                <Text style={[s.detailVal, { color: C.primary, fontWeight: '900' }]}>
                  LKR {Number(selectedCustomer?.totalSpent ?? 0).toLocaleString()}
                </Text>
              </View>
            </View>

          </View>
        </View>
      </Modal>

      {/* Add Customer Modal */}
      <Modal visible={isCreateOpen} transparent animationType="slide">
        <View style={s.modalBg}>
          <View style={s.sheet}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={s.sheetHeader}>
                <Text style={s.sheetTitle}>Add New Customer</Text>
                <TouchableOpacity onPress={() => setIsCreateOpen(false)}>
                  <Text style={s.sheetClose}>Cancel</Text>
                </TouchableOpacity>
              </View>

              <Text style={s.fieldGroup}>PERSONAL INFO</Text>
              <TextInput style={s.field} placeholder="Full Name *" placeholderTextColor={C.fgLight} value={name} onChangeText={setName} />
              <TextInput style={s.field} placeholder="Phone Number *" placeholderTextColor={C.fgLight} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
              <TextInput style={s.field} placeholder="Email Address" placeholderTextColor={C.fgLight} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

              <Text style={s.fieldGroup}>ADDRESS</Text>
              <TextInput style={[s.field, { height: 60, textAlignVertical: 'top', paddingTop: 10 }]} placeholder="Street Address, City" placeholderTextColor={C.fgLight} multiline value={address} onChangeText={setAddress} />

              <TouchableOpacity style={[s.submitBtn, isCreating && { opacity: 0.6 }]} onPress={handleCreate} disabled={isCreating}>
                <Text style={s.submitBtnText}>Save Customer</Text>
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
  countBadge: { backgroundColor: C.primaryLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  countBadgeText: { fontSize: F.xs, fontWeight: '800', color: C.primary },
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
  empty: { alignItems: 'center', paddingVertical: 80 },
  emptyText: { color: C.fgLight, fontWeight: '600', marginTop: 12, fontSize: F.base },
  card: {
    backgroundColor: C.card, borderRadius: R.xl, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: C.border,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: F.lg, fontWeight: '900', color: C.primary },
  cName: { fontSize: F.lg, fontWeight: '800', color: C.fg, marginBottom: 2 },
  infoLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  infoText: { fontSize: F.xs, color: C.fgMuted, fontWeight: '600' },
  cardBottom: {
    flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.bg, paddingTop: 10, gap: 12,
  },
  metricBox: { flex: 1, backgroundColor: C.bg, borderRadius: R.md, padding: 8, alignItems: 'center' },
  metricVal: { fontSize: F.md, fontWeight: '900', color: C.fg },
  metricLbl: { fontSize: 9, fontWeight: '800', color: C.fgLight, marginTop: 2, letterSpacing: 0.5 },
  modalBg: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '85%',
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: F['2xl'], fontWeight: '900', color: C.fg },
  sheetClose: { fontSize: F.base, color: C.fgLight, fontWeight: '700' },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  profileName: { fontSize: F.xl, fontWeight: '900', color: C.fg },
  profileSub: { fontSize: F.sm, color: C.fgMuted, marginTop: 2 },
  fieldGroupWrap: { marginBottom: 16 },
  fieldGroupTitle: { fontSize: F.xs, fontWeight: '800', color: C.fgLight, letterSpacing: 0.6, marginBottom: 8 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.bg },
  detailLbl: { fontSize: F.sm, fontWeight: '700', color: C.fgMuted },
  detailVal: { fontSize: F.sm, fontWeight: '600', color: C.fg },
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
