import React, { useState, useEffect } from 'react';
import { 
  User, 
  X, 
  Zap, 
  Award, 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  Edit3, 
  Check, 
  Share2, 
  ArrowLeft, 
  ArrowRight,
  TrendingUp,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Language, TrackId } from '../types';
import { 
  getStoredXP, 
  getLearnerRank, 
  getNextRankProgress, 
  getXPLogs, 
  getLearnerProfile, 
  saveLearnerProfile, 
  XPLogEntry 
} from '../utils/xpManager';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  completedStagesCount: number;
  selectedTrack: TrackId | null;
  onNavigateToAchievements?: () => void;
  onNavigateToCertificate?: () => void;
}

const AVATARS = ['🌿', '📖', '🕌', '🌟', '🧭', '🕊️', '📜', '🛡️', '🌙', '🌴'];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  language,
  completedStagesCount,
  selectedTrack,
  onNavigateToAchievements,
  onNavigateToCertificate,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [profile, setProfile] = useState(getLearnerProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [ageInput, setAgeInput] = useState(profile.age);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [totalXP, setTotalXP] = useState(getStoredXP());
  const [xpLogs, setXpLogs] = useState<XPLogEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      const p = getLearnerProfile();
      setProfile(p);
      setNameInput(p.name);
      setAgeInput(p.age);
      setSelectedAvatar(p.avatar);
      setTotalXP(getStoredXP());
      setXpLogs(getXPLogs());
    }
  }, [isOpen]);

  // Listen to live XP updates
  useEffect(() => {
    const handleXPUpdate = (e: any) => {
      setTotalXP(e.detail?.newXP || getStoredXP());
      setXpLogs(getXPLogs());
    };
    window.addEventListener('eilm_xp_updated', handleXPUpdate);
    return () => window.removeEventListener('eilm_xp_updated', handleXPUpdate);
  }, []);

  if (!isOpen) return null;

  const currentRank = getLearnerRank(totalXP);
  const { nextRank, progressPercent, xpNeeded } = getNextRankProgress(totalXP);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    saveLearnerProfile(nameInput.trim(), ageInput || '25', selectedAvatar);
    setProfile({ name: nameInput.trim(), age: ageInput || '25', avatar: selectedAvatar });
    setIsEditing(false);
  };

  const getTrackName = (track: TrackId | null) => {
    switch (track) {
      case 'non_muslim': return isAr ? 'مسار غير المسلم' : 'Inquirer Track';
      case 'new_muslim': return isAr ? 'مسار المسلم الجديد' : 'New Muslim Track';
      case 'muslim': return isAr ? 'مسار المسلم الأصل' : 'Born Muslim Track';
      case 'daiyah': return isAr ? 'مسار تأهيل الدعاة' : 'Daiyah Track';
      default: return isAr ? 'المسارات الأربعة' : 'Four Tracks';
    }
  };

  const currentStreak = (() => {
    try {
      const s = localStorage.getItem('eilm_streak_count');
      return s ? parseInt(s, 10) : (completedStagesCount > 0 ? 1 : 0);
    } catch {
      return 1;
    }
  })();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="bg-white border-2 border-amber-400/90 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative my-auto text-slate-900">
        
        {/* Top Header Banner */}
        <div className="bg-[#FAF7F2] p-5 sm:p-6 border-b border-[#EAE3D6] flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-2xs">
              {profile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  {isAr ? 'ملف المتعلم الشخصي' : 'Learner Profile'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {getTrackName(selectedTrack)}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-950 font-serif mt-0.5">
                {profile.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition cursor-pointer border border-slate-200"
                title={isAr ? 'تعديل الملف الشخصي' : 'Edit Profile'}
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Edit Profile Form */}
          {isEditing ? (
            <form onSubmit={handleSave} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="text-xs font-bold text-amber-900 mb-1">
                {isAr ? 'تعديل البيانات الشخصية' : 'Edit Profile Information'}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {isAr ? 'اسم المتعلم:' : 'Learner Name:'}
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-amber-600 focus:outline-none"
                  placeholder={isAr ? 'اكتب اسمك أو كنيتك...' : 'Enter your name...'}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {isAr ? 'الفئة العمرية (السن التقريبي):' : 'Age:'}
                  </label>
                  <input
                    type="number"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-amber-600 focus:outline-none"
                    min="5"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {isAr ? 'الرمز التعبيري (الأفاتار):' : 'Avatar:'}
                  </label>
                  <div className="flex items-center gap-1 overflow-x-auto py-1">
                    {AVATARS.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`p-1.5 rounded-lg text-sm transition cursor-pointer ${
                          selectedAvatar === av ? 'bg-amber-600 text-white ring-2 ring-amber-300' : 'bg-white hover:bg-slate-100'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white rounded-xl transition cursor-pointer shadow-xs"
                >
                  {isAr ? 'حفظ التعديلات' : 'Save'}
                </button>
              </div>
            </form>
          ) : null}

          {/* XP & Rank Level Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white shadow-lg space-y-4 relative overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between relative">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{isAr ? `المستوى ${currentRank.level}` : `Level ${currentRank.level}`}</span>
                </span>
                <h4 className="text-base sm:text-lg font-bold font-serif text-white">
                  {isAr ? currentRank.titleAr : isUr ? currentRank.titleUr : currentRank.titleEn}
                </h4>
              </div>

              {/* Total XP Highlight Pill */}
              <div className="px-3.5 py-2 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center gap-2 shadow-inner">
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
                <div className="text-end">
                  <div className="text-lg sm:text-xl font-black font-mono leading-none">{totalXP}</div>
                  <div className="text-[9px] font-bold tracking-wider text-amber-200 uppercase">XP Total</div>
                </div>
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                <span>
                  {nextRank 
                    ? (isAr ? `التقدم نحو: ${nextRank.titleAr}` : `Next: ${nextRank.titleEn}`)
                    : (isAr ? 'أعلى مرتبة في المنصة 👑' : 'Maximum Rank Achieved 👑')}
                </span>
                <span className="font-mono text-amber-300 font-bold">
                  {nextRank ? `${xpNeeded} XP متبقي` : '100%'}
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div className="text-base font-black text-slate-900 font-mono">{completedStagesCount}</div>
              <div className="text-[10px] font-bold text-slate-500">{isAr ? 'محطات مكتملة' : 'Stages'}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <div className="text-base font-black text-slate-900 font-mono">{currentStreak}</div>
              <div className="text-[10px] font-bold text-slate-500">{isAr ? 'أيام تتابع' : 'Day Streak'}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mx-auto">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div className="text-base font-black text-slate-900 font-mono">
                {Math.min(12, Math.max(1, Math.floor(totalXP / 40)))}
              </div>
              <div className="text-[10px] font-bold text-slate-500">{isAr ? 'أوسمة مكتسبة' : 'Badges'}</div>
            </div>
          </div>

          {/* Recent XP Activity Log */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                <span>{isAr ? 'سجل اكتساب نقاط الخبرة (XP Activity):' : 'Recent XP History:'}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {isAr ? 'تحديث لحظي' : 'Real-time'}
              </span>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {xpLogs.length > 0 ? (
                xpLogs.slice(0, 5).map((log) => (
                  <div 
                    key={log.id} 
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate font-medium text-slate-800 text-[11px]">
                        {isAr || isUr ? log.reasonAr : log.reasonEn}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono font-bold text-[10px] shrink-0 border border-amber-200">
                      +{log.amount} XP
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-[11px]">
                  {isAr 
                    ? `أتمم دروس ومحطات مسارك لتسجيل نقاط الخبرة والارتقاء في المراتب 🌟` 
                    : `Complete lessons to earn XP and advance your rank! 🌟`}
                </div>
              )}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              {onNavigateToAchievements && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToAchievements();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isAr ? 'لوحة الأوسمة والتحليلات' : 'Achievements'}</span>
                </button>
              )}

              {onNavigateToCertificate && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToCertificate();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold border border-amber-200 transition cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isAr ? 'الشهادة الرقمية' : 'Certificate'}</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold transition cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
