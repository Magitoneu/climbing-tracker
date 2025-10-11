import { StyleSheet } from 'react-native';
import { colors } from '../../../shared/theme';

export const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  addBoulderButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  bouldersTitle: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: colors.error,
    borderRadius: 8,
    marginRight: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    maxHeight: '100%',
    padding: 24,
    width: '100%',
  },
  keyboardAvoidingView: {
    maxHeight: '90%',
    width: '90%',
  },
  label: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 4,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    flex: 1,
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  textInput: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    marginBottom: 12,
    padding: 8,
  },
  title: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
