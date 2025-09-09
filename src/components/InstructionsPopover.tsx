import { useEffect, useState } from "react";
import { PopoverContent } from "@/components/ui/popover";
import { Check, Plus } from "lucide-react";
import { InstructionsPopoverProps } from "@/types";

export function InstructionsPopover({ action }: InstructionsPopoverProps) {
  const items = [
    "Mark and grade script", // according to AQA guidelines",
    "Grade as absolute score and %",
    "Write detailed analysis on the answers",
    // "Suggest study topics",
    "Create a study plan",
    "Use emojis in this response"
  ];

  const [selected, setSelected] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  useEffect(() => {
    action(selected);
  }, [selected, action]);

  return (
    <PopoverContent
      side="bottom"
      align="end"
      // avoidCollisions={false}
      className="w-96 p-2 space-y-1"
    >
      <h4 className="font-medium text-gray-900">Instructions</h4>
      <p className="text-sm text-gray-500">
        Select the instructions you want to include:
      </p>
      <div className="space-y-2">
        {items.map((item) => {
          const isSelected = selected.includes(item);
          return (
            <button
              key={item}
              onClick={() => toggleItem(item)}
              className={`flex items-center gap-2 w-full text-left p-2 rounded-full transition cursor-pointer
                ${isSelected
                  ? "bg-blue-100 border border-blue-500"
                  : "border border-gray-300 hover:bg-gray-100"}`}
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
    </PopoverContent>
  );
}
