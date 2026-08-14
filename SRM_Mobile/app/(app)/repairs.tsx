import React, { useState } from 'react';
import {
  View, Text, ScrollView, RefreshControl, TextInput,
  TouchableOpacity, Modal, Alert, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useGetRepairsQuery, useCreateRepairMutation,
  useUpdateRepairStatusMutation, useAddRepairNoteMutation
} from '../../src/services/api/repairsApiSlice';
import { useGetCustomersQuery, useCreateCustomerMutation } from '../../src/services/api/customersApiSlice';
import { Search, Plus, Wrench, Check } from '../../src/components/Icons';
import { C, R, F, STATUS } from '../../src/constants/theme';

const FILTER_TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'NOT_STARTED', label: 'Pending' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'READY_TO_TAKE', label: 'Ready' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: '#EF4444', HIGH: '#F97316', MEDIUM: '#3B82F6', LOW: '#10B981',
};

export default function RepairsScreen() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  // Create form
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [issue, setIssue] = useState('');
  const [estCost, setEstCost] = useState('');
  const [advance, setAdvance] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  const { data: repairsData, isLoading, refetch } = useGetRepairsQuery({});
  const { data: customersData } = useGetCustomersQuery({});
  const [createRepair, { isLoading: isCreating }] = useCreateRepairMutation();
  const [updateRepairStatus] = useUpdateRepairStatusMutation();
  const [addRepairNote] = useAddRepairNoteMutation();
  const [createCustomer] = useCreateCustomerMutation();

  const repairs: any[] = repairsData?.data ?? repairsData ?? [];
  const customers: any[] = customersData?.data ?? customersData ?? [];

  const filtered = repairs.filter((r: any) => {
    const q = search.toLowerCase();
    const match =
      (r.deviceModel ?? r.deviceBrand ?? '').toLowerCase().includes(q) ||
      (r.customerName ?? r.customer?.name ?? '').toLowerCase().includes(q) ||
      (r.ticketNumber ?? '').toLowerCase().includes(q);
    return filterStatus === 'ALL' ? match : match && r.status === filterStatus;
  });

  const handleUpdateStatus = async (status: string) => {
    if (!selectedRepair) return;
    try {
      await updateRepairStatus({ id: selectedRepair.id, status }).unwrap();
      setSelectedRepair((p: any) => p ? { ...p, status } : null);
      refetch();
    } catch { Alert.alert('Error', 'Failed to update status'); }
  };

  const handleAddNote = async () => {
    if (!selectedRepair || !newNote.trim()) return;
    try {
      await addRepairNote({ id: selectedRepair.id, text: newNote.trim() }).unwrap();
      Alert.alert('Success', 'Note added');
      setNewNote('');
      setSelectedRepair(null);
      refetch();
    } catch { Alert.alert('Error', 'Failed to add note'); }
  };

  const handleCreate = async () => {
    if (!cName.trim() || !deviceModel.trim() || !issue.trim() || !estCost.trim()) {
      Alert.alert('Required Fields', 'Fill in customer name, device model, issue and estimated cost.');
      return;
    }
    try {
      const existing = customers.find(c => c.name?.toLowerCase() === cName.trim().toLowerCase());
      let customerId = existing?.id;
      if (!customerId) {
        const nc = await createCustomer({ name: cName.trim(), phone: cPhone.trim() || '+94 000 000 000' }).unwrap();
        customerId = nc.customerId ?? nc.id;
      }
      await createRepair({
        customerId, deviceModel: deviceModel.trim(), deviceBrand: 'Generic',
        issueDescription: issue.trim(), estimatedCost: parseFloat(estCost),
        advancePayment: parseFloat(advance || '0'), priority, status: 'NOT_STARTED',
      }).unwrap();
      Alert.alert('Success', 'Repair ticket created');
      setIsCreateOpen(false);
      setCName(''); setCPhone(''); setDeviceModel(''); setIssue('');
      setEstCost(''); setAdvance(''); setPriority('MEDIUM');
      refetch();
    } catch (err: any) {
      Alert.alert('Error', err?.data?.message || 'Failed to create ticket');
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Repairs</Text>
        <TouchableOpacity style={s.addBtn} onPress={() => setIsCreateOpen(true)}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchBar}>
        <Search size={16} color={C.fgLight} />
        <TextInput
          style={s.searchInput}
          placeholder="Search customer, model, ticket…"
          placeholderTextColor={C.fgLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsScroll} contentContainerStyle={s.tabsContent}>
        {FILTER_TABS.map(t => {
          const active = filterStatus === t.key;
          return (
            <TouchableOpacity key={t.key} onPress={() => setFilterStatus(t.key)} style={[s.tab, active && s.tabActive]}>
              <Text style={[s.tabText, active && s.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* List */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={C.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Wrench size={48} color={C.border} />
            <Text style={s.emptyText}>No repair tickets found</Text>
          </View>
        ) : (
          filtered.map((r: any, i: number) => {
            const sc = STATUS[r.status] ?? STATUS['NOT_STARTED'];
            const pc = PRIORITY_COLORS[r.priority] ?? PRIORITY_COLORS.MEDIUM;
            return (
              <TouchableOpacity key={r.id ?? i} style={s.card} onPress={() => setSelectedRepair(r)} activeOpacity={0.75}>
                <View style={s.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cardDevice} numberOfLines={1}>
                      {r.deviceModel ?? r.deviceBrand ?? 'Device'}
                    </Text>
                    <Text style={s.cardCustomer}>
                      {r.customerName ?? r.customer?.name ?? 'Customer'}
                    </Text>
                  </View>
                  <View style={{ gap: 6, alignItems: 'flex-end' }}>
                    <View style={[s.badge, { backgroundColor: sc.bg }]}>
                      <Text style={[s.badgeText, { color: sc.text }]}>{sc.label}</Text>
                    </View>
                    {r.priority && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: pc }} />
                        <Text style={{ fontSize: F.xs, color: C.fgMuted, fontWeight: '600' }}>
                          {r.priority}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={s.cardIssue} numberOfLines={2}>
                  {r.issueDescription ?? r.issue ?? 'No description provided'}
                </Text>
                <View style={s.cardFooter}>
                  <Text style={s.cardTicket}>#{r.ticketNumber ?? (r.id ?? '').slice(0, 8)}</Text>
                  <Text style={s.cardCost}>LKR {Number(r.estimatedCost ?? 0).toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selectedRepair} transparent animationType="slide">
        <View style={s.modalBg}>
          <View style={s.sheet}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Sheet Header */}
              <View style={s.sheetHeader}>
                <Text style={s.sheetTitle}>Repair Details</Text>
                <TouchableOpacity onPress={() => setSelectedRepair(null)}>
                  <Text style={s.sheetClose}>Close</Text>
                </TouchableOpacity>
              </View>

              {/* Ticket Info Card */}
              <View style={s.infoCard}>
                <Text style={s.infoDevice}>{selectedRepair?.deviceModel ?? 'Device'}</Text>
                <Text style={s.infoMeta}>Ticket #{selectedRepair?.ticketNumber ?? (selectedRepair?.id ?? '').slice(0, 8)}</Text>
                <View style={s.infoRow}>
                  <Text style={s.infoRowLabel}>Customer</Text>
                  <Text style={s.infoRowValue}>{selectedRepair?.customerName ?? selectedRepair?.customer?.name ?? 'N/A'}</Text>
                </View>
                <View style={s.infoRow}>
                  <Text style={s.infoRowLabel}>Technician</Text>
                  <Text style={s.infoRowValue}>{selectedRepair?.technicianName ?? selectedRepair?.technician?.name ?? 'Unassigned'}</Text>
                </View>
              </View>

              {/* Costs */}
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
                <View style={[s.costBox, { flex: 1 }]}>
                  <Text style={s.costLabel}>ESTIMATED</Text>
                  <Text style={[s.costValue, { color: C.fg }]}>
                    LKR {Number(selectedRepair?.estimatedCost ?? 0).toLocaleString()}
                  </Text>
                </View>
                <View style={[s.costBox, { flex: 1 }]}>
                  <Text style={s.costLabel}>ADVANCE PAID</Text>
                  <Text style={[s.costValue, { color: C.success }]}>
                    LKR {Number(selectedRepair?.advancePayment ?? 0).toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Issue */}
              <View style={{ marginBottom: 16 }}>
                <Text style={s.sectionLabel}>Problem Description</Text>
                <Text style={s.issueText}>
                  {selectedRepair?.issueDescription ?? selectedRepair?.issue ?? 'No description'}
                </Text>
              </View>

              {/* Update Status */}
              <Text style={s.sectionLabel}>Update Status</Text>
              <View style={s.statusGrid}>
                {['NOT_STARTED', 'IN_PROGRESS', 'READY_TO_TAKE', 'CANCELLED'].map(st => {
                  const isCurrent = selectedRepair?.status === st;
                  const sc = STATUS[st];
                  return (
                    <TouchableOpacity
                      key={st}
                      onPress={() => handleUpdateStatus(st)}
                      style={[s.statusBtn, isCurrent && { backgroundColor: sc.bg, borderColor: sc.text }]}
                    >
                      {isCurrent && <Check size={11} color={sc.text} />}
                      <Text style={[s.statusBtnText, { color: isCurrent ? sc.text : C.fgMuted }]}>
                        {sc.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Add Note */}
              <Text style={[s.sectionLabel, { marginTop: 16 }]}>Internal Notes</Text>
              <TextInput
                style={s.noteInput}
                placeholder="Add technician notes…"
                placeholderTextColor={C.fgLight}
                value={newNote}
                onChangeText={setNewNote}
                multiline
              />
              <TouchableOpacity style={s.noteBtn} onPress={handleAddNote}>
                <Text style={s.noteBtnText}>Submit Note</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Create Modal */}
      <Modal visible={isCreateOpen} transparent animationType="slide">
        <View style={s.modalBg}>
          <View style={s.sheet}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={s.sheetHeader}>
                <Text style={s.sheetTitle}>New Repair Ticket</Text>
                <TouchableOpacity onPress={() => setIsCreateOpen(false)}>
                  <Text style={s.sheetClose}>Cancel</Text>
                </TouchableOpacity>
              </View>

              <Text style={s.fieldGroup}>CLIENT INFORMATION</Text>
              <TextInput style={s.field} placeholder="Customer Full Name *" placeholderTextColor={C.fgLight} value={cName} onChangeText={setCName} />
              <TextInput style={s.field} placeholder="Phone Number" placeholderTextColor={C.fgLight} keyboardType="phone-pad" value={cPhone} onChangeText={setCPhone} />

              <Text style={s.fieldGroup}>DEVICE & ISSUE</Text>
              <TextInput style={s.field} placeholder="Device Model (e.g. iPhone 16 Pro) *" placeholderTextColor={C.fgLight} value={deviceModel} onChangeText={setDeviceModel} />
              <TextInput style={[s.field, { height: 72, textAlignVertical: 'top', paddingTop: 12 }]} placeholder="Problem Description *" placeholderTextColor={C.fgLight} multiline value={issue} onChangeText={setIssue} />

              <Text style={s.fieldGroup}>PRICING (LKR)</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                <TextInput style={[s.field, { flex: 1, marginBottom: 0 }]} placeholder="Estimated Cost *" placeholderTextColor={C.fgLight} keyboardType="numeric" value={estCost} onChangeText={setEstCost} />
                <TextInput style={[s.field, { flex: 1, marginBottom: 0 }]} placeholder="Advance Paid" placeholderTextColor={C.fgLight} keyboardType="numeric" value={advance} onChangeText={setAdvance} />
              </View>

              <Text style={s.fieldGroup}>PRIORITY</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(p => {
                  const active = priority === p;
                  const col = PRIORITY_COLORS[p];
                  return (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPriority(p)}
                      style={[s.priorityBtn, active && { borderColor: col, backgroundColor: `${col}15` }]}
                    >
                      <Text style={[s.priorityText, active && { color: col }]}>{p}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity style={[s.submitBtn, isCreating && { opacity: 0.6 }]} onPress={handleCreate} disabled={isCreating}>
                <Text style={s.submitBtnText}>Create Ticket</Text>
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
  tabsScroll: { maxHeight: 36, marginBottom: 12 },
  tabsContent: { paddingHorizontal: 20, gap: 8 },
  tab: {
    paddingHorizontal: 14, height: 32, borderRadius: 16,
    backgroundColor: C.card, justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  tabActive: { backgroundColor: C.primary, borderColor: C.primary },
  tabText: { fontSize: F.md, fontWeight: '700', color: C.fgMuted },
  tabTextActive: { color: '#fff' },
  empty: { alignItems: 'center', paddingVertical: 80 },
  emptyText: { color: C.fgLight, fontWeight: '600', marginTop: 12, fontSize: F.base },
  card: {
    backgroundColor: C.card, borderRadius: R.xl, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: C.border, elevation: 1,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardDevice: { fontWeight: '800', fontSize: F.lg, color: C.fg },
  cardCustomer: { fontSize: F.sm, color: C.fgMuted, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: F.xs, fontWeight: '700' },
  cardIssue: { fontSize: F.md, color: C.fgMuted, marginBottom: 10, lineHeight: 18 },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: C.bg, paddingTop: 10,
  },
  cardTicket: { fontSize: F.sm, color: C.fgLight },
  cardCost: { fontSize: F.sm, fontWeight: '700', color: C.primary },
  modalBg: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '88%',
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: F['2xl'], fontWeight: '900', color: C.fg },
  sheetClose: { fontSize: F.base, color: C.fgLight, fontWeight: '700' },
  infoCard: { backgroundColor: C.bg, borderRadius: R.xl, padding: 16, marginBottom: 16 },
  infoDevice: { fontSize: F.lg, fontWeight: '900', color: C.fg, marginBottom: 4 },
  infoMeta: { fontSize: F.sm, color: C.fgMuted, marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderTopWidth: 1, borderTopColor: C.border },
  infoRowLabel: { fontSize: F.sm, fontWeight: '700', color: C.fgMuted },
  infoRowValue: { fontSize: F.sm, color: C.fg, fontWeight: '600' },
  costBox: { backgroundColor: C.bg, borderRadius: R.lg, padding: 14 },
  costLabel: { fontSize: F.xs, fontWeight: '700', color: C.fgLight, letterSpacing: 0.5, marginBottom: 6 },
  costValue: { fontSize: F.lg, fontWeight: '900' },
  sectionLabel: { fontSize: F.sm, fontWeight: '800', color: C.fg, marginBottom: 10 },
  issueText: { fontSize: F.base, color: C.fgMuted, lineHeight: 22 },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: R.md,
    backgroundColor: C.muted, borderWidth: 1, borderColor: 'transparent',
  },
  statusBtnText: { fontSize: F.sm, fontWeight: '700' },
  noteInput: {
    borderWidth: 1.5, borderColor: C.border, borderRadius: R.lg, padding: 12,
    fontSize: F.base, height: 64, textAlignVertical: 'top', color: C.fg, marginBottom: 10,
  },
  noteBtn: {
    height: 40, borderRadius: R.lg, backgroundColor: C.muted,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  noteBtnText: { fontSize: F.md, fontWeight: '700', color: C.fg },
  fieldGroup: { fontSize: F.xs, fontWeight: '800', color: C.fgMuted, letterSpacing: 0.6, marginBottom: 8, marginTop: 4 },
  field: {
    height: 46, borderWidth: 1.5, borderColor: C.border, borderRadius: R.lg,
    paddingHorizontal: 14, fontSize: F.base, color: C.fg, marginBottom: 10, backgroundColor: C.card,
  },
  priorityBtn: {
    flex: 1, height: 36, borderRadius: R.md, borderWidth: 1.5, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center', backgroundColor: C.muted,
  },
  priorityText: { fontSize: F.xs, fontWeight: '800', color: C.fgMuted },
  submitBtn: {
    height: 50, borderRadius: R.lg, backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: F.base },
});
