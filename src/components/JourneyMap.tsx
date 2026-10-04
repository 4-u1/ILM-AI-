import React, { useState } from 'react';
import { TrackId, Language, LessonStage } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { ProgressBar } from './ProgressBar';
import { SearchBar } from './SearchBar';
import { InteractiveTutor } from './InteractiveTutor';
import { QuranBrowser } from './QuranBrowser';
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
  Heart
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
  initialMode?: 'tutor' | 'map' | 'quran' | 'favorites';
}

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

  // Mode inside track: 'tutor' | 'map' | 'quran' | 'favorites'
  const [trackMode, setTrackMode] = useState<'tutor' | 'map' | 'quran' | 'favorites'>(() => initialMode);

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
          <span>{isAr ? 'تغيير المسار التعليمي' : isUr ? 'تعلیمی راستہ تبدیل کریں' : 'Change Learning Path'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {trackId === 'non_muslim' && (
            <button
              onClick={onOpenShahada}
              className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{isAr ? 'أرغب في اعتناق الإسلام' : isUr ? 'میں اسلام قبول کرنا چاہتا ہوں' : 'Embrace Islam'}</span>
            </button>
          )}

          {/* Instant Complete Demo helper for evaluation / examination */}
          {!isAllCompleted && onCompleteAllStages && (
            <button
              onClick={onCompleteAllStages}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
              title={isAr ? 'إكمال محطات المسار وتفعيل الشهادة فوراً للتحكيم' : isUr ? 'سند کی فوری جانچ کے لیے مکمل کریں' : 'Complete all stages instantly'}
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isAr ? 'إتمام سريع للمسار' : isUr ? 'فوری تکمیل' : 'Fast Complete'}</span>
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
            <span>{isAr ? 'عرض وتصدير الشهادة' : isUr ? 'سند دیکھیں اور محفوظ کریں' : 'View Certificate'}</span>
            {isAllCompleted ? (
              <span className="text-[10px] bg-amber-800 text-white px-1.5 py-0.2 rounded-full font-bold">
                {isAr ? 'جاهزة' : isUr ? 'تیار ہے' : 'Ready'}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">
                {progressPercent}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Track View Mode Switcher: Interactive Tutor (Auto) vs Milestones Map vs Quran Browser */}
      <div className="flex items-center justify-center p-1 bg-[#F5EFE6] rounded-2xl border border-[#EAE3D6] max-w-xl mx-auto mb-6 shadow-2xs">
        <button
          onClick={() => setTrackMode('tutor')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            trackMode === 'tutor'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isAr ? 'المعلم التفاعلي' : isUr ? 'ذہین استاد' : 'AI Tutor'}</span>
          <span className="hidden sm:inline-block text-[10px] bg-amber-900/60 text-amber-200 px-1.5 py-0.2 rounded-full font-bold">
            {isAr ? 'تلقائي' : 'Auto'}
          </span>
        </button>
        <button
          onClick={() => setTrackMode('map')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            trackMode === 'map'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isAr ? 'المحطات والدروس' : isUr ? 'نصاب کے مراحل' : 'Curriculum'}</span>
        </button>
        {/* Quran Browser Tab (Dedicated King Fahd Complex Verified Mushaf) */}
        <button
          onClick={() => setTrackMode('quran')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            trackMode === 'quran'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? 'القرآن الكريم' : isUr ? 'قرآن مجید' : 'Holy Quran'}</span>
          <span className="hidden sm:inline-block text-[10px] bg-emerald-900/60 text-emerald-200 px-1.5 py-0.2 rounded-full font-bold">
            114
          </span>
        </button>

        {/* Favorite Verses Tab (المفضلة القرآنية للدارس) */}
        <button
          onClick={() => setTrackMode('favorites')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            trackMode === 'favorites'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-rose-700 hover:text-rose-950 hover:bg-rose-100/50'
          }`}
        >
          <Heart className={`w-4 h-4 ${trackMode === 'favorites' ? 'fill-white text-white' : 'fill-rose-500 text-rose-500'}`} />
          <span>{isAr ? 'المفضلة' : isUr ? 'پسندیدہ' : 'Favorites'}</span>
        </button>
      </div>

      {trackMode === 'quran' || trackMode === 'favorites' ? (
        <div className="animate-in fade-in duration-300 mb-8">
          <QuranBrowser
            language={language}
            initialTab={trackMode === 'favorites' ? 'favorites' : 'surahs'}
            onSelectSurahForStudy={(surahNum) => {
              // When user wants to study surah in curriculum, jump to map
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
      <div className="space-y-4 relative">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 font-serif">
          <BookOpen className="w-5 h-5 text-slate-700" />
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
                if (!isLocked) onSelectStage(stage);
              }}
              className={`rounded-2xl p-5 sm:p-6 border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isCompleted
                  ? 'bg-white border-emerald-200 hover:border-emerald-400 cursor-pointer shadow-xs'
                  : isCurrentActive
                  ? 'bg-white border-slate-900 ring-2 ring-slate-900/10 shadow-sm cursor-pointer'
                  : 'bg-slate-50/70 border-slate-200 opacity-70 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-4">
                
                {/* Number / Status Icon */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : isCurrentActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <span>{stage.stageNumber}</span>
                  )}
                </div>

                {/* Stage Info */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        stage.contentLevel === 'A'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : stage.contentLevel === 'B'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isAr
                        ? `المستوى (${stage.contentLevel}) - ${
                            stage.contentLevel === 'A' ? 'معلومات مستقرة' : 'شرح واستدلال'
                          }`
                        : `Level (${stage.contentLevel})`}
                    </span>

                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{stage.estimatedMinutes} {isAr ? 'دقيقة' : 'mins'}</span>
                    </span>

                    {isCompleted && (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {isAr ? 'تم الاجتياز بنجاح' : 'Completed'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {isAr ? stage.title : stage.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                    {isAr ? stage.subtitle : stage.subtitleEn}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Lesson View & Stage AI Tutor Guidance */}
              <div className="shrink-0 flex flex-wrap items-center justify-end sm:justify-start gap-2">
                {isCompleted ? (
                  <button className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition flex items-center gap-1.5 cursor-pointer">
                    <span>{isAr ? 'مراجعة الدرس' : 'Review Lesson'}</span>
                    <ChevronIcon className="w-4 h-4" />
                  </button>
                ) : isCurrentActive ? (
                  <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isAr ? 'ابدأ الدرس الحواري' : 'Start Lesson'}</span>
                    <ChevronIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-500 text-xs font-medium flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isAr ? 'مغلق حالياً' : 'Locked'}</span>
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
            {isAr ? 'مبارك! أتممت كافة محطات هذا المسار بنجاح' : 'Congratulations! You Completed All Stages'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-5 leading-relaxed font-medium">
            {isAr
              ? 'شهادتك المعتمدة صادرة الآن ومسجلة في المنظومة، يمكنك استعراضها وتصديرها بصيغة PDF فوراً.'
              : 'Your accredited certificate is issued and recorded in the system. View and export it as PDF immediately.'}
          </p>
          <button
            onClick={onViewCertificate}
            className="px-8 py-3 rounded-2xl bg-slate-950 text-white font-bold text-sm sm:text-base hover:bg-slate-800 transition shadow-lg cursor-pointer flex items-center gap-2 mx-auto ring-4 ring-slate-900/10"
          >
            <Award className="w-5 h-5 text-amber-400" />
            <span>{isAr ? 'فتح وتصدير الشهادة الملكية' : 'Open & Export Certificate'}</span>
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
            <span>{isAr ? 'معاينة الشهادة' : 'Preview Certificate'}</span>
          </button>
        </div>
      )}
      </>
      )}

    </div>
  );
};
