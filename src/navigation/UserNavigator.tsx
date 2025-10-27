import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import TurfListScreen from '../screens/user/TurfListScreen';
import TurfDetailScreen from '../screens/user/TurfDetailScreen';
import BookingSummaryScreen from '../screens/user/BookingSummaryScreen';
import MyBookingsScreen from '../screens/user/MyBookingsScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import UserDebugScreen from '../screens/UserDebugScreen';

import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ProfileMain" 
      component={ProfileScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="UserDebug" 
      component={UserDebugScreen}
      options={{ 
        title: 'Debug Info',
        headerShown: true,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#FFFFFF',
      }}
    />
  </Stack.Navigator>
);

const TurfStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="TurfList" 
      component={TurfListScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="TurfDetail" 
      component={TurfDetailScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="BookingSummary" 
      component={BookingSummaryScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const UserNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Turfs') {
            iconName = focused ? 'football' : 'football-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen name="Turfs" component={TurfStack} />
      <Tab.Screen name="Bookings" component={MyBookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default UserNavigator;
