import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AudioList from '../AudioList';
import Profile from '../Profile';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Player from '../Player';

const Tab = createBottomTabNavigator();

const Appnavigation = () => {

  

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#66A5AD' },
        headerStyle: { backgroundColor: '#66A5AD' },
        tabBarLabelStyle: {
          color: 'white',
        },
      }}
    >
      <Tab.Screen
        name="AudioList"
        component={AudioList}
        options={{
          tabBarIcon: ({ size }) => (
            <MaterialIcons name="headset" size={size} color={'white'} />
          ),
          headerTitle: 'MobiFy',
          headerTitleStyle: {
            fontSize: 25,
            color: 'white',
          },
        }}
      />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{
          tabBarIcon: ({ size }) => (
            <FontAwesome5 name="compact-disc" size={24} color="white" />
          ),
          headerTitle: 'MobiFy',
          headerTitleStyle: {
            fontSize: 25,
            color: 'white',
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ size }) => (
            <Ionicons name="person" size={size} color={'white'} />
          ),
          headerTitle: 'MobiFy',
          headerTitleStyle: {
            fontSize: 25,
            color: 'white',
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default Appnavigation;