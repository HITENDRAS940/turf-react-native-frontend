import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { turfAPI } from '../../services/api';
import { Turf } from '../../types';
import { COLORS } from '../../constants/colors';
import LoadingState from '../../components/shared/LoadingState';
import Button from '../../components/shared/Button';
import { formatPhoneForDisplay } from '../../utils/phoneUtils';
import Toast from 'react-native-toast-message';

const TurfDetailScreen = ({ route, navigation }: any) => {
  const { turfId } = route.params;
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTurfDetails();
  }, []);

  const fetchTurfDetails = async () => {
    try {
      const response = await turfAPI.getTurfById(turfId);
      setTurf(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch turf details',
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigation.navigate('BookingSummary', { turf, turfId });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!turf) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: turf.image }} style={styles.image} />
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{turf.name}</Text>
              <View style={styles.rating}>
                <Ionicons name="star" size={20} color="#F59E0B" />
                <Text style={styles.ratingText}>{turf.rating}</Text>
              </View>
            </View>

            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color={COLORS.gray} />
              <Text style={styles.location}>{turf.location}</Text>
            </View>
          </View>

          {turf.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{turf.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>Starting from</Text>
              <Text style={styles.price}>₹{turf.pricePerHour}/hour</Text>
            </View>
          </View>

          {turf.contactNumber && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact</Text>
              <View style={styles.contactCard}>
                <Ionicons name="call" size={20} color={COLORS.primary} />
                <Text style={styles.contactText}>{formatPhoneForDisplay(turf.contactNumber)}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total Price</Text>
          <Text style={styles.footerPrice}>₹{turf.pricePerHour}/hour</Text>
        </View>
        <Button
          title="Book Now"
          onPress={handleBookNow}
          style={styles.bookButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.lightGray,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.navy,
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.navy,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: COLORS.gray,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.navy,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 22,
  },
  priceCard: {
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 12,
  },
  contactText: {
    fontSize: 16,
    color: COLORS.navy,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: '#FFFFFF',
  },
  footerLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.navy,
  },
  bookButton: {
    paddingHorizontal: 32,
  },
});

export default TurfDetailScreen;
