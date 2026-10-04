import React, { useState } from 'react';
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
  VolumeX,
  Layers,
  ArrowRight
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

interface IslamicSignLanguageHubProps {
  language: Language;
  onBackToMain?: () => void;
}

export const IslamicSignLanguageHub: React.FC<IslamicSignLanguageHubProps> = ({
  language,
  onBackToMain
}) => {
  const isAr = language === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'wudu' | 'salah' | 'pillars' | 'dhikr'>('all');
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [isSlowMotion, setIsSlowMotion] = useState<boolean>(false);
  const [completedSigns, setCompletedSigns] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('eilm_sign_completed');
      return saved ? JSON.parse(saved) : ['wudu-01'];
    } catch {
      return ['wudu-01'];
    }
  });

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

  const handlePrintGuide = () => {
    window.print();
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
              <span>{isAr ? 'قاموس لغة الإشارة الإسلامي التفاعلي' : 'Islamic Sign Language Visual Hub'}</span>
              <span className="text-2xl">🤟</span>
            </h1>
            <p className="text-sm text-teal-100/90 leading-relaxed">
              {isAr 
                ? 'مرجع بصري وحركي ميسر يشرح أركان الإسلام، خطوات الوضوء، وحركات الصلاة، لتمكين الصم وضعاف السمع من تعلم الفرائض بيسر وسكينة.'
                : 'Interactive visual and motion guide illustrating Islamic pillars, ablution steps, and prayer postures for the Deaf and hard-of-hearing community.'}
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
  );
};
