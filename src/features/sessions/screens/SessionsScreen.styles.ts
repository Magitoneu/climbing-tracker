import { StyleSheet } from 'react-native';
import { colors } from '../../../shared/theme';

export const styles = StyleSheet.create({
  accentBar: {
    height: 6,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  boulderCircle: {
    marginRight: 6,
  },
  boulderGradeText: {
    color: colors.text,
    fontSize: 14,
  },
  boulderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 2,
  },
  buttonText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    elevation: 3,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 2,
  },
  dateText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: 8,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  emptyText: {
    color: colors.text,
    fontSize: 16,
    marginTop: 32,
    opacity: 0.5,
    textAlign: 'center',
  },
  expandedContainer: {
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  expandedTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  flashIcon: {
    marginLeft: 6,
  },
  flashText: {
    color: colors.text,
    fontSize: 14,
    opacity: 0.7,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
  },
  iconMarginRight: {
    marginRight: 8,
  },
  iconMarginRight4: {
    marginRight: 4,
  },
  iconWithOpacity: {
    marginRight: 4,
    opacity: 0.7,
  },
  maxGradeText: {
    fontSize: 16,
  },
  noBoulders: {
    color: colors.text,
    opacity: 0.7,
  },
  notesText: {
    color: colors.text,
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
    opacity: 0.7,
  },
  sessionCard: {
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statText: {
    color: colors.text,
    fontSize: 14,
    opacity: 0.7,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingHorizontal: 16,
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
