import { useEffect, useState } from "react";
import { PopoverContent } from "@/components/ui/popover";
import { Check, Plus } from "lucide-react";
import { InstructionsPopoverProps } from "@/types";

export function InstructionsPopover({ action }: InstructionsPopoverProps) {
  const items = [
    "Mark and grade script",
    "Grade as absolute score and %",
    "Write detailed analysis",
  ];

  const [selected, setSelected] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  useEffect(() => {
    action(selected);
  }, [selected, action]);

  return (
    <PopoverContent
      side="bottom"
      align="start"
      className="w-64 p-2 space-y-1"
    >
      <h4 className="font-medium text-sm text-gray-900">Quick Instructions</h4>
      <div className="space-y-1.5">
        {items.map((item) => {
          const isSelected = selected.includes(item);
          return (
            <button
              key={item}
              onClick={() => toggleItem(item)}
              className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg transition cursor-pointer text-sm
                ${isSelected
                  ? "bg-blue-100 border border-blue-500"
                  : "border border-gray-300 hover:bg-gray-100"}`}
            >
              {isSelected ? (
                <Check className="text-blue-600" size={16} />
              ) : (
                <Plus className="text-gray-500" size={16} />
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
