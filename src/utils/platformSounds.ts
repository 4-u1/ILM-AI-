/**
 * 🕌 Platform-Specific High-Fidelity Spiritual Soundscape Synthesizer
 * Grounded in acoustic realism, custom major pentatonic scales, and simulated grand sanctuary acoustics.
 * Built using the Web Audio API with resilient browser autoplay fallback guards.
 */

// Helper to safely obtain or resume an AudioContext
let audioCtxInstance: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    
    if (!audioCtxInstance || audioCtxInstance.state === 'closed') {
      audioCtxInstance = new AudioContextClass();
    }
    
    if (audioCtxInstance && audioCtxInstance.state === 'suspended') {
      audioCtxInstance.resume();
    }
    return audioCtxInstance;
  } catch (e) {
    console.warn("Web Audio Context initialization guarded:", e);
    return null;
  }
}

// Track last entrance playback to prevent overlapping triggers
let lastEntrancePlayTime = 0;

/**
 * 1. 🕌 PLAY ENTRANCE SOUND (صوت الدخول الفخم الخاص بالمنصة)
 * A breathtaking, multi-layered spiritual audio sequence designed exclusively for ILM's brand.
 * Features:
 * - A deep, warm resonant spiritual drone mimicking physical acoustics of a grand dome (E2, A2, E3).
 * - A slow breathing LFO sweep filtering the drone to simulate organic acoustic reverence ("إجلال").
 * - A multi-tap delay line feedback system to synthesize a 2.5-second majestic spatial cathedral reverb.
 * - A celestial, rising 8-point pentatonic crystal chime sequence representing enlightenment.
 */
export const playEntranceSound = () => {
  const nowMs = Date.now();
  if (nowMs - lastEntrancePlayTime < 3800) {
    // Prevent overlapping entrance sound triggers
    return;
  }
  lastEntrancePlayTime = nowMs;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // --- REVERB / ECHO SIMULATOR (محاكي الصدى الصوتي الفخم للمقدسات والأبهاء) ---
    // Create multiple delay lines with feedback to emulate spacious acoustics without heavy assets
    const delay = ctx.createDelay(2.0);
    const feedback = ctx.createGain();
    const wetGain = ctx.createGain();
    const dryGain = ctx.createGain();

    delay.delayTime.setValueAtTime(0.38, now); // 380ms delay tap
    feedback.gain.setValueAtTime(0.42, now);  // 42% feedback trail
    wetGain.gain.setValueAtTime(0.18, now);    // Wet level
    dryGain.gain.setValueAtTime(0.85, now);    // Dry level

    // Connect feedback loop
    delay.connect(feedback);
    feedback.connect(delay);

    // Mix connections
    wetGain.connect(ctx.destination);
    dryGain.connect(ctx.destination);
    delay.connect(wetGain);

    // --- 1. THE DEEP SACRED DOME DRONE (الأنين والوقار الروحي العميق) ---
    // Deep notes representing majestic physical acoustics (E2, A2, E3)
    const droneNotes = [82.41, 110.00, 164.81];
    
    // Lowpass filter to ensure deep, velvety warmth
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(220, now);
    droneFilter.Q.setValueAtTime(1.5, now);
    droneFilter.connect(delay);
    droneFilter.connect(dryGain);

    // LFO (Low Frequency Oscillator) to modulate filter and create "breathing" organic motion
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.35, now); // 0.35 Hz (slow pulse)
    lfoGain.gain.setValueAtTime(45, now);    // Modulate cutoff by 45Hz
    lfo.connect(lfoGain);
    lfoGain.connect(droneFilter.frequency);
    lfo.start(now);
    lfo.stop(now + 3.2);

    droneNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Triangle waves have beautiful warm, wooden odd-harmonics resembling acoustic pipes
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      
      // Fine micro-detuning (cents) between oscillators to create a gorgeous, rich physical ensemble chorus effect
      osc.detune.setValueAtTime((idx - 1) * 8, now);

      gain.gain.setValueAtTime(0, now);
      // Majestic slow sweep in (800ms)
      gain.gain.linearRampToValueAtTime(idx === 1 ? 0.08 : 0.05, now + 0.8);
      // Smooth slow decay out
      gain.gain.setValueAtTime(idx === 1 ? 0.08 : 0.05, now + 1.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

      osc.connect(gain);
      gain.connect(droneFilter);

      osc.start(now);
      osc.stop(now + 3.1);
    });

    // --- 2. THE CELESTIAL PENTATONIC BELLS (زخات اللؤلؤ البلورية المشرقة) ---
    // Sparkling crystalline rising bell cascade (E4, A4, B4, E5, G#5, B5, E6, B6)
    const bellNotes = [329.63, 440.00, 493.88, 659.25, 830.61, 987.77, 1318.51, 1975.53];
    
    bellNotes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteDelay = index * 0.12; // Beautiful rising arpeggio separation (120ms intervals)

      // Crystalline pure sine wave
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + noteDelay);

      // Bell envelope: instant crystalline peak, then exponential decay representing fading light
      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0, now + noteDelay);
      gain.gain.linearRampToValueAtTime(0.06, now + noteDelay + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + noteDelay + 1.6);

      osc.connect(gain);
      // Route through reverb delay + dry out
      gain.connect(delay);
      gain.connect(dryGain);

      osc.start(now + noteDelay);
      osc.stop(now + noteDelay + 1.7);
    });

  } catch (e) {
    console.warn("Failed to execute high-fidelity entrance sound synthesizer:", e);
  }
};

