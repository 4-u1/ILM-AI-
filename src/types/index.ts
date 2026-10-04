export type TrackId = 'muslim' | 'new_muslim' | 'non_muslim' | 'daiyah';

export type Language = 'ar' | 'en' | 'ur' | 'fr' | 'es' | 'id';

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

export type AchievementCategory = 'milestone' | 'track' | 'mastery' | 'engagement';

export interface AchievementBadge {
  id: string;
  code: string;
  title: string;
  titleEn: string;
  titleUr: string;
  description: string;
  descriptionEn: string;
  descriptionUr: string;
  category: AchievementCategory;
  iconName: string; // Lucide icon identifier
  colorScheme: 'gold' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose';
  xpPoints: number;
  conditionDescription: string;
  conditionDescriptionEn: string;
  conditionDescriptionUr: string;
  isUnlocked: (context: {
    completedStageIds: string[];
    selectedTrack: TrackId | null;
    simulatorCompleted?: boolean;
    quizPassCount?: number;
    hasSharedCertificate?: boolean;
    learnerName?: string;
    streakDays?: number;
  }) => boolean;
  progressPercent: (context: {
    completedStageIds: string[];
    selectedTrack: TrackId | null;
    simulatorCompleted?: boolean;
    quizPassCount?: number;
    streakDays?: number;
  }) => number;
}

// ==========================================
// سفراء عِلم وروابط الإحالة الدعوية الذكية
// ==========================================
export type AmbassadorRankId = 'conveyer' | 'guide' | 'impact_builder' | 'key_of_goodness' | 'digital_center';

export interface AmbassadorRank {
  id: AmbassadorRankId;
  titleAr: string;
  titleEn: string;
  titleUr: string;
  requiredInvites: number;
  requiredCompletions: number;
  badgeCode: string;
  descAr: string;
  descEn: string;
  iconName: string;
  colorScheme: string;
}

export interface AmbassadorStats {
  referralCode: string;
  totalVisits: number;
  totalQuestionsAsked: number;
  totalCapsulesRead: number;
  totalShahadasWitnessed: number;
  sharedKitsCount: number;
  currentRankId: AmbassadorRankId;
}

// ==========================================
// حقيبة الأيام الـ 30 الأولى للمسلم الجديد
// ==========================================
export interface DailyJourneyStep {
  dayNumber: number;
  titleAr: string;
  titleEn: string;
  titleUr: string;
  conceptShortAr: string;
  conceptShortEn: string;
  practicalActionAr: string;
  practicalActionEn: string;
  dailySupplicationAr: string;
  dailySupplicationEn: string;
  category: 'aqidah' | 'taharah' | 'salah' | 'akhlaq' | 'daily_life';
  sourceReference: SourceReference;
}

// ==========================================
// المساعد الدعوي الميداني الفوري (Co-Pilot)
// ==========================================
export interface WhisperingPrompt {
  id: string;
  scenarioTitleAr: string;
  scenarioTitleEn: string;
  category: 'existence_of_god' | 'prophethood' | 'quran_authenticity' | 'human_rights_women' | 'scientific_facts';
  commonDoubtAr: string;
  commonDoubtEn: string;
  rapidAnswerAr: string;
  rapidAnswerEn: string;
  scriptureProofAr: string;
  scriptureProofEn: string;
  sourceReference: SourceReference;
  wisdomAdviceAr: string;
  wisdomAdviceEn: string;
}

// ==========================================
// بطاقة إحالة الفتوى الرسمية (Level D)
// ==========================================
export interface OfficialFatwaTicket {
  ticketNumber: string;
  inquirySummary: string;
  detectedSensitiveTopics: string[];
  timestamp: string;
  recommendedOfficialBodyAr: string;
  recommendedOfficialBodyEn: string;
  portalUrl: string;
  tollFreeNumber: string;
  status: 'referred_for_scholarly_review';
}

// ==========================================
// تفضيلات الحوار الذكي وموجهات النظام (Gemini System Instruction Preferences)
// ==========================================
export type ResponseLengthPreference = 'concise' | 'balanced' | 'detailed';

export type SourceTypePreference = 'all' | 'quran_tafsir' | 'hadith_sunnah' | 'fiqh_madhahib' | 'dawah_dialogue';

export type DialogueTonePreference = 'interactive' | 'direct' | 'simplified';

export interface DialoguePreferences {
  responseLength: ResponseLengthPreference; // 'concise' (30-50 words), 'balanced' (60-100 words), 'detailed' (120-200 words)
  sourceType: SourceTypePreference; // 'all' | 'quran_tafsir' | 'hadith_sunnah' | 'fiqh_madhahib' | 'dawah_dialogue'
  dialogueTone: DialogueTonePreference; // 'interactive' | 'direct' | 'simplified'
  includeQuranicDiacritics: boolean; // تشكيل وضبط الآيات
  showSourceCitations: boolean; // إبراز المصادر وتوثيقها
  autoLanguageMatch: boolean; // مطابقة لغة السائل
}

