import { View, Text, StyleSheet } from 'react-native';
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
    <SafeAreaView style={styles.headerContainer} edges={['top']}>
      <View style={styles.headerInner}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        header: ({ route }) => <VisibleHeader title={route.name} />,
        tabBarStyle: styles.tabBar,
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

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.primary,
  },
  headerInner: {
    padding: 16,
  },
  headerTitle: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
  },
});
