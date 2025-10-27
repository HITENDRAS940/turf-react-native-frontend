import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { turfAPI } from '../../services/api';
import { Turf } from '../../types';
import { COLORS } from '../../constants/colors';
import LoadingState from '../../components/shared/LoadingState';
import EmptyState from '../../components/shared/EmptyState';
import TurfCard from '../../components/user/TurfCard';
import Toast from 'react-native-toast-message';

const TurfListScreen = ({ navigation }: any) => {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTurfs();
  }, []);

  const fetchTurfs = async () => {
    try {
      const response = await turfAPI.getAllTurfs();
      setTurfs(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch turfs',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTurfs();
  };

  const renderTurfCard = ({ item }: { item: Turf }) => (
    <TurfCard
      turf={item}
      onPress={() => navigation.navigate('TurfDetail', { turfId: item.id })}
    />
  );

  if (loading) {
    return <LoadingState />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Turf</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color={COLORS.navy} />
        </TouchableOpacity>
      </View>

      {turfs.length === 0 ? (
        <EmptyState
          icon="football-outline"
          title="No Turfs Available"
          description="Check back later for available turfs"
        />
      ) : (
        <FlatList
          data={turfs}
          renderItem={renderTurfCard}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.navy,
  },
  list: {
    padding: 16,
  },
});

export default TurfListScreen;
