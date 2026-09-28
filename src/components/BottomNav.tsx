import React from 'react';
import { TrackId, Language } from '../types';
import { BookOpen, Layers, Bot, ShieldCheck, BarChart3, Globe, Award, Sparkles } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'tracks' | 'journey' | 'simulator' | 'lab' | 'sources' | 'dashboard' | 'certificate' | 'tutor' | 'achievements';
  setCurrentTab: (tab: 'tracks' | 'journey' | 'simulator' | 'lab' | 'sources' | 'dashboard' | 'certificate' | 'tutor' | 'achievements') => void;
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
          onClick={handleToggleLanguage}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-slate-900 min-w-[46px]"
          title={isAr ? 'تغيير اللغة' : isUr ? 'زبان تبدیل کریں' : 'Switch Language'}
        >
          <div className="p-1 rounded-lg">
            <Globe className="w-5 h-5 text-slate-500" strokeWidth={1.75} />
          </div>
          <span className={`text-[10px] tracking-tight leading-tight mt-0.5 font-bold ${language === 'ur' ? 'font-urdu text-amber-800' : ''}`}>
            {getSwitcherBadge()}
          </span>
        </button>
      </div>
    </nav>
  );
};
