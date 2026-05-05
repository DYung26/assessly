import { useEffect, useState } from "react";
import { PopoverContent } from "@/components/ui/popover";
import { Check, Plus } from "lucide-react";
import { InstructionsPopoverProps } from "@/types";

export function InstructionsPopover({ action, instructions }: InstructionsPopoverProps & { instructions?: string[] }) {
  const items = instructions || [
    "Mark and grade script",
    "Annotate this file",
    "Grade as absolute score and %",
    "Write detailed analysis",
    "Create a report",
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

  const clearSelected = () => {
    setSelected([]);
    action([]);
  };

  return (
    <PopoverContent
      side="bottom"
      align="start"
      className="w-56 sm:w-64 p-2 space-y-1"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm text-gray-900">Quick Instructions</h4>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={clearSelected}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Clear selected instructions"
          >
            Clear
          </button>
        )}
      </div>
      <div className="space-y-1.5">
        {items.map((item) => {
          const isSelected = selected.includes(item);
          return (
            <button
              key={item}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              aria-label={`${isSelected ? "Deselect" : "Select"} ${item}`}
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
