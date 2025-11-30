
import React, { useState } from 'react';
import { generateVisionImage } from '../services/geminiService';
import { Camera, RefreshCw, Download } from 'lucide-react';
import { t } from '../utils/translations';

interface VisionBoardProps {
  language: string;
}

const VisionBoard: React.FC<VisionBoardProps> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    "Futuristic Aleppo Citadel with drones",
    "Umayyad Mosque 2035 restoration",
    "Lattakia solar-powered beach resort",
    "High-tech Damascus business district"
  ];

  const handleGenerate = async (selectedPrompt: string = prompt) => {
    if (!selectedPrompt) return;
    setLoading(true);
    const result = await generateVisionImage(selectedPrompt);
    setImage(result);
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-4xl font-serif text-white mb-4">{t('vis.title', language)}</h2>
          <p className="text-gray-400 mb-8 text-lg">{t('vis.desc', language)}</p>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm mb-8">
            <label className="block text-syria-gold text-sm font-bold uppercase tracking-wider mb-3">Project Description</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-black/40 border border-white/20 rounded-lg p-4 text-white min-h-[120px] focus:outline-none focus:border-syria-green transition-colors"
              placeholder={t('vis.placeholder', language)}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {presets.map(p => (
                <button 
                  key={p}
                  onClick={() => { setPrompt(p); handleGenerate(p); }}
                  className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleGenerate()}
              disabled={loading || !prompt}
              className="w-full mt-6 bg-gradient-to-r from-syria-green to-emerald-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-900/50 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Camera />}
              {loading ? 'Rendering...' : t('vis.generate', language)}
            </button>
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-2xl p-2 h-[500px] flex items-center justify-center relative group overflow-hidden">
          {image ? (
            <>
              <img src={image} alt="Generated Vision" className="w-full h-full object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                 <a href={image} download="syria-2035-vision.png" className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200">
                   <Download size={18} /> Save Blueprint
                 </a>
              </div>
            </>
          ) : (
            <div className="text-center p-8">
              {loading ? (
                <div className="flex flex-col items-center">
                   <div className="w-16 h-16 border-4 border-syria-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="text-syria-gold animate-pulse">Computing light rays...</p>
                </div>
              ) : (
                <div className="text-gray-600">
                  <Camera size={64} className="mx-auto mb-4 opacity-20" />
                  <p>Awaiting Input Parameters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisionBoard;
