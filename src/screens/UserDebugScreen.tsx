import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';

const UserDebugScreen: React.FC = () => {
  const { user } = useAuth();

  const debugInfo = [
    { label: 'User Object Exists', value: user ? 'Yes' : 'No' },
    { label: 'Phone', value: user?.phone || 'Not set' },
    { label: 'Role', value: user?.role || 'Not set' },
    { label: 'Name', value: user?.name || 'Not set' },
    { label: 'Name Type', value: typeof user?.name },
    { label: 'Name Length', value: user?.name?.length?.toString() || '0' },
    { label: 'Is New User', value: user?.isNewUser?.toString() || 'Not set' },
    { label: 'Has Token', value: user?.token ? 'Yes' : 'No' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>🔍 User Debug Information</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Object Properties:</Text>
          {debugInfo.map((item, index) => (
            <View key={index} style={styles.debugRow}>
              <Text style={styles.label}>{item.label}:</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Raw User Object:</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.code}>
              {JSON.stringify(user, null, 2)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expected Display:</Text>
          <Text style={styles.description}>
            If name exists and is not empty, it should show in ProfileScreen.
            If name is undefined/null/empty, it should show "User Name Not Set".
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.navy,
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.navy,
    marginBottom: 12,
  },
  debugRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.navy,
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: COLORS.gray,
    flex: 1,
    textAlign: 'right',
  },
  codeBlock: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  code: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: COLORS.navy,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
});

export default UserDebugScreen;
