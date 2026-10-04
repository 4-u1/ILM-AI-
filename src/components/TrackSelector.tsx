import React from 'react';
import { TrackId, Language } from '../types';
import { 
  Home, 
  Sun, 
  HelpCircle, 
  Volume2, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  Share2, 
  Zap, 
  Calendar, 
  HardDrive, 
  Mic, 
  Heart,
  HandMetal,
  Smile,
  Globe2,
  Search,
  Printer,
  ShieldCheck,
  Compass,
  Layers,
  Award
} from 'lucide-react';
import { UI_TRANSLATIONS } from '../data/translations';

interface TrackSelectorProps {
  onSelectTrack: (track: TrackId, initialMode?: 'tutor' | 'map' | 'quran' | 'favorites') => void;
  language: Language;
  selectedTrack: TrackId | null;
  onOpenOnboarding?: () => void;
  onOpenAchievements?: () => void;
  completedStagesCount?: number;
  onNavigateToTab?: (tab: 'ambassadors' | 'copilot' | 'thirtyDays' | 'offlineKit' | 'signLanguage' | 'ilmJunior' | 'culturalEtiquette' | 'scholasticSearch' | 'fieldDaiyah' | 'simulator' | 'lab' | 'sources') => void;
}

export const TrackSelector: React.FC<TrackSelectorProps> = ({
  onSelectTrack,
  language,
  selectedTrack,
  onOpenOnboarding,
  onOpenAchievements,
  completedStagesCount = 0,
  onNavigateToTab,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const tracks = [
    {
      id: 'non_muslim' as TrackId,
      title: UI_TRANSLATIONS.tracks.non_muslim.title[language] || UI_TRANSLATIONS.tracks.non_muslim.title.en,
      description: UI_TRANSLATIONS.tracks.non_muslim.desc[language] || UI_TRANSLATIONS.tracks.non_muslim.desc.en,
      icon: HelpCircle,
      accentColor: 'from-amber-600 to-amber-800',
      badge: isAr ? 'مسار التحدي الأساسي 🎯' : isUr ? 'اہم چیلنج مسار' : 'Core Challenge Path',
      audience: isAr ? 'للباحثين عن الحقيقة والتعريف بالإسلام' : 'For truth seekers exploring Islam',
    },
    {
      id: 'new_muslim' as TrackId,
      title: UI_TRANSLATIONS.tracks.new_muslim.title[language] || UI_TRANSLATIONS.tracks.new_muslim.title.en,
      description: UI_TRANSLATIONS.tracks.new_muslim.desc[language] || UI_TRANSLATIONS.tracks.new_muslim.desc.en,
      icon: Sun,
      accentColor: 'from-emerald-600 to-emerald-800',
      badge: isAr ? 'مسار التحدي الأساسي 🎯' : isUr ? 'اہم چیلنج مسار' : 'Core Challenge Path',
      audience: isAr ? 'للمهتدين الجدد: خطوات التثبيت والعبادات' : 'For new Muslims: foundation & practice',
    },
    {
      id: 'muslim' as TrackId,
      title: UI_TRANSLATIONS.tracks.muslim.title[language] || UI_TRANSLATIONS.tracks.muslim.title.en,
      description: UI_TRANSLATIONS.tracks.muslim.desc[language] || UI_TRANSLATIONS.tracks.muslim.desc.en,
      icon: Home,
      accentColor: 'from-slate-700 to-slate-900',
      badge: isAr ? 'ترسيخ وتعميق' : isUr ? 'ایمانی پختگی' : 'Deepening & Practice',
      audience: isAr ? 'لعموم المسلمين: تصحيح العبادة وتزكية النفس' : 'For Muslims: refining faith & spirituality',
    },
    {
      id: 'daiyah' as TrackId,
      title: UI_TRANSLATIONS.tracks.daiyah.title[language] || UI_TRANSLATIONS.tracks.daiyah.title.en,
      description: UI_TRANSLATIONS.tracks.daiyah.desc[language] || UI_TRANSLATIONS.tracks.daiyah.desc.en,
      icon: Volume2,
      accentColor: 'from-amber-700 to-emerald-800',
      badge: isAr ? 'محاكاة وتقييم ذكي 🤖' : isUr ? 'ذہین سمیلیٹر' : 'Interactive AI Simulator',
      audience: isAr ? 'لتأهيل الدعاة وتفنيد الشبهات بالحكمة' : 'For callers: dialogue skills & wisdom',
    },
  ];

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 max-w-5xl mx-auto">
      
      {/* Platform Title & Hero Banner */}
      <div className="text-center mb-8 sm:mb-12">
        {/* Quick Nav Chips */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2.5 mb-4">
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-slate-700 border border-[#EAE3D6] text-xs font-semibold hover:bg-amber-50/70 hover:text-amber-900 hover:border-amber-200 transition cursor-pointer shadow-xs"
            >
              <Compass className="w-3.5 h-3.5 text-amber-700" />
              <span>{isAr ? 'دليل المنصة والرحلة' : 'Platform Guide'}</span>
            </button>
          )}

          {onOpenAchievements && (
            <button
              onClick={onOpenAchievements}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{isAr ? 'أوسمة الإنجاز ونقاط الخبرة' : 'Achievements (XP)'}</span>
              {completedStagesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>
          )}
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3 font-serif">
          {language === 'ar'
            ? 'اختر مسارك التعليمي المناسب'
            : language === 'ur'
            ? 'اپنے لیے مناسب راستہ منتخب کریں'
            : language === 'fr'
            ? 'Choisissez votre parcours adapté'
            : language === 'es'
            ? 'Elija la ruta adecuada para usted'
            : language === 'id'
            ? 'Pilih Jalur yang Sesuai untuk Anda'
            : 'Choose Your Educational Path'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {language === 'ar'
            ? 'رحلات تعليمية ودعوية متدرجة مدعومة بالذكاء الاصطناعي ومسندة بنسبة 100% إلى مجمع الملك فهد والدرر السنية والمستودع الدعوي'
            : 'Interactive Islamic journeys powered by AI with 100% strict grounding in verified repositories.'}
        </p>
      </div>

      {/* 1. Core Learning Tracks Grid */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-5 rounded-full bg-amber-600"></div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
            {isAr ? 'المسارات الإيمانية والتفاعلية الأساسية' : 'Core Interactive Learning Tracks'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {tracks.map((track) => {
            const Icon = track.icon;
            const isCurrentSelected = selectedTrack === track.id;

            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(track.id)}
                className={`group relative bg-white rounded-3xl border transition-all duration-200 cursor-pointer overflow-hidden p-6 sm:p-7 flex flex-col justify-between ${
                  isCurrentSelected
                    ? 'border-amber-600/80 shadow-md ring-2 ring-amber-600/15 bg-amber-50/20'
                    : 'border-[#EAE3D6] hover:border-amber-300 hover:shadow-md'
                }`}
              >
                {/* Top Badge & Audience */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-center text-amber-800 group-hover:scale-105 transition-transform shadow-xs">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>

                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FAF7F2] text-amber-900 border border-[#EAE3D6]">
                      {track.badge}
                    </span>
                  </div>

                  {/* Track Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 font-serif group-hover:text-amber-900 transition-colors">
                    {track.title}
                  </h3>

                  {/* Target Audience Note */}
                  <div className="text-[11px] font-semibold text-emerald-800 mb-2.5">
                    {track.audience}
                  </div>

                  {/* Track Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {track.description}
                  </p>
                </div>

                {/* Bottom Action Triggers */}
                <div className="pt-3 border-t border-[#EAE3D6]/70 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTrack(track.id, 'tutor');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 text-amber-200" />
                    <span>{isAr ? 'المعلم الحواري الذكي' : 'AI Mentor'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTrack(track.id, 'map');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isAr ? 'خريطة المحطات' : 'Curriculum Map'}</span>
                  </button>

                  {track.id === 'new_muslim' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTrack('new_muslim', 'quran');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAr ? 'المصحف المرتل' : 'Quran'}</span>
                    </button>
                  )}

                  {isCurrentSelected && (
                    <div className={`ms-auto flex items-center gap-1 text-[11px] text-emerald-700 font-bold`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'المسار النشط' : 'Active'}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Specialized Hubs & Community Ease (الواحات المتخصصة والتيسير) */}
      {onNavigateToTab && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-5 rounded-full bg-emerald-600"></div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
              {isAr ? 'الواحات المتخصصة والتيسير المجتمعي' : 'Specialized Community Hubs'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. ILM Junior Hub */}
            <div
              onClick={() => onNavigateToTab('ilmJunior')}
              className="p-5 rounded-3xl bg-white border border-[#EAE3D6] hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-amber-200/60">
                  <Smile className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{isAr ? 'واحة براعم عِلم' : 'ILM Junior Hub'}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isAr ? 'قصص للأشبال (6-12 سنة) وأوسمة إيمانية ولوحة متابعة خاصة بولي الأمر.' : 'Stories, fun quizzes, and parent progress dashboard for kids.'}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#EAE3D6]/70 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>{isAr ? 'دخول الواحة' : 'Open Hub'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 2. Islamic Sign Language */}
            <div
              onClick={() => onNavigateToTab('signLanguage')}
              className="p-5 rounded-3xl bg-white border border-[#EAE3D6] hover:border-emerald-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-emerald-200/60">
                  <HandMetal className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{isAr ? 'قاموس لغة الإشارة' : 'Sign Language Hub'}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isAr ? 'شرح حركي وبصري لأركان الإسلام والوضوء والصلاة مع وضع العرض المتأني.' : 'Visual sign language for Islamic pillars, wudu & prayer.'}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#EAE3D6]/70 flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>{isAr ? 'استعراض القاموس' : 'View Guide'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 3. Cultural Etiquette */}
            <div
              onClick={() => onNavigateToTab('culturalEtiquette')}
              className="p-5 rounded-3xl bg-white border border-[#EAE3D6] hover:border-teal-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-teal-200/60">
                  <Globe2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{isAr ? 'دليل التوطين الثقافي' : 'Cultural Etiquette'}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isAr ? 'آداب المساجد والجوار والعمل للجاليات والمقيمين بـ 5 لغات عالمية.' : 'Social & Islamic etiquette for expatriates in 5 languages.'}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#EAE3D6]/70 flex items-center justify-between text-xs font-bold text-teal-800">
                <span>{isAr ? 'دليل الجاليات' : 'Read Guide'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 4. First 30 Days */}
            <div
              onClick={() => onNavigateToTab('thirtyDays')}
              className="p-5 rounded-3xl bg-white border border-[#EAE3D6] hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-amber-200/60">
                  <Calendar className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{isAr ? 'الأيام الـ 30 الأولى' : 'First 30 Days'}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isAr ? 'خطة يومية هادئة للمسلم الجديد: خطوة واحدة ودعاء نبوي كل يوم.' : 'Step-by-step 30-day gentle journey for new Muslims.'}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#EAE3D6]/70 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>{isAr ? 'بدء الرحلة' : 'Start Journey'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Da'iyah & Research Toolkits (أدوات الداعية والباحث) */}
      {onNavigateToTab && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-5 rounded-full bg-slate-800"></div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
              {isAr ? 'أدوات الداعية، الباحث، والمختبر' : 'Da\'iyah & Research Toolkits'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. Scholastic Search */}
            <div
              onClick={() => onNavigateToTab('scholasticSearch')}
              className="p-5 rounded-3xl bg-white border border-[#EAE3D6] hover:border-slate-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{isAr ? 'البحث التأصيلي المقارن' : 'Scholastic Search'}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isAr ? 'مقارنة فورية تجمع القرآن، الحديث المخرج، المذاهب الأربعة، والمستودع.' : 'Cross-source search comparing Quran, Hadith, 4 Madhabs & Dawa.'}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#EAE3D6]/70 flex items-center justify-between text-xs font-bold text-slate-800">
                <span>{isAr ? 'فتح محرك البحث' : 'Open Search'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 2. Field Da'iyah Kit */}
            <div
              onClick={() => onNavigateToTab('fieldDaiyah')}
              className="p-5 rounded-3xl bg-white border border-[#EAE3D6] hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-amber-200/60">
                  <Printer className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{isAr ? 'حقيبة وبطاقات الدعوة' : 'Field Outreach Kit'}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isAr ? 'بطاقات دعوية رقمية جاهزة للمشاركة عبر الواتساب والطباعة الميدانية.' : 'Printable & digital outreach cards for field da\'wah in 5 languages.'}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#EAE3D6]/70 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>{isAr ? 'استعراض الحقيبة' : 'Open Kit'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 3. Field Co-Pilot */}
            <div
              onClick={() => onNavigateToTab('copilot')}
              className="p-5 rounded-3xl bg-white border border-[#EAE3D6] hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-blue-200/60">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{isAr ? 'المساعد الميداني الفوري' : 'Field Co-Pilot'}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isAr ? 'ردود عقلية فورية مسندة وأدب الخطاب لمواجهة الشبهات في ثوانٍ.' : 'Instant rational proofs & prophetic wisdom for field callers.'}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#EAE3D6]/70 flex items-center justify-between text-xs font-bold text-blue-800">
                <span>{isAr ? 'المساعد الفوري' : 'Open Co-Pilot'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 4. Ambassadors Hub */}
            <div
              onClick={() => onNavigateToTab('ambassadors')}
              className="p-5 rounded-3xl bg-white border border-[#EAE3D6] hover:border-emerald-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-emerald-200/60">
                  <Share2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{isAr ? 'سفراء عِلم' : 'Ambassadors Hub'}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isAr ? 'رابط دعوة تتبعي ذكي مع لوحة أثر حي وأوسمة تدرجية لخدمة الإسلام.' : 'Trackable smart dawah link with live impact stats and badges.'}
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-[#EAE3D6]/70 flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>{isAr ? 'لوحة السفراء' : 'Open Hub'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trust & Scientific Guarantee Footer Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EAE3D6] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/70 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {isAr ? 'منصة مؤصلة وموثقة بنسبة 100%' : 'Grounded & Strictly Verified Platform'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isAr
                ? 'كافة النصوص والدروس مستندة حصراً إلى مجمع الملك فهد، وموسوعة الدرر السنية، والمستودع الدعوي الرقمي مع سياج حماية شرعي حاسم.'
                : 'All scriptures & lessons are strictly anchored in King Fahd Complex, Dorar.net, and Dawa.center.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('sources')}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              {isAr ? 'سجل المصادر' : 'Sources'}
            </button>
          )}

          <button
            onClick={() => onSelectTrack('daiyah')}
            className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            {isAr ? 'محاكي الداعية' : 'Da\'iyah Sim'}
          </button>
        </div>
      </div>

    </section>
  );
};
