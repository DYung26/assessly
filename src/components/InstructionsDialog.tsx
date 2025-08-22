import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

interface InstructionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstructionsDialog({ open, onOpenChange }: InstructionDialogProps) {
  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-max">
        <DialogHeader>
          <DialogTitle>Instructions</DialogTitle>
          <DialogDescription>
            This is a simple instructions dialog. You can add your instructions here.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>1. Follow the steps carefully.</p>
          <p>2. Ensure you have all the necessary materials.</p>
          <p>3. Contact support if you have any questions.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
