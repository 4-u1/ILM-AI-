import { Language, TrackId } from '../types';

export const isRtlLanguage = (lang: Language): boolean => {
  return lang === 'ar' || lang === 'ur';
};

export const UI_TRANSLATIONS = {
  // Brand & Slogan
  appNameAr: 'عِلم',
  appNameEn: 'ILM',
  appNameUr: 'عِلم',
  tagline: {
    ar: 'رحلة معرفية موثوقة للتعريف بالإسلام والعلوم الشرعية',
    en: 'An accredited, verified journey to discover Islam and Islamic sciences',
    ur: 'اسلام اور شرعی علوم سے تعارف کا مستند اور باوقار علمی سفر',
  },

  // Navigation Items
  nav: {
    tracks: { ar: 'المسارات', en: 'Tracks', ur: 'راستے' },
    journey: { ar: 'الرحلة', en: 'Journey', ur: 'سفر' },
    simulator: { ar: 'المحاكي', en: 'Simulator', ur: 'سمیلیٹر' },
    certificate: { ar: 'الشهادة', en: 'Certificate', ur: 'سند' },
    lab: { ar: 'الموثوقية', en: 'Verification', ur: 'توثیق' },
    sources: { ar: 'المصادر', en: 'Sources', ur: 'مصادر' },
    dashboard: { ar: 'المؤشرات', en: 'Analytics', ur: 'اشاریے' },
    guide: { ar: 'الدليل', en: 'Guide', ur: 'رہنما' },
    switchLanguage: { ar: 'تغيير اللغة', en: 'Switch Language', ur: 'زبان تبدیل کریں' },
  },

  // Track Selector & Descriptions
  tracks: {
    muslim: {
      title: {
        ar: 'مسار المسلم الأصل (ترسيخ وتعميق)',
        en: 'Born Muslim Path (Deepening Faith)',
        ur: 'مسلمِ اصل راستہ (ایمانی پختگی اور فہم)',
      },
      desc: {
        ar: 'رحلة متدرجة لتعميق الإيمان وفهم مقاصد العبادات والمعاملات لمن نشأ على الإسلام وفق المصادر المعتمدة.',
        en: 'A structured journey deepening faith, worship, and Islamic ethics for Muslims through verified sources.',
        ur: 'مستند مصادر کی روشنی میں عبادات اور معاملات کے مقاصد کو گہرائی سے سمجھنے کا سفر۔',
      },
      tag: { ar: 'ترسيخ الإيمان', en: 'Deepening Faith', ur: 'ایمانی پختگی' },
    },
    new_muslim: {
      title: {
        ar: 'مسار المسلم الجديد (تأسيس خطوة بخطوة)',
        en: 'New Muslim Path (Step-by-Step Foundation)',
        ur: 'نئے مسلم کا راستہ (مرحلہ وار بنیاد)',
      },
      desc: {
        ar: 'تأسيس شامل يبدأ من التوحيد، مروراً بالشهادتين، الوضوء، الصلاة، وتفاصيل الحياة اليومية برفق وتيسير.',
        en: 'A supportive foundation covering Tawhid, Shahadah, prayer, and daily life with compassion and ease.',
        ur: 'توحید، شہادتین، وضو، نماز اور روزمرہ زندگی کے احکام کو آسانی اور محبت سے سیکھنے کی بنیاد۔',
      },
      tag: { ar: 'تأسيس شامل', en: 'Foundation', ur: 'مکمل بنیاد' },
    },
    non_muslim: {
      title: {
        ar: 'مسار غير المسلم (التعرف والحوار الموضوعي)',
        en: 'Non-Muslim Path (Discovery & Objective Dialogue)',
        ur: 'غیر مسلم کے لیے راستہ (شناخت اور مکالمہ)',
      },
      desc: {
        ar: 'استكشاف هادئ وموثق لجوهر الإسلام، الإله، النبوة، تفنيد الشبهات، ومقارنة الأديان بحكمة.',
        en: 'A peaceful, verified exploration of Islam, God, Prophethood, addressing misconceptions with wisdom.',
        ur: 'اسلام کی حقیقت، توحید، نبوت، غلط فہمیوں کے ازالے اور حکمت کے ساتھ تعارف کا سفر۔',
      },
      tag: { ar: 'استكشاف موضوعي', en: 'Discovery', ur: 'علمی جائزہ' },
    },
    daiyah: {
      title: {
        ar: 'مسار الداعية (التأهيل ومحاكي الحوار)',
        en: 'Da\'iyah Path (Training & AI Simulation)',
        ur: 'داعی کا راستہ (تربیت اور مکالماتی سمیلیٹر)',
      },
      desc: {
        ar: 'إتقان أصول الحوار الحضاري، وضوابط الاستدلال، مع تدريبات تفاعلية ومحاكاة لمواقف واقعية.',
        en: 'Mastering civilized dialogue, verified reasoning, and realistic AI-powered conversation simulations.',
        ur: 'مہذب مکالمے اور استدلال کے اصولوں میں مہارت، مع حقیقت پسندانہ سمیلیٹر مشقیں۔',
      },
      tag: { ar: 'تأهيل ومحاكاة', en: 'Training & AI', ur: 'تربیت و سمیلیٹر' },
    },
  },

  // Common UI actions
  actions: {
    startJourney: { ar: 'بدء المسار التعليمي', en: 'Start Learning Path', ur: 'تعلیمی سفر شروع کریں' },
    continueJourney: { ar: 'متابعة الرحلة', en: 'Continue Journey', ur: 'سفر جاری رکھیں' },
    changeTrack: { ar: 'تغيير المسار التعليمي', en: 'Change Learning Path', ur: 'تعلیمی راستہ تبدیل کریں' },
    embraceIslam: { ar: 'أرغب في اعتناق الإسلام', en: 'Embrace Islam', ur: 'میں اسلام قبول کرنا چاہتا ہوں' },
    fastComplete: { ar: 'إتمام سريع للمسار', en: 'Fast Complete', ur: 'فوری تکمیل' },
    viewCertificate: { ar: 'عرض وتصدير الشهادة', en: 'View Certificate', ur: 'سند دیکھیں اور محفوظ کریں' },
    certificateReady: { ar: 'جاهزة', en: 'Ready', ur: 'تیار ہے' },
    searchPlaceholder: {
      ar: 'ابحث في محتوى المسار، الآيات، الأحاديث، أو قاعدة المصادر المعتمدة...',
      en: 'Search track lessons, verses, Hadiths, or verified sources...',
      ur: 'اسباق کے متن، قرآنی آیات، احادیث، یا مستند مصادر میں تلاش کریں...',
    },
    instantSearch: { ar: 'بحث فوري', en: 'Live Search', ur: 'فوری تلاش' },
    scope: { ar: 'النطاق:', en: 'Scope:', ur: 'دائرہ کار:' },
    all: { ar: 'الكل', en: 'All', ur: 'سب' },
    currentTrackOnly: { ar: 'المسار الحالي فقط', en: 'Current Track', ur: 'صرف موجودہ راستہ' },
    allLessons: { ar: 'كل الدروس', en: 'All Lessons', ur: 'تمام اسباق' },
    verifiedSources: { ar: 'المصادر المعتمدة', en: 'Sources', ur: 'مستند مصادر' },
    resultsCount: { ar: 'نتيجة مطابقة', en: 'results', ur: 'نتائج' },
    suggestedSearches: { ar: 'عمليات بحث مقترحة:', en: 'Suggested Searches:', ur: 'تجویز کردہ تلاش:' },
    noResultsFound: { ar: 'لا توجد نتائج مطابقة', en: 'No results found', ur: 'کوئی نتیجہ نہیں ملا' },
    nextLesson: { ar: 'درسك القادم الموصى به:', en: 'Recommended Next Lesson:', ur: 'اگلا تجویز کردہ سبق:' },
    continueLessonNow: { ar: 'متابعة الدرس الآن', en: 'Continue Lesson', ur: 'سبق جاری رکھیں' },
    testReminder: { ar: 'اختبار تذكير الـ 24 ساعة', en: 'Test 24h Reminder', ur: '24 گھنٹے یاد دہانی کا ٹیسٹ' },
    minutes: { ar: 'دقائق', en: 'mins', ur: 'منٹ' },
  },

  // Interactive Quiz
  quiz: {
    title: { ar: 'تقييم الفهم والاستيعاب', en: 'Comprehension Quiz', ur: 'فہم اور ادراک کا جائزہ' },
    question: { ar: 'السؤال', en: 'Question', ur: 'سوال' },
    submit: { ar: 'تأكيد الإجابة وفحص الصحة', en: 'Submit & Check Answer', ur: 'جواب کی تصدیق اور جانچ' },
    nextQuestion: { ar: 'السؤال التالي ←', en: 'Next Question →', ur: 'اگلا سوال ←' },
    finishQuiz: { ar: 'إتمام الاختبار واعتماد النتيجة', en: 'Finish Quiz', ur: 'ٹیسٹ مکمل کریں' },
    correctAnswer: { ar: '🎉 إجابة صحيحة ومؤصلة!', en: '🎉 Correct Answer!', ur: '🎉 درست اور مستند جواب!' },
    reviewConcept: { ar: '💡 تصحيح المفهوم والتغذية الراجعة:', en: '💡 Concept Review & Feedback:', ur: '💡 اصلاح فہم اور وضاحت:' },
    passedStage: { ar: 'تم اجتياز تقييم المحطة بنجاح', en: 'Stage Passed', ur: 'مرحلہ کامیابی سے مکمل' },
    congrats: { ar: 'مبارك! أتممت اختبار هذه المرحلة المعرفية', en: 'Congratulations! Quiz Passed', ur: 'مبارک ہو! آپ نے اس مرحلے کا ٹیسٹ پاس کر لیا' },
    retakeQuiz: { ar: 'إعادة الاختبار', en: 'Retake Quiz', ur: 'دوبارہ ٹیسٹ دیں' },
    continueMap: { ar: 'متابعة مسار الرحلة المعرفية', en: 'Continue Journey Map', ur: 'علمی سفر کا نقشہ جاری رکھیں' },
  }
};
