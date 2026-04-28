import { create } from 'zustand';
import type { AssessmentModeId } from '../modes/assessmentModes';

type AssessmentModeStore = {
  selectedModes: Record<string, AssessmentModeId>;
  setSelectedMode: (assessmentId: string, modeId: AssessmentModeId) => void;
  getSelectedMode: (assessmentId: string) => AssessmentModeId | undefined;
  clearMode: (assessmentId: string) => void;
};

export const useAssessmentModeStore = create<AssessmentModeStore>((set, get) => ({
  selectedModes: {},
  setSelectedMode: (assessmentId: string, modeId: AssessmentModeId) =>
    set((state) => ({
      selectedModes: {
        ...state.selectedModes,
        [assessmentId]: modeId,
      },
    })),
  getSelectedMode: (assessmentId: string) => {
    return get().selectedModes[assessmentId];
  },
  clearMode: (assessmentId: string) =>
    set((state) => {
      const newModes = { ...state.selectedModes };
      delete newModes[assessmentId];
      return { selectedModes: newModes };
    }),
}));
