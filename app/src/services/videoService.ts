import { ITUNES_BASE_URL } from '../constants/api';
import { DiscoveryVideo } from '../types/navigation';

// Fetch discovery videos using iTunes API
export const fetchDiscoveryVideos = async (query: string): Promise<DiscoveryVideo[]> => {
  try {
    // Search for educational videos related to the query
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(query)}&media=movie&entity=movie&attribute=movieTerm&limit=10`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch discovery videos');
    }
    
    const data = await response.json();
    
    return data.results
      .filter((item: any) => item.previewUrl) // Only include items with preview URLs
      .map((item: any) => ({
        id: item.trackId.toString(),
        key: item.trackId.toString(),
        name: item.trackName,
        description: item.longDescription || item.shortDescription || '',
        site: 'iTunes',
        type: 'Preview',
        url: item.previewUrl,
        artworkUrl: item.artworkUrl100,
        releaseDate: item.releaseDate,
      }));
  } catch (error) {
    console.error('Error fetching discovery videos:', error);
    return [];
  }
};

// Fetch educational documentaries
export const fetchEducationalDocumentaries = async (): Promise<DiscoveryVideo[]> => {
  try {
    // Search for educational documentaries
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=documentary+education+science&media=movie&entity=movie&limit=20`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch educational documentaries');
    }
    
    const data = await response.json();
    
    return data.results
      .filter((item: any) => item.previewUrl) // Only include items with preview URLs
      .map((item: any) => ({
        id: item.trackId.toString(),
        key: item.trackId.toString(),
        name: item.trackName,
        description: item.longDescription || item.shortDescription || '',
        site: 'iTunes',
        type: 'Documentary',
        url: item.previewUrl,
        artworkUrl: item.artworkUrl100,
        releaseDate: item.releaseDate,
      }));
  } catch (error) {
    console.error('Error fetching educational documentaries:', error);
    return [];
  }
};

// Fetch related videos for a discovery
export const fetchRelatedVideos = async (discoveryTitle: string): Promise<DiscoveryVideo[]> => {
  try {
    // Extract keywords from the discovery title
    const keywords = discoveryTitle
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 2)
      .join('+');
    
    // Search for related videos using keywords
    const response = await fetch(
      `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(keywords)}&media=movie&entity=movie&limit=5`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch related videos');
    }
    
    const data = await response.json();
    
    return data.results
      .filter((item: any) => item.previewUrl) // Only include items with preview URLs
      .map((item: any) => ({
        id: item.trackId.toString(),
        key: item.trackId.toString(),
        name: item.trackName,
        description: item.longDescription || item.shortDescription || '',
        site: 'iTunes',
        type: 'Related',
        url: item.previewUrl,
        artworkUrl: item.artworkUrl100,
        releaseDate: item.releaseDate,
      }));
  } catch (error) {
    console.error('Error fetching related videos:', error);
    return [];
  }
};