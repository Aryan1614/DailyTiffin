import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DaySchedule, DayOfWeek, MealType } from '../types';
import { Colors } from '../theme/colors';
import { BorderRadius, Spacing } from '../theme/spacing';
import { DAY_LABELS, MEAL_LABELS } from '../utils/constants';

interface ScheduleGridProps {
  schedule: DaySchedule[];
  onUpdateDay: (day: DayOfWeek, mealType: MealType | 'off') => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ schedule, onUpdateDay }) => {
  const cycleMeal = (current: MealType | 'off'): MealType | 'off' => {
    switch (current) {
      case 'veg': return 'nonveg';
      case 'nonveg': return 'off';
      case 'off': return 'veg';
    }
  };

  const getMealColor = (mealType: MealType | 'off') => {
    switch (mealType) {
      case 'veg': return Colors.veg;
      case 'nonveg': return Colors.nonveg;
      case 'off': return Colors.skip;
    }
  };

  const getMealBg = (mealType: MealType | 'off') => {
    switch (mealType) {
      case 'veg': return Colors.vegLight;
      case 'nonveg': return Colors.nonvegLight;
      case 'off': return Colors.skipLight;
    }
  };

  return (
    <View style={styles.container}>
      {schedule.map((item) => (
        <TouchableOpacity
          key={item.day}
          style={[styles.dayItem, { backgroundColor: getMealBg(item.mealType) }]}
          onPress={() => onUpdateDay(item.day, cycleMeal(item.mealType))}
          activeOpacity={0.7}>
          <Text style={styles.dayLabel}>{DAY_LABELS[item.day]}</Text>
          <Text style={[styles.mealLabel, { color: getMealColor(item.mealType) }]}>
            {MEAL_LABELS[item.mealType]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dayItem: { width: '30%', padding: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', marginBottom: Spacing.sm },
  dayLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.xs },
  mealLabel: { fontSize: 14, fontWeight: '700' },
});

export default ScheduleGrid;