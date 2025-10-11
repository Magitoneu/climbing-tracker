// CustomGradeSystemEditor: Modal for creating/editing a custom grade system
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
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
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
        {system ? 'Edit' : 'Create'} Custom Grade System
      </Text>
      {error ? <Text style={{ color: '#ef4444', marginBottom: 8 }}>{error}</Text> : null}

      <Text style={{ fontWeight: '600', marginBottom: 4 }}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g., Gym Colors"
        style={{
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 8,
          marginBottom: 12,
        }}
      />

      <Text style={{ fontWeight: '600', marginBottom: 4 }}>Grades (top = easiest → bottom = hardest)</Text>
      {grades.map((g, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <TextInput
            value={g.name}
            onChangeText={t => updateGrade(i, { name: t })}
            placeholder={`Grade ${i + 1}`}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 8,
              marginRight: 8,
            }}
          />
          <TouchableOpacity
            onPress={() => setPickerForIndex(i)}
            style={{
              width: 44,
              height: 36,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              marginRight: 8,
              backgroundColor: g.color || '#2563eb',
            }}
            accessibilityLabel={`Pick color for ${g.name || `grade ${i + 1}`}`}
          />
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => move(i, -1)} style={{ padding: 6 }}>
              <Text>↑</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => move(i, +1)} style={{ padding: 6 }}>
              <Text>↓</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeRow(i)} style={{ padding: 6 }}>
              <Text style={{ color: '#ef4444' }}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity onPress={addRow} style={{ marginTop: 4, marginBottom: 12 }}>
        <Text style={{ color: '#2563eb', fontWeight: '600' }}>+ Add grade</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity style={{ padding: 12, marginRight: 8 }} onPress={onCancel}>
          <Text style={{ color: '#6b7280', fontWeight: '600' }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#4f46e5', padding: 12, borderRadius: 8 }} onPress={handleSave}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Color Picker Modal */}
      <Modal
        visible={pickerForIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerForIndex(null)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, width: 300 }}>
            <Text style={{ fontWeight: '700', marginBottom: 12 }}>Pick a color</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {PALETTE.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => {
                    if (pickerForIndex !== null) updateGrade(pickerForIndex, { color: c });
                    setPickerForIndex(null);
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    margin: 6,
                    backgroundColor: c,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                  }}
                  accessibilityLabel={`Select color ${c}`}
                />
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
              <TouchableOpacity onPress={() => setPickerForIndex(null)} style={{ padding: 8 }}>
                <Text style={{ color: '#6b7280', fontWeight: '600' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
