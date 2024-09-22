import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {db} from './src/config/firebase';

import {UserForm, UserList} from './src/components';

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log('Users state updated:', users);
  }, [users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await db.collection('users').get();
      const userList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users: ', error);
      setError('Failed to fetch users. Please try again.');
    }
    setLoading(false);
  };

  const handleAddUser = async values => {
    setLoading(true);
    setError(''); // Clear any previous errors
    try {
      // Trim the name and check if it's empty
      const trimmedName = values.name.trim();
      if (trimmedName.length === 0) {
        throw new Error('Name cannot be empty');
      }

      // Check if user with this email already exists
      const userSnapshot = await db
        .collection('users')
        .where('email', '==', values.email)
        .get();
      if (!userSnapshot.empty) {
        throw new Error('A user with this email already exists');
      }

      // Update the values object with the trimmed name
      const updatedValues = {...values, name: trimmedName};

      const docRef = await db.collection('users').add(updatedValues);
      setUsers([...users, {id: docRef.id, ...updatedValues}]);
      alert('User added successfully!');
    } catch (error) {
      console.error('Error adding user: ', error);
      setError(error.message || 'Failed to add user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id, values) => {
    setLoading(true);
    setError(''); // Clear any previous errors
    try {
      // Trim the name and check if it's empty
      const trimmedName = values.name.trim();
      if (trimmedName.length === 0) {
        throw new Error('Name cannot be empty');
      }

      // Check if updated email conflicts with existing user
      const userSnapshot = await db
        .collection('users')
        .where('email', '==', values.email)
        .where('id', '!=', id)
        .get();
      if (!userSnapshot.empty) {
        throw new Error('Another user with this email already exists');
      }

      // Update the values object with the trimmed name
      const updatedValues = {...values, name: trimmedName};

      await db.collection('users').doc(id).update(updatedValues);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === id ? {...user, ...updatedValues} : user,
        ),
      );
      setEditingUser(null);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user: ', error);
      setError(error.message || 'Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async id => {
    setLoading(true);
    try {
      await db.collection('users').doc(id).delete();
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user: ', error);
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await db.collection('users').get();
      const batch = db.batch();
      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      setUsers([]);
      alert('All data cleared successfully!');
    } catch (error) {
      console.error('Error clearing data: ', error);
      setError('Failed to clear data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewUser = () => {
    setEditingUser(null);
  };

  const handleEditUser = user => {
    setEditingUser(user);
  };

  const renderItem = ({item}) => (
    <UserList
      users={[item]}
      onEdit={handleEditUser}
      onDelete={handleDeleteUser}
    />
  );

  return (
    <View style={styles.container}>
      <KeyboardAwareFlatList
        ListHeaderComponent={
          <>
            <Text style={styles.title}>User Management</Text>
            {error !== '' && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity style={styles.clearButton} onPress={clearAllData}>
              <Text style={styles.clearButtonText}>Clear All Data</Text>
            </TouchableOpacity>
            <UserForm
              onSubmit={(values, {resetForm}) => {
                if (editingUser) {
                  handleUpdateUser(editingUser.id, values);
                } else {
                  handleAddUser(values);
                }
                resetForm();
              }}
              initialValues={editingUser}
              onNewUser={handleNewUser}
              onChange={() => setError('')} // Add this line
            />
          </>
        }
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#6200ee" />
          ) : (
            <Text>No users found</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200ee',
  },
  error: {
    color: '#B00020',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FFCDD2',
    borderRadius: 5,
  },
  clearButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  clearButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
