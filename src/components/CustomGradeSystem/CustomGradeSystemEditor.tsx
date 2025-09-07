// CustomGradeSystemEditor: Modal for creating/editing a custom grade system
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import type { CustomGradeSystem } from '../../models/CustomGradeSystem';

interface CustomGradeSystemEditorProps {
  system: CustomGradeSystem | null;
  onSave: (system: CustomGradeSystem) => void;
  onCancel: () => void;
}

export const CustomGradeSystemEditor: React.FC<CustomGradeSystemEditorProps> = ({ system, onSave, onCancel }) => {
  // ...UI for editing name, grades, colors...
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>{system ? 'Edit' : 'Create'} Custom Grade System</Text>
      {/* TODO: Add form fields for name, grades, color pickers */}
      <TouchableOpacity style={{ marginTop: 16 }} onPress={onCancel}>
        <Text style={{ color: 'red' }}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginTop: 8, backgroundColor: '#4f46e5', padding: 12, borderRadius: 8 }} onPress={() => {/* TODO: Save logic */}}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};
