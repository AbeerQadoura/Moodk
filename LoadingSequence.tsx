import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { translations } from '../translations';
import { Sparkles } from 'lucide-react';

export const LoadingSequence: React.FC<{ fullScreen?: boolean }> = ({ fullScreen = false }) => {
  const { language } = useStore();
  const t = translations[language];
  const messages = t.loadingMessages;
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const containerClasses = fullScreen 
    ? "fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6"
    : "w-full py-24 flex flex-col items-center justify-center";

  return (
    <div className={containerClasses}>
      <div className="relative mb-12">
        {/* Pulsing Core */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full bg-brand-500/20 blur-xl absolute -inset-0"
        />
        
        {/* Rotating Rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 rounded-full border-2 border-brand-500/30 border-t-brand-500 relative flex items-center justify-center shadow-glow"
        >
          <Sparkles className="w-8 h-8 text-brand-500 animate-pulse" />
        </motion.div>

        {/* Scanning Line Effect (Virtual) */}
        <motion.div 
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px bg-brand-400/50 shadow-[0_0_15px_rgba(229,9,20,0.8)] z-10"
        />
      </div>

      <div className="text-center space-y-4 max-w-xs">
        <h3 className="text-brand-500 font-black tracking-[0.4em] text-[10px] uppercase italic animate-pulse">
          {t.searchStatus}
        </h3>
        
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white text-xs font-medium uppercase tracking-widest italic"
            >
              {messages[currentMessageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Cyberpunk Progress Bar */}
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto mt-4">
          <motion.div 
            className="h-full bg-brand-500 shadow-glow"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
};