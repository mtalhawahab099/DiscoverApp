import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { RootStackParamList } from '../types/navigation';
import { searchDiscoveries } from '../services/discoveryService';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import BackButton from '../components/BackButton';
import DiscoveryCard from '../components/DiscoveryCard';
import { useOrientation } from '../hooks/useOrientation';

type RouteProps = RouteProp<RootStackParamList, 'SearchResults'>;

const SearchResultsScreen = () => {
  const route = useRoute<RouteProps>();
  const { query } = route.params;
  const orientation = useOrientation();

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['searchResults', query],
    queryFn: () => searchDiscoveries(query),
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Something went wrong. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Search Results</Text>
          <Text style={styles.subtitle}>{query}</Text>
        </View>
      </View>

      {results && results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DiscoveryCard discovery={item} />}
          numColumns={orientation === 'landscape' ? 3 : 1}
          key={orientation} // Force re-render when orientation changes
          contentContainerStyle={[
            styles.resultsList,
            orientation === 'landscape' && styles.resultsGridList
          ]}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No results found for "{query}"</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.lg,
    color: 'red',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    marginLeft: 16,
  },
  title: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.semiBold,
    color: COLORS.darkPurple,
  },
  subtitle: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
  },
  resultsList: {
    padding: 16,
  },
  resultsGridList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.lg,
    color: COLORS.mediumGray,
    textAlign: 'center',
  },
});

export default SearchResultsScreen;