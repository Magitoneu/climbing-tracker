import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme';

const menuItems = [
  { key: 'Profile', label: 'Profile', icon: 'person-circle-outline' },
  { key: 'Notifications', label: 'Notifications', icon: 'notifications-outline' },
  { key: 'GradeSystem', label: 'Grade System', icon: 'bar-chart-outline' },
  { key: 'Language', label: 'Language', icon: 'language-outline' },
  // Add more sections as needed
];

export default function SettingsMenuScreen() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <FlatList
        data={menuItems}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 18,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
            onPress={() => navigation.navigate(item.key as never)}
          >
            <Ionicons name={item.icon as any} size={24} color={colors.primary} style={{ marginRight: 16 }} />
            <Text style={{ flex: 1, fontSize: 16, color: colors.text }}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
