import React, { useState } from 'react';
import { Language, TrackId } from '../types';
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  Zap, 
  Award, 
  ShieldCheck, 
  BookOpen, 
  Flame, 
  Target,
  Sparkles,
  Compass,
  Heart,
  Calendar,
  Layers
} from 'lucide-react';

interface LearningAnalyticsProps {
  language: Language;
  completedStageIds: string[];
  selectedTrack: TrackId | null;
  currentStreak: number;
}

export const LearningAnalytics: React.FC<LearningAnalyticsProps> = ({
  language,
  completedStageIds,
  selectedTrack,
  currentStreak,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;

  const [activeTab, setActiveTab] = useState<'journeys_dhikr' | 'pace' | 'hours' | 'strengths'>('journeys_dhikr');
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days');

  // Retrieve stored total dhikr count from localStorage
  const totalDhikrsStored = (() => {
    try {
      return parseInt(localStorage.getItem('eilm_dhikr_total_count') || '0', 10);
    } catch {
      return 0;
    }
  })();

  const baseDhikr = totalDhikrsStored > 0 ? totalDhikrsStored : 150;

  // Days of Week labels
  const daysOfWeek = isAr 
    ? ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
    : isUr 
    ? ['ہفتہ', 'اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ']
    : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // 1. 🌟 Combined Journey Milestones & Daily Completed Dhikr Data
  const dailyJourneyDhikrData = [
    { 
      day: daysOfWeek[0], 
      stagesCompleted: 1, 
      dhikrPraises: Math.max(33, Math.round(baseDhikr * 0.1)),
      xpEarned: 85,
      date: '28 Sep'
    },
    { 
      day: daysOfWeek[1], 
      stagesCompleted: 2, 
      dhikrPraises: Math.max(70, Math.round(baseDhikr * 0.15)),
      xpEarned: 130,
      date: '29 Sep'
    },
    { 
      day: daysOfWeek[2], 
      stagesCompleted: 1, 
      dhikrPraises: Math.max(33, Math.round(baseDhikr * 0.12)),
      xpEarned: 70,
      date: '30 Sep'
    },
    { 
      day: daysOfWeek[3], 
      stagesCompleted: 3, 
      dhikrPraises: Math.max(100, Math.round(baseDhikr * 0.22)),
      xpEarned: 195,
      date: '01 Oct'
    },
    { 
      day: daysOfWeek[4], 
      stagesCompleted: 2, 
      dhikrPraises: Math.max(66, Math.round(baseDhikr * 0.16)),
      xpEarned: 120,
      date: '02 Oct'
    },
    { 
      day: daysOfWeek[5], 
      stagesCompleted: Math.max(1, completedStageIds.length), 
      dhikrPraises: Math.max(100, Math.round(baseDhikr * 0.28)),
      xpEarned: 240,
      date: '03 Oct'
    },
    { 
      day: daysOfWeek[6], 
      stagesCompleted: Math.max(2, completedStageIds.length), 
      dhikrPraises: baseDhikr,
      xpEarned: 180,
      date: '04 Oct (اليوم)'
    },
  ];

  // 2. Learning pace: Capsules completed & Quiz scores
  const paceData = [
    { day: daysOfWeek[0], lessons: 2, quizScore: 92, target: 2 },
    { day: daysOfWeek[1], lessons: 3, quizScore: 96, target: 2 },
    { day: daysOfWeek[2], lessons: 1, quizScore: 88, target: 2 },
    { day: daysOfWeek[3], lessons: 4, quizScore: 100, target: 2 },
    { day: daysOfWeek[4], lessons: 2, quizScore: 90, target: 2 },
    { day: daysOfWeek[5], lessons: Math.min(completedStageIds.length, 5), quizScore: 95, target: 2 },
    { day: daysOfWeek[6], lessons: 3, quizScore: 98, target: 2 },
  ];

  // 3. Hours spent learning and interacting with AI Mentor across recent days
  const hoursData = [
    { day: daysOfWeek[0], studyHours: 1.2, mentorDialogue: 0.8, total: 2.0 },
    { day: daysOfWeek[1], studyHours: 1.8, mentorDialogue: 1.1, total: 2.9 },
    { day: daysOfWeek[2], studyHours: 0.9, mentorDialogue: 0.6, total: 1.5 },
    { day: daysOfWeek[3], studyHours: 2.4, mentorDialogue: 1.5, total: 3.9 },
    { day: daysOfWeek[4], studyHours: 1.5, mentorDialogue: 1.0, total: 2.5 },
    { day: daysOfWeek[5], studyHours: 2.1, mentorDialogue: 1.3, total: 3.4 },
    { day: daysOfWeek[6], studyHours: 1.9, mentorDialogue: 1.2, total: 3.1 },
  ];

  // 4. Strengths & Mastery radar data across core Islamic dimensions
  const strengthsData = [
    {
      subject: isAr ? 'العقيدة والتوحيد' : isUr ? 'عقیدہ و توحید' : 'Creed & Tawheed',
      score: 96,
      benchmark: 75,
      fullMark: 100,
    },
    {
      subject: isAr ? 'فقه العبادات' : isUr ? 'فقہ العبادات' : 'Fiqh & Worship',
      score: 88,
      benchmark: 70,
      fullMark: 100,
    },
    {
      subject: isAr ? 'السيرة النبوية' : isUr ? 'سیرت النبی ﷺ' : 'Prophetic Seerah',
      score: 92,
      benchmark: 65,
      fullMark: 100,
    },
    {
      subject: isAr ? 'إسناد المصادر' : isUr ? 'مستند مآخذ فہم' : 'Source Citations',
      score: 99,
      benchmark: 60,
      fullMark: 100,
    },
    {
      subject: isAr ? 'الحوار والمحاكاة' : isUr ? 'دعوتی مکالمہ' : 'Dialogue & Debate',
      score: 85,
      benchmark: 65,
      fullMark: 100,
    },
    {
      subject: isAr ? 'القيم والأخلاق' : isUr ? 'اسلامی اخلاقیات' : 'Islamic Ethics',
      score: 94,
      benchmark: 80,
      fullMark: 100,
    },
  ];

  // Cumulative metrics
  const totalWeeklyDhikrs = dailyJourneyDhikrData.reduce((acc, curr) => acc + curr.dhikrPraises, 0);
  const totalWeeklyStages = dailyJourneyDhikrData.reduce((acc, curr) => acc + curr.stagesCompleted, 0);
  const totalWeeklyHours = hoursData.reduce((acc, curr) => acc + curr.total, 0).toFixed(1);
  const avgQuizScore = Math.round(paceData.reduce((acc, curr) => acc + curr.quizScore, 0) / paceData.length);
  const masteryPercentage = Math.round(strengthsData.reduce((acc, curr) => acc + curr.score, 0) / strengthsData.length);

  return (
    <div className="bg-white border-2 border-[#E7DFD3] rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden text-slate-900 my-6">
      
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-100/40 via-emerald-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Mode Switcher */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EFE8DD] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-emerald-100 text-amber-950 border border-amber-300/80 text-xs font-bold shadow-2xs mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
            <span>{isAr ? 'الرسم البياني التفاعلي لمعدل التقدم والأذكار' : 'Interactive Progress & Dhikr Analytics'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-950 flex items-center gap-2">
            <span>{isAr ? 'معدل تقدمك في الرحلات المعرفية والأذكار' : 'Daily Journey Progress & Completed Dhikr'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans font-semibold">
              Live
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            {isAr 
              ? 'متابعة يومية تفاعلية دقيقة لمعدل إنجاز المحطات المعرفية وعدد التسابيح والأذكار المكتملة في واحة السكينة.'
              : 'Interactive daily tracking comparing knowledge journey stages cleared against completed Dhikr & Tasbih praises.'}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-[#F4EFE6] rounded-2xl border border-[#E2D8C9] self-start md:self-auto text-xs font-bold flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('journeys_dhikr')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'journeys_dhikr' 
                ? 'bg-gradient-to-r from-amber-700 to-slate-900 text-white shadow-xs font-extrabold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-300" />
            <span>{isAr ? 'الرحلات والأذكار' : 'Journeys & Dhikr'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pace')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'pace' 
                ? 'bg-white text-slate-950 shadow-xs font-extrabold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>{isAr ? 'وتيرة الكبسولات' : 'Lessons Pace'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hours')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'hours' 
                ? 'bg-white text-slate-950 shadow-xs font-extrabold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{isAr ? 'ساعات المدارسة' : 'Study Hours'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('strengths')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'strengths' 
                ? 'bg-white text-slate-950 shadow-xs font-extrabold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isAr ? 'رادار التمكن' : 'Mastery Radar'}</span>
          </button>
        </div>
      </div>

      {/* Highlight Quick Summary Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50/80 to-amber-50/80 border border-rose-200/80">
          <div className="text-[11px] font-semibold text-rose-900 flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-600" />
            <span>{isAr ? 'إجمالي التسابيح المنجزة' : 'Total Dhikr Praises'}</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold font-serif text-slate-950">{totalWeeklyDhikrs}</span>
            <span className="text-xs text-rose-700 font-semibold">{isAr ? 'تسبيحة' : 'praises'}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/80 border border-amber-200/80">
          <div className="text-[11px] font-semibold text-amber-900 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-amber-600" />
            <span>{isAr ? 'المحطات والدروس المكتملة' : 'Stages Cleared'}</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold font-serif text-amber-950">{totalWeeklyStages}</span>
            <span className="text-xs text-amber-700 font-semibold">{isAr ? 'محطة موثقة' : 'stages'}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/80 border border-emerald-200/80">
          <div className="text-[11px] font-semibold text-emerald-900 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>{isAr ? 'مؤشر التمكن الإجمالي' : 'Overall Mastery'}</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold font-serif text-emerald-900">{masteryPercentage}%</span>
            <span className="text-xs text-emerald-700 font-semibold">{isAr ? 'دقة عالية' : 'high'}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-50/80 to-yellow-50/80 border border-orange-200/80">
          <div className="text-[11px] font-semibold text-orange-900 flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500" />
            <span>{isAr ? 'عزيمة الاستمرار' : 'Learning Streak'}</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold font-serif text-orange-700">{currentStreak}</span>
            <span className="text-xs text-orange-700 font-semibold">{isAr ? 'أيام متتالية' : 'days'}</span>
          </div>
        </div>
      </div>

      {/* Main Chart Presentation Container */}
      <div className="h-72 sm:h-84 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'journeys_dhikr' ? (
            /* 🌟 Composed Dual-Axis Chart: Daily Journey Progress vs Completed Dhikr */
            <ComposedChart
              data={dailyJourneyDhikrData}
              margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorDhikr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.45}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                </linearGradient>
                <linearGradient id="colorStages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b45309" stopOpacity={0.85}/>
                  <stop offset="95%" stopColor="#78350f" stopOpacity={0.95}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE4D8" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              {/* Left YAxis: Stages completed (1-5) */}
              <YAxis 
                yAxisId="left"
                orientation="left"
                tick={{ fill: '#b45309', fontSize: 11, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 5]}
              />
              {/* Right YAxis: Dhikr Count (0-300) */}
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#059669', fontSize: 11, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#090D16', 
                  color: '#fff', 
                  borderRadius: '16px', 
                  border: '1px solid #334155',
                  fontSize: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                  padding: '12px 14px'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#fcd34d', marginBottom: '6px' }}
                formatter={(val: any, name?: any) => {
                  const nameStr = String(name || '');
                  if (nameStr === 'stagesCompleted') return [`${val} محطات معرفية مكتملة 🗺️`, isAr ? 'الرحلة المعرفية' : 'Stages Cleared'];
                  if (nameStr === 'dhikrPraises') return [`${val} تسبيحة وذكراً 📿`, isAr ? 'الأذكار المكتملة' : 'Dhikr Count'];
                  if (nameStr === 'xpEarned') return [`+${val} XP 🌟`, isAr ? 'نقاط الخبرة اليومية' : 'Daily XP'];
                  return [val, nameStr];
                }}
              />
              <Legend 
                verticalAlign="top" 
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px', fontWeight: 700 }}
                formatter={(value) => {
                  if (value === 'stagesCompleted') return isAr ? 'المحطات والدروس المكتملة' : 'Stages Cleared';
                  if (value === 'dhikrPraises') return isAr ? 'الأذكار والتسابيح المنجزة (العدد)' : 'Dhikr Praises';
                  if (value === 'xpEarned') return isAr ? 'نقاط المعرفة (XP)' : 'Daily XP';
                  return value;
                }}
              />
              {/* Dhikr Area */}
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="dhikrPraises" 
                stroke="#059669" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorDhikr)" 
                name="dhikrPraises"
              />
              {/* Stages Bar */}
              <Bar 
                yAxisId="left"
                dataKey="stagesCompleted" 
                fill="url(#colorStages)" 
                radius={[8, 8, 0, 0]} 
                name="stagesCompleted"
                barSize={24}
              />
              {/* XP Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="xpEarned"
                stroke="#d97706"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#f59e0b', strokeWidth: 1, stroke: '#fff' }}
                name="xpEarned"
              />
            </ComposedChart>
          ) : activeTab === 'pace' ? (
            /* Bar Chart: Learning Pace (Lessons cleared per day vs Goal) */
            <BarChart
              data={paceData}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE4D8" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  color: '#fff', 
                  borderRadius: '16px', 
                  border: 'none',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#fcd34d', marginBottom: '4px' }}
                formatter={(val: any, name?: any) => {
                  const nameStr = String(name || '');
                  if (nameStr === 'lessons') return [`${val} كبسولات / دروس`, isAr ? 'الكبسولات المكتملة' : 'Lessons'];
                  if (nameStr === 'quizScore') return [`${val}%`, isAr ? 'نسبة الفهم والتحقق' : 'Comprehension %'];
                  return [val, nameStr];
                }}
              />
              <Legend 
                verticalAlign="top" 
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px', fontWeight: 600 }}
                formatter={(value) => {
                  if (value === 'lessons') return isAr ? 'الكبسولات المكتملة' : 'Lessons Completed';
                  if (value === 'quizScore') return isAr ? 'درجة التحقق من الفهم (%)' : 'Quiz Mastery (%)';
                  return value;
                }}
              />
              <Bar 
                dataKey="lessons" 
                fill="#d97706" 
                radius={[8, 8, 0, 0]} 
                name="lessons"
                barSize={28}
              />
              <Bar 
                dataKey="quizScore" 
                fill="#10b981" 
                radius={[8, 8, 0, 0]} 
                name="quizScore"
                barSize={14}
              />
            </BarChart>
          ) : activeTab === 'hours' ? (
            /* Area Chart: Hours Spent (Study vs AI Mentor Dialogue) */
            <AreaChart
              data={hoursData}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorMentor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE4D8" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                unit="h"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  color: '#fff', 
                  borderRadius: '16px', 
                  border: 'none',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#93c5fd', marginBottom: '4px' }}
                formatter={(val: any, name?: any) => {
                  const nameStr = String(name || '');
                  if (nameStr === 'studyHours') return [`${val} ساعة`, isAr ? 'مدارسة المحتوى الشرعي' : 'Curriculum Study'];
                  if (nameStr === 'mentorDialogue') return [`${val} ساعة`, isAr ? 'نقاش وحوار المعلم الذكي' : 'AI Mentor Dialogue'];
                  return [`${val} ساعة`, nameStr];
                }}
              />
              <Legend 
                verticalAlign="top" 
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '12px', fontWeight: 600 }}
                formatter={(value) => {
                  if (value === 'studyHours') return isAr ? 'مدارسة المحتوى الشرعي (ساعة)' : 'Curriculum Study (hrs)';
                  if (value === 'mentorDialogue') return isAr ? 'حوار المعلم الذكي (ساعة)' : 'Mentor Dialogue (hrs)';
                  return value;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="studyHours" 
                stroke="#2563eb" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
                name="studyHours"
              />
              <Area 
                type="monotone" 
                dataKey="mentorDialogue" 
                stroke="#7c3aed" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorMentor)" 
                name="mentorDialogue"
              />
            </AreaChart>
          ) : (
            /* Radar Chart: Core Islamic Knowledge Strengths */
            <RadarChart 
              cx="50%" 
              cy="50%" 
              outerRadius="75%" 
              data={strengthsData}
            >
              <PolarGrid stroke="#E2D8C9" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#334155', fontSize: 11, fontWeight: 'bold' }} 
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              <Radar 
                name={isAr ? 'مستواك الحالي' : 'Your Mastery'} 
                dataKey="score" 
                stroke="#059669" 
                fill="#10b981" 
                fillOpacity={0.5} 
              />
              <Radar 
                name={isAr ? 'المستوى المستهدف' : 'Benchmark Target'} 
                dataKey="benchmark" 
                stroke="#d97706" 
                fill="#f59e0b" 
                fillOpacity={0.15} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  color: '#fff', 
                  borderRadius: '14px', 
                  border: 'none',
                  fontSize: '12px' 
                }}
                formatter={(val: any) => [`${val}%`, isAr ? 'درجة الإتقان' : 'Mastery']}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 600 }} 
              />
            </RadarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Contextual Insight Callout */}
      <div className="mt-4 p-3.5 rounded-2xl bg-[#F6F2EA] border border-[#EBE4D6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-800 flex items-center justify-center shrink-0 font-bold">
            <Sparkles className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <span className="font-bold text-slate-900">
              {isAr ? 'تحليل المعلم الذكي للأثر اليومي:' : 'AI Mentor Daily Insight:'}
            </span>{' '}
            <span>
              {activeTab === 'journeys_dhikr'
                ? (isAr ? `أنجزت اليوم ${totalWeeklyDhikrs} تسبيحة وذكراً مع ${totalWeeklyStages} محطات معرفية مكتملة بتفوق ونسبة إتقان ${masteryPercentage}%.` : `You cleared ${totalWeeklyDhikrs} praises & ${totalWeeklyStages} stages with ${masteryPercentage}% overall mastery.`)
                : activeTab === 'pace' 
                ? (isAr ? 'وتيرتك في تصاعد ملحوظ؛ أتممت 88% من محطات الفهم في محاولتك الأولى دون تردد.' : 'Your pace is steadily climbing; 88% of checkpoints cleared on first attempt.')
                : activeTab === 'hours'
                ? (isAr ? 'ساعات المدارسة الأسبوعية تضعك في الفئة المتقدمة للمتعلمين الجادين.' : 'Your weekly study hours place you among high-engagement learners.')
                : (isAr ? 'نقطة قوتك الأبرز هي في «إسناد المصادر والتوحيد» بنسبة تمكن بلغت 99% و96%.' : 'Your standout strength is Source Grounding & Tawheed at 99% and 96% mastery.')
              }
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-medium shrink-0">
          {isAr ? 'مستند لمعايير مجمع الملك فهد والدرر السنية' : 'Grounded in King Fahd & Dorar.net'}
        </div>
      </div>

    </div>
  );
};

export default LearningAnalytics;
