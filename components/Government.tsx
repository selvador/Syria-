
import React, { useState } from 'react';
import { 
  Building2, Gavel, ShieldCheck, Landmark, ArrowRight, ArrowLeft, 
  Users, FileText, Bell, Siren, MapPin, ExternalLink, Bot,
  Camera, BarChart, Zap, Radio, Globe, HeartPulse, GraduationCap, 
  Sprout, Factory, Lightbulb, Droplets, Plane, Train, Wallet, Scale,
  BookOpen, Music, ShoppingCart, Tv, Flag, Leaf, FileBadge,
  MessageSquare, MessageCircle, Send, ThumbsUp, Share2, Image
} from 'lucide-react';
import MinistryChat from './MinistryChat';
import { MinistryType } from '../types';
import { t } from '../utils/translations';

type ViewType = 'hub' | 'parliament' | 'police' | 'ministry_detail' | 'ai_chat' | 'forum';

interface GovernmentProps {
  language: string;
}

const PROVINCES = [
  'Damascus', 'Rif Dimashq', 'Aleppo', 'Homs', 'Hama', 'Latakia', 'Tartus', 'Idlib', 'Al-Hasakah', 'Deir ez-Zor', 'Raqqa', 'As-Suwayda', 'Daraa', 'Quneitra'
];

