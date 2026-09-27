import { SourceReference } from '../types';

export const APPROVED_SOURCES_REGISTRY: Record<string, SourceReference> = {
  quran_mushaf: {
    domain: 'quranpedia.net',
    title: 'القرآن الكريم - مجمع الملك فهد لطباعة المصحف الشريف',
    category: 'قرآن كريم',
    referenceDetail: 'النص بالرسم العثماني المعتمد وترجمات معاني القرآن الصادرة عن المجمع',
    url: 'https://quranpedia.net',
    reliabilityNote: 'مصدر معتمد ملزم للنص القرآني والترجمات الرسمية المعتمدة'
  },
  dorar_tafseer: {
    domain: 'dorar.net',
    title: 'موسوعة التفسير - مؤسسة الدرر السنية',
    category: 'تفسير',
    referenceDetail: 'تفسير الآيات القرآنية نقلاً عن أئمة التفسير المتقدمين مع تمييز النص القرآني',
    url: 'https://dorar.net/tafseer',
    reliabilityNote: 'المصدر المعتمد في الحزمة العلمية للتحدي لشرح الآيات وبيان معانيها'
  },
  dorar_hadith: {
    domain: 'dorar.net',
    title: 'الموسوعة الحديثية - مؤسسة الدرر السنية',
    category: 'حديث نبوي',
    referenceDetail: 'تخريج وتحقيق الأحاديث النبوية، والاعتماد على الصحيحين وما صححه كبار الأئمة',
    url: 'https://dorar.net/hadith',
    reliabilityNote: 'ملزم في التحدي: لا ينسب حديث دون مصدر وحكم معتمد في البيانات'
  },
  dorar_aqeeda: {
    domain: 'dorar.net',
    title: 'موسوعة العقيدة - مؤسسة الدرر السنية',
    category: 'عقيدة',
    referenceDetail: 'بيان معتقد أهل السنة والجماعة وفق مصادر القرون الثلاثة الأولى',
    url: 'https://dorar.net/aqeeda',
    reliabilityNote: 'مرجع معتمد لتقرير أصول الإيمان والتوحيد والرد على الشبهات العقدية'
  },
  dorar_feqhia: {
    domain: 'dorar.net',
    title: 'الموسوعة الفقهية - مؤسسة الدرر السنية',
    category: 'فقه عام',
    referenceDetail: 'عرض مسائل الفقه المقارن والمذاهب الأربعة دون ترجيح آلي أو إصدار فتوى',
    url: 'https://dorar.net/feqhia',
    reliabilityNote: 'مرجع معتمد لعرض الأحكام العامة دون تحويلها لفتوى شخصية خاصة'
  },
  dorar_history: {
    domain: 'dorar.net',
    title: 'موسوعة السيرة النبوية والتاريخ - مؤسسة الدرر السنية',
    category: 'سيرة وتاريخ',
    referenceDetail: 'تحقيق وقائع السيرة النبوية والتاريخ الإسلامي بالروايات الثابتة',
    url: 'https://dorar.net/history',
    reliabilityNote: 'مرجع معتمد لأحداث السيرة المطهرة دون مبالغات أو روايات واهية'
  },
  dawa_center: {
    domain: 'dawa.center',
    title: 'المستودع الدعوي الرقمي',
    category: 'الموضوعات الدعوية',
    referenceDetail: 'مواد التأصيل الدعوي، والتعريف بالإسلام، والدعوة حسب اللغات والأديان والفئات',
    url: 'https://dawa.center',
    reliabilityNote: 'المرجع الدعوي الرئيسي الشامل الموصى به في وثيقة التحدي'
  },
  dawa_shubuhat: {
    domain: 'dawa.center',
    title: 'بيانات: أسئلة وأجوبة عن الإسلام (ملف 7937)',
    category: 'شبهات وردود',
    referenceDetail: 'إجابات علمية رصينة ومؤصلة عن الأسئلة الفكرية والشبهات الأكثر تداولاً',
    url: 'https://dawa.center/file/7937',
    reliabilityNote: 'مصدر أساسي للحلول الحوارية في الشبهات المعتمد في الدليل (ص 4)'
  },
  jamhara_terms: {
    domain: 'islamic-content.com',
    title: 'موسوعة الجمهرة - مفردات المحتوى الإسلامي',
    category: 'مفردات ومصطلحات',
    referenceDetail: 'قاموس المصطلحات والمفاهيم الإسلامية وضوابط الترجمة للغات العالمية',
    url: 'https://islamic-content.com/dictionary',
    reliabilityNote: 'مرجع رسمي لضبط المصطلح الشرعي ومنع الترجمات الآلية المضللة'
  },
  shamela_library: {
    domain: 'shamela.ws',
    title: 'المكتبة الشاملة (الطبعات المعتمدة)',
    category: 'حديث نبوي',
    referenceDetail: 'أمهات كتب الحديث والتفاسير المعتمدة لتدقيق النصوص وتوثيقها',
    url: 'https://shamela.ws',
    reliabilityNote: 'مرجع للتأكد من نصوص الأحاديث والآثار من طبعاتها المحققة'
  }
};

