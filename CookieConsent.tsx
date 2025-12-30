
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { translations } from '../translations';
import { ShieldCheck } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const { cookieAccepted, acceptCookies, language } = useStore();
  const t = translations[language];

  if (cookieAccepted) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-6 right-6 z-[250] md:max-w-xl md:mx-auto"
      >
        <div className="bg-brand-900/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-4">
          <div className="w-12 h-12 bg-brand-500/20 rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-brand-500" />
          </div>
          <div className="flex-1 text-center md:text-start">
            <p className="text-[11px] text-gray-300 font-medium leading-relaxed uppercase tracking-wider">
              {t.legal.cookieText}
            </p>
          </div>
          <button 
            onClick={acceptCookies}
            className="w-full md:w-auto px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-glow active:scale-95"
          >
            {t.legal.accept}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
