import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

interface StatusBadgeProps {
  status: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'CONFIRMED':
        return { backgroundColor: '#D1FAE5', color: COLORS.primary };
      case 'CANCELLED':
        return { backgroundColor: '#FEE2E2', color: COLORS.red };
      case 'PENDING':
        return { backgroundColor: '#FEF3C7', color: COLORS.orange };
      default:
        return { backgroundColor: COLORS.lightGray, color: COLORS.gray };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <View style={[styles.badge, { backgroundColor: statusStyle.backgroundColor }]}>
      <Text style={[styles.text, { color: statusStyle.color }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StatusBadge;
