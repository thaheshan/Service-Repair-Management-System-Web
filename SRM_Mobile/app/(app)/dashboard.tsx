import React from 'react';
import {
  View, Text, ScrollView, RefreshControl,
  TouchableOpacity, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../src/store/store';
import { useGetDashboardAnalyticsQuery } from '../../src/services/api/dashboardApiSlice';
import { Wrench, Package, Users, TrendingUp, LogOut, AlertTriangle, Bell, ShoppingCart } from '../../src/components/Icons';
import { logout } from '../../src/store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { C, R, F } from '../../src/constants/theme';

const StatCard = ({ label, value, icon: Icon, color, bg, sub }: any) => (
  <View style={[s.statCard, { flex: 1 }]}>
    <View style={[s.statIcon, { backgroundColor: bg ?? `${color}18` }]}>
      <Icon size={18} color={color} />
    </View>
    <Text style={s.statValue}>{value ?? '--'}</Text>
    <Text style={s.statLabel}>{label}</Text>
    {sub ? <Text style={s.statSub}>{sub}</Text> : null}
  </View>
);

export default function DashboardScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data, isLoading, refetch } = useGetDashboardAnalyticsQuery({ days: 30 });
  const dispatch = useDispatch();
  const router = useRouter();

  const stats = data?.data?.stats ?? data?.stats;

  const handleLogout = async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('auth_user');
    dispatch(logout());
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={C.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.headerTitle}>Dashboard</Text>
            <Text style={s.headerSub}>{user?.shopName ?? user?.shop?.name ?? 'My Shop'}</Text>
          </View>
          <View style={s.headerActions}>
            <TouchableOpacity style={s.iconBtn}>
              <Bell size={18} color={C.fgMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={[s.iconBtn, { backgroundColor: C.dangerBg, borderColor: '#FECACA' }]} onPress={handleLogout}>
              <LogOut size={18} color={C.danger} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Welcome Banner ── */}
        <View style={s.banner}>
          <View style={s.bannerInner}>
            <Text style={s.bannerEye}>WELCOME BACK</Text>
            <Text style={s.bannerName}>{user?.fullName ?? user?.name ?? 'Admin'}</Text>
            <Text style={s.bannerRole}>Role: {user?.role ?? 'ADMIN'}</Text>
          </View>
          <View style={s.bannerBadge}>
            <Text style={s.bannerBadgeText}>{(user?.fullName ?? user?.name ?? 'A')[0].toUpperCase()}</Text>
          </View>
        </View>

        {/* ── Stat Grid ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Overview · Last 30 Days</Text>
          <View style={s.statRow}>
            <StatCard label="Total Repairs" value={stats?.totalRepairs ?? 0} icon={Wrench} color={C.primary} />
            <View style={s.statGap} />
            <StatCard label="Active Jobs" value={stats?.activeRepairs ?? stats?.inProgressRepairs ?? 0} icon={Wrench} color={C.warning} />
          </View>
          <View style={s.statRow}>
            <StatCard label="Customers" value={stats?.totalCustomers ?? 0} icon={Users} color={C.success} />
            <View style={s.statGap} />
            <StatCard
              label="Revenue"
              value={`LKR ${Number(stats?.revenue ?? stats?.totalRevenue ?? 0).toLocaleString()}`}
              icon={TrendingUp}
              color="#6366F1"
            />
          </View>
          <View style={s.statRow}>
            <StatCard label="Inventory Items" value={stats?.totalInventoryItems ?? stats?.inventoryItems ?? 0} icon={Package} color="#0EA5E9" />
            <View style={s.statGap} />
            <StatCard
              label="POS Sales"
              value={stats?.totalPOSSales ?? stats?.posSales ?? 0}
              icon={ShoppingCart}
              color="#8B5CF6"
            />
          </View>
        </View>

        {/* ── Low Stock Alert ── */}
        {(stats?.lowStockItems ?? 0) > 0 && (
          <View style={s.alertBox}>
            <AlertTriangle size={20} color={C.warning} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.alertTitle}>{stats.lowStockItems} Low Stock Item{stats.lowStockItems !== 1 ? 's' : ''}</Text>
              <Text style={s.alertSub}>Check inventory for items below reorder threshold</Text>
            </View>
          </View>
        )}

        {/* ── Quick Actions ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Quick Actions</Text>
          <View style={s.qaGrid}>
            <TouchableOpacity
              style={[s.qaBtn, { backgroundColor: C.primary }]}
              onPress={() => router.push('/(app)/repairs')}
            >
              <Wrench size={18} color="#fff" />
              <Text style={[s.qaBtnText, { color: '#fff' }]}>New Repair</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.qaBtn, { backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border }]}
              onPress={() => router.push('/(app)/customers')}
            >
              <Users size={18} color={C.fg} />
              <Text style={[s.qaBtnText, { color: C.fg }]}>Add Customer</Text>
            </TouchableOpacity>
          </View>
          <View style={[s.qaGrid, { marginTop: 10 }]}>
            <TouchableOpacity
              style={[s.qaBtn, { backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border }]}
              onPress={() => router.push('/(app)/pos')}
            >
              <ShoppingCart size={18} color={C.fg} />
              <Text style={[s.qaBtnText, { color: C.fg }]}>Open POS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.qaBtn, { backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border }]}
              onPress={() => router.push('/(app)/inventory')}
            >
              <Package size={18} color={C.fg} />
              <Text style={[s.qaBtnText, { color: C.fg }]}>Inventory</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  headerTitle: { fontSize: F['4xl'], fontWeight: '900', color: C.fg },
  headerSub: { fontSize: F.sm, color: C.fgMuted, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 40, height: 40, borderRadius: R.lg,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  banner: {
    marginHorizontal: 20, marginBottom: 20,
    backgroundColor: C.primary, borderRadius: R.xxl,
    padding: 20, flexDirection: 'row', alignItems: 'center',
  },
  bannerInner: { flex: 1 },
  bannerEye: { color: C.primaryMid, fontSize: F.xs, fontWeight: '700', letterSpacing: 0.8, marginBottom: 4 },
  bannerName: { color: '#fff', fontSize: F['2xl'], fontWeight: '900' },
  bannerRole: { color: C.primaryMid, fontSize: F.sm, marginTop: 4 },
  bannerBadge: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  bannerBadgeText: { color: '#fff', fontWeight: '900', fontSize: F['2xl'] },
  section: { paddingHorizontal: 20, marginBottom: 8 },
  sectionTitle: { fontSize: F.md, fontWeight: '800', color: C.fg, marginBottom: 12 },
  statRow: { flexDirection: 'row', marginBottom: 10 },
  statGap: { width: 10 },
  statCard: {
    backgroundColor: C.card, borderRadius: R.xl, padding: 16,
    borderWidth: 1, borderColor: C.border,
  },
  statIcon: {
    width: 38, height: 38, borderRadius: R.md,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  statValue: { fontSize: F['3xl'], fontWeight: '900', color: C.fg, marginBottom: 2 },
  statLabel: { fontSize: F.xs, fontWeight: '600', color: C.fgMuted },
  statSub: { fontSize: 10, color: C.fgLight, marginTop: 2 },
  alertBox: {
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: C.warningBg, borderWidth: 1, borderColor: '#FDE68A',
    borderRadius: R.xl, padding: 16, flexDirection: 'row', alignItems: 'center',
  },
  alertTitle: { fontSize: F.md, fontWeight: '700', color: C.warningText },
  alertSub: { fontSize: F.sm, color: '#B45309', marginTop: 2 },
  qaGrid: { flexDirection: 'row', gap: 10 },
  qaBtn: {
    flex: 1, height: 48, borderRadius: R.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  qaBtnText: { fontWeight: '700', fontSize: F.base },
});
