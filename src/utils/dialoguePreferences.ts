import { DialoguePreferences } from '../types';

export const DEFAULT_DIALOGUE_PREFERENCES: DialoguePreferences = {
  responseLength: 'concise',
  sourceType: 'all',
  dialogueTone: 'interactive',
  includeQuranicDiacritics: true,
  showSourceCitations: true,
  autoLanguageMatch: true,
};

const STORAGE_KEY = 'eilm_dialogue_preferences';

export function loadDialoguePreferences(): DialoguePreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_DIALOGUE_PREFERENCES, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load dialogue preferences from storage:', e);
  }
  return DEFAULT_DIALOGUE_PREFERENCES;
}

export function saveDialoguePreferences(prefs: DialoguePreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.warn('Failed to save dialogue preferences to storage:', e);
  }
}

/**
 * Builds the exact Gemini System Instruction block based on user's active preferences
 */
export function generateSystemInstructionFromPreferences(
  prefs: DialoguePreferences = DEFAULT_DIALOGUE_PREFERENCES,
  learnerName: string = 'المتعلم',
  learnerAge: string = '',
  trackTitle: string = 'التعليم الإسلامي'
): string {
  // 1. Length Directive
  let lengthDirective = '';
  switch (prefs.responseLength) {
    case 'concise':
      lengthDirective = `• طول الإجابة والعمق (إلزام): كبسولة حوارية موجزة ومركزة جداً (30 - 50 كلمة كحد أقصى). ممنوع الإسهاب أو سرد نصوص طويلة. قدم فكرة واحدة واضحة ومباشرة.`;
      break;
    case 'balanced':
      lengthDirective = `• طول الإجابة والعمق (إلزام): شرح متوازن وتأصيلي معتدل (60 - 100 كلمة). وضح المقصد الشرعي والدليل الأساسي بأسلوب سهل وواضح.`;
      break;
    case 'detailed':
      lengthDirective = `• طول الإجابة والعمق (إلزام): بيان علمي مفصل ومتعمق (120 - 200 كلمة). اذكر التأصيل، والدليل الشرعي، وأوجه الاستدلال، وفروع المسألة وأقوال الأئمة عند الحاجة.`;
      break;
  }

  // 2. Source Type Directive
  let sourceDirective = '';
  switch (prefs.sourceType) {
    case 'quran_tafsir':
      sourceDirective = `• نوع المصادر المعتمدة المفضل: مجمع الملك فهد لطباعة المصحف الشريف والتفاسير المعتمدة (تفسير ابن كثير، الطبري، السعدي، البغوي). ركز استدلالك على الآيات القرآنية وتفسيرها الموثق.`;
      break;
    case 'hadith_sunnah':
      sourceDirective = `• نوع المصادر المعتمدة المفضل: موسوعة الحديث النبوي الشريف وشروحه بالدرر السنية (صحيح البخاري، صحيح مسلم، السنن الأربعة). ركز استدلالك على الهدي النبوي وصحة الأحاديث ودرجتها.`;
      break;
    case 'fiqh_madhahib':
      sourceDirective = `• نوع المصادر المعتمدة المفضل: الفقه الإسلامي الميسر وأقوال المذاهب الأربعة الفقهية المعتمدة (الحنفي، المالكي، الشافعي، الحنبلي). وضح الحكم الفقهي ووجه الدلالة واليسر في الشريعة.`;
      break;
    case 'dawah_dialogue':
      sourceDirective = `• نوع المصادر المعتمدة المفضل: المستودع الرقمي لأبحاث الدعوة والحوار الحضاري (تفكيك الشبهات، أدلة العقل والفطرة، ومخاطبة غير المسلمين بالحكمة والموعظة الحسنة).`;
      break;
    default:
      sourceDirective = `• نوع المصادر المعتمدة المفضل: الحزمة العلمية الشاملة لمنصة «عِلم» (مجمع الملك فهد للمصحف الشريف، موسوعة الحديث بالدرر السنية، أبحاث المستودع الدعوي الرقمي).`;
      break;
  }

  // 3. Dialogue Tone Directive
  let toneDirective = '';
  switch (prefs.dialogueTone) {
    case 'interactive':
      toneDirective = `• النبرة والأسلوب التربوي: أسلوب حواري سقراطي تفاعلي خطوة بخطوة. اشرح فكرة واحدة ثم اختم بسؤال تنشيطي مباشر للتحقق من الفهم قبل الانتقال للنقطة التالية.`;
      break;
    case 'direct':
      toneDirective = `• النبرة والأسلوب التربوي: أسلوب مباشر واستدلالي رصين. اعطِ الخلاصة والحكم والدليل الشرعي بوضوح واختصار دون استطراد حواري طويل.`;
      break;
    case 'simplified':
      toneDirective = `• النبرة والأسلوب التربوي: أسلوب تبسيطي دافئ جداً يستعين بالأمثلة الواقعية المعاصرة وتشبيهات الحياة اليومية لتقريب المعاني الشرعية للقلب والعقل.`;
      break;
  }

  // 4. Diacritics and Citations
  const diacriticsDirective = prefs.includeQuranicDiacritics
    ? `• ضبط الآيات: التزم برسم المصحف الشريف وعلامات التشكيل للآيات القرآنية المنقولة بدقة تامة.`
    : `• رسم النصوص: اكتب الآيات واضحة وميسرة.`;

  const citationDirective = prefs.showSourceCitations
    ? `• توثيق المصدر: اذكر اسم المصدر المعتمد ورقم الآية أو الحديث في نهاية الرد بدقة.`
    : `• توثيق المصدر: اكتفِ بذكر الشاهد الشرعي.`;

  return `
# ==============================================================================
# ⚙️ GEMINI SYSTEM INSTRUCTION: USER-CUSTOMIZED DIALOGUE PREFERENCES
# ==============================================================================
أنت "المعلم الإسلامي التفاعلي والناصح الشرعي الذكي" في منصة «عِلم».
يجب عليك الالتزام الصارم بتفضيلات الحوار التي حددها المتعلم (${learnerName}) أدناه في كل رد تولده:

[معايير التفضيلات المحددة من المستخدم]:
${lengthDirective}
${sourceDirective}
${toneDirective}
${diacriticsDirective}
${citationDirective}

بيانات السياق:
- اسم المتعلم: ${learnerName}
- الفئة العمرية: ${learnerAge || 'غير محددة'}
- المسار: ${trackTitle}
`;
}
