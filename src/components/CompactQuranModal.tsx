import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, TrackId } from '../types';
import { ALL_SURAHS, SurahMeta, QuranAyah } from '../data/quranData';
import { loadSurahAyahs, FullSurahData } from '../utils/quranLoader';
import { playQuranVerse, stopQuranAudio, QURAN_RECITERS, QuranReciterId, getSavedReciter, saveReciter } from '../utils/quranAudio';
import { QuranpediaModal } from './QuranpediaModal';
import { playTapSound } from '../utils/platformSounds';
import { useReadingDarkMode } from '../utils/readingMode';
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
  Maximize2,
  Moon,
  Sun
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

  // Dedicated Eye-Comfort Dark Reading Mode
  const { isDark, toggle: toggleDarkMode } = useReadingDarkMode();

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
          className={`w-full max-w-4xl h-[90vh] max-h-[820px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-colors duration-300 ${
            isDark 
              ? 'bg-[#101419] border-amber-900/40 text-[#E2E8F0]' 
              : 'bg-[#FCFAF6] border-amber-300/80 text-slate-900'
          }`}
        >
          {/* Header Bar */}
          <div className={`p-4 sm:px-6 py-3.5 text-white flex items-center justify-between gap-3 shrink-0 border-b transition-colors duration-300 ${
            isDark
              ? 'bg-gradient-to-r from-slate-950 via-[#131A22] to-slate-950 border-amber-900/30'
              : 'bg-linear-to-r from-amber-900 via-slate-900 to-amber-950 border-amber-500/20'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-xs ${
                isDark
                  ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                  : 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
              }`}>
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
              {/* Dedicated Dark Reading Mode Toggle */}
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  toggleDarkMode();
                }}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-3xs ${
                  isDark
                    ? 'bg-amber-400/15 border-amber-400/30 text-amber-300 hover:bg-amber-400/25'
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-amber-100'
                }`}
                title={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى وضع القراءة الليلي المريح للعين'}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-amber-200" />}
                <span className="hidden sm:inline text-xs">
                  {isDark ? 'الوضع النهاري' : 'وضع القراءة الليلي 🌙'}
                </span>
              </button>

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
            <div className={`md:col-span-4 border-b md:border-b-0 md:border-l p-3 flex flex-col gap-2 overflow-hidden transition-colors duration-300 ${
              isDark 
                ? 'bg-[#141B22] border-[#222E3C]' 
                : 'bg-[#F7F3EB] border-[#EAE3D6]'
            }`}>
              
              {/* Search Box */}
              <div className="relative shrink-0">
                <Search className={`w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                } ${isRtl ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث في الـ 114 سورة...' : 'Search 114 surahs...'}
                  className={`w-full py-1.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                    isDark
                      ? 'bg-[#1A232D] border-[#2B3A4C] text-[#E2E8F0] placeholder-[#64748B]'
                      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                  } ${isRtl ? 'pr-8 pl-6' : 'pl-8 pr-6'}`}
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
                          ? (isDark 
                              ? 'bg-amber-950/60 border-amber-600/50 text-amber-200 font-bold shadow-2xs' 
                              : 'bg-amber-100/90 border-amber-400 text-amber-950 font-bold shadow-2xs')
                          : (isDark 
                              ? 'bg-[#17202A] hover:bg-[#1E2835] border-[#24303E] text-[#CBD5E1]' 
                              : 'bg-white hover:bg-slate-50 border-slate-200/70 text-slate-700')
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 ${
                          isSelected 
                            ? 'bg-amber-700 text-white' 
                            : (isDark ? 'bg-[#222E3C] text-slate-300' : 'bg-slate-100 text-slate-600')
                        }`}>
                          {surah.number}
                        </span>
                        <div>
                          <span className="text-xs font-serif block">سورة {surah.nameAr}</span>
                          <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{surah.nameEn}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-[#222E3C] text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {surah.ayahCount} {isAr ? 'آية' : 'ayahs'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Surah Reader & Audio (md:col-span-8) */}
            <div className={`md:col-span-8 p-4 sm:p-6 flex flex-col overflow-hidden transition-colors duration-300 ${
              isDark ? 'bg-[#101419]' : 'bg-white'
            }`}>
              
              {/* Surah Header Card */}
              <div className={`pb-3 mb-3 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
                isDark ? 'border-[#222F3E]' : 'border-slate-100'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-amber-950/70 border border-amber-800/40 text-amber-300' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {isAr ? `السورة رقم ${activeMeta.number}` : `Surah #${activeMeta.number}`}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isDark ? 'bg-[#1D2733] text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {activeMeta.revelationType}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isAr ? `الجزء ${activeMeta.juz} • صفحة ${activeMeta.page}` : `Juz ${activeMeta.juz} • Page ${activeMeta.page}`}
                    </span>
                  </div>
                  <h2 className={`text-xl sm:text-2xl font-bold font-serif mt-1 ${
                    isDark ? 'text-[#F5EAD4]' : 'text-slate-900'
                  }`}>
                    سورة {activeMeta.nameAr} ({activeMeta.nameEn})
                  </h2>
                </div>

                {/* Reciter Toggle */}
                <div className={`flex items-center gap-1.5 p-1 rounded-xl border text-[11px] ${
                  isDark ? 'bg-[#161F2A] border-[#253446]' : 'bg-[#F6F1EA] border-[#EAE3D6]'
                }`}>
                  <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                  <button
                    onClick={() => {
                      setSelectedReciter('hudhaify');
                      saveReciter('hudhaify');
                    }}
                    className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                      selectedReciter === 'hudhaify' 
                        ? 'bg-amber-700 text-white' 
                        : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950')
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
                      selectedReciter === 'husary' 
                        ? 'bg-amber-700 text-white' 
                        : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950')
                    }`}
                  >
                    الحصري
                  </button>
                </div>
              </div>

              {/* Theme Note */}
              <div className={`p-2.5 rounded-xl border text-[11px] mb-3 shrink-0 ${
                isDark 
                  ? 'bg-[#161F2A] border-[#253446] text-[#CBD5E1]' 
                  : 'bg-[#FAF7F2] border-[#EAE3D6] text-slate-700'
              }`}>
                <span className="font-bold text-amber-500 font-serif">💡 مقصد السورة: </span>
                <span>{isAr ? activeMeta.themeSummaryAr : activeMeta.themeSummaryEn}</span>
              </div>

              {/* Scrollable Ayahs Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {isLoadingSurah ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-8 h-8 border-3 border-amber-300 border-t-amber-700 rounded-full animate-spin mx-auto" />
                    <p className={`text-xs font-bold font-sans ${isDark ? 'text-amber-200' : 'text-amber-950'}`}>
                      {isAr ? 'جاري استحضار النص القرآني المعتمد والتلاوة...' : 'Loading verified Uthmani text...'}
                    </p>
                  </div>
                ) : surahData ? (
                  <>
                    {surahData.bismillah && (
                      <div className="text-center py-2 select-none">
                        <span className={`font-serif text-xl font-bold block ${isDark ? 'text-[#F5EAD4]' : 'text-slate-900'}`}>
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
                          className={`p-3 sm:p-3.5 rounded-2xl border transition-all ${
                            isPlaying
                              ? (isDark ? 'bg-[#1C2532] border-amber-500/60 ring-2 ring-amber-500/30' : 'bg-amber-50 border-amber-400 ring-2 ring-amber-300')
                              : (isDark ? 'bg-[#151D26] hover:bg-[#1A2430] border-[#202C3B]' : 'bg-white hover:bg-slate-50/70 border-slate-100')
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-1 select-none ${
                              isDark ? 'bg-amber-950/80 border border-amber-800/50 text-amber-300' : 'bg-amber-100 text-amber-900'
                            }`}>
                              {ayah.numberInSurah}
                            </span>

                            <div className="flex-1">
                              <p className={`font-serif text-lg sm:text-xl font-bold leading-loose text-start select-none ${
                                isDark ? 'text-[#F5EAD4]' : 'text-slate-950'
                              }`}>
                                {ayah.arabicText}
                              </p>
                              {ayah.translationEn && (
                                <p className={`text-[11px] font-sans mt-1 text-start leading-relaxed ${
                                  isDark ? 'text-[#94A3B8]' : 'text-slate-500'
                                }`}>
                                  {ayah.translationEn}
                                </p>
                              )}
                              {ayah.tafseerAr && (
                                <div className={`mt-2 p-2.5 rounded-xl border text-[11px] leading-relaxed text-start ${
                                  isDark 
                                    ? 'bg-[#19222E] border-[#263445] text-[#CBD5E1]' 
                                    : 'bg-amber-50/60 border-amber-100 text-amber-950'
                                }`}>
                                  <span className="font-bold text-amber-500">التفسير الميسر: </span>
                                  {ayah.tafseerAr}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                onClick={() => handlePlayAyah(ayah.arabicText, activeMeta.number, ayah.numberInSurah)}
                                className={`p-1.5 rounded-lg transition cursor-pointer ${
                                  isPlaying 
                                    ? 'bg-amber-700 text-white' 
                                    : (isDark ? 'bg-[#1E2835] hover:bg-amber-900/40 text-slate-300' : 'bg-slate-100 hover:bg-amber-100 text-slate-700')
                                }`}
                                title={isPlaying ? 'إيقاف' : 'استماع'}
                              >
                                {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-500" />}
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
                                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                  isDark ? 'bg-teal-950/40 hover:bg-teal-900/50 text-teal-300 border-teal-800/40' : 'bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200'
                                }`}
                                title="قرآن بيديا"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() =>
                                  handleCopyAyah(ayah.arabicText, `سورة ${activeMeta.nameAr}: ${ayah.numberInSurah}`, ayahKey)
                                }
                                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                  isDark ? 'bg-[#1C2633] hover:bg-[#233040] text-slate-400 hover:text-white border-[#273545]' : 'bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200'
                                }`}
                                title="نسخ"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
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
