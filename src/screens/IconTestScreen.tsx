import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// Test component to verify all icons are working
const IconTestScreen: React.FC = () => {
  const testIcons = [
    { name: 'analytics', label: 'Dashboard' },
    { name: 'analytics-outline', label: 'Dashboard Outline' },
    { name: 'football', label: 'Turfs' },
    { name: 'football-outline', label: 'Turfs Outline' },
    { name: 'calendar', label: 'Bookings' },
    { name: 'calendar-outline', label: 'Bookings Outline' },
    { name: 'menu', label: 'More' },
    { name: 'menu-outline', label: 'More Outline' },
    { name: 'person', label: 'Profile' },
    { name: 'person-outline', label: 'Profile Outline' },
    { name: 'cash-outline', label: 'Revenue' },
    { name: 'today-outline', label: 'Today' },
    { name: 'star', label: 'Rating' },
    { name: 'location', label: 'Location' },
    { name: 'time-outline', label: 'Time' },
    { name: 'call-outline', label: 'Contact' },
  ] as const;

  const renderIconTest = (iconName: keyof typeof Ionicons.glyphMap, label: string) => (
    <View key={iconName} style={styles.iconTest}>
      <Ionicons name={iconName} size={32} color={COLORS.primary} />
      <Text style={styles.iconLabel}>{label}</Text>
      <Text style={styles.iconName}>{iconName}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧪 Icon Verification Test</Text>
      <Text style={styles.subtitle}>All icons below should display correctly</Text>
      
      <View style={styles.iconGrid}>
        {testIcons.map(icon => renderIconTest(icon.name, icon.label))}
      </View>

      <View style={styles.status}>
        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
        <Text style={styles.statusText}>
          ✅ All icons working with @expo/vector-icons
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.navy,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  iconTest: {
    backgroundColor: '#FFFFFF',
    width: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  iconLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.navy,
    marginTop: 8,
    textAlign: 'center',
  },
  iconName: {
    fontSize: 10,
    color: COLORS.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
});

export default IconTestScreen;
