
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Users, TrendingUp, Heart, BookOpen, Home, Briefcase, Activity } from 'lucide-react';
import { t } from '../utils/translations';

interface StatsDashboardProps {
  language: string;
}

const gdpData = [
  { year: '2025', value: 60 },
  { year: '2027', value: 120 },
  { year: '2029', value: 250 },
  { year: '2031', value: 480 },
  { year: '2033', value: 750 },
  { year: '2035', value: 1200 },
];

const sectorData = [
  { name: 'Tech', value: 35 },
  { name: 'Agri', value: 20 },
  { name: 'Tourism', value: 25 },
  { name: 'Energy', value: 20 },
];

const populationData = [
  { year: '2025', value: 22.1 },
  { year: '2027', value: 23.4 },
  { year: '2029', value: 24.8 },
  { year: '2031', value: 26.2 },
  { year: '2033', value: 27.5 },
  { year: '2035', value: 28.9 },
];

const ageStructureData = [
  { age: '0-14', male: 15, female: 14 },
  { age: '15-24', male: 12, female: 11 },
  { age: '25-54', male: 35, female: 36 },
  { age: '55-64', male: 8, female: 9 },
  { age: '65+', male: 6, female: 7 },
];

const maritalStatusData = [
  { name: 'Single', value: 32 },
  { name: 'Married', value: 58 },
  { name: 'Divorced', value: 6 },
  { name: 'Widowed', value: 4 },
];

const educationData = [
  { name: 'Primary', value: 10 },
  { name: 'Secondary', value: 25 },
  { name: 'Vocational', value: 20 },
  { name: 'University', value: 35 },
  { name: 'Post-Grad', value: 10 },
];

const SOCIAL_COLORS = ['#007A3D', '#D4AF37', '#CE1126', '#FFFFFF'];
const GENDER_COLORS = { male: '#0D8ABC', female: '#CE1126' };

const StatsDashboard: React.FC<StatsDashboardProps> = ({ language }) => {
  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-serif text-white mb-2">{t('stats.title', language)}</h2>
        <p className="text-syria-gold text-lg">{t('stats.subtitle', language)}</p>
      </div>

      {/* --- Economic Section --- */}
      <section aria-labelledby="economic-title" className="mb-16">
        <h3 id="economic-title" className="text-2xl text-white font-serif mb-6 flex items-center gap-2 border-b border-white/10 pb-2">
          <TrendingUp className="text-syria-gold" aria-hidden="true" /> {t('stats.economic', language)}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8" role="list">
          {[
            { label: t('stats.gdp', language), value: '+12.5%', sub: 'Annual', color: 'text-green-400' },
            { label: t('stats.energy', language), value: '94%', sub: 'National Grid', color: 'text-blue-400' },
            { label: t('stats.literacy', language), value: '99.8%', sub: 'Population', color: 'text-purple-400' },
          ].map((stat, i) => (
            <div 
              key={i} 
              role="listitem"
              className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-syria-gold"
            >
              <p className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-end gap-3 mt-2">
                <span className={`text-4xl font-bold ${stat.color}`}>{stat.value}</span>
                <span className="text-gray-500 mb-1">{stat.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md h-[400px]">
            <h3 className="text-xl text-white mb-6 font-serif">{t('stats.gdp_trajectory', language)}</h3>
            <div className="h-[85%] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gdpData}>
                  <defs>
                    <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="year" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                  <Area type="monotone" dataKey="value" stroke="#D4AF37" fillOpacity={1} fill="url(#colorGdp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md h-[400px]">
            <h3 className="text-xl text-white mb-6 font-serif">{t('stats.sectors', language)}</h3>
            <div className="h-[85%] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                     cursor={{fill: 'rgba(255,255,255,0.05)'}}
                     contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="#007A3D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* --- Demographics Section --- */}
      <section aria-labelledby="demographics-title">
        <h3 id="demographics-title" className="text-2xl text-white font-serif mb-6 flex items-center gap-2 border-b border-white/10 pb-2">
          <Users className="text-syria-gold" aria-hidden="true" /> {t('stats.demographics', language)}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-gray-400 text-xs uppercase font-bold">{t('stats.population', language)}</span>
                <Users size={16} className="text-syria-gold"/>
              </div>
              <div className="text-2xl font-bold text-white mt-2">28.9M</div>
              <div className="text-green-400 text-xs flex items-center gap-1">+1.8%</div>
           </div>
           
           <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-gray-400 text-xs uppercase font-bold">{t('stats.life_expectancy', language)}</span>
                <Activity size={16} className="text-syria-green"/>
              </div>
              <div className="text-2xl font-bold text-white mt-2">78.4</div>
           </div>

           <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-gray-400 text-xs uppercase font-bold">{t('stats.urbanization', language)}</span>
                <Home size={16} className="text-blue-400"/>
              </div>
              <div className="text-2xl font-bold text-white mt-2">68%</div>
           </div>

           <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-gray-400 text-xs uppercase font-bold">{t('stats.workforce', language)}</span>
                <Briefcase size={16} className="text-purple-400"/>
              </div>
              <div className="text-2xl font-bold text-white mt-2">14.2M</div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md h-[400px]">
            <h3 className="text-xl text-white mb-6 font-serif">{t('stats.pop_growth', language)}</h3>
            <div className="h-[85%] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={populationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="year" stroke="#666" />
                  <YAxis stroke="#666" domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                  <Line type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={3} dot={{r: 4, fill: '#D4AF37'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md h-[400px]">
            <h3 className="text-xl text-white mb-6 font-serif">{t('stats.age_gender', language)}</h3>
            <div className="h-[85%] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageStructureData} layout="vertical" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="age" type="category" stroke="#666" width={50} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} formatter={(value: number) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="male" name={t('stats.male', language)} fill={GENDER_COLORS.male} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="female" name={t('stats.female', language)} fill={GENDER_COLORS.female} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatsDashboard;
