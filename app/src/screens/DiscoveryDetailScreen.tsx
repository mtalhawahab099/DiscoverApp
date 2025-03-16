import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList, Episode, DiscoveryVideo } from '../types/navigation';
import { fetchDiscoveryDetails } from '../services/discoveryService';
import { getArtworkUrl, getGenreName } from '../constants/api';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import BackButton from '../components/BackButton';
import GenreTag from '../components/GenreTag';
import Button from '../components/Button';
import { useOrientation } from '../hooks/useOrientation';

type RouteProps = RouteProp<RootStackParamList, 'DiscoveryDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DiscoveryDetailScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { discoveryId } = route.params;
  const orientation = useOrientation();

  const { data: discovery, isLoading: isLoadingDiscovery } = useQuery({
    queryKey: ['discoveryDetail', discoveryId],
    queryFn: () => fetchDiscoveryDetails(discoveryId),
  });

  const handlePlayEpisode = (episode: Episode) => {
    navigation.navigate('EpisodePlayer', {
      discoveryId,
      episodeId: episode.id,
      title: episode.title,
      audioUrl: episode.audioUrl,
    });
  };

  const handleWatchVideo = (video: DiscoveryVideo) => {
    navigation.navigate('VideoPlayer', {
      video,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoadingDiscovery) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!discovery) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Discovery not found</Text>
      </View>
    );
  }

  const renderEpisodeItem = ({ item }: { item: Episode }) => (
    <TouchableOpacity 
      style={styles.episodeItem}
      onPress={() => handlePlayEpisode(item)}
    >
      <Image 
        source={{ uri: getArtworkUrl(item.artworkUrl, 200) }} 
        style={styles.episodeImage} 
      />
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.episodeDate}>{formatDate(item.releaseDate)}</Text>
        {item.duration && (
          <Text style={styles.episodeDuration}>{formatDuration(item.duration)}</Text>
        )}
      </View>
      <Ionicons name="play-circle" size={36} color={COLORS.primary} />
    </TouchableOpacity>
  );

  const renderVideoItem = ({ item }: { item: DiscoveryVideo }) => (
    <TouchableOpacity 
      style={styles.videoItem}
      onPress={() => handleWatchVideo(item)}
    >
      <View style={styles.videoThumbnailContainer}>
        <Image 
          source={{ uri: getArtworkUrl(item.artworkUrl, 400) }} 
          style={styles.videoThumbnail} 
        />
        <View style={styles.playIconContainer}>
          <Ionicons name="play-circle" size={48} color={COLORS.white} />
        </View>
      </View>
      <Text style={styles.videoTitle} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {orientation === 'portrait' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: getArtworkUrl(discovery.artworkUrl, 800) }}
              style={styles.backdrop}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', COLORS.background]}
              style={styles.gradient}
            />
            <View style={styles.headerContent}>
              <View style={styles.backButtonContainer}>
                <BackButton color={COLORS.white} />
              </View>
              <Text style={styles.title}>{discovery.title}</Text>
              <Text style={styles.releaseDate}>
                Released {formatDate(discovery.releaseDate)}
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.genreContainer}>
              {discovery.genreIds?.map((genreId) => (
                <GenreTag key={genreId} name={getGenreName(genreId)} />
              ))}
              {discovery.genres?.map((genre) => (
                <GenreTag key={genre} name={genre} />
              ))}
            </View>

            {discovery.videos && discovery.videos.length > 0 && (
              <View style={styles.buttonContainer}>
                <Button 
                  title="Watch Video" 
                  onPress={() => handleWatchVideo(discovery.videos![0])}
                  icon={<Ionicons name="play" size={18} color={COLORS.white} style={styles.buttonIcon} />}
                />
              </View>
            )}

            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{discovery.description}</Text>
            </View>

            {discovery.videos && discovery.videos.length > 0 && (
              <View style={styles.videosContainer}>
                <Text style={styles.sectionTitle}>Videos</Text>
                <FlatList
                  data={discovery.videos}
                  keyExtractor={(item) => item.id}
                  renderItem={renderVideoItem}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.videosList}
                />
              </View>
            )}

            {discovery.episodes && discovery.episodes.length > 0 && (
              <View style={styles.episodesContainer}>
                <Text style={styles.sectionTitle}>Episodes</Text>
                <FlatList
                  data={discovery.episodes}
                  keyExtractor={(item) => item.id}
                  renderItem={renderEpisodeItem}
                  scrollEnabled={false}
                />
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        // Landscape layout
        <View style={styles.landscapeContainer}>
          <View style={styles.landscapeBackdropContainer}>
            <Image
              source={{ uri: getArtworkUrl(discovery.artworkUrl, 800) }}
              style={styles.landscapeBackdrop}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.7)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.landscapeGradient}
            />
            <View style={styles.landscapeBackButtonContainer}>
              <BackButton color={COLORS.white} />
            </View>
          </View>
          
          <ScrollView style={styles.landscapeContent}>
            <Text style={styles.title}>{discovery.title}</Text>
            <Text style={styles.releaseDate}>
              Released {formatDate(discovery.releaseDate)}
            </Text>
            
            <View style={styles.genreContainer}>
              {discovery.genreIds?.map((genreId) => (
                <GenreTag key={genreId} name={getGenreName(genreId)} />
              ))}
              {discovery.genres?.map((genre) => (
                <GenreTag key={genre} name={genre} />
              ))}
            </View>
            
            {discovery.videos && discovery.videos.length > 0 && (
              <View style={styles.landscapeButtonContainer}>
                <Button 
                  title="Watch Video" 
                  onPress={() => handleWatchVideo(discovery.videos![0])}
                  icon={<Ionicons name="play" size={18} color={COLORS.white} style={styles.buttonIcon} />}
                />
              </View>
            )}
            
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{discovery.description}</Text>
            </View>
            
            {discovery.videos && discovery.videos.length > 0 && (
              <View style={styles.videosContainer}>
                <Text style={styles.sectionTitle}>Videos</Text>
                <FlatList
                  data={discovery.videos}
                  keyExtractor={(item) => item.id}
                  renderItem={renderVideoItem}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.videosList}
                />
              </View>
            )}
            
            {discovery.episodes && discovery.episodes.length > 0 && (
              <View style={styles.episodesContainer}>
                <Text style={styles.sectionTitle}>Episodes</Text>
                <FlatList
                  data={discovery.episodes}
                  keyExtractor={(item) => item.id}
                  renderItem={renderEpisodeItem}
                  scrollEnabled={true}
                />
              </View>
            )}
          </ScrollView>
        </View>
      )}
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
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.lg,
    color: COLORS.error,
  },
  headerContainer: {
    height: 400,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    top: -320,
    left: 10,
  },
  title: {
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  releaseDate: {
    color: COLORS.primary,
    fontSize: SIZES.lg,
    fontFamily: FONTS.medium,
  },
  content: {
    padding: 20,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  buttonIcon: {
    marginRight: 8,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  episodesContainer: {
    marginBottom: 24,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  episodeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: SIZES.md,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: 4,
  },
  episodeDate: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  episodeDuration: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
    marginTop: 4,
  },
  videosContainer: {
    marginBottom: 24,
  },
  videosList: {
    paddingRight: 16,
  },
  videoItem: {
    width: 200,
    marginRight: 16,
  },
  videoThumbnailContainer: {
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  videoTitle: {
    fontSize: SIZES.md,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
  },
  // Landscape styles
  landscapeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  landscapeBackdropContainer: {
    width: '40%',
    position: 'relative',
  },
  landscapeBackdrop: {
    width: '100%',
    height: '100%',
  },
  landscapeGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  landscapeBackButtonContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
  },
  landscapeContent: {
    width: '60%',
    padding: 20,
    paddingTop: 40,
  },
  landscapeButtonContainer: {
    marginBottom: 24,
    width: '70%',
  },
});

export default DiscoveryDetailScreen;