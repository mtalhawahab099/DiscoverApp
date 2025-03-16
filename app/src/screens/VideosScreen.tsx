import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { RootStackParamList, DiscoveryVideo } from '../types/navigation';
import { fetchEducationalDocumentaries } from '../services/videoService';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useOrientation } from '../hooks/useOrientation';
import { getArtworkUrl } from '../constants/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const VideosScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const orientation = useOrientation();

  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['educationalVideos'],
    queryFn: fetchEducationalDocumentaries,
  });

  const handleVideoPress = (video: DiscoveryVideo) => {
    navigation.navigate('VideoPlayer', { video });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderVideoItem = ({ item }: { item: DiscoveryVideo }) => (
    <TouchableOpacity
      style={[
        styles.videoItem,
        orientation === 'landscape' && styles.landscapeVideoItem
      ]}
      onPress={() => handleVideoPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: getArtworkUrl(item.artworkUrl, 600) }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.playIconContainer}>
          <Ionicons name="play-circle" size={48} color={COLORS.white} />
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.videoDate}>{formatDate(item.releaseDate)}</Text>
        <Text style={styles.videoType}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.title}>Discovery Videos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={renderVideoItem}
        numColumns={orientation === 'landscape' ? 2 : 1}
        key={orientation} // Force re-render when orientation changes
        contentContainerStyle={styles.videosList}
        showsVerticalScrollIndicator={false}
      />
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
  videosList: {
    padding: 16,
  },
  videoItem: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
  },
  landscapeVideoItem: {
    flex: 1,
    margin: 8,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: 8,
  },
  videoDate: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  videoType: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
});

export default VideosScreen;