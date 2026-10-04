import React from 'react';
import { Sparkles, ShieldCheck, BookOpen, Loader2 } from 'lucide-react';
import { Language } from '../types';

interface AILoadingSpinnerProps {
  language: Language;
  title?: string;
  subtitle?: string;
  variant?: 'fullscreen' | 'overlay' | 'inline';
}

export const AILoadingSpinner: React.FC<AILoadingSpinnerProps> = ({
  language,
  title,
  subtitle,
  variant = 'overlay',
}) => {
  const isAr = language === 'ar';

  const defaultTitle = isAr
    ? 'جارٍ صياغة الرد المؤصل بالذكاء الاصطناعي...'
    : 'Formulating Verified AI Response...';

  const defaultSubtitle = isAr
    ? 'يتم فحص الاستجابة ومطابقتها مع المصادر الشرعية وسياج الحماية المعتمد'
    : 'Grounding query against verified Islamic repositories and ethical guardrails';

  const displayTitle = title || defaultTitle;
  const displaySubtitle = subtitle || defaultSubtitle;

  const content = (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-3xl border border-amber-200/90 shadow-2xl max-w-sm sm:max-w-md mx-4 text-center animate-in fade-in zoom-in-95 duration-200">
      {/* Decorative Outer Glow & Dual-Ring Spinner */}
      <div className="relative flex items-center justify-center w-20 h-20 mb-4">
        {/* Outer Pulsing Glow */}
        <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping"></div>
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-amber-600/20 blur-sm"></div>

        {/* Outer Track Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-amber-100"></div>

        {/* Spinning Gradient Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-amber-600 border-t-transparent border-l-transparent animate-spin"></div>

        {/* Reverse Spinning Inner Ring */}
        <div className="absolute inset-2 rounded-full border-2 border-emerald-600 border-b-transparent border-r-transparent animate-[spin_1.5s_linear_infinite_reverse]"></div>

        {/* Center Emblem */}
        <div className="w-10 h-10 rounded-full bg-amber-700 text-white flex items-center justify-center shadow-md">
          <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 flex items-center gap-2 justify-center">
        <span>{displayTitle}</span>
      </h3>

      {/* Subtitle / Grounding Explanation */}
      <p className="text-xs text-slate-600 leading-relaxed mb-4">
        {displaySubtitle}
      </p>

      {/* Safety & Grounding Badge */}
      <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-semibold text-amber-900">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>{isAr ? 'مجمع الملك فهد • الدرر السنية • المستودع الدعوي' : 'Verified Repositories • Strict RAG'}</span>
      </div>
    </div>
  );

  if (variant === 'inline') {
    return (
      <div className="w-full flex justify-center py-6">
        {content}
      </div>
    );
  }

  // Overlay variant (centers over container with backdrop blur)
  return (
    <div className="absolute inset-0 z-30 bg-slate-900/25 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300">
      {content}
    </div>
  );
};
