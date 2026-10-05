import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { 
  Heart, 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  Award, 
  Share2, 
  Check, 
  BookOpen, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  Flame, 
  HelpCircle,
  MessageCircle,
  ExternalLink,
  Gift,
  Sun,
  Moon,
  Info,
  Bell,
  BellRing,
  BellOff,
  Clock,
  Settings,
  Sunrise,
  Sunset,
  VolumeX,
  Play,
  Plus,
  Trash2,
  Calendar,
  Compass
} from 'lucide-react';
import { playTapSound, playSuccessSound } from '../utils/platformSounds';
import { awardXP, getStoredXP, getLearnerProfile } from '../utils/xpManager';

interface DhikrSanctuaryProps {
  language: Language;
  onBack: () => void;
  onNavigateToAchievements?: () => void;
}

export interface CustomDhikrAlert {
  id: string;
  titleAr: string;
  titleEn: string;
  time: string; // "HH:MM" 24h
  enabled: boolean;
  category: 'morning' | 'evening' | 'istighfar' | 'salawat' | 'sadaqah' | 'sleep' | 'duha' | 'night' | 'daily' | 'custom';
  repeatDays?: number[]; // [0,1,2,3,4,5,6], e.g. [5] = Friday only
}

export const DEFAULT_CUSTOM_ALERTS: CustomDhikrAlert[] = [
  {
    id: 'duha-reminder',
    titleAr: 'صلاة الضحى والأذكار',
    titleEn: 'Duha Prayer & Remembrance',
    time: '09:30',
    enabled: true,
    category: 'duha'
  },
  {
    id: 'friday-salawat',
    titleAr: 'الصلاة على النبي ﷺ (ساعة الإجابة)',
    titleEn: 'Friday Salawat upon the Prophet ﷺ',
    time: '14:30',
    enabled: true,
    category: 'salawat',
    repeatDays: [5] // Friday
  },
  {
    id: 'sleep-adhkar',
    titleAr: 'أذكار النوم وسورة الملك',
    titleEn: 'Bedtime Adhkar & Protection',
    time: '22:30',
    enabled: true,
    category: 'sleep'
  },
  {
    id: 'tahajjud-istighfar',
    titleAr: 'استغفار الأسحار وقيام الليل',
    titleEn: 'Pre-Dawn Istighfar & Peace',
    time: '04:00',
    enabled: false,
    category: 'night'
  }
];

export interface DhikrReminderSettings {
  enabled: boolean;
  morningEnabled: boolean;
  morningTime: string; // e.g. "06:30"
  eveningEnabled: boolean;
  eveningTime: string; // e.g. "17:30"
  soundEnabled: boolean;
  browserNotifications: boolean;
  customAlerts: CustomDhikrAlert[];
}

export const DEFAULT_REMINDER_SETTINGS: DhikrReminderSettings = {
  enabled: true,
  morningEnabled: true,
  morningTime: '06:30',
  eveningEnabled: true,
  eveningTime: '17:30',
  soundEnabled: true,
  browserNotifications: false,
  customAlerts: DEFAULT_CUSTOM_ALERTS
};

export interface DhikrItem {
  id: string;
  category: 'istighfar' | 'salawat' | 'sadaqah' | 'morning' | 'evening' | 'daily' | 'occasions';
  occasionType?: 'travel' | 'waking' | 'home' | 'mosque' | 'distress' | 'nature' | 'social' | 'eating';
  occasionLabelAr?: string;
  occasionLabelEn?: string;
  arabic: string;
  transliteration: string;
  translationEn: string;
  translationUr: string;
  virtueAr: string;
  virtueEn: string;
  reference: string;
  recommendedCount: number;
  newMuslimTipAr: string;
  newMuslimTipEn: string;
  period?: 'morning' | 'evening' | 'both';
}

