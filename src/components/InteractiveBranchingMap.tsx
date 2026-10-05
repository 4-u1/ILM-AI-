import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrackId, Language, LessonStage } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { playTapSound } from '../utils/platformSounds';
import {
  Compass,
  BookOpen,
  Sparkles,
  Heart,
  Scale,
  Atom,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Lock,
  Clock,
  ArrowRight,
  ArrowLeft,
  Flame,
  Check,
  Split,
  Layers,
  HelpCircle,
  Award,
  Zap,
  Filter
} from 'lucide-react';

export type BranchInterest = 
  | 'all'
  | 'comparative_religions'
  | 'prophetic_biography'
  | 'spiritual_purification'
  | 'cosmic_science'
  | 'practical_fiqh';

interface BranchConfig {
  id: BranchInterest;
  titleAr: string;
  titleEn: string;
  titleUr: string;
  descAr: string;
  descEn: string;
  descUr: string;
  icon: any;
  color: string;
  accentBg: string;
  borderColor: string;
  textColor: string;
  badgeAr: string;
  badgeEn: string;
  // Keyword filters or stage IDs associated with this branch
  tags: string[];
}

export const BRANCH_CONFIGS: Record<BranchInterest, BranchConfig> = {
  all: {
    id: 'all',
    titleAr: 'المسار المنهجي الشامل',
    titleEn: 'Comprehensive Curriculum',
    titleUr: 'جامع نصابی راستہ',
    descAr: 'الترتيب الأكاديمي المتسلسل لكافة محطات المسار من الأساس حتى التمكين.',
    descEn: 'The full structured sequence of all milestones from foundation to mastery.',
    descUr: 'بنیاد سے کمال تک کے تمام تعلیمی مراحل کی باقاعدہ ترتیب۔',
    icon: Layers,
    color: '#059669',
    accentBg: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-800',
    badgeAr: 'المسار الأساسي',
    badgeEn: 'Core Sequence',
    tags: []
  },
  comparative_religions: {
    id: 'comparative_religions',
    titleAr: 'مقارنة الأديان وحوار الحضارات',
    titleEn: 'Comparative Religions & Interfaith Dialogue',
    titleUr: 'تقابل ادیان اور بین التہذیبی مکالمہ',
    descAr: 'التركيز على أدلة التوحيد، توثيق الرسالات، مكانة الأنبياء، وتفنيد الشبهات بالحكمة والبرهان.',
    descEn: 'Focused on monotheistic proofs, scripture authenticity, prophets in Islam, and reasoned dialogue.',
    descUr: 'توحید کے دلائل، کتب کی توثیق، انبیاء کا مقام، اور دانائی سے شبہات کے ازالے پر مرکوز۔',
    icon: Scale,
    color: '#3B82F6',
    accentBg: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    badgeAr: 'تخصص مقارنة الأديان',
    badgeEn: 'Interfaith Focus',
    tags: ['أديان', 'شبهات', 'عيسى', 'نبوة', 'وحي', 'إله', 'توحيد', 'استدلال', 'حوار', 'religion', 'prophecy', 'dialogue', 'scripture']
  },
  prophetic_biography: {
    id: 'prophetic_biography',
    titleAr: 'السيرة النبوية والشمائل المحمدية',
    titleEn: 'Prophetic Biography & Sunnah Heritage',
    titleUr: 'سیرت نبوی اور اخلاقِ محمدی ﷺ',
    descAr: 'الغوص في حياة النبي ﷺ، أخلاقه العظيمة، دلائل نبوته، وتطبيقات سنته في بناء النفس والمجتمع.',
    descEn: 'Exploring the life of Prophet Muhammad ﷺ, his noble character, miracles, and living guidance.',
    descUr: 'نبی کریم ﷺ کی حیات مبارکہ، اوصاف جلیلہ، اور سنت نبوی کے عملی اطلاق کا مطالعہ۔',
    icon: BookOpen,
    color: '#D97706',
    accentBg: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    badgeAr: 'تخصص السيرة النبوية',
    badgeEn: 'Seerah Focus',
    tags: ['نبي', 'سيرة', 'محمد', 'سنة', 'حديث', 'أخلاق', 'صحابة', 'رسول', 'شهادة', 'prophet', 'sunnah', 'seerah', 'hadith']
  },
  spiritual_purification: {
    id: 'spiritual_purification',
    titleAr: 'التزكية والارتقاء القلبي والوجداني',
    titleEn: 'Spiritual Purification (Tazkiyah)',
    titleUr: 'تزکیۂ نفس اور قلبی سکون',
    descAr: 'مسار الهدوء الروحي، الخشوع في العبادات، مداواة أمراض القلوب، وتعزيز الأنس بالله تعالى.',
    descEn: 'A path of inner peace, devotion in worship, spiritual mindfulness, and closeness to Allah.',
    descUr: 'روحانی سکون، نماز میں خشوع، قلبی امراض کے علاج اور قربِ الٰہی کا خاص مسار۔',
    icon: Heart,
    color: '#EC4899',
    accentBg: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-800',
    badgeAr: 'تخصص التزكية وصلاح القلب',
    badgeEn: 'Tazkiyah Focus',
    tags: ['قلب', 'تزكية', 'خشوع', 'صلاة', 'إخلاص', 'دعاء', 'ذكر', 'طمأنينة', 'إيمان', 'tazkiyah', 'prayer', 'worship', 'faith']
  },
  cosmic_science: {
    id: 'cosmic_science',
    titleAr: 'الإعجاز العلمي والتفكر في الآفاق',
    titleEn: 'Cosmic Signs & Scientific Reflection',
    titleUr: 'سائنسی اعجاز اور کائناتی تفکر',
    descAr: 'دراسة التوافق البديع بين الحقائق العلمية والكونية ونصوص الوحي، وإعمال العقل في عظمة الصنع.',
    descEn: 'Exploring the harmony between scientific realities, cosmic precision, and revelation.',
    descUr: 'سائنسی حقائق، کائناتی نظام، اور قرآنی آیات کے مابین ہم آہنگی اور غور و فکر۔',
    icon: Atom,
    color: '#8B5CF6',
    accentBg: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-800',
    badgeAr: 'تخصص التفكر والإعجاز',
    badgeEn: 'Cosmic Signs Focus',
    tags: ['كون', 'خلق', 'إعجاز', 'علم', 'عقل', 'تصميم', 'طبيعة', 'آفاق', 'creation', 'universe', 'science', 'reason']
  },
  practical_fiqh: {
    id: 'practical_fiqh',
    titleAr: 'الفقه العملي وبناء الحياة والأسرة',
    titleEn: 'Practical Fiqh & Daily Life Ethics',
    titleUr: 'عملی فقہ اور گھریلو و سماجی زندگی',
    descAr: 'أحكام العبادات اليومية، الطهارة، المعاملات المالية، بناء الأسرة الصالحة، والمعاشرة بالمعروف.',
    descEn: 'Day-to-day rulings on worship, purification, halal living, family bonds, and community ethics.',
    descUr: 'روزمرہ عبادات، طہارت، مالی معاملات، اور خاندانی زندگی کے شرعی احکام و آداب۔',
    icon: Compass,
    color: '#0D9488',
    accentBg: 'bg-teal-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-800',
    badgeAr: 'تخصص الفقه العملي',
    badgeEn: 'Practical Fiqh Focus',
    tags: ['وضوء', 'طهارة', 'صلاة', 'معاملات', 'أسرة', 'أخلاق', 'استقامة', 'حلال', 'fiqh', 'purification', 'prayer', 'family']
  }
};

