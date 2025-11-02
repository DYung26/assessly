import { AssessmentOptionsPopoverProps } from "@/types";
import { PopoverContent } from "./ui/popover";

export function AssessmentOptionsPopover(
  { action }: AssessmentOptionsPopoverProps
) {
  return (
    <PopoverContent
      side="bottom"
      align="start"
      className="w-48 p-2"
    >
      <div className="flex flex-col gap-2">
      {["Edit", "Delete", "Duplicate", "Export"].map((option) => (
          <button
            key={option}
            onClick={() => action(option, "")}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
          >
            {option}
          </button>
        ))}
      </div>
    </PopoverContent>
  )
}

