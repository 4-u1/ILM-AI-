import React, { useState, useRef } from 'react';
import { 
  Share2, 
  X, 
  Download, 
  Copy, 
  Check, 
  Flame, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Language, TrackId, AchievementBadge } from '../types';
import { IslamicDateDisplay } from './IslamicDateDisplay';

interface ShareAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  userName: string;
  userRank: {
    titleAr: string;
    titleEn: string;
    titleUr: string;
    level: number;
  };
  earnedBadges: AchievementBadge[];
  currentStreak: number;
  totalXp: number;
  completedStagesCount: number;
  selectedTrack: TrackId | null;
}

export const ShareAchievementModal: React.FC<ShareAchievementModalProps> = ({
  isOpen,
  onClose,
  language,
  userName,
  userRank,
  earnedBadges,
  currentStreak,
  totalXp,
  completedStagesCount,
  selectedTrack,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;

  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Track label
  const trackName = selectedTrack === 'new_muslim' 
    ? (isAr ? 'مسار المسلم الجديد' : isUr ? 'نو مسلم کا راستہ' : 'New Muslim Track')
    : selectedTrack === 'non_muslim'
    ? (isAr ? 'مسار غير المسلم (باحث عن الحقيقة)' : isUr ? 'متلاشی حق کا راستہ' : 'Inquirer Track')
    : selectedTrack === 'daiyah'
    ? (isAr ? 'مسار الداعية ومحاكي الحوار' : isUr ? 'داعی کا راستہ' : 'Daiyah Simulator')
    : (isAr ? 'مسار المسلم الأصل' : isUr ? 'مسلمِ اصل' : 'Born Muslim Track');

  // Share text for social channels
  const shareText = isAr
    ? `✨ أشارككم إنجازي في مسيرة طلب العلم الشرعي الموثوق عبر منصة «عِلم | ILM»!\n🔥 سلسلة المواظبة: ${currentStreak} أيام متتالية\n🏆 أوسمة مكتسبة: ${earnedBadges.length} أوسمة رقمية (+${totalXp} XP)\n📖 محطات منجزة: ${completedStagesCount} محطة موثقة\n📍 ${trackName}\nمعتمدة حصراً بنصوص مجمع الملك فهد والدرر السنية 🌿`
    : isUr
    ? `✨ میں معتبر اسلامی تعلیمی پلیٹ فارم «علم» پر اپنی علمی پیش رفت شیئر کر رہا ہوں!\n🔥 تعلیمی تسلسل: ${currentStreak} مسلسل ایام\n🏆 حاصل کردہ بیجز: ${earnedBadges.length} اعزازات (+${totalXp} XP)\n📖 مکمل مراحل: ${completedStagesCount}\n📍 ${trackName}`
    : `✨ Celebrating my verified Islamic learning milestone on ILM Platform!\n🔥 Learning Streak: ${currentStreak} consecutive days\n🏆 Badges Earned: ${earnedBadges.length} digital badges (+${totalXp} XP)\n📖 Grounded stages: ${completedStagesCount}\n📍 ${trackName}\n100% grounded in King Fahd Complex & Dorar.net 🌿`;

  const handleCopyText = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDownloadCard = () => {
    // Direct SVG-to-Canvas / Print-friendly visual export simulation
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
    
    // If Web Share API is available (Mobile devices)
    if (navigator.share) {
      navigator.share({
        title: isAr ? 'إنجازي في منصة عِلم' : 'My ILM Platform Achievement',
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        // User cancelled or unsupported
      });
    }
  };

  // Top 4 earned badges to highlight on the social card
  const highlightBadges = earnedBadges.slice(0, 4);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-xl bg-white border-2 border-[#E7DFD3] rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-900">
        
        {/* Top Control Bar */}
        <div className="px-6 py-4 border-b border-[#EFE8DC] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-serif">
                {isAr ? 'مشاركة بطاقة الإنجاز الرقمية' : isUr ? 'کامیابی کارڈ شیئر کریں' : 'Share Achievement Card'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr ? 'بطاقة مخصصة للنشر في وسائل التواصل الاجتماعي' : 'Ready-to-share social media showcase card'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Social Media Card Preview */}
        <div className="p-6 space-y-5">
          
          {/* THE SOCIAL MEDIA CARD (Rendered beautifully with gradients and borders) */}
          <div 
            ref={cardRef}
            className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white shadow-2xl border-4 border-[#D4AF37]/40 overflow-hidden"
          >
            {/* Islamic geometric aesthetic ambient background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            {/* Top Row: Brand & Date */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex flex-col items-center justify-center font-brand font-bold shadow-md shadow-amber-500/20">
                  <span className="text-sm font-bold tracking-tight">عِلم</span>
                  <span className="text-[8px] font-sans -mt-1 tracking-widest uppercase font-extrabold">ILM</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">
                    {isAr ? 'منصة عِلم للتعليم والدعوة' : 'ILM Islamic Learning Platform'}
                  </h4>
                  <p className="text-[10px] text-amber-200/80">
                    {isAr ? 'مصادر شرعية معتمدة 100%' : '100% Verified Authentic Sources'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] text-amber-200 font-medium">
                  {trackName}
                </span>
              </div>
            </div>

            {/* Center: Learner Profile & Rank */}
            <div className="py-5 flex items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  {isAr ? 'إنجاز طالب العلم' : isUr ? 'طالب علم کا اعزاز' : 'Learner Achievement'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
                  {userName}
                </h2>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                    {isAr ? userRank.titleAr : isUr ? userRank.titleUr : userRank.titleEn}
                  </span>
                  <span className="text-xs text-slate-400">
                    {isAr ? `(المستوى ${userRank.level})` : `(Lvl ${userRank.level})`}
                  </span>
                </div>
              </div>

              {/* Learning Streak Badge */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/30 border border-amber-500/40 text-center shrink-0">
                <Flame className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
                <span className="text-xl sm:text-2xl font-black text-amber-300 font-serif leading-none mt-1">
                  {currentStreak}
                </span>
                <span className="text-[9px] text-amber-200 font-bold uppercase tracking-wider mt-0.5">
                  {isAr ? 'أيام متتالية' : isUr ? 'مسلسل ایام' : 'Day Streak'}
                </span>
              </div>
            </div>

            {/* Earned Badges Row */}
            <div className="pt-3 border-t border-white/10 relative z-10 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>{isAr ? 'أبرز الأوسمة المكتسبة' : 'Featured Earned Badges'}</span>
                </span>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  {earnedBadges.length} {isAr ? 'أوسمة' : 'badges'} • +{totalXp} XP
                </span>
              </div>

              {highlightBadges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {highlightBadges.map((b) => (
                    <div 
                      key={b.id} 
                      className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-start"
                    >
                      <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs shrink-0 font-bold">
                        ✦
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">
                          {isAr ? b.title : isUr ? b.titleUr : b.titleEn}
                        </p>
                        <p className="text-[9px] text-amber-300/80 font-mono">
                          +{b.xpPoints} XP
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-slate-400">
                  {isAr ? 'في بداية المسيرة المعرفية' : 'Starting the learning journey'}
                </div>
              )}
            </div>

            {/* Card Footer: Verified Stamp */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 relative z-10">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">
                  {isAr ? 'موثق عبر مجمع الملك فهد والدرر السنية' : 'Verified by King Fahd & Dorar.net'}
                </span>
              </div>
              <div className="font-mono text-[9px] text-amber-300/60">
                #ILM_LEARNING_STREAK
              </div>
            </div>

          </div>

          {/* Action Buttons: Copy Text & Native Share / Download */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleCopyText}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl border-2 border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">{isAr ? 'تم نسخ نص الإنجاز!' : 'Copied to Clipboard!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>{isAr ? 'نسخ نص الإنجاز للنشر' : isUr ? 'متن کاپی کریں' : 'Copy Shareable Text'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadCard}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-slate-950 hover:from-amber-500 hover:to-slate-900 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 cursor-pointer active:scale-98"
              >
                <Share2 className="w-4 h-4 text-amber-200" />
                <span>{isAr ? 'مشاركة البطاقة الآن' : isUr ? 'کارڈ شیئر کریں' : 'Share Card Image'}</span>
              </button>
            </div>

            {downloadSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-800 font-semibold animate-fadeIn">
                {isAr ? 'جاهز للمشاركة عبر تطبيقات التواصل الاجتماعي (واتساب، تويتر، تيليجرام)!' : 'Ready to share across social media apps!'}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
