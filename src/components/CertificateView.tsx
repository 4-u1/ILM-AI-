import React, { useState, useEffect } from 'react';
import { TrackId, Language } from '../types';
import { Award, ShieldCheck, Printer, CheckCircle2, ArrowRight, ArrowLeft, Edit3, Calendar, Sparkles, Check, Download, Share2, Copy, ExternalLink, MessageCircle, X, FileDown, Loader2 } from 'lucide-react';
import { IlmBrandLogo } from './IlmBrandLogo';
import { OptimizedImage } from './OptimizedImage';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface CertificateViewProps {
  trackId: TrackId;
  language: Language;
  onBack: () => void;
  onNavigateToAchievements?: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  trackId,
  language,
  onBack,
  onNavigateToAchievements,
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // Retrieve or initialize user name with local storage persistence
  const [studentName, setStudentName] = useState(() => {
    try {
      const saved = localStorage.getItem('eilm_student_name');
      if (saved && saved.trim()) return saved;
      return isAr ? 'فيصل عبد الله الأحمدي' : 'Faisal Abdullah Al-Ahmadi';
    } catch {
      return isAr ? 'فيصل عبد الله الأحمدي' : 'Faisal Abdullah Al-Ahmadi';
    }
  });

  const [tempName, setTempName] = useState(studentName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Retrieve or initialize completion date with local storage persistence
  const [completionDate, setCompletionDate] = useState(() => {
    try {
      const saved = localStorage.getItem('eilm_completion_date');
      if (saved) return saved;
      const today = new Date().toISOString().split('T')[0];
      return today;
    } catch {
      return '2026-09-26';
    }
  });

  // Persist name changes
  const handleSaveName = () => {
    const trimmed = tempName.trim();
    if (trimmed) {
      setStudentName(trimmed);
      try {
        localStorage.setItem('eilm_student_name', trimmed);
      } catch (e) {
        console.error(e);
      }
    }
    setIsEditingName(false);
  };

  useEffect(() => {
    try {
      if (!localStorage.getItem('eilm_completion_date')) {
        localStorage.setItem('eilm_completion_date', completionDate);
      }
    } catch (e) {
      console.error(e);
    }
  }, [completionDate]);

  const trackNames: Record<TrackId, { ar: string; en: string; subtitleAr: string; subtitleEn: string }> = {
    muslim: {
      ar: 'مسار المسلم الأصل: تعميق المعرفة والممارسة',
      en: 'Born Muslim Path: Deepening Knowledge & Practice',
      subtitleAr: 'فهم أصول العقيدة، مقاصد العبادات، والأخلاق الإسلامية الرشيدة',
      subtitleEn: 'Understanding Core Beliefs, Worship Wisdom & Islamic Ethics',
    },
    new_muslim: {
      ar: 'مسار تأسيس المسلم الجديد خطوة بخطوة',
      en: 'New Muslim Foundations Path',
      subtitleAr: 'أركان الإيمان والإسلام، فقه الصلاة والعبادة، والتطبيق الحياتي اليومي',
      subtitleEn: 'Pillars of Faith, Mechanics of Prayer, and Daily Living',
    },
    non_muslim: {
      ar: 'مسار التعرف على الإسلام والحوار الحضاري',
      en: 'Discovery of Islam & Civilized Dialogue',
      subtitleAr: 'مدخل موضوعي وموثق للرسالة المحمدية، القرآن الكريم، ومحاسن الشريعة',
      subtitleEn: 'Objective, Grounded Exploration of Islam, the Quran, and Ethics',
    },
    daiyah: {
      ar: 'مسار تأهيل الداعية ومحاكي الحوار التفاعلي',
      en: 'Da\'iyah Training & Interactive Dialogue Simulation',
      subtitleAr: 'أصول الدعوة بالحكمة والموعظة الحسنة، وتطبيقات الحوار المنهجي',
      subtitleEn: 'Principles of Civilized Da\'wah and Evidence-based Reasoning',
    },
  };

  const certificateNumber = `EILM-${trackId.toUpperCase().slice(0, 3)}-${completionDate.replace(/-/g, '')}-9842`;

  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // 📄 Direct High-DPI Landscape PDF Export Engine (jsPDF + html2canvas)
  const exportDirectPDF = async () => {
    try {
      setIsExportingPdf(true);
      const certificateEl = document.getElementById('ilm-verified-certificate-doc');
      if (!certificateEl) {
        window.print();
        return;
      }

      // High-resolution canvas rendering with exact background colors and styles
      const canvas = await html2canvas(certificateEl, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FAF9F5',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Standard A4 Landscape dimensions: 297mm x 210mm
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = 297;
      const pdfHeight = 210;
      const margin = 8;
      const printWidth = pdfWidth - (margin * 2);
      const printHeight = (canvas.height * printWidth) / canvas.width;
      const yPos = Math.max(margin, (pdfHeight - printHeight) / 2);

      pdf.addImage(imgData, 'PNG', margin, yPos, printWidth, Math.min(printHeight, pdfHeight - (margin * 2)), undefined, 'FAST');
      
      const sanitizedName = studentName.trim().replace(/[\\/:*?"<>|]/g, '_') || 'Student';
      const fileName = `EILM-Certificate-${sanitizedName}-${trackId}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Direct PDF export error, falling back to standalone print:', error);
      handleDownloadDedicatedPdf();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDedicatedPdf = () => {
    // Generate clean standalone print-ready HTML file with automatic print prompt
    const title = isAr ? 'شهادة إتمام معتمدة - منصة عِلم' : 'Verified Certificate - ILM Platform';
    const htmlContent = `<!DOCTYPE html>
<html lang="${language}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8" />
  <title>${title} - ${certificateNumber}</title>
  <style>
    @page { size: landscape; margin: 12mm; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Arabic', sans-serif;
      background-color: #FAF9F5;
      margin: 0;
      padding: 24px;
      color: #0F172A;
      direction: ${isAr ? 'rtl' : 'ltr'};
    }
    .cert-frame {
      border: 12px double #1E293B;
      border-radius: 20px;
      background: #FFFFFF;
      padding: 40px;
      text-align: center;
      position: relative;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    }
    .cert-header {
      font-size: 13px;
      font-weight: 700;
      color: #B45309;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .cert-title {
      font-size: 32px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 20px 0;
    }
    .cert-recipient-pre {
      font-size: 15px;
      color: #64748B;
      margin-bottom: 8px;
    }
    .cert-name {
      font-size: 36px;
      font-weight: 900;
      color: #92400E;
      border-bottom: 2px solid #E2E8F0;
      display: inline-block;
      padding: 0 30px 10px 30px;
      margin-bottom: 24px;
    }
    .cert-desc {
      font-size: 16px;
      line-height: 1.8;
      max-width: 680px;
      margin: 0 auto 30px auto;
      color: #334155;
    }
    .cert-grid {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #E2E8F0;
    }
    .badge {
      padding: 6px 14px;
      background: #ECFDF5;
      color: #065F46;
      border: 1px solid #A7F3D0;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
    }
    .id-box {
      font-family: monospace;
      font-size: 12px;
      color: #475569;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="cert-frame">
    <div class="cert-header">${isAr ? 'المملكة العربية السعودية • تحدي المحتوى الإسلامي 2026' : 'AI Islamic Content Challenge 2026'}</div>
    <h1 class="cert-title">${isAr ? 'شهادة إتمام واعتماد معرفي' : 'Certificate of Completion'}</h1>
    <div class="cert-recipient-pre">${isAr ? 'تُشهد منصة «عِلم | ILM» بأن الدارس(ة):' : 'This is to officially certify that:'}</div>
    <div class="cert-name">${studentName}</div>
    <p class="cert-desc">
      ${isAr
        ? `قد أتم(ت) بنجاح واجتياز تام لكافة المحطات المعرفية لـ «${currentTrackTitle}» والمبنية والموثقة وفق الحزمة العلمية لتحدي الذكاء الاصطناعي (مجمع الملك فهد وموسوعات الدرر السنية).`
        : `Has successfully completed all educational milestones for the "${currentTrackTitle}", grounded in accredited Islamic repositories.`}
    </p>
    <div class="cert-grid">
      <div style="text-align: ${isAr ? 'right' : 'left'};">
        <div style="font-size: 12px; color: #64748B;">${isAr ? 'تاريخ الإنجاز:' : 'Completion Date:'}</div>
        <div style="font-weight: 800; font-size: 14px;">${formattedDate}</div>
      </div>
      <div>
        <span class="badge">🛡️ ${isAr ? 'معتمد رسمياً' : 'Verified Record'}</span>
        <div class="id-box" style="margin-top: 6px;">${certificateNumber}</div>
      </div>
      <div style="text-align: ${isAr ? 'left' : 'right'};">
        <div style="font-size: 12px; color: #64748B;">${isAr ? 'هيئة الرقابة والتوثيق:' : 'Verification Board:'}</div>
        <div style="font-weight: 800; font-size: 14px;">منصة عِلم | ILM</div>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EILM-Certificate-${studentName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentTrackTitle = isAr ? trackNames[trackId]?.ar : trackNames[trackId]?.en;

  // Prestigious, inspiring sharing announcement text
  const shareTextAr = `بفضل الله وتوفيقه، أتممت بنجاح متطلبات «${currentTrackTitle}» عبر منصة «عِلم | ILM» للتعليم المعرفي والدعوي الرصين، الموثقة وفق الحزمة العلمية لتحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي.

رقم الاعتماد الأكاديمي: ${certificateNumber}
رابط التحقق والاطلاع على الشهادة:
${window.location.origin}`;

  const shareTextEn = `Alhamdulillah! I have successfully completed the requirements for the "${currentTrackTitle}" via the "ILM | عِلم" platform for verified Islamic learning, endorsed under the AI Islamic Content Challenge scientific framework.

Certificate Verification ID: ${certificateNumber}
Verify & view certificate:
${window.location.origin}`;

  const proposedShareText = isAr ? shareTextAr : shareTextEn;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(proposedShareText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: isAr ? 'شهادة إتمام معتمدة - منصة عِلم | ILM' : 'Verified Certificate - ILM Platform',
          text: proposedShareText,
          url: window.location.origin,
        });
      } catch (err) {
        // Fallback to modal if canceled or unsupported
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  // Direct Social Share URLs
  const encodedText = encodeURIComponent(proposedShareText);
  const encodedUrl = encodeURIComponent(window.location.origin);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const xTwitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

  // Formatted date string for elegant rendering
  const formattedDate = (() => {
    try {
      const parts = completionDate.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return isAr
          ? d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
          : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      }
    } catch {
      // fallback
    }
    return completionDate;
  })();

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
      
      {/* Mobile Top Brand Header */}
      <div className="md:hidden flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
        <div className="flex items-center gap-2">
          <IlmBrandLogo size="sm" showSubtitle={false} withAura={true} />
          <span className="text-slate-300 font-light text-base select-none">|</span>
          <span className="font-bold text-sm tracking-wider text-slate-700 select-none font-sans uppercase">
            ILM
          </span>
        </div>
        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          {isAr ? 'الشهادة الرقمية' : 'Digital Certificate'}
        </span>
      </div>

      {/* Top Bar Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{isAr ? 'العودة لخارطة الرحلة' : 'Back to Journey Map'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigateToAchievements && (
            <button
              onClick={onNavigateToAchievements}
              className="px-3.5 py-1.5 rounded-xl border border-amber-300 text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>{isAr ? 'لوحة الأوسمة الرقمية' : 'Achievements'}</span>
            </button>
          )}

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl border border-amber-300 text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title={isAr ? 'مشاركة إنجازك والشهادة' : 'Share your certificate achievement'}
          >
            <Share2 className="w-3.5 h-3.5 text-amber-700" />
            <span>{isAr ? 'مشاركة الإنجاز' : 'Share'}</span>
          </button>

          <button
            onClick={() => {
              setTempName(studentName);
              setIsEditingName(!isEditingName);
            }}
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5 bg-white shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>{isAr ? 'تعديل الاسم' : 'Edit Name'}</span>
          </button>

          {/* 📄 Direct PDF Export Button */}
          <button
            onClick={exportDirectPDF}
            disabled={isExportingPdf}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-70"
            title={isAr ? 'تصدير الشهادة كملف PDF عالي الدقة مباشرة' : 'Export certificate directly as high-res PDF'}
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-200" />
                <span>{isAr ? 'جارِ تجهيز PDF...' : 'Generating PDF...'}</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 text-amber-200" />
                <span>{isAr ? 'تصدير PDF مباشر' : 'Export PDF'}</span>
              </>
            )}
          </button>

          {/* 🖨️ Landscape Print Button */}
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title={isAr ? 'طباعة الشهادة بالنمط العرضي A4' : 'Print Certificate in Landscape A4'}
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'طباعة بالعرض (A4)' : 'Print (A4)'}</span>
          </button>

          {/* 📥 Standalone File Fallback */}
          <button
            onClick={handleDownloadDedicatedPdf}
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title={isAr ? 'تنزيل ملف ويب مستقل للشهادة' : 'Download standalone file'}
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>{isAr ? 'ملف مستقل' : 'Standalone'}</span>
          </button>
        </div>
      </div>

      {/* Success Status Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm print:hidden">
        <div className="flex items-center gap-2.5 text-emerald-950">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            {isAr 
              ? 'تم إصدار واعتماد الشهادة الرقمية بنجاح وفق سجلات المنصة' 
              : 'Digital Certificate officially generated and verified.'}
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300/50">
          {certificateNumber}
        </span>
      </div>

      {/* Interactive Name Editing Banner */}
      {isEditingName && (
        <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 shrink-0">
              {isAr ? 'اسم حامل الشهادة:' : 'Recipient Name:'}
            </span>
          </div>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder={isAr ? 'اكتب اسمك الثلاثي الكامل...' : 'Enter your full name...'}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 flex-1"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveName}
              className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1 justify-center"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isAr ? 'حفظ وتحديث الشهادة' : 'Save & Update'}</span>
            </button>
            <button
              onClick={() => setIsEditingName(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-medium hover:bg-slate-50 transition"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* LUXURIOUS CERTIFICATE DOCUMENT (EILM VISUAL IDENTITY) */}
      <div 
        id="ilm-verified-certificate-doc"
        className="certificate-sheet bg-[#FAF9F5] rounded-3xl p-4 sm:p-10 md:p-14 border-[10px] sm:border-[16px] border-[#1E293B] shadow-2xl relative overflow-hidden print:p-8 print:border-8 print:shadow-none"
      >
        
        {/* Subtle Watermark Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center select-none overflow-hidden">
          <span className="text-[28rem] font-serif font-bold text-slate-900 rotate-[-12deg]">
            عِـلـم
          </span>
        </div>

        {/* Outer Islamic Double Line Geometric Frame */}
        <div className="border-2 border-amber-600/70 rounded-2xl p-4 sm:p-8 relative bg-white/90 backdrop-blur-xs">
          
          {/* Inner Golden Hairline Frame */}
          <div className="border border-amber-300/60 rounded-xl p-5 sm:p-8 relative">
            
            {/* Corner Decorative Accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-600"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-600"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-600"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-600"></div>

            {/* Top Logo & Platform Header */}
            <div className="text-center space-y-2 mb-8">
              <div className="flex flex-col items-center justify-center mb-1">
                <IlmBrandLogo size="lg" showSubtitle={true} withAura={true} />
              </div>
              
              <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-amber-900 font-semibold tracking-widest uppercase">
                <span>✦</span>
                <span>{isAr ? 'المنصة الذكية للتعريف بالإسلام والتعليم المعرفي الرصين' : 'Smart Platform for Islamic Knowledge & Learning'}</span>
                <span>✦</span>
              </div>

              {/* Royal Emblem Divider */}
              <div className="flex items-center justify-center gap-3 my-4">
                <div className="w-16 sm:w-28 h-px bg-linear-to-r from-transparent via-amber-500 to-amber-700"></div>
                <div className="w-2.5 h-2.5 rotate-45 bg-amber-600"></div>
                <div className="w-16 sm:w-28 h-px bg-linear-to-l from-transparent via-amber-500 to-amber-700"></div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-serif pt-1">
                {isAr ? 'شهادة إتمام رحلة معرفية معتمدة' : 'Accredited Certificate of Completion'}
              </h1>
            </div>

            {/* Recipient Certification Statement */}
            <div className="text-center space-y-5 max-w-2xl mx-auto mb-10 text-slate-800">
              
              <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wider">
                {isAr ? 'تـشهد إدارة المنهج التعليمي بأن المتعلم المجتهد:' : 'This is to officially testify that the dedicated learner:'}
              </p>

              {/* Student Name Block */}
              <div className="relative inline-block py-2 px-8 sm:px-12">
                <div className="text-3xl sm:text-5xl font-extrabold text-slate-950 font-serif tracking-normal selection:bg-amber-100">
                  {studentName}
                </div>
                <div className="h-0.5 w-full bg-linear-to-r from-transparent via-amber-600 to-transparent mt-2"></div>
              </div>

              <p className="text-xs sm:text-base leading-relaxed text-slate-700 max-w-xl mx-auto font-medium">
                {isAr
                  ? 'قد اجتاز بتوفيق الله تعالى كافة المراحل التعليمية المقررة، وأتم التقييمات العلمية والتطبيقية في:'
                  : 'has successfully completed all required educational stages, milestone assessments, and practical exercises in:'}
              </p>

              {/* Track Name Card */}
              <div className="bg-linear-to-br from-amber-50/90 via-white to-amber-50/60 p-4 sm:p-5 rounded-2xl border border-amber-300/80 shadow-xs inline-block max-w-xl w-full">
                <div className="text-base sm:text-2xl font-bold text-amber-950 font-serif mb-1">
                  {isAr ? trackNames[trackId].ar : trackNames[trackId].en}
                </div>
                <div className="text-xs sm:text-sm text-amber-800/90 font-medium">
                  {isAr ? trackNames[trackId].subtitleAr : trackNames[trackId].subtitleEn}
                </div>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                {isAr
                  ? 'وفق المنهج المعرفي المعتمد والمستند إلى نصوص مجمع الملك فهد، وموسوعة الدرر السنية، والمستودع الدعوي الرقمي، بموجب معايير الموثوقية العلمية للمنصة.'
                  : 'Grounded in accredited sources including the King Fahd Complex, Dorar.net, and Dawa.center digital repository, adhering to scientific reliability standards.'}
              </p>
            </div>

            {/* Verification, Date, and Academic Seal Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200 items-end text-center sm:text-start">
              
              {/* Issue Date & Verification ID */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 justify-center sm:justify-start text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isAr ? 'تاريخ التخرج والإنجاز:' : 'Date of Completion:'}</span>
                </div>
                <div className="font-serif font-bold text-slate-900 text-sm">
                  {formattedDate}
                </div>
                <div className="text-slate-400 text-[10px] pt-1">
                  {isAr ? 'رقم التوثيق الرقمي الفريد:' : 'Verification ID:'}
                </div>
                <div className="font-mono text-[11px] font-bold text-slate-700 tracking-wider">
                  {certificateNumber}
                </div>
              </div>

              {/* QR Verification Seal */}
              <div className="flex flex-col items-center justify-center order-last sm:order-none">
                <div className="w-20 h-20 bg-linear-to-b from-slate-900 to-slate-950 rounded-2xl p-2 flex items-center justify-center text-white shadow-md border-2 border-amber-400/40 relative overflow-hidden">
                  <OptimizedImage
                    src="/assets/certificate-seal.webp"
                    alt="Verified Seal"
                    className="absolute inset-0 opacity-25 pointer-events-none"
                  />
                  <div className="w-full h-full border border-dashed border-amber-300/40 rounded-xl flex flex-col items-center justify-center p-1 relative z-10">
                    <ShieldCheck className="w-6 h-6 text-amber-400 mb-0.5" />
                    <span className="text-[7px] font-mono text-amber-200 uppercase tracking-tighter">EILM VERIFIED</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-1 font-semibold">verify.eilm.org</span>
              </div>

              {/* Official Academic Sign-off */}
              <div className="text-center sm:text-end space-y-1.5 text-xs">
                <span className="text-slate-500 font-medium block">
                  {isAr ? 'الجهة العلمية المشرفة:' : 'Academic Governance:'}
                </span>
                <span className="font-bold text-slate-900 block text-sm font-serif">
                  {isAr ? 'هيئة الرقابة والتوثيق المعرفي' : 'Academic Verification Board'}
                </span>
                <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'سجل رسمي موثق' : 'Official Verified Record'}</span>
                </div>
              </div>

            </div>

            {/* Mandatory PRD Disclaimer */}
            <div className="mt-8 pt-4 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-xl mx-auto">
                {isAr
                  ? 'تنويه نظامي: هذه شهادة تعليمية تشهد بإتمام برنامج المنصة الذاتي ومحطاته المعرفية، وليست إجازة شرعية أو مؤهلاً رسمياً للإفتاء أو القضاء إلا بعد اعتمادها من الجهات المختصة.'
                  : 'Official Note: This educational certificate certifies completion of the platform self-paced program. It does not constitute a formal authorization (Ijazah) or qualification for issuing fatwas.'}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Elegant Share Modal / Sheet */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1.5 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
                {isAr ? 'مشاركة الإنجاز والشهادة الرقمية' : 'Share Achievement & Certificate'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isAr
                  ? 'شارك فخر إتمامك للمسار المعرفي مع عائلتك وزملائك عبر وسائل التواصل الاجتماعي'
                  : 'Share your milestone and verified Islamic learning certificate with colleagues & family'}
              </p>
            </div>

            {/* Proposed Share Message Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
                <span>{isAr ? 'النص المقترح للمشاركة والتهنئة:' : 'Suggested Announcement Text:'}</span>
                <button
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 transition font-bold cursor-pointer"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">{isAr ? 'تم النسخ' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isAr ? 'نسخ النص' : 'Copy Text'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-line font-medium select-all">
                {proposedShareText}
              </div>
            </div>

            {/* Quick Share Apps Row */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-600 block px-1">
                {isAr ? 'إرسال مباشر عبر التطبيقات:' : 'Share directly to apps:'}
              </span>
              
              <div className="grid grid-cols-3 gap-2.5">
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100 transition group cursor-pointer shadow-2xs"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] font-bold">{isAr ? 'واتساب' : 'WhatsApp'}</span>
                </a>

                {/* X / Twitter */}
                <a
                  href={xTwitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 hover:bg-slate-200 transition group cursor-pointer shadow-2xs"
                >
                  <span className="font-bold text-base text-slate-900 group-hover:scale-110 transition-transform mb-0.5">𝕏</span>
                  <span className="text-[11px] font-bold">{isAr ? 'منصة إكس' : 'X (Twitter)'}</span>
                </a>

                {/* Telegram */}
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 hover:bg-sky-100 transition group cursor-pointer shadow-2xs"
                >
                  <ExternalLink className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] font-bold">{isAr ? 'تيليجرام' : 'Telegram'}</span>
                </a>
              </div>
            </div>

            {/* Copy Certificate Link Bar */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={window.location.origin}
                  className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 flex-1 truncate select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isAr ? 'تم نسخ الرابط' : 'Link Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

