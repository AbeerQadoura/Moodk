import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { X, Heart, Star, Tv, Film, Info } from 'lucide-react';
import { useStore } from '../store';
import { getImageUrl } from '../services/tmdbService';
import { translations } from '../translations';

export const Swiper: React.FC = () => {
  const { recommendations, swipeRight, swipeLeft, resetApp, language } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitX, setExitX] = useState<number | null>(null);
  const t = translations[language];

  const currentMovie = recommendations[currentIndex];
  const nextMovie = recommendations[currentIndex + 1];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-150, 0, 150], [0.95, 1, 0.95]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) triggerSwipe('right');
    else if (info.offset.x < -100) triggerSwipe('left');
  };

  const triggerSwipe = (direction: 'left' | 'right') => {
    setExitX(direction === 'right' ? 400 : -400);
    setTimeout(() => {
      if (direction === 'right') swipeRight(currentMovie);
      else swipeLeft(currentMovie);
      setCurrentIndex(prev => prev + 1);
      setExitX(null);
      x.set(0);
    }, 300);
  };

  if (!currentMovie) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Info className="w-8 h-8 text-gray-500" />
        </div>
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">{t.noMoreResults}</h2>
        <p className="text-gray-500 mb-10 text-sm font-medium uppercase tracking-widest leading-loose">{t.noMoreDesc}</p>
        <button onClick={resetApp} className="w-full h-14 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-glow active:scale-95 px-6">
          {t.newSearch}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 py-8 min-h-[80vh]">
      
      <div className="hidden lg:flex flex-col gap-6 w-1/4">
        <div className="space-y-2">
          <span className="text-brand-500 font-bold text-[10px] tracking-widest uppercase">NOW SHOWING</span>
          <p className="text-gray-400 text-xs font-medium leading-relaxed">
            {language === 'ar' ? 'اسحب لليمين للإعجاب، لليسار للتجاهل.' : 'Swipe right if this matches your vibe. Left to ignore.'}
          </p>
        </div>
      </div>

      <div className="flex-1 relative w-full max-w-sm md:max-w-md mx-auto h-[600px] flex items-center justify-center">
        <AnimatePresence>
          {nextMovie && (
            <motion.div key={nextMovie.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 0.95, opacity: 0.3 }} className="absolute inset-0 z-0 scale-95 opacity-30 blur-[2px]">
              <div className="w-full h-full rounded-[2.5rem] bg-zinc-900 overflow-hidden border border-white/10 shadow-obsidian">
                <img src={getImageUrl(nextMovie.poster_path, 'original')} className="w-full h-full object-cover grayscale" />
              </div>
            </motion.div>
          )}

          <motion.div
            key={currentMovie.id}
            style={{ x, rotate, opacity, scale }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={exitX !== null ? { x: exitX, opacity: 0 } : { x: 0, opacity: 1 }}
            className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing w-full h-full"
          >
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-zinc-900 relative group">
              <img src={getImageUrl(currentMovie.poster_path, 'original')} alt={currentMovie.title} className="w-full h-full object-cover pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
              <div className="absolute top-6 left-6 right-6 flex justify-between z-20">
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <Star className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
                  <span className="text-white text-xs font-black">{currentMovie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  {currentMovie.media_type === 'tv' ? <Tv className="w-3.5 h-3.5 text-blue-400" /> : <Film className="w-3.5 h-3.5 text-purple-400" />}
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">{currentMovie.media_type === 'tv' ? t.series : t.cinema}</span>
                </div>
              </div>
              <div className="absolute bottom-10 left-8 right-8 z-20">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-3">{currentMovie.title || currentMovie.name}</h2>
                <p className="text-gray-400 text-xs line-clamp-2 font-medium leading-relaxed opacity-80">{currentMovie.overview}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full md:w-auto flex md:flex-col items-center justify-center gap-6 z-30">
        <button onClick={() => triggerSwipe('left')} className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-brand-500 transition-all hover:scale-110 active:scale-95 shadow-lg group">
          <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
        </button>
        <button onClick={() => triggerSwipe('right')} className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-brand-500 text-white hover:bg-brand-400 transition-all hover:scale-110 active:scale-95 shadow-glow">
          <Heart className="w-8 h-8 fill-white" />
        </button>
      </div>
    </div>
  );
};