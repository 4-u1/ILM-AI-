import React, { useState } from 'react';
import { 
  Compass, 
  Globe, 
  Heart, 
  BookOpen, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  ShieldCheck, 
  Languages, 
  Smile, 
  Building2, 
  Users, 
  Coffee, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';

interface EtiquetteGuideItem {
  id: string;
  category: 'masjid' | 'social_greeting' | 'market_work' | 'neighbor_hospitality' | 'occasions';
  titleAr: string;
  titleEn: string;
  titleFr: string;
  titleId: string;
  titleTl: string;
  badgeEmoji: string;
  guidelineAr: string;
  guidelineEn: string;
  guidelineFr: string;
  guidelineId: string;
  guidelineTl: string;
  propheticProofAr: string;
  propheticProofEn: string;
  localSaudiCultureTipAr: string;
  localSaudiCultureTipEn: string;
}

const ETIQUETTE_DATA: EtiquetteGuideItem[] = [
  {
    id: 'etiq-01',
    category: 'masjid',
    titleAr: 'آداب دخول المسجد وصلاة الجماعة',
    titleEn: 'Mosque Etiquette & Congregational Prayer',
    titleFr: 'Étiquette de la Mosquée et Prière en Groupe',
    titleId: 'Adab Masjid & Shalat Berjamaah',
    titleTl: 'Kaugalian sa Moske at Pagdarasal nang Sama-sama',
    badgeEmoji: '🕌',
    guidelineAr: 'خلع الحذاء ووضعه في الأماكن المخصصة، تقديم الرجل اليمنى مع دعاء الدخول، ارتداء لباس ساتر ونظيف، الحفاظ على السكينة، وصلاة ركعتين تحية المسجد قبل الجلوس.',
    guidelineEn: 'Remove shoes at designated racks, enter with right foot saying supplication, wear clean modest attire, maintain serenity, and pray two units (Tahiyyat al-Masjid) before sitting.',
    guidelineFr: 'Retirez vos chaussures aux endroits prévus, entrez du pied droit avec l\'invocation, portez des vêtements modestes et faites deux unités de prière avant de vous asseoir.',
    guidelineId: 'Lepaskan sepatu di tempatnya, masuk dengan kaki kanan membaca doa, kenakan pakaian bersih sopan, dan tunaikan shalat Tahiyyatul Masjid dua rakaat sebelum duduk.',
    guidelineTl: 'Hubarin ang sapatos sa tamang lagayan, pumasok gamit ang kanang paa kalakip ang panalangin, magsuot ng maayos at magdasal ng dalawang rakaat bago umupo.',
    propheticProofAr: 'قال النبي ﷺ: «إذا دخل أحدكم المسجد فلا يجلس حتى يصلي ركعتين» [متفق عليه].',
    propheticProofEn: 'The Prophet ﷺ said: "When one of you enters the mosque, let them not sit until they pray two rak\'ahs." [Agreed Upon].',
    localSaudiCultureTipAr: 'في مساجد المملكة والعالم الإسلامي يحرص المصلون على إغلاق الهواتف أو وضعها على الصامت، وتسوية الصفوف بالتراص والتآلف.',
    localSaudiCultureTipEn: 'In Saudi and global mosques, worshippers ensure phones are silenced and rows are straightened shoulder-to-shoulder with warmth.'
  },
  {
    id: 'etiq-02',
    category: 'social_greeting',
    titleAr: 'إفشاء السلام والمصافحة والتحية',
    titleEn: 'Spreading Peace (Salam) & Warm Greeting',
    titleFr: 'Répandre la Paix (Salam) et Salutations',
    titleId: 'Menyebarkan Salam & Menyapa dengan Hangat',
    titleTl: 'Pagpapalaganap ng Kapayapaan (Salam) at Pagbati',
    badgeEmoji: '🤝',
    guidelineAr: 'ابتداء التحية بقول: «السلام عليكم ورحمة الله وبركاته» للمألوف والغريب، والرد بمثلها أو أحسن منها، والمصافحة باليد اليمنى مع البشاشة والتبسم الصادق.',
    guidelineEn: 'Initiate greetings with "As-salamu alaykum wa rahmatullah" to acquaintances and strangers alike, respond with equal or better warmth, and shake hands with right hand warmly.',
    guidelineFr: 'Commencez par saluer avec «As-salamu alaykum», répondez avec chaleur, et serrez la main droite avec un sourire bienveillant.',
    guidelineId: 'Ucapkan salam "Assalamu alaikum" kepada yang dikenal maupun yang tidak dikenal, dan jabat tangan dengan tangan kanan disertai senyuman ramah.',
    guidelineTl: 'Simulan ang pagbati sa pagsasabi ng "As-salamu alaykum" sa kakilala o hindi kakilala, at makipagkamay gamit ang kanang kamay nang may ngiti.',
    propheticProofAr: 'قال النبي ﷺ: «أفشوا السلام بينكم تحابوا» [صحيح مسلم].',
    propheticProofEn: 'The Prophet ﷺ said: "Spread peace among yourselves, and you will love one another." [Sahih Muslim].',
    localSaudiCultureTipAr: 'التحية المصحوبة بالترحيب وعبارات مثل «حياك الله» و«أهلاً وسهلاً» تعكس كرم الأخوة الإسلامية وثقافة الترحاب الأصيلة.',
    localSaudiCultureTipEn: 'Warm Arab phrases like "Hayyak Allah" (May Allah preserve you) accompany Salam, expressing deep Islamic hospitality.'
  },
  {
    id: 'etiq-03',
    category: 'market_work',
    titleAr: 'الأمانة والسماحة في البيع والشراء والعمل',
    titleEn: 'Honesty & Grace in Commerce & Work',
    titleFr: 'Honnêteté et Bienveillance dans le Commerce',
    titleId: 'Kejujuran & Kemudahan dalam Jual Beli dan Kerja',
    titleTl: 'Katapatan at Pagpaparaya sa Kalakalan at Trabaho',
    badgeEmoji: '🛍️',
    guidelineAr: 'الوضوح والصدق التام في المعاملات دون غش أو تدليس، السماحة عند البيع والشراء والتقاضي، وتوقير أوقات الأذان والصلاة بإغلاق المتاجر والتوجه للمسجد.',
    guidelineEn: 'Full transparency in commercial transactions without deception, grace in buying and selling, and respecting prayer times upon the call to prayer.',
    guidelineFr: 'Transparence totale dans les transactions sans tromperie, bienveillance dans les affaires et respect des heures de prière.',
    guidelineId: 'Kejujuran penuh dalam jual beli tanpa penipuan, bersikap lapang dada, dan menghormati waktu shalat saat adzan berkumandang.',
    guidelineTl: 'Maging tapat sa pakikipagkalakalan nang walang panlilinlang, maging magalang at igalang ang oras ng pagdarasal.',
    propheticProofAr: 'قال النبي ﷺ: «رحم الله رجلاً سمحاً إذا باع، وإذا اشترى، وإذا اقتضى» [صحيح البخاري].',
    propheticProofEn: 'The Prophet ﷺ said: "May Allah have mercy on a person who is lenient when selling, buying, and demanding their rights." [Sahih Bukhari].',
    localSaudiCultureTipAr: 'المجتمع يثمّن الصدق والأمانة في المواعيد، وفي مواسم العبادات كرمضان تتجلى السماحة والخصومات والصدقات في الأسواق.',
    localSaudiCultureTipEn: 'Society deeply values punctuality and integrity; during Ramadan, markets abound with charity and generous concessions.'
  },
  {
    id: 'etiq-04',
    category: 'neighbor_hospitality',
    titleAr: 'حق الجار وإكرام الضيف ومشاركة الطعام',
    titleEn: 'Rights of Neighbors & Islamic Hospitality',
    titleFr: 'Droits du Voisin et Hospitalité Islamique',
    titleId: 'Hak Tetangga & Memuliakan Tamu',
    titleTl: 'Karapatan ng Kapitbahay at Pagpapatuloy sa Bisita',
    badgeEmoji: '☕',
    guidelineAr: 'كف الأذى عن الجار وتفقد أحواله، إكرام الضيف بتقديم القهوة والتمر والترحيب البشوش، وإهداء الطعام للجار تعزيزاً للألفة والمحبة.',
    guidelineEn: 'Avoid causing harm to neighbors, look after their well-being, honor guests with warm coffee and dates, and gift food to build fraternal affection.',
    guidelineFr: 'Préservez le voisin de tout tort, honorez vos invités avec des dattes et du café, et partagez vos plats pour renforcer la fraternité.',
    guidelineId: 'Jangan menyakiti tetangga, muliakan tamu dengan kopi dan kurma, serta saling berbagi makanan untuk mempererat tali persaudaraan.',
    guidelineTl: 'Iwasang makapinsala sa kapitbahay, igalang ang mga bisita at magbahagi ng pagkain upang mapatatag ang ugnayan.',
    propheticProofAr: 'قال النبي ﷺ: «من كان يؤمن بالله واليوم الآخر فليكرم جاره» [متفق عليه].',
    propheticProofEn: 'The Prophet ﷺ said: "Whoever believes in Allah and the Last Day, let them honor their neighbor." [Agreed Upon].',
    localSaudiCultureTipAr: 'تقديم القهوة السعودية باليمين واستقبال الضيف في المجلس بعبارات الترحيب واجب أصيل يعكس الهدي النبوي في الإكرام.',
    localSaudiCultureTipEn: 'Serving traditional Arabic coffee with the right hand in the majlis is an authentic tradition reflecting prophetic hospitality.'
  }
];

interface CulturalEtiquetteHubProps {
  language: Language;
  onBackToMain?: () => void;
}

export const CulturalEtiquetteHub: React.FC<CulturalEtiquetteHubProps> = ({
  language,
  onBackToMain
}) => {
  const isAr = language === 'ar';
  const [selectedLanguage, setSelectedLanguage] = useState<'ar' | 'en' | 'fr' | 'id' | 'tl'>('ar');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'masjid' | 'social_greeting' | 'market_work' | 'neighbor_hospitality'>('all');

  const filteredItems = ETIQUETTE_DATA.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300" dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Globe className="w-3.5 h-3.5" />
              <span>{isAr ? 'دليل التوطين الثقافي والاجتماعي للجاليات' : 'Expatriates & Cultural Etiquette Guide'}</span>
              <span className="bg-blue-400 text-blue-950 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold">5 Languages</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>{isAr ? 'دليل الآداب والمعاملات في المجتمع المسلم' : 'Islamic Social Etiquette & Daily Life Guide'}</span>
              <span className="text-2xl">🌏</span>
            </h1>
            
            <p className="text-sm text-blue-100/90 leading-relaxed">
              {isAr
                ? 'مرشد عملي متعدد اللغات يعرّف المقيمين والمهتدين الجدد بآداب المساجد، إفشاء السلام، التعامل في الأسواق، وحسن الجوار في ضوء الهدي النبوي.'
                : 'A multilingual practical guide introducing new Muslims and expatriates to mosque etiquette, warm greetings, commerce ethics, and hospitality.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            {/* Language Switcher for Expatriates */}
            <div className="bg-white/10 p-1 rounded-2xl flex items-center gap-1 border border-white/20">
              {[
                { code: 'ar', label: 'العربية' },
                { code: 'en', label: 'English' },
                { code: 'fr', label: 'Français' },
                { code: 'id', label: 'Bahasa' },
                { code: 'tl', label: 'Tagalog' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code as any)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedLanguage === lang.code 
                      ? 'bg-blue-500 text-white shadow-xs' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {onBackToMain && (
              <button
                onClick={onBackToMain}
                className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: isAr ? '🌟 جميع الآداب' : 'All Guidelines' },
          { id: 'masjid', label: isAr ? '🕌 آداب المسجد' : 'Mosque Etiquette' },
          { id: 'social_greeting', label: isAr ? '🤝 إفشاء السلام والتحية' : 'Greetings & Salam' },
          { id: 'market_work', label: isAr ? '🛍️ المعاملات والأسواق' : 'Commerce & Work' },
          { id: 'neighbor_hospitality', label: isAr ? '☕ الجار والضيافة' : 'Hospitality & Neighbors' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-blue-50 border border-[#EAE3D6]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Etiquette Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map(item => {
          const title = 
            selectedLanguage === 'fr' ? item.titleFr :
            selectedLanguage === 'id' ? item.titleId :
            selectedLanguage === 'tl' ? item.titleTl :
            selectedLanguage === 'en' ? item.titleEn : item.titleAr;

          const guideline = 
            selectedLanguage === 'fr' ? item.guidelineFr :
            selectedLanguage === 'id' ? item.guidelineId :
            selectedLanguage === 'tl' ? item.guidelineTl :
            selectedLanguage === 'en' ? item.guidelineEn : item.guidelineAr;

          return (
            <div
              key={item.id}
              className="bg-[#FAF7F2] rounded-3xl border border-[#EAE3D6] p-6 shadow-sm space-y-4 hover:border-blue-300 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-blue-100 text-blue-950 rounded-2xl border border-blue-200">
                      {item.badgeEmoji}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {title}
                      </h3>
                      <span className="text-[11px] text-blue-800 font-semibold">
                        {item.category === 'masjid' ? (isAr ? 'بيوت الله' : 'House of Allah') :
                         item.category === 'social_greeting' ? (isAr ? 'الترابط المجتمعي' : 'Social Bond') :
                         item.category === 'market_work' ? (isAr ? 'النزاهة والعمل' : 'Integrity & Commerce') : (isAr ? 'الإكرام والمحبة' : 'Hospitality')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Guideline Explanation */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-100">
                  {guideline}
                </p>

                {/* Hadith / Scripture Proof */}
                <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-[11px] sm:text-xs text-emerald-950 font-serif">
                  {selectedLanguage === 'ar' ? item.propheticProofAr : item.propheticProofEn}
                </div>
              </div>

              {/* Cultural Context Tip */}
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-blue-950 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                  <span>{isAr ? '💡 في الواقع المجتمعي للمسلمين:' : '💡 Social & Cultural Context:'}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-blue-900/90 leading-relaxed">
                  {selectedLanguage === 'ar' ? item.localSaudiCultureTipAr : item.localSaudiCultureTipEn}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
