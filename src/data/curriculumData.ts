import { LessonStage, SimulatorScenario } from '../types';
import { APPROVED_SOURCES_REGISTRY } from './sourcesRegistry';

export const CURRICULUM_DATA: LessonStage[] = [
  // ==========================================
  // مسار المسلم الجديد (NEW MUSLIM TRACK)
  // ==========================================
  {
    id: 'nm-01',
    trackId: 'new_muslim',
    stageNumber: 1,
    title: 'معرفة الله والتوحيد الخالص',
    titleEn: 'Knowing Allah and Pure Monotheism (Tawhid)',
    subtitle: 'الأساس الأول الذي يُبنى عليه كل إيمان: إفراد الخالق بالعبادة والصفات العلى',
    subtitleEn: 'The first foundation upon which all faith is built: worshiping the Creator alone',
    estimatedMinutes: 12,
    contentLevel: 'A',
    scriptures: [
      {
        type: 'quran',
        arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        translationEn: 'Say, "He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent."',
        reference: 'سورة الإخلاص: الآيات 1-4',
        referenceEn: 'Surah Al-Ikhlas (112:1-4)',
        source: APPROVED_SOURCES_REGISTRY.quran_mushaf
      },
      {
        type: 'hadith',
        arabicText: 'قَالَ رَسُولُ اللَّهِ ﷺ: «حَقُّ اللَّهِ عَلَى العِبَادِ أَنْ يَعْبُدُوهُ وَلاَ يُشْرِكُوا بِهِ شَيْئًا»',
        translationEn: 'The Messenger of Allah ﷺ said: "The right of Allah upon His servants is that they worship Him and associate nothing with Him."',
        reference: 'صحيح البخاري: رقم 2856، صحيح مسلم: رقم 30',
        referenceEn: 'Sahih Al-Bukhari 2856, Sahih Muslim 30',
        grade: 'حديث صحيح متفق عليه',
        source: APPROVED_SOURCES_REGISTRY.dorar_hadith
      }
    ],
    conceptExplanation: `التوحيد هو قطب الرَّحَى في دين الإسلام؛ ويعني إفراد الله سبحانه وتعالى بما يختص به:
1. توحيد الربوبية: الإيقان الجازم بأن الله هو الخالق، الرازق، المالك، المدبر لهذا الكون الفسيح، لا شريك له في خلقه.
2. توحيد الألوهية: إخلاص سائر أعمال العبادة لله وحده (الدعاء، الصلاة، الاستعانة، التوكل، الرجاء)، فلا يُصرف شيءٌ منها لملك مقرب ولا نبي مرسل.
3. توحيد الأسماء والصفات: إثبات ما أثبته الله لنفسه في كتابه أو على لسان رسوله ﷺ من الأسماء الحسنى والصفات العلى، من غير تحريف ولا تعطيل ولا تكييف ولا تمثيل (لَيْسَ كَمِثْلِهِ شَيْءٌ وَهُوَ السَّمِيعُ الْبَصِيرُ).`,
    conceptExplanationEn: `Tawhid is the central core of Islam. It means dedicating pure devotion to Allah in His unique rights:
1. Tawhid ar-Rububiyyah (Lordship): Believing that Allah alone is the Creator, Sustainer, and Master of the universe.
2. Tawhid al-Uluhiyyah (Worship): Directing every act of devotion—prayer, supplication, reliance, and hope—sincerely to Allah alone.
3. Tawhid al-Asma was-Sifat (Names & Attributes): Affirming the sublime Names and Attributes Allah described for Himself in the Quran and Sunnah, without distortion or resemblance to creation.`,
    keyTerms: [
      {
        ar: 'التوحيد',
        en: 'Tawhid',
        approvedStandard: 'إفراد الله بالعبادة والربوبية والأسماء الحسنى (قاموس التحدي ص 8)'
      },
      {
        ar: 'الربوبية',
        en: 'Rububiyyah (Lordship)',
        approvedStandard: 'أفعال الرب كالخلق والرزق والإحياء والتدبير المطلق'
      },
      {
        ar: 'الألوهية',
        en: 'Uluhiyyah (Worship)',
        approvedStandard: 'أفعال العباد التعبدية الموجهة للخالق وحده بلا وسيط'
      }
    ],
    sources: [
      APPROVED_SOURCES_REGISTRY.quran_mushaf,
      APPROVED_SOURCES_REGISTRY.dorar_aqeeda,
      APPROVED_SOURCES_REGISTRY.dawa_center
    ],
    quiz: [
      {
        id: 'q1-nm1',
        question: 'ما هو المعنى الشرعي الدقيق لـ "توحيد الألوهية"؟',
        questionEn: 'What is the precise meaning of Tawhid al-Uluhiyyah?',
        options: [
          'أن الله خلق الكون والنجوم',
          'إفراد الله وحده بجميع أنواع العبادة والدعاء بلا شريك',
          'الإيمان بوجود قوة عليا فقط',
          'التفكير الفلسفي في علة الوجود'
        ],
        optionsEn: [
          'Believing Allah created the universe',
          'Directing all acts of worship and supplication exclusively to Allah alone',
          'Merely believing in a supreme power',
          'Philosophical reflection on existence'
        ],
        correctIndex: 1,
        explanation: 'توحيد الألوهية هو إفراد الله بعبادة العباد (الدعاء، الصلاة، التوكل)، استناداً لقوله تعالى: ﴿وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ لَّا إِلَٰهَ إِلَّا هُوَ الرَّحْمَٰنُ الرَّحِيمُ﴾.',
        source: APPROVED_SOURCES_REGISTRY.dorar_aqeeda
      }
    ],
    reflectionPrompt: 'كيف يمنح التوحيد الطمأنينة لقلبك بأن تدعو خالق الكون مباشرة دون حاجة لوسيط بشري؟',
    reflectionPromptEn: 'How does Tawhid grant peace to your heart knowing you can address the Creator directly without any human intermediary?'
  },
  {
    id: 'nm-02',
    trackId: 'new_muslim',
    stageNumber: 2,
    title: 'الشهادتان: المدخل والمعنى والالتزام',
    titleEn: 'The Shahadah: Portal of Faith and Covenant',
    subtitle: 'أشهد أن لا إله إلا الله وأشهد أن محمداً رسول الله: حقيقتها وما تقتضيه',
    subtitleEn: 'Bearing witness that none has the right to be worshiped except Allah and that Muhammad is His Messenger',
    estimatedMinutes: 15,
    contentLevel: 'A',
    scriptures: [
      {
        type: 'quran',
        arabicText: 'فَاعْلَمْ أَنَّهُ لَا إِلَٰهَ إِلَّا اللَّهُ وَاسْتَغْفِرْ لِذَنبِكَ',
        translationEn: 'So know, [O Muhammad], that there is no deity worthy of worship except Allah and ask forgiveness for your sin.',
        reference: 'سورة محمد: الآية 19',
        referenceEn: 'Surah Muhammad (47:19)',
        source: APPROVED_SOURCES_REGISTRY.quran_mushaf
      },
      {
        type: 'hadith',
        arabicText: 'قَالَ رَسُولُ اللَّهِ ﷺ: «بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ...»',
        translationEn: 'The Messenger of Allah ﷺ said: "Islam is built on five: To testify that there is none worthy of worship except Allah and Muhammad is the Messenger of Allah..."',
        reference: 'صحيح البخاري: رقم 8، صحيح مسلم: رقم 16',
        referenceEn: 'Sahih Al-Bukhari 8, Sahih Muslim 16',
        grade: 'حديث صحيح متفق عليه',
        source: APPROVED_SOURCES_REGISTRY.dorar_hadith
      }
    ],
    conceptExplanation: `الشهادتان هما مفتاح الدخول في الإسلام:
1. شطر النفي والإثبات في (لا إله إلا الله):
   - «لا إله»: نفيٌ قاطع لاستحقاق أي كائن كان للعبادة.
   - «إلا الله»: إثباتٌ جازم للعبودية الحقة لله تبارك وتعالى وحده.
2. معنى (محمداً رسول الله):
   - تصديقه ﷺ فيما أخبر، وطاعته فيما أمر، واجتناب ما عنه نهى وزجر، وألا يُعبد الله إلا بما شرع.
3. شروط الشهادة المستقرة: العلم المنافي للجهل، واليقين المنافي للشك، والإخلاص المنافي للشرك، والصدق المنافي للنفاق، والمحبة، والانقياد، والقبول.`,
    conceptExplanationEn: `The Shahadah is the sacred gateway into Islam:
1. Negation & Affirmation in "La Ilaha Illa Allah":
   - "La Ilaha": Total negation of any entitlement to worship for any creation.
   - "Illa Allah": Exclusive affirmation of divine worship to Allah alone.
2. "Muhammadur Rasulullah":
   - Believing his truthful message, following his guidance, and worshiping Allah in the righteous way taught by him.
3. Key pillars: Knowledge, certainty, sincerity, love, submission, and acceptance.`,
    keyTerms: [
      {
        ar: 'الشهادة',
        en: 'The Shahadah',
        approvedStandard: 'الإقرار باللسان والاعتقاد بالقلب بوحدانية الله ورسالة نبيه محمد ﷺ'
      },
      {
        ar: 'النبوة',
        en: 'Prophethood',
        approvedStandard: 'اصطفاء الله لرسله بوحيه لتوجيه البشرية بالحكمة (قاموس التحدي ص 8)'
      }
    ],
    sources: [
      APPROVED_SOURCES_REGISTRY.dorar_aqeeda,
      APPROVED_SOURCES_REGISTRY.dawa_center,
      APPROVED_SOURCES_REGISTRY.jamhara_terms
    ],
    quiz: [
      {
        id: 'q1-nm2',
        question: 'ما هو الركنان الأساسيان لجملة التوحيد "لا إله إلا الله"؟',
        questionEn: 'What are the two foundational pillars of the statement "La Ilaha Illa Allah"?',
        options: [
          'الرجاء والخوف فقط',
          'النفي لجميع الآلهة المزعومة، ثم الإثبات لله وحده',
          'المعرفة التاريخية بدون عمل',
          'النطق باللسان فقط دون اعتقاد'
        ],
        optionsEn: [
          'Hope and fear only',
          'Negation of all false deities, then Affirmation to Allah alone',
          'Historical knowledge without practice',
          'Utterance by tongue without conviction'
        ],
        correctIndex: 1,
        explanation: 'الجملة تقوم على ركني: "النفي" في (لا إله) و"الإثبات" في (إلا الله).',
        source: APPROVED_SOURCES_REGISTRY.dorar_aqeeda
      }
    ],
    reflectionPrompt: 'الشهادة عهدٌ صادق مع الله بحرية القلب من عبودية المخلوق إلى عبودية الخالق وحده.',
    reflectionPromptEn: 'The Shahadah is a covenant freeing the human heart from the servitude of creations to the servitude of the Creator alone.'
  },
  {
    id: 'nm-03',
    trackId: 'new_muslim',
    stageNumber: 3,
    title: 'أركان الإسلام الخمسة وأركان الإيمان الستة',
    titleEn: 'The 5 Pillars of Islam and 6 Pillars of Iman',
    subtitle: 'حديث جبريل العظيم: التفريق الشرعي بين ظاهر العمل وباطن العقيدة',
    subtitleEn: 'The great Hadith of Jibril: Distinguishing outward practice from inward conviction',
    estimatedMinutes: 18,
    contentLevel: 'A',
    scriptures: [
      {
        type: 'hadith',
        arabicText: 'قَالَ جِبْرِيلُ عَلَيْهِ السَّلَامُ: «يَا مُحَمَّدُ، أَخْبِرْنِي عَنِ الإِسْلاَمِ؟ فَقَالَ: الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَتُقِيمَ الصَّلاَةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ البَيْتَ إِنِ اسْتَطَعْتَ إِلَيْهِ سَبِيلاً...»',
        translationEn: 'Jibril asked: "O Muhammad, tell me about Islam." The Prophet ﷺ said: "Islam is to testify that none is worthy of worship but Allah and Muhammad is His Messenger, establish prayer, pay Zakat, fast Ramadan, and make pilgrimage to the House if you are able..."',
        reference: 'صحيح مسلم: رقم 8 (حديث جبريل المشهور)',
        referenceEn: 'Sahih Muslim 8 (The celebrated Hadith of Gabriel)',
        grade: 'حديث صحيح',
        source: APPROVED_SOURCES_REGISTRY.dorar_hadith
      }
    ],
    conceptExplanation: `بين النبي ﷺ تكامل الدين في بنيتين متلازمتين:
أولاً: أركان الإسلام (العمل الظاهر):
1. الشهادتان: مدخل الدين.
2. إقامة الصلاة: خمس صلوات يومية صلة دائمة بين العبد وربه.
3. إيتاء الزكاة: تطهير للمال وتكافل اجتماعي رحيم للفقراء.
4. صيام رمضان: تدريب على التقوى ومراقبة الله وضبط النفس.
5. حج البيت لمن استطاع إليه سبيلاً: مؤتمر توحيدي عالمي مرة في العمر للمستطيع.

ثانياً: أركان الإيمان (الاعتقاد الباطن):
1. الإيمان بالله، 2. وملائكته، 3. وكتبه، 4. ورسله، 5. واليوم الآخر، 6. والقدر خيره وشره من الله.`,
    conceptExplanationEn: `The Prophet ﷺ clarified that religion consists of outward actions and inward convictions:
1. Five Pillars of Islam (Outward Practice):
   - Shahadah (Testimony of Faith)
   - Salah (5 daily prayers connecting the soul with Allah)
   - Zakat (Purifying charity assisting the needy)
   - Sawm (Fasting Ramadan for self-restraint and mindfulness)
   - Hajj (Pilgrimage to Makkah once in a lifetime for those able)
2. Six Pillars of Iman (Inward Faith):
   - Belief in Allah, His Angels, His Books, His Messengers, the Last Day, and Divine Decree (Qadar).`,
    keyTerms: [
      {
        ar: 'أركان الإسلام',
        en: 'Pillars of Islam',
        approvedStandard: 'الأعمال التعبدية الظاهرة الأساسية المفروضة على كل مسلم بالغ عاقل'
      },
      {
        ar: 'أركان الإيمان',
        en: 'Pillars of Faith (Iman)',
        approvedStandard: 'أصول الاعتقاد القلبي الستة المستقرة في القرآن والسنة'
      }
    ],
    sources: [
      APPROVED_SOURCES_REGISTRY.dorar_hadith,
      APPROVED_SOURCES_REGISTRY.dorar_aqeeda,
      APPROVED_SOURCES_REGISTRY.dawa_center
    ],
    quiz: [
      {
        id: 'q1-nm3',
        question: 'كم عدد أركان الإيمان الستة في حديث جبريل عليه السلام؟',
        questionEn: 'How many are the inward pillars of Iman taught in the Hadith of Jibril?',
        options: ['3 أركان', '5 أركان', '6 أركان', '7 أركان'],
        optionsEn: ['3 pillars', '5 pillars', '6 pillars', '7 pillars'],
        correctIndex: 2,
        explanation: 'أركان الإيمان ستة: الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر وبالقدر خيره وشره.',
        source: APPROVED_SOURCES_REGISTRY.dorar_aqeeda
      }
    ],
    reflectionPrompt: 'الإسلام يجمع بين طهارة الباطن باليقين، وسمو الظاهر بالعبادة والعمل الصالح.',
    reflectionPromptEn: 'Islam harmonizes inward spiritual conviction with outward virtuous deeds and devotional worship.'
  },
  {
    id: 'nm-04',
    trackId: 'new_muslim',
    stageNumber: 4,
    title: 'الطهارة والوضوء وكيفية الصلاة اليومية',
    titleEn: 'Purification (Taharah), Wudu, and the Daily Prayers',
    subtitle: 'مفتاح الصلاة الطهور: التدرج في تعلم أوقات الصلوات الخمس وصفة الأداء',
    subtitleEn: 'The key to prayer is purification: Step-by-step guide to Wudu and performing Salah',
    estimatedMinutes: 20,
    contentLevel: 'A',
    scriptures: [
      {
        type: 'quran',
        arabicText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ',
        translationEn: 'O you who have believed, when you rise to [pray], wash your faces and your forearms to the elbows and wipe over your heads and wash your feet to the ankles.',
        reference: 'سورة المائدة: الآية 6',
        referenceEn: 'Surah Al-Maidah (5:6)',
        source: APPROVED_SOURCES_REGISTRY.quran_mushaf
      },
      {
        type: 'hadith',
        arabicText: 'قَالَ رَسُولُ اللَّهِ ﷺ: «صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي»',
        translationEn: 'The Messenger of Allah ﷺ said: "Pray as you have seen me praying."',
        reference: 'صحيح البخاري: رقم 631',
        referenceEn: 'Sahih Al-Bukhari 631',
        grade: 'حديث صحيح',
        source: APPROVED_SOURCES_REGISTRY.dorar_hadith
      }
    ],
    conceptExplanation: `الصلاة هي عمود الدين، وهي أول ما يُحاسب عليه العبد يوم القيامة:
1. صفة الوضوء الميسر:
   - النية في القلب والتسمية (بسم الله).
   - غسل الكفين ثلاثاً، المضمضة والاستنشاق ثلاثاً.
   - غسل الوجه كاملاً ثلاثاً.
   - غسل اليدين مع المرفقين ثلاثاً (من أطراف الأصابع إلى المرفق).
   - مسح الرأس والأذنين مرة واحدة.
   - غسل الرجلين مع الكعبين ثلاثاً.
2. الصلوات الخمس المفروضة:
   - الفجر: ركعتان (جهرية).
   - الظهر: 4 ركعات (سرية).
   - العصر: 4 ركعات (سرية).
   - المغرب: 3 ركعات (الأولى والثانية جهرية، والثالثة سرية).
   - العشاء: 4 ركعات (الأولى والثانية جهرية، والثالثة والرابعة سرية).
3. التيسير على المسلم الجديد: يتعلم الفاتحة تدريجياً، وإن عجز في البداية أجزأه التسبيح والتحميد والتكبير حتى يحفظ الفاتحة برفق ودون مشقة.`,
    conceptExplanationEn: `Salah is the pillar of faith and a daily direct conversation with Allah:
1. Steps of Wudu (Ablution):
   - Intention in heart, mention Allah (Bismillah).
   - Wash hands 3 times, rinse mouth and nose 3 times.
   - Wash face 3 times.
   - Wash arms including elbows 3 times.
   - Wipe head and ears once.
   - Wash feet up to ankles 3 times.
2. The Five Daily Obligatory Prayers:
   - Fajr (Dawn): 2 Rak'ahs
   - Dhuhr (Noon): 4 Rak'ahs
   - Asr (Afternoon): 4 Rak'ahs
   - Maghrib (Sunset): 3 Rak'ahs
   - Isha (Night): 4 Rak'ahs
3. Ease for new Muslims: You learn Surah Al-Fatihah step-by-step; meanwhile, praising Allah (SubhanAllah, Alhamdulillah, Allahu Akbar) suffices in your initial prayer until you memorize.`,
    keyTerms: [
      {
        ar: 'الطهور',
        en: 'Purification (Taharah)',
        approvedStandard: 'رفع الحدث وزوال الخبث بالماء الطاهر للصلاة'
      },
      {
        ar: 'الصلاة',
        en: 'Salah',
        approvedStandard: 'الصلة التعبدية المفتتحة بالتكبير والمختتمة بالتسليم'
      }
    ],
    sources: [
      APPROVED_SOURCES_REGISTRY.dorar_feqhia,
      APPROVED_SOURCES_REGISTRY.dorar_hadith,
      APPROVED_SOURCES_REGISTRY.dawa_center
    ],
    quiz: [
      {
        id: 'q1-nm4',
        question: 'كم عدد ركعات صلاة الفجر المفروضة؟',
        questionEn: 'How many Rak\'ahs is the obligatory Fajr prayer?',
        options: ['ركعة واحدة', 'ركعتان', 'ثلاث ركعات', 'أربع ركعات'],
        optionsEn: ['1 Rak\'ah', '2 Rak\'ahs', '3 Rak\'ahs', '4 Rak\'ahs'],
        correctIndex: 1,
        explanation: 'صلاة الفجر ركعتان مفروضتان بإجماع المسلمين.',
        source: APPROVED_SOURCES_REGISTRY.dorar_feqhia
      }
    ],
    reflectionPrompt: 'الصلاة محطة سلام يومية تقتطع فيها خمس دقائق لتخلو بربك الرحيم وتسأله من فضله.',
    reflectionPromptEn: 'Salah is an oasis of calm, pausing worldly rush five times daily to converse directly with your Merciful Lord.'
  },

  {
    id: 'nm-05',
    trackId: 'new_muslim',
    stageNumber: 5,
    title: 'القرآن الكريم وأعظم سورة: الفاتحة (أم الكتاب)',
    titleEn: 'The Holy Quran & Surah Al-Fatihah (The Mother of the Book)',
    subtitle: 'نص مجمع الملك فهد لطباعة المصحف الشريف بالرسم العثماني المعتمد 100% مع التلاوة المرتلة وتفسير المعاني',
    subtitleEn: 'Authentic 100% King Fahd Complex text with verified audio recitation and verse-by-verse Tafseer',
    estimatedMinutes: 20,
    contentLevel: 'A',
    scriptures: [
      {
        type: 'quran',
        arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is [due] to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful, Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path, The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
        reference: 'سورة الفاتحة: الآيات 1-7',
        referenceEn: 'Surah Al-Fatihah (1:1-7)',
        source: APPROVED_SOURCES_REGISTRY.quran_mushaf
      },
      {
        type: 'hadith',
        arabicText: 'قَالَ رَسُولُ اللَّهِ ﷺ: «لاَ صَلاَةَ لِمَنْ لَمْ يَقْرَأْ بِفَاتِحَةِ الكِتَابِ»',
        translationEn: 'The Messenger of Allah ﷺ said: "There is no prayer for the one who does not recite the Opening of the Book (Surah Al-Fatihah)."',
        reference: 'صحيح البخاري: رقم 756، صحيح مسلم: رقم 394',
        referenceEn: 'Sahih Al-Bukhari 756, Sahih Muslim 394',
        grade: 'حديث صحيح متفق عليه',
        source: APPROVED_SOURCES_REGISTRY.dorar_hadith
      }
    ],
    conceptExplanation: `القرآن الكريم هو كلام الله تعالى المعجز، المنزل على نبيه محمد ﷺ بلسان عربي مبين، المنقول بالتواتر، المتعبد بتلاوته:
1. منزلة سورة الفاتحة (أم القرآن والسبع المثاني):
   - هي أعظم سورة في كتاب الله بإجماع المسلمين.
   - ركن من أركان الصلاة لا تصح الصلاة بدونها.
   - تشتمل على مجمل معاني القرآن كله: الثناء على الله، وإثبات صفات الرحمة، والإقرار بيوم الحساب، وإخلاص العبادة والاستعانة، وسؤال الهداية للصراط المستقيم.
2. التلاوة الصحيحة والاستماع المعتمد:
   - استمع لتلاوة الشيخ علي الحذيفي (مقرئ مجمع الملك فهد) أو الشيخ محمود خليل الحصري المتاحة في المشغل الصوتي لضبط مخارج الحروف.
   - التدرج والتيسير: إن لم تحفظها كاملة في أول إسلامك، اقرأ ما تيسر منها وكرر ذكر الله حتى يسهل عليك حفظها برفق وطمأنينة.`,
    conceptExplanationEn: `The Holy Quran is the literal divine word of Allah revealed to Prophet Muhammad ﷺ:
1. Status of Surah Al-Fatihah (The Opening):
   - It is the greatest Surah in the Quran and an essential pillar of prayer.
   - It encompasses all foundational truths: Praise of Allah, His infinite mercy, sovereignty on Judgment Day, pure worship, and praying for guidance along the Straight Path.
2. Authentic Recitation from King Fahd Complex:
   - Listen to the verified audio recitation by Sheikh Ali Al-Hudhaify or Sheikh Al-Husary above to practice correct pronunciation.
   - Gradual learning: If you are beginning your journey, practice verse by verse with patience; Allah rewards every sincere effort.`,
    keyTerms: [
      {
        ar: 'القرآن الكريم',
        en: 'The Holy Quran',
        approvedStandard: 'كلام الله المنزل بالرسم العثماني المعتمد من مجمع الملك فهد (قاموس التحدي ص 3)'
      },
      {
        ar: 'الفاتحة',
        en: 'Al-Fatihah',
        approvedStandard: 'فاتحة الكتاب وأم القرآن المشتملة على أصول التوحيد والدعاء'
      }
    ],
    sources: [
      APPROVED_SOURCES_REGISTRY.quran_mushaf,
      APPROVED_SOURCES_REGISTRY.dorar_tafseer,
      APPROVED_SOURCES_REGISTRY.dorar_hadith,
      APPROVED_SOURCES_REGISTRY.dawa_center
    ],
    quiz: [
      {
        id: 'q1-nm5',
        question: 'ما حكم قراءة سورة الفاتحة في الصلاة لمن قدر عليها؟',
        questionEn: 'What is the ruling on reciting Surah Al-Fatihah in obligatory prayer for one who is able?',
        options: [
          'ركن أساسي لا تصح الصلاة بدونه للمستطيع',
          'مستحب فقط ولا يؤثر تركه',
          'تقرأ في صلاة الجمعة فقط',
          'اختيارية بحسب رغبة المصلي'
        ],
        optionsEn: [
          'An essential pillar without which prayer is invalid for one who can recite it',
          'Only recommended and does not affect validity',
          'Recited only in Friday prayer',
          'Optional based on preference'
        ],
        correctIndex: 0,
        explanation: 'لقوله ﷺ في الصحيحين: «لا صلاة لمن لم يقرأ بفاتحة الكتاب».',
        source: APPROVED_SOURCES_REGISTRY.dorar_hadith
      }
    ],
    reflectionPrompt: 'الفاتحة مناجاة خاصة بينك وبين الله، حيث يُجيبك الله تعالى في كل آية تقرؤها كما ثبت في الحديث القدسي.',
    reflectionPromptEn: 'Reciting Al-Fatihah is an intimate dialogue: Allah responds directly to you with every single verse you utter.'
  },
  {
    id: 'nm-06',
    trackId: 'new_muslim',
    stageNumber: 6,
    title: 'الأخلاق الإسلامية والحياة اليومية للمهتدي',
    titleEn: 'Islamic Character, Compassion, and Daily Living',
    subtitle: 'إنما بُعثت لأتمم صالح الأخلاق: كيف يعيش المسلم الجديد دينه برحمة وبر بأهله ومجتمعه',
    subtitleEn: 'Living your faith with wisdom, kindness to parents, and exemplary moral character',
    estimatedMinutes: 15,
    contentLevel: 'A',
    scriptures: [
      {
        type: 'hadith',
        arabicText: 'قَالَ رَسُولُ اللَّهِ ﷺ: «إِنَّمَا بُعِثْتُ لِأُتَمِّمَ صَالِحَ الأَخْلاَقِ»',
        translationEn: 'The Messenger of Allah ﷺ said: "I was only sent to perfect good character."',
        reference: 'مسند أحمد: رقم 8952، وموطأ مالك',
        referenceEn: 'Musnad Ahmad 8952, Muwatta Malik',
        grade: 'حديث صحيح صححه الألباني والأرناؤوط في الدرر السنية',
        source: APPROVED_SOURCES_REGISTRY.dorar_hadith
      },
      {
        type: 'quran',
        arabicText: 'وَوَصَّيْنَا الْإِنسَانَ بِوَالِدَيْهِ حُسْنًا',
        translationEn: 'And We have enjoined upon man goodness to parents.',
        reference: 'سورة العنكبوت: الآية 8',
        referenceEn: 'Surah Al-Ankabut (29:8)',
        source: APPROVED_SOURCES_REGISTRY.quran_mushaf
      }
    ],
    conceptExplanation: `الإسلام ليس طقوساً مجردة، بل هو سلوك حي ومعاملة حسنة تزين حياة الإنسان:
1. بر الوالدين وحسن صلتهما:
   - الإسلام يوصي بأعظم درجات الإحسان للوالدين وإن كانا على غير الإسلام.
   - إظهار التغير الإيجابي في حياتك: بر، حنان، بر بالأسرة، ونزاهة في القول والعمل.
2. التدرج والتيسير في العادات:
   - الشريعة مبنية على التيسير والرفق: (إِنَّ الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلاَّ غَلَبَهُ).
   - لا تثقل على نفسك في البداية؛ ركز على الأصول العظيمة (التوحيد، الصلوات المفروضة، الأخلاق الصادقة)، ودع الفروع تنمو برفق.
3. التفاعل مع الأصحاب والمجتمع:
   - كن سفيراً مشرقاً للقيم الإسلامية بالصدق، الأمانة، كف الأذى، والابتسامة في وجه الآخرين.`,
    conceptExplanationEn: `Islam is not abstract rites; it is a holistic ethic of mercy and upright character:
1. Devotion to Parents & Family:
   - Islam commands the utmost kindness and respect toward parents, even if they adhere to another faith.
   - Let your family witness the positive transformation in your gentleness, patience, and love.
2. The Principle of Ease (Yusr):
   - The Prophet ﷺ said: "Indeed, this religion is easy, and whoever overburdens themselves will be overcome by it."
   - Focus solidly on foundational pillars first (Tawhid, regular prayer, truthfulness) and embrace knowledge steadily.
3. Engaging Society with Grace:
   - Exhibit truthfulness, honesty, charity, and a pleasant demeanor to all human beings around you.`,
    keyTerms: [
      {
        ar: 'الخلق الحسن',
        en: 'Good Character (Akhlaq)',
        approvedStandard: 'بذل الندى وكف الأذى وطلاقة الوجه وصدق اللسان'
      },
      {
        ar: 'بر الوالدين',
        en: 'Filial Piety (Birr al-Walidayn)',
        approvedStandard: 'الإحسان إلى الأبوين بالقول والفعل وخفض جناح الرحمة لهما'
      }
    ],
    sources: [
      APPROVED_SOURCES_REGISTRY.dorar_hadith,
      APPROVED_SOURCES_REGISTRY.dorar_history,
      APPROVED_SOURCES_REGISTRY.dawa_center
    ],
    quiz: [
      {
        id: 'q1-nm6',
        question: 'ما هو موقف المسلم الجديد من والديه غير المسلمين؟',
        questionEn: 'What is the required conduct of a new Muslim toward non-Muslim parents?',
        options: [
          'الإحسان والبر التام وحسن معاملتهما بالمعروف',
          'مقاطعتهما وهجرهما فوراً',
          'معاملتهما بغلظة وشِدة',
          'التجاهل التام لمشاعرهما'
        ],
        optionsEn: [
          'Utmost kindness, love, and respectful conduct in all honorable matters',
          'Immediate severance and abandonment',
          'Harsh and argumentative treatment',
          'Complete neglect of their feelings'
        ],
        correctIndex: 0,
        explanation: 'أمر الله تعالى بالإحسان للوالدين وصحبتهما في الدنيا معروفاً حتى وإن كانا غير مسلمين.',
        source: APPROVED_SOURCES_REGISTRY.dawa_center
      }
    ],
    reflectionPrompt: 'أعظم دعوة تقدمها لمن حولك هي أن يروا حُسن خُلقك ورحمتك بعد اعتناقك للإسلام.',
    reflectionPromptEn: 'The most inspiring invitation you can offer to others is the beauty of your character, humility, and compassion.'
  },

  // ==========================================
  // مسار غير المسلم (NON-MUSLIM TRACK)
  // ==========================================
  {
    id: 'nml-01',
    trackId: 'non_muslim',
    stageNumber: 1,
    title: 'ما هو الإسلام؟ وما جوهره؟',
    titleEn: 'What is Islam? Understanding its Core Essence',
    subtitle: 'بيئة هادئة ومحترمة للتعرف على حقيقة الدين دون أحكام مسبقة أو اختزال',
    subtitleEn: 'A respectful, safe space to discover the authentic essence of Islam without prejudice',
    estimatedMinutes: 12,
    contentLevel: 'A',
    scriptures: [
      {
        type: 'quran',
        arabicText: 'إِنَّ الدِّينَ عِندَ اللَّهِ الْإِسْلَامُ',
        translationEn: 'Indeed, the religion in the sight of Allah is Islam.',
        reference: 'سورة آل عمران: الآية 19',
        referenceEn: 'Surah Ali \'Imran (3:19)',
        source: APPROVED_SOURCES_REGISTRY.quran_mushaf
      },
      {
        type: 'quran',
        arabicText: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ',
        translationEn: 'And We have not sent you, [O Muhammad], except as a mercy to the worlds.',
        reference: 'سورة الأنبياء: الآية 107',
        referenceEn: 'Surah Al-Anbiya (21:107)',
        source: APPROVED_SOURCES_REGISTRY.quran_mushaf
      }
    ],
    conceptExplanation: `الإسلام ليس ديناً جديداً ظهر في القرن السابع الميلادي، بل هو الدعوة التوحيدية الخالدة التي بُعث بها كافة الأنبياء والرسل (نوح، إبراهيم، موسى، عيسى، وختامهم محمد عليهم صلوات الله وسلامه).
كلمة «إسلام» في اللغة العربية مشتقة من الاستسلام والسلام:
1. الاستسلام لخالق السماوات والأرض محبةً وتعظيماً.
2. تحقيق السلام الداخلي للنفس بالاتصال بمصدر الوجود.
3. إشاعة السلام والعدل في المجتمع البشري.
لا يوجد في الإسلام مفهوم الخطيئة الموروثة؛ فكل إنسان يولد على الفطرة النقية، ومسؤول عن عمله واختياره أمـام الله العادل الرحيم.`,
    conceptExplanationEn: `Islam is not an ethnic religion or a novel belief founded in the 7th century; it is the universal call of pure monotheism preached by all prophets throughout human history (Noah, Abraham, Moses, Jesus, and finalized by Muhammad, peace be upon them all).
The root of the word Islam connects to both "submission to God" and "peace":
1. Loving submission to the Creator of the universe.
2. Inner serenity gained by reconnecting with the source of existence.
3. Cultivating mercy, justice, and dignity within human societies.
In Islam, there is no concept of original inherited sin; every soul is born in purity (Fitrah) and is accountable solely for its own choices before the Merciful Creator.`,
    keyTerms: [
      {
        ar: 'الإسلام',
        en: 'Islam',
        approvedStandard: 'دين الاستسلام لله بالتوحيد والانقياد له بالطاعة (قاموس التحدي ص 8)'
      },
      {
        ar: 'الفطرة',
        en: 'Fitrah (Innate Nature)',
        approvedStandard: 'الاستعداد الروحي الفطري المركوز في كل إنسان للإيمان بالخالق الواحد'
      }
    ],
    sources: [
      APPROVED_SOURCES_REGISTRY.quran_mushaf,
      APPROVED_SOURCES_REGISTRY.dawa_center,
      APPROVED_SOURCES_REGISTRY.dawa_shubuhat
    ],
    quiz: [
      {
        id: 'q1-nml1',
        question: 'ما هي النظرة الإسلامية للمولود وحالة فطرته؟',
        questionEn: 'What is the Islamic view regarding every newborn child?',
        options: [
          'يولد حاملاً خطيئة متوارثة من أسلافه',
          'يولد على الفطرة النقية الخالية من الذنوب ومسؤول عن عمله',
          'يولد محكوماً عليه دون حرية اختيار',
          'لا قيمة لحياته حتى يخضع لطقس تعميد'
        ],
        optionsEn: [
          'Born inheriting original sin from ancestors',
          'Born on pure innate nature (Fitrah), free of sin and accountable for own deeds',
          'Born predestined without free will',
          'Has no spiritual standing until baptized'
        ],
        correctIndex: 1,
        explanation: 'في الإسلام: كل إنسان يولد نقياً على الفطرة، ولا تزر وازرة وزر أخرى كما في القرآن الكريم.',
        source: APPROVED_SOURCES_REGISTRY.dawa_shubuhat
      }
    ],
    reflectionPrompt: 'الإسلام يخاطب عقلك وضميرك قبل أي شيء، ويحث على التفكر والتأمل في الكون.',
    reflectionPromptEn: 'Islam addresses your intellect and conscience first, urging contemplation upon the creation of the heavens and earth.'
  },
  {
    id: 'nml-02',
    trackId: 'non_muslim',
    stageNumber: 2,
    title: 'من هو الله؟ ولماذا خلقنا؟',
    titleEn: 'Who is God? And Why Were We Created?',
    subtitle: 'صفات الخالق المتعالي، وحكمة الوجود والغاية من رحلة الحياة الدنيا',
    subtitleEn: 'The attributes of the Transcendent Creator and the purpose of human existence',
    estimatedMinutes: 14,
    contentLevel: 'A',
    scriptures: [
      {
        type: 'quran',
        arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
        translationEn: 'Allah - there is no deity worthy of worship except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.',
        reference: 'سورة البقرة: آية الكرسي (255)',
        referenceEn: 'Surah Al-Baqarah (2:255)',
        source: APPROVED_SOURCES_REGISTRY.quran_mushaf
      },
      {
        type: 'quran',
        arabicText: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ',
        translationEn: 'And I did not create the jinn and mankind except to worship Me.',
        reference: 'سورة الذاريات: الآية 56',
        referenceEn: 'Surah Adh-Dhariyat (51:56)',
        source: APPROVED_SOURCES_REGISTRY.quran_mushaf
      }
    ],
    conceptExplanation: `الله في الإسلام هو الاسم الأعظم للخالق الأحد الذي لا شريك له، وهو نفس الإله الذي عبده إبراهيم وإسماعيل وإسحاق ويعقوب وموسى وعيسى.
ليس كمثله شيء؛ لا يتجسد في صورة بشر، ولا يلد ولا يولد، ولا تعتريه نقائص المخلوقين من عجز أو نعاس أو ندم.
أما غاية الوجود:
1. الحياة الدنيا دار اختبار وتكليف وليست دار خلود عبثية (الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا).
2. العبادة بمعناها الواسع: معرفة الله، وامتثال أوامره، وتعمير الأرض بالخير والعدل والرحمة.`,
    conceptExplanationEn: `In Islam, Allah is the supreme name of the One Creator who has no partners or equals. He is the God of Abraham, Moses, Jesus, and all righteous messengers.
He does not incarnate into human forms, does not beget nor is begotten, and is exalted above human weaknesses such as sleep, fatigue, or regret.
Purpose of life:
1. Earth is a purposeful realm of moral examination and growth, not a random meaningless accident.
2. Worship in Islam encompasses knowing the Creator, acting justly, and flourishing the earth with kindness.`,
    keyTerms: [
      {
        ar: 'الغاية من الخلق',
        en: 'Purpose of Creation',
        approvedStandard: 'معرفة الله وعبادته باختيار العبد وتعمير الأرض بالخير'
      },
      {
        ar: 'التوحيد',
        en: 'Oneness of God',
        approvedStandard: 'نفي التعدد والشريك والمثيل عن الخالق المتعالي'
      }
    ],
    sources: [
      APPROVED_SOURCES_REGISTRY.quran_mushaf,
      APPROVED_SOURCES_REGISTRY.dorar_aqeeda,
      APPROVED_SOURCES_REGISTRY.dawa_shubuhat
    ],
    quiz: [
      {
        id: 'q1-nml2',
        question: 'ما هي الغاية العظمى التي بينها القرآن الكريم لخلق الإنسان؟',
        questionEn: 'According to the Quran, what is the supreme purpose of creating human beings?',
        options: [
          'العيش دون التزام أو غاية',
          'معرفة الخالق وعبادته بالاختيار وتعمير الأرض بالصلاح',
          'مجرد التكاثر والاندثار',
          'البحث عن صراعات لا تنتهي'
        ],
        optionsEn: [
          'Living without moral purpose or accountability',
          'Knowing and voluntarily worshiping the Creator while cultivating the earth with goodness',
          'Mere reproduction and extinction',
          'Engaging in perpetual worldly conflicts'
        ],
        correctIndex: 1,
        explanation: 'بينت الآية الكريمة: ﴿وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ﴾ أن العبادة بمعناها الشامل هي الغاية العظمى.',
        source: APPROVED_SOURCES_REGISTRY.dorar_aqeeda
      }
    ],
    reflectionPrompt: 'حين تدرك أن لحياتك غاية سامية، تصبح كل ابتسامة ومساعدة وعمل خير عبادة تقربك إلى الله.',
    reflectionPromptEn: 'When you recognize that your life holds a sublime purpose, every act of benevolence and kindness becomes an act of devotion.'
  },
  {
    id: 'nml-03',
    trackId: 'non_muslim',
    stageNumber: 3,
    title: 'تفنيد أشهر الشبهات والأسئلة الشائعة',
    titleEn: 'Clarifying Common Misconceptions & Frequent Inquiries',
    subtitle: 'ردود علمية موثقة حول: الكعبة، انتشار الإسلام، التعدد، ومفهوم الشر والألم',
    subtitleEn: 'Documented scholarly clarifications: The Kaaba, spread of Islam, pluralism, and suffering',
    estimatedMinutes: 20,
    contentLevel: 'B',
    scriptures: [
      {
        type: 'quran',
        arabicText: 'لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ',
        translationEn: 'There shall be no compulsion in religion. The right course has become distinct from the wrong.',
        reference: 'سورة البقرة: الآية 256',
        referenceEn: 'Surah Al-Baqarah (2:256)',
        source: APPROVED_SOURCES_REGISTRY.quran_mushaf
      },
      {
        type: 'quran',
        arabicText: 'وَإِذَا حَكَمْتُم بَيْنَ النَّاسِ أَن تَحْكُمُوا بِالْعَدْلِ',
        translationEn: 'And when you judge between people to judge with justice.',
        reference: 'سورة النساء: الآية 58',
        referenceEn: 'Surah An-Nisa (4:58)',
        source: APPROVED_SOURCES_REGISTRY.quran_mushaf
      }
    ],
    conceptExplanation: `منهج المستودع الدعوي وحزمة التحدي في التعامل مع التساؤلات الفكرية:
1. هل يعبد المسلمون الكعبة؟
   - قطعا لا؛ الكعبة حجر لا يضر ولا ينفع، والمسلمون يعبدون رب الكعبة وحده. الكعبة هي «قبلة» توجيهية لتوحيد صفوف المسلمين في صلاتهم، وكان الصحابي عمر بن الخطاب يقول للحجر الأسود: «إني أعلم أنك حجر لا تضر ولا تنفع، ولولا أني رأيت رسول الله ﷺ يقبلك ما قبلتك».
2. هل انتشر الإسلام بحد السيف؟
   - تاريخياً وقرآنياً: عقيدة الإيمان مستقرها القلب ولا يدخل الإيمان بالإكراه بنص الآية ﴿لَا إِكْرَاهَ فِي الدِّينِ﴾. أكبر بلاد المسلمين اليوم سكاناً (كإندونيسيا وماليزيا وغرب إفريقيا) دخلها الإسلام عبر أخلاق التجار والدعاة الصادقين لا عبر الجيوش.
3. لماذا يوجد الألم والشر في العالم؟
   - الدنيا ليست الجنة؛ بل هي دار ابتلاء واختبار. الشر النسبي ينتج إما عن سوء استخدام البشر لإرادتهم الحرة، أو لحكم بالغة يظهر من خلالها الصبر والتعاطف والتكافل، والعدل التام والجزاء الأوفى مستقره الدار الآخرة.`,
    conceptExplanationEn: `Documented scholarly clarification of prominent questions based on official Dawa repository (File 7937):
1. Do Muslims worship the Kaaba?
   - Absolutely not. The Kaaba is a physical cubical structure serving solely as a unified directional point (Qibla) for global prayer. Umar ibn Al-Khattab famously reminded: "I know you are merely a stone that can neither benefit nor harm." Worship is for Allah alone.
2. Was Islam spread by the sword?
   - Faith resides in conviction and cannot be coerced: "There is no compulsion in religion" (2:256). The largest Muslim populated nations today (such as Indonesia and Malaysia) embraced Islam through peaceful trade and ethical behavior, with no military conquests.
3. Why does suffering exist?
   - This temporal world is designed as an arena of moral trial and spiritual growth, not ultimate paradise. Much suffering arises from human choices, while hardships bring forth virtues like empathy, patience, and altruism, with ultimate justice restored in the Hereafter.`,
    keyTerms: [
      {
        ar: 'القبلة',
        en: 'The Qibla',
        approvedStandard: 'جهة الكعبة المشرفة لتوحيد وجهة صلاة المسلمين حول العالم'
      },
      {
        ar: 'الحكمة من الابتلاء',
        en: 'Wisdom of Trials',
        approvedStandard: 'كون الدنيا دار اختبار وتزكية للمؤمن وإظهار لمعاني الصبر والتراحم'
      }
    ],
    sources: [
      APPROVED_SOURCES_REGISTRY.dawa_shubuhat,
      APPROVED_SOURCES_REGISTRY.quran_mushaf,
      APPROVED_SOURCES_REGISTRY.dorar_history
    ],
    quiz: [
      {
        id: 'q1-nml3',
        question: 'ما هو الدور الحقيقي للكعبة المشرفة في عبادة المسلمين؟',
        questionEn: 'What is the true significance of the Holy Kaaba in Islamic prayer?',
        options: [
          'أنها تمثال أو صنم يُعبد لذاته',
          'أنها قبلة موحدة يتجه المسلمون نحوها لعبادة الله وحده',
          'أنها تحتوي على تمائم سحرية',
          'أن العبادة تنتهي إليها ولا تتعداها'
        ],
        optionsEn: [
          'It is an idol worshiped for itself',
          'It is a unified direction (Qibla) toward which all Muslims face to worship Allah alone',
          'It holds magical amulets',
          'Worship ends at its walls'
        ],
        correctIndex: 1,
        explanation: 'الكعبة ليست معبوداً، بل قبلة توجيهية لتوحيد الصفوف؛ والعبادة الخالصة لله وحده رب البيت.',
        source: APPROVED_SOURCES_REGISTRY.dawa_shubuhat
      }
    ],
    reflectionPrompt: 'الحوار المبني على الأدلة العلمية والمصادر الموثقة يجلو الشبهات ويكشف محاسن الإسلام.',
    reflectionPromptEn: 'Dialogue rooted in verified evidence and authentic sources dispels misconceptions and illuminates truth.'
  },

  // ==========================================
  // مسار المسلم (MUSLIM DEEPENING TRACK)
  // ==========================================
  {
    id: 'm-01',
    trackId: 'muslim',
    stageNumber: 1,
    title: 'تحرير التوحيد وأركان الإيمان الكبرى',
    titleEn: 'Refining Tawhid & The Core Tenets of Faith',
    subtitle: 'ترسيخ اليقين القلبي، وتجريد الإخلاص، وتدبر أسماء الله الحسنى في الحياة',
    subtitleEn: 'Anchoring internal certainty, purifying sincerity, and living with Allah\'s Beautiful Names',
    estimatedMinutes: 16,
    contentLevel: 'A',
    scriptures: [
      {
        type: 'quran',
        arabicText: 'وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا',
        translationEn: 'And to Allah belong the best names, so invoke Him by them.',
        reference: 'سورة الأعراف: الآية 180',
        referenceEn: 'Surah Al-A\'raf (7:180)',
        source: APPROVED_SOURCES_REGISTRY.quran_mushaf
      },
      {
        type: 'hadith',
        arabicText: 'قَالَ النَّبِيُّ ﷺ: «إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا، مِائَةً إِلاَّ وَاحِدًا، مَنْ أَحْصَاهَا دَخَلَ الجَنَّةَ»',
        translationEn: 'The Prophet ﷺ said: "Allah has ninety-nine names, one-hundred less one; whoever enumerates and lives by them will enter Paradise."',
        reference: 'صحيح البخاري: رقم 2736، صحيح مسلم: رقم 2677',
        referenceEn: 'Sahih Al-Bukhari 2736, Sahih Muslim 2677',
        grade: 'متفق عليه',
        source: APPROVED_SOURCES_REGISTRY.dorar_hadith
      }
    ],
    conceptExplanation: `ليس التوحيد مجرد حفظ لقواعد نظرية، بل هو حياة القلب وسكينته:
1. إحصاء أسماء الله الحسنى يتضمن: حفظ ألفاظها، وفهم معانيها، والتعبد لله بمقتضاها (فإذا علمت أنه "السميع البصير" استحييت من معصيته، وإذا علمت أنه "الرزاق" لم تسأل رزقك بالحرام).
2. تحقيق الإخلاص ومقاومة الرياء الخفي والشرك الأصغر.
3. التوكل الحق الذي يجمع بين صدق الاعتماد القلبي على مسبب الأسباب، مع الأخذ بالأسباب الدنيوية المشروعة بكامل الهمة.`,
    conceptExplanationEn: `Tawhid is not merely abstract theory; it is the spiritual breath of the heart:
1. Living with Allah's Names: memorizing them, internalizing their meanings, and manifesting their reality (knowing He is the All-Seeing prevents wrongdoing; knowing He is the Provider prevents unlawful greed).
2. Cultivating sincere devotion (Ikhlas) while purifying intentions from subtle show-off.
3. Genuine Tawakkul (reliance on God), which balances absolute spiritual trust in Allah with diligent pursuit of permissible worldly means.`,
    keyTerms: [
      {
        ar: 'الإحصاء',
        en: 'Ihsan al-Asma',
        approvedStandard: 'العلم بها وفهم معانيها والعمل بمقتضاها والتعبد لله بها'
      },
      {
        ar: 'التوكل',
        en: 'Tawakkul',
        approvedStandard: 'صدق اعتماد القلب على الله مع تعاطي الأسباب المشروعة'
      }
    ],
    sources: [
      APPROVED_SOURCES_REGISTRY.dorar_aqeeda,
      APPROVED_SOURCES_REGISTRY.dorar_hadith,
      APPROVED_SOURCES_REGISTRY.quran_mushaf
    ],
    quiz: [
      {
        id: 'q1-m1',
        question: 'ما هو المفهوم الشرعي الصحيح لـ "التوكل على الله"؟',
        questionEn: 'What is the authentic Islamic definition of Tawakkul (reliance upon Allah)?',
        options: [
          'ترك العمل والقعود في البيت انتظاراً للرزق',
          'صدق اعتماد القلب على الله مع بذل الأسباب المشروعة بنشاط',
          'الاعتماد على السبب وحده ونسيان مسبب الأسباب',
          'التواكل والتهاون في التخطيط'
        ],
        optionsEn: [
          'Abandoning effort and waiting idle at home',
          'Genuine heart reliance upon Allah while vigorously taking lawful means',
          'Relying solely on material causes without the Creator',
          'Passive neglect of planning'
        ],
        correctIndex: 1,
        explanation: 'قال النبي ﷺ للأعرابي: «اعقلها وتوكل»، فجمع بين الأخذ بالسبب والتوكل على الله.',
        source: APPROVED_SOURCES_REGISTRY.dorar_hadith
      }
    ],
    reflectionPrompt: 'التوحيد يحررك من الخوف من المخلوقين؛ فالنافع والضار والمعطي والمانع هو الله وحده.',
    reflectionPromptEn: 'True Tawhid liberates your heart from fear of mortals, knowing benefit and harm lie solely in Allah\'s hands.'
  },

  // ==========================================
  // مسار الداعية (DA'IYAH & SIMULATION TRACK)
  // ==========================================
  {
    id: 'd-01',
    trackId: 'daiyah',
    stageNumber: 1,
    title: 'أصول الدعوة وقواعد الحوار الحضاري',
    titleEn: 'Foundations of Da\'wah & Civilized Dialogue',
    subtitle: 'الحكمة، والموعظة الحسنة، والجدال بالتي هي أحسن، وضوابط المعايير العلمية',
    subtitleEn: 'Wisdom, compassionate admonition, and debating in the best manner with verified evidence',
    estimatedMinutes: 18,
    contentLevel: 'B',
    scriptures: [
      {
        type: 'quran',
        arabicText: 'ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ ۖ وَجَادِلْهُم بِالَّتِي هِيَ أَحْسَنُ',
        translationEn: 'Invite to the way of your Lord with wisdom and good instruction, and argue with them in a way that is best.',
        reference: 'سورة النحل: الآية 125',
        referenceEn: 'Surah An-Nahl (16:125)',
        source: APPROVED_SOURCES_REGISTRY.quran_mushaf
      },
      {
        type: 'hadith',
        arabicText: 'قَالَ رَسُولُ اللَّهِ ﷺ لِعَلِيٍّ رَضِيَ اللَّهُ عَنْهُ: «فَوَاللَّهِ لأَنْ يَهْدِيَ اللَّهُ بِكَ رَجُلاً وَاحِدًا خَيْرٌ لَكَ مِنْ أَنْ يَكُونَ لَكَ حُمْرُ النَّعَمِ»',
        translationEn: 'The Prophet ﷺ said to Ali: "By Allah, that Allah should guide a single person through you is better for you than possessing red camels [the most prized wealth]."',
        reference: 'صحيح البخاري: رقم 3701، صحيح مسلم: رقم 2406',
        referenceEn: 'Sahih Al-Bukhari 3701, Sahih Muslim 2406',
        grade: 'حديث متفق عليه',
        source: APPROVED_SOURCES_REGISTRY.dorar_hadith
      }
    ],
    conceptExplanation: `الداعية سفير الرحمة والهدى؛ وضوابط الدعوة المعتمدة في وثيقة التحدي:
1. مراعاة حال المخاطب وتوطين الخطاب:
   - التحدث باللغة المفهومة والأسلوب اللطيف دون تعقيد أو تقعير.
   - احترام مشاعر المخاطب وكرامته الإنسانية، وتجنب السخرية أو الاستفزاز.
2. التدرج المعرفي الحكيم:
   - تقديم الأصول الكبرى (التوحيد، الرحمة، العدل) قبل الفروع التفصيلية.
3. التوثيق والأمانة العلمية:
   - التزام المصادر المعتمدة ونفي الأحاديث الضعيفة والموضوعة.
   - إذا سُئلت عما لا تعلم: قل "لا أعلم" وابحث في المصادر، ولا تتكلف الفتوى أو الإلزام برأي شخصي.`,
    conceptExplanationEn: `The Da'iyah is an ambassador of mercy and divine guidance. Principles endorsed by the Challenge guide:
1. Audience awareness and context localization:
   - Communicating in clear language and a respectful, courteous tone without condescension.
   - Upholding human dignity, strictly avoiding ridicule or aggressive defensiveness.
2. Pedagogical progression:
   - Prioritizing foundational truths (Tawhid, justice, mercy) before subordinate secondary rules.
3. Scholarly integrity and verification:
   - Relying solely on authentic references and rejecting unverified narratives.
   - Saying "I do not know" when a question exceeds your verification, referring complex personal questions to qualified scholars.`,
    keyTerms: [
      {
        ar: 'الحكمة',
        en: 'Hikmah (Wisdom)',
        approvedStandard: 'وضع الشيء في موضعه ومخاطبة الناس على قدر عقولهم وحاجتهم'
      },
      {
        ar: 'المجادلة بالتي هي أحسن',
        en: 'Best Manner Debate',
        approvedStandard: 'مقارعة الحجة بالحجة بأدب جم ولين جانب وقصد إظهار الحق'
      }
    ],
    sources: [
      APPROVED_SOURCES_REGISTRY.dawa_center,
      APPROVED_SOURCES_REGISTRY.quran_mushaf,
      APPROVED_SOURCES_REGISTRY.dorar_hadith
    ],
    quiz: [
      {
        id: 'q1-d1',
        question: 'ما هو التوجيه النبوي الأول عند دعوة الناس إلى الإسلام كما في وصية النبي ﷺ لمعاذ بن جبل؟',
        questionEn: 'What was the first instruction given by the Prophet ﷺ to Mu\'adh ibn Jabal when sending him to invite people?',
        options: [
          'أن يبدأ ببيان تفاصيل الأحكام الفقهية الدقيقة',
          'أن يكون أول ما يدعوهم إليه هو شهادة أن لا إله إلا الله وتوحيده',
          'أن يجادلهم في أنسابهم وتاريخهم',
          'أن يفرض عليهم التبرع بالمال قبل الإيمان'
        ],
        optionsEn: [
          'Begin with intricate legal details',
          'First and foremost call them to testify that none is worthy of worship except Allah (Tawhid)',
          'Argue with them regarding genealogy',
          'Demand financial contributions before faith'
        ],
        correctIndex: 1,
        explanation: 'قال النبي ﷺ لمعاذ: «فليكن أول ما تدعوهم إليه إلى أن يوحدوا الله تعالى»، فالتوحيد أصل كل عمل.',
        source: APPROVED_SOURCES_REGISTRY.dorar_hadith
      }
    ],
    reflectionPrompt: 'الداعية الحكيم يحرص على إيصال نور الحق بقلب رحيم دون انتصار للنفس أو تعنيف للسائل.',
    reflectionPromptEn: 'A wise caller conveys divine light with a compassionate heart, seeking to guide rather than to win an argument.'
  }
];

