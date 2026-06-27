import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import { RootStackParamList, MealType } from '../types';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useScheduleStore } from '../store/useScheduleStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { getTodaySchedule, getGreeting } from '../utils/helpers';
import { sendTiffinMessage } from '../services/whatsappService';
import MealCard from '../components/MealCard';
import ActionButton from '../components/ActionButton';
import StatusBadge from '../components/StatusBadge';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const schedule = useScheduleStore((state) => state.schedule);
  const orders = useHistoryStore((state) => state.orders);
  const addOrder = useHistoryStore((state) => state.addOrder);
  const { vendorName, vendorPhone } = useSettingsStore();

  const todaySchedule = getTodaySchedule(schedule);
  const todayFormatted = dayjs().format('dddd, DD MMMM YYYY');
  const currentMeal = todaySchedule?.mealType as MealType;

  // Derive today's order from orders array
  const today = dayjs().format('YYYY-MM-DD');
  const todayOrder = orders.find((o) => o.date === today);

  // Derive monthly stats from orders array
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();
  const monthOrders = orders.filter((o) => {
    const d = dayjs(o.date);
    return d.month() === currentMonth && d.year() === currentYear;
  });
  const monthStats = {
    ordered: monthOrders.filter((o) => o.status === 'ordered').length,
    changed: monthOrders.filter((o) => o.status === 'changed').length,
    skipped: monthOrders.filter((o) => o.status === 'skipped').length,
  };

  const handleQuickOrder = async (location: string) => {
    const sent = await sendTiffinMessage(vendorName, vendorPhone, currentMeal, location, 'ordered');
    if (sent) {
      addOrder(currentMeal, 'ordered', location);
    }
  };

  const handleSkip = () => {
    Alert.alert('Skip Today', 'No tiffin for today?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes, Skip',
        style: 'destructive',
        onPress: async () => {
          const sent = await sendTiffinMessage(vendorName, vendorPhone, currentMeal, '', 'skipped');
          if (sent) {
            addOrder(currentMeal, 'skipped', '');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()}!</Text>
        <Text style={styles.date}>{todayFormatted}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Meal</Text>
          {todayOrder ? <StatusBadge status={todayOrder.status} /> : <StatusBadge status="pending" />}
        </View>
        {todaySchedule ? (
          <MealCard mealType={todaySchedule.mealType} size="large" />
        ) : (
          <View style={styles.noSchedule}>
            <Text style={styles.noScheduleText}>No schedule set for today</Text>
          </View>
        )}
      </View>

      {!todayOrder && todaySchedule && todaySchedule.mealType !== 'off' && (
        <View style={styles.section}>
          <Text style={styles.quickLabel}>Quick Confirm:</Text>
          <View style={styles.quickRow}>
            <ActionButton title="PG" onPress={() => handleQuickOrder('PG')} variant="success" style={styles.quickBtn} />
            <ActionButton title="Office" onPress={() => handleQuickOrder('Office')} variant="primary" style={styles.quickBtn} />
            <ActionButton title="Skip" onPress={handleSkip} variant="outline" style={styles.quickBtn} />
          </View>
          <ActionButton
            title="Change Meal"
            onPress={() => navigation.navigate('MealDecision')}
            variant="outline"
            style={styles.changeBtn}
          />
        </View>
      )}

      {todayOrder && (
        <View style={styles.orderedMessage}>
          <Text style={styles.orderedText}>
            {todayOrder.status === 'skipped'
              ? 'Skipped for today'
              : `Done - ${todayOrder.mealType === 'veg' ? 'Veg' : 'Non-Veg'} to ${todayOrder.location}`}
          </Text>
        </View>
      )}

      {todaySchedule && todaySchedule.mealType === 'off' && (
        <View style={styles.offMessage}>
          <Text style={styles.offText}>Off day - no tiffin today</Text>
        </View>
      )}

      <ActionButton title="View History" onPress={() => navigation.navigate('History')} variant="outline" style={styles.historyBtn} />

      {/* Monthly Stats */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>This Month</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.veg }]}>
              {monthOrders.filter(o => o.status !== 'skipped' && o.mealType === 'veg').length}
            </Text>
            <Text style={styles.statLabel}>Veg</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.nonveg }]}>
              {monthOrders.filter(o => o.status !== 'skipped' && o.mealType === 'nonveg').length}
            </Text>
            <Text style={styles.statLabel}>Non-Veg</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.skip }]}>
              {monthStats.skipped}
            </Text>
            <Text style={styles.statLabel}>Skipped</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: Colors.primary }]}>
              {monthOrders.filter(o => o.status !== 'skipped').length}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg },
  header: { marginBottom: Spacing.lg },
  greeting: { fontSize: 24, fontWeight: '700', color: Colors.text },
  date: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  section: { marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.text },
  noSchedule: { padding: Spacing.xl, backgroundColor: Colors.skipLight, borderRadius: BorderRadius.lg, alignItems: 'center' },
  noScheduleText: { color: Colors.textSecondary, fontSize: 16 },
  quickLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  quickBtn: { flex: 1, marginHorizontal: 4 },
  changeBtn: { marginTop: Spacing.xs },
  orderedMessage: { backgroundColor: Colors.vegLight, padding: Spacing.lg, borderRadius: BorderRadius.md, marginBottom: Spacing.lg, alignItems: 'center' },
  orderedText: { color: Colors.veg, fontWeight: '600', fontSize: 16 },
  offMessage: { backgroundColor: Colors.skipLight, padding: Spacing.lg, borderRadius: BorderRadius.md, marginBottom: Spacing.lg, alignItems: 'center' },
  offText: { color: Colors.skip, fontWeight: '600', fontSize: 16 },
  historyBtn: { marginBottom: Spacing.lg },
  statsCard: { backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: BorderRadius.lg, elevation: 2, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  statsTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: Spacing.md },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: '700', color: Colors.primary },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
});

export default HomeScreen;