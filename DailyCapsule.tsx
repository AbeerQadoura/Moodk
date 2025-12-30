
import React, { useEffect, useState } from 'react';
import { fetchTrending, getImageUrl } from './tmdbService';
import { Movie } from './types';
import { Flame, Star } from 'lucide-react';
import { useStore } from './store';
import { translations } from './translations';
import { motion } from 'framer-motion';

export const DailyCapsule: React.FC = () => {
  const [picks, setPicks] = useState<Movie[]>([]);
  const { selectMovie, language } = useStore();
  const t = translations[language];

  useEffect(() => {
    fetchTrending().then(setPicks);
  }, []);

  if (picks.length === 0) return null;

  return (
    <div className="w-full pt-12">
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black flex items-center gap-2 text-brand-500 uppercase tracking-[0.3em]">
            <Flame className="w-3.5 h-3.5 fill-current" /> {t.trendingNow}
          </h3>
          <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest">{language === 'ar' ? 'أفضل ما شوهد هذا الأسبوع' : 'Global top picks this week'}</p>
        </div>
        <div className="h-px flex-1 bg-white/5 mx-8 hidden md:block"></div>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-8 px-1 snap-x snap-mandatory scrollbar-hide">
        {picks.map((movie, idx) => (
          <motion.div 
            key={movie.id} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="min-w-[280px] md:min-w-[320px] snap-start relative group cursor-pointer" 
            onClick={() => selectMovie(movie)}
          >
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-4 relative shadow-2xl border border-white/5 group-hover:border-brand-500/50 transition-all duration-500">
                <img 
                  src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')} 
                  alt={movie.title || movie.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                {/* Ranking Number with Glassmorphism */}
                <div className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black italic text-white shadow-xl`}>
                  {idx + 1}
                </div>

                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-brand-500 fill-brand-500" />
                    <span className="text-white text-[10px] font-black">{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <h4 className="text-white font-black uppercase italic tracking-tighter line-clamp-2 text-lg leading-tight h-14 flex items-end">
                    {movie.title || movie.name}
                  </h4>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
