import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { mutationFn } from "@/lib/mutationFn";
import { queryClient } from "@/lib/queryClient";
import { useParams } from "next/navigation";

interface DeleteChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatId: string;
}

export function DeleteChatDialog(
  { open, onOpenChange, chatId }: DeleteChatDialogProps
) {
  const params = useParams();
  const assessmentId = params?.assessment_id as string;

  const deleteChatMutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      console.log("Chat deleted:", data);
      queryClient.invalidateQueries({
        queryKey: ["assessmentChats", assessmentId]
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Chat</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this chat? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" className="cursor-pointer" onClick={() => {
            deleteChatMutation.mutateAsync({
              url: `/chat/${chatId}`,
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
