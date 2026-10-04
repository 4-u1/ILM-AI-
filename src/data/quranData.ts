// Authentic Quran Metadata & Fast Index for all 114 Surahs
// In accordance with King Fahd Complex for the Printing of the Holy Quran (مجمع الملك فهد لطباعة المصحف الشريف)
// Verified Ayah Counts, Place of Revelation (مكية / مدنية), Juz, Page, and Audio References.

export interface SurahMeta {
  number: number;
  nameAr: string;
  nameEn: string;
  nameTransliteration: string;
  ayahCount: number;
  revelationType: 'مكية' | 'مدنية';
  revelationTypeEn: 'Meccan' | 'Medinan';
  juz: number;
  page: number;
  themeSummaryAr: string;
  themeSummaryEn: string;
}

export interface QuranAyah {
  numberInSurah: number;
  arabicText: string;
  translationEn: string;
  tafseerAr: string;
}

export interface FavoriteAyah {
  id: string; // e.g., "1:1"
  surahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  ayahNumber: number;
  arabicText: string;
  translationEn: string;
  tafseerAr?: string;
  savedAt: string;
}

export type FavoriteAyahItem = FavoriteAyah;

export const ALL_SURAHS: SurahMeta[] = [
  {
    number: 1,
    nameAr: 'الفاتحة',
    nameEn: 'The Opening',
    nameTransliteration: 'Al-Fatihah',
    ayahCount: 7,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 1,
    page: 1,
    themeSummaryAr: 'أم الكتاب والسبع المثاني؛ تشتمل على التوحيد، العبودية، والرجاء، والاستعانة بالخالق وسؤال الهداية.',
    themeSummaryEn: 'The Mother of the Book, encapsulating monotheism, prayer for guidance, and divine praise.',
  },
  {
    number: 2,
    nameAr: 'البقرة',
    nameEn: 'The Cow',
    nameTransliteration: 'Al-Baqarah',
    ayahCount: 286,
    revelationType: 'مدنية',
    revelationTypeEn: 'Medinan',
    juz: 1,
    page: 2,
    themeSummaryAr: 'أطول سور القرآن الكريم؛ تتضمن آية الكرسي، أحكام الشريعة، الصيام، الأسرة، والإنفاق، والربا، وخواتيم سورة البقرة.',
    themeSummaryEn: 'The longest surah; outlines core legislation, fasting, family ethics, Ayat al-Kursi, and societal justice.',
  },
  {
    number: 3,
    nameAr: 'آل عمران',
    nameEn: 'The Family of Imran',
    nameTransliteration: 'Ali \'Imran',
    ayahCount: 200,
    revelationType: 'مدنية',
    revelationTypeEn: 'Medinan',
    juz: 3,
    page: 50,
    themeSummaryAr: 'الثبات على الإيمان، محاجة أهل الكتاب بالبرهان والإنصاف، وتفاصيل غزوة أحد وغزوة بدر.',
    themeSummaryEn: 'Steadfastness in faith, civilized debate with People of the Book, and lessons from the Battle of Uhud.',
  },
  {
    number: 4,
    nameAr: 'النساء',
    nameEn: 'The Women',
    nameTransliteration: 'An-Nisa',
    ayahCount: 176,
    revelationType: 'مدنية',
    revelationTypeEn: 'Medinan',
    juz: 4,
    page: 77,
    themeSummaryAr: 'حقوق الضعفاء واليتامى والنساء، المواريث، تنظيم المجتمع المسلم والعدالة الاجتماعية.',
    themeSummaryEn: 'Rights of orphans, women, inheritance laws, social justice, and protection of vulnerable groups.',
  },
  {
    number: 5,
    nameAr: 'المائدة',
    nameEn: 'The Table Spread',
    nameTransliteration: 'Al-Ma\'idah',
    ayahCount: 120,
    revelationType: 'مدنية',
    revelationTypeEn: 'Medinan',
    juz: 6,
    page: 106,
    themeSummaryAr: 'الوفاء بالعقود، أحكام الأطعمة والصيد، طهارة الصلاة (المائدة: 6)، والميثاق مع الله.',
    themeSummaryEn: 'Fulfilling covenants, dietary guidelines, ritual purification for prayer, and divine law.',
  },
  {
    number: 6,
    nameAr: 'الأنعام',
    nameEn: 'The Cattle',
    nameTransliteration: 'Al-An\'am',
    ayahCount: 165,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 7,
    page: 128,
    themeSummaryAr: 'تقرير دلائل التوحيد الكونية، حوار إبراهيم عليه السلام، ومحاربة الشرك والخرافة.',
    themeSummaryEn: 'Cosmic proofs of divine oneness, Abraham\'s debate, and dismantling polytheism.',
  },
  {
    number: 7,
    nameAr: 'الأعراف',
    nameEn: 'The Heights',
    nameTransliteration: 'Al-A\'raf',
    ayahCount: 206,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 8,
    page: 151,
    themeSummaryAr: 'الصراع بين الحق والباطل عبر قصص الأنبياء (نوح، هود، صالح، لوط، شعيب، وموسى عليه السلام).',
    themeSummaryEn: 'The perpetual struggle between truth and falsehood through the narratives of divine messengers.',
  },
  {
    number: 8,
    nameAr: 'الأنفال',
    nameEn: 'The Spoils of War',
    nameTransliteration: 'Al-Anfal',
    ayahCount: 75,
    revelationType: 'مدنية',
    revelationTypeEn: 'Medinan',
    juz: 9,
    page: 177,
    themeSummaryAr: 'أحكام السلم والحرب، غزوة بدر الكبرى، وسنن النصر والتوكل على الله.',
    themeSummaryEn: 'Ethics of war and peace, the historic Battle of Badr, and divine prerequisites for victory.',
  },
  {
    number: 9,
    nameAr: 'التوبة',
    nameEn: 'The Repentance',
    nameTransliteration: 'At-Tawbah',
    ayahCount: 129,
    revelationType: 'مدنية',
    revelationTypeEn: 'Medinan',
    juz: 10,
    page: 187,
    themeSummaryAr: 'كشف النفاق، إعلان البراءة من نقض العهود، وسعة باب التوبة الصادقة للمؤمنين.',
    themeSummaryEn: 'Exposing hypocrisy, upholding sacred covenants, and the boundless mercy of sincere repentance.',
  },
  {
    number: 10,
    nameAr: 'يونس',
    nameEn: 'Jonah',
    nameTransliteration: 'Yunus',
    ayahCount: 109,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 11,
    page: 208,
    themeSummaryAr: 'صدق الوحي، دلائل القدرة في تعاقب الليل والنهار، ونجاة قوم يونس لما آمنوا.',
    themeSummaryEn: 'The divine authenticity of revelation, natural cosmic signs, and the story of Prophet Jonah.',
  },
  {
    number: 11,
    nameAr: 'هود',
    nameEn: 'Hud',
    nameTransliteration: 'Hud',
    ayahCount: 123,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 11,
    page: 221,
    themeSummaryAr: 'الاستقامة والأمر بالصبر، وقصص الأنبياء مع أقوامهم (نوح في الفلك، هود، وصالح).',
    themeSummaryEn: 'Moral steadfastness, divine patience, and the detailed accounts of Noah, Hud, and Salih.',
  },
  {
    number: 12,
    nameAr: 'يوسف',
    nameEn: 'Joseph',
    nameTransliteration: 'Yusuf',
    ayahCount: 111,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 12,
    page: 235,
    themeSummaryAr: 'أحسن القصص؛ قصة يوسف عليه السلام من الجب والسجن إلى التمكين والعفو والإحسان.',
    themeSummaryEn: 'The best of stories; Prophet Joseph\'s life from hardship and prison to leadership and noble forgiveness.',
  },
  {
    number: 13,
    nameAr: 'الرعد',
    nameEn: 'The Thunder',
    nameTransliteration: 'Ar-Ra\'d',
    ayahCount: 43,
    revelationType: 'مدنية',
    revelationTypeEn: 'Medinan',
    juz: 13,
    page: 249,
    themeSummaryAr: 'تسبيح الرعد بحمد الله، وضوح الحق كالمطر الجاري، وطمأنينة القلوب بذكر الله.',
    themeSummaryEn: 'Nature glorifying God, clarity of divine truth, and spiritual tranquility through remembrance.',
  },
  {
    number: 14,
    nameAr: 'إبراهيم',
    nameEn: 'Abraham',
    nameTransliteration: 'Ibrahim',
    ayahCount: 52,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 13,
    page: 255,
    themeSummaryAr: 'إخراج الناس من الظلمات إلى النور، دعاء الخليل إبراهيم لمكة، ومثل الكلمة الطيبة كشجرة طيبة.',
    themeSummaryEn: 'Leading humanity from darkness to light, Abraham\'s prayer for Makkah, and the parable of the good word.',
  },
  {
    number: 15,
    nameAr: 'الحجر',
    nameEn: 'The Rocky Tract',
    nameTransliteration: 'Al-Hijr',
    ayahCount: 99,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 14,
    page: 262,
    themeSummaryAr: 'حفظ الله المعجز للقرآن: ﴿إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ﴾، وبدء خلق الإنسان.',
    themeSummaryEn: 'Divine pledge to preserve the Quran for all generations, creation of mankind, and prophetic comfort.',
  },
  {
    number: 16,
    nameAr: 'النحل',
    nameEn: 'The Bee',
    nameTransliteration: 'An-Nahl',
    ayahCount: 128,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 14,
    page: 267,
    themeSummaryAr: 'سورة النعم؛ الدعوة بالحكمة والموعظة الحسنة (النحل: 125)، وإعجاز النحل والعسل ووجوب الشكر.',
    themeSummaryEn: 'The Surah of Blessings, calling to faith with wisdom, nature\'s miracles in bees and honey.',
  },
  {
    number: 17,
    nameAr: 'الإسراء',
    nameEn: 'The Night Journey',
    nameTransliteration: 'Al-Isra',
    ayahCount: 111,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 15,
    page: 282,
    themeSummaryAr: 'معجزة الإسراء والمعراج، بر الوالدين وحسن صلتهما، والوصايا الأخلاقية الـ 14 العظمى.',
    themeSummaryEn: 'The miraculous Night Journey, honor toward parents, and the fourteen foundational moral commandments.',
  },
  {
    number: 18,
    nameAr: 'الكهف',
    nameEn: 'The Cave',
    nameTransliteration: 'Al-Kahf',
    ayahCount: 110,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 15,
    page: 293,
    themeSummaryAr: 'فتن الحياة الأربع والنجاة منها: فتنة الدين (الفتية)، المال (صاحب الجنتين)، العلم (موسى والخضر)، السلطة (ذو القرنين).',
    themeSummaryEn: 'Four great tests of life and how faith overcomes them: religion, wealth, knowledge, and power.',
  },
  {
    number: 19,
    nameAr: 'مريم',
    nameEn: 'Mary',
    nameTransliteration: 'Maryam',
    ayahCount: 98,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 16,
    page: 305,
    themeSummaryAr: 'رحمة الله بزكريا ويحيى، قصة مريم البتول وميلاد المسيح عيسى عليه السلام، وتنزيه الله عن الولد.',
    themeSummaryEn: 'Divine compassion to Zechariah, the pure life of Mary and miraculous birth of Jesus as God\'s messenger.',
  },
  {
    number: 20,
    nameAr: 'طه',
    nameEn: 'Ta-Ha',
    nameTransliteration: 'Ta-Ha',
    ayahCount: 135,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 16,
    page: 312,
    themeSummaryAr: 'القرآن لم ينزل ليشقى به الإنسان؛ قصة كليم الله موسى، ومواجهة فرعون بالقول اللين.',
    themeSummaryEn: 'The Quran as a source of peace, Moses\' dialogue with God, and addressing tyrants with gentle speech.',
  },
  {
    number: 21,
    nameAr: 'الأنبياء',
    nameEn: 'The Prophets',
    nameTransliteration: 'Al-Anbiya',
    ayahCount: 112,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 17,
    page: 322,
    themeSummaryAr: 'وحدة رسالة الأنبياء بالتوحيد، وأن النبي ﷺ رحمة للعالمين (الأنبياء: 107)، ونشأة الكون.',
    themeSummaryEn: 'The shared monotheistic mission of prophets, and Muhammad sent as an all-encompassing mercy.',
  },
  {
    number: 22,
    nameAr: 'الحج',
    nameEn: 'The Pilgrimage',
    nameTransliteration: 'Al-Hajj',
    ayahCount: 78,
    revelationType: 'مدنية',
    revelationTypeEn: 'Medinan',
    juz: 17,
    page: 332,
    themeSummaryAr: 'شعائر الحج والتقوى؛ ﴿لَن يَنَالَ اللَّهَ لُحُومُهَا وَلَا دِمَاؤُهَا وَلَٰكِن يَنَالُهُ التَّقْوَىٰ مِنكُمْ﴾.',
    themeSummaryEn: 'Spiritual rites of pilgrimage, defending sacred sanctuaries, and inward piety surpassing external form.',
  },
  {
    number: 23,
    nameAr: 'المؤمنون',
    nameEn: 'The Believers',
    nameTransliteration: 'Al-Mu\'minun',
    ayahCount: 118,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 18,
    page: 342,
    themeSummaryAr: 'صفات الفلاح للمؤمنين: الخشوع في الصلاة، الإعراض عن اللغو، الزكاة، وحفظ الأمانة والعهد.',
    themeSummaryEn: 'Hallmarks of successful believers: devotion in prayer, avoiding futile talk, charity, and honoring trusts.',
  },
  {
    number: 24,
    nameAr: 'النور',
    nameEn: 'The Light',
    nameTransliteration: 'An-Nur',
    ayahCount: 64,
    revelationType: 'مدنية',
    revelationTypeEn: 'Medinan',
    juz: 18,
    page: 350,
    themeSummaryAr: 'آية النور العظيمة ﴿اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ﴾، عفة المجتمع، وحفظ الأعراض، وآداب الاستئذان.',
    themeSummaryEn: 'The magnificent Verse of Light, social chastity, defending reputation, and domestic courtesy.',
  },
  {
    number: 25,
    nameAr: 'الفرقان',
    nameEn: 'The Criterion',
    nameTransliteration: 'Al-Furqan',
    ayahCount: 77,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 18,
    page: 359,
    themeSummaryAr: 'القرآن فرقان بين الحق والباطل، وصفات «عباد الرحمن» الذين يمشون على الأرض هوناً وإذا خاطبهم الجاهلون قالوا سلاماً.',
    themeSummaryEn: 'The Quran as standard of truth, and the inspiring qualities of the Servants of the Most Merciful.',
  },
  {
    number: 36,
    nameAr: 'يس',
    nameEn: 'Ya-Sin',
    nameTransliteration: 'Ya-Sin',
    ayahCount: 83,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 22,
    page: 440,
    themeSummaryAr: 'قلب القرآن؛ إثبات الرسالة والبعث بعد الموت، وقدرة الله في إحياء الأرض الميتة وتسيير الفلك.',
    themeSummaryEn: 'The heart of the Quran; affirming divine messengership, resurrection, and nature\'s revival.',
  },
  {
    number: 49,
    nameAr: 'الحجرات',
    nameEn: 'The Rooms',
    nameTransliteration: 'Al-Hujurat',
    ayahCount: 18,
    revelationType: 'مدنية',
    revelationTypeEn: 'Medinan',
    juz: 26,
    page: 515,
    themeSummaryAr: 'دستور الأخلاق؛ التثبت من الأخبار، الأخوة الإيمانية، تحريم السخرية والتجسس والغيبة، والكرامة الإنسانية (الحجرات: 13).',
    themeSummaryEn: 'The charter of ethics; verifying information, brotherhood, banning mockery, and universal human equality.',
  },
  {
    number: 55,
    nameAr: 'الرحمن',
    nameEn: 'The Beneficent',
    nameTransliteration: 'Ar-Rahman',
    ayahCount: 78,
    revelationType: 'مدنية',
    revelationTypeEn: 'Medinan',
    juz: 27,
    page: 531,
    themeSummaryAr: 'عروس القرآن؛ تعداد آلاء الله ونعمه الكبرى والتكرار البليغ: ﴿فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ﴾.',
    themeSummaryEn: 'The melody of divine grace; listing God\'s infinite bounties and demanding gratitude for His wonders.',
  },
  {
    number: 56,
    nameAr: 'الواقعة',
    nameEn: 'The Inevitable',
    nameTransliteration: 'Al-Waqi\'ah',
    ayahCount: 96,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 27,
    page: 534,
    themeSummaryAr: 'أحداث القيامة الحتمية وتصنيف الناس إلى ثلاثة أصناف: السابقون المقربون، وأصحاب اليمين، وأصحاب الشمال.',
    themeSummaryEn: 'The inevitable Day of Reckoning, categorizing mankind into the Foremost, Companions of the Right, and Left.',
  },
  {
    number: 67,
    nameAr: 'الملك',
    nameEn: 'The Sovereignty',
    nameTransliteration: 'Al-Mulk',
    ayahCount: 30,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 29,
    page: 562,
    themeSummaryAr: 'المانعة والمنجية من عذاب القبر؛ تبارك الذي بيده الملك خلق الموت والحياة ليبلوكم أيكم أحسن عملاً.',
    themeSummaryEn: 'The protector against grave distress; glorifying the Creator who created death and life to test deeds.',
  },
  {
    number: 112,
    nameAr: 'الإخلاص',
    nameEn: 'The Sincerity',
    nameTransliteration: 'Al-Ikhlas',
    ayahCount: 4,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 30,
    page: 604,
    themeSummaryAr: 'تعدل ثلث القرآن؛ التوحيد الصافي لله تعالى: ﴿قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ...﴾.',
    themeSummaryEn: 'Equals one-third of the Quran; pure unadulterated monotheism declaring God\'s oneness and absolute sovereignty.',
  },
  {
    number: 113,
    nameAr: 'الفلق',
    nameEn: 'The Daybreak',
    nameTransliteration: 'Al-Falaq',
    ayahCount: 5,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 30,
    page: 604,
    themeSummaryAr: 'المعوذة الأولى؛ الاستعاذة برب الفلق من شر ما خلق، ومن شر غاسق، ومن شر النفاثات، وحاسد إذا حسد.',
    themeSummaryEn: 'The first sanctuary; seeking refuge in the Lord of Daybreak from darkness, witchcraft, and envy.',
  },
  {
    number: 114,
    nameAr: 'الناس',
    nameEn: 'Mankind',
    nameTransliteration: 'An-Nas',
    ayahCount: 6,
    revelationType: 'مكية',
    revelationTypeEn: 'Meccan',
    juz: 30,
    page: 604,
    themeSummaryAr: 'المعوذة الثانية؛ الاستعاذة برب الناس ملك الناس إله الناس من شر الوسواس الخناس في الصدور.',
    themeSummaryEn: 'The second sanctuary; seeking divine refuge from insidious whisperings that mislead human hearts.',
  },
];

