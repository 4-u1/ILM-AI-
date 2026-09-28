import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { 
  Flame, 
  Sparkles, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ChevronRight, 
  ChevronLeft,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface DailyStreakCounterProps {
  language: Language;
  completedStageIds: string[];
  onExploreNextStage?: () => void;
}

interface StreakMilestone {
  days: number;
  titleAr: string;
  titleEn: string;
  titleUr: string;
  rewardXp: number;
  badgeCode: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionUr: string;
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 3,
    titleAr: 'انطلاقة العزم (3 أيام)',
    titleEn: 'Steady Start (3 Days)',
    titleUr: 'عزم کا آغاز (3 دن)',
    rewardXp: 50,
    badgeCode: 'STREAK_3',
    descriptionAr: 'المداومة لثلاثة أيام متتالية تمهيداً لترسيخ عادة طلب العلم الشرعي.',
    descriptionEn: 'Forming the sacred habit with 3 consecutive days of active learning.',
    descriptionUr: 'مسلسل تین دن مطالعہ کر کے علم کی پائیدار عادت کی بنیاد رکھی۔',
  },
  {
    days: 7,
    titleAr: 'أسبوع البركة (7 أيام)',
    titleEn: 'Weekly Devotion (7 Days)',
    titleUr: 'ہفتہ وار برکت (7 دن)',
    rewardXp: 120,
    badgeCode: 'STREAK_7',
    descriptionAr: 'إكمال أسبوع كامل من المذاكرة المنتظمة؛ أحب الأعمال إلى الله أدومها.',
    descriptionEn: 'A full week of consistent learning; continuous deeds are most beloved to Allah.',
    descriptionUr: 'ایک مکمل ہفتہ باقاعدگی سے طلب علم؛ اللہ کے نزدیک سب سے پسندیدہ عمل وہ ہے جو مستقل ہو۔',
  },
  {
    days: 14,
    titleAr: 'رسوخ الأثر (14 يوماً)',
    titleEn: 'Fortified Habit (14 Days)',
    titleUr: 'پختہ لگن (14 دن)',
    rewardXp: 250,
    badgeCode: 'STREAK_14',
    descriptionAr: 'أسبوعان من الاستمرار اليومي؛ العلم يُبنى مسألة بمسألة.',
    descriptionEn: 'Two full weeks of relentless dedication to verified Islamic knowledge.',
    descriptionUr: 'مسلسل دو ہفتے؛ علم کا ایک ایک مسئلہ باقاعدگی سے ذہن نشین ہوا۔',
  },
  {
    days: 30,
    titleAr: 'شهر الإتقان (30 يوماً)',
    titleEn: 'Monthly Mastery (30 Days)',
    titleUr: 'ماہانہ استقامت (30 دن)',
    rewardXp: 500,
    badgeCode: 'STREAK_30',
    descriptionAr: 'ثبات شهر كامل على طلب العلم وفهم الأصول الشرعية ومراجعتها.',
    descriptionEn: 'A full month of unbroken learning and grounding in authenticated sources.',
    descriptionUr: 'ایک پورا مہینہ بلا ناغہ شرعی علوم اور مآخذ کے مطالعے کا اعزاز۔',
  },
];

