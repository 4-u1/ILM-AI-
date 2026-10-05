import React, { useState } from 'react';
import { TrackId, Language, AchievementBadge, AchievementCategory } from '../types';
import { ACHIEVEMENTS_REGISTRY } from '../data/achievementsData';
import { getStoredXP } from '../utils/xpManager';
import { DailyStreakCounter } from './DailyStreakCounter';
import { LearningAnalytics } from './LearningAnalytics';
import { ShareAchievementModal } from './ShareAchievementModal';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Compass, 
  Sun, 
  HeartHandshake, 
  BookOpen, 
  HelpCircle, 
  Bot, 
  ShieldCheck, 
  TrendingUp, 
  Share2, 
  Copy, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  User,
  Flame,
  Star,
  ExternalLink,
  ChevronRight,
  Filter,
  Send
} from 'lucide-react';

interface AchievementsDashboardProps {
  language: Language;
  completedStageIds: string[];
  selectedTrack: TrackId | null;
  onNavigateToStage?: (stageId: string) => void;
  onNavigateToCertificate?: () => void;
  onNavigateToSimulator?: () => void;
  onBack?: () => void;
}

export const AchievementsDashboard: React.FC<AchievementsDashboardProps> = ({
  language,
  completedStageIds,
  selectedTrack,
  onNavigateToStage,
  onNavigateToCertificate,
  onNavigateToSimulator,
  onBack,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
  const [copiedBadge, setCopiedBadge] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Retrieve user name from local storage or fallback
  const userName = (() => {
    try {
      const saved = localStorage.getItem('eilm_student_name');
      if (saved && saved.trim()) return saved;
      return isAr ? 'طالب العلم المستمر' : isUr ? 'طالبِ علم' : 'Dedicated Learner';
    } catch {
      return isAr ? 'طالب العلم المستمر' : 'Dedicated Learner';
    }
  })();

  // Check if simulator session was ever finished
  const simulatorCompleted = (() => {
    try {
      return localStorage.getItem('eilm_simulator_completed') === 'true';
    } catch {
      return false;
    }
  })();

  const currentStreak = (() => {
    try {
      const saved = localStorage.getItem('eilm_streak_count');
      if (saved) return Math.max(1, parseInt(saved, 10));
      return completedStageIds.length > 0 ? Math.min(3, completedStageIds.length) : 1;
    } catch {
      return 1;
    }
  })();

  const context = {
    completedStageIds,
    selectedTrack,
    simulatorCompleted,
    learnerName: userName,
    streakDays: currentStreak,
  };

  // Compute stats
  const totalBadges = ACHIEVEMENTS_REGISTRY.length;
  const unlockedBadges = ACHIEVEMENTS_REGISTRY.filter((b) => b.isUnlocked(context));
  const unlockedCount = unlockedBadges.length;
  const overallPercent = Math.round((unlockedCount / totalBadges) * 100);

  const totalPossibleXp = ACHIEVEMENTS_REGISTRY.reduce((acc, b) => acc + b.xpPoints, 0) + (completedStageIds.length * 50);
  const earnedXp = Math.max(getStoredXP(), unlockedBadges.reduce((acc, b) => acc + b.xpPoints, 0));

  // Filtered badges
  const filteredBadges = activeCategory === 'all'
    ? ACHIEVEMENTS_REGISTRY
    : ACHIEVEMENTS_REGISTRY.filter((b) => b.category === activeCategory);

  // Icon mapping
  const renderIcon = (name: string, className: string) => {
    switch (name) {
      case 'Compass': return <Compass className={className} />;
      case 'Sun': return <Sun className={className} />;
      case 'HeartHandshake': return <HeartHandshake className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'HelpCircle': return <HelpCircle className={className} />;
      case 'Award': return <Award className={className} />;
      case 'Bot': return <Bot className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Send': return <Send className={className} />;
      default: return <Award className={className} />;
    }
  };

  // Color schemes for badges
  const getColorStyles = (scheme: AchievementBadge['colorScheme'], isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        bg: 'bg-slate-100/90',
        border: 'border-slate-200',
        ring: 'border-slate-300',
        iconBg: 'bg-slate-200/80',
        iconColor: 'text-slate-400',
        textColor: 'text-slate-500',
        badgePill: 'bg-slate-200/70 text-slate-600',
        glow: '',
      };
    }

    switch (scheme) {
      case 'gold':
        return {
          bg: 'bg-gradient-to-br from-amber-50 to-yellow-50/80',
          border: 'border-amber-300',
          ring: 'border-amber-400/50',
          iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20',
          iconColor: 'text-slate-950',
          textColor: 'text-amber-950',
          badgePill: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
          glow: 'hover:shadow-lg hover:shadow-amber-500/10',
        };
      case 'emerald':
        return {
          bg: 'bg-gradient-to-br from-emerald-50 to-teal-50/80',
          border: 'border-emerald-300',
          ring: 'border-emerald-400/50',
          iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20',
          iconColor: 'text-white',
          textColor: 'text-emerald-950',
          badgePill: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
          glow: 'hover:shadow-lg hover:shadow-emerald-500/10',
        };
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-indigo-50/80',
          border: 'border-blue-300',
          ring: 'border-blue-400/50',
          iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20',
          iconColor: 'text-white',
          textColor: 'text-blue-950',
          badgePill: 'bg-blue-100 text-blue-900 border-blue-300 font-bold',
          glow: 'hover:shadow-lg hover:shadow-blue-500/10',
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50/80',
          border: 'border-purple-300',
          ring: 'border-purple-400/50',
          iconBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-md shadow-purple-500/20',
          iconColor: 'text-white',
          textColor: 'text-purple-950',
          badgePill: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
          glow: 'hover:shadow-lg hover:shadow-purple-500/10',
        };
      case 'rose':
        return {
          bg: 'bg-gradient-to-br from-rose-50 to-pink-50/80',
          border: 'border-rose-300',
          ring: 'border-rose-400/50',
          iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20',
          iconColor: 'text-white',
          textColor: 'text-rose-950',
          badgePill: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
          glow: 'hover:shadow-lg hover:shadow-rose-500/10',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-amber-50 to-orange-50/80',
          border: 'border-amber-300',
          ring: 'border-amber-400/50',
          iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20',
          iconColor: 'text-white',
          textColor: 'text-slate-900',
          badgePill: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
          glow: 'hover:shadow-lg hover:shadow-amber-500/10',
        };
    }
  };

  const handleShareBadge = (badge: AchievementBadge) => {
    const textToShare = isAr
      ? `🏆 حققت وسام «${badge.title}» في منصة «عِلم» للتعليم الإسلامي الموثوق! تم توثيق إنجازي عبر المصادر المعتمدة.`
      : isUr
      ? `🏆 میں نے معتبر تعلیمی پلیٹ فارم «علم» پر «${badge.titleUr}» ڈیجیٹل بیج حاصل کر لیا ہے!`
      : `🏆 I just earned the "${badge.titleEn}" digital badge on ILM platform! Verified Islamic learning with certified sources.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToShare);
      setCopiedBadge(badge.id);
      setTimeout(() => setCopiedBadge(null), 2500);
    }
  };

  // Rank determination based on earned XP
  const getLearnerRank = (xp: number) => {
    if (xp >= 1000) {
      return {
        titleAr: 'عالم باحث متمكن',
        titleEn: 'Distinguished Scholar',
        titleUr: 'ممتاز محقق و عالم',
        level: 4,
        nextThreshold: 1500,
      };
    }
    if (xp >= 500) {
      return {
        titleAr: 'مستمسك بالأصول والسنن',
        titleEn: 'Accomplished Disciple',
        titleUr: 'پختہ طالب علم',
        level: 3,
        nextThreshold: 1000,
      };
    }
    if (xp >= 200) {
      return {
        titleAr: 'سالك مدارج الفهم',
        titleEn: 'Active Explorer',
        titleUr: 'سرگرم متلاشی علم',
        level: 2,
        nextThreshold: 500,
      };
    }
    return {
      titleAr: 'طالب علم مبتدئ',
      titleEn: 'Knowledge Seeker',
      titleUr: 'مبتدی طالب علم',
      level: 1,
      nextThreshold: 200,
    };
  };

  const rank = getLearnerRank(earnedXp);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D6] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                title={isAr ? 'الرجوع' : 'Go back'}
              >
                <ArrowIcon className="w-4 h-4" />
              </button>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>{isAr ? 'لوحة الأوسمة الرقمية والتحفيز' : isUr ? 'ڈیجیٹل اعزازات و بیجز' : 'Achievements & Badges'}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight">
            {isAr ? 'أوسمة الإنجاز والمسيرة المعرفية' : isUr ? 'تعلیمی کامیابیاں اور اعزازی بیجز' : 'Digital Badges & Milestones'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {isAr
              ? 'تتويج خطواتك في طلب العلم الشرعي الموثوق؛ كل وسام يمثل محطة أو مفهوماً أصيلاً أنجزته بالأدلة من الكتاب والسنة.'
              : isUr
              ? 'مستند شرعی علوم میں آپ کے علمی سفر کی عکاسی؛ ہر بیج قرآن و سنت سے ثابت شدہ کسی خاص علمی مرحلے کی تکمیل کا گواہ ہے۔'
              : 'Gamifying your verified Islamic journey: earn distinctive digital badges by mastering authenticated milestones and curriculum stages.'}
          </p>
        </div>

        {/* User Profile Mini Card & Share Achievement Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-slate-950 text-white font-bold text-xs sm:text-sm shadow-md hover:from-amber-500 hover:to-slate-900 transition cursor-pointer active:scale-98 shrink-0"
            title={isAr ? 'مشاركة بطاقة الإنجاز في وسائل التواصل الاجتماعي' : 'Share achievement on social media'}
          >
            <Share2 className="w-4 h-4 text-amber-300" />
            <span>{isAr ? 'مشاركة الإنجاز' : isUr ? 'کامیابی شیئر کریں' : 'Share Achievement'}</span>
          </button>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#EAE3D6] shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-bold font-serif text-xl shadow-xs">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{userName}</h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  {isAr ? `المستوى ${rank.level}` : isUr ? `لیول ${rank.level}` : `Lvl ${rank.level}`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {isAr ? rank.titleAr : isUr ? rank.titleUr : rank.titleEn}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1: Unlocked Badges */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE3D6] shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isAr ? 'الأوسمة المكتسبة' : isUr ? 'حاصل کردہ بیجز' : 'Badges Earned'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-serif">
              {unlockedCount}
            </span>
            <span className="text-xs text-slate-400 font-bold">/ {totalBadges}</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        {/* Stat 2: Knowledge XP */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE3D6] shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isAr ? 'نقاط المعرفة (XP)' : isUr ? 'علمی پوائنٹس (XP)' : 'Knowledge XP'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-serif">
              {earnedXp}
            </span>
            <span className="text-xs text-slate-400 font-bold">/ {totalPossibleXp}</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {isAr ? `${rank.nextThreshold - earnedXp} نقطة للترقية` : isUr ? `اگلے لیول کے لیے ${rank.nextThreshold - earnedXp} پوائنٹس` : `${Math.max(0, rank.nextThreshold - earnedXp)} XP to next tier`}
          </p>
        </div>

        {/* Stat 3: Stages Cleared */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE3D6] shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isAr ? 'المراحل المكتملة' : isUr ? 'مکمل مراحل' : 'Stages Cleared'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-900 font-serif">
              {completedStageIds.length}
            </span>
            <span className="text-xs text-slate-400 font-bold">{isAr ? 'محطة موثقة' : 'stages'}</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {isAr ? 'وفق مراجع الأصول المعتمدة' : 'Grounded in verified texts'}
          </p>
        </div>

        {/* Stat 4: Learning Continuity / Streak */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE3D6] shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isAr ? 'عزيمة الاستمرار' : isUr ? 'مسلسل تسلسل' : 'Learning Streak'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
              <Flame className="w-4 h-4 text-white fill-amber-200 animate-pulse" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-orange-900 font-serif">
              {currentStreak}
            </span>
            <span className="text-xs text-orange-700 font-bold">{isAr ? 'أيام متتالية' : 'days'}</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {isAr ? 'المواظبة مفتاح البركة والعلم' : 'Consistency breeds mastery'}
          </p>
        </div>
      </div>

      {/* Daily Streak Counter Component with Consecutive Days Tracking & Next Milestone Progress */}
      <DailyStreakCounter
        language={language}
        completedStageIds={completedStageIds}
        onExploreNextStage={() => {
          if (onNavigateToStage) {
            // Find next uncompleted stage or default to first
            const nextUncompleted = ['nm-01', 'nm-02', 'nm-03', 'nm-04'].find(id => !completedStageIds.includes(id)) || 'nm-01';
            onNavigateToStage(nextUncompleted);
          }
        }}
      />

      {/* Advanced Learning Analytics Dashboard (Pace, Hours Spent & Strengths Radar via Recharts) */}
      <LearningAnalytics
        language={language}
        completedStageIds={completedStageIds}
        selectedTrack={selectedTrack}
        currentStreak={currentStreak}
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/60 text-xs font-bold">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAr ? 'جميع الأوسمة' : isUr ? 'تمام بیجز' : 'All Badges'} ({totalBadges})
          </button>
          <button
            onClick={() => setActiveCategory('milestone')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeCategory === 'milestone'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAr ? 'محطات الإيمان' : isUr ? 'ایمانی مراحل' : 'Milestones'}
          </button>
          <button
            onClick={() => setActiveCategory('track')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeCategory === 'track'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAr ? 'إتمام المسارات' : isUr ? 'مسار کی تکمیل' : 'Track Mastery'}
          </button>
          <button
            onClick={() => setActiveCategory('mastery')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeCategory === 'mastery'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAr ? 'التمكن والتوثيق' : isUr ? 'مہارت اور تحقیق' : 'Scholastic'}
          </button>
          <button
            onClick={() => setActiveCategory('engagement')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeCategory === 'engagement'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAr ? 'المثابرة' : isUr ? 'لگن' : 'Dedication'}
          </button>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          {onNavigateToCertificate && (
            <button
              onClick={onNavigateToCertificate}
              className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>{isAr ? 'عرض الشهادة الرقمية' : isUr ? 'ڈیجیٹل سند دیکھیں' : 'View Certificate'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredBadges.map((badge) => {
          const isUnlocked = badge.isUnlocked(context);
          const progress = badge.progressPercent(context);
          const style = getColorStyles(badge.colorScheme, isUnlocked);

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden group ${style.bg} ${style.border} ${style.glow}`}
            >
              {/* Top Row: Icon + XP pill */}
              <div className="flex items-start justify-between gap-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 border-2 ${style.iconBg} ${style.ring}`}>
                  {renderIcon(badge.iconName, `w-7 h-7 ${isUnlocked ? 'text-inherit' : 'text-slate-400'}`)}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${style.badgePill}`}>
                    +{badge.xpPoints} XP
                  </span>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAr ? 'مكتسب' : isUr ? 'مکمل' : 'Earned'}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isAr ? 'قيد الإنجاز' : isUr ? 'غیر مکمل' : 'Locked'}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Title and Description */}
              <div className="mt-4 space-y-1.5">
                <h3 className={`text-base font-bold font-serif leading-snug ${isUnlocked ? 'text-slate-900' : 'text-slate-600'}`}>
                  {isAr ? badge.title : isUr ? badge.titleUr : badge.titleEn}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {isAr ? badge.description : isUr ? badge.descriptionUr : badge.descriptionEn}
                </p>
              </div>

              {/* Condition / Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="truncate max-w-[200px]">
                    {isAr ? badge.conditionDescription : isUr ? badge.conditionDescriptionUr : badge.conditionDescriptionEn}
                  </span>
                  <span className="font-bold text-slate-700">{progress}%</span>
                </div>
                <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked ? 'bg-emerald-600' : 'bg-slate-400'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Share micro-button on hover if unlocked */}
              {isUnlocked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareBadge(badge);
                  }}
                  className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700 shadow-2xs border border-slate-200 cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                  title={isAr ? 'مشاركة الإنجاز' : 'Share badge'}
                >
                  {copiedBadge === badge.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3 h-3 text-slate-600" />
                      <span>{isAr ? 'مشاركة' : 'Share'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 relative"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              ✕
            </button>

            {/* Badge Hero */}
            {(() => {
              const isUnlocked = selectedBadge.isUnlocked(context);
              const style = getColorStyles(selectedBadge.colorScheme, isUnlocked);
              return (
                <div className="flex flex-col items-center text-center space-y-3 pt-2">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-4 ${style.iconBg} ${style.ring} ${isUnlocked ? 'animate-bounce' : ''}`}>
                    {renderIcon(selectedBadge.iconName, 'w-10 h-10')}
                  </div>

                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-1.5 ${style.badgePill}`}>
                      +{selectedBadge.xpPoints} XP • {isUnlocked ? (isAr ? 'وسام معتمد ومكتسب' : 'Unlocked Badge') : (isAr ? 'وسام مرتقب' : 'Locked Badge')}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-950">
                      {isAr ? selectedBadge.title : isUr ? selectedBadge.titleUr : selectedBadge.titleEn}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
                    {isAr ? selectedBadge.description : isUr ? selectedBadge.descriptionUr : selectedBadge.descriptionEn}
                  </p>
                </div>
              );
            })()}

            {/* Condition and Progress */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {isAr ? 'متطلب الاستحقاق' : isUr ? 'حصول کی شرط' : 'Requirement'}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {isAr ? selectedBadge.conditionDescription : isUr ? selectedBadge.conditionDescriptionUr : selectedBadge.conditionDescriptionEn}
              </p>
              <div className="pt-1">
                <div className="flex justify-between text-xs text-slate-600 font-bold mb-1">
                  <span>{isAr ? 'نسبة الإنجاز' : 'Current Progress'}</span>
                  <span>{selectedBadge.progressPercent(context)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-amber-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${selectedBadge.progressPercent(context)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleShareBadge(selectedBadge)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                {copiedBadge === selectedBadge.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? 'تم نسخ النص!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-600" />
                    <span>{isAr ? 'مشاركة الإنجاز' : isUr ? 'شیئر کریں' : 'Share Badge'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedBadge(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shareable Social Media Achievement Card Modal */}
      <ShareAchievementModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        language={language}
        userName={userName}
        userRank={rank}
        earnedBadges={unlockedBadges}
        currentStreak={currentStreak}
        totalXp={earnedXp}
        completedStagesCount={completedStageIds.length}
        selectedTrack={selectedTrack}
      />

    </div>
  );
};
