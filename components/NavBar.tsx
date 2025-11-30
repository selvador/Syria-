

import React, { useState, useRef, useEffect } from 'react';
import { Home, BarChart3, Building2, Camera, UserPlus, Users, Globe, ChevronDown, Map, PartyPopper } from 'lucide-react';
import { t } from '../utils/translations';

interface NavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇾' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

const NavBar: React.FC<NavBarProps> = ({ activeTab, setActiveTab, language, setLanguage }) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'home', label: t('nav.home', language), icon: Home },
    { id: 'dashboard', label: t('nav.stats', language), icon: PartyPopper },
    { id: 'government', label: t('nav.gov', language), icon: Building2 },
    { id: 'map', label: t('nav.map', language), icon: Map },
    { id: 'vision', label: t('nav.vision', language), icon: Camera },
    { id: 'community', label: t('nav.community', language), icon: Users },
    { id: 'citizenship', label: t('nav.citizenship', language), icon: UserPlus },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === language) || languages[1];

  // Syrian Flag Component using CSS (Green-White-Black with 3 Red Stars)
  const SyrianFlagIcon = () => (
    <div className="w-10 h-7 rounded shadow-md overflow-hidden relative border border-white/20">
      <div className="absolute top-0 w-full h-1/3 bg-syria-green"></div>
      <div className="absolute top-1/3 w-full h-1/3 bg-white flex items-center justify-center gap-1">
        <div className="text-syria-red text-[8px] leading-none">★</div>
        <div className="text-syria-red text-[8px] leading-none">★</div>
        <div className="text-syria-red text-[8px] leading-none">★</div>
      </div>
      <div className="absolute bottom-0 w-full h-1/3 bg-black"></div>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-syria-black/90 to-purple-900/90 backdrop-blur-md border-b border-white/10 transition-all duration-300 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <SyrianFlagIcon />
            <div className={language === 'ar' ? 'font-arabic' : ''}>
              <h1 className="text-xl font-serif font-bold text-white tracking-widest group-hover:text-syria-gold transition-colors">SYRIA <span className="text-syria-gold">2035</span></h1>
              <p className="text-[10px] text-pink-300 uppercase tracking-widest group-hover:text-white transition-colors">{t('app.subtitle', language)}</p>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-baseline space-x-1 rtl:space-x-reverse">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 text-syria-gold shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-white/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Language Switcher */}
            <div className="relative ml-2" ref={langMenuRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 transition-all"
              >
                <Globe size={16} className="text-syria-gold" />
                <span className="hidden xl:inline">{currentLang.name}</span>
                <span className="xl:hidden">{currentLang.code.toUpperCase()}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-48 bg-purple-900/95 border border-white/20 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 backdrop-blur-xl">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left rtl:text-right px-4 py-2 text-sm flex items-center gap-3 hover:bg-white/10 transition-colors ${
                        language === lang.code ? 'text-syria-gold bg-white/5' : 'text-gray-300'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className={lang.code === 'ar' ? 'font-arabic' : ''}>{lang.name}</span>
                      {language === lang.code && <div className="ml-auto rtl:mr-auto w-1.5 h-1.5 rounded-full bg-syria-green"></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button (Simplified for demo) */}
          <div className="lg:hidden flex items-center gap-4">
             <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="p-2 text-gray-300"
              >
                <Globe size={20} className="text-syria-gold" />
              </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Language Menu Overlay */}
      {isLangOpen && (
         <div className="lg:hidden absolute top-20 left-0 w-full bg-purple-900/95 backdrop-blur-md border-b border-white/10 p-4 grid grid-cols-2 gap-2 animate-in slide-in-from-top-5 shadow-2xl">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsLangOpen(false);
                }}
                className={`flex items-center gap-2 p-3 rounded-lg border ${
                  language === lang.code ? 'border-syria-gold bg-syria-gold/20 text-syria-gold' : 'border-white/10 text-gray-300'
                }`}
              >
                <span>{lang.flag}</span>
                <span className={lang.code === 'ar' ? 'font-arabic' : ''}>{lang.name}</span>
              </button>
            ))}
         </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden flex justify-around py-3 bg-syria-black/95 backdrop-blur-lg border-t border-white/10 fixed bottom-0 left-0 right-0 z-50 pb-safe">
         {navItems.slice(0, 5).map((item) => (
           <button key={item.id} onClick={() => setActiveTab(item.id)} className={`p-2 flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-syria-gold scale-110' : 'text-gray-400'}`}>
             <item.icon size={22} />
             <span className="text-[10px] font-medium opacity-80">{item.label}</span>
           </button>
         ))}
      </div>
    </nav>
  );
};

export default NavBar;