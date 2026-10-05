import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Volume2, AlertCircle } from 'lucide-react';
import { audioNarrator } from '../utils/audioNarrator';
import { Language } from '../types';

interface AudioNarratorPlayerProps {
  textToRead: string;
  language: Language;
}

export const AudioNarratorPlayer: React.FC<AudioNarratorPlayerProps> = ({
  textToRead,
  language,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [hasVoiceWarn, setHasVoiceWarn] = useState(false);

  useEffect(() => {
    // Check if browser has speech synthesis and voices
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const checkVoice = () => {
        const hasAr = audioNarrator.hasArabicVoice();
        if (!hasAr && (isAr || isUr)) {
          setHasVoiceWarn(true);
        } else {
          setHasVoiceWarn(false);
        }
      };

      checkVoice();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = checkVoice;
      }
    }
  }, [language, isAr, isUr]);

  // Handle auto-stop on text change
  useEffect(() => {
    return () => {
      audioNarrator.stop();
    };
  }, [textToRead]);

  const handlePlay = () => {
    if (isPaused) {
      audioNarrator.resume();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      audioNarrator.setRate(rate);
      audioNarrator.speak(textToRead, () => {
        setIsPlaying(false);
        setIsPaused(false);
      });
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    audioNarrator.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    audioNarrator.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    audioNarrator.setRate(newRate);
  };

  return (
    <div 
      className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 max-w-full text-slate-800"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-amber-700 animate-pulse" />
          <span className="text-xs font-bold text-slate-900">
            {isAr ? 'القارئ الصوتي الذكي' : 'Audio Narrator'}
          </span>
        </div>

        {/* Speed rate selection */}
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
          {([0.75, 1.0, 1.25, 1.5] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRateChange(r)}
              className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                rate === r ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
              aria-label={isAr ? `سرعة القراءة ${r} ضعف` : `Reading speed ${r}x`}
            >
              {r}x
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isPlaying ? (
          <button
            type="button"
            onClick={handlePause}
            className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition flex items-center justify-center cursor-pointer"
            aria-label={isAr ? 'إيقاف مؤقت للقراءة الصوتية' : 'Pause audio narration'}
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            className="p-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl shadow-xs transition flex items-center justify-center cursor-pointer"
            aria-label={isAr ? 'بدء القراءة الصوتية' : 'Play audio narration'}
          >
            <Play className="w-3.5 h-3.5" />
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            type="button"
            onClick={handleStop}
            className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition flex items-center justify-center cursor-pointer"
            aria-label={isAr ? 'إيقاف القراءة بالكامل' : 'Stop audio narration'}
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        )}

        <span className="text-[10px] text-slate-500 font-medium">
          {isPlaying 
            ? (isAr ? 'جاري القراءة بصوت مجمع الملك فهد الافتراضي...' : 'Now reading aloud...') 
            : isPaused 
            ? (isAr ? 'متوقف مؤقتاً' : 'Paused') 
            : (isAr ? 'انقر لتشغيل نطق المعلم التفاعلي' : 'Click to listen to AI explanation')
          }
        </span>
      </div>

      {/* Graceful Voice Engine warning */}
      {hasVoiceWarn && (
        <div className="p-1.5 rounded-lg bg-amber-100/50 border border-amber-200/50 flex items-center gap-1.5 text-[10px] text-amber-900 leading-normal">
          <AlertCircle className="w-3 h-3 text-amber-700 shrink-0" />
          <span>
            {isAr 
              ? 'تنبيه: لم يتم العثور على محرك نطق عربي أصيل بجهازك؛ سيقوم النظام بالنطق الآلي الافتراضي.'
              : 'Note: Arabic speech synthesis engine not found; system default voice will be used.'}
          </span>
        </div>
      )}
    </div>
  );
};
