import React, { useState } from 'react';
import { 
  Sparkles, 
  Smile, 
  Award, 
  BookOpen, 
  Star, 
  Heart, 
  CheckCircle2, 
  RotateCcw, 
  Printer, 
  Share2, 
  ShieldCheck, 
  Volume2, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types';

interface JuniorStory {
  id: string;
  titleAr: string;
  titleEn: string;
  badgeEmoji: string;
  heroCharacter: string;
  storyAr: string;
  storyEn: string;
  goldenRuleAr: string;
  goldenRuleEn: string;
  quranProofAr: string;
  quranProofEn: string;
  quiz: {
    questionAr: string;
    questionEn: string;
    optionsAr: string[];
    optionsEn: string[];
    correctIndex: number;
    celebrationAr: string;
    celebrationEn: string;
  };
}

const JUNIOR_STORIES: JuniorStory[] = [
  {
    id: 'story-01',
    titleAr: 'حكاية الصدق وبركة الأمانة',
    titleEn: 'The Honest Merchant & Blessing of Truth',
    badgeEmoji: '💎',
    heroCharacter: 'الفتى عمر وتاجر التمر',
    storyAr: 'كان هناك فتى اسمه عمر يساعد والده في المتجر، وفي يوم جاء مشترٍ وترك حقيبة صغيرة مليئة بالدراهم سهواً. سارع عمر بالركض خلف المشتري ليردها له كاملة، ففرح الرجل جداً ودعا له بالبركة، وتذكر عمر قول رسول الله ﷺ: «عليكم بالصدق، فإن الصدق يهدي إلى البر».',
    storyEn: 'Young Omar was helping his father at the market when a customer accidentally forgot a bag of coins. Omar ran after him to return it completely. The customer made a heartfelt prayer for him, recalling the Prophet’s words: "Adhere to truthfulness."',
    goldenRuleAr: 'المسلم الصادق لا يأخذ ما ليس له، والله يحب من يرد الأمانة إلى أهلها.',
    goldenRuleEn: 'A truthful believer never keeps what is not theirs; Allah loves trustworthiness.',
    quranProofAr: '﴿إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا﴾ [النساء: 58]',
    quranProofEn: '"Indeed, Allah commands you to render trusts to whom they are due." [An-Nisa: 58]',
    quiz: {
      questionAr: 'ماذا فعل الفتى عمر عندما وجد حقيبة النقود المنسية؟',
      questionEn: 'What did young Omar do when he found the forgotten money bag?',
      optionsAr: ['ركض خلف صاحبها ليردها فوراً 🏃‍♂️', 'خبأها لنفسه ❌', 'تركها على الأرض ❓'],
      optionsEn: ['Ran after the owner to return it immediately 🏃‍♂️', 'Hid it for himself ❌', 'Left it on the floor ❓'],
      correctIndex: 0,
      celebrationAr: 'أحسنت يا بطل! الصدق والأمانة تاج في رأس المسلم الصغير 🌟',
      celebrationEn: 'Well done, champion! Truthfulness and honesty are a crown of faith 🌟'
    }
  },
  {
    id: 'story-02',
    titleAr: 'رحلة قطرة الماء وسر الوضوء النظيف',
    titleEn: 'The Journey of the Water Drop & Wudu',
    badgeEmoji: '💧',
    heroCharacter: 'سارة وقطرة الماء اللطيفة',
    storyAr: 'توضأت سارة استعداداً لصلاة العصر، وحرصت ألا تسرف في الماء مقتدية بالنبي ﷺ. كلما غسلت عضواً شعرت بالنقاء والانتعاش ونور الإيمان يملأ قلبها، وقالت لأخيها الصغير: "الوضوء مفتاح الصلاة، ونظافة المسلم دليل محبته لربه".',
    storyEn: 'Sarah performed Wudu for Asr prayer without wasting water, following the Sunnah. With each washed limb, she felt radiant purity, telling her little brother: "Wudu is the key to prayer and a sign of love for Allah."',
    goldenRuleAr: 'الوضوء طهارة للجسد والروح، ولا نسرف في الماء حتى لو كنا على نهر جارٍ.',
    goldenRuleEn: 'Wudu purifies body and soul; never waste water even beside a flowing river.',
    quranProofAr: '﴿يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ﴾ [المائدة: 6]',
    quranProofEn: '"O you who have believed, when you rise to prayer, wash your faces..." [Al-Ma\'idah: 6]',
    quiz: {
      questionAr: 'كيف نتصرف بالماء أثناء الوضوء كما علمتنا سارة؟',
      questionEn: 'How should we use water during Wudu according to Sarah?',
      optionsAr: ['نقتصد بالماء ولا نسرف فيه 💧', 'نترك الصنبور مفتوحاً بالكامل ❌', 'لا نتوضأ ❓'],
      optionsEn: ['Conserve water without waste 💧', 'Leave tap fully running ❌', 'Do not make wudu ❓'],
      correctIndex: 0,
      celebrationAr: 'رائع جداً! حافظت على نعمة الماء وسنة نبيك الحبيب ﷺ 💖',
      celebrationEn: 'Awesome! You preserved water and followed the beloved Sunnah 💖'
    }
  },
  {
    id: 'story-03',
    titleAr: 'هدية الابتسامة وبر الوالدين',
    titleEn: 'The Gift of a Smile & Honoring Parents',
    badgeEmoji: '🌸',
    heroCharacter: 'خالد ووالدته الحبيبة',
    storyAr: 'عاد خالد من المدرسة متحمساً، وقبل أن يطلب أي طعام أو يلعب، قبّل رأس والدته وساعد والده في حمل الأغراض بابتسامة مشرقة. قال له والده: "بارك الله فيك يا بني، تبسمك وبرك أعظم هدية اليوم"، وتذكر خالد حديث: «تبسمك في وجه أخيك صدقة».',
    storyEn: 'Khalid returned from school, and before playing, kissed his mother’s head and helped his father with bags while smiling brightly. His father hugged him saying: "Your kindness and smile are our best gift today."',
    goldenRuleAr: 'بر الوالدين وبشاشة الوجه من أعظم الأعمال التي تقربنا من جنة النعيم.',
    goldenRuleEn: 'Honoring parents and wearing a warm smile are the brightest pathways to Jannah.',
    quranProofAr: '﴿وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا﴾ [الإسراء: 23]',
    quranProofEn: '"And your Lord has decreed that you not worship except Him, and to parents, good treatment." [Al-Isra: 23]',
    quiz: {
      questionAr: 'ما هو العمل الطيب الذي قام به خالد فور عودته؟',
      questionEn: 'What good deed did Khalid do upon arriving home?',
      optionsAr: ['قبل رأس والدته وساعد والده بابتسامة 💖', 'صرخ ولعب بألعابه ❌', 'تجاهل الجميع ❓'],
      optionsEn: ['Kissed mother’s head and helped father smiling 💖', 'Screamed and played ❌', 'Ignored everyone ❓'],
      correctIndex: 0,
      celebrationAr: 'ما شاء الله عليك! أنت فخر لوالديك وقدوة صالحة لكل الأطفال 🌟',
      celebrationEn: 'Masha\'Allah! You are a pride to your parents and a role model for kids 🌟'
    }
  }
];

interface IlmJuniorHubProps {
  language: Language;
  onBackToMain?: () => void;
}

export const IlmJuniorHub: React.FC<IlmJuniorHubProps> = ({
  language,
  onBackToMain
}) => {
  const isAr = language === 'ar';
  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [storyId: string]: number }>({});
  const [earnedStars, setEarnedStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('eilm_junior_stars');
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  const [activeTab, setActiveTab] = useState<'stories' | 'family_monitor'>('stories');

  const currentStory = JUNIOR_STORIES[activeStoryIdx] || JUNIOR_STORIES[0];

  const handleSelectOption = (storyId: string, optIdx: number, isCorrect: boolean) => {
    setSelectedAnswers(prev => ({ ...prev, [storyId]: optIdx }));
    if (isCorrect && selectedAnswers[storyId] === undefined) {
      setEarnedStars(prev => {
        const next = prev + 5;
        try {
          localStorage.setItem('eilm_junior_stars', next.toString());
        } catch (e) {
          console.warn(e);
        }
        return next;
      });
    }
  };

  const handlePrintFamilyReport = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="${language}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8" />
  <title>${isAr ? 'تقرير إنجاز واحة عِلم للناشئة' : 'ILM Junior Achievement Report'}</title>
  <style>
    @page { size: landscape; margin: 10mm; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Arabic', sans-serif;
      background-color: #FFFBEB;
      margin: 0;
      padding: 20px;
      color: #78350F;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      direction: ${isAr ? 'rtl' : 'ltr'};
    }
    .report-frame {
      border: 6px solid #F59E0B;
      border-radius: 20px;
      background: #FFFFFF;
      padding: 28px 36px;
      text-align: center;
    }
    .report-title { font-size: 26px; font-weight: 900; color: #B45309; margin-bottom: 8px; }
    .stars-badge {
      display: inline-block;
      background: #FEF3C7;
      color: #92400E;
      border: 2px solid #FCD34D;
      padding: 8px 24px;
      border-radius: 9999px;
      font-weight: 800;
      font-size: 18px;
      margin: 12px 0 20px 0;
    }
    .report-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 20px;
      text-align: start;
    }
    .report-box {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 12px;
      padding: 14px;
    }
    .box-title { font-weight: 800; font-size: 14px; color: #B45309; margin-bottom: 6px; }
    .box-desc { font-size: 12px; color: #92400E; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="report-frame">
    <div style="font-size: 12px; font-weight: 800; color: #D97706; letter-spacing: 2px;">منصة عِلم • واحة الناشئة والأسرة المسلمة</div>
    <h1 class="report-title">${isAr ? '🌟 تقرير الإنجاز والهمة الإيمانية 🌟' : '🌟 Faith & Knowledge Achievement Report 🌟'}</h1>
    <div class="stars-badge">⭐ ${earnedStars} ${isAr ? 'نجمة إيمانية مكتسبة' : 'Faith Stars Earned'}</div>
    <div class="report-grid">
      <div class="report-box">
        <div class="box-title">🕌 ${isAr ? 'أركان الإسلام والإيمان' : 'Pillars of Faith'}</div>
        <div class="box-desc">${isAr ? 'تم استيعاب المفاهيم الأساسية وحفظ الأذكار المقررة بأسلوب تفاعلي ممتع.' : 'Core pillars learned through interactive engaging stories.'}</div>
      </div>
      <div class="report-box">
        <div class="box-title">📖 ${isAr ? 'قصص الأنبياء والقرآن' : 'Stories of Prophets'}</div>
        <div class="box-desc">${isAr ? 'استلهام القيم والأخلاق الحميدة من سيرة الأنبياء عليهم السلام.' : 'Extracting timeless morals and noble ethics from prophetic biographies.'}</div>
      </div>
      <div class="report-box">
        <div class="box-title">🛡️ ${isAr ? 'سياج الأمان الأسري' : 'Family Safe Shield'}</div>
        <div class="box-desc">${isAr ? 'محتوى موثوق 100% مستند لمجمع الملك فهد وموسوعة الدرر السنية.' : '100% verified content for children adhering to authentic sources.'}</div>
      </div>
    </div>
    <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #FDE68A; display: flex; justify-content: space-between; font-size: 12px; color: #92400E;">
      <span>${isAr ? 'التاريخ:' : 'Date:'} ${new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</span>
      <span style="font-weight: 800;">منصة عِلم | ILM Platform</span>
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Top Junior Hero Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
              <Smile className="w-3.5 h-3.5" />
              <span>{isAr ? 'واحة الأطفال والناشئة (6 - 12 سنة)' : 'ILM Junior & Family Shield'}</span>
              <span className="bg-amber-900 text-amber-100 text-[10px] px-2 py-0.5 rounded-full font-bold">
                ⭐ {earnedStars} {isAr ? 'نجمة إيمان' : 'Faith Stars'}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{isAr ? 'بـراعـم عِـلـم | قصص وأخلاق الإيمان' : 'ILM Junior: Faith Stories & Morals'}</span>
              <span className="text-3xl">🌱</span>
            </h1>
            
            <p className="text-sm text-amber-50 leading-relaxed max-w-xl">
              {isAr
                ? 'رحلة تفاعلية قصصية ممتعة تغرس حب الله ورسوله، والأخلاق الكريمة، والوضوء والصلاة في قلوب أطفالنا الصغار.'
                : 'Interactive storytelling instilling love of Allah, prophetic manners, and pure prayer in our children’s hearts.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Tab switch between Junior Stories and Parent Monitor */}
            <div className="bg-black/20 p-1 rounded-2xl flex items-center gap-1">
              <button
                onClick={() => setActiveTab('stories')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'stories' ? 'bg-white text-amber-950 shadow-md' : 'text-white/80 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isAr ? 'القصص التفاعلية' : 'Stories'}</span>
              </button>

              <button
                onClick={() => setActiveTab('family_monitor')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'family_monitor' ? 'bg-white text-amber-950 shadow-md' : 'text-white/80 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isAr ? 'لوحة ولي الأمر' : 'Parent Monitor'}</span>
              </button>
            </div>

            {onBackToMain && (
              <button
                onClick={onBackToMain}
                className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE JUNIOR STORIES */}
      {activeTab === 'stories' && (
        <div className="space-y-6">
          
          {/* Story Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {JUNIOR_STORIES.map((st, idx) => {
              const isSelected = idx === activeStoryIdx;
              const isDone = selectedAnswers[st.id] !== undefined;
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStoryIdx(idx)}
                  className={`p-4 rounded-3xl border text-right transition cursor-pointer relative flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-amber-50/90 border-amber-600 ring-2 ring-amber-500/30 shadow-md' 
                      : 'bg-white border-[#EAE3D6] hover:border-amber-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{st.badgeEmoji}</span>
                      {isDone && (
                        <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isAr ? 'مكتمل' : 'Done'}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isAr ? st.titleAr : st.titleEn}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {st.heroCharacter}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Story Card */}
          <div className="bg-[#FAF7F2] rounded-3xl border border-[#EAE3D6] p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Story Header */}
            <div className="flex items-center gap-3">
              <span className="text-4xl p-3 bg-amber-100 text-amber-900 rounded-2xl border border-amber-200 shrink-0">
                {currentStory.badgeEmoji}
              </span>
              <div>
                <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                  {isAr ? `البطل الصغير: ${currentStory.heroCharacter}` : currentStory.heroCharacter}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                  {isAr ? currentStory.titleAr : currentStory.titleEn}
                </h2>
              </div>
            </div>

            {/* Story Text Box with child-friendly typography */}
            <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-2xs space-y-4">
              <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
                {isAr ? currentStory.storyAr : currentStory.storyEn}
              </p>

              {/* Golden Rule */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-600 shrink-0 fill-amber-400" />
                <div className="text-xs sm:text-sm font-bold">
                  {isAr ? `💡 فائدة ذهبية: ${currentStory.goldenRuleAr}` : `💡 Golden Rule: ${currentStory.goldenRuleEn}`}
                </div>
              </div>

              {/* Quran Verse */}
              <div className="text-xs sm:text-sm font-serif text-emerald-900 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80">
                {isAr ? currentStory.quranProofAr : currentStory.quranProofEn}
              </div>
            </div>

            {/* Interactive Child Question Box */}
            <div className="bg-gradient-to-br from-amber-900 to-amber-950 text-white rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'سؤال التحدي والذكاء للبراعم 🌟' : 'Junior Challenge Question'}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white">
                {isAr ? currentStory.quiz.questionAr : currentStory.quiz.questionEn}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                {(isAr ? currentStory.quiz.optionsAr : currentStory.quiz.optionsEn).map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentStory.id] === oIdx;
                  const isCorrect = oIdx === currentStory.quiz.correctIndex;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(currentStory.id, oIdx, isCorrect)}
                      className={`p-3.5 rounded-xl text-xs sm:text-sm font-bold text-right transition cursor-pointer border ${
                        isSelected && isCorrect
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-300'
                          : isSelected && !isCorrect
                          ? 'bg-rose-700 text-white border-rose-500'
                          : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Celebration Feedback upon answering */}
              {selectedAnswers[currentStory.id] !== undefined && (
                <div className="p-3 bg-white/20 backdrop-blur-xs rounded-xl border border-white/30 text-xs sm:text-sm font-bold text-amber-200 animate-in fade-in flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>
                    {selectedAnswers[currentStory.id] === currentStory.quiz.correctIndex
                      ? (isAr ? currentStory.quiz.celebrationAr : currentStory.quiz.celebrationEn)
                      : (isAr ? 'محاولة طيبة يا بطل، جرب مرة أخرى لتنال نجمة الإيمان!' : 'Good try, attempt again to earn your star!')}
                  </span>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-[#EAE3D6]">
              <button
                disabled={activeStoryIdx === 0}
                onClick={() => setActiveStoryIdx(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 disabled:opacity-40 text-slate-700 hover:bg-slate-100 transition flex items-center gap-2 text-xs font-bold cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                <span>{isAr ? 'القصة السابقة' : 'Previous Story'}</span>
              </button>

              <button
                disabled={activeStoryIdx >= JUNIOR_STORIES.length - 1}
                onClick={() => setActiveStoryIdx(prev => Math.min(JUNIOR_STORIES.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white transition flex items-center gap-2 text-xs font-bold cursor-pointer shadow-xs"
              >
                <span>{isAr ? 'القصة التالية' : 'Next Story'}</span>
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: PARENT PROGRESS MONITOR */}
      {activeTab === 'family_monitor' && (
        <div className="bg-[#FAF7F2] rounded-3xl border border-[#EAE3D6] p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE3D6]">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-700" />
                <span>{isAr ? 'لوحة متابعة ولي الأمر (Family Progress Monitor)' : 'Family Progress Monitor'}</span>
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {isAr ? 'ملخص إنجاز الطفل في حفظ الآداب ومفاهيم الإيمان والقصص التربوية' : 'Summary of child’s learning achievements in Islamic morals and stories'}
              </p>
            </div>

            <button
              onClick={handlePrintFamilyReport}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span>{isAr ? 'طباعة تقرير الإنجاز' : 'Print Report'}</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-1">
              <span className="text-xs text-slate-500 font-bold">{isAr ? 'نجوم الإيمان المكتسبة' : 'Faith Stars'}</span>
              <div className="text-2xl font-extrabold text-amber-600 flex items-center gap-1.5">
                <span>⭐</span>
                <span>{earnedStars}</span>
              </div>
              <p className="text-[10px] text-slate-400">{isAr ? 'مكافآت الإجابات الصحيحة' : 'Rewarded for correct answers'}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-xs text-slate-500 font-bold">{isAr ? 'القصص المكتملة' : 'Stories Completed'}</span>
              <div className="text-2xl font-extrabold text-emerald-600 flex items-center gap-1.5">
                <span>📚</span>
                <span>{Object.keys(selectedAnswers).length} / {JUNIOR_STORIES.length}</span>
              </div>
              <p className="text-[10px] text-slate-400">{isAr ? 'نسبة الاستيعاب: 100%' : 'Comprehension: 100%'}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-blue-200 space-y-1">
              <span className="text-xs text-slate-500 font-bold">{isAr ? 'المستوى التربوي' : 'Pedagogical Level'}</span>
              <div className="text-2xl font-extrabold text-blue-700 flex items-center gap-1.5">
                <span>🌱</span>
                <span>{isAr ? 'برعم متفوق' : 'Rising Seed'}</span>
              </div>
              <p className="text-[10px] text-slate-400">{isAr ? 'جاهز للمرحلة المتقدمة' : 'Ready for next level'}</p>
            </div>
          </div>

          {/* Pedagogical Weekly Advice for Parents */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 space-y-2">
            <h4 className="text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>{isAr ? 'نصيحة الأسبوع التربوية للأمهات والآباء:' : 'Weekly Parenting Wisdom:'}</span>
            </h4>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              {isAr 
                ? 'شجع طفلك عند تطبيقه لأي خلق نبوي في البيت (كالصدق، أو المعاونة، أو ابتداء السلام)، وكافئه بعبارات الثناء والدعاء؛ فالمدح على السلوك الفاضل يرسخ الإيمان في الوجدان أعمق من التلقين النظري.'
                : 'Praise and encourage your child whenever they practice honest behavior at home. Sincere affirmation anchors faith deeper than abstract instruction.'}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
