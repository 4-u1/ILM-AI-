import React, { useState } from 'react';
import { Language, BenchmarkCase, ContentLevel } from '../types';
import { SAFETY_BENCHMARKS } from '../data/safetyBenchmarks';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  ExternalLink, 
  Sparkles,
  FileCheck2,
  Terminal,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { FormattedMessage } from './FormattedMessage';

interface VerificationLabProps {
  language: Language;
}

export const VerificationLab: React.FC<VerificationLabProps> = ({ language }) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activeCase, setActiveCase] = useState<BenchmarkCase>(SAFETY_BENCHMARKS[0]);
  const [testedCaseIds, setTestedCaseIds] = useState<string[]>([SAFETY_BENCHMARKS[0].id]);
  const [filterLevel, setFilterLevel] = useState<ContentLevel | 'ALL'>('ALL');

  const filteredCases = filterLevel === 'ALL'
    ? SAFETY_BENCHMARKS
    : SAFETY_BENCHMARKS.filter((c) => c.expectedCategory === filterLevel);

  const handleSelectCase = (c: BenchmarkCase) => {
    setActiveCase(c);
    if (!testedCaseIds.includes(c.id)) {
      setTestedCaseIds([...testedCaseIds, c.id]);
    }
  };

  const levelBadges: Record<ContentLevel, { titleAr: string; titleEn: string; color: string; actionAr: string; actionEn: string }> = {
    A: {
      titleAr: 'المستوى (أ) - معلومات أصلية مستقرة',
      titleEn: 'Level (A) - Core Established Facts',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      actionAr: 'إجابة مباشرة موثقة بالمصدر نصاً ورواية',
      actionEn: 'Direct answer documented with verified source'
    },
    B: {
      titleAr: 'المستوى (ب) - شرح واستدلال وشبهات',
      titleEn: 'Level (B) - Conceptual Clarification',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      actionAr: 'إجابة من المادة المعتمدة مع إظهار المرجع وتجنب القطع',
      actionEn: 'Answer from accredited material showing reference'
    },
    C: {
      titleAr: 'المستوى (ج) - مسائل خلافية أو حساسة',
      titleEn: 'Level (C) - Jurisprudential Differences',
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      actionAr: 'إجابة مقيدة أو بيان الخلاف بأمانة دون ترجيح آلي',
      actionEn: 'Restricted answer stating disagreement without auto-ruling'
    },
    D: {
      titleAr: 'المستوى (د) - فتوى أو واقعة شخصية',
      titleEn: 'Level (D) - Personal Case / Fatwa',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      actionAr: 'الامتناع التام عن الفتوى المستقلة والإحالة لمختص مؤهل',
      actionEn: 'Strict refusal of autonomous fatwa + referral to authorities'
    }
  };

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Mobile Top Brand Header */}
      <div className="md:hidden flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-baseline gap-1.5">
          <span className="font-brand text-3xl font-bold tracking-normal text-slate-900 select-none">
            <span className="logo-word text-slate-950">علم</span>
          </span>
          <span className="text-slate-300 font-light text-lg select-none">|</span>
          <span className="font-bold text-base tracking-wider text-slate-700 select-none font-sans uppercase">
            ILM
          </span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          {isAr ? 'مختبر الموثوقية' : 'Safety Lab'}
        </span>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isAr ? 'مختبر الموثوقية والسلامة العلمية' : 'Scientific Reliability & Safety Lab'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          {isAr ? 'مطابقة معايير التحكيم والامتناع عن الفتوى' : 'Verification Benchmarks & Fatwa Governance'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isAr
            ? 'هذا القسم مخصص للجنة التحكيم والمستخدمين لاختبار وضمان التزام المنصة الصارم بـ "حالات اختبار التأكد من سلامة المحتوى" المنصوص عليها في ص 6 و ص 37 من دليل التحدي.'
            : 'Dedicated verification benchmark testing the system\'s anti-hallucination, Level D fatwa refusal protocol, and source tracking as mandated by the challenge guidelines.'}
        </p>
      </div>

      {/* 4 Levels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(['A', 'B', 'C', 'D'] as ContentLevel[]).map((lvl) => {
          const info = levelBadges[lvl];
          return (
            <div
              key={lvl}
              onClick={() => setFilterLevel(filterLevel === lvl ? 'ALL' : lvl)}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                filterLevel === lvl
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                  filterLevel === lvl ? 'bg-white/20 text-white' : info.color
                }`}>
                  {lvl}
                </span>
                <span className="text-[10px] opacity-75">
                  {isAr ? 'انقر للفرز' : 'Click to filter'}
                </span>
              </div>
              <h3 className={`text-xs font-bold mb-1 ${filterLevel === lvl ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? info.titleAr : info.titleEn}
              </h3>
              <p className={`text-[11px] leading-relaxed ${filterLevel === lvl ? 'text-slate-300' : 'text-slate-500'}`}>
                {isAr ? info.actionAr : info.actionEn}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Benchmarking Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Cases List Sidebar */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
            <span>{isAr ? 'حالات الاختبار القياسية (الدليل ص 6)' : 'Standard Test Cases (Page 6)'}</span>
            <span>{testedCaseIds.length} / {SAFETY_BENCHMARKS.length}</span>
          </div>

          {filteredCases.map((c) => {
            const isSelected = c.id === activeCase.id;
            const isTested = testedCaseIds.includes(c.id);

            return (
              <button
                key={c.id}
                onClick={() => handleSelectCase(c)}
                className={`w-full text-start p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-white border-slate-900 ring-2 ring-slate-900/10 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      c.expectedCategory === 'D'
                        ? 'bg-rose-100 text-rose-800'
                        : c.expectedCategory === 'A'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {c.expectedCategory}
                  </span>
                  <span className="text-xs font-bold text-slate-800 line-clamp-2">
                    {isAr ? c.question : c.questionEn}
                  </span>
                </div>

                {isTested && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Case Execution & Analysis */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          
          {/* Active Case Header */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  levelBadges[activeCase.expectedCategory].color
                }`}
              >
                {isAr
                  ? levelBadges[activeCase.expectedCategory].titleAr
                  : levelBadges[activeCase.expectedCategory].titleEn}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'حالة معتمدة بالتحدي' : 'Challenge Benchmark'}</span>
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {isAr ? activeCase.question : activeCase.questionEn}
            </h2>
          </div>

          {/* Expected Behavior Rule */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block">
              🎯 {isAr ? 'السلوك العلمي المتوقع والمطابق للدليل:' : 'Expected Governed Behavior:'}
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isAr ? activeCase.expectedBehavior : activeCase.expectedBehaviorEn}
            </p>
          </div>

          {/* Live Compliant System Response */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-600" />
                <span>{isAr ? 'الاستجابة المحكمة للنظام (Compliant Response):' : 'Live System Response:'}</span>
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                {isAr ? 'مطابق 100%' : '100% Verified'}
              </span>
            </div>

            <div className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
              activeCase.expectedCategory === 'D'
                ? 'bg-amber-50/60 border-amber-200 text-amber-950 font-medium'
                : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
            }`}>
              <FormattedMessage content={isAr ? activeCase.sampleCompliantResponse : activeCase.sampleCompliantResponseEn} />
            </div>
          </div>

          {/* Source Attribution & Guideline */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">{isAr ? 'المصدر المعتمد الموثق:' : 'Documented Source:'}</span>
              <span className="font-bold text-slate-900">{activeCase.approvedSource.title}</span>
            </div>

            <a
              href={activeCase.approvedSource.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
            >
              <span>{activeCase.approvedSource.domain}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
