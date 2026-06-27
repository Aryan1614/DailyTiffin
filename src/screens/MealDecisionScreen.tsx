import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MealType } from '../types';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useScheduleStore } from '../store/useScheduleStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { getTodaySchedule } from '../utils/helpers';
import { sendTiffinMessage } from '../services/whatsappService';
import MealCard from '../components/MealCard';
import ActionButton from '../components/ActionButton';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MealDecision'>;
};

const MealDecisionScreen: React.FC<Props> = ({ navigation }) => {
  const schedule = useScheduleStore((state) => state.schedule);
  const { vendorName, vendorPhone } = useSettingsStore();
  const addOrder = useHistoryStore((state) => state.addOrder);
  const todaySchedule = getTodaySchedule(schedule);
  const [showChangePicker, setShowChangePicker] = useState(false);
  const currentMeal = todaySchedule?.mealType as MealType;

  const handleKeep = () => {
    navigation.navigate('Location', { mealType: currentMeal, status: 'ordered' });
  };

  const handleChange = (newMeal: MealType) => {
    navigation.navigate('Location', { mealType: newMeal, status: 'changed' });
  };

  const handleSkip = () => {
    Alert.alert('Skip Today', 'Are you sure you want to skip tiffin today?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes, Skip',
        style: 'destructive',
        onPress: async () => {
          const sent = await sendTiffinMessage(vendorName, vendorPhone, currentMeal, '', 'skipped');
          if (sent) {
            addOrder(currentMeal, 'skipped', '');
            navigation.navigate('Home');
          }
        },
      },
    ]);
  };

  if (!todaySchedule || todaySchedule.mealType === 'off') {
    return (
      <View style={styles.container}>
        <Text style={styles.offText}>Today is an off day! No tiffin scheduled.</Text>
        <ActionButton title="Go Back" onPress={() => navigation.goBack()} variant="outline" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today\'s Scheduled Meal</Text>
      <MealCard mealType={currentMeal} size="large" />
      <View style={styles.actions}>
        <ActionButton title="Keep Scheduled" onPress={handleKeep} variant="success" style={styles.btn} />
        {!showChangePicker ? (
          <ActionButton title="Change Meal" onPress={() => setShowChangePicker(true)} variant="warning" style={styles.btn} />
        ) : (
          <View style={styles.changePicker}>
            <Text style={styles.changeLabel}>Change to:</Text>
            <View style={styles.changeOptions}>
              <ActionButton title="Veg" onPress={() => handleChange('veg')} variant={currentMeal === 'veg' ? 'outline' : 'success'} style={styles.changeBtn} />
              <ActionButton title="Non-Veg" onPress={() => handleChange('nonveg')} variant={currentMeal === 'nonveg' ? 'outline' : 'danger'} style={styles.changeBtn} />
            </View>
          </View>
        )}
        <ActionButton title="Skip Today" onPress={handleSkip} variant="outline" style={styles.btn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg, backgroundColor: Colors.background },
  title: { fontSize: 20, fontWeight: '600', color: Colors.text, textAlign: 'center', marginBottom: Spacing.lg },
  actions: { marginTop: Spacing.xl },
  btn: { marginBottom: Spacing.md },
  changePicker: { backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.md },
  changeLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm },
  changeOptions: { flexDirection: 'row', justifyContent: 'space-between' },
  changeBtn: { flex: 1, marginHorizontal: 4 },
  offText: { fontSize: 18, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl, marginTop: Spacing.xxl },
});

export default MealDecisionScreen;