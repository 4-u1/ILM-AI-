import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  X, 
  Heart, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Language, TrackId } from '../types';

interface StageCongratulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageTitle: string;
  stageNumber: number;
  trackId: TrackId;
  userName: string;
  userAge: string;
  language: Language;
  onOpenFullShareModal?: () => void;
}

interface CongratulationData {
  congratulationTitle: string;
  congratulationMessage: string;
  spiritualDuaa: string;
  shareableQuote: string;
}

export const StageCongratulationModal: React.FC<StageCongratulationModalProps> = ({
  isOpen,
  onClose,
  stageTitle,
  stageNumber,
  trackId,
  userName,
  userAge,
  language,
  onOpenFullShareModal,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<CongratulationData>({
    congratulationTitle: `مبارك إتمام المحطة يا ${userName}! 🏆`,
    congratulationMessage: `لقد اجتزت محطة «${stageTitle}» ببراعة وتثبّت من مفاهيمها خطوة بخطوة. هنيئاً لك هذا التقدم المبارك في مسيرة العلم والعمل!`,
    spiritualDuaa: '«اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي، وَعَلِّمْنِي مَا يَنْفَعُنِي، وَزِدْنِي عِلْمًا»',
    shareableQuote: `أتممت بحمد الله دراسة محطة «${stageTitle}» عبر منصة عِلم | ILM الموثوقة بمصادر مجمع الملك فهد والدرر السنية 🌿`
  });

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    const fetchCongratulation = async () => {
      try {
        const response = await fetch('/api/ai/generate-stage-congratulation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName,
            userAge,
            stageTitle,
            stageNumber,
            trackId,
            language
          })
        });

        if (response.ok) {
          const resData = await response.json();
          if (isMounted && resData.congratulationMessage) {
            setData(resData);
          }
        }
      } catch (err) {
        console.warn('Using client-side fallback congratulation message:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCongratulation();

    return () => {
      isMounted = false;
    };
  }, [isOpen, stageTitle, stageNumber, trackId, userName, userAge, language]);

  if (!isOpen) return null;

  const trackLabel = trackId === 'new_muslim'
    ? (isAr ? 'مسار المسلم الجديد' : isUr ? 'نو مسلم کا راستہ' : 'New Muslim Track')
    : trackId === 'non_muslim'
    ? (isAr ? 'مسار غير المسلم' : isUr ? 'غیر مسلم کا راستہ' : 'Non-Muslim Track')
    : trackId === 'daiyah'
    ? (isAr ? 'مسار تأهيل الداعية' : isUr ? 'داعی کا راستہ' : 'Daiyah Track')
    : (isAr ? 'مسار المسلم الأصل' : isUr ? 'مسلمِ اصل' : 'Born Muslim Track');

  const shareText = `🏆 ${data.congratulationTitle}\n\n${data.congratulationMessage}\n\n🤲 الدعاء: ${data.spiritualDuaa}\n\n📍 ${trackLabel} — منصة «عِلم | ILM» التعليمية الموثوقة 🌿`;

  const handleCopy = async () => {
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

  const handleShareNative = () => {
    if (navigator.share) {
      navigator.share({
        title: isAr ? 'إنجاز تعليمي في منصة عِلم' : 'Learning Milestone on ILM',
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-amber-300 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Celebration Decorative Strip */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 px-6 py-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 text-amber-300 mb-2 shadow-inner">
            <Trophy className="w-7 h-7 animate-bounce" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight">
            {loading ? (isAr ? 'جاري إعداد التهنئة الشخصية...' : 'Preparing your personal celebration...') : data.congratulationTitle}
          </h2>

          <div className="mt-1 flex items-center justify-center gap-2 text-xs text-amber-200/90 font-medium">
            <span>{trackLabel}</span>
            <span>•</span>
            <span>{isAr ? `المحطة (${stageNumber})` : `Milestone ${stageNumber}`}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <div className="w-8 h-8 rounded-full border-3 border-amber-600 border-t-transparent animate-spin" />
              <p className="text-xs font-semibold">
                {isAr ? 'المعلم الذكي يكتب لك رسالة تهنئة خاصة...' : 'Tutor is personalizing your message...'}
              </p>
            </div>
          ) : (
            <>
              {/* Personalized message card */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? 'رسالة المعلم الشخصية:' : 'Personal Mentor Message:'}</span>
                </div>
                
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                  {data.congratulationMessage}
                </p>

                {/* Spiritual Duaa Quote Box */}
                {data.spiritualDuaa && (
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-center">
                    <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block mb-1">
                      {isAr ? 'دعاء التوفيق والازدياد' : 'Duaa for Guidance'}
                    </span>
                    <blockquote className="font-serif text-sm sm:text-base font-bold text-amber-950">
                      {data.spiritualDuaa}
                    </blockquote>
                  </div>
                )}
              </div>

              {/* Verified Sources Stamp */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'موثق 100% بمصادر الحزمة المعتمدة' : '100% Verified Islamic Sources'}</span>
                </div>
                <span className="text-[11px] font-mono text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                  +50 XP
                </span>
              </div>

              {/* Action Buttons: Native Share + Copy + Next Action */}
              <div className="space-y-2.5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleShareNative}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-700 to-slate-900 hover:from-amber-600 hover:to-slate-800 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-900/10 active:scale-98"
                  >
                    <Share2 className="w-4 h-4 text-amber-200" />
                    <span>{isAr ? 'مشاركة الإنجاز فوراً' : 'Share Milestone'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-600" />
                        <span>{isAr ? 'نسخ النص للنشر' : 'Copy Text'}</span>
                      </>
                    )}
                  </button>
                </div>

                {onOpenFullShareModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenFullShareModal();
                    }}
                    className="w-full py-2.5 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isAr ? 'عرض بطاقة الوسام الرقمية الكاملة 🎖️' : 'View Full Digital Badge Card 🎖️'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  {isAr ? 'متابعة الرحلة المعرفية' : 'Continue Journey'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
