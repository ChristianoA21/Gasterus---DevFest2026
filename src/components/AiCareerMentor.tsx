import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RefreshCw, 
  Copy, 
  Check, 
  HelpCircle, 
  Briefcase, 
  Flame, 
  Lightbulb,
  Building,
  CheckCircle2
} from 'lucide-react';
import { 
  ChatMessage, 
  UserProfile, 
  SkillGapAnalysisResult, 
  ApplicationSubmission 
} from '../types';

interface AiCareerMentorProps {
  userProfile: UserProfile;
  analysisResult: SkillGapAnalysisResult | null;
  applications: ApplicationSubmission[];
}

export const AiCareerMentor: React.FC<AiCareerMentorProps> = ({
  userProfile,
  analysisResult,
  applications,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Halo ${userProfile.name}! 👋 Saya **Mentor Gasterus**, AI Career Consultant-mu untuk DevFest 2026.\n\nSaya telah menyinkronkan profil akademismu di **${userProfile.major}** dengan target kariermu sebagai **${userProfile.dreamJob}**${
        analysisResult ? `, serta data Skill Gap (${analysisResult.matchScore}% Match Rate).` : '.'
      }\n\nAda yang ingin kita diskusikan hari ini? Kamu bisa meminta simulasi wawancara kerja, tips review CV/portfolio, atau strategi memenangkan micro-internship dari UMKM/Startup!`,
      timestamp: 'Baru saja',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    {
      label: 'Simulasi Wawancara Teknis',
      prompt: `Bantu saya simulasi wawancara teknis 3 pertanyaan untuk posisi ${userProfile.dreamJob}. Berikan pertanyaan pertama sekarang beserta tips cara menjawabnya.`,
    },
    {
      label: 'Review Proposal Micro-Internship',
      prompt: `Bagaimana cara menulis proposal lamaran micro-internship yang meyakinkan bagi pemilik UMKM agar saya langsung dipilih?`,
    },
    {
      label: 'Siasati Paradoks Portofolio',
      prompt: `Saya belum punya pengalaman kerja formal, baru tugas kuliah dan tugas mini. Bagaimana cara membingkainya di CV agar dilirik rekruter 2026?`,
    },
    {
      label: 'Prioritas Belajar Minggu Ini',
      prompt: `Berdasarkan analisis skill gap-ku, skill spesifik apa yang sebaiknya saya prioritaskan pelajari dalam 7 hari ke depan?`,
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputPrompt;
    if (!messageText.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputPrompt('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/gemini/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ sender: m.sender, text: m.text })),
          userProfile,
          currentAnalysis: analysisResult,
          userProjects: applications,
        }),
      });

      const json = await response.json();
      const replyText = json.reply || 'Tetap semangat mengasah kemampuan! Ada yang bisa saya bantu jelaskan lagi?';

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error querying AI Mentor:', err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-fallback-${Date.now()}`,
        sender: 'assistant',
        text: `Terjadi kendala jaringan saat menghubungi server AI. Namun prinsip utamanya: fokuslah pada pemecahan masalah praktis dengan perkakas industri, selesaikan setidaknya satu micro-internship nyata di Gasterus Hub, dan cantumkan bukti link kerjamu secara publik!`,
        timestamp: 'Baru saja',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Fitur Utama 3: Matching Mentor AI (Gemini 3.8 Flash)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Konsultasi Karier Berbasis AI Kontekstual
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Mentor AI ini mengetahui profil akademikmu, hasil analisis kesenjangan keterampilan, serta proyek riil yang kamu kerjakan di Gasterus.
          </p>
        </div>

        {/* Live Context Card */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Konteks Tersinkron:
          </div>
          <div className="text-slate-200 font-semibold truncate max-w-xs">
            {userProfile.major} (Smt {userProfile.semester}) → <span className="text-amber-400">{userProfile.dreamJob}</span>
          </div>
          <div className="text-slate-400 text-[11px] flex items-center gap-2">
            <span>Match: {analysisResult ? `${analysisResult.matchScore}%` : 'Belum dihitung'}</span>
            <span>•</span>
            <span>Proyek: {applications.length} Terdaftar</span>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex flex-col h-[600px] rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-bold text-xs'
                      : 'bg-gradient-to-tr from-indigo-500 to-sky-500 text-white'
                  }`}
                >
                  {isUser ? userProfile.name.charAt(0) : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed relative group ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Metadata and actions */}
                  <div
                    className={`flex items-center gap-2 mt-2 pt-1 text-[10px] ${
                      isUser ? 'text-indigo-200 justify-end' : 'text-slate-500 justify-between'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => copyMessage(msg.id, msg.text)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-slate-200"
                        title="Salin jawaban"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-500 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-slate-950 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Mentor sedang merancang jawaban personal...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>Topik Cepat:</span>
          </span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qp.prompt)}
              className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 hover:bg-slate-800/80 transition-all shrink-0"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Tanyakan apa saja seputar karier, review CV, atau strategi micro-internship..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isTyping}
              className="p-2.5 sm:px-5 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
