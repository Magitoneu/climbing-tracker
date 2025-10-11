import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { colors } from '../../../shared/theme';

const menuItems = [
  { key: 'profile', label: 'Profile' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'grade', label: 'Grade System' },
  { key: 'language', label: 'Language' },
  // Add more sections as needed
];

// Section stubs
const ProfileSettings = () => <Text style={styles.sectionTitle}>Profile Settings</Text>;
const NotificationSettings = () => <Text style={styles.sectionTitle}>Notification Settings</Text>;
const GradeSystemSettings = () => <Text style={styles.sectionTitle}>Grade System Settings</Text>;
const LanguageSettings = () => <Text style={styles.sectionTitle}>Language Settings</Text>;

export default function SettingsScreen() {
  const [selected, setSelected] = useState('profile');
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleSelect = (key: string) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSelected(key);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      {/* Menu */}
      <View style={styles.menu}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.key}
            onPress={() => handleSelect(item.key)}
            style={[styles.menuItem, selected === item.key && styles.menuItemSelected]}
          >
            <Text style={[styles.menuItemText, selected === item.key && styles.menuItemTextSelected]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Animated Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {selected === 'profile' && <ProfileSettings />}
        {selected === 'notifications' && <NotificationSettings />}
        {selected === 'grade' && <GradeSystemSettings />}
        {selected === 'language' && <LanguageSettings />}
        {/* Add more sections here */}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  menu: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    width: '32%',
  },
  menuItem: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    marginBottom: 8,
    padding: 16,
  },
  menuItemSelected: {
    backgroundColor: colors.primary + '22',
  },
  menuItemText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  menuItemTextSelected: {
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
  },
});
