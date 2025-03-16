import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { RootStackParamList } from '../types/navigation';
import { fetchTrendingDiscoveries, fetchDiscoveriesByCategory } from '../services/discoveryService';
import DiscoveryCard from '../components/DiscoveryCard';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useOrientation } from '../hooks/useOrientation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const orientation = useOrientation();
  
  const { data: trendingDiscoveries, isLoading: isLoadingTrending, error: trendingError } = useQuery({
    queryKey: ['trendingDiscoveries'],
    queryFn: fetchTrendingDiscoveries,
  });

  const { data: scienceDiscoveries, isLoading: isLoadingScience } = useQuery({
    queryKey: ['scienceDiscoveries'],
    queryFn: () => fetchDiscoveriesByCategory('science'),
  });

  const { data: historyDiscoveries, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['historyDiscoveries'],
    queryFn: () => fetchDiscoveriesByCategory('history'),
  });

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const handleVideosPress = () => {
    navigation.navigate('VideosScreen', { title: 'Discovery Videos' });
  };

  if (isLoadingTrending || isLoadingScience || isLoadingHistory) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (trendingError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Something went wrong. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <TouchableOpacity onPress={handleSearchPress} style={styles.searchButton}>
          <Ionicons name="search" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={trendingDiscoveries?.slice(0, 3)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <DiscoveryCard discovery={item} fullWidth />}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Discoveries</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={trendingDiscoveries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <DiscoveryCard discovery={item} />}
            horizontal={orientation === 'portrait'}
            numColumns={orientation === 'landscape' ? 3 : 1}
            key={`trending-${orientation}`} // Force re-render when orientation changes
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.discoveryList,
              orientation === 'landscape' && styles.discoveryGridList
            ]}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Science</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={scienceDiscoveries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <DiscoveryCard discovery={item} />}
            horizontal={orientation === 'portrait'}
            numColumns={orientation === 'landscape' ? 3 : 1}
            key={`science-${orientation}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.discoveryList,
              orientation === 'landscape' && styles.discoveryGridList
            ]}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>History</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={historyDiscoveries}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <DiscoveryCard discovery={item} />}
            horizontal={orientation === 'portrait'}
            numColumns={orientation === 'landscape' ? 3 : 1}
            key={`history-${orientation}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.discoveryList,
              orientation === 'landscape' && styles.discoveryGridList
            ]}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Discovery Videos</Text>
            <TouchableOpacity onPress={handleVideosPress}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.videosPromo}>
            <TouchableOpacity 
              style={styles.videosPromoButton}
              onPress={handleVideosPress}
            >
              <Ionicons name="videocam" size={32} color={COLORS.white} />
              <Text style={styles.videosPromoText}>Explore Educational Videos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.lg,
    color: COLORS.error,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  searchButton: {
    padding: 8,
  },
  carousel: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: SIZES.md,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  discoveryList: {
    paddingHorizontal: 16,
  },
  discoveryGridList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  videosPromo: {
    paddingHorizontal: 16,
  },
  videosPromoButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videosPromoText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontFamily: FONTS.semiBold,
    marginLeft: 12,
  },
});

export default HomeScreen;