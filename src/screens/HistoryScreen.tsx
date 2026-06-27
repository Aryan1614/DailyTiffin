import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import dayjs from 'dayjs';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useHistoryStore } from '../store/useHistoryStore';
import OrderHistoryItemComponent from '../components/OrderHistoryItem';
import { Alert } from 'react-native';
import { exportToExcel } from '../services/excelService';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

type FilterType = 'all' | 'veg' | 'nonveg' | 'skipped';

const HistoryScreen: React.FC = () => {
  const orders = useHistoryStore(state => state.orders);

  // Month navigation
  const [monthOffset, setMonthOffset] = useState(0);
  const selectedDate = dayjs().subtract(monthOffset, 'month');
  const selectedMonth = selectedDate.month();
  const selectedYear = selectedDate.year();
  const monthLabel = selectedDate.format('MMMM YYYY');
  const navigation = useNavigation();

  // Filter
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = orders.filter(o => {
      const d = dayjs(o.date);
      return d.month() === selectedMonth && d.year() === selectedYear;
    });

    switch (activeFilter) {
      case 'veg':
        return result.filter(
          o => o.status !== 'skipped' && o.mealType === 'veg',
        );
      case 'nonveg':
        return result.filter(
          o => o.status !== 'skipped' && o.mealType === 'nonveg',
        );
      case 'skipped':
        return result.filter(o => o.status === 'skipped');
      default:
        return result;
    }
  }, [orders, selectedMonth, selectedYear, activeFilter]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleExport} style={{ padding: 8 }}>
          <Text style={{ fontSize: 20 }}>📥</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, filteredOrders]);

  const handleExport = async () => {
    if (filteredOrders.length === 0) {
      Alert.alert('No Data', 'No orders to export for this filter');
      return;
    }
    try {
      await exportToExcel(filteredOrders, monthLabel);
    } catch (error: any) {
      if (error?.message !== 'User did not share') {
        Alert.alert('Error', 'Failed to export data');
      }
    }
  };

  // Stats for selected month
  const monthOrders = useMemo(() => {
    return orders.filter(o => {
      const d = dayjs(o.date);
      return d.month() === selectedMonth && d.year() === selectedYear;
    });
  }, [orders, selectedMonth, selectedYear]);

  const stats = {
    veg: monthOrders.filter(o => o.status !== 'skipped' && o.mealType === 'veg')
      .length,
    nonveg: monthOrders.filter(
      o => o.status !== 'skipped' && o.mealType === 'nonveg',
    ).length,
    skipped: monthOrders.filter(o => o.status === 'skipped').length,
    total: monthOrders.filter(o => o.status !== 'skipped').length,
  };

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyTitle}>No Orders Yet</Text>
        <Text style={styles.emptySubtitle}>
          Your order history will appear here once you start confirming meals.
        </Text>
      </View>
    );
  }

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'veg', label: 'Veg' },
    { key: 'nonveg', label: 'Non-Veg' },
    { key: 'skipped', label: 'Skipped' },
  ];

  return (
    <View style={styles.container}>
      {/* Month Navigation */}
      <View style={styles.monthNav}>
        <TouchableOpacity
          onPress={() => setMonthOffset(monthOffset + 1)}
          style={styles.navButton}
        >
          <Text style={styles.navArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <TouchableOpacity
          onPress={() => setMonthOffset(Math.max(0, monthOffset - 1))}
          style={[styles.navButton, monthOffset === 0 && styles.navDisabled]}
          disabled={monthOffset === 0}
        >
          <Text
            style={[
              styles.navArrow,
              monthOffset === 0 && styles.navArrowDisabled,
            ]}
          >
            {'>'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.veg }]}>
              {stats.veg}
            </Text>
            <Text style={styles.statLabel}>Veg</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.nonveg }]}>
              {stats.nonveg}
            </Text>
            <Text style={styles.statLabel}>Non-Veg</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.skip }]}>
              {stats.skipped}
            </Text>
            <Text style={styles.statLabel}>Skipped</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.primary }]}>
              {stats.total}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setActiveFilter(f.key)}
            style={[
              styles.filterChip,
              activeFilter === f.key && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === f.key && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results count */}
      <Text style={styles.resultCount}>{filteredOrders.length} orders</Text>

      {/* Order List */}
      {filteredOrders.length > 0 ? (
        <View style={{ flex: 1 }}>
          <FlatList
            data={filteredOrders}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <OrderHistoryItemComponent order={item} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={true}
          />
        </View>
      ) : (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>No orders for this filter</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },

  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  navButton: { padding: Spacing.sm, width: 40, alignItems: 'center' },
  navDisabled: { opacity: 0.3 },
  navArrow: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  navArrowDisabled: { color: Colors.textLight },
  monthLabel: { fontSize: 17, fontWeight: '600', color: Colors.text },

  statsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '700' },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  filterTextActive: { color: Colors.white, fontWeight: '600' },

  resultCount: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    fontSize: 12,
    color: Colors.textSecondary,
  },

  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.xs,
  },

  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  noResultsText: { fontSize: 14, color: Colors.textSecondary },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: '#F2F2F7',
  },
  emptyEmoji: { fontSize: 56, marginBottom: Spacing.md },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  exportButton: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.veg,
  },
  exportText: { fontSize: 14, fontWeight: '600', color: Colors.veg },
});

export default HistoryScreen;
