import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimeSlot } from '../../types';
import { COLORS } from '../../constants/colors';

interface TimeSlotCardProps {
  slot: TimeSlot;
  isSelected: boolean;
  onPress: () => void;
}

const TimeSlotCard: React.FC<TimeSlotCardProps> = ({ 
  slot, 
  isSelected, 
  onPress 
}) => {
  const getCardStyle = () => {
    if (!slot.isAvailable) {
      return [styles.card, styles.cardDisabled];
    }
    if (isSelected) {
      return [styles.card, styles.cardSelected];
    }
    return styles.card;
  };

  const getTextColor = () => {
    if (!slot.isAvailable) return COLORS.gray;
    if (isSelected) return COLORS.primary;
    return COLORS.navy;
  };

  return (
    <TouchableOpacity
      style={getCardStyle()}
      onPress={onPress}
      disabled={!slot.isAvailable}
    >
      <View style={styles.timeContainer}>
        <Ionicons
          name={isSelected ? 'checkmark-circle' : 'time-outline'}
          size={20}
          color={getTextColor()}
        />
        <Text style={[styles.timeText, { color: getTextColor() }]}>
          {slot.startTime} - {slot.endTime}
        </Text>
      </View>
      
      <Text style={[styles.priceText, { color: getTextColor() }]}>
        ₹{slot.price}
      </Text>

      {!slot.isAvailable && (
        <View style={styles.bookedBadge}>
          <Text style={styles.bookedText}>Booked</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0FDF4',
  },
  cardDisabled: {
    opacity: 0.5,
    backgroundColor: '#F9FAFB',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
  },
  bookedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.red,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bookedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TimeSlotCard;
