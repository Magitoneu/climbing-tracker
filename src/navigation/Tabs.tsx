import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../features/dashboard';
import { LogScreen, SessionsScreen } from '../features/sessions';
import { StatsScreen } from '../features/stats';
import { SettingsStack } from '../features/settings';
import { colors } from '../shared/design/theme';
import { typography } from '../shared/design/typography';
import { ClimbingIcon } from '../shared/components/icons/ClimbingIcon';
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
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ClimbingIcon name="mountain" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Log"
        component={LogScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ClimbingIcon name="chalkBag" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Sessions"
        component={SessionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ClimbingIcon name="logbook" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ClimbingIcon name="hold" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarIcon: ({ color, size }) => <ClimbingIcon name="carabiner" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.primary, // Sandstone sunset orange
  },
  headerInner: {
    padding: 16,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textInverse,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    ...typography.caption,
    fontSize: 11,
    marginTop: 2,
  },
});
