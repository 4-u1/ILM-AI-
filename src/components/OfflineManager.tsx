import React, { useState, useEffect } from 'react';
import { Language, TrackId } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  CheckCircle2, 
  HardDrive, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  ShieldCheck,
  BookOpen,
  RefreshCw
} from 'lucide-react';

interface OfflineManagerProps {
  language: Language;
  onBack: () => void;
  selectedTrack: TrackId | null;
}

export const OfflineManager: React.FC<OfflineManagerProps> = ({
  language,
  onBack,
  selectedTrack,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadedTracks, setDownloadedTracks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('eilm_offline_tracks');
      return saved ? JSON.parse(saved) : ['quran_full', 'new_muslim', 'muslim'];
    } catch {
      return ['quran_full', 'new_muslim', 'muslim'];
    }
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDownloadTrack = (trackId: string) => {
    setIsDownloading(true);
    setDownloadProgress(20);

    setTimeout(() => setDownloadProgress(50), 300);
    setTimeout(() => setDownloadProgress(85), 600);
    setTimeout(() => {
      setDownloadProgress(100);
      setIsDownloading(false);
      const updated = Array.from(new Set([...downloadedTracks, trackId]));
      setDownloadedTracks(updated);
      try {
        localStorage.setItem('eilm_offline_tracks', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }, 900);
  };

  const handleRemoveTrack = (trackId: string) => {
    const updated = downloadedTracks.filter((t) => t !== trackId);
    setDownloadedTracks(updated);
    try {
      localStorage.setItem('eilm_offline_tracks', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const tracksInfo = [
    {
      id: 'quran_full',
      nameAr: 'القرآن الكريم كاملاً (مصحف مجمع الملك فهد - 114 سورة)',
      nameEn: 'Complete Holy Quran Index (King Fahd Complex - 114 Surahs)',
      size: '4.2 MB',
      lessonsCount: 114,
    },
    {
      id: 'new_muslim',
      nameAr: 'مسار المسلم الجديد (تأسيس خطوة بخطوة)',
      nameEn: 'New Muslim Foundations',
      size: '2.4 MB',
      lessonsCount: 6,
    },
    {
      id: 'muslim',
      nameAr: 'مسار المسلم الأصل (ترسيخ وتعميق)',
      nameEn: 'Born Muslim Deepening',
      size: '3.1 MB',
      lessonsCount: 5,
    },
    {
      id: 'non_muslim',
      nameAr: 'مسار غير المسلم (التعرف والحوار الموضوعي)',
      nameEn: 'Non-Muslim Discovery',
      size: '2.8 MB',
      lessonsCount: 5,
    },
    {
      id: 'daiyah',
      nameAr: 'مسار الداعية (التأهيل ومحاكي الحوار)',
      nameEn: 'Da\'iyah Training & Scenarios',
      size: '3.5 MB',
      lessonsCount: 5,
    },
  ];

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 sm:space-y-8">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{isAr ? 'العودة للمنصة' : 'Back to Platform'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? (isAr ? 'متصل بالسحابة 🟢' : 'Online Cloud 🟢') : (isAr ? 'يعمل بلا إنترنت ⚡' : 'Offline Mode ⚡')}</span>
          </span>
        </div>
      </div>

      {/* Hero Card */}
      <div className="rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/15">
          <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isAr ? 'تقنية العمل دون اتصال (Offline-First)' : 'Offline Storage & Field Cache'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {isAr ? 'حقيبة المسافر والداعية الميداني بلا إنترنت' : 'Offline Field Kit & Local Storage'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          {isAr
            ? 'احفظ المادة العلمية، والآيات، والأحاديث، والاختبارات التفاعلية على هاتفك مباشرة بضغطة زر. تُمكّنك المنصة من المذاكرة والدعوة داخل الطائرة، أو في الصحراء، أو في الأماكن النائية دون استهلاك بيانات وبأقصى سرعة.'
            : 'Download lessons, verses, Hadiths, and interactive quizzes directly to your local device. Learn and guide offline in flights, deserts, and low-connectivity regions.'}
        </p>
      </div>

      {/* Downloading indicator if active */}
      {isDownloading && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
            <span>{isAr ? 'جاري حفظ الملفات محلياً في الذاكرة...' : 'Caching files locally...'}</span>
            <span>{downloadProgress}%</span>
          </div>
          <div className="h-2 w-full bg-emerald-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tracks Cache List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {isAr ? 'إدارة حقائب المسارات المحفوظة' : 'Track Packages Local Management'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isAr
              ? 'المسارات المحفوظة تظل متاحة للتصفح والمدارسة والاختبار حتى مع إغلاق المتصفح أو انقطاع شبكة الإنترنت التام.'
              : 'Cached tracks remain available for study and quizzes even during complete offline sessions.'}
          </p>
        </div>

        <div className="space-y-3">
          {tracksInfo.map((tr) => {
            const isSaved = downloadedTracks.includes(tr.id);
            return (
              <div
                key={tr.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {isAr ? tr.nameAr : tr.nameEn}
                    </span>
                    {isSaved && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{isAr ? 'محفوظ محلياً' : 'Saved'}</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span>{tr.lessonsCount} {isAr ? 'محطات تدريبية' : 'stages'}</span>
                    <span>•</span>
                    <span>{tr.size}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSaved ? (
                    <button
                      onClick={() => handleRemoveTrack(tr.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-rose-600 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'حذف من الذاكرة' : 'Remove'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDownloadTrack(tr.id)}
                      disabled={isDownloading}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تحميل للاستخدام أوفلاين' : 'Download Offline'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
