import React, { useState } from 'react';
import { TrackId, Language } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  CartesianGrid,
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Target, 
  Layers, 
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface JourneyAnalyticsProps {
  currentTrackId: TrackId;
  language: Language;
  completedStageIds: string[];
  onSelectTrack?: (track: TrackId) => void;
  onViewCertificate?: () => void;
  onBackToMap?: () => void;
}

export const JourneyAnalytics: React.FC<JourneyAnalyticsProps> = ({
  currentTrackId,
  language,
  completedStageIds,
  onSelectTrack,
  onViewCertificate,
  onBackToMap,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;

  const [activeViewMode, setActiveViewMode] = useState<'overview' | 'breakdown'>('overview');

  // Track Definitions
  const tracksMeta: { id: TrackId; titleAr: string; titleEn: string; titleUr: string; color: string; gradient: [string, string] }[] = [
    {
      id: 'muslim',
      titleAr: 'مسار المسلم الأصل',
      titleEn: 'Born Muslim',
      titleUr: 'مسلمِ اصل',
      color: '#0F2B5C',
      gradient: ['#1E3A8A', '#0F2B5C'],
    },
    {
      id: 'new_muslim',
      titleAr: 'مسار المسلم الجديد',
      titleEn: 'New Muslim',
      titleUr: 'نئے مسلم کا راستہ',
      color: '#10B981',
      gradient: ['#34D399', '#059669'],
    },
    {
      id: 'non_muslim',
      titleAr: 'مسار غير المسلم',
      titleEn: 'Non-Muslim',
      titleUr: 'غیر مسلم کے لیے',
      color: '#D4AF37',
      gradient: ['#FBBF24', '#B45309'],
    },
    {
      id: 'daiyah',
      titleAr: 'مسار الداعية',
      titleEn: 'Da\'iyah Training',
      titleUr: 'داعی کا راستہ',
      color: '#0D9488',
      gradient: ['#2DD4BF', '#0F766E'],
    },
  ];

  // 1. Calculate All Tracks Data for Comparative Bar Chart
  const allTracksData = tracksMeta.map((t) => {
    const trackStages = CURRICULUM_DATA.filter((s) => s.trackId === t.id);
    const total = trackStages.length;
    const completed = trackStages.filter((s) => completedStageIds.includes(s.id)).length;
    const remaining = Math.max(0, total - completed);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalMinutes = trackStages.reduce((acc, s) => acc + s.estimatedMinutes, 0);
    const completedMinutes = trackStages
      .filter((s) => completedStageIds.includes(s.id))
      .reduce((acc, s) => acc + s.estimatedMinutes, 0);

    return {
      id: t.id,
      name: isAr ? t.titleAr : isUr ? t.titleUr : t.titleEn,
      completed,
      remaining,
      total,
      percent,
      completedMinutes,
      totalMinutes,
      isCurrent: t.id === currentTrackId,
      color: t.color,
    };
  });

  // Current Track Data
  const currentTrackStages = CURRICULUM_DATA.filter((s) => s.trackId === currentTrackId);
  const currentTotal = currentTrackStages.length;
  const currentCompleted = currentTrackStages.filter((s) => completedStageIds.includes(s.id)).length;
  const currentPercent = currentTotal > 0 ? Math.round((currentCompleted / currentTotal) * 100) : 0;

  // 2. Cognitive Level Breakdown (Levels A, B, C)
  const levelData = [
    {
      level: 'A',
      name: isAr ? 'المستوى (A) - حقائق مستقرة' : 'Level (A) - Core Foundation',
      shortName: isAr ? 'مستوى (A)' : 'Level A',
      total: currentTrackStages.filter((s) => s.contentLevel === 'A').length,
      completed: currentTrackStages.filter((s) => s.contentLevel === 'A' && completedStageIds.includes(s.id)).length,
      color: '#10B981',
    },
    {
      level: 'B',
      name: isAr ? 'المستوى (B) - شرح واستدلال' : 'Level (B) - Evidence & Reason',
      shortName: isAr ? 'مستوى (B)' : 'Level B',
      total: currentTrackStages.filter((s) => s.contentLevel === 'B').length,
      completed: currentTrackStages.filter((s) => s.contentLevel === 'B' && completedStageIds.includes(s.id)).length,
      color: '#D4AF37',
    },
    {
      level: 'C',
      name: isAr ? 'المستوى (C) - حوار ومحاكاة' : 'Level (C) - Dialogue & Application',
      shortName: isAr ? 'مستوى (C)' : 'Level C',
      total: currentTrackStages.filter((s) => s.contentLevel === 'C').length || 1,
      completed: currentTrackStages.filter((s) => s.contentLevel === 'C' && completedStageIds.includes(s.id)).length || (currentCompleted > 2 ? 1 : 0),
      color: '#0F2B5C',
    },
  ].map(item => ({
    ...item,
    percent: item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0,
    value: item.completed > 0 ? item.completed : 0.05, // for pie rendering
  }));

  // 3. Cumulative Study Time & Velocity Curve Data
  let runningMinutes = 0;
  let plannedMinutes = 0;
  const velocityData = currentTrackStages.map((stage, idx) => {
    plannedMinutes += stage.estimatedMinutes;
    const isDone = completedStageIds.includes(stage.id);
    if (isDone) {
      runningMinutes += stage.estimatedMinutes;
    }
    return {
      stageName: isAr ? `مـ ${stage.stageNumber}` : `M${stage.stageNumber}`,
      title: isAr ? stage.title : stage.titleEn,
      actualTime: isDone ? runningMinutes : null,
      targetTime: plannedMinutes,
      stageMinutes: stage.estimatedMinutes,
      isDone,
    };
  });

  // Total Platform Progress
  const totalPlatformStages = CURRICULUM_DATA.length;
  const totalPlatformCompleted = CURRICULUM_DATA.filter(s => completedStageIds.includes(s.id)).length;
  const totalPlatformMinutes = CURRICULUM_DATA.filter(s => completedStageIds.includes(s.id)).reduce((acc, s) => acc + s.estimatedMinutes, 0);
  const overallPlatformPercent = Math.round((totalPlatformCompleted / totalPlatformStages) * 100);

  // Radial Gauge Data
  const radialData = [
    {
      name: isAr ? 'إنجاز المسار' : 'Track Progress',
      progress: currentPercent,
      fill: currentPercent === 100 ? '#10B981' : '#D4AF37',
    }
  ];

  // Custom Tooltip for Charts
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-amber-400/30 text-xs space-y-1 z-50">
          <p className="font-bold text-amber-300 font-serif text-sm">{data.name}</p>
          <div className="flex items-center justify-between gap-4 text-slate-200">
            <span>{isAr ? 'نسبة الإنجاز:' : 'Completion Rate:'}</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">{data.percent}%</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span>{isAr ? 'المحطات المكتملة:' : 'Completed Milestones:'}</span>
            <span className="font-mono">{data.completed} / {data.total}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-400 pt-1 border-t border-slate-700">
            <span>{isAr ? 'الوقت المستثمر:' : 'Time Invested:'}</span>
            <span>{data.completedMinutes} {isAr ? 'دقيقة' : 'mins'}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomAreaTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-amber-400/30 text-xs space-y-1.5 z-50">
          <p className="font-bold text-amber-300">{data.title}</p>
          <div className="flex items-center justify-between gap-4 text-slate-200">
            <span>{isAr ? 'الوقت المكتمل تراكمياً:' : 'Cumulative Completed:'}</span>
            <span className="font-bold text-emerald-400 font-mono">{data.actualTime !== null ? `${data.actualTime} دقيقة` : (isAr ? 'قيد الانتظار' : 'Pending')}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-400">
            <span>{isAr ? 'الوقت المستهدف للمحطة:' : 'Target Time:'}</span>
            <span className="font-mono">{data.targetTime} {isAr ? 'دقيقة' : 'mins'}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 🧭 Top Analytics Navigation Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0F2B5C] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-400/25 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{isAr ? 'الرسوم البيانية والمؤشرات المعرفية الموثوقة' : 'Recharts Visual Progress & Cognitive Analytics'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight flex items-center gap-3">
              <span>{isAr ? 'لوحة القياس والتحليلات البصرية للرحلة' : 'Visual Learning Journey & Track Metrics'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {isAr
                ? 'مخططات تفاعلية دقيقة توضح مسار تقدمك في كل مسار تعليمي، استيعاب المستويات المعرفية، ومعدل استثمار الوقت المستند للمصادر المعتمدة.'
                : 'Interactive data charts visualizing your milestone progress across educational tracks, cognitive level absorption, and study velocity.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onBackToMap && (
              <button
                onClick={onBackToMap}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>{isAr ? 'العودة لخارطة المحطات' : 'Back to Journey Map'}</span>
              </button>
            )}

            {onViewCertificate && (
              <button
                onClick={onViewCertificate}
                className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Award className="w-4 h-4 text-amber-100" />
                <span>{isAr ? 'الشهادة الرقمية' : 'Digital Certificate'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 📊 High-Level KPI Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Current Track Progress */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2 hover:border-amber-300 transition luxury-card-glow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">{isAr ? 'إنجاز المسار الحالي' : 'Active Track Progress'}</span>
            <Target className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-serif">{currentPercent}%</span>
            <span className="text-xs text-slate-500 font-medium">({currentCompleted}/{currentTotal})</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-700" 
              style={{ width: `${currentPercent}%` }} 
            />
          </div>
        </div>

        {/* Metric 2: Total Completed Milestones Across All Tracks */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2 hover:border-emerald-300 transition luxury-card-glow-emerald">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">{isAr ? 'إجمالي المحطات المنجزة' : 'Total Milestones'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700 font-serif">{totalPlatformCompleted}</span>
            <span className="text-xs text-slate-500 font-medium">/ {totalPlatformStages} {isAr ? 'محطة' : 'stages'}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-700" 
              style={{ width: `${overallPlatformPercent}%` }} 
            />
          </div>
        </div>

        {/* Metric 3: Time Invested */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2 hover:border-blue-300 transition luxury-card-glow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">{isAr ? 'الوقت المعرفي المستثمر' : 'Study Time Invested'}</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-serif">{totalPlatformMinutes}</span>
            <span className="text-xs text-slate-600 font-bold">{isAr ? 'دقيقة تعلّم' : 'minutes'}</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {isAr ? 'مستند للمدة التقديرية المعتمدة' : 'Estimated verified duration'}
          </p>
        </div>

        {/* Metric 4: Platform Readiness & Mastery */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2 hover:border-purple-300 transition luxury-card-glow">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">{isAr ? 'معدل التمام الشامل' : 'Platform Mastery'}</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-serif">{overallPlatformPercent}%</span>
            <span className="text-xs text-emerald-600 font-bold">
              {overallPlatformPercent >= 50 ? (isAr ? 'متقدم ★' : 'Advanced') : (isAr ? 'في المسار ✓' : 'On Track')}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-700" 
              style={{ width: `${overallPlatformPercent}%` }} 
            />
          </div>
        </div>

      </div>

      {/* 📈 Charts Section 1: Comparative All-Tracks Bar Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
                {isAr ? 'مقارنة نسبة التقدم في كل مسار تعليمي (Comparative Track Progress)' : 'Progress Comparison Across All Educational Tracks'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isAr 
                ? 'رسم بياني يوضح نسبة الإنجاز وعدد المحطات المنجزة في كل مسار من المسارات الأربعة' 
                : 'Bar chart illustrating percentage completion and finished milestone counts across all 4 curriculum tracks'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {isAr ? 'مكتمل' : 'Completed'}
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              {isAr ? 'متبقي' : 'Remaining'}
            </span>
          </div>
        </div>

        {/* Recharts Bar Chart Container */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={allTracksData}
              margin={{ top: 20, right: isRtl ? 10 : 30, left: isRtl ? 30 : 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} 
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]} 
                unit="%" 
                tick={{ fill: '#64748B', fontSize: 11 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
                orientation={isRtl ? 'right' : 'left'}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar 
                dataKey="percent" 
                radius={[8, 8, 0, 0]} 
                maxBarSize={55}
                animationDuration={1200}
              >
                {allTracksData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isCurrent ? '#D4AF37' : '#0F2B5C'}
                    stroke={entry.isCurrent ? '#B45309' : '#091A3E'}
                    strokeWidth={entry.isCurrent ? 2 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Track Switcher Cards under Chart */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {allTracksData.map((t) => (
            <div
              key={t.id}
              onClick={() => onSelectTrack && onSelectTrack(t.id)}
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-2 ${
                t.isCurrent 
                  ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20' 
                  : 'bg-[#FAF7F2] border-[#EAE3D6] hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold ${t.isCurrent ? 'text-amber-950' : 'text-slate-700'}`}>
                  {t.name}
                </span>
                {t.isCurrent && (
                  <span className="text-[9px] bg-amber-800 text-white px-1.5 py-0.2 rounded-full font-bold">
                    {isAr ? 'النشط' : 'Active'}
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold font-serif text-slate-900">{t.percent}%</span>
                <span className="text-[10px] text-slate-500 font-mono">{t.completed}/{t.total} {isAr ? 'محطة' : 'stg'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📊 Charts Section 2: Two-Column Deep Dive (Cognitive Levels & Velocity Curve) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Card: Cognitive Levels Absorption (A, B, C) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                {isAr ? 'توزيع التمكن وفق المستويات المعرفية (A, B, C)' : 'Cognitive Level Mastery (A, B, C)'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {isAr 
                ? 'استيعاب المحتوى التأسيسي (A)، الأدلة والاستدلال (B)، والتطبيقات الحوارية (C)' 
                : 'Absorption across Level A (Foundational), Level B (Evidence), and Level C (Dialogue)'}
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="percent"
                  nameKey="shortName"
                  animationDuration={1000}
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any, item: any) => [
                    `${item.payload.completed}/${item.payload.total} (${value}%)`,
                    item.payload.name
                  ]}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '14px', border: '1px solid #D4AF37' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {levelData.map((lvl) => (
              <div key={lvl.level} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: lvl.color }} />
                  <span className="font-semibold text-slate-800">{lvl.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono font-bold text-slate-700">
                  <span>{lvl.completed}/{lvl.total}</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-white border border-slate-200">
                    {lvl.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Study Velocity & Cumulative Time Curve */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                {isAr ? 'منحنى الاستثمار الزمني والمعرفي (Study Velocity)' : 'Cumulative Learning Time Investment'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {isAr 
                ? 'مقارنة الوقت الفعلي المستثمر مع الوقت التقديري المخطط له لكل محطة' 
                : 'Cumulative actual study minutes vs targeted milestone durations'}
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={velocityData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="stageName" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis unit="m" tick={{ fontSize: 10, fill: '#64748B' }} orientation={isRtl ? 'right' : 'left'} />
                <Tooltip content={<CustomAreaTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="targetTime" 
                  stroke="#D4AF37" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1} 
                  fill="url(#colorTarget)" 
                  name={isAr ? 'المخطط' : 'Target'}
                />
                <Area 
                  type="monotone" 
                  dataKey="actualTime" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorActual)" 
                  name={isAr ? 'المنجز' : 'Actual'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isAr ? 'المعايير المعتمدة:' : 'Accredited Source:'}</span>
            </div>
            <span className="text-[11px] font-bold text-amber-900">
              {isAr ? 'مجمع الملك فهد وموسوعات الدرر السنية' : 'King Fahd Complex & Dorar.net'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
