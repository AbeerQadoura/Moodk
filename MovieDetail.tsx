import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { getImageUrl, fetchMovieDetails, fetchTrailer } from '../services/tmdbService';
import { generateRecommendationReason } from '../services/geminiService';
import { X, Play, ArrowUpRight, Sparkles, Layers, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '../types';
import { translations } from '../translations';

export const MovieDetail: React.FC = () => {
  const { selectedMovie, selectMovie, filters, language } = useStore();
  const [aiReason, setAiReason] = useState<string | null>(null);
  const [details, setDetails] = useState<Partial<Movie>>({});
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const t = translations[language];

  useEffect(() => {
    if (selectedMovie) {
        setAiReason(null);
        setDetails({});
        setTrailerKey(null);
        setShowTrailer(false);
        const type = selectedMovie.media_type || 'movie';
        
        fetchMovieDetails(selectedMovie.id, type).then(setDetails);
        fetchTrailer(selectedMovie.id, type).then(setTrailerKey);

        const mappedFilters: any = {
            mood: { label: filters?.moodId || (language === 'ar' ? 'سينمائي' : 'Cinematic') },
            region: { label: filters?.regionId || (language === 'ar' ? 'عالمي' : 'Global') },
            time: { label: filters?.timeId || (language === 'ar' ? 'سهرة' : 'Tonight') }
        };
        generateRecommendationReason(selectedMovie, mappedFilters, language).then(setAiReason);
    }
  }, [selectedMovie, filters, language]);

  if (!selectedMovie) return null;

  const isTv = selectedMovie.media_type === 'tv';

  return (
    <>
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => selectMovie(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />

        <motion.div 
            initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
            className={`bg-brand-900 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-obsidian flex flex-col md:rounded-3xl ${language === 'ar' ? 'md:flex-row-reverse text-right' : 'md:flex-row text-left'}`}
        >
            <button onClick={() => selectMovie(null)} className={`absolute top-4 z-20 p-2 bg-black/60 backdrop-blur-md hover:bg-brand-500 text-white rounded-full border border-white/10 ${language === 'ar' ? 'left-4' : 'right-4'}`}><X className="w-5 h-5" /></button>

            <div className="w-full md:w-80 aspect-[2/3] md:aspect-auto relative shrink-0">
                <img src={getImageUrl(selectedMovie.poster_path, 'original')} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-transparent to-transparent md:hidden" />
            </div>

            <div className="p-6 md:p-10 flex flex-col gap-6 flex-1 bg-gradient-to-br from-brand-900 to-black">
                <div className="space-y-3">
                    <div className={`flex items-center flex-wrap gap-3 font-mono text-[9px] text-gray-500 uppercase ${language === 'ar' ? 'justify-start' : 'justify-start'}`}>
                        <span className="border border-white/10 px-2 py-0.5 rounded text-brand-400">{(selectedMovie.release_date || selectedMovie.first_air_date)?.split('-')[0]}</span>
                        <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-current" />{selectedMovie.vote_average.toFixed(1)}</span>
                        {isTv && details.number_of_seasons && (
                          <span className="flex items-center gap-1 text-blue-400"><Layers className="w-3 h-3" /> {details.number_of_seasons} {t.seasons}</span>
                        )}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase italic leading-tight tracking-tighter text-white">
                        {selectedMovie.title || selectedMovie.name}
                    </h2>
                </div>

                <div className="space-y-2">
                    <h3 className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">{t.synopsis}</h3>
                    <p className="text-xs md:text-sm leading-relaxed text-gray-400 font-light line-clamp-4">{selectedMovie.overview}</p>
                </div>

                <div className="relative p-5 rounded-xl bg-white/5 border border-white/10 mt-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3 h-3 text-brand-500 animate-pulse" />
                        <span className="text-[9px] font-black text-brand-500 uppercase tracking-widest">{t.insights}</span>
                    </div>
                    <p className="font-medium text-xs text-white italic">
                        {aiReason ? `"${aiReason}"` : <span className="animate-pulse opacity-50">{t.matchingDNA}</span>}
                    </p>
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/5">
                    <button onClick={() => trailerKey && setShowTrailer(true)} disabled={!trailerKey} className="flex-1 bg-brand-600 disabled:bg-gray-800 disabled:text-gray-500 text-white h-11 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-brand-500 rounded-lg shadow-glow">
                        <Play className="w-3.5 h-3.5 fill-white" /> {t.watchTrailer}
                    </button>
                    <a href={`https://www.themoviedb.org/${selectedMovie.media_type || 'movie'}/${selectedMovie.id}`} target="_blank" className="px-5 border border-white/10 hover:border-white/30 h-11 flex items-center justify-center text-[9px] font-black uppercase rounded-lg text-gray-500 hover:text-white transition-colors">
                        TMDB <ArrowUpRight className={`w-3.5 h-3.5 ml-2 ${language === 'ar' ? 'rotate-90' : ''}`} />
                    </a>
                </div>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>

    <AnimatePresence>
        {showTrailer && trailerKey && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center p-4 md:p-10">
            <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <button onClick={() => setShowTrailer(false)} className={`absolute top-4 z-10 p-2 bg-black/50 rounded-full text-white hover:text-brand-500 border border-white/10 transition-colors ${language === 'ar' ? 'left-4' : 'right-4'}`}><X className="w-5 h-5" /></button>
              <iframe src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} className="w-full h-full" allowFullScreen></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};