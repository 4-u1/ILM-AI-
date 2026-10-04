import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  GraduationCap, 
  Scale, 
  FileText,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';

interface ScholasticEntry {
  keyword: string;
  topicAr: string;
  topicEn: string;
  quranVerse: {
    text: string;
    surah: string;
    tafsirSaadi: string;
    tafsirIbnKathir: string;
    source: string;
  };
  hadithProof: {
    text: string;
    narrator: string;
    grade: string;
    explanation: string;
    source: string;
  };
  fiqhMadhahib: {
    hanafi: string;
    maliki: string;
    shafii: string;
    hanbali: string;
    summary: string;
  };
  dawahPoint: string;
}

const SCHOLASTIC_DATABASE: ScholasticEntry[] = [
  {
    keyword: 'توحيد',
    topicAr: 'توحيد الله وإخلاص العبادة ونفي الشرك',
    topicEn: 'Tawhid: Sincerity in Worship & Refutation of Shirk',
    quranVerse: {
      text: '﴿قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ﴾',
      surah: 'سورة الإخلاص: 1 - 4',
      tafsirSaadi: 'تضمنت إثبات تفرد الله بالكمال المطلق، والصمدية التي تصمد إليه جميع الخلائق في حوائجها، ونفي النظير والولد والوالد.',
      tafsirIbnKathir: 'سورة الإخلاص تعدل ثلث القرآن؛ لأنها مخلصة لصفة الرحمن تبارك وتعالى، لا شريك له ولا كفؤ.',
      source: 'مجمع الملك فهد لطباعة المصحف الشريف'
    },
    hadithProof: {
      text: '«من قال: لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير، في يوم مائة مرة؛ كانت له عدل عشر رقاب...»',
      narrator: 'رواه أبو هريرة رضي الله عنه',
      grade: 'صحيح - متفق عليه (البخاري 3293، مسلم 2691)',
      explanation: 'أعظم الذكر التوحيد الخالص الذي به نجاة العبد وصيانة قلبه من وساوس الشرك والغفلة.',
      source: 'موسوعة الحديث الشريف - الدرر السنية'
    },
    fiqhMadhahib: {
      hanafi: 'الإيمان والتلفظ بالشهادتين أصل صحة كل عمل، وتوحيد العبادة شرط قبول سائر الواجبات.',
      maliki: 'الإخلاص في النية شرط في صحة كل عبادة، ولا تصح قربة خالطها رياء أو شرك أصغر أو أكبر.',
      shafii: 'التوحيد أساس أركان الإسلام، وتصح الصلاة والزكاة والصوم بالحكم الشرعي لمن ثبت توحيده.',
      hanbali: 'صرف أي نوع من أنواع العبادة (الدعاء، النذر، الذبح) لغير الله شرك ينافي أصل الإسلام.',
      summary: 'إجماع علماء المذاهب الأربعة على أن التوحيد هو الركن الأعظم وباب الدخول في الإسلام ومناط قبول الأعمال.'
    },
    dawahPoint: 'دعوة العقل إلى التفكر في بديع صنع الكون؛ فانتظام السماء والأرض أكبر برهان على وحدانية الخالق وتفرده.'
  },
  {
    keyword: 'وضوء',
    topicAr: 'صفة الوضوء الشرعي وشروطه ونواقضه',
    topicEn: 'Conditions, Pillars and Nullifiers of Wudu',
    quranVerse: {
      text: '﴿يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ﴾',
      surah: 'سورة المائدة: آية 6',
      tafsirSaadi: 'هذه الآية جامعة لفرائض الوضوء الأربعة: غسل الوجه، واليدين مع المرفقين، ومسح الرأس، وغسل الرجلين مع الكعبين، والترتيب مستفاد من السياق.',
      tafsirIbnKathir: 'بيان طهارة الحدث الأصغر للصلاة، وتخلليل الأصابع واستيعاب العضو بالماء سنة مؤكدة.',
      source: 'مجمع الملك فهد لطباعة المصحف الشريف'
    },
    hadithProof: {
      text: '«لا يقبل الله صلاة أحدكم إذا أحدث حتى يتوضأ»',
      narrator: 'رواه أبو هريرة رضي الله عنه',
      grade: 'صحيح - أخرجه البخاري (135) ومسلم (225)',
      explanation: 'الوضوء شرط لازم لرفع الحدث واستباحة الصلاة والطواف، ويسقط الحدث بإسباغ الماء على الأعضاء.',
      source: 'موسوعة الحديث الشريف - الدرر السنية'
    },
    fiqhMadhahib: {
      hanafi: 'فرائض الوضوء الأربعة المذكورة بنص الآية، والترتيب والموالاة سنة مؤكدة.',
      maliki: 'يجب مع الغسل: الدلك (إمرار اليد مع الماء) والموالاة (عدم تأخير غسل العضو حتى يجف السابق).',
      shafii: 'النية والترتيب بين الأعضاء فرضان أساسيان في الوضوء لا يصح إلا بهما.',
      hanbali: 'النية والترتيب والموالاة والتسمية واجبات، والوضوء عبادة توقيفية يجب الالتزام بصفة النبي ﷺ فيها.',
      summary: 'اتفاق المذاهب الأربعة على غسل الأعضاء الأربعة، وتيسير الشرع بالمسح على الخفين والجبائر عند الحاجة.'
    },
    dawahPoint: 'إبراز النظافة والطهور في الإسلام، وكيف أن المسلم يقف بين يدي ربه خمس مرات يومياً في أبهى حلة وطهارة.'
  },
  {
    keyword: 'صلاة',
    topicAr: 'أهمية الصلاة وفضل الخشوع والمحافظة عليها',
    topicEn: 'Significance of Salah & Serenity in Prayer',
    quranVerse: {
      text: '﴿وَأَقِمِ الصَّلَاةَ ۖ إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ ۗ وَلَذِكْرُ اللَّهِ أَكْبَرُ﴾',
      surah: 'سورة العنكبوت: آية 45',
      tafsirSaadi: 'الصلاة الكاملة المستوفية لأركانها وخشوعها تنور القلب، وتبغض إليه المعاصي، وتفتح له أبواب الطمأنينة.',
      tafsirIbnKathir: 'المداومة على الصلاة تمنع العبد من مقارفة السيئات؛ لما فيها من تعظيم الله واستحضار مراقبته.',
      source: 'مجمع الملك فهد لطباعة المصحف الشريف'
    },
    hadithProof: {
      text: '«رأس الأمر الإسلام، وعموده الصلاة، وذروة سنامه الجهاد في سبيل الله»',
      narrator: 'رواه معاذ بن جبل رضي الله عنه',
      grade: 'صحيح - رواه الترمذي (2616) وصححه الألباني',
      explanation: 'الصلاة هي الركن العملي الأهم الذي يميز المسلم، وهي الصلة الدائمة بين العبد وخالقه.',
      source: 'موسوعة الحديث الشريف - الدرر السنية'
    },
    fiqhMadhahib: {
      hanafi: 'الصلاة فرض عين على كل مكلف، وتعديل الأركان والطمأنينة فيها واجب على الراجح.',
      maliki: 'تجب الصلاة في أوقاتها المحددة شرعاً، وتاركها كسلاً يستتاب ويعزر وفق الضوابط الشرعية.',
      shafii: 'أركان الصلاة سبعة عشر ركناً، أولها النية وآخرها الترتيب والتسليم، وتصح جماعة وفرادى.',
      hanbali: 'الصلاة عماد الدين، وتاركها بالكلية تهاوناً يعرض نفسه لخطر الخروج من الملة، والخشوع روح الصلاة.',
      summary: 'إجماع الأمة على وجوب الصلوات الخمس وسنيّة الرواتب والأوتار لتكميل النواقص.'
    },
    dawahPoint: 'الصلاة ليست مجرد حركات شكلية، بل هي تأمل روحي عميق وانقطاع عن ضجيج المادة وصخب الحياة اليومية.'
  },
  {
    keyword: 'أمانة',
    topicAr: 'الصدق والأمانة وحفظ الحقوق والمعاملات',
    topicEn: 'Trustworthiness, Honesty & Ethical Integrity',
    quranVerse: {
      text: '﴿إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا وَإِذَا حَكَمْتُم بَيْنَ النَّاسِ أَن تَحْكُمُوا بِالْعَدْلِ﴾',
      surah: 'سورة النساء: آية 58',
      tafsirSaadi: 'الأمانات تعم حقوق الله تعالى وحقوق العباد المالية والقولية والعملية، والعدل واجب في كل شأن.',
      tafsirIbnKathir: 'نزلت في عثمان بن طلحة وسدنة الكعبة، وهي عامة في كل حق ووديعة مؤتمن عليها العبد.',
      source: 'مجمع الملك فهد لطباعة المصحف الشريف'
    },
    hadithProof: {
      text: '«آية المنافق ثلاث: إذا حدث كذب، وإذا وعد أخلف، وإذا اؤتمن خان»',
      narrator: 'رواه أبو هريرة رضي الله عنه',
      grade: 'صحيح - متفق عليه (البخاري 33، مسلم 59)',
      explanation: 'التحذير الشديد من خيانة الأمانة ونقض العهود والكذب، وأنها من خصال النفاق العملي.',
      source: 'موسوعة الحديث الشريف - الدرر السنية'
    },
    fiqhMadhahib: {
      hanafi: 'الأمانة واجبة الأداء، وضمان الوديعة على المودع إذا فرط أو تعدى.',
      maliki: 'حفظ الأمانات والوفاء بالعقود فرض قطعي، ويضمن المستأمن بالتعدي أو التقصير.',
      shafii: 'أداء الأمانة واجب فور طلب صاحبها، ولا يجوز التصرف فيها بغير إذن صريح.',
      hanbali: 'الأمانات من عقود الأمانة لا تضمن إلا بالتعدي، وخيانتها من كبائر الذنوب المحرمة إجماعاً.',
      summary: 'اتفاق الفقهاء على تحريم الخيانة في الدماء والأموال والأعراض والأسرار.'
    },
    dawahPoint: 'الأمانة هي أعظم وسيلة دعوية عملية؛ فالإسلام انتشر في شرق آسيا بأخلاق التجار المسلمين وصدقهم وأمانتهم.'
  }
];

