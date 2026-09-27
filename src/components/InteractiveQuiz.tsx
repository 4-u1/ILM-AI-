import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  HelpCircle,
  BookOpen,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { QuizQuestion, Language, SourceReference, LessonStage } from '../types';

interface InteractiveQuizProps {
  stage: LessonStage;
  language: Language;
  onCompleteStage: (stageId: string) => void;
  onOpenSourceModal?: (source: SourceReference) => void;
  onContinueJourney?: () => void;
  isAlreadyCompleted?: boolean;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  stage,
  language,
  onCompleteStage,
  onOpenSourceModal,
  onContinueJourney,
  isAlreadyCompleted = false,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Multi-question support: if stage has multiple questions, track index
  const questions: QuizQuestion[] = stage.quiz && stage.quiz.length > 0 
    ? stage.quiz 
    : [
        {
          id: `default-${stage.id}`,
          question: isAr 
            ? `ما هو المفهوم الأساسي المستفاد من درس «${stage.title}»؟`
            : `What is the primary takeaway from the lesson "${stage.titleEn}"?`,
          questionEn: `What is the primary takeaway from the lesson "${stage.titleEn}"?`,
          options: [
            isAr ? 'الالتزام بالأصول الشرعية المستقرة في القرآن والسنة' : 'Adherence to established scriptures in Quran and Sunnah',
            isAr ? 'الاعتماد على الآراء الشخصية المجردة' : 'Relying solely on abstract personal conjectures',
            isAr ? 'إهمال التفكر في معاني الآيات والأحاديث' : 'Neglecting contemplation of verses and hadiths',
            isAr ? 'تجاهل المصادر العلمية المعتمدة' : 'Disregarding verified scholastic references'
          ],
          optionsEn: [
            'Adherence to established scriptures in Quran and Sunnah',
            'Relying solely on abstract personal conjectures',
            'Neglecting contemplation of verses and hadiths',
            'Disregarding verified scholastic references'
          ],
          correctIndex: 0,
          explanation: isAr 
            ? stage.conceptExplanation.slice(0, 160) + '...'
            : stage.conceptExplanationEn.slice(0, 160) + '...',
          source: stage.sources[0]
        }
      ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, { selected: number; isCorrect: boolean }>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];
  const questionCount = questions.length;

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return; // Locked once submitted
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQ.correctIndex;
    setIsAnswerSubmitted(true);

    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: {
        selected: selectedOption,
        isCorrect
      }
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questionCount) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz completed!
      setIsFinished(true);
      onCompleteStage(stage.id);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setIsFinished(false);
  };

  // Summary statistics
  const correctAnswersCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
  const scorePercent = questionCount > 0 ? Math.round((correctAnswersCount / questionCount) * 100) : 100;
  const isPassed = scorePercent >= 70;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
      
      {/* Quiz Card Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-6 sm:p-7 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  {isAr ? 'تقييم الفهم والاستيعاب' : 'Interactive Comprehension Quiz'}
                </span>
                {isAlreadyCompleted && (
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{isAr ? 'مجتاز سابقاً' : 'Completed'}</span>
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif mt-1">
                {isAr ? stage.title : stage.titleEn}
              </h3>
            </div>
          </div>

          {/* Progress Pill / Question Counter */}
          {!isFinished && (
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400">{isAr ? 'السؤال' : 'Question'}</span>
              <span className="font-bold text-amber-400">{currentIndex + 1}</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-300">{questionCount}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {!isFinished && (
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + (isAnswerSubmitted ? 1 : 0.5)) / questionCount) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* QUIZ CONTENT BODY */}
      {!isFinished ? (
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Question Prompt */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>{isAr ? `السؤال ${currentIndex + 1} من ${questionCount}:` : `Question ${currentIndex + 1} of ${questionCount}:`}</span>
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-serif">
              {isAr ? currentQ.question : (currentQ.questionEn || currentQ.question)}
            </h4>
          </div>

          {/* Multiple Choice Options List */}
          <div className="space-y-3">
            {currentQ.options.map((optTextAr, idx) => {
              const optText = isAr ? optTextAr : (currentQ.optionsEn?.[idx] || optTextAr);
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let cardStyle = 'border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/30 text-slate-800';
              let badgeStyle = 'bg-slate-100 text-slate-600 border-slate-200';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  cardStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-500/30';
                  badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                } else if (isSelected && !isCorrect) {
                  cardStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400/30';
                  badgeStyle = 'bg-rose-500 text-white border-rose-500';
                } else {
                  cardStyle = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                cardStyle = 'border-slate-900 bg-slate-900 text-white shadow-md ring-2 ring-slate-900/20';
                badgeStyle = 'bg-amber-400 text-slate-950 font-black border-amber-300';
              }

              const letters = ['أ', 'ب', 'ج', 'د'];
              const lettersEn = ['A', 'B', 'C', 'D'];
              const letter = isAr ? letters[idx] || (idx + 1) : lettersEn[idx] || (idx + 1);

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-start p-4 sm:p-4.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3.5 cursor-pointer disabled:cursor-default ${cardStyle}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${badgeStyle}`}>
                      {letter}
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed">
                      {optText}
                    </span>
                  </div>

                  {isAnswerSubmitted && (
                    <div className="shrink-0">
                      {isCorrect ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                      ) : isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                          <XCircle className="w-4 h-4 text-rose-600" />
                        </div>
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Feedback Panel */}
          {isAnswerSubmitted && (
            <div className={`p-4 sm:p-5 rounded-2xl border-2 space-y-3 animate-in fade-in zoom-in-95 duration-200 ${
              selectedOption === currentQ.correctIndex 
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' 
                : 'bg-amber-50/70 border-amber-300 text-amber-950'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm font-serif">
                  {selectedOption === currentQ.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{isAr ? '🎉 إجابة صحيحة ومؤصلة!' : isUr ? '🎉 درست اور مستند جواب!' : '🎉 Correct Answer! Excellent.'}</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 text-amber-700" />
                      <span>{isAr ? '💡 تصحيح المفهوم والتغذية الراجعة:' : isUr ? '💡 اصلاح فہم اور وضاحت:' : '💡 Concept Review & Feedback:'}</span>
                    </>
                  )}
                </div>

                {currentQ.source && (
                  <button
                    onClick={() => onOpenSourceModal && onOpenSourceModal(currentQ.source)}
                    className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isAr ? currentQ.source.title : currentQ.source.title}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-white/70 p-3 rounded-xl border border-slate-200/50">
                {isAr ? currentQ.explanation : isUr ? currentQ.explanation : (currentQ.explanationEn || currentQ.explanation)}
              </p>
            </div>
          )}

          {/* Action Footer: Submit or Continue */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>{isAr ? 'تأكيد الإجابة وفحص الصحة' : isUr ? 'جواب کی تصدیق اور جانچ' : 'Submit & Check Answer'}</span>
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <span>
                  {currentIndex + 1 < questionCount 
                    ? (isAr ? 'السؤال التالي ←' : isUr ? 'اگلا سوال ←' : 'Next Question →') 
                    : (isAr ? 'إتمام الاختبار واعتماد النتيجة' : isUr ? 'ٹیسٹ مکمل کریں اور نتیجہ درج کریں' : 'Finish Quiz & Finalize Stage')}
                </span>
                <ArrowIcon className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* QUIZ COMPLETION SUMMARY SCREEN */
        <div className="p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 text-amber-800 flex items-center justify-center mx-auto shadow-md">
            <Award className="w-8 h-8 text-amber-600 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
              {isPassed 
                ? (isAr ? 'تم اجتياز تقييم المحطة بنجاح' : isUr ? 'مرحلہ کامیابی سے مکمل' : 'Stage Comprehension Passed')
                : (isAr ? 'مراجعة موصى بها' : isUr ? 'نظر ثانی تجویز کی گئی' : 'Review Recommended')}
            </span>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              {isPassed 
                ? (isAr ? 'مبارك! أتممت اختبار هذه المرحلة المعرفية' : isUr ? 'مبارک ہو! آپ نے اس مرحلے کا ٹیسٹ پاس کر لیا' : 'Congratulations! Stage Quiz Passed')
                : (isAr ? 'تم استكمال الاختبار - ينصح بإعادة الاطلاع' : isUr ? 'ٹیسٹ مکمل ہوا - مطالعہ دہرانا بہتر ہوگا' : 'Quiz Completed - Review Advised')}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {isAr
                ? `حصلت على ${correctAnswersCount} من ${questionCount} إجابات صحيحة (${scorePercent}%). تم توثيق إنجازك وتحديث سجلك في منصة «عِلم».`
                : isUr
                ? `آپ نے ${questionCount} میں سے ${correctAnswersCount} درست جوابات دیے (${scorePercent}%)۔ آپ کی کامیابی پلیٹ فارم «علم» میں درج کر لی گئی ہے۔`
                : `You scored ${correctAnswersCount} out of ${questionCount} (${scorePercent}%). Your progress is recorded in the ILM platform.`}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>{isAr ? 'إعادة الاختبار' : isUr ? 'دوبارہ ٹیسٹ دیں' : 'Retake Quiz'}</span>
            </button>

            {onContinueJourney && (
              <button
                onClick={onContinueJourney}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer flex items-center gap-2"
              >
                <span>{isAr ? 'متابعة مسار الرحلة المعرفية' : isUr ? 'علمی سفر کا نقشہ جاری رکھیں' : 'Continue Journey Map'}</span>
                <ArrowIcon className="w-4 h-4 text-amber-400" />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
