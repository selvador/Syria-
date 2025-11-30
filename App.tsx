import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import StatsDashboard from './components/StatsDashboard';
import Government from './components/Government';
import VisionBoard from './components/VisionBoard';
import CitizenshipRegistration from './components/CitizenshipRegistration';
import CommunityDirectory from './components/CommunityDirectory';
import FutureMap from './components/FutureMap';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Handle Direction and Language attributes
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Optional: Add specific font class for Arabic
    if (language === 'ar') {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
  }, [language]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Hero setActiveTab={setActiveTab} language={language} />;
      case 'dashboard':
        return <StatsDashboard language={language} />;
      case 'government':
        return <Government language={language} />;
      case 'map':
        return <FutureMap language={language} />;
      case 'vision':
        return <VisionBoard language={language} />;
      case 'citizenship':
        return <CitizenshipRegistration language={language} />;
      case 'community':
        return <CommunityDirectory language={language} />;
      default:
        return <Hero setActiveTab={setActiveTab} language={language} />;
    }
  };

  return (
    <div className={`min-h-screen bg-syria-dark text-white font-sans selection:bg-syria-gold selection:text-syria-black ${language === 'ar' ? 'font-arabic' : ''}`}>
      <NavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        language={language}
        setLanguage={setLanguage}
      />
      <main className="transition-opacity duration-500 ease-in-out">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-syria-gold font-serif text-lg mb-2">
            {language === 'ar' ? 'الجمهورية العربية السورية • 2035' : 'The Syrian Arab Republic • 2035'}
          </p>
          <p className="text-gray-500 text-sm">
            {language === 'ar' ? 'وزارة التخطيط للمستقبل والتحول الرقمي' : 'Ministry of Future Planning & Digital Transformation'}
            <br />
            {language === 'ar' ? 'تم بناؤه بواسطة الذكاء الاصطناعي Gemini' : 'Built with Gemini Artificial Intelligence'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;