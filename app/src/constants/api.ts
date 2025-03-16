// iTunes API constants
export const ITUNES_BASE_URL = 'https://itunes.apple.com';

// Helper function to get appropriate artwork image with size
export const getArtworkUrl = (url: string, size: number = 600): string => {
  if (!url) return 'https://via.placeholder.com/600';
  return url.replace('100x100', `${size}x${size}`);
};

// Helper function to get genre name from genre ID
export const getGenreName = (genreId: number): string => {
  const genres: Record<number, string> = {
    50000061: 'Science',
    50000063: 'History',
    50000064: 'Philosophy',
    50000068: 'Nature',
    50000069: 'Education',
    50000041: 'Earth Sciences',
    50000059: 'Physics',
    1304: 'Arts',
    1402: 'Astronomy',
    1303: 'Biology',
    1301: 'Chemistry',
    1476: 'Geography',
    1477: 'Mathematics',
    1478: 'Technology',
    1479: 'Social Sciences',
    // Add more genre mappings as needed
  };
  
  return genres[genreId] || 'Discovery';
};