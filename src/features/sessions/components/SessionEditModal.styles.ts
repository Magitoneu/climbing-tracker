import { StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';

export const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
  },
  addBoulderButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  bouldersTitle: {
    ...typography.bodyBold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  buttonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  cancelButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    maxHeight: '100%',
    padding: spacing.lg,
    width: '100%',
  },
  keyboardAvoidingView: {
    maxHeight: '90%',
    width: '90%',
  },
  label: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: colors.overlay,
    flex: 1,
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  textInput: {
    ...typography.body,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    color: colors.text,
    marginBottom: spacing.sm,
    padding: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.md,
  },
});
