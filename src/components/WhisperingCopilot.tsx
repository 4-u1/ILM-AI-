import React, { useState } from 'react';
import { Language, WhisperingPrompt } from '../types';
import { WHISPERING_PROMPTS } from '../data/innovationsData';
import { 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft, 
  MessageSquare, 
  Copy, 
  Check, 
  Search, 
  ExternalLink, 
  Mic, 
  Lightbulb,
  Volume2
} from 'lucide-react';

interface WhisperingCopilotProps {
  language: Language;
  onBack: () => void;
  onNavigateToSimulator?: () => void;
}

export const WhisperingCopilot: React.FC<WhisperingCopilotProps> = ({
  language,
  onBack,
  onNavigateToSimulator,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [activePrompt, setActivePrompt] = useState<WhisperingPrompt>(WHISPERING_PROMPTS[0]);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrompts = WHISPERING_PROMPTS.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.scenarioTitleAr.toLowerCase().includes(q) ||
      p.scenarioTitleEn.toLowerCase().includes(q) ||
      p.commonDoubtAr.toLowerCase().includes(q) ||
      p.commonDoubtEn.toLowerCase().includes(q)
    );
  });

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{isAr ? 'العودة للمنصة' : 'Back to Platform'}</span>
        </button>

        <div className="flex items-center gap-2">
          {onNavigateToSimulator && (
            <button
              onClick={onNavigateToSimulator}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              {isAr ? 'الانتقال لمحاكي الداعية' : 'Go to Simulator'}
            </button>
          )}
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>{isAr ? 'المساعد الدعوي الميداني' : 'Field Whispering Co-Pilot'}</span>
          </span>
        </div>
      </div>

      {/* Hero Intro */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          {isAr ? 'المساعد الدعوي الفوري للرد على الشبهات' : 'Field Whispering Co-Pilot'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          {isAr
            ? 'درعك المعرفي الحي في مواقف الحوار اليومية بالجامعة والمكتب والميدان: حجة عقلية فورية، دليل شرعي مسند، وإرشاد الحكمة النبوية في ثوانٍ معدودة.'
            : 'Your live conversational shield during campus, workplace, and street interactions: instant rational reasoning, verified scriptural proof, and prophetic wisdom.'}
        </p>
      </div>

      {/* Search Filter with Voice Recognition */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث في الشبهات الطارئة أو تحدث صوتياً (مثل: صدفة، نبوة، حقوق المرأة، حفظ القرآن)...' : 'Search rapid rebuttal scenarios...'}
            className="w-full bg-white border border-slate-300 rounded-2xl py-2.5 pr-10 pl-4 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            const SpeechRecognition =
              (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognition) {
              alert(isAr ? 'متصفحك لا يدعم الإدخال الصوتي.' : 'Voice input not supported in this browser.');
              return;
            }
            try {
              const recognition = new SpeechRecognition();
              recognition.lang = isAr ? 'ar-SA' : 'en-US';
              recognition.onresult = (event: any) => {
                const text = event.results[0][0].transcript;
                if (text) setSearchQuery(text);
              };
              recognition.start();
            } catch (e) {
              console.warn(e);
            }
          }}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition cursor-pointer shadow-2xs"
          title={isAr ? 'بحث صوتي فوري' : 'Voice Search'}
        >
          <Mic className="w-4 h-4 text-amber-600" />
        </button>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Scenarios Sidebar */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            {isAr ? 'مواقف وشبهات متكررة' : 'Common Field Scenarios'} ({filteredPrompts.length})
          </div>

          <div className="space-y-2">
            {filteredPrompts.map((p) => {
              const isSelected = p.id === activePrompt.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePrompt(p)}
                  className={`w-full text-right p-4 rounded-2xl border transition cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-300'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 leading-snug">
                      {isAr ? p.scenarioTitleAr : p.scenarioTitleEn}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                      {p.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {isAr ? p.commonDoubtAr : p.commonDoubtEn}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rapid Rebuttal Detailed Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          
          {/* Card Header */}
          <div className="border-b border-slate-100 pb-4 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Zap className="w-3.5 h-3.5" />
              <span>{isAr ? 'بطاقة الرد السريع المسندة' : 'Verified Rapid Rebuttal Card'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {isAr ? activePrompt.scenarioTitleAr : activePrompt.scenarioTitleEn}
            </h2>
          </div>

          {/* 1. What the Inquirer said */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1">
            <div className="text-[11px] font-bold text-rose-800 uppercase flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>{isAr ? 'سياق الشبهة أو السؤال المطروح:' : 'Inquirer\'s Common Claim:'}</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
              «{isAr ? activePrompt.commonDoubtAr : activePrompt.commonDoubtEn}»
            </p>
          </div>

          {/* 2. Instant Rational Argument (The Core) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'الحجة العقلية المقنعة (في ثوانٍ):' : 'Instant Rational Argument:'}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      const utterance = new SpeechSynthesisUtterance(isAr ? activePrompt.rapidAnswerAr : activePrompt.rapidAnswerEn);
                      utterance.lang = isAr ? 'ar-SA' : 'en-US';
                      utterance.rate = 0.95;
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  className="text-xs font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1 transition cursor-pointer"
                  title={isAr ? 'الاستماع للنطق الصوتي الوقور' : 'Listen to Audio'}
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isAr ? 'استماع' : 'Listen'}</span>
                </button>

                <button
                  onClick={() => handleCopy('answer', isAr ? activePrompt.rapidAnswerAr : activePrompt.rapidAnswerEn)}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedSection === 'answer' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'answer' ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                </button>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
              {isAr ? activePrompt.rapidAnswerAr : activePrompt.rapidAnswerEn}
            </p>
          </div>

          {/* 3. Scripture Proof */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
            <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isAr ? 'الدليل القرآني والنبوي المعتمد:' : 'Scriptural Proof:'}</span>
            </div>
            <p className="text-sm sm:text-base font-serif font-bold text-emerald-950 leading-relaxed">
              {activePrompt.scriptureProofAr}
            </p>
            <p className="text-xs text-emerald-800 font-sans italic">
              {activePrompt.scriptureProofEn}
            </p>
            <div className="pt-2 text-[10px] text-emerald-700 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{activePrompt.sourceReference.title} ({activePrompt.sourceReference.referenceDetail})</span>
            </div>
          </div>

          {/* 4. Prophetic Wisdom Advice */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1">
            <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isAr ? 'توجيه الحكمة النبوية وأدب الخطاب:' : 'Prophetic Manner & Approach:'}</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              {isAr ? activePrompt.wisdomAdviceAr : activePrompt.wisdomAdviceEn}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