const getMinistries = (lang: string) => [
  {
    id: 'defense',
    type: 'Ministry of Defense',
    name: lang === 'ar' ? 'وزارة الدفاع' : 'Ministry of Defense',
    icon: ShieldCheck,
    description: lang === 'ar' ? 'حماية السيادة الوطنية والأمن السيبراني.' : 'Protecting national sovereignty and cyber-borders.',
    news: ['Iron Dome 2.0 deployed.', 'Cyber-defense academy opens in Homs.'],
    services: ['Service Records', 'Cyber Enlistment']
  },
  {
    id: 'foreign',
    type: 'Ministry of Foreign Affairs',
    name: lang === 'ar' ? 'وزارة الخارجية والمغتربين' : 'Ministry of Foreign Affairs',
    icon: Globe,
    description: lang === 'ar' ? 'تعزيز العلاقات الدبلوماسية ورعاية المغتربين.' : 'Strengthening diplomatic ties and expatriate affairs.',
    news: ['New trade deal with EU signed.', 'Digital embassy services launched.'],
    services: ['Passport Renewal', 'Visa Services']
  },
  {
    id: 'interior',
    type: 'Ministry of Interior',
    name: lang === 'ar' ? 'وزارة الداخلية' : 'Ministry of Interior',
    icon: Siren,
    description: lang === 'ar' ? 'الأمن الداخلي، الهوية الرقمية، والخدمات المدنية.' : 'Internal security, Digital ID, and civil services.',
    news: ['Smart ID cards rollout complete.', 'Traffic AI reduces congestion by 40%.'],
    services: ['Civil Registration', 'Vehicle Licensing']
  },
  {
    id: 'justice',
    type: 'Ministry of Justice',
    name: lang === 'ar' ? 'وزارة العدل' : 'Ministry of Justice',
    icon: Scale,
    description: lang === 'ar' ? 'ضمان سيادة القانون والعدالة الرقمية.' : 'Ensuring rule of law and digital justice.',
    news: ['AI-assisted courts reduce backlog.', 'New arbitration center in Damascus.'],
    services: ['Case Tracking', 'Power of Attorney']
  },
  {
    id: 'finance',
    type: 'Ministry of Finance',
    name: lang === 'ar' ? 'وزارة المالية' : 'Ministry of Finance',
    icon: Wallet,
    description: lang === 'ar' ? 'إدارة الاقتصاد الرقمي والسياسة النقدية.' : 'Managing the digital economy and monetary policy.',
    news: ['Syrian Digital Lira stable.', 'Tax automation for SMEs.'],
    services: ['Tax Filing', 'Pension Services']
  },
  {
    id: 'economy',
    type: MinistryType.ECONOMY,
    name: lang === 'ar' ? 'وزارة الاقتصاد والتجارة الخارجية' : 'Ministry of Economy',
    icon: BarChart,
    description: lang === 'ar' ? 'دفع النمو عبر الصادرات التقنية والطاقة المتجددة.' : 'Driving growth through renewable energy and tech exports.',
    news: ['Tech exports up 20%.', 'Aleppo Free Trade Zone expansion.'],
    services: ['Business Reg', 'Import License']
  },
  {
    id: 'domestic_trade',
    type: 'Ministry of Domestic Trade',
    name: lang === 'ar' ? 'وزارة التجارة الداخلية وحماية المستهلك' : 'Ministry of Consumer Protection',
    icon: ShoppingCart,
    description: lang === 'ar' ? 'تنظيم الأسواق وحماية حقوق المستهلك.' : 'Market regulation and consumer rights protection.',
    news: ['Smart price monitoring active.', 'Digital ration card updates.'],
    services: ['Consumer Complaints', 'Price Check']
  },
  {
    id: 'education',
    type: 'Ministry of Education',
    name: lang === 'ar' ? 'وزارة التربية' : 'Ministry of Education',
    icon: BookOpen,
    description: lang === 'ar' ? 'بناء رأس المال البشري للمستقبل.' : 'Building human capital for the future.',
    news: ['Coding mandatory in primary schools.', 'New VR history curriculum.'],
    services: ['Exam Results', 'School Registration']
  },
  {
    id: 'higher_edu',
    type: 'Ministry of Higher Education',
    name: lang === 'ar' ? 'وزارة التعليم العالي والبحث العلمي' : 'Ministry of Higher Education',
    icon: GraduationCap,
    description: lang === 'ar' ? 'البحث العلمي والابتكار الأكاديمي.' : 'Scientific research and academic innovation.',
    news: ['Damascus University ranks top 100 globally.', 'New Quantum Computing center.'],
    services: ['Scholarships', 'Degree Attestation']
  },
  {
    id: 'health',
    type: 'Ministry of Health',
    name: lang === 'ar' ? 'وزارة الصحة' : 'Ministry of Health',
    icon: HeartPulse,
    description: lang === 'ar' ? 'الرعاية الصحية الشاملة والطب الحيوي.' : 'Universal healthcare and biomedicine.',
    news: ['Robotic surgery in all hospitals.', 'Telemedicine covers 100% of rural areas.'],
    services: ['Vaccination Records', 'Telehealth Booking']
  },
  {
    id: 'agriculture',
    type: 'Ministry of Agriculture',
    name: lang === 'ar' ? 'وزارة الزراعة والإصلاح الزراعي' : 'Ministry of Agriculture',
    icon: Sprout,
    description: lang === 'ar' ? 'الزراعة الذكية والأمن الغذائي.' : 'Smart farming and food security.',
    news: ['Vertical farms in desert operational.', 'Wheat production doubles.'],
    services: ['Land Registry', 'Crop Support']
  },
  {
    id: 'industry',
    type: 'Ministry of Industry',
    name: lang === 'ar' ? 'وزارة الصناعة' : 'Ministry of Industry',
    icon: Factory,
    description: lang === 'ar' ? 'التصنيع المتقدم والروبوتات.' : 'Advanced manufacturing and robotics.',
    news: ['New EV factory in Adra.', '3D printing hubs in every city.'],
    services: ['Industrial Licensing', 'Quality Control']
  },
  {
    id: 'energy',
    type: 'Ministry of Energy',
    name: lang === 'ar' ? 'وزارة الكهرباء' : 'Ministry of Electricity',
    icon: Lightbulb,
    description: lang === 'ar' ? 'الطاقة المستدامة والشبكة الذكية.' : 'Sustainable energy and smart grid.',
    news: ['95% renewable energy achieved.', 'Solar exports to grid.'],
    services: ['Bill Payment', 'Solar Permit']
  },
  {
    id: 'water',
    type: 'Ministry of Water',
    name: lang === 'ar' ? 'وزارة الموارد المائية' : 'Ministry of Water Resources',
    icon: Droplets,
    description: lang === 'ar' ? 'إدارة المياه واستصلاح الأراضي.' : 'Water management and terraforming.',
    news: ['New desalination plants online.', 'Smart irrigation nationwide.'],
    services: ['Water Connection', 'Report Leak']
  },
  {
    id: 'oil',
    type: 'Ministry of Oil',
    name: lang === 'ar' ? 'وزارة النفط والثروة المعدنية' : 'Ministry of Mineral Resources',
    icon: Zap,
    description: lang === 'ar' ? 'إدارة الموارد الطبيعية والتعدين.' : 'Resource management and mining.',
    news: ['Lithium extraction begins.', 'Green hydrogen shift.'],
    services: ['Fuel Cards', 'Mining Permits']
  },
  {
    id: 'transport',
    type: 'Ministry of Transport',
    name: lang === 'ar' ? 'وزارة النقل' : 'Ministry of Transport',
    icon: Train,
    description: lang === 'ar' ? 'القطارات فائقة السرعة واللوجستيات.' : 'High-speed rail and logistics.',
    news: ['Hyperloop Damascus-Aleppo active.', 'Autonomous bus fleet.'],
    services: ['Ticket Booking', 'Cargo Tracking']
  },
  {
    id: 'comms',
    type: MinistryType.INFO,
    name: lang === 'ar' ? 'وزارة الاتصالات والتقانة' : 'Ministry of Comms & Tech',
    icon: Radio,
    description: lang === 'ar' ? 'البنية التحتية الرقمية والاتصال الفائق.' : 'Digital infrastructure and connectivity.',
    news: ['6G network nationwide.', 'National cloud launched.'],
    services: ['Internet Service', 'Domain Registry']
  },
  {
    id: 'information',
    type: 'Ministry of Information',
    name: lang === 'ar' ? 'وزارة الإعلام' : 'Ministry of Information',
    icon: Tv,
    description: lang === 'ar' ? 'تنظيم الإعلام الرقمي والتقليدي.' : 'Regulating digital and traditional media.',
    news: ['National streaming platform live.', 'Media digitization project.'],
    services: ['Press Card', 'Media License']
  },
  {
    id: 'culture',
    type: 'Ministry of Culture',
    name: lang === 'ar' ? 'وزارة الثقافة' : 'Ministry of Culture',
    icon: Music,
    description: lang === 'ar' ? 'الحفاظ على التراث والفنون.' : 'Preserving heritage and arts.',
    news: ['Opera house opens in Deir ez-Zor.', 'Virtual museum of Ugarit.'],
    services: ['Event Permits', 'Library Access']
  },
  {
    id: 'works',
    type: 'Ministry of Works',
    name: lang === 'ar' ? 'وزارة الأشغال العامة والإسكان' : 'Ministry of Public Works',
    icon: Building2,
    description: lang === 'ar' ? 'الإسكان الذكي والبنية التحتية.' : 'Smart housing and infrastructure.',
    news: ['New eco-city in Ghouta.', '3D printed homes project.'],
    services: ['Housing App', 'Contractor Portal']
  },
  {
    id: 'local',
    type: 'Ministry of Local Admin',
    name: lang === 'ar' ? 'وزارة الإدارة المحلية والبيئة' : 'Ministry of Local Admin',
    icon: MapPin,
    description: lang === 'ar' ? 'تنمية المحافظات والمدن الذكية.' : 'Provincial development and smart cities.',
    news: ['Decentralized governance model.', 'City digital twins.'],
    services: ['Municipal Services', 'Zoning']
  },
  {
    id: 'tourism',
    type: MinistryType.TOURISM,
    name: lang === 'ar' ? 'وزارة السياحة' : 'Ministry of Tourism',
    icon: Camera,
    description: lang === 'ar' ? 'عرض التراث وتنشيط السياحة.' : 'Showcasing heritage and tourism.',
    news: ['VR tours of Palmyra.', 'Record visitor numbers.'],
    services: ['Visa', 'Site Pass']
  },
  {
    id: 'awqaf',
    type: 'Ministry of Awqaf',
    name: lang === 'ar' ? 'وزارة الأوقاف' : 'Ministry of Awqaf',
    icon: Landmark,
    description: lang === 'ar' ? 'الشؤون الدينية والحفاظ على التراث الروحي.' : 'Religious affairs and spiritual heritage.',
    news: ['Digital restoration of mosques.', 'Interfaith dialogue center.'],
    services: ['Pilgrimage Reg', 'Charity']
  },
  {
    id: 'social',
    type: 'Ministry of Social Affairs',
    name: lang === 'ar' ? 'وزارة الشؤون الاجتماعية والعمل' : 'Ministry of Social Affairs',
    icon: Users,
    description: lang === 'ar' ? 'الرعاية الاجتماعية وتمكين المجتمع.' : 'Social welfare and community empowerment.',
    news: ['Universal basic income pilot.', 'Labor market AI matching.'],
    services: ['Benefits', 'Job Portal']
  },
  {
    id: 'admin_dev',
    type: 'Ministry of Admin Development',
    name: lang === 'ar' ? 'وزارة التنمية الإدارية' : 'Ministry of Admin Development',
    icon: FileBadge,
    description: lang === 'ar' ? 'تطوير الكوادر الإدارية الحكومية.' : 'Developing government administrative cadres.',
    news: ['New digital governance protocols.', 'Civil service reform.'],
    services: ['HR Portal', 'Training']
  },
  {
    id: 'environment',
    type: 'State Ministry of Environment',
    name: lang === 'ar' ? 'وزارة الدولة لشؤون البيئة' : 'State Ministry of Environment',
    icon: Leaf,
    description: lang === 'ar' ? 'حماية البيئة والتنمية المستدامة.' : 'Environmental protection and sustainability.',
    news: ['Barada river restoration complete.', 'Reforestation of coastal mountains.'],
    services: ['Eco-Permits', 'Report Pollution']
  },
  {
    id: 'presidential',
    type: 'Ministry of Presidential Affairs',
    name: lang === 'ar' ? 'وزارة شؤون رئاسة الجمهورية' : 'Ministry of Presidential Affairs',
    icon: Flag,
    description: lang === 'ar' ? 'تنسيق المراسيم والشؤون الرئاسية.' : 'Coordinating decrees and presidential affairs.',
    news: ['National dialogue initiative.', 'Presidential palace open for digital tours.'],
    services: ['Decree Search', 'Protocol']
  },
  {
    id: 'future',
    type: MinistryType.FUTURE,
    name: lang === 'ar' ? 'وزارة التخطيط للمستقبل' : 'Ministry of Future Planning',
    icon: Zap,
    description: lang === 'ar' ? 'هندسة المدن الذكية واستراتيجيات 2050.' : 'Architecting smart cities and 2050 strategy.',
    news: ['Mars colonization research.', 'AI ethics charter.'],
    services: ['Research Grants', 'Urban Proposals']
  },
];

