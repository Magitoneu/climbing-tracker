import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsMenuScreen from './SettingsMenuScreen';
import SettingsProfileScreen from './SettingsProfileScreen';
import SettingsNotificationsScreen from './SettingsNotificationsScreen';
import SettingsGradeSystemScreen from './SettingsGradeSystemScreen';
import SettingsLanguageScreen from './SettingsLanguageScreen';

const Stack = createStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator initialRouteName="SettingsMenu" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="SettingsMenu" component={SettingsMenuScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={SettingsProfileScreen} options={{ title: 'Profile', headerBackTitle: 'Settings' }} />
      <Stack.Screen name="Notifications" component={SettingsNotificationsScreen} options={{ title: 'Notifications', headerBackTitle: 'Settings' }} />
      <Stack.Screen name="GradeSystem" component={SettingsGradeSystemScreen} options={{ title: 'Grade System', headerBackTitle: 'Settings' }} />
      <Stack.Screen name="Language" component={SettingsLanguageScreen} options={{ title: 'Language', headerBackTitle: 'Settings' }} />
    </Stack.Navigator>
  );
}
