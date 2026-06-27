import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../types';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useSettingsStore } from '../store/useSettingsStore';
import { useScheduleStore } from '../store/useScheduleStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { scheduleDailyReminder } from '../services/notificationService';
import ActionButton from '../components/ActionButton';
import ScheduleGrid from '../components/ScheduleGrid';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const settings = useSettingsStore();
  const { schedule, updateDay } = useScheduleStore();
  const orders = useHistoryStore(state => state.orders);

  const [vendorName, setVendorName] = useState(settings.vendorName);
  const [vendorPhone, setVendorPhone] = useState(settings.vendorPhone);

  const getDateFromTime = (time: string): Date => {
    const [h, m] = time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  const [selectedTime, setSelectedTime] = useState(
    getDateFromTime(settings.reminderTime),
  );
  const [showPicker, setShowPicker] = useState(false);

  const formatTimeDisplay = (date: Date): string => {
    const h = date.getHours();
    const m = date.getMinutes();
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const get24HourTime = (date: Date): string => {
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  const onTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (date) setSelectedTime(date);
  };

  const handleSave = async () => {
    if (!vendorName.trim()) {
      Alert.alert('Error', 'Please enter vendor name');
      return;
    }
    if (!vendorPhone.trim() || vendorPhone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    const time24 = get24HourTime(selectedTime);
    settings.setVendorName(vendorName.trim());
    settings.setVendorPhone(vendorPhone.trim());
    settings.setReminderTime(time24);
    settings.completeSetup();

    try {
      await scheduleDailyReminder(time24);
      Alert.alert(
        'Saved',
        `Reminder set for ${formatTimeDisplay(selectedTime)}`,
      );
    } catch (error) {
      Alert.alert('Saved', 'Settings saved!');
    }

    if (!settings.isSetupComplete) navigation.replace('Home');
  };


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Vendor Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>👤</Text>
          <Text style={styles.cardTitle}>Vendor Details</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Vendor Name"
          placeholderTextColor={Colors.textLight}
          value={vendorName}
          onChangeText={setVendorName}
        />
        <View style={styles.phoneRow}>
          <View style={styles.prefix}>
            <Text style={styles.prefixText}>+91</Text>
          </View>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="WhatsApp Number"
            placeholderTextColor={Colors.textLight}
            value={vendorPhone}
            onChangeText={setVendorPhone}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
      </View>

      {/* Time Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>🔔</Text>
          <Text style={styles.cardTitle}>Daily Reminder</Text>
        </View>
        <TouchableOpacity
          style={styles.timeDisplay}
          onPress={() => setShowPicker(!showPicker)}
        >
          <Text style={styles.timeText}>{formatTimeDisplay(selectedTime)}</Text>
          <Text style={styles.timeHint}>Tap to change</Text>
        </TouchableOpacity>
        {(showPicker || Platform.OS === 'ios') && (
          <View style={styles.pickerWrapper}>
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'compact' : 'default'}
              onChange={onTimeChange}
              style={styles.picker}
            />
          </View>
        )}
      </View>

      {/* Schedule Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>📅</Text>
          <Text style={styles.cardTitle}>Weekly Schedule</Text>
        </View>
        <Text style={styles.scheduleHint}>
          Tap to cycle: Veg → Non-Veg → Off
        </Text>
        <ScheduleGrid schedule={schedule} onUpdateDay={updateDay} />
      </View>

      {/* Save */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        activeOpacity={0.8}
      >
        <Text style={styles.saveButtonText}>
          {settings.isSetupComplete ? 'Save Changes' : 'Get Started'}
        </Text>
      </TouchableOpacity>

      {/* Reset */}
      {settings.isSetupComplete && (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            Alert.alert('Reset Data', 'Clear all settings and history?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Reset',
                style: 'destructive',
                onPress: () => {
                  settings.resetSettings();
                  useHistoryStore.getState().clearHistory();
                  navigation.replace('Splash');
                },
              },
            ]);
          }}
        >
          <Text style={styles.resetButtonText}>Reset All Data</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: Spacing.md, paddingBottom: 100 },

  welcomeCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  welcomeEmoji: { fontSize: 40, marginBottom: Spacing.sm },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  welcomeText: { fontSize: 14, color: Colors.white, opacity: 0.85 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardIcon: { fontSize: 20, marginRight: Spacing.sm },
  cardTitle: { fontSize: 16, fontWeight: '600', color: Colors.text },

  input: {
    backgroundColor: '#F8F8FA',
    borderRadius: BorderRadius.md,
    padding: 14,
    fontSize: 16,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  phoneRow: { flexDirection: 'row', alignItems: 'center' },
  prefix: {
    backgroundColor: '#F0F0F2',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  prefixText: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary },

  timeDisplay: {
    backgroundColor: '#F0F7FF',
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timeText: { fontSize: 20, fontWeight: '600', color: Colors.primary },
  timeHint: { fontSize: 12, color: Colors.textSecondary, marginLeft: Spacing.sm },
  pickerWrapper: { alignItems: 'center', marginTop: Spacing.sm },
  picker: { width: 200 },

  scheduleHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },

  reportButton: {
    backgroundColor: '#F0F7FF',
    borderRadius: BorderRadius.md,
    padding: 12,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  reportButtonText: { fontSize: 14, fontWeight: '600', color: Colors.primary },

  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: 18,
    alignItems: 'center',
    marginTop: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: { fontSize: 17, fontWeight: '700', color: Colors.white },

  resetButton: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    padding: Spacing.md,
  },
  resetButtonText: { fontSize: 14, color: Colors.error, fontWeight: '500' },
});

export default SettingsScreen;
