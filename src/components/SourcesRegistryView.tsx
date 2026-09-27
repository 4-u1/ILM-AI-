import React from 'react';
import { Language } from '../types';
import { APPROVED_SOURCES_REGISTRY, APPROVED_TERMS_DICTIONARY } from '../data/sourcesRegistry';
import { ShieldCheck, ExternalLink, BookMarked, ArrowRight, ArrowLeft } from 'lucide-react';

interface SourcesRegistryViewProps {
  language: Language;
  onBack: () => void;
}

export const SourcesRegistryView: React.FC<SourcesRegistryViewProps> = ({ language, onBack }) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const sourcesList = Object.values(APPROVED_SOURCES_REGISTRY);

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{isAr ? 'العودة للمنصة' : 'Back to Platform'}</span>
        </button>

        <span className="text-xs font-semibold text-slate-500">
          {isAr ? 'وثيقة المرجعية والحزمة العلمية' : 'Scientific Reference Document'}
        </span>
      </div>

      {/* Main Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>{isAr ? 'المرجعية العلمية المعتمدة' : 'Accredited Scientific Sources'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          {isAr ? 'المصادر الموثوقة وقاموس المصطلحات' : 'Approved Knowledge Repositories & Terminology'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          {isAr
            ? 'تلتزم منصة عِلم بالعمل حصراً ومطابقة المحتوى مع المصادر المحددة رسمياً في وثيقة التحدي الصادرة عن مؤسسة باذل وسدايا.'
            : 'Eilm strictly adheres to the accredited sources established in the Challenge guidelines by Bathel Foundation and SDAIA.'}
        </p>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sourcesList.map((source, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {source.category}
                </span>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                  {source.domain}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {source.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {source.referenceDetail}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {source.reliabilityNote}
              </span>
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 shrink-0"
                >
                  <span>{isAr ? 'زيارة' : 'Visit'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Challenge Terminology Standard Section (Page 8) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <BookMarked className="w-3.5 h-3.5" />
            <span>{isAr ? 'نماذج لقاموس المصطلحات الأساسية (الدليل ص 8)' : 'Approved Terms Dictionary (Page 8)'}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {isAr ? 'ضوابط الترجمة والتوطين للمفاهيم الشرعية الحساسة' : 'Translation & Cultural Localization Standards'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {APPROVED_TERMS_DICTIONARY.map((term, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
            >
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="font-bold text-slate-900 text-sm">{term.term}</span>
                <span className="text-xs font-mono font-semibold text-slate-600">{term.termEn}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-700 block mb-0.5">{isAr ? 'ضابط الاستخدام:' : 'Rule of Usage:'}</span>
                {isAr ? term.standardRule : term.standardRuleEn}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
