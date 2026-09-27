export type TrackId = 'muslim' | 'new_muslim' | 'non_muslim' | 'daiyah';

export type Language = 'ar' | 'en' | 'ur';

export type ContentLevel = 
  | 'A' // المستوى (أ): معلومات أصلية مستقرة (قرآن، أحاديث صحيحة، أركان) -> إجابة مباشرة موثقة
  | 'B' // المستوى (ب): شرح وتعريف واستدلال (مقاصد، مقارنات، شبهات عامة) -> إجابة مع إظهار المرجع
  | 'C' // المستوى (ج): مسائل خلافية أو حساسة -> إجابة مقيدة أو بيان الخلاف أو الإحالة
  | 'D'; // المستوى (د): فتوى أو واقعة شخصية -> امتناع صريح عن الفتوى المستقلة والإحالة لمختص

export interface SourceReference {
  domain: 'dawa.center' | 'dorar.net' | 'quranpedia.net' | 'islamic-content.com' | 'shamela.ws' | 'quran.ksu.edu.sa';
  title: string;
  category: 'قرآن كريم' | 'حديث نبوي' | 'تفسير' | 'عقيدة' | 'فقه عام' | 'سيرة وتاريخ' | 'مفردات ومصطلحات' | 'شبهات وردود' | 'الموضوعات الدعوية';
  referenceDetail: string; // e.g., "سورة البقرة: آية 255" or "صحيح البخاري: رقم 8" or "المستودع الدعوي: ملف 7937"
  url?: string;
  reliabilityNote: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionEn?: string;
  options: string[];
  optionsEn?: string[];
  correctIndex: number;
  explanation: string;
  explanationEn?: string;
  source: SourceReference;
}

export interface ScriptureCitation {
  type: 'quran' | 'hadith';
  arabicText: string;
  translationEn: string;
  reference: string;
  referenceEn: string;
  grade?: string; // e.g. "صحيح البخاري"
  source: SourceReference;
}

export interface LessonStage {
  id: string;
  trackId: TrackId;
  stageNumber: number;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  estimatedMinutes: number;
  contentLevel: ContentLevel;
  scriptures: ScriptureCitation[];
  conceptExplanation: string;
  conceptExplanationEn: string;
  keyTerms: {
    ar: string;
    en: string;
    approvedStandard: string;
  }[];
  sources: SourceReference[];
  quiz: QuizQuestion[];
  reflectionPrompt: string;
  reflectionPromptEn: string;
  isCompleted?: boolean;
}

export interface SimulatorScenario {
  id: string;
  title: string;
  titleEn: string;
  inquirerPersona: {
    name: string;
    background: string;
    tone: 'curious' | 'skeptical' | 'challenging' | 'hesitant';
  };
  initialMessage: string;
  initialMessageEn: string;
  context: string;
  idealApproachNotes: string;
  sources: SourceReference[];
}

export interface SimulationEvaluation {
  clarityScore: number; // وضوح الإجابة
  understandingScore: number; // فهم السؤال وسياق السائل
  structureScore: number; // ترتيب الأفكار
  evidenceScore: number; // قوة الاستدلال وصحة المصادر
  mannerScore: number; // أسلوب الحوار والحكمة
  respectScore: number; // احترام الطرف الآخر
  pedagogyScore: number; // التدرج من الأصل للفرع
  overallPercentage: number;
  strengths: string[];
  growthPoints: string[];
  recommendedSources: SourceReference[];
  detailedFeedback: string;
}

export interface BenchmarkCase {
  id: string;
  question: string;
  questionEn: string;
  expectedCategory: ContentLevel;
  expectedBehavior: string;
  expectedBehaviorEn: string;
  approvedSource: SourceReference;
  systemPromptGuideline: string;
  sampleCompliantResponse: string;
  sampleCompliantResponseEn: string;
}
