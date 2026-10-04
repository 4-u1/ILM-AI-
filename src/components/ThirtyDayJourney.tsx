import React, { useState } from 'react';
import { Language, DailyJourneyStep } from '../types';
import { THIRTY_DAY_STEPS } from '../data/innovationsData';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Sun,
  ShieldCheck,
  Award,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface ThirtyDayJourneyProps {
  language: Language;
  onBack: () => void;
  onNavigateToShahada?: () => void;
}

export const ThirtyDayJourney: React.FC<ThirtyDayJourneyProps> = ({
  language,
  onBack,
  onNavigateToShahada,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Track completed days persistent in local storage
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('eilm_30day_completed');
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });

  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);

  const activeStep = THIRTY_DAY_STEPS.find((s) => s.dayNumber === activeDayNumber) || THIRTY_DAY_STEPS[0];

  const handleToggleComplete = (day: number) => {
    let updated: number[];
    if (completedDays.includes(day)) {
      updated = completedDays.filter((d) => d !== day);
    } else {
      updated = [...completedDays, day];
    }
    setCompletedDays(updated);
    try {
      localStorage.setItem('eilm_30day_completed', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const progressPercent = Math.round((completedDays.length / THIRTY_DAY_STEPS.length) * 100);

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

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span>{isAr ? 'برنامج الأيام الـ 30 الأولى للمهتدي' : 'First 30 Days Foundations'}</span>
        </span>
      </div>

      {/* Hero Card */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-850 to-teal-950 p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              {isAr ? 'خطوة واحدة مباركة كل يوم' : 'One blessed, focused step each day'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isAr ? 'الأيام الـ 30 الأولى: رحلة التثبيت والسكينة' : 'The First 30 Days: Serenity & Growth'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {isAr
                ? 'مصمم للمسلم الجديد لمنع التشتت وكثرة المعلومات؛ كل يوم خطوة عملية واحدة، ودعاء نبوي ميسر، مع تأصيل فقهي هادئ وفق سنة الحبيب المصطفى ﷺ.'
                : 'Designed for new Muslims to avoid overwhelm: one practical action, one supplication, and peaceful grounding per day.'}
            </p>
          </div>

          {/* Progress Circle & Status */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center shrink-0 w-36 text-center">
            <div className="text-2xl font-black text-amber-300">{progressPercent}%</div>
            <div className="text-[11px] text-emerald-200 mt-0.5">
              {completedDays.length} {isAr ? 'من 30 يوماً' : 'of 30 days'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Day Selector & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Days Navigation Grid */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isAr ? 'أيام البرنامج التدريجي' : 'Daily Progress'}
          </div>

          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {THIRTY_DAY_STEPS.map((step) => {
              const isDone = completedDays.includes(step.dayNumber);
              const isActive = step.dayNumber === activeDayNumber;
              return (
                <button
                  key={step.dayNumber}
                  onClick={() => setActiveDayNumber(step.dayNumber)}
                  className={`w-full text-right p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-2xs font-bold text-slate-900'
                      : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                      {step.dayNumber}
                    </span>
                    <span className="text-xs truncate">
                      {isAr ? step.titleAr : step.titleEn}
                    </span>
                  </div>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Content Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {isAr ? `اليوم رقم ${activeStep.dayNumber}` : `Day ${activeStep.dayNumber}`}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                {isAr ? activeStep.titleAr : activeStep.titleEn}
              </h2>
            </div>

            <button
              onClick={() => handleToggleComplete(activeStep.dayNumber)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                completedDays.includes(activeStep.dayNumber)
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {completedDays.includes(activeStep.dayNumber)
                  ? (isAr ? 'تم إنجاز هذا اليوم ✓' : 'Completed ✓')
                  : (isAr ? 'تأكيد إنجاز واجب اليوم' : 'Mark as Done')}
              </span>
            </button>
          </div>

          {/* 1. Core Concept */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>{isAr ? 'الفكرة والمقصد الإيماني:' : 'Spiritual Concept:'}</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
              {isAr ? activeStep.conceptShortAr : activeStep.conceptShortEn}
            </p>
          </div>

          {/* 2. Practical Action of the Day */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isAr ? 'الواجب العملي الميسر لليوم:' : 'Today\'s Practical Action:'}</span>
            </span>
            <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
              {isAr ? activeStep.practicalActionAr : activeStep.practicalActionEn}
            </p>
          </div>

          {/* 3. Daily Prophetic Supplication */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
            <span className="text-[11px] font-bold text-amber-900 uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{isAr ? 'دعاء اليوم النبوي المأثور:' : 'Today\'s Prophetic Du\'a:'}</span>
            </span>
            <p className="text-sm sm:text-base font-serif font-bold text-amber-950 leading-relaxed">
              {activeStep.dailySupplicationAr}
            </p>
            <p className="text-xs text-amber-800 italic">
              {activeStep.dailySupplicationEn}
            </p>
          </div>

          {/* Source Attribution */}
          <div className="pt-2 text-[11px] text-slate-500 font-mono flex items-center gap-1.5 border-t border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{activeStep.sourceReference.title} ({activeStep.sourceReference.referenceDetail})</span>
          </div>

        </div>

      </div>

    </div>
  );
};
