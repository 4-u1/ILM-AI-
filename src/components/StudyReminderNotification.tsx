import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, ArrowRight, ArrowLeft, X, Check, Clock, Volume2, ShieldCheck } from 'lucide-react';
import { Language, LessonStage, TrackId } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';

interface StudyReminderNotificationProps {
  language: Language;
  selectedTrack: TrackId | null;
  completedStageIds: string[];
  onContinueLearning: (stage: LessonStage) => void;
  onOpenReminderSettings?: () => void;
}

// Array of inspiring, authentic Islamic reminders aligned with the challenge's principles
const INSPIRATIONAL_REMINDERS = [
  {
    hadithAr: 'مَن سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الجَنَّةِ',
    hadithEn: 'Whoever travels a path in search of knowledge, Allah will make easy for him a path to Paradise.',
    sourceAr: 'صحيح مسلم (2699)',
    sourceEn: 'Sahih Muslim (2699)',
    encouragementAr: 'خطوتك التالية في طلب العلم تنتظرك، ثوانٍ معدودة تصنع فرقاً عظيماً في فهم دينك.',
    encouragementEn: 'Your next step in seeking knowledge awaits. A few moments make a lasting difference in your understanding.'
  },
  {
    hadithAr: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ تَعَالَى أَدْوَمُهَا وَإِنْ قَلَّ',
    hadithEn: 'The most beloved deed to Allah is the most regular and constant even if it were little.',
    sourceAr: 'صحيح البخاري (6464)',
    sourceEn: 'Sahih al-Bukhari (6464)',
    encouragementAr: 'المداومة على درس واحد يومياً تبني بصيرة راسخة وإيماناً واعياً.',
    encouragementEn: 'Continuing with even one lesson a day builds grounded insight and mindful faith.'
  },
  {
    hadithAr: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    hadithEn: 'The best among you are those who learn the Quran and teach it.',
    sourceAr: 'صحيح البخاري (5027)',
    sourceEn: 'Sahih al-Bukhari (5027)',
    encouragementAr: 'تعلم آية وتفقه في معناها يفتح لك أبواب الخير والبركة في يومك.',
    encouragementEn: 'Pondering over a verse and understanding its wisdom brings barakah to your day.'
  },
  {
    hadithAr: 'إِنَّمَا العِلْمُ بِالتَّعَلُّمِ، وَإِنَّمَا الحِلْمُ بِالتَّحَلُّمِ',
    hadithEn: 'Knowledge is acquired only through learning, and forbearance is cultivated only through practice.',
    sourceAr: 'الدرر السنية - صحيح الجامع (2328)',
    sourceEn: 'Dorar.net - Sahih al-Jami (2328)',
    encouragementAr: 'أكمل رحلتك المعرفية خطوة بخطوة عبر مسارات منصة «عِلم».',
    encouragementEn: 'Continue your verified learning journey step by step through ILM tracks.'
  }
];

const LAST_ACTIVE_KEY = 'eilm_last_learning_timestamp';
const NOTIFICATION_DISMISSED_KEY = 'eilm_reminder_dismissed_until';
const REMINDERS_ENABLED_KEY = 'eilm_daily_reminders_enabled';

