import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ref, get, update } from 'firebase/database';
import { db, auth } from '../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
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

  const handleChangePassword = async () => {
    if (!userExists) {
      Alert.alert("Error", "User  does not exist. Please log in.");
      return;
    }

    if (email !== loggedInEmail) {
      Alert.alert("Error", "Please enter the email you used to log in.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
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

      
      await update(userRef, { password: newPassword }, auth);

      Alert.alert("Success", "Password updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Update Password</Text>
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
    textAlign: 'center',
    color: 'white'
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

export default ChangePassword;