import React from 'react';
import {TextInput as RNTextInput, Text, StyleSheet} from 'react-native';

export const TextInput = ({error, ...props}) => (
  <>
    <RNTextInput style={styles.input} {...props} />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </>
);

export const FormErrorMessage = ({error}) =>
  error ? <Text style={styles.errorText}>{error}</Text> : null;

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: 'white',
  },
  errorText: {
    color: '#B00020',
    fontSize: 14,
    marginBottom: 10,
  },
});
