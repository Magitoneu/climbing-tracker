import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { styles } from './BoulderModal.styles';
import GradeSelector from '../../grades/components/GradeSelector';
import FlashedToggle from '../../../shared/components/FlashedToggle';
import { getGradeSystem } from '../../grades/services/gradeSystemService';

interface BoulderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (grade: string, attempts: number, flashed: boolean) => void;
  gradeSystem: string; // builtin or custom id
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
    setFlashed(prev => {
      const newValue = !prev;
      setAttempts(newValue ? '1' : '');
      return newValue;
    });
  };

  const sys = getGradeSystem(gradeSystem === 'V' ? 'vscale' : gradeSystem === 'Font' ? 'font' : gradeSystem);
  const grades = sys ? sys.grades.map(g => g.label) : [];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Backdrop catcher: only captures taps outside the modal container */}
        <Pressable onPress={Keyboard.dismiss} style={styles.backdrop} />
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add Boulder</Text>
          <GradeSelector grades={grades} selected={grade} onSelect={setGrade} systemId={sys?.id} />
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
              style={[styles.cancelButton, styles.saveButton]}
              onPress={handleSave}
              disabled={!grade || (!flashed && (!attempts || parseInt(attempts) < 1))}
            >
              <Text style={[styles.buttonText, styles.buttonTextWhite]}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BoulderModal;