interface InteractiveBranchingMapProps {
  trackId: TrackId;
  language: Language;
  stages: LessonStage[];
  completedStageIds: string[];
  activeStageId: string | null;
  onSelectStage: (stage: LessonStage) => void;
  onNavigateToAchievements?: () => void;
  onViewCertificate?: () => void;
}

export const InteractiveBranchingMap: React.FC<InteractiveBranchingMapProps> = ({
  trackId,
  language,
  stages,
  completedStageIds,
  activeStageId,
  onSelectStage,
  onNavigateToAchievements,
  onViewCertificate
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [selectedBranch, setSelectedBranch] = useState<BranchInterest>('all');
  const [viewMode, setViewMode] = useState<'branch_tree' | 'stage_cards'>('branch_tree');
  const [selectedNodeStage, setSelectedNodeStage] = useState<LessonStage | null>(null);

  // Filter stages matching the selected branch
  const filteredStages = useMemo(() => {
    if (selectedBranch === 'all') return stages;
    const config = BRANCH_CONFIGS[selectedBranch];
    if (!config || config.tags.length === 0) return stages;

    return stages.filter((stage) => {
      const textToSearch = `${stage.title} ${stage.subtitle} ${stage.conceptExplanation || ''} ${stage.keyTerms?.map(k => k.ar + ' ' + k.en).join(' ') || ''}`.toLowerCase();
      return config.tags.some((tag) => textToSearch.includes(tag.toLowerCase()));
    });
  }, [stages, selectedBranch]);

  // Total and completed calculations for the branch
  const branchTotal = filteredStages.length;
  const branchCompleted = filteredStages.filter(s => completedStageIds.includes(s.id)).length;
  const branchPercent = branchTotal > 0 ? Math.round((branchCompleted / branchTotal) * 100) : 0;

  const activeBranchConfig = BRANCH_CONFIGS[selectedBranch];

  // Helper to determine if stage matches branch
  const isStageInActiveBranch = (stage: LessonStage) => {
    if (selectedBranch === 'all') return true;
    return filteredStages.some(s => s.id === stage.id);
  };

  return (
    <div className="space-y-6">
      
      {/* 🧭 Interactive Branching Control Header */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border-2 border-[#D4AF37]/40 shadow-xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-150 relative z-10">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-800 to-slate-900 text-white flex items-center justify-center shrink-0 shadow-md border border-amber-400/30">
              <Split className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black tracking-wide border border-amber-300">
                  {isAr ? 'التنقل البصري المتفاعل' : isUr ? 'انٹرایکٹو برانچنگ' : 'Interactive Branching'}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {isAr ? 'اختر مساراً فرعياً حسب شغفك' : 'Choose path by your interest'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-950 font-serif mt-1">
                {isAr ? 'تخصيص مسار التعلم بالاهتمام الشخصي' : 'Personalize Learning by Topic Interest'}
              </h2>
            </div>
          </div>

          {/* View Mode Toggle: Interactive SVG Tree vs Cards List */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => {
                playTapSound();
                setViewMode('branch_tree');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'branch_tree'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Split className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'شجرة التفرع التفاعلية' : 'Interactive Tree'}</span>
            </button>

            <button
              onClick={() => {
                playTapSound();
                setViewMode('stage_cards');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'stage_cards'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'عرض المحطات المفلترة' : 'Milestones List'}</span>
            </button>
          </div>
        </div>

        {/* 🌟 Branch Interest Selector Chips (Scrollable on mobile) */}
        <div className="pt-4 relative z-10">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 block">
            {isAr ? 'اختر التخصص الفرعي لاستعراض محطاته الموصى بها:' : 'Select specialization to view recommended milestones:'}
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {(Object.keys(BRANCH_CONFIGS) as BranchInterest[]).map((branchKey) => {
              const b = BRANCH_CONFIGS[branchKey];
              const isSelected = selectedBranch === branchKey;
              const IconComponent = b.icon;

              return (
                <button
                  key={branchKey}
                  onClick={() => {
                    playTapSound();
                    setSelectedBranch(branchKey);
                  }}
                  className={`flex flex-col items-start p-3 rounded-2xl border text-start transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? `${b.accentBg} ${b.borderColor} border-2 shadow-sm ring-2 ring-amber-500/20`
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div 
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white shadow-2xs' : 'bg-slate-100 group-hover:bg-slate-200'
                      }`}
                      style={{ color: b.color }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 animate-pulse" />
                    )}
                  </div>
                  <span className={`text-xs font-bold font-serif line-clamp-1 ${isSelected ? b.textColor : 'text-slate-900'}`}>
                    {isAr ? b.titleAr : isUr ? b.titleUr : b.titleEn}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 font-medium">
                    {branchKey === 'all' 
                      ? `${stages.length} ${isAr ? 'محطات' : 'stages'}` 
                      : `${isAr ? b.badgeAr : b.badgeEn}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Branch Focus Summary & Progress */}
        {selectedBranch !== 'all' && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${activeBranchConfig.accentBg} ${activeBranchConfig.borderColor}`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-600 animate-pulse" />
              <div>
                <span className="text-xs font-bold text-slate-900 font-serif">
                  {isAr ? activeBranchConfig.titleAr : isUr ? activeBranchConfig.titleUr : activeBranchConfig.titleEn}:
                </span>
                <span className="text-xs text-slate-700 ms-1 font-medium">
                  {isAr ? activeBranchConfig.descAr : isUr ? activeBranchConfig.descUr : activeBranchConfig.descEn}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs font-bold text-slate-800 bg-white/80 px-3 py-1 rounded-xl border border-slate-200/60">
              <span>{branchCompleted}/{branchTotal} {isAr ? 'محطة مكتملة' : 'completed'}</span>
              <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-500" 
                  style={{ width: `${branchPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-emerald-800 font-mono">{branchPercent}%</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 🌳 VIEW 1: INTERACTIVE SVG BRANCHING TREE CANVAS */}
      {viewMode === 'branch_tree' && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-150">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              <h3 className="text-base font-bold text-slate-900 font-serif">
                {isAr ? 'خريطة التفرع البصري الحي والمحطات المتصلة' : 'Interactive Visual Branching Network'}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {isAr ? 'انقر على أي محطة للاستكشاف والبدء الفوري' : 'Click any node to explore and start'}
            </span>
          </div>

          {/* Interactive Branching Graph Container */}
          <div className="relative py-4 px-2">
            
            {/* SVG Connecting Branches Path Overlay */}
            <svg 
              className="w-full h-[480px] sm:h-[540px] absolute inset-0 pointer-events-none z-0" 
              viewBox="0 0 800 540" 
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="branchGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#10B981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="inactiveBranchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Dynamic S-curves connecting root to branches */}
              <path 
                d="M 400,40 C 400,120 180,140 180,240 S 260,380 400,480" 
                fill="none" 
                stroke={selectedBranch === 'comparative_religions' ? 'url(#branchGlowGradient)' : 'url(#inactiveBranchGradient)'}
                strokeWidth={selectedBranch === 'comparative_religions' ? "4" : "2"}
                strokeDasharray={selectedBranch === 'comparative_religions' ? "none" : "6,6"}
                className="transition-all duration-500"
              />
              <path 
                d="M 400,40 C 400,120 620,140 620,240 S 540,380 400,480" 
                fill="none" 
                stroke={selectedBranch === 'prophetic_biography' || selectedBranch === 'spiritual_purification' ? 'url(#branchGlowGradient)' : 'url(#inactiveBranchGradient)'}
                strokeWidth={selectedBranch === 'prophetic_biography' || selectedBranch === 'spiritual_purification' ? "4" : "2"}
                strokeDasharray={selectedBranch === 'prophetic_biography' || selectedBranch === 'spiritual_purification' ? "none" : "6,6"}
                className="transition-all duration-500"
              />
              <line 
                x1="400" y1="40" x2="400" y2="480" 
                stroke="url(#branchGlowGradient)" 
                strokeWidth="3"
              />
            </svg>

            {/* Visual Node Grid mapped along the branching timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
              {stages.map((stage, idx) => {
                const isCompleted = completedStageIds.includes(stage.id);
                const isCurrentActive = stage.id === activeStageId || (!activeStageId && idx === completedStageIds.length);
                const isMatchingBranch = isStageInActiveBranch(stage);
                const isSelectedForDetail = selectedNodeStage?.id === stage.id;

                return (
                  <motion.div
                    key={stage.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      playTapSound();
                      setSelectedNodeStage(stage);
                    }}
                    className={`rounded-3xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                      isMatchingBranch
                        ? isCompleted
                          ? 'bg-white/95 border-2 border-emerald-400/80 shadow-md ring-4 ring-emerald-500/10'
                          : isCurrentActive
                          ? 'bg-gradient-to-br from-amber-50/90 via-white to-amber-100/40 border-2 border-amber-500 ring-4 ring-amber-500/20 shadow-lg'
                          : 'bg-white border-2 border-slate-300 hover:border-amber-400/80 shadow-xs'
                        : 'bg-slate-50/70 border border-slate-200 opacity-50 hover:opacity-80'
                    } ${isSelectedForDetail ? 'ring-4 ring-blue-500/30 border-blue-500' : ''}`}
                  >
                    {/* Top Node Header with Milestone Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-2xs border ${
                            isCompleted 
                              ? 'bg-emerald-500 text-white border-emerald-600' 
                              : isCurrentActive
                              ? 'bg-amber-600 text-white border-amber-700 animate-pulse'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4" /> : stage.stageNumber}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {isAr ? `مستوى ${stage.contentLevel}` : `Level ${stage.contentLevel}`}
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{stage.estimatedMinutes} {isAr ? 'د' : 'm'}</span>
                      </span>
                    </div>

                    {/* Stage Title */}
                    <h4 className="text-sm font-bold text-slate-950 font-serif leading-snug mb-1 line-clamp-1">
                      {isAr ? stage.title : stage.titleEn}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {isAr ? stage.subtitle : stage.subtitleEn}
                    </p>

                    {/* Branch Focus Tags */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      {isMatchingBranch && selectedBranch !== 'all' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-amber-600" />
                          <span>{isAr ? 'موصى به في التخصص' : 'Branch Recommended'}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">
                          {isCompleted ? (isAr ? 'مكتملة ✓' : 'Done ✓') : (isAr ? 'متاحة للبدء' : 'Ready')}
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playTapSound();
                          onSelectStage(stage);
                        }}
                        className="p-1 rounded-lg text-slate-600 hover:text-amber-800 hover:bg-amber-50 transition cursor-pointer"
                        title={isAr ? 'بدء هذه المحطة' : 'Start stage'}
                      >
                        <ChevronIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Node Quick Inspector Drawer Modal */}
          <AnimatePresence>
            {selectedNodeStage && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="mt-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white border border-amber-400/40 shadow-2xl relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold">
                        {isAr ? `المحطة ${selectedNodeStage.stageNumber}` : `Stage ${selectedNodeStage.stageNumber}`}
                      </span>
                      <span className="text-xs text-slate-300 font-medium">
                        {selectedNodeStage.estimatedMinutes} {isAr ? 'دقيقة تعليمية' : 'minutes'}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                      {isAr ? selectedNodeStage.title : selectedNodeStage.titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {isAr ? selectedNodeStage.subtitle : selectedNodeStage.subtitleEn}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => setSelectedNodeStage(null)}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer border border-white/10"
                    >
                      {isAr ? 'إغلاق' : 'Close'}
                    </button>
                    <button
                      onClick={() => {
                        playTapSound();
                        onSelectStage(selectedNodeStage);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>{isAr ? 'بدء دراسة المحطة الآن' : 'Start Learning Stage'}</span>
                      <ChevronIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 📋 VIEW 2: FILTERED STAGES LIST WITH SPECIALIZATION ENRICHMENT */}
      {viewMode === 'stage_cards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-600">
              {isAr 
                ? `عرض ${filteredStages.length} محطة متوافقة مع (${activeBranchConfig.titleAr})` 
                : `Showing ${filteredStages.length} milestones matching (${activeBranchConfig.titleEn})`}
            </span>
          </div>

          <div className="space-y-4">
            {filteredStages.map((stage, idx) => {
              const isCompleted = completedStageIds.includes(stage.id);
              const isCurrentActive = stage.id === activeStageId || (!activeStageId && idx === completedStageIds.length);

              return (
                <div
                  key={stage.id}
                  onClick={() => {
                    playTapSound();
                    onSelectStage(stage);
                  }}
                  className={`rounded-3xl p-5 sm:p-6 border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer relative overflow-hidden ${
                    isCompleted
                      ? 'bg-gradient-to-br from-white via-[#FCFAF8] to-[#FAF5EC] border-2 border-emerald-400/70 shadow-xs'
                      : isCurrentActive
                      ? 'bg-gradient-to-br from-white via-[#FFFDF9] to-[#FFF9EB] border-2 border-[#D4AF37] ring-4 ring-amber-500/15 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200 shadow-3xs'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isCurrentActive
                          ? 'bg-amber-800 text-white border-amber-600 shadow-md ring-4 ring-amber-800/10'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : stage.stageNumber}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {isAr ? `مستوى ${stage.contentLevel}` : `Level ${stage.contentLevel}`}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 bg-white border px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{stage.estimatedMinutes} {isAr ? 'دقيقة' : 'mins'}</span>
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            {UI_TRANSLATIONS.common.completed[language] || UI_TRANSLATIONS.common.completed.en}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                        {isAr ? stage.title : stage.titleEn}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-medium">
                        {isAr ? stage.subtitle : stage.subtitleEn}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
                      <span>{isCompleted ? (isAr ? 'مراجعة الدرس' : 'Review') : (isAr ? 'بدء الدرس' : 'Start')}</span>
                      <ChevronIcon className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
