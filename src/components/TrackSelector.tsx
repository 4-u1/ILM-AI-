import React, { useState, useEffect } from 'react';
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
  Mic, 
  Heart,
  Smile,
  HandMetal,
  Globe2,
  Calendar,
  Search,
  Printer,
  Zap,
  Share2,
  ShieldCheck,
  Compass,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Info,
  X,
  Clock,
  Play,
  Award
} from 'lucide-react';
import { UI_TRANSLATIONS } from '../data/translations';
import { playTapSound, playSuccessSound } from '../utils/platformSounds';
import { OptimizedImage } from './OptimizedImage';

interface TrackSelectorProps {
  onSelectTrack: (track: TrackId, initialMode?: 'tutor' | 'map' | 'analytics' | 'quran' | 'favorites') => void;
  language: Language;
  selectedTrack: TrackId | null;
  onOpenOnboarding?: () => void;
  onOpenAchievements?: () => void;
  completedStagesCount?: number;
  onNavigateToTab?: (tab: 'ambassadors' | 'copilot' | 'thirtyDays' | 'offlineKit' | 'signLanguage' | 'ilmJunior' | 'culturalEtiquette' | 'scholasticSearch' | 'fieldDaiyah' | 'simulator' | 'lab' | 'sources' | 'dhikr') => void;
}

// 🔊 Synth sound players upgraded to custom platform-specific luxury sounds
const playNavigationSound = () => {
  playTapSound();
};

const playChimeSound = () => {
  playSuccessSound();
};

