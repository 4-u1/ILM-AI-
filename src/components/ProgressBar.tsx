import React from 'react';
import { Language } from '../types';
import { Sparkles, Trophy, CheckCircle2 } from 'lucide-react';

interface ProgressBarProps {
  completedCount: number;
  totalStages: number;
  progressPercent: number;
  language: Language;
  trackName: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  completedCount,
  totalStages,
  progressPercent,
  language,
  trackName,
}) => {
  const isAr = language === 'ar';

  // Dynamic personalized motivational messages explicitly referencing the track and progress percentage
  const getMotivationalMessage = () => {
    if (progressPercent === 100) {
      return isAr
        ? `ما شاء الله تبارك الله! أتممت ${trackName} بنجاح تام، هنيئاً لك هذا الأجر والعلم.`
        : `Masha'Allah! You have successfully completed the ${trackName}. Congratulations on this achievement!`;
    }
    if (progressPercent >= 75) {
      return isAr
        ? `أنت على بُعد خطوات يسيرة من إتمام ${trackName} وإصدار شهادتك المعتمدة، همتك!`
        : `You are only a few steps away from completing the ${trackName} and earning your certificate!`;
    }
    if (progressPercent >= 50) {
      return isAr
        ? `لقد قطعت نصف الطريق في ${trackName}، استمر بثبات!`
        : `You are halfway through the ${trackName}, keep going strong!`;
    }
    if (progressPercent > 0) {
      return isAr
        ? `أحسنت! قطعت خطوتك الأولى في ${trackName}، واستمرارك مفتاح رسوخ العلم.`
        : `Well done! You completed your first milestone in the ${trackName}. Steadfastness unlocks knowledge.`;
    }
    return isAr
      ? `ابدأ محطتك الأولى الآن في ${trackName}، رحلة مباركة تبدأ بخطوة.`
      : `Begin your first milestone in the ${trackName} today; every blessed journey starts with a single step.`;
  };

  return (
    <div className="bg-[#FFFDFB] rounded-2xl p-5 sm:p-6 border border-[#EAE3D6] shadow-2xs mb-8 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {progressPercent === 100 ? (
              <Trophy className="w-4 h-4 text-amber-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {isAr ? 'تقدمك في المسار الحالي' : 'Current Path Progress'}
              </span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {completedCount} / {totalStages} {isAr ? 'محطات منجزة' : 'stages'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {getMotivationalMessage()}
            </p>
          </div>
        </div>

        {/* Large Percentage Badge */}
        <div className="flex items-baseline gap-1 self-start sm:self-center">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
            {progressPercent}
          </span>
          <span className="text-sm font-bold text-slate-400">%</span>
        </div>
      </div>

      {/* Dynamic Motivational Banner beside / above the Progress Bar */}
      <div className="mb-3.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-center gap-2.5 text-xs sm:text-sm text-amber-950 font-medium">
        <span className="text-base shrink-0">✨</span>
        <span className="leading-relaxed">
          {getMotivationalMessage()}
        </span>
      </div>

      {/* Progress Track Bar */}
      <div className="relative w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
        <div
          className="bg-linear-to-r from-slate-900 via-slate-800 to-amber-700 h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Visual Stepper Indicators */}
      <div className="grid grid-cols-6 gap-1.5 mt-3 pt-2">
        {Array.from({ length: totalStages }).map((_, idx) => {
          const isDone = idx < completedCount;
          const isCurrent = idx === completedCount;
          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={`w-full h-1 rounded-full transition-colors ${
                  isDone
                    ? 'bg-emerald-600'
                    : isCurrent
                    ? 'bg-slate-900 animate-pulse'
                    : 'bg-slate-200'
                }`}
              ></div>
              <span
                className={`text-[10px] font-semibold ${
                  isDone
                    ? 'text-emerald-700'
                    : isCurrent
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-400'
                }`}
              >
                {isAr ? `م ${idx + 1}` : `S${idx + 1}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
