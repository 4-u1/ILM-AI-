import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { getRatingsSummary } from '../utils/responseRatings';
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  ShieldAlert, 
  BookOpen, 
  Globe, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface AdminDashboardProps {
  language: Language;
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, onBack }) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [ratings, setRatings] = useState(getRatingsSummary());

  useEffect(() => {
    const handleUpdate = () => {
      setRatings(getRatingsSummary());
    };
    window.addEventListener('eilm_ratings_updated', handleUpdate);
    return () => window.removeEventListener('eilm_ratings_updated', handleUpdate);
  }, []);

  const kpis = [
    {
      titleAr: 'معدل إكمال الرحلات المعرفية (Key MVP KPI)',
      titleEn: 'Journey Completion Rate',
      value: '74.2%',
      change: '+12.4%',
      isPositive: true,
      descAr: 'مؤشر الـ PRD الأهم: نسبة المتعلمين الذين استمروا وأتموا مراحل مساراتهم',
      descEn: 'Primary metric: learners completing structured stages',
    },
    {
      titleAr: 'نسبة الإسناد والتوثيق للمصادر',
      titleEn: 'Source Citation Rate',
      value: '99.8%',
      change: '100% Target',
      isPositive: true,
      descAr: 'كل جواب وشرح يرتبط بآية أو حديث مخرج أو مادة من المستودع الدعوي',
      descEn: 'Every explanation grounded in King Fahd Complex, Dorar, or Dawa Center',
    },
    {
      titleAr: 'إحالات الامتناع عن الفتوى (المستوى د)',
      titleEn: 'Fatwa Escalations (Level D)',
      value: '184 حالة',
      change: 'حماية المستفيد',
      isPositive: true,
      descAr: 'تطبيق بروتوكول الامتناع الصارم عن فتاوى الطلاق والنزاعات وإحالتها للمفتين',
      descEn: 'Enforcing refusal on personal divorce & legal cases',
    },
    {
      titleAr: 'جلسات تدريب محاكي الداعية',
      titleEn: 'Da\'iyah Simulator Sessions',
      value: '1,420',
      change: '+38%',
      isPositive: true,
      descAr: 'جلسات تدريب حوارية أنجزت مع بطاقات التقييم الثمانية',
      descEn: 'Role-play simulations conducted with complete 8-metric scorecards',
    },
  ];

  const trackDistribution = [
    { nameAr: 'المسلم الجديد', nameEn: 'New Muslim', percent: 38, count: '4,820' },
    { nameAr: 'غير المسلم (باحث عن الحقيقة)', nameEn: 'Non-Muslim Inquirer', percent: 31, count: '3,950' },
    { nameAr: 'المسلم الأصل (ترسيخ وتعميق)', nameEn: 'Born Muslim Deepening', percent: 18, count: '2,310' },
    { nameAr: 'الداعية (محاكي وتأهيل)', nameEn: 'Da\'iyah Trainee', percent: 13, count: '1,640' },
  ];

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

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-700">
            {isAr ? 'محاكاة مؤشرات الأداء التجريبية (Demo KPIs Mode)' : 'Demo KPIs Mode'}
          </span>
        </div>
      </div>

      {/* Main Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{isAr ? 'لوحة المتابعة والمؤشرات (PRD Section 28 & 36)' : 'Impact & KPIs Dashboard'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          {isAr ? 'مؤشرات الأداء وتحكيم الجودة العلمية' : 'Performance Indicators & Scholarly Governance'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          {isAr
            ? 'مصفوفة مؤشرات قياس أثر المنصة ومعدلات إكمال الدروس ونسب الحماية من الفتوى الآلية والتحقق من الموثوقية.'
            : 'Operational metrics measuring journey completion rates, strict fatwa avoidance protocols, and source citation accuracy.'}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="line-clamp-1">{isAr ? kpi.titleAr : kpi.titleEn}</span>
              <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                {kpi.change}
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {kpi.value}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isAr ? kpi.descAr : kpi.descEn}
            </p>
          </div>
        ))}
      </div>

      {/* Track Distribution & Sources Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Track Enrollment */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {isAr ? 'توزيع المستفيدين عبر المسارات الأربعة' : 'Learners by Learning Path'}
            </h3>
            <span className="text-xs text-slate-400 font-mono">Total: 12,720</span>
          </div>

          <div className="space-y-4">
            {trackDistribution.map((t, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{isAr ? t.nameAr : t.nameEn}</span>
                  <span className="text-slate-500">{t.count} ({t.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-slate-900 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${t.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Scientific Package Compliance Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            {isAr ? 'امتثال الحزمة العلمية لتحدي باذل 2026' : 'AI Challenge Compliance Checklist'}
          </h3>

          <div className="space-y-3">
            {[
              {
                titleAr: 'تطبيق مستويات المحتوى الأربعة (أ، ب، ج، د)',
                titleEn: 'Strict 4 Content Levels Enforcement',
                status: 'معتمد ومحكم'
              },
              {
                titleAr: 'منع الاستقلال بالفتوى في الوقائع الشخصية',
                titleEn: 'Autonomous Personal Fatwa Prohibition',
                status: 'حظر تلقائي وإحالة'
              },
              {
                titleAr: 'مقاومة الهلوسة ونفي الأحاديث غير الموثقة',
                titleEn: 'Anti-Hallucination & Hadith Check',
                status: 'فحص عبر الدرر السنية'
              },
              {
                titleAr: 'الترجمة والتوطين بقاموس المصطلحات (ص 8)',
                titleEn: 'Cultural Localization (Tawhid, etc.)',
                status: 'مطابق للقاموس المعتمد'
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800">
                    {isAr ? item.titleAr : item.titleEn}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* User Feedback Ratings Summary (Requirement 2.3) */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-900">
              {isAr ? 'تقييمات جودة إجابات المعلم الذكي (نموذج أولي محفوظ محلياً):' : 'AI Response Helpful Ratings (Local Prototype):'}
            </h4>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col items-center gap-1">
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-lg">{ratings.up}</span>
                <span className="text-[10px] text-slate-500 font-semibold">{isAr ? 'مفيدة (👍)' : 'Helpful'}</span>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex flex-col items-center gap-1">
                <ThumbsDown className="w-4 h-4 text-rose-600" />
                <span className="font-bold text-lg">{ratings.down}</span>
                <span className="text-[10px] text-slate-500 font-semibold">{isAr ? 'غير مفيدة (👎)' : 'Unhelpful'}</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 text-center font-medium">
              {isAr 
                ? `إجمالي المشاركات المقيمة: ${ratings.total} (نسبة الرضا: ${ratings.total > 0 ? Math.round((ratings.up / ratings.total) * 100) : 100}%)`
                : `Total responses rated: ${ratings.total} (Satisfaction: ${ratings.total > 0 ? Math.round((ratings.up / ratings.total) * 100) : 100}%)`
              }
            </div>

            <div className="text-[10px] text-slate-500 text-center font-medium bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              {isAr 
                ? 'تنبيه: التقييمات تُحفظ محلياً على جهاز المستخدم الحالي لأغراض العرض التوضيحي (الديمو). يتضمن المسار المستقبلي للمشروع مزامنة هذه البيانات مركزياً بقاعدة بيانات سحابية موحدة.'
                : 'Note: Ratings are saved locally on this client for demo purposes. Centralized cloud DB sync is scheduled on the future project roadmap.'
              }
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