/**
 * 2. 🔊 GOLD-ACCENTED INTERFACE TAP (صوت النقر الفخم اللطيف)
 * A crisp, satisfying, premium acoustic button click with an immediate, non-intrusive response.
 * Layered to sound wooden and organic, representing physical interactions.
 */
export const playTapSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const noise = ctx.createOscillator();
    const noiseGain = ctx.createGain();

    // Fundamental high quality woodblock frequency (C5 - 523.25Hz)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15); // Fast crisp decay

    // High frequency texture (1200Hz) to simulate crisp contact with a luxury screen
    noise.type = 'triangle';
    noise.frequency.setValueAtTime(1180, now);
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.015, now + 0.005);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    noise.connect(noiseGain);
    
    gain.connect(ctx.destination);
    noiseGain.connect(ctx.destination);

    osc.start(now);
    noise.start(now);
    
    osc.stop(now + 0.18);
    noise.stop(now + 0.05);
  } catch (e) {
    console.warn("Guarded tap sound execution failed:", e);
  }
};

/**
 * 3. ✨ TRIUMPHANT PROGRESS SUCCESS CHIME (صوت الإنجاز والدرجات المبهج)
 * A beautiful, uplifting pentatonic major chord rise with rich harmonics.
 * Used for completions, quiz success, and awarding milestones/badges.
 */
export const playSuccessSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // Spacious delay line for congratulations
    const delay = ctx.createDelay(1.0);
    const feedback = ctx.createGain();
    const mix = ctx.createGain();

    delay.delayTime.setValueAtTime(0.24, now);
    feedback.gain.setValueAtTime(0.35, now);
    mix.gain.setValueAtTime(0.15, now);

    delay.connect(feedback);
    feedback.connect(delay);
    mix.connect(ctx.destination);
    delay.connect(mix);

    // Warm, joyful pentatonic chord rise (E4, A4, B4, E5, G#5, E6)
    const notes = [329.63, 440.00, 493.88, 659.25, 830.61, 1318.51];
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delayOffset = idx * 0.08; // Energetic, fast arpeggio (80ms intervals)

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + delayOffset);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0, now + delayOffset);
      gain.gain.linearRampToValueAtTime(0.05, now + delayOffset + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delayOffset + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.connect(delay);

      osc.start(now + delayOffset);
      osc.stop(now + delayOffset + 1.3);
    });

  } catch (e) {
    console.warn("Guarded success sound execution failed:", e);
  }
};

/**
 * 4. 🔔 PEACEFUL NOTIFICATION CHIME (صوت التنبيه العذب الهادئ)
 * A soft, comforting, dual-tone bell chime to prompt the user or announce study reminders.
 */
export const playNotificationSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [440.00, 554.37]; // Cozy, peaceful major third interval (A4 - C#5)

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delayOffset = idx * 0.18; // Spaced out dual tone (180ms)

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delayOffset);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0, now + delayOffset);
      gain.gain.linearRampToValueAtTime(0.06, now + delayOffset + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delayOffset + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delayOffset);
      osc.stop(now + delayOffset + 0.9);
    });
  } catch (e) {
    console.warn("Guarded notification sound execution failed:", e);
  }
};