const Government: React.FC<GovernmentProps> = ({ language }) => {
  const [view, setView] = useState<ViewType>('hub');
  const [selectedMinistry, setSelectedMinistry] = useState<any>(null);
  
  const currentMinistries = getMinistries(language);

  // --- SUB-COMPONENTS ---

  const ParliamentPage = () => (
    <div className="animate-in fade-in slide-in-from-right duration-500">
      <div className="mb-8">
        <h2 className="text-4xl font-serif text-white mb-2">{t('gov.parliament', language)}</h2>
        <p className="text-syria-gold text-lg">Majlis al-Sha'ab • 2035</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chamber Visualization */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30 animate-pulse flex items-center gap-2">
               <span className="w-2 h-2 bg-red-500 rounded-full"></span> {t('gov.parliament.live', language)}
             </span>
          </div>
          <h3 className="text-xl text-white font-bold mb-6 flex items-center gap-2">
            <Users size={20} className="text-syria-gold" /> {t('gov.parliament.chamber', language)}
          </h3>
          
          <div className="h-64 flex items-end justify-center px-8 pb-4 relative">
             <div className="w-full h-full flex flex-wrap content-end justify-center gap-1">
               {Array.from({ length: 120 }).map((_, i) => (
                 <div key={i} className={`w-3 h-3 rounded-full ${Math.random() > 0.3 ? 'bg-syria-green' : 'bg-gray-600'} transition-colors duration-1000`}></div>
               ))}
             </div>
             <div className="absolute bottom-0 w-32 h-16 bg-white/10 rounded-t-full border-t border-white/20 flex items-center justify-center">
               <span className="text-[10px] text-gray-400 uppercase">Speaker</span>
             </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">250 Seats • 185 Present • 65 Remote (Holographic)</p>
        </div>

        {/* Current Agenda */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl text-white font-bold mb-4 flex items-center gap-2">
            <FileText size={20} className="text-syria-gold" /> {t('gov.parliament.agenda', language)}
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-lg border-l-2 border-syria-green">
              <span className="text-[10px] text-gray-400 uppercase">10:00 AM</span>
              <p className="text-white font-medium text-sm">Bill 442: High-Speed Rail Expansion</p>
              <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-syria-green h-full w-[75%]"></div>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg border-l-2 border-yellow-500">
              <span className="text-[10px] text-gray-400 uppercase">01:00 PM</span>
              <p className="text-white font-medium text-sm">Digital Heritage Act</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PolicePage = () => {
    return (
      <div className="animate-in fade-in slide-in-from-right duration-500">
         <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-serif text-white mb-2">{t('gov.police', language)}</h2>
            <p className="text-syria-gold text-lg">Safety • Service • Sovereignty</p>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 animate-pulse">
            <Siren size={20} /> {t('gov.police.sos', language)}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="md:col-span-2 space-y-4">
              <h3 className="text-xl text-white font-bold mb-4 flex items-center gap-2">
                <Bell size={20} className="text-syria-gold" /> {t('gov.police.feed', language)}
              </h3>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex gap-4">
                   <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-red-500/20 text-red-500">
                     <Siren size={20}/>
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-start">
                       <h4 className="text-white font-bold text-sm">Sandstorm Warning</h4>
                       <span className="text-[10px] text-gray-500">10m ago</span>
                     </div>
                     <p className="text-gray-300 text-sm mt-1">Low visibility reported on Palmyra-Homs Highway.</p>
                   </div>
              </div>
           </div>

           <div className="space-y-6">
             <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                <ShieldCheck size={48} className="text-syria-green mx-auto mb-4" />
                <h3 className="text-white font-bold text-lg">{t('gov.police.smart', language)}</h3>
                <p className="text-gray-400 text-sm mt-2">AI-integrated command centers ensure a 2-minute response time.</p>
             </div>
           </div>
        </div>
      </div>
    );
  };

  const ForumPage = () => {
    const [activeChannel, setActiveChannel] = useState('General');
    const [postText, setPostText] = useState('');
    const [posts, setPosts] = useState([
      { id: 1, author: 'Layla H.', channel: 'Damascus', text: 'The new solar streetlights in Old Damascus are stunning at night. A perfect blend of heritage and tech.', time: '2h ago', likes: 24, comments: 5 },
      { id: 2, author: 'Dr. Sameer', channel: 'General', text: 'Education reform proposal #405 regarding AI literacy in primary schools needs more community input. Join the town hall tonight.', time: '4h ago', likes: 156, comments: 42 },
      { id: 3, author: 'Youssef K.', channel: 'Aleppo', text: 'Does anyone have the schedule for the new Maglev train to Latakia?', time: '5h ago', likes: 8, comments: 2 },
    ]);

    const handlePost = () => {
      if (!postText.trim()) return;
      setPosts([{ id: Date.now(), author: 'Citizen', channel: activeChannel, text: postText, time: 'Just now', likes: 0, comments: 0 }, ...posts]);
      setPostText('');
    };

    const channels = ['General', ...PROVINCES];

    return (
      <div className="animate-in fade-in slide-in-from-right duration-500 h-[80vh] flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col">
          <h3 className="text-syria-gold font-serif font-bold mb-4 px-2">{t('gov.forum', language)}</h3>
          <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            {channels.map(channel => (
               <button
                 key={channel}
                 onClick={() => setActiveChannel(channel)}
                 className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                   activeChannel === channel ? 'bg-syria-green text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                 }`}
               >
                 <span>{channel === 'General' ? t('forum.general', language) : channel}</span>
                 {channel === activeChannel && <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>}
               </button>
            ))}
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative">
          
          {/* Page Cover Header */}
          <div className="h-32 bg-gradient-to-r from-syria-dark to-slate-800 relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
             <div className="absolute bottom-4 left-4 rtl:right-4 flex items-end gap-4">
                <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center shadow-2xl">
                   {activeChannel === 'General' ? <Globe size={40} className="text-syria-gold" /> : <MapPin size={40} className="text-syria-green" />}
                </div>
                <div>
                   <h2 className="text-2xl font-serif font-bold text-white shadow-black drop-shadow-md">
                     {activeChannel === 'General' ? t('forum.general', language) : `${activeChannel} Province`}
                   </h2>
                   <p className="text-gray-300 text-sm drop-shadow-md">
                      {activeChannel === 'General' ? 'Official National Assembly Page' : `Official Community Page for ${activeChannel}`}
                   </p>
                </div>
             </div>
          </div>

          {/* Posts Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
             {posts.filter(p => activeChannel === 'General' || p.channel === activeChannel).length === 0 ? (
               <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                 <MessageSquare size={32} className="mb-2 opacity-20"/>
                 <p>No discussions yet. Be the first to post.</p>
               </div>
             ) : (
               posts.filter(p => activeChannel === 'General' || p.channel === activeChannel).map(post => (
                 <div key={post.id} className="bg-syria-dark border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-syria-gold/20 to-syria-gold/5 border border-syria-gold/30 flex items-center justify-center text-sm font-bold text-syria-gold">
                           {post.author.charAt(0)}
                         </div>
                         <div>
                           <p className="text-sm font-bold text-white hover:underline cursor-pointer">{post.author}</p>
                           <p className="text-[10px] text-gray-400">{post.time} • <Globe size={10} className="inline ml-1"/></p>
                         </div>
                      </div>
                    </div>
                    <p className="text-gray-200 text-sm mb-4 leading-relaxed pl-1">{post.text}</p>
                    <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                       <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-syria-green transition-colors font-medium">
                         <ThumbsUp size={16} /> {post.likes} <span className="hidden sm:inline">{t('forum.likes', language)}</span>
                       </button>
                       <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-400 transition-colors font-medium">
                         <MessageCircle size={16} /> {post.comments} <span className="hidden sm:inline">{t('forum.comments', language)}</span>
                       </button>
                       <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors ml-auto font-medium">
                         <Share2 size={16} /> {t('forum.share', language) || 'Share'}
                       </button>
                    </div>
                 </div>
               ))
             )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-syria-dark border-t border-white/10 shadow-up">
            <div className="flex gap-3 items-center">
               <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"></div>
               <div className="flex-1 relative">
                 <input 
                   type="text" 
                   value={postText}
                   onChange={(e) => setPostText(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                   placeholder={`${t('forum.write', language)} ${activeChannel}...`}
                   className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-syria-gold focus:ring-1 focus:ring-syria-gold transition-all"
                 />
                 <button 
                   onClick={handlePost}
                   disabled={!postText.trim()}
                   className="absolute right-1.5 rtl:left-1.5 top-1.5 bg-syria-gold text-syria-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <Send size={14} />
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MinistryDetailPage = ({ ministry }: { ministry: any }) => (
    <div className="animate-in fade-in slide-in-from-right duration-500">
      <div className="bg-gradient-to-r from-black via-syria-dark to-black border-b border-white/10 pb-8 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-syria-gold/10 rounded-2xl border border-syria-gold/30">
            <ministry.icon size={40} className="text-syria-gold" />
          </div>
          <div>
             <h2 className="text-4xl font-serif text-white">{ministry.name}</h2>
             <p className="text-gray-400 mt-1">{ministry.description}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
             onClick={() => {
               setSelectedMinistry(ministry);
               setView('ai_chat');
             }}
             className="px-4 py-2 bg-white/10 text-white text-sm font-bold rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <Bot size={16} /> {t('gov.chat', language)}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-xl text-white font-bold mb-4 border-b border-white/10 pb-2">{t('gov.updates', language)}</h3>
          <ul className="space-y-4">
            {ministry.news.map((item: string, i: number) => (
              <li key={i} className="flex gap-3">
                <span className="text-syria-gold font-bold text-sm">0{i+1}.</span>
                <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-xl text-white font-bold mb-4 border-b border-white/10 pb-2">{t('gov.services', language)}</h3>
          <div className="grid grid-cols-1 gap-3">
            {ministry.services.map((service: string, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-black/30 rounded-lg hover:bg-black/50 cursor-pointer group transition-colors">
                <span className="text-gray-300 text-sm group-hover:text-white">{service}</span>
                <ExternalLink size={14} className="text-gray-500 group-hover:text-syria-gold rtl:rotate-180" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      
      {view !== 'hub' && (
        <button 
          onClick={() => {
            setView('hub');
            setSelectedMinistry(null);
          }}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-syria-gold transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" /> {t('gov.back', language)}
        </button>
      )}

      {view === 'hub' && (
        <div className="animate-in fade-in zoom-in duration-300">
           <div className="text-center mb-12">
             <h2 className="text-4xl font-serif text-white mb-2">{t('gov.title', language)}</h2>
             <p className="text-syria-gold text-lg">{t('gov.subtitle', language)}</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Parliament */}
              <div 
                onClick={() => setView('parliament')}
                className="group bg-gradient-to-br from-white/5 to-black border border-white/10 p-8 rounded-2xl cursor-pointer hover:border-syria-gold/50 transition-all hover:-translate-y-1 relative overflow-hidden"
              >
                 <Gavel size={32} className="text-syria-gold mb-4" />
                 <h3 className="text-2xl font-serif text-white font-bold">{t('gov.parliament', language)}</h3>
                 <p className="text-gray-400 text-sm mt-2">{t('gov.parliament.desc', language)}</p>
                 <div className="mt-6 flex items-center text-syria-gold text-sm font-bold gap-2">
                   {t('gov.enter', language)} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                 </div>
              </div>

              {/* Police */}
              <div 
                onClick={() => setView('police')}
                className="group bg-gradient-to-br from-white/5 to-black border border-white/10 p-8 rounded-2xl cursor-pointer hover:border-syria-gold/50 transition-all hover:-translate-y-1 relative overflow-hidden"
              >
                 <ShieldCheck size={32} className="text-syria-gold mb-4" />
                 <h3 className="text-2xl font-serif text-white font-bold">{t('gov.police', language)}</h3>
                 <p className="text-gray-400 text-sm mt-2">{t('gov.police.desc', language)}</p>
                 <div className="mt-6 flex items-center text-syria-gold text-sm font-bold gap-2">
                   {t('gov.view', language)} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                 </div>
              </div>

              {/* Forum (New) */}
              <div 
                onClick={() => setView('forum')}
                className="group bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/30 p-8 rounded-2xl cursor-pointer hover:border-blue-500/50 transition-all hover:-translate-y-1 relative overflow-hidden"
              >
                 <MessageSquare size={32} className="text-blue-400 mb-4" />
                 <h3 className="text-2xl font-serif text-white font-bold">{t('gov.forum', language)}</h3>
                 <p className="text-gray-400 text-sm mt-2">{t('gov.forum.desc', language)}</p>
                 <div className="mt-6 flex items-center text-blue-400 text-sm font-bold gap-2">
                   {t('gov.join', language)} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                 </div>
              </div>

              {/* AI Liaison */}
              <div 
                onClick={() => setView('ai_chat')}
                className="group bg-gradient-to-br from-syria-green/20 to-black border border-syria-green/30 p-8 rounded-2xl cursor-pointer hover:border-syria-green transition-all hover:-translate-y-1 relative overflow-hidden"
              >
                 <Bot size={32} className="text-syria-green mb-4" />
                 <h3 className="text-2xl font-serif text-white font-bold">{t('gov.ai', language)}</h3>
                 <p className="text-gray-400 text-sm mt-2">{t('gov.ai.desc', language)}</p>
                 <div className="mt-6 flex items-center text-syria-green text-sm font-bold gap-2">
                   {t('gov.chat', language)} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                 </div>
              </div>
           </div>

           <h3 className="text-2xl font-serif text-white mb-6 border-b border-white/10 pb-2">{t('gov.ministries', language)}</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {currentMinistries.map((m) => (
               <div 
                 key={m.id}
                 onClick={() => {
                   setSelectedMinistry(m);
                   setView('ministry_detail');
                 }}
                 className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 cursor-pointer transition-colors flex flex-col items-start gap-3"
               >
                 <div className="p-2 bg-black rounded-lg">
                   <m.icon size={24} className="text-syria-gold" />
                 </div>
                 <div>
                   <h4 className="text-white font-bold">{m.name}</h4>
                   <p className="text-xs text-gray-500 mt-1 line-clamp-2">{m.description}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {view === 'parliament' && <ParliamentPage />}
      {view === 'police' && <PolicePage />}
      {view === 'forum' && <ForumPage />}
      {view === 'ministry_detail' && selectedMinistry && <MinistryDetailPage ministry={selectedMinistry} />}
      {view === 'ai_chat' && (
        <MinistryChat 
          onBack={() => {
            if (selectedMinistry) {
              setView('ministry_detail');
            } else {
              setView('hub');
            }
          }}
          initialMinistry={selectedMinistry?.type}
        />
      )}
    </div>
  );
};

export default Government;
