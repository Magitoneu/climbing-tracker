import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../features/dashboard';
import { LogScreen, SessionsScreen } from '../features/sessions';
import { StatsScreen } from '../features/stats';
import { SettingsStack } from '../features/settings';
import { colors } from '../shared/theme';
const Tab = createBottomTabNavigator();

function VisibleHeader({ title }: { title: string }) {
  return (
    <SafeAreaView style={{ backgroundColor: colors.primary }} edges={['top']}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: colors.surface, fontWeight: 'bold', fontSize: 20 }}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        header: ({ route }) => <VisibleHeader title={route.name} />,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Log" component={LogScreen} />
      <Tab.Screen name="Sessions" component={SessionsScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}
