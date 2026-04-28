import {
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Zap,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

export type AssessmentModeId =
  | 'mark_work'
  | 'explore_anything'
  | 'learn_from_materials'
  | 'revise_for_exams'
  | 'practice_past_questions';

export type AssessmentMode = {
  id: AssessmentModeId;
  label: string;
  shortLabel: string;
  description: string;
  accent: string;
  enabled: boolean;
  comingSoon?: boolean;
  icon: LucideIcon;
};

export const ASSESSMENT_MODES: AssessmentMode[] = [
  {
    id: 'mark_work',
    label: 'Mark work',
    shortLabel: 'Mark',
    description:
      'Score submissions, annotate files, and generate feedback reports.',
    accent: 'indigo',
    enabled: true,
    icon: CheckCircle2,
  },
  {
    id: 'explore_anything',
    label: 'Explore anything',
    shortLabel: 'Explore',
    description:
      'Chat freely with AI about your files, ideas, or assessment content.',
    accent: 'purple',
    enabled: true,
    icon: Lightbulb,
  },
  {
    id: 'learn_from_materials',
    label: 'Learn from materials',
    shortLabel: 'Learn',
    description:
      'Upload notes, slides, or PDFs and get explanations, summaries, and quizzes.',
    accent: 'emerald',
    enabled: false,
    comingSoon: true,
    icon: BookOpen,
  },
  {
    id: 'revise_for_exams',
    label: 'Revise for exams',
    shortLabel: 'Revise',
    description:
      'Turn your materials into revision plans, flashcards, and practice sessions.',
    accent: 'amber',
    enabled: false,
    comingSoon: true,
    icon: Zap,
  },
  {
    id: 'practice_past_questions',
    label: 'Practice past questions',
    shortLabel: 'Practice',
    description:
      'Work through past questions, compare answers, and improve your responses.',
    accent: 'rose',
    enabled: false,
    comingSoon: true,
    icon: BarChart3,
  },
];

export const getAssessmentModeById = (
  id: AssessmentModeId
): AssessmentMode | undefined => {
  return ASSESSMENT_MODES.find((mode) => mode.id === id);
};

export const getEnabledModes = (): AssessmentMode[] => {
  return ASSESSMENT_MODES.filter((mode) => mode.enabled);
};
