// GradeSystemSelector: UI for selecting a grade system

import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CustomGradeSystem } from '../../models/CustomGradeSystem';

interface GradeSystemSelectorProps {
  systems: CustomGradeSystem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const GradeSystemSelector: React.FC<GradeSystemSelectorProps> = ({ systems, selectedId, onSelect }) => {
  if (!systems.length) {
    return (
      <View style={{ marginVertical: 8 }}>
        <Text style={{ color: '#888' }}>No custom grade systems found.</Text>
      </View>
    );
  }
  return (
    <View style={{ marginVertical: 8 }}>
      <Text style={{ marginBottom: 4 }}>Custom Grade System:</Text>
      <Picker
        selectedValue={selectedId}
        onValueChange={onSelect}
        style={{ backgroundColor: '#f0f0f0', borderRadius: 8 }}
      >
        <Picker.Item label="Select..." value="" />
        {systems.map(system => (
          <Picker.Item key={system.id} label={system.name} value={system.id} />
        ))}
      </Picker>
    </View>
  );
};