const DHIKR_ITEMS: DhikrItem[] = [
  // 📿 الاستغفار والتوبة
  {
    id: 'sayyid-istighfar',
    category: 'istighfar',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allahumma Anta Rabbi la ilaha illa Ant, khalaqtani wa ana abduk, wa ana ala ahdika wa wa\'dika mastata\'t, a\'udhu bika min sharri ma sana\'t, abu\'u laka bi ni\'matika alayya, wa abu\'u bi dhanbi faghfir li, fa innahu la yaghfiru adh-dhunuba illa Ant.',
    translationEn: 'O Allah, You are my Lord, none has the right to be worshiped but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favors upon me, and I confess my sins, so forgive me, for none forgives sins except You.',
    translationUr: 'اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں۔',
    virtueAr: 'سيد الاستغفار: من قاله موقناً به حين يمسي فمات دخل الجنة، ومن قاله موقناً به حين يصبح فمات من يومه دخل الجنة.',
    virtueEn: 'The Master Supplication for Forgiveness: Whoever says it with conviction in the evening and dies enters Paradise, and likewise in the morning.',
    reference: 'صحيح البخاري (6306)',
    recommendedCount: 1,
    newMuslimTipAr: 'يُسمى سيد الاستغفار لأنه يجمع الاعتراف بربوبية الله، ونعمه، والتواضع التام، وطلب المغفرة بصدق.',
    newMuslimTipEn: 'Called the Master of Forgiveness because it encompasses acknowledging God\'s Lordship, His countless gifts, and our sincere humility.'
  },
  {
    id: 'istighfar-hundred',
    category: 'istighfar',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullaha wa atoobu ilayh.',
    translationEn: 'I seek the forgiveness of Allah and I turn to Him in sincere repentance.',
    translationUr: 'میں اللہ سے بخشش مانگتا ہوں اور اسی کی طرف رجوع کرتا ہوں۔',
    virtueAr: 'كان رسول الله ﷺ يستغفر الله ويتوب إليه في اليوم أكثر من سبعين مرة، وفي رواية: مائة مرة.',
    virtueEn: 'The Prophet ﷺ sought forgiveness and turned to Allah more than seventy times, and in another narration, 100 times daily.',
    reference: 'صحيح البخاري (6307) وصحيح مسلم (2702)',
    recommendedCount: 100,
    newMuslimTipAr: 'الاستغفار ليس للمذنبين فقط، بل هو طهارة يومية للروح وجالب للرزق وراحة البال.',
    newMuslimTipEn: 'Seeking forgiveness is not only for mistakes; it is a daily spiritual cleansing that brings inner peace and sustenance.'
  },
  {
    id: 'yunus-dua',
    category: 'istighfar',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa Anta subhanaka inni kuntu mina adh-dhalimeen.',
    translationEn: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    translationUr: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ہی ظالموں میں سے تھا۔',
    virtueAr: 'دعوة ذي النون إذ دعا وهو في بطن الحوت؛ ما دعا بها رجل مسلم في شيء قط إلا استجاب الله له.',
    virtueEn: 'The supplication of Yunus (Jonah) in the belly of the whale; no Muslim supplicates with it for anything except Allah responds.',
    reference: 'جامع الترمذي (3505) - صحيح',
    recommendedCount: 33,
    newMuslimTipAr: 'دعاء كاشف للكرب ومزيل للهموم والحزن عند الشدائد.',
    newMuslimTipEn: 'A powerful supplication to relieve distress, anxiety, and hardship.'
  },

  // 💚 الصلاة على النبي ﷺ
  {
    id: 'salawat-ibrahimiyyah',
    category: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: 'Allahumma salli \'ala Muhammadin wa \'ala ali Muhammad, kama sallayta \'ala Ibrahima wa \'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik \'ala Muhammadin wa \'ala ali Muhammad, kama barakta \'ala Ibrahima wa \'ala ali Ibrahim, innaka Hamidun Majid.',
    translationEn: 'O Allah, bestow peace upon Muhammad and the family of Muhammad, as You bestowed peace upon Abraham and the family of Abraham; You are Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Abraham and the family of Abraham; You are Praiseworthy, Glorious.',
    translationUr: 'اے اللہ! محمد (ﷺ) اور ان کی آل پر رحمت نازل فرما، جیسے تو نے ابراہیم (علیہ السلام) اور ان کی آل پر رحمت نازل فرمائی۔',
    virtueAr: 'أكمل صيغ الصلاة على النبي وأفضلها، وهي التي تقال في التشهد الأخير في الصلاة المفروضة.',
    virtueEn: 'The most complete and exalted formula of sending blessings upon the Prophet ﷺ, recited during daily prayer.',
    reference: 'صحيح البخاري (3370)',
    recommendedCount: 10,
    newMuslimTipAr: 'أكمل صيغة للصلاة على النبي؛ علمها الرسول ﷺ لأصحابه مباشرة عندما سألوه كيف نصلّي عليك.',
    newMuslimTipEn: 'The exact wording the Prophet ﷺ taught his companions when they asked how to send blessings upon him.'
  },
  {
    id: 'salawat-short',
    category: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    transliteration: 'Allahumma salli wa sallim wa barik \'ala Nabiyyina Muhammad.',
    translationEn: 'O Allah, send blessings, peace, and abundance upon our Prophet Muhammad.',
    translationUr: 'اے اللہ! ہمارے نبی محمد (ﷺ) پر رحمتیں، سلامتی اور برکتیں نازل فرما۔',
    virtueAr: 'من صلى عليَّ صلاة واحدة صلى الله عليه بها عشراً، وحطت عنه عشر خطيئات، ورفعت له عشر درجات.',
    virtueEn: 'Whoever sends blessings upon me once, Allah will send blessings upon him tenfold, erase ten sins, and raise him ten ranks.',
    reference: 'سنن النسائي (1297) - صحيح',
    recommendedCount: 100,
    newMuslimTipAr: 'صيغة يسيرة وخفيفة على اللسان يمكنك ترديدها طوال اليوم وأنت تمشي أو تقود أو ترتاح.',
    newMuslimTipEn: 'A short, easy formula to repeat throughout your day while walking, commuting, or relaxing.'
  },

  // 🤲 الصدقة وفضائل الإنفاق
  {
    id: 'sadaqah-virtue',
    category: 'sadaqah',
    arabic: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ، وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلَّا عِزًّا',
    transliteration: 'Ma naqasat sadaqatun min maal, wa ma zadallahu abdan bi-\'afwin illa \'izza.',
    translationEn: 'Charity does not decrease wealth, and Allah increases the honor of the servant who forgives.',
    translationUr: 'صدقہ مال میں کمی نہیں کرتا، اور معاف کرنے سے اللہ عزت میں اضافہ کرتا ہے۔',
    virtueAr: 'الصدقة تطفئ غضب الرب وتدفع ميتة السوء، وتظل المؤمن في ظل صدقته يوم القيامة.',
    virtueEn: 'Charity cools the anger of the Lord, shields from hardship, and shades the believer on the Day of Judgment.',
    reference: 'صحيح مسلم (2588)',
    recommendedCount: 10,
    newMuslimTipAr: 'الصدقة في الإسلام ليست بالمال فقط: تبسمك في وجه أخيك صدقة، والكلمة الطيبة صدقة، وإماطة الأذى صدقة.',
    newMuslimTipEn: 'Charity in Islam extends beyond money: your smile is charity, kind words are charity, and helping someone is charity.'
  },
  {
    id: 'sadaqah-giver-dua',
    category: 'sadaqah',
    arabic: 'اللَّهُمَّ أَعْطِ مُنْفِقًا خَلَفًا، وَأَعْطِ مُمْسِكًا تَلَفًا',
    transliteration: 'Allahumma a\'ti munfiqan khalafa, wa a\'ti mumsikan talafa.',
    translationEn: 'O Allah, give the one who spends in charity compensation and replacement, and give the withholder ruin.',
    translationUr: 'اے اللہ! خرچ کرنے والے کو نعم البدل عطا فرما، اور روک رکھنے والے کے مال کو برباد کر۔',
    virtueAr: 'دعاء ملكين كريمين ينزلان في كل صباح يدعوان للمنفقين بالخلف والبركة.',
    virtueEn: 'A daily supplication made by two honorable angels every morning for those who spend for Allah\'s sake.',
    reference: 'صحيح البخاري (1442) ومسلم (1010)',
    recommendedCount: 10,
    newMuslimTipAr: 'تذكر دائماً أن ما تقدمه للفقراء والمحتاجين يعود إليك أضعافاً مضاعفة في الدنيا والآخرة.',
    newMuslimTipEn: 'Remember that whatever you give to those in need returns to you multiplied in blessings and peace.'
  },

  // 🌅 أذكار الصباح والمساء واليومية
  {
    id: 'tasbih-tahmid',
    category: 'daily',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'Subhan Allahi wa bi-hamdihi, Subhan Allahil-\'Azeem.',
    translationEn: 'Glory be to Allah and His is the praise, Glory be to Allah the Supreme.',
    translationUr: 'اللہ پاک ہے اپنی تعریفوں کے ساتھ، اللہ پاک ہے جو بہت عظمت والا ہے۔',
    virtueAr: 'كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن.',
    virtueEn: 'Two phrases that are light on the tongue, heavy in the scales, and beloved to the Most Merciful.',
    reference: 'صحيح البخاري (6406) وصحيح مسلم (2694)',
    recommendedCount: 100,
    newMuslimTipAr: 'سبحان الله تعني تنزيه الله عن كل نقص، وبحمده تعني الثناء والشكر على نعمه التي لا تحصى.',
    newMuslimTipEn: 'SubhanAllah affirms God is free from all flaws; wa bihamdihi praises Him for His boundless kindness.'
  },
  {
    id: 'hawqalah',
    category: 'daily',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah.',
    translationEn: 'There is no might nor power except with Allah.',
    translationUr: 'گناہوں سے بچنے کی طاقت اور نیکی کرنے کی قوت صرف اللہ ہی کی توفیق سے ہے۔',
    virtueAr: 'كنز من كنوز الجنة، وباب من أبوابها، واستسلام وتفويض تام لقدرة الله تعالى.',
    virtueEn: 'A treasure from the treasures of Paradise, representing surrender and reliance upon Allah\'s supreme power.',
    reference: 'صحيح البخاري (4205)',
    recommendedCount: 33,
    newMuslimTipAr: 'تقال عند الشعور بالعجز أو الإرهاق أو طلب التوفيق، فهي تمد النفس بقوة إيمانية هائلة.',
    newMuslimTipEn: 'Say it whenever you feel tired or overwhelmed; it reminds you that divine strength supports you.'
  },
  {
    id: 'hasbi-allah',
    category: 'daily',
    arabic: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: 'Hasbiyallahu la ilaha illa Huwa, \'alayhi tawakkaltu wa Huwa Rabbul-\'Arshil-\'Azeem.',
    translationEn: 'Sufficient for me is Allah; there is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.',
    translationUr: 'مجھے اللہ کافی ہے، اس کے سوا کوئی معبود نہیں، اسی پر میں نے بھروسہ کیا اور وہی عرشِ عظیم کا رب ہے۔',
    virtueAr: 'من قالها حين يصبح وحين يمسي سبع مرات كفاه الله ما أهمه من أمر الدنيا والآخرة.',
    virtueEn: 'Whoever recites it seven times in the morning and evening, Allah will suffice him in whatever concerns him in this life and the next.',
    reference: 'سنن أبي داود (5081) - صحيح موقوفاً',
    recommendedCount: 7,
    newMuslimTipAr: 'حسبي الله تعني أن الله يكفيني ويحميني من كل مخاوفي وقلقي.',
    newMuslimTipEn: 'It means "Allah is enough for me", releasing fear and anchoring your heart in divine protection.',
    period: 'both'
  },

  // 🌅 أذكار الصباح المأثورة
  {
    id: 'asbahna-wa-asbaha',
    category: 'morning',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    transliteration: 'Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamd, wa Huwa \'ala kulli shay\'in Qadeer. Rabbi as\'aluka khayra ma fi hadhal-yawmi wa khayra ma ba\'dah, wa a\'udhu bika min sharri ma fi hadhal-yawmi wa sharri ma ba\'dah, Rabbi a\'udhu bika minal-kasali wa soo\'il-kibar, Rabbi a\'udhu bika min \'adhabin fin-nari wa \'adhabin fil-qabr.',
    translationEn: 'We have entered upon the morning and the kingdom belongs to Allah, all praise is due to Allah. None has the right to be worshiped but Allah alone, without partner. His is the dominion and His is the praise, and He has power over all things. My Lord, I ask You for the good of this day and the good of what comes after it, and I seek refuge in You from the evil of this day and what comes after it.',
    translationUr: 'ہم نے صبح کی اور اللہ کے لیے تمام ملک نے صبح کی، اور تمام تعریفیں اللہ ہی کے لیے ہیں۔',
    virtueAr: 'الذكر الأساسي لبداية كل صباح: تسليم للملك، وسؤال للخير، واستعاذة من الكسل وعذاب القبر.',
    virtueEn: 'The primary morning invocation: acknowledging God\'s supreme dominion, seeking blessings for your day, and protection from all harm.',
    reference: 'صحيح مسلم (2723)',
    recommendedCount: 1,
    newMuslimTipAr: 'يُقال هذا الذكر المبارك بعد صلاة الفجر، وهو بمثابة حصن وتوكيل كامل لله في تدبير يومك.',
    newMuslimTipEn: 'Recited after dawn prayer, placing your entire day under Allah\'s loving care and guidance.',
    period: 'morning'
  },
  {
    id: 'ayat-al-kursi',
    category: 'morning',
    arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: 'Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta\'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa\'u \'indahu illa bi-idhnih. Ya\'lamu ma bayna aydihim wa ma khalfahum wa la yuhitoona bi-shay\'im-min \'ilmihi illa bima sha\'a. Wasi\'a kursiyyuhus-samawati wal-ard, wa la ya\'ooduhu hifdhuhuma wa Huwal-\'Aliyyul-\'Adheem.',
    translationEn: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.',
    translationUr: 'اللہ، اس کے سوا کوئی معبود نہیں، وہ ہمیشہ زندہ رہنے والا اور سب کو سنبھالنے والا ہے۔',
    virtueAr: 'أعظم آية في كتاب الله: من قرأها حين يصبح أُجير من الجن حتى يمسي، ومن قرأها حين يمسي أُجير منهم حتى يصبح.',
    virtueEn: 'The greatest verse in the Quran: whoever recites it in the morning is shielded from unseen harms until evening, and in the evening until morning.',
    reference: 'المعجم الكبير للطبراني، وصححه الألباني في صحيح الترغيب (658)',
    recommendedCount: 1,
    newMuslimTipAr: 'أعظم آية في القرآن الكريم؛ توفر لك حماية إلهية مستمرة على مدار اليوم والليلة.',
    newMuslimTipEn: 'The most majestic verse of the Quran; an impregnable spiritual fortress throughout your day.',
    period: 'both'
  },
  {
    id: 'bismillah-alladhi',
    category: 'morning',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillahil-ladhi la yadurru ma\'as-mihi shay\'un fil-ardi wa la fis-sama\'i wa Huwas-Sami\'ul-\'Aleem.',
    translationEn: 'In the Name of Allah, with Whose Name nothing can cause harm in the earth or in the heavens, and He is the All-Hearing, the All-Knowing.',
    translationUr: 'اللہ کے نام سے جس کے نام کی برکت سے زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی۔',
    virtueAr: 'من قالها ثلاثاً إذا أصبح وثلاثاً إذا أمسى لم يضره شيء قط.',
    virtueEn: 'Whoever says it three times in the morning and three times in the evening, nothing will harm him.',
    reference: 'سنن أبي داود (5088) وجامع الترمذي (3388) - صحيح',
    recommendedCount: 3,
    newMuslimTipAr: 'ثلاث مرات في الصباح وثلاث في المساء، حرز نبوي يحميك من أي سوء أو أذى مفاجئ.',
    newMuslimTipEn: 'Recited three times morning and evening, a divine shield against unforeseen harm.',
    period: 'both'
  },
  {
    id: 'radeetu-billah',
    category: 'morning',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    transliteration: 'Radeetu billahi Rabba, wa bil-Islami deena, wa bi-Muhammadin sallallahu \'alayhi wa sallama Nabiyya.',
    translationEn: 'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace and blessings be upon him) as my Prophet.',
    translationUr: 'میں اللہ کے رب ہونے پر، اسلام کے دین ہونے پر، اور محمد ﷺ کے نبی ہونے پر دل سے راضی ہوں۔',
    virtueAr: 'من قالها ثلاثاً حين يصبح وثلاثاً حين يمسي كان حقاً على الله أن يرضيه يوم القيامة.',
    virtueEn: 'Whoever says it three times in the morning and evening, it is a duty upon Allah to please him on the Day of Resurrection.',
    reference: 'سنن أبي داود (5072) ومسند أحمد - حسن',
    recommendedCount: 3,
    newMuslimTipAr: 'إعلان صادق للرضا والسكينة القلبية يبدأ به المسلم نهاره وليله.',
    newMuslimTipEn: 'A heartfelt declaration of faith and contentment with your Creator and faith.',
    period: 'both'
  },

  // 🌇 أذكار المساء المأثورة
  {
    id: 'amsayna-wa-amsa',
    category: 'evening',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    transliteration: 'Amsayna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamd, wa Huwa \'ala kulli shay\'in Qadeer. Rabbi as\'aluka khayra ma fi hadhihil-laylati wa khayra ma ba\'daha, wa a\'udhu bika min sharri ma fi hadhihil-laylati wa sharri ma ba\'daha, Rabbi a\'udhu bika minal-kasali wa soo\'il-kibar, Rabbi a\'udhu bika min \'adhabin fin-nari wa \'adhabin fil-qabr.',
    translationEn: 'We have entered upon the evening and the kingdom belongs to Allah, all praise is due to Allah. None has the right to be worshiped but Allah alone, without partner. His is the dominion and His is the praise, and He has power over all things. My Lord, I ask You for the good of this night and the good of what comes after it.',
    translationUr: 'ہم نے شام کی اور اللہ کے لیے تمام ملک نے شام کی، اور تمام تعریفیں اللہ ہی کے لیے ہیں۔',
    virtueAr: 'الذكر الأساسي لبداية كل مساء: حفظ للنفس في سكون الليل وطلب للسلامة والعافية.',
    virtueEn: 'The primary evening invocation: sheltering your soul under Allah\'s protection as night falls.',
    reference: 'صحيح مسلم (2723)',
    recommendedCount: 1,
    newMuslimTipAr: 'يُقال هذا الذكر بعد صلاة العصر أو مع غروب الشمس لنيل سكينة الليل وحفظه.',
    newMuslimTipEn: 'Recited in late afternoon or sunset to welcome the night with peace and safety.',
    period: 'evening'
  },
  {
    id: 'allahumma-afini',
    category: 'evening',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ',
    transliteration: 'Allahumma \'afini fi badani, Allahumma \'afini fi sam\'i, Allahumma \'afini fi basari, la ilaha illa Ant. Allahumma inni a\'udhu bika minal-kufri wal-faqr, wa a\'udhu bika min \'adhabil-qabr, la ilaha illa Ant.',
    translationEn: 'O Allah, grant well-being to my body. O Allah, grant well-being to my hearing. O Allah, grant well-being to my sight. There is no deity except You. O Allah, I seek refuge in You from disbelief and poverty, and from the punishment of the grave.',
    translationUr: 'اے اللہ! میرے بدن میں عافیت دے، میرے کانوں میں عافیت دے، میری آنکھوں میں عافیت دے۔',
    virtueAr: 'دعاء جامع للعافية في الجسد والحواس، والاستعاذة من الفقر والكفر وعذاب القبر (ثلاث مرات صباحاً ومساءً).',
    virtueEn: 'A comprehensive prayer for physical health, sensory faculties, and shielding from spiritual and worldly trials.',
    reference: 'سنن أبي داود (5090) ومسند أحمد - إسناده حسن',
    recommendedCount: 3,
    newMuslimTipAr: 'سؤال الله دوام الصحة والعافية في البصر والسمع والجسد، وشكر النعم الظاهرة والباطنة.',
    newMuslimTipEn: 'Invoking continuous well-being in mind, body, senses, and spirit.',
    period: 'both'
  },

  // 🚗 أذكار المناسبات والأحوال الواردة في السنة الصحيحة
  {
    id: 'travel-dua',
    category: 'occasions',
    occasionType: 'travel',
    occasionLabelAr: 'أذكار السفر والتنقل',
    occasionLabelEn: 'Travel & Journey',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ، اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا، وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ',
    transliteration: 'Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrineen, wa inna ila Rabbina lamunqaliboon. Allahumma inna nas\'aluka fi safarina hadhal-birra wat-taqwa, wa minal-\'amali ma tarda. Allahumma hawwin \'alayna safarana hadha, watwi \'anna bu\'dah. Allahumma Antas-Sahibu fis-safar, wal-Khaleefatu fil-ahl.',
    translationEn: 'Glory to Him who has subjected this to us, and we could never have done it by ourselves. And verily, to our Lord we shall return. O Allah, we ask You in this journey of ours for righteousness and piety, and deeds pleasing to You. O Allah, make this journey easy for us, and shorten its distance. O Allah, You are the Companion in travel and the Guardian of our family.',
    translationUr: 'پاک ہے وہ ذات جس نے اس سواری کو ہمارے بس میں کر دیا، ورنہ ہم اسے قابو میں لانے والے نہ تھے۔',
    virtueAr: 'دعاء السفر النبوي الشامل: تفويض الأمر لله، وطلب تيسير الطريق، وحفظ الأهل والمال من كل مكروه.',
    virtueEn: 'The comprehensive prophetic travel prayer for divine protection, safe roads, and family welfare.',
    reference: 'صحيح مسلم (1342) عن عبد الله بن عمر رضي الله عنهما',
    recommendedCount: 1,
    newMuslimTipAr: 'يُستحب قوله عند ركوب الطائرة أو السيارة أو القطار للسفر؛ يمنحك طمأنينة وحفظاً إلهياً طوال الطريق.',
    newMuslimTipEn: 'Recited upon boarding a flight, car, or train for travel, invoking serenity and protection.'
  },
  {
    id: 'waking-up-dua',
    category: 'occasions',
    occasionType: 'waking',
    occasionLabelAr: 'أذكار الاستيقاظ من النوم',
    occasionLabelEn: 'Waking Up',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushoor.',
    translationEn: 'All praise is for Allah who gave us life after causing us to die (sleep), and unto Him is the resurrection.',
    translationUr: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے کے بعد زندہ کیا اور اسی کی طرف لوٹ کر جانا ہے۔',
    virtueAr: 'أول ما يلهج به لسان المؤمن عند الاستيقاظ: شكر الله على نعمة عودة الروح والحياة بعد الموتة الصغرى.',
    virtueEn: 'The first words upon awakening: gratitude for renewed life and acknowledging the resurrection.',
    reference: 'صحيح البخاري (6312) وصحيح مسلم (2711)',
    recommendedCount: 1,
    newMuslimTipAr: 'اجعل هذا الذكر أول ما تنطق به حين تفتح عينيك كل صباح لتبدأ يومك بحمد الله والبركة.',
    newMuslimTipEn: 'Make this the very first sentence you utter when opening your eyes in the morning.'
  },
  {
    id: 'leaving-home-dua',
    category: 'occasions',
    occasionType: 'home',
    occasionLabelAr: 'أذكار الخروج من المنزل',
    occasionLabelEn: 'Leaving Home',
    arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillahi, tawakkaltu \'alallahi, la hawla wa la quwwata illa billah.',
    translationEn: 'In the Name of Allah, I place my trust in Allah; there is no might nor power except with Allah.',
    translationUr: 'اللہ کے نام کے ساتھ، میں نے اللہ پر بھروسہ کیا، گناہوں سے بچنے اور نیکی کرنے کی طاقت صرف اللہ سے ہے۔',
    virtueAr: 'من قالها عند خروجه قيل له: كُفِيتَ ووُقِيتَ وهُدِيتَ، وتنحّى عنه الشيطان فيقول شيطان لآخر: كيف لك برجل قد هُدي وكُفي ووُقي؟',
    virtueEn: 'Whoever recites it when stepping outside is told: "You are guided, defended, and protected," and devils distance from him.',
    reference: 'سنن أبي داود (5095) وسنن الترمذي (3426) - صححه الألباني',
    recommendedCount: 1,
    newMuslimTipAr: 'حرز يومي عظيم تقوله عند عتبة باب بيتك قبل الذهاب للعمل أو الدراسة لحمايتك من كل مكروه.',
    newMuslimTipEn: 'A powerful daily fortress to say at your doorstep before heading to work or school.'
  },
  {
    id: 'entering-home-dua',
    category: 'occasions',
    occasionType: 'home',
    occasionLabelAr: 'أذكار دخول المنزل',
    occasionLabelEn: 'Entering Home',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا (ثم يسلّم على أهله)',
    transliteration: 'Bismillahi walajna, wa bismillahi kharajna, wa \'ala Rabbina tawakkalna.',
    translationEn: 'In the Name of Allah we enter, and in the Name of Allah we leave, and upon our Lord we rely. (Then greet one\'s household with peace).',
    translationUr: 'اللہ کے نام کے ساتھ ہم داخل ہوئے اور اسی کے نام کے ساتھ ہم نکلے، اور اپنے رب پر بھروسہ کیا۔',
    virtueAr: 'إذا دخل الرجل بيته فذكر الله عند دخوله وعند طعامه، قال الشيطان: لا مبيت لكم ولا عشاء.',
    virtueEn: 'When a person enters his home and mentions Allah\'s Name upon entering and eating, Satan says to his companions: "No lodging and no dinner for you."',
    reference: 'سنن أبي داود (5096) وصحيح مسلم (2018)',
    recommendedCount: 1,
    newMuslimTipAr: 'الدخول بذكر الله والسلام يجلب البركة والسكينة والمودة بين أفراد الأسرة في البيت.',
    newMuslimTipEn: 'Entering with divine remembrance and greeting your family brings serenity and peace into the home.'
  },
  {
    id: 'mosque-entry-exit',
    category: 'occasions',
    occasionType: 'mosque',
    occasionLabelAr: 'أذكار دخول وخروج المسجد',
    occasionLabelEn: 'Mosque Entry & Exit',
    arabic: 'عِنْدَ الدُّخُولِ: «اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ»، وَعِنْدَ الْخُرُوجِ: «اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ»',
    transliteration: 'Entry: Allahummaf-tah li abwaba rahmatik. Exit: Allahumma inni as\'aluka min fadlik.',
    translationEn: 'Upon entering: "O Allah, open for me the gates of Your mercy." Upon exiting: "O Allah, I ask You from Your bounty."',
    translationUr: 'داخل ہوتے وقت: اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔ نکلتے وقت: اے اللہ! میں تجھ سے تیرے فضل کا سوال کرتا ہوں۔',
    virtueAr: 'سؤال رحمة الله عند الإقبال على العبادة، وسؤال فضله ورزقه عند الخروج للسعي في الأرض.',
    virtueEn: 'Seeking spiritual mercy upon worship and asking for lawful sustenance upon departing.',
    reference: 'صحيح مسلم (713) عن أبي حميد وأبي أسيد رضي الله عنهما',
    recommendedCount: 1,
    newMuslimTipAr: 'يقدم المسلم رجله اليمنى عند دخول المسجد ورجله اليسرى عند الخروج مقتدياً بسنة النبي ﷺ.',
    newMuslimTipEn: 'Step in with the right foot first at the mosque and exit with the left foot, following the Sunnah.'
  },
  {
    id: 'distress-relief-dua',
    category: 'occasions',
    occasionType: 'distress',
    occasionLabelAr: 'دعاء الكرب وتفريج الهم',
    occasionLabelEn: 'Relief of Distress',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
    transliteration: 'La ilaha illallahul-\'Azeemul-Haleem, la ilaha illallahu Rabbul-\'Arshil-\'Azeem, la ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-\'Arshil-Kareem.',
    translationEn: 'There is no deity except Allah, the Great, the Forbearing. There is no deity except Allah, Lord of the Magnificent Throne. There is no deity except Allah, Lord of the heavens and Lord of the earth, and Lord of the Noble Throne.',
    translationUr: 'اللہ کے سوا کوئی معبود نہیں جو عظمت والا اور بردبار ہے، اللہ کے سوا کوئی معبود نہیں جو عرشِ عظیم کا رب ہے۔',
    virtueAr: 'دعاء الكرب العظيم: كان رسول الله ﷺ يدعو به عند الشدة والكرب فيفرج الله همه وينزل سكينته.',
    virtueEn: 'The supreme supplication in times of hardship: anchors the soul in God\'s majesty to dissolve grief.',
    reference: 'صحيح البخاري (6346) وصحيح مسلم (2730)',
    recommendedCount: 3,
    newMuslimTipAr: 'كرر هذا الدعاء عند مواجهة أي ضيق أو اختبار صعب، ليمتلئ قلبك باليقين بقدرة الله على تفريج همك.',
    newMuslimTipEn: 'Repeat this prayer when experiencing anxiety or emotional distress to restore deep inner peace.'
  },
  {
    id: 'rain-dua',
    category: 'occasions',
    occasionType: 'nature',
    occasionLabelAr: 'دعاء نزول المطر والغيث',
    occasionLabelEn: 'Rain & Blessings',
    arabic: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
    transliteration: 'Allahumma sayyiban nafi\'a.',
    translationEn: 'O Allah, make it a beneficial downpour.',
    translationUr: 'اے اللہ! اسے نفع بخش بارش بنا۔',
    virtueAr: 'وقت نزول المطر من أوقات إجابة الدعاء ومواطن رحمة الله على عباده.',
    virtueEn: 'Rainfall is a blessed time of answered supplication and divine grace upon the earth.',
    reference: 'صحيح البخاري (1032) عن عائشة رضي الله عنها',
    recommendedCount: 1,
    newMuslimTipAr: 'دعاء قصير ومبارك يقال بمجرد رؤية المطر لسؤال الله أن يجعله بركة ونماء.',
    newMuslimTipEn: 'A brief, blessed phrase to say as soon as rain falls, asking that it brings growth and goodness.'
  },
  {
    id: 'iftar-dua',
    category: 'occasions',
    occasionType: 'eating',
    occasionLabelAr: 'دعاء إفطار الصائم',
    occasionLabelEn: 'Iftar Supplication',
    arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    transliteration: 'Dhahabadh-dhama\'u wabtallatil-\'urooqu wa thabatal-ajru in sha\' Allah.',
    translationEn: 'The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
    translationUr: 'پیاس بجھ گئی، رگیں تر ہو گئیں اور اجر ثابت ہو گیا، اگر اللہ نے چاہا۔',
    virtueAr: 'دعاء النبي ﷺ عند فطره في رمضان وفي صيام التطوع، مستشعرين حلاوة الطاعة وبشارة الأجر.',
    virtueEn: 'The prophetic prayer at sunset after a day of fasting, tasting the sweetness of obedience and reward.',
    reference: 'سنن أبي داود (2357) وحسنه الألباني والدارقطني',
    recommendedCount: 1,
    newMuslimTipAr: 'يقال عند تناول أول تمرة أو شربة ماء عند أذان المغرب في يوم الصيام.',
    newMuslimTipEn: 'Said when breaking your fast with your first date or sip of water at sunset.'
  },
  {
    id: 'gathering-expiation-dua',
    category: 'occasions',
    occasionType: 'social',
    occasionLabelAr: 'دعاء كفارة المجلس',
    occasionLabelEn: 'Gathering Expiation',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    transliteration: 'Subhanakallahumma wa bihamdika, ash-hadu alla ilaha illa Ant, astaghfiruka wa atoobu ilayk.',
    translationEn: 'Glory is to You, O Allah, and praise; I bear witness that there is no deity except You; I seek Your forgiveness and repent to You.',
    translationUr: 'اے اللہ! تو پاک ہے اپنی تعریف کے ساتھ، میں گواہی دیتا ہوں کہ تیرے سوا کوئی معبود نہیں، تجھ سے بخشش چاہتا ہوں اور تیری طرف توبہ کرتا ہوں۔',
    virtueAr: 'من قالها قبل أن يقوم من مجلسه غُفِر له ما كان في مجلسه ذلك من لغو أو تقصير.',
    virtueEn: 'Whoever recites it before leaving a gathering, whatever shortcomings occurred in that gathering are forgiven.',
    reference: 'جامع الترمذي (3433) وسنن أبي داود (4859) - صحيح',
    recommendedCount: 1,
    newMuslimTipAr: 'خاتمة ذهبية لكل اجتماع أو محادثة مع الأصدقاء أو زملاء العمل لتطهير المجلس ونيل المغفرة.',
    newMuslimTipEn: 'A golden seal at the end of any meeting, phone call, or gathering to wipe away unintentional lapses.'
  },
  {
    id: 'wearing-clothes-dua',
    category: 'occasions',
    occasionType: 'social',
    occasionLabelAr: 'دعاء لبس الثوب الجديد',
    occasionLabelEn: 'Wearing Clothes',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا الثَّوْبَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: 'Alhamdu lillahil-ladhi kasani hadhath-thawba wa razaqaneehi min ghayri hawlin minni wa la quwwah.',
    translationEn: 'All praise is due to Allah Who clothed me with this garment and provided it for me without any power or might on my part.',
    translationUr: 'تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ کپڑا پہنایا اور بغیر میری طاقت اور قوت کے یہ مجھے عطا فرمایا۔',
    virtueAr: 'شكر المنعم سبحانه على نعمة الكسوة والستر، وإقرار بفضل الله وعطائه المستمر.',
    virtueEn: 'Expressing genuine gratitude to the Creator for the blessing of clothing and modest covering.',
    reference: 'سنن أبي داود (4023) وحسنه الألباني',
    recommendedCount: 1,
    newMuslimTipAr: 'يقال عند ارتداء ثوب جديد أو يومي استشعاراً لنعمة الكسوة والستر التي أنعم الله بها علينا.',
    newMuslimTipEn: 'Recited when putting on new garments, acknowledging divine provision and modesty.'
  },
  {
    id: 'visiting-sick-dua',
    category: 'occasions',
    occasionType: 'social',
    occasionLabelAr: 'دعاء عيادة المريض والشفاء',
    occasionLabelEn: 'Visiting the Sick',
    arabic: 'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',
    transliteration: 'As\'alullahal-\'Azeema Rabbal-\'Arshil-\'Azeemi an yashfiyak.',
    translationEn: 'I ask Allah the Almighty, Lord of the Magnificent Throne, to heal you.',
    translationUr: 'میں عظمت والے اللہ، جو عرشِ عظیم کا رب ہے، سے سوال کرتا ہوں کہ وہ آپ کو شفا عطا فرمائے۔',
    virtueAr: 'ما من عبد مسلم يعود مريضاً لم يحضر أجله فيقول سبع مرات إلا عافاه الله.',
    virtueEn: 'Whoever visits a sick person and recites this seven times, Allah grants recovery unless it is appointed death.',
    reference: 'سنن أبي داود (3106) وسنن الترمذي (2083) - صحيح',
    recommendedCount: 7,
    newMuslimTipAr: 'يقال سبع مرات عند زيارة أي مريض طلباً للشفاء العاجل وإدخالاً للسرور على قلبه.',
    newMuslimTipEn: 'Say it seven times by the side of an ill person to pray for their full health and recovery.'
  }
];

