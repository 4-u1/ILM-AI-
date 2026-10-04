import React, { useState } from 'react';
import { TrackId, Language } from '../types';
import { BookOpen, Layers, Bot, ShieldCheck, BarChart3, Globe, Award, Sparkles, Share2, Check, X } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/translations';

interface BottomNavProps {
  currentTab: 'tracks' | 'journey' | 'simulator' | 'lab' | 'sources' | 'dashboard' | 'certificate' | 'tutor' | 'achievements' | 'ambassadors' | 'copilot' | 'thirtyDays' | 'offlineKit' | 'signLanguage' | 'ilmJunior' | 'culturalEtiquette' | 'scholasticSearch' | 'fieldDaiyah';
  setCurrentTab: (tab: 'tracks' | 'journey' | 'simulator' | 'lab' | 'sources' | 'dashboard' | 'certificate' | 'tutor' | 'achievements' | 'ambassadors' | 'copilot' | 'thirtyDays' | 'offlineKit' | 'signLanguage' | 'ilmJunior' | 'culturalEtiquette' | 'scholasticSearch' | 'fieldDaiyah') => void;
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
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const navItems = [
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
            labelAr: 'المسار والمعلم',
            labelEn: 'Track & Tutor',
            labelUr: 'مسار اور استاد',
            icon: Sparkles,
            highlight: true,
          },
        ]
      : []),
    {
      id: 'ambassadors' as const,
      labelAr: 'السفراء',
      labelEn: 'Ambassadors',
      labelUr: 'سفراء',
      icon: Share2,
      highlight: true,
    },
    {
      id: 'achievements' as const,
      labelAr: 'الأوسمة',
      labelEn: 'Badges',
      labelUr: 'اعزازات',
      icon: Award,
    },
    {
      id: 'simulator' as const,
      labelAr: 'المحاكي',
      labelEn: 'Simulator',
      labelUr: 'سمیلیٹر',
      icon: Bot,
      highlight: true,
    },
    {
      id: 'lab' as const,
      labelAr: 'الموثوقية',
      labelEn: 'Safety Lab',
      labelUr: 'توثیق',
      icon: ShieldCheck,
    },
    {
      id: 'dashboard' as const,
      labelAr: 'المؤشرات',
      labelEn: 'Analytics',
      labelUr: 'اشاریے',
      icon: BarChart3,
    },
  ];

  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'ar' ? 'en' : language === 'en' ? 'ur' : 'ar';
    setLanguage(nextLang);
  };

  const getLabel = (item: typeof navItems[0]) => {
    if (language === 'ar') return item.labelAr;
    if (language === 'ur') return item.labelUr;
    return item.labelEn;
  };

  const getSwitcherBadge = () => {
    if (language === 'ar') return 'EN';
    if (language === 'en') return 'اردو';
    return 'عربي';
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#EAE3D6] shadow-[0_-4px_16px_rgba(0,0,0,0.05)] px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer relative min-w-[50px] ${
                isActive
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'scale-110' : ''
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? item.highlight
                        ? 'text-amber-600'
                        : 'text-slate-950'
                      : 'text-slate-500'
                  }`}
                  strokeWidth={isActive ? 2.3 : 1.75}
                />
              </div>
              <span className={`text-[10px] tracking-tight leading-tight mt-0.5 ${isActive ? 'font-bold' : 'font-normal'} ${isUr ? 'font-urdu' : ''}`}>
                {getLabel(item)}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 absolute -bottom-0.5"></span>
              )}
            </button>
          );
        })}

        {/* Mobile Language Switcher Item */}
        <button
          onClick={() => setShowLanguageModal(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-slate-900 min-w-[46px]"
          title={isAr ? 'تغيير لغة المنصة' : isUr ? 'زبان تبدیل کریں' : 'Switch Language'}
        >
          <div className="p-1 rounded-lg">
            <Globe className="w-5 h-5 text-amber-700" strokeWidth={1.75} />
          </div>
          <span className="text-[10px] tracking-tight leading-tight mt-0.5 font-bold uppercase text-slate-700">
            {language}
          </span>
        </button>
      </div>

      {/* Mobile Language Bottom Sheet Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden pb-6">
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

            <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map((item) => {
                const isSelected = item.code === language;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
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
    </nav>
  );
};
