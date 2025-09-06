import { StyleSheet } from 'react-native';
import { colors } from '../theme';
import type { ViewStyle, TextStyle } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  } as ViewStyle,
  label: {
    fontWeight: '700' as TextStyle['fontWeight'],
    marginTop: 12,
    marginBottom: 4,
    color: colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 10,
    backgroundColor: colors.surface,
    color: colors.text,
    marginBottom: 8,
  } as TextStyle,
  boulderRow: {
    flexDirection: 'row' as ViewStyle['flexDirection'],
    alignItems: 'center' as ViewStyle['alignItems'],
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  boulderText: {
    marginRight: 12,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center' as ViewStyle['justifyContent'],
    alignItems: 'center' as ViewStyle['alignItems'],
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 4,
  },
  button: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center' as ViewStyle['alignItems'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center' as ViewStyle['alignItems'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: '700' as TextStyle['fontWeight'],
    fontSize: 16,
  },
  buttonTextPrimary: {
    color: colors.surface,
    fontWeight: '700' as TextStyle['fontWeight'],
    fontSize: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});

export default styles;
