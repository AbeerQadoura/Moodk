import React from 'react';
import { useStore } from '../store';
import { Activity, Globe, Monitor, Film, X } from 'lucide-react';

const MOODS = [
  { id: 'happy', label: 'مبتهج' },
  { id: 'scared', label: 'متوتر' },
  { id: 'sad', label: 'درامي' },
  { id: 'mindblown', label: 'خيالي' },
  { id: 'pumped', label: 'حماسي' },
];

export const FilterBar: React.FC = () => {
  const { filters, setFilter } = useStore();

  return (
    <div className="flex flex-col gap-6 overflow-x-auto pb-2 scrollbar-hide text-right">
      
      {/* Media Type Toggle */}
      <div className="flex items-center gap-4 bg-white/5 p-1 rounded-xl w-fit border border-white/10 mr-auto ml-0 md:mr-0">
          <button 
            onClick={() => setFilter('timeId', 'movie' as any)} 
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-black transition-all ${!filters.timeId?.includes('tv') ? 'bg-brand-500 text-white shadow-glow' : 'text-gray-500 hover:text-white'}`}
          >
              <Film className="w-3.5 h-3.5" /> أفلام
          </button>
          <button 
            onClick={() => setFilter('timeId', 'tv' as any)}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-black transition-all ${filters.timeId?.includes('tv') ? 'bg-brand-500 text-white shadow-glow' : 'text-gray-500 hover:text-white'}`}
          >
              <Monitor className="w-3.5 h-3.5" /> مسلسلات
          </button>
      </div>

      <div className="flex flex-wrap gap-8 justify-start">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-wider justify-start">
                <Activity className="w-3 h-3" /> الأجواء العامة
            </div>
            <div className="flex flex-wrap gap-2 justify-start">
                {MOODS.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => setFilter('moodId', filters.moodId === m.id ? null : m.id)}
                        className={`px-4 py-1.5 text-[10px] font-bold border transition-all rounded-md ${filters.moodId === m.id ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
                    >
                        {m.label}
                    </button>
                ))}
            </div>
          </div>
      </div>
    </div>
  );
};