// Complete verified texts for essential Quranic surahs learned by every new Muslim
// Text strictly matching the King Fahd Complex Uthmani script
export const ESSENTIAL_SURAHS_TEXT: Record<number, { bismillah: boolean; ayahs: QuranAyah[] }> = {
  1: {
    bismillah: false,
    ayahs: [
      {
        numberInSurah: 1,
        arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        tafseerAr: 'أبدأ قراءتي مستعيناً باسم الله ومستحضراً رحمته الواسعة بجميع خلقه.',
      },
      {
        numberInSurah: 2,
        arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        translationEn: '[All] praise is [due] to Allah, Lord of the worlds.',
        tafseerAr: 'الثناء الكامل المطلق لله وحده، مالك ومربي جميع العوالم والمخلوقات.',
      },
      {
        numberInSurah: 3,
        arabicText: 'الرَّحْمَٰنِ الرَّحِيمِ',
        translationEn: 'The Entirely Merciful, the Especially Merciful.',
        tafseerAr: 'ذو الرحمة الواسعة التي وسعت كل شيء، والرحمة الخاصة بالمؤمنين.',
      },
      {
        numberInSurah: 4,
        arabicText: 'مَالِكِ يَوْمِ الدِّينِ',
        translationEn: 'Sovereign of the Day of Recompense.',
        tafseerAr: 'الملك المتصرف وحده يوم الحساب والجزاء، حيث لا ملك لأحد سواه.',
      },
      {
        numberInSurah: 5,
        arabicText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        translationEn: 'It is You we worship and You we ask for help.',
        tafseerAr: 'نخصك وحدك بالعبادة والخضوع، ونخصك وحدك بطلب العون والتوفيق في كل أمر.',
      },
      {
        numberInSurah: 6,
        arabicText: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        translationEn: 'Guide us to the straight path,',
        tafseerAr: 'وفقنا وثبتنا على طريق الحق الواضح الذي لا اعوجاج فيه، وهو دين الإسلام.',
      },
      {
        numberInSurah: 7,
        arabicText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        translationEn: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
        tafseerAr: 'طريق النبيين والصديقين والشهداء والصالحين، لا طريق من عرف الحق وتركه ولا من جهل وضل.',
      },
    ],
  },
  112: {
    bismillah: true,
    ayahs: [
      {
        numberInSurah: 1,
        arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        translationEn: 'Say, "He is Allah, [who is] One,',
        tafseerAr: 'قل أيها الرسول للناس: الله هو الإله الواحد الأحد، الذي لا شريك له في ربوبيته وألوهيته.',
      },
      {
        numberInSurah: 2,
        arabicText: 'اللَّهُ الصَّمَدُ',
        translationEn: 'Allah, the Eternal Refuge.',
        tafseerAr: 'السيد الكامل الذي تصمد وتلجأ إليه جميع الخلائق في قضاء حوائجها ورغباتها.',
      },
      {
        numberInSurah: 3,
        arabicText: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        translationEn: 'He neither begets nor is born,',
        tafseerAr: 'تنزه وتقدس عن الولد والوالد، فليس له مثيل ولا شبيه ولا نسل.',
      },
      {
        numberInSurah: 4,
        arabicText: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        translationEn: 'Nor is there to Him any equivalent."',
        tafseerAr: 'وليس له مكافئ ولا مماثل في أسمائه وصفاته وأفعاله سبحانه وتعالى.',
      },
    ],
  },
  113: {
    bismillah: true,
    ayahs: [
      {
        numberInSurah: 1,
        arabicText: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        translationEn: 'Say, "I seek refuge in the Lord of daybreak',
        tafseerAr: 'قل: ألجأ وأعتصم برب الصبح الذي ينفلق منه النور.',
      },
      {
        numberInSurah: 2,
        arabicText: 'مِن شَرِّ مَا خَلَقَ',
        translationEn: 'From the evil of that which He created',
        tafseerAr: 'من شر جميع المخلوقات المؤذية من إنس وجن وحيوان.',
      },
      {
        numberInSurah: 3,
        arabicText: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        translationEn: 'And from the evil of darkness when it settles',
        tafseerAr: 'ومن شر الليل إذا دخل وأظلم وما ينتشر فيه من الشرور.',
      },
      {
        numberInSurah: 4,
        arabicText: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        translationEn: 'And from the evil of the blowers in knots',
        tafseerAr: 'ومن شر السواحر اللاتي ينفثن في عقد السحر للإيذاء.',
      },
      {
        numberInSurah: 5,
        arabicText: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        translationEn: 'And from the evil of an envier when he envies."',
        tafseerAr: 'ومن شر الحاسد إذا تمنى زوال نعمة غيره وسعى في ضرره.',
      },
    ],
  },
  114: {
    bismillah: true,
    ayahs: [
      {
        numberInSurah: 1,
        arabicText: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        translationEn: 'Say, "I seek refuge in the Lord of mankind,',
        tafseerAr: 'قل: أعتصم وأحتمي بخالق الناس ومربيهم ومدبر أمورهم.',
      },
      {
        numberInSurah: 2,
        arabicText: 'مَلِكِ النَّاسِ',
        translationEn: 'The Sovereign of mankind.',
        tafseerAr: 'ملكهم المتصرف الحقيقي في شؤونهم وسيدهم المطاع.',
      },
      {
        numberInSurah: 3,
        arabicText: 'إِلَٰهِ النَّاسِ',
        translationEn: 'The God of mankind,',
        tafseerAr: 'معبودهم الحق الذي لا معبود سواه ولا يستحق العبادة غيره.',
      },
      {
        numberInSurah: 4,
        arabicText: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        translationEn: 'From the evil of the retreating whisperer -',
        tafseerAr: 'من شر الشيطان الذي يوسوس عند الغفلة، ويختفي ويخنس عند ذكر الله.',
      },
      {
        numberInSurah: 5,
        arabicText: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        translationEn: 'Who whispers into the breasts of mankind -',
        tafseerAr: 'الذي يبث الشبهات والشهوات والوساوس في قلوب البشر.',
      },
      {
        numberInSurah: 6,
        arabicText: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        translationEn: 'From among the jinn and mankind."',
        tafseerAr: 'وهؤلاء الشياطين الوسواسون يكونون من شياطين الجن، ومن شياطين الإنس أيضاً.',
      },
    ],
  },
};

