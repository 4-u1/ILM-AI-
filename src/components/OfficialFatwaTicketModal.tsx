import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  Phone, 
  PhoneCall,
  ExternalLink, 
  Copy, 
  Check, 
  FileText, 
  Building2,
  Mail,
  AlertCircle
} from 'lucide-react';
import { Language } from '../types';

export type FatwaCategory = 'طلاق وأحوال شخصية' | 'مواريث وتركات' | 'نزاعات مالية' | 'نوازل وقضايا عامة';

interface OfficialFatwaTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  userQuestion?: string;
  category?: FatwaCategory;
  ticketCode?: string;
  generatedDate?: Date;
}

export const OfficialFatwaTicketModal: React.FC<OfficialFatwaTicketModalProps> = ({
  isOpen,
  onClose,
  language,
  userQuestion,
  category,
  ticketCode,
  generatedDate,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;

  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Generate dynamic ticket code and category if not passed
  const effectiveQuestion = userQuestion?.trim() || (isAr 
    ? 'استفتاء في مسألة شخصية تستوجب الإحالة الشرعية للجهات المعتمدة (المستوى د)'
    : 'Personal inquiry requiring official scholarly referral under Level D');

  const effectiveCategory: FatwaCategory = useMemo(() => {
    if (category) return category;
    const q = effectiveQuestion.toLowerCase();
    if (q.includes('ميراث') || q.includes('تركة') || q.includes('ورث') || q.includes('وصية')) {
      return 'مواريث وتركات';
    }
    if (q.includes('دين') || q.includes('قرض') || q.includes('معاملة') || q.includes('نزاع') || q.includes('عقد')) {
      return 'نزاعات مالية';
    }
    if (q.includes('طلاق') || q.includes('طالق') || q.includes('خلع') || q.includes('زوج') || q.includes('نكاح') || q.includes('عدة')) {
      return 'طلاق وأحوال شخصية';
    }
    return 'طلاق وأحوال شخصية';
  }, [category, effectiveQuestion]);

  const effectiveTicketCode = useMemo(() => {
    if (ticketCode) return ticketCode;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `FATWA-REF-2026-${randomSuffix}`;
  }, [ticketCode]);

  const timestampString = useMemo(() => {
    const d = generatedDate || new Date();
    return d.toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }, [generatedDate, isAr]);

  const dateString = useMemo(() => {
    const d = generatedDate || new Date();
    return d.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [generatedDate, isAr]);

  // Official email allocated by the Presidency (as accredited by SPA - Saudi Press Agency)
  const officialEmail = effectiveCategory === 'طلاق وأحوال شخصية' ? 'talak@alifta.gov.sa' : 'fataw@alifta.gov.sa';
  const mailtoSubject = encodeURIComponent(`طلب فتوى شرعية - تذكرة استرشادية [${effectiveTicketCode}]`);
  const mailtoBody = encodeURIComponent(`السلام عليكم ورحمة الله وبركاته،
سماحة المفتي / الرئاسة العامة للبحوث العلمية والإفتاء الموقرة،

أود رفع المسألة التالية لطلب الفتوى الشرعية المعتمدة:
• معرّف التذكرة: ${effectiveTicketCode}
• تصنيف المسألة: ${effectiveCategory}
• نص الاستفسار المستلم: «${effectiveQuestion}»
• تاريخ التوثيق: ${dateString} - ${timestampString}

المرجو التكرم بالفتوى والتوجيه الشرعي المعتمد.
جزاكم الله خيراً.`);
  const mailtoUrl = `mailto:${officialEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

  if (!isOpen) return null;

  const shareText = `📜 بطاقة إحالة إفتائية رسمية مشفرة\nرقم التذكرة: ${effectiveTicketCode}\nالتصنيف: ${effectiveCategory}\nالمسألة: «${effectiveQuestion}»\nالتاريخ: ${dateString} - ${timestampString}\n⚠️ حوكمة منصة عِلم: الامتناع الصارم عن الفتوى الآلية والإحالة للهيئة المعتمدة بالمملكة.\n📞 الرقم الموحد للإفتاء: 8002451000\n✉️ البريد الرسمي للرئاسة: ${officialEmail}\n🌐 المنصة الوطنية الموحدة: https://my.gov.sa`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleCopyPhone = async (phoneNum: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(phoneNum);
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 3500);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleCall = (phoneNum: string = '8002451000') => {
    // 1. Copy number to clipboard as a guaranteed fallback for web/iOS iframe
    handleCopyPhone(phoneNum);
    // 2. Trigger telephone dialer
    try {
      window.location.href = `tel:${phoneNum}`;
    } catch {
      window.open(`tel:${phoneNum}`, '_self');
    }
  };

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(officialEmail);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2500);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDownload = () => {
    const fileContent = `========================================================
منصة عِلم | ILM - وثيقة إحالة إفتائية استرشادية (المستوى د)
========================================================
رمز التذكرة الاسترشادي: ${effectiveTicketCode}
تاريخ التوثيق: ${dateString} • ${timestampString}
تصنيف المسألة: ${effectiveCategory}

[السؤال المستلم من السائل]:
«${effectiveQuestion}»

[ملاحظة سياج الحماية الشرعي]:
بناءً على وثيقة حوكمة المحتوى الشرعي لمنصة عِلم ومطابقتها لمعايير تحدي باذل 2026م، يمتنع النظام آلياً وبشكل حازم عن إصدار أي فتوى أو ترجيح في مسائل الأحوال الشخصية والخلافات الأسرية والمواريث.

[القنوات الرسمية المعتمدة للإرسال والاتصال]:
1. الرقم المجاني الموحد لخدمة الإفتاء بالمملكة:
8002451000 (من داخل المملكة)
0114595555 / 00966114595555 (من خارج المملكة)

2. البريد الإلكتروني الرسمي للرئاسة العامة للإفتاء (معتمد من واس):
${officialEmail}

3. المنصة الوطنية الموحدة (GOV.SA):
https://my.gov.sa

تنبيه هام: تُرسل هذه التذكرة يدوياً بواسطة المستخدم عبر القنوات المذكورة أعلاه لضمان الحصول على الفتوى الشرعية المعتمدة من الجهات المؤهلة بالمملكة العربية السعودية ولا يتم إرسالها آلياً.
========================================================`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ILM-Fatwa-Referral-${effectiveTicketCode}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto safe-area-pb safe-area-pt safe-area-px"
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-white rounded-2xl sm:rounded-3xl border-2 border-emerald-500/40 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Strip - Clean spacing */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-4 sm:px-6 py-3.5 text-white flex items-center justify-between border-b border-emerald-500/30 shrink-0 gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-white font-serif leading-tight">
                  {isAr ? 'بطاقة إحالة إفتائية رسمية' : 'Official Fatwa Referral Ticket'}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] bg-rose-500/25 text-rose-300 border border-rose-500/40 font-bold shrink-0">
                  {isAr ? 'المستوى د' : 'Level D'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/90 font-medium leading-snug mt-0.5">
                {isAr ? 'حوكمة شرعية • حظر الفتوى الشخصية والإحالة للرئاسة' : 'Guardrail Active • Strict Fatwa Stop'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-3.5 sm:p-5 space-y-3.5 overflow-y-auto mobile-scroll-touch flex-1 text-slate-900 font-sans">
          
          {/* Strict Governance Notice */}
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-amber-50/90 border border-amber-300/90 flex items-start gap-2.5 shadow-2xs">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {isAr
                ? 'وفقاً لـ «المستوى د» من وثيقة حوكمة المحتوى الشرعي، يمتنع النظام آلياً عن الفتوى في المسائل الفردية أو إصدار ترجيحات في مسائل الطلاق والمواريث والأحوال الشخصية، ويُصدر نموذج تذكرة إحالة موثقة لتسهيل تدوين مسألتك ونقلها للرئاسة العامة للإفتاء بالمملكة العربية السعودية.'
                : 'Under Level D Content Governance, the system avoids issuing automated religious decrees (Fatwas) on personal disputes, divorce, or estate distribution, offering a formal ticket draft to facilitate your inquiry submission to certified authorities.'}
            </p>
          </div>

          {/* Ticket Details Box */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5 text-xs font-sans">
            
            {/* Row 1: Ticket Code */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-200/80 pb-2.5">
              <span className="text-slate-600 font-medium">
                {isAr ? 'معرّف التذكرة المعتمد:' : 'Ticket Reference ID:'}
              </span>
              <span className="font-mono font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2.5 py-1 rounded-md text-xs tracking-wider self-start sm:self-auto shadow-3xs">
                {effectiveTicketCode}
              </span>
            </div>

            {/* Row 2: Category */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-200/80 pb-2.5">
              <span className="text-slate-600 font-medium">
                {isAr ? 'تصنيف المسألة:' : 'Category:'}
              </span>
              <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto shadow-3xs">
                {effectiveCategory}
              </span>
            </div>

            {/* Row 3: Timestamp & Compliance */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b border-slate-200/80 pb-2.5">
              <span className="text-slate-600 font-medium">
                {isAr ? 'توقيت الرصد والأمان:' : 'Generated At:'}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-800 font-mono text-[11px] font-semibold bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-3xs">
                  {timestampString}
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                  {isAr ? 'معايير باذل 2026م' : 'Bazel 2026'}
                </span>
              </div>
            </div>

            {/* Row 4: User Question Query */}
            <div className="space-y-1.5 pt-1">
              <span className="text-slate-600 font-medium block">
                {isAr ? 'نص الاستفسار المستلم من السائل:' : 'Query Summary:'}
              </span>
              <p className="p-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium text-xs leading-relaxed shadow-3xs break-words">
                «{effectiveQuestion}»
              </p>
            </div>
          </div>

          {/* 📞 Toll Free Direct Contact Hotline - With Double Trigger (Call + Auto-Copy) */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-50/90 border border-emerald-300 flex flex-col gap-3 shadow-3xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-emerald-950">
                    {isAr ? 'الرقم المجاني الموحد لخدمة الإفتاء بالمملكة' : 'Toll-free Ifta Hotline (KSA)'}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-base font-mono font-extrabold text-emerald-800 tracking-wider" dir="ltr">
                      8002451000
                    </p>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      {isAr ? 'مجاني رسمياً' : 'Toll-free'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons: Direct Call + Copy Phone */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <a
                  href="tel:8002451000"
                  onClick={() => handleCopyPhone('8002451000')}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{isAr ? 'اتصال مباشر' : 'Call Now'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyPhone('8002451000')}
                  className="px-3.5 py-2.5 rounded-xl border border-emerald-300 hover:border-emerald-400 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs active:scale-98"
                  title={isAr ? 'نسخ الرقم' : 'Copy Number'}
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 text-[11px]">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-emerald-700" />
                      <span className="text-[11px]">{isAr ? 'نسخ الرقم' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Visual feedback banner when phone copied */}
            {copiedPhone && (
              <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {isAr
                    ? 'تم نسخ الرقم (8002451000) إلى الحافظة! إذا منع المتصفح لوحة الاتصال، يمكنك لصقه فوراً في تطبيق الهاتف.'
                    : 'Number 8002451000 copied to clipboard! You can paste it into your phone dialer.'}
                </span>
              </div>
            )}

            {/* International and landline line */}
            <div className="pt-2 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-1 text-[11px] text-emerald-900">
              <span className="text-emerald-800 font-medium">
                {isAr ? 'للاتصال من خارج المملكة أو من الجوال:' : 'Outside KSA / Landline:'}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="tel:+966114595555"
                  onClick={() => handleCopyPhone('+966114595555')}
                  className="font-mono font-bold text-emerald-950 underline hover:text-emerald-700 cursor-pointer"
                  dir="ltr"
                >
                  +966114595555
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyPhone('+966114595555')}
                  className="p-1 rounded text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100 transition cursor-pointer"
                  title={isAr ? 'نسخ الرقم الدولي' : 'Copy International Number'}
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 🏛️ Official Channels & Portals (Clean & Active URLs) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>{isAr ? 'القنوات والمنصات المعتمدة للإفتاء بالمملكة:' : 'Accredited Official Ifta Channels in KSA:'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. National Unified Portal GOV.SA (Guaranteed Active) */}
              <a
                href="https://my.gov.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 transition flex items-center justify-between group cursor-pointer shadow-3xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                    {isAr ? 'المنصة الوطنية الموحدة (GOV.SA)' : 'Unified National Portal'}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold font-mono">my.gov.sa (بوابة الخدمات الرسمية)</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 shrink-0 ms-2" />
              </a>

              {/* 2. Official Email Submission directly to Ifta Presidency (SPA Accredited) */}
              <a
                href={mailtoUrl}
                className="p-3 rounded-xl border border-amber-300 hover:border-amber-500 bg-amber-50/60 hover:bg-amber-100/50 transition flex items-center justify-between group cursor-pointer shadow-3xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                    <p className="text-xs font-bold text-amber-950">
                      {isAr ? 'إرسال التذكرة بالبريد الرسمي' : 'Send Ticket via Official Email'}
                    </p>
                  </div>
                  <p className="text-[10px] text-amber-800 font-mono font-medium truncate">
                    {officialEmail} (معتمد من واس)
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-amber-700 shrink-0 ms-2" />
              </a>
            </div>

            {/* Email quick copy helper */}
            <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 text-amber-800 shrink-0" />
                <span className="text-amber-900 text-[11px] font-medium truncate">
                  {isAr ? 'بريد فتاوى الرئاسة المعتمد:' : 'Accredited Ifta Email:'} <b className="font-mono">{officialEmail}</b>
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100/80 text-amber-950 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer shrink-0 shadow-3xs"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-800" />}
                <span>{copiedEmail ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ البريد' : 'Copy Email')}</span>
              </button>
            </div>

            {/* Server status note explaining why alifta.gov.sa gives a black screen / 172.16.1.21 */}
            <div className="p-3 rounded-xl bg-slate-100/90 border border-slate-200 text-[11px] text-slate-700 space-y-1 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{isAr ? 'تنويه تقني بخصوص موقع الرئاسة (alifta.gov.sa):' : 'Technical note regarding alifta.gov.sa:'}</span>
              </div>
              <p className="text-[10px] text-slate-600">
                {isAr
                  ? 'يقوم خادم alifta.gov.sa حالياً بإعادة توجيه داخلية نحو عنوان شبكة خاصة (172.16.1.21) يظهر كشاشة سوداء على المتصفحات العامة؛ لذلك وفرت لك المنصة القنوات المعتمدة البديلة: المنصة الوطنية الموحدة (my.gov.sa)، والبريد الإلكتروني المعتمد من وكالة الأنباء السعودية (واس)، والاتصال المجاني المباشر مع ميزة النسخ الفوري.'
                  : 'The alifta.gov.sa domain currently redirects to an internal server IP (172.16.1.21). Official alternatives are provided above.'}
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-3 sm:p-4 bg-[#FAF7F2] border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-2 w-full sm:flex-1">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>{isAr ? 'نسخ التذكرة' : 'Copy'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 py-2.5 px-3 rounded-xl border border-emerald-300 hover:border-emerald-400 bg-emerald-50 text-emerald-950 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs active:scale-98"
            >
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>{isAr ? 'تصدير (TXT)' : 'Export'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer active:scale-98 text-center"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