export const APPROVED_TERMS_DICTIONARY = [
  {
    term: 'الإسلام',
    termEn: 'Islam',
    standardRule: 'دين الاستسلام لله بالتوحيد والانقياد له بالطاعة؛ يُشرح بحسب السياق ولا يُختزل في معنى ثقافي عام.',
    standardRuleEn: 'Submitting to Allah in Tawhid and obedience; explained in context without reducing to a generic cultural concept.'
  },
  {
    term: 'التوحيد',
    termEn: 'Tawhid / Oneness of God',
    standardRule: 'يُفضل إبقاء المصطلح مع شرح معناه: إفراد الله بالربوبية والألوهية ووصفه بأسمائه الحسنى، ولا يُختزل في ترجمة توحي بمجرد الوحدانية العددية.',
    standardRuleEn: 'Retain the term Tawhid or translate with context: devoting worship to Allah alone and affirming His attributes, not merely numerical oneness.'
  },
  {
    term: 'العبادة',
    termEn: 'Worship',
    standardRule: 'تشمل أعمال القلب والقول والعمل التي يتقرب بها العبد إلى الله، ولا تُحصر في الشعائر الطقسية فقط.',
    standardRuleEn: 'Encompasses heartfelt intentions, speech, and deeds pleasing to Allah; not restricted to ritual rites alone.'
  },
  {
    term: 'النبوة',
    termEn: 'Prophethood',
    standardRule: 'تُستخدم للدلالة على اصطفاء الأنبياء بالوحي، مع التمييز بينها وبين القيادة الدينية أو السياسية البشرية.',
    standardRuleEn: 'Denotes divine selection by revelation, strictly differentiated from ordinary human religious leadership.'
  },
  {
    term: 'الوحي',
    termEn: 'Revelation',
    standardRule: 'يُشرح بوصفه ما أوحاه الله إلى أنبيائه، مع تجنب استعمالات فضفاضة قد توهم الإلهام النفسي أو الفني.',
    standardRuleEn: 'Divine message revealed by Allah to His messengers; avoiding loose terms implying subjective artistic inspiration.'
  },
  {
    term: 'الشريعة',
    termEn: 'Sharia / Islamic Guidance and Law',
    standardRule: 'تُشرح بحسب السياق كمنهاج حياة شامل رحيم، ولا تُختزل في العقوبات الجنائية.',
    standardRuleEn: 'Explained as a comprehensive way of life and moral guidance, not reduced exclusively to punitive penal codes.'
  },
  {
    term: 'الحديث',
    termEn: 'Hadith',
    standardRule: 'ما نُقل عن النبي ﷺ من قول أو فعل أو تقرير، مع اشتراط بيان درجة الثبوت عند الاستدلال.',
    standardRuleEn: 'Recorded sayings, actions, or tacit approvals of Prophet Muhammad ﷺ, requiring status verification when citing.'
  },
  {
    term: 'الفتوى',
    termEn: 'Fatwa',
    standardRule: 'جواب شرعي يصدره مؤهل في واقعة أو سؤال لشخص بعينه؛ ولا تُساوى بالمعلومة التثقيفية العامة، ويمتنع النظام عن استقلالها.',
    standardRuleEn: 'A specific legal ruling given by a qualified scholar on a personal case; not equated with general knowledge.'
  },
  {
    term: 'الدعوة',
    termEn: "Da'wah / Invitation to Islam",
    standardRule: 'التعريف بالإسلام والدعوة إليه بالحكمة والموعظة الحسنة، ويُختار المقابل بحسب السياق والمخاطب.',
    standardRuleEn: 'Inviting people to understand and accept Islam through wisdom and kind speech.'
  }
];
