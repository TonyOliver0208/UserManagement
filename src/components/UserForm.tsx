import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {TextInput} from './FormComponents';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required')
    .max(100, 'Email must not exceed 100 characters'),
  age: Yup.number()
    .positive('Age must be a positive number')
    .integer('Age must be an integer')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must not exceed 120')
    .required('Age is required'),
});

export const UserForm = ({onSubmit, initialValues, onNewUser, onChange}) => {
  return (
    <Formik
      initialValues={initialValues || {name: '', email: '', age: ''}}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <View style={styles.form}>
          <TextInput
            placeholder="Enter name"
            value={values.name}
            onChangeText={text => {
              handleChange('name')(text);
              onChange(); // Call onChange when the user types
            }}
            onBlur={handleBlur('name')}
            error={touched.name && errors.name}
          />

          <TextInput
            placeholder="Enter email"
            value={values.email}
            onChangeText={text => {
              handleChange('email')(text);
              onChange(); // Call onChange when the user types
            }}
            onBlur={handleBlur('email')}
            keyboardType="email-address"
            error={touched.email && errors.email}
          />

          <TextInput
            placeholder="Enter age"
            value={values.age ? values.age.toString() : ''}
            onChangeText={text => {
              handleChange('age')(text);
              onChange(); // Call onChange when the user types
            }}
            onBlur={handleBlur('age')}
            keyboardType="numeric"
            error={touched.age && errors.age}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {initialValues ? 'Update User' : 'Add User'}
            </Text>
          </TouchableOpacity>

          {initialValues && (
            <TouchableOpacity style={styles.newUserButton} onPress={onNewUser}>
              <Text style={styles.newUserButtonText}>New User</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  form: {
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  newUserButton: {
    backgroundColor: '#03DAC6',
    padding: 15,
    borderRadius: 5,
  },
  newUserButtonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
