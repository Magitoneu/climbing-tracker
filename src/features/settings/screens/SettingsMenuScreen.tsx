import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate(item.key as never)}>
            <Ionicons name={item.icon as any} size={24} color={colors.primary} style={styles.icon} />
            <Text style={styles.label}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 16,
  },
  icon: {
    marginRight: 16,
  },
  label: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
  },
  menuItem: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 18,
  },
});
