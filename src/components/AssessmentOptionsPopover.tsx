import { AssessmentOptionsPopoverProps } from "@/types";
import { PopoverContent } from "./ui/popover";

export function AssessmentOptionsPopover(
  { action, assessmentId, title }: AssessmentOptionsPopoverProps
) {
  return (
    <PopoverContent
      side="bottom"
      align="start"
      className="w-48 p-2"
    >
      <div className="flex flex-col gap-2">
      {["Rename", "Delete"].map((option) => (
          <button
            key={option}
            onClick={() => action(option, assessmentId, title)}
            className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
          >
            {option}
          </button>
        ))}
      </div>
    </PopoverContent>
  )
}

