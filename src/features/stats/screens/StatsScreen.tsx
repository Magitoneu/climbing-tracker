import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Charts and progress (coming soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
