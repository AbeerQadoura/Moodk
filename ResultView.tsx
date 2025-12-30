import React, { useEffect, useState } from 'react';
import { Play, Sparkles, X, Star, ExternalLink, ArrowLeft, Layers, Hash } from 'lucide-react';
import { useStore } from './store';
import { getImageUrl, fetchTrailer, fetchCredits, fetchMovieDetails } from './tmdbService';
import { generateRecommendationReason } from './geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from './types';
import { translations } from './translations';

export const ResultView: React.FC = () => {
  const { currentMatch, wizardState, matchReason, setMatchReason, resetApp, language } = useStore();
  const [extendedData, setExtendedData] = useState<Partial<Movie>>({});
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const t = translations[language];

  useEffect(() => {
    if (currentMatch) {
      const loadData = async () => {
        if (!matchReason) {
          setLoadingAI(true);
          const reason = await generateRecommendationReason(currentMatch, wizardState, language);
          setMatchReason(reason);
          setLoadingAI(false);
        }
        
        const type = currentMatch.media_type || 'movie';
        const [details, trailer, credits] = await Promise.all([
          fetchMovieDetails(currentMatch.id, type),
          fetchTrailer(currentMatch.id, type),
          fetchCredits(currentMatch.id, type)
        ]);
        
        setExtendedData(details);
        setTrailerKey(trailer);
        setCast(credits);
      };
      loadData();
    }
  }, [currentMatch, wizardState, language]);

  if (!currentMatch) return null;

  const isTv = currentMatch.media_type === 'tv';

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-fade-in relative z-10">
      <div className="flex justify-between items-center mb-10">
        <button onClick={resetApp} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest group">
          <ArrowLeft className={`w-4 h-4 transition-transform ${language === 'ar' ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} /> {t.backToSearch}
        </button>
        <button onClick={resetApp} className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-brand-500 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
        <div className="w-full md:w-[380px] shrink-0 sticky top-24">
          <div className="relative rounded-3xl overflow-hidden shadow-obsidian border border-white/10 group">
            <img src={getImageUrl(currentMatch.poster_path, 'original')} className="w-full aspect-[2/3] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {trailerKey && (
              <button onClick={() => setShowTrailer(true)} className="absolute inset-0 flex items-center justify-center group/play">
                <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center shadow-glow group-hover/play:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="px-2.5 py-0.5 bg-brand-500 text-white text-[9px] font-black uppercase tracking-widest rounded">
                {isTv ? t.series : t.cinema}
              </span>
              <div className="flex items-center gap-1.5 text-yellow-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-current" /> {currentMatch.vote_average.toFixed(1)}
              </div>
              {isTv && extendedData.number_of_seasons && (
                <>
                  <span className="text-gray-700">|</span>
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs uppercase">
                    <Layers className="w-3.5 h-3.5" /> {extendedData.number_of_seasons} {t.seasons}
                  </div>
                  <span className="text-gray-700">|</span>
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs uppercase">
                    <Hash className="w-3.5 h-3.5" /> {extendedData.number_of_episodes} {t.episodes}
                  </div>
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
              {currentMatch.title || currentMatch.name}
            </h1>
          </div>

          <div className="relative p-6 rounded-2xl bg-brand-500/5 border border-brand-500/10 overflow-hidden">
            <div className={`absolute top-0 w-1 h-full bg-brand-500 ${language === 'ar' ? 'right-0' : 'left-0'}`} />
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span className="text-[9px] font-black text-brand-500 uppercase tracking-widest">{t.insights}</span>
            </div>
            <p className="text-lg md:text-xl text-white font-medium italic leading-relaxed">
              {loadingAI ? <span className="animate-pulse text-gray-700 italic">{t.waitMatch}</span> : `"${matchReason}"`}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{t.synopsis}</h3>
            <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-xl">{currentMatch.overview}</p>
          </div>

          {cast.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{t.cast}</h3>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {cast.map(actor => (
                  <div key={actor.id} className="flex-shrink-0 flex flex-col items-center gap-2 w-16">
                    <img src={getImageUrl(actor.profile_path)} className="w-12 h-12 rounded-full object-cover border border-white/10 grayscale" />
                    <span className="text-[8px] text-gray-500 font-bold text-center line-clamp-1">{actor.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
            <button 
              onClick={() => trailerKey && setShowTrailer(true)}
              disabled={!trailerKey}
              className="h-12 px-8 bg-brand-600 hover:bg-brand-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-glow active:scale-95 text-xs"
            >
              <Play className="w-4 h-4 fill-white" /> {t.watchTrailer}
            </button>
            <a href={`https://www.themoviedb.org/${currentMatch.media_type}/${currentMatch.id}`} target="_blank" className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>
        </div>
      </div>

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
    </div>
  );
};
