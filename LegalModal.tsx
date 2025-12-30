
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Info, Mail, FileText } from 'lucide-react';
import { useStore } from '../store';
import { translations } from '../translations';

export const LegalModal: React.FC = () => {
  const { activeLegalPage, setLegalPage, language } = useStore();
  const t = translations[language];

  if (!activeLegalPage) return null;

  const content = {
    about: {
      title: t.legal.aboutTitle,
      icon: <Info className="w-10 h-10 text-brand-500" />,
      text: t.legal.aboutContent
    },
    privacy: {
      title: t.legal.privacyTitle,
      icon: <Shield className="w-10 h-10 text-brand-500" />,
      text: t.legal.privacyContent
    },
    terms: {
      title: t.legal.termsTitle,
      icon: <FileText className="w-10 h-10 text-brand-500" />,
      text: t.legal.termsContent
    },
    contact: {
      title: t.legal.contactTitle,
      icon: <Mail className="w-10 h-10 text-brand-500" />,
      text: t.legal.contactContent,
      extra: (
        <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{t.legal.emailLabel}</p>
          <a href={`mailto:${t.legal.emailValue}`} className="text-brand-500 font-black text-lg hover:text-brand-400 transition-colors">{t.legal.emailValue}</a>
        </div>
      )
    }
  }[activeLegalPage];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={() => setLegalPage(null)} 
          className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-zinc-950 border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <button 
            onClick={() => setLegalPage(null)} 
            className={`absolute top-6 z-10 p-2 bg-white/5 rounded-full text-white hover:text-brand-500 transition-colors ${language === 'ar' ? 'left-6' : 'right-6'}`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-10 md:p-16 flex flex-col items-center text-center gap-6 overflow-y-auto max-h-[80vh]">
            <div className="p-5 rounded-full bg-brand-500/10 mb-2">
              {content.icon}
            </div>
            
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              {content.title}
            </h2>
            
            <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light">
              {content.text}
            </p>

            {content.extra}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
