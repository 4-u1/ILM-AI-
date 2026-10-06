import React, { useState, useEffect } from 'react';
import { Language, TrackId } from '../types';
import { BookOpen, ShieldCheck, Award, BarChart3, Bot, Sparkles, Globe, HelpCircle, Share2, Zap, Calendar, HardDrive, Eye, EyeOff, Wifi, WifiOff, Heart, Compass } from 'lucide-react';
import { UI_TRANSLATIONS, isRtlLanguage } from '../data/translations';
import { IslamicDateDisplay } from './IslamicDateDisplay';
import { LanguageDropdown } from './LanguageDropdown';
import { IlmBrandLogo } from './IlmBrandLogo';
import { PWAInstallButton } from './PWAInstallButton';
import { getStoredXP, getLearnerProfile } from '../utils/xpManager';

interface NavbarProps {
  currentTab: 'tracks' | 'journey' | 'simulator' | 'lab' | 'sources' | 'dashboard' | 'certificate' | 'tutor' | 'achievements' | 'ambassadors' | 'copilot' | 'thirtyDays' | 'offlineKit' | 'signLanguage' | 'ilmJunior' | 'culturalEtiquette' | 'scholasticSearch' | 'fieldDaiyah' | 'dhikr' | 'quran' | 'favorites';
  setCurrentTab: (tab: 'tracks' | 'journey' | 'simulator' | 'lab' | 'sources' | 'dashboard' | 'certificate' | 'tutor' | 'achievements' | 'ambassadors' | 'copilot' | 'thirtyDays' | 'offlineKit' | 'signLanguage' | 'ilmJunior' | 'culturalEtiquette' | 'scholasticSearch' | 'fieldDaiyah' | 'dhikr' | 'quran' | 'favorites') => void;
  selectedTrack: TrackId | null;
  setSelectedTrack: (track: TrackId | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenOnboarding?: () => void;
  onOpenWelcome?: () => void;
  onOpenProfile?: () => void;
  onOpenGuide?: () => void;
  isSeniorMode?: boolean;
  onToggleSeniorMode?: () => void;
  seniorFontSize?: 'normal' | 'large' | 'xlarge';
  onChangeSeniorFontSize?: (size: 'normal' | 'large' | 'xlarge') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedTrack,
  setSelectedTrack,
  language,
  setLanguage,
  onOpenOnboarding,
  onOpenWelcome,
  onOpenProfile,
  onOpenGuide,
  isSeniorMode = false,
  onToggleSeniorMode,
  seniorFontSize = 'normal',
  onChangeSeniorFontSize,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';

  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [isCommunityMenuOpen, setIsCommunityMenuOpen] = useState(false);

  const t = UI_TRANSLATIONS;

  const getNavLabel = (key: keyof typeof UI_TRANSLATIONS.nav) => {
    return t.nav[key]?.[language] || t.nav[key]?.ar;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur border-b border-[#EAE3D6] w-full flex flex-col">
      {/* Top Cultural Date & Identity Bar - visible on all screens */}
      <div className="w-full border-b border-[#EAE3D6]/70 bg-[#F6F1EA]/90 py-0.5 px-2.5 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center sm:justify-between text-[11px]">
          <IslamicDateDisplay language={language} variant="navbar" />
          <div className="hidden sm:flex items-center gap-2.5 text-[10px] text-slate-500 font-medium">
            {/* Online / Offline Status Badge */}
            <div 
              onClick={() => setCurrentTab('offlineKit')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                isOnline 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' 
                  : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
              }`}
              title={isAr ? 'حالة الاتصال بالشبكة وقاعدة البيانات المحلية' : 'Network & Offline Cache Status'}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-2.5 h-2.5 text-emerald-600" />
                  <span>{isAr ? 'متصل بالشبكة (حفظ فوري)' : 'Online (Auto-Cached)'}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-2.5 h-2.5 text-amber-700" />
                  <span>{isAr ? 'وضع بلا إنترنت نشط' : 'Offline Mode Active'}</span>
                </>
              )}
            </div>

            <span className="text-slate-300">•</span>
            <span>{isAr ? 'مصادر معتمدة 100%' : 'Verified Islamic Sources 100%'}</span>
          </div>
        </div>
      </div>

      {/* Main Desktop Navbar */}
      <div className="hidden md:flex max-w-6xl mx-auto px-3 sm:px-6 h-14 items-center justify-between w-full gap-2">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setSelectedTrack(null);
              setCurrentTab('tracks');
            }}
            className="flex items-center gap-2 text-left group transition cursor-pointer"
          >
            <IlmBrandLogo size="xs" showSubtitle={false} withAura={true} />
            <div className="flex items-baseline gap-1">
              <span className="text-slate-300 font-light text-base select-none">|</span>
              <span className="font-bold text-sm sm:text-base tracking-wider text-[#0f2b5c] select-none font-sans uppercase">
                ILM
              </span>
            </div>
          </button>

          {/* SDAIA / Challenge Badge */}
          <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{isAr ? 'تحدي الذكاء الاصطناعي' : 'AI Challenge'}</span>
          </div>
        </div>

        {/* Navigation Tabs - Desktop & Laptop */}
        <nav className="flex items-center gap-1">
          <div className="hidden md:flex items-center gap-1">
            {selectedTrack && (
              <button
                onClick={() => setCurrentTab('journey')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                  currentTab === 'journey'
                    ? 'bg-amber-800 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'المسار والمعلم' : 'Track & Tutor'}</span>
              </button>
            )}

            <button
              onClick={() => setCurrentTab('tracks')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                currentTab === 'tracks'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{getNavLabel('tracks')}</span>
            </button>

            {selectedTrack && (
              <button
                onClick={() => setCurrentTab('certificate')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                  currentTab === 'certificate'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{getNavLabel('certificate')}</span>
              </button>
            )}

            <button
              onClick={() => setCurrentTab('achievements')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                currentTab === 'achievements'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{getNavLabel('achievements')}</span>
            </button>

            <button
              onClick={() => setCurrentTab('ambassadors')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                currentTab === 'ambassadors'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isAr ? 'سفراء عِلم' : 'Ambassadors'}
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{getNavLabel('ambassadors')}</span>
            </button>

            {/* 📿 ركن الأذكار والسكينة */}
            <button
              onClick={() => setCurrentTab('dhikr')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                currentTab === 'dhikr'
                  ? 'bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-950 border border-amber-300/80 hover:bg-amber-100'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>{isAr ? 'ركن الأذكار' : 'Dhikr'}</span>
            </button>

            {/* Universal Inclusivity Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCommunityMenuOpen(!isCommunityMenuOpen)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  ['signLanguage', 'ilmJunior', 'culturalEtiquette', 'scholasticSearch', 'fieldDaiyah'].includes(currentTab)
                    ? 'bg-amber-800 text-white shadow-2xs'
                    : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{UI_TRANSLATIONS.nav.inclusivity[language] || UI_TRANSLATIONS.nav.inclusivity.en}</span>
              </button>

              {/* Dropdown Menu Popup */}
              {isCommunityMenuOpen && (
                <div 
                  className="absolute top-full mt-2 w-70 bg-white rounded-2xl shadow-2xl border border-[#EAE3D6] p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  dir={isRtlLanguage(language) ? 'rtl' : 'ltr'}
                >
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    {language === 'ar' ? 'فئات المجتمع والتخصصات' : 'Community & Scholastic Hubs'}
                  </div>

                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => {
                        setCurrentTab('signLanguage');
                        setIsCommunityMenuOpen(false);
                      }}
                      className="w-full p-2 rounded-xl hover:bg-teal-50 text-start transition cursor-pointer flex items-center gap-2 text-xs font-bold text-slate-800"
                    >
                      <span className="text-sm p-1 bg-teal-100 rounded-lg">🤟</span>
                      <div>
                        <div className="text-slate-900">{UI_TRANSLATIONS.hubs.signLanguageTitle[language] || UI_TRANSLATIONS.hubs.signLanguageTitle.en}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{UI_TRANSLATIONS.hubs.signLanguageDesc[language] || UI_TRANSLATIONS.hubs.signLanguageDesc.en}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('ilmJunior');
                        setIsCommunityMenuOpen(false);
                      }}
                      className="w-full p-2 rounded-xl hover:bg-amber-50 text-start transition cursor-pointer flex items-center gap-2 text-xs font-bold text-slate-800"
                    >
                      <span className="text-sm p-1 bg-amber-100 rounded-lg">🌱</span>
                      <div>
                        <div className="text-slate-900">{UI_TRANSLATIONS.hubs.ilmJuniorTitle[language] || UI_TRANSLATIONS.hubs.ilmJuniorTitle.en}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{UI_TRANSLATIONS.hubs.ilmJuniorDesc[language] || UI_TRANSLATIONS.hubs.ilmJuniorDesc.en}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('culturalEtiquette');
                        setIsCommunityMenuOpen(false);
                      }}
                      className="w-full p-2 rounded-xl hover:bg-blue-50 text-start transition cursor-pointer flex items-center gap-2 text-xs font-bold text-slate-800"
                    >
                      <span className="text-sm p-1 bg-blue-100 rounded-lg">🌏</span>
                      <div>
                        <div className="text-slate-900">{UI_TRANSLATIONS.hubs.culturalEtiquetteTitle[language] || UI_TRANSLATIONS.hubs.culturalEtiquetteTitle.en}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{UI_TRANSLATIONS.hubs.culturalEtiquetteDesc[language] || UI_TRANSLATIONS.hubs.culturalEtiquetteDesc.en}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('scholasticSearch');
                        setIsCommunityMenuOpen(false);
                      }}
                      className="w-full p-2 rounded-xl hover:bg-stone-50 text-start transition cursor-pointer flex items-center gap-2 text-xs font-bold text-slate-800"
                    >
                      <span className="text-sm p-1 bg-stone-100 rounded-lg">🔍</span>
                      <div>
                        <div className="text-slate-900">{UI_TRANSLATIONS.hubs.scholasticSearchTitle[language] || UI_TRANSLATIONS.hubs.scholasticSearchTitle.en}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{UI_TRANSLATIONS.hubs.scholasticSearchDesc[language] || UI_TRANSLATIONS.hubs.scholasticSearchDesc.en}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('fieldDaiyah');
                        setIsCommunityMenuOpen(false);
                      }}
                      className="w-full p-2 rounded-xl hover:bg-emerald-50 text-start transition cursor-pointer flex items-center gap-2 text-xs font-bold text-slate-800"
                    >
                      <span className="text-sm p-1 bg-emerald-100 rounded-lg">🖨️</span>
                      <div>
                        <div className="text-slate-900">{UI_TRANSLATIONS.hubs.fieldDaiyahTitle[language] || UI_TRANSLATIONS.hubs.fieldDaiyahTitle.en}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{UI_TRANSLATIONS.hubs.fieldDaiyahDesc[language] || UI_TRANSLATIONS.hubs.fieldDaiyahDesc.en}</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentTab('lab')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                currentTab === 'lab'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{getNavLabel('lab')}</span>
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-slate-100 ${
                currentTab === 'dashboard' ? 'bg-slate-200 text-slate-900 font-bold' : ''
              }`}
              title={isAr ? 'لوحة الأداء' : 'Dashboard'}
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 🧭 ILM Platform Guide Modal Trigger Button */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="px-2.5 py-1 rounded-lg border border-amber-300 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-50 to-white hover:bg-amber-100 transition cursor-pointer flex items-center gap-1 shadow-2xs"
              title={isAr ? 'مُرشِد عِلم الذكي' : 'ILM Guide'}
            >
              <Compass className="w-3.5 h-3.5 text-amber-700 animate-spin [animation-duration:12s]" />
              <span>{isAr ? 'مُرشِد عِلم' : 'ILM Guide'}</span>
            </button>
          )}

