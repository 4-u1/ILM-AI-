import React, { useState, useEffect } from 'react';
import { Language, TrackId } from '../types';
import { BookOpen, ShieldCheck, Award, BarChart3, Bot, Sparkles, Globe, HelpCircle, Share2, Zap, Calendar, HardDrive, Eye, EyeOff, Wifi, WifiOff } from 'lucide-react';
import { UI_TRANSLATIONS, isRtlLanguage } from '../data/translations';
import { IslamicDateDisplay } from './IslamicDateDisplay';
import { LanguageDropdown } from './LanguageDropdown';
import { getStoredXP, getLearnerProfile } from '../utils/xpManager';

interface NavbarProps {
  currentTab: 'tracks' | 'journey' | 'simulator' | 'lab' | 'sources' | 'dashboard' | 'certificate' | 'tutor' | 'achievements' | 'ambassadors' | 'copilot' | 'thirtyDays' | 'offlineKit' | 'signLanguage' | 'ilmJunior' | 'culturalEtiquette' | 'scholasticSearch' | 'fieldDaiyah';
  setCurrentTab: (tab: 'tracks' | 'journey' | 'simulator' | 'lab' | 'sources' | 'dashboard' | 'certificate' | 'tutor' | 'achievements' | 'ambassadors' | 'copilot' | 'thirtyDays' | 'offlineKit' | 'signLanguage' | 'ilmJunior' | 'culturalEtiquette' | 'scholasticSearch' | 'fieldDaiyah') => void;
  selectedTrack: TrackId | null;
  setSelectedTrack: (track: TrackId | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenOnboarding?: () => void;
  onOpenWelcome?: () => void;
  onOpenProfile?: () => void;
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
      {/* Top Cultural Date & Identity Bar - visible on desktop and tablet */}
      <div className="hidden md:block w-full border-b border-[#EAE3D6]/70 bg-[#F6F1EA]/70 py-1.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <IslamicDateDisplay language={language} variant="navbar" />
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500 font-medium">
            {/* Online / Offline Status Badge */}
            <div 
              onClick={() => setCurrentTab('offlineKit')}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                isOnline 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' 
                  : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
              }`}
              title={isAr ? 'حالة الاتصال بالشبكة وقاعدة البيانات المحلية' : 'Network & Offline Cache Status'}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  <span>{isAr ? 'متصل بالشبكة (حفظ محلي فوري)' : 'Online (Auto-Cached)'}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-700" />
                  <span>{isAr ? 'وضع بلا إنترنت نشط' : 'Offline Mode Active'}</span>
                </>
              )}
            </div>

            <span className="text-slate-300">•</span>
            <span>{isAr ? 'حزمة المصادر المعتمدة 100%' : 'Verified Islamic Sources 100%'}</span>
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
              onClick={() => setCurrentTab('ambassadors')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'ambassadors'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isAr ? 'منظومة سفراء عِلم للدعوة التفاعلية' : 'ILM Ambassadors Hub'}
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>{getNavLabel('ambassadors')}</span>
              <span className="hidden lg:inline-block px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                {isAr ? 'سفير' : 'Ambassador'}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('thirtyDays')}
              className={`hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
                currentTab === 'thirtyDays'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isAr ? 'برنامج الأيام الـ 30 للمهتدي' : 'First 30 Days Foundations'}
            >
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>{getNavLabel('thirtyDays')}</span>
            </button>

            <button
              onClick={() => setCurrentTab('copilot')}
              className={`hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
                currentTab === 'copilot'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isAr ? 'المساعد الدعوي الميداني الفوري' : 'Field Whispering Co-Pilot'}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{getNavLabel('copilot')}</span>
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

            {/* Universal Inclusivity & Specialized Features Mega Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCommunityMenuOpen(!isCommunityMenuOpen)}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  ['signLanguage', 'ilmJunior', 'culturalEtiquette', 'scholasticSearch', 'fieldDaiyah'].includes(currentTab)
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                }`}
                title="مبادرات الشمول المجتمعي والميزات التخصصية"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{isAr ? 'مبادرات الشمول' : 'Inclusivity Hub'}</span>
                <span className="text-[10px] px-1 py-0.2 bg-amber-200/80 rounded font-bold">5</span>
              </button>

              {/* Dropdown Menu Popup */}
              {isCommunityMenuOpen && (
                <div 
                  className="absolute top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#EAE3D6] p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  dir={isAr ? 'rtl' : 'ltr'}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    {isAr ? 'فئات المجتمع والتخصصات' : 'Community & Scholastic Hubs'}
                  </div>

                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => {
                        setCurrentTab('signLanguage');
                        setIsCommunityMenuOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-teal-50 text-right transition cursor-pointer flex items-center gap-2.5 text-xs font-bold text-slate-800"
                    >
                      <span className="text-base p-1 bg-teal-100 rounded-lg">🤟</span>
                      <div>
                        <div className="text-slate-900">{isAr ? 'قاموس لغة الإشارة الإسلامي' : 'Sign Language Hub'}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{isAr ? 'للصم وضعاف السمع' : 'Deaf Inclusivity'}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('ilmJunior');
                        setIsCommunityMenuOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-amber-50 text-right transition cursor-pointer flex items-center gap-2.5 text-xs font-bold text-slate-800"
                    >
                      <span className="text-base p-1 bg-amber-100 rounded-lg">🌱</span>
                      <div>
                        <div className="text-slate-900">{isAr ? 'براعم عِلم ولوحة ولي الأمر' : 'ILM Junior & Family'}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{isAr ? 'للأطفال 6-12 سنة والأسرة' : 'Young Learners'}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('culturalEtiquette');
                        setIsCommunityMenuOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-blue-50 text-right transition cursor-pointer flex items-center gap-2.5 text-xs font-bold text-slate-800"
                    >
                      <span className="text-base p-1 bg-blue-100 rounded-lg">🌏</span>
                      <div>
                        <div className="text-slate-900">{isAr ? 'دليل التوطين والآداب للجاليات' : 'Cultural Etiquette Guide'}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{isAr ? 'بـ 5 لغات حية' : '5 Living Languages'}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('scholasticSearch');
                        setIsCommunityMenuOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-stone-50 text-right transition cursor-pointer flex items-center gap-2.5 text-xs font-bold text-slate-800"
                    >
                      <span className="text-base p-1 bg-stone-100 rounded-lg">🔍</span>
                      <div>
                        <div className="text-slate-900">{isAr ? 'البحث التأصيلي المقارن' : 'Scholastic Cross-Search'}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{isAr ? 'لطلبة العلم والباحثين' : 'Scholars & Researchers'}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('fieldDaiyah');
                        setIsCommunityMenuOpen(false);
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-emerald-50 text-right transition cursor-pointer flex items-center gap-2.5 text-xs font-bold text-slate-800"
                    >
                      <span className="text-base p-1 bg-emerald-100 rounded-lg">🖨️</span>
                      <div>
                        <div className="text-slate-900">{isAr ? 'حقيبة وبطاقات الداعية الميداني' : 'Field Outreach Kit'}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{isAr ? 'جاهزة للطباعة والواتساب' : 'Printable & WhatsApp'}</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentTab('offlineKit')}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
                currentTab === 'offlineKit'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isAr ? 'حقيبة العمل دون إنترنت' : 'Offline Field Kit'}
            >
              <HardDrive className="w-4 h-4 text-slate-600" />
              <span>{getNavLabel('offlineKit')}</span>
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

          {/* Senior & Accessibility High Contrast Mode Toggle + Dynamic Font Scaler */}
          {onToggleSeniorMode && (
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={onToggleSeniorMode}
                className={`px-2.5 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  isSeniorMode
                    ? 'bg-amber-700 text-white border-amber-800 ring-2 ring-amber-400 font-bold'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 font-medium'
                }`}
                title={isAr ? 'الوضع الخاص (كبار السن وراحة العين - تباين أعلى وخطوط واضحة)' : 'Senior & High-Contrast Mode'}
              >
                <Eye className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? (isSeniorMode ? 'الوضع الخاص ✓' : 'الوضع الخاص') : (isSeniorMode ? 'Senior ✓' : 'Senior')}</span>
              </button>

              {/* Dynamic Font Scaler available in Senior Mode or accessible globally */}
              {isSeniorMode && onChangeSeniorFontSize && (
                <div className="flex items-center gap-0.5 px-1 bg-white rounded-lg border border-slate-300">
                  <span className="text-[10px] font-bold text-slate-700 px-1 select-none">
                    {isAr ? 'الخط:' : 'A:'}
                  </span>
                  {(['normal', 'large', 'xlarge'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onChangeSeniorFontSize(size)}
                      className={`px-1.5 py-0.5 rounded text-xs transition cursor-pointer font-bold ${
                        seniorFontSize === size
                          ? 'bg-amber-700 text-white shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                      title={
                        size === 'normal'
                          ? (isAr ? 'حجم خط قياسي' : 'Normal')
                          : size === 'large'
                          ? (isAr ? 'خط كبير (+15%)' : 'Large')
                          : (isAr ? 'خط كبير جداً (+30%)' : 'X-Large')
                      }
                    >
                      {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Language Dropdown Selector (6 International Languages) */}
          <LanguageDropdown
            language={language}
            onSelectLanguage={setLanguage}
            variant="navbar"
          />
        </nav>

      </div>

      {/* Mobile Top Cultural Header Bar */}
      <div className="md:hidden flex items-center justify-between px-3 py-2 w-full bg-[#FAF7F2]/98 border-b border-[#EAE3D6]">
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

        <div className="flex items-center gap-1.5">
          {/* Mobile Language Dropdown */}
          <LanguageDropdown
            language={language}
            onSelectLanguage={setLanguage}
            variant="compact"
          />

          {onToggleSeniorMode && (
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={onToggleSeniorMode}
                className={`p-1.5 rounded-md border text-xs font-semibold flex items-center gap-1 ${
                  isSeniorMode ? 'bg-amber-700 text-white border-amber-800' : 'bg-white text-slate-800 border-slate-300'
                }`}
                title="الوضع الخاص"
              >
                <Eye className="w-3.5 h-3.5 text-amber-500" />
              </button>

              {isSeniorMode && onChangeSeniorFontSize && (
                <button
                  type="button"
                  onClick={() => {
                    const next = seniorFontSize === 'normal' ? 'large' : seniorFontSize === 'large' ? 'xlarge' : 'normal';
                    onChangeSeniorFontSize(next);
                  }}
                  className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-xs font-bold text-amber-900"
                  title="تغيير حجم الخط"
                >
                  {seniorFontSize === 'normal' ? 'A' : seniorFontSize === 'large' ? 'A+' : 'A++'}
                </button>
              )}
            </div>
          )}
          {/* Mobile Offline/Online Indicator */}
          <button
            onClick={() => setCurrentTab('offlineKit')}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
              isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
            title={isOnline ? 'متصل بالإنترنت' : 'وضع بلا إنترنت'}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          </button>

          <IslamicDateDisplay language={language} variant="compact" />
        </div>
      </div>
    </header>
  );
};
