import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Check, Plus } from "lucide-react";

interface InstructionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const items = ["Mark and grade script", "Assign grade", "Analyse answers", "Suggest topics", "Plan study"];

export function InstructionsDialog({ open, onOpenChange }: InstructionDialogProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

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
          {items.map((item) => {
            const isSelected = selected.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggleItem(item)}
                className={`flex items-center gap-2 w-full text-left p-2 rounded-full cursor-pointer ${isSelected
                ? 'bg-blue-100 border-blue-500 hover:bg-blue-100'
                : 'border-gray-500 hover:bg-gray-100'}`}
              >
                {isSelected ? (
                  <Check className="text-blue-600" size={18} />
                ) : (
                  <Plus className="text-gray-500" size={18} />
                )}
                <span
                  className={`${
                    isSelected ? "text-blue-600 font-medium" : "text-gray-800"
                  }`}
                >
                  {item}
                </span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
