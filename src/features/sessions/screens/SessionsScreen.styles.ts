import { StyleSheet } from 'react-native';
import { colors, borderRadius, shadows } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';

export const styles = StyleSheet.create({
  accentBar: {
    height: spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  boulderCircle: {
    marginRight: spacing.xs,
  },
  boulderGradeText: {
    ...typography.body,
    color: colors.text,
  },
  boulderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.xxs,
  },
  buttonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    padding: spacing.xs,
  },
  dateText: {
    ...typography.h3,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  expandedContainer: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  expandedTitle: {
    ...typography.bodyBold,
    marginBottom: spacing.xs,
  },
  flashIcon: {
    marginLeft: spacing.xs,
  },
  flashText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: spacing.md,
  },
  iconMarginRight: {
    marginRight: spacing.sm,
  },
  iconMarginRight4: {
    marginRight: spacing.xs,
  },
  iconWithOpacity: {
    marginRight: spacing.xs,
    opacity: 0.7,
  },
  maxGradeText: {
    ...typography.grade,
  },
  noBoulders: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  notesText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  sessionCard: {
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});

export const getDynamicStyles = (accentColor: string) => ({
  accentBar: {
    backgroundColor: accentColor,
  },
  dateText: {
    color: accentColor,
  },
  maxGradeText: {
    color: accentColor,
  },
  expandedTitle: {
    color: accentColor,
  },
});
