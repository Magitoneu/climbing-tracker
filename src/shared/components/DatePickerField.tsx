import React from 'react';
import { Platform, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface Props {
  date: Date;
  onChange: (d: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  label?: string;
}

export const DatePickerField: React.FC<Props> = ({ date, onChange, minimumDate, maximumDate, label }) => {
  const [open, setOpen] = React.useState(false);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <input
          type="date"
          value={date.toISOString().slice(0, 10)}
          min={minimumDate ? minimumDate.toISOString().slice(0, 10) : undefined}
          max={maximumDate ? maximumDate.toISOString().slice(0, 10) : undefined}
          onChange={e => {
            const value = (e.target as HTMLInputElement).value;
            if (value) {
              const parts = value.split('-');
              const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
              onChange(d);
            }
          }}
          style={{
            width: '100%',
            background: '#FFFFFF',
            borderRadius: 12,
            padding: 12,
            border: '1px solid #E2E8F0',
            fontSize: 16,
            fontFamily: 'inherit',
            color: '#0F172A',
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.nativeButton} onPress={() => setOpen(true)}>
        <Text style={styles.nativeButtonText}>{date.toISOString().slice(0, 10)}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={open}
        mode="date"
        date={date}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={d => {
          setOpen(false);
          onChange(d);
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { color: '#0F172A', fontWeight: '600', marginBottom: 4 },
  nativeButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  nativeButtonText: { color: '#0F172A', fontSize: 16, fontWeight: '600' },
  // webInput removed: using inline style because React Native StyleSheet rejects CSS border string
});

export default DatePickerField;
