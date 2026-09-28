import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Clock, 
  ShieldCheck, 
  Flame, 
  Compass, 
  BookOpen, 
  Sun, 
  Volume2, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Language, LessonStage, TrackId } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';

interface StudyReminderNotificationProps {
  language: Language;
  selectedTrack: TrackId | null;
  completedStageIds: string[];
  onContinueLearning: (stage: LessonStage) => void;
  onOpenReminderSettings?: () => void;
}

// Track-specific tailored encouraging messages and contexts
interface TrackEncouragement {
  trackTitleAr: string;
  trackTitleEn: string;
  trackTitleUr: string;
  headerAr: string;
  headerEn: string;
  headerUr: string;
  messageAr: string;
  messageEn: string;
  messageUr: string;
  hadithAr: string;
  hadithEn: string;
  sourceAr: string;
  sourceEn: string;
  actionTextAr: string;
  actionTextEn: string;
  actionTextUr: string;
  accentBg: string;
  accentText: string;
  icon: any;
}

const TRACK_NOTIFICATIONS: Record<TrackId, TrackEncouragement> = {
  non_muslim: {
    trackTitleAr: 'مسار غير المسلم (الباحث عن الحقيقة)',
    trackTitleEn: 'Inquirer Path',
    trackTitleUr: 'متلاشی حق کا راستہ',
    headerAr: 'أسئلتك وبحثك عن الحقيقة في انتظارك',
    headerEn: 'Your search for truth and clarity awaits',
    headerUr: 'حق کی تلاش اور فہم کا سفر آپ کا منتظر ہے',
    messageAr: 'مرحباً بك مجدداً.. بيئة الحوار الهادئة ترحب بأسئلتك وتساؤلاتك الوجودية بكل حرية وموضوعية دون أي تعصب.',
    messageEn: 'Welcome back. Our peaceful and respectful dialogue environment is always ready for your sincere inquiries without bias.',
    messageUr: 'خوش آمدید.. پرسکون اور غیر جانبدار مکالمے کا ماحول آپ کے وجودی سوالات اور تلاشِ حق کے لیے ہمہ وقت تیار ہے۔',
    hadithAr: 'قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ',
    hadithEn: 'Say: Are those who know equal to those who do not know?',
    sourceAr: 'القرآن الكريم - سورة الزمر (9)',
    sourceEn: 'The Holy Quran - Surah Az-Zumar (9)',
    actionTextAr: 'استأنف حوارك المعرفي',
    actionTextEn: 'Resume Dialogue',
    actionTextUr: 'مکالمہ جاری رکھیں',
    accentBg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    accentText: 'text-indigo-700',
    icon: Compass,
  },
  new_muslim: {
    trackTitleAr: 'مسار المسلم الجديد',
    trackTitleEn: 'New Muslim Track',
    trackTitleUr: 'نو مسلم کا راستہ',
    headerAr: 'ثبّت خطوتك الأولى في رحلتك مع الله',
    headerEn: 'Strengthen your foundational steps in Islam',
    headerUr: 'اسلام میں اپنے ابتدائی ایمانی قدم کو پختہ کریں',
    messageAr: 'أهلاً بك يا أخي/أختي.. المداومة اليومية على تعلم خطوة واحدة ميسرة تحفظ قلبك وتيسر لك معرفة صلاتك وطهارتك وتوحيدك.',
    messageEn: 'Welcome! Taking one gentle step daily nurtures your heart and eases learning prayer, purification, and belief.',
    messageUr: 'خوش آمدید! روزانہ ایک آسان سبق کا تسلسل آپ کے دل کو اطمینان بخشتا ہے اور نماز، طہارت اور توحید کو آسان بناتا ہے۔',
    hadithAr: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ تَعَالَى أَدْوَمُهَا وَإِنْ قَلَّ',
    hadithEn: 'The most beloved deeds to Allah are those done regularly, even if small.',
    sourceAr: 'صحيح البخاري (6464)',
    sourceEn: 'Sahih al-Bukhari (6464)',
    actionTextAr: 'واصل تثبيت إيمانك',
    actionTextEn: 'Continue Learning',
    actionTextUr: 'ایمانی تعلیم جاری رکھیں',
    accentBg: 'bg-amber-50 border-amber-200 text-amber-900',
    accentText: 'text-amber-700',
    icon: Sun,
  },
  muslim: {
    trackTitleAr: 'مسار المسلم الأصل',
    trackTitleEn: 'Born Muslim Deepening Track',
    trackTitleUr: 'مسلمِ اصل کا تفصیلی راستہ',
    headerAr: 'جدّد عهدك بالعلم وتفقه في دينك',
    headerEn: 'Renew your journey in deep Islamic understanding',
    headerUr: 'فہم دین اور فقہی بصیرت کی تجدید کریں',
    messageAr: 'العلم يرسخ الإيمان ويزكي النفس.. درس قصير اليوم يضيء لك فهماً أعمق في عقيدتك وفقه عباداتك وسيرة نبيك ﷺ.',
    messageEn: 'Knowledge strengthens faith and purifies the soul. A brief lesson today brings profound depth to your worship and creed.',
    messageUr: 'علم ایمان کو مضبوط اور نفس کو پاک کرتا ہے.. آج کا ایک مختصر سبق آپ کے عقیدے اور عبادات میں گہری بصیرت پیدا کرے گا۔',
    hadithAr: 'مَن يُرِدِ اللَّهُ به خَيْرًا يُفَقِّهْهُ في الدِّينِ',
    hadithEn: 'Whomever Allah intends good for, He grants deep understanding of the religion.',
    sourceAr: 'صحيح البخاري (71) ومسلم (1037)',
    sourceEn: 'Sahih al-Bukhari (71) & Muslim (1037)',
    actionTextAr: 'تفقّه في درسك اليوم',
    actionTextEn: 'Continue Lesson',
    actionTextUr: 'آج کا سبق جاری رکھیں',
    accentBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    accentText: 'text-emerald-700',
    icon: BookOpen,
  },
  daiyah: {
    trackTitleAr: 'مسار الداعية ومحاكي الحوار',
    trackTitleEn: 'Daiyah & Outreach Simulator Track',
    trackTitleUr: 'داعی اور سمیلیٹر کا راستہ',
    headerAr: 'طور مهاراتك الدعوية بالحكمة والموعظة الحسنة',
    headerEn: 'Sharpen your dialogue skills with wisdom',
    headerUr: 'حکمت اور موعظۂ حسنہ کے ساتھ دعوتی صلاحیتوں کو نکھاریں',
    messageAr: 'الدعوة إلى الله شرف عظيم يحتاج تدريباً مستمراً.. محاكي السيناريوهات بانتظارك لاختبار ردودك على الشبهات وتحليل أدائك.',
    messageEn: 'Calling to Allah is a noble honor requiring practice. The AI Simulator is ready for your scenario-based dialogue training.',
    messageUr: 'اللہ کی طرف بلانا عظیم شرف ہے.. شبہات کے علمی جوابات کی مشق کے لیے AI سمیلیٹر آپ کا منتظر ہے۔',
    hadithAr: 'ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ',
    hadithEn: 'Invite to the way of your Lord with wisdom and good instruction.',
    sourceAr: 'القرآن الكريم - سورة النحل (125)',
    sourceEn: 'The Holy Quran - Surah An-Nahl (125)',
    actionTextAr: 'ابدأ تدريب المحاكاة',
    actionTextEn: 'Launch Simulator',
    actionTextUr: 'سمیلیٹر مشق شروع کریں',
    accentBg: 'bg-purple-50 border-purple-200 text-purple-900',
    accentText: 'text-purple-700',
    icon: Volume2,
  },
};

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
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const currentTrackKey: TrackId = selectedTrack || 'new_muslim';
  const trackInfo = TRACK_NOTIFICATIONS[currentTrackKey] || TRACK_NOTIFICATIONS.new_muslim;
  const TrackIcon = trackInfo.icon;

  // Find next uncompleted stage for current track
  useEffect(() => {
    const track = selectedTrack || 'new_muslim';
    const stages = CURRICULUM_DATA.filter((s) => s.trackId === track);
    const pending = stages.find((s) => !completedStageIds.includes(s.id)) || stages[0];
    setNextStage(pending);
  }, [selectedTrack, completedStageIds]);

  // Check Web Notification API status
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Check 24-hour inactivity condition
  useEffect(() => {
    try {
      const now = Date.now();
      const lastActiveStr = localStorage.getItem(LAST_ACTIVE_KEY);
      const dismissedUntilStr = localStorage.getItem(NOTIFICATION_DISMISSED_KEY);
      const isEnabled = localStorage.getItem(REMINDERS_ENABLED_KEY) !== 'false';

      if (!isEnabled) {
        setIsVisible(false);
        return;
      }

      if (dismissedUntilStr && now < parseInt(dismissedUntilStr, 10)) {
        setIsVisible(false);
        return;
      }

      if (!lastActiveStr) {
        // First entry: set baseline timestamp
        localStorage.setItem(LAST_ACTIVE_KEY, now.toString());
        return;
      }

      const lastActive = parseInt(lastActiveStr, 10);
      const diffMs = now - lastActive;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      setHoursInactive(hours);

      // Trigger reminder if user has been inactive for 24+ hours
      if (hours >= 24) {
        setIsVisible(true);
      }
    } catch (e) {
      console.warn('Reminder check warning:', e);
    }
  }, [selectedTrack]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      // Snooze reminder for 12 hours
      const snoozeUntil = Date.now() + 12 * 60 * 60 * 1000;
      localStorage.setItem(NOTIFICATION_DISMISSED_KEY, snoozeUntil.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartNextLesson = () => {
    localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    setIsVisible(false);
    if (nextStage) {
      onContinueLearning(nextStage);
    }
  };

  // Helper trigger for judges / testers to test 24h inactivity behavior directly
  const handleSimulate24Hours = () => {
    const simulatedPastTime = Date.now() - 26 * 60 * 60 * 1000; // 26 hours ago
    localStorage.setItem(LAST_ACTIVE_KEY, simulatedPastTime.toString());
    localStorage.removeItem(NOTIFICATION_DISMISSED_KEY);
    setHoursInactive(26);
    setIsVisible(true);

    // Native browser push notification trigger if enabled
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(isAr ? `منصة عِلم | ${trackInfo.trackTitleAr}` : `ILM | ${trackInfo.trackTitleEn}`, {
          body: isAr 
            ? `${trackInfo.messageAr} درسك القادم: ${nextStage?.title}` 
            : `${trackInfo.messageEn} Next: ${nextStage?.titleEn}`,
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
            body: isAr 
              ? `تم تفعيل التنبيهات الذكية لمسار (${trackInfo.trackTitleAr}) بنجاح 🌿` 
              : `Smart reminders for (${trackInfo.trackTitleEn}) enabled successfully 🌿`
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
      <div className="fixed bottom-20 right-4 sm:bottom-5 sm:right-5 z-30 print:hidden opacity-90 hover:opacity-100 transition">
        <button
          onClick={handleSimulate24Hours}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-md cursor-pointer transition border border-slate-700"
          title={isAr ? 'اختبار نظام التنبيه الذكي بعد انقطاع 24 ساعة (حسب المسار)' : isUr ? 'مسار کے مطابق 24 گھنٹے انقطاع کی یاد دہانی کا ٹیسٹ' : 'Test 24h Inactivity Track Reminder'}
        >
          <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>{isAr ? 'اختبار تذكير الـ 24 ساعة (حسب المسار)' : isUr ? '24 گھنٹے یاد دہانی ٹیسٹ' : 'Test 24h Reminder'}</span>
        </button>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-lg z-50 print:hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="bg-white/98 backdrop-blur-md border-2 border-amber-400/90 rounded-3xl p-5 shadow-2xl space-y-4 relative overflow-hidden text-slate-900">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-100/50 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />
        
        {/* Top Header Row with Active Track Pill */}
        <div className="flex items-start justify-between gap-3 relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-2xs">
              <TrackIcon className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  {isAr ? `انقطاع لأكثر من ${hoursInactive || 24} ساعة` : isUr ? `${hoursInactive || 24}+ گھنٹے سے انقطاع` : `Inactive for ${hoursInactive || 24}+ hrs`}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {isAr ? trackInfo.trackTitleAr : isUr ? trackInfo.trackTitleUr : trackInfo.trackTitleEn}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-950 font-serif mt-1">
                {isAr ? trackInfo.headerAr : isUr ? trackInfo.headerUr : trackInfo.headerEn}
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

        {/* Personalized Track-Tailored Message Body */}
        <div className={`rounded-2xl p-4 border space-y-2.5 relative ${trackInfo.accentBg}`}>
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isAr ? 'توجيه تشجيعي مخصص لمسارك' : isUr ? 'آپ کے راستے کی مناسبت سے خصوصی رہنمائی' : 'Personalized Track Encouragement'}</span>
            </span>
            <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/70 font-mono text-slate-700">
              {isAr || isUr ? trackInfo.sourceAr : trackInfo.sourceEn}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
            {isAr ? trackInfo.messageAr : isUr ? trackInfo.messageUr : trackInfo.messageEn}
          </p>

          <div className="pt-2 border-t border-black/5 flex items-center gap-2">
            <span className="text-base select-none">📖</span>
            <p className="text-xs font-serif font-bold text-slate-950 italic">
              «{isAr || isUr ? trackInfo.hadithAr : trackInfo.hadithEn}»
            </p>
          </div>
        </div>

        {/* Next Lesson Preview & Action Button */}
        {nextStage && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-1 text-slate-600">
              <span className="font-semibold">{isAr ? 'محطتك التعليمية القادمة:' : isUr ? 'اگلا تعلیمی مرحلہ:' : 'Your Next Learning Step:'}</span>
              <span className="text-amber-800 font-bold text-[11px] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{nextStage.estimatedMinutes} {isAr ? 'دقائق فقط' : isUr ? 'منٹ' : 'mins only'}</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
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
                className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer shadow-sm group active:scale-95"
              >
                <span>{isAr ? trackInfo.actionTextAr : isUr ? trackInfo.actionTextUr : trackInfo.actionTextEn}</span>
                <ArrowIcon className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Web Push Notification Browser Permission Prompt */}
        {notificationPermission !== 'granted' && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Bell className="w-3 h-3 text-slate-400" />
              <span>{isAr ? 'تفعيل تنبيهات المتصفح الذكية (Push Notifications)؟' : 'Enable browser smart push notifications?'}</span>
            </span>
            <button
              onClick={handleRequestNativePermission}
              className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
            >
              {isAr ? 'تفعيل الآن' : isUr ? 'ابھی فعال کریں' : 'Enable'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
