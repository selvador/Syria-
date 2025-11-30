

import React, { useState, useRef } from 'react';
import { Citizen, MediaItem } from '../types';
import { generateVisionImage } from '../services/geminiService';
import { 
  Shield, User, MapPin, Briefcase, Phone, Mail, CheckCircle, 
  Loader2, Lock, Fingerprint, CreditCard, ArrowRight, Camera, 
  Image as ImageIcon, Video, Edit2, Save, Share2, Grid, Layout, Link as LinkIcon,
  GraduationCap, Trash2, Plus, PlayCircle, AlertTriangle, Calendar, Home, Hammer, Sparkles, Dices, Smile
} from 'lucide-react';
import { t } from '../utils/translations';

interface CitizenshipRegistrationProps {
  language: string;
}

const PROVINCES = [
  'Damascus', 'Rif Dimashq', 'Aleppo', 'Homs', 'Hama', 'Latakia', 'Tartus', 'Idlib', 'Al-Hasakah', 'Deir ez-Zor', 'Raqqa', 'As-Suwayda', 'Daraa', 'Quneitra'
];

const COUNTRIES = [
  'Syria', 'Lebanon', 'Jordan', 'Iraq', 'Turkey', 'Egypt', 'UAE', 'Saudi Arabia', 'France', 'Germany', 'USA', 'United Kingdom', 'Russia', 'China', 'Other'
];

const FUN_PROMPTS = [
  "A flying shawarma house in Damascus attached to colorful balloons",
  "A cozy hobbit hole in the mountains of Latakia covered in jasmine flowers",
  "A futuristic glass treehouse in the middle of Aleppo's public park",
  "A purple crystal castle in Homs that glows at night",
  "A floating houseboat on the Euphrates with a water slide",
  "A cyberpunk cafe that is also a house in downtown Damascus",
  "A house made entirely of pistachio baklava and happiness",
  "A cloud palace floating over Mount Qasioun",
  "A retro-futuristic van life setup in the desert of Palmyra"
];

