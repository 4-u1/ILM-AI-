import React from 'react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const isAr = language === 'ar';

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white py-12 px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Brand Signoff matching refined logo */}
        <div className="flex items-baseline justify-center gap-2">
          <span className="font-brand text-3xl font-bold tracking-normal text-slate-900 select-none">
            <span className="logo-word text-slate-950">علم</span>
          </span>
          <span className="text-slate-300 font-light text-xl select-none">|</span>
          <span className="font-bold text-lg tracking-wider text-slate-700 select-none font-sans uppercase">
            ILM
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
          {isAr
            ? 'رحلة تعليمية موثوقة يقودها الذكاء الاصطناعي لكل باحث عن العلم.'
            : 'A trusted, AI-guided educational journey for every seeker of knowledge.'}
        </p>

        {/* Partners & Challenge Attributions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
          <span>{isAr ? 'مؤسسة باذل الأهلية' : 'Bathel Foundation'}</span>
          <span>•</span>
          <span>{isAr ? 'الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)' : 'SDAIA'}</span>
          <span>•</span>
          <span>{isAr ? 'وزارة الاتصالات وتقنية المعلومات' : 'MCIT'}</span>
          <span>•</span>
          <span>{isAr ? 'التحول التقني' : 'Technical Transformation'}</span>
        </div>

        {/* Copyright notice matching PDF */}
        <div className="text-[11px] text-slate-400 pt-2 font-mono">
          {isAr
            ? '© 2026 عِلم — نسخة تجريبية أولية وفق متطلبات تحدي الذكاء الاصطناعي'
            : '© 2026 Eilm — Initial Beta for AI Islamic Content Challenge'}
        </div>

      </div>
    </footer>
  );
};
