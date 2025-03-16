import { ITUNES_BASE_URL } from '../constants/api';
import { Discovery, DiscoveryDetails, DiscoveryVideo } from '../types/navigation';
import { fetchRelatedVideos } from './videoService';

// Fetch trending discoveries (podcasts, audiobooks, courses)
export const fetchTrendingDiscoveries = async (): Promise<Discovery[]> => {
  try {
    // Fetch educational podcasts
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=science+discovery&media=podcast&entity=podcast&limit=20`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending discoveries');
    }
    
    const data = await response.json();
    
    return data.results.map((item: any) => ({
      id: item.trackId.toString(),
      title: item.trackName || item.collectionName,
      description: item.description || item.shortDescription || '',
      artworkUrl: item.artworkUrl100,
      releaseDate: item.releaseDate,
      genres: item.genres || [],
      genreIds: item.genreIds ? item.genreIds.map(Number) : [],
      kind: item.kind || item.wrapperType,
      contentType: 'podcast',
    }));
  } catch (error) {
    console.error('Error fetching trending discoveries:', error);
    throw error;
  }
};

// Fetch discovery details
export const fetchDiscoveryDetails = async (id: string): Promise<DiscoveryDetails> => {
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}/lookup?id=${id}&entity=podcastEpisode`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch discovery details');
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error('Discovery not found');
    }
    
    const mainItem = data.results[0];
    const episodes = data.results.slice(1);
    
    // Fetch related videos for this discovery
    const videos = await fetchRelatedVideos(mainItem.trackName || mainItem.collectionName);
    
    return {
      id: mainItem.trackId.toString(),
      title: mainItem.trackName || mainItem.collectionName,
      description: mainItem.description || mainItem.longDescription || '',
      artworkUrl: mainItem.artworkUrl100,
      releaseDate: mainItem.releaseDate,
      genres: mainItem.genres || [],
      genreIds: mainItem.genreIds ? mainItem.genreIds.map(Number) : [],
      kind: mainItem.kind || mainItem.wrapperType,
      contentType: 'podcast',
      episodes: episodes.map((episode: any) => ({
        id: episode.trackId.toString(),
        title: episode.trackName,
        description: episode.description || '',
        artworkUrl: episode.artworkUrl100 || mainItem.artworkUrl100,
        releaseDate: episode.releaseDate,
        duration: episode.trackTimeMillis,
        audioUrl: episode.previewUrl || episode.episodeUrl,
      })),
      videos: videos,
    };
  } catch (error) {
    console.error('Error fetching discovery details:', error);
    throw error;
  }
};

// Search for discoveries
export const searchDiscoveries = async (query: string): Promise<Discovery[]> => {
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(query)}&media=podcast,audiobook&entity=podcast,audiobook&limit=20`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search discoveries');
    }
    
    const data = await response.json();
    
    return data.results.map((item: any) => ({
      id: item.trackId?.toString() || item.collectionId?.toString(),
      title: item.trackName || item.collectionName,
      description: item.description || item.shortDescription || '',
      artworkUrl: item.artworkUrl100,
      releaseDate: item.releaseDate,
      genres: item.genres || [],
      genreIds: item.genreIds ? item.genreIds.map(Number) : [],
      kind: item.kind || item.wrapperType,
      contentType: item.kind === 'audiobook' ? 'audiobook' : 'podcast',
    }));
  } catch (error) {
    console.error('Error searching discoveries:', error);
    throw error;
  }
};

// Fetch discoveries by category/genre
export const fetchDiscoveriesByCategory = async (category: string): Promise<Discovery[]> => {
  try {
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(category)}&media=podcast,audiobook&entity=podcast,audiobook&limit=20`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch discoveries by category');
    }
    
    const data = await response.json();
    
    return data.results.map((item: any) => ({
      id: item.trackId?.toString() || item.collectionId?.toString(),
      title: item.trackName || item.collectionName,
      description: item.description || item.shortDescription || '',
      artworkUrl: item.artworkUrl100,
      releaseDate: item.releaseDate,
      genres: item.genres || [],
      genreIds: item.genreIds ? item.genreIds.map(Number) : [],
      kind: item.kind || item.wrapperType,
      contentType: item.kind === 'audiobook' ? 'audiobook' : 'podcast',
    }));
  } catch (error) {
    console.error('Error fetching discoveries by category:', error);
    throw error;
  }
};