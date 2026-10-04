import { Language, TrackId } from '../types';

export const isRtlLanguage = (lang: Language): boolean => {
  return lang === 'ar' || lang === 'ur';
};

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
  direction: 'rtl' | 'ltr';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧', direction: 'ltr' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو', flag: '🇵🇰', direction: 'rtl' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷', direction: 'ltr' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸', direction: 'ltr' },
  { code: 'id', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia', flag: '🇮🇩', direction: 'ltr' },
];

export const UI_TRANSLATIONS: {
  appNameAr: string;
  appNameEn: string;
  appNameUr: string;
  tagline: Record<Language, string>;
  nav: Record<string, Record<Language, string>>;
  tracks: Record<TrackId, {
    title: Record<Language, string>;
    desc: Record<Language, string>;
    tag: Record<Language, string>;
  }>;
  actions: Record<string, Record<Language, string>>;
  quiz: Record<string, Record<Language, string>>;
} = {
  // Brand & Slogan
  appNameAr: 'عِلم',
  appNameEn: 'ILM',
  appNameUr: 'عِلم',
  tagline: {
    ar: 'رحلة معرفية موثوقة للتعريف بالإسلام والعلوم الشرعية',
    en: 'An accredited, verified journey to discover Islam and Islamic sciences',
    ur: 'اسلام اور شرعی علوم سے تعارف کا مستند اور باوقار علمی سفر',
    fr: "Un parcours académique et authentifié pour découvrir l'Islam et ses sciences",
    es: 'Un viaje acreditado y verificado para descubrir el Islam y sus ciencias',
    id: 'Perjalanan terpercaya dan terverifikasi untuk mengenal Islam dan ilmu syariat',
  },

  // Navigation Items
  nav: {
    tracks: { ar: 'المسارات', en: 'Tracks', ur: 'راستے', fr: 'Parcours', es: 'Rutas', id: 'Jalur' },
    journey: { ar: 'الرحلة', en: 'Journey', ur: 'سفر', fr: 'Voyage', es: 'Viaje', id: 'Perjalanan' },
    simulator: { ar: 'المحاكي', en: 'Simulator', ur: 'سمیلیٹر', fr: 'Simulateur', es: 'Simulador', id: 'Simulator' },
    certificate: { ar: 'الشهادة', en: 'Certificate', ur: 'سند', fr: 'Certificat', es: 'Certificado', id: 'Sertifikat' },
    achievements: { ar: 'الأوسمة', en: 'Achievements', ur: 'اعزازات', fr: 'Badges', es: 'Logros', id: 'Lencana' },
    ambassadors: { ar: 'السفراء', en: 'Ambassadors', ur: 'سفراء', fr: 'Ambassadeurs', es: 'Embajadores', id: 'Duta' },
    copilot: { ar: 'المساعد الميداني', en: 'Co-Pilot', ur: 'میدانی معاون', fr: 'Co-Pilote', es: 'Copiloto', id: 'Kopilot' },
    thirtyDays: { ar: '30 يوماً', en: '30 Days', ur: '30 دن', fr: '30 Jours', es: '30 Días', id: '30 Hari' },
    offlineKit: { ar: 'دون إنترنت', en: 'Offline Kit', ur: 'بغیر انٹرنیٹ', fr: 'Hors ligne', es: 'Sin Internet', id: 'Kit Offline' },
    lab: { ar: 'الموثوقية', en: 'Verification', ur: 'توثیق', fr: 'Vérification', es: 'Verificación', id: 'Verifikasi' },
    sources: { ar: 'المصادر', en: 'Sources', ur: 'مصادر', fr: 'Sources', es: 'Fuentes', id: 'Sumber' },
    dashboard: { ar: 'المؤشرات', en: 'Analytics', ur: 'اشاریے', fr: 'Indicateurs', es: 'Panel', id: 'Metrik' },
    guide: { ar: 'الدليل', en: 'Guide', ur: 'رہنما', fr: 'Guide', es: 'Guía', id: 'Panduan' },
    switchLanguage: { ar: 'تغيير اللغة', en: 'Language', ur: 'زبان', fr: 'Langue', es: 'Idioma', id: 'Bahasa' },
  },

  // Track Selector & Descriptions
  tracks: {
    muslim: {
      title: {
        ar: 'مسار المسلم الأصل (ترسيخ وتعميق)',
        en: 'Born Muslim Path (Deepening Faith)',
        ur: 'مسلمِ اصل راستہ (ایمانی پختگی اور فہم)',
        fr: "Parcours Musulman de naissance (Approfondissement)",
        es: 'Ruta Musulmán de Cuna (Profundización de la Fe)',
        id: 'Jalur Muslim Sejak Lahir (Memperdalam Iman)',
      },
      desc: {
        ar: 'رحلة متدرجة لتعميق الإيمان وفهم مقاصد العبادات والمعاملات لمن نشأ على الإسلام وفق المصادر المعتمدة.',
        en: 'A structured journey deepening faith, worship, and Islamic ethics for Muslims through verified sources.',
        ur: 'مستند مصادر کی روشنی میں عبادات اور معاملات کے مقاصد کو گہرائی سے سمجھنے کا سفر۔',
        fr: "Un cheminement méthodique pour approfondir la foi, les cultes et l'éthique islamique selon des sources authentifiées.",
        es: 'Un viaje estructurado para profundizar la fe, el culto y la ética islámica a través de fuentes verificadas.',
        id: 'Perjalanan terstruktur untuk memperdalam iman, ibadah, dan akhlak Islam melalui sumber-sumber terverifikasi.',
      },
      tag: { ar: 'ترسيخ الإيمان', en: 'Deepening Faith', ur: 'ایمانی پختگی', fr: 'Approfondissement', es: 'Profundización', id: 'Penguatan Iman' },
    },
    new_muslim: {
      title: {
        ar: 'مسار المسلم الجديد (تأسيس خطوة بخطوة)',
        en: 'New Muslim Path (Step-by-Step Foundation)',
        ur: 'نئے مسلم کا راستہ (مرحلہ وار بنیاد)',
        fr: 'Parcours Nouveau Musulman (Fondations pas à pas)',
        es: 'Ruta Nuevo Musulmán (Fundamentos paso a paso)',
        id: 'Jalur Mualaf (Fondasi Langkah demi Langkah)',
      },
      desc: {
        ar: 'تأسيس شامل يبدأ من التوحيد، مروراً بالشهادتين، الوضوء، الصلاة، وتفاصيل الحياة اليومية برفق وتيسير.',
        en: 'A supportive foundation covering Tawhid, Shahadah, prayer, and daily life with compassion and ease.',
        ur: 'توحید، شہادتین، وضو، نماز اور روزمرہ زندگی کے احکام کو آسانی اور محبت سے سیکھنے کی بنیاد۔',
        fr: 'Des bases complètes couvrant le Tawhid, la Shahada, les ablutions, la prière et la vie quotidienne avec douceur.',
        es: 'Fundamentos comprensivos desde el Tawhid, la Shahadah, la ablución, la oración y la vida diaria con cercanía.',
        id: 'Fondasi menyeluruh mencakup Tauhid, Syahadat, wudhu, shalat, dan kehidupan sehari-hari dengan penuh kemudahan.',
      },
      tag: { ar: 'تأسيس شامل', en: 'Foundation', ur: 'مکمل بنیاد', fr: 'Fondations', es: 'Fundamentos', id: 'Fondasi Utama' },
    },
    non_muslim: {
      title: {
        ar: 'مسار غير المسلم (التعرف والحوار الموضوعي)',
        en: 'Non-Muslim Path (Discovery & Objective Dialogue)',
        ur: 'غیر مسلم کے لیے راستہ (شناخت اور مکالمہ)',
        fr: 'Parcours Non-Musulman (Découverte & Dialogue)',
        es: 'Ruta No Musulmán (Descubrimiento y Diálogo)',
        id: 'Jalur Non-Muslim (Penemuan & Dialog Objektif)',
      },
      desc: {
        ar: 'استكشاف هادئ وموثق لجوهر الإسلام، الإله، النبوة، تفنيد الشبهات، ومقارنة الأديان بحكمة.',
        en: 'A peaceful, verified exploration of Islam, God, Prophethood, addressing misconceptions with wisdom.',
        ur: 'اسلام کی حقیقت، توحید، نبوت، غلط فہمیوں کے ازالے اور حکمت کے ساتھ تعارف کا سفر۔',
        fr: "Une exploration sereine et documentée de l'Islam, de Dieu, de la prophétie et des réponses aux doutes.",
        es: 'Una exploración tranquila y verificada del Islam, Dios, la profecía y respuestas sabias a malentendidos.',
        id: 'Eksplorasi yang tenang dan terverifikasi tentang Islam, Tuhan, Kenabian, serta klarifikasi syubhat secara bijak.',
      },
      tag: { ar: 'استكشاف موضوعي', en: 'Discovery', ur: 'علمی جائزہ', fr: 'Découverte', es: 'Descubrimiento', id: 'Eksplorasi Ilmiah' },
    },
    daiyah: {
      title: {
        ar: 'مسار الداعية (التأهيل ومحاكي الحوار)',
        en: "Da'iyah Path (Training & AI Simulation)",
        ur: 'داعی کا راستہ (تربیت اور مکالماتی سمیلیٹر)',
        fr: "Parcours Prédicateur / Da'iyah (Formation & Simulation)",
        es: "Ruta Da'iyah / Educador (Entrenamiento y Simulación)",
        id: 'Jalur Da\'i / Pendidik (Pelatihan & Simulasi AI)',
      },
      desc: {
        ar: 'إتقان أصول الحوار الحضاري، وضوابط الاستدلال، مع تدريبات تفاعلية ومحاكاة لمواقف واقعية.',
        en: 'Mastering civilized dialogue, verified reasoning, and realistic AI-powered conversation simulations.',
        ur: 'مہذب مکالمے اور استدلال کے اصولوں میں مہارت، مع حقیقت پسندانہ سمیلیٹر مشقیں۔',
        fr: 'Maîtrise du dialogue civilisé, des règles argumentatives et simulations interactives réalistes.',
        es: 'Dominio del diálogo civilizado, reglas de razonamiento y simulaciones de conversación realistas.',
        id: 'Menguasai adab dialog beradab, kaidah penalaran dalil, dan simulasi percakapan nyata bertenaga AI.',
      },
      tag: { ar: 'تأهيل ومحاكاة', en: 'Training & AI', ur: 'تربیت و سمیلیٹر', fr: 'Formation & IA', es: 'Entrenamiento & IA', id: 'Pelatihan & AI' },
    },
  },

  // Common UI actions
  actions: {
    startJourney: { ar: 'بدء المسار التعليمي', en: 'Start Learning Path', ur: 'تعلیمی سفر شروع کریں', fr: "Commencer l'apprentissage", es: 'Iniciar ruta de aprendizaje', id: 'Mulai Jalur Belajar' },
    continueJourney: { ar: 'متابعة الرحلة', en: 'Continue Journey', ur: 'سفر جاری رکھیں', fr: 'Continuer le parcours', es: 'Continuar el viaje', id: 'Lanjutkan Belajar' },
    changeTrack: { ar: 'تغيير المسار التعليمي', en: 'Change Learning Path', ur: 'تعلیمی راستہ تبدیل کریں', fr: 'Changer de parcours', es: 'Cambiar de ruta', id: 'Ubah Jalur Belajar' },
    embraceIslam: { ar: 'أرغب في اعتناق الإسلام', en: 'Embrace Islam', ur: 'میں اسلام قبول کرنا چاہتا ہوں', fr: "J'embrasse l'Islam", es: 'Deseo abrazar el Islam', id: 'Saya Ingin Memeluk Islam' },
    fastComplete: { ar: 'إتمام سريع للمسار', en: 'Fast Complete', ur: 'فوری تکمیل', fr: 'Complétion rapide', es: 'Completar rápido', id: 'Selesai Cepat' },
    viewCertificate: { ar: 'عرض وتصدير الشهادة', en: 'View Certificate', ur: 'سند دیکھیں اور محفوظ کریں', fr: 'Voir le certificat', es: 'Ver certificado', id: 'Lihat Sertifikat' },
    certificateReady: { ar: 'جاهزة', en: 'Ready', ur: 'تیار ہے', fr: 'Prêt', es: 'Listo', id: 'Siap' },
    searchPlaceholder: {
      ar: 'ابحث في محتوى المسار، الآيات، الأحاديث، أو قاعدة المصادر المعتمدة...',
      en: 'Search track lessons, verses, Hadiths, or verified sources...',
      ur: 'اسباق کے متن، قرآنی آیات، احادیث، یا مستند مصادر میں تلاش کریں...',
      fr: 'Rechercher dans les leçons, versets, hadiths ou sources...',
      es: 'Buscar en lecciones, versículos, hadices o fuentes...',
      id: 'Cari materi pelajaran, ayat Al-Qur\'an, hadis, atau sumber...',
    },
    instantSearch: { ar: 'بحث فوري', en: 'Live Search', ur: 'فوری تلاش', fr: 'Recherche directe', es: 'Búsqueda en vivo', id: 'Pencarian Instan' },
    scope: { ar: 'النطاق:', en: 'Scope:', ur: 'دائرہ کار:', fr: 'Portée :', es: 'Alcance:', id: 'Cakupan:' },
    all: { ar: 'الكل', en: 'All', ur: 'سب', fr: 'Tous', es: 'Todo', id: 'Semua' },
    currentTrackOnly: { ar: 'المسار الحالي فقط', en: 'Current Track', ur: 'صرف موجودہ راستہ', fr: 'Ce parcours uniquement', es: 'Solo ruta actual', id: 'Hanya Jalur Ini' },
    allLessons: { ar: 'كل الدروس', en: 'All Lessons', ur: 'تمام اسباق', fr: 'Toutes les leçons', es: 'Todas las lecciones', id: 'Semua Pelajaran' },
    verifiedSources: { ar: 'المصادر المعتمدة', en: 'Sources', ur: 'مستند مصادر', fr: 'Sources vérifiées', es: 'Fuentes verificadas', id: 'Sumber Terverifikasi' },
    resultsCount: { ar: 'نتيجة مطابقة', en: 'results', ur: 'نتائج', fr: 'résultats', es: 'resultados', id: 'hasil cocok' },
    suggestedSearches: { ar: 'عمليات بحث مقترحة:', en: 'Suggested Searches:', ur: 'تجویز کردہ تلاش:', fr: 'Recherches suggérées :', es: 'Búsquedas sugeridas:', id: 'Saran Pencarian:' },
    noResultsFound: { ar: 'لا توجد نتائج مطابقة', en: 'No results found', ur: 'کوئی نتیجہ نہیں ملا', fr: 'Aucun résultat trouvé', es: 'No se encontraron resultados', id: 'Tidak ada hasil yang cocok' },
    nextLesson: { ar: 'درسك القادم الموصى به:', en: 'Recommended Next Lesson:', ur: 'اگلا تجویز کردہ سبق:', fr: 'Prochaine leçon recommandée :', es: 'Siguiente lección recomendada:', id: 'Pelajaran Berikutnya:' },
    continueLessonNow: { ar: 'متابعة الدرس الآن', en: 'Continue Lesson', ur: 'سبق جاری رکھیں', fr: 'Reprendre la leçon', es: 'Continuar la lección', id: 'Lanjutkan Pelajaran Sekarang' },
    testReminder: { ar: 'اختبار تذكير الـ 24 ساعة', en: 'Test 24h Reminder', ur: '24 گھنٹے یاد دہانی کا ٹیسٹ', fr: 'Test rappel 24h', es: 'Probar recordatorio 24h', id: 'Uji Pengingat 24 Jam' },
    minutes: { ar: 'دقائق', en: 'mins', ur: 'منٹ', fr: 'min', es: 'min', id: 'menit' },
  },

  // Interactive Quiz
  quiz: {
    title: { ar: 'تقييم الفهم والاستيعاب', en: 'Comprehension Quiz', ur: 'فہم اور ادراک کا جائزہ', fr: 'Quiz de compréhension', es: 'Cuestionario de comprensión', id: 'Kuis Pemahaman' },
    question: { ar: 'السؤال', en: 'Question', ur: 'سوال', fr: 'Question', es: 'Pregunta', id: 'Pertanyaan' },
    submit: { ar: 'تأكيد الإجابة وفحص الصحة', en: 'Submit & Check Answer', ur: 'جواب کی تصدیق اور جانچ', fr: 'Valider et vérifier', es: 'Enviar y verificar', id: 'Kirim & Periksa Jawaban' },
    nextQuestion: { ar: 'السؤال التالي ←', en: 'Next Question →', ur: 'اگلا سوال ←', fr: 'Question suivante →', es: 'Siguiente pregunta →', id: 'Pertanyaan Selanjutnya →' },
    finishQuiz: { ar: 'إتمام الاختبار واعتماد النتيجة', en: 'Finish Quiz', ur: 'ٹیسٹ مکمل کریں', fr: 'Terminer le quiz', es: 'Finalizar cuestionario', id: 'Selesaikan Kuis' },
    correctAnswer: { ar: '🎉 إجابة صحيحة ومؤصلة!', en: '🎉 Correct Answer!', ur: '🎉 درست اور مستند جواب!', fr: '🎉 Bonne réponse authentifiée !', es: '🎉 ¡Respuesta correcta y verificada!', id: '🎉 Jawaban Benar & Terverifikasi!' },
    reviewConcept: { ar: '💡 تصحيح المفهوم والتغذية الراجعة:', en: '💡 Concept Review & Feedback:', ur: '💡 اصلاح فہم اور وضاحت:', fr: '💡 Explication et retour pédagogique :', es: '💡 Revisión conceptual y retroalimentación:', id: '💡 Ulasan Konsep & Umpan Balik:' },
    passedStage: { ar: 'تم اجتياز تقييم المحطة بنجاح', en: 'Stage Passed', ur: 'مرحلہ کامیابی سے مکمل', fr: 'Étape validée avec succès', es: 'Etapa aprobada con éxito', id: 'Tahap Berhasil Dilewati' },
    congrats: { ar: 'مبارك! أتممت اختبار هذه المرحلة المعرفية', en: 'Congratulations! Quiz Passed', ur: 'مبارک ہو! آپ نے اس مرحلے کا ٹیسٹ پاس کر لیا', fr: 'Félicitations ! Vous avez réussi le quiz', es: '¡Felicidades! Has completado esta etapa', id: 'Selamat! Anda menyelesaikan tahap ini' },
    retakeQuiz: { ar: 'إعادة الاختبار', en: 'Retake Quiz', ur: 'دوبارہ ٹیسٹ دیں', fr: 'Refaire le quiz', es: 'Repetir cuestionario', id: 'Ulangi Kuis' },
    continueMap: { ar: 'متابعة مسار الرحلة المعرفية', en: 'Continue Journey Map', ur: 'علمی سفر کا نقشہ جاری رکھیں', fr: 'Continuer le plan du parcours', es: 'Continuar mapa del viaje', id: 'Lanjutkan Peta Perjalanan' },
  }
};
