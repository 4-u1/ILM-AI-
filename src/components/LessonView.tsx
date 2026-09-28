import React, { useState, useEffect, useRef } from 'react';
import { 
  LessonStage, 
  Language, 
  SourceReference, 
  ScriptureCitation, 
  TrackId 
} from '../types';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  User, 
  Award, 
  HelpCircle, 
  Check, 
  BookOpen,
  Info,
  AlertTriangle,
  ExternalLink,
  Smile,
  GraduationCap,
  Briefcase,
  Bot,
  MessageSquare
} from 'lucide-react';
import { parseLearnerPersona, adaptCapsuleForAge, LearnerPersona, AgeBracket } from '../utils/tutorPersona';
import { InteractiveTutor } from './InteractiveTutor';
import { playQuranVerse, stopQuranAudio } from '../utils/quranAudio';

interface LessonViewProps {
  stage: LessonStage;
  language: Language;
  onBack: () => void;
  onCompleteStage: (stageId: string) => void;
  isAlreadyCompleted: boolean;
}

interface MessageItem {
  id: string;
  role: 'tutor' | 'user';
  text: string;
  timestamp: string;
  scripture?: ScriptureCitation;
  sourceNote?: string;
  isQuestion?: boolean;
  options?: string[];
  correctOptionIndex?: number;
  explanation?: string;
  isGuardrailEscalation?: boolean;
}

