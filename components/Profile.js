import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState(''); 

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('loggedInEmail');
        if (storedEmail) {
          setUserEmail(storedEmail);
        } else {
          console.warn("Logged-in email not found in AsyncStorage.");
        }
      } catch (error) {
        console.error('Error retrieving logged-in email:', error);
        Alert.alert("Error", "Failed to retrieve logged-in email."); 
      }
    };

    getUserEmail();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout Cancelled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
           
            navigation.reset({
              index: 0,
              routes: [{ name: 'LogIn' }],
            });
          }
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prof}>Profile</Text>
      <Ionicons name="person-circle-sharp" size={150} color="white" />
      <Text style={styles.hel}>Hello!</Text>
      <Text style={styles.hel1}>dear user,</Text>
      <Text style={styles.userEmail}>{userEmail}</Text> 
      <TouchableOpacity style={styles.gg} onPress={() => navigation.navigate('ChangePassword')}>
        <Text style={styles.ggtext}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.Del} onPress={() => navigation.navigate('DeleteAccount')}>
        <Text style={styles.DelText}>Delete Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007d92',
  },
  hel:{
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  hel1:{
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
  },
  userEmail:{
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  gg: {
    marginTop: '35%',
    marginBottom: -10,
    backgroundColor: '#66A5AD',
    padding: 10,
    borderRadius: 5,
    width: '80%',
  },
  ggtext: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  Del: {
    marginTop: 20,
    marginBottom: -80,
    backgroundColor: '#66A5AD',
    padding: 10,
    borderRadius: 5,
    width: '80%',
  
    
  },
  DelText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  logoutButton: {
    marginTop: 90,
    backgroundColor: '#FF4D4D',
    padding: 10,
    width: '80%',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  prof: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
  },
});

export default Profile;