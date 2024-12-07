import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert, Image, View } from "react-native";
import { TextInput, GestureHandlerRootView } from "react-native-gesture-handler";
import { ref, get } from "firebase/database";
import { db } from '../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function LogIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSecureEntry, setIsSecureEntry] = useState(true);

  const toggleSecureEntry = () => {
    setIsSecureEntry(!isSecureEntry);
  };

  async function handleLogin() { 
    const sanitizedEmail = email.replace(/[.#$[\]]/g, '');
    const userRef = ref(db, 'Logged in users/' + sanitizedEmail);
    try {
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        Alert.alert('Account does not exist!', 'The email you entered is not found. Please sign up.');
      } else {
        const userData = snapshot.val();
        if (userData.password === password) {
          Alert.alert('Enjoy Listening!', 'Successfully logged in!');
        
          try {
            await AsyncStorage.setItem('loggedInEmail', email); 
          } catch (error) {
            console.error('Error storing logged-in email:', error);
            Alert.alert('Error', 'Failed to store logged-in email.'); 
          }
          navigation.reset({
            index: 0,
            routes: [{ name: 'Appnavigation' }],
          });
          setEmail('');
          setPassword('');
        } else {
          Alert.alert('Oopss!', 'Incorrect password. Please try again.');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('An error occurred while logging in. Please try again later.');
    } finally {
      setLoading(false); 
    }
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Image source={require('../../assets/logo2.png')} style={styles.logo} />
      <Text style={styles.log}>Log in Account</Text>
      <Text style={styles.cred}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        style={styles.textBoxes}
        autoCapitalize="none" 
      />
      <Text style={styles.cred}>Password</Text>
      <View style={styles.passwordContainer}> 
        <TextInput 
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          style={styles.En}
          secureTextEntry={isSecureEntry}
        />
        <TouchableOpacity 
          style={styles.eyeIconContainer} 
          onPress={toggleSecureEntry}
        >
          <Ionicons 
            name={isSecureEntry ? 'eye-off' : 'eye'} 
            size={20} 
            color="gray" 
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
      ) : (
        <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
          <Text style={styles.button}>Log in</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
      <Text style={styles.all}>&copy; 2024 IT-3B Mobile Programming. All rights reserved.</Text>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007d92',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderColor: 'white',
    borderWidth: 0.2,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'white',
    
  },
  eyeIconContainer: {
    position: 'absolute', 
    right: 10, 
  },
  En:{
    fontSize: 17,
    marginLeft: 7,
  },
  logo: {
    width: 250, 
    height: 250, 
    marginTop: 50,
    marginBottom: 10, 
  },
  log:{
    color: 'white',
    marginBottom: 10,
    fontSize: 15,
  },
  cred:{
    textAlign: 'center',
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold', 
    marginBottom: 10,
  },  
  textBoxes: {
    width: '90%',
    fontSize: 17,
    padding: 10,
    borderColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: '#66A5AD',
    padding: 10,
    borderRadius: 5,
    width: 100,
    
  },
  button: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  signUpText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  all:{
    color: 'white',
    fontSize: 10,
    marginTop: 50
  }
});