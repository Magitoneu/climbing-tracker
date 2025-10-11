import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

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
      <Text style={styles.title}>Welcome Back!</Text>
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
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    flex: 1,
    justifyContent: 'flex-start',
    padding: 24,
  },
  fab: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 32,
    bottom: 32,
    elevation: 4,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    width: 56,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    minWidth: 90,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statLabel: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: '#2563eb',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  title: {
    color: '#2563eb',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});

export default DashboardScreen;
