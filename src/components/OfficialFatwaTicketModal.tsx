import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  Phone, 
  ExternalLink, 
  Copy, 
  Check, 
  Lock, 
  FileText, 
  Building2,
  Calendar,
  Share2
} from 'lucide-react';
import { Language } from '../types';

interface OfficialFatwaTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  userQuestion?: string;
  category?: 'طلاق وأحوال شخصية' | 'مواريث وتركات' | 'نزاعات مالية' | 'نوازل وقضايا عامة';
  ticketCode?: string;
}

export const OfficialFatwaTicketModal: React.FC<OfficialFatwaTicketModalProps> = ({
  isOpen,
  onClose,
  language,
  userQuestion = 'مسألة إفتائية تستلزم الرجوع إلى الهيئات الرسمية المعتمدة (المستوى د)',
  category = 'طلاق وأحوال شخصية',
  ticketCode = 'FATWA-REF-2026-904',
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `📜 بطاقة إحالة إفتائية رسمية مشفرة\nرقم التذكرة: ${ticketCode}\nالمسألة: ${userQuestion}\nالتصنيف: ${category}\n⚠️ سياسة منصة عِلم: الامتناع التام عن الفتوى الآلية، والإحالة للهيئة المعتمدة في المملكة العربية السعودية.\n📞 الرقم الموحد للإفتاء: 8002451000\n🌐 بوابة الإفتاء: https://www.alifta.gov.sa`;

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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl border-2 border-amber-300 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Strip */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 px-6 py-5 text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-serif">
                  {isAr ? 'بطاقة إحالة إفتائية رسمية مشفرة' : 'Official Encrypted Fatwa Referral Ticket'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 font-mono font-bold">
                  Level D
                </span>
              </div>
              <p className="text-[11px] text-amber-200/80">
                {isAr ? 'بروتوكول سياج الحماية الشرعي لمنع الفتوى الآلية' : 'Autonomous Fatwa Zero-Tolerance Guardrail'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {/* Strict Governance Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-300/80 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {isAr
                ? 'وفقاً لـ «المستوى د» من وثيقة حوكمة الذكاء الاصطناعي الشرعي المعتمدة، يمتنع النظام تماماً وبشكل حاسم عن إصدار أي ترجيح أو فتوى في مسائل الطلاق، المواريث، الفتن، والأحوال الشخصية، ويُصدر بطاقة إحالة مشفرة للهيئات الرسمية المختصة.'
                : 'Under Level D Governance, the system strictly refuses automated opinions regarding divorce, inheritance, and personal disputes, providing an official referral ticket to certified authorities.'}
            </p>
          </div>

          {/* Ticket Details Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">{isAr ? 'رمز التذكرة المشفر:' : 'Ticket Ref:'}</span>
              <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                {ticketCode}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">{isAr ? 'تصنيف المسألة:' : 'Category:'}</span>
              <span className="font-bold text-slate-800 font-sans">{category}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 block">{isAr ? 'ملخص استفسار السائل:' : 'Query Summary:'}</span>
              <p className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-sans font-medium text-xs leading-relaxed">
                «{userQuestion}»
              </p>
            </div>
          </div>

          {/* Official Referral Destinations in Saudi Arabia */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>{isAr ? 'الجهات الإفتائية الرسمية المعتمدة للإحالة:' : 'Accredited Official Ifta Authorities:'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Dar Al Ifta Portal */}
              <a
                href="https://www.alifta.gov.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 transition flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                    {isAr ? 'الرئاسة العامة للبحوث والإفتاء' : 'General Presidency of Ifta'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">alifta.gov.sa</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
              </a>

              {/* Ministry of Islamic Affairs */}
              <a
                href="https://www.moia.gov.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 transition flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                    {isAr ? 'وزارة الشؤون الإسلامية والدعوة' : 'Ministry of Islamic Affairs'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">moia.gov.sa</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
              </a>
            </div>

            {/* Toll Free Direct Contact Hotline */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950">
                    {isAr ? 'الرقم المجاني الموحد لخدمة الإفتاء بالمملكة:' : 'Toll-free Ifta Hotline (KSA):'}
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-800" dir="ltr">
                    8002451000
                  </p>
                </div>
              </div>
              <a
                href="tel:8002451000"
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <span>{isAr ? 'اتصال مباشر' : 'Call'}</span>
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">{isAr ? 'تم نسخ بيانات التذكرة!' : 'Ticket Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>{isAr ? 'نسخ بيانات الإحالة' : 'Copy Ticket'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
