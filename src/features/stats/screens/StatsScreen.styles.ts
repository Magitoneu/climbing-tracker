/**
 * Styles for StatsScreen.
 */

import { StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../../shared/design/theme';
import { typography } from '../../../shared/design/typography';
import { spacing } from '../../../shared/design/spacing';

export const styles = StyleSheet.create({
  bottomSpacer: {
    height: spacing.xl,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  ctaButtonText: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyIcon: {
    color: colors.textSecondary,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  loadingIndicator: {
    color: colors.primary,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  monthLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  rowSection: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  section: {
    marginTop: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
});
