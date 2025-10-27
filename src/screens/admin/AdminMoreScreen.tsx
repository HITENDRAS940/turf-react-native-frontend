import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/colors';
import Toast from 'react-native-toast-message';

const AdminMoreScreen = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Toast.show({
                type: 'success',
                text1: 'Logged Out',
                text2: 'You have been logged out successfully',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to logout',
              });
            }
          },
        },
      ]
    );
  };

  const menuSections = [
    {
      title: 'Management',
      items: [
        {
          icon: 'analytics-outline',
          title: 'Analytics & Reports',
          subtitle: 'View detailed business analytics',
          onPress: () => Toast.show({ type: 'info', text1: 'Coming Soon', text2: 'Analytics feature is under development' }),
        },
        {
          icon: 'people-outline',
          title: 'User Management',
          subtitle: 'Manage user accounts',
          onPress: () => Toast.show({ type: 'info', text1: 'Coming Soon', text2: 'User management feature is under development' }),
        },
        {
          icon: 'card-outline',
          title: 'Payment Settings',
          subtitle: 'Configure payment methods',
          onPress: () => Toast.show({ type: 'info', text1: 'Coming Soon', text2: 'Payment settings feature is under development' }),
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          icon: 'notifications-outline',
          title: 'Notification Settings',
          subtitle: 'Manage push notifications',
          onPress: () => Toast.show({ type: 'info', text1: 'Coming Soon', text2: 'Notification settings feature is under development' }),
        },
        {
          icon: 'time-outline',
          title: 'Business Hours',
          subtitle: 'Set operating hours',
          onPress: () => Toast.show({ type: 'info', text1: 'Coming Soon', text2: 'Business hours feature is under development' }),
        },
        {
          icon: 'settings-outline',
          title: 'App Settings',
          subtitle: 'General app preferences',
          onPress: () => Toast.show({ type: 'info', text1: 'Coming Soon', text2: 'App settings feature is under development' }),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          onPress: () => Toast.show({ type: 'info', text1: 'Coming Soon', text2: 'Help & support feature is under development' }),
        },
        {
          icon: 'document-text-outline',
          title: 'Terms & Privacy',
          subtitle: 'Read terms and privacy policy',
          onPress: () => Toast.show({ type: 'info', text1: 'Coming Soon', text2: 'Terms & privacy feature is under development' }),
        },
        {
          icon: 'information-circle-outline',
          title: 'About',
          subtitle: 'App version and information',
          onPress: () => Toast.show({ type: 'info', text1: 'TurfBooking Admin', text2: 'Version 1.0.0' }),
        },
      ],
    },
  ];

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.title}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
    </TouchableOpacity>
  );

  const renderSection = (section: any) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionItems}>
        {section.items.map(renderMenuItem)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
        <Text style={styles.headerSubtitle}>Admin settings and options</Text>
      </View>

      <ScrollView style={styles.content}>
        {menuSections.map(renderSection)}

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.red} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.version}>TurfBooking Admin v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.navy,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  sectionItems: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.navy,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  logoutSection: {
    margin: 20,
    marginTop: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.red,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.red,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  version: {
    fontSize: 12,
    color: COLORS.gray,
  },
});

export default AdminMoreScreen;
