import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { adminAPI } from '../../services/api';
import { Booking } from '../../types';
import { COLORS } from '../../constants/colors';
import LoadingState from '../../components/shared/LoadingState';
import EmptyState from '../../components/shared/EmptyState';
import { formatPhoneForDisplay } from '../../utils/phoneUtils';
import StatusBadge from '../../components/shared/StatusBadge';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';

const AllBookingsScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filters = [
    { key: 'ALL', label: 'All', count: bookings.length },
    { key: 'CONFIRMED', label: 'Confirmed', count: bookings.filter(b => b.status === 'CONFIRMED').length },
    { key: 'PENDING', label: 'Pending', count: bookings.filter(b => b.status === 'PENDING').length },
    { key: 'CANCELLED', label: 'Cancelled', count: bookings.filter(b => b.status === 'CANCELLED').length },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await adminAPI.getAllBookings();
      setBookings(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch bookings',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const filteredBookings = selectedFilter === 'ALL' 
    ? bookings 
    : bookings.filter(booking => booking.status === selectedFilter);

  const renderFilterTab = (filter: typeof filters[0]) => (
    <TouchableOpacity
      key={filter.key}
      style={[
        styles.filterTab,
        selectedFilter === filter.key && styles.filterTabActive,
      ]}
      onPress={() => setSelectedFilter(filter.key)}
    >
      <Text
        style={[
          styles.filterTabText,
          selectedFilter === filter.key && styles.filterTabTextActive,
        ]}
      >
        {filter.label}
      </Text>
      <View
        style={[
          styles.filterBadge,
          selectedFilter === filter.key && styles.filterBadgeActive,
        ]}
      >
        <Text
          style={[
            styles.filterBadgeText,
            selectedFilter === filter.key && styles.filterBadgeTextActive,
          ]}
        >
          {filter.count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderBookingCard = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.turfName}>{item.turfName}</Text>
          <StatusBadge status={item.status} />
        </View>
        <Text style={styles.bookingId}>#{item.id}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color={COLORS.gray} />
          <Text style={styles.infoText}>
            {item.playerName || (item.phone ? formatPhoneForDisplay(item.phone) : 'N/A')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.gray} />
          <Text style={styles.infoText}>
            {format(new Date(item.date), 'dd MMM yyyy')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color={COLORS.gray} />
          <Text style={styles.infoText}>
            {item.slots.map(s => `${s.startTime}-${s.endTime}`).join(', ')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={16} color={COLORS.gray} />
          <Text style={styles.priceText}>₹{item.totalAmount}</Text>
        </View>

        {item.createdAt && (
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.gray} />
            <Text style={styles.infoSubText}>
              Booked on {format(new Date(item.createdAt), 'dd MMM yyyy')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return <LoadingState />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Bookings</Text>
        <View style={styles.headerStats}>
          <Text style={styles.totalBookings}>
            {filteredBookings.length} bookings
          </Text>
        </View>
      </View>

      <View style={styles.filtersContainer}>
        {filters.map(renderFilterTab)}
      </View>

      {filteredBookings.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="No Bookings Found"
          description={`No ${selectedFilter.toLowerCase()} bookings available`}
        />
      ) : (
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
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
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 4,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalBookings: {
    fontSize: 14,
    color: COLORS.gray,
  },
  filtersContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
  },
  filterBadgeTextActive: {
    color: '#FFFFFF',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
    gap: 8,
  },
  turfName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.navy,
  },
  bookingId: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 12,
  },
  cardContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  infoSubText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default AllBookingsScreen;
