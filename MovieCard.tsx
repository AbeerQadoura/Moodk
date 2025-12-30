
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, X, Plus, Check } from 'lucide-react';
import { Movie } from './types';
import { getImageUrl, fetchTrailer } from './tmdbService';
import { useStore } from './store';
import { translations } from './translations';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, index }) => {
  const { selectMovie, language } = useStore();
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const t = translations[language];

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('moodk_watchlist') || '[]');
    setIsInWatchlist(watchlist.includes(movie.id));
  }, [movie.id]);

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const watchlist = JSON.parse(localStorage.getItem('moodk_watchlist') || '[]');
    let newWatchlist;
    if (watchlist.includes(movie.id)) {
      newWatchlist = watchlist.filter((id: number) => id !== movie.id);
      setIsInWatchlist(false);
    } else {
      newWatchlist = [...watchlist, movie.id];
      setIsInWatchlist(true);
    }
    localStorage.setItem('moodk_watchlist', JSON.stringify(newWatchlist));
  };

  const handleWatchTrailer = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (trailerKey) {
      setShowTrailer(true);
      return;
    }

    setIsLoadingTrailer(true);
    const key = await fetchTrailer(movie.id, movie.media_type || 'movie');
    setTrailerKey(key);
    setIsLoadingTrailer(false);
    if (key) {
      setShowTrailer(true);
    } else {
      alert(language === 'ar' ? 'الإعلان غير متوفر حالياً.' : 'Trailer not available at the moment.');
    }
  };

  const fullTitle = movie.title || movie.name;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => selectMovie(movie)}
        className="group cursor-pointer flex flex-col gap-3"
      >
        <div className="relative aspect-[2/3] overflow-hidden border border-white/10 group-hover:border-brand-500/60 group-hover:shadow-glow transition-all duration-500 ease-out bg-white/5 rounded-xl shadow-obsidian">
          <img 
            src={getImageUrl(movie.poster_path)} 
            alt={fullTitle} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105" 
            loading="lazy" 
          />

          {/* Watchlist Toggle Button */}
          <button 
            onClick={toggleWatchlist} 
            className={`absolute top-3 z-30 p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${language === 'ar' ? 'left-3' : 'right-3'} ${isInWatchlist ? 'bg-brand-500 border-brand-400 text-white shadow-glow scale-110' : 'bg-black/40 border-white/10 text-white/70 hover:text-white hover:bg-black/60 opacity-0 group-hover:opacity-100 hover:scale-110'}`}
          >
            {isInWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
          
          {/* Detail Trigger Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 gap-2">
             <button 
                onClick={handleWatchTrailer} 
                disabled={isLoadingTrailer} 
                className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white w-full py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-glow transition-all active:scale-95 px-2"
             >
               {isLoadingTrailer ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-3 h-3 fill-white" />}
               {t.watchTrailer}
             </button>
             <span className="text-[10px] font-black text-center text-white/60 uppercase tracking-[0.2em] py-1">
               {t.details}
             </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 px-1 relative">
          <div className={`flex items-center justify-between text-[10px] text-gray-500 font-mono ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="flex items-center gap-1">
               <Star className="w-3 h-3 text-brand-500 fill-brand-500" />
               <span className="text-gray-300">{movie.vote_average.toFixed(1)}</span>
            </div>
            <span className="uppercase tracking-widest opacity-60">
              {movie.media_type === 'tv' ? t.series : t.cinema}
            </span>
          </div>

          <div className="relative" onMouseEnter={() => setIsTitleHovered(true)} onMouseLeave={() => setIsTitleHovered(false)}>
            <h3 className={`font-bold text-xs leading-tight group-hover:text-brand-400 transition-colors line-clamp-2 text-white uppercase tracking-tight h-8 flex items-start ${language === 'ar' ? 'text-right justify-end' : 'text-left justify-start'}`}>
              {fullTitle}
            </h3>
            
            <AnimatePresence>
              {isTitleHovered && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                  className={`absolute bottom-full mb-2 z-[100] pointer-events-none ${language === 'ar' ? 'right-0' : 'left-0'}`}
                >
                  <div className="bg-brand-900 border border-white/20 text-white text-[10px] py-2 px-3 rounded-lg shadow-2xl whitespace-normal min-w-[150px] max-w-[220px] font-black uppercase tracking-tight leading-tight italic">
                    <div className={`absolute bottom-[-5px] w-2.5 h-2.5 bg-brand-900 border-r border-b border-white/20 rotate-45 ${language === 'ar' ? 'right-4' : 'left-4'}`} />
                    {fullTitle}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Local Trailer Modal */}
      <AnimatePresence>
        {showTrailer && trailerKey && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[300] bg-black/98 flex items-center justify-center p-4 md:p-10" 
            onClick={(e) => { e.stopPropagation(); setShowTrailer(false); }}
          >
            <div 
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10" 
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowTrailer(false)} 
                className={`absolute top-4 z-10 p-2 bg-black/50 rounded-full text-white hover:text-brand-500 border border-white/10 transition-colors ${language === 'ar' ? 'left-4' : 'right-4'}`}
              >
                <X className="w-5 h-5" />
              </button>
              <iframe 
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} 
                className="w-full h-full" 
                allow="autoplay; encrypted-media" 
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
