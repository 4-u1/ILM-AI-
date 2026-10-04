import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  Sparkles, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Lightbulb, 
  Check, 
  X,
  Compass
} from 'lucide-react';
import { QuizQuestion, Language, LessonStage } from '../types';
import { awardXP } from '../utils/xpManager';

interface StageSelfAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: LessonStage;
  language: Language;
  onCompleteAndProceed: () => void;
}

export const StageSelfAssessmentModal: React.FC<StageSelfAssessmentModalProps> = ({
  isOpen,
  onClose,
  stage,
  language,
  onCompleteAndProceed,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const questions: QuizQuestion[] = stage.quiz && stage.quiz.length > 0 
    ? stage.quiz 
    : [
        {
          id: `fallback-${stage.id}-1`,
          question: isAr 
            ? `ما هو المفهوم الجوهري المستفاد من محطة «${stage.title}»؟`
            : `What is the core takeaway from "${stage.titleEn}"?`,
          options: [
            isAr ? 'الامتثال لأمر الله والعمل بالعلم الموثق' : 'Submitting to Allah\'s guidance with verified practice',
            isAr ? 'التخمين في المسائل الشرعية دون دليل' : 'Guessing religious matters without evidence',
            isAr ? 'الاعتماد على مصادر غير معتمدة' : 'Relying on unverified sources',
            isAr ? 'التساهل في مقاصد الشريعة' : 'Neglecting Islamic objectives'
          ],
          correctIndex: 0,
          explanation: isAr 
            ? 'الغاية الأولى من العلم الشرعي هي توحيد الله وإخلاص العبادة له وفق القرآن والسنة.'
            : 'The primary purpose of Islamic knowledge is worshiping Allah purely based on Quran & Sunnah.',
          source: stage.sources?.[0] || {
            domain: 'dorar.net',
            title: 'موسوعة الدرر السنية',
            category: 'عقيدة',
            referenceDetail: 'الأصول المعتمدة',
            reliabilityNote: 'حزمة المصادر المعتمدة'
          }
        }
      ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [hasConfirmedCurrent, setHasConfirmedCurrent] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const selectedOptionIndex = selectedAnswers[currentIndex];
  const isSelected = selectedOptionIndex !== undefined;
  const isCorrect = isSelected && selectedOptionIndex === currentQ.correctIndex;

  // Calculate results
  const totalQuestions = questions.length;
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, ansIdx]) => questions[parseInt(qIdx, 10)]?.correctIndex === ansIdx
  ).length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  const handleSelectOption = (idx: number) => {
    if (hasConfirmedCurrent) return; // Locked once confirmed
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: idx }));
  };

  const handleConfirmAnswer = () => {
    if (!isSelected) return;
    setHasConfirmedCurrent(true);

    if (selectedOptionIndex === currentQ.correctIndex) {
      awardXP(
        10,
        `إجابة صحيحة في التقييم الذاتي: ${stage.title}`,
        `Correct Self-Assessment Answer: ${stage.titleEn}`
      );
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setHasConfirmedCurrent(selectedAnswers[currentIndex + 1] !== undefined);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setHasConfirmedCurrent(false);
    setIsFinished(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="bg-white border-2 border-amber-400/90 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative my-auto">
        
        {/* Top Header Banner */}
        <div className="p-4 sm:p-6 bg-[#FAF7F2] border-b border-[#EAE3D6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Lightbulb className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  {isAr ? 'التقييم الذاتي للاستيعاب' : 'Self-Assessment Checkpoint'}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {stage.title}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif mt-0.5">
                {isAr ? 'قياس مدى فهم وتثبيت مفاهيم الدرس' : 'Measure & Validate Knowledge Retention'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            title="إغلاق التقييم"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {!isFinished ? (
          <div className="p-5 sm:p-7 space-y-6">
            
            {/* Progress Stepper */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>
                  {isAr ? `السؤال ${currentIndex + 1} من ${totalQuestions}` : `Question ${currentIndex + 1} of ${totalQuestions}`}
                </span>
                <span className="text-amber-800 font-bold">
                  {Math.round(((currentIndex + (hasConfirmedCurrent ? 1 : 0)) / totalQuestions) * 100)}%
                </span>
              </div>
              <div className="w-full bg-[#EAE3D6] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + (hasConfirmedCurrent ? 1 : 0)) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-amber-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {currentIndex + 1}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed font-serif">
                  {isAr || isUr ? currentQ.question : currentQ.questionEn || currentQ.question}
                </h4>
              </div>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, idx) => {
                const isThisSelected = selectedOptionIndex === idx;
                const isThisCorrect = currentQ.correctIndex === idx;
                
                let optionStyle = 'bg-white border-[#EAE3D6] text-slate-800 hover:border-amber-300 hover:bg-amber-50/20';

                if (hasConfirmedCurrent) {
                  if (isThisCorrect) {
                    optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-200';
                  } else if (isThisSelected && !isThisCorrect) {
                    optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200';
                  } else {
                    optionStyle = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isThisSelected) {
                  optionStyle = 'bg-amber-50 border-amber-600 text-amber-950 font-bold ring-2 ring-amber-300';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={hasConfirmedCurrent}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border text-start text-xs sm:text-sm transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        hasConfirmedCurrent && isThisCorrect
                          ? 'bg-emerald-600 text-white'
                          : hasConfirmedCurrent && isThisSelected && !isThisCorrect
                          ? 'bg-rose-600 text-white'
                          : isThisSelected
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{option}</span>
                    </div>

                    {hasConfirmedCurrent && (
                      <div className="shrink-0">
                        {isThisCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : isThisSelected ? (
                          <XCircle className="w-5 h-5 text-rose-500" />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanations & Remediation Guidance on confirmation */}
            {hasConfirmedCurrent && (
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed animate-in fade-in duration-200 ${
                isCorrect 
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                <div className="flex items-center gap-2 mb-1.5 font-bold">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>{isAr ? 'إجابة صحيحة ومتقنة! 🌟 (+10 XP)' : 'Correct Answer! (+10 XP)'}</span>
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-4 h-4 text-amber-700" />
                      <span>{isAr ? 'توجيه إرشادي لتصحيح المفهوم:' : 'Remediation Guidance:'}</span>
                    </>
                  )}
                </div>

                <p className="mt-1 leading-relaxed">
                  {currentQ.explanation}
                </p>

                {currentQ.source && (
                  <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>المصدر المعتمد: {currentQ.source.title}</span>
                    </span>
                    <span className="font-mono text-slate-500">{currentQ.source.referenceDetail}</span>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Action Controls */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                {isAr ? 'إغلاق ومتابعة الدرس' : 'Close'}
              </button>

              {!hasConfirmedCurrent ? (
                <button
                  type="button"
                  onClick={handleConfirmAnswer}
                  disabled={!isSelected}
                  className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>{isAr ? 'تأكيد الإجابة' : 'Check Answer'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>
                    {currentIndex + 1 < totalQuestions 
                      ? (isAr ? 'السؤال التالي' : 'Next Question')
                      : (isAr ? 'عرض تقرير الاستيعاب النهائي' : 'View Final Report')}
                  </span>
                  <ArrowIcon className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Final Comprehension Report View (تقرير الاستيعاب والتقوية) */
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-md ${
              scorePercent >= 80 
                ? 'bg-emerald-600 text-white' 
                : scorePercent >= 50 
                ? 'bg-amber-600 text-white' 
                : 'bg-rose-600 text-white'
            }`}>
              <Award className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 bg-amber-50 text-amber-900 border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{isAr ? 'نتيجة التقييم الذاتي' : 'Self-Assessment Result'}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                {scorePercent >= 80 
                  ? (isAr ? 'استيعاب متميز وتثبيت متقن للمفاهيم! 🏆' : 'Excellent Comprehension! 🏆')
                  : scorePercent >= 50
                  ? (isAr ? 'استيعاب جيد مع بعض النقاط للمراجعة 📖' : 'Good Comprehension with Room to Review 📖')
                  : (isAr ? 'يُنصح بإعادة قراءة المفاهيم الأساسية 💡' : 'Recommended to Review Core Lessons 💡')}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                {isAr
                  ? `حققت نسبة إتقان ${scorePercent}% (${correctCount} من أصل ${totalQuestions} أسئلة صحيحة) وفق المنهج الشرعي المعتمد.`
                  : `You scored ${scorePercent}% (${correctCount} of ${totalQuestions} correct answers).`}
              </p>
            </div>

            {/* Remediation Summary Box if there were mistakes */}
            {correctCount < totalQuestions && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 text-start space-y-2 text-xs">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{isAr ? 'توصيات إضافية لتعزيز الاستيعاب:' : 'Targeted Recommendations:'}</span>
                </div>
                <ul className="list-disc list-inside text-slate-700 space-y-1 leading-relaxed">
                  {questions.map((q, qIdx) => {
                    const ans = selectedAnswers[qIdx];
                    if (ans !== q.correctIndex) {
                      return (
                        <li key={q.id}>
                          <span className="font-semibold text-slate-900">{q.question}:</span>{' '}
                          <span className="text-amber-900">{q.explanation}</span>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>{isAr ? 'إعادة التقييم الذاتي' : 'Retake Assessment'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCompleteAndProceed();
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-bold transition shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'اعتماد النتيجة واجتياز المحطة' : 'Pass & Complete Stage'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
