import React, { useState } from 'react';
import { SimulatorScenario, SimulationEvaluation, Language, SourceReference } from '../types';
import { SIMULATION_SCENARIOS } from '../data/curriculumData';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  BookOpen,
  MessageSquare,
  Mic,
  MicOff
} from 'lucide-react';
import { FormattedMessage } from './FormattedMessage';
import { AILoadingSpinner } from './AILoadingSpinner';

interface DaiyahSimulatorProps {
  language: Language;
}

export const DaiyahSimulator: React.FC<DaiyahSimulatorProps> = ({ language }) => {
  const isAr = language === 'ar';

  const [selectedScenario, setSelectedScenario] = useState<SimulatorScenario>(SIMULATION_SCENARIOS[0]);
  const [messages, setMessages] = useState<{ role: 'user' | 'inquirer'; text: string }[]>([
    {
      role: 'inquirer',
      text: isAr ? selectedScenario.initialMessage : selectedScenario.initialMessageEn,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState<SimulationEvaluation | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [interimSimulatorText, setInterimSimulatorText] = useState('');

  // Initialize Speech Recognition for Daiyah Simulator
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isAr ? 'عذراً، متصفحك لا يدعم الإدخال الصوتي المباشر.' : 'Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      setInterimSimulatorText('');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = isAr ? 'ar-SA' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setInterimSimulatorText('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalStr = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (interim) {
          setInterimSimulatorText(interim);
        }
        if (finalStr) {
          setInputText(finalStr);
          setInterimSimulatorText('');
          setIsListening(false);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setInterimSimulatorText('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn(err);
      setIsListening(false);
      setInterimSimulatorText('');
    }
  };

  const handleSelectScenario = (sc: SimulatorScenario) => {
    setSelectedScenario(sc);
    setMessages([
      {
        role: 'inquirer',
        text: isAr ? sc.initialMessage : sc.initialMessageEn,
      },
    ]);
    setEvaluationReport(null);
    setInputText('');
  };

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text || isLoadingReply) return;

    const newMessages = [...messages, { role: 'user' as const, text }];
    setMessages(newMessages);
    setInputText('');
    setIsLoadingReply(true);

    try {
      const response = await fetch('/api/ai/simulate-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: selectedScenario.id,
          userMessage: text,
          history: newMessages,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'inquirer',
          text: data.reply || (isAr ? 'أشكرك، كلامك واضح ومفيد..' : 'Thank you, your explanation is clear.'),
        },
      ]);
    } catch (e) {
      console.warn('Simulation API call fallback:', e);
      // Constructive scenario-based fallback if API is unreachable
      const defaultReplies = isAr ? [
        'شكراً لك على هذا البيان الطيب. لقد وضحت لي جوانب لم أكن أدركها سابقاً بخصوص حكمة الابتلاء والرحمة الإلهية.',
        'كلامك منطقي ومقنع، ولكن هل يمكن توضيح الدليل الشرعي أكثر من القرآن أو السنة لنفهم السياق بشكل أعمق؟',
        'أقدر سعة صدرك في الحوار، هذا الطرح يزيل التباساً كبيراً كان يشغل بالي.'
      ] : [
        'Thank you for this compassionate explanation. You illuminated aspects about wisdom and divine mercy that I had not realized.',
        'Your point makes sense, but could you elaborate with more textual evidence from the Quran or Hadith to clarify the context?',
        'I appreciate your patient manner. This perspective clarifies a major misunderstanding I previously held.'
      ];

      setMessages((prev) => [
        ...prev,
        {
          role: 'inquirer',
          text: defaultReplies[newMessages.length % defaultReplies.length],
        },
      ]);
    } finally {
      setIsLoadingReply(false);
    }
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const response = await fetch('/api/ai/evaluate-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: selectedScenario.id,
          messages,
          language,
        }),
      });

      const report = await response.json();
      setEvaluationReport(report);
      try {
        localStorage.setItem('eilm_simulator_completed', 'true');
      } catch (e) {
        console.warn(e);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const resetSession = () => {
    setMessages([
      {
        role: 'inquirer',
        text: isAr ? selectedScenario.initialMessage : selectedScenario.initialMessageEn,
      },
    ]);
    setEvaluationReport(null);
    setInputText('');
  };

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Mobile Top Brand Header */}
      <div className="md:hidden flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-baseline gap-1.5">
          <span className="font-brand text-3xl font-bold tracking-normal text-slate-900 select-none">
            <span className="logo-word text-slate-950">علم</span>
          </span>
          <span className="text-slate-300 font-light text-lg select-none">|</span>
          <span className="font-bold text-base tracking-wider text-slate-700 select-none font-sans uppercase">
            ILM
          </span>
        </div>
        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          {isAr ? 'محاكي الداعية' : 'Simulator'}
        </span>
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold mb-3">
          <Bot className="w-3.5 h-3.5 text-amber-600" />
          <span>{isAr ? 'محاكي الحوار الدعوي الذكي' : 'Interactive Da\'wah Simulator'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          {isAr ? 'تدرّب على مهارات الحوار والإقناع بالحكمة' : 'Train Dialogue & Persuasion with Wisdom'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isAr
            ? 'حاور شخصيات واقعية يقودها الذكاء الاصطناعي لاختبار قدرتك على الاستماع، وتفنيد الشبهات، والاستدلال بالمصادر، ثم احصل على تقرير تقييم تفصيلي لأدائك.'
            : 'Engage in realistic role-play conversations with AI personas to sharpen your empathetic listening, evidence citation, and wisdom, followed by an in-depth scorecard.'}
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {SIMULATION_SCENARIOS.map((sc) => {
          const isSelected = sc.id === selectedScenario.id;
          return (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              className={`p-5 rounded-3xl border text-start transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-amber-600/80 ring-2 ring-amber-600/15 shadow-md bg-amber-50/20'
                  : 'bg-white border-[#EAE3D6] hover:border-amber-300 hover:shadow-xs'
              }`}
            >
              <div>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-md inline-block mb-2.5">
                  {sc.inquirerPersona.name}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 font-serif">
                  {isAr ? sc.title : sc.titleEn}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {sc.inquirerPersona.background}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#EAE3D6]/70 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>{isAr ? 'سيناريو تدريبي' : 'Training Scenario'}</span>
                {isSelected && <span className="text-emerald-700 font-bold">● {isAr ? 'نشط' : 'Active'}</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Simulation Window */}
      <div className="relative bg-white rounded-3xl border border-[#EAE3D6] overflow-hidden shadow-xs">
        {/* Center Overlay Spinner during AI Inquirer Reply Generation or Evaluation */}
        {isLoadingReply && (
          <AILoadingSpinner
            language={language}
            title={isAr ? 'المحاور الذكي يحلل الرد ويصيغ تعقيبه...' : 'AI Inquirer is analyzing and formulating response...'}
            subtitle={isAr ? 'محاكاة ردود الشخصيات الواقعية وفق سياق المحادثة' : 'Simulating realistic persona responses based on conversation history'}
            variant="overlay"
          />
        )}

        {isEvaluating && (
          <AILoadingSpinner
            language={language}
            title={isAr ? 'جارٍ تحليل أداء الداعية واستخراج بطاقة التقييم...' : 'Evaluating Da\'iyah performance metrics...'}
            subtitle={isAr ? 'فحص محاور الحوار الثمانية وتفنيد الشبهات والأدلة بالذكاء الاصطناعي' : 'Scoring across 8 communication, empathy, and evidence dimensions'}
            variant="overlay"
          />
        )}
        
        {/* Scenario Persona Top Bar */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  {selectedScenario.inquirerPersona.name}
                </h2>
                <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                  {selectedScenario.inquirerPersona.tone}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                {selectedScenario.context}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetSession}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition cursor-pointer text-xs flex items-center gap-1 font-semibold"
              title={isAr ? 'إعادة ضبط الجلسة' : 'Reset session'}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">{isAr ? 'إعادة البدء' : 'Reset'}</span>
            </button>

            <button
              onClick={handleEvaluate}
              disabled={messages.length < 2 || isEvaluating}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40 shadow-xs cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isAr ? 'جاري التحليل والتقييم...' : 'Analyzing...'}</span>
                </>
              ) : (
                <>
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'إنهاء واستخراج بطاقة التقييم' : 'Evaluate Performance'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="p-4 sm:p-6 space-y-4 min-h-[320px] max-h-[460px] overflow-y-auto bg-white">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  m.role === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {m.role === 'user' ? (isAr ? 'داعية' : 'You') : <User className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                  m.role === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800'
                }`}
              >
                <FormattedMessage content={m.text} isUser={m.role === 'user'} />
              </div>
            </div>
          ))}

          {isLoadingReply && (
            <div className="flex items-center gap-2.5 text-xs text-slate-700 p-3.5 bg-amber-50/70 border border-amber-200/90 rounded-2xl w-fit shadow-2xs animate-in fade-in duration-200">
              <div className="w-4 h-4 border-2 border-amber-700 border-t-transparent rounded-full animate-spin shrink-0"></div>
              <span className="font-medium text-slate-800">
                {isAr ? 'المحاور الذكي يحلل الرد ويصيغ رده الآن...' : 'AI Inquirer is analyzing and replying...'}
              </span>
            </div>
          )}
        </div>

        {/* Live Voice Speech-to-Text Transcription Banner */}
        {isListening && (
          <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-900 text-xs flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <span className="font-bold">
                {isAr ? 'جارٍ الاستماع لصوتك عبر Web Speech API...' : 'Listening via Web Speech API...'}
              </span>
              {interimSimulatorText && (
                <span className="italic text-rose-700 bg-white/70 px-2 py-0.5 rounded-lg border border-rose-200">
                  «{interimSimulatorText}»
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={toggleListening}
              className="px-2 py-0.5 rounded-md bg-rose-200 hover:bg-rose-300 text-rose-950 text-[11px] font-bold transition cursor-pointer"
            >
              {isAr ? 'إيقاف' : 'Stop'}
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              isListening
                ? (isAr ? 'تحدث الآن، جاري تحويل صوتك لنص...' : 'Speak now, converting voice to text...')
                : isAr
                ? 'اكتب ردك كداعية بالحكمة والموعظة الحسنة والاستدلال...'
                : 'Type your response as a Da\'iyah with wisdom and citations...'
            }
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs sm:text-sm bg-white"
          />
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-300'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title={isListening ? 'جارٍ الاستماع... اضغط للإيقاف' : 'تحدث بالصوت مباشرة (Web Speech API)'}
          >
            {isListening ? <Mic className="w-4 h-4 text-white animate-bounce" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={handleSendMessage}
            disabled={isLoadingReply || !inputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer flex items-center gap-2 shadow-xs shrink-0"
          >
            {isLoadingReply ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>{isAr ? 'جارٍ الرد...' : 'Replying...'}</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{isAr ? 'رد' : 'Reply'}</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* EVALUATION REPORT CARD (SCORECARD SECTION) */}
      {evaluationReport && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
                {isAr ? 'بطاقة تقييم أداء الداعية الرسمية (PRD Rubric)' : 'Official Da\'iyah Scorecard'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                {isAr ? 'نتائج التحليل وفق معايير الحكمة والاستدلال' : 'Assessment Analysis & Feedback'}
              </h2>
            </div>

            <div className="text-center sm:text-end bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] font-semibold text-slate-500">{isAr ? 'الدرجة الكلية العامة' : 'Overall Score'}</div>
              <div className="text-3xl font-black text-slate-900">{evaluationReport.overallPercentage}%</div>
            </div>
          </div>

          {/* 8 PRD Metrics Progress Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { labelAr: '1. وضوح الإجابة وسلاستها', labelEn: 'Clarity of Explanation', score: evaluationReport.clarityScore },
              { labelAr: '2. فهم السؤال وسياق السائل', labelEn: 'Understanding Inquirer Context', score: evaluationReport.understandingScore },
              { labelAr: '3. ترتيب الأفكار والتسلسل', labelEn: 'Logical Flow & Structure', score: evaluationReport.structureScore },
              { labelAr: '4. قوة الاستدلال وصحة المصادر', labelEn: 'Evidence & Source Strength', score: evaluationReport.evidenceScore },
              { labelAr: '5. أسلوب الحوار والحكمة', labelEn: 'Dialogue Manner & Wisdom', score: evaluationReport.mannerScore },
              { labelAr: '6. احترام الطرف الآخر', labelEn: 'Respect & De-escalation', score: evaluationReport.respectScore },
              { labelAr: '7. التدرج من الأصل للفرع', labelEn: 'Pedagogical Progression', score: evaluationReport.pedagogyScore },
            ].map((metric, mIdx) => (
              <div key={mIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <span>{isAr ? metric.labelAr : metric.labelEn}</span>
                  <span className="font-mono text-slate-900">{metric.score}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-slate-900 h-1.5 rounded-full"
                    style={{ width: `${metric.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Qualitative Feedback */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-1">
              {isAr ? 'التقرير الشامل:' : 'Detailed Summary:'}
            </span>
            {evaluationReport.detailedFeedback}
          </div>

          {/* Strengths & Growth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <h3 className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{isAr ? 'أبرز نقاط القوة في إجابتك:' : 'Key Strengths:'}</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-emerald-950">
                {evaluationReport.strengths.map((str, sIdx) => (
                  <li key={sIdx} className="leading-relaxed">• {str}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
              <h3 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>{isAr ? 'توصيات لتطوير أدائك القادم:' : 'Growth Recommendations:'}</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-amber-950">
                {evaluationReport.growthPoints.map((gp, gIdx) => (
                  <li key={gIdx} className="leading-relaxed">• {gp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Resources from Challenge Package */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              {isAr ? 'المصادر الموصى بها لمراجعة هذا الموضوع:' : 'Accredited References to Study:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {evaluationReport.recommendedSources?.map((source, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-center gap-1.5 shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">{source.title}</span>
                  <span className="text-slate-400 font-mono text-[10px]">({source.domain})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
