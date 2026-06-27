import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';
import { BorderRadius, Spacing } from '../theme/spacing';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'outline' | 'whatsapp';
  disabled?: boolean;
  style?: ViewStyle;
}

const ActionButton: React.FC<ActionButtonProps> = ({ title, onPress, variant = 'primary', disabled = false, style }) => {
  const getColors = () => {
    switch (variant) {
      case 'primary': return { bg: Colors.primary, text: Colors.white };
      case 'success': return { bg: Colors.success, text: Colors.white };
      case 'warning': return { bg: Colors.warning, text: Colors.white };
      case 'danger': return { bg: Colors.error, text: Colors.white };
      case 'whatsapp': return { bg: Colors.whatsapp, text: Colors.white };
      case 'outline': return { bg: 'transparent', text: Colors.primary };
    }
  };

  const colors = getColors();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.bg }, variant === 'outline' && styles.outline, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}>
      <Text style={[styles.text, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', minHeight: 52 },
  outline: { borderWidth: 2, borderColor: Colors.primary },
  disabled: { opacity: 0.5 },
  text: { fontSize: 16, fontWeight: '600' },
});

export default ActionButton;