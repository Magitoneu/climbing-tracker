import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native';
import { styles } from './BoulderModal.styles';
import GradeSelector from './GradeSelector';
import FlashedToggle from './FlashedToggle';
import { V_GRADES, FONT_GRADES } from '../models/grades';

interface BoulderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (grade: string, attempts: number, flashed: boolean) => void;
  gradeSystem: 'V' | 'Font';
}

const BoulderModal: React.FC<BoulderModalProps> = ({ visible, onClose, onSave, gradeSystem }) => {
  const [grade, setGrade] = useState('');
  const [attempts, setAttempts] = useState('');
  const [flashed, setFlashed] = useState(false);

  const handleSave = () => {
    if (grade && (flashed || parseInt(attempts) > 0)) {
      onSave(grade, flashed ? 1 : parseInt(attempts), flashed);
      setGrade('');
      setAttempts('');
      setFlashed(false);
    }
  };

  const handleFlashedToggle = () => {
    setFlashed((prev) => {
      const newValue = !prev;
      setAttempts(newValue ? '1' : '');
      return newValue;
    });
  };

  const grades = gradeSystem === 'V' ? V_GRADES : FONT_GRADES;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Add Boulder</Text>
            <GradeSelector
              grades={grades}
              selected={grade}
              onSelect={setGrade}
            />
            <View style={styles.attemptsRow}>
              <Text style={styles.label}>Attempts</Text>
              <TextInput
                style={styles.input}
                value={attempts}
                onChangeText={setAttempts}
                keyboardType="numeric"
                editable={!flashed}
                placeholder="0"
              />
              <FlashedToggle value={flashed} onToggle={handleFlashedToggle} />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: '#2563eb', marginLeft: 8 }]}
                onPress={handleSave}
                disabled={!grade || (!flashed && (!attempts || parseInt(attempts) < 1))}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

export default BoulderModal;

