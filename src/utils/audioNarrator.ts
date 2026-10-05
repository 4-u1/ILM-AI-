export interface NarratorControls {
  speak: (text: string, onEnd?: () => void) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setRate: (rate: number) => void;
  getRate: () => number;
  isSpeaking: () => boolean;
  isPaused: () => boolean;
  hasArabicVoice: () => boolean;
}

class AudioNarratorManager implements NarratorControls {
  private synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private rate: number = 1.0;
  private paused: boolean = false;
  private speaking: boolean = false;

  public hasArabicVoice(): boolean {
    if (!this.synth) return false;
    const voices = this.synth.getVoices();
    return voices.some((v) => v.lang.startsWith('ar'));
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
    if (this.currentUtterance && this.speaking) {
      // Re-trigger speech with new speed if needed, but standard is to adjust rate for next utterances
      this.currentUtterance.rate = this.rate;
    }
  }

  public getRate(): number {
    return this.rate;
  }

  public isSpeaking(): boolean {
    return this.speaking && !this.paused;
  }

  public isPaused(): boolean {
    return this.paused;
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth) return;
    this.stop();

    // Clean text from emoji and markdown characters for clear pronunciation
    const cleanText = text
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '') // Emojis
      .replace(/[*_`#~]/g, '') // Markdown
      .trim();

    if (!cleanText) return;

    this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance.rate = this.rate;

    // Try to find an Arabic voice (ar-SA preferred)
    const voices = this.synth.getVoices();
    const arabicVoice = voices.find((v) => v.lang === 'ar-SA' || v.lang.startsWith('ar'));
    if (arabicVoice) {
      this.currentUtterance.voice = arabicVoice;
    } else {
      this.currentUtterance.lang = 'ar-SA';
    }

    this.currentUtterance.onstart = () => {
      this.speaking = true;
      this.paused = false;
    };

    this.currentUtterance.onend = () => {
      this.speaking = false;
      this.paused = false;
      if (onEnd) onEnd();
    };

    this.currentUtterance.onerror = () => {
      this.speaking = false;
      this.paused = false;
      if (onEnd) onEnd();
    };

    this.synth.speak(this.currentUtterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.paused = true;
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.paused = false;
      this.speaking = true;
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.speaking = false;
      this.paused = false;
    }
  }
}

export const audioNarrator = new AudioNarratorManager();
