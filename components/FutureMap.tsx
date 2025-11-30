import React, { useState } from 'react';
import { generateMapExploration } from '../services/geminiService';
import { Map as MapIcon, Search, Navigation, ExternalLink, Loader2, MapPin, Globe } from 'lucide-react';
import { t } from '../utils/translations';

interface FutureMapProps {
  language: string;
}

const FutureMap: React.FC<FutureMapProps> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; chunks: any[] } | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    
    const data = await generateMapExploration(query);
    setResult(data);
    setLoading(false);
  };

  const suggestions = [
    "Umayyad Mosque",
    "Aleppo Citadel",
    "Norias of Hama",
    "Palmyra Tetrapylon"
  ];

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-serif text-white mb-2">{t('map.title', language)}</h2>
        <p className="text-syria-gold text-lg">{t('map.subtitle', language)}</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Search Interface */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-2xl mb-8">
          <div className="relative flex items-center mb-6">
            <Search className="absolute left-4 rtl:right-4 text-syria-gold" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t('map.placeholder', language)}
              className="w-full bg-black/40 border border-white/20 rounded-xl py-4 pl-12 pr-4 rtl:pr-12 rtl:pl-4 text-white focus:outline-none focus:border-syria-gold focus:ring-1 focus:ring-syria-gold transition-all text-lg"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query}
              className="absolute right-2 rtl:left-2 bg-syria-green text-white p-2.5 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Navigation size={20} />}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => { setQuery(s); handleSearch(); }}
                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            
            {/* AI Context Card */}
            <div className="bg-gradient-to-br from-syria-dark to-black border border-syria-gold/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <MapIcon size={120} className="text-syria-gold" />
              </div>
              <div className="relative z-10">
                 <h3 className="text-2xl font-serif text-white mb-4 flex items-center gap-2">
                   <Globe size={24} className="text-syria-green" /> 
                   {t('map.analysis', language)}
                 </h3>
                 <p className="text-gray-200 leading-relaxed text-lg whitespace-pre-wrap">
                   {result.text}
                 </p>
              </div>
            </div>

            {/* Google Maps Grounding Links */}
            {result.chunks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {result.chunks.map((chunk, idx) => {
                   const mapData = chunk.maps;
                   if (!mapData) return null;
                   
                   return (
                     <a 
                       key={idx}
                       href={mapData.uri}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="group bg-white/5 border border-white/10 hover:border-syria-gold/50 p-4 rounded-xl flex items-center justify-between transition-all hover:bg-white/10"
                     >
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:text-white transition-colors">
                           <MapPin size={20} />
                         </div>
                         <div className="text-left rtl:text-right">
                           <h4 className="text-white font-bold text-sm">{mapData.title || t('map.location', language)}</h4>
                           <p className="text-xs text-gray-400">Google Maps</p>
                         </div>
                       </div>
                       <ExternalLink size={16} className="text-gray-500 group-hover:text-syria-gold rtl:rotate-180" />
                     </a>
                   );
                 })}
              </div>
            )}
            
            {result.chunks.length === 0 && !loading && (
              <div className="text-center p-4 text-gray-500 text-sm">
                * No direct satellite links found for this specific query.
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="text-center py-12 opacity-50">
            <MapIcon size={64} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">{t('map.awaiting', language)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FutureMap;