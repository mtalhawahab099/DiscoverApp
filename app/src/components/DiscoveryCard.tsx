import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList, Discovery } from '../types/navigation';
import { getArtworkUrl, getGenreName } from '../constants/api';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useOrientation } from '../hooks/useOrientation';

type DiscoveryCardProps = {
  discovery: Discovery;
  fullWidth?: boolean;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ discovery, fullWidth = false }) => {
  const navigation = useNavigation<NavigationProp>();
  const orientation = useOrientation();
  const { width } = Dimensions.get('window');

  const handlePress = () => {
    navigation.navigate('DiscoveryDetail', { 
      discoveryId: discovery.id, 
      title: discovery.title 
    });
  };

  const getCardWidth = () => {
    if (fullWidth) return { width: width };
    
    if (orientation === 'landscape') {
      // In landscape, we show 3 cards per row
      return { width: (width - 48) / 3 - 8 };
    }
    
    // In portrait, we show cards in a horizontal scroll
    return { width: width * 0.8 };
  };

  // Get the primary genre for display
  const primaryGenre = discovery.genreIds && discovery.genreIds.length > 0
    ? getGenreName(discovery.genreIds[0])
    : discovery.genres && discovery.genres.length > 0
      ? discovery.genres[0]
      : discovery.contentType.charAt(0).toUpperCase() + discovery.contentType.slice(1);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        getCardWidth(),
        fullWidth && styles.fullWidth,
        orientation === 'landscape' && !fullWidth && styles.landscapeCard
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: getArtworkUrl(discovery.artworkUrl) }}
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
      >
        <Text style={styles.title} numberOfLines={2}>{discovery.title}</Text>
        <Text style={styles.genre}>{primaryGenre}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    marginRight: 16,
    backgroundColor: COLORS.card,
  },
  fullWidth: {
    borderRadius: 0,
    marginRight: 0,
  },
  landscapeCard: {
    height: 180,
    marginRight: 8,
    marginLeft: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
  },
  genre: {
    color: COLORS.secondary,
    fontSize: SIZES.sm,
    fontFamily: FONTS.regular,
    marginTop: 4,
  },
});

export default DiscoveryCard;