import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderHistoryItem as OrderType } from '../types';
import { Colors } from '../theme/colors';
import { BorderRadius, Spacing } from '../theme/spacing';
import { formatDate } from '../utils/helpers';
import StatusBadge from './StatusBadge';

interface Props {
  order: OrderType;
}

const OrderHistoryItemComponent: React.FC<Props> = ({ order }) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.date}>{formatDate(order.date)}</Text>
        <Text style={styles.details}>
          {order.status === 'skipped' ? 'No tiffin' : `${order.mealType === 'veg' ? 'Veg' : 'Non-Veg'} - ${order.location}`}
        </Text>
      </View>
      <StatusBadge status={order.status} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.sm, elevation: 1, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  left: { flex: 1 },
  date: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 2 },
  details: { fontSize: 13, color: Colors.textSecondary },
});

export default OrderHistoryItemComponent;