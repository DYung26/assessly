"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatPromptBox from "@/components/ChatBox";
import ChatsList from "@/components/ChatsList";
import ContextDock from "@/components/ContextDock";
import PageLoader from "@/components/PageLoader";
import TypingHeader from "@/components/TypingHeader";
import { NewAssessmentDialog } from "@/components/NewAssessmentDialog";
import { AssessmentModeSwitcher } from "@/features/assessments/components/AssessmentModeSwitcher";
import { isAssessmentModeLocked } from "@/features/assessments/utils/assessmentModeLock";
import { getAssessmentModeContent } from "@/features/assessments/modes/assessmentModeContent";
import type { AssessmentModeId } from "@/features/assessments/modes/assessmentModes";
import { useAssessmentChats } from "@/lib/hooks/useChats";
import { useAssessment } from "@/lib/hooks/useAssessment";
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";
import { mutationFn } from "@/lib/mutationFn";
import { queryClient } from "@/lib/queryClient";
import { useChatStore } from "@/lib/store/chat";
import { useMutation } from "@tanstack/react-query";
import { use } from "react";
import { useAssessmentFiles } from "@/lib/hooks/useFiles";

type PageProps = {
  params: Promise<{ assessment_id: string }>;
}

export default function Assessment({ params }: PageProps) {
  useAuthRedirect();
  const { assessment_id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showNewAssessmentDialog, setShowNewAssessmentDialog] = useState(false);
  const [dialogInitialMode, setDialogInitialMode] = useState<AssessmentModeId | null>(null);
  
  const { data: chats = [] } = useAssessmentChats(assessment_id as string);
  const { data: assessment } = useAssessment(assessment_id as string);
  const { data: assessmentFiles = [] } = useAssessmentFiles(assessment_id);
  const { setPendingMessage, setPendingInstructions, setPendingFileIds } = useChatStore();

  useEffect(() => {
    if (assessment) {
      if (!assessment.mode) {
        router.push(`/assessment/${assessment_id}/setup`);
        return;
      }
      
      const locked = isAssessmentModeLocked({
        chats,
        assessmentFiles,
      });
      setIsLocked(locked);
      setIsLoading(false);
    }
  }, [assessment, chats, assessment_id, router]);

  const newChatMutation = useMutation({
    mutationFn: mutationFn,
    onMutate: () => setIsSubmitting(true),
    onSettled: () => setIsSubmitting(false),
    onSuccess: (data) => {
      console.log("New chat created:", data);
      queryClient.invalidateQueries({
        queryKey: ["chats", assessment_id]
      });
      const chatId = data.data.id;
      router.push(`/chat/${chatId}`);
    },
  });

  const updateModeMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['assessment', assessment_id],
      });
    },
  });

  const handleSend = async (
    userText: string = "", fileIds: string[] = [],
    instructions: string[] = []
  ) => {
    if (
      userText.trim().length === 0 &&
      fileIds.length === 0
    ) return;

    const initialMessage = userText + instructions.map(inst => `\n_- ${inst}_`).join('');
    console.log("Initial Message: ", initialMessage);

    newChatMutation.mutateAsync({
      url: "/chat",
      body: {
        assessment_id,
        initial_message: initialMessage,
      },
    });
    setPendingMessage(initialMessage);
    setPendingInstructions(instructions);
    setPendingFileIds(fileIds);
  }

  const handleModeChange = (modeId: AssessmentModeId) => {
    if (!isLocked) {
      updateModeMutation.mutate({
        url: `/assessment/${assessment_id}`,
        method: 'PUT',
        body: {
          mode: modeId,
        },
      });
    }
  };

  const handleCreateAssessmentInMode = (modeId: AssessmentModeId) => {
    setDialogInitialMode(modeId);
    setShowNewAssessmentDialog(true);
  };

  if (!assessment_id || isLoading) return null;

  const modeContent = getAssessmentModeContent(assessment?.mode as AssessmentModeId);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {assessment?.mode && (
        <>
          <div className="flex justify-center pt-4">
            <AssessmentModeSwitcher 
              selectedMode={assessment.mode as AssessmentModeId}
              isLocked={isLocked}
              isChanging={updateModeMutation.isPending}
              onModeChange={handleModeChange}
              onCreateAssessmentInMode={handleCreateAssessmentInMode}
            />
          </div>
          {chats && (
            <main
              className="flex flex-col flex-1 px-4 py-4 gap-4 items-center
                         justify-center"
            >
              <TypingHeader 
                headerTitles={modeContent.headerTitles}
                headerDescription={modeContent.headerDescription}
              />
              <ChatPromptBox 
                action={handleSend}
                quickInstructions={modeContent.quickInstructions}
              />
              <ContextDock uploadLabels={modeContent.uploadLabels} />
              <ChatsList chats={chats} />
            </main>
          )}
        </>
      )}
      <NewAssessmentDialog 
        open={showNewAssessmentDialog}
        onOpenChange={setShowNewAssessmentDialog}
        initialMode={dialogInitialMode || undefined}
        skipModeSetup={true}
      />
      {isSubmitting ? <PageLoader /> : null}
    </div>
  );
}
