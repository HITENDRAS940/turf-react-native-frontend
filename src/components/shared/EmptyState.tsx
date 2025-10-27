import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={COLORS.gray} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.navy,
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default EmptyState;
