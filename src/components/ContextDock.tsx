import { FilePlus2, Pencil } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import MarkingSchemeModal from "./MarkingSchemeModal";
import { InstructionsDialog } from "./InstructionsDialog";
import { APP_CONFIG } from "@/lib/config";
import { mutationFn } from "@/lib/mutationFn";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useUser } from "@/lib/hooks/useUser";

export default function ContextDock () {
  const params = useParams();
  const {  data: user } = useUser();
  const assessmentId = params?.assessment_id as string;
  const [markingSchemeModalOpen, setMarkingSchemeModalOpen] = useState(false);
  const [instructionsDialogOpen, setInstructionsDialogOpen] = useState(false);

  const updateAssessmentMutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      console.log("Assessment updated:", data);
      queryClient.invalidateQueries({
        queryKey: ["assessments", user?.id || ""]
      });
    },
  });

  const handleInstructionsSave = (custom_instruction: string) => {
    console.log("Custom Instructions saved:", custom_instruction);
    updateAssessmentMutation.mutate({
      url: `/assessment/${assessmentId}`,
      method: "PUT",
      body: { custom_instruction },
    });
  };

  return (
    <div className="flex justify-between max-w-3xl w-full gap-16">
      <div
        onClick={() => setMarkingSchemeModalOpen(true)}
        className="flex-1 flex justify-between items-center gap-4 p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm cursor-pointer text-black"
      >
        <div className="flex flex-col text-left">
          <span className="text-sm font-medium">Upload marking scheme</span>
          <span className="text-xs text-gray-500">Supported documents & code files</span>
        </div>

        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
          <FilePlus2 size={18} />
        </div>
      </div>

      <div
        onClick={() => setInstructionsDialogOpen(true)}
        className="flex-1 flex justify-between items-center p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm cursor-pointer text-black"
      >
        <div className="flex flex-col text-left">
          <span className="text-sm font-medium">Add custom instructions</span>
          <span className="text-xs text-gray-500">Tailor the way {APP_CONFIG.ASSISTANT_NAME} responds to this assessment</span>
        </div>
        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
          <Pencil size={18} />
        </div>
      </div>

      <MarkingSchemeModal
        open={markingSchemeModalOpen}
        onOpenChange={setMarkingSchemeModalOpen}
        assessmentId={assessmentId}
      />

      <InstructionsDialog
        open={instructionsDialogOpen}
        onOpenChange={setInstructionsDialogOpen}
        onSave={handleInstructionsSave}
      />
    </div>
  );
}
