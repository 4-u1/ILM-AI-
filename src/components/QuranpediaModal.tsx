import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { 
  QURANPEDIA_SERVICES, 
  QuranpediaServiceId, 
  fetchQuranpediaAyahService, 
  getQuranpediaEmbedUrl,
  getLocalFallbackForService,
  QURANPEDIA_WEB_BASE
} from '../services/quranpediaApi';
import { 
  BookOpen, 
  Languages, 
  SpellCheck, 
  Sparkles, 
  History, 
  FolderTree, 
  Code, 
  GitCompare, 
  ShieldAlert, 
  FileText, 
  Mic, 
  ExternalLink, 
  X, 
  Loader2, 
  Volume2, 
  Bookmark, 
  Copy, 
  Check, 
  Globe2, 
  Layers,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { playQuranVerse, stopQuranAudio } from '../utils/quranAudio';

interface QuranpediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  ayahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  arabicText: string;
  language: Language;
}

export const QuranpediaModal: React.FC<QuranpediaModalProps> = ({
  isOpen,
  onClose,
  surahNumber,
  ayahNumber,
  surahNameAr,
  surahNameEn,
  arabicText,
  language,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const [activeServiceId, setActiveServiceId] = useState<QuranpediaServiceId>('tafsir');
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceData, setServiceData] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showEmbedWidget, setShowEmbedWidget] = useState<boolean>(false);

  // Fetch service data when modal opens or service changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const loadService = async () => {
      setLoading(true);
      try {
        const response = await fetchQuranpediaAyahService(surahNumber, ayahNumber, activeServiceId);
        if (isMounted) {
          setServiceData(response.data);
        }
      } catch (e) {
        console.error('Error fetching from Quranpedia:', e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadService();

    return () => {
      isMounted = false;
      stopQuranAudio();
      setIsPlayingAudio(false);
    };
  }, [isOpen, surahNumber, ayahNumber, activeServiceId]);

  if (!isOpen) return null;

  const handleCopy = () => {
    let contentToCopy = `${arabicText}\n[سورة ${surahNameAr}: آية ${ayahNumber}]\nالمصدر: موسوعة قرآن بيديا (quranpedia.net)`;
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopQuranAudio();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      playQuranVerse(
        arabicText,
        `${surahNumber}:${ayahNumber}`,
        {
          onStart: () => setIsPlayingAudio(true),
          onEnd: () => setIsPlayingAudio(false),
          onError: () => setIsPlayingAudio(false),
        }
      );
    }
  };

  const getServiceIcon = (id: QuranpediaServiceId) => {
    switch (id) {
      case 'tafsir': return <BookOpen className="w-4 h-4" />;
      case 'translations': return <Languages className="w-4 h-4" />;
      case 'vocabulary': return <SpellCheck className="w-4 h-4" />;
      case 'tadabbur': return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'asbab_nuzul': return <History className="w-4 h-4" />;
      case 'topics': return <FolderTree className="w-4 h-4" />;
      case 'irab': return <Code className="w-4 h-4" />;
      case 'similarities': return <GitCompare className="w-4 h-4" />;
      case 'abrogation': return <ShieldAlert className="w-4 h-4" />;
      case 'fatwas': return <FileText className="w-4 h-4" />;
      case 'qiraat': return <Mic className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const currentServiceMeta = QURANPEDIA_SERVICES.find(s => s.id === activeServiceId) || QURANPEDIA_SERVICES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-emerald-500/20 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold text-lg shadow-inner">
              QP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-amiri tracking-wide text-white">
                  موسوعة قرآن بيديا (Quranpedia API)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-mono">
                  v1 JSON API
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                سورة {surahNameAr} ({surahNameEn}) — الآية رقم ({ayahNumber})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`${QURANPEDIA_WEB_BASE}/ayah/${surahNumber}/${ayahNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1.5 transition-all"
              title="فتح في موقع قرآن بيديا"
            >
              <span>quranpedia.net</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ayah Card Banner */}
        <div className="p-4 sm:p-5 bg-emerald-50/70 dark:bg-emerald-950/30 border-b border-emerald-500/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-lg sm:text-2xl font-amiri font-bold text-slate-800 dark:text-emerald-100 leading-loose text-center sm:text-right">
                {arabicText}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-emerald-500/10">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleAudio}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingAudio ? (isAr ? 'جاري الاستماع...' : 'Playing...') : (isAr ? 'استمع للآية' : 'Play Ayah')}</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
              </button>

              <button
                onClick={() => setShowEmbedWidget(!showEmbedWidget)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  showEmbedWidget
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-500/20 hover:bg-amber-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{showEmbedWidget ? (isAr ? 'عرض الواجهة المنسقة' : 'Show Formatted UI') : (isAr ? 'استجابة الـ API المباشرة (JSON)' : 'Live API Response (JSON)')}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              مأخوذة بالرسم العثماني المعتمد
            </div>
          </div>
        </div>

        {/* 12 Services Horizontal Scroll Bar */}
        <div className="p-2 sm:p-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar flex gap-2">
          {QURANPEDIA_SERVICES.map((srv) => {
            const isActive = activeServiceId === srv.id;
            return (
              <button
                key={srv.id}
                onClick={() => {
                  setActiveServiceId(srv.id);
                  setShowEmbedWidget(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-102'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {getServiceIcon(srv.id)}
                <span>{isAr ? srv.nameAr : (isUr ? srv.nameUr : srv.nameEn)}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {showEmbedWidget ? (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 pb-2">
                <span className="font-semibold">{isAr ? 'بيانات الاستجابة المباشرة المستلمة من خادم الموسوعة:' : 'Live response payload fetched from encyclopedia server:'}</span>
                <span className="font-mono text-[10px] bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded text-amber-900 dark:text-amber-300 border border-amber-300/40">
                  GET /v1/ayah/{surahNumber}/{ayahNumber}/{encodeURIComponent(currentServiceMeta.endpointParam)}
                </span>
              </div>
              
              <div className="w-full rounded-2xl border border-amber-300/30 overflow-hidden bg-slate-950 shadow-inner">
                {/* JSON Code Header */}
                <div className="bg-slate-900 px-4 py-2 text-[10px] font-mono text-slate-400 border-b border-slate-800 flex items-center justify-between" dir="ltr">
                  <span>RESPONSE PAYLOAD (JSON)</span>
                  <span className="text-emerald-500 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    200 OK
                  </span>
                </div>
                
                {/* Code pre block */}
                <div className="p-4 max-h-[380px] overflow-auto text-emerald-400 font-mono text-xs leading-relaxed text-left" dir="ltr">
                  <pre>{JSON.stringify(serviceData || { 
                    status: "offline_fallback", 
                    message: "No live internet connection or server unreachable. Loaded offline backup payload.",
                    data: getLocalFallbackForService(surahNumber, ayahNumber, activeServiceId) 
                  }, null, 2)}</pre>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Active Service Description */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-emerald-950">
                  {getServiceIcon(currentServiceMeta.id)}
                  <span>{isAr ? currentServiceMeta.descriptionAr : currentServiceMeta.descriptionEn}</span>
                </div>
                <span className="font-mono text-[10px] text-amber-900 bg-amber-100/50 px-2.5 py-0.5 rounded border border-amber-200/50 break-all shrink-0">
                  /v1/ayah/{surahNumber}/{ayahNumber}/{currentServiceMeta.endpointParam}
                </span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
                  <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                  <p className="text-xs font-semibold">
                    {isAr ? 'جاري الاتصال بموسوعة قرآن بيديا وتحديث البيانات...' : 'Connecting to Quranpedia API v1...'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Service Specific Renderers */}
                  {activeServiceId === 'tafsir' && (
                    <div className="grid grid-cols-1 gap-4">
                      {Array.isArray(serviceData) ? (
                        serviceData.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] space-y-2 hover:shadow-xs transition">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-bold text-emerald-900 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-emerald-700" />
                                <span>{item.book || item.name || 'كتاب التفسير'}</span>
                              </h4>
                              {item.author && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  {item.author}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-800 leading-relaxed font-serif text-right font-medium">
                              {item.text || item.content || item.tafseer || JSON.stringify(item)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] space-y-2">
                          <p className="text-sm text-slate-800 leading-relaxed font-serif text-right font-medium">
                            {typeof serviceData === 'string' ? serviceData : (serviceData?.text || serviceData?.summary || JSON.stringify(serviceData, null, 2))}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeServiceId === 'translations' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Array.isArray(serviceData) ? (
                        serviceData.map((tr: any, idx: number) => (
                          <div key={idx} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] space-y-2 hover:shadow-xs transition">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                                <Globe2 className="w-3.5 h-3.5 text-emerald-700" />
                                {tr.language || tr.name}
                              </span>
                              {tr.translator && (
                                <span className="text-[10px] text-slate-500 font-semibold">
                                  {tr.translator}
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-left font-sans">
                              {tr.text || tr.translation}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 col-span-2 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6]">
                          <p className="text-sm text-slate-800 leading-relaxed font-sans">
                            {typeof serviceData === 'string' ? serviceData : JSON.stringify(serviceData, null, 2)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeServiceId === 'tadabbur' && (
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-[#FAF7F2]/30 border border-amber-200 space-y-3">
                      <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                        <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                        <span>لطائف ووقفات تدبرية</span>
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed font-serif text-right font-medium">
                        {typeof serviceData === 'object' 
                          ? (serviceData[0]?.insight || serviceData?.insight || serviceData?.summary || JSON.stringify(serviceData))
                          : serviceData}
                      </p>
                    </div>
                  )}

                  {activeServiceId !== 'tafsir' && activeServiceId !== 'translations' && activeServiceId !== 'tadabbur' && (
                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 border-b border-[#EAE3D6] pb-2">
                        {getServiceIcon(currentServiceMeta.id)}
                        <span>{currentServiceMeta.nameAr}</span>
                      </div>
                      <div className="text-sm text-slate-800 leading-relaxed font-serif text-right font-medium whitespace-pre-wrap">
                        {typeof serviceData === 'object' 
                          ? (serviceData?.summary || serviceData?.text || JSON.stringify(serviceData, null, 2))
                          : serviceData}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-100 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>بيانات موثقة من مجمع الملك فهد وموسوعة قرآن بيديا الرسمية</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-all"
          >
            {isAr ? 'إغلاق النافذة' : 'Close Window'}
          </button>
        </div>

      </div>
    </div>
  );
};
