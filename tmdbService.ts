
import axios from 'axios';
import { Movie, WizardState } from './types';

// In production, you should set this in your deployment environment variables
const TMDB_API_KEY = 'f817ccc50d414f360a57682aeb929931'; 
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=500';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const fetchMovieDetails = async (id: number, type: 'movie' | 'tv'): Promise<Partial<Movie>> => {
  try {
    const response = await tmdb.get(`/${type}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return {};
  }
};

export const fetchTrailer = async (movieId: number, type: 'movie' | 'tv'): Promise<string | null> => {
  try {
    const response = await tmdb.get(`/${type}/${movieId}/videos`);
    const videos = response.data.results;
    return videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')?.key || 
           videos.find((v: any) => v.site === 'YouTube')?.key || null;
  } catch { return null; }
};

export const fetchCredits = async (movieId: number, type: 'movie' | 'tv'): Promise<any[]> => {
  try {
    const response = await tmdb.get(`/${type}/${movieId}/credits`);
    return response.data.cast.slice(0, 8);
  } catch { return []; }
};

export const fetchRecommendations = async (criteria: WizardState): Promise<Movie[]> => {
  const { mood, region, time, mediaType } = criteria;
  const isTv = mediaType === 'tv';
  const endpoint = isTv ? '/discover/tv' : '/discover/movie';

  const params: any = {
    sort_by: 'popularity.desc',
    'vote_count.gte': 15,
    'vote_average.gte': 5.0,
    include_adult: false,
    page: 1,
  };

  if (region) {
    switch (region.id) {
      case 'anime':
        params.with_original_language = 'ja';
        params.with_genres = '16';
        break;
      case 'arab':
        params.with_original_language = 'ar';
        params['vote_count.gte'] = 0; 
        break;
      case 'turkish':
        params.with_original_language = 'tr';
        break;
      case 'korean':
        params.with_original_language = 'ko';
        break;
      case 'bollywood':
        params.with_original_language = 'hi|te|ta';
        break;
      case 'hollywood':
        params.with_original_language = 'en';
        break;
    }
  }

  if (mood && mood.genreIds.length > 0) {
    params.with_genres = mood.genreIds.join('|');
  }

  if (time) {
    if (time.minMinutes) params['with_runtime.gte'] = time.minMinutes;
    if (time.maxMinutes) params['with_runtime.lte'] = time.maxMinutes;
  }

  try {
    const response = await tmdb.get(endpoint, { params });
    const results = response.data.results;
    
    if (results.length === 0 && mood) {
        // Relaxing constraints if zero results found
        delete params.with_genres;
        const fallbackResponse = await tmdb.get(endpoint, { params });
        return fallbackResponse.data.results.map((m: any) => ({ ...m, media_type: isTv ? 'tv' : 'movie' }));
    }

    return results.map((m: any) => ({ ...m, media_type: isTv ? 'tv' : 'movie' }));
  } catch (error) {
    console.error("Discovery Error:", error);
    return [];
  }
};

export const fetchTrending = async (): Promise<Movie[]> => {
  try {
    const response = await tmdb.get('/trending/all/week');
    return response.data.results.slice(0, 12);
  } catch { return []; }
};