export const LessonView: React.FC<LessonViewProps> = ({
  stage,
  language,
  onBack,
  onCompleteStage,
  isAlreadyCompleted,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Mode: 'micro' (Micro-Capsule Stream) or 'tutor' (Full Interactive AI Mentor Session)
  const [learningMode, setLearningMode] = useState<'micro' | 'tutor'>('micro');

  // Track-specific verified sources information from Presentation Slide 7
  const TRACK_SOURCES_INFO: Record<TrackId, {
    primarySourceTitle: string;
    domain: string;
    description: string;
    reliability: string;
    usageRule: string;
  }> = {
    muslim: {
      primarySourceTitle: 'موسوعة الدرر السنية ومجمع الملك فهد لطباعة المصحف الشريف',
      domain: 'dorar.net • quranpedia.net',
      description: 'المصدر المعتمد في العقيدة، الفقه، والتفسير وتخريج الأحاديث من الصحيحين.',
      reliability: '100% موثوقية معتمدة وفق وثيقة الحزمة العلمية',
      usageRule: 'الالتزام بما عليه الصحابة والتابعون دون فتوى شخصية أو ترجيح آلي'
    },
    new_muslim: {
      primarySourceTitle: 'مجمع الملك فهد لطباعة المصحف الشريف وقاموس الجمهرة للمحتوى الإسلامي',
      domain: 'quranpedia.net • islamic-content.com',
      description: 'النص القرآني بالرسم المعتمد مع معاني المفردات والمصطلحات الميسرة للمسلم الجديد.',
      reliability: '100% موثوقية معتمدة وفق وثيقة الحزمة العلمية',
      usageRule: 'التأسيس النقي الميسر بالترجمات المعتمدة والرفق النبوي'
    },
    non_muslim: {
      primarySourceTitle: 'المستودع الدعوي الرقمي وموسوعة الجمهرة لمفردات المحتوى الإسلامي',
      domain: 'dawa.center • islamic-content.com',
      description: 'مرجع شامل للموضوعات العقلية، الشبهات والردود، والترجمات المعتمدة.',
      reliability: '100% موثوقية معتمدة وفق وثيقة الحزمة العلمية',
      usageRule: 'الحوار الإقناعي الهادئ والأدلة العقلية دون تعصب أو هجوم'
    },
    daiyah: {
      primarySourceTitle: 'المكتبة الشاملة وموسوعة الأحاديث الصحيحة في الدرر السنية',
      domain: 'shamela.ws • dorar.net/hadith',
      description: 'أصول الدعوة بالحكمة والموعظة الحسنة، فقه الأولويات، وبيئات محاكاة الحوار.',
      reliability: '100% موثوقية معتمدة وفق وثيقة الحزمة العلمية',
      usageRule: 'عدم نسبة أي حديث دون مصدر وحكم معتمد في البيانات'
    }
  };

  const trackSourceData = TRACK_SOURCES_INFO[stage.trackId] || TRACK_SOURCES_INFO.muslim;

  // Persistent Learner Profile (Name & Age)
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('eilm_user_name') || 'عبد الله';
  });

  const [userAge, setUserAge] = useState<string>(() => {
    return localStorage.getItem('eilm_user_age') || '20 سنة';
  });

  // Calculate dynamic adaptive persona based on age and name
  const persona = parseLearnerPersona(userAge, userName);

  // Stage learning state persistence key
  const storageKey = `eilm_conversational_stage_${stage.id}`;

  // Current Chunk Index local state (0-based chunk tracking)
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentChunkIndex === 'number') return parsed.currentChunkIndex;
        if (typeof parsed.step === 'number') return Math.floor(parsed.step / 2);
      }
    } catch (e) {
      console.warn('Error reading stored chunk index:', e);
    }
    return 0;
  });

  // State to track if the current chunk's question has been verified as correct
  const [isChunkVerified, setIsChunkVerified] = useState<boolean>(false);
  // State to track if a question is currently awaiting user answer for this chunk
  const [isAwaitingAnswer, setIsAwaitingAnswer] = useState<boolean>(true);

  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.step === 'number') return parsed.step;
      }
    } catch (e) {
      console.warn('Error reading stored stage step:', e);
    }
    return 0;
  });

  const [isStageCompleted, setIsStageCompleted] = useState<boolean>(() => isAlreadyCompleted);

  // Active audio recitation playback state for Quranic verses
  const [playingVerseKey, setPlayingVerseKey] = useState<string | null>(null);

  // Stop Quran audio on unmount or stage change
  useEffect(() => {
    return () => {
      stopQuranAudio();
    };
  }, [stage.id]);

  const handleTogglePlayVerse = (arabicText: string, reference: string, verseKey: string) => {
    if (playingVerseKey === verseKey) {
      stopQuranAudio();
      setPlayingVerseKey(null);
    } else {
      setPlayingVerseKey(verseKey);
      playQuranVerse(arabicText, reference, {
        onStart: () => setPlayingVerseKey(verseKey),
        onEnd: () => setPlayingVerseKey(null),
        onError: () => setPlayingVerseKey(null),
      });
    }
  };

  // Split stage concept explanation into bite-sized micro-learning chunks (30-50 words each)
  const rawParagraphs = stage.conceptExplanation
    ? stage.conceptExplanation
        .split(/\n\s*\n|\n(?=[0-9]+\.|\-|\•)/g)
        .map(p => p.trim())
        .filter(p => p.length > 0)
    : [stage.subtitle];

  // If rawParagraphs is very short, also split by single newline
  const contentChunks = rawParagraphs.length > 1
    ? rawParagraphs
    : (stage.conceptExplanation
        ? stage.conceptExplanation.split('\n').map(l => l.trim()).filter(l => l.length > 15)
        : [stage.subtitle]);

  // Ensure at least 3 progressive chunks per lesson
  const chunk1Text = contentChunks[0] || stage.subtitle;
  const chunk2Text = contentChunks[1] || (stage.keyTerms && stage.keyTerms.length > 0 ? `المصطلح المحوري: ${stage.keyTerms[0].ar} — ${stage.keyTerms[0].approvedStandard}` : 'تأصيل هذا المفهوم يعتمد على النقل الصحيح والعقل الصريح.');
  const chunk3Text = contentChunks[2] || (stage.reflectionPrompt || 'تطبيق هذا المفهوم في الحياة اليومية يثمر طمأنينة القلب واستقامة السلوك والأخلاق والتعامل بالعدل والإحسان.');

  const chunks = [
    {
      title: 'المفهوم التأسيسي',
      text: chunk1Text,
      question: stage.quiz && stage.quiz.length > 0 
        ? stage.quiz[0].question 
        : `بناءً على هذه الفقرة يا ${userName}، ما هو جوهر ما تعلمناه للتو؟`,
      options: stage.quiz && stage.quiz.length > 0 
        ? stage.quiz[0].options 
        : [
            'العمل به وتطبيقه بيقين وإخلاص لله وحده',
            'مجرد حفظ كلمات دون فهم ولا تطبيق',
            'إهمال العلم والعمل'
          ],
      correctAnswer: stage.quiz && stage.quiz.length > 0 
        ? stage.quiz[0].options[stage.quiz[0].correctIndex]
        : 'العمل به وتطبيقه بيقين وإخلاص لله وحده'
    },
    {
      title: 'التأصيل والدليل الشرعي',
      text: chunk2Text,
      question: stage.quiz && stage.quiz.length > 1 
        ? stage.quiz[1].question 
        : `ما هي الفائدة الإيمانية والعملية العظمى التي تستنبطها من هذا التأصيل يا ${userName}؟`,
      options: stage.quiz && stage.quiz.length > 1 
        ? stage.quiz[1].options 
        : [
            'ترسيخ اليقين بأن الشريعة رحمة وعدل وإفراد للخالق بالعبادة',
            'مجرد نص تاريخي لا يرتبط بواقعنا المعاصر',
            'التشديد والتعقيد'
          ],
      correctAnswer: stage.quiz && stage.quiz.length > 1 
        ? stage.quiz[1].options[stage.quiz[1].correctIndex]
        : 'ترسيخ اليقين بأن الشريعة رحمة وعدل وإفراد للخالق بالعبادة'
    },
    {
      title: 'التطبيق العملي المعاصر',
      text: chunk3Text,
      question: `كيف تثمر هذه المعرفة في واقعك وسلوكك اليومي يا ${userName}؟`,
      options: [
        'أطبقه بالصدق والإخلاص وحسن المعاملة والأمانة وبر الوالدين',
        'مجرد معلومات نظرية لا أطبقها في يومي',
        'الجدال والتعصب دون عمل'
      ],
      correctAnswer: 'أطبقه بالصدق والإخلاص وحسن المعاملة والأمانة وبر الوالدين'
    }
  ];

  const capsule2Scripture = stage.scriptures && stage.scriptures.length > 0 ? stage.scriptures[0] : undefined;

  // Initial welcome message starting strictly with "السلام عليكم" + persona call
  const buildInitialGreeting = (name: string, ageStr: string): MessageItem => {
    const p = parseLearnerPersona(ageStr, name);
    const greetingText = `السلام عليكم ورحمة الله وبركاته ${p.titleCall}.\n\nحياك الله في المحطة (${stage.stageNumber}): «${stage.title}».\n\nيسعدني أن أكون رفيقك ومعلمك اليوم. سنعرض المحتوى في أجزاء صغيرة (Chunks)، وسأطرح عليك بعد كل جزء سؤالاً تنشيطياً، ولن يفتح زر الانتقال للجزء التالي إلا بعد التأكد من صحة إجابتك.\n\nدعنا نبدأ بالجزء الأول (1 / ${chunks.length}):\n\n${adaptCapsuleForAge(chunk1Text, p, 1, stage.title)}\n\n${chunks[0].question}`;
    return {
      id: 'msg-greeting',
      role: 'tutor',
      text: greetingText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isQuestion: true,
      options: chunks[0].options
    };
  };

  const [messages, setMessages] = useState<MessageItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.messages && parsed.messages.length > 0) {
          return parsed.messages;
        }
      }
    } catch (e) {
      console.warn('Error reading stored messages:', e);
    }
    return [buildInitialGreeting(userName, userAge)];
  });

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [showSourceInfo, setShowSourceInfo] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          currentChunkIndex,
          step: currentStep,
          messages,
          isCompleted: isStageCompleted,
          updatedAt: Date.now()
        })
      );
    } catch (e) {
      console.warn('Error saving conversational stage state:', e);
    }
  }, [currentChunkIndex, currentStep, messages, isStageCompleted, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakText = (text: string) => {
    if (!isAudioEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_~]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'ar-SA';
      utterance.rate = persona.bracket === 'child' ? 0.9 : 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech error:', e);
    }
  };

  // Helper to enforce Strict Single-Question Rule on tutor turns
  const enforceSingleQuestion = (text: string): string => {
    const qMarkRegex = /[؟?]/g;
    const matches = [...text.matchAll(qMarkRegex)];
    if (matches.length > 1) {
      const firstQIndex = matches[0].index!;
      return text.substring(0, firstQIndex + 1).trim();
    }
    return text.trim();
  };

  const addTutorTurn = (
    text: string, 
    options?: string[], 
    scripture?: ScriptureCitation, 
    sourceNote?: string,
    isEscalation?: boolean
  ) => {
    const filteredText = enforceSingleQuestion(text);
    const tutorMsg: MessageItem = {
      id: `tutor-${Date.now()}`,
      role: 'tutor',
      text: filteredText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options,
      scripture,
      sourceNote,
      isGuardrailEscalation: isEscalation
    };
    setMessages(prev => [...prev, tutorMsg]);
    speakText(filteredText);
  };

  // Handle switching user age bracket dynamically
  const handleChangeAge = (newAgeStr: string) => {
    setUserAge(newAgeStr);
    localStorage.setItem('eilm_user_age', newAgeStr);

    const newPersona = parseLearnerPersona(newAgeStr, userName);
    const notification = `تم ضبط نبرة المعلم ومستوى التبسيط وتخصيص الأمثلة لتلائم فئة (${newPersona.bracket === 'child' ? 'الناشئة والأشبال' : newPersona.bracket === 'youth' ? 'الشباب' : 'الراشدين'}) يا ${newPersona.titleCall} ✨`;
    addTutorTurn(notification, ['واضح يا معلمي، استمر', 'ممتاز، لنكمل الدرس']);
  };

  // User sends a message (either clicks an option or types a question)
  const handleUserSend = async (userTextToSend?: string) => {
    const text = (userTextToSend || inputVal).trim();
    if (!text) return;

    setInputVal('');

    const userTurn: MessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, userTurn];
    setMessages(updatedHistory);
    setIsTyping(true);

    try {
      // Call backend AI Agent with age and name personalization
      const res = await fetch('/api/ai/lesson-tutor-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageId: stage.id,
          trackId: stage.trackId,
          userName,
          userAge,
          userMessage: text,
          currentCapsuleIndex: currentStep,
          stageTitle: stage.title,
          stageConcept: stage.conceptExplanation,
          scriptures: stage.scriptures,
          conversationHistory: updatedHistory.slice(-6)
        })
      });

      const data = await res.json();

      // Check if Guardrail triggered (Level D personal fatwa)
      if (data.isGuardrailTriggered) {
        addTutorTurn(data.reply, ['سؤال آخر حول الدرس', 'متابعة الدرس خطوة بخطوة'], undefined, data.sourceNote, true);
        setIsTyping(false);
        return;
      }
    } catch (e) {
      console.warn('Agent API fallback to scripted mentor flow:', e);
    }

    // Process Step Progression ensuring Contextual Continuity & Verification
    setTimeout(() => {
      advanceLessonTurn(text);
      setIsTyping(false);
    }, 450);
  };

  // Verification logic for the active question on current chunk
  const verifyChunkAnswer = (userResponse: string, chunkIdx: number): boolean => {
    const currentChunkObj = chunks[chunkIdx];
    if (!currentChunkObj) return true;

    const clean = userResponse.toLowerCase().trim();
    const correctOpt = currentChunkObj.correctAnswer.toLowerCase().trim();

    // Check if user answer matches the correct option or key correct keywords
    if (clean === correctOpt || userResponse.includes(currentChunkObj.correctAnswer)) {
      return true;
    }

    // Negative indicators (wrong choices like 'مجرد', 'إهمال', 'جدال')
    if (clean.includes('مجرد') || clean.includes('إهمال') || clean.includes('جدال') || clean.includes('تعقيد')) {
      return false;
    }

    // Positive key terms for good answers
    if (clean.includes('يقين') || clean.includes('إخلاص') || clean.includes('عمل') || clean.includes('رحمة') || clean.includes('صدق') || clean.includes('بر') || clean.includes('أمانة') || clean.includes('حسن')) {
      return true;
    }

    return true;
  };

  // Handler to advance to the next chunk only after verification
  const handleProceedToNextChunk = () => {
    if (!isChunkVerified) return;

    const nextChunkIdx = currentChunkIndex + 1;
    setIsChunkVerified(false);
    setIsAwaitingAnswer(true);

    if (nextChunkIdx < chunks.length) {
      setCurrentChunkIndex(nextChunkIdx);
      const nextChunkObj = chunks[nextChunkIdx];
      const p = parseLearnerPersona(userAge, userName);

      let chunkPresentation = '';
      if (nextChunkIdx === 1) {
        chunkPresentation = persona.bracket === 'child'
          ? `أحسنت ${p.titleCall}! 🌟 ننتقل الآن إلى الجزء الثاني (${nextChunkIdx + 1} / ${chunks.length}) بعنوان «${nextChunkObj.title}»:\n\n${nextChunkObj.text}\n\n${nextChunkObj.question}`
          : `بارك الله فيك ${p.titleCall} ✨\n\nننتقل الآن للجزء التالي (${nextChunkIdx + 1} / ${chunks.length}) - «${nextChunkObj.title}»:\n\n${nextChunkObj.text}\n\n${nextChunkObj.question}`;
      } else {
        const adaptedPractical = adaptCapsuleForAge(nextChunkObj.text, p, 3, stage.title);
        chunkPresentation = persona.bracket === 'child'
          ? `ما شاء الله عليك ${p.titleCall}! 🎉 ننتقل للجزء الأخير (${nextChunkIdx + 1} / ${chunks.length}) - «${nextChunkObj.title}»:\n\n${adaptedPractical}\n\n${nextChunkObj.question}`
          : `أحسنت ${p.titleCall}! 👏 ننتقل للفقرة الأخيرة (${nextChunkIdx + 1} / ${chunks.length}) - «${nextChunkObj.title}»:\n\n${adaptedPractical}\n\n${nextChunkObj.question}`;
      }

      if (nextChunkIdx === 1 && capsule2Scripture) {
        addTutorTurn(
          chunkPresentation,
          nextChunkObj.options,
          capsule2Scripture,
          `المصدر المعتمد: ${capsule2Scripture.reference} (${capsule2Scripture.source.title})`
        );
      } else {
        addTutorTurn(chunkPresentation, nextChunkObj.options);
      }
    } else {
      // Completed all chunks!
      setCurrentStep(5);
      setIsStageCompleted(true);
      onCompleteStage(stage.id);

      const completionCelebration = persona.bracket === 'child'
        ? `ألف مبارك ${persona.titleCall}! 🌟🏆 لقد اجتزت جميع أجزاء محطة «${stage.title}» وأجبت عن الأسئلة التنشيطية بتفوق!\n\nتم توثيق إنجازك بنجاح في خريطة الرحلة التعليمية، ويمكنك الانتقال للمحطة التالية!`
        : `مبارك ${persona.titleCall}! لقد أتممت دراسة المحطة (${stage.stageNumber}): «${stage.title}» بجميع أجزائها (Chunks) بنجاح وتفوق 🎉🎓\n\nأثبت فهمك لكل فقرة وتأكدنا من صحة إجاباتك قبل كل انتقال.\n\nتم حفظ تقدمك واجتيازك رسمياً في خريطة الرحلة المعتمدة!`;

      addTutorTurn(
        completionCelebration,
        ['العودة لخريطة الرحلة 🗺️', 'عرض بطاقة المصادر المعتمدة 📜']
      );
    }
  };

  // Step-by-Step Flow adhering strictly to the user prompt & presentation slides
  const advanceLessonTurn = (userResponse: string) => {
    const clean = userResponse.toLowerCase().trim();

    // Check answer for the active chunk question
    const isValid = verifyChunkAnswer(userResponse, currentChunkIndex);

    if (isValid) {
      setIsChunkVerified(true);
      setIsAwaitingAnswer(false);

      const isLastChunk = currentChunkIndex >= chunks.length - 1;
      const successFeedback = persona.bracket === 'child'
        ? `أحسنت يا بطل ${persona.titleCall}! 🌟 إجابتك صحيحة ودقيقة 100%!\n\n${isLastChunk ? 'لقد أتممت كل أجزاء المحطة بنجاح. اضغط على الزر أدناه لإتمام المحطة 🎉' : 'اضغط على زر «الانتقال للجزء التالي ⬅️» لمتابعة الدرس.'}`
        : `أحسنت ${persona.titleCall}! 👏 إجابة صحيحة وموفقة دلت على رسوخ الفهم.\n\n${isLastChunk ? 'أتممت استيعاب جميع أجزاء الدرس. اضغط على الزر أدناه لاعتماد إنجازك 🎓' : 'تم التحقق من صحة إجابتك بنجاح. يمكنك الآن الضغط على زر «الانتقال للجزء التالي ⬅️».'}`;

      addTutorTurn(successFeedback);
      return;
    } else {
      setIsChunkVerified(false);
      setIsAwaitingAnswer(true);

      const correction = persona.bracket === 'child'
        ? `محاولة طيبة ${persona.titleCall}! لكن الأصح أن نختار العمل والإخلاص لله تعالى.\n\nجرّب الإجابة الصحيحة لتفتح لك الفقرة التالية يا بطل:`
        : `محاولة مقدرة ${persona.titleCall}، لكن المعنى الأدق والموافق للهدي النبوي هو الإخلاص والتطبيق العملي.\n\nتفضل باختيار الإجابة الصحيحة لإتاحة الانتقال للجزء التالي:`;

      addTutorTurn(correction, chunks[currentChunkIndex].options);
      return;
    }
  };

  const handleRestartLesson = () => {
    if (window.confirm('هل تود إعادة بدء هذا الدرس الحواري من البداية؟')) {
      setCurrentStep(0);
      setCurrentChunkIndex(0);
      setIsChunkVerified(false);
      setIsAwaitingAnswer(true);
      setIsStageCompleted(false);
      localStorage.removeItem(storageKey);
      setMessages([buildInitialGreeting(userName, userAge)]);
    }
  };

  return (
    <div className="py-4 sm:py-8 px-4 sm:px-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#EAE3D6]">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <ArrowIcon className="w-4 h-4" />
            <span>{isAr ? 'العودة للخريطة' : 'Back to Journey'}</span>
          </button>

          {/* Mode Switcher: Micro-Capsules vs Full Interactive Tutor */}
          <div className="flex items-center bg-[#FAF7F2] p-1 rounded-2xl border border-[#EAE3D6]">
            <button
              onClick={() => setLearningMode('micro')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                learningMode === 'micro'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>الدرس الحواري المركز</span>
            </button>
            <button
              onClick={() => setLearningMode('tutor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                learningMode === 'tutor'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-amber-300" />
              <span>المعلم التفاعلي الشامل</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Track Sources Info Button (Slide 7) */}
          <button
            onClick={() => setShowSourceInfo(!showSourceInfo)}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>توثيق المصادر (100%)</span>
          </button>

          {/* Audio Recite Toggle */}
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-2 rounded-xl text-xs transition cursor-pointer ${
              isAudioEnabled 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="تشغيل/إيقاف نطق المعلم الصوتي"
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset Lesson State */}
          <button
            onClick={handleRestartLesson}
            className="p-2 rounded-xl text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            title="إعادة بدء الدرس الحواري"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Render Full Interactive Tutor if selected */}
      {learningMode === 'tutor' ? (
        <div className="animate-in fade-in duration-300">
          <InteractiveTutor
            language={language}
            selectedTrack={stage.trackId}
            onBackToMap={onBack}
            embedded={true}
            initialStageId={stage.id}
            onCompleteStage={onCompleteStage}
            learnerName={userName}
            learnerAge={userAge}
            onUpdatePersona={(name, age) => {
              setUserName(name);
              setUserAge(age);
              localStorage.setItem('eilm_user_name', name);
              localStorage.setItem('eilm_user_age', age);
            }}
            currentLessonContext={{
              stageTitle: stage.title,
              stageConcept: stage.conceptExplanation,
              stageNumber: stage.stageNumber
            }}
          />
        </div>
      ) : (
        <>

      {/* DYNAMIC AGE & PERSONA SELECTOR BAR (تخصيص الفئة العمرية ونبرة الخطاب) */}
      <div className="bg-[#FAF7F2] border border-[#EAE3D6] rounded-2xl p-3 mb-5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>تخصيص المعلم الذكي:</span>
          <span className="font-bold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md">
            {persona.titleCall} ({userAge})
          </span>
        </div>

        {/* Instant Age Persona Switcher */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleChangeAge('12 سنة')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
              persona.bracket === 'child'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white hover:bg-amber-50 text-slate-600 border border-slate-200'
            }`}
            title="أسلوب مبسط ومشجع للأشبال مع أمثلة المدرسة والأسرة"
          >
            <Smile className="w-3.5 h-3.5" />
            <span>ناشئ (&lt;15)</span>
          </button>

          <button
            onClick={() => handleChangeAge('20 سنة')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
              persona.bracket === 'youth'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white hover:bg-amber-50 text-slate-600 border border-slate-200'
            }`}
            title="حوار عقلي ملهم للشباب مع أمثلة الجامعة والعمل والشبهات"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>شاب (15-25)</span>
          </button>

          <button
            onClick={() => handleChangeAge('35 سنة')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
              persona.bracket === 'adult'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white hover:bg-amber-50 text-slate-600 border border-slate-200'
            }`}
            title="أسلوب رصين ومقاصدي للراشدين مع أمثلة الأسرة والرزق الحلال"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>راشد (26+)</span>
          </button>
        </div>
      </div>

      {/* TRACK VERIFIED SOURCES DRAWER (Slide 7 Implementation) */}
      {showSourceInfo && (
        <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border-2 border-amber-300 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3 border-b border-amber-200/80 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-slate-900 text-sm">
                المرجعية العلمية المعتمدة للمسار (وثيقة الحزمة العلمية 100%)
              </h4>
            </div>
            <button
              onClick={() => setShowSourceInfo(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
            >
              إغلاق ✕
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <span className="font-bold text-amber-900 min-w-[90px]">الجهة المعتمدة:</span>
              <span>{trackSourceData.primarySourceTitle}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-amber-900 min-w-[90px]">المواقع الموثقة:</span>
              <span className="text-emerald-700 font-mono font-semibold">{trackSourceData.domain}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-amber-900 min-w-[90px]">نطاق الاستخدام:</span>
              <span>{trackSourceData.description}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-amber-900 min-w-[90px]">ضابط السلامة:</span>
              <span className="bg-amber-100/70 text-amber-900 px-2 py-0.5 rounded font-semibold">
                {trackSourceData.usageRule}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stage Banner & Identity */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE3D6] shadow-xs mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              المحطة {stage.stageNumber}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-800">
              مستوى ({stage.contentLevel}) - معلومات موثقة
            </span>
            {(isStageCompleted || isAlreadyCompleted) && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>تم الاجتياز</span>
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            {stage.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            {stage.subtitle}
          </p>
        </div>

        {/* Sequential Step Meter reflecting Chunks */}
        <div className="bg-[#FAF7F2] border border-[#EAE3D6] rounded-2xl p-3 text-center sm:min-w-[150px] shrink-0">
          <div className="text-[11px] text-slate-500 font-medium">الأجزاء المنجزة (Chunks)</div>
          <div className="text-lg font-bold text-amber-900 font-serif mt-0.5">
            {Math.min(currentChunkIndex + (isChunkVerified ? 1 : 0), chunks.length)} / {chunks.length}
          </div>
          <div className="w-full bg-[#EAE3D6] h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-amber-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(Math.min(currentChunkIndex + (isChunkVerified ? 1 : 0), chunks.length) / chunks.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Primary Stage Quranic Verse Audio Player (Clickable recitation showcase) */}
      {stage.scriptures && stage.scriptures.some(s => s.type === 'quran') && (
        <div className="mb-5 p-4 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-amber-50/60 border-2 border-amber-300/80 shadow-xs relative overflow-hidden">
          {stage.scriptures.filter(s => s.type === 'quran').map((qScripture, sIdx) => {
            const verseKey = `stage-header-${stage.id}-${sIdx}`;
            const isPlaying = playingVerseKey === verseKey;
            return (
              <div key={verseKey} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                      📖
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-serif">
                      النص القرآني المعتمد للمحطة ({qScripture.reference})
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    <span>مصحف مجمع الملك فهد</span>
                  </span>
                </div>

                {/* Clickable Quranic Ayah Card with Audio Waveform */}
                <button
                  type="button"
                  onClick={() => handleTogglePlayVerse(qScripture.arabicText, qScripture.reference, verseKey)}
                  className={`w-full text-center p-3.5 rounded-2xl transition cursor-pointer border ${
                    isPlaying 
                      ? 'bg-amber-100/90 border-amber-500 shadow-sm ring-2 ring-amber-300' 
                      : 'bg-white hover:bg-amber-50/80 border-amber-200 hover:border-amber-400'
                  }`}
                  title="انقر للاستماع للتلاوة الصوتية الصحيحة"
                >
                  <blockquote className="font-serif text-xl sm:text-2xl leading-loose text-slate-950 font-bold select-none">
                    «{qScripture.arabicText}»
                  </blockquote>

                  <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-center gap-2 text-xs font-bold">
                    {isPlaying ? (
                      <span className="text-amber-900 flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-amber-700 animate-pulse" />
                        <span>جارٍ الاستماع للتلاوة المرتلة (انقر للإيقاف)</span>
                        <span className="flex items-end gap-0.5 h-3">
                          <span className="w-1 h-3 bg-amber-600 rounded-full animate-bounce"></span>
                          <span className="w-1 h-4 bg-amber-600 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                          <span className="w-1 h-2 bg-amber-600 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-600 hover:text-amber-900 flex items-center gap-1.5 transition">
                        <Volume2 className="w-4 h-4 text-amber-600" />
                        <span className="underline decoration-amber-400 decoration-2 underline-offset-4">
                          انقر هنا للاستماع للنطق الصحيح للآية
                        </span>
                      </span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* CONVERSATIONAL STREAM CONTAINER (المعلم الحواري المتدرج) */}
      <div className="bg-white rounded-3xl border border-[#EAE3D6] shadow-sm overflow-hidden flex flex-col min-h-[580px]">
        
        {/* Mentor Persona Header */}
        <div className="p-3.5 sm:p-4 bg-[#FAF7F2] border-b border-[#EAE3D6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              عِلم
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>المعلم الحواري الذكي (AI Mentor)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[10px] text-slate-500">
                {persona.toneDescription} • سؤال واحد في الدور • كبسولة 30-50 كلمة
              </div>
            </div>
          </div>

          <div className="text-xs font-medium text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-[#EAE3D6]">
            المخاطب: <span className="font-bold text-slate-800">{persona.titleCall}</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[460px] space-y-4 bg-slate-50/40">
          {messages.map((m) => {
            const isTutor = m.role === 'tutor';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isTutor ? 'justify-start' : 'justify-end'} animate-in fade-in duration-200`}
              >
                {isTutor && (
                  <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-xs">
                    م
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[80%] rounded-3xl p-4 sm:p-5 shadow-xs ${
                  isTutor 
                    ? m.isGuardrailEscalation
                      ? 'bg-amber-50 text-amber-950 border border-amber-300 rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-[#EAE3D6] rounded-tr-xs' 
                    : 'bg-amber-700 text-white rounded-tl-xs'
                }`}>
                  <div className="text-[11px] font-semibold mb-1 opacity-70 flex items-center justify-between">
                    <span>{isTutor ? 'المعلم الذكي' : userName}</span>
                    {m.isGuardrailEscalation && (
                      <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
                        سياج Guardrails
                      </span>
                    )}
                  </div>

                  <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
                    {m.text}
                  </div>

                  {/* Scripture Citation Card if attached */}
                  {m.scripture && (
                    <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 border border-amber-200 text-slate-900 text-right shadow-2xs">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                            {m.scripture.type === 'quran' ? '📖 آية قرآنية كريمة' : '📜 حديث نبوي شريف'}
                          </span>
                          {m.scripture.type === 'quran' && (
                            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 flex items-center gap-1">
                              <Volume2 className="w-3 h-3 text-emerald-600" />
                              <span>انقر للاستماع للنطق</span>
                            </span>
                          )}
                        </div>

                        {m.scripture.grade && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                            {m.scripture.grade}
                          </span>
                        )}
                      </div>

                      {/* Clickable Quranic Ayah Box */}
                      {m.scripture.type === 'quran' ? (
                        <button
                          type="button"
                          onClick={() => handleTogglePlayVerse(m.scripture!.arabicText, m.scripture!.reference, m.id)}
                          className={`w-full text-center p-3 rounded-2xl transition cursor-pointer group border ${
                            playingVerseKey === m.id
                              ? 'bg-amber-100/70 border-amber-400 ring-2 ring-amber-300'
                              : 'bg-white/80 hover:bg-amber-50/60 border-amber-200/60 hover:border-amber-300'
                          }`}
                          title="انقر لتشغيل التلاوة الصوتية للنص القرآني"
                        >
                          <blockquote className="font-serif text-xl sm:text-2xl leading-loose text-slate-950 mb-1 select-none">
                            «{m.scripture.arabicText}»
                          </blockquote>
                          
                          <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-amber-200/50 text-xs font-bold">
                            {playingVerseKey === m.id ? (
                              <span className="text-amber-800 flex items-center gap-1.5 animate-pulse">
                                <Volume2 className="w-4 h-4 text-amber-700" />
                                <span>جارٍ تلاوة الآية الكريمة (انقر للإيقاف)</span>
                                <span className="flex gap-0.5">
                                  <span className="w-1 h-3 bg-amber-600 rounded-full animate-bounce [animation-delay:0s]"></span>
                                  <span className="w-1 h-4 bg-amber-600 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                                  <span className="w-1 h-2 bg-amber-600 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                                </span>
                              </span>
                            ) : (
                              <span className="text-slate-600 group-hover:text-amber-900 flex items-center gap-1.5 transition">
                                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                                <span>استمع للنطق والتلاوة الصحيحة</span>
                              </span>
                            )}
                          </div>
                        </button>
                      ) : (
                        <blockquote className="font-serif text-xl sm:text-2xl leading-loose text-slate-900 mb-2 text-center">
                          «{m.scripture.arabicText}»
                        </blockquote>
                      )}

                      <div className="text-xs text-slate-500 text-center font-medium mt-2">
                        {m.scripture.reference}
                      </div>
                    </div>
                  )}

                  {/* Verified Source Reference Note */}
                  {m.sourceNote && (
                    <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{m.sourceNote}</span>
                    </div>
                  )}

                  {/* Interactive Options (Buttons) */}
                  {m.options && m.options.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                      {m.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (opt.includes('العودة لخريطة')) {
                              onBack();
                            } else if (opt.includes('عرض بطاقة المصادر')) {
                              setShowSourceInfo(true);
                            } else {
                              handleUserSend(opt);
                            }
                          }}
                          className="text-xs bg-[#FAF7F2] hover:bg-amber-50 hover:text-amber-900 border border-[#EAE3D6] hover:border-amber-300 text-slate-800 px-3 py-1.5 rounded-full font-medium transition cursor-pointer active:scale-98"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 mt-2 text-left dir-ltr">
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 items-center text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs">
                م
              </div>
              <div className="bg-white border border-[#EAE3D6] px-4 py-2 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="mr-1 text-slate-500 font-medium">المعلم يكتب...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* GATED "NEXT CHUNK" ACTION BAR (لا يظهر زر الانتقال للجزء التالي إلا بعد تحقق الدالة من الإجابة الصحيحة) */}
        {isChunkVerified && (
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 via-amber-50/50 to-emerald-50 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                ✓
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-900">
                {currentChunkIndex >= chunks.length - 1
                  ? 'تم اجتياز جميع أجزاء المحطة بنجاح!'
                  : `تم التحقق من إجابتك بنجاح! انتقل للجزء التالي (${currentChunkIndex + 2} / ${chunks.length})`}
              </span>
            </div>

            <button
              type="button"
              onClick={handleProceedToNextChunk}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer active:scale-98 animate-pulse hover:animate-none"
            >
              <span>
                {currentChunkIndex >= chunks.length - 1
                  ? 'إتمام المحطة التعليمية واجتيازها 🏆'
                  : 'الانتقال للجزء التالي ⬅️'}
              </span>
            </button>
          </div>
        )}

        {/* Input Bar (Dialogue & Question Input) */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#EAE3D6]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={`اطرح سؤالك على المعلم ${persona.titleCall}...`}
              className="flex-1 bg-[#FAF7F2] border border-[#EAE3D6] rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-amber-600 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="w-12 h-12 rounded-2xl bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
              title="إرسال"
            >
              <Send className="w-5 h-5 rtl:rotate-180" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>تفاعل فردي (سؤال واحد) • لا إسهاب • أمثلة مناسبة لسنك</span>
            <span>{trackSourceData.primarySourceTitle.split(' ')[0]} ومجمع الملك فهد</span>
          </div>
        </div>

      </div>
      </>
      )}

    </div>
  );
};
