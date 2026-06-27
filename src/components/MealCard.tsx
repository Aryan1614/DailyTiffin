import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MealType } from '../types';
import { Colors } from '../theme/colors';
import { BorderRadius, Spacing } from '../theme/spacing';

interface MealCardProps {
  mealType: MealType | 'off';
  size?: 'small' | 'large';
}

const MealCard: React.FC<MealCardProps> = ({ mealType, size = 'large' }) => {
  const getConfig = () => {
    switch (mealType) {
      case 'veg':
        return { label: 'Veg', emoji: '🥗', bgColor: Colors.vegLight, textColor: Colors.veg };
      case 'nonveg':
        return { label: 'Non-Veg', emoji: '🍗', bgColor: Colors.nonvegLight, textColor: Colors.nonveg };
      case 'off':
        return { label: 'Off Day', emoji: '😴', bgColor: Colors.skipLight, textColor: Colors.skip };
    }
  };

  const config = getConfig();
  const isLarge = size === 'large';

  return (
    <View style={[styles.container, { backgroundColor: config.bgColor }, isLarge ? styles.large : styles.small]}>
      <Text style={[styles.emoji, isLarge && styles.emojiLarge]}>{config.emoji}</Text>
      <Text style={[styles.label, { color: config.textColor }, isLarge && styles.labelLarge]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.lg },
  large: { padding: Spacing.xl, minHeight: 160 },
  small: { padding: Spacing.md, minHeight: 80 },
  emoji: { fontSize: 32, marginBottom: Spacing.sm },
  emojiLarge: { fontSize: 56 },
  label: { fontSize: 16, fontWeight: '600' },
  labelLarge: { fontSize: 22 },
});

export default MealCard;