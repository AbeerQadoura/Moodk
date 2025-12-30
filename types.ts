export enum AppView {
  WIZARD = 'WIZARD',
  SWIPER = 'SWIPER',
  RESULT = 'RESULT',
}

export interface Movie {
  id: number;
  title?: string;
  name?: string; 
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
  // Extended info for TV
  number_of_seasons?: number;
  number_of_episodes?: number;
  runtime?: number;
}

export interface WizardState {
  mediaType?: 'movie' | 'tv';
  mood?: MoodOption;
  region?: RegionOption;
  time?: TimeOption;
}

export interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  genreIds: number[];
}

export interface RegionOption {
  id: string;
  label: string;
  subLabel: string;
  languages: string[];
  countries?: string[];
  extraGenres?: number[]; // To target things like Anime
}

export interface TimeOption {
  id: string;
  label: string;
  subLabel: string;
  minMinutes?: number;
  maxMinutes?: number;
}