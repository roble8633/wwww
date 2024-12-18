import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from "react-native";
import { TextInput, GestureHandlerRootView } from "react-native-gesture-handler";
import { ref, set, get } from "firebase/database";
import { db, auth } from '../firebase/firebaseConfig'; 
import { createUserWithEmailAndPassword } from "firebase/auth"; 
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSecureEntry, setIsSecureEntry] = useState(true);

  const toggleSecureEntry = () => {
    setIsSecureEntry(!isSecureEntry);
  };

  async function handleSignUp() {
    const sanitizedEmail = email.replace(/[.#$[\]]/g, '');
    const userRef = ref(db, 'Logged in users/' + sanitizedEmail);

    
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      Alert.alert('Error', 'This email is already registered.');
      return;
    }

    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      await set(userRef, {
        email: user.email, 
        password: password, 
      });

      Alert.alert('Success!', 'Successfully signed up!');
      navigation.navigate('LogIn'); 
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Image source={require('../../assets/logo2.png')} style={styles.logo} />
      <Text style={styles.sig}>Sign up here!</Text>

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
      <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUp}>
        <Text style={styles.button}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
        <Text style={styles.signUpText}>Already have an account?</Text>
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
  cred:{
    textAlign: 'center',
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold', 
    marginBottom: 10,
  }, 
  logo: {
    width: 250, 
    height: 250, 
    marginTop: 50,
    marginBottom: 10, 
  },
  sig:{
    color: 'white',
    marginBottom: 20, 
    fontSize: 15, 
  },
  textBoxes: {
    width: '90%',
    fontSize: 17,
    padding: 12,
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderRadius: 5,
    marginBottom: 10,
    
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
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  signUpText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
  },
  all:{
    color: 'white',
    fontSize: 10,
    marginTop: 50
  }
});