import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Globe,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { IslamicDateDisplay } from './IslamicDateDisplay';
import { LanguageDropdown } from './LanguageDropdown';
import { IlmBrandLogo } from './IlmBrandLogo';

interface WelcomeScreenProps {
  language: Language;
  onStart: () => void;
  onSelectLanguage?: (lang: Language) => void;
}

const WELCOME_CONTENT: Record<Language, {
  tagline: string;
  title: string;
  desc: string;
  tracksTitle: string;
  tracksDesc: string;
  sourcesTitle: string;
  sourcesDesc: string;
  certificatesTitle: string;
  certificatesDesc: string;
  startBtn: string;
  guestNote: string;
}> = {
  ar: {
    tagline: 'منصة دعوة وتعليم دعوي ذكية بالذكاء الاصطناعي',
    title: 'مرحباً بك في منصة عِلم',
    desc: 'رحلتك المعرفية التفاعلية المخصصة التي تحاكي المعلم الشخصي؛ وفق نصوص ومصادر شرعية محققة 100% ودون هلوسة.',
    tracksTitle: '4 مسارات موجهة',
    tracksDesc: 'غير مسلم، مسلم جديد، المسلم الأصل، وداعية',
    sourcesTitle: 'مصادر معتمدة 100%',
    sourcesDesc: 'مجمع الملك فهد وموسوعة الدرر السنية',
    certificatesTitle: 'شهادات وأوسمة إنجاز',
    certificatesDesc: 'شهادة إلكترونية برمز تحقق مشفر',
    startBtn: 'ابدأ رحلتك المعرفية',
    guestNote: 'لا يتطلب تسجيلاً مسبقاً، يمكنك البدء كضيف فوراً'
  },
  en: {
    tagline: 'AI-Powered Verified Islamic Learning & Mentorship Platform',
    title: 'Welcome to ILM Platform',
    desc: 'Your personalized, interactive learning journey simulating a personal mentor, grounded in 100% verified authentic sources.',
    tracksTitle: '4 Targeted Tracks',
    tracksDesc: 'Inquirers, New Muslims, Born Muslims & Da\'iyahs',
    sourcesTitle: '100% Verified Sources',
    sourcesDesc: 'King Fahd Complex & Dorar.net Hadith Encyclopedia',
    certificatesTitle: 'Certified Completion',
    certificatesDesc: 'Verified digital certificates & cryptographic badges',
    startBtn: 'Start Your Journey',
    guestNote: 'No mandatory registration required — begin instantly as a guest'
  },
  ur: {
    tagline: 'مصنوعی ذہانت پر مبنی اسلامی دعوتی و تعلیمی پلیٹ فارم',
    title: 'پلیٹ فارم عِلم میں خوش آمدید',
    desc: 'آپ کا ذاتی اور انٹرایکٹو تعلیمی سفر جو مستند شرعی مآخذ کے مطابق بغیر کسی غلط بیانی کے رہنمائی فراہم کرتا ہے۔',
    tracksTitle: '4 مخصوص راستے',
    tracksDesc: 'غیر مسلم، نو مسلم، مسلمِ اصل، اور داعی',
    sourcesTitle: '100% مستند مآخذ',
    sourcesDesc: 'مجمع شاہ فہد اور موسوعہ درر سنیہ',
    certificatesTitle: 'اسناد اور اعزازات',
    certificatesDesc: 'تصدیق شدہ برقی اسناد اور انکرپٹڈ بیجز',
    startBtn: 'اپنا تعلیمی سفر شروع کریں',
    guestNote: 'کسی پیشگی رجسٹریشن کی ضرورت نہیں، بطور مہمان فوری آغاز کریں'
  },
  fr: {
    tagline: 'Plateforme islamique d\'apprentissage et d\'orientation assistée par IA',
    title: 'Bienvenue sur la plateforme ILM',
    desc: 'Votre parcours d\'apprentissage interactif simulant un tuteur personnel, fondé à 100% sur des sources authentiques vérifiées.',
    tracksTitle: '4 Parcours Ciblés',
    tracksDesc: 'Non-musulmans, Nouveaux musulmans, Musulmans de naissance et Daïyahs',
    sourcesTitle: 'Sources 100% Authentifiées',
    sourcesDesc: 'Complexe Roi Fahd et Encyclopédie Dorar.net',
    certificatesTitle: 'Certificats et Réussites',
    certificatesDesc: 'Certificats numériques vérifiés et badges d\'accomplissement',
    startBtn: 'Commencer Votre Parcours',
    guestNote: 'Aucune inscription requise ; commencez en tant qu\'invité immédiatement'
  },
  es: {
    tagline: 'Plataforma islámica de aprendizaje y mentoría impulsada por IA',
    title: 'Bienvenido a la plataforma ILM',
    desc: 'Tu viaje de aprendizaje interactivo y personalizado que simula un mentor personal, basado 100% en fuentes islámicas verificadas.',
    tracksTitle: '4 Rutas Orientadas',
    tracksDesc: 'No musulmanes, Nuevos musulmanes, Musulmanes de nacimiento y Da\'iyahs',
    sourcesTitle: 'Fuentes 100% Verificadas',
    sourcesDesc: 'Complejo Rey Fahd y Enciclopedia Dorar.net',
    certificatesTitle: 'Certificados y Logros',
    certificatesDesc: 'Certificados digitales verificados con código encriptado',
    startBtn: 'Comienza Tu Viaje',
    guestNote: 'No requiere registro previo; comienza como invitado de inmediato'
  },
  id: {
    tagline: 'Platform Pembelajaran & Bimbingan Islam Bertenaga AI Terverifikasi',
    title: 'Selamat Datang di Platform ILM',
    desc: 'Perjalanan belajar interaktif yang dipersonalisasi menyerupai pembimbing pribadi, berlandaskan 100% sumber otentik terverifikasi.',
    tracksTitle: '4 Jalur Terarah',
    tracksDesc: 'Non-Muslim, Mualaf, Muslim Sejak Lahir, dan Da\'i',
    sourcesTitle: '100% Sumber Terverifikasi',
    sourcesDesc: 'Kompleks Percetakan Al-Qur\'an Raja Fahd & Ensiklopedia Hadis Dorar.net',
    certificatesTitle: 'Sertifikat & Penghargaan',
    certificatesDesc: 'Sertifikat digital terverifikasi dengan lencana prestasi',
    startBtn: 'Mulai Perjalanan Anda',
    guestNote: 'Tanpa perlu pendaftaran awal; mulai langsung sebagai tamu'
  }
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  language,
  onStart,
  onSelectLanguage,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const content = WELCOME_CONTENT[language] || WELCOME_CONTENT.en;

  const [showSplash, setShowSplash] = useState<boolean>(false);

  // Splash Screen Timer
  useEffect(() => {
    // Disabled duplicate splash screen to prevent duplicate loader lag
  }, []);

  // 1. Majestic Full-Screen Splash Screen with platform branding
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-gradient-to-br from-[#0F1E15] via-[#1A2E22] to-slate-950 text-white animate-fadeIn" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Decorative celestial grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-80" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center space-y-8 max-w-md px-6 text-center z-10">
          
          {/* Logo Presentation: Same background, no dark box, no frame, golden blurred edges, and navy blue feature under 'عِ' */}
          <div className="relative animate-bounce [animation-duration:3s]">
            <IlmBrandLogo size="xl" textColor="text-amber-100" kasrahColor="#38bdf8" subtitleColor="#93c5fd" />
          </div>

          {/* Welcome Quranic Verse */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-100 font-serif leading-relaxed px-2">
              {isAr 
                ? '«يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ»' 
                : isUr 
                ? '«تم میں سے جو لوگ ایمان لائے اور جن کو علم دیا گیا اللہ ان کے درجات بلند فرمائے گا»'
                : '“Allah will raise those who have believed among you and those who were given knowledge, by degrees.”'}
            </h2>
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
            <p className="text-xs sm:text-sm text-emerald-200/80 font-medium tracking-wide">
              {isAr 
                ? 'مرحباً بك في رحلة التعليم والتمكين الحواري الذكي الموثق' 
                : isUr 
                ? 'مستند اور ذہین اسلامی تعلیمی سفر میں خوش آمدید'
                : 'Welcome to your verified interactive and AI-powered learning journey'}
            </p>
          </div>

          {/* Loader and informative status */}
          <div className="w-full max-w-[240px] space-y-3.5 pt-4">
            <Loader2 className="w-7 h-7 text-amber-500 animate-spin mx-auto" />
            <div className="text-[11px] text-amber-200/70 font-semibold tracking-wide animate-pulse">
              {isAr ? 'جاري تهيئة المصادر والمسارات المعتمدة...' : isUr ? 'نصابی راستوں اور مستند ذرائع کی ترتیب...' : 'Initializing verified tracks and curriculum...'}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 text-center text-[10px] text-emerald-500/60 font-mono tracking-wider">
          ILM PLATFORM • v1.1.0 • SHAHADAH & DAWAH
        </div>
      </div>
    );
  }

  // Motion variants for stagger entry animation
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.15,
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 14
      }
    }
  };

  // 2. Comfortable, Welcoming Introductory Screen explaining the platform details
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[540px] h-96 sm:h-[540px] bg-gradient-to-tr from-amber-600/20 via-orange-500/15 to-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Welcome Modal Card with Framer Motion entry stagger container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-2xl bg-[#FCFAF6] border-2 border-[#E7DFD3] rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-900"
      >
        
        {/* Subtle Moroccan geometric accent line on top */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-700 via-amber-500 to-emerald-700" />

        {/* Header Controls: Date & Language Switcher */}
        <div className="px-5 sm:px-8 py-3.5 flex items-center justify-between border-b border-[#EFE8DC]/80 bg-[#F7F2EA]/60 text-xs relative z-30">
          {/* Small, compact date badge to solve height and wrapping issues */}
          <div className="text-slate-700">
            <IslamicDateDisplay language={language} variant="compact" className="!bg-[#FAF6F0] !border-[#E3D9C9] text-slate-800 scale-90 sm:scale-100 origin-right sm:origin-center py-1 sm:py-1.5" />
          </div>

          {onSelectLanguage && (
            <LanguageDropdown
              language={language}
              onSelectLanguage={onSelectLanguage}
              variant="navbar"
              className="scale-90 sm:scale-100 origin-left sm:origin-center"
            />
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 flex flex-col items-center text-center space-y-6 relative z-10">
          
          {/* Logo Presentation: Same background, no dark box, no frame, golden blurred edges, and navy blue feature under 'عِ' */}
          <motion.div variants={itemVariants} className="relative py-2 select-none">
            <IlmBrandLogo size="lg" />
          </motion.div>

          {/* Title & Subtitle */}
          <motion.div variants={itemVariants} className="space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-950 text-xs font-bold shadow-2xs mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{content.tagline}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-serif tracking-tight pt-1">
              {content.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
              {content.desc}
            </p>
          </motion.div>

          {/* Key Value Propositions (3 Pills/Cards) */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-1 text-right sm:text-center">
            
            <div className="flex sm:flex-col items-center gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5 text-amber-700" />
              </div>
              <div className="text-start sm:text-center">
                <h4 className="text-xs font-bold text-slate-900">
                  {content.tracksTitle}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5 font-medium">
                  {content.tracksDesc}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="text-start sm:text-center">
                <h4 className="text-xs font-bold text-slate-900">
                  {content.sourcesTitle}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5 font-medium">
                  {content.sourcesDesc}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-amber-700" />
              </div>
              <div className="text-start sm:text-center">
                <h4 className="text-xs font-bold text-slate-900">
                  {content.certificatesTitle}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5 font-medium">
                  {content.certificatesDesc}
                </p>
              </div>
            </div>

          </motion.div>

          {/* Primary Action Button: "Start Your Journey" */}
          <motion.div variants={itemVariants} className="w-full pt-2 space-y-3">
            <button
              type="button"
              onClick={onStart}
              className="w-full sm:w-auto min-w-[260px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-slate-950 text-white font-black text-base sm:text-lg shadow-xl shadow-amber-900/25 hover:from-amber-500 hover:to-slate-900 hover:shadow-2xl hover:scale-[1.025] active:scale-98 cursor-pointer border-2 border-[#D4AF37]/50 relative overflow-hidden group/btn transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
            >
              <span>{content.startBtn}</span>
              <ArrowIcon className="w-5 h-5 text-amber-200" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{content.guestNote}</span>
            </div>
          </motion.div>

        </div>

        {/* Footer Credit Line */}
        <div className="px-6 py-3 bg-[#F2ECE2] border-t border-[#E5DDD0] text-center text-[11px] text-slate-500 font-medium">
          <span>{isAr ? 'مشروع فريق NEX — تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي (باذل 2026م)' : 'Team NEX — AI Islamic Content Challenge (Bathel 2026)'}</span>
        </div>

      </motion.div>
    </div>
  );
};
