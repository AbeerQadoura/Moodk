
import { create } from 'zustand';
import { AppView, Movie, WizardState } from './types';

interface Filters {
  moodId: string | null;
  regionId: string | null;
  timeId: string | null;
}

export type LegalPage = 'privacy' | 'about' | 'contact' | 'terms' | null;

export interface Article {
  id: string;
  title: string;
  content: string;
  tag: string;
  icon: string;
}

interface AppState {
  view: AppView;
  language: 'en' | 'ar';
  wizardState: WizardState;
  recommendations: Movie[];
  currentMatch: Movie | null;
  matchReason: string | null;
  
  // Dashboard & Detail View State
  movies: Movie[];
  selectedMovie: Movie | null;
  isLoading: boolean;
  filters: Filters;

  // Legal & Compliance State
  activeLegalPage: LegalPage;
  cookieAccepted: boolean;
  
  // Article State
  selectedArticle: Article | null;

  // Actions
  setView: (view: AppView) => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  setWizardState: (state: Partial<WizardState>) => void;
  setRecommendations: (movies: Movie[]) => void;
  swipeRight: (movie: Movie) => void;
  swipeLeft: (movie: Movie) => void;
  setMatchReason: (reason: string | null) => void;
  
  // Dashboard Actions
  setMovies: (movies: Movie[]) => void;
  selectMovie: (movie: Movie | null) => void;
  setLoading: (loading: boolean) => void;
  setFilter: (key: keyof Filters, value: string | null) => void;
  
  // Legal Actions
  setLegalPage: (page: LegalPage) => void;
  acceptCookies: () => void;
  
  // Article Actions
  setSelectedArticle: (article: Article | null) => void;

  resetApp: () => void;
}

export const useStore = create<AppState>((set) => ({
  view: AppView.WIZARD,
  language: 'en',
  wizardState: {},
  recommendations: [],
  currentMatch: null,
  matchReason: null,

  // Initial Dashboard State
  movies: [],
  selectedMovie: null,
  isLoading: false,
  filters: { moodId: null, regionId: null, timeId: null },
  activeLegalPage: null,
  cookieAccepted: localStorage.getItem('moodk_cookies') === 'true',
  
  // Article Initial State
  selectedArticle: null,

  setView: (view) => set({ view }),
  setLanguage: (language) => set({ language }),
  setWizardState: (newState) => 
    set((state) => ({ wizardState: { ...state.wizardState, ...newState } })),
  
  setRecommendations: (movies) => set({ recommendations: movies }),
  
  swipeRight: (movie) => {
    set({ currentMatch: movie, view: AppView.RESULT });
  },
  
  swipeLeft: (movie) => {
    set((state) => ({
      recommendations: state.recommendations.filter((m) => m.id !== movie.id)
    }));
  },

  setMatchReason: (reason) => set({ matchReason: reason }),

  // Dashboard Action Implementations
  setMovies: (movies) => set({ movies }),
  selectMovie: (movie) => set({ selectedMovie: movie }),
  setLoading: (loading) => set({ isLoading: loading }),
  setFilter: (key, value) => set((state) => ({ 
    filters: { ...state.filters, [key]: value } 
  })),

  setLegalPage: (page) => set({ activeLegalPage: page }),
  acceptCookies: () => {
    localStorage.setItem('moodk_cookies', 'true');
    set({ cookieAccepted: true });
  },
  
  setSelectedArticle: (article) => set({ selectedArticle: article }),

  resetApp: () => set({
    view: AppView.WIZARD,
    wizardState: {},
    recommendations: [],
    currentMatch: null,
    matchReason: null,
    selectedMovie: null,
    movies: [],
    isLoading: false,
    filters: { moodId: null, regionId: null, timeId: null },
    activeLegalPage: null,
    selectedArticle: null
  }),
}));