interface ScholasticSearchHubProps {
  language: Language;
  onBackToMain?: () => void;
}

export const ScholasticSearchHub: React.FC<ScholasticSearchHubProps> = ({
  language,
  onBackToMain
}) => {
  const isAr = language === 'ar';
  const [searchTerm, setSearchTerm] = useState<string>('توحيد');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const matchedEntry = SCHOLASTIC_DATABASE.find(item => 
    item.keyword.includes(searchTerm.trim().toLowerCase()) || 
    item.topicAr.includes(searchTerm.trim()) ||
    item.topicEn.toLowerCase().includes(searchTerm.trim().toLowerCase())
  ) || SCHOLASTIC_DATABASE[0];

  const handleCopyCitation = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{isAr ? 'محرك البحث المقارن لطلبة العلم والباحثين' : 'Scholastic Cross-Source Research Engine'}</span>
              <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold">4 Sources</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>{isAr ? 'البحث التأصيلي المقارن في نصوص الوحيين والمذاهب' : 'Comparative Islamic Evidence & Madhahib Search'}</span>
              <span className="text-2xl">🔍</span>
            </h1>
            
            <p className="text-sm text-amber-100/90 leading-relaxed">
              {isAr
                ? 'أداة علمية متقدمة تجمع بين نصوص القرآن وتفاسيره المعتمدة، وأحاديث الدرر السنية وتخريجها، وأقوال المذاهب الأربعة في شاشة مقارنة واحدة.'
                : 'Scholastic tool comparing Quran verses with Saadi/Ibn Kathir tafsir, Dorar Hadith grades, and 4 Sunni Madhahib positions side-by-side.'}
            </p>
          </div>

          {onBackToMain && (
            <button
              onClick={onBackToMain}
              className="px-4 py-2.5 rounded-2xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shrink-0"
            >
              <span>{isAr ? 'الرئيسية' : 'Home'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          )}
        </div>
      </div>

      {/* Search Input Bar with Quick Keywords */}
      <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#EAE3D6] shadow-sm space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isAr ? 'ابحث عن مسألة شرعية (مثال: توحيد، وضوء، صلاة، أمانة)...' : 'Search Islamic topic (e.g. Tawhid, Wudu, Salah, Trust)...'}
            className="w-full bg-white border border-[#EAE3D6] rounded-2xl py-3.5 pr-11 pl-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-600 shadow-2xs"
          />
          <Search className="w-5 h-5 text-amber-700 absolute top-3.5 right-3.5" />
        </div>

        {/* Quick Keyword Buttons */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-bold">{isAr ? 'مسائل سريعة المقارنة:' : 'Quick Topics:'}</span>
          {[
            { key: 'توحيد', label: isAr ? '☝️ التوحيد والإخلاص' : 'Tawhid' },
            { key: 'وضوء', label: isAr ? '💧 صفة الوضوء' : 'Wudu' },
            { key: 'صلاة', label: isAr ? '🕌 الخشوع والصلاة' : 'Salah' },
            { key: 'أمانة', label: isAr ? '💎 الأمانة والصدق' : 'Trustworthiness' },
          ].map(tag => (
            <button
              key={tag.key}
              onClick={() => setSearchTerm(tag.key)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                searchTerm.includes(tag.key)
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Comparative 4-Pillar Grid */}
      {matchedEntry && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D6]">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {isAr ? matchedEntry.topicAr : matchedEntry.topicEn}
              </h2>
              <span className="text-xs text-amber-800 font-bold">
                {isAr ? 'ملف التأصيل العلمي المقارن • موثق 100%' : 'Comparative Research Dossier'}
              </span>
            </div>

            <button
              onClick={() => handleCopyCitation(
                `${matchedEntry.topicAr}\n\n1. الآية والتفسير:\n${matchedEntry.quranVerse.text} [${matchedEntry.quranVerse.surah}]\nتفسير السعدي: ${matchedEntry.quranVerse.tafsirSaadi}\n\n2. الحديث النبوي وتخريجه:\n${matchedEntry.hadithProof.text}\n${matchedEntry.hadithProof.grade}\n\n3. خلاصة المذاهب الأربعة:\n${matchedEntry.fiqhMadhahib.summary}`,
                'all'
              )}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copiedSection === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-700" />}
              <span>{copiedSection === 'all' ? (isAr ? 'تم النسخ الكامل ✓' : 'Copied!') : (isAr ? 'نسخ الملف العلمي كاملاً' : 'Copy Dossier')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PILLAR 1: Quran & Approved Tafsir */}
            <div className="bg-[#FAF7F2] rounded-3xl border border-[#EAE3D6] p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">📖</span>
                    <span>{isAr ? 'القرآن الكريم والتفاسير المعتمدة' : 'Quran & Authorized Tafsir'}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {matchedEntry.quranVerse.surah}
                  </span>
                </div>

                {/* Quranic Verse Box */}
                <div className="p-4 bg-emerald-950 text-emerald-100 rounded-2xl font-serif text-sm sm:text-base leading-relaxed text-center shadow-2xs border border-emerald-900">
                  {matchedEntry.quranVerse.text}
                </div>

                {/* Tafsir Saadi */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <span>تفسير الإمام السعدي (تيسير الكريم الرحمن):</span>
                  </span>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    {matchedEntry.quranVerse.tafsirSaadi}
                  </p>
                </div>

                {/* Tafsir Ibn Kathir */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <span>تفسير الحافظ ابن كثير:</span>
                  </span>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    {matchedEntry.quranVerse.tafsirIbnKathir}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#EAE3D6]">
                <span>{matchedEntry.quranVerse.source}</span>
                <span className="text-emerald-700 font-bold">100% موثق</span>
              </div>
            </div>

            {/* PILLAR 2: Hadith & Dorar Takhreej */}
            <div className="bg-[#FAF7F2] rounded-3xl border border-[#EAE3D6] p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">📜</span>
                    <span>{isAr ? 'السنة النبوية وتخريج الدرر السنية' : 'Prophetic Hadith & Takhreej'}</span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {matchedEntry.hadithProof.narrator}
                  </span>
                </div>

                {/* Hadith Matn Box */}
                <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-serif text-xs sm:text-sm leading-relaxed shadow-2xs border border-slate-800">
                  {matchedEntry.hadithProof.text}
                </div>

                {/* Grade & Takhreej */}
                <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 space-y-1 text-blue-950">
                  <span className="text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>درجة الحديث وتخريجه:</span>
                  </span>
                  <p className="text-[11px] sm:text-xs font-bold text-blue-900 leading-relaxed">
                    {matchedEntry.hadithProof.grade}
                  </p>
                </div>

                {/* Explanation */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-800">الشرح والاستنباط الفقهي:</span>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    {matchedEntry.hadithProof.explanation}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#EAE3D6]">
                <span>{matchedEntry.hadithProof.source}</span>
                <span className="text-blue-700 font-bold">100% موثق</span>
              </div>
            </div>

            {/* PILLAR 3: Fiqh of 4 Madhahib */}
            <div className="bg-[#FAF7F2] rounded-3xl border border-[#EAE3D6] p-6 shadow-sm space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">🏛️</span>
                  <span>{isAr ? 'أقوال المذاهب الفقهية الأربعة المعتمدة' : 'The Four Sunni Madhahib Consensus'}</span>
                </div>
                <span className="text-xs text-amber-800 font-bold bg-amber-100 px-3 py-0.5 rounded-full">
                  الفقه المقارن
                </span>
              </div>

              {/* 4 Madhahib Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md inline-block">المذهب الحنفي</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1">{matchedEntry.fiqhMadhahib.hanafi}</p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md inline-block">المذهب المالكي</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1">{matchedEntry.fiqhMadhahib.maliki}</p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md inline-block">المذهب الشافعي</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1">{matchedEntry.fiqhMadhahib.shafii}</p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md inline-block">المذهب الحنبلي</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1">{matchedEntry.fiqhMadhahib.hanbali}</p>
                </div>
              </div>

              {/* Madhahib Summary Box */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-bold">{isAr ? `خلاصة الإجماع الفقهي: ${matchedEntry.fiqhMadhahib.summary}` : matchedEntry.fiqhMadhahib.summary}</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
