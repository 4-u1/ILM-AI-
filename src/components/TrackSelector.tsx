import React from 'react';
import { TrackId, Language } from '../types';
import { Home, Sun, HelpCircle, Volume2, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import { IslamicDateDisplay } from './IslamicDateDisplay';

interface TrackSelectorProps {
  onSelectTrack: (track: TrackId, initialMode?: 'tutor' | 'map') => void;
  language: Language;
  selectedTrack: TrackId | null;
  onOpenOnboarding?: () => void;
}

export const TrackSelector: React.FC<TrackSelectorProps> = ({
  onSelectTrack,
  language,
  selectedTrack,
  onOpenOnboarding,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const tracks = [
    {
      id: 'muslim' as TrackId,
      title: isAr ? 'المسلم الأصل' : isUr ? 'مسلمِ اصل' : 'Born Muslim',
      description: isAr
        ? 'طوّر معرفتك وممارستك الدينية عبر مسار متدرج لمن وُلد ونشأ على الإسلام بين العقيدة والعبادة والأخلاق.'
        : isUr
        ? 'عقائد، عبادات اور اخلاقیات پر مشتمل تدریجی تعلیمی سفر کے ذریعے اپنے فہم کو پختہ کریں۔'
        : 'Deepen your knowledge and religious practice through a progressive path across creed, worship, and ethics for born Muslims.',
      icon: Home,
      targetLevel: isAr ? 'ترسيخ وتعميق' : isUr ? 'ایمانی پختگی' : 'Deepening & Growth',
      stagesCount: 5,
    },
    {
      id: 'new_muslim' as TrackId,
      title: isAr ? 'المسلم الجديد' : isUr ? 'نیا مسلم' : 'New Muslim',
      description: isAr
        ? 'تأسيس خطوة بخطوة لكل ما تحتاجه في بداية رحلتك مع الإسلام.'
        : isUr
        ? 'اسلام کی آغوش میں آپ کے سفر کے آغاز کے لیے مرحلہ وار مستند بنیاد۔'
        : 'Step-by-step foundation covering everything you need at the beginning of your journey with Islam.',
      icon: Sun,
      targetLevel: isAr ? 'تأسيس شامل' : isUr ? 'مکمل بنیاد' : 'Foundations',
      stagesCount: 6,
      featured: true,
    },
    {
      id: 'non_muslim' as TrackId,
      title: isAr ? 'غير المسلم' : isUr ? 'غیر مسلم / متلاشی حق' : 'Non-Muslim / Inquirer',
      description: isAr
        ? 'بيئة آمنة ومحترمة للتعرف على الإسلام وطرح أسئلتك بحرية.'
        : isUr
        ? 'اسلام کے تعارف اور آزادی سے سوالات کے جوابات حاصل کرنے کے لیے ایک محفوظ اور محترم علمی ماحول۔'
        : 'A safe, respectful environment to discover Islam, ask questions freely, and explore universal truths.',
      icon: HelpCircle,
      targetLevel: isAr ? 'اكتشاف وحوار' : isUr ? 'دریافت اور مکالمہ' : 'Discovery & Inquiry',
      stagesCount: 6,
    },
    {
      id: 'daiyah' as TrackId,
      title: isAr ? 'الداعية' : isUr ? 'داعی / معلم' : 'Da\'iyah / Educator',
      description: isAr
        ? 'تدرّب على مهارات الحوار والدعوة عبر محاكاة نقاشات واقعية.'
        : isUr
        ? 'حقیقت پسندانہ مباحثوں کے سمیلیٹر کے ذریعے دعوتی مہارتوں اور آداب گفتگو کی تربیت۔'
        : 'Train dialogue and outreach skills through realistic simulated discussions powered by AI.',
      icon: Volume2,
      targetLevel: isAr ? 'تأهيل ومحاكاة' : isUr ? 'تربیت و سمیلیٹر' : 'Training & Simulation',
      stagesCount: 4,
      badge: isAr ? 'محاكي ذكي' : isUr ? 'ذہین سمیلیٹر' : 'Interactive Sim',
    },
  ];

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 max-w-4xl mx-auto">
      
      {/* Header section matching PDF */}
      <div className="text-center mb-8 sm:mb-12">
        {onOpenOnboarding && (
          <div className="inline-flex mb-3">
            <button
              onClick={onOpenOnboarding}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition cursor-pointer shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>{isAr ? 'كيف تعمل منصة عِلم؟ اضغط هنا للدليل التعريفي' : isUr ? 'پلیٹ فارم کیسے کام کرتا ہے؟ تعارفی گائیڈ دیکھیں' : 'How Eilm works? View quick guide'}</span>
            </button>
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3 font-serif">
          {isAr ? 'اختر المسار المناسب لك' : isUr ? 'اپنے لیے مناسب راستہ منتخب کریں' : 'Choose the Path That Fits You'}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {isAr
            ? 'منصة ذكية للتعرف على الإسلام وتعليمه، برحلة تفاعلية مخصصة لك'
            : isUr
            ? 'اسلام کے تعارف اور تعلیم کے لیے ایک ذہین پلیٹ فارم، جو آپ کے لیے مخصوص تعاملی سفر فراہم کرتا ہے۔'
            : 'A smart platform to discover and learn about Islam, with an interactive journey tailored to you.'}
        </p>
      </div>

      {/* Islamic Daily Date Cultural Banner */}
      <IslamicDateDisplay language={language} variant="card" className="mb-6 sm:mb-8" />

      {/* Cards List - Exact Style from PDF Mockup */}
      <div className="space-y-4 sm:space-y-5">
        {tracks.map((track) => {
          const Icon = track.icon;
          const isCurrentSelected = selectedTrack === track.id;

          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className={`group relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden p-6 sm:p-7 ${
                isCurrentSelected
                  ? 'border-slate-900 shadow-md ring-2 ring-slate-900/10'
                  : 'border-slate-200 hover:border-slate-400 hover:shadow-sm'
              }`}
            >
              {track.badge && (
                <div className={`absolute top-5 ${isRtl ? 'left-6' : 'right-6'}`}>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    {track.badge}
                  </span>
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                
                {/* Minimalist icon container matching PDF */}
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors mb-3">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>

                {/* Track Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 font-serif">
                  {track.title}
                </h3>

                {/* Track Description */}
                <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed mb-4">
                  {track.description}
                </p>

                {/* Action Buttons: Tutor & Map Integration for all tracks */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2 pt-3 border-t border-slate-100 w-full">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTrack(track.id, 'tutor');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isAr ? 'حوار المعلم الذكي' : isUr ? 'ذہین استاد سے گفتگو' : 'Talk to AI Tutor'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTrack(track.id, 'map');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                    <span>{isAr ? 'خريطة المحطات والدروس' : isUr ? 'نصاب کے مراحل' : 'Curriculum Milestones'}</span>
                  </button>
                </div>
              </div>

              {isCurrentSelected && (
                <div className={`absolute bottom-3 ${isRtl ? 'left-4' : 'right-4'} flex items-center gap-1 text-xs text-emerald-700 font-medium`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'المسار الحالي النشط' : isUr ? 'موجودہ فعال راستہ' : 'Current active path'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust & Scientific Guarantee footer banner */}
      <div className="mt-10 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
            ✓
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {isAr ? 'معايير علمية وضوابط صارمة' : isUr ? 'مستند علمی اور شرعی ضوابط' : 'Grounded Scientific Standards'}
            </h4>
            <p className="text-xs text-slate-600">
              {isAr
                ? 'كافة النصوص والدروس مستندة حصراً إلى مجمع الملك فهد، والدرر السنية، والمستودع الدعوي.'
                : isUr
                ? 'تمام نصوص اور اسباق شاہ فہد کمپلیکس، الدرر السنیہ اور دعوہ سینٹر پر منحصر ہیں۔'
                : 'All scriptures & lessons are strictly anchored in King Fahd Complex, Dorar.net, and Dawa.center.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectTrack('daiyah')}
          className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition shrink-0 cursor-pointer shadow-2xs"
        >
          {isAr ? 'تجربة محاكي الداعية' : 'Try Da\'iyah Simulator'}
        </button>
      </div>

    </section>
  );
};
