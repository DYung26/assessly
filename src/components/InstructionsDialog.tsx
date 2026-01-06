import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { APP_CONFIG } from "@/lib/config";

interface InstructionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (instructions: string) => void;
}

export function InstructionsDialog({ open, onOpenChange, onSave }: InstructionDialogProps) {
  const [instructions, setInstructions] = useState("");

  const handleSave = () => {
    onSave(instructions);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Instructions Manually</DialogTitle>
          <DialogDescription>
            Tailor the way {APP_CONFIG.ASSISTANT_NAME} responds to this assessment
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Type your instructions here..."
            className="min-h-[150px] resize-none"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button 
              className="cursor-pointer"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
