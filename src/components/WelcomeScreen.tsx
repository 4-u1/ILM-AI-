import React from 'react';
import { Language } from '../types';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  CheckCircle2,
  Globe
} from 'lucide-react';
import { IslamicDateDisplay } from './IslamicDateDisplay';

interface WelcomeScreenProps {
  language: Language;
  onStart: () => void;
  onSelectLanguage?: (lang: Language) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  language,
  onStart,
  onSelectLanguage,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[540px] h-96 sm:h-[540px] bg-gradient-to-tr from-amber-600/20 via-orange-500/15 to-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Welcome Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#FCFAF6] border-2 border-[#E7DFD3] rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-900">
        
        {/* Subtle Moroccan geometric accent line on top */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-700 via-amber-500 to-emerald-700" />

        {/* Header Controls: Date & Language Switcher */}
        <div className="px-6 sm:px-8 pt-5 pb-2 flex items-center justify-between border-b border-[#EFE8DC]/80 bg-[#F7F2EA]/60 text-xs">
          <div className="text-slate-600 font-medium">
            <IslamicDateDisplay language={language} variant="navbar" />
          </div>

          {onSelectLanguage && (
            <div className="flex items-center gap-1.5 bg-white/90 border border-[#E0D7C7] rounded-full px-2 py-1 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <button
                type="button"
                onClick={() => onSelectLanguage('ar')}
                className={`text-xs font-bold px-2 py-0.5 rounded-full transition ${
                  language === 'ar' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => onSelectLanguage('en')}
                className={`text-xs font-bold px-2 py-0.5 rounded-full transition ${
                  language === 'en' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onSelectLanguage('ur')}
                className={`text-xs font-bold px-2 py-0.5 rounded-full transition ${
                  language === 'ur' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                اردو
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 flex flex-col items-center text-center space-y-6">
          
          {/* Logo Badge Presentation */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 text-white flex flex-col items-center justify-center shadow-xl border-4 border-[#EADFCF] relative z-10 group">
              <span className="font-brand text-4xl sm:text-5xl font-bold tracking-tight text-amber-100 select-none drop-shadow-sm">
                عِلم
              </span>
              <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase mt-0.5 font-sans">
                ILM
              </span>
            </div>
            {/* Soft decorative glow ring */}
            <div className="absolute inset-0 bg-amber-500/25 rounded-3xl blur-xl -z-0 scale-125 pointer-events-none" />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-950 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>
                {isAr
                  ? 'منصة دعوة وتعليم دعوي ذكية بالذكاء الاصطناعي'
                  : isUr
                  ? 'مصنوعی ذہانت پر مبنی اسلامی دعوتی و تعلیمی پلیٹ فارم'
                  : 'AI-Powered Islamic Learning & Mentorship Platform'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-serif tracking-tight pt-1">
              {isAr
                ? 'مرحباً بك في منصة عِلم'
                : isUr
                ? 'پلیٹ فارم عِلم میں خوش آمدید'
                : 'Welcome to Eilm Platform'}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {isAr
                ? 'رحلتك المعرفية التفاعلية المخصصة التي تحاكي المعلم الشخصي؛ وفق نصوص ومصادر شرعية محققة 100% ودون هلوسة.'
                : isUr
                ? 'آپ کا ذاتی اور انٹرایکٹو تعلیمی سفر جو مستند شرعی مآخذ کے مطابق بغیر کسی غلط بیانی کے رہنمائی فراہم کرتا ہے۔'
                : 'Your personalized, interactive learning journey simulating a personal mentor, grounded in 100% verified authentic sources.'}
            </p>
          </div>

          {/* Key Value Propositions (3 Pills/Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-1 text-right sm:text-center">
            
            <div className="flex sm:flex-col items-center gap-3 p-3.5 rounded-2xl bg-white/90 border border-[#EBE4D8] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5 text-amber-700" />
              </div>
              <div className="text-start sm:text-center">
                <h4 className="text-xs font-bold text-slate-900">
                  {isAr ? '4 مسارات موجهة' : isUr ? '4 مخصوص راستے' : '4 Targeted Tracks'}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  {isAr ? 'غير مسلم، مسلم جديد، المسلم الأصل، وداعية' : isUr ? 'غیر مسلم، نو مسلم، مسلمِ اصل، اور داعی' : 'Inquirers, New Muslims, Born Muslims & Daiyahs'}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-3 p-3.5 rounded-2xl bg-white/90 border border-[#EBE4D8] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="text-start sm:text-center">
                <h4 className="text-xs font-bold text-slate-900">
                  {isAr ? 'مصادر معتمدة 100%' : isUr ? '100% مستند مآخذ' : '100% Verified Sources'}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  {isAr ? 'مجمع الملك فهد وموسوعة الدرر السنية' : isUr ? 'مجمع شاہ فہد اور درر سنیہ' : 'King Fahd Complex & Dorar.net'}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-3 p-3.5 rounded-2xl bg-white/90 border border-[#EBE4D8] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-indigo-700" />
              </div>
              <div className="text-start sm:text-center">
                <h4 className="text-xs font-bold text-slate-900">
                  {isAr ? 'شهادات وأوسمة إنجاز' : isUr ? 'اسناد اور اعزازات' : 'Certified Completion'}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  {isAr ? 'شهادة إلكترونية برمز تحقق مشفر' : isUr ? 'تصدیق شدہ برقی اسناد' : 'Verified Digital Certificates & Badges'}
                </p>
              </div>
            </div>

          </div>

          {/* Primary Action Button: "Start Your Journey" */}
          <div className="w-full pt-2 space-y-3">
            <button
              type="button"
              onClick={onStart}
              className="w-full sm:w-auto min-w-[260px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-slate-950 text-white font-bold text-base sm:text-lg shadow-xl shadow-amber-900/20 hover:from-amber-500 hover:to-slate-900 hover:shadow-2xl transition transform active:scale-98 cursor-pointer"
            >
              <span>{isAr ? 'ابدأ رحلتك المعرفية' : isUr ? 'اپنا تعلیمی سفر شروع کریں' : 'Start Your Journey'}</span>
              <ArrowIcon className="w-5 h-5 text-amber-200" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {isAr
                  ? 'لا يتطلب تسجيلاً مسبقاً، يمكنك البدء كضيف فوراً'
                  : isUr
                  ? 'کسی پیشگی رجسٹریشن کی ضرورت نہیں، بطور مہمان فوری آغاز کریں'
                  : 'No mandatory registration required — begin instantly as a guest'}
              </span>
            </div>
          </div>

        </div>

        {/* Footer Credit Line */}
        <div className="px-6 py-3 bg-[#F2ECE2] border-t border-[#E5DDD0] text-center text-[11px] text-slate-500 font-medium">
          <span>{isAr ? 'مشروع فريق NEX — تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي (باذل 2026م)' : 'Team NEX — AI Islamic Content Challenge (Bathel 2026)'}</span>
        </div>

      </div>
    </div>
  );
};
