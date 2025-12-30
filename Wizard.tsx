
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Film, Monitor, Compass } from 'lucide-react';
import { useStore } from './store';
import { MoodOption, RegionOption, TimeOption, AppView } from './types';
import { fetchRecommendations } from './services/tmdbService';
import { translations } from './translations';
import { LoadingSequence } from './LoadingSequence';

export const Wizard: React.FC = () => {
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const { setWizardState, wizardState, setView, setRecommendations, language } = useStore();
  const t = translations[language];

  const MOODS: MoodOption[] = [
    { id: 'fun', emoji: '🍿', label: t.matches.fun, genreIds: [35, 16, 10751] }, 
    { id: 'intense', emoji: '🔥', label: t.matches.intense, genreIds: [28, 53, 27, 80] }, 
    { id: 'emotional', emoji: '🎭', label: t.matches.emotional, genreIds: [18, 10749, 36] }, 
    { id: 'epic', emoji: '🌌', label: t.matches.epic, genreIds: [12, 878, 14] }, 
    { id: 'mystery', emoji: '🔍', label: t.matches.mystery, genreIds: [9648, 80, 53] }, 
    { id: 'any', emoji: '✨', label: t.matches.any, genreIds: [] }, 
  ];

  const REGIONS: RegionOption[] = [
    { id: 'hollywood', label: t.regions.hollywood, subLabel: language === 'ar' ? 'إنتاجات عالمية' : 'Global productions', languages: ['en'], countries: ['US', 'GB'] },
    { id: 'arab', label: t.regions.arab, subLabel: language === 'ar' ? 'أعمال أصلية' : 'Original works', languages: ['ar'], countries: ['EG', 'SA', 'AE', 'LB'] },
    { id: 'anime', label: t.regions.anime, subLabel: language === 'ar' ? 'روائع يابانية' : 'Japanese masterpieces', languages: ['ja'], countries: ['JP'], extraGenres: [16] },
    { id: 'turkish', label: t.regions.turkish, subLabel: language === 'ar' ? 'دراما ورومانسية' : 'Drama & Romance', languages: ['tr'], countries: ['TR'] },
    { id: 'korean', label: t.regions.korean, subLabel: language === 'ar' ? 'دراما K-Drama' : 'K-Drama prestige', languages: ['ko'], countries: ['KR'] },
    { id: 'bollywood', label: t.regions.bollywood, subLabel: language === 'ar' ? 'حيوية هندية' : 'Indian vibrancy', languages: ['hi'], countries: ['IN'] },
  ];

  const MOVIE_TIMES: TimeOption[] = [
    { id: 'short', label: t.times.short, subLabel: language === 'ar' ? 'أقل من ساعة' : 'Under 60m', maxMinutes: 60 },
    { id: 'feature', label: t.times.feature, subLabel: language === 'ar' ? 'أكثر من ساعة' : 'Full experience', minMinutes: 61 },
  ];

  const TV_TIMES: TimeOption[] = [
    { id: 'quick', label: t.times.quick, subLabel: language === 'ar' ? 'حلقات قصيرة' : '20-30m per ep', maxMinutes: 30 },
    { id: 'prestige', label: t.times.prestige, subLabel: language === 'ar' ? 'حلقات طويلة' : '45m+ per ep', minMinutes: 45 },
  ];

  const handleNext = () => setStep(prev => prev + 1);

  const handleComplete = async (finalTime: TimeOption) => {
    setLoading(true);
    const completeState = { ...wizardState, time: finalTime };
    setWizardState({ time: finalTime });
    const results = await fetchRecommendations(completeState);
    setRecommendations(results);
    setLoading(false);
    setView(AppView.SWIPER);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 md:py-12 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex flex-col gap-8 md:gap-12"
        >
          <div className="space-y-3 text-center md:text-start">
            <span className="text-brand-500 font-black tracking-[0.4em] text-[10px] uppercase">STEP 0{step + 1}</span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
              {step === 0 ? t.format : step === 1 ? t.mood : step === 2 ? t.origin : t.time}
            </h2>
          </div>

          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { id: 'movie', label: t.cinema, icon: <Film className="w-10 h-10" />, desc: t.cinemaDesc },
                { id: 'tv', label: t.series, icon: <Monitor className="w-10 h-10" />, desc: t.seriesDesc }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => { setWizardState({ mediaType: type.id as 'movie' | 'tv' }); handleNext(); }}
                  className="obsidian-card group p-10 rounded-3xl flex flex-col items-center gap-5 border border-white/5 hover:border-brand-500/50 transition-all text-center"
                >
                  <div className="text-brand-500 group-hover:scale-110 transition-transform">{type.icon}</div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{type.label}</h3>
                    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest leading-relaxed">{type.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {MOODS.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => { setWizardState({ mood }); handleNext(); }}
                  className="obsidian-card p-8 rounded-2xl flex flex-col items-center gap-4 hover:border-brand-500/50 transition-all"
                >
                  <span className="text-4xl md:text-5xl">{mood.emoji}</span>
                  <span className="font-bold text-gray-400 tracking-widest text-[9px] md:text-[10px] uppercase text-center">{mood.label}</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {REGIONS.map(region => (
                <button
                  key={region.id}
                  onClick={() => { setWizardState({ region }); handleNext(); }}
                  className="obsidian-card p-6 rounded-2xl text-start flex flex-col items-start gap-2 hover:border-brand-500/50 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-brand-500" />
                    <h3 className="font-black text-white text-sm uppercase group-hover:text-brand-400">{region.label}</h3>
                  </div>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{region.subLabel}</p>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto md:mx-0">
              {(wizardState.mediaType === 'tv' ? TV_TIMES : MOVIE_TIMES).map(time => (
                <button
                  key={time.id}
                  onClick={() => handleComplete(time)}
                  className="obsidian-card p-8 rounded-2xl flex flex-col items-center md:items-start text-center md:text-start gap-4 hover:border-brand-500/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">{time.label}</h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{time.subLabel}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-16 w-full max-w-sm mx-auto md:mx-0 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-brand-500 shadow-glow"
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / 4) * 100}%` }}
        />
      </div>

      {loading && <LoadingSequence fullScreen />}
    </div>
  );
};
