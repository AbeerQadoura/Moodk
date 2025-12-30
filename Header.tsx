import React from 'react';
import { Film, RefreshCw, Languages } from 'lucide-react';
import { useStore } from '../store';
import { AppView } from '../types';
import { translations } from '../translations';

export const Header: React.FC = () => {
  const { resetApp, view, language, setLanguage } = useStore();
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/10 border-b border-white/5 mb-6">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center shadow-glow">
            <Film className="text-white w-6 h-6 fill-white" />
          </div>
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <h1 className="text-2xl font-black tracking-tighter text-white leading-none">{t.appName}</h1>
            <p className="text-[10px] text-brand-400 font-bold uppercase tracking-[0.2em]">{t.tagline}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-gray-400 hover:text-white"
          >
            <Languages className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{language === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {view !== AppView.WIZARD && (
            <button 
              onClick={resetApp}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-brand-500/10 rounded-full border border-white/10 transition-all hover:border-brand-500/30 group"
            >
              <span className="text-xs font-bold text-gray-300 group-hover:text-brand-400 hidden sm:inline">{t.startOver}</span>
              <RefreshCw className="w-4 h-4 text-gray-300 group-hover:text-brand-400 group-hover:rotate-180 transition-all duration-500" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};