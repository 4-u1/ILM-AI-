import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrackId, Language } from '../types';
import { playTapSound } from '../utils/platformSounds';
import {
  Compass,
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Layers,
  Heart,
  ShieldCheck,
  Award,
  Volume2,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Copy,
  Check,
  FileText,
  Split,
  ChevronRight,
  ChevronLeft,
  Mic,
  MicOff
} from 'lucide-react';

interface SuggestedAction {
  label: string;
  action: 'navigate_track' | 'navigate_tab' | 'navigate_branch' | 'open_modal' | 'open_compact_quran' | 'open_quran';
  target: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: SuggestedAction[];
  sources?: string[];
  isLevelD?: boolean;
}

interface IlmPlatformGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentTrack: TrackId | null;
  currentTab: string;
  onNavigateTab: (tab: any) => void;
  onSelectTrack: (track: TrackId, initialMode?: any) => void;
  onOpenFatwaTicket?: () => void;
  onOpenShahada?: () => void;
  onOpenCompactQuran?: (surahNumber?: number) => void;
}

// 🌿 Helper function to render formatted markdown bold text without raw ** asterisks
const renderFormattedMessageText = (text: string, isUser: boolean) => {
  if (!text) return null;

  // Split by bold patterns like **bold text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          const content = part.slice(2, -2);
          return (
            <strong
              key={index}
              className={`font-black tracking-wide ${
                isUser ? 'text-white underline decoration-amber-300/60' : 'text-amber-950 font-serif'
              }`}
            >
              {content}
            </strong>
          );
        }
        return part;
      })}
    </span>
  );
};

// 🕌 8-point Islamic Star Rub el Hizb Geometric Motif
const IslamicStarSVG: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-amber-500/40" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l2.4 4.8 4.8 2.4-4.8 2.4-2.4 4.8-2.4-4.8-4.8-2.4 4.8-2.4z" />
    <path d="M12 4.5l1.6 3.2 3.2 1.6-3.2 1.6-1.6 3.2-1.6-3.2-3.2-1.6 3.2-1.6z" className="opacity-75" />
    <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const SUGGESTED_QUESTIONS: Record<Language, string[]> = {
  ar: [
    'كيف أبدأ رحلتي في منصة عِلم؟',
    'ما هو المسار التعليمي الأنسب لي؟',
    'أريد تعلم الوضوء والصلاة خطوة بخطوة',
    'أين أجد واحة الأذكار والمسبحة الصوتية؟',
    'كيف أستخدم محاكي الداعية التفاعلي؟',
    'ما هي المصادر الشرعية المعتمدة في المنصة؟',
    'كيف أحصل على الشهادة المعتمدة وأطبعها PDF؟',
    'أريد دراسة مسار مقارنة الأديان أو السيرة النبوية'
  ],
  en: [
    'How do I start my learning journey in ILM?',
    'Which learning path is right for me?',
    'I want to learn Wudu and Prayer step-by-step',
    'Where is the Dhikr Sanctuary & audio tasbeeh?',
    'How do I use the Da\'iyah AI Simulator?',
    'What verified Islamic sources does ILM use?',
    'How do I export my accredited PDF certificate?',
    'I want to explore Comparative Religions or Seerah'
  ],
  ur: [
    'منصہ عِلم میں اپنے سفر کا آغاز کیسے کروں؟',
    'میرے لیے کون سا تعلیمی راستہ مناسب ہے؟',
    'وضو اور نماز مرحلہ وار کیسے سیکھیں؟',
    'واحۂ اذکار اور ڈیجیٹل تسبیح کہاں ہے؟',
    'داعی سمیلیٹر کو کیسے استعمال کیا جائے؟',
    'منصہ کے مستند شرعی مصادر کون سے ہیں؟',
    'مستند پی ڈی ایف سند کیسے حاصل کریں؟'
  ],
  fr: [
    'Comment commencer mon parcours sur la plateforme ILM ?',
    'Quel parcours est le plus adapté pour moi ?',
    'Je veux apprendre les ablutions et la prière pas à pas',
    'Où trouver le Sanctuaire de Dhikr ?'
  ],
  es: [
    '¿Cómo inicio mi viaje de aprendizaje en ILM?',
    '¿Cuál es la ruta más adecuada para mí?',
    'Quiero aprender la ablución y la oración paso a paso'
  ],
  id: [
    'Bagaimana cara memulai perjalanan belajar di ILM?',
    'Jalur pembelajaran mana yang tepat untuk saya?',
    'Saya ingin belajar wudhu dan shalat langkah demi langkah'
  ]
};

