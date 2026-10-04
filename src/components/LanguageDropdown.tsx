import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { SUPPORTED_LANGUAGES, LanguageOption } from '../data/translations';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageDropdownProps {
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  variant?: 'navbar' | 'compact' | 'bottomNav';
  className?: string;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  language,
  onSelectLanguage,
  variant = 'navbar',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    onSelectLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-start ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-xl border transition-all cursor-pointer select-none ${
          variant === 'navbar'
            ? 'px-3 py-1.5 bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800 shadow-2xs text-xs font-semibold'
            : variant === 'compact'
            ? 'px-2 py-1 bg-white hover:bg-slate-50 border-slate-200 text-slate-800 text-[11px] font-semibold'
            : 'flex-col items-center justify-center py-1 px-2 text-slate-500 hover:text-slate-900'
        } ${isOpen ? 'ring-2 ring-amber-500/30 border-amber-400 bg-amber-50/30' : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-amber-700" />
          <span className="text-sm leading-none">{currentLang.flag}</span>
          <span className="font-bold tracking-tight text-slate-900 text-xs">
            {currentLang.nativeLabel}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 w-56 rounded-2xl bg-white shadow-xl border border-slate-200/90 py-1.5 animate-in fade-in zoom-in-95 duration-150 overflow-hidden ${
            currentLang.direction === 'rtl' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
          }`}
          style={{ minWidth: '13.5rem' }}
        >
          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {language === 'ar'
                ? 'اختر لغة المنصة'
                : language === 'ur'
                ? 'پلیٹ فارم کی زبان منتخب کریں'
                : 'Select Language'}
            </span>
          </div>

          <div className="py-1 max-h-72 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((item: LanguageOption) => {
              const isSelected = item.code === language;

              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base select-none">{item.flag}</span>
                    <div className="text-start">
                      <div className="font-semibold">{item.nativeLabel}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{item.label}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50/50 text-[10px] text-slate-500 flex items-center justify-between">
            <span>6 لغات عالمية معتمدة</span>
            <span className="text-emerald-700 font-bold">100% موثقة</span>
          </div>
        </div>
      )}
    </div>
  );
};
