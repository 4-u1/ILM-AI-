import React, { useState } from 'react';
import { Language } from '../types';
import { 
  Sparkles, 
  Compass, 
  Map, 
  Bot, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Check, 
  BookOpen,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onStartJourney?: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({
  isOpen,
  onClose,
  language,
  onStartJourney,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const isAr = language === 'ar';
  const NextChevron = isAr ? ChevronLeft : ChevronRight;
  const PrevChevron = isAr ? ChevronRight : ChevronLeft;

  if (!isOpen) return null;

  const steps = [
    {
      id: 'welcome',
      icon: Sparkles,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50 border-amber-200',
      tagAr: 'مرحباً بك في منصة عِلم | ILM',
      tagEn: 'Welcome to ILM | عِلم',
      titleAr: 'دليلك المعرفي الموثوق لتعلم الإسلام',
      titleEn: 'Your Verified Journey to Learning Islam',
      descriptionAr:
        'منصة تعليمية ودعوية متطورة تجمع بين أصالة المحتوى الشرعي المعتمد من مجمع الملك فهد والدرر السنية، وأحدث أدوات التوجيه المعرفي التفاعلي.',
      descriptionEn:
        'An advanced educational platform combining verified authentic content (King Fahd Complex, Dorar.net) with state-of-the-art interactive learning guidance.',
      featureTitleAr: 'ماذا تقدم لك المنصة؟',
      featureTitleEn: 'What does Eilm offer?',
      highlights: isAr
        ? [
            '4 مسارات متخصصة (المسلم الأصل، المسلم الجديد، غير المسلم، والداعية)',
            'خارطة تعلم تفاعلية متدرجة خطوة بخطوة',
            'مساعد ذكي مدعوم بمصادر معتمدة دون فتاوى تلقائية',
          ]
        : [
            '4 specialized pathways (Born Muslim, New Muslim, Inquirer, Da\'iyah)',
            'Step-by-step interactive knowledge journey map',
            'Smart assistant grounded in verified sources (zero unvetted fatwas)',
          ],
    },
    {
      id: 'journeymap',
      icon: Map,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-200',
      tagAr: 'خريطة التعلم التفاعلية',
      tagEn: 'Interactive Journey Map',
      titleAr: 'تدرج تعليمي واضح مع قياس حقيقي للإنجاز',
      titleEn: 'Structured Progression with Real Milestones',
      descriptionAr:
        'تتيح لك خريطة التعلم متابعة تقدمك في كل مسار عبر محطات معرفية متسلسلة تبدأ من الأساسيات وتنتقل بك إلى التطبيق العملي والاختبارات التفاعلية.',
      descriptionEn:
        'The Journey Map guides you stage by stage through core foundations, practical applications, and milestone quizzes with real progress metrics.',
      featureTitleAr: 'ميزات خريطة التعلم:',
      featureTitleEn: 'Journey Map Highlights:',
      highlights: isAr
        ? [
            'شريط إنجاز ذكي (ProgressBar) يوضح خطواتك المتبقية ونسبة الإتمام',
            'مؤشرات بصرية للحالات (مكتملة، حالية، مقفلة حتى إتمام السابقة)',
            'شهادة إتمام رقمية رسمية موثقة فور إتمام جميع المحطات',
          ]
        : [
            'Smart ProgressBar calculating completion rate dynamically',
            'Clear milestone indicators (Completed, In Progress, Locked)',
            'Official digital verified certificate upon track completion',
          ],
    },
    {
      id: 'ai-assistant',
      icon: Bot,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-200',
      tagAr: 'المساعد الذكي الموثوق',
      tagEn: 'Smart Verified Assistant',
      titleAr: 'إجابات مدعومة بالمصادر ومحاكاة حوارية',
      titleEn: 'Source-Grounded Answers & Dialogue Simulation',
      descriptionAr:
        'تم تدريب المساعد الذكي في كل درس ومحطة للإجابة عن أسئلتك استناداً حصرياً إلى نصوص القرآن والسنة والتفاسير المعتمدة، مع تفادي التكلف أو الفتوى بدون علم.',
      descriptionEn:
        'The integrated AI is rigorously grounded to answer inquiries strictly using Quranic verses, authentic Hadiths, and verified classical commentaries.',
      featureTitleAr: 'ضوابط المساعد ومحاكي الداعية:',
      featureTitleEn: 'Assistant & Simulator Standards:',
      highlights: isAr
        ? [
            'استشهادات مباشرة برقم الآية وتخريج الحديث في كل رد',
            'مختبر موثوقية (Verification Lab) لفحص الأدلة والتحقق من صحتها',
            'محاكي الداعية (Simulator) للتدرب على الحوار الحضاري بالحكمة',
          ]
        : [
            'Direct Quran & Hadith citations with authenticity gradings',
            'Verification Lab to audit sources and reject fabricated claims',
            'Da\'iyah Simulator for practicing compassionate dialogue',
          ],
    },
  ];

  const current = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('eilm_onboarding_completed', 'true');
    } catch (e) {
      console.error(e);
    }
    onClose();
    if (onStartJourney) {
      onStartJourney();
    }
  };

  const CurrentIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Decorative Strip */}
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-amber-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <span className="font-brand text-2xl font-bold tracking-normal select-none">
              <span className="logo-word text-white">علم</span>
            </span>
            <span className="text-xs text-amber-200/90 font-medium border-s border-white/20 ps-2.5">
              {isAr ? 'دليل الانطلاق والتعريف' : 'Platform Walkthrough'}
            </span>
          </div>

          <button
            onClick={handleComplete}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-slate-300 hover:text-white"
            title={isAr ? 'تخطي الدليل' : 'Skip walkthrough'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* Step Tag & Icon */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs">
              <span className={`w-2 h-2 rounded-full ${current.iconColor.replace('text-', 'bg-')}`}></span>
              <span className="text-slate-700">{isAr ? current.tagAr : current.tagEn}</span>
            </div>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${current.iconBg}`}>
              <CurrentIcon className={`w-6 h-6 ${current.iconColor}`} />
            </div>
          </div>

          {/* Titles & Description */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isAr ? current.titleAr : current.titleEn}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {isAr ? current.descriptionAr : current.descriptionEn}
            </p>
          </div>

          {/* Highlight Points Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isAr ? current.featureTitleAr : current.featureTitleEn}</span>
            </h3>
            <ul className="space-y-2">
              {current.highlights.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Navigation & Pagination Bar */}
        <div className="px-6 py-4 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between gap-3">
          
          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? 'w-6 bg-slate-900'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`الخطوة ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-white transition cursor-pointer flex items-center gap-1"
              >
                <PrevChevron className="w-4 h-4" />
                <span>{isAr ? 'السابق' : 'Previous'}</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>{isLast ? (isAr ? 'ابدأ الآن' : 'Get Started') : (isAr ? 'التالي' : 'Next')}</span>
              <NextChevron className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
