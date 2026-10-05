import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, TrackId } from '../types';
import { ALL_SURAHS, SurahMeta, QuranAyah } from '../data/quranData';
import { loadSurahAyahs, FullSurahData } from '../utils/quranLoader';
import { playQuranVerse, stopQuranAudio, QURAN_RECITERS, QuranReciterId, getSavedReciter, saveReciter } from '../utils/quranAudio';
import { QuranpediaModal } from './QuranpediaModal';
import { playTapSound } from '../utils/platformSounds';
import {
  BookOpen,
  Search,
  Volume2,
  VolumeX,
  X,
  ShieldCheck,
  Bookmark,
  Heart,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface CompactQuranModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialSurahNumber?: number;
  onOpenFullPage?: () => void;
  onStudyInTrack?: (surahNum: number) => void;
}

export const CompactQuranModal: React.FC<CompactQuranModalProps> = ({
  isOpen,
  onClose,
  language,
  initialSurahNumber = 1,
  onOpenFullPage,
  onStudyInTrack,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(initialSurahNumber);
  const [surahData, setSurahData] = useState<FullSurahData | null>(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAyahKey, setPlayingAyahKey] = useState<string | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<QuranReciterId>(() => getSavedReciter());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync initial surah
  useEffect(() => {
    if (isOpen) {
      setSelectedSurahNumber(initialSurahNumber || 1);
    }
  }, [isOpen, initialSurahNumber]);

  // Load active surah data
  useEffect(() => {
    let isCancelled = false;
    if (isOpen) {
      setIsLoadingSurah(true);
      stopQuranAudio();
      setPlayingAyahKey(null);

      loadSurahAyahs(selectedSurahNumber).then((data) => {
        if (!isCancelled) {
          setSurahData(data);
          setIsLoadingSurah(false);
        }
      });
    }

    return () => {
      isCancelled = true;
      stopQuranAudio();
    };
  }, [isOpen, selectedSurahNumber]);

  // Quranpedia Modal Sub-state
  const [quranpediaModal, setQuranpediaModal] = useState<{
    isOpen: boolean;
    surahNumber: number;
    ayahNumber: number;
    surahNameAr: string;
    surahNameEn: string;
    arabicText: string;
  }>({
    isOpen: false,
    surahNumber: 1,
    ayahNumber: 1,
    surahNameAr: 'الفاتحة',
    surahNameEn: 'Al-Fatihah',
    arabicText: '',
  });

  const filteredSurahs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ALL_SURAHS;
    return ALL_SURAHS.filter(
      (s) =>
        s.nameAr.includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.nameTransliteration.toLowerCase().includes(q) ||
        s.number.toString() === q
    );
  }, [searchQuery]);

  const activeMeta = ALL_SURAHS.find((s) => s.number === selectedSurahNumber) || ALL_SURAHS[0];

  const handlePlayAyah = (arabicText: string, surahNum: number, ayahNum: number) => {
    const key = `${surahNum}:${ayahNum}`;
    if (playingAyahKey === key) {
      stopQuranAudio();
      setPlayingAyahKey(null);
    } else {
      setPlayingAyahKey(key);
      playQuranVerse(
        arabicText,
        `${surahNum}:${ayahNum}`,
        {
          onStart: () => setPlayingAyahKey(key),
          onEnd: () => setPlayingAyahKey(null),
          onError: () => setPlayingAyahKey(null),
        },
        selectedReciter
      );
    }
  };

  const handleCopyAyah = (text: string, ref: string, key: string) => {
    playTapSound();
    navigator.clipboard.writeText(`«${text}» [${ref}] - منصة عِلم`);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl h-[90vh] max-h-[820px] bg-[#FCFAF6] rounded-3xl border border-amber-300/80 shadow-2xl flex flex-col overflow-hidden text-slate-900"
        >
          {/* Header Bar */}
          <div className="p-4 sm:px-6 py-3.5 bg-linear-to-r from-amber-900 via-slate-900 to-amber-950 text-white flex items-center justify-between gap-3 shrink-0 border-b border-amber-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold font-serif text-amber-100">
                    {isAr ? 'المصحف الشريف المعتمد (صفحة مصغرة)' : 'Verified Holy Quran (Mini View)'}
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] text-emerald-300 font-bold">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{isAr ? 'مجمع الملك فهد' : 'King Fahd Complex'}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {isAr ? 'تلاوة مرتلة بالرسم العثماني مع التفسير الميسر والترجمة المعتمدة' : 'Uthmani typography with verified recitations & translations'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenFullPage && (
                <button
                  onClick={() => {
                    playTapSound();
                    onClose();
                    onOpenFullPage();
                  }}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title={isAr ? 'فتح في صفحة كاملة' : 'Expand Full Screen'}
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{isAr ? 'عرض كامل' : 'Full Page'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  playTapSound();
                  stopQuranAudio();
                  onClose();
                }}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/80 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Grid: Left/Right Surah Selector + Active Reader */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            
            {/* Column 1: Surah Selector List (md:col-span-4) */}
            <div className="md:col-span-4 border-b md:border-b-0 md:border-l md:border-[#EAE3D6] bg-[#F7F3EB] p-3 flex flex-col gap-2 overflow-hidden">
              
              {/* Search Box */}
              <div className="relative shrink-0">
                <Search className={`w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث في الـ 114 سورة...' : 'Search 114 surahs...'}
                  className={`w-full py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                    isRtl ? 'pr-8 pl-6' : 'pl-8 pr-6'
                  }`}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'left-2' : 'right-2'}`}>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Surahs Scrollable List */}
              <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                {filteredSurahs.map((surah) => {
                  const isSelected = surah.number === selectedSurahNumber;
                  return (
                    <button
                      key={surah.number}
                      onClick={() => {
                        playTapSound();
                        setSelectedSurahNumber(surah.number);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-start flex items-center justify-between gap-2 transition cursor-pointer ${
                        isSelected
                          ? 'bg-amber-100/90 border-amber-400 text-amber-950 font-bold shadow-2xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200/70 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {surah.number}
                        </span>
                        <div>
                          <span className="text-xs font-serif block">سورة {surah.nameAr}</span>
                          <span className="text-[10px] text-slate-400 block">{surah.nameEn}</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {surah.ayahCount} {isAr ? 'آية' : 'ayahs'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Surah Reader & Audio (md:col-span-8) */}
            <div className="md:col-span-8 bg-white p-4 sm:p-6 flex flex-col overflow-hidden">
              
              {/* Surah Header Card */}
              <div className="pb-3 mb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      {isAr ? `السورة رقم ${activeMeta.number}` : `Surah #${activeMeta.number}`}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                      {activeMeta.revelationType}
                    </span>
                    <span className="text-xs text-slate-500">
                      {isAr ? `الجزء ${activeMeta.juz} • صفحة ${activeMeta.page}` : `Juz ${activeMeta.juz} • Page ${activeMeta.page}`}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-1">
                    سورة {activeMeta.nameAr} ({activeMeta.nameEn})
                  </h2>
                </div>

                {/* Reciter Toggle */}
                <div className="flex items-center gap-1.5 bg-[#F6F1EA] p-1 rounded-xl border border-[#EAE3D6] text-[11px]">
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                  <button
                    onClick={() => {
                      setSelectedReciter('hudhaify');
                      saveReciter('hudhaify');
                    }}
                    className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                      selectedReciter === 'hudhaify' ? 'bg-amber-700 text-white' : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    الحذيفي
                  </button>
                  <button
                    onClick={() => {
                      setSelectedReciter('husary');
                      saveReciter('husary');
                    }}
                    className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                      selectedReciter === 'husary' ? 'bg-amber-700 text-white' : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    الحصري
                  </button>
                </div>
              </div>

              {/* Theme Note */}
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6] text-[11px] text-slate-700 mb-3 shrink-0">
                <span className="font-bold text-amber-900 font-serif">💡 مقصد السورة: </span>
                <span>{isAr ? activeMeta.themeSummaryAr : activeMeta.themeSummaryEn}</span>
              </div>

              {/* Scrollable Ayahs Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {isLoadingSurah ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-8 h-8 border-3 border-amber-300 border-t-amber-700 rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-amber-950 font-bold font-sans">
                      {isAr ? 'جاري استحضار النص القرآني المعتمد والتلاوة...' : 'Loading verified Uthmani text...'}
                    </p>
                  </div>
                ) : surahData ? (
                  <>
                    {surahData.bismillah && (
                      <div className="text-center py-2 select-none">
                        <span className="font-serif text-xl font-bold text-slate-900 block">
                          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </span>
                      </div>
                    )}

                    {surahData.ayahs.map((ayah) => {
                      const ayahKey = `${activeMeta.number}:${ayah.numberInSurah}`;
                      const isPlaying = playingAyahKey === ayahKey;
                      const isCopied = copiedKey === ayahKey;

                      return (
                        <div
                          key={ayah.numberInSurah}
                          className={`p-3 rounded-2xl border transition-all ${
                            isPlaying
                              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                              : 'bg-white hover:bg-slate-50/70 border-slate-100'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0 mt-1 select-none">
                              {ayah.numberInSurah}
                            </span>

                            <div className="flex-1">
                              <p className="font-serif text-lg sm:text-xl font-bold leading-loose text-slate-950 text-start select-none">
                                {ayah.arabicText}
                              </p>
                              {ayah.translationEn && (
                                <p className="text-[11px] text-slate-500 font-sans mt-1 text-start leading-relaxed">
                                  {ayah.translationEn}
                                </p>
                              )}
                              {ayah.tafseerAr && (
                                <div className="mt-1.5 p-2 rounded-xl bg-amber-50/60 border border-amber-100 text-[10px] text-amber-950 leading-relaxed text-start">
                                  <span className="font-bold text-amber-900">التفسير الميسر: </span>
                                  {ayah.tafseerAr}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                onClick={() => handlePlayAyah(ayah.arabicText, activeMeta.number, ayah.numberInSurah)}
                                className={`p-1.5 rounded-lg transition cursor-pointer ${
                                  isPlaying ? 'bg-amber-700 text-white' : 'bg-slate-100 hover:bg-amber-100 text-slate-700'
                                }`}
                                title={isPlaying ? 'إيقاف' : 'استماع'}
                              >
                                {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-700" />}
                              </button>

                              <button
                                onClick={() =>
                                  setQuranpediaModal({
                                    isOpen: true,
                                    surahNumber: activeMeta.number,
                                    ayahNumber: ayah.numberInSurah,
                                    surahNameAr: activeMeta.nameAr,
                                    surahNameEn: activeMeta.nameEn,
                                    arabicText: ayah.arabicText,
                                  })
                                }
                                className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 transition cursor-pointer"
                                title="قرآن بيديا"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() =>
                                  handleCopyAyah(ayah.arabicText, `سورة ${activeMeta.nameAr}: ${ayah.numberInSurah}`, ayahKey)
                                }
                                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 transition cursor-pointer"
                                title="نسخ"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Nested Quranpedia modal */}
        <QuranpediaModal
          isOpen={quranpediaModal.isOpen}
          onClose={() => setQuranpediaModal((p) => ({ ...p, isOpen: false }))}
          language={language}
          surahNumber={quranpediaModal.surahNumber}
          ayahNumber={quranpediaModal.ayahNumber}
          surahNameAr={quranpediaModal.surahNameAr}
          surahNameEn={quranpediaModal.surahNameEn}
          arabicText={quranpediaModal.arabicText}
        />
      </div>
    </AnimatePresence>
  );
};
