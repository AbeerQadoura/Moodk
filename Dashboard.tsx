import React, { useEffect } from 'react';
import { useStore } from './store';
import { fetchRecommendations } from './tmdbService';
import { FilterBar } from './FilterBar';
import { MovieGrid } from './MovieGrid';
import { MovieDetail } from './MovieDetail';
import { Search } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { filters, setMovies, setLoading, movies } = useStore();

  // Auto-fetch when filters change
  useEffect(() => {
    const loadMovies = async () => {
      // Only fetch if at least one filter is active to avoid empty generic lists
      if (filters.moodId || filters.regionId || filters.timeId) {
        setLoading(true);
        const results = await fetchRecommendations(filters);
        setMovies(results);
        setLoading(false);
      }
    };

    // Debounce slightly to prevent API spam
    const timeout = setTimeout(loadMovies, 500);
    return () => clearTimeout(timeout);
  }, [filters, setMovies, setLoading]);

  return (
    <div className="min-h-screen pb-20 relative z-10">
      {/* Header / Control Panel */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-none"></div>
              MOODK <span className="text-muted font-mono text-xs font-normal">v2.0</span>
            </h1>
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted">
              <span>STATUS: ONLINE</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
          </div>
          
          <FilterBar />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {movies.length === 0 && !filters.moodId ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Search className="w-12 h-12 mb-4 text-border" />
            <p className="font-mono text-sm text-center max-w-md">
              AWAITING INPUT PARAMETERS.<br/>
              SELECT FILTERS ABOVE TO INITIATE CURATION SEQUENCE.
            </p>
          </div>
        ) : (
          <MovieGrid />
        )}
      </main>

      <MovieDetail />
    </div>
  );
};
