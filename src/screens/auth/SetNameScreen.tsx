import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Toast from 'react-native-toast-message';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const SetNameScreen = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();

  const handleSetName = async () => {
    if (!name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Name',
        text2: 'Please enter your name',
      });
      return;
    }

    if (name.trim().length < 2) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Name',
        text2: 'Name must be at least 2 characters long',
      });
      return;
    }

    setLoading(true);
    try {
      await userAPI.setName(name.trim());
      
      // Update user context to mark as not new user
      if (user) {
        await updateUser({ 
          ...user, 
          name: name.trim(), 
          isNewUser: false 
        });
      }
      
      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: 'Your profile has been set up successfully',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to set name',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-add" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Welcome to TurfBook!</Text>
          <Text style={styles.subtitle}>
            Let's get you set up. What should we call you?
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            editable={!loading}
            autoCapitalize="words"
            autoComplete="name"
            maxLength={50}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSetName}
            disabled={loading || !name.trim()}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You can always change this later in your profile settings
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
    marginTop: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.navy,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.navy,
    backgroundColor: '#F9FAFB',
    height: 56,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default SetNameScreen;
