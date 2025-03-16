import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ScreenOrientation from 'expo-screen-orientation';

import { RootStackParamList } from '../types/navigation';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useOrientation } from '../hooks/useOrientation';

type RouteProps = RouteProp<RootStackParamList, 'VideoPlayer'>;

const VideoPlayerScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { video } = route.params;
  const orientation = useOrientation();
  const videoRef = useRef<Video>(null);
  
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: 300,
  });

  useEffect(() => {
    // Lock to landscape when in fullscreen mode
    if (isFullscreen) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      ScreenOrientation.unlockAsync();
    }

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, [isFullscreen]);

  useEffect(() => {
    // Update dimensions based on orientation
    const { width, height } = Dimensions.get('window');
    
    if (isFullscreen) {
      setDimensions({
        width: Math.max(width, height),
        height: Math.min(width, height),
      });
    } else if (orientation === 'landscape') {
      setDimensions({
        width: width,
        height: height * 0.7,
      });
    } else {
      setDimensions({
        width: width,
        height: 300,
      });
    }
  }, [orientation, isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);
    if (status.isLoaded && isLoading) {
      setIsLoading(false);
    }
  };

  return (
    <View style={[
      styles.container,
      isFullscreen && styles.fullscreenContainer
    ]}>
      {!isFullscreen && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{video.name}</Text>
        </View>
      )}
      
      <View style={[
        styles.videoContainer,
        isFullscreen && styles.fullscreenVideoContainer
      ]}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        
        <Video
          ref={videoRef}
          style={{
            width: dimensions.width,
            height: dimensions.height,
          }}
          source={{ uri: video.url }}
          useNativeControls
          resizeMode={isFullscreen ? ResizeMode.CONTAIN : ResizeMode.COVER}
          shouldPlay
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
        
        <TouchableOpacity
          style={styles.fullscreenButton}
          onPress={toggleFullscreen}
        >
          <Ionicons 
            name={isFullscreen ? "contract" : "expand"}
            size={24}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
      
      {!isFullscreen && (
        <ScrollView style={styles.content}>
          <Text style={styles.videoTitle}>{video.name}</Text>
          <Text style={styles.videoDate}>{formatDate(video.releaseDate)}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.descriptionTitle}>About this video</Text>
          <Text style={styles.description}>{video.description || "No description available for this video."}</Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  fullscreenContainer: {
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginLeft: 16,
    flex: 1,
  },
  videoContainer: {
    position: 'relative',
    backgroundColor: COLORS.black,
  },
  fullscreenVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 5,
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 4,
    zIndex: 10,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  videoTitle: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 8,
  },
  videoDate: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  descriptionTitle: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
});

export default VideoPlayerScreen;