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
  hubs: Record<string, Record<Language, string>>;
  tracks: Record<TrackId, {
    title: Record<Language, string>;
    desc: Record<Language, string>;
    tag: Record<Language, string>;
  }>;
  actions: Record<string, Record<Language, string>>;
  quiz: Record<string, Record<Language, string>>;
  common: Record<string, Record<Language, string>>;
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
    dhikr: { ar: 'ركن الأذكار', en: 'Dhikr Sanctuary', ur: 'رکنِ اذکار', fr: 'Sanctuaire de Dhikr', es: 'Santuario de Dhikr', id: 'Ruang Dzikir' },
    tasbih: { ar: 'المسبحة', en: 'Tasbih', ur: 'تسبیح', fr: 'Chapelet', es: 'Tasbih', id: 'Tasbih' },
    inclusivity: { ar: 'مبادرات الشمول', en: 'Inclusivity Hub', ur: 'شمولیتی اقدامات', fr: 'Pôle Inclusion', es: 'Centro de Inclusión', id: 'Pusat Inklusivitas' },
    seniorMode: { ar: 'الوضع الخاص', en: 'Senior Mode', ur: 'خاص موڈ', fr: 'Mode Senior', es: 'Modo Senior', id: 'Mode Senior' },
  },

  // Specialized Community Hubs
  hubs: {
    dhikrTitle: { ar: 'ركن الأذكار والسكينة', en: 'Dhikr & Serenity Sanctuary', ur: 'رکنِ اذکار و سکینہ', fr: 'Sanctuaire de Dhikr & Sérénité', es: 'Santuario de Dhikr y Serenidad', id: 'Ruang Dzikir & Ketenangan' },
    dhikrDesc: { ar: 'مسبحة ذكية، استغفار، صلاة على النبي وتنبيهات مخصصة', en: 'Smart Tasbih, Istighfar, Salawat & Custom Reminders', ur: 'سمارٹ تسبیح، استغفار اور درود شریف', fr: 'Tasbih intelligent, Istighfar, Salawat et rappels', es: 'Tasbih inteligente, Istighfar, Salawat y recordatorios', id: 'Tasbih pintar, Istighfar, Salawat & pengingat khusus' },
    signLanguageTitle: { ar: 'قاموس لغة الإشارة الإسلامي', en: 'Islamic Sign Language Hub', ur: 'اسلامی اشاروں کی زبان', fr: 'Langue des Signes Islamique', es: 'Lengua de Signos Islámica', id: 'Bahasa Isyarat Islam' },
    signLanguageDesc: { ar: 'للصم وضعاف السمع مع وضع العرض البطيء', en: 'For the deaf & hard of hearing with slow playback', ur: 'قوتِ سماعت سے محروم افراد کے لیے', fr: 'Pour les malentendants avec affichage lent', es: 'Para personas sordas con reproducción lenta', id: 'Untuk tunarungu dengan tampilan gerak lambat' },
    ilmJuniorTitle: { ar: 'براعم عِلم ولوحة ولي الأمر', en: 'ILM Junior & Family Hub', ur: 'براعم عِلم و سرپرست ڈیش بورڈ', fr: 'ILM Junior & Espace Famille', es: 'ILM Junior y Panel Familiar', id: 'ILM Junior & Panel Keluarga' },
    ilmJuniorDesc: { ar: 'للأطفال 6-12 سنة والأسرة مع مسابقات وقصص', en: 'For kids 6-12 & parents with stories and quizzes', ur: 'بچوں اور خاندان کے لیے کہانیاں اور کوئز', fr: 'Pour les enfants de 6-12 ans et parents', es: 'Para niños de 6-12 años y familias', id: 'Untuk anak-anak 6-12 tahun & keluarga' },
    culturalEtiquetteTitle: { ar: 'دليل التوطين والآداب للجاليات', en: 'Cultural Etiquette Guide', ur: 'ثقافتی آداب کی رہنما', fr: 'Guide d\'étiquette culturelle', es: 'Guía de etiqueta cultural', id: 'Panduan Etiket & Budaya' },
    culturalEtiquetteDesc: { ar: 'آداب المساجد والجوار والتعايش بـ 5 لغات حية', en: 'Mosque & community etiquette in 5 living languages', ur: 'مساجد اور سماجی آداب 5 عالمی زبانوں میں', fr: 'Étiquette des mosquées et de vie en 5 langues', es: 'Etiqueta de mezquitas y convivencia en 5 idiomas', id: 'Etiket masjid & kehidupan sosial dalam 5 bahasa' },
    scholasticSearchTitle: { ar: 'البحث التأصيلي المقارن', en: 'Scholastic Comparative Search', ur: 'تقابلی علمی تلاش', fr: 'Recherche Scolastique Comparative', es: 'Búsqueda Escolástica Comparativa', id: 'Pencarian Komparatif Ilmiah' },
    scholasticSearchDesc: { ar: 'لطلبة العلم والباحثين مقارنة بين المصادر الأربعة', en: 'For researchers comparing Quran, Hadith & 4 Madhabs', ur: 'طلبہ اور محققین کے لیے 4 مآخذ کے تقابل کے ساتھ', fr: 'Pour les chercheurs comparant les 4 sources', es: 'Para investigadores comparando las 4 fuentes', id: 'Untuk penuntut ilmu membandingkan 4 sumber utama' },
    fieldDaiyahTitle: { ar: 'حقيبة وبطاقات الداعية الميداني', en: 'Field Outreach Kit & Cards', ur: 'میدانی داعی کٹ و کارڈز', fr: 'Mallette et Cartes du Daïyah', es: 'Kit y Tarjetas de Campo', id: 'Tas & Kartu Da\'i Lapangan' },
    fieldDaiyahDesc: { ar: 'جاهزة للطباعة والمشاركة المباشرة عبر واتساب', en: 'Printable and shareable directly via WhatsApp', ur: 'پرنٹ اور واٹس ایپ پر شیئرنگ کے لیے تیار', fr: 'Prêt pour l\'impression et le partage WhatsApp', es: 'Listo para imprimir y compartir por WhatsApp', id: 'Siap cetak dan dibagikan via WhatsApp' },
    copilotTitle: { ar: 'المساعد الميداني الفوري', en: 'Field Whispering Co-Pilot', ur: 'فوری میدانی معاون', fr: 'Co-Pilote de Terrain', es: 'Copiloto de Campo', id: 'Kopilot Lapangan Cepat' },
    copilotDesc: { ar: 'ردود عقلية فورية وتفنيد الشبهات بالحكمة', en: 'Instant rational proofs and wisdom-based responses', ur: 'حکمت کے ساتھ شکوک و شبہات کے فوری جوابات', fr: 'Preuves rationnelles et réponses avec sagesse', es: 'Pruebas racionales y respuestas con sabiduría', id: 'Bukti rasional instan dan bantahan syubhat dengan bijak' },
    thirtyDaysTitle: { ar: 'الأيام الـ 30 الأولى للمهتدي', en: 'First 30 Days Foundations', ur: 'نئے مسلم کے پہلے 30 دن', fr: 'Les 30 Premiers Jours', es: 'Los Primeros 30 Días', id: '30 Hari Pertama Mualaf' },
    thirtyDaysDesc: { ar: 'خطة يومية هادئة وجداول زمنية مبسطة', en: 'Step-by-step 30-day gentle journey for new Muslims', ur: 'نئے مسلم کے لیے پرسکون اور آسان روزانہ کا لائحہ عمل', fr: 'Parcours progressif et serein sur 30 jours', es: 'Plan diario tranquilo y pasos sencillos', id: 'Rencana harian bertahap untuk mualaf' },
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
  },

  // Common UI Strings across screens
  common: {
    back: { ar: 'رجوع', en: 'Back', ur: 'واپس', fr: 'Retour', es: 'Atrás', id: 'Kembali' },
    next: { ar: 'التالي', en: 'Next', ur: 'اگلا', fr: 'Suivant', es: 'Siguiente', id: 'Berikutnya' },
    close: { ar: 'إغلاق', en: 'Close', ur: 'بند کریں', fr: 'Fermer', es: 'Cerrar', id: 'Tutup' },
    startLesson: { ar: 'ابدأ الدرس الحواري', en: 'Start Interactive Lesson', ur: 'سبق شروع کریں', fr: 'Commencer la leçon', es: 'Iniciar lección', id: 'Mulai Pelajaran' },
    reviewLesson: { ar: 'مراجعة المادة', en: 'Review Lesson', ur: 'سبق کا جائزہ', fr: 'Réviser la leçon', es: 'Revisar lección', id: 'Ulas Pelajaran' },
    locked: { ar: 'مغلق حالياً', en: 'Locked', ur: 'فی الوقت بند ہے', fr: 'Verrouillé', es: 'Bloqueado', id: 'Terkunci' },
    completed: { ar: 'تم الاجتياز بنجاح', en: 'Completed', ur: 'کامیابی سے مکمل', fr: 'Validé avec succès', es: 'Completado con éxito', id: 'Selesai' },
    stagesCount: { ar: 'محطات معرفية متسلسلة', en: 'sequential milestones', ur: 'مربوط مراحل', fr: 'étapes séquentielles', es: 'etapas secuenciales', id: 'tahapan berurutan' },
    milestonesTitle: { ar: 'محطات الرحلة المعرفية', en: 'Knowledge Journey Stages', ur: 'علمی سفر کے مراحل', fr: 'Étapes du parcours', es: 'Etapas del viaje', id: 'Tahapan Perjalanan' },
    allCompletedTitle: { ar: 'مبارك! أتممت كافة محطات هذا المسار بنجاح', en: 'Congratulations! All stages completed successfully', ur: 'مبارک ہو! آپ نے اس راستے کے تمام مراحل مکمل کر لیے', fr: 'Félicitations ! Vous avez complété toutes les étapes', es: '¡Felicidades! Has completado todas las etapas', id: 'Selamat! Anda telah menyelesaikan semua tahapan' },
    exportCertBtn: { ar: 'فتح وتصدير الشهادة الملكية', en: 'Open & Export Certificate', ur: 'شاہی سند دیکھیں اور محفوظ کریں', fr: 'Voir et exporter le certificat', es: 'Ver y exportar certificado', id: 'Buka & Ekspor Sertifikat' },
    previewCertBtn: { ar: 'معاينة الشهادة', en: 'Preview Certificate', ur: 'سند کا پیش نظارہ', fr: 'Aperçu du certificat', es: 'Vista previa de certificado', id: 'Pratinjau Sertifikat' },
    aiMentorTyping: { ar: 'المعلم يكتب...', en: 'Mentor is typing...', ur: 'استاد لکھ رہے ہیں...', fr: 'Le tuteur écrit...', es: 'El mentor está escribiendo...', id: 'Pembimbing sedang mengetik...' },
    speakNow: { ar: 'تحدث الآن، جاري تحويل صوتك لنص تلقائياً...', en: 'Speak now, converting voice to text...', ur: 'اب بولیں، آواز سے متن میں تبدیلی جاری ہے...', fr: 'Parlez maintenant, conversion en cours...', es: 'Habla ahora, convirtiendo voz a texto...', id: 'Bicara sekarang, mengubah suara ke teks...' },
    namePlaceholder: { ar: 'اكتب اسمك الكريم هنا...', en: 'Enter your name here...', ur: 'اپنا نام یہاں لکھیں...', fr: 'Entrez votre nom ici...', es: 'Escribe tu nombre aquí...', id: 'Tulis nama Anda di sini...' },
    agePlaceholder: { ar: 'اكتب عمرك هنا...', en: 'Enter your age here...', ur: 'اپنی عمر یہاں لکھیں...', fr: 'Entrez votre âge ici...', es: 'Escribe tu edad aquí...', id: 'Tulis usia Anda di sini...' },
    messagePlaceholder: { ar: 'اكتب إجابتك أو استفسارك هنا...', en: 'Type your answer or inquiry here...', ur: 'اپنا جواب یا سوال یہاں لکھیں...', fr: 'Tapez votre réponse ou question ici...', es: 'Escribe tu respuesta o consulta aquí...', id: 'Ketik jawaban atau pertanyaan Anda di sini...' },
    printCert: { ar: 'طباعة الشهادة', en: 'Print Certificate', ur: 'سند پرنٹ کریں', fr: 'Imprimer le certificat', es: 'Imprimir certificado', id: 'Cetak Sertifikat' },
    continueMapBtn: { ar: 'متابعة الخريطة والمراحل المتقدمة', en: 'Continue to Journey Map', ur: 'نقشہ اور اگلے مراحل جاری رکھیں', fr: 'Continuer le plan du parcours', es: 'Continuar mapa del viaje', id: 'Lanjutkan ke Peta Perjalanan' },
    certTitleVirtual: { ar: 'شهادة إتمام مستوى افتراضية', en: 'Completion Certificate', ur: 'تکمیل کی اعزازی سند', fr: 'Certificat d\'accomplissement', es: 'Certificado de finalización', id: 'Sertifikat Penyelesaian' },
    certCertified: { ar: 'معتمد ومجتاز', en: 'Verified & Passed', ur: 'تصدیق شدہ اور منظور', fr: 'Vérifié et validé', es: 'Verificado y aprobado', id: 'Terverifikasi & Lulus' },
    aiTutorBadge: { ar: 'المعلم الذكي', en: 'AI Mentor', ur: 'ذہین استاد', fr: 'Tuteur IA', es: 'Mentor IA', id: 'Pembimbing AI' },
    you: { ar: 'أنت', en: 'You', ur: 'آپ', fr: 'Vous', es: 'Tú', id: 'Anda' },
    splashInit: { ar: 'جاري تهيئة المصادر والمسارات المعتمدة...', en: 'Initializing verified sources and learning tracks...', ur: 'مستند مآخذ اور تعلیمی راستوں کی تیاری جاری ہے...', fr: 'Initialisation des sources authentifiées...', es: 'Inicializando fuentes verificadas y rutas...', id: 'Menyiapkan sumber terverifikasi dan materi...' },
    splashWelcome: { ar: 'مرحباً بك في رحلة التعليم والتمكين الحواري الذكي الموثق', en: 'Welcome to your verified Islamic dialogue and learning journey', ur: 'مستند اسلامی مکالمے اور تعلیمی سفر میں خوش آمدید', fr: 'Bienvenue dans votre parcours vérifié d\'apprentissage islamique', es: 'Bienvenido a tu viaje verificado de diálogo y aprendizaje islámico', id: 'Selamat datang dalam perjalanan belajar Islam terverifikasi' },
    quranBrowser: { ar: 'القرآن الكريم', en: 'Holy Quran', ur: 'قرآن مجید', fr: 'Saint Coran', es: 'Sagrado Corán', id: 'Al-Qur\'an Al-Karim' },
    favorites: { ar: 'المفضلة', en: 'Favorites', ur: 'پسندیدہ', fr: 'Favoris', es: 'Favoritos', id: 'Favorit' },
    curriculum: { ar: 'المحطات والدروس', en: 'Curriculum', ur: 'نصاب کے مراحل', fr: 'Curriculum', es: 'Plan de estudios', id: 'Kurikulum' },
    interactiveTutor: { ar: 'المعلم التفاعلي', en: 'Interactive Mentor', ur: 'ذہین استاد', fr: 'Tuteur Interactif', es: 'Mentor Interactivo', id: 'Pembimbing Interaktif' },
  }
};
