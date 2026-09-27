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
  ArrowUpRight
} from 'lucide-react';
import { Language, TrackId } from '../types';
import { parseLearnerPersona, adaptCapsuleForAge, LearnerPersona } from '../utils/tutorPersona';

export interface InteractiveTutorProps {
  language: Language;
  selectedTrack: TrackId;
  onBackToMap: () => void;
  onSwitchTrack?: (track: TrackId) => void;
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
}

export const InteractiveTutor: React.FC<InteractiveTutorProps> = ({
  language,
  selectedTrack,
  onBackToMap,
  onSwitchTrack,
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

  // Track Metadata Definition
  const TRACK_META: Record<TrackId, {
    titleAr: string;
    titleEn: string;
    welcomeMsg: string;
    verifyQ: string;
    verifyOptions: string[];
    curriculumOverview: string;
    units: Array<{
      title: string;
      part1: string;
      clarityQuestion: (name: string) => string;
      checkQuestion: string;
      checkOptions: string[];
      correctOptionIndex: number;
      correctionExplanation: (name: string) => string;
    }>;
    quizQuestions: Array<{
      q: string;
      options: string[];
      correct: number;
    }>;
    certSubtitleAr: string;
    certSubtitleEn: string;
  }> = {
    muslim: {
      titleAr: 'مسار المسلم الأصل',
      titleEn: 'Born Muslim Path',
      welcomeMsg: 'السلام عليكم ورحمة الله وبركاته. حياك الله في مسار المسلم الأصل. يسعدني أن أكون معلمك اليوم. من أنت وما اسمك الكريم؟',
      verifyQ: 'بما أنك اخترت مسار (المسلم الأصل)، هل أنت فعلاً ولدت مسلماً؟',
      verifyOptions: ['نعم، ولدت مسلماً والحمد لله', 'نعم، نشأت في أسرة مسلمة', 'لا، دخلت الإسلام حديثاً'],
      curriculumOverview: `بناءً على هدفك المبارك، مسار المسلم الأصل عندنا مصمم خصيصاً لك، وسيمر بالمراحل التالية:
• بناء العقيدة (فهم التوحيد بأنواعه).
• الفقه (أحكام العبادات والخشوع التي تهمك في يومك).
• تصحيح المفاهيم والشبهات المعاصرة.
• بناء القيم والأخلاق الإسلامية في تعاملاتك.

هل أنت مستعد لنبدأ معاً في الدرس الأول (العقيدة)؟`,
      units: [
        {
          title: 'بناء العقيدة: مفهوم التوحيد وأساسه',
          part1: 'التوحيد في لغتنا هو إفراد الشيء، وشرعاً هو: إفراد الله تعالى بما يختص به من الربوبية والألوهية والأسماء والصفات. أي أن نعتقد بقلوبنا وجوارحنا أنه لا خالق ولا رازق ولا معبود بحق إلا الله وحده لا شريك له.',
          clarityQuestion: (name: string) => `واضح يا ${name} حتى الآن؟ أو تحب أعيد لك نقطة معينة؟`,
          checkQuestion: 'لو سألك شخص: ما معنى التوحيد بكلمات بسيطة ومباشرة؟ ماذا سترد عليه؟',
          checkOptions: [
            'هو إفراد الله وحده بالعبادة والخلق دون شريك',
            'هو مجرد الاعتراف بوجود خالق دون عبادته',
            'هو التواكل وتمني الأماني'
          ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => `محاولة طيبة يا ${name}، لكن الأصح هو: التوحيد لا يكفي فيه مجرد الإقرار بوجود الله، بل لابد من إفراده بالعبادة والخلق ونفي أي شريك عنه.`
        },
        {
          title: 'أقسام التوحيد الثلاثة',
          part1: 'ينقسم التوحيد إلى ثلاثة أقسام متكاملة: توحيد الربوبية (أفعال الله كالخلق والرزق)، وتوحيد الألوهية (أفعال العباد كالصلاة والدعاء لله وحده)، وتوحيد الأسماء والصفات (إثبات ما أثبته الله لنفسه بلا تمثيل ولا تعطيل).',
          clarityQuestion: (name: string) => `ما شاء الله يا ${name}، هل هذا التقسيم واضح لك وميسر؟`,
          checkQuestion: 'لو أن شخصاً أقر بأن الله هو الخالق الرازق وحده، لكنه دعا غير الله أو استغاث بميت، هل يكون قد حقق توحيد الألوهية؟',
          checkOptions: [
            'لا، لأن الدعاء عبادة وصرفها لغير الله شرك يناقض الألوهية',
            'نعم، يكفيه الإقرار بأن الله هو الخالق',
            'نعم، ولا حرج في ذلك'
          ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => `محاولة طيبة يا ${name}، لكن الأصح هو: الدعاء هو العبادة كما قال النبي ﷺ، فصرفه لغير الله يناقض توحيد الألوهية حتى لو كان مقراً بأن الله هو الخالق.`
        },
        {
          title: 'الفقه: إتقان العبادة ومقاصد الصلاة',
          part1: 'الصلاة ليست مجرد حركات، بل هي صلة العبد بربه، وميزان يومه. مفتاحها الطهارة الباطنة بالإخلاص، والطهارة الظاهرة بإسباغ الوضوء، وروحها الخشوع واستحضار عظمة الله.',
          clarityQuestion: (name: string) => `واضح لك يا ${name} هذا المقصد العظيم من الصلاة؟`,
          checkQuestion: 'ما هما الشرطان الأساسيان لصحة وقبول أي عبادة في الإسلام؟',
          checkOptions: [
            'الإخلاص لله وحده وموافقة سنة رسول الله ﷺ',
            'كثرة المظاهر والتباهي أمام الناس',
            'أداؤها بسرعة وبأي كيفية'
          ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => `محاولة حسنة يا ${name}، لكن الأصح هو: العمل لا يُقبل عند الله إلا بشرطين متلازمين: الإخلاص لله وحده، وموافقة هدي النبي ﷺ.`
        },
        {
          title: 'بناء القيم والأخلاق وتصحيح المفاهيم',
          part1: 'المسلم الحق لا تنفصل عبادته عن أخلاقه في عمله وتعامله اليومي. قال النبي ﷺ: «إنما بعثت لأتمم صالح الأخلاق». فالدين المعاملة والصدق والأمانة وبر الوالدين وحفظ الألسن.',
          clarityQuestion: (name: string) => `كيف ترى أثر هذه القيم في واقعك اليومي يا ${name}؟ هل الفكرة واضحة؟`,
          checkQuestion: 'إذا تعارض كسب المال بالغش أو الحرام مع الأمانة، فما هو الموقف الإيماني الراسخ للمسلم الأصل؟',
          checkOptions: [
            'ترك الحرام ابتغاء مرضاة الله، واليقين بأن الرزاق هو الله وحده',
            'أخذ الحرام بدعوى صعوبة المعيشة',
            'الغش ما دام لا يراه أحد'
          ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => `محاولة طيبة يا ${name}، لكن الأصح هو: من ترك شيئاً لله عوضه الله خيراً منه، والتوكل الحق يقتضي طلب الرزق بالحلال الطيب.`
        }
      ],
      quizQuestions: [
        {
          q: 'ما هو التوحيد الذي أنكره مشركو قريش وامتنعوا عنه رغم اعترافهم بأن الله هو الخالق؟',
          options: ['توحيد الألوهية (إفراد الله بالعبادة وحده)', 'توحيد الربوبية (الاعتراف بالخلق)', 'معرفة اللغة'],
          correct: 0
        },
        {
          q: 'ما هو مفهوم التوكل الحق على الله في أمور حياتك وسعيك؟',
          options: ['صدق اعتماد القلب على الله مع بذل الأسباب المشروعة بكامل الهمة', 'ترك العمل والدراسة والقعود', 'الاعتماد على المخلوقين ونسيان الخالق'],
          correct: 0
        },
        {
          q: 'كيف يتعامل المسلم الراسخ مع الشبهات المعاصرة وتحديات الفكر؟',
          options: ['بالرجوع للعلماء والمصادر المعتمدة الموثوقة مع الحكمة', 'بالاندفاع والتعصب دون علم', 'بالتخلي عن ثوابت الدين'],
          correct: 0
        }
      ],
      certSubtitleAr: 'مسار المسلم الأصل: ترسيخ وتعميق العقيدة والعبادة ومقاصد الشريعة',
      certSubtitleEn: 'Born Muslim Path: Deepening Creed, Worship Wisdom & Islamic Ethics'
    },
    new_muslim: {
      titleAr: 'مسار المسلم الجديد',
      titleEn: 'New Muslim Path',
      welcomeMsg: 'السلام عليكم ورحمة الله وبركاته. مبارك عليك نعمة الإسلام، وأهلاً بك في مسار المسلم الجديد. يسعدني أن أكون رفيقك ومعلمك. من أنت وما اسمك الكريم؟',
      verifyQ: 'هل دخلت في الإسلام حديثاً أو تبدأ خطواتك الأولى في تعلمه؟',
      verifyOptions: ['نعم، أسلمت حديثاً والحمد لله', 'نعم، في خطواتي الأولى', 'أنا مسلم منذ الولادة'],
      curriculumOverview: `هنيئاً لك هذه البداية المباركة! مسارنا مصمم ليتدرج معك بيسر وسماحة:
• أركان الإسلام الخمسة وأركان الإيمان بمعانٍ بسيطة ومطمئنة.
• مفتاح العبادة: الطهارة وتعلم الصلاة خطوة بخطوة.
• الحياة اليومية للمسلم: الطعام الحلال والتعامل مع الأهل والمجتمع.
• بناء الطمأنينة القلبية وتجاوز التحديات الأولى.

هل أنت مستعد لنبدأ معاً في الخطوة الأولى؟`,
      units: [
        {
          title: 'الشهادتان: معنى لا إله إلا الله ومحمد رسول الله',
          part1: 'الشهادتان هما باب الإسلام العظيم. معناهما: أن تشهد بقلبك ولسانك أنه لا معبود بحق إلا الله وحده، وأن محمداً ﷺ هو رسول الله وخاتم الأنبياء الذي أرسله الله رحمة للعالمين.',
          clarityQuestion: (name: string) => `هل معنى الشهادتين واضح ومطمئن لقلبك يا ${name}؟`,
          checkQuestion: 'ماذا يترتب على قولك (أشهد أن محمداً رسول الله) في حياتك اليومية؟',
          checkOptions: [
            'تصديقه فيما أخبر، وطاعته فيما أمر، وعبادة الله بما شرع',
            'مجرد قول باللسان دون عمل بهديه',
            'التوقف عن كل أنشطة الحياة'
          ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => `محاولة طيبة يا ${name}، لكن الأصح هو: الشهادة تعني محبة النبي ﷺ وتصديقه واتباع سنته المباركة برفق وسماحة.`
        },
        {
          title: 'الصلوات الخمس: لقاؤك اليومي مع الله',
          part1: 'الصلاة هي هدية الله للمؤمن، خمس وقفات يومية تزيل الهموم وتمنح القلب سكينة. تبدأ بتكبيرة الإحرام وقراءة الفاتحة وتنتهي بالسلام، والدين يسر، فما عجزت عنه تؤديه بقدر استطاعتك.',
          clarityQuestion: (name: string) => `هل تشعر بجمال هذه الهدية يا ${name}؟ وهل الفكرة واضحة؟`,
          checkQuestion: 'إذا دخل وقت الصلاة ولم تحفظ سورة الفاتحة كاملة بعد، ماذا تفعل؟',
          checkOptions: [
            'تصلي وتذكر الله بما تيسر (سبحان الله، والحمد لله) حتى تحفظ الفاتحة بيسر',
            'تترك الصلاة نهائياً',
            'تنتظر أشهراً حتى تحفظ القرآن كله'
          ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => `محاولة طيبة يا ${name}، والصواب في ديننا الحنيف: أن الدين يسر، فتصلي وتذكر الله بما تيسر حتى تتعلم الفاتحة تدريجياً دون مشقة.`
        },
        {
          title: 'التعامل مع الأهل والمجتمع غير المسلم',
          part1: 'الإسلام يأمرك بزيادة البر والإحسان لأهلك ووالديك بعد إسلامك، وليس مقاطعتهم. قال الله تعالى في الوالدين غير المسلمين: {وصاحبهما في الدنيا معروفاً}. فخلقك الحسن هو أصدق دعوة لهم.',
          clarityQuestion: (name: string) => `واضح لك يا ${name} هذا الأدب الرفيع في التعامل مع الأهل؟`,
          checkQuestion: 'كيف يوصينا الإسلام بالتعامل مع الوالدين والأقارب غير المسلمين؟',
          checkOptions: [
            'بالبر والإحسان والصلة والهدية وحسن المعاملة',
            'بالقطيعة والغضب والمعاملة الجافة',
            'بترك برهم'
          ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => `محاولة طيبة يا ${name}، بل العكس تماماً: الإسلام يحث على مضاعفة الإحسان والبر للأهل لتكون سفيراً حسناً لدين الرحمة.`
        }
      ],
      quizQuestions: [
        {
          q: 'ما هو الركن الأول والأساسي من أركان الإسلام؟',
          options: ['شهادة أن لا إله إلا الله وأن محمداً رسول الله', 'صيام شهر رمضان', 'الحج لمن استطاع إليه سبيلاً'],
          correct: 0
        },
        {
          q: 'ما القاعدة الأساسية في تعلم أحكام الإسلام للمسلم الجديد؟',
          options: ['التدرج واليسر وسماحة الشريعة', 'المشقة والتشديد على النفس', 'ترك التعلم'],
          correct: 0
        },
        {
          q: 'كيف تكون علاقة المسلم الجديد مع أسرته ومجتمعه؟',
          options: ['علاقة بر ورحمة وإحسان وخلق رفيع', 'قطيعة وتنافر', 'عزلة تامة'],
          correct: 0
        }
      ],
      certSubtitleAr: 'مسار المسلم الجديد: تأسيس أركان الإسلام، تعلم الصلاة، وسماحة الدين',
      certSubtitleEn: 'New Muslim Path: Foundations of Faith, Prayer & Islamic Living'
    },
    non_muslim: {
      titleAr: 'مسار غير المسلم (باحث عن الحقيقة)',
      titleEn: 'Truth Inquirer Path',
      welcomeMsg: 'السلام عليكم، وأهلاً ومرحباً بك في مسار الباحث عن الحقيقة. يسعدنا جداً حضورك وحوارك الهادئ في مساحة آمنة ومحترمة. من أنت وما اسمك الكريم؟',
      verifyQ: 'هل تزورنا اليوم للتعرف على الإسلام والبحث عن إجابات لتساؤلاتك بحرية وموضوعية؟',
      verifyOptions: ['نعم، أبحث عن الحقيقة وأستكشف', 'نعم، لدي تساؤلات أود فهمها', 'أنا مسلم بالفعل'],
      curriculumOverview: `أهلاً بك دوماً. مسارنا هنا يعتمد على العقلانية والمنطق والوضوح التام:
• مفهوم الخالق الواحد وغايات الوجود الإنساني.
• رسالة الإسلام ونبوة محمد ﷺ وبراهين القرآن الكريم.
• العدالة وحقوق الإنسان والأخلاق في الرؤية الإسلامية.
• الإجابة الصريحة عن الأسئلة والشبهات الشائعة.

هل ترغب في البدء معنا في المحور الأول؟`,
      units: [
        {
          title: 'مفهوم الخالق الواحد في الإسلام',
          part1: 'الإسلام يؤكد أن هذا الكون البديع بنظامه الدقيق لم يأتِ صدفة، بل خلقه إله واحد قادر حكيم، ليس له ولد ولا شريك ولا مثيل، متصف بصفات الكمال والرحمة والعدل المطلق.',
          clarityQuestion: (name: string) => `هل هذه الرؤية واضحة ومنطقية لعقلك يا ${name}؟`,
          checkQuestion: 'ما الذي يميز مفهوم الإله في الإسلام عن بقية التصورات الفلسفية المعقدة؟',
          checkOptions: [
            'أنه إله واحد كامل منزه عن الشبيه والولد، قريب يجيب دعاء عباده مباشرة دون وسائط',
            'أنه يحتاج إلى وسائط وشركاء لإدارة خلقه',
            'أنه خلق الكون وتركه عبثاً دون هداية'
          ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => `محاولة طيبة يا ${name}، وميزة الإسلام الكبرى هي التوحيد النقي الخالص: علاقة مباشرة بين الإنسان وخالقه دون صكوك ولا كهنوت.`
        },
        {
          title: 'القرآن الكريم: رسالة معجزة ومحفوظة',
          part1: 'القرآن الكريم هو كلام الله المنزل على نبيه محمد ﷺ، محفوظ بحروفه عبر 14 قرناً دون تبديل، يخاطب العقل ويدعو للتأمل والتفكر في الآفاق والأنفس، ويقدم منظومة حياة متكاملة.',
          clarityQuestion: (name: string) => `واضح لك هذا المحور يا ${name}؟ أو لديك استفسار حوله؟`,
          checkQuestion: 'ما هي الدعوة المتكررة التي يوجهها القرآن لقارئه في آياته الكريمة؟',
          checkOptions: [
            'التفكر العقلي، والتدبر في ملكوت السماوات والأرض، ونبذ التقليد الأعمى',
            'إلغاء العقل وقبول كل شيء دون تفكير',
            'التعصب دون دليل'
          ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => `محاولة حسنة يا ${name}، لكن القرآن يتميز بأنه أكثر كتاب يحث على التعقل: {أفلا يعقلون}، {أفلا يتدبرون}، وينبذ التقليد الأعمى.`
        }
      ],
      quizQuestions: [
        {
          q: 'ما هو المبدأ الأساسي والجامع في عقيدة الإسلام؟',
          options: ['وحدانية الخالق المطلقة والتوجه له بالعبادة دون شريك', 'تعدد الآلهة', 'إنكار الخالق'],
          correct: 0
        },
        {
          q: 'كيف يتعامل الإسلام مع العقل الإنساني في البحث عن الحقيقة؟',
          options: ['يكرم العقل ويجعله مناط التكليف وأداة التفكر في الآفاق', 'يصادر العقل ويمنع التفكير', 'يدعو إلى الشك الدائم بلا وصول'],
          correct: 0
        }
      ],
      certSubtitleAr: 'مسار الباحث عن الحقيقة: استكشاف الإسلام بالعقل والبرهان والحرية الفكرية',
      certSubtitleEn: 'Truth Inquirer Path: Rational Discovery of Islamic Monotheism & Truth'
    },
    daiyah: {
      titleAr: 'مسار الداعية (تأهيل ومحاكاة)',
      titleEn: 'Da\'iyah Training Path',
      welcomeMsg: 'السلام عليكم ورحمة الله وبركاته. مرحباً بك يا حامل أمانة البلاغ. في مسار الداعية نسعى لصقل مهاراتك بالحكمة والموعظة الحسنة. من أنت وما اسمك الكريم؟',
      verifyQ: 'هل تسعى لتطوير مهاراتك الحوارية والدعوية لنقل رسالة الإسلام بالحكمة؟',
      verifyOptions: ['نعم، أهدف للتأهيل والتدريب الدعوي', 'نعم، أريد ممارسة المحاكاة', 'أريد التعلم فقط'],
      curriculumOverview: `حياك الله وبارك في همتك! مسار الداعية يقدم لك تأهيلاً نوعياً:
• أصول الدعوة بالحكمة والرفق والمنهج النبوي في مخاطبة العقول والقلوب.
• مهارات إدارة النقاش وتفكيك الشبهات بالأدلة العقلية والنقلية.
• محاكاة سيناريوهات حوارية تفاعلية مع أنماط مختلفة من السائلين.
• فقه الأولويات والتحلي بأخلاق الداعية الصادق.

هل أنت مستعد لنبدأ معاً في المحور الأول؟`,
      units: [
        {
          title: 'المنهج النبوي: الحكمة والموعظة الحسنة والرفق',
          part1: 'الأصل في الدعوة هو الرفق والرحمة، كما قال تعالى: {ادع إلى سبيل ربك بالحكمة والموعظة الحسنة وجادلهم بالتي هي أحسن}. فالداعية طبيب رحيم يريد نجاة الناس، وليس محامياً يبحث عن إفحام الخصم والانتصار للنفس.',
          clarityQuestion: (name: string) => `هل هذا الضابط الأصيل حاضر في ذهنك يا ${name}؟`,
          checkQuestion: 'إذا واجهت سفيهاً أو شخصاً يجادل بحدة وسخرية، فما هو الهدي النبوي الحكيم في التعامل معه؟',
          checkOptions: [
            'مخاطبته بالرفق والهدوء والإعراض عن السباب، وتبيان الحق دون انفعال',
            'رد السباب بالسباب والانتصار للنفس',
            'التراجع والانسحاب بشعور الهزيمة'
          ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => `محاولة طيبة يا ${name}، لكن القاعدة الدعوية: {وإذا خاطبهم الجاهلون قالوا سلاماً}، فالرفق ما كان في شيء إلا زانه، والهدوء يمتص الغضب ويظهر هيبة الحق.`
        },
        {
          title: 'فقه الأولويات: البدء بالأهم فالمهم',
          part1: 'حين بعث النبي ﷺ معاذاً إلى اليمن، قال له: «فليكن أول ما تدعوهم إليه أن يوحدوا الله، فإن هم أطاعوك لذلك فأعلمهم أن الله افترض عليهم خمس صلوات...». فالبداية بالتوحيد وأصول الإيمان قبل الفروع والتفاصيل.',
          clarityQuestion: (name: string) => `واضح لك هذا الترتيب الدعوي المحكم يا ${name}؟`,
          checkQuestion: 'لو سألك شخص غير مسلم عن حكم تحريم لحم الخنزير أو تفاصيل الحجاب قبل أن يؤمن بوجود الله ورسالة الإسلام، فبماذا تبدأ معه؟',
          checkOptions: [
            'التركيز على أصل الإيمان بوجود الخالق ورسالة النبي أولاً، لأن الفروع تبنى على الأصل',
            'الدخول في نقاشات طبية وغذائية طويلة وترك التوحيد',
            'إلزامه بالأحكام الفرعية فوراً'
          ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => `محاولة حسنة يا ${name}، والأصل الدعوي الراسخ: تثبيت الأساس أولاً وهو التوحيد والنبوة، فإذا آمن بالمرسل خضعت جوارحه لأوامره ونواهيه عن يقين.`
        }
      ],
      quizQuestions: [
        {
          q: 'ما هو الهدف الأسمى للداعية في حواره مع الآخرين؟',
          options: ['إيصال الحق برحمة وهداية القلوب ابتغاء وجه الله', 'إفحام الطرف الآخر والانتصار للذات', 'تحقيق الشهرة والمناظرات'],
          correct: 0
        },
        {
          q: 'ما هو الأصل في الأسلوب الدعوي كما أمر الله في سورة النحل؟',
          options: ['الحكمة والموعظة الحسنة والجدال بالتي هي أحسن', 'الشدة والغلظة والتوبيخ', 'التنازل عن ثوابت الدين'],
          correct: 0
        }
      ],
      certSubtitleAr: 'مسار الداعية: تأهيل مهارات البلاغ بالحكمة ومحاكاة الحوار الحضاري',
      certSubtitleEn: 'Da\'iyah Path: Wisdom-based Outreach & Civilized Dialogue Mastery'
    }
  };

  const activeTrackMeta = TRACK_META[selectedTrack] || TRACK_META.muslim;

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
    return learnerName || localStorage.getItem('eilm_user_name') || '';
  });
  const [userAge, setUserAge] = useState<string>(() => {
    return learnerAge || localStorage.getItem('eilm_user_age') || '';
  });

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Build adaptive welcome message based on persona if name is already known
  const getInitialWelcomeMessage = (name: string, ageStr: string): string => {
    if (name) {
      const p = parseLearnerPersona(ageStr, name);
      if (currentLessonContext) {
        return `السلام عليكم ورحمة الله وبركاته ${p.titleCall}.\n\nحياك الله في «${currentLessonContext.stageTitle}» ضمن ${activeTrackMeta.titleAr}.\n\n${adaptCapsuleForAge(currentLessonContext.stageConcept, p, 1)}\n\nهل هذا المفهوم واضح وجلي لك يا ${name} حتى الآن؟`;
      }
      return `السلام عليكم ورحمة الله وبركاته ${p.titleCall}.\n\nحياك الله في ${activeTrackMeta.titleAr}. يسعدني أن أكون رفيقك ومعلمك اليوم.\n\n${activeTrackMeta.verifyQ}`;
    }
    return activeTrackMeta.welcomeMsg;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      role: 'tutor',
      text: getInitialWelcomeMessage(userName, userAge),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: userName ? activeTrackMeta.verifyOptions : ['أنا اسمي محمد', 'أنا عبد الله', 'اسمي سارة', 'اسمي خالد']
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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
          }
        })
      });

      const data = await response.json();
      processTutorStep(text, data.reply);
    } catch (e) {
      console.warn('Backend tutor fallback:', e);
      processTutorStep(text);
    } finally {
      setIsTyping(false);
    }
  };

  // Deterministic Step-by-Step Flow complying strictly with QA requirements
  const processTutorStep = (userText: string, aiGeneratedReply?: string) => {
    const clean = userText.toLowerCase().trim();

    // -------------------------------------------------------------
    // STAGE 1: Onboarding (One Question Rule)
    // -------------------------------------------------------------
    if (currentStage === 1) {
      // Step 1: Extract Name
      if (!userName) {
        const cleanName = userText
          .replace(/^(السلام عليكم|أنا اسمي|اسمي هو|اسمي|معك|حياك الله|أنا)/gi, '')
          .trim()
          .split(' ')[0] || userText;
        setUserName(cleanName);
        localStorage.setItem('eilm_user_name', cleanName);
        setStageProgress(25);

        const reply = `حياك الله يا ${cleanName}، كم عمرك لكي أضبط لك أسلوب الشرح والأمثلة المناسبة لك تماماً؟`;
        addTutorMessage(reply, ['أقل من 15 سنة (يا بطل)', '15 - 25 سنة (شاب)', '26 - 40 سنة (راشد)', 'أكثر من 40 سنة']);
        return;
      }

      // Step 2: Extract Age -> Ask Track Confirmation Question
      if (!userAge) {
        setUserAge(userText);
        localStorage.setItem('eilm_user_age', userText);
        setStageProgress(35);

        const currentPersona = parseLearnerPersona(userText, userName);
        const reply = `${currentPersona.titleCall}، ${activeTrackMeta.verifyQ}`;
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
        const reply = `ممتاز جداً ${p.titleCall}. ما هو هدفك الأساسي الذي تطمح لتعلمه والتركيز عليه في هذا المسار؟`;
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
        const isClear = !clean.includes('لا') && !clean.includes('مش واضح') && !clean.includes('أعد');
        if (isClear) {
          setUnitSubStep('quiz_check');
          const reply = persona.bracket === 'child'
            ? `ممتاز يا بطل! لنتأكد من فهمك بسؤال سريع:\n${unit.checkQuestion}`
            : `ممتاز جداً ${persona.titleCall}! بناءً على ما رسخناه للتو، دعنا نتحقق بسؤال تنشيطي مباشر:\n${unit.checkQuestion}`;
          addTutorMessage(reply, unit.checkOptions, true);
        } else {
          const reExplain = persona.bracket === 'child'
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

  const addTutorMessage = (text: string, options?: string[], isQuestion?: boolean) => {
    // Strictly enforce single-question rule
    const filteredText = enforceSingleQuestion(text);
    const tutorMsg: Message = {
      id: `t-${Date.now()}`,
      role: 'tutor',
      text: filteredText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options,
      isQuestion
    };
    setMessages(prev => [...prev, tutorMsg]);
    speakText(filteredText);
  };

  const resetSession = (track: TrackId = selectedTrack) => {
    const meta = TRACK_META[track] || TRACK_META.muslim;
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      
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
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[500px] space-y-4 bg-slate-50/40">
          {messages.map((m) => {
            const isTutor = m.role === 'tutor';
            return (
              <div 
                key={m.id}
                className={`flex gap-3 ${isTutor ? 'justify-start' : 'justify-end'} animate-in fade-in duration-300`}
              >
                {isTutor && (
                  <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-xs">
                    م
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-xs ${
                  isTutor 
                    ? 'bg-white text-slate-800 border border-[#EAE3D6] rounded-tr-xs' 
                    : 'bg-amber-700 text-white rounded-tl-xs'
                }`}>
                  <div className="text-xs font-semibold mb-1 opacity-70">
                    {isTutor ? 'المعلم الذكي' : userName || 'أنت'}
                  </div>
                  
                  <div className="text-sm leading-relaxed whitespace-pre-line font-sans">
                    {m.text}
                  </div>

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
                م
              </div>
              <div className="bg-white border border-[#EAE3D6] px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="mr-1 text-slate-500 font-medium">المعلم يكتب...</span>
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
                    <h3 className="font-bold text-slate-900 text-lg">شهادة إتمام مستوى افتراضية</h3>
                    <p className="text-xs text-amber-800 font-medium">{activeTrackMeta.certSubtitleAr}</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-full">
                  معتمد ومجتاز
                </span>
              </div>

              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-slate-500">تُشهد منصة عِلم بالتعاون مع المعلم التفاعلي بأن:</p>
                <h4 className="text-2xl font-bold text-slate-900 font-brand tracking-wide">
                  {userName || 'المتعلم المجتهد'}
                </h4>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  قد أتم بنجاح محاور {activeTrackMeta.titleAr} واجتاز التقييم الختامي الشامل بدرجة متميزة.
                </p>
                <div className="pt-2 text-[11px] text-slate-400">
                  تاريخ الإتمام: {new Date().toLocaleDateString('ar-SA')} | المعلم الحواري الذكي
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-amber-100">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 text-xs bg-amber-700 hover:bg-amber-800 text-white font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة الشهادة</span>
                </button>
                <button
                  onClick={onBackToMap}
                  className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  <span>متابعة الخريطة والمراحل المتقدمة</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#EAE3D6]">
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
                !userName
                  ? 'اكتب اسمك الكريم هنا...'
                  : !userAge
                  ? 'اكتب عمرك هنا...'
                  : isCertified
                  ? 'اكتب رسالتك أو استفسارك للمعلم...'
                  : 'اكتب إجابتك أو سؤالك للمعلم...'
              }
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
            <span>مبني على أسلوب التعلم الحواري المتدرج (تأكيد الفهم قبل الانتقال)</span>
            <span>الدرر السنية ومجمع الملك فهد</span>
          </div>
        </div>

      </div>

    </div>
  );
};
