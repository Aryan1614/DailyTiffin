import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import dayjs from 'dayjs';
import { RootStackParamList } from '../types';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useSettingsStore } from '../store/useSettingsStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { sendTiffinMessage } from '../services/whatsappService';
import { MEAL_LABELS } from '../utils/constants';
import { buildOrderMessage, buildChangeMessage } from '../utils/messageTemplates';
import ActionButton from '../components/ActionButton';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Confirmation'>;
  route: RouteProp<RootStackParamList, 'Confirmation'>;
};

const ConfirmationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mealType, location, status } = route.params;
  const { vendorName, vendorPhone } = useSettingsStore();
  const addOrder = useHistoryStore((state) => state.addOrder);
  const mealLabel = MEAL_LABELS[mealType];
  const today = dayjs().format('DD MMM YYYY');

  const getMessage = () => {
    if (status === 'changed') return buildChangeMessage(vendorName, mealLabel, location);
    return buildOrderMessage(vendorName, mealLabel, location);
  };

  const handleSend = async () => {
    const sent = await sendTiffinMessage(vendorName, vendorPhone, mealType, location, status);
    if (sent) {
      addOrder(mealType, status, location);
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <View style={styles.summaryCard}>
        <View style={styles.row}><Text style={styles.label}>Date</Text><Text style={styles.value}>{today}</Text></View>
        <View style={styles.divider} />
        <View style={styles.row}><Text style={styles.label}>Meal</Text><Text style={styles.value}>{mealType === 'veg' ? '🥗' : '🍗'} {mealLabel}</Text></View>
        <View style={styles.divider} />
        <View style={styles.row}><Text style={styles.label}>Location</Text><Text style={styles.value}>{location}</Text></View>
        <View style={styles.divider} />
        <View style={styles.row}><Text style={styles.label}>Status</Text><Text style={[styles.value, styles.statusText]}>{status === 'changed' ? 'Changed' : 'Confirmed'}</Text></View>
      </View>
      <View style={styles.messageCard}>
        <Text style={styles.messageLabel}>WhatsApp Message:</Text>
        <Text style={styles.messageText}>{getMessage()}</Text>
      </View>
      <View style={styles.actions}>
        <ActionButton title="Send via WhatsApp" onPress={handleSend} variant="whatsapp" style={styles.btn} />
        <ActionButton title="Go Back & Edit" onPress={() => navigation.goBack()} variant="outline" style={styles.btn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg, backgroundColor: Colors.background },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text, textAlign: 'center', marginBottom: Spacing.lg },
  summaryCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, elevation: 2, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, marginBottom: Spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  divider: { height: 1, backgroundColor: Colors.divider },
  label: { fontSize: 14, color: Colors.textSecondary },
  value: { fontSize: 15, fontWeight: '600', color: Colors.text },
  statusText: { color: Colors.primary },
  messageCard: { backgroundColor: '#E8F5E9', borderRadius: BorderRadius.md, padding: Spacing.md, borderLeftWidth: 4, borderLeftColor: Colors.whatsapp, marginBottom: Spacing.xl },
  messageLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: Spacing.xs },
  messageText: { fontSize: 14, color: Colors.text, lineHeight: 20 },
  actions: { marginTop: Spacing.lg },
  btn: { marginBottom: Spacing.md },
});

export default ConfirmationScreen;