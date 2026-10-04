import React, { useState } from 'react';
import { 
  Sliders, 
  X, 
  Check, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Layers, 
  RotateCcw, 
  ShieldCheck, 
  Code, 
  ChevronDown, 
  ChevronUp,
  Scale,
  Zap,
  Library,
  MessageSquare
} from 'lucide-react';
import { 
  DialoguePreferences, 
  ResponseLengthPreference, 
  SourceTypePreference, 
  DialogueTonePreference 
} from '../types';
import { 
  DEFAULT_DIALOGUE_PREFERENCES, 
  saveDialoguePreferences, 
  generateSystemInstructionFromPreferences 
} from '../utils/dialoguePreferences';

interface DialoguePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPreferences: DialoguePreferences;
  onSavePreferences: (newPrefs: DialoguePreferences) => void;
  learnerName?: string;
  learnerAge?: string;
  trackTitle?: string;
}

export const DialoguePreferencesModal: React.FC<DialoguePreferencesModalProps> = ({
  isOpen,
  onClose,
  currentPreferences,
  onSavePreferences,
  learnerName = 'المتعلم',
  learnerAge = '',
  trackTitle = 'التعليم الإسلامي'
}) => {
  const [prefs, setPrefs] = useState<DialoguePreferences>(currentPreferences);
  const [showSystemInstructionPreview, setShowSystemInstructionPreview] = useState<boolean>(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveDialoguePreferences(prefs);
    onSavePreferences(prefs);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleResetDefaults = () => {
    setPrefs(DEFAULT_DIALOGUE_PREFERENCES);
  };

  const liveSystemInstruction = generateSystemInstructionFromPreferences(
    prefs,
    learnerName,
    learnerAge,
    trackTitle
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#EAE3D6] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-900 to-amber-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-800/80 border border-amber-600/50 flex items-center justify-center text-amber-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>تفضيلات الحوار الذكي</span>
                <span className="text-[10px] bg-amber-500/30 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded-full font-mono">
                  Gemini System Instructions
                </span>
              </h2>
              <p className="text-xs text-amber-200/80 mt-0.5">
                تخصيص طول الإجابات ومصادر الاستدلال لتمريرها كموجّهات نظام مباشرة للذكاء الاصطناعي
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* SECTION 1: Response Length */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-700" />
              <span>طول وعمق الإجابة (Response Length)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Concise */}
              <button
                type="button"
                onClick={() => setPrefs({ ...prefs, responseLength: 'concise' })}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer relative flex flex-col justify-between ${
                  prefs.responseLength === 'concise'
                    ? 'bg-amber-50/90 border-amber-600 ring-2 ring-amber-600/20 shadow-xs'
                    : 'bg-white border-[#EAE3D6] hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">كبسولة موجزة</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold">
                      30 - 50 كلمة
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    إجابات سريعة ومباشرة مركزة على الفكرة الواحدة دون إسهاب، لتسهيل الحفظ والتطبيق.
                  </p>
                </div>
                {prefs.responseLength === 'concise' && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-700 font-bold">
                    <Check className="w-3 h-3" />
                    <span>المفضل الحالي</span>
                  </div>
                )}
              </button>

              {/* Option 2: Balanced */}
              <button
                type="button"
                onClick={() => setPrefs({ ...prefs, responseLength: 'balanced' })}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer relative flex flex-col justify-between ${
                  prefs.responseLength === 'balanced'
                    ? 'bg-amber-50/90 border-amber-600 ring-2 ring-amber-600/20 shadow-xs'
                    : 'bg-white border-[#EAE3D6] hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">شرح متوازن</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-900 font-bold">
                      60 - 100 كلمة
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    بيان معتدل يربط بين المقصد الشرعي والدليل الأساسي بأسلوب واضح ومستوفٍ للمعنى.
                  </p>
                </div>
                {prefs.responseLength === 'balanced' && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-700 font-bold">
                    <Check className="w-3 h-3" />
                    <span>المفضل الحالي</span>
                  </div>
                )}
              </button>

              {/* Option 3: Detailed */}
              <button
                type="button"
                onClick={() => setPrefs({ ...prefs, responseLength: 'detailed' })}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer relative flex flex-col justify-between ${
                  prefs.responseLength === 'detailed'
                    ? 'bg-amber-50/90 border-amber-600 ring-2 ring-amber-600/20 shadow-xs'
                    : 'bg-white border-[#EAE3D6] hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">تفصيل علمي</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold">
                      120 - 200 كلمة
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    تأصيل موسع مع ذكر وجوه الاستدلال وفروع المسألة وأقوال الأئمة، مناسب لطلبة العلم.
                  </p>
                </div>
                {prefs.responseLength === 'detailed' && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-700 font-bold">
                    <Check className="w-3 h-3" />
                    <span>المفضل الحالي</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* SECTION 2: Preferred Scientific Sources */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Library className="w-3.5 h-3.5 text-amber-700" />
              <span>نوع المصادر العلمية المفضلة (Scientific Sources Grounding)</span>
            </label>

            <div className="space-y-2">
              {/* All Sources */}
              <div
                onClick={() => setPrefs({ ...prefs, sourceType: 'all' })}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  prefs.sourceType === 'all'
                    ? 'bg-amber-50 border-amber-600 shadow-2xs'
                    : 'bg-white border-[#EAE3D6] hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    🌟
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      الحزمة العلمية الشاملة (الافتراضي المعتمد)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      الجمع المتكامل بين مجمع الملك فهد، وموسوعة الحديث بالدرر السنية، وأبحاث المستودع الدعوي
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  prefs.sourceType === 'all' ? 'border-amber-700 bg-amber-700 text-white' : 'border-slate-300'
                }`}>
                  {prefs.sourceType === 'all' && <Check className="w-3 h-3" />}
                </div>
              </div>

              {/* Quran & Tafsir */}
              <div
                onClick={() => setPrefs({ ...prefs, sourceType: 'quran_tafsir' })}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  prefs.sourceType === 'quran_tafsir'
                    ? 'bg-amber-50 border-amber-600 shadow-2xs'
                    : 'bg-white border-[#EAE3D6] hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    📖
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      مجمع الملك فهد لطباعة المصحف الشريف والتفاسير
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      التركيز على نصوص الآيات وتفاسير ابن كثير، الطبري، السعدي، والبغوي
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  prefs.sourceType === 'quran_tafsir' ? 'border-amber-700 bg-amber-700 text-white' : 'border-slate-300'
                }`}>
                  {prefs.sourceType === 'quran_tafsir' && <Check className="w-3 h-3" />}
                </div>
              </div>

              {/* Hadith & Sunnah */}
              <div
                onClick={() => setPrefs({ ...prefs, sourceType: 'hadith_sunnah' })}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  prefs.sourceType === 'hadith_sunnah'
                    ? 'bg-amber-50 border-amber-600 shadow-2xs'
                    : 'bg-white border-[#EAE3D6] hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    📜
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      موسوعة الحديث النبوي وشروحه (الدرر السنية)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      صحيح البخاري، صحيح مسلم، السنن الأربعة مع بيان درجة صحة الروايات وتخريجها
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  prefs.sourceType === 'hadith_sunnah' ? 'border-amber-700 bg-amber-700 text-white' : 'border-slate-300'
                }`}>
                  {prefs.sourceType === 'hadith_sunnah' && <Check className="w-3 h-3" />}
                </div>
              </div>

              {/* Fiqh & Madhahib */}
              <div
                onClick={() => setPrefs({ ...prefs, sourceType: 'fiqh_madhahib' })}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  prefs.sourceType === 'fiqh_madhahib'
                    ? 'bg-amber-50 border-amber-600 shadow-2xs'
                    : 'bg-white border-[#EAE3D6] hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                    🏛️
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      الفقه الميسر وأقوال المذاهب الأربعة المعتمدة
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      استعراض الأحكام الفقهية وتطبيقات العبادات والمعاملات وسماحة الشريعة
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  prefs.sourceType === 'fiqh_madhahib' ? 'border-amber-700 bg-amber-700 text-white' : 'border-slate-300'
                }`}>
                  {prefs.sourceType === 'fiqh_madhahib' && <Check className="w-3 h-3" />}
                </div>
              </div>

              {/* Dawah & Civilization Dialogue */}
              <div
                onClick={() => setPrefs({ ...prefs, sourceType: 'dawah_dialogue' })}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  prefs.sourceType === 'dawah_dialogue'
                    ? 'bg-amber-50 border-amber-600 shadow-2xs'
                    : 'bg-white border-[#EAE3D6] hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                    🌐
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      المستودع الدعوي الرقمي والحوار الحضاري
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      أبحاث مقارنة الأديان، تفكيك الشبهات المعاصرة، وبراهين صدق الإسلام العقلية
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  prefs.sourceType === 'dawah_dialogue' ? 'border-amber-700 bg-amber-700 text-white' : 'border-slate-300'
                }`}>
                  {prefs.sourceType === 'dawah_dialogue' && <Check className="w-3 h-3" />}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Dialogue Tone & Style */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
              <span>أسلوب الخطاب والنبرة التربوية (Pedagogical Tone)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPrefs({ ...prefs, dialogueTone: 'interactive' })}
                className={`p-3 rounded-xl border text-right transition cursor-pointer ${
                  prefs.dialogueTone === 'interactive'
                    ? 'bg-amber-50 border-amber-600 font-bold text-amber-950'
                    : 'bg-white border-[#EAE3D6] text-slate-700 hover:border-amber-300'
                }`}
              >
                <div className="text-xs font-bold mb-1">🤝 حواري سقراطي</div>
                <p className="text-[10px] text-slate-500 font-normal">خطوة بخطوة مع أسئلة تنشيطية للتأكد من الرسوخ.</p>
              </button>

              <button
                type="button"
                onClick={() => setPrefs({ ...prefs, dialogueTone: 'direct' })}
                className={`p-3 rounded-xl border text-right transition cursor-pointer ${
                  prefs.dialogueTone === 'direct'
                    ? 'bg-amber-50 border-amber-600 font-bold text-amber-950'
                    : 'bg-white border-[#EAE3D6] text-slate-700 hover:border-amber-300'
                }`}
              >
                <div className="text-xs font-bold mb-1">🎯 استدلالي مباشر</div>
                <p className="text-[10px] text-slate-500 font-normal">إعطاء الحكم والبرهان فوراً وبإيجاز دون أسئلة.</p>
              </button>

              <button
                type="button"
                onClick={() => setPrefs({ ...prefs, dialogueTone: 'simplified' })}
                className={`p-3 rounded-xl border text-right transition cursor-pointer ${
                  prefs.dialogueTone === 'simplified'
                    ? 'bg-amber-50 border-amber-600 font-bold text-amber-950'
                    : 'bg-white border-[#EAE3D6] text-slate-700 hover:border-amber-300'
                }`}
              >
                <div className="text-xs font-bold mb-1">💡 أمثلة معاصرة</div>
                <p className="text-[10px] text-slate-500 font-normal">تبسيط بأمثلة ملموسة من واقع الحياة اليومية.</p>
              </button>
            </div>
          </div>

          {/* SECTION 4: Additional Switches */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#EAE3D6] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">التشكيل والرسم العثماني للآيات القرآنية</span>
                <p className="text-[10px] text-slate-500">التزام ضبط التشكيل الكامل للآيات المنقولة برسم مصحف مجمع الملك فهد</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.includeQuranicDiacritics}
                onChange={(e) => setPrefs({ ...prefs, includeQuranicDiacritics: e.target.checked })}
                className="w-4 h-4 accent-amber-700 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800">إظهار بطاقة توثيق المصدر مع كل رد</span>
                <p className="text-[10px] text-slate-500">إبراز اسم السورة أو رقم الحديث ورابط المصدر المعتمد مع كل إجابة</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.showSourceCitations}
                onChange={(e) => setPrefs({ ...prefs, showSourceCitations: e.target.checked })}
                className="w-4 h-4 accent-amber-700 cursor-pointer"
              />
            </div>
          </div>

          {/* SECTION 5: Live System Instruction Preview */}
          <div className="border border-[#EAE3D6] rounded-2xl bg-slate-900 text-slate-100 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSystemInstructionPreview(!showSystemInstructionPreview)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-mono text-amber-400 bg-slate-950/80 hover:bg-slate-950 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5" />
                <span>معاينة موجهات النظام الممررة لـ Gemini (System Instruction Preview)</span>
              </div>
              {showSystemInstructionPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSystemInstructionPreview && (
              <div className="p-4 text-[11px] font-mono whitespace-pre-wrap text-emerald-300/90 leading-relaxed max-h-48 overflow-y-auto bg-slate-900/90 border-t border-slate-800">
                {liveSystemInstruction}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F5EFEB] border-t border-[#EAE3D6] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الافتراضي</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleSave}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isSavedSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-amber-700 hover:bg-amber-800'
              }`}
            >
              {isSavedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تم التطبيق بنجاح!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>حفظ وتطبيق التفضيلات</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
