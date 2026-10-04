import { Language } from '../types';

export interface LearnerRank {
  level: number;
  titleAr: string;
  titleEn: string;
  titleUr: string;
  minXp: number;
  maxXp: number;
  badgeColor: string;
  iconName: string;
}

export const LEARNER_RANKS: LearnerRank[] = [
  {
    level: 1,
    titleAr: 'مبتدئ في طلب العلم',
    titleEn: 'Seeker of Knowledge',
    titleUr: 'طالبِ علم مبتدی',
    minXp: 0,
    maxXp: 150,
    badgeColor: 'from-amber-600 to-amber-700',
    iconName: 'Compass'
  },
  {
    level: 2,
    titleAr: 'سالك درب الاستبصار',
    titleEn: 'Discerning Learner',
    titleUr: 'راہِ بصیرت کا راہی',
    minXp: 151,
    maxXp: 350,
    badgeColor: 'from-emerald-600 to-emerald-700',
    iconName: 'BookOpen'
  },
  {
    level: 3,
    titleAr: 'مجتهد في تحصيل البصيرة',
    titleEn: 'Diligent Scholar',
    titleUr: 'محنتی طالبِ بصیرت',
    minXp: 351,
    maxXp: 650,
    badgeColor: 'from-blue-600 to-indigo-700',
    iconName: 'Sparkles'
  },
  {
    level: 4,
    titleAr: 'متفقه راسخ الإيمان',
    titleEn: 'Rooted in Faith & Fiqh',
    titleUr: 'راسخ الایمان و فقیہ',
    minXp: 651,
    maxXp: 1000,
    badgeColor: 'from-purple-600 to-purple-800',
    iconName: 'ShieldCheck'
  },
  {
    level: 5,
    titleAr: 'سفير الهداية وداعية الحكمة',
    titleEn: 'Ambassador of Wisdom',
    titleUr: 'سفیرِ ہدایت و حکمت',
    minXp: 1001,
    maxXp: 99999,
    badgeColor: 'from-amber-500 via-yellow-500 to-amber-700',
    iconName: 'Award'
  }
];

const XP_STORAGE_KEY = 'eilm_user_xp_total';
const XP_LOG_KEY = 'eilm_xp_history_log';
const USER_NAME_KEY = 'eilm_student_name';
const USER_AGE_KEY = 'eilm_user_age';
const USER_AVATAR_KEY = 'eilm_user_avatar';

export interface XPLogEntry {
  id: string;
  amount: number;
  reasonAr: string;
  reasonEn: string;
  timestamp: number;
}

export function getStoredXP(): number {
  try {
    const val = localStorage.getItem(XP_STORAGE_KEY);
    if (val !== null) {
      return Math.max(0, parseInt(val, 10) || 0);
    }
    return 0;
  } catch {
    return 0;
  }
}

export function calculateBaseXPFromStages(completedStageIds: string[]): number {
  // Base 50 XP per completed stage
  const stageXP = completedStageIds.length * 50;
  const storedExtra = getStoredXP();
  return Math.max(stageXP, storedExtra);
}

export function awardXP(amount: number, reasonAr: string, reasonEn: string): number {
  try {
    const current = getStoredXP();
    const updated = current + amount;
    localStorage.setItem(XP_STORAGE_KEY, updated.toString());

    // Append log
    const log: XPLogEntry[] = getXPLogs();
    const newEntry: XPLogEntry = {
      id: `xp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      amount,
      reasonAr,
      reasonEn,
      timestamp: Date.now()
    };
    const updatedLog = [newEntry, ...log].slice(0, 50); // Keep last 50 entries
    localStorage.setItem(XP_LOG_KEY, JSON.stringify(updatedLog));

    // Dispatch custom event for immediate UI reaction across components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('eilm_xp_updated', { detail: { newXP: updated, added: amount, reasonAr } }));
    }

    return updated;
  } catch (e) {
    console.error('Error awarding XP:', e);
    return getStoredXP();
  }
}

export function getXPLogs(): XPLogEntry[] {
  try {
    const raw = localStorage.getItem(XP_LOG_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    return [];
  } catch {
    return [];
  }
}

export function getLearnerRank(xp: number): LearnerRank {
  const rank = LEARNER_RANKS.find((r) => xp >= r.minXp && xp <= r.maxXp);
  return rank || LEARNER_RANKS[0];
}

export function getNextRankProgress(xp: number): { nextRank: LearnerRank | null; progressPercent: number; xpNeeded: number } {
  const currentRank = getLearnerRank(xp);
  const nextRank = LEARNER_RANKS.find((r) => r.level === currentRank.level + 1) || null;

  if (!nextRank) {
    return { nextRank: null, progressPercent: 100, xpNeeded: 0 };
  }

  const range = currentRank.maxXp - currentRank.minXp;
  const currentInRank = xp - currentRank.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentInRank / range) * 100)));
  const xpNeeded = Math.max(0, currentRank.maxXp + 1 - xp);

  return { nextRank, progressPercent, xpNeeded };
}

export function getLearnerProfile(): { name: string; age: string; avatar: string } {
  try {
    const name = localStorage.getItem(USER_NAME_KEY) || localStorage.getItem('eilm_user_name') || 'طالب العلم';
    const age = localStorage.getItem(USER_AGE_KEY) || '25';
    const avatar = localStorage.getItem(USER_AVATAR_KEY) || '🌿';
    return { name, age, avatar };
  } catch {
    return { name: 'طالب العلم', age: '25', avatar: '🌿' };
  }
}

export function saveLearnerProfile(name: string, age: string, avatar: string) {
  try {
    localStorage.setItem(USER_NAME_KEY, name);
    localStorage.setItem('eilm_user_name', name);
    localStorage.setItem(USER_AGE_KEY, age);
    localStorage.setItem(USER_AVATAR_KEY, avatar);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('eilm_profile_updated', { detail: { name, age, avatar } }));
    }
  } catch (e) {
    console.error('Error saving profile:', e);
  }
}
