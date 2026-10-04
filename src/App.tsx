/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { AdminDashboard } from './components/AdminDashboard';
import { CertificateView } from './components/CertificateView';
import { AchievementsDashboard } from './components/AchievementsDashboard';
import { InteractiveTutor } from './components/InteractiveTutor';
import { ShahadaModal } from './components/ShahadaModal';
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
import { FieldDaiyahHub } from './components/FieldDaiyahHub';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currentTab, setCurrentTab] = useState<
    'tracks' | 'journey' | 'simulator' | 'lab' | 'sources' | 'dashboard' | 'certificate' | 'tutor' | 'achievements' | 'ambassadors' | 'copilot' | 'thirtyDays' | 'offlineKit' | 'signLanguage' | 'ilmJunior' | 'culturalEtiquette' | 'scholasticSearch' | 'fieldDaiyah'
  >('tracks');

  const [selectedTrack, setSelectedTrack] = useState<TrackId | null>('new_muslim');
  const [activeStage, setActiveStage] = useState<LessonStage | null>(null);
  
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

  // Welcome screen shown on first entry before onboarding
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(() => {
    try {
      const seenWelcome = localStorage.getItem('eilm_welcome_seen');
      return !seenWelcome;
    } catch {
      return true;
    }
  });

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

  const [journeyInitialMode, setJourneyInitialMode] = useState<'tutor' | 'map' | 'quran' | 'favorites'>('tutor');

  const handleSelectTrack = (track: TrackId, initialMode: 'tutor' | 'map' | 'quran' | 'favorites' = 'tutor') => {
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
                <FieldDaiyahHub
                  language={language}
                  onBackToMain={() => setCurrentTab('tracks')}
                />
              )}

              {currentTab === 'dashboard' && (
                <AdminDashboard
                  language={language}
                  onBack={() => setCurrentTab('tracks')}
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

    </div>
  );
}
