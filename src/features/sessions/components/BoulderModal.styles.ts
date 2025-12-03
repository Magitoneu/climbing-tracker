import { StyleSheet } from 'react-native';
import { colors, borderRadius, shadows } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';

export const styles = StyleSheet.create({
  attemptsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: spacing.md,
  },
  backdrop: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  buttonText: {
    ...typography.button,
    color: colors.text,
    textAlign: 'center',
  },
  buttonTextWhite: {
    color: colors.textOnPrimary,
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginRight: spacing.sm,
    padding: spacing.sm,
    textAlign: 'center',
    width: 60,
  },
  label: {
    ...typography.body,
    color: colors.text,
    marginRight: spacing.sm,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    maxWidth: 400,
    padding: spacing.lg,
    width: '90%',
    ...shadows.lg,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: colors.overlay,
    flex: 1,
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
});
