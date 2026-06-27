import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius } from '../theme/spacing';
import { useSettingsStore } from '../store/useSettingsStore';
import ActionButton from '../components/ActionButton';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Location'>;
  route: RouteProp<RootStackParamList, 'Location'>;
};

const LOCATIONS = [
  { id: 'PG', label: 'PG / Home', icon: '🏠' },
  { id: 'Office', label: 'Office', icon: '🏢' },
  { id: 'Custom', label: 'Custom', icon: '📍' },
];

const LocationSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mealType, status } = route.params;
  const defaultLocation = useSettingsStore((state) => state.defaultLocation);
  const [selected, setSelected] = useState<string>(defaultLocation);
  const [customText, setCustomText] = useState('');

  const handleConfirm = () => {
    const location = selected === 'Custom' ? customText : selected;
    if (selected === 'Custom' && !customText.trim()) return;
    navigation.navigate('Confirmation', { mealType, location, status });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where should we deliver?</Text>
      <View style={styles.options}>
        {LOCATIONS.map((loc) => (
          <TouchableOpacity
            key={loc.id}
            style={[styles.option, selected === loc.id && styles.optionSelected]}
            onPress={() => setSelected(loc.id)}
            activeOpacity={0.7}>
            <Text style={styles.optionIcon}>{loc.icon}</Text>
            <Text style={[styles.optionLabel, selected === loc.id && styles.optionLabelSelected]}>{loc.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selected === 'Custom' && (
        <TextInput style={styles.input} placeholder="Enter delivery location..." placeholderTextColor={Colors.textLight} value={customText} onChangeText={setCustomText} autoFocus />
      )}
      <ActionButton title="Continue" onPress={handleConfirm} variant="primary" disabled={selected === 'Custom' && !customText.trim()} style={styles.confirmBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg, backgroundColor: Colors.background },
  title: { fontSize: 20, fontWeight: '600', color: Colors.text, textAlign: 'center', marginBottom: Spacing.xl },
  options: { marginBottom: Spacing.md },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: BorderRadius.md, borderWidth: 2, borderColor: Colors.border, marginBottom: Spacing.md },
  optionSelected: { borderColor: Colors.primary, backgroundColor: '#FFF3E8' },
  optionIcon: { fontSize: 28, marginRight: Spacing.md },
  optionLabel: { fontSize: 16, fontWeight: '500', color: Colors.text },
  optionLabelSelected: { color: Colors.primary, fontWeight: '600' },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: 16, color: Colors.text, marginBottom: Spacing.md },
  confirmBtn: { marginTop: Spacing.lg },
});

export default LocationSelectionScreen;