// CustomGradeSystemEditor: Modal for creating/editing a custom grade system
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import type { CustomGradeSystem } from '../../models/CustomGradeSystem';

interface CustomGradeSystemEditorProps {
  system: CustomGradeSystem | null;
  onSave: (system: CustomGradeSystem) => void;
  onCancel: () => void;
}

export const CustomGradeSystemEditor: React.FC<CustomGradeSystemEditorProps> = ({ system, onSave, onCancel }) => {
  const [name, setName] = useState<string>(system?.name || '');
  const [grades, setGrades] = useState<{ name: string; color: string }[]>(
    system?.grades || [{ name: '', color: '#2563eb' }]
  );
  const [error, setError] = useState<string | null>(null);
  const [pickerForIndex, setPickerForIndex] = useState<number | null>(null);

  const PALETTE = [
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#d946ef',
    '#ec4899',
    '#f43f5e',
    '#64748b',
    '#94a3b8',
    '#34d399',
    '#60a5fa',
  ];

  const updateGrade = (index: number, patch: Partial<{ name: string; color: string }>) => {
    const copy = grades.slice();
    copy[index] = { ...copy[index], ...patch };
    setGrades(copy);
  };

  const addRow = () => setGrades([...grades, { name: '', color: '#2563eb' }]);
  const removeRow = (i: number) => setGrades(grades.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= grades.length) return;
    const copy = grades.slice();
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
    setGrades(copy);
  };

  const handleSave = () => {
    // Validation
    if (!name.trim()) return setError('Please provide a name.');
    const cleaned = grades.map(g => ({ name: g.name.trim(), color: g.color }));
    if (cleaned.length < 2) return setError('Add at least two grades.');
    if (cleaned.some(g => !g.name)) return setError('All grades must have a label.');
    const labels = cleaned.map(g => g.name.toLowerCase());
    const dup = labels.find((l, idx) => labels.indexOf(l) !== idx);
    if (dup) return setError(`Duplicate grade: ${dup}`);

    const payload: CustomGradeSystem = {
      id: system?.id || '',
      name: name.trim(),
      grades: cleaned,
    };
    onSave(payload);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{system ? 'Edit' : 'Create'} Custom Grade System</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Name</Text>
      <TextInput value={name} onChangeText={setName} placeholder="e.g., Gym Colors" style={styles.input} />

      <Text style={styles.label}>Grades (top = easiest → bottom = hardest)</Text>
      {grades.map((g, i) => (
        <View key={i} style={styles.gradeRow}>
          <TextInput
            value={g.name}
            onChangeText={t => updateGrade(i, { name: t })}
            placeholder={`Grade ${i + 1}`}
            style={styles.gradeInput}
          />
          <TouchableOpacity
            onPress={() => setPickerForIndex(i)}
            style={[styles.colorButton, { backgroundColor: g.color || '#2563eb' }]}
            accessibilityLabel={`Pick color for ${g.name || `grade ${i + 1}`}`}
          />
          <View style={styles.controlsRow}>
            <TouchableOpacity onPress={() => move(i, -1)} style={styles.controlButton}>
              <Text>↑</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => move(i, +1)} style={styles.controlButton}>
              <Text>↓</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeRow(i)} style={styles.controlButton}>
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity onPress={addRow} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add grade</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Color Picker Modal */}
      <Modal
        visible={pickerForIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerForIndex(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pick a color</Text>
            <View style={styles.palette}>
              {PALETTE.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => {
                    if (pickerForIndex !== null) updateGrade(pickerForIndex, { color: c });
                    setPickerForIndex(null);
                  }}
                  style={[styles.paletteColor, { backgroundColor: c }]}
                  accessibilityLabel={`Select color ${c}`}
                />
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setPickerForIndex(null)} style={styles.modalCloseButton}>
                <Text style={styles.cancelText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addButton: {
    marginBottom: 12,
    marginTop: 4,
  },
  addButtonText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  cancelButton: {
    marginRight: 8,
    padding: 12,
  },
  cancelText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  colorButton: {
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    marginRight: 8,
    width: 44,
  },
  container: {
    padding: 16,
  },
  controlButton: {
    padding: 6,
  },
  controlsRow: {
    flexDirection: 'row',
  },
  error: {
    color: '#ef4444',
    marginBottom: 8,
  },
  gradeInput: {
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  gradeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  input: {
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: 300,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    justifyContent: 'center',
  },
  modalTitle: {
    fontWeight: '700',
    marginBottom: 12,
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  paletteColor: {
    borderColor: '#e5e7eb',
    borderRadius: 6,
    borderWidth: 1,
    height: 36,
    margin: 6,
    width: 36,
  },
  removeText: {
    color: '#ef4444',
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 12,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