export const SIMULATION_SCENARIOS: SimulatorScenario[] = [
  {
    id: 'sim-01',
    title: 'تساؤل حول حكمة وجود الشر والألم',
    titleEn: 'Inquiry on Suffering and the Problem of Evil',
    inquirerPersona: {
      name: 'توماس (طالب فلسفة باحث عن الحقيقة)',
      background: 'شاب غربي نشأ في بيئة مادية لا دينية، لديه حيرة أخلاقية حقيقية حول الكوارث والأمراض',
      tone: 'curious'
    },
    initialMessage: 'مرحباً، أنا أبحث باهتمام في الإسلام.. ولكن بصراحة يراودني سؤال لطالما حيّرني: إذا كان الله قادراً على كل شيء ورحيماً إلى هذه الدرجة، فلماذا نرى كل هذا الألم والحروب والأطفال المرضى في العالم؟ كيف يجيب الإسلام عن هذه المعضلة؟',
    initialMessageEn: 'Hello, I have been reading about Islam with genuine interest. However, a deep dilemma bothers me: If God is All-Powerful and All-Merciful, why do we witness so much suffering, disasters, and innocent children in pain? How does Islam reconcile this?',
    context: 'اختبار مهارة الداعية في: الاستماع بتعاطف، عدم التشنج، بيان حكمة الاختبار الدنيوي، التفريق بين الدنيا والجنة، وإظهار دور إرادة الإنسان الحرة.',
    idealApproachNotes: '1. شكر السائل على طرح تساؤل إنساني مشروع والتعاطف مع مشاعره.\n2. التوضيح بأن الدنيا دار اختبار وليست دار نعيم مطلق.\n3. بيان أن كثيراً من الشرور ناتجة عن ظلم الإنسان وإرادته الحرة.\n4. الألم فرصة لإبراز فضائل الصبر والتراحم ومساعدة الآخرين.\n5. التأكيد على العدل التام والجزاء الأخروي الذي يمحو كل ألم.\n6. الاستدلال بآيات معتمدة من سورة الملك (الآية 2) والبقرة (الآية 155).',
    sources: [
      APPROVED_SOURCES_REGISTRY.dawa_shubuhat,
      APPROVED_SOURCES_REGISTRY.quran_mushaf,
      APPROVED_SOURCES_REGISTRY.dorar_aqeeda
    ]
  },
  {
    id: 'sim-02',
    title: 'شبهة حول الكعبة وتقبيل الحجر الأسود',
    titleEn: 'Misconception regarding the Kaaba & the Black Stone',
    inquirerPersona: {
      name: 'ماركوس (سائح مهتم بالأديان المقارنة)',
      background: 'قرأ مقالاً يزعم أن طواف المسلمين حول الكعبة يشبه طقوس العبادة الوثنية للأحجار',
      tone: 'skeptical'
    },
    initialMessage: 'سمعت أن الإسلام دين التوحيد الصارم ويرفض الأصنام والتماثيل.. لكن ألا ترى تناقضاً حين يسافر الملايين للطواف حول مبنى حجري (الكعبة) وتقبيل الحجر الأسود؟ أليس هذا نوعاً من التقديس المادي؟',
    initialMessageEn: 'I understand Islam emphasizes strict monotheism and rejects idols. But isn\'t there a contradiction when millions travel to circumambulate a stone cube (the Kaaba) and kiss a black stone? Isn\'t that a form of veneration of objects?',
    context: 'تفنيد شبهة وثنية الكعبة بلغة رصينة ومؤصلة تاريخياً وشرعياً استناداً للحزمة المعتمدة.',
    idealApproachNotes: '1. شكر السائل وتوضيح الفرق الجوهري بين المعبود و"القبلة" (الاتجاه التوجيهي).\n2. ذكر أثر عمر بن الخطاب في الصحيح: "إني أعلم أنك حجر لا تضر ولا تنفع".\n3. بيان أن المسلمين يقفون "فوق الكعبة" للأذان، فلو كانت معبودة لما صعد عليها أحد.\n4. الحكمة هي توحيد صفوف البشرية من كل الأعراق نحو نقطة واحدة لعبادة الله وحده.',
    sources: [
      APPROVED_SOURCES_REGISTRY.dawa_shubuhat,
      APPROVED_SOURCES_REGISTRY.dorar_hadith
    ]
  },
  {
    id: 'sim-03',
    title: 'دعوة مهتم يرغب في معرفة شروط اعتناق الإسلام',
    titleEn: 'Guiding an Inquirer Interested in Embracing Islam',
    inquirerPersona: {
      name: 'سارة (باحثة مهتمة اعترفت باقتناعها بالتوحيد)',
      background: 'قرأت ترجمة معاني القرآن وترغب في معرفة الخطوات العملية للانضمام إلى الإسلام',
      tone: 'hesitant'
    },
    initialMessage: 'مرحباً، بعد أشهر من القراءة في القرآن شعرت بسكينة عميقة واقتنعت بأن الإله واحد حقاً. لكنني أشعر بالتردد والرهبة: هل أحتاج إلى إجراءات معقدة أو الذهاب لجهة رسمية للدخول في الإسلام؟ وما هي أول خطوة أقوم بها؟',
    initialMessageEn: 'Hello, after months of reading the Quran I felt deep peace and became convinced that God is truly One. But I feel overwhelmed: Do I need complicated formal procedures or a religious council to enter Islam? What is the very first step?',
    context: 'استقبال المهتدي برحمة وبشارة، وتوضيح سهولة الإسلام وعدم اشتراط بيروقراطية، وشرح نطق الشهادتين وتيسير البداية.',
    idealApproachNotes: '1. الترحيب الحار والتهنئة بالهداية والبشارة.\n2. التوضيح بأن الدخول في الإسلام يسير ومباشر بين العبد وربه بنطق الشهادتين باقتناع.\n3. شرح معنى الشهادتين وما تقتضيه بلطف وبساطة.\n4. عرض المساعدة في نطق الكلمات العربية (أشهد أن لا إله إلا الله، وأشهد أن محمداً رسول الله).\n5. طمأنتها بأن التغيير والتدرج في تعلم الصلاة والفرائض يكون برفق ودون مشقة.',
    sources: [
      APPROVED_SOURCES_REGISTRY.dawa_center,
      APPROVED_SOURCES_REGISTRY.jamhara_terms
    ]
  }
];
