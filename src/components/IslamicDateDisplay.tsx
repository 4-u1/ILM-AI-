import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Moon, Calendar, ChevronRight, ChevronLeft, Sparkles, RefreshCw, Info } from 'lucide-react';

interface IslamicDateDisplayProps {
  language: Language;
  variant?: 'navbar' | 'card' | 'compact';
  className?: string;
}

export const IslamicDateDisplay: React.FC<IslamicDateDisplayProps> = ({
  language,
  variant = 'navbar',
  className = '',
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';

  // State for user moon sighting offset (-2, -1, 0, +1, +2)
  const [offsetDays, setOffsetDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ilm_hijri_offset');
      return saved !== null ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [showAdjustModal, setShowAdjustModal] = useState<boolean>(false);

  // Compute active date with offset
  const today = new Date();
  const adjustedDate = new Date(today);
  adjustedDate.setDate(today.getDate() + offsetDays);

  const handleAdjust = (delta: number) => {
    const nextOffset = Math.max(-2, Math.min(2, offsetDays + delta));
    setOffsetDays(nextOffset);
    try {
      localStorage.setItem('ilm_hijri_offset', nextOffset.toString());
    } catch {
      // ignore
    }
  };

  const handleResetOffset = () => {
    setOffsetDays(0);
    try {
      localStorage.removeItem('ilm_hijri_offset');
    } catch {
      // ignore
    }
  };

  // Format dates using Intl with Um Al-Qura calendar
  const getLocaleForLang = (withCalendar = false): string => {
    const calSuffix = withCalendar ? '-u-ca-islamic-umalqura' : '';
    switch (language) {
      case 'ar':
        return `ar-SA${calSuffix}`;
      case 'ur':
        return `ur-PK${calSuffix}`;
      case 'fr':
        return `fr-FR${calSuffix}`;
      case 'es':
        return `es-ES${calSuffix}`;
      case 'id':
        return `id-ID${calSuffix}`;
      case 'en':
      default:
        return `en-US${calSuffix}`;
    }
  };

  const getHijriDate = (): string => {
    try {
      const locale = getLocaleForLang(true);
      return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(adjustedDate);
    } catch {
      return isAr ? '١٥ ربيع الآخر ١٤٤٨ هـ' : '15 Rabi II 1448 AH';
    }
  };

  const getWeekday = (): string => {
    try {
      const locale = getLocaleForLang(false);
      return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(adjustedDate);
    } catch {
      return isAr ? 'اليوم' : 'Today';
    }
  };

  const getGregorianDate = (): string => {
    try {
      const locale = getLocaleForLang(false);
      const formatted = new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: isAr || isUr ? 'long' : 'short',
        year: 'numeric',
      }).format(today);
      return isAr ? `${formatted} م` : isUr ? `${formatted}ء` : `${formatted} CE`;
    } catch {
      return isAr ? '٢٦ سبتمبر ٢٠٢٦ م' : 'Sep 26, 2026 CE';
    }
  };

  // Detect Islamic special occasions or cultural reminders (e.g., Ayyam al-Beed, Friday)
  const getSpecialDayNote = (): { title: string; badge: string } | null => {
    const dayOfWeek = today.getDay(); // 5 = Friday
    
    // Check if Friday
    if (dayOfWeek === 5) {
      return {
        title: isAr
          ? 'يوم الجمعة المبارك: خير يوم طلعت عليه الشمس، أكثروا فيه من الصلاة على النبي ﷺ وقراءة سورة الكهف'
          : isUr
          ? 'جمعۃ المبارک: درود شریف اور سورہ کہف کی تلاوت کا خاص اہتمام فرمائیں'
          : 'Blessed Friday: Send abundant blessings upon the Prophet ﷺ and recite Surah Al-Kahf',
        badge: isAr ? 'يوم الجمعة المبارك' : isUr ? 'جمعۃ المبارک' : 'Blessed Friday',
      };
    }

    // Check for Monday / Thursday sunnah fast
    if (dayOfWeek === 1 || dayOfWeek === 4) {
      return {
        title: isAr
          ? 'سنة مؤكدة: تعرض فيه الأعمال على الله، ويستحب صيامه'
          : isUr
          ? 'سنت نبوی: اعمال کی پیشی کا دن، روزہ رکھنا مستحب ہے'
          : 'Sunnah: Deeds are presented to Allah; fasting is recommended',
        badge: isAr ? 'يوم تعرض فيه الأعمال' : isUr ? 'سنت روزہ' : 'Sunnah Day',
      };
    }

    return null;
  };

  const specialDay = getSpecialDayNote();
  const hijriStr = getHijriDate();
  const gregStr = getGregorianDate();
  const weekdayStr = getWeekday();

  // Variant: Top Navbar Pill (Desktop and headers)
  if (variant === 'navbar') {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <div 
          onClick={() => setShowAdjustModal(!showAdjustModal)}
          className="group flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#F4EFEA]/80 hover:bg-[#EFE8DE] border border-[#E4DCD0] text-slate-800 text-xs font-medium cursor-pointer transition shadow-2xs select-none"
          title={
            isAr
              ? 'التقويم الهجري المعتمد (أم القرى) والميلادي - اضغط لتعديل الرؤية ±١ يوم'
              : isUr
              ? 'ہجری اور عیسوی تاریخ - رویت ہلال ایڈجسٹمنٹ کے لیے کلک کریں'
              : 'Hijri & Gregorian Calendar (Umm al-Qura) - Click to adjust moon sighting'
          }
        >
          {/* Hijri date section */}
          <div className="flex items-center gap-1.5 text-amber-950 font-bold">
            <span className="p-1 rounded-md bg-amber-100/90 text-amber-900 flex items-center justify-center">
              <Moon className="w-3.5 h-3.5 fill-amber-700/20 text-amber-800" />
            </span>
            <span className="font-serif tracking-tight">{weekdayStr}، {hijriStr}</span>
            {offsetDays !== 0 && (
              <span className="text-[10px] px-1 py-0.2 rounded bg-amber-200/80 text-amber-900 font-mono">
                {offsetDays > 0 ? `+${offsetDays}` : offsetDays}
              </span>
            )}
          </div>

          <span className="text-slate-300 font-light select-none">|</span>

          {/* Gregorian date section */}
          <div className="flex items-center gap-1.5 text-slate-600 font-normal">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span className="text-[11px]">{gregStr}</span>
          </div>

          {/* Subtly indicate adjustment ability */}
          <span className="hidden lg:inline-block text-[10px] text-slate-400 group-hover:text-slate-600">
            {isAr ? 'تقويم أم القرى' : isUr ? 'ام القریٰ' : 'Umm al-Qura'}
          </span>
        </div>

        {/* Moon sighting adjustment dropdown modal */}
        {showAdjustModal && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowAdjustModal(false)}
            />
            <div className="absolute top-full start-0 mt-2 z-50 w-72 p-4 rounded-2xl bg-[#FFFDFB] border border-[#EAE3D6] shadow-xl text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-amber-700" />
                  <span>{isAr ? 'ضبط تقويم الرؤية المحلية' : isUr ? 'رویت ہلال کے مطابق ہجری تاریخ' : 'Moon Sighting Adjustment'}</span>
                </div>
                <button
                  onClick={() => setShowAdjustModal(false)}
                  className="text-slate-400 hover:text-slate-700 p-0.5"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                {isAr
                  ? 'يعتمد النظام تقويم أم القرى رسمياً. يمكنك تقديم أو تأخير التاريخ بيوم حسب ثبوت الرؤية في بلدك:'
                  : isUr
                  ? 'پلیٹ فارم تقویم ام القریٰ کو بطور معیار استعمال کرتا ہے۔ اپنے ملک کی رویت ہلال کے مطابق تاریخ میں 1 دن کا فرق کر سکتے ہیں:'
                  : 'Based on the official Umm al-Qura calendar. Adjust by ±1 day if your local moon sighting differs:'}
              </p>

              <div className="flex items-center justify-center gap-3 py-1">
                <button
                  onClick={() => handleAdjust(-1)}
                  disabled={offsetDays <= -2}
                  className="px-2.5 py-1.5 rounded-lg border border-[#EAE3D6] bg-[#F7F3EC] hover:bg-[#EFE8DE] disabled:opacity-40 font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>{isAr ? '- يوم' : '- 1 Day'}</span>
                </button>

                <span className="font-mono font-bold text-sm text-amber-900 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                  {offsetDays === 0 ? (isAr ? 'المطابق' : 'Exact') : offsetDays > 0 ? `+${offsetDays}` : offsetDays}
                </span>

                <button
                  onClick={() => handleAdjust(1)}
                  disabled={offsetDays >= 2}
                  className="px-2.5 py-1.5 rounded-lg border border-[#EAE3D6] bg-[#F7F3EC] hover:bg-[#EFE8DE] disabled:opacity-40 font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <span>{isAr ? '+ يوم' : '+ 1 Day'}</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {offsetDays !== 0 && (
                <button
                  onClick={handleResetOffset}
                  className="w-full text-center text-[10px] text-amber-800 hover:underline pt-1 cursor-pointer flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isAr ? 'إعادة ضبط إلى تقويم أم القرى' : isUr ? 'ام القریٰ پر بحال کریں' : 'Reset to Umm al-Qura'}</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Variant: Compact for Mobile headers
  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-between px-3 py-2 rounded-xl bg-[#F7F3EC] border border-[#EAE3D6] text-xs ${className}`}>
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-amber-800 shrink-0" />
          <div className="flex flex-col">
            <span className="font-serif font-bold text-slate-900 leading-tight">
              {weekdayStr}، {hijriStr}
            </span>
            <span className="text-[10px] text-slate-500 font-sans leading-tight">
              {gregStr}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowAdjustModal(true)}
          className="text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-1 rounded-lg border border-amber-200/80 cursor-pointer"
        >
          {offsetDays === 0 ? (isAr ? 'أم القرى' : 'Umm al-Qura') : `${offsetDays > 0 ? `+${offsetDays}` : offsetDays}`}
        </button>
      </div>
    );
  }

  // Variant: Rich Card for Knowledge Dashboard / Home
  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-[#FFFDFB] border border-[#EAE3D6] shadow-2xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 shadow-2xs">
            <Moon className="w-5 h-5 fill-amber-700/20 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                {isAr ? 'التقويم الهجري المعتمد' : isUr ? 'مستند ہجری تاریخ' : 'Official Islamic Calendar'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {isAr ? 'تقويم أم القرى' : isUr ? 'تقویم ام القریٰ' : 'Umm al-Qura'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif mt-0.5">
              {weekdayStr}، {hijriStr}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#EAE3D6]">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-600">{gregStr}</span>
        </div>
      </div>

      {specialDay && (
        <div className="mt-3 pt-3 border-t border-[#EAE3D6]/70 flex items-start gap-2 text-xs text-amber-950 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold me-1">[{specialDay.badge}]:</span>
            <span>{specialDay.title}</span>
          </div>
        </div>
      )}
    </div>
  );
};
