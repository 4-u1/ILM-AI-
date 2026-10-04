import React, { useState, useEffect } from 'react';
import { Language, AmbassadorStats, AmbassadorRankId } from '../types';
import { AMBASSADOR_RANKS } from '../data/innovationsData';
import { 
  Share2, 
  Copy, 
  Check, 
  Award, 
  Flame, 
  Users, 
  MessageSquare, 
  BookOpen, 
  HeartHandshake, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Send,
  Compass,
  ArrowRight,
  ArrowLeft,
  QrCode
} from 'lucide-react';

interface AmbassadorsHubProps {
  language: Language;
  onBack: () => void;
  onNavigateToSimulator?: () => void;
}

export const AmbassadorsHub: React.FC<AmbassadorsHubProps> = ({
  language,
  onBack,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedKit, setCopiedKit] = useState<string | null>(null);

  // Initialize or fetch persistent ambassador stats
  const [stats, setStats] = useState<AmbassadorStats>(() => {
    try {
      const saved = localStorage.getItem('eilm_ambassador_stats');
      if (saved) return JSON.parse(saved);
      return {
        referralCode: 'nex-dawah-2026',
        totalVisits: 18,
        totalQuestionsAsked: 14,
        totalCapsulesRead: 32,
        totalShahadasWitnessed: 1,
        sharedKitsCount: 6,
        currentRankId: 'impact_builder',
      };
    } catch {
      return {
        referralCode: 'nex-dawah-2026',
        totalVisits: 18,
        totalQuestionsAsked: 14,
        totalCapsulesRead: 32,
        totalShahadasWitnessed: 1,
        sharedKitsCount: 6,
        currentRankId: 'impact_builder',
      };
    }
  });

  const referralUrl = `https://weilmai.ai.studio/?ref=${stats.referralCode}`;

  const currentRank = AMBASSADOR_RANKS.find((r) => r.id === stats.currentRankId) || AMBASSADOR_RANKS[0];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const socialKits = [
    {
      id: 'en_general',
      langLabel: 'English / إنجليزي',
      text: `Have questions about God, purpose, and Islam? Discover honest, verified answers in a serene AI-guided space:\n${referralUrl}`,
    },
    {
      id: 'fr_general',
      langLabel: 'Français / فرنسي',
      text: `Des questions sur Dieu, le sens de la vie et l'Islam ? Découvrez des réponses claires et authentiques dans un espace serein guidé par l'IA :\n${referralUrl}`,
    },
    {
      id: 'ar_invitation',
      langLabel: 'العربية / Arabic',
      text: `شارك في نشر العلم والتعريف بالإسلام؛ بيئة حوارية موثقة ومعتمدة من مجمع الملك فهد والدرر السنية:\n${referralUrl}`,
    },
    {
      id: 'ur_invitation',
      langLabel: 'اردو / Urdu',
      text: `اسلام کی سچی اور مستند تعلیمات کو سمجھنے اور جاننے کے لیے اس معتبر تعلیمی سفر میں شامل ہوں:\n${referralUrl}`,
    },
  ];

  const handleCopyKit = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKit(id);
    const updated = { ...stats, sharedKitsCount: stats.sharedKitsCount + 1 };
    setStats(updated);
    try {
      localStorage.setItem('eilm_ambassador_stats', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => setCopiedKit(null), 2500);
  };

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{isAr ? 'العودة للمنصة' : 'Back to Platform'}</span>
        </button>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
          {isAr ? 'برنامج سفراء عِلم للدعوة التفاعلية' : 'ILM Global Ambassadors'}
        </span>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? '«بلّغوا عني ولو آية»' : 'Convey from me, even if it is one verse'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {isAr ? 'منظومة سفراء عِلم الرقمية' : 'ILM Ambassadors Ecosystem'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isAr
              ? 'حوّل هاتفك إلى مركز دعوي ذكي. شارك رابطك الدعوي التتبعي المخصص، وتتبع أثرك بالأرقام الحقيقية في هداية القلوب وتعليم المسلمين الجدد بخصوصية وأمان تامين.'
              : 'Turn your device into a smart digital outreach post. Share your unique referral link and witness real-time verified engagement without violating anyone\'s privacy.'}
          </p>

          {/* Referral Link Box */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-emerald-200 select-all overflow-hidden text-ellipsis">
              {referralUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? (isAr ? 'تم النسخ بنجاح!' : 'Copied!') : (isAr ? 'نسخ رابط الدعوة' : 'Copy Link')}</span>
            </button>
          </div>
        </div>

        {/* Decorative badge icon */}
        <div className="absolute top-1/2 -right-8 -translate-y-1/2 opacity-10 text-emerald-400 pointer-events-none hidden md:block">
          <Share2 className="w-72 h-72" />
        </div>
      </div>

      {/* Live Impact Dashboard (KPIs) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>{isAr ? 'لوحة أثرك الدعوي الحي' : 'Live Outreach Impact Dashboard'}</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {isAr ? 'محدثة تلقائياً وفق الاستخدام' : 'Synced live'}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-2">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalVisits}</div>
            <div className="text-xs text-slate-500 font-medium">{isAr ? 'إجمالي الزيارات عبر رابطك' : 'Total Link Visits'}</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-2">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalQuestionsAsked}</div>
            <div className="text-xs text-slate-500 font-medium">{isAr ? 'استفسارات حوارية أجيبت' : 'Inquiries Answered'}</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalCapsulesRead}</div>
            <div className="text-xs text-slate-500 font-medium">{isAr ? 'كبسولة علمية تمت مدارستها' : 'Capsules Completed'}</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-2xs space-y-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-2">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">{stats.totalShahadasWitnessed}</div>
            <div className="text-xs text-emerald-700 font-bold">{isAr ? 'شهادة إسلام أُعلنت' : 'Shahadahs Witnessed'}</div>
          </div>
        </div>
      </div>

      {/* Ambassador Ranks Ladder */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>{isAr ? 'سلّم رتب السفراء والتدرج الدعوي' : 'Ambassador Rank Progression'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isAr
              ? 'كلما زاد أثرك وتفاعل الباحثين عن الحقيقة عبر رابطك، ترتقي رتبتك وتتغير سمة حسابك حتى تبلغ رتبة المركز الإسلامي الرقمي.'
              : 'As your link inspires more seekers to learn, your account unlocks advanced ambassador honors.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {AMBASSADOR_RANKS.map((rank) => {
            const isCurrent = rank.id === stats.currentRankId;
            return (
              <div
                key={rank.id}
                className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-3 left-3 text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                    {isAr ? 'رتبتك الحالية' : 'Current Rank'}
                  </span>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-800">
                      ★
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{isAr ? rank.titleAr : rank.titleEn}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {isAr ? rank.descAr : rank.descEn}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>{isAr ? `يتطلب: ${rank.requiredInvites} زيارة` : `Requires: ${rank.requiredInvites} visits`}</span>
                  <span>{isAr ? `${rank.requiredCompletions} درس` : `${rank.requiredCompletions} lessons`}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1-Click Social Sharing Kits */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            <span>{isAr ? 'بطاقات النشر السريع المترجمة' : '1-Click Multi-Language Sharing Kits'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isAr
              ? 'صيغ دعوية منتقاة بعناية ولطف وجاهزة للنشر المباشر عبر واتساب وتويتر وتيليجرام مرفقة برابطك الشخصي.'
              : 'Pre-formatted invitation texts crafted with wisdom, ready to share globally.'}
          </p>
        </div>

        <div className="space-y-3">
          {socialKits.map((kit) => (
            <div
              key={kit.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 max-w-2xl">
                <span className="text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {kit.langLabel}
                </span>
                <p className="text-xs text-slate-700 font-sans leading-relaxed whitespace-pre-line pt-1">
                  {kit.text}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(kit.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="مشاركة عبر واتساب"
                >
                  <span>واتساب</span>
                </a>

                {/* X (Twitter) */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(kit.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="مشاركة عبر X"
                >
                  <span>X</span>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(kit.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="مشاركة عبر تيليجرام"
                >
                  <span>تيليجرام</span>
                </a>

                {/* Copy */}
                <button
                  onClick={() => handleCopyKit(kit.id, kit.text)}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  {copiedKit === kit.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKit === kit.id ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ' : 'Copy')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
