
import React, { useState, useMemo } from 'react';
import { MapPin, Search, Users, ArrowRight, Shield, Briefcase, PieChart, TrendingUp, GraduationCap, User, Globe, Filter } from 'lucide-react';
import { t } from '../utils/translations';

const PROVINCES = [
  'Damascus', 'Rif Dimashq', 'Aleppo', 'Homs', 'Hama', 'Latakia', 'Tartus', 'Idlib', 'Al-Hasakah', 'Deir ez-Zor', 'Raqqa', 'As-Suwayda', 'Daraa', 'Quneitra'
];

interface CommunityMember {
  id: string;
  name: string;
  role: string;
  province: string;
  avatar: string;
  tags: string[];
  status: 'Online' | 'Offline';
  age: number;
  gender: 'Male' | 'Female';
}

interface CommunityDirectoryProps {
  language: string;
}

const ROLES = [
  'Urban Planner', 'AI Ethics Officer', 'Solar Architect', 'Heritage Restorer', 
  'Digital Educator', 'Vertical Farmer', 'Cyber Security Analyst', 'Quantum Researcher',
  'University Student', 'Medical Researcher'
];

const NAMES_FIRST = ['Ahmed', 'Sara', 'Omar', 'Layla', 'Youssef', 'Nour', 'Hassan', 'Mariam', 'Khaled', 'Rima', 'Tarek', 'Salma', 'Zain', 'Hala', 'Fadi', 'Rania'];
const NAMES_LAST = ['Al-Sayed', 'Hassan', 'Ibrahim', 'Khoury', 'Ali', 'Saleh', 'Hamad', 'Abboud', 'Darwish', 'Nasser', 'Suleiman', 'Makhlouf'];

