import React, { useState } from 'react';
import { TrackId, Language, LessonStage } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { UI_TRANSLATIONS } from '../data/translations';
import { ProgressBar } from './ProgressBar';
import { SearchBar } from './SearchBar';
import { InteractiveTutor } from './InteractiveTutor';
import { QuranBrowser } from './QuranBrowser';
import { JourneyAnalytics } from './JourneyAnalytics';
import { InteractiveBranchingMap } from './InteractiveBranchingMap';
import { playTapSound } from '../utils/platformSounds';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  HeartHandshake, 
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  ShieldCheck,
  Heart,
  BarChart3,
  TrendingUp,
  Split
} from 'lucide-react';

interface JourneyMapProps {
  trackId: TrackId;
  language: Language;
  completedStageIds: string[];
  activeStageId: string | null;
  onSelectStage: (stage: LessonStage) => void;
  onOpenShahada: () => void;
  onViewCertificate: () => void;
  onSwitchTrack: () => void;
  onCompleteAllStages?: () => void;
  onNavigateToSources?: () => void;
  onStartTutor?: () => void;
  onCompleteStageId?: (stageId: string) => void;
  onNavigateToAchievements?: () => void;
  initialMode?: 'tutor' | 'branching' | 'map' | 'analytics' | 'quran' | 'favorites';
}

