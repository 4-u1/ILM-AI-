import React, { useState } from 'react';
import { TrackId, Language } from '../types';
import { 
  Layers, 
  Bot, 
  ShieldCheck, 
  BarChart3, 
  Globe, 
  Award, 
  Sparkles, 
  Share2, 
  Check, 
  X, 
  Heart, 
  MoreHorizontal,
  Moon,
  Compass,
  Download,
  Search,
  MessageSquare,
  BookOpen,
  Users
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../data/translations';
import { IlmBrandLogo } from './IlmBrandLogo';
import { PWAInstallButton } from './PWAInstallButton';

export type AppTabType = 'tracks' | 'journey' | 'simulator' | 'lab' | 'sources' | 'dashboard' | 'certificate' | 'tutor' | 'achievements' | 'ambassadors' | 'copilot' | 'thirtyDays' | 'offlineKit' | 'signLanguage' | 'ilmJunior' | 'culturalEtiquette' | 'scholasticSearch' | 'fieldDaiyah' | 'dhikr' | 'quran' | 'favorites';

interface BottomNavProps {
  currentTab: AppTabType;
  setCurrentTab: (tab: AppTabType) => void;
  selectedTrack: TrackId | null;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  selectedTrack,
  language,
  setLanguage,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Safe fallback
      }
    }
  };

  // Primary 4-5 High-Frequency Mobile Destinations
  const primaryTabs = [
    {
      id: 'tracks' as const,
      labelAr: 'المسارات',
      labelEn: 'Tracks',
      labelUr: 'راستے',
      icon: Layers,
    },
    ...(selectedTrack
      ? [
          {
            id: 'journey' as const,
            labelAr: 'المعلم الذكي',
            labelEn: 'AI Tutor',
            labelUr: 'استاد',
            icon: Sparkles,
            highlight: true,
          },
        ]
      : [
          {
            id: 'tutor' as const,
            labelAr: 'المعلم',
            labelEn: 'Tutor',
            labelUr: 'استاد',
            icon: Sparkles,
            highlight: true,
          },
        ]),
    {
      id: 'dhikr' as const,
      labelAr: 'الأذكار',
      labelEn: 'Dhikr',
      labelUr: 'اذکار',
      icon: Heart,
      highlight: true,
    },
    {
      id: 'simulator' as const,
      labelAr: 'المحاكي',
      labelEn: 'Simulator',
      labelUr: 'سمیلیٹر',
      icon: Bot,
    },
  ];

  // Secondary Features inside "More ☰" Hub Drawer
  const moreFeatures = [
    {
      id: 'achievements' as const,
      titleAr: 'الأوسمة والإنجازات',
      titleEn: 'Badges & Achievements',
      titleUr: 'اعزازات',
      descAr: 'سجل إتقانك والنقاط والشهادات المعتمدة',
      descEn: 'Track mastery, points & certificates',
      icon: Award,
      color: 'bg-amber-100 text-amber-900 border-amber-200',
    },
    {
      id: 'ambassadors' as const,
      titleAr: 'سفراء عِلم والتأثير',
      titleEn: 'Ambassadors Hub',
      titleUr: 'سفراء',
      descAr: 'مشاركة ونشر بطاقات الهدى والمكافآت',
      descEn: 'Share guidance cards & earn blessings',
      icon: Share2,
      color: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    },
    {
      id: 'lab' as const,
      titleAr: 'مختبر الموثوقية الشرعية',
      titleEn: 'Safety Lab',
      titleUr: 'توثیق لیب',
      descAr: 'حوكمة الفتوى والتأصيل العلمي الذكي',
      descEn: 'Fatwa governance & strict verification',
      icon: ShieldCheck,
      color: 'bg-teal-100 text-teal-900 border-teal-200',
    },
    {
      id: 'dashboard' as const,
      titleAr: 'مؤشرات الأثر والتحليلات',
      titleEn: 'Impact Analytics',
      titleUr: 'اشاریے',
      descAr: 'إحصائيات تقدم المتعلمين ومستوى الدقة',
      descEn: 'Learner metrics, precision & reach',
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-900 border-blue-200',
    },
    {
      id: 'thirtyDays' as const,
      titleAr: 'تحدي 30 يوماً في رمضان',
      titleEn: '30-Day Ramadan Journey',
      titleUr: 'رمضان چیلنج',
      descAr: 'برنامج يومي للتدبر والعمل الصالح',
      descEn: 'Daily spiritual and reflective track',
      icon: Moon,
      color: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    },
    {
      id: 'scholasticSearch' as const,
      titleAr: 'البحث العلمي المحقق',
      titleEn: 'Scholastic Search',
      titleUr: 'علمی تحقیق',
      descAr: 'فهرس المصادر الموثوقة والتفاسير',
      descEn: 'Verified references & source books',
      icon: Search,
      color: 'bg-slate-100 text-slate-900 border-slate-200',
    },
    {
      id: 'offlineKit' as const,
      titleAr: 'حزمة العمل دون إنترنت',
      titleEn: 'Offline Kit',
      titleUr: 'آف لائن کٹ',
      descAr: 'تحميل الدروس والأذكار للمطارات والسفر',
      descEn: 'Download kits for flights and travel',
      icon: Download,
      color: 'bg-amber-100 text-amber-900 border-amber-200',
    },
    {
      id: 'ilmJunior' as const,
      titleAr: 'عِلم جونيور للناشئة',
      titleEn: 'Ilm Junior',
      titleUr: 'عِلم جونیئر',
      descAr: 'محتوى تفاعلي مصور للأطفال والفتيان',
      descEn: 'Interactive illustrated learning for youth',
      icon: Sparkles,
      color: 'bg-orange-100 text-orange-900 border-orange-200',
    },
    {
      id: 'signLanguage' as const,
      titleAr: 'لغة الإشارة الميسرة',
      titleEn: 'Sign Language Hub',
      titleUr: 'اشاروں کی زبان',
      descAr: 'شروحات مرئية مخصصة للصم وضعاف السمع',
      descEn: 'Visual lessons tailored for deaf learners',
      icon: Users,
      color: 'bg-rose-100 text-rose-900 border-rose-200',
    },
    {
      id: 'culturalEtiquette' as const,
      titleAr: 'الآداب والثقافة الإسلامية',
      titleEn: 'Cultural Etiquette',
      titleUr: 'اسلامی آداب',
      descAr: 'دليل الزائرين والمهتدين الجدد للمعاملات',
      descEn: 'Behavioral & cultural guide for all',
      icon: Compass,
      color: 'bg-purple-100 text-purple-900 border-purple-200',
    },
  ];

  const handleSelectTab = (tabId: AppTabType) => {
    triggerHaptic();
    setCurrentTab(tabId);
    setShowMoreDrawer(false);
  };

  const isMoreActive = moreFeatures.some(f => f.id === currentTab);

  return (
    <>
      {/* 📱 Ergonomic Mobile Bottom Nav Bar */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-lg border-t border-[#EAE3D6] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-3 py-1 safe-area-pb safe-area-px"
        role="navigation"
        aria-label="Mobile Navigation"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {primaryTabs.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all cursor-pointer relative min-w-[56px] min-h-[48px] ${
                  isActive
                    ? 'text-amber-950 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-amber-100/90 text-amber-900 scale-105 shadow-2xs' 
                      : 'text-slate-500'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? item.highlight
                          ? 'text-amber-700'
                          : 'text-amber-950'
                        : 'text-slate-500'
                    }`}
                    strokeWidth={isActive ? 2.3 : 1.8}
                  />
                </div>
                <span className={`text-[10.5px] tracking-tight leading-tight mt-0.5 ${isActive ? 'font-bold text-slate-950' : 'font-medium text-slate-600'} ${isUr ? 'font-urdu' : ''}`}>
                  {isAr ? item.labelAr : isUr ? item.labelUr : item.labelEn}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700 absolute bottom-0.5"></span>
                )}
              </button>
            );
          })}

          {/* 🌟 "المزيد" More Button (Opens Native-like Bottom Sheet Drawer) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              setShowMoreDrawer(true);
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all cursor-pointer relative min-w-[56px] min-h-[48px] ${
              isMoreActive
                ? 'text-amber-950 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all ${
                isMoreActive
                  ? 'bg-amber-100/90 text-amber-900 scale-105 shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              <MoreHorizontal
                className={`w-5 h-5 ${
                  isMoreActive ? 'text-amber-700' : 'text-slate-500'
                }`}
                strokeWidth={isMoreActive ? 2.3 : 1.8}
              />
            </div>
            <span className={`text-[10.5px] tracking-tight leading-tight mt-0.5 ${isMoreActive ? 'font-bold text-slate-950' : 'font-medium text-slate-600'}`}>
              {isAr ? 'المزيد' : isUr ? 'مزید' : 'More'}
            </span>
            {isMoreActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-700 absolute bottom-0.5"></span>
            )}
          </button>
        </div>
      </nav>

      {/* 📱 Mobile "More Hub" Bottom Sheet Drawer */}
      {showMoreDrawer && (
        <div 
          className="fixed inset-0 z-55 flex items-end justify-center bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowMoreDrawer(false)}
        >
          <div 
            className="bg-[#FAF7F2] w-full max-w-lg rounded-t-[32px] shadow-2xl border-t border-x border-[#EAE3D6] overflow-hidden flex flex-col max-h-[85vh] animate-sheet-up pb-6 safe-area-pb safe-area-px"
            onClick={(e) => e.stopPropagation()}
            dir={isAr || isUr ? 'rtl' : 'ltr'}
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-2" />

            {/* Sheet Top Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#EAE3D6]">
              <div className="flex items-center gap-2.5">
                <IlmBrandLogo size="xs" showSubtitle={false} withAura={false} />
                <div className="text-start">
                  <h3 className="font-bold text-sm text-slate-900">
                    {isAr ? 'أدوات ومحاور منصة عِلم' : 'ILM Platform Hub'}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {isAr ? 'اختر أي مسار أو أداة للانتقال الفوري' : 'Quick access to all tools & features'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Quick Language Switcher Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreDrawer(false);
                    setShowLanguageModal(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-700" />
                  <span className="uppercase">{language}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowMoreDrawer(false)}
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hub Grid Content */}
            <div className="p-4 space-y-3 overflow-y-auto mobile-scroll-touch flex-1">
              {/* 📲 PWA App Installation Card in Main Mobile Hub */}
              <div className="pb-1">
                <PWAInstallButton
                  language={language}
                  variant="menuItem"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {moreFeatures.map((feat) => {
                  const Icon = feat.icon;
                  const isSelected = currentTab === feat.id;

                  return (
                    <button
                      key={feat.id}
                      type="button"
                      onClick={() => handleSelectTab(feat.id)}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-2xl text-start transition cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-100/80 border-amber-300 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-2xs'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl border shrink-0 ${feat.color}`}>
                        <Icon className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                          {isAr ? feat.titleAr : isUr ? feat.titleUr : feat.titleEn}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-normal mt-0.5 line-clamp-1">
                          {isAr ? feat.descAr : feat.descEn}
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-amber-700 shrink-0 self-center"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🌐 Mobile Language Bottom Sheet Modal */}
      {showLanguageModal && (
        <div 
          className="fixed inset-0 z-55 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowLanguageModal(false)}
        >
          <div 
            className="bg-white w-full sm:max-w-sm rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden pb-6 safe-area-pb animate-sheet-up"
            onClick={(e) => e.stopPropagation()}
            dir={isAr || isUr ? 'rtl' : 'ltr'}
          >
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1 sm:hidden" />
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-slate-900">
                  {isAr ? 'اختر لغة المنصة (6 لغات عالمية)' : 'Select Platform Language'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowLanguageModal(false)}
                className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 space-y-1 max-h-80 overflow-y-auto mobile-scroll-touch">
              {SUPPORTED_LANGUAGES.map((item) => {
                const isSelected = item.code === language;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      triggerHaptic();
                      setLanguage(item.code);
                      setShowLanguageModal(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                        : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.flag}</span>
                      <div className="text-start">
                        <div className="font-bold text-sm">{item.nativeLabel}</div>
                        <div className="text-[11px] text-slate-400">{item.label}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNav;
