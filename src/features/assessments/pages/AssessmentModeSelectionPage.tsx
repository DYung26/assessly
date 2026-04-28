'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ASSESSMENT_MODES } from '../modes/assessmentModes';
import type { AssessmentModeId } from '../modes/assessmentModes';
import { AssessmentModeCard } from '../components/AssessmentModeCard';
import { useAssessment } from '@/lib/hooks/useAssessment';
import { mutationFn } from '@/lib/mutationFn';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';

interface AssessmentModeSelectionPageProps {
  assessmentId: string;
}

export function AssessmentModeSelectionPage({
  assessmentId,
}: AssessmentModeSelectionPageProps) {
  const [selectedMode, setSelectedMode] = useState<AssessmentModeId | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { data: assessment, isLoading } = useAssessment(assessmentId);

  useEffect(() => {
    if (assessment?.mode) {
      router.push(`/assessment/${assessmentId}`);
    }
  }, [assessment, assessmentId, router]);

  const updateModeMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['assessment', assessmentId],
      });
      toast.success('Mode selected');
      router.push(`/assessment/${assessmentId}`);
    },
    onError: (error: unknown) => {
      toast.error('Failed to save mode', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      setIsSubmitting(false);
    },
  });

  const handleContinue = () => {
    if (!selectedMode) return;
    setIsSubmitting(true);
    updateModeMutation.mutate({
      url: `/assessment/${assessmentId}`,
      method: 'PUT',
      body: {
        mode: selectedMode,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold text-slate-900 dark:text-slate-100">
            What would you like to do?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Choose how Assessly should help in this assessment. You can choose a different mode before you start adding content.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ASSESSMENT_MODES.map((mode) => (
            <AssessmentModeCard
              key={mode.id}
              mode={mode}
              isSelected={selectedMode === mode.id}
              onSelect={() => {
                if (mode.enabled) {
                  setSelectedMode(mode.id);
                }
              }}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedMode || isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-8 font-semibold text-white transition-opacity disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 cursor-pointer"
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