const CommunityDirectory: React.FC<CommunityDirectoryProps> = ({ language }) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [search, setSearch] = useState('');
  
  const members = useMemo(() => {
    const data: Record<string, CommunityMember[]> = {};
    const usedIds = new Set<string>();
    const usedNames = new Set<string>();

    PROVINCES.forEach(p => {
      // Generate random number of members per province
      const count = Math.floor(Math.random() * 6) + 3; 
      const provinceMembers: CommunityMember[] = [];
      
      for (let i = 0; i < count; i++) {
        // Ensure strictly unique ID
        let id;
        do {
            id = `CIT-${Math.floor(100000000 + Math.random() * 900000000).toString()}`;
        } while (usedIds.has(id));
        usedIds.add(id);

        // Ensure strictly unique Name to prevent "duplicate accounts"
        let name;
        let attempts = 0;
        do {
            if (attempts > 50) {
               name = `Citizen ${Math.floor(Math.random() * 100000)}`;
            } else {
               const first = NAMES_FIRST[Math.floor(Math.random() * NAMES_FIRST.length)];
               const last = NAMES_LAST[Math.floor(Math.random() * NAMES_LAST.length)];
               name = `${first} ${last}`;
               // If name exists, try appending a middle initial or number to differentiate
               if (usedNames.has(name)) {
                   name = `${name} ${Math.floor(Math.random() * 99)}`;
               }
            }
            attempts++;
        } while (usedNames.has(name));
        usedNames.add(name);

        const gender = Math.random() > 0.5 ? 'Male' : 'Female';
        const role = ROLES[Math.floor(Math.random() * ROLES.length)];
        
        provinceMembers.push({
          id,
          name,
          role,
          province: p,
          age: Math.floor(Math.random() * (75 - 18) + 18),
          gender,
          avatar: `https://ui-avatars.com/api/?background=random&color=fff&name=${name.replace(' ', '+')}&size=128`,
          tags: Math.random() > 0.5 ? ['Verified', 'Contributor'] : ['Verified'],
          status: Math.random() > 0.3 ? 'Online' : 'Offline'
        });
      }
      data[p] = provinceMembers;
    });
    return data;
  }, []);

  const filteredMembers = useMemo(() => {
    let list: CommunityMember[] = [];
    if (selectedProvince === 'All') {
      list = Object.values(members).flat() as CommunityMember[];
    } else {
      list = members[selectedProvince] || [];
    }
    
    return list.filter(m => 
      m.role.toLowerCase().includes(search.toLowerCase()) || 
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [selectedProvince, members, search]);

  const stats = useMemo(() => {
    const allMembers = Object.values(members).flat() as CommunityMember[];
    const total = allMembers.length;
    
    return {
      total,
      women: allMembers.filter(m => m.gender === 'Female').length,
      men: allMembers.filter(m => m.gender === 'Male').length,
      students: allMembers.filter(m => m.role === 'University Student').length,
      ageGroups: {
        youth: allMembers.filter(m => m.age >= 18 && m.age <= 24).length,
        youngAdults: allMembers.filter(m => m.age >= 25 && m.age <= 40).length,
        adults: allMembers.filter(m => m.age >= 41 && m.age <= 60).length,
        seniors: allMembers.filter(m => m.age > 60).length,
      }
    };
  }, [members]);

  const provinceOptions = ['All', ...PROVINCES];

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-serif text-white mb-2">{t('comm.title', language)}</h2>
        <p className="text-syria-gold text-lg">{t('comm.subtitle', language)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {/* Sidebar Filter - Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md sticky top-24">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2 px-2">
              <Filter size={18} className="text-syria-gold" /> {t('comm.provinces', language)}
            </h3>
            <div className="space-y-1 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {provinceOptions.map(province => (
                <button
                  key={province}
                  onClick={() => setSelectedProvince(province)}
                  className={`w-full text-left rtl:text-right px-4 py-3 rounded-lg text-sm font-medium transition-all flex justify-between items-center group ${
                    selectedProvince === province
                      ? 'bg-syria-green text-white shadow-lg shadow-syria-green/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {province === 'All' && <Globe size={14} className={selectedProvince === 'All' ? 'text-white' : 'text-gray-500 group-hover:text-white'} />}
                    {province === 'All' ? (language === 'ar' ? 'كل المحافظات' : 'All Regions') : province}
                  </span>
                  {selectedProvince === province && <ArrowRight size={14} className="rtl:rotate-180" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {/* Mobile Filter Bar */}
          <div className="lg:hidden mb-6">
             <div className="flex items-center gap-2 mb-2 px-1">
               <Filter size={14} className="text-syria-gold" />
               <span className="text-xs font-bold text-gray-400 uppercase">{t('comm.provinces', language)}</span>
             </div>
             <div className="flex overflow-x-auto pb-4 gap-2 custom-scrollbar snap-x">
               {provinceOptions.map(province => (
                 <button
                   key={province}
                   onClick={() => setSelectedProvince(province)}
                   className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all snap-start border ${
                      selectedProvince === province 
                      ? 'bg-syria-green text-white border-syria-green shadow-lg shadow-syria-green/20' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                   }`}
                 >
                   {province === 'All' ? (language === 'ar' ? 'كل المحافظات' : 'All Regions') : province}
                 </button>
               ))}
             </div>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-4 rtl:right-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder={`${t('comm.search', language)} ${selectedProvince === 'All' ? '' : selectedProvince}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/20 rounded-xl py-4 pl-12 pr-4 rtl:pr-12 rtl:pl-4 text-white focus:outline-none focus:border-syria-gold focus:ring-1 focus:ring-syria-gold transition-all"
            />
          </div>

          <div className="flex justify-between items-end mb-6 px-2">
             <div>
               <h3 className="text-white font-bold text-xl flex items-center gap-2">
                 {selectedProvince === 'All' ? <Globe size={20} className="text-syria-gold"/> : <MapPin size={20} className="text-syria-gold"/>}
                 {selectedProvince === 'All' ? (language === 'ar' ? 'كل المحافظات' : 'All Regions') : selectedProvince}
               </h3>
             </div>
             <span className="text-syria-green font-mono text-sm bg-syria-green/10 px-3 py-1 rounded-full border border-syria-green/30">
               {filteredMembers.length} {language === 'ar' ? 'مواطن' : 'Citizens'}
             </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div key={member.id} className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden">
                   <div className="flex items-start justify-between mb-4">
                     <div className="relative">
                       <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full border-2 border-white/10 group-hover:border-syria-gold transition-colors" />
                       <div className={`absolute bottom-0 right-0 rtl:left-0 w-3 h-3 rounded-full border-2 border-black ${member.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                     </div>
                     <Shield className="text-syria-gold/50" size={20} />
                   </div>
                   
                   <h4 className="text-white font-bold text-lg">{member.name}</h4>
                   <div className="flex flex-col gap-1 mt-1 mb-3">
                      <div className="flex items-center gap-2 text-syria-gold text-xs font-medium">
                        <Briefcase size={12} /> {member.role}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <User size={12} /> {member.age} • {member.gender}
                      </div>
                   </div>
                   
                   <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10}/> {member.province}</span>
                      <button className="text-xs text-syria-green hover:text-white font-bold flex items-center gap-1">
                        {t('comm.connect', language)} <ArrowRight size={12} className="rtl:rotate-180" />
                      </button>
                   </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                <Users size={48} className="mx-auto mb-4 opacity-20" />
                <p>{t('comm.no_results', language)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 pt-12 border-t border-white/10">
        <h3 className="text-2xl text-white font-serif mb-8 flex items-center gap-3">
          <PieChart className="text-syria-gold" /> {t('comm.analytics', language)}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-syria-green/20 rounded-full text-syria-green">
              <Users size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase font-bold">{t('comm.total_citizens', language)}</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-2">
              <p className="text-gray-400 text-xs uppercase font-bold">{t('comm.gender', language)}</p>
              <Users size={16} className="text-syria-gold" />
            </div>
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-sm">
                 <span className="text-white">{t('stats.female', language)}</span>
                 <span className="text-syria-gold font-mono">{stats.women}</span>
              </div>
              <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-syria-red h-full" style={{ width: `${(stats.women / stats.total) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="text-white">{t('stats.male', language)}</span>
                 <span className="text-syria-gold font-mono">{stats.men}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase font-bold">{t('comm.students', language)}</p>
              <p className="text-2xl font-bold text-white">{stats.students}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
             <div className="flex justify-between items-start mb-3">
               <p className="text-gray-400 text-xs uppercase font-bold">{t('comm.age_groups', language)}</p>
               <TrendingUp size={16} className="text-syria-green" />
             </div>
             <div className="grid grid-cols-2 gap-2 text-xs">
               <div className="bg-black/30 p-2 rounded">
                 <span className="block text-gray-500 text-[10px]">18-24</span>
                 <span className="text-white font-bold">{stats.ageGroups.youth}</span>
               </div>
               <div className="bg-black/30 p-2 rounded">
                 <span className="block text-gray-500 text-[10px]">25-40</span>
                 <span className="text-white font-bold">{stats.ageGroups.youngAdults}</span>
               </div>
               <div className="bg-black/30 p-2 rounded">
                 <span className="block text-gray-500 text-[10px]">41-60</span>
                 <span className="text-white font-bold">{stats.ageGroups.adults}</span>
               </div>
               <div className="bg-black/30 p-2 rounded">
                 <span className="block text-gray-500 text-[10px]">60+</span>
                 <span className="text-white font-bold">{stats.ageGroups.seniors}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDirectory;
