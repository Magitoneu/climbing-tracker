import React from 'react';
import { Platform, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { colors, borderRadius, shadows } from '../design/theme';
import { typography } from '../design/typography';
import { spacing } from '../design/spacing';

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
          style={webInputStyle}
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

const webInputStyle = {
  width: '100%',
  background: colors.surface,
  borderRadius: borderRadius.lg,
  padding: spacing.md,
  border: `1px solid ${colors.border}`,
  fontSize: 16,
  fontFamily: 'inherit',
  color: colors.text,
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  nativeButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  nativeButtonText: {
    ...typography.body,
    color: colors.text,
  },
});

export default DatePickerField;
