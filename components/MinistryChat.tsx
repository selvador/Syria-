
import React, { useState, useRef, useEffect } from 'react';
import { generateMinistryResponse } from '../services/geminiService';
import { MinistryType, ChatMessage } from '../types';
import { Send, User, Bot, Loader2, ArrowLeft } from 'lucide-react';

interface MinistryChatProps {
  onBack?: () => void;
  initialMinistry?: MinistryType;
}

const MinistryChat: React.FC<MinistryChatProps> = ({ onBack, initialMinistry }) => {
  const [activeMinistry, setActiveMinistry] = useState<MinistryType>(initialMinistry || MinistryType.INFO);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome, citizen. I am the automated liaison for the Ministry. How can I assist you in navigating the New Republic?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await generateMinistryResponse(input, activeMinistry);
    
    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto h-screen flex flex-col">
       <div className="mb-6 flex items-center justify-between">
         <div className="flex items-center gap-4">
           {onBack && (
             <button onClick={onBack} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
               <ArrowLeft size={20} className="text-white" />
             </button>
           )}
           <div>
             <h2 className="text-3xl font-serif text-white">Direct Line to Ministry</h2>
             <p className="text-gray-400 mt-1">AI-Powered Citizen Support Interface</p>
           </div>
         </div>
       </div>

       {/* Ministry Selector */}
       <div className="flex flex-wrap gap-3 mb-6">
         {Object.values(MinistryType).map((m) => (
           <button
             key={m}
             onClick={() => setActiveMinistry(m)}
             className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
               activeMinistry === m 
                 ? 'bg-syria-green text-white shadow-lg shadow-syria-green/30' 
                 : 'bg-white/5 text-gray-400 hover:bg-white/10'
             }`}
           >
             {m}
           </button>
         ))}
       </div>

       {/* Chat Interface */}
       <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col backdrop-blur-xl shadow-2xl">
         <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {messages.map((msg, idx) => (
             <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-syria-gold text-black' : 'bg-syria-green text-white'}`}>
                 {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
               </div>
               <div className={`max-w-[80%] p-4 rounded-2xl ${
                 msg.role === 'user' 
                   ? 'bg-white/10 text-white rounded-tr-none' 
                   : 'bg-syria-dark border border-white/10 text-gray-200 rounded-tl-none shadow-lg'
               }`}>
                 <p className="leading-relaxed">{msg.text}</p>
                 <span className="text-[10px] text-gray-500 mt-2 block opacity-70">
                   {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </span>
               </div>
             </div>
           ))}
           {loading && (
             <div className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-syria-green flex items-center justify-center">
                 <Bot size={20} className="text-white" />
               </div>
               <div className="bg-syria-dark border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin text-syria-gold" />
                 <span className="text-sm text-gray-400">Consulting state archives...</span>
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
         </div>

         <div className="p-4 border-t border-white/10 bg-white/5">
           <div className="flex gap-4">
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder={`Ask the ${activeMinistry}...`}
               className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-syria-gold focus:ring-1 focus:ring-syria-gold transition-all"
             />
             <button 
               onClick={handleSend}
               disabled={loading || !input.trim()}
               className="bg-syria-gold text-syria-black px-6 rounded-xl font-bold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               <Send size={20} />
             </button>
           </div>
         </div>
       </div>
    </div>
  );
};

export default MinistryChat;
