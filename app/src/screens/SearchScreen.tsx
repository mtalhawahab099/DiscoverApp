import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList } from '../types/navigation';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import SearchBar from '../components/SearchBar';
import BackButton from '../components/BackButton';
import { useOrientation } from '../hooks/useOrientation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Category = {
  id: string;
  name: string;
  image: string;
};

const categories: Category[] = [
  { id: '1', name: 'Science', image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop' },
  { id: '2', name: 'History', image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=800&auto=format&fit=crop' },
  { id: '3', name: 'Nature', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop' },
  { id: '4', name: 'Technology', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop' },
  { id: '5', name: 'Space', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop' },
  { id: '6', name: 'Biology', image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&auto=format&fit=crop' },
  { id: '7', name: 'Physics', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop' },
  { id: '8', name: 'Chemistry', image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&auto=format&fit=crop' },
  { id: '9', name: 'Geology', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&auto=format&fit=crop' },
  { id: '10', name: 'Astronomy', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop' },
];

const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const orientation = useOrientation();

  const handleSearch = (query: string) => {
    navigation.navigate('SearchResults', { query });
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        orientation === 'landscape' && styles.landscapeCategoryItem
      ]}
      onPress={() => handleSearch(item.name)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.categoryOverlay}
      />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton color={COLORS.text} />
        <SearchBar autoFocus onSubmit={handleSearch} />
      </View>

      <Text style={styles.sectionTitle}>Discovery Categories</Text>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={orientation === 'landscape' ? 4 : 2}
        key={orientation} // Force re-render when orientation changes
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: SIZES.xl,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoriesList: {
    padding: 16,
  },
  categoryItem: {
    flex: 1,
    margin: 8,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  landscapeCategoryItem: {
    height: 100,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  categoryName: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontFamily: FONTS.semiBold,
  },
});

export default SearchScreen;