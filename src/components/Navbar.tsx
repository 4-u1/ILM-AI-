import React from 'react';
import { Language, TrackId } from '../types';
import { BookOpen, ShieldCheck, Award, BarChart3, Bot, Sparkles, Globe, HelpCircle } from 'lucide-react';
import { UI_TRANSLATIONS, isRtlLanguage } from '../data/translations';
import { IslamicDateDisplay } from './IslamicDateDisplay';

interface NavbarProps {
  currentTab: 'tracks' | 'journey' | 'simulator' | 'lab' | 'sources' | 'dashboard' | 'certificate' | 'tutor' | 'achievements';
  setCurrentTab: (tab: 'tracks' | 'journey' | 'simulator' | 'lab' | 'sources' | 'dashboard' | 'certificate' | 'tutor' | 'achievements') => void;
  selectedTrack: TrackId | null;
  setSelectedTrack: (track: TrackId | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenOnboarding?: () => void;
  onOpenWelcome?: () => void;
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
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';

  const t = UI_TRANSLATIONS;

  const getNavLabel = (key: keyof typeof UI_TRANSLATIONS.nav) => {
    return t.nav[key]?.[language] || t.nav[key]?.ar;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur border-b border-[#EAE3D6] w-full flex flex-col">
      {/* Top Cultural Date & Identity Bar - visible on desktop and tablet */}
      <div className="hidden md:block w-full border-b border-[#EAE3D6]/70 bg-[#F6F1EA]/70 py-1.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <IslamicDateDisplay language={language} variant="navbar" />
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{isAr ? 'تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي' : isUr ? 'اسلامی مواد کے لیے مصنوعی ذہانت چیلنج' : 'AI Islamic Content Challenge'}</span>
            <span className="text-slate-300">•</span>
            <span>{isAr ? 'حزمة المصادر المعتمدة' : isUr ? 'مستند شرعی مصادر' : 'Verified Islamic Sources'}</span>
          </div>
        </div>
      </div>

      {/* Main Desktop Navbar */}
      <div className="hidden md:flex max-w-6xl mx-auto px-4 sm:px-6 h-18 items-center justify-between w-full">
        
        {/* Brand Logo - clean, human-crafted typography as requested */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedTrack(null);
              setCurrentTab('tracks');
            }}
            className="flex items-center gap-3 text-left group transition cursor-pointer"
          >
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-brand text-3xl sm:text-4xl font-bold tracking-normal text-slate-900 select-none drop-shadow-2xs">
                  <span className="logo-word text-slate-950">علم</span>
                </span>
                <span className="text-slate-300 font-light text-xl select-none">|</span>
                <span className="font-bold text-lg sm:text-xl tracking-wider text-slate-700 select-none font-sans uppercase">
                  ILM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {isAr ? 'رحلة معرفية موثوقة' : 'Verified Islamic Learning Journey'}
              </p>
            </div>
          </button>

          {/* SDAIA / Challenge Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{isAr ? 'تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي' : 'AI Islamic Content Challenge'}</span>
          </div>
        </div>

        {/* Navigation Tabs - Hidden on Mobile (md:flex), only on Laptop/Desktop */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <div className="hidden md:flex items-center gap-1.5">
            {selectedTrack && (
              <>
                <button
                  onClick={() => setCurrentTab('journey')}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'journey'
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'المسار والمعلم الذكي' : isUr ? 'مسار اور استاد' : 'Track & AI Tutor'}</span>
                  <span className="hidden lg:inline-block px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 font-bold">
                    {selectedTrack === 'muslim'
                      ? (isAr ? 'المسلم الأصل' : 'Born Muslim')
                      : selectedTrack === 'new_muslim'
                      ? (isAr ? 'المسلم الجديد' : 'New Muslim')
                      : selectedTrack === 'non_muslim'
                      ? (isAr ? 'غير المسلم' : 'Inquirer')
                      : (isAr ? 'الداعية' : 'Da\'iyah')}
                  </span>
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentTab('tracks')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'tracks'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{getNavLabel('tracks')}</span>
            </button>

            {selectedTrack && (
              <button
                onClick={() => setCurrentTab('certificate')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'certificate'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>{getNavLabel('certificate')}</span>
              </button>
            )}

            <button
              onClick={() => setCurrentTab('achievements')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'achievements'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{getNavLabel('achievements')}</span>
              <span className="hidden lg:inline-block px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                {isAr ? 'شارة' : 'Badges'}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('simulator')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'simulator'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bot className="w-4 h-4 text-amber-500" />
              <span>{getNavLabel('simulator')}</span>
              <span className="hidden lg:inline-block px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-semibold">
                {isAr ? 'تميز' : isUr ? 'نیا' : 'New'}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('lab')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'lab'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{getNavLabel('lab')}</span>
            </button>

            <button
              onClick={() => setCurrentTab('sources')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
                currentTab === 'sources'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4 text-blue-600" />
              <span>{getNavLabel('sources')}</span>
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-2.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-slate-100 ${
                currentTab === 'dashboard' ? 'bg-slate-200 text-slate-900 font-bold' : ''
              }`}
              title={isAr ? 'لوحة مؤشرات الأداء للتحكيم' : isUr ? 'اشاریہ جاتی ڈیش بورڈ' : 'KPI Dashboard'}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>

          {/* Welcome Screen Revisit Trigger */}
          {onOpenWelcome && (
            <button
              onClick={onOpenWelcome}
              className="px-2.5 py-1.5 rounded-lg border border-amber-300 hover:border-amber-400 text-xs sm:text-sm font-semibold text-amber-900 bg-amber-50/70 hover:bg-amber-100 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title={isAr ? 'شاشة الترحيب وهوية المنصة' : isUr ? 'تعارفی اسکرین' : 'Welcome Screen'}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isAr ? 'عِلم' : 'ILM'}</span>
            </button>
          )}

          {/* Guide / Onboarding Trigger Button */}
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title={isAr ? 'دليل استخدام المنصة والمساعد الذكي' : isUr ? 'پلیٹ فارم گائیڈ' : 'Platform Guide'}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{getNavLabel('guide')}</span>
            </button>
          )}

          {/* 3-Way Language Switcher (Arabic, English, Urdu) */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100/80 p-0.5 text-xs font-semibold shadow-2xs">
            <button
              onClick={() => setLanguage('ar')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                language === 'ar'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="العربية (Arabic)"
            >
              العربية
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ur')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-urdu ${
                language === 'ur'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="اردو (Urdu)"
            >
              اردو
            </button>
          </div>
        </nav>

      </div>

      {/* Mobile Top Cultural Header Bar */}
      <div className="md:hidden flex items-center justify-between px-3.5 py-2 w-full bg-[#FAF7F2]/98 border-b border-[#EAE3D6]">
        <button
          onClick={() => {
            setSelectedTrack(null);
            setCurrentTab('tracks');
          }}
          className="flex items-center gap-1.5 cursor-pointer text-left"
        >
          <span className="font-brand text-2xl font-bold tracking-normal text-slate-900 select-none">
            <span className="logo-word text-slate-950">علم</span>
          </span>
          <span className="text-slate-300 font-light text-base select-none">|</span>
          <span className="font-bold text-xs tracking-wider text-slate-700 select-none font-sans uppercase">
            ILM
          </span>
        </button>

        <IslamicDateDisplay language={language} variant="compact" />
      </div>
    </header>
  );
};
