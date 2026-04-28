'use client';

import clsx from 'clsx';
import { Check, Sparkles } from 'lucide-react';
import type { AssessmentMode } from '../modes/assessmentModes';

const accentClasses = {
  indigo: 'border-indigo-500/40 bg-indigo-500/5 group-hover:border-indigo-500/60',
  purple:
    'border-purple-500/40 bg-purple-500/5 group-hover:border-purple-500/60',
  emerald:
    'border-emerald-500/40 bg-emerald-500/5 group-hover:border-emerald-500/60',
  amber: 'border-amber-500/40 bg-amber-500/5 group-hover:border-amber-500/60',
  rose: 'border-rose-500/40 bg-rose-500/5 group-hover:border-rose-500/60',
};

const iconColorClasses = {
  indigo: 'text-indigo-600 dark:text-indigo-400',
  purple: 'text-purple-600 dark:text-purple-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  amber: 'text-amber-600 dark:text-amber-400',
  rose: 'text-rose-600 dark:text-rose-400',
};

interface AssessmentModeCardProps {
  mode: AssessmentMode;
  isSelected: boolean;
  onSelect: () => void;
}

export function AssessmentModeCard({
  mode,
  isSelected,
  onSelect,
}: AssessmentModeCardProps) {
  const Icon = mode.icon;
  const isClickable = mode.enabled;

  return (
    <button
      onClick={() => {
        if (isClickable) onSelect();
      }}
      disabled={!isClickable}
      className={clsx(
        'group relative flex flex-col gap-3 rounded-xl border-2 p-5 transition-all duration-200',
        'text-left',
        isClickable
          ? 'cursor-pointer'
          : 'cursor-not-allowed opacity-50',
        isSelected
          ? clsx(
              'border-2',
              mode.accent === 'indigo' && 'border-indigo-500 bg-indigo-500/10',
              mode.accent === 'purple' && 'border-purple-500 bg-purple-500/10',
              mode.accent === 'emerald' &&
                'border-emerald-500 bg-emerald-500/10',
              mode.accent === 'amber' && 'border-amber-500 bg-amber-500/10',
              mode.accent === 'rose' && 'border-rose-500 bg-rose-500/10'
            )
          : clsx(
              'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30',
              accentClasses[mode.accent as keyof typeof accentClasses]
            )
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Icon
          className={clsx(
            'h-6 w-6 flex-shrink-0',
            isClickable
              ? iconColorClasses[mode.accent as keyof typeof iconColorClasses]
              : 'text-slate-400 dark:text-slate-500'
          )}
        />
        {isSelected && (
          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {mode.label}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {mode.description}
        </p>
      </div>

      {mode.comingSoon && (
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 dark:bg-slate-700">
          <Sparkles className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Coming soon
          </span>
        </div>
      )}
    </button>
  );
}
