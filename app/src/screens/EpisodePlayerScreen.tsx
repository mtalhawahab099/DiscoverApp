import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { RootStackParamList } from '../types/navigation';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import BackButton from '../components/BackButton';
import { useOrientation } from '../hooks/useOrientation';
import { useQuery } from '@tanstack/react-query';
import { fetchDiscoveryDetails } from '../services/discoveryService';
import { getArtworkUrl } from '../constants/api';

type RouteProps = RouteProp<RootStackParamList, 'EpisodePlayer'>;

const EpisodePlayerScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { discoveryId, episodeId, title, audioUrl } = route.params;
  const orientation = useOrientation();
  
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { data: discovery } = useQuery({
    queryKey: ['discoveryDetail', discoveryId],
    queryFn: () => fetchDiscoveryDetails(discoveryId),
  });

  const episode = discovery?.episodes.find(ep => ep.id === episodeId);
  const artworkUrl = episode?.artworkUrl || discovery?.artworkUrl;

  useEffect(() => {
    loadAudio();
    
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);
    }
  };

  const playPauseAudio = async () => {
    if (!sound) return;
    
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const seekAudio = async (value: number) => {
    if (!sound) return;
    await sound.setPositionAsync(value);
  };

  const skipForward = async () => {
    if (!sound) return;
    const newPosition = Math.min(position + 15000, duration);
    await sound.setPositionAsync(newPosition);
  };

  const skipBackward = async () => {
    if (!sound) return;
    const newPosition = Math.max(position - 15000, 0);
    await sound.setPositionAsync(newPosition);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {orientation === 'portrait' ? (
        // Portrait layout
        <>
          <View style={styles.header}>
            <BackButton />
            <View style={styles.headerTitle}>
              <Text style={styles.title} numberOfLines={1}>{title}</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {discovery?.title}
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            <Image 
              source={{ uri: getArtworkUrl(artworkUrl || '', 600) }} 
              style={styles.artwork} 
              resizeMode="contain"
            />
            
            <View style={styles.playerControls}>
              <View style={styles.progressContainer}>
                <Slider
                  style={styles.progressBar}
                  minimumValue={0}
                  maximumValue={duration}
                  value={position}
                  onSlidingComplete={seekAudio}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor={COLORS.lightGray}
                  thumbTintColor={COLORS.primary}
                  disabled={isLoading}
                />
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{formatTime(position)}</Text>
                  <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>
              </View>
              
              <View style={styles.controlButtons}>
                <TouchableOpacity onPress={skipBackward} disabled={isLoading}>
                  <Ionicons name="play-skip-back" size={36} color={COLORS.darkPurple} />
                </TouchableOpacity>
                
                {isLoading ? (
                  <ActivityIndicator size="large" color={COLORS.primary} />
                ) : (
                  <TouchableOpacity onPress={playPauseAudio} style={styles.playButton}>
                    <Ionicons 
                      name={isPlaying ? "pause" : "play"} 
                      size={36} 
                      color={COLORS.white} 
                    />
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity onPress={skipForward} disabled={isLoading}>
                  <Ionicons name="play-skip-forward" size={36} color={COLORS.darkPurple} />
                </TouchableOpacity>
              </View>
            </View>
            
            {episode?.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Episode Description</Text>
                <Text style={styles.description}>{episode.description}</Text>
              </View>
            )}
          </View>
        </>
      ) : (
        // Landscape layout
        <View style={styles.landscapeContainer}>
          <View style={styles.landscapeLeftPanel}>
            <View style={styles.landscapeHeader}>
              <BackButton />
              <Text style={styles.landscapeTitle} numberOfLines={2}>{title}</Text>
            </View>
            
            <Image 
              source={{ uri: getArtworkUrl(artworkUrl || '', 400) }} 
              style={styles.landscapeArtwork} 
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.landscapeRightPanel}>
            <Text style={styles.landscapeSubtitle}>{discovery?.title}</Text>
            
            <View style={styles.landscapePlayerControls}>
              <View style={styles.progressContainer}>
                <Slider
                  style={styles.progressBar}
                  minimumValue={0}
                  maximumValue={duration}
                  value={position}
                  onSlidingComplete={seekAudio}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor={COLORS.lightGray}
                  thumbTintColor={COLORS.primary}
                  disabled={isLoading}
                />
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{formatTime(position)}</Text>
                  <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>
              </View>
              
              <View style={styles.landscapeControlButtons}>
                <TouchableOpacity onPress={skipBackward} disabled={isLoading}>
                  <Ionicons name="play-skip-back" size={36} color={COLORS.darkPurple} />
                </TouchableOpacity>
                
                {isLoading ? (
                  <ActivityIndicator size="large" color={COLORS.primary} />
                ) : (
                  <TouchableOpacity onPress={playPauseAudio} style={styles.playButton}>
                    <Ionicons 
                      name={isPlaying ? "pause" : "play"} 
                      size={36} 
                      color={COLORS.white} 
                    />
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity onPress={skipForward} disabled={isLoading}>
                  <Ionicons name="play-skip-forward" size={36} color={COLORS.darkPurple} />
                </TouchableOpacity>
              </View>
            </View>
            
            {episode?.description && (
              <View style={styles.landscapeDescriptionContainer}>
                <Text style={styles.descriptionTitle}>Episode Description</Text>
                <Text style={styles.description}>{episode.description}</Text>
              </View>
            )}
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    marginLeft: 16,
    flex: 1,
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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  artwork: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginVertical: 24,
  },
  playerControls: {
    width: '100%',
    marginTop: 24,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    color: COLORS.mediumGray,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionContainer: {
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 16,
  },
  descriptionTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.semiBold,
    color: COLORS.darkPurple,
    marginBottom: 8,
  },
  description: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.mediumGray,
    lineHeight: 24,
  },
  // Landscape styles
  landscapeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  landscapeLeftPanel: {
    width: '40%',
    padding: 16,
    paddingTop: 40,
    alignItems: 'center',
  },
  landscapeRightPanel: {
    width: '60%',
    padding: 16,
    paddingTop: 40,
  },
  landscapeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  landscapeTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.semiBold,
    color: COLORS.darkPurple,
    marginLeft: 16,
    flex: 1,
  },
  landscapeSubtitle: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.semiBold,
    color: COLORS.darkPurple,
    marginBottom: 24,
  },
  landscapeArtwork: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  landscapePlayerControls: {
    marginTop: 24,
  },
  landscapeControlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    marginTop: 16,
  },
  landscapeDescriptionContainer: {
    marginTop: 24,
  },
});

export default EpisodePlayerScreen;