import React from 'react';
import { useStore } from './store';
import { MovieCard } from './MovieCard';
import { LoadingSequence } from './LoadingSequence';

export const MovieGrid: React.FC = () => {
  const { movies, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <LoadingSequence />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
      {movies.map((movie, idx) => (
        <MovieCard key={movie.id} movie={movie} index={idx} />
      ))}
    </div>
  );
};
