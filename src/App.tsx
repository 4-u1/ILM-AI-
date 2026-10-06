/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrackId, Language, LessonStage } from './types';
import { CURRICULUM_DATA } from './data/curriculumData';
import { Navbar } from './components/Navbar';
import { TrackSelector } from './components/TrackSelector';
import { JourneyMap } from './components/JourneyMap';
import { LessonView } from './components/LessonView';
import { DaiyahSimulator } from './components/DaiyahSimulator';
import { VerificationLab } from './components/VerificationLab';
import { SourcesRegistryView } from './components/SourcesRegistryView';
import { CertificateView } from './components/CertificateView';
import { AchievementsDashboard } from './components/AchievementsDashboard';
import { InteractiveTutor } from './components/InteractiveTutor';
import { ShahadaModal } from './components/ShahadaModal';
import { OfficialFatwaTicketModal } from './components/OfficialFatwaTicketModal';
import { IlmPlatformGuideModal } from './components/IlmPlatformGuideModal';
import { QuranBrowser } from './components/QuranBrowser';
import { CompactQuranModal } from './components/CompactQuranModal';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { Onboarding } from './components/Onboarding';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StudyReminderNotification } from './components/StudyReminderNotification';
import { AmbassadorsHub } from './components/AmbassadorsHub';
import { WhisperingCopilot } from './components/WhisperingCopilot';
import { ThirtyDayJourney } from './components/ThirtyDayJourney';
import { OfflineManager } from './components/OfflineManager';
import { IslamicSignLanguageHub } from './components/IslamicSignLanguageHub';
import { IlmJuniorHub } from './components/IlmJuniorHub';
import { CulturalEtiquetteHub } from './components/CulturalEtiquetteHub';
import { ScholasticSearchHub } from './components/ScholasticSearchHub';
import { DhikrSanctuary } from './components/DhikrSanctuary';
import { UserProfileModal } from './components/UserProfileModal';
import { IlmBrandLogo } from './components/IlmBrandLogo';
import { UI_TRANSLATIONS } from './data/translations';
import { awardXP } from './utils/xpManager';
import { playEntranceSound } from './utils/platformSounds';