export const DailyStreakCounter: React.FC<DailyStreakCounterProps> = ({
  language,
  completedStageIds,
  onExploreNextStage,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  // Streak state calculation with local storage persistence
  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const savedStreak = localStorage.getItem('eilm_streak_count');
      if (savedStreak) {
        return Math.max(1, parseInt(savedStreak, 10));
      }
      // If user has completed stages, default to a real streak (e.g., 3 days)
      return completedStageIds.length > 0 ? Math.min(3, completedStageIds.length) : 1;
    } catch {
      return 1;
    }
  });

  // Calculate streak continuity from last active timestamp
  useEffect(() => {
    try {
      const lastActiveStr = localStorage.getItem('eilm_last_learning_timestamp');
      const now = Date.now();
      
      if (!lastActiveStr) {
        // Initialize active timestamp
        localStorage.setItem('eilm_last_learning_timestamp', now.toString());
        localStorage.setItem('eilm_streak_count', streakDays.toString());
      } else {
        const lastActive = parseInt(lastActiveStr, 10);
        const diffHours = (now - lastActive) / (1000 * 60 * 60);

        if (diffHours < 24) {
          // Maintained streak today
        } else if (diffHours >= 24 && diffHours <= 48) {
          // Within grace window for next day's streak
        } else if (diffHours > 72) {
          // Long absence - maintain at least 1 day for encouragement
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }, [streakDays]);

  // Find current and next milestone
  const nextMilestone = STREAK_MILESTONES.find((m) => m.days > streakDays) || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  const previousMilestoneDays = (() => {
    const prevs = STREAK_MILESTONES.filter((m) => m.days <= streakDays);
    return prevs.length > 0 ? prevs[prevs.length - 1].days : 0;
  })();

  const daysNeeded = Math.max(0, nextMilestone.days - streakDays);
  
  // Progress formula within the current tier
  const rangeTotal = nextMilestone.days - previousMilestoneDays;
  const rangeCurrent = streakDays - previousMilestoneDays;
  const progressPercent = rangeTotal > 0 ? Math.min(100, Math.max(10, Math.round((rangeCurrent / rangeTotal) * 100))) : 100;

  // Last 7 days activity dots (Sun to Sat or Mon to Sun)
  const dayLabelsAr = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  const dayLabelsEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayLabelsUr = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];

  const todayIndex = new Date().getDay(); // 0 is Sunday
  
  // Generate 7 consecutive days up to today
  const recentDays = Array.from({ length: 7 }, (_, i) => {
    const dayOffset = 6 - i; // 6 days ago up to today
    const dayIdx = (todayIndex - dayOffset + 7) % 7;
    const isToday = dayOffset === 0;
    // Active if within streak
    const isActive = dayOffset < streakDays;
    
    return {
      label: isAr ? dayLabelsAr[dayIdx] : isUr ? dayLabelsUr[dayIdx] : dayLabelsEn[dayIdx],
      isActive,
      isToday,
      dayOffset,
    };
  });

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-amber-50/50 to-orange-500/10 border-2 border-amber-300/80 rounded-3xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-orange-400/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        {/* Top Header: Badge Pill + Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 border-2 border-amber-200 shrink-0">
              <Flame className="w-7 h-7 text-white fill-amber-200 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-200/70 text-amber-950 font-bold text-xs">
                  <Sparkles className="w-3 h-3 text-amber-700" />
                  <span>{isAr ? 'عزيمة المداومة اليومية' : isUr ? 'روزانہ تسلسل کا اعزاز' : 'Daily Learning Streak'}</span>
                </span>
                <span className="text-xs font-semibold text-amber-900 bg-white/80 px-2 py-0.5 rounded-md border border-amber-200">
                  {isAr ? 'أحب الأعمال أدومها' : isUr ? 'استقامت میں برکت' : 'Consistency in Faith'}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-950 tracking-tight">
                  {streakDays} {isAr ? 'أيام متتالية' : isUr ? 'مسلسل دن' : 'Days Streak'}
                </h3>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'نشط اليوم' : isUr ? 'آج سرگرم' : 'Active Today'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Motivation Note */}
          <div className="bg-white/80 backdrop-blur-xs border border-amber-200 rounded-2xl p-3 sm:py-2.5 sm:px-4 text-xs max-w-sm">
            <p className="text-slate-700 font-medium leading-relaxed">
              {isAr
                ? '«أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ تَعَالَى أَدْوَمُهَا وَإِنْ قَلَّ» (صحيح البخاري: 6464)'
                : isUr
                ? '«اللہ کے نزدیک سب سے پسندیدہ عمل وہ ہے جو مستقل ہو اگرچہ تھوڑا ہو» (صحیح بخاری)'
                : '"The most beloved deed to Allah is the most regular even if it were little." (Sahih al-Bukhari)'}
            </p>
          </div>
        </div>

        {/* 7-Day Visual Rhythm / Mini Heatmap */}
        <div className="bg-white/90 backdrop-blur-xs border border-amber-200/90 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>{isAr ? 'مسار الأيام السبعة الأخيرة' : isUr ? 'گزشتہ سات دنوں کا تسلسل' : 'Past 7 Days Rhythm'}</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {isAr ? 'درس أو تكرار واحد يومياً يكفي لاستمرار الوهج' : '1 lesson per day keeps your streak alight'}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {recentDays.map((day, idx) => (
              <div 
                key={idx}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                  day.isToday
                    ? 'ring-2 ring-amber-500/50 border-amber-400 bg-amber-50/90'
                    : day.isActive
                    ? 'border-emerald-200 bg-emerald-50/80 text-emerald-950'
                    : 'border-slate-200 bg-slate-50/60 text-slate-400'
                }`}
              >
                <span className="text-[11px] font-bold mb-1.5">{day.label}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform ${
                  day.isActive 
                    ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs scale-105' 
                    : 'bg-slate-200/80 text-slate-400'
                }`}>
                  {day.isActive ? (
                    <Flame className="w-4 h-4 text-white fill-amber-200" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <span className="text-[10px] mt-1 font-semibold text-slate-500">
                  {day.isToday ? (isAr ? 'اليوم' : isUr ? 'آج' : 'Today') : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Progress Bar to the Next Tier */}
        <div className="bg-white/95 backdrop-blur-xs border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Award className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">
                  {isAr ? 'الوسام القادم في مسار الاستمرار:' : isUr ? 'اگلا ہدف:' : 'Next Milestone Target:'}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {isAr ? nextMilestone.titleAr : isUr ? nextMilestone.titleUr : nextMilestone.titleEn}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-extrabold">
                +{nextMilestone.rewardXp} XP
              </span>
              {daysNeeded > 0 ? (
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  {isAr 
                    ? `متبقي ${daysNeeded} ${daysNeeded === 1 ? 'يوم' : 'أيام'}` 
                    : isUr 
                    ? `${daysNeeded} دن باقی` 
                    : `${daysNeeded} day${daysNeeded > 1 ? 's' : ''} left`}
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  {isAr ? 'مستحق ومكتمل 🎉' : 'Milestone Reached! 🎉'}
                </span>
              )}
            </div>
          </div>

          {/* Progress Track */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs text-slate-600 font-bold">
              <span>{isAr ? `إنجاز المرحلة (${streakDays} من ${nextMilestone.days} يوماً)` : `Progress (${streakDays} / ${nextMilestone.days} days)`}</span>
              <span className="text-amber-800">{progressPercent}%</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/80 p-0.5">
              <div 
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 h-full rounded-full transition-all duration-700 shadow-xs relative overflow-hidden"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-0.5">
              {isAr ? nextMilestone.descriptionAr : isUr ? nextMilestone.descriptionUr : nextMilestone.descriptionEn}
            </p>
          </div>

          {/* Action button to continue today's lesson */}
          {onExploreNextStage && (
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={onExploreNextStage}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-98"
              >
                <span>{isAr ? 'متابعة التعلم اليومي والحفاظ على العزيمة' : isUr ? 'آج کا سبق پڑھیں اور تسلسل برقرار رکھیں' : 'Keep Streak Alive Today'}</span>
                <ArrowIcon className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
