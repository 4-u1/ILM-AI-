import React, { useState } from 'react';
import { 
  Share2, 
  Printer, 
  Download, 
  Check, 
  Copy, 
  Globe, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Send, 
  MessageSquare, 
  Layers, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';

interface DawahCardTemplate {
  id: string;
  topicAr: string;
  topicEn: string;
  category: 'tawhid' | 'prophet' | 'women_rights' | 'inner_peace' | 'purpose_of_life';
  badgeEmoji: string;
  translations: {
    [lang: string]: {
      headline: string;
      coreProof: string;
      rationalArgument: string;
      callToAction: string;
    };
  };
}

const DAWAH_CARDS: DawahCardTemplate[] = [
  {
    id: 'card-01',
    topicAr: 'وحدانية الخالق وبراهين التوحيد',
    topicEn: 'Oneness of the Creator & Monotheism',
    category: 'tawhid',
    badgeEmoji: '🌌',
    translations: {
      ar: {
        headline: 'هل تساءلت يوماً عن سر هذا النظام الكوني البديع؟',
        coreProof: '﴿أَمْ خُلِقُوا مِنْ غَيْرِ شَيْءٍ أَمْ هُمُ الْخَالِقُونَ﴾ [الطور: 35]',
        rationalArgument: 'الكون المتقن والقوانين الفيزيائية الثابتة تدل بداهة على وجود خالق واحد حكيم متفرد بالألوهية والربوبية.',
        callToAction: 'اقرأ أكثر عن عظمة التوحيد في منصة «عِلم»: https://weilmai.ai.studio/'
      },
      en: {
        headline: 'Have you ever pondered the magnificent order of the universe?',
        coreProof: '"Or were they created by nothing, or were they the creators of themselves?" [Quran 52:35]',
        rationalArgument: 'The precision of cosmic laws unmistakably points to One Supreme, Wise Creator deserving of all worship.',
        callToAction: 'Discover pure monotheism at ILM Platform: https://weilmai.ai.studio/'
      },
      fr: {
        headline: 'Avez-vous déjà contemplé l\'ordre parfait de l\'univers?',
        coreProof: '«Ont-ils été créés à partir de rien ou sont-ils eux les créateurs?» [Coran 52:35]',
        rationalArgument: 'La précision des lois physiques prouve l\'existence d\'un Créateur Unique et Infiniment Sage.',
        callToAction: 'Découvrez la vérité de l\'Islam sur la plateforme ILM: https://weilmai.ai.studio/'
      },
      id: {
        headline: 'Pernahkah Anda merenungkan keteraturan alam semesta yang menakjubkan ini?',
        coreProof: '"Apakah mereka diciptakan tanpa sesuatu pun ataukah mereka yang menciptakan?" [QS. At-Tur: 35]',
        rationalArgument: 'Hukum alam yang presisi membuktikan adanya Satu Pencipta Yang Maha Kuasa dan Maha Bijaksana.',
        callToAction: 'Pelajari keindahan Islam di platform ILM: https://weilmai.ai.studio/'
      },
      tl: {
        headline: 'Naisip mo ba kung bakit napakaayos ng buong sanlibutan?',
        coreProof: '"Nilikha ba sila mula sa wala, o sila ba ang lumikha sa kanilang sarili?" [Quran 52:35]',
        rationalArgument: 'Ang kaayusan ng kalawakan ay nagpapatunay na may Isang Dakilang Tagapaglikha.',
        callToAction: 'Tuklasin ang Islam sa ILM Platform: https://weilmai.ai.studio/'
      }
    }
  },
  {
    id: 'card-02',
    topicAr: 'محمد ﷺ: رحمة مهداة للعالمين',
    topicEn: 'Muhammad ﷺ: A Mercy to All Creation',
    category: 'prophet',
    badgeEmoji: '🕊️',
    translations: {
      ar: {
        headline: 'رجلٌ غيّر وجه التاريخ بأعظم رسالة أخلاقية عرفتها البشرية',
        coreProof: '﴿وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ﴾ [الأنبياء: 107]',
        rationalArgument: 'لم يطلب النبي ﷺ ملكاً ولا جاهاً، بل دعا إلى إفراد الله بالعبادة، وصيانة الضعفاء، والعدل والرحمة لجميع الأمم.',
        callToAction: 'تعرف على سيرة النبي الخاتم في منصة «عِلم»: https://weilmai.ai.studio/'
      },
      en: {
        headline: 'A man who transformed history through sublime compassion and truth',
        coreProof: '"And We have not sent you except as a mercy to the worlds." [Quran 21:107]',
        rationalArgument: 'Prophet Muhammad ﷺ sought no worldly glory; his entire life championed justice, charity, and pure worship of Allah.',
        callToAction: 'Explore the life of Prophet Muhammad at ILM Platform: https://weilmai.ai.studio/'
      },
      fr: {
        headline: 'Un homme qui a transformé le monde avec une éthique universelle',
        coreProof: '«Et Nous ne t\'avons envoyé qu\'en miséricorde pour l\'univers.» [Coran 21:107]',
        rationalArgument: 'Le Prophète Muhammad ﷺ a prêché la justice, la compassion et la liberté spirituelle pour tous.',
        callToAction: 'Découvrez la vie du Prophète sur ILM: https://weilmai.ai.studio/'
      },
      id: {
        headline: 'Sosok yang mengubah sejarah dengan teladan akhlak mulia dan kasih sayang',
        coreProof: '"Dan Kami tidak mengutus engkau melainkan untuk menjadi rahmat bagi semesta alam." [QS. Al-Anbiya: 107]',
        rationalArgument: 'Nabi Muhammad ﷺ mengajarkan keadilan, kebaikan, dan penghormatan bagi seluruh umat manusia.',
        callToAction: 'Kenali sosok Nabi Muhammad di platform ILM: https://weilmai.ai.studio/'
      },
      tl: {
        headline: 'Isang tao na nagbago sa kasaysayan sa pamamagitan ng kabutihan at katarungan',
        coreProof: '"At hindi ka Namin isinugo kundi bilang isang habag sa mga nilikha." [Quran 21:107]',
        rationalArgument: 'Itinuro ni Propeta Muhammad ang pagmamahalan, katarungan, at pagka-isa sa ilalim ng Diyos.',
        callToAction: 'Alamin ang tungkol kay Propeta Muhammad sa ILM: https://weilmai.ai.studio/'
      }
    }
  },
  {
    id: 'card-03',
    topicAr: 'تكريم المرأة وحقوقها في الإسلام',
    topicEn: 'The Honor & Elevated Status of Women in Islam',
    category: 'women_rights',
    badgeEmoji: '🌸',
    translations: {
      ar: {
        headline: 'الإسلام كفل للمرأة استقلاليتها وكرامتها الإنسانية والمالية',
        coreProof: 'قال النبي ﷺ: «إنما النساء شقائق الرجال» [رواه أبو داود وصححه الألباني]',
        rationalArgument: 'منح الإسلام المرأة حق التملك، والميراث، والتعليم، وحفظ مكانتها بنتاً وزوجة وأماً وجعل الجنة تحت أقدام الأمهات.',
        callToAction: 'استكشف مكانة المرأة السامية في الإسلام: https://weilmai.ai.studio/'
      },
      en: {
        headline: 'Islam established unprecedented dignity, financial and spiritual rights for women',
        coreProof: 'Prophet Muhammad ﷺ said: "Indeed, women are the full counterparts of men." [Abu Dawud]',
        rationalArgument: 'Islam granted women the independent right to property, education, and made honoring mothers the path to Paradise.',
        callToAction: 'Learn about women’s honor in Islam at ILM Platform: https://weilmai.ai.studio/'
      },
      fr: {
        headline: 'L\'Islam a garanti la dignité et les droits financiers complets de la femme',
        coreProof: 'Le Prophète ﷺ a dit: «Les femmes sont les égales des hommes.» [Abou Dawoud]',
        rationalArgument: 'L\'Islam a accordé à la femme le droit à l\'héritage, à la propriété et à l\'éducation bien avant l\'époque moderne.',
        callToAction: 'Consultez la vérité sur la femme en Islam: https://weilmai.ai.studio/'
      },
      id: {
        headline: 'Islam memuliakan wanita dengan hak spiritual, finansial, dan sosial yang mulia',
        coreProof: 'Nabi ﷺ bersabda: "Sesungguhnya wanita adalah saudara kandung bagi pria." [HR. Abu Dawud]',
        rationalArgument: 'Islam memberikan hak kepemilikan harta, pendidikan, dan menempatkan surga di bawah telapak kaki ibu.',
        callToAction: 'Pelajari kemuliaan wanita dalam Islam: https://weilmai.ai.studio/'
      },
      tl: {
        headline: 'Itinaas ng Islam ang dangal at karapatan ng mga kababaihan',
        coreProof: 'Sinabi ng Propeta ﷺ: "Ang mga kababaihan ay katuwang at kapantay ng mga kalalakihan." [Abu Dawud]',
        rationalArgument: 'Binigyan ng Islam ang kababaihan ng karapatan sa ari-arian, edukasyon, at paggalang.',
        callToAction: 'Tuklasin ang karapatan ng kababaihan sa ILM: https://weilmai.ai.studio/'
      }
    }
  }
];

interface FieldDaiyahHubProps {
  language: Language;
  onBackToMain?: () => void;
}

export const FieldDaiyahHub: React.FC<FieldDaiyahHubProps> = ({
  language,
  onBackToMain
}) => {
  const isAr = language === 'ar';
  const [selectedLanguage, setSelectedLanguage] = useState<'ar' | 'en' | 'fr' | 'id' | 'tl'>('en');
  const [activeCardIdx, setActiveCardIdx] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const currentCard = DAWAH_CARDS[activeCardIdx] || DAWAH_CARDS[0];
  const activeContent = currentCard.translations[selectedLanguage] || currentCard.translations.en;

  const handleCopyText = () => {
    const textToCopy = `✨ ${activeContent.headline}\n\n📖 ${activeContent.coreProof}\n\n💡 ${activeContent.rationalArgument}\n\n🔗 ${activeContent.callToAction}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const handleShareWhatsApp = () => {
    const textToShare = encodeURIComponent(`✨ *${activeContent.headline}*\n\n📖 ${activeContent.coreProof}\n\n💡 ${activeContent.rationalArgument}\n\n🔗 ${activeContent.callToAction}`);
    window.open(`https://api.whatsapp.com/send?text=${textToShare}`, '_blank');
  };

  const handlePrintCard = () => {
    const isRtlLang = selectedLanguage === 'ar' || (selectedLanguage as string) === 'ur';
    const htmlContent = `<!DOCTYPE html>
<html lang="${selectedLanguage}" dir="${isRtlLang ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8" />
  <title>بطاقة دعوية - ${activeContent.headline}</title>
  <style>
    @page { size: landscape; margin: 10mm; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Arabic', sans-serif;
      background-color: #064E3B;
      margin: 0;
      padding: 24px;
      color: #FFFFFF;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .card-frame {
      border: 3px solid #34D399;
      border-radius: 20px;
      background: linear-gradient(135deg, #064E3B 0%, #022C22 100%);
      padding: 30px 36px;
      color: #FFFFFF;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(52, 211, 153, 0.4);
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .card-logo {
      font-weight: 900;
      font-size: 16px;
      color: #6EE7B7;
    }
    .headline {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 16px;
      color: #FFFFFF;
    }
    .proof-box {
      background: rgba(6, 78, 59, 0.6);
      border: 1px solid #10B981;
      border-radius: 12px;
      padding: 16px;
      font-size: 15px;
      line-height: 1.7;
      color: #A7F3D0;
      margin-bottom: 16px;
    }
    .argument {
      font-size: 14px;
      line-height: 1.7;
      color: #E2E8F0;
      margin-bottom: 16px;
    }
    .footer {
      border-top: 1px solid rgba(52, 211, 153, 0.4);
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #6EE7B7;
    }
  </style>
</head>
<body>
  <div class="card-frame">
    <div class="card-top">
      <div class="card-logo">منصة عِلم | ILM Outreach Kit</div>
      <div>${currentCard.badgeEmoji}</div>
    </div>
    <div class="headline">${activeContent.headline}</div>
    <div class="proof-box">${activeContent.coreProof}</div>
    <div class="argument">💡 ${activeContent.rationalArgument}</div>
    <div class="footer">
      <span>${activeContent.callToAction}</span>
      <span>مجمع الملك فهد وموسوعة الدرر السنية ✦</span>
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300" dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Zap className="w-3.5 h-3.5" />
              <span>{isAr ? 'حقيبة وبوابة الداعية الميداني والمكاتب الدعوية' : 'Field Da\'iyah Hub & Multi-Language Outreach Kit'}</span>
              <span className="bg-emerald-400 text-emerald-950 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold">Instant Export</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>{isAr ? 'مولد البطاقات الدعوية الرقمية الجاهزة للتوزيع والطباعة' : 'Multi-Language Dawah Cards & Instant Share'}</span>
              <span className="text-2xl">🖨️</span>
            </h1>
            
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              {isAr
                ? 'أداة ميدانية تمكّن الدعاة والجمعيات من تصدير بطاقات دعوية رقمية رصينة ومترجمة بـ 5 لغات لمشاركتها عبر الواتساب أو طباعتها وتوزيعها على الزوار والمهتمين.'
                : 'Empowering field advocates and non-profits with high-definition multi-language cards for WhatsApp outreach and physical printing.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            {/* Language Selector */}
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
                      ? 'bg-emerald-500 text-white shadow-xs' 
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
                className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cards Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DAWAH_CARDS.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => setActiveCardIdx(idx)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeCardIdx === idx
                ? 'bg-emerald-900 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-[#EAE3D6]'
            }`}
          >
            <span>{card.badgeEmoji}</span>
            <span>{selectedLanguage === 'ar' ? card.topicAr : card.topicEn}</span>
          </button>
        ))}
      </div>

      {/* Main High-Definition Printable Dawah Card Presentation */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#EAE3D6] p-6 sm:p-10 shadow-sm space-y-6">
        
        {/* The Printable Visual Card */}
        <div 
          id="printable-dawah-card"
          className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-800/60 relative overflow-hidden space-y-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Card Top Brand & Category */}
          <div className="flex items-center justify-between border-b border-emerald-800/60 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-bold text-sm">
                عِلم
              </span>
              <div>
                <span className="text-xs font-bold text-emerald-300 tracking-wider">ILM PLATFORM • DAWAH DIGEST</span>
                <p className="text-[10px] text-slate-400">Authentic Monotheistic Knowledge 100%</p>
              </div>
            </div>
            <span className="text-2xl">{currentCard.badgeEmoji}</span>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {activeContent.headline}
            </h2>
          </div>

          {/* Scripture Core Proof */}
          <div className="p-4 bg-emerald-900/40 rounded-2xl border border-emerald-700/50 text-emerald-200 font-serif text-sm sm:text-base leading-relaxed">
            {activeContent.coreProof}
          </div>

          {/* Rational & Spiritual Argument */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
              {selectedLanguage === 'ar' ? '💡 البرهان العقلي والهداية:' : '💡 Rational Reflection:'}
            </span>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {activeContent.rationalArgument}
            </p>
          </div>

          {/* Card Footer Call to Action */}
          <div className="pt-4 border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-300">
            <span>{activeContent.callToAction}</span>
            <span className="text-[10px] text-slate-400">Verified & Curated</span>
          </div>
        </div>

        {/* Action Controls for Advocates (WhatsApp, Print, Copy) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
              title="إرسال فوري للواتساب"
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? 'مشاركة عبر واتساب' : 'Share via WhatsApp'}</span>
            </button>

            <button
              onClick={handlePrintCard}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs"
              title="طباعة البطاقة بجودة عالية"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>{isAr ? 'طباعة البطاقة' : 'Print Card'}</span>
            </button>

            <button
              onClick={handleCopyText}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-emerald-700" />}
              <span>{isCopied ? (isAr ? 'تم النسخ ✓' : 'Copied!') : (isAr ? 'نسخ النص الدعوي' : 'Copy Text')}</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            <span>{isAr ? 'جاهزة للنشر الفوري والميداني' : 'Ready for Field Distribution'}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
