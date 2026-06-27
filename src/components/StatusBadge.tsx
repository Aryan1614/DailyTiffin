import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderStatus } from '../types';
import { Colors } from '../theme/colors';
import { BorderRadius, Spacing } from '../theme/spacing';

interface StatusBadgeProps {
  status: OrderStatus | 'pending';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getConfig = () => {
    switch (status) {
      case 'ordered': return { label: 'Ordered', bg: Colors.vegLight, text: Colors.veg };
      case 'changed': return { label: 'Changed', bg: '#FFF3E0', text: Colors.warning };
      case 'skipped': return { label: 'Skipped', bg: Colors.skipLight, text: Colors.skip };
      case 'pending': return { label: 'Pending', bg: '#E3F2FD', text: Colors.info };
    }
  };

  const config = getConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '600' },
});

export default StatusBadge;