export interface Question {
  key: string;
  category: 'inflammation' | 'digestion' | 'microbiome' | 'general';
  question: string;
  options: { label: string; value: string; score: number }[];
}

export const questions: Question[] = [
  // Inflammation
  {
    key: 'bloating_frequency',
    category: 'inflammation',
    question: 'How often do you experience bloating?',
    options: [
      { label: 'Rarely or never', value: 'rarely', score: 10 },
      { label: 'Once a week', value: 'weekly', score: 7 },
      { label: 'A few times a week', value: 'often', score: 4 },
      { label: 'Daily', value: 'daily', score: 1 },
    ],
  },
  {
    key: 'skin_issues',
    category: 'inflammation',
    question: 'Do you experience skin issues (acne, rashes, eczema)?',
    options: [
      { label: 'No issues', value: 'none', score: 10 },
      { label: 'Occasionally', value: 'occasional', score: 7 },
      { label: 'Frequently', value: 'frequent', score: 4 },
      { label: 'Chronic', value: 'chronic', score: 1 },
    ],
  },
  {
    key: 'joint_pain',
    category: 'inflammation',
    question: 'Do you have unexplained joint pain or stiffness?',
    options: [
      { label: 'Never', value: 'never', score: 10 },
      { label: 'Rarely', value: 'rarely', score: 7 },
      { label: 'Sometimes', value: 'sometimes', score: 4 },
      { label: 'Often', value: 'often', score: 1 },
    ],
  },
  // Digestion
  {
    key: 'bowel_regularity',
    category: 'digestion',
    question: 'How regular are your bowel movements?',
    options: [
      { label: 'Very regular (daily)', value: 'regular', score: 10 },
      { label: 'Mostly regular', value: 'mostly', score: 7 },
      { label: 'Irregular', value: 'irregular', score: 4 },
      { label: 'Very irregular', value: 'very_irregular', score: 1 },
    ],
  },
  {
    key: 'food_sensitivity',
    category: 'digestion',
    question: 'Do you experience discomfort after eating certain foods?',
    options: [
      { label: 'Rarely', value: 'rarely', score: 10 },
      { label: 'With a few foods', value: 'few', score: 7 },
      { label: 'With many foods', value: 'many', score: 4 },
      { label: 'Most meals cause discomfort', value: 'most', score: 1 },
    ],
  },
  {
    key: 'acid_reflux',
    category: 'digestion',
    question: 'How often do you experience acid reflux or heartburn?',
    options: [
      { label: 'Never', value: 'never', score: 10 },
      { label: 'Occasionally', value: 'occasional', score: 7 },
      { label: 'Weekly', value: 'weekly', score: 4 },
      { label: 'Daily', value: 'daily', score: 1 },
    ],
  },
  // Microbiome
  {
    key: 'fermented_foods',
    category: 'microbiome',
    question: 'How often do you eat fermented foods (yogurt, kimchi, sauerkraut)?',
    options: [
      { label: 'Daily', value: 'daily', score: 10 },
      { label: 'A few times a week', value: 'often', score: 7 },
      { label: 'Rarely', value: 'rarely', score: 4 },
      { label: 'Never', value: 'never', score: 1 },
    ],
  },
  {
    key: 'fiber_intake',
    category: 'microbiome',
    question: 'How would you describe your fiber intake (fruits, vegetables, whole grains)?',
    options: [
      { label: 'Very high', value: 'high', score: 10 },
      { label: 'Moderate', value: 'moderate', score: 7 },
      { label: 'Low', value: 'low', score: 4 },
      { label: 'Very low', value: 'very_low', score: 1 },
    ],
  },
  {
    key: 'antibiotic_use',
    category: 'microbiome',
    question: 'Have you taken antibiotics in the past 6 months?',
    options: [
      { label: 'No', value: 'no', score: 10 },
      { label: 'One course', value: 'one', score: 6 },
      { label: 'Multiple courses', value: 'multiple', score: 2 },
    ],
  },
  // General
  {
    key: 'stress_level',
    category: 'general',
    question: 'How would you rate your daily stress level?',
    options: [
      { label: 'Low', value: 'low', score: 10 },
      { label: 'Moderate', value: 'moderate', score: 7 },
      { label: 'High', value: 'high', score: 4 },
      { label: 'Very high', value: 'very_high', score: 1 },
    ],
  },
  {
    key: 'sleep_quality',
    category: 'general',
    question: 'How would you rate your sleep quality?',
    options: [
      { label: 'Excellent', value: 'excellent', score: 10 },
      { label: 'Good', value: 'good', score: 7 },
      { label: 'Fair', value: 'fair', score: 4 },
      { label: 'Poor', value: 'poor', score: 1 },
    ],
  },
  {
    key: 'water_intake',
    category: 'general',
    question: 'How much water do you drink daily?',
    options: [
      { label: '8+ glasses', value: 'plenty', score: 10 },
      { label: '5-7 glasses', value: 'good', score: 7 },
      { label: '3-4 glasses', value: 'low', score: 4 },
      { label: 'Less than 3 glasses', value: 'very_low', score: 1 },
    ],
  },
];

