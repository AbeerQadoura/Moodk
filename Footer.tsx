
import React from 'react';
import { useStore } from '../store';
import { translations } from '../translations';
import { Shield, Info, Mail, Cpu, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setLegalPage } = useStore();
  const t = translations[language];

  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-md mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className={`flex flex-col gap-2 ${language === 'ar' ? 'text-right md:items-end' : 'text-left md:items-start'}`}>
            <h2 className="text-white font-black text-xl tracking-tighter uppercase italic">{t.appName}</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{t.footer.madeBy}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <FooterLink icon={<Info className="w-4 h-4" />} label={t.footer.about} onClick={() => setLegalPage('about')} />
            <FooterLink icon={<Shield className="w-4 h-4" />} label={t.footer.privacy} onClick={() => setLegalPage('privacy')} />
            <FooterLink icon={<FileText className="w-4 h-4" />} label={t.footer.terms} onClick={() => setLegalPage('terms')} />
            <FooterLink icon={<Mail className="w-4 h-4" />} label={t.footer.contact} onClick={() => setLegalPage('contact')} />
          </div>
        </div>

        {/* TMDB Attribution Section */}
        <div className="mt-12 flex flex-col items-center gap-4 py-6 border-y border-white/5">
            <img 
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bd747ea570e6159d6f35073306d5300ee810c149b3148f913d060850a62972e.svg" 
              alt="TMDB Logo" 
              className="h-6 opacity-40 grayscale hover:grayscale-0 transition-all"
            />
            <p className="text-[9px] text-gray-600 font-medium uppercase tracking-widest text-center max-w-sm">
              {t.footer.tmdbNotice}
            </p>
        </div>

        <div className="mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">
          <span>© {new Date().getFullYear()} {t.appName}. {t.footer.rights}.</span>
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3" />
            <span>AI ENGINE v2.5 ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="group flex flex-col items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
      <div className="text-gray-500 group-hover:text-brand-500 transition-colors">{icon}</div>
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">{label}</span>
  </button>
);