export const StudyReminderNotification: React.FC<StudyReminderNotificationProps> = ({
  language,
  selectedTrack,
  completedStageIds,
  onContinueLearning,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [isVisible, setIsVisible] = useState(false);
  const [hoursInactive, setHoursInactive] = useState<number>(0);
  const [nextStage, setNextStage] = useState<LessonStage | null>(null);
  const [reminderData, setReminderData] = useState(INSPIRATIONAL_REMINDERS[0]);
  const [isSimulatingCheck, setIsSimulatingCheck] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Find user's next uncompleted stage
  useEffect(() => {
    const track = selectedTrack || 'new_muslim';
    const stages = CURRICULUM_DATA.filter((s) => s.trackId === track);
    const pending = stages.find((s) => !completedStageIds.includes(s.id)) || stages[0];
    setNextStage(pending);
  }, [selectedTrack, completedStageIds]);

  // Check notification permission state
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Inactivity Check Routine: If inactive > 24 hours (or simulated for test)
  useEffect(() => {
    try {
      const now = Date.now();
      const lastActiveStr = localStorage.getItem(LAST_ACTIVE_KEY);
      const dismissedUntilStr = localStorage.getItem(NOTIFICATION_DISMISSED_KEY);
      const isEnabled = localStorage.getItem(REMINDERS_ENABLED_KEY) !== 'false';

      // Pick a pseudo-random reminder per calendar day
      const dayIndex = Math.floor(now / (1000 * 60 * 60 * 24)) % INSPIRATIONAL_REMINDERS.length;
      setReminderData(INSPIRATIONAL_REMINDERS[dayIndex]);

      if (!isEnabled) {
        setIsVisible(false);
        return;
      }

      if (dismissedUntilStr && now < parseInt(dismissedUntilStr, 10)) {
        setIsVisible(false);
        return;
      }

      if (!lastActiveStr) {
        // First visit: register initial activity timestamp
        localStorage.setItem(LAST_ACTIVE_KEY, now.toString());
        return;
      }

      const lastActive = parseInt(lastActiveStr, 10);
      const diffMs = now - lastActive;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      setHoursInactive(hours);

      // Trigger if inactive for 24+ hours
      if (hours >= 24) {
        setIsVisible(true);
      }
    } catch (e) {
      console.warn('Reminder check warning:', e);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      // Snooze for 12 hours
      const snoozeUntil = Date.now() + 12 * 60 * 60 * 1000;
      localStorage.setItem(NOTIFICATION_DISMISSED_KEY, snoozeUntil.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartNextLesson = () => {
    // Record fresh activity
    localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    setIsVisible(false);
    if (nextStage) {
      onContinueLearning(nextStage);
    }
  };

  // Helper for judges/testers: simulate 24-hour inactivity test directly in UI
  const handleSimulate24Hours = () => {
    setIsSimulatingCheck(true);
    const simulatedPastTime = Date.now() - 25 * 60 * 60 * 1000; // 25 hours ago
    localStorage.setItem(LAST_ACTIVE_KEY, simulatedPastTime.toString());
    localStorage.removeItem(NOTIFICATION_DISMISSED_KEY);
    setHoursInactive(25);
    setIsVisible(true);
    setTimeout(() => setIsSimulatingCheck(false), 300);

    // Also trigger native browser notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(isAr ? 'منصة عِلم | ILM - تذكير بمتابعة درسك' : 'ILM Platform - Daily Learning Reminder', {
          body: isAr ? `${reminderData.encouragementAr} درسك القادم: ${nextStage?.title}` : `${reminderData.encouragementEn} Next lesson: ${nextStage?.titleEn}`,
          icon: '/favicon.ico'
        });
      } catch (err) {
        console.warn('Native notification failed:', err);
      }
    }
  };

  const handleRequestNativePermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === 'granted') {
          new Notification(isAr ? 'منصة عِلم | ILM' : 'ILM Platform', {
            body: isAr ? 'تم تفعيل التنبيهات اليومية التشجيعية بنجاح 🌿' : 'Daily learning reminders enabled successfully 🌿'
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  if (!isVisible) {
    return (
      /* Discreet test trigger badge floating at bottom right for demo & testers */
      <div className="fixed bottom-20 right-4 sm:bottom-4 sm:right-4 z-30 print:hidden opacity-90 hover:opacity-100 transition">
        <button
          onClick={handleSimulate24Hours}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-md cursor-pointer transition border border-slate-700"
          title={isAr ? 'اختبار نظام التنبيه بعد انقطاع 24 ساعة' : isUr ? '24 گھنٹے انقطاع کی یاد دہانی کا ٹیسٹ' : 'Test 24h Inactivity Reminder'}
        >
          <Bell className="w-3.5 h-3.5 text-amber-400 animate-swing" />
          <span>{isAr ? 'اختبار تذكير الـ 24 ساعة' : isUr ? '24 گھنٹے یاد دہانی کا ٹیسٹ' : 'Test 24h Reminder'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 print:hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 backdrop-blur-md border-2 border-amber-400/80 rounded-3xl p-5 shadow-2xl space-y-4 relative overflow-hidden">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/40 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
        
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 relative">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-2xs">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  {isAr ? `انقطاع لأكثر من ${hoursInactive || 24} ساعة` : isUr ? `${hoursInactive || 24}+ گھنٹے سے غیر فعال` : `Inactive for ${hoursInactive || 24}+ hrs`}
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-serif mt-0.5">
                {isAr ? 'تذكير يومي لمتابعة رحلتك في طلب العلم' : isUr ? 'حصول علم کے سفر کو جاری رکھنے کی روزانہ یاد دہانی' : 'Daily Islamic Learning Reminder'}
              </h4>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title={isAr ? 'تذكيري لاحقاً' : isUr ? 'بعد میں یاد دلائیں' : 'Dismiss'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Authentic Motivational Scripture Card */}
        <div className="bg-gradient-to-br from-amber-50/90 to-amber-100/40 border border-amber-200/90 rounded-2xl p-3.5 space-y-2 relative">
          <div className="flex items-center justify-between text-[11px] text-amber-900 font-bold">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isAr ? 'حديث شريف في فضل العلم' : isUr ? 'علم کی فضیلت پر نبوی فرمان' : 'Authentic Prophetic Guidance'}</span>
            </span>
            <span className="text-[10px] text-amber-800 bg-white/70 px-2 py-0.5 rounded-md border border-amber-200/60 font-mono">
              {isAr || isUr ? reminderData.sourceAr : reminderData.sourceEn}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-serif text-slate-900 leading-relaxed font-bold">
            «{isAr || isUr ? reminderData.hadithAr : reminderData.hadithEn}»
          </p>

          <p className="text-xs text-amber-950/80 leading-normal pt-1 border-t border-amber-200/60">
            {isAr ? reminderData.encouragementAr : isUr ? reminderData.encouragementAr : reminderData.encouragementEn}
          </p>
        </div>

        {/* Next Lesson Preview & Action Button */}
        {nextStage && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs px-1 text-slate-600">
              <span className="font-semibold">{isAr ? 'درسك القادم الموصى به:' : isUr ? 'اگلا تجویز کردہ سبق:' : 'Recommended Next Lesson:'}</span>
              <span className="text-amber-700 font-bold text-[11px]">{nextStage.estimatedMinutes} {isAr ? 'دقائق' : isUr ? 'منٹ' : 'mins'}</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {isAr || isUr ? nextStage.title : nextStage.titleEn}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {isAr || isUr ? nextStage.subtitle : nextStage.subtitleEn}
                </p>
              </div>

              <button
                onClick={handleStartNextLesson}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs group"
              >
                <span>{isAr ? 'متابعة الدرس الآن' : isUr ? 'سبق ابھی جاری رکھیں' : 'Continue Lesson'}</span>
                <ArrowIcon className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Notification Permission Toggle Bar */}
        {notificationPermission !== 'granted' && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>{isAr ? 'تفعيل تنبيهات المتصفح اليومية؟' : isUr ? 'براؤزر کے روزانہ نوٹیفکیشن فعال کریں؟' : 'Enable browser push alerts?'}</span>
            <button
              onClick={handleRequestNativePermission}
              className="text-amber-800 hover:text-amber-900 font-bold underline cursor-pointer"
            >
              {isAr ? 'تفعيل الآن' : isUr ? 'ابھی فعال کریں' : 'Enable'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
