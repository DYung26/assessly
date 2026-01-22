import { FilePlus2, Pencil } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import MarkingSchemeModal from "./MarkingSchemeModal";
import { InstructionsDialog } from "./InstructionsDialog";
import { APP_CONFIG } from "@/lib/config";
import { mutationFn } from "@/lib/mutationFn";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useUser } from "@/lib/hooks/useUser";
import axiosInstance from "@/lib/axiosInstance";

export default function ContextDock () {
  const params = useParams();
  const {  data: user } = useUser();
  const assessmentId = params?.assessment_id as string;
  const [markingSchemeModalOpen, setMarkingSchemeModalOpen] = useState(false);
  const [instructionsDialogOpen, setInstructionsDialogOpen] = useState(false);

  const { data: filesData } = useQuery({
    queryKey: ["assessment-files", assessmentId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/assessment/${assessmentId}/files`);
      return res.data.data.files || [];
    },
    enabled: !!assessmentId,
  });

  const { data: assessmentData } = useQuery({
    queryKey: ["assessment-detail", assessmentId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/assessment/${assessmentId}`);
      return res.data.data;
    },
    enabled: !!assessmentId,
  });

  const updateAssessmentMutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      console.log("Assessment updated:", data);
      queryClient.invalidateQueries({
        queryKey: ["assessments", user?.id || ""]
      });
      queryClient.invalidateQueries({
        queryKey: ["assessment-detail", assessmentId]
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

  const markingSchemeCount = filesData?.length || 0;
  const hasCustomInstructions = !!(assessmentData?.custom_instruction && assessmentData.custom_instruction.trim());

  return (
    <div className="flex justify-between max-w-3xl w-full gap-16">
      <div
        onClick={() => setMarkingSchemeModalOpen(true)}
        className={`flex-1 relative flex justify-between items-center gap-4 p-3 rounded-lg shadow-sm cursor-pointer text-black transition-colors ${
          markingSchemeCount > 0
            ? "bg-blue-50 hover:bg-blue-100 border border-blue-300"
            : "bg-white hover:bg-gray-100 border border-gray-300"
        }`}
      >
        <div className="flex flex-col text-left">
          <span className="text-sm font-medium">Upload marking scheme</span>
          <span className="text-xs text-gray-500">Supported documents & code files</span>
        </div>

        <div className="flex items-center gap-2">
          {markingSchemeCount > 0 && (
            <div className="flex items-center justify-center min-w-6 h-6 bg-blue-600 text-white text-xs font-semibold rounded-full px-1.5">
              {markingSchemeCount}
            </div>
          )}
          <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
            <FilePlus2 size={18} />
          </div>
        </div>
      </div>

      <div
        onClick={() => setInstructionsDialogOpen(true)}
        className={`flex-1 flex justify-between items-center p-3 rounded-lg shadow-sm cursor-pointer text-black transition-colors ${
          hasCustomInstructions
            ? "bg-amber-50 hover:bg-amber-100 border border-amber-300"
            : "bg-white hover:bg-gray-100 border border-gray-300"
        }`}
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
        initialValue={assessmentData?.custom_instruction || ""}
      />
    </div>
  );
}