// 🕌 High-fidelity 8-point Islamic star geometric pattern helper (Rub el Hizb)
const IslamicStarSVG: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-amber-500/40" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l2.4 4.8 4.8 2.4-4.8 2.4-2.4 4.8-2.4-4.8-4.8-2.4 4.8-2.4z" />
    <path d="M12 4.5l1.6 3.2 3.2 1.6-3.2 1.6-1.6 3.2-1.6-3.2-3.2-1.6 3.2-1.6z" className="opacity-75" />
    <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const JourneyMap: React.FC<JourneyMapProps> = ({
  trackId,
  language,
  completedStageIds,
  activeStageId,
  onSelectStage,
  onOpenShahada,
  onViewCertificate,
  onSwitchTrack,
  onCompleteAllStages,
  onNavigateToSources,
  onStartTutor,
  onCompleteStageId,
  onNavigateToAchievements,
  initialMode = 'tutor',
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Mode inside track: 'tutor' | 'branching' | 'map' | 'analytics' | 'quran' | 'favorites'
  const [trackMode, setTrackMode] = useState<'tutor' | 'branching' | 'map' | 'analytics' | 'quran' | 'favorites'>(() => initialMode);

  const trackStages = CURRICULUM_DATA.filter((s) => s.trackId === trackId);
  const totalStages = trackStages.length;
  const completedCount = trackStages.filter((s) => completedStageIds.includes(s.id)).length;
  const progressPercent = totalStages > 0 ? Math.round((completedCount / totalStages) * 100) : 0;
  const isAllCompleted = completedCount === totalStages && totalStages > 0;

  const trackTitles: Record<TrackId, { titleAr: string; titleEn: string; titleUr: string; descAr: string; descEn: string; descUr: string }> = {
    muslim: {
      titleAr: 'مسار المسلم الأصل (ترسيخ وتعميق)',
      titleEn: 'Born Muslim Path (Deepening Faith)',
      titleUr: 'مسلمِ اصل راستہ (ایمانی پختگی اور فہم)',
      descAr: 'رحلة متدرجة لتعميق الإيمان وفهم مقاصد العبادات والمعاملات لمن نشأ على الإسلام وفق المصادر المعتمدة.',
      descEn: 'A structured journey deepening faith, worship, and Islamic ethics for Muslims through verified sources.',
      descUr: 'مستند مصادر کی روشنی میں عبادات اور معاملات کے مقاصد کو گہرائی سے سمجھنے کا تدریجی تعلیمی سفر۔',
    },
    new_muslim: {
      titleAr: 'مسار المسلم الجديد (تأسيس خطوة بخطوة)',
      titleEn: 'New Muslim Path (Step-by-Step Foundation)',
      titleUr: 'نئے مسلم کا راستہ (مرحلہ وار بنیاد)',
      descAr: 'تأسيس شامل يبدأ من التوحيد، مروراً بالشهادتين، الوضوء، الصلاة، وتفاصيل الحياة اليومية برفق وتيسير.',
      descEn: 'A supportive foundation covering Tawhid, Shahadah, prayer, and daily life with compassion and ease.',
      descUr: 'توحید، شہادتین، وضو، نماز اور روزمرہ زندگی کے احکام کو آسانی اور محبت سے سیکھنے کی جامع بنیاد۔',
    },
    non_muslim: {
      titleAr: 'مسار غير المسلم (التعرف والحوار الموضوعي)',
      titleEn: 'Non-Muslim Path (Discovery & Objective Dialogue)',
      titleUr: 'غیر مسلم کے لیے راستہ (شناخت اور مکالمہ)',
      descAr: 'استكشاف هادئ وموثق لجوهر الإسلام، الإله، النبوة، تفنيد الشبهات، ومقارنة الأديان بحكمة.',
      descEn: 'A peaceful, verified exploration of Islam, God, Prophethood, addressing misconceptions with wisdom.',
      descUr: 'اسلام کی حقیقت، توحید، نبوت، غلط فہمیوں کے ازالے اور حکمت کے ساتھ تعارف کا سفر۔',
    },
    daiyah: {
      titleAr: 'مسار الداعية (التأهيل ومحاكي الحوار)',
      titleEn: 'Da\'iyah Path (Training & AI Simulation)',
      titleUr: 'داعی کا راستہ (تربیت اور مکالماتی سمیلیٹر)',
      descAr: 'إتقان أصول الحوار الحضاري، وضوابط الاستدلال، مع تدريبات تفاعلية ومحاكاة لمواقف واقعية.',
      descEn: 'Mastering civilized dialogue, verified reasoning, and realistic AI-powered conversation simulations.',
      descUr: 'مہذب مکالمے اور استدلال کے اصولوں میں مہارت، مع حقیقت پسندانہ سمیلیٹر مشقیں۔',
    },
  };

  const currentTrackInfo = trackTitles[trackId];
  const trackHeading = isAr ? currentTrackInfo.titleAr : isUr ? currentTrackInfo.titleUr : currentTrackInfo.titleEn;
  const trackDesc = isAr ? currentTrackInfo.descAr : isUr ? currentTrackInfo.descUr : currentTrackInfo.descEn;

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 max-w-4xl mx-auto">
      
      {/* Top Breadcrumb & Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
        <button
          onClick={onSwitchTrack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{UI_TRANSLATIONS.actions.changeTrack[language] || UI_TRANSLATIONS.actions.changeTrack.en}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {trackId === 'non_muslim' && (
            <button
              onClick={onOpenShahada}
              className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{UI_TRANSLATIONS.actions.embraceIslam[language] || UI_TRANSLATIONS.actions.embraceIslam.en}</span>
            </button>
          )}

          {/* Instant Complete Demo helper for evaluation / examination */}
          {!isAllCompleted && onCompleteAllStages && (
            <button
              onClick={onCompleteAllStages}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
              title={UI_TRANSLATIONS.actions.fastComplete[language] || UI_TRANSLATIONS.actions.fastComplete.en}
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{UI_TRANSLATIONS.actions.fastComplete[language] || UI_TRANSLATIONS.actions.fastComplete.en}</span>
            </button>
          )}

          {/* Certificate View Button - Always accessible, indicating either Ready or In-Progress preview */}
          <button
            onClick={onViewCertificate}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
              isAllCompleted
                ? 'bg-amber-600 text-white hover:bg-amber-700 ring-2 ring-amber-300 animate-pulse'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Award className={`w-3.5 h-3.5 ${isAllCompleted ? 'text-amber-200' : 'text-amber-600'}`} />
            <span>{UI_TRANSLATIONS.actions.viewCertificate[language] || UI_TRANSLATIONS.actions.viewCertificate.en}</span>
            {isAllCompleted ? (
              <span className="text-[10px] bg-amber-800 text-white px-1.5 py-0.2 rounded-full font-bold">
                {UI_TRANSLATIONS.actions.certificateReady[language] || UI_TRANSLATIONS.actions.certificateReady.en}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">
                {progressPercent}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Track View Mode Switcher: Interactive Tutor (Auto) vs Interactive Branching vs Milestones Map vs Charts & Analytics vs Quran Browser */}
      <div className="flex flex-wrap items-center justify-center p-1.5 bg-[#F5EFE6] rounded-2xl border border-[#EAE3D6] max-w-3xl mx-auto mb-6 shadow-2xs gap-1">
        <button
          onClick={() => {
            playTapSound();
            setTrackMode('tutor');
          }}
          className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            trackMode === 'tutor'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{UI_TRANSLATIONS.common.interactiveTutor[language] || UI_TRANSLATIONS.common.interactiveTutor.en}</span>
          <span className="hidden sm:inline-block text-[10px] bg-amber-900/60 text-amber-200 px-1.5 py-0.2 rounded-full font-bold">
            {isAr ? 'تلقائي' : isUr ? 'خودکار' : 'Auto'}
          </span>
        </button>

        {/* 🌿 Interactive Branching Mode Tab */}
        <button
          onClick={() => {
            playTapSound();
            setTrackMode('branching');
          }}
          className={`flex-1 min-w-[120px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            trackMode === 'branching'
              ? 'bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white shadow-xs'
              : 'text-amber-900 hover:text-amber-950 hover:bg-amber-100/50'
          }`}
        >
          <Split className="w-4 h-4 text-amber-400" />
          <span>{isAr ? 'التفرع البصري' : isUr ? 'بصری برانچنگ' : 'Branching Map'}</span>
          <span className="hidden md:inline-block text-[9px] bg-amber-900/60 text-amber-200 px-1.5 py-0.2 rounded-full font-bold">
            {isAr ? 'تفاعلي' : 'New'}
          </span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setTrackMode('map');
          }}
          className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            trackMode === 'map'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{UI_TRANSLATIONS.common.curriculum[language] || UI_TRANSLATIONS.common.curriculum.en}</span>
        </button>

        {/* Visual Analytics Tab (Recharts Charts across tracks) */}
        <button
          onClick={() => {
            playTapSound();
            setTrackMode('analytics');
          }}
          className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            trackMode === 'analytics'
              ? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className={`w-4 h-4 ${trackMode === 'analytics' ? 'text-amber-300' : 'text-blue-600'}`} />
          <span>{isAr ? 'الرسوم البيانية' : isUr ? 'چارٹس اور تجزیہ' : 'Analytics'}</span>
        </button>

        {/* Quran Browser Tab (Dedicated King Fahd Complex Verified Mushaf) */}
        <button
          onClick={() => {
            playTapSound();
            setTrackMode('quran');
          }}
          className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            trackMode === 'quran'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{UI_TRANSLATIONS.common.quranBrowser[language] || UI_TRANSLATIONS.common.quranBrowser.en}</span>
        </button>

        {/* Favorite Verses Tab (المفضلة القرآنية للدارس) */}
        <button
          onClick={() => {
            playTapSound();
            setTrackMode('favorites');
          }}
          className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            trackMode === 'favorites'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-rose-700 hover:text-rose-950 hover:bg-rose-100/50'
          }`}
        >
          <Heart className={`w-4 h-4 ${trackMode === 'favorites' ? 'fill-white text-white' : 'fill-rose-500 text-rose-500'}`} />
          <span>{UI_TRANSLATIONS.common.favorites[language] || UI_TRANSLATIONS.common.favorites.en}</span>
        </button>
      </div>

      {trackMode === 'quran' || trackMode === 'favorites' ? (
        <div className="animate-in fade-in duration-300 mb-8">
          <QuranBrowser
            language={language}
            initialTab={trackMode === 'favorites' ? 'favorites' : 'surahs'}
            onSelectSurahForStudy={(surahNum) => {
              setTrackMode('map');
            }}
          />
        </div>
      ) : trackMode === 'tutor' ? (
        <div className="animate-in fade-in duration-300 mb-8">
          <InteractiveTutor
            language={language}
            selectedTrack={trackId}
            onBackToMap={() => setTrackMode('map')}
            embedded={true}
            onCompleteStage={onCompleteStageId}
            learnerName={localStorage.getItem('eilm_user_name') || ''}
            learnerAge={localStorage.getItem('eilm_user_age') || ''}
          />
        </div>
      ) : trackMode === 'branching' ? (
        <div className="animate-in fade-in duration-300 mb-8">
          <InteractiveBranchingMap
            trackId={trackId}
            language={language}
            stages={trackStages}
            completedStageIds={completedStageIds}
            activeStageId={activeStageId}
            onSelectStage={onSelectStage}
            onNavigateToAchievements={onNavigateToAchievements}
            onViewCertificate={onViewCertificate}
          />
        </div>
      ) : trackMode === 'analytics' ? (
        <div className="animate-in fade-in duration-300 mb-8">
          <JourneyAnalytics
            currentTrackId={trackId}
            language={language}
            completedStageIds={completedStageIds}
            onSelectTrack={(newTrack) => {
              // Switch current track if requested
            }}
            onViewCertificate={onViewCertificate}
            onBackToMap={() => setTrackMode('map')}
          />
        </div>
      ) : (
        <>
          {/* Instant Intelligent SearchBar across track content & verified sources */}
          <SearchBar
            language={language}
            currentTrackId={trackId}
            onSelectStage={onSelectStage}
            onSelectSource={(source) => {
              if (onNavigateToSources) {
                onNavigateToSources();
              } else if (source.url) {
                window.open(source.url, '_blank', 'noopener,noreferrer');
              }
            }}
          />

          {/* Motivational ProgressBar placed prominently at the top */}
          <ProgressBar
            completedCount={completedCount}
            totalStages={totalStages}
            progressPercent={progressPercent}
            language={language}
            trackName={trackHeading}
          />

          {/* 🌿 Interactive Branching Discovery Banner inside Map Mode */}
          <div className="bg-gradient-to-r from-amber-50/90 via-white to-emerald-50/60 rounded-3xl p-5 sm:p-6 border-2 border-amber-300/80 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-200/30 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
            <div className="flex items-start sm:items-center gap-3.5 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-700 to-slate-900 text-white flex items-center justify-center shrink-0 shadow-md border border-amber-400/40">
                <Split className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300">
                    {isAr ? 'التنقل البصري المتفاعل' : 'Interactive Branching'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {isAr ? 'تخصيص المسار بالاهتمام الشخصي' : 'Personalize by Interest'}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-950 font-serif mt-0.5">
                  {isAr ? 'استكشف مسارات فرعية مخصصة حسب اهتمامك وشغفك' : 'Explore Tailored Sub-Branches by Your Personal Interest'}
                </h4>
                <p className="text-xs text-slate-600 font-medium max-w-xl mt-0.5">
                  {isAr
                    ? 'اختر بين: مقارنة الأديان، السيرة النبوية، التزكية وصلاح القلب، الإعجاز العلمي، أو الفقه العملي.'
                    : 'Choose among: Comparative Religions, Prophetic Biography, Spiritual Purification, Cosmic Signs, or Practical Fiqh.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playTapSound();
                setTrackMode('branching');
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-800 to-slate-950 hover:from-amber-600 hover:to-slate-900 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shrink-0 shadow-md border border-amber-400/40 relative z-10"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isAr ? 'استعراض التفرع البصري' : 'Open Branching Map'}</span>
              <ChevronIcon className="w-4 h-4 text-amber-200" />
            </button>
          </div>

          {/* 📊 Visual Analytics Quick Access Banner inside Map Mode */}
          <div className="bg-gradient-to-r from-[#FAF7F2] via-white to-amber-50/50 rounded-2xl p-4 border border-[#EAE3D6] mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 border border-blue-200">
                <BarChart3 className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {isAr ? 'الرسوم البيانية التفاعلية ومؤشرات التقدم (Recharts)' : 'Visual Learning Progress & Charts'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {isAr 
                    ? `مقارنة الإنجاز عبر كافة المسارات الأربعة (${completedCount}/${totalStages} محطة مكتملة في هذا المسار)` 
                    : `Compare your progress across all 4 tracks (${completedCount}/${totalStages} milestones finished)`}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playTapSound();
                setTrackMode('analytics');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'استعراض الرسوم البيانية' : 'View Recharts Analytics'}</span>
            </button>
          </div>

          {/* Track Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 mb-8 sm:mb-10 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 mb-3">
                  {isAr ? 'المسار التعليمي المعتمد' : isUr ? 'مستند نصابی راستہ' : 'Accredited Curriculum Path'}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 font-serif">
                  {trackHeading}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                  {trackDesc}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">
                  {isAr
                    ? `${totalStages} محطات معرفية متسلسلة`
                    : isUr
                    ? `${totalStages} باہم مربوط علمی مراحل`
                    : `${totalStages} sequential knowledge milestones`}
                </span>

                {onNavigateToAchievements && (
                  <button
                    onClick={onNavigateToAchievements}
                    className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isAr ? 'أوسمة الإنجاز' : isUr ? 'اعزازی بیجز' : 'Achievements'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

      {/* Sequential Journey Timeline */}
      <div className="space-y-6 relative pl-6 sm:pl-10 border-l-2 border-dashed border-[#D4AF37]/30 rtl:border-l-0 rtl:border-r-2 rtl:border-dashed rtl:border-[#D4AF37]/30 rtl:pr-6 rtl:sm:pr-10">
        {/* Glowing track background line representing the platform's spiritual golden braid */}
        <div className="absolute top-12 bottom-12 left-[-2px] w-[3px] bg-gradient-to-b from-[#D4AF37] via-[#10B981] to-amber-700 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.45)] pointer-events-none rtl:left-auto rtl:right-[-2px]" />

        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2.5 font-serif">
          <BookOpen className="w-5.5 h-5.5 text-slate-800" />
          <span>{isAr ? 'محطات الرحلة المعرفية' : isUr ? 'علمی سفر کے مراحل' : 'Knowledge Journey Stages'}</span>
        </h2>

        {trackStages.map((stage, idx) => {
          const isCompleted = completedStageIds.includes(stage.id);
          const isCurrentActive = stage.id === activeStageId || (!activeStageId && idx === completedCount);
          const isLocked = !isCompleted && !isCurrentActive && idx > completedCount;

          return (
            <div
              key={stage.id}
              onClick={() => {
                if (!isLocked) {
                  playTapSound();
                  onSelectStage(stage);
                }
              }}
              className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group ${
                isCompleted
                  ? 'bg-gradient-to-br from-white via-[#FCFAF8] to-[#FAF5EC] border-2 border-[#D4AF37]/35 cursor-pointer shadow-xs luxury-card-glow'
                  : isCurrentActive
                  ? 'bg-gradient-to-br from-white via-[#FFFDF9] to-[#FFF9EB] border-2 border-[#D4AF37] ring-4 ring-amber-500/15 shadow-md cursor-pointer luxury-card-glow'
                  : 'bg-gradient-to-br from-slate-50 to-slate-100/60 border border-slate-250 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Subtle Inner Double Border and professional Hover Light-Reveal Glow */}
              {!isLocked && (
                <>
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-16 rounded-full blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 ${
                    isCurrentActive ? 'bg-amber-500/12' : 'bg-amber-500/7'
                  }`} />
                  <div className={`absolute inset-1.5 border rounded-[22px] pointer-events-none transition-colors duration-300 z-10 ${
                    isCurrentActive ? 'border-[#D4AF37]/25' : 'border-[#D4AF37]/10 group-hover:border-[#D4AF37]/25'
                  }`} />
                </>
              )}

              {/* Corner Arabesque Ornaments */}
              {!isLocked && (
                <>
                  <div className="absolute top-2.5 right-2.5 opacity-25 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <IslamicStarSVG className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 opacity-25 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <IslamicStarSVG className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                </>
              )}
              <div className="flex items-start gap-5">
                
                {/* Number / Status Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shrink-0 transition-all border ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : isCurrentActive
                      ? 'bg-amber-800 text-white border-amber-600 shadow-md ring-4 ring-amber-800/10'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5.5 h-5.5 text-emerald-600" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4 text-slate-400" />
                  ) : (
                    <span>{stage.stageNumber}</span>
                  )}
                </div>

                {/* Stage Info */}
                <div className="space-y-3.5 flex-1 journey-card-content">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        stage.contentLevel === 'A'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/50'
                          : stage.contentLevel === 'B'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200/50'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isAr
                        ? `المستوى (${stage.contentLevel}) - ${
                            stage.contentLevel === 'A' ? 'معلومات مستقرة' : 'شرح واستدلال'
                          }`
                        : `Level (${stage.contentLevel})`}
                    </span>

                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold flex items-center gap-1 bg-white/80 border border-slate-200/50 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{stage.estimatedMinutes} {UI_TRANSLATIONS.actions.minutes[language] || UI_TRANSLATIONS.actions.minutes.en}</span>
                    </span>

                    {isCompleted && (
                      <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-100/40 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                        {UI_TRANSLATIONS.common.completed[language] || UI_TRANSLATIONS.common.completed.en}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif leading-snug tracking-wide">
                      {isAr ? stage.title : stage.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-sans font-medium opacity-90">
                      {isAr ? stage.subtitle : stage.subtitleEn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Lesson View & Stage AI Tutor Guidance */}
              <div className="shrink-0 flex flex-wrap items-center justify-end md:justify-start gap-2.5 relative z-20">
                {isCompleted ? (
                  <button className="px-4 py-2 rounded-xl bg-gradient-to-br from-white to-[#FDFBF7] border border-[#EAE3D6] hover:border-emerald-500/50 hover:text-emerald-900 text-xs font-bold text-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:shadow-md hover:scale-[1.02] active:scale-95 duration-200">
                    <span>{UI_TRANSLATIONS.common.reviewLesson[language] || UI_TRANSLATIONS.common.reviewLesson.en}</span>
                    <ChevronIcon className="w-4 h-4 text-slate-500" />
                  </button>
                ) : isCurrentActive ? (
                  <button className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-slate-950 hover:from-amber-600 hover:to-slate-900 text-xs font-black text-white transition-all flex items-center gap-1.5 shadow-md hover:shadow-[0_8px_20px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-95 cursor-pointer relative overflow-hidden group/btn border border-[#D4AF37]/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>{UI_TRANSLATIONS.common.startLesson[language] || UI_TRANSLATIONS.common.startLesson.en}</span>
                    <ChevronIcon className="w-4 h-4 text-amber-200" />
                  </button>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold flex items-center gap-1.5 border border-slate-200/40">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{UI_TRANSLATIONS.common.locked[language] || UI_TRANSLATIONS.common.locked.en}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isAllCompleted ? (
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-linear-to-br from-amber-50 via-white to-amber-50/80 border-2 border-amber-300 text-center shadow-md relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
            <Award className="w-9 h-9 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isAr ? 'اكتمل المسار بنسبة 100%' : '100% Path Completed'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-2">
            {UI_TRANSLATIONS.common.allCompletedTitle[language] || UI_TRANSLATIONS.common.allCompletedTitle.en}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-5 leading-relaxed font-medium">
            {isAr
              ? 'شهادتك المعتمدة صادرة الآن ومسجلة في المنظومة، يمكنك استعراضها وتصديرها بصيغة PDF فوراً.'
              : isUr
              ? 'آپ کی مستند سند جاری ہو چکی ہے، آپ اسے فوری طور پر پی ڈی ایف کے طور پر محفوظ کر سکتے ہیں۔'
              : 'Your accredited certificate is issued and recorded in the system. View and export it as PDF immediately.'}
          </p>
          <button
            onClick={onViewCertificate}
            className="px-8 py-3 rounded-2xl bg-slate-950 text-white font-bold text-sm sm:text-base hover:bg-slate-800 transition shadow-lg cursor-pointer flex items-center gap-2 mx-auto ring-4 ring-slate-900/10"
          >
            <Award className="w-5 h-5 text-amber-400" />
            <span>{UI_TRANSLATIONS.common.exportCertBtn[language] || UI_TRANSLATIONS.common.exportCertBtn.en}</span>
          </button>
        </div>
      ) : (
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-slate-100/80 border border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-start">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                {isAr ? 'الشهادة الرقمية المعتمدة للمسار' : 'Accredited Track Certificate'}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {isAr
                  ? `أكملت ${completedCount} من ${totalStages} محطات (${progressPercent}%). يمكنك معاينة تصميم الشهادة الآن.`
                  : `Completed ${completedCount} of ${totalStages} stages (${progressPercent}%). You can preview the certificate layout.`}
              </p>
            </div>
          </div>
          <button
            onClick={onViewCertificate}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs hover:bg-slate-50 transition cursor-pointer shadow-2xs shrink-0 flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{UI_TRANSLATIONS.common.previewCertBtn[language] || UI_TRANSLATIONS.common.previewCertBtn.en}</span>
          </button>
        </div>
      )}
      </>
      )}

    </div>
  );
};
