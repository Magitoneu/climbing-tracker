import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../../../shared/theme';

const menuItems = [
  { key: 'profile', label: 'Profile' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'grade', label: 'Grade System' },
  { key: 'language', label: 'Language' },
  // Add more sections as needed
];

// Section stubs
const ProfileSettings = () => <Text style={{ fontSize: 18 }}>Profile Settings</Text>;
const NotificationSettings = () => <Text style={{ fontSize: 18 }}>Notification Settings</Text>;
const GradeSystemSettings = () => <Text style={{ fontSize: 18 }}>Grade System Settings</Text>;
const LanguageSettings = () => <Text style={{ fontSize: 18 }}>Language Settings</Text>;

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
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.background }}>
      {/* Menu */}
      <View style={{ width: '32%', backgroundColor: colors.surface, paddingVertical: 16 }}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.key}
            onPress={() => handleSelect(item.key)}
            style={{
              padding: 16,
              borderRadius: 8,
              marginBottom: 8,
              backgroundColor: selected === item.key ? colors.primary + '22' : 'transparent',
            }}
          >
            <Text style={{ fontWeight: 'bold', color: selected === item.key ? colors.primary : colors.text }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Animated Content */}
      <Animated.View style={{ flex: 1, padding: 24, opacity: fadeAnim }}>
        {selected === 'profile' && <ProfileSettings />}
        {selected === 'notifications' && <NotificationSettings />}
        {selected === 'grade' && <GradeSystemSettings />}
        {selected === 'language' && <LanguageSettings />}
        {/* Add more sections here */}
      </Animated.View>
    </View>
  );
}
