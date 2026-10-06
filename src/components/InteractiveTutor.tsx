import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw, 
  ArrowLeft, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  User, 
  Printer, 
  Compass,
  Layers,
  ArrowUpRight,
  Mic,
  MicOff,
  Sliders,
  ShieldCheck,
  Phone,
  FileText
} from 'lucide-react';
import { Language, TrackId, DialoguePreferences } from '../types';
import { parseLearnerPersona, adaptCapsuleForAge, LearnerPersona } from '../utils/tutorPersona';
import { loadDialoguePreferences } from '../utils/dialoguePreferences';
import { FormattedMessage } from './FormattedMessage';
import { DialoguePreferencesModal } from './DialoguePreferencesModal';
import { getTutorTrackMeta } from '../data/tutorContent';
import { UI_TRANSLATIONS } from '../data/translations';

export interface InteractiveTutorProps {
  language: Language;
  selectedTrack: TrackId;
  onBackToMap: () => void;
  onSwitchTrack?: (track: TrackId) => void;
  onOpenFatwaTicket?: (userQuestion?: string, category?: any, ticketCode?: string) => void;
  embedded?: boolean;
  initialStageId?: string;
  onCompleteStage?: (stageId: string) => void;
  // Dynamic Learner Context from LessonView / App Context
  learnerName?: string;
  learnerAge?: string;
  onUpdatePersona?: (name: string, age: string) => void;
  currentLessonContext?: {
    stageTitle: string;
    stageConcept: string;
    stageNumber: number;
  };
}

interface Message {
  id: string;
  role: 'tutor' | 'user';
  text: string;
  timestamp: string;
  options?: string[];
  isQuestion?: boolean;
  fatwaTicket?: {
    question: string;
    category: 'طلاق وأحوال شخصية' | 'مواريث وتركات' | 'نزاعات مالية' | 'نوازل وقضايا عامة';
    ticketCode: string;
  };
}

