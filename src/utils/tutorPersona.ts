export type AgeBracket = 'child' | 'youth' | 'adult';

export interface LearnerPersona {
  bracket: AgeBracket;
  titleCall: string;
  toneDescription: string;
  exampleContext: string;
  simplifyLevel: 'ultra' | 'balanced' | 'profound';
}

export function parseLearnerPersona(ageInput: string = '', name: string = ''): LearnerPersona {
  const cleanName = name.trim() || 'يا أخي الكريم';
  const cleanAge = (ageInput || '').trim().toLowerCase();
  const num = parseInt(cleanAge.replace(/[^0-9]/g, ''), 10);

  const isChild = (num && num < 15) || cleanAge.includes('أقل من') || cleanAge.includes('طفل') || cleanAge.includes('بطل');
  const isYouth = (num && num >= 15 && num <= 25) || cleanAge.includes('18 - 25') || cleanAge.includes('شاب') || cleanAge.includes('جامع');

  if (isChild) {
    return {
      bracket: 'child',
      titleCall: `يا بطل ${cleanName}`,
      toneDescription: 'دافئة، حنونة، محفزة ومشجعة جداً',
      exampleContext: 'المدرسة، اللعب النظيف، الصدق مع الأصدقاء، وبر الوالدين وحب الله ورسوله',
      simplifyLevel: 'ultra',
    };
  }

  if (isYouth) {
    return {
      bracket: 'youth',
      titleCall: `أخي العزيز ${cleanName}`,
      toneDescription: 'حوارية ملهمة، عقلية، متزنة، وصديقة ناصحة',
      exampleContext: 'الجامعة، الرفقة الصالحة، العمل، مواجهة الشبهات، والنجاح الحقيقي',
      simplifyLevel: 'balanced',
    };
  }

  return {
    bracket: 'adult',
    titleCall: `أخي الفاضل ${cleanName}`,
    toneDescription: 'وقورة، رصينة، عميقة، باعثة على السكينة واليقين',
    exampleContext: 'المسؤوليات الأسرية، تربية الأبناء، الرزق الحلال، والتوكل على الله',
    simplifyLevel: 'profound',
  };
}

/**
 * Adapt a capsule/chunk explanation text dynamically to learner's age bracket & name
 */
export function adaptCapsuleForAge(
  baseConcept: string,
  persona: LearnerPersona,
  capsuleOrder: number,
  stageTitle?: string
): string {
  // If baseConcept is provided, preserve its specific meaning while adapting tone/examples
  const contextSubject = stageTitle ? `موضوع «${stageTitle}»` : 'هذا المفهوم المبارك';

  if (persona.bracket === 'child') {
    if (capsuleOrder === 1) {
      if (baseConcept && baseConcept.length > 20) {
        return `يا بطل! في ${contextSubject}:\n\n${baseConcept}\n\nيعني ببساطة أن نعمل الصواب ونطيع ربنا برحمة ومحبة.`;
      }
      return `حياك الله ${persona.titleCall}! 🌟\n\nأتدري ما أجمل شيء في ديننا؟ أن الله يحبنا ويرعانا وهو وحده الذي خلقنا ويرزقنا، لذلك نحن نعبده وحده ونصلي له ونطيعه لأننا نحبه.`;
    }
    if (capsuleOrder === 3) {
      if (baseConcept && baseConcept.length > 20) {
        return `ما شاء الله عليك ${persona.titleCall}! 👏\n\nتطبيقه في يومك الجميل:\n${baseConcept}\n\nبأن تصدق في كلامك، وتبر والديك، وتكون لطيفاً مع زملائك.`;
      }
      return `ما شاء الله عليك ${persona.titleCall}! 👏\n\nكيف نطبق هذا في يومك الجميل؟ بأن تصدق في كلامك، وتحسن لأمك وأبيك، وتلعب بلطف مع أصدقائك ابتغاء مرضاة الله.`;
    }
  } else if (persona.bracket === 'youth') {
    if (capsuleOrder === 1) {
      if (baseConcept && baseConcept.length > 20) {
        return `أهلاً بك ${persona.titleCall}.\n\nالجوهر الأساسي في ${contextSubject}:\n\n${baseConcept}\n\nوهذا يمنحك بصيرة عقلية ويقيناً ثابتاً في حياتك ودراستك.`;
      }
      return `أهلاً بك ${persona.titleCall}.\n\nالأساس المتين الذي يبنى عليه كل شيء في حياتك هو التوحيد: إفراد الله وحده بالعبادة، واليقين بأن كل ما في الكون يسير بحكمته وعلمه، فلا نخاف إلا الله ولا نرجو سواه.`;
    }
    if (capsuleOrder === 3) {
      if (baseConcept && baseConcept.length > 20) {
        return `أحسنت ${persona.titleCall}!\n\nفي واقع شبابنا المعاصر، يظهر هذا في:\n${baseConcept}\n\nمن خلال الثبات على المبادئ، الأمانة، واختيار الرفقة الصالحة.`;
      }
      return `أحسنت ${persona.titleCall}!\n\nفي واقع شبابنا المعاصر، يظهر هذا العلم في ثباتك على مبادئك، اختيار الرفقة الصالحة، الأمانة في دراستك وعملك، وحفظ قلبك وعقلك من الشبهات.`;
    }
  } else {
    // Adult
    if (capsuleOrder === 1) {
      if (baseConcept && baseConcept.length > 20) {
        return `حياك الله ${persona.titleCall}.\n\nالأصل المعتمد في ${contextSubject}:\n\n${baseConcept}\n\nوهو باب الطمأنينة والسكينة القلبية والاستقامة.`;
      }
      return `حياك الله ${persona.titleCall}.\n\nأصل الأصول وقرة عين الموحدين هو إفراد الله سبحانه بالربوبية والألوهية والأسماء الحسنى؛ لتطمئن النفس وتستقر في معية الخالق المدبر لكل شأن.`;
    }
    if (capsuleOrder === 3) {
      if (baseConcept && baseConcept.length > 20) {
        return `زادك الله بصيرة ${persona.titleCall}.\n\nوثمرة هذا العلم في حياتنا المعاصرة:\n${baseConcept}\n\nفي السكينة عند الشدائد، طلب الرزق الحلال، وحسن رعاية الأسرة والمسؤوليات.`;
      }
      return `زادك الله بصيرة ${persona.titleCall}.\n\nوثمرة هذا العلم في حياتنا المعاصرة: السكينة عند الشدائد، طلب الرزق الحلال، حسن المعاملة مع الأهل والناس، والتوكل التام على الله مع بذل الأسباب المشروعة.`;
    }
  }

  // Fallback to concise version
  return baseConcept;
}
