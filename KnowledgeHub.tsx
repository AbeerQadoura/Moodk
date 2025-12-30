
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Brain, Globe, ShieldCheck, ArrowRight, X, Quote, Maximize2 } from 'lucide-react';
import { useStore, Article } from './store';
import { translations } from './translations';
import { AdSlot } from './AdSlot';

export const KnowledgeHub: React.FC = () => {
  const { language, setSelectedArticle, selectedArticle } = useStore();
  const t = translations[language];

  const articlesData: Article[] = [
    { 
      id: 'ai-discovery', 
      title: t.articles.art1Title, 
      content: t.articles.art1Content, 
      tag: language === 'ar' ? 'تكنولوجيا' : 'Technology',
      icon: 'brain'
    },
    { 
      id: 'mood-psychology', 
      title: t.articles.art2Title, 
      content: t.articles.art2Content, 
      tag: language === 'ar' ? 'سيكولوجيا' : 'Psychology',
      icon: 'sparkles'
    },
    { 
      id: 'global-cinema', 
      title: t.articles.art3Title, 
      content: t.articles.art3Content, 
      tag: language === 'ar' ? 'ثقافة' : 'Culture',
      icon: 'globe'
    }
  ];

  const getIcon = (name: string) => {
    switch(name) {
      case 'brain': return <Brain className="w-full h-full" />;
      case 'sparkles': return <Sparkles className="w-full h-full" />;
      case 'globe': return <Globe className="w-full h-full" />;
      default: return <BookOpen className="w-full h-full" />;
    }
  };

  return (
    <section className="w-full pt-24 pb-32 border-t border-white/5 mt-20 relative">
      <div className="max-w-6xl mx-auto px-4">
        {/* Editorial Header */}
        <div className="relative mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 text-brand-500"
            >
              <div className="w-12 h-[2px] bg-brand-500"></div>
              <span className="text-xs font-black uppercase tracking-[0.5em]">{t.articles.title}</span>
            </motion.div>
            <h2 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mix-blend-difference">
              {language === 'ar' ? 'الرؤية' : 'Insights'}
            </h2>
          </div>
          <div className="max-w-sm space-y-4">
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              {language === 'ar' 
                ? 'استكشف كيف نقوم بدمج خوارزميات الذكاء الاصطناعي مع المشاعر الإنسانية لتقديم توصيات سينمائية تتجاوز التصنيفات التقليدية.' 
                : 'Discover how we merge AI algorithms with human emotions to deliver cinematic recommendations that transcend traditional categories.'}
            </p>
          </div>
        </div>

        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {articlesData.map((article, idx) => (
            <motion.div 
              key={article.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedArticle(article)}
              className="group relative cursor-pointer flex flex-col h-full bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 hover:bg-white/[0.03] hover:border-brand-500/30 transition-all duration-700"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/5 flex items-center justify-center text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500">
                  <div className="w-7 h-7">{getIcon(article.icon)}</div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3 h-3 text-brand-500" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">{language === 'ar' ? 'تكبير' : 'Zoom'}</span>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-brand-500 uppercase tracking-[0.3em]">{article.tag}</span>
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-brand-400 transition-colors">
                    {article.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-4 font-light group-hover:text-gray-300 transition-colors">
                  {article.content}
                </p>
              </div>

              <div className="mt-12 flex items-center gap-4 text-[10px] font-black text-brand-500 uppercase tracking-[0.4em] transition-all group-hover:gap-6">
                <span className="w-10 h-px bg-brand-500"></span> 
                {language === 'ar' ? 'قراءة كاملة' : 'Full Essay'}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Immersive Reader Modal with Refined Typography */}
        <AnimatePresence>
          {selectedArticle && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-0 md:p-12 overflow-hidden">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setSelectedArticle(null)}
                className="absolute inset-0 bg-black/95 backdrop-blur-3xl" 
              />
              
              <motion.div 
                layoutId={`article-${selectedArticle.id}`}
                initial={{ opacity: 0, scale: 0.95, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 50 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="relative bg-brand-950 border border-white/10 w-full max-w-4xl h-full md:h-auto md:max-h-[85vh] md:rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col"
              >
                {/* Header Actions */}
                <div className="absolute top-6 left-6 right-6 z-50 flex justify-between items-center">
                  <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
                     <span className="text-[9px] font-black text-brand-500 uppercase tracking-[0.3em]">{selectedArticle.tag}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="p-3 bg-brand-500 hover:bg-brand-400 rounded-full text-white transition-all shadow-glow active:scale-95"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Container */}
                <div className="relative flex-1 overflow-y-auto px-6 py-24 md:p-20 scrollbar-hide">
                   <div className="max-w-2xl mx-auto space-y-12">
                      <div className="space-y-6 text-center md:text-start">
                         <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-[1.1]">
                           {selectedArticle.title}
                         </h2>
                         <div className="h-0.5 w-16 bg-brand-500 mx-auto md:mx-0"></div>
                      </div>

                      <div className="relative group/content">
                         <Quote className="absolute -top-12 -left-12 w-20 h-20 text-brand-500/5 pointer-events-none group-hover/content:text-brand-500/10 transition-colors duration-1000" />
                         <div className="relative z-10 space-y-10">
                           <p className="text-lg md:text-xl text-gray-200 leading-[1.7] font-light tracking-wide italic border-l-2 border-brand-500/20 pl-6 first-letter:text-5xl first-letter:font-black first-letter:text-brand-500 first-letter:mr-2 first-letter:float-left">
                             {selectedArticle.content}
                           </p>

                           {/* In-Article Ad Placement */}
                           <AdSlot slot="5566778899" className="py-8" label={false} />

                           {/* Dynamic Rich Text Content */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
                             <div className="space-y-4">
                               <h4 className="text-brand-400 font-black text-[10px] uppercase tracking-widest">{language === 'ar' ? 'منظور تكنولوجي' : 'Tech Perspective'}</h4>
                               <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                 {language === 'ar' 
                                   ? 'خوارزمياتنا لا تبحث عن الكلمات المفتاحية فقط، بل تحلل السياق العاطفي لكل مشهد. نستخدم معالجة اللغات الطبيعية لفهم ما يجعل الفيلم "مؤثراً" أو "مشوقاً" من وجهة نظر المشاهد الحقيقي.'
                                   : 'Our algorithms don’t just search for keywords; they analyze the emotional context of every scene. We use NLP to understand what makes a film "moving" or "thrilling" from a real viewer’s perspective.'}
                               </p>
                             </div>
                             <div className="space-y-4">
                               <h4 className="text-brand-400 font-black text-[10px] uppercase tracking-widest">{language === 'ar' ? 'الفلسفة السينمائية' : 'Film Philosophy'}</h4>
                               <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                 {language === 'ar' 
                                   ? 'الفن هو مرآة للمجتمع، ونحن نؤمن بأن الوصول للعمل الفني الصحيح في الوقت الصحيح يمكن أن يغير نظرتك للعالم. مهمتنا هي تقريب المسافات بين الثقافات من خلال القصص التي تستحق أن تُروى.'
                                   : 'Art is a mirror of society, and we believe that finding the right artwork at the right time can change your worldview. Our mission is to bridge cultures through stories that deserve to be told.'}
                               </p>
                             </div>
                           </div>
                         </div>
                      </div>

                      <div className="pt-12 flex flex-col items-center gap-6">
                         <div className="w-12 h-px bg-white/10"></div>
                         <button 
                           onClick={() => setSelectedArticle(null)}
                           className="group/close px-10 py-3.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-500 hover:text-white transition-all duration-500 shadow-2xl flex items-center gap-3"
                         >
                           {language === 'ar' ? 'اكتملت القراءة' : 'Insight Completed'}
                           <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover/close:translate-x-1.5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                         </button>
                      </div>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
