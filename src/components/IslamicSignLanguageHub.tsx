import React, { useState, useEffect } from 'react';
import { 
  Hand, 
  Eye, 
  Sparkles, 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw, 
  Printer, 
  CheckCircle2, 
  Heart, 
  Info, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  Layers,
  ArrowRight,
  Activity,
  Compass,
  Check,
  Award,
  Zap,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { Language } from '../types';

interface SignItem {
  id: string;
  category: 'wudu' | 'salah' | 'pillars' | 'dhikr';
  titleAr: string;
  titleEn: string;
  signDescriptionAr: string;
  signDescriptionEn: string;
  handMovementTipsAr: string;
  handMovementTipsEn: string;
  meaningAr: string;
  meaningEn: string;
  badgeEmoji: string;
  source: string;
}

const SIGN_DICTIONARY: SignItem[] = [
  // 1. Wudu
  {
    id: 'wudu-01',
    category: 'wudu',
    titleAr: 'غسل الكفين عند ابتداء الوضوء',
    titleEn: 'Washing Hands to Wrists',
    signDescriptionAr: 'فرك راحتي اليدين معاً بحركة دائرية لطيفة من الرسغ إلى أطراف الأصابع مع تخلليلها.',
    signDescriptionEn: 'Rubbing both palms together in gentle circular motion from wrists to fingertips.',
    handMovementTipsAr: 'أشر باليدين مفرودتين مع تحريك الأصابع دلالة على إسباغ الماء وسريانه.',
    handMovementTipsEn: 'Spread hands and interlace fingers to signify water flow.',
    meaningAr: 'البدء بالنظافة واستحضار النية لنيل محبة الله وطهارة الجسد.',
    meaningEn: 'Starting with cleanliness and pure intention for spiritual purification.',
    badgeEmoji: '🤲',
    source: 'الدرر السنية: صفة وضوء النبي ﷺ'
  },
  {
    id: 'wudu-02',
    category: 'wudu',
    titleAr: 'المضمضة والاستنشاق',
    titleEn: 'Rinsing Mouth and Nose',
    signDescriptionAr: 'رفع الكف اليمنى نحو الفم ثم الأنف بحركة انسيابية تدل على إدخال الماء والتنظيف.',
    signDescriptionEn: 'Raising right palm toward mouth and nose smoothly indicating rinsing.',
    handMovementTipsAr: 'حركة اليد اليمنى مقوسة كالمغرفة تصعد نحو الوجه ثلاث مرات.',
    handMovementTipsEn: 'Curved right palm moving gently toward face 3 times.',
    meaningAr: 'صيانة الفم والأنف وطهارتهما للذكر وقراءة القرآن الكريم.',
    meaningEn: 'Purifying mouth and nostrils for reciting Quran and remembrance.',
    badgeEmoji: '💧',
    source: 'صحيح البخاري: حديث حمران مولى عثمان'
  },
  {
    id: 'wudu-03',
    category: 'wudu',
    titleAr: 'غسل الوجه واليدين إلى المرفقين',
    titleEn: 'Washing Face and Forearms',
    signDescriptionAr: 'إمرار الكفين على الوجه من منبت الشعر إلى الذقن، ثم إمرار اليد اليسرى على الذراع الأيمن إلى المرفق والعكس.',
    signDescriptionEn: 'Wiping face from hairline to chin, then rubbing right arm to elbow, followed by left.',
    handMovementTipsAr: 'حركة شاملة تغطي كامل مساحة الوجه والذراع من الأطراف للمرفقين.',
    handMovementTipsEn: 'Full sweeping motion covering entire face boundary and forearms.',
    meaningAr: 'نور الوجه والأطراف يوم القيامة بإسباغ الوضوء.',
    meaningEn: 'Radiance of limbs on the Day of Resurrection through thorough ablution.',
    badgeEmoji: '✨',
    source: 'مصحف مجمع الملك فهد: سورة المائدة (6)'
  },
  {
    id: 'wudu-04',
    category: 'wudu',
    titleAr: 'مسح الرأس وغسل الرجلين للكعبين',
    titleEn: 'Wiping Head and Washing Feet',
    signDescriptionAr: 'إمرار الكفين المبلولتين من مقدمة الرأس لمؤخرته ثم العودة، ثم غسل الرجلين مع تخلليل أصابع القدمين.',
    signDescriptionEn: 'Wiping head from front to back, then thorough washing of feet to ankles.',
    handMovementTipsAr: 'حركة مسح الرأس بخفة، ثم الإشارة إلى القدمين صعوداً للكعبين.',
    handMovementTipsEn: 'Light sweeping over head, followed by pointing to feet up to ankles.',
    meaningAr: 'استكمال الطهارة التامة للوقوف بين يدي الله في الصلاة.',
    meaningEn: 'Completing full ritual purity to stand before Allah in prayer.',
    badgeEmoji: '🦶',
    source: 'الدرر السنية: الفقه الميسر في ضوء الكتاب والسنة'
  },

  // 2. Salah Motions
  {
    id: 'salah-01',
    category: 'salah',
    titleAr: 'تكبيرة الإحرام والقيام',
    titleEn: 'Takbiratul Ihram & Standing (Qiyam)',
    signDescriptionAr: 'رفع اليدين حذو المنكبين أو الأذنين مع بسط الأصابع واستقبال القبلة، ثم وضع اليمنى على اليسرى فوق الصدر.',
    signDescriptionEn: 'Raising both hands level with shoulders or ears, facing Qiblah, then placing right over left on chest.',
    handMovementTipsAr: 'فتح الكفين للأمام بهدوء ووقار لافتتاح الدخول في حرم الصلاة.',
    handMovementTipsEn: 'Open palms facing forward with serenity entering sacred prayer.',
    meaningAr: 'إعلان عظمة الله والانقطاع عن كل شواغل الدنيا بالكلية.',
    meaningEn: 'Declaring Allah’s ultimate greatness and detaching from worldly distractions.',
    badgeEmoji: '🕋',
    source: 'صحيح البخاري: حديث المسيء صلاته'
  },
  {
    id: 'salah-02',
    category: 'salah',
    titleAr: 'الركوع والرفع منه',
    titleEn: 'Ruku (Bowing) & Standing Straight',
    signDescriptionAr: 'الانحناء بالظهر مستوياً ووضع الكفين مفرودتي الأصابع على الركبتين، ثم الاعتدال قائماً بطمأنينة.',
    signDescriptionEn: 'Bowing straight back, gripping knees with spread fingers, then rising upright calmly.',
    handMovementTipsAr: 'الإشارة بحرف الزاوية القائمة للإشارة إلى استواء الظهر، ثم رفع الكفين عند الرفع.',
    handMovementTipsEn: 'Right angle hand indicator signifying flat back, raising hands upon standing.',
    meaningAr: 'الخضوع والتعظيم التام لله الواحد القهار: «سبحان ربي العظيم».',
    meaningEn: 'Complete submission and glorification to Allah: Subhana Rabbiyal Azeem.',
    badgeEmoji: '📐',
    source: 'الدرر السنية: صفة صلاة النبي ﷺ'
  },
  {
    id: 'salah-03',
    category: 'salah',
    titleAr: 'السجود على الأعضاء السبعة',
    titleEn: 'Sujud (Prostration on 7 Limbs)',
    signDescriptionAr: 'وضع الجبهة والأنف والكفين والركبتين وأطراف القدمين على الأرض مع توجيه الأصابع للقبلة.',
    signDescriptionEn: 'Placing forehead, nose, two palms, two knees, and toes firmly on the ground facing Qiblah.',
    handMovementTipsAr: 'الإشارة بالأصابع السبعة ثم حركة النزول للأسفل إشعاراً بأعلى درجات التذلل لله.',
    handMovementTipsEn: 'Seven fingers sign, then descending motion indicating lowest humbling before Allah.',
    meaningAr: 'أقرب ما يكون العبد من ربه وهو ساجد: «سبحان ربي الأعلى».',
    meaningEn: 'The closest a servant is to their Lord is in prostration: Subhana Rabbiyal A’la.',
    badgeEmoji: '🙇',
    source: 'صحيح مسلم: حديث العباس بن عبد المطلب'
  },
  {
    id: 'salah-04',
    category: 'salah',
    titleAr: 'الجلوس للتشهد والتسليم',
    titleEn: 'Tashahhud & Tasleem (Salutation)',
    signDescriptionAr: 'الجلوس مفترشاً مع الإشارة بالسبابة اليمنى عند ذكر التوحيد، ثم الالتفات يميناً ويساراً للتسليم.',
    signDescriptionEn: 'Sitting calmly, raising right index finger at Tawhid declaration, then turning right and left with Tasleem.',
    handMovementTipsAr: 'عقد الأصابع والإشارة بالسبابة للأعلى (التوحيد)، ثم حركة الكف يميناً ويساراً للسلام.',
    handMovementTipsEn: 'Pointing index finger skyward (Tawhid), then palm waving right and left for peace.',
    meaningAr: 'الشهادة لله بالوحدانية ولنبيه بالرسالة، ونشر السلام والرحمة للعالمين.',
    meaningEn: 'Testimony of Allah’s oneness and Muhammad’s prophethood, spreading peace to all.',
    badgeEmoji: '🕊️',
    source: 'مجمع الملك فهد والدرر السنية'
  },

  // 3. Pillars
  {
    id: 'pillars-01',
    category: 'pillars',
    titleAr: 'شهادة أن لا إله إلا الله',
    titleEn: 'Shahadah (Oneness of Allah)',
    signDescriptionAr: 'رفع السبابة اليمنى نحو الأعلى بثبات مع وضع اليد اليسرى على القلب، للدلالة على وحدانية الخالق وتفرده.',
    signDescriptionEn: 'Raising right index finger steadily skyward while placing left hand on heart, denoting Tawhid.',
    handMovementTipsAr: 'حركة السبابة تشير للسماء، واليد الأخرى على الصدر للدلالة على الإيمان واليقين.',
    handMovementTipsEn: 'Index finger pointing upward, other hand over heart indicating conviction.',
    meaningAr: 'أصل الدين وإفراد الله بالعبادة ونفي الشريك عنه.',
    meaningEn: 'Core of faith: worshiping Allah alone with zero partners.',
    badgeEmoji: '☝️',
    source: 'مصحف مجمع الملك فهد: سورة الإخلاص'
  },
  {
    id: 'pillars-02',
    category: 'pillars',
    titleAr: 'إيتاء الزكاة والصدقة',
    titleEn: 'Zakah and Charity',
    signDescriptionAr: 'بسط الكف اليمنى ممتدة للأمام نحو كف اليد الأخرى كرمز للبذل والعطاء ومساندة الفقراء.',
    signDescriptionEn: 'Extending open right palm forward toward receiver’s palm symbolizing benevolent giving.',
    handMovementTipsAr: 'حركة العطاء من الصدر نحو الأمام بابتسامة وبشاشة.',
    handMovementTipsEn: 'Giving motion extending outward warmly.',
    meaningAr: 'تطهير المال ونشر التكافل والرحمة بين أفراد المجتمع المسلم.',
    meaningEn: 'Purifying wealth and fostering solidarity across the Muslim community.',
    badgeEmoji: '🎁',
    source: 'صحيح البخاري: بني الإسلام على خمس'
  },

  // 4. Dhikr
  {
    id: 'dhikr-01',
    category: 'dhikr',
    titleAr: 'التكبير (الله أكبر)',
    titleEn: 'Takbir (Allahu Akbar)',
    signDescriptionAr: 'رفع الكفين مبسوطتين إلى الأعلى بمحاذاة الرأس مع حركة صاعدة تدل على العلو والتعظيم.',
    signDescriptionEn: 'Raising both open palms upward level with head in ascending motion signifying supremacy.',
    handMovementTipsAr: 'حركة تصاعدية بالأيدي تعبر عن رفعة الله وعظمته فوق كل شيء.',
    handMovementTipsEn: 'Upward motion signifying Allah’s majesty above all creation.',
    meaningAr: 'الله أعظم من كل كبير، وأجل من كل عظيم في هذا الكون.',
    meaningEn: 'Allah is greater than everything in existence.',
    badgeEmoji: '🌌',
    source: 'الدرر السنية: موسوعة الأذكار والأدعية'
  },
  {
    id: 'dhikr-02',
    category: 'dhikr',
    titleAr: 'التسبيح والحمد (سبحان الله والحمد لله)',
    titleEn: 'Tasbeeh & Tahmeed',
    signDescriptionAr: 'عقد أنامل اليد اليمنى بالعد حبة حبة، أو ضم الكفين وفتحهما رمزاً للنقاء والثناء الدائم.',
    signDescriptionEn: 'Counting dhikr on right hand knuckles, or opening palms gently in gratitude.',
    handMovementTipsAr: 'استخدام الإبهام للمرور على مفاصل الأصابع الثلاثة لكل أصبع كما كان يفعل النبي ﷺ.',
    handMovementTipsEn: 'Using thumb to count on three joints of right fingers following Sunnah.',
    meaningAr: 'تنزيه الله عن كل نقص، وشكره الدائم على نعمه الظاهرة والباطنة.',
    meaningEn: 'Exalting Allah above deficiency and praising His limitless blessings.',
    badgeEmoji: '🌸',
    source: 'سنن أبي داود: كان يعقد التسبيح بيمينه'
  }
];

export interface VisualSalahMotion {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  angleLabelAr: string;
  angleLabelEn: string;
  keyPointsAr: string[];
  keyPointsEn: string[];
  selfCheckItemsAr: string[];
  selfCheckItemsEn: string[];
  signTipsAr: string;
  signTipsEn: string;
  evidenceAr: string;
  badgeEmoji: string;
  type: 'takbir' | 'ruku' | 'sujood' | 'jalsa' | 'tasleem';
}

export const SALAH_VISUAL_MOTIONS: VisualSalahMotion[] = [
  {
    id: 'motion-takbir',
    titleAr: '1. تكبيرة الإحرام والقيام (الافتتاح)',
    titleEn: '1. Takbiratul Ihram & Standing (Opening)',
    subtitleAr: 'الانقطاع عن كل شواغل الدنيا بالكلية وإعلان عظمة الخالق واستقبال القبلة',
    subtitleEn: 'Detaching from worldly concerns and declaring the ultimate greatness of Allah',
    angleLabelAr: '180° القبلة الشريفة',
    angleLabelEn: '180° Qiblah Direction',
    keyPointsAr: [
      'رفع اليدين حذو المنكبين أو الأذنين مع بسط الكفين واستقبال القبلة بها.',
      'الجهر بالتكبير لله عز وجل: «اللَّهُ أَكْبَرُ».',
      'وضع اليد اليمنى على اليسرى فوق الصدر أو أسفله بوقار وسكينة.'
    ],
    keyPointsEn: [
      'Raising palms to shoulder or ear level facing Qiblah.',
      'Pronouncing the opening Takbir: "Allahu Akbar".',
      'Placing the right hand over the left hand on the chest with reverence.'
    ],
    selfCheckItemsAr: [
      'هل الكفان متوجهتان تماماً للقبلة وبمستوى المنكبين/الأذنين؟',
      'هل وضع اليد اليمنى قَبْضاً على اليسرى فوق الصدر أو تحته؟',
      'هل البصر متوجه بنظر خاشع لموضع السجود؟'
    ],
    selfCheckItemsEn: [
      'Are both palms facing Qiblah level with shoulders/ears?',
      'Is the right hand clasping the left hand on the chest?',
      'Is your gaze focused calmly at the prostration spot?'
    ],
    signTipsAr: 'بسط الكفين مفرودتين للأمام بوقار ورفعهما لمنسوب الأذنين ثم ضمهما فوق الصدر.',
    signTipsEn: 'Open palms facing forward smoothly raised to shoulder/ear level then placed on chest.',
    evidenceAr: 'صحيح البخاري: «كَانَ النبيُّ ﷺ إذَا قَامَ لِلصَّلَاةِ رَفَعَ يَدَيْهِ حَتَّى يُحَاذِيَ بِهِمَا مَنْكِبَيْهِ»',
    badgeEmoji: '🕋',
    type: 'takbir'
  },
  {
    id: 'motion-ruku',
    titleAr: '2. الركوع والاعتدال منه',
    titleEn: '2. Bowing (Ruku) & Rising Straight',
    subtitleAr: 'استواء الظهر كالسطح وتعظيم الرب بالعزم والخضوع الإيماني',
    subtitleEn: 'Bowing with a perfectly flat 90° back in humility and exalting the Almighty',
    angleLabelAr: '90° ظهر مستوٍ كالمسطرة',
    angleLabelEn: '90° Perfectly Horizontal Back',
    keyPointsAr: [
      'الانحناء بالظهر حتى يستوي هيدروليكياً بحد زاوية 90 درجة.',
      'تمكين الكفين من الركبتين مع تفريج الأصابع كالممسك بهما.',
      'الرفع قائماً مع رفع اليدين وقول: «سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ».'
    ],
    keyPointsEn: [
      'Bowing horizontally until the back forms a straight 90° line.',
      'Gripping both knees firmly with spread fingers.',
      'Rising upright raising hands and reciting "Sami Allahu Liman Hamidah".'
    ],
    selfCheckItemsAr: [
      'هل الظهر والحديث مستويان على خط واحد كالمسطرة؟',
      'هل اليدان تقبضان على الركبتين بأصابع مفرودة؟',
      'هل تم قول «سبحان ربي العظيم» ثلاثاً بالطمأنينة؟'
    ],
    selfCheckItemsEn: [
      'Is your back forming a flat horizontal 90° line?',
      'Are your hands gripping both knees firmly with fingers spread?',
      'Did you recite Subhana Rabbiyal Azeem three times calmly?'
    ],
    signTipsAr: 'تشكيل زاوية قائمة بالأصابع للإشارة إلى استواء الظهر، ثم إمرار اليدين صعوداً للرفع.',
    signTipsEn: 'Forming a 90° angle indicator with fingers, then sweeping hands upward upon rising.',
    evidenceAr: 'صحيح مسلم: «وَإِذَا رَكَعَ لَمْ يُشْخِصْ رَأْسَهُ وَلَمْ يُصَوِّبْهُ وَلَكِنْ بَيْنَ ذَلِكَ»',
    badgeEmoji: '📐',
    type: 'ruku'
  },
  {
    id: 'motion-sujood',
    titleAr: '3. السجود على الأعضاء السبعة',
    titleEn: '3. Prostration (Sujood) on 7 Limbs',
    subtitleAr: 'أقرب ما يكون العبد من ربه وهو ساجد في خضوع وتذلل لله',
    subtitleEn: 'The ultimate state of closeness to Allah in complete prostration',
    angleLabelAr: '7 نقاط تماس بالأرض 🟢',
    angleLabelEn: '7 Limbs Ground Contact Points 🟢',
    keyPointsAr: [
      'تمكين الجبهة والأنف، الكفين، الركبتين، وأطراف أصابع القدمين بالأرض.',
      'جفاء العضدين عن الجنبين والبطن عن الفخذين دون إفراش الذراعين.',
      'استقبال القبلة بأطراف أصابع القدمين المنصوبة.'
    ],
    keyPointsEn: [
      'Firm contact of Forehead & Nose, 2 Palms, 2 Knees, and 2 Sets of Toes with the ground.',
      'Keeping forearms raised off the ground and arms away from torso.',
      'Pointing toes forward facing Qiblah.'
    ],
    selfCheckItemsAr: [
      'هل تمكّن الأنف والجبهة كعضو واحد من ملامسة الأرض؟',
      'هل الكفان موضوعتان بحذاء المنكبين مع رفع الذراعين؟',
      'هل أصابع القدمين منصوبتان ومتوجهتان نحو القبلة؟'
    ],
    selfCheckItemsEn: [
      'Are forehead and nose touching the ground together firmly?',
      'Are palms flat on ground with forearms raised up?',
      'Are toes erect pointing forward toward Qiblah?'
    ],
    signTipsAr: 'بسط الكفين مستويتين على الأرض مع مباعدة المرفقين وإبراز نقاط التماس السبع.',
    signTipsEn: 'Flat palms on the ground with elbows raised highlighting the 7 contact points.',
    evidenceAr: 'صحيح البخاري: «أُمِرْتُ أَنْ أَسْجُدَ عَلَى سَبْعَةِ أَعْظُمٍ: عَلَى الْجَبْهَةِ -وَأَشَارَ بِيَدِهِ عَلَى أَنْفِهِ- وَالْيَدَيْنِ، وَالرُّكْبَتَيْنِ، وَأَطْرَافِ الْقَدَمَيْنِ»',
    badgeEmoji: '🟢',
    type: 'sujood'
  },
  {
    id: 'motion-jalsa',
    titleAr: '4. الجلوس والتشهد بالإصبع (التوحيد)',
    titleEn: '4. Seated Tashahhud & Pointing Index Finger',
    subtitleAr: 'الافتراش الثابت وقراءة التحيات والثناء وتوحيد الله بالإشارة',
    subtitleEn: 'Peaceful seated posture reciting praises and pointing right index finger declaring Monotheism',
    angleLabelAr: '☝️ التشهيد بسبابة التوحيد',
    angleLabelEn: '☝️ Monotheism Index Pointing',
    keyPointsAr: [
      'الافتراش بالجلوس على القدم اليسرى ونصب القدم اليمنى.',
      'وضع الكف اليسرى على الركبة اليسرى، وعقد أصابع الكف اليمنى مع رفع السبابة.',
      'تحريك السبابة بلطف عند الدعاء والتشهد رمزاً لإفراد الله بالعبادة.'
    ],
    keyPointsEn: [
      'Sitting on the left foot (Iftirash) while keeping the right foot upright.',
      'Resting left palm on knee and curling right fingers with index extended.',
      'Gently moving the right index finger during Tashahhud symbolizing Monotheism.'
    ],
    selfCheckItemsAr: [
      'هل الجلوس مفترشاً على القدم اليسرى ونصب اليمنى؟',
      'هل اليد اليسرى مبسوطة على الركبة واليمنى معقودة؟',
      'هل الإشارة بالسبابة اليمنى ثابتة أو تحرك بلطف مع رمي البصر إليها؟'
    ],
    selfCheckItemsEn: [
      'Are you seated on left foot with right foot erect (Iftirash)?',
      'Is left palm resting flat on left knee?',
      'Is right index finger pointing skyward with gaze focused on it?'
    ],
    signTipsAr: 'رفع سبابة اليد اليمنى وتحريكها بلطف إشارة للتوحيد والثناء على الله وحده.',
    signTipsEn: 'Raising right index finger pointing upwards gently signifying One God.',
    evidenceAr: 'صحيح مسلم: «وَوَضَعَ كَفَّهُ الْيُمْنَى عَلَى فَخِذِهِ الْيُمْنَى، وَعَقَدَ أَصَابِعَهُ كُلَّهَا، وَأَشَارَ بِإِصْبَعِهِ الَّتِي تَلِي الإِبْهَامَ»',
    badgeEmoji: '☝️',
    type: 'jalsa'
  },
  {
    id: 'motion-tasleem',
    titleAr: '5. التسليم عن اليمين واليسار (الختام)',
    titleEn: '5. Tasleem Right & Left (Concluding Prayer)',
    subtitleAr: 'الالتفات الهادئ وإشاعة السلام على الملائكة والمسلمين',
    subtitleEn: 'Turning head smoothly right then left bestowing greetings of peace',
    angleLabelAr: '🔄 رؤية بياض الخد الأيمن والأيسر',
    angleLabelEn: '🔄 Turning Head Fully Right & Left',
    keyPointsAr: [
      'الالتفات عن اليمين حتى يُرى بياض الخد الأيمن وقول: «السَّلامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ».',
      'الالتفات عن اليسار بذات الصفة حتى يُرى بياض الخد الأيسر.',
      'استشعار السلام والسكينة وانقضاء فريضة الصلاة المباركة.'
    ],
    keyPointsEn: [
      'Turning head right until right cheek is visible saying "Assalamu Alaikum wa Rahmatullah".',
      'Turning head left until left cheek is visible repeating the greeting.',
      'Feeling divine serenity and concluding the sacred prayer.'
    ],
    selfCheckItemsAr: [
      'هل بدأ التسليم بالالتفات نحو اليمين أولاً بوضوح؟',
      'هل كان الالتفات كافياً بحيث يُرى بياض الخد خلفك؟',
      'هل تم استشعار إفشاء السلام والرحمة عند النطق والالتفات؟'
    ],
    selfCheckItemsEn: [
      'Did you turn fully to the right first clearly?',
      'Was the rotation enough so your cheek is visible from behind?',
      'Did you feel the tranquility of bestowing divine peace?'
    ],
    signTipsAr: 'حركة التفات هادئة بالرأس واليدين نحو اليمين ثم اليسار مع ابتسامة السلام.',
    signTipsEn: 'Smooth head turn right then left accompanied by gentle sweeping hands of peace.',
    evidenceAr: 'صحيح مسلم: «كَانَ يَسْلِمُ عَنْ يَمِينِهِ وَعَنْ شِمَالِهِ حَتَّى يُرَى بَيَاضُ خَدِّهِ»',
    badgeEmoji: '🕊️',
    type: 'tasleem'
  }
];

export const VisualSalahDiagram: React.FC<{
  type: 'takbir' | 'ruku' | 'sujood' | 'jalsa' | 'tasleem';
  isPlaying: boolean;
  isSlow: boolean;
  language: Language;
}> = ({ type, isPlaying, isSlow, language }) => {
  const isAr = language === 'ar';
  const animSpeedClass = isSlow ? 'duration-1000 animate-pulse' : 'duration-500 animate-pulse';

  return (
    <div className="relative w-full h-64 sm:h-72 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 rounded-3xl p-4 flex flex-col items-center justify-center border border-teal-800/60 overflow-hidden text-white select-none shadow-inner">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#2DD4BF_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

      {type === 'takbir' && (
        <div className="relative flex flex-col items-center justify-center">
          <svg className="w-48 h-48 sm:w-56 sm:h-56" viewBox="0 0 200 200" fill="none">
            {/* Qiblah Direction Light Beam */}
            <path d="M100 20 L100 180" stroke="#2DD4BF" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            
            {/* Head */}
            <circle cx="100" cy="45" r="16" fill="#134E4A" stroke="#2DD4BF" strokeWidth="2.5" />
            {/* Eyes looking down to Sujood spot */}
            <path d="M96 50 L92 56" stroke="#5EEAD4" strokeWidth="2" />
            <path d="M104 50 L108 56" stroke="#5EEAD4" strokeWidth="2" />

            {/* Torso */}
            <path d="M100 61 L100 120" stroke="#2DD4BF" strokeWidth="4" strokeLinecap="round" />

            {/* Legs */}
            <path d="M100 120 L82 180" stroke="#2DD4BF" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M100 120 L118 180" stroke="#2DD4BF" strokeWidth="3.5" strokeLinecap="round" />

            {/* Raised Arms & Open Palms */}
            {isPlaying ? (
              <g className={`transition-all ${animSpeedClass}`}>
                {/* Left Arm raised to ear */}
                <path d="M100 70 L70 65 L68 45" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <circle cx="68" cy="42" r="6" fill="#F59E0B" />
                
                {/* Right Arm raised to ear */}
                <path d="M100 70 L130 65 L132 45" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <circle cx="132" cy="42" r="6" fill="#F59E0B" />

                {/* Motion Elevation Arrows */}
                <path d="M60 60 L60 40 M60 40 L56 46 M60 40 L64 46" stroke="#F59E0B" strokeWidth="2" />
                <path d="M140 60 L140 40 M140 40 L136 46 M140 40 L144 46" stroke="#F59E0B" strokeWidth="2" />
              </g>
            ) : (
              <g>
                {/* Hands folded over chest */}
                <path d="M100 70 L80 85 L100 85" stroke="#2DD4BF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M100 70 L120 85 L100 85" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              </g>
            )}
          </svg>
          <div className="absolute bottom-2 text-center text-xs font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30">
            {isAr ? 'رفع اليدين حذو المنكبين مع بسط الكفين حيال القبلة' : 'Raising Palms to Shoulders Facing Qiblah'}
          </div>
        </div>
      )}

      {type === 'ruku' && (
        <div className="relative flex flex-col items-center justify-center">
          <svg className="w-52 h-48 sm:w-60 sm:h-56" viewBox="0 0 200 200" fill="none">
            {/* 90 Degree Angle Arc Indicator */}
            <path d="M70 100 A 30 30 0 0 1 100 70" stroke="#F59E0B" strokeWidth="2" strokeDasharray="2 2" fill="none" />
            <text x="82" y="80" fill="#F59E0B" fontSize="12" fontWeight="bold">90°</text>

            {/* Horizontal Flat Back */}
            <path d="M60 100 L125 100" stroke="#2DD4BF" strokeWidth="4" strokeLinecap="round" />
            
            {/* Head in line with back */}
            <circle cx="50" cy="100" r="14" fill="#134E4A" stroke="#2DD4BF" strokeWidth="2.5" />

            {/* Vertical Legs */}
            <path d="M125 100 L125 175" stroke="#2DD4BF" strokeWidth="4" strokeLinecap="round" />

            {/* Arms Holding Knees */}
            <path d="M85 100 L120 140" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="120" cy="140" r="5" fill="#F59E0B" />

            {/* Knees Indicator */}
            <circle cx="125" cy="140" r="7" stroke="#2DD4BF" strokeWidth="1.5" fill="none" />

            {isPlaying && (
              <path d="M60 90 L120 90" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" className={animSpeedClass} />
            )}
          </svg>
          <div className="absolute bottom-2 text-center text-xs font-bold text-teal-200 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30">
            {isAr ? 'استواء الظهر بزاية 90° وقبض الركبتين بأصابع مفرودة' : '90° Flat Horizontal Back & Gripping Knees'}
          </div>
        </div>
      )}

      {type === 'sujood' && (
        <div className="relative flex flex-col items-center justify-center">
          <svg className="w-56 h-48 sm:w-64 sm:h-56" viewBox="0 0 200 200" fill="none">
            {/* Ground Line */}
            <line x1="20" y1="160" x2="180" y2="160" stroke="#2DD4BF" strokeWidth="2.5" />

            {/* Prostrating Body Pose */}
            {/* Forehead/Nose touching ground */}
            <circle cx="55" cy="150" r="12" fill="#134E4A" stroke="#2DD4BF" strokeWidth="2" />
            
            {/* Torso angled up */}
            <path d="M62 142 L100 115 L140 140" stroke="#2DD4BF" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Arms raised away from ground */}
            <path d="M70 135 L68 158" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <path d="M85 135 L80 158" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />

            {/* Knees on ground */}
            <path d="M115 130 L120 158" stroke="#2DD4BF" strokeWidth="3.5" />

            {/* Feet / Toes erect touching ground */}
            <path d="M140 140 L155 158" stroke="#2DD4BF" strokeWidth="3.5" />

            {/* 🟢 7 GLOWING CONTACT POINTS */}
            {/* 1. Forehead & Nose */}
            <circle cx="52" cy="158" r="4" fill="#10B981" className="animate-ping opacity-75" />
            <circle cx="52" cy="158" r="4" fill="#10B981" />

            {/* 2 & 3. Hands */}
            <circle cx="68" cy="158" r="4" fill="#10B981" />
            <circle cx="80" cy="158" r="4" fill="#10B981" />

            {/* 4 & 5. Knees */}
            <circle cx="120" cy="158" r="4" fill="#10B981" />

            {/* 6 & 7. Toes */}
            <circle cx="155" cy="158" r="4" fill="#10B981" />
          </svg>
          <div className="absolute bottom-2 text-center text-xs font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isAr ? 'تمكين الأعضاء السبعة (الجبهة، الأكف، الركبتين، الأصابع)' : '7 Body Points Firmly Contacting Ground'}</span>
          </div>
        </div>
      )}

      {type === 'jalsa' && (
        <div className="relative flex flex-col items-center justify-center">
          <svg className="w-48 h-48 sm:w-56 sm:h-56" viewBox="0 0 200 200" fill="none">
            {/* Seated Figure */}
            <circle cx="100" cy="60" r="15" fill="#134E4A" stroke="#2DD4BF" strokeWidth="2.5" />
            <path d="M100 75 L100 130" stroke="#2DD4BF" strokeWidth="4" strokeLinecap="round" />
            
            {/* Folded legs sitting */}
            <path d="M100 130 L75 160 L125 160" stroke="#2DD4BF" strokeWidth="4" strokeLinecap="round" />

            {/* Left Arm resting flat */}
            <path d="M100 85 L78 120" stroke="#2DD4BF" strokeWidth="3" strokeLinecap="round" />

            {/* Right Arm resting with Pointing Index Finger */}
            <path d="M100 85 L122 115 L135 110" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
            
            {/* Glowing Pointing Finger */}
            <circle cx="138" cy="108" r="4" fill="#F59E0B" className={animSpeedClass} />
            <path d="M138 108 L150 100" stroke="#F59E0B" strokeWidth="2" strokeDasharray="2 2" />
            <text x="152" y="98" fill="#F59E0B" fontSize="11" fontWeight="bold">☝️ التوحيد</text>
          </svg>
          <div className="absolute bottom-2 text-center text-xs font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30">
            {isAr ? 'التشهيد بسبابة اليد اليمنى رمز التوحيد والإخلاص' : 'Pointing Right Index Finger Declaring Monotheism'}
          </div>
        </div>
      )}

      {type === 'tasleem' && (
        <div className="relative flex flex-col items-center justify-center">
          <svg className="w-48 h-48 sm:w-56 sm:h-56" viewBox="0 0 200 200" fill="none">
            {/* Head Turning Right */}
            {isPlaying ? (
              <g className={`transition-all ${animSpeedClass}`}>
                <ellipse cx="100" cy="65" rx="16" ry="14" fill="#134E4A" stroke="#F59E0B" strokeWidth="2.5" />
                {/* Nose pointing right */}
                <path d="M116 65 L124 67" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                {/* Rotation Motion Arc */}
                <path d="M90 40 A 25 25 0 0 1 125 45" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                <path d="M125 45 L120 40 M125 45 L120 50" stroke="#F59E0B" strokeWidth="2" />
              </g>
            ) : (
              <g>
                <circle cx="100" cy="65" r="16" fill="#134E4A" stroke="#2DD4BF" strokeWidth="2.5" />
              </g>
            )}

            <path d="M100 80 L100 135" stroke="#2DD4BF" strokeWidth="4" />
            <path d="M100 135 L80 165 L120 165" stroke="#2DD4BF" strokeWidth="4" />
          </svg>
          <div className="absolute bottom-2 text-center text-xs font-bold text-teal-200 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30">
            {isAr ? 'الالتفات بيمين وشمال: "السلام عليكم ورحمة الله"' : 'Turning Right then Left: Tasleem Greeting of Peace'}
          </div>
        </div>
      )}
    </div>
  );
};

