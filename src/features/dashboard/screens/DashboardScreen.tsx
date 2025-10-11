import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';
import { ClimbingIcon } from '../../../shared/components/icons/ClimbingIcon';
import { climbingEncouragement } from '../../../shared/utils/climbingCopy';

type TabParamList = {
  Dashboard: undefined;
  Log: undefined;
  Sessions: undefined;
  Stats: undefined;
  Settings: undefined;
};

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  // Example stats, replace with real data
  const stats = {
    sessions: 12,
    bestGrade: 'V6',
    streak: 5,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{climbingEncouragement.comeback}</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Sessions</Text>
          <Text style={styles.statValue}>{stats.sessions}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Best Grade</Text>
          <Text style={styles.statValue}>{stats.bestGrade}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>{stats.streak} days</Text>
        </View>
      </View>
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Log')}
        accessibilityLabel="Log new session"
      >
        <ClimbingIcon name="chalkBag" size={32} color={colors.textOnPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'flex-start',
    padding: spacing.lg,
  },
  fab: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 32,
    bottom: 32,
    elevation: 4,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    width: 56,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    elevation: 2,
    minWidth: 90,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h2,
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
});

export default DashboardScreen;
