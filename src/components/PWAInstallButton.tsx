import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check, Laptop, PlusSquare, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';

export interface PWAInstallButtonProps {
  language?: Language;
  className?: string;
  variant?: 'navbar' | 'compact' | 'menuItem';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  language = 'ar',
  className = '',
  variant = 'navbar',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const isAr = language === 'ar';
  const isUr = language === 'ur';

  // Prevent background scrolling when guide modal is open
  useEffect(() => {
    if (showGuide) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showGuide]);

  // If already running as an installed PWA in standalone mode and not menuItem
  if (isInstalled && variant !== 'menuItem') {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  const buttonIcon = isIOS ? (
    <Smartphone className="w-3.5 h-3.5 text-amber-700 shrink-0" />
  ) : (
    <Download className="w-3.5 h-3.5 text-amber-600 shrink-0" />
  );

  return (
    <>
      {/* 1. Compact Variant (For narrow mobile headers) */}
      {variant === 'compact' && (
        <button
          type="button"
          onClick={handleClick}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-amber-300/80 bg-amber-50/90 hover:bg-amber-100 text-amber-900 flex items-center justify-center transition cursor-pointer shadow-3xs shrink-0 active:scale-95 ${className}`}
          title={isAr ? 'تثبيت تطبيق عِلم على هاتفك (PWA)' : isUr ? 'ایپ انسٹال کریں' : 'Install ILM App'}
          aria-label={isAr ? 'تثبيت التطبيق' : 'Install App'}
        >
          {buttonIcon}
        </button>
      )}

      {/* 2. Navbar Variant (For desktop & laptop headers) */}
      {variant === 'navbar' && (
        <button
          type="button"
          onClick={handleClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white text-xs font-bold shadow-2xs hover:shadow-md hover:from-amber-600 hover:to-slate-800 transition cursor-pointer border border-amber-600/40 shrink-0 ${className}`}
          title={isAr ? 'تثبيت تطبيق عِلم على جهازك' : 'Install ILM App'}
        >
          <Download className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>{isAr ? 'تثبيت التطبيق' : isUr ? 'ایپ انسٹال' : 'Install App'}</span>
        </button>
      )}

      {/* 3. MenuItem Variant (For Mobile Bottom Sheet / Navigation Menus) */}
      {variant === 'menuItem' && (
        <button
          type="button"
          onClick={handleClick}
          className={`w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/95 via-orange-50/80 to-amber-100/70 border border-amber-300/90 text-start transition cursor-pointer hover:shadow-xs hover:border-amber-400 active:scale-[0.99] group ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 shrink-0 group-hover:scale-105 transition-transform shadow-3xs">
              {isIOS ? <Smartphone className="w-5 h-5 text-amber-800" /> : <Download className="w-5 h-5 text-amber-800" />}
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                <span>{isAr ? 'تثبيت تطبيق عِلم (PWA)' : isUr ? 'عِلم ایپ انسٹال کریں' : 'Install ILM App (PWA)'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-700 opacity-70 group-hover:opacity-100" />
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5 font-medium leading-snug">
                {isAr
                  ? 'يعمل كتطبيق مستقل بدون إنترنت مع تجربة شاشة كاملة'
                  : isUr
                  ? 'انٹرنیٹ کے بغیر فل اسکرین آف لائن ایپ'
                  : 'Full offline standalone app experience on home screen'}
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0 shadow-3xs">
            {isInstalled ? (isAr ? 'مثبّت' : 'Installed') : (isAr ? 'تثبيت فوري' : 'Install')}
          </span>
        </button>
      )}

      {/* 🚀 Universal PWA Installation Guide Modal rendered via React Portal with guaranteed top stacking */}
      {showGuide && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setShowGuide(false)}
          className="fixed inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in cursor-pointer overflow-y-auto safe-area-px safe-area-pb safe-area-pt" 
          dir={isAr || isUr ? 'rtl' : 'ltr'}
          style={{ zIndex: 999999 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm max-h-[85vh] overflow-y-auto my-auto rounded-3xl bg-[#FAF7F2] border-2 border-amber-400/80 p-5 sm:p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] text-slate-900 space-y-4 cursor-default relative"
            style={{ zIndex: 1000000 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
              <h3 className="text-base font-bold text-amber-950 font-serif flex items-center gap-2">
                {isIOS ? (
                  <>
                    <Smartphone className="w-4.5 h-4.5 text-amber-700" />
                    <span>{isAr ? 'تثبيت تطبيق عِلم على iOS' : 'Install ILM on iPhone / iPad'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4.5 h-4.5 text-amber-700" />
                    <span>{isAr ? 'تثبيت تطبيق عِلم على جهازك' : 'Install ILM App'}</span>
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Platform-Specific Step Guide */}
            {isIOS ? (
              <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-sans">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200/80">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">1</span>
                  <p>
                    {isAr ? (
                      <>اضغط على زر <strong>المشاركة (Share)</strong> أسفل شريط متصفح سفاري.</>
                    ) : (
                      <>Tap the <strong>Share</strong> button in the Safari toolbar.</>
                    )}
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200/80">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">2</span>
                  <p>
                    {isAr ? (
                      <>مرر للأسفل واختر <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong>.</>
                    ) : (
                      <>Scroll down and tap <strong>Add to Home Screen</strong>.</>
                    )}
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="font-semibold">
                    {isAr ? 'سيعمل التطبيق كاملاً بدون إنترنت ومستقلاً عن المتصفح.' : 'The app will work standalone with full offline access.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-sans">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200/80">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">1</span>
                  <p>
                    {isAr ? (
                      <>اضغط على قائمة المتصفح <strong>(⋮ أو الزاوية العليا)</strong> في كروم أو إيدج.</>
                    ) : (
                      <>Click the browser menu <strong>(⋮)</strong> in Chrome or Edge.</>
                    )}
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200/80">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">2</span>
                  <p>
                    {isAr ? (
                      <>اختر <strong>«تثبيت التطبيق» (Install app)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.</>
                    ) : (
                      <>Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</>
                    )}
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="font-semibold">
                    {isAr ? 'يعمل كتطبيق سريع مستقل بشاشة كاملة وبلا إنترنت.' : 'Works as a standalone full-screen app with offline support.'}
                  </p>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              {isAr ? 'فهمت، حسناً' : 'Got it'}
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