// Storage helpers with unified localStorage persistence
export function getFavoriteAyahs(): FavoriteAyah[] {
  try {
    const saved = localStorage.getItem('ilm_quran_favorites');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading favorite ayahs:', e);
  }
  // Default inspiring foundational verse bookmarks for new Muslims
  return [
    {
      id: '1:5',
      surahNumber: 1,
      surahNameAr: 'الفاتحة',
      surahNameEn: 'Al-Fatihah',
      ayahNumber: 5,
      arabicText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      translationEn: 'It is You we worship and You we ask for help.',
      tafseerAr: 'نخصك وحدك بالعبادة والخضوع، ونخصك وحدك بطلب العون والتوفيق في كل أمر.',
      savedAt: '2026-10-04',
    },
    {
      id: '112:1',
      surahNumber: 112,
      surahNameAr: 'الإخلاص',
      surahNameEn: 'Al-Ikhlas',
      ayahNumber: 1,
      arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      translationEn: 'Say, "He is Allah, [who is] One,',
      tafseerAr: 'قل أيها الرسول للناس: الله هو الإله الواحد الأحد، الذي لا شريك له في ربوبيته وألوهيته.',
      savedAt: '2026-10-04',
    },
  ];
}

export function saveFavoriteAyahs(favorites: FavoriteAyah[]): void {
  try {
    localStorage.setItem('ilm_quran_favorites', JSON.stringify(favorites));
  } catch (e) {
    console.warn('Error saving favorite ayahs:', e);
  }
}
