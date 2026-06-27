import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MealType } from '../types';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useScheduleStore } from '../store/useScheduleStore';
import { getTodaySchedule } from '../utils/helpers';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MealDecision'>;
};

const MealDecisionScreen: React.FC<Props> = ({ navigation }) => {
  const schedule = useScheduleStore(state => state.schedule);
  const todaySchedule = getTodaySchedule(schedule);
  const currentMeal = todaySchedule?.mealType as MealType;

  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  if (!todaySchedule || todaySchedule.mealType === 'off') {
    return (
      <View style={styles.container}>
        <View style={styles.offCard}>
          <Text style={styles.offEmoji}>😴</Text>
          <Text style={styles.offText}>Today is an off day!</Text>
        </View>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleConfirm = () => {
    if (selectedMeal && selectedLocation) {
      navigation.navigate('Confirmation', {
        mealType: selectedMeal,
        location: selectedLocation,
        status: 'changed',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Current info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          Scheduled: {currentMeal === 'veg' ? '🥗 Veg' : '🍗 Non-Veg'}
        </Text>
      </View>

      {/* Select Meal */}
      <Text style={styles.sectionTitle}>Select Meal</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.option,
            selectedMeal === 'veg' && styles.optionSelectedVeg,
          ]}
          onPress={() => setSelectedMeal('veg')}
        >
          <Text style={styles.optionEmoji}>🥗</Text>
          <Text
            style={[
              styles.optionText,
              selectedMeal === 'veg' && { color: Colors.veg },
            ]}
          >
            Veg
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            selectedMeal === 'nonveg' && styles.optionSelectedNonveg,
          ]}
          onPress={() => setSelectedMeal('nonveg')}
        >
          <Text style={styles.optionEmoji}>🍗</Text>
          <Text
            style={[
              styles.optionText,
              selectedMeal === 'nonveg' && { color: Colors.nonveg },
            ]}
          >
            Non-Veg
          </Text>
        </TouchableOpacity>
      </View>

      {/* Select Location */}
      <Text style={styles.sectionTitle}>Select Location</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.option,
            selectedLocation === 'PG' && styles.optionSelectedLocation,
          ]}
          onPress={() => setSelectedLocation('PG')}
        >
          <Text style={styles.optionEmoji}>🏠</Text>
          <Text
            style={[
              styles.optionText,
              selectedLocation === 'PG' && { color: Colors.primary },
            ]}
          >
            PG
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            selectedLocation === 'Office' && styles.optionSelectedLocation,
          ]}
          onPress={() => setSelectedLocation('Office')}
        >
          <Text style={styles.optionEmoji}>🏢</Text>
          <Text
            style={[
              styles.optionText,
              selectedLocation === 'Office' && { color: Colors.primary },
            ]}
          >
            Office
          </Text>
        </TouchableOpacity>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={[
          styles.confirmButton,
          (!selectedMeal || !selectedLocation) && styles.confirmDisabled,
        ]}
        onPress={handleConfirm}
        disabled={!selectedMeal || !selectedLocation}
        activeOpacity={0.8}
      >
        <Text style={styles.confirmText}>Continue</Text>
      </TouchableOpacity>

      {/* Cancel */}
      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg, backgroundColor: '#F2F2F7' },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  infoText: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  option: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionSelectedVeg: { borderColor: Colors.veg, backgroundColor: '#F0FFF0' },
  optionSelectedNonveg: {
    borderColor: Colors.nonveg,
    backgroundColor: '#FFF5F5',
  },
  optionSelectedLocation: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF8F4',
  },
  optionEmoji: { fontSize: 32, marginBottom: 6 },
  optionText: { fontSize: 14, fontWeight: '600', color: Colors.text },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: 18,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  confirmDisabled: { opacity: 0.4 },
  confirmText: { fontSize: 17, fontWeight: '700', color: Colors.white },
  cancelBtn: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    padding: Spacing.md,
  },
  cancelText: { fontSize: 14, color: Colors.textSecondary },
  offCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  offEmoji: { fontSize: 48, marginBottom: Spacing.md },
  offText: { fontSize: 18, fontWeight: '600', color: Colors.textSecondary },
});

export default MealDecisionScreen;