// Lazy loading large sub-modules to dramatically boost application load speeds and remove layout lock-ups
const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const FieldDaiyahHub = lazy(() =>
  import('./components/FieldDaiyahHub').then((m) => ({ default: m.FieldDaiyahHub }))
);

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currentTab, setCurrentTab] = useState<
    'tracks' | 'journey' | 'simulator' | 'lab' | 'sources' | 'dashboard' | 'certificate' | 'tutor' | 'achievements' | 'ambassadors' | 'copilot' | 'thirtyDays' | 'offlineKit' | 'signLanguage' | 'ilmJunior' | 'culturalEtiquette' | 'scholasticSearch' | 'fieldDaiyah' | 'dhikr' | 'quran' | 'favorites'
  >('tracks');

  const [selectedTrack, setSelectedTrack] = useState<TrackId | null>('new_muslim');
  const [activeStage, setActiveStage] = useState<LessonStage | null>(null);

  // App entrance Splash Screen loader state
  const [appSplashLoading, setAppSplashLoading] = useState<boolean>(true);

  // Majestic Spiritual Soundscape synthesis using Web Audio API on initial mount
  const playPeacefulChime = () => {
    playEntranceSound();
  };

  useEffect(() => {
    // Attempt to play chime immediately on load
    playEntranceSound();
    
    // Also bind to any initial click/touch in case browser autoplay blocks it, so it plays on interaction
    const playOnInteraction = () => {
      playEntranceSound();
      window.removeEventListener('click', playOnInteraction);
      window.removeEventListener('touchstart', playOnInteraction);
    };
    window.addEventListener('click', playOnInteraction);
    window.addEventListener('touchstart', playOnInteraction);

    const timer = setTimeout(() => {
      setAppSplashLoading(false);
    }, 2400);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', playOnInteraction);
      window.removeEventListener('touchstart', playOnInteraction);
    };
  }, []);
  
  // Track completed stages persistently
  const [completedStageIds, setCompletedStageIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('eilm_completed_stages');
      return saved ? JSON.parse(saved) : ['nm-01'];
    } catch {
      return ['nm-01'];
    }
  });

  const [isShahadaOpen, setIsShahadaOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isFatwaOpen, setIsFatwaOpen] = useState(false);
  const [isCompactQuranOpen, setIsCompactQuranOpen] = useState(false);
  const [compactQuranSurah, setCompactQuranSurah] = useState(1);

  // Welcome screen shown on every fresh entry to guarantee testing the intro
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);

  // First-time user onboarding modal
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    try {
      const seen = localStorage.getItem('eilm_onboarding_completed');
      return !seen;
    } catch {
      return true;
    }
  });

  // Senior / Accessibility High-Contrast Mode & Dynamic Font Sizing
  const [isSeniorMode, setIsSeniorMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('eilm_senior_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [seniorFontSize, setSeniorFontSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    try {
      return (localStorage.getItem('eilm_senior_font_size') as any) || 'normal';
    } catch {
      return 'normal';
    }
  });

  const handleChangeSeniorFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setSeniorFontSize(size);
    try {
      localStorage.setItem('eilm_senior_font_size', size);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleSeniorMode = () => {
    setIsSeniorMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('eilm_senior_mode', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem('eilm_completed_stages', JSON.stringify(completedStageIds));
    } catch (e) {
      console.error(e);
    }
  }, [completedStageIds]);

  // Sync language, text direction (RTL for Arabic and Urdu, LTR for English, French, Spanish, Indonesian)
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = (language === 'ar' || language === 'ur') ? 'rtl' : 'ltr';
    if (language === 'ur') {
      document.body.classList.add('lang-ur');
    } else {
      document.body.classList.remove('lang-ur');
    }
  }, [language]);

  const [journeyInitialMode, setJourneyInitialMode] = useState<'tutor' | 'branching' | 'map' | 'analytics' | 'quran' | 'favorites'>('tutor');

  const handleSelectTrack = (track: TrackId, initialMode: 'tutor' | 'branching' | 'map' | 'analytics' | 'quran' | 'favorites' = 'tutor') => {
    setSelectedTrack(track);
    setActiveStage(null);
    setJourneyInitialMode(initialMode);
    setCurrentTab('journey');
  };

  const handleSelectStage = (stage: LessonStage) => {
    try {
      localStorage.setItem('eilm_last_learning_timestamp', Date.now().toString());
    } catch (e) {
      console.warn(e);
    }
    setActiveStage(stage);
  };

  const handleCompleteStage = (stageId: string) => {
    try {
      localStorage.setItem('eilm_last_learning_timestamp', Date.now().toString());
    } catch (e) {
      console.warn(e);
    }
    if (!completedStageIds.includes(stageId)) {
      setCompletedStageIds((prev) => [...prev, stageId]);
      const stageObj = CURRICULUM_DATA.find((s) => s.id === stageId);
      const stageTitle = stageObj ? stageObj.title : stageId;
      awardXP(
        50,
        `إنجاز واجتياز محطة: ${stageTitle}`,
        `Completed learning stage: ${stageTitle}`
      );
    }
  };

  const handleCompleteAllStages = (trackId: TrackId) => {
    const trackStageIds = CURRICULUM_DATA.filter((s) => s.trackId === trackId).map((s) => s.id);
    setCompletedStageIds((prev) => Array.from(new Set([...prev, ...trackStageIds])));
  };

  const handleTransitionToNewMuslim = () => {
    setSelectedTrack('new_muslim');
    setActiveStage(null);
    setCurrentTab('journey');
  };

  const fontScaleClass = seniorFontSize === 'large' ? 'senior-font-large' : seniorFontSize === 'xlarge' ? 'senior-font-xlarge' : 'senior-font-normal';

  if (appSplashLoading) {
    return (
      <div className="fixed inset-0 z-55 flex flex-col items-center justify-center bg-gradient-to-br from-[#FCFAF6] via-[#FAF7F2] to-[#EAE3D6] text-slate-950 animate-fadeIn overflow-hidden" dir="rtl">
        {/* Decorative celestial background grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.18)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-80" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Elegant manuscript outer double frame around the viewport */}
        <div className="absolute inset-4 sm:inset-6 border border-[#E3D9C9] rounded-[24px] sm:rounded-[32px] pointer-events-none">
          <div className="absolute inset-1 sm:inset-1.5 border border-dashed border-[#E3D9C9]/60 rounded-[20px] sm:rounded-[28px]" />
          {/* Subtle floral corner markers */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-amber-500/40 rounded-tl-sm" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-amber-500/40 rounded-tr-sm" />
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-amber-500/40 rounded-bl-sm" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-amber-500/40 rounded-br-sm" />
        </div>

        <div className="relative flex flex-col items-center space-y-9 max-w-md px-6 text-center z-10 w-full">
          
          {/* Premium Logo Presentation: Seamless background, no dark box, no frame, golden blurred edges, connected letters عِـلـم, and navy blue feature under 'عِ' */}
          <div className="relative py-2 select-none">
            <IlmBrandLogo size="xl" />
          </div>

          {/* Welcome Quranic Verse inside a beautiful physical parchment plaque */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-[#EADFCF] max-w-sm sm:max-w-md mx-auto relative overflow-hidden w-full">
            {/* Traditional golden corner ribbons/braces */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-500/50" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-500/50" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-500/50" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-500/50" />

            <h2 className="text-lg sm:text-xl font-bold text-amber-950 font-serif leading-relaxed px-1">
              «يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ»
            </h2>
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mx-auto mt-3" />
            <p className="text-xs sm:text-sm text-slate-700 font-bold font-sans mt-2.5">
              {UI_TRANSLATIONS.common.splashWelcome[language] || UI_TRANSLATIONS.common.splashWelcome.en}
            </p>
          </div>

          {/* Loader and status with golden circular spinning task bar */}
          <div className="w-full max-w-[240px] space-y-4 pt-1">
            <div className="flex items-center justify-center">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/10" />
                <div className="absolute inset-0 rounded-full border-2 border-t-amber-700 animate-spin" />
              </div>
            </div>
            <div className="text-[11px] text-amber-950/80 font-bold tracking-wide animate-pulse font-sans">
              {UI_TRANSLATIONS.common.splashInit[language] || UI_TRANSLATIONS.common.splashInit.en}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 text-center text-[10px] text-amber-900/40 font-mono tracking-wider font-bold">
          ILM PLATFORM • v1.3.0 • SHAHADAH & DAWAH
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900 font-sans selection:bg-[#EAE2D5] ${isSeniorMode ? `senior-mode ${fontScaleClass}` : ''}`}>
      
      {/* Top Navbar & Cultural Header */}
      <div className="flex flex-col w-full">
        <Navbar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setActiveStage(null);
            setCurrentTab(tab);
          }}
          selectedTrack={selectedTrack}
          setSelectedTrack={setSelectedTrack}
          language={language}
          setLanguage={setLanguage}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onOpenWelcome={() => setIsWelcomeOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
          isSeniorMode={isSeniorMode}
          onToggleSeniorMode={handleToggleSeniorMode}
          seniorFontSize={seniorFontSize}
          onChangeSeniorFontSize={handleChangeSeniorFontSize}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 mobile-bottom-clearance w-full">
        <AnimatePresence mode="wait">
          {/* If inside an active lesson view */}
          {activeStage ? (
            <motion.div
              key={`lesson-${activeStage.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <LessonView
                stage={activeStage}
                language={language}
                onBack={() => setActiveStage(null)}
                onCompleteStage={handleCompleteStage}
                isAlreadyCompleted={completedStageIds.includes(activeStage.id)}
                onOpenFullShareModal={() => {
                  setActiveStage(null);
                  setCurrentTab('achievements');
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {currentTab === 'tracks' && (
                <TrackSelector
                  onSelectTrack={handleSelectTrack}
                  language={language}
                  selectedTrack={selectedTrack}
                  onOpenOnboarding={() => setIsOnboardingOpen(true)}
                  onOpenAchievements={() => setCurrentTab('achievements')}
                  completedStagesCount={completedStageIds.length}
                  onNavigateToTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === 'journey' && selectedTrack && (
                <JourneyMap
                  trackId={selectedTrack}
                  language={language}
                  completedStageIds={completedStageIds}
                  activeStageId={null}
                  initialMode={journeyInitialMode}
                  onSelectStage={handleSelectStage}
                  onOpenShahada={() => setIsShahadaOpen(true)}
                  onViewCertificate={() => setCurrentTab('certificate')}
                  onSwitchTrack={() => setCurrentTab('tracks')}
                  onCompleteAllStages={() => handleCompleteAllStages(selectedTrack)}
                  onNavigateToSources={() => setCurrentTab('sources')}
                  onCompleteStageId={handleCompleteStage}
                  onNavigateToAchievements={() => setCurrentTab('achievements')}
                />
              )}

              {currentTab === 'achievements' && (
                <AchievementsDashboard
                  language={language}
                  completedStageIds={completedStageIds}
                  selectedTrack={selectedTrack}
                  onNavigateToStage={(stageId) => {
                    const targetStage = CURRICULUM_DATA.find((s) => s.id === stageId);
                    if (targetStage) {
                      setSelectedTrack(targetStage.trackId);
                      setActiveStage(targetStage);
                    }
                  }}
                  onNavigateToCertificate={() => {
                    if (selectedTrack) setCurrentTab('certificate');
                    else {
                      setSelectedTrack('new_muslim');
                      setCurrentTab('certificate');
                    }
                  }}
                  onNavigateToSimulator={() => setCurrentTab('simulator')}
                  onBack={() => setCurrentTab(selectedTrack ? 'journey' : 'tracks')}
                />
              )}

              {currentTab === 'tutor' && selectedTrack && (
                <InteractiveTutor
                  language={language}
                  selectedTrack={selectedTrack}
                  onBackToMap={() => {
                    setCurrentTab('journey');
                  }}
                  onSwitchTrack={(tr) => {
                    setSelectedTrack(tr);
                    setCurrentTab('journey');
                  }}
                />
              )}

              {currentTab === 'simulator' && (
                <DaiyahSimulator language={language} />
              )}

              {currentTab === 'lab' && (
                <VerificationLab language={language} />
              )}

              {currentTab === 'sources' && (
                <SourcesRegistryView
                  language={language}
                  onBack={() => setCurrentTab('tracks')}
                />
              )}

              {currentTab === 'ambassadors' && (
                <AmbassadorsHub
                  language={language}
                  onBack={() => setCurrentTab('tracks')}
                  onNavigateToSimulator={() => setCurrentTab('simulator')}
                />
              )}

              {currentTab === 'copilot' && (
                <WhisperingCopilot
                  language={language}
                  onBack={() => setCurrentTab('tracks')}
                  onNavigateToSimulator={() => setCurrentTab('simulator')}
                />
              )}

              {currentTab === 'thirtyDays' && (
                <ThirtyDayJourney
                  language={language}
                  onBack={() => setCurrentTab('tracks')}
                  onNavigateToShahada={() => setIsShahadaOpen(true)}
                />
              )}

              {currentTab === 'offlineKit' && (
                <OfflineManager
                  language={language}
                  selectedTrack={selectedTrack}
                  onBack={() => setCurrentTab('tracks')}
                />
              )}

              {currentTab === 'signLanguage' && (
                <IslamicSignLanguageHub
                  language={language}
                  onBackToMain={() => setCurrentTab('tracks')}
                />
              )}

              {currentTab === 'ilmJunior' && (
                <IlmJuniorHub
                  language={language}
                  onBackToMain={() => setCurrentTab('tracks')}
                />
              )}

              {currentTab === 'culturalEtiquette' && (
                <CulturalEtiquetteHub
                  language={language}
                  onBackToMain={() => setCurrentTab('tracks')}
                />
              )}

              {currentTab === 'scholasticSearch' && (
                <ScholasticSearchHub
                  language={language}
                  onBackToMain={() => setCurrentTab('tracks')}
                />
              )}

              {currentTab === 'fieldDaiyah' && (
                <Suspense fallback={
                  <div className="w-full min-h-[350px] flex flex-col items-center justify-center space-y-4 bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-[#EAE3D6] mx-auto max-w-4xl">
                    <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
                    <span className="text-sm font-bold text-amber-950 font-sans animate-pulse">جاري تحميل مساحة العمل الميداني...</span>
                  </div>
                }>
                  <FieldDaiyahHub
                    language={language}
                    onBackToMain={() => setCurrentTab('tracks')}
                  />
                </Suspense>
              )}

              {currentTab === 'dashboard' && (
                <Suspense fallback={
                  <div className="w-full min-h-[350px] flex flex-col items-center justify-center space-y-4 bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-[#EAE3D6] mx-auto max-w-4xl">
                    <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
                    <span className="text-sm font-bold text-amber-950 font-sans animate-pulse">جاري تهيئة لوحة التحكم الآمنة...</span>
                  </div>
                }>
                  <AdminDashboard
                    language={language}
                    onBack={() => setCurrentTab('tracks')}
                  />
                </Suspense>
              )}

              {currentTab === 'dhikr' && (
                <DhikrSanctuary
                  language={language}
                  onBack={() => setCurrentTab('tracks')}
                  onNavigateToAchievements={() => setCurrentTab('achievements')}
                />
              )}

              {currentTab === 'certificate' && selectedTrack && (
                <CertificateView
                  trackId={selectedTrack}
                  language={language}
                  onBack={() => setCurrentTab('journey')}
                  onNavigateToAchievements={() => setCurrentTab('achievements')}
                />
              )}

              {(currentTab === 'quran' || currentTab === 'favorites') && (
                <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 animate-in fade-in duration-300">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAE3D6]">
                    <button
                      onClick={() => setCurrentTab(selectedTrack ? 'journey' : 'tracks')}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-950 transition cursor-pointer px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-3xs"
                    >
                      {language === 'ar' || language === 'ur' ? (
                        <ArrowRight className="w-4 h-4 text-amber-700" />
                      ) : (
                        <ArrowLeft className="w-4 h-4 text-amber-700" />
                      )}
                      <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>{language === 'ar' ? 'المصحف المعتمد - مجمع الملك فهد لطباعة المصحف الشريف' : 'King Fahd Holy Quran Complex'}</span>
                      </span>
                    </div>
                  </div>

                  <QuranBrowser
                    language={language}
                    initialTab={currentTab === 'favorites' ? 'favorites' : 'surahs'}
                    onSelectSurahForStudy={(surahNum) => {
                      if (!selectedTrack) setSelectedTrack('new_muslim');
                      setCurrentTab('journey');
                    }}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Shahada Modal for non-Muslim inquirers */}
      <ShahadaModal
        isOpen={isShahadaOpen}
        onClose={() => setIsShahadaOpen(false)}
        onTransitionToNewMuslim={handleTransitionToNewMuslim}
        language={language}
      />

      {/* Welcome Screen: Displays high-impact branding before onboarding */}
      {isWelcomeOpen && (
        <WelcomeScreen
          language={language}
          onSelectLanguage={(lang) => setLanguage(lang)}
          onClose={() => setIsWelcomeOpen(false)}
          onStart={() => {
            try {
              localStorage.setItem('eilm_welcome_seen', 'true');
            } catch (e) {
              console.warn(e);
            }
            setIsWelcomeOpen(false);
            // Switch directly to tracks selection view
            setActiveStage(null);
            setCurrentTab('tracks');
          }}
        />
      )}

      {/* First-time User Onboarding Walkthrough (Shown after welcome screen or on demand) */}
      <Onboarding
        isOpen={!isWelcomeOpen && isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        language={language}
        onStartJourney={() => {
          if (!selectedTrack) {
            setSelectedTrack('new_muslim');
          }
          setCurrentTab('journey');
        }}
      />

      {/* Local Smart Study Reminder & Daily Motivation (Triggers after 24h of inactivity) */}
      <StudyReminderNotification
        language={language}
        selectedTrack={selectedTrack}
        completedStageIds={completedStageIds}
        userName={localStorage.getItem('eilm_user_name') || ''}
        userAge={localStorage.getItem('eilm_user_age') || ''}
        onContinueLearning={(stage) => {
          setActiveStage(stage);
          setCurrentTab('journey');
        }}
        onOpenTutor={() => {
          if (!selectedTrack) {
            setSelectedTrack('new_muslim');
          }
          setActiveStage(null);
          setJourneyInitialMode('tutor');
          setCurrentTab('journey');
        }}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* 🧭 ILM Platform Intelligent Guide Modal (مرشد عِلم الذكي) */}
      <IlmPlatformGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        language={language}
        currentTrack={selectedTrack}
        currentTab={currentTab}
        onNavigateTab={(tab) => {
          setActiveStage(null);
          setCurrentTab(tab);
        }}
        onSelectTrack={(track, initialMode = 'tutor') => {
          handleSelectTrack(track, initialMode);
        }}
        onOpenFatwaTicket={() => setIsFatwaOpen(true)}
        onOpenShahada={() => setIsShahadaOpen(true)}
        onOpenCompactQuran={(surahNum = 1) => {
          setCompactQuranSurah(surahNum);
          setIsCompactQuranOpen(true);
        }}
      />

      {/* 📖 Compact Quran Reader Modal (المصحف الشريف - صفحة مصغرة) */}
      <CompactQuranModal
        isOpen={isCompactQuranOpen}
        onClose={() => setIsCompactQuranOpen(false)}
        language={language}
        initialSurahNumber={compactQuranSurah}
        onOpenFullPage={() => {
          setIsCompactQuranOpen(false);
          setActiveStage(null);
          setCurrentTab('quran');
        }}
        onStudyInTrack={(surahNum) => {
          setIsCompactQuranOpen(false);
          if (!selectedTrack) setSelectedTrack('new_muslim');
          setActiveStage(null);
          setCurrentTab('journey');
        }}
      />

      {/* Official Fatwa Referral Modal (Level D institutional compliance) */}
      <OfficialFatwaTicketModal
        isOpen={isFatwaOpen}
        onClose={() => setIsFatwaOpen(false)}
        language={language}
      />

      {/* Footer matching PDF Page 2 */}
      <div className="pb-24 md:pb-0">
        <Footer language={language} />
      </div>

      {/* Mobile Bottom Navigation Bar - only visible on mobile (hidden on md/desktop) */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setActiveStage(null);
          setCurrentTab(tab);
        }}
        selectedTrack={selectedTrack}
        language={language}
        setLanguage={setLanguage}
      />

      {/* User Profile, XP Logs & Rank Level Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        language={language}
        completedStagesCount={completedStageIds.length}
        selectedTrack={selectedTrack}
        onNavigateToAchievements={() => setCurrentTab('achievements')}
        onNavigateToCertificate={() => setCurrentTab('certificate')}
      />

    </div>
  );
}
