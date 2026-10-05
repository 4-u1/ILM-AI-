import React, { useState, useMemo, useEffect } from 'react';
import { Language } from '../types';
import { 
  ALL_SURAHS, 
  ESSENTIAL_SURAHS_TEXT, 
  SurahMeta, 
  QuranAyah,
  FavoriteAyah 
} from '../data/quranData';
import { loadSurahAyahs, FullSurahData } from '../utils/quranLoader';
import { 
  playQuranVerse, 
  stopQuranAudio, 
  QURAN_RECITERS, 
  QuranReciterId, 
  getSavedReciter, 
  saveReciter 
} from '../utils/quranAudio';
import { QuranpediaModal } from './QuranpediaModal';
import { 
  BookOpen, 
  Search, 
  Volume2, 
  VolumeX, 
  Check, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Bookmark, 
  ExternalLink, 
  Download, 
  X,
  ListFilter,
  CheckCircle2,
  HardDrive,
  Heart,
  Trash2,
  Share2,
  Copy
} from 'lucide-react';

interface QuranBrowserProps {
  language: Language;
  onSelectSurahForStudy?: (surahNumber: number) => void;
  className?: string;
  initialTab?: 'surahs' | 'favorites';
}

export const QuranBrowser: React.FC<QuranBrowserProps> = ({
  language,
  onSelectSurahForStudy,
  className = '',
  initialTab = 'surahs',
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  // View Mode: 'surahs' (browse/read) or 'favorites' (saved verses)
  const [activeTab, setActiveTab] = useState<'surahs' | 'favorites'>(initialTab);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'meccan' | 'medinan'>('all');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);
  const [currentSurahData, setCurrentSurahData] = useState<FullSurahData | null>(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState<boolean>(false);
  
  // Audio state
  const [playingAyahKey, setPlayingAyahKey] = useState<string | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<QuranReciterId>(() => getSavedReciter());

  // Load dynamic surah ayahs whenever selectedSurahNumber changes
  useEffect(() => {
    let cancelled = false;
    setIsLoadingSurah(true);
    loadSurahAyahs(selectedSurahNumber).then((data) => {
      if (!cancelled) {
        setCurrentSurahData(data);
        setIsLoadingSurah(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedSurahNumber]);

  // Bookmarking in localStorage for Offline reading continuity
  const [bookmarkedSurah, setBookmarkedSurah] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ilm_quran_bookmark');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Favorite Ayahs State with localStorage persistence
  const [favorites, setFavorites] = useState<FavoriteAyah[]>(() => {
    try {
      const saved = localStorage.getItem('ilm_quran_favorites');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error loading quran favorites:', e);
    }
    // Default initial favorites: Al-Fatihah 1:1, Al-Ikhlas 112:1
    return [
      {
        id: '1:1',
        surahNumber: 1,
        surahNameAr: 'الفاتحة',
        surahNameEn: 'Al-Fatihah',
        ayahNumber: 1,
        arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        tafseerAr: 'أبدأ قراءتي مستعيناً باسم الله ومستحضراً رحمته الواسعة بجميع خلقه.',
        savedAt: '2026-10-04',
      },
      {
        id: '112:1',
        surahNumber: 112,
        surahNameAr: 'الإخلاص',
        surahNameEn: 'Al-Ikhlas',
        ayahNumber: 1,
        arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        translationEn: 'Say, "He is Allah, [who is] One,',
        tafseerAr: 'قل أيها الرسول للناس: الله هو الإله الواحد الأحد، الذي لا شريك له في ربوبيته وألوهيته.',
        savedAt: '2026-10-04',
      },
    ];
  });

  // Toast feedback for favorites
  const [copiedAyahKey, setCopiedAyahKey] = useState<string | null>(null);

  // Quranpedia Encyclopedia Modal State
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

  // Stop audio on unmount or surah switch
  useEffect(() => {
    return () => {
      stopQuranAudio();
    };
  }, [selectedSurahNumber, activeTab]);

  const handleSelectReciter = (reciterId: QuranReciterId) => {
    stopQuranAudio();
    setPlayingAyahKey(null);
    setSelectedReciter(reciterId);
    saveReciter(reciterId);
  };

  const handleBookmark = (surahNum: number) => {
    setBookmarkedSurah(surahNum);
    try {
      localStorage.setItem('ilm_quran_bookmark', surahNum.toString());
    } catch {
      // ignore
    }
  };

  // Toggle Ayah in favorites
  const handleToggleFavorite = (surahMeta: SurahMeta, ayah: QuranAyah) => {
    const key = `${surahMeta.number}:${ayah.numberInSurah}`;
    const exists = favorites.some((f) => f.id === key);

    let updated: FavoriteAyah[];
    if (exists) {
      updated = favorites.filter((f) => f.id !== key);
    } else {
      const newFav: FavoriteAyah = {
        id: key,
        surahNumber: surahMeta.number,
        surahNameAr: surahMeta.nameAr,
        surahNameEn: surahMeta.nameEn,
        ayahNumber: ayah.numberInSurah,
        arabicText: ayah.arabicText,
        translationEn: ayah.translationEn,
        tafseerAr: ayah.tafseerAr,
        savedAt: new Date().toISOString().split('T')[0],
      };
      updated = [newFav, ...favorites];
    }

    setFavorites(updated);
    try {
      localStorage.setItem('ilm_quran_favorites', JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving favorites:', e);
    }
  };

  const handleRemoveFavoriteById = (favId: string) => {
    const updated = favorites.filter((f) => f.id !== favId);
    setFavorites(updated);
    try {
      localStorage.setItem('ilm_quran_favorites', JSON.stringify(updated));
    } catch (e) {
      console.warn('Error removing favorite:', e);
    }
  };

  const handleCopyAyah = (text: string, ref: string, key: string) => {
    const copyText = `«${text}» [${ref}] - منصة عِلم`;
    navigator.clipboard.writeText(copyText);
    setCopiedAyahKey(key);
    setTimeout(() => setCopiedAyahKey(null), 2500);
  };

  // Filtered Surahs List
  const filteredSurahs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_SURAHS.filter((surah) => {
      // Filter by Revelation Type
      if (filterType === 'meccan' && surah.revelationType !== 'مكية') return false;
      if (filterType === 'medinan' && surah.revelationType !== 'مدنية') return false;

      // Filter by Search Query
      if (!q) return true;
      return (
        surah.nameAr.includes(q) ||
        surah.nameEn.toLowerCase().includes(q) ||
        surah.nameTransliteration.toLowerCase().includes(q) ||
        surah.number.toString() === q ||
        surah.themeSummaryAr.includes(q) ||
        surah.themeSummaryEn.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, filterType]);

  // Filtered Favorites List
  const filteredFavorites = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return favorites;
    return favorites.filter((f) => 
      f.arabicText.includes(q) ||
      f.surahNameAr.includes(q) ||
      f.surahNameEn.toLowerCase().includes(q) ||
      f.translationEn.toLowerCase().includes(q) ||
      f.id.includes(q)
    );
  }, [favorites, searchQuery]);

  const activeSurahMeta = ALL_SURAHS.find((s) => s.number === selectedSurahNumber) || ALL_SURAHS[0];
  const activeSurahText = ESSENTIAL_SURAHS_TEXT[selectedSurahNumber];

  const handlePlayAyah = (arabicText: string, surahNum: number, ayahNum: number) => {
    const key = `${surahNum}:${ayahNum}`;
    if (playingAyahKey === key) {
      stopQuranAudio();
      setPlayingAyahKey(null);
    } else {
      setPlayingAyahKey(key);
      const refString = `${surahNum}:${ayahNum}`;
      playQuranVerse(
        arabicText,
        refString,
        {
          onStart: () => setPlayingAyahKey(key),
          onEnd: () => setPlayingAyahKey(null),
          onError: () => setPlayingAyahKey(null),
        },
        selectedReciter
      );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Top Banner & King Fahd Complex Verification Stamp */}
      <div className="p-5 sm:p-7 rounded-3xl bg-linear-to-r from-amber-900 via-slate-900 to-amber-950 text-white shadow-xl relative overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute top-0 right-0 p-8 opacity-5 select-none font-serif text-8xl font-black">
          القرآن
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs mb-3 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {isAr 
                  ? 'مصحف مجمع الملك فهد لطباعة المصحف الشريف (الرسم العثماني 100%)' 
                  : 'King Fahd Complex for Printing the Holy Quran (100% Verified)'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-2 text-white">
              {isAr ? 'القرآن الكريم والتلاوات المرتلة' : 'The Holy Quran & Audio Recitations'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {isAr
                ? 'تصفح فهرس السور الـ 114 كاملاً، واقرأ واستمع للنص العثماني المعتمد، واحفظ الآيات المؤثرة في مفضلتك للرجوع إليها دون اتصال.'
                : 'Browse all 114 Surahs, recite authentic Uthmani text, listen to accredited reciters, and bookmark your favorite verses.'}
            </p>
          </div>

          {/* Quick Offline Status & Reciter Select */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'حالة التخزين:' : 'Offline Cache:'}</span>
              </span>
              <span className="text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full text-[11px]">
                {isAr ? 'متاح بدون إنترنت ✓' : 'Ready Offline ✓'}
              </span>
            </div>

            {/* Reciter Toggle */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-[11px] text-amber-200 font-bold flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'القارئ:' : 'Reciter:'}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSelectReciter('hudhaify')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    selectedReciter === 'hudhaify'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                  title="الشيخ علي الحذيفي (مجمع الملك فهد)"
                >
                  الحذيفي
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectReciter('husary')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    selectedReciter === 'husary'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                  title="الشيخ محمود خليل الحصري (المصحف المعلم)"
                >
                  الحصري
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Section Switcher: All Surahs vs Favorites */}
      <div className="flex items-center justify-center p-1 bg-[#F5EFE6] rounded-2xl border border-[#EAE3D6] max-w-md mx-auto shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('surahs')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'surahs'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>{isAr ? 'فهرس ومصحف السور (114)' : 'Quran Surahs (114)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-rose-900 hover:text-rose-950'
          }`}
        >
          <Heart className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-white' : 'fill-rose-200 text-rose-600'}`} />
          <span>{isAr ? 'مفضلة الآيات' : 'Favorite Verses'}</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            activeTab === 'favorites' ? 'bg-rose-900/60 text-white' : 'bg-rose-100 text-rose-800'
          }`}>
            {favorites.length}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ALL SURAHS DIRECTORY & READER                     */}
      {/* ======================================================== */}
      {activeTab === 'surahs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
          
          {/* SURAHS LIST / DIRECTORY COLUMN (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>{isAr ? 'فهرس سور القرآن الكريم (114)' : 'Quran Surahs Directory'}</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {filteredSurahs.length} {isAr ? 'سورة' : 'surahs'}
              </span>
            </div>

            {/* Search Input for Quick Access */}
            <div className="relative">
              <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث باسم السورة، رقمها، أو موضوعها...' : 'Search surah name, number, topic...'}
                className={`w-full py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800 ${
                  isRtl ? 'pr-9 pl-8' : 'pl-9 pr-8'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${isRtl ? 'left-3' : 'right-3'}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isAr ? 'الكل (114)' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => setFilterType('meccan')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterType === 'meccan'
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/60'
                }`}
              >
                {isAr ? 'مكية (أصول التوحيد)' : 'Meccan'}
              </button>
              <button
                type="button"
                onClick={() => setFilterType('medinan')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterType === 'medinan'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200/60'
                }`}
              >
                {isAr ? 'مدنية (التشريع والأسرة)' : 'Medinan'}
              </button>
            </div>

            {/* Surahs Scrollable List */}
            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredSurahs.map((surah) => {
                const isSelected = surah.number === selectedSurahNumber;
                const isBookmarked = surah.number === bookmarkedSurah;

                return (
                  <div
                    key={surah.number}
                    onClick={() => {
                      stopQuranAudio();
                      setPlayingAyahKey(null);
                      setSelectedSurahNumber(surah.number);
                    }}
                    className={`w-full p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-start ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300/40 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Surah Number Badge */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {surah.number}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm font-serif">
                            سورة {surah.nameAr}
                          </span>
                          <span className="text-[10px] text-slate-500 font-sans">
                            ({surah.nameTransliteration})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                            surah.revelationType === 'مكية'
                              ? 'bg-amber-100/70 text-amber-900'
                              : 'bg-emerald-100/70 text-emerald-900'
                          }`}>
                            {surah.revelationType}
                          </span>
                          <span>•</span>
                          <span>{surah.ayahCount} {isAr ? 'آية' : 'ayahs'}</span>
                          <span>•</span>
                          <span>{isAr ? `الجزء ${surah.juz}` : `Juz ${surah.juz}`}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isBookmarked && (
                        <span className="text-amber-600" title="الموضع المحفوظ">
                          <Bookmark className="w-4 h-4 fill-amber-500 text-amber-500" />
                        </span>
                      )}
                      <ChevronIcon className={`w-4 h-4 ${isSelected ? 'text-amber-700' : 'text-slate-300'}`} />
                    </div>
                  </div>
                );
              })}

              {filteredSurahs.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  {isAr ? 'لا توجد سورة مطابقة لخيارات البحث الحالية.' : 'No surahs match your search.'}
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE SURAH READER & AUDIOS (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
            
            {/* Header of Active Surah */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    {isAr ? `السورة رقم ${activeSurahMeta.number}` : `Surah #${activeSurahMeta.number}`}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeSurahMeta.revelationType === 'مكية'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {activeSurahMeta.revelationType}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif mt-2">
                  سورة {activeSurahMeta.nameAr}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {activeSurahMeta.nameEn} • {activeSurahMeta.ayahCount} {isAr ? 'آية' : 'verses'} • {isAr ? `صفحة ${activeSurahMeta.page}` : `Page ${activeSurahMeta.page}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={() => handleBookmark(activeSurahMeta.number)}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    bookmarkedSurah === activeSurahMeta.number
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                  title={isAr ? 'حفظ موضع القراءة' : 'Bookmark Surah'}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedSurah === activeSurahMeta.number ? 'fill-white' : ''}`} />
                  <span>{bookmarkedSurah === activeSurahMeta.number ? (isAr ? 'محفوظة' : 'Saved') : (isAr ? 'حفظ' : 'Bookmark')}</span>
                </button>

                {/* Study in Track Button */}
                {onSelectSurahForStudy && (
                  <button
                    type="button"
                    onClick={() => onSelectSurahForStudy(activeSurahMeta.number)}
                    className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'دراسة السورة في المسار' : 'Study in Track'}</span>
                  </button>
                )}

                {/* Quranpedia Surah Overview Button */}
                <button
                  type="button"
                  onClick={() => setQuranpediaModal({
                    isOpen: true,
                    surahNumber: activeSurahMeta.number,
                    ayahNumber: 1,
                    surahNameAr: activeSurahMeta.nameAr,
                    surahNameEn: activeSurahMeta.nameEn,
                    arabicText: activeSurahText?.ayahs[0]?.arabicText || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                  })}
                  className="px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="فتح موسوعة قرآن بيديا الشاملة لهذه السورة والآيات"
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                  <span>{isAr ? 'موسوعة قرآن بيديا' : 'Quranpedia'}</span>
                </button>
              </div>
            </div>

            {/* Theme & Reflection Summary Card */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] text-xs text-slate-700 space-y-1">
              <span className="font-bold text-amber-900 block font-serif text-sm">
                {isAr ? '💡 المقصد والجوهر القرآني للسورة:' : '💡 Central Theme:'}
              </span>
              <p className="leading-relaxed">
                {isAr ? activeSurahMeta.themeSummaryAr : activeSurahMeta.themeSummaryEn}
              </p>
            </div>

            {/* Authentic Surah Content (King Fahd Complex text) */}
            {isLoadingSurah ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-9 h-9 border-3 border-amber-300 border-t-amber-700 rounded-full animate-spin mx-auto" />
                <p className="text-xs text-amber-950 font-bold font-sans">
                  {isAr ? 'جاري استحضار النص القرآني والتلاوة المعتمدة...' : 'Loading verified Uthmani text...'}
                </p>
              </div>
            ) : currentSurahData ? (
              <div className="space-y-4">
                {currentSurahData.bismillah && (
                  <div className="text-center py-4 select-none">
                    <span className="font-serif text-2xl font-bold text-slate-900 leading-relaxed block">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  {currentSurahData.ayahs.map((ayah) => {
                    const ayahKey = `${activeSurahMeta.number}:${ayah.numberInSurah}`;
                    const isPlaying = playingAyahKey === ayahKey;
                    const isFav = favorites.some((f) => f.id === ayahKey);
                    const isCopied = copiedAyahKey === ayahKey;

                    return (
                      <div
                        key={ayah.numberInSurah}
                        className={`p-4 rounded-2xl border transition-all ${
                          isPlaying
                            ? 'bg-amber-100/80 border-amber-400 ring-2 ring-amber-300'
                            : 'bg-white hover:bg-amber-50/40 border-slate-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Ayah Number Badge */}
                          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0 mt-1 select-none">
                            {ayah.numberInSurah}
                          </span>

                          {/* Arabic Text (Uthmani Typography) */}
                          <div className="flex-1 text-center sm:text-start">
                            <p className="font-serif text-xl sm:text-2xl leading-loose font-bold text-slate-950 select-none">
                              {ayah.arabicText}
                            </p>
                            <p className="text-xs text-slate-500 font-sans mt-2 text-start leading-relaxed">
                              {ayah.translationEn}
                            </p>
                            {ayah.tafseerAr && (
                              <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-amber-950/80 text-start bg-amber-50/50 p-2 rounded-xl">
                                <span className="font-bold text-amber-900">تفسير ميسر (الدرر السنية): </span>
                                {ayah.tafseerAr}
                              </div>
                            )}
                          </div>

                          {/* Actions Column: Audio, Favorite, Copy */}
                          <div className="flex flex-col gap-1.5 shrink-0">
                            {/* Audio Play Trigger */}
                            <button
                              type="button"
                              onClick={() => handlePlayAyah(ayah.arabicText, activeSurahMeta.number, ayah.numberInSurah)}
                              className={`p-2 rounded-xl transition cursor-pointer ${
                                isPlaying
                                  ? 'bg-amber-700 text-white shadow-xs animate-pulse'
                                  : 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900'
                              }`}
                              title={isPlaying ? 'إيقاف التلاوة' : 'استمع لتلاوة الآية'}
                            >
                              {isPlaying ? (
                                <VolumeX className="w-4 h-4" />
                              ) : (
                                <Volume2 className="w-4 h-4 text-amber-700" />
                              )}
                            </button>

                            {/* Favorite Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleFavorite(activeSurahMeta, ayah)}
                              className={`p-2 rounded-xl transition cursor-pointer border ${
                                isFav
                                  ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs'
                                  : 'bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border-slate-200'
                              }`}
                              title={isFav ? (isAr ? 'إزالة من المفضلة' : 'Remove from Favorites') : (isAr ? 'إضافة إلى المفضلة' : 'Add to Favorites')}
                            >
                              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
                            </button>

                            {/* Quranpedia 12 Services Modal Trigger */}
                            <button
                              type="button"
                              onClick={() => setQuranpediaModal({
                                isOpen: true,
                                surahNumber: activeSurahMeta.number,
                                ayahNumber: ayah.numberInSurah,
                                surahNameAr: activeSurahMeta.nameAr,
                                surahNameEn: activeSurahMeta.nameEn,
                                arabicText: ayah.arabicText,
                              })}
                              className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 transition cursor-pointer"
                              title={isAr ? 'موسوعة قرآن بيديا (12 خدمة: تفاسير، ترجمات، تدبر، مفردات)' : 'Quranpedia 12 Services'}
                            >
                              <BookOpen className="w-4 h-4" />
                            </button>

                            {/* Copy Verse Button */}
                            <button
                              type="button"
                              onClick={() => handleCopyAyah(ayah.arabicText, `سورة ${activeSurahMeta.nameAr}: ${ayah.numberInSurah}`, ayahKey)}
                              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 transition cursor-pointer"
                              title={isAr ? 'نسخ نص الآية' : 'Copy Verse'}
                            >
                              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Reference Notice */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة</span>
              </span>
              <span className="font-mono">100% Verified</span>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: FAVORITES SECTION (المفضلة القرآنية للدارس)        */}
      {/* ======================================================== */}
      {activeTab === 'favorites' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-rose-600" />
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                  {isAr ? 'مفضلة الآيات القرآنية للمتعلم' : 'Favorite Quranic Verses'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isAr
                  ? 'الآيات التي قمت بحفظها أثناء تصفحك للقرآن الكريم والدروس، محفوظة على جهازك محلياً لسهولة المراجعة والاستماع في أي وقت.'
                  : 'Verses you saved during your Quranic learning, stored offline on your device for quick reflection and recitation.'}
              </p>
            </div>

            <span className="text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 shrink-0 self-start sm:self-auto">
              {favorites.length} {isAr ? 'آيات محفوظة' : 'verses saved'}
            </span>
          </div>

          {/* Search within Favorites */}
          {favorites.length > 0 && (
            <div className="relative max-w-md">
              <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث داخل الآيات المفضلة...' : 'Search within favorite verses...'}
                className={`w-full py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 text-slate-800 ${
                  isRtl ? 'pr-9 pl-8' : 'pl-9 pr-8'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${isRtl ? 'left-3' : 'right-3'}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Favorites List Rendering */}
          {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFavorites.map((fav) => {
                const isPlaying = playingAyahKey === fav.id;
                const isCopied = copiedAyahKey === fav.id;

                return (
                  <div
                    key={fav.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                      isPlaying
                        ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-2xs'
                    }`}
                  >
                    <div>
                      {/* Top Verse Badge & Delete */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold text-amber-900 bg-amber-100/70 border border-amber-200 px-2.5 py-0.5 rounded-lg font-serif">
                          سورة {fav.surahNameAr} : الآية {fav.ayahNumber}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleRemoveFavoriteById(fav.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title={isAr ? 'حذف من المفضلة' : 'Remove from Favorites'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Arabic Quranic Text */}
                      <blockquote className="font-serif text-xl sm:text-2xl leading-loose font-bold text-slate-950 my-2 text-center select-none">
                        «{fav.arabicText}»
                      </blockquote>

                      {/* English Meaning */}
                      <p className="text-xs text-slate-500 font-sans leading-relaxed mt-2">
                        {fav.translationEn}
                      </p>

                      {/* Tafseer Note */}
                      {fav.tafseerAr && (
                        <div className="mt-3 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/50 text-[11px] text-amber-950">
                          <span className="font-bold text-amber-900">تفسير الدرر السنية: </span>
                          {fav.tafseerAr}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      {/* Recitation Trigger */}
                      <button
                        type="button"
                        onClick={() => handlePlayAyah(fav.arabicText, fav.surahNumber, fav.ayahNumber)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-700 text-white shadow-xs animate-pulse'
                            : 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900'
                        }`}
                      >
                        {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-700" />}
                        <span>{isPlaying ? (isAr ? 'إيقاف' : 'Stop') : (isAr ? 'استماع بالتجويد' : 'Listen')}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Quranpedia Button for Favorite */}
                        <button
                          type="button"
                          onClick={() => setQuranpediaModal({
                            isOpen: true,
                            surahNumber: fav.surahNumber,
                            ayahNumber: fav.ayahNumber,
                            surahNameAr: fav.surahNameAr,
                            surahNameEn: fav.surahNameEn,
                            arabicText: fav.arabicText,
                          })}
                          className="p-1.5 rounded-lg border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 transition cursor-pointer"
                          title={isAr ? 'موسوعة قرآن بيديا' : 'Quranpedia'}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>

                        {/* Copy Text */}
                        <button
                          type="button"
                          onClick={() => handleCopyAyah(fav.arabicText, `سورة ${fav.surahNameAr}: ${fav.ayahNumber}`, fav.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                          title={isAr ? 'نسخ نص الآية' : 'Copy'}
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        {/* Open Surah in Browser */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSurahNumber(fav.surahNumber);
                            setActiveTab('surahs');
                          }}
                          className="text-[11px] text-amber-700 font-bold hover:underline"
                        >
                          {isAr ? 'عرض السورة كاملة ←' : 'View Surah →'}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center space-y-3 rounded-3xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 fill-rose-200 text-rose-500" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                {isAr ? 'لا توجد آيات في المفضلة حالياً' : 'No favorite verses saved yet'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {isAr
                  ? 'أثناء تصفحك للسور والآيات، اضغط على رمز القلب ❤️ بجوار أي آية لحفظها هنا والرجوع إليها في أي وقت دون اتصال بالإنترنت.'
                  : 'Click the heart icon ❤️ beside any verse while reading to save it here for offline reflection.'}
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('surahs')}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                {isAr ? 'تصفح القرآن الكريم وحفظ الآيات' : 'Browse Quran & Bookmark Verses'}
              </button>
            </div>
          )}

        </div>
      )}

      {/* Quranpedia 12 Encyclopedic Services Modal */}
      <QuranpediaModal
        isOpen={quranpediaModal.isOpen}
        onClose={() => setQuranpediaModal(prev => ({ ...prev, isOpen: false }))}
        surahNumber={quranpediaModal.surahNumber}
        ayahNumber={quranpediaModal.ayahNumber}
        surahNameAr={quranpediaModal.surahNameAr}
        surahNameEn={quranpediaModal.surahNameEn}
        arabicText={quranpediaModal.arabicText}
        language={language}
      />

    </div>
  );
};
