import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

export const UserList = ({users, onEdit, onDelete}) => {
  const renderItem = ({item}) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.age}>Age: {item.age}</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => onEdit(item)}
          style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  email: {
    color: '#666',
  },
  age: {
    color: '#666',
  },
  buttons: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: '#03DAC6',
    borderRadius: 5,
  },
  editButtonText: {
    color: 'black',
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: '#CF6679',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
});