          {/* Senior & High Contrast Toggle */}
          {onToggleSeniorMode && (
            <button
              onClick={onToggleSeniorMode}
              className={`p-1.5 rounded-lg border text-xs transition cursor-pointer flex items-center justify-center ${
                isSeniorMode
                  ? 'bg-amber-700 text-white border-amber-800'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title={isAr ? 'الوضع الخاص' : 'Senior Mode'}
            >
              <Eye className="w-3.5 h-3.5 text-amber-600" />
            </button>
          )}

          {/* PWA Install Button */}
          <PWAInstallButton language={language} />

          {/* Language Dropdown Selector */}
          <LanguageDropdown
            language={language}
            onSelectLanguage={setLanguage}
            variant="compact"
          />
        </nav>

      </div>

      {/* Mobile Top Cultural Header Bar */}
      <div className="md:hidden flex items-center justify-between px-2.5 sm:px-3 py-1.5 w-full bg-[#FAF7F2]/98 border-b border-[#EAE3D6] gap-1 safe-area-px overflow-hidden">
        {/* Brand Logo */}
        <button
          onClick={() => {
            setSelectedTrack(null);
            setCurrentTab('tracks');
          }}
          className="flex items-center gap-1 cursor-pointer text-left shrink-0"
        >
          <IlmBrandLogo size="xs" showSubtitle={false} withAura={true} />
          <span className="text-slate-300 font-light text-xs select-none">|</span>
          <span className="font-bold text-xs tracking-wider text-[#0f2b5c] select-none font-sans uppercase">
            ILM
          </span>
        </button>

        {/* Right Controls Group - Mobile Action Bar */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 justify-end">
          {/* Mobile Sheikh Naif Guide Button */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="px-1.5 sm:px-2 py-1 rounded-md border border-amber-300 text-[11px] font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 transition cursor-pointer flex items-center gap-1"
              title={isAr ? 'مُرشِد عِلم' : 'Guide'}
            >
              <Compass className="w-3.5 h-3.5 text-amber-700 animate-spin [animation-duration:12s]" />
              <span className="hidden xs:inline">{isAr ? 'مُرشِد عِلم' : 'Guide'}</span>
            </button>
          )}

          {/* Mobile Language Dropdown */}
          <LanguageDropdown
            language={language}
            onSelectLanguage={setLanguage}
            variant="compact"
          />

          {/* Mobile PWA Install Button (Compact Icon) */}
          <PWAInstallButton language={language} variant="compact" />

          {/* Senior Mode Toggle Icon */}
          {onToggleSeniorMode && (
            <button
              onClick={onToggleSeniorMode}
              className={`p-1 rounded-md border text-xs flex items-center justify-center transition cursor-pointer ${
                isSeniorMode ? 'bg-amber-700 text-white border-amber-800' : 'bg-white text-slate-700 border-slate-200'
              }`}
              title={isAr ? 'الوضع الخاص' : 'Senior Mode'}
            >
              <Eye className="w-3 h-3 text-amber-600" />
            </button>
          )}

          {/* Mobile Offline/Online Indicator */}
          <button
            onClick={() => setCurrentTab('offlineKit')}
            className={`p-1 rounded-md border text-xs flex items-center justify-center shrink-0 transition cursor-pointer ${
              isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
            title={isOnline ? 'متصل بالإنترنت' : 'وضع بلا إنترنت'}
          >
            {isOnline ? <Wifi className="w-3 h-3 text-emerald-600" /> : <WifiOff className="w-3 h-3 text-amber-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
