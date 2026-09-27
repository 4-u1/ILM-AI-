import React, { useState } from 'react';
import { Language } from '../types';
import { HeartHandshake, Volume2, Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface ShahadaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransitionToNewMuslim: () => void;
  language: Language;
}

export const ShahadaModal: React.FC<ShahadaModalProps> = ({
  isOpen,
  onClose,
  onTransitionToNewMuslim,
  language,
}) => {
  if (!isOpen) return null;

  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasRecited, setHasRecited] = useState(false);

  const playPronunciation = () => {
    setIsPlayingAudio(true);
    // Use Web Speech API if supported for speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('أشهد أن لا إله إلا الله، وأشهد أن محمداً رسول الله');
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-9 max-w-xl w-full border border-slate-200 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {isAr ? 'الشهادتان: بوابة الدخول في الإسلام' : 'The Shahadah: Portal to Islam'}
              </h2>
              <p className="text-xs text-slate-500">
                {isAr ? 'أعظم عهد يقطعه الإنسان مع ربه وخالقه' : 'The sacred covenant with your Creator'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Introduction */}
        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
          {isAr ? (
            <p>
              مرحباً بك من أعماق القلب.. الدخول في الإسلام لا يحتاج إلى وساطة بشرية أو معاملات رسمية؛ بل هو صدق بينك وبين الله تبارك وتعالى. بمجرد نطقك للشهادتين عن إيمان ويقين، تبدأ صفحة جديدة نقية يغفر الله فيها كل ما سلف.
            </p>
          ) : (
            <p>
              Welcome with an open heart. Embracing Islam requires no formal paperwork, priests, or ceremonies. It is a direct covenant between your soul and God. By reciting the Shahadah with sincerity, you begin a pure, fresh chapter where God forgives all previous shortcomings.
            </p>
          )}
        </div>

        {/* The Sacred Words Card */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-6 text-center space-y-4">
          <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            {isAr ? 'اللفظ العربي بالتشكيل التام' : 'Arabic Declaration'}
          </div>

          <p className="font-quran text-2xl sm:text-3xl text-emerald-950 leading-loose py-1">
            «أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ»
          </p>

          <div className="text-xs sm:text-sm font-mono text-slate-600 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
            "Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan rasulullah"
          </div>

          <div className="text-xs sm:text-sm text-slate-700 italic">
            "I bear witness that there is no deity worthy of worship except Allah, and I bear witness that Muhammad is the Messenger of Allah."
          </div>

          {/* Audio Button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={playPronunciation}
              disabled={isPlayingAudio}
              className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer flex items-center gap-2 shadow-2xs"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-emerald-600' : ''}`} />
              <span>{isPlayingAudio ? (isAr ? 'جاري الاستماع للنطق...' : 'Playing pronunciation...') : (isAr ? 'استمع إلى النطق الصحيح' : 'Listen to Pronunciation')}</span>
            </button>
          </div>
        </div>

        {/* Affirmation Checkbox */}
        <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
          <input
            type="checkbox"
            checked={hasRecited}
            onChange={(e) => setHasRecited(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
          />
          <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {isAr
              ? 'لقد نطقت الشهادتين بلساني موقناً بمعناهما بقلبي، وأرغب في الانتقال إلى مسار تأسيس المسلم الجديد.'
              : 'I have declared the Shahadah with sincerity in my heart, and wish to start the New Muslim Foundation Path.'}
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
          >
            {isAr ? 'إغلاق ومتابعة القراءة' : 'Close'}
          </button>

          <button
            onClick={() => {
              onClose();
              onTransitionToNewMuslim();
            }}
            disabled={!hasRecited}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 disabled:opacity-40 cursor-pointer shadow-xs"
          >
            <span>{isAr ? 'الانتقال لمسار المسلم الجديد' : 'Begin New Muslim Path'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
