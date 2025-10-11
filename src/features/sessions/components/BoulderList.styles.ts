import { StyleSheet } from 'react-native';
import { colors } from '../../../shared/theme';

export const styles = StyleSheet.create({
  attemptsInput: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    marginBottom: 8,
    padding: 8,
  },
  attemptsLabel: {
    color: colors.text,
    fontSize: 13,
    marginBottom: 2,
  },
  boulderCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    elevation: 1,
    marginBottom: 12,
    padding: 12,
    shadowColor: colors.primary,
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  boulderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 4,
  },
  boulderNumber: {
    color: colors.text,
    fontSize: 13,
    fontWeight: 'bold',
  },
  changeGradeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  changeGradeText: {
    color: colors.surface,
  },
  emptyText: {
    color: colors.text,
    opacity: 0.7,
  },
  flashIcon: {
    marginLeft: 6,
  },
  gradeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  gradeText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 8,
  },
  picker: {
    color: colors.text,
  },
  pickerContainer: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  removeButton: {
    alignSelf: 'flex-end',
    backgroundColor: colors.error,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  removeButtonText: {
    color: colors.surface,
  },
});
