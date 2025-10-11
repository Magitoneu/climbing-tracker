import React from 'react';
import { Platform, View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export const NumberInput: React.FC<Props> = ({ value, onChange, min = 0, max = 999, disabled }) => {
  if (Platform.OS === 'web') {
    return (
      <input
        type="number"
        value={Number.isFinite(value) ? value : ''}
        min={min}
        max={max}
        onChange={e => {
          const v = (e.target as HTMLInputElement).value;
          const n = v === '' ? NaN : Number(v);
          if (isNaN(n)) return onChange(NaN);
          if (n < min) return onChange(min);
          if (n > max) return onChange(max);
          onChange(n);
        }}
        style={{ width: 72, padding: 8, border: '1px solid #ccc', borderRadius: 8, textAlign: 'center' }}
        disabled={disabled}
      />
    );
  }
  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => !disabled && onChange(Math.max(min, (value || 0) - 1))}
        disabled={disabled}
        style={[styles.btn, disabled && styles.btnDisabled]}
      >
        <Text style={styles.btnText}>-</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={Number.isFinite(value) ? String(value) : ''}
        onChangeText={t => {
          const n = t === '' ? NaN : Number(t);
          if (isNaN(n)) return onChange(NaN);
          if (n < min) return onChange(min);
          if (n > max) return onChange(max);
          onChange(n);
        }}
        editable={!disabled}
      />
      <TouchableOpacity
        onPress={() => !disabled && onChange(Math.min(max, (value || 0) + 1))}
        disabled={disabled}
        style={[styles.btn, disabled && styles.btnDisabled]}
      >
        <Text style={styles.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: { backgroundColor: '#eee', borderRadius: 8, marginHorizontal: 4, paddingHorizontal: 10, paddingVertical: 8 },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontSize: 16, fontWeight: '700' },
  input: { borderColor: '#ccc', borderRadius: 8, borderWidth: 1, padding: 8, textAlign: 'center', width: 60 },
  row: { alignItems: 'center', flexDirection: 'row' },
});

export default NumberInput;
