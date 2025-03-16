import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  DiscoveryDetail: { discoveryId: string; title: string };
  Search: undefined;
  SearchResults: { query: string };
  EpisodePlayer: { 
    discoveryId: string; 
    episodeId: string; 
    title: string;
    audioUrl: string;
  };
  VideoPlayer: { 
    video: DiscoveryVideo;
  };
  VideosScreen: {
    title: string;
    discoveryId?: string;
  };
};

export type RootTabParamList = {
  Discover: undefined;
  Videos: undefined;
  Search: undefined;
  Library: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type Discovery = {
  id: string;
  title: string;
  description: string;
  artworkUrl: string;
  releaseDate: string;
  genres: string[];
  genreIds: number[];
  kind: string;
  contentType: 'podcast' | 'audiobook' | 'course';
};

export type Episode = {
  id: string;
  title: string;
  description: string;
  artworkUrl: string;
  releaseDate: string;
  duration: number;
  audioUrl: string;
};

export type DiscoveryVideo = {
  id: string;
  key: string;
  name: string;
  description: string;
  site: string;
  type: string;
  url: string;
  artworkUrl: string;
  releaseDate: string;
};

export type DiscoveryDetails = Discovery & {
  episodes: Episode[];
  videos?: DiscoveryVideo[];
};

export type Orientation = 'portrait' | 'landscape';