export const IlmPlatformGuideModal: React.FC<IlmPlatformGuideModalProps> = ({
  isOpen,
  onClose,
  language,
  currentTrack,
  currentTab,
  onNavigateTab,
  onSelectTrack,
  onOpenFatwaTicket,
  onOpenShahada,
  onOpenCompactQuran
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        text: isAr
          ? `السلام عليكم ورحمة الله وبركاته.. أهلاً بك في منصة «عِلم» 🌿\n\nأنا **«مُرشِد عِلم الذكي»**، دليلك وموجهك التفاعلي في كافة أرجاء المنصة.\n\nيمكنني إرشادك لكيفية استخدام المنصة، اختيار مسارك التعليمي، الإجابة عن كافة استفساراتك الشرعية الموثقة بمصادر مجمع الملك فهد وصحيح البخاري ومسلم، وتوجيهك مباشرة لأي قسم بضغطة زر واحدة.`
          : isUr
          ? `السلام علیکم ورحمۃ اللہ وبرکاتہ.. منصہ «عِلم» میں خوش آمدید 🌿\n\nمیں **«مرشد عِلم»** ہوں، آپ کا انٹرایکٹو رہنما۔ میں آپ کو منصہ کے تمام فیچرز، کورسز اور مستند دینی سوالات کے جوابات میں رہنمائی فراہم کرتا ہوں۔`
          : `Peace and blessings be upon you. Welcome to ILM Platform 🌿\n\nI am your **«ILM Intelligent Guide»**, ready to navigate you through all learning paths, authentic sources, and platform features with interactive one-click shortcuts.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: isAr ? 'استعراض المسارات التعليمية' : 'Explore Tracks', action: 'navigate_tab', target: 'tracks' },
          { label: isAr ? 'المصحف الشريف (صفحة مصغرة)' : 'Holy Quran (Mini)', action: 'open_compact_quran', target: 'surah:1' },
          { label: isAr ? 'فتح واحة الأذكار والمسبحة' : 'Dhikr Sanctuary', action: 'navigate_tab', target: 'dhikr' },
          { label: isAr ? 'المصادر المعتمدة' : 'Verified Sources', action: 'navigate_tab', target: 'sources' }
        ],
        sources: ['مجمع الملك فهد لطباعة المصحف الشريف', 'صحيح البخاري وصحيح مسلم', 'منصة عِلم']
      }
    ];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  const toggleListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isAr ? 'ميزة التعرف الصوتي غير مدعومة في متصفحك الحالي.' : 'Voice recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    playTapSound();
    setInputMessage('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/platform-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
          language,
          currentTrack: currentTrack || 'new_muslim',
          currentTab
        })
      });

      if (!response.ok) {
        throw new Error('Server response error');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.reply || (isAr ? 'تم استلام استفسارك، يسعدني مساعدتك دائماً.' : 'Inquiry received, happy to assist.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: Array.isArray(data.suggestedActions) ? data.suggestedActions : [],
        sources: Array.isArray(data.sources) ? data.sources : ['مجمع الملك فهد لطباعة المصحف الشريف', 'منصة عِلم'],
        isLevelD: data.isLevelD || false
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('Fallback response for platform guide:', err);
      // Clean, elegant fallback without crashing or freezing
      const fallbackMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: isAr
          ? `أهلاً بك يا طالب العلم.. يمكنك استكشاف مميزات منصة «عِلم» عبر المسارات الأربعة المعتمدة (مسار غير المسلم، مسار المسلم الجديد، مسار المسلم الأصل، ومسار الداعية)، بالإضافة إلى واحة الأذكار والمصحف الشريف المعتمد.`
          : `Welcome to ILM Platform. You can explore all our 4 structured paths, Dhikr Sanctuary, and Holy Quran browser directly through the navigation shortcuts below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: isAr ? 'الانتقال للمسارات التعليمية' : 'Explore Tracks', action: 'navigate_tab', target: 'tracks' },
          { label: isAr ? 'فتح واحة الأذكار' : 'Dhikr Sanctuary', action: 'navigate_tab', target: 'dhikr' }
        ],
        sources: ['منصة عِلم', 'مجمع الملك فهد لطباعة المصحف الشريف']
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: SuggestedAction) => {
    playTapSound();
    onClose();

    if (action.action === 'open_compact_quran' || action.action === 'open_quran') {
      if (onOpenCompactQuran) {
        let surahNum = 1;
        if (action.target && action.target.startsWith('surah:')) {
          surahNum = parseInt(action.target.replace('surah:', ''), 10) || 1;
        }
        onOpenCompactQuran(surahNum);
      } else {
        onNavigateTab('quran');
      }
    } else if (action.action === 'navigate_track') {
      onSelectTrack(action.target as TrackId, 'tutor');
    } else if (action.action === 'navigate_tab') {
      onNavigateTab(action.target);
    } else if (action.action === 'navigate_branch') {
      if (currentTrack) {
        onSelectTrack(currentTrack, 'branching');
      } else {
        onSelectTrack('new_muslim', 'branching');
      }
    } else if (action.action === 'open_modal') {
      if (action.target === 'fatwa_ticket' && onOpenFatwaTicket) {
        onOpenFatwaTicket();
      } else if (action.target === 'shahada' && onOpenShahada) {
        onOpenShahada();
      } else if (action.target === 'quran' && onOpenCompactQuran) {
        onOpenCompactQuran(1);
      }
    }
  };

  const handleCopyText = (id: string, text: string) => {
    playTapSound();
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleResetChat = () => {
    playTapSound();
    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        role: 'assistant',
        text: isAr
          ? `تم تجديد جلسة الحوار مع **«مُرشِد عِلم الذكي»** 🌿\n\nكيف يمكنني توجيهك أو الإجابة عن استفساراتك الآن؟`
          : `Chat session refreshed with **«ILM Guide»** 🌿\n\nHow can I navigate you or answer your inquiries today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: isAr ? 'استعراض المسارات التعليمية' : 'Explore Tracks', action: 'navigate_tab', target: 'tracks' },
          { label: isAr ? 'فتح واحة الأذكار والمسبحة' : 'Dhikr Sanctuary', action: 'navigate_tab', target: 'dhikr' }
        ],
        sources: ['مجمع الملك فهد لطباعة المصحف الشريف', 'صحيح البخاري وصحيح مسلم', 'منصة عِلم']
      }
    ]);
  };

  if (!isOpen) return null;

  const currentSuggestedQuestions = SUGGESTED_QUESTIONS[language] || SUGGESTED_QUESTIONS.en;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Main Light Manuscript Dialogue Window */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="w-full max-w-2xl h-[92vh] sm:h-[88vh] max-h-[820px] bg-gradient-to-br from-[#FCFAF6] via-[#FAF7F2] to-[#F5EFE6] rounded-2xl sm:rounded-[32px] border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col overflow-hidden relative text-slate-900"
      >
        {/* Subtle decorative geometric corners */}
        <div className="absolute top-2 left-2 pointer-events-none opacity-40">
          <IslamicStarSVG className="w-4 h-4 text-amber-600" />
        </div>
        <div className="absolute top-2 right-2 pointer-events-none opacity-40">
          <IslamicStarSVG className="w-4 h-4 text-amber-600" />
        </div>

        {/* 🌟 Header: Name, Brand, Clear Status, Close */}
        <div className="px-3.5 sm:px-5 py-3 sm:py-4 bg-white/90 backdrop-blur-md border-b border-[#EAE3D6] flex items-center justify-between gap-2 shrink-0 shadow-2xs relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-100 via-emerald-50 to-amber-200 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-xs relative">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800" />
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm sm:text-lg font-black font-serif text-slate-950 truncate">
                  {isAr ? 'مُرشِد عِلم الذكي' : isUr ? 'مرشد عِلم' : 'ILM Intelligent Guide'}
                </h3>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900 text-[9px] sm:text-[10px] font-black border border-emerald-300 shrink-0">
                  {isAr ? 'الموجّه التفاعلي' : 'Interactive Navigator'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium mt-0.5 truncate">
                {isAr ? 'دليلك الشامل وموجهك الذكي الموثق في منصة عِلم' : 'Your comprehensive AI navigator & knowledge guide'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleResetChat}
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
              title={isAr ? 'بدء محادثة جديدة' : 'Reset Conversation'}
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => {
                playTapSound();
                onClose();
              }}
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
              title={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* 📜 Messages Conversation Scroll Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-5 relative">
          
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 sm:gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-amber-100 to-emerald-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-2xs mt-1">
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-800" />
                  </div>
                )}

                <div className={`max-w-[88%] sm:max-w-[80%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  {/* Bubble Body */}
                  <div
                    className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-xs sm:text-sm leading-relaxed relative ${
                      isUser
                        ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white rounded-tr-xs shadow-md font-medium'
                        : msg.isLevelD
                        ? 'bg-amber-50/90 border-2 border-amber-400 text-amber-950 rounded-tl-xs shadow-xs'
                        : 'bg-white/95 border border-[#EAE3D6] text-slate-900 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line font-sans">
                      {renderFormattedMessageText(msg.text, isUser)}
                    </div>

                    {/* Sources Badge Footer */}
                    {!isUser && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-150/70 flex flex-wrap items-center gap-1 text-[9.5px] sm:text-[10px] text-slate-500 font-medium">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          {isAr ? 'المصادر المعتمدة:' : 'Sources:'}
                        </span>
                        {msg.sources.map((src, i) => (
                          <span key={i} className="bg-slate-100/90 px-1.5 py-0.2 rounded-md border border-slate-200">
                            {src}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Copy Button */}
                    {!isUser && (
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="flex items-center gap-1 hover:text-slate-700 transition cursor-pointer"
                        >
                          {copiedMsgId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">{isAr ? 'تم النسخ' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{isAr ? 'نسخ' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 🚀 Active Interactive Action Shortcuts */}
                  {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-wrap items-center gap-1.5 pt-0.5"
                    >
                      {msg.suggestedActions.map((act, actIdx) => (
                        <button
                          key={actIdx}
                          onClick={() => handleActionClick(act)}
                          className="px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-emerald-700 to-slate-900 hover:from-emerald-600 hover:to-slate-800 text-white text-[11px] sm:text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs border border-amber-300/40 hover:scale-102 active:scale-95"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>{act.label}</span>
                          <ChevronIcon className="w-3 h-3 text-amber-200" />
                        </button>
                      ))}
                    </motion.div>
                  )}

                </div>

                {isUser && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white shrink-0 shadow-2xs mt-1">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-2xs">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-800 animate-spin" />
              </div>
              <div className="bg-white/95 rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 border border-[#EAE3D6] shadow-2xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] sm:text-xs font-bold text-slate-600 ms-1">
                  {isAr ? 'مرشد عِلم يبحث في المصادر المعتمدة...' : 'ILM Guide searching verified sources...'}
                </span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 🧭 Suggested Questions Carousel Bar (شريط الأسئلة المقترحة) */}
        <div className="px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-md border-t border-[#EAE3D6] shrink-0">
          <div className="flex items-center gap-1.5 mb-1 text-[10px] sm:text-[11px] font-bold text-slate-500">
            <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
            <span>{isAr ? 'أسئلة واستكشافات مقترحة:' : 'Suggested Explorations:'}</span>
          </div>
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {currentSuggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-950 text-[10.5px] sm:text-xs font-medium border border-slate-200 hover:border-amber-300 transition cursor-pointer shadow-3xs shrink-0 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ✍️ Bottom Input Bar */}
        <div className="p-2.5 sm:p-4 bg-white border-t border-[#EAE3D6] shrink-0 shadow-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-1.5 sm:gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isAr ? 'اسأل مرشد عِلم عن أي درس، مسار، أو مسألة...' : 'Ask ILM Guide about any lesson...'}
              disabled={isLoading}
              className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-[#F9F7F2] border border-[#E0D7C6] text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 font-sans min-w-0"
            />

            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition cursor-pointer flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse ring-2 ring-rose-200'
                  : 'bg-[#F9F7F2] hover:bg-amber-100 text-slate-700 border-[#E0D7C6]'
              }`}
              title={isAr ? (isListening ? 'إيقاف التسجيل' : 'التحدث صوتياً') : (isListening ? 'Stop' : 'Voice Input')}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />}
            </button>

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-slate-950 hover:from-amber-500 hover:to-slate-900 disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md border border-amber-400/40 shrink-0"
            >
              <span>{isAr ? 'إرسال' : 'Send'}</span>
              <Send className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </form>
        </div>

      </motion.div>
    </div>
  );
};
