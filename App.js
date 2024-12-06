import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogIn from './components/LogIn_SignUp/LogIn'; 
import SignUp from './components/LogIn_SignUp/SignUp';
import Appnavigation from './components/navigation/Appnavigation';
import ChangePassword from './components/LogIn_SignUp/ChangePassword'; // Import the ChangePassword component
import DeleteAccount from './components/LogIn_SignUp/DeleteAccount';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogIn">
        <Stack.Screen 
          name="LogIn" 
          component={LogIn} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUp} 
          options={{ title: 'MobiFy', headerShown: false }} 
        />
        <Stack.Screen 
          name="Appnavigation" 
          component={Appnavigation} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ChangePassword" 
          component={ChangePassword} 
          options={{ title: 'Change Password' }} 
        />
        <Stack.Screen 
          name="DeleteAccount" 
          component={DeleteAccount} 
          options={{ title: 'Deletion of an Account' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}