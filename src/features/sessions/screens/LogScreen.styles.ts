import { StyleSheet } from 'react-native';
import { colors } from '../../../shared/theme';
import type { ViewStyle, TextStyle } from 'react-native';

const styles = StyleSheet.create({
  boulderRow: {
    alignItems: 'center' as ViewStyle['alignItems'],
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row' as ViewStyle['flexDirection'],
    marginBottom: 6,
    padding: 8,
  },
  boulderText: {
    color: colors.primary,
    fontWeight: '700' as TextStyle['fontWeight'],
    marginRight: 12,
  },
  button: {
    alignItems: 'center' as ViewStyle['alignItems'],
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderRadius: 24,
    borderWidth: 1,
    elevation: 2,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonPrimary: {
    alignItems: 'center' as ViewStyle['alignItems'],
    backgroundColor: colors.primary,
    borderRadius: 24,
    elevation: 2,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  buttonTextPrimary: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700' as TextStyle['fontWeight'],
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  } as ViewStyle,
  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 10,
    backgroundColor: colors.surface,
    color: colors.text,
    marginBottom: 8,
  } as TextStyle,
  label: {
    color: colors.primary,
    fontWeight: '700' as TextStyle['fontWeight'],
    marginBottom: 4,
    marginTop: 12,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    elevation: 4,
    maxWidth: 400,
    padding: 20,
    width: '90%',
  },
  modalOverlay: {
    alignItems: 'center' as ViewStyle['alignItems'],
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    justifyContent: 'center' as ViewStyle['justifyContent'],
  },
});

export default styles;
