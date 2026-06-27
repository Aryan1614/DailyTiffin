import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors } from '../theme/colors';
import { useSettingsStore } from '../store/useSettingsStore';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const isSetupComplete = useSettingsStore((state) => state.isSetupComplete);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isSetupComplete) {
        navigation.replace('Home');
      } else {
        navigation.replace('Settings');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [isSetupComplete, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🍱</Text>
      <Text style={styles.title}>Daily Tiffin</Text>
      <Text style={styles.subtitle}>Your meal, simplified</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary },
  emoji: { fontSize: 72, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: '700', color: Colors.white, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.white, opacity: 0.8 },
});

export default SplashScreen;