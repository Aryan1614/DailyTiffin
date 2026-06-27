import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import dayjs from 'dayjs';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useHistoryStore } from '../store/useHistoryStore';
import OrderHistoryItemComponent from '../components/OrderHistoryItem';

const HistoryScreen: React.FC = () => {
  const orders = useHistoryStore((state) => state.orders);
  const getMonthlyStats = useHistoryStore((state) => state.getMonthlyStats);
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();
  const stats = getMonthlyStats(currentMonth, currentYear);

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyTitle}>No Orders Yet</Text>
        <Text style={styles.emptySubtitle}>Your order history will appear here once you start confirming meals.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>{dayjs().format('MMMM YYYY')}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}><Text style={[styles.statNumber, { color: Colors.veg }]}>{stats.ordered}</Text><Text style={styles.statLabel}>Ordered</Text></View>
          <View style={styles.statItem}><Text style={[styles.statNumber, { color: Colors.warning }]}>{stats.changed}</Text><Text style={styles.statLabel}>Changed</Text></View>
          <View style={styles.statItem}><Text style={[styles.statNumber, { color: Colors.skip }]}>{stats.skipped}</Text><Text style={styles.statLabel}>Skipped</Text></View>
          <View style={styles.statItem}><Text style={[styles.statNumber, { color: Colors.primary }]}>{stats.total}</Text><Text style={styles.statLabel}>Total</Text></View>
        </View>
      </View>
      <FlatList data={orders} keyExtractor={(item) => item.id} renderItem={({ item }) => <OrderHistoryItemComponent order={item} />} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  statsCard: { backgroundColor: Colors.surface, margin: Spacing.lg, padding: Spacing.lg, borderRadius: BorderRadius.lg, elevation: 2, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  statsTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: Spacing.md, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '700' },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl, backgroundColor: Colors.background },
  emptyEmoji: { fontSize: 56, marginBottom: Spacing.md },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});

export default HistoryScreen;