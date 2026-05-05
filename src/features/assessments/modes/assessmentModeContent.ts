import type { AssessmentModeId } from './assessmentModes';

export type AssessmentModeContent = {
  headerTitles: string[];
  headerDescription: string;
  uploadLabels: {
    primary: string;
    secondary: string | null;
    generic: string;
  };
  quickInstructions: string[];
};

export const ASSESSMENT_MODE_CONTENT: Record<AssessmentModeId, AssessmentModeContent> = {
  mark_work: {
    headerTitles: [
      'Ready to mark work?',
      'Start marking this submission',
      'Let\'s review this work',
    ],
    headerDescription:
      'Upload a submission and marking guide, then ask Assessly to mark, annotate, and generate feedback.',
    uploadLabels: {
      primary: 'Upload submission',
      secondary: 'Upload marking guide',
      generic: 'Upload files',
    },
    quickInstructions: [
      'Mark, grade and analyse the script',
      'Annotate the marking',
      'Grade as absolute score and %',
      'Generate feedback report', // include analysis
      // 'Show missing points',
      // 'Suggest improvements',
      // 'Write detailed analysis',
      'Rewrite this answer to improve it',
      'Create a study plan based on identified weaknesses', // timetable
      'Create similar practice questions'
    ],
  },
  explore_anything: {
    headerTitles: [
      'What would you like to explore?',
      'What\'s on your mind?',
      'Let\'s dive into your materials',
    ],
    headerDescription:
      'Upload files or start a conversation. Ask Assessly to summarize, compare, explain, or draft from your materials.',
    uploadLabels: {
      primary: 'Upload files',
      secondary: null,
      generic: 'Upload files',
    },
    quickInstructions: [
      'Summarize uploaded files',
      'Extract key points',
      'Compare documents',
      'Explain this simply',
      // 'Draft from these files',
      // 'Suggest next steps',
    ],
  },
  learn_from_materials: {
    headerTitles: [
      'Learn from your materials',
      'Master these concepts',
      'Understand this better',
    ],
    headerDescription:
      'Upload notes, slides, or PDFs and let Assessly explain, quiz, and summarize them.',
    uploadLabels: {
      primary: 'Upload study material',
      secondary: null,
      generic: 'Upload files',
    },
    quickInstructions: [
      'Explain this topic',
      'Summarize this material',
      'Create flashcards',
      'Quiz me',
      'Generate revision notes',
    ],
  },
  revise_for_exams: {
    headerTitles: [
      'Prepare for exams',
      'Let\'s get you exam-ready',
      'Build your revision plan',
    ],
    headerDescription:
      'Turn your materials into a revision plan, practice questions, and focused study sessions.',
    uploadLabels: {
      primary: 'Upload revision material',
      secondary: null,
      generic: 'Upload files',
    },
    quickInstructions: [
      'Create a study plan',
      'Find my weak areas',
      'Generate practice questions',
      'Make flashcards',
      'Create a revision summary',
    ],
  },
  practice_past_questions: {
    headerTitles: [
      'Practice past questions',
      'Work through these questions',
      'Improve your answers',
    ],
    headerDescription:
      'Work through past questions, compare answers, and improve your responses.',
    uploadLabels: {
      primary: 'Upload past question paper',
      secondary: 'Upload answer guide',
      generic: 'Upload files',
    },
    quickInstructions: [
      'Solve this question',
      'Explain the answer',
      'Mark my attempt',
      'Show where I lost marks',
      'Generate a model answer',
    ],
  },
};

export const getAssessmentModeContent = (
  modeId: AssessmentModeId | undefined | null
): AssessmentModeContent => {
  if (!modeId) return ASSESSMENT_MODE_CONTENT.explore_anything;
  return ASSESSMENT_MODE_CONTENT[modeId] ?? ASSESSMENT_MODE_CONTENT.explore_anything;
};
