import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  attemptsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  buttonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginRight: 8,
    padding: 8,
    textAlign: 'center',
    width: 60,
  },
  label: {
    fontSize: 16,
    marginRight: 8,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 5,
    maxWidth: 400,
    padding: 24,
    width: '90%',
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});