export function calculateScores(answers: Record<string, string>) {
  const categoryScores: Record<string, { total: number; count: number }> = {
    inflammation: { total: 0, count: 0 },
    digestion: { total: 0, count: 0 },
    microbiome: { total: 0, count: 0 },
    general: { total: 0, count: 0 },
  };

  for (const q of questions) {
    const answer = answers[q.key];
    if (answer) {
      const option = q.options.find((o) => o.value === answer);
      if (option) {
        categoryScores[q.category].total += option.score;
        categoryScores[q.category].count += 1;
      }
    }
  }

  const normalize = (cat: string) => {
    const { total, count } = categoryScores[cat];
    return count > 0 ? Math.round((total / (count * 10)) * 100) : 0;
  };

  const inflammation = normalize('inflammation');
  const digestion = normalize('digestion');
  const microbiome = normalize('microbiome');
  const general = normalize('general');
  const overall = Math.round((inflammation + digestion + microbiome + general) / 4);

  return { overall, inflammation, digestion, microbiome };
}

export function getRecommendations(scores: ReturnType<typeof calculateScores>) {
  const recs: { title: string; description: string; category: string }[] = [];

  if (scores.inflammation < 60) {
    recs.push({
      title: 'Reduce inflammatory foods',
      description: 'Try eliminating processed foods, refined sugars, and excess alcohol for 2 weeks.',
      category: 'inflammation',
    });
    recs.push({
      title: 'Add anti-inflammatory foods',
      description: 'Include turmeric, ginger, fatty fish, and leafy greens in your daily diet.',
      category: 'inflammation',
    });
  }

  if (scores.digestion < 60) {
    recs.push({
      title: 'Eat mindfully',
      description: 'Chew food thoroughly and eat without distractions to improve digestion.',
      category: 'digestion',
    });
    recs.push({
      title: 'Consider a food journal',
      description: 'Track what you eat and how you feel to identify trigger foods.',
      category: 'digestion',
    });
  }

  if (scores.microbiome < 60) {
    recs.push({
      title: 'Increase probiotic foods',
      description: 'Add yogurt, kefir, kimchi, or sauerkraut to your daily meals.',
      category: 'microbiome',
    });
    recs.push({
      title: 'Boost fiber intake',
      description: 'Aim for 30+ grams of fiber daily from diverse plant sources.',
      category: 'microbiome',
    });
  }

  if (scores.overall >= 70) {
    recs.push({
      title: 'Maintain your routine',
      description: 'Your gut health is looking good! Keep up your current habits.',
      category: 'general',
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: 'Stay consistent',
      description: 'Your scores are balanced. Focus on consistency and retake the assessment in a month.',
      category: 'general',
    });
  }

  return recs;
}
