// Quran Reciter Support for King Fahd Complex & Verified Authentic Reciters
// Reciters:
// 1. Sheikh Ali Al-Hudhaify (إمام وخطيب المسجد النبوي الشريف ومقرئ مجمع الملك فهد)
// 2. Sheikh Mahmoud Khalil Al-Husary (المصحف المرتل المعلم المشهور)

export type QuranReciterId = 'hudhaify' | 'husary';

export interface QuranReciter {
  id: QuranReciterId;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  cdnSubfolder: string; // EveryAyah CDN folder
  bitrate: string;
}

export const QURAN_RECITERS: Record<QuranReciterId, QuranReciter> = {
  hudhaify: {
    id: 'hudhaify',
    nameAr: 'الشيخ علي بن عبد الرحمن الحذيفي',
    nameEn: 'Sheikh Ali Al-Hudhaify',
    titleAr: 'إمام المسجد النبوي الشريف ومقرئ مجمع الملك فهد',
    titleEn: 'Imam of Prophet\'s Mosque & King Fahd Complex Reciter',
    cdnSubfolder: 'Hudhaify_128kbps',
    bitrate: '128kbps',
  },
  husary: {
    id: 'husary',
    nameAr: 'الشيخ محمود خليل الحصري',
    nameEn: 'Sheikh Mahmoud Khalil Al-Husary',
    titleAr: 'شيخ عموم المقارئ المصرية (المصحف المرتل المتقن)',
    titleEn: 'Master of Tajweed & Classical Recitation',
    cdnSubfolder: 'Husary_128kbps',
    bitrate: '128kbps',
  },
};

interface SurahAyahMap {
  surah: number;
  ayah: number;
}

// Maps common Quranic references in curriculum to exact Surah and Ayah numbers for CDN audio streaming
const QURANIC_REF_MAP: Record<string, SurahAyahMap> = {
  // Surah Al-Fatihah 1:1
  '1:1': { surah: 1, ayah: 1 },
  'الفاتحة: 1': { surah: 1, ayah: 1 },
  'الفاتحة': { surah: 1, ayah: 1 },

  // Surah Al-Baqarah 2:255 (Ayat Al-Kursi)
  '2:255': { surah: 2, ayah: 255 },
  'البقرة: 255': { surah: 2, ayah: 255 },
  'البقرة: الآية 255': { surah: 2, ayah: 255 },

  // Surah Al-Baqarah 2:285
  '2:285': { surah: 2, ayah: 285 },
  'البقرة: 285': { surah: 2, ayah: 285 },

  // Surah Ali 'Imran 3:19
  '3:19': { surah: 3, ayah: 19 },
  'آل عمران: 19': { surah: 3, ayah: 19 },
  'آل عمران: الآية 19': { surah: 3, ayah: 19 },

  // Surah Al-Maidah 5:6
  '5:6': { surah: 5, ayah: 6 },
  'المائدة: 6': { surah: 5, ayah: 6 },
  'المائدة: الآية 6': { surah: 5, ayah: 6 },

  // Surah An-Nahl 16:125
  '16:125': { surah: 16, ayah: 125 },
  'النحل: 125': { surah: 16, ayah: 125 },

  // Surah Al-Isra 17:80
  '17:80': { surah: 17, ayah: 80 },
  'الإسراء: 80': { surah: 17, ayah: 80 },
  'الإسراء: الآية 80': { surah: 17, ayah: 80 },

  // Surah Al-Anbiya 21:107
  '21:107': { surah: 21, ayah: 107 },
  'الأنبياء: 107': { surah: 21, ayah: 107 },

  // Surah Az-Zumar 39:9
  '39:9': { surah: 39, ayah: 9 },
  'الزمر: 9': { surah: 39, ayah: 9 },

  // Surah Muhammad 47:19
  '47:19': { surah: 47, ayah: 19 },
  'محمد: 19': { surah: 47, ayah: 19 },
  'محمد: الآية 19': { surah: 47, ayah: 19 },

  // Surah Al-Hujurat 49:13
  '49:13': { surah: 49, ayah: 13 },
  'الحجرات: 13': { surah: 49, ayah: 13 },

  // Surah Al-Ikhlas 112:1
  '112:1': { surah: 112, ayah: 1 },
  '112:1-4': { surah: 112, ayah: 1 },
  'الإخلاص: 1-4': { surah: 112, ayah: 1 },
  'الإخلاص: الآيات 1-4': { surah: 112, ayah: 1 },
  'الإخلاص': { surah: 112, ayah: 1 },

  // Surah Al-Falaq 113:1
  '113:1': { surah: 113, ayah: 1 },
  'الفلق': { surah: 113, ayah: 1 },

  // Surah An-Nas 114:1
  '114:1': { surah: 114, ayah: 1 },
  'الناس': { surah: 114, ayah: 1 },
};

/**
 * Extracts surah and ayah number from standard Arabic/English reference strings
 */
