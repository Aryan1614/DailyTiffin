import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Confirmation'>;
  route: RouteProp<RootStackParamList, 'Confirmation'>;
};

const ConfirmationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mealType, location, status } = route.params;
  const { vendorName, vendorPhone } = useSettingsStore();
  const addOrder = useHistoryStore(state => state.addOrder);
  const today = dayjs().format('DD MMM YYYY');
  const mealLabel = MEAL_LABELS[mealType];

  const handleSend = async () => {
    const sent = await sendTiffinMessage(
      vendorName,
      vendorPhone,
      mealType,
      location,
      status,
    );
    if (sent) {
      addOrder(mealType, status, location);
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.successIcon}>
        <Text style={styles.checkmark}>
          {status === 'skipped' ? '🚫' : '📋'}
        </Text>
      </View>

      <Text style={styles.title}>Order Summary</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{today}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Meal</Text>
          <Text style={styles.value}>
            {status === 'skipped'
              ? 'Skipped'
              : `${mealType === 'veg' ? '🥗' : '🍗'} ${mealLabel}`}
          </Text>
        </View>
        {status !== 'skipped' && (
          <>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{location}</Text>
            </View>
          </>
        )}
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Action</Text>
          <Text
            style={[
              styles.value,
              { color: status === 'skipped' ? Colors.skip : Colors.veg },
            ]}
          >
            {status === 'ordered'
              ? 'Confirm'
              : status === 'changed'
              ? 'Changed'
              : 'Skip'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSend}
        activeOpacity={0.8}
      >
        <Text style={styles.sendButtonText}>
          {status === 'skipped'
            ? 'Send Cancel via WhatsApp'
            : 'Send via WhatsApp'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
  },
  successIcon: { alignItems: 'center', marginBottom: Spacing.md },
  checkmark: { fontSize: 48 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: { height: 1, backgroundColor: '#F0F0F2' },
  label: { fontSize: 14, color: Colors.textSecondary },
  value: { fontSize: 15, fontWeight: '600', color: Colors.text },
  sendButton: {
    backgroundColor: Colors.whatsapp,
    borderRadius: BorderRadius.lg,
    padding: 18,
    alignItems: 'center',
    shadowColor: Colors.whatsapp,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonText: { fontSize: 17, fontWeight: '700', color: Colors.white },
  cancelBtn: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    padding: Spacing.md,
  },
  cancelText: { fontSize: 14, color: Colors.textSecondary },
});

export default ConfirmationScreen;