export const InteractiveTutor: React.FC<InteractiveTutorProps> = ({
  language,
  selectedTrack,
  onBackToMap,
  onSwitchTrack,
  onOpenFatwaTicket,
  embedded = false,
  initialStageId,
  onCompleteStage,
  learnerName,
  learnerAge,
  onUpdatePersona,
  currentLessonContext,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Localized Track Metadata Definition with untouched Quranic Arabic verses
  const activeTrackMeta = getTutorTrackMeta(selectedTrack, language);

  // Session State - read directly from props or localStorage
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4>(() => {
    const hasName = learnerName || localStorage.getItem('eilm_user_name');
    const hasAge = learnerAge || localStorage.getItem('eilm_user_age');
    return hasName && hasAge ? 2 : 1;
  });
  const [stageProgress, setStageProgress] = useState<number>(() => {
    const hasName = learnerName || localStorage.getItem('eilm_user_name');
    const hasAge = learnerAge || localStorage.getItem('eilm_user_age');
    return hasName && hasAge ? 45 : 15;
  });

  const [userName, setUserName] = useState<string>(() => {
    const raw = learnerName || localStorage.getItem('eilm_user_name') || '';
    if (raw.includes('ماحكم') || raw.includes('ما حكم') || raw.includes('حكم') || raw.length > 20) {
      localStorage.removeItem('eilm_user_name');
      return '';
    }
    return raw;
  });
  const [userAge, setUserAge] = useState<string>(() => {
    return learnerAge || localStorage.getItem('eilm_user_age') || '';
  });

  const handleResetTutorSession = () => {
    localStorage.removeItem('eilm_user_name');
    localStorage.removeItem('eilm_user_age');
    setUserName('');
    setUserAge('');
    setCurrentStage(1);
    setConfirmedTrack(false);
    setStageProgress(15);
    setMessages([
      {
        id: `m-welcome-${Date.now()}`,
        role: 'tutor',
        text: activeTrackMeta.welcomeMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: isAr
          ? ['أنا اسمي محمد', 'أنا عبد الله', 'اسمي سارة', 'اسمي خالد']
          : ['My name is Sarah', 'My name is Michael', 'My name is David', 'My name is Aisha']
      }
    ]);
  };

  // Keep state in sync if prop changes dynamically
  useEffect(() => {
    if (learnerName && learnerName !== userName) {
      setUserName(learnerName);
    }
  }, [learnerName]);

  useEffect(() => {
    if (learnerAge && learnerAge !== userAge) {
      setUserAge(learnerAge);
    }
  }, [learnerAge]);

  const [dialoguePreferences, setDialoguePreferences] = useState<DialoguePreferences>(() => {
    return loadDialoguePreferences();
  });
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);

  const [confirmedTrack, setConfirmedTrack] = useState<boolean>(false);
  const [userGoals, setUserGoals] = useState<string>('');

  // Dynamically calculated persona (Child, Youth, Adult) with title call and tone
  const persona = parseLearnerPersona(userAge, userName);

  // Helper to enforce Strict Single-Question Rule on any tutor response
  const enforceSingleQuestion = (text: string): string => {
    // If text contains multiple question marks (؟ or ?), keep only the first question
    const qMarkRegex = /[؟?]/g;
    const matches = [...text.matchAll(qMarkRegex)];
    if (matches.length > 1) {
      // Find position of first question mark
      const firstQIndex = matches[0].index!;
      // Find end of the first question sentence
      const truncated = text.substring(0, firstQIndex + 1);
      return truncated.trim();
    }
    return text.trim();
  };

  const [currentUnitIndex, setCurrentUnitIndex] = useState<number>(0);
  const [unitSubStep, setUnitSubStep] = useState<'explanation' | 'asking_clarity' | 'quiz_check'>('explanation');

  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isCertified, setIsCertified] = useState<boolean>(false);

  // Helper to adapt unit explanation to learner persona & age
  const formatAdaptiveUnitPart = (unitPartText: string, p: LearnerPersona, unitTitle: string): string => {
    return adaptCapsuleForAge(unitPartText, p, 1, unitTitle);
  };

  // Helper to format adaptive clarity question adhering strictly to single question rule
  const formatAdaptiveClarityQuestion = (p: LearnerPersona): string => {
    if (p.bracket === 'child') {
      return `هل هذه الفكرة سهلة وواضحة لك يا بطل ${userName}؟`;
    }
    if (p.bracket === 'youth') {
      return `هل تجد هذا المعنى واضحاً ومنطقياً لذهنك ${p.titleCall}؟`;
    }
    return `هل هذا الأصل جلي ومستقر لديك ${p.titleCall}؟`;
  };

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API Speech-to-Text Recognition for Interactive Tutor
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (finalTrans) {
          setInputVal(finalTrans);
          setInterimTranscript('');
          setIsListening(false);
          // Auto send after brief verification moment
          setTimeout(() => {
            handleSendMessage(finalTrans);
          }, 350);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
        setInterimTranscript('');
        if (err.error === 'not-allowed') {
          setSpeechError(language === 'ar' ? 'يرجى السماح بصلاحية الميكروفون في المتصفح' : 'Please allow microphone access');
          setTimeout(() => setSpeechError(null), 4000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(language === 'ar' ? 'عذراً، متصفحك لا يدعم الإدخال الصوتي المباشر.' : 'Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isFirstMountRef = useRef(true);

  // Build adaptive welcome message based on persona if name is already known
  const getInitialWelcomeMessage = (name: string, ageStr: string): string => {
    if (name) {
      const p = parseLearnerPersona(ageStr, name);
      if (currentLessonContext) {
        return isAr
          ? `السلام عليكم ورحمة الله وبركاته ${p.titleCall}.\n\nحياك الله في «${currentLessonContext.stageTitle}» ضمن ${activeTrackMeta.titleAr}.\n\n${adaptCapsuleForAge(currentLessonContext.stageConcept, p, 1)}\n\nهل هذا المفهوم واضح وجلي لك يا ${name} حتى الآن؟`
          : `Peace and blessings be upon you ${p.titleCall}.\n\nWelcome to "${currentLessonContext.stageTitle}" within ${activeTrackMeta.titleEn}.\n\n${adaptCapsuleForAge(currentLessonContext.stageConcept, p, 1)}\n\nIs this concept clear to you, ${name}, so far?`;
      }
      return isAr
        ? `السلام عليكم ورحمة الله وبركاته ${p.titleCall}.\n\nحياك الله في ${activeTrackMeta.titleAr}. يسعدني أن أكون رفيقك ومعلمك اليوم.\n\n${activeTrackMeta.verifyQ}`
        : `Peace and blessings be upon you ${p.titleCall}.\n\nWelcome to ${activeTrackMeta.titleEn}. I am delighted to be your mentor today.\n\n${activeTrackMeta.verifyQ}`;
    }
    return activeTrackMeta.welcomeMsg;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      role: 'tutor',
      text: getInitialWelcomeMessage(userName, userAge),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: userName
        ? activeTrackMeta.verifyOptions
        : (isAr
            ? ['أنا اسمي محمد', 'أنا عبد الله', 'اسمي سارة', 'اسمي خالد']
            : ['My name is Sarah', 'My name is Michael', 'My name is David', 'My name is Aisha'])
    }
  ]);

  // Handle instant age/persona switcher directly from within the tutor
  const handleUpdateAgeBracket = (newAgeStr: string) => {
    setUserAge(newAgeStr);
    localStorage.setItem('eilm_user_age', newAgeStr);
    if (onUpdatePersona) {
      onUpdatePersona(userName, newAgeStr);
    }
    const newPersona = parseLearnerPersona(newAgeStr, userName);
    const updateNotice = `تم ضبط نبرة المعلم ومستوى التبسيط لتلائم فئة (${newPersona.bracket === 'child' ? 'الناشئة والأشبال' : newPersona.bracket === 'youth' ? 'الشباب' : 'الراشدين'}) يا ${newPersona.titleCall} ✨\n\nهل نواصل جولتنا التعليمية معاً؟`;
    addTutorMessage(enforceSingleQuestion(updateNotice), ['نعم لنواصل على بركة الله', 'مستعد']);
  };

  // Reset or initialize when track changes
  useEffect(() => {
    resetSession(selectedTrack);
  }, [selectedTrack]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      scrollToBottom('instant');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    scrollToBottom('smooth');
  }, [messages, isTyping]);

  const speakText = (text: string) => {
    if (!isAudioEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_~]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech error:', e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    setInputVal('');

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/interactive-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          trackId: selectedTrack,
          history: newMessages.slice(-8),
          userData: {
            name: userName,
            age: userAge,
            confirmed: confirmedTrack,
            stage: currentStage === 1 ? 'onboarding' : currentStage === 2 ? 'curriculum_overview' : currentStage === 3 ? 'teaching' : 'assessment'
          },
          preferences: dialoguePreferences
        })
      });

      const data = await response.json();
      processTutorStep(text, data.reply, data.detectedName, data.detectedAge);
    } catch (e) {
      console.warn('Backend tutor fallback:', e);
      processTutorStep(text);
    } finally {
      setIsTyping(false);
    }
  };

  // Deterministic Step-by-Step Flow complying strictly with QA requirements
  const processTutorStep = (
    userText: string, 
    aiGeneratedReply?: string, 
    detectedName?: string, 
    detectedAge?: string
  ) => {
    const clean = userText.toLowerCase().trim();

    // -------------------------------------------------------------
    // GUARDRAIL: Strict Hard Stop on Level D (Personal Fatwa / Dispute)
    // -------------------------------------------------------------
    const levelDPatterns = [
      'طلاق', 'طالق', 'طلقت', 'مطلقة', 'مطلق', 'خلع', 'مخالعة', 
      'ميراث', 'تركة', 'ورثة', 'تركات', 'تقسيم الميراث', 'مات وترك', 'توفي وترك',
      'فسخ نكاح', 'رجعة', 'عدة المطلقة', 'عدة الأرملة', 'عقد نكاح باطل',
      'نزاع مالي', 'تحاكم قضائي', 'دعوى قضائية', 'حكم القاضي', 'حد القذف', 'شبهة زنا'
    ];
    const isLevelD = levelDPatterns.some(pattern => clean.includes(pattern));

    if (isLevelD) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const code = `FATWA-REF-2026-${randomSuffix}`;
      const cat = (clean.includes('ميراث') || clean.includes('تركة') || clean.includes('ورث')) 
        ? 'مواريث وتركات' 
        : (clean.includes('دين') || clean.includes('نزاع') || clean.includes('قرض'))
        ? 'نزاعات مالية'
        : 'طلاق وأحوال شخصية';

      const reply = isAr
        ? `⚠️ **تنبيه الحوكمة الشرعية (المستوى د - امتناع وإحالة رسمية):**\n\nأهلاً بك يا ${persona.titleCall}. بناءً على وثيقة حوكمة المحتوى الشرعي لمنصة «عِلم» ومعايير الأمان الفقهي، يمتنع الذكاء الاصطناعي منعاً باتاً عن إصدار أي فتوى أو ترجيح آلي في قضايا الطلاق والأحوال الشخصية، والمواريث والتركات، والنزاعات القضائية.\n\nحرصاً على أمانتكم، تم توليد **بطاقة إحالة إفتائية رسمية مشفرة** برقم استناد (${code}) لنقل مسألتكم مباشرة إلى الرئاسة العامة للبحوث العلمية والإفتاء بالمملكة العربية السعودية.`
        : `⚠️ **Content Governance Notice (Level D - Official Referral):**\n\nUnder ILM platform governance, the system strictly refrains from issuing automated personal decrees on divorce, inheritance, or legal disputes. An official referral ticket (#${code}) has been generated for direct submission to certified authorities in KSA.`;

      addTutorMessage(reply, [isAr ? 'فتح البطاقة الإفتائية 📋' : 'View Fatwa Ticket 📋', isAr ? 'متابعة مدارسة الدرس 📖' : 'Continue Lesson 📖'], false, {
        question: userText,
        category: cat,
        ticketCode: code
      });
      return;
    }

    if (clean.includes('فتح البطاقة الإفتائية') || clean.includes('بطاقة الإفتاء') || clean.includes('fatwa ticket')) {
      if (onOpenFatwaTicket) {
        onOpenFatwaTicket();
      }
      return;
    }

    const inquiryKeywords = [
      'ما حكم', 'ماحكم', 'حكم', 'هل يجوز', 'هل حرام', 'حلال', 'حرام', 'ما هو', 'ما هي', 'كيف', 'لماذا', 
      'اقتبس', 'سورة', 'آية', 'حديث', 'معنى', 'تفسير', 'أين', 'متى', 'من هو', 'أريد أن أسأل', 
      'سؤال', 'استفسار', 'موسيقى', 'الموسيقى', 'الغناء', 'الصلاة', 'الوضوء', 'الصيام', 'التوحيد', 'الشرك',
      'هجوم', 'سب', 'طعن', 'ديانة', 'أديان'
    ];
    const isUserAskingQuestion = userText.includes('؟') || userText.includes('?') || inquiryKeywords.some(kw => clean.includes(kw)) || userText.length > 25;

    // -------------------------------------------------------------
    // STAGE 1: Onboarding (One Question Rule)
    // -------------------------------------------------------------
    if (currentStage === 1) {
      // If user asked a question instead of introducing their name
      if (!userName && isUserAskingQuestion) {
        const qReply = aiGeneratedReply && aiGeneratedReply.trim()
          ? aiGeneratedReply.trim()
          : clean.includes('موسيق') || clean.includes('غناء')
          ? 'وعليكم السلام ورحمة الله! حكم المعازف والموسيقى: ذهب جمهور أئمة المذاهب الأربعة إلى تحريم المعازف استناداً لحديث البخاري: «ليكونن من أمتي أقوام يستحلون الحر والحرير والخمر والمعازف»، مع رخصة بعضهم في الدف في الأعراس. وصيانة القلب بالقرآن أولى. وبالمناسبة، ما هو اسمك الكريم حتى أتشرف بمعرفتك؟'
          : 'أهلاً بك وسعدت بتساؤلك المبارك! في ديننا الحنيف نجد لكل مسألة بياناً شافياً بالحكمة والدليل الصحيح من مجمع الملك فهد والدرر السنية. ما اسمك الكريم حتى نناديك به ونكمل مدارستنا؟';
        addTutorMessage(qReply, ['أنا اسمي يزيد', 'أنا محمد', 'أنا عبد الله', 'اسمي سارة']);
        return;
      }

      // Step 1: Extract Name (when userName is empty)
      if (!userName) {
        const cleanName = detectedName || userText
          .replace(/^(السلام عليكم|أنا اسمي|اسمي هو|اسمي|معك|حياك الله|أنا|انا)/gi, '')
          .trim()
          .split(' ')[0] || userText;

        const isPureDigit = /^\d+$/.test(cleanName);
        const validName = isPureDigit ? 'أخي الفاضل' : cleanName;

        setUserName(validName);
        if (!isPureDigit) {
          localStorage.setItem('eilm_user_name', validName);
        }
        setStageProgress(25);

        const reply = aiGeneratedReply && (aiGeneratedReply.includes('عمر') || aiGeneratedReply.includes('سنة'))
          ? aiGeneratedReply.trim()
          : `أهلاً بك أخي الفاضل ${validName}، شرفنا حضورك! كم يبلغ عمرك الكريم لنخصص لك أسلوب الشرح والأمثلة المناسبة؟`;

        addTutorMessage(reply, ['أقل من 15 سنة (يا بطل)', '15 - 25 سنة (شاب)', '26 - 40 سنة (راشد)', 'أكثر من 40 سنة']);
        return;
      }

      // Step 2: Extract Age -> Ask Track Confirmation Question
      if (!userAge) {
        const validAge = detectedAge || userText.trim();
        setUserAge(validAge);
        localStorage.setItem('eilm_user_age', validAge);
        setStageProgress(35);

        const currentPersona = parseLearnerPersona(validAge, userName);
        const reply = aiGeneratedReply && (aiGeneratedReply.includes('مسار') || aiGeneratedReply.includes('ولدت') || aiGeneratedReply.includes('حقيقة'))
          ? aiGeneratedReply.trim()
          : `${currentPersona.titleCall}، ${activeTrackMeta.verifyQ}`;

        addTutorMessage(reply, activeTrackMeta.verifyOptions);
        return;
      }

      // Step 3: Handle Confirmation of Track
      if (!confirmedTrack) {
        const isNegative = clean === 'لا' || clean.includes('لا ') || clean.startsWith('لا') || clean.includes('لست') || clean.includes('ما ولدت');

        // Check if user is on Born Muslim track but answered "No"
        if (isNegative && selectedTrack === 'muslim') {
          const reply = `حياك الله يا ${userName}! يسعدنا وجودك جداً. بما أنك لم تولد مسلماً، فإن مسار (المسلم الجديد) أو مسار (الباحث عن الحقيقة) قد يكون أنسب وأكثر فائدة لك. هل تفضل أن ننتقل لمسار (المسلم الجديد) الآن، أم تحب أن تكمل معنا هنا في مسار المسلم الأصل؟`;
          addTutorMessage(reply, ['الانتقال لمسار المسلم الجديد ✨', 'البقاء في مسار المسلم الأصل']);
          return;
        }

        // If user chose to switch track
        if (userText.includes('المسلم الجديد')) {
          if (onSwitchTrack) onSwitchTrack('new_muslim');
          return;
        }

        setConfirmedTrack(true);
        setStageProgress(45);

        // Single Question for Motivations (NOT double)
        const p = parseLearnerPersona(userAge, userName);
        const reply = aiGeneratedReply && (aiGeneratedReply.includes('هدف') || aiGeneratedReply.includes('طموح'))
          ? aiGeneratedReply.trim()
          : `ممتاز جداً ${p.titleCall}. ما هو هدفك الأساسي الذي تطمح لتعلمه والتركيز عليه في هذا المسار؟`;

        addTutorMessage(reply, [
          'ترسيخ اليقين وفهم أسباب ومقاصد الأحكام والعبادة',
          'تصحيح المفاهيم وتعميق العلم الشرعي الموثوق',
          'الالتزام العملي والأخلاق النبوية وتجاوز الشبهات'
        ]);
        return;
      }

      // Step 4: Show Curriculum Overview & Ask permission to start
      setUserGoals(userText);
      setCurrentStage(2);
      setStageProgress(50);

      const p = parseLearnerPersona(userAge, userName);
      const reply = `ما شاء الله ${p.titleCall}، طموح مبارك ومقصد نبيل!\n\n${activeTrackMeta.curriculumOverview}`;
      addTutorMessage(reply, ['نعم، مستعد وتوكلنا على الله ✨', 'جاهز لنبدأ الآن']);
      return;
    }

    // -------------------------------------------------------------
    // STAGE 2: Curriculum Overview Confirmed -> Start Teaching
    // -------------------------------------------------------------
    if (currentStage === 2) {
      setCurrentStage(3);
      setStageProgress(55);
      setCurrentUnitIndex(0);
      setUnitSubStep('explanation');

      const unit = activeTrackMeta.units[0];
      const adaptedText = formatAdaptiveUnitPart(unit.part1, persona, unit.title);
      const clarityQ = formatAdaptiveClarityQuestion(persona);
      const reply = `على بركة الله ${persona.titleCall}!\n\nسنبدأ بـ «${unit.title}»:\n\n${adaptedText}\n\n${clarityQ}`;
      addTutorMessage(reply, ['واضح تماماً، اختبرني بالسؤال 👍', 'واضح، لكن هل من توضيح إضافي؟']);
      return;
    }

    // -------------------------------------------------------------
    // STAGE 3: Micro-Learning Interactive Teaching
    // -------------------------------------------------------------
    if (currentStage === 3) {
      const unit = activeTrackMeta.units[currentUnitIndex] || activeTrackMeta.units[0];

      if (unitSubStep === 'explanation') {
        // If user asked a clarifying question or expressed confusion
        const isQuestion = userText.includes('؟') || userText.includes('?') || userText.startsWith('لماذا') || userText.startsWith('كيف') || userText.startsWith('ما هو') || userText.startsWith('ما هي') || clean.includes('مش واضح') || clean.includes('أعد') || clean.includes('توضيح');
        const isClear = !isQuestion && !clean.includes('لا') && !clean.includes('مش واضح') && !clean.includes('أعد');

        if (isClear) {
          setUnitSubStep('quiz_check');
          const reply = persona.bracket === 'child'
            ? `ممتاز يا بطل! لنتأكد من فهمك بسؤال سريع:\n${unit.checkQuestion}`
            : `ممتاز جداً ${persona.titleCall}! بناءً على ما رسخناه للتو، دعنا نتحقق بسؤال تنشيطي مباشر:\n${unit.checkQuestion}`;
          addTutorMessage(reply, unit.checkOptions, true);
        } else {
          // Use AI generated reply if available and relevant, otherwise fall back to refined re-explanation
          const reExplain = aiGeneratedReply && aiGeneratedReply.trim()
            ? aiGeneratedReply.trim()
            : persona.bracket === 'child'
            ? `أبشر ${persona.titleCall}! معناه ببساطة أن نعمل الخير ونطيع ربنا لنكون سعداء ومحبوبين.\n\nهل صارت الفكرة سهلة وجميلة الآن يا بطل؟`
            : `أبشر ${persona.titleCall}، بكل سرور! المقصود ببساطة: حين ننظر لهذا الأصل، فإن غايته صلة العبد بربه بيقين وتطبيق عملي يثمر السكينة.\n\nهل صارت الفكرة أقرب وأوضح لذهنك الآن؟`;
          addTutorMessage(reExplain, ['نعم وضحت تماماً الآن!', 'ممتاز، لنتابع']);
        }
        return;
      }

      if (unitSubStep === 'quiz_check') {
        const correctOpt = unit.checkOptions[unit.correctOptionIndex];
        const isCorrect = userText.trim() === correctOpt || userText.includes(correctOpt) || clean.includes('الأولى') || clean.includes('إفراد') || clean.includes('الإخلاص') || clean.includes('تصديقه') || clean.includes('الرفق');

        if (isCorrect) {
          const nextIndex = currentUnitIndex + 1;
          if (nextIndex < activeTrackMeta.units.length) {
            setCurrentUnitIndex(nextIndex);
            setUnitSubStep('explanation');
            setStageProgress(55 + nextIndex * 12);

            const nextUnit = activeTrackMeta.units[nextIndex];
            const adaptedText = formatAdaptiveUnitPart(nextUnit.part1, persona, nextUnit.title);
            const clarityQ = formatAdaptiveClarityQuestion(persona);
            const reply = `أحسنت ${persona.titleCall}! إجابة دقيقة وصحيحة 👏✨\n\nننتقل الآن للنقطة التالية: «${nextUnit.title}»:\n\n${adaptedText}\n\n${clarityQ}`;
            addTutorMessage(reply, ['واضح تماماً، اختبرني 👍', 'واضح، استمر']);
          } else {
            // Finished all units -> Move to Stage 4 (Final Assessment)
            setCurrentStage(4);
            setStageProgress(85);
            setQuizIndex(0);
            setQuizScore(0);

            const reply = persona.bracket === 'child'
              ? `ما شاء الله عليك ${persona.titleCall}! 🌟 لقد أنهينا جميع دروس هذا المستوى بتفوق وبطولة!\n\nهل أنت مستعد لاختبار ختامي قصير لنكسب وسام الإنجاز؟`
              : `ما شاء الله تبارك الله، لقد أنهينا جميع دروس هذا المستوى ${persona.titleCall}! 🎓✨\n\nهل أنت مستعد لاختبار ختامي موجز لتثبيت ما تعلمناه واستحقاق شهادة الإتمام؟`;
            addTutorMessage(reply, ['نعم مستعد للاختبار النهائي! 📝', 'جاهز، ابدأ الاختبار']);
          }
        } else {
          // Gentle correction without scolding
          const reply = persona.bracket === 'child'
            ? `محاولة رائعة ${persona.titleCall}! ولكن الأجمل في ديننا هو التركيز على الصدق والعمل الصالح ومحبة الله ورسوله.\n\nهل تحب أن تعيد الإجابة يا بطل؟`
            : unit.correctionExplanation(persona.titleCall) + `\n\nهل تود أن تعيد الإجابة لتثبيت الفهم ${persona.titleCall}؟`;
          addTutorMessage(reply, unit.checkOptions, true);
        }
        return;
      }
    }

    // -------------------------------------------------------------
    // STAGE 4: Final Assessment & Certification
    // -------------------------------------------------------------
    if (currentStage === 4) {
      if (!isCertified) {
        const questions = activeTrackMeta.quizQuestions;

        if (clean.includes('مستعد') || clean.includes('جاهز') || clean.includes('ابدأ')) {
          const q = questions[0];
          const reply = `السؤال (1 من ${questions.length}):\n${q.q}`;
          addTutorMessage(reply, q.options, true);
          return;
        }

        if (quizIndex < questions.length) {
          const q = questions[quizIndex];
          const isCorrect = userText.includes(q.options[q.correct]) || clean === q.options[q.correct].toLowerCase();
          const newScore = isCorrect ? quizScore + 1 : quizScore;
          setQuizScore(newScore);

          const nextQIndex = quizIndex + 1;
          setQuizIndex(nextQIndex);

          if (nextQIndex < questions.length) {
            const nextQ = questions[nextQIndex];
            const feedback = isCorrect 
              ? `صحيح ${persona.titleCall}! أحسنت.` 
              : `محاولة طيبة ${persona.titleCall}، والصواب هو: ${q.options[q.correct]}.`;

            const reply = `${feedback}\n\nالسؤال (${nextQIndex + 1} من ${questions.length}):\n${nextQ.q}`;
            addTutorMessage(reply, nextQ.options, true);
          } else {
            setIsCertified(true);
            setStageProgress(100);
            if (onCompleteStage && initialStageId) {
              onCompleteStage(initialStageId);
            }

            const reply = persona.bracket === 'child'
              ? `ما شاء الله لا قوة إلا بالله ${persona.titleCall}! 🌟🏆\n\nلقد اجتزت التقييم الختامي لـ «${activeTrackMeta.titleAr}» ببطولة وتفوق واستحققت وسام الإتمام والشهادة التقديرية! أسأل الله أن يحفظك وينفع بك.`
              : `ما شاء الله لا قوة إلا بالله ${persona.titleCall}! 🎉\n\nلقد اجتزت التقييم الختامي لـ «${activeTrackMeta.titleAr}» بنجاح واستحققت رسمياً «شهادة إتمام مستوى افتراضية». أسأل الله أن ينفعك بما تعلمت وأن يجعلك من الراسخين في العلم والعمل.`;
            addTutorMessage(reply, ['عرض الشهادة التقديرية 📜', 'العودة للخريطة 🗺️']);
          }
          return;
        }
      }
    }

    // Fallback response
    if (aiGeneratedReply) {
      addTutorMessage(aiGeneratedReply);
    } else {
      addTutorMessage(`كلام طيب وموزون ${persona.titleCall}. دعنا نواصل رحلتنا بتدرج وبركة. هل تحب أن ننتقل للنقطة التالية؟`, ['نعم لنكمل', 'واضح ومستعد']);
    }
  };

  const addTutorMessage = (
    text: string, 
    options?: string[], 
    isQuestion?: boolean,
    fatwaTicket?: Message['fatwaTicket']
  ) => {
    // Strictly enforce single-question rule
    const filteredText = enforceSingleQuestion(text);
    const tutorMsg: Message = {
      id: `t-${Date.now()}`,
      role: 'tutor',
      text: filteredText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options,
      isQuestion,
      fatwaTicket
    };
    setMessages(prev => [...prev, tutorMsg]);
    speakText(filteredText);
  };

  const resetSession = (track: TrackId = selectedTrack) => {
    const meta = getTutorTrackMeta(track, language);
    const currentName = learnerName || localStorage.getItem('eilm_user_name') || userName || '';
    const currentAge = learnerAge || localStorage.getItem('eilm_user_age') || userAge || '';
    
    setCurrentStage(currentName && currentAge ? 2 : 1);
    setStageProgress(currentName && currentAge ? 45 : 15);
    setConfirmedTrack(false);
    setUserGoals('');
    setCurrentUnitIndex(0);
    setQuizIndex(0);
    setQuizScore(0);
    setIsCertified(false);
    setMessages([
      {
        id: 'm-welcome',
        role: 'tutor',
        text: getInitialWelcomeMessage(currentName, currentAge),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: currentName ? meta.verifyOptions : ['أنا اسمي محمد', 'أنا عبد الله', 'اسمي سارة', 'اسمي خالد']
      }
    ]);
  };

  const handlePrintVirtualCertificate = () => {
    const certNum = `EILM-TUTOR-${selectedTrack.toUpperCase().slice(0, 3)}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-7712`;
    const certTitle = isAr ? 'شهادة إتمام مستوى افتراضية' : 'Virtual Completion Certificate';
    const recipient = userName || (isAr ? 'المتعلم المجتهد' : 'Dedicated Learner');
    const trackTitle = activeTrackMeta.title;
    const dateStr = isAr ? new Date().toLocaleDateString('ar-SA') : new Date().toLocaleDateString('en-US');

    const htmlContent = `<!DOCTYPE html>
<html lang="${language}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8" />
  <title>${certTitle} - ${recipient}</title>
  <style>
    @page { size: landscape; margin: 8mm; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Arabic', sans-serif;
      background-color: #FAF9F5;
      margin: 0;
      padding: 16px;
      color: #0F172A;
      direction: ${isAr ? 'rtl' : 'ltr'};
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .cert-frame {
      border: 8px double #1E293B;
      border-radius: 18px;
      background: #FFFFFF;
      padding: 28px 32px;
      text-align: center;
      position: relative;
    }
    .cert-header {
      font-size: 12px;
      font-weight: 700;
      color: #B45309;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .cert-title {
      font-size: 26px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 12px 0;
    }
    .cert-recipient-pre {
      font-size: 13px;
      color: #64748B;
      margin-bottom: 4px;
    }
    .cert-name {
      font-size: 28px;
      font-weight: 900;
      color: #92400E;
      border-bottom: 2px solid #E2E8F0;
      display: inline-block;
      padding: 0 20px 6px 20px;
      margin-bottom: 16px;
    }
    .cert-desc {
      font-size: 14px;
      line-height: 1.7;
      max-width: 600px;
      margin: 0 auto 18px auto;
      color: #334155;
    }
    .cert-grid {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px solid #E2E8F0;
    }
    .badge {
      padding: 4px 12px;
      background: #ECFDF5;
      color: #065F46;
      border: 1px solid #A7F3D0;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
    }
    .id-box {
      font-family: monospace;
      font-size: 11px;
      color: #475569;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="cert-frame">
    <div class="cert-header">منصة عِلم | ILM • المعلم التفاعلي الذكي</div>
    <h1 class="cert-title">${certTitle}</h1>
    <div class="cert-recipient-pre">${isAr ? 'تُشهد منصة عِلم بالتعاون مع المعلم التفاعلي بأن المتعلم:' : 'ILM Platform in collaboration with the Interactive Tutor testifies that:'}</div>
    <div class="cert-name">${recipient}</div>
    <p class="cert-desc">
      ${isAr 
        ? `قد أتم بنجاح محاور «${trackTitle}» واجتاز التقييم الختامي الشامل بدرجة متميزة وفق معايير الموثوقية العلمية لمنصة عِلم.`
        : `Has successfully completed the milestones of "${trackTitle}" and passed the final assessment with excellence.`}
    </p>
    <div class="cert-grid">
      <div style="text-align: ${isAr ? 'right' : 'left'};">
        <div style="font-size: 11px; color: #64748B;">${isAr ? 'تاريخ الإنجاز:' : 'Date:'}</div>
        <div style="font-weight: 800; font-size: 12px;">${dateStr}</div>
      </div>
      <div>
        <span class="badge">🛡️ ${isAr ? 'مجتاز ومعتمد' : 'Verified & Completed'}</span>
        <div class="id-box" style="margin-top: 4px;">${certNum}</div>
      </div>
      <div style="text-align: ${isAr ? 'left' : 'right'};">
        <div style="font-size: 11px; color: #64748B;">${isAr ? 'الجهة المانحة:' : 'Issuing Entity:'}</div>
        <div style="font-weight: 800; font-size: 12px;">منصة عِلم | ILM Platform</div>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2500);
      }, 400);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8 mobile-bottom-clearance">
      
      {/* Top Header & Breadcrumb */}
      {!embedded && (
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EAE3D6]">
          <button
            onClick={onBackToMap}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <ArrowIcon className="w-4 h-4" />
            <span>{isAr ? 'العودة للمسارات والخريطة' : 'Back to Tracks'}</span>
          </button>

          {/* Audio TTS Toggle and Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                isAudioEnabled 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="تشغيل/إيقاف نطق المعلم الصوتي"
            >
              {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isAudioEnabled ? 'الصوت مفعّل' : 'تفعيل صوت المعلم'}</span>
            </button>

            <button
              onClick={() => resetSession(selectedTrack)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              title="بدء جلسة جديدة"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إعادة البدء</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Tutor Container */}
      <div className="bg-white rounded-3xl border border-[#EAE3D6] shadow-sm overflow-hidden flex flex-col min-h-[640px]">
        
        {/* Tutor Identity Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FAF7F2] via-white to-[#FAF7F2] border-b border-[#EAE3D6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-sm font-bold text-xl">
                <span>عِلم</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                  المعلم التفاعلي الذكي ({activeTrackMeta.titleAr})
                </h2>
                <span className="text-[11px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                  Tutor / Mentor
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                تعلّم حواري خطوة بخطوة وتأكيد الفهم مع كل فكرة
              </p>
            </div>
          </div>

          {/* User Badge & Persona Switcher */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {userName && (
              <div className="flex items-center gap-2 bg-[#F6F1EA] px-3 py-1.5 rounded-2xl border border-[#EAE3D6]">
                <User className="w-3.5 h-3.5 text-amber-700" />
                <div className="text-xs">
                  <span className="text-slate-500">المتعلم: </span>
                  <span className="font-bold text-slate-800">{userName}</span>
                  {userAge && <span className="text-slate-500 text-[11px]"> ({userAge})</span>}
                </div>
              </div>
            )}

            {/* Quick Age Persona Selector */}
            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EAE3D6] text-[11px]">
              <button
                type="button"
                onClick={() => handleUpdateAgeBracket('12 سنة')}
                className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                  persona.bracket === 'child'
                    ? 'bg-amber-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="ناشئ (<15 سنة)"
              >
                ناشئ
              </button>
              <button
                type="button"
                onClick={() => handleUpdateAgeBracket('20 سنة')}
                className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                  persona.bracket === 'youth'
                    ? 'bg-amber-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="شاب (15 - 25 سنة)"
              >
                شاب
              </button>
              <button
                type="button"
                onClick={() => handleUpdateAgeBracket('35 سنة')}
                className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                  persona.bracket === 'adult'
                    ? 'bg-amber-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="راشد (26+ سنة)"
              >
                راشد
              </button>
            </div>

            {/* Dialogue Preferences Modal Trigger Button */}
            <button
              type="button"
              onClick={() => setIsPreferencesOpen(true)}
              className="p-1.5 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-amber-300 shadow-2xs"
              title="تخصيص طول الإجابات ومصادر الاستدلال في Gemini System Instruction"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">تفضيلات الحوار</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-200/80 rounded-md font-bold text-amber-900">
                {dialoguePreferences.responseLength === 'concise' ? 'موجزة ⚡' : dialoguePreferences.responseLength === 'balanced' ? 'متوازنة ⚖️' : 'مفصلة 📚'}
              </span>
            </button>

            {/* Reset Session & Name Button */}
            <button
              type="button"
              onClick={handleResetTutorSession}
              className="p-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
              title="إعادة بدء الحوار وضبط الاسم"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>إعادة ضبط</span>
            </button>
          </div>
        </div>

        {/* 4-Stage Step Tracker Header */}
        <div className="bg-[#FAF7F2] px-4 py-3 border-b border-[#EAE3D6]">
          <div className="flex items-center justify-between text-xs mb-2 font-medium">
            <span className={`flex items-center gap-1 ${currentStage >= 1 ? 'text-amber-800 font-bold' : 'text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center text-[10px]">1</span>
              <span>التعارف</span>
            </span>
            <span className="text-slate-300">←</span>
            <span className={`flex items-center gap-1 ${currentStage >= 2 ? 'text-amber-800 font-bold' : 'text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center text-[10px]">2</span>
              <span>خطة المسار</span>
            </span>
            <span className="text-slate-300">←</span>
            <span className={`flex items-center gap-1 ${currentStage >= 3 ? 'text-amber-800 font-bold' : 'text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center text-[10px]">3</span>
              <span>الشرح والتفاعل</span>
            </span>
            <span className="text-slate-300">←</span>
            <span className={`flex items-center gap-1 ${currentStage >= 4 ? 'text-amber-800 font-bold' : 'text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center text-[10px]">4</span>
              <span>الشهادة</span>
            </span>
          </div>

          <div className="w-full bg-[#EAE3D6] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${stageProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Chat Stream Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[500px] space-y-4 bg-slate-50/40"
        >
          {messages.map((m) => {
            const isTutor = m.role === 'tutor';
            return (
              <div 
                key={m.id}
                className={`flex gap-3 ${isTutor ? 'justify-start' : 'justify-end'} animate-in fade-in duration-300`}
              >
                {isTutor && (
                  <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-xs">
                    {isAr ? 'م' : 'AI'}
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-xs ${
                  isTutor 
                    ? 'bg-white text-slate-800 border border-[#EAE3D6] rounded-tr-xs' 
                    : 'bg-amber-700 text-white rounded-tl-xs'
                }`}>
                  <div className="text-xs font-semibold mb-1 opacity-70">
                    {isTutor ? (isAr ? 'المعلم الذكي' : isUr ? 'ذہین استاد' : 'AI Mentor') : userName || (isAr ? 'أنت' : isUr ? 'آپ' : 'You')}
                  </div>
                  
                  <div className="text-sm leading-relaxed">
                    <FormattedMessage content={m.text} isUser={!isTutor} />
                  </div>

                  {/* Embedded Level D Fatwa Referral Ticket Card */}
                  {m.fatwaTicket && (
                    <div className="mt-3.5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white border border-amber-500/40 space-y-2.5 shadow-md">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                          <span className="text-xs font-bold text-amber-300 truncate">
                            {isAr ? 'تم توليد بطاقة إحالة إفتائية رسمية' : 'Official Fatwa Ticket Generated'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-white/10 border border-white/15 px-2 py-0.5 rounded text-amber-200 shrink-0">
                          {m.fatwaTicket.ticketCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        {isAr
                          ? 'المسألة مصنفة ضمن (المستوى د). يُحظر البت الآلي فيها، ويُتاح لك تصدير التذكرة موثقة أو الاتصال المباشر بمفتي الرئاسة العامة.'
                          : 'Level D Fatwa Stop. Automated decree prohibited. You can view/export the ticket or call the official Ifta hotline.'}
                      </p>
                      <div className="pt-2 border-t border-white/15 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenFatwaTicket) {
                              onOpenFatwaTicket(m.fatwaTicket?.question, m.fatwaTicket?.category, m.fatwaTicket?.ticketCode);
                            }
                          }}
                          className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{isAr ? 'فتح وتصدير البطاقة' : 'View & Export Ticket'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              navigator.clipboard?.writeText('8002451000');
                            } catch {}
                            try {
                              window.location.href = 'tel:8002451000';
                            } catch {
                              window.open('tel:8002451000', '_self');
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                          title={isAr ? 'اتصال مباشر أو نسخ الرقم' : 'Direct call or copy'}
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span dir="ltr">8002451000</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Suggestion Options / Interactive Buttons */}
                  {m.options && m.options.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                      {m.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(opt)}
                          className="text-xs bg-[#FAF7F2] hover:bg-amber-50 hover:text-amber-900 border border-[#EAE3D6] hover:border-amber-300 text-slate-700 px-3 py-1.5 rounded-full font-medium transition cursor-pointer active:scale-98"
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

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 items-center text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs">
                {isAr ? 'م' : 'AI'}
              </div>
              <div className="bg-white border border-[#EAE3D6] px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="mr-1 text-slate-500 font-medium">{isAr ? 'المعلم يكتب...' : isUr ? 'استاد لکھ رہے ہیں...' : 'Mentor is typing...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Certified Virtual Certificate Card (When Stage 4 completes) */}
        {isCertified && (
          <div className="p-6 bg-gradient-to-b from-[#FFFBF2] to-[#FAF7F2] border-t border-amber-200">
            <div className="border-4 border-amber-300/70 p-6 rounded-3xl bg-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-4 border-b border-amber-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-8 h-8 text-amber-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{isAr ? 'شهادة إتمام مستوى افتراضية' : 'Virtual Completion Certificate'}</h3>
                    <p className="text-xs text-amber-800 font-medium">{activeTrackMeta.certSubtitle}</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-full">
                  {isAr ? 'معتمد ومجتاز' : 'Verified & Completed'}
                </span>
              </div>

              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-slate-500">{isAr ? 'تُشهد منصة عِلم بالتعاون مع المعلم التفاعلي بأن:' : 'ILM Platform in collaboration with the Interactive Tutor testifies that:'}</p>
                <h4 className="text-2xl font-bold text-slate-900 font-brand tracking-wide">
                  {userName || (isAr ? 'المتعلم المجتهد' : 'Dedicated Learner')}
                </h4>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  {isAr 
                    ? `قد أتم بنجاح محاور ${activeTrackMeta.title} واجتاز التقييم الختامي الشامل بدرجة متميزة.`
                    : `Has successfully completed the milestones of ${activeTrackMeta.title} and passed the final assessment with excellence.`}
                </p>
                <div className="pt-2 text-[11px] text-slate-400">
                  {isAr 
                    ? `تاريخ الإتمام: ${new Date().toLocaleDateString('ar-SA')} | المعلم الحواري الذكي`
                    : `Completion Date: ${new Date().toLocaleDateString('en-US')} | Intelligent Interactive Mentor`}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-amber-100">
                <button
                  onClick={handlePrintVirtualCertificate}
                  className="flex items-center gap-1.5 text-xs bg-amber-700 hover:bg-amber-800 text-white font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isAr ? 'طباعة الشهادة' : 'Print Certificate'}</span>
                </button>
                <button
                  onClick={onBackToMap}
                  className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  <span>{isAr ? 'متابعة الخريطة والمراحل المتقدمة' : 'Continue to Journey Map'}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Bar with Speech-to-Text Recognition Indicator */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#EAE3D6] space-y-2">
          
          {/* Live Voice Speech-to-Text Transcription Banner */}
          {isListening && (
            <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                </span>
                <span className="font-bold">
                  {language === 'ar' ? 'جارٍ الاستماع لصوتك عبر Web Speech API...' : 'Listening via Web Speech API...'}
                </span>
                {interimTranscript && (
                  <span className="italic text-rose-700 bg-white/70 px-2 py-0.5 rounded-lg border border-rose-200">
                    «{interimTranscript}»
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={toggleListening}
                className="px-2 py-0.5 rounded-md bg-rose-200 hover:bg-rose-300 text-rose-950 text-[11px] font-bold transition cursor-pointer"
              >
                {language === 'ar' ? 'إيقاف' : 'Stop'}
              </button>
            </div>
          )}

          {speechError && (
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
              ⚠️ {speechError}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                isListening
                  ? (language === 'ar' ? 'تحدث الآن، جاري تحويل صوتك لنص تلقائياً...' : 'Speak now, converting voice to text...')
                  : !userName
                  ? (language === 'ar' ? 'اكتب اسمك الكريم هنا...' : isUr ? 'اپنا نام یہاں لکھیں...' : 'Enter your name here...')
                  : !userAge
                  ? (language === 'ar' ? 'اكتب عمرك هنا...' : isUr ? 'اپنی عمر یہاں لکھیں...' : 'Enter your age here...')
                  : isCertified
                  ? (language === 'ar' ? 'اكتب رسالتك أو استفسارك للمعلم...' : 'Type your question or reflection...')
                  : (language === 'ar' ? 'اكتب إجابتك أو تحدث بالصوت عبر الميكروفون...' : 'Type your answer or speak via microphone...')
              }
              className="flex-1 bg-[#FAF7F2] border border-[#EAE3D6] rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-amber-600 focus:bg-white transition"
            />
            <button
              type="button"
              onClick={toggleListening}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition cursor-pointer shrink-0 shadow-xs ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
              }`}
              title={isListening ? (language === 'ar' ? 'جارٍ الاستماع لصوتك... اضغط للإيقاف' : 'Listening... click to stop') : (language === 'ar' ? 'اضغط للتحدث بالصوت مباشرة (Web Speech API)' : 'Click to speak via Web Speech API')}
            >
              {isListening ? <Mic className="w-5 h-5 text-white animate-bounce" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="w-12 h-12 rounded-2xl bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white flex items-center justify-center transition cursor-pointer shadow-xs shrink-0"
              title={language === 'ar' ? 'إرسال' : 'Send'}
            >
              <Send className="w-5 h-5 rtl:rotate-180" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
            <span>{language === 'ar' ? 'مدعوم بالتعرف الصوتي المباشر Web Speech API • تأكيد الفهم قبل الانتقال' : 'Powered by Web Speech API • Active comprehension check before advancing'}</span>
            <span>{language === 'ar' ? 'الدرر السنية ومجمع الملك فهد' : 'King Fahd Complex & Dorar.net'}</span>
          </div>
        </div>

      </div>

      {/* Dialogue Preferences Configuration Modal */}
      <DialoguePreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        currentPreferences={dialoguePreferences}
        onSavePreferences={(newPrefs) => setDialoguePreferences(newPrefs)}
        learnerName={userName}
        learnerAge={userAge}
        trackTitle={activeTrackMeta.titleAr}
      />

    </div>
  );
};
