import type { Chat } from '@/types';

interface AssessmentActivityInput {
  chats?: Chat[];
  assessmentFiles?: unknown[];
  messages?: unknown[];
}

export const isAssessmentModeLocked = ({
  chats,
  assessmentFiles,
  messages,
}: AssessmentActivityInput): boolean => {
  if (chats && chats.length > 0) {
    return true;
  }
  if (assessmentFiles && assessmentFiles.length > 0) {
    return true;
  }
  if (messages && messages.length > 0) {
    return true;
  }
  return false;
};
