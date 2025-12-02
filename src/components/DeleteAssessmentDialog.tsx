import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { mutationFn } from "@/lib/mutationFn";
import { queryClient } from "@/lib/queryClient";
import { useUser } from "@/lib/hooks/useUser";

interface NewAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentId: string;
}

export function DeleteAssessmentDialog(
  { open, onOpenChange, assessmentId }: NewAssessmentDialogProps
) {
  const { data: user } = useUser();

  const deleteAssessmentMutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      console.log("Assessment deleted:", data);
      queryClient.invalidateQueries({
        queryKey: ["assessments", user?.id || ""]
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Assessment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this assessment? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" className="cursor-pointer" onClick={() => {
            deleteAssessmentMutation.mutateAsync({
              url: `/assessment/${assessmentId}`,
              method: "DELETE",
            });
            onOpenChange(false);
          }}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