// 🗺️ Categorized outline sections, target outcomes and details for each track
const trackGuides = {
  non_muslim: {
    introAr: "مسار مخصص لغير المسلمين والباحثين عن الحقيقة لمناقشة التساؤلات الوجودية الكبرى وعرض رسالة الإسلام السامية بالدليل العقلي.",
    introEn: "A dedicated path for non-Muslims and truth seekers to discuss ultimate existential questions and present the message of Islam using rational proof.",
    outcomesAr: [
      "فهم حكمة الوجود والخلق والغاية الإنسانية.",
      "التعرف على أدلة نبوة الرسول ﷺ وإعجاز القرآن.",
      "تفكيك الشبهات المثارة حول التوحيد والرسالة بالدليل الهادئ."
    ],
    outcomesEn: [
      "Understand the wisdom of creation and existence.",
      "Explore proofs of Prophethood and Quranic miracles.",
      "Deconstruct common misconceptions with calm, logical evidence."
    ],
    sectionsAr: [
      "القسم الأول: كوكب الوجود والغاية من الحياة (أسئلة منطقية).",
      "القسم الثاني: كوكب الوحي والرسالة الخاتمة (أدلة النبوة).",
      "القسم الثالث: كوكب تفنيد الشبهات الكبرى بالحكمة والمجادلة الحسنة."
    ],
    sectionsEn: [
      "Section 1: The Orbit of Existence and Life Purpose.",
      "Section 2: The Orbit of Revelation and the Final Message.",
      "Section 3: Deconstructing Common Misconceptions with Wisdom."
    ]
  },
  new_muslim: {
    introAr: "الدليل العملي التأسيسي الشامل للمهتدي الجديد لتثبيت المعرفة، تعلم الوضوء والصلاة، وفهم مبادئ العقيدة والتوحيد بيسر وتدرج.",
    introEn: "The essential structured roadmap for new Muslims to build a strong foundation, learn wudu & prayer, and practice everyday rituals with ease.",
    outcomesAr: [
      "إتقان خطوات الوضوء والصلاة عملياً وبطريقة بصرية ميسرة.",
      "فهم أركان الإيمان الستة والعقيدة الصافية الواضحة.",
      "تعلم الأدعية اليومية وبناء عادات إيمانية مستدامة."
    ],
    outcomesEn: [
      "Master the step-by-step method of wudu & prayer.",
      "Build a clear understanding of the 6 pillars of Iman.",
      "Learn essential daily supplications and build lasting rituals."
    ],
    sectionsAr: [
      "القسم الأول: كوكب العقيدة والتوحيد وأركان الإيمان الستة.",
      "القسم الثاني: كوكب فقه العبادات اليومية والوضوء والصلاة.",
      "القسم الثالث: كوكب المعاملات والأخلاق النبوية الشريفة."
    ],
    sectionsEn: [
      "Section 1: The Orbit of Creed, Monotheism, & the Six Pillars.",
      "Section 2: Practical Jurisprudence of Purification & Prayer.",
      "Section 3: Prophetic Character & Everyday Etiquette."
    ]
  },
  muslim: {
    introAr: "مسار للمسلم المعاصر الراغب في تعميق معرفته الشرعية وتصحيح العبادات ومواجهة تيارات الشبهات وبناء وقاية إيمانية علمية رصينة.",
    introEn: "A comprehensive pathway designed for Muslims seeking to deepen their understanding, refine daily worship, and cultivate spiritual guardrails.",
    outcomesAr: [
      "تصحيح الأخطاء الشائعة في فقه العبادات والمعاملات اليومية.",
      "تزكية النفوس والأخلاق بالاستناد على السلف والقرآن والسنة.",
      "بناء درع علمي رصين ومناعة إيمانية كافية ضد الشكوك المعاصرة."
    ],
    outcomesEn: [
      "Refine everyday worship and eliminate common prayer mistakes.",
      "Purify the soul & refine ethics from Quranic & Sunnah teachings.",
      "Build cognitive resilience & scientific immunity against doubts."
    ],
    sectionsAr: [
      "القسم الأول: كوكب العبادات التفصيلي والسنن والآداب الشرعية.",
      "القسم الثاني: كوكب السلوك والتزكية وتحصين الأخلاق.",
      "القسم الثالث: كوكب العقيدة الصحيحة الواقية والرد الحاسم."
    ],
    sectionsEn: [
      "Section 1: Detailed Jurisprudence of Worship & Blessed Sunan.",
      "Section 2: Soul Purification, Hearts, & Islamic Character.",
      "Section 3: Protective Creed & Rational Refutation of Doubts."
    ]
  },
  daiyah: {
    introAr: "حقيبة تأهيلية شاملة للداعية المعاصر لتمكينه من مهارات الإقناع وأدب الحوار واستخدام وسائل العصر بطرق هادفة ومسندة.",
    introEn: "An advanced practical track for modern educators & callers, sharpening dialogue skills, logical proofs, and polite, wise persuasion.",
    outcomesAr: [
      "اكتساب منهجية الحوار الهادئ الفعال مع مختلف الثقافات.",
      "تعلم تكتيكات تفنيد الأسئلة المحرجة والشائعة بالحجة الواضحة.",
      "التمكن من أدوات الإسناد العلمي والمستودع الدعوي الرقمي للتحقق."
    ],
    outcomesEn: [
      "Adopt gentle, effective dialogue methods for diverse audiences.",
      "Learn modern apologetics and wise answers to difficult questions.",
      "Master the use of verified digital source registries."
    ],
    sectionsAr: [
      "القسم الأول: كوكب أصول الدعوة ومناهج الحوار البناء.",
      "القسم الثاني: كوكب منهجية الرد العلمي وفنون التفنيد والمناظرة.",
      "القسم الثالث: كوكب مهارات التواصل المعاصر والإقناع والدعوة الرقمية."
    ],
    sectionsEn: [
      "Section 1: Foundations of Da'wah and Dialectic Etiquettes.",
      "Section 2: Epistemology of Scientific Proof & Apologetics.",
      "Section 3: Modern Communication, Digital Reach, & Visual Delivery."
    ]
  }
};

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

  // Carousel slider state
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  // Guide Overview modal state
  const [guidedTrackId, setGuidedTrackId] = useState<TrackId | null>(null);

  const tracks = [
    {
      id: 'non_muslim' as TrackId,
      title: UI_TRANSLATIONS.tracks.non_muslim.title[language] || UI_TRANSLATIONS.tracks.non_muslim.title.en,
      description: UI_TRANSLATIONS.tracks.non_muslim.desc[language] || UI_TRANSLATIONS.tracks.non_muslim.desc.en,
      icon: HelpCircle,
      accentColor: 'from-amber-600 to-amber-800',
      badgeIcon: '🧭',
      badgeText: isAr ? 'مسار التعريف' : isUr ? 'تعارفی مسار' : 'Outreach Path',
      audience: isAr ? 'للباحثين عن الحقيقة والتعريف بالإسلام' : 'For truth seekers exploring Islam',
    },
    {
      id: 'new_muslim' as TrackId,
      title: UI_TRANSLATIONS.tracks.new_muslim.title[language] || UI_TRANSLATIONS.tracks.new_muslim.title.en,
      description: UI_TRANSLATIONS.tracks.new_muslim.desc[language] || UI_TRANSLATIONS.tracks.new_muslim.desc.en,
      icon: Sun,
      accentColor: 'from-emerald-600 to-emerald-800',
      badgeIcon: '🎯',
      badgeText: isAr ? 'التعليم الأساسي' : isUr ? 'بنیادی مسار' : 'Core Foundation',
      audience: isAr ? 'للمهتدين الجدد: خطوات التثبيت والعبادات' : 'For new Muslims: foundation & practice',
    },
    {
      id: 'muslim' as TrackId,
      title: UI_TRANSLATIONS.tracks.muslim.title[language] || UI_TRANSLATIONS.tracks.muslim.title.en,
      description: UI_TRANSLATIONS.tracks.muslim.desc[language] || UI_TRANSLATIONS.tracks.muslim.desc.en,
      icon: Home,
      accentColor: 'from-slate-700 to-slate-900',
      badgeIcon: '🌱',
      badgeText: isAr ? 'التصحيح والتزكية' : isUr ? 'ایمانی پختگی' : 'Deepening & Practice',
      audience: isAr ? 'لعموم المسلمين: تصحيح العبادة وتزكية النفس' : 'For Muslims: refining faith & spirituality',
    },
    {
      id: 'daiyah' as TrackId,
      title: UI_TRANSLATIONS.tracks.daiyah.title[language] || UI_TRANSLATIONS.tracks.daiyah.title.en,
      description: UI_TRANSLATIONS.tracks.daiyah.desc[language] || UI_TRANSLATIONS.tracks.daiyah.desc.en,
      icon: Volume2,
      accentColor: 'from-[#1E3A2F] to-[#0A1D15]',
      badgeIcon: '📢',
      badgeText: isAr ? 'تمكين الدعاة' : isUr ? 'داعی مسار' : 'Educator & Caller',
      audience: isAr ? 'لتأهيل الدعاة وتفنيد الشبهات بالحكمة' : 'For callers: dialogue skills & wisdom',
    },
  ];

  // Sync activeSlideIndex with selectedTrack on mount or when changed externally
  useEffect(() => {
    if (selectedTrack) {
      const idx = tracks.findIndex((t) => t.id === selectedTrack);
      if (idx !== -1) {
        setActiveSlideIndex(idx);
      }
    }
  }, [selectedTrack]);

  // Handle slide movement with Arrow Keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handlePrev();
      } else if (e.key === 'ArrowLeft') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlideIndex]);

  const handleNext = () => {
    playNavigationSound();
    setActiveSlideIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrev = () => {
    playNavigationSound();
    setActiveSlideIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffX) > 35) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  const handleOpenGuide = (trackId: TrackId) => {
    playChimeSound();
    setGuidedTrackId(trackId);
  };

  const handleStartTrack = (trackId: TrackId, initialMode?: 'tutor' | 'map' | 'quran') => {
    playChimeSound();
    onSelectTrack(trackId, initialMode);
    setGuidedTrackId(null);
  };

  const activeTrack = tracks[activeSlideIndex];
  const ActiveIcon = activeTrack.icon;

  // 🕌 High-fidelity 8-point Islamic star geometric pattern helper (Rub el Hizb)
  const IslamicStarSVG = ({ className = "w-4 h-4 text-amber-500/40" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.4 2.4H18v3.6l2.4 2.4-2.4 2.4V16.8h-3.6L12 19.2l-2.4-2.4H6v-3.6L3.6 10.8 6 8.4V4.8h3.6z" />
    </svg>
  );

  // ⚜️ Elegant double-lined divider with central geometric star for manuscript aesthetic
  const RoyalDivider = () => (
    <div className="flex items-center justify-center gap-3 my-4">
      <div className="h-[1px] w-14 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-[#D4AF37]"></div>
      <IslamicStarSVG className="w-4.5 h-4.5 text-[#D4AF37] animate-pulse" />
      <div className="h-[1px] w-14 bg-gradient-to-l from-transparent via-[#D4AF37]/60 to-[#D4AF37]"></div>
    </div>
  );

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 max-w-5xl mx-auto" dir="rtl">
      
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

          {onNavigateToTab && (
            <button
              onClick={() => {
                playNavigationSound();
                onNavigateToTab('dhikr');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-50 via-white to-amber-50 text-amber-950 border border-rose-200 hover:border-amber-400 text-xs font-bold hover:shadow-xs transition cursor-pointer shadow-3xs"
            >
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>{isAr ? 'ركن الأذكار والمسبحة' : 'Dhikr & Tasbih'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">{isAr ? 'تفاعلي' : 'New'}</span>
            </button>
          )}
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3 font-serif">
          {language === 'ar'
            ? 'بوابة المسارات التعليمية المنهجية'
            : 'Methodical Learning Pathways Portal'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {language === 'ar'
            ? 'رحلات تفاعلية ودعوية منظمة تتحرك بمرونة الأسهم والأصوات المساندة، مخصصة ومبوبة لكل فئة لضمان التدرج وتأصيل المفاهيم بيسر.'
            : 'Interactive guided pathways with sound feedback & arrow controls, mapped beautifully into custom categorized stages.'}
        </p>
      </div>

      {/* 🔮 Arrow Navigated Carousel for Tracks (عرض مسارات المعرفة التفاعلي بالأسهم واللمس وصوت النقر) */}
      <div className="mb-14 relative px-2 sm:px-12">
        <div className="flex items-center gap-2 mb-6 justify-center sm:justify-start">
          <div className="w-2 h-5 rounded-full bg-amber-600"></div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
            {isAr ? 'قائمة تصفح المسارات بالأسهم (لوحة التفاعل الصوتي)' : 'Slide with Arrows (Synth Sound-Feedback)'}
          </h2>
        </div>

        {/* Main Slider Display Area */}
        <div className="relative flex items-center justify-center min-h-[360px] md:min-h-[320px]">
          
          {/* Arrow Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute -right-1 sm:-right-4 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-white to-[#FDFBF7] border-2 border-[#D4AF37]/60 text-amber-900 hover:text-white hover:bg-gradient-to-br hover:from-amber-600 hover:to-amber-800 hover:border-amber-700 hover:shadow-lg hover:shadow-amber-600/25 shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center active:scale-90 shrink-0"
            title={isAr ? 'المسار السابق' : 'Previous Track'}
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>

          {/* Core Focus Sliding Card */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="w-full max-w-lg mx-auto bg-gradient-to-br from-white via-[#FCFAF5] to-[#F6F0E5] border-3 border-[#D4AF37]/50 rounded-[28px] sm:rounded-[32px] p-4.5 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between transition-all duration-500 scale-100 group animate-fadeIn luxury-card-glow touch-pan-y"
          >
            
            {/* 💡 Modern Professional Radial Light-Reveal Sheen Overlay */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D4AF37]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

            {/* Elegant Double Inner Border Frame */}
            <div className="absolute inset-2 border border-[#D4AF37]/25 rounded-[24px] pointer-events-none group-hover:border-[#D4AF37]/55 transition-colors duration-300" />

            {/* Symmetrical 8-point golden star ornaments in the card corners */}
            <div className="absolute top-4 left-4 pointer-events-none opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <IslamicStarSVG className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
            <div className="absolute top-4 right-4 pointer-events-none opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <IslamicStarSVG className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
            <div className="absolute bottom-4 left-4 pointer-events-none opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <IslamicStarSVG className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
            <div className="absolute bottom-4 right-4 pointer-events-none opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <IslamicStarSVG className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>

            <div className="relative z-10">
              {/* Badge & Type with WebP-Accelerated Asset */}
              <div className="flex items-start justify-between gap-2 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF8E7] to-[#F5EAD4] text-amber-950 border-2 border-[#D4AF37]/40 relative overflow-hidden shadow-md shadow-amber-900/5 group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <ActiveIcon className="w-7 h-7 stroke-[1.8] text-amber-900" />
                    </div>
                    <OptimizedImage
                      src={`/assets/track-${activeTrack.id === 'muslim' ? 'muslim' : activeTrack.id === 'new_muslim' ? 'new-muslim' : activeTrack.id === 'non_muslim' ? 'non-muslim' : 'daiyah'}.webp`}
                      alt={activeTrack.title}
                      className="absolute inset-0 opacity-20 pointer-events-none w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-900 border border-emerald-200 shadow-3xs select-none">
                  <span className="text-xs leading-none flex items-center justify-center shrink-0">{activeTrack.badgeIcon}</span>
                  <span className="font-bold leading-tight">{activeTrack.badgeText}</span>
                </div>
              </div>

              {/* Title & Audience */}
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 font-serif tracking-tight">
                {activeTrack.title}
              </h3>
              
              <div className="text-xs font-black text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                <span>{activeTrack.audience}</span>
              </div>

              {/* Royal divider helper inside card */}
              <div className="my-3 opacity-65">
                <RoyalDivider />
              </div>

              {/* Short Preview description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                {activeTrack.description}
              </p>
            </div>

            {/* Main call to Action */}
            <div className="pt-4 border-t border-[#D4AF37]/20 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleOpenGuide(activeTrack.id)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-[0_8px_25px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-95 cursor-pointer border border-[#D4AF37]/45 relative overflow-hidden group/btn before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
              >
                <Info className="w-4 h-4 text-amber-200" />
                <span>{isAr ? 'استعراض الشرح وخطة المسار' : 'View Guide & Outline'}</span>
              </button>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold font-mono">
                <span>{activeSlideIndex + 1} / {tracks.length}</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-100">{isAr ? 'لوحة تصفح' : 'Slider'}</span>
              </div>
            </div>
          </div>

          {/* Arrow Next Button */}
          <button
            onClick={handleNext}
            className="absolute -left-1 sm:-left-4 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-white to-[#FDFBF7] border-2 border-[#D4AF37]/60 text-amber-900 hover:text-white hover:bg-gradient-to-br hover:from-amber-600 hover:to-amber-800 hover:border-amber-700 hover:shadow-lg hover:shadow-amber-600/25 shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center active:scale-90 shrink-0"
            title={isAr ? 'المسار التالي' : 'Next Track'}
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Bullet Progress Indicators */}
        <div className="flex items-center justify-center gap-2.5 mt-6">
          {tracks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                playNavigationSound();
                setActiveSlideIndex(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlideIndex === idx ? 'w-8 bg-amber-600' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 🗺️ 2. Specialized Hubs & Community Ease Winding Roadmap (الواحات المتخصصة والتيسير المجتمعي في خريطة متعرجة متصلة فخمة) */}
      {onNavigateToTab && (
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6 justify-center sm:justify-start">
            <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#D4AF37] to-emerald-700 shadow-md"></div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 font-serif">
              {isAr ? 'مسار الواحات المتخصصة والتيسير المجتمعي (خريطة تسلسلية مذهبة)' : 'Specialized Community Hubs Winding Roadmap'}
            </h2>
          </div>

          {/* Majestic Royal Road Map Frame (لوحة إطار المخطوطة الملكية المذهبة المزدوجة) */}
          <div className="relative py-14 px-5 sm:px-10 bg-gradient-to-br from-[#FCFAF6] via-[#FAF5EE] to-[#EFE7DC] border-4 border-double border-[#D4AF37]/60 rounded-[40px] overflow-hidden shadow-[0_25px_60px_rgba(212,175,55,0.12)]">
            
            {/* Elegant Arabesque corner geometric stars (زوايا زخرفية إسلامية مذهبة) */}
            <div className="absolute top-4 right-4 pointer-events-none select-none">
              <IslamicStarSVG className="w-10 h-10 text-[#D4AF37]/20" />
            </div>
            <div className="absolute top-4 left-4 pointer-events-none select-none">
              <IslamicStarSVG className="w-10 h-10 text-[#D4AF37]/20" />
            </div>
            <div className="absolute bottom-4 right-4 pointer-events-none select-none">
              <IslamicStarSVG className="w-10 h-10 text-[#D4AF37]/20" />
            </div>
            <div className="absolute bottom-4 left-4 pointer-events-none select-none">
              <IslamicStarSVG className="w-10 h-10 text-[#D4AF37]/20" />
            </div>

            {/* 🗺️ Wavy Connected Golden Rope (حبل مذهب متعرج يربط بطاقات الأقسام واللؤلؤ الملكي فائق الفخامة) */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <svg className="w-full h-full" viewBox="0 0 200 800" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="goldRopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9A7B31" />
                    <stop offset="20%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#FFF7D1" />
                    <stop offset="80%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#7A5C1E" />
                  </linearGradient>
                  <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="7" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                {/* Smooth sweeping sinusoidal wave path connecting the cards and pearls */}
                <path 
                  d="M100,0 C175,100 175,100 100,200 C25,300 25,300 100,400 C175,500 175,500 100,600 C25,700 25,700 100,800"
                  fill="none" 
                  stroke="#D4AF37" 
                  strokeWidth="8" 
                  strokeOpacity="0.25" 
                  filter="url(#goldGlow)" 
                />
                <path 
                  d="M100,0 C175,100 175,100 100,200 C25,300 25,300 100,400 C175,500 175,500 100,600 C25,700 25,700 100,800"
                  fill="none" 
                  stroke="url(#goldRopeGrad)" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeDasharray="10,3.5" 
                />
                <path 
                  d="M100,0 C175,100 175,100 100,200 C25,300 25,300 100,400 C175,500 175,500 100,600 C25,700 25,700 100,800"
                  fill="none" 
                  stroke="#FFF2B2" 
                  strokeWidth="1.2" 
                  strokeOpacity="0.85" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>

            {/* Winding Zigzag Steps Rows */}
            <div className="space-y-14 relative z-10">
              
              {/* Step 1: واحة براعم عِلم */}
              <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center md:flex-row-reverse animate-fadeIn">
                {/* Card Block */}
                <div 
                  onClick={() => { playNavigationSound(); onNavigateToTab('ilmJunior'); }}
                  className="w-full md:w-[45%] bg-gradient-to-br from-white via-[#FCFAF8] to-[#FAF5EC] border-2 border-[#D4AF37]/30 rounded-[28px] p-6 shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden group luxury-card-glow"
                >
                  {/* 💡 Light-Reveal Hover Glow Overlay */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/8 rounded-full blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                  {/* Subtle Inner Double Border */}
                  <div className="absolute inset-1.5 border border-[#D4AF37]/15 rounded-[22px] pointer-events-none group-hover:border-[#D4AF37]/35 transition-colors duration-300" />

                  {/* Four Royal Golden Corner Accents inside card */}
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/35 rounded-tr-[4px] pointer-events-none group-hover:border-[#D4AF37] group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/35 rounded-tl-[4px] pointer-events-none group-hover:border-[#D4AF37] group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/35 rounded-br-[4px] pointer-events-none group-hover:border-[#D4AF37] group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/35 rounded-bl-[4px] pointer-events-none group-hover:border-[#D4AF37] group-hover:scale-110 transition-all duration-300" />

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FDFBF7] to-[#F5EAD4] text-amber-950 border-2 border-[#D4AF37]/45 flex items-center justify-center shrink-0 shadow-md shadow-amber-900/5 group-hover:scale-110 transition-transform">
                      <Smile className="w-7 h-6 stroke-[1.8]" />
                    </div>
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-50 to-amber-100 text-amber-900 border border-amber-200 shadow-2xs mb-2.5">
                        {isAr ? 'المحطة الأولى 🌸 واحة الأشبال' : 'Step 1'}
                      </span>
                      <h4 className="text-lg font-black text-slate-900 mb-1.5 group-hover:text-amber-950 transition-colors">
                        {isAr ? 'واحة براعم عِلم' : 'ILM Junior Hub'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {isAr ? 'قصص عذبة، مسابقات تفاعلية، وعقيدة ميسرة للأشبال (6-12 سنة) مع لوحة متابعة خاصة لولي الأمر.' : 'Stories, fun quizzes, and parent progress dashboard for kids.'}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                        <span>{isAr ? 'دخول الواحة' : 'Open Hub'}</span>
                        <ArrowIcon className="w-4 h-4 group-hover:translate-x-[-5px] transition-transform text-[#D4AF37]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Golden Pearl Center node (عقدة اللؤلؤة الذهبية المضيئة) */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="absolute w-14 h-14 rounded-full bg-amber-500/20 animate-ping opacity-60"></div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white via-[#FDF9F0] to-[#E3C594] border-3 border-[#D4AF37] flex items-center justify-center font-black text-base text-amber-950 shadow-[0_4px_15px_rgba(212,175,55,0.4)] ring-4 ring-amber-100/60 relative z-10 hover:scale-115 hover:rotate-45 transition-all cursor-pointer">
                    <span className="font-serif">١</span>
                  </div>
                </div>

                {/* Spacing alignment helper block for desktop grid balance */}
                <div className="hidden md:block w-[45%]" />
              </div>

              {/* Step 2: قاموس لغة الإشارة */}
              <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center md:flex-row animate-fadeIn">
                {/* Card Block */}
                <div 
                  onClick={() => { playNavigationSound(); onNavigateToTab('signLanguage'); }}
                  className="w-full md:w-[45%] bg-gradient-to-br from-white via-[#FCFAF8] to-[#FAF5EC] border-2 border-emerald-500/30 rounded-[28px] p-6 shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden group luxury-card-glow-emerald"
                >
                  {/* 💡 Light-Reveal Hover Glow Overlay */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-500/8 rounded-full blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                  {/* Subtle Inner Double Border */}
                  <div className="absolute inset-1.5 border border-emerald-500/15 rounded-[22px] pointer-events-none group-hover:border-emerald-500/35 transition-colors duration-300" />

                  {/* Four Royal Golden Corner Accents inside card */}
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-500/35 rounded-tr-[4px] pointer-events-none group-hover:border-emerald-500 group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-500/35 rounded-tl-[4px] pointer-events-none group-hover:border-emerald-500 group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-500/35 rounded-br-[4px] pointer-events-none group-hover:border-emerald-500 group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-500/35 rounded-bl-[4px] pointer-events-none group-hover:border-emerald-500 group-hover:scale-110 transition-all duration-300" />

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] text-emerald-950 border-2 border-emerald-250 flex items-center justify-center shrink-0 shadow-md shadow-emerald-900/5 group-hover:scale-110 transition-transform">
                      <HandMetal className="w-7 h-6 stroke-[1.8]" />
                    </div>
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-900 border border-emerald-200 shadow-2xs mb-2.5">
                        {isAr ? 'المحطة الثانية 🖐️ لغة الإشارة' : 'Step 2'}
                      </span>
                      <h4 className="text-lg font-black text-slate-900 mb-1.5 group-hover:text-emerald-950 transition-colors">
                        {isAr ? 'قاموس لغة الإشارة الإسلامي' : 'Sign Language Hub'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {isAr ? 'شرح حركي وبصري فريد لأركان الإسلام، الوضوء، والصلاة لذوي الهمم (الصم والبكم) مع وضع العرض البطيء الهادئ.' : 'Visual sign language for Islamic pillars, wudu & prayer.'}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900">
                        <span>{isAr ? 'استعراض القاموس' : 'View Guide'}</span>
                        <ArrowIcon className="w-4 h-4 group-hover:translate-x-[-5px] transition-transform text-emerald-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Golden Pearl Center node */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="absolute w-14 h-14 rounded-full bg-emerald-500/20 animate-ping opacity-60"></div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-50 via-white to-[#A5D6A7] border-3 border-emerald-500 flex items-center justify-center font-black text-base text-emerald-950 shadow-[0_4px_15px_rgba(16,185,129,0.35)] ring-4 ring-emerald-100/60 relative z-10 hover:scale-115 hover:rotate-45 transition-all cursor-pointer">
                    <span className="font-serif">٢</span>
                  </div>
                </div>

                {/* Spacing alignment helper block for desktop grid balance */}
                <div className="hidden md:block w-[45%]" />
              </div>

              {/* Step 3: دليل التوطين الثقافي */}
              <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center md:flex-row-reverse animate-fadeIn">
                {/* Card Block */}
                <div 
                  onClick={() => { playNavigationSound(); onNavigateToTab('culturalEtiquette'); }}
                  className="w-full md:w-[45%] bg-gradient-to-br from-white via-[#FCFAF8] to-[#FAF5EC] border-2 border-teal-500/30 rounded-[28px] p-6 shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden group luxury-card-glow"
                >
                  {/* 💡 Light-Reveal Hover Glow Overlay */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-teal-500/8 rounded-full blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                  {/* Subtle Inner Double Border */}
                  <div className="absolute inset-1.5 border border-teal-500/15 rounded-[22px] pointer-events-none group-hover:border-teal-500/35 transition-colors duration-300" />

                  {/* Four Royal Golden Corner Accents inside card */}
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-teal-500/35 rounded-tr-[4px] pointer-events-none group-hover:border-teal-500 group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-teal-500/35 rounded-tl-[4px] pointer-events-none group-hover:border-teal-500 group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-teal-500/35 rounded-br-[4px] pointer-events-none group-hover:border-teal-500 group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-teal-500/35 rounded-bl-[4px] pointer-events-none group-hover:border-teal-500 group-hover:scale-110 transition-all duration-300" />

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E0F2F1] to-[#B2DFDB] text-teal-950 border-2 border-[#B2DFDB] flex items-center justify-center shrink-0 shadow-md shadow-teal-900/5 group-hover:scale-110 transition-transform">
                      <Globe2 className="w-7 h-6 stroke-[1.8]" />
                    </div>
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-teal-50 to-teal-100 text-teal-900 border border-teal-200 shadow-2xs mb-2.5">
                        {isAr ? 'المحطة الثالثة 🌍 التوطين الثقافي' : 'Step 3'}
                      </span>
                      <h4 className="text-lg font-black text-slate-900 mb-1.5 group-hover:text-teal-950 transition-colors">
                        {isAr ? 'دليل التوطين الثقافي والآداب' : 'Cultural Etiquette'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {isAr ? 'آداب المساجد والجوار، أساليب العمل والتعايش للجاليات الأجنبية والمقيمين بـ 5 لغات عالمية معتمدة شرعياً.' : 'Social & Islamic etiquette for expatriates in 5 languages.'}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs font-black text-teal-900">
                        <span>{isAr ? 'دليل الجاليات' : 'Read Guide'}</span>
                        <ArrowIcon className="w-4 h-4 group-hover:translate-x-[-5px] transition-transform text-teal-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Golden Pearl Center node */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="absolute w-14 h-14 rounded-full bg-teal-500/20 animate-ping opacity-60"></div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-50 via-white to-[#80CBC4] border-3 border-teal-500 flex items-center justify-center font-black text-base text-teal-950 shadow-[0_4px_15px_rgba(13,148,136,0.35)] ring-4 ring-teal-100/60 relative z-10 hover:scale-115 hover:rotate-45 transition-all cursor-pointer">
                    <span className="font-serif">٣</span>
                  </div>
                </div>

                {/* Spacing alignment helper block for desktop grid balance */}
                <div className="hidden md:block w-[45%]" />
              </div>

              {/* Step 4: الأيام الـ 30 الأولى */}
              <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center md:flex-row animate-fadeIn">
                {/* Card Block */}
                <div 
                  onClick={() => { playNavigationSound(); onNavigateToTab('thirtyDays'); }}
                  className="w-full md:w-[45%] bg-gradient-to-br from-white via-[#FCFAF8] to-[#FAF5EC] border-2 border-amber-500/30 rounded-[28px] p-6 shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden group luxury-card-glow"
                >
                  {/* 💡 Light-Reveal Hover Glow Overlay */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/8 rounded-full blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                  {/* Subtle Inner Double Border */}
                  <div className="absolute inset-1.5 border border-amber-500/15 rounded-[22px] pointer-events-none group-hover:border-[#D4AF37]/35 transition-colors duration-300" />

                  {/* Four Royal Golden Corner Accents inside card */}
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-600/35 rounded-tr-[4px] pointer-events-none group-hover:border-[#D4AF37] group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-600/35 rounded-tl-[4px] pointer-events-none group-hover:border-[#D4AF37] group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-600/35 rounded-br-[4px] pointer-events-none group-hover:border-[#D4AF37] group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/35 rounded-bl-[4px] pointer-events-none group-hover:border-[#D4AF37] group-hover:scale-110 transition-all duration-300" />

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFFDEB] to-[#F5EAD4] text-amber-950 border-2 border-amber-250 flex items-center justify-center shrink-0 shadow-md shadow-amber-900/5 group-hover:scale-110 transition-transform">
                      <Calendar className="w-7 h-6 stroke-[1.8]" />
                    </div>
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-50 to-amber-100 text-amber-900 border border-amber-200 shadow-2xs mb-2.5">
                        {isAr ? 'المحطة الرابعة 📅 الأيام الأولى' : 'Step 4'}
                      </span>
                      <h4 className="text-lg font-black text-slate-900 mb-1.5 group-hover:text-amber-950 transition-colors">
                        {isAr ? 'الأيام الـ 30 الأولى للمسلم الجديد' : 'First 30 Days'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {isAr ? 'خطة يومية هادئة وجداول زمنية مبسطة للمهتدي الجديد: خطوة واحدة دعوية ودعاء مأثور وقصير كل يوم.' : 'Step-by-step 30-day gentle journey for new Muslims.'}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                        <span>{isAr ? 'بدء الرحلة' : 'Start Journey'}</span>
                        <ArrowIcon className="w-4 h-4 group-hover:translate-x-[-5px] transition-transform text-amber-700" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Golden Pearl Center node */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="absolute w-14 h-14 rounded-full bg-amber-500/20 animate-ping opacity-60"></div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-50 via-white to-[#F0D48B] border-3 border-amber-500 flex items-center justify-center font-black text-base text-amber-950 shadow-[0_4px_15px_rgba(245,158,11,0.35)] ring-4 ring-amber-100/60 relative z-10 hover:scale-115 hover:rotate-45 transition-all cursor-pointer">
                    <span className="font-serif">٤</span>
                  </div>
                </div>

                {/* Spacing alignment helper block for desktop grid balance */}
                <div className="hidden md:block w-[45%]" />
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 🗺️ 3. Da'iyah & Research Toolkits Winding Roadmap (أدوات الداعية والباحث والمختبر في خريطة متعرجة متصلة فخمة) */}
      {onNavigateToTab && (
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6 justify-center sm:justify-start">
            <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#D4AF37] to-slate-800 shadow-md"></div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 font-serif">
              {isAr ? 'مسار الداعية، الباحث والمختبر الميداني (حقائب وتطبيقات عملية)' : 'Da\'iyah, Researcher & Lab Toolkits Winding Roadmap'}
            </h2>
          </div>

          {/* Majestic Royal Gilded Book Cover Frame (لوحة إطار المخطوطة الجلدية الخضراء الفاخرة والمذهبة) */}
          <div className="relative py-14 px-5 sm:px-10 bg-gradient-to-br from-[#0B1511] via-[#12241E] to-[#08100C] border-4 border-double border-[#D4AF37]/75 rounded-[40px] overflow-hidden shadow-[0_25px_60px_rgba(18,36,30,0.3)]">
            
            {/* Elegant Arabesque corner geometric stars (زوايا زخرفية إسلامية مذهبة) */}
            <div className="absolute top-4 right-4 pointer-events-none select-none">
              <IslamicStarSVG className="w-10 h-10 text-[#D4AF37]/30" />
            </div>
            <div className="absolute top-4 left-4 pointer-events-none select-none">
              <IslamicStarSVG className="w-10 h-10 text-[#D4AF37]/30" />
            </div>
            <div className="absolute bottom-4 right-4 pointer-events-none select-none">
              <IslamicStarSVG className="w-10 h-10 text-[#D4AF37]/30" />
            </div>
            <div className="absolute bottom-4 left-4 pointer-events-none select-none">
              <IslamicStarSVG className="w-10 h-10 text-[#D4AF37]/30" />
            </div>

            {/* 🗺️ Wavy Connected Golden-Emerald Rope (حبل مذهب مطعم بالزمرد متعرج يربط بطاقات الأقسام واللؤلؤ الملكي فائق الفخامة) */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <svg className="w-full h-full" viewBox="0 0 200 800" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="emeraldGoldRopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="25%" stopColor="#10B981" />
                    <stop offset="50%" stopColor="#FFF2B2" />
                    <stop offset="75%" stopColor="#047857" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                  <filter id="emeraldGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                {/* Smooth sweeping sinusoidal wave path connecting the cards and pearls */}
                <path 
                  d="M100,0 C175,100 175,100 100,200 C25,300 25,300 100,400 C175,500 175,500 100,600 C25,700 25,700 100,800"
                  fill="none" 
                  stroke="#10B981" 
                  strokeWidth="8" 
                  strokeOpacity="0.22" 
                  filter="url(#emeraldGlow)" 
                />
                <path 
                  d="M100,0 C175,100 175,100 100,200 C25,300 25,300 100,400 C175,500 175,500 100,600 C25,700 25,700 100,800"
                  fill="none" 
                  stroke="url(#emeraldGoldRopeGrad)" 
                  strokeWidth="4.5" 
                  strokeLinecap="round" 
                  strokeDasharray="9,3.5" 
                />
                <path 
                  d="M100,0 C175,100 175,100 100,200 C25,300 25,300 100,400 C175,500 175,500 100,600 C25,700 25,700 100,800"
                  fill="none" 
                  stroke="#FFF3D4" 
                  strokeWidth="1.2" 
                  strokeOpacity="0.9" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>

            {/* Winding Zigzag Steps Rows */}
            <div className="space-y-12 relative z-10">
              
              {/* Step 1: البحث التأصيلي المقارن */}
              <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center md:flex-row-reverse">
                {/* Card Block */}
                <div 
                  onClick={() => { playNavigationSound(); onNavigateToTab('scholasticSearch'); }}
                  className="w-full md:w-[45%] bg-gradient-to-br from-[#12221D] via-[#172D25] to-[#0D1B17] border-2 border-[#D4AF37]/35 rounded-[24px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-pointer relative overflow-hidden group luxury-card-glow-emerald"
                >
                  {/* 💡 Light-Reveal Hover Glow Overlay (Gold glow on deep green) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-16 bg-[#D4AF37]/10 rounded-full blur-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                  {/* Subtle Inner Double Border */}
                  <div className="absolute inset-1 border border-[#D4AF37]/15 rounded-[20px] pointer-events-none group-hover:border-[#D4AF37]/35 transition-colors duration-300" />

                  {/* Corner Ornaments */}
                  <div className="absolute top-2 right-2 opacity-35 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <IslamicStarSVG className="w-3 h-3 text-[#D4AF37]" />
                  </div>
                  <div className="absolute bottom-2 left-2 opacity-35 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <IslamicStarSVG className="w-3 h-3 text-[#D4AF37]" />
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1C332A] to-[#13241D] text-amber-100 border border-[#D4AF37]/35 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Search className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#1C332A] text-amber-200 border border-[#D4AF37]/25 mb-2 select-none">
                        <span>{isAr ? 'المحطة الأولى' : 'Step 1'}</span>
                        {isAr && <span className="text-xs leading-none flex items-center justify-center">🔍</span>}
                        <span>{isAr ? 'تأصيل' : ''}</span>
                      </div>
                      <h4 className="text-base font-black text-amber-100 mb-1.5 group-hover:text-amber-200 transition-colors font-serif">
                        {isAr ? 'البحث التأصيلي المقارن' : 'Scholastic Search'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                        {isAr ? 'محرك بحث متطور يقارن النصوص بين القرآن الكريم، الأحاديث النبوية المخرجة، المذاهب الأربعة، والمستودع الدعوي.' : 'Cross-source search comparing Quran, Hadith, 4 Madhabs & Dawa.'}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 group-hover:text-amber-200 transition-colors">
                        <span>{isAr ? 'فتح محرك البحث' : 'Open Search'}</span>
                        <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-[-4px] transition-transform text-[#D4AF37]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Golden Pearl Center node */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="absolute w-12 h-12 rounded-full bg-amber-500/20 animate-ping opacity-60"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#15241E] via-[#1E3E2F] to-[#12241E] border-2 border-[#D4AF37] flex items-center justify-center font-black text-xs text-amber-200 shadow-md ring-4 ring-amber-900/40 relative z-10 hover:scale-110 transition-transform cursor-pointer">
                    <span className="font-serif">١</span>
                  </div>
                </div>

                {/* Spacing alignment helper block for desktop grid balance */}
                <div className="hidden md:block w-[45%]" />
              </div>

              {/* Step 2: حقيبة وبطاقات الدعوة */}
              <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center md:flex-row">
                {/* Card Block */}
                <div 
                  onClick={() => { playNavigationSound(); onNavigateToTab('fieldDaiyah'); }}
                  className="w-full md:w-[45%] bg-gradient-to-br from-[#12221D] via-[#172D25] to-[#0D1B17] border-2 border-[#D4AF37]/35 rounded-[24px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-pointer relative overflow-hidden group luxury-card-glow-emerald"
                >
                  {/* 💡 Light-Reveal Hover Glow Overlay (Gold glow on deep green) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-16 bg-[#D4AF37]/10 rounded-full blur-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                  {/* Subtle Inner Double Border */}
                  <div className="absolute inset-1 border border-[#D4AF37]/15 rounded-[20px] pointer-events-none group-hover:border-[#D4AF37]/35 transition-colors duration-300" />

                  {/* Corner Ornaments */}
                  <div className="absolute top-2 right-2 opacity-35 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <IslamicStarSVG className="w-3 h-3 text-[#D4AF37]" />
                  </div>
                  <div className="absolute bottom-2 left-2 opacity-35 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <IslamicStarSVG className="w-3 h-3 text-[#D4AF37]" />
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1C332A] to-[#13241D] text-amber-100 border border-[#D4AF37]/35 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Printer className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#1C332A] text-amber-200 border border-[#D4AF37]/25 mb-2 select-none">
                        <span>{isAr ? 'المحطة الثانية' : 'Step 2'}</span>
                        {isAr && <span className="text-xs leading-none flex items-center justify-center">🖨️</span>}
                        <span>{isAr ? 'ميداني' : ''}</span>
                      </div>
                      <h4 className="text-base font-black text-amber-100 mb-1.5 group-hover:text-amber-200 transition-colors font-serif">
                        {isAr ? 'حقيبة وبطاقات الدعوة الميدانية' : 'Field Outreach Kit'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                        {isAr ? 'بطاقات تعريفية ميسرة وحقائب دعوية رقمية مخصصة للطباعة والمشاركة المباشرة عبر وسائل التواصل الاجتماعي بـ 5 لغات.' : 'Printable & digital outreach cards for field da\'wah in 5 languages.'}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 group-hover:text-amber-200 transition-colors">
                        <span>{isAr ? 'استعراض الحقيبة' : 'Open Kit'}</span>
                        <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-[-4px] transition-transform text-[#D4AF37]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Golden Pearl Center node */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="absolute w-12 h-12 rounded-full bg-amber-500/20 animate-ping opacity-60"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#15241E] via-[#1E3E2F] to-[#12241E] border-2 border-[#D4AF37] flex items-center justify-center font-black text-xs text-amber-200 shadow-md ring-4 ring-amber-900/40 relative z-10 hover:scale-110 transition-transform cursor-pointer">
                    <span className="font-serif">٢</span>
                  </div>
                </div>

                {/* Spacing alignment helper block for desktop grid balance */}
                <div className="hidden md:block w-[45%]" />
              </div>

              {/* Step 3: المساعد الميداني الفوري */}
              <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center md:flex-row-reverse">
                {/* Card Block */}
                <div 
                  onClick={() => { playNavigationSound(); onNavigateToTab('copilot'); }}
                  className="w-full md:w-[45%] bg-gradient-to-br from-[#12221D] via-[#172D25] to-[#0D1B17] border-2 border-[#D4AF37]/35 rounded-[24px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_45px_rgba(212,175,55,0.15)] hover:border-[#D4AF37] hover:scale-[1.03] transition-all duration-300 cursor-pointer relative overflow-hidden group"
                >
                  {/* Subtle Inner Double Border */}
                  <div className="absolute inset-1 border border-[#D4AF37]/15 rounded-[20px] pointer-events-none group-hover:border-[#D4AF37]/35 transition-colors duration-300" />

                  {/* Corner Ornaments */}
                  <div className="absolute top-2 right-2 opacity-35 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <IslamicStarSVG className="w-3 h-3 text-[#D4AF37]" />
                  </div>
                  <div className="absolute bottom-2 left-2 opacity-35 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <IslamicStarSVG className="w-3 h-3 text-[#D4AF37]" />
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1C332A] to-[#13241D] text-amber-100 border border-[#D4AF37]/35 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#1C332A] text-amber-200 border border-[#D4AF37]/25 mb-2 select-none">
                        <span>{isAr ? 'المحطة الثالثة' : 'Step 3'}</span>
                        {isAr && <span className="text-xs leading-none flex items-center justify-center">⚡</span>}
                        <span>{isAr ? 'تمكين' : ''}</span>
                      </div>
                      <h4 className="text-base font-black text-amber-100 mb-1.5 group-hover:text-amber-200 transition-colors font-serif">
                        {isAr ? 'المساعد الميداني الفوري (Co-Pilot)' : 'Field Co-Pilot'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                        {isAr ? 'أداتك الذكية لتقديم ردود عقلية فورية، تفنيد الشبهات بالحكمة، وبناء حوارات هادفة مسندة إلى المستودعات المعتمدة.' : 'Instant rational proofs & prophetic wisdom for field callers.'}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 group-hover:text-amber-200 transition-colors">
                        <span>{isAr ? 'المساعد الفوري' : 'Open Co-Pilot'}</span>
                        <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-[-4px] transition-transform text-[#D4AF37]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Golden Pearl Center node */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="absolute w-12 h-12 rounded-full bg-amber-500/20 animate-ping opacity-60"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#15241E] via-[#1E3E2F] to-[#12241E] border-2 border-[#D4AF37] flex items-center justify-center font-black text-xs text-amber-200 shadow-md ring-4 ring-amber-900/40 relative z-10 hover:scale-110 transition-transform cursor-pointer">
                    <span className="font-serif">٣</span>
                  </div>
                </div>

                {/* Spacing alignment helper block for desktop grid balance */}
                <div className="hidden md:block w-[45%]" />
              </div>

              {/* Step 4: سفراء عِلم */}
              <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center md:flex-row">
                {/* Card Block */}
                <div 
                  onClick={() => { playNavigationSound(); onNavigateToTab('ambassadors'); }}
                  className="w-full md:w-[45%] bg-gradient-to-br from-[#12221D] via-[#172D25] to-[#0D1B17] border-2 border-[#D4AF37]/35 rounded-[24px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_45px_rgba(212,175,55,0.15)] hover:border-[#D4AF37] hover:scale-[1.03] transition-all duration-300 cursor-pointer relative overflow-hidden group"
                >
                  {/* Subtle Inner Double Border */}
                  <div className="absolute inset-1 border border-[#D4AF37]/15 rounded-[20px] pointer-events-none group-hover:border-[#D4AF37]/35 transition-colors duration-300" />

                  {/* Corner Ornaments */}
                  <div className="absolute top-2 right-2 opacity-35 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <IslamicStarSVG className="w-3 h-3 text-[#D4AF37]" />
                  </div>
                  <div className="absolute bottom-2 left-2 opacity-35 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <IslamicStarSVG className="w-3 h-3 text-[#D4AF37]" />
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1C332A] to-[#13241D] text-amber-100 border border-[#D4AF37]/35 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Share2 className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#1C332A] text-amber-200 border border-[#D4AF37]/25 mb-2 select-none">
                        <span>{isAr ? 'المحطة الرابعة' : 'Step 4'}</span>
                        {isAr && <span className="text-xs leading-none flex items-center justify-center">📢</span>}
                        <span>{isAr ? 'تأثير' : ''}</span>
                      </div>
                      <h4 className="text-base font-black text-amber-100 mb-1.5 group-hover:text-amber-200 transition-colors font-serif">
                        {isAr ? 'سفراء عِلم' : 'Ambassadors Hub'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                        {isAr ? 'رابط دعوة تتبعي ذكي، يتيح لك نشر الخير وتتبع الأثر الحي لنشاطك، وتجمع أوسمة الشرف والدعوة.' : 'Trackable smart dawah link with live impact stats and badges.'}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 group-hover:text-amber-200 transition-colors">
                        <span>{isAr ? 'لوحة السفراء' : 'Open Hub'}</span>
                        <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-[-4px] transition-transform text-[#D4AF37]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Golden Pearl Center node */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="absolute w-12 h-12 rounded-full bg-amber-500/20 animate-ping opacity-60"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#15241E] via-[#1E3E2F] to-[#12241E] border-2 border-[#D4AF37] flex items-center justify-center font-black text-xs text-amber-200 shadow-md ring-4 ring-amber-900/40 relative z-10 hover:scale-110 transition-transform cursor-pointer">
                    <span className="font-serif">٤</span>
                  </div>
                </div>

                {/* Spacing alignment helper block for desktop grid balance */}
                <div className="hidden md:block w-[45%]" />
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

      {/* 🗺️ INTERACTIVE TRACK GUIDE OVERLAY (شاشة الشرح والتفصيل المبوب الأنيق للمسار) */}
      {guidedTrackId && (() => {
        const trData = tracks.find(t => t.id === guidedTrackId)!;
        const guide = trackGuides[guidedTrackId as keyof typeof trackGuides];
        const guideIcon = trData.icon;
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
            <div className="bg-gradient-to-br from-[#FCFAF6] via-[#FFFDF9] to-[#F5EEDA] border-4 border-double border-[#D4AF37] rounded-[36px] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative p-6 sm:p-8 text-right overflow-hidden group">
              
              {/* Corner Ornaments */}
              <div className="absolute top-3 right-3 pointer-events-none select-none opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all">
                <IslamicStarSVG className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="absolute top-3 left-3 pointer-events-none select-none opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all">
                <IslamicStarSVG className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="absolute bottom-3 right-3 pointer-events-none select-none opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all">
                <IslamicStarSVG className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="absolute bottom-3 left-3 pointer-events-none select-none opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all">
                <IslamicStarSVG className="w-5 h-5 text-[#D4AF37]" />
              </div>
              
              {/* Close Button */}
              <button 
                onClick={() => { playNavigationSound(); setGuidedTrackId(null); }}
                className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-100 transition text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Badge */}
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                  {React.createElement(guideIcon, { className: "w-6 h-6 stroke-[2]" })}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-150 select-none">
                    <span className="text-xs leading-none flex items-center justify-center shrink-0">{trData.badgeIcon}</span>
                    <span className="leading-tight">{trData.badgeText}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{trData.title}</h3>
                </div>
              </div>

              <div className="space-y-5 text-sm">
                
                {/* Introduction (شرح المسار وكيف يستخدمه) */}
                <div className="bg-amber-50/40 border border-amber-200/50 p-4 rounded-2xl">
                  <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-xs sm:text-sm mb-1.5 font-serif">
                    <Info className="w-4 h-4 text-amber-700" />
                    <span>{isAr ? 'شرح المسار ودليل الاستخدام:' : isUr ? 'مسار کا تعارف اور رہنما:' : 'Track Guide & Overview:'}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                    {isAr ? guide.introAr : guide.introEn}
                  </p>
                </div>

                {/* Expected Learning Outcomes (أهداف ومخرجات المسار) */}
                <div>
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm mb-2.5 font-serif">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? 'ماذا ستتعلم في هذا المسار؟' : isUr ? 'آپ اس راستے میں کیا سیکھیں گے؟' : 'What will you learn in this track?'}</span>
                  </h4>
                  <ul className="space-y-2">
                    {(isAr ? guide.outcomesAr : guide.outcomesEn).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Classified Outline Sections (خريطة تتابع متعرجة وفخمة متصلة بحبل ذهبي مضفر) */}
                <div className="pt-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm mb-6 font-serif">
                    <BookOpen className="w-4.5 h-4.5 text-amber-700" />
                    <span>{isAr ? 'خريطة محطات ومسيرة الدراسة بالتفصيل (متصلة بالتتابع):' : isUr ? 'تفصیلی تعلیمی مراحل کا نقشہ:' : 'Detailed Knowledge Milestones Roadmap:'}</span>
                  </h4>
                  
                  {/* The Road Map Container */}
                  <div className="relative py-6 px-3 bg-[#FAF8F5]/90 border-2 border-[#D4AF37]/40 rounded-[28px] overflow-hidden shadow-inner">
                    
                    {/* The Braided Golden Rope running right through the middle (حبل مذهب مضفر واقعي) */}
                    <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-3 pointer-events-none z-0 flex justify-center">
                      {/* Soft Golden Glow behind the rope */}
                      <div className="absolute inset-y-0 w-6 bg-[#D4AF37]/15 blur-xs rounded-full animate-pulse"></div>
                      {/* Golden Braided Cord */}
                      <div className="w-1.2 h-full bg-gradient-to-b from-amber-700 via-[#E6C594] to-emerald-700 rounded-full relative overflow-hidden shadow-[0_0_6px_rgba(212,175,55,0.4)]">
                        {/* Diagonal braid pattern overlay */}
                        <div className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(45deg,#000,#000_1.5px,transparent_1.5px,transparent_3px)]"></div>
                      </div>
                    </div>

                    {/* Winding Zigzag Steps Rows */}
                    <div className="space-y-8 relative z-10">
                      {(isAr ? guide.sectionsAr : guide.sectionsEn).map((sec, idx) => {
                        const isEven = idx % 2 === 0;
                        
                        return (
                          <div 
                            key={idx} 
                            className={`flex flex-col md:flex-row items-center gap-4 w-full justify-center ${
                              isEven ? 'md:flex-row-reverse' : 'md:flex-row'
                            }`}
                          >
                            
                            {/* Card Element (كارت القسم بتصميم مخطوطة فاخرة) */}
                            <div className="w-full md:w-[45%] group">
                              <div className="relative bg-white border border-[#E3D9C9] rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-amber-400 hover:scale-[1.03] transition-all duration-300 relative overflow-hidden">
                                
                                {/* Manuscript Corner Accents */}
                                <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-amber-600/35" />
                                <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-amber-600/35" />
                                
                                <div className="flex items-start gap-2.5">
                                  {/* Small section badge */}
                                  <span className="flex-shrink-0 w-5 h-5 rounded-md bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-900 flex items-center justify-center">
                                    {idx + 1}
                                  </span>
                                  <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                                    {sec}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Center Connecting Bead/Pearl (العقدة الذهبية المشدودة على الحبل) */}
                            <div className="relative flex items-center justify-center shrink-0 my-1 md:my-0">
                              {/* Pulse wave ring */}
                              <div className="absolute w-10 h-10 rounded-full bg-amber-500/10 animate-ping opacity-60"></div>
                              
                              {/* Golden Pearl Node */}
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-50 via-white to-amber-100 border-2 border-[#D4AF37] flex items-center justify-center font-bold text-xs text-amber-950 shadow-md ring-4 ring-amber-100/40 relative z-10 hover:scale-110 transition-transform">
                                <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
                              </div>
                            </div>

                            {/* Spacing alignment helper block for desktop grid balance */}
                            <div className="hidden md:block w-[45%]" />

                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

              </div>

              {/* Action Buttons to start learning */}
              <div className="mt-8 pt-4 border-t border-[#EAE3D6] flex flex-wrap items-center gap-2.5 justify-end">
                <button
                  onClick={() => { playNavigationSound(); setGuidedTrackId(null); }}
                  className="px-4.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
                >
                  {isAr ? 'رجوع للمسارات' : isUr ? 'واپس' : language === 'fr' ? 'Retour' : language === 'es' ? 'Atrás' : language === 'id' ? 'Kembali' : 'Back'}
                </button>

                <button
                  onClick={() => handleStartTrack(guidedTrackId, 'tutor')}
                  className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isAr ? 'دخول المعلم الذكي بالـ AI' : isUr ? 'ذہین استاد' : language === 'fr' ? 'Tuteur IA' : language === 'es' ? 'Mentor IA' : language === 'id' ? 'Pembimbing AI' : 'AI Mentor'}</span>
                </button>

                <button
                  onClick={() => handleStartTrack(guidedTrackId, 'map')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{isAr ? 'دخول خريطة المحطات والبدء' : isUr ? 'تعلیمی سفر شروع کریں' : language === 'fr' ? 'Commencer' : language === 'es' ? 'Comenzar' : language === 'id' ? 'Mulai Belajar' : 'Start Journey'}</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </section>
  );
};
