
import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Wizard } from './components/Wizard';
import { Swiper } from './components/Swiper';
import { ResultView } from './components/ResultView';
import { DailyCapsule } from './components/DailyCapsule';
import { MovieDetail } from './components/MovieDetail';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModal';
import { CookieConsent } from './components/CookieConsent';
import { KnowledgeHub } from './components/KnowledgeHub';
import { AdSlot } from './components/AdSlot';
import { useStore } from './store';
import { AppView } from './types';

function App() {
  const { view, language } = useStore();

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen font-sans selection:bg-brand-500 selection:text-white pb-0 relative overflow-hidden flex flex-col bg-brand-950">
      
      {/* 1. Film Grain Overlay */}
      <div className="fixed inset-0 z-[1] bg-noise pointer-events-none opacity-40 mix-blend-overlay"></div>

      {/* 2. Surreal Aurora Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-950 via-black to-slate-950 opacity-90"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-brand-500/5 rounded-full blur-[120px] animate-aurora mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[80vw] h-[80vw] bg-indigo-900/10 rounded-full blur-[150px] animate-pulse"></div>
      </div>

      {/* 3. Main Content Layer */}
      <div className="relative z-10 flex flex-col flex-1">
        <Header />
        
        <main className="flex-1 flex flex-col container mx-auto px-4 md:px-8 pt-2 max-w-6xl">
          {view === AppView.WIZARD && (
            <div className="flex flex-col h-full animate-fade-in">
              <div className="flex-1 flex flex-col justify-center min-h-[60vh] py-12">
                {/* Top Banner Ad */}
                <AdSlot slot="1234567890" className="max-w-4xl mx-auto" label={false} />
                <Wizard />
              </div>
              
              <div className="space-y-32 pb-24">
                <DailyCapsule />
                
                {/* Middle In-Feed Ad */}
                <AdSlot slot="0987654321" className="py-10" />
                
                <KnowledgeHub />
              </div>
            </div>
          )}
          
          {view === AppView.SWIPER && (
            <div className="flex-1 flex flex-col justify-center animate-slide-up max-w-2xl mx-auto w-full py-12">
              <Swiper />
              {/* Discrete Bottom Ad for Swiper */}
              <AdSlot slot="1122334455" className="mt-12" label={false} />
            </div>
          )}
          
          {view === AppView.RESULT && (
            <div className="max-w-5xl mx-auto w-full mb-12 py-8">
              <ResultView />
            </div>
          )}
        </main>

        <Footer />

        {/* Global Movie Detail Modal */}
        <MovieDetail />
        
        {/* Global Legal Modal */}
        <LegalModal />

        {/* Compliance */}
        <CookieConsent />
      </div>
    </div>
  );
}

export default App;