interface IslamicSignLanguageHubProps {
  language: Language;
  onBackToMain?: () => void;
}

export const IslamicSignLanguageHub: React.FC<IslamicSignLanguageHubProps> = ({
  language,
  onBackToMain
}) => {
  const isAr = language === 'ar';
  const [hubMode, setHubMode] = useState<'dictionary' | 'visualMotions'>('visualMotions');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'wudu' | 'salah' | 'pillars' | 'dhikr'>('all');
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [isSlowMotion, setIsSlowMotion] = useState<boolean>(false);

  // Visual Salah Motion states
  const [activeMotionIndex, setActiveMotionIndex] = useState<number>(0);
  const [isPlayingMotionAnimation, setIsPlayingMotionAnimation] = useState<boolean>(true);
  const [isSlowMotionAnimation, setIsSlowMotionAnimation] = useState<boolean>(false);
  const [isAutoWalkthrough, setIsAutoWalkthrough] = useState<boolean>(false);

  // Self Checklists state
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('eilm_salah_self_check');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [completedMotions, setCompletedMotions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('eilm_salah_motions_completed');
      return saved ? JSON.parse(saved) : ['motion-takbir'];
    } catch {
      return ['motion-takbir'];
    }
  });

  const [completedSigns, setCompletedSigns] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('eilm_sign_completed');
      return saved ? JSON.parse(saved) : ['wudu-01'];
    } catch {
      return ['wudu-01'];
    }
  });

  // Auto-play walkthrough effect
  useEffect(() => {
    if (!isAutoWalkthrough) return;

    const intervalTime = isSlowMotionAnimation ? 7000 : 4500;
    const timer = setInterval(() => {
      setActiveMotionIndex(prev => (prev + 1) % SALAH_VISUAL_MOTIONS.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isAutoWalkthrough, isSlowMotionAnimation]);

  const filteredItems = SIGN_DICTIONARY.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const currentItem = filteredItems[activeItemIndex] || filteredItems[0];

  const handleToggleComplete = (id: string) => {
    setCompletedSigns(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('eilm_sign_completed', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const handleToggleMotionComplete = (id: string) => {
    setCompletedMotions(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('eilm_salah_motions_completed', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const handleToggleCheckItem = (checkKey: string) => {
    setCheckedItems(prev => {
      const next = { ...prev, [checkKey]: !prev[checkKey] };
      try {
        localStorage.setItem('eilm_salah_self_check', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const handlePrintGuide = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="${language}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8" />
  <title>${isAr ? 'دليل لغة الإشارة الإسلامي' : 'Islamic Sign Language Visual Guide'}</title>
  <style>
    @page { size: landscape; margin: 10mm; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Arabic', sans-serif;
      background-color: #042F2E;
      margin: 0;
      padding: 20px;
      color: #FFFFFF;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      direction: ${isAr ? 'rtl' : 'ltr'};
    }
    .guide-frame {
      border: 3px solid #2DD4BF;
      border-radius: 20px;
      background: #115E59;
      padding: 24px;
      color: #FFFFFF;
    }
    .guide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #2DD4BF;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .guide-title { font-size: 22px; font-weight: 800; color: #CCFBF1; }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .sign-card {
      background: #134E4A;
      border: 1px solid #2DD4BF;
      border-radius: 12px;
      padding: 12px;
      text-align: center;
    }
    .sign-emoji { font-size: 32px; margin-bottom: 6px; }
    .sign-name { font-weight: 800; font-size: 15px; color: #FFFFFF; }
    .sign-desc { font-size: 12px; color: #99F6E4; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="guide-frame">
    <div class="guide-header">
      <div>
        <div class="guide-title">${isAr ? 'دليل لغة الإشارة الإسلامي - منصة عِلم' : 'Islamic Sign Language Guide - ILM Platform'}</div>
        <div style="font-size: 12px; color: #99F6E4;">${isAr ? 'قاموس بصري ميسر لذوي الإعاقة السمعية' : 'Deaf and Hard-of-Hearing Inclusive Guide'}</div>
      </div>
      <div style="font-size: 20px; font-weight: bold;">🤟 عِلم</div>
    </div>
    <div class="card-grid">
      ${filteredItems.slice(0, 6).map((c: typeof filteredItems[0]) => `
        <div class="sign-card">
          <div class="sign-emoji">${c.badgeEmoji}</div>
          <div class="sign-name">${isAr ? c.titleAr : c.titleEn}</div>
          <div class="sign-desc">${isAr ? c.signDescriptionAr : c.signDescriptionEn}</div>
        </div>
      `).join('')}
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 300);
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30">
              <Hand className="w-3.5 h-3.5" />
              <span>{isAr ? 'الشمول الرقمي والتيسير لذوي الإعاقة السمعية' : 'Deaf & Hard of Hearing Inclusivity'}</span>
              <span className="bg-teal-400 text-teal-950 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold">WCAG 2.2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>{isAr ? 'مركز حركات الصلاة التفاعلي ولغة الإشارة' : 'Interactive Salah Movements & Sign Language Hub'}</span>
              <span className="text-2xl">🤟</span>
            </h1>
            <p className="text-sm text-teal-100/90 leading-relaxed">
              {isAr 
                ? 'قسم تفاعلي بصري متكامل يشرح حركات الصلاة الأساسية الخمس برسوم توضيحية متحركة، إرشادات الضبط الفقهي، وقاموس لغة الإشارة الميسر للصم وضعاف السمع.'
                : 'Interactive visual guide illustrating core prayer movements with animated vector posture diagrams, Sunnah alignment tips, and sign language dictionary.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handlePrintGuide}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
              title={isAr ? 'طباعة بطاقات لغة الإشارة' : 'Print Sign Cards'}
            >
              <Printer className="w-4 h-4 text-teal-300" />
              <span>{isAr ? 'طباعة الدليل' : 'Print Guide'}</span>
            </button>

            {onBackToMain && (
              <button
                onClick={onBackToMain}
                className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Section Switcher: Interactive Visual Prayer Movements vs Dictionary */}
      <div className="flex items-center justify-center p-1.5 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D6] max-w-xl mx-auto shadow-2xs">
        <button
          type="button"
          onClick={() => setHubMode('visualMotions')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            hubMode === 'visualMotions'
              ? 'bg-gradient-to-r from-amber-700 to-amber-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{isAr ? 'حركات الصلاة التفاعلية المصورة' : 'Interactive Salah Visuals'}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full font-extrabold bg-amber-400 text-amber-950">
            {isAr ? 'تفاعلي' : 'Interactive'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setHubMode('dictionary')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            hubMode === 'dictionary'
              ? 'bg-teal-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Hand className="w-4 h-4 text-teal-300" />
          <span>{isAr ? 'قاموس الإشارة (12 مصطلح)' : 'Sign Dictionary'}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: INTERACTIVE VISUAL PRAYER MOVEMENTS (NEW & ENHANCED) */}
      {/* ========================================================= */}
      {hubMode === 'visualMotions' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Auto-Walkthrough Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 border border-amber-300">
                <Zap className="w-5 h-5 text-amber-700 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 font-serif">
                  {isAr ? 'عرض الصلاة التفاعلي التتابعي (Auto-Walkthrough)' : 'Automated Interactive Prayer Flow Walkthrough'}
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {isAr 
                    ? 'شاهد حركات الصلاة الخمس تتنقل تلقائياً بخطوات متسلسلة مع الرسوم الموضحة للتعلم السريع' 
                    : 'Watch the five core prayer movements sequence automatically with animated diagrams.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAutoWalkthrough(!isAutoWalkthrough)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs border ${
                  isAutoWalkthrough 
                    ? 'bg-amber-800 text-white border-amber-900 ring-2 ring-amber-400/50' 
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-amber-100'
                }`}
              >
                {isAutoWalkthrough ? <Pause className="w-4 h-4 text-amber-300" /> : <Play className="w-4 h-4 text-amber-700" />}
                <span>{isAutoWalkthrough ? (isAr ? 'إيقاف التتابع الآلي' : 'Pause Auto Walkthrough') : (isAr ? '▶ تشغيل التتابع الآلي' : '▶ Start Auto Walkthrough')}</span>
              </button>
            </div>
          </div>

          {/* Motion Steps Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SALAH_VISUAL_MOTIONS.map((motion, idx) => {
              const isSelected = idx === activeMotionIndex;
              const isDone = completedMotions.includes(motion.id);
              return (
                <button
                  key={motion.id}
                  onClick={() => {
                    setActiveMotionIndex(idx);
                    setIsAutoWalkthrough(false);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-400/40'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-white text-slate-700 hover:bg-amber-50 border-[#EAE3D6]'
                  }`}
                >
                  <span className="text-base">{motion.badgeEmoji}</span>
                  <span>{isAr ? motion.titleAr : motion.titleEn}</span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {/* Active Visual Motion Stage Display */}
          {SALAH_VISUAL_MOTIONS[activeMotionIndex] && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left/Center 7 Cols: Vector Pose Animation & Detailed Guide */}
              <div className="lg:col-span-7 bg-[#FAF7F2] rounded-3xl border border-[#EAE3D6] p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-amber-100 text-amber-950 border border-amber-300">
                      {SALAH_VISUAL_MOTIONS[activeMotionIndex].badgeEmoji}
                    </span>
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-serif">
                        {isAr ? SALAH_VISUAL_MOTIONS[activeMotionIndex].titleAr : SALAH_VISUAL_MOTIONS[activeMotionIndex].titleEn}
                      </h2>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {isAr ? SALAH_VISUAL_MOTIONS[activeMotionIndex].subtitleAr : SALAH_VISUAL_MOTIONS[activeMotionIndex].subtitleEn}
                      </p>
                    </div>
                  </div>

                  {/* Angle & Alignment Gauge Badge */}
                  <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold border border-teal-300 shadow-2xs">
                    {isAr ? SALAH_VISUAL_MOTIONS[activeMotionIndex].angleLabelAr : SALAH_VISUAL_MOTIONS[activeMotionIndex].angleLabelEn}
                  </span>
                </div>

                {/* Animated Vector Figure Pose Diagram */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-amber-600" />
                      <span>{isAr ? 'الرسم التوضيحي المتحرك لهيئة الحركة:' : 'Animated Pose Diagram:'}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Play / Pause Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsPlayingMotionAnimation(!isPlayingMotionAnimation)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                          isPlayingMotionAnimation
                            ? 'bg-amber-700 text-white border-amber-800'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {isPlayingMotionAnimation ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isPlayingMotionAnimation ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? 'تشغيل' : 'Play')}</span>
                      </button>

                      {/* Slow Motion Speed Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsSlowMotionAnimation(!isSlowMotionAnimation)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                          isSlowMotionAnimation
                            ? 'bg-teal-700 text-white border-teal-800'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                        title={isAr ? 'عرض متأنٍ بطيء للتطبيق' : 'Slow motion 0.5x'}
                      >
                        <span>{isSlowMotionAnimation ? (isAr ? 'عرض بطيء 0.5x ✓' : 'Slow 0.5x ✓') : (isAr ? 'سرعة عادية' : 'Normal')}</span>
                      </button>
                    </div>
                  </div>

                  <VisualSalahDiagram
                    type={SALAH_VISUAL_MOTIONS[activeMotionIndex].type}
                    isPlaying={isPlayingMotionAnimation}
                    isSlow={isSlowMotionAnimation}
                    language={language}
                  />
                </div>

                {/* Key Posture Bullet Points */}
                <div className="p-4 rounded-2xl bg-white border border-[#EAE3D6] space-y-2.5">
                  <span className="text-xs font-bold text-slate-900 block font-serif">
                    {isAr ? '📌 الضوابط الفقهية والصفة الصحيحة للحركة:' : '📌 Key Posture Guidelines:'}
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed font-sans">
                    {(isAr ? SALAH_VISUAL_MOTIONS[activeMotionIndex].keyPointsAr : SALAH_VISUAL_MOTIONS[activeMotionIndex].keyPointsEn).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Self-Checklist for Learner */}
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-amber-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5 font-serif">
                      <CheckCircle2 className="w-4 h-4 text-amber-700" />
                      <span>{isAr ? 'اختبار الذات الضابط للحركة (Self-Checklist):' : 'Interactive Posture Self-Checklist:'}</span>
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      {isAr ? 'اضغط للتحقق' : 'Click to check'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(isAr ? SALAH_VISUAL_MOTIONS[activeMotionIndex].selfCheckItemsAr : SALAH_VISUAL_MOTIONS[activeMotionIndex].selfCheckItemsEn).map((itemText, cIdx) => {
                      const checkKey = `${SALAH_VISUAL_MOTIONS[activeMotionIndex].id}_item_${cIdx}`;
                      const isChecked = !!checkedItems[checkKey];
                      return (
                        <button
                          key={checkKey}
                          type="button"
                          onClick={() => handleToggleCheckItem(checkKey)}
                          className={`w-full text-right p-2.5 rounded-xl border text-xs font-medium transition flex items-center gap-2.5 cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50/50'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{itemText}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Deaf Sign Language Gesture Tips */}
                <div className="p-4 rounded-2xl bg-teal-900 text-white border border-teal-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Hand className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'إرشادات التعبير الإشاري للصم وضعاف السمع:' : 'Deaf Sign Gesture Explanation:'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                    {isAr ? SALAH_VISUAL_MOTIONS[activeMotionIndex].signTipsAr : SALAH_VISUAL_MOTIONS[activeMotionIndex].signTipsEn}
                  </p>
                </div>

                {/* Evidence Badge */}
                <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-600 flex items-center justify-between border border-slate-200">
                  <span className="font-semibold">{isAr ? 'الدليل والتخريج الشرعي المعتمد:' : 'Authentic Reference:'}</span>
                  <span className="font-bold text-amber-900 font-serif">{SALAH_VISUAL_MOTIONS[activeMotionIndex].evidenceAr}</span>
                </div>

                {/* Mastery Toggle & Navigation */}
                <div className="flex items-center justify-between pt-2 border-t border-[#EAE3D6]">
                  <button
                    type="button"
                    onClick={() => handleToggleMotionComplete(SALAH_VISUAL_MOTIONS[activeMotionIndex].id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      completedMotions.includes(SALAH_VISUAL_MOTIONS[activeMotionIndex].id)
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {completedMotions.includes(SALAH_VISUAL_MOTIONS[activeMotionIndex].id)
                        ? (isAr ? 'تم إتقان الحركة ✓' : 'Motion Mastered ✓')
                        : (isAr ? 'تحديد كـ "تم الإتقان"' : 'Mark as Mastered')}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={activeMotionIndex === 0}
                      onClick={() => {
                        setActiveMotionIndex(prev => Math.max(0, prev - 1));
                        setIsAutoWalkthrough(false);
                      }}
                      className="p-2 rounded-xl bg-white border border-slate-300 disabled:opacity-40 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title={isAr ? 'الحركة السابقة' : 'Previous Motion'}
                    >
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </button>

                    <span className="text-xs font-mono font-bold text-slate-700 px-2">
                      {activeMotionIndex + 1} / {SALAH_VISUAL_MOTIONS.length}
                    </span>

                    <button
                      type="button"
                      disabled={activeMotionIndex >= SALAH_VISUAL_MOTIONS.length - 1}
                      onClick={() => {
                        setActiveMotionIndex(prev => Math.min(SALAH_VISUAL_MOTIONS.length - 1, prev + 1));
                        setIsAutoWalkthrough(false);
                      }}
                      className="p-2 rounded-xl bg-white border border-slate-300 disabled:opacity-40 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title={isAr ? 'الحركة التالية' : 'Next Motion'}
                    >
                      <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Side 5 Cols: Posture Index & Mastery Tracker */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EAE3D6] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-700" />
                    <span>{isAr ? 'فهرس حركات الصلاة الأساسية' : 'Salah Motion Index'}</span>
                  </h3>
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    {completedMotions.length} / {SALAH_VISUAL_MOTIONS.length} {isAr ? 'متقن' : 'Learned'}
                  </span>
                </div>

                <div className="space-y-2">
                  {SALAH_VISUAL_MOTIONS.map((motion, idx) => {
                    const isSelected = idx === activeMotionIndex;
                    const isDone = completedMotions.includes(motion.id);
                    return (
                      <div
                        key={motion.id}
                        onClick={() => {
                          setActiveMotionIndex(idx);
                          setIsAutoWalkthrough(false);
                        }}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 shadow-2xs ring-1 ring-amber-300'
                            : 'bg-[#FAF7F2] border-[#EAE3D6] hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl shrink-0">{motion.badgeEmoji}</span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate font-serif">
                              {isAr ? motion.titleAr : motion.titleEn}
                            </h4>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">
                              {isAr ? motion.angleLabelAr : motion.angleLabelEn}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Accessibility Guidance Card */}
                <div className="p-3.5 rounded-2xl bg-teal-900 text-white border border-teal-800 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'رعاية الشمول وتيسير الصلاة للصم:' : 'Prayer Accessibility Guidance:'}</span>
                  </div>
                  <p className="text-teal-100/90 leading-relaxed text-[10px]">
                    {isAr
                      ? 'تم تحرير التوصيف الحركي والبصري وفق الأحكام الفقهية المعتمدة لصفة صلاة النبي ﷺ مع مراعاة متطلبات التجربة البصرية للصم وضعاف السمع.'
                      : 'The motion illustrations strictly follow authentic Sunnah guidelines, tailored for visual learning clarity.'}
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: ISLAMIC SIGN LANGUAGE DICTIONARY               */}
      {/* ========================================================= */}
      {hubMode === 'dictionary' && (
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', labelAr: '🌟 جميع المصطلحات', labelEn: 'All Signs' },
              { id: 'wudu', labelAr: '💧 خطوات الوضوء', labelEn: 'Wudu Steps' },
              { id: 'salah', labelAr: '🕌 حركات الصلاة', labelEn: 'Salah Postures' },
              { id: 'pillars', labelAr: '☝️ أركان الإسلام', labelEn: 'Pillars' },
              { id: 'dhikr', labelAr: '🌸 الأذكار والتسبيح', labelEn: 'Dhikr' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id as any);
                  setActiveItemIndex(0);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-teal-900 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-teal-50 border border-[#EAE3D6]'
                }`}
              >
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
              </button>
            ))}
          </div>

          {/* Main Interactive Stage Display */}
          {currentItem && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Visual Sign Demonstration Card (Left/Center 7 cols) */}
              <div className="lg:col-span-7 bg-[#FAF7F2] rounded-3xl border border-[#EAE3D6] p-6 sm:p-8 shadow-sm space-y-6">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-teal-100 text-teal-900 border border-teal-200">
                      {currentItem.badgeEmoji}
                    </span>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                        {isAr ? currentItem.titleAr : currentItem.titleEn}
                      </h2>
                      <span className="text-xs text-teal-800 font-semibold">
                        {currentItem.category === 'wudu' ? (isAr ? 'الطهارة والوضوء' : 'Purification') :
                         currentItem.category === 'salah' ? (isAr ? 'صفة الصلاة' : 'Prayer Posture') :
                         currentItem.category === 'pillars' ? (isAr ? 'الأركان العظام' : 'Pillar') : (isAr ? 'الذكر والثناء' : 'Remembrance')}
                      </span>
                    </div>
                  </div>

                  {/* Slow-motion View Switch */}
                  <button
                    onClick={() => setIsSlowMotion(!isSlowMotion)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                      isSlowMotion 
                        ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                    title={isAr ? 'عرض الحركة بالتأني البطيء للتدرب' : 'Slow-motion learning pace'}
                  >
                    {isSlowMotion ? <Pause className="w-3.5 h-3.5 text-amber-700" /> : <Play className="w-3.5 h-3.5 text-slate-600" />}
                    <span>{isAr ? 'عرض متأنٍ' : 'Slow Motion'}</span>
                  </button>
                </div>

                {/* High-Contrast Visual Sign Animation Mock & Instruction Box */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-slate-800 min-h-[220px] flex flex-col justify-between">
                  <div className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Visual Sign Description
                  </div>

                  <div className="space-y-4 my-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0">
                        <Hand className="w-6 h-6 animate-pulse" />
                      </div>
                      <p className="text-base sm:text-lg font-bold text-teal-200 leading-relaxed">
                        {isAr ? currentItem.signDescriptionAr : currentItem.signDescriptionEn}
                      </p>
                    </div>

                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                      <span className="text-[11px] font-bold text-amber-400 block mb-1">
                        {isAr ? '💡 إرشادات توجيه اليدين والأصابع:' : '💡 Hand & Finger Movement Guide:'}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {isAr ? currentItem.handMovementTipsAr : currentItem.handMovementTipsEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800 mt-4">
                    <span>{isAr ? 'إسناد شرعي موثق' : 'Verified Islamic Evidence'}</span>
                    <span className="text-teal-400 font-semibold">{currentItem.source}</span>
                  </div>
                </div>

                {/* Spiritual Meaning & Wisdom */}
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <Heart className="w-4 h-4 text-emerald-700" />
                    <span>{isAr ? 'المقصد الإيماني والأثر الروحي:' : 'Spiritual Wisdom & Meaning:'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
                    {isAr ? currentItem.meaningAr : currentItem.meaningEn}
                  </p>
                </div>

                {/* Completion & Next/Prev Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-[#EAE3D6]">
                  <button
                    onClick={() => handleToggleComplete(currentItem.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      completedSigns.includes(currentItem.id)
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{completedSigns.includes(currentItem.id) ? (isAr ? 'تم إتقان الإشارة ✓' : 'Mastered ✓') : (isAr ? 'تحديد كـ "مُتقن"' : 'Mark Mastered')}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={activeItemIndex === 0}
                      onClick={() => setActiveItemIndex(prev => Math.max(0, prev - 1))}
                      className="p-2 rounded-xl bg-white border border-slate-300 disabled:opacity-40 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title={isAr ? 'المصطلح السابق' : 'Previous'}
                    >
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </button>

                    <span className="text-xs font-mono text-slate-600 font-bold px-2">
                      {activeItemIndex + 1} / {filteredItems.length}
                    </span>

                    <button
                      disabled={activeItemIndex >= filteredItems.length - 1}
                      onClick={() => setActiveItemIndex(prev => Math.min(filteredItems.length - 1, prev + 1))}
                      className="p-2 rounded-xl bg-white border border-slate-300 disabled:opacity-40 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title={isAr ? 'المصطلح التالي' : 'Next'}
                    >
                      <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Signs Quick Selector List (Right 5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EAE3D6] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-700" />
                    <span>{isAr ? 'قائمة الحركات والمصطلحات' : 'Visual Index'}</span>
                  </h3>
                  <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    {completedSigns.length} / {SIGN_DICTIONARY.length} {isAr ? 'متقن' : 'Learned'}
                  </span>
                </div>

                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {filteredItems.map((item, idx) => {
                    const isSelected = item.id === currentItem.id;
                    const isDone = completedSigns.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveItemIndex(idx)}
                        className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected 
                            ? 'bg-teal-50/90 border-teal-600 shadow-2xs' 
                            : 'bg-[#FAF7F2] border-[#EAE3D6] hover:border-teal-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg shrink-0">{item.badgeEmoji}</span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {isAr ? item.titleAr : item.titleEn}
                            </h4>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">
                              {isAr ? item.signDescriptionAr : item.signDescriptionEn}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Accessibility Note */}
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200/80 text-[11px] text-teal-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>{isAr ? 'تم مراجعة التوصيف الإشاري مع القواميس المعتمدة بلغة الإشارة العربية والإسلامية.' : 'Aligned with recognized Arabic Islamic Sign Language standards.'}</span>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