export const DhikrSanctuary: React.FC<DhikrSanctuaryProps> = ({
  language,
  onBack,
  onNavigateToAchievements
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';

  // Mode: New Muslim (simplified explanations, transliteration) vs Born Muslim (deep hadith, tafsir)
  const [audienceMode, setAudienceMode] = useState<'new_muslim' | 'muslim'>(() => {
    try {
      return (localStorage.getItem('eilm_dhikr_mode') as any) || 'new_muslim';
    } catch {
      return 'new_muslim';
    }
  });

  // Selected Category & Occasion Sub-filter
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'morning' | 'evening' | 'istighfar' | 'salawat' | 'sadaqah' | 'daily' | 'occasions'>('all');
  const [occasionSubFilter, setOccasionSubFilter] = useState<'all' | 'travel' | 'waking' | 'home' | 'mosque' | 'distress' | 'nature' | 'social' | 'eating'>('all');

  // Smart Reminder Settings State (Persisted in localStorage)
  const [reminderSettings, setReminderSettings] = useState<DhikrReminderSettings>(() => {
    try {
      const saved = localStorage.getItem('eilm_dhikr_reminders');
      if (saved) return { ...DEFAULT_REMINDER_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_REMINDER_SETTINGS;
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  // Active in-app reminder alert modal when triggered
  const [activeReminderPopup, setActiveReminderPopup] = useState<{
    type: 'morning' | 'evening' | 'custom';
    titleAr: string;
    titleEn: string;
    bodyAr: string;
    bodyEn: string;
    time: string;
    category?: string;
  } | null>(null);

  // Active Dhikr currently placed into the Tasbih counter
  const [activeDhikr, setActiveDhikr] = useState<DhikrItem>(DHIKR_ITEMS[0]);

  // Digital Tasbih State
  const [counter, setCounter] = useState<number>(0);
  const [targetCount, setTargetCount] = useState<number>(33);
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);

  // Gamification & Persistent Dhikr Stats
  const [totalDhikrCount, setTotalDhikrCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('eilm_dhikr_total_count') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [currentXP, setCurrentXP] = useState<number>(getStoredXP());
  const [showCelebrationBanner, setShowCelebrationBanner] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // 🔔 Gentle, Serene Spiritual Chime via Web Audio API (No external assets required)
  const playGentleChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      const createChimeTone = (freq: number, start: number, duration: number, gainVal: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(gainVal, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      // Serene spiritual harmonic triad (Peaceful bell sound)
      createChimeTone(528, now, 1.8, 0.22);
      createChimeTone(660, now + 0.22, 2.0, 0.18);
      createChimeTone(792, now + 0.44, 2.2, 0.14);
      createChimeTone(1056, now + 0.66, 2.4, 0.1);
    } catch (e) {
      // Graceful fallback
    }
  };

  // ⏰ Dynamic Clock & Current Adhkar Period Analyzer
  const getCurrentPeriodInfo = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Morning: Fajr (~5:00) to Duha/Zawal (~11:30)
    // Evening: Asr (~16:00) to Night (~21:00)
    if (totalMinutes >= 5 * 60 && totalMinutes < 11 * 60 + 30) {
      return {
        period: 'morning' as const,
        labelAr: '🌅 حان الآن وقت أذكار الصباح المباركة',
        labelEn: 'Current Time: Blessed Morning Adhkar',
        subAr: 'يبدأ من بعد صلاة الفجر إلى الضحى • حصنك اليومي وبركة رزقك',
        subEn: 'From dawn prayer to forenoon • Your spiritual shield and peace',
        icon: Sunrise,
        targetCategory: 'morning' as const
      };
    } else if (totalMinutes >= 16 * 60 && totalMinutes < 21 * 60) {
      return {
        period: 'evening' as const,
        labelAr: '🌇 حان الآن وقت أذكار المساء والسكينة',
        labelEn: 'Current Time: Serene Evening Adhkar',
        subAr: 'يبدأ من بعد صلاة العصر إلى غروب الشمس وسكون الليل',
        subEn: 'From late afternoon to sunset & dusk • Protection and calm',
        icon: Sunset,
        targetCategory: 'evening' as const
      };
    } else {
      return {
        period: 'general' as const,
        labelAr: '🌙 روضة الأذكار والاستغفار في كل وقت وحين',
        labelEn: 'Sanctuary of Continuous Remembrance',
        subAr: '«أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ» • جدد إيمانك في كل لحظة',
        subEn: '"Unquestionably, by the remembrance of Allah hearts find rest"',
        icon: Sparkles,
        targetCategory: 'all' as const
      };
    }
  };

  const currentPeriod = getCurrentPeriodInfo();

  // Form state for adding custom reminder
  const [isAddingCustomAlert, setIsAddingCustomAlert] = useState<boolean>(false);
  const [newAlertTitle, setNewAlertTitle] = useState<string>('');
  const [newAlertTime, setNewAlertTime] = useState<string>('21:00');
  const [newAlertCategory, setNewAlertCategory] = useState<CustomDhikrAlert['category']>('daily');

  // 🔔 Send Real Push Notification (Via Service Worker if available, fallback to Notification API)
  const sendPushNotification = async (title: string, body: string, icon = '/favicon.ico') => {
    try {
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && reg.showNotification) {
          await reg.showNotification(title, {
            body,
            icon,
            badge: icon,
            vibrate: [150, 70, 150],
            tag: 'eilm-dhikr-alert'
          } as any);
          return;
        }
      }
      if (typeof window !== 'undefined' && 'Notification' in window) {
        new Notification(title, { body, icon });
      }
    } catch (e) {
      try {
        new Notification(title, { body, icon });
      } catch (err) {
        // Fallback
      }
    }
  };

  // 🔔 Trigger Reminder Popup & Native Web Push & Chime
  const triggerReminderPopup = (
    type: 'morning' | 'evening' | 'custom',
    customData?: { titleAr: string; titleEn: string; bodyAr: string; bodyEn: string; time: string; category?: string }
  ) => {
    let titleAr = '';
    let titleEn = '';
    let bodyAr = '';
    let bodyEn = '';
    let time = '';

    if (type === 'morning') {
      titleAr = '🌅 حان موعد أذكار الصباح المباركة';
      titleEn = '🌅 Time for Blessed Morning Adhkar';
      bodyAr = 'قال تعالى: ﴿وَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ طُلُوعِ الشَّمْسِ وَقَبْلَ الْغُرُوبِ﴾. ابدأ يومك بحصن الأذكار النبوية.';
      bodyEn = 'Start your day with divine peace, prophetic fortress, and abundance.';
      time = reminderSettings.morningTime;
    } else if (type === 'evening') {
      titleAr = '🌇 حان موعد أذكار المساء والسكينة';
      titleEn = '🌇 Time for Serene Evening Adhkar';
      bodyAr = 'قال رسول الله ﷺ: «من قالها حين يمسي موقناً بها فمات دخل الجنة». حصّن ليلتك بأذكار المساء وطمأنينة القلب.';
      bodyEn = 'Shield your soul as dusk settles and fill your evening with tranquillity.';
      time = reminderSettings.eveningTime;
    } else if (customData) {
      titleAr = customData.titleAr;
      titleEn = customData.titleEn;
      bodyAr = customData.bodyAr;
      bodyEn = customData.bodyEn;
      time = customData.time;
    }

    setActiveReminderPopup({
      type,
      titleAr,
      titleEn,
      bodyAr,
      bodyEn,
      time,
      category: customData?.category
    });

    if (reminderSettings.soundEnabled) {
      playGentleChime();
    }

    // Native Browser / System Push Notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted' && reminderSettings.browserNotifications) {
      sendPushNotification(isAr ? titleAr : titleEn, isAr ? bodyAr : bodyEn);
    }
  };

  // ⏰ Scheduled Periodic Smart Monitor (Checks every 20 seconds)
  useEffect(() => {
    if (!reminderSettings.enabled) return;

    const checkSchedule = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hours}:${minutes}`;
      const todayDateStr = now.toISOString().split('T')[0];

      // Check Morning Reminder Match
      if (reminderSettings.morningEnabled && reminderSettings.morningTime === currentTimeStr) {
        const lastNotified = localStorage.getItem('eilm_last_morning_reminder_date');
        if (lastNotified !== todayDateStr) {
          localStorage.setItem('eilm_last_morning_reminder_date', todayDateStr);
          triggerReminderPopup('morning');
        }
      }

      // Check Evening Reminder Match
      if (reminderSettings.eveningEnabled && reminderSettings.eveningTime === currentTimeStr) {
        const lastNotified = localStorage.getItem('eilm_last_evening_reminder_date');
        if (lastNotified !== todayDateStr) {
          localStorage.setItem('eilm_last_evening_reminder_date', todayDateStr);
          triggerReminderPopup('evening');
        }
      }

      // Check Custom Configured Alerts
      if (reminderSettings.customAlerts && reminderSettings.customAlerts.length > 0) {
        const dayOfWeek = now.getDay();
        for (const alert of reminderSettings.customAlerts) {
          if (!alert.enabled) continue;
          if (alert.repeatDays && alert.repeatDays.length > 0 && !alert.repeatDays.includes(dayOfWeek)) {
            continue;
          }
          if (alert.time === currentTimeStr) {
            const lastNotified = localStorage.getItem(`eilm_last_custom_reminder_${alert.id}`);
            if (lastNotified !== todayDateStr) {
              localStorage.setItem(`eilm_last_custom_reminder_${alert.id}`, todayDateStr);
              triggerReminderPopup('custom', {
                titleAr: `🕊️ موعد ورد: ${alert.titleAr}`,
                titleEn: `🕊️ Dhikr Alert: ${alert.titleEn}`,
                bodyAr: `حان وقت التذكير المخصص: ${alert.titleAr}. «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ».`,
                bodyEn: `Scheduled Dhikr reminder: ${alert.titleEn}. Find rest in the remembrance of Allah.`,
                time: alert.time,
                category: alert.category
              });
            }
          }
        }
      }
    };

    checkSchedule();
    const timerId = setInterval(checkSchedule, 20000);
    return () => clearInterval(timerId);
  }, [reminderSettings, isAr]);

  // Handle Updates to Settings
  const handleUpdateReminderSettings = (updates: Partial<DhikrReminderSettings>) => {
    const updated = { ...reminderSettings, ...updates };
    setReminderSettings(updated);
    try {
      localStorage.setItem('eilm_dhikr_reminders', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showFeedback(isAr ? 'تم حفظ إعدادات التنبيهات بنجاح ✓' : 'Reminder settings updated successfully ✓');
  };

  const showFeedback = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3200);
  };

  // Add new custom alert
  const handleAddCustomAlert = (alert: Omit<CustomDhikrAlert, 'id'>) => {
    playTapSound();
    const newAlert: CustomDhikrAlert = {
      ...alert,
      id: `custom-alert-${Date.now()}`
    };
    const updatedAlerts = [...(reminderSettings.customAlerts || []), newAlert];
    handleUpdateReminderSettings({ customAlerts: updatedAlerts });
    setIsAddingCustomAlert(false);
    setNewAlertTitle('');
    showFeedback(isAr ? 'تمت إضافة موعد التنبيه المخصص بنجاح 🔔' : 'Custom alert added successfully 🔔');
  };

  // Toggle custom alert
  const handleToggleCustomAlert = (id: string, enabled: boolean) => {
    playTapSound();
    const updatedAlerts = (reminderSettings.customAlerts || []).map((a) =>
      a.id === id ? { ...a, enabled } : a
    );
    handleUpdateReminderSettings({ customAlerts: updatedAlerts });
  };

  // Update custom alert time
  const handleUpdateCustomAlertTime = (id: string, time: string) => {
    const updatedAlerts = (reminderSettings.customAlerts || []).map((a) =>
      a.id === id ? { ...a, time } : a
    );
    handleUpdateReminderSettings({ customAlerts: updatedAlerts });
  };

  // Delete custom alert
  const handleDeleteCustomAlert = (id: string) => {
    playTapSound();
    const updatedAlerts = (reminderSettings.customAlerts || []).filter((a) => a.id !== id);
    handleUpdateReminderSettings({ customAlerts: updatedAlerts });
    showFeedback(isAr ? 'تم حذف التنبيه المخصص' : 'Custom alert removed');
  };

  // Request Native Browser Push Permission
  const handleRequestBrowserNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showFeedback(isAr ? 'المتصفح الحالي لا يدعم إشعارات النظام' : 'Browser does not support notifications');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        handleUpdateReminderSettings({ browserNotifications: true });
        sendPushNotification(
          isAr ? '🕊️ تم تفعيل تنبيهات منصة عِلم' : '🕊️ ILM Dhikr Reminders Enabled',
          isAr ? 'سنرسل لك إشعارات فورية في المواعيد المخصصة لأذكارك بإذن الله.' : 'We will send you push notifications at your custom scheduled times.'
        );
        showFeedback(isAr ? 'تم تفعيل إشعارات Push بنجاح 🔔' : 'Push notifications enabled 🔔');
      } else {
        handleUpdateReminderSettings({ browserNotifications: false });
        showFeedback(isAr ? 'تم رفض إذن الإشعارات من المتصفح' : 'Notifications permission denied');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger Instant Test Push Notification
  const handleTestReminderNow = async () => {
    playTapSound();
    if (notificationPermission !== 'granted' && typeof window !== 'undefined' && 'Notification' in window) {
      await handleRequestBrowserNotifications();
    }
    triggerReminderPopup(
      currentPeriod.period === 'evening' ? 'evening' : 'morning',
      {
        titleAr: '🕊️ تجربة إشعار فوري (Push Notification)',
        titleEn: '🕊️ Test Push Notification',
        bodyAr: 'هذا نموذج لتنبيه الأذكار المخصص الذي سيصلك في مواعيدك المحددة بإذن الله.',
        bodyEn: 'This is a preview of the custom Dhikr notification you will receive on schedule.',
        time: 'الآن'
      }
    );
    showFeedback(isAr ? 'تم إرسال إشعار فوري تجريبي 🔔' : 'Test push notification sent 🔔');
  };

  // Quick Action to start routine from reminder
  const handleStartReminderAdhkar = (type: 'morning' | 'evening' | 'custom', category?: string) => {
    playTapSound();
    setActiveReminderPopup(null);

    if (type === 'morning') {
      setSelectedCategory('morning');
      const topItem = DHIKR_ITEMS.find((d) => d.category === 'morning') || DHIKR_ITEMS[0];
      handleSelectDhikrForCounter(topItem);
    } else if (type === 'evening') {
      setSelectedCategory('evening');
      const topItem = DHIKR_ITEMS.find((d) => d.category === 'evening') || DHIKR_ITEMS[0];
      handleSelectDhikrForCounter(topItem);
    } else if (category && ['istighfar', 'salawat', 'sadaqah', 'daily'].includes(category)) {
      setSelectedCategory(category as any);
      const topItem = DHIKR_ITEMS.find((d) => d.category === category) || DHIKR_ITEMS[0];
      handleSelectDhikrForCounter(topItem);
    } else {
      setSelectedCategory('all');
    }

    setTimeout(() => {
      const el = document.getElementById('tasbih-counter-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Filtered Dhikrs
  const filteredDhikrs = selectedCategory === 'all' 
    ? DHIKR_ITEMS 
    : DHIKR_ITEMS.filter((item) => {
        if (selectedCategory === 'morning') {
          return item.category === 'morning' || item.period === 'morning' || item.period === 'both';
        }
        if (selectedCategory === 'evening') {
          return item.category === 'evening' || item.period === 'evening' || item.period === 'both';
        }
        if (selectedCategory === 'occasions') {
          if (item.category !== 'occasions') return false;
          if (occasionSubFilter !== 'all' && item.occasionType !== occasionSubFilter) return false;
          return true;
        }
        return item.category === selectedCategory;
      });

  // Sync mode with localStorage
  const handleToggleMode = (mode: 'new_muslim' | 'muslim') => {
    playTapSound();
    setAudienceMode(mode);
    try {
      localStorage.setItem('eilm_dhikr_mode', mode);
    } catch (e) {
      console.error(e);
    }
  };

  // Sync XP updates
  useEffect(() => {
    const handleXPUpdate = (e: any) => {
      if (e?.detail?.newXP) {
        setCurrentXP(e.detail.newXP);
      }
    };
    window.addEventListener('eilm_xp_updated', handleXPUpdate);
    return () => window.removeEventListener('eilm_xp_updated', handleXPUpdate);
  }, []);

  // Switch Active Dhikr for the Counter
  const handleSelectDhikrForCounter = (dhikr: DhikrItem) => {
    playTapSound();
    setActiveDhikr(dhikr);
    setCounter(0);
    setTargetCount(dhikr.recommendedCount || 33);
    setShowCelebrationBanner(false);

    // Smooth scroll down to counter on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const el = document.getElementById('tasbih-counter-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Click on the Tasbih Counter Bead
  const handleIncrement = () => {
    playTapSound();

    // Haptic vibration feedback on supported mobile devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch (e) {
        // Safe fallback
      }
    }

    const nextVal = counter + 1;
    const nextTotal = totalDhikrCount + 1;
    setCounter(nextVal);
    setTotalDhikrCount(nextTotal);

    try {
      localStorage.setItem('eilm_dhikr_total_count', nextTotal.toString());
    } catch (e) {
      console.error(e);
    }

    // Check if target count completed
    if (targetCount > 0 && nextVal === targetCount) {
      playSuccessSound();
      setShowCelebrationBanner(true);
      setRoundsCompleted((prev) => prev + 1);

      // Award XP! (+25 XP for completing a routine round)
      const earnedXP = awardXP(
        25,
        `إتمام ورد ${activeDhikr.category === 'salawat' ? 'الصلاة على النبي' : activeDhikr.category === 'istighfar' ? 'الاستغفار' : 'التسبيح'} (${targetCount} مرة)`,
        `Completed ${targetCount}x Dhikr Session`
      );
      setCurrentXP(earnedXP);

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([60, 50, 100]);
        } catch (e) {}
      }
    }
  };

  // Reset current counter
  const handleResetCounter = () => {
    playTapSound();
    setCounter(0);
    setShowCelebrationBanner(false);
  };

  // Speech pronunciation for new muslims
  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8; // Calm, slow pace for learners
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  // Prepare share text
  const learnerProfile = getLearnerProfile();
  const shareText = isAr
    ? `🌿 بفضل الله وتوفيقه، أنجزتُ ${totalDhikrCount} تسبيحة وذكراً في «ركن الأذكار والسكينة» عبر منصة «عِلم» المعرفية.\n\nقال تعالى: ﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾.\nانضم لرحلة الاستنارة وبناء الأوراد الموثوقة: https://ais-pre-hjhxxo4ixovlt4svdcnny4-905371258038.europe-west2.run.app`
    : `🌿 By the grace of Allah, I completed ${totalDhikrCount} Dhikr praises in the Dhikr Sanctuary on ILM Islamic Platform.\n\n"Unquestionably, by the remembrance of Allah hearts are assured." (Quran 13:28)\nJoin the learning journey: https://ais-pre-hjhxxo4ixovlt4svdcnny4-905371258038.europe-west2.run.app`;

  const handleShareNative = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: isAr ? 'إنجازي في ركن الأذكار - منصة عِلم' : 'My Dhikr Milestone - ILM Platform',
          text: shareText,
          url: window.location.href
        });
        return;
      } catch (e) {
        // User cancelled or unsupported
      }
    }
    // Fallback: Copy to clipboard
    handleCopyShareText();
  };

  const handleCopyShareText = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Progress percentage for circular meter
  const progressPercent = targetCount > 0 ? Math.min(100, Math.round((counter / targetCount) * 100)) : 100;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-24 mobile-bottom-clearance animate-fadeIn">
      
      {/* 🧭 Top Navigation & Context Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-[#EAE3D6] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/50 text-xs sm:text-sm font-bold text-slate-700 transition cursor-pointer self-start sm:self-auto shadow-3xs"
        >
          {isAr ? <ArrowRight className="w-4 h-4 text-amber-700" /> : <ArrowLeft className="w-4 h-4 text-amber-700" />}
          <span>{isAr ? 'العودة للمسارات' : 'Back to Pathways'}</span>
        </button>

        {/* Audience Mode Switcher: New Muslim vs Born Muslim */}
        <div className="flex items-center bg-[#F4ECE1] p-1 rounded-2xl border border-[#D4AF37]/35 shadow-inner">
          <button
            onClick={() => handleToggleMode('new_muslim')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              audienceMode === 'new_muslim'
                ? 'bg-gradient-to-r from-amber-700 to-amber-800 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isAr ? 'المسلم الجديد (تيسير ونطق)' : 'New Muslim (Easy & Audio)'}</span>
          </button>

          <button
            onClick={() => handleToggleMode('muslim')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              audienceMode === 'muslim'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'المسلم الأصل (تأصيل وتدبر)' : 'Born Muslim (In-Depth)'}</span>
          </button>
        </div>

        {/* Stats Pill, Reminders & Share CTA */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap justify-end">
          {/* 🔔 Smart Reminders Trigger Button */}
          <button
            onClick={() => {
              playTapSound();
              setIsSettingsModalOpen(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black shadow-3xs transition active:scale-95 cursor-pointer ${
              reminderSettings.enabled
                ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-400 text-amber-950 ring-2 ring-amber-400/20'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-500'
            }`}
            title={isAr ? 'إعدادات التنبيهات الذكية لأذكار الصباح والمساء' : 'Smart Dhikr Reminder Settings'}
          >
            {reminderSettings.enabled ? (
              <BellRing className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            ) : (
              <BellOff className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{isAr ? 'التنبيهات' : 'Reminders'}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                reminderSettings.enabled ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'
              }`}
            ></span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-950 shadow-3xs">
            <Flame className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>{totalDhikrCount}</span>
            <span className="text-[10px] text-amber-800 font-normal">{isAr ? 'تسبيحة' : 'Tasbihs'}</span>
          </div>

          <button
            onClick={() => {
              playTapSound();
              setIsShareModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-black shadow-xs hover:shadow-md transition active:scale-95 cursor-pointer"
            title={isAr ? 'مشاركة إنجاز الأذكار والتسبيح' : 'Share Dhikr Milestone'}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'مشاركة' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* 🕌 Grand Header Hero */}
      <div className="text-center max-w-3xl mx-auto mb-6 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FFF8E7] via-white to-[#FFF8E7] border border-[#D4AF37]/50 text-xs font-bold text-amber-950 shadow-2xs mb-3">
          <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
          <span>{isAr ? 'واحة القلوب وطمأنينة الأرواح' : 'Sanctuary of Peace & Hearts'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3 font-serif tracking-tight">
          {isAr ? 'ركن الأذكار وفضائل الأعمال' : 'Adhkar & Virtues Sanctuary'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
          {isAr
            ? 'قال تعالى: ﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾؛ روضة جامعة لأذكار الصباح والمساء، الاستغفار، الصلاة على النبي ﷺ، ثمار الصدقة، ومسبحة إلكترونية تفاعلية مع نظام تنبيهات ذكي للأوراد اليومية.'
            : 'Explore verified morning & evening adhkar, virtues of istighfar, salawat upon the Prophet ﷺ, blessings of charity, and an interactive digital tasbih with smart routine reminders.'}
        </p>

        {/* Motivational Guidance Banner according to selected audience */}
        <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-emerald-50/80 border border-[#D4AF37]/35 text-xs text-slate-700 flex items-center justify-center gap-2 shadow-2xs">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            {audienceMode === 'new_muslim'
              ? (isAr ? '💡 وضع المسلم الجديد: تم تزويد جميع الأذكار بنطق صوتي ميسر وكتابة صوتية بالحروف الإنجليزية وشرح لمعاني الكلمات.' : '💡 New Muslim Mode: All adhkar feature audio recitations, phonetic transliteration, and spiritual reasoning.')
              : (isAr ? '📖 وضع المسلم الأصل: تخريج الأحاديث من كتب السنة المعتمدة ووقفات تدبرية عميقة لربط الذكر بالعمل والتزكية.' : '📖 Born Muslim Mode: Rigorous hadith grading, scholastic sources, and contemplative spiritual depth.')}
          </span>
        </div>
      </div>

      {/* ⏰ Smart Time Indicator Banner (Current Adhkar Window) */}
      <div className="max-w-4xl mx-auto mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#FFFDF8] to-emerald-500/10 border-2 border-[#D4AF37]/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-start">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center shrink-0 shadow-md">
            {currentPeriod.period === 'morning' ? (
              <Sunrise className="w-6 h-6 animate-pulse" />
            ) : currentPeriod.period === 'evening' ? (
              <Sunset className="w-6 h-6 animate-pulse" />
            ) : (
              <Clock className="w-6 h-6 text-amber-300" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="text-sm sm:text-base font-black text-slate-900 font-serif">
                {isAr ? currentPeriod.labelAr : currentPeriod.labelEn}
              </span>
              {reminderSettings.enabled && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-3xs">
                  <Bell className="w-2.5 h-2.5" />
                  <span>
                    {currentPeriod.period === 'morning'
                      ? `${isAr ? 'تنبيه الصباح:' : 'Morning:'} ${reminderSettings.morningTime}`
                      : currentPeriod.period === 'evening'
                      ? `${isAr ? 'تنبيه المساء:' : 'Evening:'} ${reminderSettings.eveningTime}`
                      : isAr ? 'التنبيهات مفعلة' : 'Reminders Active'}
                  </span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {isAr ? currentPeriod.subAr : currentPeriod.subEn}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {currentPeriod.period !== 'general' && (
            <button
              onClick={() => handleStartReminderAdhkar(currentPeriod.period)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white text-xs font-black shadow-xs hover:shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {currentPeriod.period === 'morning'
                  ? isAr ? 'ابدأ أذكار الصباح' : 'Start Morning Adhkar'
                  : isAr ? 'ابدأ أذكار المساء' : 'Start Evening Adhkar'}
              </span>
            </button>
          )}

          <button
            onClick={() => {
              playTapSound();
              setIsSettingsModalOpen(true);
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50 text-slate-700 text-xs font-bold transition cursor-pointer shadow-3xs"
            title={isAr ? 'ضبط مواعيد التنبيهات' : 'Configure Reminder Times'}
          >
            <Settings className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">{isAr ? 'الإعدادات' : 'Settings'}</span>
          </button>
        </div>
      </div>

      {/* 🧭 Category Navigation Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-4">
        {[
          { id: 'all', labelAr: 'جميع الأبواب', labelEn: 'All Sections', icon: Sparkles },
          { id: 'occasions', labelAr: '🚗 أذكار المناسبات والأحوال', labelEn: 'Occasion & Event Adhkar', icon: Compass },
          { id: 'morning', labelAr: '🌅 أذكار الصباح', labelEn: 'Morning Adhkar', icon: Sunrise },
          { id: 'evening', labelAr: '🌇 أذكار المساء', labelEn: 'Evening Adhkar', icon: Sunset },
          { id: 'istighfar', labelAr: '📿 فضائل الاستغفار', labelEn: 'Seeking Forgiveness', icon: Heart },
          { id: 'salawat', labelAr: '💚 الصلاة على النبي ﷺ', labelEn: 'Salawat on Prophet', icon: Gift },
          { id: 'sadaqah', labelAr: '🤲 الصدقة وثمار الإنفاق', labelEn: 'Virtues of Charity', icon: Sun },
          { id: 'daily', labelAr: '🕊️ تسابيح اليوم والليلة', labelEn: 'Daily Remembrances', icon: Moon }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              playTapSound();
              setSelectedCategory(cat.id as any);
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white shadow-md shadow-amber-900/10 scale-102 border border-[#D4AF37]/40'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-3xs'
            }`}
          >
            <span>{isAr ? cat.labelAr : cat.labelEn}</span>
          </button>
        ))}
      </div>

      {/* 🏷️ Occasions Sub-Category Interactive Filter Bar */}
      {selectedCategory === 'occasions' && (
        <div className="max-w-4xl mx-auto mb-8 p-3 rounded-2xl bg-gradient-to-r from-rose-50/70 via-white to-amber-50/70 border border-rose-200/80 shadow-2xs animate-in fade-in duration-200">
          <div className="text-[11px] font-bold text-slate-500 mb-2 px-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-rose-600" />
            <span>{isAr ? 'تصنيفات أذكار المناسبات النبوية الواردة:' : 'Filter Occasion Adhkar by Situation:'}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', labelAr: 'الكل (١١ دعاء)', labelEn: 'All (11)' },
              { id: 'travel', labelAr: '✈️ السفر والتنقل', labelEn: 'Travel' },
              { id: 'waking', labelAr: '🌅 الاستيقاظ', labelEn: 'Waking' },
              { id: 'home', labelAr: '🏡 دخول وخروج المنزل', labelEn: 'Home' },
              { id: 'mosque', labelAr: '🕌 المسجد', labelEn: 'Mosque' },
              { id: 'distress', labelAr: '🤲 الكرب وتفريج الهم', labelEn: 'Distress' },
              { id: 'nature', labelAr: '🌧️ المطر والغيث', labelEn: 'Rain' },
              { id: 'eating', labelAr: '🥣 إفطار الصائم', labelEn: 'Fasting' },
              { id: 'social', labelAr: '👥 المجلس، اللباس وعيادة المريض', labelEn: 'Social & Life' },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  playTapSound();
                  setOccasionSubFilter(sub.id as any);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  occasionSubFilter === sub.id
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-white hover:bg-rose-50 text-slate-700 border border-slate-200'
                }`}
              >
                {isAr ? sub.labelAr : sub.labelEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 📿 Main Two-Column Layout: Dhikr Cards & The Digital Tasbih Counter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left/Main Column: Dhikr Cards Library (8 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-amber-600"></span>
              <span>{isAr ? 'الأذكار والفضائل الواردة' : 'Adhkar & Virtues'}</span>
              <span className="text-xs font-normal text-slate-500 font-sans">({filteredDhikrs.length})</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">
              {isAr ? 'انقر على أي ذكر لبدء التسبيح به' : 'Click any to set in Tasbih'}
            </span>
          </div>

          {filteredDhikrs.map((item) => {
            const isSelected = activeDhikr.id === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-3xl p-5 sm:p-6 border transition-all duration-300 relative overflow-hidden group cursor-pointer luxury-card-glow ${
                  isSelected
                    ? 'bg-gradient-to-br from-white via-[#FFFDF9] to-[#FFF9EE] border-2 border-[#D4AF37] shadow-xl ring-4 ring-amber-500/15'
                    : 'bg-gradient-to-br from-white via-[#FCFAF8] to-[#FAF5EC] border border-[#EAE3D6]'
                }`}
                onClick={() => handleSelectDhikrForCounter(item)}
              >
                {/* 💡 Light-Reveal Hover Glow Overlay */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-16 bg-amber-500/8 rounded-full blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                {/* Category Badge & Recommended Count */}
                <div className="flex items-center justify-between gap-2 mb-3.5 relative z-10">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                    item.category === 'istighfar'
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : item.category === 'salawat'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : item.category === 'sadaqah'
                      ? 'bg-teal-50 text-teal-900 border-teal-200'
                      : item.category === 'occasions'
                      ? 'bg-rose-50 text-rose-950 border-rose-200'
                      : 'bg-indigo-50 text-indigo-900 border-indigo-200'
                  }`}>
                    {item.category === 'istighfar' ? (isAr ? 'استغفار وتوبة' : 'Forgiveness')
                      : item.category === 'salawat' ? (isAr ? 'صلاة على النبي ﷺ' : 'Salawat')
                      : item.category === 'sadaqah' ? (isAr ? 'صدقة وبذل' : 'Charity')
                      : item.category === 'occasions' ? (isAr ? (item.occasionLabelAr || 'مناسبات وأحوال') : (item.occasionLabelEn || 'Occasions'))
                      : (isAr ? 'أذكار يومية' : 'Daily')}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {isAr ? `الورد المسنون: ${item.recommendedCount}x` : `Target: ${item.recommendedCount}x`}
                    </span>

                    {/* Pronunciation voice button for new Muslims */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(item.arabic);
                      }}
                      className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition cursor-pointer border border-amber-200"
                      title={isAr ? 'الاستماع لنطق الذكر بصوت واضح' : 'Listen to correct Arabic pronunciation'}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Arabic Text with Diacritics & Royal Calligraphic styling */}
                <div className="relative z-10 mb-3 text-right">
                  <p className="text-lg sm:text-xl font-bold font-serif text-slate-900 leading-relaxed selection:bg-amber-200" dir="rtl">
                    {item.arabic}
                  </p>
                </div>

                {/* New Muslim Transliteration (If New Muslim Mode active) */}
                {audienceMode === 'new_muslim' && (
                  <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-mono text-slate-600 leading-relaxed">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1 font-sans">
                      {isAr ? 'النطق الصوتي بالحروف الإنجليزية (Transliteration):' : 'Phonetic Pronunciation:'}
                    </span>
                    {item.transliteration}
                  </div>
                )}

                {/* English/Urdu Meaning */}
                <div className="mb-3 text-xs text-slate-600 leading-relaxed font-sans font-medium">
                  <p>{isUr ? item.translationUr : item.translationEn}</p>
                </div>

                {/* Virtues & Hadith Reference */}
                <div className="p-3 rounded-2xl bg-[#FCFAF5] border border-[#EAE3D6] space-y-1.5 text-xs text-slate-700 relative z-10">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="font-semibold text-slate-800 leading-snug">
                      {isAr ? item.virtueAr : item.virtueEn}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                    <span className="font-mono">{item.reference}</span>
                    <button
                      type="button"
                      onClick={() => handleSelectDhikrForCounter(item)}
                      className={`font-black text-xs transition flex items-center gap-1 ${
                        isSelected ? 'text-amber-800' : 'text-slate-600 hover:text-amber-800'
                      }`}
                    >
                      <span>{isSelected ? (isAr ? '✓ مفعل في المسبحة' : 'Active in Tasbih') : (isAr ? 'وضع في المسبحة' : 'Set to Tasbih')}</span>
                    </button>
                  </div>
                </div>

                {/* New Muslim Spiritual Insight Tip */}
                {audienceMode === 'new_muslim' && item.newMuslimTipAr && (
                  <div className="mt-2.5 p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-950 flex items-start gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>{isAr ? item.newMuslimTipAr : item.newMuslimTipEn}</span>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Right Column: The Digital Tasbih Counter & XP Hub (5 cols on desktop, sticky) */}
        <div id="tasbih-counter-section" className="lg:col-span-5 sticky top-24 space-y-6">
          
          {/* Main Tasbih Counter Box */}
          <div className="bg-gradient-to-br from-white via-[#FCFAF5] to-[#F7EFE1] border-3 border-[#D4AF37]/50 rounded-[36px] p-6 sm:p-8 shadow-2xl relative overflow-hidden group luxury-card-glow">
            
            {/* Elegant Inner Double Border Frame */}
            <div className="absolute inset-2 border border-[#D4AF37]/25 rounded-[28px] pointer-events-none group-hover:border-[#D4AF37]/50 transition-colors duration-300" />
            
            {/* Light-reveal radial top aura */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/12 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              
              {/* Header inside Tasbih */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-black text-slate-800 font-serif">
                    {isAr ? 'المسبحة الإلكترونية التفاعلية' : 'Smart Digital Tasbih'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleResetCounter}
                    className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200 transition cursor-pointer"
                    title={isAr ? 'تصفير العداد' : 'Reset Counter'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Currently Selected Dhikr Snippet */}
              <div className="p-3.5 rounded-2xl bg-white/90 border border-[#D4AF37]/35 shadow-2xs mb-6 text-center">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  {isAr ? 'الذكر النشط حالياً:' : 'Active Dhikr:'}
                </span>
                <p className="text-sm sm:text-base font-bold font-serif text-slate-900 leading-snug line-clamp-2" dir="rtl">
                  {activeDhikr.arabic}
                </p>
              </div>

              {/* Circular Target Selector */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[10, 33, 100, 0].map((tVal) => (
                  <button
                    key={tVal}
                    onClick={() => {
                      playTapSound();
                      setTargetCount(tVal);
                      setShowCelebrationBanner(false);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                      targetCount === tVal
                        ? 'bg-amber-800 text-white shadow-xs scale-105'
                        : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
                    }`}
                  >
                    {tVal === 0 ? (isAr ? 'حر ∞' : 'Free ∞') : `${tVal}`}
                  </button>
                ))}
              </div>

              {/* 🎯 Master Circular Tapping Bead / Central Interactive Button */}
              <div className="flex flex-col items-center justify-center my-4">
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-slate-950 p-2 shadow-2xl hover:shadow-[0_20px_50px_rgba(212,175,55,0.4)] active:scale-95 transition-all duration-150 cursor-pointer relative overflow-hidden group/bead flex items-center justify-center select-none"
                >
                  {/* Subtle spinning gold border aura */}
                  <div className="absolute inset-0 rounded-full border-2 border-amber-300/40 pointer-events-none" />

                  {/* Circular progress fill ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="3"
                    />
                    {targetCount > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="#FBBF24"
                        strokeWidth="5"
                        strokeDasharray="289"
                        strokeDashoffset={289 - (289 * progressPercent) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-200"
                      />
                    )}
                  </svg>

                  {/* Inner Glass Tap Area */}
                  <div className="w-[82%] h-[82%] rounded-full bg-gradient-to-br from-[#1C2C24] via-[#101D17] to-[#0A130F] flex flex-col items-center justify-center text-white border border-[#D4AF37]/50 shadow-inner group-hover/bead:border-[#D4AF37] transition-colors">
                    <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight drop-shadow-md text-amber-200">
                      {counter}
                    </span>
                    <span className="text-[11px] font-bold text-amber-400/80 mt-1 uppercase tracking-wider font-sans">
                      {targetCount > 0 ? `${isAr ? 'من أصل' : 'of'} ${targetCount}` : (isAr ? 'تسبيح حر' : 'Free Tally')}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {isAr ? 'اضغط للتسبيح' : 'Tap to Count'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Celebration Banner when goal completed */}
              {showCelebrationBanner && (
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-700 text-white shadow-xl text-center animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-center gap-1.5 text-sm font-black mb-1">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{isAr ? 'هنيئاً لك! تم إتمام الورد بنجاح' : 'Congratulations! Goal Completed!'}</span>
                  </div>
                  <p className="text-xs text-emerald-100 mb-2">
                    {isAr ? 'أُضيفت لك +25 نقطة خبرة (XP) في سجل درجاتك 🌟' : '+25 XP added to your learning profile 🌟'}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={handleResetCounter}
                      className="px-3 py-1 rounded-lg bg-white text-emerald-900 text-xs font-bold shadow-xs hover:bg-emerald-50 transition cursor-pointer"
                    >
                      {isAr ? 'بدء جولة جديدة' : 'New Round'}
                    </button>
                    <button
                      onClick={() => setIsShareModalOpen(true)}
                      className="px-3 py-1 rounded-lg bg-emerald-800 text-white text-xs font-bold border border-emerald-400/40 hover:bg-emerald-900 transition cursor-pointer flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>{isAr ? 'مشاركة الإنجاز' : 'Share'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Motivational Stats footer inside Tasbih */}
              <div className="mt-6 pt-4 border-t border-[#D4AF37]/25 flex items-center justify-between text-xs text-slate-600 font-bold">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? `جولات مكتملة: ${roundsCompleted}` : `Rounds: ${roundsCompleted}`}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{roundsCompleted * 25} XP</span>
                </div>
              </div>

            </div>
          </div>

          {/* 🌟 Motivation & Badges Box */}
          <div className="bg-white rounded-3xl p-5 border border-[#EAE3D6] shadow-sm space-y-3 luxury-card-glow">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{isAr ? 'أوسمة ركن الذاكرين' : 'Dhikr Badges & Ranks'}</span>
              </h3>
              {onNavigateToAchievements && (
                <button
                  onClick={onNavigateToAchievements}
                  className="text-[11px] font-bold text-amber-800 hover:underline cursor-pointer"
                >
                  {isAr ? 'عرض كل الأوسمة ←' : 'View all →'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                totalDhikrCount >= 10 ? 'bg-amber-50 border-amber-200 text-amber-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}>
                <span className="text-lg">🌱</span>
                <div>
                  <div className="text-[11px]">{isAr ? 'مبتدئ الذاكرين' : 'Beginner'}</div>
                  <div className="text-[9px] text-slate-500">10 {isAr ? 'تسبيحات' : 'dhikrs'}</div>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                totalDhikrCount >= 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}>
                <span className="text-lg">💚</span>
                <div>
                  <div className="text-[11px]">{isAr ? 'محب النبي ﷺ' : 'Prophet\'s Lover'}</div>
                  <div className="text-[9px] text-slate-500">100 {isAr ? 'تسبيحة' : 'dhikrs'}</div>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                totalDhikrCount >= 300 ? 'bg-blue-50 border-blue-200 text-blue-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}>
                <span className="text-lg">📿</span>
                <div>
                  <div className="text-[11px]">{isAr ? 'المستغفر بالأسحار' : 'Seeker of Mercy'}</div>
                  <div className="text-[9px] text-slate-500">300 {isAr ? 'تسبيحة' : 'dhikrs'}</div>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                totalDhikrCount >= 1000 ? 'bg-purple-50 border-purple-200 text-purple-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}>
                <span className="text-lg">👑</span>
                <div>
                  <div className="text-[11px]">{isAr ? 'الذاكرون كثيراً' : 'Master Dhikr'}</div>
                  <div className="text-[9px] text-slate-500">1000 {isAr ? 'تسبيحة' : 'dhikrs'}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 💌 Share Achievement Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/50 relative overflow-hidden">
            
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-black text-slate-900 font-serif">
                  {isAr ? 'مشاركة بطاقة إنجاز الأذكار' : 'Share Dhikr Milestone'}
                </h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* Visual Achievement Card Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FCFAF6] via-[#FAF5EE] to-[#F1E8D9] border-2 border-[#D4AF37]/60 shadow-md text-center mb-5 relative overflow-hidden">
              <div className="absolute top-2 right-2 text-xl opacity-30 select-none">🌿</div>
              <div className="absolute bottom-2 left-2 text-xl opacity-30 select-none">✨</div>

              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center mx-auto mb-2 text-xl shadow-md">
                📿
              </div>

              <span className="text-[11px] font-bold text-amber-900 bg-amber-100/60 px-2.5 py-0.5 rounded-full inline-block mb-1">
                منصة عِلم • ILM PLATFORM
              </span>

              <h4 className="text-lg font-black text-slate-900 font-serif mb-1">
                {learnerProfile.name}
              </h4>

              <div className="text-2xl font-black font-mono text-amber-800 my-2">
                {totalDhikrCount} {isAr ? 'تسبيحة وذكراً' : 'Tasbihs'}
              </div>

              <p className="text-xs text-slate-600 italic font-serif leading-relaxed" dir="rtl">
                «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
              </p>
            </div>

            {/* Sharing Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'مشاركة مباشرة عبر واتساب (WhatsApp)' : 'Share via WhatsApp'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyShareText}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {copiedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  <span>{copiedSuccess ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ النص' : 'Copy Text')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareNative}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isAr ? 'خيارات أخرى' : 'More Options'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 🔔 Smart Dhikr Reminders Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-[#D4AF37]/50 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Top Header */}
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center shadow-3xs">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-serif">
                    {isAr ? 'إعدادات التنبيهات الذكية للأذكار' : 'Smart Dhikr Reminder Settings'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isAr ? 'تخصيص مواعيد أذكار الصباح والمساء والتنبيه الصوتي' : 'Customize Morning & Evening alert times and chimes'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* Master Toggle */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/70 to-emerald-50/70 border border-[#D4AF37]/40 mb-5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-700 text-white flex items-center justify-center shadow-3xs">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    {isAr ? 'تفعيل نظام التنبيهات اليومي' : 'Enable Daily Reminder System'}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-600">
                    {isAr ? 'تذكيرك في الأوقات الفاضلة لحفظ اليوم والليلة' : 'Reminds you during the most virtuous hours'}
                  </div>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderSettings.enabled}
                  onChange={(e) => handleUpdateReminderSettings({ enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {/* Timers & Schedule Customization */}
            <div className={`space-y-4 mb-6 transition-opacity ${reminderSettings.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              
              {/* 🌅 Morning Adhkar Card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-[#FCFAF7] hover:border-amber-400 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Sunrise className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 font-serif">
                        {isAr ? 'أذكار الصباح' : 'Morning Adhkar'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {isAr ? 'يبدأ وقتها من طلوع الفجر إلى الشروق أو الضحى' : 'From dawn prayer until forenoon'}
                      </div>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reminderSettings.morningEnabled}
                      onChange={(e) => handleUpdateReminderSettings({ morningEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isAr ? 'وقت التنبيه الصباحي:' : 'Morning Alert Time:'}</span>
                  </span>
                  <input
                    type="time"
                    value={reminderSettings.morningTime}
                    disabled={!reminderSettings.morningEnabled}
                    onChange={(e) => handleUpdateReminderSettings({ morningTime: e.target.value })}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-mono font-bold text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* 🌇 Evening Adhkar Card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-[#FCFAF7] hover:border-amber-400 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center">
                      <Sunset className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 font-serif">
                        {isAr ? 'أذكار المساء' : 'Evening Adhkar'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {isAr ? 'يبدأ وقتها من بعد صلاة العصر إلى غروب الشمس' : 'From late afternoon until sunset and dusk'}
                      </div>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reminderSettings.eveningEnabled}
                      onChange={(e) => handleUpdateReminderSettings({ eveningEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isAr ? 'وقت التنبيه المسائي:' : 'Evening Alert Time:'}</span>
                  </span>
                  <input
                    type="time"
                    value={reminderSettings.eveningTime}
                    disabled={!reminderSettings.eveningEnabled}
                    onChange={(e) => handleUpdateReminderSettings({ eveningTime: e.target.value })}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-mono font-bold text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* 🔔 Tone and Audio Chime Settings */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    {reminderSettings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {isAr ? 'نغمة التنبيه الهادئة (Chime)' : 'Gentle Chime Tone'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {isAr ? 'رنين نغمي هادئ ومريح ينبهك بلطف' : 'Soft, peaceful sound alert'}
                    </div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reminderSettings.soundEnabled}
                    onChange={(e) => handleUpdateReminderSettings({ soundEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {/* ⏰ Custom Dhikr Alert Times (المواقيت المخصصة لتنبيهات الأذكار) */}
              <div className="p-4 rounded-2xl border-2 border-[#D4AF37]/40 bg-gradient-to-br from-[#FFFDF9] via-white to-[#FDF8EE] shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 font-serif">
                        {isAr ? 'مواقيت مخصصة إضافية للتنبيهات' : 'Custom Dhikr Alert Times'}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {isAr ? 'ضبط مواعيد مخصصة مع إرسال إشعارات فورية (Push Notifications)' : 'Set personalized times for bedtime, duha, or night prayer'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playTapSound();
                      setIsAddingCustomAlert(!isAddingCustomAlert);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition active:scale-95 cursor-pointer shadow-3xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إضافة موعد' : 'Add Time'}</span>
                  </button>
                </div>

                {/* Quick-Add Preset Chips */}
                <div className="mb-3.5">
                  <span className="text-[10px] font-bold text-slate-500 mb-1.5 block">
                    {isAr ? '⚡ أضف موعداً شائعاً بنقرة واحدة:' : '⚡ Quick presets:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { titleAr: 'أذكار النوم وسورة الملك', titleEn: 'Bedtime Adhkar', time: '22:30', category: 'sleep' },
                      { titleAr: 'سنة الضحى والتسبيح', titleEn: 'Duha Prayer', time: '09:30', category: 'duha' },
                      { titleAr: 'الصلاة على النبي (الجمعة)', titleEn: 'Friday Salawat', time: '14:30', category: 'salawat', repeatDays: [5] },
                      { titleAr: 'استغفار الأسحار', titleEn: 'Tahajjud Istighfar', time: '04:00', category: 'night' }
                    ].map((preset, idx) => {
                      const alreadyExists = (reminderSettings.customAlerts || []).some(
                        (a) => a.titleAr === preset.titleAr || a.time === preset.time
                      );
                      if (alreadyExists) return null;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            handleAddCustomAlert({
                              titleAr: preset.titleAr,
                              titleEn: preset.titleEn,
                              time: preset.time,
                              category: preset.category as any,
                              enabled: true,
                              repeatDays: preset.repeatDays
                            });
                          }}
                          className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5 text-amber-600" />
                          <span>{isAr ? preset.titleAr : preset.titleEn}</span>
                          <span className="text-[9px] text-amber-700 font-mono">({preset.time})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Expandable Add Custom Alert Form */}
                {isAddingCustomAlert && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300 animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-xs font-bold text-slate-900 mb-2">
                      {isAr ? 'إضافة موعد تنبيه مخصص جديد:' : 'Add New Custom Alert:'}
                    </div>
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">
                          {isAr ? 'اسم الورد أو الذكر:' : 'Dhikr Title:'}
                        </label>
                        <input
                          type="text"
                          placeholder={isAr ? 'مثال: ورد الاستغفار بعد العمل' : 'e.g., Evening Istighfar Routine'}
                          value={newAlertTitle}
                          onChange={(e) => setNewAlertTitle(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">
                            {isAr ? 'وقت التنبيه:' : 'Alert Time:'}
                          </label>
                          <input
                            type="time"
                            value={newAlertTime}
                            onChange={(e) => setNewAlertTime(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-mono font-bold text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">
                            {isAr ? 'القسم المقترن:' : 'Category:'}
                          </label>
                          <select
                            value={newAlertCategory}
                            onChange={(e) => setNewAlertCategory(e.target.value as any)}
                            className="w-full px-2 py-1.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="daily">{isAr ? 'تسابيح عامة' : 'Daily Tasbih'}</option>
                            <option value="istighfar">{isAr ? 'استغفار وتوبة' : 'Istighfar'}</option>
                            <option value="salawat">{isAr ? 'صلاة على النبي' : 'Salawat'}</option>
                            <option value="sadaqah">{isAr ? 'ثمار الصدقة' : 'Charity'}</option>
                            <option value="sleep">{isAr ? 'أذكار النوم' : 'Bedtime'}</option>
                            <option value="duha">{isAr ? 'صلاة الضحى' : 'Duha'}</option>
                            <option value="night">{isAr ? 'قيام الليل' : 'Tahajjud'}</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          disabled={!newAlertTitle.trim()}
                          onClick={() => {
                            handleAddCustomAlert({
                              titleAr: newAlertTitle.trim(),
                              titleEn: newAlertTitle.trim(),
                              time: newAlertTime,
                              category: newAlertCategory,
                              enabled: true
                            });
                          }}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer shadow-3xs"
                        >
                          {isAr ? 'حفظ الموعد المخصص ✓' : 'Save Custom Alert ✓'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingCustomAlert(false)}
                          className="py-1.5 px-3 rounded-xl border border-slate-300 hover:bg-white text-slate-600 text-xs font-medium cursor-pointer"
                        >
                          {isAr ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* List of Configured Custom Alerts */}
                <div className="space-y-2">
                  {(!reminderSettings.customAlerts || reminderSettings.customAlerts.length === 0) ? (
                    <div className="text-center py-4 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      {isAr ? 'لا توجد مواقيت مخصصة حالياً. أضف موعدك الأول أعلاه.' : 'No custom alerts configured yet. Add your first above.'}
                    </div>
                  ) : (
                    reminderSettings.customAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                          alert.enabled
                            ? 'bg-white border-slate-200 shadow-3xs'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg">
                            {alert.category === 'sleep'
                              ? '🌙'
                              : alert.category === 'duha'
                              ? '☀️'
                              : alert.category === 'salawat'
                              ? '💚'
                              : alert.category === 'night'
                              ? '✨'
                              : alert.category === 'istighfar'
                              ? '📿'
                              : '🕊️'}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {isAr ? alert.titleAr : alert.titleEn}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              <Calendar className="w-2.5 h-2.5" />
                              <span>
                                {alert.repeatDays && alert.repeatDays.includes(5)
                                  ? (isAr ? 'كل جمعة' : 'Every Friday')
                                  : (isAr ? 'يومياً' : 'Daily')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Time Picker */}
                          <input
                            type="time"
                            value={alert.time}
                            disabled={!alert.enabled}
                            onChange={(e) => handleUpdateCustomAlertTime(alert.id, e.target.value)}
                            className="px-2 py-1 rounded-lg border border-slate-300 bg-white font-mono font-bold text-[11px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            title={isAr ? 'تعديل وقت التنبيه' : 'Edit alert time'}
                          />

                          {/* Toggle */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={alert.enabled}
                              onChange={(e) => handleToggleCustomAlert(alert.id, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-600"></div>
                          </label>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomAlert(alert.id)}
                            className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title={isAr ? 'حذف هذا الموعد' : 'Delete alert'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>

              {/* 🌐 Native Browser Desktop & Push Notifications */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-3xs">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">
                      {isAr ? 'إشعارات النظام الفورية (Push Notifications)' : 'System Push Notifications'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {notificationPermission === 'granted'
                        ? isAr ? 'مفعلة وتصل إلى جهازك في المواقيت المحددة ✓' : 'Active and scheduled on your device ✓'
                        : isAr ? 'تحتاج إلى منح إذن المتصفح لتلقي الإشعارات الخارجية' : 'Requires browser permission to receive push alerts'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {notificationPermission !== 'granted' ? (
                    <button
                      onClick={handleRequestBrowserNotifications}
                      className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer shadow-3xs flex items-center justify-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تفعيل إشعارات Push 🔔' : 'Enable Push 🔔'}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-3xs">
                      {isAr ? 'إشعارات Push مفعلة ✓' : 'Push Active ✓'}
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Test & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleTestReminderNow}
                className="w-full sm:flex-1 py-2.5 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-black flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-3xs"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-700" />
                <span>{isAr ? 'تجربة إشعار فوري (Push Preview)' : 'Test Push Notification (Preview)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition active:scale-95 cursor-pointer shadow-xs"
              >
                {isAr ? 'إغلاق وحفظ' : 'Save & Close'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🕊️ Active In-App Reminder Alert Modal (Triggers on schedule or test) */}
      {activeReminderPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-br from-white via-[#FCFAF6] to-[#FAF3E5] max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37] text-center relative overflow-hidden">
            {/* Spiritual Aura Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center mx-auto mb-4 shadow-lg text-2xl ring-4 ring-amber-400/20">
              {activeReminderPopup.type === 'morning' ? '🌅' : activeReminderPopup.type === 'evening' ? '🌇' : '🕊️'}
            </div>

            <span className="text-[11px] font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-2 shadow-3xs">
              {isAr ? 'تنبيه الأذكار النبوية المباركة' : 'Prophetic Dhikr Reminder'}
            </span>

            <h3 className="text-xl font-black text-slate-900 font-serif mb-2">
              {isAr ? activeReminderPopup.titleAr : activeReminderPopup.titleEn}
            </h3>

            <div className="text-xs text-amber-900 font-serif font-bold italic mb-3" dir="rtl">
              «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              {isAr ? activeReminderPopup.bodyAr : activeReminderPopup.bodyEn}
            </p>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleStartReminderAdhkar(activeReminderPopup.type, activeReminderPopup.category)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 hover:from-amber-800 hover:to-black text-white text-xs font-black shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current text-amber-300" />
                <span>
                  {activeReminderPopup.type === 'morning'
                    ? isAr ? 'ابدأ أذكار الصباح الآن' : 'Start Morning Adhkar Now'
                    : activeReminderPopup.type === 'evening'
                    ? isAr ? 'ابدأ أذكار المساء الآن' : 'Start Evening Adhkar Now'
                    : isAr ? 'ابدأ الورد والتسبيح الآن' : 'Start Dhikr Session Now'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveReminderPopup(null)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-bold transition cursor-pointer"
              >
                {isAr ? 'تذكيري لاحقاً' : 'Remind Me Later'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 💬 Floating Feedback Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-amber-400/40 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

    </div>
  );
};

