import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  date: string;
  onPressDate: () => void;
  notes?: string;
  children?: React.ReactNode; // slot for stat cards carousel
}

export const SessionHeaderCard: React.FC<Props> = ({ date, onPressDate, children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={onPressDate} style={styles.datePill}>
          <Text style={styles.dateText}>{date}</Text>
        </TouchableOpacity>
      </View>
      {children && <View style={styles.statsContainer}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 3,
    marginBottom: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  datePill: { backgroundColor: '#2563EB15', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  dateText: { color: '#1E3A8A', fontSize: 16, fontWeight: '600' },
  row: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  statsContainer: { marginTop: 12 },
});

export default SessionHeaderCard;