const CitizenshipRegistration: React.FC<CitizenshipRegistrationProps> = ({ language }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'timeline' | 'media' | 'id' | 'housing'>('housing');
  const [isEditing, setIsEditing] = useState(false);
  
  const [generatingHouse, setGeneratingHouse] = useState(false);
  const [housePrompt, setHousePrompt] = useState('');
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Citizen>({
    firstName: '',
    familyName: '',
    email: '',
    dob: '',
    province: 'Damascus',
    neighborhood: '',
    street: '',
    occupation: '',
    phone: '',
    currentResidence: 'Syria',
    citizenId: '',
    registrationDate: '',
    educationLevel: 'Bachelor\'s Degree',
    bio: 'Proud citizen of the New Syrian Republic. Contributing to the vision of 2035 through innovation and heritage preservation.',
    media: [
      {
        id: '1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1565610222536-ef125c59da2c?q=80&w=800&auto=format&fit=crop',
        date: '2035-01-15',
        caption: 'Sunset in Old Damascus'
      },
      {
        id: '2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1548018566-6415053c7c44?q=80&w=800&auto=format&fit=crop',
        date: '2035-02-01',
        caption: 'The Citadel'
      }
    ],
    avatarUrl: '',
    coverUrl: 'https://images.unsplash.com/photo-1548018566-6415053c7c44?q=80&w=2000&auto=format&fit=crop'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'currentResidence') {
        if (e.target.value !== 'Syria') {
            setError(t('cit.error.country', language));
        } else {
            setError('');
        }
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.currentResidence !== 'Syria') {
      setError(t('cit.error.country', language));
      return;
    }

    if (!formData.email || !formData.firstName || !formData.familyName) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      if (verificationCode.length === 6) {
        setLoading(false);
        const randomId = 'SYR-' + Math.floor(10000000 + Math.random() * 90000000);
        setFormData(prev => ({ 
          ...prev, 
          citizenId: randomId,
          registrationDate: new Date().toLocaleDateString(),
          avatarUrl: prev.avatarUrl || `https://ui-avatars.com/api/?name=${prev.firstName}+${prev.familyName}&background=random&color=fff&size=200`
        }));
        setStep(3);
      } else {
        setLoading(false);
        setError('Invalid verification code.');
      }
    }, 1500);
  };

  const handleHouseBuild = async () => {
    if (!housePrompt) return;
    setGeneratingHouse(true);
    // Add "Happy" keywords to enforce the tone
    const prompt = `Architectural design of a whimsical, happy, colorful house in Syria 2035. ${housePrompt}. Bright candy colors, futuristic solar punk style, utopian, detailed, happy vibes, cinematic lighting, magical realism.`;
    const imageUrl = await generateVisionImage(prompt);
    if (imageUrl) {
        setFormData(prev => ({ ...prev, houseUrl: imageUrl }));
    }
    setGeneratingHouse(false);
  };

  const handleSurpriseMe = () => {
    const randomPrompt = FUN_PROMPTS[Math.floor(Math.random() * FUN_PROMPTS.length)];
    setHousePrompt(randomPrompt);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatarUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          coverUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem: MediaItem = {
          id: Date.now().toString(),
          type,
          url: reader.result as string,
          date: new Date().toLocaleDateString(),
          caption: 'New Upload'
        };
        setFormData(prev => ({
          ...prev,
          media: [newItem, ...(prev.media || [])]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = (id: string) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media?.filter(item => item.id !== id)
    }));
  };

  // Syrian Flag Component using CSS
  const SyrianFlagIcon = () => (
    <div className="w-12 h-8 rounded overflow-hidden relative border border-white/20 shadow-md">
      <div className="absolute top-0 w-full h-1/3 bg-syria-green"></div>
      <div className="absolute top-1/3 w-full h-1/3 bg-white flex items-center justify-center gap-1">
        <div className="text-syria-red text-[10px] leading-none">★</div>
        <div className="text-syria-red text-[10px] leading-none">★</div>
        <div className="text-syria-red text-[10px] leading-none">★</div>
      </div>
      <div className="absolute bottom-0 w-full h-1/3 bg-black"></div>
    </div>
  );

  const renderDigitalID = () => (
    <div className="relative w-full max-w-[480px] aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl border border-white/20 group perspective-1000 mx-auto transition-transform hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-br from-syria-dark to-purple-800 z-0"></div>
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="relative z-20 p-6 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
             <SyrianFlagIcon />
             <div>
               <h4 className="text-syria-gold font-serif font-bold text-lg leading-none">{t('cit.card_title', language)}</h4>
               <p className="text-[10px] text-pink-300 tracking-widest uppercase mt-1">{t('cit.card_sub', language)}</p>
             </div>
          </div>
          <CreditCard className="text-white/20" size={32} />
        </div>
        <div className="flex items-end gap-6">
          <div className="w-24 h-32 bg-gray-300 rounded-lg overflow-hidden border-2 border-syria-gold/50 shadow-inner flex items-center justify-center bg-cover bg-center" style={{backgroundImage: `url(${formData.avatarUrl})`}}></div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-[10px] text-gray-400 uppercase">{t('cit.fname', language)} & {t('cit.lname', language)}</p>
              <p className="text-white font-bold text-lg font-serif">{formData.firstName} {formData.familyName}</p>
            </div>
            <div className="flex justify-between">
               <div>
                 <p className="text-[10px] text-gray-400 uppercase">{t('cit.id', language)}</p>
                 <p className="text-syria-gold font-mono tracking-wide">{formData.citizenId}</p>
               </div>
               <div className="text-right rtl:text-left">
                 <p className="text-[10px] text-gray-400 uppercase">{t('cit.prov', language)}</p>
                 <p className="text-white text-sm">{formData.province}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (step === 4) {
    return (
      <div className="pt-20 min-h-screen font-sans">
        {/* Immersive Cover */}
        <div className="h-80 md:h-96 w-full relative overflow-hidden">
          <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover animate-in fade-in duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-syria-dark via-transparent to-transparent"></div>
          {isEditing && (
            <>
              <button onClick={() => coverInputRef.current?.click()} className="absolute top-24 right-4 rtl:left-4 bg-black/60 hover:bg-black/80 p-2.5 rounded-full text-white backdrop-blur-md z-10 border border-white/20 transition-all"><Camera size={20} /></button>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </>
          )}
        </div>

        {/* Floating Profile Card */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-32">
          <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-end gap-8 animate-in slide-in-from-bottom-8 duration-700">
            <div className="relative group flex-shrink-0 mx-auto md:mx-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-syria-dark bg-syria-dark overflow-hidden shadow-2xl relative">
                <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                {isEditing && (
                  <div onClick={() => avatarInputRef.current?.click()} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera size={32} className="text-white" />
                  </div>
                )}
              </div>
              <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
              <div className="absolute bottom-2 right-2 rtl:left-2 bg-syria-green text-white p-1.5 rounded-full border-2 border-syria-dark shadow-lg">
                <CheckCircle size={16} />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left rtl:md:text-right pb-2">
               <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-syria-gold mb-2">
                 {formData.firstName} {formData.familyName}
               </h1>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-200 text-sm md:text-base mb-4">
                   <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10"><Briefcase size={16} className="text-syria-gold" /> {formData.occupation}</div>
                   <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10"><MapPin size={16} className="text-syria-green" /> {formData.currentResidence}, {formData.province}</div>
                   <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10"><Calendar size={16} className="text-syria-light" /> Joined {new Date().getFullYear()}</div>
               </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
               <button onClick={() => setIsEditing(!isEditing)} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${isEditing ? 'bg-syria-green text-white hover:bg-emerald-600' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}>
                 {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                 {isEditing ? 'Save' : 'Edit'}
               </button>
               {!isEditing && (
                 <button className="px-4 py-3 bg-gradient-to-r from-syria-gold to-orange-500 text-white rounded-xl hover:shadow-[0_0_20px_rgba(255,183,3,0.5)] transition-all shadow-lg">
                   <Share2 size={20} />
                 </button>
               )}
            </div>
          </div>
          
          {/* Tabs Navigation */}
          <div className="mt-12 border-b border-white/10 flex gap-8 justify-center md:justify-start overflow-x-auto">
            {[
                { id: 'timeline', label: t('cit.timeline', language), icon: Layout }, 
                { id: 'media', label: t('cit.gallery', language), icon: Grid }, 
                { id: 'housing', label: t('cit.housing.title', language), icon: Home },
                { id: 'id', label: t('cit.id', language), icon: CreditCard }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`pb-4 px-2 flex items-center gap-2 text-sm md:text-base font-bold transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-syria-gold scale-105' : 'text-gray-400 hover:text-white'}`}
              >
                <tab.icon size={18} /> {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-syria-gold to-syria-red rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>}
              </button>
            ))}
          </div>

          <div className="py-12 min-h-[400px]">
            {activeTab === 'timeline' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="lg:col-span-2 space-y-6">
                  {/* Bio Section */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:bg-white/10 transition-colors">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       <User size={100} className="text-syria-gold"/>
                     </div>
                     <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">About Me</h3>
                     {isEditing ? (
                      <textarea 
                        name="bio" 
                        value={formData.bio} 
                        onChange={handleChange} 
                        className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-gray-200 focus:border-syria-gold outline-none h-40 text-lg leading-relaxed"
                      />
                    ) : (
                      <p className="text-gray-200 text-lg leading-relaxed font-light">{formData.bio}</p>
                    )}
                  </div>

                  {/* Achievements */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                     <h3 className="text-xl font-bold text-white mb-6">Badges & Fun Stuff</h3>
                     <div className="flex flex-wrap gap-4">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 text-white shadow-md transform hover:scale-105 transition-transform cursor-default">
                           <Shield size={16} /> <span>Dreamer</span>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 text-white shadow-md transform hover:scale-105 transition-transform cursor-default">
                           <Fingerprint size={16} /> <span>Citizen</span>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 text-white shadow-md transform hover:scale-105 transition-transform cursor-default">
                           <GraduationCap size={16} /> <span>Smarty Pants</span>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Details</h3>
                      <div className="space-y-4">
                         <div>
                            <span className="text-xs text-pink-300 uppercase font-bold">Education</span>
                            <p className="text-white">{formData.educationLevel}</p>
                         </div>
                         <div>
                            <span className="text-xs text-pink-300 uppercase font-bold">Contact</span>
                            <p className="text-white">{formData.email}</p>
                         </div>
                         <div>
                            <span className="text-xs text-pink-300 uppercase font-bold">Province</span>
                            <p className="text-white">{formData.province}</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
            
            {activeTab === 'media' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-white text-2xl font-serif">Happy Memories</h3>
                  {isEditing && (
                    <div className="flex gap-3">
                       <button onClick={() => photoInputRef.current?.click()} className="px-4 py-2 bg-syria-gold/20 text-syria-gold border border-syria-gold/30 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors hover:bg-syria-gold/30">
                         <ImageIcon size={16} /> Add Photo
                       </button>
                       <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleMediaUpload(e, 'image')} />
                       
                       <button onClick={() => videoInputRef.current?.click()} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                         <Video size={16} /> Add Video
                       </button>
                       <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleMediaUpload(e, 'video')} />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {formData.media && formData.media.length > 0 ? (
                     formData.media.map((item) => (
                       <div key={item.id} className="relative aspect-square group rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-lg cursor-pointer transform hover:scale-105 transition-all">
                          {item.type === 'image' ? (
                            <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full relative">
                               <video src={item.url} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                 <PlayCircle size={40} className="text-white opacity-80" />
                               </div>
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                             <p className="text-white font-bold truncate">{item.caption}</p>
                             <p className="text-pink-300 text-xs mt-1">{item.date}</p>
                          </div>

                          {isEditing && (
                            <button 
                              onClick={() => removeMedia(item.id)}
                              className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                       </div>
                     ))
                   ) : (
                     <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                       <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
                       <p className="text-lg">No media uploaded yet.</p>
                     </div>
                   )}
                   
                   {isEditing && (
                     <div 
                       onClick={() => photoInputRef.current?.click()}
                       className="aspect-square rounded-2xl border-2 border-dashed border-white/20 hover:border-syria-gold hover:bg-syria-gold/10 transition-all cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-syria-gold group"
                     >
                       <Plus size={40} className="mb-3 group-hover:rotate-90 transition-transform" />
                       <span className="text-sm font-bold">Add Media</span>
                     </div>
                   )}
                </div>
              </div>
            )}

            {activeTab === 'housing' && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-gradient-to-br from-white/10 to-purple-900/40 border border-white/20 rounded-3xl p-8 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden ring-4 ring-white/5">
                        
                        {/* Decorative blobs */}
                        <div className="absolute -top-20 -left-20 w-60 h-60 bg-syria-gold/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
                        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-syria-red/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

                        {!formData.houseUrl ? (
                            <>
                                <div className="w-24 h-24 bg-gradient-to-br from-syria-gold to-syria-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-110 transition-transform hover:rotate-12 duration-300">
                                   <Home size={40} className="text-white" />
                                </div>
                                <h3 className="text-4xl font-serif text-white mb-2 drop-shadow-lg">{t('cit.housing.title', language)}</h3>
                                <p className="text-syria-gold mb-8 text-xl font-light">{t('cit.housing.subtitle', language)}</p>
                                
                                <div className="max-w-2xl mx-auto bg-black/30 p-6 rounded-3xl border border-white/10 backdrop-blur-sm relative">
                                    <div className="relative">
                                      <textarea
                                          value={housePrompt}
                                          onChange={(e) => setHousePrompt(e.target.value)}
                                          placeholder={t('cit.housing.placeholder', language)}
                                          className="w-full bg-white/5 border border-white/20 rounded-2xl p-5 text-white focus:border-syria-gold outline-none h-40 mb-4 text-lg placeholder-gray-400 focus:bg-white/10 transition-all"
                                      />
                                      <button 
                                        onClick={handleSurpriseMe}
                                        className="absolute bottom-6 right-2 p-3 text-syria-gold hover:text-white bg-black/40 hover:bg-syria-red rounded-full transition-all flex items-center gap-2 text-sm font-bold hover:scale-110 active:scale-95"
                                        title="Surprise Me!"
                                      >
                                        <Dices size={20} /> <span className="hidden sm:inline">{t('cit.housing.surprise', language)}</span>
                                      </button>
                                    </div>

                                    <button
                                        onClick={handleHouseBuild}
                                        disabled={generatingHouse || !housePrompt}
                                        className="w-full bg-gradient-to-r from-syria-red to-purple-600 text-white font-bold py-5 rounded-2xl hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all flex justify-center items-center gap-3 disabled:opacity-50 text-xl shadow-xl transform active:scale-95 hover:-translate-y-1"
                                    >
                                        {generatingHouse ? <Loader2 className="animate-spin" /> : <Hammer size={24} className="animate-bounce" />} 
                                        {generatingHouse ? t('vis.rendering', language) : t('cit.housing.generate', language)}
                                    </button>
                                    <p className="text-xs text-gray-400 mt-4 italic flex items-center justify-center gap-1">
                                      <Smile size={12}/> Powered by Happy AI Magic ✨
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="relative group animate-in zoom-in duration-500">
                                <div className="flex items-center justify-center gap-2 mb-6 text-white bg-gradient-to-r from-syria-green to-emerald-600 py-3 px-8 rounded-full inline-flex shadow-lg transform -rotate-2 hover:rotate-0 transition-all cursor-default">
                                     <Sparkles size={20} className="animate-spin-slow" /> 
                                     <span className="font-bold text-lg uppercase tracking-wider">{t('cit.housing.generated', language)}</span>
                                </div>
                                <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 relative group-hover:border-syria-gold transition-colors">
                                    <img src={formData.houseUrl} alt="Dream House" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                                        <div className="flex items-end justify-between">
                                            <div className="text-left">
                                                <p className="text-syria-gold text-xs uppercase font-bold tracking-widest mb-1">My Dream Home</p>
                                                <h3 className="text-white font-serif text-3xl font-bold">{t('cit.housing.title', language)}</h3>
                                                <p className="text-gray-300 mt-2 line-clamp-2 max-w-2xl">{housePrompt}</p>
                                            </div>
                                            <button className="bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-colors text-white border border-white/20 hover:scale-110 transform">
                                                <Share2 size={24} />
                                            </button>
                                        </div>
                                     </div>
                                </div>
                                <button 
                                    onClick={() => setFormData(prev => ({...prev, houseUrl: undefined}))}
                                    className="mt-8 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/10 hover:border-syria-gold hover:text-syria-gold"
                                >
                                    Build another dream! 🏰
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {activeTab === 'id' && (
              <div className="flex flex-col items-center py-12 animate-in zoom-in duration-500">
                {renderDigitalID()}
                <div className="mt-8 flex gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors">
                    <Fingerprint size={20} /> Privacy
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-syria-gold text-syria-black rounded-xl font-bold transition-colors hover:bg-yellow-400">
                     <LinkIcon size={20} /> Share ID
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-syria-gold via-white to-syria-gold mb-4 font-bold tracking-tight drop-shadow-lg">{t('cit.title', language)}</h2>
        <p className="text-pink-300 text-2xl font-light">{t('cit.subtitle', language)}</p>
      </div>

      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl relative ring-1 ring-white/10">
        <div className="p-8 md:p-12">
          {step === 1 && (
            <form onSubmit={handleInitialSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                <div className="w-12 h-12 rounded-full bg-syria-green flex items-center justify-center text-white shadow-lg shadow-syria-green/30 animate-bounce-slow"><User size={24} /></div>
                <div>
                  <h3 className="text-2xl text-white font-bold">{t('cit.personal', language)}</h3>
                  <p className="text-sm text-gray-300">{t('cit.personal.desc', language)}</p>
                </div>
              </div>
              <div className="mb-8 flex items-center gap-6 p-6 bg-black/20 rounded-2xl border border-white/10">
                <div className="w-24 h-24 rounded-full bg-black/40 flex items-center justify-center overflow-hidden border-4 border-syria-gold/30 shadow-inner">
                  {formData.avatarUrl ? <img src={formData.avatarUrl} className="w-full h-full object-cover" /> : <User size={40} className="text-gray-500" />}
                </div>
                <div>
                  <button type="button" onClick={() => avatarInputRef.current?.click()} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-syria-red to-pink-600 hover:from-pink-500 hover:to-syria-red rounded-xl text-sm font-bold text-white transition-all shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5">
                    <Camera size={16} /> {t('cit.upload_photo', language)}
                  </button>
                  <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>
              </div>

              {formData.currentResidence !== 'Syria' && formData.currentResidence !== '' && (
                <div className="mb-6 bg-red-500/20 border border-red-500/40 p-4 rounded-xl flex items-center gap-3 animate-in fade-in">
                  <AlertTriangle className="text-red-400 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="text-white font-bold text-sm">Sorry!</h4>
                    <p className="text-pink-200 text-sm">{t('cit.error.country', language)}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-syria-gold uppercase mb-2 tracking-wider">{t('cit.country', language)}</label>
                  <select 
                    name="currentResidence" 
                    value={formData.currentResidence} 
                    onChange={handleChange} 
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white focus:border-syria-gold outline-none appearance-none hover:bg-black/50 transition-colors"
                  >
                    {COUNTRIES.map(c => <option key={c} value={c} className="bg-syria-dark text-white">{c}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-bold text-syria-gold uppercase mb-2 tracking-wider">{t('cit.fname', language)}</label><input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white focus:border-syria-gold outline-none" /></div>
                <div><label className="block text-xs font-bold text-syria-gold uppercase mb-2 tracking-wider">{t('cit.lname', language)}</label><input required name="familyName" value={formData.familyName} onChange={handleChange} type="text" className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white focus:border-syria-gold outline-none" /></div>
                <div><label className="block text-xs font-bold text-syria-gold uppercase mb-2 tracking-wider">{t('cit.dob', language)}</label><input required name="dob" value={formData.dob} onChange={handleChange} type="date" className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white focus:border-syria-gold outline-none" /></div>
                <div><label className="block text-xs font-bold text-syria-gold uppercase mb-2 tracking-wider">{t('cit.occ', language)}</label><input required name="occupation" value={formData.occupation} onChange={handleChange} type="text" className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white focus:border-syria-gold outline-none" /></div>
                <div>
                    <label className="block text-xs font-bold text-syria-gold uppercase mb-2 tracking-wider">{t('cit.prov', language)}</label>
                    <select name="province" value={formData.province} onChange={handleChange} className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white focus:border-syria-gold outline-none appearance-none">
                        {PROVINCES.map(p => <option key={p} value={p} className="bg-syria-dark text-white">{p}</option>)}
                    </select>
                </div>
                <div><label className="block text-xs font-bold text-syria-gold uppercase mb-2 tracking-wider">{t('cit.email', language)}</label><input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-black/40 border border-white/20 rounded-xl p-4 text-white focus:border-syria-gold outline-none" /></div>
              </div>
              <div className="mt-8 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading || formData.currentResidence !== 'Syria'} 
                  className="bg-gradient-to-r from-syria-gold to-orange-500 text-syria-black font-bold py-4 px-10 rounded-xl hover:shadow-[0_0_20px_rgba(255,183,3,0.5)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-xl transform hover:-translate-y-1 active:translate-y-0"
                >
                  {loading ? <Loader2 className="animate-spin" /> : t('cit.verify', language)} {!loading && <ArrowRight size={20} className="rtl:rotate-180" />}
                </button>
              </div>
            </form>
          )}
          {step === 2 && (
             <div className="max-w-md mx-auto animate-in zoom-in duration-300 text-center">
               <div className="w-20 h-20 bg-syria-green/20 rounded-full flex items-center justify-center mx-auto mb-4 text-syria-green animate-bounce">
                 <Mail size={40} />
               </div>
               <h3 className="text-3xl font-serif text-white mb-2">{t('cit.code_sent', language)}</h3>
               <p className="text-gray-300 mb-8">We sent a magic code to your email!</p>
               <form onSubmit={handleVerification} className="mt-6"><input type="text" maxLength={6} value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="w-full bg-black/50 border border-white/30 text-center text-5xl p-6 rounded-2xl text-white tracking-widest focus:border-syria-green focus:ring-1 focus:ring-syria-green outline-none" /><button type="submit" className="w-full mt-6 bg-syria-green text-white font-bold py-4 rounded-xl text-lg hover:shadow-lg hover:bg-emerald-500 transition-all">{t('cit.verify', language)}</button></form>
             </div>
          )}
          {step === 3 && (
            <div className="animate-in fade-in duration-700 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-8 text-syria-green bg-syria-green/10 px-6 py-2 rounded-full border border-syria-green/20"><CheckCircle size={24} /><span className="font-bold text-xl">{t('cit.verified', language)}</span></div>
              {renderDigitalID()}
              <div className="mt-12"><button onClick={() => setStep(4)} className="px-10 py-4 bg-gradient-to-r from-syria-gold to-orange-500 text-white font-bold rounded-2xl text-lg shadow-xl hover:scale-105 transition-transform">{t('cit.profile', language)}</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenshipRegistration;