

import React, { useEffect, useState } from 'react';
import { generateFutureNews } from '../services/geminiService';
import { ArrowRight, Sparkles } from 'lucide-react';
import { NewsArticle } from '../types';
import { t } from '../utils/translations';

interface HeroProps {
  setActiveTab: (tab: string) => void;
  language: string;
}

const Hero: React.FC<HeroProps> = ({ setActiveTab, language }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const raw = await generateFutureNews();
      try {
        const parsed = JSON.parse(raw);
        setNews(parsed.slice(0, 3));
      } catch (e) {
        console.error("Failed to parse news", e);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
      {/* Background Gradient & Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(#FFD166 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 mb-8 animate-fade-in-down shadow-[0_0_15px_rgba(255,255,255,0.2)] backdrop-blur-md">
            <Sparkles size={18} className="text-syria-gold animate-pulse-fast" />
            <span className="text-white text-sm uppercase tracking-widest font-bold">{t('hero.welcome', language)}</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-syria-light to-syria-gold mb-6 leading-tight drop-shadow-2xl">
          {t('hero.title', language)}
        </h1>
        
        <p className="mt-6 text-xl md:text-2xl text-pink-100 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
          {t('hero.desc', language)}
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <button 
            onClick={() => setActiveTab('vision')}
            className="px-10 py-5 bg-syria-gold text-syria-black font-bold rounded-2xl shadow-[0_0_20px_rgba(255,209,102,0.4)] hover:shadow-[0_0_40px_rgba(255,209,102,0.6)] transition-all transform hover:-translate-y-1 hover:scale-105 flex items-center gap-2 text-lg border-2 border-syria-gold">
            {t('hero.btn.vision', language)} <ArrowRight size={22} className="rtl:rotate-180" />
          </button>
          <button 
            onClick={() => setActiveTab('citizenship')}
            className="px-10 py-5 bg-white/10 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all backdrop-blur-md text-lg hover:scale-105 hover:border-white">
            {t('hero.btn.citizen', language)}
          </button>
        </div>
      </div>

      {/* News Ticker */}
      <div className="absolute bottom-0 w-full bg-syria-black/40 backdrop-blur-md border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
           <div className="flex gap-8 animate-marquee whitespace-nowrap">
              {news.length === 0 ? (
                <span className="text-pink-300 flex items-center gap-2"><Sparkles size={14}/> {t('hero.ticker.loading', language)}</span>
              ) : (
                [...news, ...news].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-sm">
                    <span className="text-syria-black bg-syria-gold font-bold uppercase text-xs px-2 py-1 rounded-md">{item.category}</span>
                    <span className="text-white font-medium shadow-black drop-shadow-md">{item.title}</span>
                    <span className="text-syria-red mx-4 rtl:mx-4">♥</span>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;