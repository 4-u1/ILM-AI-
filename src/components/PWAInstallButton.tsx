import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { Language } from '../types';

interface PWAInstallButtonProps {
  language?: Language;
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  language = 'ar',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const isAr = language === 'ar';
  const isUr = language === 'ur';

  // Prevent background scrolling when iOS guide modal is open
  useEffect(() => {
    if (showIOSGuide) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showIOSGuide]);

  // If already running as an installed PWA in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 text-white text-[11px] sm:text-xs font-bold shadow-2xs hover:shadow-md hover:from-amber-800 hover:to-amber-950 transition cursor-pointer shrink-0 ${className}`}
        title={isAr ? 'تثبيت تطبيق عِلم على جهازك' : 'Install ILM App'}
      >
        <Download className="w-3.5 h-3.5 text-amber-300 shrink-0" />
        <span className="truncate">{isAr ? 'تثبيت التطبيق' : isUr ? 'ایپ انسٹال' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-white border border-amber-300 text-amber-950 text-[11px] sm:text-xs font-bold shadow-2xs hover:bg-amber-50 transition cursor-pointer shrink-0 ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="truncate">{isAr ? 'تثبيت التطبيق' : isUr ? 'آئی فون انسٹال' : 'Install App'}</span>
        </button>

        {showIOSGuide && (
          <div 
            onClick={() => setShowIOSGuide(false)}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in cursor-pointer overflow-y-auto" 
            dir={isAr || isUr ? 'rtl' : 'ltr'}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm max-h-[88vh] overflow-y-auto my-auto rounded-3xl bg-[#FAF7F2] border border-amber-200 p-4 sm:p-6 shadow-2xl text-slate-900 space-y-3 sm:space-y-4 cursor-default"
            >
              <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                <h3 className="text-base font-bold text-amber-950 font-serif flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-700" />
                  <span>{isAr ? 'تثبيت تطبيق عِلم على iOS' : 'Install ILM on iPhone / iPad'}</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

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

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition shadow-xs"
              >
                {isAr ? 'فهمت، حسناً' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
