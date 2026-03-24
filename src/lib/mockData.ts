// Mock data for the entire app

export interface ErrorLog {
  id: string;
  subject: string;
  topic: string;
  specific_error_tag: string;
  error_category: string;
  created_at: string;
}

export interface TopicMastery {
  topic: string;
  subject: string;
  score: number; // 0-100
  errorCount: number;
}

export interface DiagnosisResult {
  error_category: string;
  error_tag: string;
  explanation: string;
  practice_problems: {
    id: number;
    question: string;
    answer: string;
  }[];
}

export const mockMasteryData: TopicMastery[] = [
  { topic: "Kinematics", subject: "Physics", score: 35, errorCount: 12 },
  { topic: "Newton's Laws", subject: "Physics", score: 55, errorCount: 7 },
  { topic: "Energy Conservation", subject: "Physics", score: 82, errorCount: 2 },
  { topic: "Stoichiometry", subject: "Chemistry", score: 28, errorCount: 15 },
  { topic: "Acid-Base Reactions", subject: "Chemistry", score: 70, errorCount: 4 },
  { topic: "Algebraic Factoring", subject: "Math", score: 45, errorCount: 9 },
  { topic: "Quadratic Equations", subject: "Math", score: 90, errorCount: 1 },
  { topic: "Trigonometry", subject: "Math", score: 60, errorCount: 5 },
  { topic: "Thermodynamics", subject: "Physics", score: 40, errorCount: 8 },
  { topic: "Organic Chemistry", subject: "Chemistry", score: 75, errorCount: 3 },
  { topic: "Calculus - Derivatives", subject: "Math", score: 50, errorCount: 6 },
  { topic: "Electromagnetic Waves", subject: "Physics", score: 88, errorCount: 1 },
];

export const mockRecentErrors: ErrorLog[] = [
  {
    id: "1",
    subject: "Physics",
    topic: "Kinematics",
    specific_error_tag: "Unit Conversion",
    error_category: "Procedural",
    created_at: "2026-03-24T10:30:00Z",
  },
  {
    id: "2",
    subject: "Chemistry",
    topic: "Stoichiometry",
    specific_error_tag: "Mole Ratio Misapplication",
    error_category: "Conceptual",
    created_at: "2026-03-23T14:15:00Z",
  },
  {
    id: "3",
    subject: "Math",
    topic: "Algebraic Factoring",
    specific_error_tag: "Sign Error in Distribution",
    error_category: "Procedural",
    created_at: "2026-03-22T09:45:00Z",
  },
];

export const mockDiagnosis: DiagnosisResult = {
  error_category: "Conceptual",
  error_tag: "Formula Rearrangement",
  explanation:
    "The error occurs at step 3 where you attempted to isolate velocity (v) from the kinematic equation s = ut + ½at². You correctly identified the need to rearrange, but divided only the first term by t instead of the entire equation. This led to an incorrect intermediate expression. The root cause is a misunderstanding of how algebraic operations must be applied uniformly across all terms in an equation.",
  practice_problems: [
    {
      id: 1,
      question:
        "Rearrange the equation F = ma + μmg to solve for m. Show each step clearly.",
      answer: "m = F / (a + μg)",
    },
    {
      id: 2,
      question:
        "Given s = ut + ½at², isolate 'a' in terms of all other variables. What must you do to both sides first?",
      answer: "a = 2(s - ut) / t²",
    },
    {
      id: 3,
      question:
        "If PV = nRT, rearrange to find T. Then, if P doubles and V halves, what happens to T?",
      answer: "T = PV/(nR). T remains the same since P×V is unchanged.",
    },
  ],
};

export function getMasteryColor(score: number): "red" | "yellow" | "green" {
  if (score < 40) return "red";
  if (score < 70) return "yellow";
  return "green";
}
