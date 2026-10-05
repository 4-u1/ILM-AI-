import { TrackId, Language } from '../types';

export interface TutorUnit {
  title: string;
  part1: string;
  clarityQuestion: (name: string) => string;
  checkQuestion: string;
  checkOptions: string[];
  correctOptionIndex: number;
  correctionExplanation: (name: string) => string;
}

export interface TutorQuizQuestion {
  q: string;
  options: string[];
  correct: number;
}

export interface TutorTrackMeta {
  title: string;
  titleAr: string;
  titleEn: string;
  welcomeMsg: string;
  verifyQ: string;
  verifyOptions: string[];
  curriculumOverview: string;
  units: TutorUnit[];
  quizQuestions: TutorQuizQuestion[];
  certSubtitle: string;
  certSubtitleAr: string;
  certSubtitleEn: string;
}

export const getTutorTrackMeta = (trackId: TrackId, language: Language): TutorTrackMeta => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';

  const TRACKS: Record<TrackId, TutorTrackMeta> = {
    muslim: {
      title: isAr ? 'مسار المسلم الأصل' : isUr ? 'مسلمِ اصل کا راستہ' : 'Born Muslim Path',
      titleAr: 'مسار المسلم الأصل',
      titleEn: 'Born Muslim Path',
      welcomeMsg: isAr
        ? 'السلام عليكم ورحمة الله وبركاته. حياك الله في مسار المسلم الأصل. يسعدني أن أكون معلمك اليوم. من أنت وما اسمك الكريم؟'
        : isUr
        ? 'السلام علیکم ورحمۃ اللہ وبرکاتہ۔ مسلمِ اصل کے راستے میں خوش آمدید۔ آج آپ کا اتالیق بن کر مجھے بے حد خوشی ہے۔ آپ کا اسم گرامی کیا ہے؟'
        : 'Peace and blessings be upon you. Welcome to the Born Muslim Track! I am delighted to be your mentor today. May I know your noble name?',
      verifyQ: isAr
        ? 'بما أنك اخترت مسار (المسلم الأصل)، هل أنت فعلاً ولدت مسلماً؟'
        : isUr
        ? 'چونکہ آپ نے مسلمِ اصل کا راستہ منتخب کیا ہے، کیا آپ پیدائشی طور پر مسلمان ہیں؟'
        : 'Since you selected the (Born Muslim) track, were you born and raised in a Muslim family?',
      verifyOptions: isAr
        ? ['نعم، ولدت مسلماً والحمد لله', 'نعم، نشأت في أسرة مسلمة', 'لا، دخلت الإسلام حديثاً']
        : isUr
        ? ['جی ہاں، پیدائشی مسلمان ہوں الحمد لله', 'جی ہاں، مسلم گھرانے میں پرورش پائی', 'نہیں، میں نے حال ہی میں اسلام قبول کیا ہے']
        : ['Yes, born Muslim alhamdulillah', 'Yes, raised in a Muslim family', 'No, I recently embraced Islam'],
      curriculumOverview: isAr
        ? `بناءً على هدفك المبارك، مسار المسلم الأصل عندنا مصمم خصيصاً لك، وسيمر بالمراحل التالية:
• بناء العقيدة (فهم التوحيد بأنواعه).
• الفقه (أحكام العبادات والخشوع التي تهمك في يومك).
• تصحيح المفاهيم والشبهات المعاصرة.
• بناء القيم والأخلاق الإسلامية في تعاملاتك.

هل أنت مستعد لنبدأ معاً في الدرس الأول (العقيدة)؟`
        : `Based on your blessed goal, our Born Muslim track is tailored for you through these key stations:
• Creed & Faith Foundations (understanding Tawhid and its dimensions).
• Practical Fiqh (essential acts of worship & mindfulness in daily prayer).
• Deconstructing contemporary misconceptions and doubts.
• Cultivating Islamic virtues and ethics in everyday character.

Are you ready to begin our first lesson together?`,
      units: [
        {
          title: isAr ? 'بناء العقيدة: مفهوم التوحيد وأساسه' : 'Creed: Foundations of Monotheism (Tawhid)',
          part1: isAr
            ? 'التوحيد في لغتنا هو إفراد الشيء، وشرعاً هو: إفراد الله تعالى بما يختص به من الربوبية والألوهية والأسماء والصفات. أي أن نعتقد بقلوبنا وجوارحنا أنه لا خالق ولا رازق ولا معبود بحق إلا الله وحده لا شريك له.'
            : 'Tawhid in Islam signifies the uncompromised oneness of God: dedicating our hearts and worship exclusively to Allah alone without partners, acknowledging that He is the sole Creator, Provider, and Deity worthy of devotion.',
          clarityQuestion: (name: string) => isAr
            ? `واضح يا ${name} حتى الآن؟ أو تحب أعيد لك نقطة معينة؟`
            : `Is this foundational concept clear to you, ${name}, or would you like me to clarify anything?`,
          checkQuestion: isAr
            ? 'لو سألك شخص: ما معنى التوحيد بكلمات بسيطة ومباشرة؟ ماذا سترد عليه؟'
            : 'If someone asks you: what is Tawhid in simple, direct words? What would you reply?',
          checkOptions: isAr
            ? [
                'هو إفراد الله وحده بالعبادة والخلق دون شريك',
                'هو مجرد الاعتراف بوجود خالق دون عبادته',
                'هو التواكل وتمني الأماني'
              ]
            : [
                'Devoting worship, creation, and prayer to God alone without partners',
                'Merely acknowledging that a Creator exists without worshiping Him',
                'Passive wishful thinking without action'
              ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => isAr
            ? `محاولة طيبة يا ${name}، لكن الأصح هو: التوحيد لا يكفي فيه مجرد الإقرار بوجود الله، بل لابد من إفراده بالعبادة والخلق ونفي أي شريك عنه.`
            : `Good attempt ${name}, but the precise answer is: Tawhid is not merely admitting God exists; it requires dedicating our worship, prayers, and obedience exclusively to Him alone.`
        },
        {
          title: isAr ? 'أقسام التوحيد الثلاثة' : 'The Three Categories of Tawhid',
          part1: isAr
            ? 'ينقسم التوحيد إلى ثلاثة أقسام متكاملة: توحيد الربوبية (أفعال الله كالخلق والرزق)، وتوحيد الألوهية (أفعال العباد كالصلاة والدعاء لله وحده)، وتوحيد الأسماء والصفات (إثبات ما أثبته الله لنفسه بلا تمثيل ولا تعطيل).'
            : 'Scholars outline Tawhid into three unified dimensions: Tawhid ar-Rububiyyah (Lordship: God alone creates & sustains), Tawhid al-Uluhiyyah (Worship: directing prayer & supplication to God alone), and Asma wa Sifat (His divine names and perfect attributes).',
          clarityQuestion: (name: string) => isAr
            ? `ما شاء الله يا ${name}، هل هذا التقسيم واضح لك وميسر؟`
            : `Masha\'Allah ${name}, is this categorization clear and easy to grasp?`,
          checkQuestion: isAr
            ? 'لو أن شخصاً أقر بأن الله هو الخالق الرازق وحده، لكنه دعا غير الله أو استغاث بميت، هل يكون قد حقق توحيد الألوهية؟'
            : 'If someone acknowledges that God is the sole Creator, but directs supplications to deceased persons, have they fulfilled Tawhid of worship?',
          checkOptions: isAr
            ? [
                'لا، لأن الدعاء عبادة وصرفها لغير الله شرك يناقض الألوهية',
                'نعم، يكفيه الإقرار بأن الله هو الخالق',
                'نعم، ولا حرج في ذلك'
              ]
            : [
                'No, because supplication (du\'a) is worship and directing it to other than God contradicts Tawhid',
                'Yes, merely admitting God is Creator is sufficient',
                'Yes, there is no problem in doing so'
              ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => isAr
            ? `محاولة طيبة يا ${name}، لكن الأصح هو: الدعاء هو العبادة كما قال النبي ﷺ، فصرفه لغير الله يناقض توحيد الألوهية حتى لو كان مقراً بأن الله هو الخالق.`
            : `Well thought, ${name}. As the Prophet ﷺ stated: "Supplication is worship itself." Directing it to any creation contradicts Tawhid al-Uluhiyyah.`
        },
        {
          title: isAr ? 'الفقه: إتقان العبادة ومقاصد الصلاة' : 'Fiqh: Perfecting Worship & Mindful Prayer',
          part1: isAr
            ? 'الصلاة ليست مجرد حركات، بل هي صلة العبد بربه، وميزان يومه. مفتاحها الطهارة الباطنة بالإخلاص، والطهارة الظاهرة بإسباغ الوضوء، وروحها الخشوع واستحضار عظمة الله.'
            : 'Prayer is not mere routine postures; it is the spiritual lifeline connecting the believer with Allah. Its keys are inner sincerity, physical purification through mindful wudu, and soulful devotion (khushu\').',
          clarityQuestion: (name: string) => isAr
            ? `واضح لك يا ${name} هذا المقصد العظيم من الصلاة؟`
            : `Is this profound objective of prayer clear to you, ${name}?`,
          checkQuestion: isAr
            ? 'ما هما الشرطان الأساسيان لصحة وقبول أي عبادة في الإسلام؟'
            : 'What are the two essential conditions for any act of worship to be accepted in Islam?',
          checkOptions: isAr
            ? [
                'الإخلاص لله وحده وموافقة سنة رسول الله ﷺ',
                'كثرة المظاهر والتباهي أمام الناس',
                'أداؤها بسرعة وبأي كيفية'
              ]
            : [
                'Sincerity to God alone and adherence to the Sunnah of the Prophet ﷺ',
                'Outward ostentation and showing off to people',
                'Performing it quickly regardless of manner'
              ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => isAr
            ? `محاولة حسنة يا ${name}، لكن الأصح هو: العمل لا يُقبل عند الله إلا بشرطين متلازمين: الإخلاص لله وحده، وموافقة هدي النبي ﷺ.`
            : `A noble attempt ${name}. In Islamic theology, worship requires two twin pillars: sincere intention for God alone, and alignment with the Prophet\'s ﷺ authentic Sunnah.`
        },
        {
          title: isAr ? 'بناء القيم والأخلاق وتصحيح المفاهيم' : 'Islamic Character & Everyday Ethics',
          part1: isAr
            ? 'المسلم الحق لا تنفصل عبادته عن أخلاقه في عمله وتعامله اليومي. قال النبي ﷺ: «إنما بعثت لأتمم صالح الأخلاق». فالدين المعاملة والصدق والأمانة وبر الوالدين وحفظ الألسن.'
            : 'True faith seamlessly translates into everyday ethics, honesty, honoring parents, and keeping one\'s word. The Prophet ﷺ declared: "I was sent only to perfect noble character."',
          clarityQuestion: (name: string) => isAr
            ? `كيف ترى أثر هذه القيم في واقعك اليومي يا ${name}؟ هل الفكرة واضحة؟`
            : `How do you perceive these values in daily living, ${name}? Is the concept clear?`,
          checkQuestion: isAr
            ? 'إذا تعارض كسب المال بالغش أو الحرام مع الأمانة، فما هو الموقف الإيماني الراسخ للمسلم الأصل؟'
            : 'If earning money through deceit or prohibited means conflicts with honesty, what is the believer\'s principled stance?',
          checkOptions: isAr
            ? [
                'ترك الحرام ابتغاء مرضاة الله، واليقين بأن الرزاق هو الله وحده',
                'أخذ الحرام بدعوى صعوبة المعيشة',
                'الغش ما دام لا يراه أحد'
              ]
            : [
                'Forsaking what is prohibited seeking God\'s pleasure, trusting that Allah alone is the Sustainer',
                'Accepting unlawful gain claiming life is difficult',
                'Cheating as long as nobody notices'
              ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => isAr
            ? `محاولة طيبة يا ${name}، لكن الأصح هو: من ترك شيئاً لله عوضه الله خيراً منه، والتوكل الحق يقتضي طلب الرزق بالحلال الطيب.`
            : `Indeed, ${name}. Whoever forsakes something for God\'s sake, Allah compensates them with something far better in this life and the next.`
        }
      ],
      quizQuestions: [
        {
          q: isAr
            ? 'ما هو التوحيد الذي أنكره مشركو قريش وامتنعوا عنه رغم اعترافهم بأن الله هو الخالق؟'
            : 'Which aspect of monotheism was denied by the Quraysh polytheists despite acknowledging God as Creator?',
          options: isAr
            ? ['توحيد الألوهية (إفراد الله بالعبادة وحده)', 'توحيد الربوبية (الاعتراف بالخلق)', 'معرفة اللغة']
            : ['Tawhid al-Uluhiyyah (directing all worship to God alone)', 'Tawhid ar-Rububiyyah (acknowledging creation)', 'Linguistic knowledge'],
          correct: 0
        },
        {
          q: isAr
            ? 'ما هو مفهوم التوكل الحق على الله في أمور حياتك وسعيك؟'
            : 'What is the true concept of reliance on God (Tawakkul) in life and endeavor?',
          options: isAr
            ? ['صدق اعتماد القلب على الله مع بذل الأسباب المشروعة بكامل الهمة', 'ترك العمل والدراسة والقعود', 'الاعتماد على المخلوقين ونسيان الخالق']
            : ['Heartfelt reliance upon God combined with active, diligent effort using lawful means', 'Abandoning work and studying', 'Relying exclusively on creatures while forgetting God'],
          correct: 0
        },
        {
          q: isAr
            ? 'كيف يتعامل المسلم الراسخ مع الشبهات المعاصرة وتحديات الفكر؟'
            : 'How does a grounded Muslim approach modern doubts and ideological challenges?',
          options: isAr
            ? ['بالرجوع للعلماء والمصادر المعتمدة الموثوقة مع الحكمة', 'بالاندفاع والتعصب دون علم', 'بالتخلي عن ثوابت الدين']
            : ['By consulting verified scholarly sources and King Fahd Complex texts with wisdom', 'With emotional impulsiveness lacking knowledge', 'By relinquishing core tenets of faith'],
          correct: 0
        }
      ],
      certSubtitle: isAr ? 'مسار المسلم الأصل: ترسيخ وتعميق العقيدة والعبادة ومقاصد الشريعة' : 'Born Muslim Path: Deepening Creed, Worship Wisdom & Islamic Ethics',
      certSubtitleAr: 'مسار المسلم الأصل: ترسيخ وتعميق العقيدة والعبادة ومقاصد الشريعة',
      certSubtitleEn: 'Born Muslim Path: Deepening Creed, Worship Wisdom & Islamic Ethics'
    },

    new_muslim: {
      title: isAr ? 'مسار المسلم الجديد' : isUr ? 'نئے مسلم کا راستہ' : 'New Muslim Path',
      titleAr: 'مسار المسلم الجديد',
      titleEn: 'New Muslim Path',
      welcomeMsg: isAr
        ? 'السلام عليكم ورحمة الله وبركاته. مبارك عليك نعمة الإسلام، وأهلاً بك في مسار المسلم الجديد. يسعدني أن أكون رفيقك ومعلمك. من أنت وما اسمك الكريم؟'
        : isUr
        ? 'السلام علیکم ورحمۃ اللہ وبرکاتہ۔ اسلام کی نعمت پر مبارکباد، اور نئے مسلم کے راستے میں خوش آمدید۔ آپ کا اسم گرامی کیا ہے؟'
        : 'Peace and blessings be upon you! Congratulations on the gift of Islam, and welcome to the New Muslim Path. I am honored to be your companion and tutor. What is your name?',
      verifyQ: isAr
        ? 'هل دخلت في الإسلام حديثاً أو تبدأ خطواتك الأولى في تعلمه؟'
        : isUr
        ? 'کیا آپ نے حال ہی میں اسلام قبول کیا ہے یا ابتدائی مراحل میں ہیں؟'
        : 'Did you recently embrace Islam or are you taking your initial foundational steps?',
      verifyOptions: isAr
        ? ['نعم، أسلمت حديثاً والحمد لله', 'نعم، في خطواتي الأولى', 'أنا مسلم منذ الولادة']
        : isUr
        ? ['جی ہاں، حال ہی میں اسلام لایا ہوں', 'جی ہاں، ابتدائی مراحل میں ہوں', 'میں پیدائشی مسلمان ہوں']
        : ['Yes, recently embraced Islam alhamdulillah', 'Yes, taking my first steps', 'I have been Muslim since birth'],
      curriculumOverview: isAr
        ? `هنيئاً لك هذه البداية المباركة! مسارنا مصمم ليتدرج معك بيسر وسماحة:
• أركان الإسلام الخمسة وأركان الإيمان بمعانٍ بسيطة ومطمئنة.
• مفتاح العبادة: الطهارة وتعلم الصلاة خطوة بخطوة.
• الحياة اليومية للمسلم: الطعام الحلال والتعامل مع الأهل والمجتمع.
• بناء الطمأنينة القلبية وتجاوز التحديات الأولى.

هل أنت مستعد لنبدأ معاً في الخطوة الأولى؟`
        : `Congratulations on this blessed journey! Our path is designed to guide you step-by-step with gentleness:
• The Five Pillars of Islam and Six Pillars of Faith with simple clarity.
• The key to worship: purification (wudu) and step-by-step prayer.
• Daily life as a Muslim: halal living, family relations, and community care.
• Cultivating peace of mind and overcoming initial transitional questions.

Are you ready to take our first step together?`,
      units: [
        {
          title: isAr ? 'الشهادتان: معنى لا إله إلا الله ومحمد رسول الله' : 'The Two Testimonies (Shahadah)',
          part1: isAr
            ? 'الشهادتان هما باب الإسلام العظيم. معناهما: أن تشهد بقلبك ولسانك أنه لا معبود بحق إلا الله وحده، وأن محمداً ﷺ هو رسول الله وخاتم الأنبياء الذي أرسله الله رحمة للعالمين.'
            : 'The Shahadah is the magnificent gateway to Islam: testifying in heart and tongue that there is no deity worthy of worship except Allah alone, and that Muhammad ﷺ is His final Messenger sent as a mercy to all creation.',
          clarityQuestion: (name: string) => isAr
            ? `هل معنى الشهادتين واضح ومطمئن لقلبك يا ${name}؟`
            : `Is the meaning of the Shahadah clear and comforting to your heart, ${name}?`,
          checkQuestion: isAr
            ? 'ماذا يترتب على قولك (أشهد أن محمداً رسول الله) في حياتك اليومية؟'
            : 'What does saying "I bear witness that Muhammad is the Messenger of God" imply in daily life?',
          checkOptions: isAr
            ? [
                'تصديقه فيما أخبر، وطاعته فيما أمر، وعبادة الله بما شرع',
                'مجرد قول باللسان دون عمل بهديه',
                'التوقف عن كل أنشطة الحياة'
              ]
            : [
                'Believing his teachings, following his compassionate guidance, and worshiping God through his Sunnah',
                'Merely uttering words without following his teachings',
                'Abandoning all daily living activities'
              ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => isAr
            ? `محاولة طيبة يا ${name}، لكن الأصح هو: الشهادة تعني محبة النبي ﷺ وتصديقه واتباع سنته المباركة برفق وسماحة.`
            : `Beautiful, ${name}. Testifying to his prophethood implies loving the Prophet ﷺ and following his compassionate example with ease and joy.`
        },
        {
          title: isAr ? 'الصلوات الخمس: لقاؤك اليومي مع الله' : 'The Five Daily Prayers: Your Spiritual Anchor',
          part1: isAr
            ? 'الصلاة هي هدية الله للمؤمن، خمس وقفات يومية تزيل الهموم وتمنح القلب سكينة. تبدأ بتكبيرة الإحرام وقراءة الفاتحة وتنتهي بالسلام، والدين يسر، فما عجزت عنه تؤديه بقدر استطاعتك.'
            : 'Prayer is God\'s gift to the believer: five brief pauses throughout the day that lift anxieties and grant the heart profound tranquility. In Islam, religion is ease; what you cannot do immediately, you practice gradually.',
          clarityQuestion: (name: string) => isAr
            ? `هل تشعر بجمال هذه الهدية يا ${name}؟ وهل الفكرة واضحة؟`
            : `Do you feel the peaceful beauty of this gift, ${name}? Is the concept clear?`,
          checkQuestion: isAr
            ? 'إذا دخل وقت الصلاة ولم تحفظ سورة الفاتحة كاملة بعد، ماذا تفعل؟'
            : 'If prayer time arrives and you haven\'t fully memorized Surah Al-Fatihah yet, what should you do?',
          checkOptions: isAr
            ? [
                'تصلي وتذكر الله بما تيسر (سبحان الله، والحمد لله) حتى تحفظ الفاتحة بيسر',
                'تترك الصلاة نهائياً',
                'تنتظر أشهراً حتى تحفظ القرآن كله'
              ]
            : [
                'Pray and remember God with what is easy (SubhanAllah, Alhamdulillah) while learning Al-Fatihah gradually',
                'Abandon prayer altogether',
                'Wait months until memorizing the entire Quran'
              ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => isAr
            ? `محاولة طيبة يا ${name}، والصواب في ديننا الحنيف: أن الدين يسر، فتصلي وتذكر الله بما تيسر حتى تتعلم الفاتحة تدريجياً دون مشقة.`
            : `Spot on, ${name}! The Prophet ﷺ taught that Islam is ease: pray with what remembrance you know while learning Al-Fatihah without burden.`
        },
        {
          title: isAr ? 'التعامل مع الأهل والمجتمع' : 'Compassion with Family & Community',
          part1: isAr
            ? 'الإسلام يأمرك بزيادة البر والإحسان لأهلك ووالديك بعد إسلامك، وليس مقاطعتهم. قال الله تعالى في الوالدين غير المسلمين: {وصاحبهما في الدنيا معروفاً}. فخلقك الحسن هو أصدق دعوة لهم.'
            : 'Islam commands you to increase your kindness and love toward your parents and family after embracing Islam. God commands in the Quran regarding non-Muslim parents: {وصاحبهما في الدنيا معروفاً} ("And accompany them in this world with kindness"). Your noble character is the most genuine reflection of your faith.',
          clarityQuestion: (name: string) => isAr
            ? `واضح لك يا ${name} هذا الأدب الرفيع في التعامل مع الأهل؟`
            : `Is this noble principle of honoring family clear to you, ${name}?`,
          checkQuestion: isAr
            ? 'كيف يوصينا الإسلام بالتعامل مع الوالدين والأقارب غير المسلمين؟'
            : 'How does Islam instruct us to treat non-Muslim parents and relatives?',
          checkOptions: isAr
            ? [
                'بالبر والإحسان والصلة والهدية وحسن المعاملة',
                'بالقطيعة والغضب والمعاملة الجافة',
                'بترك برهم'
              ]
            : [
                'With loving kindness, gift-giving, respect, and compassionate service',
                'With estrangement, anger, and harshness',
                'By neglecting their care'
              ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => isAr
            ? `محاولة طيبة يا ${name}، بل العكس تماماً: الإسلام يحث على مضاعفة الإحسان والبر للأهل لتكون سفيراً حسناً لدين الرحمة.`
            : `Exactly right, ${name}. Islam urges us to double our kindness and care for our parents, serving as gentle ambassadors of mercy.`
        }
      ],
      quizQuestions: [
        {
          q: isAr ? 'ما هو الركن الأول والأساسي من أركان الإسلام؟' : 'What is the first and foundational pillar of Islam?',
          options: isAr
            ? ['شهادة أن لا إله إلا الله وأن محمداً رسول الله', 'صيام شهر رمضان', 'الحج لمن استطاع إليه سبيلاً']
            : ['The Testimony of Faith (Shahadah)', 'Fasting Ramadan', 'Hajj for whoever is able'],
          correct: 0
        },
        {
          q: isAr ? 'ما القاعدة الأساسية في تعلم أحكام الإسلام للمسلم الجديد؟' : 'What is the core principle in learning Islamic practices for a new Muslim?',
          options: isAr
            ? ['التدرج واليسر وسماحة الشريعة', 'المشقة والتشديد على النفس', 'ترك التعلم']
            : ['Gradual progression, ease, and compassion', 'Hardship and strictness on oneself', 'Giving up learning'],
          correct: 0
        },
        {
          q: isAr ? 'كيف تكون علاقة المسلم الجديد مع أسرته ومجتمعه؟' : 'How should a new Muslim engage with their family and society?',
          options: isAr
            ? ['علاقة بر ورحمة وإحسان وخلق رفيع', 'قطيعة وتنافر', 'عزلة تامة']
            : ['A relationship of loving kindness, mercy, and exemplary character', 'Alienation and hostility', 'Total isolation'],
          correct: 0
        }
      ],
      certSubtitle: isAr ? 'مسار المسلم الجديد: تأسيس أركان الإسلام، تعلم الصلاة، وسماحة الدين' : 'New Muslim Path: Foundations of Faith, Prayer & Islamic Living',
      certSubtitleAr: 'مسار المسلم الجديد: تأسيس أركان الإسلام، تعلم الصلاة، وسماحة الدين',
      certSubtitleEn: 'New Muslim Path: Foundations of Faith, Prayer & Islamic Living'
    },

    non_muslim: {
      title: isAr ? 'مسار غير المسلم (باحث عن الحقيقة)' : isUr ? 'غیر مسلم کے لیے راستہ' : 'Truth Inquirer Path',
      titleAr: 'مسار غير المسلم (باحث عن الحقيقة)',
      titleEn: 'Truth Inquirer Path',
      welcomeMsg: isAr
        ? 'السلام عليكم، وأهلاً ومرحباً بك في مسار الباحث عن الحقيقة. يسعدنا جداً حضورك وحوارك الهادئ في مساحة آمنة ومحترمة. من أنت وما اسمك الكريم؟'
        : isUr
        ? 'خوش آمدید! سچائی کی تلاش کے سفر میں آپ کا خیر مقدم ہے۔ آپ کا نام کیا ہے؟'
        : 'Peace be upon you, and welcome to the Truth Inquirer Path! We are truly delighted to host you in a safe, respectful, and objective space for genuine dialogue. What is your name?',
      verifyQ: isAr
        ? 'هل تزورنا اليوم للتعرف على الإسلام والبحث عن إجابات لتساؤلاتك بحرية وموضوعية؟'
        : isUr
        ? 'کیا آپ اسلام کے بارے میں جاننے اور سوالات کے جوابات کے لیے تشریف لائے ہیں؟'
        : 'Are you visiting today to explore Islam and seek answers to existential questions freely and objectively?',
      verifyOptions: isAr
        ? ['نعم، أبحث عن الحقيقة وأستكشف', 'نعم، لدي تساؤلات أود فهمها', 'أنا مسلم بالفعل']
        : isUr
        ? ['جی ہاں، میں سچائی کی تلاش میں ہوں', 'جی ہاں، میرے کچھ سوالات ہیں', 'میں پہلے سے مسلمان ہوں']
        : ['Yes, seeking truth and exploring', 'Yes, I have questions to understand', 'I am already a Muslim'],
      curriculumOverview: isAr
        ? `أهلاً بك دوماً. مسارنا هنا يعتمد على العقلانية والمنطق والوضوح التام:
• مفهوم الخالق الواحد وغايات الوجود الإنساني.
• رسالة الإسلام ونبوة محمد ﷺ وبراهين القرآن الكريم.
• العدالة وحقوق الإنسان والأخلاق في الرؤية الإسلامية.
• الإجابة الصريحة عن الأسئلة والشبهات الشائعة.

هل ترغب في البدء معنا في المحور الأول؟`
        : `Welcome warmly. Our exploration is grounded in reason, logic, and clarity:
• The concept of the One Creator and the purpose of human existence.
• The message of Islam, Prophethood of Muhammad ﷺ, and Quranic proofs.
• Justice, human dignity, and universal ethics in the Islamic worldview.
• Objective, transparent answers to common questions and misconceptions.

Would you like to start with our first theme together?`,
      units: [
        {
          title: isAr ? 'مفهوم الخالق الواحد في الإسلام' : 'The Concept of God in Islam',
          part1: isAr
            ? 'الإسلام يؤكد أن هذا الكون البديع بنظامه الدقيق لم يأتِ صدفة، بل خلقه إله واحد قادر حكيم، ليس له ولد ولا شريك ولا مثيل، متصف بصفات الكمال والرحمة والعدل المطلق.'
            : 'Islam affirms that this meticulously ordered universe did not arise by mere chance, but was brought into being by One All-Wise Creator who has no offspring, partners, or equals, possessing absolute perfection, mercy, and justice.',
          clarityQuestion: (name: string) => isAr
            ? `هل هذه الرؤية واضحة ومنطقية لعقلك يا ${name}؟`
            : `Is this perspective clear and rational to your mind, ${name}?`,
          checkQuestion: isAr
            ? 'ما الذي يميز مفهوم الإله في الإسلام عن بقية التصورات الفلسفية المعقدة؟'
            : 'What distinguishes the Islamic concept of God from complex mythological or philosophical pantheons?',
          checkOptions: isAr
            ? [
                'أنه إله واحد كامل منزه عن الشبيه والولد، قريب يجيب دعاء عباده مباشرة دون وسائط',
                'أنه يحتاج إلى وسائط وشركاء لإدارة خلقه',
                'أنه خلق الكون وتركه عبثاً دون هداية'
              ]
            : [
                'He is One, transcendent, without partners or equals, close and directly answering all who pray to Him without intermediaries',
                'He requires intermediaries and partners to manage the universe',
                'He created the cosmos and left it haphazardly without guidance'
              ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => isAr
            ? `محاولة طيبة يا ${name}، وميزة الإسلام الكبرى هي التوحيد النقي الخالص: علاقة مباشرة بين الإنسان وخالقه دون صكوك ولا كهنوت.`
            : `Precisely, ${name}. The core beauty of Islamic monotheism is the direct relationship between human beings and their Creator without clergy or middlemen.`
        },
        {
          title: isAr ? 'القرآن الكريم: رسالة معجزة ومحفوظة' : 'The Holy Quran: A Preserved & Rational Message',
          part1: isAr
            ? 'القرآن الكريم هو كلام الله المنزل على نبيه محمد ﷺ، محفوظ بحروفه عبر 14 قرناً دون تبديل، يخاطب العقل ويدعو للتأمل والتفكر في الآفاق والأنفس، ويقدم منظومة حياة متكاملة.'
            : 'The Holy Quran is the revealed Word of God given to Prophet Muhammad ﷺ, preserved letter for letter across fourteen centuries without alteration, addressing the intellect and calling for contemplation in the cosmos and inner soul.',
          clarityQuestion: (name: string) => isAr
            ? `واضح لك هذا المحور يا ${name}؟ أو لديك استفسار حوله؟`
            : `Is this theme clear to you, ${name}, or do you have any question about it?`,
          checkQuestion: isAr
            ? 'ما هي الدعوة المتكررة التي يوجهها القرآن لقارئه في آياته الكريمة؟'
            : 'What is the recurring invitation the Quran extends to its readers throughout its verses?',
          checkOptions: isAr
            ? [
                'التفكر العقلي، والتدبر في ملكوت السماوات والأرض، ونبذ التقليد الأعمى',
                'إلغاء العقل وقبول كل شيء دون تفكير',
                'التعصب دون دليل'
              ]
            : [
                'Intellectual contemplation, reflecting upon nature and the heavens, and rejecting blind conformism',
                'Suspension of reason and uncritical belief',
                'Tribal prejudice without evidence'
              ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => isAr
            ? `محاولة حسنة يا ${name}، لكن القرآن يتميز بأنه أكثر كتاب يحث على التعقل: {أفلا يعقلون}، {أفلا يتدبرون}، وينبذ التقليد الأعمى.`
            : `Well noticed, ${name}. The Quran consistently challenges readers to reflect: {أفلا يعقلون} ("Will you not use reason?"), encouraging inquiry and rejecting blind following.`
        }
      ],
      quizQuestions: [
        {
          q: isAr ? 'ما هو أصل الإيمان في الرؤية الإسلامية؟' : 'What is the core basis of faith in the Islamic worldview?',
          options: isAr
            ? ['التوحيد الخالص لله الواحد الأحد دون شريك', 'تعدد الآلهة', 'إنكار الخالق']
            : ['Pure monotheism: One God without partners', 'Polytheism', 'Denial of a Creator'],
          correct: 0
        },
        {
          q: isAr ? 'كيف ينظر الإسلام إلى التساؤلات العقلية والبحث عن الحقيقة؟' : 'How does Islam regard intellectual inquiry and the search for truth?',
          options: isAr
            ? ['يرحب بها ويحث على التدبر والتفكر العقلاني', 'يحرم التفكير', 'يدعو للتقليد الأعمى']
            : ['Welcomes it and actively encourages reasoned contemplation', 'Forbids critical thinking', 'Demands blind imitation'],
          correct: 0
        }
      ],
      certSubtitle: isAr ? 'مسار الباحث عن الحقيقة: الحوار الموضوعي، أدلة التوحيد، ومقاصد الإسلام' : 'Truth Inquirer Path: Rational Dialogue, Evidences of Monotheism & Core Insights',
      certSubtitleAr: 'مسار الباحث عن الحقيقة: الحوار الموضوعي، أدلة التوحيد، ومقاصد الإسلام',
      certSubtitleEn: 'Truth Inquirer Path: Rational Dialogue, Evidences of Monotheism & Core Insights'
    },

    daiyah: {
      title: isAr ? 'مسار الداعية' : isUr ? 'داعی کا راستہ' : "Da'iyah & Educator Path",
      titleAr: 'مسار الداعية',
      titleEn: "Da'iyah & Educator Path",
      welcomeMsg: isAr
        ? 'السلام عليكم ورحمة الله وبركاته. أهلاً بك يا أخي الداعية في مسار التأهيل الدعوي الرصين. يسعدنا أن نكون عوناً لك في رحلتك المباركة. من أنت وما اسمك الكريم؟'
        : isUr
        ? 'السلام علیکم ورحمۃ اللہ وبرکاتہ۔ داعی کے راستے میں خوش آمدید۔ آپ کا اسم گرامی کیا ہے؟'
        : 'Peace and blessings be upon you. Welcome to the Da\'iyah & Educator Track! We are honored to accompany you in this noble endeavor. What is your name?',
      verifyQ: isAr
        ? 'هل تستعد أو تمارس الدعوة إلى الله والتعريف بالإسلام وتبحث عن أدوات محاكاة الحوار؟'
        : isUr
        ? 'کیا آپ دعوت دین اور مکالماتی مہارتوں کے لیے تیاری کر رہے ہیں؟'
        : 'Are you preparing for or active in Islamic outreach and dialogue, looking for simulation tools?',
      verifyOptions: isAr
        ? ['نعم، أمارس الدعوة وأبحث عن تطوير مهاراتي', 'نعم، أستعد للتعريف بالإسلام', 'أنا مجرد متصفح']
        : isUr
        ? ['جی ہاں، میں دعوت کا کام کرتا ہوں', 'جی ہاں، تیاری کر رہا ہوں', 'صرف مشاہدہ کر رہا ہوں']
        : ['Yes, active in outreach seeking development', 'Yes, preparing to present Islam', 'Just exploring'],
      curriculumOverview: isAr
        ? `حياك الله وبارك في همتك! مسارنا مصمم لإكسابك مهارات الدعوة المعاصرة:
• أصول البلاغ بالحكمة والموعظة الحسنة وفق هدي النبي ﷺ.
• فنون الحوار الحضاري وتفكيك الشبهات بالأدلة العقلية والنقلية.
• مهارات التوطين الثقافي ومراعاة أحوال المخاطبين.
• محاكاة سيناريوهات تفاعلية واقعية مع غير المسلمين والمهتدين.

هل أنت مستعد لننطلق معاً؟`
        : `Welcome! Our track is crafted to equip you with essential contemporary outreach competencies:
• The foundations of conveying truth with wisdom and gentle speech.
• Civilized dialogue and deconstructing misconceptions logically and scripturally.
• Cultural adaptation and understanding audience nuances.
• Interactive AI dialogue simulations with inquirers and new Muslims.

Are you ready to embark together?`,
      units: [
        {
          title: isAr ? 'أصول الدعوة بالحكمة' : 'Foundations of Da\'wah with Wisdom',
          part1: isAr
            ? 'الدعوة إلى الله شرف عظيم، وأساسها قوله تعالى: {ادع إلى سبيل ربك بالحكمة والموعظة الحسنة وجادلهم بالتي هي أحسن}. فالداعية طبيب يرجو الشفاء والهداية للناس، وليس قاضياً يحاكمهم.'
            : 'Outreach in Islam is a noble trust rooted in God\'s instruction: {ادع إلى سبيل ربك بالحكمة والموعظة الحسنة وجادلهم بالتي هي أحسن} ("Invite to the way of your Lord with wisdom and good instruction, and argue with them in a way that is best"). The caller is a compassionate physician seeking healing, not a punitive judge.',
          clarityQuestion: (name: string) => isAr
            ? `واضح لك يا أخي ${name} هذا الأصل المنهجي العظيم؟`
            : `Is this foundational principle clear to you, brother/sister ${name}?`,
          checkQuestion: isAr
            ? 'ما هو الهدف الأسمى للداعية في حواره مع الآخرين؟'
            : 'What is the highest objective of the educator/caller in dialogue with others?',
          checkOptions: isAr
            ? [
                'إيصال الحق برحمة وهداية القلوب ابتغاء وجه الله',
                'إفحام الطرف الآخر والانتصار للذات',
                'تحقيق الشهرة والمناظرات'
              ]
            : [
                'Conveying truth with mercy seeking guidance for hearts purely for God\'s pleasure',
                'Defeating the opponent and seeking personal triumph',
                'Gaining fame and debate popularity'
              ],
          correctOptionIndex: 0,
          correctionExplanation: (name: string) => isAr
            ? `أحسنت يا ${name}، فالمقصد هداية الناس وإنقاذهم، لا إفحامهم والانتصار عليهم.`
            : `Well said ${name}. The objective is guiding hearts and lifting burdens with compassion, not seeking personal triumph in debates.`
        }
      ],
      quizQuestions: [
        {
          q: isAr ? 'ما هو الهدف الأسمى للداعية في حواره مع الآخرين؟' : 'What is the highest objective of the caller in dialogue?',
          options: isAr
            ? ['إيصال الحق برحمة وهداية القلوب ابتغاء وجه الله', 'إفحام الطرف الآخر والانتصار للذات', 'تحقيق الشهرة والمناظرات']
            : ['Conveying truth with mercy seeking guidance for hearts for God\'s pleasure', 'Defeating the interlocutor for ego', 'Seeking online fame'],
          correct: 0
        },
        {
          q: isAr ? 'ما هو الأصل في الأسلوب الدعوي كما أمر الله في سورة النحل؟' : 'What is the primary method of outreach commanded by Allah in Surah An-Nahl?',
          options: isAr
            ? ['الحكمة والموعظة الحسنة والجدال بالتي هي أحسن', 'الشدة والغلظة والتوبيخ', 'التنازل عن ثوابت الدين']
            : ['Wisdom, good counsel, and arguing in the kindest manner', 'Harshness, rebuke, and severity', 'Compromising core tenets'],
          correct: 0
        }
      ],
      certSubtitle: isAr ? 'مسار الداعية: تأهيل مهارات البلاغ بالحكمة ومحاكاة الحوار الحضاري' : 'Da\'iyah Path: Wisdom-based Outreach & Civilized Dialogue Mastery',
      certSubtitleAr: 'مسار الداعية: تأهيل مهارات البلاغ بالحكمة ومحاكاة الحوار الحضاري',
      certSubtitleEn: 'Da\'iyah Path: Wisdom-based Outreach & Civilized Dialogue Mastery'
    }
  };

  return TRACKS[trackId] || TRACKS.muslim;
};
