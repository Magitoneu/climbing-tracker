import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../theme';
export default function SettingsLanguageScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, color: colors.text }}>Language Settings</Text>
    </View>
  );
}
