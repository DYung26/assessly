'use client';

import { use } from 'react';
import { AssessmentModeSelectionPage } from '@/features/assessments/pages/AssessmentModeSelectionPage';
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect';

type PageProps = {
  params: Promise<{ assessment_id: string }>;
};

export default function AssessmentSetup({ params }: PageProps) {
  useAuthRedirect();
  const { assessment_id } = use(params);

  if (!assessment_id) return null;

  return <AssessmentModeSelectionPage assessmentId={assessment_id} />;
}
