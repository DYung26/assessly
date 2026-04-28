'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { ASSESSMENT_MODES } from '../modes/assessmentModes';
import type { AssessmentModeId } from '../modes/assessmentModes';
import { LockIcon, PlusIcon } from 'lucide-react';

interface AssessmentModeSwitcherProps {
  selectedMode: AssessmentModeId;
  isLocked: boolean;
  isChanging?: boolean;
  onModeChange?: (modeId: AssessmentModeId) => void;
  onCreateAssessmentInMode?: (modeId: AssessmentModeId) => void;
}

export function AssessmentModeSwitcher({
  selectedMode,
  isLocked,
  isChanging = false,
  onModeChange,
  onCreateAssessmentInMode,
}: AssessmentModeSwitcherProps) {
  const [sliderStyle, setSliderStyle] = useState<{
    left: string;
    width: string;
  }>({ left: '0', width: '0' });
  const [hoveredMode, setHoveredMode] = useState<AssessmentModeId | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const updateSlider = () => {
      const activeIndex = ASSESSMENT_MODES.findIndex(
        (mode) => mode.id === selectedMode
      );
      const activeButton = buttonRefs.current[activeIndex];

      if (activeButton && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();

        setSliderStyle({
          left: `${buttonRect.left - containerRect.left}px`,
          width: `${buttonRect.width}px`,
        });
      }
    };

    updateSlider();
    window.addEventListener('resize', updateSlider);
    return () => window.removeEventListener('resize', updateSlider);
  }, [selectedMode]);

  const handleModeClick = (modeId: AssessmentModeId) => {
    const mode = ASSESSMENT_MODES.find((m) => m.id === modeId);
    if (!mode) return;

    if (!mode.enabled) {
      toast.info('Coming soon', {
        description: `${mode.label} will be available soon.`,
      });
      return;
    }

    if (isLocked) {
      if (modeId === selectedMode) {
        return;
      }
      if (onCreateAssessmentInMode) {
        onCreateAssessmentInMode(modeId);
      }
      return;
    }

    if (onModeChange) {
      onModeChange(modeId);
    }
  };

  const getButtonTooltip = (mode: typeof ASSESSMENT_MODES[0]): string => {
    if (mode.id === selectedMode) {
      if (isLocked) {
        return `This assessment is locked to ${mode.label} because activity has started.`;
      }
      return mode.label;
    }

    if (!mode.enabled) {
      return 'Coming soon';
    }

    if (isLocked) {
      return `Create a new assessment for ${mode.label}`;
    }

    return `Switch to ${mode.label}`;
  };

  return (
    <div className="relative inline-flex items-center">
      <div
        ref={containerRef}
        className="relative inline-flex items-center rounded-full bg-slate-100 p-1 dark:bg-slate-800"
      >
        <div
          className={clsx(
            'absolute rounded-full transition-all duration-300',
            isLocked
              ? 'bg-indigo-500 dark:bg-indigo-600'
              : 'bg-white shadow-sm dark:bg-slate-700'
          )}
          style={{
            left: sliderStyle.left,
            width: sliderStyle.width,
            top: '0.25rem',
            bottom: '0.25rem',
          }}
        />

        {ASSESSMENT_MODES.map((mode, index) => (
          <div
            key={mode.id}
            className="relative z-20"
            onMouseEnter={() => setHoveredMode(mode.id)}
            onMouseLeave={() => setHoveredMode(null)}
          >
            <button
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              onClick={() => handleModeClick(mode.id)}
              disabled={!mode.enabled && isLocked}
              className={clsx(
                'relative rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-1',
                selectedMode === mode.id
                  ? isLocked
                    ? 'text-white dark:text-slate-100'
                    : 'text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 dark:text-slate-400',
                !mode.enabled && 'cursor-not-allowed opacity-60',
                mode.enabled &&
                  selectedMode !== mode.id &&
                  !isLocked &&
                  'hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer',
                mode.enabled &&
                  selectedMode !== mode.id &&
                  isLocked &&
                  'hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer'
              )}
              title={getButtonTooltip(mode)}
            >
              {selectedMode === mode.id && isLocked && (
                <LockIcon size={12} className="flex-shrink-0 opacity-70" />
              )}
              <span>{mode.shortLabel}</span>
              {mode.comingSoon && (
                <span className="text-xs opacity-60 flex-shrink-0">•</span>
              )}
              {isLocked &&
                mode.enabled &&
                selectedMode !== mode.id &&
                (hoveredMode === mode.id || typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) && (
                  <PlusIcon
                    size={14}
                    className="flex-shrink-0 opacity-70 transition-all duration-200 text-blue-500 dark:text-blue-400" />
                )}
            </button>
          </div>
        ))}
      </div>
      
      {isChanging && (
        <div className="ml-3 flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent dark:border-slate-100 dark:border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
