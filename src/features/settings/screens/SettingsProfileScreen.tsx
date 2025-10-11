import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../../shared/theme';
export default function SettingsProfileScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, color: colors.text }}>Profile Settings</Text>
    </View>
  );
}
