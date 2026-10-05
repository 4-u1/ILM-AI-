import React from 'react';
import { Language } from '../types';
import { IlmBrandLogo } from './IlmBrandLogo';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const isAr = language === 'ar';

  return (
    <footer className="mt-20 border-t border-[#EAE3D6] bg-[#FAF7F2]/80 py-12 px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Brand Signoff with IlmBrandLogo */}
        <div className="flex items-center justify-center">
          <IlmBrandLogo size="md" showSubtitle={true} withAura={true} />
        </div>

        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
          {isAr
            ? 'رحلة تعليمية ودعوية موثوقة يقودها الذكاء الاصطناعي المؤصل لكل باحث عن العلم الشرعي النافع.'
            : 'A trusted, strictly grounded Islamic learning and dawah platform guided by AI.'}
        </p>

        {/* Partners & Challenge Attributions */}
        <div className="pt-4 border-t border-[#EAE3D6]/80 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
          <span>{isAr ? 'مؤسسة باذل الأهلية' : 'Bathel Foundation'}</span>
          <span>•</span>
          <span>{isAr ? 'الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)' : 'SDAIA'}</span>
          <span>•</span>
          <span>{isAr ? 'وزارة الاتصالات وتقنية المعلومات' : 'MCIT'}</span>
          <span>•</span>
          <span>{isAr ? 'التحول التقني' : 'Technical Transformation'}</span>
        </div>

        {/* Copyright notice */}
        <div className="text-[11px] text-slate-500 pt-2 font-mono">
          {isAr
            ? '© 2026 عِلم — منتج مكتمل ضمن نطاق محدد وفق متطلبات تحدي الذكاء الاصطناعي'
            : '© 2026 ILM Platform — Production-ready complete product for AI Islamic Content Challenge'}
        </div>

      </div>
    </footer>
  );
};
