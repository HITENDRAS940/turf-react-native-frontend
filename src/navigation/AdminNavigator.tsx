import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import DashboardScreen from '../screens/admin/DashboardScreen';
import TurfManagementScreen from '../screens/admin/TurfManagementScreen';
import AllBookingsScreen from '../screens/admin/AllBookingsScreen';
import AdminMoreScreen from '../screens/admin/AdminMoreScreen';

const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Turfs') {
            iconName = focused ? 'football' : 'football-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'More') {
            iconName = focused ? 'menu' : 'menu-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        headerShown: true,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Turfs" component={TurfManagementScreen} />
      <Tab.Screen name="Bookings" component={AllBookingsScreen} />
      <Tab.Screen name="More" component={AdminMoreScreen} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
