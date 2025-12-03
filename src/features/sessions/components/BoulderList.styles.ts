import { StyleSheet } from 'react-native';
import { colors, borderRadius, shadows } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';

export const styles = StyleSheet.create({
  attemptsInput: {
    ...typography.body,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    color: colors.text,
    marginBottom: spacing.sm,
    padding: spacing.sm,
  },
  attemptsLabel: {
    ...typography.caption,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  boulderCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    ...shadows.sm,
  },
  boulderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.xxs,
  },
  boulderNumber: {
    ...typography.captionBold,
    color: colors.text,
  },
  changeGradeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  changeGradeText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  flashIcon: {
    marginLeft: spacing.xs,
  },
  gradeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  gradeText: {
    ...typography.bodyBold,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  picker: {
    color: colors.text,
  },
  pickerContainer: {
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  removeButton: {
    alignSelf: 'flex-end',
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  removeButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
});