export function parseQuranicReference(refString: string): SurahAyahMap | null {
  if (!refString) return null;

  // Direct lookup
  for (const [key, value] of Object.entries(QURANIC_REF_MAP)) {
    if (refString.includes(key)) {
      return value;
    }
  }

  // Regex patterns: e.g. "112:1", "47:19", "2:255"
  const colonMatch = refString.match(/(\d{1,3})\s*:\s*(\d{1,3})/);
  if (colonMatch) {
    const s = parseInt(colonMatch[1], 10);
    const a = parseInt(colonMatch[2], 10);
    if (s >= 1 && s <= 114 && a >= 1 && a <= 286) {
      return { surah: s, ayah: a };
    }
  }

  // Arabic pattern fallbacks
  if (refString.includes('الإخلاص')) return { surah: 112, ayah: 1 };
  if (refString.includes('محمد')) return { surah: 47, ayah: 19 };
  if (refString.includes('المائدة')) return { surah: 5, ayah: 6 };
  if (refString.includes('البقرة')) return { surah: 2, ayah: 255 };
  if (refString.includes('الأنبياء')) return { surah: 21, ayah: 107 };
  if (refString.includes('الحجرات')) return { surah: 49, ayah: 13 };
  if (refString.includes('النحل')) return { surah: 16, ayah: 125 };
  if (refString.includes('الزمر')) return { surah: 39, ayah: 9 };
  if (refString.includes('الفاتحة')) return { surah: 1, ayah: 1 };
  if (refString.includes('الإسراء')) return { surah: 17, ayah: 80 };

  return null;
}

/**
 * Gets currently selected reciter from localStorage or defaults to 'hudhaify'
 */
export function getSavedReciter(): QuranReciterId {
  try {
    const saved = localStorage.getItem('ilm_quran_reciter');
    if (saved === 'husary' || saved === 'hudhaify') {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'hudhaify';
}

/**
 * Saves reciter selection
 */
export function saveReciter(id: QuranReciterId): void {
  try {
    localStorage.setItem('ilm_quran_reciter', id);
  } catch {
    // ignore
  }
}

/**
 * Builds verified high-fidelity Quranic audio URL from EveryAyah CDN
 * Sheikh Ali Al-Hudhaify (Hudhaify_128kbps) or Sheikh Mahmoud Khalil Al-Husary (Husary_128kbps)
 */
export function getQuranAudioUrl(surah: number, ayah: number, reciterId: QuranReciterId = 'hudhaify'): string {
  const sStr = String(surah).padStart(3, '0');
  const aStr = String(ayah).padStart(3, '0');
  const reciter = QURAN_RECITERS[reciterId] || QURAN_RECITERS.hudhaify;
  return `https://everyayah.com/data/${reciter.cdnSubfolder}/${sStr}${aStr}.mp3`;
}

// Global audio element reference to prevent multiple sounds playing simultaneously
let activeAudio: HTMLAudioElement | null = null;

/**
 * Stops any playing Quran audio or Web Speech synthesis
 */
export function stopQuranAudio(): void {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Plays the Quranic verse with audio priority:
 * 1. High-fidelity audio stream from King Fahd Complex reciter Sheikh Ali Al-Hudhaify or Sheikh Al-Husary
 * 2. High-accuracy Arabic Web Speech API (speechSynthesis) as a reliable local fallback
 */
export function playQuranVerse(
  arabicText: string,
  referenceString: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
  },
  reciterId?: QuranReciterId
): { cancel: () => void } {
  // Stop existing playback
  stopQuranAudio();

  callbacks?.onStart?.();

  const selectedReciter = reciterId || getSavedReciter();
  const parsed = parseQuranicReference(referenceString);

  if (parsed) {
    const audioUrl = getQuranAudioUrl(parsed.surah, parsed.ayah, selectedReciter);
    const audio = new Audio(audioUrl);
    activeAudio = audio;

    audio.onended = () => {
      activeAudio = null;
      callbacks?.onEnd?.();
    };

    audio.onerror = () => {
      // Fallback to Web Speech API if network or audio CDN is blocked
      activeAudio = null;
      playViaWebSpeech(arabicText, callbacks);
    };

    audio.play().catch(() => {
      // Browser autoplay policy or error fallback
      playViaWebSpeech(arabicText, callbacks);
    });

    return {
      cancel: () => {
        audio.pause();
        audio.currentTime = 0;
        activeAudio = null;
        callbacks?.onEnd?.();
      }
    };
  }

  // Fallback directly to Web Speech API
  return playViaWebSpeech(arabicText, callbacks);
}

/**
 * High-accuracy Arabic Web Speech API fallback tuned for Quranic pronunciation
 */
function playViaWebSpeech(
  arabicText: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
  }
): { cancel: () => void } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    callbacks?.onEnd?.();
    return { cancel: () => {} };
  }

  try {
    window.speechSynthesis.cancel();

    // Clean special Quranic symbols (۝, brackets, numbers) for clean speech pronunciation
    const cleanSpeechText = arabicText
      .replace(/[۝«»\[\]\(\)]/g, ' ')
      .replace(/\d+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.lang = 'ar-SA';
    // Deliberate slower cadence for Tajweed clarity
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    // Pick Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar') || v.name.includes('Arabic') || v.name.includes('Tarik') || v.name.includes('Maged'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => {
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      callbacks?.onError?.(e);
      callbacks?.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);

    return {
      cancel: () => {
        window.speechSynthesis.cancel();
        callbacks?.onEnd?.();
      }
    };
  } catch (err) {
    callbacks?.onError?.(err);
    callbacks?.onEnd?.();
    return { cancel: () => {} };
  }
}
