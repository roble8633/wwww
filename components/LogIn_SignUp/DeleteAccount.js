import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ref, get, remove } from 'firebase/database';
import { db, auth } from '../firebase/firebaseConfig';
import { signOut, deleteUser } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeleteAccount = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState(''); 

  useEffect(() => {
    const getLoggedInEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('loggedInEmail');
        if (storedEmail) {
          setLoggedInEmail(storedEmail);
        } else {
          console.warn("Logged-in email not found in AsyncStorage.");
        }
      } catch (error) {
        console.error('Error retrieving logged-in email:', error);
        Alert.alert("Error", "Failed to retrieve logged-in email."); 
      }
    };

    getLoggedInEmail();
  }, []);

  useEffect(() => {
    const checkUserExists = async () => {
      if (email) {
        const sanitizedEmail = email.replace(/[.#$[\]]/g, '');
        const userRef = ref(db, 'Logged in users/' + sanitizedEmail);
        try {
          const snapshot = await get(userRef);
          setUserExists(snapshot.exists());
        } catch (error) {
          console.error('Error checking user existence:', error);
          Alert.alert("Error", "Failed to check user existence."); 
        }
      } else {
        setUserExists(false); 
      }
    };

    checkUserExists(); 
  }, [email]);

  const deleteData = async () => {
    if (!userExists) {
      Alert.alert("Error", "User  does not exist. Please log in.");
      return;
    }

    if (email !== loggedInEmail) { 
      Alert.alert("Error", "You cannot delete this account.");
      return;
    } 

    try {
      const sanitizedEmail = email.replace(/[.#$[\]]/g, '');
      const userRef = ref(db, 'Logged in users/' + sanitizedEmail);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      
      if (userData.password !== currentPassword) {
        Alert.alert("Error", "Current password is incorrect.");
        return;
      }

      
      await remove(userRef); 

      
      const currentUser = auth.currentUser; 

     
      if (currentUser) { 
        try {
          await deleteUser(currentUser); 
        } catch (error) {
          console.error("Error deleting user from Firebase Authentication:", error);
          Alert.alert("Error", "Failed to delete user from Firebase Authentication.");
        }
      }

      
      await signOut(auth); 

      
      await AsyncStorage.removeItem('loggedInEmail');

      Alert.alert("Success", "Account deleted successfully.");
      navigation.reset({
        index: 0,
        routes: [{ name: 'LogIn' }],
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during account deletion."); 
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={deleteData}>
        <Text style={styles.buttonText}>Delete Acccount</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#007d92',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center'
  },
  input: {
    height: 50,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white'
  },
  button: {
    backgroundColor: '#66A5AD',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
});

export default DeleteAccount;