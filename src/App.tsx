/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { InteractiveTutor } from './components/InteractiveTutor';
import { ShahadaModal } from './components/ShahadaModal';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { Onboarding } from './components/Onboarding';
import { StudyReminderNotification } from './components/StudyReminderNotification';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currentTab, setCurrentTab] = useState<
    'tracks' | 'journey' | 'simulator' | 'lab' | 'sources' | 'dashboard' | 'certificate' | 'tutor'
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

  // First-time user onboarding modal
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    try {
      const seen = localStorage.getItem('eilm_onboarding_completed');
      return !seen;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('eilm_completed_stages', JSON.stringify(completedStageIds));
    } catch (e) {
      console.error(e);
    }
  }, [completedStageIds]);

  // Sync language, text direction (RTL for Arabic and Urdu, LTR for English), and Urdu typography class
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    if (language === 'ur') {
      document.body.classList.add('lang-ur');
    } else {
      document.body.classList.remove('lang-ur');
    }
  }, [language]);

  const [journeyInitialMode, setJourneyInitialMode] = useState<'tutor' | 'map'>('tutor');

  const handleSelectTrack = (track: TrackId, initialMode: 'tutor' | 'map' = 'tutor') => {
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900 font-sans selection:bg-[#EAE2D5]">
      
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
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 mobile-bottom-clearance w-full">
        {/* If inside an active lesson view */}
        {activeStage ? (
          <div key={`lesson-${activeStage.id}`} className="page-enter w-full">
            <LessonView
              stage={activeStage}
              language={language}
              onBack={() => setActiveStage(null)}
              onCompleteStage={handleCompleteStage}
              isAlreadyCompleted={completedStageIds.includes(activeStage.id)}
            />
          </div>
        ) : (
          <div key={currentTab} className="page-enter w-full">
            {currentTab === 'tracks' && (
              <TrackSelector
                onSelectTrack={handleSelectTrack}
                language={language}
                selectedTrack={selectedTrack}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
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
              />
            )}
          </div>
        )}
      </main>

      {/* Shahada Modal for non-Muslim inquirers */}
      <ShahadaModal
        isOpen={isShahadaOpen}
        onClose={() => setIsShahadaOpen(false)}
        onTransitionToNewMuslim={handleTransitionToNewMuslim}
        language={language}
      />

      {/* First-time User Onboarding Walkthrough */}
      <Onboarding
        isOpen={isOnboardingOpen}
